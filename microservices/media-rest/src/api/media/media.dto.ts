import { IsNotEmpty, IsUrl } from 'class-validator';

class ProcessMediaDto {
	@IsNotEmpty()
	@IsUrl()
	fileUrl: string;
}

export { ProcessMediaDto }
