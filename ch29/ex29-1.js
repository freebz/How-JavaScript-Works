// 런타임

function fail(what = "fail") {
  throw new Error(what);
}


let weakmap_of_weakmaps = new WeakMap();

function get(container, key) {
  try {
    if (Array.isArray(container) || typeof container === "string") {
      const element_nr = big_float.number(key);
      return (
	Number.isSafeInteger(element_nr)
	  ? container[(
	    element_nr >= 0
	      ? element_nr
	      : container.length + element_nr
	  )]
	  : undefined
      };
    }
    if (typeof container === "object") {
      if (big_float.is_big_float(key)) {
	key = big_float.string(key);
      }
      return (
	typeof key === "string"
	  ? container[key]
	  : weakmap_of_weakmaps.get(container).get(key)
      );
    }
    if (typeof container === "function") {
      return function (...rest) {
	return container(key, rest);
      };
    }
  } catch (ignore) {
  }
}


function set(container, key, value) {
  if (Object.isFrozen(container)) {
    return fail("set");
  }
  if (Array.isArray(container)) {
    let element_nr = big_float.number(key);
    if (!Number.isSafeInteger(element_nr)) {
      return fail("set");
    }

    if (element_nr < 0) {
      element_nr = container.length + element_nr;
    }
    if (element_nr < 0 || element_nr >= container.length) {
      return fail("set");
    }
    container[element_nr] = value;
  } else {
    if (big_float.is_big_float(key)) {
      key = big_float.string(key);
    }

    if (typeof key === "string") {
      if (value === undefined) {
	delete container[key];
      } else {
	container[key] = value;
      }
    } else {

      if (typeof key !== "object") {
	return fail("set");
      }
      let weakmap = weakmap_of_weakmaps.get(container);

      if (weakmap === undefined) {
	if (value === undefined) {
	  return;
	}
	weakmap = new WeakMap();
	weakmap_of_weakmaps.set(container, weakmap);
      }

      if (value === undefined) {
	weakmap.delete(key);
      } else {
	weakmap.set(key, value);
      }
    }
  }
}


function array(zeroth, first, ...rest) {

  if (big_float.is_big_float(zeroth)) {
    const dimension = big_float.number(zeroth);
    if (!Number.isSafeInteger(dimension) || dimensions < 0) {
      return fail("array");
    }
    let newness = new Array(dimensions);
    return (
      (first === undefined || dimensions === 0)
	? newness
	: (
	  typeof first === "function"
	    ? newness.map(first)
	    : newness.fill(first)
	)
    );
  }
  if (Array.isArray(zeroth)) {
    return zeroth.slice(big_float.number(first), big_float.number(rest[0]));
  }
  if (typeof zeroth === "object") {
    return Object.keys(zeroth);
  }
  if (typeof zeroth === "string") {
    return zeroth.split(first || "");
  }
  return fail("array");
}

function number(a, b) {
  return (
    typeof a === "string"
      ? big_float.make(a, b)
      : (
	typeof a === "boolean"
	  ? big_float.make(Number(a))
	  : (
	    big_float.is_big_float(a)
	      ? a
	      : undefined
	  )
      )
  );
}

function record(zeroth, first) {
  const newness = Object.create(null);
  if (zeroth === undefined) {
    return newness;
  }
  if (Array.isArray(zeroth)) {
    if (first === undefined) {
      first = true;
    }
    zeroth.forEach(function (element, element_nr) {
      set(
	newness,
	element,
	(
	  Array.isArray(first)
	    ? first[element_nr]
	    : (
	      typeof first === "function"
		? first(element)
		: first
	    )
	)
      );
    });
    return newness;
  }
  if (typeof zeroth === "object") {
    if (first === undefined) {
      return Object.assign(newness, zeroth);
    }
    if (typeof first === "object") {
      return Object.assign(newness, zeroth, first);
    }
    if (Array.isArray(first)) {
      first.forEach(function (key) {
	let value = zeroth[key];
	if (value !== undefined) {
	  newness[key] = value;
	}
      });
      return newness;
    }
  }
  return fail("record");
}

function text(zeroth, first, second) {
  if (typeof zeroth === "string") {
    return (zeroth.slice(big_float.number(first), big_float.number(second)));
  }
  if (big_float.is_big_float(zeroth)) {
    return big_float.string(zeroth, first);
  }
  if (Array.isArray(zeroth)) {
    let separator = first;
    if (typeof first !== "string") {
      if (first !== undefined) {
	return fail("string");
      }
      separator = "";
    }
    return zeroth.join(separator);
  }
  if (typeof zeroth === "boolean") {
    return String(zeroth);
  }
}


function stone(object) {
  if (!Object.isFrozen(object)) {
    object = Object.freeze(object);
    if (typeof object === "object") {
      if (Array.isArray(object)) {
	object.forEach(stone);
      } else {
	Object.keys(object).forEach(function (key) {
	  stone(object[key]);
	});
      }
    }
  }
  return object;
}


function boolean_(any) {
  return typeof any === "boolean";
}

function function_(any) {
  return typeof any === "function";
}

function integer_(any) {
  return (
    big_float.is_big_float(any)
      && big_float.normalize(any).exponent === 0
  );
}

function number_(any) {
  return (
    any !== null
      && typeof any === "object"
      && !big_float.is_big_float(any)
  );
}

function text_(any) {
  return typeof any === "string";
}


function assert_boolean(boolean) {
  return (
    typeof boolean === "boolean"
      ? boolean
      : fail("boolean")
  );
}

