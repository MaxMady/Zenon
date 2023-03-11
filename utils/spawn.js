const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { data } = require('../data/country')


async function spawn(message) {
    const i = Math.floor(Math.random() * data.length);
    let country = data[i]
    let a = country.replace(' ', `_`)
    let image = new AttachmentBuilder(`./data/images/${a}.png`)
    console.log(country)
    const exampleEmbed = new EmbedBuilder()
	.setTitle('A wild ball has appeared!')
    .setColor(`Purple`)
	.setImage(`attachment://${country}.png`)
    .setFooter({text: `Type 'z!catch <ball>' to catch the ball!`});
    message.channel.send({ embeds: [exampleEmbed], files: [image]  });
}

module.exports = { spawn }