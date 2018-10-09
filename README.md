# Introduction

Please look at my [blog post](https://medium.com/@lukashetzenecker/integrating-my-smart-home-into-the-tangle-d88ae03eb9bb) for full details of this project.

This is the UI component of the IOTA DoorOpener. It opens a private or restricted MAM channel in the Tangle, and posts the message `{'action': 'open_door'}` after the click of a button. It is easily extendable though.

# Installation

None, this contains no fancy client side JS frameworks, which need 20 steps for compling. Just open the index.html file in your browser.

If this is too boring, there's also a Dockerfile which spins a nginx to display this static content.

# Compatibility

.. with everything [navigator.clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) is compatible.
