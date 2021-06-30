# meow.js (meowing)

A simple way to communicate with the Scratch API

## Install

```bash
npm install meowing
```

## Example usage:

```javascript
const { ScratchSession } = require("meowing");

let session = new ScratchSession("sus", "sussy");

session.login().then(async () => {
  // Get a forum (Advanced Topics) and find the first topic
  let AT = await session.getForum(31);
  await AT.topics[0]._init();
  console.log(AT.topics[0].title);
});
```

## Credits

Thanks to [CubeyTheCube](https://github.com/CubeyTheCube) for publishing this to npm!
