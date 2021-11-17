// 더 많은 유니코드

"\uD83D\uDCA9" === "\u{1F4A9}"	// true


String.fromCharCode(55357, 56489) === String.fromCodePoint(128169)  // true


"\uD83D\uDCA9".codePointAt(0)	// 128169


const combining_diaeresis = "\u0308";
const u_diaeresis = "u" + combining_diaeresis;
const umlaut_u = "\u00FC";

u_diaeresis === umlaut_u	                    // false
u_diaeresis.normalize() === umlaut_u.normalize()    // true
