import { FC, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify';
import { LOGIN_REQ, SIGNUP_REQ } from '../constants/constants';
import { AuthContext, AuthContextType } from '../App';
import { useIntl } from 'react-intl';

type SignupProps = {
}

type SignInResponseType = {
  id: number | number,
  userId: number | number,

  error?: { message: string }
}

const Signup: FC<SignupProps> = () => {
  const intl = useIntl()

  const { setRole, setUserId, setToken } = useContext<any>(AuthContext);
  const [login, setLogin] = useState({
    username: null,
    password: null
  });

  const [signUp, setSignUp] = useState({
    username: null,
    password: null,
    email: null
  });

  const handleSignInInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLogin({
      ...login, [name]: value
    });
  }

  const handleSignUpInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSignUp({
      ...signUp, [name]: value
    });
  }

  const doSignIn = async () => {
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(login)
    }
    const req = await fetch(LOGIN_REQ, body);

    // TODO: Role system implement
    const { id: token, userId, error }: SignInResponseType = await req.json();
    if (req.status === 200) {
      toast.success('Step 1 login ready.')
      setPreserveUsername(token, userId, null);
      setAuthContext(token, userId, null);
    }
  }
  const setPreserveUsername = (token: number, userId: number, role: number | null) => {
    localStorage.setItem('token', token.toString());
    localStorage.setItem('user_id', userId.toString());
    localStorage.setItem('role', role?.toString() || 'null');
  }
  const setAuthContext = (token: number, userId: number, role: null) => {
    setRole(role);
    setUserId(userId);
    setToken(token);
  }

  const onSignUp = async () => {
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUp)
    }
    const req = await fetch(SIGNUP_REQ, body);
    const res: { error: { message: string } } = await req.json();
    if (req.status === 200) {
      toast.success('Username was created')
    } else {
      toast.error(res.error?.message);
    }
  }

  return (
    <>
      <ToastContainer />
      <Grid container spacing={10}>
        <Grid item md={6}>
          <Typography style={{ marginBottom: 20, marginTop: 10 }} variant="h3" component="h3">
            <FormattedMessage
              id="signUpTitle"
              defaultMessage="Sign up"
            />
          </Typography>
          <form autoComplete="on">
            <TextField fullWidth required name="username" onChange={(e) => handleSignUpInput(e)} label={intl.formatMessage(
              {
                id: "username",
                defaultMessage: "Username"
              },
            )} />
            <TextField fullWidth required name="password" onChange={(e) => handleSignUpInput(e)} label={intl.formatMessage(
              {
                id: "password",
                defaultMessage: "Password"
              },
            )} type="password" />
            <TextField fullWidth required name="email" onChange={(e) => handleSignUpInput(e)} label={intl.formatMessage(
              {
                id: "email",
                defaultMessage: "E-mail"
              },
            )} />
            <Button style={{ display: 'block', marginTop: 10 }} variant="contained" onClick={() => onSignUp()} color="primary">
              <FormattedMessage
                id="signUpTitle"
                defaultMessage="Sign up"
              />
            </Button>
          </form>
        </Grid>
        <Grid item md={6}>
          <Typography style={{ marginBottom: 20, marginTop: 10 }} variant="h3" component="h3">
            <FormattedMessage
              id="signInTitle"
              defaultMessage="Sign in"
            />
          </Typography>
          <form autoComplete="on">
            <TextField fullWidth required name="username" onChange={(e) => handleSignInInput(e)} label={intl.formatMessage(
              {
                id: "username",
                defaultMessage: "Username"
              },
            )} />
            <TextField fullWidth required name="password" onChange={(e) => handleSignInInput(e)} label={intl.formatMessage(
              {
                id: "password",
                defaultMessage: "Parola"
              },
            )} type="password" />
            <Button style={{ display: 'block', marginTop: 10 }} variant="contained" onClick={() => doSignIn()} color="primary" >
              <FormattedMessage
                id="signInTitle"
                defaultMessage="Sign in"
              />
            </Button>
          </form>
        </Grid>
      </Grid >
    </>
  )
}
export default Signup;