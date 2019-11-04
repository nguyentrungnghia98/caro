import React from 'react';
import './Login.scss';
import LoginForm from './LoginForm';
import Container from '@material-ui/core/Container';

interface Props {
  type?: string;
}

const Login: React.FC<Props> = props => {
  return (
    <Container maxWidth="xs">
      <div id="fundo" className="absolute-center-container">
        <div className="circle-outline"></div>
        <div className="circle-outline"></div>
        <div className="circle-outline"></div>
        <LoginForm type={props.type} />
      </div>
    </Container>
  );
};

export default Login;
