# Ibotta Take-Home Project: Anagram API
Take-home project for Ibotta dev position where I create an anagram API.

## About the API
The API endpoints provide access to a data store of words.
Words can be added to and deleted from this data store using the API.
Anagrams can be fetched for a given word, and results from the data store will be returned.

## Endpoints

### Get Anagrams

`GET /anagrams/:word.json?limit=n`

Anagrams of the given word in the data store are returned.
- Required Url Param: "word" (string) - the word for which anagrams will be fetched
- Optional Query Param: "limit" (integer) - limit the result set to a certain size
- Returns: (string[]) - the list of words in the store that are anagrams of the provided word

Examples:

`GET /anagrams/read.json`
- Result: `["dear", "dare"]`

`GET /anagrams/read.json?limit=1`
- Result: `["dear"]`

### Get Metrics
`GET /words/metrics.json`

Various numerical metrics about the words in the data store are returned.
- Returns: (object) - `{ count, min_length, max_length, median_length, average_length }`

Examples:

`GET /words/metrics.json`
- Result:
```
{
    "count": 4,
    "min_length": 1,
    "max_length": 4,
    "median_length": 4,
    "average_length": 3.25
}
```
