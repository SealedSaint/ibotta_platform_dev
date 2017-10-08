// Assumptions being made:
// words are all stored as lowercase
// only dealing with characters [a-z]
export default class WordStore {
	constructor() {
		this.anagramMap = {}  // Map of words with values that are Sets of anagrams for that word
		this.sizeMap = {}  // Map of sizes (length of word) with values that are Sets of words of matching size
	}

	public getAnagrams(word: string, limit: number? = null): string[] {
		/* word: word to get anagrams for
		 * limit: how many words to return (default null - return all)
		 * return: array of anagrams for that word
		*/

		word = word.toLowerCase()
		const anagramSet = this.anagramMap.word

		if(!anagramSet) return []  // No entry for that word

		const anagramList = [...anagramSet]

		if(limit) return anagramList.slice(0, limit)  // Had an entry but need to limit results
		return anagramList  // Had an entry and no need to limit results
	}

	public addWords(words: string[]) {
		words.forEach(word => {
			word = word.toLowerCase()
			if(this.anagramMap.word) return  // If we already have this word, skip it

			// Don't have the word, so add it
			this.anagramMap.word = new Set()
			// We may or may not already have entries of this size, so init if not
			if(!this.sizeMap[word.length]) this.sizeMap[word.length] = new Set()

			// Grab words of same size before adding new word (a word is not its own anagram)
			const sameSizeWords = [...this.sizeMap[word.length]]

			// Now add the word to the size Set
			this.sizeMap[word.length].add(word)

			// Get all anagrams for the new word and populate its anagramMap
			sameSizeWords.forEach(sameSizeWord => {
				if(areAnagrams(word, sameSizeWord)) {
					this.anagramMap.word.add(sameSizeWord)
				}
			})

			// For each word found as an anagram, we need to add the new word to their lists
			[...this.anagramMap.word].forEach(anagram => {
				this.anagramMap.anagram.add(word)
			})
		})
	}

	public deleteWord(word: string) {
		word = word.toLowerCase()
		// If we don't have the word, nothing to do
		if(!this.anagramMap.word) return

		// Remove the word from the sizeMap
		this.sizeMap[word.length].delete(word)

		// To remove from the anagramMap, we need to remove the word's own entry
		// and also remove it from its anagrams' lists
		const anagrams = [...this.anagramMap.word]
		delete this.anagramMap.word
		anagrams.forEach(anagram => {
			this.anagramMap.anagram.delete(word)
		})
	}

	public deleteAll() {
		this.anagramMap = {}
		this.sizeMap = {}
	}

	static areAnagrams(word1: string, word2: string): boolean {
		// Returns whether word1 and word2 are anagrams of each other (compares length and character counts)

		if(word1.length !== word2.length) return false

		// Build the char count for word1
		let charCounts = {}
		[...word1].forEach(char => {
			if(!charCounts[char]) charCounts[char] = 0
			charCounts[char]++
		})

		// Decrement char counts for word2
		[...word2].forEach(char => {
			if(!charCounts[char]) charCounts[char] = 0
			charCounts[char]--
		})

		// If all counts are zero they had the same characters and are anagrams
		return Object.values(charCounts).every(count => count === 0)
	}
}
