Behance API JS Wrapper
---

A relatively simple JavaScript wrapper to get data from the [Behance API][1]

[1]: http://www.behance.net/dev/

Usage
---

Get `be.js` on your page through a module loader like [RequireJS][2], or
include it directly with a &lt;script&gt; tag. `be.js` is AMD-compatible, and will
anonymously export a module. If you are using a raw &lt;script&gt; tag, then it will
export the `be` global.

Once you have access to the export, using it is easy.

1. Set your Behance API key. You can set the key by either calling the export
   as a function or by setting a global called `behance_api_key` before
   including `be.js`

   ```javascript
   require(['be'], function(be) {
    be('BehanceApiKey');
   });
   ```

2. Make the API request. The `be` export has various functions attached to it
   in order to make the API requests for the publicly available endpoints in
   the Behance API. Every request function returns a Promises/A+ compliant
   promise. They also take a callback.

  ```javascript
   require(['be'], function(be) {
     // Using promises
     be('BehanceApiKey')
     .project.search('cats')
     .then(function success(results) {
       console.log(results);
     }, function failure(error) {
       console.error(error);
     });
   
     // Using callbacks
     be.project.search('dogs', function success(results) {
       console.log(results);
     });
   });
  ```

[2]: http://requirejs.org/docs/download.html

*Notes*

`be.js` makes use of alternate providers of JSONP implementations when
available. If RequireJS is available, it will use `require()` to perform every
JSONP call. If JQuery is available, it will use `jQuery.ajax()` with a timeout
of 7000ms. If in a WebWorker context, it will use `importScripts()`.

If none of the above are available, it will use its native JSONP implementation
using &lt;script&gt; tag injection.
