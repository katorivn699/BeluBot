const { ModalSubmitInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const UserAuthorization = require("../../Models/UserAuthorization");
const Level = require("../../Models/Level");
const UserCredit = require("../../Models/UserCredit");
const { error } = require("../../utils/Console");

module.exports = new Component({
  customId: "signin-modal",
  type: "modal",
  /**
   *
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    const field = interaction.fields.getTextInputValue("password-field");

    const user = interaction.member;
    const query = {
      userId: user.id,
      guildId: interaction.guildId,
      password: field,
    };
    try {
      const existUser = await UserAuthorization.findOne(query);
      if (existUser) {
        const userLevel = new Level({
          userId: user.id,
          guildId: interaction.guildId,
          level: 0,
          xp: 0,
          lastUpdated: new Date(),
        });
        await userLevel.save();
        const userEcredit = new UserCredit({
          userId: user.id,
          guildId: interaction.guildId,
          eCredit: 1,
          lastUpdated: new Date(),
        });
        await userEcredit.save();
        existUser.isLogin = true;
        existUser.lastUpdated = new Date();
        await existUser.save();
        const success = new EmbedBuilder()
          .setColor("#FFFF00")
          .setTitle(`Chúc mừng bạn đã là thành viên của EMC`)
          .setAuthor({
            name: user.displayName,
            iconURL: user.avatarURL(),
          })
          .setDescription("Bạn sẽ được sử dụng một số chức năng cố định")
          .setTimestamp()
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.avatarURL(),
          });
        const channel = interaction.guild.channels.cache.get(
          process.env.WElCOME_CHANNEL
        );
        await user.roles.add(process.env.TRAVELER_ROLE);
        await channel.send({
          embeds: [success],
        });
        await interaction.reply({
          content: "Đăng nhập thành công! Vui lòng kiểm tra kênh chào mừng.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Sai mã xác minh hoặc tài khoản chưa được tạo!",
          ephemeral: true,
        });
      }
    } catch (e) {
      error(e);
    }
  },
}).toJSON();
