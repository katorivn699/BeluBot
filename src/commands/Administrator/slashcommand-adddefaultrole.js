const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DefaultRole = require("../../Models/DefaultRole");
const { error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "them-role-mac-dinh",
    description: "Thêm một role mặc định khi có người dùng mới vào",
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
    const inputRoleId = interaction.options.getRole('role');

    try {
        const newDefaultRole = new DefaultRole({
            guildId: interaction.guildId,
            roleId: inputRoleId.id,
        });
        await newDefaultRole.save();
        await interaction.editReply({
          content: 'Đã thiết lập role mặc định thành công!',
        })
    } catch (e) {
        error(e);
    }
  },
}).toJSON();
