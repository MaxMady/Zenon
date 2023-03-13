const {  Events,  AttachmentBuilder,  EmbedBuilder,  ActionRowBuilder,  ModalBuilder,  TextInputBuilder,  TextInputStyle} = require("discord.js");
const { caughtBall } = require('../utils/caughtBall')

module.exports = {
  name: Events.InteractionCreate,
  once: true,
  async execute(interaction) {
    if (interaction.customId === `catchBall`) {
      const modal = new ModalBuilder().setCustomId("catchM").setTitle("Zenon");
      const balled = new TextInputBuilder()
        .setCustomId("caught")
        .setRequired(true)
        .setLabel("Enter the ball name...")
        .setStyle(TextInputStyle.Short);

      const row = new ActionRowBuilder().addComponents(balled);
      modal.addComponents(row);
      await interaction.showModal(modal);
      const submitted = await interaction
        .awaitModalSubmit({
          time: 60000,
          filter: (i) => i.user.id === interaction.user.id,
        })
        .then(async (ec) => {
          const country = await ec.fields.getTextInputValue("caught");
          let spawn = await db.get(`spawn-${interaction.guild.id}`);
          if (!spawn) {
            return await ec.reply({
              content: `There isn't any active spawns in this server!`,
              ephemeral: true,
            });
          }
          if (country.toLowerCase() == spawn.class.toLowerCase()) {
            caughtBall(spawn, ec);
          } else {
            await ec.reply({content: `Wrong country name! Try again...`, ephemeral: true});
          }
        });
    }
    console.log(interaction.customId);
  },
};
