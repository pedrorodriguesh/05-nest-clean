import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Env } from './env'

// Here its the start of the application.

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // ConfigService is a global service that provides access to the environment variables
  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
