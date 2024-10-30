// Tableau des taches construit à partir du fichier json
let taches;

// Récupération des informations dans le .json pour créer le tableau des taches
async function monJSONParser(url) {
    try{
        const reponse = await fetch(url);
        //console.log(reponse);

        if(!reponse.ok) throw new Error("Le fichier JSON n'a pu être trouvé");
        taches = await reponse.json();
        console.log(taches);
    }catch(error){
        console.log(error);
    }
}

async function app(){
    // Récupération des taches avant manipuler le DOM
    await monJSONParser("task.json");
    createDOMApp();
}

function createDOMApp(){
    createDOMHeader();
    createDOMCreateTask();
    // createDOMUpdateTask();
    // createDOMListTask();
}
function createDOMHeader(){
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.innerHTML = "Dynatasker";

    header.appendChild(title);
    document.body.appendChild(header);
}
function createDOMCreateTask(){
    const createTaskContainer = document.createElement('section');
    const title = document.createElement('h2');
}

// Lancement de l'application
app();