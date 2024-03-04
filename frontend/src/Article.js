import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '@mui/material';
import TigerlillyApi from './api';
import { linkTheme } from './css/styles';
import { ThemeProvider } from '@emotion/react';
import './css/article.css';

function Article({ passedArticle, issueArticle, searchArray=null }) {
    const [article, setArticle] = useState(null);
    const [keywords, setKeywords] = useState(null);
    const [hidden, setHidden] = useState(true);
    const { id } = useParams();
    const articleRef = useRef();
    const keywordsRef = useRef();

    function formatArticleText() {
        if (article.expand) {
            if (hidden) {
                const fiftiethWord = article.text.split(' ')[50];
                const substr = article.text.substring(0, article.text.indexOf(` ${fiftiethWord} `));
                return(
                    <p>
                        <span>{substr}...</span>
                        <button type="button" onClick={() => setHidden(!hidden)}>read more</button>
                    </p>
                )
            } else {
                return <p>{article.text}</p>
            }

        } else {
            if (issueArticle) {
                return <p className="articleText">{article.text}</p>
            } else {
                return <p>{article.text}</p>
            }
        }
    }

    useEffect(() => {
        async function setUp() {

            if (passedArticle) {
                console.log('passedArticle.articleId', passedArticle.articleId);
                const resp = await TigerlillyApi.getArticleKeywords(passedArticle.articleId);
                console.log('api keywords', resp.keywords);
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

        function markupArticle() {
            const filterKeywords = searchArray.filter((val) => {
                return !val.startsWith('*');
            });            

            for (let kwd of filterKeywords) {
                if (kwd.startsWith("'") || kwd.startsWith('"')) {
                    kwd = kwd.substring(1, kwd.length-1);
                }
                console.log('kwd', kwd);
                const element = articleRef.current;
                console.log('article/element', element);
                console.log('innerHTML before', element.innerHTML);
                element.innerHTML = element.innerHTML.replaceAll(kwd, `<mark>${kwd}</mark>`);
                console.log('innerHTML after', element.innerHTML);
            }
        }

        function markupKeywords() {
            const filterKeywords = searchArray.filter((val) => {
                return val.startsWith('*');
            });

            for (let kwd of filterKeywords) {
                kwd = kwd.substring(1,kwd.length);
                console.log('kwd', kwd);
                const element = keywordsRef.current;
                console.log('article/element', element);
                console.log('innerHTML before', element.innerHTML);
                element.innerHTML = element.innerHTML.replaceAll(kwd, `<mark>${kwd}</mark>`);
                console.log('innerHTML after', element.innerHTML);
            }
        }

        if (article && searchArray) {
            console.log('searchArray',searchArray)
            markupArticle();
        }
        if (keywords && searchArray) {
            console.log('searchArray',searchArray)
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