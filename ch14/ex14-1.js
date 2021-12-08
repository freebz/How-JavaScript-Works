// 예외

throw "That does not compute.";


try {
  here_goes_nothing();
} catch {
  console.log("fail: here_goes_nothing");
}



// 일상적인 예외

try {
  plan_a();
} catch {
  plan_b();
}



// 보안

throw top_secret.private_key;
