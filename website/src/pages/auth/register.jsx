import { useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { signUp } from "aws-amplify/auth";

import "../../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signUp({
        username: form.email,

        password: form.password,

        options: {
          userAttributes: {
            email: form.email,
            name: form.name,
          },
        },
      });

      alert(
        "Registration successful! Please check your email for the verification code."
      );

      navigate("/verify", {
        state: {
          email: form.email,
        },
      });

    } catch (err) {
      console.error(err);

      alert(
        err.message || "Registration failed"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <img
          src={logo}
          alt="logo"
          className="auth-logo"
        />

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join the SarakWay Training Program
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            required
          />

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
            register
          </button>

        </form>

        <p
          onClick={() => navigate("/login")}
          className="link"
        >
          already have an account? login
        </p>

      </div>
    </div>
  );
}
