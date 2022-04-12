import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcryptjs from "bcryptjs";
import { jwt, validations } from "../../../utils";

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
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "", name="" } = req.body;



  if (password.length < 6) {
    return res.status(400).json({ message: "FAILED - password" });
  }


    if (name.length < 6) {
    return res.status(400).json({ message: "FAILED - name" });
    }


    if (!validations.isValidEmail(email)){
    return res.status(400).json({ message: "FAILED - email" });
    }

    await db.connect();
    const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    await db.disconnect();
    return res.status(400).json({ message: "Correo esta siendo utilizado" });
  }

const newUser = new User({
    email: email.toLowerCase(),
    password: bcryptjs.hashSync(password),
    name: name.toLowerCase(),
    role: "client",
})

try {
    await newUser.save({validateBeforeSave: true});
} catch (error) {
    console.log("🚀 ~ file: register.ts ~ line 63 ~ registerUser ~ error", error)
    return res.status(500).json({ message: "Check logs" });
}


  const { role, _id } = newUser;

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
