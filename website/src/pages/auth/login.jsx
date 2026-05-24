import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signIn,
  fetchAuthSession,
  confirmSignIn,
} from "aws-amplify/auth";

import "../../styles/login.css";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [mfaCode, setMfaCode] = useState("");
  const [requiresMFA, setRequiresMFA] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const { nextStep } = await signIn({
        username: form.email,
        password: form.password,
      });

      // MFA REQUIRED
      if (
        nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_SMS_CODE" ||

        nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_TOTP_CODE"
      ) {
        setRequiresMFA(true);
        return;
      }

      // LOGIN SUCCESS
      await completeLogin();

    } catch (err) {
      console.error(err);

      alert(
        err.message || "Login failed"
      );
    }
  };

  const handleMFA = async () => {
    try {

      await confirmSignIn({
        challengeResponse: mfaCode,
      });

      await completeLogin();

    } catch (err) {
      console.error(err);

      alert(
        err.message || "Invalid MFA code"
      );
    }
  };

  const completeLogin = async () => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens.idToken.toString();

    // STORE TOKEN
    localStorage.setItem(
      "accessToken",
      token
    );

    // OPTIONAL USER OBJECT
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: form.email,
      })
    );

    // TEMP ROLE LOGIC
    // Replace later with backend role fetch
    if (
      form.email.includes("admin")
    ) {
      navigate("/admin/courses");

    } else {
      navigate("/guide/courses");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img
          src={logo}
          alt="logo"
          className="auth-logo"
        />

        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Sign in to SarakWay
        </p>

        {!requiresMFA ? (

          <form onSubmit={handleLogin}>

            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              required
            />

            <button type="submit">
              login
            </button>

          </form>

        ) : (

          <div>

            <input
              type="text"
              placeholder="Enter MFA code"
              onChange={(e) =>
                setMfaCode(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleMFA}
            >
              Verify MFA
            </button>

          </div>

        )}

        <p
          onClick={() =>
            navigate("/register")
          }
          className="link"
        >
          don’t have an account?
          register
        </p>

      </div>
    </div>
  );
}
