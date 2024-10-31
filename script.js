let taches; // Tableau des taches construit à partir du fichier json
let currentTaskDisplay = ""; // tache dont la description est visible

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
    createDOMHeader();
    createDOMCreateTask();
    createDOMListTask();
}

function createDOMHeader(){
    const header = document.getElementById('header');
    const title = document.createElement('img');
    title.src = 'logoElargi.png';
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
    inputTaskDate.setAttribute('type','date');
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
        const title = document.getElementById("inputTaskTitle").value;
        let date = document.getElementById("inputTaskDate").value;
        date = FormatDate(date);
        const description = document.getElementById("inputTaskDescription").value;
        addTask(title,date,description);
    });
    // Bouton  pour annuler la saisie (champs vidés)
    const formCreateTaskCancel = document.createElement('button');
    formCreateTaskCancel.setAttribute('type','button');
    formCreateTaskCancel.innerHTML = "X";
    formCreateTaskCancel.setAttribute('onclick','addTaskCancel()');

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
function addTaskCancel(){
    console.log('Annulation de la saisie!');
    document.getElementById('inputTaskTitle').value = '';
    document.getElementById('inputTaskDate').value = '';
    document.getElementById('inputTaskDescription').value = '';
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
    btnSuppr.innerHTML = '<img class="icon" src="trash-can.png">';
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
// Change le format de la date 2024-10-03 => 03/10/2024
function FormatDate(date){
    const newDate = date.split('-').reverse().join('/');
    return newDate;
}
// Change le format de la date 03/10/2024 => 2024-10-03
function FormatDateTiret(date){
    const newDate = date.split('/').reverse().join('-');
    return newDate;
}

function modifTask(index){
    console.log('modifier la tache '+index);
    const modal = document.getElementById('modalModifTask');
    if(modal === null){
        createModalModifTask();
        openModalModifTask(index);
    }else{
        openModalModifTask(index);
    }
}
function supprTask(index){
    taches.splice(index,1);
    createDOMListTask();
}

function createModalModifTask(){
    console.log('creation modal');
    const modal = document.createElement('section');
    modal.setAttribute('id','modalModifTask');
    modal.style.display = "none";

    const header = document.createElement('h1');
    header.innerHTML = "Modification de la Tâche:";

    //Formulaire pour la création d'une tâche
    const formModifTask = document.createElement('form');
    formModifTask.setAttribute('method','post');
    formModifTask.setAttribute('id','formModifTask');
    formModifTask.setAttribute('name','formModifTask');

    const inputTaskTitle = document.createElement('input');
    inputTaskTitle.setAttribute('id','inputModifTaskTitle');
    inputTaskTitle.setAttribute('type','text');

    const inputTaskDate = document.createElement('input');
    inputTaskDate.setAttribute('id','inputModifTaskDate');
    inputTaskDate.setAttribute('type','date');

    const inputTaskDescription = document.createElement('textarea');
    inputTaskDescription.setAttribute('id','inputModifTaskDescription');
    inputTaskDescription.setAttribute('type','text');

    // Bouton de validation du form
    const formModifTaskSubmit = document.createElement('input');
    formModifTaskSubmit.setAttribute('type','submit');
    formModifTaskSubmit.setAttribute('value','Valider');

    const btnCancelModif = document.createElement('button');
    btnCancelModif.setAttribute('type','button');
    btnCancelModif.innerHTML = "Annuler";
    btnCancelModif.setAttribute('onclick','closeModalModif()');

    modal.appendChild(header);
    formModifTask.appendChild(inputTaskTitle);
    formModifTask.appendChild(inputTaskDate);
    formModifTask.appendChild(inputTaskDescription);
    formModifTask.appendChild(formModifTaskSubmit);
    modal.appendChild(formModifTask);
    modal.appendChild(btnCancelModif);
    document.body.appendChild(modal);
}

function openModalModifTask(index){
    console.log('Ouverture du modal');
    document.getElementById('inputModifTaskTitle').value = taches[index]["title"];
    document.getElementById('inputModifTaskDate').value = FormatDateTiret(taches[index]["date"]);
    document.getElementById('inputModifTaskDescription').innerHTML = taches[index]["description"];

    document.getElementById('formModifTask').addEventListener('submit', function(event){
        event.preventDefault();
        //console.log("input "+document.getElementById("inputModifTaskTitle").value);
        taches[index]["title"] = document.getElementById("inputModifTaskTitle").value;
        taches[index]["date"] = FormatDate(document.getElementById("inputModifTaskDate").value);
        taches[index]["description"] = document.getElementById("inputModifTaskDescription").value;

        createDOMListTask();
        closeModalModif();
    }, {once:true});

    document.getElementById('modalModifTask').style.display = "block";
}

function closeModalModif(){
    console.log('Fermeture du modal');
    document.getElementById('modalModifTask').style.display = "none";
}

// Lancement de l'application
document.addEventListener('DOMContentLoaded', () => {
    app();
})