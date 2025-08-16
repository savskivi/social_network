import { Avatar, Button, Card, Form, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstanse } from "../../axiosInstanse";
import type { ProfileForm, User } from "../types";
import type { Post as PostT } from "../types";
import Post from "../components/Post";

type Props = {
  currentUser: User | null;
};

export default function Profile({ currentUser }: Props) {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<ProfileForm>({
    fullName: "",
    username: "",
    jobTitle: "",
    email: "",
  });
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostT[]>([]);

  useEffect(() => {
    if (id) {
      axiosInstanse.get(`/users/${id}?_relations=uploads`).then((user) => {
        setUser({
          id: user.data.id,
          fullName: user.data.fullName,
          email: user.data.email,
          username: user.data.username,
          jobTitle: user.data.jobTitle,
          url: user.data.upload.url,
          upload_id: user.data.upload.id,
          favorites: user.data.favorites,
        });
      });
      axiosInstanse
        .get(`/posts?_relations=users&user_id=${+id}`)
        .then((res) => {
          setPosts(res.data);
        });
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormValues({
        fullName: user.fullName,
        username: user.username,
        jobTitle: user.jobTitle,
        email: user.email,
      });
    }
  }, [user]);

  function handleChange(e: React.SyntheticEvent) {
    const { name, value } = e.target as HTMLInputElement;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancel() {
    setIsReadOnly(true);
    if (user) {
      setFormValues({
        fullName: user.fullName,
        username: user.username,
        jobTitle: user.jobTitle,
        email: user.email,
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    axiosInstanse.patch(`/users/${id}`, formValues).then((res) => {
      setUser((prev) => {
        if (!prev) return null; 
        return {
          ...prev,
          fullName: res.data.fullName,
          username: res.data.username,
          jobTitle: res.data.jobTitle,
          email: res.data.email,
        };
      });
      setIsReadOnly(true);
    });
  }

  return (
    <div className="max-w-[800px] mx-auto mt-4">
      <Card className="flex justify-center items-center">
        <Avatar
          src={user?.url}
          alt="Avatar"
          //   changeLabel={"Change profile pucture..."}
          style={{ width: "140px", height: "140px" }}
          className="mt-5 mb-5"
        />

        <Form
          onSubmit={handleSubmit}
          className="w-full max-w-xs flex flex-col gap-3"
        >
          <Input
            isReadOnly={isReadOnly}
            label="Full name"
            labelPlacement="outside"
            name="fullName"
            placeholder="Your full name"
            value={formValues.fullName}
            onChange={handleChange}
          />

          <Input
            isReadOnly={isReadOnly}
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Your username"
            value={formValues.username}
            onChange={handleChange}
          />

          <Input
            isReadOnly={isReadOnly}
            label="Job title"
            labelPlacement="outside"
            name="jobTitle"
            placeholder="Your job title"
            value={formValues.jobTitle}
            onChange={handleChange}
          />

          <Input
            isReadOnly={isReadOnly}
            label="Email address"
            labelPlacement="outside"
            name="email"
            placeholder="Your email address"
            value={formValues.email}
            onChange={handleChange}
          />

          <div className="flex mx-auto gap-4 mb-5 mt-4">
            {String(currentUser?.id) === id && (
              <>
                {isReadOnly ? (
                  <Button
                    onClick={() => setIsReadOnly(false)}
                    type="button"
                    color="primary"
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="flat" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Save
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </Form>
      </Card>

      <h1 className="text-2xl font-bold mt-4 text-center">User's posts</h1>

        <div className="flex flex-col gap-4 mt-4">
      {posts.map((item) => (
        <Post key={item.id} item={item} currentUser={currentUser} />
      ))}
      </div>
    </div>
  );
}
