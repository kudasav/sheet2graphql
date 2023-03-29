import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Switch } from '@headlessui/react'
import { gql, useMutation, useLazyQuery } from "@apollo/client"
import client from "../apollo-client-server";
import { Formik, Form, Field, ErrorMessage, formError } from 'formik';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import * as Yup from 'yup';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import context from "../components/pageContext";
import Cookies from 'js-cookie'
import ClipLoader from "react-spinners/PulseLoader";
import Head from 'next/head'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const update_mutation = gql`
mutation update(
	$secondaryEmail: String!
){
    updateUser(
		secondaryEmail: $secondaryEmail
	){
		user{
            email
			secondaryEmail
            fullName
            picture
        }
    }
  }
`

const delete_mutation = gql`
	mutation{
		deleteUser{
			success
		}
	}
`

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const email_validation = Yup.object().shape({
	secondaryEmail: Yup.string().email("* invalid email address").required('* email address required')
});


function Page(props) {
	const [deleteQuery] = useMutation(delete_mutation);
	const [updateQuery] = useMutation(update_mutation);
	const [alert, set_alert] = useState({})
	const [delete_modal, set_delete_modal] = useState(false)
	const cancelButtonRef = useRef(null)
	const [deleting, set_deleting] = useState(false)

	let update_email = async (values, { setFieldError }) => {
		try {
			let result = await updateQuery({
				variables: values,
			});

			if (result.data.updateUser.errors) {
				field_errors = {}
				result.data.updateUser.errors.forEach(element => {
					setFieldError(element.field, element.message);
				});
			} else {
				set_alert({ message: 'account updated', type: 'success' })
			}

		} catch ({ graphQLErrors, networkError }) {
			if (graphQLErrors.length > 0) {
				set_alert({ message: 'failed to update account, please try again later.', type: 'error' })
			}
			if (networkError) {
				set_alert({ message: 'Network error, please try again later.', type: 'error' })
			}
		}
	};

	const delete_user = async () => {
		set_deleting(true)

		try {
			let result = await deleteQuery({
				variables: {  },
			});

			if (result.data.deleteUser.errors) {
				field_errors = {}
			} else {
				window.location = "/"
				Cookies.remove('token')
			}

		} catch ({ graphQLErrors, networkError }) {
			if (graphQLErrors.length > 0) {
				set_alert({ message: 'failed to delete account, please try again later.', type: 'error' })
				
			}
			if (networkError) {
				set_alert({ message: 'Network error, please try again later.', type: 'error' })
			}
		}

		set_deleting(false)
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		set_alert({});
	};

	let vertical = "bottom"
	let horizontal = "right"

	let default_values = {
		secondaryEmail: props.user.secondaryEmail || undefined
	}

	return (
		<>
			<Head>
				<title>Settings - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>
			<main className="flex-1 py-10">
				{/* Page header */}
				<div className="px-4 sm:px-6 lg:max-w-5xl lg:mx-auto lg:px-8">
					<div className="pb-5 border-b border-gray-200 flex flex-row items-center justify-between flex-wrap">
						<h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">Settings</h3>
						<div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end">

						</div>
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
										<h2 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h2>
									</div>
									<Formik
										initialValues={default_values}
										onSubmit={update_email}
										validationSchema={email_validation}
									>
										{({ isSubmitting, errors, touched, handleSubmit, setFieldValue, values }) => (
											<form onSubmit={handleSubmit} method="POST">
												<div className="mt-6 grid grid-cols-12 gap-6">

													<div className="col-span-12">
														<label htmlFor="name" className="block text-sm font-medium text-gray-700">
															Email address
														</label>
														<div className="mt-1">
															<Field
																name="secondaryEmail"
																type="email"
																defaultValue={default_values.secondaryEmail}
																placeholder="Email"
																className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
															/>
															<ErrorMessage name="secondaryEmail" component="div" className="mt-2 text-sm text-red-600" />
														</div>
														<p className="mt-2 text-sm text-gray-500" id="email-description">
															We will use this email address to communicate with you and send notifications.
														</p>
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

								{/* Delete section */}
								<div className="bg-white shadow rounded-md">
									<div className="p-4 sm:p-6">
										<div>
											<h2 className="text-lg leading-6 font-medium text-gray-900">Danger Zone</h2>
											<p className="mt-1 text-sm text-gray-500">
												When you delete your account, all your projects and data will be permanently removed.
											</p>
										</div>
										<div className="mt-4 divide-y divide-gray-200">
											<button
												type="button"
												onClick={() => set_delete_modal(true)}
												disabled={deleting}
												className="w-32 text-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
											>
												{deleting ? <ClipLoader color={"#fff"} loading={true} size={10} height={10} width={10} /> : "Delete Account"}
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
													Delete Account
												</Dialog.Title>
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														Are you sure you want to delete your account? All of your data and projects will be permanently
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
												delete_user();
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

	return {};
}

export default context(Page);