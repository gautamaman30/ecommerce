import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WalletsService } from './wallets.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, WalletsService],
  exports: [PaymentsService, WalletsService]
})
export class PaymentsModule {}
