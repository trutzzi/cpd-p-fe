import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Moment from 'moment';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';

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
  open: boolean,
  username: string,
  start: Date,
  end: Date,
  OpenDetailClose: () => void
}

const CalendarDetail: FC<CalendarDetailProps> = ({ title, description, open, OpenDetailClose, start, end, username }) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{title}</h2>
      <p className="simple-modal-time">
      </p>
      <p id="simple-modal-description">
        {description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '5px' }}>
        <PersonIcon style={{ fontSize: '16px' }} />{username}  <DateRangeIcon style={{ fontSize: '16px',marginLeft: '10px'}} /> {Moment(start).format('DD-MM-yyyy')} -  {Moment(end).format('DD-MM-yyyy')}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={OpenDetailClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
export default CalendarDetail;