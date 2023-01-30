#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/titles.scrbl}
@require{../components/containers.scrbl}
@require{../components/view-more.scrbl}

@define-div[money-designed-to-be-moved-container]
@define-div[money-designed-to-be-moved-text-container]{container-column container-center}
@define-div[money-designed-to-be-moved-description]
@define-div[money-designed-to-be-moved-pic-container]

@define-div[money-designed-to-be-moved-vid-container]

@define[(money-designed-to-be-moved-pic src)]{
 @img[class: "money-designed-to-be-moved-pic" src: src]}

@define[(money-designed-to-be-moved-dot . content)]{
 @span[class: "money-designed-to-be-moved-dot" content]}

@define[(title-main-top . content)]{
 @h1[class: "title-main money-designed-to-be-moved-title" content]}

@define[(title-main-blue . content)]{
 @h1[class: "title-main money-designed-to-be-moved-bold" content]}

@define[title]{@list{
 @title-main-top{Money designed}
 @title-main-blue{to be moved @money-designed-to-be-moved-dot{.}}}}

@define[content]{@list{
 @subtitle["
With Fluidity, every spend is an opportunity to win a reward.
"]

 @subtitle["
Subscribe to our newsletter:"]}}

@define-div[money-designed-to-be-moved-subscribe-input]
@define-div[money-designed-to-be-moved-input-container]

@define[money-designed-to-be-moved-thanks]{
 @h1[class: "money-designed-to-be-moved-thanks" id: "success"]{
  Thanks for signing up!}}

@define[(money-designed-to-be-moved
         dragon-balls-url
         fluidity-logo-url
         subscribe-url)]{

 @money-designed-to-be-moved-container{
  @container-row-on-desktop-center{
   @money-designed-to-be-moved-text-container{
    @money-designed-to-be-moved-description{
     @title
     @content
     @money-designed-to-be-moved-thanks}

    @form[action: subscribe-url method: "POST"]{
     @money-designed-to-be-moved-subscribe-input{
      @container-row-on-desktop-space-between{
       @input[class: "money-designed-to-be-moved-input"
              name: "email"
              required: #t
              type: "email"
              placeholder: "gnarly@email.com"]

        @money-designed-to-be-moved-input-container{
        @button[class: "input-formatted"]{Subscribe}}}}}}

   @money-designed-to-be-moved-pic-container{
    @img[src: dragon-balls-url]}}}}

@provide[money-designed-to-be-moved]
