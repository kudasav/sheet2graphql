import { Fragment } from 'react'
import Image from 'next/future/image'
import clsx from 'clsx'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from "prism-react-renderer/themes/nightOwl";
import { Button } from '@/components/Button'
import { HeroBackground } from '@/components/HeroBackground'
import blurCyanImage from '@/images/blur-cyan.png'
import blurIndigoImage from '@/images/blur-indigo.png'


const code = `category              | bookName                     | price    | rating |
"Classics"            | "The Picture of Dorian Gray" | "£29.70" | 2      |
"Historical Fiction"  | "Tipping the Velvet"         | "£53.74" | 1      |
`

const response = `{
	"data": {
	  "booksList": {
		"result": [
		  {
			"id": 1,
			"category": "Classics",
			"bookTitle": "The Picture of Dorian Gray",
			"price": "£29.70",
			"rating": "2"
		  },
		  {
			"id": 2,
			"category": "Historical Fiction",
			"bookTitle": "Tipping the Velvet",
			"price": "£53.74",
			"rating": "1"
		  }
		]
	  }
	}
  }
`

const tabs = [
	{ name: 'cache-advance.config.js', isActive: true },
	{ name: 'package.json', isActive: false },
]

function TrafficLightsIcon(props) {
	return (
		<svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
			<circle cx="5" cy="5" r="4.5" />
			<circle cx="21" cy="5" r="4.5" />
			<circle cx="37" cy="5" r="4.5" />
		</svg>
	)
}

export function PrimaryFeatures() {
	return (
		<div className="overflow-hidden bg-slate-900">
			<div className="py-16 sm:px-2 lg:relative lg:py-20 lg:px-0">
				<div className="mx-auto  items-center gap-y-16 gap-x-8 px-4  lg:px-8 xl:gap-x-16 xl:px-12">
					<div className="relative z-10 md:text-center lg:text-left">
						<div className="relative">
							<p className="text-3xl font-medium tracking-tight text-white">
								How It Works
							</p>
							<p className="mt-6 text-lg text-gray-400">
								Sheet2GraphQL dynamically generates and resolves GraphQL schemas from your spreadsheet data, giving you an instant GraphQL backend for all your coding projects.
							</p>
							<div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
								<a href='https://docs.sheet2graphql.co/'
									className="inline-flex items-center rounded-md border border-cyan-600 px-4 py-2 text-sm font-medium text-cyan-600 shadow-sm hover:border-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
								>
									Read the Docs
								</a>
							</div>
						</div>
					</div>
					<div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 lg:static mt-6">
						<div className='col-span-1 h-full'>
							<div className="relative h-full">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
								<div className="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur h-full">
									<div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
									<div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
									<div className="pl-4 pt-4">
										<TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />
										<div className="mt-4 flex space-x-2 text-xs">
											<div className='flex h-6 rounded-full text-slate-500'>
												<div className='flex items-center rounded-full px-2.5'>
													Sample Spreadsheet
												</div>
											</div>
										</div>
										<div className="mt-6 flex items-start px-1 text-sm">
											<div
												aria-hidden="true"
												className="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600"
											>
												{Array.from({
													length: 3,
												}).map((_, index) => (
													<Fragment key={index}>
														{(index + 1).toString().padStart(2, '0')}
														<br />
													</Fragment>
												))}
											</div>
											<Highlight
												{...defaultProps}
												code={code}
												language={'graphql'}
												theme={theme}
											>
												{({
													className,
													style,
													tokens,
													getLineProps,
													getTokenProps,
												}) => (
													<pre
														className={clsx(
															className,
															'flex overflow-x-auto pb-6'
														)}
														style={style}
													>
														
														<code className="px-4">
															{tokens.map((line, lineIndex) => (
																<div key={lineIndex} {...getLineProps({ line })}>
																	{line.map((token, tokenIndex) => (
																		<span
																			key={tokenIndex}
																			{...getTokenProps({ token })}
																		/>
																	))}
																</div>
															))}
														</code>
													</pre>
												)}
											</Highlight>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-span-1'>
							<div className="relative">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
								<div className="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
									<div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
									<div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
									<div className="pl-4 pt-4">
										<TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />
										<div className="mt-4 flex space-x-2 text-xs">
											<div className='flex h-6 rounded-full text-slate-500'>
												<div className='flex items-center rounded-full px-2.5'>
													Sample API Response
												</div>
											</div>
										</div>
										<div className="mt-6 flex items-start px-1 text-sm">
											<div
												aria-hidden="true"
												className="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600"
											>
												{Array.from({
													length: 22,
												}).map((_, index) => (
													<Fragment key={index}>
														{(index + 1).toString().padStart(2, '0')}
														<br />
													</Fragment>
												))}
											</div>
											<Highlight
												{...defaultProps}
												code={response}
												language={'json'}
												theme={theme}
											>
												{({
													className,
													style,
													tokens,
													getLineProps,
													getTokenProps,
												}) => (
													<pre
														className={clsx(
															className,
															'flex overflow-x-auto pb-6'
														)}
														style={style}
													>
														<code className="px-4">
															{tokens.map((line, lineIndex) => (
																<div key={lineIndex} {...getLineProps({ line })}>
																	{line.map((token, tokenIndex) => (
																		<span
																			key={tokenIndex}
																			{...getTokenProps({ token })}
																		/>
																	))}
																</div>
															))}
														</code>
													</pre>
												)}
											</Highlight>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
