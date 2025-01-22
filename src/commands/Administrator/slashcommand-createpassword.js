const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const UserAuthorization = require("../../Models/UserAuthorization");
const { error } = require("../../utils/Console");

function generateRandomPassword(length = 20) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

module.exports = new ApplicationCommand({
  command: {
    name: "tao-matkhau",
    description: "Tạo mật khẩu cho người dùng",
    type: 1,
    options: [
      {
        name: "user",
        description: "Người dùng (có thể mention hoặc nhập ID)",
        type: ApplicationCommandOptionType.Mentionable,
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

    if (!interaction.inGuild()) {
      interaction.editReply({
        content: "Vui lòng dùng lệnh trong nhóm!",
        ephemeral: true,
      });
    }

    try {
      const guser = interaction.options.getMentionable("user");

      const newPassword = generateRandomPassword();

      const query = {
        userId: guser.id,
        guildId: interaction.guildId,
      };

      const databaseExist = await UserAuthorization.findOne(query);

      if (!databaseExist) {
        const newUserAuth = new UserAuthorization({
          userId: guser.id,
          guildId: interaction.guildId,
          password: newPassword,
          isLogin: false,
        });

        await newUserAuth.save();
        await guser.send("Mã xác nhận của bạn là `" + newPassword + "`");
        interaction.editReply({
          content: `Đã tạo thành công mật khẩu dùng 1 lần cho người dùng ${guser.user.displayName}`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `Người dùng này đã tồn tại!`,
          ephemeral: true,
        });
      }
    } catch (e) {
      error(e);
    }
  },
}).toJSON();
