<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://u.tro.moe/_v6hil1pig.png" alt="Bot logo"></a>
</p>

<h3 align="center">Kurisu</h3>

<div align="center">

  [![Build Status](https://travis-ci.com/Tromodolo/Kurisu.svg?branch=master)](https://travis-ci.com/Tromodolo/Kurisu)
  [![Platform](https://img.shields.io/badge/platform-discord-purple.svg)](https://discord.gg/G9EY7Sw)
  [![GitHub Issues](https://img.shields.io/github/issues/Tromodolo/Kurisu-Node.svg)](https://github.com/Tromodolo/Kurisu-Node/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Tromodolo/Kurisu-Node.svg)](https://github.com/Tromodolo/Kurisu-Node/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## Getting Started

### Prerequisites

+ [Node.js](https://nodejs.org/en/)
+ [Typescript 3.8 or above](https://www.typescriptlang.org/)
+ [Mysql or Mariadb](https://mariadb.org/)

### Guide

In order to start the bot, you first need to configure the configurations found in `data/config/`.

Rename both config files and remove the example from the name.

`bot-example.json` -> `bot.json`

`db-example.json` -> `db.json`

Then fill out both configurations according to help below:

#### Bot Config
```
{
	"developers": [], // Array of objects containing name. Metadata for info command
	"developerIds": [], // Array of string ids. Metadata for info command
	"libraryVersion": "", // Version of eris used. Metadata for info command
	"color": "", // Required: Hex value for colour. Example: 0x7289da
	"xpMoneyEnabled": true, // Required: Whether or not xp is enabled to gain or not.
	"defaultPrefix": "", // Required: Default prefix to fall back to if not using custom
	"botToken": "", // Required: Discord API Bot token
	"devToken": "", // Only used if production is set to false in bot.ts
	"googleApiKey": "", // Required if you want to use any of google's services in the bot.
	"googleCustomSearchId": "" // Required if you want to use google command 
}
```
#### DB Config
```
{
	"databaseHost": "", // URL or ip for where the database is hosted. If it is on the same machine, it's likely localhost
	"databaseName": "", // Name of database to use
	"databaseUsername": "", // Username
	"databasePassword": "", // Password
	"databaseType": "" // At the moment, this needs to be set to "mysql", but in the future, maybe other types will be supported.
}
```

Once everything is filled out, building and running the bot is simply
```
npm install
tsc
node build/bot.js
```

If you want to set this up for production, setting it up with something like [PM2](https://github.com/Unitech/pm2) is recommended.

## ⛏️ Built Using <a name = "built_using"></a>
+ [Node.js](https://nodejs.org/en/)
+ [Eris.js](https://abal.moe/Eris/) - Discord API Library

## ✍️ Authors <a name = "authors"></a>
+ [@Tromodolo](https://github.com/tromodolo) - Start of project and creator
+ [@CeruleanSong](https://github.com/CeruleanSong) - Help with coding
+ [@Pixidesu](https://twitter.com/pixidesu) - Made bot avatar

See also the list of [contributors](https://github.com/Tromodolo/Kurisu-Node/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>
+ [@Kylelobo](https://github.com/Kylelobo) for creating templates for readmes which you can find [Here](https://github.com/kylelobo/The-Documentation-Compendium)
