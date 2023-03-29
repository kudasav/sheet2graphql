import React, { useState } from 'react'
import { gql, useQuery } from "@apollo/client";
import context from "../components/pageContext";
import client from "../apollo-client-server";
import Head from 'next/head'
import moment from 'moment-timezone';
import {
    CreditCardIcon
} from '@heroicons/react/outline'

const subscription_query = gql`
    query{
        user{
            userId
            subscriptions{
                renews
                quota
                totalRequests
                name
                created
                cardType
                cardNumber
                updateCardUrl
            }
        }
    }
`




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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


function Page(props) {
    const [subscription, setSubscription] = useState(props.subscription)

    const plans = [
        {
            name: 'free',
            featured: false,
            price: '$0',
            description: 'Learn, explore, start creating',
            button: {
                label: 'Choose',
                href: 'https://dashboard.sheet2graphql.co/',
            },
            features: [
                '600 requests per month',
                '300 rows per file',
                'Unlimited Spreadsheet APIs',
                'Read & Write data'
            ]
        },
        {
            name: 'starter',
            featured: false,
            price: '$9',
            description: 'Perfect for most projects.',
            button: {
                label: 'Choose',
                href: `https://sheet2graphql.lemonsqueezy.com/checkout/buy/34a6f45d-5c9e-49c3-b6df-336359ac66f2?checkout[custom][user_id]=${props.user_id}`,
            },
            features: [
                '70,000 requests per month',
                '1,500 rows per file',
                'Unlimited Spreadsheet APIs',
                'Read & Write data'
            ]
        },
        {
            name: 'pro',
            featured: false,
            price: '$17',
            description: 'For more ambitious projects.',
            button: {
                label: 'Choose',
                href: `https://sheet2graphql.lemonsqueezy.com/checkout/buy/3eff0ae6-ec59-4411-ab41-afc73972dc6a?checkout[custom][user_id]=${props.user_id}`,
            },
            features: [
                '100,000 requests per month',
                'Unlimited rows per sheet',
                'Unlimited Spreadsheet APIs',
                'Read & Write data'
            ]
        },
    ]

    function Plan({
        name,
        price,
        description,
        button,
        features
    }) {
        return (
            <section className='flex flex-col overflow-hidden rounded-xl p-6 shadow-lg shadow-gray-900/5 bg-white'>
                <h3 className='flex items-center text-lg font-semibold text-gray-900 capitalize'>
                    <span >{name}</span>
                </h3>
                <p className='relative mt-5 flex text-3xl tracking-tight text-gray-900'>
                    <span className='transition duration-300'>
                        {price} <span className='text-sm font-nomal text-gray-400'>/month</span>
                    </span>
                </p>
                <p className='mt-3 text-sm  text-gray-700'>
                    {description}
                </p>
                <div className="order-last mt-6">
                    <ul
                        role="list"
                        className='-my-2 divide-y text-sm divide-gray-200 text-gray-700'
                    >
                        {features.map((feature) => (
                            <li key={feature} className="flex py-2">
                                <CheckIcon className='h-6 w-6 flex-none text-cyan-500' />
                                <span className="ml-4">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {name == subscription.name ?
                    <span
                        className="mt-2 text-center rounded-md border border-cyan-600 bg-white px-3 py-2 text-sm font-medium leading-4 text-cyan-600 shadow-sm"
                    >
                        Active
                    </span>
                    :
                    <a
                        href={button.href}
                        type="button"
                        className="mt-2 text-center rounded-md border border-transparent bg-cyan-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        aria-label={`Get started with the ${name} plan for ${price}`}
                    >
                        {button.label}
                    </a>
                }
            </section>
        )
    }

    return (
        <>
            <Head>
                <title>Billing - Sheet2GraphQL</title>
                <meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
            </Head>

            <main className="flex-1 py-10">
                {/* Page header */}
                <div className="px-4 sm:px-6 lg:max-w-5xl lg:mx-auto lg:px-8">

                    <div className="pb-5 border-b border-gray-200 flex flex-row items-center justify-between flex-wrap">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 justify-start">Billing</h3>
                        <div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end"></div>
                    </div>
                </div>

                <div className="px-4 sm:px-6 mt-8 lg:max-w-5xl lg:mx-auto lg:px-8">
                    <div className="border-b border-gray-200 bg-white  rounded-xl">
                        <div className="px-4 py-5 sm:px-6  flex flex-wrap items-center justify-between sm:flex-nowrap">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Active subscription: <span className='capitalize'>{subscription.name}</span></h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Renews on: {moment(subscription.renews).format('ll')}.
                                </p>
                            </div>
                            <div className="flex flex-shrink-0 gap-4">
                                <button
                                    className={classNames(
                                        subscription.name == "free" ? 'bg-gray-300 focus:ring-0' : 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500',
                                        'mt-2 text-center rounded-md border border-transparent  px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2'
                                    )}
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>

                        {subscription.cardNumber &&
                            <div className="px-4 py-5 sm:px-6 border-t broder-gray-200">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Payment method</h3>
                                <div className="mt-5">
                                    <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                                        <h4 className="sr-only">{subscription.cardType}</h4>
                                        <div className="sm:flex sm:items-start">
                                            <CreditCardIcon className='h-6 w-auto sm:flex-shrink-0 text-cyan-500' />

                                            <div className="mt-3 sm:mt-0 sm:ml-4">
                                                <div className="text-sm font-medium text-gray-900">{subscription.cardType} card, </div>
                                                <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                                                    <div>Ending with {subscription.cardNumber}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                                            <a
                                                href={subscription.updateCardUrl}
                                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Update
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>



                </div>

                {/* content  */}
                <div className="px-4 sm:px-6 mt-8 lg:max-w-5xl lg:mx-auto lg:px-8">
                    <div className="mx-auto grid grid-cols-1 items-start gap-x-8 gap-y-10 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <Plan key={plan.name} {...plan} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

Page.getInitialProps = async props => {
    let subscription = {}
    let user_id = null

    try {
        const { data } = await client.query({
            query: subscription_query,
            context: {
                headers: { authorization: props.req.cookies.token ? `JWT ` + props.req.cookies.token : '' }
            },
            variables: {}
        });

        if (data.user) {
            subscription = data.user.subscriptions
            user_id = data.user.userId
        }
    } catch (e) {
        console.log(e)
    }

    return {
        subscription,
        user_id
    };
}

export default context(Page);