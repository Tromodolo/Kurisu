module.exports.DiscordEmbed = class DiscordEmbed{
	constructor(){
		this.title = null;
		this.description = null;
		this.url = null;
		this.color = null;
		this.timestamp = null;
		this.footer = {};
		this.thumbnail = {};
		this.image = {};
		this.author = {};
		this.fields = [];
	}

	setTitle(title){
		if(!title || title.length == 0){
			return;
		}
		else{
			this.title = title;
		}
	}
	
	setDescription(description){
		if(!description || description.length == 0){
			return;
		}
		else{
			this.description = description;
		}
	}

	setUrl(url){
		if(!url || url.length == 0){
			return;
		}
		else{
			if(url.substring(0, 8) != "https"){
				if(!(url.substring(0, 8) != "http")) 
					url = "https://" + url; 
			}
			this.url = url;
		}
	}

	setColor(color){
		//This needs to take in a RGB int or it will break
		if(!color || color.length == 0){
			return;
		}
		else{
			this.color = color;
		}
	}

	setTimestamp(timestamp){
		if(!timestamp || timestamp.length == 0){
			return;
		}
		else{
			this.timestamp = timestamp;
		}
	}

	setFooter(icon_url, text){
		if(text && text.length !== 0){
			this.footer.text = text;

			if(icon_url && icon_url.length !== 0){
				this.footer.icon_url = icon_url;
			}
		}
	}

	setThumbnail(url){
		if(!url || url.length == 0){
			return;
		}
		else{
			this.thumbnail.url = url;
		}
	}

	setImage(url){
		if(!url || url.length == 0){
			return;
		}
		else{
			this.image.url = url;
		}
	}

	setAuthor(name, url, icon_url){
		//name is obligatory the else arent
		if(!name || name.length == 0){
			return;
		}
		else{
			this.author.name = name;

			if(url && url.length !== 0){
				this.author.url = url;
			}
			if(icon_url && icon_url.length !== 0){
				this.author.icon_url = icon_url;
			}
		}
	}

	addField(name, value, inline){
		let fieldEmbed = {};
		if((name && value) && !(name.length == 0 || value.length == 0)){
			fieldEmbed.name = name;
			fieldEmbed.value = value;

			if(!inline) fieldEmbed.inline = false;
			else fieldEmbed.inline = true;

			this.fields.push(fieldEmbed);
		}
		else{
			return;
		}
	}

	getEmbed(){
		let embed = {};

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
		
		let fullEmbed = { "embed": {} };

		fullEmbed.embed = embed;

		return fullEmbed;
	}

};