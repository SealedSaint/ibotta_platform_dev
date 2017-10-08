// Assumptions being made:
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
		/* word (string): word to get anagrams for
		 * limit (number): how many words to return (default null - return all)
		 * return (string[]): anagrams for that word
		*/

		word = word.toLowerCase()
		const anagramSet = this.anagramMap[word]

		if(!anagramSet) return []  // No entry for that word

		const anagramList = Array.from(anagramSet)

		if(limit != null) return anagramList.slice(0, limit)  // Had an entry but need to limit results
		return anagramList  // Had an entry and no need to limit results
	}

	addWords(words) {
		/* word (string[]): words to add to the store
		*/

		words.forEach(word => {
			word = word.toLowerCase()
			if(this.anagramMap[word]) return  // If we already have this word, skip it

			// Don't have the word, so add it
			this.anagramMap[word] = new Set()
			// We may or may not already have entries of this size, so init if not
			if(!this.sizeMap[word.length]) this.sizeMap[word.length] = new Set()

			// Grab words of same size before adding new word (a word is not its own anagram)
			const sameSizeWords = Array.from(this.sizeMap[word.length])

			// Now add the word to the size Set
			this.sizeMap[word.length].add(word)

			// Get all anagrams for the new word and populate its anagramMap
			sameSizeWords.forEach(sameSizeWord => {
				if(areAnagrams(word, sameSizeWord)) {
					this.anagramMap[word].add(sameSizeWord)
				}
			})

			// For each word found as an anagram, we need to add the new word to their lists
			Array.from(this.anagramMap[word]).forEach(anagram => {
				this.anagramMap[anagram].add(word)
			})
		})
	}

	deleteWord(word) {
		/* word (string): word to delete from store
		*/

		word = word.toLowerCase()
		// If we don't have the word, nothing to do
		if(!this.anagramMap[word]) return

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

	deleteAll() {
		this.anagramMap = {}
		this.sizeMap = {}
	}


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
