import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { ThemeProvider } from '@mui/material';
import TigerlillyApi from '../api';
import { formTheme, textareaTheme } from '../css/styles';

/**
 * @component /frontend/src/components/ContactUs
 * @requires module:react.useEffect
 * @requires module:react-router-dom.useNavigate
 * @requires module:mui/icons-material/Feedback
 * @requires module:mui/material/TextField
 * @requires module:mui/material/FormControl
 * @requires module:mui/material/Button
 * @requires module:mui/material/FormHelperText
 * @requires module:mui/material/ThemeProvider
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/css/styles.formTheme
 * @requires module:/frontend/src/css/styles.textareaTheme
 * 
 * @description ContactUs component. simple form for leaving feedback about the site. if form submission is successful, redirects user to
 * Redirects component, and then to root/home ('/')
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - returns form! w/ frontend validation.
 *
 */
function ContactUs() {

    /**
     * @typedef {Object} controlForm - useState hook. form object and assign form object
     * @property {{name: '', email: '', feedback: ''}} form - form object
     * @property {function} setForm - sets value of the form object
     */
    /**
     * @type {controlForm}
     */
    const [form, setForm] = useState({name: '', email: '', feedback: ''});

    /**
     * @typedef {Object} controlCount - useState hook. total character count in form object's feedback property, and setting that value
     * @property {number} charCount - total char count
     * @property {function} setCharCount - set value of char count
     */
    /**
     * @type {controlCount}
     */
    const [charCount, setCharCount] = useState(0);

    /**
     * @typedef {Object} controlNameError - useState hook. if 'name' field contains a validation error, boolean will be set to true
     * (otherwise, its default value is false).
     * @property {boolean} showNameError - show error field or not
     * @property {function} setShowNameError - set whether to show error field or not
     */
    /**
     * @type {controlNameError}
     */
    const [showNameError, setShowNameError] = useState(false);

    /**
     * @typedef {Object} controlEmailError - useState hook. if 'email' field contains a validation error, boolean will be set to true
     * (otherwise, its default value is false).
     * @property {boolean} showEmailError - show error field or not
     * @property {function} setShowEmailError - set whether to show error field or not
     */
    /**
     * @type {controlEmailError}
     */
    const [showEmailError, setShowEmailError] = useState(false);

    /**
     * @typedef {Object} controlFeedbackError - useState hook. if 'feedback' field contains a validation error, boolean will be set to true
     * (otherwise, its default value is false).
     * @property {boolean} showFeedbackError - show error field or not
     * @property {function} setShowFeedbackError - set whether to show error field or not
     */
    /**
     * @type {controlFeedbackError}
     */
    const [showFeedbackError, setShowFeedbackError] = useState(false);

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * @description performs some basic validation before submitting user's form to the server. if there are errors,
     * then form won't be submitted and some inline error msgs will direct the user what to do to fix them.
     * if form submission is successful, user will be redirected to the Redirects component before again being redirected home '/'
     * @async
     * @returns {undefined}
     */
    async function submitAndClear(event) {
        event.preventDefault();
        let error = false;

        if (form.name.length <= 2) { 
            setShowNameError(true);
        } else {
            setShowNameError(false);
        }

        if (charCount <= 5) {
            setShowFeedbackError(true)
            error = true;
        } else {
            setShowFeedbackError(false);
        }

        if (!(/[a-zA-Z\d]*@[a-zA-Z\d]*\.[A-Za-z]{2,3}/.test(form.email) || form.email.length >= 6)) {
            setShowEmailError(true);
            error = true;
        } else {
            setShowEmailError(false);
        }

        if (!error) {
            const commentForm = await TigerlillyApi.postFeedback(form);
            console.log('commentForm response', commentForm.feedback);

            history('/formsubmitted/success');
        }
    }

    /**
     * @description depending on which paramater of the form object is being updated, enforce a field limit in real time.
     * if user is at/over the character limit, don't allow form value to be updated.
     * 
     * THIS NEEDS REFINEMENT YET. i.e. not sure what actually happens, the above is what I think should happen hahaha.
     * @param {Object} event 
     * @returns {undefined}
     */
    function handleChange(event) {
        if (event.target.name === 'name') {
            if (form.name.length <= 30) {
                setForm({...form, [event.target.name]: event.target.value});
            }
        } else if (event.target.name === 'feedback') {
            if (form.feedback.length <= 1000) {
                setCharCount(form.feedback.length);
                setForm({...form, [event.target.name]: event.target.value});
            }
        } else {
            if (form.email.length <= 50) {
                setForm({...form, [event.target.name]: event.target.value});
            }
        }
    }

    return(
        <>
            <div className="PageHeader">
                <FeedbackIcon />
                <h3>The Tigerlilly Online loooooves feedback!</h3> 
                <h3>mad sad glad bad and allll those funky little vibes in between!</h3> 
                <h3>Hey, you may (n)eve(n|r) hear back from us!</h3>
                <FeedbackIcon />
            </div>
            <ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper" style={{minWidth: '66vw', minHeight: '50vh'}}>
                    <form autoComplete="off" noValidate encType="multipart/form-data" onSubmit={submitAndClear} style={{margin: '1em'}}> 
                        <FormControl margin="normal" sx={{width: '100%'}}>

                            <TextField type="text" required={true} label="name" name="name" value={form.name} onChange={handleChange}
                            />
                            {showNameError ? 
                                <FormHelperText error={true}>Hey! an actual name would be nice! 😩😩😩</FormHelperText>
                            : null}

                            <TextField type="email" required={true} label="email" name="email" value={form.email} onChange={handleChange}
                            />
                            {showEmailError ? 
                                <FormHelperText error={true}>Hey!!! make sure this is a real email address, not just some fantasy kicking around in your head! 😩😩😩 </FormHelperText>
                            : null}

                            <ThemeProvider theme={textareaTheme}>
                                <TextField type="textarea" required={true} label="what's on your mind?" name="feedback"
                                          value={form.feedback} multiline minRows={5} onChange={handleChange}
                                />
                            </ThemeProvider>
                            <FormHelperText className={charCount >= 900?'':"HiddenField"}>
                                {1000 - charCount} characters left
                            </FormHelperText>
                            {showFeedbackError ? 
                                <FormHelperText error={true}>Hey!!! Leave us some actual feedback, whydonchya!!! 😩😩😩 </FormHelperText>
                            :null}

                            <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: '#f3f2f2', color: '#171515', fontSize: '.6em',
                                    borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}>Submit</Button>
                        </FormControl>
                    </form>
                </div>
            </ThemeProvider>
        </>
    )
}

export default ContactUs;