import MadLibs from './games/madlibs/Madlibs';
import LightsOut from './games/lights-out/Board';
import CoinFlip from './games/coin-flip/Container';
import MemeGenerator from './games/meme-generator/MemeGenerator';
import Connect4Game from './games/connect-four/Connect4Game';
import Jeopardy from './games/jeopardy/jeopardy';
import { useEffect } from 'react';
import './games/css/games.css'

function Games() {

    //games page gets a special background. huzzah!
    useEffect(() => {
        const body = document.querySelector('body');

        body.style.removeProperty('background-image');
        body.style.removeProperty('background-repeat');
        body.style.removeProperty('background-color');
        body.style.setProperty('background', 'linear-gradient(45deg, rgba(0, 0, 255, .75), rgba(255, 0, 0, .75))');
        body.style.setProperty('background-attachment', 'fixed');

        return () => {
            body.style.removeProperty('background');
            body.style.removeProperty('background-attachment');
            body.style.setProperty('background-image', 'url(/images/extraextra.png)');
            body.style.setProperty('background-repeat', 'repeat');
            body.style.setProperty('background-color', 'rgba(239, 230, 174, .75)');
        }

    }, []);

    return (
        <div id="gamesContainer">
            <div style={{float:'left'}}>
                <MadLibs />
                <br />
                <hr />
                <LightsOut />
                <br />
                <hr />
                <CoinFlip />
            </div>
            <div style={{float:'left'}}>
                <MemeGenerator />
                <br />
                <hr />
                <Connect4Game />
            </div>
            <div style={{clear:'left', marginTop: '5em'}}>
                <Jeopardy />
            </div>
        </div>
    )
}

export default Games;