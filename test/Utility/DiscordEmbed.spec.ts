import config from "../../src/config";
import { DiscordEmbed } from '../../src/utility/DiscordEmbed';

import { expect } from "chai";
import "mocha";

describe('DiscordEmbed', () => {
	let embed: DiscordEmbed;
	const date = new Date();
	const compareEmbed = {
		embed: {
			title: "Title",
			description: "Description",
			url: "URL",
			color: 100000,
			timestamp: date.toISOString(),
			footer: {
				icon_url: "URL",
				text: "Footer",
			},
			thumbnail: {
				url: "URL",
			},
			image: {
				url: "URL",
			},
			author: {
				name: "Author",
				url: "URL",
				icon_url: "Icon_URL",
			},
			fields: [
				{
					name: "Field1",
					value: "FieldDescription",
				},
				{
					name: "Field2",
					value: "FieldDescription",
					inline: true,
				},
			],
		},
	};

	beforeEach(() => {
		embed = new DiscordEmbed();
	});

	it('should be be able to set all properties', () => {
		embed.setTitle("Title");
		embed.setDescription("Description");
		embed.setUrl("URL");
		embed.setColor(100000);
		embed.setTimestamp(date);
		embed.setFooter("Footer", "URL");
		embed.setThumbnail("URL");
		embed.setImage("URL");
		embed.setAuthor("Author", "URL", "Icon_URL");
		embed.addField("Field1", "FieldDescription");
		embed.addField("Field2", "FieldDescription", true);
	});

	it('should let you skip optional parameters', () => {
		embed.setFooter("Footer");
		embed.setAuthor("Author");
		embed.addField("Field1", "FieldDescription");
	});

	it("should return a valid embed JSON", () => {
		embed.setTitle("Title");
		embed.setDescription("Description");
		embed.setUrl("URL");
		embed.setColor(100000);
		embed.setTimestamp(date);
		embed.setFooter("Footer", "URL");
		embed.setThumbnail("URL");
		embed.setImage("URL");
		embed.setAuthor("Author", "URL", "Icon_URL");
		embed.addField("Field1", "FieldDescription");
		embed.addField("Field2", "FieldDescription", true);

		expect(embed.getEmbed()).to.deep.equal(compareEmbed);
	});
});