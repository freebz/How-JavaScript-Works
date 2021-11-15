// 그 외의 내용

let part_zero = ["unicorns", "raindows"];
let part_one = ["butterflies", "monsters"];
let whole = part_zero.concat(part_one);
            // whole is [ 'unicorns', 'raindows', 'butterflies', 'monsters' ]


let string = whole.join(" & ");
            // string is 'unicorns & raindows & butterflies & monsters'


whole.reverse();
            // whole is [ 'monsters', 'butterflies', 'raindows', 'unicorns' ]


let element_nr = whole.indexOf("butterflies");
let good_parts;
if (element_nr !== -1) {
  good_parts = whole.slice(element_nr);
}
            // good_parts is [ 'butterflies', 'raindows', 'unicorns' ]
