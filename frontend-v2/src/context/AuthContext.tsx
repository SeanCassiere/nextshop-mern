import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthUser } from "../types/User";

type AuthContextType = {
	user: AuthUser | null;
	isLoggedIn: boolean;
	loginUser: (user: AuthUser) => void;
	logoutUser: () => void;
	setUser: (user: AuthUser) => void;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { value: authUser, setItemForBoth: setAuthUser } = useLocalStorage<AuthUser | null>("next-shop-user", null);

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
		(user: AuthUser) => {
			setAuthUser(user);
		},
		[setAuthUser]
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
