const Config = require("../../Models/Config");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "add-config",
    description: "Add a config to the database",
    type: 1,
    options: [
      {
        name: "key",
        description: "Key of the config",
        type: 3,
        required: true,
      },
      {
        name: "value",
        description: "Value of the config",
        type: 3,
        required: true,
      },
    ],
  },
  options: {
    guildOwner: true,
    botDevelopers: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild) {
        interaction.editReply({
          content: "Vui lòng sử dụng lệnh này trong server discord",
        });
        return;
      }
    const key = interaction.options.getString("key");
    const value = interaction.options.getString("value");
    try {
      const config = new Config({
        guildId: interaction.guildId,
        key: key,
        value: value,
      });
      await config.save();
      await interaction.editReply({
        content: "Thêm config thành công!",
      });
    } catch (e) {
      error(e);
      await interaction.editReply({
        content: "Có lỗi xảy ra khi thêm config!",
      });
    }
  },
}).toJSON();
