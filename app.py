import streamlit as st
from PIL import Image
import os

# Titre de l'application
st.title("Instalitre 📸")

# Chargement des données (en mémoire pour simplifier)
if "posts" not in st.session_state:
    st.session_state["posts"] = []

# Section pour ajouter une nouvelle publication
st.sidebar.title("Ajouter une publication")
with st.sidebar.form("new_post"):
    uploaded_image = st.file_uploader("Choisissez une image", type=["jpg", "jpeg", "png"])
    caption = st.text_input("Légende", placeholder="Ajoutez une description...")
    submitted = st.form_submit_button("Publier")

    if submitted:
        if uploaded_image and caption:
            # Stocker l'image et la légende
            st.session_state["posts"].append({"image": uploaded_image, "caption": caption})
            st.success("Publication ajoutée avec succès !")
        else:
            st.error("Veuillez ajouter une image et une légende.")

# Afficher les publications
st.header("📷 Publications")

if st.session_state["posts"]:
    for post in reversed(st.session_state["posts"]):  # Les plus récentes en premier
        st.image(post["image"], use_container_width=True)
        st.caption(post["caption"])
        st.markdown("---")  # Ligne de séparation entre les publications
else:
    st.write("Aucune publication pour le moment. Ajoutez votre première !")
