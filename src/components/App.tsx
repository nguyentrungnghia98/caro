import React from 'react';
import Login from './Login/Login';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { State } from '../reducers/index';
import Profile from './Profile/Profile';
import { ProtectedRoute } from './ProtectedRoute';
import Alert from './Alert/Alert';
import CaroContainer from './Caro/CaroContainer';
import './App.scss';
import CaroOption from './CaroOption/CaroOption';

const App: React.FC = (props: any) => {
  const { isSignedIn } = props;

  function redirect(): any {
    return isSignedIn ? <Redirect to="/profile" /> : <Redirect to="/caro" />;
  }

  return (
    <div>
      <CssBaseline />
      <Router history={history}>
        <Switch>
          <Route path="/" exact render={() => redirect()}></Route>
          <Route path="/caro" exact component={CaroOption}></Route>
          <Route path="/caro/single" exact component={CaroContainer}></Route>
          <ProtectedRoute
            path="/profile"
            exact
            component={Profile}
          ></ProtectedRoute>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/register" exact component={Login}></Route>
        </Switch>
        <Alert />
      </Router>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(
  mapStateToProps,
  {}
)(App);
