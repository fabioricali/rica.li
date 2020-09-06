// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/doz/dist/doz.js":[function(require,module,exports) {
var define;
// [DOZ]  Build version: 3.4.3  
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Doz", [], factory);
	else if(typeof exports === 'object')
		exports["Doz"] = factory();
	else
		root["Doz"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(2),
    registerDirective = _require.registerDirective;

function directive(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  registerDirective(name, options);
}

module.exports = Object.assign({
  directive: directive
}, __webpack_require__(29), __webpack_require__(30));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  COMPONENT_DYNAMIC_INSTANCE: 'componentDynamicInstance',
  COMPONENT_INSTANCE: 'componentInstance',
  COMPONENT_ROOT_INSTANCE: 'componentRootInstance',
  PROPS_ATTRIBUTES: 'props',
  ALREADY_WALKED: 'walked',
  DEFAULT_SLOT_KEY: '__default__',
  NS: {
    SVG: 'http://www.w3.org/2000/svg'
  },
  TAG: {
    ROOT: 'dz-root',
    EACH: 'dz-each-root',
    //not in use
    APP: 'dz-app',
    EMPTY: 'dz-empty',
    MOUNT: 'dz-mount',
    SLOT: 'dz-slot',
    SLOT_UPPERCASE: 'DZ-SLOT',
    SUFFIX_ROOT: '-root',
    TEXT_NODE_PLACE: 'dz-text-node',
    ITERATE_NODE_PLACE: 'dz-iterate-node'
  },
  REGEX: {
    IS_DIRECTIVE: /^d[-:][\w-]+$/,
    IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
    IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
    IS_LISTENER: /^on/,
    IS_ID_SELECTOR: /^#[\w-_:.]+$/,
    IS_PARENT_METHOD: /^parent.(.*)/,
    IS_STRING_QUOTED: /^"\w+"/,
    IS_SVG: /^svg$/,
    IS_CLASS: /^(class\s|function\s+_class|function.*[\s\S]+_classCallCheck\(this, .*\))|(throw new TypeError\("Cannot call a class)|(function.*\.__proto__\|\|Object\.getPrototypeOf\(.*?\))|(\)\.call\(this,)|(\).apply\(this,arg)|(for\(var.+=arguments.length)|(\.apply\(this,arguments\))|\.call\(this,?.*?\)/i,
    GET_LISTENER: /^this.(.*)\((.*)\)/,
    GET_LISTENER_SCOPE: /^scope.(.*)\((.*)\)/,
    IS_LISTENER_SCOPE: /(^|\()scope[.)]/g,
    TRIM_QUOTES: /^["'](.*)["']$/,
    THIS_TARGET: /\B\$this(?!\w)/g,
    HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/ig,
    HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
    MATCH_NLS: /\n\s+/gm,
    REPLACE_QUOT: /"/g,
    REPLACE_D_DIRECTIVE: /^d[-:]/,
    EXTRACT_STYLE_DISPLAY_PROPERTY: /display(?:\s+)?:(?:\s+)?([\w-]+)/
  },
  ATTR: {
    // Attributes for both
    FORCE_UPDATE: 'forceupdate'
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var data = __webpack_require__(9);
/**
 * Register a component to global
 * @param cmp
 */


function registerComponent(cmp) {
  var tag = cmp.tag.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(data.components, tag)) console.warn('Doz', "component ".concat(tag, " overwritten"));
  data.components[tag] = cmp;
}
/**
 * Remove all global components
 */


function removeAll() {
  data.components = {};
  data.plugins = []; //data.directives = {};
}
/**
 * Get component from global
 * @param tag
 * @returns {*}
 */


function getComponent(tag) {
  tag = tag.toUpperCase();
  return data.components[tag];
}
/**
 * Register a plugin to global
 * @param plugin
 */


function registerPlugin(plugin) {
  data.plugins.push(plugin);
}
/**
 * Register a directive to global
 * @param name
 * @param cfg
 */


function registerDirective(name) {
  var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof name !== 'string') {
    throw new TypeError('Doz directive name must be a string');
  }

  if (_typeof(cfg) !== 'object' || !cfg) {
    throw new TypeError('Doz directive config must be an object');
  }

  if (name[0] === ':') {
    cfg._onlyDozComponent = true;
    name = name.substr(1);
  }

  name = name.toLowerCase();
  var namePart = [];

  if (name.indexOf('-') !== -1) {
    namePart = name.split('-');
    name = namePart[0];
    namePart.shift();
  }

  cfg.name = name;
  cfg._keyArguments = namePart.map(function (item) {
    return item.substr(1);
  }); // remove $

  if (Object.prototype.hasOwnProperty.call(data.directives, name)) console.warn('Doz', "directive ".concat(name, " overwritten"));
  data.directives[name] = cfg;
  if (!data.directivesKeys.includes(name)) data.directivesKeys.push(name);
}

module.exports = {
  registerComponent: registerComponent,
  registerPlugin: registerPlugin,
  getComponent: getComponent,
  registerDirective: registerDirective,
  removeAll: removeAll,
  data: data
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var raf = window.requestAnimationFrame || window.setTimeout;
/*const raf = function (cb) {
    cb();
};*/

/*function delay(cb) {
        return raf(cb);
}*/

module.exports = raf;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function ($target) {
  if ($target && !$target._dozAttach) $target._dozAttach = {};
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(1),
    REGEX = _require.REGEX,
    PROPS_ATTRIBUTES = _require.PROPS_ATTRIBUTES;

function extractDirectivesFromProps(cmp) {
  //let canBeDeleteProps = true;
  var props;

  if (!Object.keys(cmp.props).length) {
    props = cmp._rawProps; //canBeDeleteProps = false;
  } else {
    props = cmp.props;
  }

  var _defined = function _defined(key) {
    if (isDirective(key)) {
      var keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
      cmp._directiveProps[keyWithoutD] = props[key];
      /*if (canBeDeleteProps)
          delete props[key];*/
    }
  };

  var _defined2 = Object.keys(props);

  for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
    _defined(_defined2[_i2], _i2, _defined2);
  }

  return cmp._directiveProps;
}

function isDirective(aName) {
  //return REGEX.IS_DIRECTIVE.test(name);
  return aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':');
}

function extractStyleDisplayFromDozProps($target) {
  if (!$target._dozAttach[PROPS_ATTRIBUTES] || !$target._dozAttach[PROPS_ATTRIBUTES].style) return null;

  var match = $target._dozAttach[PROPS_ATTRIBUTES].style.match(REGEX.EXTRACT_STYLE_DISPLAY_PROPERTY);

  if (match) {
    return match[1];
  }

  return null;
}

module.exports = {
  isDirective: isDirective,
  extractDirectivesFromProps: extractDirectivesFromProps,
  extractStyleDisplayFromDozProps: extractStyleDisplayFromDozProps
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var delay = __webpack_require__(3);

var directive = __webpack_require__(0);

function callBeforeCreate(context) {
  directive.callAppComponentBeforeCreate(context);
  directive.callComponentBeforeCreate(context);

  if (typeof context.onBeforeCreate === 'function') {
    return context.onBeforeCreate.call(context);
  }
}

function callCreate(context) {
  directive.callAppComponentCreate(context);
  directive.callComponentCreate(context);

  if (typeof context.onCreate === 'function') {
    context.onCreate.call(context);
  }

  context.app.emit('componentCreate', context);
}

function callConfigCreate(context) {
  directive.callAppComponentConfigCreate(context);

  if (typeof context.onConfigCreate === 'function') {
    context.onConfigCreate.call(context);
  }

  if (context.parent && typeof context.parent[context.__onConfigCreate] === 'function') {
    context.parent[context.__onConfigCreate].call(context.parent, context);
  }

  context.app.emit('componentConfigCreate', context);
}

function callBeforeMount(context) {
  directive.callAppComponentBeforeMount(context);
  directive.callComponentBeforeMount(context);

  if (typeof context.onBeforeMount === 'function') {
    return context.onBeforeMount.call(context);
  }
}

function callMount(context) {
  directive.callAppComponentMount(context);
  directive.callComponentMount(context);

  if (typeof context.onMount === 'function') {
    context.onMount.call(context);
  }

  context.app.emit('componentMount', context);
}

function callMountAsync(context) {
  delay(function () {
    directive.callAppComponentMountAsync(context);
    directive.callComponentMountAsync(context);
  });

  if (typeof context.onMountAsync === 'function') {
    delay(function () {
      return context.onMountAsync.call(context);
    });
  }

  context.app.emit('componentMountAsync', context);
}

function callBeforeUpdate(context, changes) {
  directive.callAppComponentBeforeUpdate(context, changes);
  directive.callComponentBeforeUpdate(context, changes);

  if (typeof context.onBeforeUpdate === 'function') {
    return context.onBeforeUpdate.call(context, changes);
  }
}

function callUpdate(context, changes) {
  directive.callAppComponentUpdate(context, changes);
  directive.callComponentUpdate(context, changes);

  if (typeof context.onUpdate === 'function') {
    context.onUpdate.call(context, changes);
  }

  context.app.emit('componentUpdate', context, changes);
}

function callDrawByParent(context, newNode, oldNode) {
  if (!context) return;
  directive.callAppComponentDrawByParent(context, newNode, oldNode);

  if (typeof context.onDrawByParent === 'function') {
    return context.onDrawByParent.call(context, newNode, oldNode);
  }

  if (context.parent && typeof context.parent[context.__onDrawByParent] === 'function') {
    return context.parent[context.__onDrawByParent].call(context.parent, context, newNode, oldNode);
  } //context.app.emit('componentDrawByParent', context, changes);

}

function callAfterRender(context, changes) {
  directive.callAppComponentAfterRender(context, changes);
  directive.callComponentAfterRender(context, changes);

  if (typeof context.onAfterRender === 'function') {
    return context.onAfterRender.call(context, changes);
  }
}

function callBeforeUnmount(context) {
  directive.callAppComponentBeforeUnmount(context);
  directive.callComponentBeforeUnmount(context);

  if (typeof context.onBeforeUnmount === 'function') {
    return context.onBeforeUnmount.call(context);
  }
}

function callUnmount(context) {
  directive.callAppComponentUnmount(context);
  directive.callComponentUnmount(context);

  if (typeof context.onUnmount === 'function') {
    context.onUnmount.call(context);
  }

  context.app.emit('componentUnmount', context);
}

function callBeforeDestroy(context) {
  directive.callAppComponentBeforeDestroy(context);
  directive.callComponentBeforeDestroy(context);

  if (typeof context.onBeforeDestroy === 'function') {
    return context.onBeforeDestroy.call(context);
  }
}

function callDestroy(context) {
  directive.callAppComponentDestroy(context);
  directive.callComponentDestroy(context);
  context.app.emit('componentDestroy', context);
  var style = document.getElementById(context.uId + '--style');
  var styleReset = document.getElementById(context.uId + '--style-reset');

  if (style) {
    style.parentNode.removeChild(style);
  }

  if (styleReset) {
    styleReset.parentNode.removeChild(styleReset);
  }

  if (context._unmountedPlaceholder && context._unmountedPlaceholder.parentNode) context._unmountedPlaceholder.parentNode.removeChild(context._unmountedPlaceholder);

  if (typeof context.onDestroy === 'function') {
    context.onDestroy.call(context);
    context = null;
  }
}

function callLoadProps(context) {
  directive.callAppComponentLoadProps(context);
  directive.callComponentLoadProps(context);

  if (typeof context.onLoadProps === 'function') {
    context.onLoadProps.call(context);
  }

  context.app.emit('componentLoadProps', context);
}

module.exports = {
  callBeforeCreate: callBeforeCreate,
  callCreate: callCreate,
  callConfigCreate: callConfigCreate,
  callBeforeMount: callBeforeMount,
  callMount: callMount,
  callMountAsync: callMountAsync,
  callBeforeUpdate: callBeforeUpdate,
  callUpdate: callUpdate,
  callDrawByParent: callDrawByParent,
  callAfterRender: callAfterRender,
  callBeforeUnmount: callBeforeUnmount,
  callUnmount: callUnmount,
  callBeforeDestroy: callBeforeDestroy,
  callDestroy: callDestroy,
  callLoadProps: callLoadProps
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//const castStringTo = require('../utils/cast-string-to');
var dashToCamel = __webpack_require__(8); //const isListener = require('../utils/is-listener');


var _require = __webpack_require__(1),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR,
    TAG = _require.TAG,
    PROPS_ATTRIBUTES = _require.PROPS_ATTRIBUTES;

var regExcludeSpecial = new RegExp("</?(".concat(TAG.TEXT_NODE_PLACE, "|").concat(TAG.ITERATE_NODE_PLACE, ")?>$"));

var directive = __webpack_require__(0);

var _require2 = __webpack_require__(5),
    isDirective = _require2.isDirective; //const mapper = require('./mapper');
//const eventsAttributes = require('../utils/events-attributes');


var _require3 = __webpack_require__(10),
    tplCache = _require3.tplCache;

var selfClosingElements = {
  meta: true,
  img: true,
  link: true,
  input: true,
  area: true,
  br: true,
  hr: true
};
var elementsClosedByOpening = {
  li: {
    li: true
  },
  p: {
    p: true,
    div: true
  },
  td: {
    td: true,
    th: true
  },
  th: {
    td: true,
    th: true
  }
};
var elementsClosedByClosing = {
  li: {
    ul: true,
    ol: true
  },
  a: {
    div: true
  },
  b: {
    div: true
  },
  i: {
    div: true
  },
  p: {
    div: true
  },
  td: {
    tr: true,
    table: true
  },
  th: {
    tr: true,
    table: true
  }
};

function last(arr) {
  return arr[arr.length - 1];
}

function removeNLS(str) {
  return str.replace(REGEX.MATCH_NLS, '');
}
/*
function removeDoubleQuotes(str) {
    if (typeof str === 'string') {
        if (str === '""' || str === "''")
            return '';
    }
    return str;
}
*/


var Element = /*#__PURE__*/function () {
  function Element(name, props, isSVG, style, styleScoped) {
    _classCallCheck(this, Element);

    this.type = name;
    this.props = props; //Object.assign({}, props);

    this.children = [];
    if (style) this.style = style;
    if (styleScoped) this.styleScoped = styleScoped;
    if (isSVG || name === 'svg') this.isSVG = true;
    if (props.key !== undefined) this.key = props.key; //this.hasKeys = undefined;
  }

  _createClass(Element, [{
    key: "appendChild",
    value: function appendChild(node) {
      if (node.props && node.props.key !== undefined) {
        this.hasKeys = true;
      }

      this.children.push(node);
      return node;
    }
  }]);

  return Element;
}();

function compile(tpl) {
  if (!tpl) return '';

  if (tplCache[tpl]) {
    return tplCache[tpl];
  }

  var root = new Element(null, {});
  var stack = [root];
  var currentParent = root;
  var lastTextPos = -1;
  var match;
  var props; //console.log(tpl)

  while (match = REGEX.HTML_MARKUP.exec(tpl)) {
    if (lastTextPos > -1) {
      if (
      /*lastTextPos > -1 && */
      lastTextPos + match[0].length < REGEX.HTML_MARKUP.lastIndex) {
        // remove new line space
        var text = removeNLS(tpl.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length)); //const text = (data.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
        // if has content

        if (text) {
          //console.log(text)
          //let possibleCompiled = mapper.get(text.trim());
          //text = placeholderIndex(text, values);
          //if (!Array.isArray(text)) {
          //console.log(currentParent)
          if (currentParent.style === true) {
            //console.log('currentParent.style', currentParent.style)
            currentParent.style = text; //console.log(currentParent)
          } else {
            if (text.substr(0, 5) === ' e-0_') text = text.trim();
            currentParent.appendChild(text);
          }
          /*} else {
              currentParent.appendChild(text);
          }*/

        }
      }
    }

    lastTextPos = REGEX.HTML_MARKUP.lastIndex;

    if (match[0][1] === '!') {
      // this is a comment or style
      continue;
    } // exclude special text node


    if (regExcludeSpecial.test(match[0])) {
      continue;
    } // transform slot to dz-slot


    if (match[2] === 'slot') match[2] = TAG.SLOT;

    if (!match[1]) {
      // not </ tags
      props = {};

      for (var attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
        props[attMatch[2]] = attMatch[5] || attMatch[6] || ''; //console.warn(props[attMatch[2]])

        propsFixer(match[0].substring(1, match[0].length - 1), attMatch[2], props[attMatch[2]], props, null);
      }

      if (!match[4] && elementsClosedByOpening[currentParent.type]) {
        if (elementsClosedByOpening[currentParent.type][match[2]]) {
          stack.pop();
          currentParent = last(stack);
        }
      }
      /**/


      if (match[2] === 'style') {
        currentParent.style = true;

        if (props['data-scoped'] === '') {
          currentParent.styleScoped = true;
        }

        continue;
      }

      currentParent = currentParent.appendChild(new Element(match[2], props, currentParent.isSVG));
      stack.push(currentParent);
    }

    if (match[1] || match[4] || selfClosingElements[match[2]]) {
      // </ or /> or <br> etc.
      while (true) {
        if (currentParent.type === match[2]) {
          stack.pop();
          currentParent = last(stack);
          break;
        } else {
          // Trying to close current tag, and move on
          if (elementsClosedByClosing[currentParent.type]) {
            if (elementsClosedByClosing[currentParent.type][match[2]]) {
              stack.pop();
              currentParent = last(stack);
              continue;
            }
          } // Use aggressive strategy to handle unmatching markups.


          break;
        }
      }
    }
  }

  if (root.style) {
    if (_typeof(root.children[0]) === 'object') {
      //console.log('root.style', root.style)
      root.children[0].style = root.style;
      root.children[0].styleScoped = root.styleScoped;
    }
  }

  if (root.children.length > 1) {
    root.type = TAG.ROOT;
  } else if (root.children.length) {
    tplCache[tpl] = root.children[0];
    return root.children[0];
  }

  tplCache[tpl] = root;
  return root;
}

function serializeProps($node) {
  var props = {};

  if ($node._dozAttach[PROPS_ATTRIBUTES]) {
    var keys = Object.keys($node._dozAttach[PROPS_ATTRIBUTES]);

    for (var i = 0; i < keys.length; i++) {
      propsFixer($node.nodeName, keys[i], $node._dozAttach[PROPS_ATTRIBUTES][keys[i]], props, $node);
    }
  } else if ($node.attributes) {
    var attributes = Array.from($node.attributes);

    for (var j = attributes.length - 1; j >= 0; --j) {
      var attr = attributes[j];
      propsFixer($node.nodeName, attr.name, attr.nodeValue, props, $node);
    }
  }

  return props;
}

function propsFixer(nName, aName, aValue, props, $node) {
  if (typeof aValue === 'string' && REGEX.IS_STRING_QUOTED.test(aValue)) aValue = aValue.replace(REGEX.REPLACE_QUOT, '&quot;'); //let isDirective = REGEX.IS_DIRECTIVE.test(aName);

  var _isDirective = isDirective(aName); //console.log('isDirective', isDirective, aName, aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':'));


  var propsName = REGEX.IS_CUSTOM_TAG.test(nName) && !_isDirective ? dashToCamel(aName) : aName;

  if ($node) {
    directive.callAppComponentPropsAssignName($node, aName, aValue, _isDirective, props, function (newPropsName) {
      propsName = newPropsName;
    });
  }
  /*
      if (typeof aValue === 'string' && !mapper.isValidId(aValue) && !isListener(aName)) {
          aValue = mapper.getAll(aValue);
      } else {
          let objValue = mapper.get(aValue);
          if (objValue !== undefined) {
              aValue = objValue;
          }
      }*/
  //console.log('AFTER :', aName, aValue)


  props[propsName] = aName === ATTR.FORCE_UPDATE ? true : aValue;
}

module.exports = {
  compile: compile,
  serializeProps: serializeProps,
  propsFixer: propsFixer,
  Element: Element,
  removeNLS: removeNLS,
  last: last
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function dashToCamel(s) {
  return s.replace(/(-\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}

module.exports = dashToCamel;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
  components: {},
  webComponents: {
    tags: {},
    ids: {}
  },
  plugins: [],
  directives: {},
  directivesKeys: []
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
  //kCache: Object.create(null),
  kCache: new Map(),
  tplCache: Object.create(null),
  hCache: new Map()
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = __webpack_require__(1),
    TAG = _require.TAG,
    COMPONENT_ROOT_INSTANCE = _require.COMPONENT_ROOT_INSTANCE,
    REGEX = _require.REGEX;

var observer = __webpack_require__(32);

var hooks = __webpack_require__(6);

var update = __webpack_require__(36).updateElement;

var drawDynamic = __webpack_require__(44);

var proxy = __webpack_require__(15);

var toInlineStyle = __webpack_require__(45);

var queueReady = __webpack_require__(46);

var queueDraw = __webpack_require__(47);

var extendInstance = __webpack_require__(48);

var removeAllAttributes = __webpack_require__(49);

var h = __webpack_require__(21);

var loadLocal = __webpack_require__(51);

var localMixin = __webpack_require__(52);

var _require2 = __webpack_require__(7),
    compile = _require2.compile;

var propsInit = __webpack_require__(23);

var DOMManipulation = __webpack_require__(53);

var directive = __webpack_require__(0);

var cloneObject = __webpack_require__(55);

var toLiteralString = __webpack_require__(24);

var delay = __webpack_require__(3);

var makeSureAttach = __webpack_require__(4);

var data = __webpack_require__(9); //const mapCompiled = require('../vdom/map-compiled');


var Component = /*#__PURE__*/function (_DOMManipulation) {
  _inherits(Component, _DOMManipulation);

  var _super = _createSuper(Component);

  function Component(opt) {
    var _this;

    _classCallCheck(this, Component);

    _this = _super.call(this, opt);
    Object.defineProperty(_assertThisInitialized(_this), '_isSubclass', {
      value: _this.__proto__.constructor !== Component
    });
    Object.defineProperty(_assertThisInitialized(_this), 'uId', {
      value: _this.app.generateUId(),
      enumerable: true
    });
    Object.defineProperty(_assertThisInitialized(_this), 'h', {
      value: h.bind(_assertThisInitialized(_this)),
      enumerable: false
    });

    _this._initRawProps(opt); // Assign cfg to instance


    extendInstance(_assertThisInitialized(_this), opt.cmp.cfg); // Create mixin

    localMixin(_assertThisInitialized(_this)); // Load local components

    loadLocal(_assertThisInitialized(_this));
    var beforeCreate = hooks.callBeforeCreate(_assertThisInitialized(_this));
    if (beforeCreate === false) return _possibleConstructorReturn(_this); // Create observer to props

    observer.create(_assertThisInitialized(_this), true); // Add callback to ready queue

    queueReady.add(_assertThisInitialized(_this)); // Add callback app draw

    queueDraw.add(_assertThisInitialized(_this)); // Call create

    hooks.callCreate(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Component, [{
    key: "loadProps",
    value: function loadProps(props) {
      if (_typeof(props) !== 'object') throw new TypeError('Props must be an object');
      this._rawProps = Object.assign({}, props);
      propsInit(this);
      observer.create(this);
      hooks.callLoadProps(this);
    }
  }, {
    key: "getHTMLElement",
    value: function getHTMLElement() {
      return this._parentElement;
    }
  }, {
    key: "beginSafeRender",
    value: function beginSafeRender() {
      proxy.beginRender(this.props);
    }
  }, {
    key: "endSafeRender",
    value: function endSafeRender() {
      proxy.endRender(this.props);
    }
  }, {
    key: "each",
    value: function each(obj, func) {
      var safe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      //return obj.map(func);
      var res;

      if (Array.isArray(obj)) {
        if (safe) this.beginSafeRender();
        /*res = obj.map(func).map((stringEl, i) => {
            if (typeof stringEl === 'string') {
                return stringEl.trim()
            }
        }).join('');*/

        res = new Array(obj.length);

        for (var _i2 = 0; _i2 <= obj.length - 1; _i2++) {
          res[_i2] = func(obj[_i2], _i2, obj);
        }

        if (safe) this.endSafeRender();
      }

      return res;
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "toStyle",
    value: function toStyle(obj) {
      var withStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return toInlineStyle(obj, withStyle);
    }
  }, {
    key: "render",
    value: function render(initial) {
      var changes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var silentAfterRenderEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (this._renderPause) return;
      this.beginSafeRender();
      var propsKeys = Object.keys(this.props);
      var templateArgs = [this.h];

      for (var i = 0; i < propsKeys.length; i++) {
        templateArgs.push(this.props[propsKeys[i]]);
      }

      var template = this.template.apply(this, templateArgs);
      this.endSafeRender();
      var next = template && _typeof(template) === 'object' ? template : compile(template, this);
      this.app.emit('draw', next, this._prev, this);
      queueDraw.emit(this, next, this._prev); //console.log(next)
      //console.log(this._prev)

      var rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial); //Remove attributes from component tag

      removeAllAttributes(this._cfgRoot, ['style', 'class'
      /*, 'key'*/
      ]);

      if (!this._rootElement && rootElement) {
        this._rootElement = rootElement;
        makeSureAttach(this._rootElement);
        this._parentElement = rootElement.parentNode;
        if (this.__hasStyle) this._parentElement.dataset.uid = this.uId;
      }

      this._prev = next; //console.log(this._prev)

      if (!silentAfterRenderEvent) hooks.callAfterRender(this);
      drawDynamic(this);
    }
  }, {
    key: "renderPause",
    value: function renderPause() {
      this._renderPause = true;
    }
  }, {
    key: "renderResume",
    value: function renderResume() {
      var callRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this._renderPause = false;
      if (callRender) this.render();
    }
  }, {
    key: "prepareCommit",
    value: function prepareCommit() {
      //proxy.disableDOMDelayBegin(this.props);
      proxy.pause(this.props);
      this.renderPause();
    }
  }, {
    key: "commit",
    value: function commit() {
      //delay(() => this.renderResume());
      this.renderResume();
      proxy.resume(this.props); //proxy.disableDOMDelayEnd(this.props);
    }
  }, {
    key: "mount",
    value: function mount(template) {
      var _this2 = this;

      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this._unmounted) {
        if (hooks.callBeforeMount(this) === false) return this;

        this._unmountedPlaceholder.parentNode.replaceChild(this._unmountedParentNode, this._unmountedPlaceholder);

        this._unmounted = false;
        this._unmountedParentNode = null;
        this._unmountedPlaceholder = null;
        hooks.callMount(this);

        var _defined = function _defined(child) {
          _this2.children[child].mount();
        };

        var _defined2 = Object.keys(this.children);

        for (var _i4 = 0; _i4 <= _defined2.length - 1; _i4++) {
          _defined(_defined2[_i4], _i4, _defined2);
        }

        return this;
      } else if (template) {
        if (this._rootElement.nodeType !== 1) {
          var newElement = document.createElement(this.tag + TAG.SUFFIX_ROOT);
          newElement._dozAttach = {};

          this._rootElement.parentNode.replaceChild(newElement, this._rootElement);

          this._rootElement = newElement;
          this._rootElement._dozAttach[COMPONENT_ROOT_INSTANCE] = this;
        }

        var root = this._rootElement;
        if (typeof cfg.selector === 'string') root = root.querySelector(cfg.selector);else if (cfg.selector instanceof HTMLElement) root = cfg.selector;
        this._unmounted = false;
        this._unmountedParentNode = null;
        this._unmountedPlaceholder = null;
        return this.app.mount(template, root, this);
      }
    }
  }, {
    key: "unmount",
    value: function unmount() {
      var _this3 = this;

      var onlyInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var byDestroy = arguments.length > 1 ? arguments[1] : undefined;
      var silently = arguments.length > 2 ? arguments[2] : undefined;

      if (this.lockRemoveInstanceByCallback && typeof this.lockRemoveInstanceByCallback === 'function') {
        this.lockRemoveInstanceByCallback(this.unmount, onlyInstance, byDestroy, silently);
        return;
      }

      if (!onlyInstance && (Boolean(this._unmountedParentNode) || !this._rootElement || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode)) {
        return;
      }

      if (hooks.callBeforeUnmount(this) === false) return false;
      this._unmountedParentNode = this._rootElement.parentNode;
      this._unmountedPlaceholder = document.createComment(Date.now().toString());

      if (!onlyInstance) {
        this._rootElement.parentNode.parentNode.replaceChild(this._unmountedPlaceholder, this._unmountedParentNode);
      } else if (this._rootElement.parentNode) {
        //this._rootElement.parentNode.innerHTML = '';
        this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
      }

      this._unmounted = !byDestroy;
      if (!silently) hooks.callUnmount(this);

      var _defined3 = function _defined3(child) {
        _this3.children[child].unmount(onlyInstance, byDestroy, silently);
      };

      var _defined4 = Object.keys(this.children);

      for (var _i6 = 0; _i6 <= _defined4.length - 1; _i6++) {
        _defined3(_defined4[_i6], _i6, _defined4);
      }

      return this;
    }
  }, {
    key: "destroy",
    value: function destroy(onlyInstance) {
      var _this4 = this;

      if (this.lockRemoveInstanceByCallback && typeof this.lockRemoveInstanceByCallback === 'function') {
        this.lockRemoveInstanceByCallback(this.destroy, onlyInstance);
        return;
      }

      if (this.unmount(onlyInstance, true) === false) {
        return;
      }

      if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false
      /*|| !this._rootElement.parentNode*/
      )) {
        return;
      }

      var _defined5 = function _defined5(child) {
        _this4.children[child].destroy();
      };

      var _defined6 = Object.keys(this.children);

      for (var _i8 = 0; _i8 <= _defined6.length - 1; _i8++) {
        _defined5(_defined6[_i8], _i8, _defined6);
      }

      hooks.callDestroy(this);
      return true;
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "template",
    value: function template() {
      return '';
    }
  }, {
    key: "_initTemplate",
    value: function _initTemplate(opt) {
      if (typeof opt.cmp.cfg.template === 'string' && opt.app.cfg.enableExternalTemplate) {
        var contentTpl = opt.cmp.cfg.template;

        if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
          opt.cmp.cfg.template = function () {
            var contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
            return eval('`' + contentStr + '`');
          };
        } else {
          opt.cmp.cfg.template = function () {
            contentTpl = toLiteralString(contentTpl);
            return eval('`' + contentTpl + '`');
          };
        }
      }
    }
  }, {
    key: "_initRawProps",
    value: function _initRawProps(opt) {
      //console.log(this._isSubclass)
      if (!this._isSubclass) {
        this._rawProps = Object.assign({}, typeof opt.cmp.cfg.props === 'function' ? opt.cmp.cfg.props() : opt.cmp.cfg.props, opt.props);

        this._initTemplate(opt);
      } else {
        this._rawProps = Object.assign({}, opt.props);
      }

      Object.defineProperty(this, '_initialProps', {
        value: cloneObject(this._rawProps)
      });
    }
  }, {
    key: "getDozWebComponentById",
    value: function getDozWebComponentById(id) {
      return this.getWebComponentById(id);
    }
  }, {
    key: "getDozWebComponentByTag",
    value: function getDozWebComponentByTag(name) {
      return this.getWebComponentByTag(name);
    }
  }, {
    key: "getWebComponentById",
    value: function getWebComponentById(id) {
      return data.webComponents.ids[id] || null;
    }
  }, {
    key: "getWebComponentByTag",
    value: function getWebComponentByTag(name) {
      return data.webComponents.tags[name] || null;
    }
  }, {
    key: "props",
    set: function set(props) {
      if (typeof props === 'function') props = props();
      this._rawProps = Object.assign({}, props, this._opt ? this._opt.props : {});
      observer.create(this);
      directive.callAppComponentSetProps(this);
    },
    get: function get() {
      return this._props;
    }
  }, {
    key: "config",
    set: function set(obj) {
      if (!this._isSubclass) throw new Error('Config is allowed only for classes');
      if (this._configured) throw new Error('Already configured');
      if (_typeof(obj) !== 'object') throw new TypeError('Config must be an object');
      directive.callAppComponentSetConfig(this, obj);

      if (_typeof(obj.mixin) === 'object') {
        this.mixin = obj.mixin;
        localMixin(this);
      }

      if (_typeof(obj.components) === 'object') {
        this.components = obj.components;
        loadLocal(this);
      }

      if (typeof obj.autoCreateChildren === 'boolean') {
        this.autoCreateChildren = obj.autoCreateChildren;
      }

      if (typeof obj.updateChildrenProps === 'boolean') {
        this.updateChildrenProps = obj.updateChildrenProps;
      }

      this._configured = true;
      hooks.callConfigCreate(this);
    }
  }, {
    key: "isRenderPause",
    get: function get() {
      return this._renderPause;
    }
  }]);

  return Component;
}(DOMManipulation);

module.exports = Component;
module.exports._Component = Component;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<", ">", "</", ">"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var bind = __webpack_require__(28);

var createInstance = __webpack_require__(13);

var _require = __webpack_require__(1),
    TAG = _require.TAG,
    REGEX = _require.REGEX,
    ALREADY_WALKED = _require.ALREADY_WALKED;

var toLiteralString = __webpack_require__(24);

var plugin = __webpack_require__(25);

var directive = __webpack_require__(0);

var makeSureAttach = __webpack_require__(4);

var Doz = /*#__PURE__*/function () {
  function Doz() {
    var _this = this;

    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Doz);

    this.baseTemplate = "<".concat(TAG.APP, "></").concat(TAG.APP, ">");

    if (REGEX.IS_ID_SELECTOR.test(cfg.root)) {
      cfg.root = document.getElementById(cfg.root.substring(1));
    }

    if (REGEX.IS_ID_SELECTOR.test(cfg.template)) {
      cfg.template = document.getElementById(cfg.template.substring(1));
      cfg.template = cfg.template.innerHTML;
    }

    if (!(cfg.root instanceof HTMLElement || cfg.root instanceof ShadowRoot)) {
      throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
    }

    if (!(cfg.template instanceof HTMLElement || typeof cfg.template === 'string' || typeof cfg.template === 'function')) {
      throw new TypeError('template must be a string or an HTMLElement or a function or an valid ID selector like #example-template');
    }

    var appNode = document.querySelector(TAG.APP); // This fix double app rendering in SSR

    makeSureAttach(appNode);

    if (appNode && !appNode._dozAttach[ALREADY_WALKED]) {
      appNode.parentNode.removeChild(appNode);
    }

    this.cfg = Object.assign({}, {
      components: [],
      shared: {},
      useShadowRoot: false,
      propsListener: null,
      propsListenerAsync: null,
      actions: {},
      autoDraw: true,
      enableExternalTemplate: false
    }, cfg);
    Object.defineProperties(this, {
      _lastUId: {
        value: 0,
        writable: true
      },
      _components: {
        value: {},
        writable: true
      },
      _usedComponents: {
        value: {},
        writable: true
      },
      _cache: {
        value: new Map()
      },
      _onAppReadyCB: {
        value: [],
        writable: true
      },
      _callAppReady: {
        value: function value() {
          var _defined = function _defined(cb) {
            if (typeof cb === 'function' && cb._instance) {
              cb.call(cb._instance);
            }
          };

          var _defined2 = this._onAppReadyCB;

          for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
            _defined(_defined2[_i2], _i2, _defined2);
          }

          this._onAppReadyCB = [];
        }
      },
      _onAppDrawCB: {
        value: [],
        writable: true
      },
      _onAppCB: {
        value: {},
        writable: true
      },
      useShadowRoot: {
        value: this.cfg.useShadowRoot,
        writable: true,
        enumerable: true
      },
      _root: {
        value: this.cfg.root
      },
      appId: {
        value: window.DOZ_APP_ID || Math.random().toString(36).substring(2, 15),
        enumerable: true
      },
      action: {
        value: bind(this.cfg.actions, this),
        enumerable: true
      },
      shared: {
        value: this.cfg.shared,
        writable: true,
        enumerable: true
      },
      mount: {
        value: function value(template, root) {
          var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._tree;

          if (typeof root === 'string') {
            root = document.querySelector(root);
          }

          root = root || parent._rootElement;

          if (!(root instanceof HTMLElement)) {
            throw new TypeError('root must be an HTMLElement or an valid selector like #example-root');
          }

          var contentStr = this.cfg.enableExternalTemplate ? eval('`' + toLiteralString(template) + '`') : template;
          var autoCmp = {
            tag: TAG.MOUNT,
            cfg: {
              props: {},
              template: function template(h) {
                return h(_templateObject(), TAG.ROOT, contentStr, TAG.ROOT);
              }
            }
          };
          return createInstance({
            root: root,
            template: "<".concat(TAG.MOUNT, "></").concat(TAG.MOUNT, ">"),
            app: this,
            parentCmp: parent,
            autoCmp: autoCmp,
            mount: true
          });
        },
        enumerable: true
      }
    });

    if (Array.isArray(this.cfg.components)) {
      var _defined3 = function _defined3(cmp) {
        if (_typeof(cmp) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
          _this._components[cmp.tag] = cmp;
        }
      };

      var _defined4 = this.cfg.components;

      for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
        _defined3(_defined4[_i4], _i4, _defined4);
      }
    } else if (_typeof(this.cfg.components) === 'object') {
      var _defined5 = function _defined5(objName) {
        _this._components[objName] = {
          tag: objName,
          cfg: _this.cfg.components[objName]
        };
      };

      var _defined6 = Object.keys(this.cfg.components);

      for (var _i6 = 0; _i6 <= _defined6.length - 1; _i6++) {
        _defined5(_defined6[_i6], _i6, _defined6);
      }
    }

    this._components[TAG.APP] = {
      tag: TAG.APP,
      cfg: {
        template: typeof cfg.template === 'function' ? cfg.template : function () {
          var contentStr = toLiteralString(cfg.template);
          if (/\${.*?}/g.test(contentStr)) return eval('`' + contentStr + '`');else return contentStr;
        }
      }
    };

    var _defined7 = function _defined7(p) {
      if (!['template', 'root'].includes(p)) _this._components[TAG.APP].cfg[p] = cfg[p];
    };

    var _defined8 = Object.keys(cfg);

    for (var _i8 = 0; _i8 <= _defined8.length - 1; _i8++) {
      _defined7(_defined8[_i8], _i8, _defined8);
    }

    plugin.load(this);
    directive.callAppInit(this);
    if (this.cfg.autoDraw) this.draw();

    this._callAppReady();

    this.emit('ready', this);
  }

  _createClass(Doz, [{
    key: "draw",
    value: function draw() {
      if (!this.cfg.autoDraw) this.cfg.root.innerHTML = '';
      this._tree = createInstance({
        root: this.cfg.root,
        template: this.baseTemplate,
        app: this
      }); // || [];

      return this;
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      if (typeof event !== 'string') throw new TypeError('Event must be a string');
      if (typeof callback !== 'function') throw new TypeError('Callback must be a function');

      if (!this._onAppCB[event]) {
        this._onAppCB[event] = [];
      }

      this._onAppCB[event].push(callback);

      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this._onAppCB[event]) {
        var _defined9 = function _defined9(func) {
          func.apply(_this2, args);
        };

        var _defined10 = this._onAppCB[event];

        for (var _i10 = 0; _i10 <= _defined10.length - 1; _i10++) {
          _defined9(_defined10[_i10], _i10, _defined10);
        }
      }

      return this;
    }
  }, {
    key: "generateUId",
    value: function generateUId() {
      return this.appId + '-' + ++this._lastUId;
    }
  }, {
    key: "mainComponent",
    get: function get() {
      return this._tree;
    }
  }]);

  return Doz;
}();

module.exports = Doz;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var html = __webpack_require__(14); //const transformChildStyle = require('./helpers/transform-child-style');


var _require = __webpack_require__(1),
    COMPONENT_ROOT_INSTANCE = _require.COMPONENT_ROOT_INSTANCE,
    COMPONENT_INSTANCE = _require.COMPONENT_INSTANCE,
    ALREADY_WALKED = _require.ALREADY_WALKED,
    REGEX = _require.REGEX;

var collection = __webpack_require__(2);

var hooks = __webpack_require__(6);

var _require2 = __webpack_require__(7),
    serializeProps = _require2.serializeProps;

var hmr = __webpack_require__(31);

var Component = __webpack_require__(11);

var propsInit = __webpack_require__(23);

var delay = __webpack_require__(3);

var directive = __webpack_require__(0);

var getComponentName = __webpack_require__(56);

var makeSureAttach = __webpack_require__(4);

function createInstance() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!cfg.root) return;

  if (cfg.template instanceof HTMLElement) {
    if (!cfg.template.parentNode) cfg.root.appendChild(cfg.template);
  } else if (typeof cfg.template === 'string') {
    cfg.template = html.create(cfg.template);
    cfg.root.appendChild(cfg.template);
  }

  var componentInstance = null;
  var cmpName; //let isChildStyle;

  var trash = [];

  function walk($child) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    while ($child) {
      makeSureAttach($child); // Non bella ma funziona

      if (!$child._dozAttach[ALREADY_WALKED]) {
        $child._dozAttach[ALREADY_WALKED] = true;
      } else {
        $child = $child.nextElementSibling;
        continue;
      }

      directive.callAppWalkDOM(parent, $child);
      /*
      isChildStyle = transformChildStyle($child, parent);
        if (isChildStyle) {
          $child = isChildStyle;
          continue;
      }
       */

      cmpName = getComponentName($child);
      directive.callAppComponentAssignName(parent, $child, function (name) {
        cmpName = name;
      });
      var localComponents = {};

      if (parent.cmp && parent.cmp._components) {
        localComponents = parent.cmp._components;
      }

      var cmp = cfg.autoCmp || localComponents[cmpName] || cfg.app._components[cmpName] || collection.getComponent(cmpName);
      var parentElement = void 0;

      if (cmp) {
        var _ret = function () {
          //console.log(cmpName)
          if (parent.cmp) {
            var rawChild = $child.outerHTML;
            parent.cmp.rawChildren.push(rawChild);
          } // For node created by mount method


          if (parent.cmp && parent.cmp.mounted) {
            $child = $child.nextElementSibling;
            return "continue";
          }

          if (parent.cmp && parent.cmp.autoCreateChildren === false) {
            trash.push($child);
            $child = $child.nextElementSibling;
            return "continue";
          }

          var props = serializeProps($child);
          var componentDirectives = {};
          var newElement = void 0;

          if (typeof cmp.cfg === 'function') {
            // This implements single function component
            if (!REGEX.IS_CLASS.test(Function.prototype.toString.call(cmp.cfg))) {
              var func = cmp.cfg;

              cmp.cfg = /*#__PURE__*/function (_Component) {
                _inherits(_class, _Component);

                var _super = _createSuper(_class);

                function _class() {
                  _classCallCheck(this, _class);

                  return _super.apply(this, arguments);
                }

                return _class;
              }(Component);

              cmp.cfg.prototype.template = func;
            }

            newElement = new cmp.cfg({
              tag: cmp.tag || cmpName,
              root: $child,
              app: cfg.app,
              props: props,
              componentDirectives: componentDirectives,
              parentCmp: parent.cmp || cfg.parent
            });
          } else {
            newElement = new Component({
              tag: cmp.tag || cmpName,
              cmp: cmp,
              root: $child,
              app: cfg.app,
              props: props,
              componentDirectives: componentDirectives,
              parentCmp: parent.cmp || cfg.parent
            });
          }

          if (!newElement) {
            $child = $child.nextElementSibling;
            return "continue";
          }

          newElement.rawChildrenObject = $child._dozAttach.elementChildren;

          if (_typeof(newElement.module) === 'object') {
            hmr(newElement, newElement.module);
          }

          propsInit(newElement);
          newElement.app.emit('componentPropsInit', newElement);

          if (hooks.callBeforeMount(newElement) !== false) {
            newElement._isRendered = true;
            newElement.render(true);

            if (!componentInstance) {
              componentInstance = newElement;
            }

            newElement._rootElement._dozAttach[COMPONENT_ROOT_INSTANCE] = newElement;
            newElement.getHTMLElement()._dozAttach[COMPONENT_INSTANCE] = newElement; // Replace first element child if defaultSlot exists with a slot comment

            if (newElement._defaultSlot && newElement.getHTMLElement().firstElementChild) {
              var slotPlaceholder = document.createComment('slot');
              newElement.getHTMLElement().replaceChild(slotPlaceholder, newElement.getHTMLElement().firstElementChild);
            } // This is an hack for call render a second time so the
            // event onAppDraw and onDrawByParent are fired after
            // that the component is mounted.
            // This hack makes also the component that has keys
            // Really this hack is very important :D :D


            delay(function () {
              newElement.render(false, [], true);
            });
            hooks.callMount(newElement);
            hooks.callMountAsync(newElement);
          }

          parentElement = newElement;

          if (parent.cmp) {
            var n = Object.keys(parent.cmp.children).length++;
            directive.callAppComponentAssignIndex(newElement, n, function (index) {
              parent.cmp.children[index] = newElement;
            });

            if (parent.cmp.childrenByTag[newElement.tag] === undefined) {
              parent.cmp.childrenByTag[newElement.tag] = [newElement];
            } else {
              parent.cmp.childrenByTag[newElement.tag].push(newElement);
            }
          }

          cfg.autoCmp = null;
        }();

        if (_ret === "continue") continue;
      }

      if ($child.hasChildNodes()) {
        if (parentElement) {
          walk($child.firstElementChild, {
            cmp: parentElement
          });
        } else {
          walk($child.firstElementChild, {
            cmp: parent.cmp
          });
        }
      }

      $child = $child.nextElementSibling;
    }
  }

  walk(cfg.template);

  var _defined = function _defined($child) {
    return $child.remove();
  };

  for (var _i2 = 0; _i2 <= trash.length - 1; _i2++) {
    _defined(trash[_i2], _i2, trash);
  }

  return componentInstance;
}

