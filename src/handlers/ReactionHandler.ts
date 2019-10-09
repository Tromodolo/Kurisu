import { EventEmitter } from "events";
import { Client, Message, Emoji } from "eris";

export class ReactionHandler extends EventEmitter{
	private client: Client;
	private message: Message;

	constructor(client: Client, message: Message, time: number = 60000){
		super();
		this.messageEvent = this.messageEvent.bind(this);

		this.client = client;
		this.message = message;

		this.client.on("messageReactionAdd", this.messageEvent);

		if (time !== 0){
			setTimeout(() => this.stopListening(), time);
		}
	}

	public stopListening(){
		this.client.off("messageReactionAdd", this.messageEvent);
		this.emit("stopListening");
	}

	private messageEvent(message: Message, emoji: Emoji, userId: string){
		if (this.message.id === message.id){
			this.emit("reactionAdd", message, emoji, userId);
		}
	}
}