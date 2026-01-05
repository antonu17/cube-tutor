# Product requirements

1. What are you actually trying to do? What are the goal of your project?

Build a web application for people who wants to learn solving rubick's cube like puzzles and learn speedsolving algorithms effectively and visually.
Select proper tech stack for the application that it could be easily port on a mobile platform like ios or android.

Clean and simple UX where users can:

- select a puzzle
- then select a solving method (eg. beginner, cfop, roux),
- select particular phase (eg. cross, f2l, oll)
- get list of cases and algorithms for given phase
- learn an algorithm:
  - see how the case looks like when unsolved,
  - what are the algorithms available for given case
  - how does it look like in motion (small player-like control, maybe with webgl)

# What are the milestones of functionality you want?

## MVP

On the MVP phase application should provide the following core functionality

- Web UI, mostly text mode
- Single user
- User can select 3x3x3 puzzle
- See beginner and cfop solving methods
- Groups cases by category, eg. for CFOP OLL phase: dot shapes, L shapes, Bolt shapes, etc.
- See all the phases for each methods
- See the algorithms for each case of each phase

## Version 1

In version 1 application should provide the following core functionality

- improve the UI and UX
- generate simple graphics to represent pussle states
- render 2d SVG images of a puzzle state
- render 3d SVG images of a puzzle state

## Version 2

- add user accounts support
- track learning path
- generate scrambles for training specific cases

## Version 3

- initial mobile version for ios
