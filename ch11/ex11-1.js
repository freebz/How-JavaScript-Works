// 선언문

let {huey, dewey, louie} = my_little_object;


let huey = my_little_object.huey;
let dewey = my_little_object.dewey;
let louie = my_little_object.louie;


let [zeroth, first, second] = my_little_array;


let zeroth = my_little_array[0];
let first = my_little_array[1];
let second = my_little_array[2];


function my_little_function() {
  return "So small.";
}


let my_little_function = undefined;

my_little_function = function my_little_function() {
  return "So small.";
}


let my_littlewhitespace_variable = {};
const my_little_constant = my_littlewhitespace_variable;
my_little_constant.butterfly = "free";    // {butterfly: "free"}
Object.freeze(my_littlewhitespace_variable);
my_little_constant.monster = "free";                // FAIL!
my_little_constant.monster			    // undefined
my_little_constant.butterfly			    // "free"
my_littlewhitespace_variable = Math.PI;    // my_littlewhitespace_variable is
  					   // approximately ϖ
my_little_constant = Math.PI;		            // FAIL!
