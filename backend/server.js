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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
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
  password: process.env.DB_PASS || "", // Se não tiver senha, usa string vazia
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Define a porta
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

// Middleware para verificar token JWT e tipo de usuário
const verifyToken = (allowedTypes) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido." });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Verifica se o tipo de usuário é permitido
    if (allowedTypes && !allowedTypes.includes(decoded.tipo)) {
      return res.status(403).json({ message: "Acesso negado. Tipo de usuário não permitido." });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

// Login de usuário
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifique se o usuário existe
    const [rows] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const user = rows[0];

    // Verifique a senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Gere o token JWT
    const token = jwt.sign(
      { id: user.id, nome: user.nome, tipo: user.tipo }, // Inclua o tipo de usuário
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Defina um tempo de expiração
    );

    // Retorne os dados do usuário
    res.status(200).json({
      message: "Login bem-sucedido",
      nome: user.nome,
      tipo: user.tipo,
      token // Retorna o token para o frontend
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

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
app.get("/rota-restrita", verifyToken(["desenvolvedor"]), (req, res) => {
  res.status(200).json({ message: `Bem-vindo, ${req.user.nome}!` });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor." });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


const handleSubmit = async (e) => {
  e.preventDefault();
  setErro("");

  // Validações no frontend
  if (!isLogin && senha !== confirmarSenha) {
    setErro("As senhas não coincidem!");
    return;
  }

  if (!validarEmail(email)) {
    setErro("E-mail inválido.");
    return;
  }

  if (!validarSenha(senha)) {
    setErro("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
    return;
  }

  if (!isLogin && !validarNome(nome)) {
    setErro("O nome não pode conter números ou caracteres especiais.");
    return;
  }

  // Sanitização dos dados
  const sanitizedNome = validator.escape(nome);
  const sanitizedEmail = validator.normalizeEmail(email);
  const sanitizedSenha = validator.escape(senha);

  const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
  const data = isLogin
    ? { email: sanitizedEmail, senha: sanitizedSenha }
    : { nome: sanitizedNome, email: sanitizedEmail, senha: sanitizedSenha, tipo };

  try {
    const response = await axios.post(url, data);
    console.log("Resposta do servidor:", response.data);

    if (isLogin) {
      alert("Login bem-sucedido!");
      // Armazena o nome do usuário e o token no localStorage
      localStorage.setItem("userName", response.data.nome);
      localStorage.setItem("userType", response.data.tipo);
      localStorage.setItem("token", response.data.token); // Armazena o token
      console.log("Nome armazenado:", response.data.nome);
      console.log("Tipo de usuário:", response.data.tipo);
      console.log("Token armazenado:", response.data.token);

      // Redireciona para a tela de início
      navigate("/");
    } else {
      alert("Cadastro bem-sucedido!");
      // Armazena o nome do usuário no localStorage após o cadastro
      localStorage.setItem("userName", sanitizedNome);
      console.log("Nome armazenado:", sanitizedNome);
      setIsLogin(true); // Alternar para a tela de login
    }
  } catch (error) {
    console.error("Erro:", error.response?.data || error.message);
    setErro(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");

    if (isLogin) {
      setTentativasLogin(tentativasLogin + 1);
      if (tentativasLogin >= 3) {
        setErro("Muitas tentativas de login. Tente novamente mais tarde.");
        return;
      }
    }
  }
};