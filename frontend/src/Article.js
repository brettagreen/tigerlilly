import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';

function Article({title, authorFirst, authorLast, text}) {

    const [article, setArticle] = useState(title ? {title, authorFirst, authorLast, text} : null);
    //const [comments, setComments] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchArticle() {
            setArticle(await TigerlillyApi.getArticle(id));
            //setComments(await TigerlillyApi.getComments(id));
        }
        if (id) {
            fetchArticle();
        }
    }, [id]);

    return (
        <div>
            <h2>{article.title}</h2>
            <h4>by {article.authorFirst + ' ' + article.authorLast}</h4>
            <p>{article.text}</p>
        </div>
    )
}

export default Article;