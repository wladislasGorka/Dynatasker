let taches; // Tableau des taches construit à partir du fichier json
let currentTaskDisplay = ""; // tache dont la description est visible

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
  createDOMListTask();
}

function createDOMHeader() {
  const header = document.getElementById("header");
  const title = document.createElement("img");
  title.src = "logoElargi.png";
  title.style.width = "100%";

  header.appendChild(title);
}

function createDOMUserInterface() {
  const container = document.getElementById("interfaceContainer");
  // Bouton  pour ouvrir le modal de création
  const createTask = document.createElement("button");
  createTask.setAttribute("id", "btnCreateTask");
  createTask.setAttribute("type", "button");
  createTask.innerHTML = "Add";
  createTask.setAttribute("onclick", "modalCreateTask()");

  const btnContainer = document.createElement("interfaceBtnContainer");
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
      taches[i]["title"],
      taches[i]["date"],
      taches[i]["statut"]
    );
    addRowTaskDescription(i, taches[i]["description"]);
  }
}
function addRowTaskInfo(index, titre, date, statut) {
  const tableBody = document.getElementById("tableTaskList");
  const row = document.createElement("tr");
  row.setAttribute("class", "collapse");
  row.setAttribute("onclick", `toggleHiddenContent('content${index}')`);
  const th = document.createElement("th");
  th.innerHTML = index + 1; //+1 pour que l'affichage commence à N°1
  const td1 = document.createElement("td");
  td1.innerHTML = titre;
  const td2 = document.createElement("td");
  td2.innerHTML = date;
  const td3 = document.createElement("td");
  td3.innerHTML = statut;
  const td4 = document.createElement("td");
  const btnModif = document.createElement("button");
  btnModif.setAttribute("type", "button");
  btnModif.innerHTML = "M";
  btnModif.setAttribute(
    "onclick",
    `event.stopPropagation(); modalUpdateTask(${index})`
  );
  const td5 = document.createElement("td");
  const btnSuppr = document.createElement("button");
  btnSuppr.setAttribute("type", "button");
  btnSuppr.innerHTML = '<img class="icon" src="trash-can.png">';
  btnSuppr.setAttribute(
    "onclick",
    `event.stopPropagation(); supprTask(${index})`
  );

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
  if (filter === "Toutes") {
    return console.log("Affiche les Tâches de statut: Toutes");
  }
  if (filter === "Actives") {
    return console.log("Affiche les Tâches de statut: Actives");
  }
  if (filter === "Closes") {
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
function supprTask(index) {
  taches.splice(index, 1);
  createDOMListTask();
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
      let date = document.getElementById("inputCreateDate").value;
      date = FormatDate(date);
      const description = document.getElementById(
        "inputCreateDescription"
      ).value;

      addTask(titre, date, description);
      updateJSON(taches);

      createDOMListTask();
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
  date.value = FormatDateTiret(taches[index]["date"]);
  const description = document.getElementById("inputUpdateDescription");
  description.innerHTML = taches[index]["description"];

  document.getElementById("formUpdateTask").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      taches[index]["title"] = titre.value;
      taches[index]["date"] = FormatDate(date.value);
      taches[index]["description"] = description.value;
      updateJSON(taches);

      createDOMListTask();
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
