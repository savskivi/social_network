import { Form, Input, Button } from "@heroui/react";
import { axiosInstanse, setToken } from "../../axiosInstanse";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(data: { [k: string]: FormDataEntryValue }) {
    axiosInstanse
      .post("/auth", data)
      .then((res) => {
        setToken(res.data.token);
        navigate("/");
      });
  }

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm">Sign in to get the most out of ACME</p>
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
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <Button color="primary" type="submit" fullWidth>
          Login
        </Button>
      </Form>
    </div>
  );
}
