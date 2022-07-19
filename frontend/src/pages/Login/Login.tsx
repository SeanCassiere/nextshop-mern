import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation } from '@tanstack/react-query';
import { Helmet } from "react-helmet-async";

import { LoginDTO, loginUser } from "../../api/user";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Header from "../../components/Header";
import StyledLink from "../../components/StyledLink";
import { useAuth } from "../../context/AuthContext";
import { LocationGenerics } from "../../App";
import { ResponseParsed } from "../../api/base";
import { AuthUser } from "../../types/User";

const Login = () => {
	const navigate = useNavigate();
	const queryRedirect = useSearch<LocationGenerics>().redirect;
	const redirect = queryRedirect || "/";
	const { loginUser: setLoggedInUser } = useAuth();

	const [credentials, setCredentials] = React.useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.name === "email" || e?.target?.name === "password") {
			setCredentials({
				...credentials,
				[e.target.name]: e.target.value,
			});
		}
	};

	const {
		mutate: login,
		error,
		isError,
	} = useMutation<ResponseParsed<AuthUser>, any, LoginDTO>(loginUser, {
		onSuccess: (data) => {
			if (data?.data._id) {
				setLoggedInUser(data.data);
				navigate({ to: redirect });
			}
		},
	});
	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Sign in | Nextshop</title>
			</Helmet>
			<main>
				<section className='max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>Sign In</h1>
					<form
						className='mt-4 py-3'
						onSubmit={(evt) => {
							evt.preventDefault();
							login({ email: credentials.email, password: credentials.password });
						}}
					>
						{isError && <Alert label='Uh oh!' message={error as unknown as string} variant='danger' />}
						<div className='flex flex-col gap-4'>
							<Input
								label='Email address'
								name='email'
								type='email'
								placeholder='john@example.com'
								required
								value={credentials.email}
								onChange={handleChange}
							/>
							<Input
								label='Password'
								type='password'
								name='password'
								placeholder='Your password'
								required
								value={credentials.password}
								onChange={handleChange}
							/>
						</div>
						<div className='pt-3'>
							<Button type='submit'>Sign In</Button>
						</div>
					</form>
					<p className='text-gray-600'>
						New Customer?&nbsp;
						<StyledLink to='/register' search={(prev) => ({ ...prev, redirect: queryRedirect })}>
							Register
						</StyledLink>
					</p>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Login;
