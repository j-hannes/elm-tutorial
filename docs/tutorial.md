# How to develop an Elm web application

To learn what Elm is and how it works read http://elm-lang.org/docs. Here we
will now create a complete Elm web application from scratch, starting very
simple and then refactoring it increasingly into a modular web application.

## Chapter 1 - Hello world example

### 1.1 - Install

Install the elm binaries, if you are on a Unix platform, simply run

    $ npm install --global elm

otherwise follow instructions on http://elm-lang.org/install.

### 1.2 - Create the project

Go in your application directory of choice, for example:

    $ cd ~/apps 

then create the project directory and go right into it:

    $ mkdir my-first-elm-app && cd !$

### 1.3 - Create an Elm source file

Now we are ready to create the first elm source code:

    $ edit app.elm

and lets create some simple content, inspired by the Elm homepage:

```Elm
main = span [class "welcome-message"] [text "Hello, World!"]
```

That's enough content for now, we will extend this later once the environment
is set up.

### 1.4 - Compiling the elm program

Elm code is transpiled into JavaScript code. Let's do this with
[elm-make](https://github.com/elm-lang/elm-make):

    $ elm-make app.elm

Elm will probably tell you that some new packages are needed, like:

```
Some new packages are needed. Here is the upgrade plan.

  Install:
    elm-lang/core 2.1.0

Do you approve of this plan? (y/n)
```

Approve this and elm-make will install the elm-lang/core package.

Next elm will tell you that there are some errors in you source file:

```
## ERRORS in app.elm ###########################################################

-- NAMING ERROR -------------------------------------------------------- app.elm

Cannot find variable `span`

1| main = span [class "welcome-message"] [text "Hello, World!"]
          ^^^^
Maybe you want one of the following?

    atan
    sin
    tan
    Basics.atan


-- NAMING ERROR -------------------------------------------------------- app.elm

Cannot find variable `class`

1| main = span [class "welcome-message"] [text "Hello, World!"]
                ^^^^^
Maybe you want one of the following?

    clamp
    Basics.clamp


-- NAMING ERROR -------------------------------------------------------- app.elm

Cannot find variable `text`

1| main = span [class "welcome-message"] [text "Hello, World!"]
                                          ^^^^

Detected errors in 1 module.
```

That's because the compiler can't find the functions span, class and text,
which are part of the [elm-html package](https://github.com/evancz/elm-html) 
that we haven't installed yet.

So let's go ahead and install the missing dependency:

    $ elm-package install evancz/elm-html

and agree to install the package. Elm will also suggest to install the
virtual-dom package which we also agree. Elm will download the packages and
hopefully finish with

```
Downloading evancz/elm-html
Downloading evancz/virtual-dom
Packages configured successfully!
```

Now we can load the three functions in our app.elm source file. We have to pay
attention to the package structure. If we inspect the
[package library](http://package.elm-lang.org/packages/evancz/elm-html/4.0.1)
we can see that "class" is exposed by `Html.Attributes` whereas the other two
functions are exposed by `Html` directly. Now we can import the three functions
accordingly in our source file:

```Elm
import Html exposing (span, text)
import Html.Attributes exposing (class)

main = span [class "welcome-message"] [text "Hello, World!"]
```

Just for completeness, the code above will create the following HTML:
```HTML
<span class="welcome-message">Hello, World!</span>
```

We will dive later into more complex examples of how to construct DOM trees
with Elm function composition.

Now we can re-run our elm-make command from above:

    $ elm-make app.elm

And this time it will hopefully finish with:

```
Success! Compiled 1 modules.
Successfully generated elm.js
```

### 1.5 - Running the application

Now as our program has been transpiled successfully, we can include the
generated JavaScript code in a HTML file to view in in a browser.

Let's create a index.html file with the following content:
```HTML
<!doctype html>
<meta charset="utf-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no">
<body></body>
<script src="elm.js"></script>
<script>Elm.fullscreen(Elm.Main)</script>
```

(Note: there seems to be some HTML missing, but don't worry, your browser will
take care of that! ;) This minimal code snippet is taken from
[here](https://github.com/henrikjoreteg/hjs-webpack#html-optional-can-be-boolean-or-function).

Let's open the file in a browser:

    $ open index.html

(Note: open should open the file in your default browser. If that's not the
case then replace the command with firefox, google-chrome or whatever.)

Now you should see the generate output of our elm program in the browser:

![Browser Screenshow Hello World Example](/docs/assets/hello-world.png?raw=true)

If we inspect our DOM tree we can see that Elm has appended the HTML snippet
from above as child of the body tag.

### 1.6 - Summary

In this chapter we have done the first baby steps of installing the Elm
platform, compiling a small elm program and displaying the output in a browser.

As our project will grow it is good practice to invest some time to set up a
good development environment (including deployment) to create a proper modular
application structure and to have reccuring tasks automated. We will take care
of that in the next chapter. If you are not interested in this or have your
own way managing your development process you can skip the next chapter and
jump right into chapter 3 where we will extend our Elm application.

### Chapter 2 - Dev environment

...

### 2.1 - Managing your files via version control

Now as we have a minimal complete application running, we want to have a look





