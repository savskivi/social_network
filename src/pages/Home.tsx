import {
  Card,
  Button,
  Avatar,
  Textarea,
  useDisclosure,
  Skeleton,
  Input,
  Pagination,
} from "@heroui/react";
import SendIcon from "../assets/icons/SendIcon";
import Post from "../components/Post";
import ModalTags from "../components/ModalTags";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import type { Post as PostT, User } from "../types";
import { axiosInstanse } from "../../axiosInstanse";
import type { AxiosResponse } from "axios";
import { useDebounce } from "use-debounce";
import { Link } from "react-router";

export const SearchIcon = (props: {className: string}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onOpenChange: onFilterOpenChange,
  } = useDisclosure();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostT[]>([]);
  const [groupSelected, setGroupSelected] = useState<string[]>([]);
  const [filterTagsSelected, setFilterTagsSelected] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<{
    title: boolean;
    text: boolean;
  }>({ title: false, text: false });
  const [sort, setSort] = useState<string>("id");
  const [value, setValue] = useState<string>("");
  const [debounceSearch] = useDebounce(value, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<string>("5");


  useEffect(() => {
    getCurrentUser();
  }, []);

  function getCurrentUser() {
    axiosInstanse.get("/auth_me?_relations=uploads").then((user) => {
      axiosInstanse.get(`/uploads/${user.data.upload_id}`).then((avatar) =>
        setCurrentUser({
          id: user.data.id,
          fullName: user.data.fullName,
          email: user.data.email,
          username: user.data.username,
          jobTitle: user.data.jobTitle,
          url: avatar.data.url,
          upload_id: user.data.upload_id,
          favorites: user.data.favorites,
        })
      );
    });
  }


  function getAllPosts() {
    const filters = filterTagsSelected.reduce((str, item) => {
      str += `&tags[]=${item}`;
      return str;
    }, "");

    const searchValue = debounceSearch ? `&title=*${debounceSearch}` : "";

    axiosInstanse
      .get(`/posts?_relations=users&sortBy=${sort}${filters}${searchValue}`)
      .then((res) => {
        const uploads: Promise<AxiosResponse<{url: string}>>[] = [];
        res.data.forEach((post: PostT) => {
          uploads.push(axiosInstanse.get<{url: string }>(`/uploads/${post.user.upload_id}`));
        });
        Promise.allSettled(uploads).then((upload) => {
          setPosts(
            res.data.map((post: PostT, index: number) => {
              const avatarData = upload[index].status === 'fulfilled' 
              ? upload[index].value.data 
              : { url: '' };
              return {
                id: post.id,
                title: post.title,
                text: post.text,
                likes: post.likes,
                tags: post.tags,
                comments: post.comments,
                user: {
                  id: post.user.id,
                  fullName: post.user.fullName,
                  email: post.user.email,
                  username: post.user.username,
                  jobTitle: post.user.jobTitle,

                  url: avatarData.url,
                  upload_id: post.user.upload_id,
                },
                date: post.date,
              };
            })
          );
          setCurrentPage(1);
        });
      });
  }

  function toggleLike(post: PostT) {
    if (currentUser) {
      if (post.likes.includes(currentUser.id)) {
        axiosInstanse
          .patch(`/posts/${post.id}`, {
            likes: post.likes.filter((el) => el != currentUser.id),
          })
          .then(() => {
            getAllPosts();
          });
      } else {
        axiosInstanse
          .patch(`/posts/${post.id}`, {
            likes: [...post.likes, currentUser.id],
          })
          .then(() => {
            getAllPosts();
          });
      }
    }
  }

  function addFavorite(post: PostT) {
    if (currentUser) {
      if (currentUser.favorites.includes(post.id)) {
        axiosInstanse
          .patch(`/users/${currentUser.id}`, {
            favorites: currentUser.favorites.filter((el) => el != post.id),
          })
          .then(() => {
            getCurrentUser();
          });
      } else {
        axiosInstanse
          .patch(`/users/${currentUser.id}`, {
            favorites: [...currentUser.favorites, post.id],
          })
          .then(() => {
            getCurrentUser();
          });
      }
    }
  }

  function addComment(text: string, post: PostT) {
    if (currentUser) {
      axiosInstanse
        .patch(`/posts/${post.id}`, {
          comments: [...post.comments, { text, name: currentUser.username }],
        })
        .then(() => {
          getAllPosts();
        });
    }
  }

  useEffect(() => {
    getAllPosts();
  }, [sort, filterTagsSelected, debounceSearch]);

  function createNewPost() {
    if (!title.trim() || !text.trim()) {
      setError({ title: title.trim() === "", text: text.trim() === "" });
      return;
    }
    axiosInstanse
      .post("/posts", {
        comments: [],
        likes: [],
        tags: groupSelected,
        text: text,
        title: title,
        user_id: currentUser?.id,
        user: {
          email: currentUser?.email,
          fullName: currentUser?.fullName,
          id: currentUser?.id,
          jobTitle: currentUser?.jobTitle,
          upload_id: currentUser?.upload_id,
          username: currentUser?.username,
        },
        date: Date.now(),
      })
      .then(() => {
        getAllPosts();
        setText("");
        setTitle("");
        setGroupSelected([]);
        setError({ title: false, text: false });
      });
  }

  return (
    <div className="max-w-[1024px] mx-auto flex justify-between items-start gap-4">
      <Sidebar
        sort={sort}
        setSort={setSort}
        currentUser={currentUser}
        onFilterOpen={onFilterOpen}
        filterTagsSelected={filterTagsSelected}
        setFilterTagsSelected={setFilterTagsSelected}
        limit={limit}
        setLimit={setLimit}
      />

      <div className="mt-4 flex flex-col gap-4 w-[50%] ">
        <Card className="px-4 py-4">
          <div className="flex gap-2">
            {currentUser ? (
              <Link to={`/profile/${currentUser.id}`}>
                <div className="min-w-10">
                  <Avatar src={currentUser.url} />
                </div>
              </Link>
            ) : (
              <Skeleton className="flex rounded-full w-10 h-10 min-w-10" />
            )}

            <div className="flex flex-col gap-1 w-full">
              <Input
                value={title}
                onValueChange={setTitle}
                label="Title"
                placeholder="Enter title"
                type="text"
                variant="bordered"
                errorMessage="Please enter a title"
                isInvalid={error.title}
                isRequired
              />
              <Textarea
                className="w-full mb-2"
                labelPlacement="outside"
                placeholder="Write something..."
                variant="bordered"
                radius="sm"
                value={text}
                onValueChange={setText}
                errorMessage="Please enter a text"
                isInvalid={error.text}
                isRequired
              />
            </div>
          </div>
          <div className="flex justify-center gap-2 w-full mt-2">
            <Button
              onPress={onOpen}
              color="primary"
              variant="flat"
              className="w-[75%]"
            >
              # Add hashtags
            </Button>

            <ModalTags
              groupSelected={groupSelected}
              setGroupSelected={setGroupSelected}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />

            <ModalTags
              groupSelected={filterTagsSelected}
              setGroupSelected={setFilterTagsSelected}
              isOpen={isFilterOpen}
              onOpenChange={onFilterOpenChange}
              isRestricted={false}
            />

            <Button color="primary" className="w-[25%]" onClick={createNewPost}>
              <SendIcon />
            </Button>
          </div>
        </Card>

        {posts
          .slice((currentPage - 1) * +limit, +limit * currentPage)
          .map((item) => (
            <Post
              toggleLike={toggleLike}
              key={item.id}
              item={item}
              currentUser={currentUser}
              addComment={addComment}
              addFavorite={addFavorite}
            />
          ))}

        <div className="flex justify-center">
          <Pagination
            color="primary"
            page={currentPage}
            total={Math.ceil(posts.length / +limit)}
            onChange={setCurrentPage}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 w-[25%]">
        <Input
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-sm",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "cursor-text!",
            ],
          }}
          label="Search"
          placeholder="Type to search..."
          radius="lg"
          variant="bordered"
          color="primary"
          value={value}
          onValueChange={setValue}
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0" />
          }
        />
      </div>
    </div>
  );
}
