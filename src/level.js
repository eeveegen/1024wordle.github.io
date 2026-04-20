// Defaults and config
const lvl_atts = [6, 7, 9, 13, 21, 37, 70, 100, 64, 128, 1029];

var level = 0;
var no_wordles = 1;
var attempts = 6;
var solutions = [];
var active_wordles = [];
var active_field = 0;
fetch("./valid-wordle-solutions.txt")
        .then((res) => res.text())
        .then((text) => text.trim())
        .then((text) => {
            text = text.replace(/\r/g, "");
            text = text.split("\n");
            idx = Math.floor(Math.random() * text.length);
            solutions.push(text[idx]);
        })

async function update_level_params() {
    level++;
    if (level == 1) {
        no_wordles = 1;
    } else {
        no_wordles = no_wordles*2;
    }
    attempts = lvl_atts[level-1];
    solutions = await generate_solutions(no_wordles);
    active_field = 0;
    active_wordles = [];
    for (i=0; i<no_wordles; i++) {
        active_wordles.push(true);
    }
}

async function generate_solutions(no) {
    // first: get text
    res = await fetch("./valid-wordle-solutions.txt");
    text = await res.text();
    text = text.trim();
    text = text.replace(/\r/g, "");
    text = text.split("\n");

    solutions = [];
    while (solutions.length < no) {
        var idx = Math.floor(Math.random() * (text.length - solutions.length));
        var newsol = text[idx];

        while(solutions.includes(newsol)) {
            idx = idx + 1;
            newsol = text[idx];
        }
        // debugging info, to be removed later (!!!)
        console.log(newsol);
        solutions.push(newsol);
    }

    return solutions;
}

async function update_level() {
    await update_level_params();
    clear_page();
    gen_page(no_wordles, attempts);
    lhead = document.getElementById("level");
    lhead.innerHTML = "Level " + level.toString();
}