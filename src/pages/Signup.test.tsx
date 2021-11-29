import { onSignUp, doSignInReq } from '../pages/Signup';

const TESTUSER = {
  username: "uniTestUser",
  password: "uniTestUser",
  email: "uniTestUser@unit.test"
};
let LOGGEDINUSER: any = null;

describe("Create test user and return 200 status", () => {
  it('Should create user', async () => {
    //Expected result from our api is same obj as we sent it
    const signUpReq = await onSignUp(TESTUSER);
    expect(typeof signUpReq).toBe('object');
    expect(signUpReq.status).toBe(200);
  })
});

describe("Login to test user and return 200 status", () => {
  it('Expect sign in results', async () => {
    const loginRes = await doSignInReq(TESTUSER);
    expect(typeof loginRes).toBe('object');
    expect(loginRes.status).toBe(200);
    if (loginRes.status === 200) {
      // Set logged in user 
      LOGGEDINUSER = loginRes.response;
    }
  })
})

describe("Delete user and return 200 status", () => {
  it("Should delete user ", async () => {
    const onDeleteUser = async () => {
      const body = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({

        })
      }
      const req = await fetch('http://localhost:3000/api/Users/' + LOGGEDINUSER.userId + '?access_token=' + LOGGEDINUSER.id, body);
      const res = await req.json();
      return { status: req.status, response: res };
    }
    const response = await onDeleteUser()
    expect(response.status).toBe(200);
  })
})