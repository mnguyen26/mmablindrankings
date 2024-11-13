import React from 'react';
import './App.css';

import {MantineProvider, Button, Title, Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';

interface InstructionsProps {
    show: boolean;
    play: () => void;
}

interface PlayButtonProps {
    handlePressPlay: () => void;
}

interface AboutProps {
    opened: boolean;
    onClose: () => void;
}

const About = (props: AboutProps) => {
    return (
        <>
        <Modal opened={props.opened} onClose={props.onClose} title="About">
        <p>This game highlights a common challenge: making choices with limited information. In our actual lives we have to do this all the time because we rarely get to see all our options at once; for example, picking a partner or a career path. We usually have to go through each option one at a time without knowing the quality of future choices.
            When making these decisions we try to aim for "local maximums". We have to make decisions and choose among only the options we've encountered so far without any certainty if something better will come later on.
            As difficult as this might seem, people are still able to make good choices even with such constraints. Our minds intuitively estimate risk and we have to subconsciously make decisions like these every day without deliberate thought.
        </p>
        </Modal>
        </>
    )
}

const Instructions = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <p className='paragraph-header'>MMA Ranking Challenge</p>
                <div className="about-button" onClick={open}>About</div>
            </div>
            <div className='paragraph-text'>
                <Title order={3}>How To</Title>
                <p>Screen 1: You'll receive ten random fighters to rank based on their career peaks (not current ability). Click anywhere to stop the randomizer and reveal the ten fighters. Click on a fighter's card to select them and click on a slot to rank them at that position.</p>
                <p>Screen 2: You'll also rank ten fighters but you'll see them one by one, ranking each as they appear. You won't know who's coming next, and you can't adjust previous rankings. Click anywhere to stop the randomizer and reveal the fighter. Click a slot to rank them at that position. Repeat until all ten fighters are ranked.</p>
                <p>After each round your rankings will be scored based on how well they matched the order of "career peaks" measured by fighters' Elo scores . While it might seem harder to rank fighters without knowing who's next, most people's “blind” rankings shouldn't be that much less accurate.</p>
                <About opened={opened} onClose={close} />
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
