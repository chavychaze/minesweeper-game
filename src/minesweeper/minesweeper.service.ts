import { Injectable, NotFoundException } from '@nestjs/common';

export enum DifficultyLevel {
  LOW = 1,
  MEDIUM = 2,
  HARD = 3,
}

@Injectable()
export class MinesweeperService {
  private currentGame: any;
  private users: {
    [key: string]: {
      balance: number;
      bets: { betData: any; multiplier: number }[];
      winnings: number;
    };
  } = {};

  private isValidBetData(betData: {
    difficultyLevel: DifficultyLevel;
    timeSpent: number;
    numberOfMines: number;
  }): boolean {
    return (
      betData &&
      betData.difficultyLevel >= DifficultyLevel.LOW &&
      betData.timeSpent >= 0 &&
      betData.numberOfMines >= 0
    );
  }

  private generateGameBoard(
    gridSize: number,
    numberOfMines: number,
  ): number[][] {
    const gameBoard: number[][] = [];

    for (let i = 0; i < gridSize; i++) {
      gameBoard.push(Array(gridSize).fill(0));
    }

    let minesPlaced = 0;
    while (minesPlaced < numberOfMines) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (gameBoard[row][col] !== numberOfMines) {
        gameBoard[row][col] = numberOfMines;
        minesPlaced++;
      }
    }

    return gameBoard;
  }

  getCurrentGame(userId) {
    if (!this.currentGame) {
      this.currentGame = this.generateGameBoard(
        this.users[userId].bets[0].betData.difficultyLevel,
        this.users[userId].bets[0].betData.numberOfMines,
      );
      return this.currentGame;
    }
    return this.currentGame;
  }

  placeBet(
    userId: string,
    betData: {
      difficultyLevel: DifficultyLevel;
      timeSpent: number;
      numberOfMines: number;
      betAmount: number;
    },
  ) {
    if (!this.isValidBetData(betData)) {
      throw new Error('Invalid bet data');
    }

    if (!this.users[userId]) {
      throw new NotFoundException('User not found');
    }

    const multiplier =
      (betData.difficultyLevel / (betData.timeSpent + 1)) *
      ((betData.numberOfMines + 1) / 10);

    if (this.users[userId].balance < betData.betAmount) {
      throw new Error('Insufficient balance');
    }

    this.users[userId].balance -= betData.betAmount;

    this.users[userId].bets.push({ betData, multiplier });

    return { multiplier };
  }

  cashout(userId: string) {
    if (!this.users[userId]) {
      throw new NotFoundException('User not found');
    }

    const totalWinnings = this.users[userId].bets.reduce(
      (acc, bet) => acc + bet.multiplier * bet.betData.betAmount,
      0,
    );

    // Add total winnings to user's balance
    this.users[userId].balance += totalWinnings;

    // Clear user's betting history
    this.users[userId].bets = [];

    // Store total winnings in user's account
    this.users[userId].winnings += totalWinnings;

    return { totalWinnings };
  }
}
