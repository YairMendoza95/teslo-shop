import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) { }

	async create(createUserDto: CreateUserDto) {
		try {
			const { password, ...userData } = createUserDto;
			const user = this.userRepository.create({
				...userData,
				password: bcrypt.hashSync(password, 10)
			});
			await this.userRepository.save(user);
			delete user.password;

			this.logger.debug(`User created ${user.fullname}`);
			return user;
		} catch (error) {
			this.logger.error(error);
			this.handleDBException(error);
		}
	}

	private handleDBException(error: any) {
		if (error.code === '23505')
			throw new BadRequestException(error.detail);

		throw new InternalServerErrorException('Unexpected error');
	}
}
