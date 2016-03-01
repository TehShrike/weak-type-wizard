var test = require('tape')
var Wizard = require('../')

test('Ignore invalid date', function(t) {
	var wizard = new Wizard({
		date: 'dateProperty',
		number: 'someNumber'
	})

	var toCast = {
		dateProperty: 'Totally invalid',
		someNumber: '13'
	}

	var cast = wizard(toCast)

	t.equal(typeof cast.dateProperty, 'undefined', 'No date property')
	t.equal(cast.someNumber, 13)

	t.end()
})
