import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_dI8Iu4MqE",
      userPoolClientId: "4rnm7g614al3l34kbas75qcjt8",

      loginWith: {
        email: true,
      },
    },
  },
});
