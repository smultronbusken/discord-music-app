import { ButtonCommand } from "skeleton.djs";

export default new ButtonCommand(
    {
        customId: "skipButton",
    },
    async (interaction, ctx) => {
        let guildQueue = ctx.player.getQueue(interaction.guild.id);
        // if queue is empty doesnt work

        if (guildQueue.songs.length > 0)
            guildQueue.skip();
        interaction.deferUpdate();
    }
)