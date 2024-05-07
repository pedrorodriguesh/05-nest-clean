import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// Prisma service that extends the PrismaClient class and implements the OnModuleInit and OnModuleDestroy interfaces.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$disconnect()
  }

  onModuleDestroy() {
    return this.$connect()
  }
}