module.exports = createInstance;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var regexN = /\n/g;
var regexS = /\s+/g;
var replace = ' ';
var decoder;
var html = {
  /**
   * Create DOM element
   * @param str html string
   * @param wrapper tag string
   * @returns {Element | Node | null}
   */
  create: function create(str, wrapper) {
    var element;
    str = str.replace(regexN, replace);
    str = str.replace(regexS, replace);
    var template = document.createElement('div');
    template.innerHTML = str;

    if (wrapper && template.childNodes.length > 1) {
      element = document.createElement(wrapper);
      element.innerHTML = template.innerHTML;
    } else {
      element = template.firstChild || document.createTextNode('');
    }

    return element;
  },
  decode: function decode(str) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = str;
    return decoder.textContent;
  }
};
module.exports = html;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * 	Originally was Observable Slim
 *	Version 0.0.4
 * 	https://github.com/elliotnb/observable-slim
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	Observable Slim is a singleton that allows you to observe changes made to an object and any nested
 *	children of that object. It is intended to assist with one-way data binding, that is, in MVC parlance,
 *	reflecting changes in the model to the app. Observable Slim aspires to be as lightweight and easily
 *	understood as possible. Minifies down to roughly 3000 characters.
 */
var delay = __webpack_require__(3);

var stringDecoder = __webpack_require__(33);
/**
 * ObservableSlim
 * @type {{create, observe, remove, beforeChange, beginRender, endRender}}
 */


