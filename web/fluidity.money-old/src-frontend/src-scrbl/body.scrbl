#!/usr/bin/env racket

#lang scribble/html

@require{components/containers.scrbl}
@require{components/background.scrbl}

@require{components/navbar.scrbl}

@require{sections/money-designed-to-be-moved.scrbl}
@require{sections/meet-fluidity.scrbl}
@require{sections/for-traders.scrbl}
@require{sections/for-liquidity.scrbl}
@require{sections/lets-talk.scrbl}
@require{sections/footer.scrbl}
@require{sections/whitepaper-modal.scrbl}

@define[(section id . content)]{
 @element['section 'id: id content]}

@define[(make-section id . content)]{
 @apply[section id content]}

@define[(body dragon-balls-url
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
              docs-url)]{@list{

 @make-section["whitepapers"
               (apply whitepaper-modal whitepapers)]

 @make-section["navbar" (navbar fluidity-logo-url
                                blog-url
                                whitepapers-modal-url
                                beta-url-ethereum
                                beta-url-solana
                                faucet-url
                                docs-url)]

 @background-wavey{
  @container{
   @make-section["home"]{
    @money-designed-to-be-moved[dragon-balls-url
                                fluidity-logo-url
                                subscribe-url]}

   @make-section["about" (apply meet-fluidity
                                whitepapers-modal-url
                                gitbook-url
                                backers)]}

  @make-section["for-traders"]{
   @for-traders[info-line-url for-traders-pic-url]}

  @make-section["for-liquidity"]{
   @for-liquidity[info-line-url for-liquidity-pic-url]}

 @make-section["lets-talk" (lets-talk
                            lets-talk-submit-url)]

 @make-section["footer"
               (footer fluidity-logo-url
                       whitepapers-modal-url
                       beta-url-ethereum
                       faucet-url
                       socials)]}}}

@provide[body]
