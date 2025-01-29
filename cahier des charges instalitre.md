# Cahier des Charges – Instalitre

## 1. Introduction
Ce projet consiste à créer une application web nommée **Instalitre**, permettant à des utilisateurs :
- De s’inscrire et se connecter de manière sécurisée (mot de passe haché).
- De publier des images avec une légende, en choisissant si elles sont **publiques** ou **privées**.
- De consulter leurs propres publications et celles, publiques, des autres utilisateurs.

---

## 2. Fonctionnalités

### 2.1 Gestion des utilisateurs
1. **Inscription**  
   - Saisie du nom d’utilisateur et du mot de passe.  
   - Vérification que le nom n’est pas déjà pris.  
   - Hachage du mot de passe avant stockage en base.

2. **Connexion**  
   - Saisie du nom d’utilisateur et du mot de passe.  
   - Vérification du hachage pour authentifier l’utilisateur.  
   - Stockage de l’état de connexion dans la session (Streamlit).

3. **Déconnexion**  
   - Possibilité de se déconnecter et de réinitialiser l’état de la session.

### 2.2 Gestion des publications
1. **Création de publication**  
   - Téléversement d’une image (formats pris en charge : JPG, PNG).  
   - Choix d’une légende (texte).  
   - Sélection d’un mode **Privé** ou **Public**.  
   - Enregistrement de la publication en base (image binaire, légende, info privée/publique).

2. **Affichage des publications**  
   - **Page personnelle** : L’utilisateur voit **toutes** ses propres publications (publiques ou privées).  
   - **Section “Autres utilisateurs”** : L’utilisateur voit **uniquement** les publications publiques des autres.

### 2.3 Sécurité et confidentialité
- Les mots de passe sont **hachés** avec **Passlib** (bcrypt).  
- Les utilisateurs **ne peuvent pas** accéder aux publications privées des autres.  
- Les images sont stockées en binaire dans la base **MongoDB**.

---

## 3. Contraintes techniques

1. **Technologies**  
   - **Langage** : Python  
   - **Framework** : Streamlit pour l’interface utilisateur  
   - **Base de données** : MongoDB (hébergée sur Atlas)  
   - **Sécurité** : Passlib pour le hachage des mots de passe

2. **Hébergement**  
   - Possibilité d’exécuter localement ou sur un service cloud.

3. **Performance**  
   - Téléversement et affichage d’images de taille raisonnable.  
   - Accès rapide aux documents via MongoDB.

---

