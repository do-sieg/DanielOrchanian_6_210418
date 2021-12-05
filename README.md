# Construire une API sécurisée pour une application d'avis gastronomiques (NodeJS)


## Description

L'objectif est de concevoir une interface de programmation (API) permettant de créer et modifier du contenu, le tout de manière sécurisée.


## Contraintes

La partie backend doit être développée avec NodeJS et la base de données faite avec MongoDB. Un frontend (AngularJS) est fourni et ne doit pas être modifié.


## Compétences évaluées

- Implémenter un modèle logique de données conformément à la réglementation
- Stocker des données de manière sécurisée
- Mettre en œuvre des opérations CRUD de manière sécurisée

---

## Installer le projet

Pour installer le projet il est nécessaire d'ouvrir le dossier backend et de lancer la commande `npm install`. Il faut faire pareil avec le dossier frontend.
Vous devez avoir installé **node-sass** à part.

Ensuite, dans le dossier backend, il faut créer un fichier `.env` avec le contenu suivant :
```
PORT=3000
TOKEN_KEY="1sdqsjhs5d4s"
DB_USER="admin-1"
DB_PASSWORD="test-fghjkl"
```

## Lancer l'application backend :

Pour démarrer le serveur, il faut utiliser la commande `npm start` (mode production) ou `npm run dev` (mode développement) à partir du dossier backend.

## Lancer l'application frontend :

Pour démarrer le client, il faut utiliser la commande `npm start` dans le dossier frontend.
