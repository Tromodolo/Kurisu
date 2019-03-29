/**
 * DiscordEmbed.ts
 *
 * Contains the DiscordEmbed class which can be used for making embedded text messages
 *
 */

/**
 * Creates a embeded message
 *
 * TODO - add descriptions to JSDoc
 * @class DiscordEmbed
 * @prop { string } title
 * @prop { string } description
 * @prop { string } url
 * @prop { number } color
 * @prop { string } timestamp
 * @prop { Footer } footer
 * @prop { Thumbnail } thumbnail
 * @prop { Image } image
 * @prop { Author } author
 * @prop { Field[] } fields
 */
class DiscordEmbed{
	private title?: string;
	private description?: string;
	private url?: string;
	private color?: number;
	private timestamp?: string;
	private footer?: {
		icon_url?: string,
		text?: string,
	};
	private thumbnail?: {
		url?: string,
	};
	private image?: {
		url?: string,
	};
	private author?: {
		name: string,
		url?: string,
		icon_url?: string,
	};
	private fields?: Array<{
		name: string,
		value: string,
		inline: boolean,
	}>;

	/**
	 * @param { string } title set the title field
	 */
	public setTitle(title: string) {
		this.title = title;
	}

	/**
	 * @param { string } description set the description field
	 */
	public  setDescription(description: string) {
		this.description = description;
	}

	/**
	 * @param { string } url set the url field
	 */
	public  setUrl(url: string) {
		this.url = url;
	}

	/**
	 * @param { string } color set the color field
	 */
	public  setColor(color: number) {
		this.color = color;
	}

	/**
	 * @param { string } timestamp set the timestamp field
	 */
	public setTimestamp(timestamp: string) {
		this.timestamp = timestamp;
	}

	/**
	 * @param { string } icon_url set the icon_url of a footer
	 * @param { string } text set the text field of the footer
	 */
	public setFooter(icon_url: string, text: string) {
		this.footer = {
			icon_url,
			text,
		 };
	}

	/**
	 * @param { string } url set the url of the thumbnail image
	 */
	public setThumbnail(url: string) {
		this.thumbnail = {
			url,
		};
	}

	/**
	 * @param { string } url set the url of the image
	 */
	public setImage(url: string) {
		this.image = {
			url,
		};
	}

	/**
	 * @param { string } name set the title field of the author section
	 * @param { string } url add a link to the author text
	 * @param { string } icon_url add a image next to the author text
	 */
	public  setAuthor(name: string, url: string, icon_url: string) {
		this.author = {
			name,
			url,
			icon_url,
		};
	}

	/**
	 * Might change this later to take in a (name[], value[], inline[])
	 *
	 * @param { Field[] } fields An array of Field objects
	 */
	public setFields(fields: Array<{name: string, value: string, inline: boolean}>) {
		this.fields = fields;
	}

	/**
	 * Adds a field to the current embed instance
	 *
	 * @param { string } name Name of field
	 * @param { string } value Value of field
	 * @param { boolean } [ inline ] inline Whether or not the field should be inline
	 */
	public addField(name: string, value: string, inline?: boolean) {
		const newField = {
			name,
			value,
			inline,
		};
		this.fields.push(newField);
	}

	/**
	 * get the Embed object
	 *
	 * @returns { EmbedObject }An Embed object
	 */
	public getEmbed(){
		const embed: any = {};

		if (this.title) {
			embed.title = this.title;
		}

		if (this.description) {
			embed.description = this.description;
		}

		if (this.url) {
			embed.url = this.url;
		}

		if (this.color) {
			embed.color = this.color;
		}

		if (this.timestamp) {
			embed.timestamp = this.timestamp;
		}

		if (this.footer) {
			embed.footer = this.footer;
		}

		if (this.thumbnail) {
			embed.thumbnail = this.thumbnail;
		}

		if (this.image) {
			embed.image = this.image;
		}

		if (this.author) {
			embed.author = this.author;
		}

		embed.fields = this.fields;

		const fullEmbed = { embed };
		return fullEmbed;
	}
}

export {
	DiscordEmbed,
};
