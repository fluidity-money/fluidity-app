#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@define-div[view-more-container]

@define[(view-more-link link . content)]{
 @view-more-container{
  @a[class: "button view-more-link" href: link content]}}

@define[(view-more-button name . content)]{
 @view-more-container{
  @button[class: "button view-more-link"
          id: name
          content]}}

@provide[view-more-link view-more-button]
