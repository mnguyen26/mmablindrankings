import { useEffect, useState } from 'react';

import {MantineProvider, Button} from '@mantine/core';

import fighter_pics from './JSON/fighter_pics.json';
import fighter_ratings from './JSON/fighter_peak_elo_records.json';


interface RandomizerProps {
    isRunning: boolean;
    fighterRankings: string[];
    pickFighter: (fighter: string) => void;
    handleStop: () => void;
}

interface RankingsProps {
    fighterRankings: string[];
    setRanking: (rank: number) => void;
}

interface ScoreProps {
    fighterRankings: string[]
    show: boolean;
}

interface NextButtonProps {
    onClick: () => void;
    show: boolean;
}

interface NormalRankingsProps {
    show: boolean
    handleNext: () => void;
}

const Randomizer = (props: RandomizerProps) => {
    const [randomFighters, setRandomFighters] = useState<string[]>([]);
    const [fighterPics, setFighterPics] = useState<string[]>([]);
    const [selectedFighter, setSelectedFighter] = useState<string>('');

    const blankPic = 'https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/ComingSoon/comingsoon_headshot_odopod.png?VersionId=6Lx8ImOpYf0wBYQKs_FGYIkuSIfTN0f0\u0026amp;itok=pYDOjN8k'

    const generateRandomFighters = () => {
        const fighters = new Set<string>();

        while (fighters.size < 10) {
            const randomIndex = Math.floor(Math.random() * Object.keys(fighter_ratings).length);
            const fighter = Object.values(fighter_ratings)[randomIndex].Name;
            fighters.add(fighter);
        }

        return Array.from(fighters);
    }

    const handleSelectFighter = (fighter: string) => {
        setSelectedFighter(fighter);
        props.pickFighter(fighter);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.isRunning) {
                setRandomFighters(generateRandomFighters());
            }
        }, 50);

        return () => clearInterval(interval);
    }, [props.isRunning]);

    const { isRunning } = props;
    useEffect(() => {
        if (!isRunning) {
            const picURLs = randomFighters.map(
                fighter => fighter_pics.find(f => f.Name === fighter)?.PicURL || blankPic
            );
            setFighterPics(picURLs);
        }
    }, [isRunning]);

    return (
        <>
        <div 
            className='fighters-head'
            style={{cursor: props.isRunning ? 'pointer' : 'default' }}
            onClick={props.isRunning ? props.handleStop : undefined} 
        >
            <div className='fighters-container'>
                {!props.isRunning && (
                    fighterPics.map((pic: string, index: number) => (
                        <div 
                            className="fighters-card"
                            key={index} 
                            style={{ 
                                border: randomFighters[index] === selectedFighter ? '1.5px solid lightgray' : 'none',
                                backgroundColor: randomFighters[index] === selectedFighter ? 'rgba(33, 150, 243, 0.3)' : 'transparent',
                                opacity: props.fighterRankings.includes(randomFighters[index]) ? 0.3 : 1,
                            }} 
                            onClick={() => handleSelectFighter(randomFighters[index])}
                        >
                            <img 
                                src={pic} alt={randomFighters[index]} 
                                style={{ width: '47%', height: 'auto', margin: '.5em 0 0 0' }} 
                            />
                            <div style={{ fontSize: '0.7em' }}>
                                {randomFighters[index]}
                            </div>
                        </div>
                    ))
                )}
                {props.isRunning && randomFighters.length > 0 && (
                    randomFighters.map((fighter: string) => (
                        <div className="fighter-text">{fighter}</div>
                    ))
                )}
            </div>
            <div className="instruction-text">
                {props.isRunning && (
                    <>
                    Click to stop
                    </>
                )}
                {!props.isRunning && selectedFighter === '' && (
                    <>
                    Select a fighter to rank
                    </>
                )}
            </div>
        </div>
        </>
    );
}

