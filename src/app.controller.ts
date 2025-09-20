import { BadRequestException, Body, Controller, Get, Param, Post, Query, HttpCode } from '@nestjs/common';
import {
  getCardBySetCodeAndNumber,
  getScannedCards,
  getCardByUUID,
  getScannedCardByName,
  getCardByName,
  addCardToScanned,
} from './db-helper';
import { NotificationsGateway } from './notif/notification.gateway';
@Controller()
export class AppController {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    ) {}

  @Get('card')
  async getCardBySetcodeAndNumber(
    @Query('setcode') setcode: string,
    @Query('number') number: string,
  ) {
    if (!setcode || !number) {
      throw new BadRequestException('Missing setcode or number query parameter.');
    }
    return await getCardBySetCodeAndNumber(setcode, number.replace(/^0+/, ''));
  }

  @Get('card/:name')
  async getCardByName(@Param('name') name: string) {
    const card = await getCardByName(name);
    if (!card) {
      return { error: 'Card not found' };
    }
    return card;
  }

  @Post('card')
  @HttpCode(200)
  async postCardByRawBody(@Body() body: { data: string }) {
    const lines = body.data.split('\n').map(line => line.trim()).filter(Boolean);

    // Find index of the first line that starts with a number
    const firstLineIndex = lines.findIndex(line => /^\d/.test(line));
    if (firstLineIndex === -1) {
      throw new BadRequestException('No line starting with a number was found.');
    }

    const firstLine = lines[firstLineIndex];
    const secondLine = lines[firstLineIndex + 1];

    const number = firstLine.split('/')[0].replace(/^0+/, '');
    const setcode = secondLine?.substring(0, 3);

    if (setcode && number) {
      const card = await getCardBySetCodeAndNumber(setcode, number);
      return card;
    } 
    return { error: 'Invalid card data format' }
  }

  @Post('card/uuid/:uuid')
  @HttpCode(200)
  async postCardByUUID(@Body() body: { uuid: string }) {
    const { uuid } = body;
    if (!uuid) {
      throw new BadRequestException('Missing uuid in request body.');
    }
    const card = await getCardByUUID(uuid);
    if (card) {
      await addCardToScanned(card.uuid);

      this.notificationsGateway.notifyCardAdded(card);

    } else {
      throw new BadRequestException('Card not found in database.');
    }
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
