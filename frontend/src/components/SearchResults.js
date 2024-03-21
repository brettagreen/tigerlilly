//typedefs
/**
 * @typedef {Object} article - Article object
 * @property {number=} articleId 
 * @property {string} articleTitle
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string=} authorHandle
 * @property {number=} authorId
 * @property {string} text
 * @property {string} issueTitle
 * @property {number=} issueId
 * @property {Date=} pubDate
 *
*/
/**
 * @typedef {Object} search - passed [search] values from App component.
 * @property {string} searchString - raw search string as entered by user
 * @property {[string]} searchArray - phrases, keywords, and hashtags array values from raw searchString (split into logical components)
 * @property {[article]} parsedResults - array of article objects matching search criteria
 */

import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import Grid from '@mui/material/Grid';
import { gridTheme } from '../css/styles';
import Article from './Article';

/**
 * @component /frontend/src/components/SearchResults
 * @requires module:react-router-dom.useNavigate
 * @requires module:emotion/react/ThemeProvider
 * @requires module:mui/material/gridTheme
 * @requires module:/frontend/src/css/styles.gridTheme
 * @requires module:/frontend/src/components/Article
 * 
 * @description SearchResults component. handles Article objects matching search criteria. arranged in mui Grid and passes Article object
 * to Article component for additional handling and markup
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {Object} search - { searchString, searchArray, parsedResults }
 * @returns {JSX.Element} h3 header along with mui Grid arranged articles that match the search criteria. OR h1 message and redirect if
 * it's a bad search
 *
 */
function SearchResults({ search }) {

    /**
     * @type {search}
     */
    const [searchString, searchArray, parsedResults] = search;

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    if (parsedResults.length > 0) {
        return (
            <> 
                <ThemeProvider theme={gridTheme}>
                    <div className="PageHeader">
                        <h3>Articles matching search '{searchString}'</h3>
                    </div>

                    <Grid id="daGrid" container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>

                        {parsedResults.map((article, idx) => {
                            if ((article.text).split(' ').length >= 50) {
                                article.expand = true;
                            } else {
                                article.expand = false;
                            }
                            return ( 
                                <Grid key={idx} item xs={1} sm={1} md={1}>
                                    <Article passedArticle={article} issueArticle={false} searchString={searchString}
                                        searchArray={searchArray}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </ThemeProvider>
            </>
        )
    } else {
        setTimeout(() => {
            history(-1);
        }, 3000);
        
        return(
            <div className="PageHeader">
                <h1>nothing matching {searchString}. Try again!!!</h1>
            </div>
        ) 
    }
}

export default SearchResults;