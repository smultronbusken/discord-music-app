import { Client, Collection, GatewayIntentBits, Snowflake, StageChannel, VoiceChannel } from "discord.js";
import { Skeleton, SlashCommand, number } from 'skeleton.djs';
import { Player, RepeatMode } from '@jadestudios/discord-music-player';
import { songQueue } from "./embeds";

export type AppContext = {
    player: Player,
    client: Client
}

import("../config.json").then(config => {
    const intents = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] }

    const skeleton = new Skeleton();
    const client = new Client(intents);
    const player = new Player(client);
    
    player
    // Emitted when channel was empty.
    .on('channelEmpty',  (queue) =>
        console.log(`Everyone left the Voice Channel, queue ended.`))
    // Emitted when a song was added to the queue.
    .on('songAdd',  (queue, song) =>
        console.log(`Song ${song} was added to the queue.`))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    // Emitted when there was no more music to play.
    .on('queueDestroyed',  (queue) =>
        console.log(`The queue was destroyed.`))
    // Emitted when the queue was destroyed (either by ending or stopping).    
    .on('queueEnd',  (queue) =>
        console.log(`The queue has ended.`))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        console.log(`${newSong} is now playing.`))
    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) =>
        console.log(`Started playing ${song}.`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        console.log(`I was kicked from the Voice Channel, queue ended.`))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        console.log(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });

    skeleton.addCommand(new SlashCommand(
        {
            name: "skip",
            description: "Skip the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            if (guildQueue.songs.length > 0)
            guildQueue.skip();
        } 
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "queue",
            description: "Shows the current song queue."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            if (guildQueue?.songs.length > 0) {
                let embed = songQueue(guildQueue.songs)
                interaction.reply({ embeds: [embed]});
            }
            interaction.reply("Queue empty.")
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
            description: "Set the volume",
            required: true
        })
    ));
    
    skeleton.addCommand(new SlashCommand(
        {
            name: "seek",
            description: "Seek to a position in the current song."
        },
        async (interaction, ctx) => {
            let guildQueue = ctx.player.getQueue(interaction.guild.id);
            guildQueue.seek(interaction.options.get('seconds').value as number * 1000);
        },
        number({
            name: "seconds",
            description: "Set the current time",
            required: true
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
            description: "Remove",
            required: true
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


