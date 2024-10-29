import React from "react";
import { useNavigate } from "react-router-dom";

import Cities from "../src/components/ui/Cities";
import Header from "../src/components/ui/header";
import Hero from "../src/components/ui/hero";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Hero />
      <Cities />
      {/* <div>
        <h1>Welcome to the Home Page</h1>
        <button onClick={() => navigate("/account")}>Account Setting</button>
      </div> */}
    </div>
  );
}
