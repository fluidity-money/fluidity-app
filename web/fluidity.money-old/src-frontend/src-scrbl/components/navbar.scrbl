#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{containers.scrbl}

@define-div[navbar-container]
@define-div[navbar-left]

@define-div[(navbar-right . content) '()]{
 @make-div["navbar-right-items" '() content]}

@define[(navbar-item path . content)]{
 @a[class: "navbar-item" href: path content]}

@define[(navbar-beta-button path-eth path-sol . content)]{
 @div[class: "navbar-beta-button-wrapper"]{
   @span[class: "navbar-beta-button"]{beta}
   @ul[class: "navbar-menu"]{
    @li[data-value: path-sol]{Solana Devnet}
    @li[data-value: path-eth]{Ethereum Testnet}}}}

@define[(navbar logo-url blog-url whitepapers-url beta-url-ethereum beta-url-solana faucet-url docs-url)]{
 @navbar-container{
  @navbar-left{
   @a[href: "/"]{
    @container-small-logo[logo-url]}}

  @navbar-right{
   @navbar-item["#home"]{Home}
   @navbar-item["#about"]{About}
   @navbar-item[blog-url]{Blog}
   @navbar-item["#lets-talk"]{Contact}
   @navbar-item[whitepapers-url]{Whitepapers}
   @navbar-item[docs-url]{Docs}
   @navbar-item[faucet-url]{Faucet}
   @navbar-beta-button[beta-url-ethereum beta-url-solana]{Beta}}}}

@provide[navbar]
