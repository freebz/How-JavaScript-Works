// 정렬

let my_little_array = ["unicorns", "raindows", "butterflies", "monsters"];
my_little_array.sort()
        // [ 'butterflies', 'monsters', 'raindows', 'unicorns' ]


let my_little_array = [11, 2, 23, 13, 3, 5, 17, 7, 29, 10];
my_little_array.sort()
        // [ 10, 11, 13, 17, 2, 23, 29, 3, 5, 7 ]


function compare(first, second) {
  return first - second;
}


function refine(collection, path) {
  return path.reduce(
    function (refinement, element) {
      try {
	return refinement[element];
      } catch (ignore) {}
    },
    collection
  );
}

function by(...keys) {
  const paths = keys.map(function (element) {
    return element.toString().split(".");
  });

  return function compare(first, second) {
    let first_value;
    let second_value;
    if (paths.every(function (path) {
      first_value = refine(first, path);
      second_value = refine(second, path);
      return first_value === second_value;
    })) {
      return 0;
    }

    return (
      (
	typeof first_value === typeof second_value
	  ? first_value < second_value
	  : typeof first_value < typeof second_value
      )
	? -1
	: 1
    );
  };
}


let people = [
  {first: "Frank", last: "Farkel"},
  {first: "Fanny", last: "Farkel"},
  {first: "Sparkle", last: "Farkel"},
  {first: "Charcoal", last: "Farkel"},
  {first: "Mark", last: "Farkel"},
  {first: "Simon", last: "Farkel"},
  {first: "Gar", last: "Farkel"},
  {first: "Ferd", last: "Berfel"}
];

people.sort(by("Last", "first"));

// [
//   { first: 'Charcoal', last: 'Farkel' },
//   { first: 'Fanny', last: 'Farkel' },
//   { first: 'Ferd', last: 'Berfel' },
//   { first: 'Frank', last: 'Farkel' },
//   { first: 'Gar', last: 'Farkel' },
//   { first: 'Mark', last: 'Farkel' },
//   { first: 'Simon', last: 'Farkel' },
//   { first: 'Sparkle', last: 'Farkel' }
// ]
