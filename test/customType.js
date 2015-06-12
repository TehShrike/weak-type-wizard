var test = require('tape')
var Wizard = require('../')
var isDate = require('util').isDate

test('a custom typecast', function(t) {
	function castToExciting(input) {
		return '!' + input + '!'
	}

	var wizard = new Wizard({
		date: 'dateProperty',
		exciting: 'butts',
		number: ['someNumber', 'anotherNumber'],
		default: {
			someNumber: 666,
			anotherNumber: '1337'
		},
		cast: {
			exciting: castToExciting
		}
	})

	var toCast = {
		dateProperty: 'Thu Oct 31 2013 01:02:06 GMT+0000 (UTC)',
		someString: "I'm a string!",
		someNumber: '13',
		butts: 'hullo'
	}

	var cast = wizard(toCast)

	t.equal(cast.butts, '!hullo!', 'butts are now exciting')

	t.end()
})

test('deep magic', function(t) {
	var schema = {
		number: 'digits',
		objectWithADateParameterNamedMe: 'sub',
		cast: {
			objectWithADateParameterNamedMe: new Wizard({
				date: 'me'
			})
		}
	}

	var toCast = {
		digits: '13',
		sub: {
			me: '2013-12-12'
		}
	}

	var wizard = new Wizard(schema)

	var cast = wizard(toCast)

	t.equal(cast.digits, 13, 'Cast to number and stuff')
	t.ok(isDate(cast.sub.me), 'sub.me is a date')
	t.equal(cast.sub.me.getTime(), new Date('2013-12-12').getTime(), 'Cast the date properly')

	t.end()
})

test('deep magic with a bit easier syntax', function(t) {
	var schema = {
		number: 'digits',
		objectWithADateParameterNamedMe: 'sub',
		cast: {
			objectWithADateParameterNamedMe: {
				date: 'me'
			}
		}
	}

	var toCast = {
		digits: '13',
		sub: {
			me: '2013-12-12'
		}
	}

	var wizard = new Wizard(schema)

	var cast = wizard(toCast)

	t.equal(cast.digits, 13, 'Cast to number and stuff')
	t.ok(isDate(cast.sub.me), 'sub.me is a date')
	t.equal(cast.sub.me.getTime(), new Date('2013-12-12').getTime(), 'Cast the date properly')

	t.end()
})
