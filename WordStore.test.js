import assert from 'assert'
import WordStore, { areAnagrams } from './WordStore.class.js'

const store = new WordStore()

// Check areAnagrams

	// Varying sizes/words (matches and non-matches)
	assert(areAnagrams('read', 'dear'))
	assert(areAnagrams('dear', 'read'))
	assert(areAnagrams('dear', 'dare'))
	assert(areAnagrams('abc', 'cba'))
	assert(areAnagrams('abcdefghhh', 'abchhhefdg'))
	assert(!areAnagrams('abc', 'adf'))
	assert(!areAnagrams('a', 'd'))
	assert(!areAnagrams('abrakadabra', 'abrakadabre'))
	assert(!areAnagrams('abrakadabra', 'abrakadabr'))

// Check addWords (make sure anagramMap and sizeMap are populated appropriately)

	// Add new words (of new sizes)


	// Add duplicate words


	// Add words with different casing (duplicate and not)


// Check getAnagrams

	// Basic tests


	// Same with different casing


	// Word with no anagrams


	// Word with new size


// Check deleteWord

	// Remove words of different sizes


	// Remove a word that doesn't exist


// Check deleteAll

	// Make sure both maps are blank
