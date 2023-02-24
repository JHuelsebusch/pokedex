let loadedPokemon = [];
let teamId; //Team Valor, Mystic or Instinct
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
        <span><h2>or</h2></span>
        <button class="btn" onclick="showPokedex()"><h2>Show Pokedex</h2></button>`
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
    <div class="pokeCard ${firstType}" onclick="showDetails(${id})">
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

function showDetails(id) {
    pokemon = loadedPokemon[id - 1];
    showDetailCard(pokemon)
    generateDetaisType(pokemon);
}

function showDetailCard(pokemon) {
    let height = (((parseFloat(pokemon['height'])) * 0.1).toFixed(1)).replace(".", ",");
    let weight = (((parseFloat(pokemon['weight'])) * 0.1).toFixed(1)).replace(".", ",");
    document.getElementById('pokeDetails').innerHTML = generateDetails(pokemon, height, weight);
}

function generateDetails(pokemon, height, weight) {
    return `
                <div class="detailImg"><img id='detailImg' src="${pokemon['sprites']['other']['official-artwork']['front_default']}"></div>
                <div class="detailHead">
                    <span># ${pokemon['id']}</span>
                    <h2>${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h2>
                </div>
                <div class="detailType" id="detailType">
                </div>
                <div class="detailActions">
                    <div class="detailAct" id="shinyBtn" onclick="showShiny(${pokemon['id']})">Show Shiny</div>
                    <div class="detailAct" onclick="addTeam(${pokemon['id']})">Add to your Team</div>
                </div>
                <div class="detailAbout">
                    <span>Height: ${height} m</span>
                    <span>Weight: ${weight} kg</span>
                    <span id="abilities">Abilities:</span>
                    <span>Base Experience: ${pokemon['base_experience']}</span>
                </div>`

}

function generateDetaisType(pokemon) {
    let types = pokemon['types'];
    for (let t = 0; t < types.length; t++) {
        let type = types[t]['type']['name'];
        document.getElementById('detailType').innerHTML += `<div class="${type}Icon detailIcon"><img src="./img/icons/${type}.svg"> ${type.charAt(0).toUpperCase() + type.slice(1)}</div>`
    }
}

function showShiny(id) {
    let pokemon = loadedPokemon[id - 1];
    let imgClass = document.getElementById('shinyBtn').classList;
    if (imgClass.contains('shiny')) {
        document.getElementById('detailImg').src = `${pokemon['sprites']['other']['official-artwork']['front_default']}`;
        imgClass.remove('shiny');
    } else {
        document.getElementById('detailImg').src = `${pokemon['sprites']['other']['official-artwork']['front_shiny']}`;
        imgClass.add('shiny');
    }


}