import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { z } from 'zod'
import { PrismaService } from '../prisma/prisma.service'

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
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema)) // pipes its like middleware
  // infer the type of the body
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

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
