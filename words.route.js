import fs from 'fs'
import express from 'express'
import LineReader from 'line-by-line'
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
		if(isProperWord(word) && (limit == null || !isNaN(parseInt(limit)))) {
			const anagrams = store.getAnagrams(word, limit)
			res.json({ anagrams })
		}
		else {
			// Error with input
			res.sendStatus(422)
		}
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.get('/words/metrics.json', (req, res) => {
	// Get metrics for the words in the data store
	try {
		res.json(store.getMetrics())
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.post('/words.json', (req, res) => {
	// Add the words from the array to the data store
	try {
		const words = req.body.words || req.body  // should be an array of strings

		// If we have proper input
		if(isArray(words) && words.every(word => isProperWord(word))) {
			store.addWords(words)
			res.status(201).send('Words successfully added to the data store.')
		}
		else {
			// Error with input
			if(!isArray(words)) res.status(422).send("An array of words must be provided.")
			else {  // A provided word was not proper
				const improperWords = words.filter(word => !isProperWord(word))
				res.status(422).send("The following words are not acceptable and cannot be processed: " +
										JSON.stringify(improperWords) + ". No words were added.")
			}
		}
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.put('/load-dictionary/english', (req, res) => {
	try {
		let words = []

		const lr = new LineReader('./dictionary.txt')
		lr.on('error', err => {
			res.status(500).send('Unexpected error. Unable to process dictionary file.')
			lr.close()
		})
		lr.on('line', line => {
			if(isProperWord(line)) words.push(line)
		})
		lr.on('end', () => {
			console.log('Done reading dictionary - time to add words to store')
			store.addWords(words)
			res.status(201).send('Entire English dictionary has successfully been loaded into the store.')
		})
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.delete('/words/:word.json', (req, res) => {
	// Delete the passed in word from the data store
	// withAnagrams query param optionally deletes all anagrams of the word as well
	try {
		const word = req.params.word
		let withAnagrams = req.query.withAnagrams

		// Validate withAnagrams query param
		let validQPs = true
		if(withAnagrams == null) withAnagrams = false
		else {
			withAnagrams = withAnagrams.toLowerCase()
			if(withAnagrams !== 'true' && withAnagrams !== 'false') {
				validQPs = false
			}
			else {
				withAnagrams = (withAnagrams === 'true')
			}
		}

		// If we have proper input
		if(isProperWord(word) && validQPs) {
			store.deleteWord(word, withAnagrams)
			res.status(204).send('Word successfully deleted from data store.')
		}
		else {
			// Error with input
			res.sendStatus(422)
		}
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.delete('/words.json', (req, res) => {
	try {
		// Delete all words from the data store
		store.deleteAll()
		res.status(204).send('All words successfully deleted from data store.')
	}
	catch(e) {
		// Unexpected error
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})



export default router
