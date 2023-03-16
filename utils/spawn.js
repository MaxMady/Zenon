const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputStyle } = require("discord.js");
const cntry = require('../data/final.json')
const { data } = require("../data/country");
const { calculateStats } = require("./calculateStats");

async function spawn(message) {
  const i = Math.floor(Math.random() * data.length);
  let country = data[i];
  let a = country.replace(" ", `_`);
  let image = new AttachmentBuilder(`./data/images/${a}.png`, {
    name: `balls.png`,
  });
let stats;
stats = cntry.find((obj) => obj.Country === country);

  let arrayOfBalls = await balls.get(`balls-list`)
  if(!arrayOfBalls) arrayOfBalls = [`a`]
  const level = Math.floor(Math.random() * 70) + 1;
  let shiny = Math.floor(Math.random()*1000)<=2?true:false
  let id = generateId(arrayOfBalls);
  let ball = {
    class: country,
    id: id,
    index: 0,
    isCaught: false,
    guildId: message.guild.id,
    caughtOn: null,
    owner: {
      id: null,
      nick: null,
    },
    rarity: 0,
    level: level,
    shiny: shiny,
    stats: calculateStats(),
    xp:0
  };

  arrayOfBalls.push(id);
  await balls.set(`balls-list`, arrayOfBalls)
  await balls.set(`balls-${id}`, ball)
  await db.set(`spawn-${message.guild.id}`, ball)
  
  console.log(ball);

  const exampleEmbed = new EmbedBuilder()
    .setTitle("A wild ball has appeared!")
    .setColor(`Purple`)
    .setImage(`attachment://balls.png`)
    .setFooter({ text: `Type 'z!catch <ball>' to catch the ball!` });
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('catchBall')
					.setLabel('Catch')
					.setStyle(ButtonStyle.Primary),
			);
  message.channel.send({ embeds: [exampleEmbed], files: [image], components: [row] });
}


function generateId(array) {
  const characters = "0123456789";
  let id = "a", str = ``
  while (array.includes(id)) {
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      str += characters[randomIndex];
    }
    id = str;
  }
  
  return id;
}



module.exports = { spawn };
