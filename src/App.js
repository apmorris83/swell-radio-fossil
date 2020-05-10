import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useSelector } from 'react-redux';

import Nav from './features/nav/Nav.js';
import Add from './features/global/Add.js';
import Auth from './features/auth/Auth.js';
import Spends from './features/global/Spends.js';
import History from './features/global/History.js';
import { selectAuthenticated } from './features/auth/authSlice.js';

function App() {
  const authenticated = useSelector(selectAuthenticated);
  const AuthenticatedRoute = ({ children, ...props }) => {
    return <Route {...props} render={({ location }) => (authenticated ? children : <Redirect to={{ pathname: '/', state: { from: location } }} />)} />;
  };
  return (
    <Container style={{ marginBottom: '60px' }}>
      <Router>
        <Nav />
        <Switch>
          <Route exact path='/'>
            <Auth />
          </Route>
          <AuthenticatedRoute path='/spends'>
            <Spends />
          </AuthenticatedRoute>
          <AuthenticatedRoute path='/history'>
            <History />
          </AuthenticatedRoute>
        </Switch>
        <Add />
      </Router>
    </Container>
  );
}

export default App;
