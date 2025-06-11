// Consumer for Export Playlist - OpenMusic API v3
import amqp from "amqplib";
import dotenv from "dotenv";
import PlaylistsService from "./PlaylistsService.js";
import MailSender from "./MailSender.js";

dotenv.config();

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlist", {
    durable: true,
  });

  channel.consume("export:playlist", async (message) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await playlistsService.getPlaylistById(playlistId);
      await mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      console.log(`✅ Export playlist ${playlistId} sent to ${targetEmail}`);
    } catch (error) {
      console.error("❌ Export failed:", error);
    }

    channel.ack(message);
  });

  console.log("🚀 Consumer started. Waiting for export requests...");
};

init();
