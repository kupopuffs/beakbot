Yo, our bots suck. How hard is it?

I wouldn't know, I stole this from [Gabriel Tanner](https://gabrieltanner.org/blog/dicord-music-bot)

install [nodejs](https://nodejs.org/en/download/)

I would use nvm (https://github.com/nvm-sh/nvm)

setup a token.json like so:
```
{
    "token": "BOT-TOKEN-HERE"
}
```

install discord.js
```
npm install discord.js ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core --save
```

run with
```
node index.js
```

how to use
```
bb p https://www.youtube.com/watch?v=HtspUTgfgDY
```