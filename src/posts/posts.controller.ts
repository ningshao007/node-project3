import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import Post from './post.interface';
import { postModel } from './posts.model';

class PostsController implements Controller {
	public path = '/posts';
	public router = express.Router();
	private post = postModel;

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		this.router.get(this.path, this.getAllPosts);
		this.router.post(this.path, this.createAPost);
		this.router.get(`${this.path}/:id`, this.getThePostById);
		this.router.put(`${this.path}/:id`, this.modifyThePost);
		this.router.delete(`${this.path}/:id`, this.deleteAPost);
	}

	private createAPost = (request: express.Request, response: express.Response) => {
		const postData: Post = request.body;
		const createdPost = new this.post(postData);
		createdPost.save().then((savedPost) => {
			response.send(savedPost);
		});
	};

	private getAllPosts = (request: express.Request, response: express.Response) => {
		this.post.find().then((posts) => {
			response.send(posts);
		});
	};

	private getThePostById = (request: express.Request, response: express.Response) => {
		const id = request.params.id;
		this.post.findById(id).then((post) => {
			response.send(post);
		});
	};

	private modifyThePost = (request: express.Request, response: express.Response) => {
		const id = request.params.id;
		const postData: Post = request.body;
		this.post.findByIdAndUpdate(id, postData, { new: true }).then((result) => response.send(result));
	};

	private deleteAPost = (request: express.Request, response: express.Response) => {
		const id = request.params.id;
		this.post.findByIdAndDelete(id).then((successResponse) => {
			if (successResponse) {
				response.sendStatus(200);
			} else {
				response.sendStatus(404);
			}
		});
	};
}

export default PostsController;
