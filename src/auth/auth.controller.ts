import { Body, Controller, Get, Logger, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);
	constructor(private readonly authService: AuthService) { }

	@Post('signup')
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		@GetUser() user: User,
		@GetUser('email') email: string,
		@RawHeaders() rawHeaders: string[]
	) {// Si se necesitan varios argumentos se hace en un array

		return {
			ok: true,
			message: "Hello",
			user,
			email,
			rawHeaders
		}
	}

	@Get('private2')
	@SetMetadata('roles', ['admin', 'super-user']) // Sirve para añadir informacion extra a la ejecución del método
	@UseGuards(AuthGuard(), UserRoleGuard)
	testingPrivateRoute2(
		@GetUser() user: User
	) {
		return {
			ok: true,
			user
		};
	}
}
