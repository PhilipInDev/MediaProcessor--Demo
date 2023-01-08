import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
const ffprobe = require('ffprobe');
import { FFProbeResult } from 'ffprobe';
import { join, resolve } from 'path';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { WritableStream } from 'stream/web';
import { FileType } from './file-types.enum';

class MPHelpers {

	static getFileType(contentType: string) {
		if (contentType.includes(FileType.VIDEO)) return FileType.VIDEO;
		if (contentType.includes(FileType.AUDIO)) return FileType.AUDIO;
		if (contentType.includes(FileType.IMAGE)) return FileType.IMAGE;
	}

	static getFileExtension(contentType: string) {
		return contentType.split('/')[1];
	}

	static getOriginalFileName(disposition: string) {
		const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
		const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

		let fileName: string | null = null;
		if (utf8FilenameRegex.test(disposition)) {
			fileName = decodeURIComponent(utf8FilenameRegex.exec(disposition)[1]);
		} else {
			// prevent ReDos attacks by anchoring the ascii regex to string start and
			// slicing off everything before 'filename='
			const filenameStart = disposition.toLowerCase().indexOf('filename=');
			if (filenameStart >= 0) {
				const partialDisposition = disposition.slice(filenameStart);
				const matches = asciiFilenameRegex.exec(partialDisposition );
				if (matches != null && matches[2]) {
					fileName = matches[2];
				}
			}
		}
		return fileName;
	}

	static async getFileMetadata(filePath: string): Promise<FFProbeResult> {
		return ffprobe(filePath, { path: ffprobePath });
	}

	static getFileMetadataByHttpHeaders(headers: Headers) {
		const contentType = headers.get('content-type');
		const contentSizeBytes = headers.get('content-length');
		const fileType = MPHelpers.getFileType(contentType);
		const contentSizeMb = MPHelpers.bytesToMbs(Number(contentSizeBytes));

		return { contentType, contentSizeMb, contentSizeBytes, fileType };
	}

	static async createFile({ body, headers }: Response, dirPath: string) {
		const disposition = headers.get('content-disposition');
		const fileName = (disposition && MPHelpers.getOriginalFileName(disposition)) || 'default_file_name';
		const filePath = join(dirPath, fileName);

		writeFileSync(filePath, '');
		const stream = createWriteStream(filePath, { flags: 'a+' });
		const writableStream = new WritableStream({
			write: (chunk) => {
				stream.write(chunk)
			}
		});
		await body.pipeTo(writableStream);

		return { filePath, fileName };
	}

	static createUniqueDir(
		path: string, // where dir should be created
	) {
		const rootDirPath = resolve(join(path, 'files'));
		if (!existsSync(rootDirPath)) {
			mkdirSync(rootDirPath);
		}

		let pathToDirectory: string | null = null;
		let counter = 0;

		while (!pathToDirectory) {
			const dirPath = resolve(join(path, 'files', `file-${counter}`));
			if (!existsSync(dirPath)) {
				mkdirSync(dirPath);
				pathToDirectory = dirPath;
			}

			counter++;
		}

		return pathToDirectory;
	}

	static bytesToMbs (sizeInBytes: number) {
		return Number((sizeInBytes / (1024 * 1024)).toFixed(2));
	}
}

export { MPHelpers };
