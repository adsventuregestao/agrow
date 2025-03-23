import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

function Plantacao() {
  const [covas, setCovas] = useState('');
  const [sementesPorCova, setSementesPorCova] = useState('');
  const [produto, setProduto] = useState('');

  const handleSubmit = () => {
    axios.post('http://localhost:3000/plantacao', {
      covas,
      sementes_por_cova: sementesPorCova,
      produto,
      data_plantio: new Date().toISOString(),
    }).then(() => {
      setCovas('');
      setSementesPorCova('');
      setProduto('');
      alert('Plantação cadastrada!');
    });
  };

  return (
    <div>
      <h2>Nova Plantação</h2>
      <TextField label="Quantidade de Covas" value={covas} onChange={(e) => setCovas(e.target.value)} fullWidth />
      <TextField label="Sementes por Cova" value={sementesPorCova} onChange={(e) => setSementesPorCova(e.target.value)} fullWidth />
      <TextField label="Produto" value={produto} onChange={(e) => setProduto(e.target.value)} fullWidth />
      <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>Cadastrar</Button>
    </div>
  );
}

export default Plantacao;