import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

// NestJS is a framework that uses decorators to define the structure of the application.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Identifies the route for the method
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }
}
