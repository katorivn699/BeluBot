const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DefaultRole = require("../../Models/DefaultRole");
const { error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "doi-role-mac-dinh",
    description: "đổi một role mặc định khi có người dùng mới vào",
    type: 1,
    options: [
      {
        name: "role",
        description: "Role cần cài đặt mặc định",
        type: 8, // Type role
        required: true,
      },
    ],
  },
  options: {
    guildOwner: true,
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
    const inputRoleId = interaction.options.getRole("role");
    const guildId = interaction.guildId;

    try {
      const defaultRoleNow = await DefaultRole.findOneAndUpdate(
        {
          guildId,
        },
        {
          roleId: inputRoleId,
        },
        { new: true }
      );
      await interaction.editReply({
        content: `Đã tái thiết lập role mặc định thành ${inputRoleId.name}`,
      });
    } catch (e) {
      await interaction.editReply({
        content: `Có lổi khi thiết lập lại role mặc định!`,
      });
      error(e);
    }
  },
}).toJSON();
