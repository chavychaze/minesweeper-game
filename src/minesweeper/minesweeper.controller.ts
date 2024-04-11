import { Controller, Get, Post, Body } from '@nestjs/common';
import { DifficultyLevel, MinesweeperService } from './minesweeper.service';

@Controller('minesweeper')
export class MinesweeperController {
  constructor(private readonly minesweeperService: MinesweeperService) {}

  @Get('current-game')
  getCurrentGame(
    @Body()
    userData: {
      userId: string;
    },
  ) {
    return this.minesweeperService.getCurrentGame(userData.userId);
  }

  @Post('place-bet')
  placeBet(
    @Body()
    userData: {
      userId: string;
      betData: {
        difficultyLevel: DifficultyLevel;
        timeSpent: number;
        numberOfMines: number;
        betAmount: number;
      };
    },
  ) {
    // Extract userId from the request body
    const { userId, betData } = userData;
    return this.minesweeperService.placeBet(userId, betData);
  }

  @Post('cashout')
  cashout(@Body() userData: { userId: string }) {
    // Extract userId from the request body
    const { userId } = userData;
    return this.minesweeperService.cashout(userId);
  }
}
