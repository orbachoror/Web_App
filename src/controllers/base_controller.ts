import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const filter = { ...req.query };
    try {
      const data = await this.model.find(filter as Partial<T>);
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const date = await this.model.findById(id);
      if (date) {
        res.send(date);
      } else {
        res.status(404).send("item not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  async createItem(req: Request, res: Response) {
    const _id = req.query.userId;
    try {
      const data = await this.model.create({
        ...req.body,
        owner: _id
      });
      res.status(201).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    console.log("the id is  " + id);
    try {
      const deleteedPost = await this.model.deleteOne({ _id: id });
      if (deleteedPost.deletedCount === 0) {
        res.status(400).send({ message: "Post not found" });
      }
      else res.status(200).send("item deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  }



  async updateItemById(req: Request, res: Response) {
    const id = req.params.id;
    const updateData = req.body;

    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updatedItem) {
        return res.status(401).json({ message: "Item not found" });
      }

      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

const createController = <T>(model: Model<T>) => {
  return new BaseController(model);
}
export default createController;
