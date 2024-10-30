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
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.innerHTML = "Dynatasker";

    header.appendChild(title);
    document.body.appendChild(header);
}

function createDOMCreateTask(){
    const createTaskContainer = document.createElement('section');
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

    document.body.appendChild(createTaskContainer);
}

function createTaskCancel(){
    console.log('Annulation de la saisie!');
    document.getElementById('inputTaskTitle').value = '';
    document.getElementById('inputTaskDate').value = '';
    document.getElementById('inputTaskDescription').value = '';
}

function createDOMListTask(){
    const listTaskContainer = document.createElement('section');
    const listTaskHeader = document.createElement('header');
    listTaskHeader.innerHTML = "N° | Titre | Date d\'échéance | statut";
    const listTask = document.createElement('ul');

    for(let i=0; i<taches.length; i++){
        const listItem = document.createElement('li');
        const listItemInfo = document.createElement('p');
        listItemInfo.setAttribute('class','collapsible');
        listItemInfo.innerHTML = i+1;
        const listItemDescription = document.createElement('p');
        listItemDescription.setAttribute('class','content');
        listItemDescription.innerHTML = taches[i]["description"];
        listItemDescription.style.display = 'none';

        listItem.addEventListener('click', function(){
            if(listItemDescription.style.display === 'none'){
                listItemDescription.style.display = 'block';
            }else{
                listItemDescription.style.display = 'none';
            }
        });

        listItem.appendChild(listItemInfo);
        listItem.appendChild(listItemDescription);
        listTask.appendChild(listItem);
    };

    listTaskContainer.appendChild(listTaskHeader);
    listTaskContainer.appendChild(listTask);
    document.body.appendChild(listTaskContainer);
}

// Lancement de l'application
app();