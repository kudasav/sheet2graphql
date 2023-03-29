import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { Dialog, Menu, Transition } from '@headlessui/react'
import client from "../apollo-client-server";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import context from "./pageContext";
import Cookies from 'js-cookie'

import {
	BellIcon,
	ClockIcon,
	CreditCardIcon,
	HomeIcon,
	MenuAlt1Icon,
	QuestionMarkCircleIcon,
	ShieldCheckIcon,
	XIcon,
} from '@heroicons/react/outline'
import {
	ChevronDownIcon,
	SearchIcon,
} from '@heroicons/react/solid'

const navigation = [
	{ name: 'Projects', href: '/', icon: HomeIcon, current: true },
	{ name: 'Usage', href: '/usage', icon: ClockIcon, current: false },
	{ name: 'Billing', href: '/billing', icon: CreditCardIcon},
	{ name: 'Documentation', href: 'https://docs.sheet2graphql.co', icon: QuestionMarkCircleIcon, external: true },
]

const secondaryNavigation = [
	{ name: 'Privacy', href: 'https://sheet2graphql.co/privacy', icon: ShieldCheckIcon, external: true }
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function Layout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const router = useRouter()
	const location = router.route
	const user = children.props.user

	if (location == "/login" || location == "/oauth") {
		return <>{children}</>
	}

	let logout = ()=>{
		Cookies.remove('token')
        window.location = '/login'
	}

	return (
		<>
			<div className="min-h-screen">
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>

						<div className="fixed inset-0 flex z-40">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-cyan-700">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute top-0 right-0 -mr-12 pt-2">
											<button
												type="button"
												className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className="flex-shrink-0 flex items-center px-4">
										<a href="/">
											<img
												className="h-8 w-auto"
												src="/images/logo_white.png"
												alt="sheets2graphql logo"
												referrerPolicy="no-referrer"
											/>
										</a>
									</div>
									<nav
										className="mt-5 flex-shrink-0 h-full divide-y divide-cyan-800 overflow-y-auto"
										aria-label="Sidebar"
									>
										<div className="px-2 space-y-1">
											{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className={classNames(
														item.href == location
															? 'bg-cyan-800 text-white'
															: 'text-cyan-100 hover:text-white hover:bg-cyan-600',
														'group flex items-center px-2 py-2 text-base font-medium rounded-md'
													)}
													aria-current={item.href == location ? 'page' : undefined}

												>
													<item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200" aria-hidden="true" />
													{item.name}
												</a>
											))}
										</div>
										<div className="mt-6 pt-6">
											<div className="px-2 space-y-1">
												{secondaryNavigation.map((item) => (
													<a
														key={item.name}
														href={item.href}
														className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-cyan-100 hover:text-white hover:bg-cyan-600"
													>
														<item.icon className="mr-4 h-6 w-6 text-cyan-200" aria-hidden="true" />
														{item.name}
													</a>
												))}
											</div>
										</div>
									</nav>
								</Dialog.Panel>
							</Transition.Child>
							<div className="flex-shrink-0 w-14" aria-hidden="true">
								{/* Dummy element to force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex flex-col flex-grow bg-cyan-700 pt-5 pb-4 overflow-y-auto">
						<div className="flex items-center flex-shrink-0 px-4">
							<a href="/">
								<img
									className="h-8 w-auto"
									src="/images/logo_white.png"
									alt="sheets2graphql logo"
								/>
							</a>
						</div>

						<nav className="mt-14 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto" aria-label="Sidebar">
							<div className="px-2 space-y-1">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className={classNames(
											item.href == location ? 'bg-cyan-800 text-white' : 'text-cyan-100 hover:text-white hover:bg-cyan-600',
											'group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md'
										)}
										aria-current={item.href == location ? 'page' : undefined}
										target={item.external ? "_blank" : ""}
									>
										<item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200" aria-hidden="true" />
										{item.name}
									</a>
								))}
							</div>
							<div className="mt-6 pt-6">
								<div className="px-2 space-y-1">
									{secondaryNavigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className={classNames(
												item.href == location ? 'bg-cyan-800 text-white' : 'text-cyan-100 hover:text-white hover:bg-cyan-600',
												'group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md'
											)}
											aria-current={item.href == location ? 'page' : undefined}
											target={item.external ? "_blank" : ""}
										>
											<item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200" aria-hidden="true" />
											{item.name}
										</a>
									))}
								</div>
							</div>
						</nav>
					</div>
				</div>

				<div className="lg:pl-72 flex flex-col flex-1">
					<div className="relative shadow z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
						<button
							type="button"
							className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						{/* Search bar */}
						<div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
							<div className="flex-1 flex">
								{location == '/' &&
									<form className="w-full flex md:ml-0" action="/" method="GET">
										<label htmlFor="search-field" className="sr-only">
											Search
										</label>
										<div className="relative w-full text-gray-400 focus-within:text-gray-600">
											<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" aria-hidden="true">
												<SearchIcon className="h-5 w-5" aria-hidden="true" />
											</div>
											<input
												id="search-field"
												name="name"
												defaultValue={children.props.query.name}
												className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
												placeholder="Search Projects"
												type="search"
											/>
										</div>
									</form>
								}
							</div>
							<div className="ml-4 flex items-center md:ml-6">
								<button
									type="button"
									className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
								>
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>

								{/* Profile dropdown */}
								<Menu as="div" className="ml-3 relative">
									<div>
										<Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
											{user && user.picture ? 
												<img
													className="h-8 w-8 rounded-full"
													src={user.picture}
													alt="profile"
													referrerPolicy="no-referrer"
												/>
												:
												<span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
													<svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
														<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg>
												</span>
											}
											<span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
												<span className="sr-only">Open user menu for </span>{user && user.fullName}
											</span>
											<ChevronDownIcon
												className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
												aria-hidden="true"
											/>
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<a
														href="/settings"
														className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
													>
														Settings
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button
														onClick={logout}
														className={classNames(active ? 'bg-gray-100' : '', 'w-full text-left block px-4 py-2 text-sm text-gray-700')}
													>
														Logout
													</button>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>
					{children}
				</div>
			</div>
		</>
	)
}

Layout.getInitialProps = async props => {
	return {};
}

export default context(Layout);