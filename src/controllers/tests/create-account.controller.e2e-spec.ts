import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../prisma/prisma.service'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  // Here we're running our app before all tests, we use the createTestingModule method to create a new module with the AppModule and the PrismaService and ConfigService providers.
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, ConfigService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  // Using supertest to do e2e tests with http requests.
  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
