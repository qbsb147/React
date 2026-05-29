let a = 20;
let b = 8;
let c = '자바스크립트';
let str = `저는 ${a + b}살이고 ${c}를 좋아합니다.`;
console.log(str); //저는 28살이고 자바스크립트를 좋아합니다.

let person = 'Lee';
let age = 28;

let tag = function (strings, personExp, ageExp) {
  console.log(strings); // 첫 인수는 배열이 들어오고
  console.log(personExp); // 나머지 인수는 ${person}값이 들어온다.
  console.log(ageExp); // 나머지 인수는 ${age}값이 들어온다.
};

let output = tag`that ${person} is a ${age}`;

console.log(output);

let s = String.raw`xy\n${1 + 1}z`;
console.log(s); //xy\n2z

let tag2 = function (strings) {
  console.log(strings);
  return strings.raw[0];
};

let str2 = tag2`Hello\nWorld.`;
console.log(str2); //Hello\nWorld.
