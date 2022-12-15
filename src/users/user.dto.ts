import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from './address.dto';

class CreateUserDto {
	@IsString()
	public name: string;

	@IsEmail()
	email: string;

	@IsString()
	public password: string;

	@IsOptional()
	@ValidateNested()
	public address: CreateAddressDto;
}

export { CreateUserDto };
