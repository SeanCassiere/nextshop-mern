import React from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation } from "react-query";

import { loginUser } from "../../api/user";
import Alert from "../../components/Alert";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { LocationGenerics } from "../../App";

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
	} = useMutation(loginUser, {
		onSuccess: (data) => {
			if (data?._id) {
				setLoggedInUser(data);
				navigate({ to: redirect });
			}
		},
	});
	return (
		<React.Fragment>
			<Header />
			<main>
				<section className='max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Sign In</h1>
					<form
						className='mt-4 py-3'
						onSubmit={(evt) => {
							evt.preventDefault();
							login({ email: credentials.email, password: credentials.password });
						}}
					>
						{isError && <Alert label='Uh oh!' message={error as unknown as string} variant='danger' />}
						<div className='flex flex-col gap-4'>
							<FormInput
								label='Email address'
								name='email'
								type='email'
								placeholder='john@example.com'
								required
								value={credentials.email}
								onChange={handleChange}
							/>
							<FormInput
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
							<FormButton type='submit'>Sign In</FormButton>
						</div>
					</form>
					<p className='text-gray-600 dark:text-gray-500'>
						New Customer?&nbsp;
						<Link
							to='/register'
							search={(prev) => ({ ...prev, redirect: queryRedirect })}
							className='text-blue-800 dark:text-blue-600'
						>
							Register
						</Link>
					</p>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Login;
