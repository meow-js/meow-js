class AuthenticationError extends Error {
  /**
   * Creates an AuthenticationError.
   * @param {string} reason
   */
  constructor(reason) {
    super(reason);
  }
}

module.exports = (c) => {
  const client = c._client;
  if (client && client.auth && client.auth.csrfToken) {
    return true;
  }
  console.log(client);
  throw new AuthenticationError("You're not logged in!");
};

module.exports.AuthenticationError = AuthenticationError;
