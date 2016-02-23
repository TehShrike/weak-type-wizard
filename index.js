var extend = require('xtend')

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
		try {
			return new Date(value)
		} catch (e) {
			return new Date(value + 'T00:00:00.000Z')
		}
	}
}

function convertInputTypes(typeOptions) {
	return Object.keys(typeOptions).reduce(function(memo, property) {
		return extend(memo, optionsArrayToTypesObject(typeOptions[property], property))
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

function castAllProperties(types, obj, casters, defaults, doNotLogError) {
	var copy = extend(defaults, obj)
	Object.keys(copy).forEach(function (propertyName) {
		var type = types[propertyName]
		if (type && typeof casters[type] === 'function') {
			var coerce = casters[type]
			try {
				copy[propertyName] = coerce(copy[propertyName])
			} catch(e) {
				delete copy[propertyName]
				if (!doNotLogError) {
					console.error(e)
				}
			}
		}
	})
	return copy
}

function convertCastObjectsToFunctionsIfNecessary(caster, object) {
	return typeof object === 'function' ? object : caster.extend(object)
}

function Caster(types, defaults, castFunctions, doNotLogError) {
	function cast(obj) {
		return castAllProperties(types, obj, castFunctions, defaults, doNotLogError)
	}

	cast.extend = function extendCaster(options, doNotLogErrorOverride) {
		var newCastFunctions = extend(options.cast || {})

		if (typeof newCastFunctions === 'object') {
			Object.keys(newCastFunctions).forEach(function(key) {
				newCastFunctions[key] = convertCastObjectsToFunctionsIfNecessary(cast, newCastFunctions[key])
			})
		}

		var newTypes = convertInputTypes(extend(options))
		delete newTypes.default
		delete newTypes.cast

		return new Caster(
			extend(types, newTypes),
			extend(defaults, options.default),
			extend(castFunctions, newCastFunctions),
			doNotLogErrorOverride || doNotLogError
		)
	}

	cast.getLevelUpEncoding = function getLevelUpEncoding() {
		return {
			buffer: false,
			type: 'weak-type-wizard',
			encode: JSON.stringify,
			decode: function decode(json) {
				return cast(JSON.parse(json))
			}
		}
	}

	return cast
}

var defaultCaster = new Caster({}, {}, defaultCastFunctions, false)

module.exports = function Wizard(options, doNotLogError) {
	return defaultCaster.extend(options, doNotLogError || false)
}
