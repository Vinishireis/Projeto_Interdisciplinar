const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auth_system",
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

// Configuração do nodemailer (envio de e-mails)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "seuemail@gmail.com", // Substitua pelo seu e-mail
    pass: "suasenha", // Substitua pela sua senha
  },
});

// Rota para cadastro de usuários
app.post("/signup", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    // Verificar se o e-mail já está cadastrado
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    await db.promise().query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Rota para login de usuários
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o e-mail existe
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "E-mail não encontrado." });
    }

    const usuario = rows[0];

    // Verificar se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // Retornar uma resposta de sucesso sem token
    res.status(200).json({ message: "Login bem-sucedido!", usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Rota para solicitar redefinição de senha
app.post("/esqueci-senha", async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar se o e-mail existe
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "E-mail não encontrado." });
    }

    const usuario = rows[0];

    // Gerar token
    const token = crypto.randomBytes(20).toString("hex");
    const dataExpiracao = new Date(Date.now() + 3600000); // Token expira em 1 hora

    // Salvar token no banco de dados
    await db.promise().query(
      "INSERT INTO tokens_recuperacao (usuario_id, token, data_expiracao) VALUES (?, ?, ?)",
      [usuario.id, token, dataExpiracao]
    );

    // Enviar e-mail com o link de redefinição
    const resetLink = `http://localhost:5173/redefinir-senha?token=${token}`;
    const mailOptions = {
      from: "seuemail@gmail.com",
      to: email,
      subject: "Redefinição de Senha",
      text: `Clique no link para redefinir sua senha: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erro ao enviar e-mail:", error);
        return res.status(500).json({ message: "Erro ao enviar e-mail." });
      }
      res.status(200).json({ message: "E-mail de redefinição enviado com sucesso!" });
    });
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Rota para redefinir a senha
app.post("/redefinir-senha", async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    // Verificar se o token é válido
    const [tokenRows] = await db.promise().query(
      "SELECT * FROM tokens_recuperacao WHERE token = ? AND data_expiracao > NOW()",
      [token]
    );

    if (tokenRows.length === 0) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    const usuarioId = tokenRows[0].usuario_id;

    // Criptografar a nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha do usuário
    await db.promise().query("UPDATE usuarios SET senha = ? WHERE id = ?", [senhaHash, usuarioId]);

    // Excluir o token após a redefinição
    await db.promise().query("DELETE FROM tokens_recuperacao WHERE token = ?", [token]);

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});