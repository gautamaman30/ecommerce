import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';

const logger = new Logger('reqValidationPipe');
    
@Injectable()
export class ReqValidationPipe implements PipeTransform {
    constructor(private schema) {}

    async transform(value: any) {
        try { 
            const result = await this.schema.validate(value);
            return result;
        } catch(err) {
            logger.log(err.message);
            throw new BadRequestException(err.message);
        }
    }
}