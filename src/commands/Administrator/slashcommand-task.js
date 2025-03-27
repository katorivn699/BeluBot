const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const DiscordBot = require("../../client/DiscordBot");
const Task = require("../../Models/Task");
const User = require("../../Models/User");
const { default: mongoose } = require("mongoose");

module.exports = new ApplicationCommand({
  command: {
    name: "task",
    description: "Task của project",
    type: 1,
    options: [
      {
        name: "them",
        description: "Thêm một task mới",
        type: 1,
        options: [
          {
            name: "ten-task",
            description: "Tên của task",
            type: 3,
            required: true,
            min_length: 6,
          },
          {
            name: "mo-ta-task",
            description: "Mô tả của task",
            type: 3,
            required: true,
          },
          {
            name: "project",
            description: "Task thuộc project nào?",
            type: 3,
            required: true,
            autocomplete: true,
          },
          {
            name: "giao-viec",
            description:
              "Task này sẽ được giao cho ai?(Dùng mention hoặc nhập UserID)",
            type: 9,
            required: true,
          },
          {
            name: "thoi-han",
            description:
              "Thời gian kết thúc task này còn được gọi là deadline (dd/mm/yyyy HH:mm)",
            type: 3,
            required: true,
          },
          {
            name: "thoi-han-giao",
            description:
              "Thời gian giao bắt đầu task này còn được gọi là deadline (dd/mm/yyyy HH:mm)",
            type: 3,
            required: true,
          },
        ],
      },
      {
        name: "them-thanh-vien",
        description: "Thêm thành viên vào task đã tạo",
        type: 1,
        options: [
          {
            name: "task",
            description: "Task cần thêm thành viên",
            type: 3,
            required: true,
          },
          {
            name: "thanh-vien",
            description: "Thành viên cần thêm vào task",
            type: 9,
            required: true,
          },
        ],
      },
    ],
  },
  options: {
    botOwner: true,
    guildOwner: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === "them") {
      const nameTask = interaction.options.getString("ten-task");
      const descTask = interaction.options.getString("mo-ta-task");
      const projectIdStr = interaction.options.getString("project");
      const userTask = interaction.options.getMentionable("giao-viec");
      const deadlineStr = interaction.options.getString("thoi-han");
      const assignTimeStr = interaction.options.getString("thoi-han-giao");
      const assignerId = interaction.user.id;
      const projectId = new mongoose.Types.ObjectId(projectIdStr); // Chuyển đổi projectId

      // Hàm chuyển đổi chuỗi thời gian sang Date
      function parseDate(dateStr) {
        const parts = dateStr.split(/[/ :]/);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const hour = parseInt(parts[3], 10);
        const minute = parseInt(parts[4], 10);
        return new Date(year, month, day, hour, minute);
      }

      const deadline = parseDate(deadlineStr);
      const assignTime = parseDate(assignTimeStr);

      // Kiểm tra lỗi
      if (isNaN(deadline.getTime()) || isNaN(assignTime.getTime())) {
        return interaction.editReply(
          "❌ Định dạng thời gian không hợp lệ! Vui lòng nhập theo dạng `dd/mm/yyyy HH:mm`."
        );
      }

      const user = await User.findOne({ userId: userTask.id });

      if (!user) {
        return interaction.editReply(
          "❌ Người này chưa thuộc hệ thống nhóm EMC!"
        );
      }

      const assigner = await User.findOne({ userId: assignerId });

      if (!assigner) {
        return interaction.editReply(
          "❌ Người giao việc này chưa thuộc hệ thống nhóm EMC!"
        );
      }

      try {
        const newTask = new Task({
          name: nameTask,
          description: descTask,
          projectId: projectId,
          userId: user._id,
          assigner: assigner._id,
          assignedTime: assignTime,
          deadline: deadline,
        });

        await newTask.save();
        await interaction.editReply(
          `✅ Task **${nameTask}** đã được tạo và giao cho <@${userTask.id}>! 
           - 🕒 Giao vào: ${assignTime.toLocaleString("vi-VN")}
           - ⏳ Deadline: ${deadline.toLocaleString("vi-VN")}`
        );
      } catch (error) {
        console.error(error);
        await interaction.editReply("❌ Đã xảy ra lỗi khi tạo task.");
      }
    }
  },
}).toJSON();
