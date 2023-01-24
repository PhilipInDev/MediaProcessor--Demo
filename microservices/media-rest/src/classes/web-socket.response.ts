class WebSocketResponse {
	payload: any;
	error?;

	constructor(payload: any, error?: { message: string; details: unknown; }) {
		this.error = error;
		this.payload = payload;
	}
}

export { WebSocketResponse };
