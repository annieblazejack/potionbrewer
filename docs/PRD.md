PRD

We are creating an art website in which users can combine potion ingredients to create a potion recipe.

It should be a NextJS application, with a server for storing secrets
The root page should have a field of small pictures of the potion ingredients scattered randomly across the field
The field should be larger than the screen, with a wrapping left-right scroll.
The potion ingredient images should all be in one directory called ‘Potion_Ingredients’
The user should be able to drag the images into a collection of slots
There should be 6 slots
There should be a button at the bottom of the page that says ‘BREW’
If there is are at least two ingredients in the slots, a user can click on the brew button
When the user clicks ‘BREW’, the server makes a request to OpenAI
An example request is in Section B.
The LLM receives a potion recipe that includes Ingredients, Instruction, Potion Effects and Side Effects, and Warnings
The app should format this request into a witchy style before presenting it to the user
An example potion recipe is in Section C.
There should be a ‘SHARE’ button at the bottom of the potion recipe.
The user should be able to get a persistent link to the potion recipe which is stored in query parameters.
The query parameters should be obfuscated.
