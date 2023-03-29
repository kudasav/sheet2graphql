import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import Image from 'next/image'
import { NavLinks } from '@/components/NavLinks'

function MenuIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M5 6h14M5 18h14M5 12h14"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ChevronUpIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M17 14l-5-5-5 5"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function MobileNavLink({ children, ...props }) {
	return (
		<Popover.Button
			as={Link}
			className="block text-base leading-7 tracking-tight text-gray-700"
			{...props}
		>
			{children}
		</Popover.Button>
	)
}

export function Header() {
	return (
		<header>
			<nav>
				<Container className="relative z-50 flex justify-between py-8">
					<div className="relative z-10 flex items-center gap-16">
						<Link href="/" aria-label="Home">
							<img src="/logo.png" className='w-44' alt='sheet2graphql logo' />
						</Link>
						<div className="hidden lg:flex lg:gap-10">
							<NavLinks />
						</div>
					</div>
					<div className="flex items-center gap-6">
						<Popover className="lg:hidden">
							{({ open }) => (
								<>
									<Popover.Button
										className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
										aria-label="Toggle site navigation"
									>
										{({ open }) =>
											open ? (
												<ChevronUpIcon className="h-6 w-6" />
											) : (
												<MenuIcon className="h-6 w-6" />
											)
										}
									</Popover.Button>
									<AnimatePresence initial={false}>
										{open && (
											<>
												<Popover.Overlay
													static
													as={motion.div}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
												/>
												<Popover.Panel
													static
													className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
												>
													<div className="space-y-4">
														<MobileNavLink href="/">
															Home
														</MobileNavLink>
														<MobileNavLink href="/pricing">
															Pricing
														</MobileNavLink>
														<MobileNavLink href="https://docs.sheet2graphql.co" target="_blank">
															Docs
														</MobileNavLink>
														<MobileNavLink href="/contact">
															Contact
														</MobileNavLink>
													</div>
													<div className="mt-8 flex flex-col gap-4">
														<a
															href="https://dashboard.sheet2graphql.co/"
															className="text-center rounded-md border border-transparent bg-cyan-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
														>
															Log in / Sign Up
														</a>
													</div>
												</Popover.Panel>
											</>
										)}
									</AnimatePresence>
								</>
							)}
						</Popover>
						<a
							href="https://dashboard.sheet2graphql.co/"
							className="hidden lg:block inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
						>
							Log in / Sign Up
						</a>
					</div>
				</Container>
			</nav>
		</header>
	)
}
