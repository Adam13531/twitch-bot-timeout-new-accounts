const irc = require("tmi.js");

class TMIClient {
  constructor(botState) {
    // This is returned from TMI.js.
    this.client = null;

    this.botState = botState;
  }

  getClient() {
    return this.client;
  }

  connect() {
    const options = {
      options: {
        debug: true,
        clientId: this.botState.clientId
      },
      connection: {
        cluster: "aws",
        reconnect: true
      },
      identity: {
        username: this.botState.userName,
        password: this.botState.oauth
      },
      channels: ["#" + this.botState.channelName]
    };

    this.client = new irc.client(options);

    // Reconnects should happen automatically as specified by the options passed
    // in when creating the client.
    this.client.on("disconnected", reason => {
      console.log("Chat client disconnected: " + reason);
    });

    // Connect the client to the server..
    return this.client.connect();
  }
}

module.exports = TMIClient;
