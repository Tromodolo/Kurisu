/**
 * DiscordEmbed.js
 * 
 * Contains the DiscordEmbed class which can be used for making embeded text messages
 * TODO - Class function need to have error checking added
 * 
 * Last Edit - Oct 10, 2018 by Elias
 */

 import { Footer, Thumbnail, Image, Author, Field, Embed as EmbedObject } from "./DiscordEmbedTypes";
import { Embed } from "eris";

/**
 * Creates a embeded message
 * 
 * TODO - add descriptions to JSDoc
 * @class DiscordEmbed
 * @prop { string } title 
 * @prop { string } description
 * @prop { string } url
 * @prop { string } color 
 * @prop { string } timestamp 
 * @prop { Footer } footer
 * @prop { Thumbnail } thumbnail
 * @prop { Image } image
 * @prop { Author } author 
 * @prop { Field[] } fields
 */
class DiscordEmbed{
    title:string;
    description:string;
    url:string;
    color:string;
    timestamp:string;
    footer:Footer;
    thumbnail:Thumbnail;
    image:Image;
    author:Author;
    //fields:Field[];
    fields:Field[];

    /**
     * @constructor sets all the values within the class to null
     */
    constructor() {
        this.title = "";
        this.description = "";
		this.url = "";
		this.color = "";
		this.timestamp = "";
		this.footer = {};
		this.thumbnail = {};
		this.image = {};
		this.author = {};
		this.fields = [];
    }

    /**
     * @param title set the title field
     */
    setTitle(title: string) {
        this.title = title;
    }

    /**
     * @param description set the description field
     */
    setDesciption(description:string) {
        this.description = description;
    }

    /**
     * @param url set the url field
     */
    setUrl(url: string) {
        this.url = url
    }

    /**
     * @param color set the color field
     */
    setColor(color:string) {
        this.color = color;
    }

    /**
     * @param timestamp set the timestamp field
     */
    setTimestamp(timestamp: string) {
        this.timestamp = timestamp;
    }

    /**
     * @param icon_url set the icon_url of a footer
     * @param text set the text field of the footer
     */
    setfooter(icon_url:string, text:string) {
        this.footer = { "icon_url":`${icon_url}`, "text":`${text}`};
    }

    /**
     * @param url set the url of the thumbnail image
     */
    setThumbnail(url:string) {
        this.thumbnail = {"url":url};
    }

    /**
     * @param url set the url of the image
     */
    setImage(url:string) {
        this.image = { "url":url };
    }

    /**
     * @param name set the title field of the author section
     * @param url add a link to the author text
     * @param icon_url add a image next to the author texT
     */
    setAuthor(name:string, url:string, icon_url:string) {
        this.author = { "name":name, "url":url, "icon_url":icon_url };
    }

    /**
     * Might change this later to take in a (name[], value[], inline[])
     * 
     * @param fields An array of Field objects
     */
    setFields(fields:Field[]) {
        this.fields = fields;
    }

    /**
     * get the Embed object
     * 
     * @returns An Embed object
     */
    getEmbed(){
		let embed:EmbedObject = {};

		if(this.title) 
			embed.title = this.title;

		if(this.description) 
			embed.description = this.description;

		if(this.url) 
			embed.url = this.url;

		if(this.color) 
			embed.color = this.color;

		if(this.timestamp) 
			embed.timestamp = this.timestamp;

		if(this.footer) 
			embed.footer = this.footer;

		if(this.thumbnail) 
			embed.thumbnail = this.thumbnail;

		if(this.image) 
			embed.image = this.image;

		if(this.author) 
			embed.author = this.author;

		embed.fields = this.fields;
		
		let fullEmbed = { "embed": { embed } };

		return fullEmbed;
	}
}

export {
    DiscordEmbed,
};