import pennyFront from './../imgs/coinflip_pennyFront.jpg';
import pennyBack from './../imgs/coinflip_pennyBack.jpg';
import './../css/coinflip_Coin.css';

const Coin = (props) => {
    let img;
    if (!props.side) {
        img = null;
    } else if (props.side === 'heads') {
        img = <img data-testid="coin" className="coin" src={pennyFront} alt="heads" />;
    } else {
        img = <img data-testid="coin" className="coin" src={pennyBack} alt="tails" />;
    }
    return (
        <div>
            {img}
        </div>
    )
}

export default Coin;