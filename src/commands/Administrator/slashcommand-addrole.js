const {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { success, error } = require("../../utils/Console");

module.exports = new ApplicationCommand({
  command: {
    name: "them-role",
    description: "Thêm một vai trò cho một hoặc nhiều người",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "role",
        description: "Vai trò cần giao",
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
      {
        name: "users",
        description: "Người dùng sẽ được giao vai trò(có thể là mention hoặc nhập userID)",
        type: ApplicationCommandOptionType.String,
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
   * @returns
   */
  run: async (client, interaction) => {
    try {
      const role = interaction.options.getRole("role");
      const usersInput = interaction.options.getString("users");

      if (!interaction.member.permissions.has("ManageRoles")) {
        return interaction.reply({
          content: "You do not have permission to manage roles.",
          ephemeral: true,
        });
      }

      const userIds = usersInput
        .split(/\s+/) // Split input by spaces
        .map((id) => id.replace(/[<@!>]/g, "")); // Clean up user mentions or IDs

      const guild = interaction.guild;
      const members = await Promise.all(
        userIds.map((id) => guild.members.fetch(id).catch(() => null))
      );

      const failed = [];
      const succeeded = [];

      for (const member of members) {
        if (!member) {
          failed.push("Invalid user");
          continue;
        }

        try {
          await member.roles.add(role);
          succeeded.push(member.user.tag);
        } catch (err) {
          failed.push(member.user.tag);
        }
      }

      const response = [
        succeeded.length > 0
          ? `🎖️ **Success!** The role **${
              role.name
            }** has been bestowed upon: ${succeeded
              .map((user) => `⚔️ ${user}`)
              .join("\n")}`
          : null,
        failed.length > 0
          ? `❌ **Mission Failed:** Could not assign the role **${
              role.name
            }** to: ${failed.map((user) => `🛑 ${user}`).join("\n")}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n");

      interaction.reply({ content: response, ephemeral: true });
      success(`Added user ${user} into role ${role.name}`);
    } catch (errorAddRole) {
      error(errorAddRole)
      interaction.reply({
        content: "An error occurred while trying to add the role.",
        ephemeral: true,
      });
    }
  },
}).toJSON();
