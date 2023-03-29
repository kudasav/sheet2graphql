import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Pricing } from '@/components/Pricing'

export default function Login() {
	return (
		<>
			<Head>
				<title>Pricing - Sheet2GraphQL</title>
				<meta name="description" content="Sheet2GraphQL pricing, get started for free, and upgrade when you need it. Cancel at anytime."/>
			</Head>
			<Header />
			<Pricing/>
			<Footer />
		</>
	)
}
