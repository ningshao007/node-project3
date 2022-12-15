import { HttpException } from './HttpException';

class WrongTokenException extends HttpException {
	constructor() {
		super(401, 'Wrong authentication token');
	}
}

export { WrongTokenException };
