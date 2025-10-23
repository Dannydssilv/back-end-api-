import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();
const { Pool } = pkg;
let pool = null;

app.use(express.json());

function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}

app.get("/questoes", async (req, res) => {
  const db = conectarBD();
  try {
    const resultado = await db.query("SELECT * FROM questoes");
    const dados = resultado.rows;
    res.json(dados);
  } catch (e) {
    console.error("Erro ao buscar questões:", e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.get("/questoes/:id", async (req, res) => {
  console.log(
    "getTest/questoes/:https://sturdy-space-happiness-97wvx96j5w55hx66q-3000.app.github.dev/"
  );
  try {
    const id = req.params.id;
    const db = conectarBD();
    const consulta = "SELECT * FROM questoes WHERE id = $1";
    const resultado = await db.query(consulta, [id]);
    const dados = resultado.rows;
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" });
    }
    res.json(dados);
  } catch (e) {
    console.error("Erro ao buscar questão:", e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");
  const db = conectarBD();
  let dbStatus = "ok";
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }
  res.json({
    mensagem: "API para Questões de Prova",
    autor: "Daniely dos Santos Silva",
    dbStatus: dbStatus,
  });
});

app.delete("/questoes/:id", async (req, res) => {
  console.log("Rota DELETE /questoes/:id solicitada");
  try {
    const id = req.params.id;
    const db = conectarBD();
    let consulta = "SELECT * FROM questoes WHERE id = $1";
    let resultado = await db.query(consulta, [id]);
    let dados = resultado.rows;
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" });
    }
    consulta = "DELETE FROM questoes WHERE id = $1";
    resultado = await db.query(consulta, [id]);
    res.status(200).json({ mensagem: "Questão excluida com sucesso!!" });
  } catch (e) {
    console.error("Erro ao excluir questão:", e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.post("/questoes", async (req, res) => {
  console.log("Rota POST /questoes solicitada");
  try {
    const data = req.body;
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem: "Todos os campos (enunciado, disciplina, tema, nivel) são obrigatórios.",
      });
    }
    const db = conectarBD();
    const consulta =
      "INSERT INTO questoes (enunciado,disciplina,tema,nivel) VALUES ($1,$2,$3,$4) ";
    const questao = [data.enunciado, data.disciplina, data.tema, data.nivel];
    const resultado = await db.query(consulta, questao);
    res.status(201).json({ mensagem: "Questão criada com sucesso!" });
  } catch (e) {
    console.error("Erro ao inserir questão:", e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.put("/questoes/:id", async (req, res) => {
  console.log("Rota PUT /questoes solicitada");
  try {
    const id = req.params.id;
    const db = conectarBD();
    let consulta = "SELECT * FROM questoes WHERE id = $1";
    let resultado = await db.query(consulta, [id]);
    let questao = resultado.rows;
    if (questao.length === 0) {
      return res.status(404).json({ message: "Questão não encontrada" });
    }
    const data = req.body;
    data.enunciado = data.enunciado || questao[0].enunciado;
    data.disciplina = data.disciplina || questao[0].disciplina;
    data.tema = data.tema || questao[0].tema;
    data.nivel = data.nivel || questao[0].nivel;
    consulta =
      "UPDATE questoes SET enunciado = $1, disciplina = $2, tema = $3, nivel = $4 WHERE id = $5";
    resultado = await db.query(consulta, [
      data.enunciado,
      data.disciplina,
      data.tema,
      data.nivel,
      id,
    ]);
    res.status(200).json({ message: "Questão atualizada com sucesso!" });
  } catch (e) {
    console.error("Erro ao atualizar questão:", e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.listen(port, () => {
  console.log(`Serviço rodando na porta:  ${port}`);
});