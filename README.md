# Survey-POC
Code repository for creating a node survey poc

Project Goals:
1. Create a light version of a predefined feature-set to illustrate what a survey overhaul could look like.
2. Visual appeal and ease of use are very important

# Running the Code
First start Redis and MongoDB on the default ports, in separate terminals.

```$ mongod

```$ redis-server

Launch SurveyEngine, then WebSurvey in separate terminals using ` npm start `.

Seed your database/cache with: `GET http://localhost:2020/seedSurveys`.