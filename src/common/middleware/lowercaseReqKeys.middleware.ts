import { Injectable, NestMiddleware, Req, Res, Next } from '@nestjs/common';

@Injectable()
export class LowercaseReqKeysMiddleware implements NestMiddleware {
    use(@Req() req, @Res() res, @Next() next) {
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