var ObservableSlim = function () {
  // An array that stores all of the observables created through the public create() method below.
  var observables = []; // An array of all the objects that we have assigned Proxies to

  var targets = []; // An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
  // 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object

  var targetsProxy = []; // this variable tracks duplicate proxies assigned to the same target.
  // the 'set' handler below will trigger the same change on all other Proxies tracking the same target.
  // however, in order to avoid an infinite loop of Proxies triggering and re-triggering one another, we use dupProxy
  // to track that a given Proxy was modified from the 'set' handler

  var dupProxy = null;

  var _getProperty = function _getProperty(obj, path) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : undefined;
    }, obj || self);
  };
  /**
   * _create
   * @description Private internal function that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
   * @param target {Object} required, plain JavaScript object that we want to observe for changes.
   * @param domDelay {Boolean|Null} batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
   * @param originalObservable {Object} the original observable created by the user, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
   * @param originalPath {String} the path of the property in relation to the target on the original observable, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
   * @returns {Object}
   * @private
   */


  var _create = function _create(target, domDelay, originalObservable, originalPath) {
    var autoDomDelay = domDelay == null;
    var observable = originalObservable || null;
    var path = originalPath || '';
    var changes = [];

    var _getPath = function _getPath(target, property) {
      if (target instanceof Array) {
        return path !== '' ? path : property;
      } else {
        return path !== '' ? path + '.' + property : property;
      }
    };

    var calls = 0;

    var _notifyObservers = function _notifyObservers(numChanges) {
      if (observable.paused === true) return; // reset calls number after 10ms

      if (autoDomDelay) {
        domDelay = ++calls > 1;
        delay(function () {
          calls = 0;
        });
      } //domDelay = false;
      // execute observer functions on a 10ms setTimeout, this prevents the observer functions from being executed
      // separately on every change -- this is necessary because the observer functions will often trigger UI updates


      if (domDelay === true
      /*&& !observable.disableDOMDelay*/
      ) {
          delay(function () {
            if (numChanges === changes.length) {
              // invoke any functions that are observing changes
              for (var i = 0; i < observable.observers.length; i++) {
                observable.observers[i](changes);
              }

              changes = [];
            }
          });
        } else {
        // invoke any functions that are observing changes
        //console.log(numChanges, changes.length, observable.observers.length)
        //console.log(changes)
        for (var i = 0; i < observable.observers.length; i++) {
          observable.observers[i](changes);
        }

        changes = [];
      }
    };

    var handler = {
      get: function get(target, property) {
        // implement a simple check for whether or not the object is a proxy, this helps the .create() method avoid
        // creating Proxies of Proxies.
        if (property === '__getTarget') {
          return target;
        } else if (property === '__isProxy') {
          return true; // from the perspective of a given observable on a parent object, return the parent object of the given nested object
        } else if (property === '__getParent') {
          return function (i) {
            if (typeof i === 'undefined') i = 1;

            var parentPath = _getPath(target, '__getParent').split('.');

            parentPath.splice(-(i + 1), i + 1);
            return _getProperty(observable.parentProxy, parentPath.join('.'));
          };
        } // return the full path of the current object relative to the parent observable
        else if (property === '__getPath') {
            // strip off the 12 characters for ".__getParent"
            var parentPath = _getPath(target, '__getParent');

            return parentPath.slice(0, -12);
          } // for performance improvements, we assign this to a variable so we do not have to lookup the property value again


        var targetProp = target[property]; //console.log('èèèèèèèèèèèèèèèèèèèè', targetProp instanceof Date)

        if (target instanceof Date && targetProp instanceof Function) {
          return targetProp.bind(target);
        } // if we are traversing into a new object, then we want to record path to that object and return a new observable.
        // recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
        // the target object and any objects nested within.


        if (targetProp instanceof Object && target.hasOwnProperty(property)) {
          // if we've found a proxy nested on the object, then we want to retrieve the original object behind that proxy
          if (targetProp.__isProxy === true) targetProp = targetProp.__getTarget; // if we've previously setup a proxy on this target, then...
          //let a = observable.targets.indexOf(targetProp);
          //console.log('',a);

          var a = -1;
          var observableTargets = observable.targets;

          for (var i = 0, l = observableTargets.length; i < l; i++) {
            if (targetProp === observableTargets[i]) {
              //console.log('aaaaa', i)
              a = i;
              break;
            }
          } //console.log('get')


          if (a > -1) return observable.proxies[a]; //console.log('oooo')
          // if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
          // have to create a new proxy for it

          var newPath = path !== '' ? path + '.' + property : property;
          return _create(targetProp, domDelay, observable, newPath);
        } else {
          var value = observable.renderMode ? stringDecoder.encode(targetProp) : targetProp;
          var manipulate = observable.manipulate;

          if (typeof manipulate === 'function') {
            value = manipulate(value, property, true);
          }

          return value;
        }
      },
      deleteProperty: function deleteProperty(target, property) {
        // was this change an original change or was it a change that was re-triggered below
        var originalChange = true;

        if (dupProxy === proxy) {
          originalChange = false;
          dupProxy = null;
        } // in order to report what the previous value was, we must make a copy of it before it is deleted


        var previousValue = Object.assign({}, target); // get the path of the property being deleted

        var currentPath = _getPath(target, property);

        if (!observable.paused) {
          // record the deletion that just took place
          changes.push({
            type: 'delete',
            target: target,
            property: property,
            newValue: null,
            previousValue: previousValue[property],
            currentPath: currentPath,
            proxy: proxy
          }); //console.log('delete', changes)

          if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
            observable.checkBeforeChange = currentPath;
            var res = observable.beforeChange(changes);

            if (res === false) {
              observable.checkBeforeChange = '';
              return false;
            }
          }

          observable.checkBeforeChange = '';
        }

        if (originalChange === true) {
          var a, l;

          for (a = 0, l = targets.length; a < l; a++) {
            if (target === targets[a]) break;
          } // loop over each proxy and see if the target for this change has any other proxies


          var currentTargetProxy = targetsProxy[a] || [];
          var b = currentTargetProxy.length;

          while (b--) {
            // if the same target has a different proxy
            if (currentTargetProxy[b].proxy !== proxy) {
              // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
              // prevent a change on dupProxy from re-triggering the same change on other proxies)
              dupProxy = currentTargetProxy[b].proxy; // make the same delete on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
              // on any other proxies so that the previousValue can show up correct for the other proxies

              delete currentTargetProxy[b].proxy[property];
            }
          } // perform the delete that we've trapped


          delete target[property];
        }

        _notifyObservers(changes.length);

        return true;
      },
      set: function set(target, property, value, receiver) {
        // was this change an original change or was it a change that was re-triggered below
        var originalChange = true;

        if (dupProxy === proxy) {
          originalChange = false;
          dupProxy = null;
        } // improve performance by saving direct references to the property


        var targetProp = target[property]; // only record a change if the new value differs from the old one OR if this proxy was not the original proxy to receive the change

        if (targetProp !== value || originalChange === false) {
          //console.dir(target)
          var typeOfTargetProp = _typeof(targetProp); // get the path of the object property being modified


          var currentPath = _getPath(target, property); // determine if we're adding something new or modifying some that already existed


          var type = 'update';
          if (typeOfTargetProp === 'undefined') type = 'add';
          var manipulate = observable.manipulate;

          if (typeof manipulate === 'function') {
            value = manipulate(value, currentPath, false);
          } // store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct


          if (!observable.paused) {
            changes.push({
              type: type,
              target: target,
              property: property,
              newValue: value,
              previousValue: receiver[property],
              currentPath: currentPath,
              proxy: proxy
            });

            if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
              observable.checkBeforeChange = currentPath;
              var res = observable.beforeChange(changes);

              if (res === false) {
                observable.checkBeforeChange = '';
                return false;
              }
            }

            observable.checkBeforeChange = '';
          } // !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
          // if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
          // observers can be modified of the change that has occurred.


          if (originalChange === true) {
            var a, l;

            for (a = 0, l = targets.length; a < l; a++) {
              if (target === targets[a]) break;
            } // loop over each proxy and see if the target for this change has any other proxies


            var currentTargetProxy = targetsProxy[a];
            if (currentTargetProxy) for (var b = 0, _l = currentTargetProxy.length; b < _l; b++) {
              // if the same target has a different proxy
              if (currentTargetProxy[b].proxy !== proxy) {
                // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                // prevent a change on dupProxy from re-triggering the same change on other proxies)
                dupProxy = currentTargetProxy[b].proxy; // invoke the same change on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                // on any other proxies so that the previousValue can show up correct for the other proxies

                currentTargetProxy[b].proxy[property] = value;
              }
            } // if the property being overwritten is an object, then that means this observable
            // will need to stop monitoring this object and any nested objects underneath the overwritten object else they'll become
            // orphaned and grow memory usage. we excute this on a setTimeout so that the clean-up process does not block
            // the UI rendering -- there's no need to execute the clean up immediately

            /*
            setTimeout(function () {
                  if (typeOfTargetProp === 'object' && targetProp !== null) {
                      // check if the to-be-overwritten target property still exists on the target object
                    // if it does still exist on the object, then we don't want to stop observing it. this resolves
                    // an issue where array .sort() triggers objects to be overwritten, but instead of being overwritten
                    // and discarded, they are shuffled to a new position in the array
                    let keys = Object.keys(target);
                    for (let i = 0, l = keys.length; i < l; i++) {
                        if (target[keys[i]] === targetProp) {
                            //console.log('target still exists');
                            return;
                        }
                    }
                        let stillExists = false;
                      // now we perform the more expensive search recursively through the target object.
                    // if we find the targetProp (that was just overwritten) still exists somewhere else
                    // further down in the object, then we still need to observe the targetProp on this observable.
                    (function iterate(target) {
                        const keys = Object.keys(target);
                        let i = 0, l = keys.length;
                        for (; i < l; i++) {
                              const property = keys[i];
                            const nestedTarget = target[property];
                              if (nestedTarget instanceof Object) iterate(nestedTarget);
                            if (nestedTarget === targetProp) {
                                stillExists = true;
                                return;
                            }
                        }
                    })(target);
                      // even though targetProp was overwritten, if it still exists somewhere else on the object,
                    // then we don't want to remove the observable for that object (targetProp)
                    if (stillExists === true) return;
                      // loop over each property and recursively invoke the `iterate` function for any
                    // objects nested on targetProp
                    (function iterate(obj) {
                          let keys = Object.keys(obj);
                        for (let i = 0, l = keys.length; i < l; i++) {
                            let objProp = obj[keys[i]];
                            if (objProp instanceof Object) iterate(objProp);
                        }
                          // if there are any existing target objects (objects that we're already observing)...
                        //let c = targets.indexOf(obj);
                        let c = -1;
                        for (let i = 0, l = targets.length; i < l; i++) {
                            if (obj === targets[i]) {
                                c = i;
                                break;
                            }
                        }
                        if (c > -1) {
                              // ...then we want to determine if the observables for that object match our current observable
                            let currentTargetProxy = targetsProxy[c];
                            let d = currentTargetProxy.length;
                              while (d--) {
                                // if we do have an observable monitoring the object thats about to be overwritten
                                // then we can remove that observable from the target object
                                if (observable === currentTargetProxy[d].observable) {
                                    currentTargetProxy.splice(d, 1);
                                    break;
                                }
                            }
                              // if there are no more observables assigned to the target object, then we can remove
                            // the target object altogether. this is necessary to prevent growing memory consumption particularly with large data sets
                            if (currentTargetProxy.length === 0) {
                                targets[c] = null;
                                //targetsProxy.splice(c, 1);
                                //targets.splice(c, 1);
                            }
                        }
                      })(targetProp)
                }
            }, 10000);
            */
            // because the value actually differs than the previous value
            // we need to store the new value on the original target object

            target[property] = value; // TO DO: the next block of code resolves test case #24, but it results in poor IE11 performance. Find a solution.
            // if the value we've just set is an object, then we'll need to iterate over it in order to initialize the
            // observers/proxies on all nested children of the object

            if (value instanceof Object && value !== null) {
              (function iterate(proxy) {
                var target = proxy.__getTarget;
                var keys = Object.keys(target);

                for (var i = 0, _l2 = keys.length; i < _l2; i++) {
                  var _property = keys[i];
                  if (target[_property] instanceof Object && target[_property] !== null) iterate(proxy[_property]);
                }
              })(proxy[property]);
            }
          } // notify the observer functions that the target has been modified


          _notifyObservers(changes.length);
        }

        return true;
      }
    }; // create the proxy that we'll use to observe any changes

    var proxy = new Proxy(target, handler); // we don't want to create a new observable if this function was invoked recursively

    if (observable === null) {
      observable = {
        parentTarget: target,
        domDelay: domDelay,
        parentProxy: proxy,
        observers: [],
        targets: [target],
        proxies: [proxy],
        path: path
      };
      observables.push(observable);
    } else {
      observable.targets.push(target);
      observable.proxies.push(proxy);
    } // store the proxy we've created so it isn't re-created unnecessary via get handler


    var proxyItem = {
      target: target,
      proxy: proxy,
      observable: observable
    }; //let targetPosition = targets.indexOf(target);

    var targetPosition = -1;

    for (var i = 0, l = targets.length; i < l; i++) {
      if (target === targets[i]) {
        targetPosition = i;
        break;
      }
    } // if we have already created a Proxy for this target object then we add it to the corresponding array
    // on targetsProxy (targets and targetsProxy work together as a Hash table indexed by the actual target object).


    if (targetPosition > -1) {
      targetsProxy[targetPosition].push(proxyItem); // else this is a target object that we have not yet created a Proxy for, so we must add it to targets,
      // and push a new array on to targetsProxy containing the new Proxy
    } else {
      targets.push(target);
      targetsProxy.push([proxyItem]);
    }

    return proxy;
  };

  return {
    /**
     * Create
     * @description Public method that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
     * @param target {Object} required, plain JavaScript object that we want to observe for changes.
     * @param domDelay {Boolean} if true, then batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
     * @param observer {Function} optional, will be invoked when a change is made to the proxy.
     * @param iterateBeforeCreate
     * @returns {Object}
     */
    create: function create(target, domDelay, observer, iterateBeforeCreate) {
      // test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
      // we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
      if (target.__isProxy === true) {
        target = target.__getTarget; //if it is, then we should throw an error. we do not allow creating proxies of proxies
        // because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
        //throw new Error('ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.');
      } // fire off the _create() method -- it will create a new observable and proxy and return the proxy


      var proxy = _create(target, domDelay); // assign the observer function


      if (typeof observer === 'function') this.observe(proxy, observer); // recursively loop over all nested objects on the proxy we've just created
      // this will allow the top observable to observe any changes that occur on a nested object

      (function iterate(proxy) {
        var target = proxy.__getTarget;
        var keys = Object.keys(target);

        for (var i = 0, l = keys.length; i < l; i++) {
          var property = keys[i];

          if (typeof iterateBeforeCreate === 'function') {
            iterateBeforeCreate(target, property);
          }

          if (target[property] instanceof Object && target[property] !== null) iterate(proxy[property]);
        }
      })(proxy);

      return proxy;
    },

    /**
     * observe
     * @description This method is used to add a new observer function to an existing proxy.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method. We want to observe changes made to this object.
     * @param observer {Function} this function will be invoked when a change is made to the observable (not to be confused with the observer defined in the create() method).
     */
    observe: function observe(proxy, observer) {
      // loop over all the observables created by the _create() function
      var i = observables.length;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].observers.push(observer);
          break;
        }
      }
    },

    /**
     * Remove
     * @description this method will remove the observable and proxy thereby preventing any further callback observers for changes occuring to the target object.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method
     */
    remove: function remove(proxy) {
      var matchedObservable = null;
      var foundMatch = false;
      var c = observables.length;

      while (c--) {
        if (observables[c].parentProxy === proxy) {
          matchedObservable = observables[c];
          foundMatch = true;
          break;
        }
      }

      var a = targetsProxy.length;

      while (a--) {
        var b = targetsProxy[a].length;

        while (b--) {
          if (targetsProxy[a][b].observable === matchedObservable) {
            targetsProxy[a].splice(b, 1);

            if (targetsProxy[a].length === 0) {
              // if there are no more proxies for this target object
              // then we null out the position for this object on the targets array
              // since we are essentially no longer observing this object.
              // we do not splice it off the targets array, because if we re-observe the same
              // object at a later time, the property __targetPosition cannot be redefined.
              targets[a] = null;
              /*targetsProxy.splice(a, 1);
              targets.splice(a, 1);*/
            }
          }
        }
      }

      if (foundMatch === true) {
        observables.splice(c, 1);
      }
    },

    /**
     * manipulate
     * @description This method allows manipulation data.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
     */
    manipulate: function manipulate(proxy, callback) {
      if (typeof callback !== 'function') throw new Error('callback is required');
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].manipulate = callback;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error('proxy not found.');
    },

    /**
     * beforeChange
     * @description This method accepts a function will be invoked before changes.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
     */
    beforeChange: function beforeChange(proxy, callback) {
      if (typeof callback !== 'function') throw new Error('callback is required');
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].beforeChange = callback;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error('proxy not found.');
    },

    /**
     * beginRender
     * @description This method set renderMode to true so the param in get is sanitized.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     */
    beginRender: function beginRender(proxy) {
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].renderMode = true;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error('proxy not found.');
    },

    /**
     * endRender
     * @description This method set renderMode to false.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     */
    endRender: function endRender(proxy) {
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].renderMode = false;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error('proxy not found.');
    },

    /**
     * disableDOMDelayBegin
     * @description This method set disableDOMDelay to true.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     */

    /*disableDOMDelayBegin: function (proxy) {
        let i = observables.length;
        let foundMatch = false;
        while (i--) {
            if (observables[i].parentProxy === proxy) {
                observables[i].disableDOMDelay = true;
                foundMatch = true;
                break;
            }
        }
        if (foundMatch === false) throw new Error('proxy not found.');
    },*/

    /**
     * disableDOMDelayEnd
     * @description This method set disableDOMDelay to false.
     * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
     */

    /*disableDOMDelayEnd: function (proxy) {
        let i = observables.length;
        let foundMatch = false;
        while (i--) {
            if (observables[i].parentProxy === proxy) {
                observables[i].disableDOMDelay = false;
                foundMatch = true;
                break;
            }
        }
        if (foundMatch === false) throw new Error('proxy not found.');
    },*/
    pause: function pause(proxy) {
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].paused = true;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error("proxy not found.");
    },
    resume: function resume(proxy) {
      var i = observables.length;
      var foundMatch = false;

      while (i--) {
        if (observables[i].parentProxy === proxy) {
          observables[i].paused = false;
          foundMatch = true;
          break;
        }
      }

      if (foundMatch === false) throw new Error("proxy not found.");
    }
  };
}();

module.exports = ObservableSlim;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var castType = __webpack_require__(35);

function manipulate(instance, value, currentPath, onFly, init) {
  if (_typeof(instance.propsType) === 'object') {
    var type = instance.propsType[currentPath];

    if (type !== undefined) {
      value = castType(value, type);
    }
  }

  if (init) {
    onFly = instance.propsConvertOnFly;
  }

  if (instance.propsConvert && instance.propsConvertOnFly === onFly) {
    if (_typeof(instance.propsConvert) === 'object') {
      var propPath = instance.propsConvert[currentPath];
      var func = instance[propPath] || propPath;

      if (typeof func === 'function') {
        return func.call(instance, value);
      }
    }
  }

  if (init) {
    onFly = instance.propsComputedOnFly;
  }

  if (instance.propsComputed && instance.propsComputedOnFly === onFly) {
    if (_typeof(instance.propsComputed) === 'object') {
      var cached = instance._computedCache.get(currentPath);

      if (cached === undefined) {
        cached = new Map();

        instance._computedCache.set(currentPath, cached);
      } else {
        var cachedValue = cached.get(value);

        if (cachedValue !== undefined) {
          return cachedValue;
        }
      }

      var _propPath = instance.propsComputed[currentPath];

      var _func = instance[_propPath] || _propPath;

      if (typeof _func === 'function') {
        var result = _func.call(instance, value);

        cached.set(value, result);
        return result;
      }
    }
  }

  return value;
}

module.exports = manipulate;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(37),
    attach = _require.attach,
    updateAttributes = _require.updateAttributes;

var _require2 = __webpack_require__(1),
    TAG = _require2.TAG,
    NS = _require2.NS,
    COMPONENT_INSTANCE = _require2.COMPONENT_INSTANCE,
    COMPONENT_ROOT_INSTANCE = _require2.COMPONENT_ROOT_INSTANCE,
    DEFAULT_SLOT_KEY = _require2.DEFAULT_SLOT_KEY;

var canDecode = __webpack_require__(18);

var hooks = __webpack_require__(6); //const directive = require('../directives');


var makeSureAttach = __webpack_require__(4);

var _require3 = __webpack_require__(41),
    scopedInner = _require3.scopedInner;

var _require4 = __webpack_require__(10),
    kCache = _require4.kCache;

var storeElementNode = Object.create(null);
var deadChildren = [];

function isChanged(nodeA, nodeB) {
  return _typeof(nodeA) !== _typeof(nodeB) || typeof nodeA === 'string' && nodeA !== nodeB || nodeA.type !== nodeB.type || nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial, cmpParent) {
  //console.log(node)
  if (typeof node === 'undefined' || Array.isArray(node) && node.length === 0) return;
  var nodeStored;
  var $el; //let originalTagName;

  if (_typeof(node) !== 'object') {
    return document.createTextNode( // use decode only if necessary
    canDecode(node));
  }

  if (!node || node.type == null || node.type[0] === '#') {
    node = {
      type: TAG.EMPTY,
      props: {},
      children: []
    };
  }

  if (node.props && node.props.slot && !node.isNewSlotEl) {
    return document.createComment("slot(".concat(node.props.slot, ")"));
  } //console.log(node.type, node.props, cmp.tag)


  nodeStored = storeElementNode[node.type];

  if (nodeStored) {
    $el = nodeStored.cloneNode();
  } else {
    //originalTagName = node.props['data-attributeoriginaletagname'];
    $el = node.isSVG ? document.createElementNS(NS.SVG, node.type) : document.createElement(node.type);
    storeElementNode[node.type] = $el.cloneNode(true);
  } //console.log(node);


  attach($el, node.props, cmp, cmpParent, node.isSVG); // The children with keys will be created later

  if (!node.hasKeys) {
    if (!node.children.length) {} else if (node.children.length === 1 && typeof node.children[0] === 'string') {
      //console.log('node.children[0]', node.children[0])
      $el.textContent = canDecode(node.children[0]);
    } else {
      for (var i = 0; i < node.children.length; i++) {
        //console.log(node.children[i])
        var $childEl = create(node.children[i], cmp, initial, cmpParent);
        if ($childEl) $el.appendChild($childEl);
      }
    }
  }

  makeSureAttach($el);
  $el._dozAttach.elementChildren = node.children;
  $el._dozAttach.originalTagName = node.props['data-attributeoriginaletagname'];
  cmp.$$afterNodeElementCreate($el, node, initial); // Create eventually style

  if (node.style) {
    setHeadStyle(node, cmp);
  }

  return $el;
}

function setHeadStyle(node, cmp) {
  cmp.__hasStyle = true;
  var isScoped = node.styleScoped;
  var dataSetUId = cmp.uId;
  var tagByData = "[data-uid=\"".concat(dataSetUId, "\"]");
  scopedInner(node.style, dataSetUId, tagByData, isScoped, cmp);
} //let xy = 0;


