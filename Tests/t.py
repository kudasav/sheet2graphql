import requests, json

# your graphql endpoint
api_url = "https://api.sheet2graphql.co/project/54bc8526-e2d0-4c6b-9d07-199d31c75e7f"

# the graphql query
body = """
    {
        booksList(query: {rating: {gte: 5}, category: {eq: "Nonfiction"}}) {
            result {
                id
                rating
                bookTitle
                price
                category
            }
        }
    }
"""

response = requests.post(url=api_url, json={"query": body})
print(json.dumps(response.json()))