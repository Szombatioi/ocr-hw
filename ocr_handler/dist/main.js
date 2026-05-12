"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: 'ocr-handler',
                brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
            },
            consumer: {
                groupId: 'ocr-handler-group',
            },
        },
    });
    await app.listen();
    console.log('OCR Handler microservice is listening');
}
bootstrap();
//# sourceMappingURL=main.js.map