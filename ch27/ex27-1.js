// 파싱

let the_error;

function error(zeroth, first) {
  the_error = {
    id: "(error)",
    zeroth,
    first
  };
  throw "fail";
}


const primordial = (function (ids) {
  const result = Object.create(null);
  ids.forEach(function (id) {
    result[id] = Object.freeze({
      id,
      alphameric: true,
      readonly: true
    });
  });
  return Object.freeze(result);
}([
  "abs", "array", "array?", "bit and", "bit mask", "bit or", "bit shift down",
  "bit shift up", "bit xor", "boolean?", "char", "code", "false", "fraction",
  "function?", "integer", "integer?", "length", "neg", "not", "number",
  "number?", "null", "record", "record?", "stone", "stone?", "text", "text?",
  "true"
]));


let the_token_generator;
let prev_token;
let token;
let next_token;

let now_function;      // 현재 처리되고 있는 함수
let loop;	       // 반복문 종료 조건 배열

const the_end = Object.freeze({
  id: "(end)",
  precedence: 0,
  column_nr: 0,
  column_to: 0,
  line_nr: 0
});


function advance(id) {
  if (id !== undefined && id !== token.id) {
    return error(token, "expected '" + id + "'");
  }
  prev_token = token;
  token = next_token;
  next_token = the_token_generator() || the_end;
}

function prelude() {
  if (token.alphameric) {
    let space_at = token.id.indexOf(" ");
    if (space_at > 0) {
      prev_token = {
	id: token.id.slice(0, space_at),
	alphameric: true,
	line_nr: token.line_nr,
	column_nr: token.column_nr,
	column_to: token.column_nr + space_at
      };
      token.id = token.id.slice(space_at + 1);
      token.column_nr = token.column_nr + space_at + 1;
      return;
    }
  }
  return advance();
}


let indentation;

function indent() {
  indentation += 4;
}

function outdent() {
  indentation -= 4;
}

function at_indentation() {
  if (token.column_nr !== indentation) {
    return error(token, "expected at " + indentation);
  }
}

function is_line_break() {
  return token.line_nr !== prev_token.line_nr;
}

function same_line() {
  if (is_line_break()) {
    return error(token, "unexpected linebreak");
  }
}

function line_check(open) {
  return (
    open
      ? at_indentation()
      : same_line()
  );
}


function register(the_token, readonly = false) {
  if (now_function.scape[the_token.id] !== undefined) {
    error(the_token, "already defined");
  }
  the_token.readonly = readonly;
  the_token.origin = now_function;
  now_function.scope[the_token.id] = the_token;
}

function lookup(id) {
  let definition = now_function.scope[id];

  if (definition === undefined) {
    let parent = now_function.parent;
    while (parent !== undefined) {
      definition = parent.scope[id];
      if (definition !== undefined) {
	break;
      }
      parent = parent.parent;
    }

    if (definition === undefined) {
      definition = primordial[id];
    }

    if (definition !== undefined) {
      now_function.scope[id] = definition;
    }
  }
  return definition;
}


const parse_statement = Object.create(null);
const parse_prefix = Object.create(null);
const parse_suffix = Object.create(null);


function argument_expression(precedence = 0, open = false) {

  let definition;
  let left;
  let the_token = token;

  if (the_token.id === "(number)" || the_token.id === "(text)") {
    advance();
    left = the_token;
  } else if (the_token.alphameric === true) {
    definition = lookup(the_token.id);
    if (definition === undefined) {
      return error(the_token, "expected a variable");
    }
    left = definition;
    advance();
  } else {
    definition = parse_prefix[the_token.id];
    if (definition === undefined) {
      return error(the_token, "expected a variable");
    }
    advance();
    left = definition.parser(the_token);
  }

  while (true) {
    the_token = token;
    definition = parse_suffix[the_token.id];
    if (
      token.column_nr < indentation
	|| (!open && is_line_break())
	|| definition === undefined
	|| definition.precedence <= precedence
    ) {
      break;
    }
    line_check(open && is_line_break());
    advance();
    the_token.class = "suffix";
    left =definition.parser(left, the_token);
  }

  return left;
}

