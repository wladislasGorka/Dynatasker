let taches; // Tableau des taches construit à partir du fichier json
let currentTaskDisplay = ""; // tache dont la description est visible
let currentFilter = "Toutes"; // filtre en cours d'utilisation pour l'affichage des tâches
let sortByDateFromNew = true; // Sens du tri par date

// Récupération des informations dans le .json pour créer le tableau des taches
async function monJSONParser(url) {
  try {
    const reponse = await fetch(url);
    //console.log(reponse);

    if (!reponse.ok) throw new Error("Le fichier JSON n'a pu être trouvé");
    taches = await reponse.json();
    console.log(taches);
  } catch (error) {
    console.log(error);
  }
}

async function app() {
  // Récupération des taches avant manipuler le DOM
  await monJSONParser("task.json");
  createDOMHeader();
  createDOMUserInterface();
  printListTask(currentFilter);
}

function createDOMHeader() {
  const header = document.getElementById("header");
  const title = document.createElement("img");
  title.src = "logoElargi.png";
  title.setAttribute("alt", "Dynatask");
  title.style.width = "100%";

  header.appendChild(title);
}

function createDOMUserInterface() {
  const container = document.getElementById("interfaceContainer");
  // Bouton  pour ouvrir le modal de création
  container.innerHTML = ``;
  const createTask = document.createElement("button");
  createTask.setAttribute("id", "btnCreateTask");
  createTask.setAttribute("type", "button");
  createTask.innerHTML = `Ajouter`;
  createTask.setAttribute("onclick", "modalCreateTask()");

  const btnContainer = document.createElement("div");
  btnContainer.setAttribute("id", "interfaceBtnContainer");
  const buttons = ["Toutes", "Actives", "Closes"];
  for (let i = 0; i < buttons.length; i++) {
    const btn = document.createElement("button");
    btn.setAttribute("id", "interfaceBtn" + buttons[i]);
    btn.setAttribute("type", "button");
    btn.innerHTML = buttons[i];
    btn.setAttribute("onclick", `printListTask("${buttons[i]}")`);

    btnContainer.appendChild(btn);
  }

  container.appendChild(createTask);
  container.appendChild(btnContainer);
}

function addTask(title, date, description) {
  taches.push({
    title: title,
    description: description,
    date: date,
    statut: "Active",
  });
  //console.log(taches);
  createDOMListTask();
}
function addTaskCancel() {
  console.log("Annulation de la saisie!");
  document.getElementById("inputTaskTitle").value = "";
  document.getElementById("inputTaskDate").value = "";
  document.getElementById("inputTaskDescription").value = "";
}

