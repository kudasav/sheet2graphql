import { Listbox, Transition } from '@headlessui/react'
import React, { useState, Fragment, useEffect, useRef } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Formik, Form, Field, ErrorMessage, formError } from 'formik';
import { gql, useQuery, useMutation } from "@apollo/client";
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Script from 'next/script'
import context from "../components/pageContext";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClipLoader from "react-spinners/PulseLoader";
import Head from 'next/head'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const validation_schema = Yup.object().shape({
    name: Yup.string().required('* project name required'),
    source: Yup.string().required('* project source required'),
    url: Yup.string()
        .when('source', (source) => {
            if (source === 'googleSheet') {
                return Yup
                    .string()
                    .matches(
                        /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                        '* invalid URL'
                    )
                    .required('* Google Sheets url required')
            }else{
                return Yup.string()
            }
        }),
    file: Yup.string()
        .when('source', (source) => {
            if (source === 'file') {
                return Yup
                    .string()
                    .required('* Spreadsheet file required')
            }else{
                return Yup.string()
            }
        }),
});

const projects = [
    { id: 1, name: 'Google Spreadsheet', value: 'googleSheet' },
    { id: 3, name: 'Spreadsheet File', value: 'file' }
]

const add_mutation = gql`
    mutation addProject($properties: projectInput!){
        addProject(properties: $properties){
            project{
                projectId
            }
        }
    }
`;

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Page() {
    const [selected, setSelected] = useState(projects[0])
    let [form_errors, set_form_errors] = useState([]);
    const [addQuery] = useMutation(add_mutation);
    const [progress, set_progress] = useState(0)
    const [uploading, set_uploading] = useState(false)
    const [upload_details, set_upload_details] = useState(undefined)
    const form = useRef(null)
    const [alert_open, set_alert_open] = useState(false);
    let vertical = "bottom"
    let horizontal = "right"

    const initial_values = {
        name: undefined,
        source: 'googleSheet',
        url: undefined,
        file: undefined
    }

    let create_project = async (values, {
        setSubmitting,
        setFieldError
    }) => {
        values['uploadId'] = window.upload_id
        delete values['file']

        try {
            let result = await addQuery({
                variables: { properties: values },
            });

            if (result.data.addProject.errors) {
                field_errors = {}
                result.data.addProject.errors.forEach(element => {
                    setFieldError(element.field, element.message);
                });
            } else {
                window.location = "/spreadsheet/" + result.data.addProject.project.projectId
            }

        } catch ({ graphQLErrors, networkError }) {
            let errors = []
            if (graphQLErrors.length > 0) {
                graphQLErrors.forEach(element => {
                    errors.push(element.message)
                });
            }
            if (networkError) {
                if (networkError.statusCode) {
                    errors.push("Server Error, Unable to process your request at the moment, please try again later")
                } else {
                    errors.push("Problem Connecting, Check your internet connection and try again.")
                }
            }

            set_form_errors(errors)
        }
    };

    useEffect(() => {
        let form_data = [{ "name": "csrfmiddlewaretoken", "value": 'csrf' }]
        $("#chunked_upload").fileupload({
            url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT+'/upload',
            dataType: "json",
            maxChunkSize: 1000000, // Chunks of 1mb
            formData: form_data,
            add: function (e, data) { // Called before starting upload
                set_uploading(true)
                form_data.splice(1);
                data.submit();
            },
            chunkdone: function (e, data) { // Called after uploading each chunk
                if (form_data.length < 2) {
                    form_data.push(
                        { "name": "upload_id", "value": data.result.upload_id }
                    );
                }

                var progress = parseInt(data.loaded / data.total * 100.0, 10);
                set_progress(progress)
                // $("#progress").text(Array(progress).join("=") + "> " + progress + "%");
            },
            done: function (e, data) { // Called when the file has completely uploaded
                set_uploading(false)
                set_upload_details({
                    name: data.files[0].name,
                    upload_id: data.result.upload_id
                })

                window.upload_id = data.result.upload_id
            },
        }).on('fileuploadfail', function (e, data) {
            set_uploading(false)
            set_upload_details(undefined)
            set_alert_open(true)
        })
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        set_alert_open(false);
    };

    return (
        <>
            <Head>
				<title>Create Project - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>

            <Script src="/jquery.js" strategy="beforeInteractive" />
            <Script src="/jquery.ui.widget.js" strategy="beforeInteractive" />
            <Script src="/jquery.fileupload.js" strategy="beforeInteractive" />

            <main className="flex-1 py-10">
                {/* Page header */}
				<div className="px-4 sm:px-6 lg:max-w-5xl lg:mx-auto lg:px-8">
					<div className="pb-5 border-b border-gray-200 flex flex-row items-center justify-between flex-wrap">
						<h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">Create Project</h3>
						<div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end">

						</div>
					</div>
				</div>

                {/* content  */}
                <div className="mt-8 px-4 sm:px-6 lg:px-10">
                    {/* Payment details */}
                    <div className="space-y-6 sm:px-6 lg:px-0">


                        {/* Plan */}
                        <section aria-labelledby="plan-heading">
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="bg-white py-6 px-4 space-y-4 sm:p-6">
                                    <Formik
                                        initialValues={initial_values}
                                        onSubmit={create_project}
                                        validationSchema={validation_schema}
                                    >
                                        {({ isSubmitting, errors, touched, handleSubmit, setFieldValue }) => (
                                            <form onSubmit={handleSubmit} method="POST">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                            Project Name
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                name="name"
                                                                type="text"
                                                                placeholder="My Project"
                                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                            <ErrorMessage name="name" component="div" className="mt-2 text-sm text-red-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Listbox value={selected} onChange={(e) => { setFieldValue('source', e.value); setSelected(e) }}>
                                                            {({ open }) => (
                                                                <>
                                                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Source</Listbox.Label>
                                                                    <div className="mt-2 relative">
                                                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                                                                            <span className="block truncate">{selected.name}</span>
                                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                            </span>
                                                                        </Listbox.Button>

                                                                        <Transition
                                                                            show={open}
                                                                            as={Fragment}
                                                                            leave="transition ease-in duration-100"
                                                                            leaveFrom="opacity-100"
                                                                            leaveTo="opacity-0"
                                                                        >
                                                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                                {projects.map((person) => (
                                                                                    <Listbox.Option
                                                                                        key={person.id}
                                                                                        className={({ active }) =>
                                                                                            classNames(
                                                                                                active ? 'text-white bg-cyan-600' : 'text-gray-900',
                                                                                                'cursor-default select-none relative py-2 pl-8 pr-4'
                                                                                            )
                                                                                        }
                                                                                        value={person}
                                                                                    >
                                                                                        {({ selected, active }) => (
                                                                                            <>
                                                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                                    {person.name}
                                                                                                </span>

                                                                                                {selected ? (
                                                                                                    <span
                                                                                                        className={classNames(
                                                                                                            active ? 'text-white' : 'text-cyan-600',
                                                                                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                                                                        )}
                                                                                                    >
                                                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                                    </span>
                                                                                                ) : null}
                                                                                            </>
                                                                                        )}
                                                                                    </Listbox.Option>
                                                                                ))}
                                                                            </Listbox.Options>
                                                                        </Transition>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </Listbox>
                                                        <ErrorMessage name="source" component="div" className="mt-2 text-sm text-red-600" />
                                                    </div>


                                                    <div className={selected.value == 'file' ? 'visible' : 'hidden'}>
                                                        <label className="block text-sm font-medium text-gray-700">File</label>
                                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                            <div className="space-y-1 text-center">
                                                                {!uploading ?
                                                                    <Fragment>

                                                                        {upload_details ?
                                                                            <p className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
                                                                                <span>{upload_details.name}</span>
                                                                            </p>
                                                                            :
                                                                            <Fragment>
                                                                                <svg
                                                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    viewBox="0 0 48 48"
                                                                                    aria-hidden="true"
                                                                                >
                                                                                    <path
                                                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                                        strokeWidth={2}
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                    />
                                                                                </svg>

                                                                                <div className="flex text-sm text-gray-600">
                                                                                    <p
                                                                                        onClick={() => { $('#chunked_upload').click() }}
                                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                                                                                    >
                                                                                        <span>Upload a file</span>
                                                                                    </p>
                                                                                    <p className="pl-1">or drag and drop</p>
                                                                                </div>
                                                                                <p className="text-sm text-gray-500">.xls, .xlsx, .csv</p>
                                                                            </Fragment>
                                                                        }
                                                                    </Fragment>
                                                                    :
                                                                    <div className="w-40 mt-2">
                                                                        <CircularProgressWithLabel value={progress} />
                                                                        <p className="text-sm text-gray-500">uploading...</p>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <input
                                                            id="chunked_upload"
                                                            name="file"
                                                            type="file"
                                                            accept=".xls,.xlsx,.csv"
                                                            className='sr-only'
                                                            onChange={(e) => { setFieldValue('file', e.target.name) }}
                                                        />
                                                        <ErrorMessage name="file" component="div" className="mt-2 text-sm text-red-600" />
                                                    </div>

                                                    <div className={selected.name == 'Google Spreadsheet' ? 'visible' : 'hidden'}>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                            Spreadsheet URL
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                name="url"
                                                                type="text"
                                                                placeholder="https://docs.google.com/spreadsheets/d/abcd"
                                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                            <ErrorMessage name="url" component="div" className="mt-2 text-sm text-red-600" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {form_errors.length > 0 ?
                                                    <Fragment>
                                                        {form_errors.map((error, index) =>
                                                            <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                                                                <div className="flex">
                                                                    <div className="flex-shrink-0">
                                                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <p className="text-sm text-yellow-700">
                                                                            {error}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </Fragment>
                                                    : null}
                                                <div className='mt-5'>
                                                    <button
                                                        type='submit'
                                                        disabled={isSubmitting}
                                                        className="w-32 text-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                                    >
                                                        {isSubmitting ? <ClipLoader color={"#fff"} loading={true} size={10} height={10} width={10} /> : "Create Project"}

                                                    </button>
                                                </div>
                                            </form>

                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Snackbar open={alert_open} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Failed to upload file, please try again later.
                </Alert>
            </Snackbar>
        </>
    )
}

export default context(Page);