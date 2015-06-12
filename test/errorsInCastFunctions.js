var test = require('tape')
var Wizard = require('../')

test('conversions that throw should result in undefined properties', function(t) {
	function alwaysThrows(input) {
		throw new Error('some error')
	}

	var doNotLogError = true

	var wizard = new Wizard({
		date: 'dateProperty',
		thrower: 'butts',
		number: ['someNumber', 'anotherNumber'],
		default: {
			someNumber: 666,
			anotherNumber: '1337'
		},
		cast: {
			thrower: alwaysThrows
		}
	}, doNotLogError)

	var toCast = {
		dateProperty: 'Thu Oct 31 2013 01:02:06 GMT+0000 (UTC)',
		someString: 'I\'m a string!',
		someNumber: '13',
		butts: 'hullo'
	}

	var cast = wizard(toCast)

	t.notOk(cast.butts, 'butts should be undefined')
	t.equal(cast.someNumber, 13, 'someNumber should have been correctly cast though')

	t.end()
})
