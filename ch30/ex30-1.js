// Wat!

"" == false			// true
[] == false			// true
null == false			// false
undefined == false		// false


[] == []			// false
[] == ![]			// true


[] + []				// ""
[] + {}				// "[object Object]"
{} + {}				// "[object Object][object Object]"


9999999999999999		// 10000000000000000
1e23 + 2e23 === 3e23		// false


"2" < 5				// true
5 < "11"			// true
"11" < "2"			// true


1 < 2 < 3			// true
3 > 2 > 1			// false


"2" + 1				// "21"
"2" - 1				// 1


Math.min() > Math.max()		// true


Math instanceof Math		// throws exception
NaN instanceof NaN		// throws exception
"wat" instanceof String		// false


isNaN("this string is not NaN")	// true


((name) => [name])("wat")	// ["wat"]
((name) => {name})("wat")	// undefined


function first(w, a, t) {
  return {
    w,
    a,
    t
  };
}

first("wat", "wat", "wat");	// {w: "wat", a: "wat", t: "wat"}

function second(w, a, t) {
  return
    {w, a, t};
}

second("wat", "wat", "wat");	// undefined
