import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from './model/api.model'

@Controller('/api')
export class AppController {
  @Get('/')
  getHello(): ApiResponse<unknown> {
    return {
      success: true,
      data: null,
    }
  }
}
