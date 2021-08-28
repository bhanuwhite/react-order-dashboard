# Extensions to ECMAScript built-ins

This folder contains custom extensions to ECMAScript classes
None of those helpers needs to be imported directly.

What we do here is considered a bad practice in general
because we polute the global namespace and could collision
with older libraries that do the same thing.

However:

 * This is an application not a library, so only our code
   is impacted by this change, nothing else.

 * This improve the discoverability of common idioms and
   should reduce code duplication. It's also a bit more
   convenient to use when working with arrays