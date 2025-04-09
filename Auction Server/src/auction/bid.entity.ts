import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { AuctionItem } from './auction.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bids)
  user: User;

  @ManyToOne(() => AuctionItem, item => item.bids)
  item: AuctionItem;

  @Column('decimal')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
