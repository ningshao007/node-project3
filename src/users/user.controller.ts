import { NextFunction, Request, Response, Router } from 'express';
import { NotAuthorizedException } from '../exceptions/NotAuthorizedException';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import Controller from '../interfaces/controller.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middleware';
import { postModel } from '../posts/posts.model';
import { userModel } from './user.model';

class UserController implements Controller {
	public path = '/users';
	public router = Router();
	private post = postModel;
	private user = userModel;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
		this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
	}

	private getAllPostsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
		const userId = request.params.id;

		if (userId === request.user._id.toString()) {
			const posts = await this.post.find({ author: userId });

			response.send(posts);
		}

		next(new NotAuthorizedException());
	};

	private getUserById = async (request: Request, response: Response, next: NextFunction) => {
		const id = request.params.id;
		const withPosts = request.query.withPosts;

		const userQuery = await this.user.findById(id);

		if (!userQuery) {
			response.send(new UserNotFoundException(id));

			throw new UserNotFoundException(id);
		}

		if (withPosts === 'true') {
			const user = await userQuery.populate('posts');

			response.send(user);
		} else {
			response.send(userQuery);
		}
	};
}

export default UserController;
