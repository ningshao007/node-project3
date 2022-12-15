import App from './app';
import PostsController from './posts/posts.controller';

const app = new App([new PostsController()], 3000);

app.listen();
