import React, { useState, Fragment } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CssTextField from './CssTextField';
import { connect } from 'react-redux';
import { signIn } from '../../actions/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { State } from '../../reducers/index';
import User from '../../apis/user';
import { FormValueLogin } from '../../actions';
import {
  closeAlert,
  openAlertSuccess,
  openAlertError
} from '../../actions/alert';
import history from '../../history';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const LoginForm = (props: any) => {
  const { type, signIn, openAlertSuccess, openAlertError, closeAlert } = props;
  const [loading, setLoading] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const isSignIn = type === 'Sign In';

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value, name } = event.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
    }
  }

  function validFormInput(): boolean {
    let check = true;
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      if (error.email !== '') setError({ ...error, email: '' });
    } else {
      setError({ ...error, email: 'Invalid email!' });
      check = false;
    }
    return check;
  }

  function handleClickRegisterAlert() {
    console.log('handleClickRegisterAlert');
    closeAlert();
    history.push('/login');
  }

  async function callApi(): Promise<void> {
    try {
      setLoading(true);
      const url = `/user/${isSignIn ? 'login' : 'register'}`;
      const data: FormValueLogin = { email, password };
      if (type === 'Sign Up') data.name = name;

      const response = await User.post(url, data);
      setLoading(false);
      if (isSignIn) {
        signIn(response.data);
      } else {
        openAlertSuccess(
          'Success',
          'You have successfully registered! Please Login to continue'
        );
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
      if (isSignIn) {
        openAlertError('Failed', `Wrong email or password!`);
      } else {
        let message = 'Register failed!';
        if (error.response.data.message) message = error.response.data.message;
        openAlertError('Failed', message);
      }
    }
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    if (validFormInput()) {
      //call api
      callApi();
    }
  }

  async function handleLoginSocial(data: any): Promise<void> {
    try {
      setLoadingSocial(true);
      const url = `/user/login-social`;
      const response = await User.post(url, data);
      setLoadingSocial(false);
      signIn(response.data);
    } catch (error) {
      console.log({ error });
      setLoadingSocial(false);
      let message = 'Login failed!';
      if (error.response.data.message) message = error.response.data.message;
      openAlertError('Failed', message);
    }
  }

  function responseFacebook(response: any): void {
    console.log(response);
    const data = {
      email: response.email,
      name: response.name,
      facebookId: response.id,
      provider: 'facebook'
    };
    handleLoginSocial(data);
  }

  function responseGoogle(response: any): void {
    console.log(response);
    const data = {
      email: response.profileObj.email,
      name: response.profileObj.name,
      provider: 'google',
      googleId: response.googleId
    };
    handleLoginSocial(data);
  }

  return (
    <div className="login__container">
      <Typography component="h1" variant="h5" className="login__header">
        {type}
      </Typography>
      <div className="login__social">
        <FacebookLogin
          appId="463259067622314"
          cssClass="btn btn__facebook"
          textButton="Facebook"
          fields="name,email,picture"
          callback={responseFacebook}
          isDisabled={loadingSocial}
        />

        <GoogleLogin
          clientId="539505129187-ljgthsrvlg6l9h66v1o4kuatelduv6bv.apps.googleusercontent.com"
          render={(renderProps: any) => (
            <button className="btn btn__google" onClick={renderProps.onClick}>
              Google
            </button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          disabled={loadingSocial}
        />
      </div>
      <form className="login__form" autoComplete="off" onSubmit={handleSubmit}>
        {!isSignIn && (
          <CssTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus={!isSignIn}
            onChange={handleChange}
            value={name}
          />
        )}
        <input
          type="email"
          name="email"
          id="prevent_autofill"
          style={{ display: 'none' }}
        />
        <input
          type="password"
          name="password"
          id="password_fake"
          style={{ display: 'none' }}
        />
        <CssTextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email"
          autoFocus={isSignIn}
          error={error.email === '' ? false : true}
          helperText={error.email}
          onChange={handleChange}
          value={email}
        />

        <CssTextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          onChange={handleChange}
          value={password}
        />
        {isSignIn && (
          <FormControlLabel
            className="remenber"
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="btn-login"
          disabled={loading}
        >
          {loading ? <CircularProgress size={30} /> : type}
        </Button>
        <div className="login__bottom">
          {isSignIn && (
            <Fragment>
              <Link to="/login" className="link">
                Forgot password?
              </Link>
              <Link to="/register" className="link">
                {"Don't have an account? Sign Up"}
              </Link>
            </Fragment>
          )}
          {!isSignIn && (
            <Fragment>
              <div></div>
              <Link to="/login" className="link">
                Back to Sign In.
              </Link>
            </Fragment>
          )}
        </div>
      </form>
    </div>
  );
};

const mapStateToProp = (state: State) => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProp,
  { signIn, openAlertSuccess, openAlertError, closeAlert }
)(LoginForm);
