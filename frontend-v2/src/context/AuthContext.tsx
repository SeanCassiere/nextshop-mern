import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthUser, User } from "../types/User";

type AuthContextType = {
	user: AuthUser | null;
	isLoggedIn: boolean;
	loginUser: (user: AuthUser) => void;
	logoutUser: () => void;
	setUser: (user: User) => void;
};

const defaultValues: AuthContextType = {
	user: null,
	isLoggedIn: false,
	loginUser: () => {},
	logoutUser: () => {},
	setUser: () => {},
};

const AuthContext = React.createContext<AuthContextType>(defaultValues);

export const useAuth = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [authUser, setAuthUser] = useLocalStorage<AuthUser | null>("next-shop-user", null);

	const loginUser = React.useCallback(
		(user: AuthUser) => {
			setAuthUser(user);
		},
		[setAuthUser]
	);

	const logoutUser = React.useCallback(() => {
		setAuthUser(null);
	}, [setAuthUser]);

	const setUser = React.useCallback(
		(user: User) => {
			if (!authUser) {
				return logoutUser();
			}
			const setObject = { ...authUser, _id: user._id, name: user.name, isAdmin: user.isAdmin, email: user.email };
			setAuthUser(setObject);
		},
		[authUser, logoutUser, setAuthUser]
	);

	return (
		<AuthContext.Provider
			value={{
				user: authUser,
				isLoggedIn: Boolean(authUser),
				loginUser: loginUser,
				logoutUser: logoutUser,
				setUser: setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
