import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient, useMutation } from "react-query";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import OrderHistoryItem from "./OrderHistoryItem";
import StyledLink from "../../components/StyledLink";
import { getAuthUserProfile, updateAuthUser } from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types/User";
import { getAuthUserOrders } from "../../api/order";
import { Order } from "../../types/Order";

const Account = () => {
	const queryClient = useQueryClient();
	const { user, setUser } = useAuth();
	const token = user?.token ?? "";

	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [profileValues, setProfileValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });

	const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (
			e?.target?.name === "email" ||
			e?.target?.name === "password" ||
			e?.target?.name === "name" ||
			e?.target?.name === "confirmPassword"
		) {
			setProfileValues((credentials) => ({
				...credentials,
				[e.target.name]: e.target.value,
			}));
		}

		if (e?.target?.name === "password" || e?.target?.name === "confirmPassword") {
			setPasswordError(null);
		}
	};

	const profileQuery = useQuery<User, any>(["profile"], () => getAuthUserProfile({ token }), {
		onSuccess: (data) => {
			setUser({
				_id: data._id,
				name: data.name,
				isAdmin: data.isAdmin,
				email: data.email,
			});
			setProfileValues((prev) => ({ ...prev, name: data.name, email: data.email }));
		},
	});

	const { mutate: updateProfile } = useMutation(updateAuthUser, {
		onError: () => {
			setProfileValues({ name: user?.name ?? "", email: user?.email ?? "", password: "", confirmPassword: "" });
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["profile"]);
			setProfileValues((prev) => ({ ...prev, password: "", confirmPassword: "" }));
		},
	});

	const ordersQuery = useQuery<Order[], any>(["orders"], () => getAuthUserOrders({ token }));

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Account | Nextshop</title>
			</Helmet>
			<main>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid gap-4 grid-cols-1 md:grid-cols-12'>
							<div className='md:col-span-4'>
								<h2 className='text-3xl mb-4 font-bold tracking-tight text-gray-900'>My account</h2>
								<p className='mt-2 text-sm text-gray-500'>Check and update your Nextshop profile.</p>
								<form
									onSubmit={(e) => {
										e.preventDefault();

										if (
											profileValues.password.trim().length > 0 &&
											profileValues.password.trim() !== profileValues.confirmPassword.trim()
										) {
											setPasswordError("Passwords do not match");
											return;
										}

										updateProfile({
											token,
											name: profileValues.name,
											email: profileValues.email,
											password: profileValues.password,
										});
									}}
									className='pt-3 flex flex-col gap-4'
								>
									{passwordError && (
										<Alert label='Uh oh!' variant='warning'>
											{passwordError}
										</Alert>
									)}
									{profileQuery.isError && (
										<Alert label='Uh oh!' variant='danger'>
											{profileQuery.error as unknown as string}
										</Alert>
									)}
									<div className='flex flex-col gap-2'>
										<Input
											label='Name'
											type='text'
											name='name'
											placeholder='John Doe'
											value={profileValues.name}
											onChange={handleProfileChange}
											required
											disabled={profileQuery.isLoading}
										/>
										<Input
											label='Email address'
											type='email'
											name='email'
											placeholder='john@example.com'
											value={profileValues.email}
											onChange={handleProfileChange}
											disabled={true}
											required
										/>
										<Input
											label='Password'
											type='password'
											name='password'
											placeholder='Your password'
											value={profileValues.password}
											onChange={handleProfileChange}
											disabled={profileQuery.isLoading}
										/>
										<Input
											label='Re-type password'
											type='password'
											name='confirmPassword'
											placeholder='Re-type your password'
											value={profileValues.confirmPassword}
											onChange={handleProfileChange}
											disabled={profileQuery.isLoading}
										/>
									</div>
									<div>
										<Button type='submit'>Update</Button>
									</div>
								</form>
							</div>
							<div className='md:col-span-8 p-0 md:p-2'>
								<h2 className='text-2xl mb-4 font-bold tracking-tight text-gray-900'>Order history</h2>
								<p className='mt-2 text-sm text-gray-500'>
									Check the status of recent orders, manage returns, and discover similar products.
								</p>
								<div className='flex flex-col gap-5 pt-4'>
									{ordersQuery.data && ordersQuery.data.length === 0 ? (
										<p className='mt-2 text-sm text-gray-500'>
											You haven't made any orders with Nextshop just yet. Head over to the&nbsp;
											<StyledLink to='/'>shop</StyledLink>&nbsp;and make an order!
										</p>
									) : (
										ordersQuery.data?.map((order) => (
											<React.Fragment key={`order-${order._id}`}>
												<OrderHistoryItem order={order} />
											</React.Fragment>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Account;
