import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcryptjs from "bcryptjs";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        name: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await db.connect();
  const isUserExist = await User.findOne({ email });
  await db.disconnect();

  if (!isUserExist) {
    return res.status(400).json({ message: "FAILED - email" });
  }

  if (!bcryptjs.compareSync(password, isUserExist.password!)) {
    return res.status(400).json({ message: "FAILED - password" });
  }

  const { role, name, _id } = isUserExist;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
