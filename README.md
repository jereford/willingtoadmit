# willingtoadmit

## Setup
The following dependencies need to be installed: git, gulp, bower, npm. We try to use homebrew to resolve most installations.


## Running locally
Make sure all packages defined in package.json (node dependencies) & bower.json (front-end script dependencies) are installed using the following commands:
```
npm install
bower install
```
Use the following command to run local server:
```
gulp
```

## Production
We use github pages to push our site live using a gulp task:
```
gulp deploy
```

### Coding Conventions
We try to follow npmjs to define our scripting [coding convention](https://docs.npmjs.com/misc/coding-style). Note there are no semicolons.

We try to keep the styles as modular as possible using [mediums popular css conventions](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06#.ukkz5rhzf)

### Contributions
All contributions are welcome. Pull request will not be accepted if the conventions are NOT followed.
