#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/titles.scrbl}
@require{../components/containers.scrbl}
@require{../components/view-more.scrbl}

@define-div[meet-fluidity-container]
@define-div[meet-fluidity-subtitle-container]
@define-div[meet-fluidity-container-button]

@define-div[(fluidity-orb-pic-container url) '()]{
  @img[src: url]}

@define[(meet-fluidity-title . content)]{
 @h1[class: "meet-fluidity-title" content]}

@define[(meet-fluidity-subtitle . content)]{
 @h1[class: "meet-fluidity-subtitle-text" content]}

@define[bio "
Fluidity takes tokens and wraps them at a 1-to-1 ratio while storing the
original asset in a lending protocol. The accruing interest is stored
in a reward pool with any on-chain purchase being eligible for a portion
of the pool.
"]

@define[(span-bold . content)]{
 @span[class: "meet-fluidity-span-bold" content]}

@define[bio-2]{@list{
We take @span-bold{no fee} and the user can win a life-changing amount
just for practicing their normal spending habits.
}}

@define-div[(meet-fluidity-backer image-url host-url) '()]{
 @a[href: host-url]{@img[src: (cadr image-url)]}}

@define[(make-backer backer-info)]{
 @meet-fluidity-backer[(cdr backer-info)
                       (cadr backer-info)]}

@define[(make-backers . backers)
        (map make-backer backers)]

@define[(learn-more-button gitbook-url)]{
 @a[class: "input-formatted"
    href: gitbook-url
    target: "_blank"]{Learn more}}

@define-div[learn-more-backed-by-container]
@define-div[meet-fluidity-backers-list]

@define-div[meet-fluidity-container-children]

@define[(meet-fluidity whitepaper-url gitbook-url . backers)]{
 @meet-fluidity-container{
   @meet-fluidity-container-children{
   @container-row-on-desktop-space-between{
    @fluidity-orb-pic-container{/img/fluidity.svg}
    @container-row-on-desktop-space-between{
     @meet-fluidity-subtitle-container{
      @meet-fluidity-title{
       Meet @span-bold{Fluidity.}}

      @subtitle[bio]
      @subtitle[bio-2]

      @meet-fluidity-backers-list{
       @container-row-justify-left{
        @meet-fluidity-subtitle{Backed by}
        @apply[make-backers backers]}}

      @learn-more-button[gitbook-url]}}}}}}

@provide[meet-fluidity]
