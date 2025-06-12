// RabbitMQ Producer Service for OpenMusic API v3
import amqp from "amqplib";

class ProducerService {
  constructor() {
    this._connection = null;
    this._channel = null;
  }

  async connect() {
    const server = process.env.RABBITMQ_SERVER || "amqp://localhost";
    this._connection = await amqp.connect(server);
    this._channel = await this._connection.createChannel();

    console.log("✅ Connected to RabbitMQ");
  }

  async sendMessage(queue, message) {
    if (!this._channel) {
      await this.connect();
    }

    await this._channel.assertQueue(queue, {
      durable: true,
    });

    await this._channel.sendToQueue(queue, Buffer.from(message));
  }

  async close() {
    if (this._connection) {
      await this._connection.close();
    }
  }
}

// Export singleton instance
const producerService = new ProducerService();
export default producerService;
