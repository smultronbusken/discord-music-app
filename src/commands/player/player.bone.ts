import { SlashCommand, UserCommand, button, group, row, selectString, string, text } from "skeleton.djs";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { APISelectMenuOption, ApplicationCommandOptionType, ButtonStyle } from "discord.js";
import { AppContext } from "../../main";
import { songQueue} from "../../embeds";

export default new UserCommand( {
        name: "Show player",
    },
    async (interaction, ctx: AppContext) => {
        let guildQueue = ctx.player.getQueue(interaction.guild.id);

        let pauseButton = button({
            custom_id: "resumeButton",
            label: "Resume",
            style: ButtonStyle.Primary
        })

        let playButton = button({
            custom_id: "pauseButton",
            label: "Pause",
            style: ButtonStyle.Primary
        })

        let skipButton = button({
            custom_id: "skipButton",
            label: "Skip",
            style: ButtonStyle.Primary
        })

        if (guildQueue?.songs.length > 0) {
            let embed = songQueue(guildQueue.songs)
            interaction.reply({ components: [row(playButton, pauseButton, skipButton)], embeds: [embed]});
        } else {
            interaction.reply({ components: [row(playButton, pauseButton, skipButton), ] });
        }
    }
)