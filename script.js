let loadedPokemon = [];
let startId = 1;
let endId = 20;

function init() {
    // startScreen();
    showPokedex();
}

function startScreen() {
    let startScreen = document.getElementById('startScreen');
    startScreen.innerHTML = `
        <span><h2>Choose your Team!</h2></span>
        <div class="startTeam" id="startTeam"></div>
        <button>Show Pokedex</button>`
    let team = document.getElementById('startTeam')
    for (let i = 1; i <= 3; i++) {
        team.innerHTML += `<img src="./img/team-${i}.jpg" onclick='choseTeam(${i})'>`
    }
}

function choseTeam(n) {
    document.getElementById('navTeam').innerHTML = `<img src="./img/team-${n}.jpg"> `
    showPokedex();
}

function showPokedex() {
    document.getElementById('startScreen').classList.add('hide');
    document.getElementById('pokedex').classList.remove('hide');
    startId = 1;
    endId = 20;
    loadPokemon();
}

async function loadPokemon() {
    document.getElementById('loader').classList.remove('hide');
    for (let p = startId; p < endId; p++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${p}/`
        let response = await fetch(url);
        let pokemon = await response.json();
        loadedPokemon.push(pokemon);
        await showPokemon(pokemon);
    }
    document.getElementById('loader').classList.add('hide');
}

function showPokemon(pokemon) {
    let id = pokemon['id'];
    let name = pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1);
    let imgUrl = pokemon['sprites']['other']['official-artwork']['front_default'];
    let firstType = pokemon['types'][0]['type']['name'];
    document.getElementById('content').innerHTML += generatePokeCard(id, name, imgUrl, firstType);
    console.log(name, id);

    let types = pokemon['types'];
    for (let t = 0; t < types.length; t++) {
        let type = types[t]['type']['name'];
        document.getElementById('typeIcons' + id).innerHTML += generateTypeIcons(type);
    }
}

function generatePokeCard(id, name, imgUrl, firstType) {
    return `
    <div class="pokeCard ${firstType}">
        <div>
            <span># ${id}</span>
            <h3>${name}</h3>
            <div class="typeIcons" id='typeIcons${id}'>
           </div>
       </div>
       <div class="pokeImg" id="pokeImg">
          <img src="${imgUrl}">
        </div>
    </div>`
}

function generateTypeIcons(type) {
    return `
    <div class="typeIcon ${type}Icon">
        <img src="./img/icons/${type}.svg">
    </div>
    `
}

async function loadNewPokemon() {
    let content = document.getElementById('content');
    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
        content.classList.add('stopScroll');
        startId = endId;
        endId = endId + 20;
        await loadPokemon();
        content.classList.remove('stopScroll');
    }
}