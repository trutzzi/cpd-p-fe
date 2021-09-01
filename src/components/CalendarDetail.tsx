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
import { AuthContext } from '../App';
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

export type bodyEditType = {
  title: string | undefined;
  description: string | undefined;
  start: Date | undefined;
  end: Date | undefined;
  confirmed: Boolean | number | undefined;
}

type CalendarDetailProps = {
  title: string,
  description: string,
  id: number,
  open: boolean,
  username: string,
  start: Date,
  end: Date,
  confirmed: Boolean,
  OpenDetailClose: Function,
  onDelete: Function,
  onUpdate: (id: number, body: bodyEditType, close: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

const CalendarDetail: FC<CalendarDetailProps> = ({ title, id, description, confirmed, open, OpenDetailClose, start, end, username, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState<string>();
  const [descriptionEdit, setDescriptionedit] = useState<string>();
  const [startEdit, setStartEdit] = useState(start);
  const [endEdit, setEndEdit] = useState(end);
  const [confirmEdit, setConfirmEdit] = useState<Boolean | number>();

  useEffect(() => {
    setTitleEdit(title);
    setStartEdit(start);
    setEndEdit(end);
    setDescriptionedit(description);
    setConfirmEdit(confirmed ? 1 : 0);
  }, [title, description, confirmed]);

  const initUpdate = () => {
    const body: bodyEditType = {
      title: titleEdit,
      description: descriptionEdit,
      start: startEdit,
      end: endEdit,
      confirmed: confirmEdit
    };
    onUpdate(id, body, setEditMode);
  }

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const userLogged = useContext(AuthContext).username;
  const userRole = useContext(AuthContext).role;

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2>{title}</h2>
      <p className="modal-time">
      </p>
      <p id="simple-modal-description">
        {description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '5px' }}>
        <PersonIcon style={{ fontSize: '16px' }} />{username}  <DateRangeIcon style={{ fontSize: '16px', marginLeft: '10px' }} /> {Moment(start).format('DD-MM-yyyy')} -  {Moment(end).format('DD-MM-yyyy')}
      </div>
      <p>Confirmed: {confirmed ? 'Yes' : 'No'}</p>
      {userLogged === username && <span style={{ fontSize: '11px', display: 'block' }}>You own this event</span>}
      {userLogged === username && <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(true)}>Edit</Button>}
    </div >
  );

  const bodyEdit = (
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
          onChange={(e: any) => setStartEdit(e._d)}
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
          onChange={(e: any) => setEndEdit(e._d)}
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
      <ButtonGroup style={{ width: '100%', display: 'flex', justifyContent: 'center' }} variant="contained" disableElevation aria-label="outlined primary button group">
        {userLogged === username && <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(false)}>Cancel</Button>}
        {userLogged === username && <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => initUpdate()}>Save</Button>}
        {userLogged === username && <Button style={{ marginTop: '10px' }} variant="contained" color="secondary" onClick={() => onDelete(id)}>Delete</Button>}
      </ButtonGroup>
    </div >
  )

  return (
    <Modal
      open={open}
      onClose={() => OpenDetailClose()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <>
        {editMode ? bodyEdit : body}
      </>
    </Modal>
  );
}
export default CalendarDetail;