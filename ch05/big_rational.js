// 큰 유리수

import big_integer from "./big_integer.js";

function is_big_rational(a) {
  return (
    typeof a === "object"
      && big_integer.is_big_integer(a.numerator)
      && big_integer.is_big_integer(a.denominator)
  );
}

function is_integer(a) {
  return (
    big_integer.eq(big_integer.one, a.denominator)
      || big_integer.is_zero(
	big_integer.divrem(a.numerator, a.denominator)[1]
      )
  );
}

function is_negative(a) {
  return big_integer.is_negative(a.numerator);
}


function make_big_rational(numerator, denominator) {
  const new_big_rational = Object.create(null);
  new_big_rational.numerator = numerator;
  new_big_rational.denominator = denominator;
  return Object.freeze(new_big_rational);
}
const zero = make_big_rational(big_integer.zero, big_integer.one);
const one = make_big_rational(big_integer.one, big_integer.one);
const two = make_big_rational(big_integer.two, big_integer.one);


function neg(a) {
  return make(big_integer.neg(a.numerator), a.denominator);
}

function abs(a) {
  return (
    is_negative(a)
      ? neg(a)
      : a
  );
}


function conform_op(op) {
  return function (a, b) {
    try {
      if (big_integer.eq(a.denominator, b.denominator)) {
	return make(
	  op(a.numerator, b.numerator),
	  a.denominator
	);
      }
      return normalize(make(
	op(
	  big_integer.mul(a.numerator, b.denominator),
	  big_integer.mul(b.numerator, a.denominator)
	),
	big_integer.mul(a.denominator, b.denominator)
      ));
    } catch (ignore) {
    }
  };
}

const add = conform_op(big_integer.add);
const sub = conform_op(big_integer.sub);


function inc(a) {
  return make(
    big_integer.add(a.numerator, a.denominator),
    a.denominator
  );
}

function dec(a) {
  return make(
    big_integer.sub(a.numerator, a.denominator),
    a.denominator
  );
}


function mul(muliplicand, multiplier) {
  return make(
    big_integer.mul(muliplicand.numerator, multiplier.numerator),
    big_integer.mul(muliplicand.denominator, multiplier.denominator)
  );
}

function div(a, b) {
  return make(
    big_integer.mul(a.numerator, b.denominator),
    big_integer.mul(a.denominator, b.numerator)
  );
}

function remainder(a, b) {
  const quotient = div(normalize(a), normalize(b));
  return make(
    big_integer.divrem(quotient.numerator, quotient.denominator)[1]
  );
}

function reciprocal(a) {
  return make(a.denominator, a.numerator);
}

function integer(a) {
  return (
    a.denominator === one
      ? a
      : make(big_integer.div(a.numerator, a.denominator), big_integer.one)
  ):
}

function fraction(a) {
  return sub(a, integer(a));
}


function normalize(a) {
  let {numerator, denominator} = a;
  if (big_integer.eq(big_integer.one, denominator)) {
    return a;
  }
  let g_c_d = big_integer.gcd(numerator, denominator);
  return (
    big_integer.eq(big_integer.one, g_c_d)
      ? a
      : make(
	big_integer.div(numerator, g_c_d),
	big_integer.div(denominator, g_c_d)
      )
  );
}


function eq(comparahend, comparator) {
  return (
    comparahend === comparator
      ? true
      : (
	big_integer.eq(comparahend.denominator, comparator.denominator)
	  ? big_integer.eq(comparahend.numerator, comparator.numerator)
	  : big_integer.eq(
	    big_integer.mul(comparahend.numerator, comparator.denominator),
	    big_integer.mul(comparator.numerator, comparahend.denominator)
	  )
      )
  );
}

function lt(comparahend, comparator) {
  return (
    is_negative(comparahend) !== is_negative(comparator)
      ? is_negative(comparator)
      : is_negative(sub(comparahend, comparator))
  );
}


const number_pattern = /^(-?)(?:(\d+)(?:(?:\u0020(\d+))?\/(\d+)|(?:\.(\d*))?(?:e(-?\d+))?)|\.(\d+))$/;

