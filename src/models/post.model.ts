import { Db, ObjectId } from "mongodb";

type Post = {
  _id: ObjectId;
  description: string;
  imageUrl: string;
  alt: string;
}

export const findAllPosts = (db: Db) => {
  const collection = db.collection<Post>("posts");
  return collection.find<Post>({}).toArray();
}

export const findPostById = (db: Db, id: string) => {
  const collection = db.collection<Post>("posts");
  return collection.findOne<Post>({ _id: new ObjectId(id) });
}

type PostBody = {
  description: string;
  imageUrl: string;
  alt: string;
}

export const createPost = (db: Db, body: PostBody) => {
  const collection = db.collection<PostBody>("posts");
  return collection.insertOne(body);
}

export const updatePost = (db: Db, id: string, body: PostBody) => {
  const collection = db.collection<PostBody>("posts");
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: body });
}

export const deletePost = (db: Db, id: string) => {
  const collection = db.collection<Post>("posts");
  return collection.deleteOne({ _id: new ObjectId(id) });
}
