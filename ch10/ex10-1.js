// 빈 값

function stringify_bottom(my_little_bottom) {
  if (my_little_bottom === undefined) {
    return "undefined";
  }
  if (my_little_bottom === null) {
    return "null";
  }
  if (Number.isNaN(my_little_bottom)) {
    return "NaN";
  }
}


my_little_first_name = my_little_person.name.first;

my_little_first_name = (
  my_little_person
    && my_little_person.name
    && my_little_person.name.first
);
