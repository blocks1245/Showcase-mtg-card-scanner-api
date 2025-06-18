import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  getCardBySetCodeAndNumber,
  getScannedCards,
  getCardByUUID,
  getScannedCardByName,
} from '../db/db-helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('card')
  async getCardBySetcodeAndNumber(
    @Query('setcode') setcode: string,
    @Query('number') number: string,
  ) {
    return await getCardBySetCodeAndNumber(setcode, number.replace(/^0+/, ''));
  }

  @Post('card')
  async postCardByRawBody(@Body() body: { data: string }) {
    const lines = body.data.split('\n');
    const firstLine = lines[0]?.trim();
    const secondLine = lines[1]?.trim();

    const number = firstLine.split('/')[0].replace(/^0+/, '');
    const setcode = secondLine?.substring(0, 3);

    return await getCardBySetCodeAndNumber(setcode, number);
  }

  @Get('card/:uuid')
  async getCardByUUID(@Param('uuid') uuid: string) {
    const card = await getCardByUUID(uuid);
    if (!card) {
      return { error: 'Card not found' };
    }
    return card;
  }

  @Get('scanned')
  async getScannedCards() {
    return await getScannedCards();
  }

  @Get('scanned/:name')
  async getScannedCardByName(@Param('name') name: string) {
    const card = await getScannedCardByName(name);
    if (!card) {
      return { error: 'Scanned card not found' };
    }
    return card;
  }
}
