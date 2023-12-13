import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User])
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [TypeOrmModule] // No es necesario exportar el modulo completo, con que se exporte la configuración de typeorm es suficient
})
export class AuthModule { }
