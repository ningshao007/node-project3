import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
});

const userModal = mongoose.model('User', userSchema);

export { userModal };
