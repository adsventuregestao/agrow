import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';

function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState({});
  const [formaPagamento, setFormaPagamento] = useState('Pix');
  const [entrega, setEntrega] = useState('Retirada');

  useEffect(() => {
    axios.get('http://localhost:3000/loja/produtos').then((res) => setProdutos(res.data));
  }, []);

  const handleComprar = (produtoId) => {
    axios.post('http://localhost:3000/loja/venda', {
      produto_id: produtoId,
      quantidade: quantidade[produtoId] || 1,
      forma_pagamento: formaPagamento,
      entrega,
    }).then(() => {
      alert('Compra realizada!');
      axios.get('http://localhost:3000/loja/produtos').then((res) => setProdutos(res.data));
    });
  };

  return (
    <div>
      <h2>Loja Online</h2>
      {produtos.map((produto) => (
        <Card key={produto.id} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6">{produto.nome}</Typography>
            <Typography>Preço: R${produto.preco}</Typography>
            <Typography>Quantidade: {produto.quantidade}</Typography>
            <TextField
              label="Quantidade"
              type="number"
              value={quantidade[produto.id] || ''}
              onChange={(e) => setQuantidade({ ...quantidade, [produto.id]: e.target.value })}
            />
            <Button onClick={() => handleComprar(produto.id)} variant="contained" style={{ marginTop: '10px' }}>
              Comprar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Loja;