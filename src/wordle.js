function get_uinput(word) {
    uinput = "";
    for (i=0; i<word.children.length; i++) {
        uinput = uinput + word.children[i].value;
    }
    return uinput.toLowerCase();
}

async function word_valid(uinput) {
    res = await fetch("./valid-wordle-words.txt");
    text = await res.text();
    text = text.split("\n");
    valid = text.includes(uinput);

    return valid;
}

function active(word) {
    wordidx = get_idx(word);
    return (wordidx == active_field);
}

function color_guess(word, uinput) {
    idx = get_idx(word.parentElement); // get idx of concrete wordle
    solution = solutions[idx];

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

function color_alphabet(wordle) {
    game = wordle.parentElement;
    alphabet = document.getElementById("banner");

    // reset all previous colors
    recolor(alphabet, "black");

    //color specifically for focused wordle (given as parameter)
    for (var i=0; i<active_field; i++) {
        for (var j=0; j<5; j++) {
            letter = wordle.children[i].children[j];
            if (letter.style.backgroundColor == "green") {
                get_letter(letter.value).style.color = "green";
                console.log("Actual wordle: coloring letter green");
                console.log(letter.value);
            }
            if (letter.style.backgroundColor == "yellow") {
                if (get_letter(letter.value).style.color != "green") {
                    get_letter(letter.value).style.color = "orange";
                    console.log("Actual wordle: coloring letter yellow");
                    console.log(letter.value);
                }
            }
        }
    }

    // get and color letters from other words
    inactive = [];
    active_other = [];

    for (var i=0; i<game.children.length; i++) {
        if (active_wordles[i]) {
            for (var j=0; j<active_field; j++) {
                for (var n=0; n<5; n++) {
                    letter = game.children[i].children[j].children[n];
                    if (letter.style.backgroundColor == "green" || letter.style.backgroundColor == "yellow") {
                        if (!active_other.includes(letter.value.toUpperCase())) {
                            active_other.push(letter.value.toUpperCase());
                        }
                    } else {
                        if (!inactive.includes(letter.value.toUpperCase())) {
                            inactive.push(letter.value.toUpperCase());
                        }
                    }
                }
            }
        }
    }

    // try lime or LimeGreen 
    // and magenta or BlueViolet for the other

    console.log(inactive);
    console.log(active_other);

    for (var i=0; i<alphabet.children.length; i++) {
        if (active_other.includes(alphabet.children[i].innerHTML)) {
            if (get_letter(alphabet.children[i].innerHTML).style.color == "black") {
                get_letter(alphabet.children[i].innerHTML).style.color = "purple";
                console.log("General: coloring letter purple");
                console.log(alphabet.children[i].innerHTML);
            }
        } else {
            if (inactive.includes(alphabet.children[i].innerHTML)) {
                alphabet.children[i].style.color = "gray";
                console.log("General: coloring letter gray");
                console.log(alphabet.children[i].innerHTML);
            }
        }
    }
}

function handle_delete(letter) {
    if (!letter.value) {
        prev_letter = get_previous(letter);
        setTimeout(() => {prev_letter.focus();});
    }

    idx = get_idx(letter);
    game = letter.parentElement.parentElement.parentElement;
    for (i=0; i<game.children.length; i++) {
        if (!game.children[i].children[active_field].children[idx].isSameNode(letter)) {
            game.children[i].children[active_field].children[idx].value = "";
        }
    }
}

async function handle_enter(word) {
    uinput = get_uinput(word);
    valid = await word_valid(uinput);

    game = word.parentElement.parentElement;
    const idx = get_idx(word);

    if (!valid) {
        // recolor all active words red
        for (var i=0; i<game.children.length; i++) {
            if (active_wordles[i]) {
                recolor(game.children[i].children[idx], "red");
            }
        }
    } else {
        // check solution for each active wordle
        for (var i=0; i<game.children.length; i++) {
            if (active_wordles[i]) {
                color_guess(game.children[i].children[idx], uinput);
                if (uinput == solutions[i]) {
                    active_wordles[i] = false;

                    if (level > 4) {
                        // push finished wordle to back (technically front of backlog of finished wordles)
                        for (var j=game.children.length-1; j>=0; j--) {
                            if (active_wordles[j]) {
                                insertAfter(game.children[j], game.children[i]);
                                active_wordles.push(active_wordles.splice(i, 1)[0]); // we can just append them as we no longer use them, strictly speaking
                                solutions.push(solutions.splice(i, 1)[0]);
                                break
                            }
                        }
                    }
                }
            }
        }

        // level update and game solved check
        if(active_wordles.every(val => val === false)) {
            if (level == 5) { // actually final should be 10 but let's keep it at that for testing
                window.location.href = "./success.html";
            } else {
                update_level();
            }
        } else {
            // not solved -> check for failure
            active_field++;
            if (active_field >= word.parentElement.children.length) {
                sessionStorage.setItem("level", level);
                sessionStorage.setItem("solutions", solutions);
                window.location.href = "./fail.html";
            }
            
            // move wordle cursor to next word
            wordle_idx = get_idx(word.parentElement);
            if (active_wordles[wordle_idx]) {
                next_word = get_next(word);
                setTimeout(() => {next_word.children[0].focus();}, 0);
                color_alphabet(word.parentElement);
            } else {
                // if word is not active: move to next free word (kinda)
                word.children[4].blur();
                var refocused = false;
                for (var i=wordle_idx; i<game.children.length; i++) {
                    if (active_wordles[i]) {
                        next_wordle = game.children[i];
                        setTimeout(() => {next_wordle.children[active_field].children[0].focus();}, 0);
                        // setTimeout(() => {game.children[i].children[active_field].children[0].focus();}, 0);
                        refocused = true;
                        color_alphabet(next_wordle);
                        break;
                    }
                }
                if (!refocused) {
                    for (var i=wordle_idx-1; i>=0; i--) {
                        if (active_wordles[i]) {
                            setTimeout(() => {game.children[i].children[active_field].children[0].focus();}, 0);
                            break;
                        }
                    }
                }
            }
        }
    }
}

function attach_event_listeners(letter) {
    letter.addEventListener('beforeinput', function(event) {
        this.value = "";
    });

    letter.addEventListener('input', function(event) {
        next_elem = get_next(this);
        next_elem.focus();

        idx = get_idx(this);

        game = this.parentElement.parentElement.parentElement;
        for (i=0; i<game.children.length; i++) {
            if (active_wordles[i]) {
                game.children[i].children[active_field].children[idx].value = this.value;
            }
        }
    });

    letter.addEventListener('keydown', function(event) {
        // recolor all active words
        game = this.parentElement.parentElement.parentElement;
        var idx = get_idx(this.parentElement);

        for (var i=0; i<game.children.length; i++) {
            recolor(game.children[i].children[idx], "black");
        }

        if (event.keyCode == 8) {
            handle_delete(this);
        } else if (event.keyCode == 13) {
            event.preventDefault(); // prevents letter overwrite
            handle_enter(this.parentElement);
        }        
    });

    letter.addEventListener('mousedown', function(event) {
        // "this" is the letter
        idx = get_idx(this.parentElement.parentElement) // get idx of wordle within game
        if (!active_wordles[idx] || !active(this.parentElement)) {
            event.preventDefault();
        }
        color_alphabet(this.parentElement.parentElement);
    });

}

