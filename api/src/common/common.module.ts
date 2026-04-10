import { Global, Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { ValidationService } from './validation.service'
import { UtilService } from './util.service'

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: format.json(),
      transports: [new transports.Console()],
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  providers: [PrismaService, UtilService, ValidationService],
  exports: [PrismaService, UtilService, ValidationService],
})
export class CommonModule {}
