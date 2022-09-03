(function (mt, Y) {
  typeof exports == "object" && typeof module < "u"
    ? Y(exports, require("react"), require("react-dom"))
    : typeof define == "function" && define.amd
    ? define(["exports", "react", "react-dom"], Y)
    : ((mt = typeof globalThis < "u" ? globalThis : mt || self),
      Y((mt.Surfing = {}), mt.React, mt.ReactDOM));
})(this, function (mt, Y, Pf) {
  "use strict";
  const Nf = (e) =>
    e && typeof e == "object" && "default" in e ? e : { default: e };
  function Am(e) {
    if (e && e.__esModule) return e;
    const t = Object.create(null, {
      [Symbol.toStringTag]: { value: "Module" },
    });
    if (e) {
      for (const n in e)
        if (n !== "default") {
          const r = Object.getOwnPropertyDescriptor(e, n);
          Object.defineProperty(
            t,
            n,
            r.get ? r : { enumerable: !0, get: () => e[n] }
          );
        }
    }
    return (t.default = e), Object.freeze(t);
  }
  const Tn = Nf(Y),
    Pn = Am(Y),
    Ef = Nf(Pf);
  var li =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : typeof self < "u"
      ? self
      : {};
  function ji(e) {
    var t = e.default;
    if (typeof t == "function") {
      var n = function () {
        return t.apply(this, arguments);
      };
      n.prototype = t.prototype;
    } else n = {};
    return (
      Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.keys(e).forEach(function (r) {
        var i = Object.getOwnPropertyDescriptor(e, r);
        Object.defineProperty(
          n,
          r,
          i.get
            ? i
            : {
                enumerable: !0,
                get: function () {
                  return e[r];
                },
              }
        );
      }),
      n
    );
  }
  var Ae = { exports: {} },
    ju = { exports: {} },
    St = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Mf;
  function km() {
    if (Mf) return St;
    Mf = 1;
    var e = typeof Symbol == "function" && Symbol.for,
      t = e ? Symbol.for("react.element") : 60103,
      n = e ? Symbol.for("react.portal") : 60106,
      r = e ? Symbol.for("react.fragment") : 60107,
      i = e ? Symbol.for("react.strict_mode") : 60108,
      o = e ? Symbol.for("react.profiler") : 60114,
      a = e ? Symbol.for("react.provider") : 60109,
      u = e ? Symbol.for("react.context") : 60110,
      f = e ? Symbol.for("react.async_mode") : 60111,
      c = e ? Symbol.for("react.concurrent_mode") : 60111,
      p = e ? Symbol.for("react.forward_ref") : 60112,
      h = e ? Symbol.for("react.suspense") : 60113,
      w = e ? Symbol.for("react.suspense_list") : 60120,
      T = e ? Symbol.for("react.memo") : 60115,
      _ = e ? Symbol.for("react.lazy") : 60116,
      P = e ? Symbol.for("react.block") : 60121,
      I = e ? Symbol.for("react.fundamental") : 60117,
      k = e ? Symbol.for("react.responder") : 60118,
      F = e ? Symbol.for("react.scope") : 60119;
    function N(M) {
      if (typeof M == "object" && M !== null) {
        var D = M.$$typeof;
        switch (D) {
          case t:
            switch (((M = M.type), M)) {
              case f:
              case c:
              case r:
              case o:
              case i:
              case h:
                return M;
              default:
                switch (((M = M && M.$$typeof), M)) {
                  case u:
                  case p:
                  case _:
                  case T:
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
    return (
      (St.AsyncMode = f),
      (St.ConcurrentMode = c),
      (St.ContextConsumer = u),
      (St.ContextProvider = a),
      (St.Element = t),
      (St.ForwardRef = p),
      (St.Fragment = r),
      (St.Lazy = _),
      (St.Memo = T),
      (St.Portal = n),
      (St.Profiler = o),
      (St.StrictMode = i),
      (St.Suspense = h),
      (St.isAsyncMode = function (M) {
        return G(M) || N(M) === f;
      }),
      (St.isConcurrentMode = G),
      (St.isContextConsumer = function (M) {
        return N(M) === u;
      }),
      (St.isContextProvider = function (M) {
        return N(M) === a;
      }),
      (St.isElement = function (M) {
        return typeof M == "object" && M !== null && M.$$typeof === t;
      }),
      (St.isForwardRef = function (M) {
        return N(M) === p;
      }),
      (St.isFragment = function (M) {
        return N(M) === r;
      }),
      (St.isLazy = function (M) {
        return N(M) === _;
      }),
      (St.isMemo = function (M) {
        return N(M) === T;
      }),
      (St.isPortal = function (M) {
        return N(M) === n;
      }),
      (St.isProfiler = function (M) {
        return N(M) === o;
      }),
      (St.isStrictMode = function (M) {
        return N(M) === i;
      }),
      (St.isSuspense = function (M) {
        return N(M) === h;
      }),
      (St.isValidElementType = function (M) {
        return (
          typeof M == "string" ||
          typeof M == "function" ||
          M === r ||
          M === c ||
          M === o ||
          M === i ||
          M === h ||
          M === w ||
          (typeof M == "object" &&
            M !== null &&
            (M.$$typeof === _ ||
              M.$$typeof === T ||
              M.$$typeof === a ||
              M.$$typeof === u ||
              M.$$typeof === p ||
              M.$$typeof === I ||
              M.$$typeof === k ||
              M.$$typeof === F ||
              M.$$typeof === P))
        );
      }),
      (St.typeOf = N),
      St
    );
  }
  var Rt = {};
  /** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Of;
  function $m() {
    return (
      Of ||
        ((Of = 1),
        process.env.NODE_ENV !== "production" &&
          (function () {
            var e = typeof Symbol == "function" && Symbol.for,
              t = e ? Symbol.for("react.element") : 60103,
              n = e ? Symbol.for("react.portal") : 60106,
              r = e ? Symbol.for("react.fragment") : 60107,
              i = e ? Symbol.for("react.strict_mode") : 60108,
              o = e ? Symbol.for("react.profiler") : 60114,
              a = e ? Symbol.for("react.provider") : 60109,
              u = e ? Symbol.for("react.context") : 60110,
              f = e ? Symbol.for("react.async_mode") : 60111,
              c = e ? Symbol.for("react.concurrent_mode") : 60111,
              p = e ? Symbol.for("react.forward_ref") : 60112,
              h = e ? Symbol.for("react.suspense") : 60113,
              w = e ? Symbol.for("react.suspense_list") : 60120,
              T = e ? Symbol.for("react.memo") : 60115,
              _ = e ? Symbol.for("react.lazy") : 60116,
              P = e ? Symbol.for("react.block") : 60121,
              I = e ? Symbol.for("react.fundamental") : 60117,
              k = e ? Symbol.for("react.responder") : 60118,
              F = e ? Symbol.for("react.scope") : 60119;
            function N(B) {
              return (
                typeof B == "string" ||
                typeof B == "function" ||
                B === r ||
                B === c ||
                B === o ||
                B === i ||
                B === h ||
                B === w ||
                (typeof B == "object" &&
                  B !== null &&
                  (B.$$typeof === _ ||
                    B.$$typeof === T ||
                    B.$$typeof === a ||
                    B.$$typeof === u ||
                    B.$$typeof === p ||
                    B.$$typeof === I ||
                    B.$$typeof === k ||
                    B.$$typeof === F ||
                    B.$$typeof === P))
              );
            }
            function G(B) {
              if (typeof B == "object" && B !== null) {
                var yt = B.$$typeof;
                switch (yt) {
                  case t:
                    var ft = B.type;
                    switch (ft) {
                      case f:
                      case c:
                      case r:
                      case o:
                      case i:
                      case h:
                        return ft;
                      default:
                        var Ct = ft && ft.$$typeof;
                        switch (Ct) {
                          case u:
                          case p:
                          case _:
                          case T:
                          case a:
                            return Ct;
                          default:
                            return yt;
                        }
                    }
                  case n:
                    return yt;
                }
              }
            }
            var M = f,
              D = c,
              ne = u,
              Z = a,
              he = t,
              me = p,
              ie = r,
              te = _,
              we = T,
              ke = n,
              st = o,
              Ue = i,
              lt = h,
              ct = !1;
            function ht(B) {
              return (
                ct ||
                  ((ct = !0),
                  console.warn(
                    "The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API."
                  )),
                U(B) || G(B) === f
              );
            }
            function U(B) {
              return G(B) === c;
            }
            function se(B) {
              return G(B) === u;
            }
            function Ne(B) {
              return G(B) === a;
            }
            function $e(B) {
              return typeof B == "object" && B !== null && B.$$typeof === t;
            }
            function Te(B) {
              return G(B) === p;
            }
            function Ce(B) {
              return G(B) === r;
            }
            function Ee(B) {
              return G(B) === _;
            }
            function De(B) {
              return G(B) === T;
            }
            function Ge(B) {
              return G(B) === n;
            }
            function K(B) {
              return G(B) === o;
            }
            function fe(B) {
              return G(B) === i;
            }
            function je(B) {
              return G(B) === h;
            }
            (Rt.AsyncMode = M),
              (Rt.ConcurrentMode = D),
              (Rt.ContextConsumer = ne),
              (Rt.ContextProvider = Z),
              (Rt.Element = he),
              (Rt.ForwardRef = me),
              (Rt.Fragment = ie),
              (Rt.Lazy = te),
              (Rt.Memo = we),
              (Rt.Portal = ke),
              (Rt.Profiler = st),
              (Rt.StrictMode = Ue),
              (Rt.Suspense = lt),
              (Rt.isAsyncMode = ht),
              (Rt.isConcurrentMode = U),
              (Rt.isContextConsumer = se),
              (Rt.isContextProvider = Ne),
              (Rt.isElement = $e),
              (Rt.isForwardRef = Te),
              (Rt.isFragment = Ce),
              (Rt.isLazy = Ee),
              (Rt.isMemo = De),
              (Rt.isPortal = Ge),
              (Rt.isProfiler = K),
              (Rt.isStrictMode = fe),
              (Rt.isSuspense = je),
              (Rt.isValidElementType = N),
              (Rt.typeOf = G);
          })()),
      Rt
    );
  }
  var Af;
  function kf() {
    return (
      Af ||
        ((Af = 1),
        (function (e) {
          process.env.NODE_ENV === "production"
            ? (e.exports = km())
            : (e.exports = $m());
        })(ju)),
      ju.exports
    );
  }
  /*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var Hu, $f;
  function Wu() {
    if ($f) return Hu;
    $f = 1;
    var e = Object.getOwnPropertySymbols,
      t = Object.prototype.hasOwnProperty,
      n = Object.prototype.propertyIsEnumerable;
    function r(o) {
      if (o == null)
        throw new TypeError(
          "Object.assign cannot be called with null or undefined"
        );
      return Object(o);
    }
    function i() {
      try {
        if (!Object.assign) return !1;
        var o = new String("abc");
        if (((o[5] = "de"), Object.getOwnPropertyNames(o)[0] === "5"))
          return !1;
        for (var a = {}, u = 0; u < 10; u++)
          a["_" + String.fromCharCode(u)] = u;
        var f = Object.getOwnPropertyNames(a).map(function (p) {
          return a[p];
        });
        if (f.join("") !== "0123456789") return !1;
        var c = {};
        return (
          "abcdefghijklmnopqrst".split("").forEach(function (p) {
            c[p] = p;
          }),
          Object.keys(Object.assign({}, c)).join("") === "abcdefghijklmnopqrst"
        );
      } catch {
        return !1;
      }
    }
    return (
      (Hu = i()
        ? Object.assign
        : function (o, a) {
            for (var u, f = r(o), c, p = 1; p < arguments.length; p++) {
              u = Object(arguments[p]);
              for (var h in u) t.call(u, h) && (f[h] = u[h]);
              if (e) {
                c = e(u);
                for (var w = 0; w < c.length; w++)
                  n.call(u, c[w]) && (f[c[w]] = u[c[w]]);
              }
            }
            return f;
          }),
      Hu
    );
  }
  var Vu, Ff;
  function Uu() {
    if (Ff) return Vu;
    Ff = 1;
    var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    return (Vu = e), Vu;
  }
  var qu, If;
  function Bf() {
    return (
      If ||
        ((If = 1), (qu = Function.call.bind(Object.prototype.hasOwnProperty))),
      qu
    );
  }
  var Yu, Df;
  function Fm() {
    if (Df) return Yu;
    Df = 1;
    var e = function () {};
    if (process.env.NODE_ENV !== "production") {
      var t = Uu(),
        n = {},
        r = Bf();
      e = function (o) {
        var a = "Warning: " + o;
        typeof console < "u" && console.error(a);
        try {
          throw new Error(a);
        } catch {}
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
                  (f || "React class") +
                    ": " +
                    u +
                    " type `" +
                    p +
                    "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                    typeof o[p] +
                    "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                );
                throw ((w.name = "Invariant Violation"), w);
              }
              h = o[p](a, p, f, u, null, t);
            } catch (_) {
              h = _;
            }
            if (
              (h &&
                !(h instanceof Error) &&
                e(
                  (f || "React class") +
                    ": type specification of " +
                    u +
                    " `" +
                    p +
                    "` is invalid; the type checker function must return `null` or an `Error` but returned a " +
                    typeof h +
                    ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
                ),
              h instanceof Error && !(h.message in n))
            ) {
              n[h.message] = !0;
              var T = c ? c() : "";
              e("Failed " + u + " type: " + h.message + (T != null ? T : ""));
            }
          }
      }
    }
    return (
      (i.resetWarningCache = function () {
        process.env.NODE_ENV !== "production" && (n = {});
      }),
      (Yu = i),
      Yu
    );
  }
  var Xu, zf;
  function Im() {
    if (zf) return Xu;
    zf = 1;
    var e = kf(),
      t = Wu(),
      n = Uu(),
      r = Bf(),
      i = Fm(),
      o = function () {};
    process.env.NODE_ENV !== "production" &&
      (o = function (u) {
        var f = "Warning: " + u;
        typeof console < "u" && console.error(f);
        try {
          throw new Error(f);
        } catch {}
      });
    function a() {
      return null;
    }
    return (
      (Xu = function (u, f) {
        var c = typeof Symbol == "function" && Symbol.iterator,
          p = "@@iterator";
        function h(U) {
          var se = U && ((c && U[c]) || U[p]);
          if (typeof se == "function") return se;
        }
        var w = "<<anonymous>>",
          T = {
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
            node: me(),
            objectOf: Z,
            oneOf: ne,
            oneOfType: he,
            shape: te,
            exact: we,
          };
        function _(U, se) {
          return U === se ? U !== 0 || 1 / U === 1 / se : U !== U && se !== se;
        }
        function P(U, se) {
          (this.message = U),
            (this.data = se && typeof se == "object" ? se : {}),
            (this.stack = "");
        }
        P.prototype = Error.prototype;
        function I(U) {
          if (process.env.NODE_ENV !== "production")
            var se = {},
              Ne = 0;
          function $e(Ce, Ee, De, Ge, K, fe, je) {
            if (((Ge = Ge || w), (fe = fe || De), je !== n)) {
              if (f) {
                var B = new Error(
                  "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
                );
                throw ((B.name = "Invariant Violation"), B);
              } else if (
                process.env.NODE_ENV !== "production" &&
                typeof console < "u"
              ) {
                var yt = Ge + ":" + De;
                !se[yt] &&
                  Ne < 3 &&
                  (o(
                    "You are manually calling a React.PropTypes validation function for the `" +
                      fe +
                      "` prop on `" +
                      Ge +
                      "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
                  ),
                  (se[yt] = !0),
                  Ne++);
              }
            }
            return Ee[De] == null
              ? Ce
                ? Ee[De] === null
                  ? new P(
                      "The " +
                        K +
                        " `" +
                        fe +
                        "` is marked as required " +
                        ("in `" + Ge + "`, but its value is `null`.")
                    )
                  : new P(
                      "The " +
                        K +
                        " `" +
                        fe +
                        "` is marked as required in " +
                        ("`" + Ge + "`, but its value is `undefined`.")
                    )
                : null
              : U(Ee, De, Ge, K, fe);
          }
          var Te = $e.bind(null, !1);
          return (Te.isRequired = $e.bind(null, !0)), Te;
        }
        function k(U) {
          function se(Ne, $e, Te, Ce, Ee, De) {
            var Ge = Ne[$e],
              K = Ue(Ge);
            if (K !== U) {
              var fe = lt(Ge);
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type " +
                  ("`" + fe + "` supplied to `" + Te + "`, expected ") +
                  ("`" + U + "`."),
                { expectedType: U }
              );
            }
            return null;
          }
          return I(se);
        }
        function F() {
          return I(a);
        }
        function N(U) {
          function se(Ne, $e, Te, Ce, Ee) {
            if (typeof U != "function")
              return new P(
                "Property `" +
                  Ee +
                  "` of component `" +
                  Te +
                  "` has invalid PropType notation inside arrayOf."
              );
            var De = Ne[$e];
            if (!Array.isArray(De)) {
              var Ge = Ue(De);
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type " +
                  ("`" + Ge + "` supplied to `" + Te + "`, expected an array.")
              );
            }
            for (var K = 0; K < De.length; K++) {
              var fe = U(De, K, Te, Ce, Ee + "[" + K + "]", n);
              if (fe instanceof Error) return fe;
            }
            return null;
          }
          return I(se);
        }
        function G() {
          function U(se, Ne, $e, Te, Ce) {
            var Ee = se[Ne];
            if (!u(Ee)) {
              var De = Ue(Ee);
              return new P(
                "Invalid " +
                  Te +
                  " `" +
                  Ce +
                  "` of type " +
                  ("`" +
                    De +
                    "` supplied to `" +
                    $e +
                    "`, expected a single ReactElement.")
              );
            }
            return null;
          }
          return I(U);
        }
        function M() {
          function U(se, Ne, $e, Te, Ce) {
            var Ee = se[Ne];
            if (!e.isValidElementType(Ee)) {
              var De = Ue(Ee);
              return new P(
                "Invalid " +
                  Te +
                  " `" +
                  Ce +
                  "` of type " +
                  ("`" +
                    De +
                    "` supplied to `" +
                    $e +
                    "`, expected a single ReactElement type.")
              );
            }
            return null;
          }
          return I(U);
        }
        function D(U) {
          function se(Ne, $e, Te, Ce, Ee) {
            if (!(Ne[$e] instanceof U)) {
              var De = U.name || w,
                Ge = ht(Ne[$e]);
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type " +
                  ("`" + Ge + "` supplied to `" + Te + "`, expected ") +
                  ("instance of `" + De + "`.")
              );
            }
            return null;
          }
          return I(se);
        }
        function ne(U) {
          if (!Array.isArray(U))
            return (
              process.env.NODE_ENV !== "production" &&
                (arguments.length > 1
                  ? o(
                      "Invalid arguments supplied to oneOf, expected an array, got " +
                        arguments.length +
                        " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
                    )
                  : o(
                      "Invalid argument supplied to oneOf, expected an array."
                    )),
              a
            );
          function se(Ne, $e, Te, Ce, Ee) {
            for (var De = Ne[$e], Ge = 0; Ge < U.length; Ge++)
              if (_(De, U[Ge])) return null;
            var K = JSON.stringify(U, function (je, B) {
              var yt = lt(B);
              return yt === "symbol" ? String(B) : B;
            });
            return new P(
              "Invalid " +
                Ce +
                " `" +
                Ee +
                "` of value `" +
                String(De) +
                "` " +
                ("supplied to `" + Te + "`, expected one of " + K + ".")
            );
          }
          return I(se);
        }
        function Z(U) {
          function se(Ne, $e, Te, Ce, Ee) {
            if (typeof U != "function")
              return new P(
                "Property `" +
                  Ee +
                  "` of component `" +
                  Te +
                  "` has invalid PropType notation inside objectOf."
              );
            var De = Ne[$e],
              Ge = Ue(De);
            if (Ge !== "object")
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type " +
                  ("`" + Ge + "` supplied to `" + Te + "`, expected an object.")
              );
            for (var K in De)
              if (r(De, K)) {
                var fe = U(De, K, Te, Ce, Ee + "." + K, n);
                if (fe instanceof Error) return fe;
              }
            return null;
          }
          return I(se);
        }
        function he(U) {
          if (!Array.isArray(U))
            return (
              process.env.NODE_ENV !== "production" &&
                o(
                  "Invalid argument supplied to oneOfType, expected an instance of array."
                ),
              a
            );
          for (var se = 0; se < U.length; se++) {
            var Ne = U[se];
            if (typeof Ne != "function")
              return (
                o(
                  "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " +
                    ct(Ne) +
                    " at index " +
                    se +
                    "."
                ),
                a
              );
          }
          function $e(Te, Ce, Ee, De, Ge) {
            for (var K = [], fe = 0; fe < U.length; fe++) {
              var je = U[fe],
                B = je(Te, Ce, Ee, De, Ge, n);
              if (B == null) return null;
              B.data &&
                r(B.data, "expectedType") &&
                K.push(B.data.expectedType);
            }
            var yt =
              K.length > 0
                ? ", expected one of type [" + K.join(", ") + "]"
                : "";
            return new P(
              "Invalid " +
                De +
                " `" +
                Ge +
                "` supplied to " +
                ("`" + Ee + "`" + yt + ".")
            );
          }
          return I($e);
        }
        function me() {
          function U(se, Ne, $e, Te, Ce) {
            return ke(se[Ne])
              ? null
              : new P(
                  "Invalid " +
                    Te +
                    " `" +
                    Ce +
                    "` supplied to " +
                    ("`" + $e + "`, expected a ReactNode.")
                );
          }
          return I(U);
        }
        function ie(U, se, Ne, $e, Te) {
          return new P(
            (U || "React class") +
              ": " +
              se +
              " type `" +
              Ne +
              "." +
              $e +
              "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
              Te +
              "`."
          );
        }
        function te(U) {
          function se(Ne, $e, Te, Ce, Ee) {
            var De = Ne[$e],
              Ge = Ue(De);
            if (Ge !== "object")
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type `" +
                  Ge +
                  "` " +
                  ("supplied to `" + Te + "`, expected `object`.")
              );
            for (var K in U) {
              var fe = U[K];
              if (typeof fe != "function") return ie(Te, Ce, Ee, K, lt(fe));
              var je = fe(De, K, Te, Ce, Ee + "." + K, n);
              if (je) return je;
            }
            return null;
          }
          return I(se);
        }
        function we(U) {
          function se(Ne, $e, Te, Ce, Ee) {
            var De = Ne[$e],
              Ge = Ue(De);
            if (Ge !== "object")
              return new P(
                "Invalid " +
                  Ce +
                  " `" +
                  Ee +
                  "` of type `" +
                  Ge +
                  "` " +
                  ("supplied to `" + Te + "`, expected `object`.")
              );
            var K = t({}, Ne[$e], U);
            for (var fe in K) {
              var je = U[fe];
              if (r(U, fe) && typeof je != "function")
                return ie(Te, Ce, Ee, fe, lt(je));
              if (!je)
                return new P(
                  "Invalid " +
                    Ce +
                    " `" +
                    Ee +
                    "` key `" +
                    fe +
                    "` supplied to `" +
                    Te +
                    "`.\nBad object: " +
                    JSON.stringify(Ne[$e], null, "  ") +
                    `
Valid keys: ` +
                    JSON.stringify(Object.keys(U), null, "  ")
                );
              var B = je(De, fe, Te, Ce, Ee + "." + fe, n);
              if (B) return B;
            }
            return null;
          }
          return I(se);
        }
        function ke(U) {
          switch (typeof U) {
            case "number":
            case "string":
            case "undefined":
              return !0;
            case "boolean":
              return !U;
            case "object":
              if (Array.isArray(U)) return U.every(ke);
              if (U === null || u(U)) return !0;
              var se = h(U);
              if (se) {
                var Ne = se.call(U),
                  $e;
                if (se !== U.entries) {
                  for (; !($e = Ne.next()).done; ) if (!ke($e.value)) return !1;
                } else
                  for (; !($e = Ne.next()).done; ) {
                    var Te = $e.value;
                    if (Te && !ke(Te[1])) return !1;
                  }
              } else return !1;
              return !0;
            default:
              return !1;
          }
        }
        function st(U, se) {
          return U === "symbol"
            ? !0
            : se
            ? se["@@toStringTag"] === "Symbol" ||
              (typeof Symbol == "function" && se instanceof Symbol)
            : !1;
        }
        function Ue(U) {
          var se = typeof U;
          return Array.isArray(U)
            ? "array"
            : U instanceof RegExp
            ? "object"
            : st(se, U)
            ? "symbol"
            : se;
        }
        function lt(U) {
          if (typeof U > "u" || U === null) return "" + U;
          var se = Ue(U);
          if (se === "object") {
            if (U instanceof Date) return "date";
            if (U instanceof RegExp) return "regexp";
          }
          return se;
        }
        function ct(U) {
          var se = lt(U);
          switch (se) {
            case "array":
            case "object":
              return "an " + se;
            case "boolean":
            case "date":
            case "regexp":
              return "a " + se;
            default:
              return se;
          }
        }
        function ht(U) {
          return !U.constructor || !U.constructor.name ? w : U.constructor.name;
        }
        return (
          (T.checkPropTypes = i),
          (T.resetWarningCache = i.resetWarningCache),
          (T.PropTypes = T),
          T
        );
      }),
      Xu
    );
  }
  var Ku, Lf;
  function Bm() {
    if (Lf) return Ku;
    Lf = 1;
    var e = Uu();
    function t() {}
    function n() {}
    return (
      (n.resetWarningCache = t),
      (Ku = function () {
        function r(a, u, f, c, p, h) {
          if (h !== e) {
            var w = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw ((w.name = "Invariant Violation"), w);
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
          resetWarningCache: t,
        };
        return (o.PropTypes = o), o;
      }),
      Ku
    );
  }
  if (process.env.NODE_ENV !== "production") {
    var Dm = kf(),
      zm = !0;
    Ae.exports = Im()(Dm.isElement, zm);
  } else Ae.exports = Bm()();
  var Qu = { exports: {} },
    Hi = {};
  /** @license React v17.0.2
   * react-jsx-dev-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Gf;
  function Lm() {
    if (Gf) return Hi;
    if (
      ((Gf = 1),
      Wu(),
      (Hi.Fragment = 60107),
      typeof Symbol == "function" && Symbol.for)
    ) {
      var e = Symbol.for;
      Hi.Fragment = e("react.fragment");
    }
    return (Hi.jsxDEV = void 0), Hi;
  }
  var Zu = {};
  /** @license React v17.0.2
   * react-jsx-dev-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var jf;
  function Gm() {
    return (
      jf ||
        ((jf = 1),
        (function (e) {
          process.env.NODE_ENV !== "production" &&
            (function () {
              var t = Tn.default,
                n = Wu(),
                r = 60103,
                i = 60106;
              e.Fragment = 60107;
              var o = 60108,
                a = 60114,
                u = 60109,
                f = 60110,
                c = 60112,
                p = 60113,
                h = 60120,
                w = 60115,
                T = 60116,
                _ = 60121,
                P = 60122,
                I = 60117,
                k = 60129,
                F = 60131;
              if (typeof Symbol == "function" && Symbol.for) {
                var N = Symbol.for;
                (r = N("react.element")),
                  (i = N("react.portal")),
                  (e.Fragment = N("react.fragment")),
                  (o = N("react.strict_mode")),
                  (a = N("react.profiler")),
                  (u = N("react.provider")),
                  (f = N("react.context")),
                  (c = N("react.forward_ref")),
                  (p = N("react.suspense")),
                  (h = N("react.suspense_list")),
                  (w = N("react.memo")),
                  (T = N("react.lazy")),
                  (_ = N("react.block")),
                  (P = N("react.server.block")),
                  (I = N("react.fundamental")),
                  N("react.scope"),
                  N("react.opaque.id"),
                  (k = N("react.debug_trace_mode")),
                  N("react.offscreen"),
                  (F = N("react.legacy_hidden"));
              }
              var G = typeof Symbol == "function" && Symbol.iterator,
                M = "@@iterator";
              function D(O) {
                if (O === null || typeof O != "object") return null;
                var ee = (G && O[G]) || O[M];
                return typeof ee == "function" ? ee : null;
              }
              var ne = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
              function Z(O) {
                {
                  for (
                    var ee = arguments.length,
                      ve = new Array(ee > 1 ? ee - 1 : 0),
                      Le = 1;
                    Le < ee;
                    Le++
                  )
                    ve[Le - 1] = arguments[Le];
                  he("error", O, ve);
                }
              }
              function he(O, ee, ve) {
                {
                  var Le = ne.ReactDebugCurrentFrame,
                    vt = Le.getStackAddendum();
                  vt !== "" && ((ee += "%s"), (ve = ve.concat([vt])));
                  var bt = ve.map(function (ut) {
                    return "" + ut;
                  });
                  bt.unshift("Warning: " + ee),
                    Function.prototype.apply.call(console[O], console, bt);
                }
              }
              var me = !1;
              function ie(O) {
                return !!(
                  typeof O == "string" ||
                  typeof O == "function" ||
                  O === e.Fragment ||
                  O === a ||
                  O === k ||
                  O === o ||
                  O === p ||
                  O === h ||
                  O === F ||
                  me ||
                  (typeof O == "object" &&
                    O !== null &&
                    (O.$$typeof === T ||
                      O.$$typeof === w ||
                      O.$$typeof === u ||
                      O.$$typeof === f ||
                      O.$$typeof === c ||
                      O.$$typeof === I ||
                      O.$$typeof === _ ||
                      O[0] === P))
                );
              }
              function te(O, ee, ve) {
                var Le = ee.displayName || ee.name || "";
                return O.displayName || (Le !== "" ? ve + "(" + Le + ")" : ve);
              }
              function we(O) {
                return O.displayName || "Context";
              }
              function ke(O) {
                if (O == null) return null;
                if (
                  (typeof O.tag == "number" &&
                    Z(
                      "Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."
                    ),
                  typeof O == "function")
                )
                  return O.displayName || O.name || null;
                if (typeof O == "string") return O;
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
                      var ee = O;
                      return we(ee) + ".Consumer";
                    case u:
                      var ve = O;
                      return we(ve._context) + ".Provider";
                    case c:
                      return te(O, O.render, "ForwardRef");
                    case w:
                      return ke(O.type);
                    case _:
                      return ke(O._render);
                    case T: {
                      var Le = O,
                        vt = Le._payload,
                        bt = Le._init;
                      try {
                        return ke(bt(vt));
                      } catch {
                        return null;
                      }
                    }
                  }
                return null;
              }
              var st = 0,
                Ue,
                lt,
                ct,
                ht,
                U,
                se,
                Ne;
              function $e() {}
              $e.__reactDisabledLog = !0;
              function Te() {
                {
                  if (st === 0) {
                    (Ue = console.log),
                      (lt = console.info),
                      (ct = console.warn),
                      (ht = console.error),
                      (U = console.group),
                      (se = console.groupCollapsed),
                      (Ne = console.groupEnd);
                    var O = {
                      configurable: !0,
                      enumerable: !0,
                      value: $e,
                      writable: !0,
                    };
                    Object.defineProperties(console, {
                      info: O,
                      log: O,
                      warn: O,
                      error: O,
                      group: O,
                      groupCollapsed: O,
                      groupEnd: O,
                    });
                  }
                  st++;
                }
              }
              function Ce() {
                {
                  if ((st--, st === 0)) {
                    var O = { configurable: !0, enumerable: !0, writable: !0 };
                    Object.defineProperties(console, {
                      log: n({}, O, { value: Ue }),
                      info: n({}, O, { value: lt }),
                      warn: n({}, O, { value: ct }),
                      error: n({}, O, { value: ht }),
                      group: n({}, O, { value: U }),
                      groupCollapsed: n({}, O, { value: se }),
                      groupEnd: n({}, O, { value: Ne }),
                    });
                  }
                  st < 0 &&
                    Z(
                      "disabledDepth fell below zero. This is a bug in React. Please file an issue."
                    );
                }
              }
              var Ee = ne.ReactCurrentDispatcher,
                De;
              function Ge(O, ee, ve) {
                {
                  if (De === void 0)
                    try {
                      throw Error();
                    } catch (vt) {
                      var Le = vt.stack.trim().match(/\n( *(at )?)/);
                      De = (Le && Le[1]) || "";
                    }
                  return (
                    `
` +
                    De +
                    O
                  );
                }
              }
              var K = !1,
                fe;
              {
                var je = typeof WeakMap == "function" ? WeakMap : Map;
                fe = new je();
              }
              function B(O, ee) {
                if (!O || K) return "";
                {
                  var ve = fe.get(O);
                  if (ve !== void 0) return ve;
                }
                var Le;
                K = !0;
                var vt = Error.prepareStackTrace;
                Error.prepareStackTrace = void 0;
                var bt;
                (bt = Ee.current), (Ee.current = null), Te();
                try {
                  if (ee) {
                    var ut = function () {
                      throw Error();
                    };
                    if (
                      (Object.defineProperty(ut.prototype, "props", {
                        set: function () {
                          throw Error();
                        },
                      }),
                      typeof Reflect == "object" && Reflect.construct)
                    ) {
                      try {
                        Reflect.construct(ut, []);
                      } catch (ln) {
                        Le = ln;
                      }
                      Reflect.construct(O, [], ut);
                    } else {
                      try {
                        ut.call();
                      } catch (ln) {
                        Le = ln;
                      }
                      O.call(ut.prototype);
                    }
                  } else {
                    try {
                      throw Error();
                    } catch (ln) {
                      Le = ln;
                    }
                    O();
                  }
                } catch (ln) {
                  if (ln && Le && typeof ln.stack == "string") {
                    for (
                      var it = ln.stack.split(`
`),
                        kt = Le.stack.split(`
`),
                        Pt = it.length - 1,
                        Ot = kt.length - 1;
                      Pt >= 1 && Ot >= 0 && it[Pt] !== kt[Ot];

                    )
                      Ot--;
                    for (; Pt >= 1 && Ot >= 0; Pt--, Ot--)
                      if (it[Pt] !== kt[Ot]) {
                        if (Pt !== 1 || Ot !== 1)
                          do
                            if ((Pt--, Ot--, Ot < 0 || it[Pt] !== kt[Ot])) {
                              var hn =
                                `
` + it[Pt].replace(" at new ", " at ");
                              return (
                                typeof O == "function" && fe.set(O, hn), hn
                              );
                            }
                          while (Pt >= 1 && Ot >= 0);
                        break;
                      }
                  }
                } finally {
                  (K = !1),
                    (Ee.current = bt),
                    Ce(),
                    (Error.prepareStackTrace = vt);
                }
                var Zn = O ? O.displayName || O.name : "",
                  ii = Zn ? Ge(Zn) : "";
                return typeof O == "function" && fe.set(O, ii), ii;
              }
              function yt(O, ee, ve) {
                return B(O, !1);
              }
              function ft(O) {
                var ee = O.prototype;
                return !!(ee && ee.isReactComponent);
              }
              function Ct(O, ee, ve) {
                if (O == null) return "";
                if (typeof O == "function") return B(O, ft(O));
                if (typeof O == "string") return Ge(O);
                switch (O) {
                  case p:
                    return Ge("Suspense");
                  case h:
                    return Ge("SuspenseList");
                }
                if (typeof O == "object")
                  switch (O.$$typeof) {
                    case c:
                      return yt(O.render);
                    case w:
                      return Ct(O.type, ee, ve);
                    case _:
                      return yt(O._render);
                    case T: {
                      var Le = O,
                        vt = Le._payload,
                        bt = Le._init;
                      try {
                        return Ct(bt(vt), ee, ve);
                      } catch {}
                    }
                  }
                return "";
              }
              var At = {},
                en = ne.ReactDebugCurrentFrame;
              function un(O) {
                if (O) {
                  var ee = O._owner,
                    ve = Ct(O.type, O._source, ee ? ee.type : null);
                  en.setExtraStackFrame(ve);
                } else en.setExtraStackFrame(null);
              }
              function wn(O, ee, ve, Le, vt) {
                {
                  var bt = Function.call.bind(Object.prototype.hasOwnProperty);
                  for (var ut in O)
                    if (bt(O, ut)) {
                      var it = void 0;
                      try {
                        if (typeof O[ut] != "function") {
                          var kt = Error(
                            (Le || "React class") +
                              ": " +
                              ve +
                              " type `" +
                              ut +
                              "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                              typeof O[ut] +
                              "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                          );
                          throw ((kt.name = "Invariant Violation"), kt);
                        }
                        it = O[ut](
                          ee,
                          ut,
                          Le,
                          ve,
                          null,
                          "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
                        );
                      } catch (Pt) {
                        it = Pt;
                      }
                      it &&
                        !(it instanceof Error) &&
                        (un(vt),
                        Z(
                          "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                          Le || "React class",
                          ve,
                          ut,
                          typeof it
                        ),
                        un(null)),
                        it instanceof Error &&
                          !(it.message in At) &&
                          ((At[it.message] = !0),
                          un(vt),
                          Z("Failed %s type: %s", ve, it.message),
                          un(null));
                    }
                }
              }
              var xn = ne.ReactCurrentOwner,
                _n = Object.prototype.hasOwnProperty,
                Un = { key: !0, ref: !0, __self: !0, __source: !0 },
                sr,
                qn,
                Sn;
              Sn = {};
              function Yt(O) {
                if (_n.call(O, "ref")) {
                  var ee = Object.getOwnPropertyDescriptor(O, "ref").get;
                  if (ee && ee.isReactWarning) return !1;
                }
                return O.ref !== void 0;
              }
              function An(O) {
                if (_n.call(O, "key")) {
                  var ee = Object.getOwnPropertyDescriptor(O, "key").get;
                  if (ee && ee.isReactWarning) return !1;
                }
                return O.key !== void 0;
              }
              function lr(O, ee) {
                if (
                  typeof O.ref == "string" &&
                  xn.current &&
                  ee &&
                  xn.current.stateNode !== ee
                ) {
                  var ve = ke(xn.current.type);
                  Sn[ve] ||
                    (Z(
                      'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                      ke(xn.current.type),
                      O.ref
                    ),
                    (Sn[ve] = !0));
                }
              }
              function Or(O, ee) {
                {
                  var ve = function () {
                    sr ||
                      ((sr = !0),
                      Z(
                        "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                        ee
                      ));
                  };
                  (ve.isReactWarning = !0),
                    Object.defineProperty(O, "key", {
                      get: ve,
                      configurable: !0,
                    });
                }
              }
              function Ar(O, ee) {
                {
                  var ve = function () {
                    qn ||
                      ((qn = !0),
                      Z(
                        "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                        ee
                      ));
                  };
                  (ve.isReactWarning = !0),
                    Object.defineProperty(O, "ref", {
                      get: ve,
                      configurable: !0,
                    });
                }
              }
              var cr = function (O, ee, ve, Le, vt, bt, ut) {
                var it = {
                  $$typeof: r,
                  type: O,
                  key: ee,
                  ref: ve,
                  props: ut,
                  _owner: bt,
                };
                return (
                  (it._store = {}),
                  Object.defineProperty(it._store, "validated", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !0,
                    value: !1,
                  }),
                  Object.defineProperty(it, "_self", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !1,
                    value: Le,
                  }),
                  Object.defineProperty(it, "_source", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !1,
                    value: vt,
                  }),
                  Object.freeze && (Object.freeze(it.props), Object.freeze(it)),
                  it
                );
              };
              function kr(O, ee, ve, Le, vt) {
                {
                  var bt,
                    ut = {},
                    it = null,
                    kt = null;
                  ve !== void 0 && (it = "" + ve),
                    An(ee) && (it = "" + ee.key),
                    Yt(ee) && ((kt = ee.ref), lr(ee, vt));
                  for (bt in ee)
                    _n.call(ee, bt) &&
                      !Un.hasOwnProperty(bt) &&
                      (ut[bt] = ee[bt]);
                  if (O && O.defaultProps) {
                    var Pt = O.defaultProps;
                    for (bt in Pt) ut[bt] === void 0 && (ut[bt] = Pt[bt]);
                  }
                  if (it || kt) {
                    var Ot =
                      typeof O == "function"
                        ? O.displayName || O.name || "Unknown"
                        : O;
                    it && Or(ut, Ot), kt && Ar(ut, Ot);
                  }
                  return cr(O, it, kt, vt, Le, xn.current, ut);
                }
              }
              var Yn = ne.ReactCurrentOwner,
                Xn = ne.ReactDebugCurrentFrame;
              function sn(O) {
                if (O) {
                  var ee = O._owner,
                    ve = Ct(O.type, O._source, ee ? ee.type : null);
                  Xn.setExtraStackFrame(ve);
                } else Xn.setExtraStackFrame(null);
              }
              var Rn;
              Rn = !1;
              function kn(O) {
                return typeof O == "object" && O !== null && O.$$typeof === r;
              }
              function $n() {
                {
                  if (Yn.current) {
                    var O = ke(Yn.current.type);
                    if (O)
                      return (
                        `

Check the render method of \`` +
                        O +
                        "`."
                      );
                  }
                  return "";
                }
              }
              function fr(O) {
                {
                  if (O !== void 0) {
                    var ee = O.fileName.replace(/^.*[\\\/]/, ""),
                      ve = O.lineNumber;
                    return (
                      `

Check your code at ` +
                      ee +
                      ":" +
                      ve +
                      "."
                    );
                  }
                  return "";
                }
              }
              var Fn = {};
              function dr(O) {
                {
                  var ee = $n();
                  if (!ee) {
                    var ve = typeof O == "string" ? O : O.displayName || O.name;
                    ve &&
                      (ee =
                        `

Check the top-level render call using <` +
                        ve +
                        ">.");
                  }
                  return ee;
                }
              }
              function Kn(O, ee) {
                {
                  if (!O._store || O._store.validated || O.key != null) return;
                  O._store.validated = !0;
                  var ve = dr(ee);
                  if (Fn[ve]) return;
                  Fn[ve] = !0;
                  var Le = "";
                  O &&
                    O._owner &&
                    O._owner !== Yn.current &&
                    (Le =
                      " It was passed a child from " + ke(O._owner.type) + "."),
                    sn(O),
                    Z(
                      'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
                      ve,
                      Le
                    ),
                    sn(null);
                }
              }
              function Qn(O, ee) {
                {
                  if (typeof O != "object") return;
                  if (Array.isArray(O))
                    for (var ve = 0; ve < O.length; ve++) {
                      var Le = O[ve];
                      kn(Le) && Kn(Le, ee);
                    }
                  else if (kn(O)) O._store && (O._store.validated = !0);
                  else if (O) {
                    var vt = D(O);
                    if (typeof vt == "function" && vt !== O.entries)
                      for (var bt = vt.call(O), ut; !(ut = bt.next()).done; )
                        kn(ut.value) && Kn(ut.value, ee);
                  }
                }
              }
              function Cn(O) {
                {
                  var ee = O.type;
                  if (ee == null || typeof ee == "string") return;
                  var ve;
                  if (typeof ee == "function") ve = ee.propTypes;
                  else if (
                    typeof ee == "object" &&
                    (ee.$$typeof === c || ee.$$typeof === w)
                  )
                    ve = ee.propTypes;
                  else return;
                  if (ve) {
                    var Le = ke(ee);
                    wn(ve, O.props, "prop", Le, O);
                  } else if (ee.PropTypes !== void 0 && !Rn) {
                    Rn = !0;
                    var vt = ke(ee);
                    Z(
                      "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                      vt || "Unknown"
                    );
                  }
                  typeof ee.getDefaultProps == "function" &&
                    !ee.getDefaultProps.isReactClassApproved &&
                    Z(
                      "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead."
                    );
                }
              }
              function $r(O) {
                {
                  for (
                    var ee = Object.keys(O.props), ve = 0;
                    ve < ee.length;
                    ve++
                  ) {
                    var Le = ee[ve];
                    if (Le !== "children" && Le !== "key") {
                      sn(O),
                        Z(
                          "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                          Le
                        ),
                        sn(null);
                      break;
                    }
                  }
                  O.ref !== null &&
                    (sn(O),
                    Z("Invalid attribute `ref` supplied to `React.Fragment`."),
                    sn(null));
                }
              }
              function Vt(O, ee, ve, Le, vt, bt) {
                {
                  var ut = ie(O);
                  if (!ut) {
                    var it = "";
                    (O === void 0 ||
                      (typeof O == "object" &&
                        O !== null &&
                        Object.keys(O).length === 0)) &&
                      (it +=
                        " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
                    var kt = fr(vt);
                    kt ? (it += kt) : (it += $n());
                    var Pt;
                    O === null
                      ? (Pt = "null")
                      : Array.isArray(O)
                      ? (Pt = "array")
                      : O !== void 0 && O.$$typeof === r
                      ? ((Pt = "<" + (ke(O.type) || "Unknown") + " />"),
                        (it =
                          " Did you accidentally export a JSX literal instead of a component?"))
                      : (Pt = typeof O),
                      Z(
                        "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                        Pt,
                        it
                      );
                  }
                  var Ot = kr(O, ee, ve, vt, bt);
                  if (Ot == null) return Ot;
                  if (ut) {
                    var hn = ee.children;
                    if (hn !== void 0)
                      if (Le)
                        if (Array.isArray(hn)) {
                          for (var Zn = 0; Zn < hn.length; Zn++) Qn(hn[Zn], O);
                          Object.freeze && Object.freeze(hn);
                        } else
                          Z(
                            "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                          );
                      else Qn(hn, O);
                  }
                  return O === e.Fragment ? $r(Ot) : Cn(Ot), Ot;
                }
              }
              var Xt = Vt;
              e.jsxDEV = Xt;
            })();
        })(Zu)),
      Zu
    );
  }
  (function (e) {
    process.env.NODE_ENV === "production"
      ? (e.exports = Lm())
      : (e.exports = Gm());
  })(Qu);
  const Nn = Qu.exports.Fragment,
    L = Qu.exports.jsxDEV;
  function jm(e) {
    var t = typeof e;
    return e != null && (t == "object" || t == "function");
  }
  var Hf = jm,
    Hm = typeof li == "object" && li && li.Object === Object && li,
    Wm = Hm,
    Vm = Wm,
    Um = typeof self == "object" && self && self.Object === Object && self,
    qm = Vm || Um || Function("return this")(),
    Wf = qm,
    Ym = Wf,
    Xm = function () {
      return Ym.Date.now();
    },
    Km = Xm,
    Qm = /\s/;
  function Zm(e) {
    for (var t = e.length; t-- && Qm.test(e.charAt(t)); );
    return t;
  }
  var Jm = Zm,
    e0 = Jm,
    t0 = /^\s+/;
  function n0(e) {
    return e && e.slice(0, e0(e) + 1).replace(t0, "");
  }
  var r0 = n0,
    i0 = Wf,
    o0 = i0.Symbol,
    Vf = o0,
    Uf = Vf,
    qf = Object.prototype,
    a0 = qf.hasOwnProperty,
    u0 = qf.toString,
    Wi = Uf ? Uf.toStringTag : void 0;
  function s0(e) {
    var t = a0.call(e, Wi),
      n = e[Wi];
    try {
      e[Wi] = void 0;
      var r = !0;
    } catch {}
    var i = u0.call(e);
    return r && (t ? (e[Wi] = n) : delete e[Wi]), i;
  }
  var l0 = s0,
    c0 = Object.prototype,
    f0 = c0.toString;
  function d0(e) {
    return f0.call(e);
  }
  var h0 = d0,
    Yf = Vf,
    p0 = l0,
    v0 = h0,
    g0 = "[object Null]",
    m0 = "[object Undefined]",
    Xf = Yf ? Yf.toStringTag : void 0;
  function y0(e) {
    return e == null
      ? e === void 0
        ? m0
        : g0
      : Xf && Xf in Object(e)
      ? p0(e)
      : v0(e);
  }
  var b0 = y0;
  function w0(e) {
    return e != null && typeof e == "object";
  }
  var x0 = w0,
    _0 = b0,
    S0 = x0,
    R0 = "[object Symbol]";
  function C0(e) {
    return typeof e == "symbol" || (S0(e) && _0(e) == R0);
  }
  var T0 = C0,
    P0 = r0,
    Kf = Hf,
    N0 = T0,
    Qf = 0 / 0,
    E0 = /^[-+]0x[0-9a-f]+$/i,
    M0 = /^0b[01]+$/i,
    O0 = /^0o[0-7]+$/i,
    A0 = parseInt;
  function k0(e) {
    if (typeof e == "number") return e;
    if (N0(e)) return Qf;
    if (Kf(e)) {
      var t = typeof e.valueOf == "function" ? e.valueOf() : e;
      e = Kf(t) ? t + "" : t;
    }
    if (typeof e != "string") return e === 0 ? e : +e;
    e = P0(e);
    var n = M0.test(e);
    return n || O0.test(e) ? A0(e.slice(2), n ? 2 : 8) : E0.test(e) ? Qf : +e;
  }
  var $0 = k0,
    F0 = Hf,
    Ju = Km,
    Zf = $0,
    I0 = "Expected a function",
    B0 = Math.max,
    D0 = Math.min;
  function z0(e, t, n) {
    var r,
      i,
      o,
      a,
      u,
      f,
      c = 0,
      p = !1,
      h = !1,
      w = !0;
    if (typeof e != "function") throw new TypeError(I0);
    (t = Zf(t) || 0),
      F0(n) &&
        ((p = !!n.leading),
        (h = "maxWait" in n),
        (o = h ? B0(Zf(n.maxWait) || 0, t) : o),
        (w = "trailing" in n ? !!n.trailing : w));
    function T(D) {
      var ne = r,
        Z = i;
      return (r = i = void 0), (c = D), (a = e.apply(Z, ne)), a;
    }
    function _(D) {
      return (c = D), (u = setTimeout(k, t)), p ? T(D) : a;
    }
    function P(D) {
      var ne = D - f,
        Z = D - c,
        he = t - ne;
      return h ? D0(he, o - Z) : he;
    }
    function I(D) {
      var ne = D - f,
        Z = D - c;
      return f === void 0 || ne >= t || ne < 0 || (h && Z >= o);
    }
    function k() {
      var D = Ju();
      if (I(D)) return F(D);
      u = setTimeout(k, P(D));
    }
    function F(D) {
      return (u = void 0), w && r ? T(D) : ((r = i = void 0), a);
    }
    function N() {
      u !== void 0 && clearTimeout(u), (c = 0), (r = f = i = u = void 0);
    }
    function G() {
      return u === void 0 ? a : F(Ju());
    }
    function M() {
      var D = Ju(),
        ne = I(D);
      if (((r = arguments), (i = this), (f = D), ne)) {
        if (u === void 0) return _(f);
        if (h) return clearTimeout(u), (u = setTimeout(k, t)), T(f);
      }
      return u === void 0 && (u = setTimeout(k, t)), a;
    }
    return (M.cancel = N), (M.flush = G), M;
  }
  var Jf = z0;
  const es = Jf;
  var zr = [],
    L0 = function () {
      return zr.some(function (e) {
        return e.activeTargets.length > 0;
      });
    },
    G0 = function () {
      return zr.some(function (e) {
        return e.skippedTargets.length > 0;
      });
    },
    ed = "ResizeObserver loop completed with undelivered notifications.",
    j0 = function () {
      var e;
      typeof ErrorEvent == "function"
        ? (e = new ErrorEvent("error", { message: ed }))
        : ((e = document.createEvent("Event")),
          e.initEvent("error", !1, !1),
          (e.message = ed)),
        window.dispatchEvent(e);
    },
    Vi;
  (function (e) {
    (e.BORDER_BOX = "border-box"),
      (e.CONTENT_BOX = "content-box"),
      (e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box");
  })(Vi || (Vi = {}));
  var Lr = function (e) {
      return Object.freeze(e);
    },
    td = (function () {
      function e(t, n) {
        (this.inlineSize = t), (this.blockSize = n), Lr(this);
      }
      return e;
    })(),
    nd = (function () {
      function e(t, n, r, i) {
        return (
          (this.x = t),
          (this.y = n),
          (this.width = r),
          (this.height = i),
          (this.top = this.y),
          (this.left = this.x),
          (this.bottom = this.top + this.height),
          (this.right = this.left + this.width),
          Lr(this)
        );
      }
      return (
        (e.prototype.toJSON = function () {
          var t = this,
            n = t.x,
            r = t.y,
            i = t.top,
            o = t.right,
            a = t.bottom,
            u = t.left,
            f = t.width,
            c = t.height;
          return {
            x: n,
            y: r,
            top: i,
            right: o,
            bottom: a,
            left: u,
            width: f,
            height: c,
          };
        }),
        (e.fromRect = function (t) {
          return new e(t.x, t.y, t.width, t.height);
        }),
        e
      );
    })(),
    ts = function (e) {
      return e instanceof SVGElement && "getBBox" in e;
    },
    rd = function (e) {
      if (ts(e)) {
        var t = e.getBBox(),
          n = t.width,
          r = t.height;
        return !n && !r;
      }
      var i = e,
        o = i.offsetWidth,
        a = i.offsetHeight;
      return !(o || a || e.getClientRects().length);
    },
    id = function (e) {
      var t;
      if (e instanceof Element) return !0;
      var n =
        (t = e == null ? void 0 : e.ownerDocument) === null || t === void 0
          ? void 0
          : t.defaultView;
      return !!(n && e instanceof n.Element);
    },
    H0 = function (e) {
      switch (e.tagName) {
        case "INPUT":
          if (e.type !== "image") break;
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
    },
    Ui = typeof window < "u" ? window : {},
    Zo = new WeakMap(),
    od = /auto|scroll/,
    W0 = /^tb|vertical/,
    V0 = /msie|trident/i.test(Ui.navigator && Ui.navigator.userAgent),
    In = function (e) {
      return parseFloat(e || "0");
    },
    ci = function (e, t, n) {
      return (
        e === void 0 && (e = 0),
        t === void 0 && (t = 0),
        n === void 0 && (n = !1),
        new td((n ? t : e) || 0, (n ? e : t) || 0)
      );
    },
    ad = Lr({
      devicePixelContentBoxSize: ci(),
      borderBoxSize: ci(),
      contentBoxSize: ci(),
      contentRect: new nd(0, 0, 0, 0),
    }),
    ud = function (e, t) {
      if ((t === void 0 && (t = !1), Zo.has(e) && !t)) return Zo.get(e);
      if (rd(e)) return Zo.set(e, ad), ad;
      var n = getComputedStyle(e),
        r = ts(e) && e.ownerSVGElement && e.getBBox(),
        i = !V0 && n.boxSizing === "border-box",
        o = W0.test(n.writingMode || ""),
        a = !r && od.test(n.overflowY || ""),
        u = !r && od.test(n.overflowX || ""),
        f = r ? 0 : In(n.paddingTop),
        c = r ? 0 : In(n.paddingRight),
        p = r ? 0 : In(n.paddingBottom),
        h = r ? 0 : In(n.paddingLeft),
        w = r ? 0 : In(n.borderTopWidth),
        T = r ? 0 : In(n.borderRightWidth),
        _ = r ? 0 : In(n.borderBottomWidth),
        P = r ? 0 : In(n.borderLeftWidth),
        I = h + c,
        k = f + p,
        F = P + T,
        N = w + _,
        G = u ? e.offsetHeight - N - e.clientHeight : 0,
        M = a ? e.offsetWidth - F - e.clientWidth : 0,
        D = i ? I + F : 0,
        ne = i ? k + N : 0,
        Z = r ? r.width : In(n.width) - D - M,
        he = r ? r.height : In(n.height) - ne - G,
        me = Z + I + M + F,
        ie = he + k + G + N,
        te = Lr({
          devicePixelContentBoxSize: ci(
            Math.round(Z * devicePixelRatio),
            Math.round(he * devicePixelRatio),
            o
          ),
          borderBoxSize: ci(me, ie, o),
          contentBoxSize: ci(Z, he, o),
          contentRect: new nd(h, f, Z, he),
        });
      return Zo.set(e, te), te;
    },
    sd = function (e, t, n) {
      var r = ud(e, n),
        i = r.borderBoxSize,
        o = r.contentBoxSize,
        a = r.devicePixelContentBoxSize;
      switch (t) {
        case Vi.DEVICE_PIXEL_CONTENT_BOX:
          return a;
        case Vi.BORDER_BOX:
          return i;
        default:
          return o;
      }
    },
    ld = (function () {
      function e(t) {
        var n = ud(t);
        (this.target = t),
          (this.contentRect = n.contentRect),
          (this.borderBoxSize = Lr([n.borderBoxSize])),
          (this.contentBoxSize = Lr([n.contentBoxSize])),
          (this.devicePixelContentBoxSize = Lr([n.devicePixelContentBoxSize]));
      }
      return e;
    })(),
    cd = function (e) {
      if (rd(e)) return 1 / 0;
      for (var t = 0, n = e.parentNode; n; ) (t += 1), (n = n.parentNode);
      return t;
    },
    U0 = function () {
      var e = 1 / 0,
        t = [];
      zr.forEach(function (a) {
        if (a.activeTargets.length !== 0) {
          var u = [];
          a.activeTargets.forEach(function (c) {
            var p = new ld(c.target),
              h = cd(c.target);
            u.push(p),
              (c.lastReportedSize = sd(c.target, c.observedBox)),
              h < e && (e = h);
          }),
            t.push(function () {
              a.callback.call(a.observer, u, a.observer);
            }),
            a.activeTargets.splice(0, a.activeTargets.length);
        }
      });
      for (var n = 0, r = t; n < r.length; n++) {
        var i = r[n];
        i();
      }
      return e;
    },
    fd = function (e) {
      zr.forEach(function (n) {
        n.activeTargets.splice(0, n.activeTargets.length),
          n.skippedTargets.splice(0, n.skippedTargets.length),
          n.observationTargets.forEach(function (i) {
            i.isActive() &&
              (cd(i.target) > e
                ? n.activeTargets.push(i)
                : n.skippedTargets.push(i));
          });
      });
    },
    q0 = function () {
      var e = 0;
      for (fd(e); L0(); ) (e = U0()), fd(e);
      return G0() && j0(), e > 0;
    },
    ns,
    dd = [],
    Y0 = function () {
      return dd.splice(0).forEach(function (e) {
        return e();
      });
    },
    X0 = function (e) {
      if (!ns) {
        var t = 0,
          n = document.createTextNode(""),
          r = { characterData: !0 };
        new MutationObserver(function () {
          return Y0();
        }).observe(n, r),
          (ns = function () {
            n.textContent = "".concat(t ? t-- : t++);
          });
      }
      dd.push(e), ns();
    },
    K0 = function (e) {
      X0(function () {
        requestAnimationFrame(e);
      });
    },
    Jo = 0,
    Q0 = function () {
      return !!Jo;
    },
    Z0 = 250,
    J0 = { attributes: !0, characterData: !0, childList: !0, subtree: !0 },
    hd = [
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
      "focus",
    ],
    pd = function (e) {
      return e === void 0 && (e = 0), Date.now() + e;
    },
    rs = !1,
    ey = (function () {
      function e() {
        var t = this;
        (this.stopped = !0),
          (this.listener = function () {
            return t.schedule();
          });
      }
      return (
        (e.prototype.run = function (t) {
          var n = this;
          if ((t === void 0 && (t = Z0), !rs)) {
            rs = !0;
            var r = pd(t);
            K0(function () {
              var i = !1;
              try {
                i = q0();
              } finally {
                if (((rs = !1), (t = r - pd()), !Q0())) return;
                i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
              }
            });
          }
        }),
        (e.prototype.schedule = function () {
          this.stop(), this.run();
        }),
        (e.prototype.observe = function () {
          var t = this,
            n = function () {
              return t.observer && t.observer.observe(document.body, J0);
            };
          document.body ? n() : Ui.addEventListener("DOMContentLoaded", n);
        }),
        (e.prototype.start = function () {
          var t = this;
          this.stopped &&
            ((this.stopped = !1),
            (this.observer = new MutationObserver(this.listener)),
            this.observe(),
            hd.forEach(function (n) {
              return Ui.addEventListener(n, t.listener, !0);
            }));
        }),
        (e.prototype.stop = function () {
          var t = this;
          this.stopped ||
            (this.observer && this.observer.disconnect(),
            hd.forEach(function (n) {
              return Ui.removeEventListener(n, t.listener, !0);
            }),
            (this.stopped = !0));
        }),
        e
      );
    })(),
    is = new ey(),
    vd = function (e) {
      !Jo && e > 0 && is.start(), (Jo += e), !Jo && is.stop();
    },
    ty = function (e) {
      return !ts(e) && !H0(e) && getComputedStyle(e).display === "inline";
    },
    ny = (function () {
      function e(t, n) {
        (this.target = t),
          (this.observedBox = n || Vi.CONTENT_BOX),
          (this.lastReportedSize = { inlineSize: 0, blockSize: 0 });
      }
      return (
        (e.prototype.isActive = function () {
          var t = sd(this.target, this.observedBox, !0);
          return (
            ty(this.target) && (this.lastReportedSize = t),
            this.lastReportedSize.inlineSize !== t.inlineSize ||
              this.lastReportedSize.blockSize !== t.blockSize
          );
        }),
        e
      );
    })(),
    ry = (function () {
      function e(t, n) {
        (this.activeTargets = []),
          (this.skippedTargets = []),
          (this.observationTargets = []),
          (this.observer = t),
          (this.callback = n);
      }
      return e;
    })(),
    ea = new WeakMap(),
    gd = function (e, t) {
      for (var n = 0; n < e.length; n += 1) if (e[n].target === t) return n;
      return -1;
    },
    ta = (function () {
      function e() {}
      return (
        (e.connect = function (t, n) {
          var r = new ry(t, n);
          ea.set(t, r);
        }),
        (e.observe = function (t, n, r) {
          var i = ea.get(t),
            o = i.observationTargets.length === 0;
          gd(i.observationTargets, n) < 0 &&
            (o && zr.push(i),
            i.observationTargets.push(new ny(n, r && r.box)),
            vd(1),
            is.schedule());
        }),
        (e.unobserve = function (t, n) {
          var r = ea.get(t),
            i = gd(r.observationTargets, n),
            o = r.observationTargets.length === 1;
          i >= 0 &&
            (o && zr.splice(zr.indexOf(r), 1),
            r.observationTargets.splice(i, 1),
            vd(-1));
        }),
        (e.disconnect = function (t) {
          var n = this,
            r = ea.get(t);
          r.observationTargets.slice().forEach(function (i) {
            return n.unobserve(t, i.target);
          }),
            r.activeTargets.splice(0, r.activeTargets.length);
        }),
        e
      );
    })(),
    iy = (function () {
      function e(t) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present."
          );
        if (typeof t != "function")
          throw new TypeError(
            "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function."
          );
        ta.connect(this, t);
      }
      return (
        (e.prototype.observe = function (t, n) {
          if (arguments.length === 0)
            throw new TypeError(
              "Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present."
            );
          if (!id(t))
            throw new TypeError(
              "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element"
            );
          ta.observe(this, t, n);
        }),
        (e.prototype.unobserve = function (t) {
          if (arguments.length === 0)
            throw new TypeError(
              "Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present."
            );
          if (!id(t))
            throw new TypeError(
              "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element"
            );
          ta.unobserve(this, t);
        }),
        (e.prototype.disconnect = function () {
          ta.disconnect(this);
        }),
        (e.toString = function () {
          return "function ResizeObserver () { [polyfill code] }";
        }),
        e
      );
    })();
  const oy = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        ResizeObserver: iy,
        ResizeObserverEntry: ld,
        ResizeObserverSize: td,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  var ay =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/responsive/esm/components/ParentSizeModern.js",
    uy = [
      "className",
      "children",
      "debounceTime",
      "ignoreDimensions",
      "parentSizeStyles",
      "enableDebounceLeadingCall",
    ];
  function os() {
    return (
      (os =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      os.apply(this, arguments)
    );
  }
  function sy(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  var ly = [];
  function md(e) {
    var t = e.className,
      n = e.children,
      r = e.debounceTime,
      i = r === void 0 ? 300 : r,
      o = e.ignoreDimensions,
      a = o === void 0 ? ly : o,
      u = e.parentSizeStyles,
      f = u === void 0 ? { width: "100%", height: "100%" } : u,
      c = e.enableDebounceLeadingCall,
      p = c === void 0 ? !0 : c,
      h = sy(e, uy),
      w = Y.useRef(null),
      T = Y.useRef(0),
      _ = Y.useState({ width: 0, height: 0, top: 0, left: 0 }),
      P = _[0],
      I = _[1],
      k = Y.useMemo(
        function () {
          var F = Array.isArray(a) ? a : [a];
          return es(
            function (N) {
              I(function (G) {
                var M = Object.keys(G),
                  D = M.filter(function (Z) {
                    return G[Z] !== N[Z];
                  }),
                  ne = D.every(function (Z) {
                    return F.includes(Z);
                  });
                return ne ? G : N;
              });
            },
            i,
            { leading: p }
          );
        },
        [i, p, a]
      );
    return (
      Y.useEffect(
        function () {
          var F = new window.ResizeObserver(function (N) {
            N.forEach(function (G) {
              var M = G.contentRect,
                D = M.left,
                ne = M.top,
                Z = M.width,
                he = M.height;
              T.current = window.requestAnimationFrame(function () {
                k({ width: Z, height: he, top: ne, left: D });
              });
            });
          });
          return (
            w.current && F.observe(w.current),
            function () {
              window.cancelAnimationFrame(T.current),
                F.disconnect(),
                k.cancel();
            }
          );
        },
        [k]
      ),
      L(
        "div",
        {
          style: f,
          ref: w,
          className: t,
          ...h,
          children: n(os({}, P, { ref: w.current, resize: k })),
        },
        void 0,
        !1,
        { fileName: ay, lineNumber: 81, columnNumber: 23 },
        this
      )
    );
  }
  md.propTypes = {
    className: Ae.exports.string,
    debounceTime: Ae.exports.number,
    enableDebounceLeadingCall: Ae.exports.bool,
    ignoreDimensions: Ae.exports.oneOfType([
      Ae.exports.any,
      Ae.exports.arrayOf(Ae.exports.any),
    ]),
    children: Ae.exports.func.isRequired,
  };
  var na = { exports: {} };
  /*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/ (function (e) {
    (function () {
      var t = {}.hasOwnProperty;
      function n() {
        for (var r = [], i = 0; i < arguments.length; i++) {
          var o = arguments[i];
          if (!!o) {
            var a = typeof o;
            if (a === "string" || a === "number") r.push(o);
            else if (Array.isArray(o)) {
              if (o.length) {
                var u = n.apply(null, o);
                u && r.push(u);
              }
            } else if (a === "object")
              if (o.toString === Object.prototype.toString)
                for (var f in o) t.call(o, f) && o[f] && r.push(f);
              else r.push(o.toString());
          }
        }
        return r.join(" ");
      }
      e.exports ? ((n.default = n), (e.exports = n)) : (window.classNames = n);
    })();
  })(na);
  const cy = na.exports;
  function as(e, t, n) {
    var r, i, o, a, u;
    t == null && (t = 100);
    function f() {
      var p = Date.now() - a;
      p < t && p >= 0
        ? (r = setTimeout(f, t - p))
        : ((r = null), n || ((u = e.apply(o, i)), (o = i = null)));
    }
    var c = function () {
      (o = this), (i = arguments), (a = Date.now());
      var p = n && !r;
      return (
        r || (r = setTimeout(f, t)),
        p && ((u = e.apply(o, i)), (o = i = null)),
        u
      );
    };
    return (
      (c.clear = function () {
        r && (clearTimeout(r), (r = null));
      }),
      (c.flush = function () {
        r && ((u = e.apply(o, i)), (o = i = null), clearTimeout(r), (r = null));
      }),
      c
    );
  }
  as.debounce = as;
  var yd = as;
  function fy(e) {
    let {
      debounce: t,
      scroll: n,
      polyfill: r,
      offsetSize: i,
    } = e === void 0 ? { debounce: 0, scroll: !1, offsetSize: !1 } : e;
    const o = r || (typeof window > "u" ? class {} : window.ResizeObserver);
    if (!o)
      throw new Error(
        "This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills"
      );
    const [a, u] = Y.useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
      }),
      f = Y.useRef({
        element: null,
        scrollContainers: null,
        resizeObserver: null,
        lastBounds: a,
      }),
      c = t ? (typeof t == "number" ? t : t.scroll) : null,
      p = t ? (typeof t == "number" ? t : t.resize) : null,
      h = Y.useRef(!1);
    Y.useEffect(() => ((h.current = !0), () => void (h.current = !1)));
    const [w, T, _] = Y.useMemo(() => {
      const F = () => {
        if (!f.current.element) return;
        const {
            left: N,
            top: G,
            width: M,
            height: D,
            bottom: ne,
            right: Z,
            x: he,
            y: me,
          } = f.current.element.getBoundingClientRect(),
          ie = {
            left: N,
            top: G,
            width: M,
            height: D,
            bottom: ne,
            right: Z,
            x: he,
            y: me,
          };
        f.current.element instanceof HTMLElement &&
          i &&
          ((ie.height = f.current.element.offsetHeight),
          (ie.width = f.current.element.offsetWidth)),
          Object.freeze(ie),
          h.current &&
            !vy(f.current.lastBounds, ie) &&
            u((f.current.lastBounds = ie));
      };
      return [F, p ? yd(F, p) : F, c ? yd(F, c) : F];
    }, [u, i, c, p]);
    function P() {
      f.current.scrollContainers &&
        (f.current.scrollContainers.forEach((F) =>
          F.removeEventListener("scroll", _, !0)
        ),
        (f.current.scrollContainers = null)),
        f.current.resizeObserver &&
          (f.current.resizeObserver.disconnect(),
          (f.current.resizeObserver = null));
    }
    function I() {
      !f.current.element ||
        ((f.current.resizeObserver = new o(_)),
        f.current.resizeObserver.observe(f.current.element),
        n &&
          f.current.scrollContainers &&
          f.current.scrollContainers.forEach((F) =>
            F.addEventListener("scroll", _, { capture: !0, passive: !0 })
          ));
    }
    const k = (F) => {
      !F ||
        F === f.current.element ||
        (P(),
        (f.current.element = F),
        (f.current.scrollContainers = bd(F)),
        I());
    };
    return (
      hy(_, Boolean(n)),
      dy(T),
      Y.useEffect(() => {
        P(), I();
      }, [n, _, T]),
      Y.useEffect(() => P, []),
      [k, a, w]
    );
  }
  function dy(e) {
    Y.useEffect(() => {
      const t = e;
      return (
        window.addEventListener("resize", t),
        () => void window.removeEventListener("resize", t)
      );
    }, [e]);
  }
  function hy(e, t) {
    Y.useEffect(() => {
      if (t) {
        const n = e;
        return (
          window.addEventListener("scroll", n, { capture: !0, passive: !0 }),
          () => void window.removeEventListener("scroll", n, !0)
        );
      }
    }, [e, t]);
  }
  function bd(e) {
    const t = [];
    if (!e || e === document.body) return t;
    const {
      overflow: n,
      overflowX: r,
      overflowY: i,
    } = window.getComputedStyle(e);
    return (
      [n, r, i].some((o) => o === "auto" || o === "scroll") && t.push(e),
      [...t, ...bd(e.parentElement)]
    );
  }
  const py = ["x", "y", "top", "bottom", "left", "right", "width", "height"],
    vy = (e, t) => py.every((n) => e[n] === t[n]);
  function wd(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var xd = (function () {
    function e(n) {
      var r = n.x,
        i = r === void 0 ? 0 : r,
        o = n.y,
        a = o === void 0 ? 0 : o;
      wd(this, "x", 0), wd(this, "y", 0), (this.x = i), (this.y = a);
    }
    var t = e.prototype;
    return (
      (t.value = function () {
        return { x: this.x, y: this.y };
      }),
      (t.toArray = function () {
        return [this.x, this.y];
      }),
      e
    );
  })();
  function gy(e) {
    return !!e && e instanceof Element;
  }
  function my(e) {
    return !!e && (e instanceof SVGElement || "ownerSVGElement" in e);
  }
  function yy(e) {
    return !!e && "createSVGPoint" in e;
  }
  function by(e) {
    return !!e && "getScreenCTM" in e;
  }
  function wy(e) {
    return !!e && "changedTouches" in e;
  }
  function xy(e) {
    return !!e && "clientX" in e;
  }
  function _y(e) {
    return (
      !!e &&
      (e instanceof Event ||
        ("nativeEvent" in e && e.nativeEvent instanceof Event))
    );
  }
  function qi() {
    return (
      (qi =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      qi.apply(this, arguments)
    );
  }
  var us = { x: 0, y: 0 };
  function Sy(e) {
    if (!e) return qi({}, us);
    if (wy(e))
      return e.changedTouches.length > 0
        ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        : qi({}, us);
    if (xy(e)) return { x: e.clientX, y: e.clientY };
    var t = e == null ? void 0 : e.target,
      n = t && "getBoundingClientRect" in t ? t.getBoundingClientRect() : null;
    return n ? { x: n.x + n.width / 2, y: n.y + n.height / 2 } : qi({}, us);
  }
  function _d(e, t) {
    if (!e || !t) return null;
    var n = Sy(t),
      r = my(e) ? e.ownerSVGElement : e,
      i = by(r) ? r.getScreenCTM() : null;
    if (yy(r) && i) {
      var o = r.createSVGPoint();
      return (
        (o.x = n.x),
        (o.y = n.y),
        (o = o.matrixTransform(i.inverse())),
        new xd({ x: o.x, y: o.y })
      );
    }
    var a = e.getBoundingClientRect();
    return new xd({
      x: n.x - a.left - e.clientLeft,
      y: n.y - a.top - e.clientTop,
    });
  }
  function Ry(e, t) {
    if (gy(e) && t) return _d(e, t);
    if (_y(e)) {
      var n = e,
        r = n.target;
      if (r) return _d(r, n);
    }
    return null;
  }
  var ss = Math.PI,
    ls = 2 * ss,
    Gr = 1e-6,
    Cy = ls - Gr;
  function cs() {
    (this._x0 = this._y0 = this._x1 = this._y1 = null), (this._ = "");
  }
  function fi() {
    return new cs();
  }
  cs.prototype = fi.prototype = {
    constructor: cs,
    moveTo: function (e, t) {
      this._ +=
        "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t);
    },
    closePath: function () {
      this._x1 !== null &&
        ((this._x1 = this._x0), (this._y1 = this._y0), (this._ += "Z"));
    },
    lineTo: function (e, t) {
      this._ += "L" + (this._x1 = +e) + "," + (this._y1 = +t);
    },
    quadraticCurveTo: function (e, t, n, r) {
      this._ +=
        "Q" + +e + "," + +t + "," + (this._x1 = +n) + "," + (this._y1 = +r);
    },
    bezierCurveTo: function (e, t, n, r, i, o) {
      this._ +=
        "C" +
        +e +
        "," +
        +t +
        "," +
        +n +
        "," +
        +r +
        "," +
        (this._x1 = +i) +
        "," +
        (this._y1 = +o);
    },
    arcTo: function (e, t, n, r, i) {
      (e = +e), (t = +t), (n = +n), (r = +r), (i = +i);
      var o = this._x1,
        a = this._y1,
        u = n - e,
        f = r - t,
        c = o - e,
        p = a - t,
        h = c * c + p * p;
      if (i < 0) throw new Error("negative radius: " + i);
      if (this._x1 === null)
        this._ += "M" + (this._x1 = e) + "," + (this._y1 = t);
      else if (h > Gr)
        if (!(Math.abs(p * u - f * c) > Gr) || !i)
          this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
        else {
          var w = n - o,
            T = r - a,
            _ = u * u + f * f,
            P = w * w + T * T,
            I = Math.sqrt(_),
            k = Math.sqrt(h),
            F = i * Math.tan((ss - Math.acos((_ + h - P) / (2 * I * k))) / 2),
            N = F / k,
            G = F / I;
          Math.abs(N - 1) > Gr &&
            (this._ += "L" + (e + N * c) + "," + (t + N * p)),
            (this._ +=
              "A" +
              i +
              "," +
              i +
              ",0,0," +
              +(p * w > c * T) +
              "," +
              (this._x1 = e + G * u) +
              "," +
              (this._y1 = t + G * f));
        }
    },
    arc: function (e, t, n, r, i, o) {
      (e = +e), (t = +t), (n = +n), (o = !!o);
      var a = n * Math.cos(r),
        u = n * Math.sin(r),
        f = e + a,
        c = t + u,
        p = 1 ^ o,
        h = o ? r - i : i - r;
      if (n < 0) throw new Error("negative radius: " + n);
      this._x1 === null
        ? (this._ += "M" + f + "," + c)
        : (Math.abs(this._x1 - f) > Gr || Math.abs(this._y1 - c) > Gr) &&
          (this._ += "L" + f + "," + c),
        n &&
          (h < 0 && (h = (h % ls) + ls),
          h > Cy
            ? (this._ +=
                "A" +
                n +
                "," +
                n +
                ",0,1," +
                p +
                "," +
                (e - a) +
                "," +
                (t - u) +
                "A" +
                n +
                "," +
                n +
                ",0,1," +
                p +
                "," +
                (this._x1 = f) +
                "," +
                (this._y1 = c))
            : h > Gr &&
              (this._ +=
                "A" +
                n +
                "," +
                n +
                ",0," +
                +(h >= ss) +
                "," +
                p +
                "," +
                (this._x1 = e + n * Math.cos(i)) +
                "," +
                (this._y1 = t + n * Math.sin(i))));
    },
    rect: function (e, t, n, r) {
      this._ +=
        "M" +
        (this._x0 = this._x1 = +e) +
        "," +
        (this._y0 = this._y1 = +t) +
        "h" +
        +n +
        "v" +
        +r +
        "h" +
        -n +
        "Z";
    },
    toString: function () {
      return this._;
    },
  };
  function pt(e) {
    return function () {
      return e;
    };
  }
  var Sd = Math.abs,
    Qt = Math.atan2,
    jr = Math.cos,
    Ty = Math.max,
    fs = Math.min,
    Bn = Math.sin,
    di = Math.sqrt,
    Zt = 1e-12,
    hr = Math.PI,
    ra = hr / 2,
    pr = 2 * hr;
  function Py(e) {
    return e > 1 ? 0 : e < -1 ? hr : Math.acos(e);
  }
  function Rd(e) {
    return e >= 1 ? ra : e <= -1 ? -ra : Math.asin(e);
  }
  function Ny(e) {
    return e.innerRadius;
  }
  function Ey(e) {
    return e.outerRadius;
  }
  function My(e) {
    return e.startAngle;
  }
  function Oy(e) {
    return e.endAngle;
  }
  function Ay(e) {
    return e && e.padAngle;
  }
  function ky(e, t, n, r, i, o, a, u) {
    var f = n - e,
      c = r - t,
      p = a - i,
      h = u - o,
      w = h * f - p * c;
    if (!(w * w < Zt))
      return (w = (p * (t - o) - h * (e - i)) / w), [e + w * f, t + w * c];
  }
  function ia(e, t, n, r, i, o, a) {
    var u = e - n,
      f = t - r,
      c = (a ? o : -o) / di(u * u + f * f),
      p = c * f,
      h = -c * u,
      w = e + p,
      T = t + h,
      _ = n + p,
      P = r + h,
      I = (w + _) / 2,
      k = (T + P) / 2,
      F = _ - w,
      N = P - T,
      G = F * F + N * N,
      M = i - o,
      D = w * P - _ * T,
      ne = (N < 0 ? -1 : 1) * di(Ty(0, M * M * G - D * D)),
      Z = (D * N - F * ne) / G,
      he = (-D * F - N * ne) / G,
      me = (D * N + F * ne) / G,
      ie = (-D * F + N * ne) / G,
      te = Z - I,
      we = he - k,
      ke = me - I,
      st = ie - k;
    return (
      te * te + we * we > ke * ke + st * st && ((Z = me), (he = ie)),
      {
        cx: Z,
        cy: he,
        x01: -p,
        y01: -h,
        x11: Z * (i / M - 1),
        y11: he * (i / M - 1),
      }
    );
  }
  function $y() {
    var e = Ny,
      t = Ey,
      n = pt(0),
      r = null,
      i = My,
      o = Oy,
      a = Ay,
      u = null;
    function f() {
      var c,
        p,
        h = +e.apply(this, arguments),
        w = +t.apply(this, arguments),
        T = i.apply(this, arguments) - ra,
        _ = o.apply(this, arguments) - ra,
        P = Sd(_ - T),
        I = _ > T;
      if (
        (u || (u = c = fi()), w < h && ((p = w), (w = h), (h = p)), !(w > Zt))
      )
        u.moveTo(0, 0);
      else if (P > pr - Zt)
        u.moveTo(w * jr(T), w * Bn(T)),
          u.arc(0, 0, w, T, _, !I),
          h > Zt && (u.moveTo(h * jr(_), h * Bn(_)), u.arc(0, 0, h, _, T, I));
      else {
        var k = T,
          F = _,
          N = T,
          G = _,
          M = P,
          D = P,
          ne = a.apply(this, arguments) / 2,
          Z = ne > Zt && (r ? +r.apply(this, arguments) : di(h * h + w * w)),
          he = fs(Sd(w - h) / 2, +n.apply(this, arguments)),
          me = he,
          ie = he,
          te,
          we;
        if (Z > Zt) {
          var ke = Rd((Z / h) * Bn(ne)),
            st = Rd((Z / w) * Bn(ne));
          (M -= ke * 2) > Zt
            ? ((ke *= I ? 1 : -1), (N += ke), (G -= ke))
            : ((M = 0), (N = G = (T + _) / 2)),
            (D -= st * 2) > Zt
              ? ((st *= I ? 1 : -1), (k += st), (F -= st))
              : ((D = 0), (k = F = (T + _) / 2));
        }
        var Ue = w * jr(k),
          lt = w * Bn(k),
          ct = h * jr(G),
          ht = h * Bn(G);
        if (he > Zt) {
          var U = w * jr(F),
            se = w * Bn(F),
            Ne = h * jr(N),
            $e = h * Bn(N),
            Te;
          if (P < hr && (Te = ky(Ue, lt, Ne, $e, U, se, ct, ht))) {
            var Ce = Ue - Te[0],
              Ee = lt - Te[1],
              De = U - Te[0],
              Ge = se - Te[1],
              K =
                1 /
                Bn(
                  Py(
                    (Ce * De + Ee * Ge) /
                      (di(Ce * Ce + Ee * Ee) * di(De * De + Ge * Ge))
                  ) / 2
                ),
              fe = di(Te[0] * Te[0] + Te[1] * Te[1]);
            (me = fs(he, (h - fe) / (K - 1))),
              (ie = fs(he, (w - fe) / (K + 1)));
          }
        }
        D > Zt
          ? ie > Zt
            ? ((te = ia(Ne, $e, Ue, lt, w, ie, I)),
              (we = ia(U, se, ct, ht, w, ie, I)),
              u.moveTo(te.cx + te.x01, te.cy + te.y01),
              ie < he
                ? u.arc(
                    te.cx,
                    te.cy,
                    ie,
                    Qt(te.y01, te.x01),
                    Qt(we.y01, we.x01),
                    !I
                  )
                : (u.arc(
                    te.cx,
                    te.cy,
                    ie,
                    Qt(te.y01, te.x01),
                    Qt(te.y11, te.x11),
                    !I
                  ),
                  u.arc(
                    0,
                    0,
                    w,
                    Qt(te.cy + te.y11, te.cx + te.x11),
                    Qt(we.cy + we.y11, we.cx + we.x11),
                    !I
                  ),
                  u.arc(
                    we.cx,
                    we.cy,
                    ie,
                    Qt(we.y11, we.x11),
                    Qt(we.y01, we.x01),
                    !I
                  )))
            : (u.moveTo(Ue, lt), u.arc(0, 0, w, k, F, !I))
          : u.moveTo(Ue, lt),
          !(h > Zt) || !(M > Zt)
            ? u.lineTo(ct, ht)
            : me > Zt
            ? ((te = ia(ct, ht, U, se, h, -me, I)),
              (we = ia(Ue, lt, Ne, $e, h, -me, I)),
              u.lineTo(te.cx + te.x01, te.cy + te.y01),
              me < he
                ? u.arc(
                    te.cx,
                    te.cy,
                    me,
                    Qt(te.y01, te.x01),
                    Qt(we.y01, we.x01),
                    !I
                  )
                : (u.arc(
                    te.cx,
                    te.cy,
                    me,
                    Qt(te.y01, te.x01),
                    Qt(te.y11, te.x11),
                    !I
                  ),
                  u.arc(
                    0,
                    0,
                    h,
                    Qt(te.cy + te.y11, te.cx + te.x11),
                    Qt(we.cy + we.y11, we.cx + we.x11),
                    I
                  ),
                  u.arc(
                    we.cx,
                    we.cy,
                    me,
                    Qt(we.y11, we.x11),
                    Qt(we.y01, we.x01),
                    !I
                  )))
            : u.arc(0, 0, h, G, N, I);
      }
      if ((u.closePath(), c)) return (u = null), c + "" || null;
    }
    return (
      (f.centroid = function () {
        var c = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2,
          p =
            (+i.apply(this, arguments) + +o.apply(this, arguments)) / 2 -
            hr / 2;
        return [jr(p) * c, Bn(p) * c];
      }),
      (f.innerRadius = function (c) {
        return arguments.length
          ? ((e = typeof c == "function" ? c : pt(+c)), f)
          : e;
      }),
      (f.outerRadius = function (c) {
        return arguments.length
          ? ((t = typeof c == "function" ? c : pt(+c)), f)
          : t;
      }),
      (f.cornerRadius = function (c) {
        return arguments.length
          ? ((n = typeof c == "function" ? c : pt(+c)), f)
          : n;
      }),
      (f.padRadius = function (c) {
        return arguments.length
          ? ((r = c == null ? null : typeof c == "function" ? c : pt(+c)), f)
          : r;
      }),
      (f.startAngle = function (c) {
        return arguments.length
          ? ((i = typeof c == "function" ? c : pt(+c)), f)
          : i;
      }),
      (f.endAngle = function (c) {
        return arguments.length
          ? ((o = typeof c == "function" ? c : pt(+c)), f)
          : o;
      }),
      (f.padAngle = function (c) {
        return arguments.length
          ? ((a = typeof c == "function" ? c : pt(+c)), f)
          : a;
      }),
      (f.context = function (c) {
        return arguments.length ? ((u = c == null ? null : c), f) : u;
      }),
      f
    );
  }
  function Cd(e) {
    this._context = e;
  }
  Cd.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      this._point = 0;
    },
    lineEnd: function () {
      (this._line || (this._line !== 0 && this._point === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1),
            this._line
              ? this._context.lineTo(e, t)
              : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
        default:
          this._context.lineTo(e, t);
          break;
      }
    },
  };
  function oa(e) {
    return new Cd(e);
  }
  function ds(e) {
    return e[0];
  }
  function hs(e) {
    return e[1];
  }
  function ps() {
    var e = ds,
      t = hs,
      n = pt(!0),
      r = null,
      i = oa,
      o = null;
    function a(u) {
      var f,
        c = u.length,
        p,
        h = !1,
        w;
      for (r == null && (o = i((w = fi()))), f = 0; f <= c; ++f)
        !(f < c && n((p = u[f]), f, u)) === h &&
          ((h = !h) ? o.lineStart() : o.lineEnd()),
          h && o.point(+e(p, f, u), +t(p, f, u));
      if (w) return (o = null), w + "" || null;
    }
    return (
      (a.x = function (u) {
        return arguments.length
          ? ((e = typeof u == "function" ? u : pt(+u)), a)
          : e;
      }),
      (a.y = function (u) {
        return arguments.length
          ? ((t = typeof u == "function" ? u : pt(+u)), a)
          : t;
      }),
      (a.defined = function (u) {
        return arguments.length
          ? ((n = typeof u == "function" ? u : pt(!!u)), a)
          : n;
      }),
      (a.curve = function (u) {
        return arguments.length ? ((i = u), r != null && (o = i(r)), a) : i;
      }),
      (a.context = function (u) {
        return arguments.length
          ? (u == null ? (r = o = null) : (o = i((r = u))), a)
          : r;
      }),
      a
    );
  }
  function Td() {
    var e = ds,
      t = null,
      n = pt(0),
      r = hs,
      i = pt(!0),
      o = null,
      a = oa,
      u = null;
    function f(p) {
      var h,
        w,
        T,
        _ = p.length,
        P,
        I = !1,
        k,
        F = new Array(_),
        N = new Array(_);
      for (o == null && (u = a((k = fi()))), h = 0; h <= _; ++h) {
        if (!(h < _ && i((P = p[h]), h, p)) === I)
          if ((I = !I)) (w = h), u.areaStart(), u.lineStart();
          else {
            for (u.lineEnd(), u.lineStart(), T = h - 1; T >= w; --T)
              u.point(F[T], N[T]);
            u.lineEnd(), u.areaEnd();
          }
        I &&
          ((F[h] = +e(P, h, p)),
          (N[h] = +n(P, h, p)),
          u.point(t ? +t(P, h, p) : F[h], r ? +r(P, h, p) : N[h]));
      }
      if (k) return (u = null), k + "" || null;
    }
    function c() {
      return ps().defined(i).curve(a).context(o);
    }
    return (
      (f.x = function (p) {
        return arguments.length
          ? ((e = typeof p == "function" ? p : pt(+p)), (t = null), f)
          : e;
      }),
      (f.x0 = function (p) {
        return arguments.length
          ? ((e = typeof p == "function" ? p : pt(+p)), f)
          : e;
      }),
      (f.x1 = function (p) {
        return arguments.length
          ? ((t = p == null ? null : typeof p == "function" ? p : pt(+p)), f)
          : t;
      }),
      (f.y = function (p) {
        return arguments.length
          ? ((n = typeof p == "function" ? p : pt(+p)), (r = null), f)
          : n;
      }),
      (f.y0 = function (p) {
        return arguments.length
          ? ((n = typeof p == "function" ? p : pt(+p)), f)
          : n;
      }),
      (f.y1 = function (p) {
        return arguments.length
          ? ((r = p == null ? null : typeof p == "function" ? p : pt(+p)), f)
          : r;
      }),
      (f.lineX0 = f.lineY0 =
        function () {
          return c().x(e).y(n);
        }),
      (f.lineY1 = function () {
        return c().x(e).y(r);
      }),
      (f.lineX1 = function () {
        return c().x(t).y(n);
      }),
      (f.defined = function (p) {
        return arguments.length
          ? ((i = typeof p == "function" ? p : pt(!!p)), f)
          : i;
      }),
      (f.curve = function (p) {
        return arguments.length ? ((a = p), o != null && (u = a(o)), f) : a;
      }),
      (f.context = function (p) {
        return arguments.length
          ? (p == null ? (o = u = null) : (u = a((o = p))), f)
          : o;
      }),
      f
    );
  }
  function Fy(e, t) {
    return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
  }
  function Iy(e) {
    return e;
  }
  function By() {
    var e = Iy,
      t = Fy,
      n = null,
      r = pt(0),
      i = pt(pr),
      o = pt(0);
    function a(u) {
      var f,
        c = u.length,
        p,
        h,
        w = 0,
        T = new Array(c),
        _ = new Array(c),
        P = +r.apply(this, arguments),
        I = Math.min(pr, Math.max(-pr, i.apply(this, arguments) - P)),
        k,
        F = Math.min(Math.abs(I) / c, o.apply(this, arguments)),
        N = F * (I < 0 ? -1 : 1),
        G;
      for (f = 0; f < c; ++f)
        (G = _[(T[f] = f)] = +e(u[f], f, u)) > 0 && (w += G);
      for (
        t != null
          ? T.sort(function (M, D) {
              return t(_[M], _[D]);
            })
          : n != null &&
            T.sort(function (M, D) {
              return n(u[M], u[D]);
            }),
          f = 0,
          h = w ? (I - c * N) / w : 0;
        f < c;
        ++f, P = k
      )
        (p = T[f]),
          (G = _[p]),
          (k = P + (G > 0 ? G * h : 0) + N),
          (_[p] = {
            data: u[p],
            index: f,
            value: G,
            startAngle: P,
            endAngle: k,
            padAngle: F,
          });
      return _;
    }
    return (
      (a.value = function (u) {
        return arguments.length
          ? ((e = typeof u == "function" ? u : pt(+u)), a)
          : e;
      }),
      (a.sortValues = function (u) {
        return arguments.length ? ((t = u), (n = null), a) : t;
      }),
      (a.sort = function (u) {
        return arguments.length ? ((n = u), (t = null), a) : n;
      }),
      (a.startAngle = function (u) {
        return arguments.length
          ? ((r = typeof u == "function" ? u : pt(+u)), a)
          : r;
      }),
      (a.endAngle = function (u) {
        return arguments.length
          ? ((i = typeof u == "function" ? u : pt(+u)), a)
          : i;
      }),
      (a.padAngle = function (u) {
        return arguments.length
          ? ((o = typeof u == "function" ? u : pt(+u)), a)
          : o;
      }),
      a
    );
  }
  var Pd = vs(oa);
  function Nd(e) {
    this._curve = e;
  }
  Nd.prototype = {
    areaStart: function () {
      this._curve.areaStart();
    },
    areaEnd: function () {
      this._curve.areaEnd();
    },
    lineStart: function () {
      this._curve.lineStart();
    },
    lineEnd: function () {
      this._curve.lineEnd();
    },
    point: function (e, t) {
      this._curve.point(t * Math.sin(e), t * -Math.cos(e));
    },
  };
  function vs(e) {
    function t(n) {
      return new Nd(e(n));
    }
    return (t._curve = e), t;
  }
  function Yi(e) {
    var t = e.curve;
    return (
      (e.angle = e.x),
      delete e.x,
      (e.radius = e.y),
      delete e.y,
      (e.curve = function (n) {
        return arguments.length ? t(vs(n)) : t()._curve;
      }),
      e
    );
  }
  function Ed() {
    return Yi(ps().curve(Pd));
  }
  function Md() {
    var e = Td().curve(Pd),
      t = e.curve,
      n = e.lineX0,
      r = e.lineX1,
      i = e.lineY0,
      o = e.lineY1;
    return (
      (e.angle = e.x),
      delete e.x,
      (e.startAngle = e.x0),
      delete e.x0,
      (e.endAngle = e.x1),
      delete e.x1,
      (e.radius = e.y),
      delete e.y,
      (e.innerRadius = e.y0),
      delete e.y0,
      (e.outerRadius = e.y1),
      delete e.y1,
      (e.lineStartAngle = function () {
        return Yi(n());
      }),
      delete e.lineX0,
      (e.lineEndAngle = function () {
        return Yi(r());
      }),
      delete e.lineX1,
      (e.lineInnerRadius = function () {
        return Yi(i());
      }),
      delete e.lineY0,
      (e.lineOuterRadius = function () {
        return Yi(o());
      }),
      delete e.lineY1,
      (e.curve = function (a) {
        return arguments.length ? t(vs(a)) : t()._curve;
      }),
      e
    );
  }
  function Xi(e, t) {
    return [(t = +t) * Math.cos((e -= Math.PI / 2)), t * Math.sin(e)];
  }
  var gs = Array.prototype.slice;
  function Dy(e) {
    return e.source;
  }
  function zy(e) {
    return e.target;
  }
  function ms(e) {
    var t = Dy,
      n = zy,
      r = ds,
      i = hs,
      o = null;
    function a() {
      var u,
        f = gs.call(arguments),
        c = t.apply(this, f),
        p = n.apply(this, f);
      if (
        (o || (o = u = fi()),
        e(
          o,
          +r.apply(this, ((f[0] = c), f)),
          +i.apply(this, f),
          +r.apply(this, ((f[0] = p), f)),
          +i.apply(this, f)
        ),
        u)
      )
        return (o = null), u + "" || null;
    }
    return (
      (a.source = function (u) {
        return arguments.length ? ((t = u), a) : t;
      }),
      (a.target = function (u) {
        return arguments.length ? ((n = u), a) : n;
      }),
      (a.x = function (u) {
        return arguments.length
          ? ((r = typeof u == "function" ? u : pt(+u)), a)
          : r;
      }),
      (a.y = function (u) {
        return arguments.length
          ? ((i = typeof u == "function" ? u : pt(+u)), a)
          : i;
      }),
      (a.context = function (u) {
        return arguments.length ? ((o = u == null ? null : u), a) : o;
      }),
      a
    );
  }
  function Ly(e, t, n, r, i) {
    e.moveTo(t, n), e.bezierCurveTo((t = (t + r) / 2), n, t, i, r, i);
  }
  function Gy(e, t, n, r, i) {
    e.moveTo(t, n), e.bezierCurveTo(t, (n = (n + i) / 2), r, n, r, i);
  }
  function jy(e, t, n, r, i) {
    var o = Xi(t, n),
      a = Xi(t, (n = (n + i) / 2)),
      u = Xi(r, n),
      f = Xi(r, i);
    e.moveTo(o[0], o[1]), e.bezierCurveTo(a[0], a[1], u[0], u[1], f[0], f[1]);
  }
  function Hy() {
    return ms(Ly);
  }
  function Wy() {
    return ms(Gy);
  }
  function Vy() {
    var e = ms(jy);
    return (e.angle = e.x), delete e.x, (e.radius = e.y), delete e.y, e;
  }
  const ys = {
      draw: function (e, t) {
        var n = Math.sqrt(t / hr);
        e.moveTo(n, 0), e.arc(0, 0, n, 0, pr);
      },
    },
    Od = {
      draw: function (e, t) {
        var n = Math.sqrt(t / 5) / 2;
        e.moveTo(-3 * n, -n),
          e.lineTo(-n, -n),
          e.lineTo(-n, -3 * n),
          e.lineTo(n, -3 * n),
          e.lineTo(n, -n),
          e.lineTo(3 * n, -n),
          e.lineTo(3 * n, n),
          e.lineTo(n, n),
          e.lineTo(n, 3 * n),
          e.lineTo(-n, 3 * n),
          e.lineTo(-n, n),
          e.lineTo(-3 * n, n),
          e.closePath();
      },
    };
  var Ad = Math.sqrt(1 / 3),
    Uy = Ad * 2;
  const kd = {
    draw: function (e, t) {
      var n = Math.sqrt(t / Uy),
        r = n * Ad;
      e.moveTo(0, -n),
        e.lineTo(r, 0),
        e.lineTo(0, n),
        e.lineTo(-r, 0),
        e.closePath();
    },
  };
  var qy = 0.8908130915292852,
    $d = Math.sin(hr / 10) / Math.sin((7 * hr) / 10),
    Yy = Math.sin(pr / 10) * $d,
    Xy = -Math.cos(pr / 10) * $d;
  const Fd = {
      draw: function (e, t) {
        var n = Math.sqrt(t * qy),
          r = Yy * n,
          i = Xy * n;
        e.moveTo(0, -n), e.lineTo(r, i);
        for (var o = 1; o < 5; ++o) {
          var a = (pr * o) / 5,
            u = Math.cos(a),
            f = Math.sin(a);
          e.lineTo(f * n, -u * n), e.lineTo(u * r - f * i, f * r + u * i);
        }
        e.closePath();
      },
    },
    Id = {
      draw: function (e, t) {
        var n = Math.sqrt(t),
          r = -n / 2;
        e.rect(r, r, n, n);
      },
    };
  var bs = Math.sqrt(3);
  const Bd = {
    draw: function (e, t) {
      var n = -Math.sqrt(t / (bs * 3));
      e.moveTo(0, n * 2),
        e.lineTo(-bs * n, -n),
        e.lineTo(bs * n, -n),
        e.closePath();
    },
  };
  var pn = -0.5,
    vn = Math.sqrt(3) / 2,
    ws = 1 / Math.sqrt(12),
    Ky = (ws / 2 + 1) * 3;
  const Dd = {
    draw: function (e, t) {
      var n = Math.sqrt(t / Ky),
        r = n / 2,
        i = n * ws,
        o = r,
        a = n * ws + n,
        u = -o,
        f = a;
      e.moveTo(r, i),
        e.lineTo(o, a),
        e.lineTo(u, f),
        e.lineTo(pn * r - vn * i, vn * r + pn * i),
        e.lineTo(pn * o - vn * a, vn * o + pn * a),
        e.lineTo(pn * u - vn * f, vn * u + pn * f),
        e.lineTo(pn * r + vn * i, pn * i - vn * r),
        e.lineTo(pn * o + vn * a, pn * a - vn * o),
        e.lineTo(pn * u + vn * f, pn * f - vn * u),
        e.closePath();
    },
  };
  var Qy = [ys, Od, kd, Id, Fd, Bd, Dd];
  function Zy() {
    var e = pt(ys),
      t = pt(64),
      n = null;
    function r() {
      var i;
      if (
        (n || (n = i = fi()),
        e.apply(this, arguments).draw(n, +t.apply(this, arguments)),
        i)
      )
        return (n = null), i + "" || null;
    }
    return (
      (r.type = function (i) {
        return arguments.length
          ? ((e = typeof i == "function" ? i : pt(i)), r)
          : e;
      }),
      (r.size = function (i) {
        return arguments.length
          ? ((t = typeof i == "function" ? i : pt(+i)), r)
          : t;
      }),
      (r.context = function (i) {
        return arguments.length ? ((n = i == null ? null : i), r) : n;
      }),
      r
    );
  }
  function vr() {}
  function aa(e, t, n) {
    e._context.bezierCurveTo(
      (2 * e._x0 + e._x1) / 3,
      (2 * e._y0 + e._y1) / 3,
      (e._x0 + 2 * e._x1) / 3,
      (e._y0 + 2 * e._y1) / 3,
      (e._x0 + 4 * e._x1 + t) / 6,
      (e._y0 + 4 * e._y1 + n) / 6
    );
  }
  function ua(e) {
    this._context = e;
  }
  ua.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0);
    },
    lineEnd: function () {
      switch (this._point) {
        case 3:
          aa(this, this._x1, this._y1);
        case 2:
          this._context.lineTo(this._x1, this._y1);
          break;
      }
      (this._line || (this._line !== 0 && this._point === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1),
            this._line
              ? this._context.lineTo(e, t)
              : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          (this._point = 3),
            this._context.lineTo(
              (5 * this._x0 + this._x1) / 6,
              (5 * this._y0 + this._y1) / 6
            );
        default:
          aa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = e),
        (this._y0 = this._y1),
        (this._y1 = t);
    },
  };
  function Jy(e) {
    return new ua(e);
  }
  function zd(e) {
    this._context = e;
  }
  zd.prototype = {
    areaStart: vr,
    areaEnd: vr,
    lineStart: function () {
      (this._x0 =
        this._x1 =
        this._x2 =
        this._x3 =
        this._x4 =
        this._y0 =
        this._y1 =
        this._y2 =
        this._y3 =
        this._y4 =
          NaN),
        (this._point = 0);
    },
    lineEnd: function () {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x2, this._y2), this._context.closePath();
          break;
        }
        case 2: {
          this._context.moveTo(
            (this._x2 + 2 * this._x3) / 3,
            (this._y2 + 2 * this._y3) / 3
          ),
            this._context.lineTo(
              (this._x3 + 2 * this._x2) / 3,
              (this._y3 + 2 * this._y2) / 3
            ),
            this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x2, this._y2),
            this.point(this._x3, this._y3),
            this.point(this._x4, this._y4);
          break;
        }
      }
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1), (this._x2 = e), (this._y2 = t);
          break;
        case 1:
          (this._point = 2), (this._x3 = e), (this._y3 = t);
          break;
        case 2:
          (this._point = 3),
            (this._x4 = e),
            (this._y4 = t),
            this._context.moveTo(
              (this._x0 + 4 * this._x1 + e) / 6,
              (this._y0 + 4 * this._y1 + t) / 6
            );
          break;
        default:
          aa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = e),
        (this._y0 = this._y1),
        (this._y1 = t);
    },
  };
  function eb(e) {
    return new zd(e);
  }
  function Ld(e) {
    this._context = e;
  }
  Ld.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0);
    },
    lineEnd: function () {
      (this._line || (this._line !== 0 && this._point === 3)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          this._point = 1;
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3;
          var n = (this._x0 + 4 * this._x1 + e) / 6,
            r = (this._y0 + 4 * this._y1 + t) / 6;
          this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
          break;
        case 3:
          this._point = 4;
        default:
          aa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = e),
        (this._y0 = this._y1),
        (this._y1 = t);
    },
  };
  function tb(e) {
    return new Ld(e);
  }
  function Gd(e, t) {
    (this._basis = new ua(e)), (this._beta = t);
  }
  Gd.prototype = {
    lineStart: function () {
      (this._x = []), (this._y = []), this._basis.lineStart();
    },
    lineEnd: function () {
      var e = this._x,
        t = this._y,
        n = e.length - 1;
      if (n > 0)
        for (
          var r = e[0], i = t[0], o = e[n] - r, a = t[n] - i, u = -1, f;
          ++u <= n;

        )
          (f = u / n),
            this._basis.point(
              this._beta * e[u] + (1 - this._beta) * (r + f * o),
              this._beta * t[u] + (1 - this._beta) * (i + f * a)
            );
      (this._x = this._y = null), this._basis.lineEnd();
    },
    point: function (e, t) {
      this._x.push(+e), this._y.push(+t);
    },
  };
  const nb = (function e(t) {
    function n(r) {
      return t === 1 ? new ua(r) : new Gd(r, t);
    }
    return (
      (n.beta = function (r) {
        return e(+r);
      }),
      n
    );
  })(0.85);
  function sa(e, t, n) {
    e._context.bezierCurveTo(
      e._x1 + e._k * (e._x2 - e._x0),
      e._y1 + e._k * (e._y2 - e._y0),
      e._x2 + e._k * (e._x1 - t),
      e._y2 + e._k * (e._y1 - n),
      e._x2,
      e._y2
    );
  }
  function xs(e, t) {
    (this._context = e), (this._k = (1 - t) / 6);
  }
  xs.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
        (this._point = 0);
    },
    lineEnd: function () {
      switch (this._point) {
        case 2:
          this._context.lineTo(this._x2, this._y2);
          break;
        case 3:
          sa(this, this._x1, this._y1);
          break;
      }
      (this._line || (this._line !== 0 && this._point === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1),
            this._line
              ? this._context.lineTo(e, t)
              : this._context.moveTo(e, t);
          break;
        case 1:
          (this._point = 2), (this._x1 = e), (this._y1 = t);
          break;
        case 2:
          this._point = 3;
        default:
          sa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const rb = (function e(t) {
    function n(r) {
      return new xs(r, t);
    }
    return (
      (n.tension = function (r) {
        return e(+r);
      }),
      n
    );
  })(0);
  function _s(e, t) {
    (this._context = e), (this._k = (1 - t) / 6);
  }
  _s.prototype = {
    areaStart: vr,
    areaEnd: vr,
    lineStart: function () {
      (this._x0 =
        this._x1 =
        this._x2 =
        this._x3 =
        this._x4 =
        this._x5 =
        this._y0 =
        this._y1 =
        this._y2 =
        this._y3 =
        this._y4 =
        this._y5 =
          NaN),
        (this._point = 0);
    },
    lineEnd: function () {
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
          this.point(this._x3, this._y3),
            this.point(this._x4, this._y4),
            this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1), (this._x3 = e), (this._y3 = t);
          break;
        case 1:
          (this._point = 2),
            this._context.moveTo((this._x4 = e), (this._y4 = t));
          break;
        case 2:
          (this._point = 3), (this._x5 = e), (this._y5 = t);
          break;
        default:
          sa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const ib = (function e(t) {
    function n(r) {
      return new _s(r, t);
    }
    return (
      (n.tension = function (r) {
        return e(+r);
      }),
      n
    );
  })(0);
  function Ss(e, t) {
    (this._context = e), (this._k = (1 - t) / 6);
  }
  Ss.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
        (this._point = 0);
    },
    lineEnd: function () {
      (this._line || (this._line !== 0 && this._point === 3)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          this._point = 1;
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          (this._point = 3),
            this._line
              ? this._context.lineTo(this._x2, this._y2)
              : this._context.moveTo(this._x2, this._y2);
          break;
        case 3:
          this._point = 4;
        default:
          sa(this, e, t);
          break;
      }
      (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const ob = (function e(t) {
    function n(r) {
      return new Ss(r, t);
    }
    return (
      (n.tension = function (r) {
        return e(+r);
      }),
      n
    );
  })(0);
  function Rs(e, t, n) {
    var r = e._x1,
      i = e._y1,
      o = e._x2,
      a = e._y2;
    if (e._l01_a > Zt) {
      var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a,
        f = 3 * e._l01_a * (e._l01_a + e._l12_a);
      (r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / f),
        (i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / f);
    }
    if (e._l23_a > Zt) {
      var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a,
        p = 3 * e._l23_a * (e._l23_a + e._l12_a);
      (o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / p),
        (a = (a * c + e._y1 * e._l23_2a - n * e._l12_2a) / p);
    }
    e._context.bezierCurveTo(r, i, o, a, e._x2, e._y2);
  }
  function jd(e, t) {
    (this._context = e), (this._alpha = t);
  }
  jd.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
        (this._l01_a =
          this._l12_a =
          this._l23_a =
          this._l01_2a =
          this._l12_2a =
          this._l23_2a =
          this._point =
            0);
    },
    lineEnd: function () {
      switch (this._point) {
        case 2:
          this._context.lineTo(this._x2, this._y2);
          break;
        case 3:
          this.point(this._x2, this._y2);
          break;
      }
      (this._line || (this._line !== 0 && this._point === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      if (((e = +e), (t = +t), this._point)) {
        var n = this._x2 - e,
          r = this._y2 - t;
        this._l23_a = Math.sqrt(
          (this._l23_2a = Math.pow(n * n + r * r, this._alpha))
        );
      }
      switch (this._point) {
        case 0:
          (this._point = 1),
            this._line
              ? this._context.lineTo(e, t)
              : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3;
        default:
          Rs(this, e, t);
          break;
      }
      (this._l01_a = this._l12_a),
        (this._l12_a = this._l23_a),
        (this._l01_2a = this._l12_2a),
        (this._l12_2a = this._l23_2a),
        (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const ab = (function e(t) {
    function n(r) {
      return t ? new jd(r, t) : new xs(r, 0);
    }
    return (
      (n.alpha = function (r) {
        return e(+r);
      }),
      n
    );
  })(0.5);
  function Hd(e, t) {
    (this._context = e), (this._alpha = t);
  }
  Hd.prototype = {
    areaStart: vr,
    areaEnd: vr,
    lineStart: function () {
      (this._x0 =
        this._x1 =
        this._x2 =
        this._x3 =
        this._x4 =
        this._x5 =
        this._y0 =
        this._y1 =
        this._y2 =
        this._y3 =
        this._y4 =
        this._y5 =
          NaN),
        (this._l01_a =
          this._l12_a =
          this._l23_a =
          this._l01_2a =
          this._l12_2a =
          this._l23_2a =
          this._point =
            0);
    },
    lineEnd: function () {
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
          this.point(this._x3, this._y3),
            this.point(this._x4, this._y4),
            this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function (e, t) {
      if (((e = +e), (t = +t), this._point)) {
        var n = this._x2 - e,
          r = this._y2 - t;
        this._l23_a = Math.sqrt(
          (this._l23_2a = Math.pow(n * n + r * r, this._alpha))
        );
      }
      switch (this._point) {
        case 0:
          (this._point = 1), (this._x3 = e), (this._y3 = t);
          break;
        case 1:
          (this._point = 2),
            this._context.moveTo((this._x4 = e), (this._y4 = t));
          break;
        case 2:
          (this._point = 3), (this._x5 = e), (this._y5 = t);
          break;
        default:
          Rs(this, e, t);
          break;
      }
      (this._l01_a = this._l12_a),
        (this._l12_a = this._l23_a),
        (this._l01_2a = this._l12_2a),
        (this._l12_2a = this._l23_2a),
        (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const ub = (function e(t) {
    function n(r) {
      return t ? new Hd(r, t) : new _s(r, 0);
    }
    return (
      (n.alpha = function (r) {
        return e(+r);
      }),
      n
    );
  })(0.5);
  function Wd(e, t) {
    (this._context = e), (this._alpha = t);
  }
  Wd.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
        (this._l01_a =
          this._l12_a =
          this._l23_a =
          this._l01_2a =
          this._l12_2a =
          this._l23_2a =
          this._point =
            0);
    },
    lineEnd: function () {
      (this._line || (this._line !== 0 && this._point === 3)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      if (((e = +e), (t = +t), this._point)) {
        var n = this._x2 - e,
          r = this._y2 - t;
        this._l23_a = Math.sqrt(
          (this._l23_2a = Math.pow(n * n + r * r, this._alpha))
        );
      }
      switch (this._point) {
        case 0:
          this._point = 1;
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          (this._point = 3),
            this._line
              ? this._context.lineTo(this._x2, this._y2)
              : this._context.moveTo(this._x2, this._y2);
          break;
        case 3:
          this._point = 4;
        default:
          Rs(this, e, t);
          break;
      }
      (this._l01_a = this._l12_a),
        (this._l12_a = this._l23_a),
        (this._l01_2a = this._l12_2a),
        (this._l12_2a = this._l23_2a),
        (this._x0 = this._x1),
        (this._x1 = this._x2),
        (this._x2 = e),
        (this._y0 = this._y1),
        (this._y1 = this._y2),
        (this._y2 = t);
    },
  };
  const sb = (function e(t) {
    function n(r) {
      return t ? new Wd(r, t) : new Ss(r, 0);
    }
    return (
      (n.alpha = function (r) {
        return e(+r);
      }),
      n
    );
  })(0.5);
  function Vd(e) {
    this._context = e;
  }
  Vd.prototype = {
    areaStart: vr,
    areaEnd: vr,
    lineStart: function () {
      this._point = 0;
    },
    lineEnd: function () {
      this._point && this._context.closePath();
    },
    point: function (e, t) {
      (e = +e),
        (t = +t),
        this._point
          ? this._context.lineTo(e, t)
          : ((this._point = 1), this._context.moveTo(e, t));
    },
  };
  function lb(e) {
    return new Vd(e);
  }
  function Ud(e) {
    return e < 0 ? -1 : 1;
  }
  function qd(e, t, n) {
    var r = e._x1 - e._x0,
      i = t - e._x1,
      o = (e._y1 - e._y0) / (r || (i < 0 && -0)),
      a = (n - e._y1) / (i || (r < 0 && -0)),
      u = (o * i + a * r) / (r + i);
    return (
      (Ud(o) + Ud(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(u)) ||
      0
    );
  }
  function Yd(e, t) {
    var n = e._x1 - e._x0;
    return n ? ((3 * (e._y1 - e._y0)) / n - t) / 2 : t;
  }
  function Cs(e, t, n) {
    var r = e._x0,
      i = e._y0,
      o = e._x1,
      a = e._y1,
      u = (o - r) / 3;
    e._context.bezierCurveTo(r + u, i + u * t, o - u, a - u * n, o, a);
  }
  function la(e) {
    this._context = e;
  }
  la.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN),
        (this._point = 0);
    },
    lineEnd: function () {
      switch (this._point) {
        case 2:
          this._context.lineTo(this._x1, this._y1);
          break;
        case 3:
          Cs(this, this._t0, Yd(this, this._t0));
          break;
      }
      (this._line || (this._line !== 0 && this._point === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line);
    },
    point: function (e, t) {
      var n = NaN;
      if (((e = +e), (t = +t), !(e === this._x1 && t === this._y1))) {
        switch (this._point) {
          case 0:
            (this._point = 1),
              this._line
                ? this._context.lineTo(e, t)
                : this._context.moveTo(e, t);
            break;
          case 1:
            this._point = 2;
            break;
          case 2:
            (this._point = 3), Cs(this, Yd(this, (n = qd(this, e, t))), n);
            break;
          default:
            Cs(this, this._t0, (n = qd(this, e, t)));
            break;
        }
        (this._x0 = this._x1),
          (this._x1 = e),
          (this._y0 = this._y1),
          (this._y1 = t),
          (this._t0 = n);
      }
    },
  };
  function Xd(e) {
    this._context = new Kd(e);
  }
  (Xd.prototype = Object.create(la.prototype)).point = function (e, t) {
    la.prototype.point.call(this, t, e);
  };
  function Kd(e) {
    this._context = e;
  }
  Kd.prototype = {
    moveTo: function (e, t) {
      this._context.moveTo(t, e);
    },
    closePath: function () {
      this._context.closePath();
    },
    lineTo: function (e, t) {
      this._context.lineTo(t, e);
    },
    bezierCurveTo: function (e, t, n, r, i, o) {
      this._context.bezierCurveTo(t, e, r, n, o, i);
    },
  };
  function cb(e) {
    return new la(e);
  }
  function fb(e) {
    return new Xd(e);
  }
  function Qd(e) {
    this._context = e;
  }
  Qd.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x = []), (this._y = []);
    },
    lineEnd: function () {
      var e = this._x,
        t = this._y,
        n = e.length;
      if (n)
        if (
          (this._line
            ? this._context.lineTo(e[0], t[0])
            : this._context.moveTo(e[0], t[0]),
          n === 2)
        )
          this._context.lineTo(e[1], t[1]);
        else
          for (var r = Zd(e), i = Zd(t), o = 0, a = 1; a < n; ++o, ++a)
            this._context.bezierCurveTo(
              r[0][o],
              i[0][o],
              r[1][o],
              i[1][o],
              e[a],
              t[a]
            );
      (this._line || (this._line !== 0 && n === 1)) &&
        this._context.closePath(),
        (this._line = 1 - this._line),
        (this._x = this._y = null);
    },
    point: function (e, t) {
      this._x.push(+e), this._y.push(+t);
    },
  };
  function Zd(e) {
    var t,
      n = e.length - 1,
      r,
      i = new Array(n),
      o = new Array(n),
      a = new Array(n);
    for (i[0] = 0, o[0] = 2, a[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t)
      (i[t] = 1), (o[t] = 4), (a[t] = 4 * e[t] + 2 * e[t + 1]);
    for (
      i[n - 1] = 2, o[n - 1] = 7, a[n - 1] = 8 * e[n - 1] + e[n], t = 1;
      t < n;
      ++t
    )
      (r = i[t] / o[t - 1]), (o[t] -= r), (a[t] -= r * a[t - 1]);
    for (i[n - 1] = a[n - 1] / o[n - 1], t = n - 2; t >= 0; --t)
      i[t] = (a[t] - i[t + 1]) / o[t];
    for (o[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t)
      o[t] = 2 * e[t + 1] - i[t + 1];
    return [i, o];
  }
  function db(e) {
    return new Qd(e);
  }
  function ca(e, t) {
    (this._context = e), (this._t = t);
  }
  ca.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      (this._x = this._y = NaN), (this._point = 0);
    },
    lineEnd: function () {
      0 < this._t &&
        this._t < 1 &&
        this._point === 2 &&
        this._context.lineTo(this._x, this._y),
        (this._line || (this._line !== 0 && this._point === 1)) &&
          this._context.closePath(),
        this._line >= 0 &&
          ((this._t = 1 - this._t), (this._line = 1 - this._line));
    },
    point: function (e, t) {
      switch (((e = +e), (t = +t), this._point)) {
        case 0:
          (this._point = 1),
            this._line
              ? this._context.lineTo(e, t)
              : this._context.moveTo(e, t);
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
      (this._x = e), (this._y = t);
    },
  };
  function hb(e) {
    return new ca(e, 0.5);
  }
  function pb(e) {
    return new ca(e, 0);
  }
  function vb(e) {
    return new ca(e, 1);
  }
  function hi(e, t) {
    if ((a = e.length) > 1)
      for (var n = 1, r, i, o = e[t[0]], a, u = o.length; n < a; ++n)
        for (i = o, o = e[t[n]], r = 0; r < u; ++r)
          o[r][1] += o[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
  }
  function pi(e) {
    for (var t = e.length, n = new Array(t); --t >= 0; ) n[t] = t;
    return n;
  }
  function gb(e, t) {
    return e[t];
  }
  function mb() {
    var e = pt([]),
      t = pi,
      n = hi,
      r = gb;
    function i(o) {
      var a = e.apply(this, arguments),
        u,
        f = o.length,
        c = a.length,
        p = new Array(c),
        h;
      for (u = 0; u < c; ++u) {
        for (var w = a[u], T = (p[u] = new Array(f)), _ = 0, P; _ < f; ++_)
          (T[_] = P = [0, +r(o[_], w, _, o)]), (P.data = o[_]);
        T.key = w;
      }
      for (u = 0, h = t(p); u < c; ++u) p[h[u]].index = u;
      return n(p, h), p;
    }
    return (
      (i.keys = function (o) {
        return arguments.length
          ? ((e = typeof o == "function" ? o : pt(gs.call(o))), i)
          : e;
      }),
      (i.value = function (o) {
        return arguments.length
          ? ((r = typeof o == "function" ? o : pt(+o)), i)
          : r;
      }),
      (i.order = function (o) {
        return arguments.length
          ? ((t = o == null ? pi : typeof o == "function" ? o : pt(gs.call(o))),
            i)
          : t;
      }),
      (i.offset = function (o) {
        return arguments.length ? ((n = o == null ? hi : o), i) : n;
      }),
      i
    );
  }
  function yb(e, t) {
    if ((r = e.length) > 0) {
      for (var n, r, i = 0, o = e[0].length, a; i < o; ++i) {
        for (a = n = 0; n < r; ++n) a += e[n][i][1] || 0;
        if (a) for (n = 0; n < r; ++n) e[n][i][1] /= a;
      }
      hi(e, t);
    }
  }
  function bb(e, t) {
    if ((f = e.length) > 0)
      for (var n, r = 0, i, o, a, u, f, c = e[t[0]].length; r < c; ++r)
        for (a = u = 0, n = 0; n < f; ++n)
          (o = (i = e[t[n]][r])[1] - i[0]) > 0
            ? ((i[0] = a), (i[1] = a += o))
            : o < 0
            ? ((i[1] = u), (i[0] = u += o))
            : ((i[0] = 0), (i[1] = o));
  }
  function wb(e, t) {
    if ((i = e.length) > 0) {
      for (var n = 0, r = e[t[0]], i, o = r.length; n < o; ++n) {
        for (var a = 0, u = 0; a < i; ++a) u += e[a][n][1] || 0;
        r[n][1] += r[n][0] = -u / 2;
      }
      hi(e, t);
    }
  }
  function xb(e, t) {
    if (!(!((a = e.length) > 0) || !((o = (i = e[t[0]]).length) > 0))) {
      for (var n = 0, r = 1, i, o, a; r < o; ++r) {
        for (var u = 0, f = 0, c = 0; u < a; ++u) {
          for (
            var p = e[t[u]],
              h = p[r][1] || 0,
              w = p[r - 1][1] || 0,
              T = (h - w) / 2,
              _ = 0;
            _ < u;
            ++_
          ) {
            var P = e[t[_]],
              I = P[r][1] || 0,
              k = P[r - 1][1] || 0;
            T += I - k;
          }
          (f += h), (c += T * h);
        }
        (i[r - 1][1] += i[r - 1][0] = n), f && (n -= c / f);
      }
      (i[r - 1][1] += i[r - 1][0] = n), hi(e, t);
    }
  }
  function Jd(e) {
    var t = e.map(_b);
    return pi(e).sort(function (n, r) {
      return t[n] - t[r];
    });
  }
  function _b(e) {
    for (var t = -1, n = 0, r = e.length, i, o = -1 / 0; ++t < r; )
      (i = +e[t][1]) > o && ((o = i), (n = t));
    return n;
  }
  function eh(e) {
    var t = e.map(th);
    return pi(e).sort(function (n, r) {
      return t[n] - t[r];
    });
  }
  function th(e) {
    for (var t = 0, n = -1, r = e.length, i; ++n < r; )
      (i = +e[n][1]) && (t += i);
    return t;
  }
  function Sb(e) {
    return eh(e).reverse();
  }
  function Rb(e) {
    var t = e.length,
      n,
      r,
      i = e.map(th),
      o = Jd(e),
      a = 0,
      u = 0,
      f = [],
      c = [];
    for (n = 0; n < t; ++n)
      (r = o[n]), a < u ? ((a += i[r]), f.push(r)) : ((u += i[r]), c.push(r));
    return c.reverse().concat(f);
  }
  function Cb(e) {
    return pi(e).reverse();
  }
  const Tb = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        arc: $y,
        area: Td,
        line: ps,
        pie: By,
        areaRadial: Md,
        radialArea: Md,
        lineRadial: Ed,
        radialLine: Ed,
        pointRadial: Xi,
        linkHorizontal: Hy,
        linkVertical: Wy,
        linkRadial: Vy,
        symbol: Zy,
        symbols: Qy,
        symbolCircle: ys,
        symbolCross: Od,
        symbolDiamond: kd,
        symbolSquare: Id,
        symbolStar: Fd,
        symbolTriangle: Bd,
        symbolWye: Dd,
        curveBasisClosed: eb,
        curveBasisOpen: tb,
        curveBasis: Jy,
        curveBundle: nb,
        curveCardinalClosed: ib,
        curveCardinalOpen: ob,
        curveCardinal: rb,
        curveCatmullRomClosed: ub,
        curveCatmullRomOpen: sb,
        curveCatmullRom: ab,
        curveLinearClosed: lb,
        curveLinear: oa,
        curveMonotoneX: cb,
        curveMonotoneY: fb,
        curveNatural: db,
        curveStep: hb,
        curveStepAfter: vb,
        curveStepBefore: pb,
        stack: mb,
        stackOffsetExpand: yb,
        stackOffsetDiverging: bb,
        stackOffsetNone: hi,
        stackOffsetSilhouette: wb,
        stackOffsetWiggle: xb,
        stackOrderAppearance: Jd,
        stackOrderAscending: eh,
        stackOrderDescending: Sb,
        stackOrderInsideOut: Rb,
        stackOrderNone: pi,
        stackOrderReverse: Cb,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  function Ki(e, t) {
    return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
  }
  function fa(e) {
    let t = e,
      n = e;
    e.length === 1 && ((t = (a, u) => e(a) - u), (n = Pb(e)));
    function r(a, u, f, c) {
      for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
        const p = (f + c) >>> 1;
        n(a[p], u) < 0 ? (f = p + 1) : (c = p);
      }
      return f;
    }
    function i(a, u, f, c) {
      for (f == null && (f = 0), c == null && (c = a.length); f < c; ) {
        const p = (f + c) >>> 1;
        n(a[p], u) > 0 ? (c = p) : (f = p + 1);
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
    return (t, n) => Ki(e(t), n);
  }
  function nh(e) {
    return e === null ? NaN : +e;
  }
  function* Nb(e, t) {
    if (t === void 0) for (let n of e) n != null && (n = +n) >= n && (yield n);
    else {
      let n = -1;
      for (let r of e) (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
    }
  }
  const rh = fa(Ki),
    Eb = rh.right,
    Mb = rh.left;
  fa(nh).center;
  const Qi = Eb;
  function ih(e, t) {
    let n, r;
    if (t === void 0)
      for (const i of e)
        i != null &&
          (n === void 0
            ? i >= i && (n = r = i)
            : (n > i && (n = i), r < i && (r = i)));
    else {
      let i = -1;
      for (let o of e)
        (o = t(o, ++i, e)) != null &&
          (n === void 0
            ? o >= o && (n = r = o)
            : (n > o && (n = o), r < o && (r = o)));
    }
    return [n, r];
  }
  var Ts = Math.sqrt(50),
    Ps = Math.sqrt(10),
    Ns = Math.sqrt(2);
  function Es(e, t, n) {
    var r,
      i = -1,
      o,
      a,
      u;
    if (((t = +t), (e = +e), (n = +n), e === t && n > 0)) return [e];
    if (
      ((r = t < e) && ((o = e), (e = t), (t = o)),
      (u = oh(e, t, n)) === 0 || !isFinite(u))
    )
      return [];
    if (u > 0) {
      let f = Math.round(e / u),
        c = Math.round(t / u);
      for (
        f * u < e && ++f, c * u > t && --c, a = new Array((o = c - f + 1));
        ++i < o;

      )
        a[i] = (f + i) * u;
    } else {
      u = -u;
      let f = Math.round(e * u),
        c = Math.round(t * u);
      for (
        f / u < e && ++f, c / u > t && --c, a = new Array((o = c - f + 1));
        ++i < o;

      )
        a[i] = (f + i) / u;
    }
    return r && a.reverse(), a;
  }
  function oh(e, t, n) {
    var r = (t - e) / Math.max(0, n),
      i = Math.floor(Math.log(r) / Math.LN10),
      o = r / Math.pow(10, i);
    return i >= 0
      ? (o >= Ts ? 10 : o >= Ps ? 5 : o >= Ns ? 2 : 1) * Math.pow(10, i)
      : -Math.pow(10, -i) / (o >= Ts ? 10 : o >= Ps ? 5 : o >= Ns ? 2 : 1);
  }
  function Ms(e, t, n) {
    var r = Math.abs(t - e) / Math.max(0, n),
      i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)),
      o = r / i;
    return (
      o >= Ts ? (i *= 10) : o >= Ps ? (i *= 5) : o >= Ns && (i *= 2),
      t < e ? -i : i
    );
  }
  function ah(e, t) {
    let n;
    if (t === void 0)
      for (const r of e)
        r != null && (n < r || (n === void 0 && r >= r)) && (n = r);
    else {
      let r = -1;
      for (let i of e)
        (i = t(i, ++r, e)) != null &&
          (n < i || (n === void 0 && i >= i)) &&
          (n = i);
    }
    return n;
  }
  function uh(e, t) {
    let n;
    if (t === void 0)
      for (const r of e)
        r != null && (n > r || (n === void 0 && r >= r)) && (n = r);
    else {
      let r = -1;
      for (let i of e)
        (i = t(i, ++r, e)) != null &&
          (n > i || (n === void 0 && i >= i)) &&
          (n = i);
    }
    return n;
  }
  function sh(e, t, n = 0, r = e.length - 1, i = Ki) {
    for (; r > n; ) {
      if (r - n > 600) {
        const f = r - n + 1,
          c = t - n + 1,
          p = Math.log(f),
          h = 0.5 * Math.exp((2 * p) / 3),
          w = 0.5 * Math.sqrt((p * h * (f - h)) / f) * (c - f / 2 < 0 ? -1 : 1),
          T = Math.max(n, Math.floor(t - (c * h) / f + w)),
          _ = Math.min(r, Math.floor(t + ((f - c) * h) / f + w));
        sh(e, t, T, _, i);
      }
      const o = e[t];
      let a = n,
        u = r;
      for (Zi(e, n, t), i(e[r], o) > 0 && Zi(e, n, r); a < u; ) {
        for (Zi(e, a, u), ++a, --u; i(e[a], o) < 0; ) ++a;
        for (; i(e[u], o) > 0; ) --u;
      }
      i(e[n], o) === 0 ? Zi(e, n, u) : (++u, Zi(e, u, r)),
        u <= t && (n = u + 1),
        t <= u && (r = u - 1);
    }
    return e;
  }
  function Zi(e, t, n) {
    const r = e[t];
    (e[t] = e[n]), (e[n] = r);
  }
  function Ob(e, t, n) {
    if (((e = Float64Array.from(Nb(e, n))), !!(r = e.length))) {
      if ((t = +t) <= 0 || r < 2) return uh(e);
      if (t >= 1) return ah(e);
      var r,
        i = (r - 1) * t,
        o = Math.floor(i),
        a = ah(sh(e, o).subarray(0, o + 1)),
        u = uh(e.subarray(o + 1));
      return a + (u - a) * (i - o);
    }
  }
  function Ab(e, t, n = nh) {
    if (!!(r = e.length)) {
      if ((t = +t) <= 0 || r < 2) return +n(e[0], 0, e);
      if (t >= 1) return +n(e[r - 1], r - 1, e);
      var r,
        i = (r - 1) * t,
        o = Math.floor(i),
        a = +n(e[o], o, e),
        u = +n(e[o + 1], o + 1, e);
      return a + (u - a) * (i - o);
    }
  }
  function lh(e, t, n) {
    (e = +e),
      (t = +t),
      (n = (i = arguments.length) < 2 ? ((t = e), (e = 0), 1) : i < 3 ? 1 : +n);
    for (
      var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, o = new Array(i);
      ++r < i;

    )
      o[r] = e + r * n;
    return o;
  }
  function gn(e, t) {
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
  function er(e, t) {
    switch (arguments.length) {
      case 0:
        break;
      case 1: {
        typeof e == "function" ? this.interpolator(e) : this.range(e);
        break;
      }
      default: {
        this.domain(e),
          typeof t == "function" ? this.interpolator(t) : this.range(t);
        break;
      }
    }
    return this;
  }
  const Os = Symbol("implicit");
  function da() {
    var e = new Map(),
      t = [],
      n = [],
      r = Os;
    function i(o) {
      var a = o + "",
        u = e.get(a);
      if (!u) {
        if (r !== Os) return r;
        e.set(a, (u = t.push(o)));
      }
      return n[(u - 1) % n.length];
    }
    return (
      (i.domain = function (o) {
        if (!arguments.length) return t.slice();
        (t = []), (e = new Map());
        for (const a of o) {
          const u = a + "";
          e.has(u) || e.set(u, t.push(a));
        }
        return i;
      }),
      (i.range = function (o) {
        return arguments.length ? ((n = Array.from(o)), i) : n.slice();
      }),
      (i.unknown = function (o) {
        return arguments.length ? ((r = o), i) : r;
      }),
      (i.copy = function () {
        return da(t, n).unknown(r);
      }),
      gn.apply(i, arguments),
      i
    );
  }
  function ha() {
    var e = da().unknown(void 0),
      t = e.domain,
      n = e.range,
      r = 0,
      i = 1,
      o,
      a,
      u = !1,
      f = 0,
      c = 0,
      p = 0.5;
    delete e.unknown;
    function h() {
      var w = t().length,
        T = i < r,
        _ = T ? i : r,
        P = T ? r : i;
      (o = (P - _) / Math.max(1, w - f + c * 2)),
        u && (o = Math.floor(o)),
        (_ += (P - _ - o * (w - f)) * p),
        (a = o * (1 - f)),
        u && ((_ = Math.round(_)), (a = Math.round(a)));
      var I = lh(w).map(function (k) {
        return _ + o * k;
      });
      return n(T ? I.reverse() : I);
    }
    return (
      (e.domain = function (w) {
        return arguments.length ? (t(w), h()) : t();
      }),
      (e.range = function (w) {
        return arguments.length
          ? (([r, i] = w), (r = +r), (i = +i), h())
          : [r, i];
      }),
      (e.rangeRound = function (w) {
        return ([r, i] = w), (r = +r), (i = +i), (u = !0), h();
      }),
      (e.bandwidth = function () {
        return a;
      }),
      (e.step = function () {
        return o;
      }),
      (e.round = function (w) {
        return arguments.length ? ((u = !!w), h()) : u;
      }),
      (e.padding = function (w) {
        return arguments.length ? ((f = Math.min(1, (c = +w))), h()) : f;
      }),
      (e.paddingInner = function (w) {
        return arguments.length ? ((f = Math.min(1, w)), h()) : f;
      }),
      (e.paddingOuter = function (w) {
        return arguments.length ? ((c = +w), h()) : c;
      }),
      (e.align = function (w) {
        return arguments.length ? ((p = Math.max(0, Math.min(1, w))), h()) : p;
      }),
      (e.copy = function () {
        return ha(t(), [r, i])
          .round(u)
          .paddingInner(f)
          .paddingOuter(c)
          .align(p);
      }),
      gn.apply(h(), arguments)
    );
  }
  function ch(e) {
    var t = e.copy;
    return (
      (e.padding = e.paddingOuter),
      delete e.paddingInner,
      delete e.paddingOuter,
      (e.copy = function () {
        return ch(t());
      }),
      e
    );
  }
  function fh() {
    return ch(ha.apply(null, arguments).paddingInner(1));
  }
  function vi(e, t, n) {
    (e.prototype = t.prototype = n), (n.constructor = e);
  }
  function Ji(e, t) {
    var n = Object.create(e.prototype);
    for (var r in t) n[r] = t[r];
    return n;
  }
  function gr() {}
  var Hr = 0.7,
    gi = 1 / Hr,
    mi = "\\s*([+-]?\\d+)\\s*",
    eo = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    Dn = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    kb = /^#([0-9a-f]{3,8})$/,
    $b = new RegExp("^rgb\\(" + [mi, mi, mi] + "\\)$"),
    Fb = new RegExp("^rgb\\(" + [Dn, Dn, Dn] + "\\)$"),
    Ib = new RegExp("^rgba\\(" + [mi, mi, mi, eo] + "\\)$"),
    Bb = new RegExp("^rgba\\(" + [Dn, Dn, Dn, eo] + "\\)$"),
    Db = new RegExp("^hsl\\(" + [eo, Dn, Dn] + "\\)$"),
    zb = new RegExp("^hsla\\(" + [eo, Dn, Dn, eo] + "\\)$"),
    dh = {
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
      yellowgreen: 10145074,
    };
  vi(gr, to, {
    copy: function (e) {
      return Object.assign(new this.constructor(), this, e);
    },
    displayable: function () {
      return this.rgb().displayable();
    },
    hex: hh,
    formatHex: hh,
    formatHsl: Lb,
    formatRgb: ph,
    toString: ph,
  });
  function hh() {
    return this.rgb().formatHex();
  }
  function Lb() {
    return bh(this).formatHsl();
  }
  function ph() {
    return this.rgb().formatRgb();
  }
  function to(e) {
    var t, n;
    return (
      (e = (e + "").trim().toLowerCase()),
      (t = kb.exec(e))
        ? ((n = t[1].length),
          (t = parseInt(t[1], 16)),
          n === 6
            ? vh(t)
            : n === 3
            ? new qt(
                ((t >> 8) & 15) | ((t >> 4) & 240),
                ((t >> 4) & 15) | (t & 240),
                ((t & 15) << 4) | (t & 15),
                1
              )
            : n === 8
            ? pa(
                (t >> 24) & 255,
                (t >> 16) & 255,
                (t >> 8) & 255,
                (t & 255) / 255
              )
            : n === 4
            ? pa(
                ((t >> 12) & 15) | ((t >> 8) & 240),
                ((t >> 8) & 15) | ((t >> 4) & 240),
                ((t >> 4) & 15) | (t & 240),
                (((t & 15) << 4) | (t & 15)) / 255
              )
            : null)
        : (t = $b.exec(e))
        ? new qt(t[1], t[2], t[3], 1)
        : (t = Fb.exec(e))
        ? new qt((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, 1)
        : (t = Ib.exec(e))
        ? pa(t[1], t[2], t[3], t[4])
        : (t = Bb.exec(e))
        ? pa((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, t[4])
        : (t = Db.exec(e))
        ? yh(t[1], t[2] / 100, t[3] / 100, 1)
        : (t = zb.exec(e))
        ? yh(t[1], t[2] / 100, t[3] / 100, t[4])
        : dh.hasOwnProperty(e)
        ? vh(dh[e])
        : e === "transparent"
        ? new qt(NaN, NaN, NaN, 0)
        : null
    );
  }
  function vh(e) {
    return new qt((e >> 16) & 255, (e >> 8) & 255, e & 255, 1);
  }
  function pa(e, t, n, r) {
    return r <= 0 && (e = t = n = NaN), new qt(e, t, n, r);
  }
  function As(e) {
    return (
      e instanceof gr || (e = to(e)),
      e ? ((e = e.rgb()), new qt(e.r, e.g, e.b, e.opacity)) : new qt()
    );
  }
  function va(e, t, n, r) {
    return arguments.length === 1 ? As(e) : new qt(e, t, n, r == null ? 1 : r);
  }
  function qt(e, t, n, r) {
    (this.r = +e), (this.g = +t), (this.b = +n), (this.opacity = +r);
  }
  vi(
    qt,
    va,
    Ji(gr, {
      brighter: function (e) {
        return (
          (e = e == null ? gi : Math.pow(gi, e)),
          new qt(this.r * e, this.g * e, this.b * e, this.opacity)
        );
      },
      darker: function (e) {
        return (
          (e = e == null ? Hr : Math.pow(Hr, e)),
          new qt(this.r * e, this.g * e, this.b * e, this.opacity)
        );
      },
      rgb: function () {
        return this;
      },
      displayable: function () {
        return (
          -0.5 <= this.r &&
          this.r < 255.5 &&
          -0.5 <= this.g &&
          this.g < 255.5 &&
          -0.5 <= this.b &&
          this.b < 255.5 &&
          0 <= this.opacity &&
          this.opacity <= 1
        );
      },
      hex: gh,
      formatHex: gh,
      formatRgb: mh,
      toString: mh,
    })
  );
  function gh() {
    return "#" + ks(this.r) + ks(this.g) + ks(this.b);
  }
  function mh() {
    var e = this.opacity;
    return (
      (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))),
      (e === 1 ? "rgb(" : "rgba(") +
        Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
        ", " +
        Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
        ", " +
        Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
        (e === 1 ? ")" : ", " + e + ")")
    );
  }
  function ks(e) {
    return (
      (e = Math.max(0, Math.min(255, Math.round(e) || 0))),
      (e < 16 ? "0" : "") + e.toString(16)
    );
  }
  function yh(e, t, n, r) {
    return (
      r <= 0
        ? (e = t = n = NaN)
        : n <= 0 || n >= 1
        ? (e = t = NaN)
        : t <= 0 && (e = NaN),
      new zn(e, t, n, r)
    );
  }
  function bh(e) {
    if (e instanceof zn) return new zn(e.h, e.s, e.l, e.opacity);
    if ((e instanceof gr || (e = to(e)), !e)) return new zn();
    if (e instanceof zn) return e;
    e = e.rgb();
    var t = e.r / 255,
      n = e.g / 255,
      r = e.b / 255,
      i = Math.min(t, n, r),
      o = Math.max(t, n, r),
      a = NaN,
      u = o - i,
      f = (o + i) / 2;
    return (
      u
        ? (t === o
            ? (a = (n - r) / u + (n < r) * 6)
            : n === o
            ? (a = (r - t) / u + 2)
            : (a = (t - n) / u + 4),
          (u /= f < 0.5 ? o + i : 2 - o - i),
          (a *= 60))
        : (u = f > 0 && f < 1 ? 0 : a),
      new zn(a, u, f, e.opacity)
    );
  }
  function $s(e, t, n, r) {
    return arguments.length === 1 ? bh(e) : new zn(e, t, n, r == null ? 1 : r);
  }
  function zn(e, t, n, r) {
    (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +r);
  }
  vi(
    zn,
    $s,
    Ji(gr, {
      brighter: function (e) {
        return (
          (e = e == null ? gi : Math.pow(gi, e)),
          new zn(this.h, this.s, this.l * e, this.opacity)
        );
      },
      darker: function (e) {
        return (
          (e = e == null ? Hr : Math.pow(Hr, e)),
          new zn(this.h, this.s, this.l * e, this.opacity)
        );
      },
      rgb: function () {
        var e = (this.h % 360) + (this.h < 0) * 360,
          t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          r = n + (n < 0.5 ? n : 1 - n) * t,
          i = 2 * n - r;
        return new qt(
          Fs(e >= 240 ? e - 240 : e + 120, i, r),
          Fs(e, i, r),
          Fs(e < 120 ? e + 240 : e - 120, i, r),
          this.opacity
        );
      },
      displayable: function () {
        return (
          ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
          0 <= this.l &&
          this.l <= 1 &&
          0 <= this.opacity &&
          this.opacity <= 1
        );
      },
      formatHsl: function () {
        var e = this.opacity;
        return (
          (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))),
          (e === 1 ? "hsl(" : "hsla(") +
            (this.h || 0) +
            ", " +
            (this.s || 0) * 100 +
            "%, " +
            (this.l || 0) * 100 +
            "%" +
            (e === 1 ? ")" : ", " + e + ")")
        );
      },
    })
  );
  function Fs(e, t, n) {
    return (
      (e < 60
        ? t + ((n - t) * e) / 60
        : e < 180
        ? n
        : e < 240
        ? t + ((n - t) * (240 - e)) / 60
        : t) * 255
    );
  }
  var wh = Math.PI / 180,
    xh = 180 / Math.PI,
    ga = 18,
    _h = 0.96422,
    Sh = 1,
    Rh = 0.82521,
    Ch = 4 / 29,
    yi = 6 / 29,
    Th = 3 * yi * yi,
    Gb = yi * yi * yi;
  function Ph(e) {
    if (e instanceof Ln) return new Ln(e.l, e.a, e.b, e.opacity);
    if (e instanceof tr) return Nh(e);
    e instanceof qt || (e = As(e));
    var t = Ls(e.r),
      n = Ls(e.g),
      r = Ls(e.b),
      i = Bs((0.2225045 * t + 0.7168786 * n + 0.0606169 * r) / Sh),
      o,
      a;
    return (
      t === n && n === r
        ? (o = a = i)
        : ((o = Bs((0.4360747 * t + 0.3850649 * n + 0.1430804 * r) / _h)),
          (a = Bs((0.0139322 * t + 0.0971045 * n + 0.7141733 * r) / Rh))),
      new Ln(116 * i - 16, 500 * (o - i), 200 * (i - a), e.opacity)
    );
  }
  function Is(e, t, n, r) {
    return arguments.length === 1 ? Ph(e) : new Ln(e, t, n, r == null ? 1 : r);
  }
  function Ln(e, t, n, r) {
    (this.l = +e), (this.a = +t), (this.b = +n), (this.opacity = +r);
  }
  vi(
    Ln,
    Is,
    Ji(gr, {
      brighter: function (e) {
        return new Ln(
          this.l + ga * (e == null ? 1 : e),
          this.a,
          this.b,
          this.opacity
        );
      },
      darker: function (e) {
        return new Ln(
          this.l - ga * (e == null ? 1 : e),
          this.a,
          this.b,
          this.opacity
        );
      },
      rgb: function () {
        var e = (this.l + 16) / 116,
          t = isNaN(this.a) ? e : e + this.a / 500,
          n = isNaN(this.b) ? e : e - this.b / 200;
        return (
          (t = _h * Ds(t)),
          (e = Sh * Ds(e)),
          (n = Rh * Ds(n)),
          new qt(
            zs(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
            zs(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
            zs(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
            this.opacity
          )
        );
      },
    })
  );
  function Bs(e) {
    return e > Gb ? Math.pow(e, 1 / 3) : e / Th + Ch;
  }
  function Ds(e) {
    return e > yi ? e * e * e : Th * (e - Ch);
  }
  function zs(e) {
    return (
      255 * (e <= 0.0031308 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055)
    );
  }
  function Ls(e) {
    return (e /= 255) <= 0.04045
      ? e / 12.92
      : Math.pow((e + 0.055) / 1.055, 2.4);
  }
  function jb(e) {
    if (e instanceof tr) return new tr(e.h, e.c, e.l, e.opacity);
    if ((e instanceof Ln || (e = Ph(e)), e.a === 0 && e.b === 0))
      return new tr(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
    var t = Math.atan2(e.b, e.a) * xh;
    return new tr(
      t < 0 ? t + 360 : t,
      Math.sqrt(e.a * e.a + e.b * e.b),
      e.l,
      e.opacity
    );
  }
  function Gs(e, t, n, r) {
    return arguments.length === 1 ? jb(e) : new tr(e, t, n, r == null ? 1 : r);
  }
  function tr(e, t, n, r) {
    (this.h = +e), (this.c = +t), (this.l = +n), (this.opacity = +r);
  }
  function Nh(e) {
    if (isNaN(e.h)) return new Ln(e.l, 0, 0, e.opacity);
    var t = e.h * wh;
    return new Ln(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
  }
  vi(
    tr,
    Gs,
    Ji(gr, {
      brighter: function (e) {
        return new tr(
          this.h,
          this.c,
          this.l + ga * (e == null ? 1 : e),
          this.opacity
        );
      },
      darker: function (e) {
        return new tr(
          this.h,
          this.c,
          this.l - ga * (e == null ? 1 : e),
          this.opacity
        );
      },
      rgb: function () {
        return Nh(this).rgb();
      },
    })
  );
  var Eh = -0.14861,
    js = 1.78277,
    Hs = -0.29227,
    ma = -0.90649,
    no = 1.97294,
    Mh = no * ma,
    Oh = no * js,
    Ah = js * Hs - ma * Eh;
  function Hb(e) {
    if (e instanceof Wr) return new Wr(e.h, e.s, e.l, e.opacity);
    e instanceof qt || (e = As(e));
    var t = e.r / 255,
      n = e.g / 255,
      r = e.b / 255,
      i = (Ah * r + Mh * t - Oh * n) / (Ah + Mh - Oh),
      o = r - i,
      a = (no * (n - i) - Hs * o) / ma,
      u = Math.sqrt(a * a + o * o) / (no * i * (1 - i)),
      f = u ? Math.atan2(a, o) * xh - 120 : NaN;
    return new Wr(f < 0 ? f + 360 : f, u, i, e.opacity);
  }
  function Ws(e, t, n, r) {
    return arguments.length === 1 ? Hb(e) : new Wr(e, t, n, r == null ? 1 : r);
  }
  function Wr(e, t, n, r) {
    (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +r);
  }
  vi(
    Wr,
    Ws,
    Ji(gr, {
      brighter: function (e) {
        return (
          (e = e == null ? gi : Math.pow(gi, e)),
          new Wr(this.h, this.s, this.l * e, this.opacity)
        );
      },
      darker: function (e) {
        return (
          (e = e == null ? Hr : Math.pow(Hr, e)),
          new Wr(this.h, this.s, this.l * e, this.opacity)
        );
      },
      rgb: function () {
        var e = isNaN(this.h) ? 0 : (this.h + 120) * wh,
          t = +this.l,
          n = isNaN(this.s) ? 0 : this.s * t * (1 - t),
          r = Math.cos(e),
          i = Math.sin(e);
        return new qt(
          255 * (t + n * (Eh * r + js * i)),
          255 * (t + n * (Hs * r + ma * i)),
          255 * (t + n * (no * r)),
          this.opacity
        );
      },
    })
  );
  function kh(e, t, n, r, i) {
    var o = e * e,
      a = o * e;
    return (
      ((1 - 3 * e + 3 * o - a) * t +
        (4 - 6 * o + 3 * a) * n +
        (1 + 3 * e + 3 * o - 3 * a) * r +
        a * i) /
      6
    );
  }
  function $h(e) {
    var t = e.length - 1;
    return function (n) {
      var r = n <= 0 ? (n = 0) : n >= 1 ? ((n = 1), t - 1) : Math.floor(n * t),
        i = e[r],
        o = e[r + 1],
        a = r > 0 ? e[r - 1] : 2 * i - o,
        u = r < t - 1 ? e[r + 2] : 2 * o - i;
      return kh((n - r / t) * t, a, i, o, u);
    };
  }
  function Fh(e) {
    var t = e.length;
    return function (n) {
      var r = Math.floor(((n %= 1) < 0 ? ++n : n) * t),
        i = e[(r + t - 1) % t],
        o = e[r % t],
        a = e[(r + 1) % t],
        u = e[(r + 2) % t];
      return kh((n - r / t) * t, i, o, a, u);
    };
  }
  function ya(e) {
    return function () {
      return e;
    };
  }
  function Ih(e, t) {
    return function (n) {
      return e + n * t;
    };
  }
  function Wb(e, t, n) {
    return (
      (e = Math.pow(e, n)),
      (t = Math.pow(t, n) - e),
      (n = 1 / n),
      function (r) {
        return Math.pow(e + r * t, n);
      }
    );
  }
  function ba(e, t) {
    var n = t - e;
    return n
      ? Ih(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n)
      : ya(isNaN(e) ? t : e);
  }
  function Vb(e) {
    return (e = +e) == 1
      ? Gt
      : function (t, n) {
          return n - t ? Wb(t, n, e) : ya(isNaN(t) ? n : t);
        };
  }
  function Gt(e, t) {
    var n = t - e;
    return n ? Ih(e, n) : ya(isNaN(e) ? t : e);
  }
  const wa = (function e(t) {
    var n = Vb(t);
    function r(i, o) {
      var a = n((i = va(i)).r, (o = va(o)).r),
        u = n(i.g, o.g),
        f = n(i.b, o.b),
        c = Gt(i.opacity, o.opacity);
      return function (p) {
        return (
          (i.r = a(p)), (i.g = u(p)), (i.b = f(p)), (i.opacity = c(p)), i + ""
        );
      };
    }
    return (r.gamma = e), r;
  })(1);
  function Bh(e) {
    return function (t) {
      var n = t.length,
        r = new Array(n),
        i = new Array(n),
        o = new Array(n),
        a,
        u;
      for (a = 0; a < n; ++a)
        (u = va(t[a])), (r[a] = u.r || 0), (i[a] = u.g || 0), (o[a] = u.b || 0);
      return (
        (r = e(r)),
        (i = e(i)),
        (o = e(o)),
        (u.opacity = 1),
        function (f) {
          return (u.r = r(f)), (u.g = i(f)), (u.b = o(f)), u + "";
        }
      );
    };
  }
  var Ub = Bh($h),
    qb = Bh(Fh);
  function Vs(e, t) {
    t || (t = []);
    var n = e ? Math.min(t.length, e.length) : 0,
      r = t.slice(),
      i;
    return function (o) {
      for (i = 0; i < n; ++i) r[i] = e[i] * (1 - o) + t[i] * o;
      return r;
    };
  }
  function Dh(e) {
    return ArrayBuffer.isView(e) && !(e instanceof DataView);
  }
  function Yb(e, t) {
    return (Dh(t) ? Vs : zh)(e, t);
  }
  function zh(e, t) {
    var n = t ? t.length : 0,
      r = e ? Math.min(n, e.length) : 0,
      i = new Array(r),
      o = new Array(n),
      a;
    for (a = 0; a < r; ++a) i[a] = bi(e[a], t[a]);
    for (; a < n; ++a) o[a] = t[a];
    return function (u) {
      for (a = 0; a < r; ++a) o[a] = i[a](u);
      return o;
    };
  }
  function Lh(e, t) {
    var n = new Date();
    return (
      (e = +e),
      (t = +t),
      function (r) {
        return n.setTime(e * (1 - r) + t * r), n;
      }
    );
  }
  function En(e, t) {
    return (
      (e = +e),
      (t = +t),
      function (n) {
        return e * (1 - n) + t * n;
      }
    );
  }
  function Gh(e, t) {
    var n = {},
      r = {},
      i;
    (e === null || typeof e != "object") && (e = {}),
      (t === null || typeof t != "object") && (t = {});
    for (i in t) i in e ? (n[i] = bi(e[i], t[i])) : (r[i] = t[i]);
    return function (o) {
      for (i in n) r[i] = n[i](o);
      return r;
    };
  }
  var Us = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    qs = new RegExp(Us.source, "g");
  function Xb(e) {
    return function () {
      return e;
    };
  }
  function Kb(e) {
    return function (t) {
      return e(t) + "";
    };
  }
  function jh(e, t) {
    var n = (Us.lastIndex = qs.lastIndex = 0),
      r,
      i,
      o,
      a = -1,
      u = [],
      f = [];
    for (e = e + "", t = t + ""; (r = Us.exec(e)) && (i = qs.exec(t)); )
      (o = i.index) > n &&
        ((o = t.slice(n, o)), u[a] ? (u[a] += o) : (u[++a] = o)),
        (r = r[0]) === (i = i[0])
          ? u[a]
            ? (u[a] += i)
            : (u[++a] = i)
          : ((u[++a] = null), f.push({ i: a, x: En(r, i) })),
        (n = qs.lastIndex);
    return (
      n < t.length && ((o = t.slice(n)), u[a] ? (u[a] += o) : (u[++a] = o)),
      u.length < 2
        ? f[0]
          ? Kb(f[0].x)
          : Xb(t)
        : ((t = f.length),
          function (c) {
            for (var p = 0, h; p < t; ++p) u[(h = f[p]).i] = h.x(c);
            return u.join("");
          })
    );
  }
  function bi(e, t) {
    var n = typeof t,
      r;
    return t == null || n === "boolean"
      ? ya(t)
      : (n === "number"
          ? En
          : n === "string"
          ? (r = to(t))
            ? ((t = r), wa)
            : jh
          : t instanceof to
          ? wa
          : t instanceof Date
          ? Lh
          : Dh(t)
          ? Vs
          : Array.isArray(t)
          ? zh
          : (typeof t.valueOf != "function" &&
              typeof t.toString != "function") ||
            isNaN(t)
          ? Gh
          : En)(e, t);
  }
  function Qb(e) {
    var t = e.length;
    return function (n) {
      return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
    };
  }
  function Zb(e, t) {
    var n = ba(+e, +t);
    return function (r) {
      var i = n(r);
      return i - 360 * Math.floor(i / 360);
    };
  }
  function ro(e, t) {
    return (
      (e = +e),
      (t = +t),
      function (n) {
        return Math.round(e * (1 - n) + t * n);
      }
    );
  }
  var Hh = 180 / Math.PI,
    Ys = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1,
    };
  function Wh(e, t, n, r, i, o) {
    var a, u, f;
    return (
      (a = Math.sqrt(e * e + t * t)) && ((e /= a), (t /= a)),
      (f = e * n + t * r) && ((n -= e * f), (r -= t * f)),
      (u = Math.sqrt(n * n + r * r)) && ((n /= u), (r /= u), (f /= u)),
      e * r < t * n && ((e = -e), (t = -t), (f = -f), (a = -a)),
      {
        translateX: i,
        translateY: o,
        rotate: Math.atan2(t, e) * Hh,
        skewX: Math.atan(f) * Hh,
        scaleX: a,
        scaleY: u,
      }
    );
  }
  var io, Xs, Vh, xa;
  function Jb(e) {
    return e === "none"
      ? Ys
      : (io ||
          ((io = document.createElement("DIV")),
          (Xs = document.documentElement),
          (Vh = document.defaultView)),
        (io.style.transform = e),
        (e = Vh.getComputedStyle(Xs.appendChild(io), null).getPropertyValue(
          "transform"
        )),
        Xs.removeChild(io),
        (e = e.slice(7, -1).split(",")),
        Wh(+e[0], +e[1], +e[2], +e[3], +e[4], +e[5]));
  }
  function e1(e) {
    return e == null ||
      (xa || (xa = document.createElementNS("http://www.w3.org/2000/svg", "g")),
      xa.setAttribute("transform", e),
      !(e = xa.transform.baseVal.consolidate()))
      ? Ys
      : ((e = e.matrix), Wh(e.a, e.b, e.c, e.d, e.e, e.f));
  }
  function Uh(e, t, n, r) {
    function i(c) {
      return c.length ? c.pop() + " " : "";
    }
    function o(c, p, h, w, T, _) {
      if (c !== h || p !== w) {
        var P = T.push("translate(", null, t, null, n);
        _.push({ i: P - 4, x: En(c, h) }, { i: P - 2, x: En(p, w) });
      } else (h || w) && T.push("translate(" + h + t + w + n);
    }
    function a(c, p, h, w) {
      c !== p
        ? (c - p > 180 ? (p += 360) : p - c > 180 && (c += 360),
          w.push({ i: h.push(i(h) + "rotate(", null, r) - 2, x: En(c, p) }))
        : p && h.push(i(h) + "rotate(" + p + r);
    }
    function u(c, p, h, w) {
      c !== p
        ? w.push({ i: h.push(i(h) + "skewX(", null, r) - 2, x: En(c, p) })
        : p && h.push(i(h) + "skewX(" + p + r);
    }
    function f(c, p, h, w, T, _) {
      if (c !== h || p !== w) {
        var P = T.push(i(T) + "scale(", null, ",", null, ")");
        _.push({ i: P - 4, x: En(c, h) }, { i: P - 2, x: En(p, w) });
      } else (h !== 1 || w !== 1) && T.push(i(T) + "scale(" + h + "," + w + ")");
    }
    return function (c, p) {
      var h = [],
        w = [];
      return (
        (c = e(c)),
        (p = e(p)),
        o(c.translateX, c.translateY, p.translateX, p.translateY, h, w),
        a(c.rotate, p.rotate, h, w),
        u(c.skewX, p.skewX, h, w),
        f(c.scaleX, c.scaleY, p.scaleX, p.scaleY, h, w),
        (c = p = null),
        function (T) {
          for (var _ = -1, P = w.length, I; ++_ < P; ) h[(I = w[_]).i] = I.x(T);
          return h.join("");
        }
      );
    };
  }
  var t1 = Uh(Jb, "px, ", "px)", "deg)"),
    n1 = Uh(e1, ", ", ")", ")"),
    oo = Math.SQRT2,
    Ks = 2,
    qh = 4,
    r1 = 1e-12;
  function Yh(e) {
    return ((e = Math.exp(e)) + 1 / e) / 2;
  }
  function i1(e) {
    return ((e = Math.exp(e)) - 1 / e) / 2;
  }
  function o1(e) {
    return ((e = Math.exp(2 * e)) - 1) / (e + 1);
  }
  function a1(e, t) {
    var n = e[0],
      r = e[1],
      i = e[2],
      o = t[0],
      a = t[1],
      u = t[2],
      f = o - n,
      c = a - r,
      p = f * f + c * c,
      h,
      w;
    if (p < r1)
      (w = Math.log(u / i) / oo),
        (h = function (F) {
          return [n + F * f, r + F * c, i * Math.exp(oo * F * w)];
        });
    else {
      var T = Math.sqrt(p),
        _ = (u * u - i * i + qh * p) / (2 * i * Ks * T),
        P = (u * u - i * i - qh * p) / (2 * u * Ks * T),
        I = Math.log(Math.sqrt(_ * _ + 1) - _),
        k = Math.log(Math.sqrt(P * P + 1) - P);
      (w = (k - I) / oo),
        (h = function (F) {
          var N = F * w,
            G = Yh(I),
            M = (i / (Ks * T)) * (G * o1(oo * N + I) - i1(I));
          return [n + M * f, r + M * c, (i * G) / Yh(oo * N + I)];
        });
    }
    return (h.duration = w * 1e3), h;
  }
  function Xh(e) {
    return function (t, n) {
      var r = e((t = $s(t)).h, (n = $s(n)).h),
        i = Gt(t.s, n.s),
        o = Gt(t.l, n.l),
        a = Gt(t.opacity, n.opacity);
      return function (u) {
        return (
          (t.h = r(u)), (t.s = i(u)), (t.l = o(u)), (t.opacity = a(u)), t + ""
        );
      };
    };
  }
  const Kh = Xh(ba);
  var Qh = Xh(Gt);
  function Zh(e, t) {
    var n = Gt((e = Is(e)).l, (t = Is(t)).l),
      r = Gt(e.a, t.a),
      i = Gt(e.b, t.b),
      o = Gt(e.opacity, t.opacity);
    return function (a) {
      return (
        (e.l = n(a)), (e.a = r(a)), (e.b = i(a)), (e.opacity = o(a)), e + ""
      );
    };
  }
  function Jh(e) {
    return function (t, n) {
      var r = e((t = Gs(t)).h, (n = Gs(n)).h),
        i = Gt(t.c, n.c),
        o = Gt(t.l, n.l),
        a = Gt(t.opacity, n.opacity);
      return function (u) {
        return (
          (t.h = r(u)), (t.c = i(u)), (t.l = o(u)), (t.opacity = a(u)), t + ""
        );
      };
    };
  }
  const ep = Jh(ba);
  var tp = Jh(Gt);
  function np(e) {
    return (function t(n) {
      n = +n;
      function r(i, o) {
        var a = e((i = Ws(i)).h, (o = Ws(o)).h),
          u = Gt(i.s, o.s),
          f = Gt(i.l, o.l),
          c = Gt(i.opacity, o.opacity);
        return function (p) {
          return (
            (i.h = a(p)),
            (i.s = u(p)),
            (i.l = f(Math.pow(p, n))),
            (i.opacity = c(p)),
            i + ""
          );
        };
      }
      return (r.gamma = t), r;
    })(1);
  }
  const rp = np(ba);
  var ip = np(Gt);
  function op(e, t) {
    for (
      var n = 0, r = t.length - 1, i = t[0], o = new Array(r < 0 ? 0 : r);
      n < r;

    )
      o[n] = e(i, (i = t[++n]));
    return function (a) {
      var u = Math.max(0, Math.min(r - 1, Math.floor((a *= r))));
      return o[u](a - u);
    };
  }
  function u1(e, t) {
    for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e(r / (t - 1));
    return n;
  }
  const s1 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        interpolate: bi,
        interpolateArray: Yb,
        interpolateBasis: $h,
        interpolateBasisClosed: Fh,
        interpolateDate: Lh,
        interpolateDiscrete: Qb,
        interpolateHue: Zb,
        interpolateNumber: En,
        interpolateNumberArray: Vs,
        interpolateObject: Gh,
        interpolateRound: ro,
        interpolateString: jh,
        interpolateTransformCss: t1,
        interpolateTransformSvg: n1,
        interpolateZoom: a1,
        interpolateRgb: wa,
        interpolateRgbBasis: Ub,
        interpolateRgbBasisClosed: qb,
        interpolateHsl: Kh,
        interpolateHslLong: Qh,
        interpolateLab: Zh,
        interpolateHcl: ep,
        interpolateHclLong: tp,
        interpolateCubehelix: rp,
        interpolateCubehelixLong: ip,
        piecewise: op,
        quantize: u1,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  function l1(e) {
    return function () {
      return e;
    };
  }
  function _a(e) {
    return +e;
  }
  var ap = [0, 1];
  function tn(e) {
    return e;
  }
  function Qs(e, t) {
    return (t -= e = +e)
      ? function (n) {
          return (n - e) / t;
        }
      : l1(isNaN(t) ? NaN : 0.5);
  }
  function c1(e, t) {
    var n;
    return (
      e > t && ((n = e), (e = t), (t = n)),
      function (r) {
        return Math.max(e, Math.min(t, r));
      }
    );
  }
  function f1(e, t, n) {
    var r = e[0],
      i = e[1],
      o = t[0],
      a = t[1];
    return (
      i < r ? ((r = Qs(i, r)), (o = n(a, o))) : ((r = Qs(r, i)), (o = n(o, a))),
      function (u) {
        return o(r(u));
      }
    );
  }
  function d1(e, t, n) {
    var r = Math.min(e.length, t.length) - 1,
      i = new Array(r),
      o = new Array(r),
      a = -1;
    for (
      e[r] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse()));
      ++a < r;

    )
      (i[a] = Qs(e[a], e[a + 1])), (o[a] = n(t[a], t[a + 1]));
    return function (u) {
      var f = Qi(e, u, 1, r) - 1;
      return o[f](i[f](u));
    };
  }
  function ao(e, t) {
    return t
      .domain(e.domain())
      .range(e.range())
      .interpolate(e.interpolate())
      .clamp(e.clamp())
      .unknown(e.unknown());
  }
  function Sa() {
    var e = ap,
      t = ap,
      n = bi,
      r,
      i,
      o,
      a = tn,
      u,
      f,
      c;
    function p() {
      var w = Math.min(e.length, t.length);
      return (
        a !== tn && (a = c1(e[0], e[w - 1])),
        (u = w > 2 ? d1 : f1),
        (f = c = null),
        h
      );
    }
    function h(w) {
      return w == null || isNaN((w = +w))
        ? o
        : (f || (f = u(e.map(r), t, n)))(r(a(w)));
    }
    return (
      (h.invert = function (w) {
        return a(i((c || (c = u(t, e.map(r), En)))(w)));
      }),
      (h.domain = function (w) {
        return arguments.length ? ((e = Array.from(w, _a)), p()) : e.slice();
      }),
      (h.range = function (w) {
        return arguments.length ? ((t = Array.from(w)), p()) : t.slice();
      }),
      (h.rangeRound = function (w) {
        return (t = Array.from(w)), (n = ro), p();
      }),
      (h.clamp = function (w) {
        return arguments.length ? ((a = w ? !0 : tn), p()) : a !== tn;
      }),
      (h.interpolate = function (w) {
        return arguments.length ? ((n = w), p()) : n;
      }),
      (h.unknown = function (w) {
        return arguments.length ? ((o = w), h) : o;
      }),
      function (w, T) {
        return (r = w), (i = T), p();
      }
    );
  }
  function Zs() {
    return Sa()(tn, tn);
  }
  function h1(e) {
    return Math.abs((e = Math.round(e))) >= 1e21
      ? e.toLocaleString("en").replace(/,/g, "")
      : e.toString(10);
  }
  function Ra(e, t) {
    if (
      (n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) <
      0
    )
      return null;
    var n,
      r = e.slice(0, n);
    return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
  }
  function wi(e) {
    return (e = Ra(Math.abs(e))), e ? e[1] : NaN;
  }
  function p1(e, t) {
    return function (n, r) {
      for (
        var i = n.length, o = [], a = 0, u = e[0], f = 0;
        i > 0 &&
        u > 0 &&
        (f + u + 1 > r && (u = Math.max(1, r - f)),
        o.push(n.substring((i -= u), i + u)),
        !((f += u + 1) > r));

      )
        u = e[(a = (a + 1) % e.length)];
      return o.reverse().join(t);
    };
  }
  function v1(e) {
    return function (t) {
      return t.replace(/[0-9]/g, function (n) {
        return e[+n];
      });
    };
  }
  var g1 =
    /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  function Ca(e) {
    if (!(t = g1.exec(e))) throw new Error("invalid format: " + e);
    var t;
    return new Js({
      fill: t[1],
      align: t[2],
      sign: t[3],
      symbol: t[4],
      zero: t[5],
      width: t[6],
      comma: t[7],
      precision: t[8] && t[8].slice(1),
      trim: t[9],
      type: t[10],
    });
  }
  Ca.prototype = Js.prototype;
  function Js(e) {
    (this.fill = e.fill === void 0 ? " " : e.fill + ""),
      (this.align = e.align === void 0 ? ">" : e.align + ""),
      (this.sign = e.sign === void 0 ? "-" : e.sign + ""),
      (this.symbol = e.symbol === void 0 ? "" : e.symbol + ""),
      (this.zero = !!e.zero),
      (this.width = e.width === void 0 ? void 0 : +e.width),
      (this.comma = !!e.comma),
      (this.precision = e.precision === void 0 ? void 0 : +e.precision),
      (this.trim = !!e.trim),
      (this.type = e.type === void 0 ? "" : e.type + "");
  }
  Js.prototype.toString = function () {
    return (
      this.fill +
      this.align +
      this.sign +
      this.symbol +
      (this.zero ? "0" : "") +
      (this.width === void 0 ? "" : Math.max(1, this.width | 0)) +
      (this.comma ? "," : "") +
      (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) +
      (this.trim ? "~" : "") +
      this.type
    );
  };
  function m1(e) {
    e: for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
      switch (e[n]) {
        case ".":
          r = i = n;
          break;
        case "0":
          r === 0 && (r = n), (i = n);
          break;
        default:
          if (!+e[n]) break e;
          r > 0 && (r = 0);
          break;
      }
    return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
  }
  var up;
  function y1(e, t) {
    var n = Ra(e, t);
    if (!n) return e + "";
    var r = n[0],
      i = n[1],
      o = i - (up = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
      a = r.length;
    return o === a
      ? r
      : o > a
      ? r + new Array(o - a + 1).join("0")
      : o > 0
      ? r.slice(0, o) + "." + r.slice(o)
      : "0." + new Array(1 - o).join("0") + Ra(e, Math.max(0, t + o - 1))[0];
  }
  function sp(e, t) {
    var n = Ra(e, t);
    if (!n) return e + "";
    var r = n[0],
      i = n[1];
    return i < 0
      ? "0." + new Array(-i).join("0") + r
      : r.length > i + 1
      ? r.slice(0, i + 1) + "." + r.slice(i + 1)
      : r + new Array(i - r.length + 2).join("0");
  }
  const lp = {
    "%": (e, t) => (e * 100).toFixed(t),
    b: (e) => Math.round(e).toString(2),
    c: (e) => e + "",
    d: h1,
    e: (e, t) => e.toExponential(t),
    f: (e, t) => e.toFixed(t),
    g: (e, t) => e.toPrecision(t),
    o: (e) => Math.round(e).toString(8),
    p: (e, t) => sp(e * 100, t),
    r: sp,
    s: y1,
    X: (e) => Math.round(e).toString(16).toUpperCase(),
    x: (e) => Math.round(e).toString(16),
  };
  function cp(e) {
    return e;
  }
  var fp = Array.prototype.map,
    dp = [
      "y",
      "z",
      "a",
      "f",
      "p",
      "n",
      "\xB5",
      "m",
      "",
      "k",
      "M",
      "G",
      "T",
      "P",
      "E",
      "Z",
      "Y",
    ];
  function b1(e) {
    var t =
        e.grouping === void 0 || e.thousands === void 0
          ? cp
          : p1(fp.call(e.grouping, Number), e.thousands + ""),
      n = e.currency === void 0 ? "" : e.currency[0] + "",
      r = e.currency === void 0 ? "" : e.currency[1] + "",
      i = e.decimal === void 0 ? "." : e.decimal + "",
      o = e.numerals === void 0 ? cp : v1(fp.call(e.numerals, String)),
      a = e.percent === void 0 ? "%" : e.percent + "",
      u = e.minus === void 0 ? "\u2212" : e.minus + "",
      f = e.nan === void 0 ? "NaN" : e.nan + "";
    function c(h) {
      h = Ca(h);
      var w = h.fill,
        T = h.align,
        _ = h.sign,
        P = h.symbol,
        I = h.zero,
        k = h.width,
        F = h.comma,
        N = h.precision,
        G = h.trim,
        M = h.type;
      M === "n"
        ? ((F = !0), (M = "g"))
        : lp[M] || (N === void 0 && (N = 12), (G = !0), (M = "g")),
        (I || (w === "0" && T === "=")) && ((I = !0), (w = "0"), (T = "="));
      var D =
          P === "$"
            ? n
            : P === "#" && /[boxX]/.test(M)
            ? "0" + M.toLowerCase()
            : "",
        ne = P === "$" ? r : /[%p]/.test(M) ? a : "",
        Z = lp[M],
        he = /[defgprs%]/.test(M);
      N =
        N === void 0
          ? 6
          : /[gprs]/.test(M)
          ? Math.max(1, Math.min(21, N))
          : Math.max(0, Math.min(20, N));
      function me(ie) {
        var te = D,
          we = ne,
          ke,
          st,
          Ue;
        if (M === "c") (we = Z(ie) + we), (ie = "");
        else {
          ie = +ie;
          var lt = ie < 0 || 1 / ie < 0;
          if (
            ((ie = isNaN(ie) ? f : Z(Math.abs(ie), N)),
            G && (ie = m1(ie)),
            lt && +ie == 0 && _ !== "+" && (lt = !1),
            (te =
              (lt ? (_ === "(" ? _ : u) : _ === "-" || _ === "(" ? "" : _) +
              te),
            (we =
              (M === "s" ? dp[8 + up / 3] : "") +
              we +
              (lt && _ === "(" ? ")" : "")),
            he)
          ) {
            for (ke = -1, st = ie.length; ++ke < st; )
              if (((Ue = ie.charCodeAt(ke)), 48 > Ue || Ue > 57)) {
                (we = (Ue === 46 ? i + ie.slice(ke + 1) : ie.slice(ke)) + we),
                  (ie = ie.slice(0, ke));
                break;
              }
          }
        }
        F && !I && (ie = t(ie, 1 / 0));
        var ct = te.length + ie.length + we.length,
          ht = ct < k ? new Array(k - ct + 1).join(w) : "";
        switch (
          (F &&
            I &&
            ((ie = t(ht + ie, ht.length ? k - we.length : 1 / 0)), (ht = "")),
          T)
        ) {
          case "<":
            ie = te + ie + we + ht;
            break;
          case "=":
            ie = te + ht + ie + we;
            break;
          case "^":
            ie =
              ht.slice(0, (ct = ht.length >> 1)) + te + ie + we + ht.slice(ct);
            break;
          default:
            ie = ht + te + ie + we;
            break;
        }
        return o(ie);
      }
      return (
        (me.toString = function () {
          return h + "";
        }),
        me
      );
    }
    function p(h, w) {
      var T = c(((h = Ca(h)), (h.type = "f"), h)),
        _ = Math.max(-8, Math.min(8, Math.floor(wi(w) / 3))) * 3,
        P = Math.pow(10, -_),
        I = dp[8 + _ / 3];
      return function (k) {
        return T(P * k) + I;
      };
    }
    return { format: c, formatPrefix: p };
  }
  var Ta, el, hp;
  w1({ thousands: ",", grouping: [3], currency: ["$", ""] });
  function w1(e) {
    return (Ta = b1(e)), (el = Ta.format), (hp = Ta.formatPrefix), Ta;
  }
  function x1(e) {
    return Math.max(0, -wi(Math.abs(e)));
  }
  function _1(e, t) {
    return Math.max(
      0,
      Math.max(-8, Math.min(8, Math.floor(wi(t) / 3))) * 3 - wi(Math.abs(e))
    );
  }
  function S1(e, t) {
    return (
      (e = Math.abs(e)), (t = Math.abs(t) - e), Math.max(0, wi(t) - wi(e)) + 1
    );
  }
  function pp(e, t, n, r) {
    var i = Ms(e, t, n),
      o;
    switch (((r = Ca(r == null ? ",f" : r)), r.type)) {
      case "s": {
        var a = Math.max(Math.abs(e), Math.abs(t));
        return (
          r.precision == null && !isNaN((o = _1(i, a))) && (r.precision = o),
          hp(r, a)
        );
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        r.precision == null &&
          !isNaN((o = S1(i, Math.max(Math.abs(e), Math.abs(t))))) &&
          (r.precision = o - (r.type === "e"));
        break;
      }
      case "f":
      case "%": {
        r.precision == null &&
          !isNaN((o = x1(i))) &&
          (r.precision = o - (r.type === "%") * 2);
        break;
      }
    }
    return el(r);
  }
  function mr(e) {
    var t = e.domain;
    return (
      (e.ticks = function (n) {
        var r = t();
        return Es(r[0], r[r.length - 1], n == null ? 10 : n);
      }),
      (e.tickFormat = function (n, r) {
        var i = t();
        return pp(i[0], i[i.length - 1], n == null ? 10 : n, r);
      }),
      (e.nice = function (n) {
        n == null && (n = 10);
        var r = t(),
          i = 0,
          o = r.length - 1,
          a = r[i],
          u = r[o],
          f,
          c,
          p = 10;
        for (
          u < a && ((c = a), (a = u), (u = c), (c = i), (i = o), (o = c));
          p-- > 0;

        ) {
          if (((c = oh(a, u, n)), c === f)) return (r[i] = a), (r[o] = u), t(r);
          if (c > 0) (a = Math.floor(a / c) * c), (u = Math.ceil(u / c) * c);
          else if (c < 0)
            (a = Math.ceil(a * c) / c), (u = Math.floor(u * c) / c);
          else break;
          f = c;
        }
        return e;
      }),
      e
    );
  }
  function tl() {
    var e = Zs();
    return (
      (e.copy = function () {
        return ao(e, tl());
      }),
      gn.apply(e, arguments),
      mr(e)
    );
  }
  function vp(e) {
    var t;
    function n(r) {
      return r == null || isNaN((r = +r)) ? t : r;
    }
    return (
      (n.invert = n),
      (n.domain = n.range =
        function (r) {
          return arguments.length ? ((e = Array.from(r, _a)), n) : e.slice();
        }),
      (n.unknown = function (r) {
        return arguments.length ? ((t = r), n) : t;
      }),
      (n.copy = function () {
        return vp(e).unknown(t);
      }),
      (e = arguments.length ? Array.from(e, _a) : [0, 1]),
      mr(n)
    );
  }
  function gp(e, t) {
    e = e.slice();
    var n = 0,
      r = e.length - 1,
      i = e[n],
      o = e[r],
      a;
    return (
      o < i && ((a = n), (n = r), (r = a), (a = i), (i = o), (o = a)),
      (e[n] = t.floor(i)),
      (e[r] = t.ceil(o)),
      e
    );
  }
  function mp(e) {
    return Math.log(e);
  }
  function yp(e) {
    return Math.exp(e);
  }
  function R1(e) {
    return -Math.log(-e);
  }
  function C1(e) {
    return -Math.exp(-e);
  }
  function T1(e) {
    return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
  }
  function P1(e) {
    return e === 10
      ? T1
      : e === Math.E
      ? Math.exp
      : function (t) {
          return Math.pow(e, t);
        };
  }
  function N1(e) {
    return e === Math.E
      ? Math.log
      : (e === 10 && Math.log10) ||
          (e === 2 && Math.log2) ||
          ((e = Math.log(e)),
          function (t) {
            return Math.log(t) / e;
          });
  }
  function bp(e) {
    return function (t) {
      return -e(-t);
    };
  }
  function nl(e) {
    var t = e(mp, yp),
      n = t.domain,
      r = 10,
      i,
      o;
    function a() {
      return (
        (i = N1(r)),
        (o = P1(r)),
        n()[0] < 0 ? ((i = bp(i)), (o = bp(o)), e(R1, C1)) : e(mp, yp),
        t
      );
    }
    return (
      (t.base = function (u) {
        return arguments.length ? ((r = +u), a()) : r;
      }),
      (t.domain = function (u) {
        return arguments.length ? (n(u), a()) : n();
      }),
      (t.ticks = function (u) {
        var f = n(),
          c = f[0],
          p = f[f.length - 1],
          h;
        (h = p < c) && ((w = c), (c = p), (p = w));
        var w = i(c),
          T = i(p),
          _,
          P,
          I,
          k = u == null ? 10 : +u,
          F = [];
        if (!(r % 1) && T - w < k) {
          if (((w = Math.floor(w)), (T = Math.ceil(T)), c > 0)) {
            for (; w <= T; ++w)
              for (P = 1, _ = o(w); P < r; ++P)
                if (((I = _ * P), !(I < c))) {
                  if (I > p) break;
                  F.push(I);
                }
          } else
            for (; w <= T; ++w)
              for (P = r - 1, _ = o(w); P >= 1; --P)
                if (((I = _ * P), !(I < c))) {
                  if (I > p) break;
                  F.push(I);
                }
          F.length * 2 < k && (F = Es(c, p, k));
        } else F = Es(w, T, Math.min(T - w, k)).map(o);
        return h ? F.reverse() : F;
      }),
      (t.tickFormat = function (u, f) {
        if (
          (f == null && (f = r === 10 ? ".0e" : ","),
          typeof f != "function" && (f = el(f)),
          u === 1 / 0)
        )
          return f;
        u == null && (u = 10);
        var c = Math.max(1, (r * u) / t.ticks().length);
        return function (p) {
          var h = p / o(Math.round(i(p)));
          return h * r < r - 0.5 && (h *= r), h <= c ? f(p) : "";
        };
      }),
      (t.nice = function () {
        return n(
          gp(n(), {
            floor: function (u) {
              return o(Math.floor(i(u)));
            },
            ceil: function (u) {
              return o(Math.ceil(i(u)));
            },
          })
        );
      }),
      t
    );
  }
  function rl() {
    var e = nl(Sa()).domain([1, 10]);
    return (
      (e.copy = function () {
        return ao(e, rl()).base(e.base());
      }),
      gn.apply(e, arguments),
      e
    );
  }
  function wp(e) {
    return function (t) {
      return Math.sign(t) * Math.log1p(Math.abs(t / e));
    };
  }
  function xp(e) {
    return function (t) {
      return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
    };
  }
  function il(e) {
    var t = 1,
      n = e(wp(t), xp(t));
    return (
      (n.constant = function (r) {
        return arguments.length ? e(wp((t = +r)), xp(t)) : t;
      }),
      mr(n)
    );
  }
  function ol() {
    var e = il(Sa());
    return (
      (e.copy = function () {
        return ao(e, ol()).constant(e.constant());
      }),
      gn.apply(e, arguments)
    );
  }
  function _p(e) {
    return function (t) {
      return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
    };
  }
  function E1(e) {
    return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
  }
  function M1(e) {
    return e < 0 ? -e * e : e * e;
  }
  function al(e) {
    var t = e(tn, tn),
      n = 1;
    function r() {
      return n === 1 ? e(tn, tn) : n === 0.5 ? e(E1, M1) : e(_p(n), _p(1 / n));
    }
    return (
      (t.exponent = function (i) {
        return arguments.length ? ((n = +i), r()) : n;
      }),
      mr(t)
    );
  }
  function Pa() {
    var e = al(Sa());
    return (
      (e.copy = function () {
        return ao(e, Pa()).exponent(e.exponent());
      }),
      gn.apply(e, arguments),
      e
    );
  }
  function Sp() {
    return Pa.apply(null, arguments).exponent(0.5);
  }
  function Rp(e) {
    return Math.sign(e) * e * e;
  }
  function O1(e) {
    return Math.sign(e) * Math.sqrt(Math.abs(e));
  }
  function Cp() {
    var e = Zs(),
      t = [0, 1],
      n = !1,
      r;
    function i(o) {
      var a = O1(e(o));
      return isNaN(a) ? r : n ? Math.round(a) : a;
    }
    return (
      (i.invert = function (o) {
        return e.invert(Rp(o));
      }),
      (i.domain = function (o) {
        return arguments.length ? (e.domain(o), i) : e.domain();
      }),
      (i.range = function (o) {
        return arguments.length
          ? (e.range((t = Array.from(o, _a)).map(Rp)), i)
          : t.slice();
      }),
      (i.rangeRound = function (o) {
        return i.range(o).round(!0);
      }),
      (i.round = function (o) {
        return arguments.length ? ((n = !!o), i) : n;
      }),
      (i.clamp = function (o) {
        return arguments.length ? (e.clamp(o), i) : e.clamp();
      }),
      (i.unknown = function (o) {
        return arguments.length ? ((r = o), i) : r;
      }),
      (i.copy = function () {
        return Cp(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
      }),
      gn.apply(i, arguments),
      mr(i)
    );
  }
  function ul() {
    var e = [],
      t = [],
      n = [],
      r;
    function i() {
      var a = 0,
        u = Math.max(1, t.length);
      for (n = new Array(u - 1); ++a < u; ) n[a - 1] = Ab(e, a / u);
      return o;
    }
    function o(a) {
      return a == null || isNaN((a = +a)) ? r : t[Qi(n, a)];
    }
    return (
      (o.invertExtent = function (a) {
        var u = t.indexOf(a);
        return u < 0
          ? [NaN, NaN]
          : [u > 0 ? n[u - 1] : e[0], u < n.length ? n[u] : e[e.length - 1]];
      }),
      (o.domain = function (a) {
        if (!arguments.length) return e.slice();
        e = [];
        for (let u of a) u != null && !isNaN((u = +u)) && e.push(u);
        return e.sort(Ki), i();
      }),
      (o.range = function (a) {
        return arguments.length ? ((t = Array.from(a)), i()) : t.slice();
      }),
      (o.unknown = function (a) {
        return arguments.length ? ((r = a), o) : r;
      }),
      (o.quantiles = function () {
        return n.slice();
      }),
      (o.copy = function () {
        return ul().domain(e).range(t).unknown(r);
      }),
      gn.apply(o, arguments)
    );
  }
  function sl() {
    var e = 0,
      t = 1,
      n = 1,
      r = [0.5],
      i = [0, 1],
      o;
    function a(f) {
      return f != null && f <= f ? i[Qi(r, f, 0, n)] : o;
    }
    function u() {
      var f = -1;
      for (r = new Array(n); ++f < n; )
        r[f] = ((f + 1) * t - (f - n) * e) / (n + 1);
      return a;
    }
    return (
      (a.domain = function (f) {
        return arguments.length
          ? (([e, t] = f), (e = +e), (t = +t), u())
          : [e, t];
      }),
      (a.range = function (f) {
        return arguments.length
          ? ((n = (i = Array.from(f)).length - 1), u())
          : i.slice();
      }),
      (a.invertExtent = function (f) {
        var c = i.indexOf(f);
        return c < 0
          ? [NaN, NaN]
          : c < 1
          ? [e, r[0]]
          : c >= n
          ? [r[n - 1], t]
          : [r[c - 1], r[c]];
      }),
      (a.unknown = function (f) {
        return arguments.length && (o = f), a;
      }),
      (a.thresholds = function () {
        return r.slice();
      }),
      (a.copy = function () {
        return sl().domain([e, t]).range(i).unknown(o);
      }),
      gn.apply(mr(a), arguments)
    );
  }
  function ll() {
    var e = [0.5],
      t = [0, 1],
      n,
      r = 1;
    function i(o) {
      return o != null && o <= o ? t[Qi(e, o, 0, r)] : n;
    }
    return (
      (i.domain = function (o) {
        return arguments.length
          ? ((e = Array.from(o)), (r = Math.min(e.length, t.length - 1)), i)
          : e.slice();
      }),
      (i.range = function (o) {
        return arguments.length
          ? ((t = Array.from(o)), (r = Math.min(e.length, t.length - 1)), i)
          : t.slice();
      }),
      (i.invertExtent = function (o) {
        var a = t.indexOf(o);
        return [e[a - 1], e[a]];
      }),
      (i.unknown = function (o) {
        return arguments.length ? ((n = o), i) : n;
      }),
      (i.copy = function () {
        return ll().domain(e).range(t).unknown(n);
      }),
      gn.apply(i, arguments)
    );
  }
  var cl = new Date(),
    fl = new Date();
  function Dt(e, t, n, r) {
    function i(o) {
      return e((o = arguments.length === 0 ? new Date() : new Date(+o))), o;
    }
    return (
      (i.floor = function (o) {
        return e((o = new Date(+o))), o;
      }),
      (i.ceil = function (o) {
        return e((o = new Date(o - 1))), t(o, 1), e(o), o;
      }),
      (i.round = function (o) {
        var a = i(o),
          u = i.ceil(o);
        return o - a < u - o ? a : u;
      }),
      (i.offset = function (o, a) {
        return t((o = new Date(+o)), a == null ? 1 : Math.floor(a)), o;
      }),
      (i.range = function (o, a, u) {
        var f = [],
          c;
        if (
          ((o = i.ceil(o)),
          (u = u == null ? 1 : Math.floor(u)),
          !(o < a) || !(u > 0))
        )
          return f;
        do f.push((c = new Date(+o))), t(o, u), e(o);
        while (c < o && o < a);
        return f;
      }),
      (i.filter = function (o) {
        return Dt(
          function (a) {
            if (a >= a) for (; e(a), !o(a); ) a.setTime(a - 1);
          },
          function (a, u) {
            if (a >= a)
              if (u < 0) for (; ++u <= 0; ) for (; t(a, -1), !o(a); );
              else for (; --u >= 0; ) for (; t(a, 1), !o(a); );
          }
        );
      }),
      n &&
        ((i.count = function (o, a) {
          return (
            cl.setTime(+o), fl.setTime(+a), e(cl), e(fl), Math.floor(n(cl, fl))
          );
        }),
        (i.every = function (o) {
          return (
            (o = Math.floor(o)),
            !isFinite(o) || !(o > 0)
              ? null
              : o > 1
              ? i.filter(
                  r
                    ? function (a) {
                        return r(a) % o === 0;
                      }
                    : function (a) {
                        return i.count(0, a) % o === 0;
                      }
                )
              : i
          );
        })),
      i
    );
  }
  var Na = Dt(
    function () {},
    function (e, t) {
      e.setTime(+e + t);
    },
    function (e, t) {
      return t - e;
    }
  );
  Na.every = function (e) {
    return (
      (e = Math.floor(e)),
      !isFinite(e) || !(e > 0)
        ? null
        : e > 1
        ? Dt(
            function (t) {
              t.setTime(Math.floor(t / e) * e);
            },
            function (t, n) {
              t.setTime(+t + n * e);
            },
            function (t, n) {
              return (n - t) / e;
            }
          )
        : Na
    );
  };
  const dl = Na;
  var Tp = Na.range;
  const nr = 1e3,
    mn = nr * 60,
    rr = mn * 60,
    Vr = rr * 24,
    hl = Vr * 7,
    Pp = Vr * 30,
    pl = Vr * 365;
  var Np = Dt(
    function (e) {
      e.setTime(e - e.getMilliseconds());
    },
    function (e, t) {
      e.setTime(+e + t * nr);
    },
    function (e, t) {
      return (t - e) / nr;
    },
    function (e) {
      return e.getUTCSeconds();
    }
  );
  const Gn = Np;
  var Ep = Np.range,
    Mp = Dt(
      function (e) {
        e.setTime(e - e.getMilliseconds() - e.getSeconds() * nr);
      },
      function (e, t) {
        e.setTime(+e + t * mn);
      },
      function (e, t) {
        return (t - e) / mn;
      },
      function (e) {
        return e.getMinutes();
      }
    );
  const Ea = Mp;
  var A1 = Mp.range,
    Op = Dt(
      function (e) {
        e.setTime(
          e - e.getMilliseconds() - e.getSeconds() * nr - e.getMinutes() * mn
        );
      },
      function (e, t) {
        e.setTime(+e + t * rr);
      },
      function (e, t) {
        return (t - e) / rr;
      },
      function (e) {
        return e.getHours();
      }
    );
  const Ma = Op;
  var k1 = Op.range,
    Ap = Dt(
      (e) => e.setHours(0, 0, 0, 0),
      (e, t) => e.setDate(e.getDate() + t),
      (e, t) =>
        (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * mn) / Vr,
      (e) => e.getDate() - 1
    );
  const xi = Ap;
  var $1 = Ap.range;
  function Ur(e) {
    return Dt(
      function (t) {
        t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)),
          t.setHours(0, 0, 0, 0);
      },
      function (t, n) {
        t.setDate(t.getDate() + n * 7);
      },
      function (t, n) {
        return (
          (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * mn) / hl
        );
      }
    );
  }
  var qr = Ur(0),
    uo = Ur(1),
    kp = Ur(2),
    $p = Ur(3),
    Yr = Ur(4),
    Fp = Ur(5),
    Ip = Ur(6),
    Bp = qr.range,
    F1 = uo.range,
    I1 = kp.range,
    B1 = $p.range,
    D1 = Yr.range,
    z1 = Fp.range,
    L1 = Ip.range,
    Dp = Dt(
      function (e) {
        e.setDate(1), e.setHours(0, 0, 0, 0);
      },
      function (e, t) {
        e.setMonth(e.getMonth() + t);
      },
      function (e, t) {
        return (
          t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12
        );
      },
      function (e) {
        return e.getMonth();
      }
    );
  const Oa = Dp;
  var G1 = Dp.range,
    vl = Dt(
      function (e) {
        e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
      },
      function (e, t) {
        e.setFullYear(e.getFullYear() + t);
      },
      function (e, t) {
        return t.getFullYear() - e.getFullYear();
      },
      function (e) {
        return e.getFullYear();
      }
    );
  vl.every = function (e) {
    return !isFinite((e = Math.floor(e))) || !(e > 0)
      ? null
      : Dt(
          function (t) {
            t.setFullYear(Math.floor(t.getFullYear() / e) * e),
              t.setMonth(0, 1),
              t.setHours(0, 0, 0, 0);
          },
          function (t, n) {
            t.setFullYear(t.getFullYear() + n * e);
          }
        );
  };
  const ir = vl;
  var j1 = vl.range,
    zp = Dt(
      function (e) {
        e.setUTCSeconds(0, 0);
      },
      function (e, t) {
        e.setTime(+e + t * mn);
      },
      function (e, t) {
        return (t - e) / mn;
      },
      function (e) {
        return e.getUTCMinutes();
      }
    );
  const Aa = zp;
  var H1 = zp.range,
    Lp = Dt(
      function (e) {
        e.setUTCMinutes(0, 0, 0);
      },
      function (e, t) {
        e.setTime(+e + t * rr);
      },
      function (e, t) {
        return (t - e) / rr;
      },
      function (e) {
        return e.getUTCHours();
      }
    );
  const ka = Lp;
  var W1 = Lp.range,
    Gp = Dt(
      function (e) {
        e.setUTCHours(0, 0, 0, 0);
      },
      function (e, t) {
        e.setUTCDate(e.getUTCDate() + t);
      },
      function (e, t) {
        return (t - e) / Vr;
      },
      function (e) {
        return e.getUTCDate() - 1;
      }
    );
  const _i = Gp;
  var V1 = Gp.range;
  function Xr(e) {
    return Dt(
      function (t) {
        t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)),
          t.setUTCHours(0, 0, 0, 0);
      },
      function (t, n) {
        t.setUTCDate(t.getUTCDate() + n * 7);
      },
      function (t, n) {
        return (n - t) / hl;
      }
    );
  }
  var Kr = Xr(0),
    so = Xr(1),
    jp = Xr(2),
    Hp = Xr(3),
    Qr = Xr(4),
    Wp = Xr(5),
    Vp = Xr(6),
    Up = Kr.range,
    U1 = so.range,
    q1 = jp.range,
    Y1 = Hp.range,
    X1 = Qr.range,
    K1 = Wp.range,
    Q1 = Vp.range,
    qp = Dt(
      function (e) {
        e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
      },
      function (e, t) {
        e.setUTCMonth(e.getUTCMonth() + t);
      },
      function (e, t) {
        return (
          t.getUTCMonth() -
          e.getUTCMonth() +
          (t.getUTCFullYear() - e.getUTCFullYear()) * 12
        );
      },
      function (e) {
        return e.getUTCMonth();
      }
    );
  const $a = qp;
  var Z1 = qp.range,
    gl = Dt(
      function (e) {
        e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
      },
      function (e, t) {
        e.setUTCFullYear(e.getUTCFullYear() + t);
      },
      function (e, t) {
        return t.getUTCFullYear() - e.getUTCFullYear();
      },
      function (e) {
        return e.getUTCFullYear();
      }
    );
  gl.every = function (e) {
    return !isFinite((e = Math.floor(e))) || !(e > 0)
      ? null
      : Dt(
          function (t) {
            t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
              t.setUTCMonth(0, 1),
              t.setUTCHours(0, 0, 0, 0);
          },
          function (t, n) {
            t.setUTCFullYear(t.getUTCFullYear() + n * e);
          }
        );
  };
  const or = gl;
  var J1 = gl.range;
  function Yp(e, t, n, r, i, o) {
    const a = [
      [Gn, 1, nr],
      [Gn, 5, 5 * nr],
      [Gn, 15, 15 * nr],
      [Gn, 30, 30 * nr],
      [o, 1, mn],
      [o, 5, 5 * mn],
      [o, 15, 15 * mn],
      [o, 30, 30 * mn],
      [i, 1, rr],
      [i, 3, 3 * rr],
      [i, 6, 6 * rr],
      [i, 12, 12 * rr],
      [r, 1, Vr],
      [r, 2, 2 * Vr],
      [n, 1, hl],
      [t, 1, Pp],
      [t, 3, 3 * Pp],
      [e, 1, pl],
    ];
    function u(c, p, h) {
      const w = p < c;
      w && ([c, p] = [p, c]);
      const T = h && typeof h.range == "function" ? h : f(c, p, h),
        _ = T ? T.range(c, +p + 1) : [];
      return w ? _.reverse() : _;
    }
    function f(c, p, h) {
      const w = Math.abs(p - c) / h,
        T = fa(([, , I]) => I).right(a, w);
      if (T === a.length) return e.every(Ms(c / pl, p / pl, h));
      if (T === 0) return dl.every(Math.max(Ms(c, p, h), 1));
      const [_, P] = a[w / a[T - 1][2] < a[T][2] / w ? T - 1 : T];
      return _.every(P);
    }
    return [u, f];
  }
  const [Xp, Kp] = Yp(or, $a, Kr, _i, ka, Aa),
    [Qp, Zp] = Yp(ir, Oa, qr, xi, Ma, Ea),
    ew = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          timeInterval: Dt,
          timeMillisecond: dl,
          timeMilliseconds: Tp,
          utcMillisecond: dl,
          utcMilliseconds: Tp,
          timeSecond: Gn,
          timeSeconds: Ep,
          utcSecond: Gn,
          utcSeconds: Ep,
          timeMinute: Ea,
          timeMinutes: A1,
          timeHour: Ma,
          timeHours: k1,
          timeDay: xi,
          timeDays: $1,
          timeWeek: qr,
          timeWeeks: Bp,
          timeSunday: qr,
          timeSundays: Bp,
          timeMonday: uo,
          timeMondays: F1,
          timeTuesday: kp,
          timeTuesdays: I1,
          timeWednesday: $p,
          timeWednesdays: B1,
          timeThursday: Yr,
          timeThursdays: D1,
          timeFriday: Fp,
          timeFridays: z1,
          timeSaturday: Ip,
          timeSaturdays: L1,
          timeMonth: Oa,
          timeMonths: G1,
          timeYear: ir,
          timeYears: j1,
          utcMinute: Aa,
          utcMinutes: H1,
          utcHour: ka,
          utcHours: W1,
          utcDay: _i,
          utcDays: V1,
          utcWeek: Kr,
          utcWeeks: Up,
          utcSunday: Kr,
          utcSundays: Up,
          utcMonday: so,
          utcMondays: U1,
          utcTuesday: jp,
          utcTuesdays: q1,
          utcWednesday: Hp,
          utcWednesdays: Y1,
          utcThursday: Qr,
          utcThursdays: X1,
          utcFriday: Wp,
          utcFridays: K1,
          utcSaturday: Vp,
          utcSaturdays: Q1,
          utcMonth: $a,
          utcMonths: Z1,
          utcYear: or,
          utcYears: J1,
          utcTicks: Xp,
          utcTickInterval: Kp,
          timeTicks: Qp,
          timeTickInterval: Zp,
        },
        Symbol.toStringTag,
        { value: "Module" }
      )
    );
  function ml(e) {
    if (0 <= e.y && e.y < 100) {
      var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
      return t.setFullYear(e.y), t;
    }
    return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
  }
  function yl(e) {
    if (0 <= e.y && e.y < 100) {
      var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
      return t.setUTCFullYear(e.y), t;
    }
    return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
  }
  function lo(e, t, n) {
    return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
  }
  function tw(e) {
    var t = e.dateTime,
      n = e.date,
      r = e.time,
      i = e.periods,
      o = e.days,
      a = e.shortDays,
      u = e.months,
      f = e.shortMonths,
      c = co(i),
      p = fo(i),
      h = co(o),
      w = fo(o),
      T = co(a),
      _ = fo(a),
      P = co(u),
      I = fo(u),
      k = co(f),
      F = fo(f),
      N = {
        a: lt,
        A: ct,
        b: ht,
        B: U,
        c: null,
        d: iv,
        e: iv,
        f: Rw,
        g: $w,
        G: Iw,
        H: xw,
        I: _w,
        j: Sw,
        L: ov,
        m: Cw,
        M: Tw,
        p: se,
        q: Ne,
        Q: fv,
        s: dv,
        S: Pw,
        u: Nw,
        U: Ew,
        V: Mw,
        w: Ow,
        W: Aw,
        x: null,
        X: null,
        y: kw,
        Y: Fw,
        Z: Bw,
        "%": cv,
      },
      G = {
        a: $e,
        A: Te,
        b: Ce,
        B: Ee,
        c: null,
        d: uv,
        e: uv,
        f: Gw,
        g: Qw,
        G: Jw,
        H: Dw,
        I: zw,
        j: Lw,
        L: sv,
        m: jw,
        M: Hw,
        p: De,
        q: Ge,
        Q: fv,
        s: dv,
        S: Ww,
        u: Vw,
        U: Uw,
        V: qw,
        w: Yw,
        W: Xw,
        x: null,
        X: null,
        y: Kw,
        Y: Zw,
        Z: ex,
        "%": cv,
      },
      M = {
        a: me,
        A: ie,
        b: te,
        B: we,
        c: ke,
        d: nv,
        e: nv,
        f: mw,
        g: tv,
        G: ev,
        H: rv,
        I: rv,
        j: hw,
        L: gw,
        m: dw,
        M: pw,
        p: he,
        q: fw,
        Q: bw,
        s: ww,
        S: vw,
        u: aw,
        U: uw,
        V: sw,
        w: ow,
        W: lw,
        x: st,
        X: Ue,
        y: tv,
        Y: ev,
        Z: cw,
        "%": yw,
      };
    (N.x = D(n, N)),
      (N.X = D(r, N)),
      (N.c = D(t, N)),
      (G.x = D(n, G)),
      (G.X = D(r, G)),
      (G.c = D(t, G));
    function D(K, fe) {
      return function (je) {
        var B = [],
          yt = -1,
          ft = 0,
          Ct = K.length,
          At,
          en,
          un;
        for (je instanceof Date || (je = new Date(+je)); ++yt < Ct; )
          K.charCodeAt(yt) === 37 &&
            (B.push(K.slice(ft, yt)),
            (en = Jp[(At = K.charAt(++yt))]) != null
              ? (At = K.charAt(++yt))
              : (en = At === "e" ? " " : "0"),
            (un = fe[At]) && (At = un(je, en)),
            B.push(At),
            (ft = yt + 1));
        return B.push(K.slice(ft, yt)), B.join("");
      };
    }
    function ne(K, fe) {
      return function (je) {
        var B = lo(1900, void 0, 1),
          yt = Z(B, K, (je += ""), 0),
          ft,
          Ct;
        if (yt != je.length) return null;
        if ("Q" in B) return new Date(B.Q);
        if ("s" in B) return new Date(B.s * 1e3 + ("L" in B ? B.L : 0));
        if (
          (fe && !("Z" in B) && (B.Z = 0),
          "p" in B && (B.H = (B.H % 12) + B.p * 12),
          B.m === void 0 && (B.m = "q" in B ? B.q : 0),
          "V" in B)
        ) {
          if (B.V < 1 || B.V > 53) return null;
          "w" in B || (B.w = 1),
            "Z" in B
              ? ((ft = yl(lo(B.y, 0, 1))),
                (Ct = ft.getUTCDay()),
                (ft = Ct > 4 || Ct === 0 ? so.ceil(ft) : so(ft)),
                (ft = _i.offset(ft, (B.V - 1) * 7)),
                (B.y = ft.getUTCFullYear()),
                (B.m = ft.getUTCMonth()),
                (B.d = ft.getUTCDate() + ((B.w + 6) % 7)))
              : ((ft = ml(lo(B.y, 0, 1))),
                (Ct = ft.getDay()),
                (ft = Ct > 4 || Ct === 0 ? uo.ceil(ft) : uo(ft)),
                (ft = xi.offset(ft, (B.V - 1) * 7)),
                (B.y = ft.getFullYear()),
                (B.m = ft.getMonth()),
                (B.d = ft.getDate() + ((B.w + 6) % 7)));
        } else ("W" in B || "U" in B) && ("w" in B || (B.w = "u" in B ? B.u % 7 : "W" in B ? 1 : 0), (Ct = "Z" in B ? yl(lo(B.y, 0, 1)).getUTCDay() : ml(lo(B.y, 0, 1)).getDay()), (B.m = 0), (B.d = "W" in B ? ((B.w + 6) % 7) + B.W * 7 - ((Ct + 5) % 7) : B.w + B.U * 7 - ((Ct + 6) % 7)));
        return "Z" in B
          ? ((B.H += (B.Z / 100) | 0), (B.M += B.Z % 100), yl(B))
          : ml(B);
      };
    }
    function Z(K, fe, je, B) {
      for (var yt = 0, ft = fe.length, Ct = je.length, At, en; yt < ft; ) {
        if (B >= Ct) return -1;
        if (((At = fe.charCodeAt(yt++)), At === 37)) {
          if (
            ((At = fe.charAt(yt++)),
            (en = M[At in Jp ? fe.charAt(yt++) : At]),
            !en || (B = en(K, je, B)) < 0)
          )
            return -1;
        } else if (At != je.charCodeAt(B++)) return -1;
      }
      return B;
    }
    function he(K, fe, je) {
      var B = c.exec(fe.slice(je));
      return B ? ((K.p = p.get(B[0].toLowerCase())), je + B[0].length) : -1;
    }
    function me(K, fe, je) {
      var B = T.exec(fe.slice(je));
      return B ? ((K.w = _.get(B[0].toLowerCase())), je + B[0].length) : -1;
    }
    function ie(K, fe, je) {
      var B = h.exec(fe.slice(je));
      return B ? ((K.w = w.get(B[0].toLowerCase())), je + B[0].length) : -1;
    }
    function te(K, fe, je) {
      var B = k.exec(fe.slice(je));
      return B ? ((K.m = F.get(B[0].toLowerCase())), je + B[0].length) : -1;
    }
    function we(K, fe, je) {
      var B = P.exec(fe.slice(je));
      return B ? ((K.m = I.get(B[0].toLowerCase())), je + B[0].length) : -1;
    }
    function ke(K, fe, je) {
      return Z(K, t, fe, je);
    }
    function st(K, fe, je) {
      return Z(K, n, fe, je);
    }
    function Ue(K, fe, je) {
      return Z(K, r, fe, je);
    }
    function lt(K) {
      return a[K.getDay()];
    }
    function ct(K) {
      return o[K.getDay()];
    }
    function ht(K) {
      return f[K.getMonth()];
    }
    function U(K) {
      return u[K.getMonth()];
    }
    function se(K) {
      return i[+(K.getHours() >= 12)];
    }
    function Ne(K) {
      return 1 + ~~(K.getMonth() / 3);
    }
    function $e(K) {
      return a[K.getUTCDay()];
    }
    function Te(K) {
      return o[K.getUTCDay()];
    }
    function Ce(K) {
      return f[K.getUTCMonth()];
    }
    function Ee(K) {
      return u[K.getUTCMonth()];
    }
    function De(K) {
      return i[+(K.getUTCHours() >= 12)];
    }
    function Ge(K) {
      return 1 + ~~(K.getUTCMonth() / 3);
    }
    return {
      format: function (K) {
        var fe = D((K += ""), N);
        return (
          (fe.toString = function () {
            return K;
          }),
          fe
        );
      },
      parse: function (K) {
        var fe = ne((K += ""), !1);
        return (
          (fe.toString = function () {
            return K;
          }),
          fe
        );
      },
      utcFormat: function (K) {
        var fe = D((K += ""), G);
        return (
          (fe.toString = function () {
            return K;
          }),
          fe
        );
      },
      utcParse: function (K) {
        var fe = ne((K += ""), !0);
        return (
          (fe.toString = function () {
            return K;
          }),
          fe
        );
      },
    };
  }
  var Jp = { "-": "", _: " ", 0: "0" },
    jt = /^\s*\d+/,
    nw = /^%/,
    rw = /[\\^$*+?|[\]().{}]/g;
  function _t(e, t, n) {
    var r = e < 0 ? "-" : "",
      i = (r ? -e : e) + "",
      o = i.length;
    return r + (o < n ? new Array(n - o + 1).join(t) + i : i);
  }
  function iw(e) {
    return e.replace(rw, "\\$&");
  }
  function co(e) {
    return new RegExp("^(?:" + e.map(iw).join("|") + ")", "i");
  }
  function fo(e) {
    return new Map(e.map((t, n) => [t.toLowerCase(), n]));
  }
  function ow(e, t, n) {
    var r = jt.exec(t.slice(n, n + 1));
    return r ? ((e.w = +r[0]), n + r[0].length) : -1;
  }
  function aw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 1));
    return r ? ((e.u = +r[0]), n + r[0].length) : -1;
  }
  function uw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.U = +r[0]), n + r[0].length) : -1;
  }
  function sw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.V = +r[0]), n + r[0].length) : -1;
  }
  function lw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.W = +r[0]), n + r[0].length) : -1;
  }
  function ev(e, t, n) {
    var r = jt.exec(t.slice(n, n + 4));
    return r ? ((e.y = +r[0]), n + r[0].length) : -1;
  }
  function tv(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r
      ? ((e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3)), n + r[0].length)
      : -1;
  }
  function cw(e, t, n) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
    return r
      ? ((e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), n + r[0].length)
      : -1;
  }
  function fw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 1));
    return r ? ((e.q = r[0] * 3 - 3), n + r[0].length) : -1;
  }
  function dw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.m = r[0] - 1), n + r[0].length) : -1;
  }
  function nv(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.d = +r[0]), n + r[0].length) : -1;
  }
  function hw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 3));
    return r ? ((e.m = 0), (e.d = +r[0]), n + r[0].length) : -1;
  }
  function rv(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.H = +r[0]), n + r[0].length) : -1;
  }
  function pw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.M = +r[0]), n + r[0].length) : -1;
  }
  function vw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 2));
    return r ? ((e.S = +r[0]), n + r[0].length) : -1;
  }
  function gw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 3));
    return r ? ((e.L = +r[0]), n + r[0].length) : -1;
  }
  function mw(e, t, n) {
    var r = jt.exec(t.slice(n, n + 6));
    return r ? ((e.L = Math.floor(r[0] / 1e3)), n + r[0].length) : -1;
  }
  function yw(e, t, n) {
    var r = nw.exec(t.slice(n, n + 1));
    return r ? n + r[0].length : -1;
  }
  function bw(e, t, n) {
    var r = jt.exec(t.slice(n));
    return r ? ((e.Q = +r[0]), n + r[0].length) : -1;
  }
  function ww(e, t, n) {
    var r = jt.exec(t.slice(n));
    return r ? ((e.s = +r[0]), n + r[0].length) : -1;
  }
  function iv(e, t) {
    return _t(e.getDate(), t, 2);
  }
  function xw(e, t) {
    return _t(e.getHours(), t, 2);
  }
  function _w(e, t) {
    return _t(e.getHours() % 12 || 12, t, 2);
  }
  function Sw(e, t) {
    return _t(1 + xi.count(ir(e), e), t, 3);
  }
  function ov(e, t) {
    return _t(e.getMilliseconds(), t, 3);
  }
  function Rw(e, t) {
    return ov(e, t) + "000";
  }
  function Cw(e, t) {
    return _t(e.getMonth() + 1, t, 2);
  }
  function Tw(e, t) {
    return _t(e.getMinutes(), t, 2);
  }
  function Pw(e, t) {
    return _t(e.getSeconds(), t, 2);
  }
  function Nw(e) {
    var t = e.getDay();
    return t === 0 ? 7 : t;
  }
  function Ew(e, t) {
    return _t(qr.count(ir(e) - 1, e), t, 2);
  }
  function av(e) {
    var t = e.getDay();
    return t >= 4 || t === 0 ? Yr(e) : Yr.ceil(e);
  }
  function Mw(e, t) {
    return (e = av(e)), _t(Yr.count(ir(e), e) + (ir(e).getDay() === 4), t, 2);
  }
  function Ow(e) {
    return e.getDay();
  }
  function Aw(e, t) {
    return _t(uo.count(ir(e) - 1, e), t, 2);
  }
  function kw(e, t) {
    return _t(e.getFullYear() % 100, t, 2);
  }
  function $w(e, t) {
    return (e = av(e)), _t(e.getFullYear() % 100, t, 2);
  }
  function Fw(e, t) {
    return _t(e.getFullYear() % 1e4, t, 4);
  }
  function Iw(e, t) {
    var n = e.getDay();
    return (
      (e = n >= 4 || n === 0 ? Yr(e) : Yr.ceil(e)),
      _t(e.getFullYear() % 1e4, t, 4)
    );
  }
  function Bw(e) {
    var t = e.getTimezoneOffset();
    return (
      (t > 0 ? "-" : ((t *= -1), "+")) +
      _t((t / 60) | 0, "0", 2) +
      _t(t % 60, "0", 2)
    );
  }
  function uv(e, t) {
    return _t(e.getUTCDate(), t, 2);
  }
  function Dw(e, t) {
    return _t(e.getUTCHours(), t, 2);
  }
  function zw(e, t) {
    return _t(e.getUTCHours() % 12 || 12, t, 2);
  }
  function Lw(e, t) {
    return _t(1 + _i.count(or(e), e), t, 3);
  }
  function sv(e, t) {
    return _t(e.getUTCMilliseconds(), t, 3);
  }
  function Gw(e, t) {
    return sv(e, t) + "000";
  }
  function jw(e, t) {
    return _t(e.getUTCMonth() + 1, t, 2);
  }
  function Hw(e, t) {
    return _t(e.getUTCMinutes(), t, 2);
  }
  function Ww(e, t) {
    return _t(e.getUTCSeconds(), t, 2);
  }
  function Vw(e) {
    var t = e.getUTCDay();
    return t === 0 ? 7 : t;
  }
  function Uw(e, t) {
    return _t(Kr.count(or(e) - 1, e), t, 2);
  }
  function lv(e) {
    var t = e.getUTCDay();
    return t >= 4 || t === 0 ? Qr(e) : Qr.ceil(e);
  }
  function qw(e, t) {
    return (
      (e = lv(e)), _t(Qr.count(or(e), e) + (or(e).getUTCDay() === 4), t, 2)
    );
  }
  function Yw(e) {
    return e.getUTCDay();
  }
  function Xw(e, t) {
    return _t(so.count(or(e) - 1, e), t, 2);
  }
  function Kw(e, t) {
    return _t(e.getUTCFullYear() % 100, t, 2);
  }
  function Qw(e, t) {
    return (e = lv(e)), _t(e.getUTCFullYear() % 100, t, 2);
  }
  function Zw(e, t) {
    return _t(e.getUTCFullYear() % 1e4, t, 4);
  }
  function Jw(e, t) {
    var n = e.getUTCDay();
    return (
      (e = n >= 4 || n === 0 ? Qr(e) : Qr.ceil(e)),
      _t(e.getUTCFullYear() % 1e4, t, 4)
    );
  }
  function ex() {
    return "+0000";
  }
  function cv() {
    return "%";
  }
  function fv(e) {
    return +e;
  }
  function dv(e) {
    return Math.floor(+e / 1e3);
  }
  var Si, hv, pv;
  tx({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });
  function tx(e) {
    return (
      (Si = tw(e)),
      (hv = Si.format),
      Si.parse,
      (pv = Si.utcFormat),
      Si.utcParse,
      Si
    );
  }
  function nx(e) {
    return new Date(e);
  }
  function rx(e) {
    return e instanceof Date ? +e : +new Date(+e);
  }
  function bl(e, t, n, r, i, o, a, u, f, c) {
    var p = Zs(),
      h = p.invert,
      w = p.domain,
      T = c(".%L"),
      _ = c(":%S"),
      P = c("%I:%M"),
      I = c("%I %p"),
      k = c("%a %d"),
      F = c("%b %d"),
      N = c("%B"),
      G = c("%Y");
    function M(D) {
      return (
        f(D) < D
          ? T
          : u(D) < D
          ? _
          : a(D) < D
          ? P
          : o(D) < D
          ? I
          : r(D) < D
          ? i(D) < D
            ? k
            : F
          : n(D) < D
          ? N
          : G
      )(D);
    }
    return (
      (p.invert = function (D) {
        return new Date(h(D));
      }),
      (p.domain = function (D) {
        return arguments.length ? w(Array.from(D, rx)) : w().map(nx);
      }),
      (p.ticks = function (D) {
        var ne = w();
        return e(ne[0], ne[ne.length - 1], D == null ? 10 : D);
      }),
      (p.tickFormat = function (D, ne) {
        return ne == null ? M : c(ne);
      }),
      (p.nice = function (D) {
        var ne = w();
        return (
          (!D || typeof D.range != "function") &&
            (D = t(ne[0], ne[ne.length - 1], D == null ? 10 : D)),
          D ? w(gp(ne, D)) : p
        );
      }),
      (p.copy = function () {
        return ao(p, bl(e, t, n, r, i, o, a, u, f, c));
      }),
      p
    );
  }
  function vv() {
    return gn.apply(
      bl(Qp, Zp, ir, Oa, qr, xi, Ma, Ea, Gn, hv).domain([
        new Date(2e3, 0, 1),
        new Date(2e3, 0, 2),
      ]),
      arguments
    );
  }
  function gv() {
    return gn.apply(
      bl(Xp, Kp, or, $a, Kr, _i, ka, Aa, Gn, pv).domain([
        Date.UTC(2e3, 0, 1),
        Date.UTC(2e3, 0, 2),
      ]),
      arguments
    );
  }
  function Fa() {
    var e = 0,
      t = 1,
      n,
      r,
      i,
      o,
      a = tn,
      u = !1,
      f;
    function c(h) {
      return h == null || isNaN((h = +h))
        ? f
        : a(
            i === 0
              ? 0.5
              : ((h = (o(h) - n) * i), u ? Math.max(0, Math.min(1, h)) : h)
          );
    }
    (c.domain = function (h) {
      return arguments.length
        ? (([e, t] = h),
          (n = o((e = +e))),
          (r = o((t = +t))),
          (i = n === r ? 0 : 1 / (r - n)),
          c)
        : [e, t];
    }),
      (c.clamp = function (h) {
        return arguments.length ? ((u = !!h), c) : u;
      }),
      (c.interpolator = function (h) {
        return arguments.length ? ((a = h), c) : a;
      });
    function p(h) {
      return function (w) {
        var T, _;
        return arguments.length
          ? (([T, _] = w), (a = h(T, _)), c)
          : [a(0), a(1)];
      };
    }
    return (
      (c.range = p(bi)),
      (c.rangeRound = p(ro)),
      (c.unknown = function (h) {
        return arguments.length ? ((f = h), c) : f;
      }),
      function (h) {
        return (
          (o = h), (n = h(e)), (r = h(t)), (i = n === r ? 0 : 1 / (r - n)), c
        );
      }
    );
  }
  function yr(e, t) {
    return t
      .domain(e.domain())
      .interpolator(e.interpolator())
      .clamp(e.clamp())
      .unknown(e.unknown());
  }
  function mv() {
    var e = mr(Fa()(tn));
    return (
      (e.copy = function () {
        return yr(e, mv());
      }),
      er.apply(e, arguments)
    );
  }
  function yv() {
    var e = nl(Fa()).domain([1, 10]);
    return (
      (e.copy = function () {
        return yr(e, yv()).base(e.base());
      }),
      er.apply(e, arguments)
    );
  }
  function bv() {
    var e = il(Fa());
    return (
      (e.copy = function () {
        return yr(e, bv()).constant(e.constant());
      }),
      er.apply(e, arguments)
    );
  }
  function wl() {
    var e = al(Fa());
    return (
      (e.copy = function () {
        return yr(e, wl()).exponent(e.exponent());
      }),
      er.apply(e, arguments)
    );
  }
  function ix() {
    return wl.apply(null, arguments).exponent(0.5);
  }
  function wv() {
    var e = [],
      t = tn;
    function n(r) {
      if (r != null && !isNaN((r = +r)))
        return t((Qi(e, r, 1) - 1) / (e.length - 1));
    }
    return (
      (n.domain = function (r) {
        if (!arguments.length) return e.slice();
        e = [];
        for (let i of r) i != null && !isNaN((i = +i)) && e.push(i);
        return e.sort(Ki), n;
      }),
      (n.interpolator = function (r) {
        return arguments.length ? ((t = r), n) : t;
      }),
      (n.range = function () {
        return e.map((r, i) => t(i / (e.length - 1)));
      }),
      (n.quantiles = function (r) {
        return Array.from({ length: r + 1 }, (i, o) => Ob(e, o / r));
      }),
      (n.copy = function () {
        return wv(t).domain(e);
      }),
      er.apply(n, arguments)
    );
  }
  function Ia() {
    var e = 0,
      t = 0.5,
      n = 1,
      r = 1,
      i,
      o,
      a,
      u,
      f,
      c = tn,
      p,
      h = !1,
      w;
    function T(P) {
      return isNaN((P = +P))
        ? w
        : ((P = 0.5 + ((P = +p(P)) - o) * (r * P < r * o ? u : f)),
          c(h ? Math.max(0, Math.min(1, P)) : P));
    }
    (T.domain = function (P) {
      return arguments.length
        ? (([e, t, n] = P),
          (i = p((e = +e))),
          (o = p((t = +t))),
          (a = p((n = +n))),
          (u = i === o ? 0 : 0.5 / (o - i)),
          (f = o === a ? 0 : 0.5 / (a - o)),
          (r = o < i ? -1 : 1),
          T)
        : [e, t, n];
    }),
      (T.clamp = function (P) {
        return arguments.length ? ((h = !!P), T) : h;
      }),
      (T.interpolator = function (P) {
        return arguments.length ? ((c = P), T) : c;
      });
    function _(P) {
      return function (I) {
        var k, F, N;
        return arguments.length
          ? (([k, F, N] = I), (c = op(P, [k, F, N])), T)
          : [c(0), c(0.5), c(1)];
      };
    }
    return (
      (T.range = _(bi)),
      (T.rangeRound = _(ro)),
      (T.unknown = function (P) {
        return arguments.length ? ((w = P), T) : w;
      }),
      function (P) {
        return (
          (p = P),
          (i = P(e)),
          (o = P(t)),
          (a = P(n)),
          (u = i === o ? 0 : 0.5 / (o - i)),
          (f = o === a ? 0 : 0.5 / (a - o)),
          (r = o < i ? -1 : 1),
          T
        );
      }
    );
  }
  function xv() {
    var e = mr(Ia()(tn));
    return (
      (e.copy = function () {
        return yr(e, xv());
      }),
      er.apply(e, arguments)
    );
  }
  function _v() {
    var e = nl(Ia()).domain([0.1, 1, 10]);
    return (
      (e.copy = function () {
        return yr(e, _v()).base(e.base());
      }),
      er.apply(e, arguments)
    );
  }
  function Sv() {
    var e = il(Ia());
    return (
      (e.copy = function () {
        return yr(e, Sv()).constant(e.constant());
      }),
      er.apply(e, arguments)
    );
  }
  function xl() {
    var e = al(Ia());
    return (
      (e.copy = function () {
        return yr(e, xl()).exponent(e.exponent());
      }),
      er.apply(e, arguments)
    );
  }
  function ox() {
    return xl.apply(null, arguments).exponent(0.5);
  }
  const ax = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        scaleBand: ha,
        scalePoint: fh,
        scaleIdentity: vp,
        scaleLinear: tl,
        scaleLog: rl,
        scaleSymlog: ol,
        scaleOrdinal: da,
        scaleImplicit: Os,
        scalePow: Pa,
        scaleSqrt: Sp,
        scaleRadial: Cp,
        scaleQuantile: ul,
        scaleQuantize: sl,
        scaleThreshold: ll,
        scaleTime: vv,
        scaleUtc: gv,
        scaleSequential: mv,
        scaleSequentialLog: yv,
        scaleSequentialPow: wl,
        scaleSequentialSqrt: ix,
        scaleSequentialSymlog: bv,
        scaleSequentialQuantile: wv,
        scaleDiverging: xv,
        scaleDivergingLog: _v,
        scaleDivergingPow: xl,
        scaleDivergingSqrt: ox,
        scaleDivergingSymlog: Sv,
        tickFormat: pp,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  function ux(e, t) {
    t.domain &&
      ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
  }
  function sx(e, t) {
    t.range && ("padding" in e, e.range(t.range));
  }
  function lx(e, t) {
    "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
  }
  function cx(e, t) {
    "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
  }
  function fx(e, t) {
    "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
  }
  function dx(e, t) {
    "constant" in e &&
      "constant" in t &&
      typeof t.constant < "u" &&
      e.constant(t.constant);
  }
  function hx(e, t) {
    "exponent" in e &&
      "exponent" in t &&
      typeof t.exponent < "u" &&
      e.exponent(t.exponent);
  }
  var Rv = {
    lab: Zh,
    hcl: ep,
    "hcl-long": tp,
    hsl: Kh,
    "hsl-long": Qh,
    cubehelix: rp,
    "cubehelix-long": ip,
    rgb: wa,
  };
  function px(e) {
    switch (e) {
      case "lab":
      case "hcl":
      case "hcl-long":
      case "hsl":
      case "hsl-long":
      case "cubehelix":
      case "cubehelix-long":
      case "rgb":
        return Rv[e];
    }
    var t = e.type,
      n = e.gamma,
      r = Rv[t];
    return typeof n > "u" ? r : r.gamma(n);
  }
  function vx(e, t) {
    if (
      "interpolate" in t &&
      "interpolate" in e &&
      typeof t.interpolate < "u"
    ) {
      var n = px(t.interpolate);
      e.interpolate(n);
    }
  }
  var gx = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)),
    mx = "%Y-%m-%d %H:%M";
  function yx(e) {
    var t = e.tickFormat(1, mx)(gx);
    return t === "2020-02-02 03:04";
  }
  var Cv = {
      day: xi,
      hour: Ma,
      minute: Ea,
      month: Oa,
      second: Gn,
      week: qr,
      year: ir,
    },
    Tv = {
      day: _i,
      hour: ka,
      minute: Aa,
      month: $a,
      second: Gn,
      week: Kr,
      year: or,
    };
  function bx(e, t) {
    if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
      var n = t.nice;
      if (typeof n == "boolean") n && e.nice();
      else if (typeof n == "number") e.nice(n);
      else {
        var r = e,
          i = yx(r);
        if (typeof n == "string") r.nice(i ? Tv[n] : Cv[n]);
        else {
          var o = n.interval,
            a = n.step,
            u = (i ? Tv[o] : Cv[o]).every(a);
          u != null && r.nice(u);
        }
      }
    }
  }
  function wx(e, t) {
    "padding" in e &&
      "padding" in t &&
      typeof t.padding < "u" &&
      e.padding(t.padding),
      "paddingInner" in e &&
        "paddingInner" in t &&
        typeof t.paddingInner < "u" &&
        e.paddingInner(t.paddingInner),
      "paddingOuter" in e &&
        "paddingOuter" in t &&
        typeof t.paddingOuter < "u" &&
        e.paddingOuter(t.paddingOuter);
  }
  function xx(e, t) {
    if (t.reverse) {
      var n = e.range().slice().reverse();
      "padding" in e, e.range(n);
    }
  }
  function _x(e, t) {
    "round" in t &&
      typeof t.round < "u" &&
      (t.round && "interpolate" in t && typeof t.interpolate < "u"
        ? console.warn(
            "[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:",
            t
          )
        : "round" in e
        ? e.round(t.round)
        : "interpolate" in e && t.round && e.interpolate(ro));
  }
  function Sx(e, t) {
    "unknown" in e &&
      "unknown" in t &&
      typeof t.unknown < "u" &&
      e.unknown(t.unknown);
  }
  function Rx(e, t) {
    if ("zero" in t && t.zero === !0) {
      var n = e.domain(),
        r = n[0],
        i = n[1],
        o = i < r,
        a = o ? [i, r] : [r, i],
        u = a[0],
        f = a[1],
        c = [Math.min(0, u), Math.max(0, f)];
      e.domain(o ? c.reverse() : c);
    }
  }
  var Cx = [
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
      "unknown",
    ],
    Tx = {
      domain: ux,
      nice: bx,
      zero: Rx,
      interpolate: vx,
      round: _x,
      align: lx,
      base: cx,
      clamp: fx,
      constant: dx,
      exponent: hx,
      padding: wx,
      range: sx,
      reverse: xx,
      unknown: Sx,
    };
  function cn() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    var r = new Set(t),
      i = Cx.filter(function (o) {
        return r.has(o);
      });
    return function (a, u) {
      return (
        typeof u < "u" &&
          i.forEach(function (f) {
            Tx[f](a, u);
          }),
        a
      );
    };
  }
  var Px = cn("domain", "range", "reverse", "align", "padding", "round");
  function Nx(e) {
    return Px(ha(), e);
  }
  var Ex = cn("domain", "range", "reverse", "align", "padding", "round");
  function Mx(e) {
    return Ex(fh(), e);
  }
  var Ox = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "interpolate",
    "nice",
    "round",
    "zero"
  );
  function Pv(e) {
    return Ox(tl(), e);
  }
  var Ax = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "interpolate",
    "nice",
    "round"
  );
  function kx(e) {
    return Ax(vv(), e);
  }
  var $x = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "interpolate",
    "nice",
    "round"
  );
  function Fx(e) {
    return $x(gv(), e);
  }
  var Ix = cn(
    "domain",
    "range",
    "reverse",
    "base",
    "clamp",
    "interpolate",
    "nice",
    "round"
  );
  function Bx(e) {
    return Ix(rl(), e);
  }
  var Dx = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "exponent",
    "interpolate",
    "nice",
    "round",
    "zero"
  );
  function zx(e) {
    return Dx(Pa(), e);
  }
  var Lx = cn("domain", "range", "reverse", "unknown");
  function Gx(e) {
    return Lx(da(), e);
  }
  var jx = cn("domain", "range", "reverse", "nice", "zero");
  function Hx(e) {
    return jx(sl(), e);
  }
  var Wx = cn("domain", "range", "reverse");
  function Vx(e) {
    return Wx(ul(), e);
  }
  var Ux = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "constant",
    "nice",
    "zero",
    "round"
  );
  function qx(e) {
    return Ux(ol(), e);
  }
  var Yx = cn("domain", "range", "reverse");
  function Xx(e) {
    return Yx(ll(), e);
  }
  var Kx = cn(
    "domain",
    "range",
    "reverse",
    "clamp",
    "interpolate",
    "nice",
    "round",
    "zero"
  );
  function Qx(e) {
    return Kx(Sp(), e);
  }
  function Ba(e) {
    if (typeof e < "u" && "type" in e)
      switch (e.type) {
        case "linear":
          return Pv(e);
        case "log":
          return Bx(e);
        case "pow":
          return zx(e);
        case "sqrt":
          return Qx(e);
        case "symlog":
          return qx(e);
        case "time":
          return kx(e);
        case "utc":
          return Fx(e);
        case "quantile":
          return Vx(e);
        case "quantize":
          return Hx(e);
        case "threshold":
          return Xx(e);
        case "ordinal":
          return Gx(e);
        case "point":
          return Mx(e);
        case "band":
          return Nx(e);
      }
    return Pv(e);
  }
  function Zx(e) {
    if (
      (typeof e == "function" || (typeof e == "object" && !!e)) &&
      "valueOf" in e
    ) {
      var t = e.valueOf();
      if (typeof t == "number") return t;
    }
    return e;
  }
  var Jx = new Set(["linear", "pow", "quantize", "sqrt", "symlog"]);
  function Nv(e) {
    return Jx.has(e.type);
  }
  var e_ = Tn.default.createContext({});
  const br = e_;
  function _l(e) {
    var t,
      n = e;
    return n &&
      "bandwidth" in n &&
      (t = n == null ? void 0 : n.bandwidth()) != null
      ? t
      : 0;
  }
  function Jt(e) {
    return (
      e != null &&
      typeof e == "number" &&
      !Number.isNaN(e) &&
      Number.isFinite(e)
    );
  }
  let Sl = po();
  const at = (e) => ho(e, Sl);
  let Rl = po();
  at.write = (e) => ho(e, Rl);
  let Da = po();
  at.onStart = (e) => ho(e, Da);
  let Cl = po();
  at.onFrame = (e) => ho(e, Cl);
  let Tl = po();
  at.onFinish = (e) => ho(e, Tl);
  let Ri = [];
  at.setTimeout = (e, t) => {
    let n = at.now() + t,
      r = () => {
        let o = Ri.findIndex((a) => a.cancel == r);
        ~o && Ri.splice(o, 1), (xr -= ~o ? 1 : 0);
      },
      i = { time: n, handler: e, cancel: r };
    return Ri.splice(Ev(n), 0, i), (xr += 1), Mv(), i;
  };
  let Ev = (e) => ~(~Ri.findIndex((t) => t.time > e) || ~Ri.length);
  (at.cancel = (e) => {
    Da.delete(e), Cl.delete(e), Tl.delete(e), Sl.delete(e), Rl.delete(e);
  }),
    (at.sync = (e) => {
      (Nl = !0), at.batchedUpdates(e), (Nl = !1);
    }),
    (at.throttle = (e) => {
      let t;
      function n() {
        try {
          e(...t);
        } finally {
          t = null;
        }
      }
      function r(...i) {
        (t = i), at.onStart(n);
      }
      return (
        (r.handler = e),
        (r.cancel = () => {
          Da.delete(n), (t = null);
        }),
        r
      );
    });
  let Pl = typeof window < "u" ? window.requestAnimationFrame : () => {};
  (at.use = (e) => (Pl = e)),
    (at.now = typeof performance < "u" ? () => performance.now() : Date.now),
    (at.batchedUpdates = (e) => e()),
    (at.catch = console.error),
    (at.frameLoop = "always"),
    (at.advance = () => {
      at.frameLoop !== "demand"
        ? console.warn(
            "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
          )
        : Av();
    });
  let wr = -1,
    xr = 0,
    Nl = !1;
  function ho(e, t) {
    Nl ? (t.delete(e), e(0)) : (t.add(e), Mv());
  }
  function Mv() {
    wr < 0 && ((wr = 0), at.frameLoop !== "demand" && Pl(Ov));
  }
  function t_() {
    wr = -1;
  }
  function Ov() {
    ~wr && (Pl(Ov), at.batchedUpdates(Av));
  }
  function Av() {
    let e = wr;
    wr = at.now();
    let t = Ev(wr);
    if ((t && (kv(Ri.splice(0, t), (n) => n.handler()), (xr -= t)), !xr)) {
      t_();
      return;
    }
    Da.flush(),
      Sl.flush(e ? Math.min(64, wr - e) : 16.667),
      Cl.flush(),
      Rl.flush(),
      Tl.flush();
  }
  function po() {
    let e = new Set(),
      t = e;
    return {
      add(n) {
        (xr += t == e && !e.has(n) ? 1 : 0), e.add(n);
      },
      delete(n) {
        return (xr -= t == e && e.has(n) ? 1 : 0), e.delete(n);
      },
      flush(n) {
        t.size &&
          ((e = new Set()),
          (xr -= t.size),
          kv(t, (r) => r(n) && e.add(r)),
          (xr += e.size),
          (t = e));
      },
    };
  }
  function kv(e, t) {
    e.forEach((n) => {
      try {
        t(n);
      } catch (r) {
        at.catch(r);
      }
    });
  }
  function El() {}
  const n_ = (e, t, n) =>
      Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }),
    de = {
      arr: Array.isArray,
      obj: (e) => !!e && e.constructor.name === "Object",
      fun: (e) => typeof e == "function",
      str: (e) => typeof e == "string",
      num: (e) => typeof e == "number",
      und: (e) => e === void 0,
    };
  function ar(e, t) {
    if (de.arr(e)) {
      if (!de.arr(t) || e.length !== t.length) return !1;
      for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
      return !0;
    }
    return e === t;
  }
  const wt = (e, t) => e.forEach(t);
  function jn(e, t, n) {
    if (de.arr(e)) {
      for (let r = 0; r < e.length; r++) t.call(n, e[r], `${r}`);
      return;
    }
    for (const r in e) e.hasOwnProperty(r) && t.call(n, e[r], r);
  }
  const fn = (e) => (de.und(e) ? [] : de.arr(e) ? e : [e]);
  function vo(e, t) {
    if (e.size) {
      const n = Array.from(e);
      e.clear(), wt(n, t);
    }
  }
  const go = (e, ...t) => vo(e, (n) => n(...t)),
    Ml = () =>
      typeof window > "u" ||
      !window.navigator ||
      /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
  let Ol,
    $v,
    _r = null,
    Fv = !1,
    Al = El;
  var Hn = Object.freeze({
    __proto__: null,
    get createStringInterpolator() {
      return Ol;
    },
    get to() {
      return $v;
    },
    get colors() {
      return _r;
    },
    get skipAnimation() {
      return Fv;
    },
    get willAdvance() {
      return Al;
    },
    assign: (e) => {
      e.to && ($v = e.to),
        e.now && (at.now = e.now),
        e.colors !== void 0 && (_r = e.colors),
        e.skipAnimation != null && (Fv = e.skipAnimation),
        e.createStringInterpolator && (Ol = e.createStringInterpolator),
        e.requestAnimationFrame && at.use(e.requestAnimationFrame),
        e.batchedUpdates && (at.batchedUpdates = e.batchedUpdates),
        e.willAdvance && (Al = e.willAdvance),
        e.frameLoop && (at.frameLoop = e.frameLoop);
    },
  });
  const mo = new Set();
  let yn = [],
    kl = [],
    za = 0;
  const La = {
    get idle() {
      return !mo.size && !yn.length;
    },
    start(e) {
      za > e.priority ? (mo.add(e), at.onStart(r_)) : (Iv(e), at($l));
    },
    advance: $l,
    sort(e) {
      if (za) at.onFrame(() => La.sort(e));
      else {
        const t = yn.indexOf(e);
        ~t && (yn.splice(t, 1), Bv(e));
      }
    },
    clear() {
      (yn = []), mo.clear();
    },
  };
  function r_() {
    mo.forEach(Iv), mo.clear(), at($l);
  }
  function Iv(e) {
    yn.includes(e) || Bv(e);
  }
  function Bv(e) {
    yn.splice(
      i_(yn, (t) => t.priority > e.priority),
      0,
      e
    );
  }
  function $l(e) {
    const t = kl;
    for (let n = 0; n < yn.length; n++) {
      const r = yn[n];
      (za = r.priority), r.idle || (Al(r), r.advance(e), r.idle || t.push(r));
    }
    return (za = 0), (kl = yn), (kl.length = 0), (yn = t), yn.length > 0;
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
      yellowgreen: 2597139199,
    },
    Mn = "[-+]?\\d*\\.?\\d+",
    Ga = Mn + "%";
  function ja(...e) {
    return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
  }
  const a_ = new RegExp("rgb" + ja(Mn, Mn, Mn)),
    u_ = new RegExp("rgba" + ja(Mn, Mn, Mn, Mn)),
    s_ = new RegExp("hsl" + ja(Mn, Ga, Ga)),
    l_ = new RegExp("hsla" + ja(Mn, Ga, Ga, Mn)),
    c_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    f_ = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    d_ = /^#([0-9a-fA-F]{6})$/,
    h_ = /^#([0-9a-fA-F]{8})$/;
  function p_(e) {
    let t;
    return typeof e == "number"
      ? e >>> 0 === e && e >= 0 && e <= 4294967295
        ? e
        : null
      : (t = d_.exec(e))
      ? parseInt(t[1] + "ff", 16) >>> 0
      : _r && _r[e] !== void 0
      ? _r[e]
      : (t = a_.exec(e))
      ? ((Ci(t[1]) << 24) | (Ci(t[2]) << 16) | (Ci(t[3]) << 8) | 255) >>> 0
      : (t = u_.exec(e))
      ? ((Ci(t[1]) << 24) | (Ci(t[2]) << 16) | (Ci(t[3]) << 8) | Lv(t[4])) >>> 0
      : (t = c_.exec(e))
      ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0
      : (t = h_.exec(e))
      ? parseInt(t[1], 16) >>> 0
      : (t = f_.exec(e))
      ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>>
        0
      : (t = s_.exec(e))
      ? (Dv(zv(t[1]), Ha(t[2]), Ha(t[3])) | 255) >>> 0
      : (t = l_.exec(e))
      ? (Dv(zv(t[1]), Ha(t[2]), Ha(t[3])) | Lv(t[4])) >>> 0
      : null;
  }
  function Fl(e, t, n) {
    return (
      n < 0 && (n += 1),
      n > 1 && (n -= 1),
      n < 1 / 6
        ? e + (t - e) * 6 * n
        : n < 1 / 2
        ? t
        : n < 2 / 3
        ? e + (t - e) * (2 / 3 - n) * 6
        : e
    );
  }
  function Dv(e, t, n) {
    const r = n < 0.5 ? n * (1 + t) : n + t - n * t,
      i = 2 * n - r,
      o = Fl(i, r, e + 1 / 3),
      a = Fl(i, r, e),
      u = Fl(i, r, e - 1 / 3);
    return (
      (Math.round(o * 255) << 24) |
      (Math.round(a * 255) << 16) |
      (Math.round(u * 255) << 8)
    );
  }
  function Ci(e) {
    const t = parseInt(e, 10);
    return t < 0 ? 0 : t > 255 ? 255 : t;
  }
  function zv(e) {
    return (((parseFloat(e) % 360) + 360) % 360) / 360;
  }
  function Lv(e) {
    const t = parseFloat(e);
    return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
  }
  function Ha(e) {
    const t = parseFloat(e);
    return t < 0 ? 0 : t > 100 ? 1 : t / 100;
  }
  function Gv(e) {
    let t = p_(e);
    if (t === null) return e;
    t = t || 0;
    let n = (t & 4278190080) >>> 24,
      r = (t & 16711680) >>> 16,
      i = (t & 65280) >>> 8,
      o = (t & 255) / 255;
    return `rgba(${n}, ${r}, ${i}, ${o})`;
  }
  const yo = (e, t, n) => {
    if (de.fun(e)) return e;
    if (de.arr(e)) return yo({ range: e, output: t, extrapolate: n });
    if (de.str(e.output[0])) return Ol(e);
    const r = e,
      i = r.output,
      o = r.range || [0, 1],
      a = r.extrapolateLeft || r.extrapolate || "extend",
      u = r.extrapolateRight || r.extrapolate || "extend",
      f = r.easing || ((c) => c);
    return (c) => {
      const p = g_(c, o);
      return v_(c, o[p], o[p + 1], i[p], i[p + 1], f, a, u, r.map);
    };
  };
  function v_(e, t, n, r, i, o, a, u, f) {
    let c = f ? f(e) : e;
    if (c < t) {
      if (a === "identity") return c;
      a === "clamp" && (c = t);
    }
    if (c > n) {
      if (u === "identity") return c;
      u === "clamp" && (c = n);
    }
    return r === i
      ? r
      : t === n
      ? e <= t
        ? r
        : i
      : (t === -1 / 0
          ? (c = -c)
          : n === 1 / 0
          ? (c = c - t)
          : (c = (c - t) / (n - t)),
        (c = o(c)),
        r === -1 / 0
          ? (c = -c)
          : i === 1 / 0
          ? (c = c + r)
          : (c = c * (i - r) + r),
        c);
  }
  function g_(e, t) {
    for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n);
    return n - 1;
  }
  function Il() {
    return (
      (Il =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Il.apply(this, arguments)
    );
  }
  const Ti = Symbol.for("FluidValue.get"),
    Zr = Symbol.for("FluidValue.observers"),
    bn = (e) => Boolean(e && e[Ti]),
    rn = (e) => (e && e[Ti] ? e[Ti]() : e),
    jv = (e) => e[Zr] || null;
  function m_(e, t) {
    e.eventObserved ? e.eventObserved(t) : e(t);
  }
  function bo(e, t) {
    let n = e[Zr];
    n &&
      n.forEach((r) => {
        m_(r, t);
      });
  }
  class Hv {
    constructor(t) {
      if (((this[Ti] = void 0), (this[Zr] = void 0), !t && !(t = this.get)))
        throw Error("Unknown getter");
      y_(this, t);
    }
  }
  const y_ = (e, t) => Wv(e, Ti, t);
  function Pi(e, t) {
    if (e[Ti]) {
      let n = e[Zr];
      n || Wv(e, Zr, (n = new Set())),
        n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
    }
    return t;
  }
  function wo(e, t) {
    let n = e[Zr];
    if (n && n.has(t)) {
      const r = n.size - 1;
      r ? n.delete(t) : (e[Zr] = null),
        e.observerRemoved && e.observerRemoved(r, t);
    }
  }
  const Wv = (e, t, n) =>
      Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }),
    Wa = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    b_ =
      /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,
    Vv = new RegExp(`(${Wa.source})(%|[a-z]+)`, "i"),
    w_ = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi,
    Va = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/,
    Uv = (e) => {
      const [t, n] = x_(e);
      if (!t || Ml()) return e;
      const r = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(t);
      if (r) return r.trim();
      if (n && n.startsWith("--")) {
        const i = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(n);
        return i || e;
      } else {
        if (n && Va.test(n)) return Uv(n);
        if (n) return n;
      }
      return e;
    },
    x_ = (e) => {
      const t = Va.exec(e);
      if (!t) return [,];
      const [, n, r] = t;
      return [n, r];
    };
  let Bl;
  const __ = (e, t, n, r, i) =>
      `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`,
    qv = (e) => {
      Bl ||
        (Bl = _r
          ? new RegExp(`(${Object.keys(_r).join("|")})(?!\\w)`, "g")
          : /^\b$/);
      const t = e.output.map((o) =>
          rn(o).replace(Va, Uv).replace(b_, Gv).replace(Bl, Gv)
        ),
        n = t.map((o) => o.match(Wa).map(Number)),
        i = n[0]
          .map((o, a) =>
            n.map((u) => {
              if (!(a in u))
                throw Error('The arity of each "output" value must be equal');
              return u[a];
            })
          )
          .map((o) => yo(Il({}, e, { output: o })));
      return (o) => {
        var a;
        const u =
          !Vv.test(t[0]) &&
          ((a = t.find((c) => Vv.test(c))) == null
            ? void 0
            : a.replace(Wa, ""));
        let f = 0;
        return t[0].replace(Wa, () => `${i[f++](o)}${u || ""}`).replace(w_, __);
      };
    },
    Dl = "react-spring: ",
    Yv = (e) => {
      const t = e;
      let n = !1;
      if (typeof t != "function")
        throw new TypeError(`${Dl}once requires a function parameter`);
      return (...r) => {
        n || (t(...r), (n = !0));
      };
    },
    S_ = Yv(console.warn);
  function R_() {
    S_(
      `${Dl}The "interpolate" function is deprecated in v9 (use "to" instead)`
    );
  }
  const C_ = Yv(console.warn);
  function T_() {
    C_(
      `${Dl}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
    );
  }
  function Ua(e) {
    return (
      de.str(e) &&
      (e[0] == "#" || /\d/.test(e) || (!Ml() && Va.test(e)) || e in (_r || {}))
    );
  }
  const zl = Ml() ? Y.useEffect : Y.useLayoutEffect,
    P_ = () => {
      const e = Y.useRef(!1);
      return (
        zl(
          () => (
            (e.current = !0),
            () => {
              e.current = !1;
            }
          ),
          []
        ),
        e
      );
    };
  function Xv() {
    const e = Y.useState()[1],
      t = P_();
    return () => {
      t.current && e(Math.random());
    };
  }
  function N_(e, t) {
    const [n] = Y.useState(() => ({ inputs: t, result: e() })),
      r = Y.useRef(),
      i = r.current;
    let o = i;
    return (
      o
        ? Boolean(t && o.inputs && E_(t, o.inputs)) ||
          (o = { inputs: t, result: e() })
        : (o = n),
      Y.useEffect(() => {
        (r.current = o), i == n && (n.inputs = n.result = void 0);
      }, [o]),
      o.result
    );
  }
  function E_(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
    return !0;
  }
  const Kv = (e) => Y.useEffect(e, M_),
    M_ = [];
  function Qv(e) {
    const t = Y.useRef();
    return (
      Y.useEffect(() => {
        t.current = e;
      }),
      t.current
    );
  }
  var O_ =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@react-spring/animated/dist/react-spring-animated.esm.js";
  const xo = Symbol.for("Animated:node"),
    A_ = (e) => !!e && e[xo] === e,
    Wn = (e) => e && e[xo],
    Ll = (e, t) => n_(e, xo, t),
    qa = (e) => e && e[xo] && e[xo].getPayload();
  class Zv {
    constructor() {
      (this.payload = void 0), Ll(this, this);
    }
    getPayload() {
      return this.payload || [];
    }
  }
  class Ni extends Zv {
    constructor(t) {
      super(),
        (this.done = !0),
        (this.elapsedTime = void 0),
        (this.lastPosition = void 0),
        (this.lastVelocity = void 0),
        (this.v0 = void 0),
        (this.durationProgress = 0),
        (this._value = t),
        de.num(this._value) && (this.lastPosition = this._value);
    }
    static create(t) {
      return new Ni(t);
    }
    getPayload() {
      return [this];
    }
    getValue() {
      return this._value;
    }
    setValue(t, n) {
      return (
        de.num(t) &&
          ((this.lastPosition = t),
          n &&
            ((t = Math.round(t / n) * n),
            this.done && (this.lastPosition = t))),
        this._value === t ? !1 : ((this._value = t), !0)
      );
    }
    reset() {
      const { done: t } = this;
      (this.done = !1),
        de.num(this._value) &&
          ((this.elapsedTime = 0),
          (this.durationProgress = 0),
          (this.lastPosition = this._value),
          t && (this.lastVelocity = null),
          (this.v0 = null));
    }
  }
  class Ei extends Ni {
    constructor(t) {
      super(0),
        (this._string = null),
        (this._toString = void 0),
        (this._toString = yo({ output: [t, t] }));
    }
    static create(t) {
      return new Ei(t);
    }
    getValue() {
      let t = this._string;
      return t == null ? (this._string = this._toString(this._value)) : t;
    }
    setValue(t) {
      if (de.str(t)) {
        if (t == this._string) return !1;
        (this._string = t), (this._value = 1);
      } else if (super.setValue(t)) this._string = null;
      else return !1;
      return !0;
    }
    reset(t) {
      t && (this._toString = yo({ output: [this.getValue(), t] })),
        (this._value = 0),
        super.reset();
    }
  }
  const Ya = { dependencies: null };
  class Xa extends Zv {
    constructor(t) {
      super(), (this.source = t), this.setValue(t);
    }
    getValue(t) {
      const n = {};
      return (
        jn(this.source, (r, i) => {
          A_(r)
            ? (n[i] = r.getValue(t))
            : bn(r)
            ? (n[i] = rn(r))
            : t || (n[i] = r);
        }),
        n
      );
    }
    setValue(t) {
      (this.source = t), (this.payload = this._makePayload(t));
    }
    reset() {
      this.payload && wt(this.payload, (t) => t.reset());
    }
    _makePayload(t) {
      if (t) {
        const n = new Set();
        return jn(t, this._addToPayload, n), Array.from(n);
      }
    }
    _addToPayload(t) {
      Ya.dependencies && bn(t) && Ya.dependencies.add(t);
      const n = qa(t);
      n && wt(n, (r) => this.add(r));
    }
  }
  class Gl extends Xa {
    constructor(t) {
      super(t);
    }
    static create(t) {
      return new Gl(t);
    }
    getValue() {
      return this.source.map((t) => t.getValue());
    }
    setValue(t) {
      const n = this.getPayload();
      return t.length == n.length
        ? n.map((r, i) => r.setValue(t[i])).some(Boolean)
        : (super.setValue(t.map(k_)), !0);
    }
  }
  function k_(e) {
    return (Ua(e) ? Ei : Ni).create(e);
  }
  function jl(e) {
    const t = Wn(e);
    return t ? t.constructor : de.arr(e) ? Gl : Ua(e) ? Ei : Ni;
  }
  function Hl() {
    return (
      (Hl =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Hl.apply(this, arguments)
    );
  }
  const Jv = (e, t) => {
    const n = !de.fun(e) || (e.prototype && e.prototype.isReactComponent);
    return Y.forwardRef((r, i) => {
      const o = Y.useRef(null),
        a =
          n &&
          Y.useCallback(
            (_) => {
              o.current = I_(i, _);
            },
            [i]
          ),
        [u, f] = F_(r, t),
        c = Xv(),
        p = () => {
          const _ = o.current;
          if (n && !_) return;
          (_ ? t.applyAnimatedValues(_, u.getValue(!0)) : !1) === !1 && c();
        },
        h = new $_(p, f),
        w = Y.useRef();
      zl(
        () => (
          (w.current = h),
          wt(f, (_) => Pi(_, h)),
          () => {
            w.current &&
              (wt(w.current.deps, (_) => wo(_, w.current)),
              at.cancel(w.current.update));
          }
        )
      ),
        Y.useEffect(p, []),
        Kv(() => () => {
          const _ = w.current;
          wt(_.deps, (P) => wo(P, _));
        });
      const T = t.getComponentProps(u.getValue());
      return L(
        e,
        { ...T, ref: a },
        void 0,
        !1,
        { fileName: O_, lineNumber: 291, columnNumber: 12 },
        globalThis
      );
    });
  };
  class $_ {
    constructor(t, n) {
      (this.update = t), (this.deps = n);
    }
    eventObserved(t) {
      t.type == "change" && at.write(this.update);
    }
  }
  function F_(e, t) {
    const n = new Set();
    return (
      (Ya.dependencies = n),
      e.style && (e = Hl({}, e, { style: t.createAnimatedStyle(e.style) })),
      (e = new Xa(e)),
      (Ya.dependencies = null),
      [e, n]
    );
  }
  function I_(e, t) {
    return e && (de.fun(e) ? e(t) : (e.current = t)), t;
  }
  const eg = Symbol.for("AnimatedComponent"),
    B_ = (
      e,
      {
        applyAnimatedValues: t = () => !1,
        createAnimatedStyle: n = (i) => new Xa(i),
        getComponentProps: r = (i) => i,
      } = {}
    ) => {
      const i = {
          applyAnimatedValues: t,
          createAnimatedStyle: n,
          getComponentProps: r,
        },
        o = (a) => {
          const u = tg(a) || "Anonymous";
          return (
            de.str(a)
              ? (a = o[a] || (o[a] = Jv(a, i)))
              : (a = a[eg] || (a[eg] = Jv(a, i))),
            (a.displayName = `Animated(${u})`),
            a
          );
        };
      return (
        jn(e, (a, u) => {
          de.arr(e) && (u = tg(a)), (o[u] = o(a));
        }),
        { animated: o }
      );
    },
    tg = (e) =>
      de.str(e)
        ? e
        : e && de.str(e.displayName)
        ? e.displayName
        : (de.fun(e) && e.name) || null;
  var D_ =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@react-spring/core/dist/react-spring-core.esm.js";
  function Ht() {
    return (
      (Ht =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Ht.apply(this, arguments)
    );
  }
  function Jr(e, ...t) {
    return de.fun(e) ? e(...t) : e;
  }
  const _o = (e, t) =>
      e === !0 || !!(t && e && (de.fun(e) ? e(t) : fn(e).includes(t))),
    ng = (e, t) => (de.obj(e) ? t && e[t] : e),
    rg = (e, t) =>
      e.default === !0 ? e[t] : e.default ? e.default[t] : void 0,
    z_ = (e) => e,
    Wl = (e, t = z_) => {
      let n = L_;
      e.default && e.default !== !0 && ((e = e.default), (n = Object.keys(e)));
      const r = {};
      for (const i of n) {
        const o = t(e[i], i);
        de.und(o) || (r[i] = o);
      }
      return r;
    },
    L_ = [
      "config",
      "onProps",
      "onStart",
      "onChange",
      "onPause",
      "onResume",
      "onRest",
    ],
    G_ = {
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
      parentId: 1,
    };
  function j_(e) {
    const t = {};
    let n = 0;
    if (
      (jn(e, (r, i) => {
        G_[i] || ((t[i] = r), n++);
      }),
      n)
    )
      return t;
  }
  function ig(e) {
    const t = j_(e);
    if (t) {
      const n = { to: t };
      return jn(e, (r, i) => i in t || (n[i] = r)), n;
    }
    return Ht({}, e);
  }
  function So(e) {
    return (
      (e = rn(e)),
      de.arr(e)
        ? e.map(So)
        : Ua(e)
        ? Hn.createStringInterpolator({ range: [0, 1], output: [e, e] })(1)
        : e
    );
  }
  function H_(e) {
    for (const t in e) return !0;
    return !1;
  }
  function Vl(e) {
    return de.fun(e) || (de.arr(e) && de.obj(e[0]));
  }
  function W_(e, t) {
    var n;
    (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
  }
  function V_(e, t) {
    if (t && e.ref !== t) {
      var n;
      (n = e.ref) == null || n.delete(e), t.add(e), (e.ref = t);
    }
  }
  const U_ = {
      default: { tension: 170, friction: 26 },
      gentle: { tension: 120, friction: 14 },
      wobbly: { tension: 180, friction: 12 },
      stiff: { tension: 210, friction: 20 },
      slow: { tension: 280, friction: 60 },
      molasses: { tension: 280, friction: 120 },
    },
    Ka = 1.70158,
    Qa = Ka * 1.525,
    og = Ka + 1,
    ag = (2 * Math.PI) / 3,
    ug = (2 * Math.PI) / 4.5,
    Za = (e) =>
      e < 1 / 2.75
        ? 7.5625 * e * e
        : e < 2 / 2.75
        ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
        : e < 2.5 / 2.75
        ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
        : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375,
    q_ = {
      linear: (e) => e,
      easeInQuad: (e) => e * e,
      easeOutQuad: (e) => 1 - (1 - e) * (1 - e),
      easeInOutQuad: (e) =>
        e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2,
      easeInCubic: (e) => e * e * e,
      easeOutCubic: (e) => 1 - Math.pow(1 - e, 3),
      easeInOutCubic: (e) =>
        e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2,
      easeInQuart: (e) => e * e * e * e,
      easeOutQuart: (e) => 1 - Math.pow(1 - e, 4),
      easeInOutQuart: (e) =>
        e < 0.5 ? 8 * e * e * e * e : 1 - Math.pow(-2 * e + 2, 4) / 2,
      easeInQuint: (e) => e * e * e * e * e,
      easeOutQuint: (e) => 1 - Math.pow(1 - e, 5),
      easeInOutQuint: (e) =>
        e < 0.5 ? 16 * e * e * e * e * e : 1 - Math.pow(-2 * e + 2, 5) / 2,
      easeInSine: (e) => 1 - Math.cos((e * Math.PI) / 2),
      easeOutSine: (e) => Math.sin((e * Math.PI) / 2),
      easeInOutSine: (e) => -(Math.cos(Math.PI * e) - 1) / 2,
      easeInExpo: (e) => (e === 0 ? 0 : Math.pow(2, 10 * e - 10)),
      easeOutExpo: (e) => (e === 1 ? 1 : 1 - Math.pow(2, -10 * e)),
      easeInOutExpo: (e) =>
        e === 0
          ? 0
          : e === 1
          ? 1
          : e < 0.5
          ? Math.pow(2, 20 * e - 10) / 2
          : (2 - Math.pow(2, -20 * e + 10)) / 2,
      easeInCirc: (e) => 1 - Math.sqrt(1 - Math.pow(e, 2)),
      easeOutCirc: (e) => Math.sqrt(1 - Math.pow(e - 1, 2)),
      easeInOutCirc: (e) =>
        e < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * e, 2))) / 2
          : (Math.sqrt(1 - Math.pow(-2 * e + 2, 2)) + 1) / 2,
      easeInBack: (e) => og * e * e * e - Ka * e * e,
      easeOutBack: (e) => 1 + og * Math.pow(e - 1, 3) + Ka * Math.pow(e - 1, 2),
      easeInOutBack: (e) =>
        e < 0.5
          ? (Math.pow(2 * e, 2) * ((Qa + 1) * 2 * e - Qa)) / 2
          : (Math.pow(2 * e - 2, 2) * ((Qa + 1) * (e * 2 - 2) + Qa) + 2) / 2,
      easeInElastic: (e) =>
        e === 0
          ? 0
          : e === 1
          ? 1
          : -Math.pow(2, 10 * e - 10) * Math.sin((e * 10 - 10.75) * ag),
      easeOutElastic: (e) =>
        e === 0
          ? 0
          : e === 1
          ? 1
          : Math.pow(2, -10 * e) * Math.sin((e * 10 - 0.75) * ag) + 1,
      easeInOutElastic: (e) =>
        e === 0
          ? 0
          : e === 1
          ? 1
          : e < 0.5
          ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * ug)) / 2
          : (Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * ug)) / 2 +
            1,
      easeInBounce: (e) => 1 - Za(1 - e),
      easeOutBounce: Za,
      easeInOutBounce: (e) =>
        e < 0.5 ? (1 - Za(1 - 2 * e)) / 2 : (1 + Za(2 * e - 1)) / 2,
    },
    Ul = Ht({}, U_.default, {
      mass: 1,
      damping: 1,
      easing: q_.linear,
      clamp: !1,
    });
  class Y_ {
    constructor() {
      (this.tension = void 0),
        (this.friction = void 0),
        (this.frequency = void 0),
        (this.damping = void 0),
        (this.mass = void 0),
        (this.velocity = 0),
        (this.restVelocity = void 0),
        (this.precision = void 0),
        (this.progress = void 0),
        (this.duration = void 0),
        (this.easing = void 0),
        (this.clamp = void 0),
        (this.bounce = void 0),
        (this.decay = void 0),
        (this.round = void 0),
        Object.assign(this, Ul);
    }
  }
  function X_(e, t, n) {
    n && ((n = Ht({}, n)), sg(n, t), (t = Ht({}, n, t))),
      sg(e, t),
      Object.assign(e, t);
    for (const a in Ul) e[a] == null && (e[a] = Ul[a]);
    let { mass: r, frequency: i, damping: o } = e;
    return (
      de.und(i) ||
        (i < 0.01 && (i = 0.01),
        o < 0 && (o = 0),
        (e.tension = Math.pow((2 * Math.PI) / i, 2) * r),
        (e.friction = (4 * Math.PI * o * r) / i)),
      e
    );
  }
  function sg(e, t) {
    if (!de.und(t.decay)) e.duration = void 0;
    else {
      const n = !de.und(t.tension) || !de.und(t.friction);
      (n || !de.und(t.frequency) || !de.und(t.damping) || !de.und(t.mass)) &&
        ((e.duration = void 0), (e.decay = void 0)),
        n && (e.frequency = void 0);
    }
  }
  const lg = [];
  class K_ {
    constructor() {
      (this.changed = !1),
        (this.values = lg),
        (this.toValues = null),
        (this.fromValues = lg),
        (this.to = void 0),
        (this.from = void 0),
        (this.config = new Y_()),
        (this.immediate = !1);
    }
  }
  function cg(e, { key: t, props: n, defaultProps: r, state: i, actions: o }) {
    return new Promise((a, u) => {
      var f;
      let c,
        p,
        h = _o((f = n.cancel) != null ? f : r == null ? void 0 : r.cancel, t);
      if (h) _();
      else {
        de.und(n.pause) || (i.paused = _o(n.pause, t));
        let P = r == null ? void 0 : r.pause;
        P !== !0 && (P = i.paused || _o(P, t)),
          (c = Jr(n.delay || 0, t)),
          P ? (i.resumeQueue.add(T), o.pause()) : (o.resume(), T());
      }
      function w() {
        i.resumeQueue.add(T),
          i.timeouts.delete(p),
          p.cancel(),
          (c = p.time - at.now());
      }
      function T() {
        c > 0 && !Hn.skipAnimation
          ? ((i.delayed = !0),
            (p = at.setTimeout(_, c)),
            i.pauseQueue.add(w),
            i.timeouts.add(p))
          : _();
      }
      function _() {
        i.delayed && (i.delayed = !1),
          i.pauseQueue.delete(w),
          i.timeouts.delete(p),
          e <= (i.cancelId || 0) && (h = !0);
        try {
          o.start(Ht({}, n, { callId: e, cancel: h }), a);
        } catch (P) {
          u(P);
        }
      }
    });
  }
  const ql = (e, t) =>
      t.length == 1
        ? t[0]
        : t.some((n) => n.cancelled)
        ? Mi(e.get())
        : t.every((n) => n.noop)
        ? fg(e.get())
        : On(
            e.get(),
            t.every((n) => n.finished)
          ),
    fg = (e) => ({ value: e, noop: !0, finished: !0, cancelled: !1 }),
    On = (e, t, n = !1) => ({ value: e, finished: t, cancelled: n }),
    Mi = (e) => ({ value: e, cancelled: !0, finished: !1 });
  function dg(e, t, n, r) {
    const { callId: i, parentId: o, onRest: a } = t,
      { asyncTo: u, promise: f } = n;
    return !o && e === u && !t.reset
      ? f
      : (n.promise = (async () => {
          (n.asyncId = i), (n.asyncTo = e);
          const c = Wl(t, (I, k) => (k === "onRest" ? void 0 : I));
          let p, h;
          const w = new Promise((I, k) => ((p = I), (h = k))),
            T = (I) => {
              const k =
                (i <= (n.cancelId || 0) && Mi(r)) ||
                (i !== n.asyncId && On(r, !1));
              if (k) throw ((I.result = k), h(I), I);
            },
            _ = (I, k) => {
              const F = new hg(),
                N = new pg();
              return (async () => {
                if (Hn.skipAnimation)
                  throw (Ro(n), (N.result = On(r, !1)), h(N), N);
                T(F);
                const G = de.obj(I) ? Ht({}, I) : Ht({}, k, { to: I });
                (G.parentId = i),
                  jn(c, (D, ne) => {
                    de.und(G[ne]) && (G[ne] = D);
                  });
                const M = await r.start(G);
                return (
                  T(F),
                  n.paused &&
                    (await new Promise((D) => {
                      n.resumeQueue.add(D);
                    })),
                  M
                );
              })();
            };
          let P;
          if (Hn.skipAnimation) return Ro(n), On(r, !1);
          try {
            let I;
            de.arr(e)
              ? (I = (async (k) => {
                  for (const F of k) await _(F);
                })(e))
              : (I = Promise.resolve(e(_, r.stop.bind(r)))),
              await Promise.all([I.then(p), w]),
              (P = On(r.get(), !0, !1));
          } catch (I) {
            if (I instanceof hg) P = I.result;
            else if (I instanceof pg) P = I.result;
            else throw I;
          } finally {
            i == n.asyncId &&
              ((n.asyncId = o),
              (n.asyncTo = o ? u : void 0),
              (n.promise = o ? f : void 0));
          }
          return (
            de.fun(a) &&
              at.batchedUpdates(() => {
                a(P, r, r.item);
              }),
            P
          );
        })());
  }
  function Ro(e, t) {
    vo(e.timeouts, (n) => n.cancel()),
      e.pauseQueue.clear(),
      e.resumeQueue.clear(),
      (e.asyncId = e.asyncTo = e.promise = void 0),
      t && (e.cancelId = t);
  }
  class hg extends Error {
    constructor() {
      super(
        "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
      ),
        (this.result = void 0);
    }
  }
  class pg extends Error {
    constructor() {
      super("SkipAnimationSignal"), (this.result = void 0);
    }
  }
  const Yl = (e) => e instanceof Xl;
  let Q_ = 1;
  class Xl extends Hv {
    constructor(...t) {
      super(...t), (this.id = Q_++), (this.key = void 0), (this._priority = 0);
    }
    get priority() {
      return this._priority;
    }
    set priority(t) {
      this._priority != t && ((this._priority = t), this._onPriorityChange(t));
    }
    get() {
      const t = Wn(this);
      return t && t.getValue();
    }
    to(...t) {
      return Hn.to(this, t);
    }
    interpolate(...t) {
      return R_(), Hn.to(this, t);
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
    _attach() {}
    _detach() {}
    _onChange(t, n = !1) {
      bo(this, { type: "change", parent: this, value: t, idle: n });
    }
    _onPriorityChange(t) {
      this.idle || La.sort(this),
        bo(this, { type: "priority", parent: this, priority: t });
    }
  }
  const ei = Symbol.for("SpringPhase"),
    vg = 1,
    Kl = 2,
    Ql = 4,
    Zl = (e) => (e[ei] & vg) > 0,
    Sr = (e) => (e[ei] & Kl) > 0,
    Co = (e) => (e[ei] & Ql) > 0,
    gg = (e, t) => (t ? (e[ei] |= Kl | vg) : (e[ei] &= ~Kl)),
    mg = (e, t) => (t ? (e[ei] |= Ql) : (e[ei] &= ~Ql));
  class Z_ extends Xl {
    constructor(t, n) {
      if (
        (super(),
        (this.key = void 0),
        (this.animation = new K_()),
        (this.queue = void 0),
        (this.defaultProps = {}),
        (this._state = {
          paused: !1,
          delayed: !1,
          pauseQueue: new Set(),
          resumeQueue: new Set(),
          timeouts: new Set(),
        }),
        (this._pendingCalls = new Set()),
        (this._lastCallId = 0),
        (this._lastToId = 0),
        (this._memoizedDuration = 0),
        !de.und(t) || !de.und(n))
      ) {
        const r = de.obj(t) ? Ht({}, t) : Ht({}, n, { from: t });
        de.und(r.default) && (r.default = !0), this.start(r);
      }
    }
    get idle() {
      return !(Sr(this) || this._state.asyncTo) || Co(this);
    }
    get goal() {
      return rn(this.animation.to);
    }
    get velocity() {
      const t = Wn(this);
      return t instanceof Ni
        ? t.lastVelocity || 0
        : t.getPayload().map((n) => n.lastVelocity || 0);
    }
    get hasAnimated() {
      return Zl(this);
    }
    get isAnimating() {
      return Sr(this);
    }
    get isPaused() {
      return Co(this);
    }
    get isDelayed() {
      return this._state.delayed;
    }
    advance(t) {
      let n = !0,
        r = !1;
      const i = this.animation;
      let { config: o, toValues: a } = i;
      const u = qa(i.to);
      !u && bn(i.to) && (a = fn(rn(i.to))),
        i.values.forEach((p, h) => {
          if (p.done) return;
          const w = p.constructor == Ei ? 1 : u ? u[h].lastPosition : a[h];
          let T = i.immediate,
            _ = w;
          if (!T) {
            if (((_ = p.lastPosition), o.tension <= 0)) {
              p.done = !0;
              return;
            }
            let P = (p.elapsedTime += t);
            const I = i.fromValues[h],
              k =
                p.v0 != null
                  ? p.v0
                  : (p.v0 = de.arr(o.velocity) ? o.velocity[h] : o.velocity);
            let F;
            if (de.und(o.duration))
              if (o.decay) {
                const N = o.decay === !0 ? 0.998 : o.decay,
                  G = Math.exp(-(1 - N) * P);
                (_ = I + (k / (1 - N)) * (1 - G)),
                  (T = Math.abs(p.lastPosition - _) < 0.1),
                  (F = k * G);
              } else {
                F = p.lastVelocity == null ? k : p.lastVelocity;
                const N =
                    o.precision ||
                    (I == w ? 0.005 : Math.min(1, Math.abs(w - I) * 0.001)),
                  G = o.restVelocity || N / 10,
                  M = o.clamp ? 0 : o.bounce,
                  D = !de.und(M),
                  ne = I == w ? p.v0 > 0 : I < w;
                let Z,
                  he = !1;
                const me = 1,
                  ie = Math.ceil(t / me);
                for (
                  let te = 0;
                  te < ie &&
                  ((Z = Math.abs(F) > G),
                  !(!Z && ((T = Math.abs(w - _) <= N), T)));
                  ++te
                ) {
                  D &&
                    ((he = _ == w || _ > w == ne),
                    he && ((F = -F * M), (_ = w)));
                  const we = -o.tension * 1e-6 * (_ - w),
                    ke = -o.friction * 0.001 * F,
                    st = (we + ke) / o.mass;
                  (F = F + st * me), (_ = _ + F * me);
                }
              }
            else {
              let N = 1;
              o.duration > 0 &&
                (this._memoizedDuration !== o.duration &&
                  ((this._memoizedDuration = o.duration),
                  p.durationProgress > 0 &&
                    ((p.elapsedTime = o.duration * p.durationProgress),
                    (P = p.elapsedTime += t))),
                (N = (o.progress || 0) + P / this._memoizedDuration),
                (N = N > 1 ? 1 : N < 0 ? 0 : N),
                (p.durationProgress = N)),
                (_ = I + o.easing(N) * (w - I)),
                (F = (_ - p.lastPosition) / t),
                (T = N == 1);
            }
            (p.lastVelocity = F),
              Number.isNaN(_) &&
                (console.warn("Got NaN while animating:", this), (T = !0));
          }
          u && !u[h].done && (T = !1),
            T ? (p.done = !0) : (n = !1),
            p.setValue(_, o.round) && (r = !0);
        });
      const f = Wn(this),
        c = f.getValue();
      if (n) {
        const p = rn(i.to);
        (c !== p || r) && !o.decay
          ? (f.setValue(p), this._onChange(p))
          : r && o.decay && this._onChange(c),
          this._stop();
      } else r && this._onChange(c);
    }
    set(t) {
      return (
        at.batchedUpdates(() => {
          this._stop(), this._focus(t), this._set(t);
        }),
        this
      );
    }
    pause() {
      this._update({ pause: !0 });
    }
    resume() {
      this._update({ pause: !1 });
    }
    finish() {
      if (Sr(this)) {
        const { to: t, config: n } = this.animation;
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
      return (
        de.und(t)
          ? ((r = this.queue || []), (this.queue = []))
          : (r = [de.obj(t) ? t : Ht({}, n, { to: t })]),
        Promise.all(r.map((i) => this._update(i))).then((i) => ql(this, i))
      );
    }
    stop(t) {
      const { to: n } = this.animation;
      return (
        this._focus(this.get()),
        Ro(this._state, t && this._lastCallId),
        at.batchedUpdates(() => this._stop(n, t)),
        this
      );
    }
    reset() {
      this._update({ reset: !0 });
    }
    eventObserved(t) {
      t.type == "change"
        ? this._start()
        : t.type == "priority" && (this.priority = t.priority + 1);
    }
    _prepareNode(t) {
      const n = this.key || "";
      let { to: r, from: i } = t;
      (r = de.obj(r) ? r[n] : r),
        (r == null || Vl(r)) && (r = void 0),
        (i = de.obj(i) ? i[n] : i),
        i == null && (i = void 0);
      const o = { to: r, from: i };
      return (
        Zl(this) ||
          (t.reverse && ([r, i] = [i, r]),
          (i = rn(i)),
          de.und(i) ? Wn(this) || this._set(r) : this._set(i)),
        o
      );
    }
    _update(t, n) {
      let r = Ht({}, t);
      const { key: i, defaultProps: o } = this;
      r.default &&
        Object.assign(
          o,
          Wl(r, (f, c) => (/^on/.test(c) ? ng(f, i) : f))
        ),
        wg(this, r, "onProps"),
        No(this, "onProps", r, this);
      const a = this._prepareNode(r);
      if (Object.isFrozen(this))
        throw Error(
          "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
        );
      const u = this._state;
      return cg(++this._lastCallId, {
        key: i,
        props: r,
        defaultProps: o,
        state: u,
        actions: {
          pause: () => {
            Co(this) ||
              (mg(this, !0),
              go(u.pauseQueue),
              No(this, "onPause", On(this, To(this, this.animation.to)), this));
          },
          resume: () => {
            Co(this) &&
              (mg(this, !1),
              Sr(this) && this._resume(),
              go(u.resumeQueue),
              No(
                this,
                "onResume",
                On(this, To(this, this.animation.to)),
                this
              ));
          },
          start: this._merge.bind(this, a),
        },
      }).then((f) => {
        if (r.loop && f.finished && !(n && f.noop)) {
          const c = yg(r);
          if (c) return this._update(c, !0);
        }
        return f;
      });
    }
    _merge(t, n, r) {
      if (n.cancel) return this.stop(!0), r(Mi(this));
      const i = !de.und(t.to),
        o = !de.und(t.from);
      if (i || o)
        if (n.callId > this._lastToId) this._lastToId = n.callId;
        else return r(Mi(this));
      const { key: a, defaultProps: u, animation: f } = this,
        { to: c, from: p } = f;
      let { to: h = c, from: w = p } = t;
      o && !i && (!n.default || de.und(h)) && (h = w),
        n.reverse && ([h, w] = [w, h]);
      const T = !ar(w, p);
      T && (f.from = w), (w = rn(w));
      const _ = !ar(h, c);
      _ && this._focus(h);
      const P = Vl(n.to),
        { config: I } = f,
        { decay: k, velocity: F } = I;
      (i || o) && (I.velocity = 0),
        n.config &&
          !P &&
          X_(
            I,
            Jr(n.config, a),
            n.config !== u.config ? Jr(u.config, a) : void 0
          );
      let N = Wn(this);
      if (!N || de.und(h)) return r(On(this, !0));
      const G = de.und(n.reset)
          ? o && !n.default
          : !de.und(w) && _o(n.reset, a),
        M = G ? w : this.get(),
        D = So(h),
        ne = de.num(D) || de.arr(D) || Ua(D),
        Z = !P && (!ne || _o(u.immediate || n.immediate, a));
      if (_) {
        const te = jl(h);
        if (te !== N.constructor)
          if (Z) N = this._set(D);
          else
            throw Error(
              `Cannot animate between ${N.constructor.name} and ${te.name}, as the "to" prop suggests`
            );
      }
      const he = N.constructor;
      let me = bn(h),
        ie = !1;
      if (!me) {
        const te = G || (!Zl(this) && T);
        (_ || te) && ((ie = ar(So(M), D)), (me = !ie)),
          ((!ar(f.immediate, Z) && !Z) ||
            !ar(I.decay, k) ||
            !ar(I.velocity, F)) &&
            (me = !0);
      }
      if (
        (ie && Sr(this) && (f.changed && !G ? (me = !0) : me || this._stop(c)),
        !P &&
          ((me || bn(c)) &&
            ((f.values = N.getPayload()),
            (f.toValues = bn(h) ? null : he == Ei ? [1] : fn(D))),
          f.immediate != Z && ((f.immediate = Z), !Z && !G && this._set(c)),
          me))
      ) {
        const { onRest: te } = f;
        wt(eS, (ke) => wg(this, n, ke));
        const we = On(this, To(this, c));
        go(this._pendingCalls, we),
          this._pendingCalls.add(r),
          f.changed &&
            at.batchedUpdates(() => {
              (f.changed = !G),
                te == null || te(we, this),
                G ? Jr(u.onRest, we) : f.onStart == null || f.onStart(we, this);
            });
      }
      G && this._set(M),
        P
          ? r(dg(n.to, n, this._state, this))
          : me
          ? this._start()
          : Sr(this) && !_
          ? this._pendingCalls.add(r)
          : r(fg(M));
    }
    _focus(t) {
      const n = this.animation;
      t !== n.to &&
        (jv(this) && this._detach(), (n.to = t), jv(this) && this._attach());
    }
    _attach() {
      let t = 0;
      const { to: n } = this.animation;
      bn(n) && (Pi(n, this), Yl(n) && (t = n.priority + 1)),
        (this.priority = t);
    }
    _detach() {
      const { to: t } = this.animation;
      bn(t) && wo(t, this);
    }
    _set(t, n = !0) {
      const r = rn(t);
      if (!de.und(r)) {
        const i = Wn(this);
        if (!i || !ar(r, i.getValue())) {
          const o = jl(r);
          !i || i.constructor != o ? Ll(this, o.create(r)) : i.setValue(r),
            i &&
              at.batchedUpdates(() => {
                this._onChange(r, n);
              });
        }
      }
      return Wn(this);
    }
    _onStart() {
      const t = this.animation;
      t.changed ||
        ((t.changed = !0), No(this, "onStart", On(this, To(this, t.to)), this));
    }
    _onChange(t, n) {
      n || (this._onStart(), Jr(this.animation.onChange, t, this)),
        Jr(this.defaultProps.onChange, t, this),
        super._onChange(t, n);
    }
    _start() {
      const t = this.animation;
      Wn(this).reset(rn(t.to)),
        t.immediate || (t.fromValues = t.values.map((n) => n.lastPosition)),
        Sr(this) || (gg(this, !0), Co(this) || this._resume());
    }
    _resume() {
      Hn.skipAnimation ? this.finish() : La.start(this);
    }
    _stop(t, n) {
      if (Sr(this)) {
        gg(this, !1);
        const r = this.animation;
        wt(r.values, (o) => {
          o.done = !0;
        }),
          r.toValues && (r.onChange = r.onPause = r.onResume = void 0),
          bo(this, { type: "idle", parent: this });
        const i = n
          ? Mi(this.get())
          : On(this.get(), To(this, t != null ? t : r.to));
        go(this._pendingCalls, i),
          r.changed && ((r.changed = !1), No(this, "onRest", i, this));
      }
    }
  }
  function To(e, t) {
    const n = So(t),
      r = So(e.get());
    return ar(r, n);
  }
  function yg(e, t = e.loop, n = e.to) {
    let r = Jr(t);
    if (r) {
      const i = r !== !0 && ig(r),
        o = (i || e).reverse,
        a = !i || i.reset;
      return Po(
        Ht(
          {},
          e,
          {
            loop: t,
            default: !1,
            pause: void 0,
            to: !o || Vl(n) ? n : void 0,
            from: a ? e.from : void 0,
            reset: a,
          },
          i
        )
      );
    }
  }
  function Po(e) {
    const { to: t, from: n } = (e = ig(e)),
      r = new Set();
    return (
      de.obj(t) && bg(t, r),
      de.obj(n) && bg(n, r),
      (e.keys = r.size ? Array.from(r) : null),
      e
    );
  }
  function J_(e) {
    const t = Po(e);
    return de.und(t.default) && (t.default = Wl(t)), t;
  }
  function bg(e, t) {
    jn(e, (n, r) => n != null && t.add(r));
  }
  const eS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
  function wg(e, t, n) {
    e.animation[n] = t[n] !== rg(t, n) ? ng(t[n], e.key) : void 0;
  }
  function No(e, t, ...n) {
    var r, i, o, a;
    (r = (i = e.animation)[t]) == null || r.call(i, ...n),
      (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
  }
  const tS = ["onStart", "onChange", "onRest"];
  let nS = 1;
  class rS {
    constructor(t, n) {
      (this.id = nS++),
        (this.springs = {}),
        (this.queue = []),
        (this.ref = void 0),
        (this._flush = void 0),
        (this._initialProps = void 0),
        (this._lastAsyncId = 0),
        (this._active = new Set()),
        (this._changed = new Set()),
        (this._started = !1),
        (this._item = void 0),
        (this._state = {
          paused: !1,
          pauseQueue: new Set(),
          resumeQueue: new Set(),
          timeouts: new Set(),
        }),
        (this._events = {
          onStart: new Map(),
          onChange: new Map(),
          onRest: new Map(),
        }),
        (this._onFrame = this._onFrame.bind(this)),
        n && (this._flush = n),
        t && this.start(Ht({ default: !0 }, t));
    }
    get idle() {
      return (
        !this._state.asyncTo &&
        Object.values(this.springs).every(
          (t) => t.idle && !t.isDelayed && !t.isPaused
        )
      );
    }
    get item() {
      return this._item;
    }
    set item(t) {
      this._item = t;
    }
    get() {
      const t = {};
      return this.each((n, r) => (t[r] = n.get())), t;
    }
    set(t) {
      for (const n in t) {
        const r = t[n];
        de.und(r) || this.springs[n].set(r);
      }
    }
    update(t) {
      return t && this.queue.push(Po(t)), this;
    }
    start(t) {
      let { queue: n } = this;
      return (
        t ? (n = fn(t).map(Po)) : (this.queue = []),
        this._flush ? this._flush(this, n) : (Tg(this, n), Jl(this, n))
      );
    }
    stop(t, n) {
      if ((t !== !!t && (n = t), n)) {
        const r = this.springs;
        wt(fn(n), (i) => r[i].stop(!!t));
      } else Ro(this._state, this._lastAsyncId), this.each((r) => r.stop(!!t));
      return this;
    }
    pause(t) {
      if (de.und(t)) this.start({ pause: !0 });
      else {
        const n = this.springs;
        wt(fn(t), (r) => n[r].pause());
      }
      return this;
    }
    resume(t) {
      if (de.und(t)) this.start({ pause: !1 });
      else {
        const n = this.springs;
        wt(fn(t), (r) => n[r].resume());
      }
      return this;
    }
    each(t) {
      jn(this.springs, t);
    }
    _onFrame() {
      const { onStart: t, onChange: n, onRest: r } = this._events,
        i = this._active.size > 0,
        o = this._changed.size > 0;
      ((i && !this._started) || (o && !this._started)) &&
        ((this._started = !0),
        vo(t, ([f, c]) => {
          (c.value = this.get()), f(c, this, this._item);
        }));
      const a = !i && this._started,
        u = o || (a && r.size) ? this.get() : null;
      o &&
        n.size &&
        vo(n, ([f, c]) => {
          (c.value = u), f(c, this, this._item);
        }),
        a &&
          ((this._started = !1),
          vo(r, ([f, c]) => {
            (c.value = u), f(c, this, this._item);
          }));
    }
    eventObserved(t) {
      if (t.type == "change")
        this._changed.add(t.parent), t.idle || this._active.add(t.parent);
      else if (t.type == "idle") this._active.delete(t.parent);
      else return;
      at.onFrame(this._onFrame);
    }
  }
  function Jl(e, t) {
    return Promise.all(t.map((n) => xg(e, n))).then((n) => ql(e, n));
  }
  async function xg(e, t, n) {
    const { keys: r, to: i, from: o, loop: a, onRest: u, onResolve: f } = t,
      c = de.obj(t.default) && t.default;
    a && (t.loop = !1), i === !1 && (t.to = null), o === !1 && (t.from = null);
    const p = de.arr(i) || de.fun(i) ? i : void 0;
    p
      ? ((t.to = void 0), (t.onRest = void 0), c && (c.onRest = void 0))
      : wt(tS, (P) => {
          const I = t[P];
          if (de.fun(I)) {
            const k = e._events[P];
            (t[P] = ({ finished: F, cancelled: N }) => {
              const G = k.get(I);
              G
                ? (F || (G.finished = !1), N && (G.cancelled = !0))
                : k.set(I, {
                    value: null,
                    finished: F || !1,
                    cancelled: N || !1,
                  });
            }),
              c && (c[P] = t[P]);
          }
        });
    const h = e._state;
    t.pause === !h.paused
      ? ((h.paused = t.pause), go(t.pause ? h.pauseQueue : h.resumeQueue))
      : h.paused && (t.pause = !0);
    const w = (r || Object.keys(e.springs)).map((P) => e.springs[P].start(t)),
      T = t.cancel === !0 || rg(t, "cancel") === !0;
    (p || (T && h.asyncId)) &&
      w.push(
        cg(++e._lastAsyncId, {
          props: t,
          state: h,
          actions: {
            pause: El,
            resume: El,
            start(P, I) {
              T
                ? (Ro(h, e._lastAsyncId), I(Mi(e)))
                : ((P.onRest = u), I(dg(p, P, h, e)));
            },
          },
        })
      ),
      h.paused &&
        (await new Promise((P) => {
          h.resumeQueue.add(P);
        }));
    const _ = ql(e, await Promise.all(w));
    if (a && _.finished && !(n && _.noop)) {
      const P = yg(t, a, i);
      if (P) return Tg(e, [P]), xg(e, P, !0);
    }
    return f && at.batchedUpdates(() => f(_, e, e.item)), _;
  }
  function _g(e, t) {
    const n = Ht({}, e.springs);
    return (
      t &&
        wt(fn(t), (r) => {
          de.und(r.keys) && (r = Po(r)),
            de.obj(r.to) || (r = Ht({}, r, { to: void 0 })),
            Cg(n, r, (i) => Rg(i));
        }),
      Sg(e, n),
      n
    );
  }
  function Sg(e, t) {
    jn(t, (n, r) => {
      e.springs[r] || ((e.springs[r] = n), Pi(n, e));
    });
  }
  function Rg(e, t) {
    const n = new Z_();
    return (n.key = e), t && Pi(n, t), n;
  }
  function Cg(e, t, n) {
    t.keys &&
      wt(t.keys, (r) => {
        (e[r] || (e[r] = n(r)))._prepareNode(t);
      });
  }
  function Tg(e, t) {
    wt(t, (n) => {
      Cg(e.springs, n, (r) => Rg(r, e));
    });
  }
  function iS(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  const oS = ["children"],
    Ja = (e) => {
      let { children: t } = e,
        n = iS(e, oS);
      const r = Y.useContext(eu),
        i = n.pause || !!r.pause,
        o = n.immediate || !!r.immediate;
      n = N_(() => ({ pause: i, immediate: o }), [i, o]);
      const { Provider: a } = eu;
      return L(
        a,
        { value: n, children: t },
        void 0,
        !1,
        { fileName: D_, lineNumber: 1849, columnNumber: 10 },
        globalThis
      );
    },
    eu = aS(Ja, {});
  (Ja.Provider = eu.Provider), (Ja.Consumer = eu.Consumer);
  function aS(e, t) {
    return (
      Object.assign(e, Pn.createContext(t)),
      (e.Provider._context = e),
      (e.Consumer._context = e),
      e
    );
  }
  const uS = () => {
    const e = [],
      t = function (i) {
        T_();
        const o = [];
        return (
          wt(e, (a, u) => {
            if (de.und(i)) o.push(a.start());
            else {
              const f = n(i, a, u);
              f && o.push(a.start(f));
            }
          }),
          o
        );
      };
    (t.current = e),
      (t.add = function (r) {
        e.includes(r) || e.push(r);
      }),
      (t.delete = function (r) {
        const i = e.indexOf(r);
        ~i && e.splice(i, 1);
      }),
      (t.pause = function () {
        return wt(e, (r) => r.pause(...arguments)), this;
      }),
      (t.resume = function () {
        return wt(e, (r) => r.resume(...arguments)), this;
      }),
      (t.set = function (r) {
        wt(e, (i) => i.set(r));
      }),
      (t.start = function (r) {
        const i = [];
        return (
          wt(e, (o, a) => {
            if (de.und(r)) i.push(o.start());
            else {
              const u = this._getProps(r, o, a);
              u && i.push(o.start(u));
            }
          }),
          i
        );
      }),
      (t.stop = function () {
        return wt(e, (r) => r.stop(...arguments)), this;
      }),
      (t.update = function (r) {
        return wt(e, (i, o) => i.update(this._getProps(r, i, o))), this;
      });
    const n = function (i, o, a) {
      return de.fun(i) ? i(a, o) : i;
    };
    return (t._getProps = n), t;
  };
  function sS(e, t, n) {
    const r = de.fun(t) && t;
    r && !n && (n = []);
    const i = Y.useMemo(() => (r || arguments.length == 3 ? uS() : void 0), []),
      o = Y.useRef(0),
      a = Xv(),
      u = Y.useMemo(
        () => ({
          ctrls: [],
          queue: [],
          flush(k, F) {
            const N = _g(k, F);
            return o.current > 0 &&
              !u.queue.length &&
              !Object.keys(N).some((M) => !k.springs[M])
              ? Jl(k, F)
              : new Promise((M) => {
                  Sg(k, N),
                    u.queue.push(() => {
                      M(Jl(k, F));
                    }),
                    a();
                });
          },
        }),
        []
      ),
      f = Y.useRef([...u.ctrls]),
      c = [],
      p = Qv(e) || 0;
    Y.useMemo(() => {
      wt(f.current.slice(e, p), (k) => {
        W_(k, i), k.stop(!0);
      }),
        (f.current.length = e),
        h(p, e);
    }, [e]),
      Y.useMemo(() => {
        h(0, Math.min(p, e));
      }, n);
    function h(k, F) {
      for (let N = k; N < F; N++) {
        const G = f.current[N] || (f.current[N] = new rS(null, u.flush)),
          M = r ? r(N, G) : t[N];
        M && (c[N] = J_(M));
      }
    }
    const w = f.current.map((k, F) => _g(k, c[F])),
      T = Y.useContext(Ja),
      _ = Qv(T),
      P = T !== _ && H_(T);
    zl(() => {
      o.current++, (u.ctrls = f.current);
      const { queue: k } = u;
      k.length && ((u.queue = []), wt(k, (F) => F())),
        wt(f.current, (F, N) => {
          i == null || i.add(F), P && F.start({ default: T });
          const G = c[N];
          G && (V_(F, G.ref), F.ref ? F.queue.push(G) : F.start(G));
        });
    }),
      Kv(() => () => {
        wt(u.ctrls, (k) => k.stop(!0));
      });
    const I = w.map((k) => Ht({}, k));
    return i ? [I, i] : I;
  }
  function Pg(e, t) {
    const n = de.fun(e),
      [[r], i] = sS(1, n ? e : [e], n ? t || [] : t);
    return n || arguments.length == 2 ? [r, i] : r;
  }
  let Ng;
  (function (e) {
    (e.MOUNT = "mount"),
      (e.ENTER = "enter"),
      (e.UPDATE = "update"),
      (e.LEAVE = "leave");
  })(Ng || (Ng = {}));
  class lS extends Xl {
    constructor(t, n) {
      super(),
        (this.key = void 0),
        (this.idle = !0),
        (this.calc = void 0),
        (this._active = new Set()),
        (this.source = t),
        (this.calc = yo(...n));
      const r = this._get(),
        i = jl(r);
      Ll(this, i.create(r));
    }
    advance(t) {
      const n = this._get(),
        r = this.get();
      ar(n, r) || (Wn(this).setValue(n), this._onChange(n, this.idle)),
        !this.idle && Eg(this._active) && ec(this);
    }
    _get() {
      const t = de.arr(this.source) ? this.source.map(rn) : fn(rn(this.source));
      return this.calc(...t);
    }
    _start() {
      this.idle &&
        !Eg(this._active) &&
        ((this.idle = !1),
        wt(qa(this), (t) => {
          t.done = !1;
        }),
        Hn.skipAnimation
          ? (at.batchedUpdates(() => this.advance()), ec(this))
          : La.start(this));
    }
    _attach() {
      let t = 1;
      wt(fn(this.source), (n) => {
        bn(n) && Pi(n, this),
          Yl(n) &&
            (n.idle || this._active.add(n), (t = Math.max(t, n.priority + 1)));
      }),
        (this.priority = t),
        this._start();
    }
    _detach() {
      wt(fn(this.source), (t) => {
        bn(t) && wo(t, this);
      }),
        this._active.clear(),
        ec(this);
    }
    eventObserved(t) {
      t.type == "change"
        ? t.idle
          ? this.advance()
          : (this._active.add(t.parent), this._start())
        : t.type == "idle"
        ? this._active.delete(t.parent)
        : t.type == "priority" &&
          (this.priority = fn(this.source).reduce(
            (n, r) => Math.max(n, (Yl(r) ? r.priority : 0) + 1),
            0
          ));
    }
  }
  function cS(e) {
    return e.idle !== !1;
  }
  function Eg(e) {
    return !e.size || Array.from(e).every(cS);
  }
  function ec(e) {
    e.idle ||
      ((e.idle = !0),
      wt(qa(e), (t) => {
        t.done = !0;
      }),
      bo(e, { type: "idle", parent: e }));
  }
  Hn.assign({ createStringInterpolator: qv, to: (e, t) => new lS(e, t) });
  function tc(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  const fS = ["style", "children", "scrollTop", "scrollLeft"],
    Mg = /^--/;
  function dS(e, t) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : typeof t == "number" &&
        t !== 0 &&
        !Mg.test(e) &&
        !(Eo.hasOwnProperty(e) && Eo[e])
      ? t + "px"
      : ("" + t).trim();
  }
  const Og = {};
  function hS(e, t) {
    if (!e.nodeType || !e.setAttribute) return !1;
    const n =
        e.nodeName === "filter" ||
        (e.parentNode && e.parentNode.nodeName === "filter"),
      r = t,
      { style: i, children: o, scrollTop: a, scrollLeft: u } = r,
      f = tc(r, fS),
      c = Object.values(f),
      p = Object.keys(f).map((h) =>
        n || e.hasAttribute(h)
          ? h
          : Og[h] ||
            (Og[h] = h.replace(/([A-Z])/g, (w) => "-" + w.toLowerCase()))
      );
    o !== void 0 && (e.textContent = o);
    for (let h in i)
      if (i.hasOwnProperty(h)) {
        const w = dS(h, i[h]);
        Mg.test(h) ? e.style.setProperty(h, w) : (e.style[h] = w);
      }
    p.forEach((h, w) => {
      e.setAttribute(h, c[w]);
    }),
      a !== void 0 && (e.scrollTop = a),
      u !== void 0 && (e.scrollLeft = u);
  }
  let Eo = {
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
    strokeWidth: !0,
  };
  const pS = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1),
    vS = ["Webkit", "Ms", "Moz", "O"];
  Eo = Object.keys(Eo).reduce(
    (e, t) => (vS.forEach((n) => (e[pS(n, t)] = e[t])), e),
    Eo
  );
  const gS = ["x", "y", "z"],
    mS = /^(matrix|translate|scale|rotate|skew)/,
    yS = /^(translate)/,
    bS = /^(rotate|skew)/,
    nc = (e, t) => (de.num(e) && e !== 0 ? e + t : e),
    tu = (e, t) =>
      de.arr(e)
        ? e.every((n) => tu(n, t))
        : de.num(e)
        ? e === t
        : parseFloat(e) === t;
  class wS extends Xa {
    constructor(t) {
      let { x: n, y: r, z: i } = t,
        o = tc(t, gS);
      const a = [],
        u = [];
      (n || r || i) &&
        (a.push([n || 0, r || 0, i || 0]),
        u.push((f) => [
          `translate3d(${f.map((c) => nc(c, "px")).join(",")})`,
          tu(f, 0),
        ])),
        jn(o, (f, c) => {
          if (c === "transform")
            a.push([f || ""]), u.push((p) => [p, p === ""]);
          else if (mS.test(c)) {
            if ((delete o[c], de.und(f))) return;
            const p = yS.test(c) ? "px" : bS.test(c) ? "deg" : "";
            a.push(fn(f)),
              u.push(
                c === "rotate3d"
                  ? ([h, w, T, _]) => [
                      `rotate3d(${h},${w},${T},${nc(_, p)})`,
                      tu(_, 0),
                    ]
                  : (h) => [
                      `${c}(${h.map((w) => nc(w, p)).join(",")})`,
                      tu(h, c.startsWith("scale") ? 1 : 0),
                    ]
              );
          }
        }),
        a.length && (o.transform = new xS(a, u)),
        super(o);
    }
  }
  class xS extends Hv {
    constructor(t, n) {
      super(), (this._value = null), (this.inputs = t), (this.transforms = n);
    }
    get() {
      return this._value || (this._value = this._get());
    }
    _get() {
      let t = "",
        n = !0;
      return (
        wt(this.inputs, (r, i) => {
          const o = rn(r[0]),
            [a, u] = this.transforms[i](de.arr(o) ? o : r.map(rn));
          (t += " " + a), (n = n && u);
        }),
        n ? "none" : t
      );
    }
    observerAdded(t) {
      t == 1 && wt(this.inputs, (n) => wt(n, (r) => bn(r) && Pi(r, this)));
    }
    observerRemoved(t) {
      t == 0 && wt(this.inputs, (n) => wt(n, (r) => bn(r) && wo(r, this)));
    }
    eventObserved(t) {
      t.type == "change" && (this._value = null), bo(this, t);
    }
  }
  const _S = [
      "a",
      "abbr",
      "address",
      "area",
      "article",
      "aside",
      "audio",
      "b",
      "base",
      "bdi",
      "bdo",
      "big",
      "blockquote",
      "body",
      "br",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "col",
      "colgroup",
      "data",
      "datalist",
      "dd",
      "del",
      "details",
      "dfn",
      "dialog",
      "div",
      "dl",
      "dt",
      "em",
      "embed",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hgroup",
      "hr",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "keygen",
      "label",
      "legend",
      "li",
      "link",
      "main",
      "map",
      "mark",
      "menu",
      "menuitem",
      "meta",
      "meter",
      "nav",
      "noscript",
      "object",
      "ol",
      "optgroup",
      "option",
      "output",
      "p",
      "param",
      "picture",
      "pre",
      "progress",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "script",
      "section",
      "select",
      "small",
      "source",
      "span",
      "strong",
      "style",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "title",
      "tr",
      "track",
      "u",
      "ul",
      "var",
      "video",
      "wbr",
      "circle",
      "clipPath",
      "defs",
      "ellipse",
      "foreignObject",
      "g",
      "image",
      "line",
      "linearGradient",
      "mask",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      "stop",
      "svg",
      "text",
      "tspan",
    ],
    SS = ["scrollTop", "scrollLeft"];
  Hn.assign({
    batchedUpdates: Pf.unstable_batchedUpdates,
    createStringInterpolator: qv,
    colors: o_,
  });
  const RS = B_(_S, {
    applyAnimatedValues: hS,
    createAnimatedStyle: (e) => new wS(e),
    getComponentProps: (e) => tc(e, SS),
  }).animated;
  var CS = ["tooltipOpen"];
  function TS(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function nu() {
    return (
      (nu =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      nu.apply(this, arguments)
    );
  }
  function PS(e) {
    var t = Y.useState(nu({ tooltipOpen: !1 }, e)),
      n = t[0],
      r = t[1],
      i = Y.useCallback(
        function (a) {
          return r(
            typeof a == "function"
              ? function (u) {
                  u.tooltipOpen;
                  var f = TS(u, CS);
                  return nu({}, a(f), { tooltipOpen: !0 });
                }
              : {
                  tooltipOpen: !0,
                  tooltipLeft: a.tooltipLeft,
                  tooltipTop: a.tooltipTop,
                  tooltipData: a.tooltipData,
                }
          );
        },
        [r]
      ),
      o = Y.useCallback(
        function () {
          return r({
            tooltipOpen: !1,
            tooltipLeft: void 0,
            tooltipTop: void 0,
            tooltipData: void 0,
          });
        },
        [r]
      );
    return {
      tooltipOpen: n.tooltipOpen,
      tooltipLeft: n.tooltipLeft,
      tooltipTop: n.tooltipTop,
      tooltipData: n.tooltipData,
      updateTooltip: r,
      showTooltip: i,
      hideTooltip: o,
    };
  }
  function NS(e) {
    if (e === void 0)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return e;
  }
  function ES(e, t) {
    (e.prototype = Object.create(t.prototype)),
      (e.prototype.constructor = e),
      rc(e, t);
  }
  function rc(e, t) {
    return (
      (rc =
        Object.setPrototypeOf ||
        function (r, i) {
          return (r.__proto__ = i), r;
        }),
      rc(e, t)
    );
  }
  function Ag(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var kg = (function (e) {
    ES(t, e);
    function t() {
      for (var r, i = arguments.length, o = new Array(i), a = 0; a < i; a++)
        o[a] = arguments[a];
      return (
        (r = e.call.apply(e, [this].concat(o)) || this),
        Ag(NS(r), "node", void 0),
        r
      );
    }
    var n = t.prototype;
    return (
      (n.componentWillUnmount = function () {
        this.node &&
          document.body &&
          (document.body.removeChild(this.node), delete this.node);
      }),
      (n.render = function () {
        return (
          !this.node &&
            typeof document < "u" &&
            ((this.node = document.createElement("div")),
            this.props.zIndex != null &&
              (this.node.style.zIndex = "" + this.props.zIndex),
            document.body.append(this.node)),
          this.node
            ? Ef.default.createPortal(this.props.children, this.node)
            : null
        );
      }),
      t
    );
  })(Tn.default.PureComponent);
  Ag(kg, "propTypes", {
    zIndex: Ae.exports.oneOfType([Ae.exports.number, Ae.exports.string]),
  });
  var MS =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/Tooltip.js",
    OS = [
      "className",
      "top",
      "left",
      "offsetLeft",
      "offsetTop",
      "style",
      "children",
      "unstyled",
      "applyPositionStyle",
    ];
  function ic() {
    return (
      (ic =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      ic.apply(this, arguments)
    );
  }
  function AS(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  var oc = {
    position: "absolute",
    backgroundColor: "white",
    color: "#666666",
    padding: ".3rem .5rem",
    borderRadius: "3px",
    fontSize: "14px",
    boxShadow: "0 1px 2px rgba(33,33,33,0.2)",
    lineHeight: "1em",
    pointerEvents: "none",
  };
  function ac(e) {
    var t = e.className,
      n = e.top,
      r = e.left,
      i = e.offsetLeft,
      o = i === void 0 ? 10 : i,
      a = e.offsetTop,
      u = a === void 0 ? 10 : a,
      f = e.style,
      c = f === void 0 ? oc : f,
      p = e.children,
      h = e.unstyled,
      w = h === void 0 ? !1 : h,
      T = e.applyPositionStyle,
      _ = T === void 0 ? !1 : T,
      P = AS(e, OS);
    return L(
      "div",
      {
        className: cy("visx-tooltip", t),
        style: ic(
          {
            top: n == null || u == null ? n : n + u,
            left: r == null || o == null ? r : r + o,
          },
          _ && { position: "absolute" },
          !w && c
        ),
        ...P,
        children: p,
      },
      void 0,
      !1,
      { fileName: MS, lineNumber: 38, columnNumber: 23 },
      this
    );
  }
  ac.propTypes = {
    children: Ae.exports.node,
    className: Ae.exports.string,
    left: Ae.exports.number,
    offsetLeft: Ae.exports.number,
    offsetTop: Ae.exports.number,
    top: Ae.exports.number,
    applyPositionStyle: Ae.exports.bool,
    unstyled: Ae.exports.bool,
  };
  var kS =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js";
  function $g(e) {
    if (e === void 0)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return e;
  }
  function $S(e, t) {
    (e.prototype = Object.create(t.prototype)),
      (e.prototype.constructor = e),
      uc(e, t);
  }
  function uc(e, t) {
    return (
      (uc =
        Object.setPrototypeOf ||
        function (r, i) {
          return (r.__proto__ = i), r;
        }),
      uc(e, t)
    );
  }
  function Fg(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var Ig = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
  function FS(e) {
    var t, n;
    return (
      (n = t =
        (function (r) {
          $S(i, r);
          function i(a) {
            var u;
            return (
              (u = r.call(this, a) || this),
              Fg($g(u), "node", void 0),
              (u.state = { rect: void 0, parentRect: void 0 }),
              (u.getRects = u.getRects.bind($g(u))),
              u
            );
          }
          var o = i.prototype;
          return (
            (o.componentDidMount = function () {
              var u = this;
              (this.node = Ef.default.findDOMNode(this)),
                this.setState(function () {
                  return u.getRects();
                });
            }),
            (o.getRects = function () {
              if (!this.node) return this.state;
              var u = this.node,
                f = u.parentNode,
                c = u.getBoundingClientRect ? u.getBoundingClientRect() : Ig,
                p =
                  f != null && f.getBoundingClientRect
                    ? f.getBoundingClientRect()
                    : Ig;
              return { rect: c, parentRect: p };
            }),
            (o.render = function () {
              return L(
                e,
                { getRects: this.getRects, ...this.state, ...this.props },
                void 0,
                !1,
                { fileName: kS, lineNumber: 67, columnNumber: 27 },
                this
              );
            }),
            i
          );
        })(Tn.default.PureComponent)),
      Fg(t, "displayName", "withBoundingRects(" + (e.displayName || "") + ")"),
      n
    );
  }
  var IS =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js",
    BS = [
      "children",
      "getRects",
      "left",
      "offsetLeft",
      "offsetTop",
      "parentRect",
      "rect",
      "style",
      "top",
      "unstyled",
    ];
  function sc() {
    return (
      (sc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      sc.apply(this, arguments)
    );
  }
  function DS(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function zS(e) {
    var t = e.children;
    e.getRects;
    var n = e.left,
      r = n === void 0 ? 0 : n,
      i = e.offsetLeft,
      o = i === void 0 ? 10 : i,
      a = e.offsetTop,
      u = a === void 0 ? 10 : a,
      f = e.parentRect,
      c = e.rect,
      p = e.style,
      h = p === void 0 ? oc : p,
      w = e.top,
      T = w === void 0 ? 0 : w,
      _ = e.unstyled,
      P = _ === void 0 ? !1 : _,
      I = DS(e, BS),
      k;
    if (c && f) {
      var F = r,
        N = T,
        G = !1,
        M = !1;
      if (f.width) {
        var D = F + o + c.width - f.width,
          ne = c.width - F - o;
        G = D > 0 && D > ne;
      } else {
        var Z = F + o + c.width - window.innerWidth,
          he = c.width - F - o;
        G = Z > 0 && Z > he;
      }
      if (f.height) {
        var me = N + u + c.height - f.height,
          ie = c.height - N - u;
        M = me > 0 && me > ie;
      } else M = N + u + c.height > window.innerHeight;
      (F = G ? F - c.width - o : F + o),
        (N = M ? N - c.height - u : N + u),
        (F = Math.round(F)),
        (N = Math.round(N)),
        (k = "translate(" + F + "px, " + N + "px)");
    }
    return L(
      ac,
      {
        style: sc({ left: 0, top: 0, transform: k }, !P && h),
        ...I,
        children: t,
      },
      void 0,
      !1,
      { fileName: IS, lineNumber: 65, columnNumber: 23 },
      this
    );
  }
  const LS = FS(zS);
  var Bg =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js",
    GS = ["detectBounds", "zIndex"],
    jS = ["left", "top", "detectBounds", "zIndex"];
  function Dg(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function HS(e) {
    var t = e === void 0 ? {} : e,
      n = t.detectBounds,
      r = n === void 0 ? !0 : n,
      i = t.zIndex,
      o = Dg(t, GS),
      a = fy(o),
      u = a[0],
      f = a[1],
      c = a[2],
      p = Y.useMemo(
        function () {
          return function (h) {
            var w = h.left,
              T = w === void 0 ? 0 : w,
              _ = h.top,
              P = _ === void 0 ? 0 : _,
              I = h.detectBounds,
              k = h.zIndex,
              F = Dg(h, jS),
              N = I == null ? r : I,
              G = k == null ? i : k,
              M = N ? LS : ac,
              D = T + (f.left || 0) + window.scrollX,
              ne = P + (f.top || 0) + window.scrollY;
            return L(
              kg,
              {
                zIndex: G,
                children: L(
                  M,
                  { left: D, top: ne, ...F },
                  void 0,
                  !1,
                  { fileName: Bg, lineNumber: 48, columnNumber: 23 },
                  this
                ),
              },
              void 0,
              !1,
              { fileName: Bg, lineNumber: 46, columnNumber: 27 },
              this
            );
          };
        },
        [r, i, f.left, f.top]
      );
    return {
      containerRef: u,
      containerBounds: f,
      forceRefreshBounds: c,
      TooltipInPortal: p,
    };
  }
  var WS = Y.createContext(null);
  const Mo = WS;
  var dn =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/Tooltip.js",
    VS = [
      "debounce",
      "detectBounds",
      "horizontalCrosshairStyle",
      "glyphStyle",
      "renderTooltip",
      "renderGlyph",
      "resizeObserverPolyfill",
      "scroll",
      "showDatumGlyph",
      "showHorizontalCrosshair",
      "showSeriesGlyphs",
      "showVerticalCrosshair",
      "snapTooltipToDatumX",
      "snapTooltipToDatumY",
      "verticalCrosshairStyle",
      "zIndex",
    ],
    US = ["x", "y"];
  function zg(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function Oo() {
    return (
      (Oo =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Oo.apply(this, arguments)
    );
  }
  var lc = {
      position: "absolute",
      pointerEvents: "none",
      fontSize: 0,
      lineHeight: 0,
    },
    qS = {
      position: "absolute",
      left: 0,
      top: 0,
      opacity: 0,
      width: 0,
      height: 0,
      pointerEvents: "none",
    };
  function Lg(e) {
    var t = Y.useContext(br) || {},
      n = t.theme;
    return L(
      "circle",
      {
        cx: e.x,
        cy: e.y,
        r: e.size,
        fill: e.color,
        stroke: n == null ? void 0 : n.backgroundColor,
        strokeWidth: 1.5,
        paintOrder: "fill",
        ...e.glyphStyle,
      },
      void 0,
      !1,
      { fileName: dn, lineNumber: 37, columnNumber: 23 },
      this
    );
  }
  Lg.propTypes = { isNearestDatum: Ae.exports.bool.isRequired };
  function YS(e) {
    return L(
      Lg,
      { ...e },
      void 0,
      !1,
      { fileName: dn, lineNumber: 53, columnNumber: 23 },
      this
    );
  }
  function Gg(e) {
    var t = Y.useContext(Mo);
    return t != null && t.tooltipOpen
      ? L(
          jg,
          { ...e },
          void 0,
          !1,
          { fileName: dn, lineNumber: 66, columnNumber: 23 },
          this
        )
      : null;
  }
  Gg.propTypes = {
    renderTooltip: Ae.exports.func.isRequired,
    renderGlyph: Ae.exports.func,
    snapTooltipToDatumX: Ae.exports.bool,
    snapTooltipToDatumY: Ae.exports.bool,
    showVerticalCrosshair: Ae.exports.bool,
    showHorizontalCrosshair: Ae.exports.bool,
    showDatumGlyph: Ae.exports.bool,
    showSeriesGlyphs: Ae.exports.bool,
  };
  function jg(e) {
    var t,
      n,
      r,
      i,
      o,
      a,
      u,
      f,
      c,
      p,
      h,
      w,
      T,
      _ = e.debounce,
      P = e.detectBounds,
      I = e.horizontalCrosshairStyle,
      k = e.glyphStyle,
      F = e.renderTooltip,
      N = e.renderGlyph,
      G = N === void 0 ? YS : N,
      M = e.resizeObserverPolyfill,
      D = e.scroll,
      ne = D === void 0 ? !0 : D,
      Z = e.showDatumGlyph,
      he = Z === void 0 ? !1 : Z,
      me = e.showHorizontalCrosshair,
      ie = me === void 0 ? !1 : me,
      te = e.showSeriesGlyphs,
      we = te === void 0 ? !1 : te,
      ke = e.showVerticalCrosshair,
      st = ke === void 0 ? !1 : ke,
      Ue = e.snapTooltipToDatumX,
      lt = Ue === void 0 ? !1 : Ue,
      ct = e.snapTooltipToDatumY,
      ht = ct === void 0 ? !1 : ct,
      U = e.verticalCrosshairStyle,
      se = e.zIndex,
      Ne = zg(e, VS),
      $e = Y.useContext(br) || {},
      Te = $e.colorScale,
      Ce = $e.theme,
      Ee = $e.innerHeight,
      De = $e.innerWidth,
      Ge = $e.margin,
      K = $e.xScale,
      fe = $e.yScale,
      je = $e.dataRegistry,
      B = Y.useContext(Mo),
      yt = HS({
        debounce: _,
        detectBounds: P,
        polyfill: M,
        scroll: ne,
        zIndex: se,
      }),
      ft = yt.containerRef,
      Ct = yt.TooltipInPortal,
      At = yt.forceRefreshBounds,
      en = Y.useCallback(
        function (Vt) {
          var Xt;
          ft((Xt = Vt == null ? void 0 : Vt.parentElement) != null ? Xt : null);
        },
        [ft]
      ),
      un = B != null && B.tooltipOpen ? F(Oo({}, B, { colorScale: Te })) : null,
      wn = (B == null ? void 0 : B.tooltipOpen) && un != null,
      xn = Y.useRef(!1);
    Y.useEffect(
      function () {
        wn && !xn.current && At(), (xn.current = wn);
      },
      [wn, At]
    );
    var _n = B == null ? void 0 : B.tooltipLeft,
      Un = B == null ? void 0 : B.tooltipTop,
      sr = K ? _l(K) : 0,
      qn = fe ? _l(fe) : 0,
      Sn = Y.useCallback(
        function (Vt, Xt) {
          var O,
            ee,
            ve = je == null ? void 0 : je.get(Vt),
            Le = ve == null ? void 0 : ve.xAccessor,
            vt = ve == null ? void 0 : ve.yAccessor,
            bt =
              K && Le
                ? (O = Number(K(Le(Xt))) + sr / 2) != null
                  ? O
                  : 0
                : void 0,
            ut =
              fe && vt
                ? (ee = Number(fe(vt(Xt))) + qn / 2) != null
                  ? ee
                  : 0
                : void 0;
          return { left: bt, top: ut };
        },
        [je, sr, qn, K, fe]
      ),
      Yt = B == null || (t = B.tooltipData) == null ? void 0 : t.nearestDatum,
      An = (n = Yt == null ? void 0 : Yt.key) != null ? n : "";
    if (wn && Yt && (lt || ht)) {
      var lr = Sn(An, Yt.datum),
        Or = lr.left,
        Ar = lr.top;
      (_n = lt && Jt(Or) ? Or : _n), (Un = ht && Jt(Ar) ? Ar : Un);
    }
    var cr = [];
    if (wn && (he || we)) {
      var kr,
        Yn = Number((kr = k == null ? void 0 : k.radius) != null ? kr : 4);
      if (we) {
        var Xn, sn;
        Object.values(
          (Xn =
            B == null || (sn = B.tooltipData) == null
              ? void 0
              : sn.datumByKey) != null
            ? Xn
            : {}
        ).forEach(function (Vt) {
          var Xt,
            O,
            ee,
            ve = Vt.key,
            Le = Vt.datum,
            vt = Vt.index,
            bt =
              (Xt =
                (O = Te == null ? void 0 : Te(ve)) != null
                  ? O
                  : Ce == null || (ee = Ce.htmlLabel) == null
                  ? void 0
                  : ee.color) != null
                ? Xt
                : "#222",
            ut = Sn(ve, Le),
            it = ut.left,
            kt = ut.top;
          !Jt(it) ||
            !Jt(kt) ||
            cr.push({
              key: ve,
              color: bt,
              datum: Le,
              index: vt,
              size: Yn,
              x: it,
              y: kt,
              glyphStyle: k,
              isNearestDatum: Yt ? Yt.key === ve : !1,
            });
        });
      } else if (Yt) {
        var Rn = Sn(An, Yt.datum),
          kn = Rn.left,
          $n = Rn.top;
        if (Jt(kn) && Jt($n)) {
          var fr,
            Fn,
            dr,
            Kn,
            Qn,
            Cn,
            $r =
              (fr =
                (Fn =
                  (dr =
                    (Kn = An && (Te == null ? void 0 : Te(An))) != null
                      ? Kn
                      : null) != null
                    ? dr
                    : Ce == null || (Qn = Ce.gridStyles) == null
                    ? void 0
                    : Qn.stroke) != null
                  ? Fn
                  : Ce == null || (Cn = Ce.htmlLabel) == null
                  ? void 0
                  : Cn.color) != null
                ? fr
                : "#222";
          cr.push({
            key: An,
            color: $r,
            datum: Yt.datum,
            index: Yt.index,
            size: Yn,
            x: kn,
            y: $n,
            glyphStyle: k,
            isNearestDatum: !0,
          });
        }
      }
    }
    return L(
      Nn,
      {
        children: [
          L(
            "svg",
            { ref: en, style: qS },
            void 0,
            !1,
            { fileName: dn, lineNumber: 250, columnNumber: 60 },
            this
          ),
          wn &&
            L(
              Nn,
              {
                children: [
                  st &&
                    L(
                      Ct,
                      {
                        className: "visx-crosshair visx-crosshair-vertical",
                        left: _n,
                        top: Ge == null ? void 0 : Ge.top,
                        offsetLeft: 0,
                        offsetTop: 0,
                        detectBounds: !1,
                        style: lc,
                        children: L(
                          "svg",
                          {
                            width: "1",
                            height: Ee,
                            overflow: "visible",
                            children: L(
                              "line",
                              {
                                x1: 0,
                                x2: 0,
                                y1: 0,
                                y2: Ee,
                                strokeWidth: 1.5,
                                stroke:
                                  (r =
                                    (i =
                                      Ce == null || (o = Ce.gridStyles) == null
                                        ? void 0
                                        : o.stroke) != null
                                      ? i
                                      : Ce == null || (a = Ce.htmlLabel) == null
                                      ? void 0
                                      : a.color) != null
                                    ? r
                                    : "#222",
                                ...U,
                              },
                              void 0,
                              !1,
                              {
                                fileName: dn,
                                lineNumber: 265,
                                columnNumber: 21,
                              },
                              this
                            ),
                          },
                          void 0,
                          !1,
                          { fileName: dn, lineNumber: 261, columnNumber: 21 },
                          this
                        ),
                      },
                      void 0,
                      !1,
                      { fileName: dn, lineNumber: 253, columnNumber: 117 },
                      this
                    ),
                  ie &&
                    L(
                      Ct,
                      {
                        className: "visx-crosshair visx-crosshair-horizontal",
                        left: Ge == null ? void 0 : Ge.left,
                        top: Un,
                        offsetLeft: 0,
                        offsetTop: 0,
                        detectBounds: !1,
                        style: lc,
                        children: L(
                          "svg",
                          {
                            width: De,
                            height: "1",
                            overflow: "visible",
                            children: L(
                              "line",
                              {
                                x1: 0,
                                x2: De,
                                y1: 0,
                                y2: 0,
                                strokeWidth: 1.5,
                                stroke:
                                  (u =
                                    (f =
                                      Ce == null || (c = Ce.gridStyles) == null
                                        ? void 0
                                        : c.stroke) != null
                                      ? f
                                      : Ce == null || (p = Ce.htmlLabel) == null
                                      ? void 0
                                      : p.color) != null
                                    ? u
                                    : "#222",
                                ...I,
                              },
                              void 0,
                              !1,
                              {
                                fileName: dn,
                                lineNumber: 284,
                                columnNumber: 21,
                              },
                              this
                            ),
                          },
                          void 0,
                          !1,
                          { fileName: dn, lineNumber: 280, columnNumber: 21 },
                          this
                        ),
                      },
                      void 0,
                      !1,
                      { fileName: dn, lineNumber: 272, columnNumber: 76 },
                      this
                    ),
                  cr.map(function (Vt, Xt) {
                    var O = Vt.x,
                      ee = Vt.y,
                      ve = zg(Vt, US);
                    return L(
                      Ct,
                      {
                        className: "visx-tooltip-glyph",
                        left: O,
                        top: ee,
                        offsetLeft: 0,
                        offsetTop: 0,
                        detectBounds: !1,
                        style: lc,
                        children: L(
                          "svg",
                          {
                            overflow: "visible",
                            children: G(Oo({ x: 0, y: 0 }, ve)),
                          },
                          void 0,
                          !1,
                          { fileName: dn, lineNumber: 308, columnNumber: 25 },
                          this
                        ),
                      },
                      Xt,
                      !1,
                      { fileName: dn, lineNumber: 299, columnNumber: 9 },
                      this
                    );
                  }),
                  L(
                    Ct,
                    {
                      left: _n,
                      top: Un,
                      style: Oo(
                        {},
                        oc,
                        {
                          background:
                            (h = Ce == null ? void 0 : Ce.backgroundColor) !=
                            null
                              ? h
                              : "white",
                          boxShadow:
                            "0 1px 2px " +
                            (Ce != null && (w = Ce.htmlLabel) != null && w.color
                              ? (Ce == null || (T = Ce.htmlLabel) == null
                                  ? void 0
                                  : T.color) + "55"
                              : "#22222255"),
                        },
                        Ce == null ? void 0 : Ce.htmlLabel
                      ),
                      ...Ne,
                      children: un,
                    },
                    void 0,
                    !1,
                    { fileName: dn, lineNumber: 315, columnNumber: 22 },
                    this
                  ),
                ],
              },
              void 0,
              !0
            ),
        ],
      },
      void 0,
      !0
    );
  }
  jg.propTypes = {
    renderTooltip: Ae.exports.func.isRequired,
    renderGlyph: Ae.exports.func,
    snapTooltipToDatumX: Ae.exports.bool,
    snapTooltipToDatumY: Ae.exports.bool,
    showVerticalCrosshair: Ae.exports.bool,
    showHorizontalCrosshair: Ae.exports.bool,
    showDatumGlyph: Ae.exports.bool,
    showSeriesGlyphs: Ae.exports.bool,
  };
  const XS = ji(oy);
  var KS = Vg,
    Rr = Wg(Ae.exports),
    QS = Wg(Jf),
    Oi = eR(Tn.default),
    ZS = XS,
    JS = [
      "className",
      "children",
      "debounceTime",
      "ignoreDimensions",
      "parentSizeStyles",
      "enableDebounceLeadingCall",
    ];
  function Hg(e) {
    if (typeof WeakMap != "function") return null;
    var t = new WeakMap(),
      n = new WeakMap();
    return (Hg = function (i) {
      return i ? n : t;
    })(e);
  }
  function eR(e, t) {
    if (!t && e && e.__esModule) return e;
    if (e === null || (typeof e != "object" && typeof e != "function"))
      return { default: e };
    var n = Hg(t);
    if (n && n.has(e)) return n.get(e);
    var r = {},
      i = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in e)
      if (o !== "default" && Object.prototype.hasOwnProperty.call(e, o)) {
        var a = i ? Object.getOwnPropertyDescriptor(e, o) : null;
        a && (a.get || a.set) ? Object.defineProperty(r, o, a) : (r[o] = e[o]);
      }
    return (r.default = e), n && n.set(e, r), r;
  }
  function Wg(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function ru() {
    return (
      (ru =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      ru.apply(this, arguments)
    );
  }
  function tR(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  var nR = [];
  function Vg(e) {
    var t = e.className,
      n = e.children,
      r = e.debounceTime,
      i = r === void 0 ? 300 : r,
      o = e.ignoreDimensions,
      a = o === void 0 ? nR : o,
      u = e.parentSizeStyles,
      f = u === void 0 ? { width: "100%", height: "100%" } : u,
      c = e.enableDebounceLeadingCall,
      p = c === void 0 ? !0 : c,
      h = tR(e, JS),
      w = (0, Oi.useRef)(null),
      T = (0, Oi.useRef)(0),
      _ = (0, Oi.useState)({ width: 0, height: 0, top: 0, left: 0 }),
      P = _[0],
      I = _[1],
      k = (0, Oi.useMemo)(
        function () {
          var F = Array.isArray(a) ? a : [a];
          return (0, QS.default)(
            function (N) {
              I(function (G) {
                var M = Object.keys(G),
                  D = M.filter(function (Z) {
                    return G[Z] !== N[Z];
                  }),
                  ne = D.every(function (Z) {
                    return F.includes(Z);
                  });
                return ne ? G : N;
              });
            },
            i,
            { leading: p }
          );
        },
        [i, p, a]
      );
    return (
      (0, Oi.useEffect)(
        function () {
          var F = new ZS.ResizeObserver(function (N) {
            N === void 0 && (N = []),
              N.forEach(function (G) {
                var M = G.contentRect,
                  D = M.left,
                  ne = M.top,
                  Z = M.width,
                  he = M.height;
                T.current = window.requestAnimationFrame(function () {
                  k({ width: Z, height: he, top: ne, left: D });
                });
              });
          });
          return (
            w.current && F.observe(w.current),
            function () {
              window.cancelAnimationFrame(T.current),
                F.disconnect(),
                k != null && k.cancel && k.cancel();
            }
          );
        },
        [k]
      ),
      Oi.default.createElement(
        "div",
        ru({ style: f, ref: w, className: t }, h),
        n(ru({}, P, { ref: w.current, resize: k }))
      )
    );
  }
  Vg.propTypes = {
    className: Rr.default.string,
    debounceTime: Rr.default.number,
    enableDebounceLeadingCall: Rr.default.bool,
    ignoreDimensions: Rr.default.oneOfType([
      Rr.default.any,
      Rr.default.arrayOf(Rr.default.any),
    ]),
    children: Rr.default.func.isRequired,
  };
  var rR = Y.createContext(null);
  const Ug = rR;
  function Cr(e, t, n) {
    var r = Y.useContext(Ug),
      i = Y.useRef();
    i.current = n;
    var o = Y.useCallback(
      function (a, u, f) {
        r && r.emit(a, { event: u, svgPoint: Ry(u), source: f });
      },
      [r]
    );
    return (
      Y.useEffect(
        function () {
          if (r && e && t) {
            var a = function (f) {
              var c;
              (!i.current ||
                (f != null &&
                  f.source &&
                  (c = i.current) != null &&
                  c.includes(f.source))) &&
                t(f);
            };
            return (
              r.on(e, a),
              function () {
                return r == null ? void 0 : r.off(e, a);
              }
            );
          }
        },
        [r, e, t]
      ),
      r ? o : null
    );
  }
  function iR(e) {
    return {
      all: (e = e || new Map()),
      on: function (t, n) {
        var r = e.get(t);
        (r && r.push(n)) || e.set(t, [n]);
      },
      off: function (t, n) {
        var r = e.get(t);
        r && r.splice(r.indexOf(n) >>> 0, 1);
      },
      emit: function (t, n) {
        (e.get(t) || []).slice().map(function (r) {
          r(n);
        }),
          (e.get("*") || []).slice().map(function (r) {
            r(t, n);
          });
      },
    };
  }
  var oR =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/EventEmitterProvider.js";
  function aR(e) {
    var t = e.children,
      n = Y.useMemo(function () {
        return iR();
      }, []);
    return L(
      Ug.Provider,
      { value: n, children: t },
      void 0,
      !1,
      { fileName: oR, lineNumber: 11, columnNumber: 23 },
      this
    );
  }
  var uR =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/TooltipProvider.js";
  function cc() {
    return (
      (cc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      cc.apply(this, arguments)
    );
  }
  function qg(e) {
    var t = e.hideTooltipDebounceMs,
      n = t === void 0 ? 400 : t,
      r = e.children,
      i = PS(void 0),
      o = i.tooltipOpen,
      a = i.tooltipLeft,
      u = i.tooltipTop,
      f = i.tooltipData,
      c = i.updateTooltip,
      p = i.hideTooltip,
      h = Y.useRef(null),
      w = Y.useRef(function (_) {
        var P = _.svgPoint,
          I = _.index,
          k = _.key,
          F = _.datum,
          N = _.distanceX,
          G = _.distanceY;
        h.current && (h.current.cancel(), (h.current = null));
        var M = Jt(N) ? N : 1 / 0,
          D = Jt(G) ? G : 1 / 0,
          ne = Math.sqrt(Math.pow(M, 2) + Math.pow(D, 2));
        c(function (Z) {
          var he,
            me,
            ie,
            te = Z.tooltipData,
            we =
              te != null && te.nearestDatum && Jt(te.nearestDatum.distance)
                ? te.nearestDatum.distance
                : 1 / 0;
          return {
            tooltipOpen: !0,
            tooltipLeft: P == null ? void 0 : P.x,
            tooltipTop: P == null ? void 0 : P.y,
            tooltipData: {
              nearestDatum:
                ((he =
                  te == null || (me = te.nearestDatum) == null
                    ? void 0
                    : me.key) != null
                  ? he
                  : "") !== k && we < ne
                  ? te == null
                    ? void 0
                    : te.nearestDatum
                  : { key: k, index: I, datum: F, distance: ne },
              datumByKey: cc(
                {},
                te == null ? void 0 : te.datumByKey,
                ((ie = {}), (ie[k] = { datum: F, index: I, key: k }), ie)
              ),
            },
          };
        });
      }),
      T = Y.useCallback(
        function () {
          (h.current = es(p, n)), h.current();
        },
        [p, n]
      );
    return L(
      Mo.Provider,
      {
        value: {
          tooltipOpen: o,
          tooltipLeft: a,
          tooltipTop: u,
          tooltipData: f,
          updateTooltip: c,
          showTooltip: w.current,
          hideTooltip: T,
        },
        children: r,
      },
      void 0,
      !1,
      { fileName: uR, lineNumber: 72, columnNumber: 23 },
      this
    );
  }
  qg.propTypes = {
    hideTooltipDebounceMs: Ae.exports.number,
    children: Ae.exports.node.isRequired,
  };
  const sR = ji(ax);
  var Ao = {},
    fc = {};
  (fc.__esModule = !0), (fc.default = lR);
  function lR(e, t) {
    t.domain &&
      ("nice" in e || "quantiles" in e || "padding" in e, e.domain(t.domain));
  }
  var dc = {};
  (dc.__esModule = !0), (dc.default = cR);
  function cR(e, t) {
    t.range && ("padding" in e, e.range(t.range));
  }
  var hc = {};
  (hc.__esModule = !0), (hc.default = fR);
  function fR(e, t) {
    "align" in e && "align" in t && typeof t.align < "u" && e.align(t.align);
  }
  var pc = {};
  (pc.__esModule = !0), (pc.default = dR);
  function dR(e, t) {
    "base" in e && "base" in t && typeof t.base < "u" && e.base(t.base);
  }
  var vc = {};
  (vc.__esModule = !0), (vc.default = hR);
  function hR(e, t) {
    "clamp" in e && "clamp" in t && typeof t.clamp < "u" && e.clamp(t.clamp);
  }
  var gc = {};
  (gc.__esModule = !0), (gc.default = pR);
  function pR(e, t) {
    "constant" in e &&
      "constant" in t &&
      typeof t.constant < "u" &&
      e.constant(t.constant);
  }
  var mc = {};
  (mc.__esModule = !0), (mc.default = vR);
  function vR(e, t) {
    "exponent" in e &&
      "exponent" in t &&
      typeof t.exponent < "u" &&
      e.exponent(t.exponent);
  }
  var yc = {},
    bc = {};
  const Yg = ji(s1);
  (bc.__esModule = !0), (bc.default = gR);
  var Tr = Yg,
    Xg = {
      lab: Tr.interpolateLab,
      hcl: Tr.interpolateHcl,
      "hcl-long": Tr.interpolateHclLong,
      hsl: Tr.interpolateHsl,
      "hsl-long": Tr.interpolateHslLong,
      cubehelix: Tr.interpolateCubehelix,
      "cubehelix-long": Tr.interpolateCubehelixLong,
      rgb: Tr.interpolateRgb,
    };
  function gR(e) {
    switch (e) {
      case "lab":
      case "hcl":
      case "hcl-long":
      case "hsl":
      case "hsl-long":
      case "cubehelix":
      case "cubehelix-long":
      case "rgb":
        return Xg[e];
    }
    var t = e.type,
      n = e.gamma,
      r = Xg[t];
    return typeof n > "u" ? r : r.gamma(n);
  }
  (yc.__esModule = !0), (yc.default = bR);
  var mR = yR(bc);
  function yR(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function bR(e, t) {
    if (
      "interpolate" in t &&
      "interpolate" in e &&
      typeof t.interpolate < "u"
    ) {
      var n = (0, mR.default)(t.interpolate);
      e.interpolate(n);
    }
  }
  var wc = {};
  const wR = ji(ew);
  var xc = {};
  (xc.__esModule = !0), (xc.default = SR);
  var xR = new Date(Date.UTC(2020, 1, 2, 3, 4, 5)),
    _R = "%Y-%m-%d %H:%M";
  function SR(e) {
    var t = e.tickFormat(1, _R)(xR);
    return t === "2020-02-02 03:04";
  }
  (wc.__esModule = !0), (wc.default = TR);
  var on = wR,
    RR = CR(xc);
  function CR(e) {
    return e && e.__esModule ? e : { default: e };
  }
  var Kg = {
      day: on.timeDay,
      hour: on.timeHour,
      minute: on.timeMinute,
      month: on.timeMonth,
      second: on.timeSecond,
      week: on.timeWeek,
      year: on.timeYear,
    },
    Qg = {
      day: on.utcDay,
      hour: on.utcHour,
      minute: on.utcMinute,
      month: on.utcMonth,
      second: on.utcSecond,
      week: on.utcWeek,
      year: on.utcYear,
    };
  function TR(e, t) {
    if ("nice" in t && typeof t.nice < "u" && "nice" in e) {
      var n = t.nice;
      if (typeof n == "boolean") n && e.nice();
      else if (typeof n == "number") e.nice(n);
      else {
        var r = e,
          i = (0, RR.default)(r);
        if (typeof n == "string") r.nice(i ? Qg[n] : Kg[n]);
        else {
          var o = n.interval,
            a = n.step,
            u = (i ? Qg[o] : Kg[o]).every(a);
          u != null && r.nice(u);
        }
      }
    }
  }
  var _c = {};
  (_c.__esModule = !0), (_c.default = PR);
  function PR(e, t) {
    "padding" in e &&
      "padding" in t &&
      typeof t.padding < "u" &&
      e.padding(t.padding),
      "paddingInner" in e &&
        "paddingInner" in t &&
        typeof t.paddingInner < "u" &&
        e.paddingInner(t.paddingInner),
      "paddingOuter" in e &&
        "paddingOuter" in t &&
        typeof t.paddingOuter < "u" &&
        e.paddingOuter(t.paddingOuter);
  }
  var Sc = {};
  (Sc.__esModule = !0), (Sc.default = NR);
  function NR(e, t) {
    if (t.reverse) {
      var n = e.range().slice().reverse();
      "padding" in e, e.range(n);
    }
  }
  var Rc = {};
  (Rc.__esModule = !0), (Rc.default = MR);
  var ER = Yg;
  function MR(e, t) {
    "round" in t &&
      typeof t.round < "u" &&
      (t.round && "interpolate" in t && typeof t.interpolate < "u"
        ? console.warn(
            "[visx/scale/applyRound] ignoring round: scale config contains round and interpolate. only applying interpolate. config:",
            t
          )
        : "round" in e
        ? e.round(t.round)
        : "interpolate" in e && t.round && e.interpolate(ER.interpolateRound));
  }
  var Cc = {};
  (Cc.__esModule = !0), (Cc.default = OR);
  function OR(e, t) {
    "unknown" in e &&
      "unknown" in t &&
      typeof t.unknown < "u" &&
      e.unknown(t.unknown);
  }
  var Tc = {};
  (Tc.__esModule = !0), (Tc.default = AR);
  function AR(e, t) {
    if ("zero" in t && t.zero === !0) {
      var n = e.domain(),
        r = n[0],
        i = n[1],
        o = i < r,
        a = o ? [i, r] : [r, i],
        u = a[0],
        f = a[1],
        c = [Math.min(0, u), Math.max(0, f)];
      e.domain(o ? c.reverse() : c);
    }
  }
  (Ao.__esModule = !0), (Ao.default = YR), (Ao.ALL_OPERATORS = void 0);
  var kR = an(fc),
    $R = an(dc),
    FR = an(hc),
    IR = an(pc),
    BR = an(vc),
    DR = an(gc),
    zR = an(mc),
    LR = an(yc),
    GR = an(wc),
    jR = an(_c),
    HR = an(Sc),
    WR = an(Rc),
    VR = an(Cc),
    UR = an(Tc);
  function an(e) {
    return e && e.__esModule ? e : { default: e };
  }
  var Zg = [
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
    "unknown",
  ];
  Ao.ALL_OPERATORS = Zg;
  var qR = {
    domain: kR.default,
    nice: GR.default,
    zero: UR.default,
    interpolate: LR.default,
    round: WR.default,
    align: FR.default,
    base: IR.default,
    clamp: BR.default,
    constant: DR.default,
    exponent: zR.default,
    padding: jR.default,
    range: $R.default,
    reverse: HR.default,
    unknown: VR.default,
  };
  function YR() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    var r = new Set(t),
      i = Zg.filter(function (o) {
        return r.has(o);
      });
    return function (a, u) {
      return (
        typeof u < "u" &&
          i.forEach(function (f) {
            qR[f](a, u);
          }),
        a
      );
    };
  }
  var XR = eC,
    KR = sR,
    QR = ZR(Ao);
  function ZR(e) {
    return e && e.__esModule ? e : { default: e };
  }
  var JR = (0, QR.default)("domain", "range", "reverse", "unknown");
  function eC(e) {
    return JR((0, KR.scaleOrdinal)(), e);
  }
  var Pr = {
      red: [
        "#fff5f5",
        "#ffe3e3",
        "#ffc9c9",
        "#ffa8a8",
        "#ff8787",
        "#ff6b6b",
        "#fa5252",
        "#f03e3e",
        "#e03131",
        "#c92a2a",
      ],
      pink: [
        "#fff0f6",
        "#ffdeeb",
        "#fcc2d7",
        "#faa2c1",
        "#f783ac",
        "#f06595",
        "#e64980",
        "#d6336c",
        "#c2255c",
        "#a61e4d",
      ],
      grape: [
        "#f8f0fc",
        "#f3d9fa",
        "#eebefa",
        "#e599f7",
        "#da77f2",
        "#cc5de8",
        "#be4bdb",
        "#ae3ec9",
        "#9c36b5",
        "#862e9c",
      ],
      violet: [
        "#f3f0ff",
        "#e5dbff",
        "#d0bfff",
        "#b197fc",
        "#9775fa",
        "#845ef7",
        "#7950f2",
        "#7048e8",
        "#6741d9",
        "#5f3dc4",
      ],
      indigo: [
        "#edf2ff",
        "#dbe4ff",
        "#bac8ff",
        "#91a7ff",
        "#748ffc",
        "#5c7cfa",
        "#4c6ef5",
        "#4263eb",
        "#3b5bdb",
        "#364fc7",
      ],
      blue: [
        "#e8f7ff",
        "#ccedff",
        "#a3daff",
        "#72c3fc",
        "#4dadf7",
        "#329af0",
        "#228ae6",
        "#1c7cd6",
        "#1b6ec2",
        "#1862ab",
      ],
      cyan: [
        "#e3fafc",
        "#c5f6fa",
        "#99e9f2",
        "#66d9e8",
        "#3bc9db",
        "#22b8cf",
        "#15aabf",
        "#1098ad",
        "#0c8599",
        "#0b7285",
      ],
      teal: [
        "#e6fcf5",
        "#c3fae8",
        "#96f2d7",
        "#63e6be",
        "#38d9a9",
        "#20c997",
        "#12b886",
        "#0ca678",
        "#099268",
        "#087f5b",
      ],
      green: [
        "#ebfbee",
        "#d3f9d8",
        "#b2f2bb",
        "#8ce99a",
        "#69db7c",
        "#51cf66",
        "#40c057",
        "#37b24d",
        "#2f9e44",
        "#2b8a3e",
      ],
      lime: [
        "#f4fce3",
        "#e9fac8",
        "#d8f5a2",
        "#c0eb75",
        "#a9e34b",
        "#94d82d",
        "#82c91e",
        "#74b816",
        "#66a80f",
        "#5c940d",
      ],
      yellow: [
        "#fff9db",
        "#fff3bf",
        "#ffec99",
        "#ffe066",
        "#ffd43b",
        "#fcc419",
        "#fab005",
        "#f59f00",
        "#f08c00",
        "#e67700",
      ],
      orange: [
        "#fff4e6",
        "#ffe8cc",
        "#ffd8a8",
        "#ffc078",
        "#ffa94d",
        "#ff922b",
        "#fd7e14",
        "#f76707",
        "#e8590c",
        "#d9480f",
      ],
      gray: [
        "#f8f9fa",
        "#f1f3f5",
        "#e9ecef",
        "#dee2e6",
        "#ced4da",
        "#adb5bd",
        "#868e96",
        "#495057",
        "#343a40",
        "#212529",
      ],
    },
    ko = Pr.gray,
    Pc = ko[7],
    tC = [
      Pr.cyan[9],
      Pr.cyan[3],
      Pr.yellow[5],
      Pr.red[4],
      Pr.grape[8],
      Pr.grape[5],
      Pr.pink[9],
    ];
  function Mt() {
    return (
      (Mt =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Mt.apply(this, arguments)
    );
  }
  var Nc = {
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
    fontWeight: 700,
    fontSize: 12,
    textAnchor: "middle",
    pointerEvents: "none",
    letterSpacing: 0.4,
  };
  function nC(e) {
    var t,
      n,
      r,
      i,
      o,
      a,
      u = Mt({}, Nc, { fill: Pc, stroke: "none" }, e.svgLabelBig),
      f = Mt(
        {},
        Nc,
        { fontWeight: 200, fontSize: 11, fill: Pc, stroke: "none" },
        e.svgLabelSmall
      ),
      c = Mt(
        {
          color:
            (t =
              (n =
                (r = (i = e.htmlLabel) == null ? void 0 : i.color) != null
                  ? r
                  : (o = e.svgLabelBig) == null
                  ? void 0
                  : o.fill) != null
                ? n
                : (a = e.svgLabelSmall) == null
                ? void 0
                : a.fill) != null
              ? t
              : Pc,
        },
        Nc,
        e.htmlLabel
      );
    return {
      backgroundColor: e.backgroundColor,
      colors: [].concat(e.colors),
      htmlLabel: Mt({}, c),
      svgLabelSmall: Mt({}, f),
      svgLabelBig: Mt({}, u),
      gridStyles: Mt({ stroke: e.gridColor, strokeWidth: 1 }, e.gridStyles),
      axisStyles: {
        x: {
          top: {
            axisLabel: Mt({}, u, { dy: "-0.25em" }),
            axisLine: Mt(
              { stroke: e.gridColorDark, strokeWidth: 2 },
              e.xAxisLineStyles
            ),
            tickLabel: Mt({}, f, { dy: "-0.25em" }),
            tickLength: e.tickLength,
            tickLine: Mt(
              { strokeWidth: 1, stroke: e.gridColor },
              e.xTickLineStyles
            ),
          },
          bottom: {
            axisLabel: Mt({}, u, { dy: "-0.25em" }),
            axisLine: Mt(
              { stroke: e.gridColorDark, strokeWidth: 2 },
              e.xAxisLineStyles
            ),
            tickLabel: Mt({}, f, { dy: "0.125em" }),
            tickLength: e.tickLength,
            tickLine: Mt(
              { strokeWidth: 1, stroke: e.gridColor },
              e.xTickLineStyles
            ),
          },
        },
        y: {
          left: {
            axisLabel: Mt({}, u, { dx: "-1.25em" }),
            axisLine: Mt(
              { stroke: e.gridColor, strokeWidth: 1 },
              e.yAxisLineStyles
            ),
            tickLabel: Mt({}, f, {
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            }),
            tickLength: e.tickLength,
            tickLine: Mt(
              { strokeWidth: 1, stroke: e.gridColor },
              e.yTickLineStyles
            ),
          },
          right: {
            axisLabel: Mt({}, u, { dx: "1.25em" }),
            axisLine: Mt(
              { stroke: e.gridColor, strokeWidth: 1 },
              e.yAxisLineStyles
            ),
            tickLabel: Mt({}, f, {
              textAnchor: "start",
              dx: "0.25em",
              dy: "0.25em",
            }),
            tickLength: e.tickLength,
            tickLine: Mt(
              { strokeWidth: 1, stroke: e.gridColor },
              e.yTickLineStyles
            ),
          },
        },
      },
    };
  }
  const rC = nC({
    backgroundColor: "#fff",
    colors: tC,
    tickLength: 4,
    svgLabelSmall: { fill: ko[7] },
    svgLabelBig: { fill: ko[9] },
    gridColor: ko[5],
    gridColorDark: ko[9],
  });
  var iC = Tn.default.createContext(rC);
  const oC = iC;
  function Jg(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var aC = (function () {
    function e() {
      Jg(this, "registry", {}), Jg(this, "registryKeys", []);
    }
    var t = e.prototype;
    return (
      (t.registerData = function (r) {
        var i = this,
          o = Array.isArray(r) ? r : [r];
        o.forEach(function (a) {
          a.key in i.registry &&
            i.registry[a.key] != null &&
            console.debug("Overriding data registry key", a.key),
            (i.registry[a.key] = a),
            (i.registryKeys = Object.keys(i.registry));
        });
      }),
      (t.unregisterData = function (r) {
        var i = this,
          o = Array.isArray(r) ? r : [r];
        o.forEach(function (a) {
          delete i.registry[a], (i.registryKeys = Object.keys(i.registry));
        });
      }),
      (t.entries = function () {
        return Object.values(this.registry);
      }),
      (t.get = function (r) {
        return this.registry[r];
      }),
      (t.keys = function () {
        return this.registryKeys;
      }),
      e
    );
  })();
  function uC() {
    var e = Y.useState(Math.random()),
      t = e[1],
      n = Y.useMemo(function () {
        return new aC();
      }, []);
    return Y.useMemo(
      function () {
        return {
          registerData: function () {
            n.registerData.apply(n, arguments), t(Math.random());
          },
          unregisterData: function () {
            n.unregisterData.apply(n, arguments), t(Math.random());
          },
          entries: function () {
            return n.entries();
          },
          get: function (i) {
            return n.get(i);
          },
          keys: function () {
            return n.keys();
          },
        };
      },
      [n]
    );
  }
  var Ec = {
    width: 0,
    height: 0,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  function sC(e) {
    var t = Y.useState({
        width: (e == null ? void 0 : e.width) == null ? Ec.width : e.width,
        height: (e == null ? void 0 : e.height) == null ? Ec.height : e.height,
        margin: (e == null ? void 0 : e.margin) == null ? Ec.margin : e.margin,
      }),
      n = t[0],
      r = t[1],
      i = Y.useCallback(
        function (o) {
          (o.width !== n.width ||
            o.height !== n.height ||
            o.margin.left !== n.margin.left ||
            o.margin.right !== n.margin.right ||
            o.margin.top !== n.margin.top ||
            o.margin.bottom !== n.margin.bottom) &&
            r(o);
        },
        [
          n.width,
          n.height,
          n.margin.left,
          n.margin.right,
          n.margin.bottom,
          n.margin.top,
        ]
      );
    return [n, i];
  }
  function Mc(e) {
    return (
      (e == null ? void 0 : e.type) === "band" ||
      (e == null ? void 0 : e.type) === "ordinal" ||
      (e == null ? void 0 : e.type) === "point"
    );
  }
  function Ai() {
    return (
      (Ai =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Ai.apply(this, arguments)
    );
  }
  function lC(e) {
    var t = e.dataRegistry,
      n = e.xRange,
      r = e.xScaleConfig,
      i = e.yRange,
      o = e.yScaleConfig,
      a = t.keys(),
      u = n[0],
      f = n[1],
      c = i[0],
      p = i[1],
      h = Y.useMemo(
        function () {
          var T = a.map(function (k) {
              return t.get(k);
            }),
            _ = T.reduce(function (k, F) {
              return F
                ? k.concat(
                    F.data.map(function (N) {
                      return F.xAccessor(N);
                    })
                  )
                : k;
            }, []);
          if (_.length !== 0) {
            var P = Mc(r) ? _ : ih(_),
              I = Nv(r)
                ? Ba(Ai({ range: [u, f], domain: P, zero: !0 }, r))
                : Ba(Ai({ range: [u, f], domain: P }, r));
            return (
              T.forEach(function (k) {
                k != null && k.xScale && (I = k.xScale(I));
              }),
              I
            );
          }
        },
        [t, r, a, u, f]
      ),
      w = Y.useMemo(
        function () {
          var T = a.map(function (k) {
              return t.get(k);
            }),
            _ = T.reduce(function (k, F) {
              return F
                ? k.concat(
                    F.data.map(function (N) {
                      return F.yAccessor(N);
                    })
                  )
                : k;
            }, []);
          if (_.length !== 0) {
            var P = Mc(o) ? _ : ih(_),
              I = Nv(o)
                ? Ba(Ai({ range: [c, p], domain: P, zero: !0 }, o))
                : Ba(Ai({ range: [c, p], domain: P }, o));
            return (
              T.forEach(function (k) {
                k != null && k.yScale && (I = k.yScale(I));
              }),
              I
            );
          }
        },
        [t, o, a, c, p]
      );
    return { xScale: h, yScale: w };
  }
  var cC =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/providers/DataProvider.js";
  function em(e) {
    var t = e.initialDimensions,
      n = e.theme,
      r = e.xScale,
      i = e.yScale,
      o = e.children,
      a = e.horizontal,
      u = a === void 0 ? "auto" : a,
      f = Y.useContext(oC),
      c = n || f,
      p = sC(t),
      h = p[0],
      w = h.width,
      T = h.height,
      _ = h.margin,
      P = p[1],
      I = Math.max(0, w - _.left - _.right),
      k = Math.max(0, T - _.top - _.bottom),
      F = uC(),
      N = lC({
        dataRegistry: F,
        xScaleConfig: r,
        yScaleConfig: i,
        xRange: [_.left, Math.max(0, w - _.right)],
        yRange: [Math.max(0, T - _.bottom), _.top],
      }),
      G = N.xScale,
      M = N.yScale,
      D = F.keys(),
      ne = Y.useMemo(
        function () {
          return XR({ domain: D, range: c.colors });
        },
        [D, c.colors]
      ),
      Z = u === "auto" ? Mc(i) || i.type === "time" || i.type === "utc" : u;
    return L(
      br.Provider,
      {
        value: {
          dataRegistry: F,
          registerData: F.registerData,
          unregisterData: F.unregisterData,
          xScale: G,
          yScale: M,
          colorScale: ne,
          theme: c,
          width: w,
          height: T,
          margin: _,
          innerWidth: I,
          innerHeight: k,
          setDimensions: P,
          horizontal: Z,
        },
        children: o,
      },
      void 0,
      !1,
      { fileName: cC, lineNumber: 55, columnNumber: 23 },
      this
    );
  }
  em.propTypes = {
    children: Ae.exports.node.isRequired,
    horizontal: Ae.exports.oneOfType([
      Ae.exports.bool,
      Ae.exports.oneOf(["auto"]),
    ]),
  };
  function tm(e) {
    var t = e.source,
      n = e.onPointerOut,
      r = n === void 0 ? !0 : n,
      i = e.onPointerMove,
      o = i === void 0 ? !0 : i,
      a = e.onPointerUp,
      u = a === void 0 ? !0 : a,
      f = e.onPointerDown,
      c = f === void 0 ? !0 : f,
      p = e.onFocus,
      h = p === void 0 ? !1 : p,
      w = e.onBlur,
      T = w === void 0 ? !1 : w,
      _ = Cr(),
      P = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("pointermove", M, t);
        },
        [_, t]
      ),
      I = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("pointerout", M, t);
        },
        [_, t]
      ),
      k = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("pointerup", M, t);
        },
        [_, t]
      ),
      F = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("pointerdown", M, t);
        },
        [_, t]
      ),
      N = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("focus", M, t);
        },
        [_, t]
      ),
      G = Y.useCallback(
        function (M) {
          return _ == null ? void 0 : _("blur", M, t);
        },
        [_, t]
      );
    return {
      onPointerMove: o ? P : void 0,
      onFocus: h ? N : void 0,
      onBlur: T ? G : void 0,
      onPointerOut: r ? I : void 0,
      onPointerUp: u ? k : void 0,
      onPointerDown: c ? F : void 0,
    };
  }
  var fC = "AREASERIES_EVENT_SOURCE",
    dC = "GLYPHSERIES_EVENT_SOURCE",
    iu = "XYCHART_EVENT_SOURCE";
  function nm(e) {
    return !!e && ("clientX" in e || "changedTouches" in e);
  }
  function rm(e) {
    var t = e.scale,
      n = e.accessor,
      r = e.scaledValue,
      i = e.data,
      o = t,
      a,
      u;
    if ("invert" in o && typeof o.invert == "function") {
      var f = fa(n).left,
        c = Number(o.invert(r)),
        p = f(i, c),
        h = i[p - 1],
        w = i[p];
      (a = !h || Math.abs(c - n(h)) > Math.abs(c - n(w)) ? w : h),
        (u = a === h ? p - 1 : p);
    } else if ("step" in o && typeof o.step < "u") {
      var T = t.domain(),
        _ = t.range().map(Number),
        P = [].concat(_).sort(function (D, ne) {
          return D - ne;
        }),
        I = lh(P[0], P[1], o.step()),
        k = Mb(I, r),
        F = _[0] < _[1] ? T : T.reverse(),
        N = F[k - 1],
        G = i.findIndex(function (D) {
          return String(n(D)) === String(N);
        });
      (a = i[G]), (u = G);
    } else
      return (
        console.warn(
          "[visx/xychart/findNearestDatum] encountered incompatible scale type, bailing"
        ),
        null
      );
    if (a == null || u == null) return null;
    var M = Math.abs(Number(o(n(a))) - r);
    return { datum: a, index: u, distance: M };
  }
  function hC(e) {
    var t = e.xScale,
      n = e.xAccessor,
      r = e.yScale,
      i = e.yAccessor,
      o = e.point,
      a = e.data;
    if (!o) return null;
    var u = rm({ scale: t, accessor: n, scaledValue: o.x, data: a });
    return u
      ? {
          datum: u.datum,
          index: u.index,
          distanceX: u.distance,
          distanceY: Math.abs(Number(r(i(u.datum))) - o.y),
        }
      : null;
  }
  function pC(e) {
    var t = e.yScale,
      n = e.yAccessor,
      r = e.xScale,
      i = e.xAccessor,
      o = e.point,
      a = e.data;
    if (!o) return null;
    var u = rm({ scale: t, accessor: n, scaledValue: o.y, data: a });
    return u
      ? {
          datum: u.datum,
          index: u.index,
          distanceY: u.distance,
          distanceX: Math.abs(Number(r(i(u.datum))) - o.x),
        }
      : null;
  }
  function Oc() {
    return (
      (Oc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Oc.apply(this, arguments)
    );
  }
  var Ac = "__POINTER_EVENTS_ALL",
    ou = "__POINTER_EVENTS_NEAREST";
  function im(e) {
    var t = e.dataKey,
      n = e.findNearestDatum,
      r = e.onBlur,
      i = e.onFocus,
      o = e.onPointerMove,
      a = e.onPointerOut,
      u = e.onPointerUp,
      f = e.onPointerDown,
      c = e.allowedSources,
      p = Y.useContext(br),
      h = p.width,
      w = p.height,
      T = p.horizontal,
      _ = p.dataRegistry,
      P = p.xScale,
      I = p.yScale,
      k = n || (T ? pC : hC),
      F = Y.useCallback(
        function (he) {
          var me = he || {},
            ie = me.svgPoint,
            te = me.event,
            we = {},
            ke = null,
            st = 1 / 0;
          if (he && te && ie && h && w && P && I) {
            var Ue,
              lt = t === ou || t === Ac,
              ct = lt
                ? (Ue = _ == null ? void 0 : _.keys()) != null
                  ? Ue
                  : []
                : Array.isArray(t)
                ? t
                : [t];
            ct.forEach(function (U) {
              var se = _ == null ? void 0 : _.get(U);
              if (se) {
                var Ne = k({
                  dataKey: U,
                  data: se.data,
                  height: w,
                  point: ie,
                  width: h,
                  xAccessor: se.xAccessor,
                  xScale: P,
                  yAccessor: se.yAccessor,
                  yScale: I,
                });
                if (
                  Ne &&
                  ((we[U] = Oc({ key: U, svgPoint: ie, event: te }, Ne)),
                  t === ou)
                ) {
                  var $e,
                    Te,
                    Ce = Math.sqrt(
                      (($e = Ne.distanceX) != null ? $e : Math.pow(1 / 0, 2)) +
                        ((Te = Ne.distanceY) != null ? Te : Math.pow(1 / 0, 2))
                    );
                  (ke = Ce < st ? we[U] : ke), (st = Math.min(st, Ce));
                }
              }
            });
            var ht =
              t === ou
                ? [ke]
                : t === Ac || Array.isArray(t)
                ? Object.values(we)
                : [we[t]];
            return ht.filter(function (U) {
              return U;
            });
          }
          return [];
        },
        [t, _, P, I, h, w, k]
      ),
      N = Y.useCallback(
        function (he) {
          o &&
            F(he).forEach(function (me) {
              return o(me);
            });
        },
        [F, o]
      ),
      G = Y.useCallback(
        function (he) {
          u &&
            F(he).forEach(function (me) {
              return u(me);
            });
        },
        [F, u]
      ),
      M = Y.useCallback(
        function (he) {
          f &&
            F(he).forEach(function (me) {
              return f(me);
            });
        },
        [F, f]
      ),
      D = Y.useCallback(
        function (he) {
          i &&
            F(he).forEach(function (me) {
              return i(me);
            });
        },
        [F, i]
      ),
      ne = Y.useCallback(
        function (he) {
          var me = he == null ? void 0 : he.event;
          me && nm(me) && a && a(me);
        },
        [a]
      ),
      Z = Y.useCallback(
        function (he) {
          var me = he == null ? void 0 : he.event;
          me && !nm(me) && r && r(me);
        },
        [r]
      );
    Cr("pointermove", o ? N : void 0, c),
      Cr("pointerout", a ? ne : void 0, c),
      Cr("pointerup", u ? G : void 0, c),
      Cr("pointerdown", f ? M : void 0, c),
      Cr("focus", i ? D : void 0, c),
      Cr("blur", r ? Z : void 0, c);
  }
  var Vn =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/XYChart.js",
    vC = { top: 50, right: 50, bottom: 50, left: 50 },
    gC = [iu];
  function ki(e) {
    var t = e.accessibilityLabel,
      n = t === void 0 ? "XYChart" : t,
      r = e.captureEvents,
      i = r === void 0 ? !0 : r,
      o = e.children,
      a = e.height,
      u = e.horizontal,
      f = e.margin,
      c = f === void 0 ? vC : f,
      p = e.onPointerMove,
      h = e.onPointerOut,
      w = e.onPointerUp,
      T = e.onPointerDown,
      _ = e.pointerEventsDataKey,
      P = _ === void 0 ? "nearest" : _,
      I = e.theme,
      k = e.width,
      F = e.xScale,
      N = e.yScale,
      G = Y.useContext(br),
      M = G.setDimensions,
      D = Y.useContext(Mo),
      ne = Cr();
    Y.useEffect(
      function () {
        M &&
          k != null &&
          a != null &&
          k > 0 &&
          a > 0 &&
          M({ width: k, height: a, margin: c });
      },
      [M, k, a, c]
    );
    var Z = tm({ source: iu });
    return (
      im({
        dataKey: P === "nearest" ? ou : Ac,
        onPointerMove: p,
        onPointerOut: h,
        onPointerUp: w,
        onPointerDown: T,
        allowedSources: gC,
      }),
      M
        ? k == null || a == null
          ? L(
              KS,
              {
                children: function (he) {
                  return L(
                    ki,
                    {
                      ...e,
                      width: e.width == null ? he.width : e.width,
                      height: e.height == null ? he.height : e.height,
                    },
                    void 0,
                    !1,
                    { fileName: Vn, lineNumber: 93, columnNumber: 27 },
                    this
                  );
                },
              },
              void 0,
              !1,
              { fileName: Vn, lineNumber: 92, columnNumber: 25 },
              this
            )
          : D == null
          ? L(
              qg,
              {
                children: L(
                  ki,
                  { ...e },
                  void 0,
                  !1,
                  { fileName: Vn, lineNumber: 101, columnNumber: 81 },
                  this
                ),
              },
              void 0,
              !1,
              { fileName: Vn, lineNumber: 101, columnNumber: 25 },
              this
            )
          : ne == null
          ? L(
              aR,
              {
                children: L(
                  ki,
                  { ...e },
                  void 0,
                  !1,
                  { fileName: Vn, lineNumber: 106, columnNumber: 86 },
                  this
                ),
              },
              void 0,
              !1,
              { fileName: Vn, lineNumber: 106, columnNumber: 25 },
              this
            )
          : k > 0 && a > 0
          ? L(
              "svg",
              {
                width: k,
                height: a,
                "aria-label": n,
                children: [
                  o,
                  i &&
                    L(
                      "rect",
                      {
                        x: c.left,
                        y: c.top,
                        width: k - c.left - c.right,
                        height: a - c.top - c.bottom,
                        fill: "transparent",
                        ...Z,
                      },
                      void 0,
                      !1,
                      { fileName: Vn, lineNumber: 113, columnNumber: 46 },
                      this
                    ),
                ],
              },
              void 0,
              !0,
              { fileName: Vn, lineNumber: 109, columnNumber: 49 },
              this
            )
          : null
        : !F || !N
        ? (console.warn(
            "[@visx/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart."
          ),
          null)
        : L(
            em,
            {
              xScale: F,
              yScale: N,
              theme: I,
              initialDimensions: { width: k, height: a, margin: c },
              horizontal: u,
              children: L(
                ki,
                { ...e },
                void 0,
                !1,
                { fileName: Vn, lineNumber: 88, columnNumber: 21 },
                this
              ),
            },
            void 0,
            !1,
            { fileName: Vn, lineNumber: 78, columnNumber: 25 },
            this
          )
    );
  }
  ki.propTypes = {
    accessibilityLabel: Ae.exports.string,
    captureEvents: Ae.exports.bool,
    width: Ae.exports.number,
    height: Ae.exports.number,
    children: Ae.exports.node.isRequired,
    horizontal: Ae.exports.oneOfType([
      Ae.exports.bool,
      Ae.exports.oneOf(["auto"]),
    ]),
    onPointerMove: Ae.exports.func,
    onPointerOut: Ae.exports.func,
    onPointerUp: Ae.exports.func,
    onPointerDown: Ae.exports.func,
    pointerEventsDataKey: Ae.exports.oneOf(["all", "nearest"]),
  };
  var ur = {};
  const kc = ji(Tb);
  var $c = {};
  ($c.__esModule = !0), ($c.default = mC);
  function mC(e, t) {
    e(t);
  }
  var ti = {};
  (ti.__esModule = !0),
    (ti.default = bC),
    (ti.STACK_ORDER_NAMES = ti.STACK_ORDERS = void 0);
  var $o = kc,
    au = {
      ascending: $o.stackOrderAscending,
      descending: $o.stackOrderDescending,
      insideout: $o.stackOrderInsideOut,
      none: $o.stackOrderNone,
      reverse: $o.stackOrderReverse,
    };
  ti.STACK_ORDERS = au;
  var yC = Object.keys(au);
  ti.STACK_ORDER_NAMES = yC;
  function bC(e) {
    return (e && au[e]) || au.none;
  }
  var ni = {};
  (ni.__esModule = !0),
    (ni.default = xC),
    (ni.STACK_OFFSET_NAMES = ni.STACK_OFFSETS = void 0);
  var Fo = kc,
    uu = {
      expand: Fo.stackOffsetExpand,
      diverging: Fo.stackOffsetDiverging,
      none: Fo.stackOffsetNone,
      silhouette: Fo.stackOffsetSilhouette,
      wiggle: Fo.stackOffsetWiggle,
    };
  ni.STACK_OFFSETS = uu;
  var wC = Object.keys(uu);
  ni.STACK_OFFSET_NAMES = wC;
  function xC(e) {
    return (e && uu[e]) || uu.none;
  }
  (ur.__esModule = !0),
    (ur.arc = RC),
    (ur.area = CC),
    (ur.line = TC),
    (ur.pie = PC),
    (ur.radialLine = NC),
    (ur.stack = EC);
  var $i = kc,
    It = Fc($c),
    _C = Fc(ti),
    SC = Fc(ni);
  function Fc(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function RC(e) {
    var t = e === void 0 ? {} : e,
      n = t.innerRadius,
      r = t.outerRadius,
      i = t.cornerRadius,
      o = t.startAngle,
      a = t.endAngle,
      u = t.padAngle,
      f = t.padRadius,
      c = (0, $i.arc)();
    return (
      n != null && (0, It.default)(c.innerRadius, n),
      r != null && (0, It.default)(c.outerRadius, r),
      i != null && (0, It.default)(c.cornerRadius, i),
      o != null && (0, It.default)(c.startAngle, o),
      a != null && (0, It.default)(c.endAngle, a),
      u != null && (0, It.default)(c.padAngle, u),
      f != null && (0, It.default)(c.padRadius, f),
      c
    );
  }
  function CC(e) {
    var t = e === void 0 ? {} : e,
      n = t.x,
      r = t.x0,
      i = t.x1,
      o = t.y,
      a = t.y0,
      u = t.y1,
      f = t.defined,
      c = t.curve,
      p = (0, $i.area)();
    return (
      n && (0, It.default)(p.x, n),
      r && (0, It.default)(p.x0, r),
      i && (0, It.default)(p.x1, i),
      o && (0, It.default)(p.y, o),
      a && (0, It.default)(p.y0, a),
      u && (0, It.default)(p.y1, u),
      f && p.defined(f),
      c && p.curve(c),
      p
    );
  }
  function TC(e) {
    var t = e === void 0 ? {} : e,
      n = t.x,
      r = t.y,
      i = t.defined,
      o = t.curve,
      a = (0, $i.line)();
    return (
      n && (0, It.default)(a.x, n),
      r && (0, It.default)(a.y, r),
      i && a.defined(i),
      o && a.curve(o),
      a
    );
  }
  function PC(e) {
    var t = e === void 0 ? {} : e,
      n = t.startAngle,
      r = t.endAngle,
      i = t.padAngle,
      o = t.value,
      a = t.sort,
      u = t.sortValues,
      f = (0, $i.pie)();
    return (
      (a === null || a != null) && f.sort(a),
      (u === null || u != null) && f.sortValues(u),
      o != null && f.value(o),
      i != null && (0, It.default)(f.padAngle, i),
      n != null && (0, It.default)(f.startAngle, n),
      r != null && (0, It.default)(f.endAngle, r),
      f
    );
  }
  function NC(e) {
    var t = e === void 0 ? {} : e,
      n = t.angle,
      r = t.radius,
      i = t.defined,
      o = t.curve,
      a = (0, $i.radialLine)();
    return (
      n && (0, It.default)(a.angle, n),
      r && (0, It.default)(a.radius, r),
      i && a.defined(i),
      o && a.curve(o),
      a
    );
  }
  function EC(e) {
    var t = e.keys,
      n = e.value,
      r = e.order,
      i = e.offset,
      o = (0, $i.stack)();
    return (
      t && o.keys(t),
      n && (0, It.default)(o.value, n),
      r && o.order((0, _C.default)(r)),
      i && o.offset((0, SC.default)(i)),
      o
    );
  }
  var MC = FC,
    Ic = om(Tn.default),
    OC = om(na.exports),
    AC = ur,
    kC = [
      "children",
      "x",
      "x0",
      "x1",
      "y",
      "y0",
      "y1",
      "data",
      "defined",
      "className",
      "curve",
      "innerRef",
    ];
  function om(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function Bc() {
    return (
      (Bc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Bc.apply(this, arguments)
    );
  }
  function $C(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function FC(e) {
    var t = e.children,
      n = e.x,
      r = e.x0,
      i = e.x1,
      o = e.y,
      a = e.y0,
      u = e.y1,
      f = e.data,
      c = f === void 0 ? [] : f,
      p = e.defined,
      h =
        p === void 0
          ? function () {
              return !0;
            }
          : p,
      w = e.className,
      T = e.curve,
      _ = e.innerRef,
      P = $C(e, kC),
      I = (0, AC.area)({
        x: n,
        x0: r,
        x1: i,
        y: o,
        y0: a,
        y1: u,
        defined: h,
        curve: T,
      });
    return t
      ? Ic.default.createElement(Ic.default.Fragment, null, t({ path: I }))
      : Ic.default.createElement(
          "path",
          Bc(
            {
              ref: _,
              className: (0, OC.default)("visx-area", w),
              d: I(c) || "",
            },
            P
          )
        );
  }
  var IC = GC,
    Dc = am(Tn.default),
    BC = am(na.exports),
    DC = ur,
    zC = [
      "children",
      "data",
      "x",
      "y",
      "fill",
      "className",
      "curve",
      "innerRef",
      "defined",
    ];
  function am(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function zc() {
    return (
      (zc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      zc.apply(this, arguments)
    );
  }
  function LC(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function GC(e) {
    var t = e.children,
      n = e.data,
      r = n === void 0 ? [] : n,
      i = e.x,
      o = e.y,
      a = e.fill,
      u = a === void 0 ? "transparent" : a,
      f = e.className,
      c = e.curve,
      p = e.innerRef,
      h = e.defined,
      w =
        h === void 0
          ? function () {
              return !0;
            }
          : h,
      T = LC(e, zC),
      _ = (0, DC.line)({ x: i, y: o, defined: w, curve: c });
    return t
      ? Dc.default.createElement(Dc.default.Fragment, null, t({ path: _ }))
      : Dc.default.createElement(
          "path",
          zc(
            {
              ref: p,
              className: (0, BC.default)("visx-linepath", f),
              d: _(r) || "",
              fill: u,
              strokeLinecap: "round",
            },
            T
          )
        );
  }
  var jC =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/enhancers/withRegisteredData.js";
  function HC(e) {
    function t(n) {
      var r = n.dataKey,
        i = n.data,
        o = n.xAccessor,
        a = n.yAccessor,
        u = Y.useContext(br),
        f = u.xScale,
        c = u.yScale,
        p = u.dataRegistry;
      Y.useEffect(
        function () {
          return (
            p &&
              p.registerData({ key: r, data: i, xAccessor: o, yAccessor: a }),
            function () {
              return p == null ? void 0 : p.unregisterData(r);
            }
          );
        },
        [p, r, i, o, a]
      );
      var h = p == null ? void 0 : p.get(r);
      if (!f || !c || !h) return null;
      var w = e;
      return L(
        w,
        {
          ...n,
          xScale: f,
          yScale: c,
          data: h.data,
          xAccessor: h.xAccessor,
          yAccessor: h.yAccessor,
        },
        void 0,
        !1,
        { fileName: jC, lineNumber: 46, columnNumber: 25 },
        this
      );
    }
    return t;
  }
  function Fi(e, t, n) {
    return (
      n === void 0 && (n = "center"),
      function (r) {
        var i = e(t(r));
        if (Jt(i)) {
          var o = (n === "start" ? 0 : _l(e)) / (n === "center" ? 2 : 1);
          return i + o;
        }
        return NaN;
      }
    );
  }
  function WC(e) {
    var t = e.range().map(function (c) {
        var p;
        return (p = Zx(c)) != null ? p : 0;
      }),
      n = t[0],
      r = t[1],
      i = n != null && r != null && r < n,
      o = e(0),
      a = i ? [r, n] : [n, r],
      u = a[0],
      f = a[1];
    return i
      ? Jt(o)
        ? Math.min(Math.max(u, o), f)
        : f
      : Jt(o)
      ? Math.max(o, u)
      : u;
  }
  function um(e) {
    var t,
      n = e.dataKey,
      r = e.enableEvents,
      i = e.findNearestDatum,
      o = e.onBlur,
      a = e.onFocus,
      u = e.onPointerMove,
      f = e.onPointerOut,
      c = e.onPointerUp,
      p = e.onPointerDown,
      h = e.source,
      w = e.allowedSources,
      T = (t = Y.useContext(Mo)) != null ? t : {},
      _ = T.showTooltip,
      P = T.hideTooltip,
      I = Y.useCallback(
        function (M) {
          _(M), u && u(M);
        },
        [_, u]
      ),
      k = Y.useCallback(
        function (M) {
          _(M), a && a(M);
        },
        [_, a]
      ),
      F = Y.useCallback(
        function (M) {
          P(), M && f && f(M);
        },
        [P, f]
      ),
      N = Y.useCallback(
        function (M) {
          P(), M && o && o(M);
        },
        [P, o]
      ),
      G = Y.useCallback(
        function (M) {
          _(M), p && p(M);
        },
        [_, p]
      );
    return (
      im({
        dataKey: n,
        findNearestDatum: i,
        onBlur: r ? N : void 0,
        onFocus: r ? k : void 0,
        onPointerMove: r ? I : void 0,
        onPointerOut: r ? F : void 0,
        onPointerUp: r ? c : void 0,
        onPointerDown: r ? G : void 0,
        allowedSources: w,
      }),
      tm({
        source: h,
        onBlur: !!o && r,
        onFocus: !!a && r,
        onPointerMove: !!u && r,
        onPointerOut: !!f && r,
        onPointerUp: !!c && r,
        onPointerDown: !!p && r,
      })
    );
  }
  function Lc() {
    return (
      (Lc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Lc.apply(this, arguments)
    );
  }
  function sm(e) {
    var t,
      n,
      r,
      i = e.colorAccessor,
      o = e.data,
      a = e.dataKey,
      u = e.onBlur,
      f = e.onFocus,
      c = e.onPointerMove,
      p = e.onPointerOut,
      h = e.onPointerUp,
      w = e.onPointerDown,
      T = e.enableEvents,
      _ = T === void 0 ? !0 : T,
      P = e.renderGlyphs,
      I = e.size,
      k = I === void 0 ? 8 : I,
      F = e.xAccessor,
      N = e.xScale,
      G = e.yAccessor,
      M = e.yScale,
      D = Y.useContext(br),
      ne = D.colorScale,
      Z = D.theme,
      he = D.horizontal,
      me = Y.useCallback(Fi(N, F), [N, F]),
      ie = Y.useCallback(Fi(M, G), [M, G]),
      te =
        (t =
          (n = ne == null ? void 0 : ne(a)) != null
            ? n
            : Z == null || (r = Z.colors) == null
            ? void 0
            : r[0]) != null
          ? t
          : "#222",
      we = dC + "-" + a,
      ke = um({
        dataKey: a,
        enableEvents: _,
        onBlur: u,
        onFocus: f,
        onPointerMove: c,
        onPointerOut: p,
        onPointerUp: h,
        onPointerDown: w,
        source: we,
        allowedSources: [iu, we],
      }),
      st = Y.useMemo(
        function () {
          return o
            .map(function (Ue, lt) {
              var ct,
                ht = me(Ue);
              if (!Jt(ht)) return null;
              var U = ie(Ue);
              return Jt(U)
                ? {
                    key: "" + lt,
                    x: ht,
                    y: U,
                    color:
                      (ct = i == null ? void 0 : i(Ue, lt)) != null ? ct : te,
                    size: typeof k == "function" ? k(Ue) : k,
                    datum: Ue,
                  }
                : null;
            })
            .filter(function (Ue) {
              return Ue;
            });
        },
        [te, i, o, me, ie, k]
      );
    return L(
      Nn,
      {
        children: P(
          Lc({ glyphs: st, xScale: N, yScale: M, horizontal: he }, ke)
        ),
      },
      void 0,
      !1
    );
  }
  sm.propTypes = {
    colorAccessor: Ae.exports.func,
    size: Ae.exports.oneOfType([Ae.exports.number, Ae.exports.func]),
    renderGlyphs: Ae.exports.func.isRequired,
  };
  var VC =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/defaultRenderGlyph.js";
  function UC(e) {
    var t = e.key,
      n = e.color,
      r = e.x,
      i = e.y,
      o = e.size,
      a = e.onBlur,
      u = e.onFocus,
      f = e.onPointerMove,
      c = e.onPointerOut,
      p = e.onPointerUp;
    return L(
      "circle",
      {
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
        onPointerUp: p,
      },
      t,
      !1,
      { fileName: VC, lineNumber: 13, columnNumber: 23 },
      this
    );
  }
  var Io =
      "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/private/BaseAreaSeries.js",
    qC = [
      "PathComponent",
      "curve",
      "data",
      "dataKey",
      "lineProps",
      "onBlur",
      "onFocus",
      "onPointerMove",
      "onPointerOut",
      "onPointerUp",
      "onPointerDown",
      "enableEvents",
      "renderLine",
      "xAccessor",
      "x0Accessor",
      "xScale",
      "yAccessor",
      "y0Accessor",
      "yScale",
    ];
  function Gc() {
    return (
      (Gc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Gc.apply(this, arguments)
    );
  }
  function YC(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function lm(e) {
    var t,
      n,
      r,
      i = e.PathComponent,
      o = i === void 0 ? "path" : i,
      a = e.curve,
      u = e.data,
      f = e.dataKey,
      c = e.lineProps,
      p = e.onBlur,
      h = e.onFocus,
      w = e.onPointerMove,
      T = e.onPointerOut,
      _ = e.onPointerUp,
      P = e.onPointerDown,
      I = e.enableEvents,
      k = I === void 0 ? !0 : I,
      F = e.renderLine,
      N = F === void 0 ? !0 : F,
      G = e.xAccessor,
      M = e.x0Accessor,
      D = e.xScale,
      ne = e.yAccessor,
      Z = e.y0Accessor,
      he = e.yScale,
      me = YC(e, qC),
      ie = Y.useContext(br),
      te = ie.colorScale,
      we = ie.theme,
      ke = ie.horizontal,
      st = Y.useMemo(
        function () {
          return M ? Fi(D, M) : void 0;
        },
        [D, M]
      ),
      Ue = Y.useCallback(Fi(D, G), [D, G]),
      lt = Y.useMemo(
        function () {
          return Z ? Fi(he, Z) : void 0;
        },
        [he, Z]
      ),
      ct = Y.useCallback(Fi(he, ne), [he, ne]),
      ht = Y.useCallback(
        function (Ee) {
          return Jt(D(G(Ee))) && Jt(he(ne(Ee)));
        },
        [D, G, he, ne]
      ),
      U =
        (t =
          (n = te == null ? void 0 : te(f)) != null
            ? n
            : we == null || (r = we.colors) == null
            ? void 0
            : r[0]) != null
          ? t
          : "#222",
      se = fC + "-" + f,
      Ne = um({
        dataKey: f,
        enableEvents: k,
        onBlur: p,
        onFocus: h,
        onPointerMove: w,
        onPointerOut: T,
        onPointerUp: _,
        onPointerDown: P,
        source: se,
        allowedSources: [iu, se],
      }),
      $e = Y.useMemo(
        function () {
          var Ee = WC(ke ? D : he);
          return ke
            ? { x0: st != null ? st : Ee, x1: Ue, y: ct }
            : { x: Ue, y0: lt != null ? lt : Ee, y1: ct };
        },
        [D, he, ke, Ue, ct, st, lt]
      ),
      Te = Boolean(h || p),
      Ce = Y.useCallback(
        function (Ee) {
          var De = Ee.glyphs;
          return Te
            ? De.map(function (Ge) {
                return L(
                  Nn,
                  {
                    children: UC(
                      Gc({}, Ge, {
                        color: "transparent",
                        onFocus: Ne.onFocus,
                        onBlur: Ne.onBlur,
                      })
                    ),
                  },
                  void 0,
                  !1
                );
              })
            : null;
        },
        [Te, Ne.onFocus, Ne.onBlur]
      );
    return L(
      Nn,
      {
        children: [
          L(
            MC,
            {
              ...$e,
              ...me,
              curve: a,
              defined: ht,
              children: function (Ee) {
                var De = Ee.path;
                return L(
                  o,
                  {
                    className: "visx-area",
                    stroke: "transparent",
                    fill: U,
                    strokeLinecap: "round",
                    ...me,
                    d: De(u) || "",
                    ...Ne,
                  },
                  void 0,
                  !1,
                  { fileName: Io, lineNumber: 110, columnNumber: 25 },
                  this
                );
              },
            },
            void 0,
            !1,
            { fileName: Io, lineNumber: 105, columnNumber: 78 },
            this
          ),
          N &&
            L(
              IC,
              {
                x: Ue,
                y: ct,
                defined: ht,
                curve: a,
                ...c,
                children: function (Ee) {
                  var De = Ee.path;
                  return L(
                    o,
                    {
                      className: "visx-line",
                      fill: "transparent",
                      stroke: U,
                      strokeWidth: 2,
                      pointerEvents: "none",
                      strokeLinecap: "round",
                      ...c,
                      d: De(u) || "",
                    },
                    void 0,
                    !1,
                    { fileName: Io, lineNumber: 126, columnNumber: 25 },
                    this
                  );
                },
              },
              void 0,
              !1,
              { fileName: Io, lineNumber: 119, columnNumber: 34 },
              this
            ),
          Te &&
            L(
              sm,
              {
                dataKey: f,
                data: u,
                xAccessor: G,
                yAccessor: ne,
                xScale: D,
                yScale: he,
                renderGlyphs: Ce,
              },
              void 0,
              !1,
              { fileName: Io, lineNumber: 137, columnNumber: 42 },
              this
            ),
        ],
      },
      void 0,
      !0
    );
  }
  lm.propTypes = { renderLine: Ae.exports.bool };
  const XC = HC(lm);
  function KC(e, t) {
    const n = [],
      r = [];
    function i(o, a) {
      if (o.length === 1) n.push(o[0]), r.push(o[0]);
      else {
        const u = Array(o.length - 1);
        for (let f = 0; f < u.length; f++)
          f === 0 && n.push(o[0]),
            f === u.length - 1 && r.push(o[f + 1]),
            (u[f] = [
              (1 - a) * o[f][0] + a * o[f + 1][0],
              (1 - a) * o[f][1] + a * o[f + 1][1],
            ]);
        i(u, a);
      }
    }
    return e.length && i(e, t), { left: n, right: r.reverse() };
  }
  function QC(e) {
    const t = {};
    return (
      e.length === 4 && ((t.x2 = e[2][0]), (t.y2 = e[2][1])),
      e.length >= 3 && ((t.x1 = e[1][0]), (t.y1 = e[1][1])),
      (t.x = e[e.length - 1][0]),
      (t.y = e[e.length - 1][1]),
      e.length === 4
        ? (t.type = "C")
        : e.length === 3
        ? (t.type = "Q")
        : (t.type = "L"),
      t
    );
  }
  function ZC(e, t) {
    t = t || 2;
    const n = [];
    let r = e;
    const i = 1 / t;
    for (let o = 0; o < t - 1; o++) {
      const a = i / (1 - i * o),
        u = KC(r, a);
      n.push(u.left), (r = u.right);
    }
    return n.push(r), n;
  }
  function JC(e, t, n) {
    const r = [[e.x, e.y]];
    return (
      t.x1 != null && r.push([t.x1, t.y1]),
      t.x2 != null && r.push([t.x2, t.y2]),
      r.push([t.x, t.y]),
      ZC(r, n).map(QC)
    );
  }
  const eT = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g,
    Ii = {
      M: ["x", "y"],
      L: ["x", "y"],
      H: ["x"],
      V: ["y"],
      C: ["x1", "y1", "x2", "y2", "x", "y"],
      S: ["x2", "y2", "x", "y"],
      Q: ["x1", "y1", "x", "y"],
      T: ["x", "y"],
      A: ["rx", "ry", "xAxisRotation", "largeArcFlag", "sweepFlag", "x", "y"],
      Z: [],
    };
  Object.keys(Ii).forEach((e) => {
    Ii[e.toLowerCase()] = Ii[e];
  });
  function jc(e, t) {
    const n = Array(e);
    for (let r = 0; r < e; r++) n[r] = t;
    return n;
  }
  function tT(e) {
    return `${e.type}${Ii[e.type].map((t) => e[t]).join(",")}`;
  }
  function nT(e, t) {
    const n = { x1: "x", y1: "y", x2: "x", y2: "y" },
      r = ["xAxisRotation", "largeArcFlag", "sweepFlag"];
    if (e.type !== t.type && t.type.toUpperCase() !== "M") {
      const i = {};
      Object.keys(t).forEach((o) => {
        const a = t[o];
        let u = e[o];
        u === void 0 &&
          (r.includes(o)
            ? (u = a)
            : (u === void 0 && n[o] && (u = e[n[o]]), u === void 0 && (u = 0))),
          (i[o] = u);
      }),
        (i.type = t.type),
        (e = i);
    }
    return e;
  }
  function rT(e, t, n) {
    let r = [];
    if (t.type === "L" || t.type === "Q" || t.type === "C")
      r = r.concat(JC(e, t, n));
    else {
      const i = Object.assign({}, e);
      i.type === "M" && (i.type = "L"),
        (r = r.concat(jc(n - 1).map(() => i))),
        r.push(t);
    }
    return r;
  }
  function cm(e, t, n) {
    const r = e.length - 1,
      i = t.length - 1,
      o = r / i,
      u = jc(i)
        .reduce((f, c, p) => {
          let h = Math.floor(o * p);
          if (n && h < e.length - 1 && n(e[h], e[h + 1])) {
            const w = (o * p) % 1 < 0.5;
            f[h] &&
              (w
                ? h > 0
                  ? (h -= 1)
                  : h < e.length - 1 && (h += 1)
                : h < e.length - 1
                ? (h += 1)
                : h > 0 && (h -= 1));
          }
          return (f[h] = (f[h] || 0) + 1), f;
        }, [])
        .reduce((f, c, p) => {
          if (p === e.length - 1) {
            const h = jc(c, Object.assign({}, e[e.length - 1]));
            return (
              h[0].type === "M" &&
                h.forEach((w) => {
                  w.type = "L";
                }),
              f.concat(h)
            );
          }
          return f.concat(rT(e[p], e[p + 1], c));
        }, []);
    return u.unshift(e[0]), u;
  }
  function fm(e) {
    const t = (e || "").match(eT) || [],
      n = [];
    let r, i;
    for (let o = 0; o < t.length; ++o)
      if (((r = Ii[t[o]]), r)) {
        i = { type: t[o] };
        for (let a = 0; a < r.length; ++a) i[r[a]] = +t[o + a + 1];
        (o += r.length), n.push(i);
      }
    return n;
  }
  function iT(e, t, n) {
    let r = e == null ? [] : e.slice(),
      i = t == null ? [] : t.slice();
    if (!r.length && !i.length)
      return function () {
        return [];
      };
    const o =
      (r.length === 0 || r[r.length - 1].type === "Z") &&
      (i.length === 0 || i[i.length - 1].type === "Z");
    r.length > 0 && r[r.length - 1].type === "Z" && r.pop(),
      i.length > 0 && i[i.length - 1].type === "Z" && i.pop(),
      r.length ? i.length || i.push(r[0]) : r.push(i[0]),
      Math.abs(i.length - r.length) !== 0 &&
        (i.length > r.length
          ? (r = cm(r, i, n))
          : i.length < r.length && (i = cm(i, r, n))),
      (r = r.map((f, c) => nT(f, i[c])));
    const u = r.map((f) => ({ ...f }));
    return (
      o && u.push({ type: "Z" }),
      function (c) {
        if (c === 1) return t == null ? [] : t;
        if (c > 0)
          for (let p = 0; p < u.length; ++p) {
            const h = r[p],
              w = i[p],
              T = u[p];
            for (const _ of Ii[T.type])
              (T[_] = (1 - c) * h[_] + c * w[_]),
                (_ === "largeArcFlag" || _ === "sweepFlag") &&
                  (T[_] = Math.round(T[_]));
          }
        return u;
      }
    );
  }
  function oT(e, t, n) {
    let r = fm(e),
      i = fm(t);
    if (!r.length && !i.length)
      return function () {
        return "";
      };
    const o = iT(r, i, n);
    return function (u) {
      if (u === 1) return t == null ? "" : t;
      const f = o(u);
      let c = "";
      for (const p of f) c += tT(p);
      return c;
    };
  }
  var aT = ["d", "stroke", "fill"];
  function Hc() {
    return (
      (Hc =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Hc.apply(this, arguments)
    );
  }
  function uT(e, t) {
    if (e == null) return {};
    var n = {},
      r = Object.keys(e),
      i,
      o;
    for (o = 0; o < r.length; o++)
      (i = r[o]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
    return n;
  }
  function sT(e) {
    var t = e.d,
      n = e.stroke,
      r = n === void 0 ? "transparent" : n,
      i = e.fill,
      o = i === void 0 ? "transparent" : i,
      a = uT(e, aT),
      u = Y.useRef(t),
      f = Y.useCallback(
        es(function (T) {
          u.current = T;
        }, 50),
        []
      ),
      c = oT(u.current, t);
    f(t);
    var p = Pg({ from: { t: 0 }, to: { t: 1 }, reset: !0, delay: 0 }),
      h = p.t,
      w = Pg({ stroke: r, fill: o });
    return Tn.default.createElement(
      RS.path,
      Hc(
        { className: "visx-path", d: h.to(c), stroke: w.stroke, fill: w.fill },
        a
      )
    );
  }
  var lT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/node_modules/@visx/xychart/esm/components/series/AnimatedAreaSeries.js";
  function cT(e) {
    return L(
      XC,
      { ...e, PathComponent: sT },
      void 0,
      !1,
      { fileName: lT, lineNumber: 9, columnNumber: 23 },
      this
    );
  }
  var Nr =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/LineChart/LineChart.tsx";
  const fT = ({ colorScale: e, nearestDatum: t, accessors: n }) =>
      L(
        "div",
        {
          children: [
            L(
              "div",
              { style: { color: e(t.key) }, children: t.key },
              void 0,
              !1,
              { fileName: Nr, lineNumber: 32, columnNumber: 7 },
              void 0
            ),
            n.xAccessor(t.datum),
            ", ",
            n.yAccessor(t.datum),
          ],
        },
        void 0,
        !0,
        { fileName: Nr, lineNumber: 31, columnNumber: 5 },
        void 0
      ),
    dT = ({
      accessors: e,
      data: t,
      lineLabel: n,
      xLabel: r,
      yLabel: i,
      ...o
    }) =>
      L(
        Nn,
        {
          children: L(
            ki,
            {
              xScale: {
                type: "linear",
                domain: [
                  Math.min(...t.map(e.xAccessor)),
                  Math.max(...t.map(e.xAccessor)),
                ],
                zero: !1,
              },
              yScale: { type: "linear" },
              ...o,
              children: [
                L(
                  cT,
                  { dataKey: n, data: t, ...e },
                  void 0,
                  !1,
                  { fileName: Nr, lineNumber: 46, columnNumber: 9 },
                  void 0
                ),
                L(
                  Gg,
                  {
                    snapTooltipToDatumX: !0,
                    snapTooltipToDatumY: !0,
                    showSeriesGlyphs: !0,
                    renderTooltip: ({ tooltipData: a, colorScale: u }) =>
                      L(
                        fT,
                        {
                          nearestDatum: a.nearestDatum,
                          colorScale: u,
                          accessors: e,
                        },
                        void 0,
                        !1,
                        { fileName: Nr, lineNumber: 52, columnNumber: 13 },
                        void 0
                      ),
                  },
                  void 0,
                  !1,
                  { fileName: Nr, lineNumber: 47, columnNumber: 9 },
                  void 0
                ),
              ],
            },
            void 0,
            !0,
            { fileName: Nr, lineNumber: 45, columnNumber: 7 },
            void 0
          ),
        },
        void 0,
        !1
      ),
    hT = (e) => {
      const r = {
        ...{
          accessors: { xAccessor: (i) => i.x, yAccessor: (i) => i.y },
          data: [],
          xLabel: "Unlabeled",
          yLabel: "Unlabeled",
          lineLabel: "Unlabeled",
        },
        ...e,
      };
      return L(
        md,
        {
          children: (i) =>
            L(
              dT,
              {
                ...r,
                parentSize: i,
                parentWidth: i.width,
                parentHeight: i.height,
                parentTop: i.top,
                parentLeft: i.left,
                parentRef: i.ref,
                resizeParent: i.resize,
              },
              void 0,
              !1,
              { fileName: Nr, lineNumber: 86, columnNumber: 9 },
              void 0
            ),
        },
        void 0,
        !1,
        { fileName: Nr, lineNumber: 84, columnNumber: 5 },
        void 0
      );
    };
  var Bo = { exports: {} },
    su = { exports: {} },
    dm;
  function pT() {
    return (
      dm ||
        ((dm = 1),
        (function (e, t) {
          (function (n, r) {
            r(t, Tn.default);
          })(li, function (n, r) {
            function i(s, g, y, b, E, R, A) {
              try {
                var j = s[R](A),
                  W = j.value;
              } catch (V) {
                return void y(V);
              }
              j.done ? g(W) : Promise.resolve(W).then(b, E);
            }
            function o(s) {
              return function () {
                var g = this,
                  y = arguments;
                return new Promise(function (b, E) {
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
              return (a =
                Object.assign ||
                function (s) {
                  for (var g = 1; g < arguments.length; g++) {
                    var y = arguments[g];
                    for (var b in y)
                      Object.prototype.hasOwnProperty.call(y, b) &&
                        (s[b] = y[b]);
                  }
                  return s;
                }).apply(this, arguments);
            }
            function u(s, g) {
              if (s == null) return {};
              var y,
                b,
                E = {},
                R = Object.keys(s);
              for (b = 0; b < R.length; b++)
                (y = R[b]), g.indexOf(y) >= 0 || (E[y] = s[y]);
              return E;
            }
            function f(s) {
              var g = (function (y, b) {
                if (typeof y != "object" || y === null) return y;
                var E = y[Symbol.toPrimitive];
                if (E !== void 0) {
                  var R = E.call(y, b || "default");
                  if (typeof R != "object") return R;
                  throw new TypeError(
                    "@@toPrimitive must return a primitive value."
                  );
                }
                return (b === "string" ? String : Number)(y);
              })(s, "string");
              return typeof g == "symbol" ? g : String(g);
            }
            r =
              r && Object.prototype.hasOwnProperty.call(r, "default")
                ? r.default
                : r;
            var c = { init: "init" },
              p = function (s) {
                var g = s.value;
                return g === void 0 ? "" : g;
              },
              h = function () {
                return r.createElement(r.Fragment, null, "\xA0");
              },
              w = {
                Cell: p,
                width: 150,
                minWidth: 0,
                maxWidth: Number.MAX_SAFE_INTEGER,
              };
            function T() {
              for (
                var s = arguments.length, g = new Array(s), y = 0;
                y < s;
                y++
              )
                g[y] = arguments[y];
              return g.reduce(function (b, E) {
                var R = E.style,
                  A = E.className;
                return (
                  (b = a({}, b, {}, u(E, ["style", "className"]))),
                  R &&
                    (b.style = b.style ? a({}, b.style || {}, {}, R || {}) : R),
                  A && (b.className = b.className ? b.className + " " + A : A),
                  b.className === "" && delete b.className,
                  b
                );
              }, {});
            }
            var _ = function (s, g) {
                return (
                  g === void 0 && (g = {}),
                  function (y) {
                    return (
                      y === void 0 && (y = {}),
                      [].concat(s, [y]).reduce(function (b, E) {
                        return (function R(A, j, W) {
                          return typeof j == "function"
                            ? R({}, j(A, W))
                            : Array.isArray(j)
                            ? T.apply(void 0, [A].concat(j))
                            : T(A, j);
                        })(b, E, a({}, g, { userProps: y }));
                      }, {})
                    );
                  }
                );
              },
              P = function (s, g, y, b) {
                return (
                  y === void 0 && (y = {}),
                  s.reduce(function (E, R) {
                    return R(E, y);
                  }, g)
                );
              },
              I = function (s, g, y) {
                return (
                  y === void 0 && (y = {}),
                  s.forEach(function (b) {
                    b(g, y);
                  })
                );
              };
            function k(s, g, y, b) {
              s.findIndex(function (E) {
                return E.pluginName === y;
              }),
                g.forEach(function (E) {
                  s.findIndex(function (R) {
                    return R.pluginName === E;
                  });
                });
            }
            function F(s, g) {
              return typeof s == "function" ? s(g) : s;
            }
            function N(s) {
              var g = r.useRef();
              return (
                (g.current = s),
                r.useCallback(function () {
                  return g.current;
                }, [])
              );
            }
            var G = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
            function M(s, g) {
              var y = r.useRef(!1);
              G(function () {
                y.current && s(), (y.current = !0);
              }, g);
            }
            function D(s, g, y) {
              return (
                y === void 0 && (y = {}),
                function (b, E) {
                  E === void 0 && (E = {});
                  var R = typeof b == "string" ? g[b] : b;
                  if (R === void 0)
                    throw (
                      (console.info(g),
                      new Error("Renderer Error \u261D\uFE0F"))
                    );
                  return ne(R, a({}, s, { column: g }, y, {}, E));
                }
              );
            }
            function ne(s, g) {
              return (function (b) {
                return (
                  typeof b == "function" &&
                  (E = Object.getPrototypeOf(b)).prototype &&
                  E.prototype.isReactComponent
                );
                var E;
              })((y = s)) ||
                typeof y == "function" ||
                (function (b) {
                  return (
                    typeof b == "object" &&
                    typeof b.$$typeof == "symbol" &&
                    ["react.memo", "react.forward_ref"].includes(
                      b.$$typeof.description
                    )
                  );
                })(y)
                ? r.createElement(s, g)
                : s;
              var y;
            }
            function Z(s, g, y) {
              return (
                y === void 0 && (y = 0),
                s.map(function (b) {
                  return (
                    me((b = a({}, b, { parent: g, depth: y }))),
                    b.columns && (b.columns = Z(b.columns, b, y + 1)),
                    b
                  );
                })
              );
            }
            function he(s) {
              return Ue(s, "columns");
            }
            function me(s) {
              var g = s.id,
                y = s.accessor,
                b = s.Header;
              if (typeof y == "string") {
                g = g || y;
                var E = y.split(".");
                y = function (R) {
                  return (function (A, j, W) {
                    if (!j) return A;
                    var V,
                      le = typeof j == "function" ? j : JSON.stringify(j),
                      oe =
                        we.get(le) ||
                        (function () {
                          var ae = (function (X) {
                            return (function re(ye, _e) {
                              if (
                                (_e === void 0 && (_e = []), Array.isArray(ye))
                              )
                                for (var Fe = 0; Fe < ye.length; Fe += 1)
                                  re(ye[Fe], _e);
                              else _e.push(ye);
                              return _e;
                            })(X)
                              .map(function (re) {
                                return String(re).replace(".", "_");
                              })
                              .join(".")
                              .replace(Ne, ".")
                              .replace($e, "")
                              .split(".");
                          })(j);
                          return we.set(le, ae), ae;
                        })();
                    try {
                      V = oe.reduce(function (ae, X) {
                        return ae[X];
                      }, A);
                    } catch {}
                    return V !== void 0 ? V : W;
                  })(R, E);
                };
              }
              if ((!g && typeof b == "string" && b && (g = b), !g && s.columns))
                throw (
                  (console.error(s),
                  new Error(
                    'A column ID (or unique "Header" value) is required!'
                  ))
                );
              if (!g)
                throw (
                  (console.error(s),
                  new Error("A column ID (or string accessor) is required!"))
                );
              return Object.assign(s, { id: g, accessor: y }), s;
            }
            function ie(s, g) {
              if (!g) throw new Error();
              return (
                Object.assign(s, a({ Header: h, Footer: h }, w, {}, g, {}, s)),
                Object.assign(s, { originalWidth: s.width }),
                s
              );
            }
            function te(s, g, y) {
              y === void 0 &&
                (y = function () {
                  return {};
                });
              for (
                var b = [],
                  E = s,
                  R = 0,
                  A = function () {
                    return R++;
                  },
                  j = function () {
                    var W = { headers: [] },
                      V = [],
                      le = E.some(function (oe) {
                        return oe.parent;
                      });
                    E.forEach(function (oe) {
                      var ae,
                        X = [].concat(V).reverse()[0];
                      le &&
                        (oe.parent
                          ? (ae = a(
                              {},
                              oe.parent,
                              {
                                originalId: oe.parent.id,
                                id: oe.parent.id + "_" + A(),
                                headers: [oe],
                              },
                              y(oe)
                            ))
                          : (ae = ie(
                              a(
                                {
                                  originalId: oe.id + "_placeholder",
                                  id: oe.id + "_placeholder_" + A(),
                                  placeholderOf: oe,
                                  headers: [oe],
                                },
                                y(oe)
                              ),
                              g
                            )),
                        X && X.originalId === ae.originalId
                          ? X.headers.push(oe)
                          : V.push(ae)),
                        W.headers.push(oe);
                    }),
                      b.push(W),
                      (E = V);
                  };
                E.length;

              )
                j();
              return b.reverse();
            }
            var we = new Map();
            function ke() {
              for (
                var s = arguments.length, g = new Array(s), y = 0;
                y < s;
                y++
              )
                g[y] = arguments[y];
              for (var b = 0; b < g.length; b += 1)
                if (g[b] !== void 0) return g[b];
            }
            function st(s) {
              if (typeof s == "function") return s;
            }
            function Ue(s, g) {
              var y = [];
              return (
                (function b(E) {
                  E.forEach(function (R) {
                    R[g] ? b(R[g]) : y.push(R);
                  });
                })(s),
                y
              );
            }
            function lt(s, g) {
              var y = g.manualExpandedKey,
                b = g.expanded,
                E = g.expandSubRows,
                R = E === void 0 || E,
                A = [];
              return (
                s.forEach(function (j) {
                  return (function W(V, le) {
                    le === void 0 && (le = !0),
                      (V.isExpanded = (V.original && V.original[y]) || b[V.id]),
                      (V.canExpand = V.subRows && !!V.subRows.length),
                      le && A.push(V),
                      V.subRows &&
                        V.subRows.length &&
                        V.isExpanded &&
                        V.subRows.forEach(function (oe) {
                          return W(oe, R);
                        });
                  })(j);
                }),
                A
              );
            }
            function ct(s, g, y) {
              return st(s) || g[s] || y[s] || y.text;
            }
            function ht(s, g, y) {
              return s ? s(g, y) : g === void 0;
            }
            function U() {
              throw new Error(
                "React-Table: You have not called prepareRow(row) one or more rows you are attempting to render."
              );
            }
            var se = null,
              Ne = /\[/g,
              $e = /\]/g,
              Te = function (s) {
                return a({ role: "table" }, s);
              },
              Ce = function (s) {
                return a({ role: "rowgroup" }, s);
              },
              Ee = function (s, g) {
                var y = g.column;
                return a(
                  {
                    key: "header_" + y.id,
                    colSpan: y.totalVisibleHeaderCount,
                    role: "columnheader",
                  },
                  s
                );
              },
              De = function (s, g) {
                var y = g.column;
                return a(
                  { key: "footer_" + y.id, colSpan: y.totalVisibleHeaderCount },
                  s
                );
              },
              Ge = function (s, g) {
                return a({ key: "headerGroup_" + g.index, role: "row" }, s);
              },
              K = function (s, g) {
                return a({ key: "footerGroup_" + g.index }, s);
              },
              fe = function (s, g) {
                return a({ key: "row_" + g.row.id, role: "row" }, s);
              },
              je = function (s, g) {
                var y = g.cell;
                return a(
                  { key: "cell_" + y.row.id + "_" + y.column.id, role: "cell" },
                  s
                );
              };
            function B() {
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
                getTableProps: [Te],
                getTableBodyProps: [Ce],
                getHeaderGroupProps: [Ge],
                getFooterGroupProps: [K],
                getHeaderProps: [Ee],
                getFooterProps: [De],
                getRowProps: [fe],
                getCellProps: [je],
                useFinalInstance: [],
              };
            }
            (c.resetHiddenColumns = "resetHiddenColumns"),
              (c.toggleHideColumn = "toggleHideColumn"),
              (c.setHiddenColumns = "setHiddenColumns"),
              (c.toggleHideAllColumns = "toggleHideAllColumns");
            var yt = function (s) {
              (s.getToggleHiddenProps = [ft]),
                (s.getToggleHideAllColumnsProps = [Ct]),
                s.stateReducers.push(At),
                s.useInstanceBeforeDimensions.push(en),
                s.headerGroupsDeps.push(function (g, y) {
                  var b = y.instance;
                  return [].concat(g, [b.state.hiddenColumns]);
                }),
                s.useInstance.push(un);
            };
            yt.pluginName = "useColumnVisibility";
            var ft = function (s, g) {
                var y = g.column;
                return [
                  s,
                  {
                    onChange: function (b) {
                      y.toggleHidden(!b.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: y.isVisible,
                    title: "Toggle Column Visible",
                  },
                ];
              },
              Ct = function (s, g) {
                var y = g.instance;
                return [
                  s,
                  {
                    onChange: function (b) {
                      y.toggleHideAllColumns(!b.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked:
                      !y.allColumnsHidden && !y.state.hiddenColumns.length,
                    title: "Toggle All Columns Hidden",
                    indeterminate:
                      !y.allColumnsHidden && y.state.hiddenColumns.length,
                  },
                ];
              };
            function At(s, g, y, b) {
              if (g.type === c.init) return a({ hiddenColumns: [] }, s);
              if (g.type === c.resetHiddenColumns)
                return a({}, s, {
                  hiddenColumns: b.initialState.hiddenColumns || [],
                });
              if (g.type === c.toggleHideColumn) {
                var E = (
                  g.value !== void 0
                    ? g.value
                    : !s.hiddenColumns.includes(g.columnId)
                )
                  ? [].concat(s.hiddenColumns, [g.columnId])
                  : s.hiddenColumns.filter(function (R) {
                      return R !== g.columnId;
                    });
                return a({}, s, { hiddenColumns: E });
              }
              return g.type === c.setHiddenColumns
                ? a({}, s, { hiddenColumns: F(g.value, s.hiddenColumns) })
                : g.type === c.toggleHideAllColumns
                ? a({}, s, {
                    hiddenColumns: (
                      g.value !== void 0 ? g.value : !s.hiddenColumns.length
                    )
                      ? b.allColumns.map(function (R) {
                          return R.id;
                        })
                      : [],
                  })
                : void 0;
            }
            function en(s) {
              var g = s.headers,
                y = s.state.hiddenColumns;
              r.useRef(!1).current;
              var b = 0;
              g.forEach(function (E) {
                return (b += (function R(A, j) {
                  A.isVisible = j && !y.includes(A.id);
                  var W = 0;
                  return (
                    A.headers && A.headers.length
                      ? A.headers.forEach(function (V) {
                          return (W += R(V, A.isVisible));
                        })
                      : (W = A.isVisible ? 1 : 0),
                    (A.totalVisibleHeaderCount = W),
                    W
                  );
                })(E, !0));
              });
            }
            function un(s) {
              var g = s.columns,
                y = s.flatHeaders,
                b = s.dispatch,
                E = s.allColumns,
                R = s.getHooks,
                A = s.state.hiddenColumns,
                j = s.autoResetHiddenColumns,
                W = j === void 0 || j,
                V = N(s),
                le = E.length === A.length,
                oe = r.useCallback(
                  function (_e, Fe) {
                    return b({
                      type: c.toggleHideColumn,
                      columnId: _e,
                      value: Fe,
                    });
                  },
                  [b]
                ),
                ae = r.useCallback(
                  function (_e) {
                    return b({ type: c.setHiddenColumns, value: _e });
                  },
                  [b]
                ),
                X = r.useCallback(
                  function (_e) {
                    return b({ type: c.toggleHideAllColumns, value: _e });
                  },
                  [b]
                ),
                re = _(R().getToggleHideAllColumnsProps, { instance: V() });
              y.forEach(function (_e) {
                (_e.toggleHidden = function (Fe) {
                  b({ type: c.toggleHideColumn, columnId: _e.id, value: Fe });
                }),
                  (_e.getToggleHiddenProps = _(R().getToggleHiddenProps, {
                    instance: V(),
                    column: _e,
                  }));
              });
              var ye = N(W);
              M(
                function () {
                  ye() && b({ type: c.resetHiddenColumns });
                },
                [b, g]
              ),
                Object.assign(s, {
                  allColumnsHidden: le,
                  toggleHideColumn: oe,
                  setHiddenColumns: ae,
                  toggleHideAllColumns: X,
                  getToggleHideAllColumnsProps: re,
                });
            }
            var wn = {},
              xn = {},
              _n = function (s, g, y) {
                return s;
              },
              Un = function (s, g) {
                return s.subRows || [];
              },
              sr = function (s, g, y) {
                return "" + (y ? [y.id, g].join(".") : g);
              },
              qn = function (s) {
                return s;
              };
            function Sn(s) {
              var g = s.initialState,
                y = g === void 0 ? wn : g,
                b = s.defaultColumn,
                E = b === void 0 ? xn : b,
                R = s.getSubRows,
                A = R === void 0 ? Un : R,
                j = s.getRowId,
                W = j === void 0 ? sr : j,
                V = s.stateReducer,
                le = V === void 0 ? _n : V,
                oe = s.useControlledState,
                ae = oe === void 0 ? qn : oe;
              return a(
                {},
                u(s, [
                  "initialState",
                  "defaultColumn",
                  "getSubRows",
                  "getRowId",
                  "stateReducer",
                  "useControlledState",
                ]),
                {
                  initialState: y,
                  defaultColumn: E,
                  getSubRows: A,
                  getRowId: W,
                  stateReducer: le,
                  useControlledState: ae,
                }
              );
            }
            function Yt(s, g) {
              g === void 0 && (g = 0);
              var y = 0,
                b = 0,
                E = 0,
                R = 0;
              return (
                s.forEach(function (A) {
                  var j = A.headers;
                  if (((A.totalLeft = g), j && j.length)) {
                    var W = Yt(j, g),
                      V = W[0],
                      le = W[1],
                      oe = W[2],
                      ae = W[3];
                    (A.totalMinWidth = V),
                      (A.totalWidth = le),
                      (A.totalMaxWidth = oe),
                      (A.totalFlexWidth = ae);
                  } else (A.totalMinWidth = A.minWidth), (A.totalWidth = Math.min(Math.max(A.minWidth, A.width), A.maxWidth)), (A.totalMaxWidth = A.maxWidth), (A.totalFlexWidth = A.canResize ? A.totalWidth : 0);
                  A.isVisible &&
                    ((g += A.totalWidth),
                    (y += A.totalMinWidth),
                    (b += A.totalWidth),
                    (E += A.totalMaxWidth),
                    (R += A.totalFlexWidth));
                }),
                [y, b, E, R]
              );
            }
            function An(s) {
              var g = s.data,
                y = s.rows,
                b = s.flatRows,
                E = s.rowsById,
                R = s.column,
                A = s.getRowId,
                j = s.getSubRows,
                W = s.accessValueHooks,
                V = s.getInstance;
              g.forEach(function (le, oe) {
                return (function ae(X, re, ye, _e, Fe) {
                  ye === void 0 && (ye = 0);
                  var et = X,
                    Ie = A(X, re, _e),
                    ce = E[Ie];
                  if (ce)
                    ce.subRows &&
                      ce.originalSubRows.forEach(function (Me, Xe) {
                        return ae(Me, Xe, ye + 1, ce);
                      });
                  else if (
                    (((ce = {
                      id: Ie,
                      original: et,
                      index: re,
                      depth: ye,
                      cells: [{}],
                    }).cells.map = U),
                    (ce.cells.filter = U),
                    (ce.cells.forEach = U),
                    (ce.cells[0].getCellProps = U),
                    (ce.values = {}),
                    Fe.push(ce),
                    b.push(ce),
                    (E[Ie] = ce),
                    (ce.originalSubRows = j(X, re)),
                    ce.originalSubRows)
                  ) {
                    var Ze = [];
                    ce.originalSubRows.forEach(function (Me, Xe) {
                      return ae(Me, Xe, ye + 1, ce, Ze);
                    }),
                      (ce.subRows = Ze);
                  }
                  R.accessor &&
                    (ce.values[R.id] = R.accessor(X, re, ce, Fe, g)),
                    (ce.values[R.id] = P(W, ce.values[R.id], {
                      row: ce,
                      column: R,
                      instance: V(),
                    }));
                })(le, oe, 0, void 0, y);
              });
            }
            (c.resetExpanded = "resetExpanded"),
              (c.toggleRowExpanded = "toggleRowExpanded"),
              (c.toggleAllRowsExpanded = "toggleAllRowsExpanded");
            var lr = function (s) {
              (s.getToggleAllRowsExpandedProps = [Or]),
                (s.getToggleRowExpandedProps = [Ar]),
                s.stateReducers.push(cr),
                s.useInstance.push(kr),
                s.prepareRow.push(Yn);
            };
            lr.pluginName = "useExpanded";
            var Or = function (s, g) {
                var y = g.instance;
                return [
                  s,
                  {
                    onClick: function (b) {
                      y.toggleAllRowsExpanded();
                    },
                    style: { cursor: "pointer" },
                    title: "Toggle All Rows Expanded",
                  },
                ];
              },
              Ar = function (s, g) {
                var y = g.row;
                return [
                  s,
                  {
                    onClick: function () {
                      y.toggleRowExpanded();
                    },
                    style: { cursor: "pointer" },
                    title: "Toggle Row Expanded",
                  },
                ];
              };
            function cr(s, g, y, b) {
              if (g.type === c.init) return a({ expanded: {} }, s);
              if (g.type === c.resetExpanded)
                return a({}, s, { expanded: b.initialState.expanded || {} });
              if (g.type === c.toggleAllRowsExpanded) {
                var E = g.value,
                  R = b.rowsById,
                  A = Object.keys(R).length === Object.keys(s.expanded).length;
                if (E !== void 0 ? E : !A) {
                  var j = {};
                  return (
                    Object.keys(R).forEach(function (re) {
                      j[re] = !0;
                    }),
                    a({}, s, { expanded: j })
                  );
                }
                return a({}, s, { expanded: {} });
              }
              if (g.type === c.toggleRowExpanded) {
                var W,
                  V = g.id,
                  le = g.value,
                  oe = s.expanded[V],
                  ae = le !== void 0 ? le : !oe;
                if (!oe && ae)
                  return a({}, s, {
                    expanded: a({}, s.expanded, ((W = {}), (W[V] = !0), W)),
                  });
                if (oe && !ae) {
                  var X = s.expanded;
                  return X[V], a({}, s, { expanded: u(X, [V].map(f)) });
                }
                return s;
              }
            }
            function kr(s) {
              var g = s.data,
                y = s.rows,
                b = s.rowsById,
                E = s.manualExpandedKey,
                R = E === void 0 ? "expanded" : E,
                A = s.paginateExpandedRows,
                j = A === void 0 || A,
                W = s.expandSubRows,
                V = W === void 0 || W,
                le = s.autoResetExpanded,
                oe = le === void 0 || le,
                ae = s.getHooks,
                X = s.plugins,
                re = s.state.expanded,
                ye = s.dispatch;
              k(
                X,
                [
                  "useSortBy",
                  "useGroupBy",
                  "usePivotColumns",
                  "useGlobalFilter",
                ],
                "useExpanded"
              );
              var _e = N(oe),
                Fe = Boolean(Object.keys(b).length && Object.keys(re).length);
              Fe &&
                Object.keys(b).some(function (dt) {
                  return !re[dt];
                }) &&
                (Fe = !1),
                M(
                  function () {
                    _e() && ye({ type: c.resetExpanded });
                  },
                  [ye, g]
                );
              var et = r.useCallback(
                  function (dt, He) {
                    ye({ type: c.toggleRowExpanded, id: dt, value: He });
                  },
                  [ye]
                ),
                Ie = r.useCallback(
                  function (dt) {
                    return ye({ type: c.toggleAllRowsExpanded, value: dt });
                  },
                  [ye]
                ),
                ce = r.useMemo(
                  function () {
                    return j
                      ? lt(y, {
                          manualExpandedKey: R,
                          expanded: re,
                          expandSubRows: V,
                        })
                      : y;
                  },
                  [j, y, R, re, V]
                ),
                Ze = r.useMemo(
                  function () {
                    return (function (dt) {
                      var He = 0;
                      return (
                        Object.keys(dt).forEach(function (qe) {
                          var xt = qe.split(".");
                          He = Math.max(He, xt.length);
                        }),
                        He
                      );
                    })(re);
                  },
                  [re]
                ),
                Me = N(s),
                Xe = _(ae().getToggleAllRowsExpandedProps, { instance: Me() });
              Object.assign(s, {
                preExpandedRows: y,
                expandedRows: ce,
                rows: ce,
                expandedDepth: Ze,
                isAllRowsExpanded: Fe,
                toggleRowExpanded: et,
                toggleAllRowsExpanded: Ie,
                getToggleAllRowsExpandedProps: Xe,
              });
            }
            function Yn(s, g) {
              var y = g.instance.getHooks,
                b = g.instance;
              (s.toggleRowExpanded = function (E) {
                return b.toggleRowExpanded(s.id, E);
              }),
                (s.getToggleRowExpandedProps = _(
                  y().getToggleRowExpandedProps,
                  { instance: b, row: s }
                ));
            }
            var Xn = function (s, g, y) {
              return (s = s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return String(R)
                    .toLowerCase()
                    .includes(String(y).toLowerCase());
                });
              }));
            };
            Xn.autoRemove = function (s) {
              return !s;
            };
            var sn = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return (
                    R === void 0 ||
                    String(R).toLowerCase() === String(y).toLowerCase()
                  );
                });
              });
            };
            sn.autoRemove = function (s) {
              return !s;
            };
            var Rn = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return R === void 0 || String(R) === String(y);
                });
              });
            };
            Rn.autoRemove = function (s) {
              return !s;
            };
            var kn = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  return b.values[E].includes(y);
                });
              });
            };
            kn.autoRemove = function (s) {
              return !s || !s.length;
            };
            var $n = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return (
                    R &&
                    R.length &&
                    y.every(function (A) {
                      return R.includes(A);
                    })
                  );
                });
              });
            };
            $n.autoRemove = function (s) {
              return !s || !s.length;
            };
            var fr = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return (
                    R &&
                    R.length &&
                    y.some(function (A) {
                      return R.includes(A);
                    })
                  );
                });
              });
            };
            fr.autoRemove = function (s) {
              return !s || !s.length;
            };
            var Fn = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  var R = b.values[E];
                  return y.includes(R);
                });
              });
            };
            Fn.autoRemove = function (s) {
              return !s || !s.length;
            };
            var dr = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  return b.values[E] === y;
                });
              });
            };
            dr.autoRemove = function (s) {
              return s === void 0;
            };
            var Kn = function (s, g, y) {
              return s.filter(function (b) {
                return g.some(function (E) {
                  return b.values[E] == y;
                });
              });
            };
            Kn.autoRemove = function (s) {
              return s == null;
            };
            var Qn = function (s, g, y) {
              var b = y || [],
                E = b[0],
                R = b[1];
              if (
                (E = typeof E == "number" ? E : -1 / 0) >
                (R = typeof R == "number" ? R : 1 / 0)
              ) {
                var A = E;
                (E = R), (R = A);
              }
              return s.filter(function (j) {
                return g.some(function (W) {
                  var V = j.values[W];
                  return V >= E && V <= R;
                });
              });
            };
            Qn.autoRemove = function (s) {
              return !s || (typeof s[0] != "number" && typeof s[1] != "number");
            };
            var Cn = Object.freeze({
              __proto__: null,
              text: Xn,
              exactText: sn,
              exactTextCase: Rn,
              includes: kn,
              includesAll: $n,
              includesSome: fr,
              includesValue: Fn,
              exact: dr,
              equals: Kn,
              between: Qn,
            });
            (c.resetFilters = "resetFilters"),
              (c.setFilter = "setFilter"),
              (c.setAllFilters = "setAllFilters");
            var $r = function (s) {
              s.stateReducers.push(Vt), s.useInstance.push(Xt);
            };
            function Vt(s, g, y, b) {
              if (g.type === c.init) return a({ filters: [] }, s);
              if (g.type === c.resetFilters)
                return a({}, s, { filters: b.initialState.filters || [] });
              if (g.type === c.setFilter) {
                var E = g.columnId,
                  R = g.filterValue,
                  A = b.allColumns,
                  j = b.filterTypes,
                  W = A.find(function (ye) {
                    return ye.id === E;
                  });
                if (!W)
                  throw new Error(
                    "React-Table: Could not find a column with id: " + E
                  );
                var V = ct(W.filter, j || {}, Cn),
                  le = s.filters.find(function (ye) {
                    return ye.id === E;
                  }),
                  oe = F(R, le && le.value);
                return ht(V.autoRemove, oe, W)
                  ? a({}, s, {
                      filters: s.filters.filter(function (ye) {
                        return ye.id !== E;
                      }),
                    })
                  : a(
                      {},
                      s,
                      le
                        ? {
                            filters: s.filters.map(function (ye) {
                              return ye.id === E ? { id: E, value: oe } : ye;
                            }),
                          }
                        : {
                            filters: [].concat(s.filters, [
                              { id: E, value: oe },
                            ]),
                          }
                    );
              }
              if (g.type === c.setAllFilters) {
                var ae = g.filters,
                  X = b.allColumns,
                  re = b.filterTypes;
                return a({}, s, {
                  filters: F(ae, s.filters).filter(function (ye) {
                    var _e = X.find(function (Fe) {
                      return Fe.id === ye.id;
                    });
                    return !ht(
                      ct(_e.filter, re || {}, Cn).autoRemove,
                      ye.value,
                      _e
                    );
                  }),
                });
              }
            }
            function Xt(s) {
              var g = s.data,
                y = s.rows,
                b = s.flatRows,
                E = s.rowsById,
                R = s.allColumns,
                A = s.filterTypes,
                j = s.manualFilters,
                W = s.defaultCanFilter,
                V = W !== void 0 && W,
                le = s.disableFilters,
                oe = s.state.filters,
                ae = s.dispatch,
                X = s.autoResetFilters,
                re = X === void 0 || X,
                ye = r.useCallback(
                  function (Me, Xe) {
                    ae({ type: c.setFilter, columnId: Me, filterValue: Xe });
                  },
                  [ae]
                ),
                _e = r.useCallback(
                  function (Me) {
                    ae({ type: c.setAllFilters, filters: Me });
                  },
                  [ae]
                );
              R.forEach(function (Me) {
                var Xe = Me.id,
                  dt = Me.accessor,
                  He = Me.defaultCanFilter,
                  qe = Me.disableFilters;
                (Me.canFilter = dt
                  ? ke(qe !== !0 && void 0, le !== !0 && void 0, !0)
                  : ke(He, V, !1)),
                  (Me.setFilter = function (Qe) {
                    return ye(Me.id, Qe);
                  });
                var xt = oe.find(function (Qe) {
                  return Qe.id === Xe;
                });
                Me.filterValue = xt && xt.value;
              });
              var Fe = r.useMemo(
                  function () {
                    if (j || !oe.length) return [y, b, E];
                    var Me = [],
                      Xe = {};
                    return [
                      (function dt(He, qe) {
                        qe === void 0 && (qe = 0);
                        var xt = He;
                        return (
                          (xt = oe.reduce(function (Qe, gt) {
                            var l = gt.id,
                              d = gt.value,
                              m = R.find(function (S) {
                                return S.id === l;
                              });
                            if (!m) return Qe;
                            qe === 0 && (m.preFilteredRows = Qe);
                            var v = ct(m.filter, A || {}, Cn);
                            return v
                              ? ((m.filteredRows = v(Qe, [l], d)),
                                m.filteredRows)
                              : (console.warn(
                                  "Could not find a valid 'column.filter' for column with the ID: " +
                                    m.id +
                                    "."
                                ),
                                Qe);
                          }, He)).forEach(function (Qe) {
                            Me.push(Qe),
                              (Xe[Qe.id] = Qe),
                              Qe.subRows &&
                                (Qe.subRows =
                                  Qe.subRows && Qe.subRows.length > 0
                                    ? dt(Qe.subRows, qe + 1)
                                    : Qe.subRows);
                          }),
                          xt
                        );
                      })(y),
                      Me,
                      Xe,
                    ];
                  },
                  [j, oe, y, b, E, R, A]
                ),
                et = Fe[0],
                Ie = Fe[1],
                ce = Fe[2];
              r.useMemo(
                function () {
                  R.filter(function (Me) {
                    return !oe.find(function (Xe) {
                      return Xe.id === Me.id;
                    });
                  }).forEach(function (Me) {
                    (Me.preFilteredRows = et), (Me.filteredRows = et);
                  });
                },
                [et, oe, R]
              );
              var Ze = N(re);
              M(
                function () {
                  Ze() && ae({ type: c.resetFilters });
                },
                [ae, j ? null : g]
              ),
                Object.assign(s, {
                  preFilteredRows: y,
                  preFilteredFlatRows: b,
                  preFilteredRowsById: E,
                  filteredRows: et,
                  filteredFlatRows: Ie,
                  filteredRowsById: ce,
                  rows: et,
                  flatRows: Ie,
                  rowsById: ce,
                  setFilter: ye,
                  setAllFilters: _e,
                });
            }
            ($r.pluginName = "useFilters"),
              (c.resetGlobalFilter = "resetGlobalFilter"),
              (c.setGlobalFilter = "setGlobalFilter");
            var O = function (s) {
              s.stateReducers.push(ee), s.useInstance.push(ve);
            };
            function ee(s, g, y, b) {
              if (g.type === c.resetGlobalFilter)
                return a({}, s, {
                  globalFilter: b.initialState.globalFilter || void 0,
                });
              if (g.type === c.setGlobalFilter) {
                var E = g.filterValue,
                  R = b.userFilterTypes,
                  A = ct(b.globalFilter, R || {}, Cn),
                  j = F(E, s.globalFilter);
                return ht(A.autoRemove, j)
                  ? (s.globalFilter, u(s, ["globalFilter"]))
                  : a({}, s, { globalFilter: j });
              }
            }
            function ve(s) {
              var g = s.data,
                y = s.rows,
                b = s.flatRows,
                E = s.rowsById,
                R = s.allColumns,
                A = s.filterTypes,
                j = s.globalFilter,
                W = s.manualGlobalFilter,
                V = s.state.globalFilter,
                le = s.dispatch,
                oe = s.autoResetGlobalFilter,
                ae = oe === void 0 || oe,
                X = s.disableGlobalFilter,
                re = r.useCallback(
                  function (ce) {
                    le({ type: c.setGlobalFilter, filterValue: ce });
                  },
                  [le]
                ),
                ye = r.useMemo(
                  function () {
                    if (W || V === void 0) return [y, b, E];
                    var ce = [],
                      Ze = {},
                      Me = ct(j, A || {}, Cn);
                    if (!Me)
                      return (
                        console.warn(
                          "Could not find a valid 'globalFilter' option."
                        ),
                        y
                      );
                    R.forEach(function (dt) {
                      var He = dt.disableGlobalFilter;
                      dt.canFilter = ke(
                        He !== !0 && void 0,
                        X !== !0 && void 0,
                        !0
                      );
                    });
                    var Xe = R.filter(function (dt) {
                      return dt.canFilter === !0;
                    });
                    return [
                      (function dt(He) {
                        return (
                          (He = Me(
                            He,
                            Xe.map(function (qe) {
                              return qe.id;
                            }),
                            V
                          )).forEach(function (qe) {
                            ce.push(qe),
                              (Ze[qe.id] = qe),
                              (qe.subRows =
                                qe.subRows && qe.subRows.length
                                  ? dt(qe.subRows)
                                  : qe.subRows);
                          }),
                          He
                        );
                      })(y),
                      ce,
                      Ze,
                    ];
                  },
                  [W, V, j, A, R, y, b, E, X]
                ),
                _e = ye[0],
                Fe = ye[1],
                et = ye[2],
                Ie = N(ae);
              M(
                function () {
                  Ie() && le({ type: c.resetGlobalFilter });
                },
                [le, W ? null : g]
              ),
                Object.assign(s, {
                  preGlobalFilteredRows: y,
                  preGlobalFilteredFlatRows: b,
                  preGlobalFilteredRowsById: E,
                  globalFilteredRows: _e,
                  globalFilteredFlatRows: Fe,
                  globalFilteredRowsById: et,
                  rows: _e,
                  flatRows: Fe,
                  rowsById: et,
                  setGlobalFilter: re,
                  disableGlobalFilter: X,
                });
            }
            function Le(s, g) {
              return g.reduce(function (y, b) {
                return y + (typeof b == "number" ? b : 0);
              }, 0);
            }
            O.pluginName = "useGlobalFilter";
            var vt = Object.freeze({
                __proto__: null,
                sum: Le,
                min: function (s) {
                  var g = s[0] || 0;
                  return (
                    s.forEach(function (y) {
                      typeof y == "number" && (g = Math.min(g, y));
                    }),
                    g
                  );
                },
                max: function (s) {
                  var g = s[0] || 0;
                  return (
                    s.forEach(function (y) {
                      typeof y == "number" && (g = Math.max(g, y));
                    }),
                    g
                  );
                },
                minMax: function (s) {
                  var g = s[0] || 0,
                    y = s[0] || 0;
                  return (
                    s.forEach(function (b) {
                      typeof b == "number" &&
                        ((g = Math.min(g, b)), (y = Math.max(y, b)));
                    }),
                    g + ".." + y
                  );
                },
                average: function (s) {
                  return Le(0, s) / s.length;
                },
                median: function (s) {
                  if (!s.length) return null;
                  var g = Math.floor(s.length / 2),
                    y = [].concat(s).sort(function (b, E) {
                      return b - E;
                    });
                  return s.length % 2 != 0 ? y[g] : (y[g - 1] + y[g]) / 2;
                },
                unique: function (s) {
                  return Array.from(new Set(s).values());
                },
                uniqueCount: function (s) {
                  return new Set(s).size;
                },
                count: function (s) {
                  return s.length;
                },
              }),
              bt = [],
              ut = {};
            (c.resetGroupBy = "resetGroupBy"),
              (c.setGroupBy = "setGroupBy"),
              (c.toggleGroupBy = "toggleGroupBy");
            var it = function (s) {
              (s.getGroupByToggleProps = [kt]),
                s.stateReducers.push(Pt),
                s.visibleColumnsDeps.push(function (g, y) {
                  var b = y.instance;
                  return [].concat(g, [b.state.groupBy]);
                }),
                s.visibleColumns.push(Ot),
                s.useInstance.push(Zn),
                s.prepareRow.push(ii);
            };
            it.pluginName = "useGroupBy";
            var kt = function (s, g) {
              var y = g.header;
              return [
                s,
                {
                  onClick: y.canGroupBy
                    ? function (b) {
                        b.persist(), y.toggleGroupBy();
                      }
                    : void 0,
                  style: { cursor: y.canGroupBy ? "pointer" : void 0 },
                  title: "Toggle GroupBy",
                },
              ];
            };
            function Pt(s, g, y, b) {
              if (g.type === c.init) return a({ groupBy: [] }, s);
              if (g.type === c.resetGroupBy)
                return a({}, s, { groupBy: b.initialState.groupBy || [] });
              if (g.type === c.setGroupBy)
                return a({}, s, { groupBy: g.value });
              if (g.type === c.toggleGroupBy) {
                var E = g.columnId,
                  R = g.value,
                  A = R !== void 0 ? R : !s.groupBy.includes(E);
                return a(
                  {},
                  s,
                  A
                    ? { groupBy: [].concat(s.groupBy, [E]) }
                    : {
                        groupBy: s.groupBy.filter(function (j) {
                          return j !== E;
                        }),
                      }
                );
              }
            }
            function Ot(s, g) {
              var y = g.instance.state.groupBy,
                b = y
                  .map(function (R) {
                    return s.find(function (A) {
                      return A.id === R;
                    });
                  })
                  .filter(Boolean),
                E = s.filter(function (R) {
                  return !y.includes(R.id);
                });
              return (
                (s = [].concat(b, E)).forEach(function (R) {
                  (R.isGrouped = y.includes(R.id)),
                    (R.groupedIndex = y.indexOf(R.id));
                }),
                s
              );
            }
            var hn = {};
            function Zn(s) {
              var g = s.data,
                y = s.rows,
                b = s.flatRows,
                E = s.rowsById,
                R = s.allColumns,
                A = s.flatHeaders,
                j = s.groupByFn,
                W = j === void 0 ? ln : j,
                V = s.manualGroupBy,
                le = s.aggregations,
                oe = le === void 0 ? hn : le,
                ae = s.plugins,
                X = s.state.groupBy,
                re = s.dispatch,
                ye = s.autoResetGroupBy,
                _e = ye === void 0 || ye,
                Fe = s.disableGroupBy,
                et = s.defaultCanGroupBy,
                Ie = s.getHooks;
              k(ae, ["useColumnOrder", "useFilters"], "useGroupBy");
              var ce = N(s);
              R.forEach(function (m) {
                var v = m.accessor,
                  S = m.defaultGroupBy,
                  C = m.disableGroupBy;
                (m.canGroupBy = v
                  ? ke(
                      m.canGroupBy,
                      C !== !0 && void 0,
                      Fe !== !0 && void 0,
                      !0
                    )
                  : ke(m.canGroupBy, S, et, !1)),
                  m.canGroupBy &&
                    (m.toggleGroupBy = function () {
                      return s.toggleGroupBy(m.id);
                    }),
                  (m.Aggregated = m.Aggregated || m.Cell);
              });
              var Ze = r.useCallback(
                  function (m, v) {
                    re({ type: c.toggleGroupBy, columnId: m, value: v });
                  },
                  [re]
                ),
                Me = r.useCallback(
                  function (m) {
                    re({ type: c.setGroupBy, value: m });
                  },
                  [re]
                );
              A.forEach(function (m) {
                m.getGroupByToggleProps = _(Ie().getGroupByToggleProps, {
                  instance: ce(),
                  header: m,
                });
              });
              var Xe = r.useMemo(
                  function () {
                    if (V || !X.length) return [y, b, E, bt, ut, b, E];
                    var m = X.filter(function (q) {
                        return R.find(function (pe) {
                          return pe.id === q;
                        });
                      }),
                      v = [],
                      S = {},
                      C = [],
                      x = {},
                      $ = [],
                      z = {},
                      H = (function q(pe, J, ue) {
                        if ((J === void 0 && (J = 0), J === m.length))
                          return pe.map(function (Pe) {
                            return a({}, Pe, { depth: J });
                          });
                        var ge = m[J],
                          Q = W(pe, ge);
                        return Object.entries(Q).map(function (Pe, ze) {
                          var Ve = Pe[0],
                            xe = Pe[1],
                            Je = ge + ":" + Ve,
                            ot = q(xe, J + 1, (Je = ue ? ue + ">" + Je : Je)),
                            Se = J ? Ue(xe, "leafRows") : xe,
                            be = (function (Be, tt, nt) {
                              var Tt = {};
                              return (
                                R.forEach(function (Oe) {
                                  if (m.includes(Oe.id))
                                    Tt[Oe.id] = tt[0]
                                      ? tt[0].values[Oe.id]
                                      : null;
                                  else {
                                    var zt =
                                      typeof Oe.aggregate == "function"
                                        ? Oe.aggregate
                                        : oe[Oe.aggregate] || vt[Oe.aggregate];
                                    if (zt) {
                                      var rt = tt.map(function (Ke) {
                                          return Ke.values[Oe.id];
                                        }),
                                        Ye = Be.map(function (Ke) {
                                          var Nt = Ke.values[Oe.id];
                                          if (!nt && Oe.aggregateValue) {
                                            var Ut =
                                              typeof Oe.aggregateValue ==
                                              "function"
                                                ? Oe.aggregateValue
                                                : oe[Oe.aggregateValue] ||
                                                  vt[Oe.aggregateValue];
                                            if (!Ut)
                                              throw (
                                                (console.info({ column: Oe }),
                                                new Error(
                                                  "React Table: Invalid column.aggregateValue option for column listed above"
                                                ))
                                              );
                                            Nt = Ut(Nt, Ke, Oe);
                                          }
                                          return Nt;
                                        });
                                      Tt[Oe.id] = zt(Ye, rt);
                                    } else {
                                      if (Oe.aggregate)
                                        throw (
                                          (console.info({ column: Oe }),
                                          new Error(
                                            "React Table: Invalid column.aggregate option for column listed above"
                                          ))
                                        );
                                      Tt[Oe.id] = null;
                                    }
                                  }
                                }),
                                Tt
                              );
                            })(Se, xe, J),
                            Re = {
                              id: Je,
                              isGrouped: !0,
                              groupByID: ge,
                              groupByVal: Ve,
                              values: be,
                              subRows: ot,
                              leafRows: Se,
                              depth: J,
                              index: ze,
                            };
                          return (
                            ot.forEach(function (Be) {
                              v.push(Be),
                                (S[Be.id] = Be),
                                Be.isGrouped
                                  ? (C.push(Be), (x[Be.id] = Be))
                                  : ($.push(Be), (z[Be.id] = Be));
                            }),
                            Re
                          );
                        });
                      })(y);
                    return (
                      H.forEach(function (q) {
                        v.push(q),
                          (S[q.id] = q),
                          q.isGrouped
                            ? (C.push(q), (x[q.id] = q))
                            : ($.push(q), (z[q.id] = q));
                      }),
                      [H, v, S, C, x, $, z]
                    );
                  },
                  [V, X, y, b, E, R, oe, W]
                ),
                dt = Xe[0],
                He = Xe[1],
                qe = Xe[2],
                xt = Xe[3],
                Qe = Xe[4],
                gt = Xe[5],
                l = Xe[6],
                d = N(_e);
              M(
                function () {
                  d() && re({ type: c.resetGroupBy });
                },
                [re, V ? null : g]
              ),
                Object.assign(s, {
                  preGroupedRows: y,
                  preGroupedFlatRow: b,
                  preGroupedRowsById: E,
                  groupedRows: dt,
                  groupedFlatRows: He,
                  groupedRowsById: qe,
                  onlyGroupedFlatRows: xt,
                  onlyGroupedRowsById: Qe,
                  nonGroupedFlatRows: gt,
                  nonGroupedRowsById: l,
                  rows: dt,
                  flatRows: He,
                  rowsById: qe,
                  toggleGroupBy: Ze,
                  setGroupBy: Me,
                });
            }
            function ii(s) {
              s.allCells.forEach(function (g) {
                var y;
                (g.isGrouped =
                  g.column.isGrouped && g.column.id === s.groupByID),
                  (g.isPlaceholder = !g.isGrouped && g.column.isGrouped),
                  (g.isAggregated =
                    !g.isGrouped &&
                    !g.isPlaceholder &&
                    ((y = s.subRows) == null ? void 0 : y.length));
              });
            }
            function ln(s, g) {
              return s.reduce(function (y, b, E) {
                var R = "" + b.values[g];
                return (
                  (y[R] = Array.isArray(y[R]) ? y[R] : []), y[R].push(b), y
                );
              }, {});
            }
            var gu = /([0-9]+)/gm;
            function zi(s, g) {
              return s === g ? 0 : s > g ? 1 : -1;
            }
            function oi(s, g, y) {
              return [s.values[y], g.values[y]];
            }
            function mu(s) {
              return typeof s == "number"
                ? isNaN(s) || s === 1 / 0 || s === -1 / 0
                  ? ""
                  : String(s)
                : typeof s == "string"
                ? s
                : "";
            }
            var Qc = Object.freeze({
              __proto__: null,
              alphanumeric: function (s, g, y) {
                var b = oi(s, g, y),
                  E = b[0],
                  R = b[1];
                for (
                  E = mu(E),
                    R = mu(R),
                    E = E.split(gu).filter(Boolean),
                    R = R.split(gu).filter(Boolean);
                  E.length && R.length;

                ) {
                  var A = E.shift(),
                    j = R.shift(),
                    W = parseInt(A, 10),
                    V = parseInt(j, 10),
                    le = [W, V].sort();
                  if (isNaN(le[0])) {
                    if (A > j) return 1;
                    if (j > A) return -1;
                  } else {
                    if (isNaN(le[1])) return isNaN(W) ? -1 : 1;
                    if (W > V) return 1;
                    if (V > W) return -1;
                  }
                }
                return E.length - R.length;
              },
              datetime: function (s, g, y) {
                var b = oi(s, g, y),
                  E = b[0],
                  R = b[1];
                return zi((E = E.getTime()), (R = R.getTime()));
              },
              basic: function (s, g, y) {
                var b = oi(s, g, y);
                return zi(b[0], b[1]);
              },
              string: function (s, g, y) {
                var b = oi(s, g, y),
                  E = b[0],
                  R = b[1];
                for (
                  E = E.split("").filter(Boolean),
                    R = R.split("").filter(Boolean);
                  E.length && R.length;

                ) {
                  var A = E.shift(),
                    j = R.shift(),
                    W = A.toLowerCase(),
                    V = j.toLowerCase();
                  if (W > V) return 1;
                  if (V > W) return -1;
                  if (A > j) return 1;
                  if (j > A) return -1;
                }
                return E.length - R.length;
              },
              number: function (s, g, y) {
                var b = oi(s, g, y),
                  E = b[0],
                  R = b[1],
                  A = /[^0-9.]/gi;
                return zi(
                  (E = Number(String(E).replace(A, ""))),
                  (R = Number(String(R).replace(A, "")))
                );
              },
            });
            (c.resetSortBy = "resetSortBy"),
              (c.setSortBy = "setSortBy"),
              (c.toggleSortBy = "toggleSortBy"),
              (c.clearSortBy = "clearSortBy"),
              (w.sortType = "alphanumeric"),
              (w.sortDescFirst = !1);
            var yu = function (s) {
              (s.getSortByToggleProps = [Zc]),
                s.stateReducers.push(Jc),
                s.useInstance.push(ef);
            };
            yu.pluginName = "useSortBy";
            var Zc = function (s, g) {
              var y = g.instance,
                b = g.column,
                E = y.isMultiSortEvent,
                R =
                  E === void 0
                    ? function (A) {
                        return A.shiftKey;
                      }
                    : E;
              return [
                s,
                {
                  onClick: b.canSort
                    ? function (A) {
                        A.persist(),
                          b.toggleSortBy(void 0, !y.disableMultiSort && R(A));
                      }
                    : void 0,
                  style: { cursor: b.canSort ? "pointer" : void 0 },
                  title: b.canSort ? "Toggle SortBy" : void 0,
                },
              ];
            };
            function Jc(s, g, y, b) {
              if (g.type === c.init) return a({ sortBy: [] }, s);
              if (g.type === c.resetSortBy)
                return a({}, s, { sortBy: b.initialState.sortBy || [] });
              if (g.type === c.clearSortBy)
                return a({}, s, {
                  sortBy: s.sortBy.filter(function (ce) {
                    return ce.id !== g.columnId;
                  }),
                });
              if (g.type === c.setSortBy) return a({}, s, { sortBy: g.sortBy });
              if (g.type === c.toggleSortBy) {
                var E,
                  R = g.columnId,
                  A = g.desc,
                  j = g.multi,
                  W = b.allColumns,
                  V = b.disableMultiSort,
                  le = b.disableSortRemove,
                  oe = b.disableMultiRemove,
                  ae = b.maxMultiSortColCount,
                  X = ae === void 0 ? Number.MAX_SAFE_INTEGER : ae,
                  re = s.sortBy,
                  ye = W.find(function (ce) {
                    return ce.id === R;
                  }).sortDescFirst,
                  _e = re.find(function (ce) {
                    return ce.id === R;
                  }),
                  Fe = re.findIndex(function (ce) {
                    return ce.id === R;
                  }),
                  et = A != null,
                  Ie = [];
                return (
                  (E =
                    !V && j
                      ? _e
                        ? "toggle"
                        : "add"
                      : Fe !== re.length - 1 || re.length !== 1
                      ? "replace"
                      : _e
                      ? "toggle"
                      : "replace") != "toggle" ||
                    le ||
                    et ||
                    (j && oe) ||
                    !((_e && _e.desc && !ye) || (!_e.desc && ye)) ||
                    (E = "remove"),
                  E === "replace"
                    ? (Ie = [{ id: R, desc: et ? A : ye }])
                    : E === "add"
                    ? (Ie = [].concat(re, [
                        { id: R, desc: et ? A : ye },
                      ])).splice(0, Ie.length - X)
                    : E === "toggle"
                    ? (Ie = re.map(function (ce) {
                        return ce.id === R
                          ? a({}, ce, { desc: et ? A : !_e.desc })
                          : ce;
                      }))
                    : E === "remove" &&
                      (Ie = re.filter(function (ce) {
                        return ce.id !== R;
                      })),
                  a({}, s, { sortBy: Ie })
                );
              }
            }
            function ef(s) {
              var g = s.data,
                y = s.rows,
                b = s.flatRows,
                E = s.allColumns,
                R = s.orderByFn,
                A = R === void 0 ? bu : R,
                j = s.sortTypes,
                W = s.manualSortBy,
                V = s.defaultCanSort,
                le = s.disableSortBy,
                oe = s.flatHeaders,
                ae = s.state.sortBy,
                X = s.dispatch,
                re = s.plugins,
                ye = s.getHooks,
                _e = s.autoResetSortBy,
                Fe = _e === void 0 || _e;
              k(
                re,
                [
                  "useFilters",
                  "useGlobalFilter",
                  "useGroupBy",
                  "usePivotColumns",
                ],
                "useSortBy"
              );
              var et = r.useCallback(
                  function (He) {
                    X({ type: c.setSortBy, sortBy: He });
                  },
                  [X]
                ),
                Ie = r.useCallback(
                  function (He, qe, xt) {
                    X({
                      type: c.toggleSortBy,
                      columnId: He,
                      desc: qe,
                      multi: xt,
                    });
                  },
                  [X]
                ),
                ce = N(s);
              oe.forEach(function (He) {
                var qe = He.accessor,
                  xt = He.canSort,
                  Qe = He.disableSortBy,
                  gt = He.id,
                  l = qe
                    ? ke(Qe !== !0 && void 0, le !== !0 && void 0, !0)
                    : ke(V, xt, !1);
                (He.canSort = l),
                  He.canSort &&
                    ((He.toggleSortBy = function (m, v) {
                      return Ie(He.id, m, v);
                    }),
                    (He.clearSortBy = function () {
                      X({ type: c.clearSortBy, columnId: He.id });
                    })),
                  (He.getSortByToggleProps = _(ye().getSortByToggleProps, {
                    instance: ce(),
                    column: He,
                  }));
                var d = ae.find(function (m) {
                  return m.id === gt;
                });
                (He.isSorted = !!d),
                  (He.sortedIndex = ae.findIndex(function (m) {
                    return m.id === gt;
                  })),
                  (He.isSortedDesc = He.isSorted ? d.desc : void 0);
              });
              var Ze = r.useMemo(
                  function () {
                    if (W || !ae.length) return [y, b];
                    var He = [],
                      qe = ae.filter(function (xt) {
                        return E.find(function (Qe) {
                          return Qe.id === xt.id;
                        });
                      });
                    return [
                      (function xt(Qe) {
                        var gt = A(
                          Qe,
                          qe.map(function (l) {
                            var d = E.find(function (S) {
                              return S.id === l.id;
                            });
                            if (!d)
                              throw new Error(
                                "React-Table: Could not find a column with id: " +
                                  l.id +
                                  " while sorting"
                              );
                            var m = d.sortType,
                              v = st(m) || (j || {})[m] || Qc[m];
                            if (!v)
                              throw new Error(
                                "React-Table: Could not find a valid sortType of '" +
                                  m +
                                  "' for column '" +
                                  l.id +
                                  "'."
                              );
                            return function (S, C) {
                              return v(S, C, l.id, l.desc);
                            };
                          }),
                          qe.map(function (l) {
                            var d = E.find(function (m) {
                              return m.id === l.id;
                            });
                            return d && d.sortInverted ? l.desc : !l.desc;
                          })
                        );
                        return (
                          gt.forEach(function (l) {
                            He.push(l),
                              l.subRows &&
                                l.subRows.length !== 0 &&
                                (l.subRows = xt(l.subRows));
                          }),
                          gt
                        );
                      })(y),
                      He,
                    ];
                  },
                  [W, ae, y, b, E, A, j]
                ),
                Me = Ze[0],
                Xe = Ze[1],
                dt = N(Fe);
              M(
                function () {
                  dt() && X({ type: c.resetSortBy });
                },
                [W ? null : g]
              ),
                Object.assign(s, {
                  preSortedRows: y,
                  preSortedFlatRows: b,
                  sortedRows: Me,
                  sortedFlatRows: Xe,
                  rows: Me,
                  flatRows: Xe,
                  setSortBy: et,
                  toggleSortBy: Ie,
                });
            }
            function bu(s, g, y) {
              return [].concat(s).sort(function (b, E) {
                for (var R = 0; R < g.length; R += 1) {
                  var A = g[R],
                    j = y[R] === !1 || y[R] === "desc",
                    W = A(b, E);
                  if (W !== 0) return j ? -W : W;
                }
                return y[0] ? b.index - E.index : E.index - b.index;
              });
            }
            (c.resetPage = "resetPage"),
              (c.gotoPage = "gotoPage"),
              (c.setPageSize = "setPageSize");
            var Go = function (s) {
              s.stateReducers.push(tf), s.useInstance.push(nf);
            };
            function tf(s, g, y, b) {
              if (g.type === c.init)
                return a({ pageSize: 10, pageIndex: 0 }, s);
              if (g.type === c.resetPage)
                return a({}, s, { pageIndex: b.initialState.pageIndex || 0 });
              if (g.type === c.gotoPage) {
                var E = b.pageCount,
                  R = b.page,
                  A = F(g.pageIndex, s.pageIndex),
                  j = !1;
                return (
                  A > s.pageIndex
                    ? (j = E === -1 ? R.length >= s.pageSize : A < E)
                    : A < s.pageIndex && (j = A > -1),
                  j ? a({}, s, { pageIndex: A }) : s
                );
              }
              if (g.type === c.setPageSize) {
                var W = g.pageSize,
                  V = s.pageSize * s.pageIndex;
                return a({}, s, { pageIndex: Math.floor(V / W), pageSize: W });
              }
            }
            function nf(s) {
              var g = s.rows,
                y = s.autoResetPage,
                b = y === void 0 || y,
                E = s.manualExpandedKey,
                R = E === void 0 ? "expanded" : E,
                A = s.plugins,
                j = s.pageCount,
                W = s.paginateExpandedRows,
                V = W === void 0 || W,
                le = s.expandSubRows,
                oe = le === void 0 || le,
                ae = s.state,
                X = ae.pageSize,
                re = ae.pageIndex,
                ye = ae.expanded,
                _e = ae.globalFilter,
                Fe = ae.filters,
                et = ae.groupBy,
                Ie = ae.sortBy,
                ce = s.dispatch,
                Ze = s.data,
                Me = s.manualPagination;
              k(
                A,
                [
                  "useGlobalFilter",
                  "useFilters",
                  "useGroupBy",
                  "useSortBy",
                  "useExpanded",
                ],
                "usePagination"
              );
              var Xe = N(b);
              M(
                function () {
                  Xe() && ce({ type: c.resetPage });
                },
                [ce, Me ? null : Ze, _e, Fe, et, Ie]
              );
              var dt = Me ? j : Math.ceil(g.length / X),
                He = r.useMemo(
                  function () {
                    return dt > 0
                      ? []
                          .concat(new Array(dt))
                          .fill(null)
                          .map(function (v, S) {
                            return S;
                          })
                      : [];
                  },
                  [dt]
                ),
                qe = r.useMemo(
                  function () {
                    var v;
                    if (Me) v = g;
                    else {
                      var S = X * re,
                        C = S + X;
                      v = g.slice(S, C);
                    }
                    return V
                      ? v
                      : lt(v, {
                          manualExpandedKey: R,
                          expanded: ye,
                          expandSubRows: oe,
                        });
                  },
                  [oe, ye, R, Me, re, X, V, g]
                ),
                xt = re > 0,
                Qe = dt === -1 ? qe.length >= X : re < dt - 1,
                gt = r.useCallback(
                  function (v) {
                    ce({ type: c.gotoPage, pageIndex: v });
                  },
                  [ce]
                ),
                l = r.useCallback(
                  function () {
                    return gt(function (v) {
                      return v - 1;
                    });
                  },
                  [gt]
                ),
                d = r.useCallback(
                  function () {
                    return gt(function (v) {
                      return v + 1;
                    });
                  },
                  [gt]
                ),
                m = r.useCallback(
                  function (v) {
                    ce({ type: c.setPageSize, pageSize: v });
                  },
                  [ce]
                );
              Object.assign(s, {
                pageOptions: He,
                pageCount: dt,
                page: qe,
                canPreviousPage: xt,
                canNextPage: Qe,
                gotoPage: gt,
                previousPage: l,
                nextPage: d,
                setPageSize: m,
              });
            }
            (Go.pluginName = "usePagination"),
              (c.resetPivot = "resetPivot"),
              (c.togglePivot = "togglePivot");
            var jo = function (s) {
              (s.getPivotToggleProps = [rf]),
                s.stateReducers.push(of),
                s.useInstanceAfterData.push(af),
                s.allColumns.push(uf),
                s.accessValue.push(sf),
                s.materializedColumns.push(xu),
                s.materializedColumnsDeps.push(_u),
                s.visibleColumns.push(lf),
                s.visibleColumnsDeps.push(cf),
                s.useInstance.push(ff),
                s.prepareRow.push(df);
            };
            jo.pluginName = "usePivotColumns";
            var wu = [],
              rf = function (s, g) {
                var y = g.header;
                return [
                  s,
                  {
                    onClick: y.canPivot
                      ? function (b) {
                          b.persist(), y.togglePivot();
                        }
                      : void 0,
                    style: { cursor: y.canPivot ? "pointer" : void 0 },
                    title: "Toggle Pivot",
                  },
                ];
              };
            function of(s, g, y, b) {
              if (g.type === c.init) return a({ pivotColumns: wu }, s);
              if (g.type === c.resetPivot)
                return a({}, s, {
                  pivotColumns: b.initialState.pivotColumns || wu,
                });
              if (g.type === c.togglePivot) {
                var E = g.columnId,
                  R = g.value,
                  A = R !== void 0 ? R : !s.pivotColumns.includes(E);
                return a(
                  {},
                  s,
                  A
                    ? { pivotColumns: [].concat(s.pivotColumns, [E]) }
                    : {
                        pivotColumns: s.pivotColumns.filter(function (j) {
                          return j !== E;
                        }),
                      }
                );
              }
            }
            function af(s) {
              s.allColumns.forEach(function (g) {
                g.isPivotSource = s.state.pivotColumns.includes(g.id);
              });
            }
            function uf(s, g) {
              var y = g.instance;
              return (
                s.forEach(function (b) {
                  (b.isPivotSource = y.state.pivotColumns.includes(b.id)),
                    (b.uniqueValues = new Set());
                }),
                s
              );
            }
            function sf(s, g) {
              var y = g.column;
              return y.uniqueValues && s !== void 0 && y.uniqueValues.add(s), s;
            }
            function xu(s, g) {
              var y = g.instance,
                b = y.allColumns,
                E = y.state;
              if (!E.pivotColumns.length || !E.groupBy || !E.groupBy.length)
                return s;
              var R = E.pivotColumns
                  .map(function (W) {
                    return b.find(function (V) {
                      return V.id === W;
                    });
                  })
                  .filter(Boolean),
                A = b.filter(function (W) {
                  return (
                    !W.isPivotSource &&
                    !E.groupBy.includes(W.id) &&
                    !E.pivotColumns.includes(W.id)
                  );
                }),
                j = he(
                  (function W(V, le, oe) {
                    V === void 0 && (V = 0), oe === void 0 && (oe = []);
                    var ae = R[V];
                    return ae
                      ? Array.from(ae.uniqueValues)
                          .sort()
                          .map(function (X) {
                            var re = a({}, ae, {
                              Header:
                                ae.PivotHeader || typeof ae.header == "string"
                                  ? ae.Header + ": " + X
                                  : X,
                              isPivotGroup: !0,
                              parent: le,
                              depth: V,
                              id: le
                                ? le.id + "." + ae.id + "." + X
                                : ae.id + "." + X,
                              pivotValue: X,
                            });
                            return (
                              (re.columns = W(
                                V + 1,
                                re,
                                [].concat(oe, [
                                  function (ye) {
                                    return ye.values[ae.id] === X;
                                  },
                                ])
                              )),
                              re
                            );
                          })
                      : A.map(function (X) {
                          return a({}, X, {
                            canPivot: !1,
                            isPivoted: !0,
                            parent: le,
                            depth: V,
                            id: "" + (le ? le.id + "." + X.id : X.id),
                            accessor: function (re, ye, _e) {
                              if (
                                oe.every(function (Fe) {
                                  return Fe(_e);
                                })
                              )
                                return _e.values[X.id];
                            },
                          });
                        });
                  })()
                );
              return [].concat(s, j);
            }
            function _u(s, g) {
              var y = g.instance.state,
                b = y.pivotColumns,
                E = y.groupBy;
              return [].concat(s, [b, E]);
            }
            function lf(s, g) {
              var y = g.instance.state;
              return (
                (s = s.filter(function (b) {
                  return !b.isPivotSource;
                })),
                y.pivotColumns.length &&
                  y.groupBy &&
                  y.groupBy.length &&
                  (s = s.filter(function (b) {
                    return b.isGrouped || b.isPivoted;
                  })),
                s
              );
            }
            function cf(s, g) {
              var y = g.instance;
              return [].concat(s, [y.state.pivotColumns, y.state.groupBy]);
            }
            function ff(s) {
              var g = s.columns,
                y = s.allColumns,
                b = s.flatHeaders,
                E = s.getHooks,
                R = s.plugins,
                A = s.dispatch,
                j = s.autoResetPivot,
                W = j === void 0 || j,
                V = s.manaulPivot,
                le = s.disablePivot,
                oe = s.defaultCanPivot;
              k(R, ["useGroupBy"], "usePivotColumns");
              var ae = N(s);
              y.forEach(function (re) {
                var ye = re.accessor,
                  _e = re.defaultPivot,
                  Fe = re.disablePivot;
                (re.canPivot = ye
                  ? ke(
                      re.canPivot,
                      Fe !== !0 && void 0,
                      le !== !0 && void 0,
                      !0
                    )
                  : ke(re.canPivot, _e, oe, !1)),
                  re.canPivot &&
                    (re.togglePivot = function () {
                      return s.togglePivot(re.id);
                    }),
                  (re.Aggregated = re.Aggregated || re.Cell);
              }),
                b.forEach(function (re) {
                  re.getPivotToggleProps = _(E().getPivotToggleProps, {
                    instance: ae(),
                    header: re,
                  });
                });
              var X = N(W);
              M(
                function () {
                  X() && A({ type: c.resetPivot });
                },
                [A, V ? null : g]
              ),
                Object.assign(s, {
                  togglePivot: function (re, ye) {
                    A({ type: c.togglePivot, columnId: re, value: ye });
                  },
                });
            }
            function df(s) {
              s.allCells.forEach(function (g) {
                g.isPivoted = g.column.isPivoted;
              });
            }
            (c.resetSelectedRows = "resetSelectedRows"),
              (c.toggleAllRowsSelected = "toggleAllRowsSelected"),
              (c.toggleRowSelected = "toggleRowSelected"),
              (c.toggleAllPageRowsSelected = "toggleAllPageRowsSelected");
            var Su = function (s) {
              (s.getToggleRowSelectedProps = [Ho]),
                (s.getToggleAllRowsSelectedProps = [ai]),
                (s.getToggleAllPageRowsSelectedProps = [Ru]),
                s.stateReducers.push(hf),
                s.useInstance.push(Cu),
                s.prepareRow.push(pf);
            };
            Su.pluginName = "useRowSelect";
            var Ho = function (s, g) {
                var y = g.instance,
                  b = g.row,
                  E = y.manualRowSelectedKey,
                  R = E === void 0 ? "isSelected" : E;
                return [
                  s,
                  {
                    onChange: function (A) {
                      b.toggleRowSelected(A.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: !(!b.original || !b.original[R]) || b.isSelected,
                    title: "Toggle Row Selected",
                    indeterminate: b.isSomeSelected,
                  },
                ];
              },
              ai = function (s, g) {
                var y = g.instance;
                return [
                  s,
                  {
                    onChange: function (b) {
                      y.toggleAllRowsSelected(b.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: y.isAllRowsSelected,
                    title: "Toggle All Rows Selected",
                    indeterminate: Boolean(
                      !y.isAllRowsSelected &&
                        Object.keys(y.state.selectedRowIds).length
                    ),
                  },
                ];
              },
              Ru = function (s, g) {
                var y = g.instance;
                return [
                  s,
                  {
                    onChange: function (b) {
                      y.toggleAllPageRowsSelected(b.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: y.isAllPageRowsSelected,
                    title: "Toggle All Current Page Rows Selected",
                    indeterminate: Boolean(
                      !y.isAllPageRowsSelected &&
                        y.page.some(function (b) {
                          var E = b.id;
                          return y.state.selectedRowIds[E];
                        })
                    ),
                  },
                ];
              };
            function hf(s, g, y, b) {
              if (g.type === c.init) return a({ selectedRowIds: {} }, s);
              if (g.type === c.resetSelectedRows)
                return a({}, s, {
                  selectedRowIds: b.initialState.selectedRowIds || {},
                });
              if (g.type === c.toggleAllRowsSelected) {
                var E = g.value,
                  R = b.isAllRowsSelected,
                  A = b.rowsById,
                  j = b.nonGroupedRowsById,
                  W = j === void 0 ? A : j,
                  V = E !== void 0 ? E : !R,
                  le = Object.assign({}, s.selectedRowIds);
                return (
                  V
                    ? Object.keys(W).forEach(function (gt) {
                        le[gt] = !0;
                      })
                    : Object.keys(W).forEach(function (gt) {
                        delete le[gt];
                      }),
                  a({}, s, { selectedRowIds: le })
                );
              }
              if (g.type === c.toggleRowSelected) {
                var oe = g.id,
                  ae = g.value,
                  X = b.rowsById,
                  re = b.selectSubRows,
                  ye = re === void 0 || re,
                  _e = b.getSubRows,
                  Fe = s.selectedRowIds[oe],
                  et = ae !== void 0 ? ae : !Fe;
                if (Fe === et) return s;
                var Ie = a({}, s.selectedRowIds);
                return (
                  (function gt(l) {
                    var d = X[l];
                    if (
                      d &&
                      (d.isGrouped || (et ? (Ie[l] = !0) : delete Ie[l]),
                      ye && _e(d))
                    )
                      return _e(d).forEach(function (m) {
                        return gt(m.id);
                      });
                  })(oe),
                  a({}, s, { selectedRowIds: Ie })
                );
              }
              if (g.type === c.toggleAllPageRowsSelected) {
                var ce = g.value,
                  Ze = b.page,
                  Me = b.rowsById,
                  Xe = b.selectSubRows,
                  dt = Xe === void 0 || Xe,
                  He = b.isAllPageRowsSelected,
                  qe = b.getSubRows,
                  xt = ce !== void 0 ? ce : !He,
                  Qe = a({}, s.selectedRowIds);
                return (
                  Ze.forEach(function (gt) {
                    return (function l(d) {
                      var m = Me[d];
                      if (
                        (m.isGrouped || (xt ? (Qe[d] = !0) : delete Qe[d]),
                        dt && qe(m))
                      )
                        return qe(m).forEach(function (v) {
                          return l(v.id);
                        });
                    })(gt.id);
                  }),
                  a({}, s, { selectedRowIds: Qe })
                );
              }
              return s;
            }
            function Cu(s) {
              var g = s.data,
                y = s.rows,
                b = s.getHooks,
                E = s.plugins,
                R = s.rowsById,
                A = s.nonGroupedRowsById,
                j = A === void 0 ? R : A,
                W = s.autoResetSelectedRows,
                V = W === void 0 || W,
                le = s.state.selectedRowIds,
                oe = s.selectSubRows,
                ae = oe === void 0 || oe,
                X = s.dispatch,
                re = s.page,
                ye = s.getSubRows;
              k(
                E,
                [
                  "useFilters",
                  "useGroupBy",
                  "useSortBy",
                  "useExpanded",
                  "usePagination",
                ],
                "useRowSelect"
              );
              var _e = r.useMemo(
                  function () {
                    var qe = [];
                    return (
                      y.forEach(function (xt) {
                        var Qe = ae
                          ? (function gt(l, d, m) {
                              if (d[l.id]) return !0;
                              var v = m(l);
                              if (v && v.length) {
                                var S = !0,
                                  C = !1;
                                return (
                                  v.forEach(function (x) {
                                    (C && !S) ||
                                      (gt(x, d, m) ? (C = !0) : (S = !1));
                                  }),
                                  !!S || (!!C && null)
                                );
                              }
                              return !1;
                            })(xt, le, ye)
                          : !!le[xt.id];
                        (xt.isSelected = !!Qe),
                          (xt.isSomeSelected = Qe === null),
                          Qe && qe.push(xt);
                      }),
                      qe
                    );
                  },
                  [y, ae, le, ye]
                ),
                Fe = Boolean(Object.keys(j).length && Object.keys(le).length),
                et = Fe;
              Fe &&
                Object.keys(j).some(function (qe) {
                  return !le[qe];
                }) &&
                (Fe = !1),
                Fe ||
                  (re &&
                    re.length &&
                    re.some(function (qe) {
                      var xt = qe.id;
                      return !le[xt];
                    }) &&
                    (et = !1));
              var Ie = N(V);
              M(
                function () {
                  Ie() && X({ type: c.resetSelectedRows });
                },
                [X, g]
              );
              var ce = r.useCallback(
                  function (qe) {
                    return X({ type: c.toggleAllRowsSelected, value: qe });
                  },
                  [X]
                ),
                Ze = r.useCallback(
                  function (qe) {
                    return X({ type: c.toggleAllPageRowsSelected, value: qe });
                  },
                  [X]
                ),
                Me = r.useCallback(
                  function (qe, xt) {
                    return X({ type: c.toggleRowSelected, id: qe, value: xt });
                  },
                  [X]
                ),
                Xe = N(s),
                dt = _(b().getToggleAllRowsSelectedProps, { instance: Xe() }),
                He = _(b().getToggleAllPageRowsSelectedProps, {
                  instance: Xe(),
                });
              Object.assign(s, {
                selectedFlatRows: _e,
                isAllRowsSelected: Fe,
                isAllPageRowsSelected: et,
                toggleRowSelected: Me,
                toggleAllRowsSelected: ce,
                getToggleAllRowsSelectedProps: dt,
                getToggleAllPageRowsSelectedProps: He,
                toggleAllPageRowsSelected: Ze,
              });
            }
            function pf(s, g) {
              var y = g.instance;
              (s.toggleRowSelected = function (b) {
                return y.toggleRowSelected(s.id, b);
              }),
                (s.getToggleRowSelectedProps = _(
                  y.getHooks().getToggleRowSelectedProps,
                  { instance: y, row: s }
                ));
            }
            var Tu = function (s) {
                return {};
              },
              Pu = function (s) {
                return {};
              };
            (c.setRowState = "setRowState"),
              (c.setCellState = "setCellState"),
              (c.resetRowState = "resetRowState");
            var Wo = function (s) {
              s.stateReducers.push(vf),
                s.useInstance.push(Nu),
                s.prepareRow.push(gf);
            };
            function vf(s, g, y, b) {
              var E = b.initialRowStateAccessor,
                R = E === void 0 ? Tu : E,
                A = b.initialCellStateAccessor,
                j = A === void 0 ? Pu : A,
                W = b.rowsById;
              if (g.type === c.init) return a({ rowState: {} }, s);
              if (g.type === c.resetRowState)
                return a({}, s, { rowState: b.initialState.rowState || {} });
              if (g.type === c.setRowState) {
                var V,
                  le = g.rowId,
                  oe = g.value,
                  ae = s.rowState[le] !== void 0 ? s.rowState[le] : R(W[le]);
                return a({}, s, {
                  rowState: a(
                    {},
                    s.rowState,
                    ((V = {}), (V[le] = F(oe, ae)), V)
                  ),
                });
              }
              if (g.type === c.setCellState) {
                var X,
                  re,
                  ye,
                  _e,
                  Fe,
                  et = g.rowId,
                  Ie = g.columnId,
                  ce = g.value,
                  Ze = s.rowState[et] !== void 0 ? s.rowState[et] : R(W[et]),
                  Me =
                    (Ze == null || (X = Ze.cellState) == null
                      ? void 0
                      : X[Ie]) !== void 0
                      ? Ze.cellState[Ie]
                      : j(
                          (re = W[et]) == null || (ye = re.cells) == null
                            ? void 0
                            : ye.find(function (Xe) {
                                return Xe.column.id === Ie;
                              })
                        );
                return a({}, s, {
                  rowState: a(
                    {},
                    s.rowState,
                    ((Fe = {}),
                    (Fe[et] = a({}, Ze, {
                      cellState: a(
                        {},
                        Ze.cellState || {},
                        ((_e = {}), (_e[Ie] = F(ce, Me)), _e)
                      ),
                    })),
                    Fe)
                  ),
                });
              }
            }
            function Nu(s) {
              var g = s.autoResetRowState,
                y = g === void 0 || g,
                b = s.data,
                E = s.dispatch,
                R = r.useCallback(
                  function (W, V) {
                    return E({ type: c.setRowState, rowId: W, value: V });
                  },
                  [E]
                ),
                A = r.useCallback(
                  function (W, V, le) {
                    return E({
                      type: c.setCellState,
                      rowId: W,
                      columnId: V,
                      value: le,
                    });
                  },
                  [E]
                ),
                j = N(y);
              M(
                function () {
                  j() && E({ type: c.resetRowState });
                },
                [b]
              ),
                Object.assign(s, { setRowState: R, setCellState: A });
            }
            function gf(s, g) {
              var y = g.instance,
                b = y.initialRowStateAccessor,
                E = b === void 0 ? Tu : b,
                R = y.initialCellStateAccessor,
                A = R === void 0 ? Pu : R,
                j = y.state.rowState;
              s &&
                ((s.state = j[s.id] !== void 0 ? j[s.id] : E(s)),
                (s.setState = function (W) {
                  return y.setRowState(s.id, W);
                }),
                s.cells.forEach(function (W) {
                  s.state.cellState || (s.state.cellState = {}),
                    (W.state =
                      s.state.cellState[W.column.id] !== void 0
                        ? s.state.cellState[W.column.id]
                        : A(W)),
                    (W.setState = function (V) {
                      return y.setCellState(s.id, W.column.id, V);
                    });
                }));
            }
            (Wo.pluginName = "useRowState"),
              (c.resetColumnOrder = "resetColumnOrder"),
              (c.setColumnOrder = "setColumnOrder");
            var Eu = function (s) {
              s.stateReducers.push(Mu),
                s.visibleColumnsDeps.push(function (g, y) {
                  var b = y.instance;
                  return [].concat(g, [b.state.columnOrder]);
                }),
                s.visibleColumns.push(Ou),
                s.useInstance.push(mf);
            };
            function Mu(s, g, y, b) {
              return g.type === c.init
                ? a({ columnOrder: [] }, s)
                : g.type === c.resetColumnOrder
                ? a({}, s, { columnOrder: b.initialState.columnOrder || [] })
                : g.type === c.setColumnOrder
                ? a({}, s, { columnOrder: F(g.columnOrder, s.columnOrder) })
                : void 0;
            }
            function Ou(s, g) {
              var y = g.instance.state.columnOrder;
              if (!y || !y.length) return s;
              for (
                var b = [].concat(y),
                  E = [].concat(s),
                  R = [],
                  A = function () {
                    var j = b.shift(),
                      W = E.findIndex(function (V) {
                        return V.id === j;
                      });
                    W > -1 && R.push(E.splice(W, 1)[0]);
                  };
                E.length && b.length;

              )
                A();
              return [].concat(R, E);
            }
            function mf(s) {
              var g = s.dispatch;
              s.setColumnOrder = r.useCallback(
                function (y) {
                  return g({ type: c.setColumnOrder, columnOrder: y });
                },
                [g]
              );
            }
            (Eu.pluginName = "useColumnOrder"),
              (w.canResize = !0),
              (c.columnStartResizing = "columnStartResizing"),
              (c.columnResizing = "columnResizing"),
              (c.columnDoneResizing = "columnDoneResizing"),
              (c.resetResize = "resetResize");
            var Au = function (s) {
                (s.getResizerProps = [yf]),
                  s.getHeaderProps.push({ style: { position: "relative" } }),
                  s.stateReducers.push(bf),
                  s.useInstance.push(xf),
                  s.useInstanceBeforeDimensions.push(wf);
              },
              yf = function (s, g) {
                var y = g.instance,
                  b = g.header,
                  E = y.dispatch,
                  R = function (A, j) {
                    var W = !1;
                    if (A.type === "touchstart") {
                      if (A.touches && A.touches.length > 1) return;
                      W = !0;
                    }
                    var V,
                      le,
                      oe = (function (Ie) {
                        var ce = [];
                        return (
                          (function Ze(Me) {
                            Me.columns &&
                              Me.columns.length &&
                              Me.columns.map(Ze),
                              ce.push(Me);
                          })(Ie),
                          ce
                        );
                      })(j).map(function (Ie) {
                        return [Ie.id, Ie.totalWidth];
                      }),
                      ae = W ? Math.round(A.touches[0].clientX) : A.clientX,
                      X = function () {
                        window.cancelAnimationFrame(V),
                          (V = null),
                          E({ type: c.columnDoneResizing });
                      },
                      re = function () {
                        window.cancelAnimationFrame(V),
                          (V = null),
                          E({ type: c.columnResizing, clientX: le });
                      },
                      ye = function (Ie) {
                        (le = Ie), V || (V = window.requestAnimationFrame(re));
                      },
                      _e = {
                        mouse: {
                          moveEvent: "mousemove",
                          moveHandler: function (Ie) {
                            return ye(Ie.clientX);
                          },
                          upEvent: "mouseup",
                          upHandler: function (Ie) {
                            document.removeEventListener(
                              "mousemove",
                              _e.mouse.moveHandler
                            ),
                              document.removeEventListener(
                                "mouseup",
                                _e.mouse.upHandler
                              ),
                              X();
                          },
                        },
                        touch: {
                          moveEvent: "touchmove",
                          moveHandler: function (Ie) {
                            return (
                              Ie.cancelable &&
                                (Ie.preventDefault(), Ie.stopPropagation()),
                              ye(Ie.touches[0].clientX),
                              !1
                            );
                          },
                          upEvent: "touchend",
                          upHandler: function (Ie) {
                            document.removeEventListener(
                              _e.touch.moveEvent,
                              _e.touch.moveHandler
                            ),
                              document.removeEventListener(
                                _e.touch.upEvent,
                                _e.touch.moveHandler
                              ),
                              X();
                          },
                        },
                      },
                      Fe = W ? _e.touch : _e.mouse,
                      et = !!(function () {
                        if (typeof se == "boolean") return se;
                        var Ie = !1;
                        try {
                          var ce = {
                            get passive() {
                              return (Ie = !0), !1;
                            },
                          };
                          window.addEventListener("test", null, ce),
                            window.removeEventListener("test", null, ce);
                        } catch {
                          Ie = !1;
                        }
                        return (se = Ie);
                      })() && { passive: !1 };
                    document.addEventListener(Fe.moveEvent, Fe.moveHandler, et),
                      document.addEventListener(Fe.upEvent, Fe.upHandler, et),
                      E({
                        type: c.columnStartResizing,
                        columnId: j.id,
                        columnWidth: j.totalWidth,
                        headerIdWidths: oe,
                        clientX: ae,
                      });
                  };
                return [
                  s,
                  {
                    onMouseDown: function (A) {
                      return A.persist() || R(A, b);
                    },
                    onTouchStart: function (A) {
                      return A.persist() || R(A, b);
                    },
                    style: { cursor: "col-resize" },
                    draggable: !1,
                    role: "separator",
                  },
                ];
              };
            function bf(s, g) {
              if (g.type === c.init)
                return a({ columnResizing: { columnWidths: {} } }, s);
              if (g.type === c.resetResize)
                return a({}, s, { columnResizing: { columnWidths: {} } });
              if (g.type === c.columnStartResizing) {
                var y = g.clientX,
                  b = g.columnId,
                  E = g.columnWidth,
                  R = g.headerIdWidths;
                return a({}, s, {
                  columnResizing: a({}, s.columnResizing, {
                    startX: y,
                    headerIdWidths: R,
                    columnWidth: E,
                    isResizingColumn: b,
                  }),
                });
              }
              if (g.type === c.columnResizing) {
                var A = g.clientX,
                  j = s.columnResizing,
                  W = j.startX,
                  V = j.columnWidth,
                  le = j.headerIdWidths,
                  oe = (A - W) / V,
                  ae = {};
                return (
                  (le === void 0 ? [] : le).forEach(function (X) {
                    var re = X[0],
                      ye = X[1];
                    ae[re] = Math.max(ye + ye * oe, 0);
                  }),
                  a({}, s, {
                    columnResizing: a({}, s.columnResizing, {
                      columnWidths: a(
                        {},
                        s.columnResizing.columnWidths,
                        {},
                        ae
                      ),
                    }),
                  })
                );
              }
              return g.type === c.columnDoneResizing
                ? a({}, s, {
                    columnResizing: a({}, s.columnResizing, {
                      startX: null,
                      isResizingColumn: null,
                    }),
                  })
                : void 0;
            }
            Au.pluginName = "useResizeColumns";
            var wf = function (s) {
              var g = s.flatHeaders,
                y = s.disableResizing,
                b = s.getHooks,
                E = s.state.columnResizing,
                R = N(s);
              g.forEach(function (A) {
                var j = ke(
                  A.disableResizing !== !0 && void 0,
                  y !== !0 && void 0,
                  !0
                );
                (A.canResize = j),
                  (A.width =
                    E.columnWidths[A.id] || A.originalWidth || A.width),
                  (A.isResizing = E.isResizingColumn === A.id),
                  j &&
                    (A.getResizerProps = _(b().getResizerProps, {
                      instance: R(),
                      header: A,
                    }));
              });
            };
            function xf(s) {
              var g = s.plugins,
                y = s.dispatch,
                b = s.autoResetResize,
                E = b === void 0 || b,
                R = s.columns;
              k(g, ["useAbsoluteLayout"], "useResizeColumns");
              var A = N(E);
              M(
                function () {
                  A() && y({ type: c.resetResize });
                },
                [R]
              );
              var j = r.useCallback(
                function () {
                  return y({ type: c.resetResize });
                },
                [y]
              );
              Object.assign(s, { resetResizing: j });
            }
            var Vo = { position: "absolute", top: 0 },
              ku = function (s) {
                s.getTableBodyProps.push(Li),
                  s.getRowProps.push(Li),
                  s.getHeaderGroupProps.push(Li),
                  s.getFooterGroupProps.push(Li),
                  s.getHeaderProps.push(function (g, y) {
                    var b = y.column;
                    return [
                      g,
                      {
                        style: a({}, Vo, {
                          left: b.totalLeft + "px",
                          width: b.totalWidth + "px",
                        }),
                      },
                    ];
                  }),
                  s.getCellProps.push(function (g, y) {
                    var b = y.cell;
                    return [
                      g,
                      {
                        style: a({}, Vo, {
                          left: b.column.totalLeft + "px",
                          width: b.column.totalWidth + "px",
                        }),
                      },
                    ];
                  }),
                  s.getFooterProps.push(function (g, y) {
                    var b = y.column;
                    return [
                      g,
                      {
                        style: a({}, Vo, {
                          left: b.totalLeft + "px",
                          width: b.totalWidth + "px",
                        }),
                      },
                    ];
                  });
              };
            ku.pluginName = "useAbsoluteLayout";
            var Li = function (s, g) {
                return [
                  s,
                  {
                    style: {
                      position: "relative",
                      width: g.instance.totalColumnsWidth + "px",
                    },
                  },
                ];
              },
              Uo = { display: "inline-block", boxSizing: "border-box" },
              qo = function (s, g) {
                return [
                  s,
                  {
                    style: {
                      display: "flex",
                      width: g.instance.totalColumnsWidth + "px",
                    },
                  },
                ];
              },
              $u = function (s) {
                s.getRowProps.push(qo),
                  s.getHeaderGroupProps.push(qo),
                  s.getFooterGroupProps.push(qo),
                  s.getHeaderProps.push(function (g, y) {
                    var b = y.column;
                    return [
                      g,
                      { style: a({}, Uo, { width: b.totalWidth + "px" }) },
                    ];
                  }),
                  s.getCellProps.push(function (g, y) {
                    var b = y.cell;
                    return [
                      g,
                      {
                        style: a({}, Uo, { width: b.column.totalWidth + "px" }),
                      },
                    ];
                  }),
                  s.getFooterProps.push(function (g, y) {
                    var b = y.column;
                    return [
                      g,
                      { style: a({}, Uo, { width: b.totalWidth + "px" }) },
                    ];
                  });
              };
            function Yo(s) {
              s.getTableProps.push(_f),
                s.getRowProps.push(Xo),
                s.getHeaderGroupProps.push(Xo),
                s.getFooterGroupProps.push(Xo),
                s.getHeaderProps.push(Sf),
                s.getCellProps.push(Rf),
                s.getFooterProps.push(Cf);
            }
            ($u.pluginName = "useBlockLayout"),
              (Yo.pluginName = "useFlexLayout");
            var _f = function (s, g) {
                return [
                  s,
                  {
                    style: { minWidth: g.instance.totalColumnsMinWidth + "px" },
                  },
                ];
              },
              Xo = function (s, g) {
                return [
                  s,
                  {
                    style: {
                      display: "flex",
                      flex: "1 0 auto",
                      minWidth: g.instance.totalColumnsMinWidth + "px",
                    },
                  },
                ];
              },
              Sf = function (s, g) {
                var y = g.column;
                return [
                  s,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: y.totalFlexWidth
                        ? y.totalFlexWidth + " 0 auto"
                        : void 0,
                      minWidth: y.totalMinWidth + "px",
                      width: y.totalWidth + "px",
                    },
                  },
                ];
              },
              Rf = function (s, g) {
                var y = g.cell;
                return [
                  s,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: y.column.totalFlexWidth + " 0 auto",
                      minWidth: y.column.totalMinWidth + "px",
                      width: y.column.totalWidth + "px",
                    },
                  },
                ];
              },
              Cf = function (s, g) {
                var y = g.column;
                return [
                  s,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: y.totalFlexWidth
                        ? y.totalFlexWidth + " 0 auto"
                        : void 0,
                      minWidth: y.totalMinWidth + "px",
                      width: y.totalWidth + "px",
                    },
                  },
                ];
              };
            function Fu(s) {
              s.stateReducers.push(zu),
                s.getTableProps.push(Iu),
                s.getHeaderProps.push(Bu),
                s.getRowProps.push(Du);
            }
            (c.columnStartResizing = "columnStartResizing"),
              (c.columnResizing = "columnResizing"),
              (c.columnDoneResizing = "columnDoneResizing"),
              (c.resetResize = "resetResize"),
              (Fu.pluginName = "useGridLayout");
            var Iu = function (s, g) {
                var y = g.instance;
                return [
                  s,
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: y.visibleColumns
                        .map(function (b) {
                          var E;
                          return y.state.gridLayout.columnWidths[b.id]
                            ? y.state.gridLayout.columnWidths[b.id] + "px"
                            : (E = y.state.columnResizing) != null &&
                              E.isResizingColumn
                            ? y.state.gridLayout.startWidths[b.id] + "px"
                            : typeof b.width == "number"
                            ? b.width + "px"
                            : b.width;
                        })
                        .join(" "),
                    },
                  },
                ];
              },
              Bu = function (s, g) {
                var y = g.column;
                return [
                  s,
                  {
                    id: "header-cell-" + y.id,
                    style: {
                      position: "sticky",
                      gridColumn: "span " + y.totalVisibleHeaderCount,
                    },
                  },
                ];
              },
              Du = function (s, g) {
                var y = g.row;
                return y.isExpanded
                  ? [
                      s,
                      { style: { gridColumn: "1 / " + (y.cells.length + 1) } },
                    ]
                  : [s, {}];
              };
            function zu(s, g, y, b) {
              if (g.type === c.init)
                return a({ gridLayout: { columnWidths: {} } }, s);
              if (g.type === c.resetResize)
                return a({}, s, { gridLayout: { columnWidths: {} } });
              if (g.type === c.columnStartResizing) {
                var E = g.columnId,
                  R = g.headerIdWidths,
                  A = Ko(E);
                if (A !== void 0) {
                  var j = b.visibleColumns.reduce(function (ce, Ze) {
                      var Me;
                      return a({}, ce, (((Me = {})[Ze.id] = Ko(Ze.id)), Me));
                    }, {}),
                    W = b.visibleColumns.reduce(function (ce, Ze) {
                      var Me;
                      return a({}, ce, (((Me = {})[Ze.id] = Ze.minWidth), Me));
                    }, {}),
                    V = b.visibleColumns.reduce(function (ce, Ze) {
                      var Me;
                      return a({}, ce, (((Me = {})[Ze.id] = Ze.maxWidth), Me));
                    }, {}),
                    le = R.map(function (ce) {
                      var Ze = ce[0];
                      return [Ze, Ko(Ze)];
                    });
                  return a({}, s, {
                    gridLayout: a({}, s.gridLayout, {
                      startWidths: j,
                      minWidths: W,
                      maxWidths: V,
                      headerIdGridWidths: le,
                      columnWidth: A,
                    }),
                  });
                }
                return s;
              }
              if (g.type === c.columnResizing) {
                var oe = g.clientX,
                  ae = s.columnResizing.startX,
                  X = s.gridLayout,
                  re = X.columnWidth,
                  ye = X.minWidths,
                  _e = X.maxWidths,
                  Fe = X.headerIdGridWidths,
                  et = (oe - ae) / re,
                  Ie = {};
                return (
                  (Fe === void 0 ? [] : Fe).forEach(function (ce) {
                    var Ze = ce[0],
                      Me = ce[1];
                    Ie[Ze] = Math.min(Math.max(ye[Ze], Me + Me * et), _e[Ze]);
                  }),
                  a({}, s, {
                    gridLayout: a({}, s.gridLayout, {
                      columnWidths: a({}, s.gridLayout.columnWidths, {}, Ie),
                    }),
                  })
                );
              }
              return g.type === c.columnDoneResizing
                ? a({}, s, {
                    gridLayout: a({}, s.gridLayout, {
                      startWidths: {},
                      minWidths: {},
                      maxWidths: {},
                    }),
                  })
                : void 0;
            }
            function Ko(s) {
              var g,
                y =
                  (g = document.getElementById("header-cell-" + s)) == null
                    ? void 0
                    : g.offsetWidth;
              if (y !== void 0) return y;
            }
            (n._UNSTABLE_usePivotColumns = jo),
              (n.actions = c),
              (n.defaultColumn = w),
              (n.defaultGroupByFn = ln),
              (n.defaultOrderByFn = bu),
              (n.defaultRenderer = p),
              (n.emptyRenderer = h),
              (n.ensurePluginOrder = k),
              (n.flexRender = ne),
              (n.functionalUpdate = F),
              (n.loopHooks = I),
              (n.makePropGetter = _),
              (n.makeRenderer = D),
              (n.reduceHooks = P),
              (n.safeUseLayoutEffect = G),
              (n.useAbsoluteLayout = ku),
              (n.useAsyncDebounce = function (s, g) {
                g === void 0 && (g = 0);
                var y = r.useRef({}),
                  b = N(s),
                  E = N(g);
                return r.useCallback(
                  (function () {
                    var R = o(
                      regeneratorRuntime.mark(function A() {
                        var j,
                          W,
                          V,
                          le = arguments;
                        return regeneratorRuntime.wrap(function (oe) {
                          for (;;)
                            switch ((oe.prev = oe.next)) {
                              case 0:
                                for (
                                  j = le.length, W = new Array(j), V = 0;
                                  V < j;
                                  V++
                                )
                                  W[V] = le[V];
                                return (
                                  y.current.promise ||
                                    (y.current.promise = new Promise(function (
                                      ae,
                                      X
                                    ) {
                                      (y.current.resolve = ae),
                                        (y.current.reject = X);
                                    })),
                                  y.current.timeout &&
                                    clearTimeout(y.current.timeout),
                                  (y.current.timeout = setTimeout(
                                    o(
                                      regeneratorRuntime.mark(function ae() {
                                        return regeneratorRuntime.wrap(
                                          function (X) {
                                            for (;;)
                                              switch ((X.prev = X.next)) {
                                                case 0:
                                                  return (
                                                    delete y.current.timeout,
                                                    (X.prev = 1),
                                                    (X.t0 = y.current),
                                                    (X.next = 5),
                                                    b().apply(void 0, W)
                                                  );
                                                case 5:
                                                  (X.t1 = X.sent),
                                                    X.t0.resolve.call(
                                                      X.t0,
                                                      X.t1
                                                    ),
                                                    (X.next = 12);
                                                  break;
                                                case 9:
                                                  (X.prev = 9),
                                                    (X.t2 = X.catch(1)),
                                                    y.current.reject(X.t2);
                                                case 12:
                                                  return (
                                                    (X.prev = 12),
                                                    delete y.current.promise,
                                                    X.finish(12)
                                                  );
                                                case 15:
                                                case "end":
                                                  return X.stop();
                                              }
                                          },
                                          ae,
                                          null,
                                          [[1, 9, 12, 15]]
                                        );
                                      })
                                    ),
                                    E()
                                  )),
                                  oe.abrupt("return", y.current.promise)
                                );
                              case 5:
                              case "end":
                                return oe.stop();
                            }
                        }, A);
                      })
                    );
                    return function () {
                      return R.apply(this, arguments);
                    };
                  })(),
                  [b, E]
                );
              }),
              (n.useBlockLayout = $u),
              (n.useColumnOrder = Eu),
              (n.useExpanded = lr),
              (n.useFilters = $r),
              (n.useFlexLayout = Yo),
              (n.useGetLatest = N),
              (n.useGlobalFilter = O),
              (n.useGridLayout = Fu),
              (n.useGroupBy = it),
              (n.useMountedLayoutEffect = M),
              (n.usePagination = Go),
              (n.useResizeColumns = Au),
              (n.useRowSelect = Su),
              (n.useRowState = Wo),
              (n.useSortBy = yu),
              (n.useTable = function (s) {
                for (
                  var g = arguments.length,
                    y = new Array(g > 1 ? g - 1 : 0),
                    b = 1;
                  b < g;
                  b++
                )
                  y[b - 1] = arguments[b];
                (s = Sn(s)), (y = [yt].concat(y));
                var E = r.useRef({}),
                  R = N(E.current);
                Object.assign(R(), a({}, s, { plugins: y, hooks: B() })),
                  y.filter(Boolean).forEach(function (x) {
                    x(R().hooks);
                  });
                var A = N(R().hooks);
                (R().getHooks = A),
                  delete R().hooks,
                  Object.assign(R(), P(A().useOptions, Sn(s)));
                var j = R(),
                  W = j.data,
                  V = j.columns,
                  le = j.initialState,
                  oe = j.defaultColumn,
                  ae = j.getSubRows,
                  X = j.getRowId,
                  re = j.stateReducer,
                  ye = j.useControlledState,
                  _e = N(re),
                  Fe = r.useCallback(
                    function (x, $) {
                      if (!$.type)
                        throw (
                          (console.info({ action: $ }),
                          new Error("Unknown Action \u{1F446}"))
                        );
                      return []
                        .concat(
                          A().stateReducers,
                          Array.isArray(_e()) ? _e() : [_e()]
                        )
                        .reduce(function (z, H) {
                          return H(z, $, x, R()) || z;
                        }, x);
                    },
                    [A, _e, R]
                  ),
                  et = r.useReducer(Fe, void 0, function () {
                    return Fe(le, { type: c.init });
                  }),
                  Ie = et[0],
                  ce = et[1],
                  Ze = P([].concat(A().useControlledState, [ye]), Ie, {
                    instance: R(),
                  });
                Object.assign(R(), { state: Ze, dispatch: ce });
                var Me = r.useMemo(function () {
                  return Z(P(A().columns, V, { instance: R() }));
                }, [A, R, V].concat(P(A().columnsDeps, [], { instance: R() })));
                R().columns = Me;
                var Xe = r.useMemo(function () {
                  return P(A().allColumns, he(Me), { instance: R() }).map(me);
                }, [Me, A, R].concat(
                  P(A().allColumnsDeps, [], { instance: R() })
                ));
                R().allColumns = Xe;
                var dt = r.useMemo(
                    function () {
                      for (
                        var x = [], $ = [], z = {}, H = [].concat(Xe);
                        H.length;

                      ) {
                        var q = H.shift();
                        An({
                          data: W,
                          rows: x,
                          flatRows: $,
                          rowsById: z,
                          column: q,
                          getRowId: X,
                          getSubRows: ae,
                          accessValueHooks: A().accessValue,
                          getInstance: R,
                        });
                      }
                      return [x, $, z];
                    },
                    [Xe, W, X, ae, A, R]
                  ),
                  He = dt[0],
                  qe = dt[1],
                  xt = dt[2];
                Object.assign(R(), {
                  rows: He,
                  initialRows: [].concat(He),
                  flatRows: qe,
                  rowsById: xt,
                }),
                  I(A().useInstanceAfterData, R());
                var Qe = r.useMemo(function () {
                  return P(A().visibleColumns, Xe, { instance: R() }).map(
                    function (x) {
                      return ie(x, oe);
                    }
                  );
                }, [A, Xe, R, oe].concat(
                  P(A().visibleColumnsDeps, [], { instance: R() })
                ));
                (Xe = r.useMemo(
                  function () {
                    var x = [].concat(Qe);
                    return (
                      Xe.forEach(function ($) {
                        x.find(function (z) {
                          return z.id === $.id;
                        }) || x.push($);
                      }),
                      x
                    );
                  },
                  [Xe, Qe]
                )),
                  (R().allColumns = Xe);
                var gt = r.useMemo(function () {
                  return P(A().headerGroups, te(Qe, oe), R());
                }, [A, Qe, oe, R].concat(
                  P(A().headerGroupsDeps, [], { instance: R() })
                ));
                R().headerGroups = gt;
                var l = r.useMemo(
                  function () {
                    return gt.length ? gt[0].headers : [];
                  },
                  [gt]
                );
                (R().headers = l),
                  (R().flatHeaders = gt.reduce(function (x, $) {
                    return [].concat(x, $.headers);
                  }, [])),
                  I(A().useInstanceBeforeDimensions, R());
                var d = Qe.filter(function (x) {
                  return x.isVisible;
                })
                  .map(function (x) {
                    return x.id;
                  })
                  .sort()
                  .join("_");
                (Qe = r.useMemo(
                  function () {
                    return Qe.filter(function (x) {
                      return x.isVisible;
                    });
                  },
                  [Qe, d]
                )),
                  (R().visibleColumns = Qe);
                var m = Yt(l),
                  v = m[0],
                  S = m[1],
                  C = m[2];
                return (
                  (R().totalColumnsMinWidth = v),
                  (R().totalColumnsWidth = S),
                  (R().totalColumnsMaxWidth = C),
                  I(A().useInstance, R()),
                  []
                    .concat(R().flatHeaders, R().allColumns)
                    .forEach(function (x) {
                      (x.render = D(R(), x)),
                        (x.getHeaderProps = _(A().getHeaderProps, {
                          instance: R(),
                          column: x,
                        })),
                        (x.getFooterProps = _(A().getFooterProps, {
                          instance: R(),
                          column: x,
                        }));
                    }),
                  (R().headerGroups = r.useMemo(
                    function () {
                      return gt.filter(function (x, $) {
                        return (
                          (x.headers = x.headers.filter(function (z) {
                            return z.headers
                              ? (function H(q) {
                                  return q.filter(function (pe) {
                                    return pe.headers
                                      ? H(pe.headers)
                                      : pe.isVisible;
                                  }).length;
                                })(z.headers)
                              : z.isVisible;
                          })),
                          !!x.headers.length &&
                            ((x.getHeaderGroupProps = _(
                              A().getHeaderGroupProps,
                              { instance: R(), headerGroup: x, index: $ }
                            )),
                            (x.getFooterGroupProps = _(
                              A().getFooterGroupProps,
                              { instance: R(), headerGroup: x, index: $ }
                            )),
                            !0)
                        );
                      });
                    },
                    [gt, R, A]
                  )),
                  (R().footerGroups = [].concat(R().headerGroups).reverse()),
                  (R().prepareRow = r.useCallback(
                    function (x) {
                      (x.getRowProps = _(A().getRowProps, {
                        instance: R(),
                        row: x,
                      })),
                        (x.allCells = Xe.map(function ($) {
                          var z = x.values[$.id],
                            H = { column: $, row: x, value: z };
                          return (
                            (H.getCellProps = _(A().getCellProps, {
                              instance: R(),
                              cell: H,
                            })),
                            (H.render = D(R(), $, {
                              row: x,
                              cell: H,
                              value: z,
                            })),
                            H
                          );
                        })),
                        (x.cells = Qe.map(function ($) {
                          return x.allCells.find(function (z) {
                            return z.column.id === $.id;
                          });
                        })),
                        I(A().prepareRow, x, { instance: R() });
                    },
                    [A, R, Xe, Qe]
                  )),
                  (R().getTableProps = _(A().getTableProps, { instance: R() })),
                  (R().getTableBodyProps = _(A().getTableBodyProps, {
                    instance: R(),
                  })),
                  I(A().useFinalInstance, R()),
                  R()
                );
              }),
              Object.defineProperty(n, "__esModule", { value: !0 });
          });
        })(su, su.exports)),
      su.exports
    );
  }
  var lu = { exports: {} },
    hm;
  function vT() {
    return (
      hm ||
        ((hm = 1),
        (function (e, t) {
          (function (n, r) {
            r(t, Tn.default);
          })(li, function (n, r) {
            r =
              r && Object.prototype.hasOwnProperty.call(r, "default")
                ? r.default
                : r;
            function i(l, d, m, v, S, C, x) {
              try {
                var $ = l[C](x),
                  z = $.value;
              } catch (H) {
                m(H);
                return;
              }
              $.done ? d(z) : Promise.resolve(z).then(v, S);
            }
            function o(l) {
              return function () {
                var d = this,
                  m = arguments;
                return new Promise(function (v, S) {
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
              return (
                (a =
                  Object.assign ||
                  function (l) {
                    for (var d = 1; d < arguments.length; d++) {
                      var m = arguments[d];
                      for (var v in m)
                        Object.prototype.hasOwnProperty.call(m, v) &&
                          (l[v] = m[v]);
                    }
                    return l;
                  }),
                a.apply(this, arguments)
              );
            }
            function u(l, d) {
              if (l == null) return {};
              var m = {},
                v = Object.keys(l),
                S,
                C;
              for (C = 0; C < v.length; C++)
                (S = v[C]), !(d.indexOf(S) >= 0) && (m[S] = l[S]);
              return m;
            }
            function f(l, d) {
              if (typeof l != "object" || l === null) return l;
              var m = l[Symbol.toPrimitive];
              if (m !== void 0) {
                var v = m.call(l, d || "default");
                if (typeof v != "object") return v;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value."
                );
              }
              return (d === "string" ? String : Number)(l);
            }
            function c(l) {
              var d = f(l, "string");
              return typeof d == "symbol" ? d : String(d);
            }
            var p = "Renderer Error \u261D\uFE0F",
              h = { init: "init" },
              w = function (d) {
                var m = d.value,
                  v = m === void 0 ? "" : m;
                return v;
              },
              T = function () {
                return r.createElement(r.Fragment, null, "\xA0");
              },
              _ = {
                Cell: w,
                width: 150,
                minWidth: 0,
                maxWidth: Number.MAX_SAFE_INTEGER,
              };
            function P() {
              for (
                var l = arguments.length, d = new Array(l), m = 0;
                m < l;
                m++
              )
                d[m] = arguments[m];
              return d.reduce(function (v, S) {
                var C = S.style,
                  x = S.className,
                  $ = u(S, ["style", "className"]);
                return (
                  (v = a({}, v, {}, $)),
                  C &&
                    (v.style = v.style ? a({}, v.style || {}, {}, C || {}) : C),
                  x && (v.className = v.className ? v.className + " " + x : x),
                  v.className === "" && delete v.className,
                  v
                );
              }, {});
            }
            function I(l, d, m) {
              return typeof d == "function"
                ? I({}, d(l, m))
                : Array.isArray(d)
                ? P.apply(void 0, [l].concat(d))
                : P(l, d);
            }
            var k = function (d, m) {
                return (
                  m === void 0 && (m = {}),
                  function (v) {
                    return (
                      v === void 0 && (v = {}),
                      [].concat(d, [v]).reduce(function (S, C) {
                        return I(S, C, a({}, m, { userProps: v }));
                      }, {})
                    );
                  }
                );
              },
              F = function (d, m, v, S) {
                return (
                  v === void 0 && (v = {}),
                  d.reduce(function (C, x) {
                    var $ = x(C, v);
                    if (!S && typeof $ > "u")
                      throw (
                        (console.info(x),
                        new Error(
                          "React Table: A reducer hook \u261D\uFE0F just returned undefined! This is not allowed."
                        ))
                      );
                    return $;
                  }, m)
                );
              },
              N = function (d, m, v) {
                return (
                  v === void 0 && (v = {}),
                  d.forEach(function (S) {
                    var C = S(m, v);
                    if (typeof C < "u")
                      throw (
                        (console.info(S, C),
                        new Error(
                          "React Table: A loop-type hook \u261D\uFE0F just returned a value! This is not allowed."
                        ))
                      );
                  })
                );
              };
            function G(l, d, m, v) {
              if (v)
                throw new Error(
                  'Defining plugins in the "after" section of ensurePluginOrder is no longer supported (see plugin ' +
                    m +
                    ")"
                );
              var S = l.findIndex(function (C) {
                return C.pluginName === m;
              });
              if (S === -1)
                throw new Error(
                  'The plugin "' +
                    m +
                    `" was not found in the plugin list!
This usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:

  ` +
                    m +
                    ".pluginName = '" +
                    m +
                    `'
`
                );
              d.forEach(function (C) {
                var x = l.findIndex(function ($) {
                  return $.pluginName === C;
                });
                if (x > -1 && x > S)
                  throw new Error(
                    "React Table: The " +
                      m +
                      " plugin hook must be placed after the " +
                      C +
                      " plugin hook!"
                  );
              });
            }
            function M(l, d) {
              return typeof l == "function" ? l(d) : l;
            }
            function D(l) {
              var d = r.useRef();
              return (
                (d.current = l),
                r.useCallback(function () {
                  return d.current;
                }, [])
              );
            }
            var ne = typeof document < "u" ? r.useLayoutEffect : r.useEffect;
            function Z(l, d) {
              var m = r.useRef(!1);
              ne(function () {
                m.current && l(), (m.current = !0);
              }, d);
            }
            function he(l, d) {
              d === void 0 && (d = 0);
              var m = r.useRef({}),
                v = D(l),
                S = D(d);
              return r.useCallback(
                (function () {
                  var C = o(
                    regeneratorRuntime.mark(function x() {
                      var $,
                        z,
                        H,
                        q = arguments;
                      return regeneratorRuntime.wrap(function (J) {
                        for (;;)
                          switch ((J.prev = J.next)) {
                            case 0:
                              for (
                                $ = q.length, z = new Array($), H = 0;
                                H < $;
                                H++
                              )
                                z[H] = q[H];
                              return (
                                m.current.promise ||
                                  (m.current.promise = new Promise(function (
                                    ue,
                                    ge
                                  ) {
                                    (m.current.resolve = ue),
                                      (m.current.reject = ge);
                                  })),
                                m.current.timeout &&
                                  clearTimeout(m.current.timeout),
                                (m.current.timeout = setTimeout(
                                  o(
                                    regeneratorRuntime.mark(function ue() {
                                      return regeneratorRuntime.wrap(
                                        function (Q) {
                                          for (;;)
                                            switch ((Q.prev = Q.next)) {
                                              case 0:
                                                return (
                                                  delete m.current.timeout,
                                                  (Q.prev = 1),
                                                  (Q.t0 = m.current),
                                                  (Q.next = 5),
                                                  v().apply(void 0, z)
                                                );
                                              case 5:
                                                (Q.t1 = Q.sent),
                                                  Q.t0.resolve.call(Q.t0, Q.t1),
                                                  (Q.next = 12);
                                                break;
                                              case 9:
                                                (Q.prev = 9),
                                                  (Q.t2 = Q.catch(1)),
                                                  m.current.reject(Q.t2);
                                              case 12:
                                                return (
                                                  (Q.prev = 12),
                                                  delete m.current.promise,
                                                  Q.finish(12)
                                                );
                                              case 15:
                                              case "end":
                                                return Q.stop();
                                            }
                                        },
                                        ue,
                                        null,
                                        [[1, 9, 12, 15]]
                                      );
                                    })
                                  ),
                                  S()
                                )),
                                J.abrupt("return", m.current.promise)
                              );
                            case 5:
                            case "end":
                              return J.stop();
                          }
                      }, x);
                    })
                  );
                  return function () {
                    return C.apply(this, arguments);
                  };
                })(),
                [v, S]
              );
            }
            function me(l, d, m) {
              return (
                m === void 0 && (m = {}),
                function (v, S) {
                  S === void 0 && (S = {});
                  var C = typeof v == "string" ? d[v] : v;
                  if (typeof C > "u") throw (console.info(d), new Error(p));
                  return ie(C, a({}, l, { column: d }, m, {}, S));
                }
              );
            }
            function ie(l, d) {
              return te(l) ? r.createElement(l, d) : l;
            }
            function te(l) {
              return we(l) || typeof l == "function" || ke(l);
            }
            function we(l) {
              return (
                typeof l == "function" &&
                (function () {
                  var d = Object.getPrototypeOf(l);
                  return d.prototype && d.prototype.isReactComponent;
                })()
              );
            }
            function ke(l) {
              return (
                typeof l == "object" &&
                typeof l.$$typeof == "symbol" &&
                ["react.memo", "react.forward_ref"].includes(
                  l.$$typeof.description
                )
              );
            }
            function st(l, d, m) {
              return (
                m === void 0 && (m = 0),
                l.map(function (v) {
                  return (
                    (v = a({}, v, { parent: d, depth: m })),
                    lt(v),
                    v.columns && (v.columns = st(v.columns, v, m + 1)),
                    v
                  );
                })
              );
            }
            function Ue(l) {
              return Te(l, "columns");
            }
            function lt(l) {
              var d = l.id,
                m = l.accessor,
                v = l.Header;
              if (typeof m == "string") {
                d = d || m;
                var S = m.split(".");
                m = function (x) {
                  return se(x, S);
                };
              }
              if ((!d && typeof v == "string" && v && (d = v), !d && l.columns))
                throw (
                  (console.error(l),
                  new Error(
                    'A column ID (or unique "Header" value) is required!'
                  ))
                );
              if (!d)
                throw (
                  (console.error(l),
                  new Error("A column ID (or string accessor) is required!"))
                );
              return Object.assign(l, { id: d, accessor: m }), l;
            }
            function ct(l, d) {
              if (!d) throw new Error();
              return (
                Object.assign(l, a({ Header: T, Footer: T }, _, {}, d, {}, l)),
                Object.assign(l, { originalWidth: l.width }),
                l
              );
            }
            function ht(l, d, m) {
              m === void 0 &&
                (m = function () {
                  return {};
                });
              for (
                var v = [],
                  S = l,
                  C = 0,
                  x = function () {
                    return C++;
                  },
                  $ = function () {
                    var H = { headers: [] },
                      q = [],
                      pe = S.some(function (J) {
                        return J.parent;
                      });
                    S.forEach(function (J) {
                      var ue = [].concat(q).reverse()[0],
                        ge;
                      if (pe) {
                        if (J.parent)
                          ge = a(
                            {},
                            J.parent,
                            {
                              originalId: J.parent.id,
                              id: J.parent.id + "_" + x(),
                              headers: [J],
                            },
                            m(J)
                          );
                        else {
                          var Q = J.id + "_placeholder";
                          ge = ct(
                            a(
                              {
                                originalId: Q,
                                id: J.id + "_placeholder_" + x(),
                                placeholderOf: J,
                                headers: [J],
                              },
                              m(J)
                            ),
                            d
                          );
                        }
                        ue && ue.originalId === ge.originalId
                          ? ue.headers.push(J)
                          : q.push(ge);
                      }
                      H.headers.push(J);
                    }),
                      v.push(H),
                      (S = q);
                  };
                S.length;

              )
                $();
              return v.reverse();
            }
            var U = new Map();
            function se(l, d, m) {
              if (!d) return l;
              var v = typeof d == "function" ? d : JSON.stringify(d),
                S =
                  U.get(v) ||
                  (function () {
                    var x = yt(d);
                    return U.set(v, x), x;
                  })(),
                C;
              try {
                C = S.reduce(function (x, $) {
                  return x[$];
                }, l);
              } catch {}
              return typeof C < "u" ? C : m;
            }
            function Ne() {
              for (
                var l = arguments.length, d = new Array(l), m = 0;
                m < l;
                m++
              )
                d[m] = arguments[m];
              for (var v = 0; v < d.length; v += 1)
                if (typeof d[v] < "u") return d[v];
            }
            function $e(l) {
              if (typeof l == "function") return l;
            }
            function Te(l, d) {
              var m = [],
                v = function S(C) {
                  C.forEach(function (x) {
                    x[d] ? S(x[d]) : m.push(x);
                  });
                };
              return v(l), m;
            }
            function Ce(l, d) {
              var m = d.manualExpandedKey,
                v = d.expanded,
                S = d.expandSubRows,
                C = S === void 0 ? !0 : S,
                x = [],
                $ = function z(H, q) {
                  q === void 0 && (q = !0),
                    (H.isExpanded = (H.original && H.original[m]) || v[H.id]),
                    (H.canExpand = H.subRows && !!H.subRows.length),
                    q && x.push(H),
                    H.subRows &&
                      H.subRows.length &&
                      H.isExpanded &&
                      H.subRows.forEach(function (pe) {
                        return z(pe, C);
                      });
                };
              return (
                l.forEach(function (z) {
                  return $(z);
                }),
                x
              );
            }
            function Ee(l, d, m) {
              return $e(l) || d[l] || m[l] || m.text;
            }
            function De(l, d, m) {
              return l ? l(d, m) : typeof d > "u";
            }
            function Ge() {
              throw new Error(
                "React-Table: You have not called prepareRow(row) one or more rows you are attempting to render."
              );
            }
            var K = null;
            function fe() {
              if (typeof K == "boolean") return K;
              var l = !1;
              try {
                var d = {
                  get passive() {
                    return (l = !0), !1;
                  },
                };
                window.addEventListener("test", null, d),
                  window.removeEventListener("test", null, d);
              } catch {
                l = !1;
              }
              return (K = l), K;
            }
            var je = /\[/g,
              B = /\]/g;
            function yt(l) {
              return ft(l)
                .map(function (d) {
                  return String(d).replace(".", "_");
                })
                .join(".")
                .replace(je, ".")
                .replace(B, "")
                .split(".");
            }
            function ft(l, d) {
              if ((d === void 0 && (d = []), !Array.isArray(l))) d.push(l);
              else for (var m = 0; m < l.length; m += 1) ft(l[m], d);
              return d;
            }
            var Ct = function (d) {
                return a({ role: "table" }, d);
              },
              At = function (d) {
                return a({ role: "rowgroup" }, d);
              },
              en = function (d, m) {
                var v = m.column;
                return a(
                  {
                    key: "header_" + v.id,
                    colSpan: v.totalVisibleHeaderCount,
                    role: "columnheader",
                  },
                  d
                );
              },
              un = function (d, m) {
                var v = m.column;
                return a(
                  { key: "footer_" + v.id, colSpan: v.totalVisibleHeaderCount },
                  d
                );
              },
              wn = function (d, m) {
                var v = m.index;
                return a({ key: "headerGroup_" + v, role: "row" }, d);
              },
              xn = function (d, m) {
                var v = m.index;
                return a({ key: "footerGroup_" + v }, d);
              },
              _n = function (d, m) {
                var v = m.row;
                return a({ key: "row_" + v.id, role: "row" }, d);
              },
              Un = function (d, m) {
                var v = m.cell;
                return a(
                  { key: "cell_" + v.row.id + "_" + v.column.id, role: "cell" },
                  d
                );
              };
            function sr() {
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
                getTableProps: [Ct],
                getTableBodyProps: [At],
                getHeaderGroupProps: [wn],
                getFooterGroupProps: [xn],
                getHeaderProps: [en],
                getFooterProps: [un],
                getRowProps: [_n],
                getCellProps: [Un],
                useFinalInstance: [],
              };
            }
            (h.resetHiddenColumns = "resetHiddenColumns"),
              (h.toggleHideColumn = "toggleHideColumn"),
              (h.setHiddenColumns = "setHiddenColumns"),
              (h.toggleHideAllColumns = "toggleHideAllColumns");
            var qn = function (d) {
              (d.getToggleHiddenProps = [Sn]),
                (d.getToggleHideAllColumnsProps = [Yt]),
                d.stateReducers.push(An),
                d.useInstanceBeforeDimensions.push(lr),
                d.headerGroupsDeps.push(function (m, v) {
                  var S = v.instance;
                  return [].concat(m, [S.state.hiddenColumns]);
                }),
                d.useInstance.push(Or);
            };
            qn.pluginName = "useColumnVisibility";
            var Sn = function (d, m) {
                var v = m.column;
                return [
                  d,
                  {
                    onChange: function (C) {
                      v.toggleHidden(!C.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: v.isVisible,
                    title: "Toggle Column Visible",
                  },
                ];
              },
              Yt = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    onChange: function (C) {
                      v.toggleHideAllColumns(!C.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked:
                      !v.allColumnsHidden && !v.state.hiddenColumns.length,
                    title: "Toggle All Columns Hidden",
                    indeterminate:
                      !v.allColumnsHidden && v.state.hiddenColumns.length,
                  },
                ];
              };
            function An(l, d, m, v) {
              if (d.type === h.init) return a({ hiddenColumns: [] }, l);
              if (d.type === h.resetHiddenColumns)
                return a({}, l, {
                  hiddenColumns: v.initialState.hiddenColumns || [],
                });
              if (d.type === h.toggleHideColumn) {
                var S =
                    typeof d.value < "u"
                      ? d.value
                      : !l.hiddenColumns.includes(d.columnId),
                  C = S
                    ? [].concat(l.hiddenColumns, [d.columnId])
                    : l.hiddenColumns.filter(function ($) {
                        return $ !== d.columnId;
                      });
                return a({}, l, { hiddenColumns: C });
              }
              if (d.type === h.setHiddenColumns)
                return a({}, l, { hiddenColumns: M(d.value, l.hiddenColumns) });
              if (d.type === h.toggleHideAllColumns) {
                var x =
                  typeof d.value < "u" ? d.value : !l.hiddenColumns.length;
                return a({}, l, {
                  hiddenColumns: x
                    ? v.allColumns.map(function ($) {
                        return $.id;
                      })
                    : [],
                });
              }
            }
            function lr(l) {
              var d = l.headers,
                m = l.state.hiddenColumns,
                v = r.useRef(!1);
              v.current;
              var S = function x($, z) {
                  $.isVisible = z && !m.includes($.id);
                  var H = 0;
                  return (
                    $.headers && $.headers.length
                      ? $.headers.forEach(function (q) {
                          return (H += x(q, $.isVisible));
                        })
                      : (H = $.isVisible ? 1 : 0),
                    ($.totalVisibleHeaderCount = H),
                    H
                  );
                },
                C = 0;
              d.forEach(function (x) {
                return (C += S(x, !0));
              });
            }
            function Or(l) {
              var d = l.columns,
                m = l.flatHeaders,
                v = l.dispatch,
                S = l.allColumns,
                C = l.getHooks,
                x = l.state.hiddenColumns,
                $ = l.autoResetHiddenColumns,
                z = $ === void 0 ? !0 : $,
                H = D(l),
                q = S.length === x.length,
                pe = r.useCallback(
                  function (Pe, ze) {
                    return v({
                      type: h.toggleHideColumn,
                      columnId: Pe,
                      value: ze,
                    });
                  },
                  [v]
                ),
                J = r.useCallback(
                  function (Pe) {
                    return v({ type: h.setHiddenColumns, value: Pe });
                  },
                  [v]
                ),
                ue = r.useCallback(
                  function (Pe) {
                    return v({ type: h.toggleHideAllColumns, value: Pe });
                  },
                  [v]
                ),
                ge = k(C().getToggleHideAllColumnsProps, { instance: H() });
              m.forEach(function (Pe) {
                (Pe.toggleHidden = function (ze) {
                  v({ type: h.toggleHideColumn, columnId: Pe.id, value: ze });
                }),
                  (Pe.getToggleHiddenProps = k(C().getToggleHiddenProps, {
                    instance: H(),
                    column: Pe,
                  }));
              });
              var Q = D(z);
              Z(
                function () {
                  Q() && v({ type: h.resetHiddenColumns });
                },
                [v, d]
              ),
                Object.assign(l, {
                  allColumnsHidden: q,
                  toggleHideColumn: pe,
                  setHiddenColumns: J,
                  toggleHideAllColumns: ue,
                  getToggleHideAllColumnsProps: ge,
                });
            }
            var Ar = {},
              cr = {},
              kr = function (d, m, v) {
                return d;
              },
              Yn = function (d, m) {
                return d.subRows || [];
              },
              Xn = function (d, m, v) {
                return "" + (v ? [v.id, m].join(".") : m);
              },
              sn = function (d) {
                return d;
              };
            function Rn(l) {
              var d = l.initialState,
                m = d === void 0 ? Ar : d,
                v = l.defaultColumn,
                S = v === void 0 ? cr : v,
                C = l.getSubRows,
                x = C === void 0 ? Yn : C,
                $ = l.getRowId,
                z = $ === void 0 ? Xn : $,
                H = l.stateReducer,
                q = H === void 0 ? kr : H,
                pe = l.useControlledState,
                J = pe === void 0 ? sn : pe,
                ue = u(l, [
                  "initialState",
                  "defaultColumn",
                  "getSubRows",
                  "getRowId",
                  "stateReducer",
                  "useControlledState",
                ]);
              return a({}, ue, {
                initialState: m,
                defaultColumn: S,
                getSubRows: x,
                getRowId: z,
                stateReducer: q,
                useControlledState: J,
              });
            }
            var kn = function (d) {
              for (
                var m = arguments.length,
                  v = new Array(m > 1 ? m - 1 : 0),
                  S = 1;
                S < m;
                S++
              )
                v[S - 1] = arguments[S];
              (d = Rn(d)), (v = [qn].concat(v));
              var C = r.useRef({}),
                x = D(C.current);
              Object.assign(x(), a({}, d, { plugins: v, hooks: sr() })),
                v.filter(Boolean).forEach(function (We) {
                  We(x().hooks);
                });
              var $ = D(x().hooks);
              (x().getHooks = $),
                delete x().hooks,
                Object.assign(x(), F($().useOptions, Rn(d)));
              var z = x(),
                H = z.data,
                q = z.columns,
                pe = z.initialState,
                J = z.defaultColumn,
                ue = z.getSubRows,
                ge = z.getRowId,
                Q = z.stateReducer,
                Pe = z.useControlledState,
                ze = D(Q),
                Ve = r.useCallback(
                  function (We, Et) {
                    if (!Et.type)
                      throw (
                        (console.info({ action: Et }),
                        new Error("Unknown Action \u{1F446}"))
                      );
                    return []
                      .concat(
                        $().stateReducers,
                        Array.isArray(ze()) ? ze() : [ze()]
                      )
                      .reduce(function (Bt, nn) {
                        return nn(Bt, Et, We, x()) || Bt;
                      }, We);
                  },
                  [$, ze, x]
                ),
                xe = r.useReducer(Ve, void 0, function () {
                  return Ve(pe, { type: h.init });
                }),
                Je = xe[0],
                ot = xe[1],
                Se = F([].concat($().useControlledState, [Pe]), Je, {
                  instance: x(),
                });
              Object.assign(x(), { state: Se, dispatch: ot });
              var be = r.useMemo(function () {
                return st(F($().columns, q, { instance: x() }));
              }, [$, x, q].concat(F($().columnsDeps, [], { instance: x() })));
              x().columns = be;
              var Re = r.useMemo(function () {
                return F($().allColumns, Ue(be), { instance: x() }).map(lt);
              }, [be, $, x].concat(
                F($().allColumnsDeps, [], { instance: x() })
              ));
              x().allColumns = Re;
              var Be = r.useMemo(
                  function () {
                    for (
                      var We = [], Et = [], Bt = {}, nn = [].concat(Re);
                      nn.length;

                    ) {
                      var Lt = nn.shift();
                      fr({
                        data: H,
                        rows: We,
                        flatRows: Et,
                        rowsById: Bt,
                        column: Lt,
                        getRowId: ge,
                        getSubRows: ue,
                        accessValueHooks: $().accessValue,
                        getInstance: x,
                      });
                    }
                    return [We, Et, Bt];
                  },
                  [Re, H, ge, ue, $, x]
                ),
                tt = Be[0],
                nt = Be[1],
                Tt = Be[2];
              Object.assign(x(), {
                rows: tt,
                initialRows: [].concat(tt),
                flatRows: nt,
                rowsById: Tt,
              }),
                N($().useInstanceAfterData, x());
              var Oe = r.useMemo(function () {
                return F($().visibleColumns, Re, { instance: x() }).map(
                  function (We) {
                    return ct(We, J);
                  }
                );
              }, [$, Re, x, J].concat(
                F($().visibleColumnsDeps, [], { instance: x() })
              ));
              (Re = r.useMemo(
                function () {
                  var We = [].concat(Oe);
                  return (
                    Re.forEach(function (Et) {
                      We.find(function (Bt) {
                        return Bt.id === Et.id;
                      }) || We.push(Et);
                    }),
                    We
                  );
                },
                [Re, Oe]
              )),
                (x().allColumns = Re);
              {
                var zt = Re.filter(function (We, Et) {
                  return (
                    Re.findIndex(function (Bt) {
                      return Bt.id === We.id;
                    }) !== Et
                  );
                });
                if (zt.length)
                  throw (
                    (console.info(Re),
                    new Error(
                      'Duplicate columns were found with ids: "' +
                        zt
                          .map(function (We) {
                            return We.id;
                          })
                          .join(", ") +
                        '" in the columns array above'
                    ))
                  );
              }
              var rt = r.useMemo(function () {
                return F($().headerGroups, ht(Oe, J), x());
              }, [$, Oe, J, x].concat(
                F($().headerGroupsDeps, [], { instance: x() })
              ));
              x().headerGroups = rt;
              var Ye = r.useMemo(
                function () {
                  return rt.length ? rt[0].headers : [];
                },
                [rt]
              );
              (x().headers = Ye),
                (x().flatHeaders = rt.reduce(function (We, Et) {
                  return [].concat(We, Et.headers);
                }, [])),
                N($().useInstanceBeforeDimensions, x());
              var Ke = Oe.filter(function (We) {
                return We.isVisible;
              })
                .map(function (We) {
                  return We.id;
                })
                .sort()
                .join("_");
              (Oe = r.useMemo(
                function () {
                  return Oe.filter(function (We) {
                    return We.isVisible;
                  });
                },
                [Oe, Ke]
              )),
                (x().visibleColumns = Oe);
              var Nt = $n(Ye),
                Ut = Nt[0],
                ui = Nt[1],
                Qo = Nt[2];
              return (
                (x().totalColumnsMinWidth = Ut),
                (x().totalColumnsWidth = ui),
                (x().totalColumnsMaxWidth = Qo),
                N($().useInstance, x()),
                []
                  .concat(x().flatHeaders, x().allColumns)
                  .forEach(function (We) {
                    (We.render = me(x(), We)),
                      (We.getHeaderProps = k($().getHeaderProps, {
                        instance: x(),
                        column: We,
                      })),
                      (We.getFooterProps = k($().getFooterProps, {
                        instance: x(),
                        column: We,
                      }));
                  }),
                (x().headerGroups = r.useMemo(
                  function () {
                    return rt.filter(function (We, Et) {
                      return (
                        (We.headers = We.headers.filter(function (Bt) {
                          var nn = function Lt(Fr) {
                            return Fr.filter(function (Kt) {
                              return Kt.headers ? Lt(Kt.headers) : Kt.isVisible;
                            }).length;
                          };
                          return Bt.headers ? nn(Bt.headers) : Bt.isVisible;
                        })),
                        We.headers.length
                          ? ((We.getHeaderGroupProps = k(
                              $().getHeaderGroupProps,
                              { instance: x(), headerGroup: We, index: Et }
                            )),
                            (We.getFooterGroupProps = k(
                              $().getFooterGroupProps,
                              { instance: x(), headerGroup: We, index: Et }
                            )),
                            !0)
                          : !1
                      );
                    });
                  },
                  [rt, x, $]
                )),
                (x().footerGroups = [].concat(x().headerGroups).reverse()),
                (x().prepareRow = r.useCallback(
                  function (We) {
                    (We.getRowProps = k($().getRowProps, {
                      instance: x(),
                      row: We,
                    })),
                      (We.allCells = Re.map(function (Et) {
                        var Bt = We.values[Et.id],
                          nn = { column: Et, row: We, value: Bt };
                        return (
                          (nn.getCellProps = k($().getCellProps, {
                            instance: x(),
                            cell: nn,
                          })),
                          (nn.render = me(x(), Et, {
                            row: We,
                            cell: nn,
                            value: Bt,
                          })),
                          nn
                        );
                      })),
                      (We.cells = Oe.map(function (Et) {
                        return We.allCells.find(function (Bt) {
                          return Bt.column.id === Et.id;
                        });
                      })),
                      N($().prepareRow, We, { instance: x() });
                  },
                  [$, x, Re, Oe]
                )),
                (x().getTableProps = k($().getTableProps, { instance: x() })),
                (x().getTableBodyProps = k($().getTableBodyProps, {
                  instance: x(),
                })),
                N($().useFinalInstance, x()),
                x()
              );
            };
            function $n(l, d) {
              d === void 0 && (d = 0);
              var m = 0,
                v = 0,
                S = 0,
                C = 0;
              return (
                l.forEach(function (x) {
                  var $ = x.headers;
                  if (((x.totalLeft = d), $ && $.length)) {
                    var z = $n($, d),
                      H = z[0],
                      q = z[1],
                      pe = z[2],
                      J = z[3];
                    (x.totalMinWidth = H),
                      (x.totalWidth = q),
                      (x.totalMaxWidth = pe),
                      (x.totalFlexWidth = J);
                  } else (x.totalMinWidth = x.minWidth), (x.totalWidth = Math.min(Math.max(x.minWidth, x.width), x.maxWidth)), (x.totalMaxWidth = x.maxWidth), (x.totalFlexWidth = x.canResize ? x.totalWidth : 0);
                  x.isVisible &&
                    ((d += x.totalWidth),
                    (m += x.totalMinWidth),
                    (v += x.totalWidth),
                    (S += x.totalMaxWidth),
                    (C += x.totalFlexWidth));
                }),
                [m, v, S, C]
              );
            }
            function fr(l) {
              var d = l.data,
                m = l.rows,
                v = l.flatRows,
                S = l.rowsById,
                C = l.column,
                x = l.getRowId,
                $ = l.getSubRows,
                z = l.accessValueHooks,
                H = l.getInstance,
                q = function pe(J, ue, ge, Q, Pe) {
                  ge === void 0 && (ge = 0);
                  var ze = J,
                    Ve = x(J, ue, Q),
                    xe = S[Ve];
                  if (xe)
                    xe.subRows &&
                      xe.originalSubRows.forEach(function (ot, Se) {
                        return pe(ot, Se, ge + 1, xe);
                      });
                  else if (
                    ((xe = {
                      id: Ve,
                      original: ze,
                      index: ue,
                      depth: ge,
                      cells: [{}],
                    }),
                    (xe.cells.map = Ge),
                    (xe.cells.filter = Ge),
                    (xe.cells.forEach = Ge),
                    (xe.cells[0].getCellProps = Ge),
                    (xe.values = {}),
                    Pe.push(xe),
                    v.push(xe),
                    (S[Ve] = xe),
                    (xe.originalSubRows = $(J, ue)),
                    xe.originalSubRows)
                  ) {
                    var Je = [];
                    xe.originalSubRows.forEach(function (ot, Se) {
                      return pe(ot, Se, ge + 1, xe, Je);
                    }),
                      (xe.subRows = Je);
                  }
                  C.accessor &&
                    (xe.values[C.id] = C.accessor(J, ue, xe, Pe, d)),
                    (xe.values[C.id] = F(
                      z,
                      xe.values[C.id],
                      { row: xe, column: C, instance: H() },
                      !0
                    ));
                };
              d.forEach(function (pe, J) {
                return q(pe, J, 0, void 0, m);
              });
            }
            (h.resetExpanded = "resetExpanded"),
              (h.toggleRowExpanded = "toggleRowExpanded"),
              (h.toggleAllRowsExpanded = "toggleAllRowsExpanded");
            var Fn = function (d) {
              (d.getToggleAllRowsExpandedProps = [dr]),
                (d.getToggleRowExpandedProps = [Kn]),
                d.stateReducers.push(Qn),
                d.useInstance.push(Cn),
                d.prepareRow.push($r);
            };
            Fn.pluginName = "useExpanded";
            var dr = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    onClick: function (C) {
                      v.toggleAllRowsExpanded();
                    },
                    style: { cursor: "pointer" },
                    title: "Toggle All Rows Expanded",
                  },
                ];
              },
              Kn = function (d, m) {
                var v = m.row;
                return [
                  d,
                  {
                    onClick: function () {
                      v.toggleRowExpanded();
                    },
                    style: { cursor: "pointer" },
                    title: "Toggle Row Expanded",
                  },
                ];
              };
            function Qn(l, d, m, v) {
              if (d.type === h.init) return a({ expanded: {} }, l);
              if (d.type === h.resetExpanded)
                return a({}, l, { expanded: v.initialState.expanded || {} });
              if (d.type === h.toggleAllRowsExpanded) {
                var S = d.value,
                  C = v.rowsById,
                  x = Object.keys(C).length === Object.keys(l.expanded).length,
                  $ = typeof S < "u" ? S : !x;
                if ($) {
                  var z = {};
                  return (
                    Object.keys(C).forEach(function (Pe) {
                      z[Pe] = !0;
                    }),
                    a({}, l, { expanded: z })
                  );
                }
                return a({}, l, { expanded: {} });
              }
              if (d.type === h.toggleRowExpanded) {
                var H = d.id,
                  q = d.value,
                  pe = l.expanded[H],
                  J = typeof q < "u" ? q : !pe;
                if (!pe && J) {
                  var ue;
                  return a({}, l, {
                    expanded: a({}, l.expanded, ((ue = {}), (ue[H] = !0), ue)),
                  });
                } else if (pe && !J) {
                  var ge = l.expanded;
                  ge[H];
                  var Q = u(ge, [H].map(c));
                  return a({}, l, { expanded: Q });
                } else return l;
              }
            }
            function Cn(l) {
              var d = l.data,
                m = l.rows,
                v = l.rowsById,
                S = l.manualExpandedKey,
                C = S === void 0 ? "expanded" : S,
                x = l.paginateExpandedRows,
                $ = x === void 0 ? !0 : x,
                z = l.expandSubRows,
                H = z === void 0 ? !0 : z,
                q = l.autoResetExpanded,
                pe = q === void 0 ? !0 : q,
                J = l.getHooks,
                ue = l.plugins,
                ge = l.state.expanded,
                Q = l.dispatch;
              G(
                ue,
                [
                  "useSortBy",
                  "useGroupBy",
                  "usePivotColumns",
                  "useGlobalFilter",
                ],
                "useExpanded"
              );
              var Pe = D(pe),
                ze = Boolean(Object.keys(v).length && Object.keys(ge).length);
              ze &&
                Object.keys(v).some(function (Re) {
                  return !ge[Re];
                }) &&
                (ze = !1),
                Z(
                  function () {
                    Pe() && Q({ type: h.resetExpanded });
                  },
                  [Q, d]
                );
              var Ve = r.useCallback(
                  function (Re, Be) {
                    Q({ type: h.toggleRowExpanded, id: Re, value: Be });
                  },
                  [Q]
                ),
                xe = r.useCallback(
                  function (Re) {
                    return Q({ type: h.toggleAllRowsExpanded, value: Re });
                  },
                  [Q]
                ),
                Je = r.useMemo(
                  function () {
                    return $
                      ? Ce(m, {
                          manualExpandedKey: C,
                          expanded: ge,
                          expandSubRows: H,
                        })
                      : m;
                  },
                  [$, m, C, ge, H]
                ),
                ot = r.useMemo(
                  function () {
                    return Vt(ge);
                  },
                  [ge]
                ),
                Se = D(l),
                be = k(J().getToggleAllRowsExpandedProps, { instance: Se() });
              Object.assign(l, {
                preExpandedRows: m,
                expandedRows: Je,
                rows: Je,
                expandedDepth: ot,
                isAllRowsExpanded: ze,
                toggleRowExpanded: Ve,
                toggleAllRowsExpanded: xe,
                getToggleAllRowsExpandedProps: be,
              });
            }
            function $r(l, d) {
              var m = d.instance.getHooks,
                v = d.instance;
              (l.toggleRowExpanded = function (S) {
                return v.toggleRowExpanded(l.id, S);
              }),
                (l.getToggleRowExpandedProps = k(
                  m().getToggleRowExpandedProps,
                  { instance: v, row: l }
                ));
            }
            function Vt(l) {
              var d = 0;
              return (
                Object.keys(l).forEach(function (m) {
                  var v = m.split(".");
                  d = Math.max(d, v.length);
                }),
                d
              );
            }
            var Xt = function (d, m, v) {
              return (
                (d = d.filter(function (S) {
                  return m.some(function (C) {
                    var x = S.values[C];
                    return String(x)
                      .toLowerCase()
                      .includes(String(v).toLowerCase());
                  });
                })),
                d
              );
            };
            Xt.autoRemove = function (l) {
              return !l;
            };
            var O = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return x !== void 0
                    ? String(x).toLowerCase() === String(v).toLowerCase()
                    : !0;
                });
              });
            };
            O.autoRemove = function (l) {
              return !l;
            };
            var ee = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return x !== void 0 ? String(x) === String(v) : !0;
                });
              });
            };
            ee.autoRemove = function (l) {
              return !l;
            };
            var ve = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return x.includes(v);
                });
              });
            };
            ve.autoRemove = function (l) {
              return !l || !l.length;
            };
            var Le = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return (
                    x &&
                    x.length &&
                    v.every(function ($) {
                      return x.includes($);
                    })
                  );
                });
              });
            };
            Le.autoRemove = function (l) {
              return !l || !l.length;
            };
            var vt = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return (
                    x &&
                    x.length &&
                    v.some(function ($) {
                      return x.includes($);
                    })
                  );
                });
              });
            };
            vt.autoRemove = function (l) {
              return !l || !l.length;
            };
            var bt = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return v.includes(x);
                });
              });
            };
            bt.autoRemove = function (l) {
              return !l || !l.length;
            };
            var ut = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return x === v;
                });
              });
            };
            ut.autoRemove = function (l) {
              return typeof l > "u";
            };
            var it = function (d, m, v) {
              return d.filter(function (S) {
                return m.some(function (C) {
                  var x = S.values[C];
                  return x == v;
                });
              });
            };
            it.autoRemove = function (l) {
              return l == null;
            };
            var kt = function (d, m, v) {
              var S = v || [],
                C = S[0],
                x = S[1];
              if (
                ((C = typeof C == "number" ? C : -1 / 0),
                (x = typeof x == "number" ? x : 1 / 0),
                C > x)
              ) {
                var $ = C;
                (C = x), (x = $);
              }
              return d.filter(function (z) {
                return m.some(function (H) {
                  var q = z.values[H];
                  return q >= C && q <= x;
                });
              });
            };
            kt.autoRemove = function (l) {
              return !l || (typeof l[0] != "number" && typeof l[1] != "number");
            };
            var Pt = Object.freeze({
              __proto__: null,
              text: Xt,
              exactText: O,
              exactTextCase: ee,
              includes: ve,
              includesAll: Le,
              includesSome: vt,
              includesValue: bt,
              exact: ut,
              equals: it,
              between: kt,
            });
            (h.resetFilters = "resetFilters"),
              (h.setFilter = "setFilter"),
              (h.setAllFilters = "setAllFilters");
            var Ot = function (d) {
              d.stateReducers.push(hn), d.useInstance.push(Zn);
            };
            Ot.pluginName = "useFilters";
            function hn(l, d, m, v) {
              if (d.type === h.init) return a({ filters: [] }, l);
              if (d.type === h.resetFilters)
                return a({}, l, { filters: v.initialState.filters || [] });
              if (d.type === h.setFilter) {
                var S = d.columnId,
                  C = d.filterValue,
                  x = v.allColumns,
                  $ = v.filterTypes,
                  z = x.find(function (Q) {
                    return Q.id === S;
                  });
                if (!z)
                  throw new Error(
                    "React-Table: Could not find a column with id: " + S
                  );
                var H = Ee(z.filter, $ || {}, Pt),
                  q = l.filters.find(function (Q) {
                    return Q.id === S;
                  }),
                  pe = M(C, q && q.value);
                return De(H.autoRemove, pe, z)
                  ? a({}, l, {
                      filters: l.filters.filter(function (Q) {
                        return Q.id !== S;
                      }),
                    })
                  : q
                  ? a({}, l, {
                      filters: l.filters.map(function (Q) {
                        return Q.id === S ? { id: S, value: pe } : Q;
                      }),
                    })
                  : a({}, l, {
                      filters: [].concat(l.filters, [{ id: S, value: pe }]),
                    });
              }
              if (d.type === h.setAllFilters) {
                var J = d.filters,
                  ue = v.allColumns,
                  ge = v.filterTypes;
                return a({}, l, {
                  filters: M(J, l.filters).filter(function (Q) {
                    var Pe = ue.find(function (Ve) {
                        return Ve.id === Q.id;
                      }),
                      ze = Ee(Pe.filter, ge || {}, Pt);
                    return !De(ze.autoRemove, Q.value, Pe);
                  }),
                });
              }
            }
            function Zn(l) {
              var d = l.data,
                m = l.rows,
                v = l.flatRows,
                S = l.rowsById,
                C = l.allColumns,
                x = l.filterTypes,
                $ = l.manualFilters,
                z = l.defaultCanFilter,
                H = z === void 0 ? !1 : z,
                q = l.disableFilters,
                pe = l.state.filters,
                J = l.dispatch,
                ue = l.autoResetFilters,
                ge = ue === void 0 ? !0 : ue,
                Q = r.useCallback(
                  function (Se, be) {
                    J({ type: h.setFilter, columnId: Se, filterValue: be });
                  },
                  [J]
                ),
                Pe = r.useCallback(
                  function (Se) {
                    J({ type: h.setAllFilters, filters: Se });
                  },
                  [J]
                );
              C.forEach(function (Se) {
                var be = Se.id,
                  Re = Se.accessor,
                  Be = Se.defaultCanFilter,
                  tt = Se.disableFilters;
                (Se.canFilter = Re
                  ? Ne(tt === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0)
                  : Ne(Be, H, !1)),
                  (Se.setFilter = function (Tt) {
                    return Q(Se.id, Tt);
                  });
                var nt = pe.find(function (Tt) {
                  return Tt.id === be;
                });
                Se.filterValue = nt && nt.value;
              });
              var ze = r.useMemo(
                  function () {
                    if ($ || !pe.length) return [m, v, S];
                    var Se = [],
                      be = {},
                      Re = function Be(tt, nt) {
                        nt === void 0 && (nt = 0);
                        var Tt = tt;
                        return (
                          (Tt = pe.reduce(function (Oe, zt) {
                            var rt = zt.id,
                              Ye = zt.value,
                              Ke = C.find(function (Ut) {
                                return Ut.id === rt;
                              });
                            if (!Ke) return Oe;
                            nt === 0 && (Ke.preFilteredRows = Oe);
                            var Nt = Ee(Ke.filter, x || {}, Pt);
                            return Nt
                              ? ((Ke.filteredRows = Nt(Oe, [rt], Ye)),
                                Ke.filteredRows)
                              : (console.warn(
                                  "Could not find a valid 'column.filter' for column with the ID: " +
                                    Ke.id +
                                    "."
                                ),
                                Oe);
                          }, tt)),
                          Tt.forEach(function (Oe) {
                            Se.push(Oe),
                              (be[Oe.id] = Oe),
                              Oe.subRows &&
                                (Oe.subRows =
                                  Oe.subRows && Oe.subRows.length > 0
                                    ? Be(Oe.subRows, nt + 1)
                                    : Oe.subRows);
                          }),
                          Tt
                        );
                      };
                    return [Re(m), Se, be];
                  },
                  [$, pe, m, v, S, C, x]
                ),
                Ve = ze[0],
                xe = ze[1],
                Je = ze[2];
              r.useMemo(
                function () {
                  var Se = C.filter(function (be) {
                    return !pe.find(function (Re) {
                      return Re.id === be.id;
                    });
                  });
                  Se.forEach(function (be) {
                    (be.preFilteredRows = Ve), (be.filteredRows = Ve);
                  });
                },
                [Ve, pe, C]
              );
              var ot = D(ge);
              Z(
                function () {
                  ot() && J({ type: h.resetFilters });
                },
                [J, $ ? null : d]
              ),
                Object.assign(l, {
                  preFilteredRows: m,
                  preFilteredFlatRows: v,
                  preFilteredRowsById: S,
                  filteredRows: Ve,
                  filteredFlatRows: xe,
                  filteredRowsById: Je,
                  rows: Ve,
                  flatRows: xe,
                  rowsById: Je,
                  setFilter: Q,
                  setAllFilters: Pe,
                });
            }
            (h.resetGlobalFilter = "resetGlobalFilter"),
              (h.setGlobalFilter = "setGlobalFilter");
            var ii = function (d) {
              d.stateReducers.push(ln), d.useInstance.push(gu);
            };
            ii.pluginName = "useGlobalFilter";
            function ln(l, d, m, v) {
              if (d.type === h.resetGlobalFilter)
                return a({}, l, {
                  globalFilter: v.initialState.globalFilter || void 0,
                });
              if (d.type === h.setGlobalFilter) {
                var S = d.filterValue,
                  C = v.userFilterTypes,
                  x = Ee(v.globalFilter, C || {}, Pt),
                  $ = M(S, l.globalFilter);
                if (De(x.autoRemove, $)) {
                  l.globalFilter;
                  var z = u(l, ["globalFilter"]);
                  return z;
                }
                return a({}, l, { globalFilter: $ });
              }
            }
            function gu(l) {
              var d = l.data,
                m = l.rows,
                v = l.flatRows,
                S = l.rowsById,
                C = l.allColumns,
                x = l.filterTypes,
                $ = l.globalFilter,
                z = l.manualGlobalFilter,
                H = l.state.globalFilter,
                q = l.dispatch,
                pe = l.autoResetGlobalFilter,
                J = pe === void 0 ? !0 : pe,
                ue = l.disableGlobalFilter,
                ge = r.useCallback(
                  function (Je) {
                    q({ type: h.setGlobalFilter, filterValue: Je });
                  },
                  [q]
                ),
                Q = r.useMemo(
                  function () {
                    if (z || typeof H > "u") return [m, v, S];
                    var Je = [],
                      ot = {},
                      Se = Ee($, x || {}, Pt);
                    if (!Se)
                      return (
                        console.warn(
                          "Could not find a valid 'globalFilter' option."
                        ),
                        m
                      );
                    C.forEach(function (Be) {
                      var tt = Be.disableGlobalFilter;
                      Be.canFilter = Ne(
                        tt === !0 ? !1 : void 0,
                        ue === !0 ? !1 : void 0,
                        !0
                      );
                    });
                    var be = C.filter(function (Be) {
                        return Be.canFilter === !0;
                      }),
                      Re = function Be(tt) {
                        return (
                          (tt = Se(
                            tt,
                            be.map(function (nt) {
                              return nt.id;
                            }),
                            H
                          )),
                          tt.forEach(function (nt) {
                            Je.push(nt),
                              (ot[nt.id] = nt),
                              (nt.subRows =
                                nt.subRows && nt.subRows.length
                                  ? Be(nt.subRows)
                                  : nt.subRows);
                          }),
                          tt
                        );
                      };
                    return [Re(m), Je, ot];
                  },
                  [z, H, $, x, C, m, v, S, ue]
                ),
                Pe = Q[0],
                ze = Q[1],
                Ve = Q[2],
                xe = D(J);
              Z(
                function () {
                  xe() && q({ type: h.resetGlobalFilter });
                },
                [q, z ? null : d]
              ),
                Object.assign(l, {
                  preGlobalFilteredRows: m,
                  preGlobalFilteredFlatRows: v,
                  preGlobalFilteredRowsById: S,
                  globalFilteredRows: Pe,
                  globalFilteredFlatRows: ze,
                  globalFilteredRowsById: Ve,
                  rows: Pe,
                  flatRows: ze,
                  rowsById: Ve,
                  setGlobalFilter: ge,
                  disableGlobalFilter: ue,
                });
            }
            function zi(l, d) {
              return d.reduce(function (m, v) {
                return m + (typeof v == "number" ? v : 0);
              }, 0);
            }
            function oi(l) {
              var d = l[0] || 0;
              return (
                l.forEach(function (m) {
                  typeof m == "number" && (d = Math.min(d, m));
                }),
                d
              );
            }
            function mu(l) {
              var d = l[0] || 0;
              return (
                l.forEach(function (m) {
                  typeof m == "number" && (d = Math.max(d, m));
                }),
                d
              );
            }
            function Qc(l) {
              var d = l[0] || 0,
                m = l[0] || 0;
              return (
                l.forEach(function (v) {
                  typeof v == "number" &&
                    ((d = Math.min(d, v)), (m = Math.max(m, v)));
                }),
                d + ".." + m
              );
            }
            function yu(l) {
              return zi(null, l) / l.length;
            }
            function Zc(l) {
              if (!l.length) return null;
              var d = Math.floor(l.length / 2),
                m = [].concat(l).sort(function (v, S) {
                  return v - S;
                });
              return l.length % 2 !== 0 ? m[d] : (m[d - 1] + m[d]) / 2;
            }
            function Jc(l) {
              return Array.from(new Set(l).values());
            }
            function ef(l) {
              return new Set(l).size;
            }
            function bu(l) {
              return l.length;
            }
            var Go = Object.freeze({
                __proto__: null,
                sum: zi,
                min: oi,
                max: mu,
                minMax: Qc,
                average: yu,
                median: Zc,
                unique: Jc,
                uniqueCount: ef,
                count: bu,
              }),
              tf = [],
              nf = {};
            (h.resetGroupBy = "resetGroupBy"),
              (h.setGroupBy = "setGroupBy"),
              (h.toggleGroupBy = "toggleGroupBy");
            var jo = function (d) {
              (d.getGroupByToggleProps = [wu]),
                d.stateReducers.push(rf),
                d.visibleColumnsDeps.push(function (m, v) {
                  var S = v.instance;
                  return [].concat(m, [S.state.groupBy]);
                }),
                d.visibleColumns.push(of),
                d.useInstance.push(uf),
                d.prepareRow.push(sf);
            };
            jo.pluginName = "useGroupBy";
            var wu = function (d, m) {
              var v = m.header;
              return [
                d,
                {
                  onClick: v.canGroupBy
                    ? function (S) {
                        S.persist(), v.toggleGroupBy();
                      }
                    : void 0,
                  style: { cursor: v.canGroupBy ? "pointer" : void 0 },
                  title: "Toggle GroupBy",
                },
              ];
            };
            function rf(l, d, m, v) {
              if (d.type === h.init) return a({ groupBy: [] }, l);
              if (d.type === h.resetGroupBy)
                return a({}, l, { groupBy: v.initialState.groupBy || [] });
              if (d.type === h.setGroupBy) {
                var S = d.value;
                return a({}, l, { groupBy: S });
              }
              if (d.type === h.toggleGroupBy) {
                var C = d.columnId,
                  x = d.value,
                  $ = typeof x < "u" ? x : !l.groupBy.includes(C);
                return $
                  ? a({}, l, { groupBy: [].concat(l.groupBy, [C]) })
                  : a({}, l, {
                      groupBy: l.groupBy.filter(function (z) {
                        return z !== C;
                      }),
                    });
              }
            }
            function of(l, d) {
              var m = d.instance.state.groupBy,
                v = m
                  .map(function (C) {
                    return l.find(function (x) {
                      return x.id === C;
                    });
                  })
                  .filter(Boolean),
                S = l.filter(function (C) {
                  return !m.includes(C.id);
                });
              return (
                (l = [].concat(v, S)),
                l.forEach(function (C) {
                  (C.isGrouped = m.includes(C.id)),
                    (C.groupedIndex = m.indexOf(C.id));
                }),
                l
              );
            }
            var af = {};
            function uf(l) {
              var d = l.data,
                m = l.rows,
                v = l.flatRows,
                S = l.rowsById,
                C = l.allColumns,
                x = l.flatHeaders,
                $ = l.groupByFn,
                z = $ === void 0 ? xu : $,
                H = l.manualGroupBy,
                q = l.aggregations,
                pe = q === void 0 ? af : q,
                J = l.plugins,
                ue = l.state.groupBy,
                ge = l.dispatch,
                Q = l.autoResetGroupBy,
                Pe = Q === void 0 ? !0 : Q,
                ze = l.disableGroupBy,
                Ve = l.defaultCanGroupBy,
                xe = l.getHooks;
              G(J, ["useColumnOrder", "useFilters"], "useGroupBy");
              var Je = D(l);
              C.forEach(function (Ye) {
                var Ke = Ye.accessor,
                  Nt = Ye.defaultGroupBy,
                  Ut = Ye.disableGroupBy;
                (Ye.canGroupBy = Ke
                  ? Ne(
                      Ye.canGroupBy,
                      Ut === !0 ? !1 : void 0,
                      ze === !0 ? !1 : void 0,
                      !0
                    )
                  : Ne(Ye.canGroupBy, Nt, Ve, !1)),
                  Ye.canGroupBy &&
                    (Ye.toggleGroupBy = function () {
                      return l.toggleGroupBy(Ye.id);
                    }),
                  (Ye.Aggregated = Ye.Aggregated || Ye.Cell);
              });
              var ot = r.useCallback(
                  function (Ye, Ke) {
                    ge({ type: h.toggleGroupBy, columnId: Ye, value: Ke });
                  },
                  [ge]
                ),
                Se = r.useCallback(
                  function (Ye) {
                    ge({ type: h.setGroupBy, value: Ye });
                  },
                  [ge]
                );
              x.forEach(function (Ye) {
                Ye.getGroupByToggleProps = k(xe().getGroupByToggleProps, {
                  instance: Je(),
                  header: Ye,
                });
              });
              var be = r.useMemo(
                  function () {
                    if (H || !ue.length) return [m, v, S, tf, nf, v, S];
                    var Ye = ue.filter(function (Lt) {
                        return C.find(function (Fr) {
                          return Fr.id === Lt;
                        });
                      }),
                      Ke = function (Fr, Kt, Lu) {
                        var Ir = {};
                        return (
                          C.forEach(function (Ft) {
                            if (Ye.includes(Ft.id)) {
                              Ir[Ft.id] = Kt[0] ? Kt[0].values[Ft.id] : null;
                              return;
                            }
                            var Gu =
                              typeof Ft.aggregate == "function"
                                ? Ft.aggregate
                                : pe[Ft.aggregate] || Go[Ft.aggregate];
                            if (Gu) {
                              var Gi = Kt.map(function (si) {
                                  return si.values[Ft.id];
                                }),
                                Tf = Fr.map(function (si) {
                                  var Br = si.values[Ft.id];
                                  if (!Lu && Ft.aggregateValue) {
                                    var Dr =
                                      typeof Ft.aggregateValue == "function"
                                        ? Ft.aggregateValue
                                        : pe[Ft.aggregateValue] ||
                                          Go[Ft.aggregateValue];
                                    if (!Dr)
                                      throw (
                                        (console.info({ column: Ft }),
                                        new Error(
                                          "React Table: Invalid column.aggregateValue option for column listed above"
                                        ))
                                      );
                                    Br = Dr(Br, si, Ft);
                                  }
                                  return Br;
                                });
                              Ir[Ft.id] = Gu(Tf, Gi);
                            } else {
                              if (Ft.aggregate)
                                throw (
                                  (console.info({ column: Ft }),
                                  new Error(
                                    "React Table: Invalid column.aggregate option for column listed above"
                                  ))
                                );
                              Ir[Ft.id] = null;
                            }
                          }),
                          Ir
                        );
                      },
                      Nt = [],
                      Ut = {},
                      ui = [],
                      Qo = {},
                      We = [],
                      Et = {},
                      Bt = function Lt(Fr, Kt, Lu) {
                        if ((Kt === void 0 && (Kt = 0), Kt === Ye.length))
                          return Fr.map(function (Gi) {
                            return a({}, Gi, { depth: Kt });
                          });
                        var Ir = Ye[Kt],
                          Ft = z(Fr, Ir),
                          Gu = Object.entries(Ft).map(function (Gi, Tf) {
                            var si = Gi[0],
                              Br = Gi[1],
                              Dr = Ir + ":" + si;
                            Dr = Lu ? Lu + ">" + Dr : Dr;
                            var Mm = Lt(Br, Kt + 1, Dr),
                              Om = Kt ? Te(Br, "leafRows") : Br,
                              JT = Ke(Om, Br, Kt),
                              eP = {
                                id: Dr,
                                isGrouped: !0,
                                groupByID: Ir,
                                groupByVal: si,
                                values: JT,
                                subRows: Mm,
                                leafRows: Om,
                                depth: Kt,
                                index: Tf,
                              };
                            return (
                              Mm.forEach(function (Jn) {
                                Nt.push(Jn),
                                  (Ut[Jn.id] = Jn),
                                  Jn.isGrouped
                                    ? (ui.push(Jn), (Qo[Jn.id] = Jn))
                                    : (We.push(Jn), (Et[Jn.id] = Jn));
                              }),
                              eP
                            );
                          });
                        return Gu;
                      },
                      nn = Bt(m);
                    return (
                      nn.forEach(function (Lt) {
                        Nt.push(Lt),
                          (Ut[Lt.id] = Lt),
                          Lt.isGrouped
                            ? (ui.push(Lt), (Qo[Lt.id] = Lt))
                            : (We.push(Lt), (Et[Lt.id] = Lt));
                      }),
                      [nn, Nt, Ut, ui, Qo, We, Et]
                    );
                  },
                  [H, ue, m, v, S, C, pe, z]
                ),
                Re = be[0],
                Be = be[1],
                tt = be[2],
                nt = be[3],
                Tt = be[4],
                Oe = be[5],
                zt = be[6],
                rt = D(Pe);
              Z(
                function () {
                  rt() && ge({ type: h.resetGroupBy });
                },
                [ge, H ? null : d]
              ),
                Object.assign(l, {
                  preGroupedRows: m,
                  preGroupedFlatRow: v,
                  preGroupedRowsById: S,
                  groupedRows: Re,
                  groupedFlatRows: Be,
                  groupedRowsById: tt,
                  onlyGroupedFlatRows: nt,
                  onlyGroupedRowsById: Tt,
                  nonGroupedFlatRows: Oe,
                  nonGroupedRowsById: zt,
                  rows: Re,
                  flatRows: Be,
                  rowsById: tt,
                  toggleGroupBy: ot,
                  setGroupBy: Se,
                });
            }
            function sf(l) {
              l.allCells.forEach(function (d) {
                var m;
                (d.isGrouped =
                  d.column.isGrouped && d.column.id === l.groupByID),
                  (d.isPlaceholder = !d.isGrouped && d.column.isGrouped),
                  (d.isAggregated =
                    !d.isGrouped &&
                    !d.isPlaceholder &&
                    ((m = l.subRows) == null ? void 0 : m.length));
              });
            }
            function xu(l, d) {
              return l.reduce(function (m, v, S) {
                var C = "" + v.values[d];
                return (
                  (m[C] = Array.isArray(m[C]) ? m[C] : []), m[C].push(v), m
                );
              }, {});
            }
            var _u = /([0-9]+)/gm,
              lf = function (d, m, v) {
                var S = ai(d, m, v),
                  C = S[0],
                  x = S[1];
                for (
                  C = Ru(C),
                    x = Ru(x),
                    C = C.split(_u).filter(Boolean),
                    x = x.split(_u).filter(Boolean);
                  C.length && x.length;

                ) {
                  var $ = C.shift(),
                    z = x.shift(),
                    H = parseInt($, 10),
                    q = parseInt(z, 10),
                    pe = [H, q].sort();
                  if (isNaN(pe[0])) {
                    if ($ > z) return 1;
                    if (z > $) return -1;
                    continue;
                  }
                  if (isNaN(pe[1])) return isNaN(H) ? -1 : 1;
                  if (H > q) return 1;
                  if (q > H) return -1;
                }
                return C.length - x.length;
              };
            function cf(l, d, m) {
              var v = ai(l, d, m),
                S = v[0],
                C = v[1];
              return (S = S.getTime()), (C = C.getTime()), Ho(S, C);
            }
            function ff(l, d, m) {
              var v = ai(l, d, m),
                S = v[0],
                C = v[1];
              return Ho(S, C);
            }
            function df(l, d, m) {
              var v = ai(l, d, m),
                S = v[0],
                C = v[1];
              for (
                S = S.split("").filter(Boolean),
                  C = C.split("").filter(Boolean);
                S.length && C.length;

              ) {
                var x = S.shift(),
                  $ = C.shift(),
                  z = x.toLowerCase(),
                  H = $.toLowerCase();
                if (z > H) return 1;
                if (H > z) return -1;
                if (x > $) return 1;
                if ($ > x) return -1;
              }
              return S.length - C.length;
            }
            function Su(l, d, m) {
              var v = ai(l, d, m),
                S = v[0],
                C = v[1],
                x = /[^0-9.]/gi;
              return (
                (S = Number(String(S).replace(x, ""))),
                (C = Number(String(C).replace(x, ""))),
                Ho(S, C)
              );
            }
            function Ho(l, d) {
              return l === d ? 0 : l > d ? 1 : -1;
            }
            function ai(l, d, m) {
              return [l.values[m], d.values[m]];
            }
            function Ru(l) {
              return typeof l == "number"
                ? isNaN(l) || l === 1 / 0 || l === -1 / 0
                  ? ""
                  : String(l)
                : typeof l == "string"
                ? l
                : "";
            }
            var hf = Object.freeze({
              __proto__: null,
              alphanumeric: lf,
              datetime: cf,
              basic: ff,
              string: df,
              number: Su,
            });
            (h.resetSortBy = "resetSortBy"),
              (h.setSortBy = "setSortBy"),
              (h.toggleSortBy = "toggleSortBy"),
              (h.clearSortBy = "clearSortBy"),
              (_.sortType = "alphanumeric"),
              (_.sortDescFirst = !1);
            var Cu = function (d) {
              (d.getSortByToggleProps = [pf]),
                d.stateReducers.push(Tu),
                d.useInstance.push(Pu);
            };
            Cu.pluginName = "useSortBy";
            var pf = function (d, m) {
              var v = m.instance,
                S = m.column,
                C = v.isMultiSortEvent,
                x =
                  C === void 0
                    ? function ($) {
                        return $.shiftKey;
                      }
                    : C;
              return [
                d,
                {
                  onClick: S.canSort
                    ? function ($) {
                        $.persist(),
                          S.toggleSortBy(void 0, !v.disableMultiSort && x($));
                      }
                    : void 0,
                  style: { cursor: S.canSort ? "pointer" : void 0 },
                  title: S.canSort ? "Toggle SortBy" : void 0,
                },
              ];
            };
            function Tu(l, d, m, v) {
              if (d.type === h.init) return a({ sortBy: [] }, l);
              if (d.type === h.resetSortBy)
                return a({}, l, { sortBy: v.initialState.sortBy || [] });
              if (d.type === h.clearSortBy) {
                var S = l.sortBy,
                  C = S.filter(function (Re) {
                    return Re.id !== d.columnId;
                  });
                return a({}, l, { sortBy: C });
              }
              if (d.type === h.setSortBy) {
                var x = d.sortBy;
                return a({}, l, { sortBy: x });
              }
              if (d.type === h.toggleSortBy) {
                var $ = d.columnId,
                  z = d.desc,
                  H = d.multi,
                  q = v.allColumns,
                  pe = v.disableMultiSort,
                  J = v.disableSortRemove,
                  ue = v.disableMultiRemove,
                  ge = v.maxMultiSortColCount,
                  Q = ge === void 0 ? Number.MAX_SAFE_INTEGER : ge,
                  Pe = l.sortBy,
                  ze = q.find(function (Re) {
                    return Re.id === $;
                  }),
                  Ve = ze.sortDescFirst,
                  xe = Pe.find(function (Re) {
                    return Re.id === $;
                  }),
                  Je = Pe.findIndex(function (Re) {
                    return Re.id === $;
                  }),
                  ot = typeof z < "u" && z !== null,
                  Se = [],
                  be;
                return (
                  !pe && H
                    ? xe
                      ? (be = "toggle")
                      : (be = "add")
                    : Je !== Pe.length - 1 || Pe.length !== 1
                    ? (be = "replace")
                    : xe
                    ? (be = "toggle")
                    : (be = "replace"),
                  be === "toggle" &&
                    !J &&
                    !ot &&
                    (H ? !ue : !0) &&
                    ((xe && xe.desc && !Ve) || (!xe.desc && Ve)) &&
                    (be = "remove"),
                  be === "replace"
                    ? (Se = [{ id: $, desc: ot ? z : Ve }])
                    : be === "add"
                    ? ((Se = [].concat(Pe, [{ id: $, desc: ot ? z : Ve }])),
                      Se.splice(0, Se.length - Q))
                    : be === "toggle"
                    ? (Se = Pe.map(function (Re) {
                        return Re.id === $
                          ? a({}, Re, { desc: ot ? z : !xe.desc })
                          : Re;
                      }))
                    : be === "remove" &&
                      (Se = Pe.filter(function (Re) {
                        return Re.id !== $;
                      })),
                  a({}, l, { sortBy: Se })
                );
              }
            }
            function Pu(l) {
              var d = l.data,
                m = l.rows,
                v = l.flatRows,
                S = l.allColumns,
                C = l.orderByFn,
                x = C === void 0 ? Wo : C,
                $ = l.sortTypes,
                z = l.manualSortBy,
                H = l.defaultCanSort,
                q = l.disableSortBy,
                pe = l.flatHeaders,
                J = l.state.sortBy,
                ue = l.dispatch,
                ge = l.plugins,
                Q = l.getHooks,
                Pe = l.autoResetSortBy,
                ze = Pe === void 0 ? !0 : Pe;
              G(
                ge,
                [
                  "useFilters",
                  "useGlobalFilter",
                  "useGroupBy",
                  "usePivotColumns",
                ],
                "useSortBy"
              );
              var Ve = r.useCallback(
                  function (Be) {
                    ue({ type: h.setSortBy, sortBy: Be });
                  },
                  [ue]
                ),
                xe = r.useCallback(
                  function (Be, tt, nt) {
                    ue({
                      type: h.toggleSortBy,
                      columnId: Be,
                      desc: tt,
                      multi: nt,
                    });
                  },
                  [ue]
                ),
                Je = D(l);
              pe.forEach(function (Be) {
                var tt = Be.accessor,
                  nt = Be.canSort,
                  Tt = Be.disableSortBy,
                  Oe = Be.id,
                  zt = tt
                    ? Ne(Tt === !0 ? !1 : void 0, q === !0 ? !1 : void 0, !0)
                    : Ne(H, nt, !1);
                (Be.canSort = zt),
                  Be.canSort &&
                    ((Be.toggleSortBy = function (Ye, Ke) {
                      return xe(Be.id, Ye, Ke);
                    }),
                    (Be.clearSortBy = function () {
                      ue({ type: h.clearSortBy, columnId: Be.id });
                    })),
                  (Be.getSortByToggleProps = k(Q().getSortByToggleProps, {
                    instance: Je(),
                    column: Be,
                  }));
                var rt = J.find(function (Ye) {
                  return Ye.id === Oe;
                });
                (Be.isSorted = !!rt),
                  (Be.sortedIndex = J.findIndex(function (Ye) {
                    return Ye.id === Oe;
                  })),
                  (Be.isSortedDesc = Be.isSorted ? rt.desc : void 0);
              });
              var ot = r.useMemo(
                  function () {
                    if (z || !J.length) return [m, v];
                    var Be = [],
                      tt = J.filter(function (Tt) {
                        return S.find(function (Oe) {
                          return Oe.id === Tt.id;
                        });
                      }),
                      nt = function Tt(Oe) {
                        var zt = x(
                          Oe,
                          tt.map(function (rt) {
                            var Ye = S.find(function (Ut) {
                              return Ut.id === rt.id;
                            });
                            if (!Ye)
                              throw new Error(
                                "React-Table: Could not find a column with id: " +
                                  rt.id +
                                  " while sorting"
                              );
                            var Ke = Ye.sortType,
                              Nt = $e(Ke) || ($ || {})[Ke] || hf[Ke];
                            if (!Nt)
                              throw new Error(
                                "React-Table: Could not find a valid sortType of '" +
                                  Ke +
                                  "' for column '" +
                                  rt.id +
                                  "'."
                              );
                            return function (Ut, ui) {
                              return Nt(Ut, ui, rt.id, rt.desc);
                            };
                          }),
                          tt.map(function (rt) {
                            var Ye = S.find(function (Ke) {
                              return Ke.id === rt.id;
                            });
                            return Ye && Ye.sortInverted ? rt.desc : !rt.desc;
                          })
                        );
                        return (
                          zt.forEach(function (rt) {
                            Be.push(rt),
                              !(!rt.subRows || rt.subRows.length === 0) &&
                                (rt.subRows = Tt(rt.subRows));
                          }),
                          zt
                        );
                      };
                    return [nt(m), Be];
                  },
                  [z, J, m, v, S, x, $]
                ),
                Se = ot[0],
                be = ot[1],
                Re = D(ze);
              Z(
                function () {
                  Re() && ue({ type: h.resetSortBy });
                },
                [z ? null : d]
              ),
                Object.assign(l, {
                  preSortedRows: m,
                  preSortedFlatRows: v,
                  sortedRows: Se,
                  sortedFlatRows: be,
                  rows: Se,
                  flatRows: be,
                  setSortBy: Ve,
                  toggleSortBy: xe,
                });
            }
            function Wo(l, d, m) {
              return [].concat(l).sort(function (v, S) {
                for (var C = 0; C < d.length; C += 1) {
                  var x = d[C],
                    $ = m[C] === !1 || m[C] === "desc",
                    z = x(v, S);
                  if (z !== 0) return $ ? -z : z;
                }
                return m[0] ? v.index - S.index : S.index - v.index;
              });
            }
            var vf = "usePagination";
            (h.resetPage = "resetPage"),
              (h.gotoPage = "gotoPage"),
              (h.setPageSize = "setPageSize");
            var Nu = function (d) {
              d.stateReducers.push(gf), d.useInstance.push(Eu);
            };
            Nu.pluginName = vf;
            function gf(l, d, m, v) {
              if (d.type === h.init)
                return a({ pageSize: 10, pageIndex: 0 }, l);
              if (d.type === h.resetPage)
                return a({}, l, { pageIndex: v.initialState.pageIndex || 0 });
              if (d.type === h.gotoPage) {
                var S = v.pageCount,
                  C = v.page,
                  x = M(d.pageIndex, l.pageIndex),
                  $ = !1;
                return (
                  x > l.pageIndex
                    ? ($ = S === -1 ? C.length >= l.pageSize : x < S)
                    : x < l.pageIndex && ($ = x > -1),
                  $ ? a({}, l, { pageIndex: x }) : l
                );
              }
              if (d.type === h.setPageSize) {
                var z = d.pageSize,
                  H = l.pageSize * l.pageIndex,
                  q = Math.floor(H / z);
                return a({}, l, { pageIndex: q, pageSize: z });
              }
            }
            function Eu(l) {
              var d = l.rows,
                m = l.autoResetPage,
                v = m === void 0 ? !0 : m,
                S = l.manualExpandedKey,
                C = S === void 0 ? "expanded" : S,
                x = l.plugins,
                $ = l.pageCount,
                z = l.paginateExpandedRows,
                H = z === void 0 ? !0 : z,
                q = l.expandSubRows,
                pe = q === void 0 ? !0 : q,
                J = l.state,
                ue = J.pageSize,
                ge = J.pageIndex,
                Q = J.expanded,
                Pe = J.globalFilter,
                ze = J.filters,
                Ve = J.groupBy,
                xe = J.sortBy,
                Je = l.dispatch,
                ot = l.data,
                Se = l.manualPagination;
              G(
                x,
                [
                  "useGlobalFilter",
                  "useFilters",
                  "useGroupBy",
                  "useSortBy",
                  "useExpanded",
                ],
                "usePagination"
              );
              var be = D(v);
              Z(
                function () {
                  be() && Je({ type: h.resetPage });
                },
                [Je, Se ? null : ot, Pe, ze, Ve, xe]
              );
              var Re = Se ? $ : Math.ceil(d.length / ue),
                Be = r.useMemo(
                  function () {
                    return Re > 0
                      ? []
                          .concat(new Array(Re))
                          .fill(null)
                          .map(function (Ke, Nt) {
                            return Nt;
                          })
                      : [];
                  },
                  [Re]
                ),
                tt = r.useMemo(
                  function () {
                    var Ke;
                    if (Se) Ke = d;
                    else {
                      var Nt = ue * ge,
                        Ut = Nt + ue;
                      Ke = d.slice(Nt, Ut);
                    }
                    return H
                      ? Ke
                      : Ce(Ke, {
                          manualExpandedKey: C,
                          expanded: Q,
                          expandSubRows: pe,
                        });
                  },
                  [pe, Q, C, Se, ge, ue, H, d]
                ),
                nt = ge > 0,
                Tt = Re === -1 ? tt.length >= ue : ge < Re - 1,
                Oe = r.useCallback(
                  function (Ke) {
                    Je({ type: h.gotoPage, pageIndex: Ke });
                  },
                  [Je]
                ),
                zt = r.useCallback(
                  function () {
                    return Oe(function (Ke) {
                      return Ke - 1;
                    });
                  },
                  [Oe]
                ),
                rt = r.useCallback(
                  function () {
                    return Oe(function (Ke) {
                      return Ke + 1;
                    });
                  },
                  [Oe]
                ),
                Ye = r.useCallback(
                  function (Ke) {
                    Je({ type: h.setPageSize, pageSize: Ke });
                  },
                  [Je]
                );
              Object.assign(l, {
                pageOptions: Be,
                pageCount: Re,
                page: tt,
                canPreviousPage: nt,
                canNextPage: Tt,
                gotoPage: Oe,
                previousPage: zt,
                nextPage: rt,
                setPageSize: Ye,
              });
            }
            (h.resetPivot = "resetPivot"), (h.togglePivot = "togglePivot");
            var Mu = function (d) {
              (d.getPivotToggleProps = [mf]),
                d.stateReducers.push(Au),
                d.useInstanceAfterData.push(yf),
                d.allColumns.push(bf),
                d.accessValue.push(wf),
                d.materializedColumns.push(xf),
                d.materializedColumnsDeps.push(Vo),
                d.visibleColumns.push(ku),
                d.visibleColumnsDeps.push(Li),
                d.useInstance.push(Uo),
                d.prepareRow.push(qo);
            };
            Mu.pluginName = "usePivotColumns";
            var Ou = [],
              mf = function (d, m) {
                var v = m.header;
                return [
                  d,
                  {
                    onClick: v.canPivot
                      ? function (S) {
                          S.persist(), v.togglePivot();
                        }
                      : void 0,
                    style: { cursor: v.canPivot ? "pointer" : void 0 },
                    title: "Toggle Pivot",
                  },
                ];
              };
            function Au(l, d, m, v) {
              if (d.type === h.init) return a({ pivotColumns: Ou }, l);
              if (d.type === h.resetPivot)
                return a({}, l, {
                  pivotColumns: v.initialState.pivotColumns || Ou,
                });
              if (d.type === h.togglePivot) {
                var S = d.columnId,
                  C = d.value,
                  x = typeof C < "u" ? C : !l.pivotColumns.includes(S);
                return x
                  ? a({}, l, { pivotColumns: [].concat(l.pivotColumns, [S]) })
                  : a({}, l, {
                      pivotColumns: l.pivotColumns.filter(function ($) {
                        return $ !== S;
                      }),
                    });
              }
            }
            function yf(l) {
              l.allColumns.forEach(function (d) {
                d.isPivotSource = l.state.pivotColumns.includes(d.id);
              });
            }
            function bf(l, d) {
              var m = d.instance;
              return (
                l.forEach(function (v) {
                  (v.isPivotSource = m.state.pivotColumns.includes(v.id)),
                    (v.uniqueValues = new Set());
                }),
                l
              );
            }
            function wf(l, d) {
              var m = d.column;
              return (
                m.uniqueValues && typeof l < "u" && m.uniqueValues.add(l), l
              );
            }
            function xf(l, d) {
              var m = d.instance,
                v = m.allColumns,
                S = m.state;
              if (!S.pivotColumns.length || !S.groupBy || !S.groupBy.length)
                return l;
              var C = S.pivotColumns
                  .map(function (H) {
                    return v.find(function (q) {
                      return q.id === H;
                    });
                  })
                  .filter(Boolean),
                x = v.filter(function (H) {
                  return (
                    !H.isPivotSource &&
                    !S.groupBy.includes(H.id) &&
                    !S.pivotColumns.includes(H.id)
                  );
                }),
                $ = function H(q, pe, J) {
                  q === void 0 && (q = 0), J === void 0 && (J = []);
                  var ue = C[q];
                  if (!ue)
                    return x.map(function (Q) {
                      return a({}, Q, {
                        canPivot: !1,
                        isPivoted: !0,
                        parent: pe,
                        depth: q,
                        id: "" + (pe ? pe.id + "." + Q.id : Q.id),
                        accessor: function (ze, Ve, xe) {
                          if (
                            J.every(function (Je) {
                              return Je(xe);
                            })
                          )
                            return xe.values[Q.id];
                        },
                      });
                    });
                  var ge = Array.from(ue.uniqueValues).sort();
                  return ge.map(function (Q) {
                    var Pe = a({}, ue, {
                      Header:
                        ue.PivotHeader || typeof ue.header == "string"
                          ? ue.Header + ": " + Q
                          : Q,
                      isPivotGroup: !0,
                      parent: pe,
                      depth: q,
                      id: pe ? pe.id + "." + ue.id + "." + Q : ue.id + "." + Q,
                      pivotValue: Q,
                    });
                    return (
                      (Pe.columns = H(
                        q + 1,
                        Pe,
                        [].concat(J, [
                          function (ze) {
                            return ze.values[ue.id] === Q;
                          },
                        ])
                      )),
                      Pe
                    );
                  });
                },
                z = Ue($());
              return [].concat(l, z);
            }
            function Vo(l, d) {
              var m = d.instance.state,
                v = m.pivotColumns,
                S = m.groupBy;
              return [].concat(l, [v, S]);
            }
            function ku(l, d) {
              var m = d.instance.state;
              return (
                (l = l.filter(function (v) {
                  return !v.isPivotSource;
                })),
                m.pivotColumns.length &&
                  m.groupBy &&
                  m.groupBy.length &&
                  (l = l.filter(function (v) {
                    return v.isGrouped || v.isPivoted;
                  })),
                l
              );
            }
            function Li(l, d) {
              var m = d.instance;
              return [].concat(l, [m.state.pivotColumns, m.state.groupBy]);
            }
            function Uo(l) {
              var d = l.columns,
                m = l.allColumns,
                v = l.flatHeaders,
                S = l.getHooks,
                C = l.plugins,
                x = l.dispatch,
                $ = l.autoResetPivot,
                z = $ === void 0 ? !0 : $,
                H = l.manaulPivot,
                q = l.disablePivot,
                pe = l.defaultCanPivot;
              G(C, ["useGroupBy"], "usePivotColumns");
              var J = D(l);
              m.forEach(function (Q) {
                var Pe = Q.accessor,
                  ze = Q.defaultPivot,
                  Ve = Q.disablePivot;
                (Q.canPivot = Pe
                  ? Ne(
                      Q.canPivot,
                      Ve === !0 ? !1 : void 0,
                      q === !0 ? !1 : void 0,
                      !0
                    )
                  : Ne(Q.canPivot, ze, pe, !1)),
                  Q.canPivot &&
                    (Q.togglePivot = function () {
                      return l.togglePivot(Q.id);
                    }),
                  (Q.Aggregated = Q.Aggregated || Q.Cell);
              });
              var ue = function (Pe, ze) {
                x({ type: h.togglePivot, columnId: Pe, value: ze });
              };
              v.forEach(function (Q) {
                Q.getPivotToggleProps = k(S().getPivotToggleProps, {
                  instance: J(),
                  header: Q,
                });
              });
              var ge = D(z);
              Z(
                function () {
                  ge() && x({ type: h.resetPivot });
                },
                [x, H ? null : d]
              ),
                Object.assign(l, { togglePivot: ue });
            }
            function qo(l) {
              l.allCells.forEach(function (d) {
                d.isPivoted = d.column.isPivoted;
              });
            }
            var $u = "useRowSelect";
            (h.resetSelectedRows = "resetSelectedRows"),
              (h.toggleAllRowsSelected = "toggleAllRowsSelected"),
              (h.toggleRowSelected = "toggleRowSelected"),
              (h.toggleAllPageRowsSelected = "toggleAllPageRowsSelected");
            var Yo = function (d) {
              (d.getToggleRowSelectedProps = [_f]),
                (d.getToggleAllRowsSelectedProps = [Xo]),
                (d.getToggleAllPageRowsSelectedProps = [Sf]),
                d.stateReducers.push(Rf),
                d.useInstance.push(Cf),
                d.prepareRow.push(Fu);
            };
            Yo.pluginName = $u;
            var _f = function (d, m) {
                var v = m.instance,
                  S = m.row,
                  C = v.manualRowSelectedKey,
                  x = C === void 0 ? "isSelected" : C,
                  $ = !1;
                return (
                  S.original && S.original[x] ? ($ = !0) : ($ = S.isSelected),
                  [
                    d,
                    {
                      onChange: function (H) {
                        S.toggleRowSelected(H.target.checked);
                      },
                      style: { cursor: "pointer" },
                      checked: $,
                      title: "Toggle Row Selected",
                      indeterminate: S.isSomeSelected,
                    },
                  ]
                );
              },
              Xo = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    onChange: function (C) {
                      v.toggleAllRowsSelected(C.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: v.isAllRowsSelected,
                    title: "Toggle All Rows Selected",
                    indeterminate: Boolean(
                      !v.isAllRowsSelected &&
                        Object.keys(v.state.selectedRowIds).length
                    ),
                  },
                ];
              },
              Sf = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    onChange: function (C) {
                      v.toggleAllPageRowsSelected(C.target.checked);
                    },
                    style: { cursor: "pointer" },
                    checked: v.isAllPageRowsSelected,
                    title: "Toggle All Current Page Rows Selected",
                    indeterminate: Boolean(
                      !v.isAllPageRowsSelected &&
                        v.page.some(function (S) {
                          var C = S.id;
                          return v.state.selectedRowIds[C];
                        })
                    ),
                  },
                ];
              };
            function Rf(l, d, m, v) {
              if (d.type === h.init) return a({ selectedRowIds: {} }, l);
              if (d.type === h.resetSelectedRows)
                return a({}, l, {
                  selectedRowIds: v.initialState.selectedRowIds || {},
                });
              if (d.type === h.toggleAllRowsSelected) {
                var S = d.value,
                  C = v.isAllRowsSelected,
                  x = v.rowsById,
                  $ = v.nonGroupedRowsById,
                  z = $ === void 0 ? x : $,
                  H = typeof S < "u" ? S : !C,
                  q = Object.assign({}, l.selectedRowIds);
                return (
                  H
                    ? Object.keys(z).forEach(function (rt) {
                        q[rt] = !0;
                      })
                    : Object.keys(z).forEach(function (rt) {
                        delete q[rt];
                      }),
                  a({}, l, { selectedRowIds: q })
                );
              }
              if (d.type === h.toggleRowSelected) {
                var pe = d.id,
                  J = d.value,
                  ue = v.rowsById,
                  ge = v.selectSubRows,
                  Q = ge === void 0 ? !0 : ge,
                  Pe = v.getSubRows,
                  ze = l.selectedRowIds[pe],
                  Ve = typeof J < "u" ? J : !ze;
                if (ze === Ve) return l;
                var xe = a({}, l.selectedRowIds),
                  Je = function rt(Ye) {
                    var Ke = ue[Ye];
                    if (
                      Ke &&
                      (Ke.isGrouped || (Ve ? (xe[Ye] = !0) : delete xe[Ye]),
                      Q && Pe(Ke))
                    )
                      return Pe(Ke).forEach(function (Nt) {
                        return rt(Nt.id);
                      });
                  };
                return Je(pe), a({}, l, { selectedRowIds: xe });
              }
              if (d.type === h.toggleAllPageRowsSelected) {
                var ot = d.value,
                  Se = v.page,
                  be = v.rowsById,
                  Re = v.selectSubRows,
                  Be = Re === void 0 ? !0 : Re,
                  tt = v.isAllPageRowsSelected,
                  nt = v.getSubRows,
                  Tt = typeof ot < "u" ? ot : !tt,
                  Oe = a({}, l.selectedRowIds),
                  zt = function rt(Ye) {
                    var Ke = be[Ye];
                    if (
                      (Ke.isGrouped || (Tt ? (Oe[Ye] = !0) : delete Oe[Ye]),
                      Be && nt(Ke))
                    )
                      return nt(Ke).forEach(function (Nt) {
                        return rt(Nt.id);
                      });
                  };
                return (
                  Se.forEach(function (rt) {
                    return zt(rt.id);
                  }),
                  a({}, l, { selectedRowIds: Oe })
                );
              }
              return l;
            }
            function Cf(l) {
              var d = l.data,
                m = l.rows,
                v = l.getHooks,
                S = l.plugins,
                C = l.rowsById,
                x = l.nonGroupedRowsById,
                $ = x === void 0 ? C : x,
                z = l.autoResetSelectedRows,
                H = z === void 0 ? !0 : z,
                q = l.state.selectedRowIds,
                pe = l.selectSubRows,
                J = pe === void 0 ? !0 : pe,
                ue = l.dispatch,
                ge = l.page,
                Q = l.getSubRows;
              G(
                S,
                [
                  "useFilters",
                  "useGroupBy",
                  "useSortBy",
                  "useExpanded",
                  "usePagination",
                ],
                "useRowSelect"
              );
              var Pe = r.useMemo(
                  function () {
                    var tt = [];
                    return (
                      m.forEach(function (nt) {
                        var Tt = J ? Iu(nt, q, Q) : !!q[nt.id];
                        (nt.isSelected = !!Tt),
                          (nt.isSomeSelected = Tt === null),
                          Tt && tt.push(nt);
                      }),
                      tt
                    );
                  },
                  [m, J, q, Q]
                ),
                ze = Boolean(Object.keys($).length && Object.keys(q).length),
                Ve = ze;
              ze &&
                Object.keys($).some(function (tt) {
                  return !q[tt];
                }) &&
                (ze = !1),
                ze ||
                  (ge &&
                    ge.length &&
                    ge.some(function (tt) {
                      var nt = tt.id;
                      return !q[nt];
                    }) &&
                    (Ve = !1));
              var xe = D(H);
              Z(
                function () {
                  xe() && ue({ type: h.resetSelectedRows });
                },
                [ue, d]
              );
              var Je = r.useCallback(
                  function (tt) {
                    return ue({ type: h.toggleAllRowsSelected, value: tt });
                  },
                  [ue]
                ),
                ot = r.useCallback(
                  function (tt) {
                    return ue({ type: h.toggleAllPageRowsSelected, value: tt });
                  },
                  [ue]
                ),
                Se = r.useCallback(
                  function (tt, nt) {
                    return ue({ type: h.toggleRowSelected, id: tt, value: nt });
                  },
                  [ue]
                ),
                be = D(l),
                Re = k(v().getToggleAllRowsSelectedProps, { instance: be() }),
                Be = k(v().getToggleAllPageRowsSelectedProps, {
                  instance: be(),
                });
              Object.assign(l, {
                selectedFlatRows: Pe,
                isAllRowsSelected: ze,
                isAllPageRowsSelected: Ve,
                toggleRowSelected: Se,
                toggleAllRowsSelected: Je,
                getToggleAllRowsSelectedProps: Re,
                getToggleAllPageRowsSelectedProps: Be,
                toggleAllPageRowsSelected: ot,
              });
            }
            function Fu(l, d) {
              var m = d.instance;
              (l.toggleRowSelected = function (v) {
                return m.toggleRowSelected(l.id, v);
              }),
                (l.getToggleRowSelectedProps = k(
                  m.getHooks().getToggleRowSelectedProps,
                  { instance: m, row: l }
                ));
            }
            function Iu(l, d, m) {
              if (d[l.id]) return !0;
              var v = m(l);
              if (v && v.length) {
                var S = !0,
                  C = !1;
                return (
                  v.forEach(function (x) {
                    (C && !S) || (Iu(x, d, m) ? (C = !0) : (S = !1));
                  }),
                  S ? !0 : C ? null : !1
                );
              }
              return !1;
            }
            var Bu = function (d) {
                return {};
              },
              Du = function (d) {
                return {};
              };
            (h.setRowState = "setRowState"),
              (h.setCellState = "setCellState"),
              (h.resetRowState = "resetRowState");
            var zu = function (d) {
              d.stateReducers.push(Ko),
                d.useInstance.push(s),
                d.prepareRow.push(g);
            };
            zu.pluginName = "useRowState";
            function Ko(l, d, m, v) {
              var S = v.initialRowStateAccessor,
                C = S === void 0 ? Bu : S,
                x = v.initialCellStateAccessor,
                $ = x === void 0 ? Du : x,
                z = v.rowsById;
              if (d.type === h.init) return a({ rowState: {} }, l);
              if (d.type === h.resetRowState)
                return a({}, l, { rowState: v.initialState.rowState || {} });
              if (d.type === h.setRowState) {
                var H,
                  q = d.rowId,
                  pe = d.value,
                  J = typeof l.rowState[q] < "u" ? l.rowState[q] : C(z[q]);
                return a({}, l, {
                  rowState: a({}, l.rowState, ((H = {}), (H[q] = M(pe, J)), H)),
                });
              }
              if (d.type === h.setCellState) {
                var ue,
                  ge,
                  Q,
                  Pe,
                  ze,
                  Ve = d.rowId,
                  xe = d.columnId,
                  Je = d.value,
                  ot = typeof l.rowState[Ve] < "u" ? l.rowState[Ve] : C(z[Ve]),
                  Se =
                    typeof (ot == null || (ue = ot.cellState) == null
                      ? void 0
                      : ue[xe]) < "u"
                      ? ot.cellState[xe]
                      : $(
                          (ge = z[Ve]) == null || (Q = ge.cells) == null
                            ? void 0
                            : Q.find(function (be) {
                                return be.column.id === xe;
                              })
                        );
                return a({}, l, {
                  rowState: a(
                    {},
                    l.rowState,
                    ((ze = {}),
                    (ze[Ve] = a({}, ot, {
                      cellState: a(
                        {},
                        ot.cellState || {},
                        ((Pe = {}), (Pe[xe] = M(Je, Se)), Pe)
                      ),
                    })),
                    ze)
                  ),
                });
              }
            }
            function s(l) {
              var d = l.autoResetRowState,
                m = d === void 0 ? !0 : d,
                v = l.data,
                S = l.dispatch,
                C = r.useCallback(
                  function (z, H) {
                    return S({ type: h.setRowState, rowId: z, value: H });
                  },
                  [S]
                ),
                x = r.useCallback(
                  function (z, H, q) {
                    return S({
                      type: h.setCellState,
                      rowId: z,
                      columnId: H,
                      value: q,
                    });
                  },
                  [S]
                ),
                $ = D(m);
              Z(
                function () {
                  $() && S({ type: h.resetRowState });
                },
                [v]
              ),
                Object.assign(l, { setRowState: C, setCellState: x });
            }
            function g(l, d) {
              var m = d.instance,
                v = m.initialRowStateAccessor,
                S = v === void 0 ? Bu : v,
                C = m.initialCellStateAccessor,
                x = C === void 0 ? Du : C,
                $ = m.state.rowState;
              l &&
                ((l.state = typeof $[l.id] < "u" ? $[l.id] : S(l)),
                (l.setState = function (z) {
                  return m.setRowState(l.id, z);
                }),
                l.cells.forEach(function (z) {
                  l.state.cellState || (l.state.cellState = {}),
                    (z.state =
                      typeof l.state.cellState[z.column.id] < "u"
                        ? l.state.cellState[z.column.id]
                        : x(z)),
                    (z.setState = function (H) {
                      return m.setCellState(l.id, z.column.id, H);
                    });
                }));
            }
            (h.resetColumnOrder = "resetColumnOrder"),
              (h.setColumnOrder = "setColumnOrder");
            var y = function (d) {
              d.stateReducers.push(b),
                d.visibleColumnsDeps.push(function (m, v) {
                  var S = v.instance;
                  return [].concat(m, [S.state.columnOrder]);
                }),
                d.visibleColumns.push(E),
                d.useInstance.push(R);
            };
            y.pluginName = "useColumnOrder";
            function b(l, d, m, v) {
              if (d.type === h.init) return a({ columnOrder: [] }, l);
              if (d.type === h.resetColumnOrder)
                return a({}, l, {
                  columnOrder: v.initialState.columnOrder || [],
                });
              if (d.type === h.setColumnOrder)
                return a({}, l, {
                  columnOrder: M(d.columnOrder, l.columnOrder),
                });
            }
            function E(l, d) {
              var m = d.instance.state.columnOrder;
              if (!m || !m.length) return l;
              for (
                var v = [].concat(m),
                  S = [].concat(l),
                  C = [],
                  x = function () {
                    var z = v.shift(),
                      H = S.findIndex(function (q) {
                        return q.id === z;
                      });
                    H > -1 && C.push(S.splice(H, 1)[0]);
                  };
                S.length && v.length;

              )
                x();
              return [].concat(C, S);
            }
            function R(l) {
              var d = l.dispatch;
              l.setColumnOrder = r.useCallback(
                function (m) {
                  return d({ type: h.setColumnOrder, columnOrder: m });
                },
                [d]
              );
            }
            (_.canResize = !0),
              (h.columnStartResizing = "columnStartResizing"),
              (h.columnResizing = "columnResizing"),
              (h.columnDoneResizing = "columnDoneResizing"),
              (h.resetResize = "resetResize");
            var A = function (d) {
                (d.getResizerProps = [j]),
                  d.getHeaderProps.push({ style: { position: "relative" } }),
                  d.stateReducers.push(W),
                  d.useInstance.push(le),
                  d.useInstanceBeforeDimensions.push(V);
              },
              j = function (d, m) {
                var v = m.instance,
                  S = m.header,
                  C = v.dispatch,
                  x = function (z, H) {
                    var q = !1;
                    if (z.type === "touchstart") {
                      if (z.touches && z.touches.length > 1) return;
                      q = !0;
                    }
                    var pe = oe(H),
                      J = pe.map(function (Se) {
                        return [Se.id, Se.totalWidth];
                      }),
                      ue = q ? Math.round(z.touches[0].clientX) : z.clientX,
                      ge,
                      Q,
                      Pe = function () {
                        window.cancelAnimationFrame(ge),
                          (ge = null),
                          C({ type: h.columnDoneResizing });
                      },
                      ze = function () {
                        window.cancelAnimationFrame(ge),
                          (ge = null),
                          C({ type: h.columnResizing, clientX: Q });
                      },
                      Ve = function (be) {
                        (Q = be), ge || (ge = window.requestAnimationFrame(ze));
                      },
                      xe = {
                        mouse: {
                          moveEvent: "mousemove",
                          moveHandler: function (be) {
                            return Ve(be.clientX);
                          },
                          upEvent: "mouseup",
                          upHandler: function (be) {
                            document.removeEventListener(
                              "mousemove",
                              xe.mouse.moveHandler
                            ),
                              document.removeEventListener(
                                "mouseup",
                                xe.mouse.upHandler
                              ),
                              Pe();
                          },
                        },
                        touch: {
                          moveEvent: "touchmove",
                          moveHandler: function (be) {
                            return (
                              be.cancelable &&
                                (be.preventDefault(), be.stopPropagation()),
                              Ve(be.touches[0].clientX),
                              !1
                            );
                          },
                          upEvent: "touchend",
                          upHandler: function (be) {
                            document.removeEventListener(
                              xe.touch.moveEvent,
                              xe.touch.moveHandler
                            ),
                              document.removeEventListener(
                                xe.touch.upEvent,
                                xe.touch.moveHandler
                              ),
                              Pe();
                          },
                        },
                      },
                      Je = q ? xe.touch : xe.mouse,
                      ot = fe() ? { passive: !1 } : !1;
                    document.addEventListener(Je.moveEvent, Je.moveHandler, ot),
                      document.addEventListener(Je.upEvent, Je.upHandler, ot),
                      C({
                        type: h.columnStartResizing,
                        columnId: H.id,
                        columnWidth: H.totalWidth,
                        headerIdWidths: J,
                        clientX: ue,
                      });
                  };
                return [
                  d,
                  {
                    onMouseDown: function (z) {
                      return z.persist() || x(z, S);
                    },
                    onTouchStart: function (z) {
                      return z.persist() || x(z, S);
                    },
                    style: { cursor: "col-resize" },
                    draggable: !1,
                    role: "separator",
                  },
                ];
              };
            A.pluginName = "useResizeColumns";
            function W(l, d) {
              if (d.type === h.init)
                return a({ columnResizing: { columnWidths: {} } }, l);
              if (d.type === h.resetResize)
                return a({}, l, { columnResizing: { columnWidths: {} } });
              if (d.type === h.columnStartResizing) {
                var m = d.clientX,
                  v = d.columnId,
                  S = d.columnWidth,
                  C = d.headerIdWidths;
                return a({}, l, {
                  columnResizing: a({}, l.columnResizing, {
                    startX: m,
                    headerIdWidths: C,
                    columnWidth: S,
                    isResizingColumn: v,
                  }),
                });
              }
              if (d.type === h.columnResizing) {
                var x = d.clientX,
                  $ = l.columnResizing,
                  z = $.startX,
                  H = $.columnWidth,
                  q = $.headerIdWidths,
                  pe = q === void 0 ? [] : q,
                  J = x - z,
                  ue = J / H,
                  ge = {};
                return (
                  pe.forEach(function (Q) {
                    var Pe = Q[0],
                      ze = Q[1];
                    ge[Pe] = Math.max(ze + ze * ue, 0);
                  }),
                  a({}, l, {
                    columnResizing: a({}, l.columnResizing, {
                      columnWidths: a(
                        {},
                        l.columnResizing.columnWidths,
                        {},
                        ge
                      ),
                    }),
                  })
                );
              }
              if (d.type === h.columnDoneResizing)
                return a({}, l, {
                  columnResizing: a({}, l.columnResizing, {
                    startX: null,
                    isResizingColumn: null,
                  }),
                });
            }
            var V = function (d) {
              var m = d.flatHeaders,
                v = d.disableResizing,
                S = d.getHooks,
                C = d.state.columnResizing,
                x = D(d);
              m.forEach(function ($) {
                var z = Ne(
                  $.disableResizing === !0 ? !1 : void 0,
                  v === !0 ? !1 : void 0,
                  !0
                );
                ($.canResize = z),
                  ($.width =
                    C.columnWidths[$.id] || $.originalWidth || $.width),
                  ($.isResizing = C.isResizingColumn === $.id),
                  z &&
                    ($.getResizerProps = k(S().getResizerProps, {
                      instance: x(),
                      header: $,
                    }));
              });
            };
            function le(l) {
              var d = l.plugins,
                m = l.dispatch,
                v = l.autoResetResize,
                S = v === void 0 ? !0 : v,
                C = l.columns;
              G(d, ["useAbsoluteLayout"], "useResizeColumns");
              var x = D(S);
              Z(
                function () {
                  x() && m({ type: h.resetResize });
                },
                [C]
              );
              var $ = r.useCallback(
                function () {
                  return m({ type: h.resetResize });
                },
                [m]
              );
              Object.assign(l, { resetResizing: $ });
            }
            function oe(l) {
              var d = [],
                m = function v(S) {
                  S.columns && S.columns.length && S.columns.map(v), d.push(S);
                };
              return m(l), d;
            }
            var ae = { position: "absolute", top: 0 },
              X = function (d) {
                d.getTableBodyProps.push(re),
                  d.getRowProps.push(re),
                  d.getHeaderGroupProps.push(re),
                  d.getFooterGroupProps.push(re),
                  d.getHeaderProps.push(function (m, v) {
                    var S = v.column;
                    return [
                      m,
                      {
                        style: a({}, ae, {
                          left: S.totalLeft + "px",
                          width: S.totalWidth + "px",
                        }),
                      },
                    ];
                  }),
                  d.getCellProps.push(function (m, v) {
                    var S = v.cell;
                    return [
                      m,
                      {
                        style: a({}, ae, {
                          left: S.column.totalLeft + "px",
                          width: S.column.totalWidth + "px",
                        }),
                      },
                    ];
                  }),
                  d.getFooterProps.push(function (m, v) {
                    var S = v.column;
                    return [
                      m,
                      {
                        style: a({}, ae, {
                          left: S.totalLeft + "px",
                          width: S.totalWidth + "px",
                        }),
                      },
                    ];
                  });
              };
            X.pluginName = "useAbsoluteLayout";
            var re = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    style: {
                      position: "relative",
                      width: v.totalColumnsWidth + "px",
                    },
                  },
                ];
              },
              ye = { display: "inline-block", boxSizing: "border-box" },
              _e = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    style: {
                      display: "flex",
                      width: v.totalColumnsWidth + "px",
                    },
                  },
                ];
              },
              Fe = function (d) {
                d.getRowProps.push(_e),
                  d.getHeaderGroupProps.push(_e),
                  d.getFooterGroupProps.push(_e),
                  d.getHeaderProps.push(function (m, v) {
                    var S = v.column;
                    return [
                      m,
                      { style: a({}, ye, { width: S.totalWidth + "px" }) },
                    ];
                  }),
                  d.getCellProps.push(function (m, v) {
                    var S = v.cell;
                    return [
                      m,
                      {
                        style: a({}, ye, { width: S.column.totalWidth + "px" }),
                      },
                    ];
                  }),
                  d.getFooterProps.push(function (m, v) {
                    var S = v.column;
                    return [
                      m,
                      { style: a({}, ye, { width: S.totalWidth + "px" }) },
                    ];
                  });
              };
            Fe.pluginName = "useBlockLayout";
            function et(l) {
              l.getTableProps.push(Ie),
                l.getRowProps.push(ce),
                l.getHeaderGroupProps.push(ce),
                l.getFooterGroupProps.push(ce),
                l.getHeaderProps.push(Ze),
                l.getCellProps.push(Me),
                l.getFooterProps.push(Xe);
            }
            et.pluginName = "useFlexLayout";
            var Ie = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  { style: { minWidth: v.totalColumnsMinWidth + "px" } },
                ];
              },
              ce = function (d, m) {
                var v = m.instance;
                return [
                  d,
                  {
                    style: {
                      display: "flex",
                      flex: "1 0 auto",
                      minWidth: v.totalColumnsMinWidth + "px",
                    },
                  },
                ];
              },
              Ze = function (d, m) {
                var v = m.column;
                return [
                  d,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: v.totalFlexWidth
                        ? v.totalFlexWidth + " 0 auto"
                        : void 0,
                      minWidth: v.totalMinWidth + "px",
                      width: v.totalWidth + "px",
                    },
                  },
                ];
              },
              Me = function (d, m) {
                var v = m.cell;
                return [
                  d,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: v.column.totalFlexWidth + " 0 auto",
                      minWidth: v.column.totalMinWidth + "px",
                      width: v.column.totalWidth + "px",
                    },
                  },
                ];
              },
              Xe = function (d, m) {
                var v = m.column;
                return [
                  d,
                  {
                    style: {
                      boxSizing: "border-box",
                      flex: v.totalFlexWidth
                        ? v.totalFlexWidth + " 0 auto"
                        : void 0,
                      minWidth: v.totalMinWidth + "px",
                      width: v.totalWidth + "px",
                    },
                  },
                ];
              };
            (h.columnStartResizing = "columnStartResizing"),
              (h.columnResizing = "columnResizing"),
              (h.columnDoneResizing = "columnDoneResizing"),
              (h.resetResize = "resetResize");
            function dt(l) {
              l.stateReducers.push(Qe),
                l.getTableProps.push(He),
                l.getHeaderProps.push(qe),
                l.getRowProps.push(xt);
            }
            dt.pluginName = "useGridLayout";
            var He = function (d, m) {
                var v = m.instance,
                  S = v.visibleColumns.map(function (C) {
                    var x;
                    return v.state.gridLayout.columnWidths[C.id]
                      ? v.state.gridLayout.columnWidths[C.id] + "px"
                      : (x = v.state.columnResizing) != null &&
                        x.isResizingColumn
                      ? v.state.gridLayout.startWidths[C.id] + "px"
                      : typeof C.width == "number"
                      ? C.width + "px"
                      : C.width;
                  });
                return [
                  d,
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: S.join(" "),
                    },
                  },
                ];
              },
              qe = function (d, m) {
                var v = m.column;
                return [
                  d,
                  {
                    id: "header-cell-" + v.id,
                    style: {
                      position: "sticky",
                      gridColumn: "span " + v.totalVisibleHeaderCount,
                    },
                  },
                ];
              },
              xt = function (d, m) {
                var v = m.row;
                return v.isExpanded
                  ? [
                      d,
                      { style: { gridColumn: "1 / " + (v.cells.length + 1) } },
                    ]
                  : [d, {}];
              };
            function Qe(l, d, m, v) {
              if (d.type === h.init)
                return a({ gridLayout: { columnWidths: {} } }, l);
              if (d.type === h.resetResize)
                return a({}, l, { gridLayout: { columnWidths: {} } });
              if (d.type === h.columnStartResizing) {
                var S = d.columnId,
                  C = d.headerIdWidths,
                  x = gt(S);
                if (x !== void 0) {
                  var $ = v.visibleColumns.reduce(function (Se, be) {
                      var Re;
                      return a(
                        {},
                        Se,
                        ((Re = {}), (Re[be.id] = gt(be.id)), Re)
                      );
                    }, {}),
                    z = v.visibleColumns.reduce(function (Se, be) {
                      var Re;
                      return a(
                        {},
                        Se,
                        ((Re = {}), (Re[be.id] = be.minWidth), Re)
                      );
                    }, {}),
                    H = v.visibleColumns.reduce(function (Se, be) {
                      var Re;
                      return a(
                        {},
                        Se,
                        ((Re = {}), (Re[be.id] = be.maxWidth), Re)
                      );
                    }, {}),
                    q = C.map(function (Se) {
                      var be = Se[0];
                      return [be, gt(be)];
                    });
                  return a({}, l, {
                    gridLayout: a({}, l.gridLayout, {
                      startWidths: $,
                      minWidths: z,
                      maxWidths: H,
                      headerIdGridWidths: q,
                      columnWidth: x,
                    }),
                  });
                } else return l;
              }
              if (d.type === h.columnResizing) {
                var pe = d.clientX,
                  J = l.columnResizing.startX,
                  ue = l.gridLayout,
                  ge = ue.columnWidth,
                  Q = ue.minWidths,
                  Pe = ue.maxWidths,
                  ze = ue.headerIdGridWidths,
                  Ve = ze === void 0 ? [] : ze,
                  xe = pe - J,
                  Je = xe / ge,
                  ot = {};
                return (
                  Ve.forEach(function (Se) {
                    var be = Se[0],
                      Re = Se[1];
                    ot[be] = Math.min(Math.max(Q[be], Re + Re * Je), Pe[be]);
                  }),
                  a({}, l, {
                    gridLayout: a({}, l.gridLayout, {
                      columnWidths: a({}, l.gridLayout.columnWidths, {}, ot),
                    }),
                  })
                );
              }
              if (d.type === h.columnDoneResizing)
                return a({}, l, {
                  gridLayout: a({}, l.gridLayout, {
                    startWidths: {},
                    minWidths: {},
                    maxWidths: {},
                  }),
                });
            }
            function gt(l) {
              var d,
                m =
                  (d = document.getElementById("header-cell-" + l)) == null
                    ? void 0
                    : d.offsetWidth;
              if (m !== void 0) return m;
            }
            (n._UNSTABLE_usePivotColumns = Mu),
              (n.actions = h),
              (n.defaultColumn = _),
              (n.defaultGroupByFn = xu),
              (n.defaultOrderByFn = Wo),
              (n.defaultRenderer = w),
              (n.emptyRenderer = T),
              (n.ensurePluginOrder = G),
              (n.flexRender = ie),
              (n.functionalUpdate = M),
              (n.loopHooks = N),
              (n.makePropGetter = k),
              (n.makeRenderer = me),
              (n.reduceHooks = F),
              (n.safeUseLayoutEffect = ne),
              (n.useAbsoluteLayout = X),
              (n.useAsyncDebounce = he),
              (n.useBlockLayout = Fe),
              (n.useColumnOrder = y),
              (n.useExpanded = Fn),
              (n.useFilters = Ot),
              (n.useFlexLayout = et),
              (n.useGetLatest = D),
              (n.useGlobalFilter = ii),
              (n.useGridLayout = dt),
              (n.useGroupBy = jo),
              (n.useMountedLayoutEffect = Z),
              (n.usePagination = Nu),
              (n.useResizeColumns = A),
              (n.useRowSelect = Yo),
              (n.useRowState = zu),
              (n.useSortBy = Cu),
              (n.useTable = kn),
              Object.defineProperty(n, "__esModule", { value: !0 });
          });
        })(lu, lu.exports)),
      lu.exports
    );
  }
  (function (e) {
    process.env.NODE_ENV === "production"
      ? (e.exports = pT())
      : (e.exports = vT());
  })(Bo);
  const Bi = {
      tableFilterContainer: "_tableFilterContainer_113tz_1",
      pagination: "_pagination_113tz_33",
      icon: "_icon_113tz_50",
      alignRight: "_alignRight_113tz_124",
    },
    Wc = (e) =>
      Pn.createElement(
        "svg",
        {
          width: 12,
          height: 12,
          viewBox: "0 0 12 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          ...e,
        },
        Pn.createElement("path", {
          d: "M11.5 6H0.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        Pn.createElement("path", {
          d: "M7.5 10L11.5 6L7.5 2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })
      );
  var $t =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Table/DataTable.tsx";
  const gT = ({
      filterValue: e,
      setFilter: t,
      preFilteredRows: n,
      id: r,
      filterData: i,
    }) => {
      Y.useMemo(() => {
        const a = new Set();
        return (
          n.forEach(function (u) {
            a.add(u.values[r]);
          }),
          [...a.values()]
        );
      }, [r, n]);
      const o = i.map((a) =>
        L(
          "li",
          {
            value: e,
            onClick: () => {
              (a = a === "ALL" ? void 0 : a), t(a || void 0);
            },
            children: a,
          },
          void 0,
          !1,
          { fileName: $t, lineNumber: 28, columnNumber: 7 },
          void 0
        )
      );
      return L(
        "ul",
        { children: o },
        void 0,
        !1,
        { fileName: $t, lineNumber: 42, columnNumber: 5 },
        void 0
      );
    },
    mT = ({
      name: e,
      filterData: t = [],
      columns: n,
      data: r,
      displayedRowSize: i,
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
        pageCount: T,
        nextPage: _,
        previousPage: P,
        state: { pageIndex: I },
        preGlobalFilteredRows: k,
        setGlobalFilter: F,
      } = Bo.exports.useTable(
        { columns: n, data: r },
        Bo.exports.useFilters,
        Bo.exports.useGlobalFilter,
        Bo.exports.usePagination
      );
      return L(
        Nn,
        {
          children: [
            L(
              "div",
              {
                className: Bi.tableFilterContainer,
                children: [
                  L(
                    "h3",
                    {
                      children: [
                        "  ",
                        1,
                        "-",
                        T,
                        " of ",
                        r.length,
                        " ",
                        e,
                        " ",
                      ],
                    },
                    void 0,
                    !0,
                    { fileName: $t, lineNumber: 75, columnNumber: 11 },
                    void 0
                  ),
                  L(
                    "ul",
                    {
                      children: L(
                        gT,
                        {
                          filterValue: void 0,
                          setFilter: F,
                          preFilteredRows: k,
                          id: "type",
                          filterData: t,
                        },
                        void 0,
                        !1,
                        { fileName: $t, lineNumber: 77, columnNumber: 13 },
                        void 0
                      ),
                    },
                    void 0,
                    !1,
                    { fileName: $t, lineNumber: 76, columnNumber: 11 },
                    void 0
                  ),
                ],
              },
              void 0,
              !0,
              { fileName: $t, lineNumber: 74, columnNumber: 9 },
              void 0
            ),
            L(
              "div",
              {
                children: L(
                  "table",
                  {
                    ...o(),
                    children: [
                      L(
                        "thead",
                        {
                          children: u.map((N) =>
                            L(
                              "tr",
                              {
                                ...N.getHeaderGroupProps(),
                                children: N.headers.map((G, M) =>
                                  L(
                                    "th",
                                    {
                                      className:
                                        i - 1 === M ? Bi.alignRight : "",
                                      ...G.getHeaderProps(),
                                      children: G.render("Header"),
                                    },
                                    void 0,
                                    !1,
                                    {
                                      fileName: $t,
                                      lineNumber: 92,
                                      columnNumber: 19,
                                    },
                                    void 0
                                  )
                                ),
                              },
                              void 0,
                              !1,
                              {
                                fileName: $t,
                                lineNumber: 90,
                                columnNumber: 15,
                              },
                              void 0
                            )
                          ),
                        },
                        void 0,
                        !1,
                        { fileName: $t, lineNumber: 88, columnNumber: 11 },
                        void 0
                      ),
                      L(
                        "tbody",
                        {
                          ...a(),
                          children: c.map(
                            (N, G) => (
                              f(N),
                              L(
                                "tr",
                                {
                                  ...N.getRowProps(),
                                  children: N.cells.map((M, D) =>
                                    L(
                                      "td",
                                      {
                                        className:
                                          i - 1 === D ? Bi.alignRight : "",
                                        ...M.getCellProps(),
                                        children: M.render("Cell"),
                                      },
                                      void 0,
                                      !1,
                                      {
                                        fileName: $t,
                                        lineNumber: 103,
                                        columnNumber: 28,
                                      },
                                      void 0
                                    )
                                  ),
                                },
                                void 0,
                                !1,
                                {
                                  fileName: $t,
                                  lineNumber: 101,
                                  columnNumber: 17,
                                },
                                void 0
                              )
                            )
                          ),
                        },
                        void 0,
                        !1,
                        { fileName: $t, lineNumber: 97, columnNumber: 11 },
                        void 0
                      ),
                    ],
                  },
                  void 0,
                  !0,
                  { fileName: $t, lineNumber: 87, columnNumber: 9 },
                  void 0
                ),
              },
              void 0,
              !1,
              { fileName: $t, lineNumber: 86, columnNumber: 9 },
              void 0
            ),
            L(
              "div",
              {
                className: Bi.pagination,
                children: [
                  L(
                    "span",
                    {
                      children: [
                        "Page",
                        " ",
                        L(
                          "strong",
                          { children: [I + 1, " of ", w.length] },
                          void 0,
                          !0,
                          { fileName: $t, lineNumber: 114, columnNumber: 13 },
                          void 0
                        ),
                        " ",
                      ],
                    },
                    void 0,
                    !0,
                    { fileName: $t, lineNumber: 112, columnNumber: 9 },
                    void 0
                  ),
                  L(
                    "span",
                    {
                      children: [
                        L(
                          "button",
                          {
                            onClick: () => P(),
                            disabled: !p,
                            children: L(
                              Wc,
                              { className: `${Bi.icon}` },
                              void 0,
                              !1,
                              {
                                fileName: $t,
                                lineNumber: 120,
                                columnNumber: 11,
                              },
                              void 0
                            ),
                          },
                          void 0,
                          !1,
                          { fileName: $t, lineNumber: 119, columnNumber: 11 },
                          void 0
                        ),
                        L(
                          "button",
                          {
                            onClick: () => _(),
                            disabled: !h,
                            children: L(
                              Wc,
                              { className: `${Bi.icon}` },
                              void 0,
                              !1,
                              {
                                fileName: $t,
                                lineNumber: 123,
                                columnNumber: 13,
                              },
                              void 0
                            ),
                          },
                          void 0,
                          !1,
                          { fileName: $t, lineNumber: 122, columnNumber: 11 },
                          void 0
                        ),
                      ],
                    },
                    void 0,
                    !0,
                    { fileName: $t, lineNumber: 118, columnNumber: 9 },
                    void 0
                  ),
                ],
              },
              void 0,
              !0,
              { fileName: $t, lineNumber: 111, columnNumber: 7 },
              void 0
            ),
          ],
        },
        void 0,
        !0
      );
    },
    uP = "";
  var yT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Display/Display.tsx";
  const bT = ({ children: e, ...t }) => {
      const r = Object.entries({
          extraSmall: "xs",
          small: "sm",
          medium: "md",
          large: "lg",
        }).reduce((a, [u, f]) => (t[u] ? f : a), "lg"),
        i = t.className || "",
        o = `${r} ${i}`;
      return L(
        "h1",
        { ...t, className: o, children: e },
        void 0,
        !1,
        { fileName: yT, lineNumber: 35, columnNumber: 12 },
        void 0
      );
    },
    lP = { uppercase: "_uppercase_abhlo_32" };
  var wT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Heading/Heading.tsx";
  const xT = ({ children: e, as: t, ...n }) =>
      L(
        t || "h1",
        { ...n, children: e },
        void 0,
        !1,
        { fileName: wT, lineNumber: 14, columnNumber: 12 },
        void 0
      ),
    cu = {
      xxl: "_xxl_14tej_8",
      xl: "_xl_14tej_12",
      lg: "_lg_14tej_16",
      md: "_md_14tej_20",
      sm: "_sm_14tej_24",
      xs: "_xs_14tej_28",
      underline: "_underline_14tej_32",
      bold: "_bold_14tej_36",
      default: "_default_14tej_40",
      black: "_black_14tej_44",
      white: "_white_14tej_48",
      disabled: "_disabled_14tej_52",
    };
  var _T =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Text/Text.tsx";
  const ST = ({
      children: e,
      className: t,
      as: n,
      colour: r,
      bold: i,
      underline: o,
      ...a
    }) => {
      const u = { className: t },
        f = cu[r || "default"],
        c = i ? cu.bold : "",
        p = o ? cu.underline : "";
      return L(
        "p",
        { className: `${cu[n]} ${f} ${c} ${p} ${u}`, ...a, children: e },
        void 0,
        !1,
        { fileName: _T, lineNumber: 23, columnNumber: 7 },
        void 0
      );
    },
    Er = {
      outerContainer: "_outerContainer_l7wyv_1",
      container: "_container_l7wyv_12",
      navbar: "_navbar_l7wyv_25",
      fade: "_fade_l7wyv_35",
      active: "_active_l7wyv_48",
      navbarFixed: "_navbarFixed_l7wyv_60",
      fixed: "_fixed_l7wyv_70",
      fluidity: "_fluidity_l7wyv_78",
    };
  var Wt =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/NavBar/NavBar.tsx";
  const RT = ({ logo: e, text: t, button: n, navLinks: r }) => {
      const [i, o] = Y.useState(!1),
        a = () => {
          o(!i);
        },
        u = r.map((f) =>
          L(
            "li",
            {
              children: [
                L(
                  "a",
                  {
                    href: `/${f.name.replace(/\s+/g, "")}`,
                    className:
                      window.location.pathname.toString() ===
                      `/${f.name.replace(/\s+/g, "")}`
                        ? Er.active
                        : "",
                    children: f.name.toUpperCase(),
                  },
                  void 0,
                  !1,
                  { fileName: Wt, lineNumber: 44, columnNumber: 7 },
                  void 0
                ),
                f.modal &&
                  L(
                    "button",
                    {
                      onClick: () => {},
                      children: L(
                        "img",
                        {
                          src: "./src/assets/images/triangleDown.svg",
                          alt: "open resource options",
                        },
                        void 0,
                        !1,
                        { fileName: Wt, lineNumber: 57, columnNumber: 11 },
                        void 0
                      ),
                    },
                    void 0,
                    !1,
                    { fileName: Wt, lineNumber: 56, columnNumber: 9 },
                    void 0
                  ),
              ],
            },
            void 0,
            !0,
            { fileName: Wt, lineNumber: 43, columnNumber: 5 },
            void 0
          )
        );
      return L(
        "div",
        {
          className: Er.outerContainer,
          children: L(
            "div",
            {
              className: `${Er.container} opacity-5x`,
              children: [
                L(
                  "h2",
                  { className: Er.fluidity, children: t },
                  void 0,
                  !1,
                  { fileName: Wt, lineNumber: 70, columnNumber: 9 },
                  void 0
                ),
                L(
                  "div",
                  {
                    className: Er.navbarFixed,
                    children: L(
                      "div",
                      {
                        className: Er.fixed,
                        children: [
                          L(
                            "div",
                            {
                              children: L(
                                "a",
                                {
                                  href: "/",
                                  children: L(
                                    "img",
                                    { src: e, alt: "home page" },
                                    void 0,
                                    !1,
                                    {
                                      fileName: Wt,
                                      lineNumber: 76,
                                      columnNumber: 17,
                                    },
                                    void 0
                                  ),
                                },
                                void 0,
                                !1,
                                {
                                  fileName: Wt,
                                  lineNumber: 74,
                                  columnNumber: 15,
                                },
                                void 0
                              ),
                            },
                            void 0,
                            !1,
                            { fileName: Wt, lineNumber: 73, columnNumber: 13 },
                            void 0
                          ),
                          L(
                            ym,
                            {
                              version: n.version,
                              type: n.type,
                              size: n.size,
                              handleClick: n.handleClick,
                              children: n.children,
                            },
                            void 0,
                            !1,
                            { fileName: Wt, lineNumber: 80, columnNumber: 13 },
                            void 0
                          ),
                        ],
                      },
                      void 0,
                      !0,
                      { fileName: Wt, lineNumber: 72, columnNumber: 11 },
                      void 0
                    ),
                  },
                  void 0,
                  !1,
                  { fileName: Wt, lineNumber: 71, columnNumber: 9 },
                  void 0
                ),
                L(
                  "div",
                  {
                    className: Er.navbar,
                    children: L(
                      "div",
                      {
                        className: Er.fade,
                        children: [
                          L(
                            "nav",
                            {
                              children: L(
                                "ul",
                                { children: u },
                                void 0,
                                !1,
                                {
                                  fileName: Wt,
                                  lineNumber: 93,
                                  columnNumber: 15,
                                },
                                void 0
                              ),
                            },
                            void 0,
                            !1,
                            { fileName: Wt, lineNumber: 92, columnNumber: 13 },
                            void 0
                          ),
                          i &&
                            L(
                              xm,
                              { handleModal: a, navLinks: CT },
                              void 0,
                              !1,
                              {
                                fileName: Wt,
                                lineNumber: 96,
                                columnNumber: 15,
                              },
                              void 0
                            ),
                        ],
                      },
                      void 0,
                      !0,
                      { fileName: Wt, lineNumber: 91, columnNumber: 11 },
                      void 0
                    ),
                  },
                  void 0,
                  !1,
                  { fileName: Wt, lineNumber: 90, columnNumber: 9 },
                  void 0
                ),
              ],
            },
            void 0,
            !0,
            { fileName: Wt, lineNumber: 68, columnNumber: 7 },
            void 0
          ),
        },
        void 0,
        !1,
        { fileName: Wt, lineNumber: 67, columnNumber: 5 },
        void 0
      );
    },
    CT = [
      {
        children: "articles",
        size: "small",
        type: "internal",
        handleClick: () => {},
      },
      {
        children: "fluniversity",
        size: "small",
        type: "internal",
        handleClick: () => {},
      },
      {
        children: "whitpapers",
        size: "small",
        type: "internal",
        handleClick: () => {},
      },
      {
        children: "documentation",
        size: "small",
        type: "external",
        handleClick: () => {},
      },
    ],
    TT = (e) =>
      Pn.createElement(
        "svg",
        {
          width: 12,
          height: 12,
          viewBox: "0 0 12 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          ...e,
        },
        Pn.createElement("path", {
          d: "M6 11.5L6 0.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        Pn.createElement("path", {
          d: "M10 7.5L6 11.5L2 7.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })
      ),
    Vc = {
      button: "_button_frgyj_1",
      icon: "_icon_frgyj_17",
      text: "_text_frgyj_21",
    };
  var Uc =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/AnchorButton/AnchorButton.tsx";
  const pm = ({ children: e, disabled: t, className: n, ...r }) => {
      const i = n || "";
      return L(
        "button",
        {
          className: `${Vc.button} ${i}`,
          disabled: t,
          ...r,
          children: [
            L(
              TT,
              { className: Vc.icon },
              void 0,
              !1,
              { fileName: Uc, lineNumber: 17, columnNumber: 7 },
              void 0
            ),
            " ",
            L(
              "div",
              { className: Vc.text, children: e },
              void 0,
              !1,
              { fileName: Uc, lineNumber: 18, columnNumber: 7 },
              void 0
            ),
          ],
        },
        void 0,
        !0,
        { fileName: Uc, lineNumber: 16, columnNumber: 5 },
        void 0
      );
    },
    vm = {
      option: "_option_1fm9a_1",
      optionSelected: "_optionSelected_1fm9a_1",
    };
  var gm =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/FilterButton/FilterButton.tsx";
  const mm = ({
      option: e,
      handleFilter: t,
      setOptions: n,
      options: r,
      disabled: i,
      className: o,
      ...a
    }) => {
      const u = o || "",
        f = e.name.includes("any") ? "ANY" : e.name;
      return L(
        Nn,
        {
          children: e.selected
            ? L(
                "button",
                {
                  className: `${vm.optionSelected} ${u}`,
                  onClick: () => t(e, n, r),
                  ...a,
                  children: f,
                },
                void 0,
                !1,
                { fileName: gm, lineNumber: 43, columnNumber: 9 },
                void 0
              )
            : L(
                "button",
                {
                  className: `${vm.option} ${u}`,
                  onClick: () => i !== !0 && t(e, n, r),
                  disabled: i,
                  ...a,
                  children: f,
                },
                void 0,
                !1,
                { fileName: gm, lineNumber: 51, columnNumber: 9 },
                void 0
              ),
        },
        void 0,
        !1
      );
    },
    ri = {
      small: "_small_19zlh_9",
      medium: "_medium_19zlh_19",
      large: "_large_19zlh_29",
      primary: "_primary_19zlh_38",
      secondary: "_secondary_19zlh_62",
    };
  var Do =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/GeneralButton/GeneralButton.tsx";
  const ym = ({
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
      return (
        Y.useState(1),
        L(
          Nn,
          {
            children:
              t === "primary" && n === "text"
                ? L(
                    "button",
                    {
                      onClick: i,
                      className: `${ri.primary} ${ri[r]} ${f}`,
                      disabled: o,
                      ...u,
                      children: e,
                    },
                    void 0,
                    !1,
                    { fileName: Do, lineNumber: 34, columnNumber: 9 },
                    void 0
                  )
                : t === "primary" && n === "icon before"
                ? L(
                    "button",
                    {
                      onClick: i,
                      className: `${ri.primary} ${f}`,
                      disabled: o,
                      ...u,
                      children: e,
                    },
                    void 0,
                    !1,
                    { fileName: Do, lineNumber: 43, columnNumber: 9 },
                    void 0
                  )
                : t === "primary" && n === "icon after"
                ? L(
                    "button",
                    {
                      onClick: i,
                      className: `${ri.primary} ${f}`,
                      disabled: o,
                      ...u,
                      children: e,
                    },
                    void 0,
                    !1,
                    { fileName: Do, lineNumber: 52, columnNumber: 9 },
                    void 0
                  )
                : n === "icon only"
                ? L(
                    "button",
                    {
                      onClick: i,
                      className: `${ri.iconOnly} ${f}`,
                      ...u,
                      children: e,
                    },
                    void 0,
                    !1,
                    { fileName: Do, lineNumber: 61, columnNumber: 9 },
                    void 0
                  )
                : L(
                    "button",
                    {
                      onClick: i,
                      className: `${ri.secondary} ${ri[r]} ${f}`,
                      disabled: o,
                      ...u,
                      children: e,
                    },
                    void 0,
                    !1,
                    { fileName: Do, lineNumber: 70, columnNumber: 9 },
                    void 0
                  ),
          },
          void 0,
          !1
        )
      );
    },
    PT = (e) =>
      Pn.createElement(
        "svg",
        {
          width: 12,
          height: 12,
          viewBox: "0 0 12 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          ...e,
        },
        Pn.createElement("path", {
          d: "M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        Pn.createElement("path", {
          d: "M6.5 0.5H11.5V5.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        Pn.createElement("path", {
          d: "M11.5 0.5L5.5 6.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })
      ),
    zo = {
      button: "_button_mr620_1",
      icon: "_icon_mr620_15",
      text: "_text_mr620_23",
      small: "_small_mr620_53",
      medium: "_medium_mr620_62",
      large: "_large_mr620_71",
    };
  var fu =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/LinkButton/LinkButton.tsx";
  const qc = ({
      children: e,
      size: t,
      type: n,
      handleClick: r,
      className: i,
      ...o
    }) => {
      const a = i || "";
      return L(
        "button",
        {
          className: `${zo.button} ${a}`,
          onClick: r,
          ...o,
          children: [
            L(
              "div",
              { className: `${zo.text} ${zo[t]}`, children: e },
              void 0,
              !1,
              { fileName: fu, lineNumber: 34, columnNumber: 7 },
              void 0
            ),
            n === "internal"
              ? L(
                  Wc,
                  { className: `${zo.icon} ${a}` },
                  void 0,
                  !1,
                  { fileName: fu, lineNumber: 39, columnNumber: 13 },
                  void 0
                )
              : L(
                  PT,
                  { className: `${zo.icon} ${a}` },
                  void 0,
                  !1,
                  { fileName: fu, lineNumber: 40, columnNumber: 13 },
                  void 0
                ),
          ],
        },
        void 0,
        !0,
        { fileName: fu, lineNumber: 29, columnNumber: 5 },
        void 0
      );
    },
    bm = {
      button: "_button_t6im8_1",
      default: "_default_t6im8_40",
      small: "_small_t6im8_47",
    };
  var NT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Button/TabButton/TabButton.tsx";
  const ET = ({ children: e, size: t, className: n, ...r }) => {
      const i = n || "";
      return L(
        "button",
        { className: `${bm.button} ${bm[t]} ${i}`, ...r, children: e },
        void 0,
        !1,
        { fileName: NT, lineNumber: 18, columnNumber: 5 },
        void 0
      );
    },
    wm = { container: "_container_1cljs_1", socials: "_socials_1cljs_21" };
  var Mr =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/NavBarModal/NavBarModal.tsx";
  const xm = ({ handleModal: e, navLinks: t }) =>
      L(
        "div",
        {
          className: wm.container,
          children: [
            t.map((n) =>
              L(
                "h4",
                {
                  children: L(
                    "a",
                    {
                      onClick: () => e(),
                      href: `/resources#${n.children}`,
                      children: L(
                        qc,
                        {
                          size: n.size,
                          type: n.type,
                          handleClick: () => {},
                          children: n.children,
                        },
                        void 0,
                        !1,
                        { fileName: Mr, lineNumber: 24, columnNumber: 13 },
                        void 0
                      ),
                    },
                    void 0,
                    !1,
                    { fileName: Mr, lineNumber: 23, columnNumber: 11 },
                    void 0
                  ),
                },
                void 0,
                !1,
                { fileName: Mr, lineNumber: 22, columnNumber: 9 },
                void 0
              )
            ),
            L(
              "div",
              {
                className: wm.socials,
                children: [
                  L(
                    "img",
                    { src: "/assets/images/socials/twitter.svg" },
                    void 0,
                    !1,
                    { fileName: Mr, lineNumber: 35, columnNumber: 9 },
                    void 0
                  ),
                  L(
                    "img",
                    { src: "/assets/images/socials/discord.svg" },
                    void 0,
                    !1,
                    { fileName: Mr, lineNumber: 36, columnNumber: 9 },
                    void 0
                  ),
                  L(
                    "img",
                    { src: "/assets/images/socials/telegram.svg" },
                    void 0,
                    !1,
                    { fileName: Mr, lineNumber: 37, columnNumber: 9 },
                    void 0
                  ),
                ],
              },
              void 0,
              !0,
              { fileName: Mr, lineNumber: 34, columnNumber: 7 },
              void 0
            ),
          ],
        },
        void 0,
        !0,
        { fileName: Mr, lineNumber: 20, columnNumber: 5 },
        void 0
      ),
    MT = { container: "_container_1t5cv_1" };
  var du =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Navigation/Navigation.tsx";
  const OT = ({ pageLocations: e, page: t }) =>
      L(
        "div",
        {
          className: MT.container,
          children: e.map((n, r) =>
            L(
              "h4",
              {
                children: L(
                  "a",
                  {
                    href: `/${t}#${n.replace(/\s/g, "")}`,
                    children: L(
                      pm,
                      { children: n.toUpperCase() },
                      void 0,
                      !1,
                      { fileName: du, lineNumber: 17, columnNumber: 14 },
                      void 0
                    ),
                  },
                  void 0,
                  !1,
                  { fileName: du, lineNumber: 16, columnNumber: 11 },
                  void 0
                ),
              },
              `anchor-${r}`,
              !1,
              { fileName: du, lineNumber: 15, columnNumber: 9 },
              void 0
            )
          ),
        },
        void 0,
        !1,
        { fileName: du, lineNumber: 13, columnNumber: 5 },
        void 0
      ),
    Yc = {
      grid: "_grid_uwgxl_1",
      left: "_left_uwgxl_14",
      right: "_right_uwgxl_14",
    };
  var Xc =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/ReusableGrid/ReusableGrid.tsx";
  const AT = ({ left: e, right: t }) =>
      L(
        "div",
        {
          className: Yc.grid,
          children: [
            L(
              "div",
              { className: Yc.left, children: e },
              void 0,
              !1,
              { fileName: Xc, lineNumber: 11, columnNumber: 7 },
              void 0
            ),
            L(
              "div",
              { className: Yc.right, children: t },
              void 0,
              !1,
              { fileName: Xc, lineNumber: 12, columnNumber: 7 },
              void 0
            ),
          ],
        },
        void 0,
        !0,
        { fileName: Xc, lineNumber: 10, columnNumber: 5 },
        void 0
      ),
    _m = { options: "_options_gf7vd_1" };
  var hu =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Filter/FilterCriteria/FilterCriteria.tsx";
  const kT = ({ children: e, options: t, handleFilter: n, setOptions: r }) =>
    L(
      "div",
      {
        className: _m.container,
        children: [
          L(
            "h5",
            { children: e },
            void 0,
            !1,
            { fileName: hu, lineNumber: 32, columnNumber: 7 },
            void 0
          ),
          L(
            "div",
            {
              className: _m.options,
              children: t.map((i, o) =>
                L(
                  mm,
                  { option: i, handleFilter: n, setOptions: r, options: t },
                  `opt-${o}`,
                  !1,
                  { fileName: hu, lineNumber: 35, columnNumber: 11 },
                  void 0
                )
              ),
            },
            void 0,
            !1,
            { fileName: hu, lineNumber: 33, columnNumber: 7 },
            void 0
          ),
        ],
      },
      void 0,
      !0,
      { fileName: hu, lineNumber: 31, columnNumber: 5 },
      void 0
    );
  var pu =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Tab/Tab.tsx";
  const $T = ({ leading: e, children: t, active: n }) =>
      L(
        Nn,
        {
          children: L(
            "ul",
            {
              children: L(
                "li",
                {},
                void 0,
                !1,
                { fileName: pu, lineNumber: 19, columnNumber: 13 },
                void 0
              ),
            },
            void 0,
            !1,
            { fileName: pu, lineNumber: 18, columnNumber: 9 },
            void 0
          ),
        },
        void 0,
        !1
      ),
    FT = () =>
      L(
        Nn,
        {
          children: L(
            "ul",
            {
              children: L(
                "li",
                {},
                void 0,
                !1,
                { fileName: pu, lineNumber: 29, columnNumber: 13 },
                void 0
              ),
            },
            void 0,
            !1,
            { fileName: pu, lineNumber: 28, columnNumber: 9 },
            void 0
          ),
        },
        void 0,
        !1
      ),
    Sm = { reverse: "_reverse_1786y_1", row: "_row_1786y_5" };
  var IT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Row/Row.tsx";
  const BT = ({ children: e, className: t, reverse: n, ...r }) => {
      const i = t || "";
      return L(
        "div",
        { className: `${Sm.row} ${n && Sm.reverse} ${i}`, ...r, children: e },
        void 0,
        !1,
        { fileName: IT, lineNumber: 22, columnNumber: 5 },
        void 0
      );
    },
    DT = { desktop: "_desktop_d7ypz_2" };
  var zT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/DesktopOnly/DesktopOnly.tsx";
  const LT = ({ children: e, className: t, ...n }) => {
      const r = t || "";
      return L(
        "div",
        { className: `${DT.desktop} ${r}`, ...n, children: e },
        void 0,
        !1,
        { fileName: zT, lineNumber: 17, columnNumber: 5 },
        void 0
      );
    },
    Kc = {
      card: "_card_1i2d8_8",
      gray: "_gray_1i2d8_12",
      transparent: "_transparent_1i2d8_15",
      box: "_box_1i2d8_19",
      rounded: "_rounded_1i2d8_24",
    };
  var GT =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Card/Card.tsx";
  const jT = ({
      component: e,
      rounded: t,
      className: n,
      children: r,
      type: i,
      ...o
    }) => {
      const a = n || "",
        u = e || "div",
        f = Kc[i || "gray"];
      return L(
        u,
        {
          className: `${Kc.card} ${f} ${t && Kc.rounded} ${a}`,
          ...o,
          children: r,
        },
        void 0,
        !1,
        { fileName: GT, lineNumber: 23, columnNumber: 5 },
        void 0
      );
    },
    Rm = { container: "_container_acmr2_1", content: "_content_acmr2_7" };
  var Cm =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/ManualCarousel/ManualCarousel.tsx";
  const HT = ({ children: e }) =>
      L(
        "div",
        {
          className: Rm.container,
          children: L(
            "div",
            { className: Rm.content, children: e },
            void 0,
            !1,
            { fileName: Cm, lineNumber: 20, columnNumber: 7 },
            void 0
          ),
        },
        void 0,
        !1,
        { fileName: Cm, lineNumber: 19, columnNumber: 5 },
        void 0
      ),
    Di = {
      winnersRight: "_winnersRight_1abi0_1",
      winnersLeft: "_winnersLeft_1abi0_1",
      winnersRightLine: "_winnersRightLine_1abi0_14",
      scrollRight: "_scrollRight_1abi0_1",
      winnersLeftLine: "_winnersLeftLine_1abi0_45",
      scrollLeft: "_scrollLeft_1abi0_1",
      winnersTop: "_winnersTop_1abi0_70",
      winnersTopLine: "_winnersTopLine_1abi0_84",
      scrollUp: "_scrollUp_1abi0_1",
    };
  var Tm =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/ContinuousCarousel/ContinuousCarousel.tsx";
  const WT = ({ direction: e, children: t }) =>
      L(
        "div",
        {
          className:
            e === "right"
              ? `${Di.winnersRight}`
              : e === "left"
              ? `${Di.winnersLeft}`
              : `${Di.winnersTop}`,
          children: L(
            "div",
            {
              className:
                e === "right"
                  ? `${Di.winnersRightLine}`
                  : e === "left"
                  ? `${Di.winnersLeftLine}`
                  : `${Di.winnersTopLine}`,
              children: t,
            },
            void 0,
            !1,
            { fileName: Tm, lineNumber: 27, columnNumber: 7 },
            void 0
          ),
        },
        void 0,
        !1,
        { fileName: Tm, lineNumber: 18, columnNumber: 5 },
        void 0
      ),
    VT = { container: "_container_1c71e_1" };
  var Lo =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/FooterItem/FooterItem.tsx";
  const UT = ({ children: e, items: t }) => {
      const n = L(
        "ul",
        {
          children: t.map((r) =>
            L(
              "li",
              {
                children: L(
                  qc,
                  {
                    handleClick: () => {},
                    size: "large",
                    type: r.type,
                    children: r.title,
                  },
                  void 0,
                  !1,
                  { fileName: Lo, lineNumber: 24, columnNumber: 11 },
                  void 0
                ),
              },
              r.title,
              !1,
              { fileName: Lo, lineNumber: 23, columnNumber: 9 },
              void 0
            )
          ),
        },
        void 0,
        !1,
        { fileName: Lo, lineNumber: 21, columnNumber: 5 },
        void 0
      );
      return L(
        "div",
        {
          className: VT.container,
          children: [
            L(
              "h1",
              { children: e },
              void 0,
              !1,
              { fileName: Lo, lineNumber: 34, columnNumber: 7 },
              void 0
            ),
            n,
          ],
        },
        void 0,
        !0,
        { fileName: Lo, lineNumber: 33, columnNumber: 5 },
        void 0
      );
    },
    qT = { container: "_container_1250o_1" };
  var vu =
    "/home/glo/Fluidity/fluidity-app/web/surfing/src/components/Container/Partner/Partner.tsx";
  const YT = ({ img: e, title: t, info: n }) =>
    L(
      "div",
      {
        className: qT.container,
        children: [
          L(
            "div",
            { children: e },
            void 0,
            !1,
            { fileName: vu, lineNumber: 16, columnNumber: 7 },
            void 0
          ),
          L(
            "h3",
            { children: t },
            void 0,
            !1,
            { fileName: vu, lineNumber: 17, columnNumber: 7 },
            void 0
          ),
          L(
            "p",
            { children: n },
            void 0,
            !1,
            { fileName: vu, lineNumber: 18, columnNumber: 7 },
            void 0
          ),
        ],
      },
      void 0,
      !0,
      { fileName: vu, lineNumber: 15, columnNumber: 5 },
      void 0
    );
  var Pm = ((e) => (
    (e.ETH = "ethereum"),
    (e.SOL = "solana"),
    (e.CMPD = "compound"),
    (e.POL = "polygon"),
    e
  ))(Pm || {});
  const Nm = (e) => {
      const t = Math.floor(e),
        n = Math.max(Math.floor(Math.log(t) / Math.log(1e3)) + 1, 1);
      return `${Array.from({ length: n }, (o, a) =>
        Math.floor((t % 1e3 ** (n - a)) / 1e3 ** (n - a - 1))
      )
        .map((o, a) => (a === 0 ? `${o}` : `${o}`.padStart(3, "0")))
        .join(",")}`;
    },
    XT = (e) => {
      const n = `${Math.floor((e * 100) % 100)}`.padStart(2, "0");
      return `$${Nm(e)}.${n}`;
    },
    Em = 12 / 2,
    KT = (e) => {
      const t = e.substring(0, Em),
        n = e.substring(e.length - Em, e.length);
      return `${t}..${n}`;
    },
    QT = (e) => {
      const t = `${e.getDate()}`.padStart(2, "0"),
        n = `${e.getMonth() + 1}`.padStart(2, "0"),
        r = `${e.getFullYear() % 100}`.padStart(2, "0"),
        i = e.getHours(),
        o = `${i === 0 ? 0 : i % 12 || 12}`.padStart(2, "0"),
        a = `${e.getMinutes()}`.padStart(2, "0"),
        u = i < 12 ? "am" : "pm";
      return `${t}.${n}.${r} ${o}:${a}${u}`;
    },
    ZT = (e) => {
      const t = `${e.getDate()}`.padStart(2, "0"),
        n = `${e.getMonth() + 1}`.padStart(2, "0");
      return `${e.getFullYear()}-${n}-${t}`;
    };
  (mt.AnchorButton = pm),
    (mt.Card = jT),
    (mt.ContinuousCarousel = WT),
    (mt.DataTable = mT),
    (mt.DesktopOnly = LT),
    (mt.Display = bT),
    (mt.FilterButton = mm),
    (mt.FilterCriteria = kT),
    (mt.FooterItem = UT),
    (mt.GeneralButton = ym),
    (mt.Heading = xT),
    (mt.LineChart = hT),
    (mt.LinkButton = qc),
    (mt.ManualCarousel = HT),
    (mt.NavBar = RT),
    (mt.NavBarModal = xm),
    (mt.Navigation = OT),
    (mt.Partner = YT),
    (mt.ReusableGrid = AT),
    (mt.Row = BT),
    (mt.SupportedChains = Pm),
    (mt.Tab = $T),
    (mt.TabBar = FT),
    (mt.TabButton = ET),
    (mt.Text = ST),
    (mt.formatTo12HrDate = QT),
    (mt.formatToGraphQLDate = ZT),
    (mt.numberToCommaSeparated = Nm),
    (mt.numberToMonetaryString = XT),
    (mt.trimAddress = KT),
    Object.defineProperties(mt, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: "Module" },
    });
});
