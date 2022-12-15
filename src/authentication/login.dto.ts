import { IsEmail, IsString } from 'class-validator';

class LogInDto {
	@IsEmail()
	public email: string;

	@IsString()
	public password: string;
}

export { LogInDto };
