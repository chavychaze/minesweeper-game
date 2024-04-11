import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MinesweeperModule } from './minesweeper/minesweeper.module';
import { AppService } from './app.service';

@Module({
  imports: [MinesweeperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
