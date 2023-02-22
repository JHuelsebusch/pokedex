function init() {
    startScreen();
}

function startScreen() {
    let startScreen = document.getElementById('startScreen');
    startScreen.innerHTML = `
        <span><h2>Choose your Team!</h2></span>
        <div class="startTeam" id="startTeam"></div>
        <button>Show Pokedex</button>
        <div class="content"></div>`
    let team = document.getElementById('startTeam')
    for (let i = 1; i <= 3; i++) {
        team.innerHTML += `<img src="./img/team-${i}.jpg" onclick='choseTeam(${i})'>`
    }
}

function choseTeam(n) {
    document.getElementById('navTeam').innerHTML = `<img src="./img/team-${n}.jpg"> `
}

function showPokedex() {
    let startScreen = document.getElementById('startScreen');
    startScreen.innerHTML = `<div class="content"></div>`
}