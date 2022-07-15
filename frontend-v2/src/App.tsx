import React from "react";
import {
	MakeGenerics,
	Outlet,
	ReactLocation,
	Router,
	parseSearchWith,
	stringifySearchWith,
} from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { decodeFromBinary, encodeToBinary } from "./utils/parse";

import Home from "./pages/Home";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import { getPublicProductById } from "./api/products";

export type LocationGenerics = MakeGenerics<{
	Params: { productId: string };
	Search: { page?: string };
}>;

const reactLocation = new ReactLocation<LocationGenerics>({
	parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
	stringifySearch: stringifySearchWith((value) => encodeToBinary(JSON.stringify(value))),
});

const queryClient = new QueryClient();

const App = () => {
	return (
		<React.Fragment>
			<QueryClientProvider client={queryClient}>
				<Router
					location={reactLocation}
					routes={[
						{
							path: "/",
							element: <Home />,
						},
						{
							path: "/products",
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
					]}
				>
					<Outlet />
					<ReactQueryDevtools initialIsOpen={false} />
				</Router>
			</QueryClientProvider>
		</React.Fragment>
	);
};

export default App;
