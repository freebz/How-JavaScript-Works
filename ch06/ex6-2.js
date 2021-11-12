// 하지 마세요!

!!p === p


!(a === b) === (a !== b)
!(a <=  b) === (a >   b)
!(a >   b) === (a <=  b)
!(a >=  b) === (a <   b)


7 < NaN				// false
NaN < 7				// false
!(7 < NaN) === 7 >= NaN		// false


!(p && q) === !p || !q
!(p || q) === !p && !q
