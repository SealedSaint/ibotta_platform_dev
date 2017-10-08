import express from 'express'
import WordStore, { isProperWord } from './WordStore.class.js'

function isArray(arr) {
	return typeof arr === 'object' && arr.length != null
}

const store = new WordStore()

const router = express.Router()
// Needs optional query param for limit to return
router.get('/anagrams/:word.json', (req, res) => {
	// Get anagrams for the passed in word
	try {
		const word = req.params.word
		const limit = req.query.limit

		// If we have proper input
		if(isProperWord(word) && !isNaN(parseInt(limit))) {
			store.getAnagrams(word, limit)
			res.json()
		}
		else {
			// Error with input

		}
	}
	catch(e) {
		// Unexpected error

	}
})

router.post('/words.json', (req, res) => {
	// Add the words from the array to the data store
	try {
		const words = req.body  // should be an array of strings

		// If we have proper input
		if(isArray(words) && words.every(word => typeof word === 'string')) {
			store.addWords(words)
			res.json()
		}
		else {
			// Error with input

		}
	}
	catch(e) {
		// Unexpected error

	}
})

router.delete('/words/:word.json', (req, res) => {
	// Delete the passed in word from the data store
	try {
		const word = req.params.word

		// If we have proper input
		if(isProperWord(word)) {
			store.deleteWord(word)
			res.json()
		}
		else {
			// Error with input
		}
	}
	catch(e) {
		// Unexpected error

	}
})

router.delete('/words.json', (req, res) => {
	try {
		// Delete all words from the data store
		store.deleteAll()
		res.json()
	}
	catch(e) {
		// Unexpected error
		
	}
})

export default router
