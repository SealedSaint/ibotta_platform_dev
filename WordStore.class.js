// ASSUMPTIONS:
// words are non-empty strings
// words are all stored as lowercase
// only dealing with characters [a-z]
// no whitespace (anywhere)
export default class WordStore {
	constructor() {
		this.anagramMap = {}  // Map of words with values that are Sets of anagrams for that word
		this.sizeMap = {}  // Map of sizes (length of word) with values that are Sets of words of matching size
	}

	getAnagrams(word, limit) {
		/* Returns a list of anagrams of the passed in word with an optional limit
		 * word (string): word to get anagrams for
		 * limit (number): how many words to return (default null - return all)
		 * return (string[]): anagrams for that word
		*/

		word = word.toLowerCase()
		let anagramSet = this.anagramMap[word]

		let anagramList = []
		if(anagramSet) {  // Convert our set into an array
			anagramList = Array.from(anagramSet)
		}
		else {  // No entry for that word, but we might still have anagrams for it...
			// We may or may not already have entries of this size, so init if not
			if(!this.sizeMap[word.length]) this.sizeMap[word.length] = new Set()

			const sameSizeWords = Array.from(this.sizeMap[word.length])
			sameSizeWords.forEach(sameSizeWord => {
				if(areAnagrams(word, sameSizeWord)) {
					anagramList.push(sameSizeWord)
				}
			})
		}

		if(limit != null) return anagramList.slice(0, limit)  // Had an entry but need to limit results
		return anagramList  // Had an entry and no need to limit results
	}

	addWords(words) {
		/* Adds the provided words to the data store
		 * word (string[]): words to add to the store
		*/

		words.forEach(word => {
			word = word.toLowerCase()
			console.log('Adding word: ', word)
			if(this.anagramMap[word]) return  // If we already have this word, skip it

			// First get all anagrams of this word already in the store
			const anagrams = this.getAnagrams(word)

			// Add the new word to anagramMap and sizeMap
			this.anagramMap[word] = new Set()
			this.sizeMap[word.length].add(word)

			// For each word found as an anagram, we need to add them to each others' lists
			anagrams.forEach(anagram => {
				this.anagramMap[word].add(anagram)
				this.anagramMap[anagram].add(word)
			})
		})
	}

	deleteWord(word, withAnagrams) {
		/* Deletes the provided word from the store and optionally all its anagrams too
		 * word (string): word to delete from store
		 * withAnagrams (boolean): whether or not to also delete all anagrams of the word (default false)
		*/

		word = word.toLowerCase()
		// Only attempt to delete the word if we have an entry for it
		if(this.anagramMap[word]) {
			// Remove the word from the sizeMap
			this.sizeMap[word.length].delete(word)

			// To remove from the anagramMap, we need to remove the word's own entry
			// and also remove it from its anagrams' lists
			const anagrams = Array.from(this.anagramMap[word])
			delete this.anagramMap[word]
			anagrams.forEach(anagram => {
				this.anagramMap[anagram].delete(word)
			})
		}

		// Look for anagrams and delete them too (if withAnagrams is true)
		if(withAnagrams) {
			this.getAnagrams(word).forEach(anagram => this.deleteWord(anagram))
		}
	}

	deleteAll() {
		this.anagramMap = {}
		this.sizeMap = {}
	}

	getMetrics() {
		/* Returns a count of words in the store and min, max, median, average word length
		 * return (object): { count, min_length, max_length, median_length, average_length }
		*/
		const count = Object.keys(this.anagramMap).length

		if(count === 0) {
			return {
				count: 0,
				min_length: null,
				max_length: null,
				median_length: null,
				average_length: null
			}
		}

		let sizes = Object.keys(this.sizeMap)
		sizes.sort()
		const min_length = sizes.length === 0 ? null : sizes[0]
		const max_length = sizes.length === 0 ? null : sizes.slice(-1).pop()

		// For median: using count, sizes, and sizeMap we should be able to calculate
		// For even, average of count/2 and count/2 + 1 values
		// For odd, Math.ceil(count/2) value
		let median_length
		let n = 0
		let sizeIndex = 0
		const target_n = Math.ceil(count/2)
		while(median_length == null) {
			const nextSize = sizes[sizeIndex]
			const sizeCount = Array.from(this.sizeMap[nextSize]).length
			if(n + sizeCount >= target_n) {
				// This size is the median (with a few exceptions)
				if(count % 2 === 0) {  // Even, so need to get average
					if(n + sizeCount > target_n) {  // average will be between two values of nextSize (just nextSize)
						median_length = nextSize
					}
					else {  // this sizeCount put us right on the target_n, so average this size and the next
						const nextNextSize = sizes[sizeIndex+1]
						median_length = (nextSize + nextNextSize) / 2
					}
					break
				}
				else {  // Odd, so no need to get average
					median_length = nextSize
					break
				}
			}

			// Not to the middle point yet, so keep moving
			n += sizeCount
			sizeIndex++
		}

		// For average: use sizeMap to add up lengths, then divide by count
		const totalLength = sizes.map(size => Array.from(this.sizeMap[size]).length * size)  // Map sizes to total length of words of that size
			.reduce((sum, sizeTotal) => sum + sizeTotal, 0)  // Add the totals for each word size together (this should result in total length of all words in store)
		const average_length = totalLength / count

		return { count, min_length, max_length, median_length, average_length }
	}

	getWordsWithMostAnagrams() {
		/* Returns the word(s) in the store with the most anagrams
		 * return (string[]): the word(s) with most anagrams
		*/

	}

	getAnagramGroups(size) {
		/* Returns all anagram groups of size >= {size}
		 * return ([string[]]): an array of string arrays that are the anagram groups
		*/

	}
}

export function areAllAnagrams(words) {
	/* Returns whether all the words are anagrams of each other
	 * words (string[]): the words to be tested
	 * return (boolean): whether the words are anagrams of each other
	*/

}

export function areAnagrams(word1, word2) {
	/* Returns whether word1 and word2 are anagrams of each other (compares length and character counts)
	 * word1 (string)
	 * word2 (string)
	 * return (boolean): whether the words are anagrams of each other
	*/

	if(word1.length !== word2.length) return false

	// Build the char count for word1
	let charCounts = {}
	Array.from(word1).forEach(char => {
		if(!charCounts[char]) charCounts[char] = 0
		charCounts[char]++
	})

	// Decrement char counts for word2
	Array.from(word2).forEach(char => {
		if(!charCounts[char]) charCounts[char] = 0
		charCounts[char]--
	})

	// If all counts are zero they had the same characters and are anagrams
	return Object.values(charCounts).every(count => count === 0)
}

export function isProperWord(word) {
	/* word (string): the word for which we are determining its proper-ness
	 * return (boolean): whether or not the word is proper
	*/
	// Is a string
	if(typeof word !== 'string') return false

	// Has non-zero length
	if(word.length < 1) return false

	word = word.toLowerCase()
	// Lower-case form has only characters [a-z]
	if(/[^a-z]/.test(word)) return false

	return true
}
