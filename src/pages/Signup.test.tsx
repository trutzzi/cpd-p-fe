import { doLoginRequest } from "../App";

describe("Member areea test ", () => {
  test("Test Login JohnDoe", async () => {
    const expectedResult = {
      email: "john@doe.com",
      emailVerified: null,
      id: 1,
      realm: null,
      username: "John"
    };
    const [loginRes, loginStatus] = await doLoginRequest('1', 'xOkJMWQEgcOLNk9BeTT6TwcWNc79PFLGIH9UtgwLUR6mY7hBgkTQubh0ix8Xh1Mz');

    expect(loginRes).toEqual(expectedResult)
  })
})