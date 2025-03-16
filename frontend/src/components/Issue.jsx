//typedefs
/**
 * @typedef {Object} issue - returned Issue object 
 * @property {number=} issueId
 * @property {string} issueTitle
 * @property {Date} pubDate
 * @property {number=} volume
 * @property {number=} issue
 * @property {number=} articleId
 * @property {string=} articleTitle
 * @property {string=} text
 * @property {string=} authorFirst
 * @property {string=} authorLast
 * @property {string=} authorHandle 
 *
*/

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Article from './Article';
import TigerlillyApi from '../api';
import { gridTheme } from '../css/styles';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@emotion/react';
import '../css/issue.css';
import romans from 'romans';

/**
 * @component /frontend/src/components/Issue
 * @requires module:react.useEffect
 * @requires module:react.useState
 * @requires module:react-router-dom.useParams
 * @requires module:/frontend/src/components/Article
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/css/styles.gridTheme
 * @requires module:mui/material/Grid
 * @requires module:emotion/react/ThemeProvider
 * @requires module:romans
 * 
 * @description Issue component. presents all articles matching matching Issue id specification OR
 * (by default) all articles associated with the most recently published Issue. Displays articles within mui GRID.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - Site masthead image, and Article objects arraged within an mui GRID
 *
 */
function Issue() {

    /**
     * @typedef {Object} controlIssue - useState hook. issue object is a cobo of Issue info AND Article info. one object is put to the array
     * for each instance of an article affiliated with an issue.
     * @property {[issue]} issue - array of issue/article information
     * @property {function} setIssue - set issue value
     */
    /**
     * @type {controlIssue}
     */
    const [issue, setIssue] = useState(null);

    /**
     * @typedef {Object} controlParam - key:val object containing any all url passed params. url passed param of id of Issue to be retrieved.
     * @property {number} id - url passed param of id of Issue to be retrieved
     */
    /**
     * @type {controlParam}
     */
    const { id } = useParams();

    /**
     * width of user's viewport.
     * basically being used to help calculate inline @media/ query so as to 
     * appropriately render borders for Issue Articles
     * 
     *@type {number}
     */
    const VIEW_WIDTH = document.documentElement.clientWidth;

    useEffect(() => {
        /**
         * fetch issue by issue id or by most recently published issue
         * @async
         * @returns {undefined}
         */
        async function fetchIssue() {
            let resp;
            if (id) {
                resp = await TigerlillyApi.getIssue(id);
            } else {
                resp = await TigerlillyApi.getCurrentIssue();
            }
            setIssue(resp.issues);
        }
		fetchIssue();
    }, [id]);

    /**
     * each issue will organize articles in a number of columns. smaller viewport width means fewer columsn, larger means more...
     * thus, given x number of colums and idx value, each article will be assigned one or more css border classes.
     * @param {number} idx 
     * @returns {string} css class(es) @example returns 'noBorders' OR 'sideBorders bottomBorder', etc.
     */
    function gridItemClass(idx) {
        let columns;

        if (VIEW_WIDTH > 900) {
            columns = 4;
            if (idx % columns === 0 || idx % columns === 3) {
                if (issue.length - idx <= 4) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            } else {
                if (issue.length - idx <= 4) {
                    return 'sideBorders'
                } else {
                    return 'sideBorders bottomBorder';
                }
            }
        } else if (VIEW_WIDTH > 600) {
            columns = 3;
            if (idx % columns === 0 || idx % columns === 2) {
                if (issue.length - idx <= 3) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            } else {
                if (issue.length - idx <= 3) {
                    return 'sideBorders'
                } else {
                    return 'sideBorders bottomBorder';
                }
            }
        } else {
            columns = 2;
            if (idx % columns === 0) {
                if (issue.length - idx <= 2) {
                    return 'rightBorder'
                } else {
                    return 'rightBorder bottomBorder';
                }
            } else {
                if (issue.length - idx <= 2) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            }
        }
    }

    /**
     * map Issue articles into grid
     * @returns {'@mui/material/Grid'}
     */
    function createGrid() {
        return(<>
            {/* <span id="borderTopLeft" className="gridFrame">&#111;</span>
            <span id="borderTopRight" className="gridFrame">&#111;</span> */}
            <Grid id="daGrid" container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>
                {issue.map((article, idx) => {
                    return( 
                        <Grid className={gridItemClass(idx)} key={idx} item xs={1} sm={1} md={1}>
                            <Article passedArticle={article} issueArticle={true}/>
                        </Grid>
                    )
                })}
            </Grid>
            {/* <span id="borderBottomLeft" className="gridFrame">&#111;</span>
            <span id="borderBottomRight" className="gridFrame">&#111;</span> */}
        </>)
    }
    
    if (issue) {
        return (
            <>
                <ThemeProvider theme={gridTheme}>
                    <header>
                        <img id="masthead" src="/images/masthead.jpg" alt="masthead"/>
                    </header>
                    <h1 id="issueTitle" style={{display: 'block'}}>
                        <span style={{float: 'left', marginLeft: '0.5em'}}>{issue[0].issueTitle}</span>
                        <span style={{float: 'right', marginRight: '0.5em', marginTop: '1em', fontSize: 'x-large'}}>
                            {"Volume "+romans.romanize(issue[0].volume)}{" Issue "+romans.romanize(issue[0].issue)}
                        </span>
                    </h1>
                    <div style={{display: 'block'}}>
                        {createGrid()}
                    </div>
                </ThemeProvider>
            </>
        );
    }

}

export default Issue;