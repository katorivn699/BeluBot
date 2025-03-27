const { ApplicationCommandOptionType } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { ChatInputCommandInteraction } = require("discord.js");
const milisecondCalculator = require("../../utils/milisecondCalculator");
const { error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "dong-bang-nguoi-dung",
    description:
      "Khoá tất cả trạng thái của người dùng trong một thời gian nhất định",
    type: 1,
    options: [
      {
        name: "nguoi-dung",
        description: "Người dùng cần đóng băng",
        type: 9,
        required: true,
      },
      {
        name: "thoi-gian",
        description: "Thời gian cần đóng băng (h,m,s,ms)",
        type: 3,
        required: true,
      },
      {
        name: "li-do",
        description: "Lí do đóng băng",
        type: 3,
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
      await interaction.editReply({
        content: "Vui lòng dùng lệnh này trong server discord",
      });
    }
    const freezeUser = interaction.options.getMentionable("nguoi-dung");
    const freezeTime = interaction.options.getString("thoi-gian");
    const freezeReason = interaction.options.getString("li-do");
    const msTime = milisecondCalculator(freezeTime);
    if (msTime < 5000 || msTime > 2.419e9) {
      await interaction.editReply(
        "Thời gian đóng băng không được dưới 5 giây và quá 28 ngày"
      );
    }

    try {
      if (!freezeUser.isCommunicationDisabled()) {
        await freezeUser.timeout(msTime, freezeReason);
        await interaction.editReply({
          content: `${freezeUser.displayName}'s đã bị đóng băng trong vòng ${freezeTime} \n lí do:${freezeReason}!`,
        });
      }
      await freezeUser.timeout(msTime, freezeReason);
      await interaction.editReply({
        content: `${freezeUser.displayName}'s đã bị đóng băng trong vòng ${freezeTime} \n lí do:${freezeReason}!`,
      });
    } catch (e) {
      error(e);
    }
  },
}).toJSON();
