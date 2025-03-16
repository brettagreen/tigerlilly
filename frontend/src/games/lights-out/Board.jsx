import { useState } from "react";
import Cell from "./Cell";
import "./../css/lightsout_Board.css"

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = .5 }) {
	const [board, setBoard] = useState(createBoard());

	/** create a board nrows high/ncols wide, each cell randomly lit or unlit */
	function createBoard() {
		let initialBoard = [];
		for (let x=0; x < nrows; x++) {
			let subArray = [];
			for (let y=0; y < ncols; y++) {
				subArray.push(Math.random() >= chanceLightStartsOn);
			}
			initialBoard.push(subArray);
		}
		return initialBoard;
	}

	function hasWon() {
		const valArray = [];
		for (let row of board) {
			for (let val of row) {
				valArray.push(val);
			}
		}

    	return !valArray.some(val => val);
    }

	function flipCellsAround(coord) {
		setBoard(() => {
			const boardCopy = [...board];
			const [x, y] = coord.split("-").map(Number);

			const flipCell = (x, y, boardCopy) => {
				if (x >= 0 && x < nrows && y >= 0 && y < ncols) {
					boardCopy[x][y] = !boardCopy[x][y];

					if (x-1 !== -1) {
						boardCopy[x-1][y] = !boardCopy[x-1][y];
					}

					if (x+1 !== nrows) {
						boardCopy[x+1][y] = !boardCopy[x+1][y];
					} 

					if (y-1 !== -1) {
						boardCopy[x][y-1] = !boardCopy[x][y-1];
					}

					if (y+1 !== ncols) {
						boardCopy[x][y+1] = !boardCopy[x][y+1];
					}
				}
			};

			flipCell(x, y, boardCopy);

			return boardCopy;
		});
	}

	function createTable() {
		let tableElements = [];
		for (let x=0; x < nrows; x++) {
			let tdElements = [];
			let coord;
			for (let y=0; y < ncols; y++) {
				coord = [String(x), String(y)].join('-');
				tdElements.push(<Cell key={coord} coord={coord} flipCellsAround={flipCellsAround} isLit={board[x][y]}/>);
			}
			tableElements.push(<tr key={x}>{tdElements}</tr>);
		}
		console.log('tableElements', tableElements);

		return (
			<table>
				<tbody>
					{tableElements}
				</tbody>
			</table>
		)
	}

  	/////////END FUNCTIONS////////////////////

	if (hasWon()) {
		return(
			<>
				<h3>YOU WIN</h3>
			</>
		)
	}

	return(
		<>
			{createTable()}
		</>
	)
}

export default Board;
