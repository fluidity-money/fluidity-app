#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{./containers.scrbl}

@define-div[information-box-container]
@define-div[information-box-children]
@define-div[information-box-text]{information-box-child}

@define[(make-information-box-pic div-name . children)]{
 @make-div[(list "information-box-pic information-box-child" div-name)
           children]}

@define[(information-box-title content)]{
 @h1[class: "information-box-title" content]}

@define-div[(information-box-line-container line-url) '()]{
 @img[src: line-url]}

@define[(information-box-content . children)]{
 @p[class: "information-box-content information-box-content-left"
    children]}

@define-div[information-box-column]{
 container-column
 container-center}

@define[(information-box-content-text child-div
                                      title
                                      line-url
                                      content)]{

 @information-box-text{
  @child-div{
   @information-box-column{
     @information-box-title[title]
     @information-box-line-container[line-url]
     @information-box-content[content]}}}}

@define[(information-box-content-pic box-div-name . children)]{
 @make-information-box-pic[box-div-name]{
  @container-row-center{
   @container-column-center{
    @children}}}}

@define[(make-information-box left right)]{
 @make-div['("information-box")]{
  @information-box-children{
   @left
   @right}}}

@define[(information-box-left content-div
                              title
                              line-url
                              content
                              box-div
                              image-div) '()]{

 @make-information-box[
  (information-box-content-text content-div title line-url content)
  (information-box-content-pic box-div image-div)]}

@define[(information-box-right content-div
                               title
                               line-url
                               content
                               box-div
                               image-div) '()]{

 @make-information-box[
  (information-box-content-pic box-div image-div)
  (information-box-content-text content-div title line-url content)]}

@provide[
 information-box-left
 information-box-right]
