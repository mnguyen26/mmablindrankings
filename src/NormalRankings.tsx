import React, { useEffect, useState } from 'react';

import {MantineProvider} from '@mantine/core';

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
}

interface NormalRankingsProps {
    show: boolean
}

const Randomizer = (props: RandomizerProps) => {
    const [randomFighters, setRandomFighters] = useState<string[]>([]);
    const [fighterPics, setFighterPics] = useState<string[]>([]);
    const [selectedFighter, setSelectedFighter] = useState<string>('');

    const blankPic = 'https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/ComingSoon/comingsoon_headshot_odopod.png?VersionId=6Lx8ImOpYf0wBYQKs_FGYIkuSIfTN0f0\u0026amp;itok=pYDOjN8k'

    const generateRandomFighters = (): string[] => {
        const fighters = [];
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * Object.keys(fighter_ratings).length);
            const fighter = Object.values(fighter_ratings)[randomIndex].Name;
            fighters.push(fighter);
        }
        return fighters;
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

    useEffect(() => {
        if (!props.isRunning) {
            const picURLs: string[] = [];
            randomFighters.forEach(fighter => {
                const picURL = fighter_pics.find(f => f.Name == fighter)?.PicURL || blankPic;
                picURLs.push(picURL);
            })
            setFighterPics(picURLs);
        }
    }, [props.isRunning]);

    return (
        <>
        <div onClick={props.isRunning ? props.handleStop : undefined} style={{margin: '0 1em 0 1em', cursor: props.isRunning ? 'pointer' : 'default' }}>
            <div style={{ width: '20em', height: '30em', overflow: 'hidden', margin: '1em 1em', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.1em' }}>
                {!props.isRunning && (
                    fighterPics.map((pic: string, index: number) => (
                        <div 
                            key={index} 
                            style={{ 
                                margin: '0 0 0 .2em',
                                textAlign: 'center',
                                borderRadius: '10px',
                                border: randomFighters[index] === selectedFighter ? '1.5px solid lightgray' : 'none',
                                backgroundColor: randomFighters[index] === selectedFighter ? 'rgba(33, 150, 243, 0.3)' : 'transparent',
                                opacity: props.fighterRankings.includes(randomFighters[index]) ? 0.3 : 1,
                                boxShadow: '-2px 3px 4px 0px rgba(0, 0, 0, 0.1)'
                            }} 
                            onClick={() => handleSelectFighter(randomFighters[index])}
                        >
                            <img 
                                src={pic} alt={randomFighters[index]} 
                                style={{ width: '53%', height: 'auto', margin: '.5em 0 0 0' }} 
                            />
                            <div style={{ fontSize: '0.7em' }}>
                                {randomFighters[index]}
                            </div>
                        </div>
                    ))
                )}
                {props.isRunning && randomFighters.length > 0 && (
                    randomFighters.map((fighter: string) => (
                        <div style={{ fontSize: '0.7em', textAlign: 'center' }}>{fighter}</div>
                    ))
                )}
            </div>
            <div style={{ textAlign: 'center', margin: '1em', width: '20em', height: '2em' }}>
                {props.isRunning && (
                    <>
                    Click to stop
                    </>
                )}
                {!props.isRunning && selectedFighter == '' && (
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
                style={{ cursor: 'pointer', width: '20em', padding: '20px', border: '1px solid black' }}
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
            {props.fighterRankings.every(fighter => fighter !== '') && (
                <div>Score: {scorePercentage.toFixed(2)}%</div>
            )}
        </>
    );
}

const FighterPicker = () => {
    const [isRunning, setIsRunning] = useState<boolean>(true);
    const [chosenFighter, setChosenFighter] = useState<string>('');
    const [rankings, setRankings] = useState<string[]>(['','','','','','','','','','']);

    const handleStop = () => {
        setIsRunning(false);
    }

    const handleChosenFighter = (fighter: string) => {
        setChosenFighter(fighter)
    }

    const handleSetRanking = (rank: number) => {
        if (chosenFighter !='') {
            const newRankings = [...rankings];
            
            const existingIndex = newRankings.indexOf(chosenFighter);
            if (existingIndex !== -1) {
                newRankings[existingIndex] = '';
            }
            newRankings[rank - 1] = chosenFighter;
    
            setRankings(newRankings);
    
            if (newRankings.every(fighter => fighter !== '')) {
                setChosenFighter('');
            }
        }
    }

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Randomizer 
                isRunning={isRunning}
                fighterRankings={rankings}
                pickFighter={handleChosenFighter}
                handleStop={handleStop}
            />
            <Score fighterRankings={rankings}/>
            <Rankings 
                fighterRankings={rankings} 
                setRanking={handleSetRanking}
            />
        </div>
        </>
    )
}

const NormalRankings = (props: NormalRankingsProps) => {

    useEffect(() => {
        if (props.show) {
            window.scrollTo(0, 0);
        }
    }, [props.show]);

    return (
        <>
        {props.show && (
        <MantineProvider >
            <div style={{ margin: '1em' }}>
                <FighterPicker />
            </div>
        </MantineProvider>
        )}
        </>
    )
}

export default NormalRankings;
