import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, callHandler: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        
        return callHandler.handle().pipe(
            map(res => {
                if(res.response) {
                    response.statusCode = res.status;
                    return {
                        data: null,
                        error: res.message,
                        status: res.status
                    }   
                }
                else {
                    return {
                        data: res,
                        error: null,
                        status: res.status? res.status : response.statusCode
                    }
                }
            })
         );
    }
}