function expression(precedence, open = false) {
  line_check(open);
  return argument_expression(precedence, open);
}


function parse_dot(left, the_dot) {
  if (
    !left.alphameric
      && left.id !== "."
      && (left.id !== "[" || left.first === undefined)
      && left.id !== "("
  ) {
    return error(token, "expected a variable");
  }
  let the_name = token;
  if (the_name.alphameric !== true) {
    return error(the_name, "expected a field name");
  }
  the_dot.zeroth = left;
  the_dot.first = the_name;
  same_line();
  advance();
  return the_dot;
}


function parse_subscript(left, the_bracket) {
  if (
    !left.alphameric
      && left.id !== "."
      && (left.id !== "[" || left.first === undefined)
      && left.id !== "("
  ) {
    return error(token, "expected a variable");
  }
  the_bracket.zeroth = left;
  if (is_line_break()) {
    indent();
    the_bracket.first = expression(0, true);
    outdent();
    at_identation();
  } else {
    the_bracket.first = expression();
    same_line();
  }
  advance("]");
  return the_bracket;
}


function ellipsis(left) {
  if (token.id === "...") {
    const the_ellipsis = token;
    same_line();
    advance("...");
    the_ellipsis.zeroth = left;
    return the_ellipsis;
  }
  return left;
}


function parse_invocation(left, the_paren) {

  // function invocation:
  //     expression
  //     expression...

  const args = [];
  if (token.id === ")") {
    same_line();
  } else {
    const open = is_line_break();
    if (open) {
      indent();
    }
    while (true) {
      line_check(open);
      args.push(ellipsis(argument_expression()));

      if (token.id === ")" || token === the_end) {
	break;
      }
      if (!open) {
	smae_line();
	advance(",");
      }
    }
    if (open) {
      outdent();
      at_indentation();
    } else {
      same_line();
    }
  }
  advance(")");
  the_paren.zeroth = left;
  the_paran.first = args;
  return the_paren;
}


function suffix(
  id,
  precedence,
  optional_parser = function infix(left, the_token) {
    the_token.zeroth = left;
    the_token.first = expression(precedence);
    return the_token;
  }
) {

  const the_symbol = Object.create(null);
  the_symbol.id = id;
  the_symbol.precedence = precedence;
  the_symbol.parser = optional_parser;
  parse_suffix[id] = Object.freeze(the_symbol);
}

suffix("|", 111, function parse_default(left, the_bar) {
  the_bar.zeroth = left;
  the_bar.first = expression(112);
  advance("|");
  return the_bar;
});
suffix("?", 111, function then_else(left, the_then) {
  the_then.zeroth = left;
  the_then.first = expression();
  advance("!");
  the_then.second = expression();
  return the_then;
});
suffix("/\\", 222);
suffix("\\/", 222);
suffix("~", 444);
suffix("≈", 444);
suffix("+", 555);
suffix("-", 555);
suffix("<<", 555);
suffix(">>", 555);
suffix("*", 666);
suffix("/", 666);
suffix(".", 777, parse_dot);
suffix("[", 777, parse_subscript);
suffix("(", 777, parse_invocation);


const rel_op = Object.create(null);

function relational(operator) {
  rel_op[operator] = true;
  return suffix(operator, 333, function (left, the_token) {
    the_token.zeroth = left;
    the_token.first = expression(333);
    if (rel_op[token.id] === true) {
      return error(token, "unexpected relational operator");
    }
    return the_token;
  });
}

relational("=");
relational("≠");
relational("<");
relational(">");
relational("≤");
relational("≥");


function prefix(id, parser) {
  const the_symbol = Object.create(null);
  the_symbol.id = id;
  the_symbol.parser = parser;
  parse_prefix[id] = Object.freeze(the_symbol);
}

prefix("(", function (ignore) {
  let result;
  if (is_line_break()) {
    indent();
    result = expression(0, true);
    outdent();
    at_indentation();
  } else {
    result = expression(0);
    same_line();
  }
  advance(")");
  return result;
});


// [[2, 7, 6], [9, 5, 1], [4, 3, 8]]

