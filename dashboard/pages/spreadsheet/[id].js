import { useState, useEffect } from 'react'
import Prism from "prismjs";
import { Switch } from '@headlessui/react'
import "prism-themes/themes/prism-ghcolors.css"
import client from "../../apollo-client-server";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import queryString from "query-string";
import Error from "../../components/error"
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/outline'
import Head from 'next/head'

require("prismjs/components/prism-graphql")
import context from "../../components/pageContext";


const project_query = gql`
query project($id: String!){
    project(id: $id){
        name
        worksheets{
            name
            worksheetId
        }
    }
  }
`

const schema_query = gql`
query shema($worksheetId: String!){
    worksheetSchema(worksheetId: $worksheetId){
        schema
        name
        worksheetId
        listSample
        getSample
        createSample
        updateSample
        deleteSample
        create
        update
        delete
    }
  }
`

const update_mutation = gql`
mutation update($worksheetId: String!, $create: Boolean, $update: Boolean, $delete: Boolean){
    updateWorksheet(worksheetId: $worksheetId, create: $create, update: $update, delete: $delete){
        worksheet{
            create
            update
            delete
        }
    }
}
`

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


function Page(props) {
    const [updateQuery] = useMutation(update_mutation);
    const router = useRouter();
    const [schema, setSchema] = useState(props.schema)
    const subNavigation = []
    const [copied, set_copied] = useState(false)
    const tabs = [
        { name: 'API', href: `/spreadsheet/${props.query.id}`, current: true },
        { name: 'Settings', href: `/spreadsheet/${props.query.id}/settings`, current: false },
    ]


    useEffect(() => {
        Prism.highlightAll();
    }, []);


    if (props.errors && props.errors.length > 0) {
        console.log(props.errors)
        return <Error />
    }

    props.worksheets.forEach(element => {
        let current = element.name == props.query.worksheet
        subNavigation.push({ name: element.name, current })
    });

    let update_worksheet = async (worksheetId, parameter, value) => {
        try {
            await updateQuery({
                variables: {
                    worksheetId,
                    [parameter]: value
                },
            });

            setSchema({ ...schema, [parameter]: value })

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

            console.log(errors)
        }
    };

    const get_url = (worksheet) => {
        let query = {};
        let route = router.asPath.split("?")[0];

        query.worksheet = worksheet;
        const searchString = queryString.stringify(query);
        return route + "?" + searchString;
    };


    let copy_url = (url, id) => {
        navigator.clipboard.writeText(url)
        set_copied(true)

        setTimeout(function () {
            set_copied(false)
        }, 1000)
    }

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
                                href={process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT+`/project/${props.query.id}`}
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
                <div className="mt-5 px-4 sm:px-6 lg:px-8">
                    <h2 className='font-medium'>GraphQL Endpoint</h2>
                    <div className='mt-2'>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <button
                                onClick={() => copy_url(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/project/${props.query.id}`)}
                                className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                            >
                                {copied ?
                                    <CheckIcon className="ml-1 h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                                    :
                                    <DocumentDuplicateIcon className="ml-1 h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                                }
                            </button>
                            <input
                                type="text"
                                name="company-website"
                                id="company-website"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm border-gray-300"
                                defaultValue={`https://api.sheet2graphql.co/project/${props.query.id}`}
                                readOnly
                            />
                        </div>
                    </div>

                    <h2 className='mt-8 mb-3 font-medium'>WorkSheets</h2>

                    {/* worksheets */}
                    <div className="bg-white rounded-lg shadow ">

                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            <aside className="py-6 lg:col-span-3">
                                <nav className="space-y-1">
                                    {props.worksheet_navigation.map((item, index) => (
                                        <a
                                            key={index}
                                            href={get_url(item.name)}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
                                                    : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                                                'w-full group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            <span className="truncate">{item.name}</span>
                                        </a>
                                    ))}
                                </nav>
                            </aside>

                            <div className="divide-y divide-gray-200 lg:col-span-9">
                                {/* Profile section */}
                                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                    <div>
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">{props.active_worksheet.name}</h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            The genareted GraphQL schema for your worksheet.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-col lg:flex-row">
                                        <div className="flex-grow space-y-6">
                                            <div>
                                                <p className="block text-sm font-medium text-gray-700">
                                                    WorkSheet Schema
                                                </p>
                                                <div className="mt-1 rounded-md flex">
                                                    <div className="Code w-full">
                                                        <pre>
                                                            <code className={`language-graphql`}>{schema.schema}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="bg-white overflow-hidden shadow rounded-sm divide-y divide-gray-200">
                                                    <div className="px-4 py-5 sm:px-6">
                                                        {/* Content goes here */}
                                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                                            <div className="ml-4 mt-2">
                                                                <p className="block text-sm font-medium text-gray-700">
                                                                    List Reccords
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 mt-2 flex-shrink-0"></div>
                                                        </div>
                                                    </div>
                                                    {/* List Sample */}
                                                    <div className="">

                                                        <div className="rounded-md flex">
                                                            <div className="Code w-full">
                                                                <pre className='mt-0' style={{ margin: "0 !important", border: 'none' }}>
                                                                    <code className={`language-graphql`}>{schema.listSample}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="bg-white overflow-hidden shadow rounded-sm divide-y divide-gray-200">
                                                    <div className="px-4 py-5 sm:px-6">
                                                        {/* Content goes here */}
                                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                                            <div className="ml-4 mt-2">
                                                                <p className="block text-sm font-medium text-gray-700">
                                                                    Retrieve Reccord
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 mt-2 flex-shrink-0"></div>
                                                        </div>
                                                    </div>
                                                    {/* retrieve sample */}
                                                    <div className="">
                                                        <div className="rounded-md flex">
                                                            <div className="Code w-full">
                                                                <pre className='mt-0' style={{ margin: "0 !important", border: 'none' }}>
                                                                    <code className={`language-graphql`}>{schema.getSample}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="bg-white overflow-hidden shadow rounded-sm divide-y divide-gray-200">
                                                    <div className="px-4 py-5 sm:px-6">
                                                        {/* Content goes here */}
                                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                                            <div className="ml-4 mt-2">
                                                                <p className="block text-sm font-medium text-gray-700">
                                                                    Create Reccord
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 mt-2 flex-shrink-0">
                                                                <Switch
                                                                    checked={schema.create}
                                                                    onChange={(e) => update_worksheet(schema.worksheetId, 'create', e)}
                                                                    className={classNames(
                                                                        schema.create ? 'bg-cyan-600' : 'bg-gray-200',
                                                                        'relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                                                                    )}
                                                                >
                                                                    <span className="sr-only">Use setting</span>
                                                                    <span
                                                                        className={classNames(
                                                                            schema.create ? 'translate-x-5' : 'translate-x-0',
                                                                            'pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                                        )}
                                                                    >
                                                                        <span
                                                                            className={classNames(
                                                                                schema.create ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                                                <path
                                                                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        <span
                                                                            className={classNames(
                                                                                schema.create ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-cyan-600" fill="currentColor" viewBox="0 0 12 12">
                                                                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                </Switch>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Sample */}

                                                    <div className={schema.create ? "visible" : "hidden"}>
                                                        <div className="rounded-md flex">
                                                            <div className="Code w-full">
                                                                <pre className='mt-0' style={{ margin: "0 !important", border: 'none' }}>
                                                                    <code className={`language-graphql`}>{schema.createSample}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="bg-white overflow-hidden shadow rounded-sm divide-y divide-gray-200">
                                                    <div className="px-4 py-5 sm:px-6">
                                                        {/* Content goes here */}
                                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                                            <div className="ml-4 mt-2">
                                                                <p className="block text-sm font-medium text-gray-700">
                                                                    Update Reccord
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 mt-2 flex-shrink-0">
                                                                <Switch
                                                                    checked={schema.update}
                                                                    onChange={(e) => update_worksheet(schema.worksheetId, 'update', e)}
                                                                    className={classNames(
                                                                        schema.update ? 'bg-cyan-600' : 'bg-gray-200',
                                                                        'relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                                                                    )}
                                                                >
                                                                    <span className="sr-only">Use setting</span>
                                                                    <span
                                                                        className={classNames(
                                                                            schema.update ? 'translate-x-5' : 'translate-x-0',
                                                                            'pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                                        )}
                                                                    >
                                                                        <span
                                                                            className={classNames(
                                                                                schema.update ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                                                <path
                                                                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        <span
                                                                            className={classNames(
                                                                                schema.update ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-cyan-600" fill="currentColor" viewBox="0 0 12 12">
                                                                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                </Switch>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Sample */}

                                                    <div className={schema.update ? "visible" : "hidden"}>
                                                        <div className="rounded-md flex">
                                                            <div className="Code w-full">
                                                                <pre className='mt-0' style={{ margin: "0 !important", border: 'none' }}>
                                                                    <code className={`language-graphql`}>{schema.updateSample}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="bg-white overflow-hidden shadow rounded-sm divide-y divide-gray-200">
                                                    <div className="px-4 py-5 sm:px-6">
                                                        {/* Content goes here */}
                                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                                            <div className="ml-4 mt-2">
                                                                <p className="block text-sm font-medium text-gray-700">
                                                                    Delete Reccord
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 mt-2 flex-shrink-0">
                                                                <Switch
                                                                    checked={schema.delete}
                                                                    onChange={(e) => update_worksheet(schema.worksheetId, 'delete', e)}
                                                                    className={classNames(
                                                                        schema.delete ? 'bg-cyan-600' : 'bg-gray-200',
                                                                        'relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                                                                    )}
                                                                >
                                                                    <span className="sr-only">Use setting</span>
                                                                    <span
                                                                        className={classNames(
                                                                            schema.delete ? 'translate-x-5' : 'translate-x-0',
                                                                            'pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                                        )}
                                                                    >
                                                                        <span
                                                                            className={classNames(
                                                                                schema.delete ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                                                <path
                                                                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        <span
                                                                            className={classNames(
                                                                                schema.delete ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <svg className="h-3 w-3 text-cyan-600" fill="currentColor" viewBox="0 0 12 12">
                                                                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                </Switch>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Sample */}
                                                    <div className={schema.delete ? "visible" : "hidden"}>
                                                        <div className="rounded-md flex">
                                                            <div className="Code w-full">
                                                                <pre className='mt-0' style={{ margin: "0 !important", border: 'none' }}>
                                                                    <code className={`language-graphql`}>{schema.deleteSample}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

Page.getInitialProps = async props => {
    let worksheet_navigation = []
    let project = undefined
    let worksheets = []
    let query_errors = []
    let schema = {}
    let found_current = false
    let worksheet = undefined

    try {
        const { data, errors: project_errors } = await client.query({
            query: project_query,
            context: {
                headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
            },
            variables: { id: props.query.id }
        });

        if (data.project) {
            worksheets = data.project.worksheets
            project = data.project
        }

        if (project_errors) {
            project_errors.forEach(error => {
                query_errors.push(error.message)
            });

            return {
                errors: project_errors
            }
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

    if (worksheets.length > 0) {
        // check if the worksheet exists in the project
        // if not set the first sheet in the project as the selected one
        if (props.query.worksheet) {
            worksheet = props.query.worksheet


            let exists = worksheets.find(i => i.name === worksheet);
            console.log("exitsts", exists)
            if (exists) {
                worksheet = exists
            }
        } else {
            worksheet = worksheets[0]
        }

        try {
            const { data, errors } = await client.query({
                query: schema_query,
                context: {
                    headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
                },
                variables: { worksheetId: worksheet.worksheetId }
            });

            if (data.worksheetSchema) {
                schema = data.worksheetSchema
            }

            if (errors) {
                errors.forEach(error => {
                    query_errors.push(error.message)
                });
            }

        } catch ({ graphQLErrors, networkError }) {

            if (graphQLErrors.length > 0) {
                graphQLErrors.forEach(element => {
                    query_errors.push(element.message)
                });
            }
            if (networkError) {
                console.log('body', networkError.result.errors)
            }
        }
    }


    worksheets.forEach(element => {
        let current = element.name == props.query.worksheet
        if (current) {
            found_current = true
        }
        worksheet_navigation.push({ name: element.name, current })
    });

    if (!found_current) {
        worksheet_navigation[0].current = true
    }

    return {
        errors: query_errors,
        worksheets,
        schema,
        project,
        query: props.query,
        active_worksheet: worksheet,
        worksheet_navigation
    };
}

export default context(Page);