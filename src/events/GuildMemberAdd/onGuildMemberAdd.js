const { Events, GuildMember } = require("discord.js");
const Event = require("../../structure/Event");
const { findOne } = require("../../Models/DefaultRole");
const { error } = require("../../utils/Console");
const DefaultRole = require("../../Models/DefaultRole");

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
      const role = await DefaultRole.findOne({
        guildId: guild.id,
      });
      if (!role) {
        return;
      }
      await member.roles.add(role.roleId);
    } catch (e) {
      error(e);
    }
  },
}).toJSON();
