#!/usr/bin/env racket

#lang scribble/html

@(define (fix-classes classes)
    (if (list? classes) (string-join classes " ")
        classes))

@(define (make-div classes . body)
  (if (null? body)
      (lambda x
        (element 'div 'class: (fix-classes classes) x))
      ((make-div classes) body)))

@(define-syntax define-div
  (syntax-rules ()
   ((_ (name any ...) classes body ...)
    (define name (lambda (any ...)
      (make-div (cons (symbol->string 'name)
                      classes) body ...))))
   ((_ (name any ... . expr) classes body ...)
    (define name (lambda (any ... . expr)
      (make-div (cons (symbol->string 'name)
                      classes) body ...))))
   ((_ name)
    (define name (make-div 'name)))
   ((_ name classes ...)
    (define name (lambda body
     (make-div (cons (symbol->string 'name)
                     '(classes ...)) body))))
   ((_ name classes body ...)
    (define name
      (make-div (cons (symbol->string 'name)
                      classes) body ...)))))
@provide[make-div define-div]
