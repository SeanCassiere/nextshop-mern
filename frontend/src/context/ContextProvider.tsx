import React from "react";
import { AuthContextProvider } from "./AuthContext";
import { CartContextProvider } from "./CartContext";

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<AuthContextProvider>
			<CartContextProvider>{children}</CartContextProvider>
		</AuthContextProvider>
	);
};

export default React.memo(ContextProvider);
