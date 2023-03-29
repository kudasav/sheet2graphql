import Link from 'next/link'

import { Container } from '@/components/Container'

const use_cases = [
	{
		title: 'Headless CMS',
		description: 'Use your APIs as a headless content management system to organize and store web content.',
	},
	{
		title: 'Web Forms',
		description:
			'Submit data collected from your HTML forms to your spreadsheet.',
	},
	{
		title: 'Backend For A Mobile Application',
		description:
			'Use your spreadsheet APIs to power your android and IOS apps.',
	},
	{
		title: 'Lead genaration',
		description:
			'Collect leads from your website and contact forms into your spreadsheet.',
	},
	{
		title: 'Dashboards',
		description:
			'Create information dashboards from your spreadsheet APIs.',
	},
	{
		title: 'Database',
		description: 'Use your GraphQL APIs as a database to store, retrieve and update information.',
	}
]

export function UseCases() {
	return (
		<section
			id="faqs"
			aria-labelledby="faqs-title"
			className="border-t border-gray-200 py-20 sm:py-32"
		>
			<Container>
				<div className="mx-auto  lg:mx-0 text-center">
					<h2
						id="faqs-title"
						className="text-3xl font-medium tracking-tight text-gray-900"
					>
						Use Cases
					</h2>
					<p className="mt-2 text-lg text-gray-600">
						Common uses of Sheet2GraphQL.
					</p>
				</div>
				<ul
					role="list"
					className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
				>
					{use_cases.map((use_case, index) => (
						<li key={index}>
							<h3 className="text-lg font-semibold leading-6 text-gray-900">
								{use_case.title}
							</h3>
							<p className="mt-4 text-sm text-gray-700">{use_case.description}</p>
						</li>
					))}
				</ul>
			</Container>
		</section>
	)
}
