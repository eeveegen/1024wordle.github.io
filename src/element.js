function get_idx(elem) {
    parent = elem.parentElement;

    for (i=0; i<parent.children.length; i++) {
        if (parent.children[i].isSameNode(elem)) {
            return i;
        }
    }
}

function get_previous(elem) {
    parent = elem.parentElement;
    idx = get_idx(elem);
    if (idx != 0) {
        idx = idx-1;
    }
    return parent.children[idx];
}

function get_next(elem) {
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

// top alphabet handling

// A = 65
function get_letter(lval) { // given as a single char
    alphabet = document.getElementById("banner");
    idx = lval.toUpperCase().charCodeAt();
    return alphabet.children[idx-65];
}