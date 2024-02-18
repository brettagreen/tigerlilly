import { Game, ComputerPlayer, Player } from './connect4';
import './../css/connect4.css';

function Connect4Game() {

    function startGame(e) {
        e.preventDefault();

        const inputs = document.querySelectorAll('#colorForm input');
        const playerArray = [];
        inputs.forEach(val => {
            playerArray.push(new Player(val.value));
        });
        if (playerArray.length === 1) {
            playerArray.push(new ComputerPlayer());
        }
        new Game(6, 7, playerArray);  
    }

    function handlePlayers() {
        const numPlayers = document.querySelector('#numPlayers');
        const colorInputs = document.querySelector('#colorForm');
        const startButton = document.querySelector('#connect4start');
        const parent = startButton.parentElement;
        const inputs = document.querySelectorAll('.colorbox');
        const spans = document.querySelectorAll('.colorbox-text');
    
        let currInputs = inputs.length;
    
        if (currInputs > numPlayers.value) {
            for (let x = currInputs - 1; x > numPlayers.value - 1; x--) {
                inputs[x].remove();
                spans[x].remove();
            }
    
        } else if (currInputs < numPlayers.value || currInputs === numPlayers.value) {
            for (let x = currInputs; x < numPlayers.value; x++) {
                const input = document.createElement('input');
                const span = document.createElement('span');
                span.classList.add('colorbox-text');
                span.innerText = `Player${x + 1}:`
                input.setAttribute('type', 'color');
                input.setAttribute('id', `player${x + 1}`);
                input.classList.add('colorbox');
                parent.insertBefore(span, startButton);
                parent.insertBefore(input, startButton);
            }
        }
    
        colorInputs.style.visibility = 'visible'
    }

    return(
        <>
            <h3>Connect 4</h3>
            <div id="connect4game">
                <table id="connect4board">
                </table>
            </div>
            <section>
                <form id="playersForm" onChange={handlePlayers}>
                    <label>
                        How many players?
                    </label>
                    <select id="numPlayers">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </form>
                <form id="colorForm">
                    <label id="connect4label">
                        Pick player colors:
                    </label>
                    <button id="connect4start" onClick={startGame}>start a new game</button>
                </form>
            </section>
        </>
    )
}

export default Connect4Game