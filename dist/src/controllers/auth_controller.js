"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTestMiddleware = void 0;
const user_models_1 = __importDefault(require("../models/user_models"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("Email and password are required");
        return;
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_models_1.default.create({
            email: email,
            password: hashedPassword
        });
        res.status(200).send(user);
        return;
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
const generateTokens = (_id) => {
    const random = Math.floor(Math.random() * 1000000);
    if (!process.env.TOKEN_SECRET) {
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return { token: token, refreshToken: refreshToken };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("Email and password are required");
        return;
    }
    try {
        const user = yield user_models_1.default.findOne({ email: email });
        if (!user) {
            res.status(400).send("Wrong email or password");
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(400).send("Wrong email or password");
            return;
        }
        //generate a token
        const tokens = generateTokens(user._id);
        if (!tokens) {
            res.status(400).send("missing auth configuration");
            return;
        }
        if (user.refreshToken == null) {
            user.refreshToken = [];
            yield user.save();
        }
        else {
            user.refreshToken.push(tokens.refreshToken);
            yield user.save();
        }
        res.status(200).send({
            token: tokens.token,
            email: user.email,
            _id: user._id,
            refreshToken: tokens.refreshToken
        });
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
    ;
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("Refresh token is required");
        return;
    }
    //first validate the refresh token
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send("Invalid refresh token");
            return;
        }
        const payload = data;
        try {
            const user = yield user_models_1.default.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("Invalid refresh token");
                return;
            }
            if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                res.status(400).send("Invalid refresh token");
                user.refreshToken = [];
                yield user.save();
                return;
            }
            user.refreshToken = user.refreshToken.filter((token) => token != refreshToken);
            yield user.save();
            res.status(200).send("Logged out");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (err) {
            res.status(400).send("invalid refresh token");
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validate the refresh token
    const refereshToken = req.body.refreshToken;
    if (!refereshToken) {
        res.status(400).send("Refresh token is required");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refereshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send("Invalid refresh token");
            return;
        }
        //find the user
        const payload = data;
        try {
            const user = yield user_models_1.default.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("Invalid refresh token");
                return;
            }
            //check that the refresh token exist in the user
            if (!user.refreshToken || !user.refreshToken.includes(refereshToken)) {
                user.refreshToken = [];
                yield user.save();
                res.status(400).send("Invalid refresh token");
                return;
            }
            //generate a new access token
            const newTokens = generateTokens(user._id);
            if (!newTokens) {
                user.refreshToken = [];
                yield user.save();
                res.status(400).send("missing auth configuration");
                return;
            }
            //generate a new refresh token
            user.refreshToken = user.refreshToken.filter((token) => token != refereshToken);
            //save the new refresh token in the user
            user.refreshToken.push(newTokens.refreshToken);
            yield user.save();
            //return the new access token and refresh token
            res.status(200).send({
                token: newTokens.token,
                refreshToken: newTokens.refreshToken
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (err) {
            res.status(400).send("Invalid refresh token");
        }
    }));
});
const authTestMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send("Access denied");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Token secret is not defined");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(402).send("Invalid token");
            return;
        }
        req.query.userId = payload._id;
        next();
    });
};
exports.authTestMiddleware = authTestMiddleware;
exports.default = {
    register,
    login,
    logout,
    refresh
};
//# sourceMappingURL=auth_controller.js.map