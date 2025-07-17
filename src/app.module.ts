import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { DocumentModule } from './documents/document.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'my_password',
      database: 'backend_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available app-wide
    }),
    AuthModule,
    UserModule,
    DocumentModule,
  ],
})
export class AppModule {}
