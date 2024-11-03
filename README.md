# Dynatasker

Projet de Gestionnaire de Tâches avec JavaScript

## Contexte

Projet réalisez dans le cadre de la formation Beweb.

## Objectif Général

> Le but du projet est de concevoir et de développer un gestionnaire de tâches fonctionnel et esthétiquement plaisant si vous en avez le temps.
> Ce projet servira d'évaluation pour le module de Programmation JavaScript.

---

## Fonctionnalités

1. **Création de tâches** avec un titre, une description et une date d'échéance.
2. **Marquer une tâche comme terminée**.
3. **Modifier ou supprimer une tâche**.
4. **Filtrer les tâches** par statut (Actives, Closes).
5. **Trier les tâches** en fonction de leur date d'échéance.

---

## Fonctionnement de l'application

### Serveur et Gestion des Données

L'application utilise un serveur **Node.js** pour manipuler un fichier de données (`task.json`).

Lancement du serveur :

`node serveur.js`

Au lancement de l'application, les données sont récupérées et stockées dans un tableau, ce qui facilite leur manipulation dans le programme.
Chaque modification de tâche (ajout, suppression, modification) met à jour ce fichier JSON.

Exemple de structure de données dans `task.json` :

```json
{
  "title": "Penser à peut-être faire une liste des choses à faire",
  "description": "Prendre quelques minutes (ou heures) pour réfléchir aux tâches importantes... mais pas trop longtemps non plus.",
  "date": "2024-11-05",
  "statut": "Active"
}
```

### Affichage des données

Les tâches sont affichées sous forme de tableau. Chaque ligne contient les informations essentielles de la tâche, tandis que la description complète se révèle en cliquant sur la tâche.

Actions disponibles pour chaque tâche :

1. **Compléter** : Change le statut à "Close" et masque le bouton.
2. **Modifier** : Permet de mettre à jour le titre, la date d'échéance et la description.
3. **Supprimer** : Retire définitivement la tâche de la liste.

### Ajouter et Modifier une tâche

L'ajout et la modification d'une tâche s'effectuent via un bouton "Ajouter" dans la barre d'actions située au-dessus du tableau. L'action ouvre un modal avec un formulaire :

**Formulaire d’ajout** : Vide au lancement, il permet d’ajouter une nouvelle tâche.
**Formulaire de modification** : Pré-rempli avec les informations actuelles de la tâche sélectionnée.

L’utilisateur peut valider (si tous les champs sont remplis) ou annuler l'opération, ce qui ferme le modal.

### Filtrage des tâches

Dans la barre d’action, trois options de filtrage sont proposées :

1. **Toutes** : Affiche toutes les tâches. (Filtrage par défaut)
2. **Actives** : Affiche uniquement les tâches au statut "Active".
3. **Closes** : Affiche uniquement les tâches au statut "Close".

Le tableau des tâches propose également une option de tri chronologique en cliquant sur l'en-tête "Date".

---

**Créé par** : Wladislas GORKA (Apprenant en formation Beweb, 2024)
