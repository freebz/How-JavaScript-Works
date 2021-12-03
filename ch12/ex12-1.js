// 함수

function make_set(array, value = true) {

  // 문자열 배열에서 속성 이름을 가져와서 객체를 만듭니다.

  const object = Object.create(null);
  array.forEach(function (name) {
    object[name] = value;
  });
  return object;
}


function curry(func, ...zeroth) {
  return function (...first) {
    return func(...zeroth, ...first);
  };
}
