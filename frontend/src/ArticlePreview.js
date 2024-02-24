import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';
import Grid from '@mui/material/Grid';
import Article from './Article';
import { gridTheme } from './css/styles';
import { ThemeProvider } from '@emotion/react';

function ArticlePreview() {
    const { keyword } = useParams();
    const [articles, setArticles] = useState(null);

    useEffect(() => {
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
                    <h2>Articles matching #{keyword}</h2>
                    <Grid container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>

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