const Event = require("../../structure/Event");
const { warn, error, success } = require("../../utils/Console");
const Level = require("../../Models/Level");
const LevelCalculator = require("../../utils/LevelCalculator");
const { Events, EmbedBuilder } = require("discord.js");
const UserCredit = require("../../Models/UserCredit");

function getRandomXP(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = new Event({
  event: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {DiscordBotDiscordBot} client
   * @param {message} message
   * @returns
   */
  run: async (client, message) => {
    giveXP(message);
  },
}).toJSON();

async function giveXP(message) {
  if (!message.inGuild() || message.author.bot) {
    return;
  }
  const xpToGive = getRandomXP(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await Level.findOne(query);
    if (level) {
      level.xp += xpToGive;

      if (level.xp > LevelCalculator(level.level)) {
        const userEcredit = await UserCredit.findOne(query);
        const rewardLevels = [30, 90, 120, 150, 180];
        level.xp = 0;
        level.level += 1;

        // Kiểm tra xem cấp độ hiện tại có trong danh sách nhận thưởng không
        let rewardMessage = "";
        if (rewardLevels.includes(level.level) && userEcredit) {
          userEcredit.eCredit += 1;
          userEcredit.lastUpdated = new Date();
          await userEcredit.save();

          rewardMessage = `🎯 **Phần thưởng**: +1 eCredit\n`;
        }

        // Tạo embed message cho thông báo thăng cấp và phần thưởng
        const embedMessage = new EmbedBuilder()
          .setColor(rewardMessage ? "#FF4500" : "#FFD700") // Màu đỏ cam nếu có phần thưởng, màu vàng nếu không
          .setTitle("⚔️ Thăng Cấp! 🎉")
          .setDescription(
            `🏅 **${message.member.displayName}** đã chứng tỏ sức mạnh của mình!\n` +
              `✨ Bạn đã thăng lên **Cấp ${level.level}**!\n\n` +
              rewardMessage +
              `✨ Hãy tiếp tục chiến đấu để nhận thêm phần thưởng và chinh phục thử thách!`
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/1276027175555960863/1330408452433907742/Level_Up_Presentations_GIF_by_SOAP_Apresentacoes.gif?ex=678ddeec&is=678c8d6c&hm=9846019e0e2c3ab18d64bb223ba4797cc206d636790b3c09c49ef5cb3d97363c&"
          )
          .setImage(
            rewardMessage
              ? "https://cdn.discordapp.com/attachments/1276027175555960863/1330410499954966658/Celebrate_In_Love_GIF_by_Max.gif?ex=678de0d5&is=678c8f55&hm=94fe00749191e282d9ac9e025fb7e42aebae0db7b2e12824732fa873621372b9&"
              : null
          )
          .setFooter({
            text: "Cuộc phiêu lưu của bạn vẫn chưa kết thúc!",
            iconURL: message.author.displayAvatarURL(),
          })
          .setTimestamp();

        // Gửi tin nhắn embed
        await message.channel.send({ embeds: [embedMessage] });
      }
      await level.save().catch((e) => {
        error(`Error save xp for user ${message.member}`);
      });
    } else {
      // const newLevel = new Level({
      //   userId: message.author.id,
      //   guildId: message.guild.id,
      //   xp: xpToGive,
      // });
      // await newLevel.save();
      await message.author.send(
        `Bạn chưa được đăng kí trong server ${message.guild.name}`
      );
    }
  } catch (error) {
    warn(`Error to give user ${message.author.displayName}`);
    warn(error);
  }
}