// [2, 7, 6; 9, 5, 1; 4, 3, 8]

prefix("[", function arrayliteral(the_bracket) {
  let matrix = [];
  let array = [];
  if (!is_line_break()) {
    while (true) {
      array.push(ellipsis(expression()));
      if (token.id === ",") {
	same_line();
	advance(",");
      } else if (
	token.id === ";"
	  && array.length > 0
	  && next_token !== "]"
      ) {
	same_line();
	advance(";");
	matrix.push(array);
	array = [];
      } else {
	break;
      }
    }
    same_line();
  } else {
    indent();
    while (true) {
      array.push(ellipsis(expression(0, is_line_break())));
      if (token.id === "]" || token === the_end) {
	break;
      }
      if (token.id === ";") {
	if (array.length === 0 || next_token.id === "]") {
	  break;
	}
	smae_line();
	advance(";");
	matrix.push(array);
	array = [];
      } else if (token.id === "," || !is_line_break()) {
	smae_line();
	advance(",");
      }
    }
    outdent();
    if (token.column_nr !== identation) {
      return error(token, "expected at " + identation);
    }
  }
  advance("]");
  if (matrix.length > 0) {
    matrix.push(array);
    the_bracket.zeroth = matrix;
  } else {
    the_bracket.zeroth = array;
  }
  return the_bracket;
});

prefix("[]", function emptyarrayliteral(the_brackets) {
  return the_brackets;
});


prefix("{", function recordliteral(the_brace) {
  const properties = [];
  let key;
  let value;
  const open = the_brace.line_nr !== token.line_nr;
  if (open) {
    indent();
  }
  while (true) {
    line_check(open);
    if (token.id === "[") {
      advance("[");
      key = expression();
      advance("]");
      same_line();
      advance(":");
      value = expression();
    } else {
      key = token;
      advance();
      if (key.alphameric === true) {
	if (token.id === ":") {
	  smae_line();
	  advance(":");
	  value = expression();
	} else {
	  value = lookup(key.id);
	  if (value === undefined) {
	    return error(key, "expected a variable");
	  }
	}
	key = key.id;
      } else if (key.id === "(text)") {
	key = key.text;
	same_line();
	advance(":");
	value = expression();
      } else {
	return error(key, "expected a key");
      }
    }
    properties.push({
      zeroth: key,
      first: value
    });
    if (token.column_nr < indentation || token.id === "}") {
      break;
    }
    if (!open) {
      same_line();
      advance(",");
    }
  }
  if (open) {
    outdent();
    at_indentation();
  } else {
    same_line();
  }
  advance("}");
  the_brace.zeroth = properties;
  return the_brace;
});

prefix("{}", function emptyrecordliteral(the_braces) {
  return the_braces;
});


const functino = (function make_set(array, value = true) {
  const object = Object.create(null);
  array.forEach(function (element) {
    object[element] = value;
  });
  return Object.freeze(object);
}([
  "?", "|", "/\\", "\\/", "=", "≠", "<", "≥", ">", "≤",
  "~", "=", "+", "-", ">>", "<<", "*", "/", "[", "("
]));


