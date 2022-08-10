#!/usr/bin/env racket

#lang scribble/html

@define[root-css]{/index.css}
@define[whitepapers-cdn]{https://whitepapers.fluidity.money}

@define[dragon-balls-url "/img/dragonballs.png"]

@define[info-line-url "/img/information-box-line.svg"]
@define[fluidity-logo-url "/img/logo.svg"]

@define[(make-action root-domain endpoint)
        (format "~A/api/~A" root-domain endpoint)]

@define[backer-solana '("Solana"
                        "https://solana.com"
                        "/img/solana.svg")]

@define[backer-compound '("Compound"
                          "https://compound.finance"
                          "/img/compound.svg")]

@define[backer-polygon '("Polygon"
                         "https://polygon.technology/"
                         "/img/polygon.svg")]

@define[backers (list backer-solana
                      backer-polygon
                      backer-compound)]

@define[for-traders-pic-url]{/img/for-traders-screenshot.png}
@define[for-liquidity-pic-url]{/img/for-liquidity-screenshot.png}

@define[gitbook-url]{http://docs.fluidity.money/}

@define[beta-url-ethereum "https://ropsten.ethereum.fluidity.money"]
@define[beta-url-solana   "https://devnet.solana.fluidity.money"]

@define[faucet-url "https://faucet.fluidity.money"]

@define[docs-url "https://docs.fluidity.money"]

@define[(make-subscribe-url root-domain)
        (make-action root-domain "submit-email")]

@define[(make-lets-talk-submit-url root-domain)
        (make-action root-domain "ask-question")]

@define[button-url]{/img/subscribe-button.svg}

@define[lets-talk-dragon-balls]{/img/dragon-balls.png}

@define[social-twitter '("https://twitter.com/fluiditymoney"
                         "/img/twitter.svg")]

@define[social-discord '("https://discord.gg/CNvpJk4HpC"
                         "/img/discord.svg")]

@define[social-linkedin '("https://www.linkedin.com/company/74689228/"
                          "/img/linkedin.svg")]

@define[social-telegram '("https://t.me/fluiditymoney"
                          "/img/telegram.svg")]

@define[socials
 (list
  social-twitter
  social-discord
  social-linkedin
  social-telegram)]

@define[whitepapers-modal-url]{#whitepapers}

@define[(make-whitepaper-url name)
        (format "~A/~A" whitepapers-cdn name)]

@define[technical-whitepaper '("fluidity-technical-wp-v1.pdf"
                               #f
                               "/img/technical.png"
                               "Technical Whitepaper")]

@define[litepaper '("fluidity-litepaper-v1.pdf"
                    #f
                    "/img/litepaper.png"
                    "Litepaper")]

@define[economics-whitepaper '("fluidity-economics-wp-v0.8.pdf"
                               #t
                               "/img/economics.png"
                               "Economics Whitepaper")]

@define[whitepapers]{@map[(lambda (x)
                           (cons (make-whitepaper-url (car x))
                                 (cdr x)))
 (list economics-whitepaper)]}

@define[blog-url]{https://blog.fluidity.money}

@define[script-google-analytics "
 window.dataLayer = window.dataLayer || [];

 function gtag(){dataLayer.push(arguments);}

 gtag('js', new Date());

 gtag('config', 'G-BEDQY53P4N');"]

@define[og-image "/img/embed.png"]

@provide[
 root-css
 info-line-url
 dragon-balls-url
 fluidity-logo-url
 backers
 for-traders-pic-url
 for-liquidity-pic-url
 make-subscribe-url
 button-url
 make-lets-talk-submit-url
 socials
 whitepapers-modal-url
 whitepapers
 blog-url
 script-google-analytics
 og-image
 gitbook-url
 beta-url-ethereum
 beta-url-solana
 faucet-url
 docs-url]
