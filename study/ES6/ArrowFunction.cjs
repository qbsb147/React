const prompt = require('prompt-sync')();

let sum = (a, b) => {
	return a + b;
}

// 만일 함수가 단순한 리턴문만 있다면 한줄로 더 심플하게 줄일 수 있다
// const sum = (a, b) => a + b;

// 매개변수가 없을 경우
() => {} 

// 매개변수가 한 개인 경우, 소괄호를 생략할 수 있다.
x => {} 

// 매개변수가 여러 개인 경우, 소괄호를 생략할 수 없다.
(x, y) => {}

// single line block
x => { return x * x }  

// 함수 몸체가 한줄의 구문이라면 중괄호를 생략할 수 있으며 암묵적으로 return된다. 위 표현과 동일하다.
x => x * x;

() => { return { a: 1 }; }

() => ({ a: 1 });  // 위 표현과 동일하다. 객체 반환시 소괄호를 사용한다.

// 매개변수 기본값
(a = 1, b = 2) => a + b; 

// 나머지 매개변수
(...args) => args; 

// 구조 분해 할당
([a, b] = [1, 2]) => a + b;

// let age = prompt("나이를 알려주세요.", 18);

// let welcome = (age < 18) ?
//   () => console.log('안녕') :
//   () => console.log("안녕하세요!");


// welcome();

// var name = "Global";

// let user = {
//   name: "Inpa",
//   sayHi: function() { // 일반 함수
//     console.log(this.name); 
//   }
// };

// user.sayHi(); // Inpa

var name2 = "Global";

let user2 = {
  name: "Inpa",
  sayHi: () => { // 화살표 함수
    console.log(this.name); 
  }
};

user2.sayHi(); // Global

// /* 일반 함수로 쓸 경우 */
// let group;

// group = {
//   class: "1반",
//   students: ["짱구", "철수", "훈이"],

//   showList() {
//     group.students.forEach(
//       function(student) { 
//         // this ==== window
//       	console.log(this.class + ': ' + student) 
//       } 
//     );
//   }
// };

// group.showList();

// /* 화살표 함수로 쓸 경우 */
// // 화살표 함수의 this는 상위의 this를 그대로 가져온다.
// let group;

// group = {
//   class: "1반",
//   students: ["짱구", "철수", "훈이"],

//   showList() {
//     group.students.forEach(
//       (student) => { 
//         // this ==== group
//       	console.log(this.class + ': ' + student) 
//       } 
//     );
//   }
// };

// group.showList();

/* 화살표 함수로 쓸 경우 */
// 화살표 함수의 this는 상위의 this를 그대로 가져온다.
let group;

group = {
  class: "1반",
  students: ["짱구", "철수", "훈이"],

  showList() {
    group.students.forEach(
      (student) => { 
        // this ==== group
      	console.log(this.class + ': ' + student) 
      } 
    );
  }
};

group.showList();

// function argsFunc() {
//   console.log(arguments);
// }

// argsFunc(1, 2, 3); // [1, 2, 3]

// let argsFunc = () => {
//   console.log(arguments);
// }

// argsFunc(1, 2, 3); // ! Error

let argsFunc = (...args) => { // ...나머지 매개변수
  console.log(args);
}

argsFunc(1, 2, 3); // [1, 2, 3]

function User(name) {
  this.name = name;
}

// let user = new User("Alice");
// console.log(user.name); // Alice

let User = (name) => {
  this.name = name;
}

let user = new User("Alice"); // TypeError: User is not a constructor