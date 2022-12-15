import { HttpException } from './HttpException';

class TokenMissingException extends HttpException {
	constructor() {
		super(401, 'Authentication token missing');
	}
}

export { TokenMissingException };
