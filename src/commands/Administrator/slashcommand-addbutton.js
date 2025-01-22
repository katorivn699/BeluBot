const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const buttons = require("../../data/buttons");

module.exports = new ApplicationCommand({
  command: {
    name: "them-nut",
    description: "Thêm nút bất kì.",
    type: 1,
    options: [
      {
        name: "channel",
        description: "Kênh cần hiển thị nút",
        type: 7,
        require: true,
      },
      {
        name: "button",
        description: "Nút cần hiển thị",
        type: 3,
        autocomplete: true,
        require: true,
      },
      {
        name: "tieu_de",
        description: "Nội dung hiển thị cùng nút",
        type: 3,
        required: false,
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

    const channel = interaction.options.getChannel("channel");
    const buttonId = interaction.options.getString("button");
    const noiDung = interaction.options.getString("tieu_de");

    const selectedButton = buttons.find(
      (button) => (button.customId = buttonId)
    );

    if (!selectedButton) {
      return interaction.editReply({
        content: "Nút không tồn tại!",
      });
    }

    await channel.send({
      content: noiDung,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: selectedButton.customId,
              label: selectedButton.label,
              style: 1,
            },
          ],
        },
      ],
    });
    await interaction.editReply({
      content: "Nút đã được thêm thành công!",
    });
  },
}).toJSON();
