import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useState, FC, useEffect } from 'react';
import { NEW_REQ, DATA_REQ } from '../constants/constants';
import { ToastContainer, toast } from 'react-toastify';
import NewDetail from './NewDetail';
import CalendarDetail from './CalendarDetail';
import { CalendarProps, TOnSelectItem, TNewDetail, detailEventIn, dataObj } from '../types/EventTypes';
import './CalendarStyle.css';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const CalendarUi: FC<CalendarProps> = ({ username, userId }) => {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [newDetail, setNewDetail] = useState<TNewDetail>({ start: new Date(), end: new Date() });
  const [detailEvent, setDetailEvent] = React.useState<detailEventIn>({ title: '', description: '', username: {}, start: new Date(), end: new Date() });
  const [openDetail, setOpenDetail] = React.useState(false);


  const insertNewEvent = async (event: dataObj) => {
    username && (event = { ...event, userId: userId });

    const token = localStorage.getItem('id')
    const req: any = await fetch(NEW_REQ + token, {
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

  const fetchData: any = async () => {
    const req = await fetch(DATA_REQ);
    const res = await req.json();
    const procesingRes = res.map((item: any) => {
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
    }, 5000)
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
      title: range.title,
      start: range.start,
      description: range.description,
      end: range.end,
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
      </h3>
      {loaded ? <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        onSelectSlot={handleEventClick2}
        onSelectEvent={handleEventClick}
        endAccessor="end"
        selectable={true}
        style={{ height: 500 }}
      /> : 'Not loaded'}
      <NewDetail onNewEvent={insertNewEvent} OpenDetailClose={OpenNewClose} startDate={newDetail.start} endDate={newDetail.end} open={openNew} />
      <CalendarDetail username={detailEvent.username} OpenDetailClose={OpenDetailClose} title={detailEvent.title} start={detailEvent.start} end={
        detailEvent.end} description={detailEvent.description} open={openDetail} />
      <br />
      <br />
    </div>
  );
};
export default CalendarUi;