// 축약

function add(reduction, element) {
  return reduction + element;
}

let my_little_array = [3, 5, 7, 11];

let total = my_little_array.reduce(add, 0); // total is 26


// (0, 3)			// 3
// (3, 5)			// 8
// (8, 7)			// 15
// (15, 11)			// 26


total = my_little_array(add);	// 26


// (3, 5)			// 8
// (8, 7)			// 15
// (15, 11)			// 26


function isbn_13_check_digit(isbn_12) {
  const string_of_digits = isbn_12.replace(/-/g, "");
  if (string_of_digits.length === 12) {
    const check = string_of_digits.split("").reduce(
      function (reduction, digit, digit_nr) {
	return reduction + (
	  digit_nr % 2 === 0
	    ? Number(digit)
	    : Number(digit) * 3
	);
      },
      0
    ) % 10;
    return (
      check > 0
	? 10 - check
	: check
    );
  }
}

isbn_13_check_digit("978-1-94-981500") // 0
