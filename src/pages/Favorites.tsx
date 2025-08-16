import { useEffect, useState } from "react";
import { axiosInstanse } from "../../axiosInstanse";
import type { Post as PostT, User } from "../types";
import type { AxiosResponse } from "axios";
import Post from "../components/Post";

export default function Favorites() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostT[]>([]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  function getCurrentUser() {
    axiosInstanse.get<User>("/auth_me?_relations=uploads").then((user) => {
      axiosInstanse.get<{ url: string }>(`/uploads/${user.data.upload_id}`).then((avatar) =>
        setCurrentUser({
          ...user.data,
          url: avatar.data.url,
        })
      );
    });
  }

  useEffect(() => {
    if (currentUser?.favorites?.length) {

      const postPromises = currentUser.favorites.map((id: number) => 
        axiosInstanse.get<PostT>(`/posts/${id}?_relations=users`)
      );

      Promise.allSettled(postPromises).then((postsResults) => {

        const successfulPosts = postsResults
          .filter((result): result is PromiseFulfilledResult<AxiosResponse<PostT>> => 
            result.status === "fulfilled"
          )
          .map(result => result.value.data);


        const avatarPromises = successfulPosts.map(post => 
          axiosInstanse.get<{ url: string }>(`/uploads/${post.user.upload_id}`)
        );

        Promise.allSettled(avatarPromises).then((avatarsResults) => {
          const postsWithAvatars = successfulPosts.map((post, index) => {
            const avatarResult = avatarsResults[index];
            const avatarUrl = avatarResult.status === "fulfilled" 
              ? avatarResult.value.data.url 
              : undefined;

            return {
              ...post,
              user: {
                ...post.user,
                url: avatarUrl || '',
              },
            };
          });

          setPosts(postsWithAvatars);
        });
      });
    } else {
      setPosts([]);
    }
  }, [currentUser]);

  return (
    <div className="max-w-[1024px] mx-auto">
      <div className="mt-4 flex flex-col gap-4">
        {posts.map((item) => (
          <Post key={item.id} item={item} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}