# How to build the code editor

The code editor CodeMirror is built via rollup. The code is in codingtutorial/src/codemirror.js. Run

```
  rollup -c
```

and it will compile to the bundle codemirror.bundle.js. This bundle will be included in Svelte.
