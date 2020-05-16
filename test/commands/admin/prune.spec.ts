
import { expect } from "chai";
import "mocha";
import { createMock } from "ts-auto-mock";

import { Message,TextableChannel, TextChannel } from "eris";
import PruneCommand from "../../../src/commands/admin/prune";
import { Bot } from "../../../src/bot";

describe('Prune', () => {
	let mockMessage: Message;
	let messageList: Array<Message<TextableChannel>>;
	let botMock: Bot;
	let pruneCommand: PruneCommand;

	beforeEach(() => {
		mockMessage = createMock<Message>();
		botMock = createMock<Bot>();
		messageList = Array(150);
		messageList.fill(createMock<Message>(), 0, -1);

		botMock.client.deleteMessages = async (channelID: string, messageIDs: string[], reason?: string) => {
			messageList.splice(0, messageIDs.length - 1);
		};
		mockMessage.channel.getMessages = async (limit?: number, before?: string, after?: string, around?: string) => {
			const messages: Array<Message<TextChannel>> = Array(limit);
			messages.fill(createMock<Message<TextChannel>>(), 0, -1);
			return messages;
		};

		pruneCommand = new PruneCommand(botMock);
	});

	it('should prune the amount of messages specified', () => {
		mockMessage.content = "k>prune 5";
		pruneCommand.execute(mockMessage as Message, ["5"]).then(() => {
			expect(messageList.length).to.equal(145);
		});
	});

	it('should should default to 10 messages if unspecified', () => {
		mockMessage.content = "k>prune";
		pruneCommand.execute(mockMessage as Message, []).then(() => {
			expect(messageList.length).to.equal(140);
		});
	});

	it('should not allow more than 100 messages to be ', () => {
		mockMessage.content = "k>prune 200";
		pruneCommand.execute(mockMessage as Message, ["200"]).then(() => {
			expect(messageList.length).to.equal(50);
		});
	});
});
