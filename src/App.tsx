import React, { useEffect, useState } from 'react';

import {MantineProvider, Button} from '@mantine/core';

import fighter_pics from './JSON/fighter_pics.json';
import fighter_ratings from './JSON/fighter_peak_elo_records.json';

interface RandomizerProps {
    isRunning: boolean;
    pickFighter: (fighter: string) => void;
}

interface RankingsProps {
    fighterRankings: string[];
    setRanking: (rank: number) => void;
}

const FighterPics = () => {
    const blankPic = 'https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/ComingSoon/comingsoon_headshot_odopod.png?VersionId=6Lx8ImOpYf0wBYQKs_FGYIkuSIfTN0f0\u0026amp;itok=pYDOjN8k'
    return (
        <div>
            {Object.values(fighter_ratings).map(fighter => {
                const picURL = fighter_pics.find(f => f.Name === fighter.Name)?.PicURL;
                return (
                    <>
                    <img key={fighter.Name} src={picURL ? picURL : blankPic} />
                    {fighter.Name}
                    </>
                );
            })}
        </div>
    );
}

const Randomizer = (props: RandomizerProps) => {
    const [randomFighter, setRandomFighter] = useState('');
    const [fighterPic, setFighterPic] = useState('');

    const blankPic = 'https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/ComingSoon/comingsoon_headshot_odopod.png?VersionId=6Lx8ImOpYf0wBYQKs_FGYIkuSIfTN0f0\u0026amp;itok=pYDOjN8k'

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.isRunning) {
                const randomIndex = Math.floor(Math.random() * Object.keys(fighter_ratings).length);
                const fighter = Object.values(fighter_ratings)[randomIndex].Name;
                setRandomFighter(fighter);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [props.isRunning]);

    useEffect(() => {
        if (!props.isRunning && randomFighter) {
            props.pickFighter(randomFighter);

            const picURL = fighter_pics.find(f => f.Name === randomFighter)?.PicURL;
            setFighterPic(picURL ? picURL : blankPic);
        }
    }, [props.isRunning])

    return (
        <>
        {!props.isRunning && fighterPic && (
            <div>
            <img src={fighterPic} alt={randomFighter} />
            Select a rank for {randomFighter}
            </div>
        )}
        {props.isRunning && randomFighter && (
            <div>{randomFighter}</div>
        )}
        </>
    );
}

const Rankings = (props: RankingsProps) => {
    useEffect(() => {
    }, [props.fighterRankings]);

    return (
        <>
        {Array.from({ length: 10 }, (_, index) => (
            <div key={index + 1}>
                {index + 1}. {props.fighterRankings[index] != '' ? props.fighterRankings[index] : (
                    <Button onClick={() => props.setRanking(index + 1)}>Select</Button>
                )}
            </div>
        ))}
        </>
    )
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
        setIsRunning(true);
    }

    return (
        <>
        <Randomizer isRunning={isRunning} pickFighter={handleChosenFighter}/>
        {isRunning && (
        <Button onClick={handleStop}>Pick a Fighter</Button>
        )}
        <Rankings fighterRankings={rankings} setRanking={handleSetRanking}/>
        </>
    )
}

function App() {
    return (
        <>
        <MantineProvider >
            <div style={{ margin: '2em', padding: '1em' }}>
                <FighterPicker />
            </div>
        </MantineProvider>
        </>
    )
}

export default App;
