#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/containers.scrbl}

@define-div[whitepaper-modal-epic]
@define-div[whitepaper-modal-background]
@define-div[whitepaper-modal-container]
@define-div[whitepaper-modal-children]
@define-div[whitepaper-modal-child]
@define-div[whitepaper-modal-buttons-bar]

@define[(whitepaper-modal-link url enabled . children)]{
 @(if enabled
   (a class: "whitepaper-modal-link"
      href: url
      target: "_blank"
      children)

   (div class: "whitepaper-modal-link" children))}

@define[(whitepaper-modal-item-make-class enabled)]{
 @(let ((classes '("whitepaper-modal-item")))
   (if enabled classes
               (cons "whitepaper-modal-item-disabled" classes)))}

@define[modal-x-symbol]{
 @img[src: "/img/x-symbol.svg"
      class: "whitepaper-modal-x-symbol"]}

@define[(whitepaper-modal-item url enabled pic-url name)]{
 @make-div[(whitepaper-modal-item-make-class enabled)]{
  @whitepaper-modal-link[url enabled]{
  @container-row-center{
   @img[class: "whitepaper-modal-item-image"
        src: pic-url]}

  @h1[class: "whitepaper-modal-h1" name]}}}

@define[whitepaper-modal-exit-button]{
 @a[id: "whitepaper-modal-exit"
    href: "#"
    class: "whitepaper-modal-exit-button"]{
  @modal-x-symbol}}

@define[(make-whitepaper-modal-item x)]{
 @whitepaper-modal-item[(car x)
                        (cadr x)
                        (caddr x)
                        (cadddr x)]}

@define[(whitepaper-modal . papers)]{
 @whitepaper-modal-epic{
  @container-row-center{
   @whitepaper-modal-children{
    @whitepaper-modal-buttons-bar{
     @whitepaper-modal-exit-button}

    @whitepaper-modal-child{
     @map[make-whitepaper-modal-item papers]}}}}}

@provide[whitepaper-modal]
