const navigation = {
	main: [
		{ name: 'Pricing', href: '/pricing' },
		{ name: 'Privacy', href: '/privacy' },
		{ name: 'Terms', href: '/terms' },
		{ name: 'Docs', href: 'https://docs.sheet2graphql.co', external: true },
		{ name: 'Contact', href: '/contact' },
	]
}

export function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-gray-100">
			<div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
				<nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
					{navigation.main.map((item) => (
						<div key={item.name} target={item.external ? "_blank" : ""} className="px-5 py-2">
							<a href={item.href} className="text-base text-gray-500 hover:text-gray-900">
								{item.name}
							</a>
						</div>
					))}
				</nav>
				<p className="mt-8 text-center text-base text-gray-400">&copy; {new Date().getFullYear()} Sheet2GraphQL. All rights reserved.</p>
			</div>
		</footer>
	)
}
