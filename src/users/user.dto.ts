import { IsEmail, IsString } from 'class-validator';

class CreateUserDto {
	@IsString()
	public name: string;

	@IsEmail()
	email: string;

	@IsString()
	public password: string;
}

export { CreateUserDto };
