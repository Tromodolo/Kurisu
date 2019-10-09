import { EventEmitter } from "events";
import { Client, Message, Emoji } from "eris";

export class ResponseHandler extends EventEmitter{
	private client: Client;
	private message: Message;

	constructor(client: Client, message: Message, time: number = 60000){
		super();
		this.messageEvent = this.messageEvent.bind(this);

		this.client = client;
		this.message = message;

		this.client.on("messageCreate", this.messageEvent);

		if (time !== 0){
			setTimeout(() => this.stopListening(), time);
		}
	}

	public stopListening(){
		this.client.off("messageCreate", this.messageEvent);
		this.emit("stopListening");
	}

	private messageEvent(message: Message){
		if (this.message.member!.id === message.member!.id){
			this.emit("response", message);
		}
	}
}