import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import { dataObj } from '../types/EventTypes'

type NewDetailT = {
  open: boolean,
  startDate: string | Date,
  endDate: string | Date,
  OpenDetailClose: () => void,
  onNewEvent: (data: dataObj) => Promise<void>,
}

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
    width: 250,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 5
  },
}));

const NewDetail: FC<NewDetailT> = ({ open, OpenDetailClose, onNewEvent, startDate, endDate }) => {


  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    setData({ ...data, start: startDate, end: endDate });
  }, [startDate, endDate])

  const [data, setData] = useState({
    title: '',
    description: '',
    start: startDate,
    end: endDate,
  });

  const handleDateChangeStart = (e: any) => {
    setData({
      ...data, start: e._d
    })
  }
  const handleDateChangeEnd = (e: any) => {
    setData({
      ...data, end: e._d
    })
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form noValidate autoComplete="off">
        <TextField style={{ width: '100%' }} onChange={(e) => setData({ ...data, title: e.target.value })} label="Title" />
        <br />
        <TextField style={{ width: '100%' }} onChange={(e) => setData({ ...data, description: e.target.value })} label="Description" />
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
          <KeyboardDatePicker

            disableToolbar
            variant="inline"
            format="DD-MM-yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Event start date"
            value={data.start}
            onChange={handleDateChangeStart}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker

            disableToolbar
            variant="inline"
            format="DD-MM-yyyy"
            margin="normal"
            id="date-picker-inline2"
            label="Event end date"
            value={data.end}
            onChange={handleDateChangeEnd}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <br />
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={() => onNewEvent(data)} color="secondary">Create</Button>
            <Button onClick={() => OpenDetailClose()} color="primary" >Cancel</Button>
          </ButtonGroup>
        </MuiPickersUtilsProvider>
      </form>
    </div>
  );

  return (
    <Modal
      open={open}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
export default NewDetail;