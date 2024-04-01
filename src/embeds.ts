import { Song } from "@jadestudios/discord-music-player";
import { APIEmbed, Colors } from "discord.js";

export  function songEmbed(song: Song): APIEmbed {
    let embed: APIEmbed = {
        color: Colors.Aqua,
        title: song.name,
        author: {
          name: song.author,
        },
      };
      return embed
}

export  function songQueue(songs: Song[]): APIEmbed {
  let desc = ""
  songs.forEach((s) => desc +=  s.name + " \n")
  let embed: APIEmbed = {
      color: Colors.Aqua,
      title: "Song queue",
      description: desc
    };
    return embed
}