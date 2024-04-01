import { ButtonCommand } from "skeleton.djs";

export default new ButtonCommand(
    {
        customId: "pauseButton",
    },
    async (interaction, ctx) => {
        let guildQueue = ctx.player.getQueue(interaction.guild.id);
        guildQueue.setPaused(true);
        interaction.deferUpdate();
    }
)