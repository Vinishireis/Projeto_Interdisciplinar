require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Limitação de requisições para evitar ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: "Muitas requisições. Tente novamente mais tarde."
});
app.use(limiter);

// Configuração do banco de dados
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido." });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

// Cadastro de usuário
app.post("/signup", async (req, res) => {
  try {
    let { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    if (!validator.isEmail(email)) return res.status(400).json({ message: "E-mail inválido." });
    if (senha.length < 8) return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres." });

    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "E-mail já cadastrado." });

    const senhaHash = await bcrypt.hash(senha, 10);
    await db.promise().query("INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)", [nome, email, senhaHash, tipo]);
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Login de usuário
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "E-mail não encontrado." });

    const usuario = rows[0];
    if (!await bcrypt.compare(senha, usuario.senha)) return res.status(400).json({ message: "Senha incorreta." });

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Esqueci minha senha
app.post("/esqueci-senha", async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "E-mail não encontrado." });

    const token = crypto.randomBytes(20).toString("hex");
    const dataExpiracao = new Date(Date.now() + 3600000);
    await db.promise().query("INSERT INTO tokens_recuperacao (usuario_id, token, data_expiracao) VALUES (?, ?, ?)", [rows[0].id, token, dataExpiracao]);

    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha",
      html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`
    });
    res.status(200).json({ message: "E-mail de redefinição enviado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar a solicitação." });
  }
});

// Rota protegida para desenvolvedores
app.get("/rota-restrita", verifyToken, (req, res) => {
  if (req.user.tipo !== "desenvolvedor") return res.status(403).json({ message: "Acesso negado." });
  res.status(200).json({ message: `Bem-vindo, ${req.user.nome}!` });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