// Remplissage du tableau des Tâches.
function createDOMListTask() {
  const tableBody = document.getElementById("tableTaskList");
  tableBody.innerHTML = "";
  for (let i = 0; i < taches.length; i++) {
    addRowTaskInfo(
      i,
      i,
      taches[i]["title"],
      taches[i]["date"],
      taches[i]["statut"]
    );
    addRowTaskDescription(i, taches[i]["description"]);
  }
}
// Remplissage du tableau des Tâches selon un filtre.
function createListTask(filter) {
  const tableBody = document.getElementById("tableTaskList");
  tableBody.innerHTML = "";
  let index = 0;
  for (let i = 0; i < taches.length; i++) {
    if (taches[i]["statut"] === filter) {
      addRowTaskInfo(
        i,
        index,
        taches[i]["title"],
        taches[i]["date"],
        taches[i]["statut"]
      );
      addRowTaskDescription(index, taches[i]["description"]);
      index++;
    }
  }
}
function addRowTaskInfo(i, index, titre, date, statut) {
  const tableBody = document.getElementById("tableTaskList");
  const row = document.createElement("tr");
  row.setAttribute("class", "collapse");
  row.setAttribute("onclick", `toggleHiddenContent('content${index}')`);
  const th = document.createElement("th");
  th.innerHTML = index + 1; //+1 pour que l'affichage commence à N°1
  const td1 = document.createElement("td");
  td1.innerHTML = titre;
  const td2 = document.createElement("td");
  td2.innerHTML = FormatDate(date);
  const td3 = document.createElement("td");
  td3.innerHTML = statut;
  const td4 = document.createElement("td");
  td4.style.width = "30px";
  const btnComplete = document.createElement("button");
  btnComplete.setAttribute("type", "button");
  btnComplete.setAttribute("class", "buttonIcon");
  btnComplete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#1c2933" d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;
  btnComplete.setAttribute(
    "onclick",
    `event.stopPropagation(); completeTask(${i})`
  );
  const td5 = document.createElement("td");
  td5.style.width = "30px";
  const btnModif = document.createElement("button");
  btnModif.setAttribute("type", "button");
  btnModif.setAttribute("class", "buttonIcon");
  btnModif.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#1c2933" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>`;
  btnModif.setAttribute(
    "onclick",
    `event.stopPropagation(); modalUpdateTask(${i})`
  );
  const td6 = document.createElement("td");
  td6.style.width = "30px";
  const btnSuppr = document.createElement("button");
  btnSuppr.setAttribute("type", "button");
  btnSuppr.setAttribute("class", "buttonIcon");
  btnSuppr.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#1c2933" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`;
  btnSuppr.setAttribute("onclick", `event.stopPropagation(); supprTask(${i})`);

  if (taches[i]["statut"] !== "Close") {
    td4.appendChild(btnComplete);
  }
  td5.appendChild(btnModif);
  td6.appendChild(btnSuppr);
  row.appendChild(th);
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);
  row.appendChild(td4);
  row.appendChild(td5);
  row.appendChild(td6);
  tableBody.appendChild(row);
}
function addRowTaskDescription(index, description) {
  const tableBody = document.getElementById("tableTaskList");
  const row = document.createElement("tr");
  row.setAttribute("id", `content${index}`);
  row.setAttribute("class", "content hidden");
  const th = document.createElement("th");
  const td = document.createElement("td");
  td.setAttribute("colspan", "5");
  td.innerHTML = description;

  row.appendChild(th);
  row.appendChild(td);
  tableBody.appendChild(row);
}

function printListTask(filter) {
  currentFilter = filter;
  if (filter === "Toutes") {
    createDOMListTask();
    return console.log("Affiche les Tâches de statut: Toutes");
  }
  if (filter === "Actives") {
    createListTask("Active");
    return console.log("Affiche les Tâches de statut: Actives");
  }
  if (filter === "Closes") {
    createListTask("Close");
    return console.log("Affiche les Tâches de statut: Closes");
  }
  return console.log("Le filtre ne correspond à aucun statut.");
}

// affiche ou cache la description de la tache au click sur la tache.
function toggleHiddenContent(id) {
  // Récupération de l'élément <tr> contenant la description de la tache
  const content = document.getElementById(id);
  // Si une description est déjà ouverte, on la ferme
  if (currentTaskDisplay !== "" && currentTaskDisplay !== id) {
    document.getElementById(currentTaskDisplay).classList.toggle("hidden");
  }
  // On ajoute ou retire la classe 'hidden' sur la tache cliquée
  content.classList.toggle("hidden");
  if (content.classList.contains("hidden")) {
    currentTaskDisplay = "";
  } else {
    currentTaskDisplay = id;
  }
}
// Change le format de la date 2024-10-03 => 03/10/2024
function FormatDate(date) {
  const newDate = date.split("-").reverse().join("/");
  return newDate;
}
// Change le format de la date 03/10/2024 => 2024-10-03
function FormatDateTiret(date) {
  const newDate = date.split("/").reverse().join("-");
  return newDate;
}

function modalCreateTask() {
  console.log("creation d'une tache ");
  const modal = document.getElementById("modalCreateTask");
  if (modal === null) {
    createModal("Create");
    openModalCreateTask();
  } else {
    openModalCreateTask();
  }
}
function modalUpdateTask(index) {
  console.log("modifier la tache " + index);
  const modal = document.getElementById("modalUpdateTask");
  if (modal === null) {
    createModal("Update");
    openModalUpdateTask(index);
  } else {
    openModalUpdateTask(index);
  }
}

function completeTask(index) {
  taches[index]["statut"] = "Close";
  updateJSON(taches);
  printListTask(currentFilter);
}
function supprTask(index) {
  taches.splice(index, 1);
  printListTask(currentFilter);
}

