CREATE DATABASE agrodb;

\c agrodb;

CREATE TABLE insumos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  quantidade INTEGER,
  tipo VARCHAR(50),
  data_entrada TIMESTAMP
);

CREATE TABLE plantacoes (
  id SERIAL PRIMARY KEY,
  covas INTEGER,
  sementes_por_cova INTEGER,
  produto VARCHAR(100),
  data_plantio TIMESTAMP
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  quantidade INTEGER,
  preco DECIMAL(10, 2),
  data_colheita TIMESTAMP
);

CREATE TABLE vendas (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER,
  forma_pagamento VARCHAR(50),
  entrega VARCHAR(50),
  data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);