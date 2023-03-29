import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Login() {
	return (
		<>
			<Head>
				<title>Privacy Policy - Sheet2GraphQL</title>
				<meta name="description" content="Your privacy is very important to us. It is Sheet2GraphQL's policy to respect your privacy regarding any information we may collect from you across our website or services."/>
			</Head>
			<Header />
			<div className="relative overflow-hidden bg-white py-16">
				<div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
					<div className="text-md">
						<h1>
							<span className="mt-2 block text-2xl font-medium leading-8 tracking-tight text-gray-900">
								Privacy Policy
							</span>
							<span className="block text-lg text-gray-500">Last updated: 12th September 2022</span>
						</h1>
						<p className="mt-5 text-md leading-8 text-gray-500">
							This Privacy Policy describes Sheet2GraphQL's (hereinafter "Sheet2GraphQL", "we", "us" or "our") privacy policy, including the types of personal information we gather, how we use it, with whom the information may be shared and our efforts to protect the information you provide to us through our website at sheet2graphql.co (the "Website") and through other services delivered or provided to you by Sheet2GraphQL (collectively, the "Service").
						</p>
						<p className="mt-5 text-md leading-8 text-gray-500">This policy is subject to change. If our information retention or usage practices change, we will let you know by posting the Privacy Policy changes on the Website or otherwise through the Service. Please refer to the last updated date above to see when this Policy was last updated.</p>
					</div>
					<div className="mt-6 text-gray-500 text-md space-y-5">
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Information Collected</h2>
							<p>
								We collect two types of information about persons who use the Service: personal information and non-personal information. This information may be collected in a number of ways, including through direct submission, cookies, web beacons and similar data acquisition methods.
							</p>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Personal Information Collected</h2>
							<p>The personal data we collect from you includes:</p>
							<ul className='list-disc ml-5 mt-3'>
								<li>your name and email address when you sign up.</li>
								<li>your IP Address.</li>
								<li>OAuth access and refresh tokens from your Google account.</li>
								<li>Information from the spreadsheets you upload.</li>
								<li>A log of how many times your API has been accessed.</li>
							</ul>
						</section>
						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Non-Personal Information:</h2>
							<p>Whenever you interact with our Website, we automatically receive and record information on our server logs from your browser or device, which may include device identification, “cookie” information, the type of browser and/or device you’re using to access our Website, and the page or feature you requested.</p>
							<p>When we collect the usage information described above, we only use this data in aggregate form, and not in a manner that would identify you personally. For example, this aggregate data can tell us how often users use a particular feature of our Website, and we can use that knowledge to improve the website or service.</p>
						</section>
						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Third-Party Collection</h2>
							<p>Google analytics:</p>
							<p>
								Our Service may use Google Analytics, a web analytics service provided by Google, Inc. ("Google"). Google Analytics uses cookies, to help us analyze how users use the Service. You may be able to opt-out of Google's collection. Please visit Google's Ads Preferences Manager or the Google Analytics opt-out browser add-on for more information.
							</p>
							<p>Cloudflare:</p>
							<p>
								We use the Cloudflare content delivery network (CDN) a caching layer service provided by Cloudflare, Inc. ("Cloudflare"). in order to provide the faster delivery of content. The information collected by the Cloudflare CDN is anonymised and may include, your IP address, device information, the type of browser and/or device you’re using to access our Website, and the web page or feature you requested.
							</p>
						</section>

						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>What we do with your data</h2>
							<p>We accept and gather information in an effort to provide you with the Service. This includes the internal use of your information to tailor the Services to your interests, for fraud prevention, to deliver the Service and to improve Services. Additionally, we may use your information for administration of the Service, such as for communicating with you about the Service and managing support requests.</p>
							<p>we will not:</p>
							<ul className='list-disc ml-5 mt-3'>
								<li>sell or rent your data to third parties</li>
								<li>share your data with third parties for marketing purposes</li>
							</ul>
							<p>We will share your data if we are required to do so by law - for example, by court order, or to prevent fraud or other crime.</p>
						</section>

						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Information security</h2>
							<p>We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of Personal Information in its control and custody.</p>
							<p>However, no data transmission over the Internet or wireless network can be guaranteed. Therefore, while we strive to protect your Personal Information, you acknowledge that:</p>
							<ul className='list-decimal ml-5 mt-3'>
								<li>there are security and privacy limitations of the Internet which are beyond our control;</li>
								<li>the security, integrity, and privacy of any and all information and data exchanged between you and our Website cannot be guaranteed</li>
								<li>any such information and data may be viewed or tampered with in transit by a third-party, despite best efforts.</li>
							</ul>
						</section>

						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Data breach</h2>
							<p>In the event we become aware that the security of the Website has been compromised or user's Personal Information has been disclosed to unrelated third-parties as a result of external activity, including, but not limited to, security attacks or fraud, we reserve the right to take reasonably appropriate measures, including, but not limited to, investigation and reporting, as well as notification to and cooperation with law enforcement authorities.</p>
							<p>In the event of a data breach, we will make reasonable efforts to notify affected individuals. When we do we will send you an email.</p>
						</section>

						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Changes to the policy</h2>
							<p>We reserve the right to amend this Policy from time to time. In that case, the ‘last updated’ date at the top of this page will also change. Any changes to this privacy policy will apply to you and your data immediately.</p>
							<p>If these changes affect how your personal data is processed, we will take reasonable steps to let you know.</p>
						</section>

						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>Contact Information</h2>
							<p>If you have any questions or suggestions regarding our Privacy Policy, please contact us via e-mail at support@sheet2graphql.co</p>
						</section>

					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