function update($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var cmp = arguments.length > 4 ? arguments[4] : undefined;
  var initial = arguments.length > 5 ? arguments[5] : undefined;
  var cmpParent = arguments.length > 6 ? arguments[6] : undefined;
  //directive.callComponentVNodeTick(cmp, newNode, oldNode);
  //console.log('a')
  //console.log(newNode)

  /*if (newNode === oldNode && $parent._dozAttach && $parent._dozAttach.componentRootInstance) {
      //console.log('uguali', newNode.type, $parent._dozAttach.componentRootInstance)
      console.log('uguali', newNode.type, cmpParent)
  }*/
  // For the moment I exclude the check on the comparison between newNode and oldNode
  // only if the component is DZ-MOUNT because the slots do not work
  if (!$parent || newNode === oldNode && cmp.tag !== TAG.MOUNT) return;
  if (newNode && newNode.cmp) cmp = newNode.cmp; // Update style

  if (newNode && oldNode && newNode.style !== oldNode.style) {
    setHeadStyle(newNode, cmp);
  } //console.log(JSON.stringify(newNode, null, 4))


  if (cmpParent && $parent._dozAttach[COMPONENT_INSTANCE]) {
    var result = hooks.callDrawByParent($parent._dozAttach[COMPONENT_INSTANCE], newNode, oldNode);

    if (result !== undefined && result !== null && _typeof(result) === 'object') {
      newNode = result.newNode || newNode;
      oldNode = result.oldNode || oldNode;
    } // Slot logic


    var propsSlot = newNode && newNode.props ? newNode.props.slot : false;

    if ($parent._dozAttach[COMPONENT_INSTANCE]._defaultSlot && !propsSlot) {
      propsSlot = DEFAULT_SLOT_KEY;
    }

    if (_typeof(newNode) === 'object' && propsSlot && $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot]) {
      var _defined = function _defined($slot) {
        // Slot is on DOM
        if ($slot.parentNode) {
          newNode.isNewSlotEl = true;
          var $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
          $newElement.removeAttribute('slot'); // I must replace $slot element with $newElement

          $slot.parentNode.replaceChild($newElement, $slot); // Assign at $slot a property that referred to $newElement

          $slot.__newSlotEl = $newElement;
        } else {
          // Now I must update $slot.__newSlotEl using update function
          // I need to known the index of newSlotEl in child nodes list of his parent
          var indexNewSlotEl = Array.from($slot.__newSlotEl.parentNode.children).indexOf($slot.__newSlotEl);
          update($slot.__newSlotEl.parentNode, newNode, oldNode, indexNewSlotEl, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        }
      };

      var _defined2 = $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot];

      //console.log(newNode === oldNode)
      //console.log(JSON.stringify(newNode, null, 4))
      for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
      }

      return;
    }
  }

  if (!oldNode) {
    //if (oldNode === undefined || oldNode == null) {
    //console.log('create node', newNode.type);
    // create node
    var $newElement;

    if ($parent.childNodes.length) {
      // If last node is a root, insert before
      var $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
      makeSureAttach($lastNode);

      if ($lastNode._dozAttach[COMPONENT_ROOT_INSTANCE]) {
        $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        $parent.insertBefore($newElement, $lastNode);
        return $newElement;
      }
    }

    makeSureAttach($parent);
    $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent); //console.log('append to', $parent, cmp.uid);

    $parent.appendChild($newElement);
    return $newElement;
  } else if (!newNode) {
    //} else if (newNode === undefined || newNode == null) {
    //console.log('remove node', $parent);
    // remove node
    if ($parent.childNodes[index]) {
      deadChildren.push($parent.childNodes[index]);
    }
  } else if (isChanged(newNode, oldNode)) {
    //console.log('newNode changes', newNode);
    //console.log('oldNode changes', oldNode);
    // node changes
    var $oldElement = $parent.childNodes[index];
    if (!$oldElement) return;
    var canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
    if (canReuseElement) return canReuseElement;

    var _$newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent); //console.log(newNode.type, oldNode.type)


    $parent.replaceChild(_$newElement, $oldElement);
    cmp.$$afterNodeChange(_$newElement, $oldElement);
    return _$newElement;
  } else if (newNode.hasKeys !== undefined || oldNode.hasKeys !== undefined) {
    //console.log('key')
    // Children could be keys.
    // Every time there are update operation of the list should be enter here.
    // These operations are done only for the first level of nodes for example
    // <ul>
    //      <li>other1</li>
    //      <li>other2</li>
    //      <li>other3</li>
    // </ul>
    // Only the "LI" tags will be processed with this algorithm.
    // The content of the "LI" tag will be processed by the normal "update" function
    var $myListParent = $parent.childNodes[index]; // console.log(newNode.type, $myListParent);

    var _defined3 = newNode.children;

    var _defined4 = function _defined4(i) {
      return i.key;
    };

    var newNodeKeyList = new Array(_defined3.length);

    for (var _i12 = 0; _i12 <= _defined3.length - 1; _i12++) {
      newNodeKeyList[_i12] = _defined4(_defined3[_i12], _i12, _defined3);
    }

    var _defined5 = oldNode.children;

    var _defined6 = function _defined6(i) {
      return i.key;
    };

    var oldNodeKeyList = new Array(_defined5.length); // here my new logic for keys
    // Check if $myListParent has _dozAttach.keyList

    for (var _i13 = 0; _i13 <= _defined5.length - 1; _i13++) {
      oldNodeKeyList[_i13] = _defined6(_defined5[_i13], _i13, _defined5);
    }

    if ($myListParent._dozAttach.keyList === undefined) {
      $myListParent._dozAttach.keyList = new Map();
    }

    var _defined7 = function _defined7(x) {
      return !newNodeKeyList.includes(x);
    };

    var oldKeyDoRemove = []; //console.log('diff', oldKeyDoRemove)
    // Ci sono key da rimuovere?

    for (var _i14 = 0; _i14 <= oldNodeKeyList.length - 1; _i14++) {
      if (_defined7(oldNodeKeyList[_i14], _i14, oldNodeKeyList)) oldKeyDoRemove.push(oldNodeKeyList[_i14]);
    }

    for (var _i6 = 0; _i6 < oldKeyDoRemove.length; _i6++) {
      if ($myListParent._dozAttach.keyList.has(oldKeyDoRemove[_i6])) {
        var _$oldElement = $myListParent._dozAttach.keyList.get(oldKeyDoRemove[_i6]); ////console.log('da rimuovere', $oldElement);


        if (_$oldElement._dozAttach[COMPONENT_INSTANCE]) {
          _$oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
        } else {
          $myListParent.removeChild(_$oldElement);
        }

        $myListParent._dozAttach.keyList["delete"](oldKeyDoRemove[_i6]); //delete kCache[oldKeyDoRemove[i]];


        kCache["delete"](oldKeyDoRemove[_i6]); //console.log('cancellato in posizione', oldKeyDoRemove[i], i)
      }
    } //console.log(oldKeyDoRemove)
    //console.log(newNodeKeyList)


    if (oldKeyDoRemove.length) {
      var _arr = oldNodeKeyList;
      oldNodeKeyList = [];

      var _defined8 = function _defined8(x) {
        return !~oldKeyDoRemove.indexOf(x);
      };

      // Remove from old the removed keys so preventing diff position
      for (var _i8 = 0; _i8 <= _arr.length - 1; _i8++) {
        if (_defined8(_arr[_i8], _i8, _arr)) oldNodeKeyList.push(_arr[_i8]);
      }
    }

    var listOfElement = [];
    var diffIndex = [];
    var diffIndexMap = Object.create(null);

    for (var _i9 = 0; _i9 < newNodeKeyList.length; _i9++) {
      if (newNodeKeyList[_i9] !== oldNodeKeyList[_i9]) {
        //console.log('indice diverso ', i)
        diffIndex.push(_i9);
        diffIndexMap[_i9] = true;
      } // This is the key of all


      var theKey = newNodeKeyList[_i9]; // console.log('esiste nella mappa?', newNode.children[i].props.key,$myListParent._dozAttach.keyList.has(newNode.children[i].props.key))

      var _$element = $myListParent._dozAttach.keyList.get(theKey); // Se non esiste creo il nodo


      if (!_$element) {
        var _$newElement2 = create(newNode.children[_i9], cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);

        $myListParent._dozAttach.keyList.set(theKey, _$newElement2); // console.log('elemento creato', $newElement);
        // appendo per il momento


        listOfElement.push(_$newElement2); //$myListParent.appendChild($newElement);
      } else {
        // Get the child from newNode and oldNode by the same key

        /*let newChildByKey = getChildByKey(theKey, newNode.children);
        let oldChildByKey = getChildByKey(theKey, oldNode.children);*/
        //if (!kCache[theKey].isChanged) continue;

        /*let newChildByKey = kCache[theKey].next;// getChildByKey(theKey, newNode.children);
        let oldChildByKey = kCache[theKey].prev;// getChildByKey(theKey, oldNode.children);*/
        var _kCacheValue = kCache.get(theKey);

        var newChildByKey = _kCacheValue.next; // getChildByKey(theKey, newNode.children);

        var oldChildByKey = _kCacheValue.prev; // getChildByKey(theKey, oldNode.children);
        //console.log(theKey, kCache[theKey].isChanged)

        if (!newChildByKey.children) newChildByKey.children = [];
        if (!oldChildByKey.children) oldChildByKey.children = [];
        listOfElement.push(_$element); //if (kCache[theKey].isChanged) {

        if (_kCacheValue.isChanged) {
          // Update attributes?
          // Remember that the operation must be on the key and not on the index
          updateAttributes(_$element, newChildByKey.props, oldChildByKey.props, cmp, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent, newChildByKey.isSVG); // Here also update function using the key
          // update(...
        }

        var newChildByKeyLength = newChildByKey.children.length;
        var oldChildByKeyLength = oldChildByKey.children.length; //console.log(diffIndex)

        for (var _i10 = 0; _i10 < newChildByKeyLength || _i10 < oldChildByKeyLength; _i10++) {
          if (newChildByKey.children[_i10] === undefined || oldChildByKey.children[_i10] === undefined) continue; //console.log(newChildByKey.children[i])
          //console.log(oldChildByKey.children[i])

          update(_$element, newChildByKey.children[_i10], oldChildByKey.children[_i10], _i10, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        }
      }
    } //console.log(diffIndex);
    // No differences so exit or items are removed


    if (diffIndex[0] === undefined
    /*|| oldKeyDoRemove.length*/
    ) return; // If first item index is equal to childNodes length then just append..

    if ($myListParent.childNodes.length === diffIndex[0]) {
      for (var _i11 = 0; _i11 < listOfElement.length; _i11++) {
        $myListParent.appendChild(listOfElement[_i11]);
      }

      return;
    } //return ;


    var useIndexI = true;
    var $currentElementAtPosition;
    var $element;
    var i = 0;
    var j = listOfElement.length - 1; // Try to reorder the list...

    while (i <= j) {
      //console.log(i)
      if (useIndexI) {
        $currentElementAtPosition = $myListParent.childNodes[i];
        $element = listOfElement[i];

        if (diffIndexMap[i]) {
          //if (diffIndex.indexOf(i) > -1) {
          if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== i) {
            //console.log('MOVE I, ', i)
            $myListParent.insertBefore($element, $currentElementAtPosition);
            useIndexI = false;
          }
        }

        i++;
      } else {
        $currentElementAtPosition = $myListParent.childNodes[j];
        $element = listOfElement[j];

        if (diffIndexMap[j]) {
          //if (diffIndex.indexOf(j) > -1) {
          if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== j) {
            //console.log('MOVE J, ', j)
            if ($currentElementAtPosition) $myListParent.insertBefore($element, $currentElementAtPosition.nextSibling);else {
              $myListParent.appendChild($element);
              j++;
            }
            useIndexI = true;
          }
        }

        j--;
      }
    } //console.log('$myListParent ', Array.from($myListParent.childNodes).map(item => item._dozAttach.key))
    //console.log('----------------');

  } else if (newNode.type) {
    //console.log('walk node', newNode.type)
    // walk node

    /*
    Adjust index so it's possible update props in nested component like:
      <parent-component>
        <child-component>
            ${this.props.foo}
        </child-component>
        <child-component>
            ${this.props.bar}
        </child-component>
    </parent-component>
    */
    if ($parent._dozAttach[COMPONENT_INSTANCE] === cmp && $parent.childNodes.length) {
      // subtract 1 (should be dz-root) to child nodes length
      // check if last child node is a root of the component
      var lastIndex = $parent.childNodes.length - 1;
      if ($parent.childNodes[lastIndex]._dozAttach[COMPONENT_ROOT_INSTANCE]) index += lastIndex;
    }

    var attributesUpdated = updateAttributes($parent.childNodes[index], newNode.props, oldNode.props, cmp, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent, newNode.isSVG);
    if (cmp.$$beforeNodeWalk($parent, index, attributesUpdated)) return;
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;

    for (var _i15 = 0; _i15 < newLength || _i15 < oldLength; _i15++) {
      update($parent.childNodes[index], newNode.children[_i15], oldNode.children[_i15], _i15, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
    }

    clearDead();
  }
}

function getChildByKey(key, children) {
  //console.log(key, children)
  var res = {};

  for (var i = 0; i < children.length; i++) {
    if (key === children[i].key) {
      res = children[i];
      break;
    }
  }

  return res;
}

function clearDead() {
  var dl = deadChildren.length;

  while (dl--) {
    deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
    deadChildren.splice(dl, 1);
  }
}

module.exports = {
  create: create,
  update: update
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var html = __webpack_require__(14);

function canDecode(str) {
  return /&\w+;/.test(str) ? html.decode(str) : str;
}

module.exports = canDecode;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

/*
// Add tag prefix to animation name inside keyframe
(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)

// Add tag prefix to animation
((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)
 */
//const mapper = require('../vdom/mapper');
function composeStyleInner(cssContent, tag) {
  if (typeof cssContent !== 'string') return; //cssContent = mapper.getAll(cssContent);

  var sanitizeTagForAnimation = tag.replace(/[^\w]/g, '');

  if (/:root/.test(cssContent)) {
    console.warn('[DEPRECATION] the :root pseudo selector is deprecated, use :component or :wrapper instead');
  }

  cssContent = cssContent.replace(/{/g, '{\n').replace(/}/g, '}\n').replace(/^(\s+)?:(component|wrapper|root)(\s+)?{/gm, tag + ' {').replace(/:(component|wrapper|root)/g, '').replace(/(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)/g, "$1 ".concat(sanitizeTagForAnimation, "-$2")).replace(/((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)/g, "$1 ".concat(sanitizeTagForAnimation, "-$2")) // Remove comments
  .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/[^\s].*{/gm, function (match) {
    if (/^(@|:host|(from|to|\d+%)[^-_])/.test(match)) return match;
    var part = match.split(',');
    var sameTag = new RegExp("^".concat(tag.replace(/[[\]]/g, '\\$&'), "(\\s+)?{"));

    for (var i = 0; i < part.length; i++) {
      part[i] = part[i].trim();
      if (sameTag.test(part[i])) continue;
      if (/^:global/.test(part[i])) part[i] = part[i].replace(':global', '');else part[i] = "".concat(tag, " ").concat(part[i]);
    }

    match = part.join(',');
    return match;
  });
  cssContent = cssContent.replace(/\s{2,}/g, ' ').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\s:/g, ':') //remove space before pseudo classes
  .replace(/\n/g, '').trim();
  return cssContent;
}

module.exports = composeStyleInner;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

function camelToDash(s) {
  return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

module.exports = camelToDash;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(1),
    TAG = _require.TAG;

var camelToDash = __webpack_require__(20);

var deepCopy = __webpack_require__(50);

var _require2 = __webpack_require__(7),
    compile = _require2.compile;

var tagText = TAG.TEXT_NODE_PLACE;

var _require3 = __webpack_require__(10),
    hCache = _require3.hCache,
    kCache = _require3.kCache;

var LESSER = '<';
var GREATER = '>';
var PLACEHOLDER_REGEX_GLOBAL = /e-0_(\d+)_0-e/g;
var PLACEHOLDER_REGEX = /e-0_(\d+)_0-e/;

function placeholderIndex(str, values) {
  //console.log(str)
  if (typeof str !== 'string') {
    return str;
  }

  if (str[0] === 'e' && str[1] === '-') {
    var match = PLACEHOLDER_REGEX.exec(str);

    if (match) {
      // if is a possible text node
      if (match[1][0] === '0' && match[1].length >= 2) {
        // remove first fake 0 that identify a text node and cast to string every
        return values[match[1].substr(1)] + '';
      } else {
        return values[match[1]];
      }
    } else return str;
  } else {
    return str.replace(PLACEHOLDER_REGEX_GLOBAL, function (match, p1) {
      if (p1) {
        return values[p1];
      } else {
        return match;
      }
    });
  }
}
/**
 * This method add special tag to value placeholder
 * @param strings
 * @param values
 * @returns {*}
 */


module.exports = function (strings) {
  var tpl = hCache.get(strings);

  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  if (!tpl) {
    tpl = strings[0];
    var allowTag = false;
    var isInStyle = false;
    var thereIsStyle = false;
    var valueLength = values.length;

    for (var i = 0; i < valueLength; ++i) {
      var stringsI = strings[i];
      var stringLength = stringsI.length;

      for (var x = 0; x < stringLength; x++) {
        if (stringsI[x] === LESSER) {
          allowTag = false;
        } else if (stringsI[x] === GREATER) {
          allowTag = true;
        }
      }

      if (stringsI.indexOf('<style') > -1) {
        isInStyle = true;
        thereIsStyle = true;
      }

      if (stringsI.indexOf('</style') > -1) {
        isInStyle = false;
      }

      if (isInStyle) {
        allowTag = false;
        tpl = tpl.replace(/ scoped>/, ' data-scoped>');
      }

      if (allowTag) {
        if (_typeof(values[i]) === 'object' || typeof values[i] === 'function') {
          tpl += "e-0_".concat(i, "_0-e").concat(strings[i + 1]);
        } else {
          // possible html as string
          if (/<.*>/.test(values[i])) {
            tpl += "".concat(values[i]).concat(strings[i + 1]);
          } else {
            // add a fake 0 before index useful to identify a text node so cast to string every
            tpl += "<".concat(tagText, ">e-0_0").concat(i, "_0-e</").concat(tagText, ">").concat(strings[i + 1]);
          }
        }
      } else {
        tpl += "e-0_".concat(i, "_0-e").concat(strings[i + 1]);
      }
    }

    tpl = tpl.trim();
    hCache.set(strings, tpl);
  }

  var cloned;
  var model = compile(tpl);
  var clonedKey;

  if (model.props.forceupdate) {
    hCache["delete"](strings);
  }

  if (model.key !== undefined || model.props['item-list'] !== undefined) {
    //clonedKey = values.filter(item => typeof item !== 'function' && typeof item !== 'object').join('');
    clonedKey = generateItemKey(values);
    cloned = clonedKey ? hCache.get(clonedKey) : undefined;
  }

  if (!cloned) {
    cloned = deepCopy(model);
    fillCompiled(cloned, values, null, this);

    if (clonedKey) {
      hCache.set(clonedKey, cloned);
    }
  }
  /*
  if (model.key !== undefined) {
      if (kCache[cloned.key] !== undefined) {
          kCache[cloned.key] = {
              isChanged: clonedKey !== kCache[cloned.key].clonedKey,
              clonedKey,
              next: cloned,
              prev: kCache[cloned.key].next
          }
      } else {
          kCache[cloned.key] = {
              isChanged: true,
              clonedKey,
              next: cloned,
              prev: undefined
          }
      }
  }
  */


  if (model.key !== undefined) {
    var _kCacheValue = kCache.get(cloned.key);

    if (_kCacheValue
    /*&& clonedKey !== _kCacheValue.clonedKey*/
    ) {
        kCache.set(cloned.key, {
          isChanged: clonedKey !== _kCacheValue.clonedKey,
          //isChanged: true,
          clonedKey: clonedKey,
          next: cloned,
          prev: _kCacheValue.next
        });
      } else {
      kCache.set(cloned.key, {
        isChanged: true,
        clonedKey: clonedKey,
        next: cloned,
        prev: {}
      });
    }
  }

  return cloned;
};

function generateItemKey(values) {
  var key = '';

  for (var i = 0; i < values.length; i++) {
    if (typeof values[i] !== 'function' && _typeof(values[i]) !== 'object') {
      key += values[i];
    }
  } //console.log(key);


  return key;
}

function fillCompiled(obj, values, parent, _this) {
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    //for (let k in obj) {
    if (obj[keys[i]] && _typeof(obj[keys[i]]) === 'object') {
      fillCompiled(obj[keys[i]], values, obj, _this);
    } else {
      //console.log(i, keys[i])
      var value = placeholderIndex(obj[keys[i]], values); //if (typeof value === 'function' && keys[i] === 'type') {

      if ('type' === keys[i] && 'string' !== typeof value) {
        var cmp = value;
        var tagName = camelToDash(cmp.tag || cmp.name || 'obj'); // Sanitize tag name

        tagName = tagName.replace(/_+/, ''); // if is a single word, rename with double word

        if (tagName.indexOf('-') === -1) {
          tagName = "".concat(tagName, "-").concat(tagName);
        }

        var tagCmp = tagName + '-' + _this.uId + '-' + _this._localComponentLastId++;

        if (_this._componentsMap.has(value)) {
          tagCmp = _this._componentsMap.get(value);
        } else {
          _this._componentsMap.set(value, tagCmp);
        } // add to local components


        if (_this._components[tagCmp] === undefined) {
          _this._components[tagCmp] = {
            tag: tagName,
            cfg: cmp
          };
        } // add to local app components


        if (_this.app._components[tagCmp] === undefined) {
          _this.app._components[tagCmp] = {
            tag: tagName,
            cfg: cmp
          };
        }

        value = tagName;
        obj.props['data-attributeoriginaletagname'] = tagCmp;
      }

      if (Array.isArray(value) && keys[i] === '0') {
        parent.children = value;
        if (value[0] && value[0].key !== undefined) parent.hasKeys = true;
      } else obj[keys[i]] = value;
    }
  }
}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function mixin(target) {
  var sources = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (_typeof(target) !== 'object' || target == null) {
    throw new TypeError('expected an object');
  }

  if (!Array.isArray(sources)) {
    sources = [sources];
  }

  for (var j = sources.length - 1; j >= 0; --j) {
    var keys = Object.keys(sources[j]);

    for (var i = keys.length - 1; i >= 0; --i) {
      var index = keys[i];

      if (typeof target[index] === 'undefined') {
        target[index] = sources[j][index];
      } else {
        console.warn('Doz', "mixin failed for already defined property: ".concat(index));
      }
    }
  }

  return target;
}

module.exports = mixin;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var manipulate = __webpack_require__(16);

function propsInit(instance) {
  (function iterate(props) {
    var keys = Object.keys(props);

    for (var i = 0, l = keys.length; i < l; i++) {
      var property = keys[i];

      if (props[property] instanceof Object && props[property] !== null) {
        iterate(props[property]);
      } else {
        props[property] = manipulate(instance, props[property], property, false, true);
      }
    }
  })(instance._rawProps);
}

module.exports = propsInit;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

function toLiteralString(str) {
  return str.replace(/{{/gm, '${').replace(/}}/gm, '}');
}

module.exports = toLiteralString;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(2),
    registerPlugin = _require.registerPlugin,
    data = _require.data;

function use(plugin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof plugin !== 'function') {
    throw new TypeError('Plugin must be a function');
  }

  plugin['options'] = options;
  registerPlugin(plugin);
}

function load(app) {
  var _defined = function _defined(func) {
    func(app.constructor, app, func.options);
  };

  var _defined2 = data.plugins;

  for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
    _defined(_defined2[_i2], _i2, _defined2);
  }
}

module.exports = {
  use: use,
  load: load
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(27);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Doz = __webpack_require__(12);

var collection = __webpack_require__(2);

var _require = __webpack_require__(25),
    use = _require.use;

var _require2 = __webpack_require__(0),
    directive = _require2.directive;

var component = __webpack_require__(57);

var Component = __webpack_require__(11);

var mixin = __webpack_require__(58);

var h = __webpack_require__(21);

var _require3 = __webpack_require__(7),
    compile = _require3.compile; //const mapper = require('./vdom/mapper');


var _require4 = __webpack_require__(17),
    update = _require4.update;

var tag = __webpack_require__(59);

var _require5 = __webpack_require__(60),
    createDozWebComponent = _require5.createDozWebComponent,
    defineWebComponent = _require5.defineWebComponent,
    defineWebComponentFromGlobal = _require5.defineWebComponentFromGlobal;

__webpack_require__(62);

Object.defineProperties(Doz, {
  collection: {
    value: collection,
    enumerable: true
  },
  compile: {
    value: compile,
    enumerable: true
  },
  Component: {
    value: Component,
    enumerable: true
  },
  component: {
    value: component,
    enumerable: true
  },
  define: {
    value: component,
    enumerable: true
  },
  h: {
    value: h,
    enumerable: true
  },
  update: {
    value: update,
    enumerable: true
  },
  mixin: {
    value: mixin,
    enumerable: true
  },
  use: {
    value: use,
    enumerable: true
  },
  directive: {
    value: directive,
    enumerable: true
  },

  /*mapper: {
      value: mapper
  },*/
  version: {
    value: '3.4.3',
    enumerable: true
  },
  tag: {
    value: tag,
    enumerable: true
  },
  createDozWebComponent: {
    value: createDozWebComponent,
    enumerable: true
  },
  defineWebComponent: {
    value: defineWebComponent,
    enumerable: true
  },
  defineWebComponentFromGlobal: {
    value: defineWebComponentFromGlobal,
    enumerable: true
  }
});
module.exports = Doz;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function bind(obj, context) {
  if (_typeof(obj) !== 'object' || obj == null) {
    throw new TypeError('expected an object!');
  }

  var target = Object.assign({}, obj);
  var keys = Object.keys(obj);

  for (var i = keys.length - 1; i >= 0; --i) {
    var item = target[keys[i]];

    if (typeof item === 'function') {
      target[keys[i]] = item.bind(context);
    } else if (_typeof(item) === 'object' && item != null) {
      target[keys[i]] = bind(item, context);
    }
  }

  return target;
}

module.exports = bind;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(2),
    data = _require.data; // All methods that starts with prefix callApp are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id


function callMethod() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var method = args.shift();
  var oKeys = data.directivesKeys; // Object.keys(data.directives);

  var callback; // Search for a possible callback

  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] === 'function') {
      callback = args[i];
      break;
    }
  }

  for (var _i = 0; _i < oKeys.length; _i++) {
    var key = oKeys[_i];

    if (data.directives[key]
    /*!== undefined*/
    ) {
        //if (typeof data.directives[key][method] === 'function') {
        if (data.directives[key][method]
        /*!== undefined*/
        ) {
            //console.log(method)
            var res = data.directives[key][method].apply(data.directives[key], args); // If res returns something, fire the callback

            if (res !== undefined && callback) callback(res);
          }
      }
  }
}

