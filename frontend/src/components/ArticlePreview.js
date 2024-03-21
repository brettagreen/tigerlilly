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

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from '../api';
import Article from './Article';
import Grid from '@mui/material/Grid';
import { gridTheme } from '../css/styles';
import { ThemeProvider } from '@emotion/react';

/**
 * @component /frontend/src/components/ArticlePreview
 * @requires module:react.useEffect
 * @requires module:react.useState
 * @requires module:react-router-dom.useParams
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/components/Article
 * @requires module:mui/material/Grid
 * @requires module:/frontend/src/css/styles.gridTheme
 * @requires module:emotion/react/ThemeProvider
 * 
 * @description ArticlePreview component. presents all articles matching '#keyword'. uses mui grid for presentation.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - Article objects arranged within MUI Grid.
 *
 */
function ArticlePreview() {

    /**
     * @typedef {Object} keywordParam - key:val object containing any all url passed params
     * @property {string} handle - url passed param
     */
    /**
     * @type {handleParam}
     */
    const { keyword } = useParams();

    /**
     * @typedef {Object} controlArticle - useState hook. array of article objects and assign array of article objects
     * @property {[article]} articles - array of article objects
     * @property {function} setArticles - sets value of the article object array
     */
    /**
     * @type {controlArticle}
     */
    const [articles, setArticles] = useState(null);

    useEffect(() => {
        /**
         * fetch all articles associated with keyword
         * @async
         * @returns {undefined} 
         */
        async function getArticles() {
            const res = await TigerlillyApi.getTaggedArticles(keyword);
            setArticles(res.articles);
        }
        getArticles();
    }, [keyword]);


    return (
        <>
            {articles ?
                <ThemeProvider theme={gridTheme}>
                    <div className="PageHeader">
                        <h3>Articles matching #{keyword}</h3>
                    </div>
                    <Grid id="daGrid" container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>

                        {articles.map((article, idx) => {
                            if ((article.text).split(' ').length >= 50) {
                                article.expand = true;
                            } else {
                                article.expand = false;
                            }
                            return ( 
                                <Grid key={idx} item xs={1} sm={1} md={1}>
                                    <Article passedArticle={article} issueArticle={false} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </ThemeProvider>
            :null}
        </>
    )
}

export default ArticlePreview;