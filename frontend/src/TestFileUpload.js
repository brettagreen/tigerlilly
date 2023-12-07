import { useState } from 'react';
import TigerlillyApi from './api';

function TestFileUpload() {

    const INIT = {
        icon: null,
        first: '',
        last: ''
    }

    const [form, setForm] = useState(INIT);
    const [file, setFile] = useState(null);

    function handleChange(event) {
        if (event.target.name === "icon") {
            console.log('event!', event.target.files[0]);
            if (event.target.files[0].size > 1000000) return alert("choose a smaller file");
            setForm({...form, [event.target.name]: event.target.files[0]});
        } else {
            setForm({...form, [event.target.name]: event.target.value});
        }
    }

    async function submitAndClear(event) {
        event.preventDefault();

        const returnFile = await TigerlillyApi.testUpload(form, 'bagreen3');
        console.log('returnFile', returnFile)
        setFile(returnFile.file);
        setForm(INIT);
        
        //file input is uncontrolled
        document.getElementById('icon').value = '';
    }

    return (
        <>
            <form className="form" encType="multipart/form-data" onSubmit={submitAndClear}>
                <label htmlFor="icon">icon: </label>
                <input type="file" id="icon" name="icon" onChange={handleChange}/><br /><br />
                <label htmlFor="first">first: </label>
                <input type="text" id="first" name="first" onChange={handleChange} value={form['first']}/><br /><br />
                <label htmlFor="last">last: </label>
                <input type="text" id="last" name="last" onChange={handleChange} value={form['last']}/><br /><br />
                <button>submit</button>
            </form>
            {file ?
                <img src={`/icons/${file}`} alt="user icon" />
            :null}
        </>
    )

}

export default TestFileUpload;