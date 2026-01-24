# TODO

It would be great to unify sync and async extractors, however, this would require to wrap source in an object with a field indicating if the source is async.

On error, should collect return an empty array or emit an error (will depend on the use case, needs to be clarified).
