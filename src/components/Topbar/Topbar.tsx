import React from 'react';
import {
  Grid,
  Toolbar,
  AppBar,
  withStyles,
  Container
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import styles, { Style } from './TopbarStyle';
import MENU, { Menu } from '../menu';
import { State } from '../../reducers';
import { connect } from 'react-redux';
import { logOut } from '../../actions/user';

const Topbar: React.FC = (props: any) => {
  const {
    classes,
    isSignedIn,
    logOut
  }: { classes: Style; isSignedIn: boolean; logOut: any } = props;
  console.log('props', props);

  function currentTab(): number {
    const currentLocation = window.location.pathname;
    return MENU.findIndex((el: Menu) => {
      return el.pathname === currentLocation;
    });
  }

  return (
    <AppBar color="default" className={classes.topBar}>
      <Container maxWidth="md">
        <Toolbar>
          <Grid container>
            <Grid item xs={12} className={classes.topBarContent}>
              <Link to="/" className={classes.navBarLogo}>
                <img width={25} src={logo} alt="" />
                <span>Caro</span>
              </Link>
              <div className={classes.navItems}>
                {MENU.map((item, index) => (
                  <Link
                    to={item.pathname}
                    key={index}
                    className={
                      classes.navItem +
                      ' ' +
                      (index === currentTab() ? classes.active : '')
                    }
                  >
                    {item.label}
                  </Link>
                ))}

                {isSignedIn ? (
                  <div className={classes.navItem} onClick={logOut}>
                    Logout
                  </div>
                ) : (
                  <Link to="/login" className={classes.navItem}>
                    Login
                  </Link>
                )}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state: State) => {
  return {
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(
  mapStateToProps,
  { logOut }
)(withStyles(styles)(Topbar));
