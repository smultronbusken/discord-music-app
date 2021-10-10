
import { SlashCommand } from "base-app-for-discordjs/src/Jobs";
import MusicApp from "../main";

export default new SlashCommand<MusicApp>( {
    name: "queue",
    info: "Show the song queue",
    execute(interaction, app) {
        let subscription = app.getSubscription(interaction.guildId)
        if (subscription) {
            if (subscription.queue.isEmpty)
                interaction.reply("There are no queued songs!")
            else {
                if (subscription.currentlyPlaying) {
                    interaction.reply("Queue:" + `\n ${1}. ${subscription.currentlyPlaying.title} (playing)`  + subscription.queue.data.map((song, index) => { return `\n ${index +2}. ${song.title}`}))
                }
                else {
                    interaction.reply("Queue:" + subscription.queue.data.map((song, index) => { return `\n ${index + 1}. ${song.title}`}))
                }
            }
        } else {

        }
        


    }
})