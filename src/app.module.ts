import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsGateway } from './notif/notification.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [NotificationsGateway],
})
export class AppModule {}
