import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Switch } from '@headlessui/react'
import { gql, useMutation, useLazyQuery } from "@apollo/client"
import client from "../../../apollo-client-server";
import { Formik, Form, Field, ErrorMessage, formError } from 'formik';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import * as Yup from 'yup';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import context from "../../../components/pageContext";
import Head from 'next/head'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const project_query = gql`
query project($id: String!){
    project(id: $id){
        name
		introspection
		authentication
		bearer
    }
  }
`

const update_mutation = gql`
mutation update(
	$projectId: String!, 
	$introspection: Boolean, 
	$authentication: Boolean, 
	$bearer: String,
	$name: String
){
    updateProject(
		projectId: $projectId, 
		introspection: $introspection, 
		authentication: $authentication, 
		bearer: $bearer,
		name: $name
	){
		project{
			projectId
			name
			introspection
			authentication
			bearer
		}
    }
  }
`

const delete_mutation = gql`
mutation delete(
	$projectId: String!
){
    deleteProject(
		projectId: $projectId
	){
		project{
			projectId
			name
			introspection
			authentication
			bearer
		}
    }
  }
`

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const name_validation_schema = Yup.object().shape({
	name: Yup.string().required('* project name required')
});

const introspection_validation_schema = Yup.object().shape({
	introspection: Yup.bool()
});

const authentication_validation_schema = Yup.object().shape({
	authentication: Yup.bool(),
	bearer: Yup.string().when(['authentication'], {
		is: (authentication) =>
			authentication == true,
		then: Yup.string()
			.required('* bearer token required')
			.min(8, 'bearer token must be at least 8 charecters long')
	})
});

