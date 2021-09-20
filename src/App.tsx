import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, MemoryRouter } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, MenuItem, IconButton, Menu, Container } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import Calendar from './components/calendar';
import Navigation from './components/Navigation'
import Breadcrump from './components/Breadcrump';
import Signup from './pages/Signup';
import EventsPage from './pages/EventsPage';
import { toast, ToastContainer } from 'react-toastify';
import { GET_DETAIL, LOGOUT_REQ } from './constants/constants';
import theme from './theme';
import 'moment/min/locales';
import { IntlProvider, FormattedMessage } from 'react-intl'

// TODO: End date is a bit off with one day, fix it!
import './App.css';
import moment from 'moment';

type AuthContextType = { username: string | null, role: any }
type checkLogInType = {
  id: number,
  username: string
}

function loadTranslatedMessages(locale: any): any {
  switch (locale) {
    case "en":
      return import("./compiled-lang/en.json");
    case "ro":
      return import("./compiled-lang/ro.json");
    default:
      return import("./compiled-lang/en.json");
  }
}

export const AuthContext = React.createContext<AuthContextType>({ username: null, role: null });

export const dologinRequest: (id: string, token: string) => Promise<checkLogInType> = async (id, token) => {
  const loginRequest = await fetch(`${GET_DETAIL}${id}?access_token=${token}`);
  const loginResponse: Promise<checkLogInType> = await loginRequest.json();
  return loginResponse;

}

function App() {
  const [locale, setLocale] = useState('en');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [loggedInMenuAnchorEl, setLoggedInMenuAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
  const open = Boolean(loggedInMenuAnchorEl);
  const [translatedMessages, setTranslatedMessages] = useState<any>(loadTranslatedMessages(locale));

  useEffect(() => {
    checkLogIn();
    console.log('checklogin')
  }, [username]);

  useEffect(() => loadTranslatedMessages(locale).then((data: any) => setTranslatedMessages(data)), [locale]);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setLoggedInMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLoggedInMenuAnchorEl(null);
  };

  const doLogOut = async function () {
    const token = localStorage.getItem('id');
    try {
      const LogOutRequest = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      }
      const req = await fetch(LOGOUT_REQ + token, LogOutRequest);
      window.localStorage.clear()
      setUsername(null);
      setRole(null);
      req.status === 200 && toast.success('User logout successfully');
    } catch (e) {
      console.log(e)
    }
  };

  const checkLogIn = async function () {
    const token = localStorage.getItem('id');
    const id = localStorage.getItem('user_id');
    if (id && token) {
      const res = await dologinRequest(id, token);
      setUserId(res.id);
      setUsername(res.username);
    } else {
      setUserId(null);
      setUsername(null);
    }
  };

  const handleChangeLanguage = (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    const value = e.target.value as string;
    const extractLang = value.split('-');
    moment.locale(extractLang[0]);
    setLocale(extractLang[0]);
    toast.success(

      <FormattedMessage
        id="languageText"
        description='Language set message'
        defaultMessage='Language has been set to {lang}'
        values={
          {
            lang: extractLang[1],
          }
        }
      />
    )
  }

  const renderLoggedInMenu = () => {
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
          anchorEl={loggedInMenuAnchorEl}
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
          <MenuItem onClick={doLogOut}>
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
            messages={translatedMessages}
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
                          <div role="button" aria-describedby="Logout button" >
                            {username ? renderLoggedInMenu() :
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
                          <Calendar username={username} userId={userId} onLocale={locale} />
                        </Route>
                        <Route exact path="/signup">
                          {username ? <Redirect to="/" /> : <Signup onSignIn={checkLogIn} />}
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
