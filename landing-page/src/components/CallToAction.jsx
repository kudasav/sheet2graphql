import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'

export function CallToAction() {
	return (
		<section
			className="relative overflow-hidden border border-gray-200 bg-gray-100 py-20 sm:py-28"
		>
			<div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
				<CircleBackground color="#fff" className="animate-spin-slower" />
			</div>
			<Container className="relative">
				<div className="mx-auto max-w-md sm:text-center">
					<h2 className="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
						Ready to get started?
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Create your free API now <br/> No credit card required, Cancel anytime
					</p>
					<div className="mt-8 flex justify-center">
						<a href='https://dashboard.sheet2graphql.co/'
							className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
						>
							Sign Up Free
						</a>
					</div>
				</div>
			</Container>
		</section>
	)
}
