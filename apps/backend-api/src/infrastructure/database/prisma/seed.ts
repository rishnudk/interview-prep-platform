import { prisma } from '../../../config/database';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Cascade delete ensures test cases and submissions are cleared
  await prisma.problem.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing database tables');

  const problemsData = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:
**Input:** nums = [2,7,11,15], target = 9  
**Output:** [0,1]  
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
      solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      tags: ['arrays', 'hash-map'],
      isPublished: true,
      order: 1,
      testCases: {
        create: [
          { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false, order: 1 },
          { input: '[[3,2,4], 6]', expectedOutput: '[1,2]', isHidden: false, order: 2 },
          { input: '[[3,3], 6]', expectedOutput: '[0,1]', isHidden: false, order: 3 },
          { input: '[[1,5,9,10,15], 25]', expectedOutput: '[3,4]', isHidden: true, order: 4 },
          { input: '[[-1,-2,-3,-4,-5], -8]', expectedOutput: '[2,4]', isHidden: true, order: 5 }
        ]
      }
    },
    {
      title: 'Reverse a String',
      slug: 'reverse-a-string',
      description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Example 1:
**Input:** s = ["h","e","l","l","o"]  
**Output:** ["o","l","l","e","h"]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function reverseString(s) {
  // Write your code here
  return s;
}`,
      solutionCode: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
      tags: ['strings', 'two-pointers'],
      isPublished: true,
      order: 2,
      testCases: {
        create: [
          { input: '[["h","e","l","l","o"]]', expectedOutput: '["o","l","l","e","h"]', isHidden: false, order: 1 },
          { input: '[["H","a","n","n","a","h"]]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false, order: 2 },
          { input: '[["a"]]', expectedOutput: '["a"]', isHidden: true, order: 3 },
          { input: '[["t","e","s","t"]]', expectedOutput: '["t","s","e","t"]', isHidden: true, order: 4 }
        ]
      }
    },
    {
      title: 'Palindrome Checker',
      slug: 'palindrome-checker',
      description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a palindrome, or \`false\` otherwise*.

### Example 1:
**Input:** s = "A man, a plan, a canal: Panama"  
**Output:** true  
**Explanation:** "amanaplanacanalpanama" is a palindrome.`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function isPalindrome(s) {
  // Write your code here
}`,
      solutionCode: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      tags: ['strings'],
      isPublished: true,
      order: 3,
      testCases: {
        create: [
          { input: '["A man, a plan, a canal: Panama"]', expectedOutput: 'true', isHidden: false, order: 1 },
          { input: '["race a car"]', expectedOutput: 'false', isHidden: false, order: 2 },
          { input: '[" "]', expectedOutput: 'true', isHidden: true, order: 3 },
          { input: '["0P"]', expectedOutput: 'false', isHidden: true, order: 4 }
        ]
      }
    },
    {
      title: 'Fibonacci Generator',
      slug: 'fibonacci-generator',
      description: `Write a generator function that yields the infinite Fibonacci sequence.

The sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.

### Example:
\`\`\`javascript
const gen = fibonacciGenerator();
gen.next().value; // 0
gen.next().value; // 1
gen.next().value; // 1
gen.next().value; // 2
\`\`\`  
Write a function \`getFibonacciArray(n)\` that returns the first \`n\` Fibonacci numbers using a generator.`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function* fibonacciGenerator() {
  // Write your generator here
}

function getFibonacciArray(n) {
  const gen = fibonacciGenerator();
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}`,
      solutionCode: `function* fibonacciGenerator() {
  let prev = 0;
  let curr = 1;
  yield prev;
  yield curr;
  while (true) {
    const next = prev + curr;
    yield next;
    prev = curr;
    curr = next;
  }
}

function getFibonacciArray(n) {
  if (n <= 0) return [];
  const gen = fibonacciGenerator();
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}`,
      tags: ['generators', 'sequences'],
      isPublished: true,
      order: 4,
      testCases: {
        create: [
          { input: '[5]', expectedOutput: '[0,1,1,2,3]', isHidden: false, order: 1 },
          { input: '[1]', expectedOutput: '[0]', isHidden: false, order: 2 },
          { input: '[10]', expectedOutput: '[0,1,1,2,3,5,8,13,21,34]', isHidden: true, order: 3 }
        ]
      }
    },
    {
      title: 'FizzBuzz',
      slug: 'fizz-buzz',
      description: `Given an integer \`n\`, return *a string array \`answer\` (1-indexed) where*:

* \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
* \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
* \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
* \`answer[i] == i\` (as a string) if none of the above conditions are true.

### Example 1:
**Input:** n = 3  
**Output:** ["1","2","Fizz"]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function fizzBuzz(n) {
  // Write your code here
}`,
      solutionCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(i.toString());
    }
  }
  return result;
}`,
      tags: ['loops', 'math'],
      isPublished: true,
      order: 5,
      testCases: {
        create: [
          { input: '[3]', expectedOutput: '["1","2","Fizz"]', isHidden: false, order: 1 },
          { input: '[5]', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false, order: 2 },
          { input: '[15]', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: true, order: 3 }
        ]
      }
    },
    {
      title: 'Chunk Array',
      slug: 'chunk-array',
      description: `Given an array \`arr\` and a chunk size \`size\`, return a **chunked** array.

A chunked array contains the original elements broken into sub-arrays of length \`size\`. The last sub-array may be shorter than \`size\` if the array length is not evenly divisible.

You must not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], size = 2  
**Output:** [[1, 2], [3, 4], [5]]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function chunk(arr, size) {
  // Write your code here
}`,
      solutionCode: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
      tags: ['arrays'],
      isPublished: true,
      order: 6,
      testCases: {
        create: [
          { input: '[[1, 2, 3, 4, 5], 2]', expectedOutput: '[[1,2],[3,4],[5]]', isHidden: false, order: 1 },
          { input: '[[1, 9, 6, 3, 2], 3]', expectedOutput: '[[1,9,6],[3,2]]', isHidden: false, order: 2 },
          { input: '[[], 1]', expectedOutput: '[]', isHidden: true, order: 3 }
        ]
      }
    },
    {
      title: 'Flatten Array',
      slug: 'flatten-array',
      description: `Given a multi-dimensional array \`arr\` and a depth \`n\`, return a **flattened** array.

A multi-dimensional array is a recursive data structure containing integers or other multi-dimensional arrays. A flattened array contains the elements in their original order, with all sub-arrays flattened up to depth \`n\`.

If \`n\` is not provided, flatten the array completely.

### Example 1:
**Input:** arr = [1, 2, 3, [4, 5, [6, 7]], 8, [9]], n = 1  
**Output:** [1, 2, 3, 4, 5, [6, 7], 8, 9]`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function flat(arr, n) {
  // Write your code here
}`,
      solutionCode: `function flat(arr, n) {
  const depth = n === undefined ? Infinity : n;
  if (depth <= 0) return arr.slice();
  
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
      tags: ['arrays', 'recursion'],
      isPublished: true,
      order: 7,
      testCases: {
        create: [
          { input: '[[1, 2, 3, [4, 5, [6, 7]], 8, [9]], 1]', expectedOutput: '[1,2,3,4,5,[6,7],8,9]', isHidden: false, order: 1 },
          { input: '[[1, 2, 3, [4, 5, [6, 7]], 8, [9]], 2]', expectedOutput: '[1,2,3,4,5,6,7,8,9]', isHidden: false, order: 2 },
          { input: '[[[1, [2, [3, [4]]]]]]', expectedOutput: '[1,2,3,4]', isHidden: true, order: 3 }
        ]
      }
    },
    {
      title: 'Debounce Implementation',
      slug: 'debounce-implementation',
      description: `Implement a \`debounce\` function. A debounced function delays invoking the original function until after \`wait\` milliseconds have elapsed since the last time the debounced function was invoked.

The debounced function should also expose a \`cancel\` method to abort delayed executions.

### Example:
\`\`\`javascript
let counter = 0;
const increment = () => counter++;
const debounced = debounce(increment, 100);

debounced();
debounced();
// Wait 100ms... counter === 1
\`\`\`  
*Note: Due to asynchronous nature, test cases will execute mock timers to verify debounce.*`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function debounce(fn, wait) {
  // Write your code here
}`,
      solutionCode: `function debounce(fn, wait) {
  let timeoutId = null;
  
  function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  }
  
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}`,
      tags: ['functions', 'async'],
      isPublished: true,
      order: 8,
      testCases: {
        create: [
          {
            input: '["debounce-test-simple"]',
            expectedOutput: '"passed"',
            isHidden: false,
            order: 1
          }
        ]
      }
    },
    {
      title: 'Deep Clone Object',
      slug: 'deep-clone-object',
      description: `Write a function \`deepClone(obj)\` that returns a deep copy of the passed object.

The object can contain nested objects, arrays, strings, numbers, booleans, null, and Date instances. It must handle circular references correctly without entering an infinite loop.

### Example:
\`\`\`javascript
const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);
clone.b.c = 3;
original.b.c; // 2
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function deepClone(obj, cache = new WeakMap()) {
  // Write your code here
}`,
      solutionCode: `function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone);
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], cache);
    }
  }
  return clone;
}`,
      tags: ['objects', 'recursion'],
      isPublished: true,
      order: 9,
      testCases: {
        create: [
          { input: '[{"a":1,"b":{"c":2}}]', expectedOutput: '{"a":1,"b":{"c":2}}', isHidden: false, order: 1 },
          { input: '[[1,{"x":9},[2]]]', expectedOutput: '[1,{"x":9},[2]]', isHidden: false, order: 2 }
        ]
      }
    },
    {
      title: 'Event Emitter Class',
      slug: 'event-emitter-class',
      description: `Design an \`EventEmitter\` class. It should support subscribing to events, unsubscribing from events, and emitting events.

Methods:
1. \`subscribe(eventName, callback)\`: Registers callback for the event. Returns a subscription object with a \`release()\` method to unsubscribe.
2. \`emit(eventName, args)\`: Calls all registered callbacks for the event with the arguments array. Returns an array of execution results.

### Example:
\`\`\`javascript
const emitter = new EventEmitter();
const sub = emitter.subscribe('click', (x) => x * 2);
emitter.emit('click', [5]); // [10]
sub.release();
emitter.emit('click', [5]); // []
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `class EventEmitter {
  subscribe(eventName, callback) {
    // Write subscription logic
    return {
      release: () => {}
    };
  }
  
  emit(eventName, args = []) {
    // Write emit logic
  }
}`,
      solutionCode: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    const callbacks = this.events.get(eventName);
    callbacks.push(callback);

    return {
      release: () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.events.delete(eventName);
        }
      }
    };
  }
  
  emit(eventName, args = []) {
    if (!this.events.has(eventName)) return [];
    const callbacks = this.events.get(eventName);
    return callbacks.map((cb) => cb(...args));
  }
}`,
      tags: ['classes', 'events'],
      isPublished: true,
      order: 10,
      testCases: {
        create: [
          { input: '["emitter-test-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 }
        ]
      }
    },
    {
      title: 'Promise.all Polyfill',
      slug: 'promise-all-polyfill',
      description: `Implement the \`promiseAll\` function which mimics \`Promise.all\`.

The function takes an array of Promises and returns a single Promise that resolves when all input promises have resolved, or rejects immediately when any input promise rejects.

### Example:
\`\`\`javascript
const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

promiseAll([p1, p2, p3]).then(values => console.log(values)); // [3, 42, 'foo']
\`\`\``,
      difficulty: 'HARD',
      category: 'JAVASCRIPT',
      starterCode: `function promiseAll(promises) {
  // Write your polyfill here
}`,
      solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Arguments must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve([]);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`,
      tags: ['promises', 'async'],
      isPublished: true,
      order: 11,
      testCases: {
        create: [
          { input: '["promise-all-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 }
        ]
      }
    },
    {
      title: 'Memoize Function',
      slug: 'memoize-function',
      description: `Write a function \`memoize(fn)\` that returns a memoized version of \`fn\`.

A memoized function caches execution results based on its argument list. If called again with the same arguments, it returns the cached result without executing the function.

Assume arguments are serializable (e.g. primitive values or JSON objects).

### Example:
\`\`\`javascript
let callCount = 0;
const add = (a, b) => {
  callCount++;
  return a + b;
};
const memoizedAdd = memoize(add);
memoizedAdd(1, 2); // 3
memoizedAdd(1, 2); // 3 (returns cached)
callCount; // 1
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function memoize(fn) {
  // Write your code here
}`,
      solutionCode: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
      tags: ['functions', 'caching'],
      isPublished: true,
      order: 12,
      testCases: {
        create: [
          { input: '["memoize-test-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 }
        ]
      }
    },
    {
      title: 'Currying Function',
      slug: 'currying-function',
      description: `Implement the \`curry\` function. Currying is the technique of converting a function that takes multiple arguments into a sequence of functions that each take a single argument.

It should allow the curried function to be called either with single arguments sequentially, or with multiple arguments at once.

### Example:
\`\`\`javascript
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
curriedSum(1, 2, 3); // 6
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function curry(fn) {
  // Write your code here
}`,
      solutionCode: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}`,
      tags: ['functions'],
      isPublished: true,
      order: 13,
      testCases: {
        create: [
          { input: '["curry-test-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 }
        ]
      }
    },
    {
      title: 'Merge Sorted Arrays',
      slug: 'merge-sorted-arrays',
      description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The modification must be in-place. The array \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to 0 and should be ignored.

### Example 1:
**Input:** nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  
**Output:** [1,2,2,3,5,6]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function merge(nums1, m, nums2, n) {
  // Write your code here
  return nums1;
}`,
      solutionCode: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;

  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }

  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
  
  return nums1;
}`,
      tags: ['arrays', 'two-pointers'],
      isPublished: true,
      order: 14,
      testCases: {
        create: [
          { input: '[[1,2,3,0,0,0], 3, [2,5,6], 3]', expectedOutput: '[1,2,2,3,5,6]', isHidden: false, order: 1 },
          { input: '[[1], 1, [], 0]', expectedOutput: '[1]', isHidden: false, order: 2 },
          { input: '[[0], 0, [1], 1]', expectedOutput: '[1]', isHidden: true, order: 3 }
        ]
      }
    },
    {
      title: 'TypeScript Type Utility: Omit',
      slug: 'ts-omit-utility',
      description: `In TypeScript, write a generic type utility \`MyOmit<T, K>\` that constructs a type by picking all properties from \`T\` and then removing \`K\`.

This is a types-only question, but represented as a verification script.

### Example:
\`\`\`typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}
type TodoPreview = MyOmit<Todo, 'description' | 'completed'>
// Expected: { title: string }
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'TYPESCRIPT',
      starterCode: `// Write your TypeScript helper here (represented as standard JS checker)
function verifyOmit() {
  return "passed";
}`,
      solutionCode: `function verifyOmit() {
  return "passed";
}`,
      tags: ['types', 'utility'],
      isPublished: true,
      order: 15,
      testCases: {
        create: [
          { input: '[]', expectedOutput: '"passed"', isHidden: false, order: 1 }
        ]
      }
    }
  ];

  console.log(`🚀 Seeding ${problemsData.length} problems...`);

  for (const problem of problemsData) {
    const created = await prisma.problem.create({
      data: problem as any,
    });
    console.log(`✅ Seeded problem: ${created.title} (slug: ${created.slug})`);
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
