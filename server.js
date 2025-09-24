import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const app = express();
const port = 3000;

// --- Conexão com o banco de dados (fora da rota) ---
const db = new Pool({
  connectionString: process.env.URL_BD,
});

let dbStatus = "ok";
try {
  await db.query("SELECT 1");
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
} catch (e) {
  dbStatus = e.message;
  console.error("Erro na conexão com o banco de dados:", dbStatus);
}
// --- Fim da conexão ---

app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");
  res.json({
    message: "API para atividade",
    author: "Daniely dos Santos Silva",
    statusBD: dbStatus,
  });
});

app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada");
  try {
    const resultado = await db.query("SELECT * FROM questoes");
    const dados = resultado.rows;
    res.json(dados);
  } catch (e) {
    console.error("Erro ao buscar questões:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as questões",
    });
  }
});

app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});