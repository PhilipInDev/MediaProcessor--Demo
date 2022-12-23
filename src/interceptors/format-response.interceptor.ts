import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
	statusCode: number;
	message: string;
	data: T;
}

@Injectable()
class FormatResponseInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => ({
				statusCode: context.switchToHttp().getResponse().statusCode,
				reqId: context.switchToHttp().getRequest().reqId,
				message: data.message || '',
				data: data,
			}))
		);
	}
}

export { Response, FormatResponseInterceptor };
