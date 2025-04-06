# 📸 Secugram — Application Web

Secugram est une application web simplifiée de partage d’images.  
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
- 🖼️ Publication d’images avec description
- 🔐 Communication avec [l'extension Chrome](https://github.com/Sovrizon/extension) pour le chiffrement et déchiffrement
- ✅ Stockage des métadonnées associées
- 🔗 API sécurisée pour accès contrôlé

---

## 🚀 Installation locale

### 1. Cloner le dépôt

```
git clone https://github.com/ton-user/secugram.git
cd secugram
```

### 2. Lancer le backend

Assurez-vous que MongoDB tourne localement ou via un service distant.

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> Le fichier `.env` du backend doit contenir les variables `MONGO_USERNAME` et `MONGO_PASSWORD` pour la connexion à MongoDB.

### 3. Lancer le frontend

```
cd frontend
npm install
npm run dev
```

> Le frontend sera accessible sur `http://localhost:5173`

---



## 🌐 Disponibilité en ligne

Secugram est accessible publiquement via les services suivants :

- **Frontend (Firebase Hosting)** : [https://secugram-82493.web.app](https://secugram-82493.web.app)
- **Backend (Render)** : [https://secugram.onrender.com/docs](https://secugram.onrender.com/docs)



## 🔐 Dépendance au tiers de confiance

L’application repose sur un **serveur tiers** pour :

- Générer et stocker les clés de chiffrement
- Assurer l’authentification par token
- Autoriser ou bloquer l'accès aux images

Voir le dépôt [`tiers-de-confiance`](https://github.com/sovrizon/tiers-de-confiance)

---

## 📂 Structure du dépôt

```
secugram/
├── backend/         # API FastAPI
│   ├── main.py
│   └── ...
├── frontend/        # Application React
│   └── src/
└── README.md
```

