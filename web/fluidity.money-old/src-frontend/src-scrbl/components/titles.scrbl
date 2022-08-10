#!/usr/bin/env racket

#lang scribble/html

@define[(title-main . content)]{
 @h1[class: "title-main" content]}

@define[(title-small . content)]{
 @h1[class: "title-small" content]}

@define[(title-small-center . content)]{
 @h1[class: "title-small title-center" content]}

@define[(title-footer . content)]{
 @h1[class: "title-footer" content]}

@define[(subtitle . content)]{
 @h2[class: "subtitle" content]}

@define[(subtitle-center . content)]{
 @h2[class: "subtitle title-center" content]}

@define[(subtitle-center-on-mobile . content)]{
 @h2[class: "subtitle title-center-on-mobile" content]}

@provide[
 title-main
 title-small
 title-small-center
 title-footer
 subtitle
 subtitle-center
 subtitle-center-on-mobile]
