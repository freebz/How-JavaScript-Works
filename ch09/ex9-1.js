// 기초

const my_little_array = [99, 111, 114, 110];
const my_little_string = String.fromCharCode(...my_little_array);
my_little_string.charCodeAt(0) === 99    // true
my_little_string.length			 // 4
typeof my_little_string			 // "string"



my_little_string[0] === my_little_array[0]         // false
my_little_string[0] === String.fromCharCode(99)    // true


my_little_string.indexOf(String.fromCharCode(111, 114))    // 1
my_little_string.indexOf(String.fromCharCode(111, 110))    // -1



my_little_array === my_little_array                            // true
my_little_array === [99, 111, 114, 110]                        // false
my_little_string === String.fromCharCode(99, 111, 114, 110)    // true



// 유니코드

my_little_string === "corn"	// true
"uni" + my_little_string	// "unicorn"
3 + 4				// 7
String(3) + 4			// 34
3 + String(4)			// 34


const mess = "monster";
const the_four = "uni" + my_little_string + " rainbow butterfly " + mess;
                           // the_four is "unicorn rainbow butterfly monster"

const first = the_four.slice(0, 7)              // first is "unicorn"
const last = the_four.slice(-7)			// last is "monster"
const parts = the_four.split(" ");		// parts is [
  						//     "unicorn"
      						//     "rainbow"
      						//     "butterfly"
      						//     "monster"
      						// ]
parts[2][0] === "b"				// treu
"*".repeat(5)					// "*****"
parts[1].padStart(10, "/")			// "///rainbow"