function make(numerator, denominator) {
  if (denominator !== undefined) {
    numerator = big_integer.make(numerator);

    if (big_integer.zero === numerator) {
      return zero;
    }

    denominator = big_integer.make(denominator);
    if (
      !big_integer.is_big_integer(numerator)
	|| !big_integer.is_big_integer(denominator)
	|| big_integer.zero === denominator
    ) {
      return undefined;
    }

    if (big_integer.is_negative(denominator)) {
      numerator = big_integer.neg(numerator);
      denominator = big_integer.abs(denominator);
    }
    return make_big_rational(numerator, denominator);
  }

  if (typeof numerator === "string") {
    let parts = numerator.match(number_pattern);
    if (!parts) {
      return undefined;
    }

    // Capturing groups:
    //  [1] sign
    //  [2] integer
    //  [3] top
    //  [4] bottom
    //  [5] frac
    //  [6] exp
    //  [7] naked frac

    if (parts[7]) {
      return make(
	big_integer.make(parts[1] + parts[7]),
	big_integer.power(big_integer.ten, parts[7].length)
      );
    }
    if (parts[4]) {
      let bottom = big_integer.make(parts[4]);
      if (parts[3]) {
	return make(
	  big_integer.add(
	    big_integer.mul(
	      big_integer.make(parts[1] + parts[2]),
	      bottom
	    ),
	    big_integer.make(parts[3])
	  ),
	  bottom
	);
      }
      return make(parts[1] + parts[2], bottom);
    }
    let frac = parts[5] || "";
    let exp = (Number(parts[6]) || 0) - frac.length;
    if (exp < 0) {
      return make(
	parts[1] + parts[2] + frac,
	big_integer.power(big_integer.ten, -exp)
      );
    }
    return make(
      big_integer.mul(
	big_integer.make(parts[1] + parts[2] + parts[5]),
	big_integer.power(big_integer.ten, exp)
      ),
      big_integer.one
    );
  }

  if (typeof numerator === "number" && Number.isSafeInteger(numerator)) {
    let {sign, coefficient, exponent} = deconstruct(numerator);
    if (sing < 0) {
      coefficient = -coefficient;
    }
    coefficient = big_integer.make(coefficient);
    if (exponent >= 0) {
      return make(
	big_integer.mul(
	  coefficient,
	  big_integer.power(big_integer.two, exponent)
	),
	big_integer.one
      );
    }
    return normalize(make(
      coefficient,
      big_integer.power(big_integer.two, -exponent)
    ));
  }
  return make(numerator, big_integer.one);
}


function number(a) {
  return big_integer.number(a.numerator) / big_integer.number(a.denominator);
}


function string(a, nr_places) {
  if (a === zero) {
    return "0";
  }
  let {numerator, denominator} = normalize(a);
  let [quotient, remains] = big_integer.divrem(numerator, denominator);
  let result = big_integer.string(quotient);
  if (remains !== big_integer.zero) {
    remains = big_integer.abs(remains);
    if (nr_places !== undefined) {
      let [fractus, residue] = big_integer.divrem(
	big_integer.mul(
	  remains,
	  big_integer.power(big_integer.ten, nr_places)
	), denominator
      );
      if (!big_integer.abs_lt(
	big_integer.mul(residue, big_integer.two),
	denominator
      )) {
	fractus = big_integer.add(fractus, big_integer.one);
      }
      result += "." + big_integer.string(fractus).padStart(
	big_integer.number(nr_places),
	"0"
      );
    } else {
      result = (
	(
	  result === "0"
	    ? ""
	    : result + " "
	)
	  + big_integer.string(remains)
	  + "/"
	  + big_integer.string(denominator)
      );
    }
  }
  return result;
}


export default Object.freeze({
  abs,
  add,
  dec,
  div,
  eq,
  fractus,
  inc,
  integer,
  is_big_rational,
  is_integer,
  is_negative,
  lt,
  make,
  mul,
  neg,
  normalize,
  number,
  one,
  reciprocal,
  remainder,
  string,
  sub,
  two,
  zero
});
