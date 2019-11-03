import React, { Fragment } from 'react';
import './CaroOption.scss';
import Topbar from '../Topbar/Topbar';
import { Paper, Card, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const CaroOption: React.FC = (props: any) => {
  return (
    <Fragment>
      <Topbar />
      <div className="caro-option">
        <Paper className="caro-option__wrapper">
          <Card className="caro-option__content">
            <Typography
              className="caro-option__title"
              variant="h5"
              component="h2"
            >
              Select Mode
            </Typography>
            <Link to="/caro/1-player">
              <button className="btn btn__nav">One Player Game</button>
            </Link>
            <Link to="/caro/2-player">
              <button className="btn btn__nav">Two Players Game</button>
            </Link>
          </Card>
        </Paper>
      </div>
    </Fragment>
  );
};

export default CaroOption;
