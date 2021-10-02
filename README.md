# Music app for Discord

Just a simple music app capable of playing music from YouTube.
Made using my [discord.js](discord.js) and my own "add on" for discord.js, [base-app-for-discordjs](https://github.com/smultronbusken/base-app-for-discordjs).

## Commands

- **play**
  Send either a search term or a link to the video
- **queue**
  Displays the current queue
- **clear**
  Clear the queue
- **skip**
  Skip the current song
- **playlist**
  Queues a list of songs. These are stored in playlist.storage.json

## Requirements

- [FFMpeg](https://ffmpeg.org/)

## Usage

* Clone project
* Create a config.json in the root folder that looks like: 

```json
{
    "APP_TOKEN": "your app token",
    "APP_ID": "your app id",
    "DEV_GUILD_ID": "a guild for testing commands"
}
```

* run `npm install`

* run `ts-node src/main.ts`


### Playlists

If you want playlists then create a file `playlists.storage.json` that looks like

```json
{
  "name": "playlists",
  "Chill": [
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0"
  ],
  "Hype": [
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0"
  ]
}
```

