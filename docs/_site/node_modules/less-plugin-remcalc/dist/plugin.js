(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _functions = __webpack_require__(1);

	var _functions2 = _interopRequireDefault(_functions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    install: function install(less) {
	        less.functions.functionRegistry.addMultiple((0, _functions2.default)(less));
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (less) {
	    var registry = less.functions.functionRegistry;
	    var Dimension = less.tree.Dimension;

	    return {
	        'rem-base': function remBase(base) {
	            if (!base) {
	                return less.data['rem-base'] || new Dimension(16, 'px');
	            }
	            base = new Dimension(registry.get('unit')(base).value, 'px');
	            less.data['rem-base'] = base;

	            return base;
	        },
	        'rem-calc': function remCalc(value, base) {
	            base = base || registry.get('rem-base')();
	            var baseUnit = registry.get('get-unit')(base).value.backupUnit;
	            base = registry.get('unit')(base).value;

	            if (baseUnit === '%') {
	                base = base / 100 * 16;
	            }

	            if (baseUnit === 'rem') {
	                base *= 16;
	            }

	            if (baseUnit === 'em') {
	                base *= 16;
	            }

	            if (!value) {
	                return new Dimension(0);
	            }

	            var calculus = parseFloat((value.value / base).toFixed(3));

	            return new Dimension(calculus, 'rem');
	        }
	    };
	};

	module.exports = exports['default'];

/***/ }
/******/ ])));