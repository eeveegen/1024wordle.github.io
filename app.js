function start() {
    window.location.href = 'start.html';
    return false;    
}

// function enter(ele) {
//     if(event.key === 'Enter') {
//         document.getElementById('debug-field').innerHTML = "Pressed!";
//     }
// }

function attach_event_listeners() {
    // get all applicable
    textinpdivs = document.getElementsByClassName("textfields");

    // iterate over "words"
    for (j=0; j<textinpdivs.length; j++) {
        // iterate over word letter fields
        for (i=0; i<textinpdivs[j].children.length; i++) {
            elem = textinpdivs[j].children[i];

            elem.addEventListener('keydown', function(event) {
                textinpdiv = this.parentElement;

                // find element index in word
                for (i=0; i<textinpdiv.children.length; i++) {
                    textinpdiv.children[i].style.color = "black";
                    if (textinpdiv.children[i].isEqualNode(this)) {
                        let idx = i;
                    }
                }
                
                // case: delete -> go back
                if (event.keyCode == 8) { 
                    if (!this.value) {
                        if (idx>0) {
                        idx = idx-1;
                        }

                        val = textinpdiv.children[idx].value;
                        textinpdiv.children[idx].focus();
                        textinpdiv.children[idx].value = val + " "; // to neutralise delete
                    }
                // case: enter
                } else if (event.keyCode == 13) {
                    word = "";
                    for (i=0; i<textinpdiv.children.length-1; i++) {
                        word = word + textinpdiv.children[i].value;
                    }
                    //debugel = document.getElementById("debugfield");

                    fetch("valid-wordle-solutions.txt")
                        .then((res) => res.text())
                        .then((text) => text.split("\r\n"))
                        .then((text) => {
                            valid = text.includes(word);
                            if (!valid) {
                                for (i=0; i<textinpdiv.children.length; i++) {
                                    textinpdiv.children[i].style.color = "red";
                                }
                            }
                        })
                // case: another key -> move forward!
                } else { 
                    // "wait" time so that input is processed
                    setTimeout(() => {refocus(this)}, 0);
                }
            });
        }
    }
}

function refocus(elem) {

    // overwrite so that field contains only 1 letter;
    if (elem.value.length > 0) {
        elem.value = elem.value[elem.value.length-1];
    } else {
        elem.value = "";
    }

    // get next element in the box and focus on it
    textinpdiv = elem.parentElement;

    for (i=0; i<textinpdiv.children.length; i++) {
        if ((textinpdiv.children[i]).isEqualNode(elem)) {
            idx = i;
            break;
        }
    }

    if (i<textinpdiv.children.length-1) {
       i = i+1;
    }
    textinpdiv.children[i].focus();
}