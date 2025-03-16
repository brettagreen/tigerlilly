import "./../css/lightsout_Cell.css";

/** A single cell on the board.
 *
 * This has no state --- just two props:
 *
 * - flipCellsAround: a function rec'd from the board which flips this
 *      cell and the cells around of it
 *
 * - isLit: boolean, is this cell lit?
 *
 * This handles clicks --- by calling flipCellsAround
 *
 **/

function Cell({ coord, flipCellsAround, isLit }) {
    const classes = `Cell ${isLit ? "Cell-lit" : ""}`;
    return <td data-testid="cell-element" className={classes} onClick={() => flipCellsAround(coord)} />;
}

export default Cell;
