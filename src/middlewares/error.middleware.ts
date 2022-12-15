import { HttpException } from '../exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
	const status = error.status || 500;
	const message = error.message || 'something went wrong';

	response.status(status).send({
		message,
		status,
	});
}

export { errorMiddleware };
