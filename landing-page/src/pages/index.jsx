import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { UseCases } from '@/components/UseCases'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sheet2GraphQL - Transform your spreadsheets into fully fledged GraphQL APIs</title>
        <meta name="description" content="Sheet2GraphQL dynamically generates a GraphQL API from your Google Sheets and Spreadsheet files, giving you an instant backend for all your coding projects."/>
      </Head>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <UseCases />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
