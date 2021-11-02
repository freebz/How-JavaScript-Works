// 숫자 속의 괴물

function deconstruct(number) {

  // number = sign * coefficient * (2 ** exponent)

  let sign = 1;
  let coefficient = number;
  let exponent = 0;

  if (coefficient < 0) {
    coefficient = -coefficient;
    sign = -1;
  }

  if (Number.isFinite(number) && number !== 0) {
    exponent = -1128;
    let reduction = coefficient;
    while (reduction !== 0) {
      exponent += 1;
      reduction /= 2;
    }

    reduction = exponent;
    while (reduction > 0) {
      coefficient /= 2;
      reduction -= 1;
    }
    while (reduction < 0) {
      coefficient *= 2;
      reduction += 1;
    }
  }

  return {
    sign,
    coefficient,
    exponent,
    number
  };
}


deconstruct(Number.MAX_SAFE_INTEGER)
// {
//   sign: 1,
//   coefficient: 9007199254740991,
//   exponent: 0,
//   number: 9007199254740991
// }

deconstruct(1)
// {
//   sign: 1,
//   coefficient: 9007199254740992,
//   exponent: -53,
//   number: 1
// }

deconstruct(0.1)
// {
//   sign: 1,
//   coefficient: 7205759403792794,
//   exponent: -56,
//   number: 0.1
// }

deconstruct(0.3)
// {
//   sign: 1,
//   coefficient: 10808639105689190,
//   exponent: -55,
//   number: 0.3
// }

deconstruct(0.1 + 0.2)
// {
//   sign: 1,
//   coefficient: 10808639105689192,
//   exponent: -55,
//   number: 0.30000000000000004
// }

deconstruct(100 / 3)
// {
//   sign: 1,
//   coefficient: 9382499223688534,
//   exponent: -48,
//   number: 33.333333333333336
// }
