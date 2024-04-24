import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

// NestJS is a framework that uses decorators to define the structure of the application.
@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  // Identifies the route for the method
  @Get('/hello')
  getHello() {
    return this.appService.getHello()
  }
}
