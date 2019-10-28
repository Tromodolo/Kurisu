import { Client, Message } from "eris";
import { EventEmitter } from "events";

export default class ResponseListener extends EventEmitter{
	private client: Client;
	private _userId: string;

	constructor(client: Client, userId: string, time: number = 60000){
		super();
		this.messageEvent = this.messageEvent.bind(this);
		this.client = client;
		this._userId = userId;

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
		if (message.author.id === this._userId){
			this.emit("response", message);
		}
	}
}