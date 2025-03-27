const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const Product = require("../../Models/Product");

module.exports = new ApplicationCommand({
  command: {
    name: "shop",
    description: "Shop mua đặc quyền deadline",
    type: 1,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const items = await Product.find();

      if (!items.length) {
        return interaction.reply({
          content: "❌ Hiện không có sản phẩm nào tồn tại!",
          ephemeral: true,
        });
      }

      const shopEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🛒 Shop - Ecredit")
        .setDescription("Dưới đây là các sản phẩm hiện có trong shop:")
        .setFooter({ text: "Dùng lệnh /buy <tên sản phẩm> để mua!" });

      items.forEach((item, index) => {
        shopEmbed.addFields([
          {
            name: `**${item.name}**`,
            value: `${item.description || "Không có mô tả"}`,
            inline: true,
          },
          {
            name: `Giá: ${item.price} Ecredit🪙`,
            value: "\u200B",
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: false,
          },
        ]);
      });

      interaction.reply({ embeds: [shopEmbed] });
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: "❌ Đã xảy ra lỗi khi lấy danh sách sản phẩm!",
        ephemeral: true,
      });
    }
  },
}).toJSON();
