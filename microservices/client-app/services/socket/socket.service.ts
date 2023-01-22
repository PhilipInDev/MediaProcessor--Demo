import io from 'socket.io-client'
import { apiURLWithoutPrefix } from '../../config';

const Socket = io(
	apiURLWithoutPrefix,
	{
		transports: ['websocket']
	}
);

Socket.on('connect', () => {
	console.log('WebSocket connection is established');
});

Socket.on('disconnect', () => {
	console.log('WebSocket connection is closed');
});

export { Socket };
