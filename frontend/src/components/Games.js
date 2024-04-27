import { useEffect } from 'react';
import MadLibs from '../games/madlibs/Madlibs';
import LightsOut from '../games/lights-out/Board';
import CoinFlip from '../games/coin-flip/Container';
import MemeGenerator from '../games/meme-generator/MemeGenerator';
import Connect4Game from '../games/connect-four/Connect4Game';
import Jeopardy from '../games/jeopardy/jeopardy';
import '../games/css/games.css'

/**
 * @component /frontend/src/components/Games
 * @requires module:react.useEffect
 * @requires module:/frontend/src/games/madlibs/Madlibs
 * @requires module:/frontend/src/games/lights-out/Board
 * @requires module:/frontend/src/games/coin-flip/Container
 * @requires module:/frontend/src/games/meme-generator/MemeGenerator
 * @requires module:/frontend/src/games/connect-four/Connect4Game
 * @requires module:/frontend/src/games/jeopardy/jeopardy
 * 
 * @description Games component. Extensible by design. Right now this page features games written while enrolled at Springboard. More to come!
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - Various html games loosely structured on the page. looks messy and chaotic and is meant to.
 *
 */
function Games() {

    /**
     * games page gets a special background. huzzah! on page exit, return to default site background
    */
    useEffect(() => {
	document.getElementById("footer").remove();
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

    /**
     * this isn't meant to look 'pretty'. well, maybe...'pretty' awful? ;)
     * the games page is meant to capture the worldview on a four year old playing with their toys
     * lots of fun, colorful, and just a little messy!
     */
    return (
        <div id="gamesContainer" style={{marginTop:'10vh'}}>
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
            <div style={{clear:'left', float:'right', marginTop: '1em'}}>
                <Jeopardy />
            </div>
        </div>
    )
}

export default Games;
