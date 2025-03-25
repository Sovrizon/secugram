import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/posts/all")
            .then(res => setPosts(res.data))
            .catch(() => setPosts([]));
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Publications</h2>
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