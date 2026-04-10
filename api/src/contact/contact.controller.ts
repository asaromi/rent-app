import { Body, Controller, Post } from '@nestjs/common'
import { ApiResponse } from '../model/api.model'
import { ContactModel } from '../model/contact.model'
import { ContactService } from './contact.service'

@Controller('/api/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/')
  async register(@Body() req: ContactModel): Promise<ApiResponse<ContactModel>> {
    const contactResult = (await this.contactService.register(req)) as ContactModel

    return {
      success: true,
      data: contactResult,
    }
  }
}
