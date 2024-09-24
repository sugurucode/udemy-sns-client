import { useAuth } from '@/context/auth';
import apiClient from '@/lib/apiClient';
import { PostType, Profile } from '@/types';
import { log } from 'console';
import React, { useEffect, useState } from 'react';

type Props = {
    profile: Profile;
    initialPosts: PostType[];
};

export const getServerSideProps = async (context: any) => {
    const { userId } = context.query;

    try {
        const profileResponse = await apiClient.get(`/users/profile/${userId}`);
        const postsResponse = await apiClient.get(`/posts/${userId}`);
        return {
            props: {
                profile: profileResponse.data,
                initialPosts: postsResponse.data,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }
};

const UserProfile = ({ profile, initialPosts }: Props) => {
    // 編集モードの状態
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(profile.user.username);
    const [bio, setBio] = useState(profile.bio);
    //const [isUserIdMatching, setIsUserIdMatching] = useState(true);
    const { user } = useAuth();
    const [isUserIdMatching, setIsUserIdMatching] = useState(false);
    const [posts, setPosts] = useState<PostType[]>(initialPosts);

    console.log(user?.id);
    console.log(profile.user.id);


    useEffect(() => {
        if (user?.id === profile.user.id) {
            setIsUserIdMatching(true);
        } else {
            setIsUserIdMatching(false);
        }
    }, [user, profile.user.id]);

    console.log(isUserIdMatching);


    // 編集ボタンを押すと編集モードに切り替わる
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // プロフィール更新処理
    const handleProfileUpdate = async () => {
        try {
            // APIリクエストでプロフィール情報を更新
            await apiClient.put(`/users/profile/${profile.user.id}`, {
                username,
                bio,
            });
            setIsEditing(false);  // 編集モードを終了
        } catch (error) {
            console.error("プロフィールの更新中にエラーが発生しました。", error);
        }
    };

    // ポスト削除処理
    const handlePostDelete = async (postId: number) => {
        try {
            console.log("postId" + postId);

            // APIリクエストでプロフィール情報を更新
            await apiClient.delete(`/posts/delete/${postId}`, {
            });

            console.log(posts);
            setPosts(prevPost => prevPost.filter(post => post.id !== postId));
            console.log(posts);

        } catch (error) {
            console.error("ポストの削除中にエラーが発生しました。", error);
        }
    };

    const handleProfileDelete = async () => {
        try {
            // APIリクエストでプロフィール情報を更新
            await apiClient.delete(`/users/delete/${profile.user.id}`, {
            });

        } catch (error) {
            console.error("アカウントの削除中にエラーが発生しました。", error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                    <div className="flex items-center">
                        <img className="w-20 h-20 rounded-full mr-4" alt="User Avatar" src={profile.profileImageUrl} />
                        <div>
                            {isEditing ? (
                                <>
                                    {/* 編集モードの場合は入力フィールドを表示 */}
                                    <input
                                        type="text"
                                        className="text-2xl font-semibold mb-1 border border-gray-300 p-1 rounded"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <textarea
                                        className="text-gray-600 border border-gray-300 p-1 rounded"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </>

                            ) : (

                                <>
                                    {/* 通常モードの場合はテキストを表示 */}
                                    <h2 className="text-2xl font-semibold mb-1">{username}</h2>
                                    <p className="text-gray-600">{bio}</p>
                                </>
                            )}
                        </div>
                        {/*ログインしているuserIdとプロフィールのuserIdが一致した
                        場合に編集/保存ボタンを表示する */}
                        {isUserIdMatching && (
                            <button
                                className="ml-auto text-gray-500 hover:text-gray-800 border border-gray-300 rounded px-4 py-2"
                                onClick={isEditing ? handleProfileUpdate : toggleEditMode}
                            >
                                {isEditing ? '保存' : '編集'}
                            </button>
                        )}
                    </div>
                </div>
                {/* 投稿一覧 */}
                {posts.map((post: PostType) => (
                    <div className="bg-white shadow-md rounded p-4 mb-4" key={post.id}>
                        <div className="mb-4">
                            <div className="flex items-center mb-2">


                                <img className="w-10 h-10 rounded-full mr-2"
                                    alt="User Avatar"
                                    src={profile.profileImageUrl} />

                                <div>
                                    <h2 className="font-semibold text-md">
                                        {post.author.username}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(post.createdAt).toLocaleString()}</p>
                                </div>
                                {isUserIdMatching && (
                                    <button
                                        className="ml-auto text-gray-500 hover:text-gray-800  rounded px-4 py-2 text-sm"
                                        onClick={() => handlePostDelete(post?.id)}
                                    >
                                        削除
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700">{post.content}</p>
                        </div>

                    </div>
                ))}
                <button
                    className="absolute bottom-4 right-4 border border-gray-500 text-gray-500 hover:text-gray-800 rounded px-4 py-2 text-sm"
                    onClick={() => handleProfileDelete()}
                >
                    削除
                </button>
            </div>



        </div>
    );
};

export default UserProfile;
