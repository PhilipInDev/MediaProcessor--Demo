import { IsNotEmpty, IsUrl, Matches } from 'class-validator';

class ProcessMediaDto {
	@Matches(
		/^(http:\/\/|https:\/\/)/,
		{ message: 'fileUrl must be started with http:// or https://' }
	)
	@IsNotEmpty()
	@IsUrl()
	fileUrl: string;
}

export { ProcessMediaDto }
