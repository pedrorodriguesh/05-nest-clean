import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

// This decorator is used to extract the user payload from the request object.
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)
