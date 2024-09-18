import React from 'react'
import type { PostType } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
interface Props {
    post: PostType,
}

const Post = (props: Props) => {
    const { post } = props;

    // console.log(post.author.profile.profileImageUrl);


    return (
        // 投稿の背景色、影、角のまるみ、パディング、下部の間隔
        <div className="bg-white shadow-md rounded p-4 mb-4">
            {/* 投稿内の下部の間隔 */}
            <div className="mb-4">
                {/* 投稿内の上部の間隔 */}
                <div className="flex items-center mb-4">
                    <Link href={`/profile/${post.authorId}`}>
                        <img
                            className="w-10 h-10 rounded-full mr-2"
                            src={post.author.profile?.profileImageUrl}
                            alt="User Avatar"
                        />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-md">{post.author?.username}</h2>
                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <p className="text-gray-700">{post?.content}</p>
            </div>
        </div>
    )
}

export default Post

function userAuth(): { user: any; } {
    throw new Error('Function not implemented.');
}
