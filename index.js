const express = require('express')
const app = express()
const bodyParser = require('body-parser')

require('dotenv').config()
const mongoose = require('mongoose')

const Tweet = require('./models/tweet')

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('Connected to MongoDB'))

app.use(express.static('html'))
app.use(bodyParser.json())

const getTweets = async () => {
  // todo: get all tweets
  try {
      await mongoose;
      const result = await Tweet.find({}).exec();
      // console.log(`here are all of the tweets: ${result}`);
      return result;
  } catch (e) {
    console.log(e);
  }
}

const getUserTweets = async username => {
  // todo: get all tweets from a specific user
  try {
    // await mongoose;
    // console.log('just obtained all of the tweets');
    return await Tweet.find({username: username}).exec();
  } catch (e) {
    console.log(e);
  }
}

const createTweet = async (username, text) => {
  // todo: create a tweet with a username and text
  try {
    // await mongoose;
    const tweet = new Tweet({username: username, text: text});
    tweet.save();
    // console.log('just created a tweet');
    return tweet;
  } catch (e) {
    console.log(e);
  }
}

const deleteTweet = async id => {
  // todo: delete a single tweet, given the id
  try {
    // await mongoose;
    var result = await Tweet.findByIdAndDelete(id).exec();
    console.log(`just deleted the tweets with the id ${id}`);
    return result;
  } catch (e) {
    console.log(e);
  }
}

/*
 * Tweet endpoints
 */
app.get('/api/tweet', async (req, res) => {
  const username = req.query.username
  console.log('did we get to the api/tweet GET command?');
  let tweets
  if (username === undefined)
    tweets = await getTweets()
  else
    tweets = await getUserTweets(username)
  res.json(tweets)
})

app.post('/api/tweet', async (req, res) => {
  const text = req.body.text
  const username = req.body.username
  console.log('did we get to the api/tweet POST command?');
  const tweet = await createTweet(username, text)
  res.json(tweet)
})

app.post('/api/tweet/delete', async (req, res) => {
  const id = req.body.id
  await deleteTweet(id)
  res.send()
})

app.listen(3000)
console.log('Serving running on port 3000')
