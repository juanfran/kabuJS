#KabuJS
> Very small framework to organize your web application JS

## Install

```shell
bower install injector.js
bower install kabu.js
```

```html
<script type="text/javascript" src="bower_components/injector.js/build/injector.min.js"></script>
<script type="text/javascript" src="bower_components/kabu.js/dist/kabu.min.js"></script>
```

## Usage

```html
<div view="menu">
...
</div>
```

```js
kabu.view('menu', ['el'], function (el) {
  console.log(el);
});

kabu.init();
```

When `kabu.init` is execute find all the html elements with the attribute 'view' and execute its functions.

```html
<div view="menu, head">
...
</div>
```

You can add multiples views.

## Services

You can create services that can be injected in views or other services.

```js
kabu.service('translation', [], function() {

   return {
       get: function(str) {
           ...
       }
   }
});

kabu.view('menu', ['el', 'translation'], function (el, translation) {
  var str = translation.get('menu');

  el.textContent = str;
});
```

## Execute functions before views initialization

```js
kabu.configure.addConfiguration(function() {
  console.log("before init");
});
```

## Execute functions after views initialization

```js
kabu.load.onLoad(function() {
  console.log("all views loaded");
});
```

## Compile everything

For example when you insert new html code

```js
  parent.appendChild(el);

  kabu.compile(el);
```