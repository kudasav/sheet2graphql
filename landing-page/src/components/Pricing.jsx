import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'

const plans = [
	{
		name: 'Free',
		featured: false,
		price: { Monthly: '$0', Annually: '$0' },
		description:
			'Learn, explore, start creating',
		button: {
			label: 'Choose free',
			href: 'https://dashboard.sheet2graphql.co/',
		},
		features: [
			'600 requests per month',
			'300 rows per file',
			'Unlimited Spreadsheet APIs',
			'Read & Write data'
		],
		logomarkClassName: 'fill-gray-300',
	},
	{
		name: 'Starter',
		featured: false,
		price: { Monthly: '$9'},
		description:
			'Perfect for most projects.',
		button: {
			label: 'Choose Starter',
			href: 'https://dashboard.sheet2graphql.co/',
		},
		features: [
			'70,000 requests per month',
			'1,500 rows per file',
			'Unlimited Spreadsheet APIs',
			'Read & Write data'
		],
		logomarkClassName: 'fill-gray-500',
	},
	{
		name: 'Pro',
		featured: false,
		price: { Monthly: '$12'},
		description:
			'For more ambitious projects.',
		button: {
			label: 'Choose Pro',
			href: 'https://dashboard.sheet2graphql.co/',
		},
		features: [
			'100,000 requests per month',
			'Unlimited rows per sheet',
			'Unlimited Spreadsheet APIs',
			'Read & Write data'
		],
		logomarkClassName: 'fill-cyan-500',
	},
]

function CheckIcon(props) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
				fill="currentColor"
			/>
			<circle
				cx="12"
				cy="12"
				r="8.25"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function Plan({
	name,
	price,
	description,
	button,
	features,
	featured = false,
	activePeriod,
	logomarkClassName,
}) {
	return (
		<section
			className={clsx(
				'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
				featured ? 'order-first bg-gray-900 lg:order-none' : 'bg-white'
			)}
		>
			<h3
				className={clsx(
					'flex items-center text-lg font-semibold',
					featured ? 'text-white' : 'text-gray-900'
				)}
			>
				<span >{name}</span>
			</h3>
			<p
				className={clsx(
					'relative mt-5 flex text-3xl tracking-tight',
					featured ? 'text-white' : 'text-gray-900'
				)}
			>
				{price.Monthly === price.Annually ? (
					price.Monthly
				) : (
					<>
						<span
							aria-hidden={activePeriod === 'Annually'}
							className={clsx(
								'transition duration-300',
								activePeriod === 'Annually' &&
								'pointer-events-none translate-x-6 select-none opacity-0'
							)}
						>
							{price.Monthly} <span className='text-sm font-nomal text-gray-400'>/month</span>
						</span>
						<span
							aria-hidden={activePeriod === 'Monthly'}
							className={clsx(
								'absolute left-0 top-0 transition duration-300',
								activePeriod === 'Monthly' &&
								'pointer-events-none -translate-x-6 select-none opacity-0'
							)}
						>
							{price.Annually} <span className='text-sm font-nomal text-gray-400'>/month</span>
						</span>
					</>
				)}
			</p>
			<p
				className={clsx(
					'mt-3 text-sm',
					featured ? 'text-gray-300' : 'text-gray-700'
				)}
			>
				{description}
			</p>
			<div className="order-last mt-6">
				<ul
					role="list"
					className={clsx(
						'-my-2 divide-y text-sm',
						featured
							? 'divide-gray-800 text-gray-300'
							: 'divide-gray-200 text-gray-700'
					)}
				>
					{features.map((feature) => (
						<li key={feature} className="flex py-2">
							<CheckIcon
								className={clsx(
									'h-6 w-6 flex-none',
									featured ? 'text-white' : 'text-cyan-500'
								)}
							/>
							<span className="ml-4">{feature}</span>
						</li>
					))}
				</ul>
			</div>
			<Button
				href={button.href}
				color={'cyan'}
				className="mt-6"
				aria-label={`Get started with the ${name} plan for ${price}`}
			>
				{button.label}
			</Button>
		</section>
	)
}

export function Pricing() {
	let [activePeriod, setActivePeriod] = useState('Monthly')

	return (
		<section
			id="pricing"
			aria-labelledby="pricing-title"
			className="border-t border-gray-200 py-20 sm:py-32"
		>
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2
						id="pricing-title"
						className="text-3xl font-medium tracking-tight text-gray-900"
					>
						Pricing
					</h2>
					<p className="mt-2 text-lg text-gray-600">
						Get started for free, and upgrade when you need it. Cancel at anytime.
					</p>
				</div>

				<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:max-w-none lg:grid-cols-3">
					{plans.map((plan) => (
						<Plan key={plan.name} {...plan} activePeriod={activePeriod} />
					))}
				</div>
			</Container>
		</section>
	)
}
