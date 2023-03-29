

export default function Page(props) {
    return (
        <div className="text-center mx-auto pt-20">
            <img
                className="mx-auto h-40 w-40 text-gray-400 mb-3"
                src={'/images/undraw_bug_fixing_oc-7-a.svg'}
                alt="error"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Internal Server Error</h3>
            <p className="mt-1 text-sm text-gray-500">There no projects matching your search criteria.</p>
            <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
        </div>
    )
}