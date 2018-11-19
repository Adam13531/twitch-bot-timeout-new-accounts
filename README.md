# twitch-bot-timeout-new-accounts
This is a single-channel Twitch bot that times out accounts that have been created too recently. For example, if you only want accounts older than 7 days to be able to chat and a 3-day-old account types something, it will be timed out for 4 days.

This bot was only intended to be foundational code, so while it does what it's supposed to do, there are a lot of improvements that could be made, e.g.:

* Allow a whitelist of users so that the bot doesn't just keep timing them out.
* Allow this to work in multiple channels at a time (e.g. Nightbot).
* Persist the cache to disk so that returning chatters don't trigger additional Twitch API calls.
* Allow for dynamic configuration via chat commands.

# Installation
1. Make sure you have Node and Yarn on your system.
2. `yarn`
3. Set environment variables for [`OAUTH`](https://twitchapps.com/tmi/), [`CLIENT_ID`](https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843), `CHANNEL_NAME`, and `USER_NAME`.

# Running / configuration
Run via `yarn start`.

The threshold in days before an account is allowed to chat is hard-coded as `numDaysBeforeBeingAllowedToChat` in `main.js`.
