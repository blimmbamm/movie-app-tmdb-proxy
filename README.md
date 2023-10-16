I created this very simple, single-endpoint API for my movie-app project (link to be inserted here). The API basically just fowards incoming post requests to the [TMDB API](https://developer.themoviedb.org/docs) by adding my secret TMDB API key. This was necessary to keep my API key secret, since my movie app is built in frontend-only React.

The API is hosted on AWS Elastic Beanstalk.