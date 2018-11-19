const assert = require("assert");
const _ = require("lodash");

class BotState {
  constructor() {
    this.validateEnvVars();
  }

  validateEnvVars() {
    // Note: you can get this value from https://twitchapps.com/tmi
    assert(
      !_.isNil(process.env.OAUTH),
      'You must have process.env.OAUTH set. Do not include "oauth:" in it.'
    );

    // https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843#.ayhi6728x
    assert(
      !_.isNil(process.env.CLIENT_ID),
      "You must have process.env.CLIENT_ID set."
    );

    assert(
      !_.isNil(process.env.CHANNEL_NAME),
      "You must have process.env.CHANNEL_NAME set."
    );
    assert(
      !_.isNil(process.env.USER_NAME),
      "You must have process.env.USER_NAME set."
    );

    this.oauth = process.env.OAUTH;
    this.clientId = process.env.CLIENT_ID;
    this.channelName = process.env.CHANNEL_NAME;
    this.userName = process.env.USER_NAME;
  }
}

module.exports = BotState;