// Creation de la fenetre modal contenant le formulaire d'ajout ou suppression de tache
// action = "Create" || "Update"
function createModal(action) {
  console.log("creation modal");
  const modal = document.createElement("section");
  modal.setAttribute("id", "modal" + action + "Task");
  modal.style.display = "none";

  const header = document.createElement("h1");
  action === "Create"
    ? (header.innerHTML = "Création de Tâche:")
    : (header.innerHTML = "Modification de Tâche:");

  //Formulaire pour la création/modification d'une tâche
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("id", "form" + action + "Task");
  form.setAttribute("name", "form" + action + "Task");

  createInput(form, action, "Titre", "text", "Titre");
  createInput(form, action, "Date", "date", "Date");
  createInput(form, action, "Description", "textarea", "Description");

  // Bouton de validation du form
  const formSubmit = document.createElement("input");
  formSubmit.setAttribute("type", "submit");
  formSubmit.setAttribute("value", "Valider");
  formSubmit.setAttribute("id", "form" + action + "Task");
  // Bouton d'annulation du form
  const formCancel = document.createElement("button");
  formCancel.setAttribute("type", "button");
  formCancel.innerHTML = "Annuler";
  formCancel.setAttribute("onclick", 'closeModal("' + action + '")');

  form.appendChild(formSubmit);
  form.appendChild(formCancel);
  modal.appendChild(header);
  modal.appendChild(form);
  document.body.appendChild(modal);
}
function createInput(form, action, data, type, placeholder) {
  const label = document.createElement("label");
  label.setAttribute("for", "input" + action + data);
  data === "Date"
    ? (label.innerHTML = "Date d'échéance")
    : (label.innerHTML = data);

  let input;
  type === "textarea"
    ? (input = document.createElement("textarea"))
    : (input = document.createElement("input"));
  type === "date"
    ? input.setAttribute("type", "date")
    : input.setAttribute("type", "text");
  input.setAttribute("id", "input" + action + data);
  input.setAttribute("placeholder", placeholder);

  form.appendChild(label);
  form.appendChild(input);
}

function openModalCreateTask() {
  console.log("Ouverture du modal");

  document.getElementById("formCreateTask").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      const titre = document.getElementById("inputCreateTitre").value;
      const date = document.getElementById("inputCreateDate").value;
      const description = document.getElementById(
        "inputCreateDescription"
      ).value;

      addTask(titre, date, description);
      sortByDate(taches);
      updateJSON(taches);

      printListTask(currentFilter);
      closeModal("Create");
    },
    { once: true }
  );

  document.getElementById("modalCreateTask").style.display = "block";
}
function openModalUpdateTask(index) {
  console.log("Ouverture du modal");
  const titre = document.getElementById("inputUpdateTitre");
  titre.value = taches[index]["title"];
  const date = document.getElementById("inputUpdateDate");
  date.value = taches[index]["date"];
  const description = document.getElementById("inputUpdateDescription");
  description.innerHTML = taches[index]["description"];

  document.getElementById("formUpdateTask").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      taches[index]["title"] = titre.value;
      taches[index]["date"] = date.value;
      taches[index]["description"] = description.value;
      updateJSON(taches);

      printListTask(currentFilter);
      closeModal("Update");
    },
    { once: true }
  );

  document.getElementById("modalUpdateTask").style.display = "block";
}
function closeModal(action) {
  console.log("Fermeture du modal");
  document.getElementById("modal" + action + "Task").style.display = "none";
}

// Tri du tableau
function sortByDate(array, fromNew = true) {
  for (let i = 1; i < array.length; i++) {
    for (let j = array.length - 1; j >= i; j--) {
      if (
        (fromNew && array[j - 1]["date"] > array[j]["date"]) ||
        (!fromNew && array[j - 1]["date"] < array[j]["date"])
      ) {
        swap(array, j, j - 1);
      }
    }
  }
}
function swap(array, index1, index2) {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}

function sortByDateChange() {
  sortByDateFromNew = !sortByDateFromNew;
  sortByDate(taches, sortByDateFromNew);
  printListTask(currentFilter);
}

// fetch
function updateJSON(array) {
  const content = JSON.stringify(array);

  fetch("http://localhost:3000/write-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: content,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Lancement de l'application
document.addEventListener("DOMContentLoaded", () => {
  app();
});
