import { useEffect, useState } from "react";

import {
  fetchAuthSession,
} from "aws-amplify/auth";

import {
  Navigate,
} from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {

  const [authorized,
    setAuthorized] =
    useState(null);

  useEffect(() => {

    const checkSession =
      async () => {

      try {

        await fetchAuthSession();

        setAuthorized(true);

      } catch {

        setAuthorized(false);
      }
    };

    checkSession();

  }, []);

  if (authorized === null) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <Navigate to="/login" />;
  }

  return children;
}
