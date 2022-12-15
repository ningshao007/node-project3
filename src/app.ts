import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

class App {
	public app: express.Application;
	public port: number;

	constructor(controllers, port) {
		this.app = express();
		this.port = port;

		this.connectToTheDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	private initializeControllers(controllers) {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
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
