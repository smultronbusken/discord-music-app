import { SlashCommand } from "base-app-for-discordjs/src/Jobs";
import MusicApp from "../main";

export default new SlashCommand<MusicApp>( {
    name: "skip",
    info: "Skips the current song.",
    execute(interaction, app) {
        let subscription = app.getSubscription(interaction.guildId)
        if (subscription) {
            let nextSong = subscription.queue.dequeue();
            if (nextSong) {
                subscription.playSong(nextSong)
                interaction.reply(`🎶 Now playing **${nextSong.title}**`)
            } else {
                subscription.stop()
                interaction.reply("Skipped.")
            }
        } 
    }
})