function Page(props) {
	const [authentication, set_authentication] = useState(props.project.authentication)
	const [introspection, set_introspection] = useState(props.project.introspection)
	let [form_errors, set_form_errors] = useState([]);
	const [updateQuery] = useMutation(update_mutation);
	const [deleteQuery] = useMutation(delete_mutation);
	const authentication_form = useRef(null)
	const [alert, set_alert] = useState({})
	const [delete_modal, set_delete_modal] = useState(false)
	const cancelButtonRef = useRef(null)

	const [values, set_values] = useState({
		name: props.project.name,
		authentication: props.project.authentication,
		bearer: props.project.bearer
	})

	const tabs = [
		{ name: 'API', href: `/spreadsheet/${props.query.id}`, current: false },
		{ name: 'Settings', href: `/spreadsheet/${props.query.id}/settings`, current: true },
	]

	let update_project = async (values, { setFieldError }) => {
		values.projectId = props.query.id

		try {
			let result = await updateQuery({
				variables: values,
			});

			if (result.data.updateProject.errors) {
				field_errors = {}
				result.data.updateProject.errors.forEach(element => {
					setFieldError(element.field, element.message);
				});
			} else {
				set_values(result.data.updateProject.project)
				set_alert({ message: 'project updated', type: 'success' })
			}

		} catch ({ graphQLErrors, networkError }) {
			if (graphQLErrors.length > 0) {
				set_alert({ message: 'failed to update project, please try again later.', type: 'error' })
			}
			if (networkError) {
				set_alert({ message: 'Network error, please try again later.', type: 'error' })
			}
		}
	};

	const delete_project = async () => {
		try {
			let result = await deleteQuery({
				variables: { projectId: props.query.id },
			});

			if (result.data.deleteProject.errors) {
				field_errors = {}
			} else {
				window.location = "/"
			}

		} catch ({ graphQLErrors, networkError }) {
			if (graphQLErrors.length > 0) {
				set_alert({ message: 'failed to delete project, please try again later.', type: 'error' })
				return
			}
			if (networkError) {
				set_alert({ message: 'Network error, please try again later.', type: 'error' })
			}
		}
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		set_alert({});
	};

	let vertical = "bottom"
	let horizontal = "right"

	return (
		<>
			<Head>
				<title>{props.project.name} - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>

			<main className="flex-1 py-10">
				{/* Page header */}
                <div className="px-4 sm:px-6 border-b border-gray-200 sm:pb-0 lg:max-w-5xl lg:mx-auto lg:px-8 mb-8">
                    <div className="flex flex-row items-center justify-between flex-wrap">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">{props.project.name}</h3>
                        <div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end">
                            <a
                                href={`https://api.sheet2graphql.co/project/${props.query.id}`}
                                target={"_blank"}
                                className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-ml-0.5 mr-2 h-4 w-4">
                                    <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
                                </svg>
                                GraphQL Playground
                            </a>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="mt-6 sm:mt-2 2xl:mt-5">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <a
                                    key={tab.name}
                                    href={tab.href}
                                    className={classNames(
                                        tab.current
                                            ? 'border-cyan-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                    )}
                                    aria-current={tab.current ? 'page' : undefined}
                                >
                                    {tab.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

				{/* content  */}
				<div className="mt-4 lg:max-w-5xl lg:mx-auto lg:px-8">
					<div className="">
						<div className="overflow-hidden">
							<div className="divide-y divide-gray-200 lg:divide-y-0 lg:divide-x">
								{/* Profile section */}
								<div className="py-6 px-4 sm:p-6 lg:pb-8 mb-6 bg-white shadow rounded-md">
									<div>
										<h2 className="text-lg leading-6 font-medium text-gray-900">Project Settings</h2>
									</div>
									<Formik
										initialValues={{ name: values.name }}
										onSubmit={update_project}
										validationSchema={name_validation_schema}
									>
										{({ isSubmitting, errors, touched, handleSubmit, setFieldValue }) => (
											<form onSubmit={handleSubmit} method="POST">
												<div className="mt-6 grid grid-cols-12 gap-6">

													<div className="col-span-12">
														<label htmlFor="name" className="block text-sm font-medium text-gray-700">
															Project Name
														</label>
														<div className="mt-1">
															<Field
																name="name"
																type="text"
																defaultValue={values.name}
																placeholder="My Project"
																className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
															/>
															<ErrorMessage name="name" component="div" className="mt-2 text-sm text-red-600" />
														</div>
													</div>
												</div>
												<div className="mt-4 flex justify-start">
													<button
														type="submit"
														disabled={isSubmitting}
														className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
													>
														Save Changes
													</button>
												</div>
											</form>
										)}
									</Formik>
								</div>

								{/* Security section */}
								<div className="mb-6 bg-white shadow rounded-md">
									<div className="p-4 sm:p-6">
										<div>
											<h2 className="text-lg leading-6 font-medium text-gray-900">Security</h2>
										</div>
										<ul role="list" className="mt-2 divide-y divide-gray-200">
											<div>
												<Formik
													initialValues={{
														bearer: values.bearer,
														authentication: authentication
													}}
													onSubmit={update_project}
													validationSchema={introspection_validation_schema}
												>
													{({ isSubmitting, errors, touched, handleSubmit, setFieldValue, setFieldError, submitForm }) => (
														<form onSubmit={handleSubmit} method="POST">
															<Switch.Group as="li" className="py-4 flex items-center justify-between">
																<div className="flex flex-col">
																	<Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
																		Enable Introspection
																	</Switch.Label>
																</div>
																<Switch
																	checked={introspection}
																	onChange={(e) => {
																		setFieldValue('introspection', e);
																		set_introspection(e)
																		submitForm()
																	}}
																	className={classNames(
																		introspection ? 'bg-teal-500' : 'bg-gray-200',
																		'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
																	)}
																>
																	<span
																		aria-hidden="true"
																		className={classNames(
																			introspection ? 'translate-x-5' : 'translate-x-0',
																			'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
																		)}
																	/>
																</Switch>
															</Switch.Group>
														</form>
													)}
												</Formik>
											</div>
											<div>
												<Formik
													initialValues={{
														bearer: values.bearer,
														authentication: authentication
													}}
													onSubmit={update_project}
													validationSchema={authentication_validation_schema}
												>
													{({ isSubmitting, errors, touched, handleSubmit, setFieldValue, setFieldError, submitForm }) => (
														<form onSubmit={handleSubmit} method="POST">
															<Switch.Group as="li" className="py-4 flex items-center justify-between">
																<div className="flex flex-col">
																	<Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
																		Enable Authentication
																	</Switch.Label>
																</div>
																<Switch
																	checked={authentication}
																	onChange={(e) => {
																		setFieldValue('authentication', e);

																		if (!e) {
																			set_authentication(e)
																			submitForm()
																		} else {
																			set_authentication(e)
																		}
																	}}
																	className={classNames(
																		authentication ? 'bg-teal-500' : 'bg-gray-200',
																		'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
																	)}
																>
																	<span
																		aria-hidden="true"
																		className={classNames(
																			authentication ? 'translate-x-5' : 'translate-x-0',
																			'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
																		)}
																	/>
																</Switch>
															</Switch.Group>
															<div className={authentication ? "visible" : "hidden"}>
																<div className="mt-1 mb-8">

																	<div className="grid grid-cols-12 gap-6">
																		<div className="col-span-12">
																			<label htmlFor="bearer" className="block text-sm font-medium text-gray-700">
																				Bearer (Token)
																			</label>
																			<div className="mt-1">
																				<Field
																					name="bearer"
																					type="text"
																					defaultValue={values.bearer}
																					placeholder="Bearer (Token)"
																					className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
																				/>
																				<ErrorMessage name="bearer" component="div" className="mt-2 text-sm text-red-600" />
																			</div>
																		</div>
																	</div>
																	<div className="mt-4 flex justify-start">
																		<button
																			type="submit"
																			disabled={isSubmitting}
																			className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
																		>
																			Save Changes
																		</button>
																	</div>
																	<p className="mt-3 text-sm text-gray-500">
																		Use this in the Authorization header when making http requests. E.g. Authorization: Bearer {'{token}'}
																	</p>
																</div>
															</div>
														</form>
													)}
												</Formik>
											</div>
										</ul>
									</div>
								</div>

								{/* Delete section */}
								<div className="bg-white shadow rounded-md">
									<div className="p-4 sm:p-6">
										<div>
											<h2 className="text-lg leading-6 font-medium text-gray-900">Danger Zone</h2>
											<p className="mt-1 text-sm text-gray-500">
												Once you delete this project, there is no going back. Please be certain.
											</p>
										</div>
										<div className="mt-4 divide-y divide-gray-200">
											<button
												type="button"
												onClick={() => set_delete_modal(true)}
												className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
											>
												Delete Project
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Snackbar open={alert.message} autoHideDuration={6000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}
			>
				<Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
					{alert.message}
				</Alert>
			</Snackbar>

			<Transition.Root show={delete_modal} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={set_delete_modal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed z-10 inset-0 overflow-y-auto">
						<div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										<div className="sm:flex sm:items-start">
											<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
												<ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
											</div>
											<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
												<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
													Delete Project
												</Dialog.Title>
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														Are you sure you want to delete this project? All of your data will be permanently
														removed.
													</p>
													<p className="text-sm text-gray-500 mt-2">
														This action cannot be undone.
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
										<button
											type="button"
											className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => {
												delete_project();
												set_delete_modal(false)
											}
											}
										>
											Delete
										</button>
										<button
											type="button"
											className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => set_delete_modal(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	)
}

Page.getInitialProps = async props => {
	let project = {}

	try {
		const { data } = await client.query({
			query: project_query,
			context: {
				headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
			},
			variables: { id: props.query.id }
		});

		if (data.project) {
			project = data.project
		}

	} catch ({ graphQLErrors, networkError }) {
		let errors = []
		if (graphQLErrors.length > 0) {
			graphQLErrors.forEach(element => {
				errors.push(element.message)
			});
		}
		if (networkError) {
			console.log('body', networkError.result)
		}
		console.log(errors)
	}

	return {
		query: props.query,
		project
	};
}

export default context(Page);