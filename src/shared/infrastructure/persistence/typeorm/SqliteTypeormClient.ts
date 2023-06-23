import { TypeOrmModule } from '@nestjs/typeorm';

export class SqliteTypeormClient {
  static create() {
    return TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'in-memory-db',
      synchronize: true,
      autoLoadEntities: true,
    });
  }
}
