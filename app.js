function start() {
    window.location.href = 'start.html';
    return false;    
}

function enter(ele) {
    if(event.key === 'Enter') {
        document.getElementById('debug-field').innerHTML = "Pressed!";
    }
}

function testingfunc(ele) {
    pardiv = ele.parentElement.parentElement;
    inpfields = pardiv.children;

    // val = ele.value;

    // if (ele.value != "") {
    //     ele.value = "";
    // }

    inpfields[3].children[0].focus();
    // inpfields[2].children[0].value = val;
}