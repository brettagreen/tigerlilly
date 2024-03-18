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


function ContactUs() {

    const [form, setForm] = useState({name: '', email: '', feedback: ''});
    const [charCount, setCharCount] = useState(0);
    const [showNameError, setShowNameError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showFeedbackError, setShowFeedbackError] = useState(false);

    const history = useNavigate();

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