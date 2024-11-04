import React, { useEffect, useState } from 'react';

// import {MantineProvider} from '@mantine/core';

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

interface BlindRankingsProps {
    show: boolean
}

const Randomizer = (props: RandomizerProps) => {
    const [randomFighter, setRandomFighter] = useState('');
    const [fighterPic, setFighterPic] = useState('');

    const blankPic = 'https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/ComingSoon/comingsoon_headshot_odopod.png?VersionId=6Lx8ImOpYf0wBYQKs_FGYIkuSIfTN0f0\u0026amp;itok=pYDOjN8k'

    const generateRandomFighter = ():string => {
        const randomIndex = Math.floor(Math.random() * Object.keys(fighter_ratings).length);
        const fighter = Object.values(fighter_ratings)[randomIndex].Name;

        return fighter;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.isRunning) {
                setRandomFighter(generateRandomFighter());
            }
        }, 50);

        return () => clearInterval(interval);
    }, [props.isRunning]);

    const {isRunning, pickFighter} = props;
    useEffect(() => {
        if (!isRunning && randomFighter) {
            setRandomFighter(randomFighter);
            pickFighter(randomFighter);

            const picURL = fighter_pics.find(f => f.Name === randomFighter)?.PicURL;
            setFighterPic(picURL ? picURL : blankPic);
        }
    }, [isRunning])

    return (
        <>
        <div onClick={props.isRunning ? props.handleStop : undefined} style={{ cursor: props.isRunning ? 'pointer' : 'default' }}>
            <div className="fighter-card">
                {!props.isRunning && fighterPic && (
                    <img src={fighterPic} className="fighter-img" alt={randomFighter} />
                )}
            </div>
            <div className="instruction-text">
                {!props.isRunning && randomFighter && (
                    <div>Select a rank for {randomFighter}</div>
                )}
                {props.isRunning && randomFighter && (
                    <div>{randomFighter}</div>
                )}
            </div>
            <div className="instruction-text">
                {props.isRunning && (
                    <>
                    Click to stop
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
                style={{ cursor: props.fighterRankings[index] !== '' ? 'not-allowed' : 'pointer' }}
                key={index + 1} 
                onClick={() => {
                    if (props.fighterRankings[index] !== '') return;
                    props.setRanking(index + 1);
                }}
            >
                {index + 1}.
                {props.fighterRankings[index] === '' && (
                    <span style={{ color: 'lightgray' }}> Click to rank here</span>
                )}
                {props.fighterRankings[index] !== '' && (
                    ` ${props.fighterRankings[index]}`
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
        const newRankings = [...rankings];
        newRankings[rank - 1] = chosenFighter;
        setRankings(newRankings);
        setChosenFighter('');

        if (newRankings.every(fighter => fighter !== '')) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
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

const BlindRankings = (props: BlindRankingsProps) => {

    useEffect(() => {
        if (props.show) {
            window.scrollTo(0, 0);
        }
    }, [props.show]);

    return (
        <>
        {props.show && (
            <div style={{ margin: '2em', padding: '1em' }}>
                <FighterPicker />
            </div>
        )}
        </>
    )
}

export default BlindRankings;
