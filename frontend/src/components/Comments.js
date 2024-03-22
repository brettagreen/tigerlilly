/**
 * if/when the site allows for people to leave comments, then this component will see the glorious light of day.
 * until then, bone-chilling darkness.
 */
function Comments() {
    //const [comments, setComments] = useState(null);
    //const [showComments, setShowComments] = useState('show comments');
    //const [commentForm, setCommentForm] = useState({userId: user ? user.id : 0, text: '',
    //      articleId: passedArticle ? passedArticle.articleId : id});
    //const showLeaveComment = useRef();
    //const showCommentsRef = useRef();
    //const user = useContext(UserContext).user;

    // async function handleCommentSubmission(event) {
    //     event.preventDefault();
    //     showLeaveComment.current.hidden = true;
    //     console.log('user', user);
    //     console.log('commentForm', commentForm);
    //     const resp = await TigerlillyApi.commit('comments', commentForm, 'post');
    //     setComments([...comments].unshift(resp.comments));
    //     setCommentForm({...commentForm, 'text': ''});
    // }

    // function handleChange(event) {
    //     if (!isNaN(event.target.value) && event.target.value !== '') {
    //         setCommentForm({...commentForm, [event.target.name]: Number(event.target.value)});
    //     } else {
    //         setCommentForm({...commentForm, [event.target.name]: event.target.value});
    //     }
    // }

    // async function fetchComments(articleId) {
    //     console.log('fetchComments() useEffect')
    //     const resp = await TigerlillyApi.getComments(articleId, 'articles');

    //     if (resp.comments.length !== 0) {
    //         setComments(resp.comments);
    //     }
    // }

    // function toggleComments() {
    //     if (showCommentsRef.current.hidden) {
    //         showCommentsRef.current.hidden = false;
    //         setShowComments('hide comments');
    //     } else {
    //         showCommentsRef.current.hidden = true;
    //         setShowComments('show comments');
    //     }
    // }
    <br />
    {/* <div hidden ref={showCommentsRef}>
        {comments ? 
            comments.map((comment, idx) => {
                return(
                    <div key={idx+1}>
                        <h6>{<Link href={`/user/${comment['username']}`}>{comment['username']}</Link>}&nbsp;
                            {new Date(comment['postDate']).toLocaleString()}
                        </h6>
                        <img src={`/icons/${comment['icon']}`} width={100} height={100} alt="user icon"/>
                        <p id="commentText">{comment['text']}</p>
                        <hr id="commentHR"></hr>
                    </div>
                )
            })
        :null   
        }
    </div> */}
    {/* <div hidden ref={showLeaveComment}>
        <form onSubmit={handleCommentSubmission}>
            <ThemeProvider theme={textareaTheme}>
                <TextField type="textarea" name="text" value={commentForm['text']}
                            multiline minRows={5} onChange={handleChange} sx={{height: 'inherit'}} />
            </ThemeProvider>
                <br />
                <Link href="#" sx={{float: 'left'}} onClick={() => showLeaveComment.current.hidden = true} 
                        type="button" component="button" underline="none">cancel</Link>
                <Link href="#" sx={{float: 'right'}} component="button" type="submit" underline="none">submit</Link>
        </form>
    </div>  */}

    {/* <div>
        <Link href="#" component="button" underline='always' onClick={() => { if (showLeaveComment.current.hidden) 
                showLeaveComment.current.hidden = false 
                else showLeaveComment.current.hidden = true}}>leave a comment
        </Link>
        &nbsp;&nbsp;
        {comments !== null ?
            <Link href="#" component="button" underline='always' onClick={toggleComments}>{showComments}</Link>
        :null}
    </div> */}

}