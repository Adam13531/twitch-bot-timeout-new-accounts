const TMIClient = require("./tmiclient");
const BotState = require("./botstate");
const _ = require("lodash");
const request = require("superagent");
const differenceInDays = require("date-fns/difference_in_days");
const differenceInSeconds = require("date-fns/difference_in_seconds");
const addDays = require("date-fns/add_days");
const hdate = require("human-date");

// Unhandled Promise rejections. Just keep trying to run since this bot does so
// little that it's probably not fatal.
process.on("unhandledRejection", error => {
  console.error("unhandledRejection", error);
});

class Main {
  constructor() {
    this.botState = new BotState();

    /**
     * A cache of creation dates so that we don't have to reach out to the API
     * for users who continually chat.
     *
     * Keys: lowercase user names.
     *
     * Values: their creation dates.
     * @type {Object<string, string>}
     */
    this.users = {};

    /**
     * The age (in days) of an account before it's allowed to chat.
     * @type {number}
     */
    this.numDaysBeforeBeingAllowedToChat = 7;
  }

  /**
   * Reads the user's creation date from the cache if it's there, and if not,
   * fetch it from Twitch and then cache it.
   * @type {string} username
   * @type {string} userId
   * @return {string} a string like "2013-08-04T08:50:34.034022Z"
   */
  async getOrFetchCreationDate(username, userId) {
    let creationDate = this.users[username];
    if (_.isNil(creationDate)) {
      creationDate = await this.getUserCreationDateFromTwitch(userId);
    }

    return creationDate;
  }

  /**
   * Fetch a user's creation date.
   * @see https://dev.twitch.tv/docs/v5/reference/users/#get-user
   * @param {string} userId - the user's ID
   * @return {string} a string like "2013-08-04T08:50:34.034022Z"
   */
  async getUserCreationDateFromTwitch(userId) {
    // The stupid new API can't fetch creation date (code commented just below
    // this line), so we have to use the V5 API ("kraken").
    //
    // const url = `https://api.twitch.tv/helix/users?id=${userId}`;

    const url = `https://api.twitch.tv/kraken/users/${userId}`;
    const res = await request
      .get(url)
      .set("Client-ID", this.botState.clientId)
      .set("accept", "application/vnd.twitchtv.v5+json");

    return res.body.created_at;
  }

  /**
   * Timeout a particular user based on their creation date.
   */
  timeoutUser(username, creationDate) {
    const dateAllowedToChat = addDays(
      creationDate,
      this.numDaysBeforeBeingAllowedToChat
    );
    const numSecondsRemaining = differenceInSeconds(
      dateAllowedToChat,
      Date.now()
    );

    const thresholdFriendlyString = `${
      this.numDaysBeforeBeingAllowedToChat
    } days old`;

    this.tmiClient.timeout(
      this.botState.channelName,
      username,
      numSecondsRemaining,
      `Accounts newer than ${thresholdFriendlyString} not allowed to chat yet.`
    );

    const humanReadableTimeRemaining = hdate.relativeTime(numSecondsRemaining);
    this.tmiClient.say(
      this.botState.channelName,
      `Timed out ${username} until ${humanReadableTimeRemaining} because their account is less than ${thresholdFriendlyString}.`
    );
  }

  /**
   * @see https://docs.tmijs.org/v1.2.1/Events.html#chat
   */
  async onChatMessage(channel, userstate, message, self) {
    // Ignore messages from the bot.
    if (self) return;

    const username = userstate.username.toLowerCase();
    const creationDate = await this.getOrFetchCreationDate(
      username,
      userstate["user-id"]
    );
    const numDaysSinceCreation = differenceInDays(Date.now(), creationDate);

    if (numDaysSinceCreation < this.numDaysBeforeBeingAllowedToChat) {
      this.timeoutUser(username, creationDate);
    }
  }

  async initialize() {
    const tmiClientWrapper = new TMIClient(this.botState);
    await tmiClientWrapper.connect();

    this.tmiClient = tmiClientWrapper.getClient();
    this.tmiClient.on("chat", this.onChatMessage.bind(this));
  }
}

const main = new Main();
main
  .initialize()
  .then(() => {
    console.log("Client connected");
  })
  .catch(error => {
    console.error("Error connecting:", error);
  });
