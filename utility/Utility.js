module.exports.getUserByMessage = (msg, args) => {
	let user;
	
	if(args.length == 0){
		user = msg.member;
		return user;
	}

	let mentionRegex = /(<@!?[0-9]*>)(?:\s?\w*)*/gi;

	let mentionCheck = mentionRegex.exec(args.join(" "));

	if(mentionCheck){
		user = msg.mentions[0];

		//Workaround to get member object instead of just user
		user = msg.channel.guild.members.find(x => x.id == user.id);
	}
	else if(!user){
		let guild = msg.channel.guild;
		user = guild.members.find(x => x.id == args[0]);

		if(!user){
			user = guild.members.find(x => x.username.toLowerCase() == args[0]);
			if(!user){
				user = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!user){
					user = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!user){
						user = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!user){
							return null;
						}
					}
				}
			}
		}
	}
	return user;
}


module.exports.getLoveUsers = (msg, args) => {
	let users = { first: null, second: null };
	
	if(args.length == 0){
		return users;
	}

	let firstuser = msg.mentions[0];
	if(firstuser) users.first = msg.channel.guild.members.find(x => x.id == firstuser.id);

	let seconduser = msg.mentions[1];
	if(seconduser) users.second = msg.channel.guild.members.find(x => x.id == seconduser.id);

	let guild = msg.channel.guild;

	if(!users.first){
		users.first = guild.members.find(x => x.id == args[0]);

		if(!users.first){
			users.first = guild.members.find(x => x.username.toLowerCase() == args[0]);

			if(!users.first){
				users.first = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!users.first){
					users.first = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!users.first){
						users.first = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!users.first){
							users.first = null;
						}
					}
				}
			}
		}
	}

	if(!users.second){
		users.second = guild.members.find(x => x.id == args[1]);

		if(!users.second){
			users.second = guild.members.find(x => x.username.toLowerCase() == args[1]);

			if(!users.second){
				users.second = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[1];
					}
					else{
						return false;
					}
				});
				if(!users.second){
					users.second = guild.members.find(x => x.username.toLowerCase().includes(args[1]));
					if(!users.second){
						users.second = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[1]);
							}
							else{
								return false;
							}
						});
						if(!users.second){
							users.second = null;
						}
					}
				}
			}
		}
	}
	return users;
}