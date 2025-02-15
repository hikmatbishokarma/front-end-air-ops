"use client";
import * as React from "react";
import { SignInPage } from "@toolpad/core/SignInPage";
import type { Session } from "@toolpad/core/AppProvider";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { SIGN_IN } from "../lib/graphql/queries/auth";
import useGql from "../lib/graphql/gql";

// const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (formData.get("password") === "password") {
//         resolve({
//           user: {
//             name: "Bharat Kashyap",
//             email: formData.get("email") || "",
//             image: "https://avatars.githubusercontent.com/u/19550456",
//           },
//         });
//       }
//       reject(new Error("Incorrect credentials."));
//     }, 1000);
//   });
// };

const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
  try {
    const data = await useGql({
      query: SIGN_IN,
      queryName: "signIn",
      queryType: "query-without-edge",
      variables: {
        input: {
          userName: formData.get("email"),
          password: formData.get("password"),
        },
      },
    });

    if (!data || !data.user) {
      throw new Error("Invalid credentials.");
    }

    return {
      user: {
        name: data.user.name,
        email: data.user.email,
        image:
          data.user.image || "https://avatars.githubusercontent.com/u/19550456", // Default image
      },
    };
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <SignInPage
      providers={[{ id: "credentials", name: "Credentials" }]}
      signIn={async (provider, formData, callbackUrl) => {
        console.log("Raw formData:", formData);
        console.log("formData.entries():", Array.from(formData.entries())); // Check if email/password exist

        // Demo session
        try {
          const session = await fakeAsyncGetSession(formData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || "/", { replace: true });
            return {};
          }
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : "An error occurred",
          };
        }
        return {};
      }}
    />
  );
}
