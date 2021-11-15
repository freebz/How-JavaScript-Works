// 스택과 큐

function make_binary_op(func) {
  return function(my_little_array) {
    let first = my_little_array.pop();
    let zeroth = my_little_array.pop();
    my_little_array.push(func(zeroth, first));
    return my_little_array;
  };
}

let addop = make_binary_op(function (zeroth, first) {
  return zeroth + first;
});

let mulop = make_binary_op(function (zeroth, first) {
  return zeroth * first;
});

let my_little_stack = [];	    // my_little_stack is []
my_little_stack.push(3);	    // my_little_stack is [3]
my_little_stack.push(5);	    // my_little_stack is [3, 5]
my_little_stack.push(7);	    // my_little_stack is [3, 5, 7]
mulop(my_little_stack);		    // my_little_stack is [3, 35]
addop(my_little_stack);		    // my_little_stack is [38]
let answer = my_little_stack.pop(); // my_little_stackis [], answer is 38
