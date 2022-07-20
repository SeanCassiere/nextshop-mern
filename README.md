# Nextshop

This project was build following Brad Traversy's [MERN stack online course](https://udemy.com/course/mern-ecommerce/). Originally, the app was written entirely in Javascript, with the backend using NodeJS and the frontend using React (initialized by create-react-app).

## So what's going on?

Since then, I've fallen in love with Typescript ❤️, and as such the following changes have been applied to the original tutorial project since.

- backend migrated to typescript.
- frontend migrated to typescript + vite, and redesigned with tailwindcss.
- project restructured to have `package.json` for each component in separate folders.
- added Stripe checkout as a payment option.

This, is a screenshot of the original design...

![Original frontend design](https://raw.github.com/SeanCassiere/nextshop-mern/main/images/original-nextshop-frontend-design.png)

...and, this is a screenshot of the new design.

![New frontend design](https://raw.github.com/SeanCassiere/nextshop-mern/main/images/redesigned-nextshop-design.png)

## What lies ahead?

For the time-being, I'm fixing any bugs or whatnot that may pop up.

As this was one of my first React and Node projects, I was quite inexperienced in web development and it really shows if you go back through the commit log 😭. I've since formed stronger opinions on my preferences and style of development.

...and as such, I've realized that I am quite fond of using Typescript and building solutions which let me easily get my `@types` shared and more easily accessible between server and client (for development).

**Sooooooooo**, this project likely will not see any more active development other than fixing bugs as previously mentioned and adding any documentation or safe guards to help me should I ever decide want run it locally ever again.

**Should I ever feel like modernizing this project?** It will likely not be in this repository, where I'd rather init a new project sharing the same Nextshop name. I may even migrate this app to use something like Next.js or even a more fully fledged starter such as [create-t3-app](https://create.t3.gg/).
