// 꼬리 호출

function continuize(any) {
  return function hero(continuation, ...args) {
    return continuation(any(...args));    // <-- 꼬리 호출
  };
}


// call continuation    # continuation 함수를 호출함
// return               # hero 함수를 호출한 함수로 돌아감


// jump continuation    # continuation 함수로 점프



// 반복문

while (true) {
  // do some stuff
  if (done) {
    break;
  }
  // do more stuff
}


// 꼬리 재귀 함수

(function loop() {
  // do some stuff
  if (done) {
    return;
  }
  // do more stuff
  return loop();		// <-- 꼬리 호출
}());
