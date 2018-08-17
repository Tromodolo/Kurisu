const uuidv1 = require('uuid/v1');
const request = require("request");
const config = require('../config.json');
const DiscordEmbed = require("../utility/DiscordEmbed");
const Colour = require("../bot").kurisuColour;
const removeBlackjack = require("../bot").removeBlackjack;
const db = require("../db");

module.exports = class Blackjack{
    constructor(member, bet, channelid, client){        
        this.gameOwner  = member.user,
        this.botClient  = client,
        this.players    = [],
        this.playerTurn = 0,
        this.channelId  = channelid,
        this.message    = null,
        this.messageEmbed = null,
        this.deckId     = null,
        this.started    = false,
        this.dealerPlay = false,
        this.dealerHand = {
            hand: [],
            soft: false,
            aces: 0,
            value: 0,
            busted: false
        },
        this._messageHandler = this._messageEvent.bind(this);

        //Add creator of the table to the player list
        this.players.push({
            user: member.user,
            turnOrder: 0,
            bet: bet,
            doubledUp: false,
            firstHand: [],
            value: 0,
            blackjack: false,
            soft: false,
            aces: 0,
            //Only used if split
            secondHand: [],
            secondValue: 0
        });

        this.botClient.createMessage(this.channelId, `${this.gameOwner.username} wants to start a blackjack game. Write ${config.commandPrefix}join X if you want to join, where X is your bet. ${this.gameOwner.username} can start the game at any moment with ${config.commandPrefix}start`);
    }

    async registerEvent(){
        this.botClient.on("messageCreate", this._messageHandler);
    }

    async unregisterEvent(){
        this.botClient.off("messageCreate", this._messageHandler);
    }

    async _messageEvent(message){
        if(message.content.startsWith(`${config.commandPrefix}join`)){
            let args = message.content.split(" ");
            if(args.length < 2){
                this.botClient.createMessage(this.channelId, "You need to choose a bet amount");
                return;
            }
            else{
                let userData = await db.ProfileData.find({ where: { userid: message.member.id }, raw: true });

                let bet = parseInt(args[1]);
                if(bet < 0){
                    this.botClient.createMessage(this.channelId, "You can't bet a negative amount");
                    return;
                }
                else if(userData.money < moneyBet){
                    this.botClient.createMessage(this.channelId, "You can't afford that bet");
                    return;
                }
                else{
                    this.players.push({
                        user: message.author,
                        turnOrder: this.players.length,
                        bet: bet,
                        doubledUp: false,
                        firstHand: [],
                        value: 0,
                        blackjack: false,
                        soft: false,
                        aces: 0,
                        //Only used if split
                        secondHand: [],
                        secondValue: 0
                    });
/*         this.players.push({
            user: member.user,
            turnOrder: 0,
            bet: bet,
            doubledUp: false,
            firstHand: [],
            value: 0,
            blackjack: false,
            soft: false,
            aces: 0,
            //Only used if split
            secondHand: [],
            secondValue: 0
        }); */

                }
            }
        }
        if(message.author.id == this.gameOwner.id && message.content ==  `${config.commandPrefix}start`) await this.startGame();
        if(!this.started) return;

        if(message.author.id == this.players[this.playerTurn].user.id){
            if(message.content == `${config.commandPrefix}hit`){                
                await this.drawCard(false, this.players[this.playerTurn].user.id);
                await this.updateHands();
            }
            else if(message.content == `${config.commandPrefix}double`){                
                await this.doubleUp();
            }
            else if(message.content == `${config.commandPrefix}stand`){
                if(this.playerTurn == this.players.length - 1){
                    await this.dealerTurn();
                }
                else{
                    await this.updateHands();
                }
            }
        }

    }

    async getDeck(){
        return new Promise(async (resolve, reject) => {
            request({
                url: "https://deckofcardsapi.com/api/deck/new/",
                json: true
            }, (error, resp, body) => {
                if(error) reject(error);
                    this.deckId = body.deck_id;
                    request({
                        url: `https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle`,
                        json: true
                    }, (error, resp, body) => {
                        if(error) reject(error);
                        return resolve(this.deckId);
                    });
                });
            }) 
    }

    async drawCard(dealer, playerId){
        return new Promise(async (resolve, reject) => {
            if(!this.deckId) await this.getDeck();
            request({
                url: `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`,
                json: true
            }, (error, resp, body) => {
                if(error) reject(error);

                let card = body.cards[0];
                let cardValue = 0;
                let soft = false;

                switch(card.value){
                    case "KING":
                    case "QUEEN":
                    case "JACK":
                        cardValue = 10;
                        break;
                    case "ACE":
                        cardValue = 11;
                        soft = true;
                        break;
                    default:
                        cardValue = parseInt(card.value);
                        break;
                }

                if(dealer == true){
                    this.dealerHand.hand.push(card);
                    this.dealerHand.value += cardValue;
                    this.dealerHand.soft = soft;

                    if(soft) this.dealerHand.aces++;
                }
                else{
                    let index;
                    for(let i in this.players){
                        if(this.players[i].user.id == playerId){
                            index = i; 
                            break;  
                        }
                    }
                    this.players[index].firstHand.push(card);
                    this.players[index].value += cardValue;
                    this.players[index].soft = soft;

                    if(soft) this.players[index].aces++;
                }
                resolve(card);
            })
        });        
    }

    async startGame(){
        return new Promise(async (resolve) => {
            if(this.started){
                this.botClient.createMessage(this.channelId, "The game has already started");
                return resolve();
            }
            this.started = true;

            this.messageEmbed = {
                embed: {
                    color: Colour,
                    author: {
                        name: "Blackjack"
                    },
                    fields: []
                }
            }

            //Let dealer draw a card
            await this.drawCard(true, null);

            let dealerCard = this.dealerHand.hand[0].code;

            dealerCard = dealerCard.replace("H", "`♥️`");
            dealerCard = dealerCard.replace("C", "`♣️`");
            dealerCard = dealerCard.replace("S", "`♤`");
            dealerCard = dealerCard.replace("D", "`♦️`");

            if(dealerCard.startsWith("0")) dealerCard = "1" + dealerCard;

            this.messageEmbed.embed.fields.push(
            {
                name: "Dealer",
                value: `Value: ${this.dealerHand.value}\n**${dealerCard} **`
            })

            await asyncForEach(this.players, async player => {
                return new Promise(async (resolve) => {
                    await this.drawCard(false, player.user.id);
                    await this.drawCard(false, player.user.id);

                    let cards = "";
                    player.firstHand.forEach(card => {
                        let text = card.code;

                        text = text.replace("H", "`♥️`");
                        text = text.replace("C", "`♣️`");
                        text = text.replace("S", "`♤`");
                        text = text.replace("D", "`♦️`");

                        if(text.startsWith("0")) text = "1" + text;

                        cards = cards + text + " ";
                    })
                    let handText;
                    if(player.soft){
                        handText = `Value: ${player.value}(${player.value - (player.aces * 10)})\n**${cards}**`
                    }
                    else{
                        handText = `Value: ${player.value}\n**${cards}**`
                    }
                    this.messageEmbed.embed.fields.push(
                    {
                        name: player.user.username,
                        value: handText,
                        inline: true
                    })
                    resolve();
                })
            }).then(async () => {
                let message = await this.botClient.createMessage(this.channelId, this.messageEmbed);
                this.message = message;

                this.botClient.createMessage(this.channelId, `<@${this.players[this.playerTurn].user.id}>, would you like to hit(${config.commandPrefix}hit), double up(${config.commandPrefix}double) or stand(${config.commandPrefix}stand)?`);
                return resolve();
            });
        });
    };

    async updateHands(){
        return new Promise(async (resolve) => {
            this.messageEmbed.embed.fields = [];

            let dealerCards = "";

            this.dealerHand.hand.forEach(card => {
                let text = card.code;

                text = text.replace("H", "`♥️`");
                text = text.replace("C", "`♣️`");
                text = text.replace("S", "`♤`");
                text = text.replace("D", "`♦️`");

                if(text.startsWith("0")) text = "1" + text;

                dealerCards = dealerCards + text + " ";
            })
            let handText;
            if(this.dealerHand.soft){
                handText = `Value: ${this.dealerHand.value}(${this.dealerHand.value - (this.dealerHand.aces * 10)})\n**${dealerCards}**`
            }
            else{
                handText = `Value: ${this.dealerHand.value}\n**${dealerCards}**`
            }

            this.messageEmbed.embed.fields.push(
            {
                name: "Dealer",
                value: `Value: ${handText}`
            })

            await asyncForEach(this.players, async player => {
                return new Promise(async (resolve) => {
                    let cards = "";
                    player.firstHand.forEach(card => {
                        let text = card.code;

                        text = text.replace("H", "`♥️`");
                        text = text.replace("C", "`♣️`");
                        text = text.replace("S", "`♤`");
                        text = text.replace("D", "`♦️`");

                        if(text.startsWith("0")) text = "1" + text;

                        cards = cards + text + " ";
                    })
                    let handText;
                    if(player.soft){
                        handText = `Value: ${player.value}(${player.value - (player.aces * 10)})\n**${cards}**`
                    }
                    else{
                        handText = `Value: ${player.value}\n**${cards}**`
                    }

                    this.messageEmbed.embed.fields.push(
                    {
                        name: player.user.username,
                        value: handText,
                        inline: true
                    })
                    resolve();
                })
            })

            this.botClient.editMessage(this.channelId, this.message.id, this.messageEmbed);

            if(!this.dealerPlay){
                if(this.players[this.playerTurn].value == 21 && this.players[this.playerTurn].firstHand.length == 2){
                    await this.botClient.createMessage(this.channelId, `<@${this.players[this.playerTurn].user.id}>, you got blackjack and will win 2.5x`);
                    this.players[this.playerTurn].blackjack = true;
                    await this.nextPlayer();
                }
                else if(this.players[this.playerTurn].value == 21){
                    await this.nextPlayer();
                }
                else if(this.players[this.playerTurn].value - (this.players[this.playerTurn].aces * 10) > 21){
                    await this.botClient.createMessage(this.channelId, `<@${this.players[this.playerTurn].user.id}>, you busted and lost your bet`);
                    await this.nextPlayer();
                }
            }

            return resolve();
        });
    }

    async nextPlayer(){
        return new Promise(async resolve => {
            if(this.playerTurn == this.players.length - 1){
                await this.dealerTurn();
            }
            else{
                this.playerTurn++;
                await this.botClient.createMessage(this.channelId, `<@${this.players[this.playerTurn].user.id}>, would you like to hit(${config.commandPrefix}hit), double up(${config.commandPrefix}double) or stand(${config.commandPrefix}stand)?`);
            }
        })
    }

    async doubleUp(){
        return new Promise(async resolve => {
            //doubles bet
            this.players[this.playerTurn].bet = this.players[this.playerTurn].bet * 2;
            await this.drawCard(false, this.players[this.playerTurn].user.id);
            await this.updateHands();
            await this.nextPlayer();
        });
    }

    async dealerTurn(){
        return new Promise(async (resolve) => {
            this.dealerPlay = true;
            await this.unregisterEvent();
            await this.drawCard(true, null);

            if(this.dealerHand.value <= 16){
                await this.dealerTurn();
                return resolve();
            }
            else if(this.dealerHand.value > 21){
                await this.updateHands();
                this.dealerHand.busted = true;
                await this.endGame();
                return resolve();
            }
            else{
                await this.updateHands();
                await this.endGame();
                return resolve();
            }
        });
    }

    async endGame(){
        return new Promise(async (resolve) => {
            if(this.dealerHand.busted){
                this.botClient.createMessage(this.channelId, "The dealer has busted and everyone has won at least 2x their bet.");

                await asyncForEach(this.players, async player => {
                    return new Promise(async (resolve) => {
                        if(player.blackjack){
                            await db.ProfileData.update(
                            {
                                money: db.sequelize.literal(`money + ${Math.round(player.bet * 1.5)}`)
                            }, 
                            {
                                where: {
                                    userid: player.user.id
                                }
                            });
                        }
                        else{
                            await db.ProfileData.update(
                            {
                                money: db.sequelize.literal(`money + ${player.bet}`)
                            }, 
                            {
                                where: {
                                    userid: player.user.id
                                }
                            });
                        }
                    });
                });

                removeBlackjack(this);
            }
            else{
                let diff = Math.abs(21 - this.dealerHand.value);

                let winners = [];
                let noLoss = [];

                await asyncForEach(this.players, async player => {
                    return new Promise(async (resolve) => {
                        let diff1 = Math.abs(21 - player.value);
                        if(diff1 < diff && !(player.value > 21)){
                            winners.push(player);
                            return resolve();
                        }
                        else if(diff1 == diff && !(player.value > 21)){
                            noLoss.push(player);
                            return resolve();
                        }
                        else{
                            //Do some aces magic
                            if(player.soft){
                                for(let i = 0; i++; i < player.aces.length){
                                    let diff1 = Math.abs(21 - player.value - ( (i+1) * 10));
                                    if(diff1 < diff){
                                        winners.push(player);
                                        return resolve();
                                    }
                                }
                            }
                            else{
                                await db.ProfileData.update(
                                {
                                    money: db.sequelize.literal(`money - ${player.bet}`)
                                }, 
                                {
                                    where: {
                                        userid: player.user.id
                                    }
                                });
                            }
                            return resolve();
                        }
                    });
                }).then(async () => {
                    let winnerList = "";
                    let noLossList = "";

                    for(let i in winners){
                        winnerList += `<@${winners[i].user.id}>`;
                        if(winners[i].blackjack){
                            await db.ProfileData.update(
                            {
                                money: db.sequelize.literal(`money + ${Math.round(winners[i].bet * 1.5)}`)
                            }, 
                            {
                                where: {
                                    userid: winners[i].user.id
                                }
                            });
                        }
                        else{
                            await db.ProfileData.update(
                            {
                                money: db.sequelize.literal(`money + ${winners[i].bet * 1}`)
                            }, 
                            {
                                where: {
                                    userid: winners[i].user.id
                                }
                            });
                        }
                    }
                    for(let i in noLoss){
                        noLossList += `<@${noLoss[i].user.id}>`;
                    }

                    if(winners.length > 0) this.botClient.createMessage(this.channelId, `The players who won their bets are:\n${winnerList}`);
                    else this.botClient.createMessage(this.channelId, "No one won any bets");

                    if(noLoss.length > 0) this.botClient.createMessage(this.channelId, `Players who didn't lose the bet:\n${noLossList}`);
                    removeBlackjack(this);
                });
            }
        });
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

    
