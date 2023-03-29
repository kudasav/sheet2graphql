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
				<title>Contact - Sheet2GraphQL</title>
				<meta name="description" content="We'd love to hear from you. Get in touch, contact us if you have any questions or feature requests"/>
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
						<h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
							Contact Us
						</h1>
						<p className="mt-3 text-center text-lg text-gray-600">We'd love to hear from you. Get in touch!</p>

						<div className='flex justify-center items-center w-full mt-6'>
							<a
								href="mailto:info@sheet2graphqL.co"
								className="inline-flex items-center rounded-md border border-cyan-600 bg-white px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
							>
								info@sheet2graphqL.co
							</a>
						</div>
						<p className='mt-6 text-sm text-left'>Looking for support?</p>
						<p className='mt-2 text-sm text-left'>If you require technical support, please include your full API URL and a detailed description of your issue. </p>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}
