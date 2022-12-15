import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { userModal } from '../users/user.model';
import Controller from '../interfaces/controller.interface';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto } from '../users/user.dto';
import { EmailExistsException } from '../exceptions/EmailExistsException';
import { LogInDto } from './login.dto';
import { WrongCredentialException } from '../exceptions/WrongCredentialException';

class AuthenticationController implements Controller {
	public path = '/auth';
	public router = express.Router();
	private user = userModal;

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
				response.send(user);
			} else {
				next(new WrongCredentialException());
			}
		} else {
			next(new WrongCredentialException());
		}
	};
}

export { AuthenticationController };
