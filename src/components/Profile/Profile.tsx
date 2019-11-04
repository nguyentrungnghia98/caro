import React, { useState, Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers/index';
import User from '../../apis/user';
import Imgur from '../../apis/imgur';
import { fetchUser } from '../../actions/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Profile.scss';
import Topbar from '../Topbar/Topbar';
import { Paper, Card, CardContent, Typography } from '@material-ui/core';
import { openAlertError } from '../../actions/alert';
import { openEditInfoModal } from '../../modals/EditInfo/EditInfoAction';
import EditInfo from '../../modals/EditInfo/EditInfo';

const Profile: React.FC = (props: any) => {
  const { user, fetchUser, openAlertError, openEditInfoModal } = props;
  const [loadImageDone, setLoadImageDone] = useState(true);
  const fileInput = useRef(null);

  async function updateAvatar(url: string) {
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await User.put(
        '/user/me',
        { avatar: url },
        {
          headers: { Authorization: userToken }
        }
      );
      console.log('res', response);
      fetchUser(response.data);
      setLoadImageDone(true);
    } catch (err) {
      console.log('err', err);
      setLoadImageDone(true);
      openAlertError('Failed', 'Save url image failed!');
    }
  }

  async function getUrlImage(formData: any) {
    const clientId = '4f3c3547ebbfe10';
    let url = '';
    try {
      setLoadImageDone(false);
      const response = await Imgur.post('', formData, {
        headers: {
          Authorization: 'Client-ID ' + clientId
        }
      });
      console.log(response);
      url = response.data.data.link;
    } catch (err) {
      console.log({ err });
      setLoadImageDone(true);
      return openAlertError('Failed', 'Get url image failed!');
    }

    updateAvatar(url);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const current: any = fileInput!.current;
    const files = current.files;
    if (!files.length) {
      return openAlertError('Error', 'Please select file!');
    }
    const formData = new FormData();
    formData.append('image', files[0]);
    console.log('file', files);
    getUrlImage(formData);
  }

  return (
    <Fragment>
      <Topbar />
      <div className="profile">
        <Paper className="profile--wrapper">
          <Card className="profile--content">
            <div className="image-wrapper">
              {!loadImageDone ? (
                <CircularProgress className="image-spinner" size={30} />
              ) : (
                <div className="uploadOverlay">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <input
                    type="file"
                    className="uploadImage"
                    ref={fileInput}
                    onChange={handleFileChange}
                  />
                </div>
              )}
              <img
                alt="avatar"
                src={
                  user && user.avatar
                    ? user.avatar
                    : 'https://i.imgur.com/6RUJRyM.png'
                }
                className={!loadImageDone ? 'opacity-spinner' : ''}
              />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {user ? user.name : ''}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {user ? user.email : ''}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {user ? user.phone : ''}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {user ? user.address : ''}
              </Typography>
            </CardContent>
            <button className="btn btn__edit" onClick={openEditInfoModal}>
              Edit Info
            </button>
          </Card>
        </Paper>
      </div>

      <EditInfo />
    </Fragment>
  );
};

const mapStateToProp = (state: State) => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProp,
  {
    fetchUser,
    openAlertError,
    openEditInfoModal
  }
)(Profile);