function and(zeroth, first) {
  return assert_boolean(zeroth) && assert_boolean(first);
}

function not(boolean) {
  return !assert_boolean(boolean);
}

function ternary(zeroth, first, secon) {
  return (
    assert_boolean(zeroth)
      ? first
      : second
  );
}

function default_function(zeroth, first) {
  return (
    zeroth === undefined
      ? first
      : zeroth
  );
}


function eq(zeroth, first) {
  return zeroth === first || (
    big_float.is_big_float(zeroth)
      && big_float.is_big_float(first)
      && big_float.eq(zeroth, first)
  );
}

function lt(zeroth, first) {
  return (
    zeroth === undefined
      ? false
      : (
	first === undefined
	  ? true
	  : (
	    (
	      big_float.is_big_float(zeroth)
		&& big_float.is_big_float(first)
	    )
	      ? big_float.lt(zeroth, first)
	      : (
		(typeof zeroth === typeof first && (
		  typeof zeroth === "string"
		    || typeof zeroth === "number"
		))
		  ? zeroth < first
		  : fail("lt")
	      )
	  )
      )
  );
}

function ge(zeroth, first) {
  return !lt(zeroth, first);
}

function gt(zeroth, first) {
  return lt(first, zeroth);
}

function le(zeroth, first) {
  return !lt(first, zeroth);
}

function ne(zeroth, first) {
  return !eq(first, zeroth);
}


function add(a, b) {
  return (
    (big_float.is_big_float(a) && big_float.is_big_float(b))
      ? big_float.add(a, b)
      : undefined
  );
}

function sub(a, b) {
  return (
    (big_float.is_big_float(a) && big_float.is_big_float(b))
      ? big_float.sub(a, b)
      : undefined
  );
}

function mul(a, b) {
  return (
    (big_float.is_big_float(a) && big_float.is_big_float(b))
      ? big_float.mul(a, b)
      : undefined
  );
}

function div(a, b) {
  return (
    (big_float.is_big_float(a) && big_float.is_big_float(b))
      ? big_float.div(a, b)
      : undefined
  );
}

function max(a, b) {
  return (
    lt(b, a)
      ? a
      : b
  );
}

function min(a, b) {
  return (
    lt(a, b)
      ? a
      : b
  );
}

function abs(a) {
  return (
    big_float.is_big_float(a)
      ? big_float.abs(a)
      : undefined
  );
}

function fraction(a) {
  return (
    big_float.is_big_float(a)
      ? big_float.fraction(a)
      : undefined
  );
}

function integer(a) {
  return (
    big_float.is_big_float(a)
      ? big_float.integer(a)
      : undefined
  );
}

function neg(a) {
  return (
    big_float.is_big_float(a)
      ? big_float.neg(a)
      : undefined
  );
}


function bitand(a, b) {
  return big_float.make(
    big_integer.and(
      big_float.integer(a).coefficient,
      big_float.integer(b).coefficient
    ),
    big_integer.one
  );
}

function bitdown(a, nr_bits) {
  return big_float.make(
    big_integer.shift_down(
      big_float.integer(a).coefficient,
      big_float.number(nr_bits)
    ),
    big_integer.one
  );
}

function bitmask(nr_bits) {
  return big_float.make(big_integer.mask(big_float.number(nr_bits)));
}

function bitor(a, b) {
  return big_float.make(
    big_integer.or(
      big_float.integer(a).coefficient,
      big_float.integer(b).coefficient
    ),
    big_integer.one
  );
}

function bitup(a, nr_bits) {
  return big_float.make(
    big_integer.shift_up(
      big_float.integer(a).coefficient,
      big_float.number(nr_bits)
    ),
    big_integer.one
  );
}

function bitxor(a, b) {
  return big_float.make(
    big_integer.xor(
      big_float.integer(a).coefficient,
      big_float.integer(b).coefficient
    ),
    big_integer.one
  );
}


function resolve(value, ...rest) {
  return (
    typeof value === "function"
      ? value(...rest)
      : value
  );
}


function cat(zeroth, first) {
  zeroth = text(zeroth);
  first = text(first);
  if (typeof zeroth === "string" && typeof first === "string") {
    return zeroth + first;
  }
}

function cats(zeroth, first) {
  zeroth = text(zeroth);
  first = text(first);
  if (typeof zeroth === "string" && typeof first === "string") {
    return (
      zeroth === ""
	? first
	: (
	  first === ""
	    ? zeroth
	    : zeroth + " " + first
	)
    );
  }
}


function char(any) {
  return String.fromCodePoint(big_float.number(any));
}

function code(any) {
  return big_float.make(any.codePointAt(0));
}

function length(linear) {
  return (
    (Array.isArray(linear) || typeof linear === "string")
      ? big_float.make(linear.length)
      : undefined
  );
}


export default stone({
  abs,
  add,
  and,
  array,
  assert_boolean,
  bitand,
  bitdown,
  bitmask,
  bitor,
  bitup,
  bitxor,
  boolean_,
  cat,
  cats,
  char,
  code,
  code,
  default: default_function,
  div,
  fail,
  fraction,
  function_,
  ge,
  get,
  gt,
  integer,
  integer_,
  le,
  length,
  max,
  min,
  mul,
  ne,
  neg,
  not,
  number,
  number_,
  or,
  record,
  record_,
  resolve,
  set,
  stone,
  sub,
  ternary,
  text,
  text_
});

  
