import express from "express";
import { Db } from "mongodb";
import multer from "multer";
import fs from "node:fs";

import { createPost, deletePost, findAllPosts, findPostById, updatePost } from "../models/post.model.ts";
import { generateDescriptionWithGemini } from "../services/geminiService.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ dest: "./uploads", storage });

export const postRoute = (app: express.Express, db: Db) => {
  app.get("/posts", async (req, res) => {
    const posts = await findAllPosts(db);
    res.status(200).json(posts);
  });

  app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const post = await findPostById(db, id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post não encontrado" });
    }
  });

  app.post("/posts", async (req, res) => {
    try {
      const body = req.body;
      const createdPost = await createPost(db, body);

      res.status(201).json(createdPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/posts/upload", upload.single("image"), async (req, res) => {
     try {
      const body = req.body;

      console.log(req.file.filename)

      const createdPost = await createPost(db, { ...body, imageUrl: req.file.filename });

      const updatedImage = `uploads/${createdPost.insertedId}.jpeg`;
      fs.renameSync(req.file.path, updatedImage);

      res.status(201).json(createdPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }   
  });

  app.put("/posts/upload/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const imageUrl = `http://localhost:3000/${id}.jpeg`
    try {
      const imageBuffer = fs.readFileSync(`uploads/${id}.jpeg`);
      const description = await generateDescriptionWithGemini(imageBuffer);
      const updatedBody = { ...body, description, imageUrl };
      const updatedPost = await updatePost(db, id, updatedBody);

      res.status(201).json(updatedPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })

  app.delete("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const deletedPost = await deletePost(db, id);

    res.status(200).json(deletedPost);
  })
}