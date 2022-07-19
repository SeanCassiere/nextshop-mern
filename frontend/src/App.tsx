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
	createBrowserHistory,
} from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";

import { decodeFromBinary, encodeToBinary } from "./utils/parse";

import { getPublicProductById } from "./api/products";
import { getOrderById } from "./api/order";

import ContextProvider from "./context/ContextProvider";
import { useAuth } from "./context/AuthContext";
import { getUserByIdForAdmin } from "./api/admin";
import Home from "./pages/Home";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Admin from "./pages/Admin";
import ProductEdit from "./pages/Admin/ProductEdit";
import UserEdit from "./pages/Admin/UserEdit";

export type LocationGenerics = MakeGenerics<{
	Params: { productId: string; orderId: string; userId: string };
	Search: { page?: string; redirect?: string; from?: string };
}>;

const routerHistory = createBrowserHistory();

const reactLocation = new ReactLocation<LocationGenerics>({
	history: routerHistory,
	parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
	stringifySearch: stringifySearchWith((value) => encodeToBinary(JSON.stringify(value))),
});

const queryClient = new QueryClient();

const App = () => {
	const { user } = useAuth();
	const accessToken = user?.token ?? "";

	return (
		<QueryClientProvider client={queryClient}>
			<Router
				location={reactLocation}
				routes={[
					{ path: "/", element: <Home /> },
					{
						path: "products",
						children: [
							{ path: "/", element: <NotFound /> },
							{
								path: ":productId",
								element: <Product />,
								loader: ({ params: { productId } }) =>
									queryClient.getQueryData(["products", productId]) ??
									queryClient.fetchQuery(["products", productId], () => getPublicProductById(productId)),
							},
						],
					},
					{
						path: "order",
						children: [
							{ path: "/", element: <NotFound /> },
							{
								path: ":orderId",
								element: (
									<PrivateOnlyRoute>
										<Order />
									</PrivateOnlyRoute>
								),
								loader: ({ params: { orderId } }) =>
									queryClient.getQueryData(["orders", orderId]) ??
									queryClient.fetchQuery(["orders", orderId], () => getOrderById({ token: accessToken, orderId })),
							},
						],
					},
					{ path: "login", element: <Login /> },
					{ path: "register", element: <Register /> },
					{ path: "cart", element: <Cart /> },
					{
						path: "account",
						element: (
							<PrivateOnlyRoute>
								<Account />
							</PrivateOnlyRoute>
						),
					},
					{ path: "checkout", element: <Checkout /> },
					{
						path: "admin",
						children: [
							{
								path: "/",
								element: (
									<PrivateOnlyRoute admin>
										<Admin selectedTab='users' />
									</PrivateOnlyRoute>
								),
							},
							{
								path: "users",
								children: [
									{
										path: "/",
										element: (
											<PrivateOnlyRoute admin>
												<Admin selectedTab='users' />
											</PrivateOnlyRoute>
										),
									},
									{
										path: ":userId",
										element: (
											<PrivateOnlyRoute admin>
												<UserEdit />
											</PrivateOnlyRoute>
										),
										loader: ({ params: { userId } }) =>
											queryClient.getQueryData(["users", userId]) ??
											queryClient.fetchQuery(["users", userId], () =>
												getUserByIdForAdmin({ token: accessToken, userId })
											),
									},
								],
							},
							{
								path: "products",
								children: [
									{
										path: "/",
										element: (
											<PrivateOnlyRoute admin>
												<Admin selectedTab='products' />
											</PrivateOnlyRoute>
										),
									},
									{
										path: ":productId",
										element: (
											<PrivateOnlyRoute admin>
												<ProductEdit />
											</PrivateOnlyRoute>
										),
										loader: ({ params: { productId } }) =>
											queryClient.getQueryData(["products", productId]) ??
											queryClient.fetchQuery(["products", productId], () => getPublicProductById(productId)),
									},
								],
							},
							{
								path: "orders",
								element: (
									<PrivateOnlyRoute admin>
										<Admin selectedTab='orders' />
									</PrivateOnlyRoute>
								),
							},
						],
					},
					{ path: "not-found", element: <NotFound /> },
					{ element: <Navigate to='/not-found' /> },
				]}
			>
				<Outlet />
				<ReactQueryDevtools initialIsOpen={false} />
			</Router>
		</QueryClientProvider>
	);
};

const ProvidedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<React.Fragment>
			<ContextProvider>
				<HelmetProvider>
					<App />
				</HelmetProvider>
			</ContextProvider>
		</React.Fragment>
	);
};

const PrivateOnlyRoute: React.FC<{ children: React.ReactNode; admin?: true }> = ({ children, admin }) => {
	const match = useMatch();

	const { user } = useAuth();

	if (!user) {
		return <Navigate to='/login' search={(prev) => ({ ...prev, redirect: match.pathname })} />;
	}

	if (admin && user.isAdmin === false) {
		return <Navigate to='/' search={(prev) => ({ ...prev })} replace />;
	}
	return <React.Fragment>{children}</React.Fragment>;
};

export default ProvidedApp;
