var extend = require('extend')

var defaultCastFunctions = {
	boolean: function(value) {
		return value.toString().toLowerCase() !== 'false'
			&& !(/^\d+$/.test(value)
			&& parseInt(value) !== 0)
	},
	number: function(value) {
		return parseFloat(value)
	},
	string: function(value) {
		return value.toString()
	},
	date: function(value) {
		return new Date(value)
	}
}

function convertInputTypes(typeOptions) {
	return Object.keys(typeOptions).reduce(function(memo, property) {
		return extend(true, memo, optionsArrayToTypesObject(typeOptions[property], property))
	}, {})
}

function optionsArrayToTypesObject(arr, type) {
	if (typeof arr === 'string') {
		return optionsArrayToTypesObject([arr],type)
	} else if (Array.isArray(arr)) {
		return arr.reduce(function(memo, curr) {
			memo[curr] = type
			return memo
		}, {})
	} else {
		return {}
	}
}

function castAllProperties(types, obj, casters) {
	Object.keys(obj).filter(function (propertyName) {
		return typeof types[propertyName] !== 'undefined'
	}).forEach(function (propertyName) {
		var coerce = casters[types[propertyName]]
		if (typeof coerce === 'function') {
			obj[propertyName] = coerce(obj[propertyName])
		}
	})
	return obj
}

function Caster(types, defaults, castFunctions) {
	var cast = function cast(obj) {
		var withDefaults = extend(true, {}, defaults, obj)
		return castAllProperties(types, withDefaults, castFunctions)
	}

	cast.extend = function extendCaster(options) {
		var newDefaults = options.default
		delete options.default
		var newCastFunctions = options.cast
		delete options.cast
		var newTypes = convertInputTypes(options)
		return new Caster(
			extend(true, {}, types, newTypes),
			extend(true, {}, defaults, newDefaults),
			extend(true, {}, defaultCastFunctions, castFunctions, newCastFunctions))
	}

	return cast
}

var defaultCaster = new Caster({}, {})

module.exports = function Wizard(options) {
	return defaultCaster.extend(options)
}
