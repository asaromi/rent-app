import { Injectable } from '@nestjs/common'
import { monotonicFactory } from 'ulidx'

@Injectable()
export class UtilService {
  generateId(unixTime?: number): string {
    return monotonicFactory()(unixTime || Date.now())
  }
}
