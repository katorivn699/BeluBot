const { EmbedBuilder } = require("discord.js");
const UserCredit = require("../../Models/UserCredit");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { success, error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "credit-cua-toi",
    description: "Kiểm tra eCredit của bạn",
    type: 1,
  },
  options: {
    guildOwner: false,
  },
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const guildId = interaction.guildId;

      const query = {
        userId,
        guildId,
      };

      const userCredit = await UserCredit.findOne(query);

      const embedMessage = new EmbedBuilder()
        .setColor("#0099ff")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (!userCredit) {
        embedMessage
          .setTitle("Số dư eCredit")
          .setDescription(
            "Bạn chưa có eCredit nào. Hãy bắt đầu tham gia để nhận eCredit nhé!"
          )
          .setFooter({ text: "Hãy chăm chỉ để tích lũy eCredit!" });
      } else {
        embedMessage
          .setTitle("Số dư eCredit")
          .setDescription(`Bạn hiện đang có **${userCredit.eCredit} eCredit**.`)
          .setFooter({
            text: "Kiểm tra thường xuyên để xem số dư eCredit của bạn!",
          });
      }

      await interaction.editReply({
        embeds: [embedMessage],
      });
      success(`${interaction.user.username} checked their eCredit.`);
    } catch (e) {
      await interaction.editReply({
        content: `Đã xảy ra lỗi khi kiểm tra eCredit của bạn. Vui lòng thử lại sau.`,
      });
      error(e);
    }
  },
}).toJSON();
