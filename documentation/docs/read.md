# Retrieving Rows

## Example data

| | Category | Book Title | Price | Rating |
| | ------------------ | -------------------------- | --------------- | --------------- |
| 2 | Classics | The Picture of Dorian Gray | £29.70 | 2 |
| 3 | Historical Fiction | Tipping the Velvet | £53.74 | 1 |
| 4 | Philosophy | Meditations | £25.89 | 2 |
| 5 | Nonfiction | When Breath Becomes Air | £39.36 | 2 |
| 6 | Fiction | The Dinner Party | £56.54 | 2 |
| 7 | Fiction | The Little Paris Bookshop | £24.73 | 3 |

## Example GraphQL schema

The GraphQL schema genarated from the example data

```js
type books {
    id: Int
    category: String
    bookTitle: String
    price: String
    rating: String
}

type filterType{
    lte: filterField
    gt: filterField
    gte: filterField
    eq: filterField
    ne: filterField
}

type booksQuery{
    category: filterType
    bookTitle: filterType
    price: filterType
    rating: filterType
}

type pagination {
    page: Int
    pages: Int
    count: Int
    hasNext: Boolean
    hasPrev: Boolean
}

type Query {
    booksList(page: Int, limit: Int, query: booksQuery){
        pagination: pagination
        results: [books]
    },
    books(id: Int!): books
}
```

!!! note ""

    The GraphQL schema for each of your worksheets is available on your project's page.

## Get multiple rows

The GraphQL type for retrieving multiple rows from your worksheet will be named in the following format:
 
```{worksheet name}List```

e.g. ```booksList```

=== "Python"

    ``` python
    import requests

    # graphql endpoint
    api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    query = """
    {
        booksList{
            result{
                id
                category
                bookTitle
                price
                rating
            }
        }
    }
    """

    response = requests.post(url=api_url, json={"query": query})
    print(response.json())
    ```

=== "JavaScript"

    ``` javascript
    const axios = require('axios')

    // graphql endpoint
    const api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    const query = `
    {
        booksList{
            result{
                id
                category
                bookTitle
                price
                rating
            }
        }
    }
    `

    axios({
        method: 'post',
        url: api_url,
        data: {
            "query": query
        }
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    ```

The response body:

```json
{
  "data": {
    "booksList": {
      "result": [
        {
          "id": 1,
          "category": "Classics",
          "bookTitle": "The Picture of Dorian Gray",
          "price": "£29.70",
          "rating": "2"
        },
        {
          "id": 2,
          "category": "Historical Fiction",
          "bookTitle": "Tipping the Velvet",
          "price": "£53.74",
          "rating": "1"
        },
        {
          "id": 3,
          "category": "Philosophy",
          "bookTitle": "Meditations",
          "price": "£25.89",
          "rating": "2"
        },
        {
          "id": 4,
          "category": "Nonfiction",
          "bookTitle": "When Breath Becomes Air",
          "price": "£39.36",
          "rating": "2"
        },
        {
          "id": 5,
          "category": "Fiction",
          "bookTitle": "The Dinner Party",
          "price": "£56.54",
          "rating": "2"
        },
        {
          "id": 6,
          "category": "Fiction",
          "bookTitle": "The Little Paris Bookshop",
          "price": "£24.73",
          "rating": "3"
        }
      ]
    }
  }
}
```

## Paginate rows

The following arguments are available for paginating data on the list type:

| Field              | Description                                 | Data type |
| ------------------ | ------------------------------------------- | ---------- |
| page               | specifies the target page in the result set | Integer    |
| limit              | specifies the maximum number of items to fetch per page | Integer |

The list type contains a "pagination" field that holds the pagination information for your query,
the "pagination" field points to the "pagination" type which contains the following fields:

| Field              | Description                                 | Data type |
| ------------------ | ------------------------------------------- | ---------- |
| count              | the total number of rows in the result set | Integer |
| page               | the current page in the result set | Integer |
| pages              | the number of pages in the result set | Integer |
| hasNext            | specifies if there is a page after the current page in the result set | Boolean |
| hasPrev            | specifies if there is a page before the current page in the result set | Boolean |

In this sample query we will retrieve the first 3 rows in the spreadsheet and the pagination info for the query.

