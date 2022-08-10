#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@define-div[container]
@define-div[container-hidden-on-large]

@define-div[container-left]
@define-div[container-right]

@define[container-left-right]{
 @make-div['("container-left" "container-right")]}

@define-div[container-column]
@define-div[container-column-on-desktop]

@define-div[container-center]
@define-div[container-space-evenly]
@define-div[container-justify-left]

@define[(container-row-space-around-on-mobile . content)]{
 @make-div['("container-row" "container-space-around-on-mobile") content]}

@define[(container-row-justify-left . content)]{
 @make-div['("container-row" "container-justify-left") content]}

@define-div[container-row]
@define-div[container-row-on-desktop]

@define[(container-row-on-desktop-space-between . content)]{
 @make-div['("container-row-on-desktop" "container-space-between") content]}

@define[(container-row-on-desktop-center . content)]{
 @make-div['("container-row-on-desktop" "container-center") content]}

@define-div[container-big-image]
@define-div[container-footer]
@define-div[container-social]

@define[(container-small-logo url)]{
 @div[class: "container-small-logo"]{
  @img[src: url]}}

@define[(container-big-image-hide-on-large img-classes . children)]{
 @make-div["container-big-image" '(container-hidden-on-large)]{
  @img[class: img-classes children]}}

@define[container-column-center]{
 @make-div['("container-column" "container-center")]}

@define[container-column-center-on-desktop]{
 @make-div['("container-column-on-desktop" "container-center")]}

@define[container-row-center]{
 @make-div{container-row container-center}}

@define[container-row-center-on-desktop]{
 @make-div{container-row-on-desktop container-center}}

@define[container-row-space-evenly]{
 @make-div['("container-row" "container-space-evenly")]}

@define[container-row-space-between]{
 @make-div['("container-row" "container-space-between")]}

@provide[
 container
 container-hidden-on-large
 container-left
 container-right
 container-left-right
 container-column
 container-column-on-desktop
 container-center
 container-space-evenly
 container-row-space-around-on-mobile
 container-row-on-desktop-space-between
 container-row-on-desktop-center
 container-row-justify-left
 container-row
 container-row-on-desktop
 container-big-image
 container-footer
 container-social
 container-small-logo
 container-big-image-hide-on-large
 container-column-center
 container-column-center-on-desktop
 container-row-center
 container-row-center-on-desktop
 container-row-space-evenly
 container-row-space-between]
