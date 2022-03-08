// include 함수

@include "key"


function my_little_get_inclusion(callback, key) {
  return (
    (key[0] >= "a" && key[0] <= "z")
      ? fs.readFile(key, "utf8", function (ignore, data) {
	return callback(data);
      })
    : callback()
  );
}


const rx_include = /@include\u0020"([^"@]+)"/;

// Capturing groups:
//  [0] The whole '@include' expression
//  [1] The key

export default Object.freeze(function include(
  callback,
  string,
  get_inclusion,
  max_depth = 4
) {

  let object_of_matching;
  let result = "";

  function minion() {

    if (string === "") {
      return callback(result);
    }

    object_of_matching = rx_include.exec(string);

    if (!object_of_matching) {
      return callback(result + string);
    }

    result += string.slice(0, object_of_matching.index);
    string = string.slice(
      object_of_matching.index + object_of_matching[0].length
    );

    return get_inclusion(
      assistant_minion,
      object_of_matching[1]
    );
  }

  function junior_assitant_minion(processed_inclusion) {
    result += processed_inclusion;
    return minion();
  }

  function assistant_minion(inclusion) {
    if (typeof inclusion !== "string") {
      result += object_of_matching[0];
      return minion();
    }

    return include(
      junior_assitant_minion,
      inclusion,
      get_inclusion,
      max_depth - 1
    );
  }

  if (max_depth <= 0) {
    callback(string);
  } else {
    minion();
  }
});
