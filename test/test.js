var test = require('tap').test
var Wizard = require('../')

test("Casting object with a date and number", function(t) {
	var toCast = {
		dateProperty: "Thu Oct 31 2013 01:02:06 GMT+0000 (UTC)",
		someString: "I'm a string!",
		someNumber: "13"
	}

	var wizard = new Wizard({
		date: ['dateProperty'],
		number: 'someNumber'
	})

	// Wizards are good at grammars
	var casted = wizard(toCast)

	t.similar(casted.dateProperty, new Date(1383181326000), "matching the date constructed from a unix timestamp")
	t.equal(casted.someNumber, 13, "Matches the number equivalent, 13")
	t.equal(casted.someString, "I'm a string!", "And the string still matches too")

	t.end()
})

test("Default values for properties", function(t) {
	var toCast = {
		dateProperty: new Date(1383181326000),
		someString: "I'm a string!",
		someNumber: "13"
	}

	var wizard = new Wizard({
		date: 'dateProperty',
		number: ['someNumber', 'anotherNumber'],
		default: {
			someNumber: 666,
			anotherNumber: '1337'
		}
	})

	var casted = wizard(toCast)

	t.similar(casted.dateProperty, new Date(1383181326000), "matching the date constructed from a unix timestamp")
	t.equal(casted.someNumber, 13, "Matches the number from the object, not the default")
	t.equal(casted.someString, "I'm a string!", "And the string still matches too")
	t.equal(casted.anotherNumber, 1337, 'Value was pulled from the default and then typecast correctly')

	t.end()

})

test("Extending a wizard caster with new types/defaults", function(t) {
	var wizard = new Wizard({
		date: 'dateProperty',
		number: ['someNumber', 'anotherNumber'],
		default: {
			someNumber: 666,
			anotherNumber: '1337'
		}
	})

	var apprenticeWizard = wizard.extend({
		string: 'someNumber',
		default: {
			anotherNumber: 9000
		}
	})

	var toCast = {
		dateProperty: "Thu Oct 31 2013 01:02:06 GMT+0000 (UTC)",
		someString: "I'm a string!",
		someNumber: "13"
	}

	var apprenticeSpell = apprenticeWizard(toCast)

	t.similar(apprenticeSpell.dateProperty, new Date(1383181326000), "matching the date constructed from a unix timestamp")
	t.equal(apprenticeSpell.someNumber, '13', "Matches the value from the object as a string")
	t.equal(apprenticeSpell.someString, "I'm a string!", "And the string still matches too")
	t.equal(apprenticeSpell.anotherNumber, 9000, 'Value was pulled from the default given to the apprentice')

	var spell = wizard(toCast)

	t.similar(spell.dateProperty, new Date(1383181326000), "matching the date constructed from a unix timestamp")
	t.equal(spell.someNumber, 13, "Matches the value from the original object as a number")
	t.equal(spell.someString, "I'm a string!", "And the string still matches too")
	t.equal(spell.anotherNumber, 1337, 'Value was pulled from the original defaults')

	t.end()
})
