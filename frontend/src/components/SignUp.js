//typedefs
/**
 * @typedef {Object} user - returned user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/

import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FormControl, TextField, Button, ThemeProvider, Alert, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UserContext from "../userContext";
import TigerlillyApi from '../api';
import { formTheme } from '../css/styles';
import validate from '../helpers/formValidation';
import '../css/signup.css';

/**
 * @component /frontend/src/components/SignUp
 * @requires module:react.useState
 * @requires module:react.useContext
 * @requires module:react.useRef
 * @requires module:react.useEffect
 * @requires module:react-router-dom.useNavigate
 * @requires module:mui/material/FormControl
 * @requires module:mui/material/TextField
 * @requires module:mui/material/Button
 * @requires module:mui/material/ThemeProvider
 * @requires module:mui/material/Alert
 * @requires module:mui/material/IconButton
 * @requires module:mui/material/InputAdornment
 * @requires module:mui/material/FormHelperText
 * @requires module:mui/icons-material/VisibilityOutlined
 * @requires module:mui/icons-material/VisibilityOff
 * @requires module:/frontend/src/userContext
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/css/styles.formTheme
 * @requires module:/frontend/src/helpers/formValidation
 * 
 * @description SignUp component. form element with frontend validation. user submits for to create an account. redirect to /profile if 
 * process is successfully completed.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {function} updateUserToken - if form submission is successful, this function will set the user's auth token in the App component
 * @returns {JSX.Element} - form element with some wrappers
 *
 */
