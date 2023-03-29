import { useState } from "react"
import { gql } from "@apollo/client";
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/outline'
import client from "../apollo-client-server";
import context from "../components/pageContext";
import Error from "../components/error"
import Head from 'next/head'
import {
	CogIcon,
	InformationCircleIcon
} from '@heroicons/react/solid'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function Page(props) {
	console.log(props)
	const [copied_urls, set_copied] = useState({})

	if (props.error) {
		return <Error />
	}

	let copy_url = (url, id) => {
		navigator.clipboard.writeText(url)
		set_copied({ ...copied_urls, [id]: true })

		setTimeout(function () {
			delete copied_urls[id];
			set_copied(copied_urls)
		}, 1000)
	}

	return (
		<>
			<Head>
				<title>Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>
			<main className="flex-1 py-10">
				{props.projects.result.length == 0 ?
					<>
						{props.query.page || props.query.name || props.query.limit ?
							<div className="text-center mx-auto pt-20">
								<img
									className="mx-auto h-40 w-40 text-gray-400 mb-3"
									src={'/images/empty.svg'}
									alt="empty"
								/>
								<h3 className="mt-2 text-sm font-medium text-gray-900">Absolutely Nothing!</h3>
								<p className="mt-1 text-sm text-gray-500">There no projects matching your search criteria.</p>
							</div>
							:
							<div className="text-center mx-auto pt-20">
								<img
									className="mx-auto h-40 w-40 text-gray-400 mb-6"
									src={'/images/void.svg'}
									alt="void"
								/>
								<h3 className="mt-2 text-sm font-medium text-gray-900">Wow, such empty.</h3>
								<p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
								<div className="mt-6">
									<a
										href="/create-project"
										className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
									>
										New Project
									</a>
								</div>
							</div>
						}
					</>
					:
					<>
						{/* Page header */}
						<div className="px-4 sm:px-6 lg:max-w-5xl lg:mx-auto lg:px-8">

							<div className="pb-5 border-b border-gray-200 flex flex-row items-center justify-between flex-wrap">
								<h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">Projects</h3>
								<div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end">
									<div>
										<a href='/create-project'
											className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
										>
											New Project
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-8 px-4 sm:px-6 lg:px-10 ">
							<div className='mb-9 space-y-4'>
								{props.projects.result.map((project, index) =>
									<div key={index} className="bg-white overflow-hidden shadow rounded-lg p-5">
										<div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
											<div className="ml-4 mt-2">
												<a href={`/spreadsheet/${project.projectId}`}>
													<p className='text-lg flex font-normal mt-1'>{project.name}</p>
												</a>
											</div>
											<div className="ml-4 mt-2 flex-shrink-0">
												<a href={`/spreadsheet/${project.projectId}/settings`}
													className="relative inline-flex items-center mt-1 border border-transparent text-sm font-medium rounded-md text-white bg-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus:white"
												>
													<CogIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
												</a>
											</div>
										</div>

										{/* <p className='text-lg flex font-normal mt-1'>{project.name}</p> */}
										<div className="mt-2 flex flex-row items-center justify-between flex-wrap sm:flex-nowrap w-full">

											<div className='flex justify-start'>
												<div className="mt-2">
													<p className='text-xs mb-1 font-medium text-gray-500 flex'>GraphQL API <InformationCircleIcon className="h-4 w-4 text-gray-400 ml-2 cursor-pointer" aria-hidden="true" /></p>
													<p className='flex text-xs'>
														{`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/project/${project.projectId}`}
														<span className="hidden md:block">
															{copied_urls[project.projectId] ?
																<CheckIcon className="ml-1 h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" />
																:
																<DocumentDuplicateIcon onClick={() => copy_url(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/project/${project.projectId}`, project.projectId)} className="ml-1 h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" />
															}
														</span>

													</p>
												</div>
											</div>
											<div className='flex justify-start'>
												<div className="mt-2">
													<p className='text-xs mb-1 font-medium text-gray-500 flex'>Source <InformationCircleIcon className="h-4 w-4 text-gray-400 ml-2 cursor-pointer" aria-hidden="true" /></p>
													<p className='flex text-xs'>
														{project.source == "GOOGLESHEETS" && "Google Spreadsheet"}
														{project.source == "FILE" && "File"}
													</p>
												</div>
											</div>

											<div className="flex justify-end mt-2 flex-shrink-0">
												<a
													href={`/spreadsheet/${project.projectId}`}
													className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-cyan-600 hover:shadow-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-white"
												>
													View Project
												</a>
											</div>
										</div>
									</div>
								)}
							</div>

							<nav
								className="flex items-center justify-between border-t border-gray-200 py-4"
								aria-label="Pagination"
							>
								<div className="hidden sm:block">
									<p className="text-sm text-gray-700">
										Page <span className="font-medium">{props.projects.page}</span> of <span className="font-medium">{props.projects.pages}</span>
									</p>
								</div>
								<div className="flex flex-1 justify-between sm:justify-end">
									{props.projects.hasPrev &&
										<a
											href={'/?page=' + props.projects.page - 1}
											className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
										>
											Previous
										</a>
									}
									{props.projects.hasNext &&
										<a
											href={'/?page=' + props.projects.page + 1}
											className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
										>
											Next
										</a>
									}
								</div>
							</nav>
						</div>
					</>
				}
			</main>
		</>
	)
}

const list_query = gql`
    query projects($page: Int, $limit: Int, $query: projectQuery){
        projects(page: $page, limit: $limit, query: $query){
            count
			page
			pages
			hasNext
			hasPrev
			result{
				id
				projectId
				name
				source
			}
        }
    }
`

Page.getInitialProps = async props => {
	let projects = []
	let variables = {
		limit: props.query.limit || 10,
		page: props.query.page || 1
	}

	if (props.query.name) {
		variables.query = { name: props.query.name }
	}

	try {
		const { data } = await client.query({
			query: list_query,
			context: {
				headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
			},
			variables
		});

		if (data.projects) {
			projects = data.projects
		}
	} catch (e) {
		console.log(e)
	}

	return {
		projects,
		query: props.query
	};
}

export default context(Page);