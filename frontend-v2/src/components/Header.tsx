import React from "react";
import { Link, useMatch } from "@tanstack/react-location";
import { Transition, Menu } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import { BiChevronDown } from "react-icons/bi";

const Header = () => {
	const match = useMatch();

	const { user, logoutUser } = useAuth();
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<header className='sticky top-0 z-50'>
			<nav className='bg-white dark:bg-gray-800'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='-mr-2 flex md:hidden'>
							<button
								onClick={() => setIsOpen((prev) => !prev)}
								type='button'
								className='bg-gray-100 dark:bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-900 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-100 dark:focus:ring-slate-900 '
								aria-controls='mobile-menu'
								aria-expanded='false'
							>
								<span className='sr-only'>Open main menu</span>
								{!isOpen ? (
									<svg
										className='block h-6 w-6'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										aria-hidden='true'
									>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
									</svg>
								) : (
									<svg
										className='block h-6 w-6'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										aria-hidden='true'
									>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
									</svg>
								)}
							</button>
						</div>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<Link to='/'>
									<>
										<img
											className='block h-8 w-auto shadow-sm'
											src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
											alt='Workflow'
										/>
									</>
								</Link>
							</div>
							<div className='hidden md:block'>
								<div className='ml-10 flex items-baseline space-x-4'>
									<Link
										to='/'
										className={`${
											match.pathname === "/"
												? "text-gray-900 dark:text-white dark:bg-gray-900 bg-gray-50 hover:bg-gray-200"
												: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
										} px-3 py-2 rounded-md text-sm font-medium`}
									>
										Shop
									</Link>

									<Link
										to='/cart'
										className={`hover:bg-gray-700 ${
											match.pathname.includes("/cart")
												? "text-gray-900 dark:text-white dark:bg-gray-900 bg-gray-50 hover:bg-gray-200"
												: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
										} px-3 py-2 rounded-md text-sm font-medium`}
									>
										Cart
									</Link>
								</div>
							</div>
						</div>
						{user ? (
							<div className='flex flex-row gap-2'>
								{user.isAdmin && (
									<Menu as='div' className='relative inline-block text-left'>
										<div>
											<Menu.Button
												className={`
											inline-flex w-full justify-center rounded-md px-2 py-2 text-sm font-medium
											dark:bg-black dark:bg-opacity-20
											text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white dark:hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 items-center`}
											>
												Admin <BiChevronDown />
											</Menu.Button>
										</div>
										<Transition
											as={React.Fragment}
											enter='transition ease-out duration-100'
											enterFrom='transform opacity-0 scale-95'
											enterTo='transform opacity-100 scale-100'
											leave='transition ease-in duration-75'
											leaveFrom='transform opacity-100 scale-100'
											leaveTo='transform opacity-0 scale-95'
										>
											<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
												<div className='px-1 py-1 '>
													<Menu.Item>
														{({ active }) => (
															<Link
																to='/login'
																className={`${
																	active
																		? "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-white"
																		: "text-gray-900"
																} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
															>
																My Admin Account
															</Link>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<button
																type='button'
																className={`${
																	active
																		? "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-white"
																		: "text-gray-900"
																} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
																onClick={logoutUser}
															>
																Admin Logout
															</button>
														)}
													</Menu.Item>
												</div>
											</Menu.Items>
										</Transition>
									</Menu>
								)}
								<Menu as='div' className='relative inline-block text-left'>
									<div>
										<Menu.Button
											className={`
											inline-flex w-full justify-center rounded-md px-2 py-2 text-sm font-medium
											dark:bg-black dark:bg-opacity-20
											text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white dark:hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 items-center`}
										>
											Account <BiChevronDown />
										</Menu.Button>
									</div>
									<Transition
										as={React.Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
											<div className='px-1 py-1 '>
												<Menu.Item>
													{({ active }) => (
														<Link
															to='/account'
															className={`${
																active ? "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-white" : "text-gray-900"
															} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
														>
															My Account
														</Link>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<button
															type='button'
															className={`${
																active ? "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-white" : "text-gray-900"
															} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
															onClick={logoutUser}
														>
															Logout
														</button>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						) : (
							<Link
								to='/login'
								className={`hover:bg-gray-700 ${
									match.pathname.includes("/login")
										? "text-gray-900 dark:text-white dark:bg-gray-900 bg-gray-50 hover:bg-gray-200"
										: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
								} px-3 py-2 rounded-md text-sm font-medium`}
							>
								Login
							</Link>
						)}
					</div>
				</div>

				<Transition
					appear={isOpen}
					show={isOpen}
					enter='transition ease-out duration-100 transform'
					enterFrom='opacity-0 scale-95'
					enterTo='opacity-100 scale-100'
					leave='transition ease-in duration-75 transform'
					leaveFrom='opacity-100 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<div className='md:hidden' id='mobile-menu'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
							<Link
								to='/'
								className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
									match.pathname === "/" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-white"
								} block px-3 py-2 rounded-md text-base font-medium`}
							>
								Shop
							</Link>

							<Link
								to='/cart'
								className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
									match.pathname.includes("/cart") ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-white"
								} block px-3 py-2 rounded-md text-base font-medium`}
							>
								Cart
							</Link>
						</div>
					</div>
				</Transition>
			</nav>
		</header>
	);
};

export default React.memo(Header);
