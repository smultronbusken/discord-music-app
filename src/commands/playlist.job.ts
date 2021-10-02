
import { SlashCommand } from "base-app-for-discordjs/src/Jobs";
import { ApplicationCommandOptionType } from "discord-api-types";
import ytdl from "ytdl-core";
import MusicApp from "../main";
import Queue from "../Queue";
import Song from "../Song";

export default new SlashCommand<MusicApp>( {
    name: "playlist",
    info: "Plays a playlist.",
    options: [
        {
            name: "name",
            description: "Name of the playlist to play",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    async execute(interaction, app) {

        let playlistName = interaction.options.getString("name")
        let playlist: Array<string> = app.skeleton.getStorage("playlists").get(playlistName).value()


        let subscription = app.getSubscription(interaction.guildId)
        if (!subscription) {
            const guild = app.skeleton.client.guilds.cache.get(interaction.guildId)
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            subscription = app.createSubscription(interaction.guildId, voiceChannel)
        }

        subscription.queue = new Queue()

        for (const url of playlist) {
            let song: Song;
            //If the first argument is a link. Set the song object to have two keys. Title and URl.
            if (ytdl.validateURL(url)) {
                const song_info = await ytdl.getInfo(url);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
                interaction.channel.send(`🎶 Queued **${song.title}**`)
                subscription.queue.enqueue({
                    url: song.url,
                    title: song.title
                })
            } 
        }
        let nextSong = subscription.queue.dequeue();
        subscription.playSong(nextSong)
        interaction.reply(`🎶 Now playing **${nextSong.title}**`)
        



    }


})