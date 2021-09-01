import { FC, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify';
import { LOGIN_REQ, SIGNUP_REQ } from '../constants/constants';


type SignupProps = {
  signIn: any
}

const Signup: FC<SignupProps> = ({ signIn }) => {

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

  const onSignIn = async () => {
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(login)
    }
    const req = await fetch(LOGIN_REQ, body);
    const res: { id: string, userId: string, error?: { message: string } } = await req.json();
    if (req.status === 200) {
      toast.success('Login successfully')
      // Set Login preserve
      localStorage.setItem('id', res.id);
      localStorage.setItem('user_id', res.userId);
      signIn();
    }
    else {
      toast.error(res.error?.message);
    }
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
            <TextField fullWidth required name="username" onChange={(e) => handleSignUpInput(e)} label="Username" />
            <TextField fullWidth required name="password" onChange={(e) => handleSignUpInput(e)} label="Password" type="password" />
            <TextField fullWidth required name="email" onChange={(e) => handleSignUpInput(e)} label="E-mail" />
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
            <TextField fullWidth required name="username" onChange={(e) => handleSignInInput(e)} label="Username" />
            <TextField required name="password" onChange={(e) => handleSignInInput(e)} label="Password" type="password" />
            <Button style={{ display: 'block', marginTop: 10 }} variant="contained" onClick={() => onSignIn()} color="primary" >
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