const cron = require("node-cron");
const Task = require("../Models/Task");
const { jobLog } = require("../utils/Console");
const User = require("../Models/User");

/**
 * Gửi thông báo đến user trên Discord về cập nhật task.
 * @param {Client} client - Bot Discord client
 * @param {Object} task - Đối tượng task từ MongoDB
 */
async function sendDiscordNotification(client, task) {
  try {
    console.log(task.userId);

    const userDB = await User.findById(task.userId);
    const user = await client.users.fetch(userDB.userId);

    if (user) {
      // Chuyển đổi trạng thái sang tiếng Việt
      const statusVietnamese = {
        not_started: "Chưa bắt đầu",
        in_progress: "Đang thực hiện",
        review: "Chờ duyệt",
        completed: "Hoàn thành",
      };

      await user.send(
        `📢 **Cập nhật Task!**\n\n` +
          `📝 **Tên Task:** ${task.name}\n` +
          `📌 **Trạng thái mới:** ${
            statusVietnamese[task.status] || "Không xác định"
          }\n` +
          `🕒 **Deadline:** ${task.deadline.toLocaleString("vi-VN")}`
      );
      console.log(`📩 Đã gửi thông báo đến ${user.tag}`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi tin nhắn:", error);
  }
}

/**
 * Khởi động cron-job kiểm tra và cập nhật task
 * @param {Client} client - Bot Discord client
 */
function startTaskScheduler(client) {
  jobLog("⏳ Task scheduler is running...");

  cron.schedule("*/5 * * * *", async () => {
    jobLog("🔄 Đang kiểm tra task...");

    const now = new Date();

    try {
      // Lấy danh sách các task cần cập nhật trạng thái
      const toStart = await Task.find({
        status: "not_started",
        assignedTime: { $lte: now },
      });
      const toReview = await Task.find({
        status: "in_progress",
        deadline: { $lte: now },
      });

      // Cập nhật trạng thái và gửi thông báo
      for (const task of toStart) {
        task.status = "in_progress";
        await task.save();
        await sendDiscordNotification(client, task);
      }

      for (const task of toReview) {
        task.status = "review";
        await task.save();
        await sendDiscordNotification(client, task);
      }

      jobLog("✅ Task đã được cập nhật!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật task:", error);
    }
  });
}

module.exports = startTaskScheduler;
