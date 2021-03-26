import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';
    
@Injectable()
export class ReqValidationPipe implements PipeTransform {
    
    private readonly logger = new Logger('ReqValidationPipe');
    
    constructor(private schema) {}

    async transform(value: any) {
        try { 
            const result = await this.schema.validate(value);
            return result;
        } catch(err) {
            this.logger.log(err.message);
            throw new BadRequestException(err.message);
        }
    }
}