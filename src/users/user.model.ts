import * as mongoose from 'mongoose';
import { User } from './user.interface';

const addressSchema = new mongoose.Schema({
	city: String,
	street: String,
});

const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	address: {
		type: addressSchema,
		require: false,
		default: {
			city: '法制市',
			street: '民主路',
		},
	},
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export { userModel };
