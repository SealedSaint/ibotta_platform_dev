import express from 'express'
import words from './words.route.js'

const app = express()

app.use('/', words)

const port = 3000
app.listen(port, () => {
	console.log('Server listening on port ' + port)
})
