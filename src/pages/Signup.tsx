import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import { ToastContainer, toast } from 'react-toastify';
import { LOGIN_REQ, SIGNUP_REQ } from '../constants/constants';
import Container from '@material-ui/core/Container';


type SignupProps = {
  signIn: () => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));


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
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(signUp)
    }
    const req = await fetch(SIGNUP_REQ, body);
    const res: { error: { message: string } } = await req.json();
    if (req.status === 200) {
      toast.success('Username was created')
    } else {
      toast.error(res.error.message);
    }
  }
  // TODO SIGNUP {
  //  LOGOUT FUNCTIONALITY

  const classes = useStyles();

  return (
    <>
      <ToastContainer />
      <Container>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="space-between" spacing={2}>
              <Grid>
                <h1>Sign Up</h1>
                <form noValidate autoComplete="off">
                  <TextField name="username" onChange={(e) => handleSignUpInput(e)} label="Username" />
                  <br />
                  <TextField name="password" onChange={(e) => handleSignUpInput(e)} label="Password" type="password" />
                  <br />
                  <TextField name="email" onChange={(e) => handleSignUpInput(e)} label="E-mail" />
                  <br />
                  <br />
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={() => onSignUp()} color="primary">Sign Up</Button>
                  </ButtonGroup>
                </form>
              </Grid>

              <Grid>
                <h1>Sign In</h1>
                <form noValidate autoComplete="off">
                  <TextField name="username" onChange={(e) => handleSignInInput(e)} label="Username" />
                  <br />
                  <TextField name="password" onChange={(e) => handleSignInInput(e)} label="Password" type="password" />
                  <br />
                  <br />
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={() => onSignIn()} color="primary" >Sign In</Button>
                  </ButtonGroup>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
export default Signup;