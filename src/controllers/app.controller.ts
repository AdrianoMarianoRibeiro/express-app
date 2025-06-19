import { injectable } from 'tsyringe';
import { Controller, Get } from '../decorators/controller.decorator';

@Controller()
@injectable()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Hello World!',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  @Get('/health')
  healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
