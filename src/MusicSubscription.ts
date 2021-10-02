import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice"
import { raw as ytdl } from "youtube-dl-exec"
import Queue from "./Queue"
import Song from "./Song"


export default class MusicSubscription {

    public readonly voiceConnection: VoiceConnection
    public readonly audioPlayer: AudioPlayer
    public queue: Queue<Song>
    public readyLock = false
	public currentlyPlaying: Song;


	public get empty() {
		return !this.currentlyPlaying && this.queue.isEmpty
	}

    constructor(voiceConnection: VoiceConnection) {

		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.queue = new Queue();

		this.voiceConnection.on('stateChange', async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					/*
						If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						but there is a chance the connection will recover itself if the reason of the disconnect was due to
						switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						the voice connection.
					*/
					try {
						await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
						// Probably moved voice channel
					} catch {
						this.voiceConnection.destroy();
						// Probably removed from voice channel
					}
				} else if (this.voiceConnection.rejoinAttempts < 5) {
					/*
						The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					*/
					this.voiceConnection.rejoin();
				} else {
					/*
						The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					*/
					this.voiceConnection.destroy();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				/*
					Once destroyed, stop the subscription
				*/
				this.stop();
			} else if (
				!this.readyLock &&
				(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
			) {
				/*
					In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
					before destroying the voice connection. This stops the voice connection permanently existing in one of these
					states.
				*/
				this.readyLock = true;
				try {
					await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		// Configure audio player
		this.audioPlayer.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				this.currentlyPlaying = undefined;
                if (!this.queue.isEmpty) {
                    let nextSong = this.queue.dequeue()
                    this.playSong(nextSong)
                }
				
			} else if (newState.status === AudioPlayerStatus.Playing) {
                console.log("Audio player is ready!")
			}
		});

        voiceConnection.subscribe(this.audioPlayer)

    }

    async playSong(song: Song) {
        const stream = ytdl(song.url, {
            o: '-',
            q: '',
            f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
            r: '100K',
          }, { stdio: ['ignore', 'pipe', 'ignore'] })

        let audioSource = createAudioResource(stream.stdout, {
            metadata: {
                title: 'A good song!',
            },
        });

		this.currentlyPlaying = song;
        this.audioPlayer.play(audioSource)   
    }

    stop() {
        this.audioPlayer.stop(true)
    }

}

