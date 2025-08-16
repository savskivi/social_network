import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import LikeIcon from "../assets/icons/LikeIcon";
import CommentIcon from "../assets/icons/CommentIcon";
import FavoritesIcon from "../assets/icons/FavoritesIcon";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import type { Post as PostT, User as UserT } from "../types";
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router";

type Props = {
  currentUser: UserT | null;
  item: PostT;
  toggleLike?: (post: PostT) => void;
  addComment?: (text: string, post: PostT) => void;
  addFavorite?: (post: PostT) => void;
};

export default function Post({
  currentUser,
  item,
  toggleLike,
  addComment,
  addFavorite,
}: Props) {
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const isLiked = currentUser?.id ? item.likes.includes(currentUser.id) : false;
  const isFavorite = currentUser?.favorites
    ? currentUser.favorites.includes(item.id)
    : false;


  return (
    <Card className="px-4 py-4">
      <div className="flex justify-between">
        {item.user.url && <Link to={`/profile/${item.user.id}`}>
          <User
            avatarProps={{
              src: item.user.url,
            }}
            description={item.user.jobTitle}
            name={item.user.fullName}
          />
        </Link>}

        <div className="flex flex-wrap justify-end gap-2">
          {item.tags.map((tag) => (
            <Chip key={tag} size="sm" color="primary" variant="flat">
              #{tag}
            </Chip>
          ))}
        </div>
      </div>

      <div className="bg-default-70 rounded-lg px-4 py-4 mt-4">
        <h2 className="text-md font-bold">{item.title}</h2>
        <p className="text-sm">{item.text}</p>
      </div>

      <div className="flex justify-end items-center gap-4 mt-4">
        {toggleLike && (
          <div className="flex items-center gap-1">
            <button onClick={() => toggleLike(item)}>
              <LikeIcon isFill={isLiked} />
            </button>{" "}
            <span key={item.likes.length}>{item.likes.length}</span>{" "}
          </div>
        )}
        {addComment && (
          <div
            onClick={() => setOpenComments((prev) => !prev)}
            className="flex items-center gap-1"
          >
            <CommentIcon /> <span>{item.comments.length}</span>
          </div>
        )}
        {addFavorite && (
          <div onClick={() => addFavorite(item)}>
            <FavoritesIcon isFill={isFavorite} />
          </div>
        )}
      </div>

      <Divider className="mt-4 mb-2" />

      {openComments && (
        <>
          <div className="flex flex-col gap-1">
            {item.comments.map((comment, index) => (
              <div key={index} className="bg-default-70 rounded-lg px-2 py-2">
                <h2 className="text-sm font-bold">{comment.name}</h2>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            {currentUser ? (
              <div className="min-w-10">
                <Avatar src={currentUser.url} />
              </div>
            ) : (
              <Skeleton className="flex rounded-full w-10 h-10 min-w-10" />
            )}
            <Textarea
              className=""
              placeholder="Write a comment"
              variant="flat"
              radius="md"
              minRows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {addComment && (
              <Button
                disabled={text.trim() === ""}
                color="primary"
                variant="ghost"
                onClick={() => {
                  addComment(text, item);
                  setText("");
                }}
              >
                Send
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
