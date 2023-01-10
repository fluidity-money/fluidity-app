#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/titles.scrbl}
@require{../components/containers.scrbl}

@define-div[container-footer-items]{container-row container-space-evenly}

@define-div[social-container]
@define-div[social-container-center]

@define-div[footer-rights-reserved]

@define-div[footer-item]{container-column container-center}

@define[(make-social-container link-url image-url)]{
 @a[target: "_blank" href: link-url]{
  @social-container{
   @img[src: image-url]}}}

@define-div[footer-logo-container]{container-item}

@define-div[footer-grid]

@define-div[footer-grid-container]

@define[(title-footer-url content)]{
 @a[class: "footer-navbar-link" href: (car content)]{
  @title-footer[(cadr content)]}}

@define[(make-footer-navbar-items whitepapers-url beta-url faucet-url)
        (map title-footer-url
          `(("#home" "Home")
            ("#about" "About")
            ("#blog" "Blog")
            (,whitepapers-url "Whitepapers")
            (,faucet-url "Faucet")
            (,beta-url "Beta")))]

@define[(footer
         fluidity-logo-url
         whitepapers-url
         beta-url
         faucet-url
         socials)]{

 @container-footer{
  @container-footer-items{
   @footer-item{
     @a[href: "#"]{
      @container-small-logo[fluidity-logo-url]}

   @a[class: "footer-email" href: "mailto:contact@fluidity.money"]{
    @title-footer["contact@fluidity.money"]}}

   @footer-item{
    @container-row-space-around-on-mobile{
     @map[(lambda (x) (make-social-container (car x)
                                             (cadr x)))
          socials]}

    @title-footer{
     © 2021 Fluidity All Rights Reserved.}}

    @footer-item{
     @footer-grid-container{
      @footer-grid{
       @make-footer-navbar-items[whitepapers-url
                                 beta-url
                                 faucet-url]}}}}}}

@provide[footer]
