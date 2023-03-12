const { EmbedBuilder } = require("discord.js");

async function caughtBall(ball, message) {
  let time = Date.now();
  let owner = {
    id: message.author.id,
    nick: null,
  };
  ball.isCaught = true;
  ball.caughtOn = time;
  ball.owner = owner;

  await db.set(`spawn-${message.guild.id}`, false);
  await balls.set(`balls-${ball.id}`, ball);
  let inv = await db.get(`user-${message.author.id}`);
  if (!inv)
    inv = {
      balance: {
        coins: 0,
        shards: 0,
      },
      balls: [],
      countries: [],
      stats: {
        catches: 0,
      },
    };
  inv.stats.catches++;
  inv.balls.push(ball.id);
  let op = `Congratulations ${message.author}! You have caught a level ${ball.level} ${ball.class}...`;
  if (!inv.countries.includes(ball.class)) {
    inv.balance.coins += 125;
    inv.countries.push(ball.class);
    op += ` You have recieved $125 for aquiring a new ball!`;
  }
  if (ball.shiny) op += `\n\nThis ball seems to be shining a bit...`;
  await db.set(`user-${message.author.id}`, inv);

  await message.channel.send(`${op}`);
}

module.exports = { caughtBall };
