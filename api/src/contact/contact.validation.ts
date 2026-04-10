import { z, ZodType } from 'zod'
import { Contact } from '@prisma/client'

export class ContactValidation {
  static readonly CREATE: ZodType<Contact> = z.object({
    id: z.string().ulid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string(),
  })
}