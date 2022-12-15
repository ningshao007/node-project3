import * as bcrypt from 'bcrypt';
import { EmailExistsException } from '../exceptions/EmailExistsException';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/user.dto';
import { userModel } from '../users/user.model';
import { TokenData } from '../interfaces/tokenData.interface';
import { User } from '../users/user.interface';

class AuthenticationService {
	private user = userModel;

	public async register(userData: CreateUserDto) {
		if (await this.user.findOne({ email: userData.email })) {
			throw new EmailExistsException(userData.email);
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = await this.user.create({
			...userData,
			password: hashedPassword,
		});

		const tokenData = this.createToken(user);
		const cookie = this.createCookie(tokenData);

		return {
			cookie,
			user,
		};
	}

	public createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
	}

	public createToken(user: User): TokenData {
		const expiresIn = 60 * 60 * 100;
		const secret = process.env.JWT_SECRET;

		return {
			expiresIn,
			token: jwt.sign({ _id: user._id }, secret, { expiresIn }),
		};
	}
}

export default AuthenticationService;
