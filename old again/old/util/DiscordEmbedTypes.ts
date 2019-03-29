/*
* DiscordEmbedTypes.ts
*
* Contains the object definitions of the types used within DiscordEmbded.ts
*
* Last Edit - Oct 12, 2018 by Elias
*/

/**
 * Represents a Footer of an Embed
 *
 * @interface Footer
 * @prop { string } title
 * @prop { string } description
 * @prop { string } url
 * @prop { number } color
 * @prop { string } timestamp
 * @prop { Footer } footer
 * @prop { Thumbnail } thumbnail
 * @prop { Image } image
 * @prop { Author } author
 * @prop { Field[] } field
 */

interface Embed {
	title?: string;
	description?: string;
	url?: string;
	color?: number;
	timestamp?: string;
	footer?: Footer;
	thumbnail?: Thumbnail;
	image?: Image;
	author?: Author;
	fields?: Field[];
}

/**
 * Represents a Footer of an Embed
 *
 * @interface Footer
 * @prop { string } title
 * @prop { object } fields
 */
interface Footer {
	icon_url?: string;
	text?: string;
}

/**
 * Represents a Thumbnail of an Embed
 *
 * @interface Thumbnail
 * @prop { string } url The url of the thumbnail
 */
interface Thumbnail {
	url?: string;
}

/**
 * Represents a Image of an Embed
 *
 * @interface Image
 * @prop { string } url The url of the image
 */
interface Image {
	url?: string;
}

/**
 * Represents a Author block of an Embed
 *
 * @interface Author
 * @prop { string } name The creator of the thumbnail
 * @prop { string } url Turns author name into a link
 * @prop { string } icon_url Url of the icon next to the author name
 */
interface Author {
	name?: string;
	url?: string;
	icon_url?: string;
}

/**
 * Represents a Field (section) of the Embed
 *
 * @interface Field
 * @prop { string } name The title of the field
 * @prop { string } value The data in the field
 * @prop { string } inline Determines whether the section is inline or a block
 */
interface Field {
	name?: string;
	value?: string;
	inline?: boolean;
}

export {
	Footer,
	Thumbnail,
	Image,
	Author,
	Field,
	Embed,
};