import * as mongoose from 'mongoose';
import { User } from './user.interface';

/** NOTE:1对1的关系,直接嵌入文档中,方便快捷 */
const addressSchema = new mongoose.Schema({
	city: String,
	street: String,
	country: String,
});

const userSchema = new mongoose.Schema(
	{
		email: String,
		name: String,
		password: {
			type: String,
			get: (): undefined => undefined,
		},
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
	},
	{
		toJSON: {
			getters: true,
		},
	},
);

// NOTE: 如果没有下面的, => Cannot populate path `posts` because it is not in your schema. Set the `strictPopulate` option to false to override.
userSchema.virtual('posts', {
	ref: 'Post',
	localField: '_id',
	foreignField: 'author',
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export { userModel };
