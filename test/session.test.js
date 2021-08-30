/* global expect test */
const dotenv = require('dotenv');

if (!process.env.IS_GITHUB) {
  dotenv.config();
  console.log("Not running in github context;\nPassing env variables from '.env'");
}

const { ScratchSession } = require('../index.js');

const session = new ScratchSession(process.env.TEST_SCRATCH_USERNAME, process.env.TEST_SCRATCH_PASSWORD);

test('the login was successful', () => {
  session.login().then((res) => {
    expect(res).toBe(undefined);
  });
});
