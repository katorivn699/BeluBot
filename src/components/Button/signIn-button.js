const { ButtonInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const { error } = require("../../utils/Console");

module.exports = new Component({
  customId: "sign-in-button",
  type: "button",
  /**
   *
   * @param {DiscordBot} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
        await interaction.showModal({
            custom_id: "signin-modal",
            title: "Xác thực",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "password-field",
                    label: "Mã xác thực của bạn là gì?",
                    max_length: 30,
                    min_length: 1,
                    placeholder: "Nhập mã xác thực của bạn!",
                    style: 1,
                    required: true,
                  },
                ],
              },
            ],
          });
    } catch (e) {
        error(e);
    }
  },
}).toJSON();
