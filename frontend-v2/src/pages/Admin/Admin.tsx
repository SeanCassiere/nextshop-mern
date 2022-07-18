import { Link, useMatch, useNavigate } from "@tanstack/react-location";
import React, { useEffect, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../components/Header";
import { classNames } from "../../utils/tw";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";

type TabOptions = "users" | "products" | "orders";

const tabs: { name: string; href: string; identifier: TabOptions }[] = [
	{ name: "Orders", href: "/admin/orders", identifier: "orders" },
	{ name: "Products", href: "/admin/products", identifier: "products" },
	{ name: "Users", href: "/admin/users", identifier: "users" },
];

const Admin: React.FC<{ selectedTab: TabOptions }> = ({ selectedTab }) => {
	const navigate = useNavigate();
	const pathName = useMatch().pathname;
	const [currentTab, setCurrentTab] = useState<TabOptions>(selectedTab);

	const tabId = useId();

	useEffect(() => {
		setCurrentTab(selectedTab);
	}, [pathName, selectedTab]);

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>
					{currentTab.toLowerCase() === "users"
						? "Users"
						: currentTab.toLowerCase() === "products"
						? "Products"
						: currentTab.toLowerCase() === "orders"
						? "Orders"
						: ""}{" "}
					| Nextshop
				</title>
			</Helmet>
			<main className='min-h-[93vh] flex flex-col'>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<h2 className='text-3xl mb-4 font-bold tracking-tight text-gray-900'>Admin</h2>
						<p className='mt-2 text-sm text-gray-500'>Manage the Nextshop shopping platform.</p>
					</div>
				</section>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div>
							<div className='sm:hidden'>
								<label htmlFor={tabId} className='sr-only'>
									Select a tab
								</label>
								{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
								<select
									id={tabId}
									name='tabs'
									className='block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
									defaultValue={currentTab}
									onChange={(evt) => {
										const name = evt.currentTarget.value;
										const option = tabs.find((tab) => tab.identifier === name);
										if (!option) return;
										navigate({ to: option.href });
									}}
								>
									{tabs.map((tab) => (
										<option key={`select-tab-mobile-${tab.identifier}`} value={tab.identifier}>
											{tab.name}
										</option>
									))}
								</select>
							</div>
							<div className='hidden sm:block'>
								<nav className='flex space-x-4' aria-label='Tabs'>
									{tabs.map((tab) => (
										<Link
											key={tab.name}
											to={tab.href}
											className={classNames(
												tab.identifier === currentTab
													? "bg-gray-100 text-gray-700"
													: "text-gray-500 hover:text-gray-700",
												"px-3 py-2 font-medium text-sm rounded-md"
											)}
											aria-current={tab.identifier === currentTab ? "page" : undefined}
										>
											{tab.name}
										</Link>
									))}
								</nav>
							</div>
						</div>
					</div>
				</section>
				<section className='flex-grow py-4 bg-gray-50'>
					<div className='max-w-7xl mx-auto px-4 sm:pt-2 sm:px-6 lg:px-8'>
						{currentTab === "users" && <AdminUsers />}
						{currentTab === "products" && <AdminProducts />}
						{currentTab === "orders" && <AdminOrders />}
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Admin;
