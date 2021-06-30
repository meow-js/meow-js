const WebSocket = require("ws");

class CloudConnection {
  /**
   *
   * @param {number} projectId The project to connect to
   * @param {ScratchSession} client The client of the user to change variables as
   * @param {string} cloudServer The cloud server URL. Defaults to scratch's servers
   * @param {boolean} provideAuthentication Boolean to send the client cookie
   */
  constructor(
    projectId,
    client,
    cloudServer = "wss://clouddata.scratch.mit.edu",
    provideAuthentication = true
  ) {
    this._client = client;
    this.projectId = projectId;
    let cookie = provideAuthentication ? `scratchsessionsid=${client.auth.session};` : ""
    const headers = {
      Cookie: cookie,
      origin: "https://scratch.mit.edu"
    };
    this._ws = new WebSocket(cloudServer, {
      headers,
    });

    this._ws.on("open", () => {
      this._send({
        method: "handshake",
        user: client.username,
        project_id: String(projectId),
      });
      setTimeout(() => this.setVariable(`_mjsVar${Date.now()}`, Date.now()), 100);
    });

    let _this = this;

    this._ws.on("message", (e) => {
      for (let message of e.split("\n")) {
        const obj = JSON.parse(message || `{"method": "err"}`);

        if (obj.method == "set") {
          _this.variables[obj.name] = obj.value;
        }
      }
    });

    this._ws.on("close", () => {});

    this._ws.on("error", (err) => {
      throw new Error("Unexpected error in cloud");
    });
  }

  /**
   * Sends a packet to the server.
   * @param {object} data
   */
  _send(data) {
    this._ws.send(`${JSON.stringify(data)}\n`);
  }

  /**
   * Gets a variable
   * @param {string} variable
   */
  getVariable(variable) {
    return this.variables["☁ " + variable];
  }

  /**
   * Sets a variable
   * @param {string} variable
   * @param {number} value
   */
  setVariable(variable, value) {
    this.variables["☁ " + variable] = value;
    this._send({
      user: this._client.username,
      method: "set",
      name: `☁ ${variable}`,
      value: String(value),
      project_id: this.projectId,
    });
  }
  variables = {}
}

module.exports = CloudConnection;
