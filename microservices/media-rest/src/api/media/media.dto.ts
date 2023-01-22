import {
	IsArray,
	IsNotEmpty,
	IsUrl,
	Matches,
	ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';

class ProcessMediaDto {
	@Matches(
		/^(http:\/\/|https:\/\/)/,
		{ message: 'fileUrl must be started with http:// or https://' }
	)
	@IsNotEmpty()
	@IsUrl()
	fileUrl: string;

	id?: string;

	langForOCR?: string;
}

class ProcessMediaDtoArray {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProcessMediaDto)
	files: ProcessMediaDto[];
}

export { ProcessMediaDto, ProcessMediaDtoArray }
