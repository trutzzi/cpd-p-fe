import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DATA_REQ } from '../constants/constants';
import Moment from 'moment';
import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage, } from 'react-intl'

type ColumnType = {
  id: 'id' | 'title' | 'start' | 'end' | 'description' | 'userId' | 'users';
  label: any;
  minWidth?: number;
  align?: 'right';
  format?: (value: string) => string;
}

const columns: ColumnType[] = [
  {
    id: 'id',
    label: 'Id',
  },
  {
    id: 'title',
    label: <FormattedMessage
      id="title"
      defaultMessage="Events"
    />,
  },
  {
    id: 'start',
    label: <FormattedMessage
      id="from"
      defaultMessage="From"
    />,
    align: 'right',
    format: (value: string) => Moment(value).format('DD-MM-yyyy'),
  },
  {
    id: 'end',
    label: <FormattedMessage
      id="to"
      defaultMessage="To"
    />,
    align: 'right',
    format: (value: string) => Moment(value).format('DD-MM-yyyy'),
  },
  {
    id: 'description',
    label: <FormattedMessage
      id="description"
      defaultMessage="Description"
    />,
    align: 'right',
  },
  {
    id: 'userId',
    label: <FormattedMessage
      id="userId"
      defaultMessage="User Id"
    />,
    align: 'right',
  },
  {
    id: 'users',
    label: <FormattedMessage
      id="username"
      defaultMessage="Username"
    />,
    align: 'right'
  },
];

type EventType = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  userId: number;
  users: any
}

type EventRequestType = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  username: string;
  userId: number;
  users: any
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function EventsPage() {
  const classes = useStyles();
  const [events, setEvents] = useState<EventType[]>([]);

  const fetchData = async () => {
    const eventsRequest = await fetch(DATA_REQ);
    const eventsResults: EventRequestType[] = await eventsRequest.json();
    const newEventsResults = eventsResults.map(item => ({ ...item, users: item.users.username }))
    setEvents(newEventsResults);
  }
  const tableColsRenders = (row: EventType) => (
    columns.map((column) => {
      const value = row[column.id];
      return (
        <TableCell key={column.id} align={column.align}>
          {column.format && typeof value === 'string' ? column.format(value) : value}
        </TableCell>
      );
    })
  )

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Grid>
      <Typography style={{ marginBottom: 20, marginTop: 10 }} variant="h3" component="h3">
        <FormattedMessage
          id="Events"
          defaultMessage="Events"
        />
      </Typography>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id + row.title}>
                  {tableColsRenders(row)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}