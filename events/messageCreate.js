const { Events } = require("discord.js");
const { spawn } = require("../utils/spawn");
const { prefix } = require("../config");
const { caughtBall } = require('../utils/caughtBall.js')

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if(message.author.bot) return
    let id = message.guild.id;
    let c = messageCounter.get(id);
    if (!c) {
      c = { points: 0, time: null };
    }
    const currentTime = Date.now();
    if (c.time && currentTime - c.time < 1000) {
      c.points += 3;
    } else if (c.time && currentTime - c.time < 5000) {
      c.points += 5;
    } else {
      c.points += 7;
    }
    c.time = currentTime;
    if (c.points >= 20) {
      spawn(message);
      c.points = 0;
      c.time = null;
    }
    await messageCounter.set(`${id}`, c);
    console.log(c)
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd === `catch`) {
      let country = args.join(` `)
      let spawn = await db.get(`spawn-${message.guild.id}`)
      if(!spawn) {
        return message.reply(`There isn't any active spawns in this server!`)
      }
      if(country.toLowerCase() == spawn.class.toLowerCase()) {
        caughtBall(spawn, message)
      } else {
        message.reply(`Wrong country name! Try again...`)
      }
    }

  },
};
