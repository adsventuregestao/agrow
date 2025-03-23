import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/insumos').then((res) => setInsumos(res.data));
  }, []);

  const handleSubmit = () => {
    axios.post('http://localhost:3000/insumos', {
      nome,
      quantidade,
      tipo,
      data_entrada: new Date().toISOString(),
    }).then(() => {
      setNome('');
      setQuantidade('');
      setTipo('');
      axios.get('http://localhost:3000/insumos').then((res) => setInsumos(res.data));
    });
  };

  return (
    <div>
      <h2>Controle de Insumos</h2>
      <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <TextField label="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      <TextField label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
      <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>Adicionar</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Tipo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {insumos.map((insumo) => (
            <TableRow key={insumo.id}>
              <TableCell>{insumo.nome}</TableCell>
              <TableCell>{insumo.quantidade}</TableCell>
              <TableCell>{insumo.tipo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Insumos;