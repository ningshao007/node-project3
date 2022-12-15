import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';
import { AuthenticationController } from './authentication/authentication.controller';
import UserController from './users/user.controller';
// import validateEnv from './utils/validateEnv';

// validateEnv();

const app = new App([new PostsController(), new AuthenticationController(), new UserController()], 3000);

app.listen();
