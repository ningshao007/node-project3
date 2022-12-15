import * as mongoose from 'mongoose';
import { User } from './user.interface';

/** NOTE:1对1的关系,直接嵌入文档中,方便快捷 */
const addressSchema = new mongoose.Schema({
	city: String,
	street: String,
	country: String,
});

const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	address: {
		// NOTE:
		type: addressSchema,
		require: false,
		default: {
			country: '英国',
			city: '白金汉宫',
			street: '民主路',
		},
	},
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export { userModel };
