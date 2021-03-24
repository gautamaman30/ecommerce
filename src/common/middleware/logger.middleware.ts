import { Injectable, NestMiddleware, Res, Req, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(@Req() req: Request,@Res() res: Response,@Next() next: NextFunction) {
        console.log("Request body: ", req.body);
        console.log("Request query: ", req.query);
        console.log("Request parmas: ", req.params); 
        return next();   
    }
}