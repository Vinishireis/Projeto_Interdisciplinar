const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost", // Ou o endereço do seu banco de dados
  user: "root",      // Usuário do MySQL
  password: "",      // Senha do MySQL
  database: "auth_system", // Nome do banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

// Rota de cadastro
app.post("/signup", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verificar se o e-mail já está cadastrado
  const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
  if (rows.length > 0) {
    return res.status(400).json({ message: "E-mail já cadastrado." });
  }

  // Criptografar a senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Inserir novo usuário no banco de dados
  await db.promise().query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senhaHash]
  );

  res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Verificar se o e-mail existe
  const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
  if (rows.length === 0) {
    return res.status(400).json({ message: "E-mail ou senha incorretos." });
  }

  // Verificar a senha
  const usuario = rows[0];
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(400).json({ message: "E-mail ou senha incorretos." });
  }

  res.status(200).json({ message: "Login bem-sucedido!", usuario });
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});