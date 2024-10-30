import React, { useEffect, useState } from 'react';

import BlindRankings from './BlindRankings'
import InstructionsScreen from './Instructions';

function App() {
    const [showInstructions, setShowInstructions] = useState<boolean>(true);
    const [showBlindRankings, setShowBlindRankings] = useState<boolean>(false);

    const handlePlay = () => {
        setShowInstructions(false);
        setShowBlindRankings(true);
    }

    return (
        <>
        <InstructionsScreen 
            show={showInstructions}
            play={handlePlay}
        />
        <BlindRankings show={showBlindRankings}/>
        </>
    )
}

export default App;
