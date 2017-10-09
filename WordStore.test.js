import assert from 'assert'
import WordStore, { areAnagrams, isProperWord } from './WordStore.class.js'

function mapsAreEqual(map1, map2) {
	// Same keys
	let keys1 = Object.keys(map1)
	keys1.sort()
	let keys2 = Object.keys(map2)
	keys2.sort()
	if(JSON.stringify(keys1) !== JSON.stringify(keys2)) return false

	// Same values
	return keys1.every(key => {
		let a1 = Array.from(map1[key])
		a1.sort()
		let a2 = Array.from(map2[key])
		a2.sort()
		return JSON.stringify(a1) === JSON.stringify(a2)
	})
}

// Check mapsAreEqual
function testMapsAreEqual() {
	let map1 = {
		'dear': new Set(['read', 'dare']),
		'cow': new Set(['woc'])
	}
	let map2 = {
		'dear': new Set(['dare', 'read']),  // Reversed set order here - should still be equal
		'cow': new Set(['woc'])
	}
	assert(mapsAreEqual(map1, map2), "Anagram maps are equal even if set value order is not the same")

	map1 = {
		'dear': new Set(['read', 'dare']),
		'cow': new Set(['woc', 'owc'])  // Extra anagram here
	}
	map2 = {
		'dear': new Set(['read', 'dare']),
		'cow': new Set(['woc'])
	}
	assert(!mapsAreEqual(map1, map2), "Anagram maps are not equal if an extra anagram is present in one set")

	map1 = {
		1: new Set(['a', 'b']),
		3: new Set(['cow', 'foo']),
		4: new Set(['dear', 'dare', 'read'])
	}
	map2 = {
		1: new Set(['b', 'a']),  // Reversed set order here - should still be equal
		3: new Set(['cow', 'foo']),
		4: new Set(['dear', 'dare', 'read'])
	}
	assert(mapsAreEqual(map1, map2), "Size maps are equal even if set value order is not the same")

	map1 = {
		1: new Set(['a', 'b']),
		3: new Set(['cow', 'foo']),
		4: new Set(['dear', 'dare', 'read']),
		5: new Set()  // Extra key and set here
	}
	map2 = {
		1: new Set(['a', 'b']),
		3: new Set(['cow', 'foo']),
		4: new Set(['dear', 'dare', 'read'])
	}
	assert(!mapsAreEqual(map1, map2), "Size maps are not equal if an extra key is present (even if the value is an empty set)")
}
testMapsAreEqual()

// Check areAnagrams
function testAreAnagrams() {
	// Varying sizes/words (matches and non-matches)
	assert(areAnagrams('read', 'dear'), "'read' and 'dear' are anagrams")
	assert(areAnagrams('dear', 'read'), "'dear' and 'read' are anagrams (order doesn't matter)")
	assert(areAnagrams('dear', 'dare'), "'dear' and 'dare' are anagrams")
	assert(areAnagrams('abc', 'cba'), "'abc' and 'cba' are anagrams")
	assert(areAnagrams('abcdefghhh', 'abchhhefdg'), "'abcdefghhh' and 'abchhhefdg' are anagrams")
	assert(!areAnagrams('abc', 'adf'), "'abc' and 'adf' are not anagrams")
	assert(!areAnagrams('a', 'd'), "'a' and 'd' are not anagrams")
	assert(!areAnagrams('abrakadabra', 'abrakadabre'), "'abrakadabra' and 'abrakadabre' are not anagrams")
	assert(!areAnagrams('abrakadabra', 'abrakadabr'), "'abrakadabra' and 'abrakadabr' are not anagrams")
}
testAreAnagrams()

// Check isProperWord
function testIsProperWord() {
	assert(isProperWord('foo'), "'foo' is a proper word")
	assert(isProperWord('computer'), "'computer' is a proper word")
	assert(isProperWord('A'), "'A' is a proper word")
	assert(isProperWord('TiGeR'), "'TiGeR' is a proper word")
	assert(!isProperWord(' foo '), "' foo ' is NOT a proper word")
	assert(!isProperWord('1234'), "'1234' is NOT a proper word")
	assert(!isProperWord('comput3r'), "'comput3r' is NOT a proper word")
	assert(!isProperWord('a word'), "'a word' is NOT a proper word")
	assert(!isProperWord('bl_h'), "'bl_h' is NOT a proper word")
}
testIsProperWord()

const store = new WordStore()

