import * as Bn from "react";
import gn, { useRef as nn, useState as vr, useMemo as Wt, useEffect as an, useLayoutEffect as $g, forwardRef as Fg, useCallback as xt, useContext as un, createContext as fh } from "react";
import dh, { unstable_batchedUpdates as Ig } from "react-dom";
var _i = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
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
var ke = { exports: {} }, ws = { exports: {} }, Ct = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Af;
function Bg() {
  if (Af)
    return Ct;
  Af = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, N = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, F = e ? Symbol.for("react.scope") : 60119;
  function T(M) {
    if (typeof M == "object" && M !== null) {
      var z = M.$$typeof;
      switch (z) {
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
                  return z;
              }
          }
        case n:
          return z;
      }
    }
  }
  function G(M) {
    return T(M) === c;
  }
  return Ct.AsyncMode = f, Ct.ConcurrentMode = c, Ct.ContextConsumer = u, Ct.ContextProvider = a, Ct.Element = t, Ct.ForwardRef = h, Ct.Fragment = r, Ct.Lazy = _, Ct.Memo = P, Ct.Portal = n, Ct.Profiler = o, Ct.StrictMode = i, Ct.Suspense = p, Ct.isAsyncMode = function(M) {
    return G(M) || T(M) === f;
  }, Ct.isConcurrentMode = G, Ct.isContextConsumer = function(M) {
    return T(M) === u;
  }, Ct.isContextProvider = function(M) {
    return T(M) === a;
  }, Ct.isElement = function(M) {
    return typeof M == "object" && M !== null && M.$$typeof === t;
  }, Ct.isForwardRef = function(M) {
    return T(M) === h;
  }, Ct.isFragment = function(M) {
    return T(M) === r;
  }, Ct.isLazy = function(M) {
    return T(M) === _;
  }, Ct.isMemo = function(M) {
    return T(M) === P;
  }, Ct.isPortal = function(M) {
    return T(M) === n;
  }, Ct.isProfiler = function(M) {
    return T(M) === o;
  }, Ct.isStrictMode = function(M) {
    return T(M) === i;
  }, Ct.isSuspense = function(M) {
    return T(M) === p;
  }, Ct.isValidElementType = function(M) {
    return typeof M == "string" || typeof M == "function" || M === r || M === c || M === o || M === i || M === p || M === w || typeof M == "object" && M !== null && (M.$$typeof === _ || M.$$typeof === P || M.$$typeof === a || M.$$typeof === u || M.$$typeof === h || M.$$typeof === I || M.$$typeof === k || M.$$typeof === F || M.$$typeof === N);
  }, Ct.typeOf = T, Ct;
}
var Pt = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kf;
function Dg() {
  return kf || (kf = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, N = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, F = e ? Symbol.for("react.scope") : 60119;
    function T(D) {
      return typeof D == "string" || typeof D == "function" || D === r || D === c || D === o || D === i || D === p || D === w || typeof D == "object" && D !== null && (D.$$typeof === _ || D.$$typeof === P || D.$$typeof === a || D.$$typeof === u || D.$$typeof === h || D.$$typeof === I || D.$$typeof === k || D.$$typeof === F || D.$$typeof === N);
    }
    function G(D) {
      if (typeof D == "object" && D !== null) {
        var gt = D.$$typeof;
        switch (gt) {
          case t:
            var ct = D.type;
            switch (ct) {
              case f:
              case c:
              case r:
              case o:
              case i:
              case p:
                return ct;
              default:
                var St = ct && ct.$$typeof;
                switch (St) {
                  case u:
                  case h:
                  case _:
                  case P:
                  case a:
                    return St;
                  default:
                    return gt;
                }
            }
          case n:
            return gt;
        }
      }
    }
    var M = f, z = c, te = u, Q = a, fe = t, me = h, re = r, ee = _, be = P, Oe = n, ut = o, Ue = i, st = p, lt = !1;
    function dt(D) {
      return lt || (lt = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), V(D) || G(D) === f;
    }
    function V(D) {
      return G(D) === c;
    }
    function ue(D) {
      return G(D) === u;
    }
    function Ne(D) {
      return G(D) === a;
    }
    function Ae(D) {
      return typeof D == "object" && D !== null && D.$$typeof === t;
    }
    function Ce(D) {
      return G(D) === h;
    }
    function Re(D) {
      return G(D) === r;
    }
    function Te(D) {
      return G(D) === _;
    }
    function Be(D) {
      return G(D) === P;
    }
    function Le(D) {
      return G(D) === n;
    }
    function X(D) {
      return G(D) === o;
    }
    function ce(D) {
      return G(D) === i;
    }
    function Ge(D) {
      return G(D) === p;
    }
    Pt.AsyncMode = M, Pt.ConcurrentMode = z, Pt.ContextConsumer = te, Pt.ContextProvider = Q, Pt.Element = fe, Pt.ForwardRef = me, Pt.Fragment = re, Pt.Lazy = ee, Pt.Memo = be, Pt.Portal = Oe, Pt.Profiler = ut, Pt.StrictMode = Ue, Pt.Suspense = st, Pt.isAsyncMode = dt, Pt.isConcurrentMode = V, Pt.isContextConsumer = ue, Pt.isContextProvider = Ne, Pt.isElement = Ae, Pt.isForwardRef = Ce, Pt.isFragment = Re, Pt.isLazy = Te, Pt.isMemo = Be, Pt.isPortal = Le, Pt.isProfiler = X, Pt.isStrictMode = ce, Pt.isSuspense = Ge, Pt.isValidElementType = T, Pt.typeOf = G;
  }()), Pt;
}
var $f;
function ph() {
  return $f || ($f = 1, function(e) {
    process.env.NODE_ENV === "production" ? e.exports = Bg() : e.exports = Dg();
  }(ws)), ws.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var xs, Ff;
function lc() {
  if (Ff)
    return xs;
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
  return xs = i() ? Object.assign : function(o, a) {
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
  }, xs;
}
var _s, If;
function cc() {
  if (If)
    return _s;
  If = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return _s = e, _s;
}
var Ss, Bf;
function hh() {
  return Bf || (Bf = 1, Ss = Function.call.bind(Object.prototype.hasOwnProperty)), Ss;
}
var Rs, Df;
function zg() {
  if (Df)
    return Rs;
  Df = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = cc(), n = {}, r = hh();
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
  }, Rs = i, Rs;
}
var Cs, zf;
function Lg() {
  if (zf)
    return Cs;
  zf = 1;
  var e = ph(), t = lc(), n = cc(), r = hh(), i = zg(), o = function() {
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
  return Cs = function(u, f) {
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
      arrayOf: T,
      element: G(),
      elementType: M(),
      instanceOf: z,
      node: me(),
      objectOf: Q,
      oneOf: te,
      oneOfType: fe,
      shape: ee,
      exact: be
    };
    function _(V, ue) {
      return V === ue ? V !== 0 || 1 / V === 1 / ue : V !== V && ue !== ue;
    }
    function N(V, ue) {
      this.message = V, this.data = ue && typeof ue == "object" ? ue : {}, this.stack = "";
    }
    N.prototype = Error.prototype;
    function I(V) {
      if (process.env.NODE_ENV !== "production")
        var ue = {}, Ne = 0;
      function Ae(Re, Te, Be, Le, X, ce, Ge) {
        if (Le = Le || w, ce = ce || Be, Ge !== n) {
          if (f) {
            var D = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw D.name = "Invariant Violation", D;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var gt = Le + ":" + Be;
            !ue[gt] && Ne < 3 && (o(
              "You are manually calling a React.PropTypes validation function for the `" + ce + "` prop on `" + Le + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), ue[gt] = !0, Ne++);
          }
        }
        return Te[Be] == null ? Re ? Te[Be] === null ? new N("The " + X + " `" + ce + "` is marked as required " + ("in `" + Le + "`, but its value is `null`.")) : new N("The " + X + " `" + ce + "` is marked as required in " + ("`" + Le + "`, but its value is `undefined`.")) : null : V(Te, Be, Le, X, ce);
      }
      var Ce = Ae.bind(null, !1);
      return Ce.isRequired = Ae.bind(null, !0), Ce;
    }
    function k(V) {
      function ue(Ne, Ae, Ce, Re, Te, Be) {
        var Le = Ne[Ae], X = Ue(Le);
        if (X !== V) {
          var ce = st(Le);
          return new N(
            "Invalid " + Re + " `" + Te + "` of type " + ("`" + ce + "` supplied to `" + Ce + "`, expected ") + ("`" + V + "`."),
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
    function T(V) {
      function ue(Ne, Ae, Ce, Re, Te) {
        if (typeof V != "function")
          return new N("Property `" + Te + "` of component `" + Ce + "` has invalid PropType notation inside arrayOf.");
        var Be = Ne[Ae];
        if (!Array.isArray(Be)) {
          var Le = Ue(Be);
          return new N("Invalid " + Re + " `" + Te + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an array."));
        }
        for (var X = 0; X < Be.length; X++) {
          var ce = V(Be, X, Ce, Re, Te + "[" + X + "]", n);
          if (ce instanceof Error)
            return ce;
        }
        return null;
      }
      return I(ue);
    }
    function G() {
      function V(ue, Ne, Ae, Ce, Re) {
        var Te = ue[Ne];
        if (!u(Te)) {
          var Be = Ue(Te);
          return new N("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Be + "` supplied to `" + Ae + "`, expected a single ReactElement."));
        }
        return null;
      }
      return I(V);
    }
    function M() {
      function V(ue, Ne, Ae, Ce, Re) {
        var Te = ue[Ne];
        if (!e.isValidElementType(Te)) {
          var Be = Ue(Te);
          return new N("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Be + "` supplied to `" + Ae + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return I(V);
    }
    function z(V) {
      function ue(Ne, Ae, Ce, Re, Te) {
        if (!(Ne[Ae] instanceof V)) {
          var Be = V.name || w, Le = dt(Ne[Ae]);
          return new N("Invalid " + Re + " `" + Te + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected ") + ("instance of `" + Be + "`."));
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
      function ue(Ne, Ae, Ce, Re, Te) {
        for (var Be = Ne[Ae], Le = 0; Le < V.length; Le++)
          if (_(Be, V[Le]))
            return null;
        var X = JSON.stringify(V, function(Ge, D) {
          var gt = st(D);
          return gt === "symbol" ? String(D) : D;
        });
        return new N("Invalid " + Re + " `" + Te + "` of value `" + String(Be) + "` " + ("supplied to `" + Ce + "`, expected one of " + X + "."));
      }
      return I(ue);
    }
    function Q(V) {
      function ue(Ne, Ae, Ce, Re, Te) {
        if (typeof V != "function")
          return new N("Property `" + Te + "` of component `" + Ce + "` has invalid PropType notation inside objectOf.");
        var Be = Ne[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new N("Invalid " + Re + " `" + Te + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an object."));
        for (var X in Be)
          if (r(Be, X)) {
            var ce = V(Be, X, Ce, Re, Te + "." + X, n);
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
        var Ne = V[ue];
        if (typeof Ne != "function")
          return o(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + lt(Ne) + " at index " + ue + "."
          ), a;
      }
      function Ae(Ce, Re, Te, Be, Le) {
        for (var X = [], ce = 0; ce < V.length; ce++) {
          var Ge = V[ce], D = Ge(Ce, Re, Te, Be, Le, n);
          if (D == null)
            return null;
          D.data && r(D.data, "expectedType") && X.push(D.data.expectedType);
        }
        var gt = X.length > 0 ? ", expected one of type [" + X.join(", ") + "]" : "";
        return new N("Invalid " + Be + " `" + Le + "` supplied to " + ("`" + Te + "`" + gt + "."));
      }
      return I(Ae);
    }
    function me() {
      function V(ue, Ne, Ae, Ce, Re) {
        return Oe(ue[Ne]) ? null : new N("Invalid " + Ce + " `" + Re + "` supplied to " + ("`" + Ae + "`, expected a ReactNode."));
      }
      return I(V);
    }
    function re(V, ue, Ne, Ae, Ce) {
      return new N(
        (V || "React class") + ": " + ue + " type `" + Ne + "." + Ae + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + Ce + "`."
      );
    }
    function ee(V) {
      function ue(Ne, Ae, Ce, Re, Te) {
        var Be = Ne[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new N("Invalid " + Re + " `" + Te + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        for (var X in V) {
          var ce = V[X];
          if (typeof ce != "function")
            return re(Ce, Re, Te, X, st(ce));
          var Ge = ce(Be, X, Ce, Re, Te + "." + X, n);
          if (Ge)
            return Ge;
        }
        return null;
      }
      return I(ue);
    }
    function be(V) {
      function ue(Ne, Ae, Ce, Re, Te) {
        var Be = Ne[Ae], Le = Ue(Be);
        if (Le !== "object")
          return new N("Invalid " + Re + " `" + Te + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        var X = t({}, Ne[Ae], V);
        for (var ce in X) {
          var Ge = V[ce];
          if (r(V, ce) && typeof Ge != "function")
            return re(Ce, Re, Te, ce, st(Ge));
          if (!Ge)
            return new N(
              "Invalid " + Re + " `" + Te + "` key `" + ce + "` supplied to `" + Ce + "`.\nBad object: " + JSON.stringify(Ne[Ae], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(V), null, "  ")
            );
          var D = Ge(Be, ce, Ce, Re, Te + "." + ce, n);
          if (D)
            return D;
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
            var Ne = ue.call(V), Ae;
            if (ue !== V.entries) {
              for (; !(Ae = Ne.next()).done; )
                if (!Oe(Ae.value))
                  return !1;
            } else
              for (; !(Ae = Ne.next()).done; ) {
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
  }, Cs;
}
var Ps, Lf;
function Gg() {
  if (Lf)
    return Ps;
  Lf = 1;
  var e = cc();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, Ps = function() {
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
  }, Ps;
}
if (process.env.NODE_ENV !== "production") {
  var jg = ph(), Hg = !0;
  ke.exports = Lg()(jg.isElement, Hg);
} else
  ke.exports = Gg()();
var fc = { exports: {} }, io = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gf;
function Wg() {
  if (Gf)
    return io;
  if (Gf = 1, lc(), io.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var e = Symbol.for;
    io.Fragment = e("react.fragment");
  }
  return io.jsxDEV = void 0, io;
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
function Ug() {
  return jf || (jf = 1, function(e) {
    process.env.NODE_ENV !== "production" && function() {
      var t = gn, n = lc(), r = 60103, i = 60106;
      e.Fragment = 60107;
      var o = 60108, a = 60114, u = 60109, f = 60110, c = 60112, h = 60113, p = 60120, w = 60115, P = 60116, _ = 60121, N = 60122, I = 60117, k = 60129, F = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var T = Symbol.for;
        r = T("react.element"), i = T("react.portal"), e.Fragment = T("react.fragment"), o = T("react.strict_mode"), a = T("react.profiler"), u = T("react.provider"), f = T("react.context"), c = T("react.forward_ref"), h = T("react.suspense"), p = T("react.suspense_list"), w = T("react.memo"), P = T("react.lazy"), _ = T("react.block"), N = T("react.server.block"), I = T("react.fundamental"), T("react.scope"), T("react.opaque.id"), k = T("react.debug_trace_mode"), T("react.offscreen"), F = T("react.legacy_hidden");
      }
      var G = typeof Symbol == "function" && Symbol.iterator, M = "@@iterator";
      function z(O) {
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
          var ze = te.ReactDebugCurrentFrame, ht = ze.getStackAddendum();
          ht !== "" && (J += "%s", he = he.concat([ht]));
          var yt = he.map(function(ot) {
            return "" + ot;
          });
          yt.unshift("Warning: " + J), Function.prototype.apply.call(console[O], console, yt);
        }
      }
      var me = !1;
      function re(O) {
        return !!(typeof O == "string" || typeof O == "function" || O === e.Fragment || O === a || O === k || O === o || O === h || O === p || O === F || me || typeof O == "object" && O !== null && (O.$$typeof === P || O.$$typeof === w || O.$$typeof === u || O.$$typeof === f || O.$$typeof === c || O.$$typeof === I || O.$$typeof === _ || O[0] === N));
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
              var ze = O, ht = ze._payload, yt = ze._init;
              try {
                return Oe(yt(ht));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var ut = 0, Ue, st, lt, dt, V, ue, Ne;
      function Ae() {
      }
      Ae.__reactDisabledLog = !0;
      function Ce() {
        {
          if (ut === 0) {
            Ue = console.log, st = console.info, lt = console.warn, dt = console.error, V = console.group, ue = console.groupCollapsed, Ne = console.groupEnd;
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
                value: Ne
              })
            });
          }
          ut < 0 && Q("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Te = te.ReactCurrentDispatcher, Be;
      function Le(O, J, he) {
        {
          if (Be === void 0)
            try {
              throw Error();
            } catch (ht) {
              var ze = ht.stack.trim().match(/\n( *(at )?)/);
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
      function D(O, J) {
        if (!O || X)
          return "";
        {
          var he = ce.get(O);
          if (he !== void 0)
            return he;
        }
        var ze;
        X = !0;
        var ht = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var yt;
        yt = Te.current, Te.current = null, Ce();
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
              } catch (cn) {
                ze = cn;
              }
              Reflect.construct(O, [], ot);
            } else {
              try {
                ot.call();
              } catch (cn) {
                ze = cn;
              }
              O.call(ot.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (cn) {
              ze = cn;
            }
            O();
          }
        } catch (cn) {
          if (cn && ze && typeof cn.stack == "string") {
            for (var rt = cn.stack.split(`
`), kt = ze.stack.split(`
`), Nt = rt.length - 1, Mt = kt.length - 1; Nt >= 1 && Mt >= 0 && rt[Nt] !== kt[Mt]; )
              Mt--;
            for (; Nt >= 1 && Mt >= 0; Nt--, Mt--)
              if (rt[Nt] !== kt[Mt]) {
                if (Nt !== 1 || Mt !== 1)
                  do
                    if (Nt--, Mt--, Mt < 0 || rt[Nt] !== kt[Mt]) {
                      var hn = `
` + rt[Nt].replace(" at new ", " at ");
                      return typeof O == "function" && ce.set(O, hn), hn;
                    }
                  while (Nt >= 1 && Mt >= 0);
                break;
              }
          }
        } finally {
          X = !1, Te.current = yt, Re(), Error.prepareStackTrace = ht;
        }
        var Vn = O ? O.displayName || O.name : "", Hr = Vn ? Le(Vn) : "";
        return typeof O == "function" && ce.set(O, Hr), Hr;
      }
      function gt(O, J, he) {
        return D(O, !1);
      }
      function ct(O) {
        var J = O.prototype;
        return !!(J && J.isReactComponent);
      }
      function St(O, J, he) {
        if (O == null)
          return "";
        if (typeof O == "function")
          return D(O, ct(O));
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
              return St(O.type, J, he);
            case _:
              return gt(O._render);
            case P: {
              var ze = O, ht = ze._payload, yt = ze._init;
              try {
                return St(yt(ht), J, he);
              } catch {
              }
            }
          }
        return "";
      }
      var At = {}, Zt = te.ReactDebugCurrentFrame;
      function sn(O) {
        if (O) {
          var J = O._owner, he = St(O.type, O._source, J ? J.type : null);
          Zt.setExtraStackFrame(he);
        } else
          Zt.setExtraStackFrame(null);
      }
      function bn(O, J, he, ze, ht) {
        {
          var yt = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var ot in O)
            if (yt(O, ot)) {
              var rt = void 0;
              try {
                if (typeof O[ot] != "function") {
                  var kt = Error((ze || "React class") + ": " + he + " type `" + ot + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof O[ot] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw kt.name = "Invariant Violation", kt;
                }
                rt = O[ot](J, ot, ze, he, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Nt) {
                rt = Nt;
              }
              rt && !(rt instanceof Error) && (sn(ht), Q("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ze || "React class", he, ot, typeof rt), sn(null)), rt instanceof Error && !(rt.message in At) && (At[rt.message] = !0, sn(ht), Q("Failed %s type: %s", he, rt.message), sn(null));
            }
        }
      }
      var wn = te.ReactCurrentOwner, xn = Object.prototype.hasOwnProperty, Ln = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, ir, Gn, _n;
      _n = {};
      function Yt(O) {
        if (xn.call(O, "ref")) {
          var J = Object.getOwnPropertyDescriptor(O, "ref").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.ref !== void 0;
      }
      function On(O) {
        if (xn.call(O, "key")) {
          var J = Object.getOwnPropertyDescriptor(O, "key").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.key !== void 0;
      }
      function or(O, J) {
        if (typeof O.ref == "string" && wn.current && J && wn.current.stateNode !== J) {
          var he = Oe(wn.current.type);
          _n[he] || (Q('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Oe(wn.current.type), O.ref), _n[he] = !0);
        }
      }
      function yr(O, J) {
        {
          var he = function() {
            ir || (ir = !0, Q("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          he.isReactWarning = !0, Object.defineProperty(O, "key", {
            get: he,
            configurable: !0
          });
        }
      }
      function br(O, J) {
        {
          var he = function() {
            Gn || (Gn = !0, Q("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          he.isReactWarning = !0, Object.defineProperty(O, "ref", {
            get: he,
            configurable: !0
          });
        }
      }
      var ar = function(O, J, he, ze, ht, yt, ot) {
        var rt = {
          $$typeof: r,
          type: O,
          key: J,
          ref: he,
          props: ot,
          _owner: yt
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
          value: ht
        }), Object.freeze && (Object.freeze(rt.props), Object.freeze(rt)), rt;
      };
      function wr(O, J, he, ze, ht) {
        {
          var yt, ot = {}, rt = null, kt = null;
          he !== void 0 && (rt = "" + he), On(J) && (rt = "" + J.key), Yt(J) && (kt = J.ref, or(J, ht));
          for (yt in J)
            xn.call(J, yt) && !Ln.hasOwnProperty(yt) && (ot[yt] = J[yt]);
          if (O && O.defaultProps) {
            var Nt = O.defaultProps;
            for (yt in Nt)
              ot[yt] === void 0 && (ot[yt] = Nt[yt]);
          }
          if (rt || kt) {
            var Mt = typeof O == "function" ? O.displayName || O.name || "Unknown" : O;
            rt && yr(ot, Mt), kt && br(ot, Mt);
          }
          return ar(O, rt, kt, ht, ze, wn.current, ot);
        }
      }
      var jn = te.ReactCurrentOwner, Hn = te.ReactDebugCurrentFrame;
      function ln(O) {
        if (O) {
          var J = O._owner, he = St(O.type, O._source, J ? J.type : null);
          Hn.setExtraStackFrame(he);
        } else
          Hn.setExtraStackFrame(null);
      }
      var Sn;
      Sn = !1;
      function An(O) {
        return typeof O == "object" && O !== null && O.$$typeof === r;
      }
      function kn() {
        {
          if (jn.current) {
            var O = Oe(jn.current.type);
            if (O)
              return `

Check the render method of \`` + O + "`.";
          }
          return "";
        }
      }
      function ur(O) {
        {
          if (O !== void 0) {
            var J = O.fileName.replace(/^.*[\\\/]/, ""), he = O.lineNumber;
            return `

Check your code at ` + J + ":" + he + ".";
          }
          return "";
        }
      }
      var $n = {};
      function sr(O) {
        {
          var J = kn();
          if (!J) {
            var he = typeof O == "string" ? O : O.displayName || O.name;
            he && (J = `

Check the top-level render call using <` + he + ">.");
          }
          return J;
        }
      }
      function Wn(O, J) {
        {
          if (!O._store || O._store.validated || O.key != null)
            return;
          O._store.validated = !0;
          var he = sr(J);
          if ($n[he])
            return;
          $n[he] = !0;
          var ze = "";
          O && O._owner && O._owner !== jn.current && (ze = " It was passed a child from " + Oe(O._owner.type) + "."), ln(O), Q('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', he, ze), ln(null);
        }
      }
      function Un(O, J) {
        {
          if (typeof O != "object")
            return;
          if (Array.isArray(O))
            for (var he = 0; he < O.length; he++) {
              var ze = O[he];
              An(ze) && Wn(ze, J);
            }
          else if (An(O))
            O._store && (O._store.validated = !0);
          else if (O) {
            var ht = z(O);
            if (typeof ht == "function" && ht !== O.entries)
              for (var yt = ht.call(O), ot; !(ot = yt.next()).done; )
                An(ot.value) && Wn(ot.value, J);
          }
        }
      }
      function Rn(O) {
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
            bn(he, O.props, "prop", ze, O);
          } else if (J.PropTypes !== void 0 && !Sn) {
            Sn = !0;
            var ht = Oe(J);
            Q("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ht || "Unknown");
          }
          typeof J.getDefaultProps == "function" && !J.getDefaultProps.isReactClassApproved && Q("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function xr(O) {
        {
          for (var J = Object.keys(O.props), he = 0; he < J.length; he++) {
            var ze = J[he];
            if (ze !== "children" && ze !== "key") {
              ln(O), Q("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ze), ln(null);
              break;
            }
          }
          O.ref !== null && (ln(O), Q("Invalid attribute `ref` supplied to `React.Fragment`."), ln(null));
        }
      }
      function Gt(O, J, he, ze, ht, yt) {
        {
          var ot = re(O);
          if (!ot) {
            var rt = "";
            (O === void 0 || typeof O == "object" && O !== null && Object.keys(O).length === 0) && (rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var kt = ur(ht);
            kt ? rt += kt : rt += kn();
            var Nt;
            O === null ? Nt = "null" : Array.isArray(O) ? Nt = "array" : O !== void 0 && O.$$typeof === r ? (Nt = "<" + (Oe(O.type) || "Unknown") + " />", rt = " Did you accidentally export a JSX literal instead of a component?") : Nt = typeof O, Q("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Nt, rt);
          }
          var Mt = wr(O, J, he, ht, yt);
          if (Mt == null)
            return Mt;
          if (ot) {
            var hn = J.children;
            if (hn !== void 0)
              if (ze)
                if (Array.isArray(hn)) {
                  for (var Vn = 0; Vn < hn.length; Vn++)
                    Un(hn[Vn], O);
                  Object.freeze && Object.freeze(hn);
                } else
                  Q("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Un(hn, O);
          }
          return O === e.Fragment ? xr(Mt) : Rn(Mt), Mt;
        }
      }
      var Xt = Gt;
      e.jsxDEV = Xt;
    }();
  }(Ns)), Ns;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = Wg() : e.exports = Ug();
})(fc);
const zn = fc.exports.Fragment, B = fc.exports.jsxDEV;
function Vg(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var vh = Vg, qg = typeof _i == "object" && _i && _i.Object === Object && _i, Yg = qg, Xg = Yg, Kg = typeof self == "object" && self && self.Object === Object && self, Qg = Xg || Kg || Function("return this")(), mh = Qg, Zg = mh, Jg = function() {
  return Zg.Date.now();
}, e0 = Jg, t0 = /\s/;
function n0(e) {
  for (var t = e.length; t-- && t0.test(e.charAt(t)); )
    ;
  return t;
}
var r0 = n0, i0 = r0, o0 = /^\s+/;
function a0(e) {
  return e && e.slice(0, i0(e) + 1).replace(o0, "");
}
var u0 = a0, s0 = mh, l0 = s0.Symbol, gh = l0, Hf = gh, yh = Object.prototype, c0 = yh.hasOwnProperty, f0 = yh.toString, oo = Hf ? Hf.toStringTag : void 0;
function d0(e) {
  var t = c0.call(e, oo), n = e[oo];
  try {
    e[oo] = void 0;
    var r = !0;
  } catch {
  }
  var i = f0.call(e);
  return r && (t ? e[oo] = n : delete e[oo]), i;
}
var p0 = d0, h0 = Object.prototype, v0 = h0.toString;
function m0(e) {
  return v0.call(e);
}
var g0 = m0, Wf = gh, y0 = p0, b0 = g0, w0 = "[object Null]", x0 = "[object Undefined]", Uf = Wf ? Wf.toStringTag : void 0;
function _0(e) {
  return e == null ? e === void 0 ? x0 : w0 : Uf && Uf in Object(e) ? y0(e) : b0(e);
}
var S0 = _0;
function R0(e) {
  return e != null && typeof e == "object";
}
var C0 = R0, P0 = S0, N0 = C0, T0 = "[object Symbol]";
function E0(e) {
  return typeof e == "symbol" || N0(e) && P0(e) == T0;
}
var M0 = E0, O0 = u0, Vf = vh, A0 = M0, qf = 0 / 0, k0 = /^[-+]0x[0-9a-f]+$/i, $0 = /^0b[01]+$/i, F0 = /^0o[0-7]+$/i, I0 = parseInt;
function B0(e) {
  if (typeof e == "number")
    return e;
  if (A0(e))
    return qf;
  if (Vf(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Vf(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = O0(e);
  var n = $0.test(e);
  return n || F0.test(e) ? I0(e.slice(2), n ? 2 : 8) : k0.test(e) ? qf : +e;
}
var D0 = B0, z0 = vh, Ts = e0, Yf = D0, L0 = "Expected a function", G0 = Math.max, j0 = Math.min;
function H0(e, t, n) {
  var r, i, o, a, u, f, c = 0, h = !1, p = !1, w = !0;
  if (typeof e != "function")
    throw new TypeError(L0);
  t = Yf(t) || 0, z0(n) && (h = !!n.leading, p = "maxWait" in n, o = p ? G0(Yf(n.maxWait) || 0, t) : o, w = "trailing" in n ? !!n.trailing : w);
  function P(z) {
    var te = r, Q = i;
    return r = i = void 0, c = z, a = e.apply(Q, te), a;
  }
  function _(z) {
    return c = z, u = setTimeout(k, t), h ? P(z) : a;
  }
  function N(z) {
    var te = z - f, Q = z - c, fe = t - te;
    return p ? j0(fe, o - Q) : fe;
  }
  function I(z) {
    var te = z - f, Q = z - c;
    return f === void 0 || te >= t || te < 0 || p && Q >= o;
  }
  function k() {
    var z = Ts();
    if (I(z))
      return F(z);
    u = setTimeout(k, N(z));
  }
  function F(z) {
    return u = void 0, w && r ? P(z) : (r = i = void 0, a);
  }
  function T() {
    u !== void 0 && clearTimeout(u), c = 0, r = f = i = u = void 0;
  }
  function G() {
    return u === void 0 ? a : F(Ts());
  }
  function M() {
    var z = Ts(), te = I(z);
    if (r = arguments, i = this, f = z, te) {
      if (u === void 0)
        return _(f);
      if (p)
        return clearTimeout(u), u = setTimeout(k, t), P(f);
    }
    return u === void 0 && (u = setTimeout(k, t)), a;
  }
  return M.cancel = T, M.flush = G, M;
}
var bh = H0;
const dc = bh;
var Jr = [], W0 = function() {
  return Jr.some(function(e) {
    return e.activeTargets.length > 0;
  });
}, U0 = function() {
  return Jr.some(function(e) {
    return e.skippedTargets.length > 0;
  });
}, Xf = "ResizeObserver loop completed with undelivered notifications.", V0 = function() {
  var e;
  typeof ErrorEvent == "function" ? e = new ErrorEvent("error", {
    message: Xf
  }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = Xf), window.dispatchEvent(e);
}, ko;
(function(e) {
  e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(ko || (ko = {}));
var ei = function(e) {
  return Object.freeze(e);
}, wh = function() {
  function e(t, n) {
    this.inlineSize = t, this.blockSize = n, ei(this);
  }
  return e;
}(), xh = function() {
  function e(t, n, r, i) {
    return this.x = t, this.y = n, this.width = r, this.height = i, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, ei(this);
  }
  return e.prototype.toJSON = function() {
    var t = this, n = t.x, r = t.y, i = t.top, o = t.right, a = t.bottom, u = t.left, f = t.width, c = t.height;
    return { x: n, y: r, top: i, right: o, bottom: a, left: u, width: f, height: c };
  }, e.fromRect = function(t) {
    return new e(t.x, t.y, t.width, t.height);
  }, e;
}(), pc = function(e) {
  return e instanceof SVGElement && "getBBox" in e;
}, _h = function(e) {
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
}, q0 = function(e) {
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
}, Po = typeof window < "u" ? window : {}, Ta = /* @__PURE__ */ new WeakMap(), Qf = /auto|scroll/, Y0 = /^tb|vertical/, X0 = /msie|trident/i.test(Po.navigator && Po.navigator.userAgent), Yn = function(e) {
  return parseFloat(e || "0");
}, Ni = function(e, t, n) {
  return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new wh((n ? t : e) || 0, (n ? e : t) || 0);
}, Zf = ei({
  devicePixelContentBoxSize: Ni(),
  borderBoxSize: Ni(),
  contentBoxSize: Ni(),
  contentRect: new xh(0, 0, 0, 0)
}), Sh = function(e, t) {
  if (t === void 0 && (t = !1), Ta.has(e) && !t)
    return Ta.get(e);
  if (_h(e))
    return Ta.set(e, Zf), Zf;
  var n = getComputedStyle(e), r = pc(e) && e.ownerSVGElement && e.getBBox(), i = !X0 && n.boxSizing === "border-box", o = Y0.test(n.writingMode || ""), a = !r && Qf.test(n.overflowY || ""), u = !r && Qf.test(n.overflowX || ""), f = r ? 0 : Yn(n.paddingTop), c = r ? 0 : Yn(n.paddingRight), h = r ? 0 : Yn(n.paddingBottom), p = r ? 0 : Yn(n.paddingLeft), w = r ? 0 : Yn(n.borderTopWidth), P = r ? 0 : Yn(n.borderRightWidth), _ = r ? 0 : Yn(n.borderBottomWidth), N = r ? 0 : Yn(n.borderLeftWidth), I = p + c, k = f + h, F = N + P, T = w + _, G = u ? e.offsetHeight - T - e.clientHeight : 0, M = a ? e.offsetWidth - F - e.clientWidth : 0, z = i ? I + F : 0, te = i ? k + T : 0, Q = r ? r.width : Yn(n.width) - z - M, fe = r ? r.height : Yn(n.height) - te - G, me = Q + I + M + F, re = fe + k + G + T, ee = ei({
    devicePixelContentBoxSize: Ni(Math.round(Q * devicePixelRatio), Math.round(fe * devicePixelRatio), o),
    borderBoxSize: Ni(me, re, o),
    contentBoxSize: Ni(Q, fe, o),
    contentRect: new xh(p, f, Q, fe)
  });
  return Ta.set(e, ee), ee;
}, Rh = function(e, t, n) {
  var r = Sh(e, n), i = r.borderBoxSize, o = r.contentBoxSize, a = r.devicePixelContentBoxSize;
  switch (t) {
    case ko.DEVICE_PIXEL_CONTENT_BOX:
      return a;
    case ko.BORDER_BOX:
      return i;
    default:
      return o;
  }
}, Ch = function() {
  function e(t) {
    var n = Sh(t);
    this.target = t, this.contentRect = n.contentRect, this.borderBoxSize = ei([n.borderBoxSize]), this.contentBoxSize = ei([n.contentBoxSize]), this.devicePixelContentBoxSize = ei([n.devicePixelContentBoxSize]);
  }
  return e;
}(), Ph = function(e) {
  if (_h(e))
    return 1 / 0;
  for (var t = 0, n = e.parentNode; n; )
    t += 1, n = n.parentNode;
  return t;
}, K0 = function() {
  var e = 1 / 0, t = [];
  Jr.forEach(function(a) {
    if (a.activeTargets.length !== 0) {
      var u = [];
      a.activeTargets.forEach(function(c) {
        var h = new Ch(c.target), p = Ph(c.target);
        u.push(h), c.lastReportedSize = Rh(c.target, c.observedBox), p < e && (e = p);
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
  Jr.forEach(function(n) {
    n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(i) {
      i.isActive() && (Ph(i.target) > e ? n.activeTargets.push(i) : n.skippedTargets.push(i));
    });
  });
}, Q0 = function() {
  var e = 0;
  for (Jf(e); W0(); )
    e = K0(), Jf(e);
  return U0() && V0(), e > 0;
}, Es, Nh = [], Z0 = function() {
  return Nh.splice(0).forEach(function(e) {
    return e();
  });
}, J0 = function(e) {
  if (!Es) {
    var t = 0, n = document.createTextNode(""), r = { characterData: !0 };
    new MutationObserver(function() {
      return Z0();
    }).observe(n, r), Es = function() {
      n.textContent = "".concat(t ? t-- : t++);
    };
  }
  Nh.push(e), Es();
}, ey = function(e) {
  J0(function() {
    requestAnimationFrame(e);
  });
}, Ua = 0, ty = function() {
  return !!Ua;
}, ny = 250, ry = { attributes: !0, characterData: !0, childList: !0, subtree: !0 }, ed = [
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
}, Ms = !1, iy = function() {
  function e() {
    var t = this;
    this.stopped = !0, this.listener = function() {
      return t.schedule();
    };
  }
  return e.prototype.run = function(t) {
    var n = this;
    if (t === void 0 && (t = ny), !Ms) {
      Ms = !0;
      var r = td(t);
      ey(function() {
        var i = !1;
        try {
          i = Q0();
        } finally {
          if (Ms = !1, t = r - td(), !ty())
            return;
          i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
        }
      });
    }
  }, e.prototype.schedule = function() {
    this.stop(), this.run();
  }, e.prototype.observe = function() {
    var t = this, n = function() {
      return t.observer && t.observer.observe(document.body, ry);
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
}(), pl = new iy(), nd = function(e) {
  !Ua && e > 0 && pl.start(), Ua += e, !Ua && pl.stop();
}, oy = function(e) {
  return !pc(e) && !q0(e) && getComputedStyle(e).display === "inline";
}, ay = function() {
  function e(t, n) {
    this.target = t, this.observedBox = n || ko.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return e.prototype.isActive = function() {
    var t = Rh(this.target, this.observedBox, !0);
    return oy(this.target) && (this.lastReportedSize = t), this.lastReportedSize.inlineSize !== t.inlineSize || this.lastReportedSize.blockSize !== t.blockSize;
  }, e;
}(), uy = function() {
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
    var r = new uy(t, n);
    Ea.set(t, r);
  }, e.observe = function(t, n, r) {
    var i = Ea.get(t), o = i.observationTargets.length === 0;
    rd(i.observationTargets, n) < 0 && (o && Jr.push(i), i.observationTargets.push(new ay(n, r && r.box)), nd(1), pl.schedule());
  }, e.unobserve = function(t, n) {
    var r = Ea.get(t), i = rd(r.observationTargets, n), o = r.observationTargets.length === 1;
    i >= 0 && (o && Jr.splice(Jr.indexOf(r), 1), r.observationTargets.splice(i, 1), nd(-1));
  }, e.disconnect = function(t) {
    var n = this, r = Ea.get(t);
    r.observationTargets.slice().forEach(function(i) {
      return n.unobserve(t, i.target);
    }), r.activeTargets.splice(0, r.activeTargets.length);
  }, e;
}(), sy = function() {
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
const ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ResizeObserver: sy,
  ResizeObserverEntry: Ch,
  ResizeObserverSize: wh
}, Symbol.toStringTag, { value: "Module" }));
var cy = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/responsive/esm/components/ParentSizeModern.js", fy = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
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
function dy(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var py = [];
function Th(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? py : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = dy(e, fy), w = nn(null), P = nn(0), _ = vr({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), N = _[0], I = _[1], k = Wt(function() {
    var F = Array.isArray(a) ? a : [a];
    return dc(function(T) {
      I(function(G) {
        var M = Object.keys(G), z = M.filter(function(Q) {
          return G[Q] !== T[Q];
        }), te = z.every(function(Q) {
          return F.includes(Q);
        });
        return te ? G : T;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return an(function() {
    var F = new window.ResizeObserver(function(T) {
      T.forEach(function(G) {
        var M = G.contentRect, z = M.left, te = M.top, Q = M.width, fe = M.height;
        P.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: z
          });
        });
      });
    });
    return w.current && F.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), F.disconnect(), k.cancel();
    };
  }, [k]), /* @__PURE__ */ B("div", {
    style: f,
    ref: w,
    className: t,
    ...p,
    children: n(hl({}, N, {
      ref: w.current,
      resize: k
    }))
  }, void 0, !1, {
    fileName: cy,
    lineNumber: 81,
    columnNumber: 23
  }, this);
}
Th.propTypes = {
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
const hy = mu.exports;
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
function vy(e) {
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
  const [a, u] = vr({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  }), f = nn({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: a
  }), c = t ? typeof t == "number" ? t : t.scroll : null, h = t ? typeof t == "number" ? t : t.resize : null, p = nn(!1);
  an(() => (p.current = !0, () => void (p.current = !1)));
  const [w, P, _] = Wt(() => {
    const F = () => {
      if (!f.current.element)
        return;
      const {
        left: T,
        top: G,
        width: M,
        height: z,
        bottom: te,
        right: Q,
        x: fe,
        y: me
      } = f.current.element.getBoundingClientRect(), re = {
        left: T,
        top: G,
        width: M,
        height: z,
        bottom: te,
        right: Q,
        x: fe,
        y: me
      };
      f.current.element instanceof HTMLElement && i && (re.height = f.current.element.offsetHeight, re.width = f.current.element.offsetWidth), Object.freeze(re), p.current && !by(f.current.lastBounds, re) && u(f.current.lastBounds = re);
    };
    return [F, h ? id(F, h) : F, c ? id(F, c) : F];
  }, [u, i, c, h]);
  function N() {
    f.current.scrollContainers && (f.current.scrollContainers.forEach((F) => F.removeEventListener("scroll", _, !0)), f.current.scrollContainers = null), f.current.resizeObserver && (f.current.resizeObserver.disconnect(), f.current.resizeObserver = null);
  }
  function I() {
    !f.current.element || (f.current.resizeObserver = new o(_), f.current.resizeObserver.observe(f.current.element), n && f.current.scrollContainers && f.current.scrollContainers.forEach((F) => F.addEventListener("scroll", _, {
      capture: !0,
      passive: !0
    })));
  }
  const k = (F) => {
    !F || F === f.current.element || (N(), f.current.element = F, f.current.scrollContainers = Eh(F), I());
  };
  return gy(_, Boolean(n)), my(P), an(() => {
    N(), I();
  }, [n, _, P]), an(() => N, []), [k, a, w];
}
function my(e) {
  an(() => {
    const t = e;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [e]);
}
function gy(e, t) {
  an(() => {
    if (t) {
      const n = e;
      return window.addEventListener("scroll", n, {
        capture: !0,
        passive: !0
      }), () => void window.removeEventListener("scroll", n, !0);
    }
  }, [e, t]);
}
function Eh(e) {
  const t = [];
  if (!e || e === document.body)
    return t;
  const {
    overflow: n,
    overflowX: r,
    overflowY: i
  } = window.getComputedStyle(e);
  return [n, r, i].some((o) => o === "auto" || o === "scroll") && t.push(e), [...t, ...Eh(e.parentElement)];
}
const yy = ["x", "y", "top", "bottom", "left", "right", "width", "height"], by = (e, t) => yy.every((n) => e[n] === t[n]);
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
function wy(e) {
  return !!e && e instanceof Element;
}
function xy(e) {
  return !!e && (e instanceof SVGElement || "ownerSVGElement" in e);
}
function _y(e) {
  return !!e && "createSVGPoint" in e;
}
function Sy(e) {
  return !!e && "getScreenCTM" in e;
}
function Ry(e) {
  return !!e && "changedTouches" in e;
}
function Cy(e) {
  return !!e && "clientX" in e;
}
function Py(e) {
  return !!e && (e instanceof Event || "nativeEvent" in e && e.nativeEvent instanceof Event);
}
function No() {
  return No = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, No.apply(this, arguments);
}
var Os = {
  x: 0,
  y: 0
};
function Ny(e) {
  if (!e)
    return No({}, Os);
  if (Ry(e))
    return e.changedTouches.length > 0 ? {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    } : No({}, Os);
  if (Cy(e))
    return {
      x: e.clientX,
      y: e.clientY
    };
  var t = e == null ? void 0 : e.target, n = t && "getBoundingClientRect" in t ? t.getBoundingClientRect() : null;
  return n ? {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  } : No({}, Os);
}
function ud(e, t) {
  if (!e || !t)
    return null;
  var n = Ny(t), r = xy(e) ? e.ownerSVGElement : e, i = Sy(r) ? r.getScreenCTM() : null;
  if (_y(r) && i) {
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
function Ty(e, t) {
  if (wy(e) && t)
    return ud(e, t);
  if (Py(e)) {
    var n = e, r = n.target;
    if (r)
      return ud(r, n);
  }
  return null;
}
var ml = Math.PI, gl = 2 * ml, Qr = 1e-6, Ey = gl - Qr;
function yl() {
  this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
}
function zi() {
  return new yl();
}
yl.prototype = zi.prototype = {
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
    else if (p > Qr)
      if (!(Math.abs(h * u - f * c) > Qr) || !i)
        this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
      else {
        var w = n - o, P = r - a, _ = u * u + f * f, N = w * w + P * P, I = Math.sqrt(_), k = Math.sqrt(p), F = i * Math.tan((ml - Math.acos((_ + p - N) / (2 * I * k))) / 2), T = F / k, G = F / I;
        Math.abs(T - 1) > Qr && (this._ += "L" + (e + T * c) + "," + (t + T * h)), this._ += "A" + i + "," + i + ",0,0," + +(h * w > c * P) + "," + (this._x1 = e + G * u) + "," + (this._y1 = t + G * f);
      }
  },
  arc: function(e, t, n, r, i, o) {
    e = +e, t = +t, n = +n, o = !!o;
    var a = n * Math.cos(r), u = n * Math.sin(r), f = e + a, c = t + u, h = 1 ^ o, p = o ? r - i : i - r;
    if (n < 0)
      throw new Error("negative radius: " + n);
    this._x1 === null ? this._ += "M" + f + "," + c : (Math.abs(this._x1 - f) > Qr || Math.abs(this._y1 - c) > Qr) && (this._ += "L" + f + "," + c), n && (p < 0 && (p = p % gl + gl), p > Ey ? this._ += "A" + n + "," + n + ",0,1," + h + "," + (e - a) + "," + (t - u) + "A" + n + "," + n + ",0,1," + h + "," + (this._x1 = f) + "," + (this._y1 = c) : p > Qr && (this._ += "A" + n + "," + n + ",0," + +(p >= ml) + "," + h + "," + (this._x1 = e + n * Math.cos(i)) + "," + (this._y1 = t + n * Math.sin(i))));
  },
  rect: function(e, t, n, r) {
    this._ += "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t) + "h" + +n + "v" + +r + "h" + -n + "Z";
  },
  toString: function() {
    return this._;
  }
};
function mt(e) {
  return function() {
    return e;
  };
}
var sd = Math.abs, Jt = Math.atan2, Yr = Math.cos, My = Math.max, As = Math.min, Xn = Math.sin, Si = Math.sqrt, en = 1e-12, Br = Math.PI, Xa = Br / 2, Fr = 2 * Br;
function Oy(e) {
  return e > 1 ? 0 : e < -1 ? Br : Math.acos(e);
}
function ld(e) {
  return e >= 1 ? Xa : e <= -1 ? -Xa : Math.asin(e);
}
function Ay(e) {
  return e.innerRadius;
}
function ky(e) {
  return e.outerRadius;
}
function $y(e) {
  return e.startAngle;
}
function Fy(e) {
  return e.endAngle;
}
function Iy(e) {
  return e && e.padAngle;
}
function By(e, t, n, r, i, o, a, u) {
  var f = n - e, c = r - t, h = a - i, p = u - o, w = p * f - h * c;
  if (!(w * w < en))
    return w = (h * (t - o) - p * (e - i)) / w, [e + w * f, t + w * c];
}
function Oa(e, t, n, r, i, o, a) {
  var u = e - n, f = t - r, c = (a ? o : -o) / Si(u * u + f * f), h = c * f, p = -c * u, w = e + h, P = t + p, _ = n + h, N = r + p, I = (w + _) / 2, k = (P + N) / 2, F = _ - w, T = N - P, G = F * F + T * T, M = i - o, z = w * N - _ * P, te = (T < 0 ? -1 : 1) * Si(My(0, M * M * G - z * z)), Q = (z * T - F * te) / G, fe = (-z * F - T * te) / G, me = (z * T + F * te) / G, re = (-z * F + T * te) / G, ee = Q - I, be = fe - k, Oe = me - I, ut = re - k;
  return ee * ee + be * be > Oe * Oe + ut * ut && (Q = me, fe = re), {
    cx: Q,
    cy: fe,
    x01: -h,
    y01: -p,
    x11: Q * (i / M - 1),
    y11: fe * (i / M - 1)
  };
}
function Dy() {
  var e = Ay, t = ky, n = mt(0), r = null, i = $y, o = Fy, a = Iy, u = null;
  function f() {
    var c, h, p = +e.apply(this, arguments), w = +t.apply(this, arguments), P = i.apply(this, arguments) - Xa, _ = o.apply(this, arguments) - Xa, N = sd(_ - P), I = _ > P;
    if (u || (u = c = zi()), w < p && (h = w, w = p, p = h), !(w > en))
      u.moveTo(0, 0);
    else if (N > Fr - en)
      u.moveTo(w * Yr(P), w * Xn(P)), u.arc(0, 0, w, P, _, !I), p > en && (u.moveTo(p * Yr(_), p * Xn(_)), u.arc(0, 0, p, _, P, I));
    else {
      var k = P, F = _, T = P, G = _, M = N, z = N, te = a.apply(this, arguments) / 2, Q = te > en && (r ? +r.apply(this, arguments) : Si(p * p + w * w)), fe = As(sd(w - p) / 2, +n.apply(this, arguments)), me = fe, re = fe, ee, be;
      if (Q > en) {
        var Oe = ld(Q / p * Xn(te)), ut = ld(Q / w * Xn(te));
        (M -= Oe * 2) > en ? (Oe *= I ? 1 : -1, T += Oe, G -= Oe) : (M = 0, T = G = (P + _) / 2), (z -= ut * 2) > en ? (ut *= I ? 1 : -1, k += ut, F -= ut) : (z = 0, k = F = (P + _) / 2);
      }
      var Ue = w * Yr(k), st = w * Xn(k), lt = p * Yr(G), dt = p * Xn(G);
      if (fe > en) {
        var V = w * Yr(F), ue = w * Xn(F), Ne = p * Yr(T), Ae = p * Xn(T), Ce;
        if (N < Br && (Ce = By(Ue, st, Ne, Ae, V, ue, lt, dt))) {
          var Re = Ue - Ce[0], Te = st - Ce[1], Be = V - Ce[0], Le = ue - Ce[1], X = 1 / Xn(Oy((Re * Be + Te * Le) / (Si(Re * Re + Te * Te) * Si(Be * Be + Le * Le))) / 2), ce = Si(Ce[0] * Ce[0] + Ce[1] * Ce[1]);
          me = As(fe, (p - ce) / (X - 1)), re = As(fe, (w - ce) / (X + 1));
        }
      }
      z > en ? re > en ? (ee = Oa(Ne, Ae, Ue, st, w, re, I), be = Oa(V, ue, lt, dt, w, re, I), u.moveTo(ee.cx + ee.x01, ee.cy + ee.y01), re < fe ? u.arc(ee.cx, ee.cy, re, Jt(ee.y01, ee.x01), Jt(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, re, Jt(ee.y01, ee.x01), Jt(ee.y11, ee.x11), !I), u.arc(0, 0, w, Jt(ee.cy + ee.y11, ee.cx + ee.x11), Jt(be.cy + be.y11, be.cx + be.x11), !I), u.arc(be.cx, be.cy, re, Jt(be.y11, be.x11), Jt(be.y01, be.x01), !I))) : (u.moveTo(Ue, st), u.arc(0, 0, w, k, F, !I)) : u.moveTo(Ue, st), !(p > en) || !(M > en) ? u.lineTo(lt, dt) : me > en ? (ee = Oa(lt, dt, V, ue, p, -me, I), be = Oa(Ue, st, Ne, Ae, p, -me, I), u.lineTo(ee.cx + ee.x01, ee.cy + ee.y01), me < fe ? u.arc(ee.cx, ee.cy, me, Jt(ee.y01, ee.x01), Jt(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, me, Jt(ee.y01, ee.x01), Jt(ee.y11, ee.x11), !I), u.arc(0, 0, p, Jt(ee.cy + ee.y11, ee.cx + ee.x11), Jt(be.cy + be.y11, be.cx + be.x11), I), u.arc(be.cx, be.cy, me, Jt(be.y11, be.x11), Jt(be.y01, be.x01), !I))) : u.arc(0, 0, p, G, T, I);
    }
    if (u.closePath(), c)
      return u = null, c + "" || null;
  }
  return f.centroid = function() {
    var c = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2, h = (+i.apply(this, arguments) + +o.apply(this, arguments)) / 2 - Br / 2;
    return [Yr(h) * c, Xn(h) * c];
  }, f.innerRadius = function(c) {
    return arguments.length ? (e = typeof c == "function" ? c : mt(+c), f) : e;
  }, f.outerRadius = function(c) {
    return arguments.length ? (t = typeof c == "function" ? c : mt(+c), f) : t;
  }, f.cornerRadius = function(c) {
    return arguments.length ? (n = typeof c == "function" ? c : mt(+c), f) : n;
  }, f.padRadius = function(c) {
    return arguments.length ? (r = c == null ? null : typeof c == "function" ? c : mt(+c), f) : r;
  }, f.startAngle = function(c) {
    return arguments.length ? (i = typeof c == "function" ? c : mt(+c), f) : i;
  }, f.endAngle = function(c) {
    return arguments.length ? (o = typeof c == "function" ? c : mt(+c), f) : o;
  }, f.padAngle = function(c) {
    return arguments.length ? (a = typeof c == "function" ? c : mt(+c), f) : a;
  }, f.context = function(c) {
    return arguments.length ? (u = c == null ? null : c, f) : u;
  }, f;
}
function Mh(e) {
  this._context = e;
}
Mh.prototype = {
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
function gu(e) {
  return new Mh(e);
}
function hc(e) {
  return e[0];
}
function vc(e) {
  return e[1];
}
function mc() {
  var e = hc, t = vc, n = mt(!0), r = null, i = gu, o = null;
  function a(u) {
    var f, c = u.length, h, p = !1, w;
    for (r == null && (o = i(w = zi())), f = 0; f <= c; ++f)
      !(f < c && n(h = u[f], f, u)) === p && ((p = !p) ? o.lineStart() : o.lineEnd()), p && o.point(+e(h, f, u), +t(h, f, u));
    if (w)
      return o = null, w + "" || null;
  }
  return a.x = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : mt(+u), a) : e;
  }, a.y = function(u) {
    return arguments.length ? (t = typeof u == "function" ? u : mt(+u), a) : t;
  }, a.defined = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : mt(!!u), a) : n;
  }, a.curve = function(u) {
    return arguments.length ? (i = u, r != null && (o = i(r)), a) : i;
  }, a.context = function(u) {
    return arguments.length ? (u == null ? r = o = null : o = i(r = u), a) : r;
  }, a;
}
function Oh() {
  var e = hc, t = null, n = mt(0), r = vc, i = mt(!0), o = null, a = gu, u = null;
  function f(h) {
    var p, w, P, _ = h.length, N, I = !1, k, F = new Array(_), T = new Array(_);
    for (o == null && (u = a(k = zi())), p = 0; p <= _; ++p) {
      if (!(p < _ && i(N = h[p], p, h)) === I)
        if (I = !I)
          w = p, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), P = p - 1; P >= w; --P)
            u.point(F[P], T[P]);
          u.lineEnd(), u.areaEnd();
        }
      I && (F[p] = +e(N, p, h), T[p] = +n(N, p, h), u.point(t ? +t(N, p, h) : F[p], r ? +r(N, p, h) : T[p]));
    }
    if (k)
      return u = null, k + "" || null;
  }
  function c() {
    return mc().defined(i).curve(a).context(o);
  }
  return f.x = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : mt(+h), t = null, f) : e;
  }, f.x0 = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : mt(+h), f) : e;
  }, f.x1 = function(h) {
    return arguments.length ? (t = h == null ? null : typeof h == "function" ? h : mt(+h), f) : t;
  }, f.y = function(h) {
    return arguments.length ? (n = typeof h == "function" ? h : mt(+h), r = null, f) : n;
  }, f.y0 = function(h) {
    return arguments.length ? (n = typeof h == "function" ? h : mt(+h), f) : n;
  }, f.y1 = function(h) {
    return arguments.length ? (r = h == null ? null : typeof h == "function" ? h : mt(+h), f) : r;
  }, f.lineX0 = f.lineY0 = function() {
    return c().x(e).y(n);
  }, f.lineY1 = function() {
    return c().x(e).y(r);
  }, f.lineX1 = function() {
    return c().x(t).y(n);
  }, f.defined = function(h) {
    return arguments.length ? (i = typeof h == "function" ? h : mt(!!h), f) : i;
  }, f.curve = function(h) {
    return arguments.length ? (a = h, o != null && (u = a(o)), f) : a;
  }, f.context = function(h) {
    return arguments.length ? (h == null ? o = u = null : u = a(o = h), f) : o;
  }, f;
}
function zy(e, t) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Ly(e) {
  return e;
}
function Gy() {
  var e = Ly, t = zy, n = null, r = mt(0), i = mt(Fr), o = mt(0);
  function a(u) {
    var f, c = u.length, h, p, w = 0, P = new Array(c), _ = new Array(c), N = +r.apply(this, arguments), I = Math.min(Fr, Math.max(-Fr, i.apply(this, arguments) - N)), k, F = Math.min(Math.abs(I) / c, o.apply(this, arguments)), T = F * (I < 0 ? -1 : 1), G;
    for (f = 0; f < c; ++f)
      (G = _[P[f] = f] = +e(u[f], f, u)) > 0 && (w += G);
    for (t != null ? P.sort(function(M, z) {
      return t(_[M], _[z]);
    }) : n != null && P.sort(function(M, z) {
      return n(u[M], u[z]);
    }), f = 0, p = w ? (I - c * T) / w : 0; f < c; ++f, N = k)
      h = P[f], G = _[h], k = N + (G > 0 ? G * p : 0) + T, _[h] = {
        data: u[h],
        index: f,
        value: G,
        startAngle: N,
        endAngle: k,
        padAngle: F
      };
    return _;
  }
  return a.value = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : mt(+u), a) : e;
  }, a.sortValues = function(u) {
    return arguments.length ? (t = u, n = null, a) : t;
  }, a.sort = function(u) {
    return arguments.length ? (n = u, t = null, a) : n;
  }, a.startAngle = function(u) {
    return arguments.length ? (r = typeof u == "function" ? u : mt(+u), a) : r;
  }, a.endAngle = function(u) {
    return arguments.length ? (i = typeof u == "function" ? u : mt(+u), a) : i;
  }, a.padAngle = function(u) {
    return arguments.length ? (o = typeof u == "function" ? u : mt(+u), a) : o;
  }, a;
}
var Ah = gc(gu);
function kh(e) {
  this._curve = e;
}
kh.prototype = {
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
function gc(e) {
  function t(n) {
    return new kh(e(n));
  }
  return t._curve = e, t;
}
function xo(e) {
  var t = e.curve;
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e.curve = function(n) {
    return arguments.length ? t(gc(n)) : t()._curve;
  }, e;
}
function cd() {
  return xo(mc().curve(Ah));
}
function fd() {
  var e = Oh().curve(Ah), t = e.curve, n = e.lineX0, r = e.lineX1, i = e.lineY0, o = e.lineY1;
  return e.angle = e.x, delete e.x, e.startAngle = e.x0, delete e.x0, e.endAngle = e.x1, delete e.x1, e.radius = e.y, delete e.y, e.innerRadius = e.y0, delete e.y0, e.outerRadius = e.y1, delete e.y1, e.lineStartAngle = function() {
    return xo(n());
  }, delete e.lineX0, e.lineEndAngle = function() {
    return xo(r());
  }, delete e.lineX1, e.lineInnerRadius = function() {
    return xo(i());
  }, delete e.lineY0, e.lineOuterRadius = function() {
    return xo(o());
  }, delete e.lineY1, e.curve = function(a) {
    return arguments.length ? t(gc(a)) : t()._curve;
  }, e;
}
function _o(e, t) {
  return [(t = +t) * Math.cos(e -= Math.PI / 2), t * Math.sin(e)];
}
var bl = Array.prototype.slice;
function jy(e) {
  return e.source;
}
function Hy(e) {
  return e.target;
}
function yc(e) {
  var t = jy, n = Hy, r = hc, i = vc, o = null;
  function a() {
    var u, f = bl.call(arguments), c = t.apply(this, f), h = n.apply(this, f);
    if (o || (o = u = zi()), e(o, +r.apply(this, (f[0] = c, f)), +i.apply(this, f), +r.apply(this, (f[0] = h, f)), +i.apply(this, f)), u)
      return o = null, u + "" || null;
  }
  return a.source = function(u) {
    return arguments.length ? (t = u, a) : t;
  }, a.target = function(u) {
    return arguments.length ? (n = u, a) : n;
  }, a.x = function(u) {
    return arguments.length ? (r = typeof u == "function" ? u : mt(+u), a) : r;
  }, a.y = function(u) {
    return arguments.length ? (i = typeof u == "function" ? u : mt(+u), a) : i;
  }, a.context = function(u) {
    return arguments.length ? (o = u == null ? null : u, a) : o;
  }, a;
}
function Wy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t = (t + r) / 2, n, t, i, r, i);
}
function Uy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t, n = (n + i) / 2, r, n, r, i);
}
function Vy(e, t, n, r, i) {
  var o = _o(t, n), a = _o(t, n = (n + i) / 2), u = _o(r, n), f = _o(r, i);
  e.moveTo(o[0], o[1]), e.bezierCurveTo(a[0], a[1], u[0], u[1], f[0], f[1]);
}
function qy() {
  return yc(Wy);
}
function Yy() {
  return yc(Uy);
}
function Xy() {
  var e = yc(Vy);
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e;
}
const bc = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Br);
    e.moveTo(n, 0), e.arc(0, 0, n, 0, Fr);
  }
}, $h = {
  draw: function(e, t) {
    var n = Math.sqrt(t / 5) / 2;
    e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
  }
};
var Fh = Math.sqrt(1 / 3), Ky = Fh * 2;
const Ih = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Ky), r = n * Fh;
    e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
  }
};
var Qy = 0.8908130915292852, Bh = Math.sin(Br / 10) / Math.sin(7 * Br / 10), Zy = Math.sin(Fr / 10) * Bh, Jy = -Math.cos(Fr / 10) * Bh;
const Dh = {
  draw: function(e, t) {
    var n = Math.sqrt(t * Qy), r = Zy * n, i = Jy * n;
    e.moveTo(0, -n), e.lineTo(r, i);
    for (var o = 1; o < 5; ++o) {
      var a = Fr * o / 5, u = Math.cos(a), f = Math.sin(a);
      e.lineTo(f * n, -u * n), e.lineTo(u * r - f * i, f * r + u * i);
    }
    e.closePath();
  }
}, zh = {
  draw: function(e, t) {
    var n = Math.sqrt(t), r = -n / 2;
    e.rect(r, r, n, n);
  }
};
var ks = Math.sqrt(3);
const Lh = {
  draw: function(e, t) {
    var n = -Math.sqrt(t / (ks * 3));
    e.moveTo(0, n * 2), e.lineTo(-ks * n, -n), e.lineTo(ks * n, -n), e.closePath();
  }
};
var Cn = -0.5, Pn = Math.sqrt(3) / 2, wl = 1 / Math.sqrt(12), eb = (wl / 2 + 1) * 3;
const Gh = {
  draw: function(e, t) {
    var n = Math.sqrt(t / eb), r = n / 2, i = n * wl, o = r, a = n * wl + n, u = -o, f = a;
    e.moveTo(r, i), e.lineTo(o, a), e.lineTo(u, f), e.lineTo(Cn * r - Pn * i, Pn * r + Cn * i), e.lineTo(Cn * o - Pn * a, Pn * o + Cn * a), e.lineTo(Cn * u - Pn * f, Pn * u + Cn * f), e.lineTo(Cn * r + Pn * i, Cn * i - Pn * r), e.lineTo(Cn * o + Pn * a, Cn * a - Pn * o), e.lineTo(Cn * u + Pn * f, Cn * f - Pn * u), e.closePath();
  }
};
var tb = [
  bc,
  $h,
  Ih,
  zh,
  Dh,
  Lh,
  Gh
];
function nb() {
  var e = mt(bc), t = mt(64), n = null;
  function r() {
    var i;
    if (n || (n = i = zi()), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i)
      return n = null, i + "" || null;
  }
  return r.type = function(i) {
    return arguments.length ? (e = typeof i == "function" ? i : mt(i), r) : e;
  }, r.size = function(i) {
    return arguments.length ? (t = typeof i == "function" ? i : mt(+i), r) : t;
  }, r.context = function(i) {
    return arguments.length ? (n = i == null ? null : i, r) : n;
  }, r;
}
function Dr() {
}
function Ka(e, t, n) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + n) / 6
  );
}
function yu(e) {
  this._context = e;
}
yu.prototype = {
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
        Ka(this, this._x1, this._y1);
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
        Ka(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function rb(e) {
  return new yu(e);
}
function jh(e) {
  this._context = e;
}
jh.prototype = {
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
        Ka(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function ib(e) {
  return new jh(e);
}
function Hh(e) {
  this._context = e;
}
Hh.prototype = {
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
        Ka(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function ob(e) {
  return new Hh(e);
}
function Wh(e, t) {
  this._basis = new yu(e), this._beta = t;
}
Wh.prototype = {
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
const ab = function e(t) {
  function n(r) {
    return t === 1 ? new yu(r) : new Wh(r, t);
  }
  return n.beta = function(r) {
    return e(+r);
  }, n;
}(0.85);
function Qa(e, t, n) {
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
        Qa(this, this._x1, this._y1);
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
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ub = function e(t) {
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
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const sb = function e(t) {
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
        Qa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const lb = function e(t) {
  function n(r) {
    return new _c(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function Sc(e, t, n) {
  var r = e._x1, i = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > en) {
    var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, f = 3 * e._l01_a * (e._l01_a + e._l12_a);
    r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / f, i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / f;
  }
  if (e._l23_a > en) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, a = (a * c + e._y1 * e._l23_2a - n * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(r, i, o, a, e._x2, e._y2);
}
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
const cb = function e(t) {
  function n(r) {
    return t ? new Uh(r, t) : new wc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Vh(e, t) {
  this._context = e, this._alpha = t;
}
Vh.prototype = {
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
const fb = function e(t) {
  function n(r) {
    return t ? new Vh(r, t) : new xc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function qh(e, t) {
  this._context = e, this._alpha = t;
}
qh.prototype = {
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
const db = function e(t) {
  function n(r) {
    return t ? new qh(r, t) : new _c(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Yh(e) {
  this._context = e;
}
Yh.prototype = {
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
function pb(e) {
  return new Yh(e);
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
function $s(e, t, n) {
  var r = e._x0, i = e._y0, o = e._x1, a = e._y1, u = (o - r) / 3;
  e._context.bezierCurveTo(r + u, i + u * t, o - u, a - u * n, o, a);
}
function Za(e) {
  this._context = e;
}
Za.prototype = {
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
        $s(this, this._t0, hd(this, this._t0));
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
          this._point = 3, $s(this, hd(this, n = pd(this, e, t)), n);
          break;
        default:
          $s(this, this._t0, n = pd(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
    }
  }
};
function Xh(e) {
  this._context = new Kh(e);
}
(Xh.prototype = Object.create(Za.prototype)).point = function(e, t) {
  Za.prototype.point.call(this, t, e);
};
function Kh(e) {
  this._context = e;
}
Kh.prototype = {
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
function hb(e) {
  return new Za(e);
}
function vb(e) {
  return new Xh(e);
}
function Qh(e) {
  this._context = e;
}
Qh.prototype = {
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
function mb(e) {
  return new Qh(e);
}
function bu(e, t) {
  this._context = e, this._t = t;
}
bu.prototype = {
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
function gb(e) {
  return new bu(e, 0.5);
}
function yb(e) {
  return new bu(e, 0);
}
function bb(e) {
  return new bu(e, 1);
}
function ki(e, t) {
  if ((a = e.length) > 1)
    for (var n = 1, r, i, o = e[t[0]], a, u = o.length; n < a; ++n)
      for (i = o, o = e[t[n]], r = 0; r < u; ++r)
        o[r][1] += o[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
function $i(e) {
  for (var t = e.length, n = new Array(t); --t >= 0; )
    n[t] = t;
  return n;
}
function wb(e, t) {
  return e[t];
}
function xb() {
  var e = mt([]), t = $i, n = ki, r = wb;
  function i(o) {
    var a = e.apply(this, arguments), u, f = o.length, c = a.length, h = new Array(c), p;
    for (u = 0; u < c; ++u) {
      for (var w = a[u], P = h[u] = new Array(f), _ = 0, N; _ < f; ++_)
        P[_] = N = [0, +r(o[_], w, _, o)], N.data = o[_];
      P.key = w;
    }
    for (u = 0, p = t(h); u < c; ++u)
      h[p[u]].index = u;
    return n(h, p), h;
  }
  return i.keys = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : mt(bl.call(o)), i) : e;
  }, i.value = function(o) {
    return arguments.length ? (r = typeof o == "function" ? o : mt(+o), i) : r;
  }, i.order = function(o) {
    return arguments.length ? (t = o == null ? $i : typeof o == "function" ? o : mt(bl.call(o)), i) : t;
  }, i.offset = function(o) {
    return arguments.length ? (n = o == null ? ki : o, i) : n;
  }, i;
}
function _b(e, t) {
  if ((r = e.length) > 0) {
    for (var n, r, i = 0, o = e[0].length, a; i < o; ++i) {
      for (a = n = 0; n < r; ++n)
        a += e[n][i][1] || 0;
      if (a)
        for (n = 0; n < r; ++n)
          e[n][i][1] /= a;
    }
    ki(e, t);
  }
}
function Sb(e, t) {
  if ((f = e.length) > 0)
    for (var n, r = 0, i, o, a, u, f, c = e[t[0]].length; r < c; ++r)
      for (a = u = 0, n = 0; n < f; ++n)
        (o = (i = e[t[n]][r])[1] - i[0]) > 0 ? (i[0] = a, i[1] = a += o) : o < 0 ? (i[1] = u, i[0] = u += o) : (i[0] = 0, i[1] = o);
}
function Rb(e, t) {
  if ((i = e.length) > 0) {
    for (var n = 0, r = e[t[0]], i, o = r.length; n < o; ++n) {
      for (var a = 0, u = 0; a < i; ++a)
        u += e[a][n][1] || 0;
      r[n][1] += r[n][0] = -u / 2;
    }
    ki(e, t);
  }
}
function Cb(e, t) {
  if (!(!((a = e.length) > 0) || !((o = (i = e[t[0]]).length) > 0))) {
    for (var n = 0, r = 1, i, o, a; r < o; ++r) {
      for (var u = 0, f = 0, c = 0; u < a; ++u) {
        for (var h = e[t[u]], p = h[r][1] || 0, w = h[r - 1][1] || 0, P = (p - w) / 2, _ = 0; _ < u; ++_) {
          var N = e[t[_]], I = N[r][1] || 0, k = N[r - 1][1] || 0;
          P += I - k;
        }
        f += p, c += P * p;
      }
      i[r - 1][1] += i[r - 1][0] = n, f && (n -= c / f);
    }
    i[r - 1][1] += i[r - 1][0] = n, ki(e, t);
  }
}
function Zh(e) {
  var t = e.map(Pb);
  return $i(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function Pb(e) {
  for (var t = -1, n = 0, r = e.length, i, o = -1 / 0; ++t < r; )
    (i = +e[t][1]) > o && (o = i, n = t);
  return n;
}
function Jh(e) {
  var t = e.map(ev);
  return $i(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function ev(e) {
  for (var t = 0, n = -1, r = e.length, i; ++n < r; )
    (i = +e[n][1]) && (t += i);
  return t;
}
function Nb(e) {
  return Jh(e).reverse();
}
function Tb(e) {
  var t = e.length, n, r, i = e.map(ev), o = Zh(e), a = 0, u = 0, f = [], c = [];
  for (n = 0; n < t; ++n)
    r = o[n], a < u ? (a += i[r], f.push(r)) : (u += i[r], c.push(r));
  return c.reverse().concat(f);
}
function Eb(e) {
  return $i(e).reverse();
}
const Mb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arc: Dy,
  area: Oh,
  line: mc,
  pie: Gy,
  areaRadial: fd,
  radialArea: fd,
  lineRadial: cd,
  radialLine: cd,
  pointRadial: _o,
  linkHorizontal: qy,
  linkVertical: Yy,
  linkRadial: Xy,
  symbol: nb,
  symbols: tb,
  symbolCircle: bc,
  symbolCross: $h,
  symbolDiamond: Ih,
  symbolSquare: zh,
  symbolStar: Dh,
  symbolTriangle: Lh,
  symbolWye: Gh,
  curveBasisClosed: ib,
  curveBasisOpen: ob,
  curveBasis: rb,
  curveBundle: ab,
  curveCardinalClosed: sb,
  curveCardinalOpen: lb,
  curveCardinal: ub,
  curveCatmullRomClosed: fb,
  curveCatmullRomOpen: db,
  curveCatmullRom: cb,
  curveLinearClosed: pb,
  curveLinear: gu,
  curveMonotoneX: hb,
  curveMonotoneY: vb,
  curveNatural: mb,
  curveStep: gb,
  curveStepAfter: bb,
  curveStepBefore: yb,
  stack: xb,
  stackOffsetExpand: _b,
  stackOffsetDiverging: Sb,
  stackOffsetNone: ki,
  stackOffsetSilhouette: Rb,
  stackOffsetWiggle: Cb,
  stackOrderAppearance: Zh,
  stackOrderAscending: Jh,
  stackOrderDescending: Nb,
  stackOrderInsideOut: Tb,
  stackOrderNone: $i,
  stackOrderReverse: Eb
}, Symbol.toStringTag, { value: "Module" }));
function qo(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function wu(e) {
  let t = e, n = e;
  e.length === 1 && (t = (a, u) => e(a) - u, n = Ob(e));
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
function Ob(e) {
  return (t, n) => qo(e(t), n);
}
function tv(e) {
  return e === null ? NaN : +e;
}
function* Ab(e, t) {
  if (t === void 0)
    for (let n of e)
      n != null && (n = +n) >= n && (yield n);
  else {
    let n = -1;
    for (let r of e)
      (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
  }
}
const nv = wu(qo), kb = nv.right, $b = nv.left;
wu(tv).center;
const Yo = kb;
function md(e, t) {
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
  if ((r = t < e) && (o = e, e = t, t = o), (u = rv(e, t, n)) === 0 || !isFinite(u))
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
function rv(e, t, n) {
  var r = (t - e) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), o = r / Math.pow(10, i);
  return i >= 0 ? (o >= xl ? 10 : o >= _l ? 5 : o >= Sl ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (o >= xl ? 10 : o >= _l ? 5 : o >= Sl ? 2 : 1);
}
function Cl(e, t, n) {
  var r = Math.abs(t - e) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), o = r / i;
  return o >= xl ? i *= 10 : o >= _l ? i *= 5 : o >= Sl && (i *= 2), t < e ? -i : i;
}
function gd(e, t) {
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
function iv(e, t, n = 0, r = e.length - 1, i = qo) {
  for (; r > n; ) {
    if (r - n > 600) {
      const f = r - n + 1, c = t - n + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), w = 0.5 * Math.sqrt(h * p * (f - p) / f) * (c - f / 2 < 0 ? -1 : 1), P = Math.max(n, Math.floor(t - c * p / f + w)), _ = Math.min(r, Math.floor(t + (f - c) * p / f + w));
      iv(e, t, P, _, i);
    }
    const o = e[t];
    let a = n, u = r;
    for (ao(e, n, t), i(e[r], o) > 0 && ao(e, n, r); a < u; ) {
      for (ao(e, a, u), ++a, --u; i(e[a], o) < 0; )
        ++a;
      for (; i(e[u], o) > 0; )
        --u;
    }
    i(e[n], o) === 0 ? ao(e, n, u) : (++u, ao(e, u, r)), u <= t && (n = u + 1), t <= u && (r = u - 1);
  }
  return e;
}
function ao(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function Fb(e, t, n) {
  if (e = Float64Array.from(Ab(e, n)), !!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return yd(e);
    if (t >= 1)
      return gd(e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = gd(iv(e, o).subarray(0, o + 1)), u = yd(e.subarray(o + 1));
    return a + (u - a) * (i - o);
  }
}
function Ib(e, t, n = tv) {
  if (!!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return +n(e[0], 0, e);
    if (t >= 1)
      return +n(e[r - 1], r - 1, e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = +n(e[o], o, e), u = +n(e[o + 1], o + 1, e);
    return a + (u - a) * (i - o);
  }
}
function ov(e, t, n) {
  e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, o = new Array(i); ++r < i; )
    o[r] = e + r * n;
  return o;
}
function Mn(e, t) {
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
function mr(e, t) {
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
function xu() {
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
    return xu(t, n).unknown(r);
  }, Mn.apply(i, arguments), i;
}
function _u() {
  var e = xu().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, o, a, u = !1, f = 0, c = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var w = t().length, P = i < r, _ = P ? i : r, N = P ? r : i;
    o = (N - _) / Math.max(1, w - f + c * 2), u && (o = Math.floor(o)), _ += (N - _ - o * (w - f)) * h, a = o * (1 - f), u && (_ = Math.round(_), a = Math.round(a));
    var I = ov(w).map(function(k) {
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
    return _u(t(), [r, i]).round(u).paddingInner(f).paddingOuter(c).align(h);
  }, Mn.apply(p(), arguments);
}
function av(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return av(t());
  }, e;
}
function uv() {
  return av(_u.apply(null, arguments).paddingInner(1));
}
function Li(e, t, n) {
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
var ni = 0.7, Fi = 1 / ni, Ti = "\\s*([+-]?\\d+)\\s*", $o = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", er = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Bb = /^#([0-9a-f]{3,8})$/, Db = new RegExp("^rgb\\(" + [Ti, Ti, Ti] + "\\)$"), zb = new RegExp("^rgb\\(" + [er, er, er] + "\\)$"), Lb = new RegExp("^rgba\\(" + [Ti, Ti, Ti, $o] + "\\)$"), Gb = new RegExp("^rgba\\(" + [er, er, er, $o] + "\\)$"), jb = new RegExp("^hsl\\(" + [$o, er, er] + "\\)$"), Hb = new RegExp("^hsla\\(" + [$o, er, er, $o] + "\\)$"), bd = {
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
Li(zr, Fo, {
  copy: function(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: wd,
  formatHex: wd,
  formatHsl: Wb,
  formatRgb: xd,
  toString: xd
});
function wd() {
  return this.rgb().formatHex();
}
function Wb() {
  return sv(this).formatHsl();
}
function xd() {
  return this.rgb().formatRgb();
}
function Fo(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Bb.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? _d(t) : n === 3 ? new Qt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Aa(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Aa(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Db.exec(e)) ? new Qt(t[1], t[2], t[3], 1) : (t = zb.exec(e)) ? new Qt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Lb.exec(e)) ? Aa(t[1], t[2], t[3], t[4]) : (t = Gb.exec(e)) ? Aa(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = jb.exec(e)) ? Cd(t[1], t[2] / 100, t[3] / 100, 1) : (t = Hb.exec(e)) ? Cd(t[1], t[2] / 100, t[3] / 100, t[4]) : bd.hasOwnProperty(e) ? _d(bd[e]) : e === "transparent" ? new Qt(NaN, NaN, NaN, 0) : null;
}
function _d(e) {
  return new Qt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Aa(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Qt(e, t, n, r);
}
function Rc(e) {
  return e instanceof zr || (e = Fo(e)), e ? (e = e.rgb(), new Qt(e.r, e.g, e.b, e.opacity)) : new Qt();
}
function Ja(e, t, n, r) {
  return arguments.length === 1 ? Rc(e) : new Qt(e, t, n, r == null ? 1 : r);
}
function Qt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Li(Qt, Ja, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Fi : Math.pow(Fi, e), new Qt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ni : Math.pow(ni, e), new Qt(this.r * e, this.g * e, this.b * e, this.opacity);
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
  return "#" + Fs(this.r) + Fs(this.g) + Fs(this.b);
}
function Rd() {
  var e = this.opacity;
  return e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)), (e === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (e === 1 ? ")" : ", " + e + ")");
}
function Fs(e) {
  return e = Math.max(0, Math.min(255, Math.round(e) || 0)), (e < 16 ? "0" : "") + e.toString(16);
}
function Cd(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Zn(e, t, n, r);
}
function sv(e) {
  if (e instanceof Zn)
    return new Zn(e.h, e.s, e.l, e.opacity);
  if (e instanceof zr || (e = Fo(e)), !e)
    return new Zn();
  if (e instanceof Zn)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), a = NaN, u = o - i, f = (o + i) / 2;
  return u ? (t === o ? a = (n - r) / u + (n < r) * 6 : n === o ? a = (r - t) / u + 2 : a = (t - n) / u + 4, u /= f < 0.5 ? o + i : 2 - o - i, a *= 60) : u = f > 0 && f < 1 ? 0 : a, new Zn(a, u, f, e.opacity);
}
function Nl(e, t, n, r) {
  return arguments.length === 1 ? sv(e) : new Zn(e, t, n, r == null ? 1 : r);
}
function Zn(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Li(Zn, Nl, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Fi : Math.pow(Fi, e), new Zn(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ni : Math.pow(ni, e), new Zn(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Qt(
      Is(e >= 240 ? e - 240 : e + 120, i, r),
      Is(e, i, r),
      Is(e < 120 ? e + 240 : e - 120, i, r),
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
function Is(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
var lv = Math.PI / 180, cv = 180 / Math.PI, eu = 18, fv = 0.96422, dv = 1, pv = 0.82521, hv = 4 / 29, Ei = 6 / 29, vv = 3 * Ei * Ei, Ub = Ei * Ei * Ei;
function mv(e) {
  if (e instanceof tr)
    return new tr(e.l, e.a, e.b, e.opacity);
  if (e instanceof cr)
    return gv(e);
  e instanceof Qt || (e = Rc(e));
  var t = Ls(e.r), n = Ls(e.g), r = Ls(e.b), i = Bs((0.2225045 * t + 0.7168786 * n + 0.0606169 * r) / dv), o, a;
  return t === n && n === r ? o = a = i : (o = Bs((0.4360747 * t + 0.3850649 * n + 0.1430804 * r) / fv), a = Bs((0.0139322 * t + 0.0971045 * n + 0.7141733 * r) / pv)), new tr(116 * i - 16, 500 * (o - i), 200 * (i - a), e.opacity);
}
function Tl(e, t, n, r) {
  return arguments.length === 1 ? mv(e) : new tr(e, t, n, r == null ? 1 : r);
}
function tr(e, t, n, r) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
Li(tr, Tl, Xo(zr, {
  brighter: function(e) {
    return new tr(this.l + eu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  darker: function(e) {
    return new tr(this.l - eu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = fv * Ds(t), e = dv * Ds(e), n = pv * Ds(n), new Qt(
      zs(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
      zs(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
      zs(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
      this.opacity
    );
  }
}));
function Bs(e) {
  return e > Ub ? Math.pow(e, 1 / 3) : e / vv + hv;
}
function Ds(e) {
  return e > Ei ? e * e * e : vv * (e - hv);
}
function zs(e) {
  return 255 * (e <= 31308e-7 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);
}
function Ls(e) {
  return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function Vb(e) {
  if (e instanceof cr)
    return new cr(e.h, e.c, e.l, e.opacity);
  if (e instanceof tr || (e = mv(e)), e.a === 0 && e.b === 0)
    return new cr(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
  var t = Math.atan2(e.b, e.a) * cv;
  return new cr(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function El(e, t, n, r) {
  return arguments.length === 1 ? Vb(e) : new cr(e, t, n, r == null ? 1 : r);
}
function cr(e, t, n, r) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function gv(e) {
  if (isNaN(e.h))
    return new tr(e.l, 0, 0, e.opacity);
  var t = e.h * lv;
  return new tr(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
Li(cr, El, Xo(zr, {
  brighter: function(e) {
    return new cr(this.h, this.c, this.l + eu * (e == null ? 1 : e), this.opacity);
  },
  darker: function(e) {
    return new cr(this.h, this.c, this.l - eu * (e == null ? 1 : e), this.opacity);
  },
  rgb: function() {
    return gv(this).rgb();
  }
}));
var yv = -0.14861, Cc = 1.78277, Pc = -0.29227, Su = -0.90649, Io = 1.97294, Pd = Io * Su, Nd = Io * Cc, Td = Cc * Pc - Su * yv;
function qb(e) {
  if (e instanceof ti)
    return new ti(e.h, e.s, e.l, e.opacity);
  e instanceof Qt || (e = Rc(e));
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (Td * r + Pd * t - Nd * n) / (Td + Pd - Nd), o = r - i, a = (Io * (n - i) - Pc * o) / Su, u = Math.sqrt(a * a + o * o) / (Io * i * (1 - i)), f = u ? Math.atan2(a, o) * cv - 120 : NaN;
  return new ti(f < 0 ? f + 360 : f, u, i, e.opacity);
}
function Ml(e, t, n, r) {
  return arguments.length === 1 ? qb(e) : new ti(e, t, n, r == null ? 1 : r);
}
function ti(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Li(ti, Ml, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Fi : Math.pow(Fi, e), new ti(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ni : Math.pow(ni, e), new ti(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = isNaN(this.h) ? 0 : (this.h + 120) * lv, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
    return new Qt(
      255 * (t + n * (yv * r + Cc * i)),
      255 * (t + n * (Pc * r + Su * i)),
      255 * (t + n * (Io * r)),
      this.opacity
    );
  }
}));
function bv(e, t, n, r, i) {
  var o = e * e, a = o * e;
  return ((1 - 3 * e + 3 * o - a) * t + (4 - 6 * o + 3 * a) * n + (1 + 3 * e + 3 * o - 3 * a) * r + a * i) / 6;
}
function wv(e) {
  var t = e.length - 1;
  return function(n) {
    var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, t - 1) : Math.floor(n * t), i = e[r], o = e[r + 1], a = r > 0 ? e[r - 1] : 2 * i - o, u = r < t - 1 ? e[r + 2] : 2 * o - i;
    return bv((n - r / t) * t, a, i, o, u);
  };
}
function xv(e) {
  var t = e.length;
  return function(n) {
    var r = Math.floor(((n %= 1) < 0 ? ++n : n) * t), i = e[(r + t - 1) % t], o = e[r % t], a = e[(r + 1) % t], u = e[(r + 2) % t];
    return bv((n - r / t) * t, i, o, a, u);
  };
}
function Ru(e) {
  return function() {
    return e;
  };
}
function _v(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Yb(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Cu(e, t) {
  var n = t - e;
  return n ? _v(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Ru(isNaN(e) ? t : e);
}
function Xb(e) {
  return (e = +e) == 1 ? Ut : function(t, n) {
    return n - t ? Yb(t, n, e) : Ru(isNaN(t) ? n : t);
  };
}
function Ut(e, t) {
  var n = t - e;
  return n ? _v(e, n) : Ru(isNaN(e) ? t : e);
}
const tu = function e(t) {
  var n = Xb(t);
  function r(i, o) {
    var a = n((i = Ja(i)).r, (o = Ja(o)).r), u = n(i.g, o.g), f = n(i.b, o.b), c = Ut(i.opacity, o.opacity);
    return function(h) {
      return i.r = a(h), i.g = u(h), i.b = f(h), i.opacity = c(h), i + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Sv(e) {
  return function(t) {
    var n = t.length, r = new Array(n), i = new Array(n), o = new Array(n), a, u;
    for (a = 0; a < n; ++a)
      u = Ja(t[a]), r[a] = u.r || 0, i[a] = u.g || 0, o[a] = u.b || 0;
    return r = e(r), i = e(i), o = e(o), u.opacity = 1, function(f) {
      return u.r = r(f), u.g = i(f), u.b = o(f), u + "";
    };
  };
}
var Kb = Sv(wv), Qb = Sv(xv);
function Nc(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i)
      r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function Rv(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Zb(e, t) {
  return (Rv(t) ? Nc : Cv)(e, t);
}
function Cv(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), a;
  for (a = 0; a < r; ++a)
    i[a] = Gi(e[a], t[a]);
  for (; a < n; ++a)
    o[a] = t[a];
  return function(u) {
    for (a = 0; a < r; ++a)
      o[a] = i[a](u);
    return o;
  };
}
function Pv(e, t) {
  var n = new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Fn(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Nv(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Gi(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n)
      r[i] = n[i](o);
    return r;
  };
}
var Ol = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Gs = new RegExp(Ol.source, "g");
function Jb(e) {
  return function() {
    return e;
  };
}
function e1(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Tv(e, t) {
  var n = Ol.lastIndex = Gs.lastIndex = 0, r, i, o, a = -1, u = [], f = [];
  for (e = e + "", t = t + ""; (r = Ol.exec(e)) && (i = Gs.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), u[a] ? u[a] += o : u[++a] = o), (r = r[0]) === (i = i[0]) ? u[a] ? u[a] += i : u[++a] = i : (u[++a] = null, f.push({ i: a, x: Fn(r, i) })), n = Gs.lastIndex;
  return n < t.length && (o = t.slice(n), u[a] ? u[a] += o : u[++a] = o), u.length < 2 ? f[0] ? e1(f[0].x) : Jb(t) : (t = f.length, function(c) {
    for (var h = 0, p; h < t; ++h)
      u[(p = f[h]).i] = p.x(c);
    return u.join("");
  });
}
function Gi(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ru(t) : (n === "number" ? Fn : n === "string" ? (r = Fo(t)) ? (t = r, tu) : Tv : t instanceof Fo ? tu : t instanceof Date ? Pv : Rv(t) ? Nc : Array.isArray(t) ? Cv : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Nv : Fn)(e, t);
}
function t1(e) {
  var t = e.length;
  return function(n) {
    return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
  };
}
function n1(e, t) {
  var n = Cu(+e, +t);
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
function Ev(e, t, n, r, i, o) {
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
var uo, js, Md, ka;
function r1(e) {
  return e === "none" ? Al : (uo || (uo = document.createElement("DIV"), js = document.documentElement, Md = document.defaultView), uo.style.transform = e, e = Md.getComputedStyle(js.appendChild(uo), null).getPropertyValue("transform"), js.removeChild(uo), e = e.slice(7, -1).split(","), Ev(+e[0], +e[1], +e[2], +e[3], +e[4], +e[5]));
}
function i1(e) {
  return e == null || (ka || (ka = document.createElementNS("http://www.w3.org/2000/svg", "g")), ka.setAttribute("transform", e), !(e = ka.transform.baseVal.consolidate())) ? Al : (e = e.matrix, Ev(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Mv(e, t, n, r) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, p, w, P, _) {
    if (c !== p || h !== w) {
      var N = P.push("translate(", null, t, null, n);
      _.push({ i: N - 4, x: Fn(c, p) }, { i: N - 2, x: Fn(h, w) });
    } else
      (p || w) && P.push("translate(" + p + t + w + n);
  }
  function a(c, h, p, w) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), w.push({ i: p.push(i(p) + "rotate(", null, r) - 2, x: Fn(c, h) })) : h && p.push(i(p) + "rotate(" + h + r);
  }
  function u(c, h, p, w) {
    c !== h ? w.push({ i: p.push(i(p) + "skewX(", null, r) - 2, x: Fn(c, h) }) : h && p.push(i(p) + "skewX(" + h + r);
  }
  function f(c, h, p, w, P, _) {
    if (c !== p || h !== w) {
      var N = P.push(i(P) + "scale(", null, ",", null, ")");
      _.push({ i: N - 4, x: Fn(c, p) }, { i: N - 2, x: Fn(h, w) });
    } else
      (p !== 1 || w !== 1) && P.push(i(P) + "scale(" + p + "," + w + ")");
  }
  return function(c, h) {
    var p = [], w = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, p, w), a(c.rotate, h.rotate, p, w), u(c.skewX, h.skewX, p, w), f(c.scaleX, c.scaleY, h.scaleX, h.scaleY, p, w), c = h = null, function(P) {
      for (var _ = -1, N = w.length, I; ++_ < N; )
        p[(I = w[_]).i] = I.x(P);
      return p.join("");
    };
  };
}
var o1 = Mv(r1, "px, ", "px)", "deg)"), a1 = Mv(i1, ", ", ")", ")"), so = Math.SQRT2, Hs = 2, Od = 4, u1 = 1e-12;
function Ad(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function s1(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function l1(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
function c1(e, t) {
  var n = e[0], r = e[1], i = e[2], o = t[0], a = t[1], u = t[2], f = o - n, c = a - r, h = f * f + c * c, p, w;
  if (h < u1)
    w = Math.log(u / i) / so, p = function(F) {
      return [
        n + F * f,
        r + F * c,
        i * Math.exp(so * F * w)
      ];
    };
  else {
    var P = Math.sqrt(h), _ = (u * u - i * i + Od * h) / (2 * i * Hs * P), N = (u * u - i * i - Od * h) / (2 * u * Hs * P), I = Math.log(Math.sqrt(_ * _ + 1) - _), k = Math.log(Math.sqrt(N * N + 1) - N);
    w = (k - I) / so, p = function(F) {
      var T = F * w, G = Ad(I), M = i / (Hs * P) * (G * l1(so * T + I) - s1(I));
      return [
        n + M * f,
        r + M * c,
        i * G / Ad(so * T + I)
      ];
    };
  }
  return p.duration = w * 1e3, p;
}
function Ov(e) {
  return function(t, n) {
    var r = e((t = Nl(t)).h, (n = Nl(n)).h), i = Ut(t.s, n.s), o = Ut(t.l, n.l), a = Ut(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.s = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Av = Ov(Cu);
var kv = Ov(Ut);
function $v(e, t) {
  var n = Ut((e = Tl(e)).l, (t = Tl(t)).l), r = Ut(e.a, t.a), i = Ut(e.b, t.b), o = Ut(e.opacity, t.opacity);
  return function(a) {
    return e.l = n(a), e.a = r(a), e.b = i(a), e.opacity = o(a), e + "";
  };
}
function Fv(e) {
  return function(t, n) {
    var r = e((t = El(t)).h, (n = El(n)).h), i = Ut(t.c, n.c), o = Ut(t.l, n.l), a = Ut(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.c = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Iv = Fv(Cu);
var Bv = Fv(Ut);
function Dv(e) {
  return function t(n) {
    n = +n;
    function r(i, o) {
      var a = e((i = Ml(i)).h, (o = Ml(o)).h), u = Ut(i.s, o.s), f = Ut(i.l, o.l), c = Ut(i.opacity, o.opacity);
      return function(h) {
        return i.h = a(h), i.s = u(h), i.l = f(Math.pow(h, n)), i.opacity = c(h), i + "";
      };
    }
    return r.gamma = t, r;
  }(1);
}
const zv = Dv(Cu);
var Lv = Dv(Ut);
function Gv(e, t) {
  for (var n = 0, r = t.length - 1, i = t[0], o = new Array(r < 0 ? 0 : r); n < r; )
    o[n] = e(i, i = t[++n]);
  return function(a) {
    var u = Math.max(0, Math.min(r - 1, Math.floor(a *= r)));
    return o[u](a - u);
  };
}
function f1(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r)
    n[r] = e(r / (t - 1));
  return n;
}
const d1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  interpolate: Gi,
  interpolateArray: Zb,
  interpolateBasis: wv,
  interpolateBasisClosed: xv,
  interpolateDate: Pv,
  interpolateDiscrete: t1,
  interpolateHue: n1,
  interpolateNumber: Fn,
  interpolateNumberArray: Nc,
  interpolateObject: Nv,
  interpolateRound: Ko,
  interpolateString: Tv,
  interpolateTransformCss: o1,
  interpolateTransformSvg: a1,
  interpolateZoom: c1,
  interpolateRgb: tu,
  interpolateRgbBasis: Kb,
  interpolateRgbBasisClosed: Qb,
  interpolateHsl: Av,
  interpolateHslLong: kv,
  interpolateLab: $v,
  interpolateHcl: Iv,
  interpolateHclLong: Bv,
  interpolateCubehelix: zv,
  interpolateCubehelixLong: Lv,
  piecewise: Gv,
  quantize: f1
}, Symbol.toStringTag, { value: "Module" }));
function p1(e) {
  return function() {
    return e;
  };
}
function nu(e) {
  return +e;
}
var kd = [0, 1];
function on(e) {
  return e;
}
function kl(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : p1(isNaN(t) ? NaN : 0.5);
}
function h1(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function v1(e, t, n) {
  var r = e[0], i = e[1], o = t[0], a = t[1];
  return i < r ? (r = kl(i, r), o = n(a, o)) : (r = kl(r, i), o = n(o, a)), function(u) {
    return o(r(u));
  };
}
function m1(e, t, n) {
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
function Pu() {
  var e = kd, t = kd, n = Gi, r, i, o, a = on, u, f, c;
  function h() {
    var w = Math.min(e.length, t.length);
    return a !== on && (a = h1(e[0], e[w - 1])), u = w > 2 ? m1 : v1, f = c = null, p;
  }
  function p(w) {
    return w == null || isNaN(w = +w) ? o : (f || (f = u(e.map(r), t, n)))(r(a(w)));
  }
  return p.invert = function(w) {
    return a(i((c || (c = u(t, e.map(r), Fn)))(w)));
  }, p.domain = function(w) {
    return arguments.length ? (e = Array.from(w, nu), h()) : e.slice();
  }, p.range = function(w) {
    return arguments.length ? (t = Array.from(w), h()) : t.slice();
  }, p.rangeRound = function(w) {
    return t = Array.from(w), n = Ko, h();
  }, p.clamp = function(w) {
    return arguments.length ? (a = w ? !0 : on, h()) : a !== on;
  }, p.interpolate = function(w) {
    return arguments.length ? (n = w, h()) : n;
  }, p.unknown = function(w) {
    return arguments.length ? (o = w, p) : o;
  }, function(w, P) {
    return r = w, i = P, h();
  };
}
function Tc() {
  return Pu()(on, on);
}
function g1(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function ru(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0)
    return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function Ii(e) {
  return e = ru(Math.abs(e)), e ? e[1] : NaN;
}
function y1(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], a = 0, u = e[0], f = 0; i > 0 && u > 0 && (f + u + 1 > r && (u = Math.max(1, r - f)), o.push(n.substring(i -= u, i + u)), !((f += u + 1) > r)); )
      u = e[a = (a + 1) % e.length];
    return o.reverse().join(t);
  };
}
function b1(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var w1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function iu(e) {
  if (!(t = w1.exec(e)))
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
iu.prototype = Ec.prototype;
function Ec(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Ec.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function x1(e) {
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
var jv;
function _1(e, t) {
  var n = ru(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1], o = i - (jv = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return o === a ? r : o > a ? r + new Array(o - a + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + ru(e, Math.max(0, t + o - 1))[0];
}
function $d(e, t) {
  var n = ru(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Fd = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: g1,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => $d(e * 100, t),
  r: $d,
  s: _1,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function Id(e) {
  return e;
}
var Bd = Array.prototype.map, Dd = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function S1(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? Id : y1(Bd.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? Id : b1(Bd.call(e.numerals, String)), a = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "\u2212" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(p) {
    p = iu(p);
    var w = p.fill, P = p.align, _ = p.sign, N = p.symbol, I = p.zero, k = p.width, F = p.comma, T = p.precision, G = p.trim, M = p.type;
    M === "n" ? (F = !0, M = "g") : Fd[M] || (T === void 0 && (T = 12), G = !0, M = "g"), (I || w === "0" && P === "=") && (I = !0, w = "0", P = "=");
    var z = N === "$" ? n : N === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", te = N === "$" ? r : /[%p]/.test(M) ? a : "", Q = Fd[M], fe = /[defgprs%]/.test(M);
    T = T === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, T)) : Math.max(0, Math.min(20, T));
    function me(re) {
      var ee = z, be = te, Oe, ut, Ue;
      if (M === "c")
        be = Q(re) + be, re = "";
      else {
        re = +re;
        var st = re < 0 || 1 / re < 0;
        if (re = isNaN(re) ? f : Q(Math.abs(re), T), G && (re = x1(re)), st && +re == 0 && _ !== "+" && (st = !1), ee = (st ? _ === "(" ? _ : u : _ === "-" || _ === "(" ? "" : _) + ee, be = (M === "s" ? Dd[8 + jv / 3] : "") + be + (st && _ === "(" ? ")" : ""), fe) {
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
    return me.toString = function() {
      return p + "";
    }, me;
  }
  function h(p, w) {
    var P = c((p = iu(p), p.type = "f", p)), _ = Math.max(-8, Math.min(8, Math.floor(Ii(w) / 3))) * 3, N = Math.pow(10, -_), I = Dd[8 + _ / 3];
    return function(k) {
      return P(N * k) + I;
    };
  }
  return {
    format: c,
    formatPrefix: h
  };
}
var $a, Mc, Hv;
R1({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function R1(e) {
  return $a = S1(e), Mc = $a.format, Hv = $a.formatPrefix, $a;
}
function C1(e) {
  return Math.max(0, -Ii(Math.abs(e)));
}
function P1(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Ii(t) / 3))) * 3 - Ii(Math.abs(e)));
}
function N1(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Ii(t) - Ii(e)) + 1;
}
function Wv(e, t, n, r) {
  var i = Cl(e, t, n), o;
  switch (r = iu(r == null ? ",f" : r), r.type) {
    case "s": {
      var a = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = P1(i, a)) && (r.precision = o), Hv(r, a);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = N1(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = C1(i)) && (r.precision = o - (r.type === "%") * 2);
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
    return Wv(i[0], i[i.length - 1], n == null ? 10 : n, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, a = r[i], u = r[o], f, c, h = 10;
    for (u < a && (c = a, a = u, u = c, c = i, i = o, o = c); h-- > 0; ) {
      if (c = rv(a, u, n), c === f)
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
  var e = Tc();
  return e.copy = function() {
    return Qo(e, Oc());
  }, Mn.apply(e, arguments), Lr(e);
}
function Uv(e) {
  var t;
  function n(r) {
    return r == null || isNaN(r = +r) ? t : r;
  }
  return n.invert = n, n.domain = n.range = function(r) {
    return arguments.length ? (e = Array.from(r, nu), n) : e.slice();
  }, n.unknown = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.copy = function() {
    return Uv(e).unknown(t);
  }, e = arguments.length ? Array.from(e, nu) : [0, 1], Lr(n);
}
function Vv(e, t) {
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
function T1(e) {
  return -Math.log(-e);
}
function E1(e) {
  return -Math.exp(-e);
}
function M1(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function O1(e) {
  return e === 10 ? M1 : e === Math.E ? Math.exp : function(t) {
    return Math.pow(e, t);
  };
}
function A1(e) {
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
    return i = A1(r), o = O1(r), n()[0] < 0 ? (i = Gd(i), o = Gd(o), e(T1, E1)) : e(zd, Ld), t;
  }
  return t.base = function(u) {
    return arguments.length ? (r = +u, a()) : r;
  }, t.domain = function(u) {
    return arguments.length ? (n(u), a()) : n();
  }, t.ticks = function(u) {
    var f = n(), c = f[0], h = f[f.length - 1], p;
    (p = h < c) && (w = c, c = h, h = w);
    var w = i(c), P = i(h), _, N, I, k = u == null ? 10 : +u, F = [];
    if (!(r % 1) && P - w < k) {
      if (w = Math.floor(w), P = Math.ceil(P), c > 0) {
        for (; w <= P; ++w)
          for (N = 1, _ = o(w); N < r; ++N)
            if (I = _ * N, !(I < c)) {
              if (I > h)
                break;
              F.push(I);
            }
      } else
        for (; w <= P; ++w)
          for (N = r - 1, _ = o(w); N >= 1; --N)
            if (I = _ * N, !(I < c)) {
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
    return n(Vv(n(), {
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
  var e = Ac(Pu()).domain([1, 10]);
  return e.copy = function() {
    return Qo(e, kc()).base(e.base());
  }, Mn.apply(e, arguments), e;
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
  var e = $c(Pu());
  return e.copy = function() {
    return Qo(e, Fc()).constant(e.constant());
  }, Mn.apply(e, arguments);
}
function Wd(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function k1(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function $1(e) {
  return e < 0 ? -e * e : e * e;
}
function Ic(e) {
  var t = e(on, on), n = 1;
  function r() {
    return n === 1 ? e(on, on) : n === 0.5 ? e(k1, $1) : e(Wd(n), Wd(1 / n));
  }
  return t.exponent = function(i) {
    return arguments.length ? (n = +i, r()) : n;
  }, Lr(t);
}
function Nu() {
  var e = Ic(Pu());
  return e.copy = function() {
    return Qo(e, Nu()).exponent(e.exponent());
  }, Mn.apply(e, arguments), e;
}
function qv() {
  return Nu.apply(null, arguments).exponent(0.5);
}
function Ud(e) {
  return Math.sign(e) * e * e;
}
function F1(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function Yv() {
  var e = Tc(), t = [0, 1], n = !1, r;
  function i(o) {
    var a = F1(e(o));
    return isNaN(a) ? r : n ? Math.round(a) : a;
  }
  return i.invert = function(o) {
    return e.invert(Ud(o));
  }, i.domain = function(o) {
    return arguments.length ? (e.domain(o), i) : e.domain();
  }, i.range = function(o) {
    return arguments.length ? (e.range((t = Array.from(o, nu)).map(Ud)), i) : t.slice();
  }, i.rangeRound = function(o) {
    return i.range(o).round(!0);
  }, i.round = function(o) {
    return arguments.length ? (n = !!o, i) : n;
  }, i.clamp = function(o) {
    return arguments.length ? (e.clamp(o), i) : e.clamp();
  }, i.unknown = function(o) {
    return arguments.length ? (r = o, i) : r;
  }, i.copy = function() {
    return Yv(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
  }, Mn.apply(i, arguments), Lr(i);
}
function Bc() {
  var e = [], t = [], n = [], r;
  function i() {
    var a = 0, u = Math.max(1, t.length);
    for (n = new Array(u - 1); ++a < u; )
      n[a - 1] = Ib(e, a / u);
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
  }, Mn.apply(o, arguments);
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
  }, Mn.apply(Lr(a), arguments);
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
  }, Mn.apply(i, arguments);
}
var Ws = new Date(), Us = new Date();
function Lt(e, t, n, r) {
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
    return Lt(function(a) {
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
    return Ws.setTime(+o), Us.setTime(+a), e(Ws), e(Us), Math.floor(n(Ws, Us));
  }, i.every = function(o) {
    return o = Math.floor(o), !isFinite(o) || !(o > 0) ? null : o > 1 ? i.filter(r ? function(a) {
      return r(a) % o === 0;
    } : function(a) {
      return i.count(0, a) % o === 0;
    }) : i;
  }), i;
}
var ou = Lt(function() {
}, function(e, t) {
  e.setTime(+e + t);
}, function(e, t) {
  return t - e;
});
ou.every = function(e) {
  return e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? Lt(function(t) {
    t.setTime(Math.floor(t / e) * e);
  }, function(t, n) {
    t.setTime(+t + n * e);
  }, function(t, n) {
    return (n - t) / e;
  }) : ou;
};
const $l = ou;
var Vd = ou.range;
const fr = 1e3, En = fr * 60, dr = En * 60, ri = dr * 24, Lc = ri * 7, qd = ri * 30, Vs = ri * 365;
var Xv = Lt(function(e) {
  e.setTime(e - e.getMilliseconds());
}, function(e, t) {
  e.setTime(+e + t * fr);
}, function(e, t) {
  return (t - e) / fr;
}, function(e) {
  return e.getUTCSeconds();
});
const Jn = Xv;
var Yd = Xv.range, Kv = Lt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * fr);
}, function(e, t) {
  e.setTime(+e + t * En);
}, function(e, t) {
  return (t - e) / En;
}, function(e) {
  return e.getMinutes();
});
const Tu = Kv;
var I1 = Kv.range, Qv = Lt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * fr - e.getMinutes() * En);
}, function(e, t) {
  e.setTime(+e + t * dr);
}, function(e, t) {
  return (t - e) / dr;
}, function(e) {
  return e.getHours();
});
const Eu = Qv;
var B1 = Qv.range, Zv = Lt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * En) / ri,
  (e) => e.getDate() - 1
);
const ji = Zv;
var D1 = Zv.range;
function di(e) {
  return Lt(function(t) {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setDate(t.getDate() + n * 7);
  }, function(t, n) {
    return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * En) / Lc;
  });
}
var ii = di(0), Bo = di(1), Jv = di(2), em = di(3), oi = di(4), tm = di(5), nm = di(6), Xd = ii.range, z1 = Bo.range, L1 = Jv.range, G1 = em.range, j1 = oi.range, H1 = tm.range, W1 = nm.range, rm = Lt(function(e) {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setMonth(e.getMonth() + t);
}, function(e, t) {
  return t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12;
}, function(e) {
  return e.getMonth();
});
const Mu = rm;
var U1 = rm.range, Gc = Lt(function(e) {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setFullYear(e.getFullYear() + t);
}, function(e, t) {
  return t.getFullYear() - e.getFullYear();
}, function(e) {
  return e.getFullYear();
});
Gc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Lt(function(t) {
    t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setFullYear(t.getFullYear() + n * e);
  });
};
const pr = Gc;
var V1 = Gc.range, im = Lt(function(e) {
  e.setUTCSeconds(0, 0);
}, function(e, t) {
  e.setTime(+e + t * En);
}, function(e, t) {
  return (t - e) / En;
}, function(e) {
  return e.getUTCMinutes();
});
const Ou = im;
var q1 = im.range, om = Lt(function(e) {
  e.setUTCMinutes(0, 0, 0);
}, function(e, t) {
  e.setTime(+e + t * dr);
}, function(e, t) {
  return (t - e) / dr;
}, function(e) {
  return e.getUTCHours();
});
const Au = om;
var Y1 = om.range, am = Lt(function(e) {
  e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCDate(e.getUTCDate() + t);
}, function(e, t) {
  return (t - e) / ri;
}, function(e) {
  return e.getUTCDate() - 1;
});
const Hi = am;
var X1 = am.range;
function pi(e) {
  return Lt(function(t) {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, function(t, n) {
    return (n - t) / Lc;
  });
}
var ai = pi(0), Do = pi(1), um = pi(2), sm = pi(3), ui = pi(4), lm = pi(5), cm = pi(6), Kd = ai.range, K1 = Do.range, Q1 = um.range, Z1 = sm.range, J1 = ui.range, ew = lm.range, tw = cm.range, fm = Lt(function(e) {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCMonth(e.getUTCMonth() + t);
}, function(e, t) {
  return t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12;
}, function(e) {
  return e.getUTCMonth();
});
const ku = fm;
var nw = fm.range, jc = Lt(function(e) {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, function(e, t) {
  return t.getUTCFullYear() - e.getUTCFullYear();
}, function(e) {
  return e.getUTCFullYear();
});
jc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Lt(function(t) {
    t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCFullYear(t.getUTCFullYear() + n * e);
  });
};
const hr = jc;
var rw = jc.range;
function dm(e, t, n, r, i, o) {
  const a = [
    [Jn, 1, fr],
    [Jn, 5, 5 * fr],
    [Jn, 15, 15 * fr],
    [Jn, 30, 30 * fr],
    [o, 1, En],
    [o, 5, 5 * En],
    [o, 15, 15 * En],
    [o, 30, 30 * En],
    [i, 1, dr],
    [i, 3, 3 * dr],
    [i, 6, 6 * dr],
    [i, 12, 12 * dr],
    [r, 1, ri],
    [r, 2, 2 * ri],
    [n, 1, Lc],
    [t, 1, qd],
    [t, 3, 3 * qd],
    [e, 1, Vs]
  ];
  function u(c, h, p) {
    const w = h < c;
    w && ([c, h] = [h, c]);
    const P = p && typeof p.range == "function" ? p : f(c, h, p), _ = P ? P.range(c, +h + 1) : [];
    return w ? _.reverse() : _;
  }
  function f(c, h, p) {
    const w = Math.abs(h - c) / p, P = wu(([, , I]) => I).right(a, w);
    if (P === a.length)
      return e.every(Cl(c / Vs, h / Vs, p));
    if (P === 0)
      return $l.every(Math.max(Cl(c, h, p), 1));
    const [_, N] = a[w / a[P - 1][2] < a[P][2] / w ? P - 1 : P];
    return _.every(N);
  }
  return [u, f];
}
const [pm, hm] = dm(hr, ku, ai, Hi, Au, Ou), [vm, mm] = dm(pr, Mu, ii, ji, Eu, Tu), iw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  timeInterval: Lt,
  timeMillisecond: $l,
  timeMilliseconds: Vd,
  utcMillisecond: $l,
  utcMilliseconds: Vd,
  timeSecond: Jn,
  timeSeconds: Yd,
  utcSecond: Jn,
  utcSeconds: Yd,
  timeMinute: Tu,
  timeMinutes: I1,
  timeHour: Eu,
  timeHours: B1,
  timeDay: ji,
  timeDays: D1,
  timeWeek: ii,
  timeWeeks: Xd,
  timeSunday: ii,
  timeSundays: Xd,
  timeMonday: Bo,
  timeMondays: z1,
  timeTuesday: Jv,
  timeTuesdays: L1,
  timeWednesday: em,
  timeWednesdays: G1,
  timeThursday: oi,
  timeThursdays: j1,
  timeFriday: tm,
  timeFridays: H1,
  timeSaturday: nm,
  timeSaturdays: W1,
  timeMonth: Mu,
  timeMonths: U1,
  timeYear: pr,
  timeYears: V1,
  utcMinute: Ou,
  utcMinutes: q1,
  utcHour: Au,
  utcHours: Y1,
  utcDay: Hi,
  utcDays: X1,
  utcWeek: ai,
  utcWeeks: Kd,
  utcSunday: ai,
  utcSundays: Kd,
  utcMonday: Do,
  utcMondays: K1,
  utcTuesday: um,
  utcTuesdays: Q1,
  utcWednesday: sm,
  utcWednesdays: Z1,
  utcThursday: ui,
  utcThursdays: J1,
  utcFriday: lm,
  utcFridays: ew,
  utcSaturday: cm,
  utcSaturdays: tw,
  utcMonth: ku,
  utcMonths: nw,
  utcYear: hr,
  utcYears: rw,
  utcTicks: pm,
  utcTickInterval: hm,
  timeTicks: vm,
  timeTickInterval: mm
}, Symbol.toStringTag, { value: "Module" }));
function qs(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Ys(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function lo(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function ow(e) {
  var t = e.dateTime, n = e.date, r = e.time, i = e.periods, o = e.days, a = e.shortDays, u = e.months, f = e.shortMonths, c = co(i), h = fo(i), p = co(o), w = fo(o), P = co(a), _ = fo(a), N = co(u), I = fo(u), k = co(f), F = fo(f), T = {
    a: st,
    A: lt,
    b: dt,
    B: V,
    c: null,
    d: np,
    e: np,
    f: Tw,
    g: Dw,
    G: Lw,
    H: Cw,
    I: Pw,
    j: Nw,
    L: gm,
    m: Ew,
    M: Mw,
    p: ue,
    q: Ne,
    Q: op,
    s: ap,
    S: Ow,
    u: Aw,
    U: kw,
    V: $w,
    w: Fw,
    W: Iw,
    x: null,
    X: null,
    y: Bw,
    Y: zw,
    Z: Gw,
    "%": ip
  }, G = {
    a: Ae,
    A: Ce,
    b: Re,
    B: Te,
    c: null,
    d: rp,
    e: rp,
    f: Uw,
    g: tx,
    G: rx,
    H: jw,
    I: Hw,
    j: Ww,
    L: bm,
    m: Vw,
    M: qw,
    p: Be,
    q: Le,
    Q: op,
    s: ap,
    S: Yw,
    u: Xw,
    U: Kw,
    V: Qw,
    w: Zw,
    W: Jw,
    x: null,
    X: null,
    y: ex,
    Y: nx,
    Z: ix,
    "%": ip
  }, M = {
    a: me,
    A: re,
    b: ee,
    B: be,
    c: Oe,
    d: ep,
    e: ep,
    f: xw,
    g: Jd,
    G: Zd,
    H: tp,
    I: tp,
    j: gw,
    L: ww,
    m: mw,
    M: yw,
    p: fe,
    q: vw,
    Q: Sw,
    s: Rw,
    S: bw,
    u: cw,
    U: fw,
    V: dw,
    w: lw,
    W: pw,
    x: ut,
    X: Ue,
    y: Jd,
    Y: Zd,
    Z: hw,
    "%": _w
  };
  T.x = z(n, T), T.X = z(r, T), T.c = z(t, T), G.x = z(n, G), G.X = z(r, G), G.c = z(t, G);
  function z(X, ce) {
    return function(Ge) {
      var D = [], gt = -1, ct = 0, St = X.length, At, Zt, sn;
      for (Ge instanceof Date || (Ge = new Date(+Ge)); ++gt < St; )
        X.charCodeAt(gt) === 37 && (D.push(X.slice(ct, gt)), (Zt = Qd[At = X.charAt(++gt)]) != null ? At = X.charAt(++gt) : Zt = At === "e" ? " " : "0", (sn = ce[At]) && (At = sn(Ge, Zt)), D.push(At), ct = gt + 1);
      return D.push(X.slice(ct, gt)), D.join("");
    };
  }
  function te(X, ce) {
    return function(Ge) {
      var D = lo(1900, void 0, 1), gt = Q(D, X, Ge += "", 0), ct, St;
      if (gt != Ge.length)
        return null;
      if ("Q" in D)
        return new Date(D.Q);
      if ("s" in D)
        return new Date(D.s * 1e3 + ("L" in D ? D.L : 0));
      if (ce && !("Z" in D) && (D.Z = 0), "p" in D && (D.H = D.H % 12 + D.p * 12), D.m === void 0 && (D.m = "q" in D ? D.q : 0), "V" in D) {
        if (D.V < 1 || D.V > 53)
          return null;
        "w" in D || (D.w = 1), "Z" in D ? (ct = Ys(lo(D.y, 0, 1)), St = ct.getUTCDay(), ct = St > 4 || St === 0 ? Do.ceil(ct) : Do(ct), ct = Hi.offset(ct, (D.V - 1) * 7), D.y = ct.getUTCFullYear(), D.m = ct.getUTCMonth(), D.d = ct.getUTCDate() + (D.w + 6) % 7) : (ct = qs(lo(D.y, 0, 1)), St = ct.getDay(), ct = St > 4 || St === 0 ? Bo.ceil(ct) : Bo(ct), ct = ji.offset(ct, (D.V - 1) * 7), D.y = ct.getFullYear(), D.m = ct.getMonth(), D.d = ct.getDate() + (D.w + 6) % 7);
      } else
        ("W" in D || "U" in D) && ("w" in D || (D.w = "u" in D ? D.u % 7 : "W" in D ? 1 : 0), St = "Z" in D ? Ys(lo(D.y, 0, 1)).getUTCDay() : qs(lo(D.y, 0, 1)).getDay(), D.m = 0, D.d = "W" in D ? (D.w + 6) % 7 + D.W * 7 - (St + 5) % 7 : D.w + D.U * 7 - (St + 6) % 7);
      return "Z" in D ? (D.H += D.Z / 100 | 0, D.M += D.Z % 100, Ys(D)) : qs(D);
    };
  }
  function Q(X, ce, Ge, D) {
    for (var gt = 0, ct = ce.length, St = Ge.length, At, Zt; gt < ct; ) {
      if (D >= St)
        return -1;
      if (At = ce.charCodeAt(gt++), At === 37) {
        if (At = ce.charAt(gt++), Zt = M[At in Qd ? ce.charAt(gt++) : At], !Zt || (D = Zt(X, Ge, D)) < 0)
          return -1;
      } else if (At != Ge.charCodeAt(D++))
        return -1;
    }
    return D;
  }
  function fe(X, ce, Ge) {
    var D = c.exec(ce.slice(Ge));
    return D ? (X.p = h.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function me(X, ce, Ge) {
    var D = P.exec(ce.slice(Ge));
    return D ? (X.w = _.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function re(X, ce, Ge) {
    var D = p.exec(ce.slice(Ge));
    return D ? (X.w = w.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function ee(X, ce, Ge) {
    var D = k.exec(ce.slice(Ge));
    return D ? (X.m = F.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function be(X, ce, Ge) {
    var D = N.exec(ce.slice(Ge));
    return D ? (X.m = I.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
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
  function Ne(X) {
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
  function Te(X) {
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
      var ce = z(X += "", T);
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
      var ce = z(X += "", G);
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
var Qd = { "-": "", _: " ", 0: "0" }, qt = /^\s*\d+/, aw = /^%/, uw = /[\\^$*+?|[\]().{}]/g;
function _t(e, t, n) {
  var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", o = i.length;
  return r + (o < n ? new Array(n - o + 1).join(t) + i : i);
}
function sw(e) {
  return e.replace(uw, "\\$&");
}
function co(e) {
  return new RegExp("^(?:" + e.map(sw).join("|") + ")", "i");
}
function fo(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function lw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function cw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function fw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function dw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function pw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function Zd(e, t, n) {
  var r = qt.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function Jd(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function hw(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function vw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function mw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ep(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function gw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function tp(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function yw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function bw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function ww(e, t, n) {
  var r = qt.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function xw(e, t, n) {
  var r = qt.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function _w(e, t, n) {
  var r = aw.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function Sw(e, t, n) {
  var r = qt.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function Rw(e, t, n) {
  var r = qt.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function np(e, t) {
  return _t(e.getDate(), t, 2);
}
function Cw(e, t) {
  return _t(e.getHours(), t, 2);
}
function Pw(e, t) {
  return _t(e.getHours() % 12 || 12, t, 2);
}
function Nw(e, t) {
  return _t(1 + ji.count(pr(e), e), t, 3);
}
function gm(e, t) {
  return _t(e.getMilliseconds(), t, 3);
}
function Tw(e, t) {
  return gm(e, t) + "000";
}
function Ew(e, t) {
  return _t(e.getMonth() + 1, t, 2);
}
function Mw(e, t) {
  return _t(e.getMinutes(), t, 2);
}
function Ow(e, t) {
  return _t(e.getSeconds(), t, 2);
}
function Aw(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function kw(e, t) {
  return _t(ii.count(pr(e) - 1, e), t, 2);
}
function ym(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? oi(e) : oi.ceil(e);
}
function $w(e, t) {
  return e = ym(e), _t(oi.count(pr(e), e) + (pr(e).getDay() === 4), t, 2);
}
function Fw(e) {
  return e.getDay();
}
function Iw(e, t) {
  return _t(Bo.count(pr(e) - 1, e), t, 2);
}
function Bw(e, t) {
  return _t(e.getFullYear() % 100, t, 2);
}
function Dw(e, t) {
  return e = ym(e), _t(e.getFullYear() % 100, t, 2);
}
function zw(e, t) {
  return _t(e.getFullYear() % 1e4, t, 4);
}
function Lw(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? oi(e) : oi.ceil(e), _t(e.getFullYear() % 1e4, t, 4);
}
function Gw(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + _t(t / 60 | 0, "0", 2) + _t(t % 60, "0", 2);
}
function rp(e, t) {
  return _t(e.getUTCDate(), t, 2);
}
function jw(e, t) {
  return _t(e.getUTCHours(), t, 2);
}
function Hw(e, t) {
  return _t(e.getUTCHours() % 12 || 12, t, 2);
}
function Ww(e, t) {
  return _t(1 + Hi.count(hr(e), e), t, 3);
}
function bm(e, t) {
  return _t(e.getUTCMilliseconds(), t, 3);
}
function Uw(e, t) {
  return bm(e, t) + "000";
}
function Vw(e, t) {
  return _t(e.getUTCMonth() + 1, t, 2);
}
function qw(e, t) {
  return _t(e.getUTCMinutes(), t, 2);
}
function Yw(e, t) {
  return _t(e.getUTCSeconds(), t, 2);
}
function Xw(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function Kw(e, t) {
  return _t(ai.count(hr(e) - 1, e), t, 2);
}
function wm(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? ui(e) : ui.ceil(e);
}
function Qw(e, t) {
  return e = wm(e), _t(ui.count(hr(e), e) + (hr(e).getUTCDay() === 4), t, 2);
}
function Zw(e) {
  return e.getUTCDay();
}
function Jw(e, t) {
  return _t(Do.count(hr(e) - 1, e), t, 2);
}
function ex(e, t) {
  return _t(e.getUTCFullYear() % 100, t, 2);
}
function tx(e, t) {
  return e = wm(e), _t(e.getUTCFullYear() % 100, t, 2);
}
function nx(e, t) {
  return _t(e.getUTCFullYear() % 1e4, t, 4);
}
function rx(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? ui(e) : ui.ceil(e), _t(e.getUTCFullYear() % 1e4, t, 4);
}
function ix() {
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
var gi, xm, _m;
ox({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function ox(e) {
  return gi = ow(e), xm = gi.format, gi.parse, _m = gi.utcFormat, gi.utcParse, gi;
}
function ax(e) {
  return new Date(e);
}
function ux(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Hc(e, t, n, r, i, o, a, u, f, c) {
  var h = Tc(), p = h.invert, w = h.domain, P = c(".%L"), _ = c(":%S"), N = c("%I:%M"), I = c("%I %p"), k = c("%a %d"), F = c("%b %d"), T = c("%B"), G = c("%Y");
  function M(z) {
    return (f(z) < z ? P : u(z) < z ? _ : a(z) < z ? N : o(z) < z ? I : r(z) < z ? i(z) < z ? k : F : n(z) < z ? T : G)(z);
  }
  return h.invert = function(z) {
    return new Date(p(z));
  }, h.domain = function(z) {
    return arguments.length ? w(Array.from(z, ux)) : w().map(ax);
  }, h.ticks = function(z) {
    var te = w();
    return e(te[0], te[te.length - 1], z == null ? 10 : z);
  }, h.tickFormat = function(z, te) {
    return te == null ? M : c(te);
  }, h.nice = function(z) {
    var te = w();
    return (!z || typeof z.range != "function") && (z = t(te[0], te[te.length - 1], z == null ? 10 : z)), z ? w(Vv(te, z)) : h;
  }, h.copy = function() {
    return Qo(h, Hc(e, t, n, r, i, o, a, u, f, c));
  }, h;
}
function Sm() {
  return Mn.apply(Hc(vm, mm, pr, Mu, ii, ji, Eu, Tu, Jn, xm).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function Rm() {
  return Mn.apply(Hc(pm, hm, hr, ku, ai, Hi, Au, Ou, Jn, _m).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function $u() {
  var e = 0, t = 1, n, r, i, o, a = on, u = !1, f;
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
  return c.range = h(Gi), c.rangeRound = h(Ko), c.unknown = function(p) {
    return arguments.length ? (f = p, c) : f;
  }, function(p) {
    return o = p, n = p(e), r = p(t), i = n === r ? 0 : 1 / (r - n), c;
  };
}
function Gr(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function Cm() {
  var e = Lr($u()(on));
  return e.copy = function() {
    return Gr(e, Cm());
  }, mr.apply(e, arguments);
}
function Pm() {
  var e = Ac($u()).domain([1, 10]);
  return e.copy = function() {
    return Gr(e, Pm()).base(e.base());
  }, mr.apply(e, arguments);
}
function Nm() {
  var e = $c($u());
  return e.copy = function() {
    return Gr(e, Nm()).constant(e.constant());
  }, mr.apply(e, arguments);
}
function Wc() {
  var e = Ic($u());
  return e.copy = function() {
    return Gr(e, Wc()).exponent(e.exponent());
  }, mr.apply(e, arguments);
}
function sx() {
  return Wc.apply(null, arguments).exponent(0.5);
}
function Tm() {
  var e = [], t = on;
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
    return Array.from({ length: r + 1 }, (i, o) => Fb(e, o / r));
  }, n.copy = function() {
    return Tm(t).domain(e);
  }, mr.apply(n, arguments);
}
function Fu() {
  var e = 0, t = 0.5, n = 1, r = 1, i, o, a, u, f, c = on, h, p = !1, w;
  function P(N) {
    return isNaN(N = +N) ? w : (N = 0.5 + ((N = +h(N)) - o) * (r * N < r * o ? u : f), c(p ? Math.max(0, Math.min(1, N)) : N));
  }
  P.domain = function(N) {
    return arguments.length ? ([e, t, n] = N, i = h(e = +e), o = h(t = +t), a = h(n = +n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P) : [e, t, n];
  }, P.clamp = function(N) {
    return arguments.length ? (p = !!N, P) : p;
  }, P.interpolator = function(N) {
    return arguments.length ? (c = N, P) : c;
  };
  function _(N) {
    return function(I) {
      var k, F, T;
      return arguments.length ? ([k, F, T] = I, c = Gv(N, [k, F, T]), P) : [c(0), c(0.5), c(1)];
    };
  }
  return P.range = _(Gi), P.rangeRound = _(Ko), P.unknown = function(N) {
    return arguments.length ? (w = N, P) : w;
  }, function(N) {
    return h = N, i = N(e), o = N(t), a = N(n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P;
  };
}
function Em() {
  var e = Lr(Fu()(on));
  return e.copy = function() {
    return Gr(e, Em());
  }, mr.apply(e, arguments);
}
function Mm() {
  var e = Ac(Fu()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return Gr(e, Mm()).base(e.base());
  }, mr.apply(e, arguments);
}
function Om() {
  var e = $c(Fu());
  return e.copy = function() {
    return Gr(e, Om()).constant(e.constant());
  }, mr.apply(e, arguments);
}
function Uc() {
  var e = Ic(Fu());
  return e.copy = function() {
    return Gr(e, Uc()).exponent(e.exponent());
  }, mr.apply(e, arguments);
}
function lx() {
  return Uc.apply(null, arguments).exponent(0.5);
}
const cx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: _u,
  scalePoint: uv,
  scaleIdentity: Uv,
  scaleLinear: Oc,
  scaleLog: kc,
  scaleSymlog: Fc,
  scaleOrdinal: xu,
  scaleImplicit: Pl,
  scalePow: Nu,
  scaleSqrt: qv,
  scaleRadial: Yv,
  scaleQuantile: Bc,
  scaleQuantize: Dc,
  scaleThreshold: zc,
  scaleTime: Sm,
  scaleUtc: Rm,
  scaleSequential: Cm,
  scaleSequentialLog: Pm,
  scaleSequentialPow: Wc,
  scaleSequentialSqrt: sx,
  scaleSequentialSymlog: Nm,
  scaleSequentialQuantile: Tm,
  scaleDiverging: Em,
  scaleDivergingLog: Mm,
  scaleDivergingPow: Uc,
  scaleDivergingSqrt: lx,
  scaleDivergingSymlog: Om,
  tickFormat: Wv
}, Symbol.toStringTag, { value: "Module" }));
function fx(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
function dx(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
function px(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
function hx(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
function vx(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
function mx(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
function gx(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var up = {
  lab: $v,
  hcl: Iv,
  "hcl-long": Bv,
  hsl: Av,
  "hsl-long": kv,
  cubehelix: zv,
  "cubehelix-long": Lv,
  rgb: tu
};
function yx(e) {
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
function bx(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = yx(t.interpolate);
    e.interpolate(n);
  }
}
var wx = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), xx = "%Y-%m-%d %H:%M";
function _x(e) {
  var t = e.tickFormat(1, xx)(wx);
  return t === "2020-02-02 03:04";
}
var sp = {
  day: ji,
  hour: Eu,
  minute: Tu,
  month: Mu,
  second: Jn,
  week: ii,
  year: pr
}, lp = {
  day: Hi,
  hour: Au,
  minute: Ou,
  month: ku,
  second: Jn,
  week: ai,
  year: hr
};
function Sx(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = _x(r);
      if (typeof n == "string")
        r.nice(i ? lp[n] : sp[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? lp[o] : sp[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
function Rx(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
function Cx(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
function Px(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(Ko));
}
function Nx(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
function Tx(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
var Ex = [
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
], Mx = {
  domain: fx,
  nice: Sx,
  zero: Tx,
  interpolate: bx,
  round: Px,
  align: px,
  base: hx,
  clamp: vx,
  constant: mx,
  exponent: gx,
  padding: Rx,
  range: dx,
  reverse: Cx,
  unknown: Nx
};
function yn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = Ex.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      Mx[f](a, u);
    }), a;
  };
}
var Ox = yn("domain", "range", "reverse", "align", "padding", "round");
function Ax(e) {
  return Ox(_u(), e);
}
var kx = yn("domain", "range", "reverse", "align", "padding", "round");
function $x(e) {
  return kx(uv(), e);
}
var Fx = yn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function cp(e) {
  return Fx(Oc(), e);
}
var Ix = yn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Bx(e) {
  return Ix(Sm(), e);
}
var Dx = yn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function zx(e) {
  return Dx(Rm(), e);
}
var Lx = yn("domain", "range", "reverse", "base", "clamp", "interpolate", "nice", "round");
function Gx(e) {
  return Lx(kc(), e);
}
var jx = yn("domain", "range", "reverse", "clamp", "exponent", "interpolate", "nice", "round", "zero");
function Hx(e) {
  return jx(Nu(), e);
}
var Wx = yn("domain", "range", "reverse", "unknown");
function Ux(e) {
  return Wx(xu(), e);
}
var Vx = yn("domain", "range", "reverse", "nice", "zero");
function qx(e) {
  return Vx(Dc(), e);
}
var Yx = yn("domain", "range", "reverse");
function Xx(e) {
  return Yx(Bc(), e);
}
var Kx = yn("domain", "range", "reverse", "clamp", "constant", "nice", "zero", "round");
function Qx(e) {
  return Kx(Fc(), e);
}
var Zx = yn("domain", "range", "reverse");
function Jx(e) {
  return Zx(zc(), e);
}
var e_ = yn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function t_(e) {
  return e_(qv(), e);
}
function Fa(e) {
  if (typeof e < "u" && "type" in e)
    switch (e.type) {
      case "linear":
        return cp(e);
      case "log":
        return Gx(e);
      case "pow":
        return Hx(e);
      case "sqrt":
        return t_(e);
      case "symlog":
        return Qx(e);
      case "time":
        return Bx(e);
      case "utc":
        return zx(e);
      case "quantile":
        return Xx(e);
      case "quantize":
        return qx(e);
      case "threshold":
        return Jx(e);
      case "ordinal":
        return Ux(e);
      case "point":
        return $x(e);
      case "band":
        return Ax(e);
    }
  return cp(e);
}
function n_(e) {
  if ((typeof e == "function" || typeof e == "object" && !!e) && "valueOf" in e) {
    var t = e.valueOf();
    if (typeof t == "number")
      return t;
  }
  return e;
}
var r_ = /* @__PURE__ */ new Set(["linear", "pow", "quantize", "sqrt", "symlog"]);
function fp(e) {
  return r_.has(e.type);
}
var i_ = /* @__PURE__ */ gn.createContext({});
const jr = i_;
function Fl(e) {
  var t, n = e;
  return n && "bandwidth" in n && (t = n == null ? void 0 : n.bandwidth()) != null ? t : 0;
}
function tn(e) {
  return e != null && typeof e == "number" && !Number.isNaN(e) && Number.isFinite(e);
}
let Vc = Jo();
const at = (e) => Zo(e, Vc);
let qc = Jo();
at.write = (e) => Zo(e, qc);
let Iu = Jo();
at.onStart = (e) => Zo(e, Iu);
let Yc = Jo();
at.onFrame = (e) => Zo(e, Yc);
let Xc = Jo();
at.onFinish = (e) => Zo(e, Xc);
let Mi = [];
at.setTimeout = (e, t) => {
  let n = at.now() + t, r = () => {
    let o = Mi.findIndex((a) => a.cancel == r);
    ~o && Mi.splice(o, 1), $r -= ~o ? 1 : 0;
  }, i = {
    time: n,
    handler: e,
    cancel: r
  };
  return Mi.splice(Am(n), 0, i), $r += 1, km(), i;
};
let Am = (e) => ~(~Mi.findIndex((t) => t.time > e) || ~Mi.length);
at.cancel = (e) => {
  Iu.delete(e), Yc.delete(e), Xc.delete(e), Vc.delete(e), qc.delete(e);
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
    Iu.delete(n), t = null;
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
  at.frameLoop !== "demand" ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : Fm();
};
let kr = -1, $r = 0, Il = !1;
function Zo(e, t) {
  Il ? (t.delete(e), e(0)) : (t.add(e), km());
}
function km() {
  kr < 0 && (kr = 0, at.frameLoop !== "demand" && Kc($m));
}
function o_() {
  kr = -1;
}
function $m() {
  ~kr && (Kc($m), at.batchedUpdates(Fm));
}
function Fm() {
  let e = kr;
  kr = at.now();
  let t = Am(kr);
  if (t && (Im(Mi.splice(0, t), (n) => n.handler()), $r -= t), !$r) {
    o_();
    return;
  }
  Iu.flush(), Vc.flush(e ? Math.min(64, kr - e) : 16.667), Yc.flush(), qc.flush(), Xc.flush();
}
function Jo() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      $r += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return $r -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), $r -= t.size, Im(t, (r) => r(n) && e.add(r)), $r += e.size, t = e);
    }
  };
}
function Im(e, t) {
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
const a_ = (e, t, n) => Object.defineProperty(e, t, {
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
function lr(e, t) {
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
const wt = (e, t) => e.forEach(t);
function nr(e, t, n) {
  if (de.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
const mn = (e) => de.und(e) ? [] : de.arr(e) ? e : [e];
function To(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), wt(n, t);
  }
}
const So = (e, ...t) => To(e, (n) => n(...t)), Qc = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
let Zc, Bm, Ir = null, Dm = !1, Jc = Bl;
const u_ = (e) => {
  e.to && (Bm = e.to), e.now && (at.now = e.now), e.colors !== void 0 && (Ir = e.colors), e.skipAnimation != null && (Dm = e.skipAnimation), e.createStringInterpolator && (Zc = e.createStringInterpolator), e.requestAnimationFrame && at.use(e.requestAnimationFrame), e.batchedUpdates && (at.batchedUpdates = e.batchedUpdates), e.willAdvance && (Jc = e.willAdvance), e.frameLoop && (at.frameLoop = e.frameLoop);
};
var rr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return Zc;
  },
  get to() {
    return Bm;
  },
  get colors() {
    return Ir;
  },
  get skipAnimation() {
    return Dm;
  },
  get willAdvance() {
    return Jc;
  },
  assign: u_
});
const Eo = /* @__PURE__ */ new Set();
let Tn = [], Xs = [], au = 0;
const Bu = {
  get idle() {
    return !Eo.size && !Tn.length;
  },
  start(e) {
    au > e.priority ? (Eo.add(e), at.onStart(s_)) : (zm(e), at(Dl));
  },
  advance: Dl,
  sort(e) {
    if (au)
      at.onFrame(() => Bu.sort(e));
    else {
      const t = Tn.indexOf(e);
      ~t && (Tn.splice(t, 1), Lm(e));
    }
  },
  clear() {
    Tn = [], Eo.clear();
  }
};
function s_() {
  Eo.forEach(zm), Eo.clear(), at(Dl);
}
function zm(e) {
  Tn.includes(e) || Lm(e);
}
function Lm(e) {
  Tn.splice(l_(Tn, (t) => t.priority > e.priority), 0, e);
}
function Dl(e) {
  const t = Xs;
  for (let n = 0; n < Tn.length; n++) {
    const r = Tn[n];
    au = r.priority, r.idle || (Jc(r), r.advance(e), r.idle || t.push(r));
  }
  return au = 0, Xs = Tn, Xs.length = 0, Tn = t, Tn.length > 0;
}
function l_(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
const c_ = {
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
}, Dn = "[-+]?\\d*\\.?\\d+", uu = Dn + "%";
function Du(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const f_ = new RegExp("rgb" + Du(Dn, Dn, Dn)), d_ = new RegExp("rgba" + Du(Dn, Dn, Dn, Dn)), p_ = new RegExp("hsl" + Du(Dn, uu, uu)), h_ = new RegExp("hsla" + Du(Dn, uu, uu, Dn)), v_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, m_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, g_ = /^#([0-9a-fA-F]{6})$/, y_ = /^#([0-9a-fA-F]{8})$/;
function b_(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = g_.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Ir && Ir[e] !== void 0 ? Ir[e] : (t = f_.exec(e)) ? (yi(t[1]) << 24 | yi(t[2]) << 16 | yi(t[3]) << 8 | 255) >>> 0 : (t = d_.exec(e)) ? (yi(t[1]) << 24 | yi(t[2]) << 16 | yi(t[3]) << 8 | hp(t[4])) >>> 0 : (t = v_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = y_.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = m_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = p_.exec(e)) ? (dp(pp(t[1]), Ia(t[2]), Ia(t[3])) | 255) >>> 0 : (t = h_.exec(e)) ? (dp(pp(t[1]), Ia(t[2]), Ia(t[3])) | hp(t[4])) >>> 0 : null;
}
function Ks(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function dp(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = Ks(i, r, e + 1 / 3), a = Ks(i, r, e), u = Ks(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(a * 255) << 16 | Math.round(u * 255) << 8;
}
function yi(e) {
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
  let t = b_(e);
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
    const h = x_(c, o);
    return w_(c, o[h], o[h + 1], i[h], i[h + 1], f, a, u, r.map);
  };
};
function w_(e, t, n, r, i, o, a, u, f) {
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
function x_(e, t) {
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
const Bi = Symbol.for("FluidValue.get"), si = Symbol.for("FluidValue.observers"), Nn = (e) => Boolean(e && e[Bi]), fn = (e) => e && e[Bi] ? e[Bi]() : e, mp = (e) => e[si] || null;
function __(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function Lo(e, t) {
  let n = e[si];
  n && n.forEach((r) => {
    __(r, t);
  });
}
class Gm {
  constructor(t) {
    if (this[Bi] = void 0, this[si] = void 0, !t && !(t = this.get))
      throw Error("Unknown getter");
    S_(this, t);
  }
}
const S_ = (e, t) => jm(e, Bi, t);
function Wi(e, t) {
  if (e[Bi]) {
    let n = e[si];
    n || jm(e, si, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function Go(e, t) {
  let n = e[si];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[si] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
const jm = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), Va = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, R_ = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, gp = new RegExp(`(${Va.source})(%|[a-z]+)`, "i"), C_ = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, zu = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, Hm = (e) => {
  const [t, n] = P_(e);
  if (!t || Qc())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && zu.test(n))
      return Hm(n);
    if (n)
      return n;
  }
  return e;
}, P_ = (e) => {
  const t = zu.exec(e);
  if (!t)
    return [,];
  const [, n, r] = t;
  return [n, r];
};
let Qs;
const N_ = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, Wm = (e) => {
  Qs || (Qs = Ir ? new RegExp(`(${Object.keys(Ir).join("|")})(?!\\w)`, "g") : /^\b$/);
  const t = e.output.map((o) => fn(o).replace(zu, Hm).replace(R_, vp).replace(Qs, vp)), n = t.map((o) => o.match(Va).map(Number)), i = n[0].map((o, a) => n.map((u) => {
    if (!(a in u))
      throw Error('The arity of each "output" value must be equal');
    return u[a];
  })).map((o) => zo(zl({}, e, {
    output: o
  })));
  return (o) => {
    var a;
    const u = !gp.test(t[0]) && ((a = t.find((c) => gp.test(c))) == null ? void 0 : a.replace(Va, ""));
    let f = 0;
    return t[0].replace(Va, () => `${i[f++](o)}${u || ""}`).replace(C_, N_);
  };
}, ef = "react-spring: ", Um = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${ef}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, T_ = Um(console.warn);
function E_() {
  T_(`${ef}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const M_ = Um(console.warn);
function O_() {
  M_(`${ef}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function Lu(e) {
  return de.str(e) && (e[0] == "#" || /\d/.test(e) || !Qc() && zu.test(e) || e in (Ir || {}));
}
const tf = Qc() ? an : $g, A_ = () => {
  const e = nn(!1);
  return tf(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Vm() {
  const e = vr()[1], t = A_();
  return () => {
    t.current && e(Math.random());
  };
}
function k_(e, t) {
  const [n] = vr(() => ({
    inputs: t,
    result: e()
  })), r = nn(), i = r.current;
  let o = i;
  return o ? Boolean(t && o.inputs && $_(t, o.inputs)) || (o = {
    inputs: t,
    result: e()
  }) : o = n, an(() => {
    r.current = o, i == n && (n.inputs = n.result = void 0);
  }, [o]), o.result;
}
function $_(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
const qm = (e) => an(e, F_), F_ = [];
function yp(e) {
  const t = nn();
  return an(() => {
    t.current = e;
  }), t.current;
}
var I_ = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@react-spring/animated/dist/react-spring-animated.esm.js";
const jo = Symbol.for("Animated:node"), B_ = (e) => !!e && e[jo] === e, Qn = (e) => e && e[jo], nf = (e, t) => a_(e, jo, t), Gu = (e) => e && e[jo] && e[jo].getPayload();
class Ym {
  constructor() {
    this.payload = void 0, nf(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}
class Ui extends Ym {
  constructor(t) {
    super(), this.done = !0, this.elapsedTime = void 0, this.lastPosition = void 0, this.lastVelocity = void 0, this.v0 = void 0, this.durationProgress = 0, this._value = t, de.num(this._value) && (this.lastPosition = this._value);
  }
  static create(t) {
    return new Ui(t);
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
class Di extends Ui {
  constructor(t) {
    super(0), this._string = null, this._toString = void 0, this._toString = zo({
      output: [t, t]
    });
  }
  static create(t) {
    return new Di(t);
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
const su = {
  dependencies: null
};
class ju extends Ym {
  constructor(t) {
    super(), this.source = t, this.setValue(t);
  }
  getValue(t) {
    const n = {};
    return nr(this.source, (r, i) => {
      B_(r) ? n[i] = r.getValue(t) : Nn(r) ? n[i] = fn(r) : t || (n[i] = r);
    }), n;
  }
  setValue(t) {
    this.source = t, this.payload = this._makePayload(t);
  }
  reset() {
    this.payload && wt(this.payload, (t) => t.reset());
  }
  _makePayload(t) {
    if (t) {
      const n = /* @__PURE__ */ new Set();
      return nr(t, this._addToPayload, n), Array.from(n);
    }
  }
  _addToPayload(t) {
    su.dependencies && Nn(t) && su.dependencies.add(t);
    const n = Gu(t);
    n && wt(n, (r) => this.add(r));
  }
}
class rf extends ju {
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
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(D_)), !0);
  }
}
function D_(e) {
  return (Lu(e) ? Di : Ui).create(e);
}
function Ll(e) {
  const t = Qn(e);
  return t ? t.constructor : de.arr(e) ? rf : Lu(e) ? Di : Ui;
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
  return Fg((r, i) => {
    const o = nn(null), a = n && xt((_) => {
      o.current = G_(i, _);
    }, [i]), [u, f] = L_(r, t), c = Vm(), h = () => {
      const _ = o.current;
      if (n && !_)
        return;
      (_ ? t.applyAnimatedValues(_, u.getValue(!0)) : !1) === !1 && c();
    }, p = new z_(h, f), w = nn();
    tf(() => (w.current = p, wt(f, (_) => Wi(_, p)), () => {
      w.current && (wt(w.current.deps, (_) => Go(_, w.current)), at.cancel(w.current.update));
    })), an(h, []), qm(() => () => {
      const _ = w.current;
      wt(_.deps, (N) => Go(N, _));
    });
    const P = t.getComponentProps(u.getValue());
    return /* @__PURE__ */ B(e, {
      ...P,
      ref: a
    }, void 0, !1, {
      fileName: I_,
      lineNumber: 291,
      columnNumber: 12
    }, globalThis);
  });
};
class z_ {
  constructor(t, n) {
    this.update = t, this.deps = n;
  }
  eventObserved(t) {
    t.type == "change" && at.write(this.update);
  }
}
function L_(e, t) {
  const n = /* @__PURE__ */ new Set();
  return su.dependencies = n, e.style && (e = Gl({}, e, {
    style: t.createAnimatedStyle(e.style)
  })), e = new ju(e), su.dependencies = null, [e, n];
}
function G_(e, t) {
  return e && (de.fun(e) ? e(t) : e.current = t), t;
}
const wp = Symbol.for("AnimatedComponent"), j_ = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new ju(i),
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
  return nr(e, (a, u) => {
    de.arr(e) && (u = xp(a)), o[u] = o(a);
  }), {
    animated: o
  };
}, xp = (e) => de.str(e) ? e : e && de.str(e.displayName) ? e.displayName : de.fun(e) && e.name || null;
var H_ = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@react-spring/core/dist/react-spring-core.esm.js";
function Vt() {
  return Vt = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Vt.apply(this, arguments);
}
function Zr(e, ...t) {
  return de.fun(e) ? e(...t) : e;
}
const Mo = (e, t) => e === !0 || !!(t && e && (de.fun(e) ? e(t) : mn(e).includes(t))), Xm = (e, t) => de.obj(e) ? t && e[t] : e, Km = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, W_ = (e) => e, of = (e, t = W_) => {
  let n = U_;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    de.und(o) || (r[i] = o);
  }
  return r;
}, U_ = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"], V_ = {
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
function q_(e) {
  const t = {};
  let n = 0;
  if (nr(e, (r, i) => {
    V_[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function Qm(e) {
  const t = q_(e);
  if (t) {
    const n = {
      to: t
    };
    return nr(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return Vt({}, e);
}
function Ho(e) {
  return e = fn(e), de.arr(e) ? e.map(Ho) : Lu(e) ? rr.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function Y_(e) {
  for (const t in e)
    return !0;
  return !1;
}
function jl(e) {
  return de.fun(e) || de.arr(e) && de.obj(e[0]);
}
function X_(e, t) {
  var n;
  (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
}
function K_(e, t) {
  if (t && e.ref !== t) {
    var n;
    (n = e.ref) == null || n.delete(e), t.add(e), e.ref = t;
  }
}
const Q_ = {
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
}, lu = 1.70158, Ba = lu * 1.525, _p = lu + 1, Sp = 2 * Math.PI / 3, Rp = 2 * Math.PI / 4.5, Da = (e) => e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375, Z_ = {
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
  easeInBack: (e) => _p * e * e * e - lu * e * e,
  easeOutBack: (e) => 1 + _p * Math.pow(e - 1, 3) + lu * Math.pow(e - 1, 2),
  easeInOutBack: (e) => e < 0.5 ? Math.pow(2 * e, 2) * ((Ba + 1) * 2 * e - Ba) / 2 : (Math.pow(2 * e - 2, 2) * ((Ba + 1) * (e * 2 - 2) + Ba) + 2) / 2,
  easeInElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((e * 10 - 10.75) * Sp),
  easeOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((e * 10 - 0.75) * Sp) + 1,
  easeInOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * Rp)) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * Rp) / 2 + 1,
  easeInBounce: (e) => 1 - Da(1 - e),
  easeOutBounce: Da,
  easeInOutBounce: (e) => e < 0.5 ? (1 - Da(1 - 2 * e)) / 2 : (1 + Da(2 * e - 1)) / 2
}, Hl = Vt({}, Q_.default, {
  mass: 1,
  damping: 1,
  easing: Z_.linear,
  clamp: !1
});
class J_ {
  constructor() {
    this.tension = void 0, this.friction = void 0, this.frequency = void 0, this.damping = void 0, this.mass = void 0, this.velocity = 0, this.restVelocity = void 0, this.precision = void 0, this.progress = void 0, this.duration = void 0, this.easing = void 0, this.clamp = void 0, this.bounce = void 0, this.decay = void 0, this.round = void 0, Object.assign(this, Hl);
  }
}
function eS(e, t, n) {
  n && (n = Vt({}, n), Cp(n, t), t = Vt({}, n, t)), Cp(e, t), Object.assign(e, t);
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
class tS {
  constructor() {
    this.changed = !1, this.values = Pp, this.toValues = null, this.fromValues = Pp, this.to = void 0, this.from = void 0, this.config = new J_(), this.immediate = !1;
  }
}
function Zm(e, {
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
      let N = r == null ? void 0 : r.pause;
      N !== !0 && (N = i.paused || Mo(N, t)), c = Zr(n.delay || 0, t), N ? (i.resumeQueue.add(P), o.pause()) : (o.resume(), P());
    }
    function w() {
      i.resumeQueue.add(P), i.timeouts.delete(h), h.cancel(), c = h.time - at.now();
    }
    function P() {
      c > 0 && !rr.skipAnimation ? (i.delayed = !0, h = at.setTimeout(_, c), i.pauseQueue.add(w), i.timeouts.add(h)) : _();
    }
    function _() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(w), i.timeouts.delete(h), e <= (i.cancelId || 0) && (p = !0);
      try {
        o.start(Vt({}, n, {
          callId: e,
          cancel: p
        }), a);
      } catch (N) {
        u(N);
      }
    }
  });
}
const af = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? Oi(e.get()) : t.every((n) => n.noop) ? Jm(e.get()) : In(e.get(), t.every((n) => n.finished)), Jm = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), In = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), Oi = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function eg(e, t, n, r) {
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
      const k = i <= (n.cancelId || 0) && Oi(r) || i !== n.asyncId && In(r, !1);
      if (k)
        throw I.result = k, p(I), I;
    }, _ = (I, k) => {
      const F = new Np(), T = new Tp();
      return (async () => {
        if (rr.skipAnimation)
          throw Wo(n), T.result = In(r, !1), p(T), T;
        P(F);
        const G = de.obj(I) ? Vt({}, I) : Vt({}, k, {
          to: I
        });
        G.parentId = i, nr(c, (z, te) => {
          de.und(G[te]) && (G[te] = z);
        });
        const M = await r.start(G);
        return P(F), n.paused && await new Promise((z) => {
          n.resumeQueue.add(z);
        }), M;
      })();
    };
    let N;
    if (rr.skipAnimation)
      return Wo(n), In(r, !1);
    try {
      let I;
      de.arr(e) ? I = (async (k) => {
        for (const F of k)
          await _(F);
      })(e) : I = Promise.resolve(e(_, r.stop.bind(r))), await Promise.all([I.then(h), w]), N = In(r.get(), !0, !1);
    } catch (I) {
      if (I instanceof Np)
        N = I.result;
      else if (I instanceof Tp)
        N = I.result;
      else
        throw I;
    } finally {
      i == n.asyncId && (n.asyncId = o, n.asyncTo = o ? u : void 0, n.promise = o ? f : void 0);
    }
    return de.fun(a) && at.batchedUpdates(() => {
      a(N, r, r.item);
    }), N;
  })();
}
function Wo(e, t) {
  To(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
class Np extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."), this.result = void 0;
  }
}
class Tp extends Error {
  constructor() {
    super("SkipAnimationSignal"), this.result = void 0;
  }
}
const Wl = (e) => e instanceof uf;
let nS = 1;
class uf extends Gm {
  constructor(...t) {
    super(...t), this.id = nS++, this.key = void 0, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(t) {
    this._priority != t && (this._priority = t, this._onPriorityChange(t));
  }
  get() {
    const t = Qn(this);
    return t && t.getValue();
  }
  to(...t) {
    return rr.to(this, t);
  }
  interpolate(...t) {
    return E_(), rr.to(this, t);
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
    this.idle || Bu.sort(this), Lo(this, {
      type: "priority",
      parent: this,
      priority: t
    });
  }
}
const li = Symbol.for("SpringPhase"), tg = 1, Ul = 2, Vl = 4, Zs = (e) => (e[li] & tg) > 0, Pr = (e) => (e[li] & Ul) > 0, po = (e) => (e[li] & Vl) > 0, Ep = (e, t) => t ? e[li] |= Ul | tg : e[li] &= ~Ul, Mp = (e, t) => t ? e[li] |= Vl : e[li] &= ~Vl;
class rS extends uf {
  constructor(t, n) {
    if (super(), this.key = void 0, this.animation = new tS(), this.queue = void 0, this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !de.und(t) || !de.und(n)) {
      const r = de.obj(t) ? Vt({}, t) : Vt({}, n, {
        from: t
      });
      de.und(r.default) && (r.default = !0), this.start(r);
    }
  }
  get idle() {
    return !(Pr(this) || this._state.asyncTo) || po(this);
  }
  get goal() {
    return fn(this.animation.to);
  }
  get velocity() {
    const t = Qn(this);
    return t instanceof Ui ? t.lastVelocity || 0 : t.getPayload().map((n) => n.lastVelocity || 0);
  }
  get hasAnimated() {
    return Zs(this);
  }
  get isAnimating() {
    return Pr(this);
  }
  get isPaused() {
    return po(this);
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
    const u = Gu(i.to);
    !u && Nn(i.to) && (a = mn(fn(i.to))), i.values.forEach((h, p) => {
      if (h.done)
        return;
      const w = h.constructor == Di ? 1 : u ? u[p].lastPosition : a[p];
      let P = i.immediate, _ = w;
      if (!P) {
        if (_ = h.lastPosition, o.tension <= 0) {
          h.done = !0;
          return;
        }
        let N = h.elapsedTime += t;
        const I = i.fromValues[p], k = h.v0 != null ? h.v0 : h.v0 = de.arr(o.velocity) ? o.velocity[p] : o.velocity;
        let F;
        if (de.und(o.duration))
          if (o.decay) {
            const T = o.decay === !0 ? 0.998 : o.decay, G = Math.exp(-(1 - T) * N);
            _ = I + k / (1 - T) * (1 - G), P = Math.abs(h.lastPosition - _) < 0.1, F = k * G;
          } else {
            F = h.lastVelocity == null ? k : h.lastVelocity;
            const T = o.precision || (I == w ? 5e-3 : Math.min(1, Math.abs(w - I) * 1e-3)), G = o.restVelocity || T / 10, M = o.clamp ? 0 : o.bounce, z = !de.und(M), te = I == w ? h.v0 > 0 : I < w;
            let Q, fe = !1;
            const me = 1, re = Math.ceil(t / me);
            for (let ee = 0; ee < re && (Q = Math.abs(F) > G, !(!Q && (P = Math.abs(w - _) <= T, P))); ++ee) {
              z && (fe = _ == w || _ > w == te, fe && (F = -F * M, _ = w));
              const be = -o.tension * 1e-6 * (_ - w), Oe = -o.friction * 1e-3 * F, ut = (be + Oe) / o.mass;
              F = F + ut * me, _ = _ + F * me;
            }
          }
        else {
          let T = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, h.durationProgress > 0 && (h.elapsedTime = o.duration * h.durationProgress, N = h.elapsedTime += t)), T = (o.progress || 0) + N / this._memoizedDuration, T = T > 1 ? 1 : T < 0 ? 0 : T, h.durationProgress = T), _ = I + o.easing(T) * (w - I), F = (_ - h.lastPosition) / t, P = T == 1;
        }
        h.lastVelocity = F, Number.isNaN(_) && (console.warn("Got NaN while animating:", this), P = !0);
      }
      u && !u[p].done && (P = !1), P ? h.done = !0 : n = !1, h.setValue(_, o.round) && (r = !0);
    });
    const f = Qn(this), c = f.getValue();
    if (n) {
      const h = fn(i.to);
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
    if (Pr(this)) {
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
    return de.und(t) ? (r = this.queue || [], this.queue = []) : r = [de.obj(t) ? t : Vt({}, n, {
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
    return Zs(this) || (t.reverse && ([r, i] = [i, r]), i = fn(i), de.und(i) ? Qn(this) || this._set(r) : this._set(i)), o;
  }
  _update(t, n) {
    let r = Vt({}, t);
    const {
      key: i,
      defaultProps: o
    } = this;
    r.default && Object.assign(o, of(r, (f, c) => /^on/.test(c) ? Xm(f, i) : f)), Ap(this, r, "onProps"), vo(this, "onProps", r, this);
    const a = this._prepareNode(r);
    if (Object.isFrozen(this))
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    const u = this._state;
    return Zm(++this._lastCallId, {
      key: i,
      props: r,
      defaultProps: o,
      state: u,
      actions: {
        pause: () => {
          po(this) || (Mp(this, !0), So(u.pauseQueue), vo(this, "onPause", In(this, ho(this, this.animation.to)), this));
        },
        resume: () => {
          po(this) && (Mp(this, !1), Pr(this) && this._resume(), So(u.resumeQueue), vo(this, "onResume", In(this, ho(this, this.animation.to)), this));
        },
        start: this._merge.bind(this, a)
      }
    }).then((f) => {
      if (r.loop && f.finished && !(n && f.noop)) {
        const c = ng(r);
        if (c)
          return this._update(c, !0);
      }
      return f;
    });
  }
  _merge(t, n, r) {
    if (n.cancel)
      return this.stop(!0), r(Oi(this));
    const i = !de.und(t.to), o = !de.und(t.from);
    if (i || o)
      if (n.callId > this._lastToId)
        this._lastToId = n.callId;
      else
        return r(Oi(this));
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
    const P = !lr(w, h);
    P && (f.from = w), w = fn(w);
    const _ = !lr(p, c);
    _ && this._focus(p);
    const N = jl(n.to), {
      config: I
    } = f, {
      decay: k,
      velocity: F
    } = I;
    (i || o) && (I.velocity = 0), n.config && !N && eS(I, Zr(n.config, a), n.config !== u.config ? Zr(u.config, a) : void 0);
    let T = Qn(this);
    if (!T || de.und(p))
      return r(In(this, !0));
    const G = de.und(n.reset) ? o && !n.default : !de.und(w) && Mo(n.reset, a), M = G ? w : this.get(), z = Ho(p), te = de.num(z) || de.arr(z) || Lu(z), Q = !N && (!te || Mo(u.immediate || n.immediate, a));
    if (_) {
      const ee = Ll(p);
      if (ee !== T.constructor)
        if (Q)
          T = this._set(z);
        else
          throw Error(`Cannot animate between ${T.constructor.name} and ${ee.name}, as the "to" prop suggests`);
    }
    const fe = T.constructor;
    let me = Nn(p), re = !1;
    if (!me) {
      const ee = G || !Zs(this) && P;
      (_ || ee) && (re = lr(Ho(M), z), me = !re), (!lr(f.immediate, Q) && !Q || !lr(I.decay, k) || !lr(I.velocity, F)) && (me = !0);
    }
    if (re && Pr(this) && (f.changed && !G ? me = !0 : me || this._stop(c)), !N && ((me || Nn(c)) && (f.values = T.getPayload(), f.toValues = Nn(p) ? null : fe == Di ? [1] : mn(z)), f.immediate != Q && (f.immediate = Q, !Q && !G && this._set(c)), me)) {
      const {
        onRest: ee
      } = f;
      wt(oS, (Oe) => Ap(this, n, Oe));
      const be = In(this, ho(this, c));
      So(this._pendingCalls, be), this._pendingCalls.add(r), f.changed && at.batchedUpdates(() => {
        f.changed = !G, ee == null || ee(be, this), G ? Zr(u.onRest, be) : f.onStart == null || f.onStart(be, this);
      });
    }
    G && this._set(M), N ? r(eg(n.to, n, this._state, this)) : me ? this._start() : Pr(this) && !_ ? this._pendingCalls.add(r) : r(Jm(M));
  }
  _focus(t) {
    const n = this.animation;
    t !== n.to && (mp(this) && this._detach(), n.to = t, mp(this) && this._attach());
  }
  _attach() {
    let t = 0;
    const {
      to: n
    } = this.animation;
    Nn(n) && (Wi(n, this), Wl(n) && (t = n.priority + 1)), this.priority = t;
  }
  _detach() {
    const {
      to: t
    } = this.animation;
    Nn(t) && Go(t, this);
  }
  _set(t, n = !0) {
    const r = fn(t);
    if (!de.und(r)) {
      const i = Qn(this);
      if (!i || !lr(r, i.getValue())) {
        const o = Ll(r);
        !i || i.constructor != o ? nf(this, o.create(r)) : i.setValue(r), i && at.batchedUpdates(() => {
          this._onChange(r, n);
        });
      }
    }
    return Qn(this);
  }
  _onStart() {
    const t = this.animation;
    t.changed || (t.changed = !0, vo(this, "onStart", In(this, ho(this, t.to)), this));
  }
  _onChange(t, n) {
    n || (this._onStart(), Zr(this.animation.onChange, t, this)), Zr(this.defaultProps.onChange, t, this), super._onChange(t, n);
  }
  _start() {
    const t = this.animation;
    Qn(this).reset(fn(t.to)), t.immediate || (t.fromValues = t.values.map((n) => n.lastPosition)), Pr(this) || (Ep(this, !0), po(this) || this._resume());
  }
  _resume() {
    rr.skipAnimation ? this.finish() : Bu.start(this);
  }
  _stop(t, n) {
    if (Pr(this)) {
      Ep(this, !1);
      const r = this.animation;
      wt(r.values, (o) => {
        o.done = !0;
      }), r.toValues && (r.onChange = r.onPause = r.onResume = void 0), Lo(this, {
        type: "idle",
        parent: this
      });
      const i = n ? Oi(this.get()) : In(this.get(), ho(this, t != null ? t : r.to));
      So(this._pendingCalls, i), r.changed && (r.changed = !1, vo(this, "onRest", i, this));
    }
  }
}
function ho(e, t) {
  const n = Ho(t), r = Ho(e.get());
  return lr(r, n);
}
function ng(e, t = e.loop, n = e.to) {
  let r = Zr(t);
  if (r) {
    const i = r !== !0 && Qm(r), o = (i || e).reverse, a = !i || i.reset;
    return Uo(Vt({}, e, {
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
  } = e = Qm(e), r = /* @__PURE__ */ new Set();
  return de.obj(t) && Op(t, r), de.obj(n) && Op(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function iS(e) {
  const t = Uo(e);
  return de.und(t.default) && (t.default = of(t)), t;
}
function Op(e, t) {
  nr(e, (n, r) => n != null && t.add(r));
}
const oS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function Ap(e, t, n) {
  e.animation[n] = t[n] !== Km(t, n) ? Xm(t[n], e.key) : void 0;
}
function vo(e, t, ...n) {
  var r, i, o, a;
  (r = (i = e.animation)[t]) == null || r.call(i, ...n), (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
}
const aS = ["onStart", "onChange", "onRest"];
let uS = 1;
class sS {
  constructor(t, n) {
    this.id = uS++, this.springs = {}, this.queue = [], this.ref = void 0, this._flush = void 0, this._initialProps = void 0, this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._item = void 0, this._state = {
      paused: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    }, this._onFrame = this._onFrame.bind(this), n && (this._flush = n), t && this.start(Vt({
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
    return t ? n = mn(t).map(Uo) : this.queue = [], this._flush ? this._flush(this, n) : (ug(this, n), ql(this, n));
  }
  stop(t, n) {
    if (t !== !!t && (n = t), n) {
      const r = this.springs;
      wt(mn(n), (i) => r[i].stop(!!t));
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
      wt(mn(t), (r) => n[r].pause());
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
      wt(mn(t), (r) => n[r].resume());
    }
    return this;
  }
  each(t) {
    nr(this.springs, t);
  }
  _onFrame() {
    const {
      onStart: t,
      onChange: n,
      onRest: r
    } = this._events, i = this._active.size > 0, o = this._changed.size > 0;
    (i && !this._started || o && !this._started) && (this._started = !0, To(t, ([f, c]) => {
      c.value = this.get(), f(c, this, this._item);
    }));
    const a = !i && this._started, u = o || a && r.size ? this.get() : null;
    o && n.size && To(n, ([f, c]) => {
      c.value = u, f(c, this, this._item);
    }), a && (this._started = !1, To(r, ([f, c]) => {
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
  return Promise.all(t.map((n) => rg(e, n))).then((n) => af(e, n));
}
async function rg(e, t, n) {
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
  h ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : wt(aS, (N) => {
    const I = t[N];
    if (de.fun(I)) {
      const k = e._events[N];
      t[N] = ({
        finished: F,
        cancelled: T
      }) => {
        const G = k.get(I);
        G ? (F || (G.finished = !1), T && (G.cancelled = !0)) : k.set(I, {
          value: null,
          finished: F || !1,
          cancelled: T || !1
        });
      }, c && (c[N] = t[N]);
    }
  });
  const p = e._state;
  t.pause === !p.paused ? (p.paused = t.pause, So(t.pause ? p.pauseQueue : p.resumeQueue)) : p.paused && (t.pause = !0);
  const w = (r || Object.keys(e.springs)).map((N) => e.springs[N].start(t)), P = t.cancel === !0 || Km(t, "cancel") === !0;
  (h || P && p.asyncId) && w.push(Zm(++e._lastAsyncId, {
    props: t,
    state: p,
    actions: {
      pause: Bl,
      resume: Bl,
      start(N, I) {
        P ? (Wo(p, e._lastAsyncId), I(Oi(e))) : (N.onRest = u, I(eg(h, N, p, e)));
      }
    }
  })), p.paused && await new Promise((N) => {
    p.resumeQueue.add(N);
  });
  const _ = af(e, await Promise.all(w));
  if (a && _.finished && !(n && _.noop)) {
    const N = ng(t, a, i);
    if (N)
      return ug(e, [N]), rg(e, N, !0);
  }
  return f && at.batchedUpdates(() => f(_, e, e.item)), _;
}
function kp(e, t) {
  const n = Vt({}, e.springs);
  return t && wt(mn(t), (r) => {
    de.und(r.keys) && (r = Uo(r)), de.obj(r.to) || (r = Vt({}, r, {
      to: void 0
    })), ag(n, r, (i) => og(i));
  }), ig(e, n), n;
}
function ig(e, t) {
  nr(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Wi(n, e));
  });
}
function og(e, t) {
  const n = new rS();
  return n.key = e, t && Wi(n, t), n;
}
function ag(e, t, n) {
  t.keys && wt(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function ug(e, t) {
  wt(t, (n) => {
    ag(e.springs, n, (r) => og(r, e));
  });
}
function lS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const cS = ["children"], Hu = (e) => {
  let {
    children: t
  } = e, n = lS(e, cS);
  const r = un(cu), i = n.pause || !!r.pause, o = n.immediate || !!r.immediate;
  n = k_(() => ({
    pause: i,
    immediate: o
  }), [i, o]);
  const {
    Provider: a
  } = cu;
  return /* @__PURE__ */ B(a, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: H_,
    lineNumber: 1849,
    columnNumber: 10
  }, globalThis);
}, cu = fS(Hu, {});
Hu.Provider = cu.Provider;
Hu.Consumer = cu.Consumer;
function fS(e, t) {
  return Object.assign(e, Bn.createContext(t)), e.Provider._context = e, e.Consumer._context = e, e;
}
const dS = () => {
  const e = [], t = function(i) {
    O_();
    const o = [];
    return wt(e, (a, u) => {
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
    return wt(e, (r) => r.pause(...arguments)), this;
  }, t.resume = function() {
    return wt(e, (r) => r.resume(...arguments)), this;
  }, t.set = function(r) {
    wt(e, (i) => i.set(r));
  }, t.start = function(r) {
    const i = [];
    return wt(e, (o, a) => {
      if (de.und(r))
        i.push(o.start());
      else {
        const u = this._getProps(r, o, a);
        u && i.push(o.start(u));
      }
    }), i;
  }, t.stop = function() {
    return wt(e, (r) => r.stop(...arguments)), this;
  }, t.update = function(r) {
    return wt(e, (i, o) => i.update(this._getProps(r, i, o))), this;
  };
  const n = function(i, o, a) {
    return de.fun(i) ? i(a, o) : i;
  };
  return t._getProps = n, t;
};
function pS(e, t, n) {
  const r = de.fun(t) && t;
  r && !n && (n = []);
  const i = Wt(() => r || arguments.length == 3 ? dS() : void 0, []), o = nn(0), a = Vm(), u = Wt(() => ({
    ctrls: [],
    queue: [],
    flush(k, F) {
      const T = kp(k, F);
      return o.current > 0 && !u.queue.length && !Object.keys(T).some((M) => !k.springs[M]) ? ql(k, F) : new Promise((M) => {
        ig(k, T), u.queue.push(() => {
          M(ql(k, F));
        }), a();
      });
    }
  }), []), f = nn([...u.ctrls]), c = [], h = yp(e) || 0;
  Wt(() => {
    wt(f.current.slice(e, h), (k) => {
      X_(k, i), k.stop(!0);
    }), f.current.length = e, p(h, e);
  }, [e]), Wt(() => {
    p(0, Math.min(h, e));
  }, n);
  function p(k, F) {
    for (let T = k; T < F; T++) {
      const G = f.current[T] || (f.current[T] = new sS(null, u.flush)), M = r ? r(T, G) : t[T];
      M && (c[T] = iS(M));
    }
  }
  const w = f.current.map((k, F) => kp(k, c[F])), P = un(Hu), _ = yp(P), N = P !== _ && Y_(P);
  tf(() => {
    o.current++, u.ctrls = f.current;
    const {
      queue: k
    } = u;
    k.length && (u.queue = [], wt(k, (F) => F())), wt(f.current, (F, T) => {
      i == null || i.add(F), N && F.start({
        default: P
      });
      const G = c[T];
      G && (K_(F, G.ref), F.ref ? F.queue.push(G) : F.start(G));
    });
  }), qm(() => () => {
    wt(u.ctrls, (k) => k.stop(!0));
  });
  const I = w.map((k) => Vt({}, k));
  return i ? [I, i] : I;
}
function $p(e, t) {
  const n = de.fun(e), [[r], i] = pS(1, n ? e : [e], n ? t || [] : t);
  return n || arguments.length == 2 ? [r, i] : r;
}
let Fp;
(function(e) {
  e.MOUNT = "mount", e.ENTER = "enter", e.UPDATE = "update", e.LEAVE = "leave";
})(Fp || (Fp = {}));
class hS extends uf {
  constructor(t, n) {
    super(), this.key = void 0, this.idle = !0, this.calc = void 0, this._active = /* @__PURE__ */ new Set(), this.source = t, this.calc = zo(...n);
    const r = this._get(), i = Ll(r);
    nf(this, i.create(r));
  }
  advance(t) {
    const n = this._get(), r = this.get();
    lr(n, r) || (Qn(this).setValue(n), this._onChange(n, this.idle)), !this.idle && Ip(this._active) && Js(this);
  }
  _get() {
    const t = de.arr(this.source) ? this.source.map(fn) : mn(fn(this.source));
    return this.calc(...t);
  }
  _start() {
    this.idle && !Ip(this._active) && (this.idle = !1, wt(Gu(this), (t) => {
      t.done = !1;
    }), rr.skipAnimation ? (at.batchedUpdates(() => this.advance()), Js(this)) : Bu.start(this));
  }
  _attach() {
    let t = 1;
    wt(mn(this.source), (n) => {
      Nn(n) && Wi(n, this), Wl(n) && (n.idle || this._active.add(n), t = Math.max(t, n.priority + 1));
    }), this.priority = t, this._start();
  }
  _detach() {
    wt(mn(this.source), (t) => {
      Nn(t) && Go(t, this);
    }), this._active.clear(), Js(this);
  }
  eventObserved(t) {
    t.type == "change" ? t.idle ? this.advance() : (this._active.add(t.parent), this._start()) : t.type == "idle" ? this._active.delete(t.parent) : t.type == "priority" && (this.priority = mn(this.source).reduce((n, r) => Math.max(n, (Wl(r) ? r.priority : 0) + 1), 0));
  }
}
function vS(e) {
  return e.idle !== !1;
}
function Ip(e) {
  return !e.size || Array.from(e).every(vS);
}
function Js(e) {
  e.idle || (e.idle = !0, wt(Gu(e), (t) => {
    t.done = !0;
  }), Lo(e, {
    type: "idle",
    parent: e
  }));
}
rr.assign({
  createStringInterpolator: Wm,
  to: (e, t) => new hS(e, t)
});
function sf(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const mS = ["style", "children", "scrollTop", "scrollLeft"], sg = /^--/;
function gS(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !sg.test(e) && !(Oo.hasOwnProperty(e) && Oo[e]) ? t + "px" : ("" + t).trim();
}
const Bp = {};
function yS(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", r = t, {
    style: i,
    children: o,
    scrollTop: a,
    scrollLeft: u
  } = r, f = sf(r, mS), c = Object.values(f), h = Object.keys(f).map((p) => n || e.hasAttribute(p) ? p : Bp[p] || (Bp[p] = p.replace(/([A-Z])/g, (w) => "-" + w.toLowerCase())));
  o !== void 0 && (e.textContent = o);
  for (let p in i)
    if (i.hasOwnProperty(p)) {
      const w = gS(p, i[p]);
      sg.test(p) ? e.style.setProperty(p, w) : e.style[p] = w;
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
const bS = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), wS = ["Webkit", "Ms", "Moz", "O"];
Oo = Object.keys(Oo).reduce((e, t) => (wS.forEach((n) => e[bS(n, t)] = e[t]), e), Oo);
const xS = ["x", "y", "z"], _S = /^(matrix|translate|scale|rotate|skew)/, SS = /^(translate)/, RS = /^(rotate|skew)/, el = (e, t) => de.num(e) && e !== 0 ? e + t : e, qa = (e, t) => de.arr(e) ? e.every((n) => qa(n, t)) : de.num(e) ? e === t : parseFloat(e) === t;
class CS extends ju {
  constructor(t) {
    let {
      x: n,
      y: r,
      z: i
    } = t, o = sf(t, xS);
    const a = [], u = [];
    (n || r || i) && (a.push([n || 0, r || 0, i || 0]), u.push((f) => [`translate3d(${f.map((c) => el(c, "px")).join(",")})`, qa(f, 0)])), nr(o, (f, c) => {
      if (c === "transform")
        a.push([f || ""]), u.push((h) => [h, h === ""]);
      else if (_S.test(c)) {
        if (delete o[c], de.und(f))
          return;
        const h = SS.test(c) ? "px" : RS.test(c) ? "deg" : "";
        a.push(mn(f)), u.push(c === "rotate3d" ? ([p, w, P, _]) => [`rotate3d(${p},${w},${P},${el(_, h)})`, qa(_, 0)] : (p) => [`${c}(${p.map((w) => el(w, h)).join(",")})`, qa(p, c.startsWith("scale") ? 1 : 0)]);
      }
    }), a.length && (o.transform = new PS(a, u)), super(o);
  }
}
class PS extends Gm {
  constructor(t, n) {
    super(), this._value = null, this.inputs = t, this.transforms = n;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let t = "", n = !0;
    return wt(this.inputs, (r, i) => {
      const o = fn(r[0]), [a, u] = this.transforms[i](de.arr(o) ? o : r.map(fn));
      t += " " + a, n = n && u;
    }), n ? "none" : t;
  }
  observerAdded(t) {
    t == 1 && wt(this.inputs, (n) => wt(n, (r) => Nn(r) && Wi(r, this)));
  }
  observerRemoved(t) {
    t == 0 && wt(this.inputs, (n) => wt(n, (r) => Nn(r) && Go(r, this)));
  }
  eventObserved(t) {
    t.type == "change" && (this._value = null), Lo(this, t);
  }
}
const NS = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"], TS = ["scrollTop", "scrollLeft"];
rr.assign({
  batchedUpdates: Ig,
  createStringInterpolator: Wm,
  colors: c_
});
const ES = j_(NS, {
  applyAnimatedValues: yS,
  createAnimatedStyle: (e) => new CS(e),
  getComponentProps: (e) => sf(e, TS)
}), MS = ES.animated;
var OS = ["tooltipOpen"];
function AS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function fu() {
  return fu = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, fu.apply(this, arguments);
}
function kS(e) {
  var t = vr(fu({
    tooltipOpen: !1
  }, e)), n = t[0], r = t[1], i = xt(function(a) {
    return r(typeof a == "function" ? function(u) {
      u.tooltipOpen;
      var f = AS(u, OS);
      return fu({}, a(f), {
        tooltipOpen: !0
      });
    } : {
      tooltipOpen: !0,
      tooltipLeft: a.tooltipLeft,
      tooltipTop: a.tooltipTop,
      tooltipData: a.tooltipData
    });
  }, [r]), o = xt(function() {
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
function $S(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function FS(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Yl(e, t);
}
function Yl(e, t) {
  return Yl = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Yl(e, t);
}
function lg(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var cg = /* @__PURE__ */ function(e) {
  FS(t, e);
  function t() {
    for (var r, i = arguments.length, o = new Array(i), a = 0; a < i; a++)
      o[a] = arguments[a];
    return r = e.call.apply(e, [this].concat(o)) || this, lg($S(r), "node", void 0), r;
  }
  var n = t.prototype;
  return n.componentWillUnmount = function() {
    this.node && document.body && (document.body.removeChild(this.node), delete this.node);
  }, n.render = function() {
    return !this.node && typeof document < "u" && (this.node = document.createElement("div"), this.props.zIndex != null && (this.node.style.zIndex = "" + this.props.zIndex), document.body.append(this.node)), this.node ? /* @__PURE__ */ dh.createPortal(this.props.children, this.node) : null;
  }, t;
}(gn.PureComponent);
lg(cg, "propTypes", {
  zIndex: ke.exports.oneOfType([ke.exports.number, ke.exports.string])
});
var IS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/Tooltip.js", BS = ["className", "top", "left", "offsetLeft", "offsetTop", "style", "children", "unstyled", "applyPositionStyle"];
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
function DS(e, t) {
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
  var t = e.className, n = e.top, r = e.left, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.style, c = f === void 0 ? lf : f, h = e.children, p = e.unstyled, w = p === void 0 ? !1 : p, P = e.applyPositionStyle, _ = P === void 0 ? !1 : P, N = DS(e, BS);
  return /* @__PURE__ */ B("div", {
    className: hy("visx-tooltip", t),
    style: Xl({
      top: n == null || u == null ? n : n + u,
      left: r == null || o == null ? r : r + o
    }, _ && {
      position: "absolute"
    }, !w && c),
    ...N,
    children: h
  }, void 0, !1, {
    fileName: IS,
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
var zS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js";
function Dp(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function LS(e, t) {
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
function GS(e) {
  var t, n;
  return n = t = /* @__PURE__ */ function(r) {
    LS(i, r);
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
      this.node = dh.findDOMNode(this), this.setState(function() {
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
      return /* @__PURE__ */ B(e, {
        getRects: this.getRects,
        ...this.state,
        ...this.props
      }, void 0, !1, {
        fileName: zS,
        lineNumber: 67,
        columnNumber: 27
      }, this);
    }, i;
  }(gn.PureComponent), zp(t, "displayName", "withBoundingRects(" + (e.displayName || "") + ")"), n;
}
var jS = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js", HS = ["children", "getRects", "left", "offsetLeft", "offsetTop", "parentRect", "rect", "style", "top", "unstyled"];
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
function WS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function US(e) {
  var t = e.children;
  e.getRects;
  var n = e.left, r = n === void 0 ? 0 : n, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.parentRect, c = e.rect, h = e.style, p = h === void 0 ? lf : h, w = e.top, P = w === void 0 ? 0 : w, _ = e.unstyled, N = _ === void 0 ? !1 : _, I = WS(e, HS), k;
  if (c && f) {
    var F = r, T = P, G = !1, M = !1;
    if (f.width) {
      var z = F + o + c.width - f.width, te = c.width - F - o;
      G = z > 0 && z > te;
    } else {
      var Q = F + o + c.width - window.innerWidth, fe = c.width - F - o;
      G = Q > 0 && Q > fe;
    }
    if (f.height) {
      var me = T + u + c.height - f.height, re = c.height - T - u;
      M = me > 0 && me > re;
    } else
      M = T + u + c.height > window.innerHeight;
    F = G ? F - c.width - o : F + o, T = M ? T - c.height - u : T + u, F = Math.round(F), T = Math.round(T), k = "translate(" + F + "px, " + T + "px)";
  }
  return /* @__PURE__ */ B(cf, {
    style: Ql({
      left: 0,
      top: 0,
      transform: k
    }, !N && p),
    ...I,
    children: t
  }, void 0, !1, {
    fileName: jS,
    lineNumber: 65,
    columnNumber: 23
  }, this);
}
const VS = GS(US);
var Gp = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js", qS = ["detectBounds", "zIndex"], YS = ["left", "top", "detectBounds", "zIndex"];
function jp(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function XS(e) {
  var t = e === void 0 ? {} : e, n = t.detectBounds, r = n === void 0 ? !0 : n, i = t.zIndex, o = jp(t, qS), a = vy(o), u = a[0], f = a[1], c = a[2], h = Wt(function() {
    return function(p) {
      var w = p.left, P = w === void 0 ? 0 : w, _ = p.top, N = _ === void 0 ? 0 : _, I = p.detectBounds, k = p.zIndex, F = jp(p, YS), T = I == null ? r : I, G = k == null ? i : k, M = T ? VS : cf, z = P + (f.left || 0) + window.scrollX, te = N + (f.top || 0) + window.scrollY;
      return /* @__PURE__ */ B(cg, {
        zIndex: G,
        children: /* @__PURE__ */ B(M, {
          left: z,
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
var KS = /* @__PURE__ */ fh(null);
const ea = KS;
var vn = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/Tooltip.js", QS = ["debounce", "detectBounds", "horizontalCrosshairStyle", "glyphStyle", "renderTooltip", "renderGlyph", "resizeObserverPolyfill", "scroll", "showDatumGlyph", "showHorizontalCrosshair", "showSeriesGlyphs", "showVerticalCrosshair", "snapTooltipToDatumX", "snapTooltipToDatumY", "verticalCrosshairStyle", "zIndex"], ZS = ["x", "y"];
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
var tl = {
  position: "absolute",
  pointerEvents: "none",
  fontSize: 0,
  lineHeight: 0
}, JS = {
  position: "absolute",
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none"
};
function fg(e) {
  var t = un(jr) || {}, n = t.theme;
  return /* @__PURE__ */ B("circle", {
    cx: e.x,
    cy: e.y,
    r: e.size,
    fill: e.color,
    stroke: n == null ? void 0 : n.backgroundColor,
    strokeWidth: 1.5,
    paintOrder: "fill",
    ...e.glyphStyle
  }, void 0, !1, {
    fileName: vn,
    lineNumber: 37,
    columnNumber: 23
  }, this);
}
fg.propTypes = {
  isNearestDatum: ke.exports.bool.isRequired
};
function eR(e) {
  return /* @__PURE__ */ B(fg, {
    ...e
  }, void 0, !1, {
    fileName: vn,
    lineNumber: 53,
    columnNumber: 23
  }, this);
}
function dg(e) {
  var t = un(ea);
  return t != null && t.tooltipOpen ? /* @__PURE__ */ B(pg, {
    ...e
  }, void 0, !1, {
    fileName: vn,
    lineNumber: 66,
    columnNumber: 23
  }, this) : null;
}
dg.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
function pg(e) {
  var t, n, r, i, o, a, u, f, c, h, p, w, P, _ = e.debounce, N = e.detectBounds, I = e.horizontalCrosshairStyle, k = e.glyphStyle, F = e.renderTooltip, T = e.renderGlyph, G = T === void 0 ? eR : T, M = e.resizeObserverPolyfill, z = e.scroll, te = z === void 0 ? !0 : z, Q = e.showDatumGlyph, fe = Q === void 0 ? !1 : Q, me = e.showHorizontalCrosshair, re = me === void 0 ? !1 : me, ee = e.showSeriesGlyphs, be = ee === void 0 ? !1 : ee, Oe = e.showVerticalCrosshair, ut = Oe === void 0 ? !1 : Oe, Ue = e.snapTooltipToDatumX, st = Ue === void 0 ? !1 : Ue, lt = e.snapTooltipToDatumY, dt = lt === void 0 ? !1 : lt, V = e.verticalCrosshairStyle, ue = e.zIndex, Ne = Hp(e, QS), Ae = un(jr) || {}, Ce = Ae.colorScale, Re = Ae.theme, Te = Ae.innerHeight, Be = Ae.innerWidth, Le = Ae.margin, X = Ae.xScale, ce = Ae.yScale, Ge = Ae.dataRegistry, D = un(ea), gt = XS({
    debounce: _,
    detectBounds: N,
    polyfill: M,
    scroll: te,
    zIndex: ue
  }), ct = gt.containerRef, St = gt.TooltipInPortal, At = gt.forceRefreshBounds, Zt = xt(function(Gt) {
    var Xt;
    ct((Xt = Gt == null ? void 0 : Gt.parentElement) != null ? Xt : null);
  }, [ct]), sn = D != null && D.tooltipOpen ? F(Ao({}, D, {
    colorScale: Ce
  })) : null, bn = (D == null ? void 0 : D.tooltipOpen) && sn != null, wn = nn(!1);
  an(function() {
    bn && !wn.current && At(), wn.current = bn;
  }, [bn, At]);
  var xn = D == null ? void 0 : D.tooltipLeft, Ln = D == null ? void 0 : D.tooltipTop, ir = X ? Fl(X) : 0, Gn = ce ? Fl(ce) : 0, _n = xt(function(Gt, Xt) {
    var O, J, he = Ge == null ? void 0 : Ge.get(Gt), ze = he == null ? void 0 : he.xAccessor, ht = he == null ? void 0 : he.yAccessor, yt = X && ze ? (O = Number(X(ze(Xt))) + ir / 2) != null ? O : 0 : void 0, ot = ce && ht ? (J = Number(ce(ht(Xt))) + Gn / 2) != null ? J : 0 : void 0;
    return {
      left: yt,
      top: ot
    };
  }, [Ge, ir, Gn, X, ce]), Yt = D == null || (t = D.tooltipData) == null ? void 0 : t.nearestDatum, On = (n = Yt == null ? void 0 : Yt.key) != null ? n : "";
  if (bn && Yt && (st || dt)) {
    var or = _n(On, Yt.datum), yr = or.left, br = or.top;
    xn = st && tn(yr) ? yr : xn, Ln = dt && tn(br) ? br : Ln;
  }
  var ar = [];
  if (bn && (fe || be)) {
    var wr, jn = Number((wr = k == null ? void 0 : k.radius) != null ? wr : 4);
    if (be) {
      var Hn, ln;
      Object.values((Hn = D == null || (ln = D.tooltipData) == null ? void 0 : ln.datumByKey) != null ? Hn : {}).forEach(function(Gt) {
        var Xt, O, J, he = Gt.key, ze = Gt.datum, ht = Gt.index, yt = (Xt = (O = Ce == null ? void 0 : Ce(he)) != null ? O : Re == null || (J = Re.htmlLabel) == null ? void 0 : J.color) != null ? Xt : "#222", ot = _n(he, ze), rt = ot.left, kt = ot.top;
        !tn(rt) || !tn(kt) || ar.push({
          key: he,
          color: yt,
          datum: ze,
          index: ht,
          size: jn,
          x: rt,
          y: kt,
          glyphStyle: k,
          isNearestDatum: Yt ? Yt.key === he : !1
        });
      });
    } else if (Yt) {
      var Sn = _n(On, Yt.datum), An = Sn.left, kn = Sn.top;
      if (tn(An) && tn(kn)) {
        var ur, $n, sr, Wn, Un, Rn, xr = (ur = ($n = (sr = (Wn = On && (Ce == null ? void 0 : Ce(On))) != null ? Wn : null) != null ? sr : Re == null || (Un = Re.gridStyles) == null ? void 0 : Un.stroke) != null ? $n : Re == null || (Rn = Re.htmlLabel) == null ? void 0 : Rn.color) != null ? ur : "#222";
        ar.push({
          key: On,
          color: xr,
          datum: Yt.datum,
          index: Yt.index,
          size: jn,
          x: An,
          y: kn,
          glyphStyle: k,
          isNearestDatum: !0
        });
      }
    }
  }
  return /* @__PURE__ */ B(zn, {
    children: [/* @__PURE__ */ B("svg", {
      ref: Zt,
      style: JS
    }, void 0, !1, {
      fileName: vn,
      lineNumber: 250,
      columnNumber: 60
    }, this), bn && /* @__PURE__ */ B(zn, {
      children: [ut && /* @__PURE__ */ B(St, {
        className: "visx-crosshair visx-crosshair-vertical",
        left: xn,
        top: Le == null ? void 0 : Le.top,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: tl,
        children: /* @__PURE__ */ B("svg", {
          width: "1",
          height: Te,
          overflow: "visible",
          children: /* @__PURE__ */ B("line", {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: Te,
            strokeWidth: 1.5,
            stroke: (r = (i = Re == null || (o = Re.gridStyles) == null ? void 0 : o.stroke) != null ? i : Re == null || (a = Re.htmlLabel) == null ? void 0 : a.color) != null ? r : "#222",
            ...V
          }, void 0, !1, {
            fileName: vn,
            lineNumber: 265,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: vn,
          lineNumber: 261,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: vn,
        lineNumber: 253,
        columnNumber: 117
      }, this), re && /* @__PURE__ */ B(St, {
        className: "visx-crosshair visx-crosshair-horizontal",
        left: Le == null ? void 0 : Le.left,
        top: Ln,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: tl,
        children: /* @__PURE__ */ B("svg", {
          width: Be,
          height: "1",
          overflow: "visible",
          children: /* @__PURE__ */ B("line", {
            x1: 0,
            x2: Be,
            y1: 0,
            y2: 0,
            strokeWidth: 1.5,
            stroke: (u = (f = Re == null || (c = Re.gridStyles) == null ? void 0 : c.stroke) != null ? f : Re == null || (h = Re.htmlLabel) == null ? void 0 : h.color) != null ? u : "#222",
            ...I
          }, void 0, !1, {
            fileName: vn,
            lineNumber: 284,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: vn,
          lineNumber: 280,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: vn,
        lineNumber: 272,
        columnNumber: 76
      }, this), ar.map(function(Gt, Xt) {
        var O = Gt.x, J = Gt.y, he = Hp(Gt, ZS);
        return /* @__PURE__ */ B(St, {
          className: "visx-tooltip-glyph",
          left: O,
          top: J,
          offsetLeft: 0,
          offsetTop: 0,
          detectBounds: !1,
          style: tl,
          children: /* @__PURE__ */ B("svg", {
            overflow: "visible",
            children: G(Ao({
              x: 0,
              y: 0
            }, he))
          }, void 0, !1, {
            fileName: vn,
            lineNumber: 308,
            columnNumber: 25
          }, this)
        }, Xt, !1, {
          fileName: vn,
          lineNumber: 299,
          columnNumber: 9
        }, this);
      }), /* @__PURE__ */ B(St, {
        left: xn,
        top: Ln,
        style: Ao({}, lf, {
          background: (p = Re == null ? void 0 : Re.backgroundColor) != null ? p : "white",
          boxShadow: "0 1px 2px " + (Re != null && (w = Re.htmlLabel) != null && w.color ? (Re == null || (P = Re.htmlLabel) == null ? void 0 : P.color) + "55" : "#22222255")
        }, Re == null ? void 0 : Re.htmlLabel),
        ...Ne,
        children: sn
      }, void 0, !1, {
        fileName: vn,
        lineNumber: 315,
        columnNumber: 22
      }, this)]
    }, void 0, !0)]
  }, void 0, !0);
}
pg.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
const tR = /* @__PURE__ */ Vo(ly);
var nR = mg, Nr = vg(ke.exports), rR = vg(bh), bi = aR(gn), iR = tR, oR = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function hg(e) {
  if (typeof WeakMap != "function")
    return null;
  var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (hg = function(i) {
    return i ? n : t;
  })(e);
}
function aR(e, t) {
  if (!t && e && e.__esModule)
    return e;
  if (e === null || typeof e != "object" && typeof e != "function")
    return { default: e };
  var n = hg(t);
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
function vg(e) {
  return e && e.__esModule ? e : { default: e };
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
function uR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var sR = [];
function mg(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? sR : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = uR(e, oR), w = (0, bi.useRef)(null), P = (0, bi.useRef)(0), _ = (0, bi.useState)({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), N = _[0], I = _[1], k = (0, bi.useMemo)(function() {
    var F = Array.isArray(a) ? a : [a];
    return (0, rR.default)(function(T) {
      I(function(G) {
        var M = Object.keys(G), z = M.filter(function(Q) {
          return G[Q] !== T[Q];
        }), te = z.every(function(Q) {
          return F.includes(Q);
        });
        return te ? G : T;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return (0, bi.useEffect)(function() {
    var F = new iR.ResizeObserver(function(T) {
      T === void 0 && (T = []), T.forEach(function(G) {
        var M = G.contentRect, z = M.left, te = M.top, Q = M.width, fe = M.height;
        P.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: z
          });
        });
      });
    });
    return w.current && F.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), F.disconnect(), k != null && k.cancel && k.cancel();
    };
  }, [k]), /* @__PURE__ */ bi.default.createElement("div", du({
    style: f,
    ref: w,
    className: t
  }, p), n(du({}, N, {
    ref: w.current,
    resize: k
  })));
}
mg.propTypes = {
  className: Nr.default.string,
  debounceTime: Nr.default.number,
  enableDebounceLeadingCall: Nr.default.bool,
  ignoreDimensions: Nr.default.oneOfType([Nr.default.any, Nr.default.arrayOf(Nr.default.any)]),
  children: Nr.default.func.isRequired
};
var lR = /* @__PURE__ */ fh(null);
const gg = lR;
function Ar(e, t, n) {
  var r = un(gg), i = nn();
  i.current = n;
  var o = xt(function(a, u, f) {
    r && r.emit(a, {
      event: u,
      svgPoint: Ty(u),
      source: f
    });
  }, [r]);
  return an(function() {
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
function cR(e) {
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
var fR = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/EventEmitterProvider.js";
function dR(e) {
  var t = e.children, n = Wt(function() {
    return cR();
  }, []);
  return /* @__PURE__ */ B(gg.Provider, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: fR,
    lineNumber: 11,
    columnNumber: 23
  }, this);
}
var pR = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/TooltipProvider.js";
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
function yg(e) {
  var t = e.hideTooltipDebounceMs, n = t === void 0 ? 400 : t, r = e.children, i = kS(void 0), o = i.tooltipOpen, a = i.tooltipLeft, u = i.tooltipTop, f = i.tooltipData, c = i.updateTooltip, h = i.hideTooltip, p = nn(null), w = nn(function(_) {
    var N = _.svgPoint, I = _.index, k = _.key, F = _.datum, T = _.distanceX, G = _.distanceY;
    p.current && (p.current.cancel(), p.current = null);
    var M = tn(T) ? T : 1 / 0, z = tn(G) ? G : 1 / 0, te = Math.sqrt(Math.pow(M, 2) + Math.pow(z, 2));
    c(function(Q) {
      var fe, me, re, ee = Q.tooltipData, be = ee != null && ee.nearestDatum && tn(ee.nearestDatum.distance) ? ee.nearestDatum.distance : 1 / 0;
      return {
        tooltipOpen: !0,
        tooltipLeft: N == null ? void 0 : N.x,
        tooltipTop: N == null ? void 0 : N.y,
        tooltipData: {
          nearestDatum: ((fe = ee == null || (me = ee.nearestDatum) == null ? void 0 : me.key) != null ? fe : "") !== k && be < te ? ee == null ? void 0 : ee.nearestDatum : {
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
  }), P = xt(function() {
    p.current = dc(h, n), p.current();
  }, [h, n]);
  return /* @__PURE__ */ B(ea.Provider, {
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
    fileName: pR,
    lineNumber: 72,
    columnNumber: 23
  }, this);
}
yg.propTypes = {
  hideTooltipDebounceMs: ke.exports.number,
  children: ke.exports.node.isRequired
};
const hR = /* @__PURE__ */ Vo(cx);
var ta = {}, ff = {};
ff.__esModule = !0;
ff.default = vR;
function vR(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
var df = {};
df.__esModule = !0;
df.default = mR;
function mR(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
var pf = {};
pf.__esModule = !0;
pf.default = gR;
function gR(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
var hf = {};
hf.__esModule = !0;
hf.default = yR;
function yR(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
var vf = {};
vf.__esModule = !0;
vf.default = bR;
function bR(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
var mf = {};
mf.__esModule = !0;
mf.default = wR;
function wR(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
var gf = {};
gf.__esModule = !0;
gf.default = xR;
function xR(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var yf = {}, bf = {};
const bg = /* @__PURE__ */ Vo(d1);
bf.__esModule = !0;
bf.default = _R;
var Tr = bg, Wp = {
  lab: Tr.interpolateLab,
  hcl: Tr.interpolateHcl,
  "hcl-long": Tr.interpolateHclLong,
  hsl: Tr.interpolateHsl,
  "hsl-long": Tr.interpolateHslLong,
  cubehelix: Tr.interpolateCubehelix,
  "cubehelix-long": Tr.interpolateCubehelixLong,
  rgb: Tr.interpolateRgb
};
function _R(e) {
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
yf.default = CR;
var SR = RR(bf);
function RR(e) {
  return e && e.__esModule ? e : { default: e };
}
function CR(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = (0, SR.default)(t.interpolate);
    e.interpolate(n);
  }
}
var wf = {};
const PR = /* @__PURE__ */ Vo(iw);
var xf = {};
xf.__esModule = !0;
xf.default = ER;
var NR = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), TR = "%Y-%m-%d %H:%M";
function ER(e) {
  var t = e.tickFormat(1, TR)(NR);
  return t === "2020-02-02 03:04";
}
wf.__esModule = !0;
wf.default = AR;
var dn = PR, MR = OR(xf);
function OR(e) {
  return e && e.__esModule ? e : { default: e };
}
var Up = {
  day: dn.timeDay,
  hour: dn.timeHour,
  minute: dn.timeMinute,
  month: dn.timeMonth,
  second: dn.timeSecond,
  week: dn.timeWeek,
  year: dn.timeYear
}, Vp = {
  day: dn.utcDay,
  hour: dn.utcHour,
  minute: dn.utcMinute,
  month: dn.utcMonth,
  second: dn.utcSecond,
  week: dn.utcWeek,
  year: dn.utcYear
};
function AR(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = (0, MR.default)(r);
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
_f.default = kR;
function kR(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
var Sf = {};
Sf.__esModule = !0;
Sf.default = $R;
function $R(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
var Rf = {};
Rf.__esModule = !0;
Rf.default = IR;
var FR = bg;
function IR(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(FR.interpolateRound));
}
var Cf = {};
Cf.__esModule = !0;
Cf.default = BR;
function BR(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
var Pf = {};
Pf.__esModule = !0;
Pf.default = DR;
function DR(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
ta.__esModule = !0;
ta.default = eC;
ta.ALL_OPERATORS = void 0;
var zR = pn(ff), LR = pn(df), GR = pn(pf), jR = pn(hf), HR = pn(vf), WR = pn(mf), UR = pn(gf), VR = pn(yf), qR = pn(wf), YR = pn(_f), XR = pn(Sf), KR = pn(Rf), QR = pn(Cf), ZR = pn(Pf);
function pn(e) {
  return e && e.__esModule ? e : { default: e };
}
var wg = [
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
ta.ALL_OPERATORS = wg;
var JR = {
  domain: zR.default,
  nice: qR.default,
  zero: ZR.default,
  interpolate: VR.default,
  round: KR.default,
  align: GR.default,
  base: jR.default,
  clamp: HR.default,
  constant: WR.default,
  exponent: UR.default,
  padding: YR.default,
  range: LR.default,
  reverse: XR.default,
  unknown: QR.default
};
function eC() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = wg.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      JR[f](a, u);
    }), a;
  };
}
var tC = aC, nC = hR, rC = iC(ta);
function iC(e) {
  return e && e.__esModule ? e : { default: e };
}
var oC = (0, rC.default)("domain", "range", "reverse", "unknown");
function aC(e) {
  return oC((0, nC.scaleOrdinal)(), e);
}
var Or = {
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
}, Ro = Or.gray, nl = Ro[7], uC = [Or.cyan[9], Or.cyan[3], Or.yellow[5], Or.red[4], Or.grape[8], Or.grape[5], Or.pink[9]];
function Ot() {
  return Ot = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ot.apply(this, arguments);
}
var rl = {
  fontFamily: "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
  fontWeight: 700,
  fontSize: 12,
  textAnchor: "middle",
  pointerEvents: "none",
  letterSpacing: 0.4
};
function sC(e) {
  var t, n, r, i, o, a, u = Ot({}, rl, {
    fill: nl,
    stroke: "none"
  }, e.svgLabelBig), f = Ot({}, rl, {
    fontWeight: 200,
    fontSize: 11,
    fill: nl,
    stroke: "none"
  }, e.svgLabelSmall), c = Ot({
    color: (t = (n = (r = (i = e.htmlLabel) == null ? void 0 : i.color) != null ? r : (o = e.svgLabelBig) == null ? void 0 : o.fill) != null ? n : (a = e.svgLabelSmall) == null ? void 0 : a.fill) != null ? t : nl
  }, rl, e.htmlLabel);
  return {
    backgroundColor: e.backgroundColor,
    colors: [].concat(e.colors),
    htmlLabel: Ot({}, c),
    svgLabelSmall: Ot({}, f),
    svgLabelBig: Ot({}, u),
    gridStyles: Ot({
      stroke: e.gridColor,
      strokeWidth: 1
    }, e.gridStyles),
    axisStyles: {
      x: {
        top: {
          axisLabel: Ot({}, u, {
            dy: "-0.25em"
          }),
          axisLine: Ot({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: Ot({}, f, {
            dy: "-0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Ot({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        },
        bottom: {
          axisLabel: Ot({}, u, {
            dy: "-0.25em"
          }),
          axisLine: Ot({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: Ot({}, f, {
            dy: "0.125em"
          }),
          tickLength: e.tickLength,
          tickLine: Ot({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        }
      },
      y: {
        left: {
          axisLabel: Ot({}, u, {
            dx: "-1.25em"
          }),
          axisLine: Ot({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: Ot({}, f, {
            textAnchor: "end",
            dx: "-0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Ot({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        },
        right: {
          axisLabel: Ot({}, u, {
            dx: "1.25em"
          }),
          axisLine: Ot({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: Ot({}, f, {
            textAnchor: "start",
            dx: "0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: Ot({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        }
      }
    }
  };
}
const lC = sC({
  backgroundColor: "#fff",
  colors: uC,
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
var cC = /* @__PURE__ */ gn.createContext(lC);
const fC = cC;
function qp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var dC = /* @__PURE__ */ function() {
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
function pC() {
  var e = vr(Math.random()), t = e[1], n = Wt(function() {
    return new dC();
  }, []);
  return Wt(function() {
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
var il = {
  width: 0,
  height: 0,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
function hC(e) {
  var t = vr({
    width: (e == null ? void 0 : e.width) == null ? il.width : e.width,
    height: (e == null ? void 0 : e.height) == null ? il.height : e.height,
    margin: (e == null ? void 0 : e.margin) == null ? il.margin : e.margin
  }), n = t[0], r = t[1], i = xt(function(o) {
    (o.width !== n.width || o.height !== n.height || o.margin.left !== n.margin.left || o.margin.right !== n.margin.right || o.margin.top !== n.margin.top || o.margin.bottom !== n.margin.bottom) && r(o);
  }, [n.width, n.height, n.margin.left, n.margin.right, n.margin.bottom, n.margin.top]);
  return [n, i];
}
function Jl(e) {
  return (e == null ? void 0 : e.type) === "band" || (e == null ? void 0 : e.type) === "ordinal" || (e == null ? void 0 : e.type) === "point";
}
function Ri() {
  return Ri = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ri.apply(this, arguments);
}
function vC(e) {
  var t = e.dataRegistry, n = e.xRange, r = e.xScaleConfig, i = e.yRange, o = e.yScaleConfig, a = t.keys(), u = n[0], f = n[1], c = i[0], h = i[1], p = Wt(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, F) {
      return F ? k.concat(F.data.map(function(T) {
        return F.xAccessor(T);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var N = Jl(r) ? _ : md(_), I = fp(r) ? Fa(Ri({
        range: [u, f],
        domain: N,
        zero: !0
      }, r)) : Fa(Ri({
        range: [u, f],
        domain: N
      }, r));
      return P.forEach(function(k) {
        k != null && k.xScale && (I = k.xScale(I));
      }), I;
    }
  }, [t, r, a, u, f]), w = Wt(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, F) {
      return F ? k.concat(F.data.map(function(T) {
        return F.yAccessor(T);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var N = Jl(o) ? _ : md(_), I = fp(o) ? Fa(Ri({
        range: [c, h],
        domain: N,
        zero: !0
      }, o)) : Fa(Ri({
        range: [c, h],
        domain: N
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
var mC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/DataProvider.js";
function xg(e) {
  var t = e.initialDimensions, n = e.theme, r = e.xScale, i = e.yScale, o = e.children, a = e.horizontal, u = a === void 0 ? "auto" : a, f = un(fC), c = n || f, h = hC(t), p = h[0], w = p.width, P = p.height, _ = p.margin, N = h[1], I = Math.max(0, w - _.left - _.right), k = Math.max(0, P - _.top - _.bottom), F = pC(), T = vC({
    dataRegistry: F,
    xScaleConfig: r,
    yScaleConfig: i,
    xRange: [_.left, Math.max(0, w - _.right)],
    yRange: [Math.max(0, P - _.bottom), _.top]
  }), G = T.xScale, M = T.yScale, z = F.keys(), te = Wt(function() {
    return tC({
      domain: z,
      range: c.colors
    });
  }, [z, c.colors]), Q = u === "auto" ? Jl(i) || i.type === "time" || i.type === "utc" : u;
  return /* @__PURE__ */ B(jr.Provider, {
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
      setDimensions: N,
      horizontal: Q
    },
    children: o
  }, void 0, !1, {
    fileName: mC,
    lineNumber: 55,
    columnNumber: 23
  }, this);
}
xg.propTypes = {
  children: ke.exports.node.isRequired,
  horizontal: ke.exports.oneOfType([ke.exports.bool, ke.exports.oneOf(["auto"])])
};
function _g(e) {
  var t = e.source, n = e.onPointerOut, r = n === void 0 ? !0 : n, i = e.onPointerMove, o = i === void 0 ? !0 : i, a = e.onPointerUp, u = a === void 0 ? !0 : a, f = e.onPointerDown, c = f === void 0 ? !0 : f, h = e.onFocus, p = h === void 0 ? !1 : h, w = e.onBlur, P = w === void 0 ? !1 : w, _ = Ar(), N = xt(function(M) {
    return _ == null ? void 0 : _("pointermove", M, t);
  }, [_, t]), I = xt(function(M) {
    return _ == null ? void 0 : _("pointerout", M, t);
  }, [_, t]), k = xt(function(M) {
    return _ == null ? void 0 : _("pointerup", M, t);
  }, [_, t]), F = xt(function(M) {
    return _ == null ? void 0 : _("pointerdown", M, t);
  }, [_, t]), T = xt(function(M) {
    return _ == null ? void 0 : _("focus", M, t);
  }, [_, t]), G = xt(function(M) {
    return _ == null ? void 0 : _("blur", M, t);
  }, [_, t]);
  return {
    onPointerMove: o ? N : void 0,
    onFocus: p ? T : void 0,
    onBlur: P ? G : void 0,
    onPointerOut: r ? I : void 0,
    onPointerUp: u ? k : void 0,
    onPointerDown: c ? F : void 0
  };
}
var gC = "AREASERIES_EVENT_SOURCE", yC = "GLYPHSERIES_EVENT_SOURCE", Wu = "XYCHART_EVENT_SOURCE";
function Yp(e) {
  return !!e && ("clientX" in e || "changedTouches" in e);
}
function Sg(e) {
  var t = e.scale, n = e.accessor, r = e.scaledValue, i = e.data, o = t, a, u;
  if ("invert" in o && typeof o.invert == "function") {
    var f = wu(n).left, c = Number(o.invert(r)), h = f(i, c), p = i[h - 1], w = i[h];
    a = !p || Math.abs(c - n(p)) > Math.abs(c - n(w)) ? w : p, u = a === p ? h - 1 : h;
  } else if ("step" in o && typeof o.step < "u") {
    var P = t.domain(), _ = t.range().map(Number), N = [].concat(_).sort(function(z, te) {
      return z - te;
    }), I = ov(N[0], N[1], o.step()), k = $b(I, r), F = _[0] < _[1] ? P : P.reverse(), T = F[k - 1], G = i.findIndex(function(z) {
      return String(n(z)) === String(T);
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
function bC(e) {
  var t = e.xScale, n = e.xAccessor, r = e.yScale, i = e.yAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = Sg({
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
function wC(e) {
  var t = e.yScale, n = e.yAccessor, r = e.xScale, i = e.xAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = Sg({
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
var tc = "__POINTER_EVENTS_ALL", Ya = "__POINTER_EVENTS_NEAREST";
function Rg(e) {
  var t = e.dataKey, n = e.findNearestDatum, r = e.onBlur, i = e.onFocus, o = e.onPointerMove, a = e.onPointerOut, u = e.onPointerUp, f = e.onPointerDown, c = e.allowedSources, h = un(jr), p = h.width, w = h.height, P = h.horizontal, _ = h.dataRegistry, N = h.xScale, I = h.yScale, k = n || (P ? wC : bC), F = xt(function(fe) {
    var me = fe || {}, re = me.svgPoint, ee = me.event, be = {}, Oe = null, ut = 1 / 0;
    if (fe && ee && re && p && w && N && I) {
      var Ue, st = t === Ya || t === tc, lt = st ? (Ue = _ == null ? void 0 : _.keys()) != null ? Ue : [] : Array.isArray(t) ? t : [t];
      lt.forEach(function(V) {
        var ue = _ == null ? void 0 : _.get(V);
        if (ue) {
          var Ne = k({
            dataKey: V,
            data: ue.data,
            height: w,
            point: re,
            width: p,
            xAccessor: ue.xAccessor,
            xScale: N,
            yAccessor: ue.yAccessor,
            yScale: I
          });
          if (Ne && (be[V] = ec({
            key: V,
            svgPoint: re,
            event: ee
          }, Ne), t === Ya)) {
            var Ae, Ce, Re = Math.sqrt(((Ae = Ne.distanceX) != null ? Ae : Math.pow(1 / 0, 2)) + ((Ce = Ne.distanceY) != null ? Ce : Math.pow(1 / 0, 2)));
            Oe = Re < ut ? be[V] : Oe, ut = Math.min(ut, Re);
          }
        }
      });
      var dt = t === Ya ? [Oe] : t === tc || Array.isArray(t) ? Object.values(be) : [be[t]];
      return dt.filter(function(V) {
        return V;
      });
    }
    return [];
  }, [t, _, N, I, p, w, k]), T = xt(function(fe) {
    o && F(fe).forEach(function(me) {
      return o(me);
    });
  }, [F, o]), G = xt(function(fe) {
    u && F(fe).forEach(function(me) {
      return u(me);
    });
  }, [F, u]), M = xt(function(fe) {
    f && F(fe).forEach(function(me) {
      return f(me);
    });
  }, [F, f]), z = xt(function(fe) {
    i && F(fe).forEach(function(me) {
      return i(me);
    });
  }, [F, i]), te = xt(function(fe) {
    var me = fe == null ? void 0 : fe.event;
    me && Yp(me) && a && a(me);
  }, [a]), Q = xt(function(fe) {
    var me = fe == null ? void 0 : fe.event;
    me && !Yp(me) && r && r(me);
  }, [r]);
  Ar("pointermove", o ? T : void 0, c), Ar("pointerout", a ? te : void 0, c), Ar("pointerup", u ? G : void 0, c), Ar("pointerdown", f ? M : void 0, c), Ar("focus", i ? z : void 0, c), Ar("blur", r ? Q : void 0, c);
}
var Kn = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/XYChart.js", xC = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}, _C = [Wu];
function Ci(e) {
  var t = e.accessibilityLabel, n = t === void 0 ? "XYChart" : t, r = e.captureEvents, i = r === void 0 ? !0 : r, o = e.children, a = e.height, u = e.horizontal, f = e.margin, c = f === void 0 ? xC : f, h = e.onPointerMove, p = e.onPointerOut, w = e.onPointerUp, P = e.onPointerDown, _ = e.pointerEventsDataKey, N = _ === void 0 ? "nearest" : _, I = e.theme, k = e.width, F = e.xScale, T = e.yScale, G = un(jr), M = G.setDimensions, z = un(ea), te = Ar();
  an(function() {
    M && k != null && a != null && k > 0 && a > 0 && M({
      width: k,
      height: a,
      margin: c
    });
  }, [M, k, a, c]);
  var Q = _g({
    source: Wu
  });
  return Rg({
    dataKey: N === "nearest" ? Ya : tc,
    onPointerMove: h,
    onPointerOut: p,
    onPointerUp: w,
    onPointerDown: P,
    allowedSources: _C
  }), M ? k == null || a == null ? /* @__PURE__ */ B(nR, {
    children: function(fe) {
      return /* @__PURE__ */ B(Ci, {
        ...e,
        width: e.width == null ? fe.width : e.width,
        height: e.height == null ? fe.height : e.height
      }, void 0, !1, {
        fileName: Kn,
        lineNumber: 93,
        columnNumber: 27
      }, this);
    }
  }, void 0, !1, {
    fileName: Kn,
    lineNumber: 92,
    columnNumber: 25
  }, this) : z == null ? /* @__PURE__ */ B(yg, {
    children: /* @__PURE__ */ B(Ci, {
      ...e
    }, void 0, !1, {
      fileName: Kn,
      lineNumber: 101,
      columnNumber: 81
    }, this)
  }, void 0, !1, {
    fileName: Kn,
    lineNumber: 101,
    columnNumber: 25
  }, this) : te == null ? /* @__PURE__ */ B(dR, {
    children: /* @__PURE__ */ B(Ci, {
      ...e
    }, void 0, !1, {
      fileName: Kn,
      lineNumber: 106,
      columnNumber: 86
    }, this)
  }, void 0, !1, {
    fileName: Kn,
    lineNumber: 106,
    columnNumber: 25
  }, this) : k > 0 && a > 0 ? /* @__PURE__ */ B("svg", {
    width: k,
    height: a,
    "aria-label": n,
    children: [o, i && /* @__PURE__ */ B("rect", {
      x: c.left,
      y: c.top,
      width: k - c.left - c.right,
      height: a - c.top - c.bottom,
      fill: "transparent",
      ...Q
    }, void 0, !1, {
      fileName: Kn,
      lineNumber: 113,
      columnNumber: 46
    }, this)]
  }, void 0, !0, {
    fileName: Kn,
    lineNumber: 109,
    columnNumber: 49
  }, this) : null : !F || !T ? (console.warn("[@visx/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart."), null) : /* @__PURE__ */ B(xg, {
    xScale: F,
    yScale: T,
    theme: I,
    initialDimensions: {
      width: k,
      height: a,
      margin: c
    },
    horizontal: u,
    children: /* @__PURE__ */ B(Ci, {
      ...e
    }, void 0, !1, {
      fileName: Kn,
      lineNumber: 88,
      columnNumber: 21
    }, this)
  }, void 0, !1, {
    fileName: Kn,
    lineNumber: 78,
    columnNumber: 25
  }, this);
}
Ci.propTypes = {
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
const Nf = /* @__PURE__ */ Vo(Mb);
var Tf = {};
Tf.__esModule = !0;
Tf.default = SC;
function SC(e, t) {
  e(t);
}
var ci = {};
ci.__esModule = !0;
ci.default = CC;
ci.STACK_ORDER_NAMES = ci.STACK_ORDERS = void 0;
var mo = Nf, pu = {
  ascending: mo.stackOrderAscending,
  descending: mo.stackOrderDescending,
  insideout: mo.stackOrderInsideOut,
  none: mo.stackOrderNone,
  reverse: mo.stackOrderReverse
};
ci.STACK_ORDERS = pu;
var RC = Object.keys(pu);
ci.STACK_ORDER_NAMES = RC;
function CC(e) {
  return e && pu[e] || pu.none;
}
var fi = {};
fi.__esModule = !0;
fi.default = NC;
fi.STACK_OFFSET_NAMES = fi.STACK_OFFSETS = void 0;
var go = Nf, hu = {
  expand: go.stackOffsetExpand,
  diverging: go.stackOffsetDiverging,
  none: go.stackOffsetNone,
  silhouette: go.stackOffsetSilhouette,
  wiggle: go.stackOffsetWiggle
};
fi.STACK_OFFSETS = hu;
var PC = Object.keys(hu);
fi.STACK_OFFSET_NAMES = PC;
function NC(e) {
  return e && hu[e] || hu.none;
}
gr.__esModule = !0;
gr.arc = MC;
gr.area = OC;
gr.line = AC;
gr.pie = kC;
gr.radialLine = $C;
gr.stack = FC;
var Vi = Nf, It = Ef(Tf), TC = Ef(ci), EC = Ef(fi);
function Ef(e) {
  return e && e.__esModule ? e : { default: e };
}
function MC(e) {
  var t = e === void 0 ? {} : e, n = t.innerRadius, r = t.outerRadius, i = t.cornerRadius, o = t.startAngle, a = t.endAngle, u = t.padAngle, f = t.padRadius, c = (0, Vi.arc)();
  return n != null && (0, It.default)(c.innerRadius, n), r != null && (0, It.default)(c.outerRadius, r), i != null && (0, It.default)(c.cornerRadius, i), o != null && (0, It.default)(c.startAngle, o), a != null && (0, It.default)(c.endAngle, a), u != null && (0, It.default)(c.padAngle, u), f != null && (0, It.default)(c.padRadius, f), c;
}
function OC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.x0, i = t.x1, o = t.y, a = t.y0, u = t.y1, f = t.defined, c = t.curve, h = (0, Vi.area)();
  return n && (0, It.default)(h.x, n), r && (0, It.default)(h.x0, r), i && (0, It.default)(h.x1, i), o && (0, It.default)(h.y, o), a && (0, It.default)(h.y0, a), u && (0, It.default)(h.y1, u), f && h.defined(f), c && h.curve(c), h;
}
function AC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.y, i = t.defined, o = t.curve, a = (0, Vi.line)();
  return n && (0, It.default)(a.x, n), r && (0, It.default)(a.y, r), i && a.defined(i), o && a.curve(o), a;
}
function kC(e) {
  var t = e === void 0 ? {} : e, n = t.startAngle, r = t.endAngle, i = t.padAngle, o = t.value, a = t.sort, u = t.sortValues, f = (0, Vi.pie)();
  return (a === null || a != null) && f.sort(a), (u === null || u != null) && f.sortValues(u), o != null && f.value(o), i != null && (0, It.default)(f.padAngle, i), n != null && (0, It.default)(f.startAngle, n), r != null && (0, It.default)(f.endAngle, r), f;
}
function $C(e) {
  var t = e === void 0 ? {} : e, n = t.angle, r = t.radius, i = t.defined, o = t.curve, a = (0, Vi.radialLine)();
  return n && (0, It.default)(a.angle, n), r && (0, It.default)(a.radius, r), i && a.defined(i), o && a.curve(o), a;
}
function FC(e) {
  var t = e.keys, n = e.value, r = e.order, i = e.offset, o = (0, Vi.stack)();
  return t && o.keys(t), n && (0, It.default)(o.value, n), r && o.order((0, TC.default)(r)), i && o.offset((0, EC.default)(i)), o;
}
var IC = GC, ol = Cg(gn), BC = Cg(mu.exports), DC = gr, zC = ["children", "x", "x0", "x1", "y", "y0", "y1", "data", "defined", "className", "curve", "innerRef"];
function Cg(e) {
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
function LC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function GC(e) {
  var t = e.children, n = e.x, r = e.x0, i = e.x1, o = e.y, a = e.y0, u = e.y1, f = e.data, c = f === void 0 ? [] : f, h = e.defined, p = h === void 0 ? function() {
    return !0;
  } : h, w = e.className, P = e.curve, _ = e.innerRef, N = LC(e, zC), I = (0, DC.area)({
    x: n,
    x0: r,
    x1: i,
    y: o,
    y0: a,
    y1: u,
    defined: p,
    curve: P
  });
  return t ? /* @__PURE__ */ ol.default.createElement(ol.default.Fragment, null, t({
    path: I
  })) : /* @__PURE__ */ ol.default.createElement("path", nc({
    ref: _,
    className: (0, BC.default)("visx-area", w),
    d: I(c) || ""
  }, N));
}
var jC = qC, al = Pg(gn), HC = Pg(mu.exports), WC = gr, UC = ["children", "data", "x", "y", "fill", "className", "curve", "innerRef", "defined"];
function Pg(e) {
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
function VC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function qC(e) {
  var t = e.children, n = e.data, r = n === void 0 ? [] : n, i = e.x, o = e.y, a = e.fill, u = a === void 0 ? "transparent" : a, f = e.className, c = e.curve, h = e.innerRef, p = e.defined, w = p === void 0 ? function() {
    return !0;
  } : p, P = VC(e, UC), _ = (0, WC.line)({
    x: i,
    y: o,
    defined: w,
    curve: c
  });
  return t ? /* @__PURE__ */ al.default.createElement(al.default.Fragment, null, t({
    path: _
  })) : /* @__PURE__ */ al.default.createElement("path", rc({
    ref: h,
    className: (0, HC.default)("visx-linepath", f),
    d: _(r) || "",
    fill: u,
    strokeLinecap: "round"
  }, P));
}
var YC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/enhancers/withRegisteredData.js";
function XC(e) {
  function t(n) {
    var r = n.dataKey, i = n.data, o = n.xAccessor, a = n.yAccessor, u = un(jr), f = u.xScale, c = u.yScale, h = u.dataRegistry;
    an(function() {
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
    return /* @__PURE__ */ B(w, {
      ...n,
      xScale: f,
      yScale: c,
      data: p.data,
      xAccessor: p.xAccessor,
      yAccessor: p.yAccessor
    }, void 0, !1, {
      fileName: YC,
      lineNumber: 46,
      columnNumber: 25
    }, this);
  }
  return t;
}
function Pi(e, t, n) {
  return n === void 0 && (n = "center"), function(r) {
    var i = e(t(r));
    if (tn(i)) {
      var o = (n === "start" ? 0 : Fl(e)) / (n === "center" ? 2 : 1);
      return i + o;
    }
    return NaN;
  };
}
function KC(e) {
  var t = e.range().map(function(c) {
    var h;
    return (h = n_(c)) != null ? h : 0;
  }), n = t[0], r = t[1], i = n != null && r != null && r < n, o = e(0), a = i ? [r, n] : [n, r], u = a[0], f = a[1];
  return i ? tn(o) ? Math.min(Math.max(u, o), f) : f : tn(o) ? Math.max(o, u) : u;
}
function Ng(e) {
  var t, n = e.dataKey, r = e.enableEvents, i = e.findNearestDatum, o = e.onBlur, a = e.onFocus, u = e.onPointerMove, f = e.onPointerOut, c = e.onPointerUp, h = e.onPointerDown, p = e.source, w = e.allowedSources, P = (t = un(ea)) != null ? t : {}, _ = P.showTooltip, N = P.hideTooltip, I = xt(function(M) {
    _(M), u && u(M);
  }, [_, u]), k = xt(function(M) {
    _(M), a && a(M);
  }, [_, a]), F = xt(function(M) {
    N(), M && f && f(M);
  }, [N, f]), T = xt(function(M) {
    N(), M && o && o(M);
  }, [N, o]), G = xt(function(M) {
    _(M), h && h(M);
  }, [_, h]);
  return Rg({
    dataKey: n,
    findNearestDatum: i,
    onBlur: r ? T : void 0,
    onFocus: r ? k : void 0,
    onPointerMove: r ? I : void 0,
    onPointerOut: r ? F : void 0,
    onPointerUp: r ? c : void 0,
    onPointerDown: r ? G : void 0,
    allowedSources: w
  }), _g({
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
function Tg(e) {
  var t, n, r, i = e.colorAccessor, o = e.data, a = e.dataKey, u = e.onBlur, f = e.onFocus, c = e.onPointerMove, h = e.onPointerOut, p = e.onPointerUp, w = e.onPointerDown, P = e.enableEvents, _ = P === void 0 ? !0 : P, N = e.renderGlyphs, I = e.size, k = I === void 0 ? 8 : I, F = e.xAccessor, T = e.xScale, G = e.yAccessor, M = e.yScale, z = un(jr), te = z.colorScale, Q = z.theme, fe = z.horizontal, me = xt(Pi(T, F), [T, F]), re = xt(Pi(M, G), [M, G]), ee = (t = (n = te == null ? void 0 : te(a)) != null ? n : Q == null || (r = Q.colors) == null ? void 0 : r[0]) != null ? t : "#222", be = yC + "-" + a, Oe = Ng({
    dataKey: a,
    enableEvents: _,
    onBlur: u,
    onFocus: f,
    onPointerMove: c,
    onPointerOut: h,
    onPointerUp: p,
    onPointerDown: w,
    source: be,
    allowedSources: [Wu, be]
  }), ut = Wt(function() {
    return o.map(function(Ue, st) {
      var lt, dt = me(Ue);
      if (!tn(dt))
        return null;
      var V = re(Ue);
      return tn(V) ? {
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
  }, [ee, i, o, me, re, k]);
  return /* @__PURE__ */ B(zn, {
    children: N(ic({
      glyphs: ut,
      xScale: T,
      yScale: M,
      horizontal: fe
    }, Oe))
  }, void 0, !1);
}
Tg.propTypes = {
  colorAccessor: ke.exports.func,
  size: ke.exports.oneOfType([ke.exports.number, ke.exports.func]),
  renderGlyphs: ke.exports.func.isRequired
};
var QC = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/defaultRenderGlyph.js";
function ZC(e) {
  var t = e.key, n = e.color, r = e.x, i = e.y, o = e.size, a = e.onBlur, u = e.onFocus, f = e.onPointerMove, c = e.onPointerOut, h = e.onPointerUp;
  return /* @__PURE__ */ B("circle", {
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
    fileName: QC,
    lineNumber: 13,
    columnNumber: 23
  }, this);
}
var yo = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/BaseAreaSeries.js", JC = ["PathComponent", "curve", "data", "dataKey", "lineProps", "onBlur", "onFocus", "onPointerMove", "onPointerOut", "onPointerUp", "onPointerDown", "enableEvents", "renderLine", "xAccessor", "x0Accessor", "xScale", "yAccessor", "y0Accessor", "yScale"];
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
function eP(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function Eg(e) {
  var t, n, r, i = e.PathComponent, o = i === void 0 ? "path" : i, a = e.curve, u = e.data, f = e.dataKey, c = e.lineProps, h = e.onBlur, p = e.onFocus, w = e.onPointerMove, P = e.onPointerOut, _ = e.onPointerUp, N = e.onPointerDown, I = e.enableEvents, k = I === void 0 ? !0 : I, F = e.renderLine, T = F === void 0 ? !0 : F, G = e.xAccessor, M = e.x0Accessor, z = e.xScale, te = e.yAccessor, Q = e.y0Accessor, fe = e.yScale, me = eP(e, JC), re = un(jr), ee = re.colorScale, be = re.theme, Oe = re.horizontal, ut = Wt(function() {
    return M ? Pi(z, M) : void 0;
  }, [z, M]), Ue = xt(Pi(z, G), [z, G]), st = Wt(function() {
    return Q ? Pi(fe, Q) : void 0;
  }, [fe, Q]), lt = xt(Pi(fe, te), [fe, te]), dt = xt(function(Te) {
    return tn(z(G(Te))) && tn(fe(te(Te)));
  }, [z, G, fe, te]), V = (t = (n = ee == null ? void 0 : ee(f)) != null ? n : be == null || (r = be.colors) == null ? void 0 : r[0]) != null ? t : "#222", ue = gC + "-" + f, Ne = Ng({
    dataKey: f,
    enableEvents: k,
    onBlur: h,
    onFocus: p,
    onPointerMove: w,
    onPointerOut: P,
    onPointerUp: _,
    onPointerDown: N,
    source: ue,
    allowedSources: [Wu, ue]
  }), Ae = Wt(function() {
    var Te = KC(Oe ? z : fe);
    return Oe ? {
      x0: ut != null ? ut : Te,
      x1: Ue,
      y: lt
    } : {
      x: Ue,
      y0: st != null ? st : Te,
      y1: lt
    };
  }, [z, fe, Oe, Ue, lt, ut, st]), Ce = Boolean(p || h), Re = xt(function(Te) {
    var Be = Te.glyphs;
    return Ce ? Be.map(function(Le) {
      return /* @__PURE__ */ B(zn, {
        children: ZC(oc({}, Le, {
          color: "transparent",
          onFocus: Ne.onFocus,
          onBlur: Ne.onBlur
        }))
      }, void 0, !1);
    }) : null;
  }, [Ce, Ne.onFocus, Ne.onBlur]);
  return /* @__PURE__ */ B(zn, {
    children: [/* @__PURE__ */ B(IC, {
      ...Ae,
      ...me,
      curve: a,
      defined: dt,
      children: function(Te) {
        var Be = Te.path;
        return /* @__PURE__ */ B(o, {
          className: "visx-area",
          stroke: "transparent",
          fill: V,
          strokeLinecap: "round",
          ...me,
          d: Be(u) || "",
          ...Ne
        }, void 0, !1, {
          fileName: yo,
          lineNumber: 110,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 105,
      columnNumber: 78
    }, this), T && /* @__PURE__ */ B(jC, {
      x: Ue,
      y: lt,
      defined: dt,
      curve: a,
      ...c,
      children: function(Te) {
        var Be = Te.path;
        return /* @__PURE__ */ B(o, {
          className: "visx-line",
          fill: "transparent",
          stroke: V,
          strokeWidth: 2,
          pointerEvents: "none",
          strokeLinecap: "round",
          ...c,
          d: Be(u) || ""
        }, void 0, !1, {
          fileName: yo,
          lineNumber: 126,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 119,
      columnNumber: 34
    }, this), Ce && /* @__PURE__ */ B(Tg, {
      dataKey: f,
      data: u,
      xAccessor: G,
      yAccessor: te,
      xScale: z,
      yScale: fe,
      renderGlyphs: Re
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 137,
      columnNumber: 42
    }, this)]
  }, void 0, !0);
}
Eg.propTypes = {
  renderLine: ke.exports.bool
};
const tP = XC(Eg);
function nP(e, t) {
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
function rP(e) {
  const t = {};
  return e.length === 4 && (t.x2 = e[2][0], t.y2 = e[2][1]), e.length >= 3 && (t.x1 = e[1][0], t.y1 = e[1][1]), t.x = e[e.length - 1][0], t.y = e[e.length - 1][1], e.length === 4 ? t.type = "C" : e.length === 3 ? t.type = "Q" : t.type = "L", t;
}
function iP(e, t) {
  t = t || 2;
  const n = [];
  let r = e;
  const i = 1 / t;
  for (let o = 0; o < t - 1; o++) {
    const a = i / (1 - i * o), u = nP(r, a);
    n.push(u.left), r = u.right;
  }
  return n.push(r), n;
}
function oP(e, t, n) {
  const r = [[e.x, e.y]];
  return t.x1 != null && r.push([t.x1, t.y1]), t.x2 != null && r.push([t.x2, t.y2]), r.push([t.x, t.y]), iP(r, n).map(rP);
}
const aP = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, Ai = {
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
Object.keys(Ai).forEach((e) => {
  Ai[e.toLowerCase()] = Ai[e];
});
function ac(e, t) {
  const n = Array(e);
  for (let r = 0; r < e; r++)
    n[r] = t;
  return n;
}
function uP(e) {
  return `${e.type}${Ai[e.type].map((t) => e[t]).join(",")}`;
}
function sP(e, t) {
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
function lP(e, t, n) {
  let r = [];
  if (t.type === "L" || t.type === "Q" || t.type === "C")
    r = r.concat(
      oP(e, t, n)
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
      lP(e[h], e[h + 1], c)
    );
  }, []);
  return u.unshift(e[0]), u;
}
function Kp(e) {
  const t = (e || "").match(aP) || [], n = [];
  let r, i;
  for (let o = 0; o < t.length; ++o)
    if (r = Ai[t[o]], r) {
      i = {
        type: t[o]
      };
      for (let a = 0; a < r.length; ++a)
        i[r[a]] = +t[o + a + 1];
      o += r.length, n.push(i);
    }
  return n;
}
function cP(e, t, n) {
  let r = e == null ? [] : e.slice(), i = t == null ? [] : t.slice();
  if (!r.length && !i.length)
    return function() {
      return [];
    };
  const o = (r.length === 0 || r[r.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  r.length > 0 && r[r.length - 1].type === "Z" && r.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), r.length ? i.length || i.push(r[0]) : r.push(i[0]), Math.abs(i.length - r.length) !== 0 && (i.length > r.length ? r = Xp(r, i, n) : i.length < r.length && (i = Xp(i, r, n))), r = r.map(
    (f, c) => sP(f, i[c])
  );
  const u = r.map((f) => ({ ...f }));
  return o && u.push({ type: "Z" }), function(c) {
    if (c === 1)
      return t == null ? [] : t;
    if (c > 0)
      for (let h = 0; h < u.length; ++h) {
        const p = r[h], w = i[h], P = u[h];
        for (const _ of Ai[P.type])
          P[_] = (1 - c) * p[_] + c * w[_], (_ === "largeArcFlag" || _ === "sweepFlag") && (P[_] = Math.round(P[_]));
      }
    return u;
  };
}
function fP(e, t, n) {
  let r = Kp(e), i = Kp(t);
  if (!r.length && !i.length)
    return function() {
      return "";
    };
  const o = cP(
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
      c += uP(h);
    return c;
  };
}
var dP = ["d", "stroke", "fill"];
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
function pP(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function hP(e) {
  var t = e.d, n = e.stroke, r = n === void 0 ? "transparent" : n, i = e.fill, o = i === void 0 ? "transparent" : i, a = pP(e, dP), u = nn(t), f = xt(
    dc(function(P) {
      u.current = P;
    }, 50),
    []
  ), c = fP(u.current, t);
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
  return /* @__PURE__ */ gn.createElement(MS.path, uc({
    className: "visx-path",
    d: p.to(c),
    stroke: w.stroke,
    fill: w.fill
  }, a));
}
var vP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/AnimatedAreaSeries.js";
function Qp(e) {
  return /* @__PURE__ */ B(tP, {
    ...e,
    PathComponent: hP
  }, void 0, !1, {
    fileName: vP,
    lineNumber: 9,
    columnNumber: 23
  }, this);
}
const mP = "_tooltip_nplc5_10", gP = {
  tooltip: mP
};
var pt = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/LineChart/LineChart.tsx";
const yP = ({
  colorScale: e,
  nearestDatum: t,
  accessors: n
}) => /* @__PURE__ */ B("div", {
  className: gP.tooltip,
  children: /* @__PURE__ */ B("span", {
    children: [n.yAccessor(t.datum), " ", /* @__PURE__ */ B("span", {
      style: {
        color: "rgba(255,255,255, 50%)"
      },
      children: t.key
    }, void 0, !1, {
      fileName: pt,
      lineNumber: 28,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: pt,
    lineNumber: 26,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: pt,
  lineNumber: 25,
  columnNumber: 5
}, void 0), {
  baseColor: bP,
  generatedGradient: wP,
  gradientIds: xP
} = {
  generatedGradient: /* @__PURE__ */ B(zn, {
    children: [/* @__PURE__ */ B("linearGradient", {
      id: "dim",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1",
      children: [/* @__PURE__ */ B("stop", {
        offset: "0%",
        stopColor: "#000000",
        stopOpacity: 0
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 40,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "100%",
        stopColor: "#000000"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 41,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 39,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("radialGradient", {
      id: "paint0_radial_704_33887",
      cx: "0",
      cy: "0",
      r: "1",
      gradientUnits: "userSpaceOnUse",
      gradientTransform: "translate(482.79 589.404) rotate(95.8174) scale(1436.84 254.075)",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#FFFDB1"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 51,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "0.344597",
        "stop-color": "#FEE4BF"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 52,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "0.695017",
        "stop-color": "#F0BDD0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 53,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#FF8126",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 54,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 43,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("linearGradient", {
      id: "paint1_linear_704_33887",
      x1: "302.242",
      y1: "-99.152",
      x2: "493.084",
      y2: "-44.0742",
      gradientUnits: "userSpaceOnUse",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#C0A9F0",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 64,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "0.456382",
        "stop-color": "#C0A9F0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 65,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#C0A9F0",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 66,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 56,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("linearGradient", {
      id: "paint2_linear_704_33887",
      x1: "569.905",
      y1: "-344.278",
      x2: "231.663",
      y2: "-178.287",
      gradientUnits: "userSpaceOnUse",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#C0A9F0",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 76,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "0.461891",
        "stop-color": "#C0A9F0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 77,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#C0A9F0",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 78,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 68,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("linearGradient", {
      id: "paint3_linear_704_33887",
      x1: "135.327",
      y1: "231.355",
      x2: "390.196",
      y2: "322.412",
      gradientUnits: "userSpaceOnUse",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#CDF9E8"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 88,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#CDF9E8",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 89,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 80,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("radialGradient", {
      id: "paint4_radial_704_33887",
      cx: "0",
      cy: "0",
      r: "1",
      gradientUnits: "userSpaceOnUse",
      gradientTransform: "translate(190.855 1468) rotate(-104.289) scale(544.271 368.5)",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#DC8DDC"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 99,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#DC8DDC",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 100,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 91,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("radialGradient", {
      id: "paint5_radial_704_33887",
      cx: "0",
      cy: "0",
      r: "1",
      gradientUnits: "userSpaceOnUse",
      gradientTransform: "translate(235.41 1276.58) rotate(-110.889) scale(411.244 519.951)",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#DC8DDC"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 110,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#DC8DDC",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 111,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 102,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B("radialGradient", {
      id: "paint6_radial_704_33887",
      cx: "0",
      cy: "0",
      r: "1",
      gradientUnits: "userSpaceOnUse",
      gradientTransform: "translate(23.9999 1189) rotate(-15.8626) scale(190.245 416.77)",
      children: [/* @__PURE__ */ B("stop", {
        "stop-color": "#EBF3D0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 121,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("stop", {
        offset: "1",
        "stop-color": "#EBF3D0",
        "stop-opacity": "0"
      }, void 0, !1, {
        fileName: pt,
        lineNumber: 122,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: pt,
      lineNumber: 113,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0),
  gradientIds: ["paint0_radial_704_33887", "paint1_linear_704_33887", "paint2_linear_704_33887", "paint3_linear_704_33887", "paint4_radial_704_33887", "paint5_radial_704_33887", "paint6_radial_704_33887"],
  baseColor: "#C2A6F1"
}, _P = ({
  accessors: e,
  data: t,
  lineLabel: n,
  xLabel: r,
  yLabel: i,
  ...o
}) => /* @__PURE__ */ B(Ci, {
  xScale: {
    type: "linear",
    domain: [Math.min(...t.map(e.xAccessor)), Math.max(...t.map(e.xAccessor))],
    zero: !1
  },
  yScale: {
    type: "linear"
  },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  ...o,
  children: [/* @__PURE__ */ B("defs", {
    children: wP
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 160,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B(Qp, {
    id: "gradient-base",
    fill: bP,
    stroke: "#FFFFFF",
    dataKey: n,
    lineProps: {
      stroke: "#fff"
    },
    data: t,
    ...e
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 161,
    columnNumber: 7
  }, void 0), xP.map((a) => /* @__PURE__ */ B(Qp, {
    id: `gradient-${a}`,
    fill: `url(#${a})`,
    lineProps: {
      stroke: "#fff"
    },
    dataKey: n,
    data: t,
    ...e
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 171,
    columnNumber: 9
  }, void 0)), /* @__PURE__ */ B("rect", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    fill: "url(#dim)"
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 181,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B(dg, {
    showVerticalCrosshair: !0,
    style: {
      position: "absolute"
    },
    renderTooltip: ({
      tooltipData: a,
      colorScale: u
    }) => /* @__PURE__ */ B(yP, {
      nearestDatum: a.nearestDatum,
      colorScale: u,
      accessors: e
    }, void 0, !1, {
      fileName: pt,
      lineNumber: 189,
      columnNumber: 11
    }, void 0)
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 183,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: pt,
  lineNumber: 147,
  columnNumber: 5
}, void 0), wT = (e) => {
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
  return /* @__PURE__ */ B(Th, {
    children: (i) => /* @__PURE__ */ B(_P, {
      ...r,
      parentSize: i,
      parentWidth: i.width,
      parentHeight: i.height,
      parentTop: i.top,
      parentLeft: i.left,
      parentRef: i.ref,
      resizeParent: i.resize
    }, void 0, !1, {
      fileName: pt,
      lineNumber: 222,
      columnNumber: 9
    }, void 0)
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 220,
    columnNumber: 5
  }, void 0);
};
var Co = { exports: {} }, za = { exports: {} }, Zp;
function SP() {
  return Zp || (Zp = 1, function(e, t) {
    (function(n, r) {
      r(t, gn);
    })(_i, function(n, r) {
      function i(s, m, y, b, E, R, A) {
        try {
          var j = s[R](A), W = j.value;
        } catch (U) {
          return void y(U);
        }
        j.done ? m(W) : Promise.resolve(W).then(b, E);
      }
      function o(s) {
        return function() {
          var m = this, y = arguments;
          return new Promise(function(b, E) {
            var R = s.apply(m, y);
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
          for (var m = 1; m < arguments.length; m++) {
            var y = arguments[m];
            for (var b in y)
              Object.prototype.hasOwnProperty.call(y, b) && (s[b] = y[b]);
          }
          return s;
        }).apply(this, arguments);
      }
      function u(s, m) {
        if (s == null)
          return {};
        var y, b, E = {}, R = Object.keys(s);
        for (b = 0; b < R.length; b++)
          y = R[b], m.indexOf(y) >= 0 || (E[y] = s[y]);
        return E;
      }
      function f(s) {
        var m = function(y, b) {
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
        return typeof m == "symbol" ? m : String(m);
      }
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      var c = { init: "init" }, h = function(s) {
        var m = s.value;
        return m === void 0 ? "" : m;
      }, p = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, w = { Cell: h, width: 150, minWidth: 0, maxWidth: Number.MAX_SAFE_INTEGER };
      function P() {
        for (var s = arguments.length, m = new Array(s), y = 0; y < s; y++)
          m[y] = arguments[y];
        return m.reduce(function(b, E) {
          var R = E.style, A = E.className;
          return b = a({}, b, {}, u(E, ["style", "className"])), R && (b.style = b.style ? a({}, b.style || {}, {}, R || {}) : R), A && (b.className = b.className ? b.className + " " + A : A), b.className === "" && delete b.className, b;
        }, {});
      }
      var _ = function(s, m) {
        return m === void 0 && (m = {}), function(y) {
          return y === void 0 && (y = {}), [].concat(s, [y]).reduce(function(b, E) {
            return function R(A, j, W) {
              return typeof j == "function" ? R({}, j(A, W)) : Array.isArray(j) ? P.apply(void 0, [A].concat(j)) : P(A, j);
            }(b, E, a({}, m, { userProps: y }));
          }, {});
        };
      }, N = function(s, m, y, b) {
        return y === void 0 && (y = {}), s.reduce(function(E, R) {
          return R(E, y);
        }, m);
      }, I = function(s, m, y) {
        return y === void 0 && (y = {}), s.forEach(function(b) {
          b(m, y);
        });
      };
      function k(s, m, y, b) {
        s.findIndex(function(E) {
          return E.pluginName === y;
        }), m.forEach(function(E) {
          s.findIndex(function(R) {
            return R.pluginName === E;
          });
        });
      }
      function F(s, m) {
        return typeof s == "function" ? s(m) : s;
      }
      function T(s) {
        var m = r.useRef();
        return m.current = s, r.useCallback(function() {
          return m.current;
        }, []);
      }
      var G = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function M(s, m) {
        var y = r.useRef(!1);
        G(function() {
          y.current && s(), y.current = !0;
        }, m);
      }
      function z(s, m, y) {
        return y === void 0 && (y = {}), function(b, E) {
          E === void 0 && (E = {});
          var R = typeof b == "string" ? m[b] : b;
          if (R === void 0)
            throw console.info(m), new Error("Renderer Error \u261D\uFE0F");
          return te(R, a({}, s, { column: m }, y, {}, E));
        };
      }
      function te(s, m) {
        return function(b) {
          return typeof b == "function" && (E = Object.getPrototypeOf(b)).prototype && E.prototype.isReactComponent;
          var E;
        }(y = s) || typeof y == "function" || function(b) {
          return typeof b == "object" && typeof b.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(b.$$typeof.description);
        }(y) ? r.createElement(s, m) : s;
        var y;
      }
      function Q(s, m, y) {
        return y === void 0 && (y = 0), s.map(function(b) {
          return me(b = a({}, b, { parent: m, depth: y })), b.columns && (b.columns = Q(b.columns, b, y + 1)), b;
        });
      }
      function fe(s) {
        return Ue(s, "columns");
      }
      function me(s) {
        var m = s.id, y = s.accessor, b = s.Header;
        if (typeof y == "string") {
          m = m || y;
          var E = y.split(".");
          y = function(R) {
            return function(A, j, W) {
              if (!j)
                return A;
              var U, se = typeof j == "function" ? j : JSON.stringify(j), ie = be.get(se) || function() {
                var oe = function(Y) {
                  return function ne(ge, xe) {
                    if (xe === void 0 && (xe = []), Array.isArray(ge))
                      for (var $e = 0; $e < ge.length; $e += 1)
                        ne(ge[$e], xe);
                    else
                      xe.push(ge);
                    return xe;
                  }(Y).map(function(ne) {
                    return String(ne).replace(".", "_");
                  }).join(".").replace(Ne, ".").replace(Ae, "").split(".");
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
        if (!m && typeof b == "string" && b && (m = b), !m && s.columns)
          throw console.error(s), new Error('A column ID (or unique "Header" value) is required!');
        if (!m)
          throw console.error(s), new Error("A column ID (or string accessor) is required!");
        return Object.assign(s, { id: m, accessor: y }), s;
      }
      function re(s, m) {
        if (!m)
          throw new Error();
        return Object.assign(s, a({ Header: p, Footer: p }, w, {}, m, {}, s)), Object.assign(s, { originalWidth: s.width }), s;
      }
      function ee(s, m, y) {
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
            se && (ie.parent ? oe = a({}, ie.parent, { originalId: ie.parent.id, id: ie.parent.id + "_" + A(), headers: [ie] }, y(ie)) : oe = re(a({ originalId: ie.id + "_placeholder", id: ie.id + "_placeholder_" + A(), placeholderOf: ie, headers: [ie] }, y(ie)), m), Y && Y.originalId === oe.originalId ? Y.headers.push(ie) : U.push(oe)), W.headers.push(ie);
          }), b.push(W), E = U;
        }; E.length; )
          j();
        return b.reverse();
      }
      var be = /* @__PURE__ */ new Map();
      function Oe() {
        for (var s = arguments.length, m = new Array(s), y = 0; y < s; y++)
          m[y] = arguments[y];
        for (var b = 0; b < m.length; b += 1)
          if (m[b] !== void 0)
            return m[b];
      }
      function ut(s) {
        if (typeof s == "function")
          return s;
      }
      function Ue(s, m) {
        var y = [];
        return function b(E) {
          E.forEach(function(R) {
            R[m] ? b(R[m]) : y.push(R);
          });
        }(s), y;
      }
      function st(s, m) {
        var y = m.manualExpandedKey, b = m.expanded, E = m.expandSubRows, R = E === void 0 || E, A = [];
        return s.forEach(function(j) {
          return function W(U, se) {
            se === void 0 && (se = !0), U.isExpanded = U.original && U.original[y] || b[U.id], U.canExpand = U.subRows && !!U.subRows.length, se && A.push(U), U.subRows && U.subRows.length && U.isExpanded && U.subRows.forEach(function(ie) {
              return W(ie, R);
            });
          }(j);
        }), A;
      }
      function lt(s, m, y) {
        return ut(s) || m[s] || y[s] || y.text;
      }
      function dt(s, m, y) {
        return s ? s(m, y) : m === void 0;
      }
      function V() {
        throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.");
      }
      var ue = null, Ne = /\[/g, Ae = /\]/g, Ce = function(s) {
        return a({ role: "table" }, s);
      }, Re = function(s) {
        return a({ role: "rowgroup" }, s);
      }, Te = function(s, m) {
        var y = m.column;
        return a({ key: "header_" + y.id, colSpan: y.totalVisibleHeaderCount, role: "columnheader" }, s);
      }, Be = function(s, m) {
        var y = m.column;
        return a({ key: "footer_" + y.id, colSpan: y.totalVisibleHeaderCount }, s);
      }, Le = function(s, m) {
        return a({ key: "headerGroup_" + m.index, role: "row" }, s);
      }, X = function(s, m) {
        return a({ key: "footerGroup_" + m.index }, s);
      }, ce = function(s, m) {
        return a({ key: "row_" + m.row.id, role: "row" }, s);
      }, Ge = function(s, m) {
        var y = m.cell;
        return a({ key: "cell_" + y.row.id + "_" + y.column.id, role: "cell" }, s);
      };
      function D() {
        return { useOptions: [], stateReducers: [], useControlledState: [], columns: [], columnsDeps: [], allColumns: [], allColumnsDeps: [], accessValue: [], materializedColumns: [], materializedColumnsDeps: [], useInstanceAfterData: [], visibleColumns: [], visibleColumnsDeps: [], headerGroups: [], headerGroupsDeps: [], useInstanceBeforeDimensions: [], useInstance: [], prepareRow: [], getTableProps: [Ce], getTableBodyProps: [Re], getHeaderGroupProps: [Le], getFooterGroupProps: [X], getHeaderProps: [Te], getFooterProps: [Be], getRowProps: [ce], getCellProps: [Ge], useFinalInstance: [] };
      }
      c.resetHiddenColumns = "resetHiddenColumns", c.toggleHideColumn = "toggleHideColumn", c.setHiddenColumns = "setHiddenColumns", c.toggleHideAllColumns = "toggleHideAllColumns";
      var gt = function(s) {
        s.getToggleHiddenProps = [ct], s.getToggleHideAllColumnsProps = [St], s.stateReducers.push(At), s.useInstanceBeforeDimensions.push(Zt), s.headerGroupsDeps.push(function(m, y) {
          var b = y.instance;
          return [].concat(m, [b.state.hiddenColumns]);
        }), s.useInstance.push(sn);
      };
      gt.pluginName = "useColumnVisibility";
      var ct = function(s, m) {
        var y = m.column;
        return [s, { onChange: function(b) {
          y.toggleHidden(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isVisible, title: "Toggle Column Visible" }];
      }, St = function(s, m) {
        var y = m.instance;
        return [s, { onChange: function(b) {
          y.toggleHideAllColumns(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: !y.allColumnsHidden && !y.state.hiddenColumns.length, title: "Toggle All Columns Hidden", indeterminate: !y.allColumnsHidden && y.state.hiddenColumns.length }];
      };
      function At(s, m, y, b) {
        if (m.type === c.init)
          return a({ hiddenColumns: [] }, s);
        if (m.type === c.resetHiddenColumns)
          return a({}, s, { hiddenColumns: b.initialState.hiddenColumns || [] });
        if (m.type === c.toggleHideColumn) {
          var E = (m.value !== void 0 ? m.value : !s.hiddenColumns.includes(m.columnId)) ? [].concat(s.hiddenColumns, [m.columnId]) : s.hiddenColumns.filter(function(R) {
            return R !== m.columnId;
          });
          return a({}, s, { hiddenColumns: E });
        }
        return m.type === c.setHiddenColumns ? a({}, s, { hiddenColumns: F(m.value, s.hiddenColumns) }) : m.type === c.toggleHideAllColumns ? a({}, s, { hiddenColumns: (m.value !== void 0 ? m.value : !s.hiddenColumns.length) ? b.allColumns.map(function(R) {
          return R.id;
        }) : [] }) : void 0;
      }
      function Zt(s) {
        var m = s.headers, y = s.state.hiddenColumns;
        r.useRef(!1).current;
        var b = 0;
        m.forEach(function(E) {
          return b += function R(A, j) {
            A.isVisible = j && !y.includes(A.id);
            var W = 0;
            return A.headers && A.headers.length ? A.headers.forEach(function(U) {
              return W += R(U, A.isVisible);
            }) : W = A.isVisible ? 1 : 0, A.totalVisibleHeaderCount = W, W;
          }(E, !0);
        });
      }
      function sn(s) {
        var m = s.columns, y = s.flatHeaders, b = s.dispatch, E = s.allColumns, R = s.getHooks, A = s.state.hiddenColumns, j = s.autoResetHiddenColumns, W = j === void 0 || j, U = T(s), se = E.length === A.length, ie = r.useCallback(function(xe, $e) {
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
        var ge = T(W);
        M(function() {
          ge() && b({ type: c.resetHiddenColumns });
        }, [b, m]), Object.assign(s, { allColumnsHidden: se, toggleHideColumn: ie, setHiddenColumns: oe, toggleHideAllColumns: Y, getToggleHideAllColumnsProps: ne });
      }
      var bn = {}, wn = {}, xn = function(s, m, y) {
        return s;
      }, Ln = function(s, m) {
        return s.subRows || [];
      }, ir = function(s, m, y) {
        return "" + (y ? [y.id, m].join(".") : m);
      }, Gn = function(s) {
        return s;
      };
      function _n(s) {
        var m = s.initialState, y = m === void 0 ? bn : m, b = s.defaultColumn, E = b === void 0 ? wn : b, R = s.getSubRows, A = R === void 0 ? Ln : R, j = s.getRowId, W = j === void 0 ? ir : j, U = s.stateReducer, se = U === void 0 ? xn : U, ie = s.useControlledState, oe = ie === void 0 ? Gn : ie;
        return a({}, u(s, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]), { initialState: y, defaultColumn: E, getSubRows: A, getRowId: W, stateReducer: se, useControlledState: oe });
      }
      function Yt(s, m) {
        m === void 0 && (m = 0);
        var y = 0, b = 0, E = 0, R = 0;
        return s.forEach(function(A) {
          var j = A.headers;
          if (A.totalLeft = m, j && j.length) {
            var W = Yt(j, m), U = W[0], se = W[1], ie = W[2], oe = W[3];
            A.totalMinWidth = U, A.totalWidth = se, A.totalMaxWidth = ie, A.totalFlexWidth = oe;
          } else
            A.totalMinWidth = A.minWidth, A.totalWidth = Math.min(Math.max(A.minWidth, A.width), A.maxWidth), A.totalMaxWidth = A.maxWidth, A.totalFlexWidth = A.canResize ? A.totalWidth : 0;
          A.isVisible && (m += A.totalWidth, y += A.totalMinWidth, b += A.totalWidth, E += A.totalMaxWidth, R += A.totalFlexWidth);
        }), [y, b, E, R];
      }
      function On(s) {
        var m = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.column, A = s.getRowId, j = s.getSubRows, W = s.accessValueHooks, U = s.getInstance;
        m.forEach(function(se, ie) {
          return function oe(Y, ne, ge, xe, $e) {
            ge === void 0 && (ge = 0);
            var Je = Y, Fe = A(Y, ne, xe), le = E[Fe];
            if (le)
              le.subRows && le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, ge + 1, le);
              });
            else if ((le = { id: Fe, original: Je, index: ne, depth: ge, cells: [{}] }).cells.map = V, le.cells.filter = V, le.cells.forEach = V, le.cells[0].getCellProps = V, le.values = {}, $e.push(le), b.push(le), E[Fe] = le, le.originalSubRows = j(Y, ne), le.originalSubRows) {
              var Qe = [];
              le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, ge + 1, le, Qe);
              }), le.subRows = Qe;
            }
            R.accessor && (le.values[R.id] = R.accessor(Y, ne, le, $e, m)), le.values[R.id] = N(W, le.values[R.id], { row: le, column: R, instance: U() });
          }(se, ie, 0, void 0, y);
        });
      }
      c.resetExpanded = "resetExpanded", c.toggleRowExpanded = "toggleRowExpanded", c.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var or = function(s) {
        s.getToggleAllRowsExpandedProps = [yr], s.getToggleRowExpandedProps = [br], s.stateReducers.push(ar), s.useInstance.push(wr), s.prepareRow.push(jn);
      };
      or.pluginName = "useExpanded";
      var yr = function(s, m) {
        var y = m.instance;
        return [s, { onClick: function(b) {
          y.toggleAllRowsExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle All Rows Expanded" }];
      }, br = function(s, m) {
        var y = m.row;
        return [s, { onClick: function() {
          y.toggleRowExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle Row Expanded" }];
      };
      function ar(s, m, y, b) {
        if (m.type === c.init)
          return a({ expanded: {} }, s);
        if (m.type === c.resetExpanded)
          return a({}, s, { expanded: b.initialState.expanded || {} });
        if (m.type === c.toggleAllRowsExpanded) {
          var E = m.value, R = b.rowsById, A = Object.keys(R).length === Object.keys(s.expanded).length;
          if (E !== void 0 ? E : !A) {
            var j = {};
            return Object.keys(R).forEach(function(ne) {
              j[ne] = !0;
            }), a({}, s, { expanded: j });
          }
          return a({}, s, { expanded: {} });
        }
        if (m.type === c.toggleRowExpanded) {
          var W, U = m.id, se = m.value, ie = s.expanded[U], oe = se !== void 0 ? se : !ie;
          if (!ie && oe)
            return a({}, s, { expanded: a({}, s.expanded, (W = {}, W[U] = !0, W)) });
          if (ie && !oe) {
            var Y = s.expanded;
            return Y[U], a({}, s, { expanded: u(Y, [U].map(f)) });
          }
          return s;
        }
      }
      function wr(s) {
        var m = s.data, y = s.rows, b = s.rowsById, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.paginateExpandedRows, j = A === void 0 || A, W = s.expandSubRows, U = W === void 0 || W, se = s.autoResetExpanded, ie = se === void 0 || se, oe = s.getHooks, Y = s.plugins, ne = s.state.expanded, ge = s.dispatch;
        k(Y, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var xe = T(ie), $e = Boolean(Object.keys(b).length && Object.keys(ne).length);
        $e && Object.keys(b).some(function(ft) {
          return !ne[ft];
        }) && ($e = !1), M(function() {
          xe() && ge({ type: c.resetExpanded });
        }, [ge, m]);
        var Je = r.useCallback(function(ft, je) {
          ge({ type: c.toggleRowExpanded, id: ft, value: je });
        }, [ge]), Fe = r.useCallback(function(ft) {
          return ge({ type: c.toggleAllRowsExpanded, value: ft });
        }, [ge]), le = r.useMemo(function() {
          return j ? st(y, { manualExpandedKey: R, expanded: ne, expandSubRows: U }) : y;
        }, [j, y, R, ne, U]), Qe = r.useMemo(function() {
          return function(ft) {
            var je = 0;
            return Object.keys(ft).forEach(function(Ve) {
              var bt = Ve.split(".");
              je = Math.max(je, bt.length);
            }), je;
          }(ne);
        }, [ne]), Ee = T(s), Ye = _(oe().getToggleAllRowsExpandedProps, { instance: Ee() });
        Object.assign(s, { preExpandedRows: y, expandedRows: le, rows: le, expandedDepth: Qe, isAllRowsExpanded: $e, toggleRowExpanded: Je, toggleAllRowsExpanded: Fe, getToggleAllRowsExpandedProps: Ye });
      }
      function jn(s, m) {
        var y = m.instance.getHooks, b = m.instance;
        s.toggleRowExpanded = function(E) {
          return b.toggleRowExpanded(s.id, E);
        }, s.getToggleRowExpandedProps = _(y().getToggleRowExpandedProps, { instance: b, row: s });
      }
      var Hn = function(s, m, y) {
        return s = s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return String(R).toLowerCase().includes(String(y).toLowerCase());
          });
        });
      };
      Hn.autoRemove = function(s) {
        return !s;
      };
      var ln = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R).toLowerCase() === String(y).toLowerCase();
          });
        });
      };
      ln.autoRemove = function(s) {
        return !s;
      };
      var Sn = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R) === String(y);
          });
        });
      };
      Sn.autoRemove = function(s) {
        return !s;
      };
      var An = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            return b.values[E].includes(y);
          });
        });
      };
      An.autoRemove = function(s) {
        return !s || !s.length;
      };
      var kn = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.every(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      kn.autoRemove = function(s) {
        return !s || !s.length;
      };
      var ur = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.some(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      ur.autoRemove = function(s) {
        return !s || !s.length;
      };
      var $n = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            var R = b.values[E];
            return y.includes(R);
          });
        });
      };
      $n.autoRemove = function(s) {
        return !s || !s.length;
      };
      var sr = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            return b.values[E] === y;
          });
        });
      };
      sr.autoRemove = function(s) {
        return s === void 0;
      };
      var Wn = function(s, m, y) {
        return s.filter(function(b) {
          return m.some(function(E) {
            return b.values[E] == y;
          });
        });
      };
      Wn.autoRemove = function(s) {
        return s == null;
      };
      var Un = function(s, m, y) {
        var b = y || [], E = b[0], R = b[1];
        if ((E = typeof E == "number" ? E : -1 / 0) > (R = typeof R == "number" ? R : 1 / 0)) {
          var A = E;
          E = R, R = A;
        }
        return s.filter(function(j) {
          return m.some(function(W) {
            var U = j.values[W];
            return U >= E && U <= R;
          });
        });
      };
      Un.autoRemove = function(s) {
        return !s || typeof s[0] != "number" && typeof s[1] != "number";
      };
      var Rn = Object.freeze({ __proto__: null, text: Hn, exactText: ln, exactTextCase: Sn, includes: An, includesAll: kn, includesSome: ur, includesValue: $n, exact: sr, equals: Wn, between: Un });
      c.resetFilters = "resetFilters", c.setFilter = "setFilter", c.setAllFilters = "setAllFilters";
      var xr = function(s) {
        s.stateReducers.push(Gt), s.useInstance.push(Xt);
      };
      function Gt(s, m, y, b) {
        if (m.type === c.init)
          return a({ filters: [] }, s);
        if (m.type === c.resetFilters)
          return a({}, s, { filters: b.initialState.filters || [] });
        if (m.type === c.setFilter) {
          var E = m.columnId, R = m.filterValue, A = b.allColumns, j = b.filterTypes, W = A.find(function(ge) {
            return ge.id === E;
          });
          if (!W)
            throw new Error("React-Table: Could not find a column with id: " + E);
          var U = lt(W.filter, j || {}, Rn), se = s.filters.find(function(ge) {
            return ge.id === E;
          }), ie = F(R, se && se.value);
          return dt(U.autoRemove, ie, W) ? a({}, s, { filters: s.filters.filter(function(ge) {
            return ge.id !== E;
          }) }) : a({}, s, se ? { filters: s.filters.map(function(ge) {
            return ge.id === E ? { id: E, value: ie } : ge;
          }) } : { filters: [].concat(s.filters, [{ id: E, value: ie }]) });
        }
        if (m.type === c.setAllFilters) {
          var oe = m.filters, Y = b.allColumns, ne = b.filterTypes;
          return a({}, s, { filters: F(oe, s.filters).filter(function(ge) {
            var xe = Y.find(function($e) {
              return $e.id === ge.id;
            });
            return !dt(lt(xe.filter, ne || {}, Rn).autoRemove, ge.value, xe);
          }) });
        }
      }
      function Xt(s) {
        var m = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.manualFilters, W = s.defaultCanFilter, U = W !== void 0 && W, se = s.disableFilters, ie = s.state.filters, oe = s.dispatch, Y = s.autoResetFilters, ne = Y === void 0 || Y, ge = r.useCallback(function(Ee, Ye) {
          oe({ type: c.setFilter, columnId: Ee, filterValue: Ye });
        }, [oe]), xe = r.useCallback(function(Ee) {
          oe({ type: c.setAllFilters, filters: Ee });
        }, [oe]);
        R.forEach(function(Ee) {
          var Ye = Ee.id, ft = Ee.accessor, je = Ee.defaultCanFilter, Ve = Ee.disableFilters;
          Ee.canFilter = ft ? Oe(Ve !== !0 && void 0, se !== !0 && void 0, !0) : Oe(je, U, !1), Ee.setFilter = function(Ke) {
            return ge(Ee.id, Ke);
          };
          var bt = ie.find(function(Ke) {
            return Ke.id === Ye;
          });
          Ee.filterValue = bt && bt.value;
        });
        var $e = r.useMemo(function() {
          if (j || !ie.length)
            return [y, b, E];
          var Ee = [], Ye = {};
          return [function ft(je, Ve) {
            Ve === void 0 && (Ve = 0);
            var bt = je;
            return (bt = ie.reduce(function(Ke, vt) {
              var l = vt.id, d = vt.value, g = R.find(function(S) {
                return S.id === l;
              });
              if (!g)
                return Ke;
              Ve === 0 && (g.preFilteredRows = Ke);
              var v = lt(g.filter, A || {}, Rn);
              return v ? (g.filteredRows = v(Ke, [l], d), g.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + g.id + "."), Ke);
            }, je)).forEach(function(Ke) {
              Ee.push(Ke), Ye[Ke.id] = Ke, Ke.subRows && (Ke.subRows = Ke.subRows && Ke.subRows.length > 0 ? ft(Ke.subRows, Ve + 1) : Ke.subRows);
            }), bt;
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
        var Qe = T(ne);
        M(function() {
          Qe() && oe({ type: c.resetFilters });
        }, [oe, j ? null : m]), Object.assign(s, { preFilteredRows: y, preFilteredFlatRows: b, preFilteredRowsById: E, filteredRows: Je, filteredFlatRows: Fe, filteredRowsById: le, rows: Je, flatRows: Fe, rowsById: le, setFilter: ge, setAllFilters: xe });
      }
      xr.pluginName = "useFilters", c.resetGlobalFilter = "resetGlobalFilter", c.setGlobalFilter = "setGlobalFilter";
      var O = function(s) {
        s.stateReducers.push(J), s.useInstance.push(he);
      };
      function J(s, m, y, b) {
        if (m.type === c.resetGlobalFilter)
          return a({}, s, { globalFilter: b.initialState.globalFilter || void 0 });
        if (m.type === c.setGlobalFilter) {
          var E = m.filterValue, R = b.userFilterTypes, A = lt(b.globalFilter, R || {}, Rn), j = F(E, s.globalFilter);
          return dt(A.autoRemove, j) ? (s.globalFilter, u(s, ["globalFilter"])) : a({}, s, { globalFilter: j });
        }
      }
      function he(s) {
        var m = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.globalFilter, W = s.manualGlobalFilter, U = s.state.globalFilter, se = s.dispatch, ie = s.autoResetGlobalFilter, oe = ie === void 0 || ie, Y = s.disableGlobalFilter, ne = r.useCallback(function(le) {
          se({ type: c.setGlobalFilter, filterValue: le });
        }, [se]), ge = r.useMemo(function() {
          if (W || U === void 0)
            return [y, b, E];
          var le = [], Qe = {}, Ee = lt(j, A || {}, Rn);
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
        }, [W, U, j, A, R, y, b, E, Y]), xe = ge[0], $e = ge[1], Je = ge[2], Fe = T(oe);
        M(function() {
          Fe() && se({ type: c.resetGlobalFilter });
        }, [se, W ? null : m]), Object.assign(s, { preGlobalFilteredRows: y, preGlobalFilteredFlatRows: b, preGlobalFilteredRowsById: E, globalFilteredRows: xe, globalFilteredFlatRows: $e, globalFilteredRowsById: Je, rows: xe, flatRows: $e, rowsById: Je, setGlobalFilter: ne, disableGlobalFilter: Y });
      }
      function ze(s, m) {
        return m.reduce(function(y, b) {
          return y + (typeof b == "number" ? b : 0);
        }, 0);
      }
      O.pluginName = "useGlobalFilter";
      var ht = Object.freeze({ __proto__: null, sum: ze, min: function(s) {
        var m = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (m = Math.min(m, y));
        }), m;
      }, max: function(s) {
        var m = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (m = Math.max(m, y));
        }), m;
      }, minMax: function(s) {
        var m = s[0] || 0, y = s[0] || 0;
        return s.forEach(function(b) {
          typeof b == "number" && (m = Math.min(m, b), y = Math.max(y, b));
        }), m + ".." + y;
      }, average: function(s) {
        return ze(0, s) / s.length;
      }, median: function(s) {
        if (!s.length)
          return null;
        var m = Math.floor(s.length / 2), y = [].concat(s).sort(function(b, E) {
          return b - E;
        });
        return s.length % 2 != 0 ? y[m] : (y[m - 1] + y[m]) / 2;
      }, unique: function(s) {
        return Array.from(new Set(s).values());
      }, uniqueCount: function(s) {
        return new Set(s).size;
      }, count: function(s) {
        return s.length;
      } }), yt = [], ot = {};
      c.resetGroupBy = "resetGroupBy", c.setGroupBy = "setGroupBy", c.toggleGroupBy = "toggleGroupBy";
      var rt = function(s) {
        s.getGroupByToggleProps = [kt], s.stateReducers.push(Nt), s.visibleColumnsDeps.push(function(m, y) {
          var b = y.instance;
          return [].concat(m, [b.state.groupBy]);
        }), s.visibleColumns.push(Mt), s.useInstance.push(Vn), s.prepareRow.push(Hr);
      };
      rt.pluginName = "useGroupBy";
      var kt = function(s, m) {
        var y = m.header;
        return [s, { onClick: y.canGroupBy ? function(b) {
          b.persist(), y.toggleGroupBy();
        } : void 0, style: { cursor: y.canGroupBy ? "pointer" : void 0 }, title: "Toggle GroupBy" }];
      };
      function Nt(s, m, y, b) {
        if (m.type === c.init)
          return a({ groupBy: [] }, s);
        if (m.type === c.resetGroupBy)
          return a({}, s, { groupBy: b.initialState.groupBy || [] });
        if (m.type === c.setGroupBy)
          return a({}, s, { groupBy: m.value });
        if (m.type === c.toggleGroupBy) {
          var E = m.columnId, R = m.value, A = R !== void 0 ? R : !s.groupBy.includes(E);
          return a({}, s, A ? { groupBy: [].concat(s.groupBy, [E]) } : { groupBy: s.groupBy.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function Mt(s, m) {
        var y = m.instance.state.groupBy, b = y.map(function(R) {
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
      var hn = {};
      function Vn(s) {
        var m = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.flatHeaders, j = s.groupByFn, W = j === void 0 ? cn : j, U = s.manualGroupBy, se = s.aggregations, ie = se === void 0 ? hn : se, oe = s.plugins, Y = s.state.groupBy, ne = s.dispatch, ge = s.autoResetGroupBy, xe = ge === void 0 || ge, $e = s.disableGroupBy, Je = s.defaultCanGroupBy, Fe = s.getHooks;
        k(oe, ["useColumnOrder", "useFilters"], "useGroupBy");
        var le = T(s);
        R.forEach(function(g) {
          var v = g.accessor, S = g.defaultGroupBy, C = g.disableGroupBy;
          g.canGroupBy = v ? Oe(g.canGroupBy, C !== !0 && void 0, $e !== !0 && void 0, !0) : Oe(g.canGroupBy, S, Je, !1), g.canGroupBy && (g.toggleGroupBy = function() {
            return s.toggleGroupBy(g.id);
          }), g.Aggregated = g.Aggregated || g.Cell;
        });
        var Qe = r.useCallback(function(g, v) {
          ne({ type: c.toggleGroupBy, columnId: g, value: v });
        }, [ne]), Ee = r.useCallback(function(g) {
          ne({ type: c.setGroupBy, value: g });
        }, [ne]);
        A.forEach(function(g) {
          g.getGroupByToggleProps = _(Fe().getGroupByToggleProps, { instance: le(), header: g });
        });
        var Ye = r.useMemo(function() {
          if (U || !Y.length)
            return [y, b, E, yt, ot, b, E];
          var g = Y.filter(function(q) {
            return R.find(function(pe) {
              return pe.id === q;
            });
          }), v = [], S = {}, C = [], x = {}, $ = [], L = {}, H = function q(pe, Z, ae) {
            if (Z === void 0 && (Z = 0), Z === g.length)
              return pe.map(function(Pe) {
                return a({}, Pe, { depth: Z });
              });
            var ve = g[Z], K = W(pe, ve);
            return Object.entries(K).map(function(Pe, De) {
              var We = Pe[0], we = Pe[1], Ze = ve + ":" + We, it = q(we, Z + 1, Ze = ae ? ae + ">" + Ze : Ze), _e = Z ? Ue(we, "leafRows") : we, ye = function(Ie, et, tt) {
                var Rt = {};
                return R.forEach(function(Me) {
                  if (g.includes(Me.id))
                    Rt[Me.id] = et[0] ? et[0].values[Me.id] : null;
                  else {
                    var Dt = typeof Me.aggregate == "function" ? Me.aggregate : ie[Me.aggregate] || ht[Me.aggregate];
                    if (Dt) {
                      var nt = et.map(function(Xe) {
                        return Xe.values[Me.id];
                      }), qe = Ie.map(function(Xe) {
                        var Tt = Xe.values[Me.id];
                        if (!tt && Me.aggregateValue) {
                          var jt = typeof Me.aggregateValue == "function" ? Me.aggregateValue : ie[Me.aggregateValue] || ht[Me.aggregateValue];
                          if (!jt)
                            throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                          Tt = jt(Tt, Xe, Me);
                        }
                        return Tt;
                      });
                      Rt[Me.id] = Dt(qe, nt);
                    } else {
                      if (Me.aggregate)
                        throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregate option for column listed above");
                      Rt[Me.id] = null;
                    }
                  }
                }), Rt;
              }(_e, we, Z), Se = { id: Ze, isGrouped: !0, groupByID: ve, groupByVal: We, values: ye, subRows: it, leafRows: _e, depth: Z, index: De };
              return it.forEach(function(Ie) {
                v.push(Ie), S[Ie.id] = Ie, Ie.isGrouped ? (C.push(Ie), x[Ie.id] = Ie) : ($.push(Ie), L[Ie.id] = Ie);
              }), Se;
            });
          }(y);
          return H.forEach(function(q) {
            v.push(q), S[q.id] = q, q.isGrouped ? (C.push(q), x[q.id] = q) : ($.push(q), L[q.id] = q);
          }), [H, v, S, C, x, $, L];
        }, [U, Y, y, b, E, R, ie, W]), ft = Ye[0], je = Ye[1], Ve = Ye[2], bt = Ye[3], Ke = Ye[4], vt = Ye[5], l = Ye[6], d = T(xe);
        M(function() {
          d() && ne({ type: c.resetGroupBy });
        }, [ne, U ? null : m]), Object.assign(s, { preGroupedRows: y, preGroupedFlatRow: b, preGroupedRowsById: E, groupedRows: ft, groupedFlatRows: je, groupedRowsById: Ve, onlyGroupedFlatRows: bt, onlyGroupedRowsById: Ke, nonGroupedFlatRows: vt, nonGroupedRowsById: l, rows: ft, flatRows: je, rowsById: Ve, toggleGroupBy: Qe, setGroupBy: Ee });
      }
      function Hr(s) {
        s.allCells.forEach(function(m) {
          var y;
          m.isGrouped = m.column.isGrouped && m.column.id === s.groupByID, m.isPlaceholder = !m.isGrouped && m.column.isGrouped, m.isAggregated = !m.isGrouped && !m.isPlaceholder && ((y = s.subRows) == null ? void 0 : y.length);
        });
      }
      function cn(s, m) {
        return s.reduce(function(y, b, E) {
          var R = "" + b.values[m];
          return y[R] = Array.isArray(y[R]) ? y[R] : [], y[R].push(b), y;
        }, {});
      }
      var na = /([0-9]+)/gm;
      function hi(s, m) {
        return s === m ? 0 : s > m ? 1 : -1;
      }
      function Wr(s, m, y) {
        return [s.values[y], m.values[y]];
      }
      function ra(s) {
        return typeof s == "number" ? isNaN(s) || s === 1 / 0 || s === -1 / 0 ? "" : String(s) : typeof s == "string" ? s : "";
      }
      var Uu = Object.freeze({ __proto__: null, alphanumeric: function(s, m, y) {
        var b = Wr(s, m, y), E = b[0], R = b[1];
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
      }, datetime: function(s, m, y) {
        var b = Wr(s, m, y), E = b[0], R = b[1];
        return hi(E = E.getTime(), R = R.getTime());
      }, basic: function(s, m, y) {
        var b = Wr(s, m, y);
        return hi(b[0], b[1]);
      }, string: function(s, m, y) {
        var b = Wr(s, m, y), E = b[0], R = b[1];
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
      }, number: function(s, m, y) {
        var b = Wr(s, m, y), E = b[0], R = b[1], A = /[^0-9.]/gi;
        return hi(E = Number(String(E).replace(A, "")), R = Number(String(R).replace(A, "")));
      } });
      c.resetSortBy = "resetSortBy", c.setSortBy = "setSortBy", c.toggleSortBy = "toggleSortBy", c.clearSortBy = "clearSortBy", w.sortType = "alphanumeric", w.sortDescFirst = !1;
      var ia = function(s) {
        s.getSortByToggleProps = [Vu], s.stateReducers.push(qu), s.useInstance.push(Yu);
      };
      ia.pluginName = "useSortBy";
      var Vu = function(s, m) {
        var y = m.instance, b = m.column, E = y.isMultiSortEvent, R = E === void 0 ? function(A) {
          return A.shiftKey;
        } : E;
        return [s, { onClick: b.canSort ? function(A) {
          A.persist(), b.toggleSortBy(void 0, !y.disableMultiSort && R(A));
        } : void 0, style: { cursor: b.canSort ? "pointer" : void 0 }, title: b.canSort ? "Toggle SortBy" : void 0 }];
      };
      function qu(s, m, y, b) {
        if (m.type === c.init)
          return a({ sortBy: [] }, s);
        if (m.type === c.resetSortBy)
          return a({}, s, { sortBy: b.initialState.sortBy || [] });
        if (m.type === c.clearSortBy)
          return a({}, s, { sortBy: s.sortBy.filter(function(le) {
            return le.id !== m.columnId;
          }) });
        if (m.type === c.setSortBy)
          return a({}, s, { sortBy: m.sortBy });
        if (m.type === c.toggleSortBy) {
          var E, R = m.columnId, A = m.desc, j = m.multi, W = b.allColumns, U = b.disableMultiSort, se = b.disableSortRemove, ie = b.disableMultiRemove, oe = b.maxMultiSortColCount, Y = oe === void 0 ? Number.MAX_SAFE_INTEGER : oe, ne = s.sortBy, ge = W.find(function(le) {
            return le.id === R;
          }).sortDescFirst, xe = ne.find(function(le) {
            return le.id === R;
          }), $e = ne.findIndex(function(le) {
            return le.id === R;
          }), Je = A != null, Fe = [];
          return (E = !U && j ? xe ? "toggle" : "add" : $e !== ne.length - 1 || ne.length !== 1 ? "replace" : xe ? "toggle" : "replace") != "toggle" || se || Je || j && ie || !(xe && xe.desc && !ge || !xe.desc && ge) || (E = "remove"), E === "replace" ? Fe = [{ id: R, desc: Je ? A : ge }] : E === "add" ? (Fe = [].concat(ne, [{ id: R, desc: Je ? A : ge }])).splice(0, Fe.length - Y) : E === "toggle" ? Fe = ne.map(function(le) {
            return le.id === R ? a({}, le, { desc: Je ? A : !xe.desc }) : le;
          }) : E === "remove" && (Fe = ne.filter(function(le) {
            return le.id !== R;
          })), a({}, s, { sortBy: Fe });
        }
      }
      function Yu(s) {
        var m = s.data, y = s.rows, b = s.flatRows, E = s.allColumns, R = s.orderByFn, A = R === void 0 ? oa : R, j = s.sortTypes, W = s.manualSortBy, U = s.defaultCanSort, se = s.disableSortBy, ie = s.flatHeaders, oe = s.state.sortBy, Y = s.dispatch, ne = s.plugins, ge = s.getHooks, xe = s.autoResetSortBy, $e = xe === void 0 || xe;
        k(ne, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var Je = r.useCallback(function(je) {
          Y({ type: c.setSortBy, sortBy: je });
        }, [Y]), Fe = r.useCallback(function(je, Ve, bt) {
          Y({ type: c.toggleSortBy, columnId: je, desc: Ve, multi: bt });
        }, [Y]), le = T(s);
        ie.forEach(function(je) {
          var Ve = je.accessor, bt = je.canSort, Ke = je.disableSortBy, vt = je.id, l = Ve ? Oe(Ke !== !0 && void 0, se !== !0 && void 0, !0) : Oe(U, bt, !1);
          je.canSort = l, je.canSort && (je.toggleSortBy = function(g, v) {
            return Fe(je.id, g, v);
          }, je.clearSortBy = function() {
            Y({ type: c.clearSortBy, columnId: je.id });
          }), je.getSortByToggleProps = _(ge().getSortByToggleProps, { instance: le(), column: je });
          var d = oe.find(function(g) {
            return g.id === vt;
          });
          je.isSorted = !!d, je.sortedIndex = oe.findIndex(function(g) {
            return g.id === vt;
          }), je.isSortedDesc = je.isSorted ? d.desc : void 0;
        });
        var Qe = r.useMemo(function() {
          if (W || !oe.length)
            return [y, b];
          var je = [], Ve = oe.filter(function(bt) {
            return E.find(function(Ke) {
              return Ke.id === bt.id;
            });
          });
          return [function bt(Ke) {
            var vt = A(Ke, Ve.map(function(l) {
              var d = E.find(function(S) {
                return S.id === l.id;
              });
              if (!d)
                throw new Error("React-Table: Could not find a column with id: " + l.id + " while sorting");
              var g = d.sortType, v = ut(g) || (j || {})[g] || Uu[g];
              if (!v)
                throw new Error("React-Table: Could not find a valid sortType of '" + g + "' for column '" + l.id + "'.");
              return function(S, C) {
                return v(S, C, l.id, l.desc);
              };
            }), Ve.map(function(l) {
              var d = E.find(function(g) {
                return g.id === l.id;
              });
              return d && d.sortInverted ? l.desc : !l.desc;
            }));
            return vt.forEach(function(l) {
              je.push(l), l.subRows && l.subRows.length !== 0 && (l.subRows = bt(l.subRows));
            }), vt;
          }(y), je];
        }, [W, oe, y, b, E, A, j]), Ee = Qe[0], Ye = Qe[1], ft = T($e);
        M(function() {
          ft() && Y({ type: c.resetSortBy });
        }, [W ? null : m]), Object.assign(s, { preSortedRows: y, preSortedFlatRows: b, sortedRows: Ee, sortedFlatRows: Ye, rows: Ee, flatRows: Ye, setSortBy: Je, toggleSortBy: Fe });
      }
      function oa(s, m, y) {
        return [].concat(s).sort(function(b, E) {
          for (var R = 0; R < m.length; R += 1) {
            var A = m[R], j = y[R] === !1 || y[R] === "desc", W = A(b, E);
            if (W !== 0)
              return j ? -W : W;
          }
          return y[0] ? b.index - E.index : E.index - b.index;
        });
      }
      c.resetPage = "resetPage", c.gotoPage = "gotoPage", c.setPageSize = "setPageSize";
      var qi = function(s) {
        s.stateReducers.push(Xu), s.useInstance.push(Ku);
      };
      function Xu(s, m, y, b) {
        if (m.type === c.init)
          return a({ pageSize: 10, pageIndex: 0 }, s);
        if (m.type === c.resetPage)
          return a({}, s, { pageIndex: b.initialState.pageIndex || 0 });
        if (m.type === c.gotoPage) {
          var E = b.pageCount, R = b.page, A = F(m.pageIndex, s.pageIndex), j = !1;
          return A > s.pageIndex ? j = E === -1 ? R.length >= s.pageSize : A < E : A < s.pageIndex && (j = A > -1), j ? a({}, s, { pageIndex: A }) : s;
        }
        if (m.type === c.setPageSize) {
          var W = m.pageSize, U = s.pageSize * s.pageIndex;
          return a({}, s, { pageIndex: Math.floor(U / W), pageSize: W });
        }
      }
      function Ku(s) {
        var m = s.rows, y = s.autoResetPage, b = y === void 0 || y, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.plugins, j = s.pageCount, W = s.paginateExpandedRows, U = W === void 0 || W, se = s.expandSubRows, ie = se === void 0 || se, oe = s.state, Y = oe.pageSize, ne = oe.pageIndex, ge = oe.expanded, xe = oe.globalFilter, $e = oe.filters, Je = oe.groupBy, Fe = oe.sortBy, le = s.dispatch, Qe = s.data, Ee = s.manualPagination;
        k(A, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var Ye = T(b);
        M(function() {
          Ye() && le({ type: c.resetPage });
        }, [le, Ee ? null : Qe, xe, $e, Je, Fe]);
        var ft = Ee ? j : Math.ceil(m.length / Y), je = r.useMemo(function() {
          return ft > 0 ? [].concat(new Array(ft)).fill(null).map(function(v, S) {
            return S;
          }) : [];
        }, [ft]), Ve = r.useMemo(function() {
          var v;
          if (Ee)
            v = m;
          else {
            var S = Y * ne, C = S + Y;
            v = m.slice(S, C);
          }
          return U ? v : st(v, { manualExpandedKey: R, expanded: ge, expandSubRows: ie });
        }, [ie, ge, R, Ee, ne, Y, U, m]), bt = ne > 0, Ke = ft === -1 ? Ve.length >= Y : ne < ft - 1, vt = r.useCallback(function(v) {
          le({ type: c.gotoPage, pageIndex: v });
        }, [le]), l = r.useCallback(function() {
          return vt(function(v) {
            return v - 1;
          });
        }, [vt]), d = r.useCallback(function() {
          return vt(function(v) {
            return v + 1;
          });
        }, [vt]), g = r.useCallback(function(v) {
          le({ type: c.setPageSize, pageSize: v });
        }, [le]);
        Object.assign(s, { pageOptions: je, pageCount: ft, page: Ve, canPreviousPage: bt, canNextPage: Ke, gotoPage: vt, previousPage: l, nextPage: d, setPageSize: g });
      }
      qi.pluginName = "usePagination", c.resetPivot = "resetPivot", c.togglePivot = "togglePivot";
      var Yi = function(s) {
        s.getPivotToggleProps = [Qu], s.stateReducers.push(Zu), s.useInstanceAfterData.push(Ju), s.allColumns.push(es), s.accessValue.push(ts), s.materializedColumns.push(ua), s.materializedColumnsDeps.push(sa), s.visibleColumns.push(ns), s.visibleColumnsDeps.push(rs), s.useInstance.push(is), s.prepareRow.push(os);
      };
      Yi.pluginName = "usePivotColumns";
      var aa = [], Qu = function(s, m) {
        var y = m.header;
        return [s, { onClick: y.canPivot ? function(b) {
          b.persist(), y.togglePivot();
        } : void 0, style: { cursor: y.canPivot ? "pointer" : void 0 }, title: "Toggle Pivot" }];
      };
      function Zu(s, m, y, b) {
        if (m.type === c.init)
          return a({ pivotColumns: aa }, s);
        if (m.type === c.resetPivot)
          return a({}, s, { pivotColumns: b.initialState.pivotColumns || aa });
        if (m.type === c.togglePivot) {
          var E = m.columnId, R = m.value, A = R !== void 0 ? R : !s.pivotColumns.includes(E);
          return a({}, s, A ? { pivotColumns: [].concat(s.pivotColumns, [E]) } : { pivotColumns: s.pivotColumns.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function Ju(s) {
        s.allColumns.forEach(function(m) {
          m.isPivotSource = s.state.pivotColumns.includes(m.id);
        });
      }
      function es(s, m) {
        var y = m.instance;
        return s.forEach(function(b) {
          b.isPivotSource = y.state.pivotColumns.includes(b.id), b.uniqueValues = /* @__PURE__ */ new Set();
        }), s;
      }
      function ts(s, m) {
        var y = m.column;
        return y.uniqueValues && s !== void 0 && y.uniqueValues.add(s), s;
      }
      function ua(s, m) {
        var y = m.instance, b = y.allColumns, E = y.state;
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
            return ne.columns = W(U + 1, ne, [].concat(ie, [function(ge) {
              return ge.values[oe.id] === Y;
            }])), ne;
          }) : A.map(function(Y) {
            return a({}, Y, { canPivot: !1, isPivoted: !0, parent: se, depth: U, id: "" + (se ? se.id + "." + Y.id : Y.id), accessor: function(ne, ge, xe) {
              if (ie.every(function($e) {
                return $e(xe);
              }))
                return xe.values[Y.id];
            } });
          });
        }());
        return [].concat(s, j);
      }
      function sa(s, m) {
        var y = m.instance.state, b = y.pivotColumns, E = y.groupBy;
        return [].concat(s, [b, E]);
      }
      function ns(s, m) {
        var y = m.instance.state;
        return s = s.filter(function(b) {
          return !b.isPivotSource;
        }), y.pivotColumns.length && y.groupBy && y.groupBy.length && (s = s.filter(function(b) {
          return b.isGrouped || b.isPivoted;
        })), s;
      }
      function rs(s, m) {
        var y = m.instance;
        return [].concat(s, [y.state.pivotColumns, y.state.groupBy]);
      }
      function is(s) {
        var m = s.columns, y = s.allColumns, b = s.flatHeaders, E = s.getHooks, R = s.plugins, A = s.dispatch, j = s.autoResetPivot, W = j === void 0 || j, U = s.manaulPivot, se = s.disablePivot, ie = s.defaultCanPivot;
        k(R, ["useGroupBy"], "usePivotColumns");
        var oe = T(s);
        y.forEach(function(ne) {
          var ge = ne.accessor, xe = ne.defaultPivot, $e = ne.disablePivot;
          ne.canPivot = ge ? Oe(ne.canPivot, $e !== !0 && void 0, se !== !0 && void 0, !0) : Oe(ne.canPivot, xe, ie, !1), ne.canPivot && (ne.togglePivot = function() {
            return s.togglePivot(ne.id);
          }), ne.Aggregated = ne.Aggregated || ne.Cell;
        }), b.forEach(function(ne) {
          ne.getPivotToggleProps = _(E().getPivotToggleProps, { instance: oe(), header: ne });
        });
        var Y = T(W);
        M(function() {
          Y() && A({ type: c.resetPivot });
        }, [A, U ? null : m]), Object.assign(s, { togglePivot: function(ne, ge) {
          A({ type: c.togglePivot, columnId: ne, value: ge });
        } });
      }
      function os(s) {
        s.allCells.forEach(function(m) {
          m.isPivoted = m.column.isPivoted;
        });
      }
      c.resetSelectedRows = "resetSelectedRows", c.toggleAllRowsSelected = "toggleAllRowsSelected", c.toggleRowSelected = "toggleRowSelected", c.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var la = function(s) {
        s.getToggleRowSelectedProps = [Xi], s.getToggleAllRowsSelectedProps = [Ur], s.getToggleAllPageRowsSelectedProps = [ca], s.stateReducers.push(as), s.useInstance.push(fa), s.prepareRow.push(us);
      };
      la.pluginName = "useRowSelect";
      var Xi = function(s, m) {
        var y = m.instance, b = m.row, E = y.manualRowSelectedKey, R = E === void 0 ? "isSelected" : E;
        return [s, { onChange: function(A) {
          b.toggleRowSelected(A.target.checked);
        }, style: { cursor: "pointer" }, checked: !(!b.original || !b.original[R]) || b.isSelected, title: "Toggle Row Selected", indeterminate: b.isSomeSelected }];
      }, Ur = function(s, m) {
        var y = m.instance;
        return [s, { onChange: function(b) {
          y.toggleAllRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllRowsSelected, title: "Toggle All Rows Selected", indeterminate: Boolean(!y.isAllRowsSelected && Object.keys(y.state.selectedRowIds).length) }];
      }, ca = function(s, m) {
        var y = m.instance;
        return [s, { onChange: function(b) {
          y.toggleAllPageRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllPageRowsSelected, title: "Toggle All Current Page Rows Selected", indeterminate: Boolean(!y.isAllPageRowsSelected && y.page.some(function(b) {
          var E = b.id;
          return y.state.selectedRowIds[E];
        })) }];
      };
      function as(s, m, y, b) {
        if (m.type === c.init)
          return a({ selectedRowIds: {} }, s);
        if (m.type === c.resetSelectedRows)
          return a({}, s, { selectedRowIds: b.initialState.selectedRowIds || {} });
        if (m.type === c.toggleAllRowsSelected) {
          var E = m.value, R = b.isAllRowsSelected, A = b.rowsById, j = b.nonGroupedRowsById, W = j === void 0 ? A : j, U = E !== void 0 ? E : !R, se = Object.assign({}, s.selectedRowIds);
          return U ? Object.keys(W).forEach(function(vt) {
            se[vt] = !0;
          }) : Object.keys(W).forEach(function(vt) {
            delete se[vt];
          }), a({}, s, { selectedRowIds: se });
        }
        if (m.type === c.toggleRowSelected) {
          var ie = m.id, oe = m.value, Y = b.rowsById, ne = b.selectSubRows, ge = ne === void 0 || ne, xe = b.getSubRows, $e = s.selectedRowIds[ie], Je = oe !== void 0 ? oe : !$e;
          if ($e === Je)
            return s;
          var Fe = a({}, s.selectedRowIds);
          return function vt(l) {
            var d = Y[l];
            if (d && (d.isGrouped || (Je ? Fe[l] = !0 : delete Fe[l]), ge && xe(d)))
              return xe(d).forEach(function(g) {
                return vt(g.id);
              });
          }(ie), a({}, s, { selectedRowIds: Fe });
        }
        if (m.type === c.toggleAllPageRowsSelected) {
          var le = m.value, Qe = b.page, Ee = b.rowsById, Ye = b.selectSubRows, ft = Ye === void 0 || Ye, je = b.isAllPageRowsSelected, Ve = b.getSubRows, bt = le !== void 0 ? le : !je, Ke = a({}, s.selectedRowIds);
          return Qe.forEach(function(vt) {
            return function l(d) {
              var g = Ee[d];
              if (g.isGrouped || (bt ? Ke[d] = !0 : delete Ke[d]), ft && Ve(g))
                return Ve(g).forEach(function(v) {
                  return l(v.id);
                });
            }(vt.id);
          }), a({}, s, { selectedRowIds: Ke });
        }
        return s;
      }
      function fa(s) {
        var m = s.data, y = s.rows, b = s.getHooks, E = s.plugins, R = s.rowsById, A = s.nonGroupedRowsById, j = A === void 0 ? R : A, W = s.autoResetSelectedRows, U = W === void 0 || W, se = s.state.selectedRowIds, ie = s.selectSubRows, oe = ie === void 0 || ie, Y = s.dispatch, ne = s.page, ge = s.getSubRows;
        k(E, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var xe = r.useMemo(function() {
          var Ve = [];
          return y.forEach(function(bt) {
            var Ke = oe ? function vt(l, d, g) {
              if (d[l.id])
                return !0;
              var v = g(l);
              if (v && v.length) {
                var S = !0, C = !1;
                return v.forEach(function(x) {
                  C && !S || (vt(x, d, g) ? C = !0 : S = !1);
                }), !!S || !!C && null;
              }
              return !1;
            }(bt, se, ge) : !!se[bt.id];
            bt.isSelected = !!Ke, bt.isSomeSelected = Ke === null, Ke && Ve.push(bt);
          }), Ve;
        }, [y, oe, se, ge]), $e = Boolean(Object.keys(j).length && Object.keys(se).length), Je = $e;
        $e && Object.keys(j).some(function(Ve) {
          return !se[Ve];
        }) && ($e = !1), $e || ne && ne.length && ne.some(function(Ve) {
          var bt = Ve.id;
          return !se[bt];
        }) && (Je = !1);
        var Fe = T(U);
        M(function() {
          Fe() && Y({ type: c.resetSelectedRows });
        }, [Y, m]);
        var le = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllRowsSelected, value: Ve });
        }, [Y]), Qe = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllPageRowsSelected, value: Ve });
        }, [Y]), Ee = r.useCallback(function(Ve, bt) {
          return Y({ type: c.toggleRowSelected, id: Ve, value: bt });
        }, [Y]), Ye = T(s), ft = _(b().getToggleAllRowsSelectedProps, { instance: Ye() }), je = _(b().getToggleAllPageRowsSelectedProps, { instance: Ye() });
        Object.assign(s, { selectedFlatRows: xe, isAllRowsSelected: $e, isAllPageRowsSelected: Je, toggleRowSelected: Ee, toggleAllRowsSelected: le, getToggleAllRowsSelectedProps: ft, getToggleAllPageRowsSelectedProps: je, toggleAllPageRowsSelected: Qe });
      }
      function us(s, m) {
        var y = m.instance;
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
      var Ki = function(s) {
        s.stateReducers.push(ss), s.useInstance.push(ha), s.prepareRow.push(ls);
      };
      function ss(s, m, y, b) {
        var E = b.initialRowStateAccessor, R = E === void 0 ? da : E, A = b.initialCellStateAccessor, j = A === void 0 ? pa : A, W = b.rowsById;
        if (m.type === c.init)
          return a({ rowState: {} }, s);
        if (m.type === c.resetRowState)
          return a({}, s, { rowState: b.initialState.rowState || {} });
        if (m.type === c.setRowState) {
          var U, se = m.rowId, ie = m.value, oe = s.rowState[se] !== void 0 ? s.rowState[se] : R(W[se]);
          return a({}, s, { rowState: a({}, s.rowState, (U = {}, U[se] = F(ie, oe), U)) });
        }
        if (m.type === c.setCellState) {
          var Y, ne, ge, xe, $e, Je = m.rowId, Fe = m.columnId, le = m.value, Qe = s.rowState[Je] !== void 0 ? s.rowState[Je] : R(W[Je]), Ee = (Qe == null || (Y = Qe.cellState) == null ? void 0 : Y[Fe]) !== void 0 ? Qe.cellState[Fe] : j((ne = W[Je]) == null || (ge = ne.cells) == null ? void 0 : ge.find(function(Ye) {
            return Ye.column.id === Fe;
          }));
          return a({}, s, { rowState: a({}, s.rowState, ($e = {}, $e[Je] = a({}, Qe, { cellState: a({}, Qe.cellState || {}, (xe = {}, xe[Fe] = F(le, Ee), xe)) }), $e)) });
        }
      }
      function ha(s) {
        var m = s.autoResetRowState, y = m === void 0 || m, b = s.data, E = s.dispatch, R = r.useCallback(function(W, U) {
          return E({ type: c.setRowState, rowId: W, value: U });
        }, [E]), A = r.useCallback(function(W, U, se) {
          return E({ type: c.setCellState, rowId: W, columnId: U, value: se });
        }, [E]), j = T(y);
        M(function() {
          j() && E({ type: c.resetRowState });
        }, [b]), Object.assign(s, { setRowState: R, setCellState: A });
      }
      function ls(s, m) {
        var y = m.instance, b = y.initialRowStateAccessor, E = b === void 0 ? da : b, R = y.initialCellStateAccessor, A = R === void 0 ? pa : R, j = y.state.rowState;
        s && (s.state = j[s.id] !== void 0 ? j[s.id] : E(s), s.setState = function(W) {
          return y.setRowState(s.id, W);
        }, s.cells.forEach(function(W) {
          s.state.cellState || (s.state.cellState = {}), W.state = s.state.cellState[W.column.id] !== void 0 ? s.state.cellState[W.column.id] : A(W), W.setState = function(U) {
            return y.setCellState(s.id, W.column.id, U);
          };
        }));
      }
      Ki.pluginName = "useRowState", c.resetColumnOrder = "resetColumnOrder", c.setColumnOrder = "setColumnOrder";
      var va = function(s) {
        s.stateReducers.push(ma), s.visibleColumnsDeps.push(function(m, y) {
          var b = y.instance;
          return [].concat(m, [b.state.columnOrder]);
        }), s.visibleColumns.push(ga), s.useInstance.push(cs);
      };
      function ma(s, m, y, b) {
        return m.type === c.init ? a({ columnOrder: [] }, s) : m.type === c.resetColumnOrder ? a({}, s, { columnOrder: b.initialState.columnOrder || [] }) : m.type === c.setColumnOrder ? a({}, s, { columnOrder: F(m.columnOrder, s.columnOrder) }) : void 0;
      }
      function ga(s, m) {
        var y = m.instance.state.columnOrder;
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
      function cs(s) {
        var m = s.dispatch;
        s.setColumnOrder = r.useCallback(function(y) {
          return m({ type: c.setColumnOrder, columnOrder: y });
        }, [m]);
      }
      va.pluginName = "useColumnOrder", w.canResize = !0, c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize";
      var ya = function(s) {
        s.getResizerProps = [fs], s.getHeaderProps.push({ style: { position: "relative" } }), s.stateReducers.push(ds), s.useInstance.push(hs), s.useInstanceBeforeDimensions.push(ps);
      }, fs = function(s, m) {
        var y = m.instance, b = m.header, E = y.dispatch, R = function(A, j) {
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
          }, ge = function(Fe) {
            se = Fe, U || (U = window.requestAnimationFrame(ne));
          }, xe = { mouse: { moveEvent: "mousemove", moveHandler: function(Fe) {
            return ge(Fe.clientX);
          }, upEvent: "mouseup", upHandler: function(Fe) {
            document.removeEventListener("mousemove", xe.mouse.moveHandler), document.removeEventListener("mouseup", xe.mouse.upHandler), Y();
          } }, touch: { moveEvent: "touchmove", moveHandler: function(Fe) {
            return Fe.cancelable && (Fe.preventDefault(), Fe.stopPropagation()), ge(Fe.touches[0].clientX), !1;
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
      function ds(s, m) {
        if (m.type === c.init)
          return a({ columnResizing: { columnWidths: {} } }, s);
        if (m.type === c.resetResize)
          return a({}, s, { columnResizing: { columnWidths: {} } });
        if (m.type === c.columnStartResizing) {
          var y = m.clientX, b = m.columnId, E = m.columnWidth, R = m.headerIdWidths;
          return a({}, s, { columnResizing: a({}, s.columnResizing, { startX: y, headerIdWidths: R, columnWidth: E, isResizingColumn: b }) });
        }
        if (m.type === c.columnResizing) {
          var A = m.clientX, j = s.columnResizing, W = j.startX, U = j.columnWidth, se = j.headerIdWidths, ie = (A - W) / U, oe = {};
          return (se === void 0 ? [] : se).forEach(function(Y) {
            var ne = Y[0], ge = Y[1];
            oe[ne] = Math.max(ge + ge * ie, 0);
          }), a({}, s, { columnResizing: a({}, s.columnResizing, { columnWidths: a({}, s.columnResizing.columnWidths, {}, oe) }) });
        }
        return m.type === c.columnDoneResizing ? a({}, s, { columnResizing: a({}, s.columnResizing, { startX: null, isResizingColumn: null }) }) : void 0;
      }
      ya.pluginName = "useResizeColumns";
      var ps = function(s) {
        var m = s.flatHeaders, y = s.disableResizing, b = s.getHooks, E = s.state.columnResizing, R = T(s);
        m.forEach(function(A) {
          var j = Oe(A.disableResizing !== !0 && void 0, y !== !0 && void 0, !0);
          A.canResize = j, A.width = E.columnWidths[A.id] || A.originalWidth || A.width, A.isResizing = E.isResizingColumn === A.id, j && (A.getResizerProps = _(b().getResizerProps, { instance: R(), header: A }));
        });
      };
      function hs(s) {
        var m = s.plugins, y = s.dispatch, b = s.autoResetResize, E = b === void 0 || b, R = s.columns;
        k(m, ["useAbsoluteLayout"], "useResizeColumns");
        var A = T(E);
        M(function() {
          A() && y({ type: c.resetResize });
        }, [R]);
        var j = r.useCallback(function() {
          return y({ type: c.resetResize });
        }, [y]);
        Object.assign(s, { resetResizing: j });
      }
      var Qi = { position: "absolute", top: 0 }, ba = function(s) {
        s.getTableBodyProps.push(vi), s.getRowProps.push(vi), s.getHeaderGroupProps.push(vi), s.getFooterGroupProps.push(vi), s.getHeaderProps.push(function(m, y) {
          var b = y.column;
          return [m, { style: a({}, Qi, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(m, y) {
          var b = y.cell;
          return [m, { style: a({}, Qi, { left: b.column.totalLeft + "px", width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(m, y) {
          var b = y.column;
          return [m, { style: a({}, Qi, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        });
      };
      ba.pluginName = "useAbsoluteLayout";
      var vi = function(s, m) {
        return [s, { style: { position: "relative", width: m.instance.totalColumnsWidth + "px" } }];
      }, Zi = { display: "inline-block", boxSizing: "border-box" }, Ji = function(s, m) {
        return [s, { style: { display: "flex", width: m.instance.totalColumnsWidth + "px" } }];
      }, wa = function(s) {
        s.getRowProps.push(Ji), s.getHeaderGroupProps.push(Ji), s.getFooterGroupProps.push(Ji), s.getHeaderProps.push(function(m, y) {
          var b = y.column;
          return [m, { style: a({}, Zi, { width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(m, y) {
          var b = y.cell;
          return [m, { style: a({}, Zi, { width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(m, y) {
          var b = y.column;
          return [m, { style: a({}, Zi, { width: b.totalWidth + "px" }) }];
        });
      };
      function eo(s) {
        s.getTableProps.push(vs), s.getRowProps.push(to), s.getHeaderGroupProps.push(to), s.getFooterGroupProps.push(to), s.getHeaderProps.push(ms), s.getCellProps.push(gs), s.getFooterProps.push(ys);
      }
      wa.pluginName = "useBlockLayout", eo.pluginName = "useFlexLayout";
      var vs = function(s, m) {
        return [s, { style: { minWidth: m.instance.totalColumnsMinWidth + "px" } }];
      }, to = function(s, m) {
        return [s, { style: { display: "flex", flex: "1 0 auto", minWidth: m.instance.totalColumnsMinWidth + "px" } }];
      }, ms = function(s, m) {
        var y = m.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      }, gs = function(s, m) {
        var y = m.cell;
        return [s, { style: { boxSizing: "border-box", flex: y.column.totalFlexWidth + " 0 auto", minWidth: y.column.totalMinWidth + "px", width: y.column.totalWidth + "px" } }];
      }, ys = function(s, m) {
        var y = m.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      };
      function xa(s) {
        s.stateReducers.push(Ca), s.getTableProps.push(_a), s.getHeaderProps.push(Sa), s.getRowProps.push(Ra);
      }
      c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize", xa.pluginName = "useGridLayout";
      var _a = function(s, m) {
        var y = m.instance;
        return [s, { style: { display: "grid", gridTemplateColumns: y.visibleColumns.map(function(b) {
          var E;
          return y.state.gridLayout.columnWidths[b.id] ? y.state.gridLayout.columnWidths[b.id] + "px" : (E = y.state.columnResizing) != null && E.isResizingColumn ? y.state.gridLayout.startWidths[b.id] + "px" : typeof b.width == "number" ? b.width + "px" : b.width;
        }).join(" ") } }];
      }, Sa = function(s, m) {
        var y = m.column;
        return [s, { id: "header-cell-" + y.id, style: { position: "sticky", gridColumn: "span " + y.totalVisibleHeaderCount } }];
      }, Ra = function(s, m) {
        var y = m.row;
        return y.isExpanded ? [s, { style: { gridColumn: "1 / " + (y.cells.length + 1) } }] : [s, {}];
      };
      function Ca(s, m, y, b) {
        if (m.type === c.init)
          return a({ gridLayout: { columnWidths: {} } }, s);
        if (m.type === c.resetResize)
          return a({}, s, { gridLayout: { columnWidths: {} } });
        if (m.type === c.columnStartResizing) {
          var E = m.columnId, R = m.headerIdWidths, A = no(E);
          if (A !== void 0) {
            var j = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = no(Qe.id), Ee));
            }, {}), W = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.minWidth, Ee));
            }, {}), U = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.maxWidth, Ee));
            }, {}), se = R.map(function(le) {
              var Qe = le[0];
              return [Qe, no(Qe)];
            });
            return a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: j, minWidths: W, maxWidths: U, headerIdGridWidths: se, columnWidth: A }) });
          }
          return s;
        }
        if (m.type === c.columnResizing) {
          var ie = m.clientX, oe = s.columnResizing.startX, Y = s.gridLayout, ne = Y.columnWidth, ge = Y.minWidths, xe = Y.maxWidths, $e = Y.headerIdGridWidths, Je = (ie - oe) / ne, Fe = {};
          return ($e === void 0 ? [] : $e).forEach(function(le) {
            var Qe = le[0], Ee = le[1];
            Fe[Qe] = Math.min(Math.max(ge[Qe], Ee + Ee * Je), xe[Qe]);
          }), a({}, s, { gridLayout: a({}, s.gridLayout, { columnWidths: a({}, s.gridLayout.columnWidths, {}, Fe) }) });
        }
        return m.type === c.columnDoneResizing ? a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: {}, minWidths: {}, maxWidths: {} }) }) : void 0;
      }
      function no(s) {
        var m, y = (m = document.getElementById("header-cell-" + s)) == null ? void 0 : m.offsetWidth;
        if (y !== void 0)
          return y;
      }
      n._UNSTABLE_usePivotColumns = Yi, n.actions = c, n.defaultColumn = w, n.defaultGroupByFn = cn, n.defaultOrderByFn = oa, n.defaultRenderer = h, n.emptyRenderer = p, n.ensurePluginOrder = k, n.flexRender = te, n.functionalUpdate = F, n.loopHooks = I, n.makePropGetter = _, n.makeRenderer = z, n.reduceHooks = N, n.safeUseLayoutEffect = G, n.useAbsoluteLayout = ba, n.useAsyncDebounce = function(s, m) {
        m === void 0 && (m = 0);
        var y = r.useRef({}), b = T(s), E = T(m);
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
      }, n.useBlockLayout = wa, n.useColumnOrder = va, n.useExpanded = or, n.useFilters = xr, n.useFlexLayout = eo, n.useGetLatest = T, n.useGlobalFilter = O, n.useGridLayout = xa, n.useGroupBy = rt, n.useMountedLayoutEffect = M, n.usePagination = qi, n.useResizeColumns = ya, n.useRowSelect = la, n.useRowState = Ki, n.useSortBy = ia, n.useTable = function(s) {
        for (var m = arguments.length, y = new Array(m > 1 ? m - 1 : 0), b = 1; b < m; b++)
          y[b - 1] = arguments[b];
        s = _n(s), y = [gt].concat(y);
        var E = r.useRef({}), R = T(E.current);
        Object.assign(R(), a({}, s, { plugins: y, hooks: D() })), y.filter(Boolean).forEach(function(x) {
          x(R().hooks);
        });
        var A = T(R().hooks);
        R().getHooks = A, delete R().hooks, Object.assign(R(), N(A().useOptions, _n(s)));
        var j = R(), W = j.data, U = j.columns, se = j.initialState, ie = j.defaultColumn, oe = j.getSubRows, Y = j.getRowId, ne = j.stateReducer, ge = j.useControlledState, xe = T(ne), $e = r.useCallback(function(x, $) {
          if (!$.type)
            throw console.info({ action: $ }), new Error("Unknown Action \u{1F446}");
          return [].concat(A().stateReducers, Array.isArray(xe()) ? xe() : [xe()]).reduce(function(L, H) {
            return H(L, $, x, R()) || L;
          }, x);
        }, [A, xe, R]), Je = r.useReducer($e, void 0, function() {
          return $e(se, { type: c.init });
        }), Fe = Je[0], le = Je[1], Qe = N([].concat(A().useControlledState, [ge]), Fe, { instance: R() });
        Object.assign(R(), { state: Qe, dispatch: le });
        var Ee = r.useMemo(function() {
          return Q(N(A().columns, U, { instance: R() }));
        }, [A, R, U].concat(N(A().columnsDeps, [], { instance: R() })));
        R().columns = Ee;
        var Ye = r.useMemo(function() {
          return N(A().allColumns, fe(Ee), { instance: R() }).map(me);
        }, [Ee, A, R].concat(N(A().allColumnsDeps, [], { instance: R() })));
        R().allColumns = Ye;
        var ft = r.useMemo(function() {
          for (var x = [], $ = [], L = {}, H = [].concat(Ye); H.length; ) {
            var q = H.shift();
            On({ data: W, rows: x, flatRows: $, rowsById: L, column: q, getRowId: Y, getSubRows: oe, accessValueHooks: A().accessValue, getInstance: R });
          }
          return [x, $, L];
        }, [Ye, W, Y, oe, A, R]), je = ft[0], Ve = ft[1], bt = ft[2];
        Object.assign(R(), { rows: je, initialRows: [].concat(je), flatRows: Ve, rowsById: bt }), I(A().useInstanceAfterData, R());
        var Ke = r.useMemo(function() {
          return N(A().visibleColumns, Ye, { instance: R() }).map(function(x) {
            return re(x, ie);
          });
        }, [A, Ye, R, ie].concat(N(A().visibleColumnsDeps, [], { instance: R() })));
        Ye = r.useMemo(function() {
          var x = [].concat(Ke);
          return Ye.forEach(function($) {
            x.find(function(L) {
              return L.id === $.id;
            }) || x.push($);
          }), x;
        }, [Ye, Ke]), R().allColumns = Ye;
        var vt = r.useMemo(function() {
          return N(A().headerGroups, ee(Ke, ie), R());
        }, [A, Ke, ie, R].concat(N(A().headerGroupsDeps, [], { instance: R() })));
        R().headerGroups = vt;
        var l = r.useMemo(function() {
          return vt.length ? vt[0].headers : [];
        }, [vt]);
        R().headers = l, R().flatHeaders = vt.reduce(function(x, $) {
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
        var g = Yt(l), v = g[0], S = g[1], C = g[2];
        return R().totalColumnsMinWidth = v, R().totalColumnsWidth = S, R().totalColumnsMaxWidth = C, I(A().useInstance, R()), [].concat(R().flatHeaders, R().allColumns).forEach(function(x) {
          x.render = z(R(), x), x.getHeaderProps = _(A().getHeaderProps, { instance: R(), column: x }), x.getFooterProps = _(A().getFooterProps, { instance: R(), column: x });
        }), R().headerGroups = r.useMemo(function() {
          return vt.filter(function(x, $) {
            return x.headers = x.headers.filter(function(L) {
              return L.headers ? function H(q) {
                return q.filter(function(pe) {
                  return pe.headers ? H(pe.headers) : pe.isVisible;
                }).length;
              }(L.headers) : L.isVisible;
            }), !!x.headers.length && (x.getHeaderGroupProps = _(A().getHeaderGroupProps, { instance: R(), headerGroup: x, index: $ }), x.getFooterGroupProps = _(A().getFooterGroupProps, { instance: R(), headerGroup: x, index: $ }), !0);
          });
        }, [vt, R, A]), R().footerGroups = [].concat(R().headerGroups).reverse(), R().prepareRow = r.useCallback(function(x) {
          x.getRowProps = _(A().getRowProps, { instance: R(), row: x }), x.allCells = Ye.map(function($) {
            var L = x.values[$.id], H = { column: $, row: x, value: L };
            return H.getCellProps = _(A().getCellProps, { instance: R(), cell: H }), H.render = z(R(), $, { row: x, cell: H, value: L }), H;
          }), x.cells = Ke.map(function($) {
            return x.allCells.find(function(L) {
              return L.column.id === $.id;
            });
          }), I(A().prepareRow, x, { instance: R() });
        }, [A, R, Ye, Ke]), R().getTableProps = _(A().getTableProps, { instance: R() }), R().getTableBodyProps = _(A().getTableBodyProps, { instance: R() }), I(A().useFinalInstance, R()), R();
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(za, za.exports)), za.exports;
}
var La = { exports: {} }, Jp;
function RP() {
  return Jp || (Jp = 1, function(e, t) {
    (function(n, r) {
      r(t, gn);
    })(_i, function(n, r) {
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      function i(l, d, g, v, S, C, x) {
        try {
          var $ = l[C](x), L = $.value;
        } catch (H) {
          g(H);
          return;
        }
        $.done ? d(L) : Promise.resolve(L).then(v, S);
      }
      function o(l) {
        return function() {
          var d = this, g = arguments;
          return new Promise(function(v, S) {
            var C = l.apply(d, g);
            function x(L) {
              i(C, v, S, x, $, "next", L);
            }
            function $(L) {
              i(C, v, S, x, $, "throw", L);
            }
            x(void 0);
          });
        };
      }
      function a() {
        return a = Object.assign || function(l) {
          for (var d = 1; d < arguments.length; d++) {
            var g = arguments[d];
            for (var v in g)
              Object.prototype.hasOwnProperty.call(g, v) && (l[v] = g[v]);
          }
          return l;
        }, a.apply(this, arguments);
      }
      function u(l, d) {
        if (l == null)
          return {};
        var g = {}, v = Object.keys(l), S, C;
        for (C = 0; C < v.length; C++)
          S = v[C], !(d.indexOf(S) >= 0) && (g[S] = l[S]);
        return g;
      }
      function f(l, d) {
        if (typeof l != "object" || l === null)
          return l;
        var g = l[Symbol.toPrimitive];
        if (g !== void 0) {
          var v = g.call(l, d || "default");
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
        var g = d.value, v = g === void 0 ? "" : g;
        return v;
      }, P = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, _ = {
        Cell: w,
        width: 150,
        minWidth: 0,
        maxWidth: Number.MAX_SAFE_INTEGER
      };
      function N() {
        for (var l = arguments.length, d = new Array(l), g = 0; g < l; g++)
          d[g] = arguments[g];
        return d.reduce(function(v, S) {
          var C = S.style, x = S.className, $ = u(S, ["style", "className"]);
          return v = a({}, v, {}, $), C && (v.style = v.style ? a({}, v.style || {}, {}, C || {}) : C), x && (v.className = v.className ? v.className + " " + x : x), v.className === "" && delete v.className, v;
        }, {});
      }
      function I(l, d, g) {
        return typeof d == "function" ? I({}, d(l, g)) : Array.isArray(d) ? N.apply(void 0, [l].concat(d)) : N(l, d);
      }
      var k = function(d, g) {
        return g === void 0 && (g = {}), function(v) {
          return v === void 0 && (v = {}), [].concat(d, [v]).reduce(function(S, C) {
            return I(S, C, a({}, g, {
              userProps: v
            }));
          }, {});
        };
      }, F = function(d, g, v, S) {
        return v === void 0 && (v = {}), d.reduce(function(C, x) {
          var $ = x(C, v);
          if (!S && typeof $ > "u")
            throw console.info(x), new Error("React Table: A reducer hook \u261D\uFE0F just returned undefined! This is not allowed.");
          return $;
        }, g);
      }, T = function(d, g, v) {
        return v === void 0 && (v = {}), d.forEach(function(S) {
          var C = S(g, v);
          if (typeof C < "u")
            throw console.info(S, C), new Error("React Table: A loop-type hook \u261D\uFE0F just returned a value! This is not allowed.");
        });
      };
      function G(l, d, g, v) {
        if (v)
          throw new Error('Defining plugins in the "after" section of ensurePluginOrder is no longer supported (see plugin ' + g + ")");
        var S = l.findIndex(function(C) {
          return C.pluginName === g;
        });
        if (S === -1)
          throw new Error('The plugin "' + g + `" was not found in the plugin list!
This usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:

  ` + g + ".pluginName = '" + g + `'
`);
        d.forEach(function(C) {
          var x = l.findIndex(function($) {
            return $.pluginName === C;
          });
          if (x > -1 && x > S)
            throw new Error("React Table: The " + g + " plugin hook must be placed after the " + C + " plugin hook!");
        });
      }
      function M(l, d) {
        return typeof l == "function" ? l(d) : l;
      }
      function z(l) {
        var d = r.useRef();
        return d.current = l, r.useCallback(function() {
          return d.current;
        }, []);
      }
      var te = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function Q(l, d) {
        var g = r.useRef(!1);
        te(function() {
          g.current && l(), g.current = !0;
        }, d);
      }
      function fe(l, d) {
        d === void 0 && (d = 0);
        var g = r.useRef({}), v = z(l), S = z(d);
        return r.useCallback(
          /* @__PURE__ */ function() {
            var C = o(
              /* @__PURE__ */ regeneratorRuntime.mark(function x() {
                var $, L, H, q = arguments;
                return regeneratorRuntime.wrap(function(Z) {
                  for (; ; )
                    switch (Z.prev = Z.next) {
                      case 0:
                        for ($ = q.length, L = new Array($), H = 0; H < $; H++)
                          L[H] = q[H];
                        return g.current.promise || (g.current.promise = new Promise(function(ae, ve) {
                          g.current.resolve = ae, g.current.reject = ve;
                        })), g.current.timeout && clearTimeout(g.current.timeout), g.current.timeout = setTimeout(
                          /* @__PURE__ */ o(
                            /* @__PURE__ */ regeneratorRuntime.mark(function ae() {
                              return regeneratorRuntime.wrap(function(K) {
                                for (; ; )
                                  switch (K.prev = K.next) {
                                    case 0:
                                      return delete g.current.timeout, K.prev = 1, K.t0 = g.current, K.next = 5, v().apply(void 0, L);
                                    case 5:
                                      K.t1 = K.sent, K.t0.resolve.call(K.t0, K.t1), K.next = 12;
                                      break;
                                    case 9:
                                      K.prev = 9, K.t2 = K.catch(1), g.current.reject(K.t2);
                                    case 12:
                                      return K.prev = 12, delete g.current.promise, K.finish(12);
                                    case 15:
                                    case "end":
                                      return K.stop();
                                  }
                              }, ae, null, [[1, 9, 12, 15]]);
                            })
                          ),
                          S()
                        ), Z.abrupt("return", g.current.promise);
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
      function me(l, d, g) {
        return g === void 0 && (g = {}), function(v, S) {
          S === void 0 && (S = {});
          var C = typeof v == "string" ? d[v] : v;
          if (typeof C > "u")
            throw console.info(d), new Error(h);
          return re(C, a({}, l, {
            column: d
          }, g, {}, S));
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
      function ut(l, d, g) {
        return g === void 0 && (g = 0), l.map(function(v) {
          return v = a({}, v, {
            parent: d,
            depth: g
          }), st(v), v.columns && (v.columns = ut(v.columns, v, g + 1)), v;
        });
      }
      function Ue(l) {
        return Ce(l, "columns");
      }
      function st(l) {
        var d = l.id, g = l.accessor, v = l.Header;
        if (typeof g == "string") {
          d = d || g;
          var S = g.split(".");
          g = function(x) {
            return ue(x, S);
          };
        }
        if (!d && typeof v == "string" && v && (d = v), !d && l.columns)
          throw console.error(l), new Error('A column ID (or unique "Header" value) is required!');
        if (!d)
          throw console.error(l), new Error("A column ID (or string accessor) is required!");
        return Object.assign(l, {
          id: d,
          accessor: g
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
      function dt(l, d, g) {
        g === void 0 && (g = function() {
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
                }, g(Z));
              else {
                var K = Z.id + "_placeholder";
                ve = lt(a({
                  originalId: K,
                  id: Z.id + "_placeholder_" + x(),
                  placeholderOf: Z,
                  headers: [Z]
                }, g(Z)), d);
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
      function ue(l, d, g) {
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
        return typeof C < "u" ? C : g;
      }
      function Ne() {
        for (var l = arguments.length, d = new Array(l), g = 0; g < l; g++)
          d[g] = arguments[g];
        for (var v = 0; v < d.length; v += 1)
          if (typeof d[v] < "u")
            return d[v];
      }
      function Ae(l) {
        if (typeof l == "function")
          return l;
      }
      function Ce(l, d) {
        var g = [], v = function S(C) {
          C.forEach(function(x) {
            x[d] ? S(x[d]) : g.push(x);
          });
        };
        return v(l), g;
      }
      function Re(l, d) {
        var g = d.manualExpandedKey, v = d.expanded, S = d.expandSubRows, C = S === void 0 ? !0 : S, x = [], $ = function L(H, q) {
          q === void 0 && (q = !0), H.isExpanded = H.original && H.original[g] || v[H.id], H.canExpand = H.subRows && !!H.subRows.length, q && x.push(H), H.subRows && H.subRows.length && H.isExpanded && H.subRows.forEach(function(pe) {
            return L(pe, C);
          });
        };
        return l.forEach(function(L) {
          return $(L);
        }), x;
      }
      function Te(l, d, g) {
        return Ae(l) || d[l] || g[l] || g.text;
      }
      function Be(l, d, g) {
        return l ? l(d, g) : typeof d > "u";
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
      var Ge = /\[/g, D = /\]/g;
      function gt(l) {
        return ct(l).map(function(d) {
          return String(d).replace(".", "_");
        }).join(".").replace(Ge, ".").replace(D, "").split(".");
      }
      function ct(l, d) {
        if (d === void 0 && (d = []), !Array.isArray(l))
          d.push(l);
        else
          for (var g = 0; g < l.length; g += 1)
            ct(l[g], d);
        return d;
      }
      var St = function(d) {
        return a({
          role: "table"
        }, d);
      }, At = function(d) {
        return a({
          role: "rowgroup"
        }, d);
      }, Zt = function(d, g) {
        var v = g.column;
        return a({
          key: "header_" + v.id,
          colSpan: v.totalVisibleHeaderCount,
          role: "columnheader"
        }, d);
      }, sn = function(d, g) {
        var v = g.column;
        return a({
          key: "footer_" + v.id,
          colSpan: v.totalVisibleHeaderCount
        }, d);
      }, bn = function(d, g) {
        var v = g.index;
        return a({
          key: "headerGroup_" + v,
          role: "row"
        }, d);
      }, wn = function(d, g) {
        var v = g.index;
        return a({
          key: "footerGroup_" + v
        }, d);
      }, xn = function(d, g) {
        var v = g.row;
        return a({
          key: "row_" + v.id,
          role: "row"
        }, d);
      }, Ln = function(d, g) {
        var v = g.cell;
        return a({
          key: "cell_" + v.row.id + "_" + v.column.id,
          role: "cell"
        }, d);
      };
      function ir() {
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
          getTableProps: [St],
          getTableBodyProps: [At],
          getHeaderGroupProps: [bn],
          getFooterGroupProps: [wn],
          getHeaderProps: [Zt],
          getFooterProps: [sn],
          getRowProps: [xn],
          getCellProps: [Ln],
          useFinalInstance: []
        };
      }
      p.resetHiddenColumns = "resetHiddenColumns", p.toggleHideColumn = "toggleHideColumn", p.setHiddenColumns = "setHiddenColumns", p.toggleHideAllColumns = "toggleHideAllColumns";
      var Gn = function(d) {
        d.getToggleHiddenProps = [_n], d.getToggleHideAllColumnsProps = [Yt], d.stateReducers.push(On), d.useInstanceBeforeDimensions.push(or), d.headerGroupsDeps.push(function(g, v) {
          var S = v.instance;
          return [].concat(g, [S.state.hiddenColumns]);
        }), d.useInstance.push(yr);
      };
      Gn.pluginName = "useColumnVisibility";
      var _n = function(d, g) {
        var v = g.column;
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
      }, Yt = function(d, g) {
        var v = g.instance;
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
      function On(l, d, g, v) {
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
      function or(l) {
        var d = l.headers, g = l.state.hiddenColumns, v = r.useRef(!1);
        v.current;
        var S = function x($, L) {
          $.isVisible = L && !g.includes($.id);
          var H = 0;
          return $.headers && $.headers.length ? $.headers.forEach(function(q) {
            return H += x(q, $.isVisible);
          }) : H = $.isVisible ? 1 : 0, $.totalVisibleHeaderCount = H, H;
        }, C = 0;
        d.forEach(function(x) {
          return C += S(x, !0);
        });
      }
      function yr(l) {
        var d = l.columns, g = l.flatHeaders, v = l.dispatch, S = l.allColumns, C = l.getHooks, x = l.state.hiddenColumns, $ = l.autoResetHiddenColumns, L = $ === void 0 ? !0 : $, H = z(l), q = S.length === x.length, pe = r.useCallback(function(Pe, De) {
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
        g.forEach(function(Pe) {
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
        var K = z(L);
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
      var br = {}, ar = {}, wr = function(d, g, v) {
        return d;
      }, jn = function(d, g) {
        return d.subRows || [];
      }, Hn = function(d, g, v) {
        return "" + (v ? [v.id, g].join(".") : g);
      }, ln = function(d) {
        return d;
      };
      function Sn(l) {
        var d = l.initialState, g = d === void 0 ? br : d, v = l.defaultColumn, S = v === void 0 ? ar : v, C = l.getSubRows, x = C === void 0 ? jn : C, $ = l.getRowId, L = $ === void 0 ? Hn : $, H = l.stateReducer, q = H === void 0 ? wr : H, pe = l.useControlledState, Z = pe === void 0 ? ln : pe, ae = u(l, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]);
        return a({}, ae, {
          initialState: g,
          defaultColumn: S,
          getSubRows: x,
          getRowId: L,
          stateReducer: q,
          useControlledState: Z
        });
      }
      var An = function(d) {
        for (var g = arguments.length, v = new Array(g > 1 ? g - 1 : 0), S = 1; S < g; S++)
          v[S - 1] = arguments[S];
        d = Sn(d), v = [Gn].concat(v);
        var C = r.useRef({}), x = z(C.current);
        Object.assign(x(), a({}, d, {
          plugins: v,
          hooks: ir()
        })), v.filter(Boolean).forEach(function(He) {
          He(x().hooks);
        });
        var $ = z(x().hooks);
        x().getHooks = $, delete x().hooks, Object.assign(x(), F($().useOptions, Sn(d)));
        var L = x(), H = L.data, q = L.columns, pe = L.initialState, Z = L.defaultColumn, ae = L.getSubRows, ve = L.getRowId, K = L.stateReducer, Pe = L.useControlledState, De = z(K), We = r.useCallback(function(He, Et) {
          if (!Et.type)
            throw console.info({
              action: Et
            }), new Error("Unknown Action \u{1F446}");
          return [].concat($().stateReducers, Array.isArray(De()) ? De() : [De()]).reduce(function(Bt, rn) {
            return rn(Bt, Et, He, x()) || Bt;
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
          for (var He = [], Et = [], Bt = {}, rn = [].concat(Se); rn.length; ) {
            var zt = rn.shift();
            ur({
              data: H,
              rows: He,
              flatRows: Et,
              rowsById: Bt,
              column: zt,
              getRowId: ve,
              getSubRows: ae,
              accessValueHooks: $().accessValue,
              getInstance: x
            });
          }
          return [He, Et, Bt];
        }, [Se, H, ve, ae, $, x]), et = Ie[0], tt = Ie[1], Rt = Ie[2];
        Object.assign(x(), {
          rows: et,
          initialRows: [].concat(et),
          flatRows: tt,
          rowsById: Rt
        }), T($().useInstanceAfterData, x());
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
          return Se.forEach(function(Et) {
            He.find(function(Bt) {
              return Bt.id === Et.id;
            }) || He.push(Et);
          }), He;
        }, [Se, Me]), x().allColumns = Se;
        {
          var Dt = Se.filter(function(He, Et) {
            return Se.findIndex(function(Bt) {
              return Bt.id === He.id;
            }) !== Et;
          });
          if (Dt.length)
            throw console.info(Se), new Error('Duplicate columns were found with ids: "' + Dt.map(function(He) {
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
        x().headers = qe, x().flatHeaders = nt.reduce(function(He, Et) {
          return [].concat(He, Et.headers);
        }, []), T($().useInstanceBeforeDimensions, x());
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
        var Tt = kn(qe), jt = Tt[0], Vr = Tt[1], ro = Tt[2];
        return x().totalColumnsMinWidth = jt, x().totalColumnsWidth = Vr, x().totalColumnsMaxWidth = ro, T($().useInstance, x()), [].concat(x().flatHeaders, x().allColumns).forEach(function(He) {
          He.render = me(x(), He), He.getHeaderProps = k($().getHeaderProps, {
            instance: x(),
            column: He
          }), He.getFooterProps = k($().getFooterProps, {
            instance: x(),
            column: He
          });
        }), x().headerGroups = r.useMemo(function() {
          return nt.filter(function(He, Et) {
            return He.headers = He.headers.filter(function(Bt) {
              var rn = function zt(_r) {
                return _r.filter(function(Kt) {
                  return Kt.headers ? zt(Kt.headers) : Kt.isVisible;
                }).length;
              };
              return Bt.headers ? rn(Bt.headers) : Bt.isVisible;
            }), He.headers.length ? (He.getHeaderGroupProps = k($().getHeaderGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Et
            }), He.getFooterGroupProps = k($().getFooterGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Et
            }), !0) : !1;
          });
        }, [nt, x, $]), x().footerGroups = [].concat(x().headerGroups).reverse(), x().prepareRow = r.useCallback(function(He) {
          He.getRowProps = k($().getRowProps, {
            instance: x(),
            row: He
          }), He.allCells = Se.map(function(Et) {
            var Bt = He.values[Et.id], rn = {
              column: Et,
              row: He,
              value: Bt
            };
            return rn.getCellProps = k($().getCellProps, {
              instance: x(),
              cell: rn
            }), rn.render = me(x(), Et, {
              row: He,
              cell: rn,
              value: Bt
            }), rn;
          }), He.cells = Me.map(function(Et) {
            return He.allCells.find(function(Bt) {
              return Bt.column.id === Et.id;
            });
          }), T($().prepareRow, He, {
            instance: x()
          });
        }, [$, x, Se, Me]), x().getTableProps = k($().getTableProps, {
          instance: x()
        }), x().getTableBodyProps = k($().getTableBodyProps, {
          instance: x()
        }), T($().useFinalInstance, x()), x();
      };
      function kn(l, d) {
        d === void 0 && (d = 0);
        var g = 0, v = 0, S = 0, C = 0;
        return l.forEach(function(x) {
          var $ = x.headers;
          if (x.totalLeft = d, $ && $.length) {
            var L = kn($, d), H = L[0], q = L[1], pe = L[2], Z = L[3];
            x.totalMinWidth = H, x.totalWidth = q, x.totalMaxWidth = pe, x.totalFlexWidth = Z;
          } else
            x.totalMinWidth = x.minWidth, x.totalWidth = Math.min(Math.max(x.minWidth, x.width), x.maxWidth), x.totalMaxWidth = x.maxWidth, x.totalFlexWidth = x.canResize ? x.totalWidth : 0;
          x.isVisible && (d += x.totalWidth, g += x.totalMinWidth, v += x.totalWidth, S += x.totalMaxWidth, C += x.totalFlexWidth);
        }), [g, v, S, C];
      }
      function ur(l) {
        var d = l.data, g = l.rows, v = l.flatRows, S = l.rowsById, C = l.column, x = l.getRowId, $ = l.getSubRows, L = l.accessValueHooks, H = l.getInstance, q = function pe(Z, ae, ve, K, Pe) {
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
          C.accessor && (we.values[C.id] = C.accessor(Z, ae, we, Pe, d)), we.values[C.id] = F(L, we.values[C.id], {
            row: we,
            column: C,
            instance: H()
          }, !0);
        };
        d.forEach(function(pe, Z) {
          return q(pe, Z, 0, void 0, g);
        });
      }
      p.resetExpanded = "resetExpanded", p.toggleRowExpanded = "toggleRowExpanded", p.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var $n = function(d) {
        d.getToggleAllRowsExpandedProps = [sr], d.getToggleRowExpandedProps = [Wn], d.stateReducers.push(Un), d.useInstance.push(Rn), d.prepareRow.push(xr);
      };
      $n.pluginName = "useExpanded";
      var sr = function(d, g) {
        var v = g.instance;
        return [d, {
          onClick: function(C) {
            v.toggleAllRowsExpanded();
          },
          style: {
            cursor: "pointer"
          },
          title: "Toggle All Rows Expanded"
        }];
      }, Wn = function(d, g) {
        var v = g.row;
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
      function Un(l, d, g, v) {
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
            var L = {};
            return Object.keys(C).forEach(function(Pe) {
              L[Pe] = !0;
            }), a({}, l, {
              expanded: L
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
      function Rn(l) {
        var d = l.data, g = l.rows, v = l.rowsById, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.paginateExpandedRows, $ = x === void 0 ? !0 : x, L = l.expandSubRows, H = L === void 0 ? !0 : L, q = l.autoResetExpanded, pe = q === void 0 ? !0 : q, Z = l.getHooks, ae = l.plugins, ve = l.state.expanded, K = l.dispatch;
        G(ae, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var Pe = z(pe), De = Boolean(Object.keys(v).length && Object.keys(ve).length);
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
          return $ ? Re(g, {
            manualExpandedKey: C,
            expanded: ve,
            expandSubRows: H
          }) : g;
        }, [$, g, C, ve, H]), it = r.useMemo(function() {
          return Gt(ve);
        }, [ve]), _e = z(l), ye = k(Z().getToggleAllRowsExpandedProps, {
          instance: _e()
        });
        Object.assign(l, {
          preExpandedRows: g,
          expandedRows: Ze,
          rows: Ze,
          expandedDepth: it,
          isAllRowsExpanded: De,
          toggleRowExpanded: We,
          toggleAllRowsExpanded: we,
          getToggleAllRowsExpandedProps: ye
        });
      }
      function xr(l, d) {
        var g = d.instance.getHooks, v = d.instance;
        l.toggleRowExpanded = function(S) {
          return v.toggleRowExpanded(l.id, S);
        }, l.getToggleRowExpandedProps = k(g().getToggleRowExpandedProps, {
          instance: v,
          row: l
        });
      }
      function Gt(l) {
        var d = 0;
        return Object.keys(l).forEach(function(g) {
          var v = g.split(".");
          d = Math.max(d, v.length);
        }), d;
      }
      var Xt = function(d, g, v) {
        return d = d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return String(x).toLowerCase().includes(String(v).toLowerCase());
          });
        }), d;
      };
      Xt.autoRemove = function(l) {
        return !l;
      };
      var O = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x).toLowerCase() === String(v).toLowerCase() : !0;
          });
        });
      };
      O.autoRemove = function(l) {
        return !l;
      };
      var J = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x) === String(v) : !0;
          });
        });
      };
      J.autoRemove = function(l) {
        return !l;
      };
      var he = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x.includes(v);
          });
        });
      };
      he.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ze = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
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
      var ht = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x && x.length && v.some(function($) {
              return x.includes($);
            });
          });
        });
      };
      ht.autoRemove = function(l) {
        return !l || !l.length;
      };
      var yt = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return v.includes(x);
          });
        });
      };
      yt.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ot = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x === v;
          });
        });
      };
      ot.autoRemove = function(l) {
        return typeof l > "u";
      };
      var rt = function(d, g, v) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x == v;
          });
        });
      };
      rt.autoRemove = function(l) {
        return l == null;
      };
      var kt = function(d, g, v) {
        var S = v || [], C = S[0], x = S[1];
        if (C = typeof C == "number" ? C : -1 / 0, x = typeof x == "number" ? x : 1 / 0, C > x) {
          var $ = C;
          C = x, x = $;
        }
        return d.filter(function(L) {
          return g.some(function(H) {
            var q = L.values[H];
            return q >= C && q <= x;
          });
        });
      };
      kt.autoRemove = function(l) {
        return !l || typeof l[0] != "number" && typeof l[1] != "number";
      };
      var Nt = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        text: Xt,
        exactText: O,
        exactTextCase: J,
        includes: he,
        includesAll: ze,
        includesSome: ht,
        includesValue: yt,
        exact: ot,
        equals: rt,
        between: kt
      });
      p.resetFilters = "resetFilters", p.setFilter = "setFilter", p.setAllFilters = "setAllFilters";
      var Mt = function(d) {
        d.stateReducers.push(hn), d.useInstance.push(Vn);
      };
      Mt.pluginName = "useFilters";
      function hn(l, d, g, v) {
        if (d.type === p.init)
          return a({
            filters: []
          }, l);
        if (d.type === p.resetFilters)
          return a({}, l, {
            filters: v.initialState.filters || []
          });
        if (d.type === p.setFilter) {
          var S = d.columnId, C = d.filterValue, x = v.allColumns, $ = v.filterTypes, L = x.find(function(K) {
            return K.id === S;
          });
          if (!L)
            throw new Error("React-Table: Could not find a column with id: " + S);
          var H = Te(L.filter, $ || {}, Nt), q = l.filters.find(function(K) {
            return K.id === S;
          }), pe = M(C, q && q.value);
          return Be(H.autoRemove, pe, L) ? a({}, l, {
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
              }), De = Te(Pe.filter, ve || {}, Nt);
              return !Be(De.autoRemove, K.value, Pe);
            })
          });
        }
      }
      function Vn(l) {
        var d = l.data, g = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, $ = l.manualFilters, L = l.defaultCanFilter, H = L === void 0 ? !1 : L, q = l.disableFilters, pe = l.state.filters, Z = l.dispatch, ae = l.autoResetFilters, ve = ae === void 0 ? !0 : ae, K = r.useCallback(function(_e, ye) {
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
          _e.canFilter = Se ? Ne(et === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Ne(Ie, H, !1), _e.setFilter = function(Rt) {
            return K(_e.id, Rt);
          };
          var tt = pe.find(function(Rt) {
            return Rt.id === ye;
          });
          _e.filterValue = tt && tt.value;
        });
        var De = r.useMemo(function() {
          if ($ || !pe.length)
            return [g, v, S];
          var _e = [], ye = {}, Se = function Ie(et, tt) {
            tt === void 0 && (tt = 0);
            var Rt = et;
            return Rt = pe.reduce(function(Me, Dt) {
              var nt = Dt.id, qe = Dt.value, Xe = C.find(function(jt) {
                return jt.id === nt;
              });
              if (!Xe)
                return Me;
              tt === 0 && (Xe.preFilteredRows = Me);
              var Tt = Te(Xe.filter, x || {}, Nt);
              return Tt ? (Xe.filteredRows = Tt(Me, [nt], qe), Xe.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + Xe.id + "."), Me);
            }, et), Rt.forEach(function(Me) {
              _e.push(Me), ye[Me.id] = Me, Me.subRows && (Me.subRows = Me.subRows && Me.subRows.length > 0 ? Ie(Me.subRows, tt + 1) : Me.subRows);
            }), Rt;
          };
          return [Se(g), _e, ye];
        }, [$, pe, g, v, S, C, x]), We = De[0], we = De[1], Ze = De[2];
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
        var it = z(ve);
        Q(function() {
          it() && Z({
            type: p.resetFilters
          });
        }, [Z, $ ? null : d]), Object.assign(l, {
          preFilteredRows: g,
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
        d.stateReducers.push(cn), d.useInstance.push(na);
      };
      Hr.pluginName = "useGlobalFilter";
      function cn(l, d, g, v) {
        if (d.type === p.resetGlobalFilter)
          return a({}, l, {
            globalFilter: v.initialState.globalFilter || void 0
          });
        if (d.type === p.setGlobalFilter) {
          var S = d.filterValue, C = v.userFilterTypes, x = Te(v.globalFilter, C || {}, Nt), $ = M(S, l.globalFilter);
          if (Be(x.autoRemove, $)) {
            l.globalFilter;
            var L = u(l, ["globalFilter"]);
            return L;
          }
          return a({}, l, {
            globalFilter: $
          });
        }
      }
      function na(l) {
        var d = l.data, g = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, $ = l.globalFilter, L = l.manualGlobalFilter, H = l.state.globalFilter, q = l.dispatch, pe = l.autoResetGlobalFilter, Z = pe === void 0 ? !0 : pe, ae = l.disableGlobalFilter, ve = r.useCallback(function(Ze) {
          q({
            type: p.setGlobalFilter,
            filterValue: Ze
          });
        }, [q]), K = r.useMemo(function() {
          if (L || typeof H > "u")
            return [g, v, S];
          var Ze = [], it = {}, _e = Te($, x || {}, Nt);
          if (!_e)
            return console.warn("Could not find a valid 'globalFilter' option."), g;
          C.forEach(function(Ie) {
            var et = Ie.disableGlobalFilter;
            Ie.canFilter = Ne(et === !0 ? !1 : void 0, ae === !0 ? !1 : void 0, !0);
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
          return [Se(g), Ze, it];
        }, [L, H, $, x, C, g, v, S, ae]), Pe = K[0], De = K[1], We = K[2], we = z(Z);
        Q(function() {
          we() && q({
            type: p.resetGlobalFilter
          });
        }, [q, L ? null : d]), Object.assign(l, {
          preGlobalFilteredRows: g,
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
      function hi(l, d) {
        return d.reduce(function(g, v) {
          return g + (typeof v == "number" ? v : 0);
        }, 0);
      }
      function Wr(l) {
        var d = l[0] || 0;
        return l.forEach(function(g) {
          typeof g == "number" && (d = Math.min(d, g));
        }), d;
      }
      function ra(l) {
        var d = l[0] || 0;
        return l.forEach(function(g) {
          typeof g == "number" && (d = Math.max(d, g));
        }), d;
      }
      function Uu(l) {
        var d = l[0] || 0, g = l[0] || 0;
        return l.forEach(function(v) {
          typeof v == "number" && (d = Math.min(d, v), g = Math.max(g, v));
        }), d + ".." + g;
      }
      function ia(l) {
        return hi(null, l) / l.length;
      }
      function Vu(l) {
        if (!l.length)
          return null;
        var d = Math.floor(l.length / 2), g = [].concat(l).sort(function(v, S) {
          return v - S;
        });
        return l.length % 2 !== 0 ? g[d] : (g[d - 1] + g[d]) / 2;
      }
      function qu(l) {
        return Array.from(new Set(l).values());
      }
      function Yu(l) {
        return new Set(l).size;
      }
      function oa(l) {
        return l.length;
      }
      var qi = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        sum: hi,
        min: Wr,
        max: ra,
        minMax: Uu,
        average: ia,
        median: Vu,
        unique: qu,
        uniqueCount: Yu,
        count: oa
      }), Xu = [], Ku = {};
      p.resetGroupBy = "resetGroupBy", p.setGroupBy = "setGroupBy", p.toggleGroupBy = "toggleGroupBy";
      var Yi = function(d) {
        d.getGroupByToggleProps = [aa], d.stateReducers.push(Qu), d.visibleColumnsDeps.push(function(g, v) {
          var S = v.instance;
          return [].concat(g, [S.state.groupBy]);
        }), d.visibleColumns.push(Zu), d.useInstance.push(es), d.prepareRow.push(ts);
      };
      Yi.pluginName = "useGroupBy";
      var aa = function(d, g) {
        var v = g.header;
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
      function Qu(l, d, g, v) {
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
            groupBy: l.groupBy.filter(function(L) {
              return L !== C;
            })
          });
        }
      }
      function Zu(l, d) {
        var g = d.instance.state.groupBy, v = g.map(function(C) {
          return l.find(function(x) {
            return x.id === C;
          });
        }).filter(Boolean), S = l.filter(function(C) {
          return !g.includes(C.id);
        });
        return l = [].concat(v, S), l.forEach(function(C) {
          C.isGrouped = g.includes(C.id), C.groupedIndex = g.indexOf(C.id);
        }), l;
      }
      var Ju = {};
      function es(l) {
        var d = l.data, g = l.rows, v = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.flatHeaders, $ = l.groupByFn, L = $ === void 0 ? ua : $, H = l.manualGroupBy, q = l.aggregations, pe = q === void 0 ? Ju : q, Z = l.plugins, ae = l.state.groupBy, ve = l.dispatch, K = l.autoResetGroupBy, Pe = K === void 0 ? !0 : K, De = l.disableGroupBy, We = l.defaultCanGroupBy, we = l.getHooks;
        G(Z, ["useColumnOrder", "useFilters"], "useGroupBy");
        var Ze = z(l);
        C.forEach(function(qe) {
          var Xe = qe.accessor, Tt = qe.defaultGroupBy, jt = qe.disableGroupBy;
          qe.canGroupBy = Xe ? Ne(qe.canGroupBy, jt === !0 ? !1 : void 0, De === !0 ? !1 : void 0, !0) : Ne(qe.canGroupBy, Tt, We, !1), qe.canGroupBy && (qe.toggleGroupBy = function() {
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
            return [g, v, S, Xu, Ku, v, S];
          var qe = ae.filter(function(zt) {
            return C.find(function(_r) {
              return _r.id === zt;
            });
          }), Xe = function(_r, Kt, Pa) {
            var Sr = {};
            return C.forEach(function($t) {
              if (qe.includes($t.id)) {
                Sr[$t.id] = Kt[0] ? Kt[0].values[$t.id] : null;
                return;
              }
              var Na = typeof $t.aggregate == "function" ? $t.aggregate : pe[$t.aggregate] || qi[$t.aggregate];
              if (Na) {
                var mi = Kt.map(function(qr) {
                  return qr.values[$t.id];
                }), bs = _r.map(function(qr) {
                  var Rr = qr.values[$t.id];
                  if (!Pa && $t.aggregateValue) {
                    var Cr = typeof $t.aggregateValue == "function" ? $t.aggregateValue : pe[$t.aggregateValue] || qi[$t.aggregateValue];
                    if (!Cr)
                      throw console.info({
                        column: $t
                      }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                    Rr = Cr(Rr, qr, $t);
                  }
                  return Rr;
                });
                Sr[$t.id] = Na(bs, mi);
              } else {
                if ($t.aggregate)
                  throw console.info({
                    column: $t
                  }), new Error("React Table: Invalid column.aggregate option for column listed above");
                Sr[$t.id] = null;
              }
            }), Sr;
          }, Tt = [], jt = {}, Vr = [], ro = {}, He = [], Et = {}, Bt = function zt(_r, Kt, Pa) {
            if (Kt === void 0 && (Kt = 0), Kt === qe.length)
              return _r.map(function(mi) {
                return a({}, mi, {
                  depth: Kt
                });
              });
            var Sr = qe[Kt], $t = L(_r, Sr), Na = Object.entries($t).map(function(mi, bs) {
              var qr = mi[0], Rr = mi[1], Cr = Sr + ":" + qr;
              Cr = Pa ? Pa + ">" + Cr : Cr;
              var Mf = zt(Rr, Kt + 1, Cr), Of = Kt ? Ce(Rr, "leafRows") : Rr, Ag = Xe(Of, Rr, Kt), kg = {
                id: Cr,
                isGrouped: !0,
                groupByID: Sr,
                groupByVal: qr,
                values: Ag,
                subRows: Mf,
                leafRows: Of,
                depth: Kt,
                index: bs
              };
              return Mf.forEach(function(qn) {
                Tt.push(qn), jt[qn.id] = qn, qn.isGrouped ? (Vr.push(qn), ro[qn.id] = qn) : (He.push(qn), Et[qn.id] = qn);
              }), kg;
            });
            return Na;
          }, rn = Bt(g);
          return rn.forEach(function(zt) {
            Tt.push(zt), jt[zt.id] = zt, zt.isGrouped ? (Vr.push(zt), ro[zt.id] = zt) : (He.push(zt), Et[zt.id] = zt);
          }), [rn, Tt, jt, Vr, ro, He, Et];
        }, [H, ae, g, v, S, C, pe, L]), Se = ye[0], Ie = ye[1], et = ye[2], tt = ye[3], Rt = ye[4], Me = ye[5], Dt = ye[6], nt = z(Pe);
        Q(function() {
          nt() && ve({
            type: p.resetGroupBy
          });
        }, [ve, H ? null : d]), Object.assign(l, {
          preGroupedRows: g,
          preGroupedFlatRow: v,
          preGroupedRowsById: S,
          groupedRows: Se,
          groupedFlatRows: Ie,
          groupedRowsById: et,
          onlyGroupedFlatRows: tt,
          onlyGroupedRowsById: Rt,
          nonGroupedFlatRows: Me,
          nonGroupedRowsById: Dt,
          rows: Se,
          flatRows: Ie,
          rowsById: et,
          toggleGroupBy: it,
          setGroupBy: _e
        });
      }
      function ts(l) {
        l.allCells.forEach(function(d) {
          var g;
          d.isGrouped = d.column.isGrouped && d.column.id === l.groupByID, d.isPlaceholder = !d.isGrouped && d.column.isGrouped, d.isAggregated = !d.isGrouped && !d.isPlaceholder && ((g = l.subRows) == null ? void 0 : g.length);
        });
      }
      function ua(l, d) {
        return l.reduce(function(g, v, S) {
          var C = "" + v.values[d];
          return g[C] = Array.isArray(g[C]) ? g[C] : [], g[C].push(v), g;
        }, {});
      }
      var sa = /([0-9]+)/gm, ns = function(d, g, v) {
        var S = Ur(d, g, v), C = S[0], x = S[1];
        for (C = ca(C), x = ca(x), C = C.split(sa).filter(Boolean), x = x.split(sa).filter(Boolean); C.length && x.length; ) {
          var $ = C.shift(), L = x.shift(), H = parseInt($, 10), q = parseInt(L, 10), pe = [H, q].sort();
          if (isNaN(pe[0])) {
            if ($ > L)
              return 1;
            if (L > $)
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
      function rs(l, d, g) {
        var v = Ur(l, d, g), S = v[0], C = v[1];
        return S = S.getTime(), C = C.getTime(), Xi(S, C);
      }
      function is(l, d, g) {
        var v = Ur(l, d, g), S = v[0], C = v[1];
        return Xi(S, C);
      }
      function os(l, d, g) {
        var v = Ur(l, d, g), S = v[0], C = v[1];
        for (S = S.split("").filter(Boolean), C = C.split("").filter(Boolean); S.length && C.length; ) {
          var x = S.shift(), $ = C.shift(), L = x.toLowerCase(), H = $.toLowerCase();
          if (L > H)
            return 1;
          if (H > L)
            return -1;
          if (x > $)
            return 1;
          if ($ > x)
            return -1;
        }
        return S.length - C.length;
      }
      function la(l, d, g) {
        var v = Ur(l, d, g), S = v[0], C = v[1], x = /[^0-9.]/gi;
        return S = Number(String(S).replace(x, "")), C = Number(String(C).replace(x, "")), Xi(S, C);
      }
      function Xi(l, d) {
        return l === d ? 0 : l > d ? 1 : -1;
      }
      function Ur(l, d, g) {
        return [l.values[g], d.values[g]];
      }
      function ca(l) {
        return typeof l == "number" ? isNaN(l) || l === 1 / 0 || l === -1 / 0 ? "" : String(l) : typeof l == "string" ? l : "";
      }
      var as = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        alphanumeric: ns,
        datetime: rs,
        basic: is,
        string: os,
        number: la
      });
      p.resetSortBy = "resetSortBy", p.setSortBy = "setSortBy", p.toggleSortBy = "toggleSortBy", p.clearSortBy = "clearSortBy", _.sortType = "alphanumeric", _.sortDescFirst = !1;
      var fa = function(d) {
        d.getSortByToggleProps = [us], d.stateReducers.push(da), d.useInstance.push(pa);
      };
      fa.pluginName = "useSortBy";
      var us = function(d, g) {
        var v = g.instance, S = g.column, C = v.isMultiSortEvent, x = C === void 0 ? function($) {
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
      function da(l, d, g, v) {
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
          var $ = d.columnId, L = d.desc, H = d.multi, q = v.allColumns, pe = v.disableMultiSort, Z = v.disableSortRemove, ae = v.disableMultiRemove, ve = v.maxMultiSortColCount, K = ve === void 0 ? Number.MAX_SAFE_INTEGER : ve, Pe = l.sortBy, De = q.find(function(Se) {
            return Se.id === $;
          }), We = De.sortDescFirst, we = Pe.find(function(Se) {
            return Se.id === $;
          }), Ze = Pe.findIndex(function(Se) {
            return Se.id === $;
          }), it = typeof L < "u" && L !== null, _e = [], ye;
          return !pe && H ? we ? ye = "toggle" : ye = "add" : Ze !== Pe.length - 1 || Pe.length !== 1 ? ye = "replace" : we ? ye = "toggle" : ye = "replace", ye === "toggle" && !Z && !it && (H ? !ae : !0) && (we && we.desc && !We || !we.desc && We) && (ye = "remove"), ye === "replace" ? _e = [{
            id: $,
            desc: it ? L : We
          }] : ye === "add" ? (_e = [].concat(Pe, [{
            id: $,
            desc: it ? L : We
          }]), _e.splice(0, _e.length - K)) : ye === "toggle" ? _e = Pe.map(function(Se) {
            return Se.id === $ ? a({}, Se, {
              desc: it ? L : !we.desc
            }) : Se;
          }) : ye === "remove" && (_e = Pe.filter(function(Se) {
            return Se.id !== $;
          })), a({}, l, {
            sortBy: _e
          });
        }
      }
      function pa(l) {
        var d = l.data, g = l.rows, v = l.flatRows, S = l.allColumns, C = l.orderByFn, x = C === void 0 ? Ki : C, $ = l.sortTypes, L = l.manualSortBy, H = l.defaultCanSort, q = l.disableSortBy, pe = l.flatHeaders, Z = l.state.sortBy, ae = l.dispatch, ve = l.plugins, K = l.getHooks, Pe = l.autoResetSortBy, De = Pe === void 0 ? !0 : Pe;
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
        }, [ae]), Ze = z(l);
        pe.forEach(function(Ie) {
          var et = Ie.accessor, tt = Ie.canSort, Rt = Ie.disableSortBy, Me = Ie.id, Dt = et ? Ne(Rt === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Ne(H, tt, !1);
          Ie.canSort = Dt, Ie.canSort && (Ie.toggleSortBy = function(qe, Xe) {
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
          if (L || !Z.length)
            return [g, v];
          var Ie = [], et = Z.filter(function(Rt) {
            return S.find(function(Me) {
              return Me.id === Rt.id;
            });
          }), tt = function Rt(Me) {
            var Dt = x(
              Me,
              et.map(function(nt) {
                var qe = S.find(function(jt) {
                  return jt.id === nt.id;
                });
                if (!qe)
                  throw new Error("React-Table: Could not find a column with id: " + nt.id + " while sorting");
                var Xe = qe.sortType, Tt = Ae(Xe) || ($ || {})[Xe] || as[Xe];
                if (!Tt)
                  throw new Error("React-Table: Could not find a valid sortType of '" + Xe + "' for column '" + nt.id + "'.");
                return function(jt, Vr) {
                  return Tt(jt, Vr, nt.id, nt.desc);
                };
              }),
              et.map(function(nt) {
                var qe = S.find(function(Xe) {
                  return Xe.id === nt.id;
                });
                return qe && qe.sortInverted ? nt.desc : !nt.desc;
              })
            );
            return Dt.forEach(function(nt) {
              Ie.push(nt), !(!nt.subRows || nt.subRows.length === 0) && (nt.subRows = Rt(nt.subRows));
            }), Dt;
          };
          return [tt(g), Ie];
        }, [L, Z, g, v, S, x, $]), _e = it[0], ye = it[1], Se = z(De);
        Q(function() {
          Se() && ae({
            type: p.resetSortBy
          });
        }, [L ? null : d]), Object.assign(l, {
          preSortedRows: g,
          preSortedFlatRows: v,
          sortedRows: _e,
          sortedFlatRows: ye,
          rows: _e,
          flatRows: ye,
          setSortBy: We,
          toggleSortBy: we
        });
      }
      function Ki(l, d, g) {
        return [].concat(l).sort(function(v, S) {
          for (var C = 0; C < d.length; C += 1) {
            var x = d[C], $ = g[C] === !1 || g[C] === "desc", L = x(v, S);
            if (L !== 0)
              return $ ? -L : L;
          }
          return g[0] ? v.index - S.index : S.index - v.index;
        });
      }
      var ss = "usePagination";
      p.resetPage = "resetPage", p.gotoPage = "gotoPage", p.setPageSize = "setPageSize";
      var ha = function(d) {
        d.stateReducers.push(ls), d.useInstance.push(va);
      };
      ha.pluginName = ss;
      function ls(l, d, g, v) {
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
          var L = d.pageSize, H = l.pageSize * l.pageIndex, q = Math.floor(H / L);
          return a({}, l, {
            pageIndex: q,
            pageSize: L
          });
        }
      }
      function va(l) {
        var d = l.rows, g = l.autoResetPage, v = g === void 0 ? !0 : g, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.plugins, $ = l.pageCount, L = l.paginateExpandedRows, H = L === void 0 ? !0 : L, q = l.expandSubRows, pe = q === void 0 ? !0 : q, Z = l.state, ae = Z.pageSize, ve = Z.pageIndex, K = Z.expanded, Pe = Z.globalFilter, De = Z.filters, We = Z.groupBy, we = Z.sortBy, Ze = l.dispatch, it = l.data, _e = l.manualPagination;
        G(x, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var ye = z(v);
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
            var Tt = ae * ve, jt = Tt + ae;
            Xe = d.slice(Tt, jt);
          }
          return H ? Xe : Re(Xe, {
            manualExpandedKey: C,
            expanded: K,
            expandSubRows: pe
          });
        }, [pe, K, C, _e, ve, ae, H, d]), tt = ve > 0, Rt = Se === -1 ? et.length >= ae : ve < Se - 1, Me = r.useCallback(function(Xe) {
          Ze({
            type: p.gotoPage,
            pageIndex: Xe
          });
        }, [Ze]), Dt = r.useCallback(function() {
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
          canNextPage: Rt,
          gotoPage: Me,
          previousPage: Dt,
          nextPage: nt,
          setPageSize: qe
        });
      }
      p.resetPivot = "resetPivot", p.togglePivot = "togglePivot";
      var ma = function(d) {
        d.getPivotToggleProps = [cs], d.stateReducers.push(ya), d.useInstanceAfterData.push(fs), d.allColumns.push(ds), d.accessValue.push(ps), d.materializedColumns.push(hs), d.materializedColumnsDeps.push(Qi), d.visibleColumns.push(ba), d.visibleColumnsDeps.push(vi), d.useInstance.push(Zi), d.prepareRow.push(Ji);
      };
      ma.pluginName = "usePivotColumns";
      var ga = [], cs = function(d, g) {
        var v = g.header;
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
      function ya(l, d, g, v) {
        if (d.type === p.init)
          return a({
            pivotColumns: ga
          }, l);
        if (d.type === p.resetPivot)
          return a({}, l, {
            pivotColumns: v.initialState.pivotColumns || ga
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
      function fs(l) {
        l.allColumns.forEach(function(d) {
          d.isPivotSource = l.state.pivotColumns.includes(d.id);
        });
      }
      function ds(l, d) {
        var g = d.instance;
        return l.forEach(function(v) {
          v.isPivotSource = g.state.pivotColumns.includes(v.id), v.uniqueValues = /* @__PURE__ */ new Set();
        }), l;
      }
      function ps(l, d) {
        var g = d.column;
        return g.uniqueValues && typeof l < "u" && g.uniqueValues.add(l), l;
      }
      function hs(l, d) {
        var g = d.instance, v = g.allColumns, S = g.state;
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
        }, L = Ue($());
        return [].concat(l, L);
      }
      function Qi(l, d) {
        var g = d.instance.state, v = g.pivotColumns, S = g.groupBy;
        return [].concat(l, [v, S]);
      }
      function ba(l, d) {
        var g = d.instance.state;
        return l = l.filter(function(v) {
          return !v.isPivotSource;
        }), g.pivotColumns.length && g.groupBy && g.groupBy.length && (l = l.filter(function(v) {
          return v.isGrouped || v.isPivoted;
        })), l;
      }
      function vi(l, d) {
        var g = d.instance;
        return [].concat(l, [g.state.pivotColumns, g.state.groupBy]);
      }
      function Zi(l) {
        var d = l.columns, g = l.allColumns, v = l.flatHeaders, S = l.getHooks, C = l.plugins, x = l.dispatch, $ = l.autoResetPivot, L = $ === void 0 ? !0 : $, H = l.manaulPivot, q = l.disablePivot, pe = l.defaultCanPivot;
        G(C, ["useGroupBy"], "usePivotColumns");
        var Z = z(l);
        g.forEach(function(K) {
          var Pe = K.accessor, De = K.defaultPivot, We = K.disablePivot;
          K.canPivot = Pe ? Ne(K.canPivot, We === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Ne(K.canPivot, De, pe, !1), K.canPivot && (K.togglePivot = function() {
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
        var ve = z(L);
        Q(function() {
          ve() && x({
            type: p.resetPivot
          });
        }, [x, H ? null : d]), Object.assign(l, {
          togglePivot: ae
        });
      }
      function Ji(l) {
        l.allCells.forEach(function(d) {
          d.isPivoted = d.column.isPivoted;
        });
      }
      var wa = "useRowSelect";
      p.resetSelectedRows = "resetSelectedRows", p.toggleAllRowsSelected = "toggleAllRowsSelected", p.toggleRowSelected = "toggleRowSelected", p.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var eo = function(d) {
        d.getToggleRowSelectedProps = [vs], d.getToggleAllRowsSelectedProps = [to], d.getToggleAllPageRowsSelectedProps = [ms], d.stateReducers.push(gs), d.useInstance.push(ys), d.prepareRow.push(xa);
      };
      eo.pluginName = wa;
      var vs = function(d, g) {
        var v = g.instance, S = g.row, C = v.manualRowSelectedKey, x = C === void 0 ? "isSelected" : C, $ = !1;
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
      }, to = function(d, g) {
        var v = g.instance;
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
      }, ms = function(d, g) {
        var v = g.instance;
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
      function gs(l, d, g, v) {
        if (d.type === p.init)
          return a({
            selectedRowIds: {}
          }, l);
        if (d.type === p.resetSelectedRows)
          return a({}, l, {
            selectedRowIds: v.initialState.selectedRowIds || {}
          });
        if (d.type === p.toggleAllRowsSelected) {
          var S = d.value, C = v.isAllRowsSelected, x = v.rowsById, $ = v.nonGroupedRowsById, L = $ === void 0 ? x : $, H = typeof S < "u" ? S : !C, q = Object.assign({}, l.selectedRowIds);
          return H ? Object.keys(L).forEach(function(nt) {
            q[nt] = !0;
          }) : Object.keys(L).forEach(function(nt) {
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
          var it = d.value, _e = v.page, ye = v.rowsById, Se = v.selectSubRows, Ie = Se === void 0 ? !0 : Se, et = v.isAllPageRowsSelected, tt = v.getSubRows, Rt = typeof it < "u" ? it : !et, Me = a({}, l.selectedRowIds), Dt = function nt(qe) {
            var Xe = ye[qe];
            if (Xe.isGrouped || (Rt ? Me[qe] = !0 : delete Me[qe]), Ie && tt(Xe))
              return tt(Xe).forEach(function(Tt) {
                return nt(Tt.id);
              });
          };
          return _e.forEach(function(nt) {
            return Dt(nt.id);
          }), a({}, l, {
            selectedRowIds: Me
          });
        }
        return l;
      }
      function ys(l) {
        var d = l.data, g = l.rows, v = l.getHooks, S = l.plugins, C = l.rowsById, x = l.nonGroupedRowsById, $ = x === void 0 ? C : x, L = l.autoResetSelectedRows, H = L === void 0 ? !0 : L, q = l.state.selectedRowIds, pe = l.selectSubRows, Z = pe === void 0 ? !0 : pe, ae = l.dispatch, ve = l.page, K = l.getSubRows;
        G(S, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var Pe = r.useMemo(function() {
          var et = [];
          return g.forEach(function(tt) {
            var Rt = Z ? _a(tt, q, K) : !!q[tt.id];
            tt.isSelected = !!Rt, tt.isSomeSelected = Rt === null, Rt && et.push(tt);
          }), et;
        }, [g, Z, q, K]), De = Boolean(Object.keys($).length && Object.keys(q).length), We = De;
        De && Object.keys($).some(function(et) {
          return !q[et];
        }) && (De = !1), De || ve && ve.length && ve.some(function(et) {
          var tt = et.id;
          return !q[tt];
        }) && (We = !1);
        var we = z(H);
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
        }, [ae]), ye = z(l), Se = k(v().getToggleAllRowsSelectedProps, {
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
        var g = d.instance;
        l.toggleRowSelected = function(v) {
          return g.toggleRowSelected(l.id, v);
        }, l.getToggleRowSelectedProps = k(g.getHooks().getToggleRowSelectedProps, {
          instance: g,
          row: l
        });
      }
      function _a(l, d, g) {
        if (d[l.id])
          return !0;
        var v = g(l);
        if (v && v.length) {
          var S = !0, C = !1;
          return v.forEach(function(x) {
            C && !S || (_a(x, d, g) ? C = !0 : S = !1);
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
        d.stateReducers.push(no), d.useInstance.push(s), d.prepareRow.push(m);
      };
      Ca.pluginName = "useRowState";
      function no(l, d, g, v) {
        var S = v.initialRowStateAccessor, C = S === void 0 ? Sa : S, x = v.initialCellStateAccessor, $ = x === void 0 ? Ra : x, L = v.rowsById;
        if (d.type === p.init)
          return a({
            rowState: {}
          }, l);
        if (d.type === p.resetRowState)
          return a({}, l, {
            rowState: v.initialState.rowState || {}
          });
        if (d.type === p.setRowState) {
          var H, q = d.rowId, pe = d.value, Z = typeof l.rowState[q] < "u" ? l.rowState[q] : C(L[q]);
          return a({}, l, {
            rowState: a({}, l.rowState, (H = {}, H[q] = M(pe, Z), H))
          });
        }
        if (d.type === p.setCellState) {
          var ae, ve, K, Pe, De, We = d.rowId, we = d.columnId, Ze = d.value, it = typeof l.rowState[We] < "u" ? l.rowState[We] : C(L[We]), _e = typeof (it == null || (ae = it.cellState) == null ? void 0 : ae[we]) < "u" ? it.cellState[we] : $((ve = L[We]) == null || (K = ve.cells) == null ? void 0 : K.find(function(ye) {
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
        var d = l.autoResetRowState, g = d === void 0 ? !0 : d, v = l.data, S = l.dispatch, C = r.useCallback(function(L, H) {
          return S({
            type: p.setRowState,
            rowId: L,
            value: H
          });
        }, [S]), x = r.useCallback(function(L, H, q) {
          return S({
            type: p.setCellState,
            rowId: L,
            columnId: H,
            value: q
          });
        }, [S]), $ = z(g);
        Q(function() {
          $() && S({
            type: p.resetRowState
          });
        }, [v]), Object.assign(l, {
          setRowState: C,
          setCellState: x
        });
      }
      function m(l, d) {
        var g = d.instance, v = g.initialRowStateAccessor, S = v === void 0 ? Sa : v, C = g.initialCellStateAccessor, x = C === void 0 ? Ra : C, $ = g.state.rowState;
        l && (l.state = typeof $[l.id] < "u" ? $[l.id] : S(l), l.setState = function(L) {
          return g.setRowState(l.id, L);
        }, l.cells.forEach(function(L) {
          l.state.cellState || (l.state.cellState = {}), L.state = typeof l.state.cellState[L.column.id] < "u" ? l.state.cellState[L.column.id] : x(L), L.setState = function(H) {
            return g.setCellState(l.id, L.column.id, H);
          };
        }));
      }
      p.resetColumnOrder = "resetColumnOrder", p.setColumnOrder = "setColumnOrder";
      var y = function(d) {
        d.stateReducers.push(b), d.visibleColumnsDeps.push(function(g, v) {
          var S = v.instance;
          return [].concat(g, [S.state.columnOrder]);
        }), d.visibleColumns.push(E), d.useInstance.push(R);
      };
      y.pluginName = "useColumnOrder";
      function b(l, d, g, v) {
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
        var g = d.instance.state.columnOrder;
        if (!g || !g.length)
          return l;
        for (var v = [].concat(g), S = [].concat(l), C = [], x = function() {
          var L = v.shift(), H = S.findIndex(function(q) {
            return q.id === L;
          });
          H > -1 && C.push(S.splice(H, 1)[0]);
        }; S.length && v.length; )
          x();
        return [].concat(C, S);
      }
      function R(l) {
        var d = l.dispatch;
        l.setColumnOrder = r.useCallback(function(g) {
          return d({
            type: p.setColumnOrder,
            columnOrder: g
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
      }, j = function(d, g) {
        var v = g.instance, S = g.header, C = v.dispatch, x = function(L, H) {
          var q = !1;
          if (L.type === "touchstart") {
            if (L.touches && L.touches.length > 1)
              return;
            q = !0;
          }
          var pe = ie(H), Z = pe.map(function(_e) {
            return [_e.id, _e.totalWidth];
          }), ae = q ? Math.round(L.touches[0].clientX) : L.clientX, ve, K, Pe = function() {
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
          onMouseDown: function(L) {
            return L.persist() || x(L, S);
          },
          onTouchStart: function(L) {
            return L.persist() || x(L, S);
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
          var g = d.clientX, v = d.columnId, S = d.columnWidth, C = d.headerIdWidths;
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: g,
              headerIdWidths: C,
              columnWidth: S,
              isResizingColumn: v
            })
          });
        }
        if (d.type === p.columnResizing) {
          var x = d.clientX, $ = l.columnResizing, L = $.startX, H = $.columnWidth, q = $.headerIdWidths, pe = q === void 0 ? [] : q, Z = x - L, ae = Z / H, ve = {};
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
        var g = d.flatHeaders, v = d.disableResizing, S = d.getHooks, C = d.state.columnResizing, x = z(d);
        g.forEach(function($) {
          var L = Ne($.disableResizing === !0 ? !1 : void 0, v === !0 ? !1 : void 0, !0);
          $.canResize = L, $.width = C.columnWidths[$.id] || $.originalWidth || $.width, $.isResizing = C.isResizingColumn === $.id, L && ($.getResizerProps = k(S().getResizerProps, {
            instance: x(),
            header: $
          }));
        });
      };
      function se(l) {
        var d = l.plugins, g = l.dispatch, v = l.autoResetResize, S = v === void 0 ? !0 : v, C = l.columns;
        G(d, ["useAbsoluteLayout"], "useResizeColumns");
        var x = z(S);
        Q(function() {
          x() && g({
            type: p.resetResize
          });
        }, [C]);
        var $ = r.useCallback(function() {
          return g({
            type: p.resetResize
          });
        }, [g]);
        Object.assign(l, {
          resetResizing: $
        });
      }
      function ie(l) {
        var d = [], g = function v(S) {
          S.columns && S.columns.length && S.columns.map(v), d.push(S);
        };
        return g(l), d;
      }
      var oe = {
        position: "absolute",
        top: 0
      }, Y = function(d) {
        d.getTableBodyProps.push(ne), d.getRowProps.push(ne), d.getHeaderGroupProps.push(ne), d.getFooterGroupProps.push(ne), d.getHeaderProps.push(function(g, v) {
          var S = v.column;
          return [g, {
            style: a({}, oe, {
              left: S.totalLeft + "px",
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(g, v) {
          var S = v.cell;
          return [g, {
            style: a({}, oe, {
              left: S.column.totalLeft + "px",
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(g, v) {
          var S = v.column;
          return [g, {
            style: a({}, oe, {
              left: S.totalLeft + "px",
              width: S.totalWidth + "px"
            })
          }];
        });
      };
      Y.pluginName = "useAbsoluteLayout";
      var ne = function(d, g) {
        var v = g.instance;
        return [d, {
          style: {
            position: "relative",
            width: v.totalColumnsWidth + "px"
          }
        }];
      }, ge = {
        display: "inline-block",
        boxSizing: "border-box"
      }, xe = function(d, g) {
        var v = g.instance;
        return [d, {
          style: {
            display: "flex",
            width: v.totalColumnsWidth + "px"
          }
        }];
      }, $e = function(d) {
        d.getRowProps.push(xe), d.getHeaderGroupProps.push(xe), d.getFooterGroupProps.push(xe), d.getHeaderProps.push(function(g, v) {
          var S = v.column;
          return [g, {
            style: a({}, ge, {
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(g, v) {
          var S = v.cell;
          return [g, {
            style: a({}, ge, {
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(g, v) {
          var S = v.column;
          return [g, {
            style: a({}, ge, {
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
      var Fe = function(d, g) {
        var v = g.instance;
        return [d, {
          style: {
            minWidth: v.totalColumnsMinWidth + "px"
          }
        }];
      }, le = function(d, g) {
        var v = g.instance;
        return [d, {
          style: {
            display: "flex",
            flex: "1 0 auto",
            minWidth: v.totalColumnsMinWidth + "px"
          }
        }];
      }, Qe = function(d, g) {
        var v = g.column;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: v.totalFlexWidth ? v.totalFlexWidth + " 0 auto" : void 0,
            minWidth: v.totalMinWidth + "px",
            width: v.totalWidth + "px"
          }
        }];
      }, Ee = function(d, g) {
        var v = g.cell;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: v.column.totalFlexWidth + " 0 auto",
            minWidth: v.column.totalMinWidth + "px",
            width: v.column.totalWidth + "px"
          }
        }];
      }, Ye = function(d, g) {
        var v = g.column;
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
        l.stateReducers.push(Ke), l.getTableProps.push(je), l.getHeaderProps.push(Ve), l.getRowProps.push(bt);
      }
      ft.pluginName = "useGridLayout";
      var je = function(d, g) {
        var v = g.instance, S = v.visibleColumns.map(function(C) {
          var x;
          return v.state.gridLayout.columnWidths[C.id] ? v.state.gridLayout.columnWidths[C.id] + "px" : (x = v.state.columnResizing) != null && x.isResizingColumn ? v.state.gridLayout.startWidths[C.id] + "px" : typeof C.width == "number" ? C.width + "px" : C.width;
        });
        return [d, {
          style: {
            display: "grid",
            gridTemplateColumns: S.join(" ")
          }
        }];
      }, Ve = function(d, g) {
        var v = g.column;
        return [d, {
          id: "header-cell-" + v.id,
          style: {
            position: "sticky",
            gridColumn: "span " + v.totalVisibleHeaderCount
          }
        }];
      }, bt = function(d, g) {
        var v = g.row;
        return v.isExpanded ? [d, {
          style: {
            gridColumn: "1 / " + (v.cells.length + 1)
          }
        }] : [d, {}];
      };
      function Ke(l, d, g, v) {
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
          var S = d.columnId, C = d.headerIdWidths, x = vt(S);
          if (x !== void 0) {
            var $ = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = vt(ye.id), Se));
            }, {}), L = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.minWidth, Se));
            }, {}), H = v.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.maxWidth, Se));
            }, {}), q = C.map(function(_e) {
              var ye = _e[0];
              return [ye, vt(ye)];
            });
            return a({}, l, {
              gridLayout: a({}, l.gridLayout, {
                startWidths: $,
                minWidths: L,
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
      function vt(l) {
        var d, g = (d = document.getElementById("header-cell-" + l)) == null ? void 0 : d.offsetWidth;
        if (g !== void 0)
          return g;
      }
      n._UNSTABLE_usePivotColumns = ma, n.actions = p, n.defaultColumn = _, n.defaultGroupByFn = ua, n.defaultOrderByFn = Ki, n.defaultRenderer = w, n.emptyRenderer = P, n.ensurePluginOrder = G, n.flexRender = re, n.functionalUpdate = M, n.loopHooks = T, n.makePropGetter = k, n.makeRenderer = me, n.reduceHooks = F, n.safeUseLayoutEffect = te, n.useAbsoluteLayout = Y, n.useAsyncDebounce = fe, n.useBlockLayout = $e, n.useColumnOrder = y, n.useExpanded = $n, n.useFilters = Mt, n.useFlexLayout = Je, n.useGetLatest = z, n.useGlobalFilter = Hr, n.useGridLayout = ft, n.useGroupBy = Yi, n.useMountedLayoutEffect = Q, n.usePagination = ha, n.useResizeColumns = A, n.useRowSelect = eo, n.useRowState = Ca, n.useSortBy = fa, n.useTable = An, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(La, La.exports)), La.exports;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = SP() : e.exports = RP();
})(Co);
const CP = "_tableFilterContainer_1asr9_10", PP = "_pagination_1asr9_42", NP = "_icon_1asr9_59", TP = "_alignRight_1asr9_133", wi = {
  tableFilterContainer: CP,
  pagination: PP,
  icon: NP,
  alignRight: TP
}, sc = (e) => /* @__PURE__ */ Bn.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Bn.createElement("path", {
  d: "M11.5 6H0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Bn.createElement("path", {
  d: "M7.5 10L11.5 6L7.5 2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
var Ft = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Table/DataTable.tsx";
const EP = ({
  filterValue: e,
  setFilter: t,
  preFilteredRows: n,
  id: r,
  filterData: i
}) => {
  Wt(() => {
    const a = /* @__PURE__ */ new Set();
    return n.forEach(function(u) {
      a.add(u.values[r]);
    }), [...a.values()];
  }, [r, n]);
  const o = i.map((a) => /* @__PURE__ */ B("li", {
    value: e,
    onClick: () => {
      a = a === "ALL" ? void 0 : a, t(a || void 0);
    },
    children: a
  }, void 0, !1, {
    fileName: Ft,
    lineNumber: 28,
    columnNumber: 7
  }, void 0));
  return /* @__PURE__ */ B("ul", {
    children: o
  }, void 0, !1, {
    fileName: Ft,
    lineNumber: 42,
    columnNumber: 5
  }, void 0);
}, xT = ({
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
    previousPage: N,
    state: {
      pageIndex: I
    },
    preGlobalFilteredRows: k,
    setGlobalFilter: F
  } = Co.exports.useTable({
    columns: n,
    data: r
  }, Co.exports.useFilters, Co.exports.useGlobalFilter, Co.exports.usePagination);
  return /* @__PURE__ */ B(zn, {
    children: [/* @__PURE__ */ B("div", {
      className: wi.tableFilterContainer,
      children: [/* @__PURE__ */ B("h3", {
        children: ["  ", 1, "-", P, " of ", r.length, " ", e, " "]
      }, void 0, !0, {
        fileName: Ft,
        lineNumber: 75,
        columnNumber: 11
      }, void 0), /* @__PURE__ */ B("ul", {
        children: /* @__PURE__ */ B(EP, {
          filterValue: void 0,
          setFilter: F,
          preFilteredRows: k,
          id: "type",
          filterData: t
        }, void 0, !1, {
          fileName: Ft,
          lineNumber: 77,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: Ft,
        lineNumber: 76,
        columnNumber: 11
      }, void 0)]
    }, void 0, !0, {
      fileName: Ft,
      lineNumber: 74,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("div", {
      children: /* @__PURE__ */ B("table", {
        ...o(),
        children: [/* @__PURE__ */ B("thead", {
          children: u.map((T) => /* @__PURE__ */ B("tr", {
            ...T.getHeaderGroupProps(),
            children: T.headers.map((G, M) => /* @__PURE__ */ B("th", {
              className: i - 1 === M ? wi.alignRight : "",
              ...G.getHeaderProps(),
              children: G.render("Header")
            }, void 0, !1, {
              fileName: Ft,
              lineNumber: 92,
              columnNumber: 19
            }, void 0))
          }, void 0, !1, {
            fileName: Ft,
            lineNumber: 90,
            columnNumber: 15
          }, void 0))
        }, void 0, !1, {
          fileName: Ft,
          lineNumber: 88,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ B("tbody", {
          ...a(),
          children: c.map((T, G) => (f(T), /* @__PURE__ */ B("tr", {
            ...T.getRowProps(),
            children: T.cells.map((M, z) => /* @__PURE__ */ B("td", {
              className: i - 1 === z ? wi.alignRight : "",
              ...M.getCellProps(),
              children: M.render("Cell")
            }, void 0, !1, {
              fileName: Ft,
              lineNumber: 103,
              columnNumber: 28
            }, void 0))
          }, void 0, !1, {
            fileName: Ft,
            lineNumber: 101,
            columnNumber: 17
          }, void 0)))
        }, void 0, !1, {
          fileName: Ft,
          lineNumber: 97,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: Ft,
        lineNumber: 87,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: Ft,
      lineNumber: 86,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("div", {
      className: wi.pagination,
      children: [/* @__PURE__ */ B("span", {
        children: ["Page", " ", /* @__PURE__ */ B("strong", {
          children: [I + 1, " of ", w.length]
        }, void 0, !0, {
          fileName: Ft,
          lineNumber: 114,
          columnNumber: 13
        }, void 0), " "]
      }, void 0, !0, {
        fileName: Ft,
        lineNumber: 112,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("span", {
        children: [/* @__PURE__ */ B("button", {
          onClick: () => N(),
          disabled: !h,
          children: /* @__PURE__ */ B(sc, {
            className: `${wi.icon}`
          }, void 0, !1, {
            fileName: Ft,
            lineNumber: 120,
            columnNumber: 11
          }, void 0)
        }, void 0, !1, {
          fileName: Ft,
          lineNumber: 119,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ B("button", {
          onClick: () => _(),
          disabled: !p,
          children: /* @__PURE__ */ B(sc, {
            className: `${wi.icon}`
          }, void 0, !1, {
            fileName: Ft,
            lineNumber: 123,
            columnNumber: 13
          }, void 0)
        }, void 0, !1, {
          fileName: Ft,
          lineNumber: 122,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: Ft,
        lineNumber: 118,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Ft,
      lineNumber: 111,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0);
}, MP = "_text_1miab_10", OP = "_xs_1miab_18", AP = "_sm_1miab_22", kP = "_md_1miab_26", $P = "_lg_1miab_30", eh = {
  text: MP,
  xs: OP,
  sm: AP,
  md: kP,
  lg: $P
};
var FP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Display/Display.tsx";
const _T = ({
  children: e,
  large: t = !0,
  ...n
}) => {
  const i = Object.entries({
    extraSmall: "xs",
    small: "sm",
    medium: "md"
  }).reduce((w, [P, _]) => n[P] ? _ : w, "lg"), o = n.className || "", {
    extraSmall: a,
    small: u,
    medium: f,
    large: c,
    ...h
  } = n, p = `${eh[i]} ${eh.text} ${o}`;
  return /* @__PURE__ */ B("h1", {
    ...h,
    className: p,
    children: e
  }, void 0, !1, {
    fileName: FP,
    lineNumber: 36,
    columnNumber: 12
  }, void 0);
}, IP = "_h1_15tfg_10", BP = "_h2_15tfg_10", DP = "_h3_15tfg_10", zP = "_h4_15tfg_10", LP = "_h5_15tfg_10", GP = "_h6_15tfg_10", jP = "_uppercase_15tfg_42", HP = {
  h1: IP,
  h2: BP,
  h3: DP,
  h4: zP,
  h5: LP,
  h6: GP,
  uppercase: jP
};
var WP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Heading/Heading.tsx";
const ST = ({
  children: e,
  as: t = "h1",
  className: n,
  ...r
}) => {
  const i = t || "h1", o = `${HP[t]} ${n || ""}`;
  return /* @__PURE__ */ B(i, {
    ...r,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: WP,
    lineNumber: 17,
    columnNumber: 12
  }, void 0);
}, UP = "_text_1v24t_10", VP = "_prominent_1v24t_17", qP = "_xxl_1v24t_21", YP = "_xl_1v24t_25", XP = "_lg_1v24t_29", KP = "_md_1v24t_33", QP = "_sm_1v24t_37", ZP = "_xs_1v24t_41", ul = {
  text: UP,
  prominent: VP,
  xxl: qP,
  xl: YP,
  lg: XP,
  md: KP,
  sm: QP,
  xs: ZP
};
var JP = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Text/Text.tsx";
const RT = ({
  children: e,
  size: t = "sm",
  as: n = "span",
  prominent: r = !1,
  ...i
}) => {
  const o = `${ul[t]} ${ul.text} ${r ? ul.prominent : ""} ${i.className || ""}`;
  return /* @__PURE__ */ B(n || "span", {
    ...i,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: JP,
    lineNumber: 15,
    columnNumber: 12
  }, void 0);
}, eN = "_outerContainer_e6ykc_1", tN = "_container_e6ykc_12", nN = "_navbar_e6ykc_25", rN = "_fade_e6ykc_35", iN = "_active_e6ykc_48", oN = "_navbarFixed_e6ykc_60", aN = "_fixed_e6ykc_70", uN = "_fluidity_e6ykc_83", Er = {
  outerContainer: eN,
  container: tN,
  navbar: nN,
  fade: rN,
  active: iN,
  navbarFixed: oN,
  fixed: aN,
  fluidity: uN
}, Mg = () => {
  const [e, t] = gn.useState(window.innerWidth);
  return gn.useEffect(() => {
    const n = () => t(window.innerWidth);
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), { width: e };
};
var Ht = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/NavBar/NavBar.tsx";
const CT = ({
  logo: e,
  text: t,
  button: n,
  navLinks: r
}) => {
  const [i, o] = vr(!1), a = () => {
    o(!i);
  }, {
    width: u
  } = Mg(), f = 700, c = r.map((h) => /* @__PURE__ */ B("li", {
    children: [/* @__PURE__ */ B("a", {
      href: `/${h.name.replace(/\s+/g, "")}`,
      className: window.location.pathname.toString() === `/${h.name.replace(/\s+/g, "")}` ? Er.active : "",
      children: h.name.toUpperCase()
    }, void 0, !1, {
      fileName: Ht,
      lineNumber: 48,
      columnNumber: 7
    }, void 0), h.modal && /* @__PURE__ */ B("button", {
      onClick: () => {
      },
      children: /* @__PURE__ */ B("img", {
        src: "./src/assets/images/triangleDown.svg",
        alt: "open resource options"
      }, void 0, !1, {
        fileName: Ht,
        lineNumber: 61,
        columnNumber: 11
      }, void 0)
    }, void 0, !1, {
      fileName: Ht,
      lineNumber: 60,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Ht,
    lineNumber: 47,
    columnNumber: 5
  }, void 0));
  return /* @__PURE__ */ B("div", {
    className: Er.outerContainer,
    children: /* @__PURE__ */ B("div", {
      className: `${Er.container} opacity-5x`,
      children: [/* @__PURE__ */ B("h2", {
        className: Er.fluidity,
        children: t
      }, void 0, !1, {
        fileName: Ht,
        lineNumber: 74,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("div", {
        className: Er.navbarFixed,
        children: /* @__PURE__ */ B("div", {
          className: Er.fixed,
          children: [/* @__PURE__ */ B("div", {
            children: /* @__PURE__ */ B("a", {
              href: "/",
              children: /* @__PURE__ */ B("img", {
                src: e,
                alt: "home page"
              }, void 0, !1, {
                fileName: Ht,
                lineNumber: 80,
                columnNumber: 17
              }, void 0)
            }, void 0, !1, {
              fileName: Ht,
              lineNumber: 78,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Ht,
            lineNumber: 77,
            columnNumber: 13
          }, void 0), /* @__PURE__ */ B(_N, {
            version: n.version,
            type: n.type,
            size: u < f ? "small" : "medium",
            handleClick: n.handleClick,
            children: n.children
          }, void 0, !1, {
            fileName: Ht,
            lineNumber: 84,
            columnNumber: 13
          }, void 0)]
        }, void 0, !0, {
          fileName: Ht,
          lineNumber: 76,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Ht,
        lineNumber: 75,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("div", {
        className: Er.navbar,
        children: /* @__PURE__ */ B("div", {
          className: Er.fade,
          children: [/* @__PURE__ */ B("nav", {
            children: /* @__PURE__ */ B("ul", {
              children: c
            }, void 0, !1, {
              fileName: Ht,
              lineNumber: 97,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Ht,
            lineNumber: 96,
            columnNumber: 13
          }, void 0), i && /* @__PURE__ */ B(FN, {
            handleModal: a,
            navLinks: sN
          }, void 0, !1, {
            fileName: Ht,
            lineNumber: 100,
            columnNumber: 15
          }, void 0)]
        }, void 0, !0, {
          fileName: Ht,
          lineNumber: 95,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Ht,
        lineNumber: 94,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Ht,
      lineNumber: 72,
      columnNumber: 7
    }, void 0)
  }, void 0, !1, {
    fileName: Ht,
    lineNumber: 71,
    columnNumber: 5
  }, void 0);
}, sN = [{
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
}], lN = (e) => /* @__PURE__ */ Bn.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Bn.createElement("path", {
  d: "M6 11.5L6 0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Bn.createElement("path", {
  d: "M10 7.5L6 11.5L2 7.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), cN = "_button_yxs81_10", fN = "_icon_yxs81_26", dN = "_text_yxs81_30", sl = {
  button: cN,
  icon: fN,
  text: dN
};
var ll = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/AnchorButton/AnchorButton.tsx";
const pN = ({
  children: e,
  disabled: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ B("button", {
    className: `${sl.button} ${i}`,
    disabled: t,
    ...r,
    children: [/* @__PURE__ */ B(lN, {
      className: sl.icon
    }, void 0, !1, {
      fileName: ll,
      lineNumber: 17,
      columnNumber: 7
    }, void 0), " ", /* @__PURE__ */ B("div", {
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
}, hN = "_option_gssgp_10", vN = "_optionSelected_gssgp_10", th = {
  option: hN,
  optionSelected: vN
};
var nh = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/FilterButton/FilterButton.tsx";
const mN = ({
  option: e,
  handleFilter: t,
  setOptions: n,
  options: r,
  disabled: i,
  className: o,
  ...a
}) => {
  const u = o || "", f = e.name.includes("any") ? "ANY" : e.name;
  return /* @__PURE__ */ B(zn, {
    children: e.selected ? /* @__PURE__ */ B("button", {
      className: `${th.optionSelected} ${u}`,
      onClick: () => t(e, n, r),
      ...a,
      children: f
    }, void 0, !1, {
      fileName: nh,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ B("button", {
      className: `${th.option} ${u}`,
      onClick: () => i !== !0 && t(e, n, r),
      disabled: i,
      ...a,
      children: f
    }, void 0, !1, {
      fileName: nh,
      lineNumber: 51,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, gN = "_small_tq4rf_18", yN = "_medium_tq4rf_28", bN = "_large_tq4rf_38", wN = "_primary_tq4rf_48", xN = "_secondary_tq4rf_72", Xr = {
  small: gN,
  medium: yN,
  large: bN,
  primary: wN,
  secondary: xN
};
var bo = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/GeneralButton/GeneralButton.tsx";
const _N = ({
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
  return vr(1), /* @__PURE__ */ B(zn, {
    children: t === "primary" && n === "text" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Xr.primary} ${Xr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 34,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon before" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon after" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 52,
      columnNumber: 9
    }, void 0) : n === "icon only" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Xr.iconOnly} ${f}`,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 61,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Xr.secondary} ${Xr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 70,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, SN = (e) => /* @__PURE__ */ Bn.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Bn.createElement("path", {
  d: "M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Bn.createElement("path", {
  d: "M6.5 0.5H11.5V5.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Bn.createElement("path", {
  d: "M11.5 0.5L5.5 6.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), RN = "_button_1cp3n_10", CN = "_icon_1cp3n_24", PN = "_text_1cp3n_32", NN = "_small_1cp3n_62", TN = "_medium_1cp3n_71", EN = "_large_1cp3n_80", wo = {
  button: RN,
  icon: CN,
  text: PN,
  small: NN,
  medium: TN,
  large: EN
};
var Ga = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/LinkButton/LinkButton.tsx";
const Og = ({
  children: e,
  size: t,
  type: n,
  handleClick: r,
  className: i,
  ...o
}) => {
  const a = i || "";
  return /* @__PURE__ */ B("button", {
    className: `${wo.button} ${a}`,
    onClick: r,
    ...o,
    children: [/* @__PURE__ */ B("div", {
      className: `${wo.text} ${wo[t]}`,
      children: e
    }, void 0, !1, {
      fileName: Ga,
      lineNumber: 34,
      columnNumber: 7
    }, void 0), n === "internal" ? /* @__PURE__ */ B(sc, {
      className: `${wo.icon} ${a}`
    }, void 0, !1, {
      fileName: Ga,
      lineNumber: 39,
      columnNumber: 13
    }, void 0) : /* @__PURE__ */ B(SN, {
      className: `${wo.icon} ${a}`
    }, void 0, !1, {
      fileName: Ga,
      lineNumber: 40,
      columnNumber: 13
    }, void 0)]
  }, void 0, !0, {
    fileName: Ga,
    lineNumber: 29,
    columnNumber: 5
  }, void 0);
}, MN = "_button_19s6y_10", ON = "_small_19s6y_56", rh = {
  button: MN,
  default: "_default_19s6y_49",
  small: ON
};
var AN = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Button/TabButton/TabButton.tsx";
const PT = ({
  children: e,
  size: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ B("button", {
    className: `${rh.button} ${rh[t]} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: AN,
    lineNumber: 18,
    columnNumber: 5
  }, void 0);
}, kN = "_container_1cljs_1", $N = "_socials_1cljs_21", ih = {
  container: kN,
  socials: $N
};
var Mr = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/NavBarModal/NavBarModal.tsx";
const FN = ({
  handleModal: e,
  navLinks: t
}) => /* @__PURE__ */ B("div", {
  className: ih.container,
  children: [t.map((n) => /* @__PURE__ */ B("h4", {
    children: /* @__PURE__ */ B("a", {
      onClick: () => e(),
      href: `/resources#${n.children}`,
      children: /* @__PURE__ */ B(Og, {
        size: n.size,
        type: n.type,
        handleClick: () => {
        },
        children: n.children
      }, void 0, !1, {
        fileName: Mr,
        lineNumber: 24,
        columnNumber: 13
      }, void 0)
    }, void 0, !1, {
      fileName: Mr,
      lineNumber: 23,
      columnNumber: 11
    }, void 0)
  }, void 0, !1, {
    fileName: Mr,
    lineNumber: 22,
    columnNumber: 9
  }, void 0)), /* @__PURE__ */ B("div", {
    className: ih.socials,
    children: [/* @__PURE__ */ B("img", {
      src: "/assets/images/socials/twitter.svg"
    }, void 0, !1, {
      fileName: Mr,
      lineNumber: 35,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("img", {
      src: "/assets/images/socials/discord.svg"
    }, void 0, !1, {
      fileName: Mr,
      lineNumber: 36,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("img", {
      src: "/assets/images/socials/telegram.svg"
    }, void 0, !1, {
      fileName: Mr,
      lineNumber: 37,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Mr,
    lineNumber: 34,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Mr,
  lineNumber: 20,
  columnNumber: 5
}, void 0), IN = "_container_gvtd2_10", BN = {
  container: IN
};
var ja = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Navigation/Navigation.tsx";
const NT = ({
  pageLocations: e,
  page: t
}) => /* @__PURE__ */ B("div", {
  className: BN.container,
  children: e.map((n, r) => /* @__PURE__ */ B("h4", {
    children: /* @__PURE__ */ B("a", {
      href: `/${t}#${n.replace(/\s/g, "")}`,
      children: /* @__PURE__ */ B(pN, {
        children: n.toUpperCase()
      }, void 0, !1, {
        fileName: ja,
        lineNumber: 17,
        columnNumber: 14
      }, void 0)
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 16,
      columnNumber: 11
    }, void 0)
  }, `anchor-${r}`, !1, {
    fileName: ja,
    lineNumber: 15,
    columnNumber: 9
  }, void 0))
}, void 0, !1, {
  fileName: ja,
  lineNumber: 13,
  columnNumber: 5
}, void 0), DN = "_grid_fk9zm_10", zN = "_left_fk9zm_23", LN = "_right_fk9zm_23", cl = {
  grid: DN,
  left: zN,
  right: LN
};
var fl = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/ReusableGrid/ReusableGrid.tsx";
const TT = ({
  left: e,
  right: t
}) => /* @__PURE__ */ B("div", {
  className: cl.grid,
  children: [/* @__PURE__ */ B("div", {
    className: cl.left,
    children: e
  }, void 0, !1, {
    fileName: fl,
    lineNumber: 11,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("div", {
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
}, void 0), GN = "_options_gf7vd_1", oh = {
  options: GN
};
var Ha = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Filter/FilterCriteria/FilterCriteria.tsx";
const ET = ({
  children: e,
  options: t,
  handleFilter: n,
  setOptions: r
}) => /* @__PURE__ */ B("div", {
  className: oh.container,
  children: [/* @__PURE__ */ B("h5", {
    children: e
  }, void 0, !1, {
    fileName: Ha,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("div", {
    className: oh.options,
    children: t.map((i, o) => /* @__PURE__ */ B(mN, {
      option: i,
      handleFilter: n,
      setOptions: r,
      options: t
    }, `opt-${o}`, !1, {
      fileName: Ha,
      lineNumber: 35,
      columnNumber: 11
    }, void 0))
  }, void 0, !1, {
    fileName: Ha,
    lineNumber: 33,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Ha,
  lineNumber: 31,
  columnNumber: 5
}, void 0);
var vu = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Tab/Tab.tsx";
const MT = ({
  leading: e,
  children: t,
  active: n
}) => /* @__PURE__ */ B(zn, {
  children: /* @__PURE__ */ B("ul", {
    children: /* @__PURE__ */ B("li", {}, void 0, !1, {
      fileName: vu,
      lineNumber: 19,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: vu,
    lineNumber: 18,
    columnNumber: 9
  }, void 0)
}, void 0, !1), OT = () => /* @__PURE__ */ B(zn, {
  children: /* @__PURE__ */ B("ul", {
    children: /* @__PURE__ */ B("li", {}, void 0, !1, {
      fileName: vu,
      lineNumber: 29,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: vu,
    lineNumber: 28,
    columnNumber: 9
  }, void 0)
}, void 0, !1), jN = "_reverse_1oj07_10", HN = "_row_1oj07_14", ah = {
  reverse: jN,
  row: HN
};
var WN = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Row/Row.tsx";
const AT = ({
  children: e,
  className: t,
  reverse: n,
  ...r
}) => {
  const i = t || "";
  return /* @__PURE__ */ B("div", {
    className: `${ah.row} ${n && ah.reverse} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: WN,
    lineNumber: 22,
    columnNumber: 5
  }, void 0);
}, UN = "_desktop_qcyjs_11", VN = {
  desktop: UN
};
var qN = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/DesktopOnly/DesktopOnly.tsx";
const kT = ({
  children: e,
  className: t,
  ...n
}) => {
  const r = t || "";
  return /* @__PURE__ */ B("div", {
    className: `${VN.desktop} ${r}`,
    ...n,
    children: e
  }, void 0, !1, {
    fileName: qN,
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
}, YN = "_card_gyjdi_17", XN = "_gray_gyjdi_21", KN = "_transparent_gyjdi_24", QN = "_box_gyjdi_28", ZN = "_rounded_gyjdi_33", dl = {
  card: YN,
  gray: XN,
  transparent: KN,
  box: QN,
  rounded: ZN
};
var JN = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Card/Card.tsx";
const $T = ({
  component: e,
  rounded: t,
  className: n,
  children: r,
  type: i,
  ...o
}) => {
  const a = n || "", u = e || "div", f = dl[i || "gray"];
  return /* @__PURE__ */ B(u, {
    className: `${dl.card} ${f} ${t && dl.rounded} ${a}`,
    ...o,
    children: r
  }, void 0, !1, {
    fileName: JN,
    lineNumber: 23,
    columnNumber: 5
  }, void 0);
}, eT = "_container_1kdud_10", tT = "_content_1kdud_16", uh = {
  container: eT,
  content: tT
};
var sh = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/ManualCarousel/ManualCarousel.tsx";
const FT = ({
  children: e
}) => /* @__PURE__ */ B("div", {
  className: uh.container,
  children: /* @__PURE__ */ B("div", {
    className: uh.content,
    children: e
  }, void 0, !1, {
    fileName: sh,
    lineNumber: 20,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: sh,
  lineNumber: 19,
  columnNumber: 5
}, void 0), nT = "_winnersRight_13qvw_10", rT = "_winnersLeft_13qvw_10", iT = "_winnersRightLine_13qvw_23", oT = "_scrollRight_13qvw_1", aT = "_winnersLeftLine_13qvw_54", uT = "_scrollLeft_13qvw_1", sT = "_winnersTop_13qvw_79", lT = "_winnersTopLine_13qvw_93", cT = "_scrollUp_13qvw_1", xi = {
  winnersRight: nT,
  winnersLeft: rT,
  winnersRightLine: iT,
  scrollRight: oT,
  winnersLeftLine: aT,
  scrollLeft: uT,
  winnersTop: sT,
  winnersTopLine: lT,
  scrollUp: cT
};
var lh = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/ContinuousCarousel/ContinuousCarousel.tsx";
const IT = ({
  direction: e,
  children: t
}) => /* @__PURE__ */ B("div", {
  className: e === "right" ? `${xi.winnersRight}` : e === "left" ? `${xi.winnersLeft}` : `${xi.winnersTop}`,
  children: /* @__PURE__ */ B("div", {
    className: e === "right" ? `${xi.winnersRightLine}` : e === "left" ? `${xi.winnersLeftLine}` : `${xi.winnersTopLine}`,
    children: t
  }, void 0, !1, {
    fileName: lh,
    lineNumber: 27,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: lh,
  lineNumber: 18,
  columnNumber: 5
}, void 0), fT = "_container_1cfrf_10", dT = {
  container: fT
};
var Kr = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/FooterItem/FooterItem.tsx";
const BT = ({
  children: e,
  items: t
}) => {
  const {
    width: n
  } = Mg(), r = 620, i = 560;
  console.log("======>", e.replace(/\s+/g, "").toLowerCase());
  const o = /* @__PURE__ */ B("ul", {
    children: t.map((a) => /* @__PURE__ */ B("li", {
      children: /* @__PURE__ */ B("a", {
        href: `/${e.replace(/\s+/g, "").toLowerCase()}#${a.title.toLowerCase()}`,
        children: /* @__PURE__ */ B(Og, {
          handleClick: () => {
          },
          size: n > r ? "large" : n > i && n < r ? "medium" : "small",
          type: a.type,
          children: a.title
        }, void 0, !1, {
          fileName: Kr,
          lineNumber: 35,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: Kr,
        lineNumber: 30,
        columnNumber: 11
      }, void 0)
    }, a.title, !1, {
      fileName: Kr,
      lineNumber: 29,
      columnNumber: 9
    }, void 0))
  }, void 0, !1, {
    fileName: Kr,
    lineNumber: 27,
    columnNumber: 5
  }, void 0);
  return /* @__PURE__ */ B("div", {
    className: dT.container,
    children: [/* @__PURE__ */ B("a", {
      href: `/${e.replace(/\s+/g, "").toLowerCase()}`,
      children: /* @__PURE__ */ B("h1", {
        children: e
      }, void 0, !1, {
        fileName: Kr,
        lineNumber: 57,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: Kr,
      lineNumber: 56,
      columnNumber: 7
    }, void 0), o]
  }, void 0, !0, {
    fileName: Kr,
    lineNumber: 55,
    columnNumber: 5
  }, void 0);
}, pT = "_container_t6o1w_10", hT = {
  container: pT
};
var Wa = "/Users/conno/Fluidity/monorepo/fluidity-app/web/surfing/src/components/Container/Partner/Partner.tsx";
const DT = ({
  img: e,
  title: t,
  info: n
}) => /* @__PURE__ */ B("div", {
  className: hT.container,
  children: [/* @__PURE__ */ B("div", {
    children: e
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 16,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("h3", {
    children: t
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 17,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("p", {
    children: n
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 18,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Wa,
  lineNumber: 15,
  columnNumber: 5
}, void 0);
var vT = /* @__PURE__ */ ((e) => (e.ETH = "ethereum", e.SOL = "solana", e.CMPD = "compound", e.POL = "polygon", e))(vT || {});
const mT = (e) => {
  const t = Math.floor(e), n = Math.max(Math.floor(Math.log(t) / Math.log(1e3)) + 1, 1);
  return `${Array.from(
    { length: n },
    (o, a) => Math.floor(t % 1e3 ** (n - a) / 1e3 ** (n - a - 1))
  ).map((o, a) => a === 0 ? `${o}` : `${o}`.padStart(3, "0")).join(",")}`;
}, zT = (e) => {
  const n = `${Math.floor(e * 100 % 100)}`.padStart(2, "0");
  return `$${mT(e)}.${n}`;
}, ch = 12 / 2, LT = (e) => {
  const t = e.substring(0, ch), n = e.substring(
    e.length - ch,
    e.length
  );
  return `${t}..${n}`;
}, GT = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0"), r = `${e.getFullYear() % 100}`.padStart(2, "0"), i = e.getHours(), o = `${i === 0 ? 0 : i % 12 || 12}`.padStart(2, "0"), a = `${e.getMinutes()}`.padStart(2, "0"), u = i < 12 ? "am" : "pm";
  return `${t}.${n}.${r} ${o}:${a}${u}`;
}, jT = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0");
  return `${e.getFullYear()}-${n}-${t}`;
};
export {
  pN as AnchorButton,
  $T as Card,
  IT as ContinuousCarousel,
  xT as DataTable,
  kT as DesktopOnly,
  _T as Display,
  mN as FilterButton,
  ET as FilterCriteria,
  BT as FooterItem,
  _N as GeneralButton,
  ST as Heading,
  wT as LineChart,
  Og as LinkButton,
  FT as ManualCarousel,
  CT as NavBar,
  FN as NavBarModal,
  NT as Navigation,
  DT as Partner,
  TT as ReusableGrid,
  AT as Row,
  vT as SupportedChains,
  MT as Tab,
  OT as TabBar,
  PT as TabButton,
  RT as Text,
  GT as formatTo12HrDate,
  jT as formatToGraphQLDate,
  mT as numberToCommaSeparated,
  zT as numberToMonetaryString,
  LT as trimAddress
};
