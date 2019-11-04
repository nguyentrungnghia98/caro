import React, { useEffect, useState } from 'react';
import Login from './Login/Login';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { State } from '../reducers/index';
import Profile from './Profile/Profile';
import { ProtectedRoute } from './ProtectedRoute';
import Alert from './Alert/Alert';
import './App.scss';
import CaroOption from './CaroOption/CaroOption';
import OnePlayerContainer from './Caro/OnePlayer/OnePlayerContainer';
import TwoPlayerContainer from './Caro/TwoPlayer/TwoPlayerContainer';
import { fetchUser } from '../actions/user';
import User from '../apis/user';

const App: React.FC = (props: any) => {
  const { isSignedIn, fetchUser } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataUser = async (): Promise<void> => {
      try {
        setLoading(true);
        const userToken = localStorage.getItem('userToken');
        const response = await User.get('/user/me', {
          headers: { Authorization: userToken }
        });
        console.log('res', response);
        fetchUser(response.data);
        setLoading(false);
      } catch (err) {
        console.log('err', err);
        setLoading(false);
      }
    };
    fetchDataUser();
    // eslint-disable-next-line
  }, []);

  function redirect(): any {
    return isSignedIn ? <Redirect to="/profile" /> : <Redirect to="/caro" />;
  }

  const LoginForm: React.FC = (props: any) => <Login type="Sign In" />;
  const RegisterForm: React.FC = (props: any) => <Login type="Sign Up" />;

  return (
    <div>
      {loading ? (
        <div className="splash">
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>
      ) : (
        <>
          <CssBaseline />
          <Router history={history}>
            <Switch>
              <Route path="/" exact render={() => redirect()}></Route>
              <Route path="/caro" exact component={CaroOption}></Route>
              <Route
                path="/caro/1-player"
                exact
                component={OnePlayerContainer}
              ></Route>
              <ProtectedRoute
                path="/caro/2-player"
                isAuthenticated={isSignedIn}
                exact
                component={TwoPlayerContainer}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/profile"
                isAuthenticated={isSignedIn}
                exact
                component={Profile}
              ></ProtectedRoute>
              <Route path="/login" exact component={LoginForm}></Route>
              <Route path="/register" exact component={RegisterForm}></Route>
            </Switch>
            <Alert />
          </Router>
        </>
      )}
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
  {
    fetchUser
  }
)(App);
