import mongoose, { Document, Model, Schema, HookNextFunction } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserInt {
	name: string;
	email: string;
	password: string;
	isAdmin: boolean;
}

export interface UserDocument extends UserInt, Document {
	matchPassword: (password: string) => boolean;
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre<UserDocument>("save", async function (next: HookNextFunction) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("user", userSchema);

export default User;
