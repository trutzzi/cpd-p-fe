import React, { useState, useEffect, } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, MemoryRouter } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, MenuItem, IconButton, Menu, Container } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import CalendarUi from './Calendar';
import Navigation from './components/Navigation'
import Breadcrump from './components/Breadcrump';
import Signup from './pages/Signup';
import EventsPage from './EventsPage';
import { toast, ToastContainer } from 'react-toastify';
import { GET_DETAIL, LOGOUT_REQ } from './constants/constants';
import theme from './theme';
import 'moment/min/locales';
import { IntlProvider, FormattedMessage } from 'react-intl'

// TODO: End date is a bit off with one day, fix it!
import './App.css';
import moment from 'moment';

function loadMessages(locale: any): any {
  switch (locale) {
    case "en":
      return import("./compiled-lang/en.json");
    case "ro":
      return import("./compiled-lang/ro.json");
    default:
      return import("./compiled-lang/en.json");
  }
}

export const AuthContext = React.createContext({ username: null, role: null });

function App() {
  const [locale, setLocale] = useState('en');
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [messages, setMessages] = useState<any>(loadMessages(locale));
  useEffect(() => loadMessages(locale).then((data: any) => setMessages(data)), [locale]);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = async () => {
    console.log("Do logout");
    const token = localStorage.getItem('id');
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const req = await fetch(LOGOUT_REQ + token, body);
    window.localStorage.clear()
    setUsername(null);
    setRole(null);
    req.status === 200 && toast.success('User logout successfully');
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

  const handleChangeLanguage = (e: any) => {
    // We are unable to get innerHTML from selected
    const valAndTxt = e.target.value.split('-');
    moment.locale(valAndTxt[0]);
    setLocale(valAndTxt[0]);
    toast.success(

      <FormattedMessage
        id="languageText"
        description='Language set message'
        defaultMessage='Language has been set to {lang}'
        values={
          {
            lang: valAndTxt[1],
          }
        }
      />
    )
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
          <MenuItem onClick={onLogOut}>
            <FormattedMessage
              id="logout"
              defaultMessage="Logut"
              description="Logout"
            />
          </MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <div className={openMenu ? 'isMenuOpened App' : 'App'}>
      <AuthContext.Provider value={{ username, role }}>
        <ThemeProvider theme={theme}>
          <IntlProvider
            locale={locale}
            defaultLocale="en"
            messages={messages}
          >
            <MemoryRouter initialEntries={['']} initialIndex={0}>
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
                            <FormattedMessage
                              id="appTitle"
                              defaultMessage="Appointments"
                            />
                          </Typography>
                          <div >
                            {username ? renderLoggedInNav() :
                              <FormattedMessage
                                id="guest"
                                defaultMessage="Guest"
                              />}
                          </div>
                        </div>
                      </Toolbar>
                    </AppBar>
                    <Container fixed  >
                      <Route>
                        {({ location }) => {
                          const pathnames = location.pathname.split('/').filter((x) => x);
                          return <Breadcrump pathnames={pathnames} />
                        }}
                      </Route>
                      <Switch>
                        <Route exact path="/">
                          <CalendarUi username={username} userId={userId} onLocale={locale} />
                        </Route>
                        <Route exact path="/signup">
                          {username ? <Redirect to="/" /> : <Signup signIn={checkLogIn} />}
                        </Route>
                        <Route exact path="/events">
                          <EventsPage />
                        </Route>
                      </Switch>
                    </Container>
                  </div>
                </div>
              </Router>
            </MemoryRouter>
            <ToastContainer />
          </IntlProvider>
        </ThemeProvider>
      </AuthContext.Provider>
    </div >
  );
}

export default App;
