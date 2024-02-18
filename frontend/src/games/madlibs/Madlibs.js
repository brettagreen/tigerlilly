import MadlibForm from './MadlibForm';
import MadlibAnswers from './MadlibAnswers';
import useForm from './useForm';
import { useState } from 'react';

function Madlibs() {
    const [responses, setResponses] = useState(null);
    const [isShowingForm, setIsShowingForm] = useForm();

    function handleSubmit(newResponses) {
        setIsShowingForm();
        setResponses(newResponses);
    }

    return (
        <>
            { isShowingForm ? <MadlibForm handleSubmit={handleSubmit} /> :
                <MadlibAnswers responses={responses} showForm={setIsShowingForm} />}
        </>
    );

}

export default Madlibs;