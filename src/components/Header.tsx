import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import type React from "react";
import { useLocation, useNavigate } from "react-router";
import type { User } from "../types";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

type Props = {
  currentUser: User | null;
};

export default function Header({ currentUser }: Props) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  

  const goHome = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const goProfile = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (currentUser) {
      navigate(`/profile/${currentUser.id}`);
    } else {
      navigate("/login");
    }
  };

  const goFavorites = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate("/favorites");
  };

  const goLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  const goRegister = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate("/register");
  };

  const isActive = (path: string) => {
    const pathArray = path.split("/");
    return location.pathname.split("/")[1] === pathArray[1];
  };

  function handleExit(e: React.SyntheticEvent) {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className=" sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            color={isActive("/") ? "primary" : "foreground"}
            href="#"
            onClick={goHome}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={isActive("/profile") ? "primary" : "foreground"}
            href="#"
            onClick={goProfile}
          >
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={isActive("/favorites") ? "primary" : "foreground"}
            href="#"
            onClick={goFavorites}
          >
            Favorites
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {token ? (
          <NavbarItem className=" lg:flex">
            <Button onClick={handleExit} color="primary">
              Exit
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className=" lg:flex">
              <Link
                href="#"
                onClick={goLogin}
                color={isActive("/login") ? "primary" : "foreground"}
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={goRegister}
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