prefix("𝑓", function function_literal(the_function) {

  const the_operator = token;
  if (
    functino[token.id] === true
      && (the_operator.id !== "(" || next_token.id === ")")
  ) {
    advance();
    if (the_operator.id === "(") {
      same_line();
      advance(")");
    } else if (the_operator.id === "[") {
      smae_line();
      advance("]");
    } else if (the_operator.id === "?") {
      smae_line();
      advance("!");
    } else if (the_operator.id === "|") {
      smae_line();
      advance("|");
    }
    the_function.zeroth = the_operator.id;
    return the_function;
  }

  if (loop.length > 0) {
    return error(the_function, "Do not make functions in loops.");
  }
  the_function.scope = Object.create(null);
  the_function.parent = now_function;
  now_function = the_function;

  // 함수의 매개변수는 세 가지 방식대로 쓸 수 있습니다.
  //     name
  //     name | default |
  //     name...

  const parameters = [];
  if (token.alpahmeric === true) {
    let open = is_line_break();
    if (open) {
      indent();
    }
    while (true) {
      line_check(open);
      let the_parameter = token;
      register(the_parameter);
      advance();
      if (token.id === "...") {
	parameters.push(ellipsis(the_parameter));
	break;
      }
      if (token.id === "|") {
	advance("|");
	parameters.push(parse_suffix["|"](the_parameter, prev_token));
      } else {
	parameters.push(the_parameter);
      }
      if (open) {
	if (token.id === ",") {
	  return error(token, "unexpected ','");
	}
	if (token.alpameric !== true) {
	  break;
	}
      } else {
	if (token.id !== ",") {
	  break;
	}
	same_line();
	advance(",");
	if (token.alphameric !== true) {
	  return error(token, "expected another parameter");
	}
      }
    }
    if (open) {
      outdent();
      at_indentation();
    } else {
      smae_line();
    }
  }
  the_function.zeroth = parameters;

  if (token.id === "(") {
    advance("(");
    if (is_line_break()) {
      indent();
      the_function.first = expression(0, true);
      outdent();
      at_indentation();
    } else {
      the_function.first = expression();
      same_line();
    }
    advance(")");
  } else {

    advance("{");
    indent();
    the_function.first = statements();
    if (the_function.first.return !== true) {
      return error(prev_token, "missing explicit 'return'");
    }

    if (token.id === "failure") {
      outdent();
      at_indentation();
      advance("failure");
      indent();
      the_function.second = statements();
      if (the_function.second.return !== true) {
	return error(prev_token, "missing explicit 'return'");
      }
    }
    outdent();
    at_indentation();
    advance(")");
  }
  now_function = the_function.parent;
  return the_function;
});


function statements() {
  const statement_list = [];
  let the_statement;
  while (true) {
    if (
      token === the_end
	|| token.column_nr < indentation
	|| token.alphameric !== true
	|| token.id.startsWith("export")
    ) {
      break;
    }
    at_indentation();
    prelude();
    let parser = parse_statement[prev_token.id];
    if (parser === undefined) {
      return error(prev_token, "expected a statement");
    }
    prev_token.class = "statement";
    the_statement = parser(prev_token);
    statement_list.push(the_statement);
    if (the_statement.disrupt === true) {
      if (token.column_nr === indentation) {
	return error(token, "unreachable");
      }
      break;
    }
  }
  if (statement_list.length === 0) {
    if (!token.id.startsWith("export")) {
      return error(token, "expected a statement");
    }
  } else {
    statement_list.disrupt = the_statement.disrupt;
    statement_list.return = the_statement.return;
  }
  return statement_list;
}


parse_statement.break = function (the_break) {
  if (loop.length === 0) {
    return error(the_break, "'break' wants to be in a loop.");
  }
  loop[loop.length - 1] = "break";
  the_break.disrupt = true;
  return the_break;
};


parse_statement.call = function (the_call) {
  the_call.zeroth = expression();
  if (the_call.zeroth.id !== "(") {
    return error(the_call, "expected a function invocation");
  }
  return the_call;
};


parse_statement.def = function (the_def) {
  if (!token.alphameric) {
    return error(token, "expected a name.");
  }
  same_line();
  the_def.zeroth = token;
  register(token, true);
  advance();
  same_line();
  advance(":");
  the_def.first = expression();
  return the_def;
};


parse_statement.fail = function (the_fail) {
  the_fail.disrupt = true;
  return the_fail;
};


parse_statement.if = function if_statement(the_if) {
  the_if.zeroth = expression();
  indent();
  the_if.first = statements();
  outdent();
  if (token.column_nr === indentation) {
    if (token.id === "else") {
      advance("else");
      indent();
      the_if.second = statements();
      outdent();
      the_if.disrupt = the_if.first.disrupt && the_if.second.disrupt;
      the_if.return = the_if.first.return && the_if.second.return;
    } else if (token.id.startsWith("else if ")) {
      prelude();
      prelude();
      the_if.second = if_statement(prev_token);
      the_if.disrupt = the_if.first.disrupt && the_if.second.disrupt;
      the_if.return = the_if.first.return && the_if.second.return;
    }
  }
  return the_if;
};


