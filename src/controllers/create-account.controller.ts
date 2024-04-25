import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

// Zod Schema to validate data
const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

// inference type for the schema
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema)) // pipes its like middleware
  // infer the type of the body
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const test = this.config.get('DATABASE_URL')
    console.log(test)

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      throw new ConflictException('User with same email already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
      },
    })
  }
}
