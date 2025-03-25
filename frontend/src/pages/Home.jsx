import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/posts/all")
            .then(res => setPosts(res.data))
            .catch(() => setPosts([]));
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", localStorage.getItem("user_id"));
        formData.append("caption", caption);
        formData.append("is_private", isPrivate);
        formData.append("image", image);

        try {
            await axios.post("http://127.0.0.1:8000/posts/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCaption("");
            setImage(null);
            setIsPrivate(false);
            window.location.reload(); // recharge les posts
        } catch (err) {
            alert("Erreur lors de la publication.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Publications</h2>
            {localStorage.getItem("user_id") && (
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
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Publier
                    </button>
                </form>
            )}
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded shadow p-4">
                    <img
                        src={`data:image/png;base64,${btoa(post.image)}`}
                        alt="post"
                        className="w-full object-contain mb-4 rounded"
                    />
                    <p className="text-gray-800 font-semibold">@{post.username}</p>
                    <p className="text-gray-600">{post.caption}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;