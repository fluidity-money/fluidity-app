import * as Tt from "react";
import yn, { useRef as Jt, useState as Lr, useMemo as Vt, useEffect as on, useLayoutEffect as zg, forwardRef as Gg, useCallback as xt, useContext as sn, createContext as gh } from "react";
import yh, { unstable_batchedUpdates as jg } from "react-dom";
var Si = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qo(e) {
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
var ke = { exports: {} }, _s = { exports: {} }, Ct = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bf;
function Hg() {
  if (Bf)
    return Ct;
  Bf = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, N = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, P = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, $ = e ? Symbol.for("react.scope") : 60119;
  function T(M) {
    if (typeof M == "object" && M !== null) {
      var L = M.$$typeof;
      switch (L) {
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
                case N:
                case a:
                  return M;
                default:
                  return L;
              }
          }
        case n:
          return L;
      }
    }
  }
  function G(M) {
    return T(M) === c;
  }
  return Ct.AsyncMode = f, Ct.ConcurrentMode = c, Ct.ContextConsumer = u, Ct.ContextProvider = a, Ct.Element = t, Ct.ForwardRef = h, Ct.Fragment = r, Ct.Lazy = _, Ct.Memo = N, Ct.Portal = n, Ct.Profiler = o, Ct.StrictMode = i, Ct.Suspense = p, Ct.isAsyncMode = function(M) {
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
    return T(M) === N;
  }, Ct.isPortal = function(M) {
    return T(M) === n;
  }, Ct.isProfiler = function(M) {
    return T(M) === o;
  }, Ct.isStrictMode = function(M) {
    return T(M) === i;
  }, Ct.isSuspense = function(M) {
    return T(M) === p;
  }, Ct.isValidElementType = function(M) {
    return typeof M == "string" || typeof M == "function" || M === r || M === c || M === o || M === i || M === p || M === w || typeof M == "object" && M !== null && (M.$$typeof === _ || M.$$typeof === N || M.$$typeof === a || M.$$typeof === u || M.$$typeof === h || M.$$typeof === I || M.$$typeof === k || M.$$typeof === $ || M.$$typeof === P);
  }, Ct.typeOf = T, Ct;
}
var Nt = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var If;
function Wg() {
  return If || (If = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, u = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, w = e ? Symbol.for("react.suspense_list") : 60120, N = e ? Symbol.for("react.memo") : 60115, _ = e ? Symbol.for("react.lazy") : 60116, P = e ? Symbol.for("react.block") : 60121, I = e ? Symbol.for("react.fundamental") : 60117, k = e ? Symbol.for("react.responder") : 60118, $ = e ? Symbol.for("react.scope") : 60119;
    function T(D) {
      return typeof D == "string" || typeof D == "function" || D === r || D === c || D === o || D === i || D === p || D === w || typeof D == "object" && D !== null && (D.$$typeof === _ || D.$$typeof === N || D.$$typeof === a || D.$$typeof === u || D.$$typeof === h || D.$$typeof === I || D.$$typeof === k || D.$$typeof === $ || D.$$typeof === P);
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
                  case N:
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
    var M = f, L = c, te = u, Q = a, fe = t, ve = h, re = r, ee = _, be = N, Oe = n, ut = o, Ve = i, st = p, lt = !1;
    function dt(D) {
      return lt || (lt = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), U(D) || G(D) === f;
    }
    function U(D) {
      return G(D) === c;
    }
    function ue(D) {
      return G(D) === u;
    }
    function Pe(D) {
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
    function Ie(D) {
      return G(D) === N;
    }
    function ze(D) {
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
    Nt.AsyncMode = M, Nt.ConcurrentMode = L, Nt.ContextConsumer = te, Nt.ContextProvider = Q, Nt.Element = fe, Nt.ForwardRef = ve, Nt.Fragment = re, Nt.Lazy = ee, Nt.Memo = be, Nt.Portal = Oe, Nt.Profiler = ut, Nt.StrictMode = Ve, Nt.Suspense = st, Nt.isAsyncMode = dt, Nt.isConcurrentMode = U, Nt.isContextConsumer = ue, Nt.isContextProvider = Pe, Nt.isElement = Ae, Nt.isForwardRef = Ce, Nt.isFragment = Re, Nt.isLazy = Te, Nt.isMemo = Ie, Nt.isPortal = ze, Nt.isProfiler = X, Nt.isStrictMode = ce, Nt.isSuspense = Ge, Nt.isValidElementType = T, Nt.typeOf = G;
  }()), Nt;
}
var Df;
function bh() {
  return Df || (Df = 1, function(e) {
    process.env.NODE_ENV === "production" ? e.exports = Hg() : e.exports = Wg();
  }(_s)), _s.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Ss, Lf;
function pc() {
  if (Lf)
    return Ss;
  Lf = 1;
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
  return Ss = i() ? Object.assign : function(o, a) {
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
  }, Ss;
}
var Rs, zf;
function hc() {
  if (zf)
    return Rs;
  zf = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Rs = e, Rs;
}
var Cs, Gf;
function wh() {
  return Gf || (Gf = 1, Cs = Function.call.bind(Object.prototype.hasOwnProperty)), Cs;
}
var Ns, jf;
function Vg() {
  if (jf)
    return Ns;
  jf = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = hc(), n = {}, r = wh();
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
            var N = c ? c() : "";
            e(
              "Failed " + u + " type: " + p.message + (N != null ? N : "")
            );
          }
        }
    }
  }
  return i.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, Ns = i, Ns;
}
var Ps, Hf;
function Ug() {
  if (Hf)
    return Ps;
  Hf = 1;
  var e = bh(), t = pc(), n = hc(), r = wh(), i = Vg(), o = function() {
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
    function p(U) {
      var ue = U && (c && U[c] || U[h]);
      if (typeof ue == "function")
        return ue;
    }
    var w = "<<anonymous>>", N = {
      array: k("array"),
      bigint: k("bigint"),
      bool: k("boolean"),
      func: k("function"),
      number: k("number"),
      object: k("object"),
      string: k("string"),
      symbol: k("symbol"),
      any: $(),
      arrayOf: T,
      element: G(),
      elementType: M(),
      instanceOf: L,
      node: ve(),
      objectOf: Q,
      oneOf: te,
      oneOfType: fe,
      shape: ee,
      exact: be
    };
    function _(U, ue) {
      return U === ue ? U !== 0 || 1 / U === 1 / ue : U !== U && ue !== ue;
    }
    function P(U, ue) {
      this.message = U, this.data = ue && typeof ue == "object" ? ue : {}, this.stack = "";
    }
    P.prototype = Error.prototype;
    function I(U) {
      if (process.env.NODE_ENV !== "production")
        var ue = {}, Pe = 0;
      function Ae(Re, Te, Ie, ze, X, ce, Ge) {
        if (ze = ze || w, ce = ce || Ie, Ge !== n) {
          if (f) {
            var D = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw D.name = "Invariant Violation", D;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var gt = ze + ":" + Ie;
            !ue[gt] && Pe < 3 && (o(
              "You are manually calling a React.PropTypes validation function for the `" + ce + "` prop on `" + ze + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), ue[gt] = !0, Pe++);
          }
        }
        return Te[Ie] == null ? Re ? Te[Ie] === null ? new P("The " + X + " `" + ce + "` is marked as required " + ("in `" + ze + "`, but its value is `null`.")) : new P("The " + X + " `" + ce + "` is marked as required in " + ("`" + ze + "`, but its value is `undefined`.")) : null : U(Te, Ie, ze, X, ce);
      }
      var Ce = Ae.bind(null, !1);
      return Ce.isRequired = Ae.bind(null, !0), Ce;
    }
    function k(U) {
      function ue(Pe, Ae, Ce, Re, Te, Ie) {
        var ze = Pe[Ae], X = Ve(ze);
        if (X !== U) {
          var ce = st(ze);
          return new P(
            "Invalid " + Re + " `" + Te + "` of type " + ("`" + ce + "` supplied to `" + Ce + "`, expected ") + ("`" + U + "`."),
            { expectedType: U }
          );
        }
        return null;
      }
      return I(ue);
    }
    function $() {
      return I(a);
    }
    function T(U) {
      function ue(Pe, Ae, Ce, Re, Te) {
        if (typeof U != "function")
          return new P("Property `" + Te + "` of component `" + Ce + "` has invalid PropType notation inside arrayOf.");
        var Ie = Pe[Ae];
        if (!Array.isArray(Ie)) {
          var ze = Ve(Ie);
          return new P("Invalid " + Re + " `" + Te + "` of type " + ("`" + ze + "` supplied to `" + Ce + "`, expected an array."));
        }
        for (var X = 0; X < Ie.length; X++) {
          var ce = U(Ie, X, Ce, Re, Te + "[" + X + "]", n);
          if (ce instanceof Error)
            return ce;
        }
        return null;
      }
      return I(ue);
    }
    function G() {
      function U(ue, Pe, Ae, Ce, Re) {
        var Te = ue[Pe];
        if (!u(Te)) {
          var Ie = Ve(Te);
          return new P("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Ie + "` supplied to `" + Ae + "`, expected a single ReactElement."));
        }
        return null;
      }
      return I(U);
    }
    function M() {
      function U(ue, Pe, Ae, Ce, Re) {
        var Te = ue[Pe];
        if (!e.isValidElementType(Te)) {
          var Ie = Ve(Te);
          return new P("Invalid " + Ce + " `" + Re + "` of type " + ("`" + Ie + "` supplied to `" + Ae + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return I(U);
    }
    function L(U) {
      function ue(Pe, Ae, Ce, Re, Te) {
        if (!(Pe[Ae] instanceof U)) {
          var Ie = U.name || w, ze = dt(Pe[Ae]);
          return new P("Invalid " + Re + " `" + Te + "` of type " + ("`" + ze + "` supplied to `" + Ce + "`, expected ") + ("instance of `" + Ie + "`."));
        }
        return null;
      }
      return I(ue);
    }
    function te(U) {
      if (!Array.isArray(U))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? o(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : o("Invalid argument supplied to oneOf, expected an array.")), a;
      function ue(Pe, Ae, Ce, Re, Te) {
        for (var Ie = Pe[Ae], ze = 0; ze < U.length; ze++)
          if (_(Ie, U[ze]))
            return null;
        var X = JSON.stringify(U, function(Ge, D) {
          var gt = st(D);
          return gt === "symbol" ? String(D) : D;
        });
        return new P("Invalid " + Re + " `" + Te + "` of value `" + String(Ie) + "` " + ("supplied to `" + Ce + "`, expected one of " + X + "."));
      }
      return I(ue);
    }
    function Q(U) {
      function ue(Pe, Ae, Ce, Re, Te) {
        if (typeof U != "function")
          return new P("Property `" + Te + "` of component `" + Ce + "` has invalid PropType notation inside objectOf.");
        var Ie = Pe[Ae], ze = Ve(Ie);
        if (ze !== "object")
          return new P("Invalid " + Re + " `" + Te + "` of type " + ("`" + ze + "` supplied to `" + Ce + "`, expected an object."));
        for (var X in Ie)
          if (r(Ie, X)) {
            var ce = U(Ie, X, Ce, Re, Te + "." + X, n);
            if (ce instanceof Error)
              return ce;
          }
        return null;
      }
      return I(ue);
    }
    function fe(U) {
      if (!Array.isArray(U))
        return process.env.NODE_ENV !== "production" && o("Invalid argument supplied to oneOfType, expected an instance of array."), a;
      for (var ue = 0; ue < U.length; ue++) {
        var Pe = U[ue];
        if (typeof Pe != "function")
          return o(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + lt(Pe) + " at index " + ue + "."
          ), a;
      }
      function Ae(Ce, Re, Te, Ie, ze) {
        for (var X = [], ce = 0; ce < U.length; ce++) {
          var Ge = U[ce], D = Ge(Ce, Re, Te, Ie, ze, n);
          if (D == null)
            return null;
          D.data && r(D.data, "expectedType") && X.push(D.data.expectedType);
        }
        var gt = X.length > 0 ? ", expected one of type [" + X.join(", ") + "]" : "";
        return new P("Invalid " + Ie + " `" + ze + "` supplied to " + ("`" + Te + "`" + gt + "."));
      }
      return I(Ae);
    }
    function ve() {
      function U(ue, Pe, Ae, Ce, Re) {
        return Oe(ue[Pe]) ? null : new P("Invalid " + Ce + " `" + Re + "` supplied to " + ("`" + Ae + "`, expected a ReactNode."));
      }
      return I(U);
    }
    function re(U, ue, Pe, Ae, Ce) {
      return new P(
        (U || "React class") + ": " + ue + " type `" + Pe + "." + Ae + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + Ce + "`."
      );
    }
    function ee(U) {
      function ue(Pe, Ae, Ce, Re, Te) {
        var Ie = Pe[Ae], ze = Ve(Ie);
        if (ze !== "object")
          return new P("Invalid " + Re + " `" + Te + "` of type `" + ze + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        for (var X in U) {
          var ce = U[X];
          if (typeof ce != "function")
            return re(Ce, Re, Te, X, st(ce));
          var Ge = ce(Ie, X, Ce, Re, Te + "." + X, n);
          if (Ge)
            return Ge;
        }
        return null;
      }
      return I(ue);
    }
    function be(U) {
      function ue(Pe, Ae, Ce, Re, Te) {
        var Ie = Pe[Ae], ze = Ve(Ie);
        if (ze !== "object")
          return new P("Invalid " + Re + " `" + Te + "` of type `" + ze + "` " + ("supplied to `" + Ce + "`, expected `object`."));
        var X = t({}, Pe[Ae], U);
        for (var ce in X) {
          var Ge = U[ce];
          if (r(U, ce) && typeof Ge != "function")
            return re(Ce, Re, Te, ce, st(Ge));
          if (!Ge)
            return new P(
              "Invalid " + Re + " `" + Te + "` key `" + ce + "` supplied to `" + Ce + "`.\nBad object: " + JSON.stringify(Pe[Ae], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(U), null, "  ")
            );
          var D = Ge(Ie, ce, Ce, Re, Te + "." + ce, n);
          if (D)
            return D;
        }
        return null;
      }
      return I(ue);
    }
    function Oe(U) {
      switch (typeof U) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !U;
        case "object":
          if (Array.isArray(U))
            return U.every(Oe);
          if (U === null || u(U))
            return !0;
          var ue = p(U);
          if (ue) {
            var Pe = ue.call(U), Ae;
            if (ue !== U.entries) {
              for (; !(Ae = Pe.next()).done; )
                if (!Oe(Ae.value))
                  return !1;
            } else
              for (; !(Ae = Pe.next()).done; ) {
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
    function ut(U, ue) {
      return U === "symbol" ? !0 : ue ? ue["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && ue instanceof Symbol : !1;
    }
    function Ve(U) {
      var ue = typeof U;
      return Array.isArray(U) ? "array" : U instanceof RegExp ? "object" : ut(ue, U) ? "symbol" : ue;
    }
    function st(U) {
      if (typeof U > "u" || U === null)
        return "" + U;
      var ue = Ve(U);
      if (ue === "object") {
        if (U instanceof Date)
          return "date";
        if (U instanceof RegExp)
          return "regexp";
      }
      return ue;
    }
    function lt(U) {
      var ue = st(U);
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
    function dt(U) {
      return !U.constructor || !U.constructor.name ? w : U.constructor.name;
    }
    return N.checkPropTypes = i, N.resetWarningCache = i.resetWarningCache, N.PropTypes = N, N;
  }, Ps;
}
var Ts, Wf;
function qg() {
  if (Wf)
    return Ts;
  Wf = 1;
  var e = hc();
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
  var Yg = bh(), Xg = !0;
  ke.exports = Ug()(Yg.isElement, Xg);
} else
  ke.exports = qg()();
var mc = { exports: {} }, oo = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vf;
function Kg() {
  if (Vf)
    return oo;
  if (Vf = 1, pc(), oo.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var e = Symbol.for;
    oo.Fragment = e("react.fragment");
  }
  return oo.jsxDEV = void 0, oo;
}
var Es = {};
/** @license React v17.0.2
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Uf;
function Qg() {
  return Uf || (Uf = 1, function(e) {
    process.env.NODE_ENV !== "production" && function() {
      var t = yn, n = pc(), r = 60103, i = 60106;
      e.Fragment = 60107;
      var o = 60108, a = 60114, u = 60109, f = 60110, c = 60112, h = 60113, p = 60120, w = 60115, N = 60116, _ = 60121, P = 60122, I = 60117, k = 60129, $ = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var T = Symbol.for;
        r = T("react.element"), i = T("react.portal"), e.Fragment = T("react.fragment"), o = T("react.strict_mode"), a = T("react.profiler"), u = T("react.provider"), f = T("react.context"), c = T("react.forward_ref"), h = T("react.suspense"), p = T("react.suspense_list"), w = T("react.memo"), N = T("react.lazy"), _ = T("react.block"), P = T("react.server.block"), I = T("react.fundamental"), T("react.scope"), T("react.opaque.id"), k = T("react.debug_trace_mode"), T("react.offscreen"), $ = T("react.legacy_hidden");
      }
      var G = typeof Symbol == "function" && Symbol.iterator, M = "@@iterator";
      function L(O) {
        if (O === null || typeof O != "object")
          return null;
        var J = G && O[G] || O[M];
        return typeof J == "function" ? J : null;
      }
      var te = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function Q(O) {
        {
          for (var J = arguments.length, he = new Array(J > 1 ? J - 1 : 0), Le = 1; Le < J; Le++)
            he[Le - 1] = arguments[Le];
          fe("error", O, he);
        }
      }
      function fe(O, J, he) {
        {
          var Le = te.ReactDebugCurrentFrame, ht = Le.getStackAddendum();
          ht !== "" && (J += "%s", he = he.concat([ht]));
          var yt = he.map(function(ot) {
            return "" + ot;
          });
          yt.unshift("Warning: " + J), Function.prototype.apply.call(console[O], console, yt);
        }
      }
      var ve = !1;
      function re(O) {
        return !!(typeof O == "string" || typeof O == "function" || O === e.Fragment || O === a || O === k || O === o || O === h || O === p || O === $ || ve || typeof O == "object" && O !== null && (O.$$typeof === N || O.$$typeof === w || O.$$typeof === u || O.$$typeof === f || O.$$typeof === c || O.$$typeof === I || O.$$typeof === _ || O[0] === P));
      }
      function ee(O, J, he) {
        var Le = J.displayName || J.name || "";
        return O.displayName || (Le !== "" ? he + "(" + Le + ")" : he);
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
            case N: {
              var Le = O, ht = Le._payload, yt = Le._init;
              try {
                return Oe(yt(ht));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var ut = 0, Ve, st, lt, dt, U, ue, Pe;
      function Ae() {
      }
      Ae.__reactDisabledLog = !0;
      function Ce() {
        {
          if (ut === 0) {
            Ve = console.log, st = console.info, lt = console.warn, dt = console.error, U = console.group, ue = console.groupCollapsed, Pe = console.groupEnd;
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
                value: Ve
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
                value: U
              }),
              groupCollapsed: n({}, O, {
                value: ue
              }),
              groupEnd: n({}, O, {
                value: Pe
              })
            });
          }
          ut < 0 && Q("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Te = te.ReactCurrentDispatcher, Ie;
      function ze(O, J, he) {
        {
          if (Ie === void 0)
            try {
              throw Error();
            } catch (ht) {
              var Le = ht.stack.trim().match(/\n( *(at )?)/);
              Ie = Le && Le[1] || "";
            }
          return `
` + Ie + O;
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
        var Le;
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
              } catch (fn) {
                Le = fn;
              }
              Reflect.construct(O, [], ot);
            } else {
              try {
                ot.call();
              } catch (fn) {
                Le = fn;
              }
              O.call(ot.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (fn) {
              Le = fn;
            }
            O();
          }
        } catch (fn) {
          if (fn && Le && typeof fn.stack == "string") {
            for (var rt = fn.stack.split(`
`), Ft = Le.stack.split(`
`), Pt = rt.length - 1, Ot = Ft.length - 1; Pt >= 1 && Ot >= 0 && rt[Pt] !== Ft[Ot]; )
              Ot--;
            for (; Pt >= 1 && Ot >= 0; Pt--, Ot--)
              if (rt[Pt] !== Ft[Ot]) {
                if (Pt !== 1 || Ot !== 1)
                  do
                    if (Pt--, Ot--, Ot < 0 || rt[Pt] !== Ft[Ot]) {
                      var mn = `
` + rt[Pt].replace(" at new ", " at ");
                      return typeof O == "function" && ce.set(O, mn), mn;
                    }
                  while (Pt >= 1 && Ot >= 0);
                break;
              }
          }
        } finally {
          X = !1, Te.current = yt, Re(), Error.prepareStackTrace = ht;
        }
        var Un = O ? O.displayName || O.name : "", Wr = Un ? ze(Un) : "";
        return typeof O == "function" && ce.set(O, Wr), Wr;
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
          return ze(O);
        switch (O) {
          case h:
            return ze("Suspense");
          case p:
            return ze("SuspenseList");
        }
        if (typeof O == "object")
          switch (O.$$typeof) {
            case c:
              return gt(O.render);
            case w:
              return St(O.type, J, he);
            case _:
              return gt(O._render);
            case N: {
              var Le = O, ht = Le._payload, yt = Le._init;
              try {
                return St(yt(ht), J, he);
              } catch {
              }
            }
          }
        return "";
      }
      var kt = {}, en = te.ReactDebugCurrentFrame;
      function ln(O) {
        if (O) {
          var J = O._owner, he = St(O.type, O._source, J ? J.type : null);
          en.setExtraStackFrame(he);
        } else
          en.setExtraStackFrame(null);
      }
      function wn(O, J, he, Le, ht) {
        {
          var yt = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var ot in O)
            if (yt(O, ot)) {
              var rt = void 0;
              try {
                if (typeof O[ot] != "function") {
                  var Ft = Error((Le || "React class") + ": " + he + " type `" + ot + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof O[ot] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ft.name = "Invariant Violation", Ft;
                }
                rt = O[ot](J, ot, Le, he, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Pt) {
                rt = Pt;
              }
              rt && !(rt instanceof Error) && (ln(ht), Q("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Le || "React class", he, ot, typeof rt), ln(null)), rt instanceof Error && !(rt.message in kt) && (kt[rt.message] = !0, ln(ht), Q("Failed %s type: %s", he, rt.message), ln(null));
            }
        }
      }
      var xn = te.ReactCurrentOwner, _n = Object.prototype.hasOwnProperty, zn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, or, Gn, Sn;
      Sn = {};
      function Xt(O) {
        if (_n.call(O, "ref")) {
          var J = Object.getOwnPropertyDescriptor(O, "ref").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.ref !== void 0;
      }
      function An(O) {
        if (_n.call(O, "key")) {
          var J = Object.getOwnPropertyDescriptor(O, "key").get;
          if (J && J.isReactWarning)
            return !1;
        }
        return O.key !== void 0;
      }
      function ar(O, J) {
        if (typeof O.ref == "string" && xn.current && J && xn.current.stateNode !== J) {
          var he = Oe(xn.current.type);
          Sn[he] || (Q('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Oe(xn.current.type), O.ref), Sn[he] = !0);
        }
      }
      function yr(O, J) {
        {
          var he = function() {
            or || (or = !0, Q("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", J));
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
      var ur = function(O, J, he, Le, ht, yt, ot) {
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
          value: Le
        }), Object.defineProperty(rt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ht
        }), Object.freeze && (Object.freeze(rt.props), Object.freeze(rt)), rt;
      };
      function wr(O, J, he, Le, ht) {
        {
          var yt, ot = {}, rt = null, Ft = null;
          he !== void 0 && (rt = "" + he), An(J) && (rt = "" + J.key), Xt(J) && (Ft = J.ref, ar(J, ht));
          for (yt in J)
            _n.call(J, yt) && !zn.hasOwnProperty(yt) && (ot[yt] = J[yt]);
          if (O && O.defaultProps) {
            var Pt = O.defaultProps;
            for (yt in Pt)
              ot[yt] === void 0 && (ot[yt] = Pt[yt]);
          }
          if (rt || Ft) {
            var Ot = typeof O == "function" ? O.displayName || O.name || "Unknown" : O;
            rt && yr(ot, Ot), Ft && br(ot, Ot);
          }
          return ur(O, rt, Ft, ht, Le, xn.current, ot);
        }
      }
      var jn = te.ReactCurrentOwner, Hn = te.ReactDebugCurrentFrame;
      function cn(O) {
        if (O) {
          var J = O._owner, he = St(O.type, O._source, J ? J.type : null);
          Hn.setExtraStackFrame(he);
        } else
          Hn.setExtraStackFrame(null);
      }
      var Rn;
      Rn = !1;
      function kn(O) {
        return typeof O == "object" && O !== null && O.$$typeof === r;
      }
      function Fn() {
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
      function sr(O) {
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
      function lr(O) {
        {
          var J = Fn();
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
          var he = lr(J);
          if ($n[he])
            return;
          $n[he] = !0;
          var Le = "";
          O && O._owner && O._owner !== jn.current && (Le = " It was passed a child from " + Oe(O._owner.type) + "."), cn(O), Q('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', he, Le), cn(null);
        }
      }
      function Vn(O, J) {
        {
          if (typeof O != "object")
            return;
          if (Array.isArray(O))
            for (var he = 0; he < O.length; he++) {
              var Le = O[he];
              kn(Le) && Wn(Le, J);
            }
          else if (kn(O))
            O._store && (O._store.validated = !0);
          else if (O) {
            var ht = L(O);
            if (typeof ht == "function" && ht !== O.entries)
              for (var yt = ht.call(O), ot; !(ot = yt.next()).done; )
                kn(ot.value) && Wn(ot.value, J);
          }
        }
      }
      function Cn(O) {
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
            var Le = Oe(J);
            wn(he, O.props, "prop", Le, O);
          } else if (J.PropTypes !== void 0 && !Rn) {
            Rn = !0;
            var ht = Oe(J);
            Q("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ht || "Unknown");
          }
          typeof J.getDefaultProps == "function" && !J.getDefaultProps.isReactClassApproved && Q("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function xr(O) {
        {
          for (var J = Object.keys(O.props), he = 0; he < J.length; he++) {
            var Le = J[he];
            if (Le !== "children" && Le !== "key") {
              cn(O), Q("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Le), cn(null);
              break;
            }
          }
          O.ref !== null && (cn(O), Q("Invalid attribute `ref` supplied to `React.Fragment`."), cn(null));
        }
      }
      function jt(O, J, he, Le, ht, yt) {
        {
          var ot = re(O);
          if (!ot) {
            var rt = "";
            (O === void 0 || typeof O == "object" && O !== null && Object.keys(O).length === 0) && (rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var Ft = sr(ht);
            Ft ? rt += Ft : rt += Fn();
            var Pt;
            O === null ? Pt = "null" : Array.isArray(O) ? Pt = "array" : O !== void 0 && O.$$typeof === r ? (Pt = "<" + (Oe(O.type) || "Unknown") + " />", rt = " Did you accidentally export a JSX literal instead of a component?") : Pt = typeof O, Q("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Pt, rt);
          }
          var Ot = wr(O, J, he, ht, yt);
          if (Ot == null)
            return Ot;
          if (ot) {
            var mn = J.children;
            if (mn !== void 0)
              if (Le)
                if (Array.isArray(mn)) {
                  for (var Un = 0; Un < mn.length; Un++)
                    Vn(mn[Un], O);
                  Object.freeze && Object.freeze(mn);
                } else
                  Q("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Vn(mn, O);
          }
          return O === e.Fragment ? xr(Ot) : Cn(Ot), Ot;
        }
      }
      var Kt = jt;
      e.jsxDEV = Kt;
    }();
  }(Es)), Es;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = Kg() : e.exports = Qg();
})(mc);
const Ln = mc.exports.Fragment, B = mc.exports.jsxDEV;
function Zg(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var xh = Zg, Jg = typeof Si == "object" && Si && Si.Object === Object && Si, e0 = Jg, t0 = e0, n0 = typeof self == "object" && self && self.Object === Object && self, r0 = t0 || n0 || Function("return this")(), _h = r0, i0 = _h, o0 = function() {
  return i0.Date.now();
}, a0 = o0, u0 = /\s/;
function s0(e) {
  for (var t = e.length; t-- && u0.test(e.charAt(t)); )
    ;
  return t;
}
var l0 = s0, c0 = l0, f0 = /^\s+/;
function d0(e) {
  return e && e.slice(0, c0(e) + 1).replace(f0, "");
}
var p0 = d0, h0 = _h, m0 = h0.Symbol, Sh = m0, qf = Sh, Rh = Object.prototype, v0 = Rh.hasOwnProperty, g0 = Rh.toString, ao = qf ? qf.toStringTag : void 0;
function y0(e) {
  var t = v0.call(e, ao), n = e[ao];
  try {
    e[ao] = void 0;
    var r = !0;
  } catch {
  }
  var i = g0.call(e);
  return r && (t ? e[ao] = n : delete e[ao]), i;
}
var b0 = y0, w0 = Object.prototype, x0 = w0.toString;
function _0(e) {
  return x0.call(e);
}
var S0 = _0, Yf = Sh, R0 = b0, C0 = S0, N0 = "[object Null]", P0 = "[object Undefined]", Xf = Yf ? Yf.toStringTag : void 0;
function T0(e) {
  return e == null ? e === void 0 ? P0 : N0 : Xf && Xf in Object(e) ? R0(e) : C0(e);
}
var E0 = T0;
function M0(e) {
  return e != null && typeof e == "object";
}
var O0 = M0, A0 = E0, k0 = O0, F0 = "[object Symbol]";
function $0(e) {
  return typeof e == "symbol" || k0(e) && A0(e) == F0;
}
var B0 = $0, I0 = p0, Kf = xh, D0 = B0, Qf = 0 / 0, L0 = /^[-+]0x[0-9a-f]+$/i, z0 = /^0b[01]+$/i, G0 = /^0o[0-7]+$/i, j0 = parseInt;
function H0(e) {
  if (typeof e == "number")
    return e;
  if (D0(e))
    return Qf;
  if (Kf(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Kf(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = I0(e);
  var n = z0.test(e);
  return n || G0.test(e) ? j0(e.slice(2), n ? 2 : 8) : L0.test(e) ? Qf : +e;
}
var W0 = H0, V0 = xh, Ms = a0, Zf = W0, U0 = "Expected a function", q0 = Math.max, Y0 = Math.min;
function X0(e, t, n) {
  var r, i, o, a, u, f, c = 0, h = !1, p = !1, w = !0;
  if (typeof e != "function")
    throw new TypeError(U0);
  t = Zf(t) || 0, V0(n) && (h = !!n.leading, p = "maxWait" in n, o = p ? q0(Zf(n.maxWait) || 0, t) : o, w = "trailing" in n ? !!n.trailing : w);
  function N(L) {
    var te = r, Q = i;
    return r = i = void 0, c = L, a = e.apply(Q, te), a;
  }
  function _(L) {
    return c = L, u = setTimeout(k, t), h ? N(L) : a;
  }
  function P(L) {
    var te = L - f, Q = L - c, fe = t - te;
    return p ? Y0(fe, o - Q) : fe;
  }
  function I(L) {
    var te = L - f, Q = L - c;
    return f === void 0 || te >= t || te < 0 || p && Q >= o;
  }
  function k() {
    var L = Ms();
    if (I(L))
      return $(L);
    u = setTimeout(k, P(L));
  }
  function $(L) {
    return u = void 0, w && r ? N(L) : (r = i = void 0, a);
  }
  function T() {
    u !== void 0 && clearTimeout(u), c = 0, r = f = i = u = void 0;
  }
  function G() {
    return u === void 0 ? a : $(Ms());
  }
  function M() {
    var L = Ms(), te = I(L);
    if (r = arguments, i = this, f = L, te) {
      if (u === void 0)
        return _(f);
      if (p)
        return clearTimeout(u), u = setTimeout(k, t), N(f);
    }
    return u === void 0 && (u = setTimeout(k, t)), a;
  }
  return M.cancel = T, M.flush = G, M;
}
var Ch = X0;
const vc = Ch;
var ei = [], K0 = function() {
  return ei.some(function(e) {
    return e.activeTargets.length > 0;
  });
}, Q0 = function() {
  return ei.some(function(e) {
    return e.skippedTargets.length > 0;
  });
}, Jf = "ResizeObserver loop completed with undelivered notifications.", Z0 = function() {
  var e;
  typeof ErrorEvent == "function" ? e = new ErrorEvent("error", {
    message: Jf
  }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = Jf), window.dispatchEvent(e);
}, Fo;
(function(e) {
  e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(Fo || (Fo = {}));
var ti = function(e) {
  return Object.freeze(e);
}, Nh = function() {
  function e(t, n) {
    this.inlineSize = t, this.blockSize = n, ti(this);
  }
  return e;
}(), Ph = function() {
  function e(t, n, r, i) {
    return this.x = t, this.y = n, this.width = r, this.height = i, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, ti(this);
  }
  return e.prototype.toJSON = function() {
    var t = this, n = t.x, r = t.y, i = t.top, o = t.right, a = t.bottom, u = t.left, f = t.width, c = t.height;
    return { x: n, y: r, top: i, right: o, bottom: a, left: u, width: f, height: c };
  }, e.fromRect = function(t) {
    return new e(t.x, t.y, t.width, t.height);
  }, e;
}(), gc = function(e) {
  return e instanceof SVGElement && "getBBox" in e;
}, Th = function(e) {
  if (gc(e)) {
    var t = e.getBBox(), n = t.width, r = t.height;
    return !n && !r;
  }
  var i = e, o = i.offsetWidth, a = i.offsetHeight;
  return !(o || a || e.getClientRects().length);
}, ed = function(e) {
  var t;
  if (e instanceof Element)
    return !0;
  var n = (t = e == null ? void 0 : e.ownerDocument) === null || t === void 0 ? void 0 : t.defaultView;
  return !!(n && e instanceof n.Element);
}, J0 = function(e) {
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
}, Po = typeof window < "u" ? window : {}, Ea = /* @__PURE__ */ new WeakMap(), td = /auto|scroll/, ey = /^tb|vertical/, ty = /msie|trident/i.test(Po.navigator && Po.navigator.userAgent), Yn = function(e) {
  return parseFloat(e || "0");
}, Ti = function(e, t, n) {
  return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new Nh((n ? t : e) || 0, (n ? e : t) || 0);
}, nd = ti({
  devicePixelContentBoxSize: Ti(),
  borderBoxSize: Ti(),
  contentBoxSize: Ti(),
  contentRect: new Ph(0, 0, 0, 0)
}), Eh = function(e, t) {
  if (t === void 0 && (t = !1), Ea.has(e) && !t)
    return Ea.get(e);
  if (Th(e))
    return Ea.set(e, nd), nd;
  var n = getComputedStyle(e), r = gc(e) && e.ownerSVGElement && e.getBBox(), i = !ty && n.boxSizing === "border-box", o = ey.test(n.writingMode || ""), a = !r && td.test(n.overflowY || ""), u = !r && td.test(n.overflowX || ""), f = r ? 0 : Yn(n.paddingTop), c = r ? 0 : Yn(n.paddingRight), h = r ? 0 : Yn(n.paddingBottom), p = r ? 0 : Yn(n.paddingLeft), w = r ? 0 : Yn(n.borderTopWidth), N = r ? 0 : Yn(n.borderRightWidth), _ = r ? 0 : Yn(n.borderBottomWidth), P = r ? 0 : Yn(n.borderLeftWidth), I = p + c, k = f + h, $ = P + N, T = w + _, G = u ? e.offsetHeight - T - e.clientHeight : 0, M = a ? e.offsetWidth - $ - e.clientWidth : 0, L = i ? I + $ : 0, te = i ? k + T : 0, Q = r ? r.width : Yn(n.width) - L - M, fe = r ? r.height : Yn(n.height) - te - G, ve = Q + I + M + $, re = fe + k + G + T, ee = ti({
    devicePixelContentBoxSize: Ti(Math.round(Q * devicePixelRatio), Math.round(fe * devicePixelRatio), o),
    borderBoxSize: Ti(ve, re, o),
    contentBoxSize: Ti(Q, fe, o),
    contentRect: new Ph(p, f, Q, fe)
  });
  return Ea.set(e, ee), ee;
}, Mh = function(e, t, n) {
  var r = Eh(e, n), i = r.borderBoxSize, o = r.contentBoxSize, a = r.devicePixelContentBoxSize;
  switch (t) {
    case Fo.DEVICE_PIXEL_CONTENT_BOX:
      return a;
    case Fo.BORDER_BOX:
      return i;
    default:
      return o;
  }
}, Oh = function() {
  function e(t) {
    var n = Eh(t);
    this.target = t, this.contentRect = n.contentRect, this.borderBoxSize = ti([n.borderBoxSize]), this.contentBoxSize = ti([n.contentBoxSize]), this.devicePixelContentBoxSize = ti([n.devicePixelContentBoxSize]);
  }
  return e;
}(), Ah = function(e) {
  if (Th(e))
    return 1 / 0;
  for (var t = 0, n = e.parentNode; n; )
    t += 1, n = n.parentNode;
  return t;
}, ny = function() {
  var e = 1 / 0, t = [];
  ei.forEach(function(a) {
    if (a.activeTargets.length !== 0) {
      var u = [];
      a.activeTargets.forEach(function(c) {
        var h = new Oh(c.target), p = Ah(c.target);
        u.push(h), c.lastReportedSize = Mh(c.target, c.observedBox), p < e && (e = p);
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
}, rd = function(e) {
  ei.forEach(function(n) {
    n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(i) {
      i.isActive() && (Ah(i.target) > e ? n.activeTargets.push(i) : n.skippedTargets.push(i));
    });
  });
}, ry = function() {
  var e = 0;
  for (rd(e); K0(); )
    e = ny(), rd(e);
  return Q0() && Z0(), e > 0;
}, Os, kh = [], iy = function() {
  return kh.splice(0).forEach(function(e) {
    return e();
  });
}, oy = function(e) {
  if (!Os) {
    var t = 0, n = document.createTextNode(""), r = { characterData: !0 };
    new MutationObserver(function() {
      return iy();
    }).observe(n, r), Os = function() {
      n.textContent = "".concat(t ? t-- : t++);
    };
  }
  kh.push(e), Os();
}, ay = function(e) {
  oy(function() {
    requestAnimationFrame(e);
  });
}, qa = 0, uy = function() {
  return !!qa;
}, sy = 250, ly = { attributes: !0, characterData: !0, childList: !0, subtree: !0 }, id = [
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
], od = function(e) {
  return e === void 0 && (e = 0), Date.now() + e;
}, As = !1, cy = function() {
  function e() {
    var t = this;
    this.stopped = !0, this.listener = function() {
      return t.schedule();
    };
  }
  return e.prototype.run = function(t) {
    var n = this;
    if (t === void 0 && (t = sy), !As) {
      As = !0;
      var r = od(t);
      ay(function() {
        var i = !1;
        try {
          i = ry();
        } finally {
          if (As = !1, t = r - od(), !uy())
            return;
          i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
        }
      });
    }
  }, e.prototype.schedule = function() {
    this.stop(), this.run();
  }, e.prototype.observe = function() {
    var t = this, n = function() {
      return t.observer && t.observer.observe(document.body, ly);
    };
    document.body ? n() : Po.addEventListener("DOMContentLoaded", n);
  }, e.prototype.start = function() {
    var t = this;
    this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), id.forEach(function(n) {
      return Po.addEventListener(n, t.listener, !0);
    }));
  }, e.prototype.stop = function() {
    var t = this;
    this.stopped || (this.observer && this.observer.disconnect(), id.forEach(function(n) {
      return Po.removeEventListener(n, t.listener, !0);
    }), this.stopped = !0);
  }, e;
}(), vl = new cy(), ad = function(e) {
  !qa && e > 0 && vl.start(), qa += e, !qa && vl.stop();
}, fy = function(e) {
  return !gc(e) && !J0(e) && getComputedStyle(e).display === "inline";
}, dy = function() {
  function e(t, n) {
    this.target = t, this.observedBox = n || Fo.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return e.prototype.isActive = function() {
    var t = Mh(this.target, this.observedBox, !0);
    return fy(this.target) && (this.lastReportedSize = t), this.lastReportedSize.inlineSize !== t.inlineSize || this.lastReportedSize.blockSize !== t.blockSize;
  }, e;
}(), py = function() {
  function e(t, n) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = t, this.callback = n;
  }
  return e;
}(), Ma = /* @__PURE__ */ new WeakMap(), ud = function(e, t) {
  for (var n = 0; n < e.length; n += 1)
    if (e[n].target === t)
      return n;
  return -1;
}, Oa = function() {
  function e() {
  }
  return e.connect = function(t, n) {
    var r = new py(t, n);
    Ma.set(t, r);
  }, e.observe = function(t, n, r) {
    var i = Ma.get(t), o = i.observationTargets.length === 0;
    ud(i.observationTargets, n) < 0 && (o && ei.push(i), i.observationTargets.push(new dy(n, r && r.box)), ad(1), vl.schedule());
  }, e.unobserve = function(t, n) {
    var r = Ma.get(t), i = ud(r.observationTargets, n), o = r.observationTargets.length === 1;
    i >= 0 && (o && ei.splice(ei.indexOf(r), 1), r.observationTargets.splice(i, 1), ad(-1));
  }, e.disconnect = function(t) {
    var n = this, r = Ma.get(t);
    r.observationTargets.slice().forEach(function(i) {
      return n.unobserve(t, i.target);
    }), r.activeTargets.splice(0, r.activeTargets.length);
  }, e;
}(), hy = function() {
  function e(t) {
    if (arguments.length === 0)
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    if (typeof t != "function")
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    Oa.connect(this, t);
  }
  return e.prototype.observe = function(t, n) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!ed(t))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Oa.observe(this, t, n);
  }, e.prototype.unobserve = function(t) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!ed(t))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Oa.unobserve(this, t);
  }, e.prototype.disconnect = function() {
    Oa.disconnect(this);
  }, e.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, e;
}();
const my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ResizeObserver: hy,
  ResizeObserverEntry: Oh,
  ResizeObserverSize: Nh
}, Symbol.toStringTag, { value: "Module" }));
var vy = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/responsive/esm/components/ParentSizeModern.js", gy = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function gl() {
  return gl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, gl.apply(this, arguments);
}
function yy(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var by = [];
function Fh(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? by : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = yy(e, gy), w = Jt(null), N = Jt(0), _ = Lr({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), P = _[0], I = _[1], k = Vt(function() {
    var $ = Array.isArray(a) ? a : [a];
    return vc(function(T) {
      I(function(G) {
        var M = Object.keys(G), L = M.filter(function(Q) {
          return G[Q] !== T[Q];
        }), te = L.every(function(Q) {
          return $.includes(Q);
        });
        return te ? G : T;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return on(function() {
    var $ = new window.ResizeObserver(function(T) {
      T.forEach(function(G) {
        var M = G.contentRect, L = M.left, te = M.top, Q = M.width, fe = M.height;
        N.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: L
          });
        });
      });
    });
    return w.current && $.observe(w.current), function() {
      window.cancelAnimationFrame(N.current), $.disconnect(), k.cancel();
    };
  }, [k]), /* @__PURE__ */ B("div", {
    style: f,
    ref: w,
    className: t,
    ...p,
    children: n(gl({}, P, {
      ref: w.current,
      resize: k
    }))
  }, void 0, !1, {
    fileName: vy,
    lineNumber: 81,
    columnNumber: 23
  }, this);
}
Fh.propTypes = {
  className: ke.exports.string,
  debounceTime: ke.exports.number,
  enableDebounceLeadingCall: ke.exports.bool,
  ignoreDimensions: ke.exports.oneOfType([ke.exports.any, ke.exports.arrayOf(ke.exports.any)]),
  children: ke.exports.func.isRequired
};
var yu = { exports: {} };
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
})(yu);
const wy = yu.exports;
function yl(e, t, n) {
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
yl.debounce = yl;
var sd = yl;
function xy(e) {
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
  const [a, u] = Lr({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  }), f = Jt({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: a
  }), c = t ? typeof t == "number" ? t : t.scroll : null, h = t ? typeof t == "number" ? t : t.resize : null, p = Jt(!1);
  on(() => (p.current = !0, () => void (p.current = !1)));
  const [w, N, _] = Vt(() => {
    const $ = () => {
      if (!f.current.element)
        return;
      const {
        left: T,
        top: G,
        width: M,
        height: L,
        bottom: te,
        right: Q,
        x: fe,
        y: ve
      } = f.current.element.getBoundingClientRect(), re = {
        left: T,
        top: G,
        width: M,
        height: L,
        bottom: te,
        right: Q,
        x: fe,
        y: ve
      };
      f.current.element instanceof HTMLElement && i && (re.height = f.current.element.offsetHeight, re.width = f.current.element.offsetWidth), Object.freeze(re), p.current && !Cy(f.current.lastBounds, re) && u(f.current.lastBounds = re);
    };
    return [$, h ? sd($, h) : $, c ? sd($, c) : $];
  }, [u, i, c, h]);
  function P() {
    f.current.scrollContainers && (f.current.scrollContainers.forEach(($) => $.removeEventListener("scroll", _, !0)), f.current.scrollContainers = null), f.current.resizeObserver && (f.current.resizeObserver.disconnect(), f.current.resizeObserver = null);
  }
  function I() {
    !f.current.element || (f.current.resizeObserver = new o(_), f.current.resizeObserver.observe(f.current.element), n && f.current.scrollContainers && f.current.scrollContainers.forEach(($) => $.addEventListener("scroll", _, {
      capture: !0,
      passive: !0
    })));
  }
  const k = ($) => {
    !$ || $ === f.current.element || (P(), f.current.element = $, f.current.scrollContainers = $h($), I());
  };
  return Sy(_, Boolean(n)), _y(N), on(() => {
    P(), I();
  }, [n, _, N]), on(() => P, []), [k, a, w];
}
function _y(e) {
  on(() => {
    const t = e;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [e]);
}
function Sy(e, t) {
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
function $h(e) {
  const t = [];
  if (!e || e === document.body)
    return t;
  const {
    overflow: n,
    overflowX: r,
    overflowY: i
  } = window.getComputedStyle(e);
  return [n, r, i].some((o) => o === "auto" || o === "scroll") && t.push(e), [...t, ...$h(e.parentElement)];
}
const Ry = ["x", "y", "top", "bottom", "left", "right", "width", "height"], Cy = (e, t) => Ry.every((n) => e[n] === t[n]);
function ld(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var cd = /* @__PURE__ */ function() {
  function e(n) {
    var r = n.x, i = r === void 0 ? 0 : r, o = n.y, a = o === void 0 ? 0 : o;
    ld(this, "x", 0), ld(this, "y", 0), this.x = i, this.y = a;
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
function Ny(e) {
  return !!e && e instanceof Element;
}
function Py(e) {
  return !!e && (e instanceof SVGElement || "ownerSVGElement" in e);
}
function Ty(e) {
  return !!e && "createSVGPoint" in e;
}
function Ey(e) {
  return !!e && "getScreenCTM" in e;
}
function My(e) {
  return !!e && "changedTouches" in e;
}
function Oy(e) {
  return !!e && "clientX" in e;
}
function Ay(e) {
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
var ks = {
  x: 0,
  y: 0
};
function ky(e) {
  if (!e)
    return To({}, ks);
  if (My(e))
    return e.changedTouches.length > 0 ? {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    } : To({}, ks);
  if (Oy(e))
    return {
      x: e.clientX,
      y: e.clientY
    };
  var t = e == null ? void 0 : e.target, n = t && "getBoundingClientRect" in t ? t.getBoundingClientRect() : null;
  return n ? {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  } : To({}, ks);
}
function fd(e, t) {
  if (!e || !t)
    return null;
  var n = ky(t), r = Py(e) ? e.ownerSVGElement : e, i = Ey(r) ? r.getScreenCTM() : null;
  if (Ty(r) && i) {
    var o = r.createSVGPoint();
    return o.x = n.x, o.y = n.y, o = o.matrixTransform(i.inverse()), new cd({
      x: o.x,
      y: o.y
    });
  }
  var a = e.getBoundingClientRect();
  return new cd({
    x: n.x - a.left - e.clientLeft,
    y: n.y - a.top - e.clientTop
  });
}
function Fy(e, t) {
  if (Ny(e) && t)
    return fd(e, t);
  if (Ay(e)) {
    var n = e, r = n.target;
    if (r)
      return fd(r, n);
  }
  return null;
}
var bl = Math.PI, wl = 2 * bl, Zr = 1e-6, $y = wl - Zr;
function xl() {
  this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
}
function zi() {
  return new xl();
}
xl.prototype = zi.prototype = {
  constructor: xl,
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
    else if (p > Zr)
      if (!(Math.abs(h * u - f * c) > Zr) || !i)
        this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
      else {
        var w = n - o, N = r - a, _ = u * u + f * f, P = w * w + N * N, I = Math.sqrt(_), k = Math.sqrt(p), $ = i * Math.tan((bl - Math.acos((_ + p - P) / (2 * I * k))) / 2), T = $ / k, G = $ / I;
        Math.abs(T - 1) > Zr && (this._ += "L" + (e + T * c) + "," + (t + T * h)), this._ += "A" + i + "," + i + ",0,0," + +(h * w > c * N) + "," + (this._x1 = e + G * u) + "," + (this._y1 = t + G * f);
      }
  },
  arc: function(e, t, n, r, i, o) {
    e = +e, t = +t, n = +n, o = !!o;
    var a = n * Math.cos(r), u = n * Math.sin(r), f = e + a, c = t + u, h = 1 ^ o, p = o ? r - i : i - r;
    if (n < 0)
      throw new Error("negative radius: " + n);
    this._x1 === null ? this._ += "M" + f + "," + c : (Math.abs(this._x1 - f) > Zr || Math.abs(this._y1 - c) > Zr) && (this._ += "L" + f + "," + c), n && (p < 0 && (p = p % wl + wl), p > $y ? this._ += "A" + n + "," + n + ",0,1," + h + "," + (e - a) + "," + (t - u) + "A" + n + "," + n + ",0,1," + h + "," + (this._x1 = f) + "," + (this._y1 = c) : p > Zr && (this._ += "A" + n + "," + n + ",0," + +(p >= bl) + "," + h + "," + (this._x1 = e + n * Math.cos(i)) + "," + (this._y1 = t + n * Math.sin(i))));
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
var dd = Math.abs, tn = Math.atan2, Xr = Math.cos, By = Math.max, Fs = Math.min, Xn = Math.sin, Ri = Math.sqrt, nn = 1e-12, Ir = Math.PI, Qa = Ir / 2, $r = 2 * Ir;
function Iy(e) {
  return e > 1 ? 0 : e < -1 ? Ir : Math.acos(e);
}
function pd(e) {
  return e >= 1 ? Qa : e <= -1 ? -Qa : Math.asin(e);
}
function Dy(e) {
  return e.innerRadius;
}
function Ly(e) {
  return e.outerRadius;
}
function zy(e) {
  return e.startAngle;
}
function Gy(e) {
  return e.endAngle;
}
function jy(e) {
  return e && e.padAngle;
}
function Hy(e, t, n, r, i, o, a, u) {
  var f = n - e, c = r - t, h = a - i, p = u - o, w = p * f - h * c;
  if (!(w * w < nn))
    return w = (h * (t - o) - p * (e - i)) / w, [e + w * f, t + w * c];
}
function Aa(e, t, n, r, i, o, a) {
  var u = e - n, f = t - r, c = (a ? o : -o) / Ri(u * u + f * f), h = c * f, p = -c * u, w = e + h, N = t + p, _ = n + h, P = r + p, I = (w + _) / 2, k = (N + P) / 2, $ = _ - w, T = P - N, G = $ * $ + T * T, M = i - o, L = w * P - _ * N, te = (T < 0 ? -1 : 1) * Ri(By(0, M * M * G - L * L)), Q = (L * T - $ * te) / G, fe = (-L * $ - T * te) / G, ve = (L * T + $ * te) / G, re = (-L * $ + T * te) / G, ee = Q - I, be = fe - k, Oe = ve - I, ut = re - k;
  return ee * ee + be * be > Oe * Oe + ut * ut && (Q = ve, fe = re), {
    cx: Q,
    cy: fe,
    x01: -h,
    y01: -p,
    x11: Q * (i / M - 1),
    y11: fe * (i / M - 1)
  };
}
function Wy() {
  var e = Dy, t = Ly, n = vt(0), r = null, i = zy, o = Gy, a = jy, u = null;
  function f() {
    var c, h, p = +e.apply(this, arguments), w = +t.apply(this, arguments), N = i.apply(this, arguments) - Qa, _ = o.apply(this, arguments) - Qa, P = dd(_ - N), I = _ > N;
    if (u || (u = c = zi()), w < p && (h = w, w = p, p = h), !(w > nn))
      u.moveTo(0, 0);
    else if (P > $r - nn)
      u.moveTo(w * Xr(N), w * Xn(N)), u.arc(0, 0, w, N, _, !I), p > nn && (u.moveTo(p * Xr(_), p * Xn(_)), u.arc(0, 0, p, _, N, I));
    else {
      var k = N, $ = _, T = N, G = _, M = P, L = P, te = a.apply(this, arguments) / 2, Q = te > nn && (r ? +r.apply(this, arguments) : Ri(p * p + w * w)), fe = Fs(dd(w - p) / 2, +n.apply(this, arguments)), ve = fe, re = fe, ee, be;
      if (Q > nn) {
        var Oe = pd(Q / p * Xn(te)), ut = pd(Q / w * Xn(te));
        (M -= Oe * 2) > nn ? (Oe *= I ? 1 : -1, T += Oe, G -= Oe) : (M = 0, T = G = (N + _) / 2), (L -= ut * 2) > nn ? (ut *= I ? 1 : -1, k += ut, $ -= ut) : (L = 0, k = $ = (N + _) / 2);
      }
      var Ve = w * Xr(k), st = w * Xn(k), lt = p * Xr(G), dt = p * Xn(G);
      if (fe > nn) {
        var U = w * Xr($), ue = w * Xn($), Pe = p * Xr(T), Ae = p * Xn(T), Ce;
        if (P < Ir && (Ce = Hy(Ve, st, Pe, Ae, U, ue, lt, dt))) {
          var Re = Ve - Ce[0], Te = st - Ce[1], Ie = U - Ce[0], ze = ue - Ce[1], X = 1 / Xn(Iy((Re * Ie + Te * ze) / (Ri(Re * Re + Te * Te) * Ri(Ie * Ie + ze * ze))) / 2), ce = Ri(Ce[0] * Ce[0] + Ce[1] * Ce[1]);
          ve = Fs(fe, (p - ce) / (X - 1)), re = Fs(fe, (w - ce) / (X + 1));
        }
      }
      L > nn ? re > nn ? (ee = Aa(Pe, Ae, Ve, st, w, re, I), be = Aa(U, ue, lt, dt, w, re, I), u.moveTo(ee.cx + ee.x01, ee.cy + ee.y01), re < fe ? u.arc(ee.cx, ee.cy, re, tn(ee.y01, ee.x01), tn(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, re, tn(ee.y01, ee.x01), tn(ee.y11, ee.x11), !I), u.arc(0, 0, w, tn(ee.cy + ee.y11, ee.cx + ee.x11), tn(be.cy + be.y11, be.cx + be.x11), !I), u.arc(be.cx, be.cy, re, tn(be.y11, be.x11), tn(be.y01, be.x01), !I))) : (u.moveTo(Ve, st), u.arc(0, 0, w, k, $, !I)) : u.moveTo(Ve, st), !(p > nn) || !(M > nn) ? u.lineTo(lt, dt) : ve > nn ? (ee = Aa(lt, dt, U, ue, p, -ve, I), be = Aa(Ve, st, Pe, Ae, p, -ve, I), u.lineTo(ee.cx + ee.x01, ee.cy + ee.y01), ve < fe ? u.arc(ee.cx, ee.cy, ve, tn(ee.y01, ee.x01), tn(be.y01, be.x01), !I) : (u.arc(ee.cx, ee.cy, ve, tn(ee.y01, ee.x01), tn(ee.y11, ee.x11), !I), u.arc(0, 0, p, tn(ee.cy + ee.y11, ee.cx + ee.x11), tn(be.cy + be.y11, be.cx + be.x11), I), u.arc(be.cx, be.cy, ve, tn(be.y11, be.x11), tn(be.y01, be.x01), !I))) : u.arc(0, 0, p, G, T, I);
    }
    if (u.closePath(), c)
      return u = null, c + "" || null;
  }
  return f.centroid = function() {
    var c = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2, h = (+i.apply(this, arguments) + +o.apply(this, arguments)) / 2 - Ir / 2;
    return [Xr(h) * c, Xn(h) * c];
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
function Bh(e) {
  this._context = e;
}
Bh.prototype = {
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
function bu(e) {
  return new Bh(e);
}
function yc(e) {
  return e[0];
}
function bc(e) {
  return e[1];
}
function wc() {
  var e = yc, t = bc, n = vt(!0), r = null, i = bu, o = null;
  function a(u) {
    var f, c = u.length, h, p = !1, w;
    for (r == null && (o = i(w = zi())), f = 0; f <= c; ++f)
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
function Ih() {
  var e = yc, t = null, n = vt(0), r = bc, i = vt(!0), o = null, a = bu, u = null;
  function f(h) {
    var p, w, N, _ = h.length, P, I = !1, k, $ = new Array(_), T = new Array(_);
    for (o == null && (u = a(k = zi())), p = 0; p <= _; ++p) {
      if (!(p < _ && i(P = h[p], p, h)) === I)
        if (I = !I)
          w = p, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), N = p - 1; N >= w; --N)
            u.point($[N], T[N]);
          u.lineEnd(), u.areaEnd();
        }
      I && ($[p] = +e(P, p, h), T[p] = +n(P, p, h), u.point(t ? +t(P, p, h) : $[p], r ? +r(P, p, h) : T[p]));
    }
    if (k)
      return u = null, k + "" || null;
  }
  function c() {
    return wc().defined(i).curve(a).context(o);
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
function Vy(e, t) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Uy(e) {
  return e;
}
function qy() {
  var e = Uy, t = Vy, n = null, r = vt(0), i = vt($r), o = vt(0);
  function a(u) {
    var f, c = u.length, h, p, w = 0, N = new Array(c), _ = new Array(c), P = +r.apply(this, arguments), I = Math.min($r, Math.max(-$r, i.apply(this, arguments) - P)), k, $ = Math.min(Math.abs(I) / c, o.apply(this, arguments)), T = $ * (I < 0 ? -1 : 1), G;
    for (f = 0; f < c; ++f)
      (G = _[N[f] = f] = +e(u[f], f, u)) > 0 && (w += G);
    for (t != null ? N.sort(function(M, L) {
      return t(_[M], _[L]);
    }) : n != null && N.sort(function(M, L) {
      return n(u[M], u[L]);
    }), f = 0, p = w ? (I - c * T) / w : 0; f < c; ++f, P = k)
      h = N[f], G = _[h], k = P + (G > 0 ? G * p : 0) + T, _[h] = {
        data: u[h],
        index: f,
        value: G,
        startAngle: P,
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
var Dh = xc(bu);
function Lh(e) {
  this._curve = e;
}
Lh.prototype = {
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
function xc(e) {
  function t(n) {
    return new Lh(e(n));
  }
  return t._curve = e, t;
}
function _o(e) {
  var t = e.curve;
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e.curve = function(n) {
    return arguments.length ? t(xc(n)) : t()._curve;
  }, e;
}
function hd() {
  return _o(wc().curve(Dh));
}
function md() {
  var e = Ih().curve(Dh), t = e.curve, n = e.lineX0, r = e.lineX1, i = e.lineY0, o = e.lineY1;
  return e.angle = e.x, delete e.x, e.startAngle = e.x0, delete e.x0, e.endAngle = e.x1, delete e.x1, e.radius = e.y, delete e.y, e.innerRadius = e.y0, delete e.y0, e.outerRadius = e.y1, delete e.y1, e.lineStartAngle = function() {
    return _o(n());
  }, delete e.lineX0, e.lineEndAngle = function() {
    return _o(r());
  }, delete e.lineX1, e.lineInnerRadius = function() {
    return _o(i());
  }, delete e.lineY0, e.lineOuterRadius = function() {
    return _o(o());
  }, delete e.lineY1, e.curve = function(a) {
    return arguments.length ? t(xc(a)) : t()._curve;
  }, e;
}
function So(e, t) {
  return [(t = +t) * Math.cos(e -= Math.PI / 2), t * Math.sin(e)];
}
var _l = Array.prototype.slice;
function Yy(e) {
  return e.source;
}
function Xy(e) {
  return e.target;
}
function _c(e) {
  var t = Yy, n = Xy, r = yc, i = bc, o = null;
  function a() {
    var u, f = _l.call(arguments), c = t.apply(this, f), h = n.apply(this, f);
    if (o || (o = u = zi()), e(o, +r.apply(this, (f[0] = c, f)), +i.apply(this, f), +r.apply(this, (f[0] = h, f)), +i.apply(this, f)), u)
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
function Ky(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t = (t + r) / 2, n, t, i, r, i);
}
function Qy(e, t, n, r, i) {
  e.moveTo(t, n), e.bezierCurveTo(t, n = (n + i) / 2, r, n, r, i);
}
function Zy(e, t, n, r, i) {
  var o = So(t, n), a = So(t, n = (n + i) / 2), u = So(r, n), f = So(r, i);
  e.moveTo(o[0], o[1]), e.bezierCurveTo(a[0], a[1], u[0], u[1], f[0], f[1]);
}
function Jy() {
  return _c(Ky);
}
function eb() {
  return _c(Qy);
}
function tb() {
  var e = _c(Zy);
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e;
}
const Sc = {
  draw: function(e, t) {
    var n = Math.sqrt(t / Ir);
    e.moveTo(n, 0), e.arc(0, 0, n, 0, $r);
  }
}, zh = {
  draw: function(e, t) {
    var n = Math.sqrt(t / 5) / 2;
    e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
  }
};
var Gh = Math.sqrt(1 / 3), nb = Gh * 2;
const jh = {
  draw: function(e, t) {
    var n = Math.sqrt(t / nb), r = n * Gh;
    e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
  }
};
var rb = 0.8908130915292852, Hh = Math.sin(Ir / 10) / Math.sin(7 * Ir / 10), ib = Math.sin($r / 10) * Hh, ob = -Math.cos($r / 10) * Hh;
const Wh = {
  draw: function(e, t) {
    var n = Math.sqrt(t * rb), r = ib * n, i = ob * n;
    e.moveTo(0, -n), e.lineTo(r, i);
    for (var o = 1; o < 5; ++o) {
      var a = $r * o / 5, u = Math.cos(a), f = Math.sin(a);
      e.lineTo(f * n, -u * n), e.lineTo(u * r - f * i, f * r + u * i);
    }
    e.closePath();
  }
}, Vh = {
  draw: function(e, t) {
    var n = Math.sqrt(t), r = -n / 2;
    e.rect(r, r, n, n);
  }
};
var $s = Math.sqrt(3);
const Uh = {
  draw: function(e, t) {
    var n = -Math.sqrt(t / ($s * 3));
    e.moveTo(0, n * 2), e.lineTo(-$s * n, -n), e.lineTo($s * n, -n), e.closePath();
  }
};
var Nn = -0.5, Pn = Math.sqrt(3) / 2, Sl = 1 / Math.sqrt(12), ab = (Sl / 2 + 1) * 3;
const qh = {
  draw: function(e, t) {
    var n = Math.sqrt(t / ab), r = n / 2, i = n * Sl, o = r, a = n * Sl + n, u = -o, f = a;
    e.moveTo(r, i), e.lineTo(o, a), e.lineTo(u, f), e.lineTo(Nn * r - Pn * i, Pn * r + Nn * i), e.lineTo(Nn * o - Pn * a, Pn * o + Nn * a), e.lineTo(Nn * u - Pn * f, Pn * u + Nn * f), e.lineTo(Nn * r + Pn * i, Nn * i - Pn * r), e.lineTo(Nn * o + Pn * a, Nn * a - Pn * o), e.lineTo(Nn * u + Pn * f, Nn * f - Pn * u), e.closePath();
  }
};
var ub = [
  Sc,
  zh,
  jh,
  Vh,
  Wh,
  Uh,
  qh
];
function sb() {
  var e = vt(Sc), t = vt(64), n = null;
  function r() {
    var i;
    if (n || (n = i = zi()), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i)
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
function Za(e, t, n) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + n) / 6
  );
}
function wu(e) {
  this._context = e;
}
wu.prototype = {
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
        Za(this, this._x1, this._y1);
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
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function lb(e) {
  return new wu(e);
}
function Yh(e) {
  this._context = e;
}
Yh.prototype = {
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
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function cb(e) {
  return new Yh(e);
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
        Za(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function fb(e) {
  return new Xh(e);
}
function Kh(e, t) {
  this._basis = new wu(e), this._beta = t;
}
Kh.prototype = {
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
const db = function e(t) {
  function n(r) {
    return t === 1 ? new wu(r) : new Kh(r, t);
  }
  return n.beta = function(r) {
    return e(+r);
  }, n;
}(0.85);
function Ja(e, t, n) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - n),
    e._x2,
    e._y2
  );
}
function Rc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Rc.prototype = {
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
        Ja(this, this._x1, this._y1);
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
        Ja(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const pb = function e(t) {
  function n(r) {
    return new Rc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function Cc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Cc.prototype = {
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
        Ja(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const hb = function e(t) {
  function n(r) {
    return new Cc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function Nc(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Nc.prototype = {
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
        Ja(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const mb = function e(t) {
  function n(r) {
    return new Nc(r, t);
  }
  return n.tension = function(r) {
    return e(+r);
  }, n;
}(0);
function Pc(e, t, n) {
  var r = e._x1, i = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > nn) {
    var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, f = 3 * e._l01_a * (e._l01_a + e._l12_a);
    r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / f, i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / f;
  }
  if (e._l23_a > nn) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, a = (a * c + e._y1 * e._l23_2a - n * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(r, i, o, a, e._x2, e._y2);
}
function Qh(e, t) {
  this._context = e, this._alpha = t;
}
Qh.prototype = {
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
        Pc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const vb = function e(t) {
  function n(r) {
    return t ? new Qh(r, t) : new Rc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Zh(e, t) {
  this._context = e, this._alpha = t;
}
Zh.prototype = {
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
        Pc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const gb = function e(t) {
  function n(r) {
    return t ? new Zh(r, t) : new Cc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function Jh(e, t) {
  this._context = e, this._alpha = t;
}
Jh.prototype = {
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
        Pc(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const yb = function e(t) {
  function n(r) {
    return t ? new Jh(r, t) : new Nc(r, 0);
  }
  return n.alpha = function(r) {
    return e(+r);
  }, n;
}(0.5);
function em(e) {
  this._context = e;
}
em.prototype = {
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
function bb(e) {
  return new em(e);
}
function vd(e) {
  return e < 0 ? -1 : 1;
}
function gd(e, t, n) {
  var r = e._x1 - e._x0, i = t - e._x1, o = (e._y1 - e._y0) / (r || i < 0 && -0), a = (n - e._y1) / (i || r < 0 && -0), u = (o * i + a * r) / (r + i);
  return (vd(o) + vd(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(u)) || 0;
}
function yd(e, t) {
  var n = e._x1 - e._x0;
  return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Bs(e, t, n) {
  var r = e._x0, i = e._y0, o = e._x1, a = e._y1, u = (o - r) / 3;
  e._context.bezierCurveTo(r + u, i + u * t, o - u, a - u * n, o, a);
}
function eu(e) {
  this._context = e;
}
eu.prototype = {
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
        Bs(this, this._t0, yd(this, this._t0));
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
          this._point = 3, Bs(this, yd(this, n = gd(this, e, t)), n);
          break;
        default:
          Bs(this, this._t0, n = gd(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
    }
  }
};
function tm(e) {
  this._context = new nm(e);
}
(tm.prototype = Object.create(eu.prototype)).point = function(e, t) {
  eu.prototype.point.call(this, t, e);
};
function nm(e) {
  this._context = e;
}
nm.prototype = {
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
function wb(e) {
  return new eu(e);
}
function xb(e) {
  return new tm(e);
}
function rm(e) {
  this._context = e;
}
rm.prototype = {
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
        for (var r = bd(e), i = bd(t), o = 0, a = 1; a < n; ++o, ++a)
          this._context.bezierCurveTo(r[0][o], i[0][o], r[1][o], i[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function bd(e) {
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
function _b(e) {
  return new rm(e);
}
function xu(e, t) {
  this._context = e, this._t = t;
}
xu.prototype = {
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
function Sb(e) {
  return new xu(e, 0.5);
}
function Rb(e) {
  return new xu(e, 0);
}
function Cb(e) {
  return new xu(e, 1);
}
function Fi(e, t) {
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
function Nb(e, t) {
  return e[t];
}
function Pb() {
  var e = vt([]), t = $i, n = Fi, r = Nb;
  function i(o) {
    var a = e.apply(this, arguments), u, f = o.length, c = a.length, h = new Array(c), p;
    for (u = 0; u < c; ++u) {
      for (var w = a[u], N = h[u] = new Array(f), _ = 0, P; _ < f; ++_)
        N[_] = P = [0, +r(o[_], w, _, o)], P.data = o[_];
      N.key = w;
    }
    for (u = 0, p = t(h); u < c; ++u)
      h[p[u]].index = u;
    return n(h, p), h;
  }
  return i.keys = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : vt(_l.call(o)), i) : e;
  }, i.value = function(o) {
    return arguments.length ? (r = typeof o == "function" ? o : vt(+o), i) : r;
  }, i.order = function(o) {
    return arguments.length ? (t = o == null ? $i : typeof o == "function" ? o : vt(_l.call(o)), i) : t;
  }, i.offset = function(o) {
    return arguments.length ? (n = o == null ? Fi : o, i) : n;
  }, i;
}
function Tb(e, t) {
  if ((r = e.length) > 0) {
    for (var n, r, i = 0, o = e[0].length, a; i < o; ++i) {
      for (a = n = 0; n < r; ++n)
        a += e[n][i][1] || 0;
      if (a)
        for (n = 0; n < r; ++n)
          e[n][i][1] /= a;
    }
    Fi(e, t);
  }
}
function Eb(e, t) {
  if ((f = e.length) > 0)
    for (var n, r = 0, i, o, a, u, f, c = e[t[0]].length; r < c; ++r)
      for (a = u = 0, n = 0; n < f; ++n)
        (o = (i = e[t[n]][r])[1] - i[0]) > 0 ? (i[0] = a, i[1] = a += o) : o < 0 ? (i[1] = u, i[0] = u += o) : (i[0] = 0, i[1] = o);
}
function Mb(e, t) {
  if ((i = e.length) > 0) {
    for (var n = 0, r = e[t[0]], i, o = r.length; n < o; ++n) {
      for (var a = 0, u = 0; a < i; ++a)
        u += e[a][n][1] || 0;
      r[n][1] += r[n][0] = -u / 2;
    }
    Fi(e, t);
  }
}
function Ob(e, t) {
  if (!(!((a = e.length) > 0) || !((o = (i = e[t[0]]).length) > 0))) {
    for (var n = 0, r = 1, i, o, a; r < o; ++r) {
      for (var u = 0, f = 0, c = 0; u < a; ++u) {
        for (var h = e[t[u]], p = h[r][1] || 0, w = h[r - 1][1] || 0, N = (p - w) / 2, _ = 0; _ < u; ++_) {
          var P = e[t[_]], I = P[r][1] || 0, k = P[r - 1][1] || 0;
          N += I - k;
        }
        f += p, c += N * p;
      }
      i[r - 1][1] += i[r - 1][0] = n, f && (n -= c / f);
    }
    i[r - 1][1] += i[r - 1][0] = n, Fi(e, t);
  }
}
function im(e) {
  var t = e.map(Ab);
  return $i(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function Ab(e) {
  for (var t = -1, n = 0, r = e.length, i, o = -1 / 0; ++t < r; )
    (i = +e[t][1]) > o && (o = i, n = t);
  return n;
}
function om(e) {
  var t = e.map(am);
  return $i(e).sort(function(n, r) {
    return t[n] - t[r];
  });
}
function am(e) {
  for (var t = 0, n = -1, r = e.length, i; ++n < r; )
    (i = +e[n][1]) && (t += i);
  return t;
}
function kb(e) {
  return om(e).reverse();
}
function Fb(e) {
  var t = e.length, n, r, i = e.map(am), o = im(e), a = 0, u = 0, f = [], c = [];
  for (n = 0; n < t; ++n)
    r = o[n], a < u ? (a += i[r], f.push(r)) : (u += i[r], c.push(r));
  return c.reverse().concat(f);
}
function $b(e) {
  return $i(e).reverse();
}
const Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arc: Wy,
  area: Ih,
  line: wc,
  pie: qy,
  areaRadial: md,
  radialArea: md,
  lineRadial: hd,
  radialLine: hd,
  pointRadial: So,
  linkHorizontal: Jy,
  linkVertical: eb,
  linkRadial: tb,
  symbol: sb,
  symbols: ub,
  symbolCircle: Sc,
  symbolCross: zh,
  symbolDiamond: jh,
  symbolSquare: Vh,
  symbolStar: Wh,
  symbolTriangle: Uh,
  symbolWye: qh,
  curveBasisClosed: cb,
  curveBasisOpen: fb,
  curveBasis: lb,
  curveBundle: db,
  curveCardinalClosed: hb,
  curveCardinalOpen: mb,
  curveCardinal: pb,
  curveCatmullRomClosed: gb,
  curveCatmullRomOpen: yb,
  curveCatmullRom: vb,
  curveLinearClosed: bb,
  curveLinear: bu,
  curveMonotoneX: wb,
  curveMonotoneY: xb,
  curveNatural: _b,
  curveStep: Sb,
  curveStepAfter: Cb,
  curveStepBefore: Rb,
  stack: Pb,
  stackOffsetExpand: Tb,
  stackOffsetDiverging: Eb,
  stackOffsetNone: Fi,
  stackOffsetSilhouette: Mb,
  stackOffsetWiggle: Ob,
  stackOrderAppearance: im,
  stackOrderAscending: om,
  stackOrderDescending: kb,
  stackOrderInsideOut: Fb,
  stackOrderNone: $i,
  stackOrderReverse: $b
}, Symbol.toStringTag, { value: "Module" }));
function Yo(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function _u(e) {
  let t = e, n = e;
  e.length === 1 && (t = (a, u) => e(a) - u, n = Ib(e));
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
function Ib(e) {
  return (t, n) => Yo(e(t), n);
}
function um(e) {
  return e === null ? NaN : +e;
}
function* Db(e, t) {
  if (t === void 0)
    for (let n of e)
      n != null && (n = +n) >= n && (yield n);
  else {
    let n = -1;
    for (let r of e)
      (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
  }
}
const sm = _u(Yo), Lb = sm.right, zb = sm.left;
_u(um).center;
const Xo = Lb;
function wd(e, t) {
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
var Rl = Math.sqrt(50), Cl = Math.sqrt(10), Nl = Math.sqrt(2);
function Pl(e, t, n) {
  var r, i = -1, o, a, u;
  if (t = +t, e = +e, n = +n, e === t && n > 0)
    return [e];
  if ((r = t < e) && (o = e, e = t, t = o), (u = lm(e, t, n)) === 0 || !isFinite(u))
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
function lm(e, t, n) {
  var r = (t - e) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), o = r / Math.pow(10, i);
  return i >= 0 ? (o >= Rl ? 10 : o >= Cl ? 5 : o >= Nl ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (o >= Rl ? 10 : o >= Cl ? 5 : o >= Nl ? 2 : 1);
}
function Tl(e, t, n) {
  var r = Math.abs(t - e) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), o = r / i;
  return o >= Rl ? i *= 10 : o >= Cl ? i *= 5 : o >= Nl && (i *= 2), t < e ? -i : i;
}
function xd(e, t) {
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
function _d(e, t) {
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
function cm(e, t, n = 0, r = e.length - 1, i = Yo) {
  for (; r > n; ) {
    if (r - n > 600) {
      const f = r - n + 1, c = t - n + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), w = 0.5 * Math.sqrt(h * p * (f - p) / f) * (c - f / 2 < 0 ? -1 : 1), N = Math.max(n, Math.floor(t - c * p / f + w)), _ = Math.min(r, Math.floor(t + (f - c) * p / f + w));
      cm(e, t, N, _, i);
    }
    const o = e[t];
    let a = n, u = r;
    for (uo(e, n, t), i(e[r], o) > 0 && uo(e, n, r); a < u; ) {
      for (uo(e, a, u), ++a, --u; i(e[a], o) < 0; )
        ++a;
      for (; i(e[u], o) > 0; )
        --u;
    }
    i(e[n], o) === 0 ? uo(e, n, u) : (++u, uo(e, u, r)), u <= t && (n = u + 1), t <= u && (r = u - 1);
  }
  return e;
}
function uo(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function Gb(e, t, n) {
  if (e = Float64Array.from(Db(e, n)), !!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return _d(e);
    if (t >= 1)
      return xd(e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = xd(cm(e, o).subarray(0, o + 1)), u = _d(e.subarray(o + 1));
    return a + (u - a) * (i - o);
  }
}
function jb(e, t, n = um) {
  if (!!(r = e.length)) {
    if ((t = +t) <= 0 || r < 2)
      return +n(e[0], 0, e);
    if (t >= 1)
      return +n(e[r - 1], r - 1, e);
    var r, i = (r - 1) * t, o = Math.floor(i), a = +n(e[o], o, e), u = +n(e[o + 1], o + 1, e);
    return a + (u - a) * (i - o);
  }
}
function fm(e, t, n) {
  e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, o = new Array(i); ++r < i; )
    o[r] = e + r * n;
  return o;
}
function On(e, t) {
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
const El = Symbol("implicit");
function Su() {
  var e = /* @__PURE__ */ new Map(), t = [], n = [], r = El;
  function i(o) {
    var a = o + "", u = e.get(a);
    if (!u) {
      if (r !== El)
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
    return Su(t, n).unknown(r);
  }, On.apply(i, arguments), i;
}
function Ru() {
  var e = Su().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, o, a, u = !1, f = 0, c = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var w = t().length, N = i < r, _ = N ? i : r, P = N ? r : i;
    o = (P - _) / Math.max(1, w - f + c * 2), u && (o = Math.floor(o)), _ += (P - _ - o * (w - f)) * h, a = o * (1 - f), u && (_ = Math.round(_), a = Math.round(a));
    var I = fm(w).map(function(k) {
      return _ + o * k;
    });
    return n(N ? I.reverse() : I);
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
    return Ru(t(), [r, i]).round(u).paddingInner(f).paddingOuter(c).align(h);
  }, On.apply(p(), arguments);
}
function dm(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return dm(t());
  }, e;
}
function pm() {
  return dm(Ru.apply(null, arguments).paddingInner(1));
}
function Gi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ko(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t)
    n[r] = t[r];
  return n;
}
function zr() {
}
var ri = 0.7, Bi = 1 / ri, Ei = "\\s*([+-]?\\d+)\\s*", $o = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", tr = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Hb = /^#([0-9a-f]{3,8})$/, Wb = new RegExp("^rgb\\(" + [Ei, Ei, Ei] + "\\)$"), Vb = new RegExp("^rgb\\(" + [tr, tr, tr] + "\\)$"), Ub = new RegExp("^rgba\\(" + [Ei, Ei, Ei, $o] + "\\)$"), qb = new RegExp("^rgba\\(" + [tr, tr, tr, $o] + "\\)$"), Yb = new RegExp("^hsl\\(" + [$o, tr, tr] + "\\)$"), Xb = new RegExp("^hsla\\(" + [$o, tr, tr, $o] + "\\)$"), Sd = {
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
Gi(zr, Bo, {
  copy: function(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: Rd,
  formatHex: Rd,
  formatHsl: Kb,
  formatRgb: Cd,
  toString: Cd
});
function Rd() {
  return this.rgb().formatHex();
}
function Kb() {
  return hm(this).formatHsl();
}
function Cd() {
  return this.rgb().formatRgb();
}
function Bo(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Hb.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Nd(t) : n === 3 ? new Zt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? ka(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? ka(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Wb.exec(e)) ? new Zt(t[1], t[2], t[3], 1) : (t = Vb.exec(e)) ? new Zt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Ub.exec(e)) ? ka(t[1], t[2], t[3], t[4]) : (t = qb.exec(e)) ? ka(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Yb.exec(e)) ? Ed(t[1], t[2] / 100, t[3] / 100, 1) : (t = Xb.exec(e)) ? Ed(t[1], t[2] / 100, t[3] / 100, t[4]) : Sd.hasOwnProperty(e) ? Nd(Sd[e]) : e === "transparent" ? new Zt(NaN, NaN, NaN, 0) : null;
}
function Nd(e) {
  return new Zt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function ka(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Zt(e, t, n, r);
}
function Tc(e) {
  return e instanceof zr || (e = Bo(e)), e ? (e = e.rgb(), new Zt(e.r, e.g, e.b, e.opacity)) : new Zt();
}
function tu(e, t, n, r) {
  return arguments.length === 1 ? Tc(e) : new Zt(e, t, n, r == null ? 1 : r);
}
function Zt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Gi(Zt, tu, Ko(zr, {
  brighter: function(e) {
    return e = e == null ? Bi : Math.pow(Bi, e), new Zt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ri : Math.pow(ri, e), new Zt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Pd,
  formatHex: Pd,
  formatRgb: Td,
  toString: Td
}));
function Pd() {
  return "#" + Is(this.r) + Is(this.g) + Is(this.b);
}
function Td() {
  var e = this.opacity;
  return e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)), (e === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (e === 1 ? ")" : ", " + e + ")");
}
function Is(e) {
  return e = Math.max(0, Math.min(255, Math.round(e) || 0)), (e < 16 ? "0" : "") + e.toString(16);
}
function Ed(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Jn(e, t, n, r);
}
function hm(e) {
  if (e instanceof Jn)
    return new Jn(e.h, e.s, e.l, e.opacity);
  if (e instanceof zr || (e = Bo(e)), !e)
    return new Jn();
  if (e instanceof Jn)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), a = NaN, u = o - i, f = (o + i) / 2;
  return u ? (t === o ? a = (n - r) / u + (n < r) * 6 : n === o ? a = (r - t) / u + 2 : a = (t - n) / u + 4, u /= f < 0.5 ? o + i : 2 - o - i, a *= 60) : u = f > 0 && f < 1 ? 0 : a, new Jn(a, u, f, e.opacity);
}
function Ml(e, t, n, r) {
  return arguments.length === 1 ? hm(e) : new Jn(e, t, n, r == null ? 1 : r);
}
function Jn(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Gi(Jn, Ml, Ko(zr, {
  brighter: function(e) {
    return e = e == null ? Bi : Math.pow(Bi, e), new Jn(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ri : Math.pow(ri, e), new Jn(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Zt(
      Ds(e >= 240 ? e - 240 : e + 120, i, r),
      Ds(e, i, r),
      Ds(e < 120 ? e + 240 : e - 120, i, r),
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
function Ds(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
var mm = Math.PI / 180, vm = 180 / Math.PI, nu = 18, gm = 0.96422, ym = 1, bm = 0.82521, wm = 4 / 29, Mi = 6 / 29, xm = 3 * Mi * Mi, Qb = Mi * Mi * Mi;
function _m(e) {
  if (e instanceof nr)
    return new nr(e.l, e.a, e.b, e.opacity);
  if (e instanceof fr)
    return Sm(e);
  e instanceof Zt || (e = Tc(e));
  var t = js(e.r), n = js(e.g), r = js(e.b), i = Ls((0.2225045 * t + 0.7168786 * n + 0.0606169 * r) / ym), o, a;
  return t === n && n === r ? o = a = i : (o = Ls((0.4360747 * t + 0.3850649 * n + 0.1430804 * r) / gm), a = Ls((0.0139322 * t + 0.0971045 * n + 0.7141733 * r) / bm)), new nr(116 * i - 16, 500 * (o - i), 200 * (i - a), e.opacity);
}
function Ol(e, t, n, r) {
  return arguments.length === 1 ? _m(e) : new nr(e, t, n, r == null ? 1 : r);
}
function nr(e, t, n, r) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
Gi(nr, Ol, Ko(zr, {
  brighter: function(e) {
    return new nr(this.l + nu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  darker: function(e) {
    return new nr(this.l - nu * (e == null ? 1 : e), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = gm * zs(t), e = ym * zs(e), n = bm * zs(n), new Zt(
      Gs(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
      Gs(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
      Gs(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
      this.opacity
    );
  }
}));
function Ls(e) {
  return e > Qb ? Math.pow(e, 1 / 3) : e / xm + wm;
}
function zs(e) {
  return e > Mi ? e * e * e : xm * (e - wm);
}
function Gs(e) {
  return 255 * (e <= 31308e-7 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);
}
function js(e) {
  return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function Zb(e) {
  if (e instanceof fr)
    return new fr(e.h, e.c, e.l, e.opacity);
  if (e instanceof nr || (e = _m(e)), e.a === 0 && e.b === 0)
    return new fr(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
  var t = Math.atan2(e.b, e.a) * vm;
  return new fr(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function Al(e, t, n, r) {
  return arguments.length === 1 ? Zb(e) : new fr(e, t, n, r == null ? 1 : r);
}
function fr(e, t, n, r) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function Sm(e) {
  if (isNaN(e.h))
    return new nr(e.l, 0, 0, e.opacity);
  var t = e.h * mm;
  return new nr(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
Gi(fr, Al, Ko(zr, {
  brighter: function(e) {
    return new fr(this.h, this.c, this.l + nu * (e == null ? 1 : e), this.opacity);
  },
  darker: function(e) {
    return new fr(this.h, this.c, this.l - nu * (e == null ? 1 : e), this.opacity);
  },
  rgb: function() {
    return Sm(this).rgb();
  }
}));
var Rm = -0.14861, Ec = 1.78277, Mc = -0.29227, Cu = -0.90649, Io = 1.97294, Md = Io * Cu, Od = Io * Ec, Ad = Ec * Mc - Cu * Rm;
function Jb(e) {
  if (e instanceof ni)
    return new ni(e.h, e.s, e.l, e.opacity);
  e instanceof Zt || (e = Tc(e));
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (Ad * r + Md * t - Od * n) / (Ad + Md - Od), o = r - i, a = (Io * (n - i) - Mc * o) / Cu, u = Math.sqrt(a * a + o * o) / (Io * i * (1 - i)), f = u ? Math.atan2(a, o) * vm - 120 : NaN;
  return new ni(f < 0 ? f + 360 : f, u, i, e.opacity);
}
function kl(e, t, n, r) {
  return arguments.length === 1 ? Jb(e) : new ni(e, t, n, r == null ? 1 : r);
}
function ni(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Gi(ni, kl, Ko(zr, {
  brighter: function(e) {
    return e = e == null ? Bi : Math.pow(Bi, e), new ni(this.h, this.s, this.l * e, this.opacity);
  },
  darker: function(e) {
    return e = e == null ? ri : Math.pow(ri, e), new ni(this.h, this.s, this.l * e, this.opacity);
  },
  rgb: function() {
    var e = isNaN(this.h) ? 0 : (this.h + 120) * mm, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
    return new Zt(
      255 * (t + n * (Rm * r + Ec * i)),
      255 * (t + n * (Mc * r + Cu * i)),
      255 * (t + n * (Io * r)),
      this.opacity
    );
  }
}));
function Cm(e, t, n, r, i) {
  var o = e * e, a = o * e;
  return ((1 - 3 * e + 3 * o - a) * t + (4 - 6 * o + 3 * a) * n + (1 + 3 * e + 3 * o - 3 * a) * r + a * i) / 6;
}
function Nm(e) {
  var t = e.length - 1;
  return function(n) {
    var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, t - 1) : Math.floor(n * t), i = e[r], o = e[r + 1], a = r > 0 ? e[r - 1] : 2 * i - o, u = r < t - 1 ? e[r + 2] : 2 * o - i;
    return Cm((n - r / t) * t, a, i, o, u);
  };
}
function Pm(e) {
  var t = e.length;
  return function(n) {
    var r = Math.floor(((n %= 1) < 0 ? ++n : n) * t), i = e[(r + t - 1) % t], o = e[r % t], a = e[(r + 1) % t], u = e[(r + 2) % t];
    return Cm((n - r / t) * t, i, o, a, u);
  };
}
function Nu(e) {
  return function() {
    return e;
  };
}
function Tm(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function e1(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Pu(e, t) {
  var n = t - e;
  return n ? Tm(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Nu(isNaN(e) ? t : e);
}
function t1(e) {
  return (e = +e) == 1 ? Ut : function(t, n) {
    return n - t ? e1(t, n, e) : Nu(isNaN(t) ? n : t);
  };
}
function Ut(e, t) {
  var n = t - e;
  return n ? Tm(e, n) : Nu(isNaN(e) ? t : e);
}
const ru = function e(t) {
  var n = t1(t);
  function r(i, o) {
    var a = n((i = tu(i)).r, (o = tu(o)).r), u = n(i.g, o.g), f = n(i.b, o.b), c = Ut(i.opacity, o.opacity);
    return function(h) {
      return i.r = a(h), i.g = u(h), i.b = f(h), i.opacity = c(h), i + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Em(e) {
  return function(t) {
    var n = t.length, r = new Array(n), i = new Array(n), o = new Array(n), a, u;
    for (a = 0; a < n; ++a)
      u = tu(t[a]), r[a] = u.r || 0, i[a] = u.g || 0, o[a] = u.b || 0;
    return r = e(r), i = e(i), o = e(o), u.opacity = 1, function(f) {
      return u.r = r(f), u.g = i(f), u.b = o(f), u + "";
    };
  };
}
var n1 = Em(Nm), r1 = Em(Pm);
function Oc(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i)
      r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function Mm(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function i1(e, t) {
  return (Mm(t) ? Oc : Om)(e, t);
}
function Om(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), a;
  for (a = 0; a < r; ++a)
    i[a] = ji(e[a], t[a]);
  for (; a < n; ++a)
    o[a] = t[a];
  return function(u) {
    for (a = 0; a < r; ++a)
      o[a] = i[a](u);
    return o;
  };
}
function Am(e, t) {
  var n = new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Bn(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function km(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = ji(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n)
      r[i] = n[i](o);
    return r;
  };
}
var Fl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Hs = new RegExp(Fl.source, "g");
function o1(e) {
  return function() {
    return e;
  };
}
function a1(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Fm(e, t) {
  var n = Fl.lastIndex = Hs.lastIndex = 0, r, i, o, a = -1, u = [], f = [];
  for (e = e + "", t = t + ""; (r = Fl.exec(e)) && (i = Hs.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), u[a] ? u[a] += o : u[++a] = o), (r = r[0]) === (i = i[0]) ? u[a] ? u[a] += i : u[++a] = i : (u[++a] = null, f.push({ i: a, x: Bn(r, i) })), n = Hs.lastIndex;
  return n < t.length && (o = t.slice(n), u[a] ? u[a] += o : u[++a] = o), u.length < 2 ? f[0] ? a1(f[0].x) : o1(t) : (t = f.length, function(c) {
    for (var h = 0, p; h < t; ++h)
      u[(p = f[h]).i] = p.x(c);
    return u.join("");
  });
}
function ji(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Nu(t) : (n === "number" ? Bn : n === "string" ? (r = Bo(t)) ? (t = r, ru) : Fm : t instanceof Bo ? ru : t instanceof Date ? Am : Mm(t) ? Oc : Array.isArray(t) ? Om : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? km : Bn)(e, t);
}
function u1(e) {
  var t = e.length;
  return function(n) {
    return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
  };
}
function s1(e, t) {
  var n = Pu(+e, +t);
  return function(r) {
    var i = n(r);
    return i - 360 * Math.floor(i / 360);
  };
}
function Qo(e, t) {
  return e = +e, t = +t, function(n) {
    return Math.round(e * (1 - n) + t * n);
  };
}
var kd = 180 / Math.PI, $l = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function $m(e, t, n, r, i, o) {
  var a, u, f;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (f = e * n + t * r) && (n -= e * f, r -= t * f), (u = Math.sqrt(n * n + r * r)) && (n /= u, r /= u, f /= u), e * r < t * n && (e = -e, t = -t, f = -f, a = -a), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * kd,
    skewX: Math.atan(f) * kd,
    scaleX: a,
    scaleY: u
  };
}
var so, Ws, Fd, Fa;
function l1(e) {
  return e === "none" ? $l : (so || (so = document.createElement("DIV"), Ws = document.documentElement, Fd = document.defaultView), so.style.transform = e, e = Fd.getComputedStyle(Ws.appendChild(so), null).getPropertyValue("transform"), Ws.removeChild(so), e = e.slice(7, -1).split(","), $m(+e[0], +e[1], +e[2], +e[3], +e[4], +e[5]));
}
function c1(e) {
  return e == null || (Fa || (Fa = document.createElementNS("http://www.w3.org/2000/svg", "g")), Fa.setAttribute("transform", e), !(e = Fa.transform.baseVal.consolidate())) ? $l : (e = e.matrix, $m(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Bm(e, t, n, r) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, p, w, N, _) {
    if (c !== p || h !== w) {
      var P = N.push("translate(", null, t, null, n);
      _.push({ i: P - 4, x: Bn(c, p) }, { i: P - 2, x: Bn(h, w) });
    } else
      (p || w) && N.push("translate(" + p + t + w + n);
  }
  function a(c, h, p, w) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), w.push({ i: p.push(i(p) + "rotate(", null, r) - 2, x: Bn(c, h) })) : h && p.push(i(p) + "rotate(" + h + r);
  }
  function u(c, h, p, w) {
    c !== h ? w.push({ i: p.push(i(p) + "skewX(", null, r) - 2, x: Bn(c, h) }) : h && p.push(i(p) + "skewX(" + h + r);
  }
  function f(c, h, p, w, N, _) {
    if (c !== p || h !== w) {
      var P = N.push(i(N) + "scale(", null, ",", null, ")");
      _.push({ i: P - 4, x: Bn(c, p) }, { i: P - 2, x: Bn(h, w) });
    } else
      (p !== 1 || w !== 1) && N.push(i(N) + "scale(" + p + "," + w + ")");
  }
  return function(c, h) {
    var p = [], w = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, p, w), a(c.rotate, h.rotate, p, w), u(c.skewX, h.skewX, p, w), f(c.scaleX, c.scaleY, h.scaleX, h.scaleY, p, w), c = h = null, function(N) {
      for (var _ = -1, P = w.length, I; ++_ < P; )
        p[(I = w[_]).i] = I.x(N);
      return p.join("");
    };
  };
}
var f1 = Bm(l1, "px, ", "px)", "deg)"), d1 = Bm(c1, ", ", ")", ")"), lo = Math.SQRT2, Vs = 2, $d = 4, p1 = 1e-12;
function Bd(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function h1(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function m1(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
function v1(e, t) {
  var n = e[0], r = e[1], i = e[2], o = t[0], a = t[1], u = t[2], f = o - n, c = a - r, h = f * f + c * c, p, w;
  if (h < p1)
    w = Math.log(u / i) / lo, p = function($) {
      return [
        n + $ * f,
        r + $ * c,
        i * Math.exp(lo * $ * w)
      ];
    };
  else {
    var N = Math.sqrt(h), _ = (u * u - i * i + $d * h) / (2 * i * Vs * N), P = (u * u - i * i - $d * h) / (2 * u * Vs * N), I = Math.log(Math.sqrt(_ * _ + 1) - _), k = Math.log(Math.sqrt(P * P + 1) - P);
    w = (k - I) / lo, p = function($) {
      var T = $ * w, G = Bd(I), M = i / (Vs * N) * (G * m1(lo * T + I) - h1(I));
      return [
        n + M * f,
        r + M * c,
        i * G / Bd(lo * T + I)
      ];
    };
  }
  return p.duration = w * 1e3, p;
}
function Im(e) {
  return function(t, n) {
    var r = e((t = Ml(t)).h, (n = Ml(n)).h), i = Ut(t.s, n.s), o = Ut(t.l, n.l), a = Ut(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.s = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const Dm = Im(Pu);
var Lm = Im(Ut);
function zm(e, t) {
  var n = Ut((e = Ol(e)).l, (t = Ol(t)).l), r = Ut(e.a, t.a), i = Ut(e.b, t.b), o = Ut(e.opacity, t.opacity);
  return function(a) {
    return e.l = n(a), e.a = r(a), e.b = i(a), e.opacity = o(a), e + "";
  };
}
function Gm(e) {
  return function(t, n) {
    var r = e((t = Al(t)).h, (n = Al(n)).h), i = Ut(t.c, n.c), o = Ut(t.l, n.l), a = Ut(t.opacity, n.opacity);
    return function(u) {
      return t.h = r(u), t.c = i(u), t.l = o(u), t.opacity = a(u), t + "";
    };
  };
}
const jm = Gm(Pu);
var Hm = Gm(Ut);
function Wm(e) {
  return function t(n) {
    n = +n;
    function r(i, o) {
      var a = e((i = kl(i)).h, (o = kl(o)).h), u = Ut(i.s, o.s), f = Ut(i.l, o.l), c = Ut(i.opacity, o.opacity);
      return function(h) {
        return i.h = a(h), i.s = u(h), i.l = f(Math.pow(h, n)), i.opacity = c(h), i + "";
      };
    }
    return r.gamma = t, r;
  }(1);
}
const Vm = Wm(Pu);
var Um = Wm(Ut);
function qm(e, t) {
  for (var n = 0, r = t.length - 1, i = t[0], o = new Array(r < 0 ? 0 : r); n < r; )
    o[n] = e(i, i = t[++n]);
  return function(a) {
    var u = Math.max(0, Math.min(r - 1, Math.floor(a *= r)));
    return o[u](a - u);
  };
}
function g1(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r)
    n[r] = e(r / (t - 1));
  return n;
}
const y1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  interpolate: ji,
  interpolateArray: i1,
  interpolateBasis: Nm,
  interpolateBasisClosed: Pm,
  interpolateDate: Am,
  interpolateDiscrete: u1,
  interpolateHue: s1,
  interpolateNumber: Bn,
  interpolateNumberArray: Oc,
  interpolateObject: km,
  interpolateRound: Qo,
  interpolateString: Fm,
  interpolateTransformCss: f1,
  interpolateTransformSvg: d1,
  interpolateZoom: v1,
  interpolateRgb: ru,
  interpolateRgbBasis: n1,
  interpolateRgbBasisClosed: r1,
  interpolateHsl: Dm,
  interpolateHslLong: Lm,
  interpolateLab: zm,
  interpolateHcl: jm,
  interpolateHclLong: Hm,
  interpolateCubehelix: Vm,
  interpolateCubehelixLong: Um,
  piecewise: qm,
  quantize: g1
}, Symbol.toStringTag, { value: "Module" }));
function b1(e) {
  return function() {
    return e;
  };
}
function iu(e) {
  return +e;
}
var Id = [0, 1];
function un(e) {
  return e;
}
function Bl(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : b1(isNaN(t) ? NaN : 0.5);
}
function w1(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function x1(e, t, n) {
  var r = e[0], i = e[1], o = t[0], a = t[1];
  return i < r ? (r = Bl(i, r), o = n(a, o)) : (r = Bl(r, i), o = n(o, a)), function(u) {
    return o(r(u));
  };
}
function _1(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), o = new Array(r), a = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++a < r; )
    i[a] = Bl(e[a], e[a + 1]), o[a] = n(t[a], t[a + 1]);
  return function(u) {
    var f = Xo(e, u, 1, r) - 1;
    return o[f](i[f](u));
  };
}
function Zo(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Tu() {
  var e = Id, t = Id, n = ji, r, i, o, a = un, u, f, c;
  function h() {
    var w = Math.min(e.length, t.length);
    return a !== un && (a = w1(e[0], e[w - 1])), u = w > 2 ? _1 : x1, f = c = null, p;
  }
  function p(w) {
    return w == null || isNaN(w = +w) ? o : (f || (f = u(e.map(r), t, n)))(r(a(w)));
  }
  return p.invert = function(w) {
    return a(i((c || (c = u(t, e.map(r), Bn)))(w)));
  }, p.domain = function(w) {
    return arguments.length ? (e = Array.from(w, iu), h()) : e.slice();
  }, p.range = function(w) {
    return arguments.length ? (t = Array.from(w), h()) : t.slice();
  }, p.rangeRound = function(w) {
    return t = Array.from(w), n = Qo, h();
  }, p.clamp = function(w) {
    return arguments.length ? (a = w ? !0 : un, h()) : a !== un;
  }, p.interpolate = function(w) {
    return arguments.length ? (n = w, h()) : n;
  }, p.unknown = function(w) {
    return arguments.length ? (o = w, p) : o;
  }, function(w, N) {
    return r = w, i = N, h();
  };
}
function Ac() {
  return Tu()(un, un);
}
function S1(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function ou(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0)
    return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function Ii(e) {
  return e = ou(Math.abs(e)), e ? e[1] : NaN;
}
function R1(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], a = 0, u = e[0], f = 0; i > 0 && u > 0 && (f + u + 1 > r && (u = Math.max(1, r - f)), o.push(n.substring(i -= u, i + u)), !((f += u + 1) > r)); )
      u = e[a = (a + 1) % e.length];
    return o.reverse().join(t);
  };
}
function C1(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var N1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function au(e) {
  if (!(t = N1.exec(e)))
    throw new Error("invalid format: " + e);
  var t;
  return new kc({
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
au.prototype = kc.prototype;
function kc(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
kc.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function P1(e) {
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
var Ym;
function T1(e, t) {
  var n = ou(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1], o = i - (Ym = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return o === a ? r : o > a ? r + new Array(o - a + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + ou(e, Math.max(0, t + o - 1))[0];
}
function Dd(e, t) {
  var n = ou(e, t);
  if (!n)
    return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Ld = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: S1,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => Dd(e * 100, t),
  r: Dd,
  s: T1,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function zd(e) {
  return e;
}
var Gd = Array.prototype.map, jd = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function E1(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? zd : R1(Gd.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? zd : C1(Gd.call(e.numerals, String)), a = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "\u2212" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(p) {
    p = au(p);
    var w = p.fill, N = p.align, _ = p.sign, P = p.symbol, I = p.zero, k = p.width, $ = p.comma, T = p.precision, G = p.trim, M = p.type;
    M === "n" ? ($ = !0, M = "g") : Ld[M] || (T === void 0 && (T = 12), G = !0, M = "g"), (I || w === "0" && N === "=") && (I = !0, w = "0", N = "=");
    var L = P === "$" ? n : P === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", te = P === "$" ? r : /[%p]/.test(M) ? a : "", Q = Ld[M], fe = /[defgprs%]/.test(M);
    T = T === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, T)) : Math.max(0, Math.min(20, T));
    function ve(re) {
      var ee = L, be = te, Oe, ut, Ve;
      if (M === "c")
        be = Q(re) + be, re = "";
      else {
        re = +re;
        var st = re < 0 || 1 / re < 0;
        if (re = isNaN(re) ? f : Q(Math.abs(re), T), G && (re = P1(re)), st && +re == 0 && _ !== "+" && (st = !1), ee = (st ? _ === "(" ? _ : u : _ === "-" || _ === "(" ? "" : _) + ee, be = (M === "s" ? jd[8 + Ym / 3] : "") + be + (st && _ === "(" ? ")" : ""), fe) {
          for (Oe = -1, ut = re.length; ++Oe < ut; )
            if (Ve = re.charCodeAt(Oe), 48 > Ve || Ve > 57) {
              be = (Ve === 46 ? i + re.slice(Oe + 1) : re.slice(Oe)) + be, re = re.slice(0, Oe);
              break;
            }
        }
      }
      $ && !I && (re = t(re, 1 / 0));
      var lt = ee.length + re.length + be.length, dt = lt < k ? new Array(k - lt + 1).join(w) : "";
      switch ($ && I && (re = t(dt + re, dt.length ? k - be.length : 1 / 0), dt = ""), N) {
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
    return ve.toString = function() {
      return p + "";
    }, ve;
  }
  function h(p, w) {
    var N = c((p = au(p), p.type = "f", p)), _ = Math.max(-8, Math.min(8, Math.floor(Ii(w) / 3))) * 3, P = Math.pow(10, -_), I = jd[8 + _ / 3];
    return function(k) {
      return N(P * k) + I;
    };
  }
  return {
    format: c,
    formatPrefix: h
  };
}
var $a, Fc, Xm;
M1({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function M1(e) {
  return $a = E1(e), Fc = $a.format, Xm = $a.formatPrefix, $a;
}
function O1(e) {
  return Math.max(0, -Ii(Math.abs(e)));
}
function A1(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Ii(t) / 3))) * 3 - Ii(Math.abs(e)));
}
function k1(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Ii(t) - Ii(e)) + 1;
}
function Km(e, t, n, r) {
  var i = Tl(e, t, n), o;
  switch (r = au(r == null ? ",f" : r), r.type) {
    case "s": {
      var a = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = A1(i, a)) && (r.precision = o), Xm(r, a);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = k1(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = O1(i)) && (r.precision = o - (r.type === "%") * 2);
      break;
    }
  }
  return Fc(r);
}
function Gr(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return Pl(r[0], r[r.length - 1], n == null ? 10 : n);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return Km(i[0], i[i.length - 1], n == null ? 10 : n, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, a = r[i], u = r[o], f, c, h = 10;
    for (u < a && (c = a, a = u, u = c, c = i, i = o, o = c); h-- > 0; ) {
      if (c = lm(a, u, n), c === f)
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
function $c() {
  var e = Ac();
  return e.copy = function() {
    return Zo(e, $c());
  }, On.apply(e, arguments), Gr(e);
}
function Qm(e) {
  var t;
  function n(r) {
    return r == null || isNaN(r = +r) ? t : r;
  }
  return n.invert = n, n.domain = n.range = function(r) {
    return arguments.length ? (e = Array.from(r, iu), n) : e.slice();
  }, n.unknown = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.copy = function() {
    return Qm(e).unknown(t);
  }, e = arguments.length ? Array.from(e, iu) : [0, 1], Gr(n);
}
function Zm(e, t) {
  e = e.slice();
  var n = 0, r = e.length - 1, i = e[n], o = e[r], a;
  return o < i && (a = n, n = r, r = a, a = i, i = o, o = a), e[n] = t.floor(i), e[r] = t.ceil(o), e;
}
function Hd(e) {
  return Math.log(e);
}
function Wd(e) {
  return Math.exp(e);
}
function F1(e) {
  return -Math.log(-e);
}
function $1(e) {
  return -Math.exp(-e);
}
function B1(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function I1(e) {
  return e === 10 ? B1 : e === Math.E ? Math.exp : function(t) {
    return Math.pow(e, t);
  };
}
function D1(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), function(t) {
    return Math.log(t) / e;
  });
}
function Vd(e) {
  return function(t) {
    return -e(-t);
  };
}
function Bc(e) {
  var t = e(Hd, Wd), n = t.domain, r = 10, i, o;
  function a() {
    return i = D1(r), o = I1(r), n()[0] < 0 ? (i = Vd(i), o = Vd(o), e(F1, $1)) : e(Hd, Wd), t;
  }
  return t.base = function(u) {
    return arguments.length ? (r = +u, a()) : r;
  }, t.domain = function(u) {
    return arguments.length ? (n(u), a()) : n();
  }, t.ticks = function(u) {
    var f = n(), c = f[0], h = f[f.length - 1], p;
    (p = h < c) && (w = c, c = h, h = w);
    var w = i(c), N = i(h), _, P, I, k = u == null ? 10 : +u, $ = [];
    if (!(r % 1) && N - w < k) {
      if (w = Math.floor(w), N = Math.ceil(N), c > 0) {
        for (; w <= N; ++w)
          for (P = 1, _ = o(w); P < r; ++P)
            if (I = _ * P, !(I < c)) {
              if (I > h)
                break;
              $.push(I);
            }
      } else
        for (; w <= N; ++w)
          for (P = r - 1, _ = o(w); P >= 1; --P)
            if (I = _ * P, !(I < c)) {
              if (I > h)
                break;
              $.push(I);
            }
      $.length * 2 < k && ($ = Pl(c, h, k));
    } else
      $ = Pl(w, N, Math.min(N - w, k)).map(o);
    return p ? $.reverse() : $;
  }, t.tickFormat = function(u, f) {
    if (f == null && (f = r === 10 ? ".0e" : ","), typeof f != "function" && (f = Fc(f)), u === 1 / 0)
      return f;
    u == null && (u = 10);
    var c = Math.max(1, r * u / t.ticks().length);
    return function(h) {
      var p = h / o(Math.round(i(h)));
      return p * r < r - 0.5 && (p *= r), p <= c ? f(h) : "";
    };
  }, t.nice = function() {
    return n(Zm(n(), {
      floor: function(u) {
        return o(Math.floor(i(u)));
      },
      ceil: function(u) {
        return o(Math.ceil(i(u)));
      }
    }));
  }, t;
}
function Ic() {
  var e = Bc(Tu()).domain([1, 10]);
  return e.copy = function() {
    return Zo(e, Ic()).base(e.base());
  }, On.apply(e, arguments), e;
}
function Ud(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function qd(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function Dc(e) {
  var t = 1, n = e(Ud(t), qd(t));
  return n.constant = function(r) {
    return arguments.length ? e(Ud(t = +r), qd(t)) : t;
  }, Gr(n);
}
function Lc() {
  var e = Dc(Tu());
  return e.copy = function() {
    return Zo(e, Lc()).constant(e.constant());
  }, On.apply(e, arguments);
}
function Yd(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function L1(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function z1(e) {
  return e < 0 ? -e * e : e * e;
}
function zc(e) {
  var t = e(un, un), n = 1;
  function r() {
    return n === 1 ? e(un, un) : n === 0.5 ? e(L1, z1) : e(Yd(n), Yd(1 / n));
  }
  return t.exponent = function(i) {
    return arguments.length ? (n = +i, r()) : n;
  }, Gr(t);
}
function Eu() {
  var e = zc(Tu());
  return e.copy = function() {
    return Zo(e, Eu()).exponent(e.exponent());
  }, On.apply(e, arguments), e;
}
function Jm() {
  return Eu.apply(null, arguments).exponent(0.5);
}
function Xd(e) {
  return Math.sign(e) * e * e;
}
function G1(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function ev() {
  var e = Ac(), t = [0, 1], n = !1, r;
  function i(o) {
    var a = G1(e(o));
    return isNaN(a) ? r : n ? Math.round(a) : a;
  }
  return i.invert = function(o) {
    return e.invert(Xd(o));
  }, i.domain = function(o) {
    return arguments.length ? (e.domain(o), i) : e.domain();
  }, i.range = function(o) {
    return arguments.length ? (e.range((t = Array.from(o, iu)).map(Xd)), i) : t.slice();
  }, i.rangeRound = function(o) {
    return i.range(o).round(!0);
  }, i.round = function(o) {
    return arguments.length ? (n = !!o, i) : n;
  }, i.clamp = function(o) {
    return arguments.length ? (e.clamp(o), i) : e.clamp();
  }, i.unknown = function(o) {
    return arguments.length ? (r = o, i) : r;
  }, i.copy = function() {
    return ev(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
  }, On.apply(i, arguments), Gr(i);
}
function Gc() {
  var e = [], t = [], n = [], r;
  function i() {
    var a = 0, u = Math.max(1, t.length);
    for (n = new Array(u - 1); ++a < u; )
      n[a - 1] = jb(e, a / u);
    return o;
  }
  function o(a) {
    return a == null || isNaN(a = +a) ? r : t[Xo(n, a)];
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
    return e.sort(Yo), i();
  }, o.range = function(a) {
    return arguments.length ? (t = Array.from(a), i()) : t.slice();
  }, o.unknown = function(a) {
    return arguments.length ? (r = a, o) : r;
  }, o.quantiles = function() {
    return n.slice();
  }, o.copy = function() {
    return Gc().domain(e).range(t).unknown(r);
  }, On.apply(o, arguments);
}
function jc() {
  var e = 0, t = 1, n = 1, r = [0.5], i = [0, 1], o;
  function a(f) {
    return f != null && f <= f ? i[Xo(r, f, 0, n)] : o;
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
    return jc().domain([e, t]).range(i).unknown(o);
  }, On.apply(Gr(a), arguments);
}
function Hc() {
  var e = [0.5], t = [0, 1], n, r = 1;
  function i(o) {
    return o != null && o <= o ? t[Xo(e, o, 0, r)] : n;
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
    return Hc().domain(e).range(t).unknown(n);
  }, On.apply(i, arguments);
}
var Us = new Date(), qs = new Date();
function Gt(e, t, n, r) {
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
    return Gt(function(a) {
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
    return Us.setTime(+o), qs.setTime(+a), e(Us), e(qs), Math.floor(n(Us, qs));
  }, i.every = function(o) {
    return o = Math.floor(o), !isFinite(o) || !(o > 0) ? null : o > 1 ? i.filter(r ? function(a) {
      return r(a) % o === 0;
    } : function(a) {
      return i.count(0, a) % o === 0;
    }) : i;
  }), i;
}
var uu = Gt(function() {
}, function(e, t) {
  e.setTime(+e + t);
}, function(e, t) {
  return t - e;
});
uu.every = function(e) {
  return e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? Gt(function(t) {
    t.setTime(Math.floor(t / e) * e);
  }, function(t, n) {
    t.setTime(+t + n * e);
  }, function(t, n) {
    return (n - t) / e;
  }) : uu;
};
const Il = uu;
var Kd = uu.range;
const dr = 1e3, Mn = dr * 60, pr = Mn * 60, ii = pr * 24, Wc = ii * 7, Qd = ii * 30, Ys = ii * 365;
var tv = Gt(function(e) {
  e.setTime(e - e.getMilliseconds());
}, function(e, t) {
  e.setTime(+e + t * dr);
}, function(e, t) {
  return (t - e) / dr;
}, function(e) {
  return e.getUTCSeconds();
});
const er = tv;
var Zd = tv.range, nv = Gt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * dr);
}, function(e, t) {
  e.setTime(+e + t * Mn);
}, function(e, t) {
  return (t - e) / Mn;
}, function(e) {
  return e.getMinutes();
});
const Mu = nv;
var j1 = nv.range, rv = Gt(function(e) {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * dr - e.getMinutes() * Mn);
}, function(e, t) {
  e.setTime(+e + t * pr);
}, function(e, t) {
  return (t - e) / pr;
}, function(e) {
  return e.getHours();
});
const Ou = rv;
var H1 = rv.range, iv = Gt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Mn) / ii,
  (e) => e.getDate() - 1
);
const Hi = iv;
var W1 = iv.range;
function pi(e) {
  return Gt(function(t) {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setDate(t.getDate() + n * 7);
  }, function(t, n) {
    return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Mn) / Wc;
  });
}
var oi = pi(0), Do = pi(1), ov = pi(2), av = pi(3), ai = pi(4), uv = pi(5), sv = pi(6), Jd = oi.range, V1 = Do.range, U1 = ov.range, q1 = av.range, Y1 = ai.range, X1 = uv.range, K1 = sv.range, lv = Gt(function(e) {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setMonth(e.getMonth() + t);
}, function(e, t) {
  return t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12;
}, function(e) {
  return e.getMonth();
});
const Au = lv;
var Q1 = lv.range, Vc = Gt(function(e) {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, function(e, t) {
  e.setFullYear(e.getFullYear() + t);
}, function(e, t) {
  return t.getFullYear() - e.getFullYear();
}, function(e) {
  return e.getFullYear();
});
Vc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Gt(function(t) {
    t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setFullYear(t.getFullYear() + n * e);
  });
};
const hr = Vc;
var Z1 = Vc.range, cv = Gt(function(e) {
  e.setUTCSeconds(0, 0);
}, function(e, t) {
  e.setTime(+e + t * Mn);
}, function(e, t) {
  return (t - e) / Mn;
}, function(e) {
  return e.getUTCMinutes();
});
const ku = cv;
var J1 = cv.range, fv = Gt(function(e) {
  e.setUTCMinutes(0, 0, 0);
}, function(e, t) {
  e.setTime(+e + t * pr);
}, function(e, t) {
  return (t - e) / pr;
}, function(e) {
  return e.getUTCHours();
});
const Fu = fv;
var ew = fv.range, dv = Gt(function(e) {
  e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCDate(e.getUTCDate() + t);
}, function(e, t) {
  return (t - e) / ii;
}, function(e) {
  return e.getUTCDate() - 1;
});
const Wi = dv;
var tw = dv.range;
function hi(e) {
  return Gt(function(t) {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, function(t, n) {
    return (n - t) / Wc;
  });
}
var ui = hi(0), Lo = hi(1), pv = hi(2), hv = hi(3), si = hi(4), mv = hi(5), vv = hi(6), ep = ui.range, nw = Lo.range, rw = pv.range, iw = hv.range, ow = si.range, aw = mv.range, uw = vv.range, gv = Gt(function(e) {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCMonth(e.getUTCMonth() + t);
}, function(e, t) {
  return t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12;
}, function(e) {
  return e.getUTCMonth();
});
const $u = gv;
var sw = gv.range, Uc = Gt(function(e) {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, function(e, t) {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, function(e, t) {
  return t.getUTCFullYear() - e.getUTCFullYear();
}, function(e) {
  return e.getUTCFullYear();
});
Uc.every = function(e) {
  return !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Gt(function(t) {
    t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  }, function(t, n) {
    t.setUTCFullYear(t.getUTCFullYear() + n * e);
  });
};
const mr = Uc;
var lw = Uc.range;
function yv(e, t, n, r, i, o) {
  const a = [
    [er, 1, dr],
    [er, 5, 5 * dr],
    [er, 15, 15 * dr],
    [er, 30, 30 * dr],
    [o, 1, Mn],
    [o, 5, 5 * Mn],
    [o, 15, 15 * Mn],
    [o, 30, 30 * Mn],
    [i, 1, pr],
    [i, 3, 3 * pr],
    [i, 6, 6 * pr],
    [i, 12, 12 * pr],
    [r, 1, ii],
    [r, 2, 2 * ii],
    [n, 1, Wc],
    [t, 1, Qd],
    [t, 3, 3 * Qd],
    [e, 1, Ys]
  ];
  function u(c, h, p) {
    const w = h < c;
    w && ([c, h] = [h, c]);
    const N = p && typeof p.range == "function" ? p : f(c, h, p), _ = N ? N.range(c, +h + 1) : [];
    return w ? _.reverse() : _;
  }
  function f(c, h, p) {
    const w = Math.abs(h - c) / p, N = _u(([, , I]) => I).right(a, w);
    if (N === a.length)
      return e.every(Tl(c / Ys, h / Ys, p));
    if (N === 0)
      return Il.every(Math.max(Tl(c, h, p), 1));
    const [_, P] = a[w / a[N - 1][2] < a[N][2] / w ? N - 1 : N];
    return _.every(P);
  }
  return [u, f];
}
const [bv, wv] = yv(mr, $u, ui, Wi, Fu, ku), [xv, _v] = yv(hr, Au, oi, Hi, Ou, Mu), cw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  timeInterval: Gt,
  timeMillisecond: Il,
  timeMilliseconds: Kd,
  utcMillisecond: Il,
  utcMilliseconds: Kd,
  timeSecond: er,
  timeSeconds: Zd,
  utcSecond: er,
  utcSeconds: Zd,
  timeMinute: Mu,
  timeMinutes: j1,
  timeHour: Ou,
  timeHours: H1,
  timeDay: Hi,
  timeDays: W1,
  timeWeek: oi,
  timeWeeks: Jd,
  timeSunday: oi,
  timeSundays: Jd,
  timeMonday: Do,
  timeMondays: V1,
  timeTuesday: ov,
  timeTuesdays: U1,
  timeWednesday: av,
  timeWednesdays: q1,
  timeThursday: ai,
  timeThursdays: Y1,
  timeFriday: uv,
  timeFridays: X1,
  timeSaturday: sv,
  timeSaturdays: K1,
  timeMonth: Au,
  timeMonths: Q1,
  timeYear: hr,
  timeYears: Z1,
  utcMinute: ku,
  utcMinutes: J1,
  utcHour: Fu,
  utcHours: ew,
  utcDay: Wi,
  utcDays: tw,
  utcWeek: ui,
  utcWeeks: ep,
  utcSunday: ui,
  utcSundays: ep,
  utcMonday: Lo,
  utcMondays: nw,
  utcTuesday: pv,
  utcTuesdays: rw,
  utcWednesday: hv,
  utcWednesdays: iw,
  utcThursday: si,
  utcThursdays: ow,
  utcFriday: mv,
  utcFridays: aw,
  utcSaturday: vv,
  utcSaturdays: uw,
  utcMonth: $u,
  utcMonths: sw,
  utcYear: mr,
  utcYears: lw,
  utcTicks: bv,
  utcTickInterval: wv,
  timeTicks: xv,
  timeTickInterval: _v
}, Symbol.toStringTag, { value: "Module" }));
function Xs(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Ks(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function co(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function fw(e) {
  var t = e.dateTime, n = e.date, r = e.time, i = e.periods, o = e.days, a = e.shortDays, u = e.months, f = e.shortMonths, c = fo(i), h = po(i), p = fo(o), w = po(o), N = fo(a), _ = po(a), P = fo(u), I = po(u), k = fo(f), $ = po(f), T = {
    a: st,
    A: lt,
    b: dt,
    B: U,
    c: null,
    d: ap,
    e: ap,
    f: Fw,
    g: Ww,
    G: Uw,
    H: Ow,
    I: Aw,
    j: kw,
    L: Sv,
    m: $w,
    M: Bw,
    p: ue,
    q: Pe,
    Q: lp,
    s: cp,
    S: Iw,
    u: Dw,
    U: Lw,
    V: zw,
    w: Gw,
    W: jw,
    x: null,
    X: null,
    y: Hw,
    Y: Vw,
    Z: qw,
    "%": sp
  }, G = {
    a: Ae,
    A: Ce,
    b: Re,
    B: Te,
    c: null,
    d: up,
    e: up,
    f: Qw,
    g: ux,
    G: lx,
    H: Yw,
    I: Xw,
    j: Kw,
    L: Cv,
    m: Zw,
    M: Jw,
    p: Ie,
    q: ze,
    Q: lp,
    s: cp,
    S: ex,
    u: tx,
    U: nx,
    V: rx,
    w: ix,
    W: ox,
    x: null,
    X: null,
    y: ax,
    Y: sx,
    Z: cx,
    "%": sp
  }, M = {
    a: ve,
    A: re,
    b: ee,
    B: be,
    c: Oe,
    d: ip,
    e: ip,
    f: Pw,
    g: rp,
    G: np,
    H: op,
    I: op,
    j: Sw,
    L: Nw,
    m: _w,
    M: Rw,
    p: fe,
    q: xw,
    Q: Ew,
    s: Mw,
    S: Cw,
    u: vw,
    U: gw,
    V: yw,
    w: mw,
    W: bw,
    x: ut,
    X: Ve,
    y: rp,
    Y: np,
    Z: ww,
    "%": Tw
  };
  T.x = L(n, T), T.X = L(r, T), T.c = L(t, T), G.x = L(n, G), G.X = L(r, G), G.c = L(t, G);
  function L(X, ce) {
    return function(Ge) {
      var D = [], gt = -1, ct = 0, St = X.length, kt, en, ln;
      for (Ge instanceof Date || (Ge = new Date(+Ge)); ++gt < St; )
        X.charCodeAt(gt) === 37 && (D.push(X.slice(ct, gt)), (en = tp[kt = X.charAt(++gt)]) != null ? kt = X.charAt(++gt) : en = kt === "e" ? " " : "0", (ln = ce[kt]) && (kt = ln(Ge, en)), D.push(kt), ct = gt + 1);
      return D.push(X.slice(ct, gt)), D.join("");
    };
  }
  function te(X, ce) {
    return function(Ge) {
      var D = co(1900, void 0, 1), gt = Q(D, X, Ge += "", 0), ct, St;
      if (gt != Ge.length)
        return null;
      if ("Q" in D)
        return new Date(D.Q);
      if ("s" in D)
        return new Date(D.s * 1e3 + ("L" in D ? D.L : 0));
      if (ce && !("Z" in D) && (D.Z = 0), "p" in D && (D.H = D.H % 12 + D.p * 12), D.m === void 0 && (D.m = "q" in D ? D.q : 0), "V" in D) {
        if (D.V < 1 || D.V > 53)
          return null;
        "w" in D || (D.w = 1), "Z" in D ? (ct = Ks(co(D.y, 0, 1)), St = ct.getUTCDay(), ct = St > 4 || St === 0 ? Lo.ceil(ct) : Lo(ct), ct = Wi.offset(ct, (D.V - 1) * 7), D.y = ct.getUTCFullYear(), D.m = ct.getUTCMonth(), D.d = ct.getUTCDate() + (D.w + 6) % 7) : (ct = Xs(co(D.y, 0, 1)), St = ct.getDay(), ct = St > 4 || St === 0 ? Do.ceil(ct) : Do(ct), ct = Hi.offset(ct, (D.V - 1) * 7), D.y = ct.getFullYear(), D.m = ct.getMonth(), D.d = ct.getDate() + (D.w + 6) % 7);
      } else
        ("W" in D || "U" in D) && ("w" in D || (D.w = "u" in D ? D.u % 7 : "W" in D ? 1 : 0), St = "Z" in D ? Ks(co(D.y, 0, 1)).getUTCDay() : Xs(co(D.y, 0, 1)).getDay(), D.m = 0, D.d = "W" in D ? (D.w + 6) % 7 + D.W * 7 - (St + 5) % 7 : D.w + D.U * 7 - (St + 6) % 7);
      return "Z" in D ? (D.H += D.Z / 100 | 0, D.M += D.Z % 100, Ks(D)) : Xs(D);
    };
  }
  function Q(X, ce, Ge, D) {
    for (var gt = 0, ct = ce.length, St = Ge.length, kt, en; gt < ct; ) {
      if (D >= St)
        return -1;
      if (kt = ce.charCodeAt(gt++), kt === 37) {
        if (kt = ce.charAt(gt++), en = M[kt in tp ? ce.charAt(gt++) : kt], !en || (D = en(X, Ge, D)) < 0)
          return -1;
      } else if (kt != Ge.charCodeAt(D++))
        return -1;
    }
    return D;
  }
  function fe(X, ce, Ge) {
    var D = c.exec(ce.slice(Ge));
    return D ? (X.p = h.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function ve(X, ce, Ge) {
    var D = N.exec(ce.slice(Ge));
    return D ? (X.w = _.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function re(X, ce, Ge) {
    var D = p.exec(ce.slice(Ge));
    return D ? (X.w = w.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function ee(X, ce, Ge) {
    var D = k.exec(ce.slice(Ge));
    return D ? (X.m = $.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function be(X, ce, Ge) {
    var D = P.exec(ce.slice(Ge));
    return D ? (X.m = I.get(D[0].toLowerCase()), Ge + D[0].length) : -1;
  }
  function Oe(X, ce, Ge) {
    return Q(X, t, ce, Ge);
  }
  function ut(X, ce, Ge) {
    return Q(X, n, ce, Ge);
  }
  function Ve(X, ce, Ge) {
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
  function U(X) {
    return u[X.getMonth()];
  }
  function ue(X) {
    return i[+(X.getHours() >= 12)];
  }
  function Pe(X) {
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
  function Ie(X) {
    return i[+(X.getUTCHours() >= 12)];
  }
  function ze(X) {
    return 1 + ~~(X.getUTCMonth() / 3);
  }
  return {
    format: function(X) {
      var ce = L(X += "", T);
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
      var ce = L(X += "", G);
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
var tp = { "-": "", _: " ", 0: "0" }, Yt = /^\s*\d+/, dw = /^%/, pw = /[\\^$*+?|[\]().{}]/g;
function _t(e, t, n) {
  var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", o = i.length;
  return r + (o < n ? new Array(n - o + 1).join(t) + i : i);
}
function hw(e) {
  return e.replace(pw, "\\$&");
}
function fo(e) {
  return new RegExp("^(?:" + e.map(hw).join("|") + ")", "i");
}
function po(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function mw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function vw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function gw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function yw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function bw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function np(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function rp(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function ww(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function xw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function _w(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ip(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function Sw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function op(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function Rw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function Cw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function Nw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function Pw(e, t, n) {
  var r = Yt.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function Tw(e, t, n) {
  var r = dw.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function Ew(e, t, n) {
  var r = Yt.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function Mw(e, t, n) {
  var r = Yt.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function ap(e, t) {
  return _t(e.getDate(), t, 2);
}
function Ow(e, t) {
  return _t(e.getHours(), t, 2);
}
function Aw(e, t) {
  return _t(e.getHours() % 12 || 12, t, 2);
}
function kw(e, t) {
  return _t(1 + Hi.count(hr(e), e), t, 3);
}
function Sv(e, t) {
  return _t(e.getMilliseconds(), t, 3);
}
function Fw(e, t) {
  return Sv(e, t) + "000";
}
function $w(e, t) {
  return _t(e.getMonth() + 1, t, 2);
}
function Bw(e, t) {
  return _t(e.getMinutes(), t, 2);
}
function Iw(e, t) {
  return _t(e.getSeconds(), t, 2);
}
function Dw(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Lw(e, t) {
  return _t(oi.count(hr(e) - 1, e), t, 2);
}
function Rv(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? ai(e) : ai.ceil(e);
}
function zw(e, t) {
  return e = Rv(e), _t(ai.count(hr(e), e) + (hr(e).getDay() === 4), t, 2);
}
function Gw(e) {
  return e.getDay();
}
function jw(e, t) {
  return _t(Do.count(hr(e) - 1, e), t, 2);
}
function Hw(e, t) {
  return _t(e.getFullYear() % 100, t, 2);
}
function Ww(e, t) {
  return e = Rv(e), _t(e.getFullYear() % 100, t, 2);
}
function Vw(e, t) {
  return _t(e.getFullYear() % 1e4, t, 4);
}
function Uw(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? ai(e) : ai.ceil(e), _t(e.getFullYear() % 1e4, t, 4);
}
function qw(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + _t(t / 60 | 0, "0", 2) + _t(t % 60, "0", 2);
}
function up(e, t) {
  return _t(e.getUTCDate(), t, 2);
}
function Yw(e, t) {
  return _t(e.getUTCHours(), t, 2);
}
function Xw(e, t) {
  return _t(e.getUTCHours() % 12 || 12, t, 2);
}
function Kw(e, t) {
  return _t(1 + Wi.count(mr(e), e), t, 3);
}
function Cv(e, t) {
  return _t(e.getUTCMilliseconds(), t, 3);
}
function Qw(e, t) {
  return Cv(e, t) + "000";
}
function Zw(e, t) {
  return _t(e.getUTCMonth() + 1, t, 2);
}
function Jw(e, t) {
  return _t(e.getUTCMinutes(), t, 2);
}
function ex(e, t) {
  return _t(e.getUTCSeconds(), t, 2);
}
function tx(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function nx(e, t) {
  return _t(ui.count(mr(e) - 1, e), t, 2);
}
function Nv(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? si(e) : si.ceil(e);
}
function rx(e, t) {
  return e = Nv(e), _t(si.count(mr(e), e) + (mr(e).getUTCDay() === 4), t, 2);
}
function ix(e) {
  return e.getUTCDay();
}
function ox(e, t) {
  return _t(Lo.count(mr(e) - 1, e), t, 2);
}
function ax(e, t) {
  return _t(e.getUTCFullYear() % 100, t, 2);
}
function ux(e, t) {
  return e = Nv(e), _t(e.getUTCFullYear() % 100, t, 2);
}
function sx(e, t) {
  return _t(e.getUTCFullYear() % 1e4, t, 4);
}
function lx(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? si(e) : si.ceil(e), _t(e.getUTCFullYear() % 1e4, t, 4);
}
function cx() {
  return "+0000";
}
function sp() {
  return "%";
}
function lp(e) {
  return +e;
}
function cp(e) {
  return Math.floor(+e / 1e3);
}
var yi, Pv, Tv;
fx({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function fx(e) {
  return yi = fw(e), Pv = yi.format, yi.parse, Tv = yi.utcFormat, yi.utcParse, yi;
}
function dx(e) {
  return new Date(e);
}
function px(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function qc(e, t, n, r, i, o, a, u, f, c) {
  var h = Ac(), p = h.invert, w = h.domain, N = c(".%L"), _ = c(":%S"), P = c("%I:%M"), I = c("%I %p"), k = c("%a %d"), $ = c("%b %d"), T = c("%B"), G = c("%Y");
  function M(L) {
    return (f(L) < L ? N : u(L) < L ? _ : a(L) < L ? P : o(L) < L ? I : r(L) < L ? i(L) < L ? k : $ : n(L) < L ? T : G)(L);
  }
  return h.invert = function(L) {
    return new Date(p(L));
  }, h.domain = function(L) {
    return arguments.length ? w(Array.from(L, px)) : w().map(dx);
  }, h.ticks = function(L) {
    var te = w();
    return e(te[0], te[te.length - 1], L == null ? 10 : L);
  }, h.tickFormat = function(L, te) {
    return te == null ? M : c(te);
  }, h.nice = function(L) {
    var te = w();
    return (!L || typeof L.range != "function") && (L = t(te[0], te[te.length - 1], L == null ? 10 : L)), L ? w(Zm(te, L)) : h;
  }, h.copy = function() {
    return Zo(h, qc(e, t, n, r, i, o, a, u, f, c));
  }, h;
}
function Ev() {
  return On.apply(qc(xv, _v, hr, Au, oi, Hi, Ou, Mu, er, Pv).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function Mv() {
  return On.apply(qc(bv, wv, mr, $u, ui, Wi, Fu, ku, er, Tv).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Bu() {
  var e = 0, t = 1, n, r, i, o, a = un, u = !1, f;
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
      var N, _;
      return arguments.length ? ([N, _] = w, a = p(N, _), c) : [a(0), a(1)];
    };
  }
  return c.range = h(ji), c.rangeRound = h(Qo), c.unknown = function(p) {
    return arguments.length ? (f = p, c) : f;
  }, function(p) {
    return o = p, n = p(e), r = p(t), i = n === r ? 0 : 1 / (r - n), c;
  };
}
function jr(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function Ov() {
  var e = Gr(Bu()(un));
  return e.copy = function() {
    return jr(e, Ov());
  }, vr.apply(e, arguments);
}
function Av() {
  var e = Bc(Bu()).domain([1, 10]);
  return e.copy = function() {
    return jr(e, Av()).base(e.base());
  }, vr.apply(e, arguments);
}
function kv() {
  var e = Dc(Bu());
  return e.copy = function() {
    return jr(e, kv()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Yc() {
  var e = zc(Bu());
  return e.copy = function() {
    return jr(e, Yc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function hx() {
  return Yc.apply(null, arguments).exponent(0.5);
}
function Fv() {
  var e = [], t = un;
  function n(r) {
    if (r != null && !isNaN(r = +r))
      return t((Xo(e, r, 1) - 1) / (e.length - 1));
  }
  return n.domain = function(r) {
    if (!arguments.length)
      return e.slice();
    e = [];
    for (let i of r)
      i != null && !isNaN(i = +i) && e.push(i);
    return e.sort(Yo), n;
  }, n.interpolator = function(r) {
    return arguments.length ? (t = r, n) : t;
  }, n.range = function() {
    return e.map((r, i) => t(i / (e.length - 1)));
  }, n.quantiles = function(r) {
    return Array.from({ length: r + 1 }, (i, o) => Gb(e, o / r));
  }, n.copy = function() {
    return Fv(t).domain(e);
  }, vr.apply(n, arguments);
}
function Iu() {
  var e = 0, t = 0.5, n = 1, r = 1, i, o, a, u, f, c = un, h, p = !1, w;
  function N(P) {
    return isNaN(P = +P) ? w : (P = 0.5 + ((P = +h(P)) - o) * (r * P < r * o ? u : f), c(p ? Math.max(0, Math.min(1, P)) : P));
  }
  N.domain = function(P) {
    return arguments.length ? ([e, t, n] = P, i = h(e = +e), o = h(t = +t), a = h(n = +n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, N) : [e, t, n];
  }, N.clamp = function(P) {
    return arguments.length ? (p = !!P, N) : p;
  }, N.interpolator = function(P) {
    return arguments.length ? (c = P, N) : c;
  };
  function _(P) {
    return function(I) {
      var k, $, T;
      return arguments.length ? ([k, $, T] = I, c = qm(P, [k, $, T]), N) : [c(0), c(0.5), c(1)];
    };
  }
  return N.range = _(ji), N.rangeRound = _(Qo), N.unknown = function(P) {
    return arguments.length ? (w = P, N) : w;
  }, function(P) {
    return h = P, i = P(e), o = P(t), a = P(n), u = i === o ? 0 : 0.5 / (o - i), f = o === a ? 0 : 0.5 / (a - o), r = o < i ? -1 : 1, N;
  };
}
function $v() {
  var e = Gr(Iu()(un));
  return e.copy = function() {
    return jr(e, $v());
  }, vr.apply(e, arguments);
}
function Bv() {
  var e = Bc(Iu()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return jr(e, Bv()).base(e.base());
  }, vr.apply(e, arguments);
}
function Iv() {
  var e = Dc(Iu());
  return e.copy = function() {
    return jr(e, Iv()).constant(e.constant());
  }, vr.apply(e, arguments);
}
function Xc() {
  var e = zc(Iu());
  return e.copy = function() {
    return jr(e, Xc()).exponent(e.exponent());
  }, vr.apply(e, arguments);
}
function mx() {
  return Xc.apply(null, arguments).exponent(0.5);
}
const vx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Ru,
  scalePoint: pm,
  scaleIdentity: Qm,
  scaleLinear: $c,
  scaleLog: Ic,
  scaleSymlog: Lc,
  scaleOrdinal: Su,
  scaleImplicit: El,
  scalePow: Eu,
  scaleSqrt: Jm,
  scaleRadial: ev,
  scaleQuantile: Gc,
  scaleQuantize: jc,
  scaleThreshold: Hc,
  scaleTime: Ev,
  scaleUtc: Mv,
  scaleSequential: Ov,
  scaleSequentialLog: Av,
  scaleSequentialPow: Yc,
  scaleSequentialSqrt: hx,
  scaleSequentialSymlog: kv,
  scaleSequentialQuantile: Fv,
  scaleDiverging: $v,
  scaleDivergingLog: Bv,
  scaleDivergingPow: Xc,
  scaleDivergingSqrt: mx,
  scaleDivergingSymlog: Iv,
  tickFormat: Km
}, Symbol.toStringTag, { value: "Module" }));
function gx(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
function yx(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
function bx(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
function wx(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
function xx(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
function _x(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
function Sx(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var fp = {
  lab: zm,
  hcl: jm,
  "hcl-long": Hm,
  hsl: Dm,
  "hsl-long": Lm,
  cubehelix: Vm,
  "cubehelix-long": Um,
  rgb: ru
};
function Rx(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return fp[e];
  }
  var t = e.type, n = e.gamma, r = fp[t];
  return typeof n > "u" ? r : r.gamma(n);
}
function Cx(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = Rx(t.interpolate);
    e.interpolate(n);
  }
}
var Nx = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), Px = "%Y-%m-%d %H:%M";
function Tx(e) {
  var t = e.tickFormat(1, Px)(Nx);
  return t === "2020-02-02 03:04";
}
var dp = {
  day: Hi,
  hour: Ou,
  minute: Mu,
  month: Au,
  second: er,
  week: oi,
  year: hr
}, pp = {
  day: Wi,
  hour: Fu,
  minute: ku,
  month: $u,
  second: er,
  week: ui,
  year: mr
};
function Ex(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = Tx(r);
      if (typeof n == "string")
        r.nice(i ? pp[n] : dp[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? pp[o] : dp[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
function Mx(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
function Ox(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
function Ax(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(Qo));
}
function kx(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
function Fx(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
var $x = [
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
], Bx = {
  domain: gx,
  nice: Ex,
  zero: Fx,
  interpolate: Cx,
  round: Ax,
  align: bx,
  base: wx,
  clamp: xx,
  constant: _x,
  exponent: Sx,
  padding: Mx,
  range: yx,
  reverse: Ox,
  unknown: kx
};
function bn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = $x.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      Bx[f](a, u);
    }), a;
  };
}
var Ix = bn("domain", "range", "reverse", "align", "padding", "round");
function Dx(e) {
  return Ix(Ru(), e);
}
var Lx = bn("domain", "range", "reverse", "align", "padding", "round");
function zx(e) {
  return Lx(pm(), e);
}
var Gx = bn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function hp(e) {
  return Gx($c(), e);
}
var jx = bn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Hx(e) {
  return jx(Ev(), e);
}
var Wx = bn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round");
function Vx(e) {
  return Wx(Mv(), e);
}
var Ux = bn("domain", "range", "reverse", "base", "clamp", "interpolate", "nice", "round");
function qx(e) {
  return Ux(Ic(), e);
}
var Yx = bn("domain", "range", "reverse", "clamp", "exponent", "interpolate", "nice", "round", "zero");
function Xx(e) {
  return Yx(Eu(), e);
}
var Kx = bn("domain", "range", "reverse", "unknown");
function Qx(e) {
  return Kx(Su(), e);
}
var Zx = bn("domain", "range", "reverse", "nice", "zero");
function Jx(e) {
  return Zx(jc(), e);
}
var e_ = bn("domain", "range", "reverse");
function t_(e) {
  return e_(Gc(), e);
}
var n_ = bn("domain", "range", "reverse", "clamp", "constant", "nice", "zero", "round");
function r_(e) {
  return n_(Lc(), e);
}
var i_ = bn("domain", "range", "reverse");
function o_(e) {
  return i_(Hc(), e);
}
var a_ = bn("domain", "range", "reverse", "clamp", "interpolate", "nice", "round", "zero");
function u_(e) {
  return a_(Jm(), e);
}
function Ba(e) {
  if (typeof e < "u" && "type" in e)
    switch (e.type) {
      case "linear":
        return hp(e);
      case "log":
        return qx(e);
      case "pow":
        return Xx(e);
      case "sqrt":
        return u_(e);
      case "symlog":
        return r_(e);
      case "time":
        return Hx(e);
      case "utc":
        return Vx(e);
      case "quantile":
        return t_(e);
      case "quantize":
        return Jx(e);
      case "threshold":
        return o_(e);
      case "ordinal":
        return Qx(e);
      case "point":
        return zx(e);
      case "band":
        return Dx(e);
    }
  return hp(e);
}
function s_(e) {
  if ((typeof e == "function" || typeof e == "object" && !!e) && "valueOf" in e) {
    var t = e.valueOf();
    if (typeof t == "number")
      return t;
  }
  return e;
}
var l_ = /* @__PURE__ */ new Set(["linear", "pow", "quantize", "sqrt", "symlog"]);
function mp(e) {
  return l_.has(e.type);
}
var c_ = /* @__PURE__ */ yn.createContext({});
const Hr = c_;
function Dl(e) {
  var t, n = e;
  return n && "bandwidth" in n && (t = n == null ? void 0 : n.bandwidth()) != null ? t : 0;
}
function rn(e) {
  return e != null && typeof e == "number" && !Number.isNaN(e) && Number.isFinite(e);
}
let Kc = ea();
const at = (e) => Jo(e, Kc);
let Qc = ea();
at.write = (e) => Jo(e, Qc);
let Du = ea();
at.onStart = (e) => Jo(e, Du);
let Zc = ea();
at.onFrame = (e) => Jo(e, Zc);
let Jc = ea();
at.onFinish = (e) => Jo(e, Jc);
let Oi = [];
at.setTimeout = (e, t) => {
  let n = at.now() + t, r = () => {
    let o = Oi.findIndex((a) => a.cancel == r);
    ~o && Oi.splice(o, 1), Fr -= ~o ? 1 : 0;
  }, i = {
    time: n,
    handler: e,
    cancel: r
  };
  return Oi.splice(Dv(n), 0, i), Fr += 1, Lv(), i;
};
let Dv = (e) => ~(~Oi.findIndex((t) => t.time > e) || ~Oi.length);
at.cancel = (e) => {
  Du.delete(e), Zc.delete(e), Jc.delete(e), Kc.delete(e), Qc.delete(e);
};
at.sync = (e) => {
  Ll = !0, at.batchedUpdates(e), Ll = !1;
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
    Du.delete(n), t = null;
  }, r;
};
let ef = typeof window < "u" ? window.requestAnimationFrame : () => {
};
at.use = (e) => ef = e;
at.now = typeof performance < "u" ? () => performance.now() : Date.now;
at.batchedUpdates = (e) => e();
at.catch = console.error;
at.frameLoop = "always";
at.advance = () => {
  at.frameLoop !== "demand" ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : Gv();
};
let kr = -1, Fr = 0, Ll = !1;
function Jo(e, t) {
  Ll ? (t.delete(e), e(0)) : (t.add(e), Lv());
}
function Lv() {
  kr < 0 && (kr = 0, at.frameLoop !== "demand" && ef(zv));
}
function f_() {
  kr = -1;
}
function zv() {
  ~kr && (ef(zv), at.batchedUpdates(Gv));
}
function Gv() {
  let e = kr;
  kr = at.now();
  let t = Dv(kr);
  if (t && (jv(Oi.splice(0, t), (n) => n.handler()), Fr -= t), !Fr) {
    f_();
    return;
  }
  Du.flush(), Kc.flush(e ? Math.min(64, kr - e) : 16.667), Zc.flush(), Qc.flush(), Jc.flush();
}
function ea() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      Fr += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return Fr -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), Fr -= t.size, jv(t, (r) => r(n) && e.add(r)), Fr += e.size, t = e);
    }
  };
}
function jv(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      at.catch(r);
    }
  });
}
function zl() {
}
const d_ = (e, t, n) => Object.defineProperty(e, t, {
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
function cr(e, t) {
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
function rr(e, t, n) {
  if (de.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
const gn = (e) => de.und(e) ? [] : de.arr(e) ? e : [e];
function Eo(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), wt(n, t);
  }
}
const Ro = (e, ...t) => Eo(e, (n) => n(...t)), tf = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
let nf, Hv, Br = null, Wv = !1, rf = zl;
const p_ = (e) => {
  e.to && (Hv = e.to), e.now && (at.now = e.now), e.colors !== void 0 && (Br = e.colors), e.skipAnimation != null && (Wv = e.skipAnimation), e.createStringInterpolator && (nf = e.createStringInterpolator), e.requestAnimationFrame && at.use(e.requestAnimationFrame), e.batchedUpdates && (at.batchedUpdates = e.batchedUpdates), e.willAdvance && (rf = e.willAdvance), e.frameLoop && (at.frameLoop = e.frameLoop);
};
var ir = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return nf;
  },
  get to() {
    return Hv;
  },
  get colors() {
    return Br;
  },
  get skipAnimation() {
    return Wv;
  },
  get willAdvance() {
    return rf;
  },
  assign: p_
});
const Mo = /* @__PURE__ */ new Set();
let En = [], Qs = [], su = 0;
const Lu = {
  get idle() {
    return !Mo.size && !En.length;
  },
  start(e) {
    su > e.priority ? (Mo.add(e), at.onStart(h_)) : (Vv(e), at(Gl));
  },
  advance: Gl,
  sort(e) {
    if (su)
      at.onFrame(() => Lu.sort(e));
    else {
      const t = En.indexOf(e);
      ~t && (En.splice(t, 1), Uv(e));
    }
  },
  clear() {
    En = [], Mo.clear();
  }
};
function h_() {
  Mo.forEach(Vv), Mo.clear(), at(Gl);
}
function Vv(e) {
  En.includes(e) || Uv(e);
}
function Uv(e) {
  En.splice(m_(En, (t) => t.priority > e.priority), 0, e);
}
function Gl(e) {
  const t = Qs;
  for (let n = 0; n < En.length; n++) {
    const r = En[n];
    su = r.priority, r.idle || (rf(r), r.advance(e), r.idle || t.push(r));
  }
  return su = 0, Qs = En, Qs.length = 0, En = t, En.length > 0;
}
function m_(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
const v_ = {
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
}, Dn = "[-+]?\\d*\\.?\\d+", lu = Dn + "%";
function zu(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const g_ = new RegExp("rgb" + zu(Dn, Dn, Dn)), y_ = new RegExp("rgba" + zu(Dn, Dn, Dn, Dn)), b_ = new RegExp("hsl" + zu(Dn, lu, lu)), w_ = new RegExp("hsla" + zu(Dn, lu, lu, Dn)), x_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, __ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, S_ = /^#([0-9a-fA-F]{6})$/, R_ = /^#([0-9a-fA-F]{8})$/;
function C_(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = S_.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Br && Br[e] !== void 0 ? Br[e] : (t = g_.exec(e)) ? (bi(t[1]) << 24 | bi(t[2]) << 16 | bi(t[3]) << 8 | 255) >>> 0 : (t = y_.exec(e)) ? (bi(t[1]) << 24 | bi(t[2]) << 16 | bi(t[3]) << 8 | yp(t[4])) >>> 0 : (t = x_.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = R_.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = __.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = b_.exec(e)) ? (vp(gp(t[1]), Ia(t[2]), Ia(t[3])) | 255) >>> 0 : (t = w_.exec(e)) ? (vp(gp(t[1]), Ia(t[2]), Ia(t[3])) | yp(t[4])) >>> 0 : null;
}
function Zs(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function vp(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = Zs(i, r, e + 1 / 3), a = Zs(i, r, e), u = Zs(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(a * 255) << 16 | Math.round(u * 255) << 8;
}
function bi(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function gp(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function yp(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function Ia(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function bp(e) {
  let t = C_(e);
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
    return nf(e);
  const r = e, i = r.output, o = r.range || [0, 1], a = r.extrapolateLeft || r.extrapolate || "extend", u = r.extrapolateRight || r.extrapolate || "extend", f = r.easing || ((c) => c);
  return (c) => {
    const h = P_(c, o);
    return N_(c, o[h], o[h + 1], i[h], i[h + 1], f, a, u, r.map);
  };
};
function N_(e, t, n, r, i, o, a, u, f) {
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
function P_(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
function jl() {
  return jl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, jl.apply(this, arguments);
}
const Di = Symbol.for("FluidValue.get"), li = Symbol.for("FluidValue.observers"), Tn = (e) => Boolean(e && e[Di]), dn = (e) => e && e[Di] ? e[Di]() : e, wp = (e) => e[li] || null;
function T_(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function Go(e, t) {
  let n = e[li];
  n && n.forEach((r) => {
    T_(r, t);
  });
}
class qv {
  constructor(t) {
    if (this[Di] = void 0, this[li] = void 0, !t && !(t = this.get))
      throw Error("Unknown getter");
    E_(this, t);
  }
}
const E_ = (e, t) => Yv(e, Di, t);
function Vi(e, t) {
  if (e[Di]) {
    let n = e[li];
    n || Yv(e, li, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function jo(e, t) {
  let n = e[li];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[li] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
const Yv = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), Ya = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, M_ = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, xp = new RegExp(`(${Ya.source})(%|[a-z]+)`, "i"), O_ = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, Gu = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, Xv = (e) => {
  const [t, n] = A_(e);
  if (!t || tf())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && Gu.test(n))
      return Xv(n);
    if (n)
      return n;
  }
  return e;
}, A_ = (e) => {
  const t = Gu.exec(e);
  if (!t)
    return [,];
  const [, n, r] = t;
  return [n, r];
};
let Js;
const k_ = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, Kv = (e) => {
  Js || (Js = Br ? new RegExp(`(${Object.keys(Br).join("|")})(?!\\w)`, "g") : /^\b$/);
  const t = e.output.map((o) => dn(o).replace(Gu, Xv).replace(M_, bp).replace(Js, bp)), n = t.map((o) => o.match(Ya).map(Number)), i = n[0].map((o, a) => n.map((u) => {
    if (!(a in u))
      throw Error('The arity of each "output" value must be equal');
    return u[a];
  })).map((o) => zo(jl({}, e, {
    output: o
  })));
  return (o) => {
    var a;
    const u = !xp.test(t[0]) && ((a = t.find((c) => xp.test(c))) == null ? void 0 : a.replace(Ya, ""));
    let f = 0;
    return t[0].replace(Ya, () => `${i[f++](o)}${u || ""}`).replace(O_, k_);
  };
}, of = "react-spring: ", Qv = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${of}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, F_ = Qv(console.warn);
function $_() {
  F_(`${of}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const B_ = Qv(console.warn);
function I_() {
  B_(`${of}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function ju(e) {
  return de.str(e) && (e[0] == "#" || /\d/.test(e) || !tf() && Gu.test(e) || e in (Br || {}));
}
const af = tf() ? on : zg, D_ = () => {
  const e = Jt(!1);
  return af(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Zv() {
  const e = Lr()[1], t = D_();
  return () => {
    t.current && e(Math.random());
  };
}
function L_(e, t) {
  const [n] = Lr(() => ({
    inputs: t,
    result: e()
  })), r = Jt(), i = r.current;
  let o = i;
  return o ? Boolean(t && o.inputs && z_(t, o.inputs)) || (o = {
    inputs: t,
    result: e()
  }) : o = n, on(() => {
    r.current = o, i == n && (n.inputs = n.result = void 0);
  }, [o]), o.result;
}
function z_(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
const Jv = (e) => on(e, G_), G_ = [];
function _p(e) {
  const t = Jt();
  return on(() => {
    t.current = e;
  }), t.current;
}
var j_ = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@react-spring/animated/dist/react-spring-animated.esm.js";
const Ho = Symbol.for("Animated:node"), H_ = (e) => !!e && e[Ho] === e, Zn = (e) => e && e[Ho], uf = (e, t) => d_(e, Ho, t), Hu = (e) => e && e[Ho] && e[Ho].getPayload();
class eg {
  constructor() {
    this.payload = void 0, uf(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}
class Ui extends eg {
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
class Li extends Ui {
  constructor(t) {
    super(0), this._string = null, this._toString = void 0, this._toString = zo({
      output: [t, t]
    });
  }
  static create(t) {
    return new Li(t);
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
const cu = {
  dependencies: null
};
class Wu extends eg {
  constructor(t) {
    super(), this.source = t, this.setValue(t);
  }
  getValue(t) {
    const n = {};
    return rr(this.source, (r, i) => {
      H_(r) ? n[i] = r.getValue(t) : Tn(r) ? n[i] = dn(r) : t || (n[i] = r);
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
      return rr(t, this._addToPayload, n), Array.from(n);
    }
  }
  _addToPayload(t) {
    cu.dependencies && Tn(t) && cu.dependencies.add(t);
    const n = Hu(t);
    n && wt(n, (r) => this.add(r));
  }
}
class sf extends Wu {
  constructor(t) {
    super(t);
  }
  static create(t) {
    return new sf(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(W_)), !0);
  }
}
function W_(e) {
  return (ju(e) ? Li : Ui).create(e);
}
function Hl(e) {
  const t = Zn(e);
  return t ? t.constructor : de.arr(e) ? sf : ju(e) ? Li : Ui;
}
function Wl() {
  return Wl = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Wl.apply(this, arguments);
}
const Sp = (e, t) => {
  const n = !de.fun(e) || e.prototype && e.prototype.isReactComponent;
  return Gg((r, i) => {
    const o = Jt(null), a = n && xt((_) => {
      o.current = q_(i, _);
    }, [i]), [u, f] = U_(r, t), c = Zv(), h = () => {
      const _ = o.current;
      if (n && !_)
        return;
      (_ ? t.applyAnimatedValues(_, u.getValue(!0)) : !1) === !1 && c();
    }, p = new V_(h, f), w = Jt();
    af(() => (w.current = p, wt(f, (_) => Vi(_, p)), () => {
      w.current && (wt(w.current.deps, (_) => jo(_, w.current)), at.cancel(w.current.update));
    })), on(h, []), Jv(() => () => {
      const _ = w.current;
      wt(_.deps, (P) => jo(P, _));
    });
    const N = t.getComponentProps(u.getValue());
    return /* @__PURE__ */ B(e, {
      ...N,
      ref: a
    }, void 0, !1, {
      fileName: j_,
      lineNumber: 291,
      columnNumber: 12
    }, globalThis);
  });
};
class V_ {
  constructor(t, n) {
    this.update = t, this.deps = n;
  }
  eventObserved(t) {
    t.type == "change" && at.write(this.update);
  }
}
function U_(e, t) {
  const n = /* @__PURE__ */ new Set();
  return cu.dependencies = n, e.style && (e = Wl({}, e, {
    style: t.createAnimatedStyle(e.style)
  })), e = new Wu(e), cu.dependencies = null, [e, n];
}
function q_(e, t) {
  return e && (de.fun(e) ? e(t) : e.current = t), t;
}
const Rp = Symbol.for("AnimatedComponent"), Y_ = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new Wu(i),
  getComponentProps: r = (i) => i
} = {}) => {
  const i = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, o = (a) => {
    const u = Cp(a) || "Anonymous";
    return de.str(a) ? a = o[a] || (o[a] = Sp(a, i)) : a = a[Rp] || (a[Rp] = Sp(a, i)), a.displayName = `Animated(${u})`, a;
  };
  return rr(e, (a, u) => {
    de.arr(e) && (u = Cp(a)), o[u] = o(a);
  }), {
    animated: o
  };
}, Cp = (e) => de.str(e) ? e : e && de.str(e.displayName) ? e.displayName : de.fun(e) && e.name || null;
var X_ = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@react-spring/core/dist/react-spring-core.esm.js";
function qt() {
  return qt = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, qt.apply(this, arguments);
}
function Jr(e, ...t) {
  return de.fun(e) ? e(...t) : e;
}
const Oo = (e, t) => e === !0 || !!(t && e && (de.fun(e) ? e(t) : gn(e).includes(t))), tg = (e, t) => de.obj(e) ? t && e[t] : e, ng = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, K_ = (e) => e, lf = (e, t = K_) => {
  let n = Q_;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    de.und(o) || (r[i] = o);
  }
  return r;
}, Q_ = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"], Z_ = {
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
function J_(e) {
  const t = {};
  let n = 0;
  if (rr(e, (r, i) => {
    Z_[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function rg(e) {
  const t = J_(e);
  if (t) {
    const n = {
      to: t
    };
    return rr(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return qt({}, e);
}
function Wo(e) {
  return e = dn(e), de.arr(e) ? e.map(Wo) : ju(e) ? ir.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function eS(e) {
  for (const t in e)
    return !0;
  return !1;
}
function Vl(e) {
  return de.fun(e) || de.arr(e) && de.obj(e[0]);
}
function tS(e, t) {
  var n;
  (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
}
function nS(e, t) {
  if (t && e.ref !== t) {
    var n;
    (n = e.ref) == null || n.delete(e), t.add(e), e.ref = t;
  }
}
const rS = {
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
}, fu = 1.70158, Da = fu * 1.525, Np = fu + 1, Pp = 2 * Math.PI / 3, Tp = 2 * Math.PI / 4.5, La = (e) => e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375, iS = {
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
  easeInBack: (e) => Np * e * e * e - fu * e * e,
  easeOutBack: (e) => 1 + Np * Math.pow(e - 1, 3) + fu * Math.pow(e - 1, 2),
  easeInOutBack: (e) => e < 0.5 ? Math.pow(2 * e, 2) * ((Da + 1) * 2 * e - Da) / 2 : (Math.pow(2 * e - 2, 2) * ((Da + 1) * (e * 2 - 2) + Da) + 2) / 2,
  easeInElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((e * 10 - 10.75) * Pp),
  easeOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((e * 10 - 0.75) * Pp) + 1,
  easeInOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * Tp)) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * Tp) / 2 + 1,
  easeInBounce: (e) => 1 - La(1 - e),
  easeOutBounce: La,
  easeInOutBounce: (e) => e < 0.5 ? (1 - La(1 - 2 * e)) / 2 : (1 + La(2 * e - 1)) / 2
}, Ul = qt({}, rS.default, {
  mass: 1,
  damping: 1,
  easing: iS.linear,
  clamp: !1
});
class oS {
  constructor() {
    this.tension = void 0, this.friction = void 0, this.frequency = void 0, this.damping = void 0, this.mass = void 0, this.velocity = 0, this.restVelocity = void 0, this.precision = void 0, this.progress = void 0, this.duration = void 0, this.easing = void 0, this.clamp = void 0, this.bounce = void 0, this.decay = void 0, this.round = void 0, Object.assign(this, Ul);
  }
}
function aS(e, t, n) {
  n && (n = qt({}, n), Ep(n, t), t = qt({}, n, t)), Ep(e, t), Object.assign(e, t);
  for (const a in Ul)
    e[a] == null && (e[a] = Ul[a]);
  let {
    mass: r,
    frequency: i,
    damping: o
  } = e;
  return de.und(i) || (i < 0.01 && (i = 0.01), o < 0 && (o = 0), e.tension = Math.pow(2 * Math.PI / i, 2) * r, e.friction = 4 * Math.PI * o * r / i), e;
}
function Ep(e, t) {
  if (!de.und(t.decay))
    e.duration = void 0;
  else {
    const n = !de.und(t.tension) || !de.und(t.friction);
    (n || !de.und(t.frequency) || !de.und(t.damping) || !de.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
const Mp = [];
class uS {
  constructor() {
    this.changed = !1, this.values = Mp, this.toValues = null, this.fromValues = Mp, this.to = void 0, this.from = void 0, this.config = new oS(), this.immediate = !1;
  }
}
function ig(e, {
  key: t,
  props: n,
  defaultProps: r,
  state: i,
  actions: o
}) {
  return new Promise((a, u) => {
    var f;
    let c, h, p = Oo((f = n.cancel) != null ? f : r == null ? void 0 : r.cancel, t);
    if (p)
      _();
    else {
      de.und(n.pause) || (i.paused = Oo(n.pause, t));
      let P = r == null ? void 0 : r.pause;
      P !== !0 && (P = i.paused || Oo(P, t)), c = Jr(n.delay || 0, t), P ? (i.resumeQueue.add(N), o.pause()) : (o.resume(), N());
    }
    function w() {
      i.resumeQueue.add(N), i.timeouts.delete(h), h.cancel(), c = h.time - at.now();
    }
    function N() {
      c > 0 && !ir.skipAnimation ? (i.delayed = !0, h = at.setTimeout(_, c), i.pauseQueue.add(w), i.timeouts.add(h)) : _();
    }
    function _() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(w), i.timeouts.delete(h), e <= (i.cancelId || 0) && (p = !0);
      try {
        o.start(qt({}, n, {
          callId: e,
          cancel: p
        }), a);
      } catch (P) {
        u(P);
      }
    }
  });
}
const cf = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? Ai(e.get()) : t.every((n) => n.noop) ? og(e.get()) : In(e.get(), t.every((n) => n.finished)), og = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), In = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), Ai = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function ag(e, t, n, r) {
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
    const c = lf(t, (I, k) => k === "onRest" ? void 0 : I);
    let h, p;
    const w = new Promise((I, k) => (h = I, p = k)), N = (I) => {
      const k = i <= (n.cancelId || 0) && Ai(r) || i !== n.asyncId && In(r, !1);
      if (k)
        throw I.result = k, p(I), I;
    }, _ = (I, k) => {
      const $ = new Op(), T = new Ap();
      return (async () => {
        if (ir.skipAnimation)
          throw Vo(n), T.result = In(r, !1), p(T), T;
        N($);
        const G = de.obj(I) ? qt({}, I) : qt({}, k, {
          to: I
        });
        G.parentId = i, rr(c, (L, te) => {
          de.und(G[te]) && (G[te] = L);
        });
        const M = await r.start(G);
        return N($), n.paused && await new Promise((L) => {
          n.resumeQueue.add(L);
        }), M;
      })();
    };
    let P;
    if (ir.skipAnimation)
      return Vo(n), In(r, !1);
    try {
      let I;
      de.arr(e) ? I = (async (k) => {
        for (const $ of k)
          await _($);
      })(e) : I = Promise.resolve(e(_, r.stop.bind(r))), await Promise.all([I.then(h), w]), P = In(r.get(), !0, !1);
    } catch (I) {
      if (I instanceof Op)
        P = I.result;
      else if (I instanceof Ap)
        P = I.result;
      else
        throw I;
    } finally {
      i == n.asyncId && (n.asyncId = o, n.asyncTo = o ? u : void 0, n.promise = o ? f : void 0);
    }
    return de.fun(a) && at.batchedUpdates(() => {
      a(P, r, r.item);
    }), P;
  })();
}
function Vo(e, t) {
  Eo(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
class Op extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."), this.result = void 0;
  }
}
class Ap extends Error {
  constructor() {
    super("SkipAnimationSignal"), this.result = void 0;
  }
}
const ql = (e) => e instanceof ff;
let sS = 1;
class ff extends qv {
  constructor(...t) {
    super(...t), this.id = sS++, this.key = void 0, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(t) {
    this._priority != t && (this._priority = t, this._onPriorityChange(t));
  }
  get() {
    const t = Zn(this);
    return t && t.getValue();
  }
  to(...t) {
    return ir.to(this, t);
  }
  interpolate(...t) {
    return $_(), ir.to(this, t);
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
    Go(this, {
      type: "change",
      parent: this,
      value: t,
      idle: n
    });
  }
  _onPriorityChange(t) {
    this.idle || Lu.sort(this), Go(this, {
      type: "priority",
      parent: this,
      priority: t
    });
  }
}
const ci = Symbol.for("SpringPhase"), ug = 1, Yl = 2, Xl = 4, el = (e) => (e[ci] & ug) > 0, Nr = (e) => (e[ci] & Yl) > 0, ho = (e) => (e[ci] & Xl) > 0, kp = (e, t) => t ? e[ci] |= Yl | ug : e[ci] &= ~Yl, Fp = (e, t) => t ? e[ci] |= Xl : e[ci] &= ~Xl;
class lS extends ff {
  constructor(t, n) {
    if (super(), this.key = void 0, this.animation = new uS(), this.queue = void 0, this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !de.und(t) || !de.und(n)) {
      const r = de.obj(t) ? qt({}, t) : qt({}, n, {
        from: t
      });
      de.und(r.default) && (r.default = !0), this.start(r);
    }
  }
  get idle() {
    return !(Nr(this) || this._state.asyncTo) || ho(this);
  }
  get goal() {
    return dn(this.animation.to);
  }
  get velocity() {
    const t = Zn(this);
    return t instanceof Ui ? t.lastVelocity || 0 : t.getPayload().map((n) => n.lastVelocity || 0);
  }
  get hasAnimated() {
    return el(this);
  }
  get isAnimating() {
    return Nr(this);
  }
  get isPaused() {
    return ho(this);
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
    const u = Hu(i.to);
    !u && Tn(i.to) && (a = gn(dn(i.to))), i.values.forEach((h, p) => {
      if (h.done)
        return;
      const w = h.constructor == Li ? 1 : u ? u[p].lastPosition : a[p];
      let N = i.immediate, _ = w;
      if (!N) {
        if (_ = h.lastPosition, o.tension <= 0) {
          h.done = !0;
          return;
        }
        let P = h.elapsedTime += t;
        const I = i.fromValues[p], k = h.v0 != null ? h.v0 : h.v0 = de.arr(o.velocity) ? o.velocity[p] : o.velocity;
        let $;
        if (de.und(o.duration))
          if (o.decay) {
            const T = o.decay === !0 ? 0.998 : o.decay, G = Math.exp(-(1 - T) * P);
            _ = I + k / (1 - T) * (1 - G), N = Math.abs(h.lastPosition - _) < 0.1, $ = k * G;
          } else {
            $ = h.lastVelocity == null ? k : h.lastVelocity;
            const T = o.precision || (I == w ? 5e-3 : Math.min(1, Math.abs(w - I) * 1e-3)), G = o.restVelocity || T / 10, M = o.clamp ? 0 : o.bounce, L = !de.und(M), te = I == w ? h.v0 > 0 : I < w;
            let Q, fe = !1;
            const ve = 1, re = Math.ceil(t / ve);
            for (let ee = 0; ee < re && (Q = Math.abs($) > G, !(!Q && (N = Math.abs(w - _) <= T, N))); ++ee) {
              L && (fe = _ == w || _ > w == te, fe && ($ = -$ * M, _ = w));
              const be = -o.tension * 1e-6 * (_ - w), Oe = -o.friction * 1e-3 * $, ut = (be + Oe) / o.mass;
              $ = $ + ut * ve, _ = _ + $ * ve;
            }
          }
        else {
          let T = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, h.durationProgress > 0 && (h.elapsedTime = o.duration * h.durationProgress, P = h.elapsedTime += t)), T = (o.progress || 0) + P / this._memoizedDuration, T = T > 1 ? 1 : T < 0 ? 0 : T, h.durationProgress = T), _ = I + o.easing(T) * (w - I), $ = (_ - h.lastPosition) / t, N = T == 1;
        }
        h.lastVelocity = $, Number.isNaN(_) && (console.warn("Got NaN while animating:", this), N = !0);
      }
      u && !u[p].done && (N = !1), N ? h.done = !0 : n = !1, h.setValue(_, o.round) && (r = !0);
    });
    const f = Zn(this), c = f.getValue();
    if (n) {
      const h = dn(i.to);
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
    if (Nr(this)) {
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
    return de.und(t) ? (r = this.queue || [], this.queue = []) : r = [de.obj(t) ? t : qt({}, n, {
      to: t
    })], Promise.all(r.map((i) => this._update(i))).then((i) => cf(this, i));
  }
  stop(t) {
    const {
      to: n
    } = this.animation;
    return this._focus(this.get()), Vo(this._state, t && this._lastCallId), at.batchedUpdates(() => this._stop(n, t)), this;
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
    r = de.obj(r) ? r[n] : r, (r == null || Vl(r)) && (r = void 0), i = de.obj(i) ? i[n] : i, i == null && (i = void 0);
    const o = {
      to: r,
      from: i
    };
    return el(this) || (t.reverse && ([r, i] = [i, r]), i = dn(i), de.und(i) ? Zn(this) || this._set(r) : this._set(i)), o;
  }
  _update(t, n) {
    let r = qt({}, t);
    const {
      key: i,
      defaultProps: o
    } = this;
    r.default && Object.assign(o, lf(r, (f, c) => /^on/.test(c) ? tg(f, i) : f)), Bp(this, r, "onProps"), vo(this, "onProps", r, this);
    const a = this._prepareNode(r);
    if (Object.isFrozen(this))
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    const u = this._state;
    return ig(++this._lastCallId, {
      key: i,
      props: r,
      defaultProps: o,
      state: u,
      actions: {
        pause: () => {
          ho(this) || (Fp(this, !0), Ro(u.pauseQueue), vo(this, "onPause", In(this, mo(this, this.animation.to)), this));
        },
        resume: () => {
          ho(this) && (Fp(this, !1), Nr(this) && this._resume(), Ro(u.resumeQueue), vo(this, "onResume", In(this, mo(this, this.animation.to)), this));
        },
        start: this._merge.bind(this, a)
      }
    }).then((f) => {
      if (r.loop && f.finished && !(n && f.noop)) {
        const c = sg(r);
        if (c)
          return this._update(c, !0);
      }
      return f;
    });
  }
  _merge(t, n, r) {
    if (n.cancel)
      return this.stop(!0), r(Ai(this));
    const i = !de.und(t.to), o = !de.und(t.from);
    if (i || o)
      if (n.callId > this._lastToId)
        this._lastToId = n.callId;
      else
        return r(Ai(this));
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
    const N = !cr(w, h);
    N && (f.from = w), w = dn(w);
    const _ = !cr(p, c);
    _ && this._focus(p);
    const P = Vl(n.to), {
      config: I
    } = f, {
      decay: k,
      velocity: $
    } = I;
    (i || o) && (I.velocity = 0), n.config && !P && aS(I, Jr(n.config, a), n.config !== u.config ? Jr(u.config, a) : void 0);
    let T = Zn(this);
    if (!T || de.und(p))
      return r(In(this, !0));
    const G = de.und(n.reset) ? o && !n.default : !de.und(w) && Oo(n.reset, a), M = G ? w : this.get(), L = Wo(p), te = de.num(L) || de.arr(L) || ju(L), Q = !P && (!te || Oo(u.immediate || n.immediate, a));
    if (_) {
      const ee = Hl(p);
      if (ee !== T.constructor)
        if (Q)
          T = this._set(L);
        else
          throw Error(`Cannot animate between ${T.constructor.name} and ${ee.name}, as the "to" prop suggests`);
    }
    const fe = T.constructor;
    let ve = Tn(p), re = !1;
    if (!ve) {
      const ee = G || !el(this) && N;
      (_ || ee) && (re = cr(Wo(M), L), ve = !re), (!cr(f.immediate, Q) && !Q || !cr(I.decay, k) || !cr(I.velocity, $)) && (ve = !0);
    }
    if (re && Nr(this) && (f.changed && !G ? ve = !0 : ve || this._stop(c)), !P && ((ve || Tn(c)) && (f.values = T.getPayload(), f.toValues = Tn(p) ? null : fe == Li ? [1] : gn(L)), f.immediate != Q && (f.immediate = Q, !Q && !G && this._set(c)), ve)) {
      const {
        onRest: ee
      } = f;
      wt(fS, (Oe) => Bp(this, n, Oe));
      const be = In(this, mo(this, c));
      Ro(this._pendingCalls, be), this._pendingCalls.add(r), f.changed && at.batchedUpdates(() => {
        f.changed = !G, ee == null || ee(be, this), G ? Jr(u.onRest, be) : f.onStart == null || f.onStart(be, this);
      });
    }
    G && this._set(M), P ? r(ag(n.to, n, this._state, this)) : ve ? this._start() : Nr(this) && !_ ? this._pendingCalls.add(r) : r(og(M));
  }
  _focus(t) {
    const n = this.animation;
    t !== n.to && (wp(this) && this._detach(), n.to = t, wp(this) && this._attach());
  }
  _attach() {
    let t = 0;
    const {
      to: n
    } = this.animation;
    Tn(n) && (Vi(n, this), ql(n) && (t = n.priority + 1)), this.priority = t;
  }
  _detach() {
    const {
      to: t
    } = this.animation;
    Tn(t) && jo(t, this);
  }
  _set(t, n = !0) {
    const r = dn(t);
    if (!de.und(r)) {
      const i = Zn(this);
      if (!i || !cr(r, i.getValue())) {
        const o = Hl(r);
        !i || i.constructor != o ? uf(this, o.create(r)) : i.setValue(r), i && at.batchedUpdates(() => {
          this._onChange(r, n);
        });
      }
    }
    return Zn(this);
  }
  _onStart() {
    const t = this.animation;
    t.changed || (t.changed = !0, vo(this, "onStart", In(this, mo(this, t.to)), this));
  }
  _onChange(t, n) {
    n || (this._onStart(), Jr(this.animation.onChange, t, this)), Jr(this.defaultProps.onChange, t, this), super._onChange(t, n);
  }
  _start() {
    const t = this.animation;
    Zn(this).reset(dn(t.to)), t.immediate || (t.fromValues = t.values.map((n) => n.lastPosition)), Nr(this) || (kp(this, !0), ho(this) || this._resume());
  }
  _resume() {
    ir.skipAnimation ? this.finish() : Lu.start(this);
  }
  _stop(t, n) {
    if (Nr(this)) {
      kp(this, !1);
      const r = this.animation;
      wt(r.values, (o) => {
        o.done = !0;
      }), r.toValues && (r.onChange = r.onPause = r.onResume = void 0), Go(this, {
        type: "idle",
        parent: this
      });
      const i = n ? Ai(this.get()) : In(this.get(), mo(this, t != null ? t : r.to));
      Ro(this._pendingCalls, i), r.changed && (r.changed = !1, vo(this, "onRest", i, this));
    }
  }
}
function mo(e, t) {
  const n = Wo(t), r = Wo(e.get());
  return cr(r, n);
}
function sg(e, t = e.loop, n = e.to) {
  let r = Jr(t);
  if (r) {
    const i = r !== !0 && rg(r), o = (i || e).reverse, a = !i || i.reset;
    return Uo(qt({}, e, {
      loop: t,
      default: !1,
      pause: void 0,
      to: !o || Vl(n) ? n : void 0,
      from: a ? e.from : void 0,
      reset: a
    }, i));
  }
}
function Uo(e) {
  const {
    to: t,
    from: n
  } = e = rg(e), r = /* @__PURE__ */ new Set();
  return de.obj(t) && $p(t, r), de.obj(n) && $p(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function cS(e) {
  const t = Uo(e);
  return de.und(t.default) && (t.default = lf(t)), t;
}
function $p(e, t) {
  rr(e, (n, r) => n != null && t.add(r));
}
const fS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function Bp(e, t, n) {
  e.animation[n] = t[n] !== ng(t, n) ? tg(t[n], e.key) : void 0;
}
function vo(e, t, ...n) {
  var r, i, o, a;
  (r = (i = e.animation)[t]) == null || r.call(i, ...n), (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
}
const dS = ["onStart", "onChange", "onRest"];
let pS = 1;
class hS {
  constructor(t, n) {
    this.id = pS++, this.springs = {}, this.queue = [], this.ref = void 0, this._flush = void 0, this._initialProps = void 0, this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._item = void 0, this._state = {
      paused: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    }, this._onFrame = this._onFrame.bind(this), n && (this._flush = n), t && this.start(qt({
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
    return t ? n = gn(t).map(Uo) : this.queue = [], this._flush ? this._flush(this, n) : (pg(this, n), Kl(this, n));
  }
  stop(t, n) {
    if (t !== !!t && (n = t), n) {
      const r = this.springs;
      wt(gn(n), (i) => r[i].stop(!!t));
    } else
      Vo(this._state, this._lastAsyncId), this.each((r) => r.stop(!!t));
    return this;
  }
  pause(t) {
    if (de.und(t))
      this.start({
        pause: !0
      });
    else {
      const n = this.springs;
      wt(gn(t), (r) => n[r].pause());
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
      wt(gn(t), (r) => n[r].resume());
    }
    return this;
  }
  each(t) {
    rr(this.springs, t);
  }
  _onFrame() {
    const {
      onStart: t,
      onChange: n,
      onRest: r
    } = this._events, i = this._active.size > 0, o = this._changed.size > 0;
    (i && !this._started || o && !this._started) && (this._started = !0, Eo(t, ([f, c]) => {
      c.value = this.get(), f(c, this, this._item);
    }));
    const a = !i && this._started, u = o || a && r.size ? this.get() : null;
    o && n.size && Eo(n, ([f, c]) => {
      c.value = u, f(c, this, this._item);
    }), a && (this._started = !1, Eo(r, ([f, c]) => {
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
function Kl(e, t) {
  return Promise.all(t.map((n) => lg(e, n))).then((n) => cf(e, n));
}
async function lg(e, t, n) {
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
  h ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : wt(dS, (P) => {
    const I = t[P];
    if (de.fun(I)) {
      const k = e._events[P];
      t[P] = ({
        finished: $,
        cancelled: T
      }) => {
        const G = k.get(I);
        G ? ($ || (G.finished = !1), T && (G.cancelled = !0)) : k.set(I, {
          value: null,
          finished: $ || !1,
          cancelled: T || !1
        });
      }, c && (c[P] = t[P]);
    }
  });
  const p = e._state;
  t.pause === !p.paused ? (p.paused = t.pause, Ro(t.pause ? p.pauseQueue : p.resumeQueue)) : p.paused && (t.pause = !0);
  const w = (r || Object.keys(e.springs)).map((P) => e.springs[P].start(t)), N = t.cancel === !0 || ng(t, "cancel") === !0;
  (h || N && p.asyncId) && w.push(ig(++e._lastAsyncId, {
    props: t,
    state: p,
    actions: {
      pause: zl,
      resume: zl,
      start(P, I) {
        N ? (Vo(p, e._lastAsyncId), I(Ai(e))) : (P.onRest = u, I(ag(h, P, p, e)));
      }
    }
  })), p.paused && await new Promise((P) => {
    p.resumeQueue.add(P);
  });
  const _ = cf(e, await Promise.all(w));
  if (a && _.finished && !(n && _.noop)) {
    const P = sg(t, a, i);
    if (P)
      return pg(e, [P]), lg(e, P, !0);
  }
  return f && at.batchedUpdates(() => f(_, e, e.item)), _;
}
function Ip(e, t) {
  const n = qt({}, e.springs);
  return t && wt(gn(t), (r) => {
    de.und(r.keys) && (r = Uo(r)), de.obj(r.to) || (r = qt({}, r, {
      to: void 0
    })), dg(n, r, (i) => fg(i));
  }), cg(e, n), n;
}
function cg(e, t) {
  rr(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Vi(n, e));
  });
}
function fg(e, t) {
  const n = new lS();
  return n.key = e, t && Vi(n, t), n;
}
function dg(e, t, n) {
  t.keys && wt(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function pg(e, t) {
  wt(t, (n) => {
    dg(e.springs, n, (r) => fg(r, e));
  });
}
function mS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const vS = ["children"], Vu = (e) => {
  let {
    children: t
  } = e, n = mS(e, vS);
  const r = sn(du), i = n.pause || !!r.pause, o = n.immediate || !!r.immediate;
  n = L_(() => ({
    pause: i,
    immediate: o
  }), [i, o]);
  const {
    Provider: a
  } = du;
  return /* @__PURE__ */ B(a, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: X_,
    lineNumber: 1849,
    columnNumber: 10
  }, globalThis);
}, du = gS(Vu, {});
Vu.Provider = du.Provider;
Vu.Consumer = du.Consumer;
function gS(e, t) {
  return Object.assign(e, Tt.createContext(t)), e.Provider._context = e, e.Consumer._context = e, e;
}
const yS = () => {
  const e = [], t = function(i) {
    I_();
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
function bS(e, t, n) {
  const r = de.fun(t) && t;
  r && !n && (n = []);
  const i = Vt(() => r || arguments.length == 3 ? yS() : void 0, []), o = Jt(0), a = Zv(), u = Vt(() => ({
    ctrls: [],
    queue: [],
    flush(k, $) {
      const T = Ip(k, $);
      return o.current > 0 && !u.queue.length && !Object.keys(T).some((M) => !k.springs[M]) ? Kl(k, $) : new Promise((M) => {
        cg(k, T), u.queue.push(() => {
          M(Kl(k, $));
        }), a();
      });
    }
  }), []), f = Jt([...u.ctrls]), c = [], h = _p(e) || 0;
  Vt(() => {
    wt(f.current.slice(e, h), (k) => {
      tS(k, i), k.stop(!0);
    }), f.current.length = e, p(h, e);
  }, [e]), Vt(() => {
    p(0, Math.min(h, e));
  }, n);
  function p(k, $) {
    for (let T = k; T < $; T++) {
      const G = f.current[T] || (f.current[T] = new hS(null, u.flush)), M = r ? r(T, G) : t[T];
      M && (c[T] = cS(M));
    }
  }
  const w = f.current.map((k, $) => Ip(k, c[$])), N = sn(Vu), _ = _p(N), P = N !== _ && eS(N);
  af(() => {
    o.current++, u.ctrls = f.current;
    const {
      queue: k
    } = u;
    k.length && (u.queue = [], wt(k, ($) => $())), wt(f.current, ($, T) => {
      i == null || i.add($), P && $.start({
        default: N
      });
      const G = c[T];
      G && (nS($, G.ref), $.ref ? $.queue.push(G) : $.start(G));
    });
  }), Jv(() => () => {
    wt(u.ctrls, (k) => k.stop(!0));
  });
  const I = w.map((k) => qt({}, k));
  return i ? [I, i] : I;
}
function Dp(e, t) {
  const n = de.fun(e), [[r], i] = bS(1, n ? e : [e], n ? t || [] : t);
  return n || arguments.length == 2 ? [r, i] : r;
}
let Lp;
(function(e) {
  e.MOUNT = "mount", e.ENTER = "enter", e.UPDATE = "update", e.LEAVE = "leave";
})(Lp || (Lp = {}));
class wS extends ff {
  constructor(t, n) {
    super(), this.key = void 0, this.idle = !0, this.calc = void 0, this._active = /* @__PURE__ */ new Set(), this.source = t, this.calc = zo(...n);
    const r = this._get(), i = Hl(r);
    uf(this, i.create(r));
  }
  advance(t) {
    const n = this._get(), r = this.get();
    cr(n, r) || (Zn(this).setValue(n), this._onChange(n, this.idle)), !this.idle && zp(this._active) && tl(this);
  }
  _get() {
    const t = de.arr(this.source) ? this.source.map(dn) : gn(dn(this.source));
    return this.calc(...t);
  }
  _start() {
    this.idle && !zp(this._active) && (this.idle = !1, wt(Hu(this), (t) => {
      t.done = !1;
    }), ir.skipAnimation ? (at.batchedUpdates(() => this.advance()), tl(this)) : Lu.start(this));
  }
  _attach() {
    let t = 1;
    wt(gn(this.source), (n) => {
      Tn(n) && Vi(n, this), ql(n) && (n.idle || this._active.add(n), t = Math.max(t, n.priority + 1));
    }), this.priority = t, this._start();
  }
  _detach() {
    wt(gn(this.source), (t) => {
      Tn(t) && jo(t, this);
    }), this._active.clear(), tl(this);
  }
  eventObserved(t) {
    t.type == "change" ? t.idle ? this.advance() : (this._active.add(t.parent), this._start()) : t.type == "idle" ? this._active.delete(t.parent) : t.type == "priority" && (this.priority = gn(this.source).reduce((n, r) => Math.max(n, (ql(r) ? r.priority : 0) + 1), 0));
  }
}
function xS(e) {
  return e.idle !== !1;
}
function zp(e) {
  return !e.size || Array.from(e).every(xS);
}
function tl(e) {
  e.idle || (e.idle = !0, wt(Hu(e), (t) => {
    t.done = !0;
  }), Go(e, {
    type: "idle",
    parent: e
  }));
}
ir.assign({
  createStringInterpolator: Kv,
  to: (e, t) => new wS(e, t)
});
function df(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const _S = ["style", "children", "scrollTop", "scrollLeft"], hg = /^--/;
function SS(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !hg.test(e) && !(Ao.hasOwnProperty(e) && Ao[e]) ? t + "px" : ("" + t).trim();
}
const Gp = {};
function RS(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", r = t, {
    style: i,
    children: o,
    scrollTop: a,
    scrollLeft: u
  } = r, f = df(r, _S), c = Object.values(f), h = Object.keys(f).map((p) => n || e.hasAttribute(p) ? p : Gp[p] || (Gp[p] = p.replace(/([A-Z])/g, (w) => "-" + w.toLowerCase())));
  o !== void 0 && (e.textContent = o);
  for (let p in i)
    if (i.hasOwnProperty(p)) {
      const w = SS(p, i[p]);
      hg.test(p) ? e.style.setProperty(p, w) : e.style[p] = w;
    }
  h.forEach((p, w) => {
    e.setAttribute(p, c[w]);
  }), a !== void 0 && (e.scrollTop = a), u !== void 0 && (e.scrollLeft = u);
}
let Ao = {
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
const CS = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), NS = ["Webkit", "Ms", "Moz", "O"];
Ao = Object.keys(Ao).reduce((e, t) => (NS.forEach((n) => e[CS(n, t)] = e[t]), e), Ao);
const PS = ["x", "y", "z"], TS = /^(matrix|translate|scale|rotate|skew)/, ES = /^(translate)/, MS = /^(rotate|skew)/, nl = (e, t) => de.num(e) && e !== 0 ? e + t : e, Xa = (e, t) => de.arr(e) ? e.every((n) => Xa(n, t)) : de.num(e) ? e === t : parseFloat(e) === t;
class OS extends Wu {
  constructor(t) {
    let {
      x: n,
      y: r,
      z: i
    } = t, o = df(t, PS);
    const a = [], u = [];
    (n || r || i) && (a.push([n || 0, r || 0, i || 0]), u.push((f) => [`translate3d(${f.map((c) => nl(c, "px")).join(",")})`, Xa(f, 0)])), rr(o, (f, c) => {
      if (c === "transform")
        a.push([f || ""]), u.push((h) => [h, h === ""]);
      else if (TS.test(c)) {
        if (delete o[c], de.und(f))
          return;
        const h = ES.test(c) ? "px" : MS.test(c) ? "deg" : "";
        a.push(gn(f)), u.push(c === "rotate3d" ? ([p, w, N, _]) => [`rotate3d(${p},${w},${N},${nl(_, h)})`, Xa(_, 0)] : (p) => [`${c}(${p.map((w) => nl(w, h)).join(",")})`, Xa(p, c.startsWith("scale") ? 1 : 0)]);
      }
    }), a.length && (o.transform = new AS(a, u)), super(o);
  }
}
class AS extends qv {
  constructor(t, n) {
    super(), this._value = null, this.inputs = t, this.transforms = n;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let t = "", n = !0;
    return wt(this.inputs, (r, i) => {
      const o = dn(r[0]), [a, u] = this.transforms[i](de.arr(o) ? o : r.map(dn));
      t += " " + a, n = n && u;
    }), n ? "none" : t;
  }
  observerAdded(t) {
    t == 1 && wt(this.inputs, (n) => wt(n, (r) => Tn(r) && Vi(r, this)));
  }
  observerRemoved(t) {
    t == 0 && wt(this.inputs, (n) => wt(n, (r) => Tn(r) && jo(r, this)));
  }
  eventObserved(t) {
    t.type == "change" && (this._value = null), Go(this, t);
  }
}
const kS = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"], FS = ["scrollTop", "scrollLeft"];
ir.assign({
  batchedUpdates: jg,
  createStringInterpolator: Kv,
  colors: v_
});
const $S = Y_(kS, {
  applyAnimatedValues: RS,
  createAnimatedStyle: (e) => new OS(e),
  getComponentProps: (e) => df(e, FS)
}), BS = $S.animated;
var IS = ["tooltipOpen"];
function DS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
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
function LS(e) {
  var t = Lr(pu({
    tooltipOpen: !1
  }, e)), n = t[0], r = t[1], i = xt(function(a) {
    return r(typeof a == "function" ? function(u) {
      u.tooltipOpen;
      var f = DS(u, IS);
      return pu({}, a(f), {
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
function zS(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function GS(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Ql(e, t);
}
function Ql(e, t) {
  return Ql = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Ql(e, t);
}
function mg(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var vg = /* @__PURE__ */ function(e) {
  GS(t, e);
  function t() {
    for (var r, i = arguments.length, o = new Array(i), a = 0; a < i; a++)
      o[a] = arguments[a];
    return r = e.call.apply(e, [this].concat(o)) || this, mg(zS(r), "node", void 0), r;
  }
  var n = t.prototype;
  return n.componentWillUnmount = function() {
    this.node && document.body && (document.body.removeChild(this.node), delete this.node);
  }, n.render = function() {
    return !this.node && typeof document < "u" && (this.node = document.createElement("div"), this.props.zIndex != null && (this.node.style.zIndex = "" + this.props.zIndex), document.body.append(this.node)), this.node ? /* @__PURE__ */ yh.createPortal(this.props.children, this.node) : null;
  }, t;
}(yn.PureComponent);
mg(vg, "propTypes", {
  zIndex: ke.exports.oneOfType([ke.exports.number, ke.exports.string])
});
var jS = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/Tooltip.js", HS = ["className", "top", "left", "offsetLeft", "offsetTop", "style", "children", "unstyled", "applyPositionStyle"];
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
function WS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var pf = {
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
function hf(e) {
  var t = e.className, n = e.top, r = e.left, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.style, c = f === void 0 ? pf : f, h = e.children, p = e.unstyled, w = p === void 0 ? !1 : p, N = e.applyPositionStyle, _ = N === void 0 ? !1 : N, P = WS(e, HS);
  return /* @__PURE__ */ B("div", {
    className: wy("visx-tooltip", t),
    style: Zl({
      top: n == null || u == null ? n : n + u,
      left: r == null || o == null ? r : r + o
    }, _ && {
      position: "absolute"
    }, !w && c),
    ...P,
    children: h
  }, void 0, !1, {
    fileName: jS,
    lineNumber: 38,
    columnNumber: 23
  }, this);
}
hf.propTypes = {
  children: ke.exports.node,
  className: ke.exports.string,
  left: ke.exports.number,
  offsetLeft: ke.exports.number,
  offsetTop: ke.exports.number,
  top: ke.exports.number,
  applyPositionStyle: ke.exports.bool,
  unstyled: ke.exports.bool
};
var VS = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js";
function jp(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function US(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Jl(e, t);
}
function Jl(e, t) {
  return Jl = Object.setPrototypeOf || function(r, i) {
    return r.__proto__ = i, r;
  }, Jl(e, t);
}
function Hp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var Wp = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function qS(e) {
  var t, n;
  return n = t = /* @__PURE__ */ function(r) {
    US(i, r);
    function i(a) {
      var u;
      return u = r.call(this, a) || this, Hp(jp(u), "node", void 0), u.state = {
        rect: void 0,
        parentRect: void 0
      }, u.getRects = u.getRects.bind(jp(u)), u;
    }
    var o = i.prototype;
    return o.componentDidMount = function() {
      var u = this;
      this.node = yh.findDOMNode(this), this.setState(function() {
        return u.getRects();
      });
    }, o.getRects = function() {
      if (!this.node)
        return this.state;
      var u = this.node, f = u.parentNode, c = u.getBoundingClientRect ? u.getBoundingClientRect() : Wp, h = f != null && f.getBoundingClientRect ? f.getBoundingClientRect() : Wp;
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
        fileName: VS,
        lineNumber: 67,
        columnNumber: 27
      }, this);
    }, i;
  }(yn.PureComponent), Hp(t, "displayName", "withBoundingRects(" + (e.displayName || "") + ")"), n;
}
var YS = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js", XS = ["children", "getRects", "left", "offsetLeft", "offsetTop", "parentRect", "rect", "style", "top", "unstyled"];
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
function KS(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function QS(e) {
  var t = e.children;
  e.getRects;
  var n = e.left, r = n === void 0 ? 0 : n, i = e.offsetLeft, o = i === void 0 ? 10 : i, a = e.offsetTop, u = a === void 0 ? 10 : a, f = e.parentRect, c = e.rect, h = e.style, p = h === void 0 ? pf : h, w = e.top, N = w === void 0 ? 0 : w, _ = e.unstyled, P = _ === void 0 ? !1 : _, I = KS(e, XS), k;
  if (c && f) {
    var $ = r, T = N, G = !1, M = !1;
    if (f.width) {
      var L = $ + o + c.width - f.width, te = c.width - $ - o;
      G = L > 0 && L > te;
    } else {
      var Q = $ + o + c.width - window.innerWidth, fe = c.width - $ - o;
      G = Q > 0 && Q > fe;
    }
    if (f.height) {
      var ve = T + u + c.height - f.height, re = c.height - T - u;
      M = ve > 0 && ve > re;
    } else
      M = T + u + c.height > window.innerHeight;
    $ = G ? $ - c.width - o : $ + o, T = M ? T - c.height - u : T + u, $ = Math.round($), T = Math.round(T), k = "translate(" + $ + "px, " + T + "px)";
  }
  return /* @__PURE__ */ B(hf, {
    style: ec({
      left: 0,
      top: 0,
      transform: k
    }, !P && p),
    ...I,
    children: t
  }, void 0, !1, {
    fileName: YS,
    lineNumber: 65,
    columnNumber: 23
  }, this);
}
const ZS = qS(QS);
var Vp = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js", JS = ["detectBounds", "zIndex"], eR = ["left", "top", "detectBounds", "zIndex"];
function Up(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function tR(e) {
  var t = e === void 0 ? {} : e, n = t.detectBounds, r = n === void 0 ? !0 : n, i = t.zIndex, o = Up(t, JS), a = xy(o), u = a[0], f = a[1], c = a[2], h = Vt(function() {
    return function(p) {
      var w = p.left, N = w === void 0 ? 0 : w, _ = p.top, P = _ === void 0 ? 0 : _, I = p.detectBounds, k = p.zIndex, $ = Up(p, eR), T = I == null ? r : I, G = k == null ? i : k, M = T ? ZS : hf, L = N + (f.left || 0) + window.scrollX, te = P + (f.top || 0) + window.scrollY;
      return /* @__PURE__ */ B(vg, {
        zIndex: G,
        children: /* @__PURE__ */ B(M, {
          left: L,
          top: te,
          ...$
        }, void 0, !1, {
          fileName: Vp,
          lineNumber: 48,
          columnNumber: 23
        }, this)
      }, void 0, !1, {
        fileName: Vp,
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
var nR = /* @__PURE__ */ gh(null);
const ta = nR;
var vn = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/Tooltip.js", rR = ["debounce", "detectBounds", "horizontalCrosshairStyle", "glyphStyle", "renderTooltip", "renderGlyph", "resizeObserverPolyfill", "scroll", "showDatumGlyph", "showHorizontalCrosshair", "showSeriesGlyphs", "showVerticalCrosshair", "snapTooltipToDatumX", "snapTooltipToDatumY", "verticalCrosshairStyle", "zIndex"], iR = ["x", "y"];
function qp(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function ko() {
  return ko = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, ko.apply(this, arguments);
}
var rl = {
  position: "absolute",
  pointerEvents: "none",
  fontSize: 0,
  lineHeight: 0
}, oR = {
  position: "absolute",
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none"
};
function gg(e) {
  var t = sn(Hr) || {}, n = t.theme;
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
gg.propTypes = {
  isNearestDatum: ke.exports.bool.isRequired
};
function aR(e) {
  return /* @__PURE__ */ B(gg, {
    ...e
  }, void 0, !1, {
    fileName: vn,
    lineNumber: 53,
    columnNumber: 23
  }, this);
}
function yg(e) {
  var t = sn(ta);
  return t != null && t.tooltipOpen ? /* @__PURE__ */ B(bg, {
    ...e
  }, void 0, !1, {
    fileName: vn,
    lineNumber: 66,
    columnNumber: 23
  }, this) : null;
}
yg.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
function bg(e) {
  var t, n, r, i, o, a, u, f, c, h, p, w, N, _ = e.debounce, P = e.detectBounds, I = e.horizontalCrosshairStyle, k = e.glyphStyle, $ = e.renderTooltip, T = e.renderGlyph, G = T === void 0 ? aR : T, M = e.resizeObserverPolyfill, L = e.scroll, te = L === void 0 ? !0 : L, Q = e.showDatumGlyph, fe = Q === void 0 ? !1 : Q, ve = e.showHorizontalCrosshair, re = ve === void 0 ? !1 : ve, ee = e.showSeriesGlyphs, be = ee === void 0 ? !1 : ee, Oe = e.showVerticalCrosshair, ut = Oe === void 0 ? !1 : Oe, Ve = e.snapTooltipToDatumX, st = Ve === void 0 ? !1 : Ve, lt = e.snapTooltipToDatumY, dt = lt === void 0 ? !1 : lt, U = e.verticalCrosshairStyle, ue = e.zIndex, Pe = qp(e, rR), Ae = sn(Hr) || {}, Ce = Ae.colorScale, Re = Ae.theme, Te = Ae.innerHeight, Ie = Ae.innerWidth, ze = Ae.margin, X = Ae.xScale, ce = Ae.yScale, Ge = Ae.dataRegistry, D = sn(ta), gt = tR({
    debounce: _,
    detectBounds: P,
    polyfill: M,
    scroll: te,
    zIndex: ue
  }), ct = gt.containerRef, St = gt.TooltipInPortal, kt = gt.forceRefreshBounds, en = xt(function(jt) {
    var Kt;
    ct((Kt = jt == null ? void 0 : jt.parentElement) != null ? Kt : null);
  }, [ct]), ln = D != null && D.tooltipOpen ? $(ko({}, D, {
    colorScale: Ce
  })) : null, wn = (D == null ? void 0 : D.tooltipOpen) && ln != null, xn = Jt(!1);
  on(function() {
    wn && !xn.current && kt(), xn.current = wn;
  }, [wn, kt]);
  var _n = D == null ? void 0 : D.tooltipLeft, zn = D == null ? void 0 : D.tooltipTop, or = X ? Dl(X) : 0, Gn = ce ? Dl(ce) : 0, Sn = xt(function(jt, Kt) {
    var O, J, he = Ge == null ? void 0 : Ge.get(jt), Le = he == null ? void 0 : he.xAccessor, ht = he == null ? void 0 : he.yAccessor, yt = X && Le ? (O = Number(X(Le(Kt))) + or / 2) != null ? O : 0 : void 0, ot = ce && ht ? (J = Number(ce(ht(Kt))) + Gn / 2) != null ? J : 0 : void 0;
    return {
      left: yt,
      top: ot
    };
  }, [Ge, or, Gn, X, ce]), Xt = D == null || (t = D.tooltipData) == null ? void 0 : t.nearestDatum, An = (n = Xt == null ? void 0 : Xt.key) != null ? n : "";
  if (wn && Xt && (st || dt)) {
    var ar = Sn(An, Xt.datum), yr = ar.left, br = ar.top;
    _n = st && rn(yr) ? yr : _n, zn = dt && rn(br) ? br : zn;
  }
  var ur = [];
  if (wn && (fe || be)) {
    var wr, jn = Number((wr = k == null ? void 0 : k.radius) != null ? wr : 4);
    if (be) {
      var Hn, cn;
      Object.values((Hn = D == null || (cn = D.tooltipData) == null ? void 0 : cn.datumByKey) != null ? Hn : {}).forEach(function(jt) {
        var Kt, O, J, he = jt.key, Le = jt.datum, ht = jt.index, yt = (Kt = (O = Ce == null ? void 0 : Ce(he)) != null ? O : Re == null || (J = Re.htmlLabel) == null ? void 0 : J.color) != null ? Kt : "#222", ot = Sn(he, Le), rt = ot.left, Ft = ot.top;
        !rn(rt) || !rn(Ft) || ur.push({
          key: he,
          color: yt,
          datum: Le,
          index: ht,
          size: jn,
          x: rt,
          y: Ft,
          glyphStyle: k,
          isNearestDatum: Xt ? Xt.key === he : !1
        });
      });
    } else if (Xt) {
      var Rn = Sn(An, Xt.datum), kn = Rn.left, Fn = Rn.top;
      if (rn(kn) && rn(Fn)) {
        var sr, $n, lr, Wn, Vn, Cn, xr = (sr = ($n = (lr = (Wn = An && (Ce == null ? void 0 : Ce(An))) != null ? Wn : null) != null ? lr : Re == null || (Vn = Re.gridStyles) == null ? void 0 : Vn.stroke) != null ? $n : Re == null || (Cn = Re.htmlLabel) == null ? void 0 : Cn.color) != null ? sr : "#222";
        ur.push({
          key: An,
          color: xr,
          datum: Xt.datum,
          index: Xt.index,
          size: jn,
          x: kn,
          y: Fn,
          glyphStyle: k,
          isNearestDatum: !0
        });
      }
    }
  }
  return /* @__PURE__ */ B(Ln, {
    children: [/* @__PURE__ */ B("svg", {
      ref: en,
      style: oR
    }, void 0, !1, {
      fileName: vn,
      lineNumber: 250,
      columnNumber: 60
    }, this), wn && /* @__PURE__ */ B(Ln, {
      children: [ut && /* @__PURE__ */ B(St, {
        className: "visx-crosshair visx-crosshair-vertical",
        left: _n,
        top: ze == null ? void 0 : ze.top,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: rl,
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
            ...U
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
        left: ze == null ? void 0 : ze.left,
        top: zn,
        offsetLeft: 0,
        offsetTop: 0,
        detectBounds: !1,
        style: rl,
        children: /* @__PURE__ */ B("svg", {
          width: Ie,
          height: "1",
          overflow: "visible",
          children: /* @__PURE__ */ B("line", {
            x1: 0,
            x2: Ie,
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
      }, this), ur.map(function(jt, Kt) {
        var O = jt.x, J = jt.y, he = qp(jt, iR);
        return /* @__PURE__ */ B(St, {
          className: "visx-tooltip-glyph",
          left: O,
          top: J,
          offsetLeft: 0,
          offsetTop: 0,
          detectBounds: !1,
          style: rl,
          children: /* @__PURE__ */ B("svg", {
            overflow: "visible",
            children: G(ko({
              x: 0,
              y: 0
            }, he))
          }, void 0, !1, {
            fileName: vn,
            lineNumber: 308,
            columnNumber: 25
          }, this)
        }, Kt, !1, {
          fileName: vn,
          lineNumber: 299,
          columnNumber: 9
        }, this);
      }), /* @__PURE__ */ B(St, {
        left: _n,
        top: zn,
        style: ko({}, pf, {
          background: (p = Re == null ? void 0 : Re.backgroundColor) != null ? p : "white",
          boxShadow: "0 1px 2px " + (Re != null && (w = Re.htmlLabel) != null && w.color ? (Re == null || (N = Re.htmlLabel) == null ? void 0 : N.color) + "55" : "#22222255")
        }, Re == null ? void 0 : Re.htmlLabel),
        ...Pe,
        children: ln
      }, void 0, !1, {
        fileName: vn,
        lineNumber: 315,
        columnNumber: 22
      }, this)]
    }, void 0, !0)]
  }, void 0, !0);
}
bg.propTypes = {
  renderTooltip: ke.exports.func.isRequired,
  renderGlyph: ke.exports.func,
  snapTooltipToDatumX: ke.exports.bool,
  snapTooltipToDatumY: ke.exports.bool,
  showVerticalCrosshair: ke.exports.bool,
  showHorizontalCrosshair: ke.exports.bool,
  showDatumGlyph: ke.exports.bool,
  showSeriesGlyphs: ke.exports.bool
};
const uR = /* @__PURE__ */ qo(my);
var sR = _g, Pr = xg(ke.exports), lR = xg(Ch), wi = dR(yn), cR = uR, fR = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall"];
function wg(e) {
  if (typeof WeakMap != "function")
    return null;
  var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (wg = function(i) {
    return i ? n : t;
  })(e);
}
function dR(e, t) {
  if (!t && e && e.__esModule)
    return e;
  if (e === null || typeof e != "object" && typeof e != "function")
    return { default: e };
  var n = wg(t);
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
function xg(e) {
  return e && e.__esModule ? e : { default: e };
}
function hu() {
  return hu = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, hu.apply(this, arguments);
}
function pR(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
var hR = [];
function _g(e) {
  var t = e.className, n = e.children, r = e.debounceTime, i = r === void 0 ? 300 : r, o = e.ignoreDimensions, a = o === void 0 ? hR : o, u = e.parentSizeStyles, f = u === void 0 ? {
    width: "100%",
    height: "100%"
  } : u, c = e.enableDebounceLeadingCall, h = c === void 0 ? !0 : c, p = pR(e, fR), w = (0, wi.useRef)(null), N = (0, wi.useRef)(0), _ = (0, wi.useState)({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), P = _[0], I = _[1], k = (0, wi.useMemo)(function() {
    var $ = Array.isArray(a) ? a : [a];
    return (0, lR.default)(function(T) {
      I(function(G) {
        var M = Object.keys(G), L = M.filter(function(Q) {
          return G[Q] !== T[Q];
        }), te = L.every(function(Q) {
          return $.includes(Q);
        });
        return te ? G : T;
      });
    }, i, {
      leading: h
    });
  }, [i, h, a]);
  return (0, wi.useEffect)(function() {
    var $ = new cR.ResizeObserver(function(T) {
      T === void 0 && (T = []), T.forEach(function(G) {
        var M = G.contentRect, L = M.left, te = M.top, Q = M.width, fe = M.height;
        N.current = window.requestAnimationFrame(function() {
          k({
            width: Q,
            height: fe,
            top: te,
            left: L
          });
        });
      });
    });
    return w.current && $.observe(w.current), function() {
      window.cancelAnimationFrame(N.current), $.disconnect(), k != null && k.cancel && k.cancel();
    };
  }, [k]), /* @__PURE__ */ wi.default.createElement("div", hu({
    style: f,
    ref: w,
    className: t
  }, p), n(hu({}, P, {
    ref: w.current,
    resize: k
  })));
}
_g.propTypes = {
  className: Pr.default.string,
  debounceTime: Pr.default.number,
  enableDebounceLeadingCall: Pr.default.bool,
  ignoreDimensions: Pr.default.oneOfType([Pr.default.any, Pr.default.arrayOf(Pr.default.any)]),
  children: Pr.default.func.isRequired
};
var mR = /* @__PURE__ */ gh(null);
const Sg = mR;
function Ar(e, t, n) {
  var r = sn(Sg), i = Jt();
  i.current = n;
  var o = xt(function(a, u, f) {
    r && r.emit(a, {
      event: u,
      svgPoint: Fy(u),
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
function vR(e) {
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
var gR = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/EventEmitterProvider.js";
function yR(e) {
  var t = e.children, n = Vt(function() {
    return vR();
  }, []);
  return /* @__PURE__ */ B(Sg.Provider, {
    value: n,
    children: t
  }, void 0, !1, {
    fileName: gR,
    lineNumber: 11,
    columnNumber: 23
  }, this);
}
var bR = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/TooltipProvider.js";
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
function Rg(e) {
  var t = e.hideTooltipDebounceMs, n = t === void 0 ? 400 : t, r = e.children, i = LS(void 0), o = i.tooltipOpen, a = i.tooltipLeft, u = i.tooltipTop, f = i.tooltipData, c = i.updateTooltip, h = i.hideTooltip, p = Jt(null), w = Jt(function(_) {
    var P = _.svgPoint, I = _.index, k = _.key, $ = _.datum, T = _.distanceX, G = _.distanceY;
    p.current && (p.current.cancel(), p.current = null);
    var M = rn(T) ? T : 1 / 0, L = rn(G) ? G : 1 / 0, te = Math.sqrt(Math.pow(M, 2) + Math.pow(L, 2));
    c(function(Q) {
      var fe, ve, re, ee = Q.tooltipData, be = ee != null && ee.nearestDatum && rn(ee.nearestDatum.distance) ? ee.nearestDatum.distance : 1 / 0;
      return {
        tooltipOpen: !0,
        tooltipLeft: P == null ? void 0 : P.x,
        tooltipTop: P == null ? void 0 : P.y,
        tooltipData: {
          nearestDatum: ((fe = ee == null || (ve = ee.nearestDatum) == null ? void 0 : ve.key) != null ? fe : "") !== k && be < te ? ee == null ? void 0 : ee.nearestDatum : {
            key: k,
            index: I,
            datum: $,
            distance: te
          },
          datumByKey: tc({}, ee == null ? void 0 : ee.datumByKey, (re = {}, re[k] = {
            datum: $,
            index: I,
            key: k
          }, re))
        }
      };
    });
  }), N = xt(function() {
    p.current = vc(h, n), p.current();
  }, [h, n]);
  return /* @__PURE__ */ B(ta.Provider, {
    value: {
      tooltipOpen: o,
      tooltipLeft: a,
      tooltipTop: u,
      tooltipData: f,
      updateTooltip: c,
      showTooltip: w.current,
      hideTooltip: N
    },
    children: r
  }, void 0, !1, {
    fileName: bR,
    lineNumber: 72,
    columnNumber: 23
  }, this);
}
Rg.propTypes = {
  hideTooltipDebounceMs: ke.exports.number,
  children: ke.exports.node.isRequired
};
const wR = /* @__PURE__ */ qo(vx);
var na = {}, mf = {};
mf.__esModule = !0;
mf.default = xR;
function xR(e, t) {
  t.domain && ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
}
var vf = {};
vf.__esModule = !0;
vf.default = _R;
function _R(e, t) {
  t.range && ("padding" in e, e.range(t.range));
}
var gf = {};
gf.__esModule = !0;
gf.default = SR;
function SR(e, t) {
  "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
}
var yf = {};
yf.__esModule = !0;
yf.default = RR;
function RR(e, t) {
  "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
}
var bf = {};
bf.__esModule = !0;
bf.default = CR;
function CR(e, t) {
  "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
}
var wf = {};
wf.__esModule = !0;
wf.default = NR;
function NR(e, t) {
  "constant" in e && "constant" in t && typeof t.constant < "u" && e.constant(t.constant);
}
var xf = {};
xf.__esModule = !0;
xf.default = PR;
function PR(e, t) {
  "exponent" in e && "exponent" in t && typeof t.exponent < "u" && e.exponent(t.exponent);
}
var _f = {}, Sf = {};
const Cg = /* @__PURE__ */ qo(y1);
Sf.__esModule = !0;
Sf.default = TR;
var Tr = Cg, Yp = {
  lab: Tr.interpolateLab,
  hcl: Tr.interpolateHcl,
  "hcl-long": Tr.interpolateHclLong,
  hsl: Tr.interpolateHsl,
  "hsl-long": Tr.interpolateHslLong,
  cubehelix: Tr.interpolateCubehelix,
  "cubehelix-long": Tr.interpolateCubehelixLong,
  rgb: Tr.interpolateRgb
};
function TR(e) {
  switch (e) {
    case "lab":
    case "hcl":
    case "hcl-long":
    case "hsl":
    case "hsl-long":
    case "cubehelix":
    case "cubehelix-long":
    case "rgb":
      return Yp[e];
  }
  var t = e.type, n = e.gamma, r = Yp[t];
  return typeof n > "u" ? r : r.gamma(n);
}
_f.__esModule = !0;
_f.default = OR;
var ER = MR(Sf);
function MR(e) {
  return e && e.__esModule ? e : { default: e };
}
function OR(e, t) {
  if ("interpolate" in t && "interpolate" in e && typeof t.interpolate < "u") {
    var n = (0, ER.default)(t.interpolate);
    e.interpolate(n);
  }
}
var Rf = {};
const AR = /* @__PURE__ */ qo(cw);
var Cf = {};
Cf.__esModule = !0;
Cf.default = $R;
var kR = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), FR = "%Y-%m-%d %H:%M";
function $R(e) {
  var t = e.tickFormat(1, FR)(kR);
  return t === "2020-02-02 03:04";
}
Rf.__esModule = !0;
Rf.default = DR;
var pn = AR, BR = IR(Cf);
function IR(e) {
  return e && e.__esModule ? e : { default: e };
}
var Xp = {
  day: pn.timeDay,
  hour: pn.timeHour,
  minute: pn.timeMinute,
  month: pn.timeMonth,
  second: pn.timeSecond,
  week: pn.timeWeek,
  year: pn.timeYear
}, Kp = {
  day: pn.utcDay,
  hour: pn.utcHour,
  minute: pn.utcMinute,
  month: pn.utcMonth,
  second: pn.utcSecond,
  week: pn.utcWeek,
  year: pn.utcYear
};
function DR(e, t) {
  if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
    var n = t.nice;
    if (typeof n == "boolean")
      n && e.nice();
    else if (typeof n == "number")
      e.nice(n);
    else {
      var r = e, i = (0, BR.default)(r);
      if (typeof n == "string")
        r.nice(i ? Kp[n] : Xp[n]);
      else {
        var o = n.interval, a = n.step, u = (i ? Kp[o] : Xp[o]).every(a);
        u != null && r.nice(u);
      }
    }
  }
}
var Nf = {};
Nf.__esModule = !0;
Nf.default = LR;
function LR(e, t) {
  "padding" in e && "padding" in t && typeof t.padding < "u" && e.padding(t.padding), "paddingInner" in e && "paddingInner" in t && typeof t.paddingInner < "u" && e.paddingInner(t.paddingInner), "paddingOuter" in e && "paddingOuter" in t && typeof t.paddingOuter < "u" && e.paddingOuter(t.paddingOuter);
}
var Pf = {};
Pf.__esModule = !0;
Pf.default = zR;
function zR(e, t) {
  if (t.reverse) {
    var n = e.range().slice().reverse();
    "padding" in e, e.range(n);
  }
}
var Tf = {};
Tf.__esModule = !0;
Tf.default = jR;
var GR = Cg;
function jR(e, t) {
  "round" in t && typeof t.round < "u" && (t.round && "interpolate" in t && typeof t.interpolate < "u" ? console.warn("[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:", t) : "round" in e ? e.round(t.round) : "interpolate" in e && t.round && e.interpolate(GR.interpolateRound));
}
var Ef = {};
Ef.__esModule = !0;
Ef.default = HR;
function HR(e, t) {
  "unknown" in e && "unknown" in t && typeof t.unknown < "u" && e.unknown(t.unknown);
}
var Mf = {};
Mf.__esModule = !0;
Mf.default = WR;
function WR(e, t) {
  if ("zero" in t && t.zero === !0) {
    var n = e.domain(), r = n[0], i = n[1], o = i < r, a = o ? [i, r] : [r, i], u = a[0], f = a[1], c = [Math.min(0, u), Math.max(0, f)];
    e.domain(o ? c.reverse() : c);
  }
}
na.__esModule = !0;
na.default = aC;
na.ALL_OPERATORS = void 0;
var VR = hn(mf), UR = hn(vf), qR = hn(gf), YR = hn(yf), XR = hn(bf), KR = hn(wf), QR = hn(xf), ZR = hn(_f), JR = hn(Rf), eC = hn(Nf), tC = hn(Pf), nC = hn(Tf), rC = hn(Ef), iC = hn(Mf);
function hn(e) {
  return e && e.__esModule ? e : { default: e };
}
var Ng = [
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
na.ALL_OPERATORS = Ng;
var oC = {
  domain: VR.default,
  nice: JR.default,
  zero: iC.default,
  interpolate: ZR.default,
  round: nC.default,
  align: qR.default,
  base: YR.default,
  clamp: XR.default,
  constant: KR.default,
  exponent: QR.default,
  padding: eC.default,
  range: UR.default,
  reverse: tC.default,
  unknown: rC.default
};
function aC() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var r = new Set(t), i = Ng.filter(function(o) {
    return r.has(o);
  });
  return function(a, u) {
    return typeof u < "u" && i.forEach(function(f) {
      oC[f](a, u);
    }), a;
  };
}
var uC = dC, sC = wR, lC = cC(na);
function cC(e) {
  return e && e.__esModule ? e : { default: e };
}
var fC = (0, lC.default)("domain", "range", "reverse", "unknown");
function dC(e) {
  return fC((0, sC.scaleOrdinal)(), e);
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
}, Co = Or.gray, il = Co[7], pC = [Or.cyan[9], Or.cyan[3], Or.yellow[5], Or.red[4], Or.grape[8], Or.grape[5], Or.pink[9]];
function At() {
  return At = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, At.apply(this, arguments);
}
var ol = {
  fontFamily: "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
  fontWeight: 700,
  fontSize: 12,
  textAnchor: "middle",
  pointerEvents: "none",
  letterSpacing: 0.4
};
function hC(e) {
  var t, n, r, i, o, a, u = At({}, ol, {
    fill: il,
    stroke: "none"
  }, e.svgLabelBig), f = At({}, ol, {
    fontWeight: 200,
    fontSize: 11,
    fill: il,
    stroke: "none"
  }, e.svgLabelSmall), c = At({
    color: (t = (n = (r = (i = e.htmlLabel) == null ? void 0 : i.color) != null ? r : (o = e.svgLabelBig) == null ? void 0 : o.fill) != null ? n : (a = e.svgLabelSmall) == null ? void 0 : a.fill) != null ? t : il
  }, ol, e.htmlLabel);
  return {
    backgroundColor: e.backgroundColor,
    colors: [].concat(e.colors),
    htmlLabel: At({}, c),
    svgLabelSmall: At({}, f),
    svgLabelBig: At({}, u),
    gridStyles: At({
      stroke: e.gridColor,
      strokeWidth: 1
    }, e.gridStyles),
    axisStyles: {
      x: {
        top: {
          axisLabel: At({}, u, {
            dy: "-0.25em"
          }),
          axisLine: At({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: At({}, f, {
            dy: "-0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: At({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        },
        bottom: {
          axisLabel: At({}, u, {
            dy: "-0.25em"
          }),
          axisLine: At({
            stroke: e.gridColorDark,
            strokeWidth: 2
          }, e.xAxisLineStyles),
          tickLabel: At({}, f, {
            dy: "0.125em"
          }),
          tickLength: e.tickLength,
          tickLine: At({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.xTickLineStyles)
        }
      },
      y: {
        left: {
          axisLabel: At({}, u, {
            dx: "-1.25em"
          }),
          axisLine: At({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: At({}, f, {
            textAnchor: "end",
            dx: "-0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: At({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        },
        right: {
          axisLabel: At({}, u, {
            dx: "1.25em"
          }),
          axisLine: At({
            stroke: e.gridColor,
            strokeWidth: 1
          }, e.yAxisLineStyles),
          tickLabel: At({}, f, {
            textAnchor: "start",
            dx: "0.25em",
            dy: "0.25em"
          }),
          tickLength: e.tickLength,
          tickLine: At({
            strokeWidth: 1,
            stroke: e.gridColor
          }, e.yTickLineStyles)
        }
      }
    }
  };
}
const mC = hC({
  backgroundColor: "#fff",
  colors: pC,
  tickLength: 4,
  svgLabelSmall: {
    fill: Co[7]
  },
  svgLabelBig: {
    fill: Co[9]
  },
  gridColor: Co[5],
  gridColorDark: Co[9]
});
var vC = /* @__PURE__ */ yn.createContext(mC);
const gC = vC;
function Qp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var yC = /* @__PURE__ */ function() {
  function e() {
    Qp(this, "registry", {}), Qp(this, "registryKeys", []);
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
function bC() {
  var e = Lr(Math.random()), t = e[1], n = Vt(function() {
    return new yC();
  }, []);
  return Vt(function() {
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
var al = {
  width: 0,
  height: 0,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
function wC(e) {
  var t = Lr({
    width: (e == null ? void 0 : e.width) == null ? al.width : e.width,
    height: (e == null ? void 0 : e.height) == null ? al.height : e.height,
    margin: (e == null ? void 0 : e.margin) == null ? al.margin : e.margin
  }), n = t[0], r = t[1], i = xt(function(o) {
    (o.width !== n.width || o.height !== n.height || o.margin.left !== n.margin.left || o.margin.right !== n.margin.right || o.margin.top !== n.margin.top || o.margin.bottom !== n.margin.bottom) && r(o);
  }, [n.width, n.height, n.margin.left, n.margin.right, n.margin.bottom, n.margin.top]);
  return [n, i];
}
function nc(e) {
  return (e == null ? void 0 : e.type) === "band" || (e == null ? void 0 : e.type) === "ordinal" || (e == null ? void 0 : e.type) === "point";
}
function Ci() {
  return Ci = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ci.apply(this, arguments);
}
function xC(e) {
  var t = e.dataRegistry, n = e.xRange, r = e.xScaleConfig, i = e.yRange, o = e.yScaleConfig, a = t.keys(), u = n[0], f = n[1], c = i[0], h = i[1], p = Vt(function() {
    var N = a.map(function(k) {
      return t.get(k);
    }), _ = N.reduce(function(k, $) {
      return $ ? k.concat($.data.map(function(T) {
        return $.xAccessor(T);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var P = nc(r) ? _ : wd(_), I = mp(r) ? Ba(Ci({
        range: [u, f],
        domain: P,
        zero: !0
      }, r)) : Ba(Ci({
        range: [u, f],
        domain: P
      }, r));
      return N.forEach(function(k) {
        k != null && k.xScale && (I = k.xScale(I));
      }), I;
    }
  }, [t, r, a, u, f]), w = Vt(function() {
    var N = a.map(function(k) {
      return t.get(k);
    }), _ = N.reduce(function(k, $) {
      return $ ? k.concat($.data.map(function(T) {
        return $.yAccessor(T);
      })) : k;
    }, []);
    if (_.length !== 0) {
      var P = nc(o) ? _ : wd(_), I = mp(o) ? Ba(Ci({
        range: [c, h],
        domain: P,
        zero: !0
      }, o)) : Ba(Ci({
        range: [c, h],
        domain: P
      }, o));
      return N.forEach(function(k) {
        k != null && k.yScale && (I = k.yScale(I));
      }), I;
    }
  }, [t, o, a, c, h]);
  return {
    xScale: p,
    yScale: w
  };
}
var _C = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/DataProvider.js";
function Pg(e) {
  var t = e.initialDimensions, n = e.theme, r = e.xScale, i = e.yScale, o = e.children, a = e.horizontal, u = a === void 0 ? "auto" : a, f = sn(gC), c = n || f, h = wC(t), p = h[0], w = p.width, N = p.height, _ = p.margin, P = h[1], I = Math.max(0, w - _.left - _.right), k = Math.max(0, N - _.top - _.bottom), $ = bC(), T = xC({
    dataRegistry: $,
    xScaleConfig: r,
    yScaleConfig: i,
    xRange: [_.left, Math.max(0, w - _.right)],
    yRange: [Math.max(0, N - _.bottom), _.top]
  }), G = T.xScale, M = T.yScale, L = $.keys(), te = Vt(function() {
    return uC({
      domain: L,
      range: c.colors
    });
  }, [L, c.colors]), Q = u === "auto" ? nc(i) || i.type === "time" || i.type === "utc" : u;
  return /* @__PURE__ */ B(Hr.Provider, {
    value: {
      dataRegistry: $,
      registerData: $.registerData,
      unregisterData: $.unregisterData,
      xScale: G,
      yScale: M,
      colorScale: te,
      theme: c,
      width: w,
      height: N,
      margin: _,
      innerWidth: I,
      innerHeight: k,
      setDimensions: P,
      horizontal: Q
    },
    children: o
  }, void 0, !1, {
    fileName: _C,
    lineNumber: 55,
    columnNumber: 23
  }, this);
}
Pg.propTypes = {
  children: ke.exports.node.isRequired,
  horizontal: ke.exports.oneOfType([ke.exports.bool, ke.exports.oneOf(["auto"])])
};
function Tg(e) {
  var t = e.source, n = e.onPointerOut, r = n === void 0 ? !0 : n, i = e.onPointerMove, o = i === void 0 ? !0 : i, a = e.onPointerUp, u = a === void 0 ? !0 : a, f = e.onPointerDown, c = f === void 0 ? !0 : f, h = e.onFocus, p = h === void 0 ? !1 : h, w = e.onBlur, N = w === void 0 ? !1 : w, _ = Ar(), P = xt(function(M) {
    return _ == null ? void 0 : _("pointermove", M, t);
  }, [_, t]), I = xt(function(M) {
    return _ == null ? void 0 : _("pointerout", M, t);
  }, [_, t]), k = xt(function(M) {
    return _ == null ? void 0 : _("pointerup", M, t);
  }, [_, t]), $ = xt(function(M) {
    return _ == null ? void 0 : _("pointerdown", M, t);
  }, [_, t]), T = xt(function(M) {
    return _ == null ? void 0 : _("focus", M, t);
  }, [_, t]), G = xt(function(M) {
    return _ == null ? void 0 : _("blur", M, t);
  }, [_, t]);
  return {
    onPointerMove: o ? P : void 0,
    onFocus: p ? T : void 0,
    onBlur: N ? G : void 0,
    onPointerOut: r ? I : void 0,
    onPointerUp: u ? k : void 0,
    onPointerDown: c ? $ : void 0
  };
}
var SC = "AREASERIES_EVENT_SOURCE", RC = "GLYPHSERIES_EVENT_SOURCE", Uu = "XYCHART_EVENT_SOURCE";
function Zp(e) {
  return !!e && ("clientX" in e || "changedTouches" in e);
}
function Eg(e) {
  var t = e.scale, n = e.accessor, r = e.scaledValue, i = e.data, o = t, a, u;
  if ("invert" in o && typeof o.invert == "function") {
    var f = _u(n).left, c = Number(o.invert(r)), h = f(i, c), p = i[h - 1], w = i[h];
    a = !p || Math.abs(c - n(p)) > Math.abs(c - n(w)) ? w : p, u = a === p ? h - 1 : h;
  } else if ("step" in o && typeof o.step < "u") {
    var N = t.domain(), _ = t.range().map(Number), P = [].concat(_).sort(function(L, te) {
      return L - te;
    }), I = fm(P[0], P[1], o.step()), k = zb(I, r), $ = _[0] < _[1] ? N : N.reverse(), T = $[k - 1], G = i.findIndex(function(L) {
      return String(n(L)) === String(T);
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
function CC(e) {
  var t = e.xScale, n = e.xAccessor, r = e.yScale, i = e.yAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = Eg({
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
function NC(e) {
  var t = e.yScale, n = e.yAccessor, r = e.xScale, i = e.xAccessor, o = e.point, a = e.data;
  if (!o)
    return null;
  var u = Eg({
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
var ic = "__POINTER_EVENTS_ALL", Ka = "__POINTER_EVENTS_NEAREST";
function Mg(e) {
  var t = e.dataKey, n = e.findNearestDatum, r = e.onBlur, i = e.onFocus, o = e.onPointerMove, a = e.onPointerOut, u = e.onPointerUp, f = e.onPointerDown, c = e.allowedSources, h = sn(Hr), p = h.width, w = h.height, N = h.horizontal, _ = h.dataRegistry, P = h.xScale, I = h.yScale, k = n || (N ? NC : CC), $ = xt(function(fe) {
    var ve = fe || {}, re = ve.svgPoint, ee = ve.event, be = {}, Oe = null, ut = 1 / 0;
    if (fe && ee && re && p && w && P && I) {
      var Ve, st = t === Ka || t === ic, lt = st ? (Ve = _ == null ? void 0 : _.keys()) != null ? Ve : [] : Array.isArray(t) ? t : [t];
      lt.forEach(function(U) {
        var ue = _ == null ? void 0 : _.get(U);
        if (ue) {
          var Pe = k({
            dataKey: U,
            data: ue.data,
            height: w,
            point: re,
            width: p,
            xAccessor: ue.xAccessor,
            xScale: P,
            yAccessor: ue.yAccessor,
            yScale: I
          });
          if (Pe && (be[U] = rc({
            key: U,
            svgPoint: re,
            event: ee
          }, Pe), t === Ka)) {
            var Ae, Ce, Re = Math.sqrt(((Ae = Pe.distanceX) != null ? Ae : Math.pow(1 / 0, 2)) + ((Ce = Pe.distanceY) != null ? Ce : Math.pow(1 / 0, 2)));
            Oe = Re < ut ? be[U] : Oe, ut = Math.min(ut, Re);
          }
        }
      });
      var dt = t === Ka ? [Oe] : t === ic || Array.isArray(t) ? Object.values(be) : [be[t]];
      return dt.filter(function(U) {
        return U;
      });
    }
    return [];
  }, [t, _, P, I, p, w, k]), T = xt(function(fe) {
    o && $(fe).forEach(function(ve) {
      return o(ve);
    });
  }, [$, o]), G = xt(function(fe) {
    u && $(fe).forEach(function(ve) {
      return u(ve);
    });
  }, [$, u]), M = xt(function(fe) {
    f && $(fe).forEach(function(ve) {
      return f(ve);
    });
  }, [$, f]), L = xt(function(fe) {
    i && $(fe).forEach(function(ve) {
      return i(ve);
    });
  }, [$, i]), te = xt(function(fe) {
    var ve = fe == null ? void 0 : fe.event;
    ve && Zp(ve) && a && a(ve);
  }, [a]), Q = xt(function(fe) {
    var ve = fe == null ? void 0 : fe.event;
    ve && !Zp(ve) && r && r(ve);
  }, [r]);
  Ar("pointermove", o ? T : void 0, c), Ar("pointerout", a ? te : void 0, c), Ar("pointerup", u ? G : void 0, c), Ar("pointerdown", f ? M : void 0, c), Ar("focus", i ? L : void 0, c), Ar("blur", r ? Q : void 0, c);
}
var Kn = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/XYChart.js", PC = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}, TC = [Uu];
function Ni(e) {
  var t = e.accessibilityLabel, n = t === void 0 ? "XYChart" : t, r = e.captureEvents, i = r === void 0 ? !0 : r, o = e.children, a = e.height, u = e.horizontal, f = e.margin, c = f === void 0 ? PC : f, h = e.onPointerMove, p = e.onPointerOut, w = e.onPointerUp, N = e.onPointerDown, _ = e.pointerEventsDataKey, P = _ === void 0 ? "nearest" : _, I = e.theme, k = e.width, $ = e.xScale, T = e.yScale, G = sn(Hr), M = G.setDimensions, L = sn(ta), te = Ar();
  on(function() {
    M && k != null && a != null && k > 0 && a > 0 && M({
      width: k,
      height: a,
      margin: c
    });
  }, [M, k, a, c]);
  var Q = Tg({
    source: Uu
  });
  return Mg({
    dataKey: P === "nearest" ? Ka : ic,
    onPointerMove: h,
    onPointerOut: p,
    onPointerUp: w,
    onPointerDown: N,
    allowedSources: TC
  }), M ? k == null || a == null ? /* @__PURE__ */ B(sR, {
    children: function(fe) {
      return /* @__PURE__ */ B(Ni, {
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
  }, this) : L == null ? /* @__PURE__ */ B(Rg, {
    children: /* @__PURE__ */ B(Ni, {
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
  }, this) : te == null ? /* @__PURE__ */ B(yR, {
    children: /* @__PURE__ */ B(Ni, {
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
  }, this) : null : !$ || !T ? (console.warn("[@visx/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart."), null) : /* @__PURE__ */ B(Pg, {
    xScale: $,
    yScale: T,
    theme: I,
    initialDimensions: {
      width: k,
      height: a,
      margin: c
    },
    horizontal: u,
    children: /* @__PURE__ */ B(Ni, {
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
Ni.propTypes = {
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
const Of = /* @__PURE__ */ qo(Bb);
var Af = {};
Af.__esModule = !0;
Af.default = EC;
function EC(e, t) {
  e(t);
}
var fi = {};
fi.__esModule = !0;
fi.default = OC;
fi.STACK_ORDER_NAMES = fi.STACK_ORDERS = void 0;
var go = Of, mu = {
  ascending: go.stackOrderAscending,
  descending: go.stackOrderDescending,
  insideout: go.stackOrderInsideOut,
  none: go.stackOrderNone,
  reverse: go.stackOrderReverse
};
fi.STACK_ORDERS = mu;
var MC = Object.keys(mu);
fi.STACK_ORDER_NAMES = MC;
function OC(e) {
  return e && mu[e] || mu.none;
}
var di = {};
di.__esModule = !0;
di.default = kC;
di.STACK_OFFSET_NAMES = di.STACK_OFFSETS = void 0;
var yo = Of, vu = {
  expand: yo.stackOffsetExpand,
  diverging: yo.stackOffsetDiverging,
  none: yo.stackOffsetNone,
  silhouette: yo.stackOffsetSilhouette,
  wiggle: yo.stackOffsetWiggle
};
di.STACK_OFFSETS = vu;
var AC = Object.keys(vu);
di.STACK_OFFSET_NAMES = AC;
function kC(e) {
  return e && vu[e] || vu.none;
}
gr.__esModule = !0;
gr.arc = BC;
gr.area = IC;
gr.line = DC;
gr.pie = LC;
gr.radialLine = zC;
gr.stack = GC;
var qi = Of, It = kf(Af), FC = kf(fi), $C = kf(di);
function kf(e) {
  return e && e.__esModule ? e : { default: e };
}
function BC(e) {
  var t = e === void 0 ? {} : e, n = t.innerRadius, r = t.outerRadius, i = t.cornerRadius, o = t.startAngle, a = t.endAngle, u = t.padAngle, f = t.padRadius, c = (0, qi.arc)();
  return n != null && (0, It.default)(c.innerRadius, n), r != null && (0, It.default)(c.outerRadius, r), i != null && (0, It.default)(c.cornerRadius, i), o != null && (0, It.default)(c.startAngle, o), a != null && (0, It.default)(c.endAngle, a), u != null && (0, It.default)(c.padAngle, u), f != null && (0, It.default)(c.padRadius, f), c;
}
function IC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.x0, i = t.x1, o = t.y, a = t.y0, u = t.y1, f = t.defined, c = t.curve, h = (0, qi.area)();
  return n && (0, It.default)(h.x, n), r && (0, It.default)(h.x0, r), i && (0, It.default)(h.x1, i), o && (0, It.default)(h.y, o), a && (0, It.default)(h.y0, a), u && (0, It.default)(h.y1, u), f && h.defined(f), c && h.curve(c), h;
}
function DC(e) {
  var t = e === void 0 ? {} : e, n = t.x, r = t.y, i = t.defined, o = t.curve, a = (0, qi.line)();
  return n && (0, It.default)(a.x, n), r && (0, It.default)(a.y, r), i && a.defined(i), o && a.curve(o), a;
}
function LC(e) {
  var t = e === void 0 ? {} : e, n = t.startAngle, r = t.endAngle, i = t.padAngle, o = t.value, a = t.sort, u = t.sortValues, f = (0, qi.pie)();
  return (a === null || a != null) && f.sort(a), (u === null || u != null) && f.sortValues(u), o != null && f.value(o), i != null && (0, It.default)(f.padAngle, i), n != null && (0, It.default)(f.startAngle, n), r != null && (0, It.default)(f.endAngle, r), f;
}
function zC(e) {
  var t = e === void 0 ? {} : e, n = t.angle, r = t.radius, i = t.defined, o = t.curve, a = (0, qi.radialLine)();
  return n && (0, It.default)(a.angle, n), r && (0, It.default)(a.radius, r), i && a.defined(i), o && a.curve(o), a;
}
function GC(e) {
  var t = e.keys, n = e.value, r = e.order, i = e.offset, o = (0, qi.stack)();
  return t && o.keys(t), n && (0, It.default)(o.value, n), r && o.order((0, FC.default)(r)), i && o.offset((0, $C.default)(i)), o;
}
var jC = qC, ul = Og(yn), HC = Og(yu.exports), WC = gr, VC = ["children", "x", "x0", "x1", "y", "y0", "y1", "data", "defined", "className", "curve", "innerRef"];
function Og(e) {
  return e && e.__esModule ? e : { default: e };
}
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
function UC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function qC(e) {
  var t = e.children, n = e.x, r = e.x0, i = e.x1, o = e.y, a = e.y0, u = e.y1, f = e.data, c = f === void 0 ? [] : f, h = e.defined, p = h === void 0 ? function() {
    return !0;
  } : h, w = e.className, N = e.curve, _ = e.innerRef, P = UC(e, VC), I = (0, WC.area)({
    x: n,
    x0: r,
    x1: i,
    y: o,
    y0: a,
    y1: u,
    defined: p,
    curve: N
  });
  return t ? /* @__PURE__ */ ul.default.createElement(ul.default.Fragment, null, t({
    path: I
  })) : /* @__PURE__ */ ul.default.createElement("path", oc({
    ref: _,
    className: (0, HC.default)("visx-area", w),
    d: I(c) || ""
  }, P));
}
var YC = JC, sl = Ag(yn), XC = Ag(yu.exports), KC = gr, QC = ["children", "data", "x", "y", "fill", "className", "curve", "innerRef", "defined"];
function Ag(e) {
  return e && e.__esModule ? e : { default: e };
}
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
function ZC(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function JC(e) {
  var t = e.children, n = e.data, r = n === void 0 ? [] : n, i = e.x, o = e.y, a = e.fill, u = a === void 0 ? "transparent" : a, f = e.className, c = e.curve, h = e.innerRef, p = e.defined, w = p === void 0 ? function() {
    return !0;
  } : p, N = ZC(e, QC), _ = (0, KC.line)({
    x: i,
    y: o,
    defined: w,
    curve: c
  });
  return t ? /* @__PURE__ */ sl.default.createElement(sl.default.Fragment, null, t({
    path: _
  })) : /* @__PURE__ */ sl.default.createElement("path", ac({
    ref: h,
    className: (0, XC.default)("visx-linepath", f),
    d: _(r) || "",
    fill: u,
    strokeLinecap: "round"
  }, N));
}
var eN = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/enhancers/withRegisteredData.js";
function tN(e) {
  function t(n) {
    var r = n.dataKey, i = n.data, o = n.xAccessor, a = n.yAccessor, u = sn(Hr), f = u.xScale, c = u.yScale, h = u.dataRegistry;
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
    return /* @__PURE__ */ B(w, {
      ...n,
      xScale: f,
      yScale: c,
      data: p.data,
      xAccessor: p.xAccessor,
      yAccessor: p.yAccessor
    }, void 0, !1, {
      fileName: eN,
      lineNumber: 46,
      columnNumber: 25
    }, this);
  }
  return t;
}
function Pi(e, t, n) {
  return n === void 0 && (n = "center"), function(r) {
    var i = e(t(r));
    if (rn(i)) {
      var o = (n === "start" ? 0 : Dl(e)) / (n === "center" ? 2 : 1);
      return i + o;
    }
    return NaN;
  };
}
function nN(e) {
  var t = e.range().map(function(c) {
    var h;
    return (h = s_(c)) != null ? h : 0;
  }), n = t[0], r = t[1], i = n != null && r != null && r < n, o = e(0), a = i ? [r, n] : [n, r], u = a[0], f = a[1];
  return i ? rn(o) ? Math.min(Math.max(u, o), f) : f : rn(o) ? Math.max(o, u) : u;
}
function kg(e) {
  var t, n = e.dataKey, r = e.enableEvents, i = e.findNearestDatum, o = e.onBlur, a = e.onFocus, u = e.onPointerMove, f = e.onPointerOut, c = e.onPointerUp, h = e.onPointerDown, p = e.source, w = e.allowedSources, N = (t = sn(ta)) != null ? t : {}, _ = N.showTooltip, P = N.hideTooltip, I = xt(function(M) {
    _(M), u && u(M);
  }, [_, u]), k = xt(function(M) {
    _(M), a && a(M);
  }, [_, a]), $ = xt(function(M) {
    P(), M && f && f(M);
  }, [P, f]), T = xt(function(M) {
    P(), M && o && o(M);
  }, [P, o]), G = xt(function(M) {
    _(M), h && h(M);
  }, [_, h]);
  return Mg({
    dataKey: n,
    findNearestDatum: i,
    onBlur: r ? T : void 0,
    onFocus: r ? k : void 0,
    onPointerMove: r ? I : void 0,
    onPointerOut: r ? $ : void 0,
    onPointerUp: r ? c : void 0,
    onPointerDown: r ? G : void 0,
    allowedSources: w
  }), Tg({
    source: p,
    onBlur: !!o && r,
    onFocus: !!a && r,
    onPointerMove: !!u && r,
    onPointerOut: !!f && r,
    onPointerUp: !!c && r,
    onPointerDown: !!h && r
  });
}
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
function Fg(e) {
  var t, n, r, i = e.colorAccessor, o = e.data, a = e.dataKey, u = e.onBlur, f = e.onFocus, c = e.onPointerMove, h = e.onPointerOut, p = e.onPointerUp, w = e.onPointerDown, N = e.enableEvents, _ = N === void 0 ? !0 : N, P = e.renderGlyphs, I = e.size, k = I === void 0 ? 8 : I, $ = e.xAccessor, T = e.xScale, G = e.yAccessor, M = e.yScale, L = sn(Hr), te = L.colorScale, Q = L.theme, fe = L.horizontal, ve = xt(Pi(T, $), [T, $]), re = xt(Pi(M, G), [M, G]), ee = (t = (n = te == null ? void 0 : te(a)) != null ? n : Q == null || (r = Q.colors) == null ? void 0 : r[0]) != null ? t : "#222", be = RC + "-" + a, Oe = kg({
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
  }), ut = Vt(function() {
    return o.map(function(Ve, st) {
      var lt, dt = ve(Ve);
      if (!rn(dt))
        return null;
      var U = re(Ve);
      return rn(U) ? {
        key: "" + st,
        x: dt,
        y: U,
        color: (lt = i == null ? void 0 : i(Ve, st)) != null ? lt : ee,
        size: typeof k == "function" ? k(Ve) : k,
        datum: Ve
      } : null;
    }).filter(function(Ve) {
      return Ve;
    });
  }, [ee, i, o, ve, re, k]);
  return /* @__PURE__ */ B(Ln, {
    children: P(uc({
      glyphs: ut,
      xScale: T,
      yScale: M,
      horizontal: fe
    }, Oe))
  }, void 0, !1);
}
Fg.propTypes = {
  colorAccessor: ke.exports.func,
  size: ke.exports.oneOfType([ke.exports.number, ke.exports.func]),
  renderGlyphs: ke.exports.func.isRequired
};
var rN = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/defaultRenderGlyph.js";
function iN(e) {
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
    fileName: rN,
    lineNumber: 13,
    columnNumber: 23
  }, this);
}
var bo = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/BaseAreaSeries.js", oN = ["PathComponent", "curve", "data", "dataKey", "lineProps", "onBlur", "onFocus", "onPointerMove", "onPointerOut", "onPointerUp", "onPointerDown", "enableEvents", "renderLine", "xAccessor", "x0Accessor", "xScale", "yAccessor", "y0Accessor", "yScale"];
function sc() {
  return sc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, sc.apply(this, arguments);
}
function aN(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function $g(e) {
  var t, n, r, i = e.PathComponent, o = i === void 0 ? "path" : i, a = e.curve, u = e.data, f = e.dataKey, c = e.lineProps, h = e.onBlur, p = e.onFocus, w = e.onPointerMove, N = e.onPointerOut, _ = e.onPointerUp, P = e.onPointerDown, I = e.enableEvents, k = I === void 0 ? !0 : I, $ = e.renderLine, T = $ === void 0 ? !0 : $, G = e.xAccessor, M = e.x0Accessor, L = e.xScale, te = e.yAccessor, Q = e.y0Accessor, fe = e.yScale, ve = aN(e, oN), re = sn(Hr), ee = re.colorScale, be = re.theme, Oe = re.horizontal, ut = Vt(function() {
    return M ? Pi(L, M) : void 0;
  }, [L, M]), Ve = xt(Pi(L, G), [L, G]), st = Vt(function() {
    return Q ? Pi(fe, Q) : void 0;
  }, [fe, Q]), lt = xt(Pi(fe, te), [fe, te]), dt = xt(function(Te) {
    return rn(L(G(Te))) && rn(fe(te(Te)));
  }, [L, G, fe, te]), U = (t = (n = ee == null ? void 0 : ee(f)) != null ? n : be == null || (r = be.colors) == null ? void 0 : r[0]) != null ? t : "#222", ue = SC + "-" + f, Pe = kg({
    dataKey: f,
    enableEvents: k,
    onBlur: h,
    onFocus: p,
    onPointerMove: w,
    onPointerOut: N,
    onPointerUp: _,
    onPointerDown: P,
    source: ue,
    allowedSources: [Uu, ue]
  }), Ae = Vt(function() {
    var Te = nN(Oe ? L : fe);
    return Oe ? {
      x0: ut != null ? ut : Te,
      x1: Ve,
      y: lt
    } : {
      x: Ve,
      y0: st != null ? st : Te,
      y1: lt
    };
  }, [L, fe, Oe, Ve, lt, ut, st]), Ce = Boolean(p || h), Re = xt(function(Te) {
    var Ie = Te.glyphs;
    return Ce ? Ie.map(function(ze) {
      return /* @__PURE__ */ B(Ln, {
        children: iN(sc({}, ze, {
          color: "transparent",
          onFocus: Pe.onFocus,
          onBlur: Pe.onBlur
        }))
      }, void 0, !1);
    }) : null;
  }, [Ce, Pe.onFocus, Pe.onBlur]);
  return /* @__PURE__ */ B(Ln, {
    children: [/* @__PURE__ */ B(jC, {
      ...Ae,
      ...ve,
      curve: a,
      defined: dt,
      children: function(Te) {
        var Ie = Te.path;
        return /* @__PURE__ */ B(o, {
          className: "visx-area",
          stroke: "transparent",
          fill: U,
          strokeLinecap: "round",
          ...ve,
          d: Ie(u) || "",
          ...Pe
        }, void 0, !1, {
          fileName: bo,
          lineNumber: 110,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 105,
      columnNumber: 78
    }, this), T && /* @__PURE__ */ B(YC, {
      x: Ve,
      y: lt,
      defined: dt,
      curve: a,
      ...c,
      children: function(Te) {
        var Ie = Te.path;
        return /* @__PURE__ */ B(o, {
          className: "visx-line",
          fill: "transparent",
          stroke: U,
          strokeWidth: 2,
          pointerEvents: "none",
          strokeLinecap: "round",
          ...c,
          d: Ie(u) || ""
        }, void 0, !1, {
          fileName: bo,
          lineNumber: 126,
          columnNumber: 25
        }, this);
      }
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 119,
      columnNumber: 34
    }, this), Ce && /* @__PURE__ */ B(Fg, {
      dataKey: f,
      data: u,
      xAccessor: G,
      yAccessor: te,
      xScale: L,
      yScale: fe,
      renderGlyphs: Re
    }, void 0, !1, {
      fileName: bo,
      lineNumber: 137,
      columnNumber: 42
    }, this)]
  }, void 0, !0);
}
$g.propTypes = {
  renderLine: ke.exports.bool
};
const uN = tN($g);
function sN(e, t) {
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
function lN(e) {
  const t = {};
  return e.length === 4 && (t.x2 = e[2][0], t.y2 = e[2][1]), e.length >= 3 && (t.x1 = e[1][0], t.y1 = e[1][1]), t.x = e[e.length - 1][0], t.y = e[e.length - 1][1], e.length === 4 ? t.type = "C" : e.length === 3 ? t.type = "Q" : t.type = "L", t;
}
function cN(e, t) {
  t = t || 2;
  const n = [];
  let r = e;
  const i = 1 / t;
  for (let o = 0; o < t - 1; o++) {
    const a = i / (1 - i * o), u = sN(r, a);
    n.push(u.left), r = u.right;
  }
  return n.push(r), n;
}
function fN(e, t, n) {
  const r = [[e.x, e.y]];
  return t.x1 != null && r.push([t.x1, t.y1]), t.x2 != null && r.push([t.x2, t.y2]), r.push([t.x, t.y]), cN(r, n).map(lN);
}
const dN = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, ki = {
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
Object.keys(ki).forEach((e) => {
  ki[e.toLowerCase()] = ki[e];
});
function lc(e, t) {
  const n = Array(e);
  for (let r = 0; r < e; r++)
    n[r] = t;
  return n;
}
function pN(e) {
  return `${e.type}${ki[e.type].map((t) => e[t]).join(",")}`;
}
function hN(e, t) {
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
function mN(e, t, n) {
  let r = [];
  if (t.type === "L" || t.type === "Q" || t.type === "C")
    r = r.concat(
      fN(e, t, n)
    );
  else {
    const i = Object.assign({}, e);
    i.type === "M" && (i.type = "L"), r = r.concat(
      lc(n - 1).map(() => i)
    ), r.push(t);
  }
  return r;
}
function Jp(e, t, n) {
  const r = e.length - 1, i = t.length - 1, o = r / i, u = lc(i).reduce(
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
      const p = lc(
        c,
        Object.assign({}, e[e.length - 1])
      );
      return p[0].type === "M" && p.forEach((w) => {
        w.type = "L";
      }), f.concat(p);
    }
    return f.concat(
      mN(e[h], e[h + 1], c)
    );
  }, []);
  return u.unshift(e[0]), u;
}
function eh(e) {
  const t = (e || "").match(dN) || [], n = [];
  let r, i;
  for (let o = 0; o < t.length; ++o)
    if (r = ki[t[o]], r) {
      i = {
        type: t[o]
      };
      for (let a = 0; a < r.length; ++a)
        i[r[a]] = +t[o + a + 1];
      o += r.length, n.push(i);
    }
  return n;
}
function vN(e, t, n) {
  let r = e == null ? [] : e.slice(), i = t == null ? [] : t.slice();
  if (!r.length && !i.length)
    return function() {
      return [];
    };
  const o = (r.length === 0 || r[r.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  r.length > 0 && r[r.length - 1].type === "Z" && r.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), r.length ? i.length || i.push(r[0]) : r.push(i[0]), Math.abs(i.length - r.length) !== 0 && (i.length > r.length ? r = Jp(r, i, n) : i.length < r.length && (i = Jp(i, r, n))), r = r.map(
    (f, c) => hN(f, i[c])
  );
  const u = r.map((f) => ({ ...f }));
  return o && u.push({ type: "Z" }), function(c) {
    if (c === 1)
      return t == null ? [] : t;
    if (c > 0)
      for (let h = 0; h < u.length; ++h) {
        const p = r[h], w = i[h], N = u[h];
        for (const _ of ki[N.type])
          N[_] = (1 - c) * p[_] + c * w[_], (_ === "largeArcFlag" || _ === "sweepFlag") && (N[_] = Math.round(N[_]));
      }
    return u;
  };
}
function gN(e, t, n) {
  let r = eh(e), i = eh(t);
  if (!r.length && !i.length)
    return function() {
      return "";
    };
  const o = vN(
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
      c += pN(h);
    return c;
  };
}
var yN = ["d", "stroke", "fill"];
function cc() {
  return cc = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, cc.apply(this, arguments);
}
function bN(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, o;
  for (o = 0; o < r.length; o++)
    i = r[o], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function wN(e) {
  var t = e.d, n = e.stroke, r = n === void 0 ? "transparent" : n, i = e.fill, o = i === void 0 ? "transparent" : i, a = bN(e, yN), u = Jt(t), f = xt(
    vc(function(N) {
      u.current = N;
    }, 50),
    []
  ), c = gN(u.current, t);
  f(t);
  var h = Dp({
    from: {
      t: 0
    },
    to: {
      t: 1
    },
    reset: !0,
    delay: 0
  }), p = h.t, w = Dp({
    stroke: r,
    fill: o
  });
  return /* @__PURE__ */ yn.createElement(BS.path, cc({
    className: "visx-path",
    d: p.to(c),
    stroke: w.stroke,
    fill: w.fill
  }, a));
}
var xN = "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/AnimatedAreaSeries.js";
function th(e) {
  return /* @__PURE__ */ B(uN, {
    ...e,
    PathComponent: wN
  }, void 0, !1, {
    fileName: xN,
    lineNumber: 9,
    columnNumber: 23
  }, this);
}
const _N = "_tooltip_nplc5_10", SN = {
  tooltip: _N
};
var pt = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/LineChart/LineChart.tsx";
const RN = ({
  colorScale: e,
  nearestDatum: t,
  accessors: n
}) => /* @__PURE__ */ B("div", {
  className: SN.tooltip,
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
  baseColor: CN,
  generatedGradient: NN,
  gradientIds: PN
} = {
  generatedGradient: /* @__PURE__ */ B(Ln, {
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
}, TN = ({
  accessors: e,
  data: t,
  lineLabel: n,
  xLabel: r,
  yLabel: i,
  ...o
}) => /* @__PURE__ */ B(Ni, {
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
    children: NN
  }, void 0, !1, {
    fileName: pt,
    lineNumber: 160,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B(th, {
    id: "gradient-base",
    fill: CN,
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
  }, void 0), PN.map((a) => /* @__PURE__ */ B(th, {
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
  }, void 0), /* @__PURE__ */ B(yg, {
    showVerticalCrosshair: !0,
    style: {
      position: "absolute"
    },
    renderTooltip: ({
      tooltipData: a,
      colorScale: u
    }) => /* @__PURE__ */ B(RN, {
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
}, void 0), BT = (e) => {
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
  return /* @__PURE__ */ B(Fh, {
    children: (i) => /* @__PURE__ */ B(TN, {
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
var No = { exports: {} }, za = { exports: {} }, nh;
function EN() {
  return nh || (nh = 1, function(e, t) {
    (function(n, r) {
      r(t, yn);
    })(Si, function(n, r) {
      function i(s, v, y, b, E, R, A) {
        try {
          var j = s[R](A), W = j.value;
        } catch (V) {
          return void y(V);
        }
        j.done ? v(W) : Promise.resolve(W).then(b, E);
      }
      function o(s) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(b, E) {
            var R = s.apply(v, y);
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
          for (var v = 1; v < arguments.length; v++) {
            var y = arguments[v];
            for (var b in y)
              Object.prototype.hasOwnProperty.call(y, b) && (s[b] = y[b]);
          }
          return s;
        }).apply(this, arguments);
      }
      function u(s, v) {
        if (s == null)
          return {};
        var y, b, E = {}, R = Object.keys(s);
        for (b = 0; b < R.length; b++)
          y = R[b], v.indexOf(y) >= 0 || (E[y] = s[y]);
        return E;
      }
      function f(s) {
        var v = function(y, b) {
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
        return typeof v == "symbol" ? v : String(v);
      }
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      var c = { init: "init" }, h = function(s) {
        var v = s.value;
        return v === void 0 ? "" : v;
      }, p = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, w = { Cell: h, width: 150, minWidth: 0, maxWidth: Number.MAX_SAFE_INTEGER };
      function N() {
        for (var s = arguments.length, v = new Array(s), y = 0; y < s; y++)
          v[y] = arguments[y];
        return v.reduce(function(b, E) {
          var R = E.style, A = E.className;
          return b = a({}, b, {}, u(E, ["style", "className"])), R && (b.style = b.style ? a({}, b.style || {}, {}, R || {}) : R), A && (b.className = b.className ? b.className + " " + A : A), b.className === "" && delete b.className, b;
        }, {});
      }
      var _ = function(s, v) {
        return v === void 0 && (v = {}), function(y) {
          return y === void 0 && (y = {}), [].concat(s, [y]).reduce(function(b, E) {
            return function R(A, j, W) {
              return typeof j == "function" ? R({}, j(A, W)) : Array.isArray(j) ? N.apply(void 0, [A].concat(j)) : N(A, j);
            }(b, E, a({}, v, { userProps: y }));
          }, {});
        };
      }, P = function(s, v, y, b) {
        return y === void 0 && (y = {}), s.reduce(function(E, R) {
          return R(E, y);
        }, v);
      }, I = function(s, v, y) {
        return y === void 0 && (y = {}), s.forEach(function(b) {
          b(v, y);
        });
      };
      function k(s, v, y, b) {
        s.findIndex(function(E) {
          return E.pluginName === y;
        }), v.forEach(function(E) {
          s.findIndex(function(R) {
            return R.pluginName === E;
          });
        });
      }
      function $(s, v) {
        return typeof s == "function" ? s(v) : s;
      }
      function T(s) {
        var v = r.useRef();
        return v.current = s, r.useCallback(function() {
          return v.current;
        }, []);
      }
      var G = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
      function M(s, v) {
        var y = r.useRef(!1);
        G(function() {
          y.current && s(), y.current = !0;
        }, v);
      }
      function L(s, v, y) {
        return y === void 0 && (y = {}), function(b, E) {
          E === void 0 && (E = {});
          var R = typeof b == "string" ? v[b] : b;
          if (R === void 0)
            throw console.info(v), new Error("Renderer Error \u261D\uFE0F");
          return te(R, a({}, s, { column: v }, y, {}, E));
        };
      }
      function te(s, v) {
        return function(b) {
          return typeof b == "function" && (E = Object.getPrototypeOf(b)).prototype && E.prototype.isReactComponent;
          var E;
        }(y = s) || typeof y == "function" || function(b) {
          return typeof b == "object" && typeof b.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(b.$$typeof.description);
        }(y) ? r.createElement(s, v) : s;
        var y;
      }
      function Q(s, v, y) {
        return y === void 0 && (y = 0), s.map(function(b) {
          return ve(b = a({}, b, { parent: v, depth: y })), b.columns && (b.columns = Q(b.columns, b, y + 1)), b;
        });
      }
      function fe(s) {
        return Ve(s, "columns");
      }
      function ve(s) {
        var v = s.id, y = s.accessor, b = s.Header;
        if (typeof y == "string") {
          v = v || y;
          var E = y.split(".");
          y = function(R) {
            return function(A, j, W) {
              if (!j)
                return A;
              var V, se = typeof j == "function" ? j : JSON.stringify(j), ie = be.get(se) || function() {
                var oe = function(Y) {
                  return function ne(ge, xe) {
                    if (xe === void 0 && (xe = []), Array.isArray(ge))
                      for (var Fe = 0; Fe < ge.length; Fe += 1)
                        ne(ge[Fe], xe);
                    else
                      xe.push(ge);
                    return xe;
                  }(Y).map(function(ne) {
                    return String(ne).replace(".", "_");
                  }).join(".").replace(Pe, ".").replace(Ae, "").split(".");
                }(j);
                return be.set(se, oe), oe;
              }();
              try {
                V = ie.reduce(function(oe, Y) {
                  return oe[Y];
                }, A);
              } catch {
              }
              return V !== void 0 ? V : W;
            }(R, E);
          };
        }
        if (!v && typeof b == "string" && b && (v = b), !v && s.columns)
          throw console.error(s), new Error('A column ID (or unique "Header" value) is required!');
        if (!v)
          throw console.error(s), new Error("A column ID (or string accessor) is required!");
        return Object.assign(s, { id: v, accessor: y }), s;
      }
      function re(s, v) {
        if (!v)
          throw new Error();
        return Object.assign(s, a({ Header: p, Footer: p }, w, {}, v, {}, s)), Object.assign(s, { originalWidth: s.width }), s;
      }
      function ee(s, v, y) {
        y === void 0 && (y = function() {
          return {};
        });
        for (var b = [], E = s, R = 0, A = function() {
          return R++;
        }, j = function() {
          var W = { headers: [] }, V = [], se = E.some(function(ie) {
            return ie.parent;
          });
          E.forEach(function(ie) {
            var oe, Y = [].concat(V).reverse()[0];
            se && (ie.parent ? oe = a({}, ie.parent, { originalId: ie.parent.id, id: ie.parent.id + "_" + A(), headers: [ie] }, y(ie)) : oe = re(a({ originalId: ie.id + "_placeholder", id: ie.id + "_placeholder_" + A(), placeholderOf: ie, headers: [ie] }, y(ie)), v), Y && Y.originalId === oe.originalId ? Y.headers.push(ie) : V.push(oe)), W.headers.push(ie);
          }), b.push(W), E = V;
        }; E.length; )
          j();
        return b.reverse();
      }
      var be = /* @__PURE__ */ new Map();
      function Oe() {
        for (var s = arguments.length, v = new Array(s), y = 0; y < s; y++)
          v[y] = arguments[y];
        for (var b = 0; b < v.length; b += 1)
          if (v[b] !== void 0)
            return v[b];
      }
      function ut(s) {
        if (typeof s == "function")
          return s;
      }
      function Ve(s, v) {
        var y = [];
        return function b(E) {
          E.forEach(function(R) {
            R[v] ? b(R[v]) : y.push(R);
          });
        }(s), y;
      }
      function st(s, v) {
        var y = v.manualExpandedKey, b = v.expanded, E = v.expandSubRows, R = E === void 0 || E, A = [];
        return s.forEach(function(j) {
          return function W(V, se) {
            se === void 0 && (se = !0), V.isExpanded = V.original && V.original[y] || b[V.id], V.canExpand = V.subRows && !!V.subRows.length, se && A.push(V), V.subRows && V.subRows.length && V.isExpanded && V.subRows.forEach(function(ie) {
              return W(ie, R);
            });
          }(j);
        }), A;
      }
      function lt(s, v, y) {
        return ut(s) || v[s] || y[s] || y.text;
      }
      function dt(s, v, y) {
        return s ? s(v, y) : v === void 0;
      }
      function U() {
        throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.");
      }
      var ue = null, Pe = /\[/g, Ae = /\]/g, Ce = function(s) {
        return a({ role: "table" }, s);
      }, Re = function(s) {
        return a({ role: "rowgroup" }, s);
      }, Te = function(s, v) {
        var y = v.column;
        return a({ key: "header_" + y.id, colSpan: y.totalVisibleHeaderCount, role: "columnheader" }, s);
      }, Ie = function(s, v) {
        var y = v.column;
        return a({ key: "footer_" + y.id, colSpan: y.totalVisibleHeaderCount }, s);
      }, ze = function(s, v) {
        return a({ key: "headerGroup_" + v.index, role: "row" }, s);
      }, X = function(s, v) {
        return a({ key: "footerGroup_" + v.index }, s);
      }, ce = function(s, v) {
        return a({ key: "row_" + v.row.id, role: "row" }, s);
      }, Ge = function(s, v) {
        var y = v.cell;
        return a({ key: "cell_" + y.row.id + "_" + y.column.id, role: "cell" }, s);
      };
      function D() {
        return { useOptions: [], stateReducers: [], useControlledState: [], columns: [], columnsDeps: [], allColumns: [], allColumnsDeps: [], accessValue: [], materializedColumns: [], materializedColumnsDeps: [], useInstanceAfterData: [], visibleColumns: [], visibleColumnsDeps: [], headerGroups: [], headerGroupsDeps: [], useInstanceBeforeDimensions: [], useInstance: [], prepareRow: [], getTableProps: [Ce], getTableBodyProps: [Re], getHeaderGroupProps: [ze], getFooterGroupProps: [X], getHeaderProps: [Te], getFooterProps: [Ie], getRowProps: [ce], getCellProps: [Ge], useFinalInstance: [] };
      }
      c.resetHiddenColumns = "resetHiddenColumns", c.toggleHideColumn = "toggleHideColumn", c.setHiddenColumns = "setHiddenColumns", c.toggleHideAllColumns = "toggleHideAllColumns";
      var gt = function(s) {
        s.getToggleHiddenProps = [ct], s.getToggleHideAllColumnsProps = [St], s.stateReducers.push(kt), s.useInstanceBeforeDimensions.push(en), s.headerGroupsDeps.push(function(v, y) {
          var b = y.instance;
          return [].concat(v, [b.state.hiddenColumns]);
        }), s.useInstance.push(ln);
      };
      gt.pluginName = "useColumnVisibility";
      var ct = function(s, v) {
        var y = v.column;
        return [s, { onChange: function(b) {
          y.toggleHidden(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isVisible, title: "Toggle Column Visible" }];
      }, St = function(s, v) {
        var y = v.instance;
        return [s, { onChange: function(b) {
          y.toggleHideAllColumns(!b.target.checked);
        }, style: { cursor: "pointer" }, checked: !y.allColumnsHidden && !y.state.hiddenColumns.length, title: "Toggle All Columns Hidden", indeterminate: !y.allColumnsHidden && y.state.hiddenColumns.length }];
      };
      function kt(s, v, y, b) {
        if (v.type === c.init)
          return a({ hiddenColumns: [] }, s);
        if (v.type === c.resetHiddenColumns)
          return a({}, s, { hiddenColumns: b.initialState.hiddenColumns || [] });
        if (v.type === c.toggleHideColumn) {
          var E = (v.value !== void 0 ? v.value : !s.hiddenColumns.includes(v.columnId)) ? [].concat(s.hiddenColumns, [v.columnId]) : s.hiddenColumns.filter(function(R) {
            return R !== v.columnId;
          });
          return a({}, s, { hiddenColumns: E });
        }
        return v.type === c.setHiddenColumns ? a({}, s, { hiddenColumns: $(v.value, s.hiddenColumns) }) : v.type === c.toggleHideAllColumns ? a({}, s, { hiddenColumns: (v.value !== void 0 ? v.value : !s.hiddenColumns.length) ? b.allColumns.map(function(R) {
          return R.id;
        }) : [] }) : void 0;
      }
      function en(s) {
        var v = s.headers, y = s.state.hiddenColumns;
        r.useRef(!1).current;
        var b = 0;
        v.forEach(function(E) {
          return b += function R(A, j) {
            A.isVisible = j && !y.includes(A.id);
            var W = 0;
            return A.headers && A.headers.length ? A.headers.forEach(function(V) {
              return W += R(V, A.isVisible);
            }) : W = A.isVisible ? 1 : 0, A.totalVisibleHeaderCount = W, W;
          }(E, !0);
        });
      }
      function ln(s) {
        var v = s.columns, y = s.flatHeaders, b = s.dispatch, E = s.allColumns, R = s.getHooks, A = s.state.hiddenColumns, j = s.autoResetHiddenColumns, W = j === void 0 || j, V = T(s), se = E.length === A.length, ie = r.useCallback(function(xe, Fe) {
          return b({ type: c.toggleHideColumn, columnId: xe, value: Fe });
        }, [b]), oe = r.useCallback(function(xe) {
          return b({ type: c.setHiddenColumns, value: xe });
        }, [b]), Y = r.useCallback(function(xe) {
          return b({ type: c.toggleHideAllColumns, value: xe });
        }, [b]), ne = _(R().getToggleHideAllColumnsProps, { instance: V() });
        y.forEach(function(xe) {
          xe.toggleHidden = function(Fe) {
            b({ type: c.toggleHideColumn, columnId: xe.id, value: Fe });
          }, xe.getToggleHiddenProps = _(R().getToggleHiddenProps, { instance: V(), column: xe });
        });
        var ge = T(W);
        M(function() {
          ge() && b({ type: c.resetHiddenColumns });
        }, [b, v]), Object.assign(s, { allColumnsHidden: se, toggleHideColumn: ie, setHiddenColumns: oe, toggleHideAllColumns: Y, getToggleHideAllColumnsProps: ne });
      }
      var wn = {}, xn = {}, _n = function(s, v, y) {
        return s;
      }, zn = function(s, v) {
        return s.subRows || [];
      }, or = function(s, v, y) {
        return "" + (y ? [y.id, v].join(".") : v);
      }, Gn = function(s) {
        return s;
      };
      function Sn(s) {
        var v = s.initialState, y = v === void 0 ? wn : v, b = s.defaultColumn, E = b === void 0 ? xn : b, R = s.getSubRows, A = R === void 0 ? zn : R, j = s.getRowId, W = j === void 0 ? or : j, V = s.stateReducer, se = V === void 0 ? _n : V, ie = s.useControlledState, oe = ie === void 0 ? Gn : ie;
        return a({}, u(s, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]), { initialState: y, defaultColumn: E, getSubRows: A, getRowId: W, stateReducer: se, useControlledState: oe });
      }
      function Xt(s, v) {
        v === void 0 && (v = 0);
        var y = 0, b = 0, E = 0, R = 0;
        return s.forEach(function(A) {
          var j = A.headers;
          if (A.totalLeft = v, j && j.length) {
            var W = Xt(j, v), V = W[0], se = W[1], ie = W[2], oe = W[3];
            A.totalMinWidth = V, A.totalWidth = se, A.totalMaxWidth = ie, A.totalFlexWidth = oe;
          } else
            A.totalMinWidth = A.minWidth, A.totalWidth = Math.min(Math.max(A.minWidth, A.width), A.maxWidth), A.totalMaxWidth = A.maxWidth, A.totalFlexWidth = A.canResize ? A.totalWidth : 0;
          A.isVisible && (v += A.totalWidth, y += A.totalMinWidth, b += A.totalWidth, E += A.totalMaxWidth, R += A.totalFlexWidth);
        }), [y, b, E, R];
      }
      function An(s) {
        var v = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.column, A = s.getRowId, j = s.getSubRows, W = s.accessValueHooks, V = s.getInstance;
        v.forEach(function(se, ie) {
          return function oe(Y, ne, ge, xe, Fe) {
            ge === void 0 && (ge = 0);
            var Je = Y, $e = A(Y, ne, xe), le = E[$e];
            if (le)
              le.subRows && le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, ge + 1, le);
              });
            else if ((le = { id: $e, original: Je, index: ne, depth: ge, cells: [{}] }).cells.map = U, le.cells.filter = U, le.cells.forEach = U, le.cells[0].getCellProps = U, le.values = {}, Fe.push(le), b.push(le), E[$e] = le, le.originalSubRows = j(Y, ne), le.originalSubRows) {
              var Qe = [];
              le.originalSubRows.forEach(function(Ee, Ye) {
                return oe(Ee, Ye, ge + 1, le, Qe);
              }), le.subRows = Qe;
            }
            R.accessor && (le.values[R.id] = R.accessor(Y, ne, le, Fe, v)), le.values[R.id] = P(W, le.values[R.id], { row: le, column: R, instance: V() });
          }(se, ie, 0, void 0, y);
        });
      }
      c.resetExpanded = "resetExpanded", c.toggleRowExpanded = "toggleRowExpanded", c.toggleAllRowsExpanded = "toggleAllRowsExpanded";
      var ar = function(s) {
        s.getToggleAllRowsExpandedProps = [yr], s.getToggleRowExpandedProps = [br], s.stateReducers.push(ur), s.useInstance.push(wr), s.prepareRow.push(jn);
      };
      ar.pluginName = "useExpanded";
      var yr = function(s, v) {
        var y = v.instance;
        return [s, { onClick: function(b) {
          y.toggleAllRowsExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle All Rows Expanded" }];
      }, br = function(s, v) {
        var y = v.row;
        return [s, { onClick: function() {
          y.toggleRowExpanded();
        }, style: { cursor: "pointer" }, title: "Toggle Row Expanded" }];
      };
      function ur(s, v, y, b) {
        if (v.type === c.init)
          return a({ expanded: {} }, s);
        if (v.type === c.resetExpanded)
          return a({}, s, { expanded: b.initialState.expanded || {} });
        if (v.type === c.toggleAllRowsExpanded) {
          var E = v.value, R = b.rowsById, A = Object.keys(R).length === Object.keys(s.expanded).length;
          if (E !== void 0 ? E : !A) {
            var j = {};
            return Object.keys(R).forEach(function(ne) {
              j[ne] = !0;
            }), a({}, s, { expanded: j });
          }
          return a({}, s, { expanded: {} });
        }
        if (v.type === c.toggleRowExpanded) {
          var W, V = v.id, se = v.value, ie = s.expanded[V], oe = se !== void 0 ? se : !ie;
          if (!ie && oe)
            return a({}, s, { expanded: a({}, s.expanded, (W = {}, W[V] = !0, W)) });
          if (ie && !oe) {
            var Y = s.expanded;
            return Y[V], a({}, s, { expanded: u(Y, [V].map(f)) });
          }
          return s;
        }
      }
      function wr(s) {
        var v = s.data, y = s.rows, b = s.rowsById, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.paginateExpandedRows, j = A === void 0 || A, W = s.expandSubRows, V = W === void 0 || W, se = s.autoResetExpanded, ie = se === void 0 || se, oe = s.getHooks, Y = s.plugins, ne = s.state.expanded, ge = s.dispatch;
        k(Y, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var xe = T(ie), Fe = Boolean(Object.keys(b).length && Object.keys(ne).length);
        Fe && Object.keys(b).some(function(ft) {
          return !ne[ft];
        }) && (Fe = !1), M(function() {
          xe() && ge({ type: c.resetExpanded });
        }, [ge, v]);
        var Je = r.useCallback(function(ft, je) {
          ge({ type: c.toggleRowExpanded, id: ft, value: je });
        }, [ge]), $e = r.useCallback(function(ft) {
          return ge({ type: c.toggleAllRowsExpanded, value: ft });
        }, [ge]), le = r.useMemo(function() {
          return j ? st(y, { manualExpandedKey: R, expanded: ne, expandSubRows: V }) : y;
        }, [j, y, R, ne, V]), Qe = r.useMemo(function() {
          return function(ft) {
            var je = 0;
            return Object.keys(ft).forEach(function(Ue) {
              var bt = Ue.split(".");
              je = Math.max(je, bt.length);
            }), je;
          }(ne);
        }, [ne]), Ee = T(s), Ye = _(oe().getToggleAllRowsExpandedProps, { instance: Ee() });
        Object.assign(s, { preExpandedRows: y, expandedRows: le, rows: le, expandedDepth: Qe, isAllRowsExpanded: Fe, toggleRowExpanded: Je, toggleAllRowsExpanded: $e, getToggleAllRowsExpandedProps: Ye });
      }
      function jn(s, v) {
        var y = v.instance.getHooks, b = v.instance;
        s.toggleRowExpanded = function(E) {
          return b.toggleRowExpanded(s.id, E);
        }, s.getToggleRowExpandedProps = _(y().getToggleRowExpandedProps, { instance: b, row: s });
      }
      var Hn = function(s, v, y) {
        return s = s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return String(R).toLowerCase().includes(String(y).toLowerCase());
          });
        });
      };
      Hn.autoRemove = function(s) {
        return !s;
      };
      var cn = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R).toLowerCase() === String(y).toLowerCase();
          });
        });
      };
      cn.autoRemove = function(s) {
        return !s;
      };
      var Rn = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return R === void 0 || String(R) === String(y);
          });
        });
      };
      Rn.autoRemove = function(s) {
        return !s;
      };
      var kn = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            return b.values[E].includes(y);
          });
        });
      };
      kn.autoRemove = function(s) {
        return !s || !s.length;
      };
      var Fn = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.every(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      Fn.autoRemove = function(s) {
        return !s || !s.length;
      };
      var sr = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return R && R.length && y.some(function(A) {
              return R.includes(A);
            });
          });
        });
      };
      sr.autoRemove = function(s) {
        return !s || !s.length;
      };
      var $n = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            var R = b.values[E];
            return y.includes(R);
          });
        });
      };
      $n.autoRemove = function(s) {
        return !s || !s.length;
      };
      var lr = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            return b.values[E] === y;
          });
        });
      };
      lr.autoRemove = function(s) {
        return s === void 0;
      };
      var Wn = function(s, v, y) {
        return s.filter(function(b) {
          return v.some(function(E) {
            return b.values[E] == y;
          });
        });
      };
      Wn.autoRemove = function(s) {
        return s == null;
      };
      var Vn = function(s, v, y) {
        var b = y || [], E = b[0], R = b[1];
        if ((E = typeof E == "number" ? E : -1 / 0) > (R = typeof R == "number" ? R : 1 / 0)) {
          var A = E;
          E = R, R = A;
        }
        return s.filter(function(j) {
          return v.some(function(W) {
            var V = j.values[W];
            return V >= E && V <= R;
          });
        });
      };
      Vn.autoRemove = function(s) {
        return !s || typeof s[0] != "number" && typeof s[1] != "number";
      };
      var Cn = Object.freeze({ __proto__: null, text: Hn, exactText: cn, exactTextCase: Rn, includes: kn, includesAll: Fn, includesSome: sr, includesValue: $n, exact: lr, equals: Wn, between: Vn });
      c.resetFilters = "resetFilters", c.setFilter = "setFilter", c.setAllFilters = "setAllFilters";
      var xr = function(s) {
        s.stateReducers.push(jt), s.useInstance.push(Kt);
      };
      function jt(s, v, y, b) {
        if (v.type === c.init)
          return a({ filters: [] }, s);
        if (v.type === c.resetFilters)
          return a({}, s, { filters: b.initialState.filters || [] });
        if (v.type === c.setFilter) {
          var E = v.columnId, R = v.filterValue, A = b.allColumns, j = b.filterTypes, W = A.find(function(ge) {
            return ge.id === E;
          });
          if (!W)
            throw new Error("React-Table: Could not find a column with id: " + E);
          var V = lt(W.filter, j || {}, Cn), se = s.filters.find(function(ge) {
            return ge.id === E;
          }), ie = $(R, se && se.value);
          return dt(V.autoRemove, ie, W) ? a({}, s, { filters: s.filters.filter(function(ge) {
            return ge.id !== E;
          }) }) : a({}, s, se ? { filters: s.filters.map(function(ge) {
            return ge.id === E ? { id: E, value: ie } : ge;
          }) } : { filters: [].concat(s.filters, [{ id: E, value: ie }]) });
        }
        if (v.type === c.setAllFilters) {
          var oe = v.filters, Y = b.allColumns, ne = b.filterTypes;
          return a({}, s, { filters: $(oe, s.filters).filter(function(ge) {
            var xe = Y.find(function(Fe) {
              return Fe.id === ge.id;
            });
            return !dt(lt(xe.filter, ne || {}, Cn).autoRemove, ge.value, xe);
          }) });
        }
      }
      function Kt(s) {
        var v = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.manualFilters, W = s.defaultCanFilter, V = W !== void 0 && W, se = s.disableFilters, ie = s.state.filters, oe = s.dispatch, Y = s.autoResetFilters, ne = Y === void 0 || Y, ge = r.useCallback(function(Ee, Ye) {
          oe({ type: c.setFilter, columnId: Ee, filterValue: Ye });
        }, [oe]), xe = r.useCallback(function(Ee) {
          oe({ type: c.setAllFilters, filters: Ee });
        }, [oe]);
        R.forEach(function(Ee) {
          var Ye = Ee.id, ft = Ee.accessor, je = Ee.defaultCanFilter, Ue = Ee.disableFilters;
          Ee.canFilter = ft ? Oe(Ue !== !0 && void 0, se !== !0 && void 0, !0) : Oe(je, V, !1), Ee.setFilter = function(Ke) {
            return ge(Ee.id, Ke);
          };
          var bt = ie.find(function(Ke) {
            return Ke.id === Ye;
          });
          Ee.filterValue = bt && bt.value;
        });
        var Fe = r.useMemo(function() {
          if (j || !ie.length)
            return [y, b, E];
          var Ee = [], Ye = {};
          return [function ft(je, Ue) {
            Ue === void 0 && (Ue = 0);
            var bt = je;
            return (bt = ie.reduce(function(Ke, mt) {
              var l = mt.id, d = mt.value, g = R.find(function(S) {
                return S.id === l;
              });
              if (!g)
                return Ke;
              Ue === 0 && (g.preFilteredRows = Ke);
              var m = lt(g.filter, A || {}, Cn);
              return m ? (g.filteredRows = m(Ke, [l], d), g.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + g.id + "."), Ke);
            }, je)).forEach(function(Ke) {
              Ee.push(Ke), Ye[Ke.id] = Ke, Ke.subRows && (Ke.subRows = Ke.subRows && Ke.subRows.length > 0 ? ft(Ke.subRows, Ue + 1) : Ke.subRows);
            }), bt;
          }(y), Ee, Ye];
        }, [j, ie, y, b, E, R, A]), Je = Fe[0], $e = Fe[1], le = Fe[2];
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
        }, [oe, j ? null : v]), Object.assign(s, { preFilteredRows: y, preFilteredFlatRows: b, preFilteredRowsById: E, filteredRows: Je, filteredFlatRows: $e, filteredRowsById: le, rows: Je, flatRows: $e, rowsById: le, setFilter: ge, setAllFilters: xe });
      }
      xr.pluginName = "useFilters", c.resetGlobalFilter = "resetGlobalFilter", c.setGlobalFilter = "setGlobalFilter";
      var O = function(s) {
        s.stateReducers.push(J), s.useInstance.push(he);
      };
      function J(s, v, y, b) {
        if (v.type === c.resetGlobalFilter)
          return a({}, s, { globalFilter: b.initialState.globalFilter || void 0 });
        if (v.type === c.setGlobalFilter) {
          var E = v.filterValue, R = b.userFilterTypes, A = lt(b.globalFilter, R || {}, Cn), j = $(E, s.globalFilter);
          return dt(A.autoRemove, j) ? (s.globalFilter, u(s, ["globalFilter"])) : a({}, s, { globalFilter: j });
        }
      }
      function he(s) {
        var v = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.filterTypes, j = s.globalFilter, W = s.manualGlobalFilter, V = s.state.globalFilter, se = s.dispatch, ie = s.autoResetGlobalFilter, oe = ie === void 0 || ie, Y = s.disableGlobalFilter, ne = r.useCallback(function(le) {
          se({ type: c.setGlobalFilter, filterValue: le });
        }, [se]), ge = r.useMemo(function() {
          if (W || V === void 0)
            return [y, b, E];
          var le = [], Qe = {}, Ee = lt(j, A || {}, Cn);
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
            return (je = Ee(je, Ye.map(function(Ue) {
              return Ue.id;
            }), V)).forEach(function(Ue) {
              le.push(Ue), Qe[Ue.id] = Ue, Ue.subRows = Ue.subRows && Ue.subRows.length ? ft(Ue.subRows) : Ue.subRows;
            }), je;
          }(y), le, Qe];
        }, [W, V, j, A, R, y, b, E, Y]), xe = ge[0], Fe = ge[1], Je = ge[2], $e = T(oe);
        M(function() {
          $e() && se({ type: c.resetGlobalFilter });
        }, [se, W ? null : v]), Object.assign(s, { preGlobalFilteredRows: y, preGlobalFilteredFlatRows: b, preGlobalFilteredRowsById: E, globalFilteredRows: xe, globalFilteredFlatRows: Fe, globalFilteredRowsById: Je, rows: xe, flatRows: Fe, rowsById: Je, setGlobalFilter: ne, disableGlobalFilter: Y });
      }
      function Le(s, v) {
        return v.reduce(function(y, b) {
          return y + (typeof b == "number" ? b : 0);
        }, 0);
      }
      O.pluginName = "useGlobalFilter";
      var ht = Object.freeze({ __proto__: null, sum: Le, min: function(s) {
        var v = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (v = Math.min(v, y));
        }), v;
      }, max: function(s) {
        var v = s[0] || 0;
        return s.forEach(function(y) {
          typeof y == "number" && (v = Math.max(v, y));
        }), v;
      }, minMax: function(s) {
        var v = s[0] || 0, y = s[0] || 0;
        return s.forEach(function(b) {
          typeof b == "number" && (v = Math.min(v, b), y = Math.max(y, b));
        }), v + ".." + y;
      }, average: function(s) {
        return Le(0, s) / s.length;
      }, median: function(s) {
        if (!s.length)
          return null;
        var v = Math.floor(s.length / 2), y = [].concat(s).sort(function(b, E) {
          return b - E;
        });
        return s.length % 2 != 0 ? y[v] : (y[v - 1] + y[v]) / 2;
      }, unique: function(s) {
        return Array.from(new Set(s).values());
      }, uniqueCount: function(s) {
        return new Set(s).size;
      }, count: function(s) {
        return s.length;
      } }), yt = [], ot = {};
      c.resetGroupBy = "resetGroupBy", c.setGroupBy = "setGroupBy", c.toggleGroupBy = "toggleGroupBy";
      var rt = function(s) {
        s.getGroupByToggleProps = [Ft], s.stateReducers.push(Pt), s.visibleColumnsDeps.push(function(v, y) {
          var b = y.instance;
          return [].concat(v, [b.state.groupBy]);
        }), s.visibleColumns.push(Ot), s.useInstance.push(Un), s.prepareRow.push(Wr);
      };
      rt.pluginName = "useGroupBy";
      var Ft = function(s, v) {
        var y = v.header;
        return [s, { onClick: y.canGroupBy ? function(b) {
          b.persist(), y.toggleGroupBy();
        } : void 0, style: { cursor: y.canGroupBy ? "pointer" : void 0 }, title: "Toggle GroupBy" }];
      };
      function Pt(s, v, y, b) {
        if (v.type === c.init)
          return a({ groupBy: [] }, s);
        if (v.type === c.resetGroupBy)
          return a({}, s, { groupBy: b.initialState.groupBy || [] });
        if (v.type === c.setGroupBy)
          return a({}, s, { groupBy: v.value });
        if (v.type === c.toggleGroupBy) {
          var E = v.columnId, R = v.value, A = R !== void 0 ? R : !s.groupBy.includes(E);
          return a({}, s, A ? { groupBy: [].concat(s.groupBy, [E]) } : { groupBy: s.groupBy.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function Ot(s, v) {
        var y = v.instance.state.groupBy, b = y.map(function(R) {
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
      var mn = {};
      function Un(s) {
        var v = s.data, y = s.rows, b = s.flatRows, E = s.rowsById, R = s.allColumns, A = s.flatHeaders, j = s.groupByFn, W = j === void 0 ? fn : j, V = s.manualGroupBy, se = s.aggregations, ie = se === void 0 ? mn : se, oe = s.plugins, Y = s.state.groupBy, ne = s.dispatch, ge = s.autoResetGroupBy, xe = ge === void 0 || ge, Fe = s.disableGroupBy, Je = s.defaultCanGroupBy, $e = s.getHooks;
        k(oe, ["useColumnOrder", "useFilters"], "useGroupBy");
        var le = T(s);
        R.forEach(function(g) {
          var m = g.accessor, S = g.defaultGroupBy, C = g.disableGroupBy;
          g.canGroupBy = m ? Oe(g.canGroupBy, C !== !0 && void 0, Fe !== !0 && void 0, !0) : Oe(g.canGroupBy, S, Je, !1), g.canGroupBy && (g.toggleGroupBy = function() {
            return s.toggleGroupBy(g.id);
          }), g.Aggregated = g.Aggregated || g.Cell;
        });
        var Qe = r.useCallback(function(g, m) {
          ne({ type: c.toggleGroupBy, columnId: g, value: m });
        }, [ne]), Ee = r.useCallback(function(g) {
          ne({ type: c.setGroupBy, value: g });
        }, [ne]);
        A.forEach(function(g) {
          g.getGroupByToggleProps = _($e().getGroupByToggleProps, { instance: le(), header: g });
        });
        var Ye = r.useMemo(function() {
          if (V || !Y.length)
            return [y, b, E, yt, ot, b, E];
          var g = Y.filter(function(q) {
            return R.find(function(pe) {
              return pe.id === q;
            });
          }), m = [], S = {}, C = [], x = {}, F = [], z = {}, H = function q(pe, Z, ae) {
            if (Z === void 0 && (Z = 0), Z === g.length)
              return pe.map(function(Ne) {
                return a({}, Ne, { depth: Z });
              });
            var me = g[Z], K = W(pe, me);
            return Object.entries(K).map(function(Ne, De) {
              var We = Ne[0], we = Ne[1], Ze = me + ":" + We, it = q(we, Z + 1, Ze = ae ? ae + ">" + Ze : Ze), _e = Z ? Ve(we, "leafRows") : we, ye = function(Be, et, tt) {
                var Rt = {};
                return R.forEach(function(Me) {
                  if (g.includes(Me.id))
                    Rt[Me.id] = et[0] ? et[0].values[Me.id] : null;
                  else {
                    var Lt = typeof Me.aggregate == "function" ? Me.aggregate : ie[Me.aggregate] || ht[Me.aggregate];
                    if (Lt) {
                      var nt = et.map(function(Xe) {
                        return Xe.values[Me.id];
                      }), qe = Be.map(function(Xe) {
                        var Et = Xe.values[Me.id];
                        if (!tt && Me.aggregateValue) {
                          var Ht = typeof Me.aggregateValue == "function" ? Me.aggregateValue : ie[Me.aggregateValue] || ht[Me.aggregateValue];
                          if (!Ht)
                            throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                          Et = Ht(Et, Xe, Me);
                        }
                        return Et;
                      });
                      Rt[Me.id] = Lt(qe, nt);
                    } else {
                      if (Me.aggregate)
                        throw console.info({ column: Me }), new Error("React Table: Invalid column.aggregate option for column listed above");
                      Rt[Me.id] = null;
                    }
                  }
                }), Rt;
              }(_e, we, Z), Se = { id: Ze, isGrouped: !0, groupByID: me, groupByVal: We, values: ye, subRows: it, leafRows: _e, depth: Z, index: De };
              return it.forEach(function(Be) {
                m.push(Be), S[Be.id] = Be, Be.isGrouped ? (C.push(Be), x[Be.id] = Be) : (F.push(Be), z[Be.id] = Be);
              }), Se;
            });
          }(y);
          return H.forEach(function(q) {
            m.push(q), S[q.id] = q, q.isGrouped ? (C.push(q), x[q.id] = q) : (F.push(q), z[q.id] = q);
          }), [H, m, S, C, x, F, z];
        }, [V, Y, y, b, E, R, ie, W]), ft = Ye[0], je = Ye[1], Ue = Ye[2], bt = Ye[3], Ke = Ye[4], mt = Ye[5], l = Ye[6], d = T(xe);
        M(function() {
          d() && ne({ type: c.resetGroupBy });
        }, [ne, V ? null : v]), Object.assign(s, { preGroupedRows: y, preGroupedFlatRow: b, preGroupedRowsById: E, groupedRows: ft, groupedFlatRows: je, groupedRowsById: Ue, onlyGroupedFlatRows: bt, onlyGroupedRowsById: Ke, nonGroupedFlatRows: mt, nonGroupedRowsById: l, rows: ft, flatRows: je, rowsById: Ue, toggleGroupBy: Qe, setGroupBy: Ee });
      }
      function Wr(s) {
        s.allCells.forEach(function(v) {
          var y;
          v.isGrouped = v.column.isGrouped && v.column.id === s.groupByID, v.isPlaceholder = !v.isGrouped && v.column.isGrouped, v.isAggregated = !v.isGrouped && !v.isPlaceholder && ((y = s.subRows) == null ? void 0 : y.length);
        });
      }
      function fn(s, v) {
        return s.reduce(function(y, b, E) {
          var R = "" + b.values[v];
          return y[R] = Array.isArray(y[R]) ? y[R] : [], y[R].push(b), y;
        }, {});
      }
      var ra = /([0-9]+)/gm;
      function mi(s, v) {
        return s === v ? 0 : s > v ? 1 : -1;
      }
      function Vr(s, v, y) {
        return [s.values[y], v.values[y]];
      }
      function ia(s) {
        return typeof s == "number" ? isNaN(s) || s === 1 / 0 || s === -1 / 0 ? "" : String(s) : typeof s == "string" ? s : "";
      }
      var qu = Object.freeze({ __proto__: null, alphanumeric: function(s, v, y) {
        var b = Vr(s, v, y), E = b[0], R = b[1];
        for (E = ia(E), R = ia(R), E = E.split(ra).filter(Boolean), R = R.split(ra).filter(Boolean); E.length && R.length; ) {
          var A = E.shift(), j = R.shift(), W = parseInt(A, 10), V = parseInt(j, 10), se = [W, V].sort();
          if (isNaN(se[0])) {
            if (A > j)
              return 1;
            if (j > A)
              return -1;
          } else {
            if (isNaN(se[1]))
              return isNaN(W) ? -1 : 1;
            if (W > V)
              return 1;
            if (V > W)
              return -1;
          }
        }
        return E.length - R.length;
      }, datetime: function(s, v, y) {
        var b = Vr(s, v, y), E = b[0], R = b[1];
        return mi(E = E.getTime(), R = R.getTime());
      }, basic: function(s, v, y) {
        var b = Vr(s, v, y);
        return mi(b[0], b[1]);
      }, string: function(s, v, y) {
        var b = Vr(s, v, y), E = b[0], R = b[1];
        for (E = E.split("").filter(Boolean), R = R.split("").filter(Boolean); E.length && R.length; ) {
          var A = E.shift(), j = R.shift(), W = A.toLowerCase(), V = j.toLowerCase();
          if (W > V)
            return 1;
          if (V > W)
            return -1;
          if (A > j)
            return 1;
          if (j > A)
            return -1;
        }
        return E.length - R.length;
      }, number: function(s, v, y) {
        var b = Vr(s, v, y), E = b[0], R = b[1], A = /[^0-9.]/gi;
        return mi(E = Number(String(E).replace(A, "")), R = Number(String(R).replace(A, "")));
      } });
      c.resetSortBy = "resetSortBy", c.setSortBy = "setSortBy", c.toggleSortBy = "toggleSortBy", c.clearSortBy = "clearSortBy", w.sortType = "alphanumeric", w.sortDescFirst = !1;
      var oa = function(s) {
        s.getSortByToggleProps = [Yu], s.stateReducers.push(Xu), s.useInstance.push(Ku);
      };
      oa.pluginName = "useSortBy";
      var Yu = function(s, v) {
        var y = v.instance, b = v.column, E = y.isMultiSortEvent, R = E === void 0 ? function(A) {
          return A.shiftKey;
        } : E;
        return [s, { onClick: b.canSort ? function(A) {
          A.persist(), b.toggleSortBy(void 0, !y.disableMultiSort && R(A));
        } : void 0, style: { cursor: b.canSort ? "pointer" : void 0 }, title: b.canSort ? "Toggle SortBy" : void 0 }];
      };
      function Xu(s, v, y, b) {
        if (v.type === c.init)
          return a({ sortBy: [] }, s);
        if (v.type === c.resetSortBy)
          return a({}, s, { sortBy: b.initialState.sortBy || [] });
        if (v.type === c.clearSortBy)
          return a({}, s, { sortBy: s.sortBy.filter(function(le) {
            return le.id !== v.columnId;
          }) });
        if (v.type === c.setSortBy)
          return a({}, s, { sortBy: v.sortBy });
        if (v.type === c.toggleSortBy) {
          var E, R = v.columnId, A = v.desc, j = v.multi, W = b.allColumns, V = b.disableMultiSort, se = b.disableSortRemove, ie = b.disableMultiRemove, oe = b.maxMultiSortColCount, Y = oe === void 0 ? Number.MAX_SAFE_INTEGER : oe, ne = s.sortBy, ge = W.find(function(le) {
            return le.id === R;
          }).sortDescFirst, xe = ne.find(function(le) {
            return le.id === R;
          }), Fe = ne.findIndex(function(le) {
            return le.id === R;
          }), Je = A != null, $e = [];
          return (E = !V && j ? xe ? "toggle" : "add" : Fe !== ne.length - 1 || ne.length !== 1 ? "replace" : xe ? "toggle" : "replace") != "toggle" || se || Je || j && ie || !(xe && xe.desc && !ge || !xe.desc && ge) || (E = "remove"), E === "replace" ? $e = [{ id: R, desc: Je ? A : ge }] : E === "add" ? ($e = [].concat(ne, [{ id: R, desc: Je ? A : ge }])).splice(0, $e.length - Y) : E === "toggle" ? $e = ne.map(function(le) {
            return le.id === R ? a({}, le, { desc: Je ? A : !xe.desc }) : le;
          }) : E === "remove" && ($e = ne.filter(function(le) {
            return le.id !== R;
          })), a({}, s, { sortBy: $e });
        }
      }
      function Ku(s) {
        var v = s.data, y = s.rows, b = s.flatRows, E = s.allColumns, R = s.orderByFn, A = R === void 0 ? aa : R, j = s.sortTypes, W = s.manualSortBy, V = s.defaultCanSort, se = s.disableSortBy, ie = s.flatHeaders, oe = s.state.sortBy, Y = s.dispatch, ne = s.plugins, ge = s.getHooks, xe = s.autoResetSortBy, Fe = xe === void 0 || xe;
        k(ne, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var Je = r.useCallback(function(je) {
          Y({ type: c.setSortBy, sortBy: je });
        }, [Y]), $e = r.useCallback(function(je, Ue, bt) {
          Y({ type: c.toggleSortBy, columnId: je, desc: Ue, multi: bt });
        }, [Y]), le = T(s);
        ie.forEach(function(je) {
          var Ue = je.accessor, bt = je.canSort, Ke = je.disableSortBy, mt = je.id, l = Ue ? Oe(Ke !== !0 && void 0, se !== !0 && void 0, !0) : Oe(V, bt, !1);
          je.canSort = l, je.canSort && (je.toggleSortBy = function(g, m) {
            return $e(je.id, g, m);
          }, je.clearSortBy = function() {
            Y({ type: c.clearSortBy, columnId: je.id });
          }), je.getSortByToggleProps = _(ge().getSortByToggleProps, { instance: le(), column: je });
          var d = oe.find(function(g) {
            return g.id === mt;
          });
          je.isSorted = !!d, je.sortedIndex = oe.findIndex(function(g) {
            return g.id === mt;
          }), je.isSortedDesc = je.isSorted ? d.desc : void 0;
        });
        var Qe = r.useMemo(function() {
          if (W || !oe.length)
            return [y, b];
          var je = [], Ue = oe.filter(function(bt) {
            return E.find(function(Ke) {
              return Ke.id === bt.id;
            });
          });
          return [function bt(Ke) {
            var mt = A(Ke, Ue.map(function(l) {
              var d = E.find(function(S) {
                return S.id === l.id;
              });
              if (!d)
                throw new Error("React-Table: Could not find a column with id: " + l.id + " while sorting");
              var g = d.sortType, m = ut(g) || (j || {})[g] || qu[g];
              if (!m)
                throw new Error("React-Table: Could not find a valid sortType of '" + g + "' for column '" + l.id + "'.");
              return function(S, C) {
                return m(S, C, l.id, l.desc);
              };
            }), Ue.map(function(l) {
              var d = E.find(function(g) {
                return g.id === l.id;
              });
              return d && d.sortInverted ? l.desc : !l.desc;
            }));
            return mt.forEach(function(l) {
              je.push(l), l.subRows && l.subRows.length !== 0 && (l.subRows = bt(l.subRows));
            }), mt;
          }(y), je];
        }, [W, oe, y, b, E, A, j]), Ee = Qe[0], Ye = Qe[1], ft = T(Fe);
        M(function() {
          ft() && Y({ type: c.resetSortBy });
        }, [W ? null : v]), Object.assign(s, { preSortedRows: y, preSortedFlatRows: b, sortedRows: Ee, sortedFlatRows: Ye, rows: Ee, flatRows: Ye, setSortBy: Je, toggleSortBy: $e });
      }
      function aa(s, v, y) {
        return [].concat(s).sort(function(b, E) {
          for (var R = 0; R < v.length; R += 1) {
            var A = v[R], j = y[R] === !1 || y[R] === "desc", W = A(b, E);
            if (W !== 0)
              return j ? -W : W;
          }
          return y[0] ? b.index - E.index : E.index - b.index;
        });
      }
      c.resetPage = "resetPage", c.gotoPage = "gotoPage", c.setPageSize = "setPageSize";
      var Yi = function(s) {
        s.stateReducers.push(Qu), s.useInstance.push(Zu);
      };
      function Qu(s, v, y, b) {
        if (v.type === c.init)
          return a({ pageSize: 10, pageIndex: 0 }, s);
        if (v.type === c.resetPage)
          return a({}, s, { pageIndex: b.initialState.pageIndex || 0 });
        if (v.type === c.gotoPage) {
          var E = b.pageCount, R = b.page, A = $(v.pageIndex, s.pageIndex), j = !1;
          return A > s.pageIndex ? j = E === -1 ? R.length >= s.pageSize : A < E : A < s.pageIndex && (j = A > -1), j ? a({}, s, { pageIndex: A }) : s;
        }
        if (v.type === c.setPageSize) {
          var W = v.pageSize, V = s.pageSize * s.pageIndex;
          return a({}, s, { pageIndex: Math.floor(V / W), pageSize: W });
        }
      }
      function Zu(s) {
        var v = s.rows, y = s.autoResetPage, b = y === void 0 || y, E = s.manualExpandedKey, R = E === void 0 ? "expanded" : E, A = s.plugins, j = s.pageCount, W = s.paginateExpandedRows, V = W === void 0 || W, se = s.expandSubRows, ie = se === void 0 || se, oe = s.state, Y = oe.pageSize, ne = oe.pageIndex, ge = oe.expanded, xe = oe.globalFilter, Fe = oe.filters, Je = oe.groupBy, $e = oe.sortBy, le = s.dispatch, Qe = s.data, Ee = s.manualPagination;
        k(A, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var Ye = T(b);
        M(function() {
          Ye() && le({ type: c.resetPage });
        }, [le, Ee ? null : Qe, xe, Fe, Je, $e]);
        var ft = Ee ? j : Math.ceil(v.length / Y), je = r.useMemo(function() {
          return ft > 0 ? [].concat(new Array(ft)).fill(null).map(function(m, S) {
            return S;
          }) : [];
        }, [ft]), Ue = r.useMemo(function() {
          var m;
          if (Ee)
            m = v;
          else {
            var S = Y * ne, C = S + Y;
            m = v.slice(S, C);
          }
          return V ? m : st(m, { manualExpandedKey: R, expanded: ge, expandSubRows: ie });
        }, [ie, ge, R, Ee, ne, Y, V, v]), bt = ne > 0, Ke = ft === -1 ? Ue.length >= Y : ne < ft - 1, mt = r.useCallback(function(m) {
          le({ type: c.gotoPage, pageIndex: m });
        }, [le]), l = r.useCallback(function() {
          return mt(function(m) {
            return m - 1;
          });
        }, [mt]), d = r.useCallback(function() {
          return mt(function(m) {
            return m + 1;
          });
        }, [mt]), g = r.useCallback(function(m) {
          le({ type: c.setPageSize, pageSize: m });
        }, [le]);
        Object.assign(s, { pageOptions: je, pageCount: ft, page: Ue, canPreviousPage: bt, canNextPage: Ke, gotoPage: mt, previousPage: l, nextPage: d, setPageSize: g });
      }
      Yi.pluginName = "usePagination", c.resetPivot = "resetPivot", c.togglePivot = "togglePivot";
      var Xi = function(s) {
        s.getPivotToggleProps = [Ju], s.stateReducers.push(es), s.useInstanceAfterData.push(ts), s.allColumns.push(ns), s.accessValue.push(rs), s.materializedColumns.push(sa), s.materializedColumnsDeps.push(la), s.visibleColumns.push(is), s.visibleColumnsDeps.push(os), s.useInstance.push(as), s.prepareRow.push(us);
      };
      Xi.pluginName = "usePivotColumns";
      var ua = [], Ju = function(s, v) {
        var y = v.header;
        return [s, { onClick: y.canPivot ? function(b) {
          b.persist(), y.togglePivot();
        } : void 0, style: { cursor: y.canPivot ? "pointer" : void 0 }, title: "Toggle Pivot" }];
      };
      function es(s, v, y, b) {
        if (v.type === c.init)
          return a({ pivotColumns: ua }, s);
        if (v.type === c.resetPivot)
          return a({}, s, { pivotColumns: b.initialState.pivotColumns || ua });
        if (v.type === c.togglePivot) {
          var E = v.columnId, R = v.value, A = R !== void 0 ? R : !s.pivotColumns.includes(E);
          return a({}, s, A ? { pivotColumns: [].concat(s.pivotColumns, [E]) } : { pivotColumns: s.pivotColumns.filter(function(j) {
            return j !== E;
          }) });
        }
      }
      function ts(s) {
        s.allColumns.forEach(function(v) {
          v.isPivotSource = s.state.pivotColumns.includes(v.id);
        });
      }
      function ns(s, v) {
        var y = v.instance;
        return s.forEach(function(b) {
          b.isPivotSource = y.state.pivotColumns.includes(b.id), b.uniqueValues = /* @__PURE__ */ new Set();
        }), s;
      }
      function rs(s, v) {
        var y = v.column;
        return y.uniqueValues && s !== void 0 && y.uniqueValues.add(s), s;
      }
      function sa(s, v) {
        var y = v.instance, b = y.allColumns, E = y.state;
        if (!E.pivotColumns.length || !E.groupBy || !E.groupBy.length)
          return s;
        var R = E.pivotColumns.map(function(W) {
          return b.find(function(V) {
            return V.id === W;
          });
        }).filter(Boolean), A = b.filter(function(W) {
          return !W.isPivotSource && !E.groupBy.includes(W.id) && !E.pivotColumns.includes(W.id);
        }), j = fe(function W(V, se, ie) {
          V === void 0 && (V = 0), ie === void 0 && (ie = []);
          var oe = R[V];
          return oe ? Array.from(oe.uniqueValues).sort().map(function(Y) {
            var ne = a({}, oe, { Header: oe.PivotHeader || typeof oe.header == "string" ? oe.Header + ": " + Y : Y, isPivotGroup: !0, parent: se, depth: V, id: se ? se.id + "." + oe.id + "." + Y : oe.id + "." + Y, pivotValue: Y });
            return ne.columns = W(V + 1, ne, [].concat(ie, [function(ge) {
              return ge.values[oe.id] === Y;
            }])), ne;
          }) : A.map(function(Y) {
            return a({}, Y, { canPivot: !1, isPivoted: !0, parent: se, depth: V, id: "" + (se ? se.id + "." + Y.id : Y.id), accessor: function(ne, ge, xe) {
              if (ie.every(function(Fe) {
                return Fe(xe);
              }))
                return xe.values[Y.id];
            } });
          });
        }());
        return [].concat(s, j);
      }
      function la(s, v) {
        var y = v.instance.state, b = y.pivotColumns, E = y.groupBy;
        return [].concat(s, [b, E]);
      }
      function is(s, v) {
        var y = v.instance.state;
        return s = s.filter(function(b) {
          return !b.isPivotSource;
        }), y.pivotColumns.length && y.groupBy && y.groupBy.length && (s = s.filter(function(b) {
          return b.isGrouped || b.isPivoted;
        })), s;
      }
      function os(s, v) {
        var y = v.instance;
        return [].concat(s, [y.state.pivotColumns, y.state.groupBy]);
      }
      function as(s) {
        var v = s.columns, y = s.allColumns, b = s.flatHeaders, E = s.getHooks, R = s.plugins, A = s.dispatch, j = s.autoResetPivot, W = j === void 0 || j, V = s.manaulPivot, se = s.disablePivot, ie = s.defaultCanPivot;
        k(R, ["useGroupBy"], "usePivotColumns");
        var oe = T(s);
        y.forEach(function(ne) {
          var ge = ne.accessor, xe = ne.defaultPivot, Fe = ne.disablePivot;
          ne.canPivot = ge ? Oe(ne.canPivot, Fe !== !0 && void 0, se !== !0 && void 0, !0) : Oe(ne.canPivot, xe, ie, !1), ne.canPivot && (ne.togglePivot = function() {
            return s.togglePivot(ne.id);
          }), ne.Aggregated = ne.Aggregated || ne.Cell;
        }), b.forEach(function(ne) {
          ne.getPivotToggleProps = _(E().getPivotToggleProps, { instance: oe(), header: ne });
        });
        var Y = T(W);
        M(function() {
          Y() && A({ type: c.resetPivot });
        }, [A, V ? null : v]), Object.assign(s, { togglePivot: function(ne, ge) {
          A({ type: c.togglePivot, columnId: ne, value: ge });
        } });
      }
      function us(s) {
        s.allCells.forEach(function(v) {
          v.isPivoted = v.column.isPivoted;
        });
      }
      c.resetSelectedRows = "resetSelectedRows", c.toggleAllRowsSelected = "toggleAllRowsSelected", c.toggleRowSelected = "toggleRowSelected", c.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var ca = function(s) {
        s.getToggleRowSelectedProps = [Ki], s.getToggleAllRowsSelectedProps = [Ur], s.getToggleAllPageRowsSelectedProps = [fa], s.stateReducers.push(ss), s.useInstance.push(da), s.prepareRow.push(ls);
      };
      ca.pluginName = "useRowSelect";
      var Ki = function(s, v) {
        var y = v.instance, b = v.row, E = y.manualRowSelectedKey, R = E === void 0 ? "isSelected" : E;
        return [s, { onChange: function(A) {
          b.toggleRowSelected(A.target.checked);
        }, style: { cursor: "pointer" }, checked: !(!b.original || !b.original[R]) || b.isSelected, title: "Toggle Row Selected", indeterminate: b.isSomeSelected }];
      }, Ur = function(s, v) {
        var y = v.instance;
        return [s, { onChange: function(b) {
          y.toggleAllRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllRowsSelected, title: "Toggle All Rows Selected", indeterminate: Boolean(!y.isAllRowsSelected && Object.keys(y.state.selectedRowIds).length) }];
      }, fa = function(s, v) {
        var y = v.instance;
        return [s, { onChange: function(b) {
          y.toggleAllPageRowsSelected(b.target.checked);
        }, style: { cursor: "pointer" }, checked: y.isAllPageRowsSelected, title: "Toggle All Current Page Rows Selected", indeterminate: Boolean(!y.isAllPageRowsSelected && y.page.some(function(b) {
          var E = b.id;
          return y.state.selectedRowIds[E];
        })) }];
      };
      function ss(s, v, y, b) {
        if (v.type === c.init)
          return a({ selectedRowIds: {} }, s);
        if (v.type === c.resetSelectedRows)
          return a({}, s, { selectedRowIds: b.initialState.selectedRowIds || {} });
        if (v.type === c.toggleAllRowsSelected) {
          var E = v.value, R = b.isAllRowsSelected, A = b.rowsById, j = b.nonGroupedRowsById, W = j === void 0 ? A : j, V = E !== void 0 ? E : !R, se = Object.assign({}, s.selectedRowIds);
          return V ? Object.keys(W).forEach(function(mt) {
            se[mt] = !0;
          }) : Object.keys(W).forEach(function(mt) {
            delete se[mt];
          }), a({}, s, { selectedRowIds: se });
        }
        if (v.type === c.toggleRowSelected) {
          var ie = v.id, oe = v.value, Y = b.rowsById, ne = b.selectSubRows, ge = ne === void 0 || ne, xe = b.getSubRows, Fe = s.selectedRowIds[ie], Je = oe !== void 0 ? oe : !Fe;
          if (Fe === Je)
            return s;
          var $e = a({}, s.selectedRowIds);
          return function mt(l) {
            var d = Y[l];
            if (d && (d.isGrouped || (Je ? $e[l] = !0 : delete $e[l]), ge && xe(d)))
              return xe(d).forEach(function(g) {
                return mt(g.id);
              });
          }(ie), a({}, s, { selectedRowIds: $e });
        }
        if (v.type === c.toggleAllPageRowsSelected) {
          var le = v.value, Qe = b.page, Ee = b.rowsById, Ye = b.selectSubRows, ft = Ye === void 0 || Ye, je = b.isAllPageRowsSelected, Ue = b.getSubRows, bt = le !== void 0 ? le : !je, Ke = a({}, s.selectedRowIds);
          return Qe.forEach(function(mt) {
            return function l(d) {
              var g = Ee[d];
              if (g.isGrouped || (bt ? Ke[d] = !0 : delete Ke[d]), ft && Ue(g))
                return Ue(g).forEach(function(m) {
                  return l(m.id);
                });
            }(mt.id);
          }), a({}, s, { selectedRowIds: Ke });
        }
        return s;
      }
      function da(s) {
        var v = s.data, y = s.rows, b = s.getHooks, E = s.plugins, R = s.rowsById, A = s.nonGroupedRowsById, j = A === void 0 ? R : A, W = s.autoResetSelectedRows, V = W === void 0 || W, se = s.state.selectedRowIds, ie = s.selectSubRows, oe = ie === void 0 || ie, Y = s.dispatch, ne = s.page, ge = s.getSubRows;
        k(E, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var xe = r.useMemo(function() {
          var Ue = [];
          return y.forEach(function(bt) {
            var Ke = oe ? function mt(l, d, g) {
              if (d[l.id])
                return !0;
              var m = g(l);
              if (m && m.length) {
                var S = !0, C = !1;
                return m.forEach(function(x) {
                  C && !S || (mt(x, d, g) ? C = !0 : S = !1);
                }), !!S || !!C && null;
              }
              return !1;
            }(bt, se, ge) : !!se[bt.id];
            bt.isSelected = !!Ke, bt.isSomeSelected = Ke === null, Ke && Ue.push(bt);
          }), Ue;
        }, [y, oe, se, ge]), Fe = Boolean(Object.keys(j).length && Object.keys(se).length), Je = Fe;
        Fe && Object.keys(j).some(function(Ue) {
          return !se[Ue];
        }) && (Fe = !1), Fe || ne && ne.length && ne.some(function(Ue) {
          var bt = Ue.id;
          return !se[bt];
        }) && (Je = !1);
        var $e = T(V);
        M(function() {
          $e() && Y({ type: c.resetSelectedRows });
        }, [Y, v]);
        var le = r.useCallback(function(Ue) {
          return Y({ type: c.toggleAllRowsSelected, value: Ue });
        }, [Y]), Qe = r.useCallback(function(Ue) {
          return Y({ type: c.toggleAllPageRowsSelected, value: Ue });
        }, [Y]), Ee = r.useCallback(function(Ue, bt) {
          return Y({ type: c.toggleRowSelected, id: Ue, value: bt });
        }, [Y]), Ye = T(s), ft = _(b().getToggleAllRowsSelectedProps, { instance: Ye() }), je = _(b().getToggleAllPageRowsSelectedProps, { instance: Ye() });
        Object.assign(s, { selectedFlatRows: xe, isAllRowsSelected: Fe, isAllPageRowsSelected: Je, toggleRowSelected: Ee, toggleAllRowsSelected: le, getToggleAllRowsSelectedProps: ft, getToggleAllPageRowsSelectedProps: je, toggleAllPageRowsSelected: Qe });
      }
      function ls(s, v) {
        var y = v.instance;
        s.toggleRowSelected = function(b) {
          return y.toggleRowSelected(s.id, b);
        }, s.getToggleRowSelectedProps = _(y.getHooks().getToggleRowSelectedProps, { instance: y, row: s });
      }
      var pa = function(s) {
        return {};
      }, ha = function(s) {
        return {};
      };
      c.setRowState = "setRowState", c.setCellState = "setCellState", c.resetRowState = "resetRowState";
      var Qi = function(s) {
        s.stateReducers.push(cs), s.useInstance.push(ma), s.prepareRow.push(fs);
      };
      function cs(s, v, y, b) {
        var E = b.initialRowStateAccessor, R = E === void 0 ? pa : E, A = b.initialCellStateAccessor, j = A === void 0 ? ha : A, W = b.rowsById;
        if (v.type === c.init)
          return a({ rowState: {} }, s);
        if (v.type === c.resetRowState)
          return a({}, s, { rowState: b.initialState.rowState || {} });
        if (v.type === c.setRowState) {
          var V, se = v.rowId, ie = v.value, oe = s.rowState[se] !== void 0 ? s.rowState[se] : R(W[se]);
          return a({}, s, { rowState: a({}, s.rowState, (V = {}, V[se] = $(ie, oe), V)) });
        }
        if (v.type === c.setCellState) {
          var Y, ne, ge, xe, Fe, Je = v.rowId, $e = v.columnId, le = v.value, Qe = s.rowState[Je] !== void 0 ? s.rowState[Je] : R(W[Je]), Ee = (Qe == null || (Y = Qe.cellState) == null ? void 0 : Y[$e]) !== void 0 ? Qe.cellState[$e] : j((ne = W[Je]) == null || (ge = ne.cells) == null ? void 0 : ge.find(function(Ye) {
            return Ye.column.id === $e;
          }));
          return a({}, s, { rowState: a({}, s.rowState, (Fe = {}, Fe[Je] = a({}, Qe, { cellState: a({}, Qe.cellState || {}, (xe = {}, xe[$e] = $(le, Ee), xe)) }), Fe)) });
        }
      }
      function ma(s) {
        var v = s.autoResetRowState, y = v === void 0 || v, b = s.data, E = s.dispatch, R = r.useCallback(function(W, V) {
          return E({ type: c.setRowState, rowId: W, value: V });
        }, [E]), A = r.useCallback(function(W, V, se) {
          return E({ type: c.setCellState, rowId: W, columnId: V, value: se });
        }, [E]), j = T(y);
        M(function() {
          j() && E({ type: c.resetRowState });
        }, [b]), Object.assign(s, { setRowState: R, setCellState: A });
      }
      function fs(s, v) {
        var y = v.instance, b = y.initialRowStateAccessor, E = b === void 0 ? pa : b, R = y.initialCellStateAccessor, A = R === void 0 ? ha : R, j = y.state.rowState;
        s && (s.state = j[s.id] !== void 0 ? j[s.id] : E(s), s.setState = function(W) {
          return y.setRowState(s.id, W);
        }, s.cells.forEach(function(W) {
          s.state.cellState || (s.state.cellState = {}), W.state = s.state.cellState[W.column.id] !== void 0 ? s.state.cellState[W.column.id] : A(W), W.setState = function(V) {
            return y.setCellState(s.id, W.column.id, V);
          };
        }));
      }
      Qi.pluginName = "useRowState", c.resetColumnOrder = "resetColumnOrder", c.setColumnOrder = "setColumnOrder";
      var va = function(s) {
        s.stateReducers.push(ga), s.visibleColumnsDeps.push(function(v, y) {
          var b = y.instance;
          return [].concat(v, [b.state.columnOrder]);
        }), s.visibleColumns.push(ya), s.useInstance.push(ds);
      };
      function ga(s, v, y, b) {
        return v.type === c.init ? a({ columnOrder: [] }, s) : v.type === c.resetColumnOrder ? a({}, s, { columnOrder: b.initialState.columnOrder || [] }) : v.type === c.setColumnOrder ? a({}, s, { columnOrder: $(v.columnOrder, s.columnOrder) }) : void 0;
      }
      function ya(s, v) {
        var y = v.instance.state.columnOrder;
        if (!y || !y.length)
          return s;
        for (var b = [].concat(y), E = [].concat(s), R = [], A = function() {
          var j = b.shift(), W = E.findIndex(function(V) {
            return V.id === j;
          });
          W > -1 && R.push(E.splice(W, 1)[0]);
        }; E.length && b.length; )
          A();
        return [].concat(R, E);
      }
      function ds(s) {
        var v = s.dispatch;
        s.setColumnOrder = r.useCallback(function(y) {
          return v({ type: c.setColumnOrder, columnOrder: y });
        }, [v]);
      }
      va.pluginName = "useColumnOrder", w.canResize = !0, c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize";
      var ba = function(s) {
        s.getResizerProps = [ps], s.getHeaderProps.push({ style: { position: "relative" } }), s.stateReducers.push(hs), s.useInstance.push(vs), s.useInstanceBeforeDimensions.push(ms);
      }, ps = function(s, v) {
        var y = v.instance, b = v.header, E = y.dispatch, R = function(A, j) {
          var W = !1;
          if (A.type === "touchstart") {
            if (A.touches && A.touches.length > 1)
              return;
            W = !0;
          }
          var V, se, ie = function($e) {
            var le = [];
            return function Qe(Ee) {
              Ee.columns && Ee.columns.length && Ee.columns.map(Qe), le.push(Ee);
            }($e), le;
          }(j).map(function($e) {
            return [$e.id, $e.totalWidth];
          }), oe = W ? Math.round(A.touches[0].clientX) : A.clientX, Y = function() {
            window.cancelAnimationFrame(V), V = null, E({ type: c.columnDoneResizing });
          }, ne = function() {
            window.cancelAnimationFrame(V), V = null, E({ type: c.columnResizing, clientX: se });
          }, ge = function($e) {
            se = $e, V || (V = window.requestAnimationFrame(ne));
          }, xe = { mouse: { moveEvent: "mousemove", moveHandler: function($e) {
            return ge($e.clientX);
          }, upEvent: "mouseup", upHandler: function($e) {
            document.removeEventListener("mousemove", xe.mouse.moveHandler), document.removeEventListener("mouseup", xe.mouse.upHandler), Y();
          } }, touch: { moveEvent: "touchmove", moveHandler: function($e) {
            return $e.cancelable && ($e.preventDefault(), $e.stopPropagation()), ge($e.touches[0].clientX), !1;
          }, upEvent: "touchend", upHandler: function($e) {
            document.removeEventListener(xe.touch.moveEvent, xe.touch.moveHandler), document.removeEventListener(xe.touch.upEvent, xe.touch.moveHandler), Y();
          } } }, Fe = W ? xe.touch : xe.mouse, Je = !!function() {
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
          document.addEventListener(Fe.moveEvent, Fe.moveHandler, Je), document.addEventListener(Fe.upEvent, Fe.upHandler, Je), E({ type: c.columnStartResizing, columnId: j.id, columnWidth: j.totalWidth, headerIdWidths: ie, clientX: oe });
        };
        return [s, { onMouseDown: function(A) {
          return A.persist() || R(A, b);
        }, onTouchStart: function(A) {
          return A.persist() || R(A, b);
        }, style: { cursor: "col-resize" }, draggable: !1, role: "separator" }];
      };
      function hs(s, v) {
        if (v.type === c.init)
          return a({ columnResizing: { columnWidths: {} } }, s);
        if (v.type === c.resetResize)
          return a({}, s, { columnResizing: { columnWidths: {} } });
        if (v.type === c.columnStartResizing) {
          var y = v.clientX, b = v.columnId, E = v.columnWidth, R = v.headerIdWidths;
          return a({}, s, { columnResizing: a({}, s.columnResizing, { startX: y, headerIdWidths: R, columnWidth: E, isResizingColumn: b }) });
        }
        if (v.type === c.columnResizing) {
          var A = v.clientX, j = s.columnResizing, W = j.startX, V = j.columnWidth, se = j.headerIdWidths, ie = (A - W) / V, oe = {};
          return (se === void 0 ? [] : se).forEach(function(Y) {
            var ne = Y[0], ge = Y[1];
            oe[ne] = Math.max(ge + ge * ie, 0);
          }), a({}, s, { columnResizing: a({}, s.columnResizing, { columnWidths: a({}, s.columnResizing.columnWidths, {}, oe) }) });
        }
        return v.type === c.columnDoneResizing ? a({}, s, { columnResizing: a({}, s.columnResizing, { startX: null, isResizingColumn: null }) }) : void 0;
      }
      ba.pluginName = "useResizeColumns";
      var ms = function(s) {
        var v = s.flatHeaders, y = s.disableResizing, b = s.getHooks, E = s.state.columnResizing, R = T(s);
        v.forEach(function(A) {
          var j = Oe(A.disableResizing !== !0 && void 0, y !== !0 && void 0, !0);
          A.canResize = j, A.width = E.columnWidths[A.id] || A.originalWidth || A.width, A.isResizing = E.isResizingColumn === A.id, j && (A.getResizerProps = _(b().getResizerProps, { instance: R(), header: A }));
        });
      };
      function vs(s) {
        var v = s.plugins, y = s.dispatch, b = s.autoResetResize, E = b === void 0 || b, R = s.columns;
        k(v, ["useAbsoluteLayout"], "useResizeColumns");
        var A = T(E);
        M(function() {
          A() && y({ type: c.resetResize });
        }, [R]);
        var j = r.useCallback(function() {
          return y({ type: c.resetResize });
        }, [y]);
        Object.assign(s, { resetResizing: j });
      }
      var Zi = { position: "absolute", top: 0 }, wa = function(s) {
        s.getTableBodyProps.push(vi), s.getRowProps.push(vi), s.getHeaderGroupProps.push(vi), s.getFooterGroupProps.push(vi), s.getHeaderProps.push(function(v, y) {
          var b = y.column;
          return [v, { style: a({}, Zi, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(v, y) {
          var b = y.cell;
          return [v, { style: a({}, Zi, { left: b.column.totalLeft + "px", width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(v, y) {
          var b = y.column;
          return [v, { style: a({}, Zi, { left: b.totalLeft + "px", width: b.totalWidth + "px" }) }];
        });
      };
      wa.pluginName = "useAbsoluteLayout";
      var vi = function(s, v) {
        return [s, { style: { position: "relative", width: v.instance.totalColumnsWidth + "px" } }];
      }, Ji = { display: "inline-block", boxSizing: "border-box" }, eo = function(s, v) {
        return [s, { style: { display: "flex", width: v.instance.totalColumnsWidth + "px" } }];
      }, xa = function(s) {
        s.getRowProps.push(eo), s.getHeaderGroupProps.push(eo), s.getFooterGroupProps.push(eo), s.getHeaderProps.push(function(v, y) {
          var b = y.column;
          return [v, { style: a({}, Ji, { width: b.totalWidth + "px" }) }];
        }), s.getCellProps.push(function(v, y) {
          var b = y.cell;
          return [v, { style: a({}, Ji, { width: b.column.totalWidth + "px" }) }];
        }), s.getFooterProps.push(function(v, y) {
          var b = y.column;
          return [v, { style: a({}, Ji, { width: b.totalWidth + "px" }) }];
        });
      };
      function to(s) {
        s.getTableProps.push(gs), s.getRowProps.push(no), s.getHeaderGroupProps.push(no), s.getFooterGroupProps.push(no), s.getHeaderProps.push(ys), s.getCellProps.push(bs), s.getFooterProps.push(ws);
      }
      xa.pluginName = "useBlockLayout", to.pluginName = "useFlexLayout";
      var gs = function(s, v) {
        return [s, { style: { minWidth: v.instance.totalColumnsMinWidth + "px" } }];
      }, no = function(s, v) {
        return [s, { style: { display: "flex", flex: "1 0 auto", minWidth: v.instance.totalColumnsMinWidth + "px" } }];
      }, ys = function(s, v) {
        var y = v.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      }, bs = function(s, v) {
        var y = v.cell;
        return [s, { style: { boxSizing: "border-box", flex: y.column.totalFlexWidth + " 0 auto", minWidth: y.column.totalMinWidth + "px", width: y.column.totalWidth + "px" } }];
      }, ws = function(s, v) {
        var y = v.column;
        return [s, { style: { boxSizing: "border-box", flex: y.totalFlexWidth ? y.totalFlexWidth + " 0 auto" : void 0, minWidth: y.totalMinWidth + "px", width: y.totalWidth + "px" } }];
      };
      function _a(s) {
        s.stateReducers.push(Na), s.getTableProps.push(Sa), s.getHeaderProps.push(Ra), s.getRowProps.push(Ca);
      }
      c.columnStartResizing = "columnStartResizing", c.columnResizing = "columnResizing", c.columnDoneResizing = "columnDoneResizing", c.resetResize = "resetResize", _a.pluginName = "useGridLayout";
      var Sa = function(s, v) {
        var y = v.instance;
        return [s, { style: { display: "grid", gridTemplateColumns: y.visibleColumns.map(function(b) {
          var E;
          return y.state.gridLayout.columnWidths[b.id] ? y.state.gridLayout.columnWidths[b.id] + "px" : (E = y.state.columnResizing) != null && E.isResizingColumn ? y.state.gridLayout.startWidths[b.id] + "px" : typeof b.width == "number" ? b.width + "px" : b.width;
        }).join(" ") } }];
      }, Ra = function(s, v) {
        var y = v.column;
        return [s, { id: "header-cell-" + y.id, style: { position: "sticky", gridColumn: "span " + y.totalVisibleHeaderCount } }];
      }, Ca = function(s, v) {
        var y = v.row;
        return y.isExpanded ? [s, { style: { gridColumn: "1 / " + (y.cells.length + 1) } }] : [s, {}];
      };
      function Na(s, v, y, b) {
        if (v.type === c.init)
          return a({ gridLayout: { columnWidths: {} } }, s);
        if (v.type === c.resetResize)
          return a({}, s, { gridLayout: { columnWidths: {} } });
        if (v.type === c.columnStartResizing) {
          var E = v.columnId, R = v.headerIdWidths, A = ro(E);
          if (A !== void 0) {
            var j = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = ro(Qe.id), Ee));
            }, {}), W = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.minWidth, Ee));
            }, {}), V = b.visibleColumns.reduce(function(le, Qe) {
              var Ee;
              return a({}, le, ((Ee = {})[Qe.id] = Qe.maxWidth, Ee));
            }, {}), se = R.map(function(le) {
              var Qe = le[0];
              return [Qe, ro(Qe)];
            });
            return a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: j, minWidths: W, maxWidths: V, headerIdGridWidths: se, columnWidth: A }) });
          }
          return s;
        }
        if (v.type === c.columnResizing) {
          var ie = v.clientX, oe = s.columnResizing.startX, Y = s.gridLayout, ne = Y.columnWidth, ge = Y.minWidths, xe = Y.maxWidths, Fe = Y.headerIdGridWidths, Je = (ie - oe) / ne, $e = {};
          return (Fe === void 0 ? [] : Fe).forEach(function(le) {
            var Qe = le[0], Ee = le[1];
            $e[Qe] = Math.min(Math.max(ge[Qe], Ee + Ee * Je), xe[Qe]);
          }), a({}, s, { gridLayout: a({}, s.gridLayout, { columnWidths: a({}, s.gridLayout.columnWidths, {}, $e) }) });
        }
        return v.type === c.columnDoneResizing ? a({}, s, { gridLayout: a({}, s.gridLayout, { startWidths: {}, minWidths: {}, maxWidths: {} }) }) : void 0;
      }
      function ro(s) {
        var v, y = (v = document.getElementById("header-cell-" + s)) == null ? void 0 : v.offsetWidth;
        if (y !== void 0)
          return y;
      }
      n._UNSTABLE_usePivotColumns = Xi, n.actions = c, n.defaultColumn = w, n.defaultGroupByFn = fn, n.defaultOrderByFn = aa, n.defaultRenderer = h, n.emptyRenderer = p, n.ensurePluginOrder = k, n.flexRender = te, n.functionalUpdate = $, n.loopHooks = I, n.makePropGetter = _, n.makeRenderer = L, n.reduceHooks = P, n.safeUseLayoutEffect = G, n.useAbsoluteLayout = wa, n.useAsyncDebounce = function(s, v) {
        v === void 0 && (v = 0);
        var y = r.useRef({}), b = T(s), E = T(v);
        return r.useCallback(function() {
          var R = o(regeneratorRuntime.mark(function A() {
            var j, W, V, se = arguments;
            return regeneratorRuntime.wrap(function(ie) {
              for (; ; )
                switch (ie.prev = ie.next) {
                  case 0:
                    for (j = se.length, W = new Array(j), V = 0; V < j; V++)
                      W[V] = se[V];
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
      }, n.useBlockLayout = xa, n.useColumnOrder = va, n.useExpanded = ar, n.useFilters = xr, n.useFlexLayout = to, n.useGetLatest = T, n.useGlobalFilter = O, n.useGridLayout = _a, n.useGroupBy = rt, n.useMountedLayoutEffect = M, n.usePagination = Yi, n.useResizeColumns = ba, n.useRowSelect = ca, n.useRowState = Qi, n.useSortBy = oa, n.useTable = function(s) {
        for (var v = arguments.length, y = new Array(v > 1 ? v - 1 : 0), b = 1; b < v; b++)
          y[b - 1] = arguments[b];
        s = Sn(s), y = [gt].concat(y);
        var E = r.useRef({}), R = T(E.current);
        Object.assign(R(), a({}, s, { plugins: y, hooks: D() })), y.filter(Boolean).forEach(function(x) {
          x(R().hooks);
        });
        var A = T(R().hooks);
        R().getHooks = A, delete R().hooks, Object.assign(R(), P(A().useOptions, Sn(s)));
        var j = R(), W = j.data, V = j.columns, se = j.initialState, ie = j.defaultColumn, oe = j.getSubRows, Y = j.getRowId, ne = j.stateReducer, ge = j.useControlledState, xe = T(ne), Fe = r.useCallback(function(x, F) {
          if (!F.type)
            throw console.info({ action: F }), new Error("Unknown Action \u{1F446}");
          return [].concat(A().stateReducers, Array.isArray(xe()) ? xe() : [xe()]).reduce(function(z, H) {
            return H(z, F, x, R()) || z;
          }, x);
        }, [A, xe, R]), Je = r.useReducer(Fe, void 0, function() {
          return Fe(se, { type: c.init });
        }), $e = Je[0], le = Je[1], Qe = P([].concat(A().useControlledState, [ge]), $e, { instance: R() });
        Object.assign(R(), { state: Qe, dispatch: le });
        var Ee = r.useMemo(function() {
          return Q(P(A().columns, V, { instance: R() }));
        }, [A, R, V].concat(P(A().columnsDeps, [], { instance: R() })));
        R().columns = Ee;
        var Ye = r.useMemo(function() {
          return P(A().allColumns, fe(Ee), { instance: R() }).map(ve);
        }, [Ee, A, R].concat(P(A().allColumnsDeps, [], { instance: R() })));
        R().allColumns = Ye;
        var ft = r.useMemo(function() {
          for (var x = [], F = [], z = {}, H = [].concat(Ye); H.length; ) {
            var q = H.shift();
            An({ data: W, rows: x, flatRows: F, rowsById: z, column: q, getRowId: Y, getSubRows: oe, accessValueHooks: A().accessValue, getInstance: R });
          }
          return [x, F, z];
        }, [Ye, W, Y, oe, A, R]), je = ft[0], Ue = ft[1], bt = ft[2];
        Object.assign(R(), { rows: je, initialRows: [].concat(je), flatRows: Ue, rowsById: bt }), I(A().useInstanceAfterData, R());
        var Ke = r.useMemo(function() {
          return P(A().visibleColumns, Ye, { instance: R() }).map(function(x) {
            return re(x, ie);
          });
        }, [A, Ye, R, ie].concat(P(A().visibleColumnsDeps, [], { instance: R() })));
        Ye = r.useMemo(function() {
          var x = [].concat(Ke);
          return Ye.forEach(function(F) {
            x.find(function(z) {
              return z.id === F.id;
            }) || x.push(F);
          }), x;
        }, [Ye, Ke]), R().allColumns = Ye;
        var mt = r.useMemo(function() {
          return P(A().headerGroups, ee(Ke, ie), R());
        }, [A, Ke, ie, R].concat(P(A().headerGroupsDeps, [], { instance: R() })));
        R().headerGroups = mt;
        var l = r.useMemo(function() {
          return mt.length ? mt[0].headers : [];
        }, [mt]);
        R().headers = l, R().flatHeaders = mt.reduce(function(x, F) {
          return [].concat(x, F.headers);
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
        var g = Xt(l), m = g[0], S = g[1], C = g[2];
        return R().totalColumnsMinWidth = m, R().totalColumnsWidth = S, R().totalColumnsMaxWidth = C, I(A().useInstance, R()), [].concat(R().flatHeaders, R().allColumns).forEach(function(x) {
          x.render = L(R(), x), x.getHeaderProps = _(A().getHeaderProps, { instance: R(), column: x }), x.getFooterProps = _(A().getFooterProps, { instance: R(), column: x });
        }), R().headerGroups = r.useMemo(function() {
          return mt.filter(function(x, F) {
            return x.headers = x.headers.filter(function(z) {
              return z.headers ? function H(q) {
                return q.filter(function(pe) {
                  return pe.headers ? H(pe.headers) : pe.isVisible;
                }).length;
              }(z.headers) : z.isVisible;
            }), !!x.headers.length && (x.getHeaderGroupProps = _(A().getHeaderGroupProps, { instance: R(), headerGroup: x, index: F }), x.getFooterGroupProps = _(A().getFooterGroupProps, { instance: R(), headerGroup: x, index: F }), !0);
          });
        }, [mt, R, A]), R().footerGroups = [].concat(R().headerGroups).reverse(), R().prepareRow = r.useCallback(function(x) {
          x.getRowProps = _(A().getRowProps, { instance: R(), row: x }), x.allCells = Ye.map(function(F) {
            var z = x.values[F.id], H = { column: F, row: x, value: z };
            return H.getCellProps = _(A().getCellProps, { instance: R(), cell: H }), H.render = L(R(), F, { row: x, cell: H, value: z }), H;
          }), x.cells = Ke.map(function(F) {
            return x.allCells.find(function(z) {
              return z.column.id === F.id;
            });
          }), I(A().prepareRow, x, { instance: R() });
        }, [A, R, Ye, Ke]), R().getTableProps = _(A().getTableProps, { instance: R() }), R().getTableBodyProps = _(A().getTableBodyProps, { instance: R() }), I(A().useFinalInstance, R()), R();
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(za, za.exports)), za.exports;
}
var Ga = { exports: {} }, rh;
function MN() {
  return rh || (rh = 1, function(e, t) {
    (function(n, r) {
      r(t, yn);
    })(Si, function(n, r) {
      r = r && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
      function i(l, d, g, m, S, C, x) {
        try {
          var F = l[C](x), z = F.value;
        } catch (H) {
          g(H);
          return;
        }
        F.done ? d(z) : Promise.resolve(z).then(m, S);
      }
      function o(l) {
        return function() {
          var d = this, g = arguments;
          return new Promise(function(m, S) {
            var C = l.apply(d, g);
            function x(z) {
              i(C, m, S, x, F, "next", z);
            }
            function F(z) {
              i(C, m, S, x, F, "throw", z);
            }
            x(void 0);
          });
        };
      }
      function a() {
        return a = Object.assign || function(l) {
          for (var d = 1; d < arguments.length; d++) {
            var g = arguments[d];
            for (var m in g)
              Object.prototype.hasOwnProperty.call(g, m) && (l[m] = g[m]);
          }
          return l;
        }, a.apply(this, arguments);
      }
      function u(l, d) {
        if (l == null)
          return {};
        var g = {}, m = Object.keys(l), S, C;
        for (C = 0; C < m.length; C++)
          S = m[C], !(d.indexOf(S) >= 0) && (g[S] = l[S]);
        return g;
      }
      function f(l, d) {
        if (typeof l != "object" || l === null)
          return l;
        var g = l[Symbol.toPrimitive];
        if (g !== void 0) {
          var m = g.call(l, d || "default");
          if (typeof m != "object")
            return m;
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
        var g = d.value, m = g === void 0 ? "" : g;
        return m;
      }, N = function() {
        return r.createElement(r.Fragment, null, "\xA0");
      }, _ = {
        Cell: w,
        width: 150,
        minWidth: 0,
        maxWidth: Number.MAX_SAFE_INTEGER
      };
      function P() {
        for (var l = arguments.length, d = new Array(l), g = 0; g < l; g++)
          d[g] = arguments[g];
        return d.reduce(function(m, S) {
          var C = S.style, x = S.className, F = u(S, ["style", "className"]);
          return m = a({}, m, {}, F), C && (m.style = m.style ? a({}, m.style || {}, {}, C || {}) : C), x && (m.className = m.className ? m.className + " " + x : x), m.className === "" && delete m.className, m;
        }, {});
      }
      function I(l, d, g) {
        return typeof d == "function" ? I({}, d(l, g)) : Array.isArray(d) ? P.apply(void 0, [l].concat(d)) : P(l, d);
      }
      var k = function(d, g) {
        return g === void 0 && (g = {}), function(m) {
          return m === void 0 && (m = {}), [].concat(d, [m]).reduce(function(S, C) {
            return I(S, C, a({}, g, {
              userProps: m
            }));
          }, {});
        };
      }, $ = function(d, g, m, S) {
        return m === void 0 && (m = {}), d.reduce(function(C, x) {
          var F = x(C, m);
          if (!S && typeof F > "u")
            throw console.info(x), new Error("React Table: A reducer hook \u261D\uFE0F just returned undefined! This is not allowed.");
          return F;
        }, g);
      }, T = function(d, g, m) {
        return m === void 0 && (m = {}), d.forEach(function(S) {
          var C = S(g, m);
          if (typeof C < "u")
            throw console.info(S, C), new Error("React Table: A loop-type hook \u261D\uFE0F just returned a value! This is not allowed.");
        });
      };
      function G(l, d, g, m) {
        if (m)
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
          var x = l.findIndex(function(F) {
            return F.pluginName === C;
          });
          if (x > -1 && x > S)
            throw new Error("React Table: The " + g + " plugin hook must be placed after the " + C + " plugin hook!");
        });
      }
      function M(l, d) {
        return typeof l == "function" ? l(d) : l;
      }
      function L(l) {
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
        var g = r.useRef({}), m = L(l), S = L(d);
        return r.useCallback(
          /* @__PURE__ */ function() {
            var C = o(
              /* @__PURE__ */ regeneratorRuntime.mark(function x() {
                var F, z, H, q = arguments;
                return regeneratorRuntime.wrap(function(Z) {
                  for (; ; )
                    switch (Z.prev = Z.next) {
                      case 0:
                        for (F = q.length, z = new Array(F), H = 0; H < F; H++)
                          z[H] = q[H];
                        return g.current.promise || (g.current.promise = new Promise(function(ae, me) {
                          g.current.resolve = ae, g.current.reject = me;
                        })), g.current.timeout && clearTimeout(g.current.timeout), g.current.timeout = setTimeout(
                          /* @__PURE__ */ o(
                            /* @__PURE__ */ regeneratorRuntime.mark(function ae() {
                              return regeneratorRuntime.wrap(function(K) {
                                for (; ; )
                                  switch (K.prev = K.next) {
                                    case 0:
                                      return delete g.current.timeout, K.prev = 1, K.t0 = g.current, K.next = 5, m().apply(void 0, z);
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
          [m, S]
        );
      }
      function ve(l, d, g) {
        return g === void 0 && (g = {}), function(m, S) {
          S === void 0 && (S = {});
          var C = typeof m == "string" ? d[m] : m;
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
        return g === void 0 && (g = 0), l.map(function(m) {
          return m = a({}, m, {
            parent: d,
            depth: g
          }), st(m), m.columns && (m.columns = ut(m.columns, m, g + 1)), m;
        });
      }
      function Ve(l) {
        return Ce(l, "columns");
      }
      function st(l) {
        var d = l.id, g = l.accessor, m = l.Header;
        if (typeof g == "string") {
          d = d || g;
          var S = g.split(".");
          g = function(x) {
            return ue(x, S);
          };
        }
        if (!d && typeof m == "string" && m && (d = m), !d && l.columns)
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
          Header: N,
          Footer: N
        }, _, {}, d, {}, l)), Object.assign(l, {
          originalWidth: l.width
        }), l;
      }
      function dt(l, d, g) {
        g === void 0 && (g = function() {
          return {};
        });
        for (var m = [], S = l, C = 0, x = function() {
          return C++;
        }, F = function() {
          var H = {
            headers: []
          }, q = [], pe = S.some(function(Z) {
            return Z.parent;
          });
          S.forEach(function(Z) {
            var ae = [].concat(q).reverse()[0], me;
            if (pe) {
              if (Z.parent)
                me = a({}, Z.parent, {
                  originalId: Z.parent.id,
                  id: Z.parent.id + "_" + x(),
                  headers: [Z]
                }, g(Z));
              else {
                var K = Z.id + "_placeholder";
                me = lt(a({
                  originalId: K,
                  id: Z.id + "_placeholder_" + x(),
                  placeholderOf: Z,
                  headers: [Z]
                }, g(Z)), d);
              }
              ae && ae.originalId === me.originalId ? ae.headers.push(Z) : q.push(me);
            }
            H.headers.push(Z);
          }), m.push(H), S = q;
        }; S.length; )
          F();
        return m.reverse();
      }
      var U = /* @__PURE__ */ new Map();
      function ue(l, d, g) {
        if (!d)
          return l;
        var m = typeof d == "function" ? d : JSON.stringify(d), S = U.get(m) || function() {
          var x = gt(d);
          return U.set(m, x), x;
        }(), C;
        try {
          C = S.reduce(function(x, F) {
            return x[F];
          }, l);
        } catch {
        }
        return typeof C < "u" ? C : g;
      }
      function Pe() {
        for (var l = arguments.length, d = new Array(l), g = 0; g < l; g++)
          d[g] = arguments[g];
        for (var m = 0; m < d.length; m += 1)
          if (typeof d[m] < "u")
            return d[m];
      }
      function Ae(l) {
        if (typeof l == "function")
          return l;
      }
      function Ce(l, d) {
        var g = [], m = function S(C) {
          C.forEach(function(x) {
            x[d] ? S(x[d]) : g.push(x);
          });
        };
        return m(l), g;
      }
      function Re(l, d) {
        var g = d.manualExpandedKey, m = d.expanded, S = d.expandSubRows, C = S === void 0 ? !0 : S, x = [], F = function z(H, q) {
          q === void 0 && (q = !0), H.isExpanded = H.original && H.original[g] || m[H.id], H.canExpand = H.subRows && !!H.subRows.length, q && x.push(H), H.subRows && H.subRows.length && H.isExpanded && H.subRows.forEach(function(pe) {
            return z(pe, C);
          });
        };
        return l.forEach(function(z) {
          return F(z);
        }), x;
      }
      function Te(l, d, g) {
        return Ae(l) || d[l] || g[l] || g.text;
      }
      function Ie(l, d, g) {
        return l ? l(d, g) : typeof d > "u";
      }
      function ze() {
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
      }, kt = function(d) {
        return a({
          role: "rowgroup"
        }, d);
      }, en = function(d, g) {
        var m = g.column;
        return a({
          key: "header_" + m.id,
          colSpan: m.totalVisibleHeaderCount,
          role: "columnheader"
        }, d);
      }, ln = function(d, g) {
        var m = g.column;
        return a({
          key: "footer_" + m.id,
          colSpan: m.totalVisibleHeaderCount
        }, d);
      }, wn = function(d, g) {
        var m = g.index;
        return a({
          key: "headerGroup_" + m,
          role: "row"
        }, d);
      }, xn = function(d, g) {
        var m = g.index;
        return a({
          key: "footerGroup_" + m
        }, d);
      }, _n = function(d, g) {
        var m = g.row;
        return a({
          key: "row_" + m.id,
          role: "row"
        }, d);
      }, zn = function(d, g) {
        var m = g.cell;
        return a({
          key: "cell_" + m.row.id + "_" + m.column.id,
          role: "cell"
        }, d);
      };
      function or() {
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
          getTableBodyProps: [kt],
          getHeaderGroupProps: [wn],
          getFooterGroupProps: [xn],
          getHeaderProps: [en],
          getFooterProps: [ln],
          getRowProps: [_n],
          getCellProps: [zn],
          useFinalInstance: []
        };
      }
      p.resetHiddenColumns = "resetHiddenColumns", p.toggleHideColumn = "toggleHideColumn", p.setHiddenColumns = "setHiddenColumns", p.toggleHideAllColumns = "toggleHideAllColumns";
      var Gn = function(d) {
        d.getToggleHiddenProps = [Sn], d.getToggleHideAllColumnsProps = [Xt], d.stateReducers.push(An), d.useInstanceBeforeDimensions.push(ar), d.headerGroupsDeps.push(function(g, m) {
          var S = m.instance;
          return [].concat(g, [S.state.hiddenColumns]);
        }), d.useInstance.push(yr);
      };
      Gn.pluginName = "useColumnVisibility";
      var Sn = function(d, g) {
        var m = g.column;
        return [d, {
          onChange: function(C) {
            m.toggleHidden(!C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: m.isVisible,
          title: "Toggle Column Visible"
        }];
      }, Xt = function(d, g) {
        var m = g.instance;
        return [d, {
          onChange: function(C) {
            m.toggleHideAllColumns(!C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: !m.allColumnsHidden && !m.state.hiddenColumns.length,
          title: "Toggle All Columns Hidden",
          indeterminate: !m.allColumnsHidden && m.state.hiddenColumns.length
        }];
      };
      function An(l, d, g, m) {
        if (d.type === p.init)
          return a({
            hiddenColumns: []
          }, l);
        if (d.type === p.resetHiddenColumns)
          return a({}, l, {
            hiddenColumns: m.initialState.hiddenColumns || []
          });
        if (d.type === p.toggleHideColumn) {
          var S = typeof d.value < "u" ? d.value : !l.hiddenColumns.includes(d.columnId), C = S ? [].concat(l.hiddenColumns, [d.columnId]) : l.hiddenColumns.filter(function(F) {
            return F !== d.columnId;
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
            hiddenColumns: x ? m.allColumns.map(function(F) {
              return F.id;
            }) : []
          });
        }
      }
      function ar(l) {
        var d = l.headers, g = l.state.hiddenColumns, m = r.useRef(!1);
        m.current;
        var S = function x(F, z) {
          F.isVisible = z && !g.includes(F.id);
          var H = 0;
          return F.headers && F.headers.length ? F.headers.forEach(function(q) {
            return H += x(q, F.isVisible);
          }) : H = F.isVisible ? 1 : 0, F.totalVisibleHeaderCount = H, H;
        }, C = 0;
        d.forEach(function(x) {
          return C += S(x, !0);
        });
      }
      function yr(l) {
        var d = l.columns, g = l.flatHeaders, m = l.dispatch, S = l.allColumns, C = l.getHooks, x = l.state.hiddenColumns, F = l.autoResetHiddenColumns, z = F === void 0 ? !0 : F, H = L(l), q = S.length === x.length, pe = r.useCallback(function(Ne, De) {
          return m({
            type: p.toggleHideColumn,
            columnId: Ne,
            value: De
          });
        }, [m]), Z = r.useCallback(function(Ne) {
          return m({
            type: p.setHiddenColumns,
            value: Ne
          });
        }, [m]), ae = r.useCallback(function(Ne) {
          return m({
            type: p.toggleHideAllColumns,
            value: Ne
          });
        }, [m]), me = k(C().getToggleHideAllColumnsProps, {
          instance: H()
        });
        g.forEach(function(Ne) {
          Ne.toggleHidden = function(De) {
            m({
              type: p.toggleHideColumn,
              columnId: Ne.id,
              value: De
            });
          }, Ne.getToggleHiddenProps = k(C().getToggleHiddenProps, {
            instance: H(),
            column: Ne
          });
        });
        var K = L(z);
        Q(function() {
          K() && m({
            type: p.resetHiddenColumns
          });
        }, [m, d]), Object.assign(l, {
          allColumnsHidden: q,
          toggleHideColumn: pe,
          setHiddenColumns: Z,
          toggleHideAllColumns: ae,
          getToggleHideAllColumnsProps: me
        });
      }
      var br = {}, ur = {}, wr = function(d, g, m) {
        return d;
      }, jn = function(d, g) {
        return d.subRows || [];
      }, Hn = function(d, g, m) {
        return "" + (m ? [m.id, g].join(".") : g);
      }, cn = function(d) {
        return d;
      };
      function Rn(l) {
        var d = l.initialState, g = d === void 0 ? br : d, m = l.defaultColumn, S = m === void 0 ? ur : m, C = l.getSubRows, x = C === void 0 ? jn : C, F = l.getRowId, z = F === void 0 ? Hn : F, H = l.stateReducer, q = H === void 0 ? wr : H, pe = l.useControlledState, Z = pe === void 0 ? cn : pe, ae = u(l, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]);
        return a({}, ae, {
          initialState: g,
          defaultColumn: S,
          getSubRows: x,
          getRowId: z,
          stateReducer: q,
          useControlledState: Z
        });
      }
      var kn = function(d) {
        for (var g = arguments.length, m = new Array(g > 1 ? g - 1 : 0), S = 1; S < g; S++)
          m[S - 1] = arguments[S];
        d = Rn(d), m = [Gn].concat(m);
        var C = r.useRef({}), x = L(C.current);
        Object.assign(x(), a({}, d, {
          plugins: m,
          hooks: or()
        })), m.filter(Boolean).forEach(function(He) {
          He(x().hooks);
        });
        var F = L(x().hooks);
        x().getHooks = F, delete x().hooks, Object.assign(x(), $(F().useOptions, Rn(d)));
        var z = x(), H = z.data, q = z.columns, pe = z.initialState, Z = z.defaultColumn, ae = z.getSubRows, me = z.getRowId, K = z.stateReducer, Ne = z.useControlledState, De = L(K), We = r.useCallback(function(He, Mt) {
          if (!Mt.type)
            throw console.info({
              action: Mt
            }), new Error("Unknown Action \u{1F446}");
          return [].concat(F().stateReducers, Array.isArray(De()) ? De() : [De()]).reduce(function(Dt, an) {
            return an(Dt, Mt, He, x()) || Dt;
          }, He);
        }, [F, De, x]), we = r.useReducer(We, void 0, function() {
          return We(pe, {
            type: p.init
          });
        }), Ze = we[0], it = we[1], _e = $([].concat(F().useControlledState, [Ne]), Ze, {
          instance: x()
        });
        Object.assign(x(), {
          state: _e,
          dispatch: it
        });
        var ye = r.useMemo(function() {
          return ut($(F().columns, q, {
            instance: x()
          }));
        }, [F, x, q].concat($(F().columnsDeps, [], {
          instance: x()
        })));
        x().columns = ye;
        var Se = r.useMemo(function() {
          return $(F().allColumns, Ve(ye), {
            instance: x()
          }).map(st);
        }, [ye, F, x].concat($(F().allColumnsDeps, [], {
          instance: x()
        })));
        x().allColumns = Se;
        var Be = r.useMemo(function() {
          for (var He = [], Mt = [], Dt = {}, an = [].concat(Se); an.length; ) {
            var zt = an.shift();
            sr({
              data: H,
              rows: He,
              flatRows: Mt,
              rowsById: Dt,
              column: zt,
              getRowId: me,
              getSubRows: ae,
              accessValueHooks: F().accessValue,
              getInstance: x
            });
          }
          return [He, Mt, Dt];
        }, [Se, H, me, ae, F, x]), et = Be[0], tt = Be[1], Rt = Be[2];
        Object.assign(x(), {
          rows: et,
          initialRows: [].concat(et),
          flatRows: tt,
          rowsById: Rt
        }), T(F().useInstanceAfterData, x());
        var Me = r.useMemo(function() {
          return $(F().visibleColumns, Se, {
            instance: x()
          }).map(function(He) {
            return lt(He, Z);
          });
        }, [F, Se, x, Z].concat($(F().visibleColumnsDeps, [], {
          instance: x()
        })));
        Se = r.useMemo(function() {
          var He = [].concat(Me);
          return Se.forEach(function(Mt) {
            He.find(function(Dt) {
              return Dt.id === Mt.id;
            }) || He.push(Mt);
          }), He;
        }, [Se, Me]), x().allColumns = Se;
        {
          var Lt = Se.filter(function(He, Mt) {
            return Se.findIndex(function(Dt) {
              return Dt.id === He.id;
            }) !== Mt;
          });
          if (Lt.length)
            throw console.info(Se), new Error('Duplicate columns were found with ids: "' + Lt.map(function(He) {
              return He.id;
            }).join(", ") + '" in the columns array above');
        }
        var nt = r.useMemo(function() {
          return $(F().headerGroups, dt(Me, Z), x());
        }, [F, Me, Z, x].concat($(F().headerGroupsDeps, [], {
          instance: x()
        })));
        x().headerGroups = nt;
        var qe = r.useMemo(function() {
          return nt.length ? nt[0].headers : [];
        }, [nt]);
        x().headers = qe, x().flatHeaders = nt.reduce(function(He, Mt) {
          return [].concat(He, Mt.headers);
        }, []), T(F().useInstanceBeforeDimensions, x());
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
        var Et = Fn(qe), Ht = Et[0], qr = Et[1], io = Et[2];
        return x().totalColumnsMinWidth = Ht, x().totalColumnsWidth = qr, x().totalColumnsMaxWidth = io, T(F().useInstance, x()), [].concat(x().flatHeaders, x().allColumns).forEach(function(He) {
          He.render = ve(x(), He), He.getHeaderProps = k(F().getHeaderProps, {
            instance: x(),
            column: He
          }), He.getFooterProps = k(F().getFooterProps, {
            instance: x(),
            column: He
          });
        }), x().headerGroups = r.useMemo(function() {
          return nt.filter(function(He, Mt) {
            return He.headers = He.headers.filter(function(Dt) {
              var an = function zt(_r) {
                return _r.filter(function(Qt) {
                  return Qt.headers ? zt(Qt.headers) : Qt.isVisible;
                }).length;
              };
              return Dt.headers ? an(Dt.headers) : Dt.isVisible;
            }), He.headers.length ? (He.getHeaderGroupProps = k(F().getHeaderGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Mt
            }), He.getFooterGroupProps = k(F().getFooterGroupProps, {
              instance: x(),
              headerGroup: He,
              index: Mt
            }), !0) : !1;
          });
        }, [nt, x, F]), x().footerGroups = [].concat(x().headerGroups).reverse(), x().prepareRow = r.useCallback(function(He) {
          He.getRowProps = k(F().getRowProps, {
            instance: x(),
            row: He
          }), He.allCells = Se.map(function(Mt) {
            var Dt = He.values[Mt.id], an = {
              column: Mt,
              row: He,
              value: Dt
            };
            return an.getCellProps = k(F().getCellProps, {
              instance: x(),
              cell: an
            }), an.render = ve(x(), Mt, {
              row: He,
              cell: an,
              value: Dt
            }), an;
          }), He.cells = Me.map(function(Mt) {
            return He.allCells.find(function(Dt) {
              return Dt.column.id === Mt.id;
            });
          }), T(F().prepareRow, He, {
            instance: x()
          });
        }, [F, x, Se, Me]), x().getTableProps = k(F().getTableProps, {
          instance: x()
        }), x().getTableBodyProps = k(F().getTableBodyProps, {
          instance: x()
        }), T(F().useFinalInstance, x()), x();
      };
      function Fn(l, d) {
        d === void 0 && (d = 0);
        var g = 0, m = 0, S = 0, C = 0;
        return l.forEach(function(x) {
          var F = x.headers;
          if (x.totalLeft = d, F && F.length) {
            var z = Fn(F, d), H = z[0], q = z[1], pe = z[2], Z = z[3];
            x.totalMinWidth = H, x.totalWidth = q, x.totalMaxWidth = pe, x.totalFlexWidth = Z;
          } else
            x.totalMinWidth = x.minWidth, x.totalWidth = Math.min(Math.max(x.minWidth, x.width), x.maxWidth), x.totalMaxWidth = x.maxWidth, x.totalFlexWidth = x.canResize ? x.totalWidth : 0;
          x.isVisible && (d += x.totalWidth, g += x.totalMinWidth, m += x.totalWidth, S += x.totalMaxWidth, C += x.totalFlexWidth);
        }), [g, m, S, C];
      }
      function sr(l) {
        var d = l.data, g = l.rows, m = l.flatRows, S = l.rowsById, C = l.column, x = l.getRowId, F = l.getSubRows, z = l.accessValueHooks, H = l.getInstance, q = function pe(Z, ae, me, K, Ne) {
          me === void 0 && (me = 0);
          var De = Z, We = x(Z, ae, K), we = S[We];
          if (we)
            we.subRows && we.originalSubRows.forEach(function(it, _e) {
              return pe(it, _e, me + 1, we);
            });
          else if (we = {
            id: We,
            original: De,
            index: ae,
            depth: me,
            cells: [{}]
          }, we.cells.map = ze, we.cells.filter = ze, we.cells.forEach = ze, we.cells[0].getCellProps = ze, we.values = {}, Ne.push(we), m.push(we), S[We] = we, we.originalSubRows = F(Z, ae), we.originalSubRows) {
            var Ze = [];
            we.originalSubRows.forEach(function(it, _e) {
              return pe(it, _e, me + 1, we, Ze);
            }), we.subRows = Ze;
          }
          C.accessor && (we.values[C.id] = C.accessor(Z, ae, we, Ne, d)), we.values[C.id] = $(z, we.values[C.id], {
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
        d.getToggleAllRowsExpandedProps = [lr], d.getToggleRowExpandedProps = [Wn], d.stateReducers.push(Vn), d.useInstance.push(Cn), d.prepareRow.push(xr);
      };
      $n.pluginName = "useExpanded";
      var lr = function(d, g) {
        var m = g.instance;
        return [d, {
          onClick: function(C) {
            m.toggleAllRowsExpanded();
          },
          style: {
            cursor: "pointer"
          },
          title: "Toggle All Rows Expanded"
        }];
      }, Wn = function(d, g) {
        var m = g.row;
        return [d, {
          onClick: function() {
            m.toggleRowExpanded();
          },
          style: {
            cursor: "pointer"
          },
          title: "Toggle Row Expanded"
        }];
      };
      function Vn(l, d, g, m) {
        if (d.type === p.init)
          return a({
            expanded: {}
          }, l);
        if (d.type === p.resetExpanded)
          return a({}, l, {
            expanded: m.initialState.expanded || {}
          });
        if (d.type === p.toggleAllRowsExpanded) {
          var S = d.value, C = m.rowsById, x = Object.keys(C).length === Object.keys(l.expanded).length, F = typeof S < "u" ? S : !x;
          if (F) {
            var z = {};
            return Object.keys(C).forEach(function(Ne) {
              z[Ne] = !0;
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
            var me = l.expanded;
            me[H];
            var K = u(me, [H].map(c));
            return a({}, l, {
              expanded: K
            });
          } else
            return l;
        }
      }
      function Cn(l) {
        var d = l.data, g = l.rows, m = l.rowsById, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.paginateExpandedRows, F = x === void 0 ? !0 : x, z = l.expandSubRows, H = z === void 0 ? !0 : z, q = l.autoResetExpanded, pe = q === void 0 ? !0 : q, Z = l.getHooks, ae = l.plugins, me = l.state.expanded, K = l.dispatch;
        G(ae, ["useSortBy", "useGroupBy", "usePivotColumns", "useGlobalFilter"], "useExpanded");
        var Ne = L(pe), De = Boolean(Object.keys(m).length && Object.keys(me).length);
        De && Object.keys(m).some(function(Se) {
          return !me[Se];
        }) && (De = !1), Q(function() {
          Ne() && K({
            type: p.resetExpanded
          });
        }, [K, d]);
        var We = r.useCallback(function(Se, Be) {
          K({
            type: p.toggleRowExpanded,
            id: Se,
            value: Be
          });
        }, [K]), we = r.useCallback(function(Se) {
          return K({
            type: p.toggleAllRowsExpanded,
            value: Se
          });
        }, [K]), Ze = r.useMemo(function() {
          return F ? Re(g, {
            manualExpandedKey: C,
            expanded: me,
            expandSubRows: H
          }) : g;
        }, [F, g, C, me, H]), it = r.useMemo(function() {
          return jt(me);
        }, [me]), _e = L(l), ye = k(Z().getToggleAllRowsExpandedProps, {
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
        var g = d.instance.getHooks, m = d.instance;
        l.toggleRowExpanded = function(S) {
          return m.toggleRowExpanded(l.id, S);
        }, l.getToggleRowExpandedProps = k(g().getToggleRowExpandedProps, {
          instance: m,
          row: l
        });
      }
      function jt(l) {
        var d = 0;
        return Object.keys(l).forEach(function(g) {
          var m = g.split(".");
          d = Math.max(d, m.length);
        }), d;
      }
      var Kt = function(d, g, m) {
        return d = d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return String(x).toLowerCase().includes(String(m).toLowerCase());
          });
        }), d;
      };
      Kt.autoRemove = function(l) {
        return !l;
      };
      var O = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x).toLowerCase() === String(m).toLowerCase() : !0;
          });
        });
      };
      O.autoRemove = function(l) {
        return !l;
      };
      var J = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x !== void 0 ? String(x) === String(m) : !0;
          });
        });
      };
      J.autoRemove = function(l) {
        return !l;
      };
      var he = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x.includes(m);
          });
        });
      };
      he.autoRemove = function(l) {
        return !l || !l.length;
      };
      var Le = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x && x.length && m.every(function(F) {
              return x.includes(F);
            });
          });
        });
      };
      Le.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ht = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x && x.length && m.some(function(F) {
              return x.includes(F);
            });
          });
        });
      };
      ht.autoRemove = function(l) {
        return !l || !l.length;
      };
      var yt = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return m.includes(x);
          });
        });
      };
      yt.autoRemove = function(l) {
        return !l || !l.length;
      };
      var ot = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x === m;
          });
        });
      };
      ot.autoRemove = function(l) {
        return typeof l > "u";
      };
      var rt = function(d, g, m) {
        return d.filter(function(S) {
          return g.some(function(C) {
            var x = S.values[C];
            return x == m;
          });
        });
      };
      rt.autoRemove = function(l) {
        return l == null;
      };
      var Ft = function(d, g, m) {
        var S = m || [], C = S[0], x = S[1];
        if (C = typeof C == "number" ? C : -1 / 0, x = typeof x == "number" ? x : 1 / 0, C > x) {
          var F = C;
          C = x, x = F;
        }
        return d.filter(function(z) {
          return g.some(function(H) {
            var q = z.values[H];
            return q >= C && q <= x;
          });
        });
      };
      Ft.autoRemove = function(l) {
        return !l || typeof l[0] != "number" && typeof l[1] != "number";
      };
      var Pt = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        text: Kt,
        exactText: O,
        exactTextCase: J,
        includes: he,
        includesAll: Le,
        includesSome: ht,
        includesValue: yt,
        exact: ot,
        equals: rt,
        between: Ft
      });
      p.resetFilters = "resetFilters", p.setFilter = "setFilter", p.setAllFilters = "setAllFilters";
      var Ot = function(d) {
        d.stateReducers.push(mn), d.useInstance.push(Un);
      };
      Ot.pluginName = "useFilters";
      function mn(l, d, g, m) {
        if (d.type === p.init)
          return a({
            filters: []
          }, l);
        if (d.type === p.resetFilters)
          return a({}, l, {
            filters: m.initialState.filters || []
          });
        if (d.type === p.setFilter) {
          var S = d.columnId, C = d.filterValue, x = m.allColumns, F = m.filterTypes, z = x.find(function(K) {
            return K.id === S;
          });
          if (!z)
            throw new Error("React-Table: Could not find a column with id: " + S);
          var H = Te(z.filter, F || {}, Pt), q = l.filters.find(function(K) {
            return K.id === S;
          }), pe = M(C, q && q.value);
          return Ie(H.autoRemove, pe, z) ? a({}, l, {
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
          var Z = d.filters, ae = m.allColumns, me = m.filterTypes;
          return a({}, l, {
            filters: M(Z, l.filters).filter(function(K) {
              var Ne = ae.find(function(We) {
                return We.id === K.id;
              }), De = Te(Ne.filter, me || {}, Pt);
              return !Ie(De.autoRemove, K.value, Ne);
            })
          });
        }
      }
      function Un(l) {
        var d = l.data, g = l.rows, m = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, F = l.manualFilters, z = l.defaultCanFilter, H = z === void 0 ? !1 : z, q = l.disableFilters, pe = l.state.filters, Z = l.dispatch, ae = l.autoResetFilters, me = ae === void 0 ? !0 : ae, K = r.useCallback(function(_e, ye) {
          Z({
            type: p.setFilter,
            columnId: _e,
            filterValue: ye
          });
        }, [Z]), Ne = r.useCallback(function(_e) {
          Z({
            type: p.setAllFilters,
            filters: _e
          });
        }, [Z]);
        C.forEach(function(_e) {
          var ye = _e.id, Se = _e.accessor, Be = _e.defaultCanFilter, et = _e.disableFilters;
          _e.canFilter = Se ? Pe(et === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Pe(Be, H, !1), _e.setFilter = function(Rt) {
            return K(_e.id, Rt);
          };
          var tt = pe.find(function(Rt) {
            return Rt.id === ye;
          });
          _e.filterValue = tt && tt.value;
        });
        var De = r.useMemo(function() {
          if (F || !pe.length)
            return [g, m, S];
          var _e = [], ye = {}, Se = function Be(et, tt) {
            tt === void 0 && (tt = 0);
            var Rt = et;
            return Rt = pe.reduce(function(Me, Lt) {
              var nt = Lt.id, qe = Lt.value, Xe = C.find(function(Ht) {
                return Ht.id === nt;
              });
              if (!Xe)
                return Me;
              tt === 0 && (Xe.preFilteredRows = Me);
              var Et = Te(Xe.filter, x || {}, Pt);
              return Et ? (Xe.filteredRows = Et(Me, [nt], qe), Xe.filteredRows) : (console.warn("Could not find a valid 'column.filter' for column with the ID: " + Xe.id + "."), Me);
            }, et), Rt.forEach(function(Me) {
              _e.push(Me), ye[Me.id] = Me, Me.subRows && (Me.subRows = Me.subRows && Me.subRows.length > 0 ? Be(Me.subRows, tt + 1) : Me.subRows);
            }), Rt;
          };
          return [Se(g), _e, ye];
        }, [F, pe, g, m, S, C, x]), We = De[0], we = De[1], Ze = De[2];
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
        var it = L(me);
        Q(function() {
          it() && Z({
            type: p.resetFilters
          });
        }, [Z, F ? null : d]), Object.assign(l, {
          preFilteredRows: g,
          preFilteredFlatRows: m,
          preFilteredRowsById: S,
          filteredRows: We,
          filteredFlatRows: we,
          filteredRowsById: Ze,
          rows: We,
          flatRows: we,
          rowsById: Ze,
          setFilter: K,
          setAllFilters: Ne
        });
      }
      p.resetGlobalFilter = "resetGlobalFilter", p.setGlobalFilter = "setGlobalFilter";
      var Wr = function(d) {
        d.stateReducers.push(fn), d.useInstance.push(ra);
      };
      Wr.pluginName = "useGlobalFilter";
      function fn(l, d, g, m) {
        if (d.type === p.resetGlobalFilter)
          return a({}, l, {
            globalFilter: m.initialState.globalFilter || void 0
          });
        if (d.type === p.setGlobalFilter) {
          var S = d.filterValue, C = m.userFilterTypes, x = Te(m.globalFilter, C || {}, Pt), F = M(S, l.globalFilter);
          if (Ie(x.autoRemove, F)) {
            l.globalFilter;
            var z = u(l, ["globalFilter"]);
            return z;
          }
          return a({}, l, {
            globalFilter: F
          });
        }
      }
      function ra(l) {
        var d = l.data, g = l.rows, m = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.filterTypes, F = l.globalFilter, z = l.manualGlobalFilter, H = l.state.globalFilter, q = l.dispatch, pe = l.autoResetGlobalFilter, Z = pe === void 0 ? !0 : pe, ae = l.disableGlobalFilter, me = r.useCallback(function(Ze) {
          q({
            type: p.setGlobalFilter,
            filterValue: Ze
          });
        }, [q]), K = r.useMemo(function() {
          if (z || typeof H > "u")
            return [g, m, S];
          var Ze = [], it = {}, _e = Te(F, x || {}, Pt);
          if (!_e)
            return console.warn("Could not find a valid 'globalFilter' option."), g;
          C.forEach(function(Be) {
            var et = Be.disableGlobalFilter;
            Be.canFilter = Pe(et === !0 ? !1 : void 0, ae === !0 ? !1 : void 0, !0);
          });
          var ye = C.filter(function(Be) {
            return Be.canFilter === !0;
          }), Se = function Be(et) {
            return et = _e(et, ye.map(function(tt) {
              return tt.id;
            }), H), et.forEach(function(tt) {
              Ze.push(tt), it[tt.id] = tt, tt.subRows = tt.subRows && tt.subRows.length ? Be(tt.subRows) : tt.subRows;
            }), et;
          };
          return [Se(g), Ze, it];
        }, [z, H, F, x, C, g, m, S, ae]), Ne = K[0], De = K[1], We = K[2], we = L(Z);
        Q(function() {
          we() && q({
            type: p.resetGlobalFilter
          });
        }, [q, z ? null : d]), Object.assign(l, {
          preGlobalFilteredRows: g,
          preGlobalFilteredFlatRows: m,
          preGlobalFilteredRowsById: S,
          globalFilteredRows: Ne,
          globalFilteredFlatRows: De,
          globalFilteredRowsById: We,
          rows: Ne,
          flatRows: De,
          rowsById: We,
          setGlobalFilter: me,
          disableGlobalFilter: ae
        });
      }
      function mi(l, d) {
        return d.reduce(function(g, m) {
          return g + (typeof m == "number" ? m : 0);
        }, 0);
      }
      function Vr(l) {
        var d = l[0] || 0;
        return l.forEach(function(g) {
          typeof g == "number" && (d = Math.min(d, g));
        }), d;
      }
      function ia(l) {
        var d = l[0] || 0;
        return l.forEach(function(g) {
          typeof g == "number" && (d = Math.max(d, g));
        }), d;
      }
      function qu(l) {
        var d = l[0] || 0, g = l[0] || 0;
        return l.forEach(function(m) {
          typeof m == "number" && (d = Math.min(d, m), g = Math.max(g, m));
        }), d + ".." + g;
      }
      function oa(l) {
        return mi(null, l) / l.length;
      }
      function Yu(l) {
        if (!l.length)
          return null;
        var d = Math.floor(l.length / 2), g = [].concat(l).sort(function(m, S) {
          return m - S;
        });
        return l.length % 2 !== 0 ? g[d] : (g[d - 1] + g[d]) / 2;
      }
      function Xu(l) {
        return Array.from(new Set(l).values());
      }
      function Ku(l) {
        return new Set(l).size;
      }
      function aa(l) {
        return l.length;
      }
      var Yi = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        sum: mi,
        min: Vr,
        max: ia,
        minMax: qu,
        average: oa,
        median: Yu,
        unique: Xu,
        uniqueCount: Ku,
        count: aa
      }), Qu = [], Zu = {};
      p.resetGroupBy = "resetGroupBy", p.setGroupBy = "setGroupBy", p.toggleGroupBy = "toggleGroupBy";
      var Xi = function(d) {
        d.getGroupByToggleProps = [ua], d.stateReducers.push(Ju), d.visibleColumnsDeps.push(function(g, m) {
          var S = m.instance;
          return [].concat(g, [S.state.groupBy]);
        }), d.visibleColumns.push(es), d.useInstance.push(ns), d.prepareRow.push(rs);
      };
      Xi.pluginName = "useGroupBy";
      var ua = function(d, g) {
        var m = g.header;
        return [d, {
          onClick: m.canGroupBy ? function(S) {
            S.persist(), m.toggleGroupBy();
          } : void 0,
          style: {
            cursor: m.canGroupBy ? "pointer" : void 0
          },
          title: "Toggle GroupBy"
        }];
      };
      function Ju(l, d, g, m) {
        if (d.type === p.init)
          return a({
            groupBy: []
          }, l);
        if (d.type === p.resetGroupBy)
          return a({}, l, {
            groupBy: m.initialState.groupBy || []
          });
        if (d.type === p.setGroupBy) {
          var S = d.value;
          return a({}, l, {
            groupBy: S
          });
        }
        if (d.type === p.toggleGroupBy) {
          var C = d.columnId, x = d.value, F = typeof x < "u" ? x : !l.groupBy.includes(C);
          return F ? a({}, l, {
            groupBy: [].concat(l.groupBy, [C])
          }) : a({}, l, {
            groupBy: l.groupBy.filter(function(z) {
              return z !== C;
            })
          });
        }
      }
      function es(l, d) {
        var g = d.instance.state.groupBy, m = g.map(function(C) {
          return l.find(function(x) {
            return x.id === C;
          });
        }).filter(Boolean), S = l.filter(function(C) {
          return !g.includes(C.id);
        });
        return l = [].concat(m, S), l.forEach(function(C) {
          C.isGrouped = g.includes(C.id), C.groupedIndex = g.indexOf(C.id);
        }), l;
      }
      var ts = {};
      function ns(l) {
        var d = l.data, g = l.rows, m = l.flatRows, S = l.rowsById, C = l.allColumns, x = l.flatHeaders, F = l.groupByFn, z = F === void 0 ? sa : F, H = l.manualGroupBy, q = l.aggregations, pe = q === void 0 ? ts : q, Z = l.plugins, ae = l.state.groupBy, me = l.dispatch, K = l.autoResetGroupBy, Ne = K === void 0 ? !0 : K, De = l.disableGroupBy, We = l.defaultCanGroupBy, we = l.getHooks;
        G(Z, ["useColumnOrder", "useFilters"], "useGroupBy");
        var Ze = L(l);
        C.forEach(function(qe) {
          var Xe = qe.accessor, Et = qe.defaultGroupBy, Ht = qe.disableGroupBy;
          qe.canGroupBy = Xe ? Pe(qe.canGroupBy, Ht === !0 ? !1 : void 0, De === !0 ? !1 : void 0, !0) : Pe(qe.canGroupBy, Et, We, !1), qe.canGroupBy && (qe.toggleGroupBy = function() {
            return l.toggleGroupBy(qe.id);
          }), qe.Aggregated = qe.Aggregated || qe.Cell;
        });
        var it = r.useCallback(function(qe, Xe) {
          me({
            type: p.toggleGroupBy,
            columnId: qe,
            value: Xe
          });
        }, [me]), _e = r.useCallback(function(qe) {
          me({
            type: p.setGroupBy,
            value: qe
          });
        }, [me]);
        x.forEach(function(qe) {
          qe.getGroupByToggleProps = k(we().getGroupByToggleProps, {
            instance: Ze(),
            header: qe
          });
        });
        var ye = r.useMemo(function() {
          if (H || !ae.length)
            return [g, m, S, Qu, Zu, m, S];
          var qe = ae.filter(function(zt) {
            return C.find(function(_r) {
              return _r.id === zt;
            });
          }), Xe = function(_r, Qt, Pa) {
            var Sr = {};
            return C.forEach(function($t) {
              if (qe.includes($t.id)) {
                Sr[$t.id] = Qt[0] ? Qt[0].values[$t.id] : null;
                return;
              }
              var Ta = typeof $t.aggregate == "function" ? $t.aggregate : pe[$t.aggregate] || Yi[$t.aggregate];
              if (Ta) {
                var gi = Qt.map(function(Yr) {
                  return Yr.values[$t.id];
                }), xs = _r.map(function(Yr) {
                  var Rr = Yr.values[$t.id];
                  if (!Pa && $t.aggregateValue) {
                    var Cr = typeof $t.aggregateValue == "function" ? $t.aggregateValue : pe[$t.aggregateValue] || Yi[$t.aggregateValue];
                    if (!Cr)
                      throw console.info({
                        column: $t
                      }), new Error("React Table: Invalid column.aggregateValue option for column listed above");
                    Rr = Cr(Rr, Yr, $t);
                  }
                  return Rr;
                });
                Sr[$t.id] = Ta(xs, gi);
              } else {
                if ($t.aggregate)
                  throw console.info({
                    column: $t
                  }), new Error("React Table: Invalid column.aggregate option for column listed above");
                Sr[$t.id] = null;
              }
            }), Sr;
          }, Et = [], Ht = {}, qr = [], io = {}, He = [], Mt = {}, Dt = function zt(_r, Qt, Pa) {
            if (Qt === void 0 && (Qt = 0), Qt === qe.length)
              return _r.map(function(gi) {
                return a({}, gi, {
                  depth: Qt
                });
              });
            var Sr = qe[Qt], $t = z(_r, Sr), Ta = Object.entries($t).map(function(gi, xs) {
              var Yr = gi[0], Rr = gi[1], Cr = Sr + ":" + Yr;
              Cr = Pa ? Pa + ">" + Cr : Cr;
              var Ff = zt(Rr, Qt + 1, Cr), $f = Qt ? Ce(Rr, "leafRows") : Rr, Dg = Xe($f, Rr, Qt), Lg = {
                id: Cr,
                isGrouped: !0,
                groupByID: Sr,
                groupByVal: Yr,
                values: Dg,
                subRows: Ff,
                leafRows: $f,
                depth: Qt,
                index: xs
              };
              return Ff.forEach(function(qn) {
                Et.push(qn), Ht[qn.id] = qn, qn.isGrouped ? (qr.push(qn), io[qn.id] = qn) : (He.push(qn), Mt[qn.id] = qn);
              }), Lg;
            });
            return Ta;
          }, an = Dt(g);
          return an.forEach(function(zt) {
            Et.push(zt), Ht[zt.id] = zt, zt.isGrouped ? (qr.push(zt), io[zt.id] = zt) : (He.push(zt), Mt[zt.id] = zt);
          }), [an, Et, Ht, qr, io, He, Mt];
        }, [H, ae, g, m, S, C, pe, z]), Se = ye[0], Be = ye[1], et = ye[2], tt = ye[3], Rt = ye[4], Me = ye[5], Lt = ye[6], nt = L(Ne);
        Q(function() {
          nt() && me({
            type: p.resetGroupBy
          });
        }, [me, H ? null : d]), Object.assign(l, {
          preGroupedRows: g,
          preGroupedFlatRow: m,
          preGroupedRowsById: S,
          groupedRows: Se,
          groupedFlatRows: Be,
          groupedRowsById: et,
          onlyGroupedFlatRows: tt,
          onlyGroupedRowsById: Rt,
          nonGroupedFlatRows: Me,
          nonGroupedRowsById: Lt,
          rows: Se,
          flatRows: Be,
          rowsById: et,
          toggleGroupBy: it,
          setGroupBy: _e
        });
      }
      function rs(l) {
        l.allCells.forEach(function(d) {
          var g;
          d.isGrouped = d.column.isGrouped && d.column.id === l.groupByID, d.isPlaceholder = !d.isGrouped && d.column.isGrouped, d.isAggregated = !d.isGrouped && !d.isPlaceholder && ((g = l.subRows) == null ? void 0 : g.length);
        });
      }
      function sa(l, d) {
        return l.reduce(function(g, m, S) {
          var C = "" + m.values[d];
          return g[C] = Array.isArray(g[C]) ? g[C] : [], g[C].push(m), g;
        }, {});
      }
      var la = /([0-9]+)/gm, is = function(d, g, m) {
        var S = Ur(d, g, m), C = S[0], x = S[1];
        for (C = fa(C), x = fa(x), C = C.split(la).filter(Boolean), x = x.split(la).filter(Boolean); C.length && x.length; ) {
          var F = C.shift(), z = x.shift(), H = parseInt(F, 10), q = parseInt(z, 10), pe = [H, q].sort();
          if (isNaN(pe[0])) {
            if (F > z)
              return 1;
            if (z > F)
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
      function os(l, d, g) {
        var m = Ur(l, d, g), S = m[0], C = m[1];
        return S = S.getTime(), C = C.getTime(), Ki(S, C);
      }
      function as(l, d, g) {
        var m = Ur(l, d, g), S = m[0], C = m[1];
        return Ki(S, C);
      }
      function us(l, d, g) {
        var m = Ur(l, d, g), S = m[0], C = m[1];
        for (S = S.split("").filter(Boolean), C = C.split("").filter(Boolean); S.length && C.length; ) {
          var x = S.shift(), F = C.shift(), z = x.toLowerCase(), H = F.toLowerCase();
          if (z > H)
            return 1;
          if (H > z)
            return -1;
          if (x > F)
            return 1;
          if (F > x)
            return -1;
        }
        return S.length - C.length;
      }
      function ca(l, d, g) {
        var m = Ur(l, d, g), S = m[0], C = m[1], x = /[^0-9.]/gi;
        return S = Number(String(S).replace(x, "")), C = Number(String(C).replace(x, "")), Ki(S, C);
      }
      function Ki(l, d) {
        return l === d ? 0 : l > d ? 1 : -1;
      }
      function Ur(l, d, g) {
        return [l.values[g], d.values[g]];
      }
      function fa(l) {
        return typeof l == "number" ? isNaN(l) || l === 1 / 0 || l === -1 / 0 ? "" : String(l) : typeof l == "string" ? l : "";
      }
      var ss = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        alphanumeric: is,
        datetime: os,
        basic: as,
        string: us,
        number: ca
      });
      p.resetSortBy = "resetSortBy", p.setSortBy = "setSortBy", p.toggleSortBy = "toggleSortBy", p.clearSortBy = "clearSortBy", _.sortType = "alphanumeric", _.sortDescFirst = !1;
      var da = function(d) {
        d.getSortByToggleProps = [ls], d.stateReducers.push(pa), d.useInstance.push(ha);
      };
      da.pluginName = "useSortBy";
      var ls = function(d, g) {
        var m = g.instance, S = g.column, C = m.isMultiSortEvent, x = C === void 0 ? function(F) {
          return F.shiftKey;
        } : C;
        return [d, {
          onClick: S.canSort ? function(F) {
            F.persist(), S.toggleSortBy(void 0, !m.disableMultiSort && x(F));
          } : void 0,
          style: {
            cursor: S.canSort ? "pointer" : void 0
          },
          title: S.canSort ? "Toggle SortBy" : void 0
        }];
      };
      function pa(l, d, g, m) {
        if (d.type === p.init)
          return a({
            sortBy: []
          }, l);
        if (d.type === p.resetSortBy)
          return a({}, l, {
            sortBy: m.initialState.sortBy || []
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
          var F = d.columnId, z = d.desc, H = d.multi, q = m.allColumns, pe = m.disableMultiSort, Z = m.disableSortRemove, ae = m.disableMultiRemove, me = m.maxMultiSortColCount, K = me === void 0 ? Number.MAX_SAFE_INTEGER : me, Ne = l.sortBy, De = q.find(function(Se) {
            return Se.id === F;
          }), We = De.sortDescFirst, we = Ne.find(function(Se) {
            return Se.id === F;
          }), Ze = Ne.findIndex(function(Se) {
            return Se.id === F;
          }), it = typeof z < "u" && z !== null, _e = [], ye;
          return !pe && H ? we ? ye = "toggle" : ye = "add" : Ze !== Ne.length - 1 || Ne.length !== 1 ? ye = "replace" : we ? ye = "toggle" : ye = "replace", ye === "toggle" && !Z && !it && (H ? !ae : !0) && (we && we.desc && !We || !we.desc && We) && (ye = "remove"), ye === "replace" ? _e = [{
            id: F,
            desc: it ? z : We
          }] : ye === "add" ? (_e = [].concat(Ne, [{
            id: F,
            desc: it ? z : We
          }]), _e.splice(0, _e.length - K)) : ye === "toggle" ? _e = Ne.map(function(Se) {
            return Se.id === F ? a({}, Se, {
              desc: it ? z : !we.desc
            }) : Se;
          }) : ye === "remove" && (_e = Ne.filter(function(Se) {
            return Se.id !== F;
          })), a({}, l, {
            sortBy: _e
          });
        }
      }
      function ha(l) {
        var d = l.data, g = l.rows, m = l.flatRows, S = l.allColumns, C = l.orderByFn, x = C === void 0 ? Qi : C, F = l.sortTypes, z = l.manualSortBy, H = l.defaultCanSort, q = l.disableSortBy, pe = l.flatHeaders, Z = l.state.sortBy, ae = l.dispatch, me = l.plugins, K = l.getHooks, Ne = l.autoResetSortBy, De = Ne === void 0 ? !0 : Ne;
        G(me, ["useFilters", "useGlobalFilter", "useGroupBy", "usePivotColumns"], "useSortBy");
        var We = r.useCallback(function(Be) {
          ae({
            type: p.setSortBy,
            sortBy: Be
          });
        }, [ae]), we = r.useCallback(function(Be, et, tt) {
          ae({
            type: p.toggleSortBy,
            columnId: Be,
            desc: et,
            multi: tt
          });
        }, [ae]), Ze = L(l);
        pe.forEach(function(Be) {
          var et = Be.accessor, tt = Be.canSort, Rt = Be.disableSortBy, Me = Be.id, Lt = et ? Pe(Rt === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Pe(H, tt, !1);
          Be.canSort = Lt, Be.canSort && (Be.toggleSortBy = function(qe, Xe) {
            return we(Be.id, qe, Xe);
          }, Be.clearSortBy = function() {
            ae({
              type: p.clearSortBy,
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
            return [g, m];
          var Be = [], et = Z.filter(function(Rt) {
            return S.find(function(Me) {
              return Me.id === Rt.id;
            });
          }), tt = function Rt(Me) {
            var Lt = x(
              Me,
              et.map(function(nt) {
                var qe = S.find(function(Ht) {
                  return Ht.id === nt.id;
                });
                if (!qe)
                  throw new Error("React-Table: Could not find a column with id: " + nt.id + " while sorting");
                var Xe = qe.sortType, Et = Ae(Xe) || (F || {})[Xe] || ss[Xe];
                if (!Et)
                  throw new Error("React-Table: Could not find a valid sortType of '" + Xe + "' for column '" + nt.id + "'.");
                return function(Ht, qr) {
                  return Et(Ht, qr, nt.id, nt.desc);
                };
              }),
              et.map(function(nt) {
                var qe = S.find(function(Xe) {
                  return Xe.id === nt.id;
                });
                return qe && qe.sortInverted ? nt.desc : !nt.desc;
              })
            );
            return Lt.forEach(function(nt) {
              Be.push(nt), !(!nt.subRows || nt.subRows.length === 0) && (nt.subRows = Rt(nt.subRows));
            }), Lt;
          };
          return [tt(g), Be];
        }, [z, Z, g, m, S, x, F]), _e = it[0], ye = it[1], Se = L(De);
        Q(function() {
          Se() && ae({
            type: p.resetSortBy
          });
        }, [z ? null : d]), Object.assign(l, {
          preSortedRows: g,
          preSortedFlatRows: m,
          sortedRows: _e,
          sortedFlatRows: ye,
          rows: _e,
          flatRows: ye,
          setSortBy: We,
          toggleSortBy: we
        });
      }
      function Qi(l, d, g) {
        return [].concat(l).sort(function(m, S) {
          for (var C = 0; C < d.length; C += 1) {
            var x = d[C], F = g[C] === !1 || g[C] === "desc", z = x(m, S);
            if (z !== 0)
              return F ? -z : z;
          }
          return g[0] ? m.index - S.index : S.index - m.index;
        });
      }
      var cs = "usePagination";
      p.resetPage = "resetPage", p.gotoPage = "gotoPage", p.setPageSize = "setPageSize";
      var ma = function(d) {
        d.stateReducers.push(fs), d.useInstance.push(va);
      };
      ma.pluginName = cs;
      function fs(l, d, g, m) {
        if (d.type === p.init)
          return a({
            pageSize: 10,
            pageIndex: 0
          }, l);
        if (d.type === p.resetPage)
          return a({}, l, {
            pageIndex: m.initialState.pageIndex || 0
          });
        if (d.type === p.gotoPage) {
          var S = m.pageCount, C = m.page, x = M(d.pageIndex, l.pageIndex), F = !1;
          return x > l.pageIndex ? F = S === -1 ? C.length >= l.pageSize : x < S : x < l.pageIndex && (F = x > -1), F ? a({}, l, {
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
        var d = l.rows, g = l.autoResetPage, m = g === void 0 ? !0 : g, S = l.manualExpandedKey, C = S === void 0 ? "expanded" : S, x = l.plugins, F = l.pageCount, z = l.paginateExpandedRows, H = z === void 0 ? !0 : z, q = l.expandSubRows, pe = q === void 0 ? !0 : q, Z = l.state, ae = Z.pageSize, me = Z.pageIndex, K = Z.expanded, Ne = Z.globalFilter, De = Z.filters, We = Z.groupBy, we = Z.sortBy, Ze = l.dispatch, it = l.data, _e = l.manualPagination;
        G(x, ["useGlobalFilter", "useFilters", "useGroupBy", "useSortBy", "useExpanded"], "usePagination");
        var ye = L(m);
        Q(function() {
          ye() && Ze({
            type: p.resetPage
          });
        }, [Ze, _e ? null : it, Ne, De, We, we]);
        var Se = _e ? F : Math.ceil(d.length / ae), Be = r.useMemo(function() {
          return Se > 0 ? [].concat(new Array(Se)).fill(null).map(function(Xe, Et) {
            return Et;
          }) : [];
        }, [Se]), et = r.useMemo(function() {
          var Xe;
          if (_e)
            Xe = d;
          else {
            var Et = ae * me, Ht = Et + ae;
            Xe = d.slice(Et, Ht);
          }
          return H ? Xe : Re(Xe, {
            manualExpandedKey: C,
            expanded: K,
            expandSubRows: pe
          });
        }, [pe, K, C, _e, me, ae, H, d]), tt = me > 0, Rt = Se === -1 ? et.length >= ae : me < Se - 1, Me = r.useCallback(function(Xe) {
          Ze({
            type: p.gotoPage,
            pageIndex: Xe
          });
        }, [Ze]), Lt = r.useCallback(function() {
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
          pageOptions: Be,
          pageCount: Se,
          page: et,
          canPreviousPage: tt,
          canNextPage: Rt,
          gotoPage: Me,
          previousPage: Lt,
          nextPage: nt,
          setPageSize: qe
        });
      }
      p.resetPivot = "resetPivot", p.togglePivot = "togglePivot";
      var ga = function(d) {
        d.getPivotToggleProps = [ds], d.stateReducers.push(ba), d.useInstanceAfterData.push(ps), d.allColumns.push(hs), d.accessValue.push(ms), d.materializedColumns.push(vs), d.materializedColumnsDeps.push(Zi), d.visibleColumns.push(wa), d.visibleColumnsDeps.push(vi), d.useInstance.push(Ji), d.prepareRow.push(eo);
      };
      ga.pluginName = "usePivotColumns";
      var ya = [], ds = function(d, g) {
        var m = g.header;
        return [d, {
          onClick: m.canPivot ? function(S) {
            S.persist(), m.togglePivot();
          } : void 0,
          style: {
            cursor: m.canPivot ? "pointer" : void 0
          },
          title: "Toggle Pivot"
        }];
      };
      function ba(l, d, g, m) {
        if (d.type === p.init)
          return a({
            pivotColumns: ya
          }, l);
        if (d.type === p.resetPivot)
          return a({}, l, {
            pivotColumns: m.initialState.pivotColumns || ya
          });
        if (d.type === p.togglePivot) {
          var S = d.columnId, C = d.value, x = typeof C < "u" ? C : !l.pivotColumns.includes(S);
          return x ? a({}, l, {
            pivotColumns: [].concat(l.pivotColumns, [S])
          }) : a({}, l, {
            pivotColumns: l.pivotColumns.filter(function(F) {
              return F !== S;
            })
          });
        }
      }
      function ps(l) {
        l.allColumns.forEach(function(d) {
          d.isPivotSource = l.state.pivotColumns.includes(d.id);
        });
      }
      function hs(l, d) {
        var g = d.instance;
        return l.forEach(function(m) {
          m.isPivotSource = g.state.pivotColumns.includes(m.id), m.uniqueValues = /* @__PURE__ */ new Set();
        }), l;
      }
      function ms(l, d) {
        var g = d.column;
        return g.uniqueValues && typeof l < "u" && g.uniqueValues.add(l), l;
      }
      function vs(l, d) {
        var g = d.instance, m = g.allColumns, S = g.state;
        if (!S.pivotColumns.length || !S.groupBy || !S.groupBy.length)
          return l;
        var C = S.pivotColumns.map(function(H) {
          return m.find(function(q) {
            return q.id === H;
          });
        }).filter(Boolean), x = m.filter(function(H) {
          return !H.isPivotSource && !S.groupBy.includes(H.id) && !S.pivotColumns.includes(H.id);
        }), F = function H(q, pe, Z) {
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
          var me = Array.from(ae.uniqueValues).sort();
          return me.map(function(K) {
            var Ne = a({}, ae, {
              Header: ae.PivotHeader || typeof ae.header == "string" ? ae.Header + ": " + K : K,
              isPivotGroup: !0,
              parent: pe,
              depth: q,
              id: pe ? pe.id + "." + ae.id + "." + K : ae.id + "." + K,
              pivotValue: K
            });
            return Ne.columns = H(q + 1, Ne, [].concat(Z, [function(De) {
              return De.values[ae.id] === K;
            }])), Ne;
          });
        }, z = Ve(F());
        return [].concat(l, z);
      }
      function Zi(l, d) {
        var g = d.instance.state, m = g.pivotColumns, S = g.groupBy;
        return [].concat(l, [m, S]);
      }
      function wa(l, d) {
        var g = d.instance.state;
        return l = l.filter(function(m) {
          return !m.isPivotSource;
        }), g.pivotColumns.length && g.groupBy && g.groupBy.length && (l = l.filter(function(m) {
          return m.isGrouped || m.isPivoted;
        })), l;
      }
      function vi(l, d) {
        var g = d.instance;
        return [].concat(l, [g.state.pivotColumns, g.state.groupBy]);
      }
      function Ji(l) {
        var d = l.columns, g = l.allColumns, m = l.flatHeaders, S = l.getHooks, C = l.plugins, x = l.dispatch, F = l.autoResetPivot, z = F === void 0 ? !0 : F, H = l.manaulPivot, q = l.disablePivot, pe = l.defaultCanPivot;
        G(C, ["useGroupBy"], "usePivotColumns");
        var Z = L(l);
        g.forEach(function(K) {
          var Ne = K.accessor, De = K.defaultPivot, We = K.disablePivot;
          K.canPivot = Ne ? Pe(K.canPivot, We === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0) : Pe(K.canPivot, De, pe, !1), K.canPivot && (K.togglePivot = function() {
            return l.togglePivot(K.id);
          }), K.Aggregated = K.Aggregated || K.Cell;
        });
        var ae = function(Ne, De) {
          x({
            type: p.togglePivot,
            columnId: Ne,
            value: De
          });
        };
        m.forEach(function(K) {
          K.getPivotToggleProps = k(S().getPivotToggleProps, {
            instance: Z(),
            header: K
          });
        });
        var me = L(z);
        Q(function() {
          me() && x({
            type: p.resetPivot
          });
        }, [x, H ? null : d]), Object.assign(l, {
          togglePivot: ae
        });
      }
      function eo(l) {
        l.allCells.forEach(function(d) {
          d.isPivoted = d.column.isPivoted;
        });
      }
      var xa = "useRowSelect";
      p.resetSelectedRows = "resetSelectedRows", p.toggleAllRowsSelected = "toggleAllRowsSelected", p.toggleRowSelected = "toggleRowSelected", p.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";
      var to = function(d) {
        d.getToggleRowSelectedProps = [gs], d.getToggleAllRowsSelectedProps = [no], d.getToggleAllPageRowsSelectedProps = [ys], d.stateReducers.push(bs), d.useInstance.push(ws), d.prepareRow.push(_a);
      };
      to.pluginName = xa;
      var gs = function(d, g) {
        var m = g.instance, S = g.row, C = m.manualRowSelectedKey, x = C === void 0 ? "isSelected" : C, F = !1;
        return S.original && S.original[x] ? F = !0 : F = S.isSelected, [d, {
          onChange: function(H) {
            S.toggleRowSelected(H.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: F,
          title: "Toggle Row Selected",
          indeterminate: S.isSomeSelected
        }];
      }, no = function(d, g) {
        var m = g.instance;
        return [d, {
          onChange: function(C) {
            m.toggleAllRowsSelected(C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: m.isAllRowsSelected,
          title: "Toggle All Rows Selected",
          indeterminate: Boolean(!m.isAllRowsSelected && Object.keys(m.state.selectedRowIds).length)
        }];
      }, ys = function(d, g) {
        var m = g.instance;
        return [d, {
          onChange: function(C) {
            m.toggleAllPageRowsSelected(C.target.checked);
          },
          style: {
            cursor: "pointer"
          },
          checked: m.isAllPageRowsSelected,
          title: "Toggle All Current Page Rows Selected",
          indeterminate: Boolean(!m.isAllPageRowsSelected && m.page.some(function(S) {
            var C = S.id;
            return m.state.selectedRowIds[C];
          }))
        }];
      };
      function bs(l, d, g, m) {
        if (d.type === p.init)
          return a({
            selectedRowIds: {}
          }, l);
        if (d.type === p.resetSelectedRows)
          return a({}, l, {
            selectedRowIds: m.initialState.selectedRowIds || {}
          });
        if (d.type === p.toggleAllRowsSelected) {
          var S = d.value, C = m.isAllRowsSelected, x = m.rowsById, F = m.nonGroupedRowsById, z = F === void 0 ? x : F, H = typeof S < "u" ? S : !C, q = Object.assign({}, l.selectedRowIds);
          return H ? Object.keys(z).forEach(function(nt) {
            q[nt] = !0;
          }) : Object.keys(z).forEach(function(nt) {
            delete q[nt];
          }), a({}, l, {
            selectedRowIds: q
          });
        }
        if (d.type === p.toggleRowSelected) {
          var pe = d.id, Z = d.value, ae = m.rowsById, me = m.selectSubRows, K = me === void 0 ? !0 : me, Ne = m.getSubRows, De = l.selectedRowIds[pe], We = typeof Z < "u" ? Z : !De;
          if (De === We)
            return l;
          var we = a({}, l.selectedRowIds), Ze = function nt(qe) {
            var Xe = ae[qe];
            if (Xe && (Xe.isGrouped || (We ? we[qe] = !0 : delete we[qe]), K && Ne(Xe)))
              return Ne(Xe).forEach(function(Et) {
                return nt(Et.id);
              });
          };
          return Ze(pe), a({}, l, {
            selectedRowIds: we
          });
        }
        if (d.type === p.toggleAllPageRowsSelected) {
          var it = d.value, _e = m.page, ye = m.rowsById, Se = m.selectSubRows, Be = Se === void 0 ? !0 : Se, et = m.isAllPageRowsSelected, tt = m.getSubRows, Rt = typeof it < "u" ? it : !et, Me = a({}, l.selectedRowIds), Lt = function nt(qe) {
            var Xe = ye[qe];
            if (Xe.isGrouped || (Rt ? Me[qe] = !0 : delete Me[qe]), Be && tt(Xe))
              return tt(Xe).forEach(function(Et) {
                return nt(Et.id);
              });
          };
          return _e.forEach(function(nt) {
            return Lt(nt.id);
          }), a({}, l, {
            selectedRowIds: Me
          });
        }
        return l;
      }
      function ws(l) {
        var d = l.data, g = l.rows, m = l.getHooks, S = l.plugins, C = l.rowsById, x = l.nonGroupedRowsById, F = x === void 0 ? C : x, z = l.autoResetSelectedRows, H = z === void 0 ? !0 : z, q = l.state.selectedRowIds, pe = l.selectSubRows, Z = pe === void 0 ? !0 : pe, ae = l.dispatch, me = l.page, K = l.getSubRows;
        G(S, ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"], "useRowSelect");
        var Ne = r.useMemo(function() {
          var et = [];
          return g.forEach(function(tt) {
            var Rt = Z ? Sa(tt, q, K) : !!q[tt.id];
            tt.isSelected = !!Rt, tt.isSomeSelected = Rt === null, Rt && et.push(tt);
          }), et;
        }, [g, Z, q, K]), De = Boolean(Object.keys(F).length && Object.keys(q).length), We = De;
        De && Object.keys(F).some(function(et) {
          return !q[et];
        }) && (De = !1), De || me && me.length && me.some(function(et) {
          var tt = et.id;
          return !q[tt];
        }) && (We = !1);
        var we = L(H);
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
        }, [ae]), ye = L(l), Se = k(m().getToggleAllRowsSelectedProps, {
          instance: ye()
        }), Be = k(m().getToggleAllPageRowsSelectedProps, {
          instance: ye()
        });
        Object.assign(l, {
          selectedFlatRows: Ne,
          isAllRowsSelected: De,
          isAllPageRowsSelected: We,
          toggleRowSelected: _e,
          toggleAllRowsSelected: Ze,
          getToggleAllRowsSelectedProps: Se,
          getToggleAllPageRowsSelectedProps: Be,
          toggleAllPageRowsSelected: it
        });
      }
      function _a(l, d) {
        var g = d.instance;
        l.toggleRowSelected = function(m) {
          return g.toggleRowSelected(l.id, m);
        }, l.getToggleRowSelectedProps = k(g.getHooks().getToggleRowSelectedProps, {
          instance: g,
          row: l
        });
      }
      function Sa(l, d, g) {
        if (d[l.id])
          return !0;
        var m = g(l);
        if (m && m.length) {
          var S = !0, C = !1;
          return m.forEach(function(x) {
            C && !S || (Sa(x, d, g) ? C = !0 : S = !1);
          }), S ? !0 : C ? null : !1;
        }
        return !1;
      }
      var Ra = function(d) {
        return {};
      }, Ca = function(d) {
        return {};
      };
      p.setRowState = "setRowState", p.setCellState = "setCellState", p.resetRowState = "resetRowState";
      var Na = function(d) {
        d.stateReducers.push(ro), d.useInstance.push(s), d.prepareRow.push(v);
      };
      Na.pluginName = "useRowState";
      function ro(l, d, g, m) {
        var S = m.initialRowStateAccessor, C = S === void 0 ? Ra : S, x = m.initialCellStateAccessor, F = x === void 0 ? Ca : x, z = m.rowsById;
        if (d.type === p.init)
          return a({
            rowState: {}
          }, l);
        if (d.type === p.resetRowState)
          return a({}, l, {
            rowState: m.initialState.rowState || {}
          });
        if (d.type === p.setRowState) {
          var H, q = d.rowId, pe = d.value, Z = typeof l.rowState[q] < "u" ? l.rowState[q] : C(z[q]);
          return a({}, l, {
            rowState: a({}, l.rowState, (H = {}, H[q] = M(pe, Z), H))
          });
        }
        if (d.type === p.setCellState) {
          var ae, me, K, Ne, De, We = d.rowId, we = d.columnId, Ze = d.value, it = typeof l.rowState[We] < "u" ? l.rowState[We] : C(z[We]), _e = typeof (it == null || (ae = it.cellState) == null ? void 0 : ae[we]) < "u" ? it.cellState[we] : F((me = z[We]) == null || (K = me.cells) == null ? void 0 : K.find(function(ye) {
            return ye.column.id === we;
          }));
          return a({}, l, {
            rowState: a({}, l.rowState, (De = {}, De[We] = a({}, it, {
              cellState: a({}, it.cellState || {}, (Ne = {}, Ne[we] = M(Ze, _e), Ne))
            }), De))
          });
        }
      }
      function s(l) {
        var d = l.autoResetRowState, g = d === void 0 ? !0 : d, m = l.data, S = l.dispatch, C = r.useCallback(function(z, H) {
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
        }, [S]), F = L(g);
        Q(function() {
          F() && S({
            type: p.resetRowState
          });
        }, [m]), Object.assign(l, {
          setRowState: C,
          setCellState: x
        });
      }
      function v(l, d) {
        var g = d.instance, m = g.initialRowStateAccessor, S = m === void 0 ? Ra : m, C = g.initialCellStateAccessor, x = C === void 0 ? Ca : C, F = g.state.rowState;
        l && (l.state = typeof F[l.id] < "u" ? F[l.id] : S(l), l.setState = function(z) {
          return g.setRowState(l.id, z);
        }, l.cells.forEach(function(z) {
          l.state.cellState || (l.state.cellState = {}), z.state = typeof l.state.cellState[z.column.id] < "u" ? l.state.cellState[z.column.id] : x(z), z.setState = function(H) {
            return g.setCellState(l.id, z.column.id, H);
          };
        }));
      }
      p.resetColumnOrder = "resetColumnOrder", p.setColumnOrder = "setColumnOrder";
      var y = function(d) {
        d.stateReducers.push(b), d.visibleColumnsDeps.push(function(g, m) {
          var S = m.instance;
          return [].concat(g, [S.state.columnOrder]);
        }), d.visibleColumns.push(E), d.useInstance.push(R);
      };
      y.pluginName = "useColumnOrder";
      function b(l, d, g, m) {
        if (d.type === p.init)
          return a({
            columnOrder: []
          }, l);
        if (d.type === p.resetColumnOrder)
          return a({}, l, {
            columnOrder: m.initialState.columnOrder || []
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
        for (var m = [].concat(g), S = [].concat(l), C = [], x = function() {
          var z = m.shift(), H = S.findIndex(function(q) {
            return q.id === z;
          });
          H > -1 && C.push(S.splice(H, 1)[0]);
        }; S.length && m.length; )
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
        }), d.stateReducers.push(W), d.useInstance.push(se), d.useInstanceBeforeDimensions.push(V);
      }, j = function(d, g) {
        var m = g.instance, S = g.header, C = m.dispatch, x = function(z, H) {
          var q = !1;
          if (z.type === "touchstart") {
            if (z.touches && z.touches.length > 1)
              return;
            q = !0;
          }
          var pe = ie(H), Z = pe.map(function(_e) {
            return [_e.id, _e.totalWidth];
          }), ae = q ? Math.round(z.touches[0].clientX) : z.clientX, me, K, Ne = function() {
            window.cancelAnimationFrame(me), me = null, C({
              type: p.columnDoneResizing
            });
          }, De = function() {
            window.cancelAnimationFrame(me), me = null, C({
              type: p.columnResizing,
              clientX: K
            });
          }, We = function(ye) {
            K = ye, me || (me = window.requestAnimationFrame(De));
          }, we = {
            mouse: {
              moveEvent: "mousemove",
              moveHandler: function(ye) {
                return We(ye.clientX);
              },
              upEvent: "mouseup",
              upHandler: function(ye) {
                document.removeEventListener("mousemove", we.mouse.moveHandler), document.removeEventListener("mouseup", we.mouse.upHandler), Ne();
              }
            },
            touch: {
              moveEvent: "touchmove",
              moveHandler: function(ye) {
                return ye.cancelable && (ye.preventDefault(), ye.stopPropagation()), We(ye.touches[0].clientX), !1;
              },
              upEvent: "touchend",
              upHandler: function(ye) {
                document.removeEventListener(we.touch.moveEvent, we.touch.moveHandler), document.removeEventListener(we.touch.upEvent, we.touch.moveHandler), Ne();
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
          var g = d.clientX, m = d.columnId, S = d.columnWidth, C = d.headerIdWidths;
          return a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              startX: g,
              headerIdWidths: C,
              columnWidth: S,
              isResizingColumn: m
            })
          });
        }
        if (d.type === p.columnResizing) {
          var x = d.clientX, F = l.columnResizing, z = F.startX, H = F.columnWidth, q = F.headerIdWidths, pe = q === void 0 ? [] : q, Z = x - z, ae = Z / H, me = {};
          return pe.forEach(function(K) {
            var Ne = K[0], De = K[1];
            me[Ne] = Math.max(De + De * ae, 0);
          }), a({}, l, {
            columnResizing: a({}, l.columnResizing, {
              columnWidths: a({}, l.columnResizing.columnWidths, {}, me)
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
      var V = function(d) {
        var g = d.flatHeaders, m = d.disableResizing, S = d.getHooks, C = d.state.columnResizing, x = L(d);
        g.forEach(function(F) {
          var z = Pe(F.disableResizing === !0 ? !1 : void 0, m === !0 ? !1 : void 0, !0);
          F.canResize = z, F.width = C.columnWidths[F.id] || F.originalWidth || F.width, F.isResizing = C.isResizingColumn === F.id, z && (F.getResizerProps = k(S().getResizerProps, {
            instance: x(),
            header: F
          }));
        });
      };
      function se(l) {
        var d = l.plugins, g = l.dispatch, m = l.autoResetResize, S = m === void 0 ? !0 : m, C = l.columns;
        G(d, ["useAbsoluteLayout"], "useResizeColumns");
        var x = L(S);
        Q(function() {
          x() && g({
            type: p.resetResize
          });
        }, [C]);
        var F = r.useCallback(function() {
          return g({
            type: p.resetResize
          });
        }, [g]);
        Object.assign(l, {
          resetResizing: F
        });
      }
      function ie(l) {
        var d = [], g = function m(S) {
          S.columns && S.columns.length && S.columns.map(m), d.push(S);
        };
        return g(l), d;
      }
      var oe = {
        position: "absolute",
        top: 0
      }, Y = function(d) {
        d.getTableBodyProps.push(ne), d.getRowProps.push(ne), d.getHeaderGroupProps.push(ne), d.getFooterGroupProps.push(ne), d.getHeaderProps.push(function(g, m) {
          var S = m.column;
          return [g, {
            style: a({}, oe, {
              left: S.totalLeft + "px",
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(g, m) {
          var S = m.cell;
          return [g, {
            style: a({}, oe, {
              left: S.column.totalLeft + "px",
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(g, m) {
          var S = m.column;
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
        var m = g.instance;
        return [d, {
          style: {
            position: "relative",
            width: m.totalColumnsWidth + "px"
          }
        }];
      }, ge = {
        display: "inline-block",
        boxSizing: "border-box"
      }, xe = function(d, g) {
        var m = g.instance;
        return [d, {
          style: {
            display: "flex",
            width: m.totalColumnsWidth + "px"
          }
        }];
      }, Fe = function(d) {
        d.getRowProps.push(xe), d.getHeaderGroupProps.push(xe), d.getFooterGroupProps.push(xe), d.getHeaderProps.push(function(g, m) {
          var S = m.column;
          return [g, {
            style: a({}, ge, {
              width: S.totalWidth + "px"
            })
          }];
        }), d.getCellProps.push(function(g, m) {
          var S = m.cell;
          return [g, {
            style: a({}, ge, {
              width: S.column.totalWidth + "px"
            })
          }];
        }), d.getFooterProps.push(function(g, m) {
          var S = m.column;
          return [g, {
            style: a({}, ge, {
              width: S.totalWidth + "px"
            })
          }];
        });
      };
      Fe.pluginName = "useBlockLayout";
      function Je(l) {
        l.getTableProps.push($e), l.getRowProps.push(le), l.getHeaderGroupProps.push(le), l.getFooterGroupProps.push(le), l.getHeaderProps.push(Qe), l.getCellProps.push(Ee), l.getFooterProps.push(Ye);
      }
      Je.pluginName = "useFlexLayout";
      var $e = function(d, g) {
        var m = g.instance;
        return [d, {
          style: {
            minWidth: m.totalColumnsMinWidth + "px"
          }
        }];
      }, le = function(d, g) {
        var m = g.instance;
        return [d, {
          style: {
            display: "flex",
            flex: "1 0 auto",
            minWidth: m.totalColumnsMinWidth + "px"
          }
        }];
      }, Qe = function(d, g) {
        var m = g.column;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: m.totalFlexWidth ? m.totalFlexWidth + " 0 auto" : void 0,
            minWidth: m.totalMinWidth + "px",
            width: m.totalWidth + "px"
          }
        }];
      }, Ee = function(d, g) {
        var m = g.cell;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: m.column.totalFlexWidth + " 0 auto",
            minWidth: m.column.totalMinWidth + "px",
            width: m.column.totalWidth + "px"
          }
        }];
      }, Ye = function(d, g) {
        var m = g.column;
        return [d, {
          style: {
            boxSizing: "border-box",
            flex: m.totalFlexWidth ? m.totalFlexWidth + " 0 auto" : void 0,
            minWidth: m.totalMinWidth + "px",
            width: m.totalWidth + "px"
          }
        }];
      };
      p.columnStartResizing = "columnStartResizing", p.columnResizing = "columnResizing", p.columnDoneResizing = "columnDoneResizing", p.resetResize = "resetResize";
      function ft(l) {
        l.stateReducers.push(Ke), l.getTableProps.push(je), l.getHeaderProps.push(Ue), l.getRowProps.push(bt);
      }
      ft.pluginName = "useGridLayout";
      var je = function(d, g) {
        var m = g.instance, S = m.visibleColumns.map(function(C) {
          var x;
          return m.state.gridLayout.columnWidths[C.id] ? m.state.gridLayout.columnWidths[C.id] + "px" : (x = m.state.columnResizing) != null && x.isResizingColumn ? m.state.gridLayout.startWidths[C.id] + "px" : typeof C.width == "number" ? C.width + "px" : C.width;
        });
        return [d, {
          style: {
            display: "grid",
            gridTemplateColumns: S.join(" ")
          }
        }];
      }, Ue = function(d, g) {
        var m = g.column;
        return [d, {
          id: "header-cell-" + m.id,
          style: {
            position: "sticky",
            gridColumn: "span " + m.totalVisibleHeaderCount
          }
        }];
      }, bt = function(d, g) {
        var m = g.row;
        return m.isExpanded ? [d, {
          style: {
            gridColumn: "1 / " + (m.cells.length + 1)
          }
        }] : [d, {}];
      };
      function Ke(l, d, g, m) {
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
          var S = d.columnId, C = d.headerIdWidths, x = mt(S);
          if (x !== void 0) {
            var F = m.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = mt(ye.id), Se));
            }, {}), z = m.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.minWidth, Se));
            }, {}), H = m.visibleColumns.reduce(function(_e, ye) {
              var Se;
              return a({}, _e, (Se = {}, Se[ye.id] = ye.maxWidth, Se));
            }, {}), q = C.map(function(_e) {
              var ye = _e[0];
              return [ye, mt(ye)];
            });
            return a({}, l, {
              gridLayout: a({}, l.gridLayout, {
                startWidths: F,
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
          var pe = d.clientX, Z = l.columnResizing.startX, ae = l.gridLayout, me = ae.columnWidth, K = ae.minWidths, Ne = ae.maxWidths, De = ae.headerIdGridWidths, We = De === void 0 ? [] : De, we = pe - Z, Ze = we / me, it = {};
          return We.forEach(function(_e) {
            var ye = _e[0], Se = _e[1];
            it[ye] = Math.min(Math.max(K[ye], Se + Se * Ze), Ne[ye]);
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
      function mt(l) {
        var d, g = (d = document.getElementById("header-cell-" + l)) == null ? void 0 : d.offsetWidth;
        if (g !== void 0)
          return g;
      }
      n._UNSTABLE_usePivotColumns = ga, n.actions = p, n.defaultColumn = _, n.defaultGroupByFn = sa, n.defaultOrderByFn = Qi, n.defaultRenderer = w, n.emptyRenderer = N, n.ensurePluginOrder = G, n.flexRender = re, n.functionalUpdate = M, n.loopHooks = T, n.makePropGetter = k, n.makeRenderer = ve, n.reduceHooks = $, n.safeUseLayoutEffect = te, n.useAbsoluteLayout = Y, n.useAsyncDebounce = fe, n.useBlockLayout = Fe, n.useColumnOrder = y, n.useExpanded = $n, n.useFilters = Ot, n.useFlexLayout = Je, n.useGetLatest = L, n.useGlobalFilter = Wr, n.useGridLayout = ft, n.useGroupBy = Xi, n.useMountedLayoutEffect = Q, n.usePagination = ma, n.useResizeColumns = A, n.useRowSelect = to, n.useRowState = Na, n.useSortBy = da, n.useTable = kn, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  }(Ga, Ga.exports)), Ga.exports;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = EN() : e.exports = MN();
})(No);
const ON = "_tableFilterContainer_1asr9_10", AN = "_pagination_1asr9_42", kN = "_icon_1asr9_59", FN = "_alignRight_1asr9_133", xi = {
  tableFilterContainer: ON,
  pagination: AN,
  icon: kN,
  alignRight: FN
}, fc = (e) => /* @__PURE__ */ Tt.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Tt.createElement("path", {
  d: "M11.5 6H0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Tt.createElement("path", {
  d: "M7.5 10L11.5 6L7.5 2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
var Bt = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Table/DataTable.tsx";
const $N = ({
  filterValue: e,
  setFilter: t,
  preFilteredRows: n,
  id: r,
  filterData: i
}) => {
  Vt(() => {
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
    fileName: Bt,
    lineNumber: 28,
    columnNumber: 7
  }, void 0));
  return /* @__PURE__ */ B("ul", {
    children: o
  }, void 0, !1, {
    fileName: Bt,
    lineNumber: 42,
    columnNumber: 5
  }, void 0);
}, IT = ({
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
    pageCount: N,
    nextPage: _,
    previousPage: P,
    state: {
      pageIndex: I
    },
    preGlobalFilteredRows: k,
    setGlobalFilter: $
  } = No.exports.useTable({
    columns: n,
    data: r
  }, No.exports.useFilters, No.exports.useGlobalFilter, No.exports.usePagination);
  return /* @__PURE__ */ B(Ln, {
    children: [/* @__PURE__ */ B("div", {
      className: xi.tableFilterContainer,
      children: [/* @__PURE__ */ B("h3", {
        children: ["  ", 1, "-", N, " of ", r.length, " ", e, " "]
      }, void 0, !0, {
        fileName: Bt,
        lineNumber: 75,
        columnNumber: 11
      }, void 0), /* @__PURE__ */ B("ul", {
        children: /* @__PURE__ */ B($N, {
          filterValue: void 0,
          setFilter: $,
          preFilteredRows: k,
          id: "type",
          filterData: t
        }, void 0, !1, {
          fileName: Bt,
          lineNumber: 77,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: Bt,
        lineNumber: 76,
        columnNumber: 11
      }, void 0)]
    }, void 0, !0, {
      fileName: Bt,
      lineNumber: 74,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("div", {
      children: /* @__PURE__ */ B("table", {
        ...o(),
        children: [/* @__PURE__ */ B("thead", {
          children: u.map((T) => /* @__PURE__ */ B("tr", {
            ...T.getHeaderGroupProps(),
            children: T.headers.map((G, M) => /* @__PURE__ */ B("th", {
              className: i - 1 === M ? xi.alignRight : "",
              ...G.getHeaderProps(),
              children: G.render("Header")
            }, void 0, !1, {
              fileName: Bt,
              lineNumber: 92,
              columnNumber: 19
            }, void 0))
          }, void 0, !1, {
            fileName: Bt,
            lineNumber: 90,
            columnNumber: 15
          }, void 0))
        }, void 0, !1, {
          fileName: Bt,
          lineNumber: 88,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ B("tbody", {
          ...a(),
          children: c.map((T, G) => (f(T), /* @__PURE__ */ B("tr", {
            ...T.getRowProps(),
            children: T.cells.map((M, L) => /* @__PURE__ */ B("td", {
              className: i - 1 === L ? xi.alignRight : "",
              ...M.getCellProps(),
              children: M.render("Cell")
            }, void 0, !1, {
              fileName: Bt,
              lineNumber: 103,
              columnNumber: 28
            }, void 0))
          }, void 0, !1, {
            fileName: Bt,
            lineNumber: 101,
            columnNumber: 17
          }, void 0)))
        }, void 0, !1, {
          fileName: Bt,
          lineNumber: 97,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: Bt,
        lineNumber: 87,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: Bt,
      lineNumber: 86,
      columnNumber: 9
    }, void 0), /* @__PURE__ */ B("div", {
      className: xi.pagination,
      children: [/* @__PURE__ */ B("span", {
        children: ["Page", " ", /* @__PURE__ */ B("strong", {
          children: [I + 1, " of ", w.length]
        }, void 0, !0, {
          fileName: Bt,
          lineNumber: 114,
          columnNumber: 13
        }, void 0), " "]
      }, void 0, !0, {
        fileName: Bt,
        lineNumber: 112,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("span", {
        children: [/* @__PURE__ */ B("button", {
          onClick: () => P(),
          disabled: !h,
          children: /* @__PURE__ */ B(fc, {
            className: `${xi.icon}`
          }, void 0, !1, {
            fileName: Bt,
            lineNumber: 120,
            columnNumber: 11
          }, void 0)
        }, void 0, !1, {
          fileName: Bt,
          lineNumber: 119,
          columnNumber: 11
        }, void 0), /* @__PURE__ */ B("button", {
          onClick: () => _(),
          disabled: !p,
          children: /* @__PURE__ */ B(fc, {
            className: `${xi.icon}`
          }, void 0, !1, {
            fileName: Bt,
            lineNumber: 123,
            columnNumber: 13
          }, void 0)
        }, void 0, !1, {
          fileName: Bt,
          lineNumber: 122,
          columnNumber: 11
        }, void 0)]
      }, void 0, !0, {
        fileName: Bt,
        lineNumber: 118,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Bt,
      lineNumber: 111,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0);
}, BN = "_text_1miab_10", IN = "_xs_1miab_18", DN = "_sm_1miab_22", LN = "_md_1miab_26", zN = "_lg_1miab_30", ih = {
  text: BN,
  xs: IN,
  sm: DN,
  md: LN,
  lg: zN
};
var GN = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Display/Display.tsx";
const DT = ({
  children: e,
  large: t = !0,
  ...n
}) => {
  const i = Object.entries({
    extraSmall: "xs",
    small: "sm",
    medium: "md"
  }).reduce((w, [N, _]) => n[N] ? _ : w, "lg"), o = n.className || "", {
    extraSmall: a,
    small: u,
    medium: f,
    large: c,
    ...h
  } = n, p = `${ih[i]} ${ih.text} ${o}`;
  return /* @__PURE__ */ B("h1", {
    ...h,
    className: p,
    children: e
  }, void 0, !1, {
    fileName: GN,
    lineNumber: 36,
    columnNumber: 12
  }, void 0);
}, jN = "_h1_15tfg_10", HN = "_h2_15tfg_10", WN = "_h3_15tfg_10", VN = "_h4_15tfg_10", UN = "_h5_15tfg_10", qN = "_h6_15tfg_10", YN = "_uppercase_15tfg_42", XN = {
  h1: jN,
  h2: HN,
  h3: WN,
  h4: VN,
  h5: UN,
  h6: qN,
  uppercase: YN
};
var KN = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Heading/Heading.tsx";
const QN = ({
  children: e,
  as: t = "h1",
  className: n,
  ...r
}) => {
  const i = t || "h1", o = `${XN[t]} ${n || ""}`;
  return /* @__PURE__ */ B(i, {
    ...r,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: KN,
    lineNumber: 17,
    columnNumber: 12
  }, void 0);
}, ZN = "_text_1v24t_10", JN = "_prominent_1v24t_17", eP = "_xxl_1v24t_21", tP = "_xl_1v24t_25", nP = "_lg_1v24t_29", rP = "_md_1v24t_33", iP = "_sm_1v24t_37", oP = "_xs_1v24t_41", ll = {
  text: ZN,
  prominent: JN,
  xxl: eP,
  xl: tP,
  lg: nP,
  md: rP,
  sm: iP,
  xs: oP
};
var aP = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Text/Text.tsx";
const dc = ({
  children: e,
  size: t = "sm",
  as: n = "span",
  prominent: r = !1,
  ...i
}) => {
  const o = `${ll[t]} ${ll.text} ${r ? ll.prominent : ""} ${i.className || ""}`;
  return /* @__PURE__ */ B(n || "span", {
    ...i,
    className: o,
    children: e
  }, void 0, !1, {
    fileName: aP,
    lineNumber: 15,
    columnNumber: 12
  }, void 0);
}, uP = "_outerContainer_e6ykc_1", sP = "_container_e6ykc_12", lP = "_navbar_e6ykc_25", cP = "_fade_e6ykc_35", fP = "_active_e6ykc_48", dP = "_navbarFixed_e6ykc_60", pP = "_fixed_e6ykc_70", hP = "_fluidity_e6ykc_83", Er = {
  outerContainer: uP,
  container: sP,
  navbar: lP,
  fade: cP,
  active: fP,
  navbarFixed: dP,
  fixed: pP,
  fluidity: hP
}, Bg = () => {
  const [e, t] = yn.useState(window.innerWidth);
  return yn.useEffect(() => {
    const n = () => t(window.innerWidth);
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), { width: e };
};
var Wt = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/NavBar/NavBar.tsx";
const LT = ({
  logo: e,
  text: t,
  button: n,
  navLinks: r
}) => {
  const [i, o] = Lr(!1), a = () => {
    o(!i);
  }, {
    width: u
  } = Bg(), f = 700, c = r.map((h) => /* @__PURE__ */ B("li", {
    children: [/* @__PURE__ */ B("a", {
      href: `/${h.name.replace(/\s+/g, "")}`,
      className: window.location.pathname.toString() === `/${h.name.replace(/\s+/g, "")}` ? Er.active : "",
      children: h.name.toUpperCase()
    }, void 0, !1, {
      fileName: Wt,
      lineNumber: 48,
      columnNumber: 7
    }, void 0), h.modal && /* @__PURE__ */ B("button", {
      onClick: () => {
      },
      children: /* @__PURE__ */ B("img", {
        src: "./src/assets/images/triangleDown.svg",
        alt: "open resource options"
      }, void 0, !1, {
        fileName: Wt,
        lineNumber: 61,
        columnNumber: 11
      }, void 0)
    }, void 0, !1, {
      fileName: Wt,
      lineNumber: 60,
      columnNumber: 9
    }, void 0)]
  }, void 0, !0, {
    fileName: Wt,
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
        fileName: Wt,
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
                fileName: Wt,
                lineNumber: 80,
                columnNumber: 17
              }, void 0)
            }, void 0, !1, {
              fileName: Wt,
              lineNumber: 78,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Wt,
            lineNumber: 77,
            columnNumber: 13
          }, void 0), /* @__PURE__ */ B(AP, {
            version: n.version,
            type: n.type,
            size: u < f ? "small" : "medium",
            handleClick: n.handleClick,
            children: n.children
          }, void 0, !1, {
            fileName: Wt,
            lineNumber: 84,
            columnNumber: 13
          }, void 0)]
        }, void 0, !0, {
          fileName: Wt,
          lineNumber: 76,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Wt,
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
              fileName: Wt,
              lineNumber: 97,
              columnNumber: 15
            }, void 0)
          }, void 0, !1, {
            fileName: Wt,
            lineNumber: 96,
            columnNumber: 13
          }, void 0), i && /* @__PURE__ */ B(VP, {
            handleModal: a,
            navLinks: mP
          }, void 0, !1, {
            fileName: Wt,
            lineNumber: 100,
            columnNumber: 15
          }, void 0)]
        }, void 0, !0, {
          fileName: Wt,
          lineNumber: 95,
          columnNumber: 11
        }, void 0)
      }, void 0, !1, {
        fileName: Wt,
        lineNumber: 94,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Wt,
      lineNumber: 72,
      columnNumber: 7
    }, void 0)
  }, void 0, !1, {
    fileName: Wt,
    lineNumber: 71,
    columnNumber: 5
  }, void 0);
}, mP = [{
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
}], vP = (e) => /* @__PURE__ */ Tt.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Tt.createElement("path", {
  d: "M6 11.5L6 0.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Tt.createElement("path", {
  d: "M10 7.5L6 11.5L2 7.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), gP = "_button_yxs81_10", yP = "_icon_yxs81_26", bP = "_text_yxs81_30", cl = {
  button: gP,
  icon: yP,
  text: bP
};
var fl = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/AnchorButton/AnchorButton.tsx";
const wP = ({
  children: e,
  disabled: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ B("button", {
    className: `${cl.button} ${i}`,
    disabled: t,
    ...r,
    children: [/* @__PURE__ */ B(vP, {
      className: cl.icon
    }, void 0, !1, {
      fileName: fl,
      lineNumber: 17,
      columnNumber: 7
    }, void 0), " ", /* @__PURE__ */ B("div", {
      className: cl.text,
      children: e
    }, void 0, !1, {
      fileName: fl,
      lineNumber: 18,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0, {
    fileName: fl,
    lineNumber: 16,
    columnNumber: 5
  }, void 0);
}, xP = (e) => /* @__PURE__ */ Tt.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Tt.createElement("path", {
  d: "M9.5 5.5V2.5H6.5",
  stroke: "white",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Tt.createElement("path", {
  d: "M5.5 9.48626L2.5 9.5V6.5",
  stroke: "white",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), _P = "_dropdown_1eeql_10", SP = {
  dropdown: _P
};
var dl = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/ChainSelectorButton/ChainSelectorButton.tsx";
const zT = ({
  chain: e,
  className: t,
  onClick: n,
  ...r
}) => {
  const i = t || "";
  return /* @__PURE__ */ B("button", {
    onClick: n,
    className: `${SP.dropdown} ${i}`,
    ...r,
    children: [e.icon, /* @__PURE__ */ B(dc, {
      size: "lg",
      prominent: !0,
      children: e.name
    }, void 0, !1, {
      fileName: dl,
      lineNumber: 32,
      columnNumber: 7
    }, void 0), /* @__PURE__ */ B(xP, {}, void 0, !1, {
      fileName: dl,
      lineNumber: 38,
      columnNumber: 7
    }, void 0)]
  }, void 0, !0, {
    fileName: dl,
    lineNumber: 30,
    columnNumber: 5
  }, void 0);
}, RP = "_option_gssgp_10", CP = "_optionSelected_gssgp_10", oh = {
  option: RP,
  optionSelected: CP
};
var ah = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/FilterButton/FilterButton.tsx";
const NP = ({
  option: e,
  handleFilter: t,
  setOptions: n,
  options: r,
  disabled: i,
  className: o,
  ...a
}) => {
  const u = o || "", f = e.name.includes("any") ? "ANY" : e.name;
  return /* @__PURE__ */ B(Ln, {
    children: e.selected ? /* @__PURE__ */ B("button", {
      className: `${oh.optionSelected} ${u}`,
      onClick: () => t(e, n, r),
      ...a,
      children: f
    }, void 0, !1, {
      fileName: ah,
      lineNumber: 43,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ B("button", {
      className: `${oh.option} ${u}`,
      onClick: () => i !== !0 && t(e, n, r),
      disabled: i,
      ...a,
      children: f
    }, void 0, !1, {
      fileName: ah,
      lineNumber: 51,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, PP = "_small_tq4rf_18", TP = "_medium_tq4rf_28", EP = "_large_tq4rf_38", MP = "_primary_tq4rf_48", OP = "_secondary_tq4rf_72", Kr = {
  small: PP,
  medium: TP,
  large: EP,
  primary: MP,
  secondary: OP
};
var wo = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/GeneralButton/GeneralButton.tsx";
const AP = ({
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
  return /* @__PURE__ */ B(Ln, {
    children: t === "primary" && n === "text" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Kr.primary} ${Kr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 32,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon before" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Kr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 41,
      columnNumber: 9
    }, void 0) : t === "primary" && n === "icon after" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Kr.primary} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 50,
      columnNumber: 9
    }, void 0) : n === "icon only" ? /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Kr.iconOnly} ${f}`,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 59,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ B("button", {
      onClick: i,
      className: `${Kr.secondary} ${Kr[r]} ${f}`,
      disabled: o,
      ...u,
      children: e
    }, void 0, !1, {
      fileName: wo,
      lineNumber: 68,
      columnNumber: 9
    }, void 0)
  }, void 0, !1);
}, kP = (e) => /* @__PURE__ */ Tt.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Tt.createElement("path", {
  d: "M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Tt.createElement("path", {
  d: "M6.5 0.5H11.5V5.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /* @__PURE__ */ Tt.createElement("path", {
  d: "M11.5 0.5L5.5 6.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), FP = "_button_1cp3n_10", $P = "_icon_1cp3n_24", BP = "_text_1cp3n_32", IP = "_small_1cp3n_62", DP = "_medium_1cp3n_71", LP = "_large_1cp3n_80", xo = {
  button: FP,
  icon: $P,
  text: BP,
  small: IP,
  medium: DP,
  large: LP
};
var ja = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/LinkButton/LinkButton.tsx";
const Ig = ({
  children: e,
  size: t,
  type: n,
  handleClick: r,
  className: i,
  ...o
}) => {
  const a = i || "";
  return /* @__PURE__ */ B("button", {
    className: `${xo.button} ${a}`,
    onClick: r,
    ...o,
    children: [/* @__PURE__ */ B("div", {
      className: `${xo.text} ${xo[t]}`,
      children: e
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 34,
      columnNumber: 7
    }, void 0), n === "internal" ? /* @__PURE__ */ B(fc, {
      className: `${xo.icon} ${a}`
    }, void 0, !1, {
      fileName: ja,
      lineNumber: 39,
      columnNumber: 13
    }, void 0) : /* @__PURE__ */ B(kP, {
      className: `${xo.icon} ${a}`
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
}, zP = "_button_19s6y_10", GP = "_small_19s6y_56", uh = {
  button: zP,
  default: "_default_19s6y_49",
  small: GP
};
var jP = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/TabButton/TabButton.tsx";
const GT = ({
  children: e,
  size: t,
  className: n,
  ...r
}) => {
  const i = n || "";
  return /* @__PURE__ */ B("button", {
    className: `${uh.button} ${uh[t]} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: jP,
    lineNumber: 18,
    columnNumber: 5
  }, void 0);
}, HP = "_container_1cljs_1", WP = "_socials_1cljs_21", sh = {
  container: HP,
  socials: WP
};
var Mr = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/NavBarModal/NavBarModal.tsx";
const VP = ({
  handleModal: e,
  navLinks: t
}) => /* @__PURE__ */ B("div", {
  className: sh.container,
  children: [t.map((n) => /* @__PURE__ */ B("h4", {
    children: /* @__PURE__ */ B("a", {
      onClick: () => e(),
      href: `/resources#${n.children}`,
      children: /* @__PURE__ */ B(Ig, {
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
    className: sh.socials,
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
}, void 0), UP = "_container_gvtd2_10", qP = {
  container: UP
};
var Ha = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Navigation/Navigation.tsx";
const jT = ({
  pageLocations: e,
  page: t
}) => /* @__PURE__ */ B("div", {
  className: qP.container,
  children: e.map((n, r) => /* @__PURE__ */ B("h4", {
    children: /* @__PURE__ */ B("a", {
      href: `/${t}#${n.replace(/\s/g, "")}`,
      children: /* @__PURE__ */ B(wP, {
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
}, void 0), YP = "_grid_fk9zm_10", XP = "_left_fk9zm_23", KP = "_right_fk9zm_23", pl = {
  grid: YP,
  left: XP,
  right: KP
};
var hl = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/ReusableGrid/ReusableGrid.tsx";
const HT = ({
  left: e,
  right: t
}) => /* @__PURE__ */ B("div", {
  className: pl.grid,
  children: [/* @__PURE__ */ B("div", {
    className: pl.left,
    children: e
  }, void 0, !1, {
    fileName: hl,
    lineNumber: 11,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("div", {
    className: pl.right,
    children: t
  }, void 0, !1, {
    fileName: hl,
    lineNumber: 12,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: hl,
  lineNumber: 10,
  columnNumber: 5
}, void 0), QP = "_options_gf7vd_1", lh = {
  options: QP
};
var Wa = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Filter/FilterCriteria/FilterCriteria.tsx";
const WT = ({
  children: e,
  options: t,
  handleFilter: n,
  setOptions: r
}) => /* @__PURE__ */ B("div", {
  className: lh.container,
  children: [/* @__PURE__ */ B("h5", {
    children: e
  }, void 0, !1, {
    fileName: Wa,
    lineNumber: 32,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("div", {
    className: lh.options,
    children: t.map((i, o) => /* @__PURE__ */ B(NP, {
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
var gu = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Tab/Tab.tsx";
const VT = ({
  leading: e,
  children: t,
  active: n
}) => /* @__PURE__ */ B(Ln, {
  children: /* @__PURE__ */ B("ul", {
    children: /* @__PURE__ */ B("li", {}, void 0, !1, {
      fileName: gu,
      lineNumber: 19,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: gu,
    lineNumber: 18,
    columnNumber: 9
  }, void 0)
}, void 0, !1), UT = () => /* @__PURE__ */ B(Ln, {
  children: /* @__PURE__ */ B("ul", {
    children: /* @__PURE__ */ B("li", {}, void 0, !1, {
      fileName: gu,
      lineNumber: 29,
      columnNumber: 13
    }, void 0)
  }, void 0, !1, {
    fileName: gu,
    lineNumber: 28,
    columnNumber: 9
  }, void 0)
}, void 0, !1), ZP = "_reverse_1oj07_10", JP = "_row_1oj07_14", ch = {
  reverse: ZP,
  row: JP
};
var eT = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Row/Row.tsx";
const qT = ({
  children: e,
  className: t,
  reverse: n,
  ...r
}) => {
  const i = t || "";
  return /* @__PURE__ */ B("div", {
    className: `${ch.row} ${n && ch.reverse} ${i}`,
    ...r,
    children: e
  }, void 0, !1, {
    fileName: eT,
    lineNumber: 22,
    columnNumber: 5
  }, void 0);
}, tT = "_desktop_qcyjs_11", nT = {
  desktop: tT
};
var rT = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/DesktopOnly/DesktopOnly.tsx";
const YT = ({
  children: e,
  className: t,
  ...n
}) => {
  const r = t || "";
  return /* @__PURE__ */ B("div", {
    className: `${nT.desktop} ${r}`,
    ...n,
    children: e
  }, void 0, !1, {
    fileName: rT,
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
}, iT = "_card_1wp2d_17", oT = "_heading_1wp2d_21", aT = "_gray_1wp2d_24", uT = "_transparent_1wp2d_27", sT = "_box_1wp2d_31", lT = "_holobox_1wp2d_34", cT = "_rounded_1wp2d_39", ml = {
  card: iT,
  heading: oT,
  gray: aT,
  transparent: uT,
  box: sT,
  holobox: lT,
  rounded: cT
};
var fT = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Card/Card.tsx";
const fh = ({
  component: e,
  rounded: t,
  className: n,
  children: r,
  type: i,
  ...o
}) => {
  const a = n || "", u = e || "div", f = ml[i || "gray"];
  return /* @__PURE__ */ B(u, {
    className: `${ml.card} ${f} ${t && ml.rounded} ${a}`,
    ...o,
    children: r
  }, void 0, !1, {
    fileName: fT,
    lineNumber: 21,
    columnNumber: 5
  }, void 0);
}, dT = "_container_1kdud_10", pT = "_content_1kdud_16", dh = {
  container: dT,
  content: pT
};
var ph = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/ManualCarousel/ManualCarousel.tsx";
const XT = ({
  children: e
}) => /* @__PURE__ */ B("div", {
  className: dh.container,
  children: /* @__PURE__ */ B("div", {
    className: dh.content,
    children: e
  }, void 0, !1, {
    fileName: ph,
    lineNumber: 20,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: ph,
  lineNumber: 19,
  columnNumber: 5
}, void 0), hT = "_winnersRight_13qvw_10", mT = "_winnersLeft_13qvw_10", vT = "_winnersRightLine_13qvw_23", gT = "_scrollRight_13qvw_1", yT = "_winnersLeftLine_13qvw_54", bT = "_scrollLeft_13qvw_1", wT = "_winnersTop_13qvw_79", xT = "_winnersTopLine_13qvw_93", _T = "_scrollUp_13qvw_1", _i = {
  winnersRight: hT,
  winnersLeft: mT,
  winnersRightLine: vT,
  scrollRight: gT,
  winnersLeftLine: yT,
  scrollLeft: bT,
  winnersTop: wT,
  winnersTopLine: xT,
  scrollUp: _T
};
var hh = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/ContinuousCarousel/ContinuousCarousel.tsx";
const KT = ({
  direction: e,
  children: t
}) => /* @__PURE__ */ B("div", {
  className: e === "right" ? `${_i.winnersRight}` : e === "left" ? `${_i.winnersLeft}` : `${_i.winnersTop}`,
  children: /* @__PURE__ */ B("div", {
    className: e === "right" ? `${_i.winnersRightLine}` : e === "left" ? `${_i.winnersLeftLine}` : `${_i.winnersTopLine}`,
    children: t
  }, void 0, !1, {
    fileName: hh,
    lineNumber: 27,
    columnNumber: 7
  }, void 0)
}, void 0, !1, {
  fileName: hh,
  lineNumber: 18,
  columnNumber: 5
}, void 0), ST = "_container_1cfrf_10", RT = {
  container: ST
};
var Qr = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/FooterItem/FooterItem.tsx";
const QT = ({
  children: e,
  items: t
}) => {
  const {
    width: n
  } = Bg(), r = 620, i = 560;
  console.log("======>", e.replace(/\s+/g, "").toLowerCase());
  const o = /* @__PURE__ */ B("ul", {
    children: t.map((a) => /* @__PURE__ */ B("li", {
      children: /* @__PURE__ */ B("a", {
        href: `/${e.replace(/\s+/g, "").toLowerCase()}#${a.title.toLowerCase()}`,
        children: /* @__PURE__ */ B(Ig, {
          handleClick: () => {
          },
          size: n > r ? "large" : n > i && n < r ? "medium" : "small",
          type: a.type,
          children: a.title
        }, void 0, !1, {
          fileName: Qr,
          lineNumber: 35,
          columnNumber: 13
        }, void 0)
      }, void 0, !1, {
        fileName: Qr,
        lineNumber: 30,
        columnNumber: 11
      }, void 0)
    }, a.title, !1, {
      fileName: Qr,
      lineNumber: 29,
      columnNumber: 9
    }, void 0))
  }, void 0, !1, {
    fileName: Qr,
    lineNumber: 27,
    columnNumber: 5
  }, void 0);
  return /* @__PURE__ */ B("div", {
    className: RT.container,
    children: [/* @__PURE__ */ B("a", {
      href: `/${e.replace(/\s+/g, "").toLowerCase()}`,
      children: /* @__PURE__ */ B("h1", {
        children: e
      }, void 0, !1, {
        fileName: Qr,
        lineNumber: 57,
        columnNumber: 9
      }, void 0)
    }, void 0, !1, {
      fileName: Qr,
      lineNumber: 56,
      columnNumber: 7
    }, void 0), o]
  }, void 0, !0, {
    fileName: Qr,
    lineNumber: 55,
    columnNumber: 5
  }, void 0);
}, CT = "_container_t6o1w_10", NT = {
  container: CT
};
var Va = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Partner/Partner.tsx";
const ZT = ({
  img: e,
  title: t,
  info: n
}) => /* @__PURE__ */ B("div", {
  className: NT.container,
  children: [/* @__PURE__ */ B("div", {
    children: e
  }, void 0, !1, {
    fileName: Va,
    lineNumber: 16,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("h3", {
    children: t
  }, void 0, !1, {
    fileName: Va,
    lineNumber: 17,
    columnNumber: 7
  }, void 0), /* @__PURE__ */ B("p", {
    children: n
  }, void 0, !1, {
    fileName: Va,
    lineNumber: 18,
    columnNumber: 7
  }, void 0)]
}, void 0, !0, {
  fileName: Va,
  lineNumber: 15,
  columnNumber: 5
}, void 0), PT = (e, t) => {
  on(() => {
    const n = (r) => {
      e.current && !e.current.contains(r.target) && t();
    };
    return document.addEventListener("mousedown", n), () => {
      document.removeEventListener("mousedown", n);
    };
  }, [e]);
}, TT = (e) => /* @__PURE__ */ Tt.createElement("svg", {
  width: 24,
  height: 18,
  viewBox: "0 0 24 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...e
}, /* @__PURE__ */ Tt.createElement("path", {
  d: "M21.45 0.45L7.5 14.4L2.55 9.45C1.95 8.85 1.05 8.85 0.45 9.45C-0.15 10.05 -0.15 10.95 0.45 11.55L6.45 17.55C6.75 17.85 7.05 18 7.5 18C7.95 18 8.25 17.85 8.55 17.55L23.55 2.55C24.15 1.95 24.15 1.05 23.55 0.45C22.95 -0.15 22.05 -0.15 21.45 0.45Z",
  fill: "url(#paint0_angular_1225_73276)"
}), /* @__PURE__ */ Tt.createElement("defs", null, /* @__PURE__ */ Tt.createElement("radialGradient", {
  id: "paint0_angular_1225_73276",
  cx: 0,
  cy: 0,
  r: 1,
  gradientUnits: "userSpaceOnUse",
  gradientTransform: "translate(7 3) rotate(112.714) scale(23.3077 26.1223)"
}, /* @__PURE__ */ Tt.createElement("stop", {
  stopColor: "#F3B8D8"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.139053,
  stopColor: "#B793E9"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.238718,
  stopColor: "#9FD4F3"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.374927,
  stopColor: "#FFD2C4"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.477914,
  stopColor: "#FBF3F3"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.557645,
  stopColor: "#D9ABDF"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.624089,
  stopColor: "#AF9CE3"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.720431,
  stopColor: "#AAE4E1"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.830062,
  stopColor: "#C6EAD0"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 0.913116,
  stopColor: "white"
}), /* @__PURE__ */ Tt.createElement("stop", {
  offset: 1,
  stopColor: "#FDB5E4"
})))), mh = {
  ETH: {
    name: "ethereum",
    short: "ETH"
  },
  SOL: {
    name: "solana",
    short: "SOL"
  }
}, ET = (e) => {
  const t = Math.floor(e), n = Math.max(Math.floor(Math.log(t) / Math.log(1e3)) + 1, 1);
  return `${Array.from(
    { length: n },
    (o, a) => Math.floor(t % 1e3 ** (n - a) / 1e3 ** (n - a - 1))
  ).map((o, a) => a === 0 ? `${o}` : `${o}`.padStart(3, "0")).join(",")}`;
}, JT = (e) => {
  const n = `${Math.floor(e * 100 % 100)}`.padStart(2, "0");
  return `$${ET(e)}.${n}`;
}, vh = 12 / 2, e2 = (e) => {
  const t = e.substring(0, vh), n = e.substring(
    e.length - vh,
    e.length
  );
  return `${t}..${n}`;
}, t2 = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0"), r = `${e.getFullYear() % 100}`.padStart(2, "0"), i = e.getHours(), o = `${i === 0 ? 0 : i % 12 || 12}`.padStart(2, "0"), a = `${e.getMinutes()}`.padStart(2, "0"), u = i < 12 ? "am" : "pm";
  return `${t}.${n}.${r} ${o}:${a}${u}`;
}, n2 = (e) => {
  const t = `${e.getDate()}`.padStart(2, "0"), n = `${e.getMonth() + 1}`.padStart(2, "0");
  return `${e.getFullYear()}-${n}-${t}`;
}, MT = "_container_xgsx3_10", OT = "_heading_xgsx3_25", AT = "_card_xgsx3_31", Ua = {
  container: MT,
  heading: OT,
  card: AT
};
var Qn = "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Modal/BlockchainModal/BlockchainModal.tsx";
const r2 = ({
  handleModal: e,
  option: t,
  options: n,
  setOption: r
}) => {
  const i = (u) => {
    r(n[u].name), e(!1);
  }, o = (u) => u.name == t.name, a = Jt(null);
  return PT(a, () => e(!1)), /* @__PURE__ */ B("div", {
    ref: a,
    className: Ua.container,
    children: [/* @__PURE__ */ B("div", {
      className: Ua.heading,
      children: [/* @__PURE__ */ B(QN, {
        as: "h4",
        children: "Select a Blockchain"
      }, void 0, !1, {
        fileName: Qn,
        lineNumber: 39,
        columnNumber: 9
      }, void 0), /* @__PURE__ */ B("button", {
        onClick: () => e(!1),
        children: "X"
      }, void 0, !1, {
        fileName: Qn,
        lineNumber: 44,
        columnNumber: 9
      }, void 0)]
    }, void 0, !0, {
      fileName: Qn,
      lineNumber: 38,
      columnNumber: 7
    }, void 0), n.map((u, f) => o(u) ? /* @__PURE__ */ B(fh, {
      component: "button",
      className: `${Ua.card}`,
      type: "holobox",
      rounded: !0,
      children: [u.icon, /* @__PURE__ */ B(dc, {
        size: "xl",
        prominent: !0,
        children: /* @__PURE__ */ B("strong", {
          children: mh[u.name].name
        }, void 0, !1, {
          fileName: Qn,
          lineNumber: 56,
          columnNumber: 17
        }, void 0)
      }, void 0, !1, {
        fileName: Qn,
        lineNumber: 55,
        columnNumber: 15
      }, void 0), /* @__PURE__ */ B(TT, {
        style: {
          marginLeft: "auto",
          marginRight: "24px"
        }
      }, void 0, !1, {
        fileName: Qn,
        lineNumber: 60,
        columnNumber: 15
      }, void 0)]
    }, void 0, !0, {
      fileName: Qn,
      lineNumber: 48,
      columnNumber: 13
    }, void 0) : /* @__PURE__ */ B(fh, {
      component: "button",
      className: Ua.card,
      type: "box",
      rounded: !0,
      onClick: () => i(f),
      children: [u.icon, /* @__PURE__ */ B(dc, {
        size: "xl",
        children: mh[u.name].name
      }, void 0, !1, {
        fileName: Qn,
        lineNumber: 72,
        columnNumber: 13
      }, void 0)]
    }, void 0, !0, {
      fileName: Qn,
      lineNumber: 64,
      columnNumber: 11
    }, void 0))]
  }, void 0, !0, {
    fileName: Qn,
    lineNumber: 37,
    columnNumber: 5
  }, void 0);
};
export {
  wP as AnchorButton,
  r2 as BlockchainModal,
  fh as Card,
  zT as ChainSelectorButton,
  KT as ContinuousCarousel,
  IT as DataTable,
  YT as DesktopOnly,
  DT as Display,
  NP as FilterButton,
  WT as FilterCriteria,
  QT as FooterItem,
  AP as GeneralButton,
  QN as Heading,
  BT as LineChart,
  Ig as LinkButton,
  XT as ManualCarousel,
  LT as NavBar,
  VP as NavBarModal,
  jT as Navigation,
  ZT as Partner,
  HT as ReusableGrid,
  qT as Row,
  mh as SupportedChains,
  VT as Tab,
  UT as TabBar,
  GT as TabButton,
  dc as Text,
  t2 as formatTo12HrDate,
  n2 as formatToGraphQLDate,
  ET as numberToCommaSeparated,
  JT as numberToMonetaryString,
  e2 as trimAddress
};
