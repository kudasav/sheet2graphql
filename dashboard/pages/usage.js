import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { gql, useQuery } from "@apollo/client";
import context from "../components/pageContext";
import client from "../apollo-client-server";
import Head from 'next/head'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 700],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === '#0e7490',
    },
}));

const stats = [
    { name: 'Total Subscribers', stat: '71,897', previousStat: '70,946', change: '12%', changeType: 'increase' },
]

const columns = [
    { title: "Month", field: "month" },
    { title: "Total Requests", field: "requests" }
];

const usage_query = gql`
    query{
        user{
            subscriptions{
                renews
                quota
                totalRequests
                name
                created
            }
        }
    }
`

function Page(props) {
    const [subscription, setSubscription] = useState(props.subscription)
    const usage_percentage = (100 * subscription.totalRequests) / subscription.quota

    return (
        <>
            <Head>
				<title>Usage - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>
            <main className="flex-1 py-10">
                {/* Page header */}
                <div className="px-4 sm:px-6 lg:max-w-5xl lg:mx-auto lg:px-8">
                    <div className="pb-5 border-b border-gray-200 flex flex-row items-center justify-between flex-wrap">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">Usage</h3>
                        <div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end">
                            <a href='/billing'
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Upgrade Plan
                            </a>
                        </div>
                    </div>
                </div>

                {/* content  */}
                <div className="px-4 sm:px-6 mt-8 lg:max-w-5xl lg:mx-auto lg:px-8">
                    <div className='mb-6'>
                        <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:divide-y-0 md:divide-x">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-base font-normal text-gray-900">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Usage in this month</h2>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <BorderLinearProgress variant="determinate" value={usage_percentage} />
                                    </Box>
                                </dt>
                                <dd className="mt-2 flex justify-between items-baseline md:block lg:flex">
                                    <div className="flex items-baseline text-sm font-medium text-gray-500">
                                        Current usage: {subscription.totalRequests} / {subscription.quota} requests this month
                                    </div>

                                    <div className='ml-5 bg-cyan-100 text-cyan-800 inline-flex items-baseline px-2.5 py-0.5 rounded-md text-sm font-medium md:mt-2 lg:mt-0'>
                                        {Math.round((usage_percentage + Number.EPSILON) * 100) / 100}%
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    {/* Payment details */}
                    <div className="space-y-6 sm:px-6 lg:px-0">
                        <section aria-labelledby="payment-details-heading">
                            <form action="#" method="POST">
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="bg-white py-6 px-4 sm:p-6">
                                        <div className="sm:flex sm:items-center">
                                            <div className="sm:flex-auto">
                                                <h2 className="text-md font-semibold text-gray-900">What happens if exceed my quota?</h2>
                                                <p className="mt-2 text-sm text-gray-700">
                                                    If you exceed your monthly quota, Sheet2GraphQL will return a <span className='font-semibold'>402 Payment Required error</span>.
                                                </p>
                                                <p className="mt-2 text-sm text-gray-700">
                                                    We will send you a notification to <span className='font-semibold'>{props.user.email}</span> when you exceed 70% of your quota.
                                                </p>
                                                <p className="mt-2 text-sm text-gray-700">
                                                    If you'd like to change your plan - go to our <a href="/billing" className='text-cyan-600 underline'>billing page.</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

Page.getInitialProps = async props => {
    let subscription = {}

    try {
        const { data } = await client.query({
            query: usage_query,
            context: {
                headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
            },
            variables: {}
        });

        if (data.user) {
            subscription = data.user.subscriptions
        }
    } catch (e) {
        console.log(e)
    }

    return {
        subscription
    };
}

export default context(Page);