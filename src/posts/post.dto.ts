import { IsMongoId, IsString } from 'class-validator';

class CreatePostDto {
	// NOTE: 关联mongoId
	@IsMongoId()
	public author: string;

	@IsString()
	public content: string;

	@IsString()
	public title: string;
}

export { CreatePostDto };
