import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Login() {
	return (
		<>
			<Head>
				<title>Cancellation and Refund Policy - Sheet2GraphQL</title>
				<meta name="description" content="We follow a reliable refund policy to let you feel privileged about your association with us." />
			</Head>
			<Header />
			<div className="relative overflow-hidden bg-white py-16">
				<div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
					<div className="text-md">
						<h1>
							<span className="mt-2 block text-2xl font-medium leading-8 tracking-tight text-gray-900 ">
								Cancellation and Refund Policy
							</span>
						</h1>
						<p className="mt-5 text-md leading-8 text-gray-500">
							We follow a reliable refund policy to let you feel privileged about your association with us. Please read the guidelines bellow governing Sheet2GraphQL's cancellation and refund policy.
						</p>
					</div>
					<div className="mt-6 text-gray-500 text-md ">
						<section>
							<ul className='list-decimal ml-5 mt-3 space-y-4'>
								<li>All subscriptions renew automatically on their due renewal date according to date of purchase until officially cancelled.</li>
								<li>You can upgrade or downgrade your subscription plan for the service at any time.</li>
								<li>You can cancel your subscription at any time. If you cancel your subscription before the next billing period you will not be charged again.</li>
								<li>You can cancel your subscription from the dashboard billing page. Dashboard {'>'} Billing {'>'} Cancel Subscription.</li>
								<li>You will receive an email from Sheet2GraphQL confirming that your subscription to the service has been cancelled.</li>
								<li>When you cancel your subscription you will be reverted back to the free plan.</li>
								<li>If you are not happy with Sheet2GraphQL and we are unable to resolve your issue, you can contact us via email at  <a href="mailto:support@sheet2graphql.co" className="text-cyan-600">support@sheet2graphql.co</a> to arrange a refund.</li>
								<li>No refunds are offered if you have used more than 20% of your subscription's quota for the billing period.</li>
								<li>Sheet2GraphQL reserves the right to refuse/cancel a subscription to the service. No refunds will be offered if Sheet2GraphQL refuses a new or renewing subscription.</li>
								<li>The above policies apply to all services listed on Sheet2GraphQL.</li>
							</ul>
						</section>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
