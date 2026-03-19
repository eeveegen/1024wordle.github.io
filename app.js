var active_field = 0;

function start() {
    window.location.href = './start.html';
    return false;    
}

// function enter(ele) {
//     if(event.key === 'Enter') {
//         document.getElementById('debug-field').innerHTML = "Pressed!";
//     }
// }

function refocus_test(elem) {
    prev_elem = get_previous(elem);
    prev_elem.value = "h";
}

function get_previous(elem) {
    parent = elem.parentElement;
    for (i=0; i<parent.children.length; i++) {
        if (parent.children[i].isEqualNode(elem)) {
            if (i != 0) {
                i = i-1;
            }
            return parent.children[i];
        }
    }
}

function get_next(elem) {
    parent = elem.parentElement;
    for (i=0; i<parent.children.length; i++) {
        if (parent.children[i].isEqualNode(elem)) {
            if (i != parent.children.length-1) {
                i = i+1;
            }
            return parent.children[i];
        }
    }
}

function recolor(word, color) {
    for (i=0; i<word.children.length; i++) {
        word.children[i].style.color = color;
    }
}

function handle_delete(letter) {
    if (!letter.value) {
        prev_letter = get_previous(letter);
        prev_letter.focus();
    }
}

function handle_enter(word) {
    uinput = "";
    for (i=0; i<word.children.length; i++) {
        uinput = uinput + word.children[i].value;
    }

    fetch("./valid-wordle-solutions.txt")
        .then((res) => res.text())
        .then((text) => text.split("\r\n"))
        .then((text) => {
            valid = text.includes(uinput);
            if (!valid) {
                recolor(word, "red");
            }
        })
}

function handle_input(letter) {
    // overwrite so that field contains only 1 letter;
    if (letter.value.length > 0) {
        letter.value = letter.value[letter.value.length-1];
    } else {
        letter.value = "";
    }

    next_letter = get_next(letter);
    next_letter.focus();
}

function attach_event_listeners() {
    // get all applicable
    textinpdivs = document.getElementsByClassName("textfields");

    // iterate over "words"
    for (j=0; j<textinpdivs.length; j++) {
        // iterate over word letter fields
        for (i=0; i<textinpdivs[j].children.length; i++) {
            elem = textinpdivs[j].children[i];

            elem.addEventListener('keydown', function(event) {
                recolor(this.parentElement, "black");

                if (event.keyCode == 8) { 
                    handle_delete(this);
                } else if (event.keyCode == 13) {
                    handle_enter(this.parentElement);
                } else { 
                    // "wait" time so that input is processed
                    setTimeout(() => {handle_input(this)}, 0);
                }
            });
        }
    }
}


