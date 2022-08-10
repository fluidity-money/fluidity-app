#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@define[(make-input extra-classes name type placeholder required)]{
 @input[class: (string-join (cons "input" extra-classes)
                                  " ")
        id: name
        name: name
        type: type
        placeholder: placeholder
        required: required]}

@define[(input-greedy extra-classes . args)]{
 @apply[make-input
        (cons "input-greedy" extra-classes)
        args]}

@define-div[input-seperator]

@provide[
 make-input
 input-greedy
 input-seperator]
