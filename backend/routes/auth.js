const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const db = require("../db");

const AmazonCognitoIdentity =
require("amazon-cognito-identity-js");

const fetch = (...args) =>
  import('node-fetch').then(
    ({ default: fetch }) =>
      fetch(...args)
  );

global.fetch = fetch;
/* ================= COGNITO CONFIG ================= */

const poolData = {
  UserPoolId: "us-east-1_dI8Iu4MqE",

  ClientId:
    "4rnm7g614al3l34kbas75qcjt8",
};

const userPool =
  new AmazonCognitoIdentity
    .CognitoUserPool(poolData);

/* =========================================================
   REGISTER
========================================================= */

router.post("/register", async (req, res) => {

  const {
    user_name,
    email,
    password,
  } = req.body;

  if (
    !user_name ||
    !email ||
    !password
  ) {

    return res.status(400).json({
      message:
        "All fields are required",
    });
  }

  try {

    /* CHECK MYSQL */

    const checkQuery =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkQuery,
      [email],

      async (err, results) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            message:
              "Database error",
          });
        }

        if (results.length > 0) {

          return res.status(400).json({
            message:
              "Email already registered",
          });
        }

        /* COGNITO SIGNUP */

        const attributeList = [];

        const emailAttribute =
          new AmazonCognitoIdentity
            .CognitoUserAttribute({
              Name: "email",
              Value: email,
            });

        attributeList.push(
          emailAttribute
        );

        userPool.signUp(
          email,
          password,
          attributeList,
          null,

          async (err, result) => {

            if (err) {

              console.error(err);

              return res.status(400).json({
                message:
                  err.message ||
                  "Cognito registration failed",
              });
            }

            try {

              /* DETERMINE ROLE */

              const countQuery =
                "SELECT COUNT(*) AS count FROM users";

              db.query(
                countQuery,

                async (
                  err,
                  countResult
                ) => {

                  if (err) {

                    console.error(err);

                    return res.status(500).json({
                      message:
                        "Database error",
                    });
                  }

                  const userCount =
                    countResult[0].count;

                  /* FIRST USER = ADMIN */

                  const role_id =
                    userCount === 0
                      ? 1
                      : 2;

                  /* HASH PASSWORD */

                  const hashedPassword =
                    await bcrypt.hash(
                      password,
                      10
                    );

                  /* INSERT MYSQL USER */

                  const insertQuery = `
                    INSERT INTO users
                    (
                      user_name,
                      email,
                      password_hash,
                      role_id
                    )
                    VALUES (?, ?, ?, ?)
                  `;

                  db.query(
                    insertQuery,
                    [
                      user_name,
                      email,
                      hashedPassword,
                      role_id,
                    ],

                    (err) => {

                      if (err) {

                        console.error(err);

                        return res.status(500).json({
                          message:
                            "Failed to save user",
                        });
                      }

                      res.json({
                        message:
                          "Registration successful",
                      });
                    }
                  );
                }
              );

            } catch (dbErr) {

              console.error(dbErr);

              res.status(500).json({
                message:
                  "Server error",
              });
            }
          }
        );
      }
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================================================
   LOGIN
========================================================= */

router.post("/login", async (req, res) => {

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {

    return res.status(400).json({
      message:
        "Email and password required",
    });
  }

  const authenticationDetails =
    new AmazonCognitoIdentity
      .AuthenticationDetails({
        Username: email,
        Password: password,
      });

  const cognitoUser =
    new AmazonCognitoIdentity
      .CognitoUser({
        Username: email,
        Pool: userPool,
      });

  cognitoUser.authenticateUser(

    authenticationDetails,

    {

      /* ==========================================
         LOGIN SUCCESS
      ========================================== */

      onSuccess: async () => {

        const query =
          "SELECT * FROM users WHERE email = ?";

        db.query(

          query,
          [email],

          async (err, results) => {

            if (err) {

              console.error(err);

              return res.status(500).json({
                message:
                  "Database error",
              });
            }

            if (results.length === 0) {

              return res.status(401).json({
                message:
                  "User not found in database",
              });
            }

            const user =
              results[0];

            const role =
              user.role_id === 1
                ? "admin"
                : "guide";

            return res.json({

              user_id:
                user.user_id,

              name:
                user.user_name,

              email:
                user.email,

              phone:
                user.phone,

              role:
                role,
            });
          }
        );
      },

      /* ==========================================
         LOGIN FAILURE
      ========================================== */

      onFailure: (err) => {

        console.error(
          "LOGIN ERROR:",
          err
        );

        return res.status(401).json({
          message:
            err?.message ||
            "Login failed",
        });
      },

      /* ==========================================
         FORCE CHANGE PASSWORD
      ========================================== */

      newPasswordRequired: (
        userAttributes,
        requiredAttributes
      ) => {

        console.log(
          "NEW PASSWORD REQUIRED"
        );

        cognitoUser.completeNewPasswordChallenge(

          password,
          {},

          {

            onSuccess: async () => {

              console.log(
                "PASSWORD UPDATED"
              );

              const query =
                "SELECT * FROM users WHERE email = ?";

              db.query(

                query,
                [email],

                async (
                  err,
                  results
                ) => {

                  if (err) {

                    console.error(err);

                    return res.status(500).json({
                      message:
                        "Database error",
                    });
                  }

                  if (
                    results.length === 0
                  ) {

                    return res.status(401).json({
                      message:
                        "User not found in database",
                    });
                  }

                  const user =
                    results[0];

                  const role =
                    user.role_id === 1
                      ? "admin"
                      : "guide";

                  return res.json({

                    user_id:
                      user.user_id,

                    name:
                      user.user_name,

                    email:
                      user.email,

                    phone:
                      user.phone,

                    role:
                      role,
                  });
                }
              );
            },

            onFailure: (err) => {

              console.error(
                "PASSWORD CHANGE ERROR:",
                err
              );

              return res.status(401).json({
                message:
                  err?.message ||
                  "Password update failed",
              });
            },
          }
        );
      },
    }
  );
});

module.exports = router;
