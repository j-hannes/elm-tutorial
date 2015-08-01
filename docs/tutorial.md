# How to develop an Elm web application

This is a tutorial about how to create a web application where your client
logic is written in [Elm](http://elm-lang.org). To learn more about the
language you might want to read http://elm-lang.org/docs.

If you like the readability, composability and type-safety of Haskell programs
combined with the powerful paradigms of functional reactive programming, then
Elm might be for you.

This document jumps right in to create a complete Elm web application from
scratch, starting with a very simple static web site, which then gets scaled up
into a modular web application.

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

Approve this and _elm-make_ will install the _elm-lang/core_ package.

Then the compiler will tell you that there are some errors in you source file:

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

That's because the compiler can't find the functions `span`, `class` and `text`,
and tries to guess what you could mean instead. On the homepage there is no
mention that those functions are part of the package
[elm-html](https://github.com/evancz/elm-html) that needs to be imported before
we can use its functions.

So let's go ahead and install the missing dependency:

    $ elm-package install evancz/elm-html

and agree to install the package. Elm will also suggest to install the
_virtual-dom_ package which we also agree. Elm will download the packages and
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

Now as our program has been compiled successfully, we can include the
generated JavaScript code in a HTML file to view it in a browser.

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

_Note: there seems to be some HTML missing, but don't worry, your browser will
take care of that! ;) This minimal code snippet is taken from
[here](https://github.com/henrikjoreteg/hjs-webpack#html-optional-can-be-boolean-or-function)._

To explain the code above: The elm.js contains the complete Elm library source
code plus our compiled elm program (the app.elm). We are loading it via script
tag into our browser, but we still need to "start" the application. This happens
with the function `Elm.fullscreen` (other ways can be found
[here](http://elm-lang.org/guide/interop)). We are passing our module as argument
to the function, which is references as Elm.Main (Main is the default module
name as we have not specified one in our source file). We will have a closer
look at module at a later point.

Now let's open the file in a browser:

    $ open index.html

_Note: open should open the file in your default browser. If that's not the
case then replace the command with firefox, google-chrome or whatever._

Now you should see the generate output of our elm program in the browser:

![Browser Screenshow Hello World Example](/docs/assets/hello-world.png?raw=true)

If we inspect our DOM tree we can see that Elm has appended the HTML snippet
from above as child of the body tag:

![DOM Tree Hello World Example](/docs/assets/dom-tree-hello-world.png?raw=true)

### 1.6 - Summary

Now we have a minimal complete elm application running which compiles into
JavaScript which can then be included into a HTML document and displayed in a
web browser. This example can easily be extended to display a more complex DOM
tree.

So far our little project consists of thre files:
* app.elm
* elm.js
* index.html

The Elm compiler also created an _elm-package.json_ file which lists
dependencies and project properties (similar to node's package.json) as well as
an _elm-stuff_ directory which contains packages that are used in our app.

## Chapter 2 - Dev environment

As our project will grow it is good practice to invest some time to set up a
good development environment (including deployment) to create a proper modular
application structure and to have reccuring tasks automated. In this chapter we
will take care of that.

If you are not interested by this or already have your own way managing your
development process you can skip this chapter and jump right into the next
chapter where we will extend our previously developed Elm application.

### 2.1 Creating a scalable folder structure

Currently all our files are in the project root. This will become very
confusing as our application grows.

First, we could separate our source files from generated files. Let's create the
following folder structure:

```
.
└── src
    ├── elm
    │   └── app.elm
    ├── html
    │   └── index.html
    └── js
        └── app.js
```

and move your app.elm and the index.html accordingly.

We will also move the one line of JavaScript code `Elm.fullscreen(Elm.Main)`
from the index.html to the app.js, so it looks like this:

```JavaScript
// src/js/app.js

Elm.fullscreen(Elm.Main)
```

### 2.2 Build your application

Our plan is to create a public directory with only the index.html and the app.js
in it, which will be the only things that is deployed to production:

```
.
└── public
    ├── bundle.js
    └── index.html
```

We will concatenate the elm.js and our app.js together in one file called
bundle.js. So our new index.html now looks like:

```HTML
<!doctype html>
<meta charset="utf-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no">
<body></body>
<script src="bundle.js"></script>
```

Now we have to amend our build process a bit:

    $ mkdir public
    $ cp src/html/index.html public/
    $ mkdir tmp
    $ elm-make src/elm/app.elm --output tmp/elm.js
    $ cat tmp/elm.js src/js/app.js > public/app.js
    $ rm -rf tmp

If you are now thinking that looks a bit complicated then you are right, but
dont worry, we will take care of that build process in just a bit.

Now we can run `open public/index.html` to see our application running as
before (we still can see "Hello, World!").

### 2.3 - Managing your files via version control

It is time to use a version control system so we can keep track of our changes
in a history and work on the code from different places or via collaboration.

Inside your project root folder, initialize a new git repository:

    $ git init 

You may wanna create a .gitignore file and ignore the _elm-stuff_ folder (those
dependencies will be created via the elm package manager) as well as the
_public_ folder as it's content is copied or compiled and can be reproduced any
time.

```
# .gitignore
elm-stuff
public
```

It is also good practice to always have a readme.md file, so we could create one
now:

```Markdown
# My first elm app

Application to follow along
https://github.com/j-hannes/my-first-elm-app/blob/master/docs/tutorial.md.
```

Now we can add our current program to the repository:

    $ git add .

commit the changes with

    $ git commit -v

and enter a commit message ("Initialize repository" or something like that) to
complete the commit. Your commit should contain the following files

```Gitcommit
# new file:   .gitignore
# new file:   elm-package.json
# new file:   readme.md
# new file:   src/elm/app.elm
# new file:   src/html/index.html
# new file:   src/js/app.js
```

If we want we can also 
[create a new github repository](https://help.github.com/articles/create-a-repo)
and add it as remote repository to our project:

    $ git remote add origin git@github.com:my-username/my-repository

From here our project is under version control which makes it easy to undo/redo
changes and to add new features via branching etc.

### 2.4 Task automation

If we look at the number of commands required for our build we can easily see
that it would be nice to put that into an automated process / script. Another
advantage is that everybody who checks out and uses our app will build things
in the same way.

So let's go ahead and use Gulp as build system for this purpose:

    $ npm install --global gulp # if you haven't already ;)

And then we can create a gulpfile.js where we create some tasks:


