const express = require('express')
const router = express.Router()

// Needs optional query param for limit to return
router.get('/anagrams/:word.json', (req, res) => {
	// Get anagrams for the passed in word here
	req.params.word
})

router.post('/words.json', (req, res) => {
	// Add the words from the array to the data store

})

router.delete('/words/:word.json', (req, res) => {
	// Delete the passed in word from the data store
	req.params.word
})

router.delete('/words.json', (req, res) => {
	// Delete all words from the data store

})

module.exports = router
