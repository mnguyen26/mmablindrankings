import React from 'react';
import './App.css';

import {MantineProvider, Button} from '@mantine/core';

interface InstructionsProps {
    show: boolean;
    play: () => void;
}

interface PlayButtonProps {
    handlePressPlay: () => void;
}

const Instructions = () => {
    return (
        <div>
            <p className='paragraph-header'>Welcome to the MMA Ranking Challenge!</p>
            <div className='paragraph-text'>
                <p>In this app, we'll explore decision-making with limited information.</p>
                <p>Screen 1: You'll receive ten random fighters to rank in order from 1 to 10 based on their career peaks (not current ability).</p>
                <p>Screen 2: Here you'll see fighters one by one, ranking each as they appear. You won't know who's coming next, and you can't adjust previous rankings.</p>
                <p>Afterward, the accuracy of your rankings from both rounds will be scored based on calculated rankings using fighters' career-high Elo ratings. While it might seem harder to rank fighters without knowing who's next, most people's “blind” rankings shouldn't be that much less accurate.</p>
                <p>This game highlights a common challenge: making choices with limited information. In our actual lives we have to do this all the time because we rarely get to see all our options at once; for example, picking a partner or a career path. We usually have to go through each option one at a time without knowing the quality of future choices.
                    When making these decisions we try to aim for "local maximums". We have to make decisions and choose among only the options we've encountered so far without any certainty if something better will come later on.
                    As difficult as this might seem, people are often able to make good choices even with such constraints. Our minds intuitively estimate risk and we have to subconsciously make decisions like these every day without deliberate thought.
                </p>
            </div>
        </div>
    )
}

const PlayButton = (props: PlayButtonProps) => {
    return (
        <Button onClick={props.handlePressPlay}>
            Play
        </Button>
    )
}

const InstructionsScreen = (props: InstructionsProps) => {
    return (
        <>
        <MantineProvider>
        {props.show && (
            <div style={{margin: '3em'}}>
                <Instructions/ >
                <PlayButton handlePressPlay={props.play} />
            </div>
        )}  
        </MantineProvider>
        </>
    )
}

export default InstructionsScreen;
