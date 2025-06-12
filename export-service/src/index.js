// OpenMusic Export Service - Main Consumer
import amqp from "amqplib";
import dotenv from "dotenv";
import PlaylistsService from "./services/PlaylistsService.js";
import MailSender from "./services/MailSender.js";

dotenv.config();

const init = async () => {
  console.log("🚀 Starting OpenMusic Export Service...");

  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  // Test database connection before starting
  try {
    console.log("🔗 Testing database connection...");
    await playlistsService.testConnection();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("🔍 Environment variables check:", {
      PGUSER: process.env.PGUSER || "undefined",
      PGHOST: process.env.PGHOST || "undefined",
      PGDATABASE: process.env.PGDATABASE || "undefined",
      PGPORT: process.env.PGPORT || "undefined",
      PGPASSWORD: process.env.PGPASSWORD ? "[SET]" : "undefined",
    });
    process.exit(1);
  }

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue("export:playlist", {
      durable: true,
    });

    console.log("✅ Connected to RabbitMQ");
    console.log("⏳ Waiting for export requests...");

    channel.consume("export:playlist", async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString()
        );

        console.log(`📥 Processing export request for playlist ${playlistId}`);

        const playlist = await playlistsService.getPlaylistById(playlistId);
        await mailSender.sendEmail(
          targetEmail,
          JSON.stringify(playlist, null, 2)
        );

        console.log(`✅ Export playlist ${playlistId} sent to ${targetEmail}`);
      } catch (error) {
        console.error("❌ Export failed:", {
          message: error.message,
          code: error.code,
          detail: error.detail,
          stack: error.stack,
        });

        // Log environment variables for debugging (without sensitive data)
        console.error("🔍 Environment check:", {
          PGUSER: process.env.PGUSER || "undefined",
          PGHOST: process.env.PGHOST || "undefined",
          PGDATABASE: process.env.PGDATABASE || "undefined",
          PGPORT: process.env.PGPORT || "undefined",
          PGPASSWORD: process.env.PGPASSWORD ? "[SET]" : "undefined",
        });
      }

      channel.ack(message);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down Export Service...");
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start Export Service:", error);
    process.exit(1);
  }
};

init();
