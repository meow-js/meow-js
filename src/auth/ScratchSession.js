/* eslint-disable no-underscore-dangle */
const { FetchError } = require('node-fetch');
const cookie = require('cookie');
const FormData = require('form-data');
const { AuthenticationError } = require('../lib/is-authenticated.js');
const fetch = require('../lib/request.js');
const Auth = require('./Auth.js');
const Forum = require('../forums/Forum.js');
const Post = require('../forums/Post.js');
const Topic = require('../forums/Topic.js');
const UserProfile = require('../classes/UserProfile.js');
const CloudConnection = require('../classes/CloudConnection.js');
const Project = require('../classes/Project.js');
const Signature = require('../forums/Signature.js');

class ScratchSession {
  /**
   * Creates a ScratchSession, that then can be logged in via the .login() function.
   * @param {string} username
   * @param {string} password
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async login() {
    const csrf1Res = await fetch('https://scratch.mit.edu/csrf_token/', {
      headers: {
        accept: '*/*',
      },
      referrer: 'https://scratch.mit.edu/',
      method: 'GET',
    });

    const initialCsrfToken = cookie.parse(
      csrf1Res.headers.raw()['set-cookie'][1],
    ).scratchcsrftoken;

    const res = await fetch('https://scratch.mit.edu/accounts/login/', {
      headers: {
        Cookie: `scratchcsrftoken=${initialCsrfToken}`,
        'x-csrftoken': initialCsrfToken,
      },
      method: 'POST',
      body: {
        username: this.username,
        password: this.password,
        useMessages: true,
      },
    }).catch(() => {
      throw new FetchError("[Meow.js]: Scratch's servers are down currently :(");
    });

    if (res.status === 403) throw new AuthenticationError('[Meow.js]: Invalid username/password');

    const json = await res.json().catch(async () => {
      throw new FetchError(
        `[Meow.js]: Invalid JSON from scratch servers, got ${await res.text()}`,
      );
    });

    if (res.ok && json[0].success === 1) {
      const auth = new Auth();
      auth.session = cookie.parse(
        res.headers.raw()['set-cookie'][0],
      ).scratchsessionsid;
      auth.csrfToken = cookie.parse(
        res.headers.raw()['set-cookie'][1],
      ).scratchcsrftoken;
      auth.xToken = json[0].token;
      this.auth = auth;

      const session = await this.getSession();
      this.username = session.user.username;

      auth.email = session.user.email;
      auth.id = session.user.id;
      auth.admin = session.permissions.admin;
      auth.scratcher = session.permissions.scratcher;
      auth.social = session.permissions.social;
      auth.educator = session.permissions.educator;
      auth.student = session.permissions.student;
      auth.flags = session.flags;

      this.userProfile = new UserProfile(this.username);

      await this.userProfile._init();
    }
  }

  async getSession() {
    const res = await fetch('https://scratch.mit.edu/session/', {
      method: 'GET',
      client: this,
    });

    return res.json();
  }

  async getForum(forumId) {
    const forum = new Forum(forumId);
    await forum._init();
    return forum;
  }

  async getTopic(topicId) {
    const topic = new Topic(topicId);
    await topic._init();
    return topic;
  }

  async getPost(postId) {
    const post = new Post(postId, this);
    await post._init();
    return post;
  }

  async getSignature() {
    const sig = new Signature(this);
    await sig._init();
    return sig;
  }

  async getProject(projectId) {
    const project = new Project(projectId, this);

    await project._init();
    return project;
  }

  async createCloudConnection(
    projectId,
    cloudServer = undefined,
    provideAuthentication = true,
  ) {
    const cloud = new CloudConnection(
      projectId,
      this,
      cloudServer,
      provideAuthentication,
    );

    return cloud;
  }

  async logout() {
    const fd = new FormData();

    fd.append('csrfmiddlewaretoken', this.auth.csrfToken);

    const res = await fetch('https://scratch.mit.edu/accounts/logout/', {
      client: this,
      headers: {
        accept: '*/*',
      },
      body: fd,
      method: 'POST',
    });

    return res.status !== 403;
  }
}

module.exports = ScratchSession;
/* eslint-enable no-underscore-dangle */
