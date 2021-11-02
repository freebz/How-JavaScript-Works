// Number

const good_example = Number("432")
const bad_example = new Number("432")
typeof good_example		// 'number'
typeof bad_example		// 'object'
good_example === bad_example	// false


Number.EPSILON			// 2.220446049250313e-16
Number.MAX_SAFE_INTEGER		// 9007199254740991
Number.MAX_VALUE		// 1.7976931348623157e+308
Number.MIN_VALUE		// 5e-324
