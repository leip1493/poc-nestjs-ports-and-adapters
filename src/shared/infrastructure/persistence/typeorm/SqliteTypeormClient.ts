import { TypeOrmModule } from '@nestjs/typeorm';

export class SqliteTypeormClient {
  static create() {
    return TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true,
    });
  }
}
