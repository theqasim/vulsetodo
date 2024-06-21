import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    setCookie({ res }, "next-auth.session-token", "", {
      maxAge: -1,
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(401).json({ error: "No active session" });
  }
}
