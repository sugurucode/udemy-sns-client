import React, { useEffect, useState } from 'react'
import type { PostType } from '../types';
import Post from './Post'
import apiClient from '@/lib/apiClient'

const Timeline = () => {
    const [postText, setPostText] = useState<string>("");
    const [latestPost, setLatestPost] = useState<PostType[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newPost = await apiClient.post("/posts/post", {
                content: postText,
            });
            setLatestPost((prevPosts) => [newPost.data, ...prevPosts]);
            setPostText("");
        } catch (error) {
            alert("ログインしてください");
        }
    };

    useEffect(() => {
        const fetchLatestPosts = async () => {
            const response = await apiClient.get("/posts/get_latest_post");
            try {
                setLatestPost(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLatestPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto py-4">
                <div className="bg-white shadow-md rounded p-4 mb-4">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="What's on your mind?"
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setPostText(e.target.value)
                            }
                            value={postText}

                        ></textarea>
                        <button
                            type="submit"
                            className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
                        >
                            投稿
                        </button>
                    </form>
                </div>
            </main >
            {latestPost.map((post: PostType) => (
                <Post key={post.id} post={post} />
            ))}

        </div >
    )
}

export default Timeline