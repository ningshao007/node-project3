import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { WrongCredentialException } from '../exceptions/WrongCredentialException';
import { TokenMissingException } from '../exceptions/TokenMissingException';
import { DataStoredInToken } from '../interfaces/dataStoredInToken';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { userModel } from '../users/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
	const cookies = request.cookies;
	console.log('cookies', cookies);

	if (cookies && cookies.Authorization) {
		const secret = process.env.JWT_SECRET;
		try {
			const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
			const id = verificationResponse._id;
			const user = await userModel.findById(id);
			if (user) {
				request.user = user;
				next();
			} else {
				next(new WrongCredentialException());
			}
		} catch (error) {
			next(new WrongCredentialException());
		}
	} else {
		next(new TokenMissingException());
	}
}

export default authMiddleware;
