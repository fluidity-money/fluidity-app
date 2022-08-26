#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/information-box.scrbl}

@define-div[for-liquidity-info-box]

@define-div[(for-liquidity-pic-container url) '()]{
 @make-div['("for-liquidity-pic-container")]{
  @img[src: url]}}

@define[title]{For receivers}

@define[content "
Receivers win money too! Imagine your friend sending you money and
winning a life changing amount of funds. The wrapped funds can be
transferred to its original asset at any time so there is no need to
worry about liquidity.
"]

@define-div[(for-liquidity line-url pic-url) '()]{
 @information-box-right[
  for-liquidity-info-box
  title
  line-url
  content
  "for-liquidity-pic-box"
  (for-liquidity-pic-container pic-url)]}

@provide[for-liquidity]
