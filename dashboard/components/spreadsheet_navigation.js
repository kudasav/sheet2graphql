/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'

const navigation = [
    { name: 'API', href: '#', current: true },
    {
        name: 'Worksheets',
        current: false,
        children: [
            { name: 'Schools', href: '/worksheet' },
            { name: 'Teachers', href: '/worksheet' },
            { name: 'Students', href: '/worksheet' },
            { name: 'Subjects', href: '/worksheet' },
        ],
    },
    { name: 'Authentication', href: '#', current: false },
    { name: 'Settings', href: '#', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <>
            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white overflow-y-auto">
                    <div className="flex-shrink-0 px-4 flex items-center">
                        <h1 className='font-medium text-xl'>Schools</h1>
                    </div>
                    <div className="flex-grow mt-5 flex flex-col">
                        <nav className="flex-1 px-4 space-y-1 bg-white" aria-label="Sidebar">
                            {navigation.map((item) =>
                                !item.children ? (
                                    <div key={item.name}>
                                        <a
                                            href="#"
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                                            )}
                                        >
                                            {item.icon &&
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                        'mr-3 flex-shrink-0 h-6 w-6'
                                                    )}
                                                    aria-hidden="true"
                                                />}
                                            {item.name}
                                        </a>
                                    </div>
                                ) : (
                                    <Disclosure as="div" key={item.name} className="space-y-1" defaultOpen>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                        'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                                    )}
                                                >
                                                    {item.icon &&
                                                        <item.icon
                                                            className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />}
                                                    <span className="flex-1">{item.name}</span>
                                                    <svg
                                                        className={classNames(
                                                            open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                                            'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                                                        )}
                                                        viewBox="0 0 20 20"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                                    </svg>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="space-y-1">
                                                    {item.children.map((subItem) => (
                                                        <Disclosure.Button
                                                            key={subItem.name}
                                                            as="a"
                                                            href={subItem.href}
                                                            className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                                        >
                                                            {subItem.name}
                                                        </Disclosure.Button>
                                                    ))}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                )
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}
