var active_field = 0;
var solution;
fetch("./valid-wordle-solutions.txt")
        .then((res) => res.text())
        .then((text) => text.trim())
        .then((text) => {
            text = text.replace("\r", "");
            text = text.split("\n");

            idx = Math.floor(Math.random() * text.length);
            solution = text[idx];

            debugel = document.getElementById("debugfield");
            debugel.innerHTML = "Solution: " + solution;
        })

// mummy -> 3
// comma -> 2
// solution = "annoy";
// solution = "nanny";

function start() {
    window.location.href = './start.html';
    return false;    
}

function get_idx(elem) {
    parent = elem.parentElement;

    for (i=0; i<parent.children.length; i++) {
        if (parent.children[i].isSameNode(elem)) {
            return i;
        }
    }
}

function get_previous(elem) {
    // returns same element if it's the first one
    parent = elem.parentElement;
    idx = get_idx(elem);
    if (idx != 0) {
        idx = idx-1;
    }
    return parent.children[idx];
}

function get_next(elem) {
    // returns the same element if it's the last one
    parent = elem.parentElement;
    idx = get_idx(elem);
    if (idx != parent.children.length-1) {
        idx = idx+1;
    }
    return parent.children[idx];
}

function recolor(word, color) {
    for (i=0; i<word.children.length; i++) {
        word.children[i].style.color = color;
    }
}

function handle_delete(letter) {
    if (!letter.value) {
        prev_letter = get_previous(letter);
        setTimeout(() => {prev_letter.focus();});
    }
}

function get_uinput(word) {
    uinput = "";
    for (i=0; i<word.children.length; i++) {
        uinput = uinput + word.children[i].value;
    }

    return uinput.toLowerCase();
}

// async function debug_solution() {
//     res = await fetch("./valid-wordle-solutions.txt");
//     text = await res.text();
//     text = text.trim();
//     console.log("Text length after fetch: " + text.length.toString());
//     // console.log("Fifth+ characters: " + text[5] + text[6] + text[7] + text[8]);
//     // console.log("Fifth character: " + text[5]);
//     text = text.replace("\r", "");
//     text = text.split("\n");
//     console.log("Text length after split: " + text.length.toString());
//     console.log("Word length: " + text[0].length);

// }

async function word_valid(uinput) {
    res = await fetch("./valid-wordle-words.txt");
    text = await res.text();
    text = text.split("\n");
    valid = text.includes(uinput);

    return valid;
}

async function handle_enter(word) {
    uinput = get_uinput(word);
    // valid = await word_valid(uinput);

    next_word = get_next(word); // returs same word if it's the last one but we can tackle this one later
    setTimeout(() => {next_word.children[0].focus();}, 0);

    debugel = document.getElementById("debugfield");
    debugel.innerHTML = "Solution: " + solution + ", input: " + uinput;
}

function color_guess(word, uinput) {
    // step 1: color all greens
    for (i=0; i<solution.length; i++) {
        if (uinput[i] == solution[i]) {
            word.children[i].style.backgroundColor = "green";
        }
    }

    // step 2: iterate again
    for (i=0; i<solution.length; i++) {
        // do stuff only for fields not alr processed in last step (= green)
        if (word.children[i].style.backgroundColor != "green") {
            // unprocessed tile -> iterate over uinput
            for (j=0; j<uinput.length; j++) {
                if (uinput[j] == solution[i]) {
                    // find first "free" tile with the same letter and color that one
                    if (word.children[j].style.backgroundColor != "green" && word.children[j].style.backgroundColor != "yellow") {
                        word.children[j].style.backgroundColor = "yellow";
                        break;
                    }
                }
            }
        }
    }
}

function handle_input(letter) {
    // note: handle_input has a problem with the last letter - it writes a second letter there instead of doing what it is supposed to do;
    // last letter of each word has length 2 for whatever reason

    // overwrite so that field contains only 1 letter;
    if (letter.value.length > 0) {
        letter.value = letter.value[letter.value.length-1];
    } else {
        letter.value = "";
    }

    next_letter = get_next(letter);
    setTimeout(() => {next_letter.focus();});
}

function attach_event_listeners() {
    // debug:
    // debugel = document.getElementById("debugfield");
    // debugel.innerHTML = "Solution: " + solution;

    // get all applicable
    textinpdivs = document.getElementsByClassName("textfields");

    // iterate over "words"
    for (j=0; j<textinpdivs.length; j++) {
        // iterate over word letter fields
        for (i=0; i<textinpdivs[j].children.length; i++) {
            elem = textinpdivs[j].children[i];

            elem.addEventListener('beforeinput', function(event) {
                this.value = "";
            });

            elem.addEventListener('input', function(event) {
                next_elem = get_next(this);
                next_elem.focus();
            });

            elem.addEventListener('keydown', function(event) {
                if (event.keyCode == 8) { 
                    handle_delete(this);
                } else if (event.keyCode == 13) {
                    event.preventDefault(); // prevents letter overwrite
                    // this.style.backgroundColor = "orange";
                    handle_enter(this.parentElement);
                    // debug_solution();
                }
            });
        }
    }
}

function active(word) {
    wordidx = get_idx(word);
    return (wordidx == active_field);
}