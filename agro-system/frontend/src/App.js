import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Insumos from './components/Insumos';
import Plantacao from './components/Plantacao';
import Relatorio from './components/Relatorio';
import Loja from './components/Loja';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static" style={{ backgroundColor: '#4caf50' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>AgroWeb</Typography>
          <Button color="inherit" component={Link} to="/">Insumos</Button>
          <Button color="inherit" component={Link} to="/plantacao">Plantação</Button>
          <Button color="inherit" component={Link} to="/relatorio">Relatório</Button>
          <Button color="inherit" component={Link} to="/loja">Loja</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ padding: '20px' }}>
        <Switch>
          <Route exact path="/" component={Insumos} />
          <Route path="/plantacao" component={Plantacao} />
          <Route path="/relatorio" component={Relatorio} />
          <Route path="/loja" component={Loja} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;