var obj = {
  string: 'zero',
  yell: function () {
    console.log(this.string);
  },
};
var obj2 = {
  string: 'what',
};

obj.yell(); // 'zero';
obj.yell.call(obj2); // 'what'
// obj1.yell()을 obj2.yell()로 바꾼 효과라고 보면 된다.

function example() {
  console.log(arguments);
}
example(1, 'string', true); // [1, 'string', true]

/*
function example2() {
    console.log(arguments.join()); // Array.prototype.join() 메소드는 사용할 수 없다.
}
example2(1, 'string', true); // Uncaught TypeError: arguments.join is not a function
*/

function example3() {
  console.log(Array.prototype.join.call(arguments));
}
example3(1, 'string', true); // '1,string,true'

const items = [1, 4];

items.join(); // "1,4"
Array.prototype.join.call(items); // "1,4"
[].join.call(items); // "1,4"

function convertArgsToArray() {
  console.log(arguments);

  // arguments 유사배열 겍체를 this로 사용
  // slice: 배열의 특정 부분에 대한 복사본을 생성한다.
  var arr = Array.prototype.slice.apply(arguments); // arguments.slice
  // var arr = [].slice.apply(arguments);

  console.log(arr);
  return arr;
}

convertArgsToArray(1, 2, 3); // [1,2,3]

var obj = {
  string: 'zero',
  yell: function () {
    console.log(this.string);
  },
};
var obj2 = {
  string: 'what',
};

var yell2 = obj.yell.bind(obj2);
yell2(); // 'what'
obj.yell.bind(obj2)(); // 'what'
