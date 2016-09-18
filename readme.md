A small schema enforcer that attempts to cast the properties of an object to the types you want 'em to be.

[![Travis CI](https://travis-ci.org/TehShrike/weak-type-wizard.svg)](https://travis-ci.org/TehShrike/weak-type-wizard)

# Install

```sh
npm install weak-type-wizard
```

```
var Wizard = require('weak-type-wizard')
```

# Example

<!-- js
var Wizard = require('./')
-->

```js

var cast = new Wizard({
	boolean: 'sexy',
	number: 'devil',
	date: 'Tue May 05 2015 20:51:30 GMT-0500 (CDT)',
	string: ['one', 'two', 'cat']
})

cast({
	sexy: "true",
	devil: "667",
	one: 1,
	two: "200"
}) // => { sexy: true, devil: 667, one: '1', two: '200' }

```

The "primitive" types of boolean, number, date, and string are supported.  You can supply default values, or even add your own types, like so:

```js

var wizard = new Wizard({
	date: 'dateProperty',
	exciting: 'butts',
	number: ['someNumber', 'anotherNumber'],
	default: {
		someNumber: 666,
		anotherNumber: '1337'
	},
	cast: {
		exciting: function castToExciting(input) {
			return "!" + input + "!"
		}
	}
})

```

# LevelUP support

Use a wizard as a LevelUP encoding - serialize the objects to JSON, and get them back out with all of the parameters cast to whatever you like.  Example:

```js

var levelmem = require('level-mem')

var wizard = new Wizard({
	date: ['dateProperty'],
	number: 'someNumber'
})

var db = levelmem('test', {
	valueEncoding: wizard.getLevelUpEncoding()
})

```

License
=====

[WTFPL](http://wtfpl2.com/)
