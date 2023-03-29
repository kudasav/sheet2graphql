import queryString from 'query-string';
import { XCircleIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import Head from 'next/head'

const navigation = {
    main: [
        { name: 'Privacy', href: 'https://sheet2graphql.co/privacy' },
        { name: 'Terms', href: 'https://sheet2graphql.co/terms' },
        { name: 'Docs', href: 'https://docs.sheet2graphql.co', external: true },
        { name: 'Contact', href: 'https://sheet2graphql.co/contact' },
    ],
    social: [
        {
            name: 'Twitter',
            href: '#',
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            ),
        }
    ],
}

function BackgroundIllustration(props) {
    return (
        <svg
            viewBox="0 0 1090 1090"
            aria-hidden="true"
            fill="none"
            preserveAspectRatio="none"
            {...props}
        >
            <circle cx={545} cy={545} r="544.5" />
            <circle cx={545} cy={545} r="480.5" />
            <circle cx={545} cy={545} r="416.5" />
            <circle cx={545} cy={545} r="352.5" />
        </svg>
    )
}

function Page(props) {
    const oAuthClient = "337735230560-urotlfb9o71piv5ti2hkao944a0u6ieo.apps.googleusercontent.com"

    const social_auth = () => {
        let state = {}

        if (props.query.next) {
            state.next = props.query.next
        }

        let query = {
            client_id: oAuthClient,
            redirect_uri: process.env.NEXT_PUBLIC_BASE_URL+"/sso",
            response_type: "code",
            scope: "profile email https://www.googleapis.com/auth/spreadsheets",
            state: JSON.stringify(state),
            access_type: "offline"
        }

        query = queryString.stringify(query);
        let url = `https://accounts.google.com/o/oauth2/v2/auth?` + query
        window.location = url
    }

    return (
        <>
            <Head>
				<title>Login - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects." />
			</Head>
            <main className="flex min-h-full overflow-hidden sm:py-6 py-14">
                <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
                    <Link href="/" aria-label="Home">
                        <img src="/images/logo_image.png" className="mx-auto h-36 w-auto" />
                    </Link>
                    <div className="relative mt-12 sm:mt-16">
                        <BackgroundIllustration
                            width="1090"
                            height="1090"
                            className="absolute -top-14 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:h-auto"
                        />

                    </div>
                    <div className="-mx-4 mt-10 flex-auto bg-white py-10 px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none rounded-5xl sm:px-14 sm:py-14">
                        <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
                            Sign in to continue
                        </h1>
                        <p className="mt-3 text-center text-lg text-gray-600">Create an account or sign in.</p>

                        <div className="mt-8 text-center">
                            <div className="mt-2">
                                <button
                                    onClick={social_auth}
                                    className="inline-flex justify-center py-3 px-5 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <img src="/images/google.png" className="w-5 h-5 inline-block" alt="" />
                                    <p className="ml-3 text-gray-500 text-md font-medium" style={{ fontSize: 16 }}>
                                        Continue With Google
                                    </p>
                                </button>
                            </div>
                        </div>

                        {props.query.error &&
                            <div className="rounded-md bg-red-50 p-4 mt-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{props.query.error}</h3>
                                    </div>
                                </div>
                            </div>
                        }

                        <footer className="bg-white">
                            <div className="mx-auto overflow-hidden pt-10">
                                <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
                                    {navigation.main.map((item) => (
                                        <div key={item.name} className="px-5 py-2">
                                            <a href={item.href} target={item.external ? "_blank" : ""} className="text-base text-gray-500 hover:text-gray-900">
                                                {item.name}
                                            </a>
                                        </div>
                                    ))}
                                </nav>
                                <p className="mt-4 text-center text-base text-gray-400">&copy; {new Date().getFullYear()} Sheet2GraphQL. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>
        </>
    )
}

Page.getInitialProps = async props => {

    return {
        query: props.query
    };
}

export default Page;