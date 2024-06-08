## Building & running the app in Docker:
1) Sign in or create an [OpenAI account](https://platform.openai.com/)
2) [Generate an API key](https://platform.openai.com/api-keys) and copy it to your clipboard
3) Paste the API key into the `OPENAI_API_KEY` environment variable value in the `.env` file in `./backend` directory: 
```
OPENAI_API_KEY="<your_openai_api_key>"
```
5) Purchase tokens in your OpenAI account

6) If you don't already have it, [download](https://www.docker.com/products/docker-desktop/) and run Docker Desktop

7) Within the root directory, build and run the app (this may take a couple minutes):
```
docker-compose up --build
```
Navigate to [localhost:3000](http://localhost:3000/) in a browser (preferrably Chrome) to use the tool.

To stop the app, `ctrl+c` in terminal window in which the program is running, use stop button in Docker Desktop app, or `docker-compose down`

#### Tearing down the Docker runtime:
```
docker-compose down --rmi all
docker rmi backend:latest frontend:latest
```

## Building & running the app without Docker:
*NOTE: there may be machine architecture differences that require some debugging with this method*
1) `cd backend`
2) `pip install -r requirements.txt`
3) `python main.py`
4) create a new terminal (command line) window
5) `cd frontend`
6) `npm install`
7) `npm update`
8) `npm install -g serve`
9) `npm install -D tailwindcss postcss autoprefixer`
10) `npx tailwindcss init -p`
11) `npm run dev`
12) navigate to [localhost:3000](http://localhost:3000) in a browser application (Chrome preferred)
*NOTE: I arbitrarily chose port localhost:3000 as the frontend localhost:8000 as the backend*

#### Additional notes:
* You can view and adjust the chatbot setup in the [OpenAPI assistants playground](https://platform.openai.com/assistants).
* To instantiate a new chat assistant based on the prompting instructions in the codebase, you can reset the `OPENAI_ASSISTANT_ID` environment variable in the `/chat_prototype_app/backend` directory to an empty string.
* Each run of the app that contains a conversation with the chatbot will write to a new chatlog file in the `/chat_prototype_app/backend/chat_histories` directory. This make create a lot of files, so consider deleting them if they begin to accumulate.
* There are different & simpler networks in the `/backend/app/main/app.py` file. You can uncomment the network that you want to play around with.
* sometimes there are dangling Docker images that you can clean up with `docker image prune -f
`

---
#### Errors when executing:
1) try refreshing the webpage
2) if that doesn't resolve the error (can also do these steps in Docker Desktop):
    a. stop the Docker container (if running) `docker stop <container_name_or_id>`
    b. delete the Docker container `docker rm <container_name_or_id>`
    c. delete the Docker images created by the docker-compose.yaml `docker-compose down --rmi all`
    d. re-build and run the app `docker-compose up --build`
3) if that fails then look at the error message being displayed in the terminal & debug :'(