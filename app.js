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
                    if (textinpdiv.children[i].isEqualNode(this)) {
                        break;
                    }
                }
                
                // case: delete -> go back
                if (event.keyCode == 8) { 
                    if (!this.value) {
                        if (i>0) {
                        i = i-1;
                        }

                        val = textinpdiv.children[i].value;
                        textinpdiv.children[i].focus();
                        textinpdiv.children[i].value = val + " "; // to neutralise delete
                    }
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