const apiURL = `${process.env.NEXT_PUBLIC_API_GATEWAY_PROTOCOL}://${process.env.NEXT_PUBLIC_API_GATEWAY_HOST}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}/${process.env.NEXT_PUBLIC_API_GATEWAY_PREFIX}`;

const apiURLWithoutPrefix = `${process.env.NEXT_PUBLIC_API_GATEWAY_PROTOCOL}://${process.env.NEXT_PUBLIC_API_GATEWAY_HOST}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}`;

export {
	apiURL,
	apiURLWithoutPrefix,
}
