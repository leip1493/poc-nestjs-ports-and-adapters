import { TypeOrmModule } from '@nestjs/typeorm';

export class SqliteTypeormClient {
  static create() {
    return TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true,
    });
  }
}
