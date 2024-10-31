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
    // createDOMUpdateTask(task);
    createDOMListTask();
}
function createDOMHeader(){
    const header = document.getElementById('header');
    const title = document.createElement('img');
    title.src = 'logo.png';
    title.style.width = '100%';

    header.appendChild(title);
}

function createDOMCreateTask(){
    const createTaskContainer = document.getElementById('createTaskContainer');
    const title = document.createElement('h2');
    title.innerHTML = "Création de Tâche";

    //Formulaire pour la création d'une tâche
    const formCreateTask = document.createElement('form');
    formCreateTask.setAttribute('method','post');
    formCreateTask.setAttribute('name','formCreateTask');

    const inputTaskTitle = document.createElement('input');
    inputTaskTitle.setAttribute('id','inputTaskTitle');
    inputTaskTitle.setAttribute('type','text');
    inputTaskTitle.setAttribute('placeholder','Titre');

    const inputTaskDate = document.createElement('input');
    inputTaskDate.setAttribute('id','inputTaskDate');
    inputTaskDate.setAttribute('type','text');
    inputTaskDate.setAttribute('placeholder','jj/mm/aaaa');

    const inputTaskDescription = document.createElement('textarea');
    inputTaskDescription.setAttribute('id','inputTaskDescription');
    inputTaskDescription.setAttribute('type','text');
    inputTaskDescription.setAttribute('placeholder','Description de la tâche...');

    // Bouton de validation du form
    const formCreateTaskSubmit = document.createElement('input');
    formCreateTaskSubmit.setAttribute('type','submit');
    formCreateTaskSubmit.setAttribute('value','Y');
    formCreateTask.addEventListener('submit', function(event){
        event.preventDefault();
        //console.log(document.getElementById("inputTaskTitle").value);
        addTask(document.getElementById("inputTaskTitle").value,document.getElementById("inputTaskDate").value,document.getElementById("inputTaskDescription").value);
    });
    // Bouton  pour annuler la saisie (champs vidés)
    const formCreateTaskCancel = document.createElement('button');
    formCreateTaskCancel.setAttribute('type','button');
    formCreateTaskCancel.innerHTML = "X";
    formCreateTaskCancel.setAttribute('onclick','createTaskCancel()');

    formCreateTask.appendChild(inputTaskTitle);
    formCreateTask.appendChild(inputTaskDate);
    formCreateTask.appendChild(inputTaskDescription);
    formCreateTask.appendChild(formCreateTaskSubmit);
    formCreateTask.appendChild(formCreateTaskCancel);

    createTaskContainer.appendChild(title);
    createTaskContainer.appendChild(formCreateTask);
}
function addTask(title,date,description){
    taches.push({title:title,description:description,date:date,statut:"Active"});
    //console.log(taches);
    createDOMListTask();
}

function createTaskCancel(){
    console.log('Annulation de la saisie!');
    document.getElementById('inputTaskTitle').value = '';
    document.getElementById('inputTaskDate').value = '';
    document.getElementById('inputTaskDescription').value = '';
}
function modifTask(index){
    console.log('modifier la tache '+index);
}
function supprTask(index){
    taches.splice(index,1);
    createDOMListTask();
}

function createDOMListTask(){
    const tableBody = document.getElementById('tableTaskList');
    tableBody.innerHTML = "";
    for(let i=0; i<taches.length; i++){
        addRowTaskInfo(i,taches[i]["title"],taches[i]["date"],taches[i]["statut"]);
        addRowTaskDescription(i,taches[i]["description"]);
    }
}
function addRowTaskInfo(index,titre,date,statut){
    const tableBody = document.getElementById('tableTaskList');
    const row = document.createElement('tr');
    row.setAttribute('class','collapse');
    row.setAttribute('onclick',`toggleHiddenContent('content${index}')`)
    const th = document.createElement('th');
    th.innerHTML = index +1; //+1 pour que l'affichage commence à N°1
    const td1 = document.createElement('td'); 
    td1.innerHTML = titre;
    const td2 = document.createElement('td');
    td2.innerHTML = date;
    const td3 = document.createElement('td');
    td3.innerHTML = statut;
    const td4 = document.createElement('td');
    const btnModif = document.createElement('button');
    btnModif.setAttribute('type','button');
    btnModif.innerHTML = "M";
    btnModif.setAttribute('onclick',`event.stopPropagation(); modifTask(${index})`);
    const td5 = document.createElement('td');
    const btnSuppr = document.createElement('button');
    btnSuppr.setAttribute('type','button');
    btnSuppr.innerHTML = "X";
    btnSuppr.setAttribute('onclick',`event.stopPropagation(); supprTask(${index})`);

    td4.appendChild(btnModif);
    td5.appendChild(btnSuppr);
    row.appendChild(th);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    tableBody.appendChild(row);
}
function addRowTaskDescription(index,description){
    const tableBody = document.getElementById('tableTaskList');
    const row = document.createElement('tr');
    row.setAttribute('id',`content${index}`);
    row.setAttribute('class','content hidden');
    const th = document.createElement('th');
    const td = document.createElement('td'); 
    td.setAttribute('colspan','5');
    td.innerHTML = description;

    row.appendChild(th);
    row.appendChild(td);
    tableBody.appendChild(row);
}
// function printList(statut = "toutes"){
//     //si toutes ou Active ou Terminee
// }

// Lancement de l'application
document.addEventListener('DOMContentLoaded', () => {
    app();
})

let currentTaskDisplay = "";
// affiche ou cache la description de la tache au click sur la tache.
function toggleHiddenContent(id){
    // Récupération de l'élément <tr> contenant la description de la tache
    const content = document.getElementById(id);
    // Si une description est déjà ouverte, on la ferme
    if(currentTaskDisplay !== "" && currentTaskDisplay !== id){
        document.getElementById(currentTaskDisplay).classList.toggle('hidden');
    }
    // On ajoute ou retire la classe 'hidden' sur la tache cliquée
    content.classList.toggle('hidden');
    if(content.classList.contains('hidden')){
        currentTaskDisplay = "";
    }else{
        currentTaskDisplay = id;
    }
}