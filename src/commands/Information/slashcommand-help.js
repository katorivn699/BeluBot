const { ChatInputCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

module.exports = new ApplicationCommand({
  command: {
    name: "help",
    description: "Replies with a list of available application commands.",
    type: 1,
    options: [],
  },
  options: {
    cooldown: 10000,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (!interaction.guild) {
        return interaction.reply({ 
            content: "❌ Lệnh này chỉ có thể sử dụng trong server!", 
            ephemeral: true 
        });
    }
    const user = interaction.member;
    const isGuildOwner = interaction.guild.ownerId === user.id;
    const isBotDeveloper = config.users.developers.includes(user.id);
    const isBotOwner = config.users.ownerId === user.id; 

    // Lọc các lệnh mà user có thể sử dụng
    const availableCommands = client.collection.application_commands.filter(
      (cmd) => {
        const opts = cmd.options || {};

        // Nếu command yêu cầu botOwner mà user không phải owner bot → Ẩn
        if (opts.botOwner && !isBotOwner) return false;

        // Nếu command yêu cầu botDevelopers mà user không phải dev → Ẩn
        if (opts.botDevelopers && !isBotDeveloper) return false;

        // Nếu command yêu cầu guildOwner mà user không phải chủ guild → Ẩn
        if (opts.guildOwner && !isGuildOwner) return false;

        // Nếu command có yêu cầu quyền đặc biệt, kiểm tra xem user có quyền đó không
        if (opts.requiredPermissions) {
          return user.permissions.has(
            PermissionsBitField.resolve(opts.requiredPermissions)
          );
        }

        return true;
      }
    );

    // Tạo danh sách lệnh có thể sử dụng
    const commandList = availableCommands
      .map((cmd) => `\`/${cmd.command.name}\``)
      .join(", ");

    await interaction.reply({
      content:
        commandList.length > 0
          ? `**Lệnh bạn có thể sử dụng:**\n${commandList}`
          : "Bạn không có quyền sử dụng lệnh nào!",
    });
  },
}).toJSON();
