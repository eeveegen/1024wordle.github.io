// function generate_site() {
//     window.location.href = './level.html';
//     testpar = document.createElement('p');
//     testparcont = document.createTextNode('Testing testing testing!');
//     document.getElementById("game").appendChild(testparcont);

//     return false;    
// }

function gen_word() {
    var word = document.createElement("div");
    word.classList.add("textfields");
    
    for (i=0; i<5; i++) {
        var letter = document.createElement("INPUT");
        letter.setAttribute("type", "text");
        letter.classList.add("letterbox");
        word.appendChild(letter);
    }

    return word
}

function create_wordle(attempts) {
    var wordle = document.createElement("div");
    wordle.classList.add("wordle");

    // word = gen_word();
    // wordle.appendChild(word);
    var word;

    for (j=0; j<attempts; j++) {
        word = gen_word();
        wordle.appendChild(word);
        // console.log("Did it" + i.toString());
    }

    return wordle;
}

function testing() {
    var wordle = create_wordle(6);
    // var wordle = document.createElement("div");
    // wordle.class = "wordle";
    // wordle.classList.add("wordle");

    testdiv = document.getElementById("blank");
    testdiv.appendChild(wordle);
}

function add_param() {
    testpar = document.createElement('p');
    testparcont = document.createTextNode('Testing testing testing!');
    document.getElementById("blank").appendChild(testparcont); // so this appends just the text?
}

function add_div() {
    var newdiv = document.createElement("div");
    newdiv.innerHTML = "Testing Testing Testing!";

    document.getElementById("blank").appendChild(newdiv);
}

// function add_wordle() {
//     var wordle = document.createElement("div");
//     wordle.class = "wordle";

//     for (i=0; i<attempts; i++) {
//         var word = document.createElement("div");
//         word.class = "textfields";
//         for (j=0; j<5; j++) {
//             var letter = document.createElement("INPUT");
//             letter.setAttribute("type", "text");
//             letter.class = "letterbox";
//             word.appendChild(letter);
//         }
//         wordle.appendChild(word);
//     }


// }

// To-Dos:
// 1) Create a function - using PARAMS! - to add a new wordle to the "game" div.
// 2) Try deleting the whole "game" subdivs contents upon the press of a button
// 3) Test 1) with dynamically changing the things
// 4) implement global initialisation logic and state parameters at the top, then update the "solution correct!" logic 
// path/function to reupdate these, clean the page, and go to the next level
// 5) oh and for fucks sake split these functions across multiple js files, this is getting dirty