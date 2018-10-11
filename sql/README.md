
- [Procedures](#procedures)
	- [Setters](#setters)
	- [Getters](#getters)
		- [getTopUserLevel ( Max )](#gettopuserlevel--max)
		- [getUser ( ID )](#getuser--id)
	- [Updaters](#updaters)
- [Tables](#tables)
	- [Guild](#guild)
	- [GuildUserScore](#guilduserscore)
	- [User](#user)
	- [UserLevel](#userlevel)
- [Views](#views)

# Procedures

## Setters

## Getters

### getTopUserLevel ( Max )
*get the top users based on level up to the specified max*

$Max - The max number of rows to grab

### getUser ( ID )
*get the user with the specified ID*

$ID - The ID of the user to grab

## Updaters

# Tables

## Guild
*All guilds that the bot is a part of*

|ID|
|-|
|01|

## GuildUserScore
*The score of a user in a particular guild*

| GuildID | UserID | Score |
|-|-|-|
| 01 | 01 | 9000 |

## User
*All users that have interacted with the bot*

| ID | username | discriminator |
|-|-|-|
|01| CeruleanSong | 9791 |

## UserLevel
*Global level of a user*

| UserID | TotalExp | Level |
|-|-|-|
| 01 | 1000 | 3 |

# Views