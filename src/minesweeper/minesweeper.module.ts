import { Module } from '@nestjs/common';
import { MinesweeperController } from './minesweeper.controller';
import { MinesweeperService } from './minesweeper.service';

@Module({
  controllers: [MinesweeperController],
  providers: [MinesweeperService],
})
export class MinesweeperModule {}
