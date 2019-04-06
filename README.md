# twitch-bot-timeout-new-accounts
This is a single-channel Twitch bot that times out accounts that have been created too recently. For example, if you only want accounts older than 7 days to be able to chat and a 3-day-old account types something, it will be timed out for 4 days.

This bot was only intended to be foundational code, so while it does what it's supposed to do, there are a lot of improvements that could be made, e.g.:

* Allow a whitelist of users so that the bot doesn't just keep timing them out.
* Allow this to work in multiple channels at a time (e.g. Nightbot).
* Persist the cache to disk so that returning chatters don't trigger additional Twitch API calls.
* Allow for dynamic configuration via chat commands.

# Non-technical explanation of how to set this up
- The bot needs to be run *somewhere*, i.e. it's not like Nightbot where you can just add it to your channel.
- The bot can run as any user whose credentials you have. For example, if you stream as Adam13531, the bot can actually run *as you*, or you could make a new account altogether. It currently says a message like in [this picture](https://i.imgur.com/MWVEvi5.png), but that can be manually disabled if you want it to just silently run as you.
- If you want to run it on your own computer, then you would install [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/), then get the code (ZIP file here: https://github.com/Adam13531/twitch-bot-timeout-new-accounts/archive/master.zip), unzip it, then follow the installation and running instructions below.
- If you don't want to run it yourself, then you can get one of your mods to run it. This is great if they already have a server that they don't mind throwing a tiny Node process onto.
- The code is MIT-licensed, meaning anyone can modify it, use it, make money off of it, etc. without having to credit me.
- I had some free time and was happy to do what I did here, but I don't plan on maintaining this or adding new features.

# Installation
1. Make sure you have Node and Yarn on your system.
2. `yarn`
3. Set environment variables for [`OAUTH`](https://twitchapps.com/tmi/), [`CLIENT_ID`](https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843), `CHANNEL_NAME`, and `USER_NAME`.

# Running / configuration
Run via `yarn start`.

The threshold in days before an account is allowed to chat is hard-coded as `numDaysBeforeBeingAllowedToChat` in `main.js`.
