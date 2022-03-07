import $NEO from "./neo.runtime.js"
const $1 = $NEO.number("1");
const $2 = $NEO.number("2");
const $3 = $NEO.number("3");
const $5 = $NEO.number("5");
const $4 = $NEO.number("4");
const $60 = $NEO.number("60");
const $6 = $NEO.number("6");

import $do from "example/do.neo";

var result = $do($NEO.add, $60, [$1, $2, $3], [$5, $4, $3]);
result = $do($NEO.div, $60, [$1, $2, $3, $4, $5, $6]);
