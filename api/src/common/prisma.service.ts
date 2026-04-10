/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@prisma/client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import pg from 'pg'
import { Logger } from 'winston'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prismaOptions: Prisma.PrismaClientOptions = {
  adapter: new PrismaPg(pool),
  log: [
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'query' },
  ],
}

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, string> implements OnModuleInit {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super(prismaOptions)
  }

  onModuleInit() {
    this.$on('info', this.logger.info)
    this.$on('error', this.logger.error)
    this.$on('query', this.logger.info)
    this.$on('warn', this.logger.warn)
  }
}
