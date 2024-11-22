import cors from "cors";
import express from "express";

import { connectWithMongoDb } from "./src/config/db.config.ts";
import { postRoute } from "./src/routes/post.route.ts";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

const app = express();
const databaseClient = await connectWithMongoDb(process.env.MONGO_URL);
const db = databaseClient.db("imersao-insta-like");

app.use(express.json());
app.use(cors(corsOptions));

app.use(express.static("uploads"));

postRoute(app, db);

app.listen(3000, () => {
  console.log("server listen at http://localhost:3000");
});