const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const UserAuthorization = require("../../Models/UserAuthorization");
const { error } = require("../../utils/Console");
const { hashPassword } = require("../../utils/passwordEncryptor");
const User = require("../../Models/User");

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
      {
        name: "role",
        description: "Vai trò của người dùng (web)",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true,
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
      return interaction.editReply({
        content: "Vui lòng dùng lệnh trong nhóm!",
        ephemeral: true,
      });
    }

    try {
      const guser = interaction.options.getMentionable("user");
      const role = interaction.options.getString("role");

      const newPassword = generateRandomPassword();
      const hashedPassword = await hashPassword(newPassword);

      // Lấy ID avatar
      const avatarId = guser.user.avatar;

      const query = {
        userId: guser.id,
        guildId: interaction.guildId,
      };

      const databaseExist = await UserAuthorization.findOne(query);

      if (!databaseExist) {
        const newUserAuth = new UserAuthorization({
          userId: guser.id,
          guildId: interaction.guildId,
          password: hashedPassword,
          isLogin: false,
        });

        const newUser = new User({
          userId: guser.id,
          username: guser.user.displayName,
          createdAt: Date.now(),
          role: role,
          avatar: avatarId,
        });

        await newUserAuth.save();
        await newUser.save();
        await guser.send(`Mã xác nhận của bạn là \`\`\`${newPassword}\`\`\``);

        interaction.editReply({
          content: `✅ Đã tạo thành công mật khẩu dùng 1 lần cho **${guser.user.displayName}** với vai trò **${role}**`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `⚠️ Người dùng này đã tồn tại!`,
          ephemeral: true,
        });
      }
    } catch (e) {
      interaction.editReply({
        content: `❌ Không gửi được mã xác thực. Vui lòng thử lại!`,
        ephemeral: true,
      });
      error(e);
    }
  },
}).toJSON();
