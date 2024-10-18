import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="">
      <h1>Welcome to the Home Page</h1>
      <button onClick={()=>navigate("/account")}>Account Setting</button>
    </div>
  );
}