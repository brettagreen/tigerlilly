import { useState, useRef } from 'react';

function MadlibForm({handleSubmit}) {

    const [form, setForm] = useState(null);
    const [story, setStory] = useState(null);

    const invalid = useRef();
    const formElement = useRef();

    function handleChange(event) {
        setForm(form => ({...form, [event.target.name]: event.target.value}))
    }

    function chooseMadlib(event) {
        event.preventDefault();
        let stories = MadlibForm.defaultProps.stories;
        for (let story of stories) {
            if (story.id === event.target.value) {
                setStory(story);
                let newForm = {};
                let key;
                for (let x = 0; x < story.pos.length; x++) {
                    key = story.pos[x];
                    newForm[key] = '';
                }
                setForm(newForm);
                formElement.current.hidden = false;
                break;
            }
        }
    }

    function submitAndClear(event) {
        event.preventDefault();
        let error;

        let allAnswered = Object.values(form).every(item => {
            return item !== '';
        });

        if (!allAnswered) {
            error = true;
            invalid.current.hidden = false;
        } else {
            error = false;
        }

        if (!error) {
            invalid.current.hidden = true;
            handleSubmit({form, title: story.title, text: story.text});
            setForm('');
        }
    }

    return (
        <div>
            <h3>Madlibs!</h3>
            <h5 hidden style={{color: 'red'}} ref={invalid}>All fields must contain a value!</h5>
            <select name="stories" onChange={chooseMadlib}>
                <option key="" value="">--Please choose your madlib--</option>
                <option key="grown" value="grown">Grown-ass man</option>
                <option key="cat" value="cat">Cat sratch fever</option>
                <option key="cleaning" value="cleaning">Spring cleaning</option>
                <option key="swimming" value="swimming">Pond swimming</option>
                <option key="eating" value="eating">Care for a bite?</option>
            </select>
            <form hidden ref={formElement} onSubmit={submitAndClear}>
                {story && form ? story.pos.map((prompt,idx) => (
                    <><input key={idx} placeholder={prompt} type="text" name={prompt}
                        value={form[prompt]} onChange={handleChange} /><br /></>)) : null
                }
                <button>get story</button>
            </form>
        </div>
    );

}

MadlibForm.defaultProps = {
    stories: [
      {id: "grown", title: "Grown-ass man", pos: ["noun", "place", "person", "feeling", "plural noun"], 
            text: `As a grown ass ***, I demand a vacation to ***. *** told me you would feel *** to see me leave. Well, tough ***!` },

      {id: "cat", title: "Cat scratch fever", pos: ["place","thing","something wet","adjective","verb"],
            text: "*** had never witnessed such delights! The vile *** had been put aside due to *** and other *** arts. *** Allah!" },

      {id: "cleaning", title: "Spring cleaning", pos: ["idea", "verb", "adjective", "adverb", "famous person"], 
            text: "Taking my dog on a walk with this *** leash is FAB! I *** with joy. Time to clean out other *** habits! The *** scowl of *** always puts me in a tizzy!" },

      {id: "swimming", title: "Pond swimming", pos: ["destination", "adjective1", "adjective2", "feeling", "dangerous thing to do"], 
            text: "Mayhap *** awaits! Mayhapeth not! *** and *** guesses about the future make me feel ***. Best *** and muck around in a pond somewhere. dunno." },

      {id: "eating", title: "Care for a bite?", pos: ["noun1", "noun2", "adjective", "color"], 
            text: "The *** ate the *** which made the *** gentleman turn ***."}
    ]
  };

export default MadlibForm;