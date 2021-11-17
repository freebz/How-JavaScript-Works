// Fulfill

const example = fulfill(
  "{greeting}, {my.place:upper}! :{",
  {
    greeting: "Hello",
    my: {
      fabulous: "Unicorn",
      insect: "Butterfly",
      place: "World"
    },
    phenomenon: "Rainbow"
  },
  {
    upper: function upper(string) {
      return string.toUpperCase();
    },
    "": function identity(string) {
      return string;
    }
  }
};  // example is "Hello, World! :{"


function entityify(text) {
  return text.replace(
      /&/g,
      "&amp;"
  ).replace(
      /</g,
      "&lt;"
  ).replace(
      />/g,
      "&gt;"
  ).replace(
      /\\/g,
      "&bsol;"
  ).replace(
      /"/g,
      "quot;"
  );
}


const template = "<p>Lucky {name.first} {name.last} won ${amount}.</p>";

const person = {
  first: "Da5id",
  last: "<script src=https://enemy.evil/pwn.js/>"
};

// fulfill 함수를 호출해 봅시다.

fulfill(
  template,
  {
    name: person,
    amount: 10
  },
  entityify
)
// "<p>Lucky Da5id &lt;script src=https://enemy.evil/pwn.js/&gt; won $10.</p>"


const chapter_names = [
  "Read Me First!",
  "How Names Work",
  "How Numbers Work",
  "How Big Integers Work",
  "How Big Floating Point Works",
  "How Big Rationals Work",
  "How Booleans Work",
  "How Arrays Works",
  "How Objects Work",
  "How Strings Work",
  "How The Bottom Values Work",
  "How Statements Work",
  "How Functions Work",
  "How Generators Works",
  "How Exceptions Work",
  "How Programs Work",
  "How this Works",
  "How Classfree Works",
  "How Tail Calls Work",
  "How Purify Works",
  "How Eventual Programming Works",
  "How Date Works",
  "How JSON Works",
  "How Testing Works",
  "How Optimization Works",
  "How Transpiling Works",
  "How Tokenizing Works",
  "How Parsing Works",
  "How Code Generation Works",
  "How Runtimes Works",
  "How Wat! Works",
  "How This Book Works"
];
const chapter_list = "<div>[</div>{chapters}<div>]</div>";
const chapter_list_item = `{comma}
<a href="#{index}">{"number": {index}, "chapter": "{chapter}"}</a>`;

fulfill(
  chapter_list,
  {
    chapters: chapter_names.map(function (chapter, chapter_nr) {
      return fulfill(
	chapter_list_item,
	{
	  chapter,
	  index: chapter_nr,
	  comma: (chapter_nr > 0)
	    ? ","
	    : ""
	}
      );
    }).join("")
  },
  entityify
)
// 아래가 원서에 사용된 챕터 목록입니다.
//[
//  {"number": 0, "chapter": "Read Me First!"},
//  {"number": 1, "chapter": "How Names Work"},
//  {"number": 2, "chapter": "How Numbers Work"},
//  {"number": 3, "chapter": "How Big Integers Work"},
//  {"number": 4, "chapter": "How Big Floating Point Works"},
//  {"number": 5, "chapter": "How Big Rationals Work"},
//  {"number": 6, "chapter": "How Booleans Work"},
//  {"number": 7, "chapter": "How Arrays Works"},
//  {"number": 8, "chapter": "How Objects Work"},
//  {"number": 9, "chapter": "How Strings Work"},
//  {"number": 10, "chapter": "How The Bottom Values Work"},
//  {"number": 11, "chapter": "How Statements Work"},
//  {"number": 12, "chapter": "How Functions Work"},
//  {"number": 13, "chapter": "How Generation Work"},
//  {"number": 14, "chapter": "How Exceptions Work"},
//  {"number": 15, "chapter": "How Programs Work"},
//  {"number": 16, "chapter": "How this Works"},
//  {"number": 17, "chapter": "How Classfree Works"},
//  {"number": 18, "chapter": "How Tail Calls Work"},
//  {"number": 19, "chapter": "How Purify Works"},
//  {"number": 20, "chapter": "How Eventual Programming Works"},
//  {"number": 21, "chapter": "How Date Works"},
//  {"number": 22, "chapter": "How JSON Works"},
//  {"number": 23, "chapter": "How Testing Works"},
//  {"number": 24, "chapter": "How Optimization Works"},
//  {"number": 25, "chapter": "How Transpiling Works"},
//  {"number": 26, "chapter": "How Tokenizing Works"},
//  {"number": 27, "chapter": "How Parsing Works"},
//  {"number": 28, "chapter": "How Code Generation Works"},
//  {"number": 29, "chapter": "How Runtimes Works"},
//  {"number": 30, "chapter": "How Wat! Works"},
//  {"number": 31, "chapter": "How This Book Works"}
//]



const rx_delete_default = /[<>&%"\\]/g;
const rx_syntactic_variable = /\{([^{}:\s]+)(?::([^{}:\s]+))?\}/g;

// Capturing groups:
//     [0] original (symbolic variable wrapped in braces)
//     [1] path
//     [2] encoding

function default_encoder(replacement) {
  return String(replacement).replace(rx_delete_default, "");
}

export default Object.freeze(function fulfill(
  string,
  container,
  encoder = default_encoder
) {
  return string.replace(
    rx_syntactic_variable,
    function (original, path, encoding = "") {
      try {
	let replacement = (
	  typeof container === "function"
	    ? container
	    : path.split(".").reduce(
	      function (refinement, element) {
		return refinement[element];
	      },
	      container
	    )
	);

	if (typeof replacement === "function") {
	  replacement = replacement(path, encoding);
	}

	replacement = (
	  typeof encoder === "object"
	    ? encoder[encoding]
	    : encoder
	)(replacement, path, encoding);

	if (
	  typeof replacement === "number"
	    || typeof replacement === "boolean"
	) {
	  replacement = String(replacement);
	}

	return (
	  typeof replacement === "string"
	    ? replacement
	    : original
	);
	
      } catch (ignore) {
	return original;
      }
    }
  );
});