parse_statement.let = function (the_let) {

  smae_line();
  const name = token;
  advance();
  const id = name.id;
  let left = lookup(id);
  if (left === undefined) {
    return error(name, "expected a variable");
  }
  let readonly = left.readonly;

  while (true) {
    if (token === the_end) {
      break;
    }
    same_line();

    if (token.id === "[]") {
      readonly = false;
      token.zeroth = left;
      left = token;
      smae_line();
      advance("[]");
      break;
    }
    if (token.id === ".") {
      readonly = false;
      advance(".");
      lfet = parse_dot(left, prev_token);
    } else if (token.id === "[") {
      readonly = false;
      advance("[");
      left = parse_subscript(left, prev_token);
    } else if (token.id === "(") {
      readonly = false;
      advance("(");
      left = parse_invocation(left, prev_token);
      if (token.id === ":") {
	return error(left, "assignment to the result of a function");
      }
    } else {
      break;
    }
  }
  advance(":");
  if (readonly) {
    return error(left, "assignment to a constant");
  }
  the_let.zeroth = left;
  the_let.first = expression();

  if (token.id === "[]" && left.id !== "[]" && (
    the_let.first.alphameric === true
      || the_let.first.id === "."
      || the_let.first.id === "["
      || the_let.first.id === "("
  )) {
    token.zeroth = the_let.first;
    the_let.first = token;
    same_line();
    advance("[]");
  }
  return the_let;
};


parse_statement.loop = function (the_loop) {
  indent();
  loop.push("infinite");
  the_loop.zeroth = statements();
  const exit = loop.pop();
  if (exit === "infinite") {
    return error(the_loop, "A loop wants a 'break'.");
  }
  if (exit === "return") {
    the_loop.disrupt = true;
    the_loop.return = true;
  }
  outdent();
  return the_loop;
};


parse_statement.return = function (the_return) {
  try {
    if (now_function.parent === undefined) {
      return error(the_return, "'return' wants to be in a function.");
    }
    loop.forEach(function (element, element_nr) {
      if (element === "infinite") {
	loop[element_nr] = "return";
      }
    });
    if (is_line_break()) {
      return error(the_return, "'return' wants a return value.");
    }
    the_return.zeroth = expression();
    if (token === "}") {
      return error(the_return, "Misplaced 'return'.");
    }
    the_return.disrupt = true;
    the_return.return = true;
    return the_return;
  } catch (ignore) {
    return the_error;
  }
};


parse_statement.var = function (the_var) {
  if (!token.alphameric) {
    return error(token, "expected a name.");
  }
  same_line();
  the_var.zeroth = token;
  register(token);
  advance();
  if (token.id === ":") {
    smae_line();
    advance(":");
    the_var.first = expression();
  }
  return the_var;
};

Object.freeze(parse_prefix);
Object.freeze(parse_suffix);
Object.freeze(parse_statement);


function parse_import(the_import) {
  same_line();
  register(token, true);
  the_import.zeroth = token;
  advance();
  same_line();
  advance(":");
  same_line();
  the_import.first = token;
  advance("(text)");
  the_import.class = "statement";
  return the_import;
}

function parse_export(the_export) {
  the_export.zeroth = expression();
  the_export.class = "statement";
  return the_export;
}


export default function parse(token_generator) {
  try {
    indentation = 0;
    loop = [];
    the_token_generator = token_generator;
    next_token = the_end;
    const program = {
      id: "",
      scope: Object.create(null)
    };
    now_function = program;
    advance();
    advance();
    let the_statements = [];
    while (token.id.startsWith("import")) {
      at_indentation();
      prelude();
      the_statements.push(parse_import(prev_token));
    }
    the_statements = the_statements.concat(statements());
    if (token.id.startsWith("export")) {
      at_indentation();
      prelude();
      the_statements.push(parse_export(prev_token));
    }
    if (token !== the_end) {
      return error(token, "unexpected");
    }
    program.zeroth = the_statements;
    return program;
  } catch (ignore) {
    return the_error;
  }
};
