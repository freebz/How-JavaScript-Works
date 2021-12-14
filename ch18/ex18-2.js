// 꼬리 위치

return (
  typeof any === "function"
    ? any()			// <-- 꼬리 호출
    : undefined
);



return 1 + any();		// <-- 꼬리 호출이 아님



any();				// <-- 꼬리 호출이 아님
return;



const value = any();		// <-- 꼬리 호출이 아님
return value;



function factorial(n) {
  if (n < 2) {
    return 1;
  }
  return n * factorial(n - 1);	// <-- 꼬리 호출이 아님
}


function factorial(n, result = 1) {
  if (n < 2) {
    return result;
  }
  return factorial(n - 1, n * result);    // <-- 꼬리 호출
}



return function () {};		// <-- 꼬리 호출이 아님


return (function () {}());	// <-- 꼬리 호출
