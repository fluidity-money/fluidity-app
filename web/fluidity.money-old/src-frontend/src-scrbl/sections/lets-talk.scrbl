#!/usr/bin/env racket

#lang scribble/html

@require{../util.scrbl}

@require{../components/containers.scrbl}
@require{../components/input.scrbl}
@require{../components/titles.scrbl}
@require{../components/view-more.scrbl}

@define-div[lets-talk-container]
@define-div[lets-talk-children]
@define-div[lets-talk-children-text]
@define-div[lets-talk-inputs-container]
@define-div[lets-talk-inputs-message-container]

@define[lets-talk-inputs-message-text]{
 @let[((name "lets-talk-message"))]{
  @textarea[class: "lets-talk-inputs-message-text"
            placeholder: "Message"
            id: name
            name: name
            maxlength: 500]}}

@define-div[lets-talk-inputs-name-email]
@define-div[lets-talk-inputs-button-container]

@define[bio "
Please reach out if you have any questions or comments."]

@define[(lets-talk submit-url)]{
 @lets-talk-container{
  @container-row-center{
   @lets-talk-children{
    @lets-talk-children-text{
     @title-small-center{Let's Talk}
     @subtitle-center[bio]}

    @form[action: submit-url
          method: "POST"
          id: "lets-talk-form"]{

     @lets-talk-inputs-container{
      @lets-talk-inputs-name-email{
       @container-row-on-desktop{
        @input-greedy['()
                      "lets-talk-name"
                      "text"
                      "Name"
                      #t]

        @input-seperator

        @input-greedy['()
                      "lets-talk-email"
                      "email"
                      "Email"
                      #t]}

       @lets-talk-inputs-message-container{
        @lets-talk-inputs-message-text}

       @lets-talk-inputs-button-container{
        @container-row-center{
          @view-more-button["lets-talk-button"]{Submit}}}}}}}}}}

@provide[lets-talk]
