const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
app.use(express.json());

// Configuração do Banco de Dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rotas
app.post('/insumos', async (req, res) => {
  const { nome, quantidade, tipo, data_entrada } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO insumos (nome, quantidade, tipo, data_entrada) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, quantidade, tipo, data_entrada]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar insumo' });
  }
});

app.get('/insumos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insumos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar insumos' });
  }
});

app.post('/plantacao', async (req, res) => {
  const { covas, sementes_por_cova, produto, data_plantio } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO plantacoes (covas, sementes_por_cova, produto, data_plantio) VALUES ($1, $2, $3, $4) RETURNING *',
      [covas, sementes_por_cova, produto, data_plantio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar plantação' });
  }
});

app.get('/relatorio/:plantacaoId', async (req, res) => {
  const { plantacaoId } = req.params;
  try {
    const plantacao = await pool.query('SELECT * FROM plantacoes WHERE id = $1', [plantacaoId]);
    const clima = await axios.get('http://api.climatempo.com.br/api/v1/weather/locale/3477/current', {
      params: { token: process.env.CLIMATEMPO_TOKEN }
    });
    const passos = [
      { etapa: 'Preparação do Solo', descricao: 'Arar e adubar conforme o produto.' },
      { etapa: 'Plantio', descricao: `Plantar ${plantacao.rows[0].sementes_por_cova} sementes em ${plantacao.rows[0].covas} covas.` },
      { etapa: 'Irrigação', descricao: `Temperatura atual: ${clima.data.temperature}°C. Irrigar às 17h se seco.` },
      { etapa: 'Colheita', descricao: 'Aguardar 90 dias (ajustar por produto).' },
    ];
    res.json({ plantacao: plantacao.rows[0], clima: clima.data, passos });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

app.post('/produtos', async (req, res) => {
  const { nome, quantidade, preco, data_colheita } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, quantidade, preco, data_colheita) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, quantidade, preco, data_colheita]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

app.get('/loja/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos WHERE quantidade > 0');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

app.post('/loja/venda', async (req, res) => {
  const { produto_id, quantidade, forma_pagamento, entrega } = req.body;
  try {
    const produto = await pool.query('SELECT * FROM produtos WHERE id = $1', [produto_id]);
    if (produto.rows[0].quantidade < quantidade) {
      return res.status(400).json({ error: 'Quantidade insuficiente' });
    }
    await pool.query(
      'INSERT INTO vendas (produto_id, quantidade, forma_pagamento, entrega) VALUES ($1, $2, $3, $4)',
      [produto_id, quantidade, forma_pagamento, entrega]
    );
    await pool.query('UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2', [quantidade, produto_id]);
    res.status(201).json({ message: 'Venda registrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));