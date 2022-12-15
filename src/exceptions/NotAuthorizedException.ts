import { HttpException } from './HttpException';

export class NotAuthorizedException extends HttpException {
	constructor() {
		super(403, "You're not authorized");
	}
}
