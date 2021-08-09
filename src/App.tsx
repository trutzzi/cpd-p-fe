import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import LinkUi from '@material-ui/core/Link';
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CalendarUi from './components/Calendar';
import Navigation from './components/Navigation'
import Signup from './pages/Signup';
import { toast } from 'react-toastify';
import { GET_DETAIL, LOGOUT_REQ } from './constants/constants';
import theme from './theme';
import 'moment/min/locales';


// TODO: End date is a bit off with one day, fix it!
import './App.css';
import moment from 'moment';

function App() {
  const [locale, setLocale] = useState('en');
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = async () => {
    const token = localStorage.getItem('id');
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const req = await fetch(`${LOGOUT_REQ}${token}`, body);
    setUsername(null);
    window.localStorage.clear()
    toast.success('user logout successfully');
  };

  useEffect(() => {
    checkLogIn();
  }, [username]);

  const checkLogIn = async () => {
    const id = localStorage.getItem('user_id');
    const token = localStorage.getItem('id');
    const req = await fetch(`${GET_DETAIL}${id}?access_token=${token}`);
    const res = await req.json();
    setUserId(res.id);
    setUsername(res.username);
  }

  const handleChangeLanguage = (e: React.ChangeEvent<any>) => {
    // We are unable to get innerHTML from selected
    const valAndTxt = e.target.value.split('-');
    moment.locale(valAndTxt[0]);
    setLocale(valAndTxt[0]);
    toast.success(`Language has been set to ${valAndTxt[1]}`)
  }
  const renderLoggedInNav = () => {
    return (
      <>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle style={{ marginRight: '3px' }} /> {username}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={onLogOut}>Logout</MenuItem>
        </Menu>
      </>
    )
  }

  return (

    <div className={openMenu ? 'isMenuOpened App' : 'App'}>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="page">
            <Navigation onChangeLanguage={handleChangeLanguage} toggleNav={setOpenMenu} username={username} />
            <div className="page-container">
              <AppBar position="static">
                <Toolbar>
                  <div className="nav-container">
                    <IconButton onClick={() => setOpenMenu(!openMenu)} edge="start" color="inherit" aria-label="menu">
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h4">
                      Appointments
                    </Typography>
                    <div >
                      {username ? renderLoggedInNav() : 'Guest'}
                    </div>
                  </div>
                </Toolbar>
              </AppBar>
              <Container fixed  >
                <Switch>

                  <Route exact path="/">

                    <Breadcrumbs style={{ marginTop: '20px', marginBottom: '30px' }}>
                      <LinkUi color="inherit" href="/">
                        <HomeIcon style={{ fontSize: 23 }} color="primary" />
                      </LinkUi>
                      <Typography color="textPrimary">Home</Typography>
                    </Breadcrumbs>

                    <CalendarUi username={username} userId={userId} onLocale={locale} />
                  </Route>

                  <Route exact path="/signup">

                    <Breadcrumbs style={{ marginTop: '20px', marginBottom: '30px' }}>
                      <LinkUi color="inherit" href="/">
                        <HomeIcon style={{ fontSize: 23 }} color="primary" />
                      </LinkUi>
                      <Typography color="textPrimary">Member Areea</Typography>
                    </Breadcrumbs>
                    {username ? <Redirect to="/" /> : <Signup signIn={checkLogIn} />}
                  </Route>
                </Switch>
              </Container>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </div >
  );
}

export default App;
