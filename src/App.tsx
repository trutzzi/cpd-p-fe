import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, MemoryRouter } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, MenuItem, IconButton, Menu, Container } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import Calendar from './components/calendar';
import Navigation from './components/Navigation'
import Breadcrump from './components/Breadcrump';
import Signup from './pages/Signup';
import EventsPage from './pages/EventsPage';
import { toast, ToastContainer, ToastContent } from 'react-toastify';
import { GET_DETAIL, LOGOUT_REQ } from './constants/constants';
import theme from './theme';
import 'moment/min/locales';
import { IntlProvider, FormattedMessage } from 'react-intl'
import useFetch from './custom-hooks/useFetch';

// TODO: End date is a bit off with one day, fix it!
import './App.css';
import moment from 'moment';
export type AuthContextType = {
  username: string | null,
  setUsername: React.Dispatch<React.SetStateAction<string | null>>,
  role: number | null,
  setRole: React.Dispatch<React.SetStateAction<number | null>>,
  token: string | null,
  setToken: React.Dispatch<React.SetStateAction<number | null>>,
  userId: number | null,
  setUserId: React.Dispatch<React.SetStateAction<number | null>>
}
type loginObjType = {
  id: number,
  username: string
};

type loginRequestType = [
  loginObjType,
  number
];

function getTranslatedMessages(locale: any): any {
  switch (locale) {
    case "en":
      return import("./compiled-lang/en.json");
    case "ro":
      return import("./compiled-lang/ro.json");
    default:
      return import("./compiled-lang/en.json");
  }
}

export const AuthContext = React.createContext<AuthContextType | {}>({});

export const doLoginRequest: (id: string, token: string) => Promise<loginRequestType> = async (id, token) => {
  const loginRequest = await fetch(`${GET_DETAIL}${id}?access_token=${token}`);
  const loginResponse = await loginRequest.json();
  return [loginResponse, loginRequest.status];
}

function App() {
  const [locale, setLocale] = useState('en');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<null | string>(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState<number | null>(Number(localStorage.getItem('user_id')) || null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null)
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [loggedInMenuAnchorEl, setLoggedInMenuAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
  const isLoggedInMenuOpened = Boolean(loggedInMenuAnchorEl);
  const [translatedMessages, setTranslatedMessages] = useState<any>(getTranslatedMessages(locale));

  // TODO: How to build type check for custom hook and single render
  const [loginRequestData, loginRequestStatus, loginRequestError] = useFetch(`${GET_DETAIL}${userId}?access_token=${token}`);
  
  useEffect(() => {
    token && checkLogIn()
  }, [token, loginRequestData]);

  useEffect(() => getTranslatedMessages(locale).then((data: any) => setTranslatedMessages(data)), [locale]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setLoggedInMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setLoggedInMenuAnchorEl(null);
  };

  const doLogOut = async function () {
    const token = localStorage.getItem('token');
    try {
      const LogOutRequest = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      }
      const req = await fetch(LOGOUT_REQ + token, LogOutRequest);
      cleanLogInfo()
      req.status === 200 && toast.success('User logout successfully');
    } catch (e) {
      toast.error(e as ToastContent)
    }
  };
  const cleanLogInfo = () => {
    setUserId(null);
    setUsername(null);
    localStorage.clear();
  }

  const checkLogIn = async function () {
    if (userId && token) {
      console.log('sts', loginRequestStatus);
      switch (loginRequestStatus) {
        case 401:
          toast.error('Unauthorise request 401')
          break
        case 200:
          setUsername(loginRequestData?.username)
          break
      }
      if (loginRequestError) {
        toast.error('Unauthorise request detected!');
        cleanLogInfo();
      }
    } else {
      cleanLogInfo();
      toast.error('Unauthorise request detected!');
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
          onClick={handleOpenMenu}
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
          open={isLoggedInMenuOpened}
          onClose={handleCloseMenu}
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
    <div className={isMenuOpened ? 'isMenuOpened App' : 'App'}>
      <AuthContext.Provider value={{ username, setUsername, role, token, setToken, setRole, userId, setUserId }}>
        <ThemeProvider theme={theme}>
          <IntlProvider
            locale={locale}
            defaultLocale="en"
            messages={translatedMessages}
          >
            <MemoryRouter initialEntries={['']} initialIndex={0}>
              <Router>
                <div className="page">
                  <Navigation onChangeLanguage={handleChangeLanguage} toggleNav={setIsMenuOpened} username={username} />
                  <div className="page-container">
                    <AppBar position="static">
                      <Toolbar>
                        <div className="nav-container">
                          <IconButton onClick={() => setIsMenuOpened(!isMenuOpened)} edge="start" color="inherit" aria-label="menu">
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
                          {username ? <Redirect to="/" /> : <Signup />}
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
