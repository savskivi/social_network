import React from 'react'
import { Navigate } from 'react-router';

type Props = {
    children: React.ReactNode
}

export default function ProtectedRoute({children}: Props) {
  const token = localStorage.getItem("token");

  if (token) {
    return children
  } else {
    return <Navigate to={"/login"}/>
  }
}