const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balls')
		.setDescription('Displays all your Country Balls'),
	async execute(interaction) {
		await interaction.reply({content: 'Pong!', ephemeral: true});
	},
};