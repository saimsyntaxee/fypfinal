import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Home from "../pages/Home";
import Account from "../pages/Account";
import DeleteAccount from "../pages/DeleteAccount";
import ResetPassword from "../pages/ResetPassword";
import VerifyResetCode from "../pages/VerifyResetCode";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import ResetEmail from "../pages/ResetEmail";
import { RegistrationForm } from "../pages/RegistrationForm";
import { LoginForm } from "../pages/LoginForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/account" element={<Account />} />
          <Route path="/delete-account" element={<DeleteAccount/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-reset-code/:email" element={<VerifyResetCode />} />
          <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
          <Route path="/reset-email" element={<ResetEmail />} />
      </Routes>
    </BrowserRouter>
  )
}