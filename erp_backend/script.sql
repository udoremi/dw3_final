CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    cpf_cnpj VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    logradouro VARCHAR(100),
    numero VARCHAR(20),
    complemento VARCHAR(50),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    uf VARCHAR(30),
    cep VARCHAR(15),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estoque_atual INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pendente',
    valor_total NUMERIC(10, 2) DEFAULT 0.00,
    observacoes TEXT,

    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE itens_pedido (
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario NUMERIC(10, 2) NOT NULL,
    
    CONSTRAINT pk_itens_pedido PRIMARY KEY (id_pedido, id_produto),
    
    CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
        
    CONSTRAINT fk_item_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
    username VARCHAR(10) UNIQUE,
    password TEXT,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (username, password) VALUES
('admin', crypt('admin', gen_salt('bf'))),
('qwe', crypt('qwe', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;