import React, { useEffect, useState } from 'react';

import BlindRankings from './BlindRankings'
import InstructionsScreen from './Instructions';
import NormalRankings from './NormalRankings';

function App() {
    const [showInstructions, setShowInstructions] = useState<boolean>(true);
    const [showRankings, setShowRankings] = useState<boolean>(false);
    const [showBlindRankings, setShowBlindRankings] = useState<boolean>(false);

    const handlePlay = () => {
        setShowInstructions(false);
        setShowRankings(true);
    }

    const handlePlayBlindRankings = () => {
        setShowInstructions(false);
        setShowRankings(false);
        setShowBlindRankings(true);
    }

    return (
        <>
        <InstructionsScreen 
            show={showInstructions}
            play={handlePlay}
        />
        <NormalRankings 
            show={showRankings}
            handleNext={handlePlayBlindRankings}
        />
        <BlindRankings 
            show={showBlindRankings}
        />
        </>
    )
}

export default App;
