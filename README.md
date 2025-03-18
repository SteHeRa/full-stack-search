# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution.
Feel free to modify the current codebase as needed, including adding or removing dependencies.
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

<!-- Write-up/conclusion section -->

_When all the behaviour is implemented, feel free to add some observations or conclusions you like to share in the section_

I'd like to start by saying I think this is a great task that you have designed and also thank you for presenting something that stands out from other technical tasks I have done.

For implementing the search I figured that having one restful endpoint that queried the database for all the desired collections would be more performant than having to make 3 separate network requests for each of the collections so I went with that approach.

The new restful endpoint `/search` accepts a query `searchTerm` that is used to generate a regular expression to search the MongoDB for matches. I had intended to add pagination to this endpoint to help limit the number of results that would come back from the search but in the interest of time I didn't.

The endpoint queries the database 3 times. Once to find `hotels` with matching hotel names OR matching chain names, once to find `cities` and once to find `countries`. When writing these queries I considered whether it would be more performant to write the query for `hotels` to also match on `city` and `country` or to write the query for `cities` and `countries` to 'include' hotels. I'm honestly not sure which approach is more performant, especially considering my implementation where I map the included hotels into the hotels response property but I was more interested in trying to use the aggregate operation with $lookup as I haven't used this with my limited experience with MongoDB and wanted to give it a try. My gut tells me this is a more performant approach, but as I've said I'm not sure.

I've used react router for routing on the front as it's a SPA router that I'm familiar with.

The api call creates a new connection with MongoDB every time it's called and closes the connection every time it resolves. If I were to spend a bit more time on this task I would change this so the server/api uses a singleton for the MongoDB client and re-uses the same connection for multiple queries or set up a connection pool to handle this.

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
