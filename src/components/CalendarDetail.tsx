import React, { FC, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Button, Modal } from '@material-ui/core'
import { AuthContext } from '../App';


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 5
  },
}));

type CalendarDetailProps = {
  title: string,
  description: string,
  id: number,
  open: boolean,
  username: string,
  start: Date,
  end: Date,
  OpenDetailClose: Function,
  onDelete: Function
}

const CalendarDetail: FC<CalendarDetailProps> = ({ title, id, description, open, OpenDetailClose, start, end, username, onDelete }) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const userLogged = useContext(AuthContext);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2>{title}</h2>
      <p className="modal-time">
      </p>
      <p id="simple-modal-description">
        {description}
      </p>
      <p>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '5px' }}>
        <PersonIcon style={{ fontSize: '16px' }} />{username}  <DateRangeIcon style={{ fontSize: '16px', marginLeft: '10px' }} /> {Moment(start).format('DD-MM-yyyy')} -  {Moment(end).format('DD-MM-yyyy')}
      </div>
      {userLogged === username && <span style={{ fontSize: '11px' }}>You own this event<br /></span>}
      {userLogged === username && <Button style={{ marginTop: '10px' }} variant="contained" color="secondary" onClick={() => onDelete(id)}>Delete</Button>}
    </div >
  );

  return (
    <Modal
      open={open}
      onClose={() => OpenDetailClose()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
export default CalendarDetail;