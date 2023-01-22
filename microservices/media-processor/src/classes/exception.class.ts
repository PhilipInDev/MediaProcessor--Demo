interface IException {
	message: string;

	details: unknown;

	type: string;

	timestamp: number;
}

class Exception implements IException{
	message: string;

	details: unknown = null;

	type: string = "Unclassified Error";

	timestamp: number;

	constructor({
		message,
		details,
		type,
	}: {
		message: string,
		details?: unknown,
		type?: string,
	}) {
		this.message = message;
		this.details = details;
		this.type = type;
		this.timestamp = new Date().getTime();
	}
}

export { Exception, IException };
