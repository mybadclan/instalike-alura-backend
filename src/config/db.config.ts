import { MongoClient } from "mongodb";

export async function connectWithMongoDb(mongoUrl: string) {
  try {
    const mongoClient = new MongoClient(mongoUrl);

    console.log("Conectando ao cluster do banco de dados...");
    await mongoClient.connect();
    console.log("Conectado ao cluster do banco de dados com sucesso!");

    return mongoClient;
  } catch (err) {
    console.error("Falha na conexão com o banco!", err);
    process.exit();
  }
}