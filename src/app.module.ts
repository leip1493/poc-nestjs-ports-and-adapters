import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SqliteTypeormClient } from './shared/infrastructure/persistence/typeorm/SqliteTypeormClient';
import { UserModule } from './user/infrastructure/user.module';
import { AllExceptionsFilter } from './shared/infrastructure/all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [UserModule, SqliteTypeormClient.create()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
