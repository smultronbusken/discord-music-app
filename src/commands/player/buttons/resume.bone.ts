import { ButtonCommand } from "skeleton.djs";

export default new ButtonCommand(
    {
        customId: "resumeButton",
    },
    async (interaction, ctx) => {
        let guildQueue = ctx.player.getQueue(interaction.guild.id);
        guildQueue.setPaused(false);
        interaction.deferUpdate();
    }
)