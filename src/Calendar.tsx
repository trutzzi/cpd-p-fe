import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useState, FC, useEffect, useContext } from 'react';
import { NEW_REQ, DATA_REQ, DELETE_EVENT } from './constants/constants';
import { ToastContainer, toast } from 'react-toastify';
import NewDetail from './components/NewDetail';
import CalendarDetail from './components/CalendarDetail';
import { CalendarProps, TOnSelectItem, dataObj } from './types/EventTypes';
import { AuthContext } from './App';
import { useIntl } from 'react-intl';

import './CalendarStyle.css';
import 'react-toastify/dist/ReactToastify.css';

type itemRequest = {
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

const localizer = momentLocalizer(moment);

const CalendarUi: FC<CalendarProps> = ({ userId }) => {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [newDetail, setNewDetail] = useState({ start: new Date(), end: new Date() });
  const [detailEvent, setDetailEvent] = React.useState({ id: 1, title: '', description: '', username: '', start: new Date(), end: new Date() });
  const [openDetail, setOpenDetail] = React.useState(false);
  const username = useContext(AuthContext);
  const intl = useIntl()

  const insertNewEvent = async (event: dataObj) => {
    username && (event = { ...event, userId: userId });

    const token = localStorage.getItem('id')
    const req = await fetch(NEW_REQ + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (req.status === 200) {
      setOpenNew(false);
      fetchData();
      toast.info(`Event ${event.title} was created`);
    } else {
      const err = await req.json();
      const errMsg = err.error.message;
      toast.error(errMsg);
    }
  }

  const onDeleteEvent = async (id: number) => {
    console.log('deleting')
    const token = localStorage.getItem('id')
    const req = await fetch(`${DELETE_EVENT}${id}?access_token=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (req.status === 200) {
      toast.info('Event ' + id + ' has been deleted')
      OpenDetailClose();
      fetchData();
    } else if (req.status === 401) {
      toast.error('This event is not yours');
    }
  }

  const fetchData = async () => {
    const req = await fetch(DATA_REQ);
    const res = await req.json();
    const procesingRes = res.map((item: itemRequest) => {
      item = { ...item, start: new Date(item.start), end: new Date(item.end), users: item.users }
      return item;
    })
    setData(procesingRes);
    setLoaded(true);
  }
  useEffect(() => {
    fetchData();
    const refreshTime = setInterval(() => {
      fetchData();
    }, 30000)
    return () => {
      clearInterval(refreshTime);
    }
  }, []);

  const OpenDetailClose = () => {
    setOpenDetail(false);
  };

  const OpenNewClose = () => {
    setOpenNew(false);
  };

  const handleEventClick = (range: TOnSelectItem) => {
    setDetailEvent({
      id: range.id,
      title: range.title,
      start: range.start,
      end: range.end,
      description: range.description,
      username: range.users.username
    });
    setOpenDetail(true);
    return true;
  };
  const handleEventClick2 = (e: any) => {
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
      <ToastContainer />
      <h3 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
        {username ? `${username} 's calendar` : 'Guest calendar'}
        <p>{intl.messages.MyCalendar}</p>
      </h3 >
      {
        loaded ? <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          onSelectSlot={handleEventClick2}
          onSelectEvent={handleEventClick}
          endAccessor="end"
          selectable={true}
          style={{ height: 500 }
          }
        /> : 'Not loaded'}
      <NewDetail onNewEvent={insertNewEvent} OpenDetailClose={OpenNewClose} startDate={newDetail.start} endDate={newDetail.end} open={openNew} />
      <CalendarDetail onDelete={onDeleteEvent} id={detailEvent.id} username={detailEvent.username} OpenDetailClose={OpenDetailClose} title={detailEvent.title} start={detailEvent.start} end={
        detailEvent.end} description={detailEvent.description} open={openDetail} />
      <br />
      <br />
    </div >
  );
};
export default CalendarUi;