#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/titles.scrbl}
@require{../components/containers.scrbl}
@require{../components/input.scrbl}

@define-div[(subscribe-container . children) '()]{
 @container-row-center[children]}

@define-div[subscribe-container-children]
@define-div[subscribe-container-text]

@define-div[subscribe-container-inputs]{container-row-on-desktop}

@define-div[subscribe-button]

@define[(make-subscribe-button url id)]{
 @button[class: "subscribe-button-container" id: id]{
  @subscribe-button{
   @img[src: url]}}}

@define[bio]{Sign up to be informed of the latest updates to Fluidity!}

@define[(subscribe subscribe-url button-url)]{
 @subscribe-container{
  @subscribe-container-children{
   @subscribe-container-text{
    @title-small-center{Subscribe to our mailing list}
    @subtitle-center[bio]}
   @form[action: subscribe-url
         method: "POST"
         id: "subscribe-form"]{

    @subscribe-container-inputs{
     @input-greedy['("subscribe-email")
                   "subscribe-input"
                   "email"
                   "Enter your email here"
                   #t]

     @make-subscribe-button[button-url
                            "subscribe-button"]}}}}}

@provide[subscribe]
