Some of the functions like dragtask feel like the client is doing a lot of the business logic. It should just pass a few arguments to describe what happened, the server returns what updates happened, then redux toolkit query handles the update/invalidation

Go through the same thought process of whether or not you could simplify it by just doing logic on the server for every single route we have
