let loadedPokemon = [];
let teamId; //Team Valor, Mystic or Instinct
let startId;
let endId;
let team = [];

function init() {
    startScreen();
    // showPokedex();
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
    document.getElementById('navTeam').innerHTML = `<img src="./img/team-${n}.jpg"><div id="teamAmount"></div> `
    teamId = n;
    showPokedex();
}

function showPokedex() {
    document.getElementById('startScreen').classList.add('hide');
    document.getElementById('pokedex').classList.remove('hide');
    startId = 1;
    endId = 50;
    loadPokemon();
    renderTeam();
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
    document.getElementById('content').classList.add('hidePokedex');
    document.getElementById('pokeTeam').classList.remove('dOn');
    showDetailCard(pokemon)
    generateDetaisType(pokemon);
    generateAbilities(pokemon);
    generateStats(pokemon);
    generateMoves(pokemon);
}

function showDetailCard(pokemon) {
    document.getElementById('pokeDetails').classList.add('dOn');
    let height = (((parseFloat(pokemon['height'])) * 0.1).toFixed(1)).replace(".", ",");
    let weight = (((parseFloat(pokemon['weight'])) * 0.1).toFixed(1)).replace(".", ",");
    document.getElementById('pokeDetails').innerHTML = generateDetails(pokemon, height, weight);
}

function generateDetails(pokemon, height, weight) {
    return `    <div class="closeIcon" onclick="closeDetails()">
                <img src="./img/icons/x-mark-48.png" alt="" >    
                </div>
                <span class="subHead"><h2>Details</h2></span>
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
                <h4>About</h4>
                <div class="detailAbout">
                    <span>Height: ${height} m</span>
                    <span>Weight: ${weight} kg</span>
                    <span id="abilities">Abilities:</span>
                    <span>Base Experience: ${pokemon['base_experience']}</span>
                </div>
                <h4>Base Stats</h4>
                <div class="detailStats" id="detailStats">
                </div>
                <h4>Moves</h4>
                <div class="detailMoves" id="detailMoves">
                </div>`


}

function generateDetaisType(pokemon) {
    let types = pokemon['types'];
    for (let t = 0; t < types.length; t++) {
        let type = types[t]['type']['name'];
        document.getElementById('detailType').innerHTML += `<div class="${type}Icon detailIcon"><img src="./img/icons/${type}.svg"> ${type.charAt(0).toUpperCase() + type.slice(1)}</div>`
    }
}

function generateAbilities(pokemon) {
    for (let a = 0; a < pokemon['abilities'].length; a++) {
        let ability = pokemon['abilities'][a];
        if (a < pokemon['abilities'].length - 1) {
            document.getElementById('abilities').innerHTML += createAbility(ability);
        } else {
            document.getElementById('abilities').innerHTML += createLastAbility(ability);
        }
    }
}

function createAbility(ability) {
    return ` ${ability['ability']['name'].charAt(0).toUpperCase() + ability['ability']['name'].slice(1)},`
}

function createLastAbility(ability) {
    return ` ${ability['ability']['name'].charAt(0).toUpperCase() + ability['ability']['name'].slice(1)}`
}

function generateStats(pokemon) {
    for (let s = 0; s < pokemon['stats'].length; s++) {
        let stat = pokemon['stats'][s];
        document.getElementById('detailStats').innerHTML += createStats(stat);
    }
}

function createStats(stat) {
    return `<div class="stats">
    <span>${stat['stat']['name']}</span>
    <div class="statsProgressBar" id="statsProgressBar"> 
    <div class="progressBar" style="width:${stat['base_stat']/2.5}%;">${stat['base_stat']}</div></div>
</div>`
}

function generateMoves(pokemon) {
    for (let m = 0; m < pokemon['moves'].length; m++) {
        let move = pokemon['moves'][m];
        if (m < pokemon['moves'].length - 1) {
            document.getElementById('detailMoves').innerHTML += createMove(move);
        } else {
            document.getElementById('detailMoves').innerHTML += createLastMove(move);
        }
    }
}

function createMove(move) {
    return ` <span>${move['move']['name']},</span>`
}

function createLastMove(move) {
    return ` <span>${move['move']['name']}</span>`
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

function addTeam(id) {
    if (team.length < 6) {
        let pokemon = loadedPokemon[id - 1];
        team.push(pokemon);
        renderTeamAmount();
    }
    renderTeam();
}

function renderTeam() {
    let pokeTeam = document.getElementById('pokeTeam');
    pokeTeam.innerHTML = '<span class="subHead"><h2>Your Team</h2></span>';
    for (let i = 0; i < 6; i++) {
        let pokemon = team[i];
        if (pokemon) {
            pokeTeam.innerHTML += `<div class="teamImg" onclick="openTeamRemove(${i})"><img class="" src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
            <div class="teamRemove" id="teamRemove${i}" onclick="removeFromTeam(${i})"><img src="./img/icons/remove_48.svg"></div></div>`
        } else {
            pokeTeam.innerHTML += `<div class="teamImg"><img class="teamId-${teamId}" src="./img/pokeball-icon.jpg"></div>`

        }
    }
}

function closeDetails() {
    document.getElementById('pokeDetails').classList.remove('dOn');
    document.getElementById(`content`).classList.remove('hidePokedex');
}

function showTeam() {
    let pokeTeamClass = document.getElementById(`pokeTeam`).classList;
    let pokedexClass = document.getElementById(`content`).classList;
    if (pokeTeamClass.contains('dOn')) {
        pokeTeamClass.remove('dOn');
        pokedexClass.remove('hidePokedex');
    } else {
        pokeTeamClass.add('dOn');
        pokedexClass.add('hidePokedex');
        document.getElementById('pokeDetails').classList.remove('dOn');
    }
}

function openTeamRemove(i) {
    let removeClass = document.getElementById(`teamRemove${i}`).classList;
    if (removeClass.contains('dOn')) {
        removeClass.remove('dOn');
        pokeId = team[i]['id'];
        showDetails(pokeId);
    } else {
        removeClass.add('dOn');

    }
}

function resetTeamRemove() {
    for (i = 0; i < team.length; i++) {
        let removeClass = document.getElementById(`teamRemove${i}`).classList;
        if (removeClass.contains('dOn')) {
            removeClass.remove('dOn');
        }
    }
}

function removeFromTeam(i) {
    resetTeamRemove();
    team.splice(i, 1);
    renderTeamAmount();
    renderTeam();
}

function renderTeamAmount() {
    let teamAmount = team.length;
    if (team.length == 0) {
        document.getElementById(`teamAmount`).innerHTML = ``;
        document.getElementById('teamAmount').classList.remove('teamAmount');
    } else {
        document.getElementById(`teamAmount`).innerHTML = `${teamAmount}`;
        document.getElementById('teamAmount').classList.add('teamAmount');
    }

}

function searchPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    let content = document.getElementById('content');
    content.innerHTML = ``;
    for (let s = 0; s < loadedPokemon.length; s++) {
        pokemon = loadedPokemon[s];
        if (pokemon['name'].includes(search)) {
            showPokemon(pokemon);
        }

    }
}