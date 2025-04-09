import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItem } from './auction/auction.entity';
import { Bid } from './auction/bid.entity';
import { User } from './users/user.entity';
import { AuctionService } from './auction/auction.service';
import { AuctionController } from './auction/auction.controller';
import { AuctionGateway } from './gateway/auction.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'auction',
      entities: [User, AuctionItem, Bid],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AuctionItem, Bid, User]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway],
})
export class AppModule {}
