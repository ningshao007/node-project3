import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userModel } from '../users/user.model';
import Controller from '../interfaces/controller.interface';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto } from '../users/user.dto';
import { EmailExistsException } from '../exceptions/EmailExistsException';
import { LogInDto } from './login.dto';
import { WrongCredentialException } from '../exceptions/WrongCredentialException';
import { TokenData } from 'interfaces/tokenData.interface';
import { User } from 'users/user.interface';

class AuthenticationController implements Controller {
	public path = '/auth';
	public router = express.Router();
	private user = userModel;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
		this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
	}

	private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const userData: CreateUserDto = request.body;

		if (await this.user.findOne({ email: userData.email })) {
			next(new EmailExistsException(userData.email));
		} else {
			const hashedPassword = await bcrypt.hash(userData.password, 10);
			const user = await this.user.create({
				...userData,
				password: hashedPassword,
			});
			// NOTE: 过滤密码,不返回
			user.password = undefined;
			const tokenData = this.createToken(user);
			response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);

			response.send(user);
		}
	};

	private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const loginData: LogInDto = request.body;
		const user = await this.user.findOne({ email: loginData.email });

		if (user) {
			const doesPasswordMatch = await bcrypt.compare(loginData.password, user.password);
			if (doesPasswordMatch) {
				user.password = undefined;
				const tokenData = this.createToken(user);
				response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
				response.send(user);
			} else {
				next(new WrongCredentialException());
			}
		} else {
			next(new WrongCredentialException());
		}
	};

	private createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
	}

	private createToken(user: User): TokenData {
		const expiresIn = 60 * 60;
		const secret = process.env.JWT_SECRET;

		return {
			expiresIn,
			token: jwt.sign({ _id: user._id }, secret, {
				expiresIn,
			}),
		};
	}
}

export { AuthenticationController };
