import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionItem } from './auction.entity';
import { Bid } from './bid.entity';
import { User } from '../users/user.entity';
import { AuctionGateway } from '../gateway/auction.gateway';
import { DataSource } from 'typeorm';
@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionItem)
    private itemRepo: Repository<AuctionItem>,
    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private gateway: AuctionGateway,
    private dataSource: DataSource
  ) {}
  async createItem(data: { name: string; description: string; startingPrice: number; duration: number }) {
    const item = this.itemRepo.create({ ...data, startTime: new Date() });
    this.gateway.emitAuctionCreated(item);
    return this.itemRepo.save(item);
  }
  async getItems() {
    return this.itemRepo.find({ relations: ['bids'] });
  }
  async getItem(id: number) {
    const item = await this.itemRepo.findOne({ where: { id }, relations: ['bids', 'bids.user'] });
    if (!item) throw new NotFoundException('Auction item not found');
    return item;
  }
  async placeBid(itemId: number, userId: number, amount: number) {
    return await this.dataSource.transaction('SERIALIZABLE', async (manager) => {
      const itemRepo = manager.getRepository(AuctionItem);
      const userRepo = manager.getRepository(User);
      const bidRepo = manager.getRepository(Bid);
      const item = await itemRepo.findOne({
        where: { id: itemId },
        lock: { mode: 'pessimistic_write' },
        relations: ['bids'],
      });
      if (!item) throw new NotFoundException('Auction item not found');
      const endTime = new Date(item.startTime.getTime() + item.duration * 1000);
      if (new Date() > endTime) throw new BadRequestException('Auction has ended');
      const user = await userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');
      const highestBid = await bidRepo.findOne({
        where: { item: { id: itemId } },
        order: { amount: 'DESC' },
      });
      const minBid = highestBid ? Number(highestBid.amount) : Number(item.startingPrice);
      if (amount <= minBid) {
        throw new BadRequestException(`Bid must be higher than ${minBid}`);
      }
      const bid = bidRepo.create({ user, item, amount });
      await bidRepo.save(bid);
      const updatedItem = await itemRepo.findOne({
        where: { id: itemId },
        relations: ['bids', 'bids.user'],
      });
      this.gateway.sendBidUpdate(itemId, updatedItem);
      return updatedItem;
    });
  }
}