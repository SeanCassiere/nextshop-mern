import React from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation } from "react-query";
import { Helmet } from "react-helmet-async";

import { registerUser } from "../../api/user";
import Alert from "../../components/Alert";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { LocationGenerics } from "../../App";

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
	} = useMutation(registerUser, {
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
			<Helmet>
				<title>Sign up | Nextshop</title>
			</Helmet>
			<main>
				<section className='max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Sign Up!</h1>
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
							<FormInput
								label='Name'
								name='name'
								type='text'
								placeholder='John Doe'
								required
								value={credentials.name}
								onChange={handleChange}
							/>
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
							<FormInput
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
							<FormButton type='submit'>Sign Up</FormButton>
						</div>
					</form>
					<p className='text-gray-600 dark:text-gray-500'>
						Already have an account?&nbsp;
						<Link
							to='/login'
							search={(prev) => ({ ...prev, redirect: queryRedirect })}
							className='text-blue-800 dark:text-blue-600'
						>
							Login
						</Link>
					</p>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Register;
