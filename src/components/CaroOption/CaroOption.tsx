import React, { Fragment } from 'react';
import './CaroOption.scss';
import Topbar from '../Topbar/Topbar';
import { Paper, Card, CardContent } from '@material-ui/core';
import history from '../../history';
const CaroOption: React.FC = (props: any) => {
  return (
    <Fragment>
      <Topbar />
      <div className="caro-option">
        <Paper className="caro-option__wrapper">
          <Card className="caro-option__content">
            <CardContent></CardContent>
            <button className="btn btn__edit">Edit Info</button>
          </Card>
        </Paper>
      </div>
    </Fragment>
  );
};

export default CaroOption;
