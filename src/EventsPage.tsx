import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { DATA_REQ } from './constants/constants';
import Moment from 'moment';
import { useEffect } from 'react';


interface Column {
  id: 'id' | 'title' | 'start' | 'end' | 'description' | 'userId';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: string) => string;
}

const columns: Column[] = [
  { id: 'id', label: 'Id', minWidth: 100 },
  { id: 'title', label: 'Title', minWidth: 200 },
  {
    id: 'start',
    label: 'Start date',
    minWidth: 200,
    align: 'right',
    format: (value: string) => Moment(value).format('DD-MM-yyyy'),
  },
  {
    id: 'end',
    label: 'End date',
    minWidth: 200,
    align: 'right',
    format: (value: string) => Moment(value).format('DD-MM-yyyy'),
  },
  {
    id: 'description',
    label: 'Description',
    minWidth: 230,
    align: 'right',
  },
  {
    id: 'userId',
    label: 'User ID',
    minWidth: 230,
    align: 'right',
  },
];

interface EventType {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  userId: number;
  username: any
}

interface EventRequestType {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  userId: number;
  users: any
}

function createData(id: number, title: string, start: Date, end: Date, description: string, userId: any, username: string): EventType {
  return { id, title, start, end, description , userId, username };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    const req = await fetch(DATA_REQ);
    const res = await req.json();
    const procesingRes = res.map((item: any) => {
      item = { ...item, start: item.start, end: item.end, users: item.users }
      return item;
    })
    setData(procesingRes);
  }

  useEffect(() => {
    fetchData();
    console.log(data);
    data.map((e: EventRequestType) => createData(e.id, e.title, e.start, e.end, e.description, e.userId, e.users.username))
  }, [])

  return (
    <Paper className={classes.root}>
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
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.title}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    console.log(value)
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'string' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}