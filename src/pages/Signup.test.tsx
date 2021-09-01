import { fetchLogIn } from "../App";

describe("Member areea test ", () => {
  test("Test Login JohnDoe", async () => {
    expect(await fetchLogIn('1', 'Qw5a6u6EKCEtnYCH06cPK2eAb5wyspVdCNt3qGnn549WOfV7Yw0i7c0yRUL0biNS')).toEqual({
      realm: null,
      username: 'John',
      email: 'john@doe.com',
      emailVerified: null,
      id: 1
    })
  })
})