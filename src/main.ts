import {
    joinVoiceChannel
} from '@discordjs/voice';
import { Collection, Intents, Snowflake, StageChannel, VoiceChannel } from "discord.js";
import MusicSubscription from "./MusicSubscription";
import Song from "./Song";

import Skeleton from "base-app-for-discordjs/src/Skeleton"



export default class MusicApp {

    public subscriptions: Collection<Snowflake, MusicSubscription> = new Collection();

    public skeleton: Skeleton<MusicApp>;

    getSubscription(guildId: Snowflake) {
        return this.subscriptions.get(guildId)
    }
    
    createSubscription(guildId: Snowflake, voiceChannel: VoiceChannel | StageChannel) {
        if (!voiceChannel) return undefined
        const permissions = voiceChannel.permissionsFor(this.skeleton.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            console.log("No permission for guild " + guildId)
            return undefined
        }
        let voiceConnection =  joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        let subscription = new MusicSubscription(voiceConnection)
        this.subscriptions.set(guildId, subscription)
        return subscription;
    }

    async playSongInGuild(song: Song, guildId: Snowflake, voiceChannel?: VoiceChannel | StageChannel) {
        let subscription: MusicSubscription = this.subscriptions.get(guildId)
        if (!subscription) {
            subscription = this.createSubscription(guildId, voiceChannel)
        }
        subscription.playSong(song)
    }
}

let app = new MusicApp()

import("../config.json").then(config => {
    const intents = { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] }
    const skeleton = new Skeleton(
        app, 
        config["APP_TOKEN"],
        config["APP_ID"],
        intents,
        config["DEV_GUILD_ID"]
      );
      skeleton.client.login(config["APP_TOKEN"]);
      app.skeleton = skeleton
})