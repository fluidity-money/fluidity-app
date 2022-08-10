#!/usr/bin/env racket

#lang scribble/html

@require{util.scrbl}

@require{assets.scrbl}
@require{body.scrbl}

@define[site-name]{Fluidity Money}
@define[site-url]{https://fluidity.money}

@define[site-desc "
Fluidity is a yield generating system for people who can't afford to \
leave their money idle. Fluidity rewards people when they actually use \
their money."]

@define[(make-og property content)]{
 @meta[property: property content: content]}

@define[metas]{@list{
 @meta[charset: "UTF-8"]
 @meta[name: "viewport" content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"]
 @make-og["og:title" site-name]
 @make-og["og:url" site-url]
 @make-og["og:image" og-image]
 @make-og["og:description" site-desc]}}

@define[(make-link type url . args)]{
 @apply[link rel: type href: url args]}

@define[(make-stylesheet href . args)]{
 @apply[make-link "stylesheet" href args]}

@define[styles]{@list{
 @make-stylesheet[root-css]
 @make-link["preconnect"]{https://fonts.googleapis.com}
 @make-stylesheet["https://fonts.googleapis.com/css2?family=Manrope:wght@300;400&family=Montserrat:wght@700&family=Poppins&family=Raleway:wght@500&display=swap"]
 @script[async: '() src: "https://www.googletagmanager.com/gtag/js?id=G-BEDQY53P4N"]
 @script[script-google-analytics]}}

@define[root-domain (getenv "FLU_LANDING_API_URL")]

@(if (not root-domain)
  (begin
    (display "FLU_LANDING_API_URL not set!\n" (current-error-port))
    (exit 1))
  (void))

@define[subscribe-url (make-subscribe-url root-domain)]
@define[lets-talk-submit-url (make-lets-talk-submit-url root-domain)]

@define[scripts]{@list{
  @script[src: "/js/tinyutils.js" type: "module"]
}}

@html[lang: "en"]{
 @head{
  @title[site-name]
  @metas
  @styles}

 @body[
  dragon-balls-url
  fluidity-logo-url
  info-line-url
  backers
  for-traders-pic-url
  for-liquidity-pic-url
  subscribe-url
  button-url
  lets-talk-submit-url
  socials
  blog-url
  whitepapers-modal-url
  whitepapers
  gitbook-url
  beta-url-ethereum
  beta-url-solana
  faucet-url
  docs-url]
  @scripts}

@provide[
 metas
 styles]
