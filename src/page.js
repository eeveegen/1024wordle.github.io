function gen_word() {
    var word = document.createElement("div");
    word.classList.add("textfields");
    
    for (i=0; i<5; i++) {
        var letter = document.createElement("INPUT");
        letter.setAttribute("type", "text");
        letter.classList.add("letterbox");
        attach_event_listeners(letter);

        word.appendChild(letter);
    }
    return word;
}

function create_wordle(attempts) {
    var wordle = document.createElement("div");
    wordle.classList.add("wordle");
    var word;

    for (j=0; j<attempts; j++) {
        word = gen_word();
        wordle.appendChild(word);
    }
    return wordle;
}

function gen_page(no_wordles, attempts) {
    var gamediv = document.getElementById("game");

    for (q=0; q<no_wordles; q++) {
        var wordle = create_wordle(attempts);
        gamediv.appendChild(wordle);
    }
}

function clear_page() {
    gamediv = document.getElementById("game");

    for (n=gamediv.children.length; n>0; n--) {
        gamediv.children[n-1].remove();
    }
}