function callAppInit() {
  var resArgs = ['onAppInit'];

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppInit', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentCreate() {
  var resArgs = ['onAppComponentCreate'];

  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentBeforeCreate() {
  var resArgs = ['onAppComponentBeforeCreate'];

  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentBeforeCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentConfigCreate() {
  var resArgs = ['onAppComponentConfigCreate'];

  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentConfigCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentBeforeMount() {
  var resArgs = ['onAppComponentBeforeMount'];

  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentBeforeMount', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentMount() {
  var resArgs = ['onAppComponentMount'];

  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentMount', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentMountAsync() {
  var resArgs = ['onAppComponentMountAsync'];

  for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentMountAsync', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentBeforeUpdate() {
  var resArgs = ['onAppComponentBeforeUpdate'];

  for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentBeforeUpdate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentUpdate() {
  var resArgs = ['onAppComponentUpdate'];

  for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentUpdate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentDrawByParent() {
  var resArgs = ['onAppComponentDrawByParent'];

  for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentDrawByParent', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentAfterRender() {
  var resArgs = ['onAppComponentAfterRender'];

  for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentAfterRender', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentBeforeUnmount() {
  var resArgs = ['onAppComponentBeforeUnmount'];

  for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentBeforeUnmount', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentUnmount() {
  var resArgs = ['onAppComponentUnmount'];

  for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    args[_key14] = arguments[_key14];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentUnmount', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentBeforeDestroy() {
  var resArgs = ['onAppComponentBeforeDestroy'];

  for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
    args[_key15] = arguments[_key15];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentBeforeDestroy', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentSetConfig() {
  var resArgs = ['onAppComponentSetConfig'];

  for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
    args[_key16] = arguments[_key16];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentSetConfig', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentSetProps() {
  var resArgs = ['onAppComponentSetProps'];

  for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
    args[_key17] = arguments[_key17];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentSetProps', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentLoadProps() {
  var resArgs = ['onAppComponentLoadProps'];

  for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
    args[_key18] = arguments[_key18];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentLoadProps', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentDestroy() {
  var resArgs = ['onAppComponentDestroy'];

  for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
    args[_key19] = arguments[_key19];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentDestroy', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentAssignIndex() {
  var resArgs = ['onAppComponentAssignIndex'];

  for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
    args[_key20] = arguments[_key20];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentAssignIndex', ...args];

  callMethod.apply(null, resArgs);
}

function callAppWalkDOM() {
  var resArgs = ['onAppWalkDOM'];

  for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
    args[_key21] = arguments[_key21];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppWalkDOM', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentAssignName() {
  var resArgs = ['onAppComponentAssignName'];

  for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
    args[_key22] = arguments[_key22];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentAssignName', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentPropsAssignName() {
  var resArgs = ['onAppComponentPropsAssignName'];

  for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
    args[_key23] = arguments[_key23];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentPropsAssignName', ...args];

  callMethod.apply(null, resArgs);
}

function callAppDOMElementCreate() {
  //todo Dovrebbe risolvere il problema del tag doppio
  var resArgs = ['onAppDOMElementCreate'];

  for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
    args[_key24] = arguments[_key24];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppDOMElementCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppDynamicInstanceCreate() {
  var resArgs = ['onAppDynamicInstanceCreate'];

  for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
    args[_key25] = arguments[_key25];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppDynamicInstanceCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callAppComponentRenderOverwrite() {
  var resArgs = ['onAppComponentRenderOverwrite'];

  for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
    args[_key26] = arguments[_key26];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onAppComponentRenderOverwrite', ...args];

  callMethod.apply(null, resArgs);
}
/*function callAppDOMAttributeSet(...args) {
    args = ['onAppDOMAttributeSet', ...args];
    callMethod.apply(null, args);
}*/


module.exports = {
  callAppInit: callAppInit,
  callAppComponentCreate: callAppComponentCreate,
  callAppComponentLoadProps: callAppComponentLoadProps,
  callAppComponentSetConfig: callAppComponentSetConfig,
  callAppComponentSetProps: callAppComponentSetProps,
  callAppComponentDestroy: callAppComponentDestroy,
  callAppComponentAssignIndex: callAppComponentAssignIndex,
  callAppComponentBeforeCreate: callAppComponentBeforeCreate,
  callAppComponentConfigCreate: callAppComponentConfigCreate,
  callAppComponentBeforeMount: callAppComponentBeforeMount,
  callAppComponentMount: callAppComponentMount,
  callAppComponentBeforeDestroy: callAppComponentBeforeDestroy,
  callAppComponentUnmount: callAppComponentUnmount,
  callAppComponentBeforeUnmount: callAppComponentBeforeUnmount,
  callAppComponentAfterRender: callAppComponentAfterRender,
  callAppComponentDrawByParent: callAppComponentDrawByParent,
  callAppComponentUpdate: callAppComponentUpdate,
  callAppComponentBeforeUpdate: callAppComponentBeforeUpdate,
  callAppComponentMountAsync: callAppComponentMountAsync,
  callAppWalkDOM: callAppWalkDOM,
  callAppComponentAssignName: callAppComponentAssignName,
  callAppDOMElementCreate: callAppDOMElementCreate,
  callAppDynamicInstanceCreate: callAppDynamicInstanceCreate,
  callAppComponentPropsAssignName: callAppComponentPropsAssignName,
  callAppComponentRenderOverwrite: callAppComponentRenderOverwrite
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(2),
    data = _require.data;

var _require2 = __webpack_require__(5),
    extractDirectivesFromProps = _require2.extractDirectivesFromProps,
    isDirective = _require2.isDirective;

var _require3 = __webpack_require__(1),
    REGEX = _require3.REGEX,
    PROPS_ATTRIBUTES = _require3.PROPS_ATTRIBUTES; // Hooks for the component


function callMethod() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var method = args[0];
  var cmp = args[1]; // Remove first argument event name

  args.shift(); //console.warn(cmp.tag, method, cmp.props)

  var directivesKeyValue = extractDirectivesFromProps(cmp);

  var _defined = function _defined(key) {
    var keyArgumentsValues = [];
    var keyArguments = {};
    var originKey = key;

    if (key.indexOf('-') !== -1) {
      keyArgumentsValues = key.split('-');
      key = keyArgumentsValues[0];
      keyArgumentsValues.shift();
    }

    var directiveObj = data.directives[key]; //console.log(method, directiveObj)
    //if (directiveObj)
    //console.warn(method, directiveObj[method])

    if (directiveObj && typeof directiveObj[method] === 'function') {
      // Clone args object
      var outArgs = Object.assign([], args); // Add directive value

      outArgs.push(directivesKeyValue[originKey]);

      var _defined3 = function _defined3(keyArg, i) {
        return keyArguments[keyArg] = keyArgumentsValues[i];
      };

      var _defined4 = directiveObj._keyArguments;

      for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
        _defined3(_defined4[_i4], _i4, _defined4);
      }

      outArgs.push(keyArguments);
      directiveObj[method].apply(directiveObj, outArgs);
    }
  };

  var _defined2 = Object.keys(directivesKeyValue);

  for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
    _defined(_defined2[_i2], _i2, _defined2);
  }
}

function callComponentBeforeCreate() {
  var resArgs = ['onComponentBeforeCreate'];

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentBeforeCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentCreate() {
  var resArgs = ['onComponentCreate'];

  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentCreate', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentBeforeMount() {
  var resArgs = ['onComponentBeforeMount'];

  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentBeforeMount', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentMount() {
  var resArgs = ['onComponentMount'];

  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentMount', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentMountAsync() {
  var resArgs = ['onComponentMountAsync'];

  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentMountAsync', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentAfterRender() {
  var resArgs = ['onComponentAfterRender'];

  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentAfterRender', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentBeforeUpdate() {
  var resArgs = ['onComponentBeforeUpdate'];

  for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentBeforeUpdate', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentUpdate() {
  var resArgs = ['onComponentUpdate'];

  for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentUpdate', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentBeforeUnmount() {
  var resArgs = ['onComponentBeforeUnmount'];

  for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentBeforeUnmount', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentUnmount() {
  var resArgs = ['onComponentUnmount'];

  for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentUnmount', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentBeforeDestroy() {
  var resArgs = ['onComponentBeforeDestroy'];

  for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentBeforeDestroy', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentDestroy() {
  var resArgs = ['onComponentDestroy'];

  for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentDestroy', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentLoadProps() {
  var resArgs = ['onComponentLoadProps'];

  for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    args[_key14] = arguments[_key14];
  }

  Array.prototype.push.apply(resArgs, args); //args = ['onComponentLoadProps', ...args];

  callMethod.apply(null, resArgs);
}

function callComponentDOMElementCreate(instance, $target, initial) {
  var method = 'onComponentDOMElementCreate';
  if (!$target._dozAttach[PROPS_ATTRIBUTES]) return;
  var keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);

  for (var i = 0; i < keys.length; i++) {
    var attributeName = keys[i];
    var attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];

    if (isDirective(attributeName)) {
      var directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
      var directiveValue = attributeValue; //console.log('directiveValue', directiveValue)

      var directiveObj = data.directives[directiveName];

      if (directiveObj && directiveObj[method]) {
        //$target.removeAttribute(attribute.name);
        directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial]);
      }
    }
  }
}

function callComponentDOMElementUpdate(instance, $target) {
  var method = 'onComponentDOMElementUpdate';
  if (!$target._dozAttach[PROPS_ATTRIBUTES]) return;
  var keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);

  for (var i = 0; i < keys.length; i++) {
    var attributeName = keys[i];
    var attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];

    if (isDirective(attributeName)) {
      var directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
      var directiveValue = attributeValue;
      var directiveObj = data.directives[directiveName];

      if (directiveObj && directiveObj[method]) {
        //$target.removeAttribute(attribute.name);
        directiveObj[method].apply(directiveObj, [instance, $target, directiveValue]);
      }
    }
  }
}

function callComponentVNodeTick(instance, newNode, oldNode) {
  if (!newNode || !newNode.props) return;
  var method = 'onComponentVNodeTick';
  var propsKey = Object.keys(newNode.props);

  for (var i = 0; i < propsKey.length; i++) {
    var attributeName = propsKey[i];

    if (isDirective(attributeName)) {
      var directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
      var directiveValue = newNode.props[attributeName]; // || attribute.value;
      //console.log('directiveValue',directiveName, directiveValue)

      var directiveObj = data.directives[directiveName]; //console.log('aaaaaaa', attributeName, directiveObj)

      if (directiveObj && directiveObj[method]) {
        //delete newNode.props[attributeName];
        directiveObj[method].apply(directiveObj, [instance, newNode, oldNode, directiveValue]);
      }
    }
  }
}

module.exports = {
  callComponentBeforeCreate: callComponentBeforeCreate,
  callComponentCreate: callComponentCreate,
  callComponentBeforeMount: callComponentBeforeMount,
  callComponentMount: callComponentMount,
  callComponentMountAsync: callComponentMountAsync,
  callComponentAfterRender: callComponentAfterRender,
  callComponentBeforeUpdate: callComponentBeforeUpdate,
  callComponentUpdate: callComponentUpdate,
  callComponentBeforeUnmount: callComponentBeforeUnmount,
  callComponentUnmount: callComponentUnmount,
  callComponentBeforeDestroy: callComponentBeforeDestroy,
  callComponentDestroy: callComponentDestroy,
  callComponentLoadProps: callComponentLoadProps,
  callComponentDOMElementCreate: callComponentDOMElementCreate,
  callComponentDOMElementUpdate: callComponentDOMElementUpdate,
  callComponentVNodeTick: callComponentVNodeTick
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

function hmr(instance, _module) {
  if (!_module || !_module.hot) return;
  var NS_PROPS = '__doz_hmr_props_store__';
  var NS_INIT_PROPS = '__doz_hmr_init_props_store__';
  window[NS_PROPS] = window[NS_PROPS] || {};
  window[NS_INIT_PROPS] = window[NS_INIT_PROPS] || {};
  var id = _module.id;
  window[NS_PROPS][id] = window[NS_PROPS][id] || new Map();
  window[NS_INIT_PROPS][id] = window[NS_INIT_PROPS][id] || new Map();

  var _defined = function _defined(p) {
    if (instance._initialProps[p] === window[NS_INIT_PROPS][id].get(p)) instance.props[p] = window[NS_PROPS][id].get(p) || instance.props[p];else instance.props[p] = instance._initialProps[p];
  };

  var _defined2 = Object.keys(instance.props);

  for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
    _defined(_defined2[_i2], _i2, _defined2);
  }

  _module.hot.dispose(function () {
    var _defined3 = function _defined3(p) {
      window[NS_PROPS][id].set(p, instance.props[p]);
      window[NS_INIT_PROPS][id].set(p, instance._initialProps[p]);
    };

    var _defined4 = Object.keys(instance.props);

    for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
      _defined3(_defined4[_i4], _i4, _defined4);
    }
  });
}

module.exports = hmr;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var proxy = __webpack_require__(15);

var events = __webpack_require__(6);

var propsListener = __webpack_require__(34);

var manipulate = __webpack_require__(16);

function runUpdate(instance, changes) {
  events.callUpdate(instance, changes);
  propsListener(instance, changes);
  instance.render(undefined, changes);
}

function create(instance) {
  var recreate = false;

  if (instance._props && instance._props.__isProxy) {
    proxy.remove(instance._props);
    recreate = true;
  }

  instance._props = proxy.create(instance._rawProps, true, function (changes) {
    if (!instance._isRendered) return;

    if (instance.delayUpdate) {
      setTimeout(function () {
        runUpdate(instance, changes);
      }, instance.delayUpdate);
    } else {
      runUpdate(instance, changes);
    }
  }, function (target, property) {
    target[property] = manipulate(instance, target[property], property);
  });
  proxy.manipulate(instance._props, function (value, currentPath, onFly) {
    return manipulate(instance, value, currentPath, onFly);
  });
  proxy.beforeChange(instance._props, function (changes) {
    var res = events.callBeforeUpdate(instance, changes);
    if (res === false) return false;
  });

  if (recreate && instance._isRendered) {
    instance.render();
  }
}

