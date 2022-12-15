import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
	cleanEnv(process.env, {
		MONGODB_URL: str(),
	});
}

export default validateEnv();
