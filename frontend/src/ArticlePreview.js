import { useParams } from 'react-router-dom';

function ArticlePreview() {
    const { keyword } = useParams();

    return <h1>BOY HOWDY THIS IS THE ARTICLE PREVIEW PAGE FOR ~*~{keyword}~*~</h1>
}

export default ArticlePreview;