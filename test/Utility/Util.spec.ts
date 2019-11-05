import config from "../../src/config";
import { Message, User, Member, Guild, TextChannel } from "eris";

import { getUserByMessage, getLoveUsers, getHighestRole, getChannelByName, getPrimaryColorFromImageUrl } from "../../src/utility/Util";

import { expect } from "chai";
import "mocha";

const MockRoles = [
	{ id: "1", name: "Moderator", position: 5 },
	{ id: "2", name: "Green", position: 3 },
	{ id: "3", name: "Regular", position: 2 },
];

const MockChannels = [{
	id: "1",
	name: "Bot Channel",
}, {
	id: "2",
	name: "General",
}, {
	id: "3",
	name: "Images",
}];

const MockGuild = {
	members: [
		{id: "1", username: "Tromo", nick: "Pasta Strainer"},
		{id: "2", username: "Jim", nick: "Halpert"},
		{id: "3", username: "Rhett", nick: "Rhettster"},
		{id: "4", username: "Link", nick: "LikesKnives"},
		{id: "5", username: "Claire", nick: "FromTheBonAppetitTestKitchen"},
	],
	roles: MockRoles,
};

const MockUser = { id: "1", username: "Tromo", nick: "Pasta Strainer", roles: MockRoles.map((x) => x.id) };

const MockMessage = {
	author: {id: "1", username: "Tromo", nick: "Pasta Strainer", roles: MockRoles},
	member: {id: "1", username: "Tromo", nick: "Pasta Strainer", roles: MockRoles},
	mentions: [
		{id: "1", username: "Tromo", nick: "Pasta Strainer"},
		{id: "2", username: "Jim", nick: "Halpert"},
	],
	channel: {
		guild: MockGuild,
	},
};

describe('Utility Functions', () => {
	describe('Finding user by message', () => {
		let mockMessage: Message;

		beforeEach(() => {
			(mockMessage as any) = MockMessage;
		});

		it('should find with username', () => {
			let member = getUserByMessage(mockMessage, ["tromo"]);
			expect(member?.id).to.equal("1");

			member = getUserByMessage(mockMessage, ["RHETT"]);
			expect(member?.id).to.equal("3");

			member = getUserByMessage(mockMessage, ["cLaIrE"]);
			expect(member?.id).to.equal("5");
		});

		it('should find with nickname', () => {
			let member = getUserByMessage(mockMessage, ["Pasta"]);
			expect(member?.id).to.equal("1");

			member = getUserByMessage(mockMessage, ["Rhettster"]);
			expect(member?.id).to.equal("3");

			member = getUserByMessage(mockMessage, ["bonappetit"]);
			expect(member?.id).to.equal("5");
		});

		it('should handle mentions', () => {
			let member = getUserByMessage(mockMessage, ["<@!1>"]);
			expect(member?.id).to.equal("1");
		});

		it('should return the member if no args', () => {
			let member = getUserByMessage(mockMessage, []);
			expect(member?.id).to.equal(mockMessage.author.id);
		});

		it('should return undefined if no one found', () => {
			let member = getUserByMessage(mockMessage, new Array(25).fill(":)"));
			expect(member).to.be.undefined;
		});
	});

	describe('Getting pair of users', () => {
		let mockMessage: Message;

		beforeEach(() => {
			(mockMessage as any) = MockMessage;
		});

		it('should find with username', () => {
			const members = getLoveUsers(mockMessage, ["tromo", "jim"]);
			expect(members.first?.id).to.equal("1");
			expect(members.second?.id).to.equal("2");
		});

		it('should find with mentions', () => {
			const members = getLoveUsers(mockMessage, ["<@!1>", "<@!2>"]);
			expect(members.first?.id).to.equal("1");
			expect(members.second?.id).to.equal("2");
		});

		it('should find with mixed mention and username', () => {
			let members = getLoveUsers(mockMessage, ["<@!1>", "jim"]);
			expect(members.first?.id).to.equal("1");
			expect(members.second?.id).to.equal("2");
		});
	});

	describe('Getting highest role of user', () => {
		let mockGuild: Guild;
		let mockUser: Member;

		beforeEach(() => {
			(mockGuild as any) = MockGuild;
			(mockUser as any) = MockUser;
		});

		it('should return highest role', () => {
			const role = getHighestRole(mockGuild, mockUser);
			expect(role?.id).to.equal("1");
		});
	});

	describe('Finding matching channel', () => {
		let mockChannels: TextChannel[];

		beforeEach(() => {
			(mockChannels as any) = MockChannels;
		});

		it('should find channel by name', () => {
			let channel = getChannelByName(mockChannels, "General");
			expect(channel?.id).to.equal("2");

			channel = getChannelByName(mockChannels, "Bot");
			expect(channel?.id).to.equal("1");
		});
	});

	it('Getting image from url', async () => {
		const color = await getPrimaryColorFromImageUrl("https://tro.moe/img/HonkConfused.png");
		expect(typeof color).to.equal("number");
	});
});