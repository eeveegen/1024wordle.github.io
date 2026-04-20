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
        for (var i=0; i<game.children.length; i++) {
            if (active_wordles[i]) {
                color_guess(game.children[i].children[idx], uinput);
                if (uinput == solutions[i]) {
                    active_wordles[i] = false;
                    if(active_wordles.every(val => val === false)) {
                        if (level == 4) { // actually final should be 10 but let's keep it at that for testing
                            window.location.href = "./success.html";
                        } else {
                            update_level();
                        }
                    }
                }
            }
        }
        active_field++;
        if (active_field >= word.parentElement.children.length) {
            window.location.href = "./fail.html";
        }

        wordle_idx = get_idx(word.parentElement);
        if (active_wordles[wordle_idx]) {
            next_word = get_next(word);
            setTimeout(() => {next_word.children[0].focus();}, 0);
        } else {
            sessionStorage.setItem("level", level);
            sessionStorage.setItem("solutions", solutions);
            word.children[4].blur();
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
    });

}

