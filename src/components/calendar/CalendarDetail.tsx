import React, { FC, useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import { Button, Modal, ButtonGroup, Select, MenuItem, InputLabel, TextField } from '@material-ui/core'
import { DateRange as DateRangeIcon, Person as PersonIcon } from '@material-ui/icons';
import { AuthContext } from '../../App';
import { FormattedMessage, useIntl } from 'react-intl';
import ConfirmBox from '../ConfirmBox';

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

const EventDetails: FC<CalendarDetailProps> = ({ title, id, description, confirmed, open, OpenDetailClose, start, end, username, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState<string>();
  const [descriptionEdit, setDescriptionedit] = useState<string>();
  const [startEdit, setStartEdit] = useState<Date | undefined>(start);
  const [endEdit, setEndEdit] = useState<Date | undefined>(end);
  const [confirmEdit, setConfirmEdit] = useState<Boolean | number>();
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const intl = useIntl();

  useEffect(() => {
    setTitleEdit(title);
    setStartEdit(start);
    setEndEdit(end);
    setDescriptionedit(description);
    setConfirmEdit(confirmed ? 1 : 0);
  }, [title, description, confirmed, end, start]);

  useEffect(() => {
    let isFormModified = titleEdit !== title || startEdit !== start || endEdit !== end || descriptionEdit !== description
    const isFormEmpty = titleEdit === '' || descriptionEdit === ''
    isFormEmpty && (isFormModified = false)
    setIsSaveDisabled(!isFormModified)
  }, [titleEdit, startEdit, endEdit, descriptionEdit])

  const confirmDeleteDialog = () => {
    setConfirmDelete(true);
  }
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
  const { username: userLogged } = useContext<any>(AuthContext);
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
      {isEventMine && (
        <span className="myEvent">
          <span style={{ fontSize: '11px', display: 'block' }}>You own this event</span>
          <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(true)}>
            <FormattedMessage
              id="edit"
              defaultMessage="Edit"
              description="Edit"
            />
          </Button>
        </span>
      )}
    </div >
  );

  const ModalEditBody = (
    <div style={modalStyle} className={classes.paper}>
      <TextField onChange={e => setTitleEdit(e.target.value)} defaultValue={titleEdit} label={
        intl.formatMessage({
          id: "titleComponent",
          defaultMessage: "Title"
        })
      } />
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="DD-MM-yyyy"
          margin="normal"
          id="date-picker-inline"
          label={
            intl.formatMessage({
              id: "from",
              defaultMessage: "From"
            })
          }
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
          label={
            intl.formatMessage({
              id: "to",
              defaultMessage: "To"
            })
          }
          value={endEdit}
          onChange={(date) => setEndEdit(date?.toDate())}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <TextField defaultValue={descriptionEdit} label={
        intl.formatMessage({
          id: "description",
          defaultMessage: "Description"
        })
      } onChange={e => setDescriptionedit(e.target.value)} />
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
        <Button style={{ marginTop: '10px' }} variant="contained" color="secondary" onClick={confirmDeleteDialog}>
          <FormattedMessage
            id="delete"
            defaultMessage="Delete"
            description="Delete"
          />
        </Button>
        <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setEditMode(false)}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
        <Button style={{ marginTop: '10px' }} disabled={isSaveDisabled} variant="contained" color="primary" onClick={() => updateEvent()}>
          <FormattedMessage
            id="save"
            defaultMessage="Save"
            description="Save"
          />
        </Button>
      </ButtonGroup>
      }
      <ConfirmBox open={confirmDelete} title={intl.formatMessage({
        id: "deleteConfirmTitle",
        defaultMessage: "Delete confirmation"
      })} action={() => onDelete(id)} message={intl.formatMessage({
        id: "deleteConfirmMessage",
        defaultMessage: "Are you sure you want to delete permanently this event?"
      })} closeHandler={setConfirmDelete} />
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