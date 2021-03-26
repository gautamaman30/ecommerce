import { Injectable, NestMiddleware, Res, Req, Next, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('LoggerMiddleware');
    
    use(@Req() req, @Res() res, @Next() next) {
        this.logger.log("Request body: ", req.body);
        this.logger.log("Request query: ", req.query);
        this.logger.log("Request parmas: ", req.params); 
        return next();   
    }
}