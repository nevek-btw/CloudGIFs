import { Request, Response, NextFunction} from "express"
import Gif from "../models/Gif";


export const checkGifExists = async (req: any, res: Response, next: NextFunction) => {
  const { name } = req.params;
  const gif = await Gif.findOne({ name }).lean();
  if (!gif) {
    return res.status(404).send("GIF not found.");
  }
  req.gif = gif;
  next();
};
