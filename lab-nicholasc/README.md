#Lab 11

##Middleware
our middleware processes error handling in a specific and descriptive way.
## Routes
###GET
a get route to http://localhost:<PORT>/api/recipes:id will make a get request to the server for all of the recipes stored in the mongo db or if an id is provided it grabs the specific recipe with that id.
###POST
a post route to http://localhost:<PORT>/api/recipes will make a post request to the server that will store a new recipe in the mongo db
###PUT
a put route to http://localhost:<PORT>/api/recipes:id will make a put request to the server to change a recipe stored in the mongo db pertaining to the id provided
###DELETE
a delete route to http://localhost:<PORT>/api/recipes:id will make a delete request to the server to delete a recipe stored in the mongo db pertaining to the id provided
