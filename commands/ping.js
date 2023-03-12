const { SlashCommandBuilder } = require('discord.js');
const page = require("discord-pagination-advanced");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Show bot latency'),
	async execute(interaction) {
		
		await interaction.reply({content: 'Pong!', ephemeral: true});
	},
};