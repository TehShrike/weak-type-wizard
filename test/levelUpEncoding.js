var test = require('tape')
var Wizard = require('../')
var levelmem = require('level-mem')

test('Casting object with a date and number', function(t) {
	var object = {
		dateProperty: 'Thu Oct 31 2013 01:02:06 GMT+0000 (UTC)',
		someString: "I'm a string!",
		someNumber: '13',
		wat: true
	}

	var wizard = new Wizard({
		date: ['dateProperty'],
		number: 'someNumber'
	})

	var db = levelmem('test', {
		valueEncoding: wizard.getLevelUpEncoding()
	})

	db.put('key', object, function(err) {
		t.notOk(err, 'no error')

		db.get('key', function(err, result) {
			t.notOk(err, 'no error')

			t.equal(result.dateProperty.getTime(), 1383181326000, 'matching the date constructed from a unix timestamp')
			t.equal(result.someNumber, 13, 'Matches the number equivalent, 13')
			t.equal(result.someString, "I'm a string!", 'And the string still matches too')
			t.equal(result.wat, true, 'the boolean came through ok')

			t.end()
		})
	})
})
