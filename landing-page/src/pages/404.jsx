import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'


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

export default function Login() {
	return (
		<>
			<Head>
				<title>Page not found - Sheet2GraphQL</title>
				<meta name="description" content="We'd love to hear from you. Get in touch, contact us if you have any questions or feature requests" />
			</Head>
			<Header />
			<main className="flex overflow-hidden pt-16 sm:py-28 mb-28">
				<div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
					<div className="relative">
						<BackgroundIllustration
							width="1090"
							height="1090"
							className="absolute -top-28 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:h-auto"
						/>
					</div>
					<div className="-mx-4 mt-10 bg-white py-10 px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-2xl sm:p-16">
						<p className="text-base font-semibold text-cyan-600">404</p>
						<h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
						<p className="mt-2 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
						<div className="mt-6">
							<a href="/" className="text-base font-medium text-cyan-600 hover:text-cyan-500">
								Go back home
								<span aria-hidden="true"> &rarr;</span>
							</a>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}
