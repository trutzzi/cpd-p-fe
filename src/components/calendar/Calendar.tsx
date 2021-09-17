import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useState, FC, useEffect, useContext } from 'react';
import { NEW_REQ, DATA_REQ, DELETE_EVENT, UPDATE_EVENT } from '../../constants/constants';
import { toast } from 'react-toastify';
import NewEvent from './NewEvent';
import EventDetails from './CalendarDetail';
import { CalendarProps as CalendarComponentProps, SelectEventType as SelectEventType, dataObj, SlotInfo } from '../../types/EventTypes';
import { AuthContext } from '../../App';
import { FormattedMessage } from 'react-intl'
import WarningIcon from '@material-ui/icons/Warning';

import { UpdateEventType } from './CalendarDetail';


import './CalendarStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import { useMemo } from 'react';

type ItemRequestType = {
  description: string,
  end: Date | string,
  id: number,
  start: Date | string,
  title: string,
  userId: number,
  users: string,
  email: string,
  emailVerified: boolean | null
}

type StartEndEventType = { start: string | Date, end: string | Date }

const localizer = momentLocalizer(moment);

const CalendarComponent: FC<CalendarComponentProps> = ({ userId }) => {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [newDetail, setNewDetail] = useState<StartEndEventType>({ start: new Date(), end: new Date() });
  const [eventDetail, setEventDetail] = useState<SelectEventType>();
  const [openDetail, setOpenDetail] = useState(false);
  const getAuthContext = useContext(AuthContext);
  const username = getAuthContext.username;
  const token = useMemo(() => localStorage.getItem('id'), [username]);

  const createNewEvent = async (event: dataObj) => {
    const newEvent = { ...event, userId: userId };
    const insertEventRequest = await fetch(NEW_REQ + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });
    const isOk = insertEventRequest.status === 200;
    if (isOk) {
      setOpenNew(false);
      loadCalendarEvents();
      toast.info(`Event ${event.title} was created`);
    } else {
      const err = await insertEventRequest.json();
      const errMsg = err.error.message;
      showError(errMsg);
    }
  }

  const showError = (msg: string) => {
    toast.error(msg);
  }

  const deleteEvent = async (id: number) => {
    const req = await fetch(`${DELETE_EVENT}${id}?access_token=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (req.status === 200) {
      toast.info('Event ' + id + ' has been deleted')
      OpenDetailClose();
      loadCalendarEvents();
    } else if (req.status === 401) {
      toast.error('This event is not yours');
    }
  }

  const updateEvent = async (id: number, event: UpdateEventType, close: React.Dispatch<React.SetStateAction<boolean>>) => {
    const updateRequest = await fetch(`${UPDATE_EVENT}${id}?access_token=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (updateRequest.status === 200) {
      toast.info('Event ' + id + ' has been updated')
      close(true);
      OpenDetailClose();
      loadCalendarEvents();
    } else if (updateRequest.status === 401) {
      toast.error('This event is not yours');
    }
  }

  const loadCalendarEvents = async () => {
    const CalendarEventsRequest = await fetch(DATA_REQ);
    const res = await CalendarEventsRequest.json();
    const procesingRes = res.map((event: ItemRequestType) => {
      event = { ...event, start: new Date(event.start), end: new Date(event.end), users: event.users }
      return event;
    })
    setData(procesingRes);
    setLoaded(true);
  }

  useEffect(() => {
    loadCalendarEvents();
    const refreshTimer = setInterval(() => {
      loadCalendarEvents();
    }, 30000)
    return () => {
      clearInterval(refreshTimer);
    }
  }, []);

  const OpenDetailClose = () => {
    setOpenDetail(false);
  };

  const OpenNewClose = () => {
    setOpenNew(false);
  };


  const handleEventSimple = (range: SelectEventType) => {
    setEventDetail({
      id: range.id,
      title: range.title,
      start: range.start,
      end: range.end,
      confirmed: range.confirmed,
      description: range.description,
      username: range.users.username
    });
    setOpenDetail(true);
    return true;
  };
  const handleEventSlot = (e: SlotInfo) => {
    const { start, end, action } = e;
    if (username) {
      if (action === "select") {
        setNewDetail({
          ...newDetail, start: start, end: end
        });
        setOpenNew(true);
      }
    } else {
      toast.error('You must be logged in to create event')
    }
  }
  return (
    <div>
      <h3 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
        {username ?
          <FormattedMessage
            id="myCalendar"
            defaultMessage="{username}'s calendar"
            description="myCalendar"
            values={
              {
                username,
              }
            }
          /> :
          <FormattedMessage
            id="myCalendarGuest"
            defaultMessage="Calendar"
            description="Calendar"
          />}
      </h3 >
      {
        loaded ? <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          onSelectSlot={handleEventSlot}
          onSelectEvent={handleEventSimple}
          endAccessor="end"
          selectable={true}
          style={{ height: 600 }
          }
        /> : <><WarningIcon style={{ color: 'orange', verticalAlign: "middle", marginRight: 3 }} /><span style={{ verticalAlign: 'middle' }}>API Offline!</span></>}
      <NewEvent onNewEvent={createNewEvent} OpenDetailClose={OpenNewClose} startDate={newDetail.start} endDate={newDetail.end} open={openNew} />
      {eventDetail && <EventDetails onUpdate={(id, body, close) => updateEvent(id, body, close)} confirmed={eventDetail.confirmed} onDelete={deleteEvent} id={eventDetail.id} username={eventDetail.username} OpenDetailClose={OpenDetailClose} title={eventDetail.title} start={eventDetail.start} end={
        eventDetail.end} description={eventDetail.description} open={openDetail} />
      }
    </div >
  );
};
export default CalendarComponent;