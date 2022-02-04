// "You Shall Not Pass"

assertEquals("add 3 + 4", 7, add(3, 4));


jsc.claim(
  "demorgan",
  function (verdict, n) {

    // !(a && b) === !a || !b

    let a = big_integer.random(n);
    let b = big_integer.random(n);
    let mask = big_integer.mask(n);
    let left = big_integer.xor(mask, big_integer.and(a, b));
    let right = big_integer.or(
      big_integer.xor(mask, a),
      big_integer.xor(mask, b)
    );
    return verdict(big_integer.eq(left, right));
  },
  [jsc.integer()]
);


function bigint(max_nr_bits) {
  return function () {
    let nr_bits = Math.floor(Math.random() * max_nr_bits);
    let result = big_integer.random(nr_bits);
    return (
      Math.random() < 0.5
	? big_integer.neg(result)
	: result
    );
  }
}


jsc.claim(
  "null & div",
  function (verdict, a, b) {
    let product = big_integer.mul(a, b);
    return verdict(big_integer.eq(a, big_integer.div(product, b)));
  },
  [bigint(99), bigint(99)],
  function classifier(a, b) {
    if (!big_integer.is_zero(b)) {
      return "";
    }
  }
);


jsc.claim("div & mul & remainder", function (verdict, a, b) {
  let [quotient, remainder] = big_integer.divrem(a, b);
  return verdict(big_integer.eq(
    a,
    big_integer.add(big_integer.mul(quotient, b), remainder)
  ));
}, [bigint(99), bigint(99)], function classifier(a, b) {
  if (!big_integer.is_zero(b)) {
    return a[0] + b[0];
  }
});


jsc.claim("exp & mask", function (verdict, n) {
  return verdict(
    big_integer.eq(
      big_integer.add(big_integer.mask(n), big_integer.one),
      big_integer.power(big_integer.two, n)
    )
  );
}, [jsc.integer(100)]);


jsc.claim("mask & shift_up", function (verdict, n) {
  return verdict(big_integer.eq(
    big_integer.sub(
      big_integer.shift_up(big_integer.one, n),
      big_integer.one
    ),
    big_integer.mask(n)
  ));
}, [jsc.integer(0, 96)]);
