import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("user_id");
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [decryptedImages, setDecryptedImages] = useState({});

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/posts/all")
            .then(res => {
                setPosts(res.data);
                console.log("🧾 Contenu des posts :", res.data.map(p => ({ id: p.id, caption: p.caption, cryptee: p.cryptee })));
                console.log("📥 Données des posts reçues :", Array.isArray(res.data), res.data);
                res.data.forEach(post => {
                    if (post.image) {
                        console.log("🕵️‍♂️ Demande de déchiffrement pour :", post.id);
                        chrome.runtime.sendMessage({
                            from: "content",
                            action: "decrypt_image",
                            data: {
                                image_id: post.id,
                                encrypted_image_base64: post.image,
                                vault_url: "http://127.0.0.1:8200"
                            }
                        });
                        console.log("📤 Message envoyé à l’extension pour le post :", post.id);
                    }
                });
            })
            .catch(() => setPosts([]));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const storedUsername = localStorage.getItem("username");
            if (storedUsername !== username) {
                setUsername(storedUsername);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [username]);

    useEffect(() => {
        const handleExtensionResponse = (event) => {
            if (event.source !== window || event.data?.source !== "sovrizon-extension") return;
            console.log("✅ Réponse reçue de l’extension :", event.data);
            if (event.data.action === "encrypt_image" && event.data.status === "success") {
                const formData = new FormData();
                formData.append("user_id", userId);
                formData.append("caption", caption);
                formData.append("is_private", isPrivate);
                const encryptedBlob = new Blob([Uint8Array.from(atob(event.data.data.encrypted_image), c => c.charCodeAt(0))]);
                formData.append("image", encryptedBlob, "encrypted_image.bin");
                console.log("📦 Création du FormData avec image chiffrée...");
                axios.post("http://127.0.0.1:8000/posts/add", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(() => {
                    console.log("🚀 Envoi de l’image chiffrée au backend...");
                    setLoading(false);
                    console.log("✅ Publication réussie !");
                    window.location.reload();
                }).catch(() => {
                    console.error("❌ Erreur lors de la publication.");
                    alert("Erreur lors de la publication.");
                    setLoading(false);
                });
            }
        };
        window.addEventListener("message", handleExtensionResponse);
        return () => window.removeEventListener("message", handleExtensionResponse);
    }, [caption, isPrivate, image, userId]);

    const handlePost = async (e) => {
        console.log("🧪 handlePost appelé");
        e.preventDefault();

        setCaption("");
        setImage(null);
        setIsPrivate(false);
        setLoading(true);

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("caption", caption);
        formData.append("is_private", isPrivate);
        formData.append("image", image);

        window.postMessage({
            source: "sovrizon-frontend",
            action: "encrypt_image",
            data: {
                image_base64: image ? await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(",")[1]);
                    reader.readAsDataURL(image);
                }) : null,
                image_id: "temp-id",
                vault_url: "http://127.0.0.1:8200"
            }
        }, "*");
        console.log("📤 Envoi message encrypt_image à l’extension");
    };

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Publications</h2>
            {username && (
                <>
                    <h3 className="text-xl font-semibold text-center text-gray-700">Bienvenue {username}</h3>
                    <div className="absolute top-4 right-4">

                    </div>
                </>
            )}
            {loading && <p className="text-center text-blue-500 font-semibold">Chiffrement en cours...</p>}
            {userId && (
                <form
                    onSubmit={handlePost}
                    className="bg-white p-6 rounded shadow-md mb-8 space-y-4 w-full max-w-md mx-auto"
                >
                    <h3 className="text-xl font-semibold text-center text-gray-800">
                        Nouvelle publication
                    </h3>
                    <div
                        className={`border-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} rounded p-4 text-center cursor-pointer hover:border-blue-400 transition`}
                        onClick={() => document.getElementById("imageInput").click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={() => setIsDragging(true)}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                setImage(e.dataTransfer.files[0]);
                            }
                        }}
                    >
                        {image ? (
                            <p className="text-gray-700">{image.name}</p>
                        ) : (
                            <p className="text-gray-500">Glissez-déposez une image ou cliquez pour sélectionner un fichier</p>
                        )}
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="hidden"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Légende"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="mr-2"
                        />
                        Privé
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-centrale text-white py-2 rounded hover:opacity-90 transition"
                    >
                        Publier
                    </button>
                </form>
            )}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition">
                        <img
                            src={`data:image/jpeg;base64,${decryptedImages[post.id] || post.image}`}
                            alt={post.caption}
                            className="mx-auto mb-2 max-h-64 object-contain"
                        />
                        <p className="text-sm text-gray-700 text-center">{post.caption}</p>
                        <p className="text-xs text-gray-500 text-center">par {post.username}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;