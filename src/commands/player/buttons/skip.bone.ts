import { ButtonCommand } from "skeleton.djs";

export default new ButtonCommand(
    {
        customId: "skipButton",
    },
    async (interaction, ctx) => {
        let guildQueue = ctx.player.getQueue(interaction.guild.id);
        guildQueue.skip();
        interaction.deferUpdate();
    }
)