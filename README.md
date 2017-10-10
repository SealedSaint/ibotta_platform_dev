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

### Add Words
`POST /words.json`

The provided words are added to the data store.
- Required Body: (string[]) - the words to be added to the data store
- Note: The array may also be provided through an object with a key of "words".

Examples:

```
POST /words.json
Body:
["dear", "dare", "read"]
```

```
POST /words.json
Body:
{ "words": ["dear", "dare", "read"] }
```

### Are All Anagrams
`POST /are-all-anagrams`

Determines whether all the provided words are anagrams of each other.
- Required Body: (string[]) - the words to be tested
- Returns: (boolean) - whether all the words are anagrams of each other
- Note: The array may also be provided through an object with a key of "words".

Examples:

```
POST /are-all-anagrams
Body:
["dear", "dare", "read"]
```
- Result: `true`

```
POST /are-all-anagrams
Body:
{ "words": ["dear", "dare", "read"] }
```
- Result: `true`

```
POST /are-all-anagrams
Body:
["dear", "a", "read"]
```
- Result: `false`

### Delete Word
`DELETE /words/:word.json?withAnagrams=false`

The provided word is removed from the data store, with an option to also remove its anagrams.
- Required Url Param: "word" (string) - the word to be removed from the data store
- Optional Query Param: "withAnagrams" (boolean) - if true, the word's anagrams will also be removed from the store [default: false]

Examples:

`DELETE /words/read.json`

`DELETE /words/dare.json?withAnagrams=true`

### Delete All Words
`DELETE /words.json`

All words are deleted from the data store.
