import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation } from '@tanstack/react-query';
import { Helmet } from "react-helmet-async";

import { RegisterDTO, registerUser } from "../../api/user";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Header from "../../components/Header";
import StyledLink from "../../components/StyledLink";
import { useAuth } from "../../context/AuthContext";
import { LocationGenerics } from "../../App";
import { ResponseParsed } from "../../api/base";
import { AuthUser } from "../../types/User";

const Register = () => {
	const navigate = useNavigate();
	const queryRedirect = useSearch<LocationGenerics>().redirect;
	const redirect = queryRedirect || "/";
	const { loginUser: setLoggedInUser } = useAuth();

	const [credentials, setCredentials] = React.useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [passwordError, setPasswordError] = React.useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (
			e?.target?.name === "email" ||
			e?.target?.name === "password" ||
			e?.target?.name === "name" ||
			e?.target?.name === "confirmPassword"
		) {
			setCredentials({
				...credentials,
				[e.target.name]: e.target.value,
			});
		}

		if (e?.target?.name === "password" || e?.target?.name === "confirmPassword") {
			setPasswordError(null);
		}
	};

	const {
		mutate: register,
		error,
		isError,
	} = useMutation<ResponseParsed<AuthUser>, any, RegisterDTO>(registerUser, {
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
				<title>Sign up | Nextshop</title>
			</Helmet>
			<main>
				<section className='max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>Sign Up!</h1>
					<form
						className='mt-4 py-3'
						onSubmit={(evt) => {
							evt.preventDefault();
							if (credentials.password.trim() !== credentials.confirmPassword.trim()) {
								setPasswordError("Passwords do not match");
								return;
							}
							register({ name: credentials.name, email: credentials.email, password: credentials.password.trim() });
						}}
					>
						{passwordError && <Alert label='Uh oh!' message={passwordError} variant='warning' />}
						{isError && <Alert label='Uh oh!' message={error as unknown as string} variant='danger' />}
						<div className='flex flex-col gap-4'>
							<Input
								label='Name'
								name='name'
								type='text'
								placeholder='John Doe'
								required
								value={credentials.name}
								onChange={handleChange}
							/>
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
							<Input
								label='Re-type password'
								type='password'
								name='confirmPassword'
								placeholder='Re-type your password'
								required
								value={credentials.confirmPassword}
								onChange={handleChange}
							/>
						</div>
						<div className='pt-3'>
							<Button type='submit'>Sign Up</Button>
						</div>
					</form>
					<p className='text-gray-600'>
						Already have an account?&nbsp;
						<StyledLink to='/login' search={(prev) => ({ ...prev, redirect: queryRedirect })} className='text-blue-800'>
							Login
						</StyledLink>
					</p>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Register;
