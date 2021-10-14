import { SlashCommand } from "base-app-for-discordjs/src/Jobs";
import MusicApp from "../main";
import Queue from "../Queue";

export default new SlashCommand<MusicApp>({
    name: "clear",
    info: "clears the queue",
    execute(interaction, app) {
        let subscription = app.getSubscription(interaction.guildId)
        if (subscription) {
            subscription.queue = new Queue();
            interaction.reply("Cleared the queue.")
        } else {
            interaction.reply("You need to play a song before using this.")
        }
    }
})