function SignUp({ updateUserToken }) {

    /**
     * form object that also contains field pertaining to form field validation and error message handling
     */
    const INITIAL_STATE = {
        username: {value: '', error: false, errorMsg: [], min: 3, max: 30},
        password: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        confirmPassword: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        userLast: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        userFirst: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        email: {value: '', error: false, errorMsg: [], min: 6, max: 50, pattern: /[a-zA-Z\d]*@[a-zA-Z\d]*\.[A-Za-z]{2,3}/},
        icon: null
    }

    /**
     * the useRef is a hook "that lets you reference a value that’s not needed for rendering"
     * @see https://react.dev/reference/react/useRef
     * in this case, <input type="file" input is HIDDEN and its functionality taken over but a <button element. when button
     * is clicked, the hiddenFileInput ref is used to 'click' the hidden file component (and bring up the select file menu as expected)
     * @type {Object}
     */
    const hiddenFileInput = useRef();

    /**
     * set global user upon successful completion of sign up process
     * @type {function}
     */
    const setCurrentUser = useContext(UserContext).setCurrentUser;

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * @typedef {Object} controlShow1 - useState hook. if show1 val == true, then user can see the value of the form's password field.
     * @property {boolean} show1 - true/false show in plaintext 'password' field text. defaults to false.
     * @property {function} setShow1 - set whether 'password' plaintext is shown or not
     */
    /**
     * @type {controlShow1}
     */
    const [show1, setShow1] = useState(false);

    /**
     * @typedef {Object} controlShow2 - useState hook. if show2 val == true, then user can see the value of the form's confirm password field.
     * @property {boolean} show2 - true/false show in plaintext 'confirmPassword' field text. defaults to false.
     * @property {function} setShow2 - set whether 'confirmPassword' plaintext is shown or not
     */
    /**
     * @type {controlShow2}
     */
    const [show2, setShow2] = useState(false);

    /**
     * mui InputAdornment element that wraps closed/open eye icon that is placed at the end of the password field
     * @type {JSX.Element}
     */
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow1(true)}
                        onMouseLeave={() => setShow1(false)}>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    /**
     * mui InputAdornment element that wraps closed/open eye icon that is placed at the end of the confirm password field
     * @type {JSX.Element}
     */
    const pwIcon2 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow2(true)}
                        onMouseLeave={() => setShow2(false)}>{show2?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    /**
     * @typedef {Object} controlForm - useState hook. 
     * @property {INITIAL_STATE} form - form
     * @property {function} setForm - set form object
     */
    /**
     * @type {controlForm}
     */
    const [form, setForm] = useState(INITIAL_STATE);

    /**
     * @typedef {Object} controlFileAlert - useState hook. if fileAlertOpen == true, show the Alert component with its warning
     * @property {boolean} fileAlertOpen - true/false whether file Alert warning is visible
     * @property {function} setFileAlertOpen - set whether file Alert warning is visible
     */
    /**
     * @type {controlFileAlert}
     */
    const [fileAlertOpen, setFileAlertOpen] = useState(false);

    /**
     * controlled form event, updates any form value on change. also triggers file alert to appear if file size exceeds 3mb
     * @param {Object} event 
     * @returns {undefined}
     */
    function handleChange(event) {
        if (event.target.name === "icon") {
            if (event.target.files[0].size > 3000000) {
                setFileAlertOpen(true);
            } else {
                setFileAlertOpen(false);
                setForm({...form, [event.target.name]: event.target.files[0]});
            }
        } else {
            setForm({...form, [event.target.name]: {...form[event.target.name], value: event.target.value}});
        }
    }

    /**
     * simulates opening of choose file menu
     * @returns {undefined}
     */
    function handleFileClick() {
        hiddenFileInput.current.click();
    };

    /**
     * checks to see if there are any errors with the form before submitting it. if there are errors, the validate function
     * will return the form that was submitted to it with the appropriate error message(s) for relevant fields.
     * otherwise, user account is created, user auth token is set globally, and user is redirected to his profile page to see
     * the beauty of his new creation :D
     * @param {Object} event 
     * @returns {undefined}
     */
    async function submitAndClear(event) {
        event.preventDefault();

        /**
         * @typedef {Object} controlValidate - valide() will return an error boolean and a form object. if error == true, then returned form
         * will hold values for which field(s) are in error long with appropriate error messages. OTHERWISE, the returned form is disregarded. 
         * @property {boolean} error - true/false whether the submitted form contains error(s)
         * @property {UPDATE_STATE} errorForm - this is the originally loaded UPDATE_STATE form, but with with the errorMsg property of fields
         * in error filled in with error message(s)
         */
        /**
         * @type {controlValidate}
         */
        const [error, errorForm] = validate({...form});

        if (!error) {
            /**
             * form object has too many other things going on with it, 
             * so create new form object with simple key/value pairs
             */
            const submitForm = {
                username: form.username.value,
                password: form.password.value,
                userLast: form.userLast.value,
                userFirst: form.userFirst.value,
                email: form.email.value,
                icon: form.icon
            };

            /**
             * @type {user}
             */
            const user = await TigerlillyApi.registerUser(submitForm);
            updateUserToken(user.token);
            setCurrentUser(user.user);
            history('/profile');
        } else {
            setForm(errorForm);
        }

    }

    return (
        <>
            {fileAlertOpen ?
                <Alert open={fileAlertOpen} variant="filled" severity="warning" onClose={() => setFileAlertOpen(false)}>
                    Please choose a file 3MB or smaller.
                </Alert>
            :null}

            <div className="PageHeader">
                <h2 style={{marginBottom: '0px'}}>Create your account</h2>
                <h3 style={{marginTop: '0px'}}>All fields required unless marked *optional</h3>
            </div>
            <ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper">
                    <form autoComplete="off" noValidate encType="multipart/form-data" onSubmit={submitAndClear}> 
                        <FormControl margin="normal" sx={{width: '100%'}}>

                            <TextField type="text" label="username" name="username" value={form.username.value} onChange={handleChange}
                                        error={form.username.error} 
                            />
                            {form.username.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type={show1?"text":"password"} label="password" name="password" value={form.password.value}
                                        onChange={handleChange} error={form.password.error} InputProps={pwIcon1}
                                />
                            {form.password.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type={show2?"text":"password"} label="confirm password" name="confirmPassword"
                                        value={form.confirmPassword.value} onChange={handleChange} error={form.confirmPassword.error}
                                        InputProps={pwIcon2}
                            />
                            {form.confirmPassword.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="text" label="first name" name="userFirst" value={form.userFirst.value} onChange={handleChange}
                                        error={form.userFirst.error} 
                            />
                            {form.userFirst.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="text" label="last name" name="userLast" value={form.userLast.value} onChange={handleChange}
                                        error={form.userLast.error} 
                                />
                            {form.userLast.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="email" label="email" name="email" value={form.email.value} onChange={handleChange}
                                        error={form.email.error}
                            />
                            {form.email.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            {/* icon file selection stuff*/}
                            <div style={{display: 'block'}}>
                                <Button type="button" variant="outlined" onClick={handleFileClick}
                                        sx={{ display: 'inline-block', maxWidth: '10em', backgroundColor: '#f3f2f2', fontSize: '.6em',
                                        color: '#171515', borderColor: '#171515', marginTop: '1em', fontVariant: 'small-caps'}}
                                >Select icon</Button>
                                <span style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: '0.5em'}}>{form.icon?form.icon.name:"no file selected"}</span>

                                <TextField className="HiddenField" type="file" name="icon" variant="standard" onChange={handleChange}
                                            inputRef={hiddenFileInput} 
                                />
                            </div>

                            <FormHelperText sx={{marginLeft: '7px', marginTop: '2px'}}>*optional</FormHelperText>
                            <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: '#f3f2f2', color: '#171515', fontSize: '.6em',
                                    borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}>Submit</Button>
                        </FormControl>
                    </form>
                </div>
            </ThemeProvider>
        </>
    )

}

export default SignUp;