=== "Python"

    ``` python
    import requests

    # graphql endpoint
    api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    query = """
    {
        booksList(limit:2, page: 1){
            pagination {
                page
                pages
                count
                hasNext
                hasPrev
            }
            result {
                id
                category
                bookTitle
                price
                rating
            }
        }
    }
    """

    response = requests.post(url=api_url, json={"query": query})
    print(response.json())
    ```

=== "JavaScript"

    ``` javascript
    const axios = require('axios')

    // graphql endpoint
    const api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    const query = `
    {
        booksList(limit:2, page: 1){
            pagination {
                page
                pages
                count
                hasNext
                hasPrev
            }
            result {
                id
                category
                bookTitle
                price
                rating
            }
        }
    }
    `

    axios({
        method: 'post',
        url: api_url,
        data: {
            "query": query
        }
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    ```

The response body:

```json
{
	"data": {
		"booksList": {
			"pagination": {
				"page": 1,
				"pages": 246,
				"count": 492,
				"hasNext": true,
				"hasPrev": false
			},
			"result": [
				{
					"id": 1,
					"category": "Classics",
					"bookTitle": "The Picture of Dorian Gray",
					"price": "£29.70",
					"rating": "2"
				},
				{
					"id": 2,
					"category": "Historical Fiction",
					"bookTitle": "Tipping the Velvet",
					"price": "£53.74",
					"rating": "1"
				}
			]
		}
	}
}
```

## Filter rows

The list query contains a "query" argument for filtering the rows in a spreadsheet, the "query" argument accepts the headers of your worksheet as inputs. 

Each input field accepts the following parameters:

| Field      | Description           |
| ---------- | --------------------  |
| lt         | Less Than |
| lte        | Less Than or Equal To |
| gt         | Greater Than |
| gte        | Greater Than or Equal To |
| eq         | Equal To |
| neq        | Not Equal To |

In this sample query we will filter for all books with a rating greater or equal to 5 and a category of "Nonfiction".

=== "Python"

    ``` python
    import requests

    # graphql endpoint
    api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    query = """
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

    response = requests.post(url=api_url, json={"query": query})
    print(response.json())
    ```

=== "JavaScript"

    ``` javascript
    const axios = require('axios')

    // graphql endpoint
    const api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    const query = `
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
    `

    axios({
        method: 'post',
        url: api_url,
        data: {
            "query": query
        }
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    ```

The response body:

```json
{
    "data": {
        "booksList": {
            "result": [
                {
                    "id": 8,
                    "rating": "5",
                    "bookTitle": "Travels with Charley: In Search of America",
                    "price": "£57.82",
                    "category": "Nonfiction"
                },
                {
                    "id": 24,
                    "rating": "5",
                    "bookTitle": "#HigherSelfie: Wake Up Your Life. Free Your Soul. Find Your Tribe.",
                    "price": "£23.11",
                    "category": "Nonfiction"
                },
                {
                    "id": 141,
                    "rating": "5",
                    "bookTitle": "H is for Hawk",
                    "price": "£57.42",
                    "category": "Nonfiction"
                }

                ....
            ]
        }
    }
}
```

## Get a single row

The GraphQL type for retrieving a single row in a worksheet is named after the worksheet's name e.g. ```books```. 

It accepts an 'id' argument which specifies the row number to retrieve.

!!! note ""

    The 'id' value of a row is returned in the list query.

=== "Python"

    ``` python
    import requests

    # graphql endpoint
    api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    query = """
    {
        books(id: 1) {
            id
            category
            bookTitle
            price
            rating
        }
    }
    """

    response = requests.post(url=api_url, json={"query": query})
    print(response.json())
    ```

=== "JavaScript"

    ``` javascript
    const axios = require('axios')

    // graphql endpoint
    const api_url = "https://api.sheet2graphql.co/project/fcca5a6a-e5c9-4732-8ee2-748307c08e56"

    const query = `
    {
        books(id: 1) {
            id
            category
            bookTitle
            price
            rating
        }
    }
    `

    axios({
        method: 'post',
        url: api_url,
        data: {
            "query": query
        }
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    ```

The response body:

```json
{
    "data": {
        "books": {
            "id": 1,
            "category": "Classics",
            "bookTitle": "The Picture of Dorian Gray",
            "price": "£29.70",
            "rating": "2"
        }
    }
}
```