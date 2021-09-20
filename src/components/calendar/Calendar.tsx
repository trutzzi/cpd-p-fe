import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import React, { useState, FC, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { NEW_REQ, DATA_REQ, DELETE_EVENT, UPDATE_EVENT } from '../../constants/constants';
import NewEvent from './NewEvent';
import EventDetails from './CalendarDetail';
import { CalendarProps as CalendarComponentProps, SelectEventType as SelectEventType, dataObj, SlotInfo } from '../../types/EventTypes';
import { AuthContext } from '../../App';
import { UpdateEventType } from './CalendarDetail';
import WarningIcon from '@material-ui/icons/Warning';
import './CalendarStyle.css';
import 'react-toastify/dist/ReactToastify.css';

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
  const [eventsData, setEventsData] = useState([]);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [newEventSlot, setNewEventSlot] = useState<StartEndEventType>({ start: new Date(), end: new Date() });
  const [eventModalDetail, setEventModalDetail] = useState<SelectEventType>();
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
      setOpenNewModal(false);
      loadCalendarEvents();
      toast.info(`Event ${event.title} was created`);
    } else {
      const err = await insertEventRequest.json();
      const errMsg = err.error.message;
      toast.error(errMsg);
    }
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
    setEventsData(procesingRes);
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
    setOpenNewModal(false);
  };


  const handleEventSimple = (range: SelectEventType) => {
    setEventModalDetail({
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
        setNewEventSlot({
          ...newEventSlot, start: start, end: end
        });
        setOpenNewModal(true);
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
          events={eventsData}
          startAccessor="start"
          onSelectSlot={handleEventSlot}
          onSelectEvent={handleEventSimple}
          endAccessor="end"
          selectable={true}
          style={{ height: 600 }
          }
        /> : <><WarningIcon style={{ color: 'orange', verticalAlign: "middle", marginRight: 3 }} /><span style={{ verticalAlign: 'middle' }}>API Offline!</span></>}
      <NewEvent onNewEvent={createNewEvent} OpenDetailClose={OpenNewClose} startDate={newEventSlot.start} endDate={newEventSlot.end} open={openNewModal} />
      {eventModalDetail && <EventDetails onUpdate={(id, body, close) => updateEvent(id, body, close)} confirmed={eventModalDetail.confirmed} onDelete={deleteEvent} id={eventModalDetail.id} username={eventModalDetail.username} OpenDetailClose={OpenDetailClose} title={eventModalDetail.title} start={eventModalDetail.start} end={
        eventModalDetail.end} description={eventModalDetail.description} open={openDetail} />
      }
    </div >
  );
};
export default CalendarComponent;