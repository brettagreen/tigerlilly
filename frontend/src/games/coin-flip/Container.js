import Coin from './Coin';
import { useState } from "react";

const Container = () => {

    const [headsTails, setHeadsTails] = useState(null);
    const [headsCount, setHeadsCount] = useState(0);
    const [tailsCount, setTailsCount] = useState(0);

    function flipCoin() {
        if (Math.random() >= .5) {
            setHeadsTails("heads");
            setHeadsCount(headsCount + 1);
        } else {
            setHeadsTails("tails");
            setTailsCount(tailsCount + 1);
        }
    }

    return (
        <div>
            <h3 className="gameHeader">Who doesn't like flipping coins?</h3>
            <Coin side={headsTails}/>
            <button onClick={flipCoin}>fliiiipppp meeeee</button>
            <h5 data-testid="score">Out of {headsCount + tailsCount} flips, you have {headsCount} heads and {tailsCount} tails</h5>
        </div>
    )
}

export default Container;