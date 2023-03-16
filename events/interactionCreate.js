const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
	console.log(interaction.user.id)
    if (!interaction.isChatInputCommand()) return;

    let users = await db.get(`users`);
    if (!users) users = [];
    if (!users.includes(interaction.user.id)) {
      users.push(interaction.user.id);
      await db.set(`users`, users);
    }

    let user = await db.get(`user-${interaction.user.id}`);
    if (!user) {
      user = {
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
	  await db.set(`user-${interaction.user.id}`, user)
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      await interaction.reply({
        content: "This command does not exist!",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error occured while executing ${interaction.commandName}`);
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