// Check addWords (make sure anagramMap and sizeMap are populated appropriately)
function testAddWords() {
	// Add new words (of new sizes)
	store.addWords([
		'a',
		'read',
		'dear',
		'dare',
		'computer',
		'flower',
		'fowler'
	])
	let anagramMap = {
		'a': new Set(),
		'read': new Set(['dear', 'dare']),
		'dear': new Set(['read', 'dare']),
		'dare': new Set(['read', 'dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower'])
	}
	let sizeMap = {
		1: new Set(['a']),
		4: new Set(['read', 'dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Anagram maps are equal after adding words of various sizes (including some anagrams)")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Size maps are equal after adding words of various sizes (including some anagrams)")

	store.addWords([])
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Passing an empty array to addWords doesn't change anagramMap equality")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Passing an empty array to addWords doesn't change sizeMap equality")

	store.addWords(['new'])
	anagramMap = {
		'a': new Set(),
		'read': new Set(['dear', 'dare']),
		'dear': new Set(['read', 'dare']),
		'dare': new Set(['read', 'dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'new': new Set()
	}
	sizeMap = {
		1: new Set(['a']),
		3: new Set(['new']),
		4: new Set(['read', 'dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Adding a single word to an existing store works as expected for the anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Adding a single word to an existing store works as expected for the sizeMap")

	store.addWords(['abcdefghijklmnopqrstuvwxyz', 'foo'])
	anagramMap = {
		'a': new Set(),
		'read': new Set(['dear', 'dare']),
		'dear': new Set(['read', 'dare']),
		'dare': new Set(['read', 'dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'new': new Set(),
		'foo': new Set(),
		'abcdefghijklmnopqrstuvwxyz': new Set()
	}
	sizeMap = {
		1: new Set(['a']),
		3: new Set(['new', 'foo']),
		4: new Set(['read', 'dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		26: new Set(['abcdefghijklmnopqrstuvwxyz'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Adding some more words works as expected for the anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Adding some more words works as expected for the sizeMap")

	// Add duplicate words
	store.addWords(['foo', 'dear', 'a'])
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Adding the same words changes nothing for the anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Adding the same words changes nothing for the sizeMap")

	// Add words with different casing (duplicate and not)
	store.addWords(['nEw', 'DEAR', 'A'])
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Adding the same words in different casing changes nothing for the anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Adding the same words in different casing changes nothing for the sizeMap")
}
testAddWords()

// Check getAnagrams
function testGetAnagrams() {
	// Basic tests
	let anagrams = store.getAnagrams('dear')
	anagrams.sort()
	let expected = ['read', 'dare']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'dear' are retrieved correctly")

	anagrams = store.getAnagrams('read')
	anagrams.sort()
	expected = ['dare', 'dear']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'read' are retrieved correctly")

	anagrams = store.getAnagrams('dare')
	anagrams.sort()
	expected = ['read', 'dear']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'dare' are retrieved correctly")

	// Same with different casing
	anagrams = store.getAnagrams('dEAr')
	anagrams.sort()
	expected = ['read', 'dare']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'dear' are retrieved correctly regardless of casing")

	anagrams = store.getAnagrams('ReaD')
	anagrams.sort()
	expected = ['dare', 'dear']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'read' are retrieved correctly regardless of casing")

	anagrams = store.getAnagrams('DARE')
	anagrams.sort()
	expected = ['read', 'dear']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams for 'dare' are retrieved correctly regardless of casing")

	// Word with no anagrams
	anagrams = store.getAnagrams('computer')
	anagrams.sort()
	expected = []
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "An empty list is returned for a word in the store with no anagrams")

	// Word not in the store with no anagrams
	anagrams = store.getAnagrams('befuzzled')
	anagrams.sort()
	expected = []
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "An empty list is returned for a word not in the store")

	// Word not in the store but WITH anagrams
	anagrams = store.getAnagrams('eard')
	anagrams.sort()
	expected = ['read', 'dear', 'dare']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Getting anagrams for a word not in the store still works.")

	// Word with new size
	anagrams = store.getAnagrams('flower')
	anagrams.sort()
	expected = ['fowler']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "Anagrams are retrieved as expected for words of a variety of sizes")

	// Limit works
	anagrams = store.getAnagrams('dear', 0)
	anagrams.sort()
	expected = []
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "A limit of 0 for a word with anagrams returns an empty list")

	anagrams = store.getAnagrams('dear', 1)
	anagrams.sort()
	let expected1 = ['read']
	let expected2 = ['dare']
	assert(JSON.stringify(anagrams) === JSON.stringify(expected1)
		|| JSON.stringify(anagrams) === JSON.stringify(expected2), "A limit of 1 for a word with anagrams returns only one of the results")

	anagrams = store.getAnagrams('dear', 1000)
	anagrams.sort()
	expected = ['read', 'dare']
	expected.sort()
	assert(JSON.stringify(anagrams) === JSON.stringify(expected), "An overly large limit for a word with anagrams returns all results as normal")
}
testGetAnagrams()

// Check deleteWord
function testDeleteWord() {
	// Remove words of different sizes
	store.deleteWord('a')
	let anagramMap = {
		'read': new Set(['dear', 'dare']),
		'dear': new Set(['read', 'dare']),
		'dare': new Set(['read', 'dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'new': new Set(),
		'foo': new Set(),
		'abcdefghijklmnopqrstuvwxyz': new Set()
	}
	let sizeMap = {
		1: new Set(),
		3: new Set(['new', 'foo']),
		4: new Set(['read', 'dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set(['abcdefghijklmnopqrstuvwxyz'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting 'a' worked correctly for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting 'a' worked correctly for sizeMap")

	store.deleteWord('new')
	anagramMap = {
		'read': new Set(['dear', 'dare']),
		'dear': new Set(['read', 'dare']),
		'dare': new Set(['read', 'dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set(),
		'abcdefghijklmnopqrstuvwxyz': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(['read', 'dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set(['abcdefghijklmnopqrstuvwxyz'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting 'new' worked correctly for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting 'new' worked correctly for sizeMap")

	store.deleteWord('read')
	anagramMap = {
		'dear': new Set(['dare']),
		'dare': new Set(['dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set(),
		'abcdefghijklmnopqrstuvwxyz': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(['dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set(['abcdefghijklmnopqrstuvwxyz'])
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting 'read' worked correctly for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting 'read' worked correctly for sizeMap")

	store.deleteWord('abcdefghijklmnopqrstuvwxyz')
	anagramMap = {
		'dear': new Set(['dare']),
		'dare': new Set(['dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(['dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set()
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting 'abcdefghijklmnopqrstuvwxyz' worked correctly for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting 'abcdefghijklmnopqrstuvwxyz' worked correctly for sizeMap")

	// Remove a word that doesn't exist
	store.deleteWord('abcdefghijklmnopqrstuvwxyz')
	anagramMap = {
		'dear': new Set(['dare']),
		'dare': new Set(['dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(['dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set()
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting a word that was already deleted does nothing for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting a word that was already deleted does nothing for sizeMap")

	store.deleteWord('notReal')
	anagramMap = {
		'dear': new Set(['dare']),
		'dare': new Set(['dear']),
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(['dear', 'dare']),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set()
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting a word that never existed in the store does nothing for anagramMap")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting a word that never existed in the store does nothing for sizeMap")

	// Test withAnagrams option
	store.deleteWord('dear', true)  // Word in store with anagrams
	anagramMap = {
		'computer': new Set(),
		'flower': new Set(['fowler']),
		'fowler': new Set(['flower']),
		'foo': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(),
		6: new Set(['flower', 'fowler']),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set()
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting a word in the store (that has anagrams) using 'withAnagrams' option works as expected for anagramMap.")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting a word in the store (that has anagrams) using 'withAnagrams' option works as expected for sizeMap.")

	store.deleteWord('flowre', true)  // Word not in store, but anagrams of word in store
	anagramMap = {
		'computer': new Set(),
		'foo': new Set()
	}
	sizeMap = {
		1: new Set(),
		3: new Set(['foo']),
		4: new Set(),
		6: new Set(),
		8: new Set(['computer']),
		9: new Set(),
		26: new Set()
	}
	assert(mapsAreEqual(anagramMap, store.anagramMap), "Deleting a word NOT in the store (but anagrams of it are) using 'withAnagrams' option works as expected for anagramMap.")
	assert(mapsAreEqual(sizeMap, store.sizeMap), "Deleting a word NOT in the store (but anagrams of it are) using 'withAnagrams' option works as expected for sizeMap.")
}
testDeleteWord()

// Check deleteAll
function testDeleteAll() {
	// Make sure both maps are blank
	store.deleteAll()
	assert(mapsAreEqual({}, store.anagramMap), "Store anagramMap is blank")
	assert(mapsAreEqual({}, store.sizeMap), "Store sizeMap is blank")
}
testDeleteAll()

console.log("================")
console.log("ALL TESTS PASSED")
console.log("================")
