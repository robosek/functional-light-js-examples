function unary(fun){
    return function onlyOneArgument(arg){
        return fun(arg); 
    }
}

const nonUnaryResult = ["1","2","3"].map(parseInt);
const unaryResult = ["1","2","3"].map(unary(parseInt));
console.log(nonUnaryResult);
console.log(unaryResult);
function foo(x,y) {
    console.log( x + y );
}

function bar(fn) {
    fn( [ 3, 9 ] );
}

bar( foo ); 

//Partially applied
const spreadArgs = fun => args => fun(...args);
bar(spreadArgs(foo));

//Partially applied util
const partial = (fun,...args) => (...laterArgs) => fun(...args,...laterArgs);

const add = (x,y) => x+y;
const partiallyResult = [1,2,3].map(partial(add,3));
console.log(partiallyResult);

//Reverse arguments
const partialRight = (fun,...args) => (...laterArgs) => fun(...laterArgs,...args);

function foo(x,y,z,...rest) {
    console.log( x, y, z, rest );
}

const fRight = partialRight(foo, "some-arg");
fRight(1,2,3); //1 2 3 [ 'some-arg' ]

const f= partial(foo, "some-arg");
f(1,2,3); //some-arg 1 2 [ 3 ]

const curry = (fn,arity = fn.length,nextCurried) =>
    (nextCurried = prevArgs =>
        nextArg => {
            var args = [ ...prevArgs, nextArg ];

            if (args.length >= arity) {
                return fn( ...args );
            }
            else {
                    return nextCurried( args );
            }
        }
    )( [] );

const uncarry = fun => (...args) => {
    var result = fun;

    for(var arg of args){
        result = result(arg);
    }

    return result;
} 

const sum = (...nums) => {
    let sum = 0;

    for(var number of nums){
        sum += number;
    }
    
    return sum;
}

const carreidSum = curry(sum,5);
const uncarriedSum = uncarry(carreidSum);

console.log(carreidSum(1)(2)(3)(4)(5));
console.log(uncarriedSum(1,2,3,4,5));


const not = (predicate) => (...args) => !predicate(...args);
const output = (text) => console.log(text);
const isShortEnough = (text) => text.length <= 5;
const isLongEnough = not(isShortEnough);
const when = (predicate, fun) => (...args) => predicate(...args) ? fun(...args) : undefined;

const printIf = uncarry(partialRight(when,output));
printIf(isShortEnough, "Hello");
printIf(isShortEnough, "Hello World");
printIf(isLongEnough, "Hello");
printIf(isLongEnough, "Hello World");

