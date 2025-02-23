CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único do usuário
    nome VARCHAR(100) NOT NULL,         -- Nome do usuário
    email VARCHAR(100) NOT NULL UNIQUE, -- E-mail (único para cada usuário)
    senha VARCHAR(255) NOT NULL,        -- Senha (armazenada como hash)
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data de criação do usuário
);