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
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
	public path = '/auth';
	public router = express.Router();
	private user = userModel;
	private authenticationService = new AuthenticationService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
		this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
		this.router.post(`${this.path}/logout`, this.loggingOut);
	}

	private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const userData: CreateUserDto = request.body;

		try {
			const { cookie, user } = await this.authenticationService.register(userData);

			response.setHeader('Set-Cookie', [cookie]);
			response.send(user);
		} catch (error) {
			next(error);
		}
	};

	private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const loginData: LogInDto = request.body;

		try {
			const user = await this.user.findOne({ email: loginData.email });
			// console.log('password', user.password, user); user.password === undefined

			if (user) {
				// user.get('password')找不到password属性时,将返回null值.{ getters:false }指不用model里定义的获取器方法拿这个password值
				const isPasswordMatch = await bcrypt.compare(loginData.password, user.get('password', null, { getters: false }));
				if (isPasswordMatch) {
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
		} catch (error) {
			next(error);
		}
	};

	private loggingOut = (request: express.Request, response: express.Response) => {
		response.writeHead(200, { 'Set-Cookie': ['Authorization=; Max-age=0'] });
		response.send('已退出系统');
	};

	private createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
	}

	private createToken(user: User): TokenData {
		const expiresIn = 60 * 60 * 100;
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
