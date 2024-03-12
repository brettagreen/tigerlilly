import FeedbackIcon from '@mui/icons-material/Feedback';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { ThemeProvider } from '@mui/material';
import TigerlillyApi from './api';
import { useState } from 'react';
import { formTheme, textareaTheme } from './css/styles';


function ContactUs() {

    const [form, setForm] = useState({name: '', email: '', feedback: ''});
    const [charCount, setCharCount] = useState(0);

    async function submitAndClear(event) {
        event.preventDefault();

        const commentForm = await TigerlillyApi.postFeedback(form);
        console.log('commentForm response', commentForm.feedback);

    }

    function handleChange(event) {
        setForm({...form, [event.target.name]: event.target.value});

        if (event.target.name === 'feedback') {
            setCharCount(form.feedback.length);
        }
    }

    return(
        <>
            <div className="PageHeader">
                <FeedbackIcon />
                <h3>The Tigerlilly Online loooooves feedback!</h3> 
                <h3>mad sad glad bad and allll those funky vibes in between!</h3> 
                <h3>Hey, you may (n)eve(n|r) hear back from us!</h3>
                <FeedbackIcon />
            </div>
            <ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper">
                    <form autoComplete="off" noValidate encType="multipart/form-data" onSubmit={submitAndClear}> 
                        <FormControl margin="normal" sx={{width: '100%'}}>

                            <TextField type="text" required={true} label="name" name="name" value={form.name} onChange={handleChange}
                                minLength={2} maxLength={30}
                            />

                            <TextField type="email" required={true} label="email" name="email" value={form.email} onChange={handleChange}
                                minLength={6} maxLength={50}
                            />

                            <ThemeProvider theme={textareaTheme}>
                                <TextField type="textarea" required={true} label="what's on your mind?" name="feedback"
                                         minLength={2} maxLength={1000} value={form.feedback} multiline minRows={5} onChange={handleChange}
                                />
                            </ThemeProvider>
                            <FormHelperText className={charCount >= 900?'':"HiddenField"}>
                                {charCount} characters left
                            </FormHelperText>


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