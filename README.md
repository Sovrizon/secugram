# 📸 Secugram — Application Web

Ce dépôt contient le code source de l'**application web** pour le projet Sovrizon. Secugram est une application web simplifiée de partage d'images.  
Elle permet à des utilisateurs inscrits de publier des images avec descriptions. Les images sont **chiffrées côté serveur** et protégées par un système de clés sécurisé.

---

## 🧱 Technologies

- **Frontend** : React (Vite)
- **Backend** : FastAPI
- **Base de données** : MongoDB
- **Chiffrement** : interaction avec un tiers de confiance pour la gestion des clés

---

## ✨ Fonctionnalités

- 📝 Inscription et connexion
- 🖼️ Publication d'images avec description
- 🔐 Communication avec [l'extension Chrome](https://github.com/Sovrizon/extension) pour le chiffrement et déchiffrement
- ✅ Stockage des métadonnées associées
- 🔗 API sécurisée pour accès contrôlé

---

## 🚀 Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/Sovrizon/secugram.git
cd secugram
```

### 2. Configuration de MongoDB locale

#### Prérequis
- [Node.js](https://nodejs.org/fr/download/) (version 16+)
- [MongoDB](https://www.mongodb.com/try/download/community) installé localement
- [Mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) (MongoDB Shell)

#### Installation de MongoDB et mongosh
- Pour installer MongoDB : [Guide d'installation](https://www.mongodb.com/docs/manual/installation/)
- Pour installer mongosh : [Guide d'installation](https://www.mongodb.com/docs/mongodb-shell/install/)

#### Création d'un utilisateur MongoDB
Si vous n'avez pas encore créé d'utilisateur pour votre base de données MongoDB :

```bash
# Connectez-vous à MongoDB
mongosh

# Créez un utilisateur admin
use admin
db.createUser({
  user: "votre_nom_utilisateur",
  pwd: "votre_mot_de_passe_securise",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

# Quittez MongoDB
exit
```

#### Configuration du fichier .env pour le backend

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :

```
MONGO_USERNAME=votre_username_mongodb
MONGO_PASSWORD=votre_password_mongodb
MONGO_HOST="localhost:27017"  # Remplacez par votre host:port MongoDB
```

### 3. Lancer le backend

```bash
cd backend
python -m venv venv

# Activation de l'environnement virtuel
# Sous Windows
venv\Scripts\activate
# Sous Linux/MacOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8100
```

Si Python n'est pas installé, téléchargez-le depuis [le site officiel de Python](https://www.python.org/downloads/).

La documentation de l'API sera accessible à l'adresse : `http://localhost:8100/docs`

### 4. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible à l'adresse : `http://localhost:5173`

> **Note** : Si vous n'avez pas Node.js installé, téléchargez-le depuis [nodejs.org](https://nodejs.org/fr/download/) (version LTS recommandée)

### 5. Vérification de l'installation

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. L'application devrait se connecter automatiquement au backend sur `http://localhost:8100`
3. Vous pouvez créer un compte et commencer à utiliser l'application


---

## 🔐 Dépendance au tiers de confiance

L'application repose sur un **serveur tiers** pour :

- Générer et stocker les clés de chiffrement
- Assurer l'authentification par token
- Autoriser ou bloquer l'accès aux images

Voir le dépôt [tiers-de-confiance](https://github.com/sovrizon/tiers-de-confiance)

---

## 📂 Structure du dépôt

```
secugram/
├── backend/         # API FastAPI
│   ├── main.py
│   ├── .env         # Configuration de connexion à MongoDB
│   └── ...
├── frontend/        # Application React
│   └── src/
└── README.md
```

---

## 👥 Auteurs et Contribution

Ce projet a été développé par :
- **Rémy GASMI**
- **Simon VINCENT**
- **Loqmen ANANI**

dans le cadre de leur projet de 3ème année à l'École Centrale de Lyon.

---

## 📄 Licence

© 2025 Sovrizon – Tous droits réservés.
