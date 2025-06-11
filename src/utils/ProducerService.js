// Producer Service Singleton
import ProducerService from "./rabbitmq/ProducerService.js";

const producerService = new ProducerService();

export default producerService;
