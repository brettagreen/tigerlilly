function MadlibAnswers({responses, showForm}) {

    let {form, title, text} = responses;

    (() => {
        Object.values(form).forEach(ans => {
            text = text.replace("***", ans);
        })
        
    })();

    return (
        <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <button onClick={showForm}>Restart</button>
        </div>
    );

}

export default MadlibAnswers;