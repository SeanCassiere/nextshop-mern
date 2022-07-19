import asyncHandler from "express-async-handler";
import User, { UserDocument } from "../models/userModel";

import generateToken from "../utils/generateToken";
import { CustomRequest } from "../utils/CustomInterfaces";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: email.toLowerCase() });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc Register a new user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email: email.toLowerCase() });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email.toLowerCase() || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Get all users for Admin
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const pageSize = Number(req.query.pageSize) || 8;
	const page = Number(req.query.pageNumber) || 1;

	const count = await User.countDocuments({});
	const users = await User.find({})
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	const pagination = { Page: page, PageSize: pageSize, TotalRecords: count, TotalPages: Math.ceil(count / pageSize) };
	res.setHeader("X-Pagination", JSON.stringify(pagination)).json([...users]);
});

// @desc Delete user by id for Admin
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		res.json({ message: "User removed" });
	} else {
		res.status(404);
		throw new Error("User not found");
	}

	res.json(user);
});

// @desc Get user by ID for Admin
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select("-password");

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Update user by Admin
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req: CustomRequest<UserDocument>, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email.toLowerCase() || user.email;

		if (String(req.user._id) === String(user._id) && user.isAdmin !== req.body.isAdmin) {
			res.status(401);
			throw new Error("Admin cannot remove their own Admin Status");
		} else if (req.body.isAdmin !== undefined) {
			user.isAdmin = req.body.isAdmin;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser };
