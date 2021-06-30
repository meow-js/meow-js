const ScratchSession = require("../src/auth/ScratchSession.js");
const Signature = require("../src/forums/Signature.js");

/*
const Forum = require("../src/forums/Forum.js");
let Advanced = new Forum(31);
Advanced._init().then(() => {
  console.log(Advanced);
});*/

require("dotenv").config();

let session = new ScratchSession(process.env.user, process.env.password);

session.login().then(async () => {
  let signature = new Signature(session);
  await signature._init();
  console.log(signature.signature);
  await signature.update(
    "Meow.js: [b]Coming Soon[/b]..\n[small]Sent with Meow.js[/small]"
  );

  let post = await session.getPost(5383798)

  console.dir(post)

  
  console.log(await session.logout());
});
