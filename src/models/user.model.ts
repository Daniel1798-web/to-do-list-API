import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  salt:string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: {type: String},
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/*UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err: any) {
    next(err as mongoose.CallbackError);
  }
});*/

const User = mongoose.model<IUser>("User", UserSchema);
export default User;