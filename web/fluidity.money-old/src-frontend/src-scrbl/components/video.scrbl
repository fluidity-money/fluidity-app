#!/usr/bin/env racket

#lang scribble/html

@define[(format-video-url root type) (format "~A.~A" root type)]

@define[(make-video-type type) (format "video/~A" type)]

@define[(video . args) (apply element 'video args)]
@define[(source video type) (element 'source type: type src: video)]

@define[(make-source url type)]{
 @source[(format-video-url url type)
         (make-video-type type)]}

@define[(make-video root-url class)]{
 @video[class: class
        loop: #t
        autoplay: #t
        muted: #t
        poster: (format-video-url root-url "png")]{
  @map[
   (lambda (x) (make-source root-url x))
   '(mp4 webm mkv mov)]}}

@provide[
 format-video-url
 make-video-type
 make-video
 video
 source]
