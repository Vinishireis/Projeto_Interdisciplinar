CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único do token
    usuario_id INT NOT NULL,            -- ID do usuário associado ao token
    token VARCHAR(255) NOT NULL,        -- Token gerado
    tipo ENUM('recuperacao', 'verificacao') NOT NULL, -- Tipo de token
    data_expiracao DATETIME NOT NULL,   -- Data de expiração do token
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);