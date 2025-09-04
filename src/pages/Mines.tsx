import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { authAPI } from '../services/api';

interface MinesProps {
    coins: number;
    isLoggedIn: boolean;
    username: string;
    onCoinsUpdate: (newCoins: number) => void;
}

interface Cell {
    id: number;
    isMine: boolean;
    isRevealed: boolean;
}

export default function Mines({ coins, isLoggedIn, username, onCoinsUpdate }: MinesProps) {
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'gameOver' | 'cashedOut'>('setup');
    const [grid, setGrid] = useState<Cell[]>([]);
    const [numMines, setNumMines] = useState(1);
    const [betAmount, setBetAmount] = useState(10);
    const [currentPrize, setCurrentPrize] = useState(0);
    const [revealedCells, setRevealedCells] = useState(0);
    const [gameCoins, setGameCoins] = useState(coins);

    useEffect(() => {
        setGameCoins(coins);
    }, [coins]);

    useEffect(() => {
        if (gameState === 'setup') {
            initializeGrid();
        }
    }, [gameState]);

    const saveCoinsToBackend = async (newCoins: number) => {
        setGameCoins(newCoins);
        onCoinsUpdate(newCoins);

        if (isLoggedIn) {
            try {
                await authAPI.updateCoins(newCoins);
            } catch (error) {
                console.error('Failed to save coins:', error);
            }
        }
    };

    const initializeGrid = () => {
        const newGrid: Cell[] = [];
        for (let i = 0; i < 25; i++) {
            newGrid.push({
                id: i,
                isMine: false,
                isRevealed: false
            });
        }
        setGrid(newGrid);
        setCurrentPrize(0);
        setRevealedCells(0);
    };

    const placeMines = () => {
        const newGrid = [...grid];
        const minePositions = new Set<number>();

        while (minePositions.size < numMines) {
            const randomPos = Math.floor(Math.random() * 25);
            minePositions.add(randomPos);
        }

        minePositions.forEach(pos => {
            newGrid[pos].isMine = true;
        });

        setGrid(newGrid);
        setGameState('playing');
    };

    const startGame = () => {
        if (betAmount > gameCoins) {
            alert('Not enough coins!');
            return;
        }
        if (betAmount < 1) {
            alert('Minimum bet is 1 coin!');
            return;
        }
        if (numMines < 1 || numMines > 24) {
            alert('Number of mines must be between 1 and 24!');
            return;
        }

        const newCoins = gameCoins - betAmount;
        saveCoinsToBackend(newCoins);
        placeMines();
    };

    const calculatePrize = (revealedCount: number, totalMines: number, bet: number) => {

        let prize = bet;
        for (let i = 0; i < revealedCount; i++) {
            const cellsRemainingAtTime = 25 - i;
            const minesRemainingAtTime = totalMines;
            const probabilityAtTime = 1 - minesRemainingAtTime / cellsRemainingAtTime;
            prize *= (1 / probabilityAtTime);
        }

        return Math.floor(prize);
    };

    const handleCellClick = (cellId: number) => {
        if (gameState !== 'playing') return;

        const newGrid = [...grid];
        const cell = newGrid[cellId];

        if (cell.isRevealed) return;

        cell.isRevealed = true;
        const newRevealedCells = revealedCells + 1;
        setRevealedCells(newRevealedCells);

        if (cell.isMine) {
            const revealedGrid = newGrid.map(gridCell => ({
                ...gridCell,
                isRevealed: true
            }));
            setGrid(revealedGrid);
            setGameState('gameOver');
            setCurrentPrize(0);
        } else {
            const newPrize = calculatePrize(newRevealedCells, numMines, betAmount);
            setCurrentPrize(newPrize);
            setGrid(newGrid);
        }
    };


    const cashOut = () => {
        if (gameState !== 'playing') return;

        const newGrid = grid.map(cell => ({
            ...cell,
            isRevealed: true
        }));
        setGrid(newGrid);

        const newCoins = gameCoins + currentPrize;
        saveCoinsToBackend(newCoins);
        setGameState('cashedOut');
    };

    const resetGame = () => {
        setGameState('setup');
        setCurrentPrize(0);
        setRevealedCells(0);
        initializeGrid();
    };

    const getCellContent = (cell: Cell) => {
        if (cell.isMine && (gameState === 'gameOver' || gameState === 'cashedOut')) return '💣';
        if (cell.isRevealed) return '💎';
        return '';
    };

    const getCellStyle = (cell: Cell) => {
        const baseStyle = {
            width: '100%',
            height: '100%',
            border: '2px solid #4b5563',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: gameState === 'playing' ? 'pointer' : 'default',
            fontSize: 'clamp(20px, 4vw, 40px)',
            transition: 'all 0.2s ease',
        };

        if (cell.isMine && (gameState === 'gameOver' || gameState === 'cashedOut')) {
            return {
                ...baseStyle,
                backgroundColor: '#ef4444',
                color: 'white',
            };
        } else if (cell.isRevealed) {
            return {
                ...baseStyle,
                backgroundColor: '#10b981',
                color: 'white',
            };
        } else {
            return {
                ...baseStyle,
                backgroundColor: '#374151',
                color: '#9ca3af',
            };
        }
    };

    return (
        <div>
            <Header coins={gameCoins} isLoggedIn={isLoggedIn} username={username} />

            <main style={{
                display: 'flex',
                flex: 1,
                padding: 'clamp(4px, 1vw, 12px)',
                height: 'calc(100vh - 80px)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '33.333%',
                    minWidth: '300px',
                    maxWidth: '400px',
                    paddingRight: '16px'
                }}>
                    <div>
                        <h1>
                            Mines
                        </h1>
                    </div>

                    {gameState === 'setup' && (
                        <div>
                            <div>
                                <div>
                                    <label>
                                        Number of Mines:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={numMines}
                                        onChange={(e) => setNumMines(parseInt(e.target.value) || 1)}
                                    />
                                </div>

                                <div>
                                    <label>
                                        Bet Amount:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={gameCoins}
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(parseInt(e.target.value) || 1)}
                                    />
                                </div>

                                <button onClick={startGame}>
                                    Start Game
                                </button>
                            </div>
                        </div>
                    )}

                    {gameState === 'playing' && (
                        <div className="mb-4">
                            <button onClick={cashOut}>
                                Cash Out ({currentPrize} coins)
                            </button>
                        </div>
                    )}

                    {(gameState === 'gameOver' || gameState === 'cashedOut') && (
                        <div>
                            <h2>
                                {gameState === 'gameOver' ? 'Game Over!' : 'Cashed Out!'}
                            </h2>
                            <p>
                                {gameState === 'gameOver'
                                    ? 'You hit a mine! Better luck next time.'
                                    : `Congratulations! You won ${currentPrize} coins!`
                                }
                            </p>
                            <button onClick={resetGame}>
                                Play Again
                            </button>
                        </div>
                    )}

                    <div>
                        <Link to="/">
                            Back to Home
                        </Link>
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100%'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gridTemplateRows: 'repeat(5, 1fr)',
                        gap: 'clamp(4px, 1vw, 8px)',
                        width: 'clamp(400px, 60vw, 600px)',
                        height: 'clamp(400px, 60vw, 600px)',
                        maxWidth: '90%',
                        maxHeight: '90%'
                    }}>
                        {grid.map((cell) => (
                            <div
                                key={cell.id}
                                style={getCellStyle(cell)}
                                onClick={() => gameState === 'playing' ? handleCellClick(cell.id) : null}
                            >
                                {getCellContent(cell)}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}