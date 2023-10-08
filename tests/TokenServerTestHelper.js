/* istanbul ignore file */
const TokenServerTestHelper = {
  async getAccessTokenandUserId({ server, username = 'rifki' }) {
    const requestPayload = {
      username,
      password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...requestPayload,
        fullname: 'Rifki Firansah',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;

    return { userId, accessToken };
  },
};

module.exports = TokenServerTestHelper;
