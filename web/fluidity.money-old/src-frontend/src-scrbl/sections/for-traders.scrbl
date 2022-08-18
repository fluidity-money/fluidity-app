#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/information-box.scrbl}

@define-div[for-traders-info-box]

@define-div[(for-traders-pic-container url) '()]{
  @img[src: url]}

@define[title]{For senders}

@define[content "
Change nothing! Make purchases and send money as you normally would
but with the potential to win rewards. Imagine winning 100 ETH just for
purchasing an NFT!
"]

@define-div[(for-traders line-url pic-url) '()]{
 @information-box-left[
  for-traders-info-box
  title
  line-url
  content
  "for-traders-pic-box"
  (for-traders-pic-container pic-url)]}

@provide[for-traders]
