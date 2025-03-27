const {
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DiscordBot = require("../../client/DiscordBot");
const { success, error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "xoa-tin-nhan",
    description: "Xoá tin nhắn của một channel",
    type: 1,
    options: [
      {
        name: "channel",
        description: "Kênh cần xoá tin nhắn",
        type: 7,
        required: true,
      },
      {
        name: "so-luong",
        description: "Số lượng tin nhắn cần xoá",
        type: 4,
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

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return await interaction.editReply({
        content: "Bạn không có quyền thực hiện!",
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel("channel");
    const soLuong = interaction.options.getInteger("so-luong");

    try {
      if (soLuong < 1 || soLuong > 100) {
        return await interaction.editReply({
          content: "Vui lòng nhập số lượng hợp lệ",
          ephemeral: true,
        });
      }

      const deletedMessages = await channel.bulkDelete(soLuong, true);
      await interaction.editReply({
        content: `Đã xoá thành công ${deletedMessages.size} trong kênh ${channel.name}`,
        ephemeral: true,
      });
      success(
        `Successfully deleted ${deletedMessages.size} in channel ${channel.name}`
      );
    } catch (e) {
      error("Error to delete message!");
      await interaction.editReply({
        content: "Xoá tin nhắn thất bại",
        ephemeral: true,
      });
    }
  },
}).toJSON();
