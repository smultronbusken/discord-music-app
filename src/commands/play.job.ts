import { SlashCommand } from "base-app-for-discordjs/src/Jobs";
import { ApplicationCommandOptionType } from "discord-api-types";
import yts from "yt-search";
import ytdl from "ytdl-core";
import MusicApp from "../main";

export default new SlashCommand<MusicApp>( {
    name: "play",
    info: "Play a song",
    options: [
        {
            name: "songname",
            description: "Link or search term",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    async execute(interaction, app) {

        let song: any = {}

        let desiredSong = interaction.options.getString("songname")
        interaction.reply('Searching for song.');

        //If the first argument is a link. Set the song object to have two keys. Title and URl.
        if (ytdl.validateURL(desiredSong)) {
            const song_info = await ytdl.getInfo(desiredSong);
             song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }

        } else {
            //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
            const video_finder = async (query) =>{
                const video_result = await yts(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }

            const video = await video_finder(desiredSong);
            if (video){
                song = { title: video.title, url: video.url }

            } else {
                interaction.followUp('Error finding video.');
            }
        }


        if (song) {
            let subscription = app.getSubscription(interaction.guildId)
            if (subscription && !subscription.empty) {
                subscription.queue.enqueue(song)
                interaction.followUp(`🎶 Queued **${song.title}**`)
            } else {

                const guild = app.skeleton.client.guilds.cache.get(interaction.guildId)
                const member = guild.members.cache.get(interaction.member.user.id);
                const voiceChannel = member.voice.channel;

                app.playSongInGuild(song, interaction.guildId, voiceChannel)
                interaction.followUp(`🎶 Now playing **${song.title}**`)
            }
    
            return 1
        }
        return 1

    }


})