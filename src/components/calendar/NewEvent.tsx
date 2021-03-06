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
import { dataObj } from '../../types/EventTypes'
import { useIntl, FormattedMessage } from 'react-intl';

type NewDetailType = {
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

const NewEvent: FC<NewDetailType> = ({ open, OpenDetailClose, onNewEvent, startDate, endDate }) => {
  const intl = useIntl();
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    setData({ ...data, start: startDate, end: endDate });
  }, [startDate, endDate])
  useEffect(() => {
    const isModified = data.title === '' || data.description === ''
    setIsCreateDisabled(isModified)
  }, [data])
  useEffect(() => {
    setIsCreateDisabled(true);
  }, [open])

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
        <TextField style={{ width: '100%' }} onChange={(e) => setData({ ...data, description: e.target.value })} label="Description" />
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD-MM-yyyy"
            margin="normal"
            id="date-picker-inline"
            label={intl.formatMessage({
              id: "from",
              defaultMessage: "From"
            })}
            disablePast={true}
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
            disablePast={true}
            margin="normal"
            id="date-picker-inline2"
            label={intl.formatMessage({
              id: "to",
              defaultMessage: "To"
            })}
            value={data.end}
            onChange={handleDateChangeEnd}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <ButtonGroup style={{ width: '100%', display: 'flex', justifyContent: 'center' }} disableElevation variant="contained" aria-label="outlined primary button group">
            <Button onClick={() => onNewEvent(data)} disabled={isCreateDisabled} color="secondary">
              <FormattedMessage
                id="create"
                defaultMessage="Create"
              />
            </Button>
            <Button onClick={() => OpenDetailClose()} color="primary" >
              <FormattedMessage
                id="cancel"
                defaultMessage="Cancel"
              />
            </Button>
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
export default NewEvent;