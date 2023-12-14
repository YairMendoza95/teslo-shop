import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({
			defaultStrategy: 'jwt'
		}),

		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return JwtModule.register({
					secret: configService.get('JWT_SECRET'),
					signOptions: {
						expiresIn: '2h'
					}
				})
			}
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy
	],
	exports: [
		TypeOrmModule,
		JwtStrategy,
		JwtModule,
		PassportModule
	] // No es necesario exportar el modulo completo, con que se exporte la configuración de typeorm es suficiente
})
export class AuthModule { }
