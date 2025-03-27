const { Events, GuildMember } = require("discord.js");
const Event = require("../../structure/Event");
const { error } = require("../../utils/Console");
const Config = require("../../Models/Config");

module.exports = new Event({
  event: Events.GuildMemberAdd,
  once: false,
  /**
   *
   * @param {DiscordBot} client
   * @param {GuildMember} member
   */
  run: async (client, member) => {
    try {
      let guild = member.guild;
      if (!guild) {
        return;
      }
      const config = await Config.findOne({
        key: "DefaultRole",
        guildId: guild.id,
      });
      if (!config) {
        return;
      }
      await member.roles.add(config.value);
    } catch (e) {
      error(e);
    }
  },
}).toJSON();
