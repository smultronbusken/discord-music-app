import { Client, Collection, GatewayIntentBits, Snowflake, StageChannel, VoiceChannel } from "discord.js";
import { Skeleton, SlashCommand, number } from 'skeleton.djs';
import { Player, RepeatMode } from '@jadestudios/discord-music-player';

export type AppContext = {
    player: Player,
    client: Client
}

import("../config.json").then(config => {
    const intents = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] }

    const skeleton = new Skeleton();
    const client = new Client(intents);
    const player = new Player(client);
    skeleton.addCommand(new SlashCommand(
        {
            name: "skip",
            description: "Skip the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.skip();
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "stop",
            description: "Stop the music and clear the queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.stop();
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "removeloop",
            description: "Remove the current loop."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setRepeatMode(RepeatMode.DISABLED);
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "toggleloop",
            description: "Toggle loop for the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setRepeatMode(RepeatMode.SONG);
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "togglequeueloop",
            description: "Toggle loop for the entire queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setRepeatMode(RepeatMode.QUEUE);
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "setvolume",
            description: "Set the volume."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setVolume(interaction.options.get('volume').value as number);
        },
        number({
            name: "volume",
            description: "Set the volume"
        })
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "seek",
            description: "Seek to a position in the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.seek(interaction.options.get('volume').value as number * 1000);
        },
        number({
            name: "seconds",
            description: "Set the current time"
        })
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "clearqueue",
            description: "Clear the current queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.clearQueue();
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "shuffle",
            description: "Shuffle the current queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.shuffle();
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "pause",
            description: "Pause the music."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setPaused(true);
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "resume",
            description: "Resume the music."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.setPaused(false);
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "remove",
            description: "Remove a song from the queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.remove(interaction.options.get('index').value as number);
        },
        number({
            name: "index",
            description: "Remove "
        })
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "createprogressbar",
            description: "Create a progress bar for the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            const ProgressBar = guildQueue.createProgressBar();
            interaction.reply(ProgressBar.prettier); // Assuming interaction.reply is the method to reply back
        } 
    ));
    

    // Set what will be passed to commands when executed
    skeleton.attachClient(client)
    skeleton.setContext({
        player,
        client
    });
    
    // This imports all command files and deploys them
    skeleton.run({
      appId: config["APP_ID"],
      client: client,
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"], // Optional, if you're using a dev guild.
    });
})


