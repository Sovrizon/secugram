import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [posts, setPosts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const [username, setUsername] = useState(localStorage.getItem("username"));
    const userId = localStorage.getItem("user_id");

    const [imageId, setImageId] = useState(null);

    // 🔁 Réception des images déchiffrées
    useEffect(() => {
        const handleDecryptedImage = (event) => {
            if (
                event.source !== window ||
                event.data?.action !== "receive_key" ||
                event.data?.source !== "sovrizon-extension"
            ) return;

            const { image_id, decrypted_image, valid } = event.data;

            console.log("🎯 Home.jsx a reçu une image déchiffrée :", {
                image_id,
                valid,
                preview: decrypted_image?.slice(0, 50) + "..."
            });

            if (!valid) {
                console.warn(`⚠️ Image ${image_id} invalide, affichage du cadenas.`);
                setPosts(prev =>
                    prev.map(post =>
                        post.image_id === image_id
                            ? {
                                ...post,
                                image: "/image_cadenas.png",
                                caption: post.caption || "",
                                username: post.username || "Anonyme"
                            }
                            : post
                    )
                );
                return;
            }
            // Remplace l'image chiffrée dans les posts
            setPosts(prev =>
                prev.map(post =>
                    post.image_id === image_id
                        ? {
                            ...post,
                            // Vous pouvez ajouter une propriété "isTransitioning" pour gérer la transition
                            isTransitioning: true,
                            image: `data:image/jpeg;base64,${decrypted_image}`,
                            caption: post.caption || "",
                            username: post.username || "Anonyme"
                        }
                        : post
                )
            );

            setTimeout(() => {
                setPosts(prev =>
                    prev.map(post =>
                        post.image_id === image_id
                            ? { ...post, isTransitioning: false }
                            : post
                    )
                );
            }, 300); // Durée de la transition en ms


        };

        window.addEventListener("message", handleDecryptedImage);
        return () => window.removeEventListener("message", handleDecryptedImage);
    }, []);

    // 🔁 Chargement initial et envoi à l'extension
    useEffect(() => {
        setIsLoading(true);
        axios.get("http://127.0.0.1:8000/posts/all")
            .then(res => {
                const rawPosts = res.data;
                setPosts(rawPosts);
                setIsLoading(false);

                // Envoi à l'extension pour déchiffrement
                const encrypted_images = {};
                const image_ids = [];

                rawPosts.forEach(post => {
                    encrypted_images[post.image_id] = post.image;
                    image_ids.push(post.image_id);
                });

                window.postMessage({
                    source: "sovrizon-frontend",
                    action: "decrypt_with_token",
                    data: {
                        username,
                        image_ids,
                        encrypted_images,
                    }
                });
            })
            .catch((err) => {
                console.warn("⚠️ Impossible de charger les publications");
                console.error(err);
                setIsLoading(false);
                setPosts([]);
            });
    }, []);

    useEffect(() => {
        // Écoute de la réponse de l'extension avec l'image chiffrée
        const handleEncryptedImage = (event) => {
            if (
                event.source !== window ||
                event.data?.action !== "image_encrypted" ||
                event.data?.source !== "sovrizon-extension"
            ) return;

            const { encrypted_image, image_id } = event.data.data;
            console.log("📥 Image chiffrée reçue :", image_id);

            const byteCharacters = atob(encrypted_image);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("caption", window.__temp_post_data?.caption || "");
            formData.append("image_id", image_id);
            formData.append("image", blob, `${image_id}.jpg`);

            axios.post("http://127.0.0.1:8000/posts/add", formData)
                .then(res => {
                    console.log("✅ Publication envoyée au backend :", res.data.message);

                    // Ajout du post avec cadenas par défaut
                    setPosts(prev => [
                        {
                            id: Date.now(),
                            username,
                            caption,
                            image_id,
                            image: "/image_cadenas.png",
                        },
                        ...prev
                    ]);

                    // Nettoyage
                    setPreviewUrl(null);

                    // 🔐 Tenter déchiffrement immédiat si token présent
                    chrome.storage.local.get(["trust_token"], (result) => {
                        const token = result.trust_token;
                        if (token) {
                            console.log("🔄 Token trouvé, tentative de déchiffrement automatique.");
                            window.postMessage({
                                source: "sovrizon-frontend",
                                action: "decrypt_with_token",
                                dcata: {
                                    token,
                                    username,
                                    image_ids: [image_id],
                                    encrypted_images: {
                                        [image_id]: encrypted_image
                                    }
                                }
                            }, "*");
                        } else {
                            console.warn("⚠️ Aucun token trouvé, déchiffrement différé.");
                        }
                    });
                })
                .catch(err => {
                    console.error("❌ Erreur lors de l'envoi au backend :", err);
                });
        };

        window.addEventListener("message", handleEncryptedImage);
        return () => window.removeEventListener("message", handleEncryptedImage);
    }, [caption, userId]);

    const handleImageChange = (file) => {
        setImage(file);
        // Créer une URL pour la prévisualisation de l'image
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageBase64 = reader.result.split(',')[1];
            const newImageId = `img-${Date.now()}`;
            setImageId(newImageId);

            // 🔐 Capture des données au moment de l'envoi
            const currentCaption = caption;

            window.postMessage({
                source: "sovrizon-frontend",
                from: "frontend",
                action: "encrypt_image",
                data: {
                    image_base64: imageBase64,
                    image_id: newImageId,
                    username,
                    caption: currentCaption,
                    valid: true
                }
            });

            // Nettoyage du formulaire (après le postMessage)
            setCaption("");
            setImage(null);

            // 💾 Stocker temporairement pour utilisation dans handleEncryptedImage
            window.__temp_post_data = {
                caption: currentCaption,
            };
        };

        reader.readAsDataURL(image);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Publications</h2>
                <p className="text-gray-600">Partagez vos moments</p>
            </div>

            {username && (
                <div className="bg-gray-50 border-l-4 border-centrale p-4 mb-8 rounded shadow-sm">
                    <p className="text-gray-700">
                        <span className="font-medium">Bienvenue</span> <span className="text-centrale font-bold">{username}</span>
                    </p>
                </div>
            )}



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {userId && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-centrale" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Nouvelle publication
                            </h3>

                            <form onSubmit={handlePost} className="space-y-4">
                                <div
                                    className={`border-2 ${isDragging ? "border-centrale bg-red-50" : previewUrl ? "border-centrale" : "border-dashed border-gray-300"} 
                                              rounded-lg p-4 text-center cursor-pointer transition-all duration-200`}
                                    onClick={() => document.getElementById("imageInput").click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragEnter={() => setIsDragging(true)}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files?.length > 0) {
                                            handleImageChange(e.dataTransfer.files[0]);
                                        }
                                    }}
                                >
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Prévisualisation"
                                                className="max-h-48 mx-auto object-contain rounded"
                                            />
                                            <div
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleImageChange(null);
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : image ? (
                                        <p className="text-gray-700">{image.name}</p>
                                    ) : (
                                        <div className="py-8">
                                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-500">Glissez-déposez une image ou cliquez pour sélectionner</p>
                                        </div>
                                    )}
                                    <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e.target.files[0])}
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        id="caption"
                                        type="text"
                                        placeholder="Décrivez votre image..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-centrale focus:border-centrale"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-centrale text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center font-medium shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Publier
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className={userId ? "lg:col-span-2" : "lg:col-span-3"}>
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-centrale"></div>
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                    <div className="p-3 border-b flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                            {post.username?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                        <span className="font-medium text-gray-800">{post.username || "Anonyme"}</span>
                                    </div>
                                    <div className="relative bg-gray-100 flex items-center justify-center" style={{minHeight: "200px"}}>
                                        <img
                                            src={post.image.startsWith("data:image/") ? post.image : "/image_cadenas.png"}
                                            className={`w-full object-contain max-h-64 transition-all duration-300 ${
                                                post.isTransitioning ? "scale-105 opacity-90" : "scale-100 opacity-100"
                                            }`}
                                            alt={post.caption || "Image"}
                                        />
                                    </div>                                    <div className="p-4">
                                        <p className="text-gray-800">{post.caption}</p>
                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between items-center">
                                        {/*<span>{new Date().toLocaleDateString()}</span>*/}
                                        <div className="flex items-center space-x-2">
                                            <span className="opacity-50">{post.image_id}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(post.image_id);
                                                    setCopiedId(post.image_id);
                                                    setTimeout(() => setCopiedId(null), 2000); // Réinitialise après 2 secondes
                                                }}
                                                className={`text-xs px-2 py-0.5 rounded ${
                                                    copiedId === post.image_id
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                } transition-colors`}
                                            >
                                                {copiedId === post.image_id ? "Copié" : "Copier"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Aucune publication</h3>
                            <p className="text-gray-600">Les publications apparaîtront ici</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;