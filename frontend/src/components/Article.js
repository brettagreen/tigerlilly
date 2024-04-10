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
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { Link } from '@mui/material';
import TigerlillyApi from '../api';
import { linkTheme } from '../css/styles';
import '../css/article.css'

/**
 * @component /frontend/src/components/Article
 * @requires module:react.useEffect
 * @requires module:react.useState
 * @requires module:react.useRef
 * @requires module:react-router-dom.useParams
 * @requires module:emotion/react/ThemeProvider
 * @requires module:mui/material/Link
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/css/styles.linkTheme
 * 
 * @description Article component. presents typical article info reglardless. if article is being generated as result of a keyword or 
 * hashtag search, then article keyword/hashtag matches will be highlighted. Also, articles tied to Issue presentation will be formatted
 * differently than articles that aren't. Last, article can also be requested vi url params eg. /article/:id. 
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {article=} passedArticle - Article object that is passed to Component as a prop
 * @param {boolean=false} issueArticle - true if this is an article that belongs to an Issue component
 * @param {[article]=null} searchArray - array of article(s) that matched search criteria as initiated in the NavigationBar component
 * @returns {JSX.Element} - contains article and related keywords
 *
 */
function Article({ passedArticle, issueArticle, searchArray=null }) {

    /**
     * @typedef {Object} controlArticle - useState hook. related to article in question
     * @property {article} article - the article object
     * @property {function} setArticle - sets value of the article object
     */
    /**
     * @type {controlArticle}
     */
    const [article, setArticle] = useState(null);

     /**
     * @typedef {Object} controlKeywords - useState hook. related to keywords that are associated with the article object
     * @property {[string]} keywords - keywords associated with the article
     * @property {function} setKeywords - sets value of the keywords object
     */
    /**
     * @type {controlKeywords}
     */
    const [keywords, setKeywords] = useState(null);

    /**
     * @typedef {Object} controlHidden - useState hook. toggles whether 'read more' button is hidden. doesn't pertain to all articles.
     * @property {boolean} hidden - is the button hidden?
     * @property {function} setHidden - toggles whether the button is hidden or not
     */
    /**
     * @type {controlHidden}
     */
    const [hidden, setHidden] = useState(true);

    /**
     * @typedef {Object} controlParam - key:val object containing any all url passed params. url passed param of id of article to be shown
     * @property {number} id - url passed param of id of article to be shown
     */
    /**
     * @type {controlParam}
     */
    const { id } = useParams();

    /**
     * the useRef is a hook "that lets you reference a value that’s not needed for rendering"
     * @see https://react.dev/reference/react/useRef
     * used to help with article markup w/r/t articles that are being requested because of a search
     * @type {Object}
     */
    const articleRef = useRef();

    /**
     * the useRef is a hook "that lets you reference a value that’s not needed for rendering"
     * @see https://react.dev/reference/react/useRef
     * used to help with keywords markup w/r/t articles that are being requested because of a search
     * @type {Object}
     */
    const keywordsRef = useRef();

    /**
     * displays article differently based on 1) whether the text of the article is longer than 50 words
     * 2) whether the article is part of an Issue or not
     * @returns {JSX.Element} <p /> containing article text
     */
    function formatArticleText() {
        if (article.expand) {
            if (hidden) {
                const fiftiethWord = article.text.split(' ')[50];
                const substr = article.text.substring(0, article.text.indexOf(` ${fiftiethWord} `));
                return(
                    <p data-testid="preExpansion">
                        <span>{substr}...</span>
                        <button type="button" onClick={() => setHidden(!hidden)}>read more</button>
                    </p>
                )
            } else {
                return <p data-testid="postExpansion">{article.text}</p>
            }

        } else {
            if (issueArticle) {
                return <p className="articleText">{article.text}</p>
            } else {
                return <p data-testid="testArticle">{article.text}</p>
            }
        }
    }

    useEffect(() => {
        /**
         * gathers associated article keywords for article.
         * if article has been requested vi url/params, then article object is first accessed
         * before gathering its associated keywords
         * @async
         * @returns {undefined}
         */
        async function setUp() {

            if (passedArticle) {
                const resp = await TigerlillyApi.getArticleKeywords(passedArticle.articleId);
                setKeywords(resp.keywords);
                setArticle(passedArticle);
            } else {
                let res = await TigerlillyApi.getArticle(id);
                setArticle(res.articles);
                const resp = await TigerlillyApi.getArticleKeywords(id);
                setKeywords(resp.keywords);
            }
        }

        setUp();

    }, [passedArticle, id]);

    useEffect(() => {

        /**
         * <mark> article words and/or phrases that match those in article keyword/phrase search value
         * @returns {undefined}
         */
        function markupArticle() {
            const filterKeywords = searchArray.filter((val) => {
                return !val.startsWith('*');
            });            

            for (let kwd of filterKeywords) {
                if (kwd.startsWith("'") || kwd.startsWith('"')) {
                    kwd = kwd.substring(1, kwd.length-1);
                }
                const element = articleRef.current;
                element.innerHTML = element.innerHTML.replaceAll(kwd, `<mark>${kwd}</mark>`);
            }
        }

        /**
         * <mark> article hashtags that match those in article hashtag search value
         * @returns {undefined}
         */
        function markupKeywords() {
            const filterKeywords = searchArray.filter((val) => {
                return val.startsWith('*');
            });

            for (let kwd of filterKeywords) {
                kwd = kwd.substring(1,kwd.length);
                const element = keywordsRef.current;
                element.innerHTML = element.innerHTML.replaceAll(kwd, `<mark>${kwd}</mark>`);
            }
        }

        if (article && searchArray) {
            markupArticle();
        }
        if (keywords && searchArray) {
            markupKeywords();
        }
        
    }, [article, searchArray, keywords])

    return (
        <>
            <ThemeProvider theme={linkTheme}>
                {article ?
                    <article>
                        <div ref={articleRef}>
                            <h2 className="articleTitle">{article.articleTitle}</h2>
                            {!article.authorHandle ? 
                                <h4 style={{color: 'rgba(0, 0, 0, 0.87)'}}>by anonymous</h4>
                            :
                                <h4 style={{color: 'rgba(0, 0, 0, 0.87)'}}>by {<Link underline='none' href={`/author/${article.authorHandle}`}>
                                    {article.authorFirst + ' ' + article.authorLast}</Link>}
                                </h4>
                            }
                            {formatArticleText()}
                        </div>
                    </article>
                :null
                }
                <br />
                {keywords ?
                    <div ref={keywordsRef}>
                        {keywords.map((keyword, idx) => {
                            keyword = keyword.keyword;
                                return (
                                    <Link key={-idx -1} sx={{display: "inline-block", fontSize: "x-small"}} 
                                            href={`/articleKeywords/${keyword}`} underline="hover">
                                        #{keyword}&nbsp;
                                    </Link>
                                )                                   
                            })
                        }
                    </div>
                :null
                }
            </ThemeProvider>
        </>
    )
}

export default Article;