import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserContext from './userContext';
import TigerlillyApi from './api';

function Article({ passedArticle }) {

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState(null);
    const [keywords, setKeywords] = useState(null)
    const user = useContext(UserContext).user;

    const [commentForm, setCommentForm] = useState({userId: user ? user.id : 0, text: '', articleId: passedArticle.articleId});
    //const { id } = useParams();
    const showCommentBox = useRef();


    async function handleCommentSubmission(event) {
        event.preventDefault();
        showCommentBox.current.hidden = true;
        console.log('user', user);
        console.log('commentForm', commentForm);
        const resp = await TigerlillyApi.commit('comments', commentForm, 'post');
        setComments([...comments].unshift(resp['comments']));
        setCommentForm({...commentForm, 'text': ''});
    }

    function handleChange(event) {
        if (!isNaN(event.target.value) && event.target.value !== '') {
            setCommentForm({...commentForm, [event.target.name]: Number(event.target.value)});
        } else {
            setCommentForm({...commentForm, [event.target.name]: event.target.value});
        }
    }

    async function fetchComments(id) {
        console.log('getting to fetchComments()')
        const resp = await TigerlillyApi.getComments(id, 'articles');

        setComments(resp['comments']);
    }

    async function fetchKeywords(id) {
        console.log('getting to fetchKeywords()');
        const resp = await TigerlillyApi.getArticleKeywords(id);

        setKeywords(resp['keywords']);
    }

    useEffect(() => {
        async function setUp() {
            setArticle(passedArticle);
            await fetchComments(passedArticle.articleId);
            await fetchKeywords(passedArticle.articleId);
        }
        setUp();
    }, [passedArticle]);

    return (
        <>
            {article ?
                <>
                    <div>
                        <h2>{article.articleTitle}</h2>
                        <h4>by {<Link to={`/author/${article.authorHandle}`}>{article.authorFirst + ' ' + article.authorLast}</Link>}</h4>
                        <p>{article.text}</p>
                    </div>
                    <div>
                        <a onClick={() => { if (showCommentBox.current.hidden) showCommentBox.current.hidden = false 
                                else showCommentBox.current.hidden = true}}>{showCommentBox.current.hidden? 'leave a comment':'hide'}</a>
                    </div>
                </>
            :null
            }
            <div hidden ref={showCommentBox}>
                <form onSubmit={handleCommentSubmission}>
                    <textarea name="text" value={commentForm['text']} onChange={handleChange}></textarea>
                    <button>Submit comment</button>
                </form>
            </div>
            {comments ? 
                comments.map((comment, idx) => {
                    return(
                        <div key={idx+1}>
                            <h6>hello. I'm comment #{idx+1}</h6>
                            <h6>{<Link to={`/user/${comment['username']}`}>{comment['username']}</Link>}</h6>
                            <h6>{comment['postDate']}</h6>
                            <img src={`/icons/${comment['icon']}`} width={100} height={100} alt="user icon"/>
                            <p>{comment['text']}</p>
                            <hr></hr>
                        </div>
                    )
                })
            :null   
            }
            {keywords ?
                <div>
                    {keywords.map((keyword, idx) => {
                        return(<p key={idx+1}>#{<Link to={`/articleKeywords/${keyword['keyword']}`}>{keyword['keyword']}</Link>}</p>)
                    })}
                </div>
            :null
            }
        </>
    )
}

export default Article;