# Cahier des Charges Simplifié - Instalitre

## 1. Introduction

Le projet Instalitre consiste à concevoir et développer une application web permettant aux utilisateurs de publier, consulter et gérer des images associées à leurs comptes. L'application doit être intuitive, sécurisée, et fournir une gestion efficace des données et des interactions entre utilisateurs.

---

## 2. Objectifs

### 2.1 Gestion des utilisateurs
- **Création et gestion de comptes** :
  - Inscription et connexion des utilisateurs.
  - Authentification sécurisée (hachage des mots de passe, SSO avec Google).
  - Récupération de mot de passe en cas d'oubli.

- **Profils utilisateurs** :
  - Gestion des informations personnelles (nom d’utilisateur, email, avatar).
  - Visualisation des publications associées au compte.

### 2.2 Dépôt et gestion des publications
- **Ajout de publications** :
  - Téléversement d’images (formats : JPG, PNG).
  - Ajout d’une légende pour chaque publication.

- **Gestion des publications** :
  - Visualisation des publications par utilisateur.
  - Suppression ou modification des légendes et images.
  - Filtrage des publications par date.

### 2.3 Sécurité et confidentialité
- Sécurisation des données via une base MongoDB (hash des mots de passe, stockage des images en binaire).
- Autorisation et restrictions : chaque utilisateur peut uniquement modifier ou supprimer ses propres publications.

---

## 3. Fonctionnalités techniques

### 3.1 Authentification
- Authentification classique via email/mot de passe.
- Connexion via Google (SSO).

### 3.2 Interface utilisateur
- Interface intuitive et responsive avec Streamlit.
- Galerie de publications triées par date.
- Interface simple pour ajouter/supprimer des publications.

### 3.3 Base de données
- Utilisation de MongoDB pour :
  - Stocker les comptes utilisateurs.
  - Associer chaque publication à un utilisateur unique.
  - Gérer les données des publications (images et légendes).

---

## 4. Contraintes techniques

- **Technologies** :
  - Backend : Python avec Streamlit.
  - Base de données : MongoDB.
  - Authentification : OAuth 2.0 pour SSO Google et Passlib pour les mots de passe.

- **Hébergement** :
  - Application locale ou hébergée via un service cloud (ex. Heroku, AWS).

- **Performance** :
  - Temps de réponse acceptable pour le téléversement et l’affichage des images.
  - Gestion efficace des images (compression ou adaptation si nécessaire).

---

## 5. Évolutions futures (non obligatoires)

- Ajout de fonctionnalités sociales : likes, commentaires, notifications.
- Création d’une version mobile dédiée.
- Support pour des formats vidéo ou GIF.
