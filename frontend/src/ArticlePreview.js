import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';
import Grid from '@mui/material/Grid';
import Article from './Article';

function ArticlePreview() {
    const { keyword } = useParams();
    const [articles, setArticles] = useState(null);

    useEffect(() => {
        async function getArticles() {
            setArticles(await TigerlillyApi.getTaggedArticles(keyword)['articles']);
        }
        getArticles();
    }, [keyword]);


    return (
        <>
        {articles ?
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {articles.map((article, idx) => {
                    return( 
                        <Grid key={idx} item xs={1} sm={2} md={3}>
                            <Article passedArticle={article}/>
                        </Grid>
                    )
                })}
            </Grid>
        :null}
        </>

    )
}

export default ArticlePreview;