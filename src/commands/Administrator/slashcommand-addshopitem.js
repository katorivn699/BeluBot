const {
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DiscordBot = require("../../client/DiscordBot");
const Product = require("../../Models/Product");
const { v4: uuidv4 } = require("uuid");
const { success } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "them-san-pham-shop",
    description: "Thêm vào một sản phẩm vào shop",
    type: 1,
    options: [
      {
        name: "ten-san-pham",
        description: "Tên vật phẩm cho shop",
        type: 3,
        required: true,
      },
      {
        name: "mo-ta",
        description: "Mô tả của sản phẩm",
        type: 3,
        required: true,
      },
      {
        name: "so-luong-ecredit",
        description: "Số lượng ecredit mua sản phẩm",
        type: 10,
        required: true,
      },
    ],
  },
  options: {
    guildOwner: true,
    botDevelopers: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const nameit = interaction.options.getString("ten-san-pham");
    const desc = interaction.options.getString("mo-ta");
    const priceit = interaction.options.getNumber("so-luong-ecredit");
    await interaction.deferReply();
    try {
      if (priceit <= 0) {
        await interaction.editReply({
          content: "Giá không được âm hoặc bằng 0!",
        });
      }
      const pro = new Product({
        productId: uuidv4(),
        name: nameit,
        description: desc,
        price: priceit,
      });
      await pro.save();
      await interaction.editReply({
        content: `Tạo thành công sản phẩm ${nameit}`,
      });
      success(`Sucessfully to create product ${nameit} ${priceit}`);
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content: "Có lỗi trong quá trình tạo sản phẩm",
      });
    }
  },
}).toJSON();
