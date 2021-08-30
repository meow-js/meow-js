if (!process.env.IS_GITHUB) require("dotenv").config()

const {ScratchSession} = require("../index.js");

const session = new ScratchSession(process.env.TEST_SCRATCH_USERNAME, process.env.TEST_SCRATCH_PASSWORD);



test("the login was successful", () => {
    session.login().then(res => {
        expect(res).toBe(undefined)
    }).catch(err => {
        expect(err.toString()).toMatch('[Meow.js]:')
    })
})