module.exports = {
  create: create
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = {
  encode: function encode(str) {
    return typeof str === 'string' ? str.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/`/g, '&grave;') : str;
  },
  decode: function decode(str) {
    return typeof str === 'string' ? str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&grave;/g, '`') : str;
  }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var delay = __webpack_require__(3);

function propsListener(instance, changes) {
  if (_typeof(instance.propsListener) === 'object') for (var i = 0; i < changes.length; i++) {
    var item = changes[i];
    var propPath = instance.propsListener[item.currentPath];

    if (item.type === 'update' && propPath) {
      var func = instance[propPath] || propPath;

      if (typeof func === 'function') {
        func.call(instance, item.newValue, item.previousValue);
      }
    }
  }
  if (_typeof(instance.propsListenerAsync) === 'object') for (var _i = 0; _i < changes.length; _i++) {
    var _item = changes[_i];
    var _propPath = instance.propsListenerAsync[_item.currentPath];

    if (_item.type === 'update' && _propPath) {
      (function () {
        var func = instance[_propPath] || _propPath;

        if (typeof func === 'function') {
          (function (item) {
            delay(function () {
              return func.call(instance, item.newValue, item.previousValue);
            });
          })(_item);
        }
      })();
    }
  }
}

module.exports = propsListener;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var types = {
  string: function string(value) {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  },
  number: function number(value) {
    if (typeof value === 'number') return value;
    return Number(value);
  },
  "boolean": function boolean(value) {
    if (typeof value === 'boolean') return value;else if (value === 'true' || value === 1) return true;else if (value === 'false' || value === 0) return false;else {
      return !!value;
    }
  },
  object: function object(value) {
    if (_typeof(value) === 'object' && value) return value;

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  array: function array(value) {
    return this.object(value);
  },
  date: function date(value) {
    if (value instanceof Date) return value;else return new Date(value);
  }
};

module.exports = function castType(value, type) {
  if (types[type] !== undefined) {
    value = types[type](value);
  }

  return value;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var element = __webpack_require__(17);

module.exports = {
  updateElement: element.update
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(1),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR,
    PROPS_ATTRIBUTES = _require.PROPS_ATTRIBUTES; //const castStringTo = require('../utils/cast-string-to');


var objectPath = __webpack_require__(38);

var isListener = __webpack_require__(39); //const mapper = require('./mapper');


var _require2 = __webpack_require__(5),
    isDirective = _require2.isDirective;

var makeSureAttach = __webpack_require__(4);

var booleanAttributes = __webpack_require__(40);

function isEventAttribute(name) {
  return isListener(name);
}

function setAttribute($target, name, value, cmp, cmpParent, isSVG) {
  //console.log('setAttribute', $target, name, value)
  if (name === 'data-attributeoriginaletagname') return;
  makeSureAttach($target);

  if (!$target._dozAttach[PROPS_ATTRIBUTES]) {
    $target._dozAttach[PROPS_ATTRIBUTES] = {};
  }

  $target._dozAttach[PROPS_ATTRIBUTES][name] = value;

  if (name === 'key') {
    if ($target._dozAttach.key === undefined) {
      $target._dozAttach.key = value;
    }

    return;
  }

  var _isDirective = isDirective(name);

  if (_isDirective) $target._dozAttach.hasDirective = true;

  if ((isCustomAttribute(name) || typeof value === 'function' || _typeof(value) === 'object') && !_isDirective) {// why? I need to remove any orphan keys in the mapper. Orphan keys are created by handler attributes
    // like onclick, onmousedown etc. ...
    // handlers are associated to the element only once.
    // at the moment the only way to remove the keys is to take them.
    //if (isEventAttribute(name) && typeof value === 'string') {
    //mapper.getAll(value);
    //}

    /*} else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);*/
  } else {
    if (value === undefined) value = '';

    if (name === 'class' && !isSVG) {
      $target.className = value; //Imposto solo se la proprietà esiste...
    } else if ($target[name] !== undefined && !isSVG) {
      //console.log(name, value, typeof value)
      // Support for boolean attributes like required, disabled etc..
      if (value === '') {
        if (booleanAttributes.indexOf(name) > -1) value = true;
      }

      $target[name] = value;
    } else if (name.startsWith('data-') || name.startsWith('aria-') || name === 'role' || name === 'for' || isSVG) {
      $target.setAttribute(name, value);
    }
  }
}

function updateAttribute($target, name, newVal, oldVal, cmp, cmpParent, isSVG) {
  //if (newVal !== oldVal) {
  setAttribute($target, name, newVal, cmp, cmpParent, isSVG);
  cmp.$$afterAttributeUpdate($target, name, newVal); //}
}

function updateAttributes($target, newProps) {
  var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var cmp = arguments.length > 3 ? arguments[3] : undefined;
  var cmpParent = arguments.length > 4 ? arguments[4] : undefined;
  var isSVG = arguments.length > 5 ? arguments[5] : undefined;
  var props = Object.assign({}, newProps, oldProps);
  var updated = [];
  var propsKeys = Object.keys(props);
  var name;

  for (var i = 0; i < propsKeys.length; i++) {
    name = propsKeys[i];
    if (!$target || $target.nodeType !== 1) continue;

    if (newProps[name] !== oldProps[name]) {
      updateAttribute($target, name, newProps[name], oldProps[name], cmp, cmpParent, isSVG);
      var obj = {};
      obj[name] = newProps[name];
      updated.push(obj);
    }
  }
  /*Object.keys(props).forEach(name => {
      if(!$target || $target.nodeType !== 1) return;
      updateAttribute($target, name, newProps[name], oldProps[name], cmp, cmpParent);
      if (newProps[name] !== oldProps[name]) {
          let obj = {};
          obj[name] = newProps[name];
          updated.push(obj);
      }
  });*/


  return updated;
}

function isCustomAttribute(name) {
  return isEventAttribute(name) || name === ATTR.FORCE_UPDATE;
}

function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

function trimQuotes(str) {
  return str.replace(REGEX.TRIM_QUOTES, '$1');
}

function addEventListener($target, name, value, cmp, cmpParent) {
  if (!isEventAttribute(name)) return; //console.log('event attribute', name, value)

  var alreadyFunction = false; // Determines if the function is passed by mapper

  if (typeof value === 'function') {
    alreadyFunction = true;
  } // Legacy logic where use a string instead of function


  if (typeof value === 'string') {
    // If use scope. from onDrawByParent event
    var match = value.match(REGEX.GET_LISTENER_SCOPE);

    if (match) {
      var args = null;
      var handler = match[1];
      var stringArgs = match[2];

      if (stringArgs) {
        var _defined = stringArgs.split(',');

        args = new Array(_defined.length);

        var _defined2 = function _defined2(item) {
          item = trimQuotes(item.trim()); //return item === 'scope' ? cmpParent : castStringTo(trimQuotes(item))

          /*let itemMap = mapper.get(item);
          if (itemMap !== undefined)
              item = itemMap;*/

          return item === 'scope' ? cmpParent : item;
        };

        for (var _i2 = 0; _i2 <= _defined.length - 1; _i2++) {
          args[_i2] = _defined2(_defined[_i2], _i2, _defined);
        }
      }

      var method = objectPath(handler, cmpParent);

      if (method !== undefined) {
        value = args ? method.bind.apply(method, [cmpParent].concat(_toConsumableArray(args))) : method.bind(cmpParent);
      }
    } else {
      /*return;
      console.log('bbb')*/
      match = value.match(REGEX.GET_LISTENER);

      if (match) {
        //console.log('aaaaa')
        var _args = null;
        var _handler = match[1];
        var _stringArgs = match[2];

        if (_stringArgs) {
          var _defined3 = _stringArgs.split(',');

          _args = new Array(_defined3.length);

          var _defined4 = function _defined4(item) {
            item = trimQuotes(item.trim());
            /*let itemMap = mapper.get(item);
            if (itemMap !== undefined)
                item = itemMap;*/
            //return item === 'this' ? cmp : castStringTo(trimQuotes(item))

            return item === 'this' ? cmp : item;
          };

          for (var _i4 = 0; _i4 <= _defined3.length - 1; _i4++) {
            _args[_i4] = _defined4(_defined3[_i4], _i4, _defined3);
          }
        }

        var isParentMethod = _handler.match(REGEX.IS_PARENT_METHOD);

        if (isParentMethod) {
          _handler = isParentMethod[1];
          cmp = cmp.parent;
        }

        var _method = objectPath(_handler, cmp);

        if (_method !== undefined) {
          value = _args ? _method.bind.apply(_method, [cmp].concat(_toConsumableArray(_args))) : _method.bind(cmp);
        }
      }
    }
  }

  if (typeof value === 'function') {
    if (alreadyFunction) {
      $target.addEventListener(extractEventName(name), value.bind(cmp));
    } else {
      $target.addEventListener(extractEventName(name), value);
    }
  } else {
    value = value.replace(REGEX.THIS_TARGET, '$target'); // I don't understand but with regex test sometimes it don't works fine so use match... boh!
    //if (REGEX.IS_LISTENER_SCOPE.test(value) || value === 'scope') {

    if (value.match(REGEX.IS_LISTENER_SCOPE) || value === 'scope') {
      var _func = function _func() {
        // Brutal replace of scope with this
        value = value.replace(/scope/g, 'this');
        eval(value);
      };

      $target.addEventListener(extractEventName(name), _func.bind(cmpParent));
    } else {
      var _func2 = function _func2() {
        eval(value);
      };

      $target.addEventListener(extractEventName(name), _func2.bind(cmp));
    }
  }
}

function attach($target, nodeProps, cmp, cmpParent, isSVG) {
  var name; //console.log(nodeProps)

  var propsKeys = Object.keys(nodeProps);

  for (var i = 0, len = propsKeys.length; i < len; i++) {
    name = propsKeys[i];
    addEventListener($target, name, nodeProps[name], cmp, cmpParent);
    setAttribute($target, name, nodeProps[name], cmp, cmpParent, isSVG); //cmp.$$afterAttributeCreate($target, name, nodeProps[name], nodeProps);
  }
  /*const datasetArray = Object.keys($target.dataset);
  for (let i = 0; i < datasetArray.length; i++) {
      if (isListener(datasetArray[i]))
          addEventListener($target, datasetArray[i], $target.dataset[datasetArray[i]], cmp, cmpParent);
  }*/

}

module.exports = {
  attach: attach,
  updateAttributes: updateAttributes
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

function getByPath(path, obj) {
  return path.split('.').reduce(function (res, prop) {
    return res ? res[prop] : undefined;
  }, obj);
}

function getLast(path, obj) {
  if (path.indexOf('.') !== -1) {
    path = path.split('.');
    path.pop();
    path = path.join('.');
  }

  return getByPath(path, obj);
}

module.exports = getByPath;
module.exports.getLast = getLast;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function isListener(str) {
  if (typeof str !== 'string') return false;
  return str[0] === 'o' && str[1] === 'n';
};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = ['async', 'autocomplete', 'autofocus', 'autoplay', 'border', 'challenge', 'checked', 'compact', 'contenteditable', 'controls', 'default', 'defer', 'disabled', 'formNoValidate', 'frameborder', 'hidden', 'indeterminate', 'ismap', 'loop', 'multiple', 'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'readonly', 'required', 'reversed', 'scoped', 'scrolling', 'seamless', 'selected', 'sortable', 'spellcheck', 'translate'];

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var composeStyleInner = __webpack_require__(19);

var createStyle = __webpack_require__(42);

function scopedInner(cssContent, uId, tag, scoped, cmp) {
  if (typeof cssContent !== 'string') return;
  cssContent = composeStyleInner(cssContent, tag);
  return createStyle(cssContent, uId, tag, scoped, cmp);
}

module.exports = {
  scopedInner: scopedInner
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var tagList = __webpack_require__(43);

var _require = __webpack_require__(1),
    TAG = _require.TAG;

function createStyle(cssContent, uId, tag, scoped, cmp) {
  var result;
  var styleId = "".concat(uId, "--style");
  var styleResetId = "".concat(uId, "--style-reset"); //const styleExists = document.getElementById(styleId);

  var styleExists;

  if (cmp && cmp.app.useShadowRoot) {
    styleExists = cmp.app._root.getElementById(styleId);
  } else {
    styleExists = document.getElementById(styleId);
  }

  if (styleExists) {
    result = styleExists.innerHTML = cssContent;
  } else {
    if (scoped) {
      var resetContent = "".concat(tag, ", ").concat(tag, " *,");
      resetContent += tagList.map(function (t) {
        return "".concat(tag, " ").concat(t);
      }).join(',');
      resetContent += " {all: initial}";
      var styleResetEl = document.createElement("style");
      styleResetEl.id = styleResetId;
      styleResetEl.innerHTML = resetContent;

      if (cmp && cmp.app.useShadowRoot) {
        var tagApp = cmp.app._root.querySelector(TAG.APP);

        cmp.app._root.insertBefore(styleResetEl, tagApp);
      } else {
        document.head.appendChild(styleResetEl);
      }
    }

    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    result = styleEl.innerHTML = cssContent;

    if (cmp && cmp.app.useShadowRoot) {
      var _tagApp = cmp.app._root.querySelector(TAG.APP);

      cmp.app._root.insertBefore(styleEl, _tagApp);
    } else {
      document.head.appendChild(styleEl);
    }
  }

  return result;
}

module.exports = createStyle;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'blockquote', //'body',
'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', //'html',
'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'meter', 'nav', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'source', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(1),
    COMPONENT_DYNAMIC_INSTANCE = _require.COMPONENT_DYNAMIC_INSTANCE,
    PROPS_ATTRIBUTES = _require.PROPS_ATTRIBUTES;

var directive = __webpack_require__(0);

function drawDynamic(instance) {
  var index = instance._processing.length - 1;

  while (index >= 0) {
    var item = instance._processing[index];
    var root = item.node.parentNode; //console.log('create dynamic', item.node, item.node.__dozProps)

    var dynamicInstance = __webpack_require__(13)({
      root: root,
      template: item.node,
      //template: item.node.outerHTML,
      app: instance.app,
      parent: instance
    });

    if (dynamicInstance) {
      // Replace with dynamic instance original node
      //console.log('....', item.node.outerHTML, dynamicInstance._rootElement.parentNode.outerHTML)

      /*// Assign props attributes to new child
      //console.log('Assign props attributes to new child')
      if(item.node._dozAttach[PROPS_ATTRIBUTES]) {
          dynamicInstance._rootElement.parentNode._dozAttach[PROPS_ATTRIBUTES] = item.node._dozAttach[PROPS_ATTRIBUTES];
      }*/
      //root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
      // if original node has children
      if (item.node.childNodes.length) {
        // replace again -.-
        //root.replaceChild(item.node, dynamicInstance._rootElement.parentNode);
        // and append root element of dynamic instance :D
        item.node.appendChild(dynamicInstance._rootElement);
      }

      dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;

      instance._processing.splice(index, 1);

      var n = Object.keys(instance.children).length;
      instance.children[n++] = dynamicInstance;

      if (instance.childrenByTag[dynamicInstance.tag] === undefined) {
        instance.childrenByTag[dynamicInstance.tag] = [dynamicInstance];
      } else {
        instance.childrenByTag[dynamicInstance.tag].push(dynamicInstance);
      }

      directive.callAppDynamicInstanceCreate(instance, dynamicInstance, item);
    }

    index -= 1;
  }
}

module.exports = drawDynamic;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var camelToDash = __webpack_require__(20);

function toInlineStyle(obj) {
  var withStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var _defined = Object.entries(obj);

  var _defined2 = function _defined2(styleString, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        propName = _ref2[0],
        propValue = _ref2[1];

    return "".concat(styleString).concat(camelToDash(propName), ":").concat(propValue, ";");
  };

  var _acc = '';

  for (var _i2 = 0; _i2 <= _defined.length - 1; _i2++) {
    _acc = _defined2(_acc, _defined[_i2], _i2, _defined);
  }

  obj = _acc;
  return withStyle ? "style=\"".concat(obj, "\"") : obj;
}

module.exports = toInlineStyle;

/***/ }),
/* 46 */
/***/ (function(module, exports) {

function add(instance) {
  if (typeof instance.onAppReady === 'function') {
    instance.onAppReady._instance = instance;

    instance.app._onAppReadyCB.push(instance.onAppReady);
  }
}

module.exports = {
  add: add
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

function add(instance) {
  if (typeof instance.onAppDraw === 'function') {
    instance.onAppDraw._instance = instance;

    instance.app._onAppDrawCB.push(instance.onAppDraw);
  }
}

function emit(instance, next, prev) {
  var _defined = function _defined(cb) {
    if (typeof cb === 'function' && cb._instance) {
      cb.call(cb._instance, next, prev, instance);
    }
  };

  var _defined2 = instance.app._onAppDrawCB;

  for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
    _defined(_defined2[_i2], _i2, _defined2);
  }
}

module.exports = {
  add: add,
  emit: emit
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

function extendInstance(instance, cfg, dProps) {
  Object.assign(instance, cfg, dProps);
}

module.exports = extendInstance;

/***/ }),
/* 49 */
/***/ (function(module, exports) {

function removeAllAttributes(el) {
  var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var attributeName;

  for (var i = el.attributes.length - 1; i >= 0; i--) {
    attributeName = el.attributes[i].name; // exclude anyway data attributes

    if (exclude.includes(attributeName) || attributeName.split('-')[0] === 'data') continue;
    el.removeAttribute(attributeName);
  }
}

module.exports = removeAllAttributes;

/***/ }),
/* 50 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function deepCopy(obj) {
  // if not array or object or is null return self
  if (_typeof(obj) !== 'object' || obj === null) return obj;
  var newObj, i; // handle case: array

  if (Array.isArray(obj)) {
    var l;
    newObj = [];

    for (i = 0, l = obj.length; i < l; i++) {
      newObj[i] = deepCopy(obj[i]);
    }

    return newObj;
  } // handle case: object


  newObj = {};

  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      //if (obj[i] === undefined)
      //console.log(i, obj[i])
      newObj[i] = deepCopy(obj[i]);
    }
  }

  return newObj;
}

module.exports = deepCopy;

/***/ }),
/* 51 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function loadLocal(instance) {
  // Add local components
  if (Array.isArray(instance.components)) {
    var _defined = function _defined(cmp) {
      if (_typeof(cmp) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
        instance._components[cmp.tag] = cmp;
      }
    };

    var _defined2 = instance.components;

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
      _defined(_defined2[_i2], _i2, _defined2);
    }

    delete instance.components;
  } else if (_typeof(instance.components) === 'object') {
    var _defined3 = function _defined3(objName) {
      instance._components[objName] = {
        tag: objName,
        cfg: instance.components[objName]
      };
    };

    var _defined4 = Object.keys(instance.components);

    for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
      _defined3(_defined4[_i4], _i4, _defined4);
    }

    delete instance.components;
  }
}

module.exports = loadLocal;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var mixin = __webpack_require__(22);

function localMixin(instance) {
  mixin(instance, instance.mixin);
  instance.mixin = [];
}

module.exports = localMixin;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var canDecode = __webpack_require__(18);

var composeStyleInner = __webpack_require__(19);

var dashToCamel = __webpack_require__(8);

var Base = __webpack_require__(54);

var _require = __webpack_require__(1),
    COMPONENT_DYNAMIC_INSTANCE = _require.COMPONENT_DYNAMIC_INSTANCE,
    COMPONENT_ROOT_INSTANCE = _require.COMPONENT_ROOT_INSTANCE,
    COMPONENT_INSTANCE = _require.COMPONENT_INSTANCE,
    PROPS_ATTRIBUTES = _require.PROPS_ATTRIBUTES,
    DEFAULT_SLOT_KEY = _require.DEFAULT_SLOT_KEY,
    TAG = _require.TAG;

var directive = __webpack_require__(0);

var _require2 = __webpack_require__(5),
    isDirective = _require2.isDirective;

var makeSureAttach = __webpack_require__(4);

var DOMManipulation = /*#__PURE__*/function (_Base) {
  _inherits(DOMManipulation, _Base);

  var _super = _createSuper(DOMManipulation);

  function DOMManipulation(opt) {
    _classCallCheck(this, DOMManipulation);

    return _super.call(this, opt);
  }

  _createClass(DOMManipulation, [{
    key: "$$afterNodeElementCreate",
    value: function $$afterNodeElementCreate($el, node, initial) {
      if ($el._dozAttach.hasDirective) {
        directive.callAppDOMElementCreate(this, $el, node, initial);
        directive.callComponentDOMElementCreate(this, $el, initial);
      }

      if (typeof $el.hasAttribute === 'function') {
        if (node.type.indexOf('-') !== -1 && !initial) {
          this._processing.push({
            node: $el,
            action: 'create'
          });
        }

        if ($el.nodeName === TAG.SLOT_UPPERCASE) {
          var slotName = $el._dozAttach[PROPS_ATTRIBUTES] ? $el._dozAttach[PROPS_ATTRIBUTES].name : null;

          if (!slotName) {
            this._defaultSlot = $el;
            slotName = DEFAULT_SLOT_KEY;
          }

          if (this._slots[slotName] === undefined) {
            this._slots[slotName] = [$el];
          } else {
            this._slots[slotName].push($el);
          }
        }
      }
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "$$beforeNodeChange",
    value: function $$beforeNodeChange($parent, $oldElement, newNode, oldNode) {
      if (typeof newNode === 'string' && typeof oldNode === 'string' && $oldElement) {
        if ($parent.nodeName === 'SCRIPT') {
          // it could be heavy
          if ($parent.type === 'text/style' && $parent._dozAttach.styleData.id && $parent._dozAttach.styleData.owner && document.getElementById($parent._dozAttach.styleData.id)) {
            document.getElementById($parent._dozAttach.styleData.id).textContent = composeStyleInner(newNode, $parent._dozAttach.styleData.ownerByData);
          }
        } else {
          $oldElement.textContent = canDecode(newNode);
        }

        return $oldElement;
      }
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "$$afterNodeChange",
    value: function $$afterNodeChange($newElement, $oldElement) {
      makeSureAttach($oldElement);
      makeSureAttach($newElement); //Re-assign CMP COMPONENT_DYNAMIC_INSTANCE to new element

      if ($oldElement._dozAttach[COMPONENT_ROOT_INSTANCE]) {
        $newElement._dozAttach[COMPONENT_ROOT_INSTANCE] = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE];
        $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement = $newElement;
        $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE].uId;
      }
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "$$beforeNodeWalk",
    value: function $$beforeNodeWalk($parent, index, attributesUpdated) {
      if ($parent.childNodes[index]) {
        makeSureAttach($parent.childNodes[index]);
        var dynInstance = $parent.childNodes[index]._dozAttach[COMPONENT_DYNAMIC_INSTANCE]; // Can update props of dynamic instances?

        if (dynInstance && attributesUpdated.length) {
          var _defined = function _defined(props) {
            var _defined2 = function _defined2(name) {
              dynInstance.props[name] = props[name];
            };

            var _defined3 = Object.keys(props);

            for (var _i4 = 0; _i4 <= _defined3.length - 1; _i4++) {
              _defined2(_defined3[_i4], _i4, _defined3);
            }
          };

          for (var _i2 = 0; _i2 <= attributesUpdated.length - 1; _i2++) {
            _defined(attributesUpdated[_i2], _i2, attributesUpdated);
          }

          return true;
        }
      }

      return false;
    } // noinspection JSMethodCanBeStatic

    /*$$afterAttributeCreate($target, name, value, nodeProps) {
    }*/
    // noinspection JSMethodCanBeStatic

    /*$$afterAttributesCreate($target, bindValue) {
    }*/

  }, {
    key: "$$afterAttributeUpdate",
    value: function $$afterAttributeUpdate($target, name, value) {
      var _isDirective = isDirective(name);

      if (this.updateChildrenProps && $target) {
        //name = REGEX.IS_DIRECTIVE.test(name) ? name : dashToCamel(name);
        name = _isDirective ? name : dashToCamel(name);
        var firstChild = $target.firstChild;
        makeSureAttach(firstChild);

        if (firstChild && firstChild._dozAttach[COMPONENT_ROOT_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild._dozAttach[COMPONENT_ROOT_INSTANCE]._publicProps, name)) {
          firstChild._dozAttach[COMPONENT_ROOT_INSTANCE].props[name] = value;
        } else if ($target._dozAttach[COMPONENT_INSTANCE]) {
          $target._dozAttach[COMPONENT_INSTANCE].props[name] = value;
        }
      }

      directive.callComponentDOMElementUpdate(this, $target); //if ($target && REGEX.IS_DIRECTIVE.test(name)) {

      if ($target && _isDirective) {
        $target.removeAttribute(name);
      }
    }
  }]);

  return DOMManipulation;
}(Base);

module.exports = DOMManipulation;

/***/ }),
/* 54 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function Base() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Base);

  opt.cmp = opt.cmp || {
    tag: opt.tag,
    cfg: {}
  };
  opt.app = opt.app || {};
  Object.defineProperties(this, {
    //Private
    _opt: {
      value: opt
    },
    _cfgRoot: {
      value: opt.root
    },
    _publicProps: {
      value: Object.assign({}, opt.props)
    },
    _isRendered: {
      value: false,
      writable: true
    },
    _prev: {
      value: null,
      writable: true
    },
    _rootElement: {
      value: null,
      writable: true
    },
    _parentElement: {
      value: null,
      writable: true
    },
    _components: {
      value: {},
      writable: true
    },
    _processing: {
      value: [],
      writable: true
    },
    _dynamicChildren: {
      value: [],
      writable: true
    },
    _unmounted: {
      value: false,
      writable: true
    },
    _unmountedParentNode: {
      value: null,
      writable: true
    },
    _configured: {
      value: false,
      writable: true
    },
    _props: {
      value: {},
      writable: true
    },
    _directiveProps: {
      value: {},
      writable: true
    },
    _computedCache: {
      value: new Map()
    },
    _renderPause: {
      value: false,
      writable: true
    },
    _rawHTML: {
      value: '',
      writable: true
    },
    _slots: {
      value: {},
      writable: true
    },
    _defaultSlot: {
      value: null,
      writable: true
    },
    _localComponentLastId: {
      value: 0,
      writable: true
    },
    _currentStyle: {
      value: '',
      writable: true
    },
    _componentsMap: {
      value: new Map()
    },
    //Public
    tag: {
      value: opt.cmp.tag,
      enumerable: true
    },

    /*uId: {
        value: opt.uId,
        enumerable: true
    },*/
    app: {
      value: opt.app,
      enumerable: true
    },
    parent: {
      value: opt.parentCmp,
      enumerable: true,
      configurable: true
    },
    appRoot: {
      value: opt.app._root,
      enumerable: true
    },
    action: {
      value: opt.app.action,
      enumerable: true
    },
    shared: {
      value: opt.app.shared,
      writable: true,
      enumerable: true
    },
    children: {
      value: {},
      enumerable: true
    },
    childrenByTag: {
      value: {},
      enumerable: true
    },
    rawChildren: {
      value: [],
      enumerable: true
    },
    rawChildrenVnode: {
      value: [],
      enumerable: true
    },
    autoCreateChildren: {
      value: true,
      enumerable: true,
      writable: true
    },
    updateChildrenProps: {
      value: true,
      enumerable: true,
      writable: true
    },
    mixin: {
      value: [],
      enumerable: true,
      writable: true
    },
    propsConvertOnFly: {
      value: false,
      enumerable: true,
      writable: true
    },
    propsComputedOnFly: {
      value: false,
      enumerable: true,
      writable: true
    },
    delayUpdate: {
      value: 0,
      enumerable: true,
      writable: true
    },
    propsData: {
      value: {},
      enumerable: true,
      writable: true
    },
    lockRemoveInstanceByCallback: {
      value: null,
      enumerable: true,
      writable: true
    }
  });
};

module.exports = Base;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = cloneObject;

/***/ }),
/* 56 */
/***/ (function(module, exports) {

function getComponentName($child) {
  return $child._dozAttach.originalTagName || $child.nodeName.toLowerCase();
}

module.exports = getComponentName;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(2),
    registerComponent = _require.registerComponent;

var _require2 = __webpack_require__(1),
    REGEX = _require2.REGEX;

function component(tag) {
  var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof tag !== 'string') {
    throw new TypeError('Tag must be a string');
  }

  if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
    throw new TypeError('Tag must contain a dash (-) like my-component');
  }

  var cmp = {
    tag: tag,
    cfg: cfg
  };
  registerComponent(cmp);
}

module.exports = component;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(11);

var mixin = __webpack_require__(22);

function globalMixin(obj) {
  mixin(Component.prototype, obj);
}

module.exports = globalMixin;

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = function tag(name) {
  return function (target) {
    target.tag = name;
  };
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n                    <", ">", "</", ">\n                "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Doz = __webpack_require__(12);

var data = __webpack_require__(9);

var dashToCamel = __webpack_require__(8);

__webpack_require__(61)();

function createDozWebComponent(tag, cmp) {
  var observedAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'dwc';
  var globalTag = arguments.length > 4 ? arguments[4] : undefined;
  data.webComponents.tags[tag] = data.webComponents.tags[tag] || {};

  if (prefix) {
    prefix += '-';
  }

  customElements.define(prefix + tag, /*#__PURE__*/function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    var _super = _createSuper(_class);

    _createClass(_class, null, [{
      key: "observedAttributes",
      get: function get() {
        return observedAttributes;
      }
    }]);

    function _class() {
      _classCallCheck(this, _class);

      return _super.call(this);
    }

    _createClass(_class, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var initialProps = {};
        var id = null;
        var contentHTML = '';
        var hasDataNoShadow = this.hasAttribute('data-no-shadow');
        var root = !hasDataNoShadow ? this.attachShadow({
          mode: 'open'
        }) : this;
        var thisElement = this;

        for (var att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
          att = atts[i];

          if (att.nodeName === 'data-id') {
            id = att.nodeValue;
            continue;
          }

          if (observedAttributes.includes(att.nodeName)) {
            initialProps[dashToCamel(att.nodeName)] = att.nodeValue;
          }
        }

        contentHTML = this.innerHTML;
        this.innerHTML = '';
        var tagCmp = cmp || globalTag || tag;
        this.dozApp = new Doz({
          root: root,
          useShadowRoot: !hasDataNoShadow,
          template: function template(h) {
            return h(_templateObject(), tagCmp, contentHTML, tagCmp);
          },
          onMountAsync: function onMountAsync() {
            thisElement.removeAttribute('data-soft-entrance');
            var firstChild = this.children[0];
            firstChild.props = Object.assign({}, firstChild.props, initialProps);
            var countCmp = Object.keys(data.webComponents.tags[tag]).length++;
            data.webComponents.tags[tag][id || countCmp] = firstChild;

            if (id !== null) {
              if (data.webComponents.ids[id]) return console.warn(id + ': id already exists for DozWebComponent');
              data.webComponents.ids[id] = firstChild;
            }
          }
        });
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (!this.dozApp) return;
        var firstChild = this.dozApp.mainComponent.children[0];
        firstChild.props[dashToCamel(name)] = newValue;
      }
    }]);

    return _class;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));
}

function defineWebComponent(tag, cmp) {
  var observedAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  createDozWebComponent(tag, cmp, observedAttributes, '');
}

function defineWebComponentFromGlobal(tag, globalTag) {
  var observedAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  createDozWebComponent(tag, null, observedAttributes, '', globalTag);
}

module.exports = {
  defineWebComponent: defineWebComponent,
  defineWebComponentFromGlobal: defineWebComponentFromGlobal,
  createDozWebComponent: createDozWebComponent
};

/***/ }),
/* 61 */
/***/ (function(module, exports) {

function createStyleSoftEntrance() {
  if (!document.getElementById('style--soft-entrance--')) {
    var style = document.createElement('style');
    style.id = 'style--soft-entrance--';
    style.innerHTML = "[data-soft-entrance] {visibility: hidden!important;}";
    document.head.appendChild(style);
  }
}

module.exports = createStyleSoftEntrance;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(63);

__webpack_require__(64);

__webpack_require__(65);

__webpack_require__(66);

__webpack_require__(67);

__webpack_require__(68);

__webpack_require__(69);

__webpack_require__(70);

__webpack_require__(71);

__webpack_require__(73);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':store', {
  createStore: function createStore(instance, storeName) {
    if (typeof storeName === 'string') {
      if (instance.app._stores[storeName] !== undefined) {
        throw new Error("Store already defined: ".concat(storeName));
      }

      instance.app._stores[storeName] = instance.props;
      instance.store = storeName;
    }
  },
  syncStore: function syncStore(instance, storeName) {
    if (typeof storeName === 'string' && instance.app._stores[storeName] !== undefined) {
      instance.app._stores[storeName] = instance.props;
    }
  },
  onAppInit: function onAppInit(app) {
    Object.defineProperties(app, {
      _stores: {
        value: {},
        writable: true
      },
      getStore: {
        value: function value(store) {
          return app._stores[store];
        },
        enumerable: true
      }
    });
  },
  // Create by property defined
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      getStore: {
        value: function value(store) {
          return instance.app._stores[store];
        },
        enumerable: true
      }
    });

    if (instance.store !== undefined && instance.props['d:store'] === undefined) {
      this.createStore(instance, instance.store);
    }
  },
  // Create by props
  onComponentCreate: function onComponentCreate(instance, directiveValue) {
    this.createStore(instance, directiveValue);
  },
  onAppComponentLoadProps: function onAppComponentLoadProps(instance) {
    this.syncStore(instance, instance.store);
  },
  onAppComponentSetProps: function onAppComponentSetProps(instance) {
    this.syncStore(instance, instance.store);
  },
  onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
    if (typeof obj.store === 'string') {
      this.createStore(instance, obj.store);
    }
  },
  onAppComponentDestroy: function onAppComponentDestroy(instance) {
    if (instance.store && instance.app._stores[instance.store]) delete instance.app._stores[instance.store];
  }
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':id', {
  createId: function createId(instance, id) {
    if (typeof id === 'string') {
      /*if (instance.app._ids[id] !== undefined) {
          throw new Error(`ID already defined: ${id}`);
      }*/
      instance.app._ids[id] = instance;
      instance.id = id;
    }
  },
  onAppInit: function onAppInit(app) {
    Object.defineProperties(app, {
      _ids: {
        value: {},
        writable: true
      },
      getComponentById: {
        value: function value(id) {
          return app._ids[id];
        },
        enumerable: true
      }
    });
  },
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      getComponentById: {
        value: function value(id) {
          return instance.app._ids[id];
        },
        enumerable: true
      },
      getCmp: {
        value: function value(id) {
          return instance.app._ids[id];
        },
        enumerable: true
      }
    });

    if (instance.id !== undefined && instance.props['d:id'] === undefined) {
      this.createId(instance, instance.id);
    }
  },
  onComponentCreate: function onComponentCreate(instance, directiveValue) {
    this.createId(instance, directiveValue);
  },
  onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
    if (typeof obj.id === 'string') {
      this.createId(instance, obj.id);
    }
  },
  onAppComponentDestroy: function onAppComponentDestroy(instance) {
    if (instance.id && instance.app._ids[instance.id]) delete instance.app._ids[instance.id];
  }
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':alias', {
  createAlias: function createAlias(instance, alias) {
    if (typeof alias === 'string') {
      instance.alias = alias;
    }
  },
  onAppInit: function onAppInit(app) {
    Object.defineProperties(app, {
      getComponent: {
        value: function value(alias) {
          return this._tree ? this._tree.children[alias] : undefined;
        },
        enumerable: true
      }
    });
  },
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      getComponent: {
        value: function value(alias) {
          return this.children ? this.children[alias] : undefined;
        },
        enumerable: true
      }
    });
  },
  onComponentCreate: function onComponentCreate(instance, directiveValue) {
    this.createAlias(instance, directiveValue);
  },
  onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
    if (typeof obj.alias === 'string') {
      this.createAlias(instance, obj.alias);
    }
  },
  onAppComponentAssignIndex: function onAppComponentAssignIndex(instance, n) {
    return instance.alias ? instance.alias : n;
  }
});

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':on-$event', {
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      _callback: {
        value: {},
        writable: true
      },
      emit: {
        value: function value(name) {
          if (!instance._callback) return;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          if (typeof instance._callback[name] === 'function') {
            instance._callback[name].apply(instance.parent, args); // legacy for string

          } else if (instance._callback[name] !== undefined && instance.parent[instance._callback[name]] !== undefined && typeof instance.parent[instance._callback[name]] === 'function') {
            instance.parent[instance._callback[name]].apply(instance.parent, args);
          }
        },
        enumerable: true
      }
    });
  },
  onComponentCreate: function onComponentCreate(instance, directiveValue, keyArguments) {
    var source = {};
    source[keyArguments.event] = directiveValue;
    Object.assign(instance._callback, source);
  }
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':onbeforecreate', {
  onComponentBeforeCreate: function onComponentBeforeCreate(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':oncreate', {
  onComponentCreate: function onComponentCreate(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onbeforemount', {
  onComponentBeforeMount: function onComponentBeforeMount(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onmount', {
  onComponentMount: function onComponentMount(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onmountasync', {
  onComponentMountAsync: function onComponentMountAsync(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onafterrender', {
  onComponentAfterRender: function onComponentAfterRender(instance, changes, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance, changes);
    }
  }
});
directive(':onbeforeupdate', {
  onComponentBeforeUpdate: function onComponentBeforeUpdate(instance, changes, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance, changes);
    }
  }
});
directive(':onupdate', {
  onComponentUpdate: function onComponentUpdate(instance, changes, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance, changes);
    }
  }
});
directive(':onbeforeunmount', {
  onComponentBeforeUnmount: function onComponentBeforeUnmount(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onunmount', {
  onComponentUnmount: function onComponentUnmount(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onbeforedestroy', {
  onComponentBeforeDestroy: function onComponentBeforeDestroy(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      return instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':ondestroy', {
  onComponentDestroy: function onComponentDestroy(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});
directive(':onloadprops', {
  onComponentLoadProps: function onComponentLoadProps(instance, directiveValue) {
    if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
      instance.parent[directiveValue].call(instance.parent, instance);
    }
  }
});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

directive('ref', {
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      ref: {
        value: {},
        writable: true,
        enumerable: true
      }
    });
  },
  onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
    instance.ref[directiveValue] = $target;
  }
});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

