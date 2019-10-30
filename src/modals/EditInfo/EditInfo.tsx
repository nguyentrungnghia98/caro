import React, { Fragment, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  makeStyles,
  Tabs,
  Tab,
  TextField,
  CircularProgress
} from '@material-ui/core';
import { connect } from 'react-redux';
import { State } from '../../reducers/index';
import { closeEditInfoModal } from './EditInfoAction';
import './EditInfo.scss';
import { fetchUser } from '../../actions/user';
import { openAlertError } from '../../actions/alert';
import User from '../../apis/user';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 312,
    width: 560
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 280
  },
  tab: {
    '& > div': {
      padding: '8px 20px 0'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  }
}));

const EditInfo: React.FC = (props: any) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { toggle, closeEditInfoModal, user, fetchUser, openAlertError } = props;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadSaveDone, setLoadSaveDone] = useState(true);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    if (user) {
      console.log('user', user);
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  async function updateUserInfo(data: any): Promise<void> {
    try {
      setLoadSaveDone(false);
      const userToken = localStorage.getItem('userToken');
      const response = await User.put('/user/me', data, {
        headers: { Authorization: userToken }
      });
      console.log('res', response);
      fetchUser(response.data);
      setLoadSaveDone(true);
    } catch (error) {
      setLoadSaveDone(true);
      let message = 'Save changes failed!';
      if (error.response.data.message) message = error.response.data.message;
      openAlertError('Failed', message);
    }
  }

  function handleInfoSubmit(e: any): void {
    e.preventDefault();
    const data = {
      name,
      phone,
      address
    };
    console.log('info', data);
    updateUserInfo(data);
  }

  function handlePasswordSubmit(e: any): void {
    e.preventDefault();
    const data = {
      password,
      newPassword
    };
    console.log('password', data);
    updateUserInfo(data);
  }

  return (
    <Dialog open={toggle} className="edit-modal">
      <button
        type="button"
        className="btn btn--close"
        onClick={closeEditInfoModal}
      >
        <div>x</div>
      </button>
      <DialogContent className="card custom-card">
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label="Edit Info" {...a11yProps(0)} />
            <Tab label="Change Password" {...a11yProps(1)} />
          </Tabs>
          <TabPanel className={classes.tab} value={value} index={0}>
            <form onSubmit={handleInfoSubmit}>
              <TextField
                className={classes.textField}
                label="Name"
                margin="normal"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <TextField
                className={classes.textField}
                label="Phone"
                margin="normal"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <TextField
                className={classes.textField}
                label="Adress"
                margin="normal"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <div className="actions">
                <button className="btn btn__edit">
                  {loadSaveDone ? (
                    'Save changes'
                  ) : (
                    <CircularProgress size={26} />
                  )}
                </button>
              </div>
            </form>
          </TabPanel>
          <TabPanel className={classes.tab} value={value} index={1}>
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                className={classes.textField}
                label="Password"
                margin="normal"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <TextField
                className={classes.textField}
                label="New Password"
                margin="normal"
                type="password"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  if (e.target.value !== confirmPassword) {
                    setDisableButton(true);
                  } else {
                    setDisableButton(false);
                  }
                }}
                required
              />
              <TextField
                className={classes.textField}
                label="Confirm New Password"
                margin="normal"
                value={confirmPassword}
                type="password"
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== newPassword) {
                    setDisableButton(true);
                  } else {
                    setDisableButton(false);
                  }
                }}
              />
              <div className="actions">
                <button className="btn btn__edit" disabled={disableButton}>
                  {loadSaveDone ? (
                    'Save changes'
                  ) : (
                    <CircularProgress size={26} />
                  )}
                </button>
              </div>
            </form>
          </TabPanel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state: State) => {
  return {
    toggle: state.editInfo,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  {
    closeEditInfoModal,
    fetchUser,
    openAlertError
  }
)(EditInfo);
