import { Repository } from '../../common';
import { FileMetadata } from './file-metadata.entity';

const fileMetadataProviders = [
	{
		provide: Repository.FILE_METADATA,
		useValue: FileMetadata,
	},
];

export { fileMetadataProviders };
