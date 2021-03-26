import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { Payments} from './entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payments])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService, TypeOrmModule]
})
export class PaymentsModule {}