var dashToCamel = __webpack_require__(8);

directive('is', {
  hasDataIs: function hasDataIs($target) {
    return $target.dataset && $target.dataset.is;
  },
  onAppComponentAssignName: function onAppComponentAssignName(instance, $target) {
    if (this.hasDataIs($target)) return $target.dataset.is;
  },
  onAppComponentPropsAssignName: function onAppComponentPropsAssignName($target, propsName, isDirective) {
    if (this.hasDataIs($target)) return dashToCamel(propsName);
    /*else
        return propsName;*/
  },
  onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
    $target.dataset.is = directiveValue;
    if (!initial) instance._processing.push({
      node: $target,
      action: 'create'
    });
  }
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = __webpack_require__(0),
    directive = _require.directive; //const castStringTo = require('../../../utils/cast-string-to');


var delay = __webpack_require__(3);

directive('bind', {
  // Start directive methods
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      _boundElements: {
        value: {},
        writable: true
      }
    });
  },
  onAppComponentUpdate: function onAppComponentUpdate(instance, changes) {
    if (!Object.keys(instance._boundElements).length) return; //delay(() => {

    this.updateBoundElementsByChanges(instance, changes); //});
  },
  onAppComponentLoadProps: function onAppComponentLoadProps(instance) {
    //delay(() => {
    this.updateBoundElementsByPropsIteration(instance); //});
  },
  onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
    if (!this.canBind($target)) return;
    this.setBind(instance, $target, directiveValue);
  },
  // End directive methods
  // Start custom methods
  canBind: function canBind($target) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1;
  },
  setBind: function setBind(instance, $target, value) {
    var _this2 = this;

    if (instance.props[value] === undefined) return; // Add UI events

    var events = ['compositionstart', 'compositionend', 'input', 'change'];

    var _defined = function _defined(event) {
      $target.addEventListener(event, function (e) {
        var _value;

        if (this.type === 'checkbox') {
          if (!this.defaultValue) instance.props[value] = this.checked;else {
            var inputs = instance.appRoot.querySelectorAll("input[name=".concat(this.name, "][type=checkbox]:checked"));

            var _defined2 = _toConsumableArray(inputs);

            _value = new Array(_defined2.length);

            var _defined3 = function _defined3(input) {
              return input.value;
            };

            for (var _i4 = 0; _i4 <= _defined2.length - 1; _i4++) {
              _value[_i4] = _defined3(_defined2[_i4], _i4, _defined2);
            } //instance.props[value] = castStringTo(_value);


            instance.props[value] = _value;
          }
        } else {
          _value = this.value;

          if (this.multiple) {
            var _defined6 = _toConsumableArray(this.options);

            var _defined7 = function _defined7(option) {
              return option.selected;
            };

            var _defined4 = [];

            for (var _i8 = 0; _i8 <= _defined6.length - 1; _i8++) {
              if (_defined7(_defined6[_i8], _i8, _defined6)) _defined4.push(_defined6[_i8]);
            }

            _value = new Array(_defined4.length);

            var _defined5 = function _defined5(option) {
              return option.value;
            };

            for (var _i6 = 0; _i6 <= _defined4.length - 1; _i6++) {
              _value[_i6] = _defined5(_defined4[_i6], _i6, _defined4);
            }
          } //instance.props[value] = castStringTo(_value);


          instance.props[value] = _value;
        }
      });
    };

    for (var _i2 = 0; _i2 <= events.length - 1; _i2++) {
      _defined(events[_i2], _i2, events);
    } // Map $target element with prop name


    if (instance._boundElements[value] !== undefined) {
      instance._boundElements[value].push($target);
    } else {
      instance._boundElements[value] = [$target];
    } // Set first value
    // Why this delay? because I need to waiting options tag


    delay(function () {
      _this2.updateBoundElement($target, instance.props[value], instance);
    });
  },
  updateBoundElementsByChanges: function updateBoundElementsByChanges(instance, changes) {
    var _this3 = this;

    var _defined8 = function _defined8(item) {
      var value = item.newValue;
      var property = item.property;

      _this3.updateBoundElements(instance, value, property);
    };

    for (var _i10 = 0; _i10 <= changes.length - 1; _i10++) {
      _defined8(changes[_i10], _i10, changes);
    }
  },
  updateBoundElementsByPropsIteration: function updateBoundElementsByPropsIteration(instance) {
    var _this = this;

    (function iterate(props) {
      var keys = Object.keys(props);

      for (var i = 0, l = keys.length; i < l; i++) {
        var property = keys[i];

        if (props[property] instanceof Object && props[property] !== null) {
          iterate(props[property]);
        } else {
          _this.updateBoundElements(instance, props[property], property);
        }
      }
    })(instance._rawProps);
  },
  updateBoundElements: function updateBoundElements(instance, value, property) {
    var _this4 = this;

    if (Object.prototype.hasOwnProperty.call(instance._boundElements, property)) {
      var _defined9 = function _defined9($target) {
        _this4.updateBoundElement($target, value, instance);
      };

      var _defined10 = instance._boundElements[property];

      for (var _i12 = 0; _i12 <= _defined10.length - 1; _i12++) {
        _defined9(_defined10[_i12], _i12, _defined10);
      }
    }
  },
  updateBoundElement: function updateBoundElement($target, value, instance) {
    if ($target.type === 'checkbox') {
      if (!$target.defaultValue) $target.checked = value;else if (Array.isArray(value)) {
        var inputs = instance.appRoot.querySelectorAll("input[name=".concat($target.name, "][type=checkbox]"));

        var _defined11 = function _defined11(input) {
          return input.checked = value.includes(input.value);
        };

        var _defined12 = _toConsumableArray(inputs);

        for (var _i14 = 0; _i14 <= _defined12.length - 1; _i14++) {
          _defined11(_defined12[_i14], _i14, _defined12);
        }
      }
    } else if ($target.type === 'radio') {
      $target.checked = $target.value === value;
    } else if ($target.type === 'select-multiple' && Array.isArray(value)) {
      var _defined13 = function _defined13(option) {
        return option.selected = value.includes(option.value);
      };

      var _defined14 = _toConsumableArray($target.options);

      for (var _i16 = 0; _i16 <= _defined14.length - 1; _i16++) {
        _defined13(_defined14[_i16], _i16, _defined14);
      }
    } else {
      $target.value = value;
    }
  }
});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(0),
    directive = _require.directive;

var _require2 = __webpack_require__(5),
    extractStyleDisplayFromDozProps = _require2.extractStyleDisplayFromDozProps;

var queue = __webpack_require__(72);

var delay = __webpack_require__(3);

function show($target, opt) {}

function hide($target, opt) {}

directive('show', {
  onAppComponentCreate: function onAppComponentCreate(instance) {
    /*Object.defineProperties(instance, {
        show: {
            value: show,
            writable: true,
            enumerable: true
        },
        hide: {
            value: hide,
            writable: true,
            enumerable: true
        }
    });*/
  },
  setVisible: function setVisible($target, value) {
    var thereIsAnimateDirective = $target._dozAttach.__animationDirectiveValue;
    $target._dozAttach.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';
    var lockAnimation = false;

    if ($target._dozAttach.__showInitialValue === undefined) {
      $target._dozAttach.__showInitialValue = value;
      lockAnimation = !value;
    } //$target.__animationWasUsed =
    //console.dir($target);


    if ($target._dozAttach.__prevValueOfShow === value) return;
    $target._dozAttach.__prevValueOfShow = value; //if (thereIsAnimateDirective && !lockAnimation/*&& $target._dozAttach.__prevValueOfShow !== value*/ && $target._dozAttach.__animationWasUsedByShowDirective) {

    if (thereIsAnimateDirective && !lockAnimation) {
      //console.log($target._dozAttach.__animationIsRunning)
      if (!$target._dozAttach.__animationsList) $target._dozAttach.__animationsList = [];
      $target._dozAttach.__animationUsedByShowDirective = true;

      $target._dozAttach.__animationsList.push(function (resolve) {
        //console.log('value', value)
        if (value) {
          $target.style.display = $target._dozAttach.__showOriginDisplay;

          $target._dozAttach.__animationShow(function () {
            $target.style.display = $target._dozAttach.__showOriginDisplay; //$target._dozAttach.__prevValueOfShow = value;

            $target._dozAttach.__animationUsedByShowDirective = false;
            resolve();
          });
        } else {
          $target._dozAttach.__animationHide(function () {
            $target.style.display = 'none'; //$target._dozAttach.__prevValueOfShow = value;

            $target._dozAttach.__animationUsedByShowDirective = false;
            resolve();
          });
        }
      }); //console.log($target._dozAttach.__animationsList)


      if (thereIsAnimateDirective.queue) {
        if (!$target._dozAttach.__animationIsRunning) {
          // please don't use it
          queue($target._dozAttach.__animationsList.shift(), $target._dozAttach.__animationsList);
        }
      } else {
        new Promise($target._dozAttach.__animationsList.shift()).then();
      }
    } else {
      //$target._dozAttach.__prevValueOfShow = value;
      //if (thereIsAnimateDirective)
      //$target._dozAttach.__animationWasUsedByShowDirective = true;/**/
      //delay(() => {
      $target.style.display = !value
      /*=== false*/
      ? 'none' : $target._dozAttach.__showOriginDisplay; //});
    }
  },
  onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
    this.setVisible($target, directiveValue);
  },
  onComponentDOMElementUpdate: function onComponentDOMElementUpdate(instance, $target, directiveValue) {
    this.setVisible($target, directiveValue);
  } // Per il momento gestisco con il virtual dom

  /*onComponentVNodeTick(instance, newNode, oldNode, directiveValue) {
      //console.log('callComponentVNodeTick', newNode.props)
      if (newNode.props['d-animate']) return;
      if (newNode.props.style) {
          if (!directiveValue) {
              newNode.props.style += '; display: none';
          }
      } else {
          newNode.props.style = directiveValue ? 'display: none' : '';
      }
  }*/

});

/***/ }),
/* 72 */
/***/ (function(module, exports) {

function queue(p, arrayOfP) {
  if (!p) return;
  new Promise(p).then(function () {
    return queue(arrayOfP.shift(), arrayOfP);
  });
}

module.exports = queue;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = __webpack_require__(0),
    directive = _require.directive;

var wait = __webpack_require__(74);

var animateHelper = __webpack_require__(75);

directive('animate', {
  onAppComponentCreate: function onAppComponentCreate(instance) {
    Object.defineProperties(instance, {
      animate: {
        value: animateHelper,
        enumerable: true
      },
      elementsWithAnimation: {
        value: new Map(),
        writable: true
      }
    });
  },
  createLockRemoveInstanceByCallback: function createLockRemoveInstanceByCallback(instance) {
    instance.lockRemoveInstanceByCallback = function (callerMethod) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (instance.lockRemoveInstanceByCallbackIsCalled) return;
      instance.lockRemoveInstanceByCallbackIsCalled = true;
      var animationsEnd = [];

      var _iterator = _createForOfIteratorHelper(instance.elementsWithAnimation),
          _step;

      try {
        var _loop = function _loop() {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          var $targetOfMap = key;
          var directiveValueOfMap = value;
          animationsEnd.push(new Promise(function (resolve) {
            if (!document.body.contains($targetOfMap)) return resolve();
            wait(function (cancelWait) {
              if ($targetOfMap._dozAttach.__animationUsedByShowDirective) {
                cancelWait();
                return true;
              }

              return !$targetOfMap._dozAttach.__animationIsRunning;
            }, function () {
              var optAnimation = {
                duration: directiveValueOfMap.hide.duration,
                delay: directiveValueOfMap.hide.delay,
                iterationCount: directiveValueOfMap.hide.iterationCount,
                cb: directiveValueOfMap.hide.cb,
                classLib: directiveValueOfMap.classLib
              };
              instance.animate($targetOfMap, directiveValueOfMap.hide.name, optAnimation, function () {
                $targetOfMap.style.display = 'none';
                resolve();
              });
            }, 1000, function () {
              $targetOfMap._dozAttach.__animationReset();
            });
          }));
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      Promise.all(animationsEnd).then(function () {
        instance.lockRemoveInstanceByCallback = null;
        instance.lockRemoveInstanceByCallbackIsCalled = false;
        callerMethod.apply(instance, args);
      }, function (reason) {
        throw new Error(reason);
      });
    };
  },
  createAnimations: function createAnimations(instance, $target, directiveValue) {
    var _this = this;

    if ($target._dozAttach.__lockedForAnimation) return;
    $target._dozAttach.__lockedForAnimation = true;

    if (typeof directiveValue === 'string') {
      directiveValue = {
        show: directiveValue,
        hide: directiveValue
      };
    }

    $target._dozAttach.__animationDirectiveValue = directiveValue;

    if (directiveValue.show) {
      /**/
      if (_typeof(directiveValue.show) !== 'object') {
        directiveValue.show = {
          name: directiveValue.show
        };
      }

      var optAnimation = {
        duration: directiveValue.show.duration,
        delay: directiveValue.show.delay,
        iterationCount: directiveValue.show.iterationCount,
        cb: directiveValue.show.cb,
        classLib: directiveValue.classLib,
        mode: 'show'
      }; //Add always an useful method for show

      $target._dozAttach.__animationShow = function (cb) {
        return instance.animate($target, directiveValue.show.name, optAnimation, cb);
      };
      /**/
      //(function ($target, directiveValue, instance) {


      wait(function (cancelWait) {
        //console.log($target._dozAttach.__animationIsRunning)
        if ($target._dozAttach.__animationUsedByShowDirective) {
          cancelWait();
          return true;
        }

        return !$target._dozAttach.__animationIsRunning;
      }, function () {
        if (!document.body.contains($target)) return;

        if ($target._dozAttach.__animationOriginDisplay) {
          $target.style.display = $target._dozAttach.__animationOriginDisplay;
        } //Exclude if element is not displayed


        if ($target.style.display === 'none') return;
        instance.animate($target, directiveValue.show.name, optAnimation);
      }, 1000, function () {
        $target._dozAttach.__animationReset();
      }); //})($target, directiveValue, instance);
    }

    if (directiveValue.hide) {
      if (_typeof(directiveValue.hide) !== 'object') {
        directiveValue.hide = {
          name: directiveValue.hide
        };
      }

      var _optAnimation = {
        duration: directiveValue.hide.duration,
        delay: directiveValue.hide.delay,
        iterationCount: directiveValue.hide.iterationCount,
        cb: directiveValue.hide.cb,
        classLib: directiveValue.classLib,
        mode: 'hide'
      }; //Add always an useful method for show

      $target._dozAttach.__animationHide = function (cb) {
        return instance.animate($target, directiveValue.hide.name, _optAnimation, cb);
      };

      this.createLockRemoveInstanceByCallback(instance);
    }

    instance.elementsWithAnimation.set($target, directiveValue);
    setTimeout(function () {
      var _defined = function _defined(i) {
        var childInstance = instance.children[i];
        var $childTarget = childInstance.getHTMLElement();
        var elementAnimation = instance.elementsWithAnimation.get($childTarget);

        if (elementAnimation) {
          if (!childInstance.lockRemoveInstanceByCallback) {
            childInstance.elementsWithAnimation.set($childTarget, elementAnimation);

            _this.createLockRemoveInstanceByCallback(childInstance);
          }
        }
      };

      var _defined2 = Object.keys(instance.children);

      for (var _i3 = 0; _i3 <= _defined2.length - 1; _i3++) {
        _defined(_defined2[_i3], _i3, _defined2);
      }
    });
  },
  onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
    //console.log('onComponentDOMElementCreate', 'animation', $target);
    this.createAnimations(instance, $target, directiveValue);
  },
  onAppComponentMount: function onAppComponentMount(instance) {
    //console.log('onAppComponentMount', 'animation');
    var _iterator2 = _createForOfIteratorHelper(instance.elementsWithAnimation),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            key = _step2$value[0],
            value = _step2$value[1];

        this.createAnimations(instance, key, value);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
});

/***/ }),
/* 74 */
/***/ (function(module, exports) {

window.requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

function wait(what, callback) {
  var maxCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var exceededCallback = arguments.length > 3 ? arguments[3] : undefined;
  var rid;
  var count = 0;

  var cancelWait = function cancelWait() {
    window.cancelAnimationFrame(rid);
    rid = null;
  };

  var check = function check() {
    if (count >= maxCount) {
      console.warn('wait, max cycles exceeded ' + maxCount);
      if (typeof exceededCallback === 'function') exceededCallback();
      return;
    }

    if (!what(cancelWait)) {
      count++;
      rid = window.requestAnimationFrame(check);
    } else {
      if (rid) {
        cancelWait();
        /*window.cancelAnimationFrame(rid);
        rid = null;*/
      }

      callback();
    }
  };

  rid = window.requestAnimationFrame(check);
}

module.exports = wait;

/***/ }),
/* 75 */
/***/ (function(module, exports) {

function animateHelper($target, animationName, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (!opts) {
    opts = {};
  }

  if (opts.mode === 'hide' && $target.style.display === 'none') {
    //console.log('already hidden');
    return;
  }

  if ($target._dozAttach.__animationIsRunning) {
    $target.classList.remove($target._dozAttach.__lastAnimationName);
    $target._dozAttach.__animationIsRunning = false;
    $target._dozAttach.__lockedForAnimation = false;
    $target.removeEventListener('animationend', $target._dozAttach.__handleAnimationEnd);
  }

  $target._dozAttach.__animationIsRunning = true;
  var computedStyle = window.getComputedStyle($target);
  opts.classLib = opts.classLib || 'animated'; //Default animate.css
  // Now supports IE11

  $target.classList.add(opts.classLib);
  $target.classList.add(animationName);
  $target._dozAttach.__lastAnimationName = animationName;
  $target._dozAttach.__animationOriginDisplay = computedStyle.display;

  if ($target._dozAttach.__animationOriginDisplay === 'inline') {
    $target.style.display = 'inline-block';
  }

  if (opts.delay) {
    $target.style.animationDelay = opts.delay;
    $target.style.webkitAnimationDelay = opts.delay;
    $target.style.mozAnimationDelay = opts.delay;
  }

  if (opts.duration) {
    $target.style.animationDuration = opts.duration;
    $target.style.webkitAnimationDuration = opts.duration;
    $target.style.mozAnimationDuration = opts.duration;
  }

  if (opts.iterationCount) {
    $target.style.animationIterationCount = opts.iterationCount;
    $target.style.webkitAnimationIterationCount = opts.iterationCount;
    $target.style.mozAnimationIterationCount = opts.iterationCount;
  }

  function handleAnimationEnd() {
    //console.log('call animation end')
    $target.classList.remove(opts.classLib);
    $target.classList.remove(animationName);
    $target._dozAttach.__animationIsRunning = false;
    $target._dozAttach.__lockedForAnimation = false; //$target.style.display = $target._dozAttach.__animationOriginDisplay;

    $target.style.animationDelay = '';
    $target.style.webkitAnimationDelay = '';
    $target.style.mozAnimationDelay = '';
    $target.style.animationDuration = '';
    $target.style.webkitAnimationDuration = '';
    $target.style.mozAnimationDuration = '';
    $target.style.animationIterationCount = '';
    $target.style.webkitAnimationIterationCount = '';
    $target.style.mozAnimationIterationCount = '';
    $target.removeEventListener('animationend', handleAnimationEnd);
    if (typeof callback === 'function') callback();
    if (typeof opts.cb === 'function') opts.cb();
  } //console.log('set animation end to', $target);
  //console.log('body contains', document.body.contains($target));


  $target.addEventListener('animationend', handleAnimationEnd);
  $target._dozAttach.__handleAnimationEnd = handleAnimationEnd;

  $target._dozAttach.__animationReset = function () {
    return handleAnimationEnd();
  };
}

module.exports = animateHelper;

/***/ })
/******/ ]);
}); 
},{}],"../node_modules/doz-hot-location-reload/index.js":[function(require,module,exports) {
module.exports = function (_module) {
    if (_module.hot) {
        _module.hot.dispose(function () {
            location.reload(true);
            throw new Error('Waiting reload... please do not consider this error :)');
        });
    }
};
},{}],"../node_modules/metaset/dist/index.js":[function(require,module,exports) {
var define;
parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Focm":[function(require,module,exports) {
var e=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=function(){function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window;t(this,n),this.window=e}return e(n,[{key:"query",value:function(e){return this.window.document.head.querySelector(e)}},{key:"createEl",value:function(e){return this.window.document.createElement(e)}},{key:"append",value:function(e){return this.window.document.head.appendChild(e)}},{key:"setTitle",value:function(e){this.window.document.title=e}},{key:"getTitle",value:function(){return this.window.document.title}},{key:"setMeta",value:function(e,t,n){var r=this.query("meta["+e+'="'+t+'"]');r||(r=this.createEl("meta"),this.append(r)),r.setAttribute(e,t),n&&r.setAttribute("content",n)}},{key:"getMeta",value:function(e,t){var n=void 0;if(void 0===t){if(n=this.query("meta["+e+"]"))return n.getAttribute(e)}else if(n=this.query("meta["+e+'="'+t+'"]'))return n.getAttribute("content")}},{key:"setMetaName",value:function(e,t){this.setMeta("name",e,t)}},{key:"getMetaName",value:function(e){return this.getMeta("name",e)}},{key:"setMetaProperty",value:function(e,t){this.setMeta("property",e,t)}},{key:"getMetaProperty",value:function(e){return this.getMeta("property",e)}}]),n}();module.exports=n;
},{}]},{},["Focm"], "Metaset")
},{}],"../node_modules/doz-metatag/index.js":[function(require,module,exports) {
const Metaset = require('metaset');
module.exports = function (Doz, app, options) {

    const defaultOpts = Object.assign({
        title: '',
        type: '',
        description: '',
        url: '',
        siteName: '',
        locale: '',
        image: '',
        selfWindow: window
    }, options);

    function metaTag(opts) {
        opts = Object.assign(defaultOpts, opts);

        const metaset = new Metaset(opts.selfWindow);

        // Title
        if (opts.title) {
            metaset.setTitle(opts.title);
            metaset.setMetaProperty('og:title', opts.title);
        }

        // Description
        if (opts.description) {
            metaset.setMetaName('description', opts.description);
            metaset.setMetaProperty('og:description', opts.description);
        }

        // Type
        if (opts.type)
            metaset.setMetaProperty('og:type', opts.type);

        // Url
        if (opts.url)
            metaset.setMetaProperty('og:url', opts.url);

        // Site name
        if (opts.siteName)
            metaset.setMetaProperty('og:site_name', opts.siteName);

        // Locale
        if (opts.locale)
            metaset.setMetaProperty('og:locale', opts.locale);

        // Image
        if (opts.image)
            metaset.setMetaProperty('og:image', opts.image);

    }

    // Apply to loading
    metaTag();

    // Add to global component
    Doz.mixin({
        metaTag
    });
};

module.exports.metaset = new Metaset();

},{"metaset":"../node_modules/metaset/dist/index.js"}],"../node_modules/doz-ssr/src/constants.js":[function(require,module,exports) {
module.exports = {
    DOZ_GLOBAL: '__DOZ_GLOBAL_COMPONENTS__',
    DOZ_SSR_PATH: '__DOZ_SSR_PATH__'
};
},{}],"../node_modules/doz-ssr/plugin.js":[function(require,module,exports) {
const CONSTANTS = require('./src/constants');

module.exports = function (Doz) {
    Doz.mixin({
        isSSR: function() {
            return Boolean(window[CONSTANTS.DOZ_SSR_PATH]);
        }
    })
};
},{"./src/constants":"../node_modules/doz-ssr/src/constants.js"}],"../client/config/develop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  ENV: 'develop' // here your develop configuration

};
exports.default = _default;
},{}],"../client/config/production.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  ENV: 'production' // here your production configuration

};
exports.default = _default;
},{}],"../client/config/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _develop = _interopRequireDefault(require("./develop"));

