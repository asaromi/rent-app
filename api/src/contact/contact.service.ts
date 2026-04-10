/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common'
import { Contact } from '@prisma/client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { PrismaService } from '../common/prisma.service'
import { UtilService } from '../common/util.service'
import { ValidationService } from '../common/validation.service'
import { ContactModel } from '../model/contact.model'
import { ContactValidation } from './contact.validation'

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
    private utilService: UtilService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  register(req: ContactModel): Promise<Contact> {
    this.logger.info('Registering contact')

    const id = this.utilService.generateId()
    const reqBody = this.validationService.validate(ContactValidation.CREATE, {
      id,
      ...req,
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return this.prisma.contact.create({ data: reqBody })
  }
}