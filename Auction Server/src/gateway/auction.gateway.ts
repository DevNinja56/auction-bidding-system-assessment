import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuctionItem } from 'src/auction/auction.entity';

@WebSocketGateway({ cors: true })
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  sendBidUpdate(itemId: number, data: any) {
    this.server.emit(`bid-update-${itemId}`, data);
  }

    emitAuctionCreated(auction: AuctionItem) {
      this.server.emit('auction-list-updated', { type: 'created', auction });
    }
  
    emitAuctionEnded(auction: AuctionItem) {
      this.server.emit('auction-list-updated', { type: 'ended', auctionId: auction.id });
    }
}
