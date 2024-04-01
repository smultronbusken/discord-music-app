import { SlashCommand, string } from "skeleton.djs";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { ApplicationCommandOptionType } from "discord.js";
import { AppContext } from "../main";

export default new SlashCommand( {
        name: "play",
        description: "Play a song",
    },
    async (interaction, ctx: AppContext) => {

        let desiredSong = interaction.options.get("songname").value as string;

        let guildQueue = ctx.player.getQueue(interaction.guild.id);
        
        let queue = ctx.player.createQueue(interaction.guild.id);
        const guild = ctx.client.guilds.cache.get(interaction.guild.id)
        const member = guild.members.cache.get(interaction.member.user.id);
        const voiceChannel = member.voice.channel;

        await queue.join(voiceChannel);

        let song = await queue.play(desiredSong).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
        });
    },
    string({
        name: "songname",
        description: "Link or search term",
        required: true,
    })
)