var _production = _interopRequireDefault(require("./production"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = _production.default; // The check is on location.href, in this case detect if is localhost

if (/localhost/.test(window.location.href)
/*|| window.__DOZ_SSR_PATH__*/
) {
    config = _develop.default;
  }

var _default = config;
exports.default = _default;
},{"./develop":"../client/config/develop.js","./production":"../client/config/production.js"}],"../node_modules/doz-router/dist/bundle.js":[function(require,module,exports) {
var define;
// [DozRouter]  Build version: 1.8.1  
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("doz"));
	else if(typeof define === 'function' && define.amd)
		define("DozRouter", ["doz"], factory);
	else if(typeof exports === 'object')
		exports["DozRouter"] = factory(require("doz"));
	else
		root["DozRouter"] = factory(root["Doz"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _doz = __webpack_require__(0);

var _doz2 = _interopRequireDefault(_doz);

var _src = __webpack_require__(2);

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// expose component to global scope
function register() {
    if (typeof window !== 'undefined') {
        _doz2.default.component('doz-router', _src2.default);
    }
}

register();

exports.default = _src2.default;


if (false) {}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(3),
    REGEX = _require.REGEX,
    PATH = _require.PATH,
    NS = _require.NS,
    PRERENDER = _require.PRERENDER,
    SSR = _require.SSR,
    LS_LAST_PATH = _require.LS_LAST_PATH;

var queryToObject = __webpack_require__(4);
var clearPath = __webpack_require__(5);
var normalizePath = __webpack_require__(6);
var Doz = __webpack_require__(0);

function deprecate(prev, next) {
    console.warn('[DEPRECATION]', '"' + prev + '" is deprecated use "' + next + '" instead');
}

exports.default = {
    props: {
        hash: '#',
        classActiveLink: 'router-link-active',
        linkAttr: 'data-router-link',
        isLinkAttr: 'data-is-router-link',
        mode: 'hash',
        /**
         * Base root, works only in "history" mode
         */
        root: '/',
        initialRedirect: ''
    },

    autoCreateChildren: false,

    onCreate: function onCreate() {

        //custom properties
        this._currentView = null;
        this._currentViewRaw = '';
        this._currentFullPath = null;
        this._currentPath = null;
        this._routes = [];
        this._paramMap = {};
        this._param = {};
        this._routeNotFound = '';
        this._query = {};
        this._queryRaw = '';
        this._link = {};
        this._pauseHashListener = false;
        this._noDestroy = this.props.hasOwnProperty('noDestroy');
        this._noDestroyedInstances = {};
        this._lastUrl = '';

        if (typeof Doz.mixin === 'function') {
            Doz.mixin({
                router: this
            });
        }

        this._LS_LAST_PATH = this.props.initialRedirectLastKeyName || LS_LAST_PATH;

        if (this.props.hasOwnProperty('initialRedirectLast')) {
            if (window.localStorage && window.localStorage.getItem(this._LS_LAST_PATH)) {
                this._lastUrl = window.localStorage.getItem(this._LS_LAST_PATH);
            }
        }
    },

    /**
     * Remove current view
     */
    removeView: function removeView() {
        if (this._currentView) {
            if (this._noDestroy) {
                var noDestroyInstance = this._currentView.unmount();
                this._noDestroyedInstances[noDestroyInstance.rawChildren[0]] = noDestroyInstance;
            } else {
                this._currentView.destroy();
            }
            this._currentView = null;
        }
    },


    /**
     * Set current view
     * @param view {string} component string
     * @param [cb] {string} callback function name
     * @param [preserve] {boolean} preserve view
     */
    setView: function setView(view, cb, preserve) {

        var sameView = this._currentViewRaw === view;
        if (cb && sameView) {
            var childCmp = this._currentView.children[0];
            var cbFunc = childCmp[cb];
            if (typeof cbFunc === 'function') {
                cbFunc.call(childCmp, this);
            }
        } else if (preserve && sameView) {
            this._currentView.children[0].render();
        } else {
            this.removeView();
            this._currentView = this._noDestroy && this._noDestroyedInstances[view] ? this._noDestroyedInstances[view].mount() : this.mount(view);
        }
        this._currentViewRaw = view;
    },


    /**
     * Get query url
     * @param property {string} property name
     * @returns {*}
     */
    query: function query(property) {
        return this._query[property];
    },


    /**
     * Get param url
     * @param property {string} property name
     * @returns {*}
     */
    param: function param(property) {
        return this._param[property];
    },


    /**
     * Navigate route
     * @param path {string} path to navigate
     * @param [params] {object} optional params
     * @param [forceReplaceState] {boolean}
     */
    navigate: function navigate(path, params, forceReplaceState) {
        if (this.props.mode === 'history') {

            if (window[PRERENDER]) {
                history.pushState(path, null, normalizePath(window[PRERENDER].replace(location.origin, '') + path));
            } else {
                if (forceReplaceState) return history.replaceState(path, null, normalizePath(this.props.root + path));else history.pushState(path, null, normalizePath(this.props.root + path));
            }
            this._navigate(path, params);
        } else {
            this._pauseHashListener = true;
            window.location.href = this.props.hash + path;
            this._navigate(path, params);
            this._pauseHashListener = false;
        }
    },


    /**
     * Returns current path
     * @param full {boolean}
     * @returns {*}
     */
    currentPath: function currentPath() {
        var full = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        return full ? this._currentFullPath : this._currentPath;
    },


    /**
     * Get query url
     * @param property {string} property name
     * @returns {*}
     * @deprecated in favor of query
     */
    $query: function $query(property) {
        deprecate('$query', 'query');
        return this.query(property);
    },


    /**
     * Get param url
     * @param property {string} property name
     * @returns {*}
     * @deprecated in favor of param
     */
    $param: function $param(property) {
        deprecate('$param', 'param');
        return this.param(property);
    },


    /**
     * Navigate route
     * @param args
     * @deprecated in favor of navigate
     */
    $navigate: function $navigate() {
        deprecate('$navigate', 'navigate');

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this.navigate.apply(this, args);
    },


    /**
     * Returns current path
     * @param args
     * @returns {*}
     */
    $currentPath: function $currentPath() {
        deprecate('$currentPath', 'currentPath');

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return this.currentPath.apply(this, args);
    },


    /**
     * Navigate route
     * @param path {string|null} path to navigate
     * @param [params] {object} optional params
     * @param [initial=false] {boolean}
     * @returns {boolean}
     * @ignore
     */
    _navigate: function _navigate(path, params) {
        var _this = this;

        var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var found = false;
        var hashPath = window.location.hash.slice(this.props.hash.length);
        var historyPath = window.location.pathname + window.location.search;
        var fullPath = void 0;
        var originPath = path;

        path = path || hashPath;

        if (this.props.mode === 'history') path = historyPath;

        if (!window[PRERENDER] && !window[SSR]) {
            if ((originPath === '/' || originPath === '' || originPath === null) && initial && this._lastUrl) {
                var _lastUrl = this._lastUrl;
                if (this.props.root && _lastUrl) {
                    var _root = this.props.root.replace(/\//g, '\\/');
                    _lastUrl = _lastUrl.replace(new RegExp('^' + _root, ''), '');
                }
                return this.navigate(_lastUrl);
            }

            if ((path === '/' || path === '') && initial && this.props.initialRedirect) {
                return this.navigate(this.props.initialRedirect);
            }
        }

        path = window[SSR] || path;

        if (window[PRERENDER]) {
            path = (location.origin + path).replace(window[PRERENDER], '');
        }

        path = this.electronFixer(path);

        fullPath = path;

        var pathPart = path.split('?');
        path = clearPath(pathPart[0]);

        if (this._currentFullPath === fullPath) return false;

        this._queryRaw = pathPart[1] || '';

        var re = void 0;

        if ((path === '/' || path === '') && initial && this.props.initialRedirect) {
            path = normalizePath(clearPath(this.props.root) + this.props.initialRedirect);
        }

        for (var i = 0; i < this._routes.length; i++) {
            var route = this._routes[i];

            if (route.path === '*') {
                if (path) {
                    re = new RegExp('.+');
                } else {
                    re = new RegExp('^$');
                }
            } else {
                re = new RegExp('^\/?' + route.path + '$');
            }

            var match = path.match(re);

            if (match) {
                found = true;

                if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
                    this._param = Object.assign({}, params);
                } else {
                    (function () {
                        var param = _this._paramMap[route.path];
                        _this._query = queryToObject(_this._queryRaw);
                        match.slice(1).forEach(function (value, i) {
                            _this._param[param[i]] = value;
                        });
                    })();
                }

                this._currentPath = path;
                this._currentFullPath = fullPath;
                this.setView(route.view, route.cb, route.preserve);
                if (window.localStorage) {
                    window.localStorage.setItem(this._LS_LAST_PATH, fullPath);
                }

                break;
            }
        }

        if (!found) {
            this._currentPath = null;
            this._currentFullPath = null;
            this.setView(this._routeNotFound || '"' + path + '" not found');
        }

        this.activeLink();

        return found;
    },


    /**
     * Active current link
     */
    activeLink: function activeLink() {
        var _this2 = this;

        Object.keys(this._link).forEach(function (link) {
            var checkAlsoQuery = Boolean(_this2._link[link].length > 1 && _this2._queryRaw);

            _this2._link[link].forEach(function (el) {
                var queryEq = true;
                if (checkAlsoQuery) queryEq = new RegExp(_this2._queryRaw + '$', 'g').test(el.href);

                link = _this2.electronFixer(link);

                if (link === _this2._currentPath && queryEq) el.classList.add(_this2.props.classActiveLink);else el.classList.remove(_this2.props.classActiveLink);
            });
        });
    },
    electronFixer: function electronFixer(path) {
        if (location.protocol === 'file:' && path.includes(':')) path = path.substr(3);
        return path;
    },


    /**
     * Add a new route
     * @param route {string} route path
     * @param view {string} component string
     */
    add: function add(route, view) {
        if (route === PATH.NOT_FOUND) {
            this._routeNotFound = view;
        } else {
            var param = [];
            var path = clearPath(route);
            path = path.replace(/:(\w+)/g, function (match, capture) {
                param.push(capture);
                return '([\\w-]+)';
            });

            // Wild card
            path = path.replace(/\/\*/g, '(?:/.*)?');
            this._paramMap[path] = param;

            /*
            let cbChange = view.match(REGEX.CHANGE);
            if (cbChange) {
                cbChange = cbChange[1]
            }
              const preserve = REGEX.IS_PRESERVE.test(view);
            */

            var cbChange = null;
            var preserve = false;

            if (typeof view === 'string') {
                cbChange = view.match(REGEX.CHANGE);
                preserve = REGEX.IS_PRESERVE.test(view);
            } else {
                cbChange = view.props['route-change'];
                preserve = view.props['preserve'];
            }

            if (cbChange) {
                cbChange = cbChange[1];
            }

            this._routes.push({ path: path, view: view, cb: cbChange, preserve: preserve });
        }
    },


    /**
     * Remove a route
     * @param path {string} route path
     */
    remove: function remove(path) {
        for (var i = 0; i < this._routes.length; i++) {
            var route = this._routes[i];
            if (route.path === clearPath(path)) {
                this._routes.splice(i, 1);
            }
        }
    },


    /**
     * Bind all link to routing controller
     */
    bindLink: function bindLink() {
        var _this3 = this;

        window.document.querySelectorAll('[' + this.props.linkAttr + ']:not([' + this.props.isLinkAttr + '])').forEach(function (el) {
            var path = el.pathname || el.href;

            el.dataset.isRouterLink = 'true';

            if (_this3.props.mode === 'history') {

                if (el.pathname) {
                    path = el.pathname = normalizePath(_this3.props.root + el.pathname);
                } else if (el.href) {
                    path = el.href = normalizePath(_this3.props.root + el.href);
                }

                var _path = path + el.search;

                if (window[PRERENDER]) {
                    //el.href = this.props.root + path + el.search;
                } else {
                    el.addEventListener('click', function (e) {
                        e.preventDefault();
                        history.pushState(_path, null, _path);
                        _this3._navigate(_path);
                    });
                }
            } else {
                el.href = _this3.props.hash + path + el.search;
            }

            var pathPart = path.split('?');
            path = clearPath(pathPart[0]);
            if (typeof _this3._link[path] === 'undefined') {
                _this3._link[path] = [el];
            } else {
                _this3._link[path].push(el);
            }
        });
    },
    onAppReady: function onAppReady() {
        var _this4 = this;

        window.removeEventListener('popstate', window[NS.popstate]);
        window[NS.popstate] = function (e) {
            var route = e.state;
            if (route == null && _this4.props.initialRedirect) return _this4.navigate(_this4.props.initialRedirect, {}, true);
            _this4._navigate(route);
        };

        window.removeEventListener('hashchange', window[NS.hashchange]);
        window[NS.hashchange] = function () {
            if (!_this4._pauseHashListener) _this4._navigate();
        };

        window.removeEventListener('DOMContentLoaded', window[NS.DOMContentLoaded]);
        window[NS.DOMContentLoaded] = function () {
            _this4._navigate(null, null, true);
        };

        //console.log(this.rawChildrenObject)

        if (this.rawChildrenObject && this.rawChildrenObject.length) {
            this.rawChildrenObject.forEach(function (view) {
                if (!view || (typeof view === 'undefined' ? 'undefined' : _typeof(view)) !== 'object') return;
                var route = view.props.route;
                //console.log(route, view)
                if (route) {
                    _this4.add(route, view);
                }
            });
        } else {
            this.rawChildren.forEach(function (view) {
                var route = view.match(REGEX.ROUTE);
                if (route) {
                    _this4.add(route[1], view);
                }
            });
        }

        /*
        this.rawChildren.forEach(view => {
            const route = view.match(REGEX.ROUTE);
            if (route) {
                this.add(route[1], view)
            }
        });
        */
        /* console.log(this.rawChildren);
         console.log(this.parent);*/
        //console.log(this.parent._prev.children)
        //console.log(JSON.stringify(this.parent._prev.children, null, 4));

        this.bindLink();

        if (this.props.mode === 'history') {
            window.addEventListener('popstate', window[NS.popstate]);
        } else {
            window.addEventListener('hashchange', window[NS.hashchange]);
        }

        window.addEventListener('DOMContentLoaded', window[NS.DOMContentLoaded]);
    },
    onMountAsync: function onMountAsync() {
        this._navigate(null, null, true);
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    REGEX: {
        ROUTE: /route(?:\s+)?=(?:\s+)?"(.*?)"/,
        CHANGE: /route-change(?:\s+)?=(?:\s+)?"(.*?)"/,
        IS_PRESERVE: /\spreserve[>\s=]/
    },
    PATH: {
        NOT_FOUND: '*'
    },
    NS: {
        hashchange: '___doz_router___hashchangeListener',
        popstate: '___doz_router___popstateListener',
        DOMContentLoaded: '___doz_router___DOMContentLoadedListener'
    },
    PRERENDER: '__DOZ_PRERENDER_PUBLIC_URL__',
    SSR: '__DOZ_SSR_PATH__',
    LS_LAST_PATH: 'dozRouterLastPath'
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (query) {
    var obj = {};
    if (!query) return obj;
    var data = query.split('&');
    for (var i = 0, dataLength = data.length; i < dataLength; i++) {
        var dataPart = data[i].split('=');
        if (dataPart.length) {
            var first = dataPart.splice(0, 1)[0];
            obj[first] = decodeURIComponent(dataPart.join('='));
        }
    }

    return obj;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (path) {
    return path.toString().replace(/\/+$/, '').replace(/^\//, '');
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (path) {
    return path.replace(/\/{2,}/g, '/');
};

/***/ })
/******/ ]);
}); 
},{"doz":"../node_modules/doz/dist/doz.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/animate.css/animate.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/app.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/header/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "AnimationName": "style_AnimationName_7PaJM"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/header/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doz = require("doz");

require("./style.css");

var cfg = {
  template: function template() {
    return "\n            <header>\n                <nav>\n                    <ul>\n                        <li>\n                            <a data-router-link href=\"/\">Home</a>\n                        </li><li>\n                            <a data-router-link href=\"/projects\">Projects</a>\n                        </li><li>\n                            <a data-router-link href=\"/about\">About</a>\n                        </li><li>\n                            <a data-router-link href=\"/contact\">Contact</a>\n                        </li>\n                    </ul>   \n                </nav>\n            </header>\n        ";
  }
};
(0, _doz.component)('app-header', cfg);
var _default = cfg;
exports.default = _default;
},{"doz":"../node_modules/doz/dist/doz.js","./style.css":"../client/cmp/header/style.css"}],"../client/cmp/pages/home/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "slogan": "style_slogan_36JhO",
  "subtitle": "style_subtitle_3VFCI"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/pages/home/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doz = require("doz");

var _style = _interopRequireDefault(require("./style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"animated fadeIn\">\n                 <h1 class=\"", "\">I'm rica.li</h1>\n                 <h2 class=\"", "\">Web developer with passion for the web</h2>\n            </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var cfg = {
  template: function template(h) {
    return h(_templateObject(), _style.default.slogan, _style.default.subtitle);
  }
};
(0, _doz.component)('app-home', cfg);
var _default = cfg;
exports.default = _default;
},{"doz":"../node_modules/doz/dist/doz.js","./style.css":"../client/cmp/pages/home/style.css"}],"../client/cmp/pages/about/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "avatar": "style_avatar_3-Yq0",
  "name": "style_name_1t0HI"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/pages/about/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doz = require("doz");

var _style = _interopRequireDefault(require("./style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"animated fadeIn\">\n                 <h1>About</h1>\n                 <img class=\"", "\" src=\"https://avatars0.githubusercontent.com/u/12598754?s=800\" />\n                 <h3 class=\"", "\">Fabio Ricali</h3>\n                 <p>I work as web developer and web designer since 2003 based in Sicily.<br>I'm a lover of nature, technology and the sky.</p>\n            </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var cfg = {
  template: function template(h) {
    return h(_templateObject(), _style.default.avatar, _style.default.name);
  }
};
(0, _doz.component)('app-about', cfg);
var _default = cfg;
exports.default = _default;
},{"doz":"../node_modules/doz/dist/doz.js","./style.css":"../client/cmp/pages/about/style.css"}],"../client/cmp/pages/projects/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [{
  name: 'Doz',
  url: 'https://doz.js.org/'
}, {
  name: 'BeJS',
  url: 'https://be.js.org/'
}, {
  name: 'Valify',
  url: 'https://github.com/fabioricali/valify'
}, {
  name: 'InCache',
  url: 'https://github.com/fabioricali/incache'
}];
exports.default = _default;
},{}],"../client/cmp/pages/projects/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "list": "style_list_2ubiq"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/pages/projects/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doz = require("doz");

var _list = _interopRequireDefault(require("./list"));

var _style = _interopRequireDefault(require("./style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<li><a href=\"", "\" target=\"_blank\">", "</a></li>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"animated fadeIn\">\n                 <h1>Projects</h1>\n                 <h2>Most important open source projects</h2>\n                 <ul class=\"", "\">\n                 ", "\n                 </ul>\n            </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var cfg = {
  template: function template(h) {
    return h(_templateObject(), _style.default.list, this.each(_list.default, function (item) {
      return h(_templateObject2(), item.url, item.name);
    }));
  }
};
(0, _doz.component)('app-projects', cfg);
var _default = cfg;
exports.default = _default;
},{"doz":"../node_modules/doz/dist/doz.js","./list":"../client/cmp/pages/projects/list.js","./style.css":"../client/cmp/pages/projects/style.css"}],"../client/cmp/pages/contact/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../client/cmp/pages/contact/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doz = require("doz");

var _style = _interopRequireDefault(require("./style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"animated fadeIn\">\n                 <h1>Contact</h1>\n                 <h2>Get in touch or read my code</h2>\n                 <p>\n                    <a href=\"mailto:fabio@rica.li\">fabio@rica.li</a> | \n                    <a href=\"https://www.linkedin.com/in/fabio-ricali-a808b39b/\">Linkedin</a> | \n                    <a href=\"https://github.com/fabioricali\">GitHub</a>\n                </p>\n            </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var cfg = {
  template: function template(h) {
    return h(_templateObject());
  }
};
(0, _doz.component)('app-contact', cfg);
var _default = cfg;
exports.default = _default;
},{"doz":"../node_modules/doz/dist/doz.js","./style.css":"../client/cmp/pages/contact/style.css"}],"../client/app.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime");

var _doz = _interopRequireDefault(require("doz"));

var _dozHotLocationReload = _interopRequireDefault(require("doz-hot-location-reload"));

var _dozMetatag = _interopRequireDefault(require("doz-metatag"));

var _plugin = _interopRequireDefault(require("doz-ssr/plugin"));

var _config = _interopRequireDefault(require("./config"));

require("doz-router");

require("animate.css");

require("./app.css");

require("./cmp/header");

require("./cmp/pages/home");

require("./cmp/pages/about");

require("./cmp/pages/projects");

require("./cmp/pages/contact");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <app-header/>\n            <main>\n                <doz-router mode=\"history\" d:id=\"router\">\n                    <app-home route=\"/\"></app-home>\n                    <app-about route=\"/about\"></app-about>\n                    <app-projects route=\"/projects\"></app-projects>\n                    <app-contact route=\"/contact\"></app-contact>\n                </doz-router>\n            </main>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// This causes the page to reload in the browser
// when there are changes during the development phase
(0, _dozHotLocationReload.default)(module); // Plugin used during Server Side Rendering

_doz.default.use(_plugin.default); // Plugin that changes the meta tags


_doz.default.use(_dozMetatag.default, {
  title: 'Rica.li',
  description: 'Magic development'
}); // Add configuration to all components,
// so it's possible call in this way this.CONFIG.FOO


_doz.default.mixin({
  CONFIG: _config.default
});

new _doz.default({
  root: '#app',
  template: function template(h) {
    return h(_templateObject());
  },
  onCreate: function onCreate() {
    var _this = this;

    // Every time a component is mounted on the DOM,
    // I update the list of links mapped with the "data-router-link" attribute
    this.app.on('componentMountAsync', function () {
      if (_this.router) {
        _this.router.bindLink();
      }
    });
  },
  onMountAsync: function onMountAsync() {
    if (window.SSR) window.SSR.ready();
  }
});
},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js","doz":"../node_modules/doz/dist/doz.js","doz-hot-location-reload":"../node_modules/doz-hot-location-reload/index.js","doz-metatag":"../node_modules/doz-metatag/index.js","doz-ssr/plugin":"../node_modules/doz-ssr/plugin.js","./config":"../client/config/index.js","doz-router":"../node_modules/doz-router/dist/bundle.js","animate.css":"../node_modules/animate.css/animate.css","./app.css":"../client/app.css","./cmp/header":"../client/cmp/header/index.js","./cmp/pages/home":"../client/cmp/pages/home/index.js","./cmp/pages/about":"../client/cmp/pages/about/index.js","./cmp/pages/projects":"../client/cmp/pages/projects/index.js","./cmp/pages/contact":"../client/cmp/pages/contact/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58379" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../client/app.js"], null)
//# sourceMappingURL=/app.ae5cf8ca.js.map