import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() body: { name: string; description: string; startingPrice: number; duration: number }) {
    return this.auctionService.createItem(body);
  }

  @Get()
  findAll() {
    return this.auctionService.getItems();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.getItem(+id);
  }

  @Post(':id/bid')
  bid(
    @Param('id') id: string,
    @Body() body: { userId: number; amount: number },
  ) {
    return this.auctionService.placeBid(+id, body.userId, body.amount);
  }
}
