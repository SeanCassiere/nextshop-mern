import React from "react";
import {
	MakeGenerics,
	Outlet,
	ReactLocation,
	Router,
	parseSearchWith,
	stringifySearchWith,
	useMatch,
	Navigate,
} from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { decodeFromBinary, encodeToBinary } from "./utils/parse";

import { getPublicProductById } from "./api/products";

import Home from "./pages/Home";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

export type LocationGenerics = MakeGenerics<{
	Params: { productId: string };
	Search: { page?: string; redirect?: string };
}>;

const reactLocation = new ReactLocation<LocationGenerics>({
	parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
	stringifySearch: stringifySearchWith((value) => encodeToBinary(JSON.stringify(value))),
});

const queryClient = new QueryClient();

const App = () => {
	return (
		<React.Fragment>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<Router
						location={reactLocation}
						routes={[
							{
								path: "/",
								element: <Home />,
							},
							{
								path: "products",
								children: [
									{
										path: "/",
										element: <NotFound />,
									},
									{
										path: ":productId",
										element: <Product />,
										loader: ({ params: { productId } }) =>
											queryClient.getQueryData(["products", productId]) ??
											queryClient.fetchQuery(["products", productId], () =>
												getPublicProductById(productId).then(() => ({}))
											),
									},
								],
							},
							{
								path: "login",
								element: <Login />,
							},
							{
								path: "register",
								element: <Register />,
							},
							{
								path: "admin",
								children: [
									{
										path: "/",
										element: (
											<PrivateOnlyRoute admin>
												<NotFound />
											</PrivateOnlyRoute>
										),
									},
								],
							},
						]}
					>
						<Outlet />
						<ReactQueryDevtools initialIsOpen={false} />
					</Router>
				</QueryClientProvider>
			</AuthProvider>
		</React.Fragment>
	);
};

const PrivateOnlyRoute: React.FC<{ children: React.ReactNode; admin?: true }> = ({ children, admin }) => {
	const match = useMatch();

	const { isLoggedIn, user } = useAuth();

	if (!user) {
		return <Navigate to='/login' search={(prev) => ({ ...prev, redirect: match.pathname })} />;
	}

	if (admin && user.isAdmin === false) {
		return <Navigate to='/' search={(prev) => ({ ...prev })} replace />;
	}
	return <React.Fragment>{children}</React.Fragment>;
};

export default App;
