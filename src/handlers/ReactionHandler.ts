import { EventEmitter } from "events";
import { Client, Message, Emoji } from "eris";

class ReactionHandler extends EventEmitter{
	private client: Client;
	private message: Message;

	constructor(client: Client, message: Message, time: number = 60000){
		super();
		this.messageEvent = this.messageEvent.bind(this);

		this.client = client;
		this.message = message;

		this.client.on("messageReactionAdd", this.messageEvent);

		setTimeout(() => this.stopListening(), time);
	}

	private messageEvent(message: Message, emoji: Emoji, userId: string){
		if (this.message.id === message.id){
			this.emit("reactionAdd", message, emoji, userId);
		}
	}

	private stopListening(){
		this.client.off("messageReactionAdd", this.messageEvent);
		this.emit("stopListening");
	}
}

export {
	ReactionHandler,
};