import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="shortcut icon" href="/favicon.png"/> 
					<link rel="apple-touch-icon" href="/favicon.png"/> 
				</Head>
				<body className='min-h-screen bg-gray-50'>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument