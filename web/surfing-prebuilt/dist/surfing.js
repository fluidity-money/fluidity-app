import * as $n from "react";
import Dn, { useRef as tn, useState as pr, useMemo as Ht, useEffect as on, useLayoutEffect as Em, forwardRef as Mm, useCallback as wt, useContext as an, createContext as up } from "react";
import sp, { unstable_batchedUpdates as Om } from "react-dom";
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
var ke = { exports: {} }, ws = { exports: {} }, St = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Of;
function Am() {
  if (Of)
    return St;
  Of = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, p = e ? Symbol.for("react.forward_ref") : 60112, h = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, T = e ? Symbol.for("react.block") : 60121, B = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, $ = e ? Symbol.for("react.scope") : 60119;
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
            case h:
              return M;
            default:
              switch (M = M && M.$$typeof, M) {
                case u:
                case p:
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
  function L(M) {
    return N(M) === c;
  }
  return St.AsyncMode = f, St.ConcurrentMode = c, St.ContextConsumer = u, St.ContextProvider = a, St.Element = t, St.ForwardRef = p, St.Fragment = r, St.Lazy = _, St.Memo = P, St.Portal = n, St.Profiler = o, St.StrictMode = i, St.Suspense = h, St.isAsyncMode = function(M) {
    return L(M) || N(M) === f;
  }, St.isConcurrentMode = L, St.isContextConsumer = function(M) {
    return N(M) === u;
  }, St.isContextProvider = function(M) {
    return N(M) === a;
  }, St.isElement = function(M) {
    return typeof M == "object" && M !== null && M.$$typeof === t;
  }, St.isForwardRef = function(M) {
    return N(M) === p;
  }, St.isFragment = function(M) {
    return N(M) === r;
  }, St.isLazy = function(M) {
    return N(M) === _;
  }, St.isMemo = function(M) {
    return N(M) === P;
  }, St.isPortal = function(M) {
    return N(M) === n;
  }, St.isProfiler = function(M) {
    return N(M) === o;
  }, St.isStrictMode = function(M) {
    return N(M) === i;
  }, St.isSuspense = function(M) {
    return N(M) === h;
  }, St.isValidElementType = function(M) {
    return typeof M == "string" || typeof M == "function" || M === r || M === c || M === o || M === i || M === h || M === w || typeof M == "object" && M !== null && (M.$$typeof === _ || M.$$typeof === P || M.$$typeof === a || M.$$typeof === u || M.$$typeof === p || M.$$typeof === B || M.$$typeof === k || M.$$typeof === $ || M.$$typeof === T);
  }, St.typeOf = N, St;
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
var Af;
function km() {
  return Af || (Af = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, p = e ? Symbol.for("react.forward_ref") : 60112, h = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, P = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, T = e ? Symbol.for("react.block") : 60121, B = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, $ = e ? Symbol.for("react.scope") : 60119;
    function N(F) {
      return typeof F == "string" || typeof F == "function" || F === r || F === c || F === o || F === i || F === h || F === w || typeof F == "object" && F !== null && (F.$$typeof === _ || F.$$typeof === P || F.$$typeof === a || F.$$typeof === u || F.$$typeof === p || F.$$typeof === B || F.$$typeof === k || F.$$typeof === $ || F.$$typeof === T);
    }
    function L(F) {
      if (typeof F == "object" && F !== null) {
        var gt = F.$$typeof;
        switch (gt) {
          case t:
            var ct = F.type;
            switch (ct) {
              case f:
              case c:
              case r:
              case o:
              case i:
              case h:
                return ct;
              default:
                var _t = ct && ct.$$typeof;
                switch (_t) {
                  case u:
                  case p:
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
    var M = f, D = c, te = u, Q = a, fe = t, ge = p, re = r, ee = _, be = P, Oe = n, ut = o, Ue = i, st = h, lt = !1;
    function dt(F) {
      return lt || (lt = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), V(F) || L(F) === f;
    }
    function V(F) {
      return L(F) === c;
    }
    function ue(F) {
      return L(F) === u;
    }
    function Te(F) {
      return L(F) === a;
    }
    function Ae(F) {
      return typeof F == "object" && F !== null && F.$$typeof === t;
    }
    function Ce(F) {
      return L(F) === p;
    }
    function Se(F) {
      return L(F) === r;
    }
    function Ne(F) {
      return L(F) === _;
    }
    function Fe(F) {
      return L(F) === P;
    }
    function Le(F) {
      return L(F) === n;
    }
    function X(F) {
      return L(F) === o;
    }
    function ce(F) {
      return L(F) === i;
    }
    function je(F) {
      return L(F) === h;
    }
    Ct.AsyncMode = M, Ct.ConcurrentMode = D, Ct.ContextConsumer = te, Ct.ContextProvider = Q, Ct.Element = fe, Ct.ForwardRef = ge, Ct.Fragment = re, Ct.Lazy = ee, Ct.Memo = be, Ct.Portal = Oe, Ct.Profiler = ut, Ct.StrictMode = Ue, Ct.Suspense = st, Ct.isAsyncMode = dt, Ct.isConcurrentMode = V, Ct.isContextConsumer = ue, Ct.isContextProvider = Te, Ct.isElement = Ae, Ct.isForwardRef = Ce, Ct.isFragment = Se, Ct.isLazy = Ne, Ct.isMemo = Fe, Ct.isPortal = Le, Ct.isProfiler = X, Ct.isStrictMode = ce, Ct.isSuspense = je, Ct.isValidElementType = N, Ct.typeOf = L;
  }()), Ct;
}
var kf;
function lp() {
  return kf || (kf = 1, function(e) {
    process.env.NODE_ENV === "production" ? e.exports = Am() : e.exports = km();
  }(ws)), ws.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var xs, If;
function sc() {
  if (If)
    return xs;
  If = 1;
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
      var f = Object.getOwnPropertyNames(a).map(function(p) {
        return a[p];
      });
      if (f.join("") !== "0123456789")
        return !1;
      var c = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(p) {
        c[p] = p;
      }), Object.keys(Object.assign({}, c)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return xs = i() ? Object.assign : function(o, a) {
    for (var u, f = r(o), c, p = 1; p < arguments.length; p++) {
      u = Object(arguments[p]);
      for (var h in u)
        t.call(u, h) && (f[h] = u[h]);
      if (e) {
        c = e(u);
        for (var w = 0; w < c.length; w++)
          n.call(u, c[w]) && (f[c[w]] = u[c[w]]);
      }
    }
    return f;
  }, xs;
}
var _s, $f;
function lc() {
  if ($f)
    return _s;
  $f = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return _s = e, _s;
}
var Rs, Bf;
function cp() {
  return Bf || (Bf = 1, Rs = Function.call.bind(Object.prototype.hasOwnProperty)), Rs;
}
var Ss, Ff;
function Im() {
  if (Ff)
    return Ss;
  Ff = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = lc(), n = {}, r = cp();
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
      for (var p in o)
        if (r(o, p)) {
          var h;
          try {
            if (typeof o[p] != "function") {
              var w = Error(
                (f || "React class") + ": " + u + " type `" + p + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof o[p] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw w.name = "Invariant Violation", w;
            }
            h = o[p](a, p, f, u, null, t);
          } catch (_) {
            h = _;
          }
          if (h && !(h instanceof Error) && e(
            (f || "React class") + ": type specification of " + u + " `" + p + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof h + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), h instanceof Error && !(h.message in n)) {
            n[h.message] = !0;
            var P = c ? c() : "";
            e(
              "Failed " + u + " type: " + h.message + (P != null ? P : "")
            );
          }
        }
    }
  }
  return i.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, Ss = i, Ss;
}
var Cs, Df;
function $m() {
  if (Df)
    return Cs;
  Df = 1;
  var e = lp(), t = sc(), n = lc(), r = cp(), i = Im(), o = function() {
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
    var c = typeof Symbol == "function" && Symbol.iterator, p = "@@iterator";
    function h(V) {
      var ue = V && (c && V[c] || V[p]);
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
      any: $(),
      arrayOf: N,
      element: L(),
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
    function B(V) {
      if (process.env.NODE_ENV !== "production")
        var ue = {}, Te = 0;
      function Ae(Se, Ne, Fe, Le, X, ce, je) {
        if (Le = Le || w, ce = ce || Fe, je !== n) {
          if (f) {
            var F = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw F.name = "Invariant Violation", F;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var gt = Le + ":" + Fe;
            !ue[gt] && Te < 3 && (o(
              "You are manually calling a React.PropTypes validation function for the `" + ce + "` prop on `" + Le + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), ue[gt] = !0, Te++);
          }
        }
        return Ne[Fe] == null ? Se ? Ne[Fe] === null ? new T("The " + X + " `" + ce + "` is marked as required " + ("in `" + Le + "`, but its value is `null`.")) : new T("The " + X + " `" + ce + "` is marked as required in " + ("`" + Le + "`, but its value is `undefined`.")) : null : V(Ne, Fe, Le, X, ce);
      }
      var Ce = Ae.bind(null, !1);
      return Ce.isRequired = Ae.bind(null, !0), Ce;
    }
    function k(V) {
      function ue(Te, Ae, Ce, Se, Ne, Fe) {
        var Le = Te[Ae], X = Ue(Le);
        if (X !== V) {
          var ce = st(Le);
          return new T(
            "Invalid " + Se + " `" + Ne + "` of type " + ("`" + ce + "` supplied to `" + Ce + "`, expected ") + ("`" + V + "`."),
            { expectedType: V }
          );
        }
        return null;
      }
      return B(ue);
    }
    function $() {
      return B(a);
    }
    function N(V) {
      function ue(Te, Ae, Ce, Se, Ne) {
        if (typeof V != "function")
          return new T("Property `" + Ne + "` of component `" + Ce + "` has invalid PropType notation inside arrayOf.");
        var Fe = Te[Ae];
        if (!Array.isArray(Fe)) {
          var Le = Ue(Fe);
          return new T("Invalid " + Se + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an array."));
        }
        for (var X = 0; X < Fe.length; X++) {
          var ce = V(Fe, X, Ce, Se, Ne + "[" + X + "]", n);
          if (ce instanceof Error)
            return ce;
        }
        return null;
      }
      return B(ue);
    }
    function L() {
      function V(ue, Te, Ae, Ce, Se) {
        var Ne = ue[Te];
        if (!u(Ne)) {
          var Fe = Ue(Ne);
          return new T("Invalid " + Ce + " `" + Se + "` of type " + ("`" + Fe + "` supplied to `" + Ae + "`, expected a single ReactElement."));
        }
        return null;
      }
      return B(V);
    }
    function M() {
      function V(ue, Te, Ae, Ce, Se) {
        var Ne = ue[Te];
        if (!e.isValidElementType(Ne)) {
          var Fe = Ue(Ne);
          return new T("Invalid " + Ce + " `" + Se + "` of type " + ("`" + Fe + "` supplied to `" + Ae + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return B(V);
    }
    function D(V) {
      function ue(Te, Ae, Ce, Se, Ne) {
        if (!(Te[Ae] instanceof V)) {
          var Fe = V.name || w, Le = dt(Te[Ae]);
          return new T("Invalid " + Se + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected ") + ("instance of `" + Fe + "`."));
        }
        return null;
      }
      return B(ue);
    }
    function te(V) {
      if (!Array.isArray(V))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? o(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : o("Invalid argument supplied to oneOf, expected an array.")), a;
      function ue(Te, Ae, Ce, Se, Ne) {
        for (var Fe = Te[Ae], Le = 0; Le < V.length; Le++)
          if (_(Fe, V[Le]))
            return null;
        var X = JSON.stringify(V, function(je, F) {
          var gt = st(F);
          return gt === "symbol" ? String(F) : F;
        });
        return new T("Invalid " + Se + " `" + Ne + "` of value `" + String(Fe) + "` " + ("supplied to `" + Ce + "`, expected one of " + X + "."));
      }
      return B(ue);
    }
    function Q(V) {
      function ue(Te, Ae, Ce, Se, Ne) {
        if (typeof V != "function")
          return new T("Property `" + Ne + "` of component `" + Ce + "` has invalid PropType notation inside objectOf.");
        var Fe = Te[Ae], Le = Ue(Fe);
        if (Le !== "object")
          return new T("Invalid " + Se + " `" + Ne + "` of type " + ("`" + Le + "` supplied to `" + Ce + "`, expected an object."));
        for (var X in Fe)
          if (r(Fe, X)) {
            var ce = V(Fe, X, Ce, Se, Ne + "." + X, n);
            if (ce instanceof Error)
              return ce;
          }
        return null;
      }
      return B(ue);
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
      function Ae(Ce, Se, Ne, Fe, Le) {
        for (var X = [], ce = 0; ce < V.length; ce++) {
          var je = V[ce], F = je(Ce, Se, Ne, Fe, Le, n);
          if (F == null)
            return null;
          F.data && r(F.data, "expectedType") && X.push(F.data.expectedType);
        }
        var gt = X.length > 0 ? ", expected one of type [" + X.join(", ") + "]" : "";
        return new T("Invalid " + Fe + " `" + Le + "` supplied to " + ("`" + Ne + "`" + gt + "."));
      }
      return B(Ae);
    }
    function ge() {
      function V(ue, Te, Ae, Ce, Se) {
        return Oe(ue[Te]) ? null : new T("Invalid " + Ce + " `" + Se + "` supplied to " + ("`" + Ae + "`, expected a ReactNode."));
      }
      return B(V);
    }
    function re(V, ue, Te, Ae, Ce) {
      return new T(
        (V || "React class") + ": " + ue + " type `" + Te + "." + Ae + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + Ce + "`."
      );
    }
    function ee(V) {
      function ue(Te, Ae, Ce, Se, Ne) {
        var Fe = Te[Ae], Le = Ue(Fe);
        if (Le !== "object")
          return new T("Invalid " + Se + " `" + Ne + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        for (var X in V) {
          var ce = V[X];
          if (typeof ce != "function")
            return re(Ce, Se, Ne, X, st(ce));
          var je = ce(Fe, X, Ce, Se, Ne + "." + X, n);
          if (je)
            return je;
        }
        return null;
      }
      return B(ue);
    }
    function be(V) {
      function ue(Te, Ae, Ce, Se, Ne) {
        var Fe = Te[Ae], Le = Ue(Fe);
        if (Le !== "object")
          return new T("Invalid " + Se + " `" + Ne + "` of type `" + Le + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        var X = t({}, Te[Ae], V);
        for (var ce in X) {
          var je = V[ce];
          if (r(V, ce) && typeof je != "function")
            return re(Ce, Se, Ne, ce, st(je));
          if (!je)
            return new T(
              "Invalid " + Se + " `" + Ne + "` key `" + ce + "` supplied to `" + Ce + "`.\nBad object: " + JSON.stringify(Te[Ae], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(V), null, "  ")
            );
          var F = je(Fe, ce, Ce, Se, Ne + "." + ce, n);
          if (F)
            return F;
        }
        return null;
      }
      return B(ue);
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
          var ue = h(V);
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
  }, Cs;
}
var Ps, zf;
function Bm() {
  if (zf)
    return Ps;
  zf = 1;
  var e = lc();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, Ps = function() {
    function r(a, u, f, c, p, h) {
      if (h !== e) {
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
  var Fm = lp(), Dm = !0;
  ke.exports = $m()(Fm.isElement, Dm);
} else
  ke.exports = Bm()();
var cc = { exports: {} }, ro = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lf;
function zm() {
  if (Lf)
    return ro;
  if (Lf = 1, sc(), ro.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var e = Symbol.for;
    ro.Fragment = e("react.fragment");
  }
  return ro.jsxDEV = void 0, ro;
}
var Ts = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jf;
function Lm() {
  return jf || (jf = 1, function(e) {
    process.env.NODE_ENV !== "production" && function() {
      var t = Dn, n = sc(), r = 60103, i = 60106;
      e.Fragment = 60107;
      var o = 60108, a = 60114, u = 60109, f = 60110, c = 60112, p = 60113, h = 60120, w = 60115, P = 60116, _ = 60121, T = 60122, B = 60117, k = 60129, $ = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var N = Symbol.for;
        r = N("react.element"), i = N("react.portal"), e.Fragment = N("react.fragment"), o = N("react.strict_mode"), a = N("react.profiler"), u = N("react.provider"), f = N("react.context"), c = N("react.forward_ref"), p = N("react.suspense"), h = N("react.suspense_list"), w = N("react.memo"), P = N("react.lazy"), _ = N("react.block"), T = N("react.server.block"), B = N("react.fundamental"), N("react.scope"), N("react.opaque.id"), k = N("react.debug_trace_mode"), N("react.offscreen"), $ = N("react.legacy_hidden");
      }
      var L = typeof Symbol == "function" && Symbol.iterator, M = "@@iterator";
      function D(O) {
        if (O === null || typeof O != "object")
          return null;
        var J = L && O[L] || O[M];
        return typeof J == "function" ? J : null;
      }
      var te = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function Q(O) {
        {
          for (var J = arguments.length, pe = new Array(J > 1 ? J - 1 : 0), ze = 1; ze < J; ze++)
            pe[ze - 1] = arguments[ze];
          fe("error", O, pe);
        }
      }
      function fe(O, J, pe) {
        {
          var ze = te.ReactDebugCurrentFrame, ht = ze.getStackAddendum();
          ht !== "" && (J += "%s", pe = pe.concat([ht]));
          var mt = pe.map(function(ot) {
            return "" + ot;
          });
          mt.unshift("Warning: " + J), Function.prototype.apply.call(console[O], console, mt);
        }
      }
      var ge = !1;
      function re(O) {
        return !!(typeof O == "string" || typeof O == "function" || O === e.Fragment || O === a || O === k || O === o || O === p || O === h || O === $ || ge || typeof O == "object" && O !== null && (O.$$typeof === P || O.$$typeof === w || O.$$typeof === u || O.$$typeof === f || O.$$typeof === c || O.$$typeof === B || O.$$typeof === _ || O[0] === T));
      }
      function ee(O, J, pe) {
        var ze = J.displayName || J.name || "";
        return O.displayName || (ze !== "" ? pe + "(" + ze + ")" : pe);
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
          case p:
            return "Suspense";
          case h:
            return "SuspenseList";
        }
        if (typeof O == "object")
          switch (O.$$typeof) {
            case f:
              var J = O;
              return be(J) + ".Consumer";
            case u:
              var pe = O;
              return be(pe._context) + ".Provider";
            case c:
              return ee(O, O.render, "ForwardRef");
            case w:
              return Oe(O.type);
            case _:
              return Oe(O._render);
            case P: {
              var ze = O, ht = ze._payload, mt = ze._init;
              try {
                return Oe(mt(ht));
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
      function Se() {
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
      var Ne = te.ReactCurrentDispatcher, Fe;
      function Le(O, J, pe) {
        {
          if (Fe === void 0)
            try {
              throw Error();
            } catch (ht) {
              var ze = ht.stack.trim().match(/\n( *(at )?)/);
              Fe = ze && ze[1] || "";
            }
          return `
` + Fe + O;
        }
      }
      var X = !1, ce;
      {
        var je = typeof WeakMap == "function" ? WeakMap : Map;
        ce = new je();
      }
      function F(O, J) {
        if (!O || X)
          return "";
        {
          var pe = ce.get(O);
          if (pe !== void 0)
            return pe;
        }
        var ze;
        X = !0;
        var ht = Error.prepareStackTrace;
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
                      var hn = `
` + rt[Pt].replace(" at new ", " at ");
                      return typeof O == "function" && ce.set(O, hn), hn;
                    }
                  while (Pt >= 1 && Et >= 0);
                break;
              }
          }
        } finally {
          X = !1, Ne.current = mt, Se(), Error.prepareStackTrace = ht;
        }
        var Un = O ? O.displayName || O.name : "", Hr = Un ? Le(Un) : "";
        return typeof O == "function" && ce.set(O, Hr), Hr;
      }
      function gt(O, J, pe) {
        return F(O, !1);
      }
      function ct(O) {
        var J = O.prototype;
        return !!(J && J.isReactComponent);
      }
      function _t(O, J, pe) {
        if (O == null)
          return "";
        if (typeof O == "function")
          return F(O, ct(O));
        if (typeof O == "string")
          return Le(O);
        switch (O) {
          case p:
            return Le("Suspense");
          case h:
            return Le("SuspenseList");
        }
        if (typeof O == "object")
          switch (O.$$typeof) {
            case c:
              return gt(O.render);
            case w:
              return _t(O.type, J, pe);
            case _:
              return gt(O._render);
            case P: {
              var ze = O, ht = ze._payload, mt = ze._init;
              try {
                return _t(mt(ht), J, pe);
              } catch {
              }
            }
          }
        return "";
      }
      var Ot = {}, Qt = te.ReactDebugCurrentFrame;
      function un(O) {
        if (O) {
          var J = O._owner, pe = _t(O.type, O._source, J ? J.type : null);
          Qt.setExtraStackFrame(pe);
        } else
          Qt.setExtraStackFrame(null);
      }
      function mn(O, J, pe, ze, ht) {
        {
          var mt = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var ot in O)
            if (mt(O, ot)) {
              var rt = void 0;
              try {
                if (typeof O[ot] != "function") {
                  var At = Error((ze || "React class") + ": " + pe + " type `" + ot + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof O[ot] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw At.name = "Invariant Violation", At;
                }
                rt = O[ot](J, ot, ze, pe, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Pt) {
                rt = Pt;
              }
              rt && !(rt instanceof Error) && (un(ht), Q("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ze || "React class", pe, ot, typeof rt), un(null)), rt instanceof Error && !(rt.message in Ot) && (Ot[rt.message] = !0, un(ht), Q("Failed %s type: %s", pe, rt.message), un(null));
            }
        }
      }
      var yn = te.ReactCurrentOwner, bn = Object.prototype.hasOwnProperty, zn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, rr, Ln, wn;
      wn = {};
      function qt(O) {
        if (bn.call(O, "ref")) {
          var J = Object.getOwnPropertyDescriptor(O, "ref").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.ref !== void 0;
      }
      function En(O) {
        if (bn.call(O, "key")) {
          var J = Object.getOwnPropertyDescriptor(O, "key").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.key !== void 0;
      }
      function ir(O, J) {
        if (typeof O.ref == "string" && yn.current && J && yn.current.stateNode !== J) {
          var pe = Oe(yn.current.type);
          wn[pe] || (Q('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Oe(yn.current.type), O.ref), wn[pe] = !0);
        }
      }
      function mr(O, J) {
        {
          var pe = function() {
            rr || (rr = !0, Q("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          pe.isReactWarning = !0, Object.defineProperty(O, "key", {
            get: pe,
            configurable: !0
          });
        }
      }
      function yr(O, J) {
        {
          var pe = function() {
            Ln || (Ln = !0, Q("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
          };
          pe.isReactWarning = !0, Object.defineProperty(O, "ref", {
            get: pe,
            configurable: !0
          });
        }
      }
      var or = function(O, J, pe, ze, ht, mt, ot) {
        var rt = {
          $$typeof: r,
          type: O,
          key: J,
          ref: pe,
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
          value: ht
        }), Object.freeze && (Object.freeze(rt.props), Object.freeze(rt)), rt;
      };
      function br(O, J, pe, ze, ht) {
        {
          var mt, ot = {}, rt = null, At = null;
          pe !== void 0 && (rt = "" + pe), En(J) && (rt = "" + J.key), qt(J) && (At = J.ref, ir(J, ht));
          for (mt in J)
            bn.call(J, mt) && !zn.hasOwnProperty(mt) && (ot[mt] = J[mt]);
          if (O && O.defaultProps) {
            var Pt = O.defaultProps;
            for (mt in Pt)
              ot[mt] === void 0 && (ot[mt] = Pt[mt]);
          }
          if (rt || At) {
            var Et = typeof O == "function" ? O.displayName || O.name || "Unknown" : O;
            rt && mr(ot, Et), At && yr(ot, Et);
          }
          return or(O, rt, At, ht, ze, yn.current, ot);
        }
      }
      var jn = te.ReactCurrentOwner, Gn = te.ReactDebugCurrentFrame;
      function sn(O) {
        if (O) {
          var J = O._owner, pe = _t(O.type, O._source, J ? J.type : null);
          Gn.setExtraStackFrame(pe);
        } else
          Gn.setExtraStackFrame(null);
      }
      var xn;
      xn = !1;
      function Mn(O) {
        return typeof O == "object" && O !== null && O.$$typeof === r;
      }
      function On() {
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
      function ar(O) {
        {
          if (O !== void 0) {
            var J = O.fileName.replace(/^.*[\\\/]/, ""), pe = O.lineNumber;
            return `

Check your code at ` + J + ":" + pe + ".";
          }
          return "";
        }
      }
      var An = {};
      function ur(O) {
        {
          var J = On();
          if (!J) {
            var pe = typeof O == "string" ? O : O.displayName || O.name;
            pe && (J = `

Check the top-level render call using <` + pe + ">.");
          }
          return J;
        }
      }
      function Hn(O, J) {
        {
          if (!O._store || O._store.validated || O.key != null)
            return;
          O._store.validated = !0;
          var pe = ur(J);
          if (An[pe])
            return;
          An[pe] = !0;
          var ze = "";
          O && O._owner && O._owner !== jn.current && (ze = " It was passed a child from " + Oe(O._owner.type) + "."), sn(O), Q('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', pe, ze), sn(null);
        }
      }
      function Wn(O, J) {
        {
          if (typeof O != "object")
            return;
          if (Array.isArray(O))
            for (var pe = 0; pe < O.length; pe++) {
              var ze = O[pe];
              Mn(ze) && Hn(ze, J);
            }
          else if (Mn(O))
            O._store && (O._store.validated = !0);
          else if (O) {
            var ht = D(O);
            if (typeof ht == "function" && ht !== O.entries)
              for (var mt = ht.call(O), ot; !(ot = mt.next()).done; )
                Mn(ot.value) && Hn(ot.value, J);
          }
        }
      }
      function _n(O) {
        {
          var J = O.type;
          if (J == null || typeof J == "string")
            return;
          var pe;
          if (typeof J == "function")
            pe = J.propTypes;
          else if (typeof J == "object" && (J.$$typeof === c || J.$$typeof === w))
            pe = J.propTypes;
          else
            return;
          if (pe) {
            var ze = Oe(J);
            mn(pe, O.props, "prop", ze, O);
          } else if (J.PropTypes !== void 0 && !xn) {
            xn = !0;
            var ht = Oe(J);
            Q("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ht || "Unknown");
          }
          typeof J.getDefaultProps == "function" && !J.getDefaultProps.isReactClassApproved && Q("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function wr(O) {
        {
          for (var J = Object.keys(O.props), pe = 0; pe < J.length; pe++) {
            var ze = J[pe];
            if (ze !== "children" && ze !== "key") {
              sn(O), Q("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ze), sn(null);
              break;
            }
          }
          O.ref !== null && (sn(O), Q("Invalid attribute `ref` supplied to `React.Fragment`."), sn(null));
        }
      }
      function Lt(O, J, pe, ze, ht, mt) {
        {
          var ot = re(O);
          if (!ot) {
            var rt = "";
            (O === void 0 || typeof O == "object" && O !== null && Object.keys(O).length === 0) && (rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var At = ar(ht);
            At ? rt += At : rt += On();
            var Pt;
            O === null ? Pt = "null" : Array.isArray(O) ? Pt = "array" : O !== void 0 && O.$$typeof === r ? (Pt = "<" + (Oe(O.type) || "Unknown") + " />", rt = " Did you accidentally export a JSX literal instead of a component?") : Pt = typeof O, Q("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Pt, rt);
          }
          var Et = br(O, J, pe, ht, mt);
          if (Et == null)
            return Et;
          if (ot) {
            var hn = J.children;
            if (hn !== void 0)
              if (ze)
                if (Array.isArray(hn)) {
                  for (var Un = 0; Un < hn.length; Un++)
                    Wn(hn[Un], O);
                  Object.freeze && Object.freeze(hn);
                } else
                  Q("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Wn(hn, O);
          }
          return O === e.Fragment ? wr(Et) : _n(Et), Et;
        }
      }
      var Yt = Lt;
      e.jsxDEV = Yt;
    }();
  }(Ts)), Ts;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = zm() : e.exports = Lm();
})(cc);
const Fn = cc.exports.Fragment, j = cc.exports.jsxDEV;
function jm(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var fp = jm, Gm = typeof xi == "object" && xi && xi.Object === Object && xi, Hm = Gm, Wm = Hm, Um = typeof self == "object" && self && self.Object === Object && self, Vm = Wm || Um || Function("return this")(), dp = Vm, qm = dp, Ym = function() {
  return qm.Date.now();
}, Xm = Ym, Km = /\s/;
function Qm(e) {
  for (var t = e.length; t-- && Km.test(e.charAt(t)); )
    ;
  return t;
}
var Zm = Qm, Jm = Zm, e0 = /^\s+/;
function t0(e) {
  return e && e.slice(0, Jm(e) + 1).replace(e0, "");
}
var n0 = t0, r0 = dp, i0 = r0.Symbol, hp = i0, Gf = hp, pp = Object.prototype, o0 = pp.hasOwnProperty, a0 = pp.toString, io = Gf ? Gf.toStringTag : void 0;
function u0(e) {
  var t = o0.call(e, io), n = e[io];
  try {
    e[io] = void 0;
    var r = !0;
  } catch {
  }
  var i = a0.call(e);
  return r && (t ? e[io] = n : delete e[io]), i;
}
var s0 = u0, l0 = Object.prototype, c0 = l0.toString;
function f0(e) {
  return c0.call(e);
}
var d0 = f0, Hf = hp, h0 = s0, p0 = d0, v0 = "[object Null]", g0 = "[object Undefined]", Wf = Hf ? Hf.toStringTag : void 0;
function m0(e) {
  return e == null ? e === void 0 ? g0 : v0 : Wf && Wf in Object(e) ? h0(e) : p0(e);
}
var y0 = m0;
function b0(e) {
  return e != null && typeof e == "object";
}
var w0 = b0, x0 = y0, _0 = w0, R0 = "[object Symbol]";
function S0(e) {
  return typeof e == "symbol" || _0(e) && x0(e) == R0;
}
var C0 = S0, P0 = n0, Uf = fp, T0 = C0, Vf = 0 / 0, N0 = /^[-+]0x[0-9a-f]+$/i, E0 = /^0b[01]+$/i, M0 = /^0o[0-7]+$/i, O0 = parseInt;
function A0(e) {
  if (typeof e == "number")
    return e;
  if (T0(e))
    return Vf;
  if (Uf(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Uf(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = P0(e);
  var n = E0.test(e);
  return n || M0.test(e) ? O0(e.slice(2), n ? 2 : 8) : N0.test(e) ? Vf : +e;
}
var k0 = A0, I0 = fp, Ns = Xm, qf = k0, $0 = "Expected a function", B0 = Math.max, F0 = Math.min;
function D0(e, t, n) {
  var r, i, o, a, u, f, c = 0, p = !1, h = !1, w = !0;
  if (typeof e != "function")
    throw new TypeError($0);
  t = qf(t) || 0, I0(n) && (p = !!n.leading, h = "maxWait" in n, o = h ? B0(qf(n.maxWait) || 0, t) : o, w = "trailing" in n ? !!n.trailing : w);
  function P(D) {
    var te = r, Q = i;
    return r = i = void 0, c = D, a = e.apply(Q, te), a;
  }
  function _(D) {
    return c = D, u = setTimeout(k, t), p ? P(D) : a;
  }
  function T(D) {
    var te = D - f, Q = D - c, fe = t - te;
    return h ? F0(fe, o - Q) : fe;
  }
  function B(D) {
    var te = D - f, Q = D - c;
    return f === void 0 || te >= t || te < 0 || h && Q >= o;
  }
  function k() {
    var D = Ns();
    if (B(D))
      return $(D);
    u = setTimeout(k, T(D));
  }
  function $(D) {
    return u = void 0, w && r ? P(D) : (r = i = void 0, a);
  }
  function N() {
    u !== void 0 && clearTimeout(u), c = 0, r = f = i = u = void 0;
  }
  function L() {
    return u === void 0 ? a : $(Ns());
  }
  function M() {
    var D = Ns(), te = B(D);
    if (r = arguments, i = this, f = D, te) {
      if (u === void 0)
        return _(f);
      if (h)
        return clearTimeout(u), u = setTimeout(k, t), P(f);
    }
    return u === void 0 && (u = setTimeout(k, t)), a;
  }
  return M.cancel = N, M.flush = L, M;
}
var vp = D0;
const fc = vp;
var Zr = [], z0 = function() {
  return Zr.some(function(e) {
    return e.activeTargets.length > 0;
  });
}, L0 = function() {
  return Zr.some(function(e) {
    return e.skippedTargets.length > 0;
  });
}, Yf = "ResizeObserver loop completed with undelivered notifications.", j0 = function() {
  var e;
  typeof ErrorEvent == "function" ? e = new ErrorEvent("error", {
    message: Yf
  }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = Yf), window.dispatchEvent(e);
}, ko;
(function(e) {
  e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(ko || (ko = {}));
var Jr = function(e) {
  return Object.freeze(e);
}, gp = function() {
  function e(t, n) {
    this.inlineSize = t, this.blockSize = n, Jr(this);
  }
  return e;
}(), mp = function() {
  function e(t, n, r, i) {
    return this.x = t, this.y = n, this.width = r, this.height = i, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, Jr(this);
  }
  return e.prototype.toJSON = function() {
    var t = this, n = t.x, r = t.y, i = t.top, o = t.right, a = t.bottom, u = t.left, f = t.width, c = t.height;
    return { x: n, y: r, top: i, right: o, bottom: a, left: u, width: f, height: c };
  }, e.fromRect = function(t) {
    return new e(t.x, t.y, t.width, t.height);
  }, e;
}(), dc = function(e) {
  return e instanceof SVGElement && "getBBox" in e;
}, yp = function(e) {
  if (dc(e)) {
    var t = e.getBBox(), n = t.width, r = t.height;
    return !n && !r;
  }
  var i = e, o = i.offsetWidth, a = i.offsetHeight;
  return !(o || a || e.getClientRects().length);
}, Xf = function(e) {
  var t;
  if (e instanceof Element)
    return !0;
  var n = (t = e == null ? void 0 : e.ownerDocument) === null || t === void 0 ? void 0 : t.defaultView;
  return !!(n && e instanceof n.Element);
}, G0 = function(e) {
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
}, Po = typeof window < "u" ? window : {}, Na = /* @__PURE__ */ new WeakMap(), Kf = /auto|scroll/, H0 = /^tb|vertical/, W0 = /msie|trident/i.test(Po.navigator && Po.navigator.userAgent), qn = function(e) {
  return parseFloat(e || "0");
}, Pi = function(e, t, n) {
  return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new gp((n ? t : e) || 0, (n ? e : t) || 0);
}, Qf = Jr({
  devicePixelContentBoxSize: Pi(),
  borderBoxSize: Pi(),
  contentBoxSize: Pi(),
  contentRect: new mp(0, 0, 0, 0)
}), bp = function(e, t) {
  if (t === void 0 && (t = !1), Na.has(e) && !t)
    return Na.get(e);
  if (yp(e))
    return Na.set(e, Qf), Qf;
  var n = getComputedStyle(e), r = dc(e) && e.ownerSVGElement && e.getBBox(), i = !W0 && n.boxSizing === "border-box", o = H0.test(n.writingMode || ""), a = !r && Kf.test(n.overflowY || ""), u = !r && Kf.test(n.overflowX || ""), f = r ? 0 : qn(n.paddingTop), c = r ? 0 : qn(n.paddingRight), p = r ? 0 : qn(n.paddingBottom), h = r ? 0 : qn(n.paddingLeft), w = r ? 0 : qn(n.borderTopWidth), P = r ? 0 : qn(n.borderRightWidth), _ = r ? 0 : qn(n.borderBottomWidth), T = r ? 0 : qn(n.borderLeftWidth), B = h + c, k = f + p, $ = T + P, N = w + _, L = u ? e.offsetHeight - N - e.clientHeight : 0, M = a ? e.offsetWidth - $ - e.clientWidth : 0, D = i ? B + $ : 0, te = i ? k + N : 0, Q = r ? r.width : qn(n.width) - D - M, fe = r ? r.height : qn(n.height) - te - L, ge = Q + B + M + $, re = fe + k + L + N, ee = Jr({
    devicePixelContentBoxSize: Pi(Math.round(Q * devicePixelRatio), Math.round(fe * devicePixelRatio), o),
    borderBoxSize: Pi(ge, re, o),
    contentBoxSize: Pi(Q, fe, o),
    contentRect: new mp(h, f, Q, fe)
  });
  return Na.set(e, ee), ee;
}, wp = function(e, t, n) {
  var r = bp(e, n), i = r.borderBoxSize, o = r.contentBoxSize, a = r.devicePixelContentBoxSize;
  switch (t) {
    case ko.DEVICE_PIXEL_CONTENT_BOX:
      return a;
    case ko.BORDER_BOX:
      return i;
    default:
      return o;
  }
}, xp = function() {
  function e(t) {
    var n = bp(t);
    this.target = t, this.contentRect = n.contentRect, this.borderBoxSize = Jr([n.borderBoxSize]), this.contentBoxSize = Jr([n.contentBoxSize]), this.devicePixelContentBoxSize = Jr([n.devicePixelContentBoxSize]);
  }
  return e;
}(), _p = function(e) {
  if (yp(e))
    return 1 / 0;
  for (var t = 0, n = e.parentNode; n; )
    t += 1, n = n.parentNode;
  return t;
}, U0 = function() {
  var e = 1 / 0, t = [];
  Zr.forEach(function(a) {
    if (a.activeTargets.length !== 0) {
      var u = [];
      a.activeTargets.forEach(function(c) {
        var p = new xp(c.target), h = _p(c.target);
        u.push(p), c.lastReportedSize = wp(c.target, c.observedBox), h < e && (e = h);
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
}, Zf = function(e) {
  Zr.forEach(function(n) {
    n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(i) {
      i.isActive() && (_p(i.target) > e ? n.activeTargets.push(i) : n.skippedTargets.push(i));
    });
  });
}, V0 = function() {
  var e = 0;
  for (Zf(e); z0(); )
    e = U0(), Zf(e);
  return L0() && j0(), e > 0;
}, Es, Rp = [], q0 = function() {
  return Rp.splice(0).forEach(function(e) {
    return e();
  });
}, Y0 = function(e) {
  if (!Es) {
    var t = 0, n = document.createTextNode(""), r = { characterData: !0 };
    new MutationObserver(function() {
      return q0();
    }).observe(n, r), Es = function() {
      n.textContent = "".concat(t ? t-- : t++);
    };
  }
  Rp.push(e), Es();
}, X0 = function(e) {
  Y0(function() {
    requestAnimationFrame(e);
  });
}, Ua = 0, K0 = function() {
  return !!Ua;
}, Q0 = 250, Z0 = { attributes: !0, characterData: !0, childList: !0, subtree: !0 }, Jf = [
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
], ed = function(e) {
  return e === void 0 && (e = 0), Date.now() + e;
}, Ms = !1, J0 = function() {
  function e() {
    var t = this;
    this.stopped = !0, this.listener = function() {
      return t.schedule();
    };
  }
  return e.prototype.run = function(t) {
    var n = this;
    if (t === void 0 && (t = Q0), !Ms) {
      Ms = !0;
      var r = ed(t);
      X0(function() {
        var i = !1;
        try {
          i = V0();
        } finally {
          if (Ms = !1, t = r - ed(), !K0())
            return;
          i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
        }
      });
    }
  }, e.prototype.schedule = function() {
    this.stop(), this.run();
  }, e.prototype.observe = function() {
    var t = this, n = function() {
      return t.observer && t.observer.observe(document.body, Z0);
    };
    document.body ? n() : Po.addEventListener("DOMContentLoaded", n);
  }, e.prototype.start = function() {
    var t = this;
    this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), Jf.forEach(function(n) {
      return Po.addEventListener(n, t.listener, !0);
    }));
  }, e.prototype.stop = function() {
    var t = this;
    this.stopped || (this.observer && this.observer.disconnect(), Jf.forEach(function(n) {
      return Po.removeEventListener(n, t.listener, !0);
    }), this.stopped = !0);
  }, e;
}(), dl = new J0(), td = function(e) {
  !Ua && e > 0 && dl.start(), Ua += e, !Ua && dl.stop();
}, ey = function(e) {
  return !dc(e) && !G0(e) && getComputedStyle(e).display === "inline";
}, ty = function() {
  function e(t, n) {
    this.target = t, this.observedBox = n || ko.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return e.prototype.isActive = function() {
    var t = wp(this.target, this.observedBox, !0);
    return ey(this.target) && (this.lastReportedSize = t), this.lastReportedSize.inlineSize !== t.inlineSize || this.lastReportedSize.blockSize !== t.blockSize;
  }, e;
}(), ny = function() {
  function e(t, n) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = t, this.callback = n;
  }
  return e;
}(), Ea = /* @__PURE__ */ new WeakMap(), nd = function(e, t) {
  for (var n = 0; n < e.length; n += 1)
    if (e[n].target === t)
      return n;
  return -1;
}, Ma = function() {
  function e() {
  }
  return e.connect = function(t, n) {
    var r = new ny(t, n);
    Ea.set(t, r);
  }, e.observe = function(t, n, r) {
    var i = Ea.get(t), o = i.observationTargets.length === 0;
    nd(i.observationTargets, n) < 0 && (o && Zr.push(i), i.observationTargets.push(new ty(n, r && r.box)), td(1), dl.schedule());
  }, e.unobserve = function(t, n) {
    var r = Ea.get(t), i = nd(r.observationTargets, n), o = r.observationTargets.length === 1;
    i >= 0 && (o && Zr.splice(Zr.indexOf(r), 1), r.observationTargets.splice(i, 1), td(-1));
  }, e.disconnect = function(t) {
    var n = this, r = Ea.get(t);
    r.observationTargets.slice().forEach(function(i) {
      return n.unobserve(t, i.target);
    }), r.activeTargets.splice(0, r.activeTargets.length);
  }, e;
}(), ry = function() {
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
    if (!Xf(t))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ma.observe(this, t, n);
  }, e.prototype.unobserve = function(t) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!Xf(t))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ma.unobserve(this, t);
  }, e.prototype.disconnect = function() {
    Ma.disconnect(this);
  }, e.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, e;
}();
const iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ResizeObserver: ry,
  ResizeObserverEntry: xp,
  ResizeObserverSize: gp
}, Symbol.toStringTag, { value: "Module" }));
var oy = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/responsive/esm/components/ParentSizeModern.js", ay = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
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
function uy(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var sy = [];
function Sp(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? sy : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, p = c === void 0 ? !0 : c, h = uy(e, ay), w = tn(null), P = tn(0), _ = pr({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), T = _[0], B = _[1], k = Ht(function() {
    var $ = Array.isArray(a) ? a : [a];
    return fc(function(N) {
      B(function(L) {
        var M = Object.keys(L), D = M.filter(function(Q) {
          return L[Q] !== N[Q];
        }), te = D.every(function(Q) {
          return $.includes(Q);
        });
        return te ? L : N;
      });
    }, i, {
      leading: p
    });
  }, [i, p, a]);
  return on(function() {
    var $ = new window.ResizeObserver(function(N) {
      N.forEach(function(L) {
        var M = L.contentRect, D = M.left, te = M.top, Q = M.width, fe = M.height;
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
    return w.current && $.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), $.disconnect(), k.cancel();
    };
  }, [k]), /* @__PURE__ */ j("div", {
    style: f,
    ref: w,
    className: t,
    ...h,
    children: n(hl({}, T, {
      ref: w.current,
      resize: k
    }))
  }, void 0, !1, {
    fileName: oy,
    lineNumber: 81,
    columnNumber: 23
  }, this);
}
Sp.propTypes = {
  className: ke.exports.string,
  debounceTime: ke.exports.number,
  enableDebounceLeadingCall: ke.exports.bool,
  ignoreDimensions: ke.exports.oneOfType([ke.exports.any, ke.exports.arrayOf(ke.exports.any)]),
  children: ke.exports.func.isRequired
};
var gu = { exports: {} };
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
})(gu);
const ly = gu.exports;
function pl(e, t, n) {
  var r, i, o, a, u;
  t == null && (t = 100);
  function f() {
    var p = Date.now() - a;
    p < t && p >= 0 ? r = setTimeout(f, t - p) : (r = null, n || (u = e.apply(o, i), o = i = null));
  }
  var c = function() {
    o = this, i = arguments, a = Date.now();
    var p = n && !r;
    return r || (r = setTimeout(f, t)), p && (u = e.apply(o, i), o = i = null), u;
  };
  return c.clear = function() {
    r && (clearTimeout(r), r = null);
  }, c.flush = function() {
    r && (u = e.apply(o, i), o = i = null, clearTimeout(r), r = null);
  }, c;
}
pl.debounce = pl;
var rd = pl;
function cy(e) {
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
  const [a, u] = pr({
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
  }), c = t ? typeof t == "number" ? t : t.scroll : null, p = t ? typeof t == "number" ? t : t.resize : null, h = tn(!1);
  on(() => (h.current = !0, () => void (h.current = !1)));
  const [w, P, _] = Ht(() => {
    const $ = () => {
      if (!f.current.element)
        return;
      const {
        left: N,
        top: L,
        width: M,
        height: D,
        bottom: te,
        right: Q,
        x: fe,
        y: ge
      } = f.current.element.getBoundingClientRect(), re = {
        left: N,
        top: L,
        width: M,
        height: D,
        bottom: te,
        right: Q,
        x: fe,
        y: ge
      };
      f.current.element instanceof HTMLElement && i && (re.height = f.current.element.offsetHeight, re.width = f.current.element.offsetWidth), Object.freeze(re), h.current && !py(f.current.lastBounds, re) && u(f.current.lastBounds = re);
    };
    return [$, p ? rd($, p) : $, c ? rd($, c) : $];
  }, [u, i, c, p]);
  function T() {
    f.current.scrollContainers && (f.current.scrollContainers.forEach(($) => $.removeEventListener("scroll", _, !0)), f.current.scrollContainers = null), f.current.resizeObserver && (f.current.resizeObserver.disconnect(), f.current.resizeObserver = null);
  }
  function B() {
    !f.current.element || (f.current.resizeObserver = new o(_), f.current.resizeObserver.observe(f.current.element), n && f.current.scrollContainers && f.current.scrollContainers.forEach(($) => $.addEventListener("scroll", _, {
      capture: !0,
      passive: !0
    })));
  }
  const k = ($) => {
    !$ || $ === f.current.element || (T(), f.current.element = $, f.current.scrollContainers = Cp($), B());
  };
  return dy(_, Boolean(n)), fy(P), on(() => {
    T(), B();
  }, [n, _, P]), on(() => T, []), [k, a, w];
}
function fy(e) {
  on(() => {
    const t = e;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [e]);
}
function dy(e, t) {
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
function Cp(e) {
  const t = [];
  if (!e || e === document.body)
    return t;
  const {
    overflow: n,
    overflowX: r,
    overflowY: i
  } = window.getComputedStyle(e);
  return [n, r, i].some((o) => o === "auto" || o === "scroll") && t.push(e), [...t, ...Cp(e.parentElement)];
}
const hy = ["x", "y", "top", "bottom", "left", "right", "width", "height"], py = (e, t) => hy.every((n) => e[n] === t[n]);
function id(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var od = /* @__PURE__ */ function() {
  function e(n) {
    var r = n.x, i = r === void 0 ? 0 : r, o = n.y, a = o === void 0 ? 0 : o;
    id(this, "x", 0), id(this, "y", 0), this.x = i, this.y = a;
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
function vy(e) {
  return !!e && e instanceof Element;
}
function gy(e) {
  return !!e && (e instanceof SVGElement || "ownerSVGElement" in e);
}
function my(e) {
  return !!e && "createSVGPoint" in e;
}
function yy(e) {
  return !!e && "getScreenCTM" in e;
}
function by(e) {
  return !!e && "changedTouches" in e;
}
function wy(e) {
  return !!e && "clientX" in e;
}
function xy(e) {
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
var Os = {
  x: 0,
  y: 0
};
function _y(e) {
  if (!e)
    return To({}, Os);
  if (by(e))
    return e.changedTouches.length > 0 ? {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    } : To({}, Os);
  if (wy(e))
    return {
      x: e.clientX,
      y: e.clientY
    };
  var t = e == null ? void 0 : e.target, n = t && "getBoundingClientRect" in t ? t.getBoundingClientRect() : null;
  return n ? {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  } : To({}, Os);
}
function ad(e, t) {
  if (!e || !t)
    return null;
  var n = _y(t), r = gy(e) ? e.ownerSVGElement : e, i = yy(r) ? r.getScreenCTM() : null;
  if (my(r) && i) {
    var o = r.createSVGPoint();
    return o.x = n.x, o.y = n.y, o = o.matrixTransform(i.inverse()), new od({
      x: o.x,
      y: o.y
    });
  }
  var a = e.getBoundingClientRect();
  return new od({
    x: n.x - a.left - e.clientLeft,
    y: n.y - a.top - e.clientTop
  });
}
function Ry(e, t) {
  if (vy(e) && t)
    return ad(e, t);
  if (xy(e)) {
    var n = e, r = n.target;
    if (r)
      return ad(r, n);
  }
  return null;
}
var vl = Math.PI, gl = 2 * vl, Kr = 1e-6, Sy = gl - Kr;
function ml() {
  this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
}
function Di() {
  return new ml();
}
ml.prototype = Di.prototype = {
  constructor: ml,
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
    var o = this._x1, a = this._y1, u = n - e, f = r - t, c = o - e, p = a - t, h = c * c + p * p;
    if (i < 0)
      throw new Error("negative radius: " + i);
    if (this._x1 === null)
      this._ += "M" + (this._x1 = e) + "," + (this._y1 = t);
    else if (h > Kr)
      if (!(Math.abs(p * u - f * c) > Kr) || !i)
        this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
      else {
        var w = n - o, P = r - a, _ = u * u + f * f, T = w * w + P * P, B = Math.sqrt(_), k = Math.sqrt(h), $ = i * Math.tan((vl - Math.acos((_ + h - T) / (2 * B * k))) / 2), N = $ / k, L = $ / B;
        Math.abs(N - 1) > Kr && (this._ += "L" + (e + N * c) + "," + (t + N * p)), this._ += "A" + i + "," + i + ",0,0," + +(p * w > c * P) + "," + (this._x1 = e + L * u) + "," + (this._y1 = t + L * f);
      }
  },
  arc: function(e, t, n, r, i, o) {
    e = +e, t = +t, n = +n, o = !!o;
    var a = n * Math.cos(r), u = n * Math.sin(r), f = e + a, c = t + u, p = 1 ^ o, h = o ? r - i : i - r;
    if (n < 0)
      throw new Error("negative radius: " + n);
    this._x1 === null ? this._ += "M" + f + "," + c : (Math.abs(this._x1 - f) > Kr || Math.abs(this._y1 - c) > Kr) && (this._ += "L" + f + "," + c), n && (h < 0 && (h = h % gl + gl), h > Sy ? this._ += "A" + n + "," + n + ",0,1," + p + "," + (e - a) + "," + (t - u) + "A" + n + "," + n + ",0,1," + p + "," + (this._x1 = f) + "," + (this._y1 = c) : h > Kr && (this._ += "A" + n + "," + n + ",0," + +(h >= vl) + "," + p + "," + (this._x1 = e + n * Math.cos(i)) + "," + (this._y1 = t + n * Math.sin(i))));
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
var ud = Math.abs, Zt = Math.atan2, Yr = Math.cos, Cy = Math.max, As = Math.min, Yn = Math.sin, _i = Math.sqrt, Jt = 1e-12, Fr = Math.PI, Xa = Fr / 2, $r = 2 * Fr;
function Py(e) {
  return e > 1 ? 0 : e < -1 ? Fr : Math.acos(e);
}
function sd(e) {
  return e >= 1 ? Xa : e <= -1 ? -Xa : Math.asin(e);
}
function Ty(e) {
  return e.innerRadius;
}
function Ny(e) {
  return e.outerRadius;
}
function Ey(e) {
  return e.startAngle;
}
function My(e) {
  return e.endAngle;
}
function Oy(e) {
  return e && e.padAngle;
}
function Ay(e, t, n, r, i, o, a, u) {
  var f = n - e, c = r - t, p = a - i, h = u - o, w = h * f - p * c;
  if (!(w * w < Jt))
    return w = (p * (t - o) - h * (e - i)) / w, [e + w * f, t + w * c];
}
function Oa(e, t, n, r, i, o, a) {
  var u = e - n, f = t - r, c = (a ? o : -o) / _i(u * u + f * f), p = c * f, h = -c * u, w = e + p, P = t + h, _ = n + p, T = r + h, B = (w + _) / 2, k = (P + T) / 2, $ = _ - w, N = T - P, L = $ * $ + N * N, M = i - o, D = w * T - _ * P, te = (N < 0 ? -1 : 1) * _i(Cy(0, M * M * L - D * D)), Q = (D * N - $ * te) / L, fe = (-D * $ - N * te) / L, ge = (D * N + $ * te) / L, re = (-D * $ + N * te) / L, ee = Q - B, be = fe - k, Oe = ge - B, ut = re - k;
  return ee * ee + be * be > Oe * Oe + ut * ut && (Q = ge, fe = re), {
    cx: Q,
    cy: fe,
    x01: -p,
    y01: -h,
    x11: Q * (i / M - 1),
    y11: fe * (i / M - 1)
  };
}
function ky() {
  var e = Ty, t = Ny, n = vt(0), r = null, i = Ey, o = My, a = Oy, u = null;
  function f() {
    var c, p, h = +e.apply(this, arguments), w = +t.apply(this, arguments), P = i.apply(this, arguments) - Xa, _ = o.apply(this, arguments) - Xa, T = ud(_ - P), B = _ > P;
    if (u || (u = c = Di()), w < h && (p = w, w = h, h = p), !(w > Jt))
      u.moveTo(0, 0);
    else if (T > $r - Jt)
      u.moveTo(w * Yr(P), w * Yn(P)), u.arc(0, 0, w, P, _, !B), h > Jt && (u.moveTo(h * Yr(_), h * Yn(_)), u.arc(0, 0, h, _, P, B));
    else {
      var k = P, $ = _, N = P, L = _, M = T, D = T, te = a.apply(this, arguments) / 2, Q = te > Jt && (r ? +r.apply(this, arguments) : _i(h * h + w * w)), fe = As(ud(w - h) / 2, +n.apply(this, arguments)), ge = fe, re = fe, ee, be;
      if (Q > Jt) {
        var Oe = sd(Q / h * Yn(te)), ut = sd(Q / w * Yn(te));
        (M -= Oe * 2) > Jt ? (Oe *= B ? 1 : -1, N += Oe, L -= Oe) : (M = 0, N = L = (P + _) / 2), (D -= ut * 2) > Jt ? (ut *= B ? 1 : -1, k += ut, $ -= ut) : (D = 0, k = $ = (P + _) / 2);
      }
      var Ue = w * Yr(k), st = w * Yn(k), lt = h * Yr(L), dt = h * Yn(L);
      if (fe > Jt) {
        var V = w * Yr($), ue = w * Yn($), Te = h * Yr(N), Ae = h * Yn(N), Ce;
        if (T < Fr && (Ce = Ay(Ue, st, Te, Ae, V, ue, lt, dt))) {
          var Se = Ue - Ce[0], Ne = st - Ce[1], Fe = V - Ce[0], Le = ue - Ce[1], X = 1 / Yn(Py((Se * Fe + Ne * Le) / (_i(Se * Se + Ne * Ne) * _i(Fe * Fe + Le * Le))) / 2), ce = _i(Ce[0] * Ce[0] + Ce[1] * Ce[1]);
          ge = As(fe, (h - ce) / (X - 1)), re = As(fe, (w - ce) / (X + 1));
        }
      }
      D > Jt ? re > Jt ? (ee = Oa(Te, Ae, Ue, st, w, re, B), be = Oa(V, ue, lt, dt, w, re, B), u.moveTo(ee.cx + ee.x01, ee.cy + ee.y01), re < fe ? u.arc(ee.cx, ee.cy, re, Zt(ee.y01, ee.x01), Zt(be.y01, be.x01), !B) : (u.arc(ee.cx, ee.cy, re, Zt(ee.y01, ee.x01), Zt(ee.y11, ee.x11), !B), u.arc(0, 0, w, Zt(ee.cy + ee.y11, ee.cx + ee.x11), Zt(be.cy + be.y11, be.cx + be.x11), !B), u.arc(be.cx, be.cy, re, Zt(be.y11, be.x11), Zt(be.y01, be.x01), !B))) : (u.moveTo(Ue, st), u.arc(0, 0, w, k, $, !B)) : u.moveTo(Ue, st), !(h > Jt) || !(M > Jt) ? u.lineTo(lt, dt) : ge > Jt ? (ee = Oa(lt, dt, V, ue, h, -ge, B), be = Oa(Ue, st, Te, Ae, h, -ge, B), u.lineTo(ee.cx + ee.x01, ee.cy + ee.y01), ge < fe ? u.arc(ee.cx, ee.cy, ge, Zt(ee.y01, ee.x01), Zt(be.y01, be.x01), !B) : (u.arc(ee.cx, ee.cy, ge, Zt(ee.y01, ee.x01), Zt(ee.y11, ee.x11), !B), u.arc(0, 0, h, Zt(ee.cy + ee.y11, ee.cx + ee.x11), Zt(be.cy + be.y11, be.cx + be.x11), B), u.arc(be.cx, be.cy, ge, Zt(be.y11, be.x11), Zt(be.y01, be.x01), !B))) : u.arc(0, 0, h, L, N, B);
    }
    if (u.closePath(), c)
      return u = null, c + "" || null;
  }
  return f.centroid = function() {
    var c = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2, p = (+i.apply(this, arguments) + +o.apply(this, arguments)) / 2 - Fr / 2;
    return [Yr(p) * c, Yn(p) * c];
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
function Pp(e) {
  this._context = e;
}
Pp.prototype = {
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
function mu(e) {
  return new Pp(e);
}
function hc(e) {
  return e[0];
}
function pc(e) {
  return e[1];
}
function vc() {
  var e = hc, t = pc, n = vt(!0), r = null, i = mu, o = null;
  function a(u) {
    var f, c = u.length, p, h = !1, w;
    for (r == null && (o = i(w = Di())), f = 0; f <= c; ++f)
      !(f < c && n(p = u[f], f, u)) === h && ((h = !h) ? o.lineStart() : o.lineEnd()), h && o.point(+e(p, f, u), +t(p, f, u));
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
function Tp() {
  var e = hc, t = null, n = vt(0), r = pc, i = vt(!0), o = null, a = mu, u = null;
  function f(p) {
    var h, w, P, _ = p.length, T, B = !1, k, $ = new Array(_), N = new Array(_);
    for (o == null && (u = a(k = Di())), h = 0; h <= _; ++h) {
      if (!(h < _ && i(T = p[h], h, p)) === B)
        if (B = !B)
          w = h, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), P = h - 1; P >= w; --P)
            u.point($[P], N[P]);
          u.lineEnd(), u.areaEnd();
        }
      B && ($[h] = +e(T, h, p), N[h] = +n(T, h, p), u.point(t ? +t(T, h, p) : $[h], r ? +r(T, h, p) : N[h]));
    }
    if (k)
      return u = null, k + "" || null;
  }
  function c() {
    return vc().defined(i).curve(a).context(o);
  }
  return f.x = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : vt(+p), t = null, f) : e;
  }, f.x0 = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : vt(+p), f) : e;
  }, f.x1 = function(p) {
    return arguments.length ? (t = p == null ? null : typeof p == "function" ? p : vt(+p), f) : t;
  }, f.y = function(p) {
    return arguments.length ? (n = typeof p == "function" ? p : vt(+p), r = null, f) : n;
  }, f.y0 = function(p) {
    return arguments.length ? (n = typeof p == "function" ? p : vt(+p), f) : n;
  }, f.y1 = function(p) {
    return arguments.length ? (r = p == null ? null : typeof p == "function" ? p : vt(+p), f) : r;
  }, f.lineX0 = f.lineY0 = function() {
    return c().x(e).y(n);
  }, f.lineY1 = function() {
    return c().x(e).y(r);
  }, f.lineX1 = function() {
    return c().x(t).y(n);
  }, f.defined = function(p) {
    return arguments.length ? (i = typeof p == "function" ? p : vt(!!p), f) : i;
  }, f.curve = function(p) {
    return arguments.length ? (a = p, o != null && (u = a(o)), f) : a;
  }, f.context = function(p) {
    return arguments.length ? (p == null ? o = u = null : u = a(o = p), f) : o;
  }, f;
}
function Iy(e, t) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function $y(e) {
  return e;
}
function By() {
  var e = $y, t = Iy, n = null, r = vt(0), i = vt($r), o = vt(0);
  function a(u) {
    var f, c = u.length, p, h, w = 0, P = new Array(c), _ = new Array(c), T = +r.apply(this, arguments), B = Math.min($r, Math.max(-$r, i.apply(this, arguments) - T)), k, $ = Math.min(Math.abs(B) / c, o.apply(this, arguments)), N = $ * (B < 0 ? -1 : 1), L;
    for (f = 0; f < c; ++f)
      (L = _[P[f] = f] = +e(u[f], f, u)) > 0 && (w += L);
    for (t != null ? P.sort(function(M, D) {
      return t(_[M], _[D]);
    }) : n != null && P.sort(function(M, D) {
      return n(u[M], u[D]);
    }), f = 0, h = w ? (B - c * N) / w : 0; f < c; ++f, T = k)
      p = P[f], L = _[p], k = T + (L > 0 ? L * h : 0) + N, _[p] = {
        data: u[p],
        index: f,
        value: L,
        startAngle: T,
        endAngle: k,
        padAngle: $
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
var Np = gc(mu);
function Ep(e) {
  this._curve = e;
}
Ep.prototype = {
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
    return new Ep(e(n));
  }
  return t._curve = e, t;
}
function xo(e) {
  var t = e.curve;
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e.curve = function(n) {
    return arguments.length ? t(gc(n)) : t()._curve;
  }, e;
}
function ld() {
  return xo(vc().curve(Np));
}
function cd() {
  var e = Tp().curve(Np), t = e.curve, n = e.lineX0, r = e.lineX1, i = e.lineY0, o = e.lineY1;
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
var yl = Array.prototype.slice;
function Fy(e) {
  return e.source;
}
function Dy(e) {
  return e.target;
}
function mc(e) {
  var t = Fy, n = Dy, r = hc, i = pc, o = null;
  function a() {
    var u, f = yl.call(arguments), c = t.apply(this, f), p = n.apply(this, f);
    if (o || (o = u = Di()), e(o, +r.apply(this, (f[0] = c, f)), +i.apply(this, f), +r.apply(this, (f[0] = p, f)), +i.apply(this, f)), u)
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
function zy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t = (t + r) / 2, n, t, i, r, i);
}
function Ly(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t, n = (n + i) / 2, r, n, r, i);
}
function jy(e, t, n, r, i) {
  var o = _o(t, n), a = _o(t, n = (n + i) / 2), u = _o(r, n), f = _o(r, i);
  e.moveTo(o[0], o[1]), e.bezierCurveTo(a[0], a[1], u[0], u[1], f[0], f[1]);
}
function Gy() {
  return mc(zy);
}
function Hy() {
  return mc(Ly);
}
function Wy() {
  var e = mc(jy);
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e;
}
const yc = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Fr);
    e.moveTo(n, 0), e.arc(0, 0, n, 0, $r);
  }
}, Mp = {
  draw: function(e, t) {
    var n = Math.sqrt(t / 5) / 2;
    e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
  }
};
var Op = Math.sqrt(1 / 3), Uy = Op * 2;
const Ap = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Uy), r = n * Op;
    e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
  }
};
var Vy = 0.8908130915292852, kp = Math.sin(Fr / 10) / Math.sin(7 * Fr / 10), qy = Math.sin($r / 10) * kp, Yy = -Math.cos($r / 10) * kp;
const Ip = {
  draw: function(e, t) {
    var n = Math.sqrt(t * Vy), r = qy * n, i = Yy * n;
    e.moveTo(0, -n), e.lineTo(r, i);
    for (var o = 1; o < 5; ++o) {
      var a = $r * o / 5, u = Math.cos(a), f = Math.sin(a);
      e.lineTo(f * n, -u * n), e.lineTo(u * r - f * i, f * r + u * i);
    }
    e.closePath();
  }
}, $p = {
  draw: function(e, t) {
    var n = Math.sqrt(t), r = -n / 2;
    e.rect(r, r, n, n);
  }
};
var ks = Math.sqrt(3);
const Bp = {
  draw: function(e, t) {
    var n = -Math.sqrt(t / (ks * 3));
    e.moveTo(0, n * 2), e.lineTo(-ks * n, -n), e.lineTo(ks * n, -n), e.closePath();
  }
};
var Rn = -0.5, Sn = Math.sqrt(3) / 2, bl = 1 / Math.sqrt(12), Xy = (bl / 2 + 1) * 3;
const Fp = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Xy), r = n / 2, i = n * bl, o = r, a = n * bl + n, u = -o, f = a;
    e.moveTo(r, i), e.lineTo(o, a), e.lineTo(u, f), e.lineTo(Rn * r - Sn * i, Sn * r + Rn * i), e.lineTo(Rn * o - Sn * a, Sn * o + Rn * a), e.lineTo(Rn * u - Sn * f, Sn * u + Rn * f), e.lineTo(Rn * r + Sn * i, Rn * i - Sn * r), e.lineTo(Rn * o + Sn * a, Rn * a - Sn * o), e.lineTo(Rn * u + Sn * f, Rn * f - Sn * u), e.closePath();
  }
};
var Ky = [
  yc,
  Mp,
  Ap,
  $p,
  Ip,
  Bp,
  Fp
];
function Qy() {
  var e = vt(yc), t = vt(64), n = null;
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
function Zy(e) {
  return new yu(e);
}
function Dp(e) {
  this._context = e;
}
Dp.prototype = {
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
function Jy(e) {
  return new Dp(e);
}
function zp(e) {
  this._context = e;
}
zp.prototype = {
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
function eb(e) {
  return new zp(e);
}
function Lp(e, t) {
  this._basis = new yu(e), this._beta = t;
}
Lp.prototype = {
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
const tb = function e(t) {
  function n(r) {
    return t === 1 ? new yu(r) : new Lp(r, t);
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
function bc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
bc.prototype = {
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
const nb = function e(t) {
  function n(r) {
    return new bc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function wc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
wc.prototype = {
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
const rb = function e(t) {
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
const ib = function e(t) {
  function n(r) {
    return new xc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function _c(e, t, n) {
  var r = e._x1, i = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > Jt) {
    var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, f = 3 * e._l01_a * (e._l01_a + e._l12_a);
    r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / f, i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / f;
  }
  if (e._l23_a > Jt) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, p = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / p, a = (a * c + e._y1 * e._l23_2a - n * e._l12_2a) / p;
  }
  e._context.bezierCurveTo(r, i, o, a, e._x2, e._y2);
}
function jp(e, t) {
  this._context = e, this._alpha = t;
}
jp.prototype = {
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
        _c(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ob = function e(t) {
  function n(r) {
    return t ? new jp(r, t) : new bc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Gp(e, t) {
  this._context = e, this._alpha = t;
}
Gp.prototype = {
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
        _c(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ab = function e(t) {
  function n(r) {
    return t ? new Gp(r, t) : new wc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Hp(e, t) {
  this._context = e, this._alpha = t;
}
Hp.prototype = {
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
        _c(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const ub = function e(t) {
  function n(r) {
    return t ? new Hp(r, t) : new xc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Wp(e) {
  this._context = e;
}
Wp.prototype = {
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
function sb(e) {
  return new Wp(e);
}
function fd(e) {
  return e < 0 ? -1 : 1;
}
function dd(e, t, n) {
  var r = e._x1 - e._x0, i = t - e._x1, o = (e._y1 - e._y0) / (r || i < 0 && -0), a = (n - e._y1) / (i || r < 0 && -0), u = (o * i + a * r) / (r + i);
  return (fd(o) + fd(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(u)) || 0;
}
function hd(e, t) {
  var n = e._x1 - e._x0;
  return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Is(e, t, n) {
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
        Is(this, this._t0, hd(this, this._t0));
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
          this._point = 3, Is(this, hd(this, n = dd(this, e, t)), n);
          break;
        default:
          Is(this, this._t0, n = dd(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
    }
  }
};
function Up(e) {
  this._context = new Vp(e);
}
(Up.prototype = Object.create(Za.prototype)).point = function(e, t) {
  Za.prototype.point.call(this, t, e);
};
function Vp(e) {
  this._context = e;
}
Vp.prototype = {
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
function lb(e) {
  return new Za(e);
}
function cb(e) {
  return new Up(e);
}
function qp(e) {
  this._context = e;
}
qp.prototype = {
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
        for (var r = pd(e), i = pd(t), o = 0, a = 1; a < n; ++o, ++a)
          this._context.bezierCurveTo(r[0][o], i[0][o], r[1][o], i[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function pd(e) {
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
function fb(e) {
  return new qp(e);
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
function db(e) {
  return new bu(e, 0.5);
}
function hb(e) {
  return new bu(e, 0);
}
function pb(e) {
  return new bu(e, 1);
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
function vb(e, t) {
  return e[t];
}
function gb() {
  var e = vt([]), t = ki, n = Ai, r = vb;
  function i(o) {
    var a = e.apply(this, arguments), u, f = o.length, c = a.length, p = new Array(c), h;
    for (u = 0; u < c; ++u) {
      for (var w = a[u], P = p[u] = new Array(f), _ = 0, T; _ < f; ++_)
        P[_] = T = [0, +r(o[_], w, _, o)], T.data = o[_];
      P.key = w;
    }
    for (u = 0, h = t(p); u < c; ++u)
      p[h[u]].index = u;
    return n(p, h), p;
  }
  return i.keys = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : vt(yl.call(o)), i) : e;
  }, i.value = function(o) {
    return arguments.length ? (r = typeof o == "function" ? o : vt(+o), i) : r;
  }, i.order = function(o) {
    return arguments.length ? (t = o == null ? ki : typeof o == "function" ? o : vt(yl.call(o)), i) : t;
  }, i.offset = function(o) {
    return arguments.length ? (n = o == null ? Ai : o, i) : n;
  }, i;
}
function mb(e, t) {
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
function yb(e, t) {
  if ((f = e.length) > 0)
    for (var n, r = 0, i, o, a, u, f, c = e[t[0]].length; r < c; ++r)
      for (a = u = 0, n = 0; n < f; ++n)
        (o = (i = e[t[n]][r])[1] - i[0]) > 0 ? (i[0] = a, i[1] = a += o) : o < 0 ? (i[1] = u, i[0] = u += o) : (i[0] = 0, i[1] = o);
}
function bb(e, t) {
  if ((i = e.length) > 0) {
    for (var n = 0, r = e[t[0]], i, o = r.length; n < o; ++n) {
      for (var a = 0, u = 0; a < i; ++a)
        u += e[a][n][1] || 0;
      r[n][1] += r[n][0] = -u / 2;
    }
    Ai(e, t);
  }
}
function wb(e, t) {
  if (!(!((a = e.length) > 0) || !((o = (i = e[t[0]]).length) > 0))) {
    for (var n = 0, r = 1, i, o, a; r < o; ++r) {
      for (var u = 0, f = 0, c = 0; u < a; ++u) {
        for (var p = e[t[u]], h = p[r][1] || 0, w = p[r - 1][1] || 0, P = (h - w) / 2, _ = 0; _ < u; ++_) {
          var T = e[t[_]], B = T[r][1] || 0, k = T[r - 1][1] || 0;
          P += B - k;
        }
        f += h, c += P * h;
      }
      i[r - 1][1] += i[r - 1][0] = n, f && (n -= c / f);
    }
    i[r - 1][1] += i[r - 1][0] = n, Ai(e, t);
  }
}
function Yp(e) {
  var t = e.map(xb);
  return ki(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function xb(e) {
  for (var t = -1, n = 0, r = e.length, i, o = -1 / 0; ++t < r; )
    (i = +e[t][1]) > o && (o = i, n = t);
  return n;
}
function Xp(e) {
  var t = e.map(Kp);
  return ki(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function Kp(e) {
  for (var t = 0, n = -1, r = e.length, i; ++n < r; )
    (i = +e[n][1]) && (t += i);
  return t;
}
function _b(e) {
  return Xp(e).reverse();
}
function Rb(e) {
  var t = e.length, n, r, i = e.map(Kp), o = Yp(e), a = 0, u = 0, f = [], c = [];
  for (n = 0; n < t; ++n)
    r = o[n], a < u ? (a += i[r], f.push(r)) : (u += i[r], c.push(r));
  return c.reverse().concat(f);
}
function Sb(e) {
  return ki(e).reverse();
}
const Cb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arc: ky,
  area: Tp,
  line: vc,
  pie: By,
  areaRadial: cd,
  radialArea: cd,
  lineRadial: ld,
  radialLine: ld,
  pointRadial: _o,
  linkHorizontal: Gy,
  linkVertical: Hy,
  linkRadial: Wy,
  symbol: Qy,
  symbols: Ky,
  symbolCircle: yc,
  symbolCross: Mp,
  symbolDiamond: Ap,
  symbolSquare: $p,
  symbolStar: Ip,
  symbolTriangle: Bp,
  symbolWye: Fp,
  curveBasisClosed: Jy,
  curveBasisOpen: eb,
  curveBasis: Zy,
  curveBundle: tb,
  curveCardinalClosed: rb,
  curveCardinalOpen: ib,
  curveCardinal: nb,
  curveCatmullRomClosed: ab,
  curveCatmullRomOpen: ub,
  curveCatmullRom: ob,
  curveLinearClosed: sb,
  curveLinear: mu,
  curveMonotoneX: lb,
  curveMonotoneY: cb,
  curveNatural: fb,
  curveStep: db,
  curveStepAfter: pb,
  curveStepBefore: hb,
  stack: gb,
  stackOffsetExpand: mb,
  stackOffsetDiverging: yb,
  stackOffsetNone: Ai,
  stackOffsetSilhouette: bb,
  stackOffsetWiggle: wb,
  stackOrderAppearance: Yp,
  stackOrderAscending: Xp,
  stackOrderDescending: _b,
  stackOrderInsideOut: Rb,
  stackOrderNone: ki,
  stackOrderReverse: Sb
}, Symbol.toStringTag, { value: "Module" }));
function qo(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function wu(e) {
  let t = e, n = e;
  e.length === 1 && (t = (a, u) => e(a) - u, n = Pb(e));
  function r(a, u, f, c) {
    for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
      const p = f + c >>> 1;
      n(a[p], u) < 0 ? f = p + 1 : c = p;
    }
    return f;
  }
  function i(a, u, f, c) {
    for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
      const p = f + c >>> 1;
      n(a[p], u) > 0 ? c = p : f = p + 1;
    }
    return f;
  }
  function o(a, u, f, c) {
    f == null && (f = 0), c == null && (c = a.length);
    const p = r(a, u, f, c - 1);
    return p > f && t(a[p - 1], u) > -t(a[p], u) ? p - 1 : p;
  }
  return { left: r, center: o, right: i };
}
function Pb(e) {
  return (t, n) => qo(e(t), n);
}
function Qp(e) {
  return e === null ? NaN : +e;
}
function* Tb(e, t) {
  if (t === void 0)
    for (let n of e)
      n != null && (n = +n) >= n && (yield n);
  else {
    let n = -1;
    for (let r of e)
      (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
  }
}
const Zp = wu(qo), Nb = Zp.right, Eb = Zp.left;
wu(Qp).center;
const Yo = Nb;
function vd(e, t) {
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
var wl = Math.sqrt(50), xl = Math.sqrt(10), _l = Math.sqrt(2);
function Rl(e, t, n) {
  var r, i = -1, o, a, u;
  if (t = +t, e = +e, n = +n, e === t && n > 0)
    return [e];
  if ((r = t < e) && (o = e, e = t, t = o), (u = Jp(e, t, n)) === 0 || !isFinite(u))
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
function Jp(e, t, n) {
  var r = (t - e) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), o = r / Math.pow(10, i);
  return i >= 0 ? (o >= wl ? 10 : o >= xl ? 5 : o >= _l ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (o >= wl ? 10 : o >= xl ? 5 : o >= _l ? 2 : 1);
}
function Sl(e, t, n) {
  var r = Math.abs(t - e) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), o = r / i;
  return o >= wl ? i *= 10 : o >= xl ? i *= 5 : o >= _l && (i *= 2), t < e ? -i : i;
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
function md(e, t) {
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
function ev(e, t, n = 0, r = e.length - 1, i = qo) {
  for (; r > n; ) {
    if (r - n > 600) {
      const f = r - n + 1, c = t - n + 1, p = Math.log(f), h = 0.5 * Math.exp(2 * p / 3), w = 0.5 * Math.sqrt(p * h * (f - h) / f) * (c - f / 2 < 0 ? -1 : 1), P = Math.max(n, Math.floor(t - c * h / f + w)), _ = Math.min(r, Math.floor(t + (f - c) * h / f + w));
      ev(e, t, P, _, i);
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
function Mb(e, t, n) {
  if (e = Float64Array.from(Tb(e, n)), !!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return md(e);
    if (t >= 1)
      return gd(e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = gd(ev(e, o).subarray(0, o + 1)), u = md(e.subarray(o + 1));
    return a + (u - a) * (i - o);
  }
}
function Ob(e, t, n = Qp) {
  if (!!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return +n(e[0], 0, e);
    if (t >= 1)
      return +n(e[r - 1], r - 1, e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = +n(e[o], o, e), u = +n(e[o + 1], o + 1, e);
    return a + (u - a) * (i - o);
  }
}
function tv(e, t, n) {
  e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, o = new Array(i); ++r < i; )
    o[r] = e + r * n;
  return o;
}
function Nn(e, t) {
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
const Cl = Symbol("implicit");
function xu() {
  var e = /* @__PURE__ */ new Map(), t = [], n = [], r = Cl;
  function i(o) {
    var a = o + "", u = e.get(a);
    if (!u) {
      if (r !== Cl)
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
  }, Nn.apply(i, arguments), i;
}
function _u() {
  var e = xu().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, o, a, u = !1, f = 0, c = 0, p = 0.5;
  delete e.unknown;
  function h() {
    var w = t().length, P = i < r, _ = P ? i : r, T = P ? r : i;
    o = (T - _) / Math.max(1, w - f + c * 2), u && (o = Math.floor(o)), _ += (T - _ - o * (w - f)) * p, a = o * (1 - f), u && (_ = Math.round(_), a = Math.round(a));
    var B = tv(w).map(function(k) {
      return _ + o * k;
    });
    return n(P ? B.reverse() : B);
  }
  return e.domain = function(w) {
    return arguments.length ? (t(w), h()) : t();
  }, e.range = function(w) {
    return arguments.length ? ([r, i] = w, r = +r, i = +i, h()) : [r, i];
  }, e.rangeRound = function(w) {
    return [r, i] = w, r = +r, i = +i, u = !0, h();
  }, e.bandwidth = function() {
    return a;
  }, e.step = function() {
    return o;
  }, e.round = function(w) {
    return arguments.length ? (u = !!w, h()) : u;
  }, e.padding = function(w) {
    return arguments.length ? (f = Math.min(1, c = +w), h()) : f;
  }, e.paddingInner = function(w) {
    return arguments.length ? (f = Math.min(1, w), h()) : f;
  }, e.paddingOuter = function(w) {
    return arguments.length ? (c = +w, h()) : c;
  }, e.align = function(w) {
    return arguments.length ? (p = Math.max(0, Math.min(1, w)), h()) : p;
  }, e.copy = function() {
    return _u(t(), [r, i]).round(u).paddingInner(f).paddingOuter(c).align(p);
  }, Nn.apply(h(), arguments);
}
function nv(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return nv(t());
  }, e;
}
function rv() {
  return nv(_u.apply(null, arguments).paddingInner(1));
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
var ti = 0.7, Ii = 1 / ti, Ti = "\\s*([+-]?\\d+)\\s*", Io = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", Jn = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Ab = /^#([0-9a-f]{3,8})$/, kb = new RegExp("^rgb\\(" + [Ti, Ti, Ti] + "\\)$"), Ib = new RegExp("^rgb\\(" + [Jn, Jn, Jn] + "\\)$"), $b = new RegExp("^rgba\\(" + [Ti, Ti, Ti, Io] + "\\)$"), Bb = new RegExp("^rgba\\(" + [Jn, Jn, Jn, Io] + "\\)$"), Fb = new RegExp("^hsl\\(" + [Io, Jn, Jn] + "\\)$"), Db = new RegExp("^hsla\\(" + [Io, Jn, Jn, Io] + "\\)$"), yd = {
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
zi(zr, $o, {
  copy: function(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: bd,
  formatHex: bd,
  formatHsl: zb,
  formatRgb: wd,
  toString: wd
});
function bd() {
  return this.rgb().formatHex();
}
function zb() {
  return iv(this).formatHsl();
}
function wd() {
  return this.rgb().formatRgb();
}
function $o(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Ab.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? xd(t) : n === 3 ? new Kt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Aa(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Aa(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = kb.exec(e)) ? new Kt(t[1], t[2], t[3], 1) : (t = Ib.exec(e)) ? new Kt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = $b.exec(e)) ? Aa(t[1], t[2], t[3], t[4]) : (t = Bb.exec(e)) ? Aa(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Fb.exec(e)) ? Sd(t[1], t[2] / 100, t[3] / 100, 1) : (t = Db.exec(e)) ? Sd(t[1], t[2] / 100, t[3] / 100, t[4]) : yd.hasOwnProperty(e) ? xd(yd[e]) : e === "transparent" ? new Kt(NaN, NaN, NaN, 0) : null;
}
function xd(e) {
  return new Kt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Aa(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Kt(e, t, n, r);
}
function Rc(e) {
  return e instanceof zr || (e = $o(e)), e ? (e = e.rgb(), new Kt(e.r, e.g, e.b, e.opacity)) : new Kt();
}
function Ja(e, t, n, r) {
  return arguments.length === 1 ? Rc(e) : new Kt(e, t, n, r == null ? 1 : r);
}
function Kt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
zi(Kt, Ja, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Ii : Math.pow(Ii, e), new Kt(this.r * e, this.g * e, this.b * e, this.opacity);
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
  hex: _d,
  formatHex: _d,
  formatRgb: Rd,
  toString: Rd
}));
function _d() {
  return "#" + $s(this.r) + $s(this.g) + $s(this.b);
}
function Rd() {
  var e = this.opacity;
  return e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)), (e === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (e === 1 ? ")" : ", " + e + ")");
}
function $s(e) {
  return e = Math.max(0, Math.min(255, Math.round(e) || 0)), (e < 16 ? "0" : "") + e.toString(16);
}
function Sd(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Qn(e, t, n, r);
}
function iv(e) {
  if (e instanceof Qn)
    return new Qn(e.h, e.s, e.l, e.opacity);
  if (e instanceof zr || (e = $o(e)), !e)
    return new Qn();
  if (e instanceof Qn)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), a = NaN, u = o - i, f = (o + i) / 2;
  return u ? (t === o ? a = (n - r) / u + (n < r) * 6 : n === o ? a = (r - t) / u + 2 : a = (t - n) / u + 4, u /= f < 0.5 ? o + i : 2 - o - i, a *= 60) : u = f > 0 && f < 1 ? 0 : a, new Qn(a, u, f, e.opacity);
}
function Pl(e, t, n, r) {
  return arguments.length === 1 ? iv(e) : new Qn(e, t, n, r == null ? 1 : r);
}
function Qn(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
zi(Qn, Pl, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Ii : Math.pow(Ii, e), new Qn(this.h, this.s, this.l * e, this.opacity);
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
var ov = Math.PI / 180, av = 180 / Math.PI, eu = 18, uv = 0.96422, sv = 1, lv = 0.82521, cv = 4 / 29, Ni = 6 / 29, fv = 3 * Ni * Ni, Lb = Ni * Ni * Ni;
function dv(e) {
  if (e instanceof er)
    return new er(e.l, e.a, e.b, e.opacity);
  if (e instanceof lr)
    return hv(e);
  e instanceof Kt || (e = Rc(e));
  var t = Ls(e.r), n = Ls(e.g), r = Ls(e.b), i = Fs((0.2225045 * t + 0.7168786 * n + 0.0606169 * r) / sv), o, a;
  return t === n && n === r ? o = a = i : (o = Fs((0.4360747 * t + 0.3850649 * n + 0.1430804 * r) / uv), a = Fs((0.0139322 * t + 0.0971045 * n + 0.7141733 * r) / lv)), new er(116 * i - 16, 500 * (o - i), 200 * (i - a), e.opacity);
}
function Tl(e, t, n, r) {
  return arguments.length === 1 ? dv(e) : new er(e, t, n, r == null ? 1 : r);
}
function er(e, t, n, r) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
zi(er, Tl, Xo(zr, {
  brighter: function(e) {
    return new er(this.l + eu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  darker: function(e) {
    return new er(this.l - eu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = uv * Ds(t), e = sv * Ds(e), n = lv * Ds(n), new Kt(
      zs(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
      zs(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
      zs(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
      this.opacity
    );
  }
}));
function Fs(e) {
  return e > Lb ? Math.pow(e, 1 / 3) : e / fv + cv;
}
function Ds(e) {
  return e > Ni ? e * e * e : fv * (e - cv);
}
function zs(e) {
  return 255 * (e <= 31308e-7 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);
}
function Ls(e) {
  return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function jb(e) {
  if (e instanceof lr)
    return new lr(e.h, e.c, e.l, e.opacity);
  if (e instanceof er || (e = dv(e)), e.a === 0 && e.b === 0)
    return new lr(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
  var t = Math.atan2(e.b, e.a) * av;
  return new lr(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function Nl(e, t, n, r) {
  return arguments.length === 1 ? jb(e) : new lr(e, t, n, r == null ? 1 : r);
}
function lr(e, t, n, r) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function hv(e) {
  if (isNaN(e.h))
    return new er(e.l, 0, 0, e.opacity);
  var t = e.h * ov;
  return new er(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
zi(lr, Nl, Xo(zr, {
  brighter: function(e) {
    return new lr(this.h, this.c, this.l + eu * (e == null ? 1 : e), this.opacity);
  },
  darker: function(e) {
    return new lr(this.h, this.c, this.l - eu * (e == null ? 1 : e), this.opacity);
  },
  rgb: function() {
    return hv(this).rgb();
  }
}));
var pv = -0.14861, Sc = 1.78277, Cc = -0.29227, Ru = -0.90649, Bo = 1.97294, Cd = Bo * Ru, Pd = Bo * Sc, Td = Sc * Cc - Ru * pv;
function Gb(e) {
  if (e instanceof ei)
    return new ei(e.h, e.s, e.l, e.opacity);
  e instanceof Kt || (e = Rc(e));
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (Td * r + Cd * t - Pd * n) / (Td + Cd - Pd), o = r - i, a = (Bo * (n - i) - Cc * o) / Ru, u = Math.sqrt(a * a + o * o) / (Bo * i * (1 - i)), f = u ? Math.atan2(a, o) * av - 120 : NaN;
  return new ei(f < 0 ? f + 360 : f, u, i, e.opacity);
}
function El(e, t, n, r) {
  return arguments.length === 1 ? Gb(e) : new ei(e, t, n, r == null ? 1 : r);
}
function ei(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
zi(ei, El, Xo(zr, {
  brighter: function(e) {
    return e = e == null ? Ii : Math.pow(Ii, e), new ei(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ti : Math.pow(ti, e), new ei(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = isNaN(this.h) ? 0 : (this.h + 120) * ov, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
    return new Kt(
      255 * (t + n * (pv * r + Sc * i)),
      255 * (t + n * (Cc * r + Ru * i)),
      255 * (t + n * (Bo * r)),
      this.opacity
    );
  }
}));
function vv(e, t, n, r, i) {
  var o = e * e, a = o * e;
  return ((1 - 3 * e + 3 * o - a) * t + (4 - 6 * o + 3 * a) * n + (1 + 3 * e + 3 * o - 3 * a) * r + a * i) / 6;
}
function gv(e) {
  var t = e.length - 1;
  return function(n) {
    var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, t - 1) : Math.floor(n * t), i = e[r], o = e[r + 1], a = r > 0 ? e[r - 1] : 2 * i - o, u = r < t - 1 ? e[r + 2] : 2 * o - i;
    return vv((n - r / t) * t, a, i, o, u);
  };
}
function mv(e) {
  var t = e.length;
  return function(n) {
    var r = Math.floor(((n %= 1) < 0 ? ++n : n) * t), i = e[(r + t - 1) % t], o = e[r % t], a = e[(r + 1) % t], u = e[(r + 2) % t];
    return vv((n - r / t) * t, i, o, a, u);
  };
}
function Su(e) {
  return function() {
    return e;
  };
}
function yv(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Hb(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Cu(e, t) {
  var n = t - e;
  return n ? yv(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Su(isNaN(e) ? t : e);
}
function Wb(e) {
  return (e = +e) == 1 ? Wt : function(t, n) {
    return n - t ? Hb(t, n, e) : Su(isNaN(t) ? n : t);
  };
}
function Wt(e, t) {
  var n = t - e;
  return n ? yv(e, n) : Su(isNaN(e) ? t : e);
}
const tu = function e(t) {
  var n = Wb(t);
  function r(i, o) {
    var a = n((i = Ja(i)).r, (o = Ja(o)).r), u = n(i.g, o.g), f = n(i.b, o.b), c = Wt(i.opacity, o.opacity);
    return function(p) {
      return i.r = a(p), i.g = u(p), i.b = f(p), i.opacity = c(p), i + "";
    };
  }
  return r.gamma = e, r;
}(1);
function bv(e) {
  return function(t) {
    var n = t.length, r = new Array(n), i = new Array(n), o = new Array(n), a, u;
    for (a = 0; a < n; ++a)
      u = Ja(t[a]), r[a] = u.r || 0, i[a] = u.g || 0, o[a] = u.b || 0;
    return r = e(r), i = e(i), o = e(o), u.opacity = 1, function(f) {
      return u.r = r(f), u.g = i(f), u.b = o(f), u + "";
    };
  };
}
var Ub = bv(gv), Vb = bv(mv);
function Pc(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i)
      r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function wv(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function qb(e, t) {
  return (wv(t) ? Pc : xv)(e, t);
}
function xv(e, t) {
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
function _v(e, t) {
  var n = new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function kn(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Rv(e, t) {
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
var Ml = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, js = new RegExp(Ml.source, "g");
function Yb(e) {
  return function() {
    return e;
  };
}
function Xb(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Sv(e, t) {
  var n = Ml.lastIndex = js.lastIndex = 0, r, i, o, a = -1, u = [], f = [];
  for (e = e + "", t = t + ""; (r = Ml.exec(e)) && (i = js.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), u[a] ? u[a] += o : u[++a] = o), (r = r[0]) === (i = i[0]) ? u[a] ? u[a] += i : u[++a] = i : (u[++a] = null, f.push({ i: a, x: kn(r, i) })), n = js.lastIndex;
  return n < t.length && (o = t.slice(n), u[a] ? u[a] += o : u[++a] = o), u.length < 2 ? f[0] ? Xb(f[0].x) : Yb(t) : (t = f.length, function(c) {
    for (var p = 0, h; p < t; ++p)
      u[(h = f[p]).i] = h.x(c);
    return u.join("");
  });
}
function Li(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Su(t) : (n === "number" ? kn : n === "string" ? (r = $o(t)) ? (t = r, tu) : Sv : t instanceof $o ? tu : t instanceof Date ? _v : wv(t) ? Pc : Array.isArray(t) ? xv : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Rv : kn)(e, t);
}
function Kb(e) {
  var t = e.length;
  return function(n) {
    return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
  };
}
function Qb(e, t) {
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
var Nd = 180 / Math.PI, Ol = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Cv(e, t, n, r, i, o) {
  var a, u, f;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (f = e * n + t * r) && (n -= e * f, r -= t * f), (u = Math.sqrt(n * n + r * r)) && (n /= u, r /= u, f /= u), e * r < t * n && (e = -e, t = -t, f = -f, a = -a), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * Nd,
    skewX: Math.atan(f) * Nd,
    scaleX: a,
    scaleY: u
  };
}
var ao, Gs, Ed, ka;
function Zb(e) {
  return e === "none" ? Ol : (ao || (ao = document.createElement("DIV"), Gs = document.documentElement, Ed = document.defaultView), ao.style.transform = e, e = Ed.getComputedStyle(Gs.appendChild(ao), null).getPropertyValue("transform"), Gs.removeChild(ao), e = e.slice(7, -1).split(","), Cv(+e[0], +e[1], +e[2], +e[3], +e[4], +e[5]));
}
function Jb(e) {
  return e == null || (ka || (ka = document.createElementNS("http://www.w3.org/2000/svg", "g")), ka.setAttribute("transform", e), !(e = ka.transform.baseVal.consolidate())) ? Ol : (e = e.matrix, Cv(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Pv(e, t, n, r) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, p, h, w, P, _) {
    if (c !== h || p !== w) {
      var T = P.push("translate(", null, t, null, n);
      _.push({ i: T - 4, x: kn(c, h) }, { i: T - 2, x: kn(p, w) });
    } else
      (h || w) && P.push("translate(" + h + t + w + n);
  }
  function a(c, p, h, w) {
    c !== p ? (c - p > 180 ? p += 360 : p - c > 180 && (c += 360), w.push({ i: h.push(i(h) + "rotate(", null, r) - 2, x: kn(c, p) })) : p && h.push(i(h) + "rotate(" + p + r);
  }
  function u(c, p, h, w) {
    c !== p ? w.push({ i: h.push(i(h) + "skewX(", null, r) - 2, x: kn(c, p) }) : p && h.push(i(h) + "skewX(" + p + r);
  }
  function f(c, p, h, w, P, _) {
    if (c !== h || p !== w) {
      var T = P.push(i(P) + "scale(", null, ",", null, ")");
      _.push({ i: T - 4, x: kn(c, h) }, { i: T - 2, x: kn(p, w) });
    } else
      (h !== 1 || w !== 1) && P.push(i(P) + "scale(" + h + "," + w + ")");
  }
  return function(c, p) {
    var h = [], w = [];
    return c = e(c), p = e(p), o(c.translateX, c.translateY, p.translateX, p.translateY, h, w), a(c.rotate, p.rotate, h, w), u(c.skewX, p.skewX, h, w), f(c.scaleX, c.scaleY, p.scaleX, p.scaleY, h, w), c = p = null, function(P) {
      for (var _ = -1, T = w.length, B; ++_ < T; )
        h[(B = w[_]).i] = B.x(P);
      return h.join("");
    };
  };
}
var e1 = Pv(Zb, "px, ", "px)", "deg)"), t1 = Pv(Jb, ", ", ")", ")"), uo = Math.SQRT2, Hs = 2, Md = 4, n1 = 1e-12;
function Od(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function r1(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function i1(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
function o1(e, t) {
  var n = e[0], r = e[1], i = e[2], o = t[0], a = t[1], u = t[2], f = o - n, c = a - r, p = f * f + c * c, h, w;
  if (p < n1)
    w = Math.log(u / i) / uo, h = function($) {
      return [
        n + $ * f,
        r + $ * c,
        i * Math.exp(uo * $ * w)
      ];
    };
  else {
    var P = Math.sqrt(p), _ = (u * u - i * i + Md * p) / (2 * i * Hs * P), T = (u * u - i * i - Md * p) / (2 * u * Hs * P), B = Math.log(Math.sqrt(_ * _ + 1) - _), k = Math.log(Math.sqrt(T * T + 1) - T);
    w = (k - B) / uo, h = function($) {
      var N = $ * w, L = Od(B), M = i / (Hs * P) * (L * i1(uo * N + B) - r1(B));
      return [
        n + M * f,
        r + M * c,
        i * L / Od(uo * N + B)
      ];
    };
  }
  return h.duration = w * 1e3, h;
}
function Tv(e) {
  return function(t, n) {
    var r = e((t = Pl(t)).h, (n = Pl(n)).h), i = Wt(t.s, n.s), o = Wt(t.l, n.l), a = Wt(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.s = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Nv = Tv(Cu);
var Ev = Tv(Wt);
function Mv(e, t) {
  var n = Wt((e = Tl(e)).l, (t = Tl(t)).l), r = Wt(e.a, t.a), i = Wt(e.b, t.b), o = Wt(e.opacity, t.opacity);
  return function(a) {
    return e.l = n(a), e.a = r(a), e.b = i(a), e.opacity = o(a), e + "";
  };
}
function Ov(e) {
  return function(t, n) {
    var r = e((t = Nl(t)).h, (n = Nl(n)).h), i = Wt(t.c, n.c), o = Wt(t.l, n.l), a = Wt(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.c = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Av = Ov(Cu);
var kv = Ov(Wt);
function Iv(e) {
  return function t(n) {
    n = +n;
    function r(i, o) {
      var a = e((i = El(i)).h, (o = El(o)).h), u = Wt(i.s, o.s), f = Wt(i.l, o.l), c = Wt(i.opacity, o.opacity);
      return function(p) {
        return i.h = a(p), i.s = u(p), i.l = f(Math.pow(p, n)), i.opacity = c(p), i + "";
      };
    }
    return r.gamma = t, r;
  }(1);
}
const $v = Iv(Cu);
var Bv = Iv(Wt);
function Fv(e, t) {
  for (var n = 0, r = t.length - 1, i = t[0], o = new Array(r < 0 ? 0 : r); n < r; )
    o[n] = e(i, i = t[++n]);
  return function(a) {
    var u = Math.max(0, Math.min(r - 1, Math.floor(a *= r)));
    return o[u](a - u);
  };
}
function a1(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r)
    n[r] = e(r / (t - 1));
  return n;
}
const u1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  interpolate: Li,
  interpolateArray: qb,
  interpolateBasis: gv,
  interpolateBasisClosed: mv,
  interpolateDate: _v,
  interpolateDiscrete: Kb,
  interpolateHue: Qb,
  interpolateNumber: kn,
  interpolateNumberArray: Pc,
  interpolateObject: Rv,
  interpolateRound: Ko,
  interpolateString: Sv,
  interpolateTransformCss: e1,
  interpolateTransformSvg: t1,
  interpolateZoom: o1,
  interpolateRgb: tu,
  interpolateRgbBasis: Ub,
  interpolateRgbBasisClosed: Vb,
  interpolateHsl: Nv,
  interpolateHslLong: Ev,
  interpolateLab: Mv,
  interpolateHcl: Av,
  interpolateHclLong: kv,
  interpolateCubehelix: $v,
  interpolateCubehelixLong: Bv,
  piecewise: Fv,
  quantize: a1
}, Symbol.toStringTag, { value: "Module" }));
function s1(e) {
  return function() {
    return e;
  };
}
function nu(e) {
  return +e;
}
var Ad = [0, 1];
function rn(e) {
  return e;
}
function Al(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : s1(isNaN(t) ? NaN : 0.5);
}
function l1(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function c1(e, t, n) {
  var r = e[0], i = e[1], o = t[0], a = t[1];
  return i < r ? (r = Al(i, r), o = n(a, o)) : (r = Al(r, i), o = n(o, a)), function(u) {
    return o(r(u));
  };
}
function f1(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), o = new Array(r), a = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++a < r; )
    i[a] = Al(e[a], e[a + 1]), o[a] = n(t[a], t[a + 1]);
  return function(u) {
    var f = Yo(e, u, 1, r) - 1;
    return o[f](i[f](u));
  };
}
function Qo(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Pu() {
  var e = Ad, t = Ad, n = Li, r, i, o, a = rn, u, f, c;
  function p() {
    var w = Math.min(e.length, t.length);
    return a !== rn && (a = l1(e[0], e[w - 1])), u = w > 2 ? f1 : c1, f = c = null, h;
  }
  function h(w) {
    return w == null || isNaN(w = +w) ? o : (f || (f = u(e.map(r), t, n)))(r(a(w)));
  }
  return h.invert = function(w) {
    return a(i((c || (c = u(t, e.map(r), kn)))(w)));
  }, h.domain = function(w) {
    return arguments.length ? (e = Array.from(w, nu), p()) : e.slice();
  }, h.range = function(w) {
    return arguments.length ? (t = Array.from(w), p()) : t.slice();
  }, h.rangeRound = function(w) {
    return t = Array.from(w), n = Ko, p();
  }, h.clamp = function(w) {
    return arguments.length ? (a = w ? !0 : rn, p()) : a !== rn;
  }, h.interpolate = function(w) {
    return arguments.length ? (n = w, p()) : n;
  }, h.unknown = function(w) {
    return arguments.length ? (o = w, h) : o;
  }, function(w, P) {
    return r = w, i = P, p();
  };
}
function Tc() {
  return Pu()(rn, rn);
}
function d1(e) {
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
function $i(e) {
  return e = ru(Math.abs(e)), e ? e[1] : NaN;
}
function h1(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], a = 0, u = e[0], f = 0; i > 0 && u > 0 && (f + u + 1 > r && (u = Math.max(1, r - f)), o.push(n.substring(i -= u, i + u)), !((f += u + 1) > r)); )
      u = e[a = (a + 1) % e.length];
    return o.reverse().join(t);
  };
}
function p1(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var v1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function iu(e) {
  if (!(t = v1.exec(e)))
    throw new Error("invalid format: " + e);
  var t;
  return new Nc({
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
iu.prototype = Nc.prototype;
function Nc(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Nc.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function g1(e) {
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
var Dv;
function m1(e, t) {
  var n = ru(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1], o = i - (Dv = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return o === a ? r : o > a ? r + new Array(o - a + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + ru(e, Math.max(0, t + o - 1))[0];
}
function kd(e, t) {
  var n = ru(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Id = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: d1,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => kd(e * 100, t),
  r: kd,
  s: m1,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function $d(e) {
  return e;
}
var Bd = Array.prototype.map, Fd = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function y1(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? $d : h1(Bd.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? $d : p1(Bd.call(e.numerals, String)), a = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "\u2212" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(h) {
    h = iu(h);
    var w = h.fill, P = h.align, _ = h.sign, T = h.symbol, B = h.zero, k = h.width, $ = h.comma, N = h.precision, L = h.trim, M = h.type;
    M === "n" ? ($ = !0, M = "g") : Id[M] || (N === void 0 && (N = 12), L = !0, M = "g"), (B || w === "0" && P === "=") && (B = !0, w = "0", P = "=");
    var D = T === "$" ? n : T === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", te = T === "$" ? r : /[%p]/.test(M) ? a : "", Q = Id[M], fe = /[defgprs%]/.test(M);
    N = N === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, N)) : Math.max(0, Math.min(20, N));
    function ge(re) {
      var ee = D, be = te, Oe, ut, Ue;
      if (M === "c")
        be = Q(re) + be, re = "";
      else {
        re = +re;
        var st = re < 0 || 1 / re < 0;
        if (re = isNaN(re) ? f : Q(Math.abs(re), N), L && (re = g1(re)), st && +re == 0 && _ !== "+" && (st = !1), ee = (st ? _ === "(" ? _ : u : _ === "-" || _ === "(" ? "" : _) + ee, be = (M === "s" ? Fd[8 + Dv / 3] : "") + be + (st && _ === "(" ? ")" : ""), fe) {
          for (Oe = -1, ut = re.length; ++Oe < ut; )
            if (Ue = re.charCodeAt(Oe), 48 > Ue || Ue > 57) {
              be = (Ue === 46 ? i + re.slice(Oe + 1) : re.slice(Oe)) + be, re = re.slice(0, Oe);
              break;
            }
        }
      }
      $ && !B && (re = t(re, 1 / 0));
      var lt = ee.length + re.length + be.length, dt = lt < k ? new Array(k - lt + 1).join(w) : "";
      switch ($ && B && (re = t(dt + re, dt.length ? k - be.length : 1 / 0), dt = ""), P) {
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
      return h + "";
    }, ge;
  }
  function p(h, w) {
    var P = c((h = iu(h), h.type = "f", h)), _ = Math.max(-8, Math.min(8, Math.floor($i(w) / 3))) * 3, T = Math.pow(10, -_), B = Fd[8 + _ / 3];
    return function(k) {
      return P(T * k) + B;
    };
  }
  return {
    format: c,
    formatPrefix: p
  };
}
var Ia, Ec, zv;
b1({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function b1(e) {
  return Ia = y1(e), Ec = Ia.format, zv = Ia.formatPrefix, Ia;
}
function w1(e) {
  return Math.max(0, -$i(Math.abs(e)));
}
function x1(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor($i(t) / 3))) * 3 - $i(Math.abs(e)));
}
function _1(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, $i(t) - $i(e)) + 1;
}
function Lv(e, t, n, r) {
  var i = Sl(e, t, n), o;
  switch (r = iu(r == null ? ",f" : r), r.type) {
    case "s": {
      var a = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = x1(i, a)) && (r.precision = o), zv(r, a);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = _1(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = w1(i)) && (r.precision = o - (r.type === "%") * 2);
      break;
    }
  }
  return Ec(r);
}
function Lr(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return Rl(r[0], r[r.length - 1], n == null ? 10 : n);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return Lv(i[0], i[i.length - 1], n == null ? 10 : n, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, a = r[i], u = r[o], f, c, p = 10;
    for (u < a && (c = a, a = u, u = c, c = i, i = o, o = c); p-- > 0; ) {
      if (c = Jp(a, u, n), c === f)
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
function Mc() {
  var e = Tc();
  return e.copy = function() {
    return Qo(e, Mc());
  }, Nn.apply(e, arguments), Lr(e);
}
function jv(e) {
  var t;
  function n(r) {
    return r == null || isNaN(r = +r) ? t : r;
  }
  return n.invert = n, n.domain = n.range = function(r) {
    return arguments.length ? (e = Array.from(r, nu), n) : e.slice();
  }, n.unknown = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.copy = function() {
    return jv(e).unknown(t);
  }, e = arguments.length ? Array.from(e, nu) : [0, 1], Lr(n);
}
function Gv(e, t) {
  e = e.slice();
  var n = 0, r = e.length - 1, i = e[n], o = e[r], a;
  return o < i && (a = n, n = r, r = a, a = i, i = o, o = a), e[n] = t.floor(i), e[r] = t.ceil(o), e;
}
function Dd(e) {
  return Math.log(e);
}
function zd(e) {
  return Math.exp(e);
}
function R1(e) {
  return -Math.log(-e);
}
function S1(e) {
  return -Math.exp(-e);
}
function C1(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function P1(e) {
  return e === 10 ? C1 : e === Math.E ? Math.exp : function(t) {
    return Math.pow(e, t);
  };
}
function T1(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), function(t) {
    return Math.log(t) / e;
  });
}
function Ld(e) {
  return function(t) {
    return -e(-t);
  };
}
function Oc(e) {
  var t = e(Dd, zd), n = t.domain, r = 10, i, o;
  function a() {
    return i = T1(r), o = P1(r), n()[0] < 0 ? (i = Ld(i), o = Ld(o), e(R1, S1)) : e(Dd, zd), t;
  }
  return t.base = function(u) {
    return arguments.length ? (r = +u, a()) : r;
  }, t.domain = function(u) {
    return arguments.length ? (n(u), a()) : n();
  }, t.ticks = function(u) {
    var f = n(), c = f[0], p = f[f.length - 1], h;
    (h = p < c) && (w = c, c = p, p = w);
    var w = i(c), P = i(p), _, T, B, k = u == null ? 10 : +u, $ = [];
    if (!(r % 1) && P - w < k) {
      if (w = Math.floor(w), P = Math.ceil(P), c > 0) {
        for (; w <= P; ++w)
          for (T = 1, _ = o(w); T < r; ++T)
            if (B = _ * T, !(B < c)) {
              if (B > p)
                break;
              $.push(B);
            }
      } else
        for (; w <= P; ++w)
          for (T = r - 1, _ = o(w); T >= 1; --T)
            if (B = _ * T, !(B < c)) {
              if (B > p)
                break;
              $.push(B);
            }
      $.length * 2 < k && ($ = Rl(c, p, k));
    } else
      $ = Rl(w, P, Math.min(P - w, k)).map(o);
    return h ? $.reverse() : $;
  }, t.tickFormat = function(u, f) {
    if (f == null && (f = r === 10 ? ".0e" : ","), typeof f != "function" && (f = Ec(f)), u === 1 / 0)
      return f;
    u == null && (u = 10);
    var c = Math.max(1, r * u / t.ticks().length);
    return function(p) {
      var h = p / o(Math.round(i(p)));
      return h * r < r - 0.5 && (h *= r), h <= c ? f(p) : "";
    };
  }, t.nice = function() {
    return n(Gv(n(), {
      floor: function(u) {
        return o(Math.floor(i(u)));
      },
      ceil: function(u) {
        return o(Math.ceil(i(u)));
      }
    }));
  }, t;
}
function Ac() {
  var e = Oc(Pu()).domain([1, 10]);
  return e.copy = function() {
    return Qo(e, Ac()).base(e.base());
  }, Nn.apply(e, arguments), e;
}
function jd(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function Gd(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function kc(e) {
  var t = 1, n = e(jd(t), Gd(t));
  return n.constant = function(r) {
    return arguments.length ? e(jd(t = +r), Gd(t)) : t;
  }, Lr(n);
}
function Ic() {
  var e = kc(Pu());
  return e.copy = function() {
    return Qo(e, Ic()).constant(e.constant());
  }, Nn.apply(e, arguments);
}
function Hd(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function N1(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function E1(e) {
  return e < 0 ? -e * e : e * e;
}
function $c(e) {
  var t = e(rn, rn), n = 1;
  function r() {
    return n === 1 ? e(rn, rn) : n === 0.5 ? e(N1, E1) : e(Hd(n), Hd(1 / n));
  }
  return t.exponent = function(i) {
    return arguments.length ? (n = +i, r()) : n;
  }, Lr(t);
}
function Tu() {
  var e = $c(Pu());
  return e.copy = function() {
    return Qo(e, Tu()).exponent(e.exponent());
  }, Nn.apply(e, arguments), e;
}
function Hv() {
  return Tu.apply(null, arguments).exponent(0.5);
}
function Wd(e) {
  return Math.sign(e) * e * e;
}
function M1(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function Wv() {
  var e = Tc(), t = [0, 1], n = !1, r;
  function i(o) {
    var a = M1(e(o));
    return isNaN(a) ? r : n ? Math.round(a) : a;
  }
  return i.invert = function(o) {
    return e.invert(Wd(o));
  }, i.domain = function(o) {
    return arguments.length ? (e.domain(o), i) : e.domain();
  }, i.range = function(o) {
    return arguments.length ? (e.range((t = Array.from(o, nu)).map(Wd)), i) : t.slice();
  }, i.rangeRound = function(o) {
    return i.range(o).round(!0);
  }, i.round = function(o) {
    return arguments.length ? (n = !!o, i) : n;
  }, i.clamp = function(o) {
    return arguments.length ? (e.clamp(o), i) : e.clamp();
  }, i.unknown = function(o) {
    return arguments.length ? (r = o, i) : r;
  }, i.copy = function() {
    return Wv(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
  }, Nn.apply(i, arguments), Lr(i);
}
function Bc() {
  var e = [], t = [], n = [], r;
  function i() {
    var a = 0, u = Math.max(1, t.length);
    for (n = new Array(u - 1); ++a < u; )
      n[a - 1] = Ob(e, a / u);
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
  }, Nn.apply(o, arguments);
}
function Fc() {
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
    return Fc().domain([e, t]).range(i).unknown(o);
  }, Nn.apply(Lr(a), arguments);
}
function Dc() {
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
    return Dc().domain(e).range(t).unknown(n);
  }, Nn.apply(i, arguments);
}
var Ws = new Date(), Us = new Date();
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
    return Ws.setTime(+o), Us.setTime(+a), e(Ws), e(Us), Math.floor(n(Ws, Us));
  }, i.every = function(o) {
    return o = Math.floor(o), !isFinite(o) || !(o > 0) ? null : o > 1 ? i.filter(r ? function(a) {
      return r(a) % o === 0;
    } : function(a) {
      return i.count(0, a) % o === 0;
    }) : i;
  }), i;
}
var ou = zt(function() {
}, function(e, t) {
  e.setTime(+e + t);
}, function(e, t) {
  return t - e;
});
ou.every = function(e) {
  return e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? zt(function(t) {
    t.setTime(Math.floor(t / e) * e);
  }, function(t, n) {
    t.setTime(+t + n * e);
  }, function(t, n) {
    return (n - t) / e;
  }) : ou;
};
const kl = ou;
var Ud = ou.range;
const cr = 1e3, Tn = cr * 60, fr = Tn * 60, ni = fr * 24, zc = ni * 7, Vd = ni * 30, Vs = ni * 365;
var Uv = zt(function(e) {
  e.setTime(e - e.getMilliseconds());
}, function(e, t) {
  e.setTime(+e + t * cr);
}, function(e, t) {
  return (t - e) / cr;
}, function(e) {
  return e.getUTCSeconds();
});
const Zn = Uv;
var qd = Uv.range, Vv = zt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * cr);
}, function(e, t) {
  e.setTime(+e + t * Tn);
}, function(e, t) {
  return (t - e) / Tn;
}, function(e) {
  return e.getMinutes();
});
const Nu = Vv;
var O1 = Vv.range, qv = zt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * cr - e.getMinutes() * Tn);
}, function(e, t) {
  e.setTime(+e + t * fr);
}, function(e, t) {
  return (t - e) / fr;
}, function(e) {
  return e.getHours();
});
const Eu = qv;
var A1 = qv.range, Yv = zt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Tn) / ni,
  (e) => e.getDate() - 1
);
const ji = Yv;
var k1 = Yv.range;
function fi(e) {
  return zt(function(t) {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setDate(t.getDate() + n * 7);
  }, function(t, n) {
    return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Tn) / zc;
  });
}
var ri = fi(0), Fo = fi(1), Xv = fi(2), Kv = fi(3), ii = fi(4), Qv = fi(5), Zv = fi(6), Yd = ri.range, I1 = Fo.range, $1 = Xv.range, B1 = Kv.range, F1 = ii.range, D1 = Qv.range, z1 = Zv.range, Jv = zt(function(e) {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setMonth(e.getMonth() + t);
}, function(e, t) {
  return t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12;
}, function(e) {
  return e.getMonth();
});
const Mu = Jv;
var L1 = Jv.range, Lc = zt(function(e) {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setFullYear(e.getFullYear() + t);
}, function(e, t) {
  return t.getFullYear() - e.getFullYear();
}, function(e) {
  return e.getFullYear();
});
Lc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : zt(function(t) {
    t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setFullYear(t.getFullYear() + n * e);
  });
};
const dr = Lc;
var j1 = Lc.range, eg = zt(function(e) {
  e.setUTCSeconds(0, 0);
}, function(e, t) {
  e.setTime(+e + t * Tn);
}, function(e, t) {
  return (t - e) / Tn;
}, function(e) {
  return e.getUTCMinutes();
});
const Ou = eg;
var G1 = eg.range, tg = zt(function(e) {
  e.setUTCMinutes(0, 0, 0);
}, function(e, t) {
  e.setTime(+e + t * fr);
}, function(e, t) {
  return (t - e) / fr;
}, function(e) {
  return e.getUTCHours();
});
const Au = tg;
var H1 = tg.range, ng = zt(function(e) {
  e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCDate(e.getUTCDate() + t);
}, function(e, t) {
  return (t - e) / ni;
}, function(e) {
  return e.getUTCDate() - 1;
});
const Gi = ng;
var W1 = ng.range;
function di(e) {
  return zt(function(t) {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, function(t, n) {
    return (n - t) / zc;
  });
}
var oi = di(0), Do = di(1), rg = di(2), ig = di(3), ai = di(4), og = di(5), ag = di(6), Xd = oi.range, U1 = Do.range, V1 = rg.range, q1 = ig.range, Y1 = ai.range, X1 = og.range, K1 = ag.range, ug = zt(function(e) {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCMonth(e.getUTCMonth() + t);
}, function(e, t) {
  return t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12;
}, function(e) {
  return e.getUTCMonth();
});
const ku = ug;
var Q1 = ug.range, jc = zt(function(e) {
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
const hr = jc;
var Z1 = jc.range;
function sg(e, t, n, r, i, o) {
  const a = [
    [Zn, 1, cr],
    [Zn, 5, 5 * cr],
    [Zn, 15, 15 * cr],
    [Zn, 30, 30 * cr],
    [o, 1, Tn],
    [o, 5, 5 * Tn],
    [o, 15, 15 * Tn],
    [o, 30, 30 * Tn],
    [i, 1, fr],
    [i, 3, 3 * fr],
    [i, 6, 6 * fr],
    [i, 12, 12 * fr],
    [r, 1, ni],
    [r, 2, 2 * ni],
    [n, 1, zc],
    [t, 1, Vd],
    [t, 3, 3 * Vd],
    [e, 1, Vs]
  ];
  function u(c, p, h) {
    const w = p < c;
    w && ([c, p] = [p, c]);
    const P = h && typeof h.range == "function" ? h : f(c, p, h), _ = P ? P.range(c, +p + 1) : [];
    return w ? _.reverse() : _;
  }
  function f(c, p, h) {
    const w = Math.abs(p - c) / h, P = wu(([, , B]) => B).right(a, w);
    if (P === a.length)
      return e.every(Sl(c / Vs, p / Vs, h));
    if (P === 0)
      return kl.every(Math.max(Sl(c, p, h), 1));
    const [_, T] = a[w / a[P - 1][2] < a[P][2] / w ? P - 1 : P];
    return _.every(T);
  }
  return [u, f];
}
const [lg, cg] = sg(hr, ku, oi, Gi, Au, Ou), [fg, dg] = sg(dr, Mu, ri, ji, Eu, Nu), J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  timeInterval: zt,
  timeMillisecond: kl,
  timeMilliseconds: Ud,
  utcMillisecond: kl,
  utcMilliseconds: Ud,
  timeSecond: Zn,
  timeSeconds: qd,
  utcSecond: Zn,
  utcSeconds: qd,
  timeMinute: Nu,
  timeMinutes: O1,
  timeHour: Eu,
  timeHours: A1,
  timeDay: ji,
  timeDays: k1,
  timeWeek: ri,
  timeWeeks: Yd,
  timeSunday: ri,
  timeSundays: Yd,
  timeMonday: Fo,
  timeMondays: I1,
  timeTuesday: Xv,
  timeTuesdays: $1,
  timeWednesday: Kv,
  timeWednesdays: B1,
  timeThursday: ii,
  timeThursdays: F1,
  timeFriday: Qv,
  timeFridays: D1,
  timeSaturday: Zv,
  timeSaturdays: z1,
  timeMonth: Mu,
  timeMonths: L1,
  timeYear: dr,
  timeYears: j1,
  utcMinute: Ou,
  utcMinutes: G1,
  utcHour: Au,
  utcHours: H1,
  utcDay: Gi,
  utcDays: W1,
  utcWeek: oi,
  utcWeeks: Xd,
  utcSunday: oi,
  utcSundays: Xd,
  utcMonday: Do,
  utcMondays: U1,
  utcTuesday: rg,
  utcTuesdays: V1,
  utcWednesday: ig,
  utcWednesdays: q1,
  utcThursday: ai,
  utcThursdays: Y1,
  utcFriday: og,
  utcFridays: X1,
  utcSaturday: ag,
  utcSaturdays: K1,
  utcMonth: ku,
  utcMonths: Q1,
  utcYear: hr,
  utcYears: Z1,
  utcTicks: lg,
  utcTickInterval: cg,
  timeTicks: fg,
  timeTickInterval: dg
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
function so(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function ew(e) {
  var t = e.dateTime, n = e.date, r = e.time, i = e.periods, o = e.days, a = e.shortDays, u = e.months, f = e.shortMonths, c = lo(i), p = co(i), h = lo(o), w = co(o), P = lo(a), _ = co(a), T = lo(u), B = co(u), k = lo(f), $ = co(f), N = {
    a: st,
    A: lt,
    b: dt,
    B: V,
    c: null,
    d: th,
    e: th,
    f: Rw,
    g: kw,
    G: $w,
    H: ww,
    I: xw,
    j: _w,
    L: hg,
    m: Sw,
    M: Cw,
    p: ue,
    q: Te,
    Q: ih,
    s: oh,
    S: Pw,
    u: Tw,
    U: Nw,
    V: Ew,
    w: Mw,
    W: Ow,
    x: null,
    X: null,
    y: Aw,
    Y: Iw,
    Z: Bw,
    "%": rh
  }, L = {
    a: Ae,
    A: Ce,
    b: Se,
    B: Ne,
    c: null,
    d: nh,
    e: nh,
    f: Lw,
    g: Kw,
    G: Zw,
    H: Fw,
    I: Dw,
    j: zw,
    L: vg,
    m: jw,
    M: Gw,
    p: Fe,
    q: Le,
    Q: ih,
    s: oh,
    S: Hw,
    u: Ww,
    U: Uw,
    V: Vw,
    w: qw,
    W: Yw,
    x: null,
    X: null,
    y: Xw,
    Y: Qw,
    Z: Jw,
    "%": rh
  }, M = {
    a: ge,
    A: re,
    b: ee,
    B: be,
    c: Oe,
    d: Jd,
    e: Jd,
    f: gw,
    g: Zd,
    G: Qd,
    H: eh,
    I: eh,
    j: dw,
    L: vw,
    m: fw,
    M: hw,
    p: fe,
    q: cw,
    Q: yw,
    s: bw,
    S: pw,
    u: ow,
    U: aw,
    V: uw,
    w: iw,
    W: sw,
    x: ut,
    X: Ue,
    y: Zd,
    Y: Qd,
    Z: lw,
    "%": mw
  };
  N.x = D(n, N), N.X = D(r, N), N.c = D(t, N), L.x = D(n, L), L.X = D(r, L), L.c = D(t, L);
  function D(X, ce) {
    return function(je) {
      var F = [], gt = -1, ct = 0, _t = X.length, Ot, Qt, un;
      for (je instanceof Date || (je = new Date(+je)); ++gt < _t; )
        X.charCodeAt(gt) === 37 && (F.push(X.slice(ct, gt)), (Qt = Kd[Ot = X.charAt(++gt)]) != null ? Ot = X.charAt(++gt) : Qt = Ot === "e" ? " " : "0", (un = ce[Ot]) && (Ot = un(je, Qt)), F.push(Ot), ct = gt + 1);
      return F.push(X.slice(ct, gt)), F.join("");
    };
  }
  function te(X, ce) {
    return function(je) {
      var F = so(1900, void 0, 1), gt = Q(F, X, je += "", 0), ct, _t;
      if (gt != je.length)
        return null;
      if ("Q" in F)
        return new Date(F.Q);
      if ("s" in F)
        return new Date(F.s * 1e3 + ("L" in F ? F.L : 0));
      if (ce && !("Z" in F) && (F.Z = 0), "p" in F && (F.H = F.H % 12 + F.p * 12), F.m === void 0 && (F.m = "q" in F ? F.q : 0), "V" in F) {
        if (F.V < 1 || F.V > 53)
          return null;
        "w" in F || (F.w = 1), "Z" in F ? (ct = Ys(so(F.y, 0, 1)), _t = ct.getUTCDay(), ct = _t > 4 || _t === 0 ? Do.ceil(ct) : Do(ct), ct = Gi.offset(ct, (F.V - 1) * 7), F.y = ct.getUTCFullYear(), F.m = ct.getUTCMonth(), F.d = ct.getUTCDate() + (F.w + 6) % 7) : (ct = qs(so(F.y, 0, 1)), _t = ct.getDay(), ct = _t > 4 || _t === 0 ? Fo.ceil(ct) : Fo(ct), ct = ji.offset(ct, (F.V - 1) * 7), F.y = ct.getFullYear(), F.m = ct.getMonth(), F.d = ct.getDate() + (F.w + 6) % 7);
      } else
        ("W" in F || "U" in F) && ("w" in F || (F.w = "u" in F ? F.u % 7 : "W" in F ? 1 : 0), _t = "Z" in F ? Ys(so(F.y, 0, 1)).getUTCDay() : qs(so(F.y, 0, 1)).getDay(), F.m = 0, F.d = "W" in F ? (F.w + 6) % 7 + F.W * 7 - (_t + 5) % 7 : F.w + F.U * 7 - (_t + 6) % 7);
      return "Z" in F ? (F.H += F.Z / 100 | 0, F.M += F.Z % 100, Ys(F)) : qs(F);
    };
  }
  function Q(X, ce, je, F) {
    for (var gt = 0, ct = ce.length, _t = je.length, Ot, Qt; gt < ct; ) {
      if (F >= _t)
        return -1;
      if (Ot = ce.charCodeAt(gt++), Ot === 37) {
        if (Ot = ce.charAt(gt++), Qt = M[Ot in Kd ? ce.charAt(gt++) : Ot], !Qt || (F = Qt(X, je, F)) < 0)
          return -1;
      } else if (Ot != je.charCodeAt(F++))
        return -1;
    }
    return F;
  }
  function fe(X, ce, je) {
    var F = c.exec(ce.slice(je));
    return F ? (X.p = p.get(F[0].toLowerCase()), je + F[0].length) : -1;
  }
  function ge(X, ce, je) {
    var F = P.exec(ce.slice(je));
    return F ? (X.w = _.get(F[0].toLowerCase()), je + F[0].length) : -1;
  }
  function re(X, ce, je) {
    var F = h.exec(ce.slice(je));
    return F ? (X.w = w.get(F[0].toLowerCase()), je + F[0].length) : -1;
  }
  function ee(X, ce, je) {
    var F = k.exec(ce.slice(je));
    return F ? (X.m = $.get(F[0].toLowerCase()), je + F[0].length) : -1;
  }
  function be(X, ce, je) {
    var F = T.exec(ce.slice(je));
    return F ? (X.m = B.get(F[0].toLowerCase()), je + F[0].length) : -1;
  }
  function Oe(X, ce, je) {
    return Q(X, t, ce, je);
  }
  function ut(X, ce, je) {
    return Q(X, n, ce, je);
  }
  function Ue(X, ce, je) {
    return Q(X, r, ce, je);
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
  function Se(X) {
    return f[X.getUTCMonth()];
  }
  function Ne(X) {
    return u[X.getUTCMonth()];
  }
  function Fe(X) {
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
      var ce = D(X += "", L);
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
var Kd = { "-": "", _: " ", 0: "0" }, Vt = /^\s*\d+/, tw = /^%/, nw = /[\\^$*+?|[\]().{}]/g;
function xt(e, t, n) {
  var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", o = i.length;
  return r + (o < n ? new Array(n - o + 1).join(t) + i : i);
}
function rw(e) {
  return e.replace(nw, "\\$&");
}
function lo(e) {
  return new RegExp("^(?:" + e.map(rw).join("|") + ")", "i");
}
function co(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function iw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function ow(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function aw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function uw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function sw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function Qd(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function Zd(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function lw(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function cw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function fw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function Jd(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function dw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function eh(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function hw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function pw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function vw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function gw(e, t, n) {
  var r = Vt.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function mw(e, t, n) {
  var r = tw.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function yw(e, t, n) {
  var r = Vt.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function bw(e, t, n) {
  var r = Vt.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function th(e, t) {
  return xt(e.getDate(), t, 2);
}
function ww(e, t) {
  return xt(e.getHours(), t, 2);
}
function xw(e, t) {
  return xt(e.getHours() % 12 || 12, t, 2);
}
function _w(e, t) {
  return xt(1 + ji.count(dr(e), e), t, 3);
}
function hg(e, t) {
  return xt(e.getMilliseconds(), t, 3);
}
function Rw(e, t) {
  return hg(e, t) + "000";
}
function Sw(e, t) {
  return xt(e.getMonth() + 1, t, 2);
}
function Cw(e, t) {
  return xt(e.getMinutes(), t, 2);
}
function Pw(e, t) {
  return xt(e.getSeconds(), t, 2);
}
function Tw(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Nw(e, t) {
  return xt(ri.count(dr(e) - 1, e), t, 2);
}
function pg(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? ii(e) : ii.ceil(e);
}
function Ew(e, t) {
  return e = pg(e), xt(ii.count(dr(e), e) + (dr(e).getDay() === 4), t, 2);
}
function Mw(e) {
  return e.getDay();
}
function Ow(e, t) {
  return xt(Fo.count(dr(e) - 1, e), t, 2);
}
function Aw(e, t) {
  return xt(e.getFullYear() % 100, t, 2);
}
function kw(e, t) {
  return e = pg(e), xt(e.getFullYear() % 100, t, 2);
}
function Iw(e, t) {
  return xt(e.getFullYear() % 1e4, t, 4);
}
function $w(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? ii(e) : ii.ceil(e), xt(e.getFullYear() % 1e4, t, 4);
}
function Bw(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + xt(t / 60 | 0, "0", 2) + xt(t % 60, "0", 2);
}
function nh(e, t) {
  return xt(e.getUTCDate(), t, 2);
}
function Fw(e, t) {
  return xt(e.getUTCHours(), t, 2);
}
function Dw(e, t) {
  return xt(e.getUTCHours() % 12 || 12, t, 2);
}
function zw(e, t) {
  return xt(1 + Gi.count(hr(e), e), t, 3);
}
function vg(e, t) {
  return xt(e.getUTCMilliseconds(), t, 3);
}
function Lw(e, t) {
  return vg(e, t) + "000";
}
function jw(e, t) {
  return xt(e.getUTCMonth() + 1, t, 2);
}
function Gw(e, t) {
  return xt(e.getUTCMinutes(), t, 2);
}
function Hw(e, t) {
  return xt(e.getUTCSeconds(), t, 2);
}
function Ww(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function Uw(e, t) {
  return xt(oi.count(hr(e) - 1, e), t, 2);
}
function gg(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? ai(e) : ai.ceil(e);
}
function Vw(e, t) {
  return e = gg(e), xt(ai.count(hr(e), e) + (hr(e).getUTCDay() === 4), t, 2);
}
function qw(e) {
  return e.getUTCDay();
}
function Yw(e, t) {
  return xt(Do.count(hr(e) - 1, e), t, 2);
}
function Xw(e, t) {
  return xt(e.getUTCFullYear() % 100, t, 2);
}
function Kw(e, t) {
  return e = gg(e), xt(e.getUTCFullYear() % 100, t, 2);
}
function Qw(e, t) {
  return xt(e.getUTCFullYear() % 1e4, t, 4);
}
function Zw(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? ai(e) : ai.ceil(e), xt(e.getUTCFullYear() % 1e4, t, 4);
}
function Jw() {
  return "+0000";
}
function rh() {
  return "%";
}
function ih(e) {
  return +e;
}
function oh(e) {
  return Math.floor(+e / 1e3);
}
var gi, mg, yg;
ex({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function ex(e) {
  return gi = ew(e), mg = gi.format, gi.parse, yg = gi.utcFormat, gi.utcParse, gi;
}
function tx(e) {
  return new Date(e);
}
function nx(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Gc(e, t, n, r, i, o, a, u, f, c) {
  var p = Tc(), h = p.invert, w = p.domain, P = c(".%L"), _ = c(":%S"), T = c("%I:%M"), B = c("%I %p"), k = c("%a %d"), $ = c("%b %d"), N = c("%B"), L = c("%Y");
  function M(D) {
    return (f(D) < D ? P : u(D) < D ? _ : a(D) < D ? T : o(D) < D ? B : r(D) < D ? i(D) < D ? k : $ : n(D) < D ? N : L)(D);
  }
  return p.invert = function(D) {
    return new Date(h(D));
  }, p.domain = function(D) {
    return arguments.length ? w(Array.from(D, nx)) : w().map(tx);
  }, p.ticks = function(D) {
    var te = w();
    return e(te[0], te[te.length - 1], D == null ? 10 : D);
  }, p.tickFormat = function(D, te) {
    return te == null ? M : c(te);
  }, p.nice = function(D) {
    var te = w();
    return (!D || typeof D.range != "function") && (D = t(te[0], te[te.length - 1], D == null ? 10 : D)), D ? w(Gv(te, D)) : p;
  }, p.copy = function() {
    return Qo(p, Gc(e, t, n, r, i, o, a, u, f, c));
  }, p;
}
function bg() {
  return Nn.apply(Gc(fg, dg, dr, Mu, ri, ji, Eu, Nu, Zn, mg).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function wg() {
  return Nn.apply(Gc(lg, cg, hr, ku, oi, Gi, Au, Ou, Zn, yg).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Iu() {
  var e = 0, t = 1, n, r, i, o, a = rn, u = !1, f;
  function c(h) {
    return h == null || isNaN(h = +h) ? f : a(i === 0 ? 0.5 : (h = (o(h) - n) * i, u ? Math.max(0, Math.min(1, h)) : h));
  }
  c.domain = function(h) {
    return arguments.length ? ([e, t] = h, n = o(e = +e), r = o(t = +t), i = n === r ? 0 : 1 / (r - n), c) : [e, t];
  }, c.clamp = function(h) {
    return arguments.length ? (u = !!h, c) : u;
  }, c.interpolator = function(h) {
    return arguments.length ? (a = h, c) : a;
  };
  function p(h) {
    return function(w) {
      var P, _;
      return arguments.length ? ([P, _] = w, a = h(P, _), c) : [a(0), a(1)];
    };
  }
  return c.range = p(Li), c.rangeRound = p(Ko), c.unknown = function(h) {
    return arguments.length ? (f = h, c) : f;
  }, function(h) {
    return o = h, n = h(e), r = h(t), i = n === r ? 0 : 1 / (r - n), c;
  };
}
function jr(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function xg() {
  var e = Lr(Iu()(rn));
  return e.copy = function() {
    return jr(e, xg());
  }, vr.apply(e, arguments);
}
function _g() {
  var e = Oc(Iu()).domain([1, 10]);
  return e.copy = function() {
    return jr(e, _g()).base(e.base());
  }, vr.apply(e, arguments);
}
function Rg() {
  var e = kc(Iu());
  return e.copy = function() {
    return jr(e, Rg()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Hc() {
  var e = $c(Iu());
  return e.copy = function() {
    return jr(e, Hc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function rx() {
  return Hc.apply(null, arguments).exponent(0.5);
}
function Sg() {
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
    return Array.from({ length: r + 1 }, (i, o) => Mb(e, o / r));
  }, n.copy = function() {
    return Sg(t).domain(e);
  }, vr.apply(n, arguments);
}
function $u() {
  var e = 0, t = 0.5, n = 1, r = 1, i, o, a, u, f, c = rn, p, h = !1, w;
  function P(T) {
    return isNaN(T = +T) ? w : (T = 0.5 + ((T = +p(T)) - o) * (r * T < r * o ? u : f), c(h ? Math.max(0, Math.min(1, T)) : T));
  }
  P.domain = function(T) {
    return arguments.length ? ([e, t, n] = T, i = p(e = +e), o = p(t = +t), a = p(n = +n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P) : [e, t, n];
  }, P.clamp = function(T) {
    return arguments.length ? (h = !!T, P) : h;
  }, P.interpolator = function(T) {
    return arguments.length ? (c = T, P) : c;
  };
  function _(T) {
    return function(B) {
      var k, $, N;
      return arguments.length ? ([k, $, N] = B, c = Fv(T, [k, $, N]), P) : [c(0), c(0.5), c(1)];
    };
  }
  return P.range = _(Li), P.rangeRound = _(Ko), P.unknown = function(T) {
    return arguments.length ? (w = T, P) : w;
  }, function(T) {
    return p = T, i = T(e), o = T(t), a = T(n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, P;
  };
}
function Cg() {
  var e = Lr($u()(rn));
  return e.copy = function() {
    return jr(e, Cg());
  }, vr.apply(e, arguments);
}
function Pg() {
  var e = Oc($u()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return jr(e, Pg()).base(e.base());
  }, vr.apply(e, arguments);
}
function Tg() {
  var e = kc($u());
  return e.copy = function() {
    return jr(e, Tg()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Wc() {
  var e = $c($u());
  return e.copy = function() {
    return jr(e, Wc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function ix() {
  return Wc.apply(null, arguments).exponent(0.5);
}
const ox = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: _u,
  scalePoint: rv,
  scaleIdentity: jv,
  scaleLinear: Mc,
  scaleLog: Ac,
  scaleSymlog: Ic,
  scaleOrdinal: xu,
  scaleImplicit: Cl,
  scalePow: Tu,
  scaleSqrt: Hv,
  scaleRadial: Wv,
  scaleQuantile: Bc,
  scaleQuantize: Fc,
  scaleThreshold: Dc,
  scaleTime: bg,
  scaleUtc: wg,
  scaleSequential: xg,
  scaleSequentialLog: _g,
  scaleSequentialPow: Hc,
  scaleSequentialSqrt: rx,
  scaleSequentialSymlog: Rg,
  scaleSequentialQuantile: Sg,
  scaleDiverging: Cg,
  scaleDivergingLog: Pg,
  scaleDivergingPow: Wc,
  scaleDivergingSqrt: ix,
  scaleDivergingSymlog: Tg,
  tickFormat: Lv
}, Symbol.toStringTag, { value: "Module" }));
function ax(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
function ux(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
function sx(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
function lx(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
function cx(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
function fx(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
function dx(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var ah = {
  lab: Mv,
  hcl: Av,
  "hcl-long": kv,
  hsl: Nv,
  "hsl-long": Ev,
  cubehelix: $v,
  "cubehelix-long": Bv,
  rgb: tu
};
function hx(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return ah[e];
  }
  var t = e.type, n = e.gamma, r = ah[t];
  return typeof n > "u" ? r : r.gamma(n);
}
function px(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = hx(t.interpolate);
    e.interpolate(n);
  }
}
var vx = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), gx = "%Y-%m-%d %H:%M";
function mx(e) {
  var t = e.tickFormat(1, gx)(vx);
  return t === "2020-02-02 03:04";
}
var uh = {
  day: ji,
  hour: Eu,
  minute: Nu,
  month: Mu,
  second: Zn,
  week: ri,
  year: dr
}, sh = {
  day: Gi,
  hour: Au,
  minute: Ou,
  month: ku,
  second: Zn,
  week: oi,
  year: hr
};
function yx(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = mx(r);
      if (typeof n == "string")
        r.nice(i ? sh[n] : uh[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? sh[o] : uh[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
function bx(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
function wx(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
function xx(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(Ko));
}
function _x(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
function Rx(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
var Sx = [
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
], Cx = {
  domain: ax,
  nice: yx,
  zero: Rx,
  interpolate: px,
  round: xx,
  align: sx,
  base: lx,
  clamp: cx,
  constant: fx,
  exponent: dx,
  padding: bx,
  range: ux,
  reverse: wx,
  unknown: _x
};
function gn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = Sx.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      Cx[f](a, u);
    }), a;
  };
}
var Px = gn("domain", "range", "reverse", "align", "padding", "round");
function Tx(e) {
  return Px(_u(), e);
}
var Nx = gn("domain", "range", "reverse", "align", "padding", "round");
function Ex(e) {
  return Nx(rv(), e);
}
var Mx = gn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function lh(e) {
  return Mx(Mc(), e);
}
var Ox = gn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Ax(e) {
  return Ox(bg(), e);
}
var kx = gn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Ix(e) {
  return kx(wg(), e);
}
var $x = gn("domain", "range", "reverse", "base", "clamp", "interpolate", "nice", "round");
function Bx(e) {
  return $x(Ac(), e);
}
var Fx = gn("domain", "range", "reverse", "clamp", "exponent", "interpolate", "nice", "round", "zero");
function Dx(e) {
  return Fx(Tu(), e);
}
var zx = gn("domain", "range", "reverse", "unknown");
function Lx(e) {
  return zx(xu(), e);
}
var jx = gn("domain", "range", "reverse", "nice", "zero");
function Gx(e) {
  return jx(Fc(), e);
}
var Hx = gn("domain", "range", "reverse");
function Wx(e) {
  return Hx(Bc(), e);
}
var Ux = gn("domain", "range", "reverse", "clamp", "constant", "nice", "zero", "round");
function Vx(e) {
  return Ux(Ic(), e);
}
var qx = gn("domain", "range", "reverse");
function Yx(e) {
  return qx(Dc(), e);
}
var Xx = gn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function Kx(e) {
  return Xx(Hv(), e);
}
function $a(e) {
  if (typeof e < "u" && "type" in e)
    switch (e.type) {
      case "linear":
        return lh(e);
      case "log":
        return Bx(e);
      case "pow":
        return Dx(e);
      case "sqrt":
        return Kx(e);
      case "symlog":
        return Vx(e);
      case "time":
        return Ax(e);
      case "utc":
        return Ix(e);
      case "quantile":
        return Wx(e);
      case "quantize":
        return Gx(e);
      case "threshold":
        return Yx(e);
      case "ordinal":
        return Lx(e);
      case "point":
        return Ex(e);
      case "band":
        return Tx(e);
    }
  return lh(e);
}
function Qx(e) {
  if ((typeof e == "function" || typeof e == "object" && !!e) && "valueOf" in e) {
    var t = e.valueOf();
    if (typeof t == "number")
      return t;
  }
  return e;
}
var Zx = /* @__PURE__ */ new Set(["linear", "pow", "quantize", "sqrt", "symlog"]);
function ch(e) {
  return Zx.has(e.type);
}
var Jx = /* @__PURE__ */ Dn.createContext({});
const Gr = Jx;
function Il(e) {
  var t, n = e;
  return n && "bandwidth" in n && (t = n == null ? void 0 : n.bandwidth()) != null ? t : 0;
}
function en(e) {
  return e != null && typeof e == "number" && !Number.isNaN(e) && Number.isFinite(e);
}
let Uc = Jo();
const at = (e) => Zo(e, Uc);
let Vc = Jo();
at.write = (e) => Zo(e, Vc);
let Bu = Jo();
at.onStart = (e) => Zo(e, Bu);
let qc = Jo();
at.onFrame = (e) => Zo(e, qc);
let Yc = Jo();
at.onFinish = (e) => Zo(e, Yc);
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
  return Ei.splice(Ng(n), 0, i), kr += 1, Eg(), i;
};
let Ng = (e) => ~(~Ei.findIndex((t) => t.time > e) || ~Ei.length);
at.cancel = (e) => {
  Bu.delete(e), qc.delete(e), Yc.delete(e), Uc.delete(e), Vc.delete(e);
};
at.sync = (e) => {
  $l = !0, at.batchedUpdates(e), $l = !1;
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
let Xc = typeof window < "u" ? window.requestAnimationFrame : () => {
};
at.use = (e) => Xc = e;
at.now = typeof performance < "u" ? () => performance.now() : Date.now;
at.batchedUpdates = (e) => e();
at.catch = console.error;
at.frameLoop = "always";
at.advance = () => {
  at.frameLoop !== "demand" ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : Og();
};
let Ar = -1, kr = 0, $l = !1;
function Zo(e, t) {
  $l ? (t.delete(e), e(0)) : (t.add(e), Eg());
}
function Eg() {
  Ar < 0 && (Ar = 0, at.frameLoop !== "demand" && Xc(Mg));
}
function e_() {
  Ar = -1;
}
function Mg() {
  ~Ar && (Xc(Mg), at.batchedUpdates(Og));
}
function Og() {
  let e = Ar;
  Ar = at.now();
  let t = Ng(Ar);
  if (t && (Ag(Ei.splice(0, t), (n) => n.handler()), kr -= t), !kr) {
    e_();
    return;
  }
  Bu.flush(), Uc.flush(e ? Math.min(64, Ar - e) : 16.667), qc.flush(), Vc.flush(), Yc.flush();
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
      t.size && (e = /* @__PURE__ */ new Set(), kr -= t.size, Ag(t, (r) => r(n) && e.add(r)), kr += e.size, t = e);
    }
  };
}
function Ag(e, t) {
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
const t_ = (e, t, n) => Object.defineProperty(e, t, {
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
const Ro = (e, ...t) => No(e, (n) => n(...t)), Kc = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
let Qc, kg, Br = null, Ig = !1, Zc = Bl;
const n_ = (e) => {
  e.to && (kg = e.to), e.now && (at.now = e.now), e.colors !== void 0 && (Br = e.colors), e.skipAnimation != null && (Ig = e.skipAnimation), e.createStringInterpolator && (Qc = e.createStringInterpolator), e.requestAnimationFrame && at.use(e.requestAnimationFrame), e.batchedUpdates && (at.batchedUpdates = e.batchedUpdates), e.willAdvance && (Zc = e.willAdvance), e.frameLoop && (at.frameLoop = e.frameLoop);
};
var nr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return Qc;
  },
  get to() {
    return kg;
  },
  get colors() {
    return Br;
  },
  get skipAnimation() {
    return Ig;
  },
  get willAdvance() {
    return Zc;
  },
  assign: n_
});
const Eo = /* @__PURE__ */ new Set();
let Pn = [], Xs = [], au = 0;
const Fu = {
  get idle() {
    return !Eo.size && !Pn.length;
  },
  start(e) {
    au > e.priority ? (Eo.add(e), at.onStart(r_)) : ($g(e), at(Fl));
  },
  advance: Fl,
  sort(e) {
    if (au)
      at.onFrame(() => Fu.sort(e));
    else {
      const t = Pn.indexOf(e);
      ~t && (Pn.splice(t, 1), Bg(e));
    }
  },
  clear() {
    Pn = [], Eo.clear();
  }
};
function r_() {
  Eo.forEach($g), Eo.clear(), at(Fl);
}
function $g(e) {
  Pn.includes(e) || Bg(e);
}
function Bg(e) {
  Pn.splice(i_(Pn, (t) => t.priority > e.priority), 0, e);
}
function Fl(e) {
  const t = Xs;
  for (let n = 0; n < Pn.length; n++) {
    const r = Pn[n];
    au = r.priority, r.idle || (Zc(r), r.advance(e), r.idle || t.push(r));
  }
  return au = 0, Xs = Pn, Xs.length = 0, Pn = t, Pn.length > 0;
}
function i_(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
const o_ = {
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
}, Bn = "[-+]?\\d*\\.?\\d+", uu = Bn + "%";
function Du(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const a_ = new RegExp("rgb" + Du(Bn, Bn, Bn)), u_ = new RegExp("rgba" + Du(Bn, Bn, Bn, Bn)), s_ = new RegExp("hsl" + Du(Bn, uu, uu)), l_ = new RegExp("hsla" + Du(Bn, uu, uu, Bn)), c_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, f_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, d_ = /^#([0-9a-fA-F]{6})$/, h_ = /^#([0-9a-fA-F]{8})$/;
function p_(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = d_.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Br && Br[e] !== void 0 ? Br[e] : (t = a_.exec(e)) ? (mi(t[1]) << 24 | mi(t[2]) << 16 | mi(t[3]) << 8 | 255) >>> 0 : (t = u_.exec(e)) ? (mi(t[1]) << 24 | mi(t[2]) << 16 | mi(t[3]) << 8 | hh(t[4])) >>> 0 : (t = c_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = h_.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = f_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = s_.exec(e)) ? (fh(dh(t[1]), Ba(t[2]), Ba(t[3])) | 255) >>> 0 : (t = l_.exec(e)) ? (fh(dh(t[1]), Ba(t[2]), Ba(t[3])) | hh(t[4])) >>> 0 : null;
}
function Ks(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function fh(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = Ks(i, r, e + 1 / 3), a = Ks(i, r, e), u = Ks(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(a * 255) << 16 | Math.round(u * 255) << 8;
}
function mi(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function dh(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function hh(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function Ba(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function ph(e) {
  let t = p_(e);
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
    return Qc(e);
  const r = e, i = r.output, o = r.range || [0, 1], a = r.extrapolateLeft || r.extrapolate || "extend", u = r.extrapolateRight || r.extrapolate || "extend", f = r.easing || ((c) => c);
  return (c) => {
    const p = g_(c, o);
    return v_(c, o[p], o[p + 1], i[p], i[p + 1], f, a, u, r.map);
  };
};
function v_(e, t, n, r, i, o, a, u, f) {
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
function g_(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
function Dl() {
  return Dl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Dl.apply(this, arguments);
}
const Bi = Symbol.for("FluidValue.get"), ui = Symbol.for("FluidValue.observers"), Cn = (e) => Boolean(e && e[Bi]), cn = (e) => e && e[Bi] ? e[Bi]() : e, vh = (e) => e[ui] || null;
function m_(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function Lo(e, t) {
  let n = e[ui];
  n && n.forEach((r) => {
    m_(r, t);
  });
}
class Fg {
  constructor(t) {
    if (this[Bi] = void 0, this[ui] = void 0, !t && !(t = this.get))
      throw Error("Unknown getter");
    y_(this, t);
  }
}
const y_ = (e, t) => Dg(e, Bi, t);
function Hi(e, t) {
  if (e[Bi]) {
    let n = e[ui];
    n || Dg(e, ui, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function jo(e, t) {
  let n = e[ui];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[ui] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
const Dg = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), Va = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, b_ = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, gh = new RegExp(`(${Va.source})(%|[a-z]+)`, "i"), w_ = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, zu = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, zg = (e) => {
  const [t, n] = x_(e);
  if (!t || Kc())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && zu.test(n))
      return zg(n);
    if (n)
      return n;
  }
  return e;
}, x_ = (e) => {
  const t = zu.exec(e);
  if (!t)
    return [,];
  const [, n, r] = t;
  return [n, r];
};
let Qs;
const __ = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, Lg = (e) => {
  Qs || (Qs = Br ? new RegExp(`(${Object.keys(Br).join("|")})(?!\\w)`, "g") : /^\b$/);
  const t = e.output.map((o) => cn(o).replace(zu, zg).replace(b_, ph).replace(Qs, ph)), n = t.map((o) => o.match(Va).map(Number)), i = n[0].map((o, a) => n.map((u) => {
    if (!(a in u))
      throw Error('The arity of each "output" value must be equal');
    return u[a];
  })).map((o) => zo(Dl({}, e, {
    output: o
  })));
  return (o) => {
    var a;
    const u = !gh.test(t[0]) && ((a = t.find((c) => gh.test(c))) == null ? void 0 : a.replace(Va, ""));
    let f = 0;
    return t[0].replace(Va, () => `${i[f++](o)}${u || ""}`).replace(w_, __);
  };
}, Jc = "react-spring: ", jg = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${Jc}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, R_ = jg(console.warn);
function S_() {
  R_(`${Jc}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const C_ = jg(console.warn);
function P_() {
  C_(`${Jc}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function Lu(e) {
  return de.str(e) && (e[0] == "#" || /\d/.test(e) || !Kc() && zu.test(e) || e in (Br || {}));
}
const ef = Kc() ? on : Em, T_ = () => {
  const e = tn(!1);
  return ef(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Gg() {
  const e = pr()[1], t = T_();
  return () => {
    t.current && e(Math.random());
  };
}
function N_(e, t) {
  const [n] = pr(() => ({
    inputs: t,
    result: e()
  })), r = tn(), i = r.current;
  let o = i;
  return o ? Boolean(t && o.inputs && E_(t, o.inputs)) || (o = {
    inputs: t,
    result: e()
  }) : o = n, on(() => {
    r.current = o, i == n && (n.inputs = n.result = void 0);
  }, [o]), o.result;
}
function E_(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
const Hg = (e) => on(e, M_), M_ = [];
function mh(e) {
  const t = tn();
  return on(() => {
    t.current = e;
  }), t.current;
}
var O_ = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@react-spring/animated/dist/react-spring-animated.esm.js";
const Go = Symbol.for("Animated:node"), A_ = (e) => !!e && e[Go] === e, Kn = (e) => e && e[Go], tf = (e, t) => t_(e, Go, t), ju = (e) => e && e[Go] && e[Go].getPayload();
class Wg {
  constructor() {
    this.payload = void 0, tf(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}
class Wi extends Wg {
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
class Fi extends Wi {
  constructor(t) {
    super(0), this._string = null, this._toString = void 0, this._toString = zo({
      output: [t, t]
    });
  }
  static create(t) {
    return new Fi(t);
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
class Gu extends Wg {
  constructor(t) {
    super(), this.source = t, this.setValue(t);
  }
  getValue(t) {
    const n = {};
    return tr(this.source, (r, i) => {
      A_(r) ? n[i] = r.getValue(t) : Cn(r) ? n[i] = cn(r) : t || (n[i] = r);
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
    su.dependencies && Cn(t) && su.dependencies.add(t);
    const n = ju(t);
    n && bt(n, (r) => this.add(r));
  }
}
class nf extends Gu {
  constructor(t) {
    super(t);
  }
  static create(t) {
    return new nf(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(k_)), !0);
  }
}
function k_(e) {
  return (Lu(e) ? Fi : Wi).create(e);
}
function zl(e) {
  const t = Kn(e);
  return t ? t.constructor : de.arr(e) ? nf : Lu(e) ? Fi : Wi;
}
function Ll() {
  return Ll = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ll.apply(this, arguments);
}
const yh = (e, t) => {
  const n = !de.fun(e) || e.prototype && e.prototype.isReactComponent;
  return Mm((r, i) => {
    const o = tn(null), a = n && wt((_) => {
      o.current = B_(i, _);
    }, [i]), [u, f] = $_(r, t), c = Gg(), p = () => {
      const _ = o.current;
      if (n && !_)
        return;
      (_ ? t.applyAnimatedValues(_, u.getValue(!0)) : !1) === !1 && c();
    }, h = new I_(p, f), w = tn();
    ef(() => (w.current = h, bt(f, (_) => Hi(_, h)), () => {
      w.current && (bt(w.current.deps, (_) => jo(_, w.current)), at.cancel(w.current.update));
    })), on(p, []), Hg(() => () => {
      const _ = w.current;
      bt(_.deps, (T) => jo(T, _));
    });
    const P = t.getComponentProps(u.getValue());
    return /* @__PURE__ */ j(e, {
      ...P,
      ref: a
    }, void 0, !1, {
      fileName: O_,
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
function $_(e, t) {
  const n = /* @__PURE__ */ new Set();
  return su.dependencies = n, e.style && (e = Ll({}, e, {
    style: t.createAnimatedStyle(e.style)
  })), e = new Gu(e), su.dependencies = null, [e, n];
}
function B_(e, t) {
  return e && (de.fun(e) ? e(t) : e.current = t), t;
}
const bh = Symbol.for("AnimatedComponent"), F_ = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new Gu(i),
  getComponentProps: r = (i) => i
} = {}) => {
  const i = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, o = (a) => {
    const u = wh(a) || "Anonymous";
    return de.str(a) ? a = o[a] || (o[a] = yh(a, i)) : a = a[bh] || (a[bh] = yh(a, i)), a.displayName = `Animated(${u})`, a;
  };
  return tr(e, (a, u) => {
    de.arr(e) && (u = wh(a)), o[u] = o(a);
  }), {
    animated: o
  };
}, wh = (e) => de.str(e) ? e : e && de.str(e.displayName) ? e.displayName : de.fun(e) && e.name || null;
var D_ = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@react-spring/core/dist/react-spring-core.esm.js";
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
const Mo = (e, t) => e === !0 || !!(t && e && (de.fun(e) ? e(t) : vn(e).includes(t))), Ug = (e, t) => de.obj(e) ? t && e[t] : e, Vg = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, z_ = (e) => e, rf = (e, t = z_) => {
  let n = L_;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    de.und(o) || (r[i] = o);
  }
  return r;
}, L_ = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"], j_ = {
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
function G_(e) {
  const t = {};
  let n = 0;
  if (tr(e, (r, i) => {
    j_[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function qg(e) {
  const t = G_(e);
  if (t) {
    const n = {
      to: t
    };
    return tr(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return Ut({}, e);
}
function Ho(e) {
  return e = cn(e), de.arr(e) ? e.map(Ho) : Lu(e) ? nr.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function H_(e) {
  for (const t in e)
    return !0;
  return !1;
}
function jl(e) {
  return de.fun(e) || de.arr(e) && de.obj(e[0]);
}
function W_(e, t) {
  var n;
  (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
}
function U_(e, t) {
  if (t && e.ref !== t) {
    var n;
    (n = e.ref) == null || n.delete(e), t.add(e), e.ref = t;
  }
}
const V_ = {
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
}, lu = 1.70158, Fa = lu * 1.525, xh = lu + 1, _h = 2 * Math.PI / 3, Rh = 2 * Math.PI / 4.5, Da = (e) => e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375, q_ = {
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
  easeInBack: (e) => xh * e * e * e - lu * e * e,
  easeOutBack: (e) => 1 + xh * Math.pow(e - 1, 3) + lu * Math.pow(e - 1, 2),
  easeInOutBack: (e) => e < 0.5 ? Math.pow(2 * e, 2) * ((Fa + 1) * 2 * e - Fa) / 2 : (Math.pow(2 * e - 2, 2) * ((Fa + 1) * (e * 2 - 2) + Fa) + 2) / 2,
  easeInElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((e * 10 - 10.75) * _h),
  easeOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((e * 10 - 0.75) * _h) + 1,
  easeInOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * Rh)) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * Rh) / 2 + 1,
  easeInBounce: (e) => 1 - Da(1 - e),
  easeOutBounce: Da,
  easeInOutBounce: (e) => e < 0.5 ? (1 - Da(1 - 2 * e)) / 2 : (1 + Da(2 * e - 1)) / 2
}, Gl = Ut({}, V_.default, {
  mass: 1,
  damping: 1,
  easing: q_.linear,
  clamp: !1
});
class Y_ {
  constructor() {
    this.tension = void 0, this.friction = void 0, this.frequency = void 0, this.damping = void 0, this.mass = void 0, this.velocity = 0, this.restVelocity = void 0, this.precision = void 0, this.progress = void 0, this.duration = void 0, this.easing = void 0, this.clamp = void 0, this.bounce = void 0, this.decay = void 0, this.round = void 0, Object.assign(this, Gl);
  }
}
function X_(e, t, n) {
  n && (n = Ut({}, n), Sh(n, t), t = Ut({}, n, t)), Sh(e, t), Object.assign(e, t);
  for (const a in Gl)
    e[a] == null && (e[a] = Gl[a]);
  let {
    mass: r,
    frequency: i,
    damping: o
  } = e;
  return de.und(i) || (i < 0.01 && (i = 0.01), o < 0 && (o = 0), e.tension = Math.pow(2 * Math.PI / i, 2) * r, e.friction = 4 * Math.PI * o * r / i), e;
}
function Sh(e, t) {
  if (!de.und(t.decay))
    e.duration = void 0;
  else {
    const n = !de.und(t.tension) || !de.und(t.friction);
    (n || !de.und(t.frequency) || !de.und(t.damping) || !de.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
const Ch = [];
class K_ {
  constructor() {
    this.changed = !1, this.values = Ch, this.toValues = null, this.fromValues = Ch, this.to = void 0, this.from = void 0, this.config = new Y_(), this.immediate = !1;
  }
}
function Yg(e, {
  key: t,
  props: n,
  defaultProps: r,
  state: i,
  actions: o
}) {
  return new Promise((a, u) => {
    var f;
    let c, p, h = Mo((f = n.cancel) != null ? f : r == null ? void 0 : r.cancel, t);
    if (h)
      _();
    else {
      de.und(n.pause) || (i.paused = Mo(n.pause, t));
      let T = r == null ? void 0 : r.pause;
      T !== !0 && (T = i.paused || Mo(T, t)), c = Qr(n.delay || 0, t), T ? (i.resumeQueue.add(P), o.pause()) : (o.resume(), P());
    }
    function w() {
      i.resumeQueue.add(P), i.timeouts.delete(p), p.cancel(), c = p.time - at.now();
    }
    function P() {
      c > 0 && !nr.skipAnimation ? (i.delayed = !0, p = at.setTimeout(_, c), i.pauseQueue.add(w), i.timeouts.add(p)) : _();
    }
    function _() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(w), i.timeouts.delete(p), e <= (i.cancelId || 0) && (h = !0);
      try {
        o.start(Ut({}, n, {
          callId: e,
          cancel: h
        }), a);
      } catch (T) {
        u(T);
      }
    }
  });
}
const of = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? Mi(e.get()) : t.every((n) => n.noop) ? Xg(e.get()) : In(e.get(), t.every((n) => n.finished)), Xg = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), In = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), Mi = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function Kg(e, t, n, r) {
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
    const c = rf(t, (B, k) => k === "onRest" ? void 0 : B);
    let p, h;
    const w = new Promise((B, k) => (p = B, h = k)), P = (B) => {
      const k = i <= (n.cancelId || 0) && Mi(r) || i !== n.asyncId && In(r, !1);
      if (k)
        throw B.result = k, h(B), B;
    }, _ = (B, k) => {
      const $ = new Ph(), N = new Th();
      return (async () => {
        if (nr.skipAnimation)
          throw Wo(n), N.result = In(r, !1), h(N), N;
        P($);
        const L = de.obj(B) ? Ut({}, B) : Ut({}, k, {
          to: B
        });
        L.parentId = i, tr(c, (D, te) => {
          de.und(L[te]) && (L[te] = D);
        });
        const M = await r.start(L);
        return P($), n.paused && await new Promise((D) => {
          n.resumeQueue.add(D);
        }), M;
      })();
    };
    let T;
    if (nr.skipAnimation)
      return Wo(n), In(r, !1);
    try {
      let B;
      de.arr(e) ? B = (async (k) => {
        for (const $ of k)
          await _($);
      })(e) : B = Promise.resolve(e(_, r.stop.bind(r))), await Promise.all([B.then(p), w]), T = In(r.get(), !0, !1);
    } catch (B) {
      if (B instanceof Ph)
        T = B.result;
      else if (B instanceof Th)
        T = B.result;
      else
        throw B;
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
class Ph extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."), this.result = void 0;
  }
}
class Th extends Error {
  constructor() {
    super("SkipAnimationSignal"), this.result = void 0;
  }
}
const Hl = (e) => e instanceof af;
let Q_ = 1;
class af extends Fg {
  constructor(...t) {
    super(...t), this.id = Q_++, this.key = void 0, this._priority = 0;
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
    return S_(), nr.to(this, t);
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
    this.idle || Fu.sort(this), Lo(this, {
      type: "priority",
      parent: this,
      priority: t
    });
  }
}
const si = Symbol.for("SpringPhase"), Qg = 1, Wl = 2, Ul = 4, Zs = (e) => (e[si] & Qg) > 0, Cr = (e) => (e[si] & Wl) > 0, fo = (e) => (e[si] & Ul) > 0, Nh = (e, t) => t ? e[si] |= Wl | Qg : e[si] &= ~Wl, Eh = (e, t) => t ? e[si] |= Ul : e[si] &= ~Ul;
class Z_ extends af {
  constructor(t, n) {
    if (super(), this.key = void 0, this.animation = new K_(), this.queue = void 0, this.defaultProps = {}, this._state = {
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
    return Zs(this);
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
    !u && Cn(i.to) && (a = vn(cn(i.to))), i.values.forEach((p, h) => {
      if (p.done)
        return;
      const w = p.constructor == Fi ? 1 : u ? u[h].lastPosition : a[h];
      let P = i.immediate, _ = w;
      if (!P) {
        if (_ = p.lastPosition, o.tension <= 0) {
          p.done = !0;
          return;
        }
        let T = p.elapsedTime += t;
        const B = i.fromValues[h], k = p.v0 != null ? p.v0 : p.v0 = de.arr(o.velocity) ? o.velocity[h] : o.velocity;
        let $;
        if (de.und(o.duration))
          if (o.decay) {
            const N = o.decay === !0 ? 0.998 : o.decay, L = Math.exp(-(1 - N) * T);
            _ = B + k / (1 - N) * (1 - L), P = Math.abs(p.lastPosition - _) < 0.1, $ = k * L;
          } else {
            $ = p.lastVelocity == null ? k : p.lastVelocity;
            const N = o.precision || (B == w ? 5e-3 : Math.min(1, Math.abs(w - B) * 1e-3)), L = o.restVelocity || N / 10, M = o.clamp ? 0 : o.bounce, D = !de.und(M), te = B == w ? p.v0 > 0 : B < w;
            let Q, fe = !1;
            const ge = 1, re = Math.ceil(t / ge);
            for (let ee = 0; ee < re && (Q = Math.abs($) > L, !(!Q && (P = Math.abs(w - _) <= N, P))); ++ee) {
              D && (fe = _ == w || _ > w == te, fe && ($ = -$ * M, _ = w));
              const be = -o.tension * 1e-6 * (_ - w), Oe = -o.friction * 1e-3 * $, ut = (be + Oe) / o.mass;
              $ = $ + ut * ge, _ = _ + $ * ge;
            }
          }
        else {
          let N = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, p.durationProgress > 0 && (p.elapsedTime = o.duration * p.durationProgress, T = p.elapsedTime += t)), N = (o.progress || 0) + T / this._memoizedDuration, N = N > 1 ? 1 : N < 0 ? 0 : N, p.durationProgress = N), _ = B + o.easing(N) * (w - B), $ = (_ - p.lastPosition) / t, P = N == 1;
        }
        p.lastVelocity = $, Number.isNaN(_) && (console.warn("Got NaN while animating:", this), P = !0);
      }
      u && !u[h].done && (P = !1), P ? p.done = !0 : n = !1, p.setValue(_, o.round) && (r = !0);
    });
    const f = Kn(this), c = f.getValue();
    if (n) {
      const p = cn(i.to);
      (c !== p || r) && !o.decay ? (f.setValue(p), this._onChange(p)) : r && o.decay && this._onChange(c), this._stop();
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
    })], Promise.all(r.map((i) => this._update(i))).then((i) => of(this, i));
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
    return Zs(this) || (t.reverse && ([r, i] = [i, r]), i = cn(i), de.und(i) ? Kn(this) || this._set(r) : this._set(i)), o;
  }
  _update(t, n) {
    let r = Ut({}, t);
    const {
      key: i,
      defaultProps: o
    } = this;
    r.default && Object.assign(o, rf(r, (f, c) => /^on/.test(c) ? Ug(f, i) : f)), Oh(this, r, "onProps"), po(this, "onProps", r, this);
    const a = this._prepareNode(r);
    if (Object.isFrozen(this))
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    const u = this._state;
    return Yg(++this._lastCallId, {
      key: i,
      props: r,
      defaultProps: o,
      state: u,
      actions: {
        pause: () => {
          fo(this) || (Eh(this, !0), Ro(u.pauseQueue), po(this, "onPause", In(this, ho(this, this.animation.to)), this));
        },
        resume: () => {
          fo(this) && (Eh(this, !1), Cr(this) && this._resume(), Ro(u.resumeQueue), po(this, "onResume", In(this, ho(this, this.animation.to)), this));
        },
        start: this._merge.bind(this, a)
      }
    }).then((f) => {
      if (r.loop && f.finished && !(n && f.noop)) {
        const c = Zg(r);
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
      from: p
    } = f;
    let {
      to: h = c,
      from: w = p
    } = t;
    o && !i && (!n.default || de.und(h)) && (h = w), n.reverse && ([h, w] = [w, h]);
    const P = !sr(w, p);
    P && (f.from = w), w = cn(w);
    const _ = !sr(h, c);
    _ && this._focus(h);
    const T = jl(n.to), {
      config: B
    } = f, {
      decay: k,
      velocity: $
    } = B;
    (i || o) && (B.velocity = 0), n.config && !T && X_(B, Qr(n.config, a), n.config !== u.config ? Qr(u.config, a) : void 0);
    let N = Kn(this);
    if (!N || de.und(h))
      return r(In(this, !0));
    const L = de.und(n.reset) ? o && !n.default : !de.und(w) && Mo(n.reset, a), M = L ? w : this.get(), D = Ho(h), te = de.num(D) || de.arr(D) || Lu(D), Q = !T && (!te || Mo(u.immediate || n.immediate, a));
    if (_) {
      const ee = zl(h);
      if (ee !== N.constructor)
        if (Q)
          N = this._set(D);
        else
          throw Error(`Cannot animate between ${N.constructor.name} and ${ee.name}, as the "to" prop suggests`);
    }
    const fe = N.constructor;
    let ge = Cn(h), re = !1;
    if (!ge) {
      const ee = L || !Zs(this) && P;
      (_ || ee) && (re = sr(Ho(M), D), ge = !re), (!sr(f.immediate, Q) && !Q || !sr(B.decay, k) || !sr(B.velocity, $)) && (ge = !0);
    }
    if (re && Cr(this) && (f.changed && !L ? ge = !0 : ge || this._stop(c)), !T && ((ge || Cn(c)) && (f.values = N.getPayload(), f.toValues = Cn(h) ? null : fe == Fi ? [1] : vn(D)), f.immediate != Q && (f.immediate = Q, !Q && !L && this._set(c)), ge)) {
      const {
        onRest: ee
      } = f;
      bt(eR, (Oe) => Oh(this, n, Oe));
      const be = In(this, ho(this, c));
      Ro(this._pendingCalls, be), this._pendingCalls.add(r), f.changed && at.batchedUpdates(() => {
        f.changed = !L, ee == null || ee(be, this), L ? Qr(u.onRest, be) : f.onStart == null || f.onStart(be, this);
      });
    }
    L && this._set(M), T ? r(Kg(n.to, n, this._state, this)) : ge ? this._start() : Cr(this) && !_ ? this._pendingCalls.add(r) : r(Xg(M));
  }
  _focus(t) {
    const n = this.animation;
    t !== n.to && (vh(this) && this._detach(), n.to = t, vh(this) && this._attach());
  }
  _attach() {
    let t = 0;
    const {
      to: n
    } = this.animation;
    Cn(n) && (Hi(n, this), Hl(n) && (t = n.priority + 1)), this.priority = t;
  }
  _detach() {
    const {
      to: t
    } = this.animation;
    Cn(t) && jo(t, this);
  }
  _set(t, n = !0) {
    const r = cn(t);
    if (!de.und(r)) {
      const i = Kn(this);
      if (!i || !sr(r, i.getValue())) {
        const o = zl(r);
        !i || i.constructor != o ? tf(this, o.create(r)) : i.setValue(r), i && at.batchedUpdates(() => {
          this._onChange(r, n);
        });
      }
    }
    return Kn(this);
  }
  _onStart() {
    const t = this.animation;
    t.changed || (t.changed = !0, po(this, "onStart", In(this, ho(this, t.to)), this));
  }
  _onChange(t, n) {
    n || (this._onStart(), Qr(this.animation.onChange, t, this)), Qr(this.defaultProps.onChange, t, this), super._onChange(t, n);
  }
  _start() {
    const t = this.animation;
    Kn(this).reset(cn(t.to)), t.immediate || (t.fromValues = t.values.map((n) => n.lastPosition)), Cr(this) || (Nh(this, !0), fo(this) || this._resume());
  }
  _resume() {
    nr.skipAnimation ? this.finish() : Fu.start(this);
  }
  _stop(t, n) {
    if (Cr(this)) {
      Nh(this, !1);
      const r = this.animation;
      bt(r.values, (o) => {
        o.done = !0;
      }), r.toValues && (r.onChange = r.onPause = r.onResume = void 0), Lo(this, {
        type: "idle",
        parent: this
      });
      const i = n ? Mi(this.get()) : In(this.get(), ho(this, t != null ? t : r.to));
      Ro(this._pendingCalls, i), r.changed && (r.changed = !1, po(this, "onRest", i, this));
    }
  }
}
function ho(e, t) {
  const n = Ho(t), r = Ho(e.get());
  return sr(r, n);
}
function Zg(e, t = e.loop, n = e.to) {
  let r = Qr(t);
  if (r) {
    const i = r !== !0 && qg(r), o = (i || e).reverse, a = !i || i.reset;
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
  } = e = qg(e), r = /* @__PURE__ */ new Set();
  return de.obj(t) && Mh(t, r), de.obj(n) && Mh(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function J_(e) {
  const t = Uo(e);
  return de.und(t.default) && (t.default = rf(t)), t;
}
function Mh(e, t) {
  tr(e, (n, r) => n != null && t.add(r));
}
const eR = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function Oh(e, t, n) {
  e.animation[n] = t[n] !== Vg(t, n) ? Ug(t[n], e.key) : void 0;
}
function po(e, t, ...n) {
  var r, i, o, a;
  (r = (i = e.animation)[t]) == null || r.call(i, ...n), (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
}
const tR = ["onStart", "onChange", "onRest"];
let nR = 1;
class rR {
  constructor(t, n) {
    this.id = nR++, this.springs = {}, this.queue = [], this.ref = void 0, this._flush = void 0, this._initialProps = void 0, this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._item = void 0, this._state = {
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
    return t ? n = vn(t).map(Uo) : this.queue = [], this._flush ? this._flush(this, n) : (rm(this, n), Vl(this, n));
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
function Vl(e, t) {
  return Promise.all(t.map((n) => Jg(e, n))).then((n) => of(e, n));
}
async function Jg(e, t, n) {
  const {
    keys: r,
    to: i,
    from: o,
    loop: a,
    onRest: u,
    onResolve: f
  } = t, c = de.obj(t.default) && t.default;
  a && (t.loop = !1), i === !1 && (t.to = null), o === !1 && (t.from = null);
  const p = de.arr(i) || de.fun(i) ? i : void 0;
  p ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : bt(tR, (T) => {
    const B = t[T];
    if (de.fun(B)) {
      const k = e._events[T];
      t[T] = ({
        finished: $,
        cancelled: N
      }) => {
        const L = k.get(B);
        L ? ($ || (L.finished = !1), N && (L.cancelled = !0)) : k.set(B, {
          value: null,
          finished: $ || !1,
          cancelled: N || !1
        });
      }, c && (c[T] = t[T]);
    }
  });
  const h = e._state;
  t.pause === !h.paused ? (h.paused = t.pause, Ro(t.pause ? h.pauseQueue : h.resumeQueue)) : h.paused && (t.pause = !0);
  const w = (r || Object.keys(e.springs)).map((T) => e.springs[T].start(t)), P = t.cancel === !0 || Vg(t, "cancel") === !0;
  (p || P && h.asyncId) && w.push(Yg(++e._lastAsyncId, {
    props: t,
    state: h,
    actions: {
      pause: Bl,
      resume: Bl,
      start(T, B) {
        P ? (Wo(h, e._lastAsyncId), B(Mi(e))) : (T.onRest = u, B(Kg(p, T, h, e)));
      }
    }
  })), h.paused && await new Promise((T) => {
    h.resumeQueue.add(T);
  });
  const _ = of(e, await Promise.all(w));
  if (a && _.finished && !(n && _.noop)) {
    const T = Zg(t, a, i);
    if (T)
      return rm(e, [T]), Jg(e, T, !0);
  }
  return f && at.batchedUpdates(() => f(_, e, e.item)), _;
}
function Ah(e, t) {
  const n = Ut({}, e.springs);
  return t && bt(vn(t), (r) => {
    de.und(r.keys) && (r = Uo(r)), de.obj(r.to) || (r = Ut({}, r, {
      to: void 0
    })), nm(n, r, (i) => tm(i));
  }), em(e, n), n;
}
function em(e, t) {
  tr(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Hi(n, e));
  });
}
function tm(e, t) {
  const n = new Z_();
  return n.key = e, t && Hi(n, t), n;
}
function nm(e, t, n) {
  t.keys && bt(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function rm(e, t) {
  bt(t, (n) => {
    nm(e.springs, n, (r) => tm(r, e));
  });
}
function iR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const oR = ["children"], Hu = (e) => {
  let {
    children: t
  } = e, n = iR(e, oR);
  const r = an(cu), i = n.pause || !!r.pause, o = n.immediate || !!r.immediate;
  n = N_(() => ({
    pause: i,
    immediate: o
  }), [i, o]);
  const {
    Provider: a
  } = cu;
  return /* @__PURE__ */ j(a, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: D_,
    lineNumber: 1849,
    columnNumber: 10
  }, globalThis);
}, cu = aR(Hu, {});
Hu.Provider = cu.Provider;
Hu.Consumer = cu.Consumer;
function aR(e, t) {
  return Object.assign(e, $n.createContext(t)), e.Provider._context = e, e.Consumer._context = e, e;
}
const uR = () => {
  const e = [], t = function(i) {
    P_();
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
function sR(e, t, n) {
  const r = de.fun(t) && t;
  r && !n && (n = []);
  const i = Ht(() => r || arguments.length == 3 ? uR() : void 0, []), o = tn(0), a = Gg(), u = Ht(() => ({
    ctrls: [],
    queue: [],
    flush(k, $) {
      const N = Ah(k, $);
      return o.current > 0 && !u.queue.length && !Object.keys(N).some((M) => !k.springs[M]) ? Vl(k, $) : new Promise((M) => {
        em(k, N), u.queue.push(() => {
          M(Vl(k, $));
        }), a();
      });
    }
  }), []), f = tn([...u.ctrls]), c = [], p = mh(e) || 0;
  Ht(() => {
    bt(f.current.slice(e, p), (k) => {
      W_(k, i), k.stop(!0);
    }), f.current.length = e, h(p, e);
  }, [e]), Ht(() => {
    h(0, Math.min(p, e));
  }, n);
  function h(k, $) {
    for (let N = k; N < $; N++) {
      const L = f.current[N] || (f.current[N] = new rR(null, u.flush)), M = r ? r(N, L) : t[N];
      M && (c[N] = J_(M));
    }
  }
  const w = f.current.map((k, $) => Ah(k, c[$])), P = an(Hu), _ = mh(P), T = P !== _ && H_(P);
  ef(() => {
    o.current++, u.ctrls = f.current;
    const {
      queue: k
    } = u;
    k.length && (u.queue = [], bt(k, ($) => $())), bt(f.current, ($, N) => {
      i == null || i.add($), T && $.start({
        default: P
      });
      const L = c[N];
      L && (U_($, L.ref), $.ref ? $.queue.push(L) : $.start(L));
    });
  }), Hg(() => () => {
    bt(u.ctrls, (k) => k.stop(!0));
  });
  const B = w.map((k) => Ut({}, k));
  return i ? [B, i] : B;
}
function kh(e, t) {
  const n = de.fun(e), [[r], i] = sR(1, n ? e : [e], n ? t || [] : t);
  return n || arguments.length == 2 ? [r, i] : r;
}
let Ih;
(function(e) {
  e.MOUNT = "mount", e.ENTER = "enter", e.UPDATE = "update", e.LEAVE = "leave";
})(Ih || (Ih = {}));
class lR extends af {
  constructor(t, n) {
    super(), this.key = void 0, this.idle = !0, this.calc = void 0, this._active = /* @__PURE__ */ new Set(), this.source = t, this.calc = zo(...n);
    const r = this._get(), i = zl(r);
    tf(this, i.create(r));
  }
  advance(t) {
    const n = this._get(), r = this.get();
    sr(n, r) || (Kn(this).setValue(n), this._onChange(n, this.idle)), !this.idle && $h(this._active) && Js(this);
  }
  _get() {
    const t = de.arr(this.source) ? this.source.map(cn) : vn(cn(this.source));
    return this.calc(...t);
  }
  _start() {
    this.idle && !$h(this._active) && (this.idle = !1, bt(ju(this), (t) => {
      t.done = !1;
    }), nr.skipAnimation ? (at.batchedUpdates(() => this.advance()), Js(this)) : Fu.start(this));
  }
  _attach() {
    let t = 1;
    bt(vn(this.source), (n) => {
      Cn(n) && Hi(n, this), Hl(n) && (n.idle || this._active.add(n), t = Math.max(t, n.priority + 1));
    }), this.priority = t, this._start();
  }
  _detach() {
    bt(vn(this.source), (t) => {
      Cn(t) && jo(t, this);
    }), this._active.clear(), Js(this);
  }
  eventObserved(t) {
    t.type == "change" ? t.idle ? this.advance() : (this._active.add(t.parent), this._start()) : t.type == "idle" ? this._active.delete(t.parent) : t.type == "priority" && (this.priority = vn(this.source).reduce((n, r) => Math.max(n, (Hl(r) ? r.priority : 0) + 1), 0));
  }
}
function cR(e) {
  return e.idle !== !1;
}
function $h(e) {
  return !e.size || Array.from(e).every(cR);
}
function Js(e) {
  e.idle || (e.idle = !0, bt(ju(e), (t) => {
    t.done = !0;
  }), Lo(e, {
    type: "idle",
    parent: e
  }));
}
nr.assign({
  createStringInterpolator: Lg,
  to: (e, t) => new lR(e, t)
});
function uf(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const fR = ["style", "children", "scrollTop", "scrollLeft"], im = /^--/;
function dR(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !im.test(e) && !(Oo.hasOwnProperty(e) && Oo[e]) ? t + "px" : ("" + t).trim();
}
const Bh = {};
function hR(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", r = t, {
    style: i,
    children: o,
    scrollTop: a,
    scrollLeft: u
  } = r, f = uf(r, fR), c = Object.values(f), p = Object.keys(f).map((h) => n || e.hasAttribute(h) ? h : Bh[h] || (Bh[h] = h.replace(/([A-Z])/g, (w) => "-" + w.toLowerCase())));
  o !== void 0 && (e.textContent = o);
  for (let h in i)
    if (i.hasOwnProperty(h)) {
      const w = dR(h, i[h]);
      im.test(h) ? e.style.setProperty(h, w) : e.style[h] = w;
    }
  p.forEach((h, w) => {
    e.setAttribute(h, c[w]);
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
const pR = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), vR = ["Webkit", "Ms", "Moz", "O"];
Oo = Object.keys(Oo).reduce((e, t) => (vR.forEach((n) => e[pR(n, t)] = e[t]), e), Oo);
const gR = ["x", "y", "z"], mR = /^(matrix|translate|scale|rotate|skew)/, yR = /^(translate)/, bR = /^(rotate|skew)/, el = (e, t) => de.num(e) && e !== 0 ? e + t : e, qa = (e, t) => de.arr(e) ? e.every((n) => qa(n, t)) : de.num(e) ? e === t : parseFloat(e) === t;
class wR extends Gu {
  constructor(t) {
    let {
      x: n,
      y: r,
      z: i
    } = t, o = uf(t, gR);
    const a = [], u = [];
    (n || r || i) && (a.push([n || 0, r || 0, i || 0]), u.push((f) => [`translate3d(${f.map((c) => el(c, "px")).join(",")})`, qa(f, 0)])), tr(o, (f, c) => {
      if (c === "transform")
        a.push([f || ""]), u.push((p) => [p, p === ""]);
      else if (mR.test(c)) {
        if (delete o[c], de.und(f))
          return;
        const p = yR.test(c) ? "px" : bR.test(c) ? "deg" : "";
        a.push(vn(f)), u.push(c === "rotate3d" ? ([h, w, P, _]) => [`rotate3d(${h},${w},${P},${el(_, p)})`, qa(_, 0)] : (h) => [`${c}(${h.map((w) => el(w, p)).join(",")})`, qa(h, c.startsWith("scale") ? 1 : 0)]);
      }
    }), a.length && (o.transform = new xR(a, u)), super(o);
  }
}
class xR extends Fg {
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
    t == 1 && bt(this.inputs, (n) => bt(n, (r) => Cn(r) && Hi(r, this)));
  }
  observerRemoved(t) {
    t == 0 && bt(this.inputs, (n) => bt(n, (r) => Cn(r) && jo(r, this)));
  }
  eventObserved(t) {
    t.type == "change" && (this._value = null), Lo(this, t);
  }
}
const _R = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"], RR = ["scrollTop", "scrollLeft"];
nr.assign({
  batchedUpdates: Om,
  createStringInterpolator: Lg,
  colors: o_
});
const SR = F_(_R, {
  applyAnimatedValues: hR,
  createAnimatedStyle: (e) => new wR(e),
  getComponentProps: (e) => uf(e, RR)
}), CR = SR.animated;
var PR = ["tooltipOpen"];
function TR(e, t) {
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
function NR(e) {
  var t = pr(fu({
    tooltipOpen: !1
  }, e)), n = t[0], r = t[1], i = wt(function(a) {
    return r(typeof a == "function" ? function(u) {
      u.tooltipOpen;
      var f = TR(u, PR);
      return fu({}, a(f), {
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
function ER(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function MR(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ql(e, t);
}
function ql(e, t) {
  return ql = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, ql(e, t);
}
function om(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var am = /* @__PURE__ */ function(e) {
  MR(t, e);
  function t() {
    for (var r, i = arguments.length, o = new Array(i), a = 0; a < i; a++)
      o[a] = arguments[a];
    return r = e.call.apply(e, [this].concat(o)) || this, om(ER(r), "node", void 0), r;
  }
  var n = t.prototype;
  return n.componentWillUnmount = function() {
    this.node && document.body && (document.body.removeChild(this.node), delete this.node);
  }, n.render = function() {
    return !this.node && typeof document < "u" && (this.node = document.createElement("div"), this.props.zIndex != null && (this.node.style.zIndex = "" + this.props.zIndex), document.body.append(this.node)), this.node ? /* @__PURE__ */ sp.createPortal(this.props.children, this.node) : null;
  }, t;
}(Dn.PureComponent);
om(am, "propTypes", {
  zIndex: ke.exports.oneOfType([ke.exports.number, ke.exports.string])
});
var OR = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/Tooltip.js", AR = ["className", "top", "left", "offsetLeft", "offsetTop", "style", "children", "unstyled", "applyPositionStyle"];
function Yl() {
  return Yl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Yl.apply(this, arguments);
}
function kR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var sf = {
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
function lf(e) {
  var t = e.className, n = e.top, r = e.left, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.style, c = f === void 0 ? sf : f, p = e.children, h = e.unstyled, w = h === void 0 ? !1 : h, P = e.applyPositionStyle, _ = P === void 0 ? !1 : P, T = kR(e, AR);
  return /* @__PURE__ */ j("div", {
    className: ly("visx-tooltip", t),
    style: Yl({
      top: n == null || u == null ? n : n + u,
      left: r == null || o == null ? r : r + o
    }, _ && {
      position: "absolute"
    }, !w && c),
    ...T,
    children: p
  }, void 0, !1, {
    fileName: OR,
    lineNumber: 38,
    columnNumber: 23
  }, this);
}
lf.propTypes = {
  children: ke.exports.node,
  className: ke.exports.string,
  left: ke.exports.number,
  offsetLeft: ke.exports.number,
  offsetTop: ke.exports.number,
  top: ke.exports.number,
  applyPositionStyle: ke.exports.bool,
  unstyled: ke.exports.bool
};
var IR = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js";
function Fh(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function $R(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Xl(e, t);
}
function Xl(e, t) {
  return Xl = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Xl(e, t);
}
function Dh(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var zh = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function BR(e) {
  var t, n;
  return n = t = /* @__PURE__ */ function(r) {
    $R(i, r);
    function i(a) {
      var u;
      return u = r.call(this, a) || this, Dh(Fh(u), "node", void 0), u.state = {
        rect: void 0,
        parentRect: void 0
      }, u.getRects = u.getRects.bind(Fh(u)), u;
    }
    var o = i.prototype;
    return o.componentDidMount = function() {
      var u = this;
      this.node = sp.findDOMNode(this), this.setState(function() {
        return u.getRects();
      });
    }, o.getRects = function() {
      if (!this.node)
        return this.state;
      var u = this.node, f = u.parentNode, c = u.getBoundingClientRect ? u.getBoundingClientRect() : zh, p = f != null && f.getBoundingClientRect ? f.getBoundingClientRect() : zh;
      return {
        rect: c,
        parentRect: p
      };
    }, o.render = function() {
      return /* @__PURE__ */ j(e, {
        getRects: this.getRects,
        ...this.state,
        ...this.props
      }, void 0, !1, {
        fileName: IR,
        lineNumber: 67,
        columnNumber: 27
      }, this);
    }, i;
  }(Dn.PureComponent), Dh(t, "displayName", "withBoundingRects(" + (e.displayName || "") + ")"), n;
}
var FR = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js", DR = ["children", "getRects", "left", "offsetLeft", "offsetTop", "parentRect", "rect", "style", "top", "unstyled"];
function Kl() {
  return Kl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Kl.apply(this, arguments);
}
function zR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function LR(e) {
  var t = e.children;
  e.getRects;
  var n = e.left, r = n === void 0 ? 0 : n, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.parentRect, c = e.rect, p = e.style, h = p === void 0 ? sf : p, w = e.top, P = w === void 0 ? 0 : w, _ = e.unstyled, T = _ === void 0 ? !1 : _, B = zR(e, DR), k;
  if (c && f) {
    var $ = r, N = P, L = !1, M = !1;
    if (f.width) {
      var D = $ + o + c.width - f.width, te = c.width - $ - o;
      L = D > 0 && D > te;
    } else {
      var Q = $ + o + c.width - window.innerWidth, fe = c.width - $ - o;
      L = Q > 0 && Q > fe;
    }
    if (f.height) {
      var ge = N + u + c.height - f.height, re = c.height - N - u;
      M = ge > 0 && ge > re;
    } else
      M = N + u + c.height > window.innerHeight;
    $ = L ? $ - c.width - o : $ + o, N = M ? N - c.height - u : N + u, $ = Math.round($), N = Math.round(N), k = "translate(" + $ + "px, " + N + "px)";
  }
  return /* @__PURE__ */ j(lf, {
    style: Kl({
      left: 0,
      top: 0,
      transform: k
    }, !T && h),
    ...B,
    children: t
  }, void 0, !1, {
    fileName: FR,
    lineNumber: 65,
    columnNumber: 23
  }, this);
}
const jR = BR(LR);
var Lh = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js", GR = ["detectBounds", "zIndex"], HR = ["left", "top", "detectBounds", "zIndex"];
function jh(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function WR(e) {
  var t = e === void 0 ? {} : e, n = t.detectBounds, r = n === void 0 ? !0 : n, i = t.zIndex, o = jh(t, GR), a = cy(o), u = a[0], f = a[1], c = a[2], p = Ht(function() {
    return function(h) {
      var w = h.left, P = w === void 0 ? 0 : w, _ = h.top, T = _ === void 0 ? 0 : _, B = h.detectBounds, k = h.zIndex, $ = jh(h, HR), N = B == null ? r : B, L = k == null ? i : k, M = N ? jR : lf, D = P + (f.left || 0) + window.scrollX, te = T + (f.top || 0) + window.scrollY;
      return /* @__PURE__ */ j(am, {
        zIndex: L,
        children: /* @__PURE__ */ j(M, {
          left: D,
          top: te,
          ...$
        }, void 0, !1, {
          fileName: Lh,
          lineNumber: 48,
          columnNumber: 23
        }, this)
      }, void 0, !1, {
        fileName: Lh,
        lineNumber: 46,
        columnNumber: 27
      }, this);
    };
  }, [r, i, f.left, f.top]);
  return {
    containerRef: u,
    containerBounds: f,
    forceRefreshBounds: c,
    TooltipInPortal: p
  };
}
var UR = /* @__PURE__ */ up(null);
const ea = UR;
var pn = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/Tooltip.js", VR = ["debounce", "detectBounds", "horizontalCrosshairStyle", "glyphStyle", "renderTooltip", "renderGlyph", "resizeObserverPolyfill", "scroll", "showDatumGlyph", "showHorizontalCrosshair", "showSeriesGlyphs", "showVerticalCrosshair", "snapTooltipToDatumX", "snapTooltipToDatumY", "verticalCrosshairStyle", "zIndex"], qR = ["x", "y"];
function Gh(e, t) {
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
}, YR = {
  position: "absolute",
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none"
};
function um(e) {
  var t = an(Gr) || {}, n = t.theme;
  return /* @__PURE__ */ j("circle", {
    cx: e.x,
    cy: e.y,
    r: e.size,
    fill: e.color,
    stroke: n == null ? void 0 : n.backgroundColor,
    strokeWidth: 1.5,
    paintOrder: "fill",
    ...e.glyphStyle
  }, void 0, !1, {
    fileName: pn,
    lineNumber: 37,
    columnNumber: 23
  }, this);
}
um.propTypes = {
  isNearestDatum: ke.exports.bool.isRequired
};
function XR(e) {
  return /* @__PURE__ */ j(um, {
    ...e
  }, void 0, !1, {
    fileName: pn,
    lineNumber: 53,
    columnNumber: 23
  }, this);
}
function sm(e) {
  var t = an(ea);
  return t != null && t.tooltipOpen ? /* @__PURE__ */ j(lm, {
    ...e
  }, void 0, !1, {
    fileName: pn,
    lineNumber: 66,
    columnNumber: 23
  }, this) : null;
}
sm.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
function lm(e) {
  var t, n, r, i, o, a, u, f, c, p, h, w, P, _ = e.debounce, T = e.detectBounds, B = e.horizontalCrosshairStyle, k = e.glyphStyle, $ = e.renderTooltip, N = e.renderGlyph, L = N === void 0 ? XR : N, M = e.resizeObserverPolyfill, D = e.scroll, te = D === void 0 ? !0 : D, Q = e.showDatumGlyph, fe = Q === void 0 ? !1 : Q, ge = e.showHorizontalCrosshair, re = ge === void 0 ? !1 : ge, ee = e.showSeriesGlyphs, be = ee === void 0 ? !1 : ee, Oe = e.showVerticalCrosshair, ut = Oe === void 0 ? !1 : Oe, Ue = e.snapTooltipToDatumX, st = Ue === void 0 ? !1 : Ue, lt = e.snapTooltipToDatumY, dt = lt === void 0 ? !1 : lt, V = e.verticalCrosshairStyle, ue = e.zIndex, Te = Gh(e, VR), Ae = an(Gr) || {}, Ce = Ae.colorScale, Se = Ae.theme, Ne = Ae.innerHeight, Fe = Ae.innerWidth, Le = Ae.margin, X = Ae.xScale, ce = Ae.yScale, je = Ae.dataRegistry, F = an(ea), gt = WR({
    debounce: _,
    detectBounds: T,
    polyfill: M,
    scroll: te,
    zIndex: ue
  }), ct = gt.containerRef, _t = gt.TooltipInPortal, Ot = gt.forceRefreshBounds, Qt = wt(function(Lt) {
    var Yt;
    ct((Yt = Lt == null ? void 0 : Lt.parentElement) != null ? Yt : null);
  }, [ct]), un = F != null && F.tooltipOpen ? $(Ao({}, F, {
    colorScale: Ce
  })) : null, mn = (F == null ? void 0 : F.tooltipOpen) && un != null, yn = tn(!1);
  on(function() {
    mn && !yn.current && Ot(), yn.current = mn;
  }, [mn, Ot]);
  var bn = F == null ? void 0 : F.tooltipLeft, zn = F == null ? void 0 : F.tooltipTop, rr = X ? Il(X) : 0, Ln = ce ? Il(ce) : 0, wn = wt(function(Lt, Yt) {
    var O, J, pe = je == null ? void 0 : je.get(Lt), ze = pe == null ? void 0 : pe.xAccessor, ht = pe == null ? void 0 : pe.yAccessor, mt = X && ze ? (O = Number(X(ze(Yt))) + rr / 2) != null ? O : 0 : void 0, ot = ce && ht ? (J = Number(ce(ht(Yt))) + Ln / 2) != null ? J : 0 : void 0;
    return {
      left: mt,
      top: ot
    };
  }, [je, rr, Ln, X, ce]), qt = F == null || (t = F.tooltipData) == null ? void 0 : t.nearestDatum, En = (n = qt == null ? void 0 : qt.key) != null ? n : "";
  if (mn && qt && (st || dt)) {
    var ir = wn(En, qt.datum), mr = ir.left, yr = ir.top;
    bn = st && en(mr) ? mr : bn, zn = dt && en(yr) ? yr : zn;
  }
  var or = [];
  if (mn && (fe || be)) {
    var br, jn = Number((br = k == null ? void 0 : k.radius) != null ? br : 4);
    if (be) {
      var Gn, sn;
      Object.values((Gn = F == null || (sn = F.tooltipData) == null ? void 0 : sn.datumByKey) != null ? Gn : {}).forEach(function(Lt) {
        var Yt, O, J, pe = Lt.key, ze = Lt.datum, ht = Lt.index, mt = (Yt = (O = Ce == null ? void 0 : Ce(pe)) != null ? O : Se == null || (J = Se.htmlLabel) == null ? void 0 : J.color) != null ? Yt : "#222", ot = wn(pe, ze), rt = ot.left, At = ot.top;
        !en(rt) || !en(At) || or.push({
          key: pe,
          color: mt,
          datum: ze,
          index: ht,
          size: jn,
          x: rt,
          y: At,
          glyphStyle: k,
          isNearestDatum: qt ? qt.key === pe : !1
        });
      });
    } else if (qt) {
      var xn = wn(En, qt.datum), Mn = xn.left, On = xn.top;
      if (en(Mn) && en(On)) {
        var ar, An, ur, Hn, Wn, _n, wr = (ar = (An = (ur = (Hn = En && (Ce == null ? void 0 : Ce(En))) != null ? Hn : null) != null ? ur : Se == null || (Wn = Se.gridStyles) == null ? void 0 : Wn.stroke) != null ? An : Se == null || (_n = Se.htmlLabel) == null ? void 0 : _n.color) != null ? ar : "#222";
        or.push({
          key: En,
          color: wr,
          datum: qt.datum,
          index: qt.index,
          size: jn,
          x: Mn,
          y: On,
          glyphStyle: k,
          isNearestDatum: !0
        });
      }
    }
  }
  return /* @__PURE__ */ j(Fn, {
    children: [/* @__PURE__ */ j("svg", {
      ref: Qt,
      style: YR
    }, void 0, !1, {
      fileName: pn,
      lineNumber: 250,
      columnNumber: 60
    }, this), mn && /* @__PURE__ */ j(Fn, {
      children: [ut && /* @__PURE__ */ j(_t, {
        className: "visx-crosshair visx-crosshair-vertical",
        left: bn,
        top: Le == null ? void 0 : Le.top,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: tl,
        children: /* @__PURE__ */ j("svg", {
          width: "1",
          height: Ne,
          overflow: "visible",
          children: /* @__PURE__ */ j("line", {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: Ne,
            strokeWidth: 1.5,
            stroke: (r = (i = Se == null || (o = Se.gridStyles) == null ? void 0 : o.stroke) != null ? i : Se == null || (a = Se.htmlLabel) == null ? void 0 : a.color) != null ? r : "#222",
            ...V
          }, void 0, !1, {
            fileName: pn,
            lineNumber: 265,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: pn,
          lineNumber: 261,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: pn,
        lineNumber: 253,
        columnNumber: 117
      }, this), re && /* @__PURE__ */ j(_t, {
        className: "visx-crosshair visx-crosshair-horizontal",
        left: Le == null ? void 0 : Le.left,
        top: zn,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: tl,
        children: /* @__PURE__ */ j("svg", {
          width: Fe,
          height: "1",
          overflow: "visible",
          children: /* @__PURE__ */ j("line", {
            x1: 0,
            x2: Fe,
            y1: 0,
            y2: 0,
            strokeWidth: 1.5,
            stroke: (u = (f = Se == null || (c = Se.gridStyles) == null ? void 0 : c.stroke) != null ? f : Se == null || (p = Se.htmlLabel) == null ? void 0 : p.color) != null ? u : "#222",
            ...B
          }, void 0, !1, {
            fileName: pn,
            lineNumber: 284,
            columnNumber: 21
          }, this)
        }, void 0, !1, {
          fileName: pn,
          lineNumber: 280,
          columnNumber: 21
        }, this)
      }, void 0, !1, {
        fileName: pn,
        lineNumber: 272,
        columnNumber: 76
      }, this), or.map(function(Lt, Yt) {
        var O = Lt.x, J = Lt.y, pe = Gh(Lt, qR);
        return /* @__PURE__ */ j(_t, {
          className: "visx-tooltip-glyph",
          left: O,
          top: J,
          offsetLeft: 0,
          offsetTop: 0,
          detectBounds: !1,
          style: tl,
          children: /* @__PURE__ */ j("svg", {
            overflow: "visible",
            children: L(Ao({
              x: 0,
              y: 0
            }, pe))
          }, void 0, !1, {
            fileName: pn,
            lineNumber: 308,
            columnNumber: 25
          }, this)
        }, Yt, !1, {
          fileName: pn,
          lineNumber: 299,
          columnNumber: 9
        }, this);
      }), /* @__PURE__ */ j(_t, {
        left: bn,
        top: zn,
        style: Ao({}, sf, {
          background: (h = Se == null ? void 0 : Se.backgroundColor) != null ? h : "white",
          boxShadow: "0 1px 2px " + (Se != null && (w = Se.htmlLabel) != null && w.color ? (Se == null || (P = Se.htmlLabel) == null ? void 0 : P.color) + "55" : "#22222255")
        }, Se == null ? void 0 : Se.htmlLabel),
        ...Te,
        children: un
      }, void 0, !1, {
        fileName: pn,
        lineNumber: 315,
        columnNumber: 22
      }, this)]
    }, void 0, !0)]
  }, void 0, !0);
}
lm.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
const KR = /* @__PURE__ */ Vo(iy);
var QR = dm, Pr = fm(ke.exports), ZR = fm(vp), yi = tS(Dn), JR = KR, eS = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function cm(e) {
  if (typeof WeakMap != "function")
    return null;
  var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (cm = function(i) {
    return i ? n : t;
  })(e);
}
function tS(e, t) {
  if (!t && e && e.__esModule)
    return e;
  if (e === null || typeof e != "object" && typeof e != "function")
    return { default: e };
  var n = cm(t);
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
function fm(e) {
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
function nS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var rS = [];
function dm(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? rS : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, p = c === void 0 ? !0 : c, h = nS(e, eS), w = (0, yi.useRef)(null), P = (0, yi.useRef)(0), _ = (0, yi.useState)({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), T = _[0], B = _[1], k = (0, yi.useMemo)(function() {
    var $ = Array.isArray(a) ? a : [a];
    return (0, ZR.default)(function(N) {
      B(function(L) {
        var M = Object.keys(L), D = M.filter(function(Q) {
          return L[Q] !== N[Q];
        }), te = D.every(function(Q) {
          return $.includes(Q);
        });
        return te ? L : N;
      });
    }, i, {
      leading: p
    });
  }, [i, p, a]);
  return (0, yi.useEffect)(function() {
    var $ = new JR.ResizeObserver(function(N) {
      N === void 0 && (N = []), N.forEach(function(L) {
        var M = L.contentRect, D = M.left, te = M.top, Q = M.width, fe = M.height;
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
    return w.current && $.observe(w.current), function() {
      window.cancelAnimationFrame(P.current), $.disconnect(), k != null && k.cancel && k.cancel();
    };
  }, [k]), /* @__PURE__ */ yi.default.createElement("div", du({
    style: f,
    ref: w,
    className: t
  }, h), n(du({}, T, {
    ref: w.current,
    resize: k
  })));
}
dm.propTypes = {
  className: Pr.default.string,
  debounceTime: Pr.default.number,
  enableDebounceLeadingCall: Pr.default.bool,
  ignoreDimensions: Pr.default.oneOfType([Pr.default.any, Pr.default.arrayOf(Pr.default.any)]),
  children: Pr.default.func.isRequired
};
var iS = /* @__PURE__ */ up(null);
const hm = iS;
function Or(e, t, n) {
  var r = an(hm), i = tn();
  i.current = n;
  var o = wt(function(a, u, f) {
    r && r.emit(a, {
      event: u,
      svgPoint: Ry(u),
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
function oS(e) {
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
var aS = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/EventEmitterProvider.js";
function uS(e) {
  var t = e.children, n = Ht(function() {
    return oS();
  }, []);
  return /* @__PURE__ */ j(hm.Provider, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: aS,
    lineNumber: 11,
    columnNumber: 23
  }, this);
}
var sS = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/TooltipProvider.js";
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
function pm(e) {
  var t = e.hideTooltipDebounceMs, n = t === void 0 ? 400 : t, r = e.children, i = NR(void 0), o = i.tooltipOpen, a = i.tooltipLeft, u = i.tooltipTop, f = i.tooltipData, c = i.updateTooltip, p = i.hideTooltip, h = tn(null), w = tn(function(_) {
    var T = _.svgPoint, B = _.index, k = _.key, $ = _.datum, N = _.distanceX, L = _.distanceY;
    h.current && (h.current.cancel(), h.current = null);
    var M = en(N) ? N : 1 / 0, D = en(L) ? L : 1 / 0, te = Math.sqrt(Math.pow(M, 2) + Math.pow(D, 2));
    c(function(Q) {
      var fe, ge, re, ee = Q.tooltipData, be = ee != null && ee.nearestDatum && en(ee.nearestDatum.distance) ? ee.nearestDatum.distance : 1 / 0;
      return {
        tooltipOpen: !0,
        tooltipLeft: T == null ? void 0 : T.x,
        tooltipTop: T == null ? void 0 : T.y,
        tooltipData: {
          nearestDatum: ((fe = ee == null || (ge = ee.nearestDatum) == null ? void 0 : ge.key) != null ? fe : "") !== k && be < te ? ee == null ? void 0 : ee.nearestDatum : {
            key: k,
            index: B,
            datum: $,
            distance: te
          },
          datumByKey: Ql({}, ee == null ? void 0 : ee.datumByKey, (re = {}, re[k] = {
            datum: $,
            index: B,
            key: k
          }, re))
        }
      };
    });
  }), P = wt(function() {
    h.current = fc(p, n), h.current();
  }, [p, n]);
  return /* @__PURE__ */ j(ea.Provider, {
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
    fileName: sS,
    lineNumber: 72,
    columnNumber: 23
  }, this);
}
pm.propTypes = {
  hideTooltipDebounceMs: ke.exports.number,
  children: ke.exports.node.isRequired
};
const lS = /* @__PURE__ */ Vo(ox);
var ta = {}, cf = {};
cf.__esModule = !0;
cf.default = cS;
function cS(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
var ff = {};
ff.__esModule = !0;
ff.default = fS;
function fS(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
var df = {};
df.__esModule = !0;
df.default = dS;
function dS(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
var hf = {};
hf.__esModule = !0;
hf.default = hS;
function hS(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
var pf = {};
pf.__esModule = !0;
pf.default = pS;
function pS(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
var vf = {};
vf.__esModule = !0;
vf.default = vS;
function vS(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
var gf = {};
gf.__esModule = !0;
gf.default = gS;
function gS(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var mf = {}, yf = {};
const vm = /* @__PURE__ */ Vo(u1);
yf.__esModule = !0;
yf.default = mS;
var Tr = vm, Hh = {
  lab: Tr.interpolateLab,
  hcl: Tr.interpolateHcl,
  "hcl-long": Tr.interpolateHclLong,
  hsl: Tr.interpolateHsl,
  "hsl-long": Tr.interpolateHslLong,
  cubehelix: Tr.interpolateCubehelix,
  "cubehelix-long": Tr.interpolateCubehelixLong,
  rgb: Tr.interpolateRgb
};
function mS(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return Hh[e];
  }
  var t = e.type, n = e.gamma, r = Hh[t];
  return typeof n > "u" ? r : r.gamma(n);
}
mf.__esModule = !0;
mf.default = wS;
var yS = bS(yf);
function bS(e) {
  return e && e.__esModule ? e : { default: e };
}
function wS(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = (0, yS.default)(t.interpolate);
    e.interpolate(n);
  }
}
var bf = {};
const xS = /* @__PURE__ */ Vo(J1);
var wf = {};
wf.__esModule = !0;
wf.default = SS;
var _S = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), RS = "%Y-%m-%d %H:%M";
function SS(e) {
  var t = e.tickFormat(1, RS)(_S);
  return t === "2020-02-02 03:04";
}
bf.__esModule = !0;
bf.default = TS;
var fn = xS, CS = PS(wf);
function PS(e) {
  return e && e.__esModule ? e : { default: e };
}
var Wh = {
  day: fn.timeDay,
  hour: fn.timeHour,
  minute: fn.timeMinute,
  month: fn.timeMonth,
  second: fn.timeSecond,
  week: fn.timeWeek,
  year: fn.timeYear
}, Uh = {
  day: fn.utcDay,
  hour: fn.utcHour,
  minute: fn.utcMinute,
  month: fn.utcMonth,
  second: fn.utcSecond,
  week: fn.utcWeek,
  year: fn.utcYear
};
function TS(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = (0, CS.default)(r);
      if (typeof n == "string")
        r.nice(i ? Uh[n] : Wh[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? Uh[o] : Wh[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
var xf = {};
xf.__esModule = !0;
xf.default = NS;
function NS(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
var _f = {};
_f.__esModule = !0;
_f.default = ES;
function ES(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
var Rf = {};
Rf.__esModule = !0;
Rf.default = OS;
var MS = vm;
function OS(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(MS.interpolateRound));
}
var Sf = {};
Sf.__esModule = !0;
Sf.default = AS;
function AS(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
var Cf = {};
Cf.__esModule = !0;
Cf.default = kS;
function kS(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
ta.__esModule = !0;
ta.default = XS;
ta.ALL_OPERATORS = void 0;
var IS = dn(cf), $S = dn(ff), BS = dn(df), FS = dn(hf), DS = dn(pf), zS = dn(vf), LS = dn(gf), jS = dn(mf), GS = dn(bf), HS = dn(xf), WS = dn(_f), US = dn(Rf), VS = dn(Sf), qS = dn(Cf);
function dn(e) {
  return e && e.__esModule ? e : { default: e };
}
var gm = [
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
ta.ALL_OPERATORS = gm;
var YS = {
  domain: IS.default,
  nice: GS.default,
  zero: qS.default,
  interpolate: jS.default,
  round: US.default,
  align: BS.default,
  base: FS.default,
  clamp: DS.default,
  constant: zS.default,
  exponent: LS.default,
  padding: HS.default,
  range: $S.default,
  reverse: WS.default,
  unknown: VS.default
};
function XS() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = gm.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      YS[f](a, u);
    }), a;
  };
}
var KS = tC, QS = lS, ZS = JS(ta);
function JS(e) {
  return e && e.__esModule ? e : { default: e };
}
var eC = (0, ZS.default)("domain", "range", "reverse", "unknown");
function tC(e) {
  return eC((0, QS.scaleOrdinal)(), e);
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
}, So = Mr.gray, nl = So[7], nC = [Mr.cyan[9], Mr.cyan[3], Mr.yellow[5], Mr.red[4], Mr.grape[8], Mr.grape[5], Mr.pink[9]];
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
var rl = {
  fontFamily: "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
  fontWeight: 700,
  fontSize: 12,
  textAnchor: "middle",
  pointerEvents: "none",
  letterSpacing: 0.4
};
function rC(e) {
  var t, n, r, i, o, a, u = Mt({}, rl, {
    fill: nl,
    stroke: "none"
  }, e.svgLabelBig), f = Mt({}, rl, {
    fontWeight: 200,
    fontSize: 11,
    fill: nl,
    stroke: "none"
  }, e.svgLabelSmall), c = Mt({
    color: (t = (n = (r = (i = e.htmlLabel) == null ? void 0 : i.color) != null ? r : (o = e.svgLabelBig) == null ? void 0 : o.fill) != null ? n : (a = e.svgLabelSmall) == null ? void 0 : a.fill) != null ? t : nl
  }, rl, e.htmlLabel);
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
const iC = rC({
  backgroundColor: "#fff",
  colors: nC,
  tickLength: 4,
  svgLabelSmall: {
    fill: So[7]
  },
  svgLabelBig: {
    fill: So[9]
  },
  gridColor: So[5],
  gridColorDark: So[9]
});
var oC = /* @__PURE__ */ Dn.createContext(iC);
const aC = oC;
function Vh(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var uC = /* @__PURE__ */ function() {
  function e() {
    Vh(this, "registry", {}), Vh(this, "registryKeys", []);
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
function sC() {
  var e = pr(Math.random()), t = e[1], n = Ht(function() {
    return new uC();
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
function lC(e) {
  var t = pr({
    width: (e == null ? void 0 : e.width) == null ? il.width : e.width,
    height: (e == null ? void 0 : e.height) == null ? il.height : e.height,
    margin: (e == null ? void 0 : e.margin) == null ? il.margin : e.margin
  }), n = t[0], r = t[1], i = wt(function(o) {
    (o.width !== n.width || o.height !== n.height || o.margin.left !== n.margin.left || o.margin.right !== n.margin.right || o.margin.top !== n.margin.top || o.margin.bottom !== n.margin.bottom) && r(o);
  }, [n.width, n.height, n.margin.left, n.margin.right, n.margin.bottom, n.margin.top]);
  return [n, i];
}
function Zl(e) {
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
function cC(e) {
  var t = e.dataRegistry, n = e.xRange, r = e.xScaleConfig, i = e.yRange, o = e.yScaleConfig, a = t.keys(), u = n[0], f = n[1], c = i[0], p = i[1], h = Ht(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, $) {
      return $ ? k.concat($.data.map(function(N) {
        return $.xAccessor(N);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var T = Zl(r) ? _ : vd(_), B = ch(r) ? $a(Ri({
        range: [u, f],
        domain: T,
        zero: !0
      }, r)) : $a(Ri({
        range: [u, f],
        domain: T
      }, r));
      return P.forEach(function(k) {
        k != null && k.xScale && (B = k.xScale(B));
      }), B;
    }
  }, [t, r, a, u, f]), w = Ht(function() {
    var P = a.map(function(k) {
      return t.get(k);
    }), _ = P.reduce(function(k, $) {
      return $ ? k.concat($.data.map(function(N) {
        return $.yAccessor(N);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var T = Zl(o) ? _ : vd(_), B = ch(o) ? $a(Ri({
        range: [c, p],
        domain: T,
        zero: !0
      }, o)) : $a(Ri({
        range: [c, p],
        domain: T
      }, o));
      return P.forEach(function(k) {
        k != null && k.yScale && (B = k.yScale(B));
      }), B;
    }
  }, [t, o, a, c, p]);
  return {
    xScale: h,
    yScale: w
  };
}
var fC = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/DataProvider.js";
function mm(e) {
  var t = e.initialDimensions, n = e.theme, r = e.xScale, i = e.yScale, o = e.children, a = e.horizontal, u = a === void 0 ? "auto" : a, f = an(aC), c = n || f, p = lC(t), h = p[0], w = h.width, P = h.height, _ = h.margin, T = p[1], B = Math.max(0, w - _.left - _.right), k = Math.max(0, P - _.top - _.bottom), $ = sC(), N = cC({
    dataRegistry: $,
    xScaleConfig: r,
    yScaleConfig: i,
    xRange: [_.left, Math.max(0, w - _.right)],
    yRange: [Math.max(0, P - _.bottom), _.top]
  }), L = N.xScale, M = N.yScale, D = $.keys(), te = Ht(function() {
    return KS({
      domain: D,
      range: c.colors
    });
  }, [D, c.colors]), Q = u === "auto" ? Zl(i) || i.type === "time" || i.type === "utc" : u;
  return /* @__PURE__ */ j(Gr.Provider, {
    value: {
      dataRegistry: $,
      registerData: $.registerData,
      unregisterData: $.unregisterData,
      xScale: L,
      yScale: M,
      colorScale: te,
      theme: c,
      width: w,
      height: P,
      margin: _,
      innerWidth: B,
      innerHeight: k,
      setDimensions: T,
      horizontal: Q
    },
    children: o
  }, void 0, !1, {
    fileName: fC,
    lineNumber: 55,
    columnNumber: 23
  }, this);
}
mm.propTypes = {
  children: ke.exports.node.isRequired,
  horizontal: ke.exports.oneOfType([ke.exports.bool, ke.exports.oneOf(["auto"])])
};
function ym(e) {
  var t = e.source, n = e.onPointerOut, r = n === void 0 ? !0 : n, i = e.onPointerMove, o = i === void 0 ? !0 : i, a = e.onPointerUp, u = a === void 0 ? !0 : a, f = e.onPointerDown, c = f === void 0 ? !0 : f, p = e.onFocus, h = p === void 0 ? !1 : p, w = e.onBlur, P = w === void 0 ? !1 : w, _ = Or(), T = wt(function(M) {
    return _ == null ? void 0 : _("pointermove", M, t);
  }, [_, t]), B = wt(function(M) {
    return _ == null ? void 0 : _("pointerout", M, t);
  }, [_, t]), k = wt(function(M) {
    return _ == null ? void 0 : _("pointerup", M, t);
  }, [_, t]), $ = wt(function(M) {
    return _ == null ? void 0 : _("pointerdown", M, t);
  }, [_, t]), N = wt(function(M) {
    return _ == null ? void 0 : _("focus", M, t);
  }, [_, t]), L = wt(function(M) {
    return _ == null ? void 0 : _("blur", M, t);
  }, [_, t]);
  return {
    onPointerMove: o ? T : void 0,
    onFocus: h ? N : void 0,
    onBlur: P ? L : void 0,
    onPointerOut: r ? B : void 0,
    onPointerUp: u ? k : void 0,
    onPointerDown: c ? $ : void 0
  };
}
var dC = "AREASERIES_EVENT_SOURCE", hC = "GLYPHSERIES_EVENT_SOURCE", Wu = "XYCHART_EVENT_SOURCE";
function qh(e) {
  return !!e && ("clientX" in e || "changedTouches" in e);
}
function bm(e) {
  var t = e.scale, n = e.accessor, r = e.scaledValue, i = e.data, o = t, a, u;
  if ("invert" in o && typeof o.invert == "function") {
    var f = wu(n).left, c = Number(o.invert(r)), p = f(i, c), h = i[p - 1], w = i[p];
    a = !h || Math.abs(c - n(h)) > Math.abs(c - n(w)) ? w : h, u = a === h ? p - 1 : p;
  } else if ("step" in o && typeof o.step < "u") {
    var P = t.domain(), _ = t.range().map(Number), T = [].concat(_).sort(function(D, te) {
      return D - te;
    }), B = tv(T[0], T[1], o.step()), k = Eb(B, r), $ = _[0] < _[1] ? P : P.reverse(), N = $[k - 1], L = i.findIndex(function(D) {
      return String(n(D)) === String(N);
    });
    a = i[L], u = L;
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
function pC(e) {
  var t = e.xScale, n = e.xAccessor, r = e.yScale, i = e.yAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = bm({
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
function vC(e) {
  var t = e.yScale, n = e.yAccessor, r = e.xScale, i = e.xAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = bm({
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
function Jl() {
  return Jl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Jl.apply(this, arguments);
}
var ec = "__POINTER_EVENTS_ALL", Ya = "__POINTER_EVENTS_NEAREST";
function wm(e) {
  var t = e.dataKey, n = e.findNearestDatum, r = e.onBlur, i = e.onFocus, o = e.onPointerMove, a = e.onPointerOut, u = e.onPointerUp, f = e.onPointerDown, c = e.allowedSources, p = an(Gr), h = p.width, w = p.height, P = p.horizontal, _ = p.dataRegistry, T = p.xScale, B = p.yScale, k = n || (P ? vC : pC), $ = wt(function(fe) {
    var ge = fe || {}, re = ge.svgPoint, ee = ge.event, be = {}, Oe = null, ut = 1 / 0;
    if (fe && ee && re && h && w && T && B) {
      var Ue, st = t === Ya || t === ec, lt = st ? (Ue = _ == null ? void 0 : _.keys()) != null ? Ue : [] : Array.isArray(t) ? t : [t];
      lt.forEach(function(V) {
        var ue = _ == null ? void 0 : _.get(V);
        if (ue) {
          var Te = k({
            dataKey: V,
            data: ue.data,
            height: w,
            point: re,
            width: h,
            xAccessor: ue.xAccessor,
            xScale: T,
            yAccessor: ue.yAccessor,
            yScale: B
          });
          if (Te && (be[V] = Jl({
            key: V,
            svgPoint: re,
            event: ee
          }, Te), t === Ya)) {
            var Ae, Ce, Se = Math.sqrt(((Ae = Te.distanceX) != null ? Ae : Math.pow(1 / 0, 2)) + ((Ce = Te.distanceY) != null ? Ce : Math.pow(1 / 0, 2)));
            Oe = Se < ut ? be[V] : Oe, ut = Math.min(ut, Se);
          }
        }
      });
      var dt = t === Ya ? [Oe] : t === ec || Array.isArray(t) ? Object.values(be) : [be[t]];
      return dt.filter(function(V) {
        return V;
      });
    }
    return [];
  }, [t, _, T, B, h, w, k]), N = wt(function(fe) {
    o && $(fe).forEach(function(ge) {
      return o(ge);
    });
  }, [$, o]), L = wt(function(fe) {
    u && $(fe).forEach(function(ge) {
      return u(ge);
    });
  }, [$, u]), M = wt(function(fe) {
    f && $(fe).forEach(function(ge) {
      return f(ge);
    });
  }, [$, f]), D = wt(function(fe) {
    i && $(fe).forEach(function(ge) {
      return i(ge);
    });
  }, [$, i]), te = wt(function(fe) {
    var ge = fe == null ? void 0 : fe.event;
    ge && qh(ge) && a && a(ge);
  }, [a]), Q = wt(function(fe) {
    var ge = fe == null ? void 0 : fe.event;
    ge && !qh(ge) && r && r(ge);
  }, [r]);
  Or("pointermove", o ? N : void 0, c), Or("pointerout", a ? te : void 0, c), Or("pointerup", u ? L : void 0, c), Or("pointerdown", f ? M : void 0, c), Or("focus", i ? D : void 0, c), Or("blur", r ? Q : void 0, c);
}
var Xn = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/XYChart.js", gC = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}, mC = [Wu];
function Si(e) {
  var t = e.accessibilityLabel, n = t === void 0 ? "XYChart" : t, r = e.captureEvents, i = r === void 0 ? !0 : r, o = e.children, a = e.height, u = e.horizontal, f = e.margin, c = f === void 0 ? gC : f, p = e.onPointerMove, h = e.onPointerOut, w = e.onPointerUp, P = e.onPointerDown, _ = e.pointerEventsDataKey, T = _ === void 0 ? "nearest" : _, B = e.theme, k = e.width, $ = e.xScale, N = e.yScale, L = an(Gr), M = L.setDimensions, D = an(ea), te = Or();
  on(function() {
    M && k != null && a != null && k > 0 && a > 0 && M({
      width: k,
      height: a,
      margin: c
    });
  }, [M, k, a, c]);
  var Q = ym({
    source: Wu
  });
  return wm({
    dataKey: T === "nearest" ? Ya : ec,
    onPointerMove: p,
    onPointerOut: h,
    onPointerUp: w,
    onPointerDown: P,
    allowedSources: mC
  }), M ? k == null || a == null ? /* @__PURE__ */ j(QR, {
    children: function(fe) {
      return /* @__PURE__ */ j(Si, {
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
  }, this) : D == null ? /* @__PURE__ */ j(pm, {
    children: /* @__PURE__ */ j(Si, {
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
  }, this) : te == null ? /* @__PURE__ */ j(uS, {
    children: /* @__PURE__ */ j(Si, {
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
  }, this) : k > 0 && a > 0 ? /* @__PURE__ */ j("svg", {
    width: k,
    height: a,
    "aria-label": n,
    children: [o, i && /* @__PURE__ */ j("rect", {
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
  }, this) : null : !$ || !N ? (console.warn("[@visx/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart."), null) : /* @__PURE__ */ j(mm, {
    xScale: $,
    yScale: N,
    theme: B,
    initialDimensions: {
      width: k,
      height: a,
      margin: c
    },
    horizontal: u,
    children: /* @__PURE__ */ j(Si, {
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
Si.propTypes = {
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
const Pf = /* @__PURE__ */ Vo(Cb);
var Tf = {};
Tf.__esModule = !0;
Tf.default = yC;
function yC(e, t) {
  e(t);
}
var li = {};
li.__esModule = !0;
li.default = wC;
li.STACK_ORDER_NAMES = li.STACK_ORDERS = void 0;
var vo = Pf, hu = {
  ascending: vo.stackOrderAscending,
  descending: vo.stackOrderDescending,
  insideout: vo.stackOrderInsideOut,
  none: vo.stackOrderNone,
  reverse: vo.stackOrderReverse
};
li.STACK_ORDERS = hu;
var bC = Object.keys(hu);
li.STACK_ORDER_NAMES = bC;
function wC(e) {
  return e && hu[e] || hu.none;
}
var ci = {};
ci.__esModule = !0;
ci.default = _C;
ci.STACK_OFFSET_NAMES = ci.STACK_OFFSETS = void 0;
var go = Pf, pu = {
  expand: go.stackOffsetExpand,
  diverging: go.stackOffsetDiverging,
  none: go.stackOffsetNone,
  silhouette: go.stackOffsetSilhouette,
  wiggle: go.stackOffsetWiggle
};
ci.STACK_OFFSETS = pu;
var xC = Object.keys(pu);
ci.STACK_OFFSET_NAMES = xC;
function _C(e) {
  return e && pu[e] || pu.none;
}
gr.__esModule = !0;
gr.arc = CC;
gr.area = PC;
gr.line = TC;
gr.pie = NC;
gr.radialLine = EC;
gr.stack = MC;
var Ui = Pf, $t = Nf(Tf), RC = Nf(li), SC = Nf(ci);
function Nf(e) {
  return e && e.__esModule ? e : { default: e };
}
function CC(e) {
  var t = e === void 0 ? {} : e, n = t.innerRadius, r = t.outerRadius, i = t.cornerRadius, o = t.startAngle, a = t.endAngle, u = t.padAngle, f = t.padRadius, c = (0, Ui.arc)();
  return n != null && (0, $t.default)(c.innerRadius, n), r != null && (0, $t.default)(c.outerRadius, r), i != null && (0, $t.default)(c.cornerRadius, i), o != null && (0, $t.default)(c.startAngle, o), a != null && (0, $t.default)(c.endAngle, a), u != null && (0, $t.default)(c.padAngle, u), f != null && (0, $t.default)(c.padRadius, f), c;
}
function PC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.x0, i = t.x1, o = t.y, a = t.y0, u = t.y1, f = t.defined, c = t.curve, p = (0, Ui.area)();
  return n && (0, $t.default)(p.x, n), r && (0, $t.default)(p.x0, r), i && (0, $t.default)(p.x1, i), o && (0, $t.default)(p.y, o), a && (0, $t.default)(p.y0, a), u && (0, $t.default)(p.y1, u), f && p.defined(f), c && p.curve(c), p;
}
function TC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.y, i = t.defined, o = t.curve, a = (0, Ui.line)();
  return n && (0, $t.default)(a.x, n), r && (0, $t.default)(a.y, r), i && a.defined(i), o && a.curve(o), a;
}
function NC(e) {
  var t = e === void 0 ? {} : e, n = t.startAngle, r = t.endAngle, i = t.padAngle, o = t.value, a = t.sort, u = t.sortValues, f = (0, Ui.pie)();
  return (a === null || a != null) && f.sort(a), (u === null || u != null) && f.sortValues(u), o != null && f.value(o), i != null && (0, $t.default)(f.padAngle, i), n != null && (0, $t.default)(f.startAngle, n), r != null && (0, $t.default)(f.endAngle, r), f;
}
function EC(e) {
  var t = e === void 0 ? {} : e, n = t.angle, r = t.radius, i = t.defined, o = t.curve, a = (0, Ui.radialLine)();
  return n && (0, $t.default)(a.angle, n), r && (0, $t.default)(a.radius, r), i && a.defined(i), o && a.curve(o), a;
}
function MC(e) {
  var t = e.keys, n = e.value, r = e.order, i = e.offset, o = (0, Ui.stack)();
  return t && o.keys(t), n && (0, $t.default)(o.value, n), r && o.order((0, RC.default)(r)), i && o.offset((0, SC.default)(i)), o;
}
var OC = BC, ol = xm(Dn), AC = xm(gu.exports), kC = gr, IC = ["children", "x", "x0", "x1", "y", "y0", "y1", "data", "defined", "className", "curve", "innerRef"];
function xm(e) {
  return e && e.__esModule ? e : { default: e };
}
function tc() {
  return tc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, tc.apply(this, arguments);
}
function $C(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function BC(e) {
  var t = e.children, n = e.x, r = e.x0, i = e.x1, o = e.y, a = e.y0, u = e.y1, f = e.data, c = f === void 0 ? [] : f, p = e.defined, h = p === void 0 ? function() {
    return !0;
  } : p, w = e.className, P = e.curve, _ = e.innerRef, T = $C(e, IC), B = (0, kC.area)({
    x: n,
    x0: r,
    x1: i,
    y: o,
    y0: a,
    y1: u,
    defined: h,
    curve: P
  });
  return t ? /* @__PURE__ */ ol.default.createElement(ol.default.Fragment, null, t({
    path: B
  })) : /* @__PURE__ */ ol.default.createElement("path", tc({
    ref: _,
    className: (0, AC.default)("visx-area", w),
    d: B(c) || ""
  }, T));
}
var FC = GC, al = _m(Dn), DC = _m(gu.exports), zC = gr, LC = ["children", "data", "x", "y", "fill", "className", "curve", "innerRef", "defined"];
function _m(e) {
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
function jC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function GC(e) {
  var t = e.children, n = e.data, r = n === void 0 ? [] : n, i = e.x, o = e.y, a = e.fill, u = a === void 0 ? "transparent" : a, f = e.className, c = e.curve, p = e.innerRef, h = e.defined, w = h === void 0 ? function() {
    return !0;
  } : h, P = jC(e, LC), _ = (0, zC.line)({
    x: i,
    y: o,
    defined: w,
    curve: c
  });
  return t ? /* @__PURE__ */ al.default.createElement(al.default.Fragment, null, t({
    path: _
  })) : /* @__PURE__ */ al.default.createElement("path", nc({
    ref: p,
    className: (0, DC.default)("visx-linepath", f),
    d: _(r) || "",
    fill: u,
    strokeLinecap: "round"
  }, P));
}
var HC = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/enhancers/withRegisteredData.js";
function WC(e) {
  function t(n) {
    var r = n.dataKey, i = n.data, o = n.xAccessor, a = n.yAccessor, u = an(Gr), f = u.xScale, c = u.yScale, p = u.dataRegistry;
    on(function() {
      return p && p.registerData({
        key: r,
        data: i,
        xAccessor: o,
        yAccessor: a
      }), function() {
        return p == null ? void 0 : p.unregisterData(r);
      };
    }, [p, r, i, o, a]);
    var h = p == null ? void 0 : p.get(r);
    if (!f || !c || !h)
      return null;
    var w = e;
    return /* @__PURE__ */ j(w, {
      ...n,
      xScale: f,
      yScale: c,
      data: h.data,
      xAccessor: h.xAccessor,
      yAccessor: h.yAccessor
    }, void 0, !1, {
      fileName: HC,
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
      var o = (n === "start" ? 0 : Il(e)) / (n === "center" ? 2 : 1);
      return i + o;
    }
    return NaN;
  };
}
function UC(e) {
  var t = e.range().map(function(c) {
    var p;
    return (p = Qx(c)) != null ? p : 0;
  }), n = t[0], r = t[1], i = n != null && r != null && r < n, o = e(0), a = i ? [r, n] : [n, r], u = a[0], f = a[1];
  return i ? en(o) ? Math.min(Math.max(u, o), f) : f : en(o) ? Math.max(o, u) : u;
}
function Rm(e) {
  var t, n = e.dataKey, r = e.enableEvents, i = e.findNearestDatum, o = e.onBlur, a = e.onFocus, u = e.onPointerMove, f = e.onPointerOut, c = e.onPointerUp, p = e.onPointerDown, h = e.source, w = e.allowedSources, P = (t = an(ea)) != null ? t : {}, _ = P.showTooltip, T = P.hideTooltip, B = wt(function(M) {
    _(M), u && u(M);
  }, [_, u]), k = wt(function(M) {
    _(M), a && a(M);
  }, [_, a]), $ = wt(function(M) {
    T(), M && f && f(M);
  }, [T, f]), N = wt(function(M) {
    T(), M && o && o(M);
  }, [T, o]), L = wt(function(M) {
    _(M), p && p(M);
  }, [_, p]);
  return wm({
    dataKey: n,
    findNearestDatum: i,
    onBlur: r ? N : void 0,
    onFocus: r ? k : void 0,
    onPointerMove: r ? B : void 0,
    onPointerOut: r ? $ : void 0,
    onPointerUp: r ? c : void 0,
    onPointerDown: r ? L : void 0,
    allowedSources: w
  }), ym({
    source: h,
    onBlur: !!o && r,
    onFocus: !!a && r,
    onPointerMove: !!u && r,
    onPointerOut: !!f && r,
    onPointerUp: !!c && r,
    onPointerDown: !!p && r
  });
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
function Sm(e) {
  var t, n, r, i = e.colorAccessor, o = e.data, a = e.dataKey, u = e.onBlur, f = e.onFocus, c = e.onPointerMove, p = e.onPointerOut, h = e.onPointerUp, w = e.onPointerDown, P = e.enableEvents, _ = P === void 0 ? !0 : P, T = e.renderGlyphs, B = e.size, k = B === void 0 ? 8 : B, $ = e.xAccessor, N = e.xScale, L = e.yAccessor, M = e.yScale, D = an(Gr), te = D.colorScale, Q = D.theme, fe = D.horizontal, ge = wt(Ci(N, $), [N, $]), re = wt(Ci(M, L), [M, L]), ee = (t = (n = te == null ? void 0 : te(a)) != null ? n : Q == null || (r = Q.colors) == null ? void 0 : r[0]) != null ? t : "#222", be = hC + "-" + a, Oe = Rm({
    dataKey: a,
    enableEvents: _,
    onBlur: u,
    onFocus: f,
    onPointerMove: c,
    onPointerOut: p,
    onPointerUp: h,
    onPointerDown: w,
    source: be,
    allowedSources: [Wu, be]
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
  return /* @__PURE__ */ j(Fn, {
    children: T(rc({
      glyphs: ut,
      xScale: N,
      yScale: M,
      horizontal: fe
    }, Oe))
  }, void 0, !1);
}
Sm.propTypes = {
  colorAccessor: ke.exports.func,
  size: ke.exports.oneOfType([ke.exports.number, ke.exports.func]),
  renderGlyphs: ke.exports.func.isRequired
};
var VC = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/defaultRenderGlyph.js";
function qC(e) {
  var t = e.key, n = e.color, r = e.x, i = e.y, o = e.size, a = e.onBlur, u = e.onFocus, f = e.onPointerMove, c = e.onPointerOut, p = e.onPointerUp;
  return /* @__PURE__ */ j("circle", {
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
    onPointerUp: p
  }, t, !1, {
    fileName: VC,
    lineNumber: 13,
    columnNumber: 23
  }, this);
}
var mo = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/BaseAreaSeries.js", YC = ["PathComponent", "curve", "data", "dataKey", "lineProps", "onBlur", "onFocus", "onPointerMove", "onPointerOut", "onPointerUp", "onPointerDown", "enableEvents", "renderLine", "xAccessor", "x0Accessor", "xScale", "yAccessor", "y0Accessor", "yScale"];
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
function XC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function Cm(e) {
  var t, n, r, i = e.PathComponent, o = i === void 0 ? "path" : i, a = e.curve, u = e.data, f = e.dataKey, c = e.lineProps, p = e.onBlur, h = e.onFocus, w = e.onPointerMove, P = e.onPointerOut, _ = e.onPointerUp, T = e.onPointerDown, B = e.enableEvents, k = B === void 0 ? !0 : B, $ = e.renderLine, N = $ === void 0 ? !0 : $, L = e.xAccessor, M = e.x0Accessor, D = e.xScale, te = e.yAccessor, Q = e.y0Accessor, fe = e.yScale, ge = XC(e, YC), re = an(Gr), ee = re.colorScale, be = re.theme, Oe = re.horizontal, ut = Ht(function() {
    return M ? Ci(D, M) : void 0;
  }, [D, M]), Ue = wt(Ci(D, L), [D, L]), st = Ht(function() {
    return Q ? Ci(fe, Q) : void 0;
  }, [fe, Q]), lt = wt(Ci(fe, te), [fe, te]), dt = wt(function(Ne) {
    return en(D(L(Ne))) && en(fe(te(Ne)));
  }, [D, L, fe, te]), V = (t = (n = ee == null ? void 0 : ee(f)) != null ? n : be == null || (r = be.colors) == null ? void 0 : r[0]) != null ? t : "#222", ue = dC + "-" + f, Te = Rm({
    dataKey: f,
    enableEvents: k,
    onBlur: p,
    onFocus: h,
    onPointerMove: w,
    onPointerOut: P,
    onPointerUp: _,
    onPointerDown: T,
    source: ue,
    allowedSources: [Wu, ue]
  }), Ae = Ht(function() {
    var Ne = UC(Oe ? D : fe);
    return Oe ? {
      x0: ut != null ? ut : Ne,
      x1: Ue,
      y: lt
    } : {
      x: Ue,
      y0: st != null ? st : Ne,
      y1: lt
    };
  }, [D, fe, Oe, Ue, lt, ut, st]), Ce = Boolean(h || p), Se = wt(function(Ne) {
    var Fe = Ne.glyphs;
    return Ce ? Fe.map(function(Le) {
      return /* @__PURE__ */ j(Fn, {
        children: qC(ic({}, Le, {
          color: "transparent",
          onFocus: Te.onFocus,
          onBlur: Te.onBlur
        }))
      }, void 0, !1);
    }) : null;
  }, [Ce, Te.onFocus, Te.onBlur]);
  return /* @__PURE__ */ j(Fn, {
    children: [/* @__PURE__ */ j(OC, {
      ...Ae,
      ...ge,
      curve: a,
      defined: dt,
      children: function(Ne) {
        var Fe = Ne.path;
        return /* @__PURE__ */ j(o, {
          className: "visx-area",
          stroke: "transparent",
          fill: V,
          strokeLinecap: "round",
          ...ge,
          d: Fe(u) || "",
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
    }, this), N && /* @__PURE__ */ j(FC, {
      x: Ue,
      y: lt,
      defined: dt,
      curve: a,
      ...c,
      children: function(Ne) {
        var Fe = Ne.path;
        return /* @__PURE__ */ j(o, {
          className: "visx-line",
          fill: "transparent",
          stroke: V,
          strokeWidth: 2,
          pointerEvents: "none",
          strokeLinecap: "round",
          ...c,
          d: Fe(u) || ""
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
    }, this), Ce && /* @__PURE__ */ j(Sm, {
      dataKey: f,
      data: u,
      xAccessor: L,
      yAccessor: te,
      xScale: D,
      yScale: fe,
      renderGlyphs: Se
    }, void 0, !1, {
      fileName: mo,
      lineNumber: 137,
      columnNumber: 42
    }, this)]
  }, void 0, !0);
}
Cm.propTypes = {
  renderLine: ke.exports.bool
};
const KC = WC(Cm);
function QC(e, t) {
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
function ZC(e) {
  const t = {};
  return e.length === 4 && (t.x2 = e[2][0], t.y2 = e[2][1]), e.length >= 3 && (t.x1 = e[1][0], t.y1 = e[1][1]), t.x = e[e.length - 1][0], t.y = e[e.length - 1][1], e.length === 4 ? t.type = "C" : e.length === 3 ? t.type = "Q" : t.type = "L", t;
}
function JC(e, t) {
  t = t || 2;
  const n = [];
  let r = e;
  const i = 1 / t;
  for (let o = 0; o < t - 1; o++) {
    const a = i / (1 - i * o), u = QC(r, a);
    n.push(u.left), r = u.right;
  }
  return n.push(r), n;
}
function eP(e, t, n) {
  const r = [[e.x, e.y]];
  return t.x1 != null && r.push([t.x1, t.y1]), t.x2 != null && r.push([t.x2, t.y2]), r.push([t.x, t.y]), JC(r, n).map(ZC);
}
const tP = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, Oi = {
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
function oc(e, t) {
  const n = Array(e);
  for (let r = 0; r < e; r++)
    n[r] = t;
  return n;
}
function nP(e) {
  return `${e.type}${Oi[e.type].map((t) => e[t]).join(",")}`;
}
function rP(e, t) {
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
function iP(e, t, n) {
  let r = [];
  if (t.type === "L" || t.type === "Q" || t.type === "C")
    r = r.concat(
      eP(e, t, n)
    );
  else {
    const i = Object.assign({}, e);
    i.type === "M" && (i.type = "L"), r = r.concat(
      oc(n - 1).map(() => i)
    ), r.push(t);
  }
  return r;
}
function Yh(e, t, n) {
  const r = e.length - 1, i = t.length - 1, o = r / i, u = oc(i).reduce(
    (f, c, p) => {
      let h = Math.floor(o * p);
      if (n && h < e.length - 1 && n(
        e[h],
        e[h + 1]
      )) {
        const w = o * p % 1 < 0.5;
        f[h] && (w ? h > 0 ? h -= 1 : h < e.length - 1 && (h += 1) : h < e.length - 1 ? h += 1 : h > 0 && (h -= 1));
      }
      return f[h] = (f[h] || 0) + 1, f;
    },
    []
  ).reduce((f, c, p) => {
    if (p === e.length - 1) {
      const h = oc(
        c,
        Object.assign({}, e[e.length - 1])
      );
      return h[0].type === "M" && h.forEach((w) => {
        w.type = "L";
      }), f.concat(h);
    }
    return f.concat(
      iP(e[p], e[p + 1], c)
    );
  }, []);
  return u.unshift(e[0]), u;
}
function Xh(e) {
  const t = (e || "").match(tP) || [], n = [];
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
function oP(e, t, n) {
  let r = e == null ? [] : e.slice(), i = t == null ? [] : t.slice();
  if (!r.length && !i.length)
    return function() {
      return [];
    };
  const o = (r.length === 0 || r[r.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  r.length > 0 && r[r.length - 1].type === "Z" && r.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), r.length ? i.length || i.push(r[0]) : r.push(i[0]), Math.abs(i.length - r.length) !== 0 && (i.length > r.length ? r = Yh(r, i, n) : i.length < r.length && (i = Yh(i, r, n))), r = r.map(
    (f, c) => rP(f, i[c])
  );
  const u = r.map((f) => ({ ...f }));
  return o && u.push({ type: "Z" }), function(c) {
    if (c === 1)
      return t == null ? [] : t;
    if (c > 0)
      for (let p = 0; p < u.length; ++p) {
        const h = r[p], w = i[p], P = u[p];
        for (const _ of Oi[P.type])
          P[_] = (1 - c) * h[_] + c * w[_], (_ === "largeArcFlag" || _ === "sweepFlag") && (P[_] = Math.round(P[_]));
      }
    return u;
  };
}
function aP(e, t, n) {
  let r = Xh(e), i = Xh(t);
  if (!r.length && !i.length)
    return function() {
      return "";
    };
  const o = oP(
    r,
    i,
    n
  );
  return function(u) {
    if (u === 1)
      return t == null ? "" : t;
    const f = o(u);
    let c = "";
    for (const p of f)
      c += nP(p);
    return c;
  };
}
var uP = ["d", "stroke", "fill"];
function ac() {
  return ac = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, ac.apply(this, arguments);
}
function sP(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function lP(e) {
  var t = e.d, n = e.stroke, r = n === void 0 ? "transparent" : n, i = e.fill, o = i === void 0 ? "transparent" : i, a = sP(e, uP), u = tn(t), f = wt(
    fc(function(P) {
      u.current = P;
    }, 50),
    []
  ), c = aP(u.current, t);
  f(t);
  var p = kh({
    from: {
      t: 0
    },
    to: {
      t: 1
    },
    reset: !0,
    delay: 0
  }), h = p.t, w = kh({
    stroke: r,
    fill: o
  });
  return /* @__PURE__ */ Dn.createElement(CR.path, ac({
    className: "visx-path",
    d: h.to(c),
    stroke: w.stroke,
    fill: w.fill
  }, a));
}
var cP = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/AnimatedAreaSeries.js";
function fP(e) {
  return /* @__PURE__ */ j(KC, {
    ...e,
    PathComponent: lP
  }, void 0, !1, {
    fileName: cP,
    lineNumber: 9,
    columnNumber: 23
  }, this);
}
var Ir = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/LineChart/LineChart.tsx";
const dP = ({
  colorScale: e,
  nearestDatum: t,
  accessors: n
}) => /* @__PURE__ */ j("div", {
  children: [/* @__PURE__ */ j("div", {
    style: {
      color: e(t.key)
    },
    children: t.key
  }, void 0, !1, {
    fileName: Ir,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), n.xAccessor(t.datum), ", ", n.yAccessor(t.datum)]
}, void 0, !0, {
  fileName: Ir,
  lineNumber: 31,
  columnNumber: 5
}, void 0), hP = ({
  accessors: e,
  data: t,
  lineLabel: n,
  xLabel: r,
  yLabel: i,
  ...o
}) => /* @__PURE__ */ j(Fn, {
  children: /* @__PURE__ */ j(Si, {
    xScale: {
      type: "linear",
      domain: [Math.min(...t.map(e.xAccessor)), Math.max(...t.map(e.xAccessor))],
      zero: !1
    },
    yScale: {
      type: "linear"
    },
    ...o,
    children: [/* @__PURE__ */ j(fP, {
      dataKey: n,
      data: t,
      ...e
    }, void 0, !1, {
      fileName: Ir,
      lineNumber: 46,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ j(sm, {
      snapTooltipToDatumX: !0,
      snapTooltipToDatumY: !0,
      showSeriesGlyphs: !0,
      renderTooltip: ({
        tooltipData: a,
        colorScale: u
      }) => /* @__PURE__ */ j(dP, {
        nearestDatum: a.nearestDatum,
        colorScale: u,
        accessors: e
      }, void 0, !1, {
        fileName: Ir,
        lineNumber: 52,
        columnNumber: 13
      }, void 0)
    }, void 0, !1, {
      fileName: Ir,
      lineNumber: 47,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Ir,
    lineNumber: 45,
    columnNumber: 7
  }, void 0)
}, void 0, !1), zT = (e) => {
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
  return /* @__PURE__ */ j(Sp, {
    children: (i) => /* @__PURE__ */ j(hP, {
      ...r,
      parentSize: i,
      parentWidth: i.width,
      parentHeight: i.height,
      parentTop: i.top,
      parentLeft: i.left,
      parentRef: i.ref,
      resizeParent: i.resize
    }, void 0, !1, {
      fileName: Ir,
      lineNumber: 86,
      columnNumber: 9
    }, void 0)
  }, void 0, !1, {
    fileName: Ir,
    lineNumber: 84,
    columnNumber: 5
  }, void 0);
};
var Co = { exports: {} }, za = { exports: {} }, Kh;
function pP() {
  return Kh || (Kh = 1, function(e, t) {
    (function(n, r) {
      r(t, Dn);
    })(xi, function(n, r) {
      function i(s, g, y, b, E, S, A) {
        try {
          var G = s[S](A), W = G.value;
        } catch (U) {
          return void y(U);
        }
        G.done ? g(W) : Promise.resolve(W).then(b, E);
      }
      function o(s) {
        return function() {
          var g = this, y = arguments;
          return new Promise(function(b, E) {
            var S = s.apply(g, y);
            function A(W) {
              i(S, b, E, A, G, "next", W);
            }
            function G(W) {
              i(S, b, E, A, G, "throw", W);
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
        var y, b, E = {}, S = Object.keys(s);
        for (b = 0; b < S.length; b++)
          y = S[b], g.indexOf(y) >= 0 || (E[y] = s[y]);
        return E;
      }
      function f(s) {
        var g = function(y, b) {
          if (typeof y != "object" || y === null)
            return y;
          var E = y[Symbol.toPrimitive];
          if (E !== void 0) {
            var S = E.call(y, b || "default");
            if (typeof S != "object")
              return S;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return (b === "string" ? String : Number)(y);
        }(s, "string");
        return typeof g == "symbol" ? g : String(g);
      }
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      var c = { init: "init" }, p = function(s) {
        var g = s.value;
        return g === void 0 ? "" : g;
      }, h = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, w = { Cell: p, width: 150, minWidth: 0, maxWidth: Number.MAX_SAFE_INTEGER };
      function P() {
        for (var s = arguments.length, g = new Array(s), y = 0; y < s; y++)
          g[y] = arguments[y];
        return g.reduce(function(b, E) {
          var S = E.style, A = E.className;
          return b = a({}, b, {}, u(E, ["style", "className"])), S && (b.style = b.style ? a({}, b.style || {}, {}, S || {}) : S), A && (b.className = b.className ? b.className + " " + A : A), b.className === "" && delete b.className, b;
        }, {});
      }
      var _ = function(s, g) {
        return g === void 0 && (g = {}), function(y) {
          return y === void 0 && (y = {}), [].concat(s, [y]).reduce(function(b, E) {
            return function S(A, G, W) {
              return typeof G == "function" ? S({}, G(A, W)) : Array.isArray(G) ? P.apply(void 0, [A].concat(G)) : P(A, G);
            }(b, E, a({}, g, { userProps: y }));
          }, {});
        };
      }, T = function(s, g, y, b) {
        return y === void 0 && (y = {}), s.reduce(function(E, S) {
          return S(E, y);
        }, g);
      }, B = function(s, g, y) {
        return y === void 0 && (y = {}), s.forEach(function(b) {
          b(g, y);
        });
      };
      function k(s, g, y, b) {
        s.findIndex(function(E) {
          return E.pluginName === y;
        }), g.forEach(function(E) {
          s.findIndex(function(S) {
            return S.pluginName === E;
          });
        });
      }
      function $(s, g) {
        return typeof s == "function" ? s(g) : s;
      }
      function N(s) {
        var g = r.useRef();
        return g.current = s, r.useCallback(function() {
          return g.current;
        }, []);
      }
      var L = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function M(s, g) {
        var y = r.useRef(!1);
        L(function() {
          y.current && s(), y.current = !0;
        }, g);
      }
      function D(s, g, y) {
        return y === void 0 && (y = {}), function(b, E) {
          E === void 0 && (E = {});
          var S = typeof b == "string" ? g[b] : b;
          if (S === void 0)
            throw console.info(g), new Error("Renderer Error \u261D\uFE0F");
          return te(S, a({}, s, { column: g }, y, {}, E));
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
          y = function(S) {
            return function(A, G, W) {
              if (!G)
                return A;
              var U, se = typeof G == "function" ? G : JSON.stringify(G), ie = be.get(se) || function() {
                var oe = function(Y) {
                  return function ne(me, xe) {
                    if (xe === void 0 && (xe = []), Array.isArray(me))
                      for (var Ie = 0; Ie < me.length; Ie += 1)
                        ne(me[Ie], xe);
                    else
                      xe.push(me);
                    return xe;
                  }(Y).map(function(ne) {
                    return String(ne).replace(".", "_");
                  }).join(".").replace(Te, ".").replace(Ae, "").split(".");
                }(G);
                return be.set(se, oe), oe;
              }();
              try {
                U = ie.reduce(function(oe, Y) {
                  return oe[Y];
                }, A);
              } catch {
              }
              return U !== void 0 ? U : W;
            }(S, E);
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
        return Object.assign(s, a({ Header: h, Footer: h }, w, {}, g, {}, s)), Object.assign(s, { originalWidth: s.width }), s;
      }
      function ee(s, g, y) {
        y === void 0 && (y = function() {
          return {};
        });
        for (var b = [], E = s, S = 0, A = function() {
          return S++;
        }, G = function() {
          var W = { headers: [] }, U = [], se = E.some(function(ie) {
            return ie.parent;
          });
          E.forEach(function(ie) {
            var oe, Y = [].concat(U).reverse()[0];
            se && (ie.parent ? oe = a({}, ie.parent, { originalId: ie.parent.id, id: ie.parent.id + "_" + A(), headers: [ie] }, y(ie)) : oe = re(a({ originalId: ie.id + "_placeholder", id: ie.id + "_placeholder_" + A(), placeholderOf: ie, headers: [ie] }, y(ie)), g), Y && Y.originalId === oe.originalId ? Y.headers.push(ie) : U.push(oe)), W.headers.push(ie);
          }), b.push(W), E = U;
        }; E.length; )
          G();
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
          E.forEach(function(S) {
            S[g] ? b(S[g]) : y.push(S);
          });
        }(s), y;
      }
      function st(s, g) {
        var y = g.manualExpandedKey, b = g.expanded, E = g.expandSubRows, S = E === void 0 || E, A = [];
        return s.forEach(function(G) {
          return function W(U, se) {
            se === void 0 && (se = !0), U.isExpanded = U.original && U.original[y] || b[U.id], U.canExpand = U.subRows && !!U.subRows.length, se && A.push(U), U.subRows && U.subRows.length && U.isExpanded && U.subRows.forEach(function(ie) {
              return W(ie, S);
            });
          }(G);
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
      }, Se = function(s) {
        return a({ role: "rowgroup" }, s);
      }, Ne = function(s, g) {
        var y = g.column;
        return a({ key: "header_" + y.id, colSpan: y.totalVisibleHeaderCount, role: "columnheader" }, s);
      }, Fe = function(s, g) {
        var y = g.column;
        return a({ key: "footer_" + y.id, colSpan: y.totalVisibleHeaderCount }, s);
      }, Le = function(s, g) {
        return a({ key: "headerGroup_" + g.index, role: "row" }, s);
      }, X = function(s, g) {
        return a({ key: "footerGroup_" + g.index }, s);
      }, ce = function(s, g) {
        return a({ key: "row_" + g.row.id, role: "row" }, s);
      }, je = function(s, g) {
        var y = g.cell;
        return a({ key: "cell_" + y.row.id + "_" + y.column.id, role: "cell" }, s);
      };
      function F() {
        return { useOptions: [], stateReducers: [], useControlledState: [], columns: [], columnsDeps: [], allColumns: [], allColumnsDeps: [], accessValue: [], materializedColumns: [], materializedColumnsDeps: [], useInstanceAfterData: [], visibleColumns: [], visibleColumnsDeps: [], headerGroups: [], headerGroupsDeps: [], useInstanceBeforeDimensions: [], useInstance: [], prepareRow: [], getTableProps: [Ce], getTableBodyProps: [Se], getHeaderGroupProps: [Le], getFooterGroupProps: [X], getHeaderProps: [Ne], getFooterProps: [Fe], getRowProps: [ce], getCellProps: [je], useFinalInstance: [] };
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
          var E = (g.value !== void 0 ? g.value : !s.hiddenColumns.includes(g.columnId)) ? [].concat(s.hiddenColumns, [g.columnId]) : s.hiddenColumns.filter(function(S) {
            return S !== g.columnId;
          });
          return a({}, s, { hiddenColumns: E });
        }
        return g.type === c.setHiddenColumns ? a({}, s, { hiddenColumns: $(g.value, s.hiddenColumns) }) : g.type === c.toggleHideAllColumns ? a({}, s, { hiddenColumns: (g.value !== void 0 ? g.value : !s.hiddenColumns.length) ? b.allColumns.map(function(S) {
          return S.id;
        }) : [] }) : void 0;
      }
      function Qt(s) {
        var g = s.headers, y = s.state.hiddenColumns;
        r.useRef(!1).current;
        var b = 0;
        g.forEach(function(E) {
          return b += function S(A, G) {
            A.isVisible = G && !y.includes(A.id);
            var W = 0;
            return A.headers && A.headers.length ? A.headers.forEach(function(U) {
              return W += S(U, A.isVisible);
            }) : W = A.isVisible ? 1 : 0, A.totalVisibleHeaderCount = W, W;
          }(E, !0);
        });
      }
      function un(s) {
        var g = s.columns, y = s.flatHeaders, b = s.dispatch, E = s.allColumns, S = s.getHooks, A = s.state.hiddenColumns, G = s.autoResetHiddenColumns, W = G === void 0 || G, U = N(s), se = E.length === A.length, ie = r.useCallback(function(xe, Ie) {
          return b({ type: c.toggleHideColumn, columnId: xe, value: Ie });
        }, [b]), oe = r.useCallback(function(xe) {
          return b({ type: c.setHiddenColumns, value: xe });
        }, [b]), Y = r.useCallback(function(xe) {
          return b({ type: c.toggleHideAllColumns, value: xe });
        }, [b]), ne = _(S().getToggleHideAllColumnsProps, { instance: U() });
        y.forEach(function(xe) {
          xe.toggleHidden = function(Ie) {
            b({ type: c.toggleHideColumn, columnId: xe.id, value: Ie });
          }, xe.getToggleHiddenProps = _(S().getToggleHiddenProps, { instance: U(), column: xe });
        });
        var me = N(W);
        M(function() {
          me() && b({ type: c.resetHiddenColumns });
        }, [b, g]), Object.assign(s, { allColumnsHidden: se, toggleHideColumn: ie, setHiddenColumns: oe, toggleHideAllColumns: Y, getToggleHideAllColumnsProps: ne });
      }
      var mn = {}, yn = {}, bn = function(s, g, y) {
        return s;
      }, zn = function(s, g) {
        return s.subRows || [];
      }, rr = function(s, g, y) {
        return "" + (y ? [y.id, g].join(".") : g);
      }, Ln = function(s) {
        return s;
      };
      function wn(s) {
        var g = s.initialState, y = g === void 0 ? mn : g, b = s.defaultColumn, E = b === void 0 ? yn : b, S = s.getSubRows, A = S === void 0 ? zn : S, G = s.getRowId, W = G === void 0 ? rr : G, U = s.stateReducer, se = U === void 0 ? bn : U, ie = s.useControlledState, oe = ie === void 0 ? Ln : ie;
        return a({}, u(s, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]), { initialState: y, defaultColumn: E, getSubRows: A, getRowId: W, stateReducer: se, useControlledState: oe });
      }
      function qt(s, g) {
        g === void 0 && (g = 0);
        var y = 0, b = 0, E = 0, S = 0;
        return s.forEach(function(A) {
          var G = A.headers;
          if (A.totalLeft = g, G && G.length) {
            var W = qt(G, g), U = W[0], se = W[1], ie = W[2], oe = W[3];
            A.totalMinWidth = U, A.totalWidth = se, A.totalMaxWidth = ie, A.totalFlexWidth = oe;
          } else
            A.totalMinWidth = A.minWidth, A.totalWidth = Math.min(Math.max(A.minWidth, A.width), A.maxWidth), A.totalMaxWidth = A.maxWidth, A.totalFlexWidth = A.canResize ? A.totalWidth : 0;
          A.isVisible && (g += A.totalWidth, y += A.totalMinWidth, b += A.totalWidth, E += A.totalMaxWidth, S += A.totalFlexWidth);
        }), [y, b, E, S];
      }
      function En(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, S = s.column, A = s.getRowId, G = s.getSubRows, W = s.accessValueHooks, U = s.getInstance;
        g.forEach(function(se, ie) {
          return function oe(Y, ne, me, xe, Ie) {
            me === void 0 && (me = 0);
            var Je = Y, $e = A(Y, ne, xe), le = E[$e];
            if (le)
              le.subRows && le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, me + 1, le);
              });
            else if ((le = { id: $e, original: Je, index: ne, depth: me, cells: [{}] }).cells.map = V, le.cells.filter = V, le.cells.forEach = V, le.cells[0].getCellProps = V, le.values = {}, Ie.push(le), b.push(le), E[$e] = le, le.originalSubRows = G(Y, ne), le.originalSubRows) {
              var Qe = [];
              le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, me + 1, le, Qe);
              }), le.subRows = Qe;
            }
            S.accessor && (le.values[S.id] = S.accessor(Y, ne, le, Ie, g)), le.values[S.id] = T(W, le.values[S.id], { row: le, column: S, instance: U() });
          }(se, ie, 0, void 0, y);
        });
      }
      c.resetExpanded = "resetExpanded", c.toggleRowExpanded = "toggleRowExpanded", c.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var ir = function(s) {
        s.getToggleAllRowsExpandedProps = [mr], s.getToggleRowExpandedProps = [yr], s.stateReducers.push(or), s.useInstance.push(br), s.prepareRow.push(jn);
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
          var E = g.value, S = b.rowsById, A = Object.keys(S).length === Object.keys(s.expanded).length;
          if (E !== void 0 ? E : !A) {
            var G = {};
            return Object.keys(S).forEach(function(ne) {
              G[ne] = !0;
            }), a({}, s, { expanded: G });
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
        var g = s.data, y = s.rows, b = s.rowsById, E = s.manualExpandedKey, S = E === void 0 ? "expanded" : E, A = s.paginateExpandedRows, G = A === void 0 || A, W = s.expandSubRows, U = W === void 0 || W, se = s.autoResetExpanded, ie = se === void 0 || se, oe = s.getHooks, Y = s.plugins, ne = s.state.expanded, me = s.dispatch;
        k(Y, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var xe = N(ie), Ie = Boolean(Object.keys(b).length && Object.keys(ne).length);
        Ie && Object.keys(b).some(function(ft) {
          return !ne[ft];
        }) && (Ie = !1), M(function() {
          xe() && me({ type: c.resetExpanded });
        }, [me, g]);
        var Je = r.useCallback(function(ft, Ge) {
          me({ type: c.toggleRowExpanded, id: ft, value: Ge });
        }, [me]), $e = r.useCallback(function(ft) {
          return me({ type: c.toggleAllRowsExpanded, value: ft });
        }, [me]), le = r.useMemo(function() {
          return G ? st(y, { manualExpandedKey: S, expanded: ne, expandSubRows: U }) : y;
        }, [G, y, S, ne, U]), Qe = r.useMemo(function() {
          return function(ft) {
            var Ge = 0;
            return Object.keys(ft).forEach(function(Ve) {
              var yt = Ve.split(".");
              Ge = Math.max(Ge, yt.length);
            }), Ge;
          }(ne);
        }, [ne]), Ee = N(s), Ye = _(oe().getToggleAllRowsExpandedProps, { instance: Ee() });
        Object.assign(s, { preExpandedRows: y, expandedRows: le, rows: le, expandedDepth: Qe, isAllRowsExpanded: Ie, toggleRowExpanded: Je, toggleAllRowsExpanded: $e, getToggleAllRowsExpandedProps: Ye });
      }
      function jn(s, g) {
        var y = g.instance.getHooks, b = g.instance;
        s.toggleRowExpanded = function(E) {
          return b.toggleRowExpanded(s.id, E);
        }, s.getToggleRowExpandedProps = _(y().getToggleRowExpandedProps, { instance: b, row: s });
      }
      var Gn = function(s, g, y) {
        return s = s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return String(S).toLowerCase().includes(String(y).toLowerCase());
          });
        });
      };
      Gn.autoRemove = function(s) {
        return !s;
      };
      var sn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return S === void 0 || String(S).toLowerCase() === String(y).toLowerCase();
          });
        });
      };
      sn.autoRemove = function(s) {
        return !s;
      };
      var xn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return S === void 0 || String(S) === String(y);
          });
        });
      };
      xn.autoRemove = function(s) {
        return !s;
      };
      var Mn = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            return b.values[E].includes(y);
          });
        });
      };
      Mn.autoRemove = function(s) {
        return !s || !s.length;
      };
      var On = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return S && S.length && y.every(function(A) {
              return S.includes(A);
            });
          });
        });
      };
      On.autoRemove = function(s) {
        return !s || !s.length;
      };
      var ar = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return S && S.length && y.some(function(A) {
              return S.includes(A);
            });
          });
        });
      };
      ar.autoRemove = function(s) {
        return !s || !s.length;
      };
      var An = function(s, g, y) {
        return s.filter(function(b) {
          return g.some(function(E) {
            var S = b.values[E];
            return y.includes(S);
          });
        });
      };
      An.autoRemove = function(s) {
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
        var b = y || [], E = b[0], S = b[1];
        if ((E = typeof E == "number" ? E : -1 / 0) > (S = typeof S == "number" ? S : 1 / 0)) {
          var A = E;
          E = S, S = A;
        }
        return s.filter(function(G) {
          return g.some(function(W) {
            var U = G.values[W];
            return U >= E && U <= S;
          });
        });
      };
      Wn.autoRemove = function(s) {
        return !s || typeof s[0] != "number" && typeof s[1] != "number";
      };
      var _n = Object.freeze({ __proto__: null, text: Gn, exactText: sn, exactTextCase: xn, includes: Mn, includesAll: On, includesSome: ar, includesValue: An, exact: ur, equals: Hn, between: Wn });
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
          var E = g.columnId, S = g.filterValue, A = b.allColumns, G = b.filterTypes, W = A.find(function(me) {
            return me.id === E;
          });
          if (!W)
            throw new Error("React-Table: Could not find a column with id: " + E);
          var U = lt(W.filter, G || {}, _n), se = s.filters.find(function(me) {
            return me.id === E;
          }), ie = $(S, se && se.value);
          return dt(U.autoRemove, ie, W) ? a({}, s, { filters: s.filters.filter(function(me) {
            return me.id !== E;
          }) }) : a({}, s, se ? { filters: s.filters.map(function(me) {
            return me.id === E ? { id: E, value: ie } : me;
          }) } : { filters: [].concat(s.filters, [{ id: E, value: ie }]) });
        }
        if (g.type === c.setAllFilters) {
          var oe = g.filters, Y = b.allColumns, ne = b.filterTypes;
          return a({}, s, { filters: $(oe, s.filters).filter(function(me) {
            var xe = Y.find(function(Ie) {
              return Ie.id === me.id;
            });
            return !dt(lt(xe.filter, ne || {}, _n).autoRemove, me.value, xe);
          }) });
        }
      }
      function Yt(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, S = s.allColumns, A = s.filterTypes, G = s.manualFilters, W = s.defaultCanFilter, U = W !== void 0 && W, se = s.disableFilters, ie = s.state.filters, oe = s.dispatch, Y = s.autoResetFilters, ne = Y === void 0 || Y, me = r.useCallback(function(Ee, Ye) {
          oe({ type: c.setFilter, columnId: Ee, filterValue: Ye });
        }, [oe]), xe = r.useCallback(function(Ee) {
          oe({ type: c.setAllFilters, filters: Ee });
        }, [oe]);
        S.forEach(function(Ee) {
          var Ye = Ee.id, ft = Ee.accessor, Ge = Ee.defaultCanFilter, Ve = Ee.disableFilters;
          Ee.canFilter = ft ? Oe(Ve !== !0 && void 0, se !== !0 && void 0, !0) : Oe(Ge, U, !1), Ee.setFilter = function(Ke) {
            return me(Ee.id, Ke);
          };
          var yt = ie.find(function(Ke) {
            return Ke.id === Ye;
          });
          Ee.filterValue = yt && yt.value;
        });
        var Ie = r.useMemo(function() {
          if (G || !ie.length)
            return [y, b, E];
          var Ee = [], Ye = {};
          return [function ft(Ge, Ve) {
            Ve === void 0 && (Ve = 0);
            var yt = Ge;
            return (yt = ie.reduce(function(Ke, pt) {
              var l = pt.id, d = pt.value, m = S.find(function(R) {
                return R.id === l;
              });
              if (!m)
                return Ke;
              Ve === 0 && (m.preFilteredRows = Ke);
              var v = lt(m.filter, A || {}, _n);
              return v ? (m.filteredRows = v(Ke, [l], d), m.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + m.id + "."), Ke);
            }, Ge)).forEach(function(Ke) {
              Ee.push(Ke), Ye[Ke.id] = Ke, Ke.subRows && (Ke.subRows = Ke.subRows && Ke.subRows.length > 0 ? ft(Ke.subRows, Ve + 1) : Ke.subRows);
            }), yt;
          }(y), Ee, Ye];
        }, [G, ie, y, b, E, S, A]), Je = Ie[0], $e = Ie[1], le = Ie[2];
        r.useMemo(function() {
          S.filter(function(Ee) {
            return !ie.find(function(Ye) {
              return Ye.id === Ee.id;
            });
          }).forEach(function(Ee) {
            Ee.preFilteredRows = Je, Ee.filteredRows = Je;
          });
        }, [Je, ie, S]);
        var Qe = N(ne);
        M(function() {
          Qe() && oe({ type: c.resetFilters });
        }, [oe, G ? null : g]), Object.assign(s, { preFilteredRows: y, preFilteredFlatRows: b, preFilteredRowsById: E, filteredRows: Je, filteredFlatRows: $e, filteredRowsById: le, rows: Je, flatRows: $e, rowsById: le, setFilter: me, setAllFilters: xe });
      }
      wr.pluginName = "useFilters", c.resetGlobalFilter = "resetGlobalFilter", c.setGlobalFilter = "setGlobalFilter";
      var O = function(s) {
        s.stateReducers.push(J), s.useInstance.push(pe);
      };
      function J(s, g, y, b) {
        if (g.type === c.resetGlobalFilter)
          return a({}, s, { globalFilter: b.initialState.globalFilter || void 0 });
        if (g.type === c.setGlobalFilter) {
          var E = g.filterValue, S = b.userFilterTypes, A = lt(b.globalFilter, S || {}, _n), G = $(E, s.globalFilter);
          return dt(A.autoRemove, G) ? (s.globalFilter, u(s, ["globalFilter"])) : a({}, s, { globalFilter: G });
        }
      }
      function pe(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, S = s.allColumns, A = s.filterTypes, G = s.globalFilter, W = s.manualGlobalFilter, U = s.state.globalFilter, se = s.dispatch, ie = s.autoResetGlobalFilter, oe = ie === void 0 || ie, Y = s.disableGlobalFilter, ne = r.useCallback(function(le) {
          se({ type: c.setGlobalFilter, filterValue: le });
        }, [se]), me = r.useMemo(function() {
          if (W || U === void 0)
            return [y, b, E];
          var le = [], Qe = {}, Ee = lt(G, A || {}, _n);
          if (!Ee)
            return console.warn("Could not find a valid 'globalFilter' option."), y;
          S.forEach(function(ft) {
            var Ge = ft.disableGlobalFilter;
            ft.canFilter = Oe(Ge !== !0 && void 0, Y !== !0 && void 0, !0);
          });
          var Ye = S.filter(function(ft) {
            return ft.canFilter === !0;
          });
          return [function ft(Ge) {
            return (Ge = Ee(Ge, Ye.map(function(Ve) {
              return Ve.id;
            }), U)).forEach(function(Ve) {
              le.push(Ve), Qe[Ve.id] = Ve, Ve.subRows = Ve.subRows && Ve.subRows.length ? ft(Ve.subRows) : Ve.subRows;
            }), Ge;
          }(y), le, Qe];
        }, [W, U, G, A, S, y, b, E, Y]), xe = me[0], Ie = me[1], Je = me[2], $e = N(oe);
        M(function() {
          $e() && se({ type: c.resetGlobalFilter });
        }, [se, W ? null : g]), Object.assign(s, { preGlobalFilteredRows: y, preGlobalFilteredFlatRows: b, preGlobalFilteredRowsById: E, globalFilteredRows: xe, globalFilteredFlatRows: Ie, globalFilteredRowsById: Je, rows: xe, flatRows: Ie, rowsById: Je, setGlobalFilter: ne, disableGlobalFilter: Y });
      }
      function ze(s, g) {
        return g.reduce(function(y, b) {
          return y + (typeof b == "number" ? b : 0);
        }, 0);
      }
      O.pluginName = "useGlobalFilter";
      var ht = Object.freeze({ __proto__: null, sum: ze, min: function(s) {
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
          var E = g.columnId, S = g.value, A = S !== void 0 ? S : !s.groupBy.includes(E);
          return a({}, s, A ? { groupBy: [].concat(s.groupBy, [E]) } : { groupBy: s.groupBy.filter(function(G) {
            return G !== E;
          }) });
        }
      }
      function Et(s, g) {
        var y = g.instance.state.groupBy, b = y.map(function(S) {
          return s.find(function(A) {
            return A.id === S;
          });
        }).filter(Boolean), E = s.filter(function(S) {
          return !y.includes(S.id);
        });
        return (s = [].concat(b, E)).forEach(function(S) {
          S.isGrouped = y.includes(S.id), S.groupedIndex = y.indexOf(S.id);
        }), s;
      }
      var hn = {};
      function Un(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, S = s.allColumns, A = s.flatHeaders, G = s.groupByFn, W = G === void 0 ? ln : G, U = s.manualGroupBy, se = s.aggregations, ie = se === void 0 ? hn : se, oe = s.plugins, Y = s.state.groupBy, ne = s.dispatch, me = s.autoResetGroupBy, xe = me === void 0 || me, Ie = s.disableGroupBy, Je = s.defaultCanGroupBy, $e = s.getHooks;
        k(oe, ["useColumnOrder", "useFilters"], "useGroupBy");
        var le = N(s);
        S.forEach(function(m) {
          var v = m.accessor, R = m.defaultGroupBy, C = m.disableGroupBy;
          m.canGroupBy = v ? Oe(m.canGroupBy, C !== !0 && void 0, Ie !== !0 && void 0, !0) : Oe(m.canGroupBy, R, Je, !1), m.canGroupBy && (m.toggleGroupBy = function() {
            return s.toggleGroupBy(m.id);
          }), m.Aggregated = m.Aggregated || m.Cell;
        });
        var Qe = r.useCallback(function(m, v) {
          ne({ type: c.toggleGroupBy, columnId: m, value: v });
        }, [ne]), Ee = r.useCallback(function(m) {
          ne({ type: c.setGroupBy, value: m });
        }, [ne]);
        A.forEach(function(m) {
          m.getGroupByToggleProps = _($e().getGroupByToggleProps, { instance: le(), header: m });
        });
        var Ye = r.useMemo(function() {
          if (U || !Y.length)
            return [y, b, E, mt, ot, b, E];
          var m = Y.filter(function(q) {
            return S.find(function(he) {
              return he.id === q;
            });
          }), v = [], R = {}, C = [], x = {}, I = [], z = {}, H = function q(he, Z, ae) {
            if (Z === void 0 && (Z = 0), Z === m.length)
              return he.map(function(Pe) {
                return a({}, Pe, { depth: Z });
              });
            var ve = m[Z], K = W(he, ve);
            return Object.entries(K).map(function(Pe, De) {
              var We = Pe[0], we = Pe[1], Ze = ve + ":" + We, it = q(we, Z + 1, Ze = ae ? ae + ">" + Ze : Ze), _e = Z ? Ue(we, "leafRows") : we, ye = function(Be, et, tt) {
                var Rt = {};
                return S.forEach(function(Me) {
                  if (m.includes(Me.id))
                    Rt[Me.id] = et[0] ? et[0].values[Me.id] : null;
                  else {
                    var Ft = typeof Me.aggregate == "function" ? Me.aggregate : ie[Me.aggregate] || ht[Me.aggregate];
                    if (Ft) {
                      var nt = et.map(function(Xe) {
                        return Xe.values[Me.id];
                      }), qe = Be.map(function(Xe) {
                        var Tt = Xe.values[Me.id];
                        if (!tt && Me.aggregateValue) {
                          var jt = typeof Me.aggregateValue == "function" ? Me.aggregateValue : ie[Me.aggregateValue] || ht[Me.aggregateValue];
                          if (!jt)
                            throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                          Tt = jt(Tt, Xe, Me);
                        }
                        return Tt;
                      });
                      Rt[Me.id] = Ft(qe, nt);
                    } else {
                      if (Me.aggregate)
                        throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregate option for column listed above");
                      Rt[Me.id] = null;
                    }
                  }
                }), Rt;
              }(_e, we, Z), Re = { id: Ze, isGrouped: !0, groupByID: ve, groupByVal: We, values: ye, subRows: it, leafRows: _e, depth: Z, index: De };
              return it.forEach(function(Be) {
                v.push(Be), R[Be.id] = Be, Be.isGrouped ? (C.push(Be), x[Be.id] = Be) : (I.push(Be), z[Be.id] = Be);
              }), Re;
            });
          }(y);
          return H.forEach(function(q) {
            v.push(q), R[q.id] = q, q.isGrouped ? (C.push(q), x[q.id] = q) : (I.push(q), z[q.id] = q);
          }), [H, v, R, C, x, I, z];
        }, [U, Y, y, b, E, S, ie, W]), ft = Ye[0], Ge = Ye[1], Ve = Ye[2], yt = Ye[3], Ke = Ye[4], pt = Ye[5], l = Ye[6], d = N(xe);
        M(function() {
          d() && ne({ type: c.resetGroupBy });
        }, [ne, U ? null : g]), Object.assign(s, { preGroupedRows: y, preGroupedFlatRow: b, preGroupedRowsById: E, groupedRows: ft, groupedFlatRows: Ge, groupedRowsById: Ve, onlyGroupedFlatRows: yt, onlyGroupedRowsById: Ke, nonGroupedFlatRows: pt, nonGroupedRowsById: l, rows: ft, flatRows: Ge, rowsById: Ve, toggleGroupBy: Qe, setGroupBy: Ee });
      }
      function Hr(s) {
        s.allCells.forEach(function(g) {
          var y;
          g.isGrouped = g.column.isGrouped && g.column.id === s.groupByID, g.isPlaceholder = !g.isGrouped && g.column.isGrouped, g.isAggregated = !g.isGrouped && !g.isPlaceholder && ((y = s.subRows) == null ? void 0 : y.length);
        });
      }
      function ln(s, g) {
        return s.reduce(function(y, b, E) {
          var S = "" + b.values[g];
          return y[S] = Array.isArray(y[S]) ? y[S] : [], y[S].push(b), y;
        }, {});
      }
      var na = /([0-9]+)/gm;
      function hi(s, g) {
        return s === g ? 0 : s > g ? 1 : -1;
      }
      function Wr(s, g, y) {
        return [s.values[y], g.values[y]];
      }
      function ra(s) {
        return typeof s == "number" ? isNaN(s) || s === 1 / 0 || s === -1 / 0 ? "" : String(s) : typeof s == "string" ? s : "";
      }
      var Uu = Object.freeze({ __proto__: null, alphanumeric: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], S = b[1];
        for (E = ra(E), S = ra(S), E = E.split(na).filter(Boolean), S = S.split(na).filter(Boolean); E.length && S.length; ) {
          var A = E.shift(), G = S.shift(), W = parseInt(A, 10), U = parseInt(G, 10), se = [W, U].sort();
          if (isNaN(se[0])) {
            if (A > G)
              return 1;
            if (G > A)
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
        return E.length - S.length;
      }, datetime: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], S = b[1];
        return hi(E = E.getTime(), S = S.getTime());
      }, basic: function(s, g, y) {
        var b = Wr(s, g, y);
        return hi(b[0], b[1]);
      }, string: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], S = b[1];
        for (E = E.split("").filter(Boolean), S = S.split("").filter(Boolean); E.length && S.length; ) {
          var A = E.shift(), G = S.shift(), W = A.toLowerCase(), U = G.toLowerCase();
          if (W > U)
            return 1;
          if (U > W)
            return -1;
          if (A > G)
            return 1;
          if (G > A)
            return -1;
        }
        return E.length - S.length;
      }, number: function(s, g, y) {
        var b = Wr(s, g, y), E = b[0], S = b[1], A = /[^0-9.]/gi;
        return hi(E = Number(String(E).replace(A, "")), S = Number(String(S).replace(A, "")));
      } });
      c.resetSortBy = "resetSortBy", c.setSortBy = "setSortBy", c.toggleSortBy = "toggleSortBy", c.clearSortBy = "clearSortBy", w.sortType = "alphanumeric", w.sortDescFirst = !1;
      var ia = function(s) {
        s.getSortByToggleProps = [Vu], s.stateReducers.push(qu), s.useInstance.push(Yu);
      };
      ia.pluginName = "useSortBy";
      var Vu = function(s, g) {
        var y = g.instance, b = g.column, E = y.isMultiSortEvent, S = E === void 0 ? function(A) {
          return A.shiftKey;
        } : E;
        return [s, { onClick: b.canSort ? function(A) {
          A.persist(), b.toggleSortBy(void 0, !y.disableMultiSort && S(A));
        } : void 0, style: { cursor: b.canSort ? "pointer" : void 0 }, title: b.canSort ? "Toggle SortBy" : void 0 }];
      };
      function qu(s, g, y, b) {
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
          var E, S = g.columnId, A = g.desc, G = g.multi, W = b.allColumns, U = b.disableMultiSort, se = b.disableSortRemove, ie = b.disableMultiRemove, oe = b.maxMultiSortColCount, Y = oe === void 0 ? Number.MAX_SAFE_INTEGER : oe, ne = s.sortBy, me = W.find(function(le) {
            return le.id === S;
          }).sortDescFirst, xe = ne.find(function(le) {
            return le.id === S;
          }), Ie = ne.findIndex(function(le) {
            return le.id === S;
          }), Je = A != null, $e = [];
          return (E = !U && G ? xe ? "toggle" : "add" : Ie !== ne.length - 1 || ne.length !== 1 ? "replace" : xe ? "toggle" : "replace") != "toggle" || se || Je || G && ie || !(xe && xe.desc && !me || !xe.desc && me) || (E = "remove"), E === "replace" ? $e = [{ id: S, desc: Je ? A : me }] : E === "add" ? ($e = [].concat(ne, [{ id: S, desc: Je ? A : me }])).splice(0, $e.length - Y) : E === "toggle" ? $e = ne.map(function(le) {
            return le.id === S ? a({}, le, { desc: Je ? A : !xe.desc }) : le;
          }) : E === "remove" && ($e = ne.filter(function(le) {
            return le.id !== S;
          })), a({}, s, { sortBy: $e });
        }
      }
      function Yu(s) {
        var g = s.data, y = s.rows, b = s.flatRows, E = s.allColumns, S = s.orderByFn, A = S === void 0 ? oa : S, G = s.sortTypes, W = s.manualSortBy, U = s.defaultCanSort, se = s.disableSortBy, ie = s.flatHeaders, oe = s.state.sortBy, Y = s.dispatch, ne = s.plugins, me = s.getHooks, xe = s.autoResetSortBy, Ie = xe === void 0 || xe;
        k(ne, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var Je = r.useCallback(function(Ge) {
          Y({ type: c.setSortBy, sortBy: Ge });
        }, [Y]), $e = r.useCallback(function(Ge, Ve, yt) {
          Y({ type: c.toggleSortBy, columnId: Ge, desc: Ve, multi: yt });
        }, [Y]), le = N(s);
        ie.forEach(function(Ge) {
          var Ve = Ge.accessor, yt = Ge.canSort, Ke = Ge.disableSortBy, pt = Ge.id, l = Ve ? Oe(Ke !== !0 && void 0, se !== !0 && void 0, !0) : Oe(U, yt, !1);
          Ge.canSort = l, Ge.canSort && (Ge.toggleSortBy = function(m, v) {
            return $e(Ge.id, m, v);
          }, Ge.clearSortBy = function() {
            Y({ type: c.clearSortBy, columnId: Ge.id });
          }), Ge.getSortByToggleProps = _(me().getSortByToggleProps, { instance: le(), column: Ge });
          var d = oe.find(function(m) {
            return m.id === pt;
          });
          Ge.isSorted = !!d, Ge.sortedIndex = oe.findIndex(function(m) {
            return m.id === pt;
          }), Ge.isSortedDesc = Ge.isSorted ? d.desc : void 0;
        });
        var Qe = r.useMemo(function() {
          if (W || !oe.length)
            return [y, b];
          var Ge = [], Ve = oe.filter(function(yt) {
            return E.find(function(Ke) {
              return Ke.id === yt.id;
            });
          });
          return [function yt(Ke) {
            var pt = A(Ke, Ve.map(function(l) {
              var d = E.find(function(R) {
                return R.id === l.id;
              });
              if (!d)
                throw new Error("React-Table: Could not find a column with id: " + l.id + " while sorting");
              var m = d.sortType, v = ut(m) || (G || {})[m] || Uu[m];
              if (!v)
                throw new Error("React-Table: Could not find a valid sortType of '" + m + "' for column '" + l.id + "'.");
              return function(R, C) {
                return v(R, C, l.id, l.desc);
              };
            }), Ve.map(function(l) {
              var d = E.find(function(m) {
                return m.id === l.id;
              });
              return d && d.sortInverted ? l.desc : !l.desc;
            }));
            return pt.forEach(function(l) {
              Ge.push(l), l.subRows && l.subRows.length !== 0 && (l.subRows = yt(l.subRows));
            }), pt;
          }(y), Ge];
        }, [W, oe, y, b, E, A, G]), Ee = Qe[0], Ye = Qe[1], ft = N(Ie);
        M(function() {
          ft() && Y({ type: c.resetSortBy });
        }, [W ? null : g]), Object.assign(s, { preSortedRows: y, preSortedFlatRows: b, sortedRows: Ee, sortedFlatRows: Ye, rows: Ee, flatRows: Ye, setSortBy: Je, toggleSortBy: $e });
      }
      function oa(s, g, y) {
        return [].concat(s).sort(function(b, E) {
          for (var S = 0; S < g.length; S += 1) {
            var A = g[S], G = y[S] === !1 || y[S] === "desc", W = A(b, E);
            if (W !== 0)
              return G ? -W : W;
          }
          return y[0] ? b.index - E.index : E.index - b.index;
        });
      }
      c.resetPage = "resetPage", c.gotoPage = "gotoPage", c.setPageSize = "setPageSize";
      var Vi = function(s) {
        s.stateReducers.push(Xu), s.useInstance.push(Ku);
      };
      function Xu(s, g, y, b) {
        if (g.type === c.init)
          return a({ pageSize: 10, pageIndex: 0 }, s);
        if (g.type === c.resetPage)
          return a({}, s, { pageIndex: b.initialState.pageIndex || 0 });
        if (g.type === c.gotoPage) {
          var E = b.pageCount, S = b.page, A = $(g.pageIndex, s.pageIndex), G = !1;
          return A > s.pageIndex ? G = E === -1 ? S.length >= s.pageSize : A < E : A < s.pageIndex && (G = A > -1), G ? a({}, s, { pageIndex: A }) : s;
        }
        if (g.type === c.setPageSize) {
          var W = g.pageSize, U = s.pageSize * s.pageIndex;
          return a({}, s, { pageIndex: Math.floor(U / W), pageSize: W });
        }
      }
      function Ku(s) {
        var g = s.rows, y = s.autoResetPage, b = y === void 0 || y, E = s.manualExpandedKey, S = E === void 0 ? "expanded" : E, A = s.plugins, G = s.pageCount, W = s.paginateExpandedRows, U = W === void 0 || W, se = s.expandSubRows, ie = se === void 0 || se, oe = s.state, Y = oe.pageSize, ne = oe.pageIndex, me = oe.expanded, xe = oe.globalFilter, Ie = oe.filters, Je = oe.groupBy, $e = oe.sortBy, le = s.dispatch, Qe = s.data, Ee = s.manualPagination;
        k(A, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var Ye = N(b);
        M(function() {
          Ye() && le({ type: c.resetPage });
        }, [le, Ee ? null : Qe, xe, Ie, Je, $e]);
        var ft = Ee ? G : Math.ceil(g.length / Y), Ge = r.useMemo(function() {
          return ft > 0 ? [].concat(new Array(ft)).fill(null).map(function(v, R) {
            return R;
          }) : [];
        }, [ft]), Ve = r.useMemo(function() {
          var v;
          if (Ee)
            v = g;
          else {
            var R = Y * ne, C = R + Y;
            v = g.slice(R, C);
          }
          return U ? v : st(v, { manualExpandedKey: S, expanded: me, expandSubRows: ie });
        }, [ie, me, S, Ee, ne, Y, U, g]), yt = ne > 0, Ke = ft === -1 ? Ve.length >= Y : ne < ft - 1, pt = r.useCallback(function(v) {
          le({ type: c.gotoPage, pageIndex: v });
        }, [le]), l = r.useCallback(function() {
          return pt(function(v) {
            return v - 1;
          });
        }, [pt]), d = r.useCallback(function() {
          return pt(function(v) {
            return v + 1;
          });
        }, [pt]), m = r.useCallback(function(v) {
          le({ type: c.setPageSize, pageSize: v });
        }, [le]);
        Object.assign(s, { pageOptions: Ge, pageCount: ft, page: Ve, canPreviousPage: yt, canNextPage: Ke, gotoPage: pt, previousPage: l, nextPage: d, setPageSize: m });
      }
      Vi.pluginName = "usePagination", c.resetPivot = "resetPivot", c.togglePivot = "togglePivot";
      var qi = function(s) {
        s.getPivotToggleProps = [Qu], s.stateReducers.push(Zu), s.useInstanceAfterData.push(Ju), s.allColumns.push(es), s.accessValue.push(ts), s.materializedColumns.push(ua), s.materializedColumnsDeps.push(sa), s.visibleColumns.push(ns), s.visibleColumnsDeps.push(rs), s.useInstance.push(is), s.prepareRow.push(os);
      };
      qi.pluginName = "usePivotColumns";
      var aa = [], Qu = function(s, g) {
        var y = g.header;
        return [s, { onClick: y.canPivot ? function(b) {
          b.persist(), y.togglePivot();
        } : void 0, style: { cursor: y.canPivot ? "pointer" : void 0 }, title: "Toggle Pivot" }];
      };
      function Zu(s, g, y, b) {
        if (g.type === c.init)
          return a({ pivotColumns: aa }, s);
        if (g.type === c.resetPivot)
          return a({}, s, { pivotColumns: b.initialState.pivotColumns || aa });
        if (g.type === c.togglePivot) {
          var E = g.columnId, S = g.value, A = S !== void 0 ? S : !s.pivotColumns.includes(E);
          return a({}, s, A ? { pivotColumns: [].concat(s.pivotColumns, [E]) } : { pivotColumns: s.pivotColumns.filter(function(G) {
            return G !== E;
          }) });
        }
      }
      function Ju(s) {
        s.allColumns.forEach(function(g) {
          g.isPivotSource = s.state.pivotColumns.includes(g.id);
        });
      }
      function es(s, g) {
        var y = g.instance;
        return s.forEach(function(b) {
          b.isPivotSource = y.state.pivotColumns.includes(b.id), b.uniqueValues = /* @__PURE__ */ new Set();
        }), s;
      }
      function ts(s, g) {
        var y = g.column;
        return y.uniqueValues && s !== void 0 && y.uniqueValues.add(s), s;
      }
      function ua(s, g) {
        var y = g.instance, b = y.allColumns, E = y.state;
        if (!E.pivotColumns.length || !E.groupBy || !E.groupBy.length)
          return s;
        var S = E.pivotColumns.map(function(W) {
          return b.find(function(U) {
            return U.id === W;
          });
        }).filter(Boolean), A = b.filter(function(W) {
          return !W.isPivotSource && !E.groupBy.includes(W.id) && !E.pivotColumns.includes(W.id);
        }), G = fe(function W(U, se, ie) {
          U === void 0 && (U = 0), ie === void 0 && (ie = []);
          var oe = S[U];
          return oe ? Array.from(oe.uniqueValues).sort().map(function(Y) {
            var ne = a({}, oe, { Header: oe.PivotHeader || typeof oe.header == "string" ? oe.Header + ": " + Y : Y, isPivotGroup: !0, parent: se, depth: U, id: se ? se.id + "." + oe.id + "." + Y : oe.id + "." + Y, pivotValue: Y });
            return ne.columns = W(U + 1, ne, [].concat(ie, [function(me) {
              return me.values[oe.id] === Y;
            }])), ne;
          }) : A.map(function(Y) {
            return a({}, Y, { canPivot: !1, isPivoted: !0, parent: se, depth: U, id: "" + (se ? se.id + "." + Y.id : Y.id), accessor: function(ne, me, xe) {
              if (ie.every(function(Ie) {
                return Ie(xe);
              }))
                return xe.values[Y.id];
            } });
          });
        }());
        return [].concat(s, G);
      }
      function sa(s, g) {
        var y = g.instance.state, b = y.pivotColumns, E = y.groupBy;
        return [].concat(s, [b, E]);
      }
      function ns(s, g) {
        var y = g.instance.state;
        return s = s.filter(function(b) {
          return !b.isPivotSource;
        }), y.pivotColumns.length && y.groupBy && y.groupBy.length && (s = s.filter(function(b) {
          return b.isGrouped || b.isPivoted;
        })), s;
      }
      function rs(s, g) {
        var y = g.instance;
        return [].concat(s, [y.state.pivotColumns, y.state.groupBy]);
      }
      function is(s) {
        var g = s.columns, y = s.allColumns, b = s.flatHeaders, E = s.getHooks, S = s.plugins, A = s.dispatch, G = s.autoResetPivot, W = G === void 0 || G, U = s.manaulPivot, se = s.disablePivot, ie = s.defaultCanPivot;
        k(S, ["useGroupBy"], "usePivotColumns");
        var oe = N(s);
        y.forEach(function(ne) {
          var me = ne.accessor, xe = ne.defaultPivot, Ie = ne.disablePivot;
          ne.canPivot = me ? Oe(ne.canPivot, Ie !== !0 && void 0, se !== !0 && void 0, !0) : Oe(ne.canPivot, xe, ie, !1), ne.canPivot && (ne.togglePivot = function() {
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
      function os(s) {
        s.allCells.forEach(function(g) {
          g.isPivoted = g.column.isPivoted;
        });
      }
      c.resetSelectedRows = "resetSelectedRows", c.toggleAllRowsSelected = "toggleAllRowsSelected", c.toggleRowSelected = "toggleRowSelected", c.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var la = function(s) {
        s.getToggleRowSelectedProps = [Yi], s.getToggleAllRowsSelectedProps = [Ur], s.getToggleAllPageRowsSelectedProps = [ca], s.stateReducers.push(as), s.useInstance.push(fa), s.prepareRow.push(us);
      };
      la.pluginName = "useRowSelect";
      var Yi = function(s, g) {
        var y = g.instance, b = g.row, E = y.manualRowSelectedKey, S = E === void 0 ? "isSelected" : E;
        return [s, { onChange: function(A) {
          b.toggleRowSelected(A.target.checked);
        }, style: { cursor: "pointer" }, checked: !(!b.original || !b.original[S]) || b.isSelected, title: "Toggle Row Selected", indeterminate: b.isSomeSelected }];
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
      function as(s, g, y, b) {
        if (g.type === c.init)
          return a({ selectedRowIds: {} }, s);
        if (g.type === c.resetSelectedRows)
          return a({}, s, { selectedRowIds: b.initialState.selectedRowIds || {} });
        if (g.type === c.toggleAllRowsSelected) {
          var E = g.value, S = b.isAllRowsSelected, A = b.rowsById, G = b.nonGroupedRowsById, W = G === void 0 ? A : G, U = E !== void 0 ? E : !S, se = Object.assign({}, s.selectedRowIds);
          return U ? Object.keys(W).forEach(function(pt) {
            se[pt] = !0;
          }) : Object.keys(W).forEach(function(pt) {
            delete se[pt];
          }), a({}, s, { selectedRowIds: se });
        }
        if (g.type === c.toggleRowSelected) {
          var ie = g.id, oe = g.value, Y = b.rowsById, ne = b.selectSubRows, me = ne === void 0 || ne, xe = b.getSubRows, Ie = s.selectedRowIds[ie], Je = oe !== void 0 ? oe : !Ie;
          if (Ie === Je)
            return s;
          var $e = a({}, s.selectedRowIds);
          return function pt(l) {
            var d = Y[l];
            if (d && (d.isGrouped || (Je ? $e[l] = !0 : delete $e[l]), me && xe(d)))
              return xe(d).forEach(function(m) {
                return pt(m.id);
              });
          }(ie), a({}, s, { selectedRowIds: $e });
        }
        if (g.type === c.toggleAllPageRowsSelected) {
          var le = g.value, Qe = b.page, Ee = b.rowsById, Ye = b.selectSubRows, ft = Ye === void 0 || Ye, Ge = b.isAllPageRowsSelected, Ve = b.getSubRows, yt = le !== void 0 ? le : !Ge, Ke = a({}, s.selectedRowIds);
          return Qe.forEach(function(pt) {
            return function l(d) {
              var m = Ee[d];
              if (m.isGrouped || (yt ? Ke[d] = !0 : delete Ke[d]), ft && Ve(m))
                return Ve(m).forEach(function(v) {
                  return l(v.id);
                });
            }(pt.id);
          }), a({}, s, { selectedRowIds: Ke });
        }
        return s;
      }
      function fa(s) {
        var g = s.data, y = s.rows, b = s.getHooks, E = s.plugins, S = s.rowsById, A = s.nonGroupedRowsById, G = A === void 0 ? S : A, W = s.autoResetSelectedRows, U = W === void 0 || W, se = s.state.selectedRowIds, ie = s.selectSubRows, oe = ie === void 0 || ie, Y = s.dispatch, ne = s.page, me = s.getSubRows;
        k(E, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var xe = r.useMemo(function() {
          var Ve = [];
          return y.forEach(function(yt) {
            var Ke = oe ? function pt(l, d, m) {
              if (d[l.id])
                return !0;
              var v = m(l);
              if (v && v.length) {
                var R = !0, C = !1;
                return v.forEach(function(x) {
                  C && !R || (pt(x, d, m) ? C = !0 : R = !1);
                }), !!R || !!C && null;
              }
              return !1;
            }(yt, se, me) : !!se[yt.id];
            yt.isSelected = !!Ke, yt.isSomeSelected = Ke === null, Ke && Ve.push(yt);
          }), Ve;
        }, [y, oe, se, me]), Ie = Boolean(Object.keys(G).length && Object.keys(se).length), Je = Ie;
        Ie && Object.keys(G).some(function(Ve) {
          return !se[Ve];
        }) && (Ie = !1), Ie || ne && ne.length && ne.some(function(Ve) {
          var yt = Ve.id;
          return !se[yt];
        }) && (Je = !1);
        var $e = N(U);
        M(function() {
          $e() && Y({ type: c.resetSelectedRows });
        }, [Y, g]);
        var le = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllRowsSelected, value: Ve });
        }, [Y]), Qe = r.useCallback(function(Ve) {
          return Y({ type: c.toggleAllPageRowsSelected, value: Ve });
        }, [Y]), Ee = r.useCallback(function(Ve, yt) {
          return Y({ type: c.toggleRowSelected, id: Ve, value: yt });
        }, [Y]), Ye = N(s), ft = _(b().getToggleAllRowsSelectedProps, { instance: Ye() }), Ge = _(b().getToggleAllPageRowsSelectedProps, { instance: Ye() });
        Object.assign(s, { selectedFlatRows: xe, isAllRowsSelected: Ie, isAllPageRowsSelected: Je, toggleRowSelected: Ee, toggleAllRowsSelected: le, getToggleAllRowsSelectedProps: ft, getToggleAllPageRowsSelectedProps: Ge, toggleAllPageRowsSelected: Qe });
      }
      function us(s, g) {
        var y = g.instance;
        s.toggleRowSelected = function(b) {
          return y.toggleRowSelected(s.id, b);
        }, s.getToggleRowSelectedProps = _(y.getHooks().getToggleRowSelectedProps, { instance: y, row: s });
      }
      var da = function(s) {
        return {};
      }, ha = function(s) {
        return {};
      };
      c.setRowState = "setRowState", c.setCellState = "setCellState", c.resetRowState = "resetRowState";
      var Xi = function(s) {
        s.stateReducers.push(ss), s.useInstance.push(pa), s.prepareRow.push(ls);
      };
      function ss(s, g, y, b) {
        var E = b.initialRowStateAccessor, S = E === void 0 ? da : E, A = b.initialCellStateAccessor, G = A === void 0 ? ha : A, W = b.rowsById;
        if (g.type === c.init)
          return a({ rowState: {} }, s);
        if (g.type === c.resetRowState)
          return a({}, s, { rowState: b.initialState.rowState || {} });
        if (g.type === c.setRowState) {
          var U, se = g.rowId, ie = g.value, oe = s.rowState[se] !== void 0 ? s.rowState[se] : S(W[se]);
          return a({}, s, { rowState: a({}, s.rowState, (U = {}, U[se] = $(ie, oe), U)) });
        }
        if (g.type === c.setCellState) {
          var Y, ne, me, xe, Ie, Je = g.rowId, $e = g.columnId, le = g.value, Qe = s.rowState[Je] !== void 0 ? s.rowState[Je] : S(W[Je]), Ee = (Qe == null || (Y = Qe.cellState) == null ? void 0 : Y[$e]) !== void 0 ? Qe.cellState[$e] : G((ne = W[Je]) == null || (me = ne.cells) == null ? void 0 : me.find(function(Ye) {
            return Ye.column.id === $e;
          }));
          return a({}, s, { rowState: a({}, s.rowState, (Ie = {}, Ie[Je] = a({}, Qe, { cellState: a({}, Qe.cellState || {}, (xe = {}, xe[$e] = $(le, Ee), xe)) }), Ie)) });
        }
      }
      function pa(s) {
        var g = s.autoResetRowState, y = g === void 0 || g, b = s.data, E = s.dispatch, S = r.useCallback(function(W, U) {
          return E({ type: c.setRowState, rowId: W, value: U });
        }, [E]), A = r.useCallback(function(W, U, se) {
          return E({ type: c.setCellState, rowId: W, columnId: U, value: se });
        }, [E]), G = N(y);
        M(function() {
          G() && E({ type: c.resetRowState });
        }, [b]), Object.assign(s, { setRowState: S, setCellState: A });
      }
      function ls(s, g) {
        var y = g.instance, b = y.initialRowStateAccessor, E = b === void 0 ? da : b, S = y.initialCellStateAccessor, A = S === void 0 ? ha : S, G = y.state.rowState;
        s && (s.state = G[s.id] !== void 0 ? G[s.id] : E(s), s.setState = function(W) {
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
        }), s.visibleColumns.push(ma), s.useInstance.push(cs);
      };
      function ga(s, g, y, b) {
        return g.type === c.init ? a({ columnOrder: [] }, s) : g.type === c.resetColumnOrder ? a({}, s, { columnOrder: b.initialState.columnOrder || [] }) : g.type === c.setColumnOrder ? a({}, s, { columnOrder: $(g.columnOrder, s.columnOrder) }) : void 0;
      }
      function ma(s, g) {
        var y = g.instance.state.columnOrder;
        if (!y || !y.length)
          return s;
        for (var b = [].concat(y), E = [].concat(s), S = [], A = function() {
          var G = b.shift(), W = E.findIndex(function(U) {
            return U.id === G;
          });
          W > -1 && S.push(E.splice(W, 1)[0]);
        }; E.length && b.length; )
          A();
        return [].concat(S, E);
      }
      function cs(s) {
        var g = s.dispatch;
        s.setColumnOrder = r.useCallback(function(y) {
          return g({ type: c.setColumnOrder, columnOrder: y });
        }, [g]);
      }
      va.pluginName = "useColumnOrder", w.canResize = !0, c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize";
      var ya = function(s) {
        s.getResizerProps = [fs], s.getHeaderProps.push({ style: { position: "relative" } }), s.stateReducers.push(ds), s.useInstance.push(ps), s.useInstanceBeforeDimensions.push(hs);
      }, fs = function(s, g) {
        var y = g.instance, b = g.header, E = y.dispatch, S = function(A, G) {
          var W = !1;
          if (A.type === "touchstart") {
            if (A.touches && A.touches.length > 1)
              return;
            W = !0;
          }
          var U, se, ie = function($e) {
            var le = [];
            return function Qe(Ee) {
              Ee.columns && Ee.columns.length && Ee.columns.map(Qe), le.push(Ee);
            }($e), le;
          }(G).map(function($e) {
            return [$e.id, $e.totalWidth];
          }), oe = W ? Math.round(A.touches[0].clientX) : A.clientX, Y = function() {
            window.cancelAnimationFrame(U), U = null, E({ type: c.columnDoneResizing });
          }, ne = function() {
            window.cancelAnimationFrame(U), U = null, E({ type: c.columnResizing, clientX: se });
          }, me = function($e) {
            se = $e, U || (U = window.requestAnimationFrame(ne));
          }, xe = { mouse: { moveEvent: "mousemove", moveHandler: function($e) {
            return me($e.clientX);
          }, upEvent: "mouseup", upHandler: function($e) {
            document.removeEventListener("mousemove", xe.mouse.moveHandler), document.removeEventListener("mouseup", xe.mouse.upHandler), Y();
          } }, touch: { moveEvent: "touchmove", moveHandler: function($e) {
            return $e.cancelable && ($e.preventDefault(), $e.stopPropagation()), me($e.touches[0].clientX), !1;
          }, upEvent: "touchend", upHandler: function($e) {
            document.removeEventListener(xe.touch.moveEvent, xe.touch.moveHandler), document.removeEventListener(xe.touch.upEvent, xe.touch.moveHandler), Y();
          } } }, Ie = W ? xe.touch : xe.mouse, Je = !!function() {
            if (typeof ue == "boolean")
              return ue;
            var $e = !1;
            try {
              var le = { get passive() {
                return $e = !0, !1;
              } };
              window.addEventListener("test", null, le), window.removeEventListener("test", null, le);
            } catch {
              $e = !1;
            }
            return ue = $e;
          }() && { passive: !1 };
          document.addEventListener(Ie.moveEvent, Ie.moveHandler, Je), document.addEventListener(Ie.upEvent, Ie.upHandler, Je), E({ type: c.columnStartResizing, columnId: G.id, columnWidth: G.totalWidth, headerIdWidths: ie, clientX: oe });
        };
        return [s, { onMouseDown: function(A) {
          return A.persist() || S(A, b);
        }, onTouchStart: function(A) {
          return A.persist() || S(A, b);
        }, style: { cursor: "col-resize" }, draggable: !1, role: "separator" }];
      };
      function ds(s, g) {
        if (g.type === c.init)
          return a({ columnResizing: { columnWidths: {} } }, s);
        if (g.type === c.resetResize)
          return a({}, s, { columnResizing: { columnWidths: {} } });
        if (g.type === c.columnStartResizing) {
          var y = g.clientX, b = g.columnId, E = g.columnWidth, S = g.headerIdWidths;
          return a({}, s, { columnResizing: a({}, s.columnResizing, { startX: y, headerIdWidths: S, columnWidth: E, isResizingColumn: b }) });
        }
        if (g.type === c.columnResizing) {
          var A = g.clientX, G = s.columnResizing, W = G.startX, U = G.columnWidth, se = G.headerIdWidths, ie = (A - W) / U, oe = {};
          return (se === void 0 ? [] : se).forEach(function(Y) {
            var ne = Y[0], me = Y[1];
            oe[ne] = Math.max(me + me * ie, 0);
          }), a({}, s, { columnResizing: a({}, s.columnResizing, { columnWidths: a({}, s.columnResizing.columnWidths, {}, oe) }) });
        }
        return g.type === c.columnDoneResizing ? a({}, s, { columnResizing: a({}, s.columnResizing, { startX: null, isResizingColumn: null }) }) : void 0;
      }
      ya.pluginName = "useResizeColumns";
      var hs = function(s) {
        var g = s.flatHeaders, y = s.disableResizing, b = s.getHooks, E = s.state.columnResizing, S = N(s);
        g.forEach(function(A) {
          var G = Oe(A.disableResizing !== !0 && void 0, y !== !0 && void 0, !0);
          A.canResize = G, A.width = E.columnWidths[A.id] || A.originalWidth || A.width, A.isResizing = E.isResizingColumn === A.id, G && (A.getResizerProps = _(b().getResizerProps, { instance: S(), header: A }));
        });
      };
      function ps(s) {
        var g = s.plugins, y = s.dispatch, b = s.autoResetResize, E = b === void 0 || b, S = s.columns;
        k(g, ["useAbsoluteLayout"], "useResizeColumns");
        var A = N(E);
        M(function() {
          A() && y({ type: c.resetResize });
        }, [S]);
        var G = r.useCallback(function() {
          return y({ type: c.resetResize });
        }, [y]);
        Object.assign(s, { resetResizing: G });
      }
      var Ki = { position: "absolute", top: 0 }, ba = function(s) {
        s.getTableBodyProps.push(pi), s.getRowProps.push(pi), s.getHeaderGroupProps.push(pi), s.getFooterGroupProps.push(pi), s.getHeaderProps.push(function(g, y) {
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
      var pi = function(s, g) {
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
        s.getTableProps.push(vs), s.getRowProps.push(eo), s.getHeaderGroupProps.push(eo), s.getFooterGroupProps.push(eo), s.getHeaderProps.push(gs), s.getCellProps.push(ms), s.getFooterProps.push(ys);
      }
      wa.pluginName = "useBlockLayout", Ji.pluginName = "useFlexLayout";
      var vs = function(s, g) {
        return [s, { style: { minWidth: g.instance.totalColumnsMinWidth + "px" } }];
      }, eo = function(s, g) {
        return [s, { style: { display: "flex", flex: "1 0 auto", minWidth: g.instance.totalColumnsMinWidth + "px" } }];
      }, gs = function(s, g) {
        var y = g.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      }, ms = function(s, g) {
        var y = g.cell;
        return [s, { style: { boxSizing: "border-box", flex: y.column.totalFlexWidth + " 0 auto", minWidth: y.column.totalMinWidth + "px", width: y.column.totalWidth + "px" } }];
      }, ys = function(s, g) {
        var y = g.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      };
      function xa(s) {
        s.stateReducers.push(Ca), s.getTableProps.push(_a), s.getHeaderProps.push(Ra), s.getRowProps.push(Sa);
      }
      c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize", xa.pluginName = "useGridLayout";
      var _a = function(s, g) {
        var y = g.instance;
        return [s, { style: { display: "grid", gridTemplateColumns: y.visibleColumns.map(function(b) {
          var E;
          return y.state.gridLayout.columnWidths[b.id] ? y.state.gridLayout.columnWidths[b.id] + "px" : (E = y.state.columnResizing) != null && E.isResizingColumn ? y.state.gridLayout.startWidths[b.id] + "px" : typeof b.width == "number" ? b.width + "px" : b.width;
        }).join(" ") } }];
      }, Ra = function(s, g) {
        var y = g.column;
        return [s, { id: "header-cell-" + y.id, style: { position: "sticky", gridColumn: "span " + y.totalVisibleHeaderCount } }];
      }, Sa = function(s, g) {
        var y = g.row;
        return y.isExpanded ? [s, { style: { gridColumn: "1 / " + (y.cells.length + 1) } }] : [s, {}];
      };
      function Ca(s, g, y, b) {
        if (g.type === c.init)
          return a({ gridLayout: { columnWidths: {} } }, s);
        if (g.type === c.resetResize)
          return a({}, s, { gridLayout: { columnWidths: {} } });
        if (g.type === c.columnStartResizing) {
          var E = g.columnId, S = g.headerIdWidths, A = to(E);
          if (A !== void 0) {
            var G = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = to(Qe.id), Ee));
            }, {}), W = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.minWidth, Ee));
            }, {}), U = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.maxWidth, Ee));
            }, {}), se = S.map(function(le) {
              var Qe = le[0];
              return [Qe, to(Qe)];
            });
            return a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: G, minWidths: W, maxWidths: U, headerIdGridWidths: se, columnWidth: A }) });
          }
          return s;
        }
        if (g.type === c.columnResizing) {
          var ie = g.clientX, oe = s.columnResizing.startX, Y = s.gridLayout, ne = Y.columnWidth, me = Y.minWidths, xe = Y.maxWidths, Ie = Y.headerIdGridWidths, Je = (ie - oe) / ne, $e = {};
          return (Ie === void 0 ? [] : Ie).forEach(function(le) {
            var Qe = le[0], Ee = le[1];
            $e[Qe] = Math.min(Math.max(me[Qe], Ee + Ee * Je), xe[Qe]);
          }), a({}, s, { gridLayout: a({}, s.gridLayout, { columnWidths: a({}, s.gridLayout.columnWidths, {}, $e) }) });
        }
        return g.type === c.columnDoneResizing ? a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: {}, minWidths: {}, maxWidths: {} }) }) : void 0;
      }
      function to(s) {
        var g, y = (g = document.getElementById("header-cell-" + s)) == null ? void 0 : g.offsetWidth;
        if (y !== void 0)
          return y;
      }
      n._UNSTABLE_usePivotColumns = qi, n.actions = c, n.defaultColumn = w, n.defaultGroupByFn = ln, n.defaultOrderByFn = oa, n.defaultRenderer = p, n.emptyRenderer = h, n.ensurePluginOrder = k, n.flexRender = te, n.functionalUpdate = $, n.loopHooks = B, n.makePropGetter = _, n.makeRenderer = D, n.reduceHooks = T, n.safeUseLayoutEffect = L, n.useAbsoluteLayout = ba, n.useAsyncDebounce = function(s, g) {
        g === void 0 && (g = 0);
        var y = r.useRef({}), b = N(s), E = N(g);
        return r.useCallback(function() {
          var S = o(regeneratorRuntime.mark(function A() {
            var G, W, U, se = arguments;
            return regeneratorRuntime.wrap(function(ie) {
              for (; ; )
                switch (ie.prev = ie.next) {
                  case 0:
                    for (G = se.length, W = new Array(G), U = 0; U < G; U++)
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
            return S.apply(this, arguments);
          };
        }(), [b, E]);
      }, n.useBlockLayout = wa, n.useColumnOrder = va, n.useExpanded = ir, n.useFilters = wr, n.useFlexLayout = Ji, n.useGetLatest = N, n.useGlobalFilter = O, n.useGridLayout = xa, n.useGroupBy = rt, n.useMountedLayoutEffect = M, n.usePagination = Vi, n.useResizeColumns = ya, n.useRowSelect = la, n.useRowState = Xi, n.useSortBy = ia, n.useTable = function(s) {
        for (var g = arguments.length, y = new Array(g > 1 ? g - 1 : 0), b = 1; b < g; b++)
          y[b - 1] = arguments[b];
        s = wn(s), y = [gt].concat(y);
        var E = r.useRef({}), S = N(E.current);
        Object.assign(S(), a({}, s, { plugins: y, hooks: F() })), y.filter(Boolean).forEach(function(x) {
          x(S().hooks);
        });
        var A = N(S().hooks);
        S().getHooks = A, delete S().hooks, Object.assign(S(), T(A().useOptions, wn(s)));
        var G = S(), W = G.data, U = G.columns, se = G.initialState, ie = G.defaultColumn, oe = G.getSubRows, Y = G.getRowId, ne = G.stateReducer, me = G.useControlledState, xe = N(ne), Ie = r.useCallback(function(x, I) {
          if (!I.type)
            throw console.info({ action: I }), new Error("Unknown Action \u{1F446}");
          return [].concat(A().stateReducers, Array.isArray(xe()) ? xe() : [xe()]).reduce(function(z, H) {
            return H(z, I, x, S()) || z;
          }, x);
        }, [A, xe, S]), Je = r.useReducer(Ie, void 0, function() {
          return Ie(se, { type: c.init });
        }), $e = Je[0], le = Je[1], Qe = T([].concat(A().useControlledState, [me]), $e, { instance: S() });
        Object.assign(S(), { state: Qe, dispatch: le });
        var Ee = r.useMemo(function() {
          return Q(T(A().columns, U, { instance: S() }));
        }, [A, S, U].concat(T(A().columnsDeps, [], { instance: S() })));
        S().columns = Ee;
        var Ye = r.useMemo(function() {
          return T(A().allColumns, fe(Ee), { instance: S() }).map(ge);
        }, [Ee, A, S].concat(T(A().allColumnsDeps, [], { instance: S() })));
        S().allColumns = Ye;
        var ft = r.useMemo(function() {
          for (var x = [], I = [], z = {}, H = [].concat(Ye); H.length; ) {
            var q = H.shift();
            En({ data: W, rows: x, flatRows: I, rowsById: z, column: q, getRowId: Y, getSubRows: oe, accessValueHooks: A().accessValue, getInstance: S });
          }
          return [x, I, z];
        }, [Ye, W, Y, oe, A, S]), Ge = ft[0], Ve = ft[1], yt = ft[2];
        Object.assign(S(), { rows: Ge, initialRows: [].concat(Ge), flatRows: Ve, rowsById: yt }), B(A().useInstanceAfterData, S());
        var Ke = r.useMemo(function() {
          return T(A().visibleColumns, Ye, { instance: S() }).map(function(x) {
            return re(x, ie);
          });
        }, [A, Ye, S, ie].concat(T(A().visibleColumnsDeps, [], { instance: S() })));
        Ye = r.useMemo(function() {
          var x = [].concat(Ke);
          return Ye.forEach(function(I) {
            x.find(function(z) {
              return z.id === I.id;
            }) || x.push(I);
          }), x;
        }, [Ye, Ke]), S().allColumns = Ye;
        var pt = r.useMemo(function() {
          return T(A().headerGroups, ee(Ke, ie), S());
        }, [A, Ke, ie, S].concat(T(A().headerGroupsDeps, [], { instance: S() })));
        S().headerGroups = pt;
        var l = r.useMemo(function() {
          return pt.length ? pt[0].headers : [];
        }, [pt]);
        S().headers = l, S().flatHeaders = pt.reduce(function(x, I) {
          return [].concat(x, I.headers);
        }, []), B(A().useInstanceBeforeDimensions, S());
        var d = Ke.filter(function(x) {
          return x.isVisible;
        }).map(function(x) {
          return x.id;
        }).sort().join("_");
        Ke = r.useMemo(function() {
          return Ke.filter(function(x) {
            return x.isVisible;
          });
        }, [Ke, d]), S().visibleColumns = Ke;
        var m = qt(l), v = m[0], R = m[1], C = m[2];
        return S().totalColumnsMinWidth = v, S().totalColumnsWidth = R, S().totalColumnsMaxWidth = C, B(A().useInstance, S()), [].concat(S().flatHeaders, S().allColumns).forEach(function(x) {
          x.render = D(S(), x), x.getHeaderProps = _(A().getHeaderProps, { instance: S(), column: x }), x.getFooterProps = _(A().getFooterProps, { instance: S(), column: x });
        }), S().headerGroups = r.useMemo(function() {
          return pt.filter(function(x, I) {
            return x.headers = x.headers.filter(function(z) {
              return z.headers ? function H(q) {
                return q.filter(function(he) {
                  return he.headers ? H(he.headers) : he.isVisible;
                }).length;
              }(z.headers) : z.isVisible;
            }), !!x.headers.length && (x.getHeaderGroupProps = _(A().getHeaderGroupProps, { instance: S(), headerGroup: x, index: I }), x.getFooterGroupProps = _(A().getFooterGroupProps, { instance: S(), headerGroup: x, index: I }), !0);
          });
        }, [pt, S, A]), S().footerGroups = [].concat(S().headerGroups).reverse(), S().prepareRow = r.useCallback(function(x) {
          x.getRowProps = _(A().getRowProps, { instance: S(), row: x }), x.allCells = Ye.map(function(I) {
            var z = x.values[I.id], H = { column: I, row: x, value: z };
            return H.getCellProps = _(A().getCellProps, { instance: S(), cell: H }), H.render = D(S(), I, { row: x, cell: H, value: z }), H;
          }), x.cells = Ke.map(function(I) {
            return x.allCells.find(function(z) {
              return z.column.id === I.id;
            });
          }), B(A().prepareRow, x, { instance: S() });
        }, [A, S, Ye, Ke]), S().getTableProps = _(A().getTableProps, { instance: S() }), S().getTableBodyProps = _(A().getTableBodyProps, { instance: S() }), B(A().useFinalInstance, S()), S();
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(za, za.exports)), za.exports;
}
var La = { exports: {} }, Qh;
function vP() {
  return Qh || (Qh = 1, function(e, t) {
    (function(n, r) {
      r(t, Dn);
    })(xi, function(n, r) {
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      function i(l, d, m, v, R, C, x) {
        try {
          var I = l[C](x), z = I.value;
        } catch (H) {
          m(H);
          return;
        }
        I.done ? d(z) : Promise.resolve(z).then(v, R);
      }
      function o(l) {
        return function() {
          var d = this, m = arguments;
          return new Promise(function(v, R) {
            var C = l.apply(d, m);
            function x(z) {
              i(C, v, R, x, I, "next", z);
            }
            function I(z) {
              i(C, v, R, x, I, "throw", z);
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
        var m = {}, v = Object.keys(l), R, C;
        for (C = 0; C < v.length; C++)
          R = v[C], !(d.indexOf(R) >= 0) && (m[R] = l[R]);
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
      var p = "Renderer Error \u261D\uFE0F", h = {
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
        return d.reduce(function(v, R) {
          var C = R.style, x = R.className, I = u(R, ["style", "className"]);
          return v = a({}, v, {}, I), C && (v.style = v.style ? a({}, v.style || {}, {}, C || {}) : C), x && (v.className = v.className ? v.className + " " + x : x), v.className === "" && delete v.className, v;
        }, {});
      }
      function B(l, d, m) {
        return typeof d == "function" ? B({}, d(l, m)) : Array.isArray(d) ? T.apply(void 0, [l].concat(d)) : T(l, d);
      }
      var k = function(d, m) {
        return m === void 0 && (m = {}), function(v) {
          return v === void 0 && (v = {}), [].concat(d, [v]).reduce(function(R, C) {
            return B(R, C, a({}, m, {
              userProps: v
            }));
          }, {});
        };
      }, $ = function(d, m, v, R) {
        return v === void 0 && (v = {}), d.reduce(function(C, x) {
          var I = x(C, v);
          if (!R && typeof I > "u")
            throw console.info(x), new Error("React Table: A reducer hook \u261D\uFE0F just returned undefined! This is not allowed.");
          return I;
        }, m);
      }, N = function(d, m, v) {
        return v === void 0 && (v = {}), d.forEach(function(R) {
          var C = R(m, v);
          if (typeof C < "u")
            throw console.info(R, C), new Error("React Table: A loop-type hook \u261D\uFE0F just returned a value! This is not allowed.");
        });
      };
      function L(l, d, m, v) {
        if (v)
          throw new Error('Defining plugins in the "after" section of ensurePluginOrder is no longer supported (see plugin ' + m + ")");
        var R = l.findIndex(function(C) {
          return C.pluginName === m;
        });
        if (R === -1)
          throw new Error('The plugin "' + m + `" was not found in the plugin list!
This usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:

  ` + m + ".pluginName = '" + m + `'
`);
        d.forEach(function(C) {
          var x = l.findIndex(function(I) {
            return I.pluginName === C;
          });
          if (x > -1 && x > R)
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
        var m = r.useRef({}), v = D(l), R = D(d);
        return r.useCallback(
          /* @__PURE__ */ function() {
            var C = o(
              /* @__PURE__ */ regeneratorRuntime.mark(function x() {
                var I, z, H, q = arguments;
                return regeneratorRuntime.wrap(function(Z) {
                  for (; ; )
                    switch (Z.prev = Z.next) {
                      case 0:
                        for (I = q.length, z = new Array(I), H = 0; H < I; H++)
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
                          R()
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
          [v, R]
        );
      }
      function ge(l, d, m) {
        return m === void 0 && (m = {}), function(v, R) {
          R === void 0 && (R = {});
          var C = typeof v == "string" ? d[v] : v;
          if (typeof C > "u")
            throw console.info(d), new Error(p);
          return re(C, a({}, l, {
            column: d
          }, m, {}, R));
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
          var R = m.split(".");
          m = function(x) {
            return ue(x, R);
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
        for (var v = [], R = l, C = 0, x = function() {
          return C++;
        }, I = function() {
          var H = {
            headers: []
          }, q = [], he = R.some(function(Z) {
            return Z.parent;
          });
          R.forEach(function(Z) {
            var ae = [].concat(q).reverse()[0], ve;
            if (he) {
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
          }), v.push(H), R = q;
        }; R.length; )
          I();
        return v.reverse();
      }
      var V = /* @__PURE__ */ new Map();
      function ue(l, d, m) {
        if (!d)
          return l;
        var v = typeof d == "function" ? d : JSON.stringify(d), R = V.get(v) || function() {
          var x = gt(d);
          return V.set(v, x), x;
        }(), C;
        try {
          C = R.reduce(function(x, I) {
            return x[I];
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
        var m = [], v = function R(C) {
          C.forEach(function(x) {
            x[d] ? R(x[d]) : m.push(x);
          });
        };
        return v(l), m;
      }
      function Se(l, d) {
        var m = d.manualExpandedKey, v = d.expanded, R = d.expandSubRows, C = R === void 0 ? !0 : R, x = [], I = function z(H, q) {
          q === void 0 && (q = !0), H.isExpanded = H.original && H.original[m] || v[H.id], H.canExpand = H.subRows && !!H.subRows.length, q && x.push(H), H.subRows && H.subRows.length && H.isExpanded && H.subRows.forEach(function(he) {
            return z(he, C);
          });
        };
        return l.forEach(function(z) {
          return I(z);
        }), x;
      }
      function Ne(l, d, m) {
        return Ae(l) || d[l] || m[l] || m.text;
      }
      function Fe(l, d, m) {
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
      var je = /\[/g, F = /\]/g;
      function gt(l) {
        return ct(l).map(function(d) {
          return String(d).replace(".", "_");
        }).join(".").replace(je, ".").replace(F, "").split(".");
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
      }, mn = function(d, m) {
        var v = m.index;
        return a({
          key: "headerGroup_" + v,
          role: "row"
        }, d);
      }, yn = function(d, m) {
        var v = m.index;
        return a({
          key: "footerGroup_" + v
        }, d);
      }, bn = function(d, m) {
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
          getHeaderGroupProps: [mn],
          getFooterGroupProps: [yn],
          getHeaderProps: [Qt],
          getFooterProps: [un],
          getRowProps: [bn],
          getCellProps: [zn],
          useFinalInstance: []
        };
      }
      h.resetHiddenColumns = "resetHiddenColumns", h.toggleHideColumn = "toggleHideColumn", h.setHiddenColumns = "setHiddenColumns", h.toggleHideAllColumns = "toggleHideAllColumns";
      var Ln = function(d) {
        d.getToggleHiddenProps = [wn], d.getToggleHideAllColumnsProps = [qt], d.stateReducers.push(En), d.useInstanceBeforeDimensions.push(ir), d.headerGroupsDeps.push(function(m, v) {
          var R = v.instance;
          return [].concat(m, [R.state.hiddenColumns]);
        }), d.useInstance.push(mr);
      };
      Ln.pluginName = "useColumnVisibility";
      var wn = function(d, m) {
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
      function En(l, d, m, v) {
        if (d.type === h.init)
          return a({
            hiddenColumns: []
          }, l);
        if (d.type === h.resetHiddenColumns)
          return a({}, l, {
            hiddenColumns: v.initialState.hiddenColumns || []
          });
        if (d.type === h.toggleHideColumn) {
          var R = typeof d.value < "u" ? d.value : !l.hiddenColumns.includes(d.columnId), C = R ? [].concat(l.hiddenColumns, [d.columnId]) : l.hiddenColumns.filter(function(I) {
            return I !== d.columnId;
          });
          return a({}, l, {
            hiddenColumns: C
          });
        }
        if (d.type === h.setHiddenColumns)
          return a({}, l, {
            hiddenColumns: M(d.value, l.hiddenColumns)
          });
        if (d.type === h.toggleHideAllColumns) {
          var x = typeof d.value < "u" ? d.value : !l.hiddenColumns.length;
          return a({}, l, {
            hiddenColumns: x ? v.allColumns.map(function(I) {
              return I.id;
            }) : []
          });
        }
      }
      function ir(l) {
        var d = l.headers, m = l.state.hiddenColumns, v = r.useRef(!1);
        v.current;
        var R = function x(I, z) {
          I.isVisible = z && !m.includes(I.id);
          var H = 0;
          return I.headers && I.headers.length ? I.headers.forEach(function(q) {
            return H += x(q, I.isVisible);
          }) : H = I.isVisible ? 1 : 0, I.totalVisibleHeaderCount = H, H;
        }, C = 0;
        d.forEach(function(x) {
          return C += R(x, !0);
        });
      }
      function mr(l) {
        var d = l.columns, m = l.flatHeaders, v = l.dispatch, R = l.allColumns, C = l.getHooks, x = l.state.hiddenColumns, I = l.autoResetHiddenColumns, z = I === void 0 ? !0 : I, H = D(l), q = R.length === x.length, he = r.useCallback(function(Pe, De) {
          return v({
            type: h.toggleHideColumn,
            columnId: Pe,
            value: De
          });
        }, [v]), Z = r.useCallback(function(Pe) {
          return v({
            type: h.setHiddenColumns,
            value: Pe
          });
        }, [v]), ae = r.useCallback(function(Pe) {
          return v({
            type: h.toggleHideAllColumns,
            value: Pe
          });
        }, [v]), ve = k(C().getToggleHideAllColumnsProps, {
          instance: H()
        });
        m.forEach(function(Pe) {
          Pe.toggleHidden = function(De) {
            v({
              type: h.toggleHideColumn,
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
            type: h.resetHiddenColumns
          });
        }, [v, d]), Object.assign(l, {
          allColumnsHidden: q,
          toggleHideColumn: he,
          setHiddenColumns: Z,
          toggleHideAllColumns: ae,
          getToggleHideAllColumnsProps: ve
        });
      }
      var yr = {}, or = {}, br = function(d, m, v) {
        return d;
      }, jn = function(d, m) {
        return d.subRows || [];
      }, Gn = function(d, m, v) {
        return "" + (v ? [v.id, m].join(".") : m);
      }, sn = function(d) {
        return d;
      };
      function xn(l) {
        var d = l.initialState, m = d === void 0 ? yr : d, v = l.defaultColumn, R = v === void 0 ? or : v, C = l.getSubRows, x = C === void 0 ? jn : C, I = l.getRowId, z = I === void 0 ? Gn : I, H = l.stateReducer, q = H === void 0 ? br : H, he = l.useControlledState, Z = he === void 0 ? sn : he, ae = u(l, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]);
        return a({}, ae, {
          initialState: m,
          defaultColumn: R,
          getSubRows: x,
          getRowId: z,
          stateReducer: q,
          useControlledState: Z
        });
      }
      var Mn = function(d) {
        for (var m = arguments.length, v = new Array(m > 1 ? m - 1 : 0), R = 1; R < m; R++)
          v[R - 1] = arguments[R];
        d = xn(d), v = [Ln].concat(v);
        var C = r.useRef({}), x = D(C.current);
        Object.assign(x(), a({}, d, {
          plugins: v,
          hooks: rr()
        })), v.filter(Boolean).forEach(function(He) {
          He(x().hooks);
        });
        var I = D(x().hooks);
        x().getHooks = I, delete x().hooks, Object.assign(x(), $(I().useOptions, xn(d)));
        var z = x(), H = z.data, q = z.columns, he = z.initialState, Z = z.defaultColumn, ae = z.getSubRows, ve = z.getRowId, K = z.stateReducer, Pe = z.useControlledState, De = D(K), We = r.useCallback(function(He, Nt) {
          if (!Nt.type)
            throw console.info({
              action: Nt
            }), new Error("Unknown Action \u{1F446}");
          return [].concat(I().stateReducers, Array.isArray(De()) ? De() : [De()]).reduce(function(Bt, nn) {
            return nn(Bt, Nt, He, x()) || Bt;
          }, He);
        }, [I, De, x]), we = r.useReducer(We, void 0, function() {
          return We(he, {
            type: h.init
          });
        }), Ze = we[0], it = we[1], _e = $([].concat(I().useControlledState, [Pe]), Ze, {
          instance: x()
        });
        Object.assign(x(), {
          state: _e,
          dispatch: it
        });
        var ye = r.useMemo(function() {
          return ut($(I().columns, q, {
            instance: x()
          }));
        }, [I, x, q].concat($(I().columnsDeps, [], {
          instance: x()
        })));
        x().columns = ye;
        var Re = r.useMemo(function() {
          return $(I().allColumns, Ue(ye), {
            instance: x()
          }).map(st);
        }, [ye, I, x].concat($(I().allColumnsDeps, [], {
          instance: x()
        })));
        x().allColumns = Re;
        var Be = r.useMemo(function() {
          for (var He = [], Nt = [], Bt = {}, nn = [].concat(Re); nn.length; ) {
            var Dt = nn.shift();
            ar({
              data: H,
              rows: He,
              flatRows: Nt,
              rowsById: Bt,
              column: Dt,
              getRowId: ve,
              getSubRows: ae,
              accessValueHooks: I().accessValue,
              getInstance: x
            });
          }
          return [He, Nt, Bt];
        }, [Re, H, ve, ae, I, x]), et = Be[0], tt = Be[1], Rt = Be[2];
        Object.assign(x(), {
          rows: et,
          initialRows: [].concat(et),
          flatRows: tt,
          rowsById: Rt
        }), N(I().useInstanceAfterData, x());
        var Me = r.useMemo(function() {
          return $(I().visibleColumns, Re, {
            instance: x()
          }).map(function(He) {
            return lt(He, Z);
          });
        }, [I, Re, x, Z].concat($(I().visibleColumnsDeps, [], {
          instance: x()
        })));
        Re = r.useMemo(function() {
          var He = [].concat(Me);
          return Re.forEach(function(Nt) {
            He.find(function(Bt) {
              return Bt.id === Nt.id;
            }) || He.push(Nt);
          }), He;
        }, [Re, Me]), x().allColumns = Re;
        {
          var Ft = Re.filter(function(He, Nt) {
            return Re.findIndex(function(Bt) {
              return Bt.id === He.id;
            }) !== Nt;
          });
          if (Ft.length)
            throw console.info(Re), new Error('Duplicate columns were found with ids: "' + Ft.map(function(He) {
              return He.id;
            }).join(", ") + '" in the columns array above');
        }
        var nt = r.useMemo(function() {
          return $(I().headerGroups, dt(Me, Z), x());
        }, [I, Me, Z, x].concat($(I().headerGroupsDeps, [], {
          instance: x()
        })));
        x().headerGroups = nt;
        var qe = r.useMemo(function() {
          return nt.length ? nt[0].headers : [];
        }, [nt]);
        x().headers = qe, x().flatHeaders = nt.reduce(function(He, Nt) {
          return [].concat(He, Nt.headers);
        }, []), N(I().useInstanceBeforeDimensions, x());
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
        var Tt = On(qe), jt = Tt[0], Vr = Tt[1], no = Tt[2];
        return x().totalColumnsMinWidth = jt, x().totalColumnsWidth = Vr, x().totalColumnsMaxWidth = no, N(I().useInstance, x()), [].concat(x().flatHeaders, x().allColumns).forEach(function(He) {
          He.render = ge(x(), He), He.getHeaderProps = k(I().getHeaderProps, {
            instance: x(),
            column: He
          }), He.getFooterProps = k(I().getFooterProps, {
            instance: x(),
            column: He
          });
        }), x().headerGroups = r.useMemo(function() {
          return nt.filter(function(He, Nt) {
            return He.headers = He.headers.filter(function(Bt) {
              var nn = function Dt(xr) {
                return xr.filter(function(Xt) {
                  return Xt.headers ? Dt(Xt.headers) : Xt.isVisible;
                }).length;
              };
              return Bt.headers ? nn(Bt.headers) : Bt.isVisible;
            }), He.headers.length ? (He.getHeaderGroupProps = k(I().getHeaderGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Nt
            }), He.getFooterGroupProps = k(I().getFooterGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Nt
            }), !0) : !1;
          });
        }, [nt, x, I]), x().footerGroups = [].concat(x().headerGroups).reverse(), x().prepareRow = r.useCallback(function(He) {
          He.getRowProps = k(I().getRowProps, {
            instance: x(),
            row: He
          }), He.allCells = Re.map(function(Nt) {
            var Bt = He.values[Nt.id], nn = {
              column: Nt,
              row: He,
              value: Bt
            };
            return nn.getCellProps = k(I().getCellProps, {
              instance: x(),
              cell: nn
            }), nn.render = ge(x(), Nt, {
              row: He,
              cell: nn,
              value: Bt
            }), nn;
          }), He.cells = Me.map(function(Nt) {
            return He.allCells.find(function(Bt) {
              return Bt.column.id === Nt.id;
            });
          }), N(I().prepareRow, He, {
            instance: x()
          });
        }, [I, x, Re, Me]), x().getTableProps = k(I().getTableProps, {
          instance: x()
        }), x().getTableBodyProps = k(I().getTableBodyProps, {
          instance: x()
        }), N(I().useFinalInstance, x()), x();
      };
      function On(l, d) {
        d === void 0 && (d = 0);
        var m = 0, v = 0, R = 0, C = 0;
        return l.forEach(function(x) {
          var I = x.headers;
          if (x.totalLeft = d, I && I.length) {
            var z = On(I, d), H = z[0], q = z[1], he = z[2], Z = z[3];
            x.totalMinWidth = H, x.totalWidth = q, x.totalMaxWidth = he, x.totalFlexWidth = Z;
          } else
            x.totalMinWidth = x.minWidth, x.totalWidth = Math.min(Math.max(x.minWidth, x.width), x.maxWidth), x.totalMaxWidth = x.maxWidth, x.totalFlexWidth = x.canResize ? x.totalWidth : 0;
          x.isVisible && (d += x.totalWidth, m += x.totalMinWidth, v += x.totalWidth, R += x.totalMaxWidth, C += x.totalFlexWidth);
        }), [m, v, R, C];
      }
      function ar(l) {
        var d = l.data, m = l.rows, v = l.flatRows, R = l.rowsById, C = l.column, x = l.getRowId, I = l.getSubRows, z = l.accessValueHooks, H = l.getInstance, q = function he(Z, ae, ve, K, Pe) {
          ve === void 0 && (ve = 0);
          var De = Z, We = x(Z, ae, K), we = R[We];
          if (we)
            we.subRows && we.originalSubRows.forEach(function(it, _e) {
              return he(it, _e, ve + 1, we);
            });
          else if (we = {
            id: We,
            original: De,
            index: ae,
            depth: ve,
            cells: [{}]
          }, we.cells.map = Le, we.cells.filter = Le, we.cells.forEach = Le, we.cells[0].getCellProps = Le, we.values = {}, Pe.push(we), v.push(we), R[We] = we, we.originalSubRows = I(Z, ae), we.originalSubRows) {
            var Ze = [];
            we.originalSubRows.forEach(function(it, _e) {
              return he(it, _e, ve + 1, we, Ze);
            }), we.subRows = Ze;
          }
          C.accessor && (we.values[C.id] = C.accessor(Z, ae, we, Pe, d)), we.values[C.id] = $(z, we.values[C.id], {
            row: we,
            column: C,
            instance: H()
          }, !0);
        };
        d.forEach(function(he, Z) {
          return q(he, Z, 0, void 0, m);
        });
      }
      h.resetExpanded = "resetExpanded", h.toggleRowExpanded = "toggleRowExpanded", h.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var An = function(d) {
        d.getToggleAllRowsExpandedProps = [ur], d.getToggleRowExpandedProps = [Hn], d.stateReducers.push(Wn), d.useInstance.push(_n), d.prepareRow.push(wr);
      };
      An.pluginName = "useExpanded";
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
        if (d.type === h.init)
          return a({
            expanded: {}
          }, l);
        if (d.type === h.resetExpanded)
          return a({}, l, {
            expanded: v.initialState.expanded || {}
          });
        if (d.type === h.toggleAllRowsExpanded) {
          var R = d.value, C = v.rowsById, x = Object.keys(C).length === Object.keys(l.expanded).length, I = typeof R < "u" ? R : !x;
          if (I) {
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
        if (d.type === h.toggleRowExpanded) {
          var H = d.id, q = d.value, he = l.expanded[H], Z = typeof q < "u" ? q : !he;
          if (!he && Z) {
            var ae;
            return a({}, l, {
              expanded: a({}, l.expanded, (ae = {}, ae[H] = !0, ae))
            });
          } else if (he && !Z) {
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
      function _n(l) {
        var d = l.data, m = l.rows, v = l.rowsById, R = l.manualExpandedKey, C = R === void 0 ? "expanded" : R, x = l.paginateExpandedRows, I = x === void 0 ? !0 : x, z = l.expandSubRows, H = z === void 0 ? !0 : z, q = l.autoResetExpanded, he = q === void 0 ? !0 : q, Z = l.getHooks, ae = l.plugins, ve = l.state.expanded, K = l.dispatch;
        L(ae, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var Pe = D(he), De = Boolean(Object.keys(v).length && Object.keys(ve).length);
        De && Object.keys(v).some(function(Re) {
          return !ve[Re];
        }) && (De = !1), Q(function() {
          Pe() && K({
            type: h.resetExpanded
          });
        }, [K, d]);
        var We = r.useCallback(function(Re, Be) {
          K({
            type: h.toggleRowExpanded,
            id: Re,
            value: Be
          });
        }, [K]), we = r.useCallback(function(Re) {
          return K({
            type: h.toggleAllRowsExpanded,
            value: Re
          });
        }, [K]), Ze = r.useMemo(function() {
          return I ? Se(m, {
            manualExpandedKey: C,
            expanded: ve,
            expandSubRows: H
          }) : m;
        }, [I, m, C, ve, H]), it = r.useMemo(function() {
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
        l.toggleRowExpanded = function(R) {
          return v.toggleRowExpanded(l.id, R);
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
        return d = d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return String(x).toLowerCase().includes(String(v).toLowerCase());
          });
        }), d;
      };
      Yt.autoRemove = function(l) {
        return !l;
      };
      var O = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x !== void 0 ? String(x).toLowerCase() === String(v).toLowerCase() : !0;
          });
        });
      };
      O.autoRemove = function(l) {
        return !l;
      };
      var J = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x !== void 0 ? String(x) === String(v) : !0;
          });
        });
      };
      J.autoRemove = function(l) {
        return !l;
      };
      var pe = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x.includes(v);
          });
        });
      };
      pe.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ze = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x && x.length && v.every(function(I) {
              return x.includes(I);
            });
          });
        });
      };
      ze.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ht = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x && x.length && v.some(function(I) {
              return x.includes(I);
            });
          });
        });
      };
      ht.autoRemove = function(l) {
        return !l || !l.length;
      };
      var mt = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return v.includes(x);
          });
        });
      };
      mt.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ot = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x === v;
          });
        });
      };
      ot.autoRemove = function(l) {
        return typeof l > "u";
      };
      var rt = function(d, m, v) {
        return d.filter(function(R) {
          return m.some(function(C) {
            var x = R.values[C];
            return x == v;
          });
        });
      };
      rt.autoRemove = function(l) {
        return l == null;
      };
      var At = function(d, m, v) {
        var R = v || [], C = R[0], x = R[1];
        if (C = typeof C == "number" ? C : -1 / 0, x = typeof x == "number" ? x : 1 / 0, C > x) {
          var I = C;
          C = x, x = I;
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
        includes: pe,
        includesAll: ze,
        includesSome: ht,
        includesValue: mt,
        exact: ot,
        equals: rt,
        between: At
      });
      h.resetFilters = "resetFilters", h.setFilter = "setFilter", h.setAllFilters = "setAllFilters";
      var Et = function(d) {
        d.stateReducers.push(hn), d.useInstance.push(Un);
      };
      Et.pluginName = "useFilters";
      function hn(l, d, m, v) {
        if (d.type === h.init)
          return a({
            filters: []
          }, l);
        if (d.type === h.resetFilters)
          return a({}, l, {
            filters: v.initialState.filters || []
          });
        if (d.type === h.setFilter) {
          var R = d.columnId, C = d.filterValue, x = v.allColumns, I = v.filterTypes, z = x.find(function(K) {
            return K.id === R;
          });
          if (!z)
            throw new Error("React-Table: Could not find a column with id: " + R);
          var H = Ne(z.filter, I || {}, Pt), q = l.filters.find(function(K) {
            return K.id === R;
          }), he = M(C, q && q.value);
          return Fe(H.autoRemove, he, z) ? a({}, l, {
            filters: l.filters.filter(function(K) {
              return K.id !== R;
            })
          }) : q ? a({}, l, {
            filters: l.filters.map(function(K) {
              return K.id === R ? {
                id: R,
                value: he
              } : K;
            })
          }) : a({}, l, {
            filters: [].concat(l.filters, [{
              id: R,
              value: he
            }])
          });
        }
        if (d.type === h.setAllFilters) {
          var Z = d.filters, ae = v.allColumns, ve = v.filterTypes;
          return a({}, l, {
            filters: M(Z, l.filters).filter(function(K) {
              var Pe = ae.find(function(We) {
                return We.id === K.id;
              }), De = Ne(Pe.filter, ve || {}, Pt);
              return !Fe(De.autoRemove, K.value, Pe);
            })
          });
        }
      }
      function Un(l) {
        var d = l.data, m = l.rows, v = l.flatRows, R = l.rowsById, C = l.allColumns, x = l.filterTypes, I = l.manualFilters, z = l.defaultCanFilter, H = z === void 0 ? !1 : z, q = l.disableFilters, he = l.state.filters, Z = l.dispatch, ae = l.autoResetFilters, ve = ae === void 0 ? !0 : ae, K = r.useCallback(function(_e, ye) {
          Z({
            type: h.setFilter,
            columnId: _e,
            filterValue: ye
          });
        }, [Z]), Pe = r.useCallback(function(_e) {
          Z({
            type: h.setAllFilters,
            filters: _e
          });
        }, [Z]);
        C.forEach(function(_e) {
          var ye = _e.id, Re = _e.accessor, Be = _e.defaultCanFilter, et = _e.disableFilters;
          _e.canFilter = Re ? Te(et === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(Be, H, !1), _e.setFilter = function(Rt) {
            return K(_e.id, Rt);
          };
          var tt = he.find(function(Rt) {
            return Rt.id === ye;
          });
          _e.filterValue = tt && tt.value;
        });
        var De = r.useMemo(function() {
          if (I || !he.length)
            return [m, v, R];
          var _e = [], ye = {}, Re = function Be(et, tt) {
            tt === void 0 && (tt = 0);
            var Rt = et;
            return Rt = he.reduce(function(Me, Ft) {
              var nt = Ft.id, qe = Ft.value, Xe = C.find(function(jt) {
                return jt.id === nt;
              });
              if (!Xe)
                return Me;
              tt === 0 && (Xe.preFilteredRows = Me);
              var Tt = Ne(Xe.filter, x || {}, Pt);
              return Tt ? (Xe.filteredRows = Tt(Me, [nt], qe), Xe.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + Xe.id + "."), Me);
            }, et), Rt.forEach(function(Me) {
              _e.push(Me), ye[Me.id] = Me, Me.subRows && (Me.subRows = Me.subRows && Me.subRows.length > 0 ? Be(Me.subRows, tt + 1) : Me.subRows);
            }), Rt;
          };
          return [Re(m), _e, ye];
        }, [I, he, m, v, R, C, x]), We = De[0], we = De[1], Ze = De[2];
        r.useMemo(function() {
          var _e = C.filter(function(ye) {
            return !he.find(function(Re) {
              return Re.id === ye.id;
            });
          });
          _e.forEach(function(ye) {
            ye.preFilteredRows = We, ye.filteredRows = We;
          });
        }, [We, he, C]);
        var it = D(ve);
        Q(function() {
          it() && Z({
            type: h.resetFilters
          });
        }, [Z, I ? null : d]), Object.assign(l, {
          preFilteredRows: m,
          preFilteredFlatRows: v,
          preFilteredRowsById: R,
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
      h.resetGlobalFilter = "resetGlobalFilter", h.setGlobalFilter = "setGlobalFilter";
      var Hr = function(d) {
        d.stateReducers.push(ln), d.useInstance.push(na);
      };
      Hr.pluginName = "useGlobalFilter";
      function ln(l, d, m, v) {
        if (d.type === h.resetGlobalFilter)
          return a({}, l, {
            globalFilter: v.initialState.globalFilter || void 0
          });
        if (d.type === h.setGlobalFilter) {
          var R = d.filterValue, C = v.userFilterTypes, x = Ne(v.globalFilter, C || {}, Pt), I = M(R, l.globalFilter);
          if (Fe(x.autoRemove, I)) {
            l.globalFilter;
            var z = u(l, ["globalFilter"]);
            return z;
          }
          return a({}, l, {
            globalFilter: I
          });
        }
      }
      function na(l) {
        var d = l.data, m = l.rows, v = l.flatRows, R = l.rowsById, C = l.allColumns, x = l.filterTypes, I = l.globalFilter, z = l.manualGlobalFilter, H = l.state.globalFilter, q = l.dispatch, he = l.autoResetGlobalFilter, Z = he === void 0 ? !0 : he, ae = l.disableGlobalFilter, ve = r.useCallback(function(Ze) {
          q({
            type: h.setGlobalFilter,
            filterValue: Ze
          });
        }, [q]), K = r.useMemo(function() {
          if (z || typeof H > "u")
            return [m, v, R];
          var Ze = [], it = {}, _e = Ne(I, x || {}, Pt);
          if (!_e)
            return console.warn("Could not find a valid 'globalFilter' option."), m;
          C.forEach(function(Be) {
            var et = Be.disableGlobalFilter;
            Be.canFilter = Te(et === !0 ? !1 : void 0, ae === !0 ? !1 : void 0, !0);
          });
          var ye = C.filter(function(Be) {
            return Be.canFilter === !0;
          }), Re = function Be(et) {
            return et = _e(et, ye.map(function(tt) {
              return tt.id;
            }), H), et.forEach(function(tt) {
              Ze.push(tt), it[tt.id] = tt, tt.subRows = tt.subRows && tt.subRows.length ? Be(tt.subRows) : tt.subRows;
            }), et;
          };
          return [Re(m), Ze, it];
        }, [z, H, I, x, C, m, v, R, ae]), Pe = K[0], De = K[1], We = K[2], we = D(Z);
        Q(function() {
          we() && q({
            type: h.resetGlobalFilter
          });
        }, [q, z ? null : d]), Object.assign(l, {
          preGlobalFilteredRows: m,
          preGlobalFilteredFlatRows: v,
          preGlobalFilteredRowsById: R,
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
      function Uu(l) {
        var d = l[0] || 0, m = l[0] || 0;
        return l.forEach(function(v) {
          typeof v == "number" && (d = Math.min(d, v), m = Math.max(m, v));
        }), d + ".." + m;
      }
      function ia(l) {
        return hi(null, l) / l.length;
      }
      function Vu(l) {
        if (!l.length)
          return null;
        var d = Math.floor(l.length / 2), m = [].concat(l).sort(function(v, R) {
          return v - R;
        });
        return l.length % 2 !== 0 ? m[d] : (m[d - 1] + m[d]) / 2;
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
      var Vi = /* @__PURE__ */ Object.freeze({
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
      h.resetGroupBy = "resetGroupBy", h.setGroupBy = "setGroupBy", h.toggleGroupBy = "toggleGroupBy";
      var qi = function(d) {
        d.getGroupByToggleProps = [aa], d.stateReducers.push(Qu), d.visibleColumnsDeps.push(function(m, v) {
          var R = v.instance;
          return [].concat(m, [R.state.groupBy]);
        }), d.visibleColumns.push(Zu), d.useInstance.push(es), d.prepareRow.push(ts);
      };
      qi.pluginName = "useGroupBy";
      var aa = function(d, m) {
        var v = m.header;
        return [d, {
          onClick: v.canGroupBy ? function(R) {
            R.persist(), v.toggleGroupBy();
          } : void 0,
          style: {
            cursor: v.canGroupBy ? "pointer" : void 0
          },
          title: "Toggle GroupBy"
        }];
      };
      function Qu(l, d, m, v) {
        if (d.type === h.init)
          return a({
            groupBy: []
          }, l);
        if (d.type === h.resetGroupBy)
          return a({}, l, {
            groupBy: v.initialState.groupBy || []
          });
        if (d.type === h.setGroupBy) {
          var R = d.value;
          return a({}, l, {
            groupBy: R
          });
        }
        if (d.type === h.toggleGroupBy) {
          var C = d.columnId, x = d.value, I = typeof x < "u" ? x : !l.groupBy.includes(C);
          return I ? a({}, l, {
            groupBy: [].concat(l.groupBy, [C])
          }) : a({}, l, {
            groupBy: l.groupBy.filter(function(z) {
              return z !== C;
            })
          });
        }
      }
      function Zu(l, d) {
        var m = d.instance.state.groupBy, v = m.map(function(C) {
          return l.find(function(x) {
            return x.id === C;
          });
        }).filter(Boolean), R = l.filter(function(C) {
          return !m.includes(C.id);
        });
        return l = [].concat(v, R), l.forEach(function(C) {
          C.isGrouped = m.includes(C.id), C.groupedIndex = m.indexOf(C.id);
        }), l;
      }
      var Ju = {};
      function es(l) {
        var d = l.data, m = l.rows, v = l.flatRows, R = l.rowsById, C = l.allColumns, x = l.flatHeaders, I = l.groupByFn, z = I === void 0 ? ua : I, H = l.manualGroupBy, q = l.aggregations, he = q === void 0 ? Ju : q, Z = l.plugins, ae = l.state.groupBy, ve = l.dispatch, K = l.autoResetGroupBy, Pe = K === void 0 ? !0 : K, De = l.disableGroupBy, We = l.defaultCanGroupBy, we = l.getHooks;
        L(Z, ["useColumnOrder", "useFilters"], "useGroupBy");
        var Ze = D(l);
        C.forEach(function(qe) {
          var Xe = qe.accessor, Tt = qe.defaultGroupBy, jt = qe.disableGroupBy;
          qe.canGroupBy = Xe ? Te(qe.canGroupBy, jt === !0 ? !1 : void 0, De === !0 ? !1 : void 0, !0) : Te(qe.canGroupBy, Tt, We, !1), qe.canGroupBy && (qe.toggleGroupBy = function() {
            return l.toggleGroupBy(qe.id);
          }), qe.Aggregated = qe.Aggregated || qe.Cell;
        });
        var it = r.useCallback(function(qe, Xe) {
          ve({
            type: h.toggleGroupBy,
            columnId: qe,
            value: Xe
          });
        }, [ve]), _e = r.useCallback(function(qe) {
          ve({
            type: h.setGroupBy,
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
            return [m, v, R, Xu, Ku, v, R];
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
              var Ta = typeof kt.aggregate == "function" ? kt.aggregate : he[kt.aggregate] || Vi[kt.aggregate];
              if (Ta) {
                var vi = Xt.map(function(qr) {
                  return qr.values[kt.id];
                }), bs = xr.map(function(qr) {
                  var Rr = qr.values[kt.id];
                  if (!Pa && kt.aggregateValue) {
                    var Sr = typeof kt.aggregateValue == "function" ? kt.aggregateValue : he[kt.aggregateValue] || Vi[kt.aggregateValue];
                    if (!Sr)
                      throw console.info({
                        column: kt
                      }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                    Rr = Sr(Rr, qr, kt);
                  }
                  return Rr;
                });
                _r[kt.id] = Ta(bs, vi);
              } else {
                if (kt.aggregate)
                  throw console.info({
                    column: kt
                  }), new Error("React Table: Invalid column.aggregate option for column listed above");
                _r[kt.id] = null;
              }
            }), _r;
          }, Tt = [], jt = {}, Vr = [], no = {}, He = [], Nt = {}, Bt = function Dt(xr, Xt, Pa) {
            if (Xt === void 0 && (Xt = 0), Xt === qe.length)
              return xr.map(function(vi) {
                return a({}, vi, {
                  depth: Xt
                });
              });
            var _r = qe[Xt], kt = z(xr, _r), Ta = Object.entries(kt).map(function(vi, bs) {
              var qr = vi[0], Rr = vi[1], Sr = _r + ":" + qr;
              Sr = Pa ? Pa + ">" + Sr : Sr;
              var Ef = Dt(Rr, Xt + 1, Sr), Mf = Xt ? Ce(Rr, "leafRows") : Rr, Tm = Xe(Mf, Rr, Xt), Nm = {
                id: Sr,
                isGrouped: !0,
                groupByID: _r,
                groupByVal: qr,
                values: Tm,
                subRows: Ef,
                leafRows: Mf,
                depth: Xt,
                index: bs
              };
              return Ef.forEach(function(Vn) {
                Tt.push(Vn), jt[Vn.id] = Vn, Vn.isGrouped ? (Vr.push(Vn), no[Vn.id] = Vn) : (He.push(Vn), Nt[Vn.id] = Vn);
              }), Nm;
            });
            return Ta;
          }, nn = Bt(m);
          return nn.forEach(function(Dt) {
            Tt.push(Dt), jt[Dt.id] = Dt, Dt.isGrouped ? (Vr.push(Dt), no[Dt.id] = Dt) : (He.push(Dt), Nt[Dt.id] = Dt);
          }), [nn, Tt, jt, Vr, no, He, Nt];
        }, [H, ae, m, v, R, C, he, z]), Re = ye[0], Be = ye[1], et = ye[2], tt = ye[3], Rt = ye[4], Me = ye[5], Ft = ye[6], nt = D(Pe);
        Q(function() {
          nt() && ve({
            type: h.resetGroupBy
          });
        }, [ve, H ? null : d]), Object.assign(l, {
          preGroupedRows: m,
          preGroupedFlatRow: v,
          preGroupedRowsById: R,
          groupedRows: Re,
          groupedFlatRows: Be,
          groupedRowsById: et,
          onlyGroupedFlatRows: tt,
          onlyGroupedRowsById: Rt,
          nonGroupedFlatRows: Me,
          nonGroupedRowsById: Ft,
          rows: Re,
          flatRows: Be,
          rowsById: et,
          toggleGroupBy: it,
          setGroupBy: _e
        });
      }
      function ts(l) {
        l.allCells.forEach(function(d) {
          var m;
          d.isGrouped = d.column.isGrouped && d.column.id === l.groupByID, d.isPlaceholder = !d.isGrouped && d.column.isGrouped, d.isAggregated = !d.isGrouped && !d.isPlaceholder && ((m = l.subRows) == null ? void 0 : m.length);
        });
      }
      function ua(l, d) {
        return l.reduce(function(m, v, R) {
          var C = "" + v.values[d];
          return m[C] = Array.isArray(m[C]) ? m[C] : [], m[C].push(v), m;
        }, {});
      }
      var sa = /([0-9]+)/gm, ns = function(d, m, v) {
        var R = Ur(d, m, v), C = R[0], x = R[1];
        for (C = ca(C), x = ca(x), C = C.split(sa).filter(Boolean), x = x.split(sa).filter(Boolean); C.length && x.length; ) {
          var I = C.shift(), z = x.shift(), H = parseInt(I, 10), q = parseInt(z, 10), he = [H, q].sort();
          if (isNaN(he[0])) {
            if (I > z)
              return 1;
            if (z > I)
              return -1;
            continue;
          }
          if (isNaN(he[1]))
            return isNaN(H) ? -1 : 1;
          if (H > q)
            return 1;
          if (q > H)
            return -1;
        }
        return C.length - x.length;
      };
      function rs(l, d, m) {
        var v = Ur(l, d, m), R = v[0], C = v[1];
        return R = R.getTime(), C = C.getTime(), Yi(R, C);
      }
      function is(l, d, m) {
        var v = Ur(l, d, m), R = v[0], C = v[1];
        return Yi(R, C);
      }
      function os(l, d, m) {
        var v = Ur(l, d, m), R = v[0], C = v[1];
        for (R = R.split("").filter(Boolean), C = C.split("").filter(Boolean); R.length && C.length; ) {
          var x = R.shift(), I = C.shift(), z = x.toLowerCase(), H = I.toLowerCase();
          if (z > H)
            return 1;
          if (H > z)
            return -1;
          if (x > I)
            return 1;
          if (I > x)
            return -1;
        }
        return R.length - C.length;
      }
      function la(l, d, m) {
        var v = Ur(l, d, m), R = v[0], C = v[1], x = /[^0-9.]/gi;
        return R = Number(String(R).replace(x, "")), C = Number(String(C).replace(x, "")), Yi(R, C);
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
      var as = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        alphanumeric: ns,
        datetime: rs,
        basic: is,
        string: os,
        number: la
      });
      h.resetSortBy = "resetSortBy", h.setSortBy = "setSortBy", h.toggleSortBy = "toggleSortBy", h.clearSortBy = "clearSortBy", _.sortType = "alphanumeric", _.sortDescFirst = !1;
      var fa = function(d) {
        d.getSortByToggleProps = [us], d.stateReducers.push(da), d.useInstance.push(ha);
      };
      fa.pluginName = "useSortBy";
      var us = function(d, m) {
        var v = m.instance, R = m.column, C = v.isMultiSortEvent, x = C === void 0 ? function(I) {
          return I.shiftKey;
        } : C;
        return [d, {
          onClick: R.canSort ? function(I) {
            I.persist(), R.toggleSortBy(void 0, !v.disableMultiSort && x(I));
          } : void 0,
          style: {
            cursor: R.canSort ? "pointer" : void 0
          },
          title: R.canSort ? "Toggle SortBy" : void 0
        }];
      };
      function da(l, d, m, v) {
        if (d.type === h.init)
          return a({
            sortBy: []
          }, l);
        if (d.type === h.resetSortBy)
          return a({}, l, {
            sortBy: v.initialState.sortBy || []
          });
        if (d.type === h.clearSortBy) {
          var R = l.sortBy, C = R.filter(function(Re) {
            return Re.id !== d.columnId;
          });
          return a({}, l, {
            sortBy: C
          });
        }
        if (d.type === h.setSortBy) {
          var x = d.sortBy;
          return a({}, l, {
            sortBy: x
          });
        }
        if (d.type === h.toggleSortBy) {
          var I = d.columnId, z = d.desc, H = d.multi, q = v.allColumns, he = v.disableMultiSort, Z = v.disableSortRemove, ae = v.disableMultiRemove, ve = v.maxMultiSortColCount, K = ve === void 0 ? Number.MAX_SAFE_INTEGER : ve, Pe = l.sortBy, De = q.find(function(Re) {
            return Re.id === I;
          }), We = De.sortDescFirst, we = Pe.find(function(Re) {
            return Re.id === I;
          }), Ze = Pe.findIndex(function(Re) {
            return Re.id === I;
          }), it = typeof z < "u" && z !== null, _e = [], ye;
          return !he && H ? we ? ye = "toggle" : ye = "add" : Ze !== Pe.length - 1 || Pe.length !== 1 ? ye = "replace" : we ? ye = "toggle" : ye = "replace", ye === "toggle" && !Z && !it && (H ? !ae : !0) && (we && we.desc && !We || !we.desc && We) && (ye = "remove"), ye === "replace" ? _e = [{
            id: I,
            desc: it ? z : We
          }] : ye === "add" ? (_e = [].concat(Pe, [{
            id: I,
            desc: it ? z : We
          }]), _e.splice(0, _e.length - K)) : ye === "toggle" ? _e = Pe.map(function(Re) {
            return Re.id === I ? a({}, Re, {
              desc: it ? z : !we.desc
            }) : Re;
          }) : ye === "remove" && (_e = Pe.filter(function(Re) {
            return Re.id !== I;
          })), a({}, l, {
            sortBy: _e
          });
        }
      }
      function ha(l) {
        var d = l.data, m = l.rows, v = l.flatRows, R = l.allColumns, C = l.orderByFn, x = C === void 0 ? Xi : C, I = l.sortTypes, z = l.manualSortBy, H = l.defaultCanSort, q = l.disableSortBy, he = l.flatHeaders, Z = l.state.sortBy, ae = l.dispatch, ve = l.plugins, K = l.getHooks, Pe = l.autoResetSortBy, De = Pe === void 0 ? !0 : Pe;
        L(ve, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var We = r.useCallback(function(Be) {
          ae({
            type: h.setSortBy,
            sortBy: Be
          });
        }, [ae]), we = r.useCallback(function(Be, et, tt) {
          ae({
            type: h.toggleSortBy,
            columnId: Be,
            desc: et,
            multi: tt
          });
        }, [ae]), Ze = D(l);
        he.forEach(function(Be) {
          var et = Be.accessor, tt = Be.canSort, Rt = Be.disableSortBy, Me = Be.id, Ft = et ? Te(Rt === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(H, tt, !1);
          Be.canSort = Ft, Be.canSort && (Be.toggleSortBy = function(qe, Xe) {
            return we(Be.id, qe, Xe);
          }, Be.clearSortBy = function() {
            ae({
              type: h.clearSortBy,
              columnId: Be.id
            });
          }), Be.getSortByToggleProps = k(K().getSortByToggleProps, {
            instance: Ze(),
            column: Be
          });
          var nt = Z.find(function(qe) {
            return qe.id === Me;
          });
          Be.isSorted = !!nt, Be.sortedIndex = Z.findIndex(function(qe) {
            return qe.id === Me;
          }), Be.isSortedDesc = Be.isSorted ? nt.desc : void 0;
        });
        var it = r.useMemo(function() {
          if (z || !Z.length)
            return [m, v];
          var Be = [], et = Z.filter(function(Rt) {
            return R.find(function(Me) {
              return Me.id === Rt.id;
            });
          }), tt = function Rt(Me) {
            var Ft = x(
              Me,
              et.map(function(nt) {
                var qe = R.find(function(jt) {
                  return jt.id === nt.id;
                });
                if (!qe)
                  throw new Error("React-Table: Could not find a column with id: " + nt.id + " while sorting");
                var Xe = qe.sortType, Tt = Ae(Xe) || (I || {})[Xe] || as[Xe];
                if (!Tt)
                  throw new Error("React-Table: Could not find a valid sortType of '" + Xe + "' for column '" + nt.id + "'.");
                return function(jt, Vr) {
                  return Tt(jt, Vr, nt.id, nt.desc);
                };
              }),
              et.map(function(nt) {
                var qe = R.find(function(Xe) {
                  return Xe.id === nt.id;
                });
                return qe && qe.sortInverted ? nt.desc : !nt.desc;
              })
            );
            return Ft.forEach(function(nt) {
              Be.push(nt), !(!nt.subRows || nt.subRows.length === 0) && (nt.subRows = Rt(nt.subRows));
            }), Ft;
          };
          return [tt(m), Be];
        }, [z, Z, m, v, R, x, I]), _e = it[0], ye = it[1], Re = D(De);
        Q(function() {
          Re() && ae({
            type: h.resetSortBy
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
        return [].concat(l).sort(function(v, R) {
          for (var C = 0; C < d.length; C += 1) {
            var x = d[C], I = m[C] === !1 || m[C] === "desc", z = x(v, R);
            if (z !== 0)
              return I ? -z : z;
          }
          return m[0] ? v.index - R.index : R.index - v.index;
        });
      }
      var ss = "usePagination";
      h.resetPage = "resetPage", h.gotoPage = "gotoPage", h.setPageSize = "setPageSize";
      var pa = function(d) {
        d.stateReducers.push(ls), d.useInstance.push(va);
      };
      pa.pluginName = ss;
      function ls(l, d, m, v) {
        if (d.type === h.init)
          return a({
            pageSize: 10,
            pageIndex: 0
          }, l);
        if (d.type === h.resetPage)
          return a({}, l, {
            pageIndex: v.initialState.pageIndex || 0
          });
        if (d.type === h.gotoPage) {
          var R = v.pageCount, C = v.page, x = M(d.pageIndex, l.pageIndex), I = !1;
          return x > l.pageIndex ? I = R === -1 ? C.length >= l.pageSize : x < R : x < l.pageIndex && (I = x > -1), I ? a({}, l, {
            pageIndex: x
          }) : l;
        }
        if (d.type === h.setPageSize) {
          var z = d.pageSize, H = l.pageSize * l.pageIndex, q = Math.floor(H / z);
          return a({}, l, {
            pageIndex: q,
            pageSize: z
          });
        }
      }
      function va(l) {
        var d = l.rows, m = l.autoResetPage, v = m === void 0 ? !0 : m, R = l.manualExpandedKey, C = R === void 0 ? "expanded" : R, x = l.plugins, I = l.pageCount, z = l.paginateExpandedRows, H = z === void 0 ? !0 : z, q = l.expandSubRows, he = q === void 0 ? !0 : q, Z = l.state, ae = Z.pageSize, ve = Z.pageIndex, K = Z.expanded, Pe = Z.globalFilter, De = Z.filters, We = Z.groupBy, we = Z.sortBy, Ze = l.dispatch, it = l.data, _e = l.manualPagination;
        L(x, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var ye = D(v);
        Q(function() {
          ye() && Ze({
            type: h.resetPage
          });
        }, [Ze, _e ? null : it, Pe, De, We, we]);
        var Re = _e ? I : Math.ceil(d.length / ae), Be = r.useMemo(function() {
          return Re > 0 ? [].concat(new Array(Re)).fill(null).map(function(Xe, Tt) {
            return Tt;
          }) : [];
        }, [Re]), et = r.useMemo(function() {
          var Xe;
          if (_e)
            Xe = d;
          else {
            var Tt = ae * ve, jt = Tt + ae;
            Xe = d.slice(Tt, jt);
          }
          return H ? Xe : Se(Xe, {
            manualExpandedKey: C,
            expanded: K,
            expandSubRows: he
          });
        }, [he, K, C, _e, ve, ae, H, d]), tt = ve > 0, Rt = Re === -1 ? et.length >= ae : ve < Re - 1, Me = r.useCallback(function(Xe) {
          Ze({
            type: h.gotoPage,
            pageIndex: Xe
          });
        }, [Ze]), Ft = r.useCallback(function() {
          return Me(function(Xe) {
            return Xe - 1;
          });
        }, [Me]), nt = r.useCallback(function() {
          return Me(function(Xe) {
            return Xe + 1;
          });
        }, [Me]), qe = r.useCallback(function(Xe) {
          Ze({
            type: h.setPageSize,
            pageSize: Xe
          });
        }, [Ze]);
        Object.assign(l, {
          pageOptions: Be,
          pageCount: Re,
          page: et,
          canPreviousPage: tt,
          canNextPage: Rt,
          gotoPage: Me,
          previousPage: Ft,
          nextPage: nt,
          setPageSize: qe
        });
      }
      h.resetPivot = "resetPivot", h.togglePivot = "togglePivot";
      var ga = function(d) {
        d.getPivotToggleProps = [cs], d.stateReducers.push(ya), d.useInstanceAfterData.push(fs), d.allColumns.push(ds), d.accessValue.push(hs), d.materializedColumns.push(ps), d.materializedColumnsDeps.push(Ki), d.visibleColumns.push(ba), d.visibleColumnsDeps.push(pi), d.useInstance.push(Qi), d.prepareRow.push(Zi);
      };
      ga.pluginName = "usePivotColumns";
      var ma = [], cs = function(d, m) {
        var v = m.header;
        return [d, {
          onClick: v.canPivot ? function(R) {
            R.persist(), v.togglePivot();
          } : void 0,
          style: {
            cursor: v.canPivot ? "pointer" : void 0
          },
          title: "Toggle Pivot"
        }];
      };
      function ya(l, d, m, v) {
        if (d.type === h.init)
          return a({
            pivotColumns: ma
          }, l);
        if (d.type === h.resetPivot)
          return a({}, l, {
            pivotColumns: v.initialState.pivotColumns || ma
          });
        if (d.type === h.togglePivot) {
          var R = d.columnId, C = d.value, x = typeof C < "u" ? C : !l.pivotColumns.includes(R);
          return x ? a({}, l, {
            pivotColumns: [].concat(l.pivotColumns, [R])
          }) : a({}, l, {
            pivotColumns: l.pivotColumns.filter(function(I) {
              return I !== R;
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
        var m = d.instance;
        return l.forEach(function(v) {
          v.isPivotSource = m.state.pivotColumns.includes(v.id), v.uniqueValues = /* @__PURE__ */ new Set();
        }), l;
      }
      function hs(l, d) {
        var m = d.column;
        return m.uniqueValues && typeof l < "u" && m.uniqueValues.add(l), l;
      }
      function ps(l, d) {
        var m = d.instance, v = m.allColumns, R = m.state;
        if (!R.pivotColumns.length || !R.groupBy || !R.groupBy.length)
          return l;
        var C = R.pivotColumns.map(function(H) {
          return v.find(function(q) {
            return q.id === H;
          });
        }).filter(Boolean), x = v.filter(function(H) {
          return !H.isPivotSource && !R.groupBy.includes(H.id) && !R.pivotColumns.includes(H.id);
        }), I = function H(q, he, Z) {
          q === void 0 && (q = 0), Z === void 0 && (Z = []);
          var ae = C[q];
          if (!ae)
            return x.map(function(K) {
              return a({}, K, {
                canPivot: !1,
                isPivoted: !0,
                parent: he,
                depth: q,
                id: "" + (he ? he.id + "." + K.id : K.id),
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
              parent: he,
              depth: q,
              id: he ? he.id + "." + ae.id + "." + K : ae.id + "." + K,
              pivotValue: K
            });
            return Pe.columns = H(q + 1, Pe, [].concat(Z, [function(De) {
              return De.values[ae.id] === K;
            }])), Pe;
          });
        }, z = Ue(I());
        return [].concat(l, z);
      }
      function Ki(l, d) {
        var m = d.instance.state, v = m.pivotColumns, R = m.groupBy;
        return [].concat(l, [v, R]);
      }
      function ba(l, d) {
        var m = d.instance.state;
        return l = l.filter(function(v) {
          return !v.isPivotSource;
        }), m.pivotColumns.length && m.groupBy && m.groupBy.length && (l = l.filter(function(v) {
          return v.isGrouped || v.isPivoted;
        })), l;
      }
      function pi(l, d) {
        var m = d.instance;
        return [].concat(l, [m.state.pivotColumns, m.state.groupBy]);
      }
      function Qi(l) {
        var d = l.columns, m = l.allColumns, v = l.flatHeaders, R = l.getHooks, C = l.plugins, x = l.dispatch, I = l.autoResetPivot, z = I === void 0 ? !0 : I, H = l.manaulPivot, q = l.disablePivot, he = l.defaultCanPivot;
        L(C, ["useGroupBy"], "usePivotColumns");
        var Z = D(l);
        m.forEach(function(K) {
          var Pe = K.accessor, De = K.defaultPivot, We = K.disablePivot;
          K.canPivot = Pe ? Te(K.canPivot, We === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Te(K.canPivot, De, he, !1), K.canPivot && (K.togglePivot = function() {
            return l.togglePivot(K.id);
          }), K.Aggregated = K.Aggregated || K.Cell;
        });
        var ae = function(Pe, De) {
          x({
            type: h.togglePivot,
            columnId: Pe,
            value: De
          });
        };
        v.forEach(function(K) {
          K.getPivotToggleProps = k(R().getPivotToggleProps, {
            instance: Z(),
            header: K
          });
        });
        var ve = D(z);
        Q(function() {
          ve() && x({
            type: h.resetPivot
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
      h.resetSelectedRows = "resetSelectedRows", h.toggleAllRowsSelected = "toggleAllRowsSelected", h.toggleRowSelected = "toggleRowSelected", h.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var Ji = function(d) {
        d.getToggleRowSelectedProps = [vs], d.getToggleAllRowsSelectedProps = [eo], d.getToggleAllPageRowsSelectedProps = [gs], d.stateReducers.push(ms), d.useInstance.push(ys), d.prepareRow.push(xa);
      };
      Ji.pluginName = wa;
      var vs = function(d, m) {
        var v = m.instance, R = m.row, C = v.manualRowSelectedKey, x = C === void 0 ? "isSelected" : C, I = !1;
        return R.original && R.original[x] ? I = !0 : I = R.isSelected, [d, {
          onChange: function(H) {
            R.toggleRowSelected(H.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: I,
          title: "Toggle Row Selected",
          indeterminate: R.isSomeSelected
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
      }, gs = function(d, m) {
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
          indeterminate: Boolean(!v.isAllPageRowsSelected && v.page.some(function(R) {
            var C = R.id;
            return v.state.selectedRowIds[C];
          }))
        }];
      };
      function ms(l, d, m, v) {
        if (d.type === h.init)
          return a({
            selectedRowIds: {}
          }, l);
        if (d.type === h.resetSelectedRows)
          return a({}, l, {
            selectedRowIds: v.initialState.selectedRowIds || {}
          });
        if (d.type === h.toggleAllRowsSelected) {
          var R = d.value, C = v.isAllRowsSelected, x = v.rowsById, I = v.nonGroupedRowsById, z = I === void 0 ? x : I, H = typeof R < "u" ? R : !C, q = Object.assign({}, l.selectedRowIds);
          return H ? Object.keys(z).forEach(function(nt) {
            q[nt] = !0;
          }) : Object.keys(z).forEach(function(nt) {
            delete q[nt];
          }), a({}, l, {
            selectedRowIds: q
          });
        }
        if (d.type === h.toggleRowSelected) {
          var he = d.id, Z = d.value, ae = v.rowsById, ve = v.selectSubRows, K = ve === void 0 ? !0 : ve, Pe = v.getSubRows, De = l.selectedRowIds[he], We = typeof Z < "u" ? Z : !De;
          if (De === We)
            return l;
          var we = a({}, l.selectedRowIds), Ze = function nt(qe) {
            var Xe = ae[qe];
            if (Xe && (Xe.isGrouped || (We ? we[qe] = !0 : delete we[qe]), K && Pe(Xe)))
              return Pe(Xe).forEach(function(Tt) {
                return nt(Tt.id);
              });
          };
          return Ze(he), a({}, l, {
            selectedRowIds: we
          });
        }
        if (d.type === h.toggleAllPageRowsSelected) {
          var it = d.value, _e = v.page, ye = v.rowsById, Re = v.selectSubRows, Be = Re === void 0 ? !0 : Re, et = v.isAllPageRowsSelected, tt = v.getSubRows, Rt = typeof it < "u" ? it : !et, Me = a({}, l.selectedRowIds), Ft = function nt(qe) {
            var Xe = ye[qe];
            if (Xe.isGrouped || (Rt ? Me[qe] = !0 : delete Me[qe]), Be && tt(Xe))
              return tt(Xe).forEach(function(Tt) {
                return nt(Tt.id);
              });
          };
          return _e.forEach(function(nt) {
            return Ft(nt.id);
          }), a({}, l, {
            selectedRowIds: Me
          });
        }
        return l;
      }
      function ys(l) {
        var d = l.data, m = l.rows, v = l.getHooks, R = l.plugins, C = l.rowsById, x = l.nonGroupedRowsById, I = x === void 0 ? C : x, z = l.autoResetSelectedRows, H = z === void 0 ? !0 : z, q = l.state.selectedRowIds, he = l.selectSubRows, Z = he === void 0 ? !0 : he, ae = l.dispatch, ve = l.page, K = l.getSubRows;
        L(R, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var Pe = r.useMemo(function() {
          var et = [];
          return m.forEach(function(tt) {
            var Rt = Z ? _a(tt, q, K) : !!q[tt.id];
            tt.isSelected = !!Rt, tt.isSomeSelected = Rt === null, Rt && et.push(tt);
          }), et;
        }, [m, Z, q, K]), De = Boolean(Object.keys(I).length && Object.keys(q).length), We = De;
        De && Object.keys(I).some(function(et) {
          return !q[et];
        }) && (De = !1), De || ve && ve.length && ve.some(function(et) {
          var tt = et.id;
          return !q[tt];
        }) && (We = !1);
        var we = D(H);
        Q(function() {
          we() && ae({
            type: h.resetSelectedRows
          });
        }, [ae, d]);
        var Ze = r.useCallback(function(et) {
          return ae({
            type: h.toggleAllRowsSelected,
            value: et
          });
        }, [ae]), it = r.useCallback(function(et) {
          return ae({
            type: h.toggleAllPageRowsSelected,
            value: et
          });
        }, [ae]), _e = r.useCallback(function(et, tt) {
          return ae({
            type: h.toggleRowSelected,
            id: et,
            value: tt
          });
        }, [ae]), ye = D(l), Re = k(v().getToggleAllRowsSelectedProps, {
          instance: ye()
        }), Be = k(v().getToggleAllPageRowsSelectedProps, {
          instance: ye()
        });
        Object.assign(l, {
          selectedFlatRows: Pe,
          isAllRowsSelected: De,
          isAllPageRowsSelected: We,
          toggleRowSelected: _e,
          toggleAllRowsSelected: Ze,
          getToggleAllRowsSelectedProps: Re,
          getToggleAllPageRowsSelectedProps: Be,
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
          var R = !0, C = !1;
          return v.forEach(function(x) {
            C && !R || (_a(x, d, m) ? C = !0 : R = !1);
          }), R ? !0 : C ? null : !1;
        }
        return !1;
      }
      var Ra = function(d) {
        return {};
      }, Sa = function(d) {
        return {};
      };
      h.setRowState = "setRowState", h.setCellState = "setCellState", h.resetRowState = "resetRowState";
      var Ca = function(d) {
        d.stateReducers.push(to), d.useInstance.push(s), d.prepareRow.push(g);
      };
      Ca.pluginName = "useRowState";
      function to(l, d, m, v) {
        var R = v.initialRowStateAccessor, C = R === void 0 ? Ra : R, x = v.initialCellStateAccessor, I = x === void 0 ? Sa : x, z = v.rowsById;
        if (d.type === h.init)
          return a({
            rowState: {}
          }, l);
        if (d.type === h.resetRowState)
          return a({}, l, {
            rowState: v.initialState.rowState || {}
          });
        if (d.type === h.setRowState) {
          var H, q = d.rowId, he = d.value, Z = typeof l.rowState[q] < "u" ? l.rowState[q] : C(z[q]);
          return a({}, l, {
            rowState: a({}, l.rowState, (H = {}, H[q] = M(he, Z), H))
          });
        }
        if (d.type === h.setCellState) {
          var ae, ve, K, Pe, De, We = d.rowId, we = d.columnId, Ze = d.value, it = typeof l.rowState[We] < "u" ? l.rowState[We] : C(z[We]), _e = typeof (it == null || (ae = it.cellState) == null ? void 0 : ae[we]) < "u" ? it.cellState[we] : I((ve = z[We]) == null || (K = ve.cells) == null ? void 0 : K.find(function(ye) {
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
        var d = l.autoResetRowState, m = d === void 0 ? !0 : d, v = l.data, R = l.dispatch, C = r.useCallback(function(z, H) {
          return R({
            type: h.setRowState,
            rowId: z,
            value: H
          });
        }, [R]), x = r.useCallback(function(z, H, q) {
          return R({
            type: h.setCellState,
            rowId: z,
            columnId: H,
            value: q
          });
        }, [R]), I = D(m);
        Q(function() {
          I() && R({
            type: h.resetRowState
          });
        }, [v]), Object.assign(l, {
          setRowState: C,
          setCellState: x
        });
      }
      function g(l, d) {
        var m = d.instance, v = m.initialRowStateAccessor, R = v === void 0 ? Ra : v, C = m.initialCellStateAccessor, x = C === void 0 ? Sa : C, I = m.state.rowState;
        l && (l.state = typeof I[l.id] < "u" ? I[l.id] : R(l), l.setState = function(z) {
          return m.setRowState(l.id, z);
        }, l.cells.forEach(function(z) {
          l.state.cellState || (l.state.cellState = {}), z.state = typeof l.state.cellState[z.column.id] < "u" ? l.state.cellState[z.column.id] : x(z), z.setState = function(H) {
            return m.setCellState(l.id, z.column.id, H);
          };
        }));
      }
      h.resetColumnOrder = "resetColumnOrder", h.setColumnOrder = "setColumnOrder";
      var y = function(d) {
        d.stateReducers.push(b), d.visibleColumnsDeps.push(function(m, v) {
          var R = v.instance;
          return [].concat(m, [R.state.columnOrder]);
        }), d.visibleColumns.push(E), d.useInstance.push(S);
      };
      y.pluginName = "useColumnOrder";
      function b(l, d, m, v) {
        if (d.type === h.init)
          return a({
            columnOrder: []
          }, l);
        if (d.type === h.resetColumnOrder)
          return a({}, l, {
            columnOrder: v.initialState.columnOrder || []
          });
        if (d.type === h.setColumnOrder)
          return a({}, l, {
            columnOrder: M(d.columnOrder, l.columnOrder)
          });
      }
      function E(l, d) {
        var m = d.instance.state.columnOrder;
        if (!m || !m.length)
          return l;
        for (var v = [].concat(m), R = [].concat(l), C = [], x = function() {
          var z = v.shift(), H = R.findIndex(function(q) {
            return q.id === z;
          });
          H > -1 && C.push(R.splice(H, 1)[0]);
        }; R.length && v.length; )
          x();
        return [].concat(C, R);
      }
      function S(l) {
        var d = l.dispatch;
        l.setColumnOrder = r.useCallback(function(m) {
          return d({
            type: h.setColumnOrder,
            columnOrder: m
          });
        }, [d]);
      }
      _.canResize = !0, h.columnStartResizing = "columnStartResizing", h.columnResizing = "columnResizing", h.columnDoneResizing = "columnDoneResizing", h.resetResize = "resetResize";
      var A = function(d) {
        d.getResizerProps = [G], d.getHeaderProps.push({
          style: {
            position: "relative"
          }
        }), d.stateReducers.push(W), d.useInstance.push(se), d.useInstanceBeforeDimensions.push(U);
      }, G = function(d, m) {
        var v = m.instance, R = m.header, C = v.dispatch, x = function(z, H) {
          var q = !1;
          if (z.type === "touchstart") {
            if (z.touches && z.touches.length > 1)
              return;
            q = !0;
          }
          var he = ie(H), Z = he.map(function(_e) {
            return [_e.id, _e.totalWidth];
          }), ae = q ? Math.round(z.touches[0].clientX) : z.clientX, ve, K, Pe = function() {
            window.cancelAnimationFrame(ve), ve = null, C({
              type: h.columnDoneResizing
            });
          }, De = function() {
            window.cancelAnimationFrame(ve), ve = null, C({
              type: h.columnResizing,
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
            type: h.columnStartResizing,
            columnId: H.id,
            columnWidth: H.totalWidth,
            headerIdWidths: Z,
            clientX: ae
          });
        };
        return [d, {
          onMouseDown: function(z) {
            return z.persist() || x(z, R);
          },
          onTouchStart: function(z) {
            return z.persist() || x(z, R);
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
        if (d.type === h.init)
          return a({
            columnResizing: {
              columnWidths: {}
            }
          }, l);
        if (d.type === h.resetResize)
          return a({}, l, {
            columnResizing: {
              columnWidths: {}
            }
          });
        if (d.type === h.columnStartResizing) {
          var m = d.clientX, v = d.columnId, R = d.columnWidth, C = d.headerIdWidths;
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: m,
              headerIdWidths: C,
              columnWidth: R,
              isResizingColumn: v
            })
          });
        }
        if (d.type === h.columnResizing) {
          var x = d.clientX, I = l.columnResizing, z = I.startX, H = I.columnWidth, q = I.headerIdWidths, he = q === void 0 ? [] : q, Z = x - z, ae = Z / H, ve = {};
          return he.forEach(function(K) {
            var Pe = K[0], De = K[1];
            ve[Pe] = Math.max(De + De * ae, 0);
          }), a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              columnWidths: a({}, l.columnResizing.columnWidths, {}, ve)
            })
          });
        }
        if (d.type === h.columnDoneResizing)
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: null,
              isResizingColumn: null
            })
          });
      }
      var U = function(d) {
        var m = d.flatHeaders, v = d.disableResizing, R = d.getHooks, C = d.state.columnResizing, x = D(d);
        m.forEach(function(I) {
          var z = Te(I.disableResizing === !0 ? !1 : void 0, v === !0 ? !1 : void 0, !0);
          I.canResize = z, I.width = C.columnWidths[I.id] || I.originalWidth || I.width, I.isResizing = C.isResizingColumn === I.id, z && (I.getResizerProps = k(R().getResizerProps, {
            instance: x(),
            header: I
          }));
        });
      };
      function se(l) {
        var d = l.plugins, m = l.dispatch, v = l.autoResetResize, R = v === void 0 ? !0 : v, C = l.columns;
        L(d, ["useAbsoluteLayout"], "useResizeColumns");
        var x = D(R);
        Q(function() {
          x() && m({
            type: h.resetResize
          });
        }, [C]);
        var I = r.useCallback(function() {
          return m({
            type: h.resetResize
          });
        }, [m]);
        Object.assign(l, {
          resetResizing: I
        });
      }
      function ie(l) {
        var d = [], m = function v(R) {
          R.columns && R.columns.length && R.columns.map(v), d.push(R);
        };
        return m(l), d;
      }
      var oe = {
        position: "absolute",
        top: 0
      }, Y = function(d) {
        d.getTableBodyProps.push(ne), d.getRowProps.push(ne), d.getHeaderGroupProps.push(ne), d.getFooterGroupProps.push(ne), d.getHeaderProps.push(function(m, v) {
          var R = v.column;
          return [m, {
            style: a({}, oe, {
              left: R.totalLeft + "px",
              width: R.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(m, v) {
          var R = v.cell;
          return [m, {
            style: a({}, oe, {
              left: R.column.totalLeft + "px",
              width: R.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(m, v) {
          var R = v.column;
          return [m, {
            style: a({}, oe, {
              left: R.totalLeft + "px",
              width: R.totalWidth + "px"
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
      }, Ie = function(d) {
        d.getRowProps.push(xe), d.getHeaderGroupProps.push(xe), d.getFooterGroupProps.push(xe), d.getHeaderProps.push(function(m, v) {
          var R = v.column;
          return [m, {
            style: a({}, me, {
              width: R.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(m, v) {
          var R = v.cell;
          return [m, {
            style: a({}, me, {
              width: R.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(m, v) {
          var R = v.column;
          return [m, {
            style: a({}, me, {
              width: R.totalWidth + "px"
            })
          }];
        });
      };
      Ie.pluginName = "useBlockLayout";
      function Je(l) {
        l.getTableProps.push($e), l.getRowProps.push(le), l.getHeaderGroupProps.push(le), l.getFooterGroupProps.push(le), l.getHeaderProps.push(Qe), l.getCellProps.push(Ee), l.getFooterProps.push(Ye);
      }
      Je.pluginName = "useFlexLayout";
      var $e = function(d, m) {
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
      h.columnStartResizing = "columnStartResizing", h.columnResizing = "columnResizing", h.columnDoneResizing = "columnDoneResizing", h.resetResize = "resetResize";
      function ft(l) {
        l.stateReducers.push(Ke), l.getTableProps.push(Ge), l.getHeaderProps.push(Ve), l.getRowProps.push(yt);
      }
      ft.pluginName = "useGridLayout";
      var Ge = function(d, m) {
        var v = m.instance, R = v.visibleColumns.map(function(C) {
          var x;
          return v.state.gridLayout.columnWidths[C.id] ? v.state.gridLayout.columnWidths[C.id] + "px" : (x = v.state.columnResizing) != null && x.isResizingColumn ? v.state.gridLayout.startWidths[C.id] + "px" : typeof C.width == "number" ? C.width + "px" : C.width;
        });
        return [d, {
          style: {
            display: "grid",
            gridTemplateColumns: R.join(" ")
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
        if (d.type === h.init)
          return a({
            gridLayout: {
              columnWidths: {}
            }
          }, l);
        if (d.type === h.resetResize)
          return a({}, l, {
            gridLayout: {
              columnWidths: {}
            }
          });
        if (d.type === h.columnStartResizing) {
          var R = d.columnId, C = d.headerIdWidths, x = pt(R);
          if (x !== void 0) {
            var I = v.visibleColumns.reduce(function(_e, ye) {
              var Re;
              return a({}, _e, (Re = {}, Re[ye.id] = pt(ye.id), Re));
            }, {}), z = v.visibleColumns.reduce(function(_e, ye) {
              var Re;
              return a({}, _e, (Re = {}, Re[ye.id] = ye.minWidth, Re));
            }, {}), H = v.visibleColumns.reduce(function(_e, ye) {
              var Re;
              return a({}, _e, (Re = {}, Re[ye.id] = ye.maxWidth, Re));
            }, {}), q = C.map(function(_e) {
              var ye = _e[0];
              return [ye, pt(ye)];
            });
            return a({}, l, {
              gridLayout: a({}, l.gridLayout, {
                startWidths: I,
                minWidths: z,
                maxWidths: H,
                headerIdGridWidths: q,
                columnWidth: x
              })
            });
          } else
            return l;
        }
        if (d.type === h.columnResizing) {
          var he = d.clientX, Z = l.columnResizing.startX, ae = l.gridLayout, ve = ae.columnWidth, K = ae.minWidths, Pe = ae.maxWidths, De = ae.headerIdGridWidths, We = De === void 0 ? [] : De, we = he - Z, Ze = we / ve, it = {};
          return We.forEach(function(_e) {
            var ye = _e[0], Re = _e[1];
            it[ye] = Math.min(Math.max(K[ye], Re + Re * Ze), Pe[ye]);
          }), a({}, l, {
            gridLayout: a({}, l.gridLayout, {
              columnWidths: a({}, l.gridLayout.columnWidths, {}, it)
            })
          });
        }
        if (d.type === h.columnDoneResizing)
          return a({}, l, {
            gridLayout: a({}, l.gridLayout, {
              startWidths: {},
              minWidths: {},
              maxWidths: {}
            })
          });
      }
      function pt(l) {
        var d, m = (d = document.getElementById("header-cell-" + l)) == null ? void 0 : d.offsetWidth;
        if (m !== void 0)
          return m;
      }
      n._UNSTABLE_usePivotColumns = ga, n.actions = h, n.defaultColumn = _, n.defaultGroupByFn = ua, n.defaultOrderByFn = Xi, n.defaultRenderer = w, n.emptyRenderer = P, n.ensurePluginOrder = L, n.flexRender = re, n.functionalUpdate = M, n.loopHooks = N, n.makePropGetter = k, n.makeRenderer = ge, n.reduceHooks = $, n.safeUseLayoutEffect = te, n.useAbsoluteLayout = Y, n.useAsyncDebounce = fe, n.useBlockLayout = Ie, n.useColumnOrder = y, n.useExpanded = An, n.useFilters = Et, n.useFlexLayout = Je, n.useGetLatest = D, n.useGlobalFilter = Hr, n.useGridLayout = ft, n.useGroupBy = qi, n.useMountedLayoutEffect = Q, n.usePagination = pa, n.useResizeColumns = A, n.useRowSelect = Ji, n.useRowState = Ca, n.useSortBy = fa, n.useTable = Mn, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(La, La.exports)), La.exports;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = pP() : e.exports = vP();
})(Co);
const gP = "_tableFilterContainer_113tz_1", mP = "_pagination_113tz_33", yP = "_icon_113tz_50", bP = "_alignRight_113tz_124", bi = {
  tableFilterContainer: gP,
  pagination: mP,
  icon: yP,
  alignRight: bP
}, uc = (e) => /* @__PURE__ */ $n.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ $n.createElement("path", {
  d: "M11.5 6H0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ $n.createElement("path", {
  d: "M7.5 10L11.5 6L7.5 2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
var It = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Table/DataTable.tsx";
const wP = ({
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
  const o = i.map((a) => /* @__PURE__ */ j("li", {
    value: e,
    onClick: () => {
      a = a === "ALL" ? void 0 : a, t(a || void 0);
    },
    children: a
  }, void 0, !1, {
    fileName: It,
    lineNumber: 28,
    columnNumber: 7
  }, void 0));
  return /* @__PURE__ */ j("ul", {
    children: o
  }, void 0, !1, {
    fileName: It,
    lineNumber: 42,
    columnNumber: 5
  }, void 0);
}, LT = ({
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
    canPreviousPage: p,
    canNextPage: h,
    pageOptions: w,
    pageCount: P,
    nextPage: _,
    previousPage: T,
    state: {
      pageIndex: B
    },
    preGlobalFilteredRows: k,
    setGlobalFilter: $
  } = Co.exports.useTable({
    columns: n,
    data: r
  }, Co.exports.useFilters, Co.exports.useGlobalFilter, Co.exports.usePagination);
  return /* @__PURE__ */ j(Fn, {
    children: [/* @__PURE__ */ j("div", {
      className: bi.tableFilterContainer,
      children: [/* @__PURE__ */ j("h3", {
        children: ["  ", 1, "-", P, " of ", r.length, " ", e, " "]
      }, void 0, !0, {
        fileName: It,
        lineNumber: 75,
        columnNumber: 11
      }, void 0), /* @__PURE__ */ j("ul", {
        children: /* @__PURE__ */ j(wP, {
          filterValue: void 0,
          setFilter: $,
          preFilteredRows: k,
          id: "type",
          filterData: t
        }, void 0, !1, {
          fileName: It,
          lineNumber: 77,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: It,
        lineNumber: 76,
        columnNumber: 11
      }, void 0)]
    }, void 0, !0, {
      fileName: It,
      lineNumber: 74,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ j("div", {
      children: /* @__PURE__ */ j("table", {
        ...o(),
        children: [/* @__PURE__ */ j("thead", {
          children: u.map((N) => /* @__PURE__ */ j("tr", {
            ...N.getHeaderGroupProps(),
            children: N.headers.map((L, M) => /* @__PURE__ */ j("th", {
              className: i - 1 === M ? bi.alignRight : "",
              ...L.getHeaderProps(),
              children: L.render("Header")
            }, void 0, !1, {
              fileName: It,
              lineNumber: 92,
              columnNumber: 19
            }, void 0))
          }, void 0, !1, {
            fileName: It,
            lineNumber: 90,
            columnNumber: 15
          }, void 0))
        }, void 0, !1, {
          fileName: It,
          lineNumber: 88,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ j("tbody", {
          ...a(),
          children: c.map((N, L) => (f(N), /* @__PURE__ */ j("tr", {
            ...N.getRowProps(),
            children: N.cells.map((M, D) => /* @__PURE__ */ j("td", {
              className: i - 1 === D ? bi.alignRight : "",
              ...M.getCellProps(),
              children: M.render("Cell")
            }, void 0, !1, {
              fileName: It,
              lineNumber: 103,
              columnNumber: 28
            }, void 0))
          }, void 0, !1, {
            fileName: It,
            lineNumber: 101,
            columnNumber: 17
          }, void 0)))
        }, void 0, !1, {
          fileName: It,
          lineNumber: 97,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: It,
        lineNumber: 87,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: It,
      lineNumber: 86,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ j("div", {
      className: bi.pagination,
      children: [/* @__PURE__ */ j("span", {
        children: ["Page", " ", /* @__PURE__ */ j("strong", {
          children: [B + 1, " of ", w.length]
        }, void 0, !0, {
          fileName: It,
          lineNumber: 114,
          columnNumber: 13
        }, void 0), " "]
      }, void 0, !0, {
        fileName: It,
        lineNumber: 112,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ j("span", {
        children: [/* @__PURE__ */ j("button", {
          onClick: () => T(),
          disabled: !p,
          children: /* @__PURE__ */ j(uc, {
            className: `${bi.icon}`
          }, void 0, !1, {
            fileName: It,
            lineNumber: 120,
            columnNumber: 11
          }, void 0)
        }, void 0, !1, {
          fileName: It,
          lineNumber: 119,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ j("button", {
          onClick: () => _(),
          disabled: !h,
          children: /* @__PURE__ */ j(uc, {
            className: `${bi.icon}`
          }, void 0, !1, {
            fileName: It,
            lineNumber: 123,
            columnNumber: 13
          }, void 0)
        }, void 0, !1, {
          fileName: It,
          lineNumber: 122,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: It,
        lineNumber: 118,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: It,
      lineNumber: 111,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0);
};
var xP = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Display/Display.tsx";
const jT = ({
  children: e,
  ...t
}) => {
  const r = Object.entries({
    extraSmall: "xs",
    small: "sm",
    medium: "md",
    large: "lg"
  }).reduce((a, [u, f]) => t[u] ? f : a, "lg"), i = t.className || "", o = `${r} ${i}`;
  return /* @__PURE__ */ j("h1", {
    ...t,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: xP,
    lineNumber: 35,
    columnNumber: 12
  }, void 0);
};
var _P = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Heading/Heading.tsx";
const GT = ({
  children: e,
  as: t,
  ...n
}) => /* @__PURE__ */ j(t || "h1", {
  ...n,
  children: e
}, void 0, !1, {
  fileName: _P,
  lineNumber: 14,
  columnNumber: 12
}, void 0), RP = "_outerContainer_l7wyv_1", SP = "_container_l7wyv_12", CP = "_navbar_l7wyv_25", PP = "_fade_l7wyv_35", TP = "_active_l7wyv_48", NP = "_navbarFixed_l7wyv_60", EP = "_fixed_l7wyv_70", MP = "_fluidity_l7wyv_78", Nr = {
  outerContainer: RP,
  container: SP,
  navbar: CP,
  fade: PP,
  active: TP,
  navbarFixed: NP,
  fixed: EP,
  fluidity: MP
};
var Gt = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/NavBar/NavBar.tsx";
const HT = ({
  logo: e,
  text: t,
  button: n,
  navLinks: r
}) => {
  const [i, o] = pr(!1), a = () => {
    o(!i);
  }, u = r.map((f) => /* @__PURE__ */ j("li", {
    children: [/* @__PURE__ */ j("a", {
      href: `/${f.name.replace(/\s+/g, "")}`,
      className: window.location.pathname.toString() === `/${f.name.replace(/\s+/g, "")}` ? Nr.active : "",
      children: f.name.toUpperCase()
    }, void 0, !1, {
      fileName: Gt,
      lineNumber: 44,
      columnNumber: 7
    }, void 0), f.modal && /* @__PURE__ */ j("button", {
      onClick: () => {
      },
      children: /* @__PURE__ */ j("img", {
        src: "./src/assets/images/triangleDown.svg",
        alt: "open resource options"
      }, void 0, !1, {
        fileName: Gt,
        lineNumber: 57,
        columnNumber: 11
      }, void 0)
    }, void 0, !1, {
      fileName: Gt,
      lineNumber: 56,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Gt,
    lineNumber: 43,
    columnNumber: 5
  }, void 0));
  return /* @__PURE__ */ j("div", {
    className: Nr.outerContainer,
    children: /* @__PURE__ */ j("div", {
      className: `${Nr.container} opacity-5x`,
      children: [/* @__PURE__ */ j("h2", {
        className: Nr.fluidity,
        children: t
      }, void 0, !1, {
        fileName: Gt,
        lineNumber: 70,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ j("div", {
        className: Nr.navbarFixed,
        children: /* @__PURE__ */ j("div", {
          className: Nr.fixed,
          children: [/* @__PURE__ */ j("div", {
            children: /* @__PURE__ */ j("a", {
              href: "/",
              children: /* @__PURE__ */ j("img", {
                src: e,
                alt: "home page"
              }, void 0, !1, {
                fileName: Gt,
                lineNumber: 76,
                columnNumber: 17
              }, void 0)
            }, void 0, !1, {
              fileName: Gt,
              lineNumber: 74,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Gt,
            lineNumber: 73,
            columnNumber: 13
          }, void 0), /* @__PURE__ */ j(UP, {
            version: n.version,
            type: n.type,
            size: n.size,
            handleClick: n.handleClick,
            children: n.children
          }, void 0, !1, {
            fileName: Gt,
            lineNumber: 80,
            columnNumber: 13
          }, void 0)]
        }, void 0, !0, {
          fileName: Gt,
          lineNumber: 72,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Gt,
        lineNumber: 71,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ j("div", {
        className: Nr.navbar,
        children: /* @__PURE__ */ j("div", {
          className: Nr.fade,
          children: [/* @__PURE__ */ j("nav", {
            children: /* @__PURE__ */ j("ul", {
              children: u
            }, void 0, !1, {
              fileName: Gt,
              lineNumber: 93,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Gt,
            lineNumber: 92,
            columnNumber: 13
          }, void 0), i && /* @__PURE__ */ j(iT, {
            handleModal: a,
            navLinks: OP
          }, void 0, !1, {
            fileName: Gt,
            lineNumber: 96,
            columnNumber: 15
          }, void 0)]
        }, void 0, !0, {
          fileName: Gt,
          lineNumber: 91,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Gt,
        lineNumber: 90,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Gt,
      lineNumber: 68,
      columnNumber: 7
    }, void 0)
  }, void 0, !1, {
    fileName: Gt,
    lineNumber: 67,
    columnNumber: 5
  }, void 0);
}, OP = [{
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
}], AP = (e) => /* @__PURE__ */ $n.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ $n.createElement("path", {
  d: "M6 11.5L6 0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ $n.createElement("path", {
  d: "M10 7.5L6 11.5L2 7.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), kP = "_button_frgyj_1", IP = "_icon_frgyj_17", $P = "_text_frgyj_21", ul = {
  button: kP,
  icon: IP,
  text: $P
};
var sl = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Button/AnchorButton/AnchorButton.tsx";
const BP = ({
  children: e,
  disabled: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ j("button", {
    className: `${ul.button} ${i}`,
    disabled: t,
    ...r,
    children: [/* @__PURE__ */ j(AP, {
      className: ul.icon
    }, void 0, !1, {
      fileName: sl,
      lineNumber: 17,
      columnNumber: 7
    }, void 0), " ", /* @__PURE__ */ j("div", {
      className: ul.text,
      children: e
    }, void 0, !1, {
      fileName: sl,
      lineNumber: 18,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0, {
    fileName: sl,
    lineNumber: 16,
    columnNumber: 5
  }, void 0);
}, FP = "_option_1fm9a_1", DP = "_optionSelected_1fm9a_1", Zh = {
  option: FP,
  optionSelected: DP
};
var Jh = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Button/FilterButton/FilterButton.tsx";
const zP = ({
  option: e,
  handleFilter: t,
  setOptions: n,
  options: r,
  disabled: i,
  className: o,
  ...a
}) => {
  const u = o || "", f = e.name.includes("any") ? "ANY" : e.name;
  return /* @__PURE__ */ j(Fn, {
    children: e.selected ? /* @__PURE__ */ j("button", {
      className: `${Zh.optionSelected} ${u}`,
      onClick: () => t(e, n, r),
      ...a,
      children: f
    }, void 0, !1, {
      fileName: Jh,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ j("button", {
      className: `${Zh.option} ${u}`,
      onClick: () => i !== !0 && t(e, n, r),
      disabled: i,
      ...a,
      children: f
    }, void 0, !1, {
      fileName: Jh,
      lineNumber: 51,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, LP = "_small_19zlh_9", jP = "_medium_19zlh_19", GP = "_large_19zlh_29", HP = "_primary_19zlh_38", WP = "_secondary_19zlh_62", Xr = {
  small: LP,
  medium: jP,
  large: GP,
  primary: HP,
  secondary: WP
};
var yo = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Button/GeneralButton/GeneralButton.tsx";
const UP = ({
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
  return pr(1), /* @__PURE__ */ j(Fn, {
    children: t === "primary" && n === "text" ? /* @__PURE__ */ j("button", {
      onClick: i,
      className: `${Xr.primary} ${Xr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 34,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon before" ? /* @__PURE__ */ j("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon after" ? /* @__PURE__ */ j("button", {
      onClick: i,
      className: `${Xr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 52,
      columnNumber: 9
    }, void 0) : n === "icon only" ? /* @__PURE__ */ j("button", {
      onClick: i,
      className: `${Xr.iconOnly} ${f}`,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: yo,
      lineNumber: 61,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ j("button", {
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
}, VP = (e) => /* @__PURE__ */ $n.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ $n.createElement("path", {
  d: "M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ $n.createElement("path", {
  d: "M6.5 0.5H11.5V5.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ $n.createElement("path", {
  d: "M11.5 0.5L5.5 6.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), qP = "_button_mr620_1", YP = "_icon_mr620_15", XP = "_text_mr620_23", KP = "_small_mr620_53", QP = "_medium_mr620_62", ZP = "_large_mr620_71", bo = {
  button: qP,
  icon: YP,
  text: XP,
  small: KP,
  medium: QP,
  large: ZP
};
var ja = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Button/LinkButton/LinkButton.tsx";
const Pm = ({
  children: e,
  size: t,
  type: n,
  handleClick: r,
  className: i,
  ...o
}) => {
  const a = i || "";
  return /* @__PURE__ */ j("button", {
    className: `${bo.button} ${a}`,
    onClick: r,
    ...o,
    children: [/* @__PURE__ */ j("div", {
      className: `${bo.text} ${bo[t]}`,
      children: e
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 34,
      columnNumber: 7
    }, void 0), n === "internal" ? /* @__PURE__ */ j(uc, {
      className: `${bo.icon} ${a}`
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 39,
      columnNumber: 13
    }, void 0) : /* @__PURE__ */ j(VP, {
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
}, JP = "_button_t6im8_1", eT = "_small_t6im8_47", ep = {
  button: JP,
  default: "_default_t6im8_40",
  small: eT
};
var tT = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Button/TabButton/TabButton.tsx";
const WT = ({
  children: e,
  size: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ j("button", {
    className: `${ep.button} ${ep[t]} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: tT,
    lineNumber: 18,
    columnNumber: 5
  }, void 0);
}, nT = "_container_1cljs_1", rT = "_socials_1cljs_21", tp = {
  container: nT,
  socials: rT
};
var Er = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/NavBarModal/NavBarModal.tsx";
const iT = ({
  handleModal: e,
  navLinks: t
}) => /* @__PURE__ */ j("div", {
  className: tp.container,
  children: [t.map((n) => /* @__PURE__ */ j("h4", {
    children: /* @__PURE__ */ j("a", {
      onClick: () => e(),
      href: `/resources#${n.children}`,
      children: /* @__PURE__ */ j(Pm, {
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
  }, void 0)), /* @__PURE__ */ j("div", {
    className: tp.socials,
    children: [/* @__PURE__ */ j("img", {
      src: "/assets/images/socials/twitter.svg"
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 35,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ j("img", {
      src: "/assets/images/socials/discord.svg"
    }, void 0, !1, {
      fileName: Er,
      lineNumber: 36,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ j("img", {
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
}, void 0), oT = "_container_1t5cv_1", aT = {
  container: oT
};
var Ga = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Navigation/Navigation.tsx";
const UT = ({
  pageLocations: e,
  page: t
}) => /* @__PURE__ */ j("div", {
  className: aT.container,
  children: e.map((n, r) => /* @__PURE__ */ j("h4", {
    children: /* @__PURE__ */ j("a", {
      href: `/${t}#${n.replace(/\s/g, "")}`,
      children: /* @__PURE__ */ j(BP, {
        children: n.toUpperCase()
      }, void 0, !1, {
        fileName: Ga,
        lineNumber: 17,
        columnNumber: 14
      }, void 0)
    }, void 0, !1, {
      fileName: Ga,
      lineNumber: 16,
      columnNumber: 11
    }, void 0)
  }, `anchor-${r}`, !1, {
    fileName: Ga,
    lineNumber: 15,
    columnNumber: 9
  }, void 0))
}, void 0, !1, {
  fileName: Ga,
  lineNumber: 13,
  columnNumber: 5
}, void 0), uT = "_grid_uwgxl_1", sT = "_left_uwgxl_14", lT = "_right_uwgxl_14", ll = {
  grid: uT,
  left: sT,
  right: lT
};
var cl = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/ReusableGrid/ReusableGrid.tsx";
const VT = ({
  left: e,
  right: t
}) => /* @__PURE__ */ j("div", {
  className: ll.grid,
  children: [/* @__PURE__ */ j("div", {
    className: ll.left,
    children: e
  }, void 0, !1, {
    fileName: cl,
    lineNumber: 11,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ j("div", {
    className: ll.right,
    children: t
  }, void 0, !1, {
    fileName: cl,
    lineNumber: 12,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: cl,
  lineNumber: 10,
  columnNumber: 5
}, void 0), cT = "_options_gf7vd_1", np = {
  options: cT
};
var Ha = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Filter/FilterCriteria/FilterCriteria.tsx";
const qT = ({
  children: e,
  options: t,
  handleFilter: n,
  setOptions: r
}) => /* @__PURE__ */ j("div", {
  className: np.container,
  children: [/* @__PURE__ */ j("h5", {
    children: e
  }, void 0, !1, {
    fileName: Ha,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ j("div", {
    className: np.options,
    children: t.map((i, o) => /* @__PURE__ */ j(zP, {
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
var vu = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Tab/Tab.tsx";
const YT = ({
  leading: e,
  children: t,
  active: n
}) => /* @__PURE__ */ j(Fn, {
  children: /* @__PURE__ */ j("ul", {
    children: /* @__PURE__ */ j("li", {}, void 0, !1, {
      fileName: vu,
      lineNumber: 19,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: vu,
    lineNumber: 18,
    columnNumber: 9
  }, void 0)
}, void 0, !1), XT = () => /* @__PURE__ */ j(Fn, {
  children: /* @__PURE__ */ j("ul", {
    children: /* @__PURE__ */ j("li", {}, void 0, !1, {
      fileName: vu,
      lineNumber: 29,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: vu,
    lineNumber: 28,
    columnNumber: 9
  }, void 0)
}, void 0, !1), fT = "_reverse_1786y_1", dT = "_row_1786y_5", rp = {
  reverse: fT,
  row: dT
};
var hT = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/Row/Row.tsx";
const KT = ({
  children: e,
  className: t,
  reverse: n,
  ...r
}) => {
  const i = t || "";
  return /* @__PURE__ */ j("div", {
    className: `${rp.row} ${n && rp.reverse} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: hT,
    lineNumber: 22,
    columnNumber: 5
  }, void 0);
}, pT = "_desktop_d7ypz_2", vT = {
  desktop: pT
};
var gT = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/DesktopOnly/DesktopOnly.tsx";
const QT = ({
  children: e,
  className: t,
  ...n
}) => {
  const r = t || "";
  return /* @__PURE__ */ j("div", {
    className: `${vT.desktop} ${r}`,
    ...n,
    children: e
  }, void 0, !1, {
    fileName: gT,
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
}, mT = "_gray_ecury_1", yT = "_box_ecury_5", bT = "_rounded_ecury_11", fl = {
  gray: mT,
  box: yT,
  rounded: bT
};
var wT = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/Card/Card.tsx";
const ZT = ({
  component: e,
  rounded: t,
  className: n,
  children: r,
  type: i,
  ...o
}) => {
  const a = n || "";
  return /* @__PURE__ */ j(e, {
    className: `${i === "box" ? fl.box : fl.gray} ${t && fl.rounded} ${a}`,
    ...o,
    children: r
  }, void 0, !1, {
    fileName: wT,
    lineNumber: 19,
    columnNumber: 5
  }, void 0);
}, xT = "_container_acmr2_1", _T = "_content_acmr2_7", ip = {
  container: xT,
  content: _T
};
var op = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/ManualCarousel/ManualCarousel.tsx";
const JT = ({
  children: e
}) => /* @__PURE__ */ j("div", {
  className: ip.container,
  children: /* @__PURE__ */ j("div", {
    className: ip.content,
    children: e
  }, void 0, !1, {
    fileName: op,
    lineNumber: 20,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: op,
  lineNumber: 19,
  columnNumber: 5
}, void 0), RT = "_winnersRight_1abi0_1", ST = "_winnersLeft_1abi0_1", CT = "_winnersRightLine_1abi0_14", PT = "_scrollRight_1abi0_1", TT = "_winnersLeftLine_1abi0_45", NT = "_scrollLeft_1abi0_1", ET = "_winnersTop_1abi0_70", MT = "_winnersTopLine_1abi0_84", OT = "_scrollUp_1abi0_1", wi = {
  winnersRight: RT,
  winnersLeft: ST,
  winnersRightLine: CT,
  scrollRight: PT,
  winnersLeftLine: TT,
  scrollLeft: NT,
  winnersTop: ET,
  winnersTopLine: MT,
  scrollUp: OT
};
var ap = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/ContinuousCarousel/ContinuousCarousel.tsx";
const eN = ({
  direction: e,
  children: t
}) => /* @__PURE__ */ j("div", {
  className: e === "right" ? `${wi.winnersRight}` : e === "left" ? `${wi.winnersLeft}` : `${wi.winnersTop}`,
  children: /* @__PURE__ */ j("div", {
    className: e === "right" ? `${wi.winnersRightLine}` : e === "left" ? `${wi.winnersLeftLine}` : `${wi.winnersTopLine}`,
    children: t
  }, void 0, !1, {
    fileName: ap,
    lineNumber: 27,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: ap,
  lineNumber: 18,
  columnNumber: 5
}, void 0), AT = "_container_1c71e_1", kT = {
  container: AT
};
var wo = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/FooterItem/FooterItem.tsx";
const tN = ({
  children: e,
  items: t
}) => {
  const n = /* @__PURE__ */ j("ul", {
    children: t.map((r) => /* @__PURE__ */ j("li", {
      children: /* @__PURE__ */ j(Pm, {
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
  return /* @__PURE__ */ j("div", {
    className: kT.container,
    children: [/* @__PURE__ */ j("h1", {
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
}, IT = "_container_1atnk_1", $T = {
  container: IT
};
var Wa = "/Users/joshuasteele/fluidity/fluidity-app/web/surfing/src/components/Container/Partner/Partner.tsx";
const nN = ({
  img: e,
  title: t,
  info: n
}) => /* @__PURE__ */ j("div", {
  className: $T.container,
  children: [/* @__PURE__ */ j("div", {
    children: e
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 16,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ j("h3", {
    children: t
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 17,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ j("p", {
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
export {
  BP as AnchorButton,
  ZT as Card,
  eN as ContinuousCarousel,
  LT as DataTable,
  QT as DesktopOnly,
  jT as Display,
  zP as FilterButton,
  qT as FilterCriteria,
  tN as FooterItem,
  UP as GeneralButton,
  GT as Heading,
  zT as LineChart,
  Pm as LinkButton,
  JT as ManualCarousel,
  HT as NavBar,
  iT as NavBarModal,
  UT as Navigation,
  nN as Partner,
  VT as ReusableGrid,
  KT as Row,
  YT as Tab,
  XT as TabBar,
  WT as TabButton
};
