const ApplicationCommand = require("../../structure/ApplicationCommand");
const UserCredit = require("../../Models/UserCredit");
const { success, error } = require("../../utils/Console");
const { AttachmentBuilder } = require("discord.js");

module.exports = new ApplicationCommand({
  command: {
    name: "them-credit",
    description: "Thêm eCredit cho người dùng.",
    type: 1,
    options: [
      {
        name: "user",
        description: "Người nhận được eCredit",
        type: 6,
        required: true,
      },
      {
        name: "amount",
        description: "Số lượng eCredit được nhận",
        type: 4,
        required: true,
      },
    ],
  },
  options: {
    guildOwner: true,
  },
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    const userName = user.id.replace(/[<@!>]/g, "");
    try {
      const guild = interaction.guild;
      const member = await guild.members.fetch(userName).catch(() => null);

      const query = {
        userId: member.id,
        guildId: interaction.guildId,
      };

      const user = await UserCredit.findOne(query);

      if (!user) {
        const newECredit = new UserCredit({
          userId: member.id,
          guildId: interaction.guildId,
          eCredit: amount,
          lastUpdated: new Date(),
        });
        await newECredit.save();
        await interaction.editReply({
          content: `Đã thành công bàn giao ${amount} eCredit cho ${member.user.username}`,
        });
        success(`Successfully assigned ${amount} eCredit to ${member.user.username}.`);
      } else {
        user.eCredit += amount;
        user.lastUpdated = new Date();
        await user.save();
        await interaction.editReply({
          content: `Đã thành công bàn giao ${amount} eCredit cho ${member.user.username}`,
        });
        success(`Successfully assigned ${amount} eCredit to ${member.user.username}.`);
      }
    } catch (e) {
      await interaction.editReply({
        content: `Có lẽ người này không may mắn nhận được số credit này. Hãy liệm phật`,
        files: [
          new AttachmentBuilder(Buffer.from(`${e}`, "utf-8"), {
            name: "output.ts",
          }),
        ],
      });
      error(e);
    }
  },
}).toJSON();
