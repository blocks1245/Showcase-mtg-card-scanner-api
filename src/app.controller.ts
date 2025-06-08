import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { getCardBySetCodeAndNumber } from '../db/db-helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
    const setcode = secondLine?.split(' ')[0];

    return await getCardBySetCodeAndNumber(setcode, number);
  }
}
