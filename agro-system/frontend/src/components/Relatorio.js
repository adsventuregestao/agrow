import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function Relatorio() {
  const [plantacaoId, setPlantacaoId] = useState('');
  const [relatorio, setRelatorio] = useState(null);

  const handleGerar = () => {
    axios.get(`http://localhost:3000/relatorio/${plantacaoId}`).then((res) => setRelatorio(res.data));
  };

  return (
    <div>
      <h2>Gerar Relatório</h2>
      <TextField label="ID da Plantação" value={plantacaoId} onChange={(e) => setPlantacaoId(e.target.value)} />
      <Button onClick={handleGerar} variant="contained" style={{ marginTop: '10px' }}>Gerar</Button>
      {relatorio && (
        <div>
          <Typography variant="h6">Relatório para {relatorio.plantacao.produto}</Typography>
          {relatorio.passos.map((passo, index) => (
            <Typography key={index}>{`${passo.etapa}: ${passo.descricao}`}</Typography>
          ))}
          <Typography>Clima Atual: {relatorio.clima.temperature}°C</Typography>
        </div>
      )}
    </div>
  );
}

export default Relatorio;