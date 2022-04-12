import { db } from ".";
import { User } from "../models";
import bcryptjs from "bcryptjs";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect();

  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) return null;
  if (!bcryptjs.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return { role, name, _id };
};

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });
  if (user) {
    await db.disconnect();
    const { role, name, _id, email } = user;
    return {
      role,
      name,
      _id,
      email,
    };
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "oAuth",
    role: "client",
  });
  await newUser.save();

  const { role, name, _id, email } = newUser;

  return {
    role,
    name,
    _id,
    email,
  };
};
