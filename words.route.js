import fs from 'fs'
import express from 'express'
import LineReader from 'line-by-line'
import WordStore, { areAllAnagrams, isProperWord } from './WordStore.class.js'

function isArray(arr) {
	return typeof arr === 'object' && arr.length != null
}

const store = new WordStore()

const router = express.Router()

router.get('/anagrams/:word.json', (req, res) => {
	// Get anagrams for the passed in word, limited by the "limit" QP if provided
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
		console.error(e)
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
		console.error(e)
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
		console.error(e)
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

router.post('/are-all-anagrams', (req, res) => {
	// Test whether all the provided words are anagrams of each other
	try {
		const words = req.body.words || req.body  // should be an array of strings of length >= 2

		// If we have proper input
		if(isArray(words) && words.every(word => isProperWord(word)) && words.length >= 2) {
			res.json(areAllAnagrams(words))
		}
		else {
			// Error with input
			if(!isArray(words)) res.status(422).send("An array of words must be provided.")
			else if(words.length < 2) res.status(422).send("At least two words must be provided.")
			else {  // A provided word was not proper
				const improperWords = words.filter(word => !isProperWord(word))
				res.status(422).send("The following words are not acceptable and cannot be processed: " +
										JSON.stringify(improperWords) + ".")
			}
		}
	}
	catch(e) {
		// Unexpected error
		console.error(e)
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

// router.put('/load-dictionary/english', (req, res) => {
// 	// Loads english dictionary words from dictionary.txt
// 	try {
// 		let words = []
//
// 		const lr = new LineReader('./dictionary.txt')
// 		lr.on('error', err => {
// 			res.status(500).send('Unexpected error. Unable to process dictionary file.')
// 			lr.close()
// 		})
// 		lr.on('line', line => {
// 			if(isProperWord(line)) words.push(line)
// 		})
// 		lr.on('end', () => {
// 			store.addWords(words)
// 			res.status(201).send('Entire English dictionary has successfully been loaded into the store.')
// 		})
// 	}
// 	catch(e) {
// 		// Unexpected error
// 		console.error(e)
// 		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
// 	}
// })

// router.put('/write-to-file', (req, res) => {
// 	// Writes the contents of the data store to two files - one for anagramMap, and one for sizeMap
// 	try {
// 		let anagramMap = {}
// 		let sizeMap = {}
//
// 		// Convert the Sets to arrays for JSON stringify step
// 		Object.keys(store.anagramMap).forEach(key => {
// 			anagramMap[key] = Array.from(store.anagramMap[key])
// 		})
// 		Object.keys(store.sizeMap).forEach(key => {
// 			sizeMap[key] = Array.from(store.sizeMap[key])
// 		})
//
// 		// Write each map to a file
// 		fs.writeFile('anagramMap.json', JSON.stringify(anagramMap), err => {
// 			if (err) throw err;
//
// 			fs.writeFile('sizeMap.json', JSON.stringify(sizeMap), err => {
// 				if (err) throw err;
//
// 				res.send('Store contents have been saved.')
// 			});
// 		});
// 	}
// 	catch(e) {
// 		// Unexpected error
// 		console.error(e)
// 		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
// 	}
// })

router.put('/load-from-file', (req, res) => {
	// Loads store state anagramMap and sizeMap from files anagramMap.json and sizeMap.json
	try {
		fs.readFile('anagramMap.json', (err, data) => {
			if(err) throw err

			let anagramMap = JSON.parse(data)
			Object.keys(anagramMap).forEach(key => {
				anagramMap[key] = new Set(anagramMap[key])
			})
			store.anagramMap = anagramMap

			fs.readFile('sizeMap.json', (err, data) => {
				if(err) throw err

				let sizeMap = JSON.parse(data)
				Object.keys(sizeMap).forEach(key => {
					sizeMap[key] = new Set(sizeMap[key])
				})
				store.sizeMap = sizeMap

				res.send('File contents have been loaded into the store.')
			})
		})
	}
	catch(e) {
		// Unexpected error
		console.error(e)
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
		console.error(e)
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
		console.error(e)
		res.status(500).send('Oops, something went wrong on our end. If the problem persists, the server may need to be restarted.')
	}
})

export default router
