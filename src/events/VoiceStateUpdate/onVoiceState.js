const { success, warn, info, userLog, error } = require("../../utils/Console");
const Event = require("../../structure/Event");
const { Events, PermissionsBitField } = require("discord.js");

/**
 * Event create voice channel and delete empty temp channel
 */
module.exports = new Event({
  event: Events.VoiceStateUpdate,
  once: false,
  run: async (_client_, oldState, newState) => {
    try {
      const channelCreationTimes = new Map();
      const guild = newState.guild;
      const notificationChannelId = process.env.VOICE_LOG;
      const masterChannelId = process.env.MASTER_VOICE_CHANNEL;
      const privateChannelId = process.env.MASTER_PRIVATE_VOICE_CHANNEL;
      const categoryId = process.env.VOICE_CATEGORY;
      const privateCategoryId = process.env.VOICE_CATEGORY;

      // Khi người dùng tham gia master channel
      if (!oldState.channelId && newState.channelId === masterChannelId) {
        const user = newState.member;

        const masterChannel = guild.channels.cache.get(masterChannelId);
        if (masterChannel) {
          const existingChannel = guild.channels.cache.find(
            (channel) =>
              channel.parentId === categoryId &&
              channel.name.startsWith(user.user.username)
          );

          if (existingChannel) {
            await newState.setChannel(existingChannel);
            userLog(
              `Moved ${user.user.username} to existing channel ${existingChannel.name}`
            );
          } else {
            const newChannel = await guild.channels.create({
              name: `${user.user.username}'s Channel`,
              type: 2, // Voice channel type
              parent: categoryId,
              permissionOverwrites: [
                {
                  id: user.id,
                  allow: [
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.MoveMembers,
                  ],
                },
                {
                  id: guild.roles.everyone.id,
                  allow: [PermissionsBitField.Flags.Connect],
                },
              ],
            });

            channelCreationTimes.set(newChannel.id, new Date());
            await newState.setChannel(newChannel);
            userLog(
              `Created and moved ${user.user.username} to new channel ${newChannel.name}`
            );
          }
        } else {
          userLog("Master channel not found.");
        }
      }

      // Khi người dùng tham gia private channel
      if (!oldState.channelId && newState.channelId === privateChannelId) {
        const user = newState.member;

        const newChannel = await guild.channels.create({
          name: `${user.user.username}'s Private Channel`,
          type: 2,
          parent: privateCategoryId,
          userLimit: 2,
          permissionOverwrites: [
            {
              id: user.id,
              allow: [
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak,
                PermissionsBitField.Flags.ManageChannels,
              ],
            },
            {
              id: guild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });

        channelCreationTimes.set(newChannel.id, new Date());
        await newState.setChannel(newChannel);
        userLog(
          `Created and moved ${user.user.username} to private channel ${newChannel.name}`
        );
      }

      // Khi kênh voice rỗng
      if (
        oldState.channelId &&
        oldState.channel.parentId &&
        [categoryId, privateCategoryId].includes(oldState.channel.parentId) &&
        oldState.channel.members.size === 0 &&
        ![masterChannelId, privateChannelId].includes(oldState.channelId)
      ) {
        const channelToCheck = oldState.channel;

        setTimeout(async () => {
          if (channelToCheck && channelToCheck.members.size === 0) {
            const endTime = new Date();
            const startTime = channelCreationTimes.get(channelToCheck.id);

            if (startTime) {
              const elapsedTime = Math.floor((endTime - startTime) / 1000);
              const minutes = Math.floor(elapsedTime / 60);

              if (minutes >= 30) {
                const seconds = elapsedTime % 60;
                channelCreationTimes.delete(channelToCheck.id);

                const embed = new EmbedBuilder()
                  .setTitle("Battle Ended")
                  .setDescription(
                    `Your room **${channelToCheck.name}** has fallen after a fierce battle, lasting ${minutes} minutes and ${seconds} seconds.`
                  )
                  .setColor("#FF0000")
                  .setTimestamp();

                const notificationChannel = guild.channels.cache.get(
                  notificationChannelId
                );
                if (notificationChannel) {
                  await notificationChannel.send({ embeds: [embed] });
                  userLog(
                    `Embed notification sent to channel ${notificationChannelId}`
                  );
                } else {
                  userLog(
                    `Notification channel with ID ${notificationChannelId} not found.`
                  );
                }
              } else {
                userLog(
                  `Channel ${channelToCheck.name} existed for less than 30 minutes. No notification sent.`
                );
              }
            }

            const channelExists = guild.channels.cache.has(channelToCheck.id);
            if (channelExists && channelToCheck.members.size === 0) {
              userLog(`Deleting empty channel ${channelToCheck.name}`);
              await channelToCheck.delete();
            } else {
              userLog(
                `Channel ${channelToCheck.name} no longer exists or is not empty.`
              );
            }
          }
        }, 2000);
      }
    } catch (voiceError) {
      error(`Error in voiceStateUpdate: ${voiceError.message}`);
    }
  },
}).toJSON();
