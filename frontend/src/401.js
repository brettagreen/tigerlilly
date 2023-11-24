function Error({type}) {

    function msg() {
        if (type === "profileError") {
            return <h1 className="textInfo">You must be logged in to view your profile.</h1>

        } else if (type === 'adminError') {
            return <h1 className="textInfo">Are you an admin??? Didn't think so!</h1>
            
        } else {
            return <h1 className="textInfo">The page you're looking for does not exist</h1>
        }
    }

    return (
        <>
            {msg()}
        </>
    )
}

export default Error;