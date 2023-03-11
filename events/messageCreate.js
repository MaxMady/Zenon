const { Events } = require('discord.js');
const { spawn } = require('../utils/spawn')
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
    if(message.author.bot) return;
        let id = message.guild.id;

        let c = messageCounter.get(id)
        if(!c) {c = { points: 0, time: null }};
        const currentTime = Date.now();
        if (c.time && currentTime - c.time < 1000) {
            c.points += 3;
          } else if (c.time && currentTime - c.time < 5000) {
            c.points += 5;
          } else {
            c.points += 7;
          }
        c.time = currentTime
        if(c.points >= 20) {
          spawn(message)
          c.points = 0;
          c.time = null
        }
        await messageCounter.set(`${id}`, c)
	},
};