import { Form, Input, Button } from "@heroui/react";
import { Avatar, type AvatarProps } from "@files-ui/react";
import { useState } from "react";
import { axiosInstanse, setToken } from "../../axiosInstanse";
import { useNavigate } from "react-router";

const imageSrc =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export default function Register() {
  const [imageSource, setImageSource] = useState<
    AvatarProps["src"] | undefined
  >(imageSrc);
  const handleChangeSource = (selectedFile: File) => {
    setImageSource(selectedFile);
  };

  const navigate = useNavigate();

  function handleSubmit(data: { [k: string]: FormDataEntryValue }) {
    if(typeof imageSource === "object") {
      const formData = new FormData();

      formData.append("file", imageSource);
      axiosInstanse.post("/uploads", formData).then((res) => {
        axiosInstanse.post("/register", {...data, upload_id: res.data.id, favorites: []}).then((res) => {
          setToken(res.data.token);
          navigate("/");
        });
      })
    } else {
      alert("Please upload your image")
    }
    
  }

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="text-sm">Sign up to get the most out of ACME</p>
      </div>
      <Form
        className="w-full max-w-xs flex flex-col gap-4 mt-8"
        onReset={() => {}}
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          handleSubmit(data);
        }}
      >
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <Avatar
            src={imageSource}
            alt="Avatar"
            onChange={handleChangeSource}
            variant="circle"
            changeLabel={"You can choose an image..."}
            style={{ width: "110px", height: "110px" }}
          />
          <p>Upload your profile photo</p>
        </div>

        <Input
          isRequired
          errorMessage="Please enter a valid full name"
          label="Full name"
          labelPlacement="outside"
          name="fullName"
          placeholder="Enter your full name"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter your valid job title"
          label="Job title"
          labelPlacement="outside"
          name="jobTitle"
          placeholder="Enter your job title"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid email address"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email address"
          type="email"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <Button color="primary" type="submit" fullWidth>
          Sign up
        </Button>
      </Form>
    </div>
  );
}
