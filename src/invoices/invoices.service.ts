import { HttpException, Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import * as PdfDocument from 'pdfkit';
import { createReadStream, createWriteStream, unlink } from 'fs';

import { Invoices } from './entity';
import { configObj } from '../common/configEnv';
import { GetInvoicesDto, CreateInvoicesDto} from './dto';
import { Errors, helperFunctions, Messages } from 'src/common/utils';

@Injectable()
export class InvoicesService {
    
    private logger = new Logger('InvoicesService');
    private s3 = new S3({
        credentials: {
        accessKeyId: configObj.AWS_ACCESS_KEY_ID,
        secretAccessKey: configObj.AWS_SECRET_ACCESS_KEY
        },
        region: configObj.AWS_REGION
    });

    constructor(@InjectRepository(Invoices) private invoicesRepository: Repository<Invoices>) {}

    async findInvoices(getInvoicesDto: GetInvoicesDto) {
        try {
            const invoice = await this.invoicesRepository.findOne(getInvoicesDto);
            
            if(!invoice) {
                return new HttpException(Errors.INVOICE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const url = await new Promise((resolve, reject) => {
                this.s3.getSignedUrl('getObject', {   
                        Bucket: configObj.AWS_BUCKET_NAME, 
                        Key: `${invoice.invoice_id}.pdf`, 
                        Expires: 120
                    }, (err, url) => {
                        if(err) this.logger.log(err);
                        if(url) resolve(url);
                    }
                );
            });
            
            return {message: Messages.INVOICE_GENERATED_SUCCESSFULLY, download_invoice: url, download_invoice_expires: '2 minutes', invoice};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createInvoices(createInvoicesDto: CreateInvoicesDto) {
        try {
            createInvoicesDto.invoice_id = helperFunctions.generateRandomId();
            const invoice_name = `${createInvoicesDto.invoice_id}.pdf`;

            const doc = new PdfDocument();
            doc.pipe(createWriteStream(invoice_name));
            
            doc.font('Helvetica-Bold')
                .fontSize(25)
                .text('Invoice', 100, 100)
                .fontSize(15)
                .text(` #:   ${createInvoicesDto.invoice_id}`, 350, 110);

            doc.save()
                .moveTo(100, 140)
                .lineTo(500, 140)
                .fill('#000000');

            doc.font('Helvetica-Bold')
                .fontSize(15)
                .text(`Customer id:   ${createInvoicesDto.customer_id}`, 100, 170)
                .text(`Name:   ${createInvoicesDto.customer_name}`, 100, 190)
                .text(`Email:   ${createInvoicesDto.customer_email}`, 100, 210); 

            doc.font('Helvetica-Bold')
                .fontSize(15)
                .text(`Order id:   ${createInvoicesDto.order_id}`, 100, 250)
                .text(`Payment id:   ${createInvoicesDto.payment_id}`, 100, 270);

            doc.font('Helvetica-Bold')
                .fontSize(15)
                .text(`Product name:   ${createInvoicesDto.product_name}`, 100, 300)
                .text(`Sold by:   ${createInvoicesDto.sold_by}`, 100, 320)
                .text(`Unit price:   ${createInvoicesDto.unit_price}`, 350, 340)
                .text(`Quantity:   ${createInvoicesDto.unit_price}`, 350, 360);

            doc.font('Helvetica-Bold')
                .fontSize(20)
                .text('Total amount : ', 250, 410)
                .text(`  ${createInvoicesDto.unit_price}`, 400, 410);
            
            doc.end();

            const stream = createReadStream(invoice_name);
            stream.on('error', (err) => {
                this.logger.log(err.message);
            })
            
            const uploadParams = {
                Bucket: configObj.AWS_BUCKET_NAME,
                Key: invoice_name,
                Body: stream
            }

            this.s3.upload(uploadParams, (err, data) => {
                if(err) {
                    this.logger.log(err);
                }
                if(data) {
                    this.logger.log(data);
                } 
            })

            unlink(invoice_name, () => {
                this.logger.log(Messages.INVOICE_DELETED_SUCCESSFULLY);
            });

            const invoice = await this.invoicesRepository.insert(createInvoicesDto);
            return {message: Messages.INVOICE_CREATED_SUCCESSFULLY, createInvoicesDto};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
