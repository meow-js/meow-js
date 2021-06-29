# picojs

A simple way to communicate with the Scratch API


## Install
```bash
npm install https://github.com/pico-js/pico-js
```

## Example usage:

```javascript
const { ScratchSession } = require("pico-js")

let session = new ScratchSession("sus", "sussy")

session.login().then(async () => {
  // Get a forum (Advanced Topics) and find the first topic
  let AT = await session.getForum(31)
  await AT.topics[0]._init();
  console.log(AT.topics[0].title)
})
```
