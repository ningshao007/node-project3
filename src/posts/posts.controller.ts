import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import Post from './post.interface';
import { postModel } from './posts.model';
import { validationMiddleware } from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { PostNotFoundException } from '../exceptions/PostNotFoundException';
import { CreatePostDto } from './post.dto';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';

class PostsController implements Controller {
	public path = '/posts';
	public router = express.Router();
	private post = postModel;

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
		this.router.get(`${this.path}/:id`, authMiddleware, this.getPostById);
		this.router.get(this.path, authMiddleware, this.getAllPosts);
		this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreatePostDto), this.modifyPost);
		this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
	}

	private createPost = async (request: RequestWithUser, response: express.Response) => {
		const postData = request.body;

		try {
			const createdPost = await this.post.create({
				...postData,
				author: request.user._id,
			});

			response.json(createdPost);
		} catch (error) {
			response.status(500).send({ message: '服务器出错了' });
		}
	};

	private getAllPosts = async (request: express.Request, response: express.Response) => {
		try {
			const posts = await this.post.find().populate('author', '-password');

			response.send(posts);
		} catch (error) {
			response.status(500).send({ message: 'oops,something went wrong,please try it later', OK: false });
		}
	};

	private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;

		try {
			const post = await this.post.findById(id);

			if (post) {
				response.send(post);
			} else {
				// NOTE: this.app.use(errorMiddleware)会到这里来
				next(new PostNotFoundException(id));
			}
		} catch (error) {
			// response.status(500).send({ message: 'oops,something went wrong' });
			next(new Error('OOPS!!!!,please give me the exist ID'));
		}
	};

	private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		const postData: Post = request.body;

		try {
			const post = await this.post.findByIdAndUpdate(id, postData, { new: true });

			if (post) {
				response.send(post);
			} else {
				next(new PostNotFoundException(id));
			}
		} catch (error) {
			next(new Error(error));
			// response.status(500).send('oops');
		}
	};

	private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;

		try {
			const result = await this.post.findByIdAndDelete(id);

			response.json({ message: 'OK', result: result });
		} catch (error) {
			next(new PostNotFoundException(id));
		}
	};
}

export default PostsController;
