import mongoose, { Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, inique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum:{
        values: ["admin", "client"],
        message: "`{VALUE}` No es un valor permitido",
        default: "client"
    }},
},{
    timestamps: true,
})

const User: Model<IUser> = mongoose.models.User || model<IUser>("User", userSchema);



export default User