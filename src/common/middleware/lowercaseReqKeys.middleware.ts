import { Injectable, NestMiddleware, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LowercaseReqKeysMiddleware implements NestMiddleware {
    use(@Req() req: Request,@Res() res: Response,@Next() next: NextFunction) {
        for(let key in req.body) {
            req.body[key.toLowerCase()] = req.body[key];
        }
        for(let key in req.query) {
            req.query[key.toLowerCase()] = req.query[key];
        }
        for(let key in req.params) {
            req.params[key.toLowerCase()] = req.params[key];
        }
        return next();   
    }
}