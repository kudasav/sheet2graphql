import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Login() {
	return (
		<>
			<Head>
				<title>Terms - Sheet2GraphQL</title>
				<meta name="description" content="These terms and conditions outline the rules and regulations for the use of Sheet2GraphQL's Website and related services."/>
			</Head>
			<Header />
			<div className="relative overflow-hidden bg-white py-16">
				<div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
					<div className="text-md">
						<h1>
							<span className="mt-2 block text-2xl font-medium leading-8 tracking-tight text-gray-900">
								Terms of Service
							</span>
							<span className="block text-lg text-gray-500">Last updated: 12th September 2022</span>
						</h1>
						<p className="mt-5 text-md leading-8 text-gray-500">
							These terms and conditions outline the rules and regulations for the use of Sheet2GraphQL's Website.
						</p>
					</div>
					<div className="mt-6 text-gray-500 text-md space-y-5">
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>1. Acceptance of Terms</h2>
							<ul className='list-decimal ml-5 mt-3 space-y-3'>
								<li>These Terms and Conditions govern the relationship and engagement with sheet2graphql's products, solutions, websites, add-ons, blogs and services (collectively referred as Service). Please read carefully before using the Service as your use of the Service means your acceptance, adherence and compliance with the following terms and conditions.</li>
								<li>Sheet2GraphQL may modify this TOS at any time. While Sheet2GraphQL will make efforts to notify you when we make changes, you shall assume all responsibility for reviewing the TOS periodically so you are apprised of any changes. If you continue to use any Service or Site after changes to the TOS are posted, you are signifying your acceptance of the terms, including those that may have changed. If any change to this TOS is not acceptable to you, your only remedy is to terminate services.</li>
							</ul>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>2. Description of Service</h2>
							<ul className='list-decimal ml-5 mt-3'>
								<li>The “Service” includes (a) the Site, (b) Sheet2GraphQL's application program interfaces and related materials (the “API” or “APIs”) and (c) all software (“the Software”) (including all software, integrations, and user interfaces made available by Sheet2GraphQL), data (including personally identifiable information – “Personal Data”), reports, text, images, sounds, video, and content made available through any of the foregoing (collectively referred to as the “Data”). Any new features added to or augmenting the Service are also subject to this TOS. All paid plans executed through Site (“Subscription”) and/or separately executed Order Forms (“Order Form”) fall under this TOS unless otherwise specified.</li>
							</ul>
						</section>
						<section className='space-y-3'>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>3. Rules of Conduct</h2>
							<p>
								By using the Site or Services, you agree not to:
							</p>
							<ul className='list-disc ml-5 mt-3 space-y-3'>
								<li>
									<p>Upload any material that:</p>
									<ul className='list-decimal ml-5 mt-3'>
										<li>is unlawful or encourages another to engage in anything unlawful;</li>
										<li>contains software viruses or other code designed to disrupt computing services;</li>
										<li>violates the rights of any party or infringes upon the patent, trademark, trade secret, copyright, right of privacy or publicity or other intellectual property right of any party; or,</li>
										<li>is libelous, defamatory, obscene, lewd, indecent, inappropriate, invasive of privacy or publicity rights, abusing, harassing, threatening or bullying.</li>
									</ul>

								</li>
								<li>
									<p>You further agree that you will not do any of the following, and you will not permit your users to do any of the following:</p>
									<ul className='list-decimal ml-5 mt-3'>
										<li>modify, adapt, translate, copy, reverse engineer, decompile or disassemble any portion of the Service;</li>
										<li>interfere with or disrupt the operation of the Service, including restricting or inhibiting any other person from using the Service, whether by means of hacking, defacing or otherwise;</li>
										<li>attempt to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization;</li>
										<li>take any action that imposes an unreasonable load on Sheet2GraphQL's infrastructure;</li>
										<li>submit, post or make available false, incomplete or misleading information to the Service, or otherwise provide such information to Sheet2GraphQL;</li>
										<li>impersonate any person or entity;</li>
										<li>use the Site or Services for any illegal purpose;</li>
									</ul>
								</li>
							</ul>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>4. Payment</h2>
							<ul className='list-decimal ml-5 mt-3'>
								<li>You hereby agree to pay Sheet2GraphQL the amount that is specified in the payment plan in accordance with your active subscription.</li> 
								<li>You hereby authorize Sheet2GraphQL to bill your payment instrument in advance on a periodic basis in accordance with the terms of the applicable payment plan until you terminate your account or cancell your subscription.</li>
								<li>If you dispute any charges you must let Sheet2GraphQL know within fifteen (15) days after the date that Sheet2GraphQL invoices you.</li>
								<li>We reserve the right to change Sheet2GraphQL's prices. When we change prices, we will provide notice of the change on the Site or in email to you, at our option, at least 14 days before the change is to take effect.</li>
								<li>Your continued use of the Service after the price change becomes effective constitutes your agreement to pay the changed amount.</li>
								<li>please refer to our <a href="/refund-cancellation-policy" className="text-cyan-600">refund and cancellation policy</a> for the guidelines governing Sheet2GraphQL's cancellation and refund policy.</li>
							</ul>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>5. Termination</h2>
							<ul className='list-decimal ml-5 mt-3'>
								<li>Sheet2GraphQL may terminate your Account and this TOS at any time by providing seven (7) days prior notice to the email address associated with your Account. Sheet2GraphQL may also terminate this TOS upon seven (7) days' notice if you breach any of the terms or conditions of this TOS or in the case of nonpayment. Sheet2GraphQL reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof). All of Your Content on the Service (if any) may be permanently deleted by Sheet2GraphQL upon any termination of your account in its sole discretion.</li>
							</ul>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>6. Limitation Of Liability</h2>
							<ul className='list-decimal ml-5 mt-3'>
								<li>
									In no event shall Sheet2GraphQL, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
								</li>
							</ul>
						</section>
						<section>
							<h2 className='font-medium text-lg mb-3 text-gray-600'>7. Governing Law and Jurisdiction</h2>
							<p>
								Sheet2GraphQL is run out of Namibia. This Agreement shall be governed by the laws of Namibia. If you use this Site outside Namibia, you are responsible for following applicable local laws.
							</p>
						</section>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
