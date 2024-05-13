import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// Prisma service that extends the PrismaClient class and implements the OnModuleInit and OnModuleDestroy interfaces.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // log is a paramater from PrismaClient constructor that allows you to specify which log levels you want to see in the console.
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
