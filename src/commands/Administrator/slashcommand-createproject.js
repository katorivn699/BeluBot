const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DiscordBot = require("../../client/DiscordBot");
const Project = require("../../Models/Project");
const { error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "tao-project",
    description: "Tạo một dự án thực tế",
    type: 1,
    options: [
      {
        name: "ten-project",
        description: "Tên của dự án",
        type: 3,
        required: true,
      },
      {
        name: "mo-ta",
        description: "Mô tả project",
        type: 3,
        required: true,
      },
    ],
  },
  options: {
    botDevelopers: true,
    guildOwner: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const proname = interaction.options.getString("ten-project");
    const prodesc = interaction.options.getString("mo-ta");
    try {
      const newPro = new Project({
        projectName: proname,
        description: prodesc,
      });
      await newPro.save();
      await interaction.editReply({
        content:
          `Project ${proname} đã được tạo. Hãy tạo các task cho project này bằng lệnh ` + "`/task them`",
      });
    } catch (e) {
      error("Error when creating project:" + e);
      console.log(e);
    }
  },
}).toJSON();
