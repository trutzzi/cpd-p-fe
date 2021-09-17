import React, { FC, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import TextField from '@material-ui/core/TextField';
import { Button, Modal, ButtonGroup, Select, MenuItem, InputLabel } from '@material-ui/core'
import { AuthContext } from '../../App';
import { useEffect } from 'react';


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
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column' as 'column'
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

export type UpdateEventType = {
  title: string | undefined;
  description: string | undefined;
  start?: null | Date;
  end?: null | Date;
  confirmed: Boolean | number | undefined;
}

type CalendarDetailProps = {
  title: string,
  description: string,
  id: number,
  open: boolean,
  username: string | undefined,
  start: Date,
  end: Date,
  confirmed: Boolean,
  OpenDetailClose: Function,
  onDelete: Function,
  onUpdate: (id: number, body: UpdateEventType, close: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

const EventDetails: FC<CalendarDetailProps> = ({ title, id, description, confirmed, open, OpenDetailClose, start, end, username, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState<string>();
  const [descriptionEdit, setDescriptionedit] = useState<string>();
  const [startEdit, setStartEdit] = useState<Date | undefined>(start);
  const [endEdit, setEndEdit] = useState<Date | undefined>(end);
  const [confirmEdit, setConfirmEdit] = useState<Boolean | number>();

  useEffect(() => {
    setTitleEdit(title);
    setStartEdit(start);
    setEndEdit(end);
    setDescriptionedit(description);
    setConfirmEdit(confirmed ? 1 : 0);
  }, [title, description, confirmed, end, start]);

  const updateEvent = () => {
    const UpdateRequestEvent: UpdateEventType = {
      title: titleEdit,
      description: descriptionEdit,
      start: startEdit,
      end: endEdit,
      confirmed: confirmEdit
    };
    onUpdate(id, UpdateRequestEvent, setEditMode);
  }

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const userLogged = useContext(AuthContext).username;
  const isEventMine = userLogged === username;
  const ModalViewBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2>{title}</h2>
      <p className="modal-time">
      </p>
      <p className="modal-description"> 
        {description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '5px' }}>
        <PersonIcon style={{ fontSize: '16px' }} />{username}  <DateRangeIcon style={{ fontSize: '16px', marginLeft: '10px' }} /> {Moment(start).format('DD-MM-yyyy')} -  {Moment(end).format('DD-MM-yyyy')}
      </div>
      <p>Confirmed: {confirmed ? 'Yes' : 'No'}</p>
      {isEventMine && <span style={{ fontSize: '11px', display: 'block' }}>You own this event</span>}
      {isEventMine && <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(true)}>Edit</Button>}
    </div >
  );

  const ModalEditBody = (
    <div style={modalStyle} className={classes.paper}>
      <TextField onChange={e => setTitleEdit(e.target.value)} defaultValue={titleEdit} label="Title" />
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="DD-MM-yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Event start date"
          value={startEdit}
          onChange={(date) => setStartEdit(date?.toDate())}
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
          value={endEdit}
          onChange={(date) => setEndEdit(date?.toDate())}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <TextField defaultValue={descriptionEdit} label="Description" onChange={e => setDescriptionedit(e.target.value)} />
      <InputLabel id="confirm-status">Confirm Status</InputLabel>
      <Select
        id="confirm-status"
        value={confirmEdit ? 1 : 0}
        onChange={(e: any) => setConfirmEdit(e.target.value)}
      >
        <MenuItem value={1}>Yes</MenuItem>
        <MenuItem value={0}>No</MenuItem>
      </Select>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>
        <PersonIcon style={{ fontSize: '16px' }} />{username}  <DateRangeIcon style={{ fontSize: '16px', marginLeft: '10px' }} /> {Moment(start).format('DD-MM-yyyy')} -  {Moment(end).format('DD-MM-yyyy')}
      </div>
      {isEventMine && <ButtonGroup style={{ width: '100%', display: 'flex', justifyContent: 'center' }} variant="contained" disableElevation aria-label="outlined primary button group">
        <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(false)}>Cancel</Button>
        <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => updateEvent()}>Save</Button>
        <Button style={{ marginTop: '10px' }} variant="contained" color="secondary" onClick={() => onDelete(id)}>Delete</Button>
      </ButtonGroup>
      }
    </div >
  )

  return (
    <Modal
      open={open}
      onClose={() => OpenDetailClose()}
    >
      <>
        {editMode ? ModalEditBody : ModalViewBody}
      </>
    </Modal>
  );
}
export default EventDetails;