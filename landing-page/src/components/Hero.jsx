import { useId, useRef, useState } from 'react'
import { Container } from '@/components/Container'

function BackgroundIllustration(props) {
	let id = useId()

	return (
		<div {...props}>
			<svg
				viewBox="0 0 1026 1026"
				fill="none"
				aria-hidden="true"
				className="absolute inset-0 h-full w-full animate-spin-slow"
			>
				<path
					d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
					stroke="#D4D4D4"
					strokeOpacity="0.7"
				/>
				<path
					d="M513 1025C230.23 1025 1 795.77 1 513"
					stroke={`url(#${id}-gradient-1)`}
					strokeLinecap="round"
				/>
				<defs>
					<linearGradient
						id={`${id}-gradient-1`}
						x1="1"
						y1="513"
						x2="1"
						y2="1025"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#06b6d4" />
						<stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
			<svg
				viewBox="0 0 1026 1026"
				fill="none"
				aria-hidden="true"
				className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
			>
				<path
					d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
					stroke="#D4D4D4"
					strokeOpacity="0.7"
				/>
				<path
					d="M913 513c0 220.914-179.086 400-400 400"
					stroke={`url(#${id}-gradient-2)`}
					strokeLinecap="round"
				/>
				<defs>
					<linearGradient
						id={`${id}-gradient-2`}
						x1="913"
						y1="513"
						x2="913"
						y2="913"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#06b6d4" />
						<stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	)
}

export function Hero() {
	return (
		<div className="overflow-hidden py-28 md:py-56">
			<Container>
				<div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
					<div className="text-center z-10 relative">
						<h1 className="text-4xl font-medium tracking-tight text-gray-900">
							Turn any spreadsheet into a <span className='text-cyan-700'>GraphQL API</span>
						</h1>
						<p className="mt-6 text-lg text-gray-600">
							Transform your spreadsheets into fully fledged GraphQL APIs.
						</p>
						<div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 justify-center item-center">
							<a href='https://dashboard.sheet2graphql.co/'
								className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
							>
								Sign Up Free
							</a>
							<a href='https://docs.sheet2graphql.co/'
								className="inline-flex items-center rounded-md border border-cyan-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
							>
								Documentation
							</a>
						</div>
					</div>
					<BackgroundIllustration className="absolute left-1/2 -top-72 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-translate-x-1/2 lg:ml-12 xl:ml-0 z-0" />
				</div>
			</Container>
		</div>
	)
}
