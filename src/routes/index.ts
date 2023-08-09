import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { checkGifExists } from "../middleware/gifExist";
import Gif from "../models/Gif";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const router = express.Router();
const upload = multer();


// Start route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "hello!",
  });
});

// Route to get GIFs from Cloudinary
router.get("/images/:name.gif", checkGifExists, async (req: any, res) => {
  try {
    const cloudinaryUrl = `${process.env.CLOUD_URL}${req.gif.name}.gif`;
    const response = await axios.get(cloudinaryUrl, {
      responseType: "stream",
    });
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching GIF:", error);
    res.status(500).send("Error fetching GIF.");
  }
});

// Route to get random GIFs from a category
router.get("/random/:category", async (req, res) => {
  const { category } = req.params;
  let query = {};
  if (category) {
    query = { category: category };
  }
  const count = await Gif.countDocuments(query);
  if (count === 0) {
    return res.status(404).send("No GIFs found.");
  }
  const randomIndex = Math.floor(Math.random() * count);
  const randomGif = await Gif.findOne(query).skip(randomIndex);

  res.json({
    source: randomGif?.source,
    category: randomGif?.category,
    image: `http://localhost:3000/images/${randomGif?.name}.gif`,
  });
});

router.get("/upload", (req, res) => {
  res.render("upload");
});

// Route to upload a new GIF
router.post("/upload", upload.single("gif"), async (req, res) => {
  const { category, source } = req.body;
  const data = req.file?.buffer;
  if (!data) {
    return res.status(400).json({ error: "Invalid GIF upload." });
  }

  try {
    await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          format: "gif",
          folder: "anime-gifs",
        },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Error uploading GIF to Cloudinary." });
          }

          const name = result?.public_id.split("/")[1];
          const gif = new Gif({ category, name, source });
          await gif.save();

          res
            .status(201)
            .json({ message: "GIF uploaded and saved successfully." });
        }
      )
      .end(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while uploading GIF." });
  }
});

export default router;
