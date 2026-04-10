import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { ContactModule } from './contact/contact.module'
import { AppController } from './app.controller'

@Module({
  imports: [CommonModule, ContactModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