const Rankings = (props: RankingsProps) => {
    useEffect(() => {
    }, [props.fighterRankings]);

    return (
        <>
        {Array.from({ length: 10 }, (_, index) => (
            <div 
                className="ranking-card"
                key={index + 1} 
                onClick={() => {props.setRanking(index + 1);}}
            >
                {index + 1}. 
                {props.fighterRankings[index] !== '' ? (
                    ` ${props.fighterRankings[index]}`
                ) : (
                    <span style={{ color: 'lightgray' }}> Click to rank here</span>
                )}
            </div>
        ))}
        </>
    )
}

const Score = (props: ScoreProps) => {

    const getEloByName = (name: string) => Object.values(fighter_ratings).find(fighter => fighter.Name === name)?.Elo || null;
    
    const calculateScore = () => {
        const { fighterRankings } = props;
        let correctCount = 0;
        let totalComparisons = 0;

        for (let i = 0; i < fighterRankings.length; i++) {
            const currentFighter = fighterRankings[i];
            const currentElo = getEloByName(currentFighter);

            for (let j = i + 1; j < fighterRankings.length; j++) {
                const comparedFighter = fighterRankings[j];
                const comparedElo = getEloByName(comparedFighter);

                if (comparedElo !== null && currentElo !== null) {
                    totalComparisons++;
                    if (currentElo >= comparedElo) {
                        correctCount++;
                    }
                }
            }
        }

        return (correctCount / totalComparisons) * 100;
    }

    const scorePercentage = calculateScore();

    return (
        <>
        {props.show && (
            <div className="score-text">
                Score: {scorePercentage.toFixed(0)}%
            </div>
        )}
        </>
    );
}

const NextButton = (props: NextButtonProps) =>  {
    return (
        <>
        {props.show && (
        <div className="next-button">
            <Button onClick={props.onClick}>
                Next: Blind Rankings
            </Button>
        </div>
        )}
        </>
    )
}

const NormalRankings = (props: NormalRankingsProps) => {
    const [isRunning, setIsRunning] = useState<boolean>(true);
    const [chosenFighter, setChosenFighter] = useState<string>('');
    const [rankings, setRankings] = useState<string[]>(['','','','','','','','','','']);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [showNext, setShowNext] = useState<boolean>(false);

    useEffect(() => {
        if (props.show) {
            window.scrollTo(0, 0);

            setChosenFighter('');
            setRankings(['','','','','','','','','','']);
            setShowScore(false);
            setShowNext(false);
            setIsRunning(true);
        }
    }, [props.show]);

    const handleStop = () => {
        setIsRunning(false);
    }

    const handleChosenFighter = (fighter: string) => {
        setChosenFighter(fighter)
    }

    const handleSetRanking = (rank: number) => {
        if (chosenFighter !=='') {
            const newRankings = [...rankings];
            
            const existingIndex = newRankings.indexOf(chosenFighter);
            if (existingIndex !== -1) {
                newRankings[existingIndex] = '';
            }
            newRankings[rank - 1] = chosenFighter;
    
            setRankings(newRankings);
    
            if (newRankings.every(fighter => fighter !== '')) {
                setChosenFighter('');
                setShowScore(true);
                setShowNext(true);

                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }
    }

    const handleNextScreen = () => {
        props.handleNext();
    }

    return (
        <>
        {props.show && (
        <MantineProvider >
            <div className="normal-rankings-container">
            <Randomizer 
                isRunning={isRunning}
                fighterRankings={rankings}
                pickFighter={handleChosenFighter}
                handleStop={handleStop}
            />
            <Score 
                show={showScore}
                fighterRankings={rankings}
            />
            <NextButton 
                show={showNext}
                onClick={handleNextScreen}
            />
            <Rankings 
                fighterRankings={rankings} 
                setRanking={handleSetRanking}
            />
        </div>
        </MantineProvider>
        )}
        </>
    )
}

export default NormalRankings;
