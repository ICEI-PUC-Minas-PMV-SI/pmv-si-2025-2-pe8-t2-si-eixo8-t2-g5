CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'cliente',
    plano_servicos INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);

INSERT INTO usuarios (
    nome, 
    email, 
    senha, 
    tipo, 
    plano_servicos, 
    created_at
) VALUES (
    'Admin', 
    'admin@email.com', 
    '$2a$12$TDIKjJh77Pxb/ESazISa.eMEiA8T75RG1kj/cXy6mhA26JFzXl9JS',
    'Avulso', 
    NULL,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    min_price NUMERIC(10, 2) DEFAULT 0.00,
    duration_minutes INTEGER DEFAULT 60
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    nome_cliente VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    servico INTEGER NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente',
    pagamento VARCHAR(50) DEFAULT 'Pendente',
    
    CONSTRAINT fk_servico
        FOREIGN KEY (servico) 
        REFERENCES services(id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos (data_hora);

CREATE TABLE IF NOT EXISTS historico_servicos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    data DATE NOT NULL,
    servico VARCHAR(255) NOT NULL,
    profissional VARCHAR(255),
    preco NUMERIC(10, 2) NOT NULL,
    
    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico_servicos (usuario_id);

CREATE TABLE IF NOT EXISTS horarios_configuracao (
    periodo VARCHAR(50) PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

INSERT INTO horarios_configuracao (periodo, hora_inicio, hora_fim, ativo) VALUES 
('manha', '08:00:00', '12:00:00', TRUE)
ON CONFLICT (periodo) DO NOTHING;

INSERT INTO horarios_configuracao (periodo, hora_inicio, hora_fim, ativo) VALUES 
('tarde', '13:00:00', '18:00:00', TRUE)
ON CONFLICT (periodo) DO NOTHING;

INSERT INTO horarios_configuracao (periodo, hora_inicio, hora_fim, ativo) VALUES 
('noite', '18:00:00', '22:00:00', TRUE)
ON CONFLICT (periodo) DO NOTHING;