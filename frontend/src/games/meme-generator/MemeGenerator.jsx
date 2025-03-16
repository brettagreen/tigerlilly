import './../css/memegenerator.css';
import { useRef } from 'react';

function MemeGenerator() {
    const urlRef = useRef();

    function appendMeme() {
        const ul = document.querySelector('#memesList');
        const topText = document.querySelector("#text-top");
        const bottomText = document.querySelector("#text-bottom");

        const listItem = document.createElement("li")
        listItem.className = 'memesItem';
        const imageDiv = document.createElement("div");
        const image = document.createElement("img");
        const removeButton = document.createElement("button");
        const textDivTop = document.createElement("div");
        const textDivBottom = document.createElement("div");
    
        ul.append(listItem);
        listItem.append(imageDiv);
        imageDiv.append(textDivTop);
        imageDiv.append(image);
        imageDiv.append(textDivBottom);
        imageDiv.append(removeButton);
    
        removeButton.innerText = 'meme go bye-bye!';
        removeButton.className = "remove-button";
    
        image.setAttribute('src', urlRef.current.value);
        image.setAttribute('alt', 'meme image');
        image.setAttribute('height', 400);
        image.setAttribute('width', 400);
        textDivTop.className = 'meme-text';
        textDivBottom.className = 'meme-text';
        textDivTop.innerText = topText.value.toUpperCase();
        textDivBottom.innerText = bottomText.value.toUpperCase();
    
        imageDiv.style.position = 'relative';
        imageDiv.id = "image-div";
        textDivTop.id = "textDiv-top";
        textDivBottom.id = "textDiv-bottom";
    
        urlRef.current.value = '';
        topText.value = '';
        bottomText.value = ''; 
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        //test to make sure url provided actually links to useable file. 
        //if not, throw an error message.
        let imgSize = new Image();
        imgSize.src = urlRef.current.value;
    
        setTimeout(function(e) {
            if (imgSize.height <= 0 || imgSize.width <= 0) {
                const h3 = (document.createElement('h3'));
                h3.id = "memesWarning";
                h3.innerText = 'URL is invalid. Please try again.'
                document.getElementById("urlfield").append(h3);
                setTimeout(function() {
                    const topText = document.querySelector("#text-top");
                    const bottomText = document.querySelector("#text-bottom");
                    
                    urlRef.current.value = '';
                    topText.value = '';
                    bottomText.value = '';
                    h3.remove();
                }, 2000)
            } else {
                appendMeme();
            }
        }, 500);
    }
    
    function handleRemove(e) {
        if (e.target.tagName === "BUTTON") {
            e.target.parentElement.parentElement.remove();
        }
    }

    return(
        <>
            <h1>Meme Machine</h1>
            <form id="memesForm" onSubmit={handleSubmit}>
                <span id="urlfield">
                    <label htmlFor="image">Link to image:</label>
                    <input type="url" ref={urlRef} />
                </span>
                <br /><br />

                <label className="memesLabel" htmlFor="text-top">Top text:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="text" id="text-top" maxLength={30} /><span className="input-text">
                        limit 30 characters</span><br /><br />

                <label className="memesLabel" htmlFor="text-bottom">Bottom text:</label>&nbsp;&nbsp;&nbsp;
                <input type="text" id="text-bottom" maxLength={30} /><span className="input-text"> 
                        limit 30 characters</span><br /><br />
                        
                <button>feed the meme machine</button>
            </form>
            <section id="memes">
                <ul id="memesList" onClick={handleRemove}>
                </ul>
            </section>
        </>
    )
}

export default MemeGenerator