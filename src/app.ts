import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';

class App {
	public app: express.Application;
	public port: number;

	constructor(controllers, port) {
		this.app = express();
		this.port = port;

		this.connectToTheDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cookieParser());
	}

	private initializeControllers(controllers) {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private connectToTheDatabase() {
		const { MONGODB_URL } = process.env;

		mongoose.connect(MONGODB_URL, (err) => {
			console.log(`数据库正在启动中~~~~~~,错误回调: `, err);
		});
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`App is listening on the port ${this.port}`);
		});
	}
}

export default App;
