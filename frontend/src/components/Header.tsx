import React from "react";
import { Link, useMatch } from "@tanstack/react-location";
import { Transition, Menu } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { RiAdminLine, RiShoppingBasketLine, RiStore2Line } from "react-icons/ri";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
	const match = useMatch();

	const { user, logoutUser } = useAuth();
	const { resetCartContext } = useCart();
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<header className='sticky top-0 z-50 shadow-sm'>
			<nav className='bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='-mr-2 flex md:hidden'>
							<button
								onClick={() => setIsOpen((prev) => !prev)}
								type='button'
								className='bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-100'
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
											className='block h-8 w-auto'
											src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
											alt='Workflow'
										/>
									</>
								</Link>
							</div>
							<div className='hidden md:block'>
								<div className='ml-10 flex items-baseline space-x-2'>
									<Link
										to='/'
										className={`${
											match.pathname === "/"
												? "text-gray-900 bg-gray-50 hover:bg-gray-200"
												: "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
										} px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
									>
										<RiStore2Line className='text-lg' />
										Shop
									</Link>

									<Link
										to='/cart'
										className={`${
											match.pathname.includes("/cart")
												? "text-gray-900 bg-gray-50 hover:bg-gray-200"
												: "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
										} px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
									>
										<RiShoppingBasketLine className='text-lg' />
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
												className='
											inline-flex w-full justify-center rounded-md px-2 py-2 text-lg md:text-sm font-medium	text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 items-center'
											>
												<span className='hidden md:inline-block'>Admin&nbsp;</span>
												<RiAdminLine />
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
											<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none px-1 py-1'>
												<Menu.Item>
													{({ active }) => (
														<span>
															<Link
																to='/admin/orders'
																className={`${
																	active ? "bg-gray-200 text-gray-700" : "text-gray-900"
																} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
															>
																Orders
															</Link>
														</span>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<span>
															<Link
																to='/admin/products'
																className={`${
																	active ? "bg-gray-200 text-gray-700" : "text-gray-900"
																} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
															>
																Products
															</Link>
														</span>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<span>
															<Link
																to='/admin/users'
																className={`${
																	active ? "bg-gray-200 text-gray-700" : "text-gray-900"
																} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
															>
																Users
															</Link>
														</span>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								)}
								<Menu as='div' className='relative inline-block text-left'>
									<div>
										<Menu.Button
											className='
											inline-flex w-full justify-center rounded-md px-2 py-2 text-lg md:text-sm font-medium	text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 items-center'
										>
											<span className='hidden md:inline-block'>Account&nbsp;</span>
											<BiChevronDown />
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
										<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none px-1 py-1'>
											<Menu.Item>
												{({ active }) => (
													<span>
														<Link
															to='/account'
															className={`${
																active ? "bg-gray-200 text-gray-700" : "text-gray-900"
															} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
														>
															My Account
														</Link>
													</span>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button
														type='button'
														className={`${
															active ? "bg-gray-200 text-gray-700" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
														onClick={() => {
															resetCartContext();
															logoutUser();
														}}
													>
														Logout
													</button>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						) : (
							<Link
								to='/login'
								className={`${
									match.pathname.includes("/login")
										? "text-gray-900 bg-gray-50 hover:bg-gray-200"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
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
								className={`hover:bg-gray-100 ${
									match.pathname === "/" ? "text-gray-900" : "text-gray-500"
								} px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
							>
								<RiStore2Line className='text-lg' />
								Shop
							</Link>

							<Link
								to='/cart'
								className={`hover:bg-gray-100 ${
									match.pathname.includes("/cart") ? "text-gray-900" : "text-gray-500"
								} px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
							>
								<RiShoppingBasketLine className='text-lg' />
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
