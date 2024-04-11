import { MinesweeperService, DifficultyLevel } from './minesweeper.service';

describe('MinesweeperService', () => {
  let service: MinesweeperService;

  beforeEach(() => {
    service = new MinesweeperService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a game board of correct size', () => {
    const gridSize = 5;
    const numberOfMines = 5;
    const gameBoard = service['generateGameBoard'](gridSize, numberOfMines);

    expect(gameBoard.length).toEqual(gridSize);
    expect(gameBoard.every((row) => row.length === gridSize)).toBeTruthy();
  });

  it('should validate bet data correctly', () => {
    const validBetData = {
      difficultyLevel: DifficultyLevel.MEDIUM,
      timeSpent: 30,
      numberOfMines: 10,
      betAmount: 10,
    };
    const invalidBetData1 = {
      difficultyLevel: DifficultyLevel.HARD,
      timeSpent: -10,
      numberOfMines: 5,
      betAmount: 10,
    };
    const invalidBetData2 = {
      difficultyLevel: DifficultyLevel.LOW,
      timeSpent: 20,
      numberOfMines: -5,
      betAmount: 10,
    };

    expect(service['isValidBetData'](validBetData)).toBeTruthy();
    expect(service['isValidBetData'](invalidBetData1)).toBeFalsy();
    expect(service['isValidBetData'](invalidBetData2)).toBeFalsy();
  });

  it('should place a bet successfully', () => {
    const userId = 'user1';
    const betData = {
      difficultyLevel: DifficultyLevel.MEDIUM,
      timeSpent: 30,
      numberOfMines: 10,
      betAmount: 10,
    };
    service.placeBet(userId, betData);

    const user = service['users'][userId];
    expect(user.balance).toBeLessThan(1000); // Assuming initial balance is less than 1000
    expect(user.bets.length).toBe(1);
  });

  it('should cash out successfully', () => {
    const userId = 'user1';
    const initialBalance = 1000;
    const betAmount = 10;
    const betData = {
      difficultyLevel: DifficultyLevel.MEDIUM,
      timeSpent: 30,
      numberOfMines: 10,
      betAmount,
    };
    service['users'][userId] = {
      balance: initialBalance,
      bets: [{ betData, multiplier: 2 }],
      winnings: 0,
    };

    const cashoutResult = service.cashout(userId);

    expect(cashoutResult.totalWinnings).toBe(betAmount * 2);
    expect(service['users'][userId].balance).toBe(
      initialBalance + betAmount * 2,
    );
    expect(service['users'][userId].bets.length).toBe(0);
  });

  it('should throw error for invalid bet data', () => {
    const userId = 'user1';
    const invalidBetData = {
      difficultyLevel: DifficultyLevel.HARD,
      timeSpent: -10,
      numberOfMines: 5,
      betAmount: 10,
    };

    expect(() => service.placeBet(userId, invalidBetData)).toThrowError(
      'Invalid bet data',
    );
  });

  it('should throw error if user not found', () => {
    const userId = 'invalidUser';
    const betData = {
      difficultyLevel: DifficultyLevel.MEDIUM,
      timeSpent: 30,
      numberOfMines: 10,
      betAmount: 10,
    };

    expect(() => service.placeBet(userId, betData)).toThrowError(
      'User not found',
    );
  });

  it('should throw error for insufficient balance', () => {
    const userId = 'user1';
    const initialBalance = 5; // Assuming initial balance is insufficient
    const betAmount = 10;
    const betData = {
      difficultyLevel: DifficultyLevel.MEDIUM,
      timeSpent: 30,
      numberOfMines: 10,
      betAmount,
    };
    service['users'][userId] = {
      balance: initialBalance,
      bets: [],
      winnings: 0,
    };

    expect(() => service.placeBet(userId, betData)).toThrowError(
      'Insufficient balance',
    );
  });
});
