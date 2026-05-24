import { useState } from "react";

import {
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import logo from "../../assets/logo.png";

import "../../styles/register.css";

export default function Verify() {

  const navigate = useNavigate();

  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [code, setCode] =
    useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {

      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      alert(
        "Email verified successfully!"
      );

      navigate("/login");

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
        "Verification failed"
      );
    }
  };

  const handleResend = async () => {
    try {

      await resendSignUpCode({
        username: email,
      });

      alert(
        "Verification code resent!"
      );

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
        "Failed to resend code"
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
          Verify Email
        </h1>

        <p className="auth-subtitle">
          Enter the verification code
          sent to your email
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="verification code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            required
          />

          <button type="submit">
            verify
          </button>

        </form>

        <p
          onClick={handleResend}
          className="link"
        >
          resend verification code
        </p>

        <p
          onClick={() =>
            navigate("/login")
          }
          className="link"
        >
          back to login
        </p>

      </div>
    </div>
  );
}
