# Movie Recommender System 🎬 
![CineCompass Logo](https://github.com/UPHSL-CCS-J3A/j3a-aiproject-bri-ish-innit/blob/a49940053b2043a19b05d03cd722b4091dc3830a/CineCompass%20Logo.png)

## Problem Description 🎯
According to Skaih in 2025, there are now recorded to be at least 698,754 published in the entire world. We live in a world full of media being released every single day, with some movies published in different studios or published in indie scenes, with different genres and different languages. There's simply too much media that one can consume, and we can get overwhelmed with the amount of choices that we can choose from.

According to Pilat and Krastev in 2024, the phenomenon of being overwhelmed by choices is called “the paradox of choices”. When the number of choices increases, so does the difficulty of knowing what is best. Instead of increasing our freedom to have what we want, the paradox of choice suggests that having too many choices actually limits our freedom. 

Major studio films dominate the film industry, making the thousands of quality independent and international films undiscovered to the masses. According to Shaw in 2023, smaller movies are struggling to attract viewers while Hollywood is cutting spending and taking fewer risks. Streaming services also worsen the problem, making their movie recommender system be based more about popularity than actual film content. Indie filmmakers must contend with big-budget productions and established franchises, which often receive preferential treatment in promotional efforts and algorithmic recommendations. As a result, indie films risk being overshadowed by high-profile releases, hindering their ability to attract viewers and gain traction on streaming platforms. (Oluchi, 2024)

With our project, **we aim to build a recommendation system that suggests movies to users based on their preferences to make the process of finding movies that you’d want to watch simpler.** 

## PEAS Model

![PEAS Model](https://github.com/UPHSL-CCS-J3A/j3a-aiproject-bri-ish-innit/blob/cbe21afff28a4a28a84055eead81e63daefa076e/CineCompass%20PEAS%20Model.png)

### 1. PERFORMANCE:
- **How accurate the recommended movies are**
    - Measures how accurate the system will predict what users will like.
    - Ensures users will see movies that the system thinks they are likely to enjoy
- **Diversity of movies that are available**
    - The system will recommend a wide range of movie genres.
    - Prevents redundancies
- **Filtering of movies**
    - The system can also recommend filtered movies based on the user’s specified preferences.

- **User History/Logging**
    - Record what the user has watched
    - Keeps track of what the user will watch in the future

### 2. ENVIRONMENT:
- User profiles, preferences, watch history
    - The program will use the preferences of the user, along with their watch history, to determine what movies to recommend.
- User’s actual device
    - Whether or not the user is using the program through a phone or a device, the program will still work as needed.
- List of movies including genre, length, ratings, etc.
    - Database containing the actual movies to recommend, along with their relevant data (respective genre, length, ratings, watch count, etc.).

### 3. ACTUATORS:
- Updating the recommendation list in real time
    - Occurs after every movie watched, based on the data of the movie that was recently viewed (genre, release year, etc.) to update the list of recommendations according to the user’s preferences.
- User Interface
    - Displays recommendations, personalized lists, and trending movies.
- Notifications
    - Push notifications, emails, and alerts for new content.
- Profile Updates
    - Modifies user profile/preferences for future recommendations.

### 4. SENSORS:
- Movie Data
    - From the movie’s genre, release year, etc.
    - To match the movie’s with the user’s specified preferences.
- User Information 
    - From the user’s actions like what type of movie they watch, how they rated the movie, their age, what language they prefer to listen to, and more. 
    - Helps the system understand what the user likes and dislikes, improving personalized recommendations. 
- System Feedback
    - From how the user rated the movies that were recommended to them by the system.
    - Allows for constant improvement of recommendations over time.

## References 📑

```
Oluchi. (2024). The Impact of Streaming Platforms on the Indie Film Industry. Prazzleinc. Retrieved from https://www.prazzleinc.com/editorial/the-imp act-of-streaming-platforms-on-the-indie-film-industry
Pilat, D., Krastev, S. (2024). The Paradox of Choice. The Decision Lab. Retrieved from https://thedecisionlab.com/reference-guide/economics/the-paradox-of-choice
Shaikh, E. (2025). How Many Movies Are There [2025 Global Data]. SimpleBeen. Retrieved from https://simplebeen.com/how-many-movies-are-there/
Shaw, L. (2023). Indie Films Are the Latest Casualty of the Streaming Wars. Bloomberg. Retrieved from https://www.bloomberg.com/news/newsletters/2023-06- 04/indie-films-are-the-latest-casualty-of-the-streaming-wars
```

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21283204&assignment_repo_type=AssignmentRepo)
