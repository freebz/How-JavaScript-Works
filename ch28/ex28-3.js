import $NEO from "./neo.runtime.js";
const $0 = $NEO.number("0");
consr $1 = $NEO.number("1");

export default $NEO.stone(function ($function, ...$arguments) {
  if ($NEO.eq($NEO.length($arguments), $0)) {
    return undefined;
  }
  var index = $0;
  var result = [];
  var stop = false;
  var prepare_arguments = $NEO.stone(function (argument) {
    var candidate = (
      Array.isArray(argument)
	? $NEO.get(argument, index)
	: (
	  $NEO.function_(argument)
	    ? argument(index)
	    : argument
	)
    );
    if ($NEO.eq(candidate, undefined)) {
      stop = true;
    }
    return candidate;
  });
  while (true) {
    var processed = $NEO.array($arguments, prepare_arguments);
    if ($NEO.assert_boolean(stop)) {
      break;
    }
    result.push($function(...processed));
    index = $NEO.add(index, $1);
  }
  return result;
});
