const prettyMs = require('pretty-ms');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const page = require("discord-pagination-advanced");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Show bot latency'),
	async execute(interaction) {
		const timeStamp = new Date().getTime();
		let loading = await interaction.reply('Calculating Ping...');
		let botPing = loading.createdTimestamp - interaction.createdTimestamp;
		let apiPing = client.ws.ping;
		console.log(interaction.createdTimestamp)
		let pingEmbed = new EmbedBuilder()
		  .setColor('Green')
		  .setTitle(`:ping_pong: Ping Information`)
		  .setFields(
			{name: 'Latency Information', value: `${interaction.createdTimestamp-timeStamp}ms`, inline: true},
			{name: "API's latency", value: `${apiPing}ms`, inline: true},
			{
			  name: "Bot's uptime",
			  value: `${prettyMs(client.uptime)}`,
			  inline: true,
			},
		  )
		  .setAuthor({
			name: `${interaction.user.tag}`,
			iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}`,
		  });
		await interaction.editReply({content: null, embeds: [pingEmbed]});
	},
};