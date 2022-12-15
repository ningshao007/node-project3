import * as mongoose from 'mongoose';
import Post from './post.interface';

/** NOTE:1对多关系 */
const postSchema = new mongoose.Schema({
	author: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	content: String,
	title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export { postModel };
