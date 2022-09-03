import * as In from "react";
import gn, { useRef as tn, useState as hr, useMemo as Ht, useEffect as on, useLayoutEffect as Om, forwardRef as Am, useCallback as wt, useContext as an, createContext as lh } from "react";
import ch, { unstable_batchedUpdates as km } from "react-dom";
var xi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Vo(e) {
  var t = e.default;
  if (typeof t == "function") {
    var n = function() {
      return t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var ke = { exports: {} }, xs = { exports: {} }, Rt = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Af;
function $m() {
  if (Af)
    return Rt;
  Af = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, T = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, F = e ? Symbol.for("react.scope") : 60119;
  function N(M) {
    if (typeof M == "object" && M !== null) {
      var D = M.$$typeof;
      switch (D) {
        case t:
          switch (M = M.type, M) {
            case f:
            case c:
            case r:
            case o:
            case i:
            case p:
              return M;
            default:
              switch (M = M && M.$$typeof, M) {
                case u:
                case h:
                case _:
                case P:
                case a:
                  return M;
                default:
                  return D;
              }
          }
        case n:
          return D;
      }
    }
  }
  function G(M) {
    return N(M) === c;
  }
  return Rt.AsyncMode = f, Rt.ConcurrentMode = c, Rt.ContextConsumer = u, Rt.ContextProvider = a, Rt.Element = t, Rt.ForwardRef = h, Rt.Fragment = r, Rt.Lazy = _, Rt.Memo = P, Rt.Portal = n, Rt.Profiler = o, Rt.StrictMode = i, Rt.Suspense = p, Rt.isAsyncMode = function(M) {
    return G(M) || N(M) === f;
  }, Rt.isConcurrentMode = G, Rt.isContextConsumer = function(M) {
    return N(M) === u;
  }, Rt.isContextProvider = function(M) {
    return N(M) === a;
  }, Rt.isElement = function(M) {
    return typeof M == "object" && M !== null && M.$$typeof === t;
  }, Rt.isForwardRef = function(M) {
    return N(M) === h;
  }, Rt.isFragment = function(M) {
    return N(M) === r;
  }, Rt.isLazy = function(M) {
    return N(M) === _;
  }, Rt.isMemo = function(M) {
    return N(M) === P;
  }, Rt.isPortal = function(M) {
    return N(M) === n;
  }, Rt.isProfiler = function(M) {
    return N(M) === o;
  }, Rt.isStrictMode = function(M) {
    return N(M) === i;
  }, Rt.isSuspense = function(M) {
    return N(M) === p;
  }, Rt.isValidElementType = function(M) {
    return typeof M == "string" || typeof M == "function" || M === r || M === c || M === o || M === i || M === p || M === w || typeof M == "object" && M !== null && (M.$$typeof === _ || M.$$typeof === P || M.$$typeof === a || M.$$typeof === u || M.$$typeof === h || M.$$typeof === I || M.$$typeof === k || M.$$typeof === F || M.$$typeof === T);
  }, Rt.typeOf = N, Rt;
}
var Ct = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kf;
function Fm() {
  return kf || (kf = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, T = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, F = e ? Symbol.for("react.scope") : 60119;
    function N(B) {
      return typeof B == "string" || typeof B == "function" || B === r || B === c || B === o || B === i || B === p || B === w || typeof B == "object" && B !== null && (B.$$typeof === _ || B.$$typeof === P || B.$$typeof === a || B.$$typeof === u || B.$$typeof === h || B.$$typeof === I || B.$$typeof === k || B.$$typeof === F || B.$$typeof === T);
    }
    function G(B) {
      if (typeof B == "object" && B !== null) {
        var gt = B.$$typeof;
        switch (gt) {
          case t:
            var ct = B.type;
            switch (ct) {
              case f:
              case c:
              case r:
              case o:
              case i:
              case p:
                return ct;
              default:
                var _t = ct && ct.$$typeof;
                switch (_t) {
                  case u:
                  case h:
                  case _:
                  case P:
                  case a:
                    return _t;
                  default:
                    return gt;
                }
            }
          case n:
            return gt;
        }
      }
    }
    var M = f, D = c, te = u, Q = a, fe = t, ge = h, re = r, ee = _, be = P, Oe = n, ut = o, Ue = i, st = p, lt = !1;
    function dt(B) {
      return lt || (lt = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), V(B) || G(B) === f;
    }
    function V(B) {
      return G(B) === c;
    }
    function ue(B) {
      return G(B) === u;
    }
    function Te(B) {
      return G(B) === a;
    }
    function Ae(B) {
      return typeof B == "object" && B !== null && B.$$typeof === t;
    }
    function Ce(B) {
      return G(B) === h;
    }
    function Re(B) {
      return G(B) === r;
    }
    function Ne(B) {
      return G(B) === _;
    }
    function Be(B) {
      return G(B) === P;
    }
    function Le(B) {
      return G(B) === n;
    }
    function X(B) {
      return G(B) === o;
    }
    function ce(B) {
      return G(B) === i;
    }
    function Ge(B) {
      return G(B) === p;
    }
    Ct.AsyncMode = M, Ct.ConcurrentMode = D, Ct.ContextConsumer = te, Ct.ContextProvider = Q, Ct.Element = fe, Ct.ForwardRef = ge, Ct.Fragment = re, Ct.Lazy = ee, Ct.Memo = be, Ct.Portal = Oe, Ct.Profiler = ut, Ct.StrictMode = Ue, Ct.Suspense = st, Ct.isAsyncMode = dt, Ct.isConcurrentMode = V, Ct.isContextConsumer = ue, Ct.isContextProvider = Te, Ct.isElement = Ae, Ct.isForwardRef = Ce, Ct.isFragment = Re, Ct.isLazy = Ne, Ct.isMemo = Be, Ct.isPortal = Le, Ct.isProfiler = X, Ct.isStrictMode = ce, Ct.isSuspense = Ge, Ct.isValidElementType = N, Ct.typeOf = G;
  }()), Ct;
}
var $f;
function fh() {
  return $f || ($f = 1, function(e) {
    process.env.NODE_ENV === "production" ? e.exports = $m() : e.exports = Fm();
  }(xs)), xs.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var _s, Ff;
function lc() {
  if (Ff)
    return _s;
  Ff = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function r(o) {
    if (o == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(o);
  }
  function i() {
    try {
      if (!Object.assign)
        return !1;
      var o = new String("abc");
      if (o[5] = "de", Object.getOwnPropertyNames(o)[0] === "5")
        return !1;
      for (var a = {}, u = 0; u < 10; u++)
        a["_" + String.fromCharCode(u)] = u;
      var f = Object.getOwnPropertyNames(a).map(function(h) {
        return a[h];
      });
      if (f.join("") !== "0123456789")
        return !1;
      var c = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(h) {
        c[h] = h;
      }), Object.keys(Object.assign({}, c)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return _s = i() ? Object.assign : function(o, a) {
    for (var u, f = r(o), c, h = 1; h < arguments.length; h++) {
      u = Object(arguments[h]);
      for (var p in u)
        t.call(u, p) && (f[p] = u[p]);
      if (e) {
        c = e(u);
        for (var w = 0; w < c.length; w++)
          n.call(u, c[w]) && (f[c[w]] = u[c[w]]);
      }
    }
    return f;
  }, _s;
}
var Ss, If;
function cc() {
  if (If)
    return Ss;
  If = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Ss = e, Ss;
}
var Rs, Bf;
function dh() {
  return Bf || (Bf = 1, Rs = Function.call.bind(Object.prototype.hasOwnProperty)), Rs;
}
var Cs, Df;
function Im() {
  if (Df)
    return Cs;
  Df = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = cc(), n = {}, r = dh();
    e = function(o) {
      var a = "Warning: " + o;
      typeof console < "u" && console.error(a);
      try {
        throw new Error(a);
      } catch {
      }
    };
  }
  function i(o, a, u, f, c) {
    if (process.env.NODE_ENV !== "production") {
      for (var h in o)
        if (r(o, h)) {
          var p;
          try {
            if (typeof o[h] != "function") {
              var w = Error(
                (f || "React class") + ": " + u + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof o[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw w.name = "Invariant Violation", w;
            }
            p = o[h](a, h, f, u, null, t);
          } catch (_) {
            p = _;
          }
          if (p && !(p instanceof Error) && e(
            (f || "React class") + ": type specification of " + u + " `" + h + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof p + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), p instanceof Error && !(p.message in n)) {
            n[p.message] = !0;
            var P = c ? c() : "";
            e(
              "Failed " + u + " type: " + p.message + (P != null ? P : "")
            );
          }
        }
    }
  }
  return i.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, Cs = i, Cs;
}
var Ps, zf;
function Bm() {
  if (zf)
    return Ps;
  zf = 1;
  var e = fh(), t = lc(), n = cc(), r = dh(), i = Im(), o = function() {
  };
  process.env.NODE_ENV !== "production" && (o = function(u) {
    var f = "Warning: " + u;
    typeof console < "u" && console.error(f);
    try {
      throw new Error(f);
    } catch {
    }
  });
  function a() {
    return null;
  }
  return Ps = function(u, f) {
    var c = typeof Symbol == "function" && Symbol.iterator, h = "@@iterator";
    function p(V) {
      var ue = V && (c && V[c] || V[h]);
      if (typeof ue == "function")
        return ue;
    }
    var w = "<<anonymous>>", P = {
      array: k("array"),
      bigint: k("bigint"),
      bool: k("boolean"),
      func: k("function"),
      number: k("number"),
      object: k("object"),
      string: k("string"),
      symbol: k("symbol"),
      any: F(),
      arrayOf: N,
      element: G(),
      elementType: M(),
      instanceOf: D,
      node: ge(),
      objectOf: Q,
      oneOf: te,
      oneOfType: fe,
      shape: ee,
      exact: be
    };
    function _(V, ue) {
      return V === ue ? V !== 0 || 1 / V === 1 / ue : V !== V && ue !== ue;
    }
    function T(V, ue) {
      this.message = V, this.data = ue && typeof ue == "object" ? ue : {}, this.stack = "";
    }
    T.prototype = Error.prototype;
    function I(V) {
      if (process.env.NODE_ENV !== "production")
        var ue = {}, Te = 0;
      function Ae(Re, Ne, Be, Le, X, ce, Ge) {
        if (Le = Le || w, ce = ce || Be, Ge !== n) {
          if (f) {
            var B = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw B.name = "Invariant Violation", B;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var gt = Le + ":" + Be;
            !ue[gt] && Te < 3 && (o(
              "You are manually calling a React.PropTypes validation function for the `" + ce + "` prop on `" + Le + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), ue[gt] = !0, Te++);
          }
        }
        return Ne[Be] == null ? Re ? Ne[Be] === null ? new T("The " + X + " `" + ce + "` is marked as required " + ("in `" + Le + "`, but its value is `null`.")) : new T("The " + X + " `" + ce + "` is marked as required in " + ("`" + Le + "`, but its value is `undefined`.")) : null : V(Ne, Be, Le, X, ce);
      }
      var Ce = Ae.bind(null, !1);
      return Ce.isRequired = Ae.bind(null, !0), Ce;
    }
    function k(V) {
      function ue(Te, Ae, Ce, Re, Ne, Be) {
        var Le = Te[Ae], X = Ue(Le);
        if (X !== V) {
          var ce = st(Le);
          return new T(
            "Invalid " + Re + " `" + Ne + "` of type " + ("`" + ce + "` supplied to `" + Ce + "`, expected ") + ("`" + V + "`."),
            { expectedType: V }
          );
        }
        return null;
      }
      return I(ue);
    }
    function F() {
      return I(a);
    }
    function N(V) {
      function ue(Te, Ae, Ce, Re, Ne) {
        if (typeof V != "function")
          return new T("Property `" + Ne + "` of component `" + Ce + "` has invalid PropType notation inside arrayOf.");
        var Be = Te[Ae];
        if (!Array.isArray(Be)) {
          var Le = Ue(Be);
          return new T("Invalid " + Re + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an array."));
        }
        for (var X = 0; X < Be.length; X++) {
          var ce = V(Be, X, Ce, Re, Ne + "[" + X + "]", n);
          if (ce instanceof Error)
            return ce;
        }
        return null;
      }
      return I(ue);
    }
    function G() {
      function V(ue, Te, Ae, Ce, Re) {
        var Ne = ue[Te];
        if (!u(Ne)) {
          var Be = Ue(Ne);
          return new T("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Be + "` supplied to `" + Ae + "`, expected a single ReactElement."));
        }
        return null;
      }
      return I(V);
    }
    function M() {
      function V(ue, Te, Ae, Ce, Re) {
        var Ne = ue[Te];
        if (!e.isValidElementType(Ne)) {
          var Be = Ue(Ne);
          return new T("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Be + "` supplied to `" + Ae + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return I(V);
    }
    function D(V) {
      function ue(Te, Ae, Ce, Re, Ne) {
        if (!(Te[Ae] instanceof V)) {
          var Be = V.name || w, Le = dt(Te[Ae]);
          return new T("Invalid " + Re + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected ") + ("instance of `" + Be + "`."));
        }
        return null;
      }
      return I(ue);
    }
    function te(V) {
      if (!Array.isArray(V))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? o(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : o("Invalid argument supplied to oneOf, expected an array.")), a;
      function ue(Te, Ae, Ce, Re, Ne) {
        for (var Be = Te[Ae], Le = 0; Le < V.length; Le++)
          if (_(Be, V[Le]))
            return null;
        var X = JSON.stringify(V, function(Ge, B) {
          var gt = st(B);
          return gt === "symbol" ? String(B) : B;
        });
        return new T("Invalid " + Re + " `" + Ne + "` of value `" + String(Be) + "` " + ("supplied to `" + Ce + "`, expected one of " + X + "."));
      }
      return I(ue);
    }
    function Q(V) {
      function ue(Te, Ae, Ce, Re, Ne) {
        if (typeof V != "function")
          return new T("Property `" + Ne + "` of component `" + Ce + "` has invalid PropType notation inside objectOf.");
        var Be = Te[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new T("Invalid " + Re + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an object."));
        for (var X in Be)
          if (r(Be, X)) {
            var ce = V(Be, X, Ce, Re, Ne + "." + X, n);
            if (ce instanceof Error)
              return ce;
          }
        return null;
      }
      return I(ue);
    }
    function fe(V) {
      if (!Array.isArray(V))
        return process.env.NODE_ENV !== "production" && o("Invalid argument supplied to oneOfType, expected an instance of array."), a;
      for (var ue = 0; ue < V.length; ue++) {
        var Te = V[ue];
        if (typeof Te != "function")
          return o(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + lt(Te) + " at index " + ue + "."
          ), a;
      }
      function Ae(Ce, Re, Ne, Be, Le) {
        for (var X = [], ce = 0; ce < V.length; ce++) {
          var Ge = V[ce], B = Ge(Ce, Re, Ne, Be, Le, n);
          if (B == null)
            return null;
          B.data && r(B.data, "expectedType") && X.push(B.data.expectedType);
        }
        var gt = X.length > 0 ? ", expected one of type [" + X.join(", ") + "]" : "";
        return new T("Invalid " + Be + " `" + Le + "` supplied to " + ("`" + Ne + "`" + gt + "."));
      }
      return I(Ae);
    }
    function ge() {
      function V(ue, Te, Ae, Ce, Re) {
        return Oe(ue[Te]) ? null : new T("Invalid " + Ce + " `" + Re + "` supplied to " + ("`" + Ae + "`, expected a ReactNode."));
      }
      return I(V);
    }
    function re(V, ue, Te, Ae, Ce) {
      return new T(
        (V || "React class") + ": " + ue + " type `" + Te + "." + Ae + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + Ce + "`."
      );
    }
    function ee(V) {
      function ue(Te, Ae, Ce, Re, Ne) {
        var Be = Te[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new T("Invalid " + Re + " `" + Ne + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        for (var X in V) {
          var ce = V[X];
          if (typeof ce != "function")
            return re(Ce, Re, Ne, X, st(ce));
          var Ge = ce(Be, X, Ce, Re, Ne + "." + X, n);
          if (Ge)
            return Ge;
        }
        return null;
      }
      return I(ue);
    }
    function be(V) {
      function ue(Te, Ae, Ce, Re, Ne) {
        var Be = Te[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new T("Invalid " + Re + " `" + Ne + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        var X = t({}, Te[Ae], V);
        for (var ce in X) {
          var Ge = V[ce];
          if (r(V, ce) && typeof Ge != "function")
            return re(Ce, Re, Ne, ce, st(Ge));
          if (!Ge)
            return new T(
              "Invalid " + Re + " `" + Ne + "` key `" + ce + "` supplied to `" + Ce + "`.\nBad object: " + JSON.stringify(Te[Ae], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(V), null, "  ")
            );
          var B = Ge(Be, ce, Ce, Re, Ne + "." + ce, n);
          if (B)
            return B;
        }
        return null;
      }
      return I(ue);
    }
    function Oe(V) {
      switch (typeof V) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !V;
        case "object":
          if (Array.isArray(V))
            return V.every(Oe);
          if (V === null || u(V))
            return !0;
          var ue = p(V);
          if (ue) {
            var Te = ue.call(V), Ae;
            if (ue !== V.entries) {
              for (; !(Ae = Te.next()).done; )
                if (!Oe(Ae.value))
                  return !1;
            } else
              for (; !(Ae = Te.next()).done; ) {
                var Ce = Ae.value;
                if (Ce && !Oe(Ce[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function ut(V, ue) {
      return V === "symbol" ? !0 : ue ? ue["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && ue instanceof Symbol : !1;
    }
    function Ue(V) {
      var ue = typeof V;
      return Array.isArray(V) ? "array" : V instanceof RegExp ? "object" : ut(ue, V) ? "symbol" : ue;
    }
    function st(V) {
      if (typeof V > "u" || V === null)
        return "" + V;
      var ue = Ue(V);
      if (ue === "object") {
        if (V instanceof Date)
          return "date";
        if (V instanceof RegExp)
          return "regexp";
      }
      return ue;
    }
    function lt(V) {
      var ue = st(V);
      switch (ue) {
        case "array":
        case "object":
          return "an " + ue;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + ue;
        default:
          return ue;
      }
    }
    function dt(V) {
      return !V.constructor || !V.constructor.name ? w : V.constructor.name;
    }
    return P.checkPropTypes = i, P.resetWarningCache = i.resetWarningCache, P.PropTypes = P, P;
  }, Ps;
}
var Ts, Lf;
function Dm() {
  if (Lf)
    return Ts;
  Lf = 1;
  var e = cc();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, Ts = function() {
    function r(a, u, f, c, h, p) {
      if (p !== e) {
        var w = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw w.name = "Invariant Violation", w;
      }
    }
    r.isRequired = r;
    function i() {
      return r;
    }
    var o = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: i,
      element: r,
      elementType: r,
      instanceOf: i,
      node: r,
      objectOf: i,
      oneOf: i,
      oneOfType: i,
      shape: i,
      exact: i,
      checkPropTypes: n,
      resetWarningCache: t
    };
    return o.PropTypes = o, o;
  }, Ts;
}
if (process.env.NODE_ENV !== "production") {
  var zm = fh(), Lm = !0;
  ke.exports = Bm()(zm.isElement, Lm);
} else
  ke.exports = Dm()();
var fc = { exports: {} }, ro = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gf;
function Gm() {
  if (Gf)
    return ro;
  if (Gf = 1, lc(), ro.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var e = Symbol.for;
    ro.Fragment = e("react.fragment");
  }
  return ro.jsxDEV = void 0, ro;
}
var Ns = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jf;
function jm() {
  return jf || (jf = 1, function(e) {
    process.env.NODE_ENV !== "production" && function() {
      var t = gn, n = lc(), r = 60103, i = 60106;
      e.Fragment = 60107;
      var o = 60108, a = 60114, u = 60109, f = 60110, c = 60112, h = 60113, p = 60120, w = 60115, P = 60116, _ = 60121, T = 60122, I = 60117, k = 60129, F = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var N = Symbol.for;
        r = N("react.element"), i = N("react.portal"), e.Fragment = N("react.fragment"), o = N("react.strict_mode"), a = N("react.profiler"), u = N("react.provider"), f = N("react.context"), c = N("react.forward_ref"), h = N("react.suspense"), p = N("react.suspense_list"), w = N("react.memo"), P = N("react.lazy"), _ = N("react.block"), T = N("react.server.block"), I = N("react.fundamental"), N("react.scope"), N("react.opaque.id"), k = N("react.debug_trace_mode"), N("react.offscreen"), F = N("react.legacy_hidden");
      }
      var G = typeof Symbol == "function" && Symbol.iterator, M = "@@iterator";
      function D(O) {
        if (O === null || typeof O != "object")
          return null;
        var J = G && O[G] || O[M];
        return typeof J == "function" ? J : null;
      }
      var te = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function Q(O) {
        {
          for (var J = arguments.length, he = new Array(J > 1 ? J - 1 : 0), ze = 1; ze < J; ze++)
            he[ze - 1] = arguments[ze];
          fe("error", O, he);
        }
      }
      function fe(O, J, he) {
        {
          var ze = te.ReactDebugCurrentFrame, pt = ze.getStackAddendum();
          pt !== "" && (J += "%s", he = he.concat([pt]));
          var mt = he.map(function(ot) {
            return "" + ot;
          });
          mt.unshift("Warning: " + J), Function.prototype.apply.call(console[O], console, mt);
        }
      }
      var ge = !1;
      function re(O) {
        return !!(typeof O == "string" || typeof O == "function" || O === e.Fragment || O === a || O === k || O === o || O === h || O === p || O === F || ge || typeof O == "object" && O !== null && (O.$$typeof === P || O.$$typeof === w || O.$$typeof === u || O.$$typeof === f || O.$$typeof === c || O.$$typeof === I || O.$$typeof === _ || O[0] === T));
      }
      function ee(O, J, he) {
        var ze = J.displayName || J.name || "";
        return O.displayName || (ze !== "" ? he + "(" + ze + ")" : he);
      }
      function be(O) {
        return O.displayName || "Context";
      }
      function Oe(O) {
        if (O == null)
          return null;
        if (typeof O.tag == "number" && Q("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof O == "function")
          return O.displayName || O.name || null;
        if (typeof O == "string")
          return O;
        switch (O) {
          case e.Fragment:
            return "Fragment";
          case i:
            return "Portal";
          case a:
            return "Profiler";
          case o:
            return "StrictMode";
          case h:
            return "Suspense";
          case p:
            return "SuspenseList";
        }
        if (typeof O == "object")
          switch (O.$$typeof) {
            case f:
              var J = O;
              return be(J) + ".Consumer";
            case u:
              var he = O;
              return be(he._context) + ".Provider";
            case c:
              return ee(O, O.render, "ForwardRef");
            case w:
              return Oe(O.type);
            case _:
              return Oe(O._render);
            case P: {
              var ze = O, pt = ze._payload, mt = ze._init;
              try {
                return Oe(mt(pt));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var ut = 0, Ue, st, lt, dt, V, ue, Te;
      function Ae() {
      }
      Ae.__reactDisabledLog = !0;
      function Ce() {
        {
          if (ut === 0) {
            Ue = console.log, st = console.info, lt = console.warn, dt = console.error, V = console.group, ue = console.groupCollapsed, Te = console.groupEnd;
            var O = {
              configurable: !0,
              enumerable: !0,
              value: Ae,
              writable: !0
            };
            Object.defineProperties(console, {
              info: O,
              log: O,
              warn: O,
              error: O,
              group: O,
              groupCollapsed: O,
              groupEnd: O
            });
          }
          ut++;
        }
      }
      function Re() {
        {
          if (ut--, ut === 0) {
            var O = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: n({}, O, {
                value: Ue
              }),
              info: n({}, O, {
                value: st
              }),
              warn: n({}, O, {
                value: lt
              }),
              error: n({}, O, {
                value: dt
              }),
              group: n({}, O, {
                value: V
              }),
              groupCollapsed: n({}, O, {
                value: ue
              }),
              groupEnd: n({}, O, {
                value: Te
              })
            });
          }
          ut < 0 && Q("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Ne = te.ReactCurrentDispatcher, Be;
      function Le(O, J, he) {
        {
          if (Be === void 0)
            try {
              throw Error();
            } catch (pt) {
              var ze = pt.stack.trim().match(/\n( *(at )?)/);
              Be = ze && ze[1] || "";
            }
          return `
` + Be + O;
        }
      }
      var X = !1, ce;
      {
        var Ge = typeof WeakMap == "function" ? WeakMap : Map;
        ce = new Ge();
      }
      function B(O, J) {
        if (!O || X)
          return "";
        {
          var he = ce.get(O);
          if (he !== void 0)
            return he;
        }
        var ze;
        X = !0;
        var pt = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var mt;
        mt = Ne.current, Ne.current = null, Ce();
        try {
          if (J) {
            var ot = function() {
              throw Error();
            };
            if (Object.defineProperty(ot.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ot, []);
              } catch (ln) {
                ze = ln;
              }
              Reflect.construct(O, [], ot);
            } else {
              try {
                ot.call();
              } catch (ln) {
                ze = ln;
              }
              O.call(ot.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (ln) {
              ze = ln;
            }
            O();
          }
        } catch (ln) {
          if (ln && ze && typeof ln.stack == "string") {
            for (var rt = ln.stack.split(`
`), At = ze.stack.split(`
`), Pt = rt.length - 1, Et = At.length - 1; Pt >= 1 && Et >= 0 && rt[Pt] !== At[Et]; )
              Et--;
            for (; Pt >= 1 && Et >= 0; Pt--, Et--)
              if (rt[Pt] !== At[Et]) {
                if (Pt !== 1 || Et !== 1)
                  do
                    if (Pt--, Et--, Et < 0 || rt[Pt] !== At[Et]) {
                      var pn = `
` + rt[Pt].replace(" at new ", " at ");
                      return typeof O == "function" && ce.set(O, pn), pn;
                    }
                  while (Pt >= 1 && Et >= 0);
                break;
              }
          }
        } finally {
          X = !1, Ne.current = mt, Re(), Error.prepareStackTrace = pt;
        }
        var Un = O ? O.displayName || O.name : "", Hr = Un ? Le(Un) : "";
        return typeof O == "function" && ce.set(O, Hr), Hr;
      }
      function gt(O, J, he) {
        return B(O, !1);
      }
      function ct(O) {
        var J = O.prototype;
        return !!(J && J.isReactComponent);
      }
      function _t(O, J, he) {
        if (O == null)
          return "";
        if (typeof O == "function")
          return B(O, ct(O));
        if (typeof O == "string")
          return Le(O);
        switch (O) {
          case h:
            return Le("Suspense");
          case p:
            return Le("SuspenseList");
        }
        if (typeof O == "object")
          switch (O.$$typeof) {
            case c:
              return gt(O.render);
            case w:
              return _t(O.type, J, he);
            case _:
              return gt(O._render);
            case P: {
              var ze = O, pt = ze._payload, mt = ze._init;
              try {
                return _t(mt(pt), J, he);
              } catch {
              }
            }
          }
        return "";
      }
      var Ot = {}, Qt = te.ReactDebugCurrentFrame;
      function un(O) {
        if (O) {
          var J = O._owner, he = _t(O.type, O._source, J ? J.type : null);
          Qt.setExtraStackFrame(he);
        } else
          Qt.setExtraStackFrame(null);
      }
      function yn(O, J, he, ze, pt) {
        {
          var mt = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var ot in O)
            if (mt(O, ot)) {
              var rt = void 0;
              try {
                if (typeof O[ot] != "function") {
                  var At = Error((ze || "React class") + ": " + he + " type `" + ot + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof O[ot] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw At.name = "Invariant Violation", At;
                }
                rt = O[ot](J, ot, ze, he, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Pt) {
                rt = Pt;
              }
              rt && !(rt instanceof Error) && (un(pt), Q("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ze || "React class", he, ot, typeof rt), un(null)), rt instanceof Error && !(rt.message in Ot) && (Ot[rt.message] = !0, un(pt), Q("Failed %s type: %s", he, rt.message), un(null));
            }
        }
      }
      var bn = te.ReactCurrentOwner, wn = Object.prototype.hasOwnProperty, zn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, rr, Ln, xn;
      xn = {};
      function qt(O) {
        if (wn.call(O, "ref")) {
          var J = Object.getOwnPropertyDescriptor(O, "ref").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.ref !== void 0;
      }
      function Mn(O) {
        if (wn.call(O, "key")) {
          var J = Object.getOwnPropertyDescriptor(O, "key").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.key !== void 0;
      }
      function ir(O, J) {
        if (typeof O.ref == "string" && bn.current && J && bn.current.stateNode !== J) {
          var he = Oe(bn.current.type);
          xn[he] || (Q('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Oe(bn.current.type), O.ref), xn[he] = !0);
        }
      }
      function mr(O, J) {
        {
          var he = function() {
            rr || (rr = !0, Q("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          he.isReactWarning = !0, Object.defineProperty(O, "key", {
            get: he,
            configurable: !0
          });
        }
      }
      function yr(O, J) {
        {
          var he = function() {
            Ln || (Ln = !0, Q("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          he.isReactWarning = !0, Object.defineProperty(O, "ref", {
            get: he,
            configurable: !0
          });
        }
      }
      var or = function(O, J, he, ze, pt, mt, ot) {
        var rt = {
          $$typeof: r,
          type: O,
          key: J,
          ref: he,
          props: ot,
          _owner: mt
        };
        return rt._store = {}, Object.defineProperty(rt._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(rt, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ze
        }), Object.defineProperty(rt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: pt
        }), Object.freeze && (Object.freeze(rt.props), Object.freeze(rt)), rt;
      };
      function br(O, J, he, ze, pt) {
        {
          var mt, ot = {}, rt = null, At = null;
          he !== void 0 && (rt = "" + he), Mn(J) && (rt = "" + J.key), qt(J) && (At = J.ref, ir(J, pt));
          for (mt in J)
            wn.call(J, mt) && !zn.hasOwnProperty(mt) && (ot[mt] = J[mt]);
          if (O && O.defaultProps) {
            var Pt = O.defaultProps;
            for (mt in Pt)
              ot[mt] === void 0 && (ot[mt] = Pt[mt]);
          }
          if (rt || At) {
            var Et = typeof O == "function" ? O.displayName || O.name || "Unknown" : O;
            rt && mr(ot, Et), At && yr(ot, Et);
          }
          return or(O, rt, At, pt, ze, bn.current, ot);
        }
      }
      var Gn = te.ReactCurrentOwner, jn = te.ReactDebugCurrentFrame;
      function sn(O) {
        if (O) {
          var J = O._owner, he = _t(O.type, O._source, J ? J.type : null);
          jn.setExtraStackFrame(he);
        } else
          jn.setExtraStackFrame(null);
      }
      var _n;
      _n = !1;
      function On(O) {
        return typeof O == "object" && O !== null && O.$$typeof === r;
      }
      function An() {
        {
          if (Gn.current) {
            var O = Oe(Gn.current.type);
            if (O)
              return `

Check the render method of \`` + O + "`.";
          }
          return "";
        }
      }
      function ar(O) {
        {
          if (O !== void 0) {
            var J = O.fileName.replace(/^.*[\\\/]/, ""), he = O.lineNumber;
            return `

Check your code at ` + J + ":" + he + ".";
          }
          return "";
        }
      }
      var kn = {};
      function ur(O) {
        {
          var J = An();
          if (!J) {
            var he = typeof O == "string" ? O : O.displayName || O.name;
            he && (J = `

Check the top-level render call using <` + he + ">.");
          }
          return J;
        }
      }
      function Hn(O, J) {
        {
          if (!O._store || O._store.validated || O.key != null)
            return;
          O._store.validated = !0;
          var he = ur(J);
          if (kn[he])
            return;
          kn[he] = !0;
          var ze = "";
          O && O._owner && O._owner !== Gn.current && (ze = " It was passed a child from " + Oe(O._owner.type) + "."), sn(O), Q('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', he, ze), sn(null);
        }
      }
      function Wn(O, J) {
        {
          if (typeof O != "object")
            return;
          if (Array.isArray(O))
            for (var he = 0; he < O.length; he++) {
              var ze = O[he];
              On(ze) && Hn(ze, J);
            }
          else if (On(O))
            O._store && (O._store.validated = !0);
          else if (O) {
            var pt = D(O);
            if (typeof pt == "function" && pt !== O.entries)
              for (var mt = pt.call(O), ot; !(ot = mt.next()).done; )
                On(ot.value) && Hn(ot.value, J);
          }
        }
      }
      function Sn(O) {
        {
          var J = O.type;
          if (J == null || typeof J == "string")
            return;
          var he;
          if (typeof J == "function")
            he = J.propTypes;
          else if (typeof J == "object" && (J.$$typeof === c || J.$$typeof === w))
            he = J.propTypes;
          else
            return;
          if (he) {
            var ze = Oe(J);
            yn(he, O.props, "prop", ze, O);
          } else if (J.PropTypes !== void 0 && !_n) {
            _n = !0;
            var pt = Oe(J);
            Q("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", pt || "Unknown");
          }
          typeof J.getDefaultProps == "function" && !J.getDefaultProps.isReactClassApproved && Q("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function wr(O) {
        {
          for (var J = Object.keys(O.props), he = 0; he < J.length; he++) {
            var ze = J[he];
            if (ze !== "children" && ze !== "key") {
              sn(O), Q("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ze), sn(null);
              break;
            }
          }
          O.ref !== null && (sn(O), Q("Invalid attribute `ref` supplied to `React.Fragment`."), sn(null));
        }
      }
      function Lt(O, J, he, ze, pt, mt) {
        {
          var ot = re(O);
          if (!ot) {
            var rt = "";
            (O === void 0 || typeof O == "object" && O !== null && Object.keys(O).length === 0) && (rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var At = ar(pt);
            At ? rt += At : rt += An();
            var Pt;
            O === null ? Pt = "null" : Array.isArray(O) ? Pt = "array" : O !== void 0 && O.$$typeof === r ? (Pt = "<" + (Oe(O.type) || "Unknown") + " />", rt = " Did you accidentally export a JSX literal instead of a component?") : Pt = typeof O, Q("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Pt, rt);
          }
          var Et = br(O, J, he, pt, mt);
          if (Et == null)
            return Et;
          if (ot) {
            var pn = J.children;
            if (pn !== void 0)
              if (ze)
                if (Array.isArray(pn)) {
                  for (var Un = 0; Un < pn.length; Un++)
                    Wn(pn[Un], O);
                  Object.freeze && Object.freeze(pn);
                } else
                  Q("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Wn(pn, O);
          }
          return O === e.Fragment ? wr(Et) : Sn(Et), Et;
        }
      }
      var Yt = Lt;
      e.jsxDEV = Yt;
    }();
  }(Ns)), Ns;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = Gm() : e.exports = jm();
})(fc);
const Dn = fc.exports.Fragment, L = fc.exports.jsxDEV;
function Hm(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var ph = Hm, Wm = typeof xi == "object" && xi && xi.Object === Object && xi, Um = Wm, Vm = Um, qm = typeof self == "object" && self && self.Object === Object && self, Ym = Vm || qm || Function("return this")(), hh = Ym, Xm = hh, Km = function() {
  return Xm.Date.now();
}, Qm = Km, Zm = /\s/;
function Jm(e) {
  for (var t = e.length; t-- && Zm.test(e.charAt(t)); )
    ;
  return t;
}
var e0 = Jm, t0 = e0, n0 = /^\s+/;
function r0(e) {
  return e && e.slice(0, t0(e) + 1).replace(n0, "");
}
var i0 = r0, o0 = hh, a0 = o0.Symbol, vh = a0, Hf = vh, gh = Object.prototype, u0 = gh.hasOwnProperty, s0 = gh.toString, io = Hf ? Hf.toStringTag : void 0;
function l0(e) {
  var t = u0.call(e, io), n = e[io];
  try {
    e[io] = void 0;
    var r = !0;
  } catch {
  }
  var i = s0.call(e);
  return r && (t ? e[io] = n : delete e[io]), i;
}
var c0 = l0, f0 = Object.prototype, d0 = f0.toString;
function p0(e) {
  return d0.call(e);
}
var h0 = p0, Wf = vh, v0 = c0, g0 = h0, m0 = "[object Null]", y0 = "[object Undefined]", Uf = Wf ? Wf.toStringTag : void 0;
function b0(e) {
  return e == null ? e === void 0 ? y0 : m0 : Uf && Uf in Object(e) ? v0(e) : g0(e);
}
var w0 = b0;
function x0(e) {
  return e != null && typeof e == "object";
}
var _0 = x0, S0 = w0, R0 = _0, C0 = "[object Symbol]";
function P0(e) {
  return typeof e == "symbol" || R0(e) && S0(e) == C0;
}
var T0 = P0, N0 = i0, Vf = ph, E0 = T0, qf = 0 / 0, M0 = /^[-+]0x[0-9a-f]+$/i, O0 = /^0b[01]+$/i, A0 = /^0o[0-7]+$/i, k0 = parseInt;
function $0(e) {
  if (typeof e == "number")
    return e;
  if (E0(e))
    return qf;
  if (Vf(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Vf(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = N0(e);
  var n = O0.test(e);
  return n || A0.test(e) ? k0(e.slice(2), n ? 2 : 8) : M0.test(e) ? qf : +e;
}
var F0 = $0, I0 = ph, Es = Qm, Yf = F0, B0 = "Expected a function", D0 = Math.max, z0 = Math.min;
function L0(e, t, n) {
  var r, i, o, a, u, f, c = 0, h = !1, p = !1, w = !0;
  if (typeof e != "function")
    throw new TypeError(B0);
  t = Yf(t) || 0, I0(n) && (h = !!n.leading, p = "maxWait" in n, o = p ? D0(Yf(n.maxWait) || 0, t) : o, w = "trailing" in n ? !!n.trailing : w);
  function P(D) {
    var te = r, Q = i;
    return r = i = void 0, c = D, a = e.apply(Q, te), a;
  }
  function _(D) {
    return c = D, u = setTimeout(k, t), h ? P(D) : a;
  }
  function T(D) {
    var te = D - f, Q = D - c, fe = t - te;
    return p ? z0(fe, o - Q) : fe;
  }
  function I(D) {
    var te = D - f, Q = D - c;
    return f === void 0 || te >= t || te < 0 || p && Q >= o;
  }
  function k() {
    var D = Es();
    if (I(D))
      return F(D);
    u = setTimeout(k, T(D));
  }
  function F(D) {
    return u = void 0, w && r ? P(D) : (r = i = void 0, a);
  }
  function N() {
    u !== void 0 && clearTimeout(u), c = 0, r = f = i = u = void 0;
  }
  function G() {
    return u === void 0 ? a : F(Es());
  }
  function M() {
    var D = Es(), te = I(D);
    if (r = arguments, i = this, f = D, te) {
      if (u === void 0)
        return _(f);
      if (p)
        return clearTimeout(u), u = setTimeout(k, t), P(f);
    }
    return u === void 0 && (u = setTimeout(k, t)), a;
  }
  return M.cancel = N, M.flush = G, M;
}
var mh = L0;
const dc = mh;
var Zr = [], G0 = function() {
  return Zr.some(function(e) {
    return e.activeTargets.length > 0;
  });
}, j0 = function() {
  return Zr.some(function(e) {
    return e.skippedTargets.length > 0;
  });
}, Xf = "ResizeObserver loop completed with undelivered notifications.", H0 = function() {
  var e;
  typeof ErrorEvent == "function" ? e = new ErrorEvent("error", {
    message: Xf
  }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = Xf), window.dispatchEvent(e);
}, ko;
(function(e) {
  e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(ko || (ko = {}));
var Jr = function(e) {
  return Object.freeze(e);
}, yh = function() {
  function e(t, n) {
    this.inlineSize = t, this.blockSize = n, Jr(this);
  }
  return e;
}(), bh = function() {
  function e(t, n, r, i) {
    return this.x = t, this.y = n, this.width = r, this.height = i, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, Jr(this);
  }
  return e.prototype.toJSON = function() {
    var t = this, n = t.x, r = t.y, i = t.top, o = t.right, a = t.bottom, u = t.left, f = t.width, c = t.height;
    return { x: n, y: r, top: i, right: o, bottom: a, left: u, width: f, height: c };
  }, e.fromRect = function(t) {
    return new e(t.x, t.y, t.width, t.height);
  }, e;
}(), pc = function(e) {
  return e instanceof SVGElement && "getBBox" in e;
}, wh = function(e) {
  if (pc(e)) {
    var t = e.getBBox(), n = t.width, r = t.height;
    return !n && !r;
  }
  var i = e, o = i.offsetWidth, a = i.offsetHeight;
  return !(o || a || e.getClientRects().length);
}, Kf = function(e) {
  var t;
  if (e instanceof Element)
    return !0;
  var n = (t = e == null ? void 0 : e.ownerDocument) === null || t === void 0 ? void 0 : t.defaultView;
  return !!(n && e instanceof n.Element);
}, W0 = function(e) {
  switch (e.tagName) {
    case "INPUT":
      if (e.type !== "image")
        break;
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return !0;
  }
  return !1;
}, Po = typeof window < "u" ? window : {}, Na = /* @__PURE__ */ new WeakMap(), Qf = /auto|scroll/, U0 = /^tb|vertical/, V0 = /msie|trident/i.test(Po.navigator && Po.navigator.userAgent), qn = function(e) {
  return parseFloat(e || "0");
}, Pi = function(e, t, n) {
  return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new yh((n ? t : e) || 0, (n ? e : t) || 0);
}, Zf = Jr({
  devicePixelContentBoxSize: Pi(),
  borderBoxSize: Pi(),
  contentBoxSize: Pi(),
  contentRect: new bh(0, 0, 0, 0)
}), xh = function(e, t) {
  if (t === void 0 && (t = !1), Na.has(e) && !t)
    return Na.get(e);
  if (wh(e))
    return Na.set(e, Zf), Zf;
  var n = getComputedStyle(e), r = pc(e) && e.ownerSVGElement && e.getBBox(), i = !V0 && n.boxSizing === "border-box", o = U0.test(n.writingMode || ""), a = !r && Qf.test(n.overflowY || ""), u = !r && Qf.test(n.overflowX || ""), f = r ? 0 : qn(n.paddingTop), c = r ? 0 : qn(n.paddingRight), h = r ? 0 : qn(n.paddingBottom), p = r ? 0 : qn(n.paddingLeft), w = r ? 0 : qn(n.borderTopWidth), P = r ? 0 : qn(n.borderRightWidth), _ = r ? 0 : qn(n.borderBottomWidth), T = r ? 0 : qn(n.borderLeftWidth), I = p + c, k = f + h, F = T + P, N = w + _, G = u ? e.offsetHeight - N - e.clientHeight : 0, M = a ? e.offsetWidth - F - e.clientWidth : 0, D = i ? I + F : 0, te = i ? k + N : 0, Q = r ? r.width : qn(n.width) - D - M, fe = r ? r.height : qn(n.height) - te - G, ge = Q + I + M + F, re = fe + k + G + N, ee = Jr({
    devicePixelContentBoxSize: Pi(Math.round(Q * devicePixelRatio), Math.round(fe * devicePixelRatio), o),
    borderBoxSize: Pi(ge, re, o),
    contentBoxSize: Pi(Q, fe, o),
    contentRect: new bh(p, f, Q, fe)
  });
  return Na.set(e, ee), ee;
}, _h = function(e, t, n) {
  var r = xh(e, n), i = r.borderBoxSize, o = r.contentBoxSize, a = r.devicePixelContentBoxSize;
  switch (t) {
    case ko.DEVICE_PIXEL_CONTENT_BOX:
      return a;
    case ko.BORDER_BOX:
      return i;
    default:
      return o;
  }
}, Sh = function() {
  function e(t) {
    var n = xh(t);
    this.target = t, this.contentRect = n.contentRect, this.borderBoxSize = Jr([n.borderBoxSize]), this.contentBoxSize = Jr([n.contentBoxSize]), this.devicePixelContentBoxSize = Jr([n.devicePixelContentBoxSize]);
  }
  return e;
}(), Rh = function(e) {
  if (wh(e))
    return 1 / 0;
  for (var t = 0, n = e.parentNode; n; )
    t += 1, n = n.parentNode;
  return t;
}, q0 = function() {
  var e = 1 / 0, t = [];
  Zr.forEach(function(a) {
    if (a.activeTargets.length !== 0) {
      var u = [];
      a.activeTargets.forEach(function(c) {
        var h = new Sh(c.target), p = Rh(c.target);
        u.push(h), c.lastReportedSize = _h(c.target, c.observedBox), p < e && (e = p);
      }), t.push(function() {
        a.callback.call(a.observer, u, a.observer);
      }), a.activeTargets.splice(0, a.activeTargets.length);
    }
  });
  for (var n = 0, r = t; n < r.length; n++) {
    var i = r[n];
    i();
  }
  return e;
}, Jf = function(e) {
  Zr.forEach(function(n) {
    n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(i) {
      i.isActive() && (Rh(i.target) > e ? n.activeTargets.push(i) : n.skippedTargets.push(i));
    });
  });
}, Y0 = function() {
  var e = 0;
  for (Jf(e); G0(); )
    e = q0(), Jf(e);
  return j0() && H0(), e > 0;
}, Ms, Ch = [], X0 = function() {
  return Ch.splice(0).forEach(function(e) {
    return e();
  });
}, K0 = function(e) {
  if (!Ms) {
    var t = 0, n = document.createTextNode(""), r = { characterData: !0 };
    new MutationObserver(function() {
      return X0();
    }).observe(n, r), Ms = function() {
      n.textContent = "".concat(t ? t-- : t++);
    };
  }
  Ch.push(e), Ms();
}, Q0 = function(e) {
  K0(function() {
    requestAnimationFrame(e);
  });
}, Va = 0, Z0 = function() {
  return !!Va;
}, J0 = 250, ey = { attributes: !0, characterData: !0, childList: !0, subtree: !0 }, ed = [
  "resize",
  "load",
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus"
], td = function(e) {
  return e === void 0 && (e = 0), Date.now() + e;
}, Os = !1, ty = function() {
  function e() {
    var t = this;
    this.stopped = !0, this.listener = function() {
      return t.schedule();
    };
  }
  return e.prototype.run = function(t) {
    var n = this;
    if (t === void 0 && (t = J0), !Os) {
      Os = !0;
      var r = td(t);
      Q0(function() {
        var i = !1;
        try {
          i = Y0();
        } finally {
          if (Os = !1, t = r - td(), !Z0())
            return;
          i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
        }
      });
    }
  }, e.prototype.schedule = function() {
    this.stop(), this.run();
  }, e.prototype.observe = function() {
    var t = this, n = function() {
      return t.observer && t.observer.observe(document.body, ey);
    };
    document.body ? n() : Po.addEventListener("DOMContentLoaded", n);
  }, e.prototype.start = function() {
    var t = this;
    this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), ed.forEach(function(n) {
      return Po.addEventListener(n, t.listener, !0);
    }));
  }, e.prototype.stop = function() {
    var t = this;
    this.stopped || (this.observer && this.observer.disconnect(), ed.forEach(function(n) {
      return Po.removeEventListener(n, t.listener, !0);
    }), this.stopped = !0);
  }, e;
}(), pl = new ty(), nd = function(e) {
  !Va && e > 0 && pl.start(), Va += e, !Va && pl.stop();
}, ny = function(e) {
  return !pc(e) && !W0(e) && getComputedStyle(e).display === "inline";
}, ry = function() {
  function e(t, n) {
    this.target = t, this.observedBox = n || ko.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return e.prototype.isActive = function() {
    var t = _h(this.target, this.observedBox, !0);
    return ny(this.target) && (this.lastReportedSize = t), this.lastReportedSize.inlineSize !== t.inlineSize || this.lastReportedSize.blockSize !== t.blockSize;
  }, e;
}(), iy = function() {
  function e(t, n) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = t, this.callback = n;
  }
  return e;
}(), Ea = /* @__PURE__ */ new WeakMap(), rd = function(e, t) {
  for (var n = 0; n < e.length; n += 1)
    if (e[n].target === t)
      return n;
  return -1;
}, Ma = function() {
  function e() {
  }
  return e.connect = function(t, n) {
    var r = new iy(t, n);
    Ea.set(t, r);
  }, e.observe = function(t, n, r) {
    var i = Ea.get(t), o = i.observationTargets.length === 0;
    rd(i.observationTargets, n) < 0 && (o && Zr.push(i), i.observationTargets.push(new ry(n, r && r.box)), nd(1), pl.schedule());
  }, e.unobserve = function(t, n) {
    var r = Ea.get(t), i = rd(r.observationTargets, n), o = r.observationTargets.length === 1;
    i >= 0 && (o && Zr.splice(Zr.indexOf(r), 1), r.observationTargets.splice(i, 1), nd(-1));
  }, e.disconnect = function(t) {
    var n = this, r = Ea.get(t);
    r.observationTargets.slice().forEach(function(i) {
      return n.unobserve(t, i.target);
    }), r.activeTargets.splice(0, r.activeTargets.length);
  }, e;
}(), oy = function() {
  function e(t) {
    if (arguments.length === 0)
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    if (typeof t != "function")
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    Ma.connect(this, t);
  }
  return e.prototype.observe = function(t, n) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!Kf(t))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ma.observe(this, t, n);
  }, e.prototype.unobserve = function(t) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!Kf(t))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ma.unobserve(this, t);
  }, e.prototype.disconnect = function() {
    Ma.disconnect(this);
  }, e.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, e;
}();
const ay = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ResizeObserver: oy,
  ResizeObserverEntry: Sh,
  ResizeObserverSize: yh
}, Symbol.toStringTag, { value: "Module" }));
var uy = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/responsive/esm/components/ParentSizeModern.js", sy = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function hl() {
  return hl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, hl.apply(this, arguments);
}
function ly(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var cy = [];
function Ph(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? cy : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = ly(e, sy), w = tn(null), P = tn(0), _ = hr({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), T = _[0], I = _[1], k = Ht(function() {
    var F = Array.isArray(a) ? a : [a];
    return dc(function(N) {
      I(function(G) {
        var M = Object.keys(G), D = M.filter(function(Q) {
          return G[Q] !== N[Q];
        }), te = D.every(function(Q) {
          return F.includes(Q);
        });
        return te ? G : N;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return on(function() {
    var F = new window.ResizeObserver(function(N) {
      N.forEach(function(G) {
        var M = G.contentRect, D = M.left, te = M.top, Q = M.width, fe = M.height;
        P.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: D
          });
        });
      });
    });
    return w.current && F.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), F.disconnect(), k.cancel();
    };
  }, [k]), /* @__PURE__ */ L("div", {
    style: f,
    ref: w,
    className: t,
    ...p,
    children: n(hl({}, T, {
      ref: w.current,
      resize: k
    }))
  }, void 0, !1, {
    fileName: uy,
    lineNumber: 81,
    columnNumber: 23
  }, this);
}
Ph.propTypes = {
  className: ke.exports.string,
  debounceTime: ke.exports.number,
  enableDebounceLeadingCall: ke.exports.bool,
  ignoreDimensions: ke.exports.oneOfType([ke.exports.any, ke.exports.arrayOf(ke.exports.any)]),
  children: ke.exports.func.isRequired
};
var mu = { exports: {} };
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
(function(e) {
  (function() {
    var t = {}.hasOwnProperty;
    function n() {
      for (var r = [], i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (!!o) {
          var a = typeof o;
          if (a === "string" || a === "number")
            r.push(o);
          else if (Array.isArray(o)) {
            if (o.length) {
              var u = n.apply(null, o);
              u && r.push(u);
            }
          } else if (a === "object")
            if (o.toString === Object.prototype.toString)
              for (var f in o)
                t.call(o, f) && o[f] && r.push(f);
            else
              r.push(o.toString());
        }
      }
      return r.join(" ");
    }
    e.exports ? (n.default = n, e.exports = n) : window.classNames = n;
  })();
})(mu);
const fy = mu.exports;
function vl(e, t, n) {
  var r, i, o, a, u;
  t == null && (t = 100);
  function f() {
    var h = Date.now() - a;
    h < t && h >= 0 ? r = setTimeout(f, t - h) : (r = null, n || (u = e.apply(o, i), o = i = null));
  }
  var c = function() {
    o = this, i = arguments, a = Date.now();
    var h = n && !r;
    return r || (r = setTimeout(f, t)), h && (u = e.apply(o, i), o = i = null), u;
  };
  return c.clear = function() {
    r && (clearTimeout(r), r = null);
  }, c.flush = function() {
    r && (u = e.apply(o, i), o = i = null, clearTimeout(r), r = null);
  }, c;
}
vl.debounce = vl;
var id = vl;
function dy(e) {
  let {
    debounce: t,
    scroll: n,
    polyfill: r,
    offsetSize: i
  } = e === void 0 ? {
    debounce: 0,
    scroll: !1,
    offsetSize: !1
  } : e;
  const o = r || (typeof window > "u" ? class {
  } : window.ResizeObserver);
  if (!o)
    throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");
  const [a, u] = hr({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  }), f = tn({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: a
  }), c = t ? typeof t == "number" ? t : t.scroll : null, h = t ? typeof t == "number" ? t : t.resize : null, p = tn(!1);
  on(() => (p.current = !0, () => void (p.current = !1)));
  const [w, P, _] = Ht(() => {
    const F = () => {
      if (!f.current.element)
        return;
      const {
        left: N,
        top: G,
        width: M,
        height: D,
        bottom: te,
        right: Q,
        x: fe,
        y: ge
      } = f.current.element.getBoundingClientRect(), re = {
        left: N,
        top: G,
        width: M,
        height: D,
        bottom: te,
        right: Q,
        x: fe,
        y: ge
      };
      f.current.element instanceof HTMLElement && i && (re.height = f.current.element.offsetHeight, re.width = f.current.element.offsetWidth), Object.freeze(re), p.current && !gy(f.current.lastBounds, re) && u(f.current.lastBounds = re);
    };
    return [F, h ? id(F, h) : F, c ? id(F, c) : F];
  }, [u, i, c, h]);
  function T() {
    f.current.scrollContainers && (f.current.scrollContainers.forEach((F) => F.removeEventListener("scroll", _, !0)), f.current.scrollContainers = null), f.current.resizeObserver && (f.current.resizeObserver.disconnect(), f.current.resizeObserver = null);
  }
  function I() {
    !f.current.element || (f.current.resizeObserver = new o(_), f.current.resizeObserver.observe(f.current.element), n && f.current.scrollContainers && f.current.scrollContainers.forEach((F) => F.addEventListener("scroll", _, {
      capture: !0,
      passive: !0
    })));
  }
  const k = (F) => {
    !F || F === f.current.element || (T(), f.current.element = F, f.current.scrollContainers = Th(F), I());
  };
  return hy(_, Boolean(n)), py(P), on(() => {
    T(), I();
  }, [n, _, P]), on(() => T, []), [k, a, w];
}
function py(e) {
  on(() => {
    const t = e;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [e]);
}
function hy(e, t) {
  on(() => {
    if (t) {
      const n = e;
      return window.addEventListener("scroll", n, {
        capture: !0,
        passive: !0
      }), () => void window.removeEventListener("scroll", n, !0);
    }
  }, [e, t]);
}
function Th(e) {
  const t = [];
  if (!e || e === document.body)
    return t;
  const {
    overflow: n,
    overflowX: r,
    overflowY: i
  } = window.getComputedStyle(e);
  return [n, r, i].some((o) => o === "auto" || o === "scroll") && t.push(e), [...t, ...Th(e.parentElement)];
}
const vy = ["x", "y", "top", "bottom", "left", "right", "width", "height"], gy = (e, t) => vy.every((n) => e[n] === t[n]);
function od(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var ad = /* @__PURE__ */ function() {
  function e(n) {
    var r = n.x, i = r === void 0 ? 0 : r, o = n.y, a = o === void 0 ? 0 : o;
    od(this, "x", 0), od(this, "y", 0), this.x = i, this.y = a;
  }
  var t = e.prototype;
  return t.value = function() {
    return {
      x: this.x,
      y: this.y
    };
  }, t.toArray = function() {
    return [this.x, this.y];
  }, e;
}();
function my(e) {
  return !!e && e instanceof Element;
}
function yy(e) {
  return !!e && (e instanceof SVGElement || "ownerSVGElement" in e);
}
function by(e) {
  return !!e && "createSVGPoint" in e;
}
function wy(e) {
  return !!e && "getScreenCTM" in e;
}
function xy(e) {
  return !!e && "changedTouches" in e;
}
function _y(e) {
  return !!e && "clientX" in e;
}
function Sy(e) {
  return !!e && (e instanceof Event || "nativeEvent" in e && e.nativeEvent instanceof Event);
}
function To() {
  return To = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, To.apply(this, arguments);
}
var As = {
  x: 0,
  y: 0
};
function Ry(e) {
  if (!e)
    return To({}, As);
  if (xy(e))
    return e.changedTouches.length > 0 ? {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    } : To({}, As);
  if (_y(e))
    return {
      x: e.clientX,
      y: e.clientY
    };
  var t = e == null ? void 0 : e.target, n = t && "getBoundingClientRect" in t ? t.getBoundingClientRect() : null;
  return n ? {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  } : To({}, As);
}
function ud(e, t) {
  if (!e || !t)
    return null;
  var n = Ry(t), r = yy(e) ? e.ownerSVGElement : e, i = wy(r) ? r.getScreenCTM() : null;
  if (by(r) && i) {
    var o = r.createSVGPoint();
    return o.x = n.x, o.y = n.y, o = o.matrixTransform(i.inverse()), new ad({
      x: o.x,
      y: o.y
    });
  }
  var a = e.getBoundingClientRect();
  return new ad({
    x: n.x - a.left - e.clientLeft,
    y: n.y - a.top - e.clientTop
  });
}
function Cy(e, t) {
  if (my(e) && t)
    return ud(e, t);
  if (Sy(e)) {
    var n = e, r = n.target;
    if (r)
      return ud(r, n);
  }
  return null;
}
var gl = Math.PI, ml = 2 * gl, Kr = 1e-6, Py = ml - Kr;
function yl() {
  this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
}
function Di() {
  return new yl();
}
yl.prototype = Di.prototype = {
  constructor: yl,
  moveTo: function(e, t) {
    this._ += "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t);
  },
  closePath: function() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
  },
  lineTo: function(e, t) {
    this._ += "L" + (this._x1 = +e) + "," + (this._y1 = +t);
  },
  quadraticCurveTo: function(e, t, n, r) {
    this._ += "Q" + +e + "," + +t + "," + (this._x1 = +n) + "," + (this._y1 = +r);
  },
  bezierCurveTo: function(e, t, n, r, i, o) {
    this._ += "C" + +e + "," + +t + "," + +n + "," + +r + "," + (this._x1 = +i) + "," + (this._y1 = +o);
  },
  arcTo: function(e, t, n, r, i) {
    e = +e, t = +t, n = +n, r = +r, i = +i;
    var o = this._x1, a = this._y1, u = n - e, f = r - t, c = o - e, h = a - t, p = c * c + h * h;
    if (i < 0)
      throw new Error("negative radius: " + i);
    if (this._x1 === null)
      this._ += "M" + (this._x1 = e) + "," + (this._y1 = t);
    else if (p > Kr)
      if (!(Math.abs(h * u - f * c) > Kr) || !i)
        this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
      else {
        var w = n - o, P = r - a, _ = u * u + f * f, T = w * w + P * P, I = Math.sqrt(_), k = Math.sqrt(p), F = i * Math.tan((gl - Math.acos((_ + p - T) / (2 * I * k))) / 2), N = F / k, G = F / I;
        Math.abs(N - 1) > Kr && (this._ += "L" + (e + N * c) + "," + (t + N * h)), this._ += "A" + i + "," + i + ",0,0," + +(h * w > c * P) + "," + (this._x1 = e + G * u) + "," + (this._y1 = t + G * f);
      }
  },
  arc: function(e, t, n, r, i, o) {
    e = +e, t = +t, n = +n, o = !!o;
    var a = n * Math.cos(r), u = n * Math.sin(r), f = e + a, c = t + u, h = 1 ^ o, p = o ? r - i : i - r;
    if (n < 0)
      throw new Error("negative radius: " + n);
    this._x1 === null ? this._ += "M" + f + "," + c : (Math.abs(this._x1 - f) > Kr || Math.abs(this._y1 - c) > Kr) && (this._ += "L" + f + "," + c), n && (p < 0 && (p = p % ml + ml), p > Py ? this._ += "A" + n + "," + n + ",0,1," + h + "," + (e - a) + "," + (t - u) + "A" + n + "," + n + ",0,1," + h + "," + (this._x1 = f) + "," + (this._y1 = c) : p > Kr && (this._ += "A" + n + "," + n + ",0," + +(p >= gl) + "," + h + "," + (this._x1 = e + n * Math.cos(i)) + "," + (this._y1 = t + n * Math.sin(i))));
  },
  rect: function(e, t, n, r) {
    this._ += "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t) + "h" + +n + "v" + +r + "h" + -n + "Z";
  },
  toString: function() {
    return this._;
  }
};
function vt(e) {
  return function() {
    return e;
  };
}
var sd = Math.abs, Zt = Math.atan2, Yr = Math.cos, Ty = Math.max, ks = Math.min, Yn = Math.sin, _i = Math.sqrt, Jt = 1e-12, Br = Math.PI, Ka = Br / 2, Fr = 2 * Br;
function Ny(e) {
  return e > 1 ? 0 : e < -1 ? Br : Math.acos(e);
}
function ld(e) {
  return e >= 1 ? Ka : e <= -1 ? -Ka : Math.asin(e);
}
function Ey(e) {
  return e.innerRadius;
}
function My(e) {
  return e.outerRadius;
}
function Oy(e) {
  return e.startAngle;
}
function Ay(e) {
  return e.endAngle;
}
function ky(e) {
  return e && e.padAngle;
}
function $y(e, t, n, r, i, o, a, u) {
  var f = n - e, c = r - t, h = a - i, p = u - o, w = p * f - h * c;
  if (!(w * w < Jt))
    return w = (h * (t - o) - p * (e - i)) / w, [e + w * f, t + w * c];
}
function Oa(e, t, n, r, i, o, a) {
  var u = e - n, f = t - r, c = (a ? o : -o) / _i(u * u + f * f), h = c * f, p = -c * u, w = e + h, P = t + p, _ = n + h, T = r + p, I = (w + _) / 2, k = (P + T) / 2, F = _ - w, N = T - P, G = F * F + N * N, M = i - o, D = w * T - _ * P, te = (N < 0 ? -1 : 1) * _i(Ty(0, M * M * G - D * D)), Q = (D * N - F * te) / G, fe = (-D * F - N * te) / G, ge = (D * N + F * te) / G, re = (-D * F + N * te) / G, ee = Q - I, be = fe - k, Oe = ge - I, ut = re - k;
  return ee * ee + be * be > Oe * Oe + ut * ut && (Q = ge, fe = re), {
    cx: Q,
    cy: fe,
    x01: -h,
    y01: -p,
    x11: Q * (i / M - 1),
    y11: fe * (i / M - 1)
  };
}
function Fy() {
  var e = Ey, t = My, n = vt(0), r = null, i = Oy, o = Ay, a = ky, u = null;
  function f() {
    var c, h, p = +e.apply(this, arguments), w = +t.apply(this, arguments), P = i.apply(this, arguments) - Ka, _ = o.apply(this, arguments) - Ka, T = sd(_ - P), I = _ > P;
    if (u || (u = c = Di()), w < p && (h = w, w = p, p = h), !(w > Jt))
      u.moveTo(0, 0);
    else if (T > Fr - Jt)
      u.moveTo(w * Yr(P), w * Yn(P)), u.arc(0, 0, w, P, _, !I), p > Jt && (u.moveTo(p * Yr(_), p * Yn(_)), u.arc(0, 0, p, _, P, I));
    else {
      var k = P, F = _, N = P, G = _, M = T, D = T, te = a.apply(this, arguments) / 2, Q = te > Jt && (r ? +r.apply(this, arguments) : _i(p * p + w * w)), fe = ks(sd(w - p) / 2, +n.apply(this, arguments)), ge = fe, re = fe, ee, be;
      if (Q > Jt) {
        var Oe = ld(Q / p * Yn(te)), ut = ld(Q / w * Yn(te));
        (M -= Oe * 2) > Jt ? (Oe *= I ? 1 : -1, N += Oe, G -= Oe) : (M = 0, N = G = (P + _) / 2), (D -= ut * 2) > Jt ? (ut *= I ? 1 : -1, k += ut, F -= ut) : (D = 0, k = F = (P + _) / 2);
      }
      var Ue = w * Yr(k), st = w * Yn(k), lt = p * Yr(G), dt = p * Yn(G);
      if (fe > Jt) {
        var V = w * Yr(F), ue = w * Yn(F), Te = p * Yr(N), Ae = p * Yn(N), Ce;
        if (T < Br && (Ce = $y(Ue, st, Te, Ae, V, ue, lt, dt))) {
          var Re = Ue - Ce[0], Ne = st - Ce[1], Be = V - Ce[0], Le = ue - Ce[1], X = 1 / Yn(Ny((Re * Be + Ne * Le) / (_i(Re * Re + Ne * Ne) * _i(Be * Be + Le * Le))) / 2), ce = _i(Ce[0] * Ce[0] + Ce[1] * Ce[1]);
          ge = ks(fe, (p - ce) / (X - 1)), re = ks(fe, (w - ce) / (X + 1));
        }
      }
      D > Jt ? re > Jt ? (ee = Oa(Te, Ae, Ue, st, w, re, I), be = Oa(V, ue, lt, dt, w, re, I), u.moveTo(ee.cx + ee.x01, ee.cy + ee.y01), re < fe ? u.arc(ee.cx, ee.cy, re, Zt(ee.y01, ee.x01), Zt(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, re, Zt(ee.y01, ee.x01), Zt(ee.y11, ee.x11), !I), u.arc(0, 0, w, Zt(ee.cy + ee.y11, ee.cx + ee.x11), Zt(be.cy + be.y11, be.cx + be.x11), !I), u.arc(be.cx, be.cy, re, Zt(be.y11, be.x11), Zt(be.y01, be.x01), !I))) : (u.moveTo(Ue, st), u.arc(0, 0, w, k, F, !I)) : u.moveTo(Ue, st), !(p > Jt) || !(M > Jt) ? u.lineTo(lt, dt) : ge > Jt ? (ee = Oa(lt, dt, V, ue, p, -ge, I), be = Oa(Ue, st, Te, Ae, p, -ge, I), u.lineTo(ee.cx + ee.x01, ee.cy + ee.y01), ge < fe ? u.arc(ee.cx, ee.cy, ge, Zt(ee.y01, ee.x01), Zt(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, ge, Zt(ee.y01, ee.x01), Zt(ee.y11, ee.x11), !I), u.arc(0, 0, p, Zt(ee.cy + ee.y11, ee.cx + ee.x11), Zt(be.cy + be.y11, be.cx + be.x11), I), u.arc(be.cx, be.cy, ge, Zt(be.y11, be.x11), Zt(be.y01, be.x01), !I))) : u.arc(0, 0, p, G, N, I);
    }
    if (u.closePath(), c)
      return u = null, c + "" || null;
  }
  return f.centroid = function() {
    var c = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2, h = (+i.apply(this, arguments) + +o.apply(this, arguments)) / 2 - Br / 2;
    return [Yr(h) * c, Yn(h) * c];
  }, f.innerRadius = function(c) {
    return arguments.length ? (e = typeof c == "function" ? c : vt(+c), f) : e;
  }, f.outerRadius = function(c) {
    return arguments.length ? (t = typeof c == "function" ? c : vt(+c), f) : t;
  }, f.cornerRadius = function(c) {
    return arguments.length ? (n = typeof c == "function" ? c : vt(+c), f) : n;
  }, f.padRadius = function(c) {
    return arguments.length ? (r = c == null ? null : typeof c == "function" ? c : vt(+c), f) : r;
  }, f.startAngle = function(c) {
    return arguments.length ? (i = typeof c == "function" ? c : vt(+c), f) : i;
  }, f.endAngle = function(c) {
    return arguments.length ? (o = typeof c == "function" ? c : vt(+c), f) : o;
  }, f.padAngle = function(c) {
    return arguments.length ? (a = typeof c == "function" ? c : vt(+c), f) : a;
  }, f.context = function(c) {
    return arguments.length ? (u = c == null ? null : c, f) : u;
  }, f;
}
function Nh(e) {
  this._context = e;
}
Nh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function yu(e) {
  return new Nh(e);
}
function hc(e) {
  return e[0];
}
function vc(e) {
  return e[1];
}
function gc() {
  var e = hc, t = vc, n = vt(!0), r = null, i = yu, o = null;
  function a(u) {
    var f, c = u.length, h, p = !1, w;
    for (r == null && (o = i(w = Di())), f = 0; f <= c; ++f)
      !(f < c && n(h = u[f], f, u)) === p && ((p = !p) ? o.lineStart() : o.lineEnd()), p && o.point(+e(h, f, u), +t(h, f, u));
    if (w)
      return o = null, w + "" || null;
  }
  return a.x = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : vt(+u), a) : e;
  }, a.y = function(u) {
    return arguments.length ? (t = typeof u == "function" ? u : vt(+u), a) : t;
  }, a.defined = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : vt(!!u), a) : n;
  }, a.curve = function(u) {
    return arguments.length ? (i = u, r != null && (o = i(r)), a) : i;
  }, a.context = function(u) {
    return arguments.length ? (u == null ? r = o = null : o = i(r = u), a) : r;
  }, a;
}
function Eh() {
  var e = hc, t = null, n = vt(0), r = vc, i = vt(!0), o = null, a = yu, u = null;
  function f(h) {
    var p, w, P, _ = h.length, T, I = !1, k, F = new Array(_), N = new Array(_);
    for (o == null && (u = a(k = Di())), p = 0; p <= _; ++p) {
      if (!(p < _ && i(T = h[p], p, h)) === I)
        if (I = !I)
          w = p, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), P = p - 1; P >= w; --P)
            u.point(F[P], N[P]);
          u.lineEnd(), u.areaEnd();
        }
      I && (F[p] = +e(T, p, h), N[p] = +n(T, p, h), u.point(t ? +t(T, p, h) : F[p], r ? +r(T, p, h) : N[p]));
    }
    if (k)
      return u = null, k + "" || null;
  }
  function c() {
    return gc().defined(i).curve(a).context(o);
  }
  return f.x = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : vt(+h), t = null, f) : e;
  }, f.x0 = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : vt(+h), f) : e;
  }, f.x1 = function(h) {
    return arguments.length ? (t = h == null ? null : typeof h == "function" ? h : vt(+h), f) : t;
  }, f.y = function(h) {
    return arguments.length ? (n = typeof h == "function" ? h : vt(+h), r = null, f) : n;
  }, f.y0 = function(h) {
    return arguments.length ? (n = typeof h == "function" ? h : vt(+h), f) : n;
  }, f.y1 = function(h) {
    return arguments.length ? (r = h == null ? null : typeof h == "function" ? h : vt(+h), f) : r;
  }, f.lineX0 = f.lineY0 = function() {
    return c().x(e).y(n);
  }, f.lineY1 = function() {
    return c().x(e).y(r);
  }, f.lineX1 = function() {
    return c().x(t).y(n);
  }, f.defined = function(h) {
    return arguments.length ? (i = typeof h == "function" ? h : vt(!!h), f) : i;
  }, f.curve = function(h) {
    return arguments.length ? (a = h, o != null && (u = a(o)), f) : a;
  }, f.context = function(h) {
    return arguments.length ? (h == null ? o = u = null : u = a(o = h), f) : o;
  }, f;
}
function Iy(e, t) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function By(e) {
  return e;
}
function Dy() {
  var e = By, t = Iy, n = null, r = vt(0), i = vt(Fr), o = vt(0);
  function a(u) {
    var f, c = u.length, h, p, w = 0, P = new Array(c), _ = new Array(c), T = +r.apply(this, arguments), I = Math.min(Fr, Math.max(-Fr, i.apply(this, arguments) - T)), k, F = Math.min(Math.abs(I) / c, o.apply(this, arguments)), N = F * (I < 0 ? -1 : 1), G;
    for (f = 0; f < c; ++f)
      (G = _[P[f] = f] = +e(u[f], f, u)) > 0 && (w += G);
    for (t != null ? P.sort(function(M, D) {
      return t(_[M], _[D]);
    }) : n != null && P.sort(function(M, D) {
      return n(u[M], u[D]);
    }), f = 0, p = w ? (I - c * N) / w : 0; f < c; ++f, T = k)
      h = P[f], G = _[h], k = T + (G > 0 ? G * p : 0) + N, _[h] = {
        data: u[h],
        index: f,
        value: G,
        startAngle: T,
        endAngle: k,
        padAngle: F
      };
    return _;
  }
  return a.value = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : vt(+u), a) : e;
  }, a.sortValues = function(u) {
    return arguments.length ? (t = u, n = null, a) : t;
  }, a.sort = function(u) {
    return arguments.length ? (n = u, t = null, a) : n;
  }, a.startAngle = function(u) {
    return arguments.length ? (r = typeof u == "function" ? u : vt(+u), a) : r;
  }, a.endAngle = function(u) {
    return arguments.length ? (i = typeof u == "function" ? u : vt(+u), a) : i;
  }, a.padAngle = function(u) {
    return arguments.length ? (o = typeof u == "function" ? u : vt(+u), a) : o;
  }, a;
}
var Mh = mc(yu);
function Oh(e) {
  this._curve = e;
}
Oh.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(e, t) {
    this._curve.point(t * Math.sin(e), t * -Math.cos(e));
  }
};
function mc(e) {
  function t(n) {
    return new Oh(e(n));
  }
  return t._curve = e, t;
}
function xo(e) {
  var t = e.curve;
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e.curve = function(n) {
    return arguments.length ? t(mc(n)) : t()._curve;
  }, e;
}
function cd() {
  return xo(gc().curve(Mh));
}
function fd() {
  var e = Eh().curve(Mh), t = e.curve, n = e.lineX0, r = e.lineX1, i = e.lineY0, o = e.lineY1;
  return e.angle = e.x, delete e.x, e.startAngle = e.x0, delete e.x0, e.endAngle = e.x1, delete e.x1, e.radius = e.y, delete e.y, e.innerRadius = e.y0, delete e.y0, e.outerRadius = e.y1, delete e.y1, e.lineStartAngle = function() {
    return xo(n());
  }, delete e.lineX0, e.lineEndAngle = function() {
    return xo(r());
  }, delete e.lineX1, e.lineInnerRadius = function() {
    return xo(i());
  }, delete e.lineY0, e.lineOuterRadius = function() {
    return xo(o());
  }, delete e.lineY1, e.curve = function(a) {
    return arguments.length ? t(mc(a)) : t()._curve;
  }, e;
}
function _o(e, t) {
  return [(t = +t) * Math.cos(e -= Math.PI / 2), t * Math.sin(e)];
}
var bl = Array.prototype.slice;
function zy(e) {
  return e.source;
}
function Ly(e) {
  return e.target;
}
function yc(e) {
  var t = zy, n = Ly, r = hc, i = vc, o = null;
  function a() {
    var u, f = bl.call(arguments), c = t.apply(this, f), h = n.apply(this, f);
    if (o || (o = u = Di()), e(o, +r.apply(this, (f[0] = c, f)), +i.apply(this, f), +r.apply(this, (f[0] = h, f)), +i.apply(this, f)), u)
      return o = null, u + "" || null;
  }
  return a.source = function(u) {
    return arguments.length ? (t = u, a) : t;
  }, a.target = function(u) {
    return arguments.length ? (n = u, a) : n;
  }, a.x = function(u) {
    return arguments.length ? (r = typeof u == "function" ? u : vt(+u), a) : r;
  }, a.y = function(u) {
    return arguments.length ? (i = typeof u == "function" ? u : vt(+u), a) : i;
  }, a.context = function(u) {
    return arguments.length ? (o = u == null ? null : u, a) : o;
  }, a;
}
function Gy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t = (t + r) / 2, n, t, i, r, i);
}
function jy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t, n = (n + i) / 2, r, n, r, i);
}
function Hy(e, t, n, r, i) {
  var o = _o(t, n), a = _o(t, n = (n + i) / 2), u = _o(r, n), f = _o(r, i);
  e.moveTo(o[0], o[1]), e.bezierCurveTo(a[0], a[1], u[0], u[1], f[0], f[1]);
}
function Wy() {
  return yc(Gy);
}
function Uy() {
  return yc(jy);
}
function Vy() {
  var e = yc(Hy);
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e;
}
const bc = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Br);
    e.moveTo(n, 0), e.arc(0, 0, n, 0, Fr);
  }
}, Ah = {
  draw: function(e, t) {
    var n = Math.sqrt(t / 5) / 2;
    e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
  }
};
var kh = Math.sqrt(1 / 3), qy = kh * 2;
const $h = {
  draw: function(e, t) {
    var n = Math.sqrt(t / qy), r = n * kh;
    e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
  }
};
var Yy = 0.8908130915292852, Fh = Math.sin(Br / 10) / Math.sin(7 * Br / 10), Xy = Math.sin(Fr / 10) * Fh, Ky = -Math.cos(Fr / 10) * Fh;
const Ih = {
  draw: function(e, t) {
    var n = Math.sqrt(t * Yy), r = Xy * n, i = Ky * n;
    e.moveTo(0, -n), e.lineTo(r, i);
    for (var o = 1; o < 5; ++o) {
      var a = Fr * o / 5, u = Math.cos(a), f = Math.sin(a);
      e.lineTo(f * n, -u * n), e.lineTo(u * r - f * i, f * r + u * i);
    }
    e.closePath();
  }
}, Bh = {
  draw: function(e, t) {
    var n = Math.sqrt(t), r = -n / 2;
    e.rect(r, r, n, n);
  }
};
var $s = Math.sqrt(3);
const Dh = {
  draw: function(e, t) {
    var n = -Math.sqrt(t / ($s * 3));
    e.moveTo(0, n * 2), e.lineTo(-$s * n, -n), e.lineTo($s * n, -n), e.closePath();
  }
};
var Rn = -0.5, Cn = Math.sqrt(3) / 2, wl = 1 / Math.sqrt(12), Qy = (wl / 2 + 1) * 3;
const zh = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Qy), r = n / 2, i = n * wl, o = r, a = n * wl + n, u = -o, f = a;
    e.moveTo(r, i), e.lineTo(o, a), e.lineTo(u, f), e.lineTo(Rn * r - Cn * i, Cn * r + Rn * i), e.lineTo(Rn * o - Cn * a, Cn * o + Rn * a), e.lineTo(Rn * u - Cn * f, Cn * u + Rn * f), e.lineTo(Rn * r + Cn * i, Rn * i - Cn * r), e.lineTo(Rn * o + Cn * a, Rn * a - Cn * o), e.lineTo(Rn * u + Cn * f, Rn * f - Cn * u), e.closePath();
  }
};
var Zy = [
  bc,
  Ah,
  $h,
  Bh,
  Ih,
  Dh,
  zh
];
function Jy() {
  var e = vt(bc), t = vt(64), n = null;
  function r() {
    var i;
    if (n || (n = i = Di()), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i)
      return n = null, i + "" || null;
  }
  return r.type = function(i) {
    return arguments.length ? (e = typeof i == "function" ? i : vt(i), r) : e;
  }, r.size = function(i) {
    return arguments.length ? (t = typeof i == "function" ? i : vt(+i), r) : t;
  }, r.context = function(i) {
    return arguments.length ? (n = i == null ? null : i, r) : n;
  }, r;
}
function Dr() {
}
function Qa(e, t, n) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + n) / 6
  );
}
function bu(e) {
  this._context = e;
}
bu.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        Qa(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function eb(e) {
  return new bu(e);
}
function Lh(e) {
  this._context = e;
}
Lh.prototype = {
  areaStart: Dr,
  areaEnd: Dr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function tb(e) {
  return new Lh(e);
}
function Gh(e) {
  this._context = e;
}
Gh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
        break;
      case 3:
        this._point = 4;
      default:
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function nb(e) {
  return new Gh(e);
}
function jh(e, t) {
  this._basis = new bu(e), this._beta = t;
}
jh.prototype = {
  lineStart: function() {
    this._x = [], this._y = [], this._basis.lineStart();
  },
  lineEnd: function() {
    var e = this._x, t = this._y, n = e.length - 1;
    if (n > 0)
      for (var r = e[0], i = t[0], o = e[n] - r, a = t[n] - i, u = -1, f; ++u <= n; )
        f = u / n, this._basis.point(
          this._beta * e[u] + (1 - this._beta) * (r + f * o),
          this._beta * t[u] + (1 - this._beta) * (i + f * a)
        );
    this._x = this._y = null, this._basis.lineEnd();
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
const rb = function e(t) {
  function n(r) {
    return t === 1 ? new bu(r) : new jh(r, t);
  }
  return n.beta = function(r) {
    return e(+r);
  }, n;
}(0.85);
function Za(e, t, n) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - n),
    e._x2,
    e._y2
  );
}
function wc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
wc.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        Za(this, this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2, this._x1 = e, this._y1 = t;
        break;
      case 2:
        this._point = 3;
      default:
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ib = function e(t) {
  function n(r) {
    return new wc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function xc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
xc.prototype = {
  areaStart: Dr,
  areaEnd: Dr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ob = function e(t) {
  function n(r) {
    return new xc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function _c(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
_c.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ab = function e(t) {
  function n(r) {
    return new _c(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function Sc(e, t, n) {
  var r = e._x1, i = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > Jt) {
    var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, f = 3 * e._l01_a * (e._l01_a + e._l12_a);
    r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / f, i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / f;
  }
  if (e._l23_a > Jt) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, a = (a * c + e._y1 * e._l23_2a - n * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(r, i, o, a, e._x2, e._y2);
}
function Hh(e, t) {
  this._context = e, this._alpha = t;
}
Hh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var n = this._x2 - e, r = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(n * n + r * r, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        Sc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ub = function e(t) {
  function n(r) {
    return t ? new Hh(r, t) : new wc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Wh(e, t) {
  this._context = e, this._alpha = t;
}
Wh.prototype = {
  areaStart: Dr,
  areaEnd: Dr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var n = this._x2 - e, r = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(n * n + r * r, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        Sc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const sb = function e(t) {
  function n(r) {
    return t ? new Wh(r, t) : new xc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Uh(e, t) {
  this._context = e, this._alpha = t;
}
Uh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var n = this._x2 - e, r = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(n * n + r * r, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        Sc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const lb = function e(t) {
  function n(r) {
    return t ? new Uh(r, t) : new _c(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Vh(e) {
  this._context = e;
}
Vh.prototype = {
  areaStart: Dr,
  areaEnd: Dr,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function cb(e) {
  return new Vh(e);
}
function dd(e) {
  return e < 0 ? -1 : 1;
}
function pd(e, t, n) {
  var r = e._x1 - e._x0, i = t - e._x1, o = (e._y1 - e._y0) / (r || i < 0 && -0), a = (n - e._y1) / (i || r < 0 && -0), u = (o * i + a * r) / (r + i);
  return (dd(o) + dd(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(u)) || 0;
}
function hd(e, t) {
  var n = e._x1 - e._x0;
  return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Fs(e, t, n) {
  var r = e._x0, i = e._y0, o = e._x1, a = e._y1, u = (o - r) / 3;
  e._context.bezierCurveTo(r + u, i + u * t, o - u, a - u * n, o, a);
}
function Ja(e) {
  this._context = e;
}
Ja.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Fs(this, this._t0, hd(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var n = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Fs(this, hd(this, n = pd(this, e, t)), n);
          break;
        default:
          Fs(this, this._t0, n = pd(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
    }
  }
};
function qh(e) {
  this._context = new Yh(e);
}
(qh.prototype = Object.create(Ja.prototype)).point = function(e, t) {
  Ja.prototype.point.call(this, t, e);
};
function Yh(e) {
  this._context = e;
}
Yh.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, n, r, i, o) {
    this._context.bezierCurveTo(t, e, r, n, o, i);
  }
};
function fb(e) {
  return new Ja(e);
}
function db(e) {
  return new qh(e);
}
function Xh(e) {
  this._context = e;
}
Xh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, n = e.length;
    if (n)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var r = vd(e), i = vd(t), o = 0, a = 1; a < n; ++o, ++a)
          this._context.bezierCurveTo(r[0][o], i[0][o], r[1][o], i[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function vd(e) {
  var t, n = e.length - 1, r, i = new Array(n), o = new Array(n), a = new Array(n);
  for (i[0] = 0, o[0] = 2, a[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t)
    i[t] = 1, o[t] = 4, a[t] = 4 * e[t] + 2 * e[t + 1];
  for (i[n - 1] = 2, o[n - 1] = 7, a[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t)
    r = i[t] / o[t - 1], o[t] -= r, a[t] -= r * a[t - 1];
  for (i[n - 1] = a[n - 1] / o[n - 1], t = n - 2; t >= 0; --t)
    i[t] = (a[t] - i[t + 1]) / o[t];
  for (o[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t)
    o[t] = 2 * e[t + 1] - i[t + 1];
  return [i, o];
}
function pb(e) {
  return new Xh(e);
}
function wu(e, t) {
  this._context = e, this._t = t;
}
wu.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var n = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(n, this._y), this._context.lineTo(n, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function hb(e) {
  return new wu(e, 0.5);
}
function vb(e) {
  return new wu(e, 0);
}
function gb(e) {
  return new wu(e, 1);
}
function Ai(e, t) {
  if ((a = e.length) > 1)
    for (var n = 1, r, i, o = e[t[0]], a, u = o.length; n < a; ++n)
      for (i = o, o = e[t[n]], r = 0; r < u; ++r)
        o[r][1] += o[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
function ki(e) {
  for (var t = e.length, n = new Array(t); --t >= 0; )
    n[t] = t;
  return n;
}
function mb(e, t) {
  return e[t];
}
function yb() {
  var e = vt([]), t = ki, n = Ai, r = mb;
  function i(o) {
    var a = e.apply(this, arguments), u, f = o.length, c = a.length, h = new Array(c), p;
    for (u = 0; u < c; ++u) {
      for (var w = a[u], P = h[u] = new Array(f), _ = 0, T; _ < f; ++_)
        P[_] = T = [0, +r(o[_], w, _, o)], T.data = o[_];
      P.key = w;
    }
    for (u = 0, p = t(h); u < c; ++u)
      h[p[u]].index = u;
    return n(h, p), h;
  }
  return i.keys = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : vt(bl.call(o)), i) : e;
  }, i.value = function(o) {
    return arguments.length ? (r = typeof o == "function" ? o : vt(+o), i) : r;
  }, i.order = function(o) {
    return arguments.length ? (t = o == null ? ki : typeof o == "function" ? o : vt(bl.call(o)), i) : t;
  }, i.offset = function(o) {
    return arguments.length ? (n = o == null ? Ai : o, i) : n;
  }, i;
}
function bb(e, t) {
  if ((r = e.length) > 0) {
    for (var n, r, i = 0, o = e[0].length, a; i < o; ++i) {
      for (a = n = 0; n < r; ++n)
        a += e[n][i][1] || 0;
      if (a)
        for (n = 0; n < r; ++n)
          e[n][i][1] /= a;
    }
    Ai(e, t);
  }
}
function wb(e, t) {
  if ((f = e.length) > 0)
    for (var n, r = 0, i, o, a, u, f, c = e[t[0]].length; r < c; ++r)
      for (a = u = 0, n = 0; n < f; ++n)
        (o = (i = e[t[n]][r])[1] - i[0]) > 0 ? (i[0] = a, i[1] = a += o) : o < 0 ? (i[1] = u, i[0] = u += o) : (i[0] = 0, i[1] = o);
}
function xb(e, t) {
  if ((i = e.length) > 0) {
    for (var n = 0, r = e[t[0]], i, o = r.length; n < o; ++n) {
      for (var a = 0, u = 0; a < i; ++a)
        u += e[a][n][1] || 0;
      r[n][1] += r[n][0] = -u / 2;
    }
    Ai(e, t);
  }
}
function _b(e, t) {
  if (!(!((a = e.length) > 0) || !((o = (i = e[t[0]]).length) > 0))) {
    for (var n = 0, r = 1, i, o, a; r < o; ++r) {
      for (var u = 0, f = 0, c = 0; u < a; ++u) {
        for (var h = e[t[u]], p = h[r][1] || 0, w = h[r - 1][1] || 0, P = (p - w) / 2, _ = 0; _ < u; ++_) {
          var T = e[t[_]], I = T[r][1] || 0, k = T[r - 1][1] || 0;
          P += I - k;
        }
        f += p, c += P * p;
      }
      i[r - 1][1] += i[r - 1][0] = n, f && (n -= c / f);
    }
    i[r - 1][1] += i[r - 1][0] = n, Ai(e, t);
  }
}
function Kh(e) {
  var t = e.map(Sb);
  return ki(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function Sb(e) {
  for (var t = -1, n = 0, r = e.length, i, o = -1 / 0; ++t < r; )
    (i = +e[t][1]) > o && (o = i, n = t);
  return n;
}
function Qh(e) {
  var t = e.map(Zh);
  return ki(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function Zh(e) {
  for (var t = 0, n = -1, r = e.length, i; ++n < r; )
    (i = +e[n][1]) && (t += i);
  return t;
}
function Rb(e) {
  return Qh(e).reverse();
}
function Cb(e) {
  var t = e.length, n, r, i = e.map(Zh), o = Kh(e), a = 0, u = 0, f = [], c = [];
  for (n = 0; n < t; ++n)
    r = o[n], a < u ? (a += i[r], f.push(r)) : (u += i[r], c.push(r));
  return c.reverse().concat(f);
}
function Pb(e) {
  return ki(e).reverse();
}
const Tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arc: Fy,
  area: Eh,
  line: gc,
  pie: Dy,
  areaRadial: fd,
  radialArea: fd,
  lineRadial: cd,
  radialLine: cd,
  pointRadial: _o,
  linkHorizontal: Wy,
  linkVertical: Uy,
  linkRadial: Vy,
  symbol: Jy,
  symbols: Zy,
  symbolCircle: bc,
  symbolCross: Ah,
  symbolDiamond: $h,
  symbolSquare: Bh,
  symbolStar: Ih,
  symbolTriangle: Dh,
  symbolWye: zh,
  curveBasisClosed: tb,
  curveBasisOpen: nb,
  curveBasis: eb,
  curveBundle: rb,
  curveCardinalClosed: ob,
  curveCardinalOpen: ab,
  curveCardinal: ib,
  curveCatmullRomClosed: sb,
  curveCatmullRomOpen: lb,
  curveCatmullRom: ub,
  curveLinearClosed: cb,
  curveLinear: yu,
  curveMonotoneX: fb,
  curveMonotoneY: db,
  curveNatural: pb,
  curveStep: hb,
  curveStepAfter: gb,
  curveStepBefore: vb,
  stack: yb,
  stackOffsetExpand: bb,
  stackOffsetDiverging: wb,
  stackOffsetNone: Ai,
  stackOffsetSilhouette: xb,
  stackOffsetWiggle: _b,
  stackOrderAppearance: Kh,
  stackOrderAscending: Qh,
  stackOrderDescending: Rb,
  stackOrderInsideOut: Cb,
  stackOrderNone: ki,
  stackOrderReverse: Pb
}, Symbol.toStringTag, { value: "Module" }));
function qo(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function xu(e) {
  let t = e, n = e;
  e.length === 1 && (t = (a, u) => e(a) - u, n = Nb(e));
  function r(a, u, f, c) {
    for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
      const h = f + c >>> 1;
      n(a[h], u) < 0 ? f = h + 1 : c = h;
    }
    return f;
  }
  function i(a, u, f, c) {
    for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
      const h = f + c >>> 1;
      n(a[h], u) > 0 ? c = h : f = h + 1;
    }
    return f;
  }
  function o(a, u, f, c) {
    f == null && (f = 0), c == null && (c = a.length);
    const h = r(a, u, f, c - 1);
    return h > f && t(a[h - 1], u) > -t(a[h], u) ? h - 1 : h;
  }
  return { left: r, center: o, right: i };
}
function Nb(e) {
  return (t, n) => qo(e(t), n);
}
function Jh(e) {
  return e === null ? NaN : +e;
}
function* Eb(e, t) {
  if (t === void 0)
    for (let n of e)
      n != null && (n = +n) >= n && (yield n);
  else {
    let n = -1;
    for (let r of e)
      (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
  }
}
const ev = xu(qo), Mb = ev.right, Ob = ev.left;
xu(Jh).center;
const Yo = Mb;
function gd(e, t) {
  let n, r;
  if (t === void 0)
    for (const i of e)
      i != null && (n === void 0 ? i >= i && (n = r = i) : (n > i && (n = i), r < i && (r = i)));
  else {
    let i = -1;
    for (let o of e)
      (o = t(o, ++i, e)) != null && (n === void 0 ? o >= o && (n = r = o) : (n > o && (n = o), r < o && (r = o)));
  }
  return [n, r];
}
var xl = Math.sqrt(50), _l = Math.sqrt(10), Sl = Math.sqrt(2);
function Rl(e, t, n) {
  var r, i = -1, o, a, u;
  if (t = +t, e = +e, n = +n, e === t && n > 0)
    return [e];
  if ((r = t < e) && (o = e, e = t, t = o), (u = tv(e, t, n)) === 0 || !isFinite(u))
    return [];
  if (u > 0) {
    let f = Math.round(e / u), c = Math.round(t / u);
    for (f * u < e && ++f, c * u > t && --c, a = new Array(o = c - f + 1); ++i < o; )
      a[i] = (f + i) * u;
  } else {
    u = -u;
    let f = Math.round(e * u), c = Math.round(t * u);
    for (f / u < e && ++f, c / u > t && --c, a = new Array(o = c - f + 1); ++i < o; )
      a[i] = (f + i) / u;
  }
  return r && a.reverse(), a;
}
function tv(e, t, n) {
  var r = (t - e) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), o = r / Math.pow(10, i);
  return i >= 0 ? (o >= xl ? 10 : o >= _l ? 5 : o >= Sl ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (o >= xl ? 10 : o >= _l ? 5 : o >= Sl ? 2 : 1);
}
function Cl(e, t, n) {
  var r = Math.abs(t - e) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), o = r / i;
  return o >= xl ? i *= 10 : o >= _l ? i *= 5 : o >= Sl && (i *= 2), t < e ? -i : i;
}
function md(e, t) {
  let n;
  if (t === void 0)
    for (const r of e)
      r != null && (n < r || n === void 0 && r >= r) && (n = r);
  else {
    let r = -1;
    for (let i of e)
      (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
  }
  return n;
}
function yd(e, t) {
  let n;
  if (t === void 0)
    for (const r of e)
      r != null && (n > r || n === void 0 && r >= r) && (n = r);
  else {
    let r = -1;
    for (let i of e)
      (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
  }
  return n;
}
function nv(e, t, n = 0, r = e.length - 1, i = qo) {
  for (; r > n; ) {
    if (r - n > 600) {
      const f = r - n + 1, c = t - n + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), w = 0.5 * Math.sqrt(h * p * (f - p) / f) * (c - f / 2 < 0 ? -1 : 1), P = Math.max(n, Math.floor(t - c * p / f + w)), _ = Math.min(r, Math.floor(t + (f - c) * p / f + w));
      nv(e, t, P, _, i);
    }
    const o = e[t];
    let a = n, u = r;
    for (oo(e, n, t), i(e[r], o) > 0 && oo(e, n, r); a < u; ) {
      for (oo(e, a, u), ++a, --u; i(e[a], o) < 0; )
        ++a;
      for (; i(e[u], o) > 0; )
        --u;
    }
    i(e[n], o) === 0 ? oo(e, n, u) : (++u, oo(e, u, r)), u <= t && (n = u + 1), t <= u && (r = u - 1);
  }
  return e;
}
function oo(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function Ab(e, t, n) {
  if (e = Float64Array.from(Eb(e, n)), !!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return yd(e);
    if (t >= 1)
      return md(e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = md(nv(e, o).subarray(0, o + 1)), u = yd(e.subarray(o + 1));
    return a + (u - a) * (i - o);
  }
}
function kb(e, t, n = Jh) {
  if (!!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return +n(e[0], 0, e);
    if (t >= 1)
      return +n(e[r - 1], r - 1, e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = +n(e[o], o, e), u = +n(e[o + 1], o + 1, e);
    return a + (u - a) * (i - o);
  }
}
function rv(e, t, n) {
  e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, o = new Array(i); ++r < i; )
    o[r] = e + r * n;
  return o;
}
function En(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function vr(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
      break;
    }
  }
  return this;
}
const Pl = Symbol("implicit");
function _u() {
  var e = /* @__PURE__ */ new Map(), t = [], n = [], r = Pl;
  function i(o) {
    var a = o + "", u = e.get(a);
    if (!u) {
      if (r !== Pl)
        return r;
      e.set(a, u = t.push(o));
    }
    return n[(u - 1) % n.length];
  }
  return i.domain = function(o) {
    if (!arguments.length)
      return t.slice();
    t = [], e = /* @__PURE__ */ new Map();
    for (const a of o) {
      const u = a + "";
      e.has(u) || e.set(u, t.push(a));
    }
    return i;
  }, i.range = function(o) {
    return arguments.length ? (n = Array.from(o), i) : n.slice();
  }, i.unknown = function(o) {
    return arguments.length ? (r = o, i) : r;
  }, i.copy = function() {
    return _u(t, n).unknown(r);
  }, En.apply(i, arguments), i;
}
function Su() {
  var e = _u().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, o, a, u = !1, f = 0, c = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var w = t().length, P = i < r, _ = P ? i : r, T = P ? r : i;
    o = (T - _) / Math.max(1, w - f + c * 2), u && (o = Math.floor(o)), _ += (T - _ - o * (w - f)) * h, a = o * (1 - f), u && (_ = Math.round(_), a = Math.round(a));
    var I = rv(w).map(function(k) {
      return _ + o * k;
    });
    return n(P ? I.reverse() : I);
  }
  return e.domain = function(w) {
    return arguments.length ? (t(w), p()) : t();
  }, e.range = function(w) {
    return arguments.length ? ([r, i] = w, r = +r, i = +i, p()) : [r, i];
  }, e.rangeRound = function(w) {
    return [r, i] = w, r = +r, i = +i, u = !0, p();
  }, e.bandwidth = function() {
    return a;
  }, e.step = function() {
    return o;
  }, e.round = function(w) {
    return arguments.length ? (u = !!w, p()) : u;
  }, e.padding = function(w) {
    return arguments.length ? (f = Math.min(1, c = +w), p()) : f;
  }, e.paddingInner = function(w) {
    return arguments.length ? (f = Math.min(1, w), p()) : f;
  }, e.paddingOuter = function(w) {
    return arguments.length ? (c = +w, p()) : c;
  }, e.align = function(w) {
    return arguments.length ? (h = Math.max(0, Math.min(1, w)), p()) : h;
  }, e.copy = function() {
    return Su(t(), [r, i]).round(u).paddingInner(f).paddingOuter(c).align(h);
  }, En.apply(p(), arguments);
}
function iv(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return iv(t());
  }, e;
}
function ov() {
  return iv(Su.apply(null, arguments).paddingInner(1));
}
function zi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Xo(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t)
    n[r] = t[r];
  return n;
}
function zr() {
}
var ti = 0.7, $i = 1 / ti, Ti = "\\s*([+-]?\\d+)\\s*", $o = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", Jn = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", $b = /^#([0-9a-f]{3,8})$/, Fb = new RegExp("^rgb\\(" + [Ti, Ti, Ti] + "\\)$"), Ib = new RegExp("^rgb\\(" + [Jn, Jn, Jn] + "\\)$"), Bb = new RegExp("^rgba\\(" + [Ti, Ti, Ti, $o] + "\\)$"), Db = new RegExp("^rgba\\(" + [Jn, Jn, Jn, $o] + "\\)$"), zb = new RegExp("^hsl\\(" + [$o, Jn, Jn] + "\\)$"), Lb = new RegExp("^hsla\\(" + [$o, Jn, Jn, $o] + "\\)$"), bd = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
zi(zr, Fo, {
  copy: function(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: wd,
  formatHex: wd,
  formatHsl: Gb,
  formatRgb: xd,
  toString: xd
});
function wd() {
  return this.rgb().formatHex();
}
function Gb() {
  return av(this).formatHsl();
}
function xd() {
  return this.rgb().formatRgb();
}
function Fo(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = $b.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? _d(t) : n === 3 ? new Kt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Aa(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Aa(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Fb.exec(e)) ? new Kt(t[1], t[2], t[3], 1) : (t = Ib.exec(e)) ? new Kt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Bb.exec(e)) ? Aa(t[1], t[2], t[3], t[4]) : (t = Db.exec(e)) ? Aa(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = zb.exec(e)) ? Cd(t[1], t[2] / 100, t[3] / 100, 1) : (t = Lb.exec(e)) ? Cd(t[1], t[2] / 100, t[3] / 100, t[4]) : bd.hasOwnProperty(e) ? _d(bd[e]) : e === "transparent" ? new Kt(NaN, NaN, NaN, 0) : null;
}
function _d(e) {
  return new Kt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Aa(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Kt(e, t, n, r);
}
function Rc(e) {
  return e instanceof zr || (e = Fo(e)), e ? (e = e.rgb(), new Kt(e.r, e.g, e.b, e.opacity)) : new Kt();
}
function eu(e, t, n, r) {
  return arguments.length === 1 ? Rc(e) : new Kt(e, t, n, r == null ? 1 : r);
}
function Kt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
zi(Kt, eu, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? $i : Math.pow($i, e), new Kt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ti : Math.pow(ti, e), new Kt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Sd,
  formatHex: Sd,
  formatRgb: Rd,
  toString: Rd
}));
function Sd() {
  return "#" + Is(this.r) + Is(this.g) + Is(this.b);
}
function Rd() {
  var e = this.opacity;
  return e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)), (e === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (e === 1 ? ")" : ", " + e + ")");
}
function Is(e) {
  return e = Math.max(0, Math.min(255, Math.round(e) || 0)), (e < 16 ? "0" : "") + e.toString(16);
}
function Cd(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Qn(e, t, n, r);
}
function av(e) {
  if (e instanceof Qn)
    return new Qn(e.h, e.s, e.l, e.opacity);
  if (e instanceof zr || (e = Fo(e)), !e)
    return new Qn();
  if (e instanceof Qn)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), a = NaN, u = o - i, f = (o + i) / 2;
  return u ? (t === o ? a = (n - r) / u + (n < r) * 6 : n === o ? a = (r - t) / u + 2 : a = (t - n) / u + 4, u /= f < 0.5 ? o + i : 2 - o - i, a *= 60) : u = f > 0 && f < 1 ? 0 : a, new Qn(a, u, f, e.opacity);
}
function Tl(e, t, n, r) {
  return arguments.length === 1 ? av(e) : new Qn(e, t, n, r == null ? 1 : r);
}
function Qn(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
zi(Qn, Tl, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? $i : Math.pow($i, e), new Qn(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ti : Math.pow(ti, e), new Qn(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Kt(
      Bs(e >= 240 ? e - 240 : e + 120, i, r),
      Bs(e, i, r),
      Bs(e < 120 ? e + 240 : e - 120, i, r),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl: function() {
    var e = this.opacity;
    return e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)), (e === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (e === 1 ? ")" : ", " + e + ")");
  }
}));
function Bs(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
var uv = Math.PI / 180, sv = 180 / Math.PI, tu = 18, lv = 0.96422, cv = 1, fv = 0.82521, dv = 4 / 29, Ni = 6 / 29, pv = 3 * Ni * Ni, jb = Ni * Ni * Ni;
function hv(e) {
  if (e instanceof er)
    return new er(e.l, e.a, e.b, e.opacity);
  if (e instanceof lr)
    return vv(e);
  e instanceof Kt || (e = Rc(e));
  var t = Gs(e.r), n = Gs(e.g), r = Gs(e.b), i = Ds((0.2225045 * t + 0.7168786 * n + 0.0606169 * r) / cv), o, a;
  return t === n && n === r ? o = a = i : (o = Ds((0.4360747 * t + 0.3850649 * n + 0.1430804 * r) / lv), a = Ds((0.0139322 * t + 0.0971045 * n + 0.7141733 * r) / fv)), new er(116 * i - 16, 500 * (o - i), 200 * (i - a), e.opacity);
}
function Nl(e, t, n, r) {
  return arguments.length === 1 ? hv(e) : new er(e, t, n, r == null ? 1 : r);
}
function er(e, t, n, r) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
zi(er, Nl, Xo(zr, {
  brighter: function(e) {
    return new er(this.l + tu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  darker: function(e) {
    return new er(this.l - tu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = lv * zs(t), e = cv * zs(e), n = fv * zs(n), new Kt(
      Ls(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
      Ls(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
      Ls(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
      this.opacity
    );
  }
}));
function Ds(e) {
  return e > jb ? Math.pow(e, 1 / 3) : e / pv + dv;
}
function zs(e) {
  return e > Ni ? e * e * e : pv * (e - dv);
}
function Ls(e) {
  return 255 * (e <= 31308e-7 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);
}
function Gs(e) {
  return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function Hb(e) {
  if (e instanceof lr)
    return new lr(e.h, e.c, e.l, e.opacity);
  if (e instanceof er || (e = hv(e)), e.a === 0 && e.b === 0)
    return new lr(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
  var t = Math.atan2(e.b, e.a) * sv;
  return new lr(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function El(e, t, n, r) {
  return arguments.length === 1 ? Hb(e) : new lr(e, t, n, r == null ? 1 : r);
}
function lr(e, t, n, r) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function vv(e) {
  if (isNaN(e.h))
    return new er(e.l, 0, 0, e.opacity);
  var t = e.h * uv;
  return new er(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
zi(lr, El, Xo(zr, {
  brighter: function(e) {
    return new lr(this.h, this.c, this.l + tu * (e == null ? 1 : e), this.opacity);
  },
  darker: function(e) {
    return new lr(this.h, this.c, this.l - tu * (e == null ? 1 : e), this.opacity);
  },
  rgb: function() {
    return vv(this).rgb();
  }
}));
var gv = -0.14861, Cc = 1.78277, Pc = -0.29227, Ru = -0.90649, Io = 1.97294, Pd = Io * Ru, Td = Io * Cc, Nd = Cc * Pc - Ru * gv;
function Wb(e) {
  if (e instanceof ei)
    return new ei(e.h, e.s, e.l, e.opacity);
  e instanceof Kt || (e = Rc(e));
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (Nd * r + Pd * t - Td * n) / (Nd + Pd - Td), o = r - i, a = (Io * (n - i) - Pc * o) / Ru, u = Math.sqrt(a * a + o * o) / (Io * i * (1 - i)), f = u ? Math.atan2(a, o) * sv - 120 : NaN;
  return new ei(f < 0 ? f + 360 : f, u, i, e.opacity);
}
function Ml(e, t, n, r) {
  return arguments.length === 1 ? Wb(e) : new ei(e, t, n, r == null ? 1 : r);
}
function ei(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
zi(ei, Ml, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? $i : Math.pow($i, e), new ei(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ti : Math.pow(ti, e), new ei(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = isNaN(this.h) ? 0 : (this.h + 120) * uv, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
    return new Kt(
      255 * (t + n * (gv * r + Cc * i)),
      255 * (t + n * (Pc * r + Ru * i)),
      255 * (t + n * (Io * r)),
      this.opacity
    );
  }
}));
function mv(e, t, n, r, i) {
  var o = e * e, a = o * e;
  return ((1 - 3 * e + 3 * o - a) * t + (4 - 6 * o + 3 * a) * n + (1 + 3 * e + 3 * o - 3 * a) * r + a * i) / 6;
}
function yv(e) {
  var t = e.length - 1;
  return function(n) {
    var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, t - 1) : Math.floor(n * t), i = e[r], o = e[r + 1], a = r > 0 ? e[r - 1] : 2 * i - o, u = r < t - 1 ? e[r + 2] : 2 * o - i;
    return mv((n - r / t) * t, a, i, o, u);
  };
}
function bv(e) {
  var t = e.length;
  return function(n) {
    var r = Math.floor(((n %= 1) < 0 ? ++n : n) * t), i = e[(r + t - 1) % t], o = e[r % t], a = e[(r + 1) % t], u = e[(r + 2) % t];
    return mv((n - r / t) * t, i, o, a, u);
  };
}
function Cu(e) {
  return function() {
    return e;
  };
}
function wv(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Ub(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Pu(e, t) {
  var n = t - e;
  return n ? wv(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Cu(isNaN(e) ? t : e);
}
function Vb(e) {
  return (e = +e) == 1 ? Wt : function(t, n) {
    return n - t ? Ub(t, n, e) : Cu(isNaN(t) ? n : t);
  };
}
function Wt(e, t) {
  var n = t - e;
  return n ? wv(e, n) : Cu(isNaN(e) ? t : e);
}
const nu = function e(t) {
  var n = Vb(t);
  function r(i, o) {
    var a = n((i = eu(i)).r, (o = eu(o)).r), u = n(i.g, o.g), f = n(i.b, o.b), c = Wt(i.opacity, o.opacity);
    return function(h) {
      return i.r = a(h), i.g = u(h), i.b = f(h), i.opacity = c(h), i + "";
    };
  }
  return r.gamma = e, r;
}(1);
function xv(e) {
  return function(t) {
    var n = t.length, r = new Array(n), i = new Array(n), o = new Array(n), a, u;
    for (a = 0; a < n; ++a)
      u = eu(t[a]), r[a] = u.r || 0, i[a] = u.g || 0, o[a] = u.b || 0;
    return r = e(r), i = e(i), o = e(o), u.opacity = 1, function(f) {
      return u.r = r(f), u.g = i(f), u.b = o(f), u + "";
    };
  };
}
var qb = xv(yv), Yb = xv(bv);
function Tc(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i)
      r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function _v(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Xb(e, t) {
  return (_v(t) ? Tc : Sv)(e, t);
}
function Sv(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), a;
  for (a = 0; a < r; ++a)
    i[a] = Li(e[a], t[a]);
  for (; a < n; ++a)
    o[a] = t[a];
  return function(u) {
    for (a = 0; a < r; ++a)
      o[a] = i[a](u);
    return o;
  };
}
function Rv(e, t) {
  var n = new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function $n(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Cv(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Li(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n)
      r[i] = n[i](o);
    return r;
  };
}
var Ol = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, js = new RegExp(Ol.source, "g");
function Kb(e) {
  return function() {
    return e;
  };
}
function Qb(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Pv(e, t) {
  var n = Ol.lastIndex = js.lastIndex = 0, r, i, o, a = -1, u = [], f = [];
  for (e = e + "", t = t + ""; (r = Ol.exec(e)) && (i = js.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), u[a] ? u[a] += o : u[++a] = o), (r = r[0]) === (i = i[0]) ? u[a] ? u[a] += i : u[++a] = i : (u[++a] = null, f.push({ i: a, x: $n(r, i) })), n = js.lastIndex;
  return n < t.length && (o = t.slice(n), u[a] ? u[a] += o : u[++a] = o), u.length < 2 ? f[0] ? Qb(f[0].x) : Kb(t) : (t = f.length, function(c) {
    for (var h = 0, p; h < t; ++h)
      u[(p = f[h]).i] = p.x(c);
    return u.join("");
  });
}
function Li(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Cu(t) : (n === "number" ? $n : n === "string" ? (r = Fo(t)) ? (t = r, nu) : Pv : t instanceof Fo ? nu : t instanceof Date ? Rv : _v(t) ? Tc : Array.isArray(t) ? Sv : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Cv : $n)(e, t);
}
function Zb(e) {
  var t = e.length;
  return function(n) {
    return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
  };
}
function Jb(e, t) {
  var n = Pu(+e, +t);
  return function(r) {
    var i = n(r);
    return i - 360 * Math.floor(i / 360);
  };
}
function Ko(e, t) {
  return e = +e, t = +t, function(n) {
    return Math.round(e * (1 - n) + t * n);
  };
}
var Ed = 180 / Math.PI, Al = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Tv(e, t, n, r, i, o) {
  var a, u, f;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (f = e * n + t * r) && (n -= e * f, r -= t * f), (u = Math.sqrt(n * n + r * r)) && (n /= u, r /= u, f /= u), e * r < t * n && (e = -e, t = -t, f = -f, a = -a), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * Ed,
    skewX: Math.atan(f) * Ed,
    scaleX: a,
    scaleY: u
  };
}
var ao, Hs, Md, ka;
function e1(e) {
  return e === "none" ? Al : (ao || (ao = document.createElement("DIV"), Hs = document.documentElement, Md = document.defaultView), ao.style.transform = e, e = Md.getComputedStyle(Hs.appendChild(ao), null).getPropertyValue("transform"), Hs.removeChild(ao), e = e.slice(7, -1).split(","), Tv(+e[0], +e[1], +e[2], +e[3], +e[4], +e[5]));
}
function t1(e) {
  return e == null || (ka || (ka = document.createElementNS("http://www.w3.org/2000/svg", "g")), ka.setAttribute("transform", e), !(e = ka.transform.baseVal.consolidate())) ? Al : (e = e.matrix, Tv(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Nv(e, t, n, r) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, p, w, P, _) {
    if (c !== p || h !== w) {
      var T = P.push("translate(", null, t, null, n);
      _.push({ i: T - 4, x: $n(c, p) }, { i: T - 2, x: $n(h, w) });
    } else
      (p || w) && P.push("translate(" + p + t + w + n);
  }
  function a(c, h, p, w) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), w.push({ i: p.push(i(p) + "rotate(", null, r) - 2, x: $n(c, h) })) : h && p.push(i(p) + "rotate(" + h + r);
  }
  function u(c, h, p, w) {
    c !== h ? w.push({ i: p.push(i(p) + "skewX(", null, r) - 2, x: $n(c, h) }) : h && p.push(i(p) + "skewX(" + h + r);
  }
  function f(c, h, p, w, P, _) {
    if (c !== p || h !== w) {
      var T = P.push(i(P) + "scale(", null, ",", null, ")");
      _.push({ i: T - 4, x: $n(c, p) }, { i: T - 2, x: $n(h, w) });
    } else
      (p !== 1 || w !== 1) && P.push(i(P) + "scale(" + p + "," + w + ")");
  }
  return function(c, h) {
    var p = [], w = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, p, w), a(c.rotate, h.rotate, p, w), u(c.skewX, h.skewX, p, w), f(c.scaleX, c.scaleY, h.scaleX, h.scaleY, p, w), c = h = null, function(P) {
      for (var _ = -1, T = w.length, I; ++_ < T; )
        p[(I = w[_]).i] = I.x(P);
      return p.join("");
    };
  };
}
var n1 = Nv(e1, "px, ", "px)", "deg)"), r1 = Nv(t1, ", ", ")", ")"), uo = Math.SQRT2, Ws = 2, Od = 4, i1 = 1e-12;
function Ad(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function o1(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function a1(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
function u1(e, t) {
  var n = e[0], r = e[1], i = e[2], o = t[0], a = t[1], u = t[2], f = o - n, c = a - r, h = f * f + c * c, p, w;
  if (h < i1)
    w = Math.log(u / i) / uo, p = function(F) {
      return [
        n + F * f,
        r + F * c,
        i * Math.exp(uo * F * w)
      ];
    };
  else {
    var P = Math.sqrt(h), _ = (u * u - i * i + Od * h) / (2 * i * Ws * P), T = (u * u - i * i - Od * h) / (2 * u * Ws * P), I = Math.log(Math.sqrt(_ * _ + 1) - _), k = Math.log(Math.sqrt(T * T + 1) - T);
    w = (k - I) / uo, p = function(F) {
      var N = F * w, G = Ad(I), M = i / (Ws * P) * (G * a1(uo * N + I) - o1(I));
      return [
        n + M * f,
        r + M * c,
        i * G / Ad(uo * N + I)
      ];
    };
  }
  return p.duration = w * 1e3, p;
}
function Ev(e) {
  return function(t, n) {
    var r = e((t = Tl(t)).h, (n = Tl(n)).h), i = Wt(t.s, n.s), o = Wt(t.l, n.l), a = Wt(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.s = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Mv = Ev(Pu);
var Ov = Ev(Wt);
function Av(e, t) {
  var n = Wt((e = Nl(e)).l, (t = Nl(t)).l), r = Wt(e.a, t.a), i = Wt(e.b, t.b), o = Wt(e.opacity, t.opacity);
  return function(a) {
    return e.l = n(a), e.a = r(a), e.b = i(a), e.opacity = o(a), e + "";
  };
}
function kv(e) {
  return function(t, n) {
    var r = e((t = El(t)).h, (n = El(n)).h), i = Wt(t.c, n.c), o = Wt(t.l, n.l), a = Wt(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.c = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const $v = kv(Pu);
var Fv = kv(Wt);
function Iv(e) {
  return function t(n) {
    n = +n;
    function r(i, o) {
      var a = e((i = Ml(i)).h, (o = Ml(o)).h), u = Wt(i.s, o.s), f = Wt(i.l, o.l), c = Wt(i.opacity, o.opacity);
      return function(h) {
        return i.h = a(h), i.s = u(h), i.l = f(Math.pow(h, n)), i.opacity = c(h), i + "";
      };
    }
    return r.gamma = t, r;
  }(1);
}
const Bv = Iv(Pu);
var Dv = Iv(Wt);
function zv(e, t) {
  for (var n = 0, r = t.length - 1, i = t[0], o = new Array(r < 0 ? 0 : r); n < r; )
    o[n] = e(i, i = t[++n]);
  return function(a) {
    var u = Math.max(0, Math.min(r - 1, Math.floor(a *= r)));
    return o[u](a - u);
  };
}
function s1(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r)
    n[r] = e(r / (t - 1));
  return n;
}
const l1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  interpolate: Li,
  interpolateArray: Xb,
  interpolateBasis: yv,
  interpolateBasisClosed: bv,
  interpolateDate: Rv,
  interpolateDiscrete: Zb,
  interpolateHue: Jb,
  interpolateNumber: $n,
  interpolateNumberArray: Tc,
  interpolateObject: Cv,
  interpolateRound: Ko,
  interpolateString: Pv,
  interpolateTransformCss: n1,
  interpolateTransformSvg: r1,
  interpolateZoom: u1,
  interpolateRgb: nu,
  interpolateRgbBasis: qb,
  interpolateRgbBasisClosed: Yb,
  interpolateHsl: Mv,
  interpolateHslLong: Ov,
  interpolateLab: Av,
  interpolateHcl: $v,
  interpolateHclLong: Fv,
  interpolateCubehelix: Bv,
  interpolateCubehelixLong: Dv,
  piecewise: zv,
  quantize: s1
}, Symbol.toStringTag, { value: "Module" }));
function c1(e) {
  return function() {
    return e;
  };
}
function ru(e) {
  return +e;
}
var kd = [0, 1];
function rn(e) {
  return e;
}
function kl(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : c1(isNaN(t) ? NaN : 0.5);
}
function f1(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function d1(e, t, n) {
  var r = e[0], i = e[1], o = t[0], a = t[1];
  return i < r ? (r = kl(i, r), o = n(a, o)) : (r = kl(r, i), o = n(o, a)), function(u) {
    return o(r(u));
  };
}
function p1(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), o = new Array(r), a = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++a < r; )
    i[a] = kl(e[a], e[a + 1]), o[a] = n(t[a], t[a + 1]);
  return function(u) {
    var f = Yo(e, u, 1, r) - 1;
    return o[f](i[f](u));
  };
}
function Qo(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Tu() {
  var e = kd, t = kd, n = Li, r, i, o, a = rn, u, f, c;
  function h() {
    var w = Math.min(e.length, t.length);
    return a !== rn && (a = f1(e[0], e[w - 1])), u = w > 2 ? p1 : d1, f = c = null, p;
  }
  function p(w) {
    return w == null || isNaN(w = +w) ? o : (f || (f = u(e.map(r), t, n)))(r(a(w)));
  }
  return p.invert = function(w) {
    return a(i((c || (c = u(t, e.map(r), $n)))(w)));
  }, p.domain = function(w) {
    return arguments.length ? (e = Array.from(w, ru), h()) : e.slice();
  }, p.range = function(w) {
    return arguments.length ? (t = Array.from(w), h()) : t.slice();
  }, p.rangeRound = function(w) {
    return t = Array.from(w), n = Ko, h();
  }, p.clamp = function(w) {
    return arguments.length ? (a = w ? !0 : rn, h()) : a !== rn;
  }, p.interpolate = function(w) {
    return arguments.length ? (n = w, h()) : n;
  }, p.unknown = function(w) {
    return arguments.length ? (o = w, p) : o;
  }, function(w, P) {
    return r = w, i = P, h();
  };
}
function Nc() {
  return Tu()(rn, rn);
}
function h1(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function iu(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0)
    return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function Fi(e) {
  return e = iu(Math.abs(e)), e ? e[1] : NaN;
}
function v1(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], a = 0, u = e[0], f = 0; i > 0 && u > 0 && (f + u + 1 > r && (u = Math.max(1, r - f)), o.push(n.substring(i -= u, i + u)), !((f += u + 1) > r)); )
      u = e[a = (a + 1) % e.length];
    return o.reverse().join(t);
  };
}
function g1(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var m1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function ou(e) {
  if (!(t = m1.exec(e)))
    throw new Error("invalid format: " + e);
  var t;
  return new Ec({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
ou.prototype = Ec.prototype;
function Ec(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Ec.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function y1(e) {
  e:
    for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
      switch (e[n]) {
        case ".":
          r = i = n;
          break;
        case "0":
          r === 0 && (r = n), i = n;
          break;
        default:
          if (!+e[n])
            break e;
          r > 0 && (r = 0);
          break;
      }
  return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var Lv;
function b1(e, t) {
  var n = iu(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1], o = i - (Lv = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return o === a ? r : o > a ? r + new Array(o - a + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + iu(e, Math.max(0, t + o - 1))[0];
}
function $d(e, t) {
  var n = iu(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Fd = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: h1,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => $d(e * 100, t),
  r: $d,
  s: b1,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function Id(e) {
  return e;
}
var Bd = Array.prototype.map, Dd = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function w1(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? Id : v1(Bd.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? Id : g1(Bd.call(e.numerals, String)), a = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "\u2212" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(p) {
    p = ou(p);
    var w = p.fill, P = p.align, _ = p.sign, T = p.symbol, I = p.zero, k = p.width, F = p.comma, N = p.precision, G = p.trim, M = p.type;
    M === "n" ? (F = !0, M = "g") : Fd[M] || (N === void 0 && (N = 12), G = !0, M = "g"), (I || w === "0" && P === "=") && (I = !0, w = "0", P = "=");
    var D = T === "$" ? n : T === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", te = T === "$" ? r : /[%p]/.test(M) ? a : "", Q = Fd[M], fe = /[defgprs%]/.test(M);
    N = N === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, N)) : Math.max(0, Math.min(20, N));
    function ge(re) {
      var ee = D, be = te, Oe, ut, Ue;
      if (M === "c")
        be = Q(re) + be, re = "";
      else {
        re = +re;
        var st = re < 0 || 1 / re < 0;
        if (re = isNaN(re) ? f : Q(Math.abs(re), N), G && (re = y1(re)), st && +re == 0 && _ !== "+" && (st = !1), ee = (st ? _ === "(" ? _ : u : _ === "-" || _ === "(" ? "" : _) + ee, be = (M === "s" ? Dd[8 + Lv / 3] : "") + be + (st && _ === "(" ? ")" : ""), fe) {
          for (Oe = -1, ut = re.length; ++Oe < ut; )
            if (Ue = re.charCodeAt(Oe), 48 > Ue || Ue > 57) {
              be = (Ue === 46 ? i + re.slice(Oe + 1) : re.slice(Oe)) + be, re = re.slice(0, Oe);
              break;
            }
        }
      }
      F && !I && (re = t(re, 1 / 0));
      var lt = ee.length + re.length + be.length, dt = lt < k ? new Array(k - lt + 1).join(w) : "";
      switch (F && I && (re = t(dt + re, dt.length ? k - be.length : 1 / 0), dt = ""), P) {
        case "<":
          re = ee + re + be + dt;
          break;
        case "=":
          re = ee + dt + re + be;
          break;
        case "^":
          re = dt.slice(0, lt = dt.length >> 1) + ee + re + be + dt.slice(lt);
          break;
        default:
          re = dt + ee + re + be;
          break;
      }
      return o(re);
    }
    return ge.toString = function() {
      return p + "";
    }, ge;
  }
  function h(p, w) {
    var P = c((p = ou(p), p.type = "f", p)), _ = Math.max(-8, Math.min(8, Math.floor(Fi(w) / 3))) * 3, T = Math.pow(10, -_), I = Dd[8 + _ / 3];
    return function(k) {
      return P(T * k) + I;
    };
  }
  return {
    format: c,
    formatPrefix: h
  };
}
var $a, Mc, Gv;
x1({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function x1(e) {
  return $a = w1(e), Mc = $a.format, Gv = $a.formatPrefix, $a;
}
function _1(e) {
  return Math.max(0, -Fi(Math.abs(e)));
}
function S1(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Fi(t) / 3))) * 3 - Fi(Math.abs(e)));
}
function R1(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Fi(t) - Fi(e)) + 1;
}
function jv(e, t, n, r) {
  var i = Cl(e, t, n), o;
  switch (r = ou(r == null ? ",f" : r), r.type) {
    case "s": {
      var a = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = S1(i, a)) && (r.precision = o), Gv(r, a);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = R1(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = _1(i)) && (r.precision = o - (r.type === "%") * 2);
      break;
    }
  }
  return Mc(r);
}
function Lr(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return Rl(r[0], r[r.length - 1], n == null ? 10 : n);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return jv(i[0], i[i.length - 1], n == null ? 10 : n, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, a = r[i], u = r[o], f, c, h = 10;
    for (u < a && (c = a, a = u, u = c, c = i, i = o, o = c); h-- > 0; ) {
      if (c = tv(a, u, n), c === f)
        return r[i] = a, r[o] = u, t(r);
      if (c > 0)
        a = Math.floor(a / c) * c, u = Math.ceil(u / c) * c;
      else if (c < 0)
        a = Math.ceil(a * c) / c, u = Math.floor(u * c) / c;
      else
        break;
      f = c;
    }
    return e;
  }, e;
}
function Oc() {
  var e = Nc();
  return e.copy = function() {
    return Qo(e, Oc());
  }, En.apply(e, arguments), Lr(e);
}
function Hv(e) {
  var t;
  function n(r) {
    return r == null || isNaN(r = +r) ? t : r;
  }
  return n.invert = n, n.domain = n.range = function(r) {
    return arguments.length ? (e = Array.from(r, ru), n) : e.slice();
  }, n.unknown = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.copy = function() {
    return Hv(e).unknown(t);
  }, e = arguments.length ? Array.from(e, ru) : [0, 1], Lr(n);
}
function Wv(e, t) {
  e = e.slice();
  var n = 0, r = e.length - 1, i = e[n], o = e[r], a;
  return o < i && (a = n, n = r, r = a, a = i, i = o, o = a), e[n] = t.floor(i), e[r] = t.ceil(o), e;
}
function zd(e) {
  return Math.log(e);
}
function Ld(e) {
  return Math.exp(e);
}
function C1(e) {
  return -Math.log(-e);
}
function P1(e) {
  return -Math.exp(-e);
}
function T1(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function N1(e) {
  return e === 10 ? T1 : e === Math.E ? Math.exp : function(t) {
    return Math.pow(e, t);
  };
}
function E1(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), function(t) {
    return Math.log(t) / e;
  });
}
function Gd(e) {
  return function(t) {
    return -e(-t);
  };
}
function Ac(e) {
  var t = e(zd, Ld), n = t.domain, r = 10, i, o;
  function a() {
    return i = E1(r), o = N1(r), n()[0] < 0 ? (i = Gd(i), o = Gd(o), e(C1, P1)) : e(zd, Ld), t;
  }
  return t.base = function(u) {
    return arguments.length ? (r = +u, a()) : r;
  }, t.domain = function(u) {
    return arguments.length ? (n(u), a()) : n();
  }, t.ticks = function(u) {
    var f = n(), c = f[0], h = f[f.length - 1], p;
    (p = h < c) && (w = c, c = h, h = w);
    var w = i(c), P = i(h), _, T, I, k = u == null ? 10 : +u, F = [];
    if (!(r % 1) && P - w < k) {
      if (w = Math.floor(w), P = Math.ceil(P), c > 0) {
        for (; w <= P; ++w)
          for (T = 1, _ = o(w); T < r; ++T)
            if (I = _ * T, !(I < c)) {
              if (I > h)
                break;
              F.push(I);
            }
      } else
        for (; w <= P; ++w)
          for (T = r - 1, _ = o(w); T >= 1; --T)
            if (I = _ * T, !(I < c)) {
              if (I > h)
                break;
              F.push(I);
            }
      F.length * 2 < k && (F = Rl(c, h, k));
    } else
      F = Rl(w, P, Math.min(P - w, k)).map(o);
    return p ? F.reverse() : F;
  }, t.tickFormat = function(u, f) {
    if (f == null && (f = r === 10 ? ".0e" : ","), typeof f != "function" && (f = Mc(f)), u === 1 / 0)
      return f;
    u == null && (u = 10);
    var c = Math.max(1, r * u / t.ticks().length);
    return function(h) {
      var p = h / o(Math.round(i(h)));
      return p * r < r - 0.5 && (p *= r), p <= c ? f(h) : "";
    };
  }, t.nice = function() {
    return n(Wv(n(), {
      floor: function(u) {
        return o(Math.floor(i(u)));
      },
      ceil: function(u) {
        return o(Math.ceil(i(u)));
      }
    }));
  }, t;
}
function kc() {
  var e = Ac(Tu()).domain([1, 10]);
  return e.copy = function() {
    return Qo(e, kc()).base(e.base());
  }, En.apply(e, arguments), e;
}
function jd(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function Hd(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function $c(e) {
  var t = 1, n = e(jd(t), Hd(t));
  return n.constant = function(r) {
    return arguments.length ? e(jd(t = +r), Hd(t)) : t;
  }, Lr(n);
}
function Fc() {
  var e = $c(Tu());
  return e.copy = function() {
    return Qo(e, Fc()).constant(e.constant());
  }, En.apply(e, arguments);
}
function Wd(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function M1(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function O1(e) {
  return e < 0 ? -e * e : e * e;
}
function Ic(e) {
  var t = e(rn, rn), n = 1;
  function r() {
    return n === 1 ? e(rn, rn) : n === 0.5 ? e(M1, O1) : e(Wd(n), Wd(1 / n));
  }
  return t.exponent = function(i) {
    return arguments.length ? (n = +i, r()) : n;
  }, Lr(t);
}
function Nu() {
  var e = Ic(Tu());
  return e.copy = function() {
    return Qo(e, Nu()).exponent(e.exponent());
  }, En.apply(e, arguments), e;
}
function Uv() {
  return Nu.apply(null, arguments).exponent(0.5);
}
function Ud(e) {
  return Math.sign(e) * e * e;
}
function A1(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function Vv() {
  var e = Nc(), t = [0, 1], n = !1, r;
  function i(o) {
    var a = A1(e(o));
    return isNaN(a) ? r : n ? Math.round(a) : a;
  }
  return i.invert = function(o) {
    return e.invert(Ud(o));
  }, i.domain = function(o) {
    return arguments.length ? (e.domain(o), i) : e.domain();
  }, i.range = function(o) {
    return arguments.length ? (e.range((t = Array.from(o, ru)).map(Ud)), i) : t.slice();
  }, i.rangeRound = function(o) {
    return i.range(o).round(!0);
  }, i.round = function(o) {
    return arguments.length ? (n = !!o, i) : n;
  }, i.clamp = function(o) {
    return arguments.length ? (e.clamp(o), i) : e.clamp();
  }, i.unknown = function(o) {
    return arguments.length ? (r = o, i) : r;
  }, i.copy = function() {
    return Vv(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
  }, En.apply(i, arguments), Lr(i);
}
function Bc() {
  var e = [], t = [], n = [], r;
  function i() {
    var a = 0, u = Math.max(1, t.length);
    for (n = new Array(u - 1); ++a < u; )
      n[a - 1] = kb(e, a / u);
    return o;
  }
  function o(a) {
    return a == null || isNaN(a = +a) ? r : t[Yo(n, a)];
  }
  return o.invertExtent = function(a) {
    var u = t.indexOf(a);
    return u < 0 ? [NaN, NaN] : [
      u > 0 ? n[u - 1] : e[0],
      u < n.length ? n[u] : e[e.length - 1]
    ];
  }, o.domain = function(a) {
    if (!arguments.length)
      return e.slice();
    e = [];
    for (let u of a)
      u != null && !isNaN(u = +u) && e.push(u);
    return e.sort(qo), i();
  }, o.range = function(a) {
    return arguments.length ? (t = Array.from(a), i()) : t.slice();
  }, o.unknown = function(a) {
    return arguments.length ? (r = a, o) : r;
  }, o.quantiles = function() {
    return n.slice();
  }, o.copy = function() {
    return Bc().domain(e).range(t).unknown(r);
  }, En.apply(o, arguments);
}
function Dc() {
  var e = 0, t = 1, n = 1, r = [0.5], i = [0, 1], o;
  function a(f) {
    return f != null && f <= f ? i[Yo(r, f, 0, n)] : o;
  }
  function u() {
    var f = -1;
    for (r = new Array(n); ++f < n; )
      r[f] = ((f + 1) * t - (f - n) * e) / (n + 1);
    return a;
  }
  return a.domain = function(f) {
    return arguments.length ? ([e, t] = f, e = +e, t = +t, u()) : [e, t];
  }, a.range = function(f) {
    return arguments.length ? (n = (i = Array.from(f)).length - 1, u()) : i.slice();
  }, a.invertExtent = function(f) {
    var c = i.indexOf(f);
    return c < 0 ? [NaN, NaN] : c < 1 ? [e, r[0]] : c >= n ? [r[n - 1], t] : [r[c - 1], r[c]];
  }, a.unknown = function(f) {
    return arguments.length && (o = f), a;
  }, a.thresholds = function() {
    return r.slice();
  }, a.copy = function() {
    return Dc().domain([e, t]).range(i).unknown(o);
  }, En.apply(Lr(a), arguments);
}
function zc() {
  var e = [0.5], t = [0, 1], n, r = 1;
  function i(o) {
    return o != null && o <= o ? t[Yo(e, o, 0, r)] : n;
  }
  return i.domain = function(o) {
    return arguments.length ? (e = Array.from(o), r = Math.min(e.length, t.length - 1), i) : e.slice();
  }, i.range = function(o) {
    return arguments.length ? (t = Array.from(o), r = Math.min(e.length, t.length - 1), i) : t.slice();
  }, i.invertExtent = function(o) {
    var a = t.indexOf(o);
    return [e[a - 1], e[a]];
  }, i.unknown = function(o) {
    return arguments.length ? (n = o, i) : n;
  }, i.copy = function() {
    return zc().domain(e).range(t).unknown(n);
  }, En.apply(i, arguments);
}
var Us = new Date(), Vs = new Date();
function zt(e, t, n, r) {
  function i(o) {
    return e(o = arguments.length === 0 ? new Date() : new Date(+o)), o;
  }
  return i.floor = function(o) {
    return e(o = new Date(+o)), o;
  }, i.ceil = function(o) {
    return e(o = new Date(o - 1)), t(o, 1), e(o), o;
  }, i.round = function(o) {
    var a = i(o), u = i.ceil(o);
    return o - a < u - o ? a : u;
  }, i.offset = function(o, a) {
    return t(o = new Date(+o), a == null ? 1 : Math.floor(a)), o;
  }, i.range = function(o, a, u) {
    var f = [], c;
    if (o = i.ceil(o), u = u == null ? 1 : Math.floor(u), !(o < a) || !(u > 0))
      return f;
    do
      f.push(c = new Date(+o)), t(o, u), e(o);
    while (c < o && o < a);
    return f;
  }, i.filter = function(o) {
    return zt(function(a) {
      if (a >= a)
        for (; e(a), !o(a); )
          a.setTime(a - 1);
    }, function(a, u) {
      if (a >= a)
        if (u < 0)
          for (; ++u <= 0; )
            for (; t(a, -1), !o(a); )
              ;
        else
          for (; --u >= 0; )
            for (; t(a, 1), !o(a); )
              ;
    });
  }, n && (i.count = function(o, a) {
    return Us.setTime(+o), Vs.setTime(+a), e(Us), e(Vs), Math.floor(n(Us, Vs));
  }, i.every = function(o) {
    return o = Math.floor(o), !isFinite(o) || !(o > 0) ? null : o > 1 ? i.filter(r ? function(a) {
      return r(a) % o === 0;
    } : function(a) {
      return i.count(0, a) % o === 0;
    }) : i;
  }), i;
}
var au = zt(function() {
}, function(e, t) {
  e.setTime(+e + t);
}, function(e, t) {
  return t - e;
});
au.every = function(e) {
  return e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? zt(function(t) {
    t.setTime(Math.floor(t / e) * e);
  }, function(t, n) {
    t.setTime(+t + n * e);
  }, function(t, n) {
    return (n - t) / e;
  }) : au;
};
const $l = au;
var Vd = au.range;
const cr = 1e3, Nn = cr * 60, fr = Nn * 60, ni = fr * 24, Lc = ni * 7, qd = ni * 30, qs = ni * 365;
var qv = zt(function(e) {
  e.setTime(e - e.getMilliseconds());
}, function(e, t) {
  e.setTime(+e + t * cr);
}, function(e, t) {
  return (t - e) / cr;
}, function(e) {
  return e.getUTCSeconds();
});
const Zn = qv;
var Yd = qv.range, Yv = zt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * cr);
}, function(e, t) {
  e.setTime(+e + t * Nn);
}, function(e, t) {
  return (t - e) / Nn;
}, function(e) {
  return e.getMinutes();
});
const Eu = Yv;
var k1 = Yv.range, Xv = zt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * cr - e.getMinutes() * Nn);
}, function(e, t) {
  e.setTime(+e + t * fr);
}, function(e, t) {
  return (t - e) / fr;
}, function(e) {
  return e.getHours();
});
const Mu = Xv;
var $1 = Xv.range, Kv = zt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Nn) / ni,
  (e) => e.getDate() - 1
);
const Gi = Kv;
var F1 = Kv.range;
function fi(e) {
  return zt(function(t) {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setDate(t.getDate() + n * 7);
  }, function(t, n) {
    return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Nn) / Lc;
  });
}
var ri = fi(0), Bo = fi(1), Qv = fi(2), Zv = fi(3), ii = fi(4), Jv = fi(5), eg = fi(6), Xd = ri.range, I1 = Bo.range, B1 = Qv.range, D1 = Zv.range, z1 = ii.range, L1 = Jv.range, G1 = eg.range, tg = zt(function(e) {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setMonth(e.getMonth() + t);
}, function(e, t) {
  return t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12;
}, function(e) {
  return e.getMonth();
});
const Ou = tg;
var j1 = tg.range, Gc = zt(function(e) {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setFullYear(e.getFullYear() + t);
}, function(e, t) {
  return t.getFullYear() - e.getFullYear();
}, function(e) {
  return e.getFullYear();
});
Gc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : zt(function(t) {
    t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setFullYear(t.getFullYear() + n * e);
  });
};
const dr = Gc;
var H1 = Gc.range, ng = zt(function(e) {
  e.setUTCSeconds(0, 0);
}, function(e, t) {
  e.setTime(+e + t * Nn);
}, function(e, t) {
  return (t - e) / Nn;
}, function(e) {
  return e.getUTCMinutes();
});
const Au = ng;
var W1 = ng.range, rg = zt(function(e) {
  e.setUTCMinutes(0, 0, 0);
}, function(e, t) {
  e.setTime(+e + t * fr);
}, function(e, t) {
  return (t - e) / fr;
}, function(e) {
  return e.getUTCHours();
});
const ku = rg;
var U1 = rg.range, ig = zt(function(e) {
  e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCDate(e.getUTCDate() + t);
}, function(e, t) {
  return (t - e) / ni;
}, function(e) {
  return e.getUTCDate() - 1;
});
const ji = ig;
var V1 = ig.range;
function di(e) {
  return zt(function(t) {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, function(t, n) {
    return (n - t) / Lc;
  });
}
var oi = di(0), Do = di(1), og = di(2), ag = di(3), ai = di(4), ug = di(5), sg = di(6), Kd = oi.range, q1 = Do.range, Y1 = og.range, X1 = ag.range, K1 = ai.range, Q1 = ug.range, Z1 = sg.range, lg = zt(function(e) {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCMonth(e.getUTCMonth() + t);
}, function(e, t) {
  return t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12;
}, function(e) {
  return e.getUTCMonth();
});
const $u = lg;
var J1 = lg.range, jc = zt(function(e) {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, function(e, t) {
  return t.getUTCFullYear() - e.getUTCFullYear();
}, function(e) {
  return e.getUTCFullYear();
});
jc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : zt(function(t) {
    t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCFullYear(t.getUTCFullYear() + n * e);
  });
};
const pr = jc;
var ew = jc.range;
function cg(e, t, n, r, i, o) {
  const a = [
    [Zn, 1, cr],
    [Zn, 5, 5 * cr],
    [Zn, 15, 15 * cr],
    [Zn, 30, 30 * cr],
    [o, 1, Nn],
    [o, 5, 5 * Nn],
    [o, 15, 15 * Nn],
    [o, 30, 30 * Nn],
    [i, 1, fr],
    [i, 3, 3 * fr],
    [i, 6, 6 * fr],
    [i, 12, 12 * fr],
    [r, 1, ni],
    [r, 2, 2 * ni],
    [n, 1, Lc],
    [t, 1, qd],
    [t, 3, 3 * qd],
    [e, 1, qs]
  ];
  function u(c, h, p) {
    const w = h < c;
    w && ([c, h] = [h, c]);
    const P = p && typeof p.range == "function" ? p : f(c, h, p), _ = P ? P.range(c, +h + 1) : [];
    return w ? _.reverse() : _;
  }
  function f(c, h, p) {
    const w = Math.abs(h - c) / p, P = xu(([, , I]) => I).right(a, w);
    if (P === a.length)
      return e.every(Cl(c / qs, h / qs, p));
    if (P === 0)
      return $l.every(Math.max(Cl(c, h, p), 1));
    const [_, T] = a[w / a[P - 1][2] < a[P][2] / w ? P - 1 : P];
    return _.every(T);
  }
  return [u, f];
}
const [fg, dg] = cg(pr, $u, oi, ji, ku, Au), [pg, hg] = cg(dr, Ou, ri, Gi, Mu, Eu), tw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  timeInterval: zt,
  timeMillisecond: $l,
  timeMilliseconds: Vd,
  utcMillisecond: $l,
  utcMilliseconds: Vd,
  timeSecond: Zn,
  timeSeconds: Yd,
  utcSecond: Zn,
  utcSeconds: Yd,
  timeMinute: Eu,
  timeMinutes: k1,
  timeHour: Mu,
  timeHours: $1,
  timeDay: Gi,
  timeDays: F1,
  timeWeek: ri,
  timeWeeks: Xd,
  timeSunday: ri,
  timeSundays: Xd,
  timeMonday: Bo,
  timeMondays: I1,
  timeTuesday: Qv,
  timeTuesdays: B1,
  timeWednesday: Zv,
  timeWednesdays: D1,
  timeThursday: ii,
  timeThursdays: z1,
  timeFriday: Jv,
  timeFridays: L1,
  timeSaturday: eg,
  timeSaturdays: G1,
  timeMonth: Ou,
  timeMonths: j1,
  timeYear: dr,
  timeYears: H1,
  utcMinute: Au,
  utcMinutes: W1,
  utcHour: ku,
  utcHours: U1,
  utcDay: ji,
  utcDays: V1,
  utcWeek: oi,
  utcWeeks: Kd,
  utcSunday: oi,
  utcSundays: Kd,
  utcMonday: Do,
  utcMondays: q1,
  utcTuesday: og,
  utcTuesdays: Y1,
  utcWednesday: ag,
  utcWednesdays: X1,
  utcThursday: ai,
  utcThursdays: K1,
  utcFriday: ug,
  utcFridays: Q1,
  utcSaturday: sg,
  utcSaturdays: Z1,
  utcMonth: $u,
  utcMonths: J1,
  utcYear: pr,
  utcYears: ew,
  utcTicks: fg,
  utcTickInterval: dg,
  timeTicks: pg,
  timeTickInterval: hg
}, Symbol.toStringTag, { value: "Module" }));
function Ys(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Xs(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function so(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function nw(e) {
  var t = e.dateTime, n = e.date, r = e.time, i = e.periods, o = e.days, a = e.shortDays, u = e.months, f = e.shortMonths, c = lo(i), h = co(i), p = lo(o), w = co(o), P = lo(a), _ = co(a), T = lo(u), I = co(u), k = lo(f), F = co(f), N = {
    a: st,
    A: lt,
    b: dt,
    B: V,
    c: null,
    d: np,
    e: np,
    f: Cw,
    g: Fw,
    G: Bw,
    H: _w,
    I: Sw,
    j: Rw,
    L: vg,
    m: Pw,
    M: Tw,
    p: ue,
    q: Te,
    Q: op,
    s: ap,
    S: Nw,
    u: Ew,
    U: Mw,
    V: Ow,
    w: Aw,
    W: kw,
    x: null,
    X: null,
    y: $w,
    Y: Iw,
    Z: Dw,
    "%": ip
  }, G = {
    a: Ae,
    A: Ce,
    b: Re,
    B: Ne,
    c: null,
    d: rp,
    e: rp,
    f: jw,
    g: Zw,
    G: ex,
    H: zw,
    I: Lw,
    j: Gw,
    L: mg,
    m: Hw,
    M: Ww,
    p: Be,
    q: Le,
    Q: op,
    s: ap,
    S: Uw,
    u: Vw,
    U: qw,
    V: Yw,
    w: Xw,
    W: Kw,
    x: null,
    X: null,
    y: Qw,
    Y: Jw,
    Z: tx,
    "%": ip
  }, M = {
    a: ge,
    A: re,
    b: ee,
    B: be,
    c: Oe,
    d: ep,
    e: ep,
    f: yw,
    g: Jd,
    G: Zd,
    H: tp,
    I: tp,
    j: hw,
    L: mw,
    m: pw,
    M: vw,
    p: fe,
    q: dw,
    Q: ww,
    s: xw,
    S: gw,
    u: uw,
    U: sw,
    V: lw,
    w: aw,
    W: cw,
    x: ut,
    X: Ue,
    y: Jd,
    Y: Zd,
    Z: fw,
    "%": bw
  };
  N.x = D(n, N), N.X = D(r, N), N.c = D(t, N), G.x = D(n, G), G.X = D(r, G), G.c = D(t, G);
  function D(X, ce) {
    return function(Ge) {
      var B = [], gt = -1, ct = 0, _t = X.length, Ot, Qt, un;
      for (Ge instanceof Date || (Ge = new Date(+Ge)); ++gt < _t; )
        X.charCodeAt(gt) === 37 && (B.push(X.slice(ct, gt)), (Qt = Qd[Ot = X.charAt(++gt)]) != null ? Ot = X.charAt(++gt) : Qt = Ot === "e" ? " " : "0", (un = ce[Ot]) && (Ot = un(Ge, Qt)), B.push(Ot), ct = gt + 1);
      return B.push(X.slice(ct, gt)), B.join("");
    };
  }
  function te(X, ce) {
    return function(Ge) {
      var B = so(1900, void 0, 1), gt = Q(B, X, Ge += "", 0), ct, _t;
      if (gt != Ge.length)
        return null;
      if ("Q" in B)
        return new Date(B.Q);
      if ("s" in B)
        return new Date(B.s * 1e3 + ("L" in B ? B.L : 0));
      if (ce && !("Z" in B) && (B.Z = 0), "p" in B && (B.H = B.H % 12 + B.p * 12), B.m === void 0 && (B.m = "q" in B ? B.q : 0), "V" in B) {
        if (B.V < 1 || B.V > 53)
          return null;
        "w" in B || (B.w = 1), "Z" in B ? (ct = Xs(so(B.y, 0, 1)), _t = ct.getUTCDay(), ct = _t > 4 || _t === 0 ? Do.ceil(ct) : Do(ct), ct = ji.offset(ct, (B.V - 1) * 7), B.y = ct.getUTCFullYear(), B.m = ct.getUTCMonth(), B.d = ct.getUTCDate() + (B.w + 6) % 7) : (ct = Ys(so(B.y, 0, 1)), _t = ct.getDay(), ct = _t > 4 || _t === 0 ? Bo.ceil(ct) : Bo(ct), ct = Gi.offset(ct, (B.V - 1) * 7), B.y = ct.getFullYear(), B.m = ct.getMonth(), B.d = ct.getDate() + (B.w + 6) % 7);
      } else
        ("W" in B || "U" in B) && ("w" in B || (B.w = "u" in B ? B.u % 7 : "W" in B ? 1 : 0), _t = "Z" in B ? Xs(so(B.y, 0, 1)).getUTCDay() : Ys(so(B.y, 0, 1)).getDay(), B.m = 0, B.d = "W" in B ? (B.w + 6) % 7 + B.W * 7 - (_t + 5) % 7 : B.w + B.U * 7 - (_t + 6) % 7);
      return "Z" in B ? (B.H += B.Z / 100 | 0, B.M += B.Z % 100, Xs(B)) : Ys(B);
    };
  }
  function Q(X, ce, Ge, B) {
    for (var gt = 0, ct = ce.length, _t = Ge.length, Ot, Qt; gt < ct; ) {
      if (B >= _t)
        return -1;
      if (Ot = ce.charCodeAt(gt++), Ot === 37) {
        if (Ot = ce.charAt(gt++), Qt = M[Ot in Qd ? ce.charAt(gt++) : Ot], !Qt || (B = Qt(X, Ge, B)) < 0)
          return -1;
      } else if (Ot != Ge.charCodeAt(B++))
        return -1;
    }
    return B;
  }
  function fe(X, ce, Ge) {
    var B = c.exec(ce.slice(Ge));
    return B ? (X.p = h.get(B[0].toLowerCase()), Ge + B[0].length) : -1;
  }
  function ge(X, ce, Ge) {
    var B = P.exec(ce.slice(Ge));
    return B ? (X.w = _.get(B[0].toLowerCase()), Ge + B[0].length) : -1;
  }
  function re(X, ce, Ge) {
    var B = p.exec(ce.slice(Ge));
    return B ? (X.w = w.get(B[0].toLowerCase()), Ge + B[0].length) : -1;
  }
  function ee(X, ce, Ge) {
    var B = k.exec(ce.slice(Ge));
    return B ? (X.m = F.get(B[0].toLowerCase()), Ge + B[0].length) : -1;
  }
  function be(X, ce, Ge) {
    var B = T.exec(ce.slice(Ge));
    return B ? (X.m = I.get(B[0].toLowerCase()), Ge + B[0].length) : -1;
  }
  function Oe(X, ce, Ge) {
    return Q(X, t, ce, Ge);
  }
  function ut(X, ce, Ge) {
    return Q(X, n, ce, Ge);
  }
  function Ue(X, ce, Ge) {
    return Q(X, r, ce, Ge);
  }
  function st(X) {
    return a[X.getDay()];
  }
  function lt(X) {
    return o[X.getDay()];
  }
  function dt(X) {
    return f[X.getMonth()];
  }
  function V(X) {
    return u[X.getMonth()];
  }
  function ue(X) {
    return i[+(X.getHours() >= 12)];
  }
  function Te(X) {
    return 1 + ~~(X.getMonth() / 3);
  }
  function Ae(X) {
    return a[X.getUTCDay()];
  }
  function Ce(X) {
    return o[X.getUTCDay()];
  }
  function Re(X) {
    return f[X.getUTCMonth()];
  }
  function Ne(X) {
    return u[X.getUTCMonth()];
  }
  function Be(X) {
    return i[+(X.getUTCHours() >= 12)];
  }
  function Le(X) {
    return 1 + ~~(X.getUTCMonth() / 3);
  }
  return {
    format: function(X) {
      var ce = D(X += "", N);
      return ce.toString = function() {
        return X;
      }, ce;
    },
    parse: function(X) {
      var ce = te(X += "", !1);
      return ce.toString = function() {
        return X;
      }, ce;
    },
    utcFormat: function(X) {
      var ce = D(X += "", G);
      return ce.toString = function() {
        return X;
      }, ce;
    },
    utcParse: function(X) {
      var ce = te(X += "", !0);
      return ce.toString = function() {
        return X;
      }, ce;
    }
  };
}
var Qd = { "-": "", _: " ", 0: "0" }, Vt = /^\s*\d+/, rw = /^%/, iw = /[\\^$*+?|[\]().{}]/g;
function xt(e, t, n) {
  var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", o = i.length;
  return r + (o < n ? new Array(n - o + 1).join(t) + i : i);
}
function ow(e) {
  return e.replace(iw, "\\$&");
}
function lo(e) {
  return new RegExp("^(?:" + e.map(ow).join("|") + ")", "i");
}
function co(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function aw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function uw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function sw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function lw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function cw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function Zd(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function Jd(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function fw(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function dw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function pw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ep(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function hw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function tp(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function vw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function gw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function mw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function yw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function bw(e, t, n) {
  var r = rw.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function ww(e, t, n) {
  var r = Vt.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function xw(e, t, n) {
  var r = Vt.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function np(e, t) {
  return xt(e.getDate(), t, 2);
}
function _w(e, t) {
  return xt(e.getHours(), t, 2);
}
function Sw(e, t) {
  return xt(e.getHours() % 12 || 12, t, 2);
}
function Rw(e, t) {
  return xt(1 + Gi.count(dr(e), e), t, 3);
}
function vg(e, t) {
  return xt(e.getMilliseconds(), t, 3);
}
function Cw(e, t) {
  return vg(e, t) + "000";
}
function Pw(e, t) {
  return xt(e.getMonth() + 1, t, 2);
}
function Tw(e, t) {
  return xt(e.getMinutes(), t, 2);
}
function Nw(e, t) {
  return xt(e.getSeconds(), t, 2);
}
function Ew(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Mw(e, t) {
  return xt(ri.count(dr(e) - 1, e), t, 2);
}
function gg(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? ii(e) : ii.ceil(e);
}
function Ow(e, t) {
  return e = gg(e), xt(ii.count(dr(e), e) + (dr(e).getDay() === 4), t, 2);
}
function Aw(e) {
  return e.getDay();
}
function kw(e, t) {
  return xt(Bo.count(dr(e) - 1, e), t, 2);
}
function $w(e, t) {
  return xt(e.getFullYear() % 100, t, 2);
}
function Fw(e, t) {
  return e = gg(e), xt(e.getFullYear() % 100, t, 2);
}
function Iw(e, t) {
  return xt(e.getFullYear() % 1e4, t, 4);
}
function Bw(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? ii(e) : ii.ceil(e), xt(e.getFullYear() % 1e4, t, 4);
}
function Dw(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + xt(t / 60 | 0, "0", 2) + xt(t % 60, "0", 2);
}
function rp(e, t) {
  return xt(e.getUTCDate(), t, 2);
}
function zw(e, t) {
  return xt(e.getUTCHours(), t, 2);
}
function Lw(e, t) {
  return xt(e.getUTCHours() % 12 || 12, t, 2);
}
function Gw(e, t) {
  return xt(1 + ji.count(pr(e), e), t, 3);
}
function mg(e, t) {
  return xt(e.getUTCMilliseconds(), t, 3);
}
function jw(e, t) {
  return mg(e, t) + "000";
}
function Hw(e, t) {
  return xt(e.getUTCMonth() + 1, t, 2);
}
function Ww(e, t) {
  return xt(e.getUTCMinutes(), t, 2);
}
function Uw(e, t) {
  return xt(e.getUTCSeconds(), t, 2);
}
function Vw(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function qw(e, t) {
  return xt(oi.count(pr(e) - 1, e), t, 2);
}
function yg(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? ai(e) : ai.ceil(e);
}
function Yw(e, t) {
  return e = yg(e), xt(ai.count(pr(e), e) + (pr(e).getUTCDay() === 4), t, 2);
}
function Xw(e) {
  return e.getUTCDay();
}
function Kw(e, t) {
  return xt(Do.count(pr(e) - 1, e), t, 2);
}
function Qw(e, t) {
  return xt(e.getUTCFullYear() % 100, t, 2);
}
function Zw(e, t) {
  return e = yg(e), xt(e.getUTCFullYear() % 100, t, 2);
}
function Jw(e, t) {
  return xt(e.getUTCFullYear() % 1e4, t, 4);
}
function ex(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? ai(e) : ai.ceil(e), xt(e.getUTCFullYear() % 1e4, t, 4);
}
function tx() {
  return "+0000";
}
function ip() {
  return "%";
}
function op(e) {
  return +e;
}
function ap(e) {
  return Math.floor(+e / 1e3);
}
var gi, bg, wg;
nx({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function nx(e) {
  return gi = nw(e), bg = gi.format, gi.parse, wg = gi.utcFormat, gi.utcParse, gi;
}
function rx(e) {
  return new Date(e);
}
function ix(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Hc(e, t, n, r, i, o, a, u, f, c) {
  var h = Nc(), p = h.invert, w = h.domain, P = c(".%L"), _ = c(":%S"), T = c("%I:%M"), I = c("%I %p"), k = c("%a %d"), F = c("%b %d"), N = c("%B"), G = c("%Y");
  function M(D) {
    return (f(D) < D ? P : u(D) < D ? _ : a(D) < D ? T : o(D) < D ? I : r(D) < D ? i(D) < D ? k : F : n(D) < D ? N : G)(D);
  }
  return h.invert = function(D) {
    return new Date(p(D));
  }, h.domain = function(D) {
    return arguments.length ? w(Array.from(D, ix)) : w().map(rx);
  }, h.ticks = function(D) {
    var te = w();
    return e(te[0], te[te.length - 1], D == null ? 10 : D);
  }, h.tickFormat = function(D, te) {
    return te == null ? M : c(te);
  }, h.nice = function(D) {
    var te = w();
    return (!D || typeof D.range != "function") && (D = t(te[0], te[te.length - 1], D == null ? 10 : D)), D ? w(Wv(te, D)) : h;
  }, h.copy = function() {
    return Qo(h, Hc(e, t, n, r, i, o, a, u, f, c));
  }, h;
}
function xg() {
  return En.apply(Hc(pg, hg, dr, Ou, ri, Gi, Mu, Eu, Zn, bg).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function _g() {
  return En.apply(Hc(fg, dg, pr, $u, oi, ji, ku, Au, Zn, wg).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Fu() {
  var e = 0, t = 1, n, r, i, o, a = rn, u = !1, f;
  function c(p) {
    return p == null || isNaN(p = +p) ? f : a(i === 0 ? 0.5 : (p = (o(p) - n) * i, u ? Math.max(0, Math.min(1, p)) : p));
  }
  c.domain = function(p) {
    return arguments.length ? ([e, t] = p, n = o(e = +e), r = o(t = +t), i = n === r ? 0 : 1 / (r - n), c) : [e, t];
  }, c.clamp = function(p) {
    return arguments.length ? (u = !!p, c) : u;
  }, c.interpolator = function(p) {
    return arguments.length ? (a = p, c) : a;
  };
  function h(p) {
    return function(w) {
      var P, _;
      return arguments.length ? ([P, _] = w, a = p(P, _), c) : [a(0), a(1)];
    };
  }
  return c.range = h(Li), c.rangeRound = h(Ko), c.unknown = function(p) {
    return arguments.length ? (f = p, c) : f;
  }, function(p) {
    return o = p, n = p(e), r = p(t), i = n === r ? 0 : 1 / (r - n), c;
  };
}
function Gr(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function Sg() {
  var e = Lr(Fu()(rn));
  return e.copy = function() {
    return Gr(e, Sg());
  }, vr.apply(e, arguments);
}
function Rg() {
  var e = Ac(Fu()).domain([1, 10]);
  return e.copy = function() {
    return Gr(e, Rg()).base(e.base());
  }, vr.apply(e, arguments);
}
function Cg() {
  var e = $c(Fu());
  return e.copy = function() {
    return Gr(e, Cg()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Wc() {
  var e = Ic(Fu());
  return e.copy = function() {
    return Gr(e, Wc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function ox() {
  return Wc.apply(null, arguments).exponent(0.5);
}
function Pg() {
  var e = [], t = rn;
  function n(r) {
    if (r != null && !isNaN(r = +r))
      return t((Yo(e, r, 1) - 1) / (e.length - 1));
  }
  return n.domain = function(r) {
    if (!arguments.length)
      return e.slice();
    e = [];
    for (let i of r)
      i != null && !isNaN(i = +i) && e.push(i);
    return e.sort(qo), n;
  }, n.interpolator = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.range = function() {
    return e.map((r, i) => t(i / (e.length - 1)));
  }, n.quantiles = function(r) {
    return Array.from({ length: r + 1 }, (i, o) => Ab(e, o / r));
  }, n.copy = function() {
    return Pg(t).domain(e);
  }, vr.apply(n, arguments);
}
function Iu() {
  var e = 0, t = 0.5, n = 1, r = 1, i, o, a, u, f, c = rn, h, p = !1, w;
  function P(T) {
    return isNaN(T = +T) ? w : (T = 0.5 + ((T = +h(T)) - o) * (r * T < r * o ? u : f), c(p ? Math.max(0, Math.min(1, T)) : T));
  }
  P.domain = function(T) {
    return arguments.length ? ([e, t, n] = T, i = h(e = +e), o = h(t = +t), a = h(n = +n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P) : [e, t, n];
  }, P.clamp = function(T) {
    return arguments.length ? (p = !!T, P) : p;
  }, P.interpolator = function(T) {
    return arguments.length ? (c = T, P) : c;
  };
  function _(T) {
    return function(I) {
      var k, F, N;
      return arguments.length ? ([k, F, N] = I, c = zv(T, [k, F, N]), P) : [c(0), c(0.5), c(1)];
    };
  }
  return P.range = _(Li), P.rangeRound = _(Ko), P.unknown = function(T) {
    return arguments.length ? (w = T, P) : w;
  }, function(T) {
    return h = T, i = T(e), o = T(t), a = T(n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P;
  };
}
function Tg() {
  var e = Lr(Iu()(rn));
  return e.copy = function() {
    return Gr(e, Tg());
  }, vr.apply(e, arguments);
}
function Ng() {
  var e = Ac(Iu()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return Gr(e, Ng()).base(e.base());
  }, vr.apply(e, arguments);
}
function Eg() {
  var e = $c(Iu());
  return e.copy = function() {
    return Gr(e, Eg()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Uc() {
  var e = Ic(Iu());
  return e.copy = function() {
    return Gr(e, Uc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function ax() {
  return Uc.apply(null, arguments).exponent(0.5);
}
const ux = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Su,
  scalePoint: ov,
  scaleIdentity: Hv,
  scaleLinear: Oc,
  scaleLog: kc,
  scaleSymlog: Fc,
  scaleOrdinal: _u,
  scaleImplicit: Pl,
  scalePow: Nu,
  scaleSqrt: Uv,
  scaleRadial: Vv,
  scaleQuantile: Bc,
  scaleQuantize: Dc,
  scaleThreshold: zc,
  scaleTime: xg,
  scaleUtc: _g,
  scaleSequential: Sg,
  scaleSequentialLog: Rg,
  scaleSequentialPow: Wc,
  scaleSequentialSqrt: ox,
  scaleSequentialSymlog: Cg,
  scaleSequentialQuantile: Pg,
  scaleDiverging: Tg,
  scaleDivergingLog: Ng,
  scaleDivergingPow: Uc,
  scaleDivergingSqrt: ax,
  scaleDivergingSymlog: Eg,
  tickFormat: jv
}, Symbol.toStringTag, { value: "Module" }));
function sx(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
function lx(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
function cx(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
function fx(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
function dx(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
function px(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
function hx(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var up = {
  lab: Av,
  hcl: $v,
  "hcl-long": Fv,
  hsl: Mv,
  "hsl-long": Ov,
  cubehelix: Bv,
  "cubehelix-long": Dv,
  rgb: nu
};
function vx(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return up[e];
  }
  var t = e.type, n = e.gamma, r = up[t];
  return typeof n > "u" ? r : r.gamma(n);
}
function gx(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = vx(t.interpolate);
    e.interpolate(n);
  }
}
var mx = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), yx = "%Y-%m-%d %H:%M";
function bx(e) {
  var t = e.tickFormat(1, yx)(mx);
  return t === "2020-02-02 03:04";
}
var sp = {
  day: Gi,
  hour: Mu,
  minute: Eu,
  month: Ou,
  second: Zn,
  week: ri,
  year: dr
}, lp = {
  day: ji,
  hour: ku,
  minute: Au,
  month: $u,
  second: Zn,
  week: oi,
  year: pr
};
function wx(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = bx(r);
      if (typeof n == "string")
        r.nice(i ? lp[n] : sp[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? lp[o] : sp[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
function xx(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
function _x(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
function Sx(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(Ko));
}
function Rx(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
function Cx(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
var Px = [
  "domain",
  "nice",
  "zero",
  "interpolate",
  "round",
  "range",
  "reverse",
  "align",
  "base",
  "clamp",
  "constant",
  "exponent",
  "padding",
  "unknown"
], Tx = {
  domain: sx,
  nice: wx,
  zero: Cx,
  interpolate: gx,
  round: Sx,
  align: cx,
  base: fx,
  clamp: dx,
  constant: px,
  exponent: hx,
  padding: xx,
  range: lx,
  reverse: _x,
  unknown: Rx
};
function mn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = Px.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      Tx[f](a, u);
    }), a;
  };
}
var Nx = mn("domain", "range", "reverse", "align", "padding", "round");
function Ex(e) {
  return Nx(Su(), e);
}
var Mx = mn("domain", "range", "reverse", "align", "padding", "round");
function Ox(e) {
  return Mx(ov(), e);
}
var Ax = mn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function cp(e) {
  return Ax(Oc(), e);
}
var kx = mn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function $x(e) {
  return kx(xg(), e);
}
var Fx = mn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Ix(e) {
  return Fx(_g(), e);
}
var Bx = mn("domain", "range", "reverse", "base", "clamp", "interpolate", "nice", "round");
function Dx(e) {
  return Bx(kc(), e);
}
var zx = mn("domain", "range", "reverse", "clamp", "exponent", "interpolate", "nice", "round", "zero");
function Lx(e) {
  return zx(Nu(), e);
}
var Gx = mn("domain", "range", "reverse", "unknown");
function jx(e) {
  return Gx(_u(), e);
}
var Hx = mn("domain", "range", "reverse", "nice", "zero");
function Wx(e) {
  return Hx(Dc(), e);
}
var Ux = mn("domain", "range", "reverse");
function Vx(e) {
  return Ux(Bc(), e);
}
var qx = mn("domain", "range", "reverse", "clamp", "constant", "nice", "zero", "round");
function Yx(e) {
  return qx(Fc(), e);
}
var Xx = mn("domain", "range", "reverse");
function Kx(e) {
  return Xx(zc(), e);
}
var Qx = mn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function Zx(e) {
  return Qx(Uv(), e);
}
function Fa(e) {
  if (typeof e < "u" && "type" in e)
    switch (e.type) {
      case "linear":
        return cp(e);
      case "log":
        return Dx(e);
      case "pow":
        return Lx(e);
      case "sqrt":
        return Zx(e);
      case "symlog":
        return Yx(e);
      case "time":
        return $x(e);
      case "utc":
        return Ix(e);
      case "quantile":
        return Vx(e);
      case "quantize":
        return Wx(e);
      case "threshold":
        return Kx(e);
      case "ordinal":
        return jx(e);
      case "point":
        return Ox(e);
      case "band":
        return Ex(e);
    }
  return cp(e);
}
function Jx(e) {
  if ((typeof e == "function" || typeof e == "object" && !!e) && "valueOf" in e) {
    var t = e.valueOf();
    if (typeof t == "number")
      return t;
  }
  return e;
}
var e_ = /* @__PURE__ */ new Set(["linear", "pow", "quantize", "sqrt", "symlog"]);
function fp(e) {
  return e_.has(e.type);
}
var t_ = /* @__PURE__ */ gn.createContext({});
const jr = t_;
function Fl(e) {
  var t, n = e;
  return n && "bandwidth" in n && (t = n == null ? void 0 : n.bandwidth()) != null ? t : 0;
}
function en(e) {
  return e != null && typeof e == "number" && !Number.isNaN(e) && Number.isFinite(e);
}
let Vc = Jo();
const at = (e) => Zo(e, Vc);
let qc = Jo();
at.write = (e) => Zo(e, qc);
let Bu = Jo();
at.onStart = (e) => Zo(e, Bu);
let Yc = Jo();
at.onFrame = (e) => Zo(e, Yc);
let Xc = Jo();
at.onFinish = (e) => Zo(e, Xc);
let Ei = [];
at.setTimeout = (e, t) => {
  let n = at.now() + t, r = () => {
    let o = Ei.findIndex((a) => a.cancel == r);
    ~o && Ei.splice(o, 1), kr -= ~o ? 1 : 0;
  }, i = {
    time: n,
    handler: e,
    cancel: r
  };
  return Ei.splice(Mg(n), 0, i), kr += 1, Og(), i;
};
let Mg = (e) => ~(~Ei.findIndex((t) => t.time > e) || ~Ei.length);
at.cancel = (e) => {
  Bu.delete(e), Yc.delete(e), Xc.delete(e), Vc.delete(e), qc.delete(e);
};
at.sync = (e) => {
  Il = !0, at.batchedUpdates(e), Il = !1;
};
at.throttle = (e) => {
  let t;
  function n() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function r(...i) {
    t = i, at.onStart(n);
  }
  return r.handler = e, r.cancel = () => {
    Bu.delete(n), t = null;
  }, r;
};
let Kc = typeof window < "u" ? window.requestAnimationFrame : () => {
};
at.use = (e) => Kc = e;
at.now = typeof performance < "u" ? () => performance.now() : Date.now;
at.batchedUpdates = (e) => e();
at.catch = console.error;
at.frameLoop = "always";
at.advance = () => {
  at.frameLoop !== "demand" ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : kg();
};
let Ar = -1, kr = 0, Il = !1;
function Zo(e, t) {
  Il ? (t.delete(e), e(0)) : (t.add(e), Og());
}
function Og() {
  Ar < 0 && (Ar = 0, at.frameLoop !== "demand" && Kc(Ag));
}
function n_() {
  Ar = -1;
}
function Ag() {
  ~Ar && (Kc(Ag), at.batchedUpdates(kg));
}
function kg() {
  let e = Ar;
  Ar = at.now();
  let t = Mg(Ar);
  if (t && ($g(Ei.splice(0, t), (n) => n.handler()), kr -= t), !kr) {
    n_();
    return;
  }
  Bu.flush(), Vc.flush(e ? Math.min(64, Ar - e) : 16.667), Yc.flush(), qc.flush(), Xc.flush();
}
function Jo() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      kr += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return kr -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), kr -= t.size, $g(t, (r) => r(n) && e.add(r)), kr += e.size, t = e);
    }
  };
}
function $g(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      at.catch(r);
    }
  });
}
function Bl() {
}
const r_ = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), de = {
  arr: Array.isArray,
  obj: (e) => !!e && e.constructor.name === "Object",
  fun: (e) => typeof e == "function",
  str: (e) => typeof e == "string",
  num: (e) => typeof e == "number",
  und: (e) => e === void 0
};
function sr(e, t) {
  if (de.arr(e)) {
    if (!de.arr(t) || e.length !== t.length)
      return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n])
        return !1;
    return !0;
  }
  return e === t;
}
const bt = (e, t) => e.forEach(t);
function tr(e, t, n) {
  if (de.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
const vn = (e) => de.und(e) ? [] : de.arr(e) ? e : [e];
function No(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), bt(n, t);
  }
}
const So = (e, ...t) => No(e, (n) => n(...t)), Qc = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
let Zc, Fg, Ir = null, Ig = !1, Jc = Bl;
const i_ = (e) => {
  e.to && (Fg = e.to), e.now && (at.now = e.now), e.colors !== void 0 && (Ir = e.colors), e.skipAnimation != null && (Ig = e.skipAnimation), e.createStringInterpolator && (Zc = e.createStringInterpolator), e.requestAnimationFrame && at.use(e.requestAnimationFrame), e.batchedUpdates && (at.batchedUpdates = e.batchedUpdates), e.willAdvance && (Jc = e.willAdvance), e.frameLoop && (at.frameLoop = e.frameLoop);
};
var nr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return Zc;
  },
  get to() {
    return Fg;
  },
  get colors() {
    return Ir;
  },
  get skipAnimation() {
    return Ig;
  },
  get willAdvance() {
    return Jc;
  },
  assign: i_
});
const Eo = /* @__PURE__ */ new Set();
let Tn = [], Ks = [], uu = 0;
const Du = {
  get idle() {
    return !Eo.size && !Tn.length;
  },
  start(e) {
    uu > e.priority ? (Eo.add(e), at.onStart(o_)) : (Bg(e), at(Dl));
  },
  advance: Dl,
  sort(e) {
    if (uu)
      at.onFrame(() => Du.sort(e));
    else {
      const t = Tn.indexOf(e);
      ~t && (Tn.splice(t, 1), Dg(e));
    }
  },
  clear() {
    Tn = [], Eo.clear();
  }
};
function o_() {
  Eo.forEach(Bg), Eo.clear(), at(Dl);
}
function Bg(e) {
  Tn.includes(e) || Dg(e);
}
function Dg(e) {
  Tn.splice(a_(Tn, (t) => t.priority > e.priority), 0, e);
}
function Dl(e) {
  const t = Ks;
  for (let n = 0; n < Tn.length; n++) {
    const r = Tn[n];
    uu = r.priority, r.idle || (Jc(r), r.advance(e), r.idle || t.push(r));
  }
  return uu = 0, Ks = Tn, Ks.length = 0, Tn = t, Tn.length > 0;
}
function a_(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
const u_ = {
  transparent: 0,
  aliceblue: 4042850303,
  antiquewhite: 4209760255,
  aqua: 16777215,
  aquamarine: 2147472639,
  azure: 4043309055,
  beige: 4126530815,
  bisque: 4293182719,
  black: 255,
  blanchedalmond: 4293643775,
  blue: 65535,
  blueviolet: 2318131967,
  brown: 2771004159,
  burlywood: 3736635391,
  burntsienna: 3934150143,
  cadetblue: 1604231423,
  chartreuse: 2147418367,
  chocolate: 3530104575,
  coral: 4286533887,
  cornflowerblue: 1687547391,
  cornsilk: 4294499583,
  crimson: 3692313855,
  cyan: 16777215,
  darkblue: 35839,
  darkcyan: 9145343,
  darkgoldenrod: 3095792639,
  darkgray: 2846468607,
  darkgreen: 6553855,
  darkgrey: 2846468607,
  darkkhaki: 3182914559,
  darkmagenta: 2332068863,
  darkolivegreen: 1433087999,
  darkorange: 4287365375,
  darkorchid: 2570243327,
  darkred: 2332033279,
  darksalmon: 3918953215,
  darkseagreen: 2411499519,
  darkslateblue: 1211993087,
  darkslategray: 793726975,
  darkslategrey: 793726975,
  darkturquoise: 13554175,
  darkviolet: 2483082239,
  deeppink: 4279538687,
  deepskyblue: 12582911,
  dimgray: 1768516095,
  dimgrey: 1768516095,
  dodgerblue: 512819199,
  firebrick: 2988581631,
  floralwhite: 4294635775,
  forestgreen: 579543807,
  fuchsia: 4278255615,
  gainsboro: 3705462015,
  ghostwhite: 4177068031,
  gold: 4292280575,
  goldenrod: 3668254975,
  gray: 2155905279,
  green: 8388863,
  greenyellow: 2919182335,
  grey: 2155905279,
  honeydew: 4043305215,
  hotpink: 4285117695,
  indianred: 3445382399,
  indigo: 1258324735,
  ivory: 4294963455,
  khaki: 4041641215,
  lavender: 3873897215,
  lavenderblush: 4293981695,
  lawngreen: 2096890111,
  lemonchiffon: 4294626815,
  lightblue: 2916673279,
  lightcoral: 4034953471,
  lightcyan: 3774873599,
  lightgoldenrodyellow: 4210742015,
  lightgray: 3553874943,
  lightgreen: 2431553791,
  lightgrey: 3553874943,
  lightpink: 4290167295,
  lightsalmon: 4288707327,
  lightseagreen: 548580095,
  lightskyblue: 2278488831,
  lightslategray: 2005441023,
  lightslategrey: 2005441023,
  lightsteelblue: 2965692159,
  lightyellow: 4294959359,
  lime: 16711935,
  limegreen: 852308735,
  linen: 4210091775,
  magenta: 4278255615,
  maroon: 2147483903,
  mediumaquamarine: 1724754687,
  mediumblue: 52735,
  mediumorchid: 3126187007,
  mediumpurple: 2473647103,
  mediumseagreen: 1018393087,
  mediumslateblue: 2070474495,
  mediumspringgreen: 16423679,
  mediumturquoise: 1221709055,
  mediumvioletred: 3340076543,
  midnightblue: 421097727,
  mintcream: 4127193855,
  mistyrose: 4293190143,
  moccasin: 4293178879,
  navajowhite: 4292783615,
  navy: 33023,
  oldlace: 4260751103,
  olive: 2155872511,
  olivedrab: 1804477439,
  orange: 4289003775,
  orangered: 4282712319,
  orchid: 3664828159,
  palegoldenrod: 4008225535,
  palegreen: 2566625535,
  paleturquoise: 2951671551,
  palevioletred: 3681588223,
  papayawhip: 4293907967,
  peachpuff: 4292524543,
  peru: 3448061951,
  pink: 4290825215,
  plum: 3718307327,
  powderblue: 2967529215,
  purple: 2147516671,
  rebeccapurple: 1714657791,
  red: 4278190335,
  rosybrown: 3163525119,
  royalblue: 1097458175,
  saddlebrown: 2336560127,
  salmon: 4202722047,
  sandybrown: 4104413439,
  seagreen: 780883967,
  seashell: 4294307583,
  sienna: 2689740287,
  silver: 3233857791,
  skyblue: 2278484991,
  slateblue: 1784335871,
  slategray: 1887473919,
  slategrey: 1887473919,
  snow: 4294638335,
  springgreen: 16744447,
  steelblue: 1182971135,
  tan: 3535047935,
  teal: 8421631,
  thistle: 3636451583,
  tomato: 4284696575,
  turquoise: 1088475391,
  violet: 4001558271,
  wheat: 4125012991,
  white: 4294967295,
  whitesmoke: 4126537215,
  yellow: 4294902015,
  yellowgreen: 2597139199
}, Bn = "[-+]?\\d*\\.?\\d+", su = Bn + "%";
function zu(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const s_ = new RegExp("rgb" + zu(Bn, Bn, Bn)), l_ = new RegExp("rgba" + zu(Bn, Bn, Bn, Bn)), c_ = new RegExp("hsl" + zu(Bn, su, su)), f_ = new RegExp("hsla" + zu(Bn, su, su, Bn)), d_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, p_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, h_ = /^#([0-9a-fA-F]{6})$/, v_ = /^#([0-9a-fA-F]{8})$/;
function g_(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = h_.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Ir && Ir[e] !== void 0 ? Ir[e] : (t = s_.exec(e)) ? (mi(t[1]) << 24 | mi(t[2]) << 16 | mi(t[3]) << 8 | 255) >>> 0 : (t = l_.exec(e)) ? (mi(t[1]) << 24 | mi(t[2]) << 16 | mi(t[3]) << 8 | hp(t[4])) >>> 0 : (t = d_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = v_.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = p_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = c_.exec(e)) ? (dp(pp(t[1]), Ia(t[2]), Ia(t[3])) | 255) >>> 0 : (t = f_.exec(e)) ? (dp(pp(t[1]), Ia(t[2]), Ia(t[3])) | hp(t[4])) >>> 0 : null;
}
function Qs(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function dp(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = Qs(i, r, e + 1 / 3), a = Qs(i, r, e), u = Qs(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(a * 255) << 16 | Math.round(u * 255) << 8;
}
function mi(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function pp(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function hp(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function Ia(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function vp(e) {
  let t = g_(e);
  if (t === null)
    return e;
  t = t || 0;
  let n = (t & 4278190080) >>> 24, r = (t & 16711680) >>> 16, i = (t & 65280) >>> 8, o = (t & 255) / 255;
  return `rgba(${n}, ${r}, ${i}, ${o})`;
}
const zo = (e, t, n) => {
  if (de.fun(e))
    return e;
  if (de.arr(e))
    return zo({
      range: e,
      output: t,
      extrapolate: n
    });
  if (de.str(e.output[0]))
    return Zc(e);
  const r = e, i = r.output, o = r.range || [0, 1], a = r.extrapolateLeft || r.extrapolate || "extend", u = r.extrapolateRight || r.extrapolate || "extend", f = r.easing || ((c) => c);
  return (c) => {
    const h = y_(c, o);
    return m_(c, o[h], o[h + 1], i[h], i[h + 1], f, a, u, r.map);
  };
};
function m_(e, t, n, r, i, o, a, u, f) {
  let c = f ? f(e) : e;
  if (c < t) {
    if (a === "identity")
      return c;
    a === "clamp" && (c = t);
  }
  if (c > n) {
    if (u === "identity")
      return c;
    u === "clamp" && (c = n);
  }
  return r === i ? r : t === n ? e <= t ? r : i : (t === -1 / 0 ? c = -c : n === 1 / 0 ? c = c - t : c = (c - t) / (n - t), c = o(c), r === -1 / 0 ? c = -c : i === 1 / 0 ? c = c + r : c = c * (i - r) + r, c);
}
function y_(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
function zl() {
  return zl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, zl.apply(this, arguments);
}
const Ii = Symbol.for("FluidValue.get"), ui = Symbol.for("FluidValue.observers"), Pn = (e) => Boolean(e && e[Ii]), cn = (e) => e && e[Ii] ? e[Ii]() : e, gp = (e) => e[ui] || null;
function b_(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function Lo(e, t) {
  let n = e[ui];
  n && n.forEach((r) => {
    b_(r, t);
  });
}
class zg {
  constructor(t) {
    if (this[Ii] = void 0, this[ui] = void 0, !t && !(t = this.get))
      throw Error("Unknown getter");
    w_(this, t);
  }
}
const w_ = (e, t) => Lg(e, Ii, t);
function Hi(e, t) {
  if (e[Ii]) {
    let n = e[ui];
    n || Lg(e, ui, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function Go(e, t) {
  let n = e[ui];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[ui] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
const Lg = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), qa = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, x_ = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, mp = new RegExp(`(${qa.source})(%|[a-z]+)`, "i"), __ = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, Lu = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, Gg = (e) => {
  const [t, n] = S_(e);
  if (!t || Qc())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && Lu.test(n))
      return Gg(n);
    if (n)
      return n;
  }
  return e;
}, S_ = (e) => {
  const t = Lu.exec(e);
  if (!t)
    return [,];
  const [, n, r] = t;
  return [n, r];
};
let Zs;
const R_ = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, jg = (e) => {
  Zs || (Zs = Ir ? new RegExp(`(${Object.keys(Ir).join("|")})(?!\\w)`, "g") : /^\b$/);
  const t = e.output.map((o) => cn(o).replace(Lu, Gg).replace(x_, vp).replace(Zs, vp)), n = t.map((o) => o.match(qa).map(Number)), i = n[0].map((o, a) => n.map((u) => {
    if (!(a in u))
      throw Error('The arity of each "output" value must be equal');
    return u[a];
  })).map((o) => zo(zl({}, e, {
    output: o
  })));
  return (o) => {
    var a;
    const u = !mp.test(t[0]) && ((a = t.find((c) => mp.test(c))) == null ? void 0 : a.replace(qa, ""));
    let f = 0;
    return t[0].replace(qa, () => `${i[f++](o)}${u || ""}`).replace(__, R_);
  };
}, ef = "react-spring: ", Hg = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${ef}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, C_ = Hg(console.warn);
function P_() {
  C_(`${ef}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const T_ = Hg(console.warn);
function N_() {
  T_(`${ef}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function Gu(e) {
  return de.str(e) && (e[0] == "#" || /\d/.test(e) || !Qc() && Lu.test(e) || e in (Ir || {}));
}
const tf = Qc() ? on : Om, E_ = () => {
  const e = tn(!1);
  return tf(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Wg() {
  const e = hr()[1], t = E_();
  return () => {
    t.current && e(Math.random());
  };
}
function M_(e, t) {
  const [n] = hr(() => ({
    inputs: t,
    result: e()
  })), r = tn(), i = r.current;
  let o = i;
  return o ? Boolean(t && o.inputs && O_(t, o.inputs)) || (o = {
    inputs: t,
    result: e()
  }) : o = n, on(() => {
    r.current = o, i == n && (n.inputs = n.result = void 0);
  }, [o]), o.result;
}
function O_(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
const Ug = (e) => on(e, A_), A_ = [];
function yp(e) {
  const t = tn();
  return on(() => {
    t.current = e;
  }), t.current;
}
var k_ = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@react-spring/animated/dist/react-spring-animated.esm.js";
const jo = Symbol.for("Animated:node"), $_ = (e) => !!e && e[jo] === e, Kn = (e) => e && e[jo], nf = (e, t) => r_(e, jo, t), ju = (e) => e && e[jo] && e[jo].getPayload();
class Vg {
  constructor() {
    this.payload = void 0, nf(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}
class Wi extends Vg {
  constructor(t) {
    super(), this.done = !0, this.elapsedTime = void 0, this.lastPosition = void 0, this.lastVelocity = void 0, this.v0 = void 0, this.durationProgress = 0, this._value = t, de.num(this._value) && (this.lastPosition = this._value);
  }
  static create(t) {
    return new Wi(t);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(t, n) {
    return de.num(t) && (this.lastPosition = t, n && (t = Math.round(t / n) * n, this.done && (this.lastPosition = t))), this._value === t ? !1 : (this._value = t, !0);
  }
  reset() {
    const {
      done: t
    } = this;
    this.done = !1, de.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, t && (this.lastVelocity = null), this.v0 = null);
  }
}
class Bi extends Wi {
  constructor(t) {
    super(0), this._string = null, this._toString = void 0, this._toString = zo({
      output: [t, t]
    });
  }
  static create(t) {
    return new Bi(t);
  }
  getValue() {
    let t = this._string;
    return t == null ? this._string = this._toString(this._value) : t;
  }
  setValue(t) {
    if (de.str(t)) {
      if (t == this._string)
        return !1;
      this._string = t, this._value = 1;
    } else if (super.setValue(t))
      this._string = null;
    else
      return !1;
    return !0;
  }
  reset(t) {
    t && (this._toString = zo({
      output: [this.getValue(), t]
    })), this._value = 0, super.reset();
  }
}
const lu = {
  dependencies: null
};
class Hu extends Vg {
  constructor(t) {
    super(), this.source = t, this.setValue(t);
  }
  getValue(t) {
    const n = {};
    return tr(this.source, (r, i) => {
      $_(r) ? n[i] = r.getValue(t) : Pn(r) ? n[i] = cn(r) : t || (n[i] = r);
    }), n;
  }
  setValue(t) {
    this.source = t, this.payload = this._makePayload(t);
  }
  reset() {
    this.payload && bt(this.payload, (t) => t.reset());
  }
  _makePayload(t) {
    if (t) {
      const n = /* @__PURE__ */ new Set();
      return tr(t, this._addToPayload, n), Array.from(n);
    }
  }
  _addToPayload(t) {
    lu.dependencies && Pn(t) && lu.dependencies.add(t);
    const n = ju(t);
    n && bt(n, (r) => this.add(r));
  }
}
class rf extends Hu {
  constructor(t) {
    super(t);
  }
  static create(t) {
    return new rf(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(F_)), !0);
  }
}
function F_(e) {
  return (Gu(e) ? Bi : Wi).create(e);
}
function Ll(e) {
  const t = Kn(e);
  return t ? t.constructor : de.arr(e) ? rf : Gu(e) ? Bi : Wi;
}
function Gl() {
  return Gl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Gl.apply(this, arguments);
}
const bp = (e, t) => {
  const n = !de.fun(e) || e.prototype && e.prototype.isReactComponent;
  return Am((r, i) => {
    const o = tn(null), a = n && wt((_) => {
      o.current = D_(i, _);
    }, [i]), [u, f] = B_(r, t), c = Wg(), h = () => {
      const _ = o.current;
      if (n && !_)
        return;
      (_ ? t.applyAnimatedValues(_, u.getValue(!0)) : !1) === !1 && c();
    }, p = new I_(h, f), w = tn();
    tf(() => (w.current = p, bt(f, (_) => Hi(_, p)), () => {
      w.current && (bt(w.current.deps, (_) => Go(_, w.current)), at.cancel(w.current.update));
    })), on(h, []), Ug(() => () => {
      const _ = w.current;
      bt(_.deps, (T) => Go(T, _));
    });
    const P = t.getComponentProps(u.getValue());
    return /* @__PURE__ */ L(e, {
      ...P,
      ref: a
    }, void 0, !1, {
      fileName: k_,
      lineNumber: 291,
      columnNumber: 12
    }, globalThis);
  });
};
class I_ {
  constructor(t, n) {
    this.update = t, this.deps = n;
  }
  eventObserved(t) {
    t.type == "change" && at.write(this.update);
  }
}
function B_(e, t) {
  const n = /* @__PURE__ */ new Set();
  return lu.dependencies = n, e.style && (e = Gl({}, e, {
    style: t.createAnimatedStyle(e.style)
  })), e = new Hu(e), lu.dependencies = null, [e, n];
}
function D_(e, t) {
  return e && (de.fun(e) ? e(t) : e.current = t), t;
}
const wp = Symbol.for("AnimatedComponent"), z_ = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new Hu(i),
  getComponentProps: r = (i) => i
} = {}) => {
  const i = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, o = (a) => {
    const u = xp(a) || "Anonymous";
    return de.str(a) ? a = o[a] || (o[a] = bp(a, i)) : a = a[wp] || (a[wp] = bp(a, i)), a.displayName = `Animated(${u})`, a;
  };
  return tr(e, (a, u) => {
    de.arr(e) && (u = xp(a)), o[u] = o(a);
  }), {
    animated: o
  };
}, xp = (e) => de.str(e) ? e : e && de.str(e.displayName) ? e.displayName : de.fun(e) && e.name || null;
var L_ = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@react-spring/core/dist/react-spring-core.esm.js";
function Ut() {
  return Ut = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ut.apply(this, arguments);
}
function Qr(e, ...t) {
  return de.fun(e) ? e(...t) : e;
}
const Mo = (e, t) => e === !0 || !!(t && e && (de.fun(e) ? e(t) : vn(e).includes(t))), qg = (e, t) => de.obj(e) ? t && e[t] : e, Yg = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, G_ = (e) => e, of = (e, t = G_) => {
  let n = j_;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    de.und(o) || (r[i] = o);
  }
  return r;
}, j_ = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"], H_ = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,
  keys: 1,
  callId: 1,
  parentId: 1
};
function W_(e) {
  const t = {};
  let n = 0;
  if (tr(e, (r, i) => {
    H_[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function Xg(e) {
  const t = W_(e);
  if (t) {
    const n = {
      to: t
    };
    return tr(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return Ut({}, e);
}
function Ho(e) {
  return e = cn(e), de.arr(e) ? e.map(Ho) : Gu(e) ? nr.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function U_(e) {
  for (const t in e)
    return !0;
  return !1;
}
function jl(e) {
  return de.fun(e) || de.arr(e) && de.obj(e[0]);
}
function V_(e, t) {
  var n;
  (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
}
function q_(e, t) {
  if (t && e.ref !== t) {
    var n;
    (n = e.ref) == null || n.delete(e), t.add(e), e.ref = t;
  }
}
const Y_ = {
  default: {
    tension: 170,
    friction: 26
  },
  gentle: {
    tension: 120,
    friction: 14
  },
  wobbly: {
    tension: 180,
    friction: 12
  },
  stiff: {
    tension: 210,
    friction: 20
  },
  slow: {
    tension: 280,
    friction: 60
  },
  molasses: {
    tension: 280,
    friction: 120
  }
}, cu = 1.70158, Ba = cu * 1.525, _p = cu + 1, Sp = 2 * Math.PI / 3, Rp = 2 * Math.PI / 4.5, Da = (e) => e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375, X_ = {
  linear: (e) => e,
  easeInQuad: (e) => e * e,
  easeOutQuad: (e) => 1 - (1 - e) * (1 - e),
  easeInOutQuad: (e) => e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2,
  easeInCubic: (e) => e * e * e,
  easeOutCubic: (e) => 1 - Math.pow(1 - e, 3),
  easeInOutCubic: (e) => e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2,
  easeInQuart: (e) => e * e * e * e,
  easeOutQuart: (e) => 1 - Math.pow(1 - e, 4),
  easeInOutQuart: (e) => e < 0.5 ? 8 * e * e * e * e : 1 - Math.pow(-2 * e + 2, 4) / 2,
  easeInQuint: (e) => e * e * e * e * e,
  easeOutQuint: (e) => 1 - Math.pow(1 - e, 5),
  easeInOutQuint: (e) => e < 0.5 ? 16 * e * e * e * e * e : 1 - Math.pow(-2 * e + 2, 5) / 2,
  easeInSine: (e) => 1 - Math.cos(e * Math.PI / 2),
  easeOutSine: (e) => Math.sin(e * Math.PI / 2),
  easeInOutSine: (e) => -(Math.cos(Math.PI * e) - 1) / 2,
  easeInExpo: (e) => e === 0 ? 0 : Math.pow(2, 10 * e - 10),
  easeOutExpo: (e) => e === 1 ? 1 : 1 - Math.pow(2, -10 * e),
  easeInOutExpo: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? Math.pow(2, 20 * e - 10) / 2 : (2 - Math.pow(2, -20 * e + 10)) / 2,
  easeInCirc: (e) => 1 - Math.sqrt(1 - Math.pow(e, 2)),
  easeOutCirc: (e) => Math.sqrt(1 - Math.pow(e - 1, 2)),
  easeInOutCirc: (e) => e < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * e, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * e + 2, 2)) + 1) / 2,
  easeInBack: (e) => _p * e * e * e - cu * e * e,
  easeOutBack: (e) => 1 + _p * Math.pow(e - 1, 3) + cu * Math.pow(e - 1, 2),
  easeInOutBack: (e) => e < 0.5 ? Math.pow(2 * e, 2) * ((Ba + 1) * 2 * e - Ba) / 2 : (Math.pow(2 * e - 2, 2) * ((Ba + 1) * (e * 2 - 2) + Ba) + 2) / 2,
  easeInElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((e * 10 - 10.75) * Sp),
  easeOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((e * 10 - 0.75) * Sp) + 1,
  easeInOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * Rp)) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * Rp) / 2 + 1,
  easeInBounce: (e) => 1 - Da(1 - e),
  easeOutBounce: Da,
  easeInOutBounce: (e) => e < 0.5 ? (1 - Da(1 - 2 * e)) / 2 : (1 + Da(2 * e - 1)) / 2
}, Hl = Ut({}, Y_.default, {
  mass: 1,
  damping: 1,
  easing: X_.linear,
  clamp: !1
});
class K_ {
  constructor() {
    this.tension = void 0, this.friction = void 0, this.frequency = void 0, this.damping = void 0, this.mass = void 0, this.velocity = 0, this.restVelocity = void 0, this.precision = void 0, this.progress = void 0, this.duration = void 0, this.easing = void 0, this.clamp = void 0, this.bounce = void 0, this.decay = void 0, this.round = void 0, Object.assign(this, Hl);
  }
}
function Q_(e, t, n) {
  n && (n = Ut({}, n), Cp(n, t), t = Ut({}, n, t)), Cp(e, t), Object.assign(e, t);
  for (const a in Hl)
    e[a] == null && (e[a] = Hl[a]);
  let {
    mass: r,
    frequency: i,
    damping: o
  } = e;
  return de.und(i) || (i < 0.01 && (i = 0.01), o < 0 && (o = 0), e.tension = Math.pow(2 * Math.PI / i, 2) * r, e.friction = 4 * Math.PI * o * r / i), e;
}
function Cp(e, t) {
  if (!de.und(t.decay))
    e.duration = void 0;
  else {
    const n = !de.und(t.tension) || !de.und(t.friction);
    (n || !de.und(t.frequency) || !de.und(t.damping) || !de.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
const Pp = [];
class Z_ {
  constructor() {
    this.changed = !1, this.values = Pp, this.toValues = null, this.fromValues = Pp, this.to = void 0, this.from = void 0, this.config = new K_(), this.immediate = !1;
  }
}
function Kg(e, {
  key: t,
  props: n,
  defaultProps: r,
  state: i,
  actions: o
}) {
  return new Promise((a, u) => {
    var f;
    let c, h, p = Mo((f = n.cancel) != null ? f : r == null ? void 0 : r.cancel, t);
    if (p)
      _();
    else {
      de.und(n.pause) || (i.paused = Mo(n.pause, t));
      let T = r == null ? void 0 : r.pause;
      T !== !0 && (T = i.paused || Mo(T, t)), c = Qr(n.delay || 0, t), T ? (i.resumeQueue.add(P), o.pause()) : (o.resume(), P());
    }
    function w() {
      i.resumeQueue.add(P), i.timeouts.delete(h), h.cancel(), c = h.time - at.now();
    }
    function P() {
      c > 0 && !nr.skipAnimation ? (i.delayed = !0, h = at.setTimeout(_, c), i.pauseQueue.add(w), i.timeouts.add(h)) : _();
    }
    function _() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(w), i.timeouts.delete(h), e <= (i.cancelId || 0) && (p = !0);
      try {
        o.start(Ut({}, n, {
          callId: e,
          cancel: p
        }), a);
      } catch (T) {
        u(T);
      }
    }
  });
}
const af = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? Mi(e.get()) : t.every((n) => n.noop) ? Qg(e.get()) : Fn(e.get(), t.every((n) => n.finished)), Qg = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), Fn = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), Mi = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function Zg(e, t, n, r) {
  const {
    callId: i,
    parentId: o,
    onRest: a
  } = t, {
    asyncTo: u,
    promise: f
  } = n;
  return !o && e === u && !t.reset ? f : n.promise = (async () => {
    n.asyncId = i, n.asyncTo = e;
    const c = of(t, (I, k) => k === "onRest" ? void 0 : I);
    let h, p;
    const w = new Promise((I, k) => (h = I, p = k)), P = (I) => {
      const k = i <= (n.cancelId || 0) && Mi(r) || i !== n.asyncId && Fn(r, !1);
      if (k)
        throw I.result = k, p(I), I;
    }, _ = (I, k) => {
      const F = new Tp(), N = new Np();
      return (async () => {
        if (nr.skipAnimation)
          throw Wo(n), N.result = Fn(r, !1), p(N), N;
        P(F);
        const G = de.obj(I) ? Ut({}, I) : Ut({}, k, {
          to: I
        });
        G.parentId = i, tr(c, (D, te) => {
          de.und(G[te]) && (G[te] = D);
        });
        const M = await r.start(G);
        return P(F), n.paused && await new Promise((D) => {
          n.resumeQueue.add(D);
        }), M;
      })();
    };
    let T;
    if (nr.skipAnimation)
      return Wo(n), Fn(r, !1);
    try {
      let I;
      de.arr(e) ? I = (async (k) => {
        for (const F of k)
          await _(F);
      })(e) : I = Promise.resolve(e(_, r.stop.bind(r))), await Promise.all([I.then(h), w]), T = Fn(r.get(), !0, !1);
    } catch (I) {
      if (I instanceof Tp)
        T = I.result;
      else if (I instanceof Np)
        T = I.result;
      else
        throw I;
    } finally {
      i == n.asyncId && (n.asyncId = o, n.asyncTo = o ? u : void 0, n.promise = o ? f : void 0);
    }
    return de.fun(a) && at.batchedUpdates(() => {
      a(T, r, r.item);
    }), T;
  })();
}
function Wo(e, t) {
  No(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
class Tp extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."), this.result = void 0;
  }
}
class Np extends Error {
  constructor() {
    super("SkipAnimationSignal"), this.result = void 0;
  }
}
const Wl = (e) => e instanceof uf;
let J_ = 1;
class uf extends zg {
  constructor(...t) {
    super(...t), this.id = J_++, this.key = void 0, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(t) {
    this._priority != t && (this._priority = t, this._onPriorityChange(t));
  }
  get() {
    const t = Kn(this);
    return t && t.getValue();
  }
  to(...t) {
    return nr.to(this, t);
  }
  interpolate(...t) {
    return P_(), nr.to(this, t);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(t) {
    t == 1 && this._attach();
  }
  observerRemoved(t) {
    t == 0 && this._detach();
  }
  _attach() {
  }
  _detach() {
  }
  _onChange(t, n = !1) {
    Lo(this, {
      type: "change",
      parent: this,
      value: t,
      idle: n
    });
  }
  _onPriorityChange(t) {
    this.idle || Du.sort(this), Lo(this, {
      type: "priority",
      parent: this,
      priority: t
    });
  }
}
const si = Symbol.for("SpringPhase"), Jg = 1, Ul = 2, Vl = 4, Js = (e) => (e[si] & Jg) > 0, Cr = (e) => (e[si] & Ul) > 0, fo = (e) => (e[si] & Vl) > 0, Ep = (e, t) => t ? e[si] |= Ul | Jg : e[si] &= ~Ul, Mp = (e, t) => t ? e[si] |= Vl : e[si] &= ~Vl;
class eS extends uf {
  constructor(t, n) {
    if (super(), this.key = void 0, this.animation = new Z_(), this.queue = void 0, this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !de.und(t) || !de.und(n)) {
      const r = de.obj(t) ? Ut({}, t) : Ut({}, n, {
        from: t
      });
      de.und(r.default) && (r.default = !0), this.start(r);
    }
  }
  get idle() {
    return !(Cr(this) || this._state.asyncTo) || fo(this);
  }
  get goal() {
    return cn(this.animation.to);
  }
  get velocity() {
    const t = Kn(this);
    return t instanceof Wi ? t.lastVelocity || 0 : t.getPayload().map((n) => n.lastVelocity || 0);
  }
  get hasAnimated() {
    return Js(this);
  }
  get isAnimating() {
    return Cr(this);
  }
  get isPaused() {
    return fo(this);
  }
  get isDelayed() {
    return this._state.delayed;
  }
  advance(t) {
    let n = !0, r = !1;
    const i = this.animation;
    let {
      config: o,
      toValues: a
    } = i;
    const u = ju(i.to);
    !u && Pn(i.to) && (a = vn(cn(i.to))), i.values.forEach((h, p) => {
      if (h.done)
        return;
      const w = h.constructor == Bi ? 1 : u ? u[p].lastPosition : a[p];
      let P = i.immediate, _ = w;
      if (!P) {
        if (_ = h.lastPosition, o.tension <= 0) {
          h.done = !0;
          return;
        }
        let T = h.elapsedTime += t;
        const I = i.fromValues[p], k = h.v0 != null ? h.v0 : h.v0 = de.arr(o.velocity) ? o.velocity[p] : o.velocity;
        let F;
        if (de.und(o.duration))
          if (o.decay) {
            const N = o.decay === !0 ? 0.998 : o.decay, G = Math.exp(-(1 - N) * T);
            _ = I + k / (1 - N) * (1 - G), P = Math.abs(h.lastPosition - _) < 0.1, F = k * G;
          } else {
            F = h.lastVelocity == null ? k : h.lastVelocity;
            const N = o.precision || (I == w ? 5e-3 : Math.min(1, Math.abs(w - I) * 1e-3)), G = o.restVelocity || N / 10, M = o.clamp ? 0 : o.bounce, D = !de.und(M), te = I == w ? h.v0 > 0 : I < w;
            let Q, fe = !1;
            const ge = 1, re = Math.ceil(t / ge);
            for (let ee = 0; ee < re && (Q = Math.abs(F) > G, !(!Q && (P = Math.abs(w - _) <= N, P))); ++ee) {
              D && (fe = _ == w || _ > w == te, fe && (F = -F * M, _ = w));
              const be = -o.tension * 1e-6 * (_ - w), Oe = -o.friction * 1e-3 * F, ut = (be + Oe) / o.mass;
              F = F + ut * ge, _ = _ + F * ge;
            }
          }
        else {
          let N = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, h.durationProgress > 0 && (h.elapsedTime = o.duration * h.durationProgress, T = h.elapsedTime += t)), N = (o.progress || 0) + T / this._memoizedDuration, N = N > 1 ? 1 : N < 0 ? 0 : N, h.durationProgress = N), _ = I + o.easing(N) * (w - I), F = (_ - h.lastPosition) / t, P = N == 1;
        }
        h.lastVelocity = F, Number.isNaN(_) && (console.warn("Got NaN while animating:", this), P = !0);
      }
      u && !u[p].done && (P = !1), P ? h.done = !0 : n = !1, h.setValue(_, o.round) && (r = !0);
    });
    const f = Kn(this), c = f.getValue();
    if (n) {
      const h = cn(i.to);
      (c !== h || r) && !o.decay ? (f.setValue(h), this._onChange(h)) : r && o.decay && this._onChange(c), this._stop();
    } else
      r && this._onChange(c);
  }
  set(t) {
    return at.batchedUpdates(() => {
      this._stop(), this._focus(t), this._set(t);
    }), this;
  }
  pause() {
    this._update({
      pause: !0
    });
  }
  resume() {
    this._update({
      pause: !1
    });
  }
  finish() {
    if (Cr(this)) {
      const {
        to: t,
        config: n
      } = this.animation;
      at.batchedUpdates(() => {
        this._onStart(), n.decay || this._set(t, !1), this._stop();
      });
    }
    return this;
  }
  update(t) {
    return (this.queue || (this.queue = [])).push(t), this;
  }
  start(t, n) {
    let r;
    return de.und(t) ? (r = this.queue || [], this.queue = []) : r = [de.obj(t) ? t : Ut({}, n, {
      to: t
    })], Promise.all(r.map((i) => this._update(i))).then((i) => af(this, i));
  }
  stop(t) {
    const {
      to: n
    } = this.animation;
    return this._focus(this.get()), Wo(this._state, t && this._lastCallId), at.batchedUpdates(() => this._stop(n, t)), this;
  }
  reset() {
    this._update({
      reset: !0
    });
  }
  eventObserved(t) {
    t.type == "change" ? this._start() : t.type == "priority" && (this.priority = t.priority + 1);
  }
  _prepareNode(t) {
    const n = this.key || "";
    let {
      to: r,
      from: i
    } = t;
    r = de.obj(r) ? r[n] : r, (r == null || jl(r)) && (r = void 0), i = de.obj(i) ? i[n] : i, i == null && (i = void 0);
    const o = {
      to: r,
      from: i
    };
    return Js(this) || (t.reverse && ([r, i] = [i, r]), i = cn(i), de.und(i) ? Kn(this) || this._set(r) : this._set(i)), o;
  }
  _update(t, n) {
    let r = Ut({}, t);
    const {
      key: i,
      defaultProps: o
    } = this;
    r.default && Object.assign(o, of(r, (f, c) => /^on/.test(c) ? qg(f, i) : f)), Ap(this, r, "onProps"), ho(this, "onProps", r, this);
    const a = this._prepareNode(r);
    if (Object.isFrozen(this))
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    const u = this._state;
    return Kg(++this._lastCallId, {
      key: i,
      props: r,
      defaultProps: o,
      state: u,
      actions: {
        pause: () => {
          fo(this) || (Mp(this, !0), So(u.pauseQueue), ho(this, "onPause", Fn(this, po(this, this.animation.to)), this));
        },
        resume: () => {
          fo(this) && (Mp(this, !1), Cr(this) && this._resume(), So(u.resumeQueue), ho(this, "onResume", Fn(this, po(this, this.animation.to)), this));
        },
        start: this._merge.bind(this, a)
      }
    }).then((f) => {
      if (r.loop && f.finished && !(n && f.noop)) {
        const c = em(r);
        if (c)
          return this._update(c, !0);
      }
      return f;
    });
  }
  _merge(t, n, r) {
    if (n.cancel)
      return this.stop(!0), r(Mi(this));
    const i = !de.und(t.to), o = !de.und(t.from);
    if (i || o)
      if (n.callId > this._lastToId)
        this._lastToId = n.callId;
      else
        return r(Mi(this));
    const {
      key: a,
      defaultProps: u,
      animation: f
    } = this, {
      to: c,
      from: h
    } = f;
    let {
      to: p = c,
      from: w = h
    } = t;
    o && !i && (!n.default || de.und(p)) && (p = w), n.reverse && ([p, w] = [w, p]);
    const P = !sr(w, h);
    P && (f.from = w), w = cn(w);
    const _ = !sr(p, c);
    _ && this._focus(p);
    const T = jl(n.to), {
      config: I
    } = f, {
      decay: k,
      velocity: F
    } = I;
    (i || o) && (I.velocity = 0), n.config && !T && Q_(I, Qr(n.config, a), n.config !== u.config ? Qr(u.config, a) : void 0);
    let N = Kn(this);
    if (!N || de.und(p))
      return r(Fn(this, !0));
    const G = de.und(n.reset) ? o && !n.default : !de.und(w) && Mo(n.reset, a), M = G ? w : this.get(), D = Ho(p), te = de.num(D) || de.arr(D) || Gu(D), Q = !T && (!te || Mo(u.immediate || n.immediate, a));
    if (_) {
      const ee = Ll(p);
      if (ee !== N.constructor)
        if (Q)
          N = this._set(D);
        else
          throw Error(`Cannot animate between ${N.constructor.name} and ${ee.name}, as the "to" prop suggests`);
    }
    const fe = N.constructor;
    let ge = Pn(p), re = !1;
    if (!ge) {
      const ee = G || !Js(this) && P;
      (_ || ee) && (re = sr(Ho(M), D), ge = !re), (!sr(f.immediate, Q) && !Q || !sr(I.decay, k) || !sr(I.velocity, F)) && (ge = !0);
    }
    if (re && Cr(this) && (f.changed && !G ? ge = !0 : ge || this._stop(c)), !T && ((ge || Pn(c)) && (f.values = N.getPayload(), f.toValues = Pn(p) ? null : fe == Bi ? [1] : vn(D)), f.immediate != Q && (f.immediate = Q, !Q && !G && this._set(c)), ge)) {
      const {
        onRest: ee
      } = f;
      bt(nS, (Oe) => Ap(this, n, Oe));
      const be = Fn(this, po(this, c));
      So(this._pendingCalls, be), this._pendingCalls.add(r), f.changed && at.batchedUpdates(() => {
        f.changed = !G, ee == null || ee(be, this), G ? Qr(u.onRest, be) : f.onStart == null || f.onStart(be, this);
      });
    }
    G && this._set(M), T ? r(Zg(n.to, n, this._state, this)) : ge ? this._start() : Cr(this) && !_ ? this._pendingCalls.add(r) : r(Qg(M));
  }
  _focus(t) {
    const n = this.animation;
    t !== n.to && (gp(this) && this._detach(), n.to = t, gp(this) && this._attach());
  }
  _attach() {
    let t = 0;
    const {
      to: n
    } = this.animation;
    Pn(n) && (Hi(n, this), Wl(n) && (t = n.priority + 1)), this.priority = t;
  }
  _detach() {
    const {
      to: t
    } = this.animation;
    Pn(t) && Go(t, this);
  }
  _set(t, n = !0) {
    const r = cn(t);
    if (!de.und(r)) {
      const i = Kn(this);
      if (!i || !sr(r, i.getValue())) {
        const o = Ll(r);
        !i || i.constructor != o ? nf(this, o.create(r)) : i.setValue(r), i && at.batchedUpdates(() => {
          this._onChange(r, n);
        });
      }
    }
    return Kn(this);
  }
  _onStart() {
    const t = this.animation;
    t.changed || (t.changed = !0, ho(this, "onStart", Fn(this, po(this, t.to)), this));
  }
  _onChange(t, n) {
    n || (this._onStart(), Qr(this.animation.onChange, t, this)), Qr(this.defaultProps.onChange, t, this), super._onChange(t, n);
  }
  _start() {
    const t = this.animation;
    Kn(this).reset(cn(t.to)), t.immediate || (t.fromValues = t.values.map((n) => n.lastPosition)), Cr(this) || (Ep(this, !0), fo(this) || this._resume());
  }
  _resume() {
    nr.skipAnimation ? this.finish() : Du.start(this);
  }
  _stop(t, n) {
    if (Cr(this)) {
      Ep(this, !1);
      const r = this.animation;
      bt(r.values, (o) => {
        o.done = !0;
      }), r.toValues && (r.onChange = r.onPause = r.onResume = void 0), Lo(this, {
        type: "idle",
        parent: this
      });
      const i = n ? Mi(this.get()) : Fn(this.get(), po(this, t != null ? t : r.to));
      So(this._pendingCalls, i), r.changed && (r.changed = !1, ho(this, "onRest", i, this));
    }
  }
}
function po(e, t) {
  const n = Ho(t), r = Ho(e.get());
  return sr(r, n);
}
function em(e, t = e.loop, n = e.to) {
  let r = Qr(t);
  if (r) {
    const i = r !== !0 && Xg(r), o = (i || e).reverse, a = !i || i.reset;
    return Uo(Ut({}, e, {
      loop: t,
      default: !1,
      pause: void 0,
      to: !o || jl(n) ? n : void 0,
      from: a ? e.from : void 0,
      reset: a
    }, i));
  }
}
function Uo(e) {
  const {
    to: t,
    from: n
  } = e = Xg(e), r = /* @__PURE__ */ new Set();
  return de.obj(t) && Op(t, r), de.obj(n) && Op(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function tS(e) {
  const t = Uo(e);
  return de.und(t.default) && (t.default = of(t)), t;
}
function Op(e, t) {
  tr(e, (n, r) => n != null && t.add(r));
}
const nS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function Ap(e, t, n) {
  e.animation[n] = t[n] !== Yg(t, n) ? qg(t[n], e.key) : void 0;
}
function ho(e, t, ...n) {
  var r, i, o, a;
  (r = (i = e.animation)[t]) == null || r.call(i, ...n), (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
}
const rS = ["onStart", "onChange", "onRest"];
let iS = 1;
class oS {
  constructor(t, n) {
    this.id = iS++, this.springs = {}, this.queue = [], this.ref = void 0, this._flush = void 0, this._initialProps = void 0, this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._item = void 0, this._state = {
      paused: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    }, this._onFrame = this._onFrame.bind(this), n && (this._flush = n), t && this.start(Ut({
      default: !0
    }, t));
  }
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every((t) => t.idle && !t.isDelayed && !t.isPaused);
  }
  get item() {
    return this._item;
  }
  set item(t) {
    this._item = t;
  }
  get() {
    const t = {};
    return this.each((n, r) => t[r] = n.get()), t;
  }
  set(t) {
    for (const n in t) {
      const r = t[n];
      de.und(r) || this.springs[n].set(r);
    }
  }
  update(t) {
    return t && this.queue.push(Uo(t)), this;
  }
  start(t) {
    let {
      queue: n
    } = this;
    return t ? n = vn(t).map(Uo) : this.queue = [], this._flush ? this._flush(this, n) : (om(this, n), ql(this, n));
  }
  stop(t, n) {
    if (t !== !!t && (n = t), n) {
      const r = this.springs;
      bt(vn(n), (i) => r[i].stop(!!t));
    } else
      Wo(this._state, this._lastAsyncId), this.each((r) => r.stop(!!t));
    return this;
  }
  pause(t) {
    if (de.und(t))
      this.start({
        pause: !0
      });
    else {
      const n = this.springs;
      bt(vn(t), (r) => n[r].pause());
    }
    return this;
  }
  resume(t) {
    if (de.und(t))
      this.start({
        pause: !1
      });
    else {
      const n = this.springs;
      bt(vn(t), (r) => n[r].resume());
    }
    return this;
  }
  each(t) {
    tr(this.springs, t);
  }
  _onFrame() {
    const {
      onStart: t,
      onChange: n,
      onRest: r
    } = this._events, i = this._active.size > 0, o = this._changed.size > 0;
    (i && !this._started || o && !this._started) && (this._started = !0, No(t, ([f, c]) => {
      c.value = this.get(), f(c, this, this._item);
    }));
    const a = !i && this._started, u = o || a && r.size ? this.get() : null;
    o && n.size && No(n, ([f, c]) => {
      c.value = u, f(c, this, this._item);
    }), a && (this._started = !1, No(r, ([f, c]) => {
      c.value = u, f(c, this, this._item);
    }));
  }
  eventObserved(t) {
    if (t.type == "change")
      this._changed.add(t.parent), t.idle || this._active.add(t.parent);
    else if (t.type == "idle")
      this._active.delete(t.parent);
    else
      return;
    at.onFrame(this._onFrame);
  }
}
function ql(e, t) {
  return Promise.all(t.map((n) => tm(e, n))).then((n) => af(e, n));
}
async function tm(e, t, n) {
  const {
    keys: r,
    to: i,
    from: o,
    loop: a,
    onRest: u,
    onResolve: f
  } = t, c = de.obj(t.default) && t.default;
  a && (t.loop = !1), i === !1 && (t.to = null), o === !1 && (t.from = null);
  const h = de.arr(i) || de.fun(i) ? i : void 0;
  h ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : bt(rS, (T) => {
    const I = t[T];
    if (de.fun(I)) {
      const k = e._events[T];
      t[T] = ({
        finished: F,
        cancelled: N
      }) => {
        const G = k.get(I);
        G ? (F || (G.finished = !1), N && (G.cancelled = !0)) : k.set(I, {
          value: null,
          finished: F || !1,
          cancelled: N || !1
        });
      }, c && (c[T] = t[T]);
    }
  });
  const p = e._state;
  t.pause === !p.paused ? (p.paused = t.pause, So(t.pause ? p.pauseQueue : p.resumeQueue)) : p.paused && (t.pause = !0);
  const w = (r || Object.keys(e.springs)).map((T) => e.springs[T].start(t)), P = t.cancel === !0 || Yg(t, "cancel") === !0;
  (h || P && p.asyncId) && w.push(Kg(++e._lastAsyncId, {
    props: t,
    state: p,
    actions: {
      pause: Bl,
      resume: Bl,
      start(T, I) {
        P ? (Wo(p, e._lastAsyncId), I(Mi(e))) : (T.onRest = u, I(Zg(h, T, p, e)));
      }
    }
  })), p.paused && await new Promise((T) => {
    p.resumeQueue.add(T);
  });
  const _ = af(e, await Promise.all(w));
  if (a && _.finished && !(n && _.noop)) {
    const T = em(t, a, i);
    if (T)
      return om(e, [T]), tm(e, T, !0);
  }
  return f && at.batchedUpdates(() => f(_, e, e.item)), _;
}
function kp(e, t) {
  const n = Ut({}, e.springs);
  return t && bt(vn(t), (r) => {
    de.und(r.keys) && (r = Uo(r)), de.obj(r.to) || (r = Ut({}, r, {
      to: void 0
    })), im(n, r, (i) => rm(i));
  }), nm(e, n), n;
}
function nm(e, t) {
  tr(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Hi(n, e));
  });
}
function rm(e, t) {
  const n = new eS();
  return n.key = e, t && Hi(n, t), n;
}
function im(e, t, n) {
  t.keys && bt(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function om(e, t) {
  bt(t, (n) => {
    im(e.springs, n, (r) => rm(r, e));
  });
}
function aS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const uS = ["children"], Wu = (e) => {
  let {
    children: t
  } = e, n = aS(e, uS);
  const r = an(fu), i = n.pause || !!r.pause, o = n.immediate || !!r.immediate;
  n = M_(() => ({
    pause: i,
    immediate: o
  }), [i, o]);
  const {
    Provider: a
  } = fu;
  return /* @__PURE__ */ L(a, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: L_,
    lineNumber: 1849,
    columnNumber: 10
  }, globalThis);
}, fu = sS(Wu, {});
Wu.Provider = fu.Provider;
Wu.Consumer = fu.Consumer;
function sS(e, t) {
  return Object.assign(e, In.createContext(t)), e.Provider._context = e, e.Consumer._context = e, e;
}
const lS = () => {
  const e = [], t = function(i) {
    N_();
    const o = [];
    return bt(e, (a, u) => {
      if (de.und(i))
        o.push(a.start());
      else {
        const f = n(i, a, u);
        f && o.push(a.start(f));
      }
    }), o;
  };
  t.current = e, t.add = function(r) {
    e.includes(r) || e.push(r);
  }, t.delete = function(r) {
    const i = e.indexOf(r);
    ~i && e.splice(i, 1);
  }, t.pause = function() {
    return bt(e, (r) => r.pause(...arguments)), this;
  }, t.resume = function() {
    return bt(e, (r) => r.resume(...arguments)), this;
  }, t.set = function(r) {
    bt(e, (i) => i.set(r));
  }, t.start = function(r) {
    const i = [];
    return bt(e, (o, a) => {
      if (de.und(r))
        i.push(o.start());
      else {
        const u = this._getProps(r, o, a);
        u && i.push(o.start(u));
      }
    }), i;
  }, t.stop = function() {
    return bt(e, (r) => r.stop(...arguments)), this;
  }, t.update = function(r) {
    return bt(e, (i, o) => i.update(this._getProps(r, i, o))), this;
  };
  const n = function(i, o, a) {
    return de.fun(i) ? i(a, o) : i;
  };
  return t._getProps = n, t;
};
function cS(e, t, n) {
  const r = de.fun(t) && t;
  r && !n && (n = []);
  const i = Ht(() => r || arguments.length == 3 ? lS() : void 0, []), o = tn(0), a = Wg(), u = Ht(() => ({
    ctrls: [],
    queue: [],
    flush(k, F) {
      const N = kp(k, F);
      return o.current > 0 && !u.queue.length && !Object.keys(N).some((M) => !k.springs[M]) ? ql(k, F) : new Promise((M) => {
        nm(k, N), u.queue.push(() => {
          M(ql(k, F));
        }), a();
      });
    }
  }), []), f = tn([...u.ctrls]), c = [], h = yp(e) || 0;
  Ht(() => {
    bt(f.current.slice(e, h), (k) => {
      V_(k, i), k.stop(!0);
    }), f.current.length = e, p(h, e);
  }, [e]), Ht(() => {
    p(0, Math.min(h, e));
  }, n);
  function p(k, F) {
    for (let N = k; N < F; N++) {
      const G = f.current[N] || (f.current[N] = new oS(null, u.flush)), M = r ? r(N, G) : t[N];
      M && (c[N] = tS(M));
    }
  }
  const w = f.current.map((k, F) => kp(k, c[F])), P = an(Wu), _ = yp(P), T = P !== _ && U_(P);
  tf(() => {
    o.current++, u.ctrls = f.current;
    const {
      queue: k
    } = u;
    k.length && (u.queue = [], bt(k, (F) => F())), bt(f.current, (F, N) => {
      i == null || i.add(F), T && F.start({
        default: P
      });
      const G = c[N];
      G && (q_(F, G.ref), F.ref ? F.queue.push(G) : F.start(G));
    });
  }), Ug(() => () => {
    bt(u.ctrls, (k) => k.stop(!0));
  });
  const I = w.map((k) => Ut({}, k));
  return i ? [I, i] : I;
}
function $p(e, t) {
  const n = de.fun(e), [[r], i] = cS(1, n ? e : [e], n ? t || [] : t);
  return n || arguments.length == 2 ? [r, i] : r;
}
let Fp;
(function(e) {
  e.MOUNT = "mount", e.ENTER = "enter", e.UPDATE = "update", e.LEAVE = "leave";
})(Fp || (Fp = {}));
class fS extends uf {
  constructor(t, n) {
    super(), this.key = void 0, this.idle = !0, this.calc = void 0, this._active = /* @__PURE__ */ new Set(), this.source = t, this.calc = zo(...n);
    const r = this._get(), i = Ll(r);
    nf(this, i.create(r));
  }
  advance(t) {
    const n = this._get(), r = this.get();
    sr(n, r) || (Kn(this).setValue(n), this._onChange(n, this.idle)), !this.idle && Ip(this._active) && el(this);
  }
  _get() {
    const t = de.arr(this.source) ? this.source.map(cn) : vn(cn(this.source));
    return this.calc(...t);
  }
  _start() {
    this.idle && !Ip(this._active) && (this.idle = !1, bt(ju(this), (t) => {
      t.done = !1;
    }), nr.skipAnimation ? (at.batchedUpdates(() => this.advance()), el(this)) : Du.start(this));
  }
  _attach() {
    let t = 1;
    bt(vn(this.source), (n) => {
      Pn(n) && Hi(n, this), Wl(n) && (n.idle || this._active.add(n), t = Math.max(t, n.priority + 1));
    }), this.priority = t, this._start();
  }
  _detach() {
    bt(vn(this.source), (t) => {
      Pn(t) && Go(t, this);
    }), this._active.clear(), el(this);
  }
  eventObserved(t) {
    t.type == "change" ? t.idle ? this.advance() : (this._active.add(t.parent), this._start()) : t.type == "idle" ? this._active.delete(t.parent) : t.type == "priority" && (this.priority = vn(this.source).reduce((n, r) => Math.max(n, (Wl(r) ? r.priority : 0) + 1), 0));
  }
}
function dS(e) {
  return e.idle !== !1;
}
function Ip(e) {
  return !e.size || Array.from(e).every(dS);
}
function el(e) {
  e.idle || (e.idle = !0, bt(ju(e), (t) => {
    t.done = !0;
  }), Lo(e, {
    type: "idle",
    parent: e
  }));
}
nr.assign({
  createStringInterpolator: jg,
  to: (e, t) => new fS(e, t)
});
function sf(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const pS = ["style", "children", "scrollTop", "scrollLeft"], am = /^--/;
function hS(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !am.test(e) && !(Oo.hasOwnProperty(e) && Oo[e]) ? t + "px" : ("" + t).trim();
}
const Bp = {};
function vS(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", r = t, {
    style: i,
    children: o,
    scrollTop: a,
    scrollLeft: u
  } = r, f = sf(r, pS), c = Object.values(f), h = Object.keys(f).map((p) => n || e.hasAttribute(p) ? p : Bp[p] || (Bp[p] = p.replace(/([A-Z])/g, (w) => "-" + w.toLowerCase())));
  o !== void 0 && (e.textContent = o);
  for (let p in i)
    if (i.hasOwnProperty(p)) {
      const w = hS(p, i[p]);
      am.test(p) ? e.style.setProperty(p, w) : e.style[p] = w;
    }
  h.forEach((p, w) => {
    e.setAttribute(p, c[w]);
  }), a !== void 0 && (e.scrollTop = a), u !== void 0 && (e.scrollLeft = u);
}
let Oo = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
};
const gS = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), mS = ["Webkit", "Ms", "Moz", "O"];
Oo = Object.keys(Oo).reduce((e, t) => (mS.forEach((n) => e[gS(n, t)] = e[t]), e), Oo);
const yS = ["x", "y", "z"], bS = /^(matrix|translate|scale|rotate|skew)/, wS = /^(translate)/, xS = /^(rotate|skew)/, tl = (e, t) => de.num(e) && e !== 0 ? e + t : e, Ya = (e, t) => de.arr(e) ? e.every((n) => Ya(n, t)) : de.num(e) ? e === t : parseFloat(e) === t;
class _S extends Hu {
  constructor(t) {
    let {
      x: n,
      y: r,
      z: i
    } = t, o = sf(t, yS);
    const a = [], u = [];
    (n || r || i) && (a.push([n || 0, r || 0, i || 0]), u.push((f) => [`translate3d(${f.map((c) => tl(c, "px")).join(",")})`, Ya(f, 0)])), tr(o, (f, c) => {
      if (c === "transform")
        a.push([f || ""]), u.push((h) => [h, h === ""]);
      else if (bS.test(c)) {
        if (delete o[c], de.und(f))
          return;
        const h = wS.test(c) ? "px" : xS.test(c) ? "deg" : "";
        a.push(vn(f)), u.push(c === "rotate3d" ? ([p, w, P, _]) => [`rotate3d(${p},${w},${P},${tl(_, h)})`, Ya(_, 0)] : (p) => [`${c}(${p.map((w) => tl(w, h)).join(",")})`, Ya(p, c.startsWith("scale") ? 1 : 0)]);
      }
    }), a.length && (o.transform = new SS(a, u)), super(o);
  }
}
class SS extends zg {
  constructor(t, n) {
    super(), this._value = null, this.inputs = t, this.transforms = n;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let t = "", n = !0;
    return bt(this.inputs, (r, i) => {
      const o = cn(r[0]), [a, u] = this.transforms[i](de.arr(o) ? o : r.map(cn));
      t += " " + a, n = n && u;
    }), n ? "none" : t;
  }
  observerAdded(t) {
    t == 1 && bt(this.inputs, (n) => bt(n, (r) => Pn(r) && Hi(r, this)));
  }
  observerRemoved(t) {
    t == 0 && bt(this.inputs, (n) => bt(n, (r) => Pn(r) && Go(r, this)));
  }
  eventObserved(t) {
    t.type == "change" && (this._value = null), Lo(this, t);
  }
}
const RS = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"], CS = ["scrollTop", "scrollLeft"];
nr.assign({
  batchedUpdates: km,
  createStringInterpolator: jg,
  colors: u_
});
const PS = z_(RS, {
  applyAnimatedValues: vS,
  createAnimatedStyle: (e) => new _S(e),
  getComponentProps: (e) => sf(e, CS)
}), TS = PS.animated;
var NS = ["tooltipOpen"];
function ES(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function du() {
  return du = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, du.apply(this, arguments);
}
function MS(e) {
  var t = hr(du({
    tooltipOpen: !1
  }, e)), n = t[0], r = t[1], i = wt(function(a) {
    return r(typeof a == "function" ? function(u) {
      u.tooltipOpen;
      var f = ES(u, NS);
      return du({}, a(f), {
        tooltipOpen: !0
      });
    } : {
      tooltipOpen: !0,
      tooltipLeft: a.tooltipLeft,
      tooltipTop: a.tooltipTop,
      tooltipData: a.tooltipData
    });
  }, [r]), o = wt(function() {
    return r({
      tooltipOpen: !1,
      tooltipLeft: void 0,
      tooltipTop: void 0,
      tooltipData: void 0
    });
  }, [r]);
  return {
    tooltipOpen: n.tooltipOpen,
    tooltipLeft: n.tooltipLeft,
    tooltipTop: n.tooltipTop,
    tooltipData: n.tooltipData,
    updateTooltip: r,
    showTooltip: i,
    hideTooltip: o
  };
}
function OS(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function AS(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Yl(e, t);
}
function Yl(e, t) {
  return Yl = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Yl(e, t);
}
function um(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var sm = /* @__PURE__ */ function(e) {
  AS(t, e);
  function t() {
    for (var r, i = arguments.length, o = new Array(i), a = 0; a < i; a++)
      o[a] = arguments[a];
    return r = e.call.apply(e, [this].concat(o)) || this, um(OS(r), "node", void 0), r;
  }
  var n = t.prototype;
  return n.componentWillUnmount = function() {
    this.node && document.body && (document.body.removeChild(this.node), delete this.node);
  }, n.render = function() {
    return !this.node && typeof document < "u" && (this.node = document.createElement("div"), this.props.zIndex != null && (this.node.style.zIndex = "" + this.props.zIndex), document.body.append(this.node)), this.node ? /* @__PURE__ */ ch.createPortal(this.props.children, this.node) : null;
  }, t;
}(gn.PureComponent);
um(sm, "propTypes", {
  zIndex: ke.exports.oneOfType([ke.exports.number, ke.exports.string])
});
var kS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/Tooltip.js", $S = ["className", "top", "left", "offsetLeft", "offsetTop", "style", "children", "unstyled", "applyPositionStyle"];
function Xl() {
  return Xl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Xl.apply(this, arguments);
}
function FS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var lf = {
  position: "absolute",
  backgroundColor: "white",
  color: "#666666",
  padding: ".3rem .5rem",
  borderRadius: "3px",
  fontSize: "14px",
  boxShadow: "0 1px 2px rgba(33,33,33,0.2)",
  lineHeight: "1em",
  pointerEvents: "none"
};
function cf(e) {
  var t = e.className, n = e.top, r = e.left, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.style, c = f === void 0 ? lf : f, h = e.children, p = e.unstyled, w = p === void 0 ? !1 : p, P = e.applyPositionStyle, _ = P === void 0 ? !1 : P, T = FS(e, $S);
  return /* @__PURE__ */ L("div", {
    className: fy("visx-tooltip", t),
    style: Xl({
      top: n == null || u == null ? n : n + u,
      left: r == null || o == null ? r : r + o
    }, _ && {
      position: "absolute"
    }, !w && c),
    ...T,
    children: h
  }, void 0, !1, {
    fileName: kS,
    lineNumber: 38,
    columnNumber: 23
  }, this);
}
cf.propTypes = {
  children: ke.exports.node,
  className: ke.exports.string,
  left: ke.exports.number,
  offsetLeft: ke.exports.number,
  offsetTop: ke.exports.number,
  top: ke.exports.number,
  applyPositionStyle: ke.exports.bool,
  unstyled: ke.exports.bool
};
var IS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js";
function Dp(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function BS(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Kl(e, t);
}
function Kl(e, t) {
  return Kl = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Kl(e, t);
}
function zp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var Lp = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function DS(e) {
  var t, n;
  return n = t = /* @__PURE__ */ function(r) {
    BS(i, r);
    function i(a) {
      var u;
      return u = r.call(this, a) || this, zp(Dp(u), "node", void 0), u.state = {
        rect: void 0,
        parentRect: void 0
      }, u.getRects = u.getRects.bind(Dp(u)), u;
    }
    var o = i.prototype;
    return o.componentDidMount = function() {
      var u = this;
      this.node = ch.findDOMNode(this), this.setState(function() {
        return u.getRects();
      });
    }, o.getRects = function() {
      if (!this.node)
        return this.state;
      var u = this.node, f = u.parentNode, c = u.getBoundingClientRect ? u.getBoundingClientRect() : Lp, h = f != null && f.getBoundingClientRect ? f.getBoundingClientRect() : Lp;
      return {
        rect: c,
        parentRect: h
      };
    }, o.render = function() {
      return /* @__PURE__ */ L(e, {
        getRects: this.getRects,
        ...this.state,
        ...this.props
      }, void 0, !1, {
        fileName: IS,
        lineNumber: 67,
        columnNumber: 27
      }, this);
    }, i;
  }(gn.PureComponent), zp(t, "displayName", "withBoundingRects(" + (e.displayName || "") + ")"), n;
}
var zS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js", LS = ["children", "getRects", "left", "offsetLeft", "offsetTop", "parentRect", "rect", "style", "top", "unstyled"];
function Ql() {
  return Ql = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ql.apply(this, arguments);
}
function GS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function jS(e) {
  var t = e.children;
  e.getRects;
  var n = e.left, r = n === void 0 ? 0 : n, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.parentRect, c = e.rect, h = e.style, p = h === void 0 ? lf : h, w = e.top, P = w === void 0 ? 0 : w, _ = e.unstyled, T = _ === void 0 ? !1 : _, I = GS(e, LS), k;
  if (c && f) {
    var F = r, N = P, G = !1, M = !1;
    if (f.width) {
      var D = F + o + c.width - f.width, te = c.width - F - o;
      G = D > 0 && D > te;
    } else {
      var Q = F + o + c.width - window.innerWidth, fe = c.width - F - o;
      G = Q > 0 && Q > fe;
    }
    if (f.height) {
      var ge = N + u + c.height - f.height, re = c.height - N - u;
      M = ge > 0 && ge > re;
    } else
      M = N + u + c.height > window.innerHeight;
    F = G ? F - c.width - o : F + o, N = M ? N - c.height - u : N + u, F = Math.round(F), N = Math.round(N), k = "translate(" + F + "px, " + N + "px)";
  }
  return /* @__PURE__ */ L(cf, {
    style: Ql({
      left: 0,
      top: 0,
      transform: k
    }, !T && p),
    ...I,
    children: t
  }, void 0, !1, {
    fileName: zS,
    lineNumber: 65,
    columnNumber: 23
  }, this);
}
const HS = DS(jS);
var Gp = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js", WS = ["detectBounds", "zIndex"], US = ["left", "top", "detectBounds", "zIndex"];
function jp(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function VS(e) {
  var t = e === void 0 ? {} : e, n = t.detectBounds, r = n === void 0 ? !0 : n, i = t.zIndex, o = jp(t, WS), a = dy(o), u = a[0], f = a[1], c = a[2], h = Ht(function() {
    return function(p) {
      var w = p.left, P = w === void 0 ? 0 : w, _ = p.top, T = _ === void 0 ? 0 : _, I = p.detectBounds, k = p.zIndex, F = jp(p, US), N = I == null ? r : I, G = k == null ? i : k, M = N ? HS : cf, D = P + (f.left || 0) + window.scrollX, te = T + (f.top || 0) + window.scrollY;
      return /* @__PURE__ */ L(sm, {
        zIndex: G,
        children: /* @__PURE__ */ L(M, {
          left: D,
          top: te,
          ...F
        }, void 0, !1, {
          fileName: Gp,
          lineNumber: 48,
          columnNumber: 23
        }, this)
      }, void 0, !1, {
        fileName: Gp,
        lineNumber: 46,
        columnNumber: 27
      }, this);
    };
  }, [r, i, f.left, f.top]);
  return {
    containerRef: u,
    containerBounds: f,
    forceRefreshBounds: c,
    TooltipInPortal: h
  };
}
var qS = /* @__PURE__ */ lh(null);
const ea = qS;
var hn = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/Tooltip.js", YS = ["debounce", "detectBounds", "horizontalCrosshairStyle", "glyphStyle", "renderTooltip", "renderGlyph", "resizeObserverPolyfill", "scroll", "showDatumGlyph", "showHorizontalCrosshair", "showSeriesGlyphs", "showVerticalCrosshair", "snapTooltipToDatumX", "snapTooltipToDatumY", "verticalCrosshairStyle", "zIndex"], XS = ["x", "y"];
function Hp(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function Ao() {
  return Ao = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ao.apply(this, arguments);
}
var nl = {
  position: "absolute",
  pointerEvents: "none",
  fontSize: 0,
  lineHeight: 0
}, KS = {
  position: "absolute",
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none"
};
function lm(e) {
  var t = an(jr) || {}, n = t.theme;
  return /* @__PURE__ */ L("circle", {
    cx: e.x,
    cy: e.y,
    r: e.size,
    fill: e.color,
    stroke: n == null ? void 0 : n.backgroundColor,
    strokeWidth: 1.5,
    paintOrder: "fill",
    ...e.glyphStyle
  }, void 0, !1, {
    fileName: hn,
    lineNumber: 37,
    columnNumber: 23
  }, this);
}
lm.propTypes = {
  isNearestDatum: ke.exports.bool.isRequired
};
function QS(e) {
  return /* @__PURE__ */ L(lm, {
    ...e
  }, void 0, !1, {
    fileName: hn,
    lineNumber: 53,
    columnNumber: 23
  }, this);
}
function cm(e) {
  var t = an(ea);
  return t != null && t.tooltipOpen ? /* @__PURE__ */ L(fm, {
    ...e
  }, void 0, !1, {
    fileName: hn,
    lineNumber: 66,
    columnNumber: 23
  }, this) : null;
}
cm.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
function fm(e) {
  var t, n, r, i, o, a, u, f, c, h, p, w, P, _ = e.debounce, T = e.detectBounds, I = e.horizontalCrosshairStyle, k = e.glyphStyle, F = e.renderTooltip, N = e.renderGlyph, G = N === void 0 ? QS : N, M = e.resizeObserverPolyfill, D = e.scroll, te = D === void 0 ? !0 : D, Q = e.showDatumGlyph, fe = Q === void 0 ? !1 : Q, ge = e.showHorizontalCrosshair, re = ge === void 0 ? !1 : ge, ee = e.showSeriesGlyphs, be = ee === void 0 ? !1 : ee, Oe = e.showVerticalCrosshair, ut = Oe === void 0 ? !1 : Oe, Ue = e.snapTooltipToDatumX, st = Ue === void 0 ? !1 : Ue, lt = e.snapTooltipToDatumY, dt = lt === void 0 ? !1 : lt, V = e.verticalCrosshairStyle, ue = e.zIndex, Te = Hp(e, YS), Ae = an(jr) || {}, Ce = Ae.colorScale, Re = Ae.theme, Ne = Ae.innerHeight, Be = Ae.innerWidth, Le = Ae.margin, X = Ae.xScale, ce = Ae.yScale, Ge = Ae.dataRegistry, B = an(ea), gt = VS({
    debounce: _,
    detectBounds: T,
    polyfill: M,
    scroll: te,
    zIndex: ue
  }), ct = gt.containerRef, _t = gt.TooltipInPortal, Ot = gt.forceRefreshBounds, Qt = wt(function(Lt) {
    var Yt;
    ct((Yt = Lt == null ? void 0 : Lt.parentElement) != null ? Yt : null);
  }, [ct]), un = B != null && B.tooltipOpen ? F(Ao({}, B, {
    colorScale: Ce
  })) : null, yn = (B == null ? void 0 : B.tooltipOpen) && un != null, bn = tn(!1);
  on(function() {
    yn && !bn.current && Ot(), bn.current = yn;
  }, [yn, Ot]);
  var wn = B == null ? void 0 : B.tooltipLeft, zn = B == null ? void 0 : B.tooltipTop, rr = X ? Fl(X) : 0, Ln = ce ? Fl(ce) : 0, xn = wt(function(Lt, Yt) {
    var O, J, he = Ge == null ? void 0 : Ge.get(Lt), ze = he == null ? void 0 : he.xAccessor, pt = he == null ? void 0 : he.yAccessor, mt = X && ze ? (O = Number(X(ze(Yt))) + rr / 2) != null ? O : 0 : void 0, ot = ce && pt ? (J = Number(ce(pt(Yt))) + Ln / 2) != null ? J : 0 : void 0;
    return {
      left: mt,
      top: ot
    };
  }, [Ge, rr, Ln, X, ce]), qt = B == null || (t = B.tooltipData) == null ? void 0 : t.nearestDatum, Mn = (n = qt == null ? void 0 : qt.key) != null ? n : "";
  if (yn && qt && (st || dt)) {
    var ir = xn(Mn, qt.datum), mr = ir.left, yr = ir.top;
    wn = st && en(mr) ? mr : wn, zn = dt && en(yr) ? yr : zn;
  }
  var or = [];
  if (yn && (fe || be)) {
    var br, Gn = Number((br = k == null ? void 0 : k.radius) != null ? br : 4);
    if (be) {
      var jn, sn;
      Object.values((jn = B == null || (sn = B.tooltipData) == null ? void 0 : sn.datumByKey) != null ? jn : {}).forEach(function(Lt) {
        var Yt, O, J, he = Lt.key, ze = Lt.datum, pt = Lt.index, mt = (Yt = (O = Ce == null ? void 0 : Ce(he)) != null ? O : Re == null || (J = Re.htmlLabel) == null ? void 0 : J.color) != null ? Yt : "#222", ot = xn(he, ze), rt = ot.left, At = ot.top;
        !en(rt) || !en(At) || or.push({
          key: he,
          color: mt,
          datum: ze,
          index: pt,
          size: Gn,
          x: rt,
          y: At,
          glyphStyle: k,
          isNearestDatum: qt ? qt.key === he : !1
        });
      });
    } else if (qt) {
      var _n = xn(Mn, qt.datum), On = _n.left, An = _n.top;
      if (en(On) && en(An)) {
        var ar, kn, ur, Hn, Wn, Sn, wr = (ar = (kn = (ur = (Hn = Mn && (Ce == null ? void 0 : Ce(Mn))) != null ? Hn : null) != null ? ur : Re == null || (Wn = Re.gridStyles) == null ? void 0 : Wn.stroke) != null ? kn : Re == null || (Sn = Re.htmlLabel) == null ? void 0 : Sn.color) != null ? ar : "#222";
        or.push({
          key: Mn,
          color: wr,
          datum: qt.datum,
          index: qt.index,
          size: Gn,
          x: On,
          y: An,
          glyphStyle: k,
          isNearestDatum: !0
        });
      }
    }
  }
  return /* @__PURE__ */ L(Dn, {
    children: [/* @__PURE__ */ L("svg", {
      ref: Qt,
      style: KS
    }, void 0, !1, {
      fileName: hn,
      lineNumber: 250,
      columnNumber: 60
    }, this), yn && /* @__PURE__ */ L(Dn, {
      children: [ut && /* @__PURE__ */ L(_t, {
        className: "visx-crosshair visx-crosshair-vertical",
        left: wn,
        top: Le == null ? void 0 : Le.top,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: nl,
        children: /* @__PURE__ */ L("svg", {
          width: "1",
          height: Ne,
          overflow: "visible",
          children: /* @__PURE__ */ L("line", {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: Ne,
            strokeWidth: 1.5,
            stroke: (r = (i = Re == null || (o = Re.gridStyles) == null ? void 0 : o.stroke) != null ? i : Re == null || (a = Re.htmlLabel) == null ? void 0 : a.color) != null ? r : "#222",
            ...V
          }, void 0, !1, {
            fileName: hn,
            lineNumber: 265,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: hn,
          lineNumber: 261,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: hn,
        lineNumber: 253,
        columnNumber: 117
      }, this), re && /* @__PURE__ */ L(_t, {
        className: "visx-crosshair visx-crosshair-horizontal",
        left: Le == null ? void 0 : Le.left,
        top: zn,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: nl,
        children: /* @__PURE__ */ L("svg", {
          width: Be,
          height: "1",
          overflow: "visible",
          children: /* @__PURE__ */ L("line", {
            x1: 0,
            x2: Be,
            y1: 0,
            y2: 0,
            strokeWidth: 1.5,
            stroke: (u = (f = Re == null || (c = Re.gridStyles) == null ? void 0 : c.stroke) != null ? f : Re == null || (h = Re.htmlLabel) == null ? void 0 : h.color) != null ? u : "#222",
            ...I
          }, void 0, !1, {
            fileName: hn,
            lineNumber: 284,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: hn,
          lineNumber: 280,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: hn,
        lineNumber: 272,
        columnNumber: 76
      }, this), or.map(function(Lt, Yt) {
        var O = Lt.x, J = Lt.y, he = Hp(Lt, XS);
        return /* @__PURE__ */ L(_t, {
          className: "visx-tooltip-glyph",
          left: O,
          top: J,
          offsetLeft: 0,
          offsetTop: 0,
          detectBounds: !1,
          style: nl,
          children: /* @__PURE__ */ L("svg", {
            overflow: "visible",
            children: G(Ao({
              x: 0,
              y: 0
            }, he))
          }, void 0, !1, {
            fileName: hn,
            lineNumber: 308,
            columnNumber: 25
          }, this)
        }, Yt, !1, {
          fileName: hn,
          lineNumber: 299,
          columnNumber: 9
        }, this);
      }), /* @__PURE__ */ L(_t, {
        left: wn,
        top: zn,
        style: Ao({}, lf, {
          background: (p = Re == null ? void 0 : Re.backgroundColor) != null ? p : "white",
          boxShadow: "0 1px 2px " + (Re != null && (w = Re.htmlLabel) != null && w.color ? (Re == null || (P = Re.htmlLabel) == null ? void 0 : P.color) + "55" : "#22222255")
        }, Re == null ? void 0 : Re.htmlLabel),
        ...Te,
        children: un
      }, void 0, !1, {
        fileName: hn,
        lineNumber: 315,
        columnNumber: 22
      }, this)]
    }, void 0, !0)]
  }, void 0, !0);
}
fm.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
const ZS = /* @__PURE__ */ Vo(ay);
var JS = hm, Pr = pm(ke.exports), eR = pm(mh), yi = rR(gn), tR = ZS, nR = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function dm(e) {
  if (typeof WeakMap != "function")
    return null;
  var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (dm = function(i) {
    return i ? n : t;
  })(e);
}
function rR(e, t) {
  if (!t && e && e.__esModule)
    return e;
  if (e === null || typeof e != "object" && typeof e != "function")
    return { default: e };
  var n = dm(t);
  if (n && n.has(e))
    return n.get(e);
  var r = {}, i = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var o in e)
    if (o !== "default" && Object.prototype.hasOwnProperty.call(e, o)) {
      var a = i ? Object.getOwnPropertyDescriptor(e, o) : null;
      a && (a.get || a.set) ? Object.defineProperty(r, o, a) : r[o] = e[o];
    }
  return r.default = e, n && n.set(e, r), r;
}
function pm(e) {
  return e && e.__esModule ? e : { default: e };
}
function pu() {
  return pu = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, pu.apply(this, arguments);
}
function iR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var oR = [];
function hm(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? oR : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = iR(e, nR), w = (0, yi.useRef)(null), P = (0, yi.useRef)(0), _ = (0, yi.useState)({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), T = _[0], I = _[1], k = (0, yi.useMemo)(function() {
    var F = Array.isArray(a) ? a : [a];
    return (0, eR.default)(function(N) {
      I(function(G) {
        var M = Object.keys(G), D = M.filter(function(Q) {
          return G[Q] !== N[Q];
        }), te = D.every(function(Q) {
          return F.includes(Q);
        });
        return te ? G : N;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return (0, yi.useEffect)(function() {
    var F = new tR.ResizeObserver(function(N) {
      N === void 0 && (N = []), N.forEach(function(G) {
        var M = G.contentRect, D = M.left, te = M.top, Q = M.width, fe = M.height;
        P.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: D
          });
        });
      });
    });
    return w.current && F.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), F.disconnect(), k != null && k.cancel && k.cancel();
    };
  }, [k]), /* @__PURE__ */ yi.default.createElement("div", pu({
    style: f,
    ref: w,
    className: t
  }, p), n(pu({}, T, {
    ref: w.current,
    resize: k
  })));
}
hm.propTypes = {
  className: Pr.default.string,
  debounceTime: Pr.default.number,
  enableDebounceLeadingCall: Pr.default.bool,
  ignoreDimensions: Pr.default.oneOfType([Pr.default.any, Pr.default.arrayOf(Pr.default.any)]),
  children: Pr.default.func.isRequired
};
var aR = /* @__PURE__ */ lh(null);
const vm = aR;
function Or(e, t, n) {
  var r = an(vm), i = tn();
  i.current = n;
  var o = wt(function(a, u, f) {
    r && r.emit(a, {
      event: u,
      svgPoint: Cy(u),
      source: f
    });
  }, [r]);
  return on(function() {
    if (r && e && t) {
      var a = function(f) {
        var c;
        (!i.current || f != null && f.source && (c = i.current) != null && c.includes(f.source)) && t(f);
      };
      return r.on(e, a), function() {
        return r == null ? void 0 : r.off(e, a);
      };
    }
  }, [r, e, t]), r ? o : null;
}
function uR(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(t, n) {
    var r = e.get(t);
    r && r.push(n) || e.set(t, [n]);
  }, off: function(t, n) {
    var r = e.get(t);
    r && r.splice(r.indexOf(n) >>> 0, 1);
  }, emit: function(t, n) {
    (e.get(t) || []).slice().map(function(r) {
      r(n);
    }), (e.get("*") || []).slice().map(function(r) {
      r(t, n);
    });
  } };
}
var sR = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/EventEmitterProvider.js";
function lR(e) {
  var t = e.children, n = Ht(function() {
    return uR();
  }, []);
  return /* @__PURE__ */ L(vm.Provider, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: sR,
    lineNumber: 11,
    columnNumber: 23
  }, this);
}
var cR = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/TooltipProvider.js";
function Zl() {
  return Zl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Zl.apply(this, arguments);
}
function gm(e) {
  var t = e.hideTooltipDebounceMs, n = t === void 0 ? 400 : t, r = e.children, i = MS(void 0), o = i.tooltipOpen, a = i.tooltipLeft, u = i.tooltipTop, f = i.tooltipData, c = i.updateTooltip, h = i.hideTooltip, p = tn(null), w = tn(function(_) {
    var T = _.svgPoint, I = _.index, k = _.key, F = _.datum, N = _.distanceX, G = _.distanceY;
    p.current && (p.current.cancel(), p.current = null);
    var M = en(N) ? N : 1 / 0, D = en(G) ? G : 1 / 0, te = Math.sqrt(Math.pow(M, 2) + Math.pow(D, 2));
    c(function(Q) {
      var fe, ge, re, ee = Q.tooltipData, be = ee != null && ee.nearestDatum && en(ee.nearestDatum.distance) ? ee.nearestDatum.distance : 1 / 0;
      return {
        tooltipOpen: !0,
        tooltipLeft: T == null ? void 0 : T.x,
        tooltipTop: T == null ? void 0 : T.y,
        tooltipData: {
          nearestDatum: ((fe = ee == null || (ge = ee.nearestDatum) == null ? void 0 : ge.key) != null ? fe : "") !== k && be < te ? ee == null ? void 0 : ee.nearestDatum : {
            key: k,
            index: I,
            datum: F,
            distance: te
          },
          datumByKey: Zl({}, ee == null ? void 0 : ee.datumByKey, (re = {}, re[k] = {
            datum: F,
            index: I,
            key: k
          }, re))
        }
      };
    });
  }), P = wt(function() {
    p.current = dc(h, n), p.current();
  }, [h, n]);
  return /* @__PURE__ */ L(ea.Provider, {
    value: {
      tooltipOpen: o,
      tooltipLeft: a,
      tooltipTop: u,
      tooltipData: f,
      updateTooltip: c,
      showTooltip: w.current,
      hideTooltip: P
    },
    children: r
  }, void 0, !1, {
    fileName: cR,
    lineNumber: 72,
    columnNumber: 23
  }, this);
}
gm.propTypes = {
  hideTooltipDebounceMs: ke.exports.number,
  children: ke.exports.node.isRequired
};
const fR = /* @__PURE__ */ Vo(ux);
var ta = {}, ff = {};
ff.__esModule = !0;
ff.default = dR;
function dR(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
var df = {};
df.__esModule = !0;
df.default = pR;
function pR(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
var pf = {};
pf.__esModule = !0;
pf.default = hR;
function hR(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
var hf = {};
hf.__esModule = !0;
hf.default = vR;
function vR(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
var vf = {};
vf.__esModule = !0;
vf.default = gR;
function gR(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
var gf = {};
gf.__esModule = !0;
gf.default = mR;
function mR(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
var mf = {};
mf.__esModule = !0;
mf.default = yR;
function yR(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var yf = {}, bf = {};
const mm = /* @__PURE__ */ Vo(l1);
bf.__esModule = !0;
bf.default = bR;
var Tr = mm, Wp = {
  lab: Tr.interpolateLab,
  hcl: Tr.interpolateHcl,
  "hcl-long": Tr.interpolateHclLong,
  hsl: Tr.interpolateHsl,
  "hsl-long": Tr.interpolateHslLong,
  cubehelix: Tr.interpolateCubehelix,
  "cubehelix-long": Tr.interpolateCubehelixLong,
  rgb: Tr.interpolateRgb
};
function bR(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return Wp[e];
  }
  var t = e.type, n = e.gamma, r = Wp[t];
  return typeof n > "u" ? r : r.gamma(n);
}
yf.__esModule = !0;
yf.default = _R;
var wR = xR(bf);
function xR(e) {
  return e && e.__esModule ? e : { default: e };
}
function _R(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = (0, wR.default)(t.interpolate);
    e.interpolate(n);
  }
}
var wf = {};
const SR = /* @__PURE__ */ Vo(tw);
var xf = {};
xf.__esModule = !0;
xf.default = PR;
var RR = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), CR = "%Y-%m-%d %H:%M";
function PR(e) {
  var t = e.tickFormat(1, CR)(RR);
  return t === "2020-02-02 03:04";
}
wf.__esModule = !0;
wf.default = ER;
var fn = SR, TR = NR(xf);
function NR(e) {
  return e && e.__esModule ? e : { default: e };
}
var Up = {
  day: fn.timeDay,
  hour: fn.timeHour,
  minute: fn.timeMinute,
  month: fn.timeMonth,
  second: fn.timeSecond,
  week: fn.timeWeek,
  year: fn.timeYear
}, Vp = {
  day: fn.utcDay,
  hour: fn.utcHour,
  minute: fn.utcMinute,
  month: fn.utcMonth,
  second: fn.utcSecond,
  week: fn.utcWeek,
  year: fn.utcYear
};
function ER(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = (0, TR.default)(r);
      if (typeof n == "string")
        r.nice(i ? Vp[n] : Up[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? Vp[o] : Up[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
var _f = {};
_f.__esModule = !0;
_f.default = MR;
function MR(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
var Sf = {};
Sf.__esModule = !0;
Sf.default = OR;
function OR(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
var Rf = {};
Rf.__esModule = !0;
Rf.default = kR;
var AR = mm;
function kR(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(AR.interpolateRound));
}
var Cf = {};
Cf.__esModule = !0;
Cf.default = $R;
function $R(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
var Pf = {};
Pf.__esModule = !0;
Pf.default = FR;
function FR(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
ta.__esModule = !0;
ta.default = QR;
ta.ALL_OPERATORS = void 0;
var IR = dn(ff), BR = dn(df), DR = dn(pf), zR = dn(hf), LR = dn(vf), GR = dn(gf), jR = dn(mf), HR = dn(yf), WR = dn(wf), UR = dn(_f), VR = dn(Sf), qR = dn(Rf), YR = dn(Cf), XR = dn(Pf);
function dn(e) {
  return e && e.__esModule ? e : { default: e };
}
var ym = [
  "domain",
  "nice",
  "zero",
  "interpolate",
  "round",
  "range",
  "reverse",
  "align",
  "base",
  "clamp",
  "constant",
  "exponent",
  "padding",
  "unknown"
];
ta.ALL_OPERATORS = ym;
var KR = {
  domain: IR.default,
  nice: WR.default,
  zero: XR.default,
  interpolate: HR.default,
  round: qR.default,
  align: DR.default,
  base: zR.default,
  clamp: LR.default,
  constant: GR.default,
  exponent: jR.default,
  padding: UR.default,
  range: BR.default,
  reverse: VR.default,
  unknown: YR.default
};
function QR() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = ym.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      KR[f](a, u);
    }), a;
  };
}
var ZR = rC, JR = fR, eC = tC(ta);
function tC(e) {
  return e && e.__esModule ? e : { default: e };
}
var nC = (0, eC.default)("domain", "range", "reverse", "unknown");
function rC(e) {
  return nC((0, JR.scaleOrdinal)(), e);
}
var Mr = {
  red: ["#fff5f5", "#ffe3e3", "#ffc9c9", "#ffa8a8", "#ff8787", "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a"],
  pink: ["#fff0f6", "#ffdeeb", "#fcc2d7", "#faa2c1", "#f783ac", "#f06595", "#e64980", "#d6336c", "#c2255c", "#a61e4d"],
  grape: ["#f8f0fc", "#f3d9fa", "#eebefa", "#e599f7", "#da77f2", "#cc5de8", "#be4bdb", "#ae3ec9", "#9c36b5", "#862e9c"],
  violet: ["#f3f0ff", "#e5dbff", "#d0bfff", "#b197fc", "#9775fa", "#845ef7", "#7950f2", "#7048e8", "#6741d9", "#5f3dc4"],
  indigo: ["#edf2ff", "#dbe4ff", "#bac8ff", "#91a7ff", "#748ffc", "#5c7cfa", "#4c6ef5", "#4263eb", "#3b5bdb", "#364fc7"],
  blue: ["#e8f7ff", "#ccedff", "#a3daff", "#72c3fc", "#4dadf7", "#329af0", "#228ae6", "#1c7cd6", "#1b6ec2", "#1862ab"],
  cyan: ["#e3fafc", "#c5f6fa", "#99e9f2", "#66d9e8", "#3bc9db", "#22b8cf", "#15aabf", "#1098ad", "#0c8599", "#0b7285"],
  teal: ["#e6fcf5", "#c3fae8", "#96f2d7", "#63e6be", "#38d9a9", "#20c997", "#12b886", "#0ca678", "#099268", "#087f5b"],
  green: ["#ebfbee", "#d3f9d8", "#b2f2bb", "#8ce99a", "#69db7c", "#51cf66", "#40c057", "#37b24d", "#2f9e44", "#2b8a3e"],
  lime: ["#f4fce3", "#e9fac8", "#d8f5a2", "#c0eb75", "#a9e34b", "#94d82d", "#82c91e", "#74b816", "#66a80f", "#5c940d"],
  yellow: ["#fff9db", "#fff3bf", "#ffec99", "#ffe066", "#ffd43b", "#fcc419", "#fab005", "#f59f00", "#f08c00", "#e67700"],
  orange: ["#fff4e6", "#ffe8cc", "#ffd8a8", "#ffc078", "#ffa94d", "#ff922b", "#fd7e14", "#f76707", "#e8590c", "#d9480f"],
  gray: ["#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#868e96", "#495057", "#343a40", "#212529"]
}, Ro = Mr.gray, rl = Ro[7], iC = [Mr.cyan[9], Mr.cyan[3], Mr.yellow[5], Mr.red[4], Mr.grape[8], Mr.grape[5], Mr.pink[9]];
function Mt() {
  return Mt = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Mt.apply(this, arguments);
}
var il = {
  fontFamily: "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
  fontWeight: 700,
  fontSize: 12,
  textAnchor: "middle",
  pointerEvents: "none",
  letterSpacing: 0.4
};
function oC(e) {
  var t, n, r, i, o, a, u = Mt({}, il, {
    fill: rl,
    stroke: "none"
  }, e.svgLabelBig), f = Mt({}, il, {
    fontWeight: 200,
    fontSize: 11,
    fill: rl,
    stroke: "none"
  }, e.svgLabelSmall), c = Mt({
    color: (t = (n = (r = (i = e.htmlLabel) == null ? void 0 : i.color) != null ? r : (o = e.svgLabelBig) == null ? void 0 : o.fill) != null ? n : (a = e.svgLabelSmall) == null ? void 0 : a.fill) != null ? t : rl
  }, il, e.htmlLabel);
  return {
    backgroundColor: e.backgroundColor,
    colors: [].concat(e.colors),
    htmlLabel: Mt({}, c),
    svgLabelSmall: Mt({}, f),
    svgLabelBig: Mt({}, u),
    gridStyles: Mt({
      stroke: e.gridColor,
      strokeWidth: 1
    }, e.gridStyles),
    axisStyles: {
      x: {
        top: {
          axisLabel: Mt({}, u, {
            dy: "-0.25em"
          }),
          axisLine: Mt({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: Mt({}, f, {
            dy: "-0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Mt({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        },
        bottom: {
          axisLabel: Mt({}, u, {
            dy: "-0.25em"
          }),
          axisLine: Mt({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: Mt({}, f, {
            dy: "0.125em"
          }),
          tickLength: e.tickLength,
          tickLine: Mt({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        }
      },
      y: {
        left: {
          axisLabel: Mt({}, u, {
            dx: "-1.25em"
          }),
          axisLine: Mt({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: Mt({}, f, {
            textAnchor: "end",
            dx: "-0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Mt({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        },
        right: {
          axisLabel: Mt({}, u, {
            dx: "1.25em"
          }),
          axisLine: Mt({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: Mt({}, f, {
            textAnchor: "start",
            dx: "0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Mt({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        }
      }
    }
  };
}
const aC = oC({
  backgroundColor: "#fff",
  colors: iC,
  tickLength: 4,
  svgLabelSmall: {
    fill: Ro[7]
  },
  svgLabelBig: {
    fill: Ro[9]
  },
  gridColor: Ro[5],
  gridColorDark: Ro[9]
});
var uC = /* @__PURE__ */ gn.createContext(aC);
const sC = uC;
function qp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var lC = /* @__PURE__ */ function() {
  function e() {
    qp(this, "registry", {}), qp(this, "registryKeys", []);
  }
  var t = e.prototype;
  return t.registerData = function(r) {
    var i = this, o = Array.isArray(r) ? r : [r];
    o.forEach(function(a) {
      a.key in i.registry && i.registry[a.key] != null && console.debug("Overriding data registry key", a.key), i.registry[a.key] = a, i.registryKeys = Object.keys(i.registry);
    });
  }, t.unregisterData = function(r) {
    var i = this, o = Array.isArray(r) ? r : [r];
    o.forEach(function(a) {
      delete i.registry[a], i.registryKeys = Object.keys(i.registry);
    });
  }, t.entries = function() {
    return Object.values(this.registry);
  }, t.get = function(r) {
    return this.registry[r];
  }, t.keys = function() {
    return this.registryKeys;
  }, e;
}();
function cC() {
  var e = hr(Math.random()), t = e[1], n = Ht(function() {
    return new lC();
  }, []);
  return Ht(function() {
    return {
      registerData: function() {
        n.registerData.apply(n, arguments), t(Math.random());
      },
      unregisterData: function() {
        n.unregisterData.apply(n, arguments), t(Math.random());
      },
      entries: function() {
        return n.entries();
      },
      get: function(i) {
        return n.get(i);
      },
      keys: function() {
        return n.keys();
      }
    };
  }, [n]);
}
var ol = {
  width: 0,
  height: 0,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
function fC(e) {
  var t = hr({
    width: (e == null ? void 0 : e.width) == null ? ol.width : e.width,
    height: (e == null ? void 0 : e.height) == null ? ol.height : e.height,
    margin: (e == null ? void 0 : e.margin) == null ? ol.margin : e.margin
  }), n = t[0], r = t[1], i = wt(function(o) {
    (o.width !== n.width || o.height !== n.height || o.margin.left !== n.margin.left || o.margin.right !== n.margin.right || o.margin.top !== n.margin.top || o.margin.bottom !== n.margin.bottom) && r(o);
  }, [n.width, n.height, n.margin.left, n.margin.right, n.margin.bottom, n.margin.top]);
  return [n, i];
}
function Jl(e) {
  return (e == null ? void 0 : e.type) === "band" || (e == null ? void 0 : e.type) === "ordinal" || (e == null ? void 0 : e.type) === "point";
}
function Si() {
  return Si = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Si.apply(this, arguments);
}
function dC(e) {
  var t = e.dataRegistry, n = e.xRange, r = e.xScaleConfig, i = e.yRange, o = e.yScaleConfig, a = t.keys(), u = n[0], f = n[1], c = i[0], h = i[1], p = Ht(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, F) {
      return F ? k.concat(F.data.map(function(N) {
        return F.xAccessor(N);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var T = Jl(r) ? _ : gd(_), I = fp(r) ? Fa(Si({
        range: [u, f],
        domain: T,
        zero: !0
      }, r)) : Fa(Si({
        range: [u, f],
        domain: T
      }, r));
      return P.forEach(function(k) {
        k != null && k.xScale && (I = k.xScale(I));
      }), I;
    }
  }, [t, r, a, u, f]), w = Ht(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, F) {
      return F ? k.concat(F.data.map(function(N) {
        return F.yAccessor(N);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var T = Jl(o) ? _ : gd(_), I = fp(o) ? Fa(Si({
        range: [c, h],
        domain: T,
        zero: !0
      }, o)) : Fa(Si({
        range: [c, h],
        domain: T
      }, o));
      return P.forEach(function(k) {
        k != null && k.yScale && (I = k.yScale(I));
      }), I;
    }
  }, [t, o, a, c, h]);
  return {
    xScale: p,
    yScale: w
  };
}
var pC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/DataProvider.js";
function bm(e) {
  var t = e.initialDimensions, n = e.theme, r = e.xScale, i = e.yScale, o = e.children, a = e.horizontal, u = a === void 0 ? "auto" : a, f = an(sC), c = n || f, h = fC(t), p = h[0], w = p.width, P = p.height, _ = p.margin, T = h[1], I = Math.max(0, w - _.left - _.right), k = Math.max(0, P - _.top - _.bottom), F = cC(), N = dC({
    dataRegistry: F,
    xScaleConfig: r,
    yScaleConfig: i,
    xRange: [_.left, Math.max(0, w - _.right)],
    yRange: [Math.max(0, P - _.bottom), _.top]
  }), G = N.xScale, M = N.yScale, D = F.keys(), te = Ht(function() {
    return ZR({
      domain: D,
      range: c.colors
    });
  }, [D, c.colors]), Q = u === "auto" ? Jl(i) || i.type === "time" || i.type === "utc" : u;
  return /* @__PURE__ */ L(jr.Provider, {
    value: {
      dataRegistry: F,
      registerData: F.registerData,
      unregisterData: F.unregisterData,
      xScale: G,
      yScale: M,
      colorScale: te,
      theme: c,
      width: w,
      height: P,
      margin: _,
      innerWidth: I,
      innerHeight: k,
      setDimensions: T,
      horizontal: Q
    },
    children: o
  }, void 0, !1, {
    fileName: pC,
    lineNumber: 55,
    columnNumber: 23
  }, this);
}
bm.propTypes = {
  children: ke.exports.node.isRequired,
  horizontal: ke.exports.oneOfType([ke.exports.bool, ke.exports.oneOf(["auto"])])
};
function wm(e) {
  var t = e.source, n = e.onPointerOut, r = n === void 0 ? !0 : n, i = e.onPointerMove, o = i === void 0 ? !0 : i, a = e.onPointerUp, u = a === void 0 ? !0 : a, f = e.onPointerDown, c = f === void 0 ? !0 : f, h = e.onFocus, p = h === void 0 ? !1 : h, w = e.onBlur, P = w === void 0 ? !1 : w, _ = Or(), T = wt(function(M) {
    return _ == null ? void 0 : _("pointermove", M, t);
  }, [_, t]), I = wt(function(M) {
    return _ == null ? void 0 : _("pointerout", M, t);
  }, [_, t]), k = wt(function(M) {
    return _ == null ? void 0 : _("pointerup", M, t);
  }, [_, t]), F = wt(function(M) {
    return _ == null ? void 0 : _("pointerdown", M, t);
  }, [_, t]), N = wt(function(M) {
    return _ == null ? void 0 : _("focus", M, t);
  }, [_, t]), G = wt(function(M) {
    return _ == null ? void 0 : _("blur", M, t);
  }, [_, t]);
  return {
    onPointerMove: o ? T : void 0,
    onFocus: p ? N : void 0,
    onBlur: P ? G : void 0,
    onPointerOut: r ? I : void 0,
    onPointerUp: u ? k : void 0,
    onPointerDown: c ? F : void 0
  };
}
var hC = "AREASERIES_EVENT_SOURCE", vC = "GLYPHSERIES_EVENT_SOURCE", Uu = "XYCHART_EVENT_SOURCE";
function Yp(e) {
  return !!e && ("clientX" in e || "changedTouches" in e);
}
function xm(e) {
  var t = e.scale, n = e.accessor, r = e.scaledValue, i = e.data, o = t, a, u;
  if ("invert" in o && typeof o.invert == "function") {
    var f = xu(n).left, c = Number(o.invert(r)), h = f(i, c), p = i[h - 1], w = i[h];
    a = !p || Math.abs(c - n(p)) > Math.abs(c - n(w)) ? w : p, u = a === p ? h - 1 : h;
  } else if ("step" in o && typeof o.step < "u") {
    var P = t.domain(), _ = t.range().map(Number), T = [].concat(_).sort(function(D, te) {
      return D - te;
    }), I = rv(T[0], T[1], o.step()), k = Ob(I, r), F = _[0] < _[1] ? P : P.reverse(), N = F[k - 1], G = i.findIndex(function(D) {
      return String(n(D)) === String(N);
    });
    a = i[G], u = G;
  } else
    return console.warn("[visx/xychart/findNearestDatum] encountered incompatible scale type, bailing"), null;
  if (a == null || u == null)
    return null;
  var M = Math.abs(Number(o(n(a))) - r);
  return {
    datum: a,
    index: u,
    distance: M
  };
}
function gC(e) {
  var t = e.xScale, n = e.xAccessor, r = e.yScale, i = e.yAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = xm({
    scale: t,
    accessor: n,
    scaledValue: o.x,
    data: a
  });
  return u ? {
    datum: u.datum,
    index: u.index,
    distanceX: u.distance,
    distanceY: Math.abs(Number(r(i(u.datum))) - o.y)
  } : null;
}
function mC(e) {
  var t = e.yScale, n = e.yAccessor, r = e.xScale, i = e.xAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = xm({
    scale: t,
    accessor: n,
    scaledValue: o.y,
    data: a
  });
  return u ? {
    datum: u.datum,
    index: u.index,
    distanceY: u.distance,
    distanceX: Math.abs(Number(r(i(u.datum))) - o.x)
  } : null;
}
function ec() {
  return ec = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, ec.apply(this, arguments);
}
var tc = "__POINTER_EVENTS_ALL", Xa = "__POINTER_EVENTS_NEAREST";
function _m(e) {
  var t = e.dataKey, n = e.findNearestDatum, r = e.onBlur, i = e.onFocus, o = e.onPointerMove, a = e.onPointerOut, u = e.onPointerUp, f = e.onPointerDown, c = e.allowedSources, h = an(jr), p = h.width, w = h.height, P = h.horizontal, _ = h.dataRegistry, T = h.xScale, I = h.yScale, k = n || (P ? mC : gC), F = wt(function(fe) {
    var ge = fe || {}, re = ge.svgPoint, ee = ge.event, be = {}, Oe = null, ut = 1 / 0;
    if (fe && ee && re && p && w && T && I) {
      var Ue, st = t === Xa || t === tc, lt = st ? (Ue = _ == null ? void 0 : _.keys()) != null ? Ue : [] : Array.isArray(t) ? t : [t];
      lt.forEach(function(V) {
        var ue = _ == null ? void 0 : _.get(V);
        if (ue) {
          var Te = k({
            dataKey: V,
            data: ue.data,
            height: w,
            point: re,
            width: p,
            xAccessor: ue.xAccessor,
            xScale: T,
            yAccessor: ue.yAccessor,
            yScale: I
          });
          if (Te && (be[V] = ec({
            key: V,
            svgPoint: re,
            event: ee
          }, Te), t === Xa)) {
            var Ae, Ce, Re = Math.sqrt(((Ae = Te.distanceX) != null ? Ae : Math.pow(1 / 0, 2)) + ((Ce = Te.distanceY) != null ? Ce : Math.pow(1 / 0, 2)));
            Oe = Re < ut ? be[V] : Oe, ut = Math.min(ut, Re);
          }
        }
      });
      var dt = t === Xa ? [Oe] : t === tc || Array.isArray(t) ? Object.values(be) : [be[t]];
      return dt.filter(function(V) {
        return V;
      });
    }
    return [];
  }, [t, _, T, I, p, w, k]), N = wt(function(fe) {
    o && F(fe).forEach(function(ge) {
      return o(ge);
    });
  }, [F, o]), G = wt(function(fe) {
    u && F(fe).forEach(function(ge) {
      return u(ge);
    });
  }, [F, u]), M = wt(function(fe) {
    f && F(fe).forEach(function(ge) {
      return f(ge);
    });
  }, [F, f]), D = wt(function(fe) {
    i && F(fe).forEach(function(ge) {
      return i(ge);
    });
  }, [F, i]), te = wt(function(fe) {
    var ge = fe == null ? void 0 : fe.event;
    ge && Yp(ge) && a && a(ge);
  }, [a]), Q = wt(function(fe) {
    var ge = fe == null ? void 0 : fe.event;
    ge && !Yp(ge) && r && r(ge);
  }, [r]);
  Or("pointermove", o ? N : void 0, c), Or("pointerout", a ? te : void 0, c), Or("pointerup", u ? G : void 0, c), Or("pointerdown", f ? M : void 0, c), Or("focus", i ? D : void 0, c), Or("blur", r ? Q : void 0, c);
}
var Xn = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/XYChart.js", yC = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}, bC = [Uu];
function Ri(e) {
  var t = e.accessibilityLabel, n = t === void 0 ? "XYChart" : t, r = e.captureEvents, i = r === void 0 ? !0 : r, o = e.children, a = e.height, u = e.horizontal, f = e.margin, c = f === void 0 ? yC : f, h = e.onPointerMove, p = e.onPointerOut, w = e.onPointerUp, P = e.onPointerDown, _ = e.pointerEventsDataKey, T = _ === void 0 ? "nearest" : _, I = e.theme, k = e.width, F = e.xScale, N = e.yScale, G = an(jr), M = G.setDimensions, D = an(ea), te = Or();
  on(function() {
    M && k != null && a != null && k > 0 && a > 0 && M({
      width: k,
      height: a,
      margin: c
    });
  }, [M, k, a, c]);
  var Q = wm({
    source: Uu
  });
  return _m({
    dataKey: T === "nearest" ? Xa : tc,
    onPointerMove: h,
    onPointerOut: p,
    onPointerUp: w,
    onPointerDown: P,
    allowedSources: bC
  }), M ? k == null || a == null ? /* @__PURE__ */ L(JS, {
    children: function(fe) {
      return /* @__PURE__ */ L(Ri, {
        ...e,
        width: e.width == null ? fe.width : e.width,
        height: e.height == null ? fe.height : e.height
      }, void 0, !1, {
        fileName: Xn,
        lineNumber: 93,
        columnNumber: 27
      }, this);
    }
  }, void 0, !1, {
    fileName: Xn,
    lineNumber: 92,
    columnNumber: 25
  }, this) : D == null ? /* @__PURE__ */ L(gm, {
    children: /* @__PURE__ */ L(Ri, {
      ...e
    }, void 0, !1, {
      fileName: Xn,
      lineNumber: 101,
      columnNumber: 81
    }, this)
  }, void 0, !1, {
    fileName: Xn,
    lineNumber: 101,
    columnNumber: 25
  }, this) : te == null ? /* @__PURE__ */ L(lR, {
    children: /* @__PURE__ */ L(Ri, {
      ...e
    }, void 0, !1, {
      fileName: Xn,
      lineNumber: 106,
      columnNumber: 86
    }, this)
  }, void 0, !1, {
    fileName: Xn,
    lineNumber: 106,
    columnNumber: 25
  }, this) : k > 0 && a > 0 ? /* @__PURE__ */ L("svg", {
    width: k,
    height: a,
    "aria-label": n,
    children: [o, i && /* @__PURE__ */ L("rect", {
      x: c.left,
      y: c.top,
      width: k - c.left - c.right,
      height: a - c.top - c.bottom,
      fill: "transparent",
      ...Q
    }, void 0, !1, {
      fileName: Xn,
      lineNumber: 113,
      columnNumber: 46
    }, this)]
  }, void 0, !0, {
    fileName: Xn,
    lineNumber: 109,
    columnNumber: 49
  }, this) : null : !F || !N ? (console.warn("[@visx/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart."), null) : /* @__PURE__ */ L(bm, {
    xScale: F,
    yScale: N,
    theme: I,
    initialDimensions: {
      width: k,
      height: a,
      margin: c
    },
    horizontal: u,
    children: /* @__PURE__ */ L(Ri, {
      ...e
    }, void 0, !1, {
      fileName: Xn,
      lineNumber: 88,
      columnNumber: 21
    }, this)
  }, void 0, !1, {
    fileName: Xn,
    lineNumber: 78,
    columnNumber: 25
  }, this);
}
Ri.propTypes = {
  accessibilityLabel: ke.exports.string,
  captureEvents: ke.exports.bool,
  width: ke.exports.number,
  height: ke.exports.number,
  children: ke.exports.node.isRequired,
  horizontal: ke.exports.oneOfType([ke.exports.bool, ke.exports.oneOf(["auto"])]),
  onPointerMove: ke.exports.func,
  onPointerOut: ke.exports.func,
  onPointerUp: ke.exports.func,
  onPointerDown: ke.exports.func,
  pointerEventsDataKey: ke.exports.oneOf(["all", "nearest"])
};
var gr = {};
const Tf = /* @__PURE__ */ Vo(Tb);
var Nf = {};
Nf.__esModule = !0;
Nf.default = wC;
function wC(e, t) {
  e(t);
}
var li = {};
li.__esModule = !0;
li.default = _C;
li.STACK_ORDER_NAMES = li.STACK_ORDERS = void 0;
var vo = Tf, hu = {
  ascending: vo.stackOrderAscending,
  descending: vo.stackOrderDescending,
  insideout: vo.stackOrderInsideOut,
  none: vo.stackOrderNone,
  reverse: vo.stackOrderReverse
};
li.STACK_ORDERS = hu;
var xC = Object.keys(hu);
li.STACK_ORDER_NAMES = xC;
function _C(e) {
  return e && hu[e] || hu.none;
}
var ci = {};
ci.__esModule = !0;
ci.default = RC;
ci.STACK_OFFSET_NAMES = ci.STACK_OFFSETS = void 0;
var go = Tf, vu = {
  expand: go.stackOffsetExpand,
  diverging: go.stackOffsetDiverging,
  none: go.stackOffsetNone,
  silhouette: go.stackOffsetSilhouette,
  wiggle: go.stackOffsetWiggle
};
ci.STACK_OFFSETS = vu;
var SC = Object.keys(vu);
ci.STACK_OFFSET_NAMES = SC;
function RC(e) {
  return e && vu[e] || vu.none;
}
gr.__esModule = !0;
gr.arc = TC;
gr.area = NC;
gr.line = EC;
gr.pie = MC;
gr.radialLine = OC;
gr.stack = AC;
var Ui = Tf, Ft = Ef(Nf), CC = Ef(li), PC = Ef(ci);
function Ef(e) {
  return e && e.__esModule ? e : { default: e };
}
function TC(e) {
  var t = e === void 0 ? {} : e, n = t.innerRadius, r = t.outerRadius, i = t.cornerRadius, o = t.startAngle, a = t.endAngle, u = t.padAngle, f = t.padRadius, c = (0, Ui.arc)();
  return n != null && (0, Ft.default)(c.innerRadius, n), r != null && (0, Ft.default)(c.outerRadius, r), i != null && (0, Ft.default)(c.cornerRadius, i), o != null && (0, Ft.default)(c.startAngle, o), a != null && (0, Ft.default)(c.endAngle, a), u != null && (0, Ft.default)(c.padAngle, u), f != null && (0, Ft.default)(c.padRadius, f), c;
}
function NC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.x0, i = t.x1, o = t.y, a = t.y0, u = t.y1, f = t.defined, c = t.curve, h = (0, Ui.area)();
  return n && (0, Ft.default)(h.x, n), r && (0, Ft.default)(h.x0, r), i && (0, Ft.default)(h.x1, i), o && (0, Ft.default)(h.y, o), a && (0, Ft.default)(h.y0, a), u && (0, Ft.default)(h.y1, u), f && h.defined(f), c && h.curve(c), h;
}
function EC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.y, i = t.defined, o = t.curve, a = (0, Ui.line)();
  return n && (0, Ft.default)(a.x, n), r && (0, Ft.default)(a.y, r), i && a.defined(i), o && a.curve(o), a;
}
function MC(e) {
  var t = e === void 0 ? {} : e, n = t.startAngle, r = t.endAngle, i = t.padAngle, o = t.value, a = t.sort, u = t.sortValues, f = (0, Ui.pie)();
  return (a === null || a != null) && f.sort(a), (u === null || u != null) && f.sortValues(u), o != null && f.value(o), i != null && (0, Ft.default)(f.padAngle, i), n != null && (0, Ft.default)(f.startAngle, n), r != null && (0, Ft.default)(f.endAngle, r), f;
}
function OC(e) {
  var t = e === void 0 ? {} : e, n = t.angle, r = t.radius, i = t.defined, o = t.curve, a = (0, Ui.radialLine)();
  return n && (0, Ft.default)(a.angle, n), r && (0, Ft.default)(a.radius, r), i && a.defined(i), o && a.curve(o), a;
}
function AC(e) {
  var t = e.keys, n = e.value, r = e.order, i = e.offset, o = (0, Ui.stack)();
  return t && o.keys(t), n && (0, Ft.default)(o.value, n), r && o.order((0, CC.default)(r)), i && o.offset((0, PC.default)(i)), o;
}
var kC = DC, al = Sm(gn), $C = Sm(mu.exports), FC = gr, IC = ["children", "x", "x0", "x1", "y", "y0", "y1", "data", "defined", "className", "curve", "innerRef"];
function Sm(e) {
  return e && e.__esModule ? e : { default: e };
}
function nc() {
  return nc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, nc.apply(this, arguments);
}
function BC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function DC(e) {
  var t = e.children, n = e.x, r = e.x0, i = e.x1, o = e.y, a = e.y0, u = e.y1, f = e.data, c = f === void 0 ? [] : f, h = e.defined, p = h === void 0 ? function() {
    return !0;
  } : h, w = e.className, P = e.curve, _ = e.innerRef, T = BC(e, IC), I = (0, FC.area)({
    x: n,
    x0: r,
    x1: i,
    y: o,
    y0: a,
    y1: u,
    defined: p,
    curve: P
  });
  return t ? /* @__PURE__ */ al.default.createElement(al.default.Fragment, null, t({
    path: I
  })) : /* @__PURE__ */ al.default.createElement("path", nc({
    ref: _,
    className: (0, $C.default)("visx-area", w),
    d: I(c) || ""
  }, T));
}
var zC = WC, ul = Rm(gn), LC = Rm(mu.exports), GC = gr, jC = ["children", "data", "x", "y", "fill", "className", "curve", "innerRef", "defined"];
function Rm(e) {
  return e && e.__esModule ? e : { default: e };
}
function rc() {
  return rc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, rc.apply(this, arguments);
}
function HC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function WC(e) {
  var t = e.children, n = e.data, r = n === void 0 ? [] : n, i = e.x, o = e.y, a = e.fill, u = a === void 0 ? "transparent" : a, f = e.className, c = e.curve, h = e.innerRef, p = e.defined, w = p === void 0 ? function() {
    return !0;
  } : p, P = HC(e, jC), _ = (0, GC.line)({
    x: i,
    y: o,
    defined: w,
    curve: c
  });
  return t ? /* @__PURE__ */ ul.default.createElement(ul.default.Fragment, null, t({
    path: _
  })) : /* @__PURE__ */ ul.default.createElement("path", rc({
    ref: h,
    className: (0, LC.default)("visx-linepath", f),
    d: _(r) || "",
    fill: u,
    strokeLinecap: "round"
  }, P));
}
var UC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/enhancers/withRegisteredData.js";
function VC(e) {
  function t(n) {
    var r = n.dataKey, i = n.data, o = n.xAccessor, a = n.yAccessor, u = an(jr), f = u.xScale, c = u.yScale, h = u.dataRegistry;
    on(function() {
      return h && h.registerData({
        key: r,
        data: i,
        xAccessor: o,
        yAccessor: a
      }), function() {
        return h == null ? void 0 : h.unregisterData(r);
      };
    }, [h, r, i, o, a]);
    var p = h == null ? void 0 : h.get(r);
    if (!f || !c || !p)
      return null;
    var w = e;
    return /* @__PURE__ */ L(w, {
      ...n,
      xScale: f,
      yScale: c,
      data: p.data,
      xAccessor: p.xAccessor,
      yAccessor: p.yAccessor
    }, void 0, !1, {
      fileName: UC,
      lineNumber: 46,
      columnNumber: 25
    }, this);
  }
  return t;
}
function Ci(e, t, n) {
  return n === void 0 && (n = "center"), function(r) {
    var i = e(t(r));
    if (en(i)) {
      var o = (n === "start" ? 0 : Fl(e)) / (n === "center" ? 2 : 1);
      return i + o;
    }
    return NaN;
  };
}
function qC(e) {
  var t = e.range().map(function(c) {
    var h;
    return (h = Jx(c)) != null ? h : 0;
  }), n = t[0], r = t[1], i = n != null && r != null && r < n, o = e(0), a = i ? [r, n] : [n, r], u = a[0], f = a[1];
  return i ? en(o) ? Math.min(Math.max(u, o), f) : f : en(o) ? Math.max(o, u) : u;
}
function Cm(e) {
  var t, n = e.dataKey, r = e.enableEvents, i = e.findNearestDatum, o = e.onBlur, a = e.onFocus, u = e.onPointerMove, f = e.onPointerOut, c = e.onPointerUp, h = e.onPointerDown, p = e.source, w = e.allowedSources, P = (t = an(ea)) != null ? t : {}, _ = P.showTooltip, T = P.hideTooltip, I = wt(function(M) {
    _(M), u && u(M);
  }, [_, u]), k = wt(function(M) {
    _(M), a && a(M);
  }, [_, a]), F = wt(function(M) {
    T(), M && f && f(M);
  }, [T, f]), N = wt(function(M) {
    T(), M && o && o(M);
  }, [T, o]), G = wt(function(M) {
    _(M), h && h(M);
  }, [_, h]);
  return _m({
    dataKey: n,
    findNearestDatum: i,
    onBlur: r ? N : void 0,
    onFocus: r ? k : void 0,
    onPointerMove: r ? I : void 0,
    onPointerOut: r ? F : void 0,
    onPointerUp: r ? c : void 0,
    onPointerDown: r ? G : void 0,
    allowedSources: w
  }), wm({
    source: p,
    onBlur: !!o && r,
    onFocus: !!a && r,
    onPointerMove: !!u && r,
    onPointerOut: !!f && r,
    onPointerUp: !!c && r,
    onPointerDown: !!h && r
  });
}
function ic() {
  return ic = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, ic.apply(this, arguments);
}
function Pm(e) {
  var t, n, r, i = e.colorAccessor, o = e.data, a = e.dataKey, u = e.onBlur, f = e.onFocus, c = e.onPointerMove, h = e.onPointerOut, p = e.onPointerUp, w = e.onPointerDown, P = e.enableEvents, _ = P === void 0 ? !0 : P, T = e.renderGlyphs, I = e.size, k = I === void 0 ? 8 : I, F = e.xAccessor, N = e.xScale, G = e.yAccessor, M = e.yScale, D = an(jr), te = D.colorScale, Q = D.theme, fe = D.horizontal, ge = wt(Ci(N, F), [N, F]), re = wt(Ci(M, G), [M, G]), ee = (t = (n = te == null ? void 0 : te(a)) != null ? n : Q == null || (r = Q.colors) == null ? void 0 : r[0]) != null ? t : "#222", be = vC + "-" + a, Oe = Cm({
    dataKey: a,
    enableEvents: _,
    onBlur: u,
    onFocus: f,
    onPointerMove: c,
    onPointerOut: h,
    onPointerUp: p,
    onPointerDown: w,
    source: be,
    allowedSources: [Uu, be]
  }), ut = Ht(function() {
    return o.map(function(Ue, st) {
      var lt, dt = ge(Ue);
      if (!en(dt))
        return null;
      var V = re(Ue);
      return en(V) ? {
        key: "" + st,
        x: dt,
        y: V,
        color: (lt = i == null ? void 0 : i(Ue, st)) != null ? lt : ee,
        size: typeof k == "function" ? k(Ue) : k,
        datum: Ue
      } : null;
    }).filter(function(Ue) {
      return Ue;
    });
  }, [ee, i, o, ge, re, k]);
  return /* @__PURE__ */ L(Dn, {
    children: T(ic({
      glyphs: ut,
      xScale: N,
      yScale: M,
      horizontal: fe
    }, Oe))
  }, void 0, !1);
}
Pm.propTypes = {
  colorAccessor: ke.exports.func,
  size: ke.exports.oneOfType([ke.exports.number, ke.exports.func]),
  renderGlyphs: ke.exports.func.isRequired
};
var YC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/defaultRenderGlyph.js";
function XC(e) {
  var t = e.key, n = e.color, r = e.x, i = e.y, o = e.size, a = e.onBlur, u = e.onFocus, f = e.onPointerMove, c = e.onPointerOut, h = e.onPointerUp;
  return /* @__PURE__ */ L("circle", {
    className: "visx-circle-glyph",
    tabIndex: a || u ? 0 : void 0,
    fill: n,
    r: o / 2,
    cx: r,
    cy: i,
    onBlur: a,
    onFocus: u,
    onPointerMove: f,
    onPointerOut: c,
    onPointerUp: h
  }, t, !1, {
    fileName: YC,
    lineNumber: 13,
    columnNumber: 23
  }, this);
}
var mo = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/BaseAreaSeries.js", KC = ["PathComponent", "curve", "data", "dataKey", "lineProps", "onBlur", "onFocus", "onPointerMove", "onPointerOut", "onPointerUp", "onPointerDown", "enableEvents", "renderLine", "xAccessor", "x0Accessor", "xScale", "yAccessor", "y0Accessor", "yScale"];
function oc() {
  return oc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, oc.apply(this, arguments);
}
function QC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function Tm(e) {
  var t, n, r, i = e.PathComponent, o = i === void 0 ? "path" : i, a = e.curve, u = e.data, f = e.dataKey, c = e.lineProps, h = e.onBlur, p = e.onFocus, w = e.onPointerMove, P = e.onPointerOut, _ = e.onPointerUp, T = e.onPointerDown, I = e.enableEvents, k = I === void 0 ? !0 : I, F = e.renderLine, N = F === void 0 ? !0 : F, G = e.xAccessor, M = e.x0Accessor, D = e.xScale, te = e.yAccessor, Q = e.y0Accessor, fe = e.yScale, ge = QC(e, KC), re = an(jr), ee = re.colorScale, be = re.theme, Oe = re.horizontal, ut = Ht(function() {
    return M ? Ci(D, M) : void 0;
  }, [D, M]), Ue = wt(Ci(D, G), [D, G]), st = Ht(function() {
    return Q ? Ci(fe, Q) : void 0;
  }, [fe, Q]), lt = wt(Ci(fe, te), [fe, te]), dt = wt(function(Ne) {
    return en(D(G(Ne))) && en(fe(te(Ne)));
  }, [D, G, fe, te]), V = (t = (n = ee == null ? void 0 : ee(f)) != null ? n : be == null || (r = be.colors) == null ? void 0 : r[0]) != null ? t : "#222", ue = hC + "-" + f, Te = Cm({
    dataKey: f,
    enableEvents: k,
    onBlur: h,
    onFocus: p,
    onPointerMove: w,
    onPointerOut: P,
    onPointerUp: _,
    onPointerDown: T,
    source: ue,
    allowedSources: [Uu, ue]
  }), Ae = Ht(function() {
    var Ne = qC(Oe ? D : fe);
    return Oe ? {
      x0: ut != null ? ut : Ne,
      x1: Ue,
      y: lt
    } : {
      x: Ue,
      y0: st != null ? st : Ne,
      y1: lt
    };
  }, [D, fe, Oe, Ue, lt, ut, st]), Ce = Boolean(p || h), Re = wt(function(Ne) {
    var Be = Ne.glyphs;
    return Ce ? Be.map(function(Le) {
      return /* @__PURE__ */ L(Dn, {
        children: XC(oc({}, Le, {
          color: "transparent",
          onFocus: Te.onFocus,
          onBlur: Te.onBlur
        }))
      }, void 0, !1);
    }) : null;
  }, [Ce, Te.onFocus, Te.onBlur]);
  return /* @__PURE__ */ L(Dn, {
    children: [/* @__PURE__ */ L(kC, {
      ...Ae,
      ...ge,
      curve: a,
      defined: dt,
      children: function(Ne) {
        var Be = Ne.path;
        return /* @__PURE__ */ L(o, {
          className: "visx-area",
          stroke: "transparent",
          fill: V,
          strokeLinecap: "round",
          ...ge,
          d: Be(u) || "",
          ...Te
        }, void 0, !1, {
          fileName: mo,
          lineNumber: 110,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: mo,
      lineNumber: 105,
      columnNumber: 78
    }, this), N && /* @__PURE__ */ L(zC, {
      x: Ue,
      y: lt,
      defined: dt,
      curve: a,
      ...c,
      children: function(Ne) {
        var Be = Ne.path;
        return /* @__PURE__ */ L(o, {
          className: "visx-line",
          fill: "transparent",
          stroke: V,
          strokeWidth: 2,
          pointerEvents: "none",
          strokeLinecap: "round",
          ...c,
          d: Be(u) || ""
        }, void 0, !1, {
          fileName: mo,
          lineNumber: 126,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: mo,
      lineNumber: 119,
      columnNumber: 34
    }, this), Ce && /* @__PURE__ */ L(Pm, {
      dataKey: f,
      data: u,
      xAccessor: G,
      yAccessor: te,
      xScale: D,
      yScale: fe,
      renderGlyphs: Re
    }, void 0, !1, {
      fileName: mo,
      lineNumber: 137,
      columnNumber: 42
    }, this)]
  }, void 0, !0);
}
Tm.propTypes = {
  renderLine: ke.exports.bool
};
const ZC = VC(Tm);
function JC(e, t) {
  const n = [], r = [];
  function i(o, a) {
    if (o.length === 1)
      n.push(o[0]), r.push(o[0]);
    else {
      const u = Array(o.length - 1);
      for (let f = 0; f < u.length; f++)
        f === 0 && n.push(o[0]), f === u.length - 1 && r.push(o[f + 1]), u[f] = [
          (1 - a) * o[f][0] + a * o[f + 1][0],
          (1 - a) * o[f][1] + a * o[f + 1][1]
        ];
      i(u, a);
    }
  }
  return e.length && i(e, t), { left: n, right: r.reverse() };
}
function eP(e) {
  const t = {};
  return e.length === 4 && (t.x2 = e[2][0], t.y2 = e[2][1]), e.length >= 3 && (t.x1 = e[1][0], t.y1 = e[1][1]), t.x = e[e.length - 1][0], t.y = e[e.length - 1][1], e.length === 4 ? t.type = "C" : e.length === 3 ? t.type = "Q" : t.type = "L", t;
}
function tP(e, t) {
  t = t || 2;
  const n = [];
  let r = e;
  const i = 1 / t;
  for (let o = 0; o < t - 1; o++) {
    const a = i / (1 - i * o), u = JC(r, a);
    n.push(u.left), r = u.right;
  }
  return n.push(r), n;
}
function nP(e, t, n) {
  const r = [[e.x, e.y]];
  return t.x1 != null && r.push([t.x1, t.y1]), t.x2 != null && r.push([t.x2, t.y2]), r.push([t.x, t.y]), tP(r, n).map(eP);
}
const rP = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, Oi = {
  M: ["x", "y"],
  L: ["x", "y"],
  H: ["x"],
  V: ["y"],
  C: ["x1", "y1", "x2", "y2", "x", "y"],
  S: ["x2", "y2", "x", "y"],
  Q: ["x1", "y1", "x", "y"],
  T: ["x", "y"],
  A: ["rx", "ry", "xAxisRotation", "largeArcFlag", "sweepFlag", "x", "y"],
  Z: []
};
Object.keys(Oi).forEach((e) => {
  Oi[e.toLowerCase()] = Oi[e];
});
function ac(e, t) {
  const n = Array(e);
  for (let r = 0; r < e; r++)
    n[r] = t;
  return n;
}
function iP(e) {
  return `${e.type}${Oi[e.type].map((t) => e[t]).join(",")}`;
}
function oP(e, t) {
  const n = {
    x1: "x",
    y1: "y",
    x2: "x",
    y2: "y"
  }, r = ["xAxisRotation", "largeArcFlag", "sweepFlag"];
  if (e.type !== t.type && t.type.toUpperCase() !== "M") {
    const i = {};
    Object.keys(t).forEach((o) => {
      const a = t[o];
      let u = e[o];
      u === void 0 && (r.includes(o) ? u = a : (u === void 0 && n[o] && (u = e[n[o]]), u === void 0 && (u = 0))), i[o] = u;
    }), i.type = t.type, e = i;
  }
  return e;
}
function aP(e, t, n) {
  let r = [];
  if (t.type === "L" || t.type === "Q" || t.type === "C")
    r = r.concat(
      nP(e, t, n)
    );
  else {
    const i = Object.assign({}, e);
    i.type === "M" && (i.type = "L"), r = r.concat(
      ac(n - 1).map(() => i)
    ), r.push(t);
  }
  return r;
}
function Xp(e, t, n) {
  const r = e.length - 1, i = t.length - 1, o = r / i, u = ac(i).reduce(
    (f, c, h) => {
      let p = Math.floor(o * h);
      if (n && p < e.length - 1 && n(
        e[p],
        e[p + 1]
      )) {
        const w = o * h % 1 < 0.5;
        f[p] && (w ? p > 0 ? p -= 1 : p < e.length - 1 && (p += 1) : p < e.length - 1 ? p += 1 : p > 0 && (p -= 1));
      }
      return f[p] = (f[p] || 0) + 1, f;
    },
    []
  ).reduce((f, c, h) => {
    if (h === e.length - 1) {
      const p = ac(
        c,
        Object.assign({}, e[e.length - 1])
      );
      return p[0].type === "M" && p.forEach((w) => {
        w.type = "L";
      }), f.concat(p);
    }
    return f.concat(
      aP(e[h], e[h + 1], c)
    );
  }, []);
  return u.unshift(e[0]), u;
}
function Kp(e) {
  const t = (e || "").match(rP) || [], n = [];
  let r, i;
  for (let o = 0; o < t.length; ++o)
    if (r = Oi[t[o]], r) {
      i = {
        type: t[o]
      };
      for (let a = 0; a < r.length; ++a)
        i[r[a]] = +t[o + a + 1];
      o += r.length, n.push(i);
    }
  return n;
}
function uP(e, t, n) {
  let r = e == null ? [] : e.slice(), i = t == null ? [] : t.slice();
  if (!r.length && !i.length)
    return function() {
      return [];
    };
  const o = (r.length === 0 || r[r.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  r.length > 0 && r[r.length - 1].type === "Z" && r.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), r.length ? i.length || i.push(r[0]) : r.push(i[0]), Math.abs(i.length - r.length) !== 0 && (i.length > r.length ? r = Xp(r, i, n) : i.length < r.length && (i = Xp(i, r, n))), r = r.map(
    (f, c) => oP(f, i[c])
  );
  const u = r.map((f) => ({ ...f }));
  return o && u.push({ type: "Z" }), function(c) {
    if (c === 1)
      return t == null ? [] : t;
    if (c > 0)
      for (let h = 0; h < u.length; ++h) {
        const p = r[h], w = i[h], P = u[h];
        for (const _ of Oi[P.type])
          P[_] = (1 - c) * p[_] + c * w[_], (_ === "largeArcFlag" || _ === "sweepFlag") && (P[_] = Math.round(P[_]));
      }
    return u;
  };
}
function sP(e, t, n) {
  let r = Kp(e), i = Kp(t);
  if (!r.length && !i.length)
    return function() {
      return "";
    };
  const o = uP(
    r,
    i,
    n
  );
  return function(u) {
    if (u === 1)
      return t == null ? "" : t;
    const f = o(u);
    let c = "";
    for (const h of f)
      c += iP(h);
    return c;
  };
}
var lP = ["d", "stroke", "fill"];
function uc() {
  return uc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, uc.apply(this, arguments);
}
function cP(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function fP(e) {
  var t = e.d, n = e.stroke, r = n === void 0 ? "transparent" : n, i = e.fill, o = i === void 0 ? "transparent" : i, a = cP(e, lP), u = tn(t), f = wt(
    dc(function(P) {
      u.current = P;
    }, 50),
    []
  ), c = sP(u.current, t);
  f(t);
  var h = $p({
    from: {
      t: 0
    },
    to: {
      t: 1
    },
    reset: !0,
    delay: 0
  }), p = h.t, w = $p({
    stroke: r,
    fill: o
  });
  return /* @__PURE__ */ gn.createElement(TS.path, uc({
    className: "visx-path",
    d: p.to(c),
    stroke: w.stroke,
    fill: w.fill
  }, a));
}
var dP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/AnimatedAreaSeries.js";
function pP(e) {
  return /* @__PURE__ */ L(ZC, {
    ...e,
    PathComponent: fP
  }, void 0, !1, {
    fileName: dP,
    lineNumber: 9,
    columnNumber: 23
  }, this);
}
var $r = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/LineChart/LineChart.tsx";
const hP = ({
  colorScale: e,
  nearestDatum: t,
  accessors: n
}) => /* @__PURE__ */ L("div", {
  children: [/* @__PURE__ */ L("div", {
    style: {
      color: e(t.key)
    },
    children: t.key
  }, void 0, !1, {
    fileName: $r,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), n.xAccessor(t.datum), ", ", n.yAccessor(t.datum)]
}, void 0, !0, {
  fileName: $r,
  lineNumber: 31,
  columnNumber: 5
}, void 0), vP = ({
  accessors: e,
  data: t,
  lineLabel: n,
  xLabel: r,
  yLabel: i,
  ...o
}) => /* @__PURE__ */ L(Dn, {
  children: /* @__PURE__ */ L(Ri, {
    xScale: {
      type: "linear",
      domain: [Math.min(...t.map(e.xAccessor)), Math.max(...t.map(e.xAccessor))],
      zero: !1
    },
    yScale: {
      type: "linear"
    },
    ...o,
    children: [/* @__PURE__ */ L(pP, {
      dataKey: n,
      data: t,
      ...e
    }, void 0, !1, {
      fileName: $r,
      lineNumber: 46,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ L(cm, {
      snapTooltipToDatumX: !0,
      snapTooltipToDatumY: !0,
      showSeriesGlyphs: !0,
      renderTooltip: ({
        tooltipData: a,
        colorScale: u
      }) => /* @__PURE__ */ L(hP, {
        nearestDatum: a.nearestDatum,
        colorScale: u,
        accessors: e
      }, void 0, !1, {
        fileName: $r,
        lineNumber: 52,
        columnNumber: 13
      }, void 0)
    }, void 0, !1, {
      fileName: $r,
      lineNumber: 47,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: $r,
    lineNumber: 45,
    columnNumber: 7
  }, void 0)
}, void 0, !1), iN = (e) => {
  const r = {
    ...{
      accessors: {
        xAccessor: (i) => i.x,
        yAccessor: (i) => i.y
      },
      data: [],
      xLabel: "Unlabeled",
      yLabel: "Unlabeled",
      lineLabel: "Unlabeled"
    },
    ...e
  };
  return /* @__PURE__ */ L(Ph, {
    children: (i) => /* @__PURE__ */ L(vP, {
      ...r,
      parentSize: i,
      parentWidth: i.width,
      parentHeight: i.height,
      parentTop: i.top,
      parentLeft: i.left,
      parentRef: i.ref,
      resizeParent: i.resize
    }, void 0, !1, {
      fileName: $r,
      lineNumber: 86,
      columnNumber: 9
    }, void 0)
  }, void 0, !1, {
    fileName: $r,
    lineNumber: 84,
    columnNumber: 5
  }, void 0);
};
var Co = { exports: {} }, za = { exports: {} }, Qp;
function gP() {
  return Qp || (Qp = 1, function(e, t) {
    (function(n, r) {
      r(t, gn);
    })(xi, function(n, r) {
      function i(s, g, y, b, E, R, A) {
        try {
          var j = s[R](A), W = j.value;
        } catch (U) {
          return void y(U);
        }
        j.done ? g(W) : Promise.resolve(W).then(b, E);
      }
      function o(s) {
        return function() {
          var g = this, y = arguments;
          return new Promise(function(b, E) {
            var R = s.apply(g, y);
            function A(W) {
              i(R, b, E, A, j, "next", W);
            }
            function j(W) {
              i(R, b, E, A, j, "throw", W);
            }
            A(void 0);
          });
        };
      }
      function a() {
        return (a = Object.assign || function(s) {
          for (var g = 1; g < arguments.length; g++) {
            var y = arguments[g];
            for (var b in y)
              Object.prototype.hasOwnProperty.call(y, b) && (s[b] = y[b]);
          }
          return s;
        }).apply(this, arguments);
      }
      function u(s, g) {
        if (s == null)
          return {};
        var y, b, E = {}, R = Object.keys(s);
        for (b = 0; b < R.length; b++)
          y = R[b], g.indexOf(y) >= 0 || (E[y] = s[y]);
        return E;
      }
      function f(s) {
        var g = function(y, b) {
          if (typeof y != "object" || y === null)
            return y;
          var E = y[Symbol.toPrimitive];
          if (E !== void 0) {
            var R = E.call(y, b || "default");
            if (typeof R != "object")
              return R;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return (b === "string" ? String : Number)(y);
        }(s, "string");
        return typeof g == "symbol" ? g : String(g);
      }
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      var c = { init: "init" }, h = function(s) {
        var g = s.value;
        return g === void 0 ? "" : g;
      }, p = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, w = { Cell: h, width: 150, minWidth: 0, maxWidth: Number.MAX_SAFE_INTEGER };
      function P() {
        for (var s = arguments.length, g = new Array(s), y = 0; y < s; y++)
          g[y] = arguments[y];
        return g.reduce(function(b, E) {
          var R = E.style, A = E.className;
          return b = a({}, b, {}, u(E, ["style", "className"])), R && (b.style = b.style ? a({}, b.style || {}, {}, R || {}) : R), A && (b.className = b.className ? b.className + " " + A : A), b.className === "" && delete b.className, b;
        }, {});
      }
      var _ = function(s, g) {
        return g === void 0 && (g = {}), function(y) {
          return y === void 0 && (y = {}), [].concat(s, [y]).reduce(function(b, E) {
            return function R(A, j, W) {
              return typeof j == "function" ? R({}, j(A, W)) : Array.isArray(j) ? P.apply(void 0, [A].concat(j)) : P(A, j);
            }(b, E, a({}, g, { userProps: y }));
          }, {});
        };
      }, T = function(s, g, y, b) {
        return y === void 0 && (y = {}), s.reduce(function(E, R) {
          return R(E, y);
        }, g);
      }, I = function(s, g, y) {
        return y === void 0 && (y = {}), s.forEach(function(b) {
          b(g, y);
        });
      };
      function k(s, g, y, b) {
        s.findIndex(function(E) {
          return E.pluginName === y;
        }), g.forEach(function(E) {
          s.findIndex(function(R) {
            return R.pluginName === E;
          });
        });
      }
      function F(s, g) {
        return typeof s == "function" ? s(g) : s;
      }
      function N(s) {
        var g = r.useRef();
        return g.current = s, r.useCallback(function() {
          return g.current;
        }, []);
      }
      var G = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function M(s, g) {
        var y = r.useRef(!1);
        G(function() {
          y.current && s(), y.current = !0;
        }, g);
      }
      function D(s, g, y) {
        return y === void 0 && (y = {}), function(b, E) {
          E === void 0 && (E = {});
          var R = typeof b == "string" ? g[b] : b;
          if (R === void 0)
            throw console.info(g), new Error("Renderer Error \u261D\uFE0F");
          return te(R, a({}, s, { column: g }, y, {}, E));
        };
      }
      function te(s, g) {
        return function(b) {
          return typeof b == "function" && (E = Object.getPrototypeOf(b)).prototype && E.prototype.isReactComponent;
          var E;
        }(y = s) || typeof y == "function" || function(b) {
          return typeof b == "object" && typeof b.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(b.$$typeof.description);
        }(y) ? r.createElement(s, g) : s;
        var y;
      }
      function Q(s, g, y) {
        return y === void 0 && (y = 0), s.map(function(b) {
          return ge(b = a({}, b, { parent: g, depth: y })), b.columns && (b.columns = Q(b.columns, b, y + 1)), b;
        });
      }
      function fe(s) {
        return Ue(s, "columns");
      }
      function ge(s) {
        var g = s.id, y = s.accessor, b = s.Header;
        if (typeof y == "string") {
          g = g || y;
          var E = y.split(".");
          y = function(R) {
            return function(A, j, W) {
              if (!j)
                return A;
              var U, se = typeof j == "function" ? j : JSON.stringify(j), ie = be.get(se) || function() {
                var oe = function(Y) {
                  return function ne(me, xe) {
                    if (xe === void 0 && (xe = []), Array.isArray(me))
                      for (var $e = 0; $e < me.length; $e += 1)
                        ne(me[$e], xe);
                    else
                      xe.push(me);
                    return xe;
                  }(Y).map(function(ne) {
                    return String(ne).replace(".", "_");
                  }).join(".").replace(Te, ".").replace(Ae, "").split(".");
                }(j);
                return be.set(se, oe), oe;
              }();
              try {
                U = ie.reduce(function(oe, Y) {
                  return oe[Y];
                }, A);
              } catch {
              }
              return U !== void 0 ? U : W;
            }(R, E);
          };
        }
        if (!g && typeof b == "string" && b && (g = b), !g && s.columns)
          throw console.error(s), new Error('A column ID (or unique "Header" value) is required!');
        if (!g)
          throw console.error(s), new Error("A column ID (or string accessor) is required!");
        return Object.assign(s, { id: g, accessor: y }), s;
      }
      function re(s, g) {
        if (!g)
          throw new Error();
        return Object.assign(s, a({ Header: p, Footer: p }, w, {}, g, {}, s)), Object.assign(s, { originalWidth: s.width }), s;
      }
      function ee(s, g, y) {
        y === void 0 && (y = function() {
          return {};
        });
        for (var b = [], E = s, R = 0, A = function() {
          return R++;
        }, j = function() {
          var W = { headers: [] }, U = [], se = E.some(function(ie) {
            return ie.parent;
          });
          E.forEach(function(ie) {
            var oe, Y = [].concat(U).reverse()[0];
            se && (ie.parent ? oe = a({}, ie.parent, { originalId: ie.parent.id, id: ie.parent.id + "_" + A(), headers: [ie] }, y(ie)) : oe = re(a({ originalId: ie.id + "_placeholder", id: ie.id + "_placeholder_" + A(), placeholderOf: ie, headers: [ie] }, y(ie)), g), Y && Y.originalId === oe.originalId ? Y.headers.push(ie) : U.push(oe)), W.headers.push(ie);
          }), b.push(W), E = U;
        }; E.length; )
          j();
        return b.reverse();
      }
      var be = /* @__PURE__ */ new Map();
      function Oe() {
        for (var s = arguments.length, g = new Array(s), y = 0; y < s; y++)
          g[y] = arguments[y];
        for (var b = 0; b < g.length; b += 1)
          if (g[b] !== void 0)
            return g[b];
      }
      function ut(s) {
        if (typeof s == "function")
          return s;
      }
      function Ue(s, g) {
        var y = [];
        return function b(E) {
          E.forEach(function(R) {
            R[g] ? b(R[g]) : y.push(R);
          });
        }(s), y;
      }
      function st(s, g) {
        var y = g.manualExpandedKey, b = g.expanded, E = g.expandSubRows, R = E === void 0 || E, A = [];
        return s.forEach(function(j) {
          return function W(U, se) {
            se === void 0 && (se = !0), U.isExpanded = U.original && U.original[y] || b[U.id], U.canExpand = U.subRows && !!U.subRows.length, se && A.push(U), U.subRows && U.subRows.length && U.isExpanded && U.subRows.forEach(function(ie) {
              return W(ie, R);
            });
          }(j);
        }), A;
      }
      function lt(s, g, y) {
        return ut(s) || g[s] || y[s] || y.text;
      }
      function dt(s, g, y) {
        return s ? s(g, y) : g === void 0;
      }
      function V() {
        throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.");
      }
      var ue = null, Te = /\[/g, Ae = /\]/g, Ce = function(s) {
        return a({ role: "table" }, s);
      }, Re = function(s) {
        return a({ role: "rowgroup" }, s);
      }, Ne = function(s, g) {
        var y = g.column;
        return a({ key: "header_" + y.id, colSpan: y.totalVisibleHeaderCount, role: "columnheader" }, s);
      }, Be = function(s, g) {
        var y = g.column;
        return a({ key: "footer_" + y.id, colSpan: y.totalVisibleHeaderCount }, s);
      }, Le = function(s, g) {
        return a({ key: "headerGroup_" + g.index, role: "row" }, s);
      }, X = function(s, g) {
        return a({ key: "footerGroup_" + g.index }, s);
      }, ce = function(s, g) {
        return a({ key: "row_" + g.row.id, role: "row" }, s);
      }, Ge = function(s, g) {
        var y = g.cell;
        return a({ key: "cell_" + y.row.id + "_" + y.column.id, role: "cell" }, s);
      };
      function B() {
        return { useOptions: [], stateReducers: [], useControlledState: [], columns: [], columnsDeps: [], allColumns: [], allColumnsDeps: [], accessValue: [], materializedColumns: [], materializedColumnsDeps: [], useInstanceAfterData: [], visibleColumns: [], visibleColumnsDeps: [], headerGroups: [], headerGroupsDeps: [], useInstanceBeforeDimensions: [], useInstance: [], prepareRow: [], getTableProps: [Ce], getTableBodyProps: [Re], getHeaderGroupProps: [Le], getFooterGroupProps: [X], getHeaderProps: [Ne], getFooterProps: [Be], getRowProps: [ce], getCellProps: [Ge], useFinalInstance: [] };
      }
      c.resetHiddenColumns = "resetHiddenColumns", c.toggleHideColumn = "toggleHideColumn", c.setHiddenColumns = "setHiddenColumns", c.toggleHideAllColumns = "toggleHideAllColumns";
      var gt = function(s) {
        s.getToggleHiddenProps = [ct], s.getToggleHideAllColumnsProps = [_t], s.stateReducers.push(Ot), s.useInstanceBeforeDimensions.push(Qt), s.headerGroupsDeps.push(function(g, y) {
          var b = y.instance;
          return [].concat(g, [b.state.hiddenColumns]);
        }), s.useInstance.push(un);
      };
      gt.pluginName = "useColumnVisibility";
      var ct = function(s, g) {
        var y = g.column;
        return [s, { onChange: function(b) {
          y.toggleHidden(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isVisible, title: "Toggle Column Visible" }];
      }, _t = function(s, g) {
        var y = g.instance;
        return [s, { onChange: function(b) {
          y.toggleHideAllColumns(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: !y.allColumnsHidden && !y.state.hiddenColumns.length, title: "Toggle All Columns Hidden", indeterminate: !y.allColumnsHidden && y.state.hiddenColumns.length }];
      };
      function Ot(s, g, y, b) {
        if (g.type === c.init)
          return a({ hiddenColumns: [] }, s);
        if (g.type === c.resetHiddenColumns)
          return a({}, s, { hiddenColumns: b.initialState.hiddenColumns || [] });
        if (g.type === c.toggleHideColumn) {
          var E = (g.value !== void 0 ? g.value : !s.hiddenColumns.includes(g.columnId)) ? [].concat(s.hiddenColumns, [g.columnId]) : s.hiddenColumns.filter(function(R) {
            return R !== g.columnId;
          });
          return a({}, s, { hiddenColumns: E });
        }
        return g.type === c.setHiddenColumns ? a({}, s, { hiddenColumns: F(g.value, s.hiddenColumns) }) : g.type === c.toggleHideAllColumns ? a({}, s, { hiddenColumns: (g.value !== void 0 ? g.value : !s.hiddenColumns.length) ? b.allColumns.map(function(R) {
          return R.id;
        }) : [] }) : void 0;
      }
      function Qt(s) {
        var g = s.headers, y = s.state.hiddenColumns;
        r.useRef(!1).current;
        var b = 0;
        g.forEach(function(E) {
          return b += function R(A, j) {
            A.isVisible = j && !y.includes(A.id);
            var W = 0;
            return A.headers && A.headers.length ? A.headers.forEach(function(U) {
              return W += R(U, A.isVisible);
            }) : W = A.isVisible ? 1 : 0, A.totalVisibleHeaderCount = W, W;
          }(E, !0);
        });
      }
      function un(s) {
        var g = s.columns, y = s.flatHeaders, b = s.dispatch, E = s.allColumns, R = s.getHooks, A = s.state.hiddenColumns, j = s.autoResetHiddenColumns, W = j === void 0 || j, U = N(s), se = E.length === A.length, ie = r.useCallback(function(xe, $e) {
          return b({ type: c.toggleHideColumn, columnId: xe, value: $e });
        }, [b]), oe = r.useCallback(function(xe) {
          return b({ type: c.setHiddenColumns, value: xe });
        }, [b]), Y = r.useCallback(function(xe) {
          return b({ type: c.toggleHideAllColumns, value: xe });
        }, [b]), ne = _(R().getToggleHideAllColumnsProps, { instance: U() });
        y.forEach(function(xe) {
          xe.toggleHidden = function($e) {
            b({ type: c.toggleHideColumn, columnId: xe.id, value: $e });
          }, xe.getToggleHiddenProps = _(R().getToggleHiddenProps, { instance: U(), column: xe });
        });
        var me = N(W);
        M(function() {
          me() && b({ type: c.resetHiddenColumns });
        }, [b, g]), Object.assign(s, { allColumnsHidden: se, toggleHideColumn: ie, setHiddenColumns: oe, toggleHideAllColumns: Y, getToggleHideAllColumnsProps: ne });
      }
      var yn = {}, bn = {}, wn = function(s, g, y) {
        return s;
      }, zn = function(s, g) {
        return s.subRows || [];
      }, rr = function(s, g, y) {
        return "" + (y ? [y.id, g].join(".") : g);
      }, Ln = function(s) {
        return s;
      };
      function xn(s) {
        var g = s.initialState, y = g === void 0 ? yn : g, b = s.defaultColumn, E = b === void 0 ? bn : b, R = s.getSubRows, A = R === void 0 ? zn : R, j = s.getRowId, W = j === void 0 ? rr : j, U = s.stateReducer, se = U === void 0 ? wn : U, ie = s.useControlledState, oe = ie === void 0 ? Ln : ie;
        return a({}, u(s, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]), { initialState: y, defaultColumn: E, getSubRows: A, getRowId: W, stateReducer: se, useControlledState: oe });
      }
      function qt(s, g) {
        g === void 0 && (g = 0);
        var y = 0, b = 0, E = 0, R = 0;
        return s.forEach(function(A) {
          var j = A.headers;
          if (A.totalLeft = g, j && j.length) {
            var W = qt(j, g), U = W[0], se = W[1], ie = W[2], oe = W[3];
            A.totalMinWidth = U, A.totalWidth = se, A.totalMaxWidth = ie, A.totalFlexWidth = oe;
          } else
            A.totalMinWidth = A.minWidth, A.totalWidth = Math.min(Math.max(A.minWidth, A.width), A.maxWidth), A.totalMaxWidth = A.maxWidth, A.totalFlexWidth = A.canResize ? A.totalWidth : 0;
          A.isVisible && (g += A.totalWidth, y += A.totalMinWidth, b += A.totalWidth, E += A.totalMaxWidth, R += A.totalFlexWidth);
        }), [y, b, E, R];
      }
      function Mn(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.column, A = s.getRowId, j = s.getSubRows, W = s.accessValueHooks, U = s.getInstance;
        g.forEach(function(se, ie) {
          return function oe(Y, ne, me, xe, $e) {
            me === void 0 && (me = 0);
            var Je = Y, Fe = A(Y, ne, xe), le = E[Fe];
            if (le)
              le.subRows && le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, me + 1, le);
              });
            else if ((le = { id: Fe, original: Je, index: ne, depth: me, cells: [{}] }).cells.map = V, le.cells.filter = V, le.cells.forEach = V, le.cells[0].getCellProps = V, le.values = {}, $e.push(le), b.push(le), E[Fe] = le, le.originalSubRows = j(Y, ne), le.originalSubRows) {
              var Qe = [];
              le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, me + 1, le, Qe);
              }), le.subRows = Qe;
            }
            R.accessor && (le.values[R.id] = R.accessor(Y, ne, le, $e, g)), le.values[R.id] = T(W, le.values[R.id], { row: le, column: R, instance: U() });
          }(se, ie, 0, void 0, y);
        });
      }
      c.resetExpanded = "resetExpanded", c.toggleRowExpanded = "toggleRowExpanded", c.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var ir = function(s) {
        s.getToggleAllRowsExpandedProps = [mr], s.getToggleRowExpandedProps = [yr], s.stateReducers.push(or), s.useInstance.push(br), s.prepareRow.push(Gn);
      };
      ir.pluginName = "useExpanded";
      var mr = function(s, g) {
        var y = g.instance;
        return [s, { onClick: function(b) {
          y.toggleAllRowsExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle All Rows Expanded" }];
      }, yr = function(s, g) {
        var y = g.row;
        return [s, { onClick: function() {
          y.toggleRowExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle Row Expanded" }];
      };
      function or(s, g, y, b) {
        if (g.type === c.init)
          return a({ expanded: {} }, s);
        if (g.type === c.resetExpanded)
          return a({}, s, { expanded: b.initialState.expanded || {} });
        if (g.type === c.toggleAllRowsExpanded) {
          var E = g.value, R = b.rowsById, A = Object.keys(R).length === Object.keys(s.expanded).length;
          if (E !== void 0 ? E : !A) {
            var j = {};
            return Object.keys(R).forEach(function(ne) {
              j[ne] = !0;
            }), a({}, s, { expanded: j });
          }
          return a({}, s, { expanded: {} });
        }
        if (g.type === c.toggleRowExpanded) {
          var W, U = g.id, se = g.value, ie = s.expanded[U], oe = se !== void 0 ? se : !ie;
          if (!ie && oe)
            return a({}, s, { expanded: a({}, s.expanded, (W = {}, W[U] = !0, W)) });
          if (ie && !oe) {
            var Y = s.expanded;
            return Y[U], a({}, s, { expanded: u(Y, [U].map(f)) });
          }
          return s;
        }
      }
      function br(s) {
        var g = s.data, y = s.rows, b = s.rowsById, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.paginateExpandedRows, j = A === void 0 || A, W = s.expandSubRows, U = W === void 0 || W, se = s.autoResetExpanded, ie = se === void 0 || se, oe = s.getHooks, Y = s.plugins, ne = s.state.expanded, me = s.dispatch;
        k(Y, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var xe = N(ie), $e = Boolean(Object.keys(b).length && Object.keys(ne).length);
        $e && Object.keys(b).some(function(ft) {
          return !ne[ft];
        }) && ($e = !1), M(function() {
          xe() && me({ type: c.resetExpanded });
        }, [me, g]);
        var Je = r.useCallback(function(ft, je) {
          me({ type: c.toggleRowExpanded, id: ft, value: je });
        }, [me]), Fe = r.useCallback(function(ft) {
          return me({ type: c.toggleAllRowsExpanded, value: ft });
        }, [me]), le = r.useMemo(function() {
          return j ? st(y, { manualExpandedKey: R, expanded: ne, expandSubRows: U }) : y;
        }, [j, y, R, ne, U]), Qe = r.useMemo(function() {
          return function(ft) {
            var je = 0;
            return Object.keys(ft).forEach(function(Ve) {
              var yt = Ve.split(".");
              je = Math.max(je, yt.length);
            }), je;
          }(ne);
        }, [ne]), Ee = N(s), Ye = _(oe().getToggleAllRowsExpandedProps, { instance: Ee() });
        Object.assign(s, { preExpandedRows: y, expandedRows: le, rows: le, expandedDepth: Qe, isAllRowsExpanded: $e, toggleRowExpanded: Je, toggleAllRowsExpanded: Fe, getToggleAllRowsExpandedProps: Ye });
      }
      function Gn(s, g) {
        var y = g.instance.getHooks, b = g.instance;
        s.toggleRowExpanded = function(E) {
          return b.toggleRowExpanded(s.id, E);
        }, s.getToggleRowExpandedProps = _(y().getToggleRowExpandedProps, { instance: b, row: s });
      }
      var jn = function(s, g, y) {
        return s = s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return String(R).toLowerCase().includes(String(y).toLowerCase());
          });
        });
      };
      jn.autoRemove = function(s) {
        return !s;
      };
      var sn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R).toLowerCase() === String(y).toLowerCase();
          });
        });
      };
      sn.autoRemove = function(s) {
        return !s;
      };
      var _n = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R) === String(y);
          });
        });
      };
      _n.autoRemove = function(s) {
        return !s;
      };
      var On = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            return b.values[E].includes(y);
          });
        });
      };
      On.autoRemove = function(s) {
        return !s || !s.length;
      };
      var An = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.every(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      An.autoRemove = function(s) {
        return !s || !s.length;
      };
      var ar = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.some(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      ar.autoRemove = function(s) {
        return !s || !s.length;
      };
      var kn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var R = b.values[E];
            return y.includes(R);
          });
        });
      };
      kn.autoRemove = function(s) {
        return !s || !s.length;
      };
      var ur = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            return b.values[E] === y;
          });
        });
      };
      ur.autoRemove = function(s) {
        return s === void 0;
      };
      var Hn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            return b.values[E] == y;
          });
        });
      };
      Hn.autoRemove = function(s) {
        return s == null;
      };
      var Wn = function(s, g, y) {
        var b = y || [], E = b[0], R = b[1];
        if ((E = typeof E == "number" ? E : -1 / 0) > (R = typeof R == "number" ? R : 1 / 0)) {
          var A = E;
          E = R, R = A;
        }
        return s.filter(function(j) {
          return g.some(function(W) {
            var U = j.values[W];
            return U >= E && U <= R;
          });
        });
      };
      Wn.autoRemove = function(s) {
        return !s || typeof s[0] != "number" && typeof s[1] != "number";
      };
      var Sn = Object.freeze({ __proto__: null, text: jn, exactText: sn, exactTextCase: _n, includes: On, includesAll: An, includesSome: ar, includesValue: kn, exact: ur, equals: Hn, between: Wn });
      c.resetFilters = "resetFilters", c.setFilter = "setFilter", c.setAllFilters = "setAllFilters";
      var wr = function(s) {
        s.stateReducers.push(Lt), s.useInstance.push(Yt);
      };
      function Lt(s, g, y, b) {
        if (g.type === c.init)
          return a({ filters: [] }, s);
        if (g.type === c.resetFilters)
          return a({}, s, { filters: b.initialState.filters || [] });
        if (g.type === c.setFilter) {
          var E = g.columnId, R = g.filterValue, A = b.allColumns, j = b.filterTypes, W = A.find(function(me) {
            return me.id === E;
          });
          if (!W)
            throw new Error("React-Table: Could not find a column with id: " + E);
          var U = lt(W.filter, j || {}, Sn), se = s.filters.find(function(me) {
            return me.id === E;
          }), ie = F(R, se && se.value);
          return dt(U.autoRemove, ie, W) ? a({}, s, { filters: s.filters.filter(function(me) {
            return me.id !== E;
          }) }) : a({}, s, se ? { filters: s.filters.map(function(me) {
            return me.id === E ? { id: E, value: ie } : me;
          }) } : { filters: [].concat(s.filters, [{ id: E, value: ie }]) });
        }
        if (g.type === c.setAllFilters) {
          var oe = g.filters, Y = b.allColumns, ne = b.filterTypes;
          return a({}, s, { filters: F(oe, s.filters).filter(function(me) {
            var xe = Y.find(function($e) {
              return $e.id === me.id;
            });
            return !dt(lt(xe.filter, ne || {}, Sn).autoRemove, me.value, xe);
          }) });
        }
      }
      function Yt(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.manualFilters, W = s.defaultCanFilter, U = W !== void 0 && W, se = s.disableFilters, ie = s.state.filters, oe = s.dispatch, Y = s.autoResetFilters, ne = Y === void 0 || Y, me = r.useCallback(function(Ee, Ye) {
          oe({ type: c.setFilter, columnId: Ee, filterValue: Ye });
        }, [oe]), xe = r.useCallback(function(Ee) {
          oe({ type: c.setAllFilters, filters: Ee });
        }, [oe]);
        R.forEach(function(Ee) {
          var Ye = Ee.id, ft = Ee.accessor, je = Ee.defaultCanFilter, Ve = Ee.disableFilters;
          Ee.canFilter = ft ? Oe(Ve !== !0 && void 0, se !== !0 && void 0, !0) : Oe(je, U, !1), Ee.setFilter = function(Ke) {
            return me(Ee.id, Ke);
          };
          var yt = ie.find(function(Ke) {
            return Ke.id === Ye;
          });
          Ee.filterValue = yt && yt.value;
        });
        var $e = r.useMemo(function() {
          if (j || !ie.length)
            return [y, b, E];
          var Ee = [], Ye = {};
          return [function ft(je, Ve) {
            Ve === void 0 && (Ve = 0);
            var yt = je;
            return (yt = ie.reduce(function(Ke, ht) {
              var l = ht.id, d = ht.value, m = R.find(function(S) {
                return S.id === l;
              });
              if (!m)
                return Ke;
              Ve === 0 && (m.preFilteredRows = Ke);
              var v = lt(m.filter, A || {}, Sn);
              return v ? (m.filteredRows = v(Ke, [l], d), m.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + m.id + "."), Ke);
            }, je)).forEach(function(Ke) {
              Ee.push(Ke), Ye[Ke.id] = Ke, Ke.subRows && (Ke.subRows = Ke.subRows && Ke.subRows.length > 0 ? ft(Ke.subRows, Ve + 1) : Ke.subRows);
            }), yt;
          }(y), Ee, Ye];
        }, [j, ie, y, b, E, R, A]), Je = $e[0], Fe = $e[1], le = $e[2];
        r.useMemo(function() {
          R.filter(function(Ee) {
            return !ie.find(function(Ye) {
              return Ye.id === Ee.id;
            });
          }).forEach(function(Ee) {
            Ee.preFilteredRows = Je, Ee.filteredRows = Je;
          });
        }, [Je, ie, R]);
        var Qe = N(ne);
        M(function() {
          Qe() && oe({ type: c.resetFilters });
        }, [oe, j ? null : g]), Object.assign(s, { preFilteredRows: y, preFilteredFlatRows: b, preFilteredRowsById: E, filteredRows: Je, filteredFlatRows: Fe, filteredRowsById: le, rows: Je, flatRows: Fe, rowsById: le, setFilter: me, setAllFilters: xe });
      }
      wr.pluginName = "useFilters", c.resetGlobalFilter = "resetGlobalFilter", c.setGlobalFilter = "setGlobalFilter";
      var O = function(s) {
        s.stateReducers.push(J), s.useInstance.push(he);
      };
      function J(s, g, y, b) {
        if (g.type === c.resetGlobalFilter)
          return a({}, s, { globalFilter: b.initialState.globalFilter || void 0 });
        if (g.type === c.setGlobalFilter) {
          var E = g.filterValue, R = b.userFilterTypes, A = lt(b.globalFilter, R || {}, Sn), j = F(E, s.globalFilter);
          return dt(A.autoRemove, j) ? (s.globalFilter, u(s, ["globalFilter"])) : a({}, s, { globalFilter: j });
        }
      }
      function he(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.globalFilter, W = s.manualGlobalFilter, U = s.state.globalFilter, se = s.dispatch, ie = s.autoResetGlobalFilter, oe = ie === void 0 || ie, Y = s.disableGlobalFilter, ne = r.useCallback(function(le) {
          se({ type: c.setGlobalFilter, filterValue: le });
        }, [se]), me = r.useMemo(function() {
          if (W || U === void 0)
            return [y, b, E];
          var le = [], Qe = {}, Ee = lt(j, A || {}, Sn);
          if (!Ee)
            return console.warn("Could not find a valid 'globalFilter' option."), y;
          R.forEach(function(ft) {
            var je = ft.disableGlobalFilter;
            ft.canFilter = Oe(je !== !0 && void 0, Y !== !0 && void 0, !0);
          });
          var Ye = R.filter(function(ft) {
            return ft.canFilter === !0;
          });
          return [function ft(je) {
            return (je = Ee(je, Ye.map(function(Ve) {
              return Ve.id;
            }), U)).forEach(function(Ve) {
              le.push(Ve), Qe[Ve.id] = Ve, Ve.subRows = Ve.subRows && Ve.subRows.length ? ft(Ve.subRows) : Ve.subRows;
            }), je;
          }(y), le, Qe];
        }, [W, U, j, A, R, y, b, E, Y]), xe = me[0], $e = me[1], Je = me[2], Fe = N(oe);
        M(function() {
          Fe() && se({ type: c.resetGlobalFilter });
        }, [se, W ? null : g]), Object.assign(s, { preGlobalFilteredRows: y, preGlobalFilteredFlatRows: b, preGlobalFilteredRowsById: E, globalFilteredRows: xe, globalFilteredFlatRows: $e, globalFilteredRowsById: Je, rows: xe, flatRows: $e, rowsById: Je, setGlobalFilter: ne, disableGlobalFilter: Y });
      }
      function ze(s, g) {
        return g.reduce(function(y, b) {
          return y + (typeof b == "number" ? b : 0);
        }, 0);
      }
      O.pluginName = "useGlobalFilter";
      var pt = Object.freeze({ __proto__: null, sum: ze, min: function(s) {
        var g = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (g = Math.min(g, y));
        }), g;
      }, max: function(s) {
        var g = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (g = Math.max(g, y));
        }), g;
      }, minMax: function(s) {
        var g = s[0] || 0, y = s[0] || 0;
        return s.forEach(function(b) {
          typeof b == "number" && (g = Math.min(g, b), y = Math.max(y, b));
        }), g + ".." + y;
      }, average: function(s) {
        return ze(0, s) / s.length;
      }, median: function(s) {
        if (!s.length)
          return null;
        var g = Math.floor(s.length / 2), y = [].concat(s).sort(function(b, E) {
          return b - E;
        });
        return s.length % 2 != 0 ? y[g] : (y[g - 1] + y[g]) / 2;
      }, unique: function(s) {
        return Array.from(new Set(s).values());
      }, uniqueCount: function(s) {
        return new Set(s).size;
      }, count: function(s) {
        return s.length;
      } }), mt = [], ot = {};
      c.resetGroupBy = "resetGroupBy", c.setGroupBy = "setGroupBy", c.toggleGroupBy = "toggleGroupBy";
      var rt = function(s) {
        s.getGroupByToggleProps = [At], s.stateReducers.push(Pt), s.visibleColumnsDeps.push(function(g, y) {
          var b = y.instance;
          return [].concat(g, [b.state.groupBy]);
        }), s.visibleColumns.push(Et), s.useInstance.push(Un), s.prepareRow.push(Hr);
      };
      rt.pluginName = "useGroupBy";
      var At = function(s, g) {
        var y = g.header;
        return [s, { onClick: y.canGroupBy ? function(b) {
          b.persist(), y.toggleGroupBy();
        } : void 0, style: { cursor: y.canGroupBy ? "pointer" : void 0 }, title: "Toggle GroupBy" }];
      };
      function Pt(s, g, y, b) {
        if (g.type === c.init)
          return a({ groupBy: [] }, s);
        if (g.type === c.resetGroupBy)
          return a({}, s, { groupBy: b.initialState.groupBy || [] });
        if (g.type === c.setGroupBy)
          return a({}, s, { groupBy: g.value });
        if (g.type === c.toggleGroupBy) {
          var E = g.columnId, R = g.value, A = R !== void 0 ? R : !s.groupBy.includes(E);
          return a({}, s, A ? { groupBy: [].concat(s.groupBy, [E]) } : { groupBy: s.groupBy.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function Et(s, g) {
        var y = g.instance.state.groupBy, b = y.map(function(R) {
          return s.find(function(A) {
            return A.id === R;
          });
        }).filter(Boolean), E = s.filter(function(R) {
          return !y.includes(R.id);
        });
        return (s = [].concat(b, E)).forEach(function(R) {
          R.isGrouped = y.includes(R.id), R.groupedIndex = y.indexOf(R.id);
        }), s;
      }
      var pn = {};
      function Un(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.flatHeaders, j = s.groupByFn, W = j === void 0 ? ln : j, U = s.manualGroupBy, se = s.aggregations, ie = se === void 0 ? pn : se, oe = s.plugins, Y = s.state.groupBy, ne = s.dispatch, me = s.autoResetGroupBy, xe = me === void 0 || me, $e = s.disableGroupBy, Je = s.defaultCanGroupBy, Fe = s.getHooks;
        k(oe, ["useColumnOrder", "useFilters"], "useGroupBy");
        var le = N(s);
        R.forEach(function(m) {
          var v = m.accessor, S = m.defaultGroupBy, C = m.disableGroupBy;
          m.canGroupBy = v ? Oe(m.canGroupBy, C !== !0 && void 0, $e !== !0 && void 0, !0) : Oe(m.canGroupBy, S, Je, !1), m.canGroupBy && (m.toggleGroupBy = function() {
            return s.toggleGroupBy(m.id);
          }), m.Aggregated = m.Aggregated || m.Cell;
        });
        var Qe = r.useCallback(function(m, v) {
          ne({ type: c.toggleGroupBy, columnId: m, value: v });
        }, [ne]), Ee = r.useCallback(function(m) {
          ne({ type: c.setGroupBy, value: m });
        }, [ne]);
        A.forEach(function(m) {
          m.getGroupByToggleProps = _(Fe().getGroupByToggleProps, { instance: le(), header: m });
        });
        var Ye = r.useMemo(function() {
          if (U || !Y.length)
            return [y, b, E, mt, ot, b, E];
          var m = Y.filter(function(q) {
            return R.find(function(pe) {
              return pe.id === q;
            });
          }), v = [], S = {}, C = [], x = {}, $ = [], z = {}, H = function q(pe, Z, ae) {
            if (Z === void 0 && (Z = 0), Z === m.length)
              return pe.map(function(Pe) {
                return a({}, Pe, { depth: Z });
              });
            var ve = m[Z], K = W(pe, ve);
            return Object.entries(K).map(function(Pe, De) {
              var We = Pe[0], we = Pe[1], Ze = ve + ":" + We, it = q(we, Z + 1, Ze = ae ? ae + ">" + Ze : Ze), _e = Z ? Ue(we, "leafRows") : we, ye = function(Ie, et, tt) {
                var St = {};
                return R.forEach(function(Me) {
                  if (m.includes(Me.id))
                    St[Me.id] = et[0] ? et[0].values[Me.id] : null;
                  else {
                    var Bt = typeof Me.aggregate == "function" ? Me.aggregate : ie[Me.aggregate] || pt[Me.aggregate];
                    if (Bt) {
                      var nt = et.map(function(Xe) {
                        return Xe.values[Me.id];
                      }), qe = Ie.map(function(Xe) {
                        var Tt = Xe.values[Me.id];
                        if (!tt && Me.aggregateValue) {
                          var Gt = typeof Me.aggregateValue == "function" ? Me.aggregateValue : ie[Me.aggregateValue] || pt[Me.aggregateValue];
                          if (!Gt)
                            throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                          Tt = Gt(Tt, Xe, Me);
                        }
                        return Tt;
                      });
                      St[Me.id] = Bt(qe, nt);
                    } else {
                      if (Me.aggregate)
                        throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregate option for column listed above");
                      St[Me.id] = null;
                    }
                  }
                }), St;
              }(_e, we, Z), Se = { id: Ze, isGrouped: !0, groupByID: ve, groupByVal: We, values: ye, subRows: it, leafRows: _e, depth: Z, index: De };
              return it.forEach(function(Ie) {
                v.push(Ie), S[Ie.id] = Ie, Ie.isGrouped ? (C.push(Ie), x[Ie.id] = Ie) : ($.push(Ie), z[Ie.id] = Ie);
              }), Se;
            });
          }(y);
          return H.forEach(function(q) {
            v.push(q), S[q.id] = q, q.isGrouped ? (C.push(q), x[q.id] = q) : ($.push(q), z[q.id] = q);
          }), [H, v, S, C, x, $, z];
        }, [U, Y, y, b, E, R, ie, W]), ft = Ye[0], je = Ye[1], Ve = Ye[2], yt = Ye[3], Ke = Ye[4], ht = Ye[5], l = Ye[6], d = N(xe);
        M(function() {
          d() && ne({ type: c.resetGroupBy });
        }, [ne, U ? null : g]), Object.assign(s, { preGroupedRows: y, preGroupedFlatRow: b, preGroupedRowsById: E, groupedRows: ft, groupedFlatRows: je, groupedRowsById: Ve, onlyGroupedFlatRows: yt, onlyGroupedRowsById: Ke, nonGroupedFlatRows: ht, nonGroupedRowsById: l, rows: ft, flatRows: je, rowsById: Ve, toggleGroupBy: Qe, setGroupBy: Ee });
      }
      function Hr(s) {
        s.allCells.forEach(function(g) {
          var y;
          g.isGrouped = g.column.isGrouped && g.column.id === s.groupByID, g.isPlaceholder = !g.isGrouped && g.column.isGrouped, g.isAggregated = !g.isGrouped && !g.isPlaceholder && ((y = s.subRows) == null ? void 0 : y.length);
        });
      }
      function ln(s, g) {
        return s.reduce(function(y, b, E) {
          var R = "" + b.values[g];
          return y[R] = Array.isArray(y[R]) ? y[R] : [], y[R].push(b), y;
        }, {});
      }
      var na = /([0-9]+)/gm;
      function pi(s, g) {
        return s === g ? 0 : s > g ? 1 : -1;
      }
      function Wr(s, g, y) {
        return [s.values[y], g.values[y]];
      }
      function ra(s) {
        return typeof s == "number" ? isNaN(s) || s === 1 / 0 || s === -1 / 0 ? "" : String(s) : typeof s == "string" ? s : "";
      }
      var Vu = Object.freeze({ __proto__: null, alphanumeric: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], R = b[1];
        for (E = ra(E), R = ra(R), E = E.split(na).filter(Boolean), R = R.split(na).filter(Boolean); E.length && R.length; ) {
          var A = E.shift(), j = R.shift(), W = parseInt(A, 10), U = parseInt(j, 10), se = [W, U].sort();
          if (isNaN(se[0])) {
            if (A > j)
              return 1;
            if (j > A)
              return -1;
          } else {
            if (isNaN(se[1]))
              return isNaN(W) ? -1 : 1;
            if (W > U)
              return 1;
            if (U > W)
              return -1;
          }
        }
        return E.length - R.length;
      }, datetime: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], R = b[1];
        return pi(E = E.getTime(), R = R.getTime());
      }, basic: function(s, g, y) {
        var b = Wr(s, g, y);
        return pi(b[0], b[1]);
      }, string: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], R = b[1];
        for (E = E.split("").filter(Boolean), R = R.split("").filter(Boolean); E.length && R.length; ) {
          var A = E.shift(), j = R.shift(), W = A.toLowerCase(), U = j.toLowerCase();
          if (W > U)
            return 1;
          if (U > W)
            return -1;
          if (A > j)
            return 1;
          if (j > A)
            return -1;
        }
        return E.length - R.length;
      }, number: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], R = b[1], A = /[^0-9.]/gi;
        return pi(E = Number(String(E).replace(A, "")), R = Number(String(R).replace(A, "")));
      } });
      c.resetSortBy = "resetSortBy", c.setSortBy = "setSortBy", c.toggleSortBy = "toggleSortBy", c.clearSortBy = "clearSortBy", w.sortType = "alphanumeric", w.sortDescFirst = !1;
      var ia = function(s) {
        s.getSortByToggleProps = [qu], s.stateReducers.push(Yu), s.useInstance.push(Xu);
      };
      ia.pluginName = "useSortBy";
      var qu = function(s, g) {
        var y = g.instance, b = g.column, E = y.isMultiSortEvent, R = E === void 0 ? function(A) {
          return A.shiftKey;
        } : E;
        return [s, { onClick: b.canSort ? function(A) {
          A.persist(), b.toggleSortBy(void 0, !y.disableMultiSort && R(A));
        } : void 0, style: { cursor: b.canSort ? "pointer" : void 0 }, title: b.canSort ? "Toggle SortBy" : void 0 }];
      };
      function Yu(s, g, y, b) {
        if (g.type === c.init)
          return a({ sortBy: [] }, s);
        if (g.type === c.resetSortBy)
          return a({}, s, { sortBy: b.initialState.sortBy || [] });
        if (g.type === c.clearSortBy)
          return a({}, s, { sortBy: s.sortBy.filter(function(le) {
            return le.id !== g.columnId;
          }) });
        if (g.type === c.setSortBy)
          return a({}, s, { sortBy: g.sortBy });
        if (g.type === c.toggleSortBy) {
          var E, R = g.columnId, A = g.desc, j = g.multi, W = b.allColumns, U = b.disableMultiSort, se = b.disableSortRemove, ie = b.disableMultiRemove, oe = b.maxMultiSortColCount, Y = oe === void 0 ? Number.MAX_SAFE_INTEGER : oe, ne = s.sortBy, me = W.find(function(le) {
            return le.id === R;
          }).sortDescFirst, xe = ne.find(function(le) {
            return le.id === R;
          }), $e = ne.findIndex(function(le) {
            return le.id === R;
          }), Je = A != null, Fe = [];
          return (E = !U && j ? xe ? "toggle" : "add" : $e !== ne.length - 1 || ne.length !== 1 ? "replace" : xe ? "toggle" : "replace") != "toggle" || se || Je || j && ie || !(xe && xe.desc && !me || !xe.desc && me) || (E = "remove"), E === "replace" ? Fe = [{ id: R, desc: Je ? A : me }] : E === "add" ? (Fe = [].concat(ne, [{ id: R, desc: Je ? A : me }])).splice(0, Fe.length - Y) : E === "toggle" ? Fe = ne.map(function(le) {
            return le.id === R ? a({}, le, { desc: Je ? A : !xe.desc }) : le;
          }) : E === "remove" && (Fe = ne.filter(function(le) {
            return le.id !== R;
          })), a({}, s, { sortBy: Fe });
        }
      }
      function Xu(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.allColumns, R = s.orderByFn, A = R === void 0 ? oa : R, j = s.sortTypes, W = s.manualSortBy, U = s.defaultCanSort, se = s.disableSortBy, ie = s.flatHeaders, oe = s.state.sortBy, Y = s.dispatch, ne = s.plugins, me = s.getHooks, xe = s.autoResetSortBy, $e = xe === void 0 || xe;
        k(ne, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var Je = r.useCallback(function(je) {
          Y({ type: c.setSortBy, sortBy: je });
        }, [Y]), Fe = r.useCallback(function(je, Ve, yt) {
          Y({ type: c.toggleSortBy, columnId: je, desc: Ve, multi: yt });
        }, [Y]), le = N(s);
        ie.forEach(function(je) {
          var Ve = je.accessor, yt = je.canSort, Ke = je.disableSortBy, ht = je.id, l = Ve ? Oe(Ke !== !0 && void 0, se !== !0 && void 0, !0) : Oe(U, yt, !1);
          je.canSort = l, je.canSort && (je.toggleSortBy = function(m, v) {
            return Fe(je.id, m, v);
          }, je.clearSortBy = function() {
            Y({ type: c.clearSortBy, columnId: je.id });
          }), je.getSortByToggleProps = _(me().getSortByToggleProps, { instance: le(), column: je });
          var d = oe.find(function(m) {
            return m.id === ht;
          });
          je.isSorted = !!d, je.sortedIndex = oe.findIndex(function(m) {
            return m.id === ht;
          }), je.isSortedDesc = je.isSorted ? d.desc : void 0;
        });
        var Qe = r.useMemo(function() {
          if (W || !oe.length)
            return [y, b];
          var je = [], Ve = oe.filter(function(yt) {
            return E.find(function(Ke) {
              return Ke.id === yt.id;
            });
          });
          return [function yt(Ke) {
            var ht = A(Ke, Ve.map(function(l) {
              var d = E.find(function(S) {
                return S.id === l.id;
              });
              if (!d)
                throw new Error("React-Table: Could not find a column with id: " + l.id + " while sorting");
              var m = d.sortType, v = ut(m) || (j || {})[m] || Vu[m];
              if (!v)
                throw new Error("React-Table: Could not find a valid sortType of '" + m + "' for column '" + l.id + "'.");
              return function(S, C) {
                return v(S, C, l.id, l.desc);
              };
            }), Ve.map(function(l) {
              var d = E.find(function(m) {
                return m.id === l.id;
              });
              return d && d.sortInverted ? l.desc : !l.desc;
            }));
            return ht.forEach(function(l) {
              je.push(l), l.subRows && l.subRows.length !== 0 && (l.subRows = yt(l.subRows));
            }), ht;
          }(y), je];
        }, [W, oe, y, b, E, A, j]), Ee = Qe[0], Ye = Qe[1], ft = N($e);
        M(function() {
          ft() && Y({ type: c.resetSortBy });
        }, [W ? null : g]), Object.assign(s, { preSortedRows: y, preSortedFlatRows: b, sortedRows: Ee, sortedFlatRows: Ye, rows: Ee, flatRows: Ye, setSortBy: Je, toggleSortBy: Fe });
      }
      function oa(s, g, y) {
        return [].concat(s).sort(function(b, E) {
          for (var R = 0; R < g.length; R += 1) {
            var A = g[R], j = y[R] === !1 || y[R] === "desc", W = A(b, E);
            if (W !== 0)
              return j ? -W : W;
          }
          return y[0] ? b.index - E.index : E.index - b.index;
        });
      }
      c.resetPage = "resetPage", c.gotoPage = "gotoPage", c.setPageSize = "setPageSize";
      var Vi = function(s) {
        s.stateReducers.push(Ku), s.useInstance.push(Qu);
      };
      function Ku(s, g, y, b) {
        if (g.type === c.init)
          return a({ pageSize: 10, pageIndex: 0 }, s);
        if (g.type === c.resetPage)
          return a({}, s, { pageIndex: b.initialState.pageIndex || 0 });
        if (g.type === c.gotoPage) {
          var E = b.pageCount, R = b.page, A = F(g.pageIndex, s.pageIndex), j = !1;
          return A > s.pageIndex ? j = E === -1 ? R.length >= s.pageSize : A < E : A < s.pageIndex && (j = A > -1), j ? a({}, s, { pageIndex: A }) : s;
        }
        if (g.type === c.setPageSize) {
          var W = g.pageSize, U = s.pageSize * s.pageIndex;
          return a({}, s, { pageIndex: Math.floor(U / W), pageSize: W });
        }
      }
      function Qu(s) {
        var g = s.rows, y = s.autoResetPage, b = y === void 0 || y, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.plugins, j = s.pageCount, W = s.paginateExpandedRows, U = W === void 0 || W, se = s.expandSubRows, ie = se === void 0 || se, oe = s.state, Y = oe.pageSize, ne = oe.pageIndex, me = oe.expanded, xe = oe.globalFilter, $e = oe.filters, Je = oe.groupBy, Fe = oe.sortBy, le = s.dispatch, Qe = s.data, Ee = s.manualPagination;
        k(A, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var Ye = N(b);
        M(function() {
          Ye() && le({ type: c.resetPage });
        }, [le, Ee ? null : Qe, xe, $e, Je, Fe]);
        var ft = Ee ? j : Math.ceil(g.length / Y), je = r.useMemo(function() {
          return ft > 0 ? [].concat(new Array(ft)).fill(null).map(function(v, S) {
            return S;
          }) : [];
        }, [ft]), Ve = r.useMemo(function() {
          var v;
          if (Ee)
            v = g;
          else {
            var S = Y * ne, C = S + Y;
            v = g.slice(S, C);
          }
          return U ? v : st(v, { manualExpandedKey: R, expanded: me, expandSubRows: ie });
        }, [ie, me, R, Ee, ne, Y, U, g]), yt = ne > 0, Ke = ft === -1 ? Ve.length >= Y : ne < ft - 1, ht = r.useCallback(function(v) {
          le({ type: c.gotoPage, pageIndex: v });
        }, [le]), l = r.useCallback(function() {
          return ht(function(v) {
            return v - 1;
          });
        }, [ht]), d = r.useCallback(function() {
          return ht(function(v) {
            return v + 1;
          });
        }, [ht]), m = r.useCallback(function(v) {
          le({ type: c.setPageSize, pageSize: v });
        }, [le]);
        Object.assign(s, { pageOptions: je, pageCount: ft, page: Ve, canPreviousPage: yt, canNextPage: Ke, gotoPage: ht, previousPage: l, nextPage: d, setPageSize: m });
      }
      Vi.pluginName = "usePagination", c.resetPivot = "resetPivot", c.togglePivot = "togglePivot";
      var qi = function(s) {
        s.getPivotToggleProps = [Zu], s.stateReducers.push(Ju), s.useInstanceAfterData.push(es), s.allColumns.push(ts), s.accessValue.push(ns), s.materializedColumns.push(ua), s.materializedColumnsDeps.push(sa), s.visibleColumns.push(rs), s.visibleColumnsDeps.push(is), s.useInstance.push(os), s.prepareRow.push(as);
      };
      qi.pluginName = "usePivotColumns";
      var aa = [], Zu = function(s, g) {
        var y = g.header;
        return [s, { onClick: y.canPivot ? function(b) {
          b.persist(), y.togglePivot();
        } : void 0, style: { cursor: y.canPivot ? "pointer" : void 0 }, title: "Toggle Pivot" }];
      };
      function Ju(s, g, y, b) {
        if (g.type === c.init)
          return a({ pivotColumns: aa }, s);
        if (g.type === c.resetPivot)
          return a({}, s, { pivotColumns: b.initialState.pivotColumns || aa });
        if (g.type === c.togglePivot) {
          var E = g.columnId, R = g.value, A = R !== void 0 ? R : !s.pivotColumns.includes(E);
          return a({}, s, A ? { pivotColumns: [].concat(s.pivotColumns, [E]) } : { pivotColumns: s.pivotColumns.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function es(s) {
        s.allColumns.forEach(function(g) {
          g.isPivotSource = s.state.pivotColumns.includes(g.id);
        });
      }
      function ts(s, g) {
        var y = g.instance;
        return s.forEach(function(b) {
          b.isPivotSource = y.state.pivotColumns.includes(b.id), b.uniqueValues = /* @__PURE__ */ new Set();
        }), s;
      }
      function ns(s, g) {
        var y = g.column;
        return y.uniqueValues && s !== void 0 && y.uniqueValues.add(s), s;
      }
      function ua(s, g) {
        var y = g.instance, b = y.allColumns, E = y.state;
        if (!E.pivotColumns.length || !E.groupBy || !E.groupBy.length)
          return s;
        var R = E.pivotColumns.map(function(W) {
          return b.find(function(U) {
            return U.id === W;
          });
        }).filter(Boolean), A = b.filter(function(W) {
          return !W.isPivotSource && !E.groupBy.includes(W.id) && !E.pivotColumns.includes(W.id);
        }), j = fe(function W(U, se, ie) {
          U === void 0 && (U = 0), ie === void 0 && (ie = []);
          var oe = R[U];
          return oe ? Array.from(oe.uniqueValues).sort().map(function(Y) {
            var ne = a({}, oe, { Header: oe.PivotHeader || typeof oe.header == "string" ? oe.Header + ": " + Y : Y, isPivotGroup: !0, parent: se, depth: U, id: se ? se.id + "." + oe.id + "." + Y : oe.id + "." + Y, pivotValue: Y });
            return ne.columns = W(U + 1, ne, [].concat(ie, [function(me) {
              return me.values[oe.id] === Y;
            }])), ne;
          }) : A.map(function(Y) {
            return a({}, Y, { canPivot: !1, isPivoted: !0, parent: se, depth: U, id: "" + (se ? se.id + "." + Y.id : Y.id), accessor: function(ne, me, xe) {
              if (ie.every(function($e) {
                return $e(xe);
              }))
                return xe.values[Y.id];
            } });
          });
        }());
        return [].concat(s, j);
      }
      function sa(s, g) {
        var y = g.instance.state, b = y.pivotColumns, E = y.groupBy;
        return [].concat(s, [b, E]);
      }
      function rs(s, g) {
        var y = g.instance.state;
        return s = s.filter(function(b) {
          return !b.isPivotSource;
        }), y.pivotColumns.length && y.groupBy && y.groupBy.length && (s = s.filter(function(b) {
          return b.isGrouped || b.isPivoted;
        })), s;
      }
      function is(s, g) {
        var y = g.instance;
        return [].concat(s, [y.state.pivotColumns, y.state.groupBy]);
      }
      function os(s) {
        var g = s.columns, y = s.allColumns, b = s.flatHeaders, E = s.getHooks, R = s.plugins, A = s.dispatch, j = s.autoResetPivot, W = j === void 0 || j, U = s.manaulPivot, se = s.disablePivot, ie = s.defaultCanPivot;
        k(R, ["useGroupBy"], "usePivotColumns");
        var oe = N(s);
        y.forEach(function(ne) {
          var me = ne.accessor, xe = ne.defaultPivot, $e = ne.disablePivot;
          ne.canPivot = me ? Oe(ne.canPivot, $e !== !0 && void 0, se !== !0 && void 0, !0) : Oe(ne.canPivot, xe, ie, !1), ne.canPivot && (ne.togglePivot = function() {
            return s.togglePivot(ne.id);
          }), ne.Aggregated = ne.Aggregated || ne.Cell;
        }), b.forEach(function(ne) {
          ne.getPivotToggleProps = _(E().getPivotToggleProps, { instance: oe(), header: ne });
        });
        var Y = N(W);
        M(function() {
          Y() && A({ type: c.resetPivot });
        }, [A, U ? null : g]), Object.assign(s, { togglePivot: function(ne, me) {
          A({ type: c.togglePivot, columnId: ne, value: me });
        } });
      }
      function as(s) {
        s.allCells.forEach(function(g) {
          g.isPivoted = g.column.isPivoted;
        });
      }
      c.resetSelectedRows = "resetSelectedRows", c.toggleAllRowsSelected = "toggleAllRowsSelected", c.toggleRowSelected = "toggleRowSelected", c.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var la = function(s) {
        s.getToggleRowSelectedProps = [Yi], s.getToggleAllRowsSelectedProps = [Ur], s.getToggleAllPageRowsSelectedProps = [ca], s.stateReducers.push(us), s.useInstance.push(fa), s.prepareRow.push(ss);
      };
      la.pluginName = "useRowSelect";
      var Yi = function(s, g) {
        var y = g.instance, b = g.row, E = y.manualRowSelectedKey, R = E === void 0 ? "isSelected" : E;
        return [s, { onChange: function(A) {
          b.toggleRowSelected(A.target.checked);
        }, style: { cursor: "pointer" }, checked: !(!b.original || !b.original[R]) || b.isSelected, title: "Toggle Row Selected", indeterminate: b.isSomeSelected }];
      }, Ur = function(s, g) {
        var y = g.instance;
        return [s, { onChange: function(b) {
          y.toggleAllRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllRowsSelected, title: "Toggle All Rows Selected", indeterminate: Boolean(!y.isAllRowsSelected && Object.keys(y.state.selectedRowIds).length) }];
      }, ca = function(s, g) {
        var y = g.instance;
        return [s, { onChange: function(b) {
          y.toggleAllPageRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllPageRowsSelected, title: "Toggle All Current Page Rows Selected", indeterminate: Boolean(!y.isAllPageRowsSelected && y.page.some(function(b) {
          var E = b.id;
          return y.state.selectedRowIds[E];
        })) }];
      };
      function us(s, g, y, b) {
        if (g.type === c.init)
          return a({ selectedRowIds: {} }, s);
        if (g.type === c.resetSelectedRows)
          return a({}, s, { selectedRowIds: b.initialState.selectedRowIds || {} });
        if (g.type === c.toggleAllRowsSelected) {
          var E = g.value, R = b.isAllRowsSelected, A = b.rowsById, j = b.nonGroupedRowsById, W = j === void 0 ? A : j, U = E !== void 0 ? E : !R, se = Object.assign({}, s.selectedRowIds);
          return U ? Object.keys(W).forEach(function(ht) {
            se[ht] = !0;
          }) : Object.keys(W).forEach(function(ht) {
            delete se[ht];
          }), a({}, s, { selectedRowIds: se });
        }
        if (g.type === c.toggleRowSelected) {
          var ie = g.id, oe = g.value, Y = b.rowsById, ne = b.selectSubRows, me = ne === void 0 || ne, xe = b.getSubRows, $e = s.selectedRowIds[ie], Je = oe !== void 0 ? oe : !$e;
          if ($e === Je)
            return s;
          var Fe = a({}, s.selectedRowIds);
          return function ht(l) {
            var d = Y[l];
            if (d && (d.isGrouped || (Je ? Fe[l] = !0 : delete Fe[l]), me && xe(d)))
              return xe(d).forEach(function(m) {
                return ht(m.id);
              });
          }(ie), a({}, s, { selectedRowIds: Fe });
        }
        if (g.type === c.toggleAllPageRowsSelected) {
          var le = g.value, Qe = b.page, Ee = b.rowsById, Ye = b.selectSubRows, ft = Ye === void 0 || Ye, je = b.isAllPageRowsSelected, Ve = b.getSubRows, yt = le !== void 0 ? le : !je, Ke = a({}, s.selectedRowIds);
          return Qe.forEach(function(ht) {
            return function l(d) {
              var m = Ee[d];
              if (m.isGrouped || (yt ? Ke[d] = !0 : delete Ke[d]), ft && Ve(m))
                return Ve(m).forEach(function(v) {
                  return l(v.id);
                });
            }(ht.id);
          }), a({}, s, { selectedRowIds: Ke });
        }
        return s;
      }
      function fa(s) {
        var g = s.data, y = s.rows, b = s.getHooks, E = s.plugins, R = s.rowsById, A = s.nonGroupedRowsById, j = A === void 0 ? R : A, W = s.autoResetSelectedRows, U = W === void 0 || W, se = s.state.selectedRowIds, ie = s.selectSubRows, oe = ie === void 0 || ie, Y = s.dispatch, ne = s.page, me = s.getSubRows;
        k(E, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var xe = r.useMemo(function() {
          var Ve = [];
          return y.forEach(function(yt) {
            var Ke = oe ? function ht(l, d, m) {
              if (d[l.id])
                return !0;
              var v = m(l);
              if (v && v.length) {
                var S = !0, C = !1;
                return v.forEach(function(x) {
                  C && !S || (ht(x, d, m) ? C = !0 : S = !1);
                }), !!S || !!C && null;
              }
              return !1;
            }(yt, se, me) : !!se[yt.id];
            yt.isSelected = !!Ke, yt.isSomeSelected = Ke === null, Ke && Ve.push(yt);
          }), Ve;
        }, [y, oe, se, me]), $e = Boolean(Object.keys(j).length && Object.keys(se).length), Je = $e;
        $e && Object.keys(j).some(function(Ve) {
          return !se[Ve];
        }) && ($e = !1), $e || ne && ne.length && ne.some(function(Ve) {
          var yt = Ve.id;
          return !se[yt];
        }) && (Je = !1);
        var Fe = N(U);
        M(function() {
          Fe() && Y({ type: c.resetSelectedRows });
        }, [Y, g]);
        var le = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllRowsSelected, value: Ve });
        }, [Y]), Qe = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllPageRowsSelected, value: Ve });
        }, [Y]), Ee = r.useCallback(function(Ve, yt) {
          return Y({ type: c.toggleRowSelected, id: Ve, value: yt });
        }, [Y]), Ye = N(s), ft = _(b().getToggleAllRowsSelectedProps, { instance: Ye() }), je = _(b().getToggleAllPageRowsSelectedProps, { instance: Ye() });
        Object.assign(s, { selectedFlatRows: xe, isAllRowsSelected: $e, isAllPageRowsSelected: Je, toggleRowSelected: Ee, toggleAllRowsSelected: le, getToggleAllRowsSelectedProps: ft, getToggleAllPageRowsSelectedProps: je, toggleAllPageRowsSelected: Qe });
      }
      function ss(s, g) {
        var y = g.instance;
        s.toggleRowSelected = function(b) {
          return y.toggleRowSelected(s.id, b);
        }, s.getToggleRowSelectedProps = _(y.getHooks().getToggleRowSelectedProps, { instance: y, row: s });
      }
      var da = function(s) {
        return {};
      }, pa = function(s) {
        return {};
      };
      c.setRowState = "setRowState", c.setCellState = "setCellState", c.resetRowState = "resetRowState";
      var Xi = function(s) {
        s.stateReducers.push(ls), s.useInstance.push(ha), s.prepareRow.push(cs);
      };
      function ls(s, g, y, b) {
        var E = b.initialRowStateAccessor, R = E === void 0 ? da : E, A = b.initialCellStateAccessor, j = A === void 0 ? pa : A, W = b.rowsById;
        if (g.type === c.init)
          return a({ rowState: {} }, s);
        if (g.type === c.resetRowState)
          return a({}, s, { rowState: b.initialState.rowState || {} });
        if (g.type === c.setRowState) {
          var U, se = g.rowId, ie = g.value, oe = s.rowState[se] !== void 0 ? s.rowState[se] : R(W[se]);
          return a({}, s, { rowState: a({}, s.rowState, (U = {}, U[se] = F(ie, oe), U)) });
        }
        if (g.type === c.setCellState) {
          var Y, ne, me, xe, $e, Je = g.rowId, Fe = g.columnId, le = g.value, Qe = s.rowState[Je] !== void 0 ? s.rowState[Je] : R(W[Je]), Ee = (Qe == null || (Y = Qe.cellState) == null ? void 0 : Y[Fe]) !== void 0 ? Qe.cellState[Fe] : j((ne = W[Je]) == null || (me = ne.cells) == null ? void 0 : me.find(function(Ye) {
            return Ye.column.id === Fe;
          }));
          return a({}, s, { rowState: a({}, s.rowState, ($e = {}, $e[Je] = a({}, Qe, { cellState: a({}, Qe.cellState || {}, (xe = {}, xe[Fe] = F(le, Ee), xe)) }), $e)) });
        }
      }
      function ha(s) {
        var g = s.autoResetRowState, y = g === void 0 || g, b = s.data, E = s.dispatch, R = r.useCallback(function(W, U) {
          return E({ type: c.setRowState, rowId: W, value: U });
        }, [E]), A = r.useCallback(function(W, U, se) {
          return E({ type: c.setCellState, rowId: W, columnId: U, value: se });
        }, [E]), j = N(y);
        M(function() {
          j() && E({ type: c.resetRowState });
        }, [b]), Object.assign(s, { setRowState: R, setCellState: A });
      }
      function cs(s, g) {
        var y = g.instance, b = y.initialRowStateAccessor, E = b === void 0 ? da : b, R = y.initialCellStateAccessor, A = R === void 0 ? pa : R, j = y.state.rowState;
        s && (s.state = j[s.id] !== void 0 ? j[s.id] : E(s), s.setState = function(W) {
          return y.setRowState(s.id, W);
        }, s.cells.forEach(function(W) {
          s.state.cellState || (s.state.cellState = {}), W.state = s.state.cellState[W.column.id] !== void 0 ? s.state.cellState[W.column.id] : A(W), W.setState = function(U) {
            return y.setCellState(s.id, W.column.id, U);
          };
        }));
      }
      Xi.pluginName = "useRowState", c.resetColumnOrder = "resetColumnOrder", c.setColumnOrder = "setColumnOrder";
      var va = function(s) {
        s.stateReducers.push(ga), s.visibleColumnsDeps.push(function(g, y) {
          var b = y.instance;
          return [].concat(g, [b.state.columnOrder]);
        }), s.visibleColumns.push(ma), s.useInstance.push(fs);
      };
      function ga(s, g, y, b) {
        return g.type === c.init ? a({ columnOrder: [] }, s) : g.type === c.resetColumnOrder ? a({}, s, { columnOrder: b.initialState.columnOrder || [] }) : g.type === c.setColumnOrder ? a({}, s, { columnOrder: F(g.columnOrder, s.columnOrder) }) : void 0;
      }
      function ma(s, g) {
        var y = g.instance.state.columnOrder;
        if (!y || !y.length)
          return s;
        for (var b = [].concat(y), E = [].concat(s), R = [], A = function() {
          var j = b.shift(), W = E.findIndex(function(U) {
            return U.id === j;
          });
          W > -1 && R.push(E.splice(W, 1)[0]);
        }; E.length && b.length; )
          A();
        return [].concat(R, E);
      }
      function fs(s) {
        var g = s.dispatch;
        s.setColumnOrder = r.useCallback(function(y) {
          return g({ type: c.setColumnOrder, columnOrder: y });
        }, [g]);
      }
      va.pluginName = "useColumnOrder", w.canResize = !0, c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize";
      var ya = function(s) {
        s.getResizerProps = [ds], s.getHeaderProps.push({ style: { position: "relative" } }), s.stateReducers.push(ps), s.useInstance.push(vs), s.useInstanceBeforeDimensions.push(hs);
      }, ds = function(s, g) {
        var y = g.instance, b = g.header, E = y.dispatch, R = function(A, j) {
          var W = !1;
          if (A.type === "touchstart") {
            if (A.touches && A.touches.length > 1)
              return;
            W = !0;
          }
          var U, se, ie = function(Fe) {
            var le = [];
            return function Qe(Ee) {
              Ee.columns && Ee.columns.length && Ee.columns.map(Qe), le.push(Ee);
            }(Fe), le;
          }(j).map(function(Fe) {
            return [Fe.id, Fe.totalWidth];
          }), oe = W ? Math.round(A.touches[0].clientX) : A.clientX, Y = function() {
            window.cancelAnimationFrame(U), U = null, E({ type: c.columnDoneResizing });
          }, ne = function() {
            window.cancelAnimationFrame(U), U = null, E({ type: c.columnResizing, clientX: se });
          }, me = function(Fe) {
            se = Fe, U || (U = window.requestAnimationFrame(ne));
          }, xe = { mouse: { moveEvent: "mousemove", moveHandler: function(Fe) {
            return me(Fe.clientX);
          }, upEvent: "mouseup", upHandler: function(Fe) {
            document.removeEventListener("mousemove", xe.mouse.moveHandler), document.removeEventListener("mouseup", xe.mouse.upHandler), Y();
          } }, touch: { moveEvent: "touchmove", moveHandler: function(Fe) {
            return Fe.cancelable && (Fe.preventDefault(), Fe.stopPropagation()), me(Fe.touches[0].clientX), !1;
          }, upEvent: "touchend", upHandler: function(Fe) {
            document.removeEventListener(xe.touch.moveEvent, xe.touch.moveHandler), document.removeEventListener(xe.touch.upEvent, xe.touch.moveHandler), Y();
          } } }, $e = W ? xe.touch : xe.mouse, Je = !!function() {
            if (typeof ue == "boolean")
              return ue;
            var Fe = !1;
            try {
              var le = { get passive() {
                return Fe = !0, !1;
              } };
              window.addEventListener("test", null, le), window.removeEventListener("test", null, le);
            } catch {
              Fe = !1;
            }
            return ue = Fe;
          }() && { passive: !1 };
          document.addEventListener($e.moveEvent, $e.moveHandler, Je), document.addEventListener($e.upEvent, $e.upHandler, Je), E({ type: c.columnStartResizing, columnId: j.id, columnWidth: j.totalWidth, headerIdWidths: ie, clientX: oe });
        };
        return [s, { onMouseDown: function(A) {
          return A.persist() || R(A, b);
        }, onTouchStart: function(A) {
          return A.persist() || R(A, b);
        }, style: { cursor: "col-resize" }, draggable: !1, role: "separator" }];
      };
      function ps(s, g) {
        if (g.type === c.init)
          return a({ columnResizing: { columnWidths: {} } }, s);
        if (g.type === c.resetResize)
          return a({}, s, { columnResizing: { columnWidths: {} } });
        if (g.type === c.columnStartResizing) {
          var y = g.clientX, b = g.columnId, E = g.columnWidth, R = g.headerIdWidths;
          return a({}, s, { columnResizing: a({}, s.columnResizing, { startX: y, headerIdWidths: R, columnWidth: E, isResizingColumn: b }) });
        }
        if (g.type === c.columnResizing) {
          var A = g.clientX, j = s.columnResizing, W = j.startX, U = j.columnWidth, se = j.headerIdWidths, ie = (A - W) / U, oe = {};
          return (se === void 0 ? [] : se).forEach(function(Y) {
            var ne = Y[0], me = Y[1];
            oe[ne] = Math.max(me + me * ie, 0);
          }), a({}, s, { columnResizing: a({}, s.columnResizing, { columnWidths: a({}, s.columnResizing.columnWidths, {}, oe) }) });
        }
        return g.type === c.columnDoneResizing ? a({}, s, { columnResizing: a({}, s.columnResizing, { startX: null, isResizingColumn: null }) }) : void 0;
      }
      ya.pluginName = "useResizeColumns";
      var hs = function(s) {
        var g = s.flatHeaders, y = s.disableResizing, b = s.getHooks, E = s.state.columnResizing, R = N(s);
        g.forEach(function(A) {
          var j = Oe(A.disableResizing !== !0 && void 0, y !== !0 && void 0, !0);
          A.canResize = j, A.width = E.columnWidths[A.id] || A.originalWidth || A.width, A.isResizing = E.isResizingColumn === A.id, j && (A.getResizerProps = _(b().getResizerProps, { instance: R(), header: A }));
        });
      };
      function vs(s) {
        var g = s.plugins, y = s.dispatch, b = s.autoResetResize, E = b === void 0 || b, R = s.columns;
        k(g, ["useAbsoluteLayout"], "useResizeColumns");
        var A = N(E);
        M(function() {
          A() && y({ type: c.resetResize });
        }, [R]);
        var j = r.useCallback(function() {
          return y({ type: c.resetResize });
        }, [y]);
        Object.assign(s, { resetResizing: j });
      }
      var Ki = { position: "absolute", top: 0 }, ba = function(s) {
        s.getTableBodyProps.push(hi), s.getRowProps.push(hi), s.getHeaderGroupProps.push(hi), s.getFooterGroupProps.push(hi), s.getHeaderProps.push(function(g, y) {
          var b = y.column;
          return [g, { style: a({}, Ki, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(g, y) {
          var b = y.cell;
          return [g, { style: a({}, Ki, { left: b.column.totalLeft + "px", width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(g, y) {
          var b = y.column;
          return [g, { style: a({}, Ki, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        });
      };
      ba.pluginName = "useAbsoluteLayout";
      var hi = function(s, g) {
        return [s, { style: { position: "relative", width: g.instance.totalColumnsWidth + "px" } }];
      }, Qi = { display: "inline-block", boxSizing: "border-box" }, Zi = function(s, g) {
        return [s, { style: { display: "flex", width: g.instance.totalColumnsWidth + "px" } }];
      }, wa = function(s) {
        s.getRowProps.push(Zi), s.getHeaderGroupProps.push(Zi), s.getFooterGroupProps.push(Zi), s.getHeaderProps.push(function(g, y) {
          var b = y.column;
          return [g, { style: a({}, Qi, { width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(g, y) {
          var b = y.cell;
          return [g, { style: a({}, Qi, { width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(g, y) {
          var b = y.column;
          return [g, { style: a({}, Qi, { width: b.totalWidth + "px" }) }];
        });
      };
      function Ji(s) {
        s.getTableProps.push(gs), s.getRowProps.push(eo), s.getHeaderGroupProps.push(eo), s.getFooterGroupProps.push(eo), s.getHeaderProps.push(ms), s.getCellProps.push(ys), s.getFooterProps.push(bs);
      }
      wa.pluginName = "useBlockLayout", Ji.pluginName = "useFlexLayout";
      var gs = function(s, g) {
        return [s, { style: { minWidth: g.instance.totalColumnsMinWidth + "px" } }];
      }, eo = function(s, g) {
        return [s, { style: { display: "flex", flex: "1 0 auto", minWidth: g.instance.totalColumnsMinWidth + "px" } }];
      }, ms = function(s, g) {
        var y = g.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      }, ys = function(s, g) {
        var y = g.cell;
        return [s, { style: { boxSizing: "border-box", flex: y.column.totalFlexWidth + " 0 auto", minWidth: y.column.totalMinWidth + "px", width: y.column.totalWidth + "px" } }];
      }, bs = function(s, g) {
        var y = g.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      };
      function xa(s) {
        s.stateReducers.push(Ca), s.getTableProps.push(_a), s.getHeaderProps.push(Sa), s.getRowProps.push(Ra);
      }
      c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize", xa.pluginName = "useGridLayout";
      var _a = function(s, g) {
        var y = g.instance;
        return [s, { style: { display: "grid", gridTemplateColumns: y.visibleColumns.map(function(b) {
          var E;
          return y.state.gridLayout.columnWidths[b.id] ? y.state.gridLayout.columnWidths[b.id] + "px" : (E = y.state.columnResizing) != null && E.isResizingColumn ? y.state.gridLayout.startWidths[b.id] + "px" : typeof b.width == "number" ? b.width + "px" : b.width;
        }).join(" ") } }];
      }, Sa = function(s, g) {
        var y = g.column;
        return [s, { id: "header-cell-" + y.id, style: { position: "sticky", gridColumn: "span " + y.totalVisibleHeaderCount } }];
      }, Ra = function(s, g) {
        var y = g.row;
        return y.isExpanded ? [s, { style: { gridColumn: "1 / " + (y.cells.length + 1) } }] : [s, {}];
      };
      function Ca(s, g, y, b) {
        if (g.type === c.init)
          return a({ gridLayout: { columnWidths: {} } }, s);
        if (g.type === c.resetResize)
          return a({}, s, { gridLayout: { columnWidths: {} } });
        if (g.type === c.columnStartResizing) {
          var E = g.columnId, R = g.headerIdWidths, A = to(E);
          if (A !== void 0) {
            var j = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = to(Qe.id), Ee));
            }, {}), W = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.minWidth, Ee));
            }, {}), U = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.maxWidth, Ee));
            }, {}), se = R.map(function(le) {
              var Qe = le[0];
              return [Qe, to(Qe)];
            });
            return a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: j, minWidths: W, maxWidths: U, headerIdGridWidths: se, columnWidth: A }) });
          }
          return s;
        }
        if (g.type === c.columnResizing) {
          var ie = g.clientX, oe = s.columnResizing.startX, Y = s.gridLayout, ne = Y.columnWidth, me = Y.minWidths, xe = Y.maxWidths, $e = Y.headerIdGridWidths, Je = (ie - oe) / ne, Fe = {};
          return ($e === void 0 ? [] : $e).forEach(function(le) {
            var Qe = le[0], Ee = le[1];
            Fe[Qe] = Math.min(Math.max(me[Qe], Ee + Ee * Je), xe[Qe]);
          }), a({}, s, { gridLayout: a({}, s.gridLayout, { columnWidths: a({}, s.gridLayout.columnWidths, {}, Fe) }) });
        }
        return g.type === c.columnDoneResizing ? a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: {}, minWidths: {}, maxWidths: {} }) }) : void 0;
      }
      function to(s) {
        var g, y = (g = document.getElementById("header-cell-" + s)) == null ? void 0 : g.offsetWidth;
        if (y !== void 0)
          return y;
      }
      n._UNSTABLE_usePivotColumns = qi, n.actions = c, n.defaultColumn = w, n.defaultGroupByFn = ln, n.defaultOrderByFn = oa, n.defaultRenderer = h, n.emptyRenderer = p, n.ensurePluginOrder = k, n.flexRender = te, n.functionalUpdate = F, n.loopHooks = I, n.makePropGetter = _, n.makeRenderer = D, n.reduceHooks = T, n.safeUseLayoutEffect = G, n.useAbsoluteLayout = ba, n.useAsyncDebounce = function(s, g) {
        g === void 0 && (g = 0);
        var y = r.useRef({}), b = N(s), E = N(g);
        return r.useCallback(function() {
          var R = o(regeneratorRuntime.mark(function A() {
            var j, W, U, se = arguments;
            return regeneratorRuntime.wrap(function(ie) {
              for (; ; )
                switch (ie.prev = ie.next) {
                  case 0:
                    for (j = se.length, W = new Array(j), U = 0; U < j; U++)
                      W[U] = se[U];
                    return y.current.promise || (y.current.promise = new Promise(function(oe, Y) {
                      y.current.resolve = oe, y.current.reject = Y;
                    })), y.current.timeout && clearTimeout(y.current.timeout), y.current.timeout = setTimeout(o(regeneratorRuntime.mark(function oe() {
                      return regeneratorRuntime.wrap(function(Y) {
                        for (; ; )
                          switch (Y.prev = Y.next) {
                            case 0:
                              return delete y.current.timeout, Y.prev = 1, Y.t0 = y.current, Y.next = 5, b().apply(void 0, W);
                            case 5:
                              Y.t1 = Y.sent, Y.t0.resolve.call(Y.t0, Y.t1), Y.next = 12;
                              break;
                            case 9:
                              Y.prev = 9, Y.t2 = Y.catch(1), y.current.reject(Y.t2);
                            case 12:
                              return Y.prev = 12, delete y.current.promise, Y.finish(12);
                            case 15:
                            case "end":
                              return Y.stop();
                          }
                      }, oe, null, [[1, 9, 12, 15]]);
                    })), E()), ie.abrupt("return", y.current.promise);
                  case 5:
                  case "end":
                    return ie.stop();
                }
            }, A);
          }));
          return function() {
            return R.apply(this, arguments);
          };
        }(), [b, E]);
      }, n.useBlockLayout = wa, n.useColumnOrder = va, n.useExpanded = ir, n.useFilters = wr, n.useFlexLayout = Ji, n.useGetLatest = N, n.useGlobalFilter = O, n.useGridLayout = xa, n.useGroupBy = rt, n.useMountedLayoutEffect = M, n.usePagination = Vi, n.useResizeColumns = ya, n.useRowSelect = la, n.useRowState = Xi, n.useSortBy = ia, n.useTable = function(s) {
        for (var g = arguments.length, y = new Array(g > 1 ? g - 1 : 0), b = 1; b < g; b++)
          y[b - 1] = arguments[b];
        s = xn(s), y = [gt].concat(y);
        var E = r.useRef({}), R = N(E.current);
        Object.assign(R(), a({}, s, { plugins: y, hooks: B() })), y.filter(Boolean).forEach(function(x) {
          x(R().hooks);
        });
        var A = N(R().hooks);
        R().getHooks = A, delete R().hooks, Object.assign(R(), T(A().useOptions, xn(s)));
        var j = R(), W = j.data, U = j.columns, se = j.initialState, ie = j.defaultColumn, oe = j.getSubRows, Y = j.getRowId, ne = j.stateReducer, me = j.useControlledState, xe = N(ne), $e = r.useCallback(function(x, $) {
          if (!$.type)
            throw console.info({ action: $ }), new Error("Unknown Action \u{1F446}");
          return [].concat(A().stateReducers, Array.isArray(xe()) ? xe() : [xe()]).reduce(function(z, H) {
            return H(z, $, x, R()) || z;
          }, x);
        }, [A, xe, R]), Je = r.useReducer($e, void 0, function() {
          return $e(se, { type: c.init });
        }), Fe = Je[0], le = Je[1], Qe = T([].concat(A().useControlledState, [me]), Fe, { instance: R() });
        Object.assign(R(), { state: Qe, dispatch: le });
        var Ee = r.useMemo(function() {
          return Q(T(A().columns, U, { instance: R() }));
        }, [A, R, U].concat(T(A().columnsDeps, [], { instance: R() })));
        R().columns = Ee;
        var Ye = r.useMemo(function() {
          return T(A().allColumns, fe(Ee), { instance: R() }).map(ge);
        }, [Ee, A, R].concat(T(A().allColumnsDeps, [], { instance: R() })));
        R().allColumns = Ye;
        var ft = r.useMemo(function() {
          for (var x = [], $ = [], z = {}, H = [].concat(Ye); H.length; ) {
            var q = H.shift();
            Mn({ data: W, rows: x, flatRows: $, rowsById: z, column: q, getRowId: Y, getSubRows: oe, accessValueHooks: A().accessValue, getInstance: R });
          }
          return [x, $, z];
        }, [Ye, W, Y, oe, A, R]), je = ft[0], Ve = ft[1], yt = ft[2];
        Object.assign(R(), { rows: je, initialRows: [].concat(je), flatRows: Ve, rowsById: yt }), I(A().useInstanceAfterData, R());
        var Ke = r.useMemo(function() {
          return T(A().visibleColumns, Ye, { instance: R() }).map(function(x) {
            return re(x, ie);
          });
        }, [A, Ye, R, ie].concat(T(A().visibleColumnsDeps, [], { instance: R() })));
        Ye = r.useMemo(function() {
          var x = [].concat(Ke);
          return Ye.forEach(function($) {
            x.find(function(z) {
              return z.id === $.id;
            }) || x.push($);
          }), x;
        }, [Ye, Ke]), R().allColumns = Ye;
        var ht = r.useMemo(function() {
          return T(A().headerGroups, ee(Ke, ie), R());
        }, [A, Ke, ie, R].concat(T(A().headerGroupsDeps, [], { instance: R() })));
        R().headerGroups = ht;
        var l = r.useMemo(function() {
          return ht.length ? ht[0].headers : [];
        }, [ht]);
        R().headers = l, R().flatHeaders = ht.reduce(function(x, $) {
          return [].concat(x, $.headers);
        }, []), I(A().useInstanceBeforeDimensions, R());
        var d = Ke.filter(function(x) {
          return x.isVisible;
        }).map(function(x) {
          return x.id;
        }).sort().join("_");
        Ke = r.useMemo(function() {
          return Ke.filter(function(x) {
            return x.isVisible;
          });
        }, [Ke, d]), R().visibleColumns = Ke;
        var m = qt(l), v = m[0], S = m[1], C = m[2];
        return R().totalColumnsMinWidth = v, R().totalColumnsWidth = S, R().totalColumnsMaxWidth = C, I(A().useInstance, R()), [].concat(R().flatHeaders, R().allColumns).forEach(function(x) {
          x.render = D(R(), x), x.getHeaderProps = _(A().getHeaderProps, { instance: R(), column: x }), x.getFooterProps = _(A().getFooterProps, { instance: R(), column: x });
        }), R().headerGroups = r.useMemo(function() {
          return ht.filter(function(x, $) {
            return x.headers = x.headers.filter(function(z) {
              return z.headers ? function H(q) {
                return q.filter(function(pe) {
                  return pe.headers ? H(pe.headers) : pe.isVisible;
                }).length;
              }(z.headers) : z.isVisible;
            }), !!x.headers.length && (x.getHeaderGroupProps = _(A().getHeaderGroupProps, { instance: R(), headerGroup: x, index: $ }), x.getFooterGroupProps = _(A().getFooterGroupProps, { instance: R(), headerGroup: x, index: $ }), !0);
          });
        }, [ht, R, A]), R().footerGroups = [].concat(R().headerGroups).reverse(), R().prepareRow = r.useCallback(function(x) {
          x.getRowProps = _(A().getRowProps, { instance: R(), row: x }), x.allCells = Ye.map(function($) {
            var z = x.values[$.id], H = { column: $, row: x, value: z };
            return H.getCellProps = _(A().getCellProps, { instance: R(), cell: H }), H.render = D(R(), $, { row: x, cell: H, value: z }), H;
          }), x.cells = Ke.map(function($) {
            return x.allCells.find(function(z) {
              return z.column.id === $.id;
            });
          }), I(A().prepareRow, x, { instance: R() });
        }, [A, R, Ye, Ke]), R().getTableProps = _(A().getTableProps, { instance: R() }), R().getTableBodyProps = _(A().getTableBodyProps, { instance: R() }), I(A().useFinalInstance, R()), R();
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(za, za.exports)), za.exports;
}
var La = { exports: {} }, Zp;
function mP() {
  return Zp || (Zp = 1, function(e, t) {
    (function(n, r) {
      r(t, gn);
    })(xi, function(n, r) {
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      function i(l, d, m, v, S, C, x) {
        try {
          var $ = l[C](x), z = $.value;
        } catch (H) {
          m(H);
          return;
        }
        $.done ? d(z) : Promise.resolve(z).then(v, S);
      }
      function o(l) {
        return function() {
          var d = this, m = arguments;
          return new Promise(function(v, S) {
            var C = l.apply(d, m);
            function x(z) {
              i(C, v, S, x, $, "next", z);
            }
            function $(z) {
              i(C, v, S, x, $, "throw", z);
            }
            x(void 0);
          });
        };
      }
      function a() {
        return a = Object.assign || function(l) {
          for (var d = 1; d < arguments.length; d++) {
            var m = arguments[d];
            for (var v in m)
              Object.prototype.hasOwnProperty.call(m, v) && (l[v] = m[v]);
          }
          return l;
        }, a.apply(this, arguments);
      }
      function u(l, d) {
        if (l == null)
          return {};
        var m = {}, v = Object.keys(l), S, C;
        for (C = 0; C < v.length; C++)
          S = v[C], !(d.indexOf(S) >= 0) && (m[S] = l[S]);
        return m;
      }
      function f(l, d) {
        if (typeof l != "object" || l === null)
          return l;
        var m = l[Symbol.toPrimitive];
        if (m !== void 0) {
          var v = m.call(l, d || "default");
          if (typeof v != "object")
            return v;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (d === "string" ? String : Number)(l);
      }
      function c(l) {
        var d = f(l, "string");
        return typeof d == "symbol" ? d : String(d);
      }
      var h = "Renderer Error \u261D\uFE0F", p = {
        init: "init"
      }, w = function(d) {
        var m = d.value, v = m === void 0 ? "" : m;
        return v;
      }, P = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, _ = {
        Cell: w,
        width: 150,
        minWidth: 0,
        maxWidth: Number.MAX_SAFE_INTEGER
      };
      function T() {
        for (var l = arguments.length, d = new Array(l), m = 0; m < l; m++)
          d[m] = arguments[m];
        return d.reduce(function(v, S) {
          var C = S.style, x = S.className, $ = u(S, ["style", "className"]);
          return v = a({}, v, {}, $), C && (v.style = v.style ? a({}, v.style || {}, {}, C || {}) : C), x && (v.className = v.className ? v.className + " " + x : x), v.className === "" && delete v.className, v;
        }, {});
      }
      function I(l, d, m) {
        return typeof d == "function" ? I({}, d(l, m)) : Array.isArray(d) ? T.apply(void 0, [l].concat(d)) : T(l, d);
      }
      var k = function(d, m) {
        return m === void 0 && (m = {}), function(v) {
          return v === void 0 && (v = {}), [].concat(d, [v]).reduce(function(S, C) {
            return I(S, C, a({}, m, {
              userProps: v
            }));
          }, {});
        };
      }, F = function(d, m, v, S) {
        return v === void 0 && (v = {}), d.reduce(function(C, x) {
          var $ = x(C, v);
          if (!S && typeof $ > "u")
            throw console.info(x), new Error("React Table: A reducer hook \u261D\uFE0F just returned undefined! This is not allowed.");
          return $;
        }, m);
      }, N = function(d, m, v) {
        return v === void 0 && (v = {}), d.forEach(function(S) {
          var C = S(m, v);
          if (typeof C < "u")
            throw console.info(S, C), new Error("React Table: A loop-type hook \u261D\uFE0F just returned a value! This is not allowed.");
        });
      };
      function G(l, d, m, v) {
        if (v)
          throw new Error('Defining plugins in the "after" section of ensurePluginOrder is no longer supported (see plugin ' + m + ")");
        var S = l.findIndex(function(C) {
          return C.pluginName === m;
        });
        if (S === -1)
          throw new Error('The plugin "' + m + `" was not found in the plugin list!
This usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:

  ` + m + ".pluginName = '" + m + `'
`);
        d.forEach(function(C) {
          var x = l.findIndex(function($) {
            return $.pluginName === C;
          });
          if (x > -1 && x > S)
            throw new Error("React Table: The " + m + " plugin hook must be placed after the " + C + " plugin hook!");
        });
      }
      function M(l, d) {
        return typeof l == "function" ? l(d) : l;
      }
      function D(l) {
        var d = r.useRef();
        return d.current = l, r.useCallback(function() {
          return d.current;
        }, []);
      }
      var te = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function Q(l, d) {
        var m = r.useRef(!1);
        te(function() {
          m.current && l(), m.current = !0;
        }, d);
      }
      function fe(l, d) {
        d === void 0 && (d = 0);
        var m = r.useRef({}), v = D(l), S = D(d);
        return r.useCallback(
          /* @__PURE__ */ function() {
            var C = o(
              /* @__PURE__ */ regeneratorRuntime.mark(function x() {
                var $, z, H, q = arguments;
                return regeneratorRuntime.wrap(function(Z) {
                  for (; ; )
                    switch (Z.prev = Z.next) {
                      case 0:
                        for ($ = q.length, z = new Array($), H = 0; H < $; H++)
                          z[H] = q[H];
                        return m.current.promise || (m.current.promise = new Promise(function(ae, ve) {
                          m.current.resolve = ae, m.current.reject = ve;
                        })), m.current.timeout && clearTimeout(m.current.timeout), m.current.timeout = setTimeout(
                          /* @__PURE__ */ o(
                            /* @__PURE__ */ regeneratorRuntime.mark(function ae() {
                              return regeneratorRuntime.wrap(function(K) {
                                for (; ; )
                                  switch (K.prev = K.next) {
                                    case 0:
                                      return delete m.current.timeout, K.prev = 1, K.t0 = m.current, K.next = 5, v().apply(void 0, z);
                                    case 5:
                                      K.t1 = K.sent, K.t0.resolve.call(K.t0, K.t1), K.next = 12;
                                      break;
                                    case 9:
                                      K.prev = 9, K.t2 = K.catch(1), m.current.reject(K.t2);
                                    case 12:
                                      return K.prev = 12, delete m.current.promise, K.finish(12);
                                    case 15:
                                    case "end":
                                      return K.stop();
                                  }
                              }, ae, null, [[1, 9, 12, 15]]);
                            })
                          ),
                          S()
                        ), Z.abrupt("return", m.current.promise);
                      case 5:
                      case "end":
                        return Z.stop();
                    }
                }, x);
              })
            );
            return function() {
              return C.apply(this, arguments);
            };
          }(),
          [v, S]
        );
      }
      function ge(l, d, m) {
        return m === void 0 && (m = {}), function(v, S) {
          S === void 0 && (S = {});
          var C = typeof v == "string" ? d[v] : v;
          if (typeof C > "u")
            throw console.info(d), new Error(h);
          return re(C, a({}, l, {
            column: d
          }, m, {}, S));
        };
      }
      function re(l, d) {
        return ee(l) ? r.createElement(l, d) : l;
      }
      function ee(l) {
        return be(l) || typeof l == "function" || Oe(l);
      }
      function be(l) {
        return typeof l == "function" && function() {
          var d = Object.getPrototypeOf(l);
          return d.prototype && d.prototype.isReactComponent;
        }();
      }
      function Oe(l) {
        return typeof l == "object" && typeof l.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(l.$$typeof.description);
      }
      function ut(l, d, m) {
        return m === void 0 && (m = 0), l.map(function(v) {
          return v = a({}, v, {
            parent: d,
            depth: m
          }), st(v), v.columns && (v.columns = ut(v.columns, v, m + 1)), v;
        });
      }
      function Ue(l) {
        return Ce(l, "columns");
      }
      function st(l) {
        var d = l.id, m = l.accessor, v = l.Header;
        if (typeof m == "string") {
          d = d || m;
          var S = m.split(".");
          m = function(x) {
            return ue(x, S);
          };
        }
        if (!d && typeof v == "string" && v && (d = v), !d && l.columns)
          throw console.error(l), new Error('A column ID (or unique "Header" value) is required!');
        if (!d)
          throw console.error(l), new Error("A column ID (or string accessor) is required!");
        return Object.assign(l, {
          id: d,
          accessor: m
        }), l;
      }
      function lt(l, d) {
        if (!d)
          throw new Error();
        return Object.assign(l, a({
          Header: P,
          Footer: P
        }, _, {}, d, {}, l)), Object.assign(l, {
          originalWidth: l.width
        }), l;
      }
      function dt(l, d, m) {
        m === void 0 && (m = function() {
          return {};
        });
        for (var v = [], S = l, C = 0, x = function() {
          return C++;
        }, $ = function() {
          var H = {
            headers: []
          }, q = [], pe = S.some(function(Z) {
            return Z.parent;
          });
          S.forEach(function(Z) {
            var ae = [].concat(q).reverse()[0], ve;
            if (pe) {
              if (Z.parent)
                ve = a({}, Z.parent, {
                  originalId: Z.parent.id,
                  id: Z.parent.id + "_" + x(),
                  headers: [Z]
                }, m(Z));
              else {
                var K = Z.id + "_placeholder";
                ve = lt(a({
                  originalId: K,
                  id: Z.id + "_placeholder_" + x(),
                  placeholderOf: Z,
                  headers: [Z]
                }, m(Z)), d);
              }
              ae && ae.originalId === ve.originalId ? ae.headers.push(Z) : q.push(ve);
            }
            H.headers.push(Z);
          }), v.push(H), S = q;
        }; S.length; )
          $();
        return v.reverse();
      }
      var V = /* @__PURE__ */ new Map();
      function ue(l, d, m) {
        if (!d)
          return l;
        var v = typeof d == "function" ? d : JSON.stringify(d), S = V.get(v) || function() {
          var x = gt(d);
          return V.set(v, x), x;
        }(), C;
        try {
          C = S.reduce(function(x, $) {
            return x[$];
          }, l);
        } catch {
        }
        return typeof C < "u" ? C : m;
      }
      function Te() {
        for (var l = arguments.length, d = new Array(l), m = 0; m < l; m++)
          d[m] = arguments[m];
        for (var v = 0; v < d.length; v += 1)
          if (typeof d[v] < "u")
            return d[v];
      }
      function Ae(l) {
        if (typeof l == "function")
          return l;
      }
      function Ce(l, d) {
        var m = [], v = function S(C) {
          C.forEach(function(x) {
            x[d] ? S(x[d]) : m.push(x);
          });
        };
        return v(l), m;
      }
      function Re(l, d) {
        var m = d.manualExpandedKey, v = d.expanded, S = d.expandSubRows, C = S === void 0 ? !0 : S, x = [], $ = function z(H, q) {
          q === void 0 && (q = !0), H.isExpanded = H.original && H.original[m] || v[H.id], H.canExpand = H.subRows && !!H.subRows.length, q && x.push(H), H.subRows && H.subRows.length && H.isExpanded && H.subRows.forEach(function(pe) {
            return z(pe, C);
          });
        };
        return l.forEach(function(z) {
          return $(z);
        }), x;
      }
      function Ne(l, d, m) {
        return Ae(l) || d[l] || m[l] || m.text;
      }
      function Be(l, d, m) {
        return l ? l(d, m) : typeof d > "u";
      }
      function Le() {
        throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.");
      }
      var X = null;
      function ce() {
        if (typeof X == "boolean")
          return X;
        var l = !1;
        try {
          var d = {
            get passive() {
              return l = !0, !1;
            }
          };
          window.addEventListener("test", null, d), window.removeEventListener("test", null, d);
        } catch {
          l = !1;
        }
        return X = l, X;
      }
      var Ge = /\[/g, B = /\]/g;
      function gt(l) {
        return ct(l).map(function(d) {
          return String(d).replace(".", "_");
        }).join(".").replace(Ge, ".").replace(B, "").split(".");
      }
      function ct(l, d) {
        if (d === void 0 && (d = []), !Array.isArray(l))
          d.push(l);
        else
          for (var m = 0; m < l.length; m += 1)
            ct(l[m], d);
        return d;
      }
      var _t = function(d) {
        return a({
          role: "table"
        }, d);
      }, Ot = function(d) {
        return a({
          role: "rowgroup"
        }, d);
      }, Qt = function(d, m) {
        var v = m.column;
        return a({
          key: "header_" + v.id,
          colSpan: v.totalVisibleHeaderCount,
          role: "columnheader"
        }, d);
      }, un = function(d, m) {
        var v = m.column;
        return a({
          key: "footer_" + v.id,
          colSpan: v.totalVisibleHeaderCount
        }, d);
      }, yn = function(d, m) {
        var v = m.index;
        return a({
          key: "headerGroup_" + v,
          role: "row"
        }, d);
      }, bn = function(d, m) {
        var v = m.index;
        return a({
          key: "footerGroup_" + v
        }, d);
      }, wn = function(d, m) {
        var v = m.row;
        return a({
          key: "row_" + v.id,
          role: "row"
        }, d);
      }, zn = function(d, m) {
        var v = m.cell;
        return a({
          key: "cell_" + v.row.id + "_" + v.column.id,
          role: "cell"
        }, d);
      };
      function rr() {
        return {
          useOptions: [],
          stateReducers: [],
          useControlledState: [],
          columns: [],
          columnsDeps: [],
          allColumns: [],
          allColumnsDeps: [],
          accessValue: [],
          materializedColumns: [],
          materializedColumnsDeps: [],
          useInstanceAfterData: [],
          visibleColumns: [],
          visibleColumnsDeps: [],
          headerGroups: [],
          headerGroupsDeps: [],
          useInstanceBeforeDimensions: [],
          useInstance: [],
          prepareRow: [],
          getTableProps: [_t],
          getTableBodyProps: [Ot],
          getHeaderGroupProps: [yn],
          getFooterGroupProps: [bn],
          getHeaderProps: [Qt],
          getFooterProps: [un],
          getRowProps: [wn],
          getCellProps: [zn],
          useFinalInstance: []
        };
      }
      p.resetHiddenColumns = "resetHiddenColumns", p.toggleHideColumn = "toggleHideColumn", p.setHiddenColumns = "setHiddenColumns", p.toggleHideAllColumns = "toggleHideAllColumns";
      var Ln = function(d) {
        d.getToggleHiddenProps = [xn], d.getToggleHideAllColumnsProps = [qt], d.stateReducers.push(Mn), d.useInstanceBeforeDimensions.push(ir), d.headerGroupsDeps.push(function(m, v) {
          var S = v.instance;
          return [].concat(m, [S.state.hiddenColumns]);
        }), d.useInstance.push(mr);
      };
      Ln.pluginName = "useColumnVisibility";
      var xn = function(d, m) {
        var v = m.column;
        return [d, {
          onChange: function(C) {
            v.toggleHidden(!C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: v.isVisible,
          title: "Toggle Column Visible"
        }];
      }, qt = function(d, m) {
        var v = m.instance;
        return [d, {
          onChange: function(C) {
            v.toggleHideAllColumns(!C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: !v.allColumnsHidden && !v.state.hiddenColumns.length,
          title: "Toggle All Columns Hidden",
          indeterminate: !v.allColumnsHidden && v.state.hiddenColumns.length
        }];
      };
      function Mn(l, d, m, v) {
        if (d.type === p.init)
          return a({
            hiddenColumns: []
          }, l);
        if (d.type === p.resetHiddenColumns)
          return a({}, l, {
            hiddenColumns: v.initialState.hiddenColumns || []
          });
        if (d.type === p.toggleHideColumn) {
          var S = typeof d.value < "u" ? d.value : !l.hiddenColumns.includes(d.columnId), C = S ? [].concat(l.hiddenColumns, [d.columnId]) : l.hiddenColumns.filter(function($) {
            return $ !== d.columnId;
          });
          return a({}, l, {
            hiddenColumns: C
          });
        }
        if (d.type === p.setHiddenColumns)
          return a({}, l, {
            hiddenColumns: M(d.value, l.hiddenColumns)
          });
        if (d.type === p.toggleHideAllColumns) {
          var x = typeof d.value < "u" ? d.value : !l.hiddenColumns.length;
          return a({}, l, {
            hiddenColumns: x ? v.allColumns.map(function($) {
              return $.id;
            }) : []
          });
        }
      }
      function ir(l) {
        var d = l.headers, m = l.state.hiddenColumns, v = r.useRef(!1);
        v.current;
        var S = function x($, z) {
          $.isVisible = z && !m.includes($.id);
          var H = 0;
          return $.headers && $.headers.length ? $.headers.forEach(function(q) {
            return H += x(q, $.isVisible);
          }) : H = $.isVisible ? 1 : 0, $.totalVisibleHeaderCount = H, H;
        }, C = 0;
        d.forEach(function(x) {
          return C += S(x, !0);
        });
      }
      function mr(l) {
        var d = l.columns, m = l.flatHeaders, v = l.dispatch, S = l.allColumns, C = l.getHooks, x = l.state.hiddenColumns, $ = l.autoResetHiddenColumns, z = $ === void 0 ? !0 : $, H = D(l), q = S.length === x.length, pe = r.useCallback(function(Pe, De) {
          return v({
            type: p.toggleHideColumn,
            columnId: Pe,
            value: De
          });
        }, [v]), Z = r.useCallback(function(Pe) {
          return v({
            type: p.setHiddenColumns,
            value: Pe
          });
        }, [v]), ae = r.useCallback(function(Pe) {
          return v({
            type: p.toggleHideAllColumns,
            value: Pe
          });
        }, [v]), ve = k(C().getToggleHideAllColumnsProps, {
          instance: H()
        });
        m.forEach(function(Pe) {
          Pe.toggleHidden = function(De) {
            v({
              type: p.toggleHideColumn,
              columnId: Pe.id,
              value: De
            });
          }, Pe.getToggleHiddenProps = k(C().getToggleHiddenProps, {
            instance: H(),
            column: Pe
          });
        });
        var K = D(z);
        Q(function() {
          K() && v({
            type: p.resetHiddenColumns
          });
        }, [v, d]), Object.assign(l, {
          allColumnsHidden: q,
          toggleHideColumn: pe,
          setHiddenColumns: Z,
          toggleHideAllColumns: ae,
          getToggleHideAllColumnsProps: ve
        });
      }
      var yr = {}, or = {}, br = function(d, m, v) {
        return d;
      }, Gn = function(d, m) {
        return d.subRows || [];
      }, jn = function(d, m, v) {
        return "" + (v ? [v.id, m].join(".") : m);
      }, sn = function(d) {
        return d;
      };
      function _n(l) {
        var d = l.initialState, m = d === void 0 ? yr : d, v = l.defaultColumn, S = v === void 0 ? or : v, C = l.getSubRows, x = C === void 0 ? Gn : C, $ = l.getRowId, z = $ === void 0 ? jn : $, H = l.stateReducer, q = H === void 0 ? br : H, pe = l.useControlledState, Z = pe === void 0 ? sn : pe, ae = u(l, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]);
        return a({}, ae, {
          initialState: m,
          defaultColumn: S,
          getSubRows: x,
          getRowId: z,
          stateReducer: q,
          useControlledState: Z
        });
      }
      var On = function(d) {
        for (var m = arguments.length, v = new Array(m > 1 ? m - 1 : 0), S = 1; S < m; S++)
          v[S - 1] = arguments[S];
        d = _n(d), v = [Ln].concat(v);
        var C = r.useRef({}), x = D(C.current);
        Object.assign(x(), a({}, d, {
          plugins: v,
          hooks: rr()
        })), v.filter(Boolean).forEach(function(He) {
          He(x().hooks);
        });
        var $ = D(x().hooks);
        x().getHooks = $, delete x().hooks, Object.assign(x(), F($().useOptions, _n(d)));
        var z = x(), H = z.data, q = z.columns, pe = z.initialState, Z = z.defaultColumn, ae = z.getSubRows, ve = z.getRowId, K = z.stateReducer, Pe = z.useControlledState, De = D(K), We = r.useCallback(function(He, Nt) {
          if (!Nt.type)
            throw console.info({
              action: Nt
            }), new Error("Unknown Action \u{1F446}");
          return [].concat($().stateReducers, Array.isArray(De()) ? De() : [De()]).reduce(function(It, nn) {
            return nn(It, Nt, He, x()) || It;
          }, He);
        }, [$, De, x]), we = r.useReducer(We, void 0, function() {
          return We(pe, {
            type: p.init
          });
        }), Ze = we[0], it = we[1], _e = F([].concat($().useControlledState, [Pe]), Ze, {
          instance: x()
        });
        Object.assign(x(), {
          state: _e,
          dispatch: it
        });
        var ye = r.useMemo(function() {
          return ut(F($().columns, q, {
            instance: x()
          }));
        }, [$, x, q].concat(F($().columnsDeps, [], {
          instance: x()
        })));
        x().columns = ye;
        var Se = r.useMemo(function() {
          return F($().allColumns, Ue(ye), {
            instance: x()
          }).map(st);
        }, [ye, $, x].concat(F($().allColumnsDeps, [], {
          instance: x()
        })));
        x().allColumns = Se;
        var Ie = r.useMemo(function() {
          for (var He = [], Nt = [], It = {}, nn = [].concat(Se); nn.length; ) {
            var Dt = nn.shift();
            ar({
              data: H,
              rows: He,
              flatRows: Nt,
              rowsById: It,
              column: Dt,
              getRowId: ve,
              getSubRows: ae,
              accessValueHooks: $().accessValue,
              getInstance: x
            });
          }
          return [He, Nt, It];
        }, [Se, H, ve, ae, $, x]), et = Ie[0], tt = Ie[1], St = Ie[2];
        Object.assign(x(), {
          rows: et,
          initialRows: [].concat(et),
          flatRows: tt,
          rowsById: St
        }), N($().useInstanceAfterData, x());
        var Me = r.useMemo(function() {
          return F($().visibleColumns, Se, {
            instance: x()
          }).map(function(He) {
            return lt(He, Z);
          });
        }, [$, Se, x, Z].concat(F($().visibleColumnsDeps, [], {
          instance: x()
        })));
        Se = r.useMemo(function() {
          var He = [].concat(Me);
          return Se.forEach(function(Nt) {
            He.find(function(It) {
              return It.id === Nt.id;
            }) || He.push(Nt);
          }), He;
        }, [Se, Me]), x().allColumns = Se;
        {
          var Bt = Se.filter(function(He, Nt) {
            return Se.findIndex(function(It) {
              return It.id === He.id;
            }) !== Nt;
          });
          if (Bt.length)
            throw console.info(Se), new Error('Duplicate columns were found with ids: "' + Bt.map(function(He) {
              return He.id;
            }).join(", ") + '" in the columns array above');
        }
        var nt = r.useMemo(function() {
          return F($().headerGroups, dt(Me, Z), x());
        }, [$, Me, Z, x].concat(F($().headerGroupsDeps, [], {
          instance: x()
        })));
        x().headerGroups = nt;
        var qe = r.useMemo(function() {
          return nt.length ? nt[0].headers : [];
        }, [nt]);
        x().headers = qe, x().flatHeaders = nt.reduce(function(He, Nt) {
          return [].concat(He, Nt.headers);
        }, []), N($().useInstanceBeforeDimensions, x());
        var Xe = Me.filter(function(He) {
          return He.isVisible;
        }).map(function(He) {
          return He.id;
        }).sort().join("_");
        Me = r.useMemo(
          function() {
            return Me.filter(function(He) {
              return He.isVisible;
            });
          },
          [Me, Xe]
        ), x().visibleColumns = Me;
        var Tt = An(qe), Gt = Tt[0], Vr = Tt[1], no = Tt[2];
        return x().totalColumnsMinWidth = Gt, x().totalColumnsWidth = Vr, x().totalColumnsMaxWidth = no, N($().useInstance, x()), [].concat(x().flatHeaders, x().allColumns).forEach(function(He) {
          He.render = ge(x(), He), He.getHeaderProps = k($().getHeaderProps, {
            instance: x(),
            column: He
          }), He.getFooterProps = k($().getFooterProps, {
            instance: x(),
            column: He
          });
        }), x().headerGroups = r.useMemo(function() {
          return nt.filter(function(He, Nt) {
            return He.headers = He.headers.filter(function(It) {
              var nn = function Dt(xr) {
                return xr.filter(function(Xt) {
                  return Xt.headers ? Dt(Xt.headers) : Xt.isVisible;
                }).length;
              };
              return It.headers ? nn(It.headers) : It.isVisible;
            }), He.headers.length ? (He.getHeaderGroupProps = k($().getHeaderGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Nt
            }), He.getFooterGroupProps = k($().getFooterGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Nt
            }), !0) : !1;
          });
        }, [nt, x, $]), x().footerGroups = [].concat(x().headerGroups).reverse(), x().prepareRow = r.useCallback(function(He) {
          He.getRowProps = k($().getRowProps, {
            instance: x(),
            row: He
          }), He.allCells = Se.map(function(Nt) {
            var It = He.values[Nt.id], nn = {
              column: Nt,
              row: He,
              value: It
            };
            return nn.getCellProps = k($().getCellProps, {
              instance: x(),
              cell: nn
            }), nn.render = ge(x(), Nt, {
              row: He,
              cell: nn,
              value: It
            }), nn;
          }), He.cells = Me.map(function(Nt) {
            return He.allCells.find(function(It) {
              return It.column.id === Nt.id;
            });
          }), N($().prepareRow, He, {
            instance: x()
          });
        }, [$, x, Se, Me]), x().getTableProps = k($().getTableProps, {
          instance: x()
        }), x().getTableBodyProps = k($().getTableBodyProps, {
          instance: x()
        }), N($().useFinalInstance, x()), x();
      };
      function An(l, d) {
        d === void 0 && (d = 0);
        var m = 0, v = 0, S = 0, C = 0;
        return l.forEach(function(x) {
          var $ = x.headers;
          if (x.totalLeft = d, $ && $.length) {
            var z = An($, d), H = z[0], q = z[1], pe = z[2], Z = z[3];
            x.totalMinWidth = H, x.totalWidth = q, x.totalMaxWidth = pe, x.totalFlexWidth = Z;
          } else
            x.totalMinWidth = x.minWidth, x.totalWidth = Math.min(Math.max(x.minWidth, x.width), x.maxWidth), x.totalMaxWidth = x.maxWidth, x.totalFlexWidth = x.canResize ? x.totalWidth : 0;
          x.isVisible && (d += x.totalWidth, m += x.totalMinWidth, v += x.totalWidth, S += x.totalMaxWidth, C += x.totalFlexWidth);
        }), [m, v, S, C];
      }
      function ar(l) {
        var d = l.data, m = l.rows, v = l.flatRows, S = l.rowsById, C = l.column, x = l.getRowId, $ = l.getSubRows, z = l.accessValueHooks, H = l.getInstance, q = function pe(Z, ae, ve, K, Pe) {
          ve === void 0 && (ve = 0);
          var De = Z, We = x(Z, ae, K), we = S[We];
          if (we)
            we.subRows && we.originalSubRows.forEach(function(it, _e) {
              return pe(it, _e, ve + 1, we);
            });
          else if (we = {
            id: We,
            original: De,
            index: ae,
            depth: ve,
            cells: [{}]
          }, we.cells.map = Le, we.cells.filter = Le, we.cells.forEach = Le, we.cells[0].getCellProps = Le, we.values = {}, Pe.push(we), v.push(we), S[We] = we, we.originalSubRows = $(Z, ae), we.originalSubRows) {
            var Ze = [];
            we.originalSubRows.forEach(function(it, _e) {
              return pe(it, _e, ve + 1, we, Ze);
            }), we.subRows = Ze;
          }
          C.accessor && (we.values[C.id] = C.accessor(Z, ae, we, Pe, d)), we.values[C.id] = F(z, we.values[C.id], {
            row: we,
            column: C,
            instance: H()
          }, !0);
        };
        d.forEach(function(pe, Z) {
          return q(pe, Z, 0, void 0, m);
        });
      }
      p.resetExpanded = "resetExpanded", p.toggleRowExpanded = "toggleRowExpanded", p.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var kn = function(d) {
        d.getToggleAllRowsExpandedProps = [ur], d.getToggleRowExpandedProps = [Hn], d.stateReducers.push(Wn), d.useInstance.push(Sn), d.prepareRow.push(wr);
      };
      kn.pluginName = "useExpanded";
      var ur = function(d, m) {
        var v = m.instance;
        return [d, {
          onClick: function(C) {
            v.toggleAllRowsExpanded();
          },
          style: {
            cursor: "pointer"
          },
          title: "Toggle All Rows Expanded"
        }];
      }, Hn = function(d, m) {
        var v = m.row;
        return [d, {
          onClick: function() {
            v.toggleRowExpanded();
          },
          style: {
            cursor: "pointer"
          },
          title: "Toggle Row Expanded"
        }];
      };
      function Wn(l, d, m, v) {
        if (d.type === p.init)
          return a({
            expanded: {}
          }, l);
        if (d.type === p.resetExpanded)
          return a({}, l, {
            expanded: v.initialState.expanded || {}
          });
        if (d.type === p.toggleAllRowsExpanded) {
          var S = d.value, C = v.rowsById, x = Object.keys(C).length === Object.keys(l.expanded).length, $ = typeof S < "u" ? S : !x;
          if ($) {
            var z = {};
            return Object.keys(C).forEach(function(Pe) {
              z[Pe] = !0;
            }), a({}, l, {
              expanded: z
            });
          }
          return a({}, l, {
            expanded: {}
          });
        }
        if (d.type === p.toggleRowExpanded) {
          var H = d.id, q = d.value, pe = l.expanded[H], Z = typeof q < "u" ? q : !pe;
          if (!pe && Z) {
            var ae;
            return a({}, l, {
              expanded: a({}, l.expanded, (ae = {}, ae[H] = !0, ae))
            });
          } else if (pe && !Z) {
            var ve = l.expanded;
            ve[H];
            var K = u(ve, [H].map(c));
            return a({}, l, {
              expanded: K
            });
          } else
            return l;
        }
      }
      function Sn(l) {
        var d = l.data, m = l.rows, v = l.rowsById, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.paginateExpandedRows, $ = x === void 0 ? !0 : x, z = l.expandSubRows, H = z === void 0 ? !0 : z, q = l.autoResetExpanded, pe = q === void 0 ? !0 : q, Z = l.getHooks, ae = l.plugins, ve = l.state.expanded, K = l.dispatch;
        G(ae, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var Pe = D(pe), De = Boolean(Object.keys(v).length && Object.keys(ve).length);
        De && Object.keys(v).some(function(Se) {
          return !ve[Se];
        }) && (De = !1), Q(function() {
          Pe() && K({
            type: p.resetExpanded
          });
        }, [K, d]);
        var We = r.useCallback(function(Se, Ie) {
          K({
            type: p.toggleRowExpanded,
            id: Se,
            value: Ie
          });
        }, [K]), we = r.useCallback(function(Se) {
          return K({
            type: p.toggleAllRowsExpanded,
            value: Se
          });
        }, [K]), Ze = r.useMemo(function() {
          return $ ? Re(m, {
            manualExpandedKey: C,
            expanded: ve,
            expandSubRows: H
          }) : m;
        }, [$, m, C, ve, H]), it = r.useMemo(function() {
          return Lt(ve);
        }, [ve]), _e = D(l), ye = k(Z().getToggleAllRowsExpandedProps, {
          instance: _e()
        });
        Object.assign(l, {
          preExpandedRows: m,
          expandedRows: Ze,
          rows: Ze,
          expandedDepth: it,
          isAllRowsExpanded: De,
          toggleRowExpanded: We,
          toggleAllRowsExpanded: we,
          getToggleAllRowsExpandedProps: ye
        });
      }
      function wr(l, d) {
        var m = d.instance.getHooks, v = d.instance;
        l.toggleRowExpanded = function(S) {
          return v.toggleRowExpanded(l.id, S);
        }, l.getToggleRowExpandedProps = k(m().getToggleRowExpandedProps, {
          instance: v,
          row: l
        });
      }
      function Lt(l) {
        var d = 0;
        return Object.keys(l).forEach(function(m) {
          var v = m.split(".");
          d = Math.max(d, v.length);
        }), d;
      }
      var Yt = function(d, m, v) {
        return d = d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return String(x).toLowerCase().includes(String(v).toLowerCase());
          });
        }), d;
      };
      Yt.autoRemove = function(l) {
        return !l;
      };
      var O = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x).toLowerCase() === String(v).toLowerCase() : !0;
          });
        });
      };
      O.autoRemove = function(l) {
        return !l;
      };
      var J = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x) === String(v) : !0;
          });
        });
      };
      J.autoRemove = function(l) {
        return !l;
      };
      var he = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x.includes(v);
          });
        });
      };
      he.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ze = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x && x.length && v.every(function($) {
              return x.includes($);
            });
          });
        });
      };
      ze.autoRemove = function(l) {
        return !l || !l.length;
      };
      var pt = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x && x.length && v.some(function($) {
              return x.includes($);
            });
          });
        });
      };
      pt.autoRemove = function(l) {
        return !l || !l.length;
      };
      var mt = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return v.includes(x);
          });
        });
      };
      mt.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ot = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x === v;
          });
        });
      };
      ot.autoRemove = function(l) {
        return typeof l > "u";
      };
      var rt = function(d, m, v) {
        return d.filter(function(S) {
          return m.some(function(C) {
            var x = S.values[C];
            return x == v;
          });
        });
      };
      rt.autoRemove = function(l) {
        return l == null;
      };
      var At = function(d, m, v) {
        var S = v || [], C = S[0], x = S[1];
        if (C = typeof C == "number" ? C : -1 / 0, x = typeof x == "number" ? x : 1 / 0, C > x) {
          var $ = C;
          C = x, x = $;
        }
        return d.filter(function(z) {
          return m.some(function(H) {
            var q = z.values[H];
            return q >= C && q <= x;
          });
        });
      };
      At.autoRemove = function(l) {
        return !l || typeof l[0] != "number" && typeof l[1] != "number";
      };
      var Pt = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        text: Yt,
        exactText: O,
        exactTextCase: J,
        includes: he,
        includesAll: ze,
        includesSome: pt,
        includesValue: mt,
        exact: ot,
        equals: rt,
        between: At
      });
      p.resetFilters = "resetFilters", p.setFilter = "setFilter", p.setAllFilters = "setAllFilters";
      var Et = function(d) {
        d.stateReducers.push(pn), d.useInstance.push(Un);
      };
      Et.pluginName = "useFilters";
      function pn(l, d, m, v) {
        if (d.type === p.init)
          return a({
            filters: []
          }, l);
        if (d.type === p.resetFilters)
          return a({}, l, {
            filters: v.initialState.filters || []
          });
        if (d.type === p.setFilter) {
          var S = d.columnId, C = d.filterValue, x = v.allColumns, $ = v.filterTypes, z = x.find(function(K) {
            return K.id === S;
          });
          if (!z)
            throw new Error("React-Table: Could not find a column with id: " + S);
          var H = Ne(z.filter, $ || {}, Pt), q = l.filters.find(function(K) {
            return K.id === S;
          }), pe = M(C, q && q.value);
          return Be(H.autoRemove, pe, z) ? a({}, l, {
            filters: l.filters.filter(function(K) {
              return K.id !== S;
            })
          }) : q ? a({}, l, {
            filters: l.filters.map(function(K) {
              return K.id === S ? {
                id: S,
                value: pe
              } : K;
            })
          }) : a({}, l, {
            filters: [].concat(l.filters, [{
              id: S,
              value: pe
            }])
          });
        }
        if (d.type === p.setAllFilters) {
          var Z = d.filters, ae = v.allColumns, ve = v.filterTypes;
          return a({}, l, {
            filters: M(Z, l.filters).filter(function(K) {
              var Pe = ae.find(function(We) {
                return We.id === K.id;
              }), De = Ne(Pe.filter, ve || {}, Pt);
              return !Be(De.autoRemove, K.value, Pe);
            })
          });
        }
      }
      function Un(l) {
        var d = l.data, m = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, $ = l.manualFilters, z = l.defaultCanFilter, H = z === void 0 ? !1 : z, q = l.disableFilters, pe = l.state.filters, Z = l.dispatch, ae = l.autoResetFilters, ve = ae === void 0 ? !0 : ae, K = r.useCallback(function(_e, ye) {
          Z({
            type: p.setFilter,
            columnId: _e,
            filterValue: ye
          });
        }, [Z]), Pe = r.useCallback(function(_e) {
          Z({
            type: p.setAllFilters,
            filters: _e
          });
        }, [Z]);
        C.forEach(function(_e) {
          var ye = _e.id, Se = _e.accessor, Ie = _e.defaultCanFilter, et = _e.disableFilters;
          _e.canFilter = Se ? Te(et === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(Ie, H, !1), _e.setFilter = function(St) {
            return K(_e.id, St);
          };
          var tt = pe.find(function(St) {
            return St.id === ye;
          });
          _e.filterValue = tt && tt.value;
        });
        var De = r.useMemo(function() {
          if ($ || !pe.length)
            return [m, v, S];
          var _e = [], ye = {}, Se = function Ie(et, tt) {
            tt === void 0 && (tt = 0);
            var St = et;
            return St = pe.reduce(function(Me, Bt) {
              var nt = Bt.id, qe = Bt.value, Xe = C.find(function(Gt) {
                return Gt.id === nt;
              });
              if (!Xe)
                return Me;
              tt === 0 && (Xe.preFilteredRows = Me);
              var Tt = Ne(Xe.filter, x || {}, Pt);
              return Tt ? (Xe.filteredRows = Tt(Me, [nt], qe), Xe.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + Xe.id + "."), Me);
            }, et), St.forEach(function(Me) {
              _e.push(Me), ye[Me.id] = Me, Me.subRows && (Me.subRows = Me.subRows && Me.subRows.length > 0 ? Ie(Me.subRows, tt + 1) : Me.subRows);
            }), St;
          };
          return [Se(m), _e, ye];
        }, [$, pe, m, v, S, C, x]), We = De[0], we = De[1], Ze = De[2];
        r.useMemo(function() {
          var _e = C.filter(function(ye) {
            return !pe.find(function(Se) {
              return Se.id === ye.id;
            });
          });
          _e.forEach(function(ye) {
            ye.preFilteredRows = We, ye.filteredRows = We;
          });
        }, [We, pe, C]);
        var it = D(ve);
        Q(function() {
          it() && Z({
            type: p.resetFilters
          });
        }, [Z, $ ? null : d]), Object.assign(l, {
          preFilteredRows: m,
          preFilteredFlatRows: v,
          preFilteredRowsById: S,
          filteredRows: We,
          filteredFlatRows: we,
          filteredRowsById: Ze,
          rows: We,
          flatRows: we,
          rowsById: Ze,
          setFilter: K,
          setAllFilters: Pe
        });
      }
      p.resetGlobalFilter = "resetGlobalFilter", p.setGlobalFilter = "setGlobalFilter";
      var Hr = function(d) {
        d.stateReducers.push(ln), d.useInstance.push(na);
      };
      Hr.pluginName = "useGlobalFilter";
      function ln(l, d, m, v) {
        if (d.type === p.resetGlobalFilter)
          return a({}, l, {
            globalFilter: v.initialState.globalFilter || void 0
          });
        if (d.type === p.setGlobalFilter) {
          var S = d.filterValue, C = v.userFilterTypes, x = Ne(v.globalFilter, C || {}, Pt), $ = M(S, l.globalFilter);
          if (Be(x.autoRemove, $)) {
            l.globalFilter;
            var z = u(l, ["globalFilter"]);
            return z;
          }
          return a({}, l, {
            globalFilter: $
          });
        }
      }
      function na(l) {
        var d = l.data, m = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, $ = l.globalFilter, z = l.manualGlobalFilter, H = l.state.globalFilter, q = l.dispatch, pe = l.autoResetGlobalFilter, Z = pe === void 0 ? !0 : pe, ae = l.disableGlobalFilter, ve = r.useCallback(function(Ze) {
          q({
            type: p.setGlobalFilter,
            filterValue: Ze
          });
        }, [q]), K = r.useMemo(function() {
          if (z || typeof H > "u")
            return [m, v, S];
          var Ze = [], it = {}, _e = Ne($, x || {}, Pt);
          if (!_e)
            return console.warn("Could not find a valid 'globalFilter' option."), m;
          C.forEach(function(Ie) {
            var et = Ie.disableGlobalFilter;
            Ie.canFilter = Te(et === !0 ? !1 : void 0, ae === !0 ? !1 : void 0, !0);
          });
          var ye = C.filter(function(Ie) {
            return Ie.canFilter === !0;
          }), Se = function Ie(et) {
            return et = _e(et, ye.map(function(tt) {
              return tt.id;
            }), H), et.forEach(function(tt) {
              Ze.push(tt), it[tt.id] = tt, tt.subRows = tt.subRows && tt.subRows.length ? Ie(tt.subRows) : tt.subRows;
            }), et;
          };
          return [Se(m), Ze, it];
        }, [z, H, $, x, C, m, v, S, ae]), Pe = K[0], De = K[1], We = K[2], we = D(Z);
        Q(function() {
          we() && q({
            type: p.resetGlobalFilter
          });
        }, [q, z ? null : d]), Object.assign(l, {
          preGlobalFilteredRows: m,
          preGlobalFilteredFlatRows: v,
          preGlobalFilteredRowsById: S,
          globalFilteredRows: Pe,
          globalFilteredFlatRows: De,
          globalFilteredRowsById: We,
          rows: Pe,
          flatRows: De,
          rowsById: We,
          setGlobalFilter: ve,
          disableGlobalFilter: ae
        });
      }
      function pi(l, d) {
        return d.reduce(function(m, v) {
          return m + (typeof v == "number" ? v : 0);
        }, 0);
      }
      function Wr(l) {
        var d = l[0] || 0;
        return l.forEach(function(m) {
          typeof m == "number" && (d = Math.min(d, m));
        }), d;
      }
      function ra(l) {
        var d = l[0] || 0;
        return l.forEach(function(m) {
          typeof m == "number" && (d = Math.max(d, m));
        }), d;
      }
      function Vu(l) {
        var d = l[0] || 0, m = l[0] || 0;
        return l.forEach(function(v) {
          typeof v == "number" && (d = Math.min(d, v), m = Math.max(m, v));
        }), d + ".." + m;
      }
      function ia(l) {
        return pi(null, l) / l.length;
      }
      function qu(l) {
        if (!l.length)
          return null;
        var d = Math.floor(l.length / 2), m = [].concat(l).sort(function(v, S) {
          return v - S;
        });
        return l.length % 2 !== 0 ? m[d] : (m[d - 1] + m[d]) / 2;
      }
      function Yu(l) {
        return Array.from(new Set(l).values());
      }
      function Xu(l) {
        return new Set(l).size;
      }
      function oa(l) {
        return l.length;
      }
      var Vi = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        sum: pi,
        min: Wr,
        max: ra,
        minMax: Vu,
        average: ia,
        median: qu,
        unique: Yu,
        uniqueCount: Xu,
        count: oa
      }), Ku = [], Qu = {};
      p.resetGroupBy = "resetGroupBy", p.setGroupBy = "setGroupBy", p.toggleGroupBy = "toggleGroupBy";
      var qi = function(d) {
        d.getGroupByToggleProps = [aa], d.stateReducers.push(Zu), d.visibleColumnsDeps.push(function(m, v) {
          var S = v.instance;
          return [].concat(m, [S.state.groupBy]);
        }), d.visibleColumns.push(Ju), d.useInstance.push(ts), d.prepareRow.push(ns);
      };
      qi.pluginName = "useGroupBy";
      var aa = function(d, m) {
        var v = m.header;
        return [d, {
          onClick: v.canGroupBy ? function(S) {
            S.persist(), v.toggleGroupBy();
          } : void 0,
          style: {
            cursor: v.canGroupBy ? "pointer" : void 0
          },
          title: "Toggle GroupBy"
        }];
      };
      function Zu(l, d, m, v) {
        if (d.type === p.init)
          return a({
            groupBy: []
          }, l);
        if (d.type === p.resetGroupBy)
          return a({}, l, {
            groupBy: v.initialState.groupBy || []
          });
        if (d.type === p.setGroupBy) {
          var S = d.value;
          return a({}, l, {
            groupBy: S
          });
        }
        if (d.type === p.toggleGroupBy) {
          var C = d.columnId, x = d.value, $ = typeof x < "u" ? x : !l.groupBy.includes(C);
          return $ ? a({}, l, {
            groupBy: [].concat(l.groupBy, [C])
          }) : a({}, l, {
            groupBy: l.groupBy.filter(function(z) {
              return z !== C;
            })
          });
        }
      }
      function Ju(l, d) {
        var m = d.instance.state.groupBy, v = m.map(function(C) {
          return l.find(function(x) {
            return x.id === C;
          });
        }).filter(Boolean), S = l.filter(function(C) {
          return !m.includes(C.id);
        });
        return l = [].concat(v, S), l.forEach(function(C) {
          C.isGrouped = m.includes(C.id), C.groupedIndex = m.indexOf(C.id);
        }), l;
      }
      var es = {};
      function ts(l) {
        var d = l.data, m = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.flatHeaders, $ = l.groupByFn, z = $ === void 0 ? ua : $, H = l.manualGroupBy, q = l.aggregations, pe = q === void 0 ? es : q, Z = l.plugins, ae = l.state.groupBy, ve = l.dispatch, K = l.autoResetGroupBy, Pe = K === void 0 ? !0 : K, De = l.disableGroupBy, We = l.defaultCanGroupBy, we = l.getHooks;
        G(Z, ["useColumnOrder", "useFilters"], "useGroupBy");
        var Ze = D(l);
        C.forEach(function(qe) {
          var Xe = qe.accessor, Tt = qe.defaultGroupBy, Gt = qe.disableGroupBy;
          qe.canGroupBy = Xe ? Te(qe.canGroupBy, Gt === !0 ? !1 : void 0, De === !0 ? !1 : void 0, !0) : Te(qe.canGroupBy, Tt, We, !1), qe.canGroupBy && (qe.toggleGroupBy = function() {
            return l.toggleGroupBy(qe.id);
          }), qe.Aggregated = qe.Aggregated || qe.Cell;
        });
        var it = r.useCallback(function(qe, Xe) {
          ve({
            type: p.toggleGroupBy,
            columnId: qe,
            value: Xe
          });
        }, [ve]), _e = r.useCallback(function(qe) {
          ve({
            type: p.setGroupBy,
            value: qe
          });
        }, [ve]);
        x.forEach(function(qe) {
          qe.getGroupByToggleProps = k(we().getGroupByToggleProps, {
            instance: Ze(),
            header: qe
          });
        });
        var ye = r.useMemo(function() {
          if (H || !ae.length)
            return [m, v, S, Ku, Qu, v, S];
          var qe = ae.filter(function(Dt) {
            return C.find(function(xr) {
              return xr.id === Dt;
            });
          }), Xe = function(xr, Xt, Pa) {
            var _r = {};
            return C.forEach(function(kt) {
              if (qe.includes(kt.id)) {
                _r[kt.id] = Xt[0] ? Xt[0].values[kt.id] : null;
                return;
              }
              var Ta = typeof kt.aggregate == "function" ? kt.aggregate : pe[kt.aggregate] || Vi[kt.aggregate];
              if (Ta) {
                var vi = Xt.map(function(qr) {
                  return qr.values[kt.id];
                }), ws = xr.map(function(qr) {
                  var Sr = qr.values[kt.id];
                  if (!Pa && kt.aggregateValue) {
                    var Rr = typeof kt.aggregateValue == "function" ? kt.aggregateValue : pe[kt.aggregateValue] || Vi[kt.aggregateValue];
                    if (!Rr)
                      throw console.info({
                        column: kt
                      }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                    Sr = Rr(Sr, qr, kt);
                  }
                  return Sr;
                });
                _r[kt.id] = Ta(ws, vi);
              } else {
                if (kt.aggregate)
                  throw console.info({
                    column: kt
                  }), new Error("React Table: Invalid column.aggregate option for column listed above");
                _r[kt.id] = null;
              }
            }), _r;
          }, Tt = [], Gt = {}, Vr = [], no = {}, He = [], Nt = {}, It = function Dt(xr, Xt, Pa) {
            if (Xt === void 0 && (Xt = 0), Xt === qe.length)
              return xr.map(function(vi) {
                return a({}, vi, {
                  depth: Xt
                });
              });
            var _r = qe[Xt], kt = z(xr, _r), Ta = Object.entries(kt).map(function(vi, ws) {
              var qr = vi[0], Sr = vi[1], Rr = _r + ":" + qr;
              Rr = Pa ? Pa + ">" + Rr : Rr;
              var Mf = Dt(Sr, Xt + 1, Rr), Of = Xt ? Ce(Sr, "leafRows") : Sr, Em = Xe(Of, Sr, Xt), Mm = {
                id: Rr,
                isGrouped: !0,
                groupByID: _r,
                groupByVal: qr,
                values: Em,
                subRows: Mf,
                leafRows: Of,
                depth: Xt,
                index: ws
              };
              return Mf.forEach(function(Vn) {
                Tt.push(Vn), Gt[Vn.id] = Vn, Vn.isGrouped ? (Vr.push(Vn), no[Vn.id] = Vn) : (He.push(Vn), Nt[Vn.id] = Vn);
              }), Mm;
            });
            return Ta;
          }, nn = It(m);
          return nn.forEach(function(Dt) {
            Tt.push(Dt), Gt[Dt.id] = Dt, Dt.isGrouped ? (Vr.push(Dt), no[Dt.id] = Dt) : (He.push(Dt), Nt[Dt.id] = Dt);
          }), [nn, Tt, Gt, Vr, no, He, Nt];
        }, [H, ae, m, v, S, C, pe, z]), Se = ye[0], Ie = ye[1], et = ye[2], tt = ye[3], St = ye[4], Me = ye[5], Bt = ye[6], nt = D(Pe);
        Q(function() {
          nt() && ve({
            type: p.resetGroupBy
          });
        }, [ve, H ? null : d]), Object.assign(l, {
          preGroupedRows: m,
          preGroupedFlatRow: v,
          preGroupedRowsById: S,
          groupedRows: Se,
          groupedFlatRows: Ie,
          groupedRowsById: et,
          onlyGroupedFlatRows: tt,
          onlyGroupedRowsById: St,
          nonGroupedFlatRows: Me,
          nonGroupedRowsById: Bt,
          rows: Se,
          flatRows: Ie,
          rowsById: et,
          toggleGroupBy: it,
          setGroupBy: _e
        });
      }
      function ns(l) {
        l.allCells.forEach(function(d) {
          var m;
          d.isGrouped = d.column.isGrouped && d.column.id === l.groupByID, d.isPlaceholder = !d.isGrouped && d.column.isGrouped, d.isAggregated = !d.isGrouped && !d.isPlaceholder && ((m = l.subRows) == null ? void 0 : m.length);
        });
      }
      function ua(l, d) {
        return l.reduce(function(m, v, S) {
          var C = "" + v.values[d];
          return m[C] = Array.isArray(m[C]) ? m[C] : [], m[C].push(v), m;
        }, {});
      }
      var sa = /([0-9]+)/gm, rs = function(d, m, v) {
        var S = Ur(d, m, v), C = S[0], x = S[1];
        for (C = ca(C), x = ca(x), C = C.split(sa).filter(Boolean), x = x.split(sa).filter(Boolean); C.length && x.length; ) {
          var $ = C.shift(), z = x.shift(), H = parseInt($, 10), q = parseInt(z, 10), pe = [H, q].sort();
          if (isNaN(pe[0])) {
            if ($ > z)
              return 1;
            if (z > $)
              return -1;
            continue;
          }
          if (isNaN(pe[1]))
            return isNaN(H) ? -1 : 1;
          if (H > q)
            return 1;
          if (q > H)
            return -1;
        }
        return C.length - x.length;
      };
      function is(l, d, m) {
        var v = Ur(l, d, m), S = v[0], C = v[1];
        return S = S.getTime(), C = C.getTime(), Yi(S, C);
      }
      function os(l, d, m) {
        var v = Ur(l, d, m), S = v[0], C = v[1];
        return Yi(S, C);
      }
      function as(l, d, m) {
        var v = Ur(l, d, m), S = v[0], C = v[1];
        for (S = S.split("").filter(Boolean), C = C.split("").filter(Boolean); S.length && C.length; ) {
          var x = S.shift(), $ = C.shift(), z = x.toLowerCase(), H = $.toLowerCase();
          if (z > H)
            return 1;
          if (H > z)
            return -1;
          if (x > $)
            return 1;
          if ($ > x)
            return -1;
        }
        return S.length - C.length;
      }
      function la(l, d, m) {
        var v = Ur(l, d, m), S = v[0], C = v[1], x = /[^0-9.]/gi;
        return S = Number(String(S).replace(x, "")), C = Number(String(C).replace(x, "")), Yi(S, C);
      }
      function Yi(l, d) {
        return l === d ? 0 : l > d ? 1 : -1;
      }
      function Ur(l, d, m) {
        return [l.values[m], d.values[m]];
      }
      function ca(l) {
        return typeof l == "number" ? isNaN(l) || l === 1 / 0 || l === -1 / 0 ? "" : String(l) : typeof l == "string" ? l : "";
      }
      var us = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        alphanumeric: rs,
        datetime: is,
        basic: os,
        string: as,
        number: la
      });
      p.resetSortBy = "resetSortBy", p.setSortBy = "setSortBy", p.toggleSortBy = "toggleSortBy", p.clearSortBy = "clearSortBy", _.sortType = "alphanumeric", _.sortDescFirst = !1;
      var fa = function(d) {
        d.getSortByToggleProps = [ss], d.stateReducers.push(da), d.useInstance.push(pa);
      };
      fa.pluginName = "useSortBy";
      var ss = function(d, m) {
        var v = m.instance, S = m.column, C = v.isMultiSortEvent, x = C === void 0 ? function($) {
          return $.shiftKey;
        } : C;
        return [d, {
          onClick: S.canSort ? function($) {
            $.persist(), S.toggleSortBy(void 0, !v.disableMultiSort && x($));
          } : void 0,
          style: {
            cursor: S.canSort ? "pointer" : void 0
          },
          title: S.canSort ? "Toggle SortBy" : void 0
        }];
      };
      function da(l, d, m, v) {
        if (d.type === p.init)
          return a({
            sortBy: []
          }, l);
        if (d.type === p.resetSortBy)
          return a({}, l, {
            sortBy: v.initialState.sortBy || []
          });
        if (d.type === p.clearSortBy) {
          var S = l.sortBy, C = S.filter(function(Se) {
            return Se.id !== d.columnId;
          });
          return a({}, l, {
            sortBy: C
          });
        }
        if (d.type === p.setSortBy) {
          var x = d.sortBy;
          return a({}, l, {
            sortBy: x
          });
        }
        if (d.type === p.toggleSortBy) {
          var $ = d.columnId, z = d.desc, H = d.multi, q = v.allColumns, pe = v.disableMultiSort, Z = v.disableSortRemove, ae = v.disableMultiRemove, ve = v.maxMultiSortColCount, K = ve === void 0 ? Number.MAX_SAFE_INTEGER : ve, Pe = l.sortBy, De = q.find(function(Se) {
            return Se.id === $;
          }), We = De.sortDescFirst, we = Pe.find(function(Se) {
            return Se.id === $;
          }), Ze = Pe.findIndex(function(Se) {
            return Se.id === $;
          }), it = typeof z < "u" && z !== null, _e = [], ye;
          return !pe && H ? we ? ye = "toggle" : ye = "add" : Ze !== Pe.length - 1 || Pe.length !== 1 ? ye = "replace" : we ? ye = "toggle" : ye = "replace", ye === "toggle" && !Z && !it && (H ? !ae : !0) && (we && we.desc && !We || !we.desc && We) && (ye = "remove"), ye === "replace" ? _e = [{
            id: $,
            desc: it ? z : We
          }] : ye === "add" ? (_e = [].concat(Pe, [{
            id: $,
            desc: it ? z : We
          }]), _e.splice(0, _e.length - K)) : ye === "toggle" ? _e = Pe.map(function(Se) {
            return Se.id === $ ? a({}, Se, {
              desc: it ? z : !we.desc
            }) : Se;
          }) : ye === "remove" && (_e = Pe.filter(function(Se) {
            return Se.id !== $;
          })), a({}, l, {
            sortBy: _e
          });
        }
      }
      function pa(l) {
        var d = l.data, m = l.rows, v = l.flatRows, S = l.allColumns, C = l.orderByFn, x = C === void 0 ? Xi : C, $ = l.sortTypes, z = l.manualSortBy, H = l.defaultCanSort, q = l.disableSortBy, pe = l.flatHeaders, Z = l.state.sortBy, ae = l.dispatch, ve = l.plugins, K = l.getHooks, Pe = l.autoResetSortBy, De = Pe === void 0 ? !0 : Pe;
        G(ve, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var We = r.useCallback(function(Ie) {
          ae({
            type: p.setSortBy,
            sortBy: Ie
          });
        }, [ae]), we = r.useCallback(function(Ie, et, tt) {
          ae({
            type: p.toggleSortBy,
            columnId: Ie,
            desc: et,
            multi: tt
          });
        }, [ae]), Ze = D(l);
        pe.forEach(function(Ie) {
          var et = Ie.accessor, tt = Ie.canSort, St = Ie.disableSortBy, Me = Ie.id, Bt = et ? Te(St === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(H, tt, !1);
          Ie.canSort = Bt, Ie.canSort && (Ie.toggleSortBy = function(qe, Xe) {
            return we(Ie.id, qe, Xe);
          }, Ie.clearSortBy = function() {
            ae({
              type: p.clearSortBy,
              columnId: Ie.id
            });
          }), Ie.getSortByToggleProps = k(K().getSortByToggleProps, {
            instance: Ze(),
            column: Ie
          });
          var nt = Z.find(function(qe) {
            return qe.id === Me;
          });
          Ie.isSorted = !!nt, Ie.sortedIndex = Z.findIndex(function(qe) {
            return qe.id === Me;
          }), Ie.isSortedDesc = Ie.isSorted ? nt.desc : void 0;
        });
        var it = r.useMemo(function() {
          if (z || !Z.length)
            return [m, v];
          var Ie = [], et = Z.filter(function(St) {
            return S.find(function(Me) {
              return Me.id === St.id;
            });
          }), tt = function St(Me) {
            var Bt = x(
              Me,
              et.map(function(nt) {
                var qe = S.find(function(Gt) {
                  return Gt.id === nt.id;
                });
                if (!qe)
                  throw new Error("React-Table: Could not find a column with id: " + nt.id + " while sorting");
                var Xe = qe.sortType, Tt = Ae(Xe) || ($ || {})[Xe] || us[Xe];
                if (!Tt)
                  throw new Error("React-Table: Could not find a valid sortType of '" + Xe + "' for column '" + nt.id + "'.");
                return function(Gt, Vr) {
                  return Tt(Gt, Vr, nt.id, nt.desc);
                };
              }),
              et.map(function(nt) {
                var qe = S.find(function(Xe) {
                  return Xe.id === nt.id;
                });
                return qe && qe.sortInverted ? nt.desc : !nt.desc;
              })
            );
            return Bt.forEach(function(nt) {
              Ie.push(nt), !(!nt.subRows || nt.subRows.length === 0) && (nt.subRows = St(nt.subRows));
            }), Bt;
          };
          return [tt(m), Ie];
        }, [z, Z, m, v, S, x, $]), _e = it[0], ye = it[1], Se = D(De);
        Q(function() {
          Se() && ae({
            type: p.resetSortBy
          });
        }, [z ? null : d]), Object.assign(l, {
          preSortedRows: m,
          preSortedFlatRows: v,
          sortedRows: _e,
          sortedFlatRows: ye,
          rows: _e,
          flatRows: ye,
          setSortBy: We,
          toggleSortBy: we
        });
      }
      function Xi(l, d, m) {
        return [].concat(l).sort(function(v, S) {
          for (var C = 0; C < d.length; C += 1) {
            var x = d[C], $ = m[C] === !1 || m[C] === "desc", z = x(v, S);
            if (z !== 0)
              return $ ? -z : z;
          }
          return m[0] ? v.index - S.index : S.index - v.index;
        });
      }
      var ls = "usePagination";
      p.resetPage = "resetPage", p.gotoPage = "gotoPage", p.setPageSize = "setPageSize";
      var ha = function(d) {
        d.stateReducers.push(cs), d.useInstance.push(va);
      };
      ha.pluginName = ls;
      function cs(l, d, m, v) {
        if (d.type === p.init)
          return a({
            pageSize: 10,
            pageIndex: 0
          }, l);
        if (d.type === p.resetPage)
          return a({}, l, {
            pageIndex: v.initialState.pageIndex || 0
          });
        if (d.type === p.gotoPage) {
          var S = v.pageCount, C = v.page, x = M(d.pageIndex, l.pageIndex), $ = !1;
          return x > l.pageIndex ? $ = S === -1 ? C.length >= l.pageSize : x < S : x < l.pageIndex && ($ = x > -1), $ ? a({}, l, {
            pageIndex: x
          }) : l;
        }
        if (d.type === p.setPageSize) {
          var z = d.pageSize, H = l.pageSize * l.pageIndex, q = Math.floor(H / z);
          return a({}, l, {
            pageIndex: q,
            pageSize: z
          });
        }
      }
      function va(l) {
        var d = l.rows, m = l.autoResetPage, v = m === void 0 ? !0 : m, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.plugins, $ = l.pageCount, z = l.paginateExpandedRows, H = z === void 0 ? !0 : z, q = l.expandSubRows, pe = q === void 0 ? !0 : q, Z = l.state, ae = Z.pageSize, ve = Z.pageIndex, K = Z.expanded, Pe = Z.globalFilter, De = Z.filters, We = Z.groupBy, we = Z.sortBy, Ze = l.dispatch, it = l.data, _e = l.manualPagination;
        G(x, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var ye = D(v);
        Q(function() {
          ye() && Ze({
            type: p.resetPage
          });
        }, [Ze, _e ? null : it, Pe, De, We, we]);
        var Se = _e ? $ : Math.ceil(d.length / ae), Ie = r.useMemo(function() {
          return Se > 0 ? [].concat(new Array(Se)).fill(null).map(function(Xe, Tt) {
            return Tt;
          }) : [];
        }, [Se]), et = r.useMemo(function() {
          var Xe;
          if (_e)
            Xe = d;
          else {
            var Tt = ae * ve, Gt = Tt + ae;
            Xe = d.slice(Tt, Gt);
          }
          return H ? Xe : Re(Xe, {
            manualExpandedKey: C,
            expanded: K,
            expandSubRows: pe
          });
        }, [pe, K, C, _e, ve, ae, H, d]), tt = ve > 0, St = Se === -1 ? et.length >= ae : ve < Se - 1, Me = r.useCallback(function(Xe) {
          Ze({
            type: p.gotoPage,
            pageIndex: Xe
          });
        }, [Ze]), Bt = r.useCallback(function() {
          return Me(function(Xe) {
            return Xe - 1;
          });
        }, [Me]), nt = r.useCallback(function() {
          return Me(function(Xe) {
            return Xe + 1;
          });
        }, [Me]), qe = r.useCallback(function(Xe) {
          Ze({
            type: p.setPageSize,
            pageSize: Xe
          });
        }, [Ze]);
        Object.assign(l, {
          pageOptions: Ie,
          pageCount: Se,
          page: et,
          canPreviousPage: tt,
          canNextPage: St,
          gotoPage: Me,
          previousPage: Bt,
          nextPage: nt,
          setPageSize: qe
        });
      }
      p.resetPivot = "resetPivot", p.togglePivot = "togglePivot";
      var ga = function(d) {
        d.getPivotToggleProps = [fs], d.stateReducers.push(ya), d.useInstanceAfterData.push(ds), d.allColumns.push(ps), d.accessValue.push(hs), d.materializedColumns.push(vs), d.materializedColumnsDeps.push(Ki), d.visibleColumns.push(ba), d.visibleColumnsDeps.push(hi), d.useInstance.push(Qi), d.prepareRow.push(Zi);
      };
      ga.pluginName = "usePivotColumns";
      var ma = [], fs = function(d, m) {
        var v = m.header;
        return [d, {
          onClick: v.canPivot ? function(S) {
            S.persist(), v.togglePivot();
          } : void 0,
          style: {
            cursor: v.canPivot ? "pointer" : void 0
          },
          title: "Toggle Pivot"
        }];
      };
      function ya(l, d, m, v) {
        if (d.type === p.init)
          return a({
            pivotColumns: ma
          }, l);
        if (d.type === p.resetPivot)
          return a({}, l, {
            pivotColumns: v.initialState.pivotColumns || ma
          });
        if (d.type === p.togglePivot) {
          var S = d.columnId, C = d.value, x = typeof C < "u" ? C : !l.pivotColumns.includes(S);
          return x ? a({}, l, {
            pivotColumns: [].concat(l.pivotColumns, [S])
          }) : a({}, l, {
            pivotColumns: l.pivotColumns.filter(function($) {
              return $ !== S;
            })
          });
        }
      }
      function ds(l) {
        l.allColumns.forEach(function(d) {
          d.isPivotSource = l.state.pivotColumns.includes(d.id);
        });
      }
      function ps(l, d) {
        var m = d.instance;
        return l.forEach(function(v) {
          v.isPivotSource = m.state.pivotColumns.includes(v.id), v.uniqueValues = /* @__PURE__ */ new Set();
        }), l;
      }
      function hs(l, d) {
        var m = d.column;
        return m.uniqueValues && typeof l < "u" && m.uniqueValues.add(l), l;
      }
      function vs(l, d) {
        var m = d.instance, v = m.allColumns, S = m.state;
        if (!S.pivotColumns.length || !S.groupBy || !S.groupBy.length)
          return l;
        var C = S.pivotColumns.map(function(H) {
          return v.find(function(q) {
            return q.id === H;
          });
        }).filter(Boolean), x = v.filter(function(H) {
          return !H.isPivotSource && !S.groupBy.includes(H.id) && !S.pivotColumns.includes(H.id);
        }), $ = function H(q, pe, Z) {
          q === void 0 && (q = 0), Z === void 0 && (Z = []);
          var ae = C[q];
          if (!ae)
            return x.map(function(K) {
              return a({}, K, {
                canPivot: !1,
                isPivoted: !0,
                parent: pe,
                depth: q,
                id: "" + (pe ? pe.id + "." + K.id : K.id),
                accessor: function(De, We, we) {
                  if (Z.every(function(Ze) {
                    return Ze(we);
                  }))
                    return we.values[K.id];
                }
              });
            });
          var ve = Array.from(ae.uniqueValues).sort();
          return ve.map(function(K) {
            var Pe = a({}, ae, {
              Header: ae.PivotHeader || typeof ae.header == "string" ? ae.Header + ": " + K : K,
              isPivotGroup: !0,
              parent: pe,
              depth: q,
              id: pe ? pe.id + "." + ae.id + "." + K : ae.id + "." + K,
              pivotValue: K
            });
            return Pe.columns = H(q + 1, Pe, [].concat(Z, [function(De) {
              return De.values[ae.id] === K;
            }])), Pe;
          });
        }, z = Ue($());
        return [].concat(l, z);
      }
      function Ki(l, d) {
        var m = d.instance.state, v = m.pivotColumns, S = m.groupBy;
        return [].concat(l, [v, S]);
      }
      function ba(l, d) {
        var m = d.instance.state;
        return l = l.filter(function(v) {
          return !v.isPivotSource;
        }), m.pivotColumns.length && m.groupBy && m.groupBy.length && (l = l.filter(function(v) {
          return v.isGrouped || v.isPivoted;
        })), l;
      }
      function hi(l, d) {
        var m = d.instance;
        return [].concat(l, [m.state.pivotColumns, m.state.groupBy]);
      }
      function Qi(l) {
        var d = l.columns, m = l.allColumns, v = l.flatHeaders, S = l.getHooks, C = l.plugins, x = l.dispatch, $ = l.autoResetPivot, z = $ === void 0 ? !0 : $, H = l.manaulPivot, q = l.disablePivot, pe = l.defaultCanPivot;
        G(C, ["useGroupBy"], "usePivotColumns");
        var Z = D(l);
        m.forEach(function(K) {
          var Pe = K.accessor, De = K.defaultPivot, We = K.disablePivot;
          K.canPivot = Pe ? Te(K.canPivot, We === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(K.canPivot, De, pe, !1), K.canPivot && (K.togglePivot = function() {
            return l.togglePivot(K.id);
          }), K.Aggregated = K.Aggregated || K.Cell;
        });
        var ae = function(Pe, De) {
          x({
            type: p.togglePivot,
            columnId: Pe,
            value: De
          });
        };
        v.forEach(function(K) {
          K.getPivotToggleProps = k(S().getPivotToggleProps, {
            instance: Z(),
            header: K
          });
        });
        var ve = D(z);
        Q(function() {
          ve() && x({
            type: p.resetPivot
          });
        }, [x, H ? null : d]), Object.assign(l, {
          togglePivot: ae
        });
      }
      function Zi(l) {
        l.allCells.forEach(function(d) {
          d.isPivoted = d.column.isPivoted;
        });
      }
      var wa = "useRowSelect";
      p.resetSelectedRows = "resetSelectedRows", p.toggleAllRowsSelected = "toggleAllRowsSelected", p.toggleRowSelected = "toggleRowSelected", p.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var Ji = function(d) {
        d.getToggleRowSelectedProps = [gs], d.getToggleAllRowsSelectedProps = [eo], d.getToggleAllPageRowsSelectedProps = [ms], d.stateReducers.push(ys), d.useInstance.push(bs), d.prepareRow.push(xa);
      };
      Ji.pluginName = wa;
      var gs = function(d, m) {
        var v = m.instance, S = m.row, C = v.manualRowSelectedKey, x = C === void 0 ? "isSelected" : C, $ = !1;
        return S.original && S.original[x] ? $ = !0 : $ = S.isSelected, [d, {
          onChange: function(H) {
            S.toggleRowSelected(H.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: $,
          title: "Toggle Row Selected",
          indeterminate: S.isSomeSelected
        }];
      }, eo = function(d, m) {
        var v = m.instance;
        return [d, {
          onChange: function(C) {
            v.toggleAllRowsSelected(C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: v.isAllRowsSelected,
          title: "Toggle All Rows Selected",
          indeterminate: Boolean(!v.isAllRowsSelected && Object.keys(v.state.selectedRowIds).length)
        }];
      }, ms = function(d, m) {
        var v = m.instance;
        return [d, {
          onChange: function(C) {
            v.toggleAllPageRowsSelected(C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: v.isAllPageRowsSelected,
          title: "Toggle All Current Page Rows Selected",
          indeterminate: Boolean(!v.isAllPageRowsSelected && v.page.some(function(S) {
            var C = S.id;
            return v.state.selectedRowIds[C];
          }))
        }];
      };
      function ys(l, d, m, v) {
        if (d.type === p.init)
          return a({
            selectedRowIds: {}
          }, l);
        if (d.type === p.resetSelectedRows)
          return a({}, l, {
            selectedRowIds: v.initialState.selectedRowIds || {}
          });
        if (d.type === p.toggleAllRowsSelected) {
          var S = d.value, C = v.isAllRowsSelected, x = v.rowsById, $ = v.nonGroupedRowsById, z = $ === void 0 ? x : $, H = typeof S < "u" ? S : !C, q = Object.assign({}, l.selectedRowIds);
          return H ? Object.keys(z).forEach(function(nt) {
            q[nt] = !0;
          }) : Object.keys(z).forEach(function(nt) {
            delete q[nt];
          }), a({}, l, {
            selectedRowIds: q
          });
        }
        if (d.type === p.toggleRowSelected) {
          var pe = d.id, Z = d.value, ae = v.rowsById, ve = v.selectSubRows, K = ve === void 0 ? !0 : ve, Pe = v.getSubRows, De = l.selectedRowIds[pe], We = typeof Z < "u" ? Z : !De;
          if (De === We)
            return l;
          var we = a({}, l.selectedRowIds), Ze = function nt(qe) {
            var Xe = ae[qe];
            if (Xe && (Xe.isGrouped || (We ? we[qe] = !0 : delete we[qe]), K && Pe(Xe)))
              return Pe(Xe).forEach(function(Tt) {
                return nt(Tt.id);
              });
          };
          return Ze(pe), a({}, l, {
            selectedRowIds: we
          });
        }
        if (d.type === p.toggleAllPageRowsSelected) {
          var it = d.value, _e = v.page, ye = v.rowsById, Se = v.selectSubRows, Ie = Se === void 0 ? !0 : Se, et = v.isAllPageRowsSelected, tt = v.getSubRows, St = typeof it < "u" ? it : !et, Me = a({}, l.selectedRowIds), Bt = function nt(qe) {
            var Xe = ye[qe];
            if (Xe.isGrouped || (St ? Me[qe] = !0 : delete Me[qe]), Ie && tt(Xe))
              return tt(Xe).forEach(function(Tt) {
                return nt(Tt.id);
              });
          };
          return _e.forEach(function(nt) {
            return Bt(nt.id);
          }), a({}, l, {
            selectedRowIds: Me
          });
        }
        return l;
      }
      function bs(l) {
        var d = l.data, m = l.rows, v = l.getHooks, S = l.plugins, C = l.rowsById, x = l.nonGroupedRowsById, $ = x === void 0 ? C : x, z = l.autoResetSelectedRows, H = z === void 0 ? !0 : z, q = l.state.selectedRowIds, pe = l.selectSubRows, Z = pe === void 0 ? !0 : pe, ae = l.dispatch, ve = l.page, K = l.getSubRows;
        G(S, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var Pe = r.useMemo(function() {
          var et = [];
          return m.forEach(function(tt) {
            var St = Z ? _a(tt, q, K) : !!q[tt.id];
            tt.isSelected = !!St, tt.isSomeSelected = St === null, St && et.push(tt);
          }), et;
        }, [m, Z, q, K]), De = Boolean(Object.keys($).length && Object.keys(q).length), We = De;
        De && Object.keys($).some(function(et) {
          return !q[et];
        }) && (De = !1), De || ve && ve.length && ve.some(function(et) {
          var tt = et.id;
          return !q[tt];
        }) && (We = !1);
        var we = D(H);
        Q(function() {
          we() && ae({
            type: p.resetSelectedRows
          });
        }, [ae, d]);
        var Ze = r.useCallback(function(et) {
          return ae({
            type: p.toggleAllRowsSelected,
            value: et
          });
        }, [ae]), it = r.useCallback(function(et) {
          return ae({
            type: p.toggleAllPageRowsSelected,
            value: et
          });
        }, [ae]), _e = r.useCallback(function(et, tt) {
          return ae({
            type: p.toggleRowSelected,
            id: et,
            value: tt
          });
        }, [ae]), ye = D(l), Se = k(v().getToggleAllRowsSelectedProps, {
          instance: ye()
        }), Ie = k(v().getToggleAllPageRowsSelectedProps, {
          instance: ye()
        });
        Object.assign(l, {
          selectedFlatRows: Pe,
          isAllRowsSelected: De,
          isAllPageRowsSelected: We,
          toggleRowSelected: _e,
          toggleAllRowsSelected: Ze,
          getToggleAllRowsSelectedProps: Se,
          getToggleAllPageRowsSelectedProps: Ie,
          toggleAllPageRowsSelected: it
        });
      }
      function xa(l, d) {
        var m = d.instance;
        l.toggleRowSelected = function(v) {
          return m.toggleRowSelected(l.id, v);
        }, l.getToggleRowSelectedProps = k(m.getHooks().getToggleRowSelectedProps, {
          instance: m,
          row: l
        });
      }
      function _a(l, d, m) {
        if (d[l.id])
          return !0;
        var v = m(l);
        if (v && v.length) {
          var S = !0, C = !1;
          return v.forEach(function(x) {
            C && !S || (_a(x, d, m) ? C = !0 : S = !1);
          }), S ? !0 : C ? null : !1;
        }
        return !1;
      }
      var Sa = function(d) {
        return {};
      }, Ra = function(d) {
        return {};
      };
      p.setRowState = "setRowState", p.setCellState = "setCellState", p.resetRowState = "resetRowState";
      var Ca = function(d) {
        d.stateReducers.push(to), d.useInstance.push(s), d.prepareRow.push(g);
      };
      Ca.pluginName = "useRowState";
      function to(l, d, m, v) {
        var S = v.initialRowStateAccessor, C = S === void 0 ? Sa : S, x = v.initialCellStateAccessor, $ = x === void 0 ? Ra : x, z = v.rowsById;
        if (d.type === p.init)
          return a({
            rowState: {}
          }, l);
        if (d.type === p.resetRowState)
          return a({}, l, {
            rowState: v.initialState.rowState || {}
          });
        if (d.type === p.setRowState) {
          var H, q = d.rowId, pe = d.value, Z = typeof l.rowState[q] < "u" ? l.rowState[q] : C(z[q]);
          return a({}, l, {
            rowState: a({}, l.rowState, (H = {}, H[q] = M(pe, Z), H))
          });
        }
        if (d.type === p.setCellState) {
          var ae, ve, K, Pe, De, We = d.rowId, we = d.columnId, Ze = d.value, it = typeof l.rowState[We] < "u" ? l.rowState[We] : C(z[We]), _e = typeof (it == null || (ae = it.cellState) == null ? void 0 : ae[we]) < "u" ? it.cellState[we] : $((ve = z[We]) == null || (K = ve.cells) == null ? void 0 : K.find(function(ye) {
            return ye.column.id === we;
          }));
          return a({}, l, {
            rowState: a({}, l.rowState, (De = {}, De[We] = a({}, it, {
              cellState: a({}, it.cellState || {}, (Pe = {}, Pe[we] = M(Ze, _e), Pe))
            }), De))
          });
        }
      }
      function s(l) {
        var d = l.autoResetRowState, m = d === void 0 ? !0 : d, v = l.data, S = l.dispatch, C = r.useCallback(function(z, H) {
          return S({
            type: p.setRowState,
            rowId: z,
            value: H
          });
        }, [S]), x = r.useCallback(function(z, H, q) {
          return S({
            type: p.setCellState,
            rowId: z,
            columnId: H,
            value: q
          });
        }, [S]), $ = D(m);
        Q(function() {
          $() && S({
            type: p.resetRowState
          });
        }, [v]), Object.assign(l, {
          setRowState: C,
          setCellState: x
        });
      }
      function g(l, d) {
        var m = d.instance, v = m.initialRowStateAccessor, S = v === void 0 ? Sa : v, C = m.initialCellStateAccessor, x = C === void 0 ? Ra : C, $ = m.state.rowState;
        l && (l.state = typeof $[l.id] < "u" ? $[l.id] : S(l), l.setState = function(z) {
          return m.setRowState(l.id, z);
        }, l.cells.forEach(function(z) {
          l.state.cellState || (l.state.cellState = {}), z.state = typeof l.state.cellState[z.column.id] < "u" ? l.state.cellState[z.column.id] : x(z), z.setState = function(H) {
            return m.setCellState(l.id, z.column.id, H);
          };
        }));
      }
      p.resetColumnOrder = "resetColumnOrder", p.setColumnOrder = "setColumnOrder";
      var y = function(d) {
        d.stateReducers.push(b), d.visibleColumnsDeps.push(function(m, v) {
          var S = v.instance;
          return [].concat(m, [S.state.columnOrder]);
        }), d.visibleColumns.push(E), d.useInstance.push(R);
      };
      y.pluginName = "useColumnOrder";
      function b(l, d, m, v) {
        if (d.type === p.init)
          return a({
            columnOrder: []
          }, l);
        if (d.type === p.resetColumnOrder)
          return a({}, l, {
            columnOrder: v.initialState.columnOrder || []
          });
        if (d.type === p.setColumnOrder)
          return a({}, l, {
            columnOrder: M(d.columnOrder, l.columnOrder)
          });
      }
      function E(l, d) {
        var m = d.instance.state.columnOrder;
        if (!m || !m.length)
          return l;
        for (var v = [].concat(m), S = [].concat(l), C = [], x = function() {
          var z = v.shift(), H = S.findIndex(function(q) {
            return q.id === z;
          });
          H > -1 && C.push(S.splice(H, 1)[0]);
        }; S.length && v.length; )
          x();
        return [].concat(C, S);
      }
      function R(l) {
        var d = l.dispatch;
        l.setColumnOrder = r.useCallback(function(m) {
          return d({
            type: p.setColumnOrder,
            columnOrder: m
          });
        }, [d]);
      }
      _.canResize = !0, p.columnStartResizing = "columnStartResizing", p.columnResizing = "columnResizing", p.columnDoneResizing = "columnDoneResizing", p.resetResize = "resetResize";
      var A = function(d) {
        d.getResizerProps = [j], d.getHeaderProps.push({
          style: {
            position: "relative"
          }
        }), d.stateReducers.push(W), d.useInstance.push(se), d.useInstanceBeforeDimensions.push(U);
      }, j = function(d, m) {
        var v = m.instance, S = m.header, C = v.dispatch, x = function(z, H) {
          var q = !1;
          if (z.type === "touchstart") {
            if (z.touches && z.touches.length > 1)
              return;
            q = !0;
          }
          var pe = ie(H), Z = pe.map(function(_e) {
            return [_e.id, _e.totalWidth];
          }), ae = q ? Math.round(z.touches[0].clientX) : z.clientX, ve, K, Pe = function() {
            window.cancelAnimationFrame(ve), ve = null, C({
              type: p.columnDoneResizing
            });
          }, De = function() {
            window.cancelAnimationFrame(ve), ve = null, C({
              type: p.columnResizing,
              clientX: K
            });
          }, We = function(ye) {
            K = ye, ve || (ve = window.requestAnimationFrame(De));
          }, we = {
            mouse: {
              moveEvent: "mousemove",
              moveHandler: function(ye) {
                return We(ye.clientX);
              },
              upEvent: "mouseup",
              upHandler: function(ye) {
                document.removeEventListener("mousemove", we.mouse.moveHandler), document.removeEventListener("mouseup", we.mouse.upHandler), Pe();
              }
            },
            touch: {
              moveEvent: "touchmove",
              moveHandler: function(ye) {
                return ye.cancelable && (ye.preventDefault(), ye.stopPropagation()), We(ye.touches[0].clientX), !1;
              },
              upEvent: "touchend",
              upHandler: function(ye) {
                document.removeEventListener(we.touch.moveEvent, we.touch.moveHandler), document.removeEventListener(we.touch.upEvent, we.touch.moveHandler), Pe();
              }
            }
          }, Ze = q ? we.touch : we.mouse, it = ce() ? {
            passive: !1
          } : !1;
          document.addEventListener(Ze.moveEvent, Ze.moveHandler, it), document.addEventListener(Ze.upEvent, Ze.upHandler, it), C({
            type: p.columnStartResizing,
            columnId: H.id,
            columnWidth: H.totalWidth,
            headerIdWidths: Z,
            clientX: ae
          });
        };
        return [d, {
          onMouseDown: function(z) {
            return z.persist() || x(z, S);
          },
          onTouchStart: function(z) {
            return z.persist() || x(z, S);
          },
          style: {
            cursor: "col-resize"
          },
          draggable: !1,
          role: "separator"
        }];
      };
      A.pluginName = "useResizeColumns";
      function W(l, d) {
        if (d.type === p.init)
          return a({
            columnResizing: {
              columnWidths: {}
            }
          }, l);
        if (d.type === p.resetResize)
          return a({}, l, {
            columnResizing: {
              columnWidths: {}
            }
          });
        if (d.type === p.columnStartResizing) {
          var m = d.clientX, v = d.columnId, S = d.columnWidth, C = d.headerIdWidths;
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: m,
              headerIdWidths: C,
              columnWidth: S,
              isResizingColumn: v
            })
          });
        }
        if (d.type === p.columnResizing) {
          var x = d.clientX, $ = l.columnResizing, z = $.startX, H = $.columnWidth, q = $.headerIdWidths, pe = q === void 0 ? [] : q, Z = x - z, ae = Z / H, ve = {};
          return pe.forEach(function(K) {
            var Pe = K[0], De = K[1];
            ve[Pe] = Math.max(De + De * ae, 0);
          }), a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              columnWidths: a({}, l.columnResizing.columnWidths, {}, ve)
            })
          });
        }
        if (d.type === p.columnDoneResizing)
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: null,
              isResizingColumn: null
            })
          });
      }
      var U = function(d) {
        var m = d.flatHeaders, v = d.disableResizing, S = d.getHooks, C = d.state.columnResizing, x = D(d);
        m.forEach(function($) {
          var z = Te($.disableResizing === !0 ? !1 : void 0, v === !0 ? !1 : void 0, !0);
          $.canResize = z, $.width = C.columnWidths[$.id] || $.originalWidth || $.width, $.isResizing = C.isResizingColumn === $.id, z && ($.getResizerProps = k(S().getResizerProps, {
            instance: x(),
            header: $
          }));
        });
      };
      function se(l) {
        var d = l.plugins, m = l.dispatch, v = l.autoResetResize, S = v === void 0 ? !0 : v, C = l.columns;
        G(d, ["useAbsoluteLayout"], "useResizeColumns");
        var x = D(S);
        Q(function() {
          x() && m({
            type: p.resetResize
          });
        }, [C]);
        var $ = r.useCallback(function() {
          return m({
            type: p.resetResize
          });
        }, [m]);
        Object.assign(l, {
          resetResizing: $
        });
      }
      function ie(l) {
        var d = [], m = function v(S) {
          S.columns && S.columns.length && S.columns.map(v), d.push(S);
        };
        return m(l), d;
      }
      var oe = {
        position: "absolute",
        top: 0
      }, Y = function(d) {
        d.getTableBodyProps.push(ne), d.getRowProps.push(ne), d.getHeaderGroupProps.push(ne), d.getFooterGroupProps.push(ne), d.getHeaderProps.push(function(m, v) {
          var S = v.column;
          return [m, {
            style: a({}, oe, {
              left: S.totalLeft + "px",
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(m, v) {
          var S = v.cell;
          return [m, {
            style: a({}, oe, {
              left: S.column.totalLeft + "px",
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(m, v) {
          var S = v.column;
          return [m, {
            style: a({}, oe, {
              left: S.totalLeft + "px",
              width: S.totalWidth + "px"
            })
          }];
        });
      };
      Y.pluginName = "useAbsoluteLayout";
      var ne = function(d, m) {
        var v = m.instance;
        return [d, {
          style: {
            position: "relative",
            width: v.totalColumnsWidth + "px"
          }
        }];
      }, me = {
        display: "inline-block",
        boxSizing: "border-box"
      }, xe = function(d, m) {
        var v = m.instance;
        return [d, {
          style: {
            display: "flex",
            width: v.totalColumnsWidth + "px"
          }
        }];
      }, $e = function(d) {
        d.getRowProps.push(xe), d.getHeaderGroupProps.push(xe), d.getFooterGroupProps.push(xe), d.getHeaderProps.push(function(m, v) {
          var S = v.column;
          return [m, {
            style: a({}, me, {
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(m, v) {
          var S = v.cell;
          return [m, {
            style: a({}, me, {
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(m, v) {
          var S = v.column;
          return [m, {
            style: a({}, me, {
              width: S.totalWidth + "px"
            })
          }];
        });
      };
      $e.pluginName = "useBlockLayout";
      function Je(l) {
        l.getTableProps.push(Fe), l.getRowProps.push(le), l.getHeaderGroupProps.push(le), l.getFooterGroupProps.push(le), l.getHeaderProps.push(Qe), l.getCellProps.push(Ee), l.getFooterProps.push(Ye);
      }
      Je.pluginName = "useFlexLayout";
      var Fe = function(d, m) {
        var v = m.instance;
        return [d, {
          style: {
            minWidth: v.totalColumnsMinWidth + "px"
          }
        }];
      }, le = function(d, m) {
        var v = m.instance;
        return [d, {
          style: {
            display: "flex",
            flex: "1 0 auto",
            minWidth: v.totalColumnsMinWidth + "px"
          }
        }];
      }, Qe = function(d, m) {
        var v = m.column;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: v.totalFlexWidth ? v.totalFlexWidth + " 0 auto" : void 0,
            minWidth: v.totalMinWidth + "px",
            width: v.totalWidth + "px"
          }
        }];
      }, Ee = function(d, m) {
        var v = m.cell;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: v.column.totalFlexWidth + " 0 auto",
            minWidth: v.column.totalMinWidth + "px",
            width: v.column.totalWidth + "px"
          }
        }];
      }, Ye = function(d, m) {
        var v = m.column;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: v.totalFlexWidth ? v.totalFlexWidth + " 0 auto" : void 0,
            minWidth: v.totalMinWidth + "px",
            width: v.totalWidth + "px"
          }
        }];
      };
      p.columnStartResizing = "columnStartResizing", p.columnResizing = "columnResizing", p.columnDoneResizing = "columnDoneResizing", p.resetResize = "resetResize";
      function ft(l) {
        l.stateReducers.push(Ke), l.getTableProps.push(je), l.getHeaderProps.push(Ve), l.getRowProps.push(yt);
      }
      ft.pluginName = "useGridLayout";
      var je = function(d, m) {
        var v = m.instance, S = v.visibleColumns.map(function(C) {
          var x;
          return v.state.gridLayout.columnWidths[C.id] ? v.state.gridLayout.columnWidths[C.id] + "px" : (x = v.state.columnResizing) != null && x.isResizingColumn ? v.state.gridLayout.startWidths[C.id] + "px" : typeof C.width == "number" ? C.width + "px" : C.width;
        });
        return [d, {
          style: {
            display: "grid",
            gridTemplateColumns: S.join(" ")
          }
        }];
      }, Ve = function(d, m) {
        var v = m.column;
        return [d, {
          id: "header-cell-" + v.id,
          style: {
            position: "sticky",
            gridColumn: "span " + v.totalVisibleHeaderCount
          }
        }];
      }, yt = function(d, m) {
        var v = m.row;
        return v.isExpanded ? [d, {
          style: {
            gridColumn: "1 / " + (v.cells.length + 1)
          }
        }] : [d, {}];
      };
      function Ke(l, d, m, v) {
        if (d.type === p.init)
          return a({
            gridLayout: {
              columnWidths: {}
            }
          }, l);
        if (d.type === p.resetResize)
          return a({}, l, {
            gridLayout: {
              columnWidths: {}
            }
          });
        if (d.type === p.columnStartResizing) {
          var S = d.columnId, C = d.headerIdWidths, x = ht(S);
          if (x !== void 0) {
            var $ = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ht(ye.id), Se));
            }, {}), z = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.minWidth, Se));
            }, {}), H = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.maxWidth, Se));
            }, {}), q = C.map(function(_e) {
              var ye = _e[0];
              return [ye, ht(ye)];
            });
            return a({}, l, {
              gridLayout: a({}, l.gridLayout, {
                startWidths: $,
                minWidths: z,
                maxWidths: H,
                headerIdGridWidths: q,
                columnWidth: x
              })
            });
          } else
            return l;
        }
        if (d.type === p.columnResizing) {
          var pe = d.clientX, Z = l.columnResizing.startX, ae = l.gridLayout, ve = ae.columnWidth, K = ae.minWidths, Pe = ae.maxWidths, De = ae.headerIdGridWidths, We = De === void 0 ? [] : De, we = pe - Z, Ze = we / ve, it = {};
          return We.forEach(function(_e) {
            var ye = _e[0], Se = _e[1];
            it[ye] = Math.min(Math.max(K[ye], Se + Se * Ze), Pe[ye]);
          }), a({}, l, {
            gridLayout: a({}, l.gridLayout, {
              columnWidths: a({}, l.gridLayout.columnWidths, {}, it)
            })
          });
        }
        if (d.type === p.columnDoneResizing)
          return a({}, l, {
            gridLayout: a({}, l.gridLayout, {
              startWidths: {},
              minWidths: {},
              maxWidths: {}
            })
          });
      }
      function ht(l) {
        var d, m = (d = document.getElementById("header-cell-" + l)) == null ? void 0 : d.offsetWidth;
        if (m !== void 0)
          return m;
      }
      n._UNSTABLE_usePivotColumns = ga, n.actions = p, n.defaultColumn = _, n.defaultGroupByFn = ua, n.defaultOrderByFn = Xi, n.defaultRenderer = w, n.emptyRenderer = P, n.ensurePluginOrder = G, n.flexRender = re, n.functionalUpdate = M, n.loopHooks = N, n.makePropGetter = k, n.makeRenderer = ge, n.reduceHooks = F, n.safeUseLayoutEffect = te, n.useAbsoluteLayout = Y, n.useAsyncDebounce = fe, n.useBlockLayout = $e, n.useColumnOrder = y, n.useExpanded = kn, n.useFilters = Et, n.useFlexLayout = Je, n.useGetLatest = D, n.useGlobalFilter = Hr, n.useGridLayout = ft, n.useGroupBy = qi, n.useMountedLayoutEffect = Q, n.usePagination = ha, n.useResizeColumns = A, n.useRowSelect = Ji, n.useRowState = Ca, n.useSortBy = fa, n.useTable = On, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(La, La.exports)), La.exports;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = gP() : e.exports = mP();
})(Co);
const yP = "_tableFilterContainer_113tz_1", bP = "_pagination_113tz_33", wP = "_icon_113tz_50", xP = "_alignRight_113tz_124", bi = {
  tableFilterContainer: yP,
  pagination: bP,
  icon: wP,
  alignRight: xP
}, sc = (e) => /* @__PURE__ */ In.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ In.createElement("path", {
  d: "M11.5 6H0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ In.createElement("path", {
  d: "M7.5 10L11.5 6L7.5 2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
var $t = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Table/DataTable.tsx";
const _P = ({
  filterValue: e,
  setFilter: t,
  preFilteredRows: n,
  id: r,
  filterData: i
}) => {
  Ht(() => {
    const a = /* @__PURE__ */ new Set();
    return n.forEach(function(u) {
      a.add(u.values[r]);
    }), [...a.values()];
  }, [r, n]);
  const o = i.map((a) => /* @__PURE__ */ L("li", {
    value: e,
    onClick: () => {
      a = a === "ALL" ? void 0 : a, t(a || void 0);
    },
    children: a
  }, void 0, !1, {
    fileName: $t,
    lineNumber: 28,
    columnNumber: 7
  }, void 0));
  return /* @__PURE__ */ L("ul", {
    children: o
  }, void 0, !1, {
    fileName: $t,
    lineNumber: 42,
    columnNumber: 5
  }, void 0);
}, oN = ({
  name: e,
  filterData: t = [],
  columns: n,
  data: r,
  displayedRowSize: i
}) => {
  const {
    getTableProps: o,
    getTableBodyProps: a,
    headerGroups: u,
    prepareRow: f,
    page: c,
    canPreviousPage: h,
    canNextPage: p,
    pageOptions: w,
    pageCount: P,
    nextPage: _,
    previousPage: T,
    state: {
      pageIndex: I
    },
    preGlobalFilteredRows: k,
    setGlobalFilter: F
  } = Co.exports.useTable({
    columns: n,
    data: r
  }, Co.exports.useFilters, Co.exports.useGlobalFilter, Co.exports.usePagination);
  return /* @__PURE__ */ L(Dn, {
    children: [/* @__PURE__ */ L("div", {
      className: bi.tableFilterContainer,
      children: [/* @__PURE__ */ L("h3", {
        children: ["  ", 1, "-", P, " of ", r.length, " ", e, " "]
      }, void 0, !0, {
        fileName: $t,
        lineNumber: 75,
        columnNumber: 11
      }, void 0), /* @__PURE__ */ L("ul", {
        children: /* @__PURE__ */ L(_P, {
          filterValue: void 0,
          setFilter: F,
          preFilteredRows: k,
          id: "type",
          filterData: t
        }, void 0, !1, {
          fileName: $t,
          lineNumber: 77,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: $t,
        lineNumber: 76,
        columnNumber: 11
      }, void 0)]
    }, void 0, !0, {
      fileName: $t,
      lineNumber: 74,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ L("div", {
      children: /* @__PURE__ */ L("table", {
        ...o(),
        children: [/* @__PURE__ */ L("thead", {
          children: u.map((N) => /* @__PURE__ */ L("tr", {
            ...N.getHeaderGroupProps(),
            children: N.headers.map((G, M) => /* @__PURE__ */ L("th", {
              className: i - 1 === M ? bi.alignRight : "",
              ...G.getHeaderProps(),
              children: G.render("Header")
            }, void 0, !1, {
              fileName: $t,
              lineNumber: 92,
              columnNumber: 19
            }, void 0))
          }, void 0, !1, {
            fileName: $t,
            lineNumber: 90,
            columnNumber: 15
          }, void 0))
        }, void 0, !1, {
          fileName: $t,
          lineNumber: 88,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ L("tbody", {
          ...a(),
          children: c.map((N, G) => (f(N), /* @__PURE__ */ L("tr", {
            ...N.getRowProps(),
            children: N.cells.map((M, D) => /* @__PURE__ */ L("td", {
              className: i - 1 === D ? bi.alignRight : "",
              ...M.getCellProps(),
              children: M.render("Cell")
            }, void 0, !1, {
              fileName: $t,
              lineNumber: 103,
              columnNumber: 28
            }, void 0))
          }, void 0, !1, {
            fileName: $t,
            lineNumber: 101,
            columnNumber: 17
          }, void 0)))
        }, void 0, !1, {
          fileName: $t,
          lineNumber: 97,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: $t,
        lineNumber: 87,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: $t,
      lineNumber: 86,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ L("div", {
      className: bi.pagination,
      children: [/* @__PURE__ */ L("span", {
        children: ["Page", " ", /* @__PURE__ */ L("strong", {
          children: [I + 1, " of ", w.length]
        }, void 0, !0, {
          fileName: $t,
          lineNumber: 114,
          columnNumber: 13
        }, void 0), " "]
      }, void 0, !0, {
        fileName: $t,
        lineNumber: 112,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ L("span", {
        children: [/* @__PURE__ */ L("button", {
          onClick: () => T(),
          disabled: !h,
          children: /* @__PURE__ */ L(sc, {
            className: `${bi.icon}`
          }, void 0, !1, {
            fileName: $t,
            lineNumber: 120,
            columnNumber: 11
          }, void 0)
        }, void 0, !1, {
          fileName: $t,
          lineNumber: 119,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ L("button", {
          onClick: () => _(),
          disabled: !p,
          children: /* @__PURE__ */ L(sc, {
            className: `${bi.icon}`
          }, void 0, !1, {
            fileName: $t,
            lineNumber: 123,
            columnNumber: 13
          }, void 0)
        }, void 0, !1, {
          fileName: $t,
          lineNumber: 122,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: $t,
        lineNumber: 118,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: $t,
      lineNumber: 111,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0);
};
var SP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Display/Display.tsx";
const aN = ({
  children: e,
  ...t
}) => {
  const r = Object.entries({
    extraSmall: "xs",
    small: "sm",
    medium: "md",
    large: "lg"
  }).reduce((a, [u, f]) => t[u] ? f : a, "lg"), i = t.className || "", o = `${r} ${i}`;
  return /* @__PURE__ */ L("h1", {
    ...t,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: SP,
    lineNumber: 35,
    columnNumber: 12
  }, void 0);
};
var RP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Heading/Heading.tsx";
const uN = ({
  children: e,
  as: t,
  ...n
}) => /* @__PURE__ */ L(t || "h1", {
  ...n,
  children: e
}, void 0, !1, {
  fileName: RP,
  lineNumber: 14,
  columnNumber: 12
}, void 0), CP = "_xxl_14tej_8", PP = "_xl_14tej_12", TP = "_lg_14tej_16", NP = "_md_14tej_20", EP = "_sm_14tej_24", MP = "_xs_14tej_28", OP = "_underline_14tej_32", AP = "_bold_14tej_36", kP = "_black_14tej_44", $P = "_white_14tej_48", FP = "_disabled_14tej_52", Ga = {
  xxl: CP,
  xl: PP,
  lg: TP,
  md: NP,
  sm: EP,
  xs: MP,
  underline: OP,
  bold: AP,
  default: "_default_14tej_40",
  black: kP,
  white: $P,
  disabled: FP
};
var IP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Text/Text.tsx";
const sN = ({
  children: e,
  className: t,
  as: n,
  colour: r,
  bold: i,
  underline: o,
  ...a
}) => {
  const u = {
    className: t
  }, f = Ga[r || "default"], c = i ? Ga.bold : "", h = o ? Ga.underline : "";
  return /* @__PURE__ */ L("p", {
    className: `${Ga[n]} ${f} ${c} ${h} ${u}`,
    ...a,
    children: e
  }, void 0, !1, {
    fileName: IP,
    lineNumber: 23,
    columnNumber: 7
  }, void 0);
}, BP = "_outerContainer_e6ykc_1", DP = "_container_e6ykc_12", zP = "_navbar_e6ykc_25", LP = "_fade_e6ykc_35", GP = "_active_e6ykc_48", jP = "_navbarFixed_e6ykc_60", HP = "_fixed_e6ykc_70", WP = "_fluidity_e6ykc_83", Nr = {
  outerContainer: BP,
  container: DP,
  navbar: zP,
  fade: LP,
  active: GP,
  navbarFixed: jP,
  fixed: HP,
  fluidity: WP
}, UP = () => {
  const [e, t] = gn.useState(window.innerWidth);
  return gn.useEffect(() => {
    const n = () => t(window.innerWidth);
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), { width: e };
};
var jt = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/NavBar/NavBar.tsx";
const lN = ({
  logo: e,
  text: t,
  button: n,
  navLinks: r
}) => {
  const [i, o] = hr(!1), a = () => {
    o(!i);
  }, {
    width: u
  } = UP(), f = 700, c = r.map((h) => /* @__PURE__ */ L("li", {
    children: [/* @__PURE__ */ L("a", {
      href: `/${h.name.replace(/\s+/g, "")}`,
      className: window.location.pathname.toString() === `/${h.name.replace(/\s+/g, "")}` ? Nr.active : "",
      children: h.name.toUpperCase()
    }, void 0, !1, {
      fileName: jt,
      lineNumber: 48,
      columnNumber: 7
    }, void 0), h.modal && /* @__PURE__ */ L("button", {
      onClick: () => {
      },
      children: /* @__PURE__ */ L("img", {
        src: "./src/assets/images/triangleDown.svg",
        alt: "open resource options"
      }, void 0, !1, {
        fileName: jt,
        lineNumber: 61,
        columnNumber: 11
      }, void 0)
    }, void 0, !1, {
      fileName: jt,
      lineNumber: 60,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: jt,
    lineNumber: 47,
    columnNumber: 5
  }, void 0));
  return /* @__PURE__ */ L("div", {
    className: Nr.outerContainer,
    children: /* @__PURE__ */ L("div", {
      className: `${Nr.container} opacity-5x`,
      children: [/* @__PURE__ */ L("h2", {
        className: Nr.fluidity,
        children: t
      }, void 0, !1, {
        fileName: jt,
        lineNumber: 74,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ L("div", {
        className: Nr.navbarFixed,
        children: /* @__PURE__ */ L("div", {
          className: Nr.fixed,
          children: [/* @__PURE__ */ L("div", {
            children: /* @__PURE__ */ L("a", {
              href: "/",
              children: /* @__PURE__ */ L("img", {
                src: e,
                alt: "home page"
              }, void 0, !1, {
                fileName: jt,
                lineNumber: 80,
                columnNumber: 17
              }, void 0)
            }, void 0, !1, {
              fileName: jt,
              lineNumber: 78,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: jt,
            lineNumber: 77,
            columnNumber: 13
          }, void 0), /* @__PURE__ */ L(aT, {
            version: n.version,
            type: n.type,
            size: u < f ? "small" : "medium",
            handleClick: n.handleClick,
            children: n.children
          }, void 0, !1, {
            fileName: jt,
            lineNumber: 84,
            columnNumber: 13
          }, void 0)]
        }, void 0, !0, {
          fileName: jt,
          lineNumber: 76,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: jt,
        lineNumber: 75,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ L("div", {
        className: Nr.navbar,
        children: /* @__PURE__ */ L("div", {
          className: Nr.fade,
          children: [/* @__PURE__ */ L("nav", {
            children: /* @__PURE__ */ L("ul", {
              children: c
            }, void 0, !1, {
              fileName: jt,
              lineNumber: 97,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: jt,
            lineNumber: 96,
            columnNumber: 13
          }, void 0), i && /* @__PURE__ */ L(bT, {
            handleModal: a,
            navLinks: VP
          }, void 0, !1, {
            fileName: jt,
            lineNumber: 100,
            columnNumber: 15
          }, void 0)]
        }, void 0, !0, {
          fileName: jt,
          lineNumber: 95,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: jt,
        lineNumber: 94,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: jt,
      lineNumber: 72,
      columnNumber: 7
    }, void 0)
  }, void 0, !1, {
    fileName: jt,
    lineNumber: 71,
    columnNumber: 5
  }, void 0);
}, VP = [{
  children: "articles",
  size: "small",
  type: "internal",
  handleClick: () => {
  }
}, {
  children: "fluniversity",
  size: "small",
  type: "internal",
  handleClick: () => {
  }
}, {
  children: "whitpapers",
  size: "small",
  type: "internal",
  handleClick: () => {
  }
}, {
  children: "documentation",
  size: "small",
  type: "external",
  handleClick: () => {
  }
}], qP = (e) => /* @__PURE__ */ In.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ In.createElement("path", {
  d: "M6 11.5L6 0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ In.createElement("path", {
  d: "M10 7.5L6 11.5L2 7.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), YP = "_button_frgyj_1", XP = "_icon_frgyj_17", KP = "_text_frgyj_21", sl = {
  button: YP,
  icon: XP,
  text: KP
};
var ll = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/AnchorButton/AnchorButton.tsx";
const QP = ({
  children: e,
  disabled: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ L("button", {
    className: `${sl.button} ${i}`,
    disabled: t,
    ...r,
    children: [/* @__PURE__ */ L(qP, {
      className: sl.icon
    }, void 0, !1, {
      fileName: ll,
      lineNumber: 17,
      columnNumber: 7
    }, void 0), " ", /* @__PURE__ */ L("div", {
      className: sl.text,
      children: e
    }, void 0, !1, {
      fileName: ll,
      lineNumber: 18,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0, {
    fileName: ll,
    lineNumber: 16,
    columnNumber: 5
  }, void 0);
}, ZP = "_option_1fm9a_1", JP = "_optionSelected_1fm9a_1", Jp = {
  option: ZP,
  optionSelected: JP
};
var eh = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/FilterButton/FilterButton.tsx";
const eT = ({
  option: e,
  handleFilter: t,
  setOptions: n,
  options: r,
  disabled: i,
  className: o,
  ...a
}) => {
  const u = o || "", f = e.name.includes("any") ? "ANY" : e.name;
  return /* @__PURE__ */ L(Dn, {
    children: e.selected ? /* @__PURE__ */ L("button", {
      className: `${Jp.optionSelected} ${u}`,
      onClick: () => t(e, n, r),
      ...a,
      children: f
    }, void 0, !1, {
      fileName: eh,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ L("button", {
      className: `${Jp.option} ${u}`,
      onClick: () => i !== !0 && t(e, n, r),
      disabled: i,
      ...a,
      children: f
    }, void 0, !1, {
      fileName: eh,
      lineNumber: 51,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, tT = "_small_19zlh_9", nT = "_medium_19zlh_19", rT = "_large_19zlh_29", iT = "_primary_19zlh_38", oT = "_secondary_19zlh_62", Xr = {
  small: tT,
  medium: nT,
  large: rT,
  primary: iT,
  secondary: oT
};
var yo = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/GeneralButton/GeneralButton.tsx";
const aT = ({
  children: e,
  version: t,
  type: n,
  size: r,
  handleClick: i,
  disabled: o,
  className: a,
  ...u
}) => {
  const f = a || "";
  return hr(1), /* @__PURE__ */ L(Dn, {
    children: t === "primary" && n === "text" ? /* @__PURE__ */ L("button", {
      onClick: i,
      className: `${Xr.primary} ${Xr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 34,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon before" ? /* @__PURE__ */ L("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon after" ? /* @__PURE__ */ L("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 52,
      columnNumber: 9
    }, void 0) : n === "icon only" ? /* @__PURE__ */ L("button", {
      onClick: i,
      className: `${Xr.iconOnly} ${f}`,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 61,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ L("button", {
      onClick: i,
      className: `${Xr.secondary} ${Xr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 70,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, uT = (e) => /* @__PURE__ */ In.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ In.createElement("path", {
  d: "M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ In.createElement("path", {
  d: "M6.5 0.5H11.5V5.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ In.createElement("path", {
  d: "M11.5 0.5L5.5 6.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), sT = "_button_mr620_1", lT = "_icon_mr620_15", cT = "_text_mr620_23", fT = "_small_mr620_53", dT = "_medium_mr620_62", pT = "_large_mr620_71", bo = {
  button: sT,
  icon: lT,
  text: cT,
  small: fT,
  medium: dT,
  large: pT
};
var ja = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/LinkButton/LinkButton.tsx";
const Nm = ({
  children: e,
  size: t,
  type: n,
  handleClick: r,
  className: i,
  ...o
}) => {
  const a = i || "";
  return /* @__PURE__ */ L("button", {
    className: `${bo.button} ${a}`,
    onClick: r,
    ...o,
    children: [/* @__PURE__ */ L("div", {
      className: `${bo.text} ${bo[t]}`,
      children: e
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 34,
      columnNumber: 7
    }, void 0), n === "internal" ? /* @__PURE__ */ L(sc, {
      className: `${bo.icon} ${a}`
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 39,
      columnNumber: 13
    }, void 0) : /* @__PURE__ */ L(uT, {
      className: `${bo.icon} ${a}`
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 40,
      columnNumber: 13
    }, void 0)]
  }, void 0, !0, {
    fileName: ja,
    lineNumber: 29,
    columnNumber: 5
  }, void 0);
}, hT = "_button_t6im8_1", vT = "_small_t6im8_47", th = {
  button: hT,
  default: "_default_t6im8_40",
  small: vT
};
var gT = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/TabButton/TabButton.tsx";
const cN = ({
  children: e,
  size: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ L("button", {
    className: `${th.button} ${th[t]} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: gT,
    lineNumber: 18,
    columnNumber: 5
  }, void 0);
}, mT = "_container_1cljs_1", yT = "_socials_1cljs_21", nh = {
  container: mT,
  socials: yT
};
var Er = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/NavBarModal/NavBarModal.tsx";
const bT = ({
  handleModal: e,
  navLinks: t
}) => /* @__PURE__ */ L("div", {
  className: nh.container,
  children: [t.map((n) => /* @__PURE__ */ L("h4", {
    children: /* @__PURE__ */ L("a", {
      onClick: () => e(),
      href: `/resources#${n.children}`,
      children: /* @__PURE__ */ L(Nm, {
        size: n.size,
        type: n.type,
        handleClick: () => {
        },
        children: n.children
      }, void 0, !1, {
        fileName: Er,
        lineNumber: 24,
        columnNumber: 13
      }, void 0)
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 23,
      columnNumber: 11
    }, void 0)
  }, void 0, !1, {
    fileName: Er,
    lineNumber: 22,
    columnNumber: 9
  }, void 0)), /* @__PURE__ */ L("div", {
    className: nh.socials,
    children: [/* @__PURE__ */ L("img", {
      src: "/assets/images/socials/twitter.svg"
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 35,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ L("img", {
      src: "/assets/images/socials/discord.svg"
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 36,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ L("img", {
      src: "/assets/images/socials/telegram.svg"
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 37,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Er,
    lineNumber: 34,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Er,
  lineNumber: 20,
  columnNumber: 5
}, void 0), wT = "_container_68wxs_1", xT = {
  container: wT
};
var Ha = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Navigation/Navigation.tsx";
const fN = ({
  pageLocations: e,
  page: t
}) => /* @__PURE__ */ L("div", {
  className: xT.container,
  children: e.map((n, r) => /* @__PURE__ */ L("h4", {
    children: /* @__PURE__ */ L("a", {
      href: `/${t}#${n.replace(/\s/g, "")}`,
      children: /* @__PURE__ */ L(QP, {
        children: n.toUpperCase()
      }, void 0, !1, {
        fileName: Ha,
        lineNumber: 17,
        columnNumber: 14
      }, void 0)
    }, void 0, !1, {
      fileName: Ha,
      lineNumber: 16,
      columnNumber: 11
    }, void 0)
  }, `anchor-${r}`, !1, {
    fileName: Ha,
    lineNumber: 15,
    columnNumber: 9
  }, void 0))
}, void 0, !1, {
  fileName: Ha,
  lineNumber: 13,
  columnNumber: 5
}, void 0), _T = "_grid_uwgxl_1", ST = "_left_uwgxl_14", RT = "_right_uwgxl_14", cl = {
  grid: _T,
  left: ST,
  right: RT
};
var fl = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/ReusableGrid/ReusableGrid.tsx";
const dN = ({
  left: e,
  right: t
}) => /* @__PURE__ */ L("div", {
  className: cl.grid,
  children: [/* @__PURE__ */ L("div", {
    className: cl.left,
    children: e
  }, void 0, !1, {
    fileName: fl,
    lineNumber: 11,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ L("div", {
    className: cl.right,
    children: t
  }, void 0, !1, {
    fileName: fl,
    lineNumber: 12,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: fl,
  lineNumber: 10,
  columnNumber: 5
}, void 0), CT = "_options_gf7vd_1", rh = {
  options: CT
};
var Wa = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Filter/FilterCriteria/FilterCriteria.tsx";
const pN = ({
  children: e,
  options: t,
  handleFilter: n,
  setOptions: r
}) => /* @__PURE__ */ L("div", {
  className: rh.container,
  children: [/* @__PURE__ */ L("h5", {
    children: e
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ L("div", {
    className: rh.options,
    children: t.map((i, o) => /* @__PURE__ */ L(eT, {
      option: i,
      handleFilter: n,
      setOptions: r,
      options: t
    }, `opt-${o}`, !1, {
      fileName: Wa,
      lineNumber: 35,
      columnNumber: 11
    }, void 0))
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 33,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Wa,
  lineNumber: 31,
  columnNumber: 5
}, void 0);
var gu = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Tab/Tab.tsx";
const hN = ({
  leading: e,
  children: t,
  active: n
}) => /* @__PURE__ */ L(Dn, {
  children: /* @__PURE__ */ L("ul", {
    children: /* @__PURE__ */ L("li", {}, void 0, !1, {
      fileName: gu,
      lineNumber: 19,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: gu,
    lineNumber: 18,
    columnNumber: 9
  }, void 0)
}, void 0, !1), vN = () => /* @__PURE__ */ L(Dn, {
  children: /* @__PURE__ */ L("ul", {
    children: /* @__PURE__ */ L("li", {}, void 0, !1, {
      fileName: gu,
      lineNumber: 29,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: gu,
    lineNumber: 28,
    columnNumber: 9
  }, void 0)
}, void 0, !1), PT = "_reverse_1786y_1", TT = "_row_1786y_5", ih = {
  reverse: PT,
  row: TT
};
var NT = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Row/Row.tsx";
const gN = ({
  children: e,
  className: t,
  reverse: n,
  ...r
}) => {
  const i = t || "";
  return /* @__PURE__ */ L("div", {
    className: `${ih.row} ${n && ih.reverse} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: NT,
    lineNumber: 22,
    columnNumber: 5
  }, void 0);
}, ET = "_desktop_d7ypz_2", MT = {
  desktop: ET
};
var OT = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/DesktopOnly/DesktopOnly.tsx";
const mN = ({
  children: e,
  className: t,
  ...n
}) => {
  const r = t || "";
  return /* @__PURE__ */ L("div", {
    className: `${MT.desktop} ${r}`,
    ...n,
    children: e
  }, void 0, !1, {
    fileName: OT,
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
}, AT = "_card_1i2d8_8", kT = "_gray_1i2d8_12", $T = "_transparent_1i2d8_15", FT = "_box_1i2d8_19", IT = "_rounded_1i2d8_24", dl = {
  card: AT,
  gray: kT,
  transparent: $T,
  box: FT,
  rounded: IT
};
var BT = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Card/Card.tsx";
const yN = ({
  component: e,
  rounded: t,
  className: n,
  children: r,
  type: i,
  ...o
}) => {
  const a = n || "", u = e || "div", f = dl[i || "gray"];
  return /* @__PURE__ */ L(u, {
    className: `${dl.card} ${f} ${t && dl.rounded} ${a}`,
    ...o,
    children: r
  }, void 0, !1, {
    fileName: BT,
    lineNumber: 23,
    columnNumber: 5
  }, void 0);
}, DT = "_container_acmr2_1", zT = "_content_acmr2_7", oh = {
  container: DT,
  content: zT
};
var ah = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/ManualCarousel/ManualCarousel.tsx";
const bN = ({
  children: e
}) => /* @__PURE__ */ L("div", {
  className: oh.container,
  children: /* @__PURE__ */ L("div", {
    className: oh.content,
    children: e
  }, void 0, !1, {
    fileName: ah,
    lineNumber: 20,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: ah,
  lineNumber: 19,
  columnNumber: 5
}, void 0), LT = "_winnersRight_1abi0_1", GT = "_winnersLeft_1abi0_1", jT = "_winnersRightLine_1abi0_14", HT = "_scrollRight_1abi0_1", WT = "_winnersLeftLine_1abi0_45", UT = "_scrollLeft_1abi0_1", VT = "_winnersTop_1abi0_70", qT = "_winnersTopLine_1abi0_84", YT = "_scrollUp_1abi0_1", wi = {
  winnersRight: LT,
  winnersLeft: GT,
  winnersRightLine: jT,
  scrollRight: HT,
  winnersLeftLine: WT,
  scrollLeft: UT,
  winnersTop: VT,
  winnersTopLine: qT,
  scrollUp: YT
};
var uh = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/ContinuousCarousel/ContinuousCarousel.tsx";
const wN = ({
  direction: e,
  children: t
}) => /* @__PURE__ */ L("div", {
  className: e === "right" ? `${wi.winnersRight}` : e === "left" ? `${wi.winnersLeft}` : `${wi.winnersTop}`,
  children: /* @__PURE__ */ L("div", {
    className: e === "right" ? `${wi.winnersRightLine}` : e === "left" ? `${wi.winnersLeftLine}` : `${wi.winnersTopLine}`,
    children: t
  }, void 0, !1, {
    fileName: uh,
    lineNumber: 27,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: uh,
  lineNumber: 18,
  columnNumber: 5
}, void 0), XT = "_container_1c71e_1", KT = {
  container: XT
};
var wo = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/FooterItem/FooterItem.tsx";
const xN = ({
  children: e,
  items: t
}) => {
  const n = /* @__PURE__ */ L("ul", {
    children: t.map((r) => /* @__PURE__ */ L("li", {
      children: /* @__PURE__ */ L(Nm, {
        handleClick: () => {
        },
        size: "large",
        type: r.type,
        children: r.title
      }, void 0, !1, {
        fileName: wo,
        lineNumber: 24,
        columnNumber: 11
      }, void 0)
    }, r.title, !1, {
      fileName: wo,
      lineNumber: 23,
      columnNumber: 9
    }, void 0))
  }, void 0, !1, {
    fileName: wo,
    lineNumber: 21,
    columnNumber: 5
  }, void 0);
  return /* @__PURE__ */ L("div", {
    className: KT.container,
    children: [/* @__PURE__ */ L("h1", {
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 34,
      columnNumber: 7
    }, void 0), n]
  }, void 0, !0, {
    fileName: wo,
    lineNumber: 33,
    columnNumber: 5
  }, void 0);
}, QT = "_container_1250o_1", ZT = {
  container: QT
};
var Ua = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Partner/Partner.tsx";
const _N = ({
  img: e,
  title: t,
  info: n
}) => /* @__PURE__ */ L("div", {
  className: ZT.container,
  children: [/* @__PURE__ */ L("div", {
    children: e
  }, void 0, !1, {
    fileName: Ua,
    lineNumber: 16,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ L("h3", {
    children: t
  }, void 0, !1, {
    fileName: Ua,
    lineNumber: 17,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ L("p", {
    children: n
  }, void 0, !1, {
    fileName: Ua,
    lineNumber: 18,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Ua,
  lineNumber: 15,
  columnNumber: 5
}, void 0);
var JT = /* @__PURE__ */ ((e) => (e.ETH = "ethereum", e.SOL = "solana", e.CMPD = "compound", e.POL = "polygon", e))(JT || {});
const eN = (e) => {
  const t = Math.floor(e), n = Math.max(Math.floor(Math.log(t) / Math.log(1e3)) + 1, 1);
  return `${Array.from(
    { length: n },
    (o, a) => Math.floor(t % 1e3 ** (n - a) / 1e3 ** (n - a - 1))
  ).map((o, a) => a === 0 ? `${o}` : `${o}`.padStart(3, "0")).join(",")}`;
}, SN = (e) => {
  const n = `${Math.floor(e * 100 % 100)}`.padStart(2, "0");
  return `$${eN(e)}.${n}`;
}, sh = 12 / 2, RN = (e) => {
  const t = e.substring(0, sh), n = e.substring(
    e.length - sh,
    e.length
  );
  return `${t}..${n}`;
}, CN = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0"), r = `${e.getFullYear() % 100}`.padStart(2, "0"), i = e.getHours(), o = `${i === 0 ? 0 : i % 12 || 12}`.padStart(2, "0"), a = `${e.getMinutes()}`.padStart(2, "0"), u = i < 12 ? "am" : "pm";
  return `${t}.${n}.${r} ${o}:${a}${u}`;
}, PN = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0");
  return `${e.getFullYear()}-${n}-${t}`;
};
export {
  QP as AnchorButton,
  yN as Card,
  wN as ContinuousCarousel,
  oN as DataTable,
  mN as DesktopOnly,
  aN as Display,
  eT as FilterButton,
  pN as FilterCriteria,
  xN as FooterItem,
  aT as GeneralButton,
  uN as Heading,
  iN as LineChart,
  Nm as LinkButton,
  bN as ManualCarousel,
  lN as NavBar,
  bT as NavBarModal,
  fN as Navigation,
  _N as Partner,
  dN as ReusableGrid,
  gN as Row,
  JT as SupportedChains,
  hN as Tab,
  vN as TabBar,
  cN as TabButton,
  sN as Text,
  CN as formatTo12HrDate,
  PN as formatToGraphQLDate,
  eN as numberToCommaSeparated,
  SN as numberToMonetaryString,
  RN as trimAddress
};
