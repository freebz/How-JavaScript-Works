// 객체

let bar = "a long rod or rigid piece of wood or metal";
let my_little_object = {
  "0/0": 0,
  foo: bar,
  bar,
  my_little_method() {
    return "So small.";
  }
};


my_little_object.foo === my_little_object.bar // true


my_little_object["0/0"] === 0	// true


my_little_object.rainbow	// undefined
my_little_object[0]		// undefined


my_little_object.age = 39;
my_little_object.foo = "slightly frilly or fancy";


delete my_little_object["0/0"];


typeof my_little_object === "object" // true



// 복사

let my_copy = Object.assign({}, my_little_object);
my_copy.bar			// "a long rod or rigid piece of wood or metal"
my_copy.age			// 39
my_copy.age += 1;
my_copy.age			// 40
delete my_copy.age;
my_copy.age			// undefined



// 상속

let my_clone = Object.create(my_little_object);
my_clone.bar			// "a long rod or rigid piece of wood or metal"
my_clone.age			// 39
my_clone.age += 1;
my_clone.age			// 40
delete my_clone.age;
my_clone.age			// 39


my_little_object.hasOwnProperty("bar") // true
my_copy.hasOwnProperty("bar")	       // true
my_clone.hasOwnProperty("bar");	       // false
my_clone.hasOwnProperty = 7;
my_clone.hasOwnProperty("bar");	       // EXCEPTION!


my_clone.toString()		// "[object Object]"


Object.create(null)



// 동결

Object.freeze(my_copy);
const my_little_constant = my_little_object;

my_little_constant.foo = 7;	// allowed
my_little_constant = 7;		// SYNTAX ERROR!
my_copy.foo = 7;		// exception!
my_copy = 7;			// allowed
