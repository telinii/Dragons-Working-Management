import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { WorkEventsModule } from './work-events/work-events.module';
import { WorkEvent } from './work-events/work-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 1433),
      username: process.env.DB_USER ?? 'SA',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME ?? 'JornadaDb',
      entities: [User, WorkEvent],
      synchronize: true, // só dev
      options: { encrypt: false, trustServerCertificate: true },
    }),
    UsersModule,
    AuthModule,
    WorkEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
