// 토큰화

const rx_unicode_escapement = /\\u\{([0-9A-F]{4,6})\}/g;

const rx_crlf = /\n|\r\n/;

const rx_token = /(\u0020+)|(#.*)|([a-zA-Z](?:\u0020[a-zA-Z]|[0-9a-zA-Z])*\??)|(-?\d+(?:\.\d+)?(?:e\-?\d+)?)|("(?:[^"\\]|\\(?:[nr"\\]|u\{[0-9A-F]{4,6}\}))*")|(\.(?:\.\.)?|\/\\?|\\\/?|>>?|\[\]?|\{\}?|[()}\].,:?!;~≈=≠≤≥&|+\-*%𝑓$@\^_'`])/y;

// Capture Group
//     [1] Whitespace
//     [2] Comment
//     [3] Alphameric
//     [4] Number
//     [5] String
//     [6] Punctuator


export default Object.freeze(function tokenize(source, comment = false) {
  const lines = (
    Array.isArray(source)
      ? source
      : source.split(rx_crlf)
  );
  let line_nr = 0;
  let line = lines[0];
  rx_token.lastIndex = 0;

  return function token_generator() {
    if (line === undefined) {
      return;
    }
    let column_nr = rx_token.lastIndex;
    if (column_nr == line.length) {
      rx_token.lastIndex = 0;
      line_nr += 1;
      line = lines[line_nr];
      return (
	line === undefined
	  ? undefined
	  : token_generator()
      );
    }
    let captives = rx_token.exec(line);

    if (!captives) {
      return {
	id: "(error)",
	line_nr,
	column_nr,
	string: line.slice(column_nr)
      };
    }

    if (captives[1]) {
      return token_generator();
    }

    if (captives[2]) {
      return (
	comment
	  ? {
	    id: "(comment)",
	    comment: captives[2],
	    line_nr,
	    column_nr,
	    column_to: rx_token.lastIndex
	  }
	: token_generator()
      );
    }

    if (captives[3]) {
      return {
	id: captives[3],
	alphameric: true,
	line_nr,
	column_nr,
	column_to: rx_token.lastIndex
      };
    }

    if (captives[4]) {
      return {
	id: "(number)",
	readonly: true,
	number: bit_float.normalize(big_float.make(captives[4])),
	text: captives[4],
	line_nr,
	column_nr,
	column_to: rx_token.lastIndex
      };
    }

    if (captives[5]) {
      return {
	id: "(text)",
	readonly: true,
	text: JSON.parse(captives[5].replace(
	  rx_unicode_escapement,
	  function (ignore, code) {
	    return String.fromCodePoint(parseInt(code, 16));
	  }
	)),
	line_nr, column_nr,
	column_to: rx_token.lastIndex
      };
    }

    if (captives[6]) {
      return {
	id: captives[6],
	line_nr,
	column_nr,
	column_to: rx_token.lastIndex
      };
    }
  };
});
