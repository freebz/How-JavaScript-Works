// 제너레이터

function* counter() {
  let count = 0;
  while (true) {
    count += 1;
    yield count;
  }
}

const gen = counter();

gen.next().value		// 1
gen.next().value		// 2
gen.next().value		// 3


function counter() {
  let count = 0;
  return function counter_generator() {
    count += 1;
    return count;
  };
}

const gen = counter();

gen()				// 1
gen()				// 2
gen()				// 3
