const { ApplicationCommandOptionType } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DiscordBot = require("../../client/DiscordBot");
const { ChatInputCommandInteraction } = require("discord.js");

module.exports = new ApplicationCommand({
  command: {
    name: "them-vat-pham-minigame-shop",
    description: "Thêm vật phẩm cho minigame shop",
    type: 1,
    options: [
      {
        name: "ten-vat-pham",
        description: "Tên vật phẩm cho shop minigame",
        type: 3,
        required: true,
      },
      {
        name: "suc-manh",
        description: "Sức mạnh của vật phẩm",
        type: 3,
        required: true,
      },
      {
        name: "mo-ta",
        description: "Mô tả của vật phẩm",
        type: 3,
        required: true,
      },
      {
        name: "do-hiem",
        description: "Độ hiếm của vật phẩm",
        type: 3,
        required: true,
      },
      {
        name: "gia",
        description: "Giá của vật phẩm",
        type: 4,
        required: true,
      },
      {
        name: "do-ben",
        description: "Độ bền của vật phẩm",
        type: 4,
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
  run: async (client, interaction) => {},
}).toJSON();
