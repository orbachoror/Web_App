import {Request,Response, NextFunction} from 'express';
import userModel from '../models/user_models';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register= async (req:Request, res:Response)=>{
    const email =req.body.email;
    const password=req.body.password;
    if (!email || !password){
        res.status(400).send("Email and password are required");
        return;
    }
    try{
        const salt=await bycrypt.genSalt(10);
        const hashedPassword=await bycrypt.hash(password,salt);
        const user=await userModel.create({
            email:email,
            password: hashedPassword
        });
        res.status(200).send(user);
        return;
    }catch(err){
        res.status(400).send(err);
        return;
    }
};



const generateTokens =(_id:string):{token:string,refreshToken:string}=>{
const random= Math.floor(Math.random()*1000000);
    if (!process.env.TOKEN_SECRET){
    return;
    }
    const token=jwt.sign(
    {
    _id:_id,
    random:random
    },
    process.env.TOKEN_SECRET,
    {expiresIn:process.env.TOKEN_EXPIRATION});

    const refreshToken=jwt.sign(
    {
    _id:_id,
    random:random
    },

    process.env.TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRATION});

    return {token:token,refreshToken:refreshToken};
};



const login= async (req:Request, res:Response)=>{
    const email =req.body.email;
    const password=req.body.password;
    if (!email || !password){
        res.status(400).send("Email and password are required");
        return;
    }
    try{
        const user=await userModel.findOne({email:email});
        if (!user){
            res.status(400).send("Wrong email or password");
            return;
        }
        const validPassword=await bycrypt.compare(password,user.password);
        if (!validPassword){
            res.status(400).send("Wrong email or password");
            return;
        }
       
        //generate a token
        const tokens=generateTokens(user._id);
        if(!tokens){
            res.status(400).send("missing auth configuration");
            return;
        }

        if(user.refreshToken== null){
            user.refreshToken=[];
            await user.save();
        }
        else
        {
            user.refreshToken.push(tokens.refreshToken);               
            await user.save();
        }
            
        res.status(200).send({
            token:tokens.token,
            email:user.email,
            _id:user._id,
            refreshToken:tokens.refreshToken        
        });
    }catch(err){
         res.status(400).send(err);
         return;
        };      
};

type TokenPayload={
    _id:string;
};


const logout= async (req:Request, res:Response)=>{
    const refreshToken=req.body.refreshToken;
    if (!refreshToken){
        res.status(400).send("Refresh token is required");
        return;
    }

    //first validate the refresh token
    if(!process.env.TOKEN_SECRET){
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refreshToken,process.env.TOKEN_SECRET,async(err:unknown,data:unknown)=>{
        if (err){
            res.status(403).send("Invalid refresh token");
            return;
        }
        const payload=data as TokenPayload;
        try{
            const user=await userModel.findOne({_id:payload._id});
            if (!user){
                res.status(400).send("Invalid refresh token");
                return;
            }
            if(!user.refreshToken || !user.refreshToken.includes(refreshToken)){
                res.status(400).send("Invalid refresh token");
                user.refreshToken=[];
                await user.save();
                return;
            }
            user.refreshToken=user.refreshToken.filter((token)=>token !=refreshToken);       
            await user.save();
            res.status(200).send("Logged out");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(err){
            res.status(400).send("invalid refresh token");
        }
    });
};

const refresh= async (req:Request, res:Response)=>{
    //validate the refresh token
    const refereshToken=req.body.refreshToken;
    if (!refereshToken){
        res.status(400).send("Refresh token is required");
        return;
    }
    if(!process.env.TOKEN_SECRET){
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refereshToken,process.env.TOKEN_SECRET,async(err:unknown,data:unknown)=>{
        if (err){
            res.status(403).send("Invalid refresh token");
            return;
        }  
    //find the user
        const payload=data as TokenPayload;
        try{
            const user=await userModel.findOne({_id:payload._id});
            if (!user){
                res.status(400).send("Invalid refresh token");
                return;
            }
                //check that the refresh token exist in the user
            if(!user.refreshToken || !user.refreshToken.includes(refereshToken)){
                user.refreshToken=[];
                await user.save();
                res.status(400).send("Invalid refresh token");
                return;
            }
            //generate a new access token

            const newTokens=generateTokens(user._id);
            if (!newTokens){
                user.refreshToken=[];
                await user.save();
                res.status(400).send("missing auth configuration");
                return;
            }
                
            //generate a new refresh token
            user.refreshToken=user.refreshToken.filter((token)=>token !=refereshToken);
            
            //save the new refresh token in the user
            user.refreshToken.push(newTokens.refreshToken);
            await user.save();

            //return the new access token and refresh token
            res.status(200).send({
                token:newTokens.token,
                refreshToken:newTokens.refreshToken
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(err){
            res.status(400).send("Invalid refresh token");
        }
    });
};




export const authTestMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader=req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token){
        res.status(401).send("Access denied");
        return;
    }
    if (!process.env.TOKEN_SECRET){
        res.status(400).send("Token secret is not defined");
        return;
    }
    jwt.verify(token,process.env.TOKEN_SECRET,(err,payload: TokenPayload)=>{
        if (err){
            res.status(402).send("Invalid token");
            return;
        }
        req.query.userId=payload._id;
        next();
    });
};


export default {
    register,
    login,
    logout,
    refresh
};