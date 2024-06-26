import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

// Zod Schema to validate data
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// inference type for the schema
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema)) // pipes its like middleware
  // infer the type of the body
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credential do not match')
    }

    const isPasswordValid = await compare(password, user.password) // here we compare the password we received with the password stored in database.

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credential do not match')
    }

    // here it takes in consideration the settings we defined in the AuthModule for the JwtModule.
    const acessToken = this.jwt.sign({ sub: user.id })

    return {
      acess_token: acessToken,
    }
  }
}
