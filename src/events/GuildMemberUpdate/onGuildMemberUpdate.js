const { Events, GuildMember } = require("discord.js");
const Event = require("../../structure/Event");
const { roleLog, error } = require("../../utils/Console");
const DefaultRole = require("../../Models/DefaultRole");

module.exports = new Event({
  event: Events.GuildMemberUpdate,
  once: false,
  /**
   *
   * @param {DiscordBot} client
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @returns
   */
  run: async (client, oldMember, newMember) => {
    roleCheck(oldMember, newMember);
  },
}).toJSON();

/**
 *
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 * @returns
 */
async function roleCheck(oldMember, newMember) {
  try {
    const defaultRole = await DefaultRole.findOne({
      guildId: oldMember.guild.id,
    });
    const defaultRoleIds = defaultRole.roleId;
    const newRoles = newMember.roles.cache.map((role) => role);
    const oldRoles = oldMember.roles.cache.map((role) => role);

    // Check if the member only has the @everyone role
    if (newRoles.length === 1 && newRoles[0].id === newMember.guild.id) {
      const guildRoles = newMember.guild.roles.cache;
      const rolesToAdd = guildRoles.filter((role) =>
        defaultRoleIds.includes(role.id)
      );

      for (const role of rolesToAdd.values()) {
        if (!newRoles.some((r) => r.id === role.id)) {
          await newMember.roles.add(role).catch(error);
          const nicknameWithoutPrefix = newMember.displayName.replace(
            /^\[.*?\]\s*/,
            ""
          );
          const newNickname = `${nicknameWithoutPrefix}`;
          if (newMember.nickname !== newNickname) {
            await newMember.setNickname(newNickname).catch((errorReName) => {
              error(
                `Failed to set nickname for ${newMember.user.displayName}:`,
                errorReName
              );
            });
            roleLog(
              `Updated nickname for ${newMember.user.displayName} to '${newNickname}'`
            );
          }
          roleLog(`Added default role '${role.name}' to ${newMember.user.displayName}`);
        }
      }
      return;
    }

    const hasDefaultRole = oldRoles.some((role) =>
      defaultRoleIds.includes(role.id)
    );
    const hasOtherRoles = newRoles.some(
      (role) =>
        !defaultRoleIds.includes(role.id) && role.id !== newMember.guild.id
    );

    if (hasDefaultRole && hasOtherRoles) {
      const rolesToRemove = oldRoles.filter((role) =>
        defaultRoleIds.includes(role.id)
      );
      for (const role of rolesToRemove) {
        if (newRoles.some((r) => r.id === role.id)) {
          await newMember.roles.remove(role).catch(error);
          roleLog(`Removed '${role.name}' from ${newMember.user.displayName}`);
        }
      }
    }

    const highestRole = newRoles
      .filter(
        (role) =>
          !defaultRoleIds.includes(role.id) && role.id !== newMember.guild.id
      )
      .sort((a, b) => b.position - a.position)[0];

    if (highestRole) {
      const nicknameWithoutPrefix = newMember.displayName.replace(
        /^\[.*?\]\s*/,
        ""
      );
      const newNickname = `[${highestRole.name}] ${nicknameWithoutPrefix}`;

      if (newMember.nickname !== newNickname) {
        await newMember.setNickname(newNickname).catch((errorRename) => {
          error(
            `Failed to set nickname for ${newMember.user.displayName}:`,
            errorRename
          );
        });
        roleLog(
          `Updated nickname for ${newMember.user.displayName} to '${newNickname}'`
        );
      }
    }
  } catch (e) {
    error(`Error handling role update for ${newMember.user.displayName}:`, e);
  }
}
