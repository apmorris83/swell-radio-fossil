import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useSelector } from 'react-redux';

import Nav from './features/nav/Nav.js';
import Auth from './features/auth/Auth.js';
import Spends from './features/spends/Spends.js';
import History from './features/history/History.js';
import { selectAuthenticated } from './features/auth/authSlice.js';

function App() {
  const authenticated = useSelector(selectAuthenticated);
  const AuthenticatedRoute = ({ children, ...props }) => {
    return (
      <Route
        {...props}
        render={({ location }) =>
          authenticated ? (
            children
          ) : (
            <Redirect to={{ pathname: '/', state: { from: location } }} />
          )
        }
      />
    );
  };
  return (
    <Container>
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
      </Router>
    </Container>
  );
}

export default App;
