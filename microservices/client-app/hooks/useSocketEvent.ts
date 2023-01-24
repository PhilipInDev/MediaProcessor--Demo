import { useEffect, useState } from 'react';
import { SocketEvent } from '../common'
import { Socket } from '../services';

type WebSocketResponse <P> = {
	payload: P | null;
	error: { message: string; details?: unknown; timestamp: number; type?: string } | null;
}

function useSocketEvent <ExpectedMessage>(event: SocketEvent | string) {
	const [isConnected, setIsConnected] = useState(Socket.connected);
	const [lastMessage, setLastMessage] = useState<WebSocketResponse<ExpectedMessage> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (event) {
			Socket.connect();
			Socket.on('connect', () => {
				setIsConnected(true);
			});

			Socket.on('disconnect', () => {
				setIsConnected(false);
			});

			Socket.on(event, (data) => {
				setLastMessage(data);
			});

			Socket.on('error', (e) => {
				setError(JSON.stringify(e));
			})

			return () => {
				Socket.off('connect');
				Socket.off('disconnect');
				Socket.off(event);
			};
		}
	}, [event]);

	return {
		emit: (data: unknown) => Socket.emit(event, data),
		removeALlListeners: () => Socket.removeAllListeners(event),
		close: Socket.close,
		message: lastMessage,
		resetState: () => setLastMessage(null),
		isConnected,
		error,
	}
}

export { useSocketEvent }
