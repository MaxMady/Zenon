const { SlashCommandBuilder } = require('discord.js');
const { damage } = require('../battle/damage')
const { startBattle } = require(`../battle/startBattle`)
module.exports = {
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('Battle another user with your balls!'),
	async execute(interaction) {
		await interaction.reply({content: 'Simulating battle between USA & France!', ephemeral: false});
        let countries = [
            {
                name:`France`,
                atk:75,
                def:80,
                spd:75,
                hp:957,
                level: 79                
            },
            {
                name:`USA`,
                atk:80,
                def:70,
                spd:60,
                hp:946,
                level: 76
            }
        ]
        await startBattle(countries, interaction);

	},
};