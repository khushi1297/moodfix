const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const movies = [
  // 💕 Date Night
  { title: 'Call Me By Your Name', genre: 'Romance', mood: 'Date Night', description: 'A summer romance between a student and a scholar in 1980s Italy.', price: 10.99, year: 2017, rating: 7.9, image: 'https://image.tmdb.org/t/p/w500/naGL9BHArgDcLqkBNiaMuzMGQKK.jpg' },
  { title: 'Portrait of a Lady on Fire', genre: 'Romance', mood: 'Date Night', description: 'A painter falls for the woman whose portrait she is commissioned to paint.', price: 10.99, year: 2019, rating: 8.1, image: 'https://image.tmdb.org/t/p/w500/3NTAbAiao4JLzFsbvgiZiEmp0fH.jpg' },
  { title: 'In the Mood for Love', genre: 'Romance', mood: 'Date Night', description: 'Two neighbors suspect their spouses of having an affair.', price: 10.99, year: 2000, rating: 8.1, image: 'https://image.tmdb.org/t/p/w500/57wxH3zBDsGUWAFUiSM97qoSGCU.jpg' },
  { title: 'La La Land', genre: 'Romance', mood: 'Date Night', description: 'A jazz musician and actress fall in love in Los Angeles.', price: 11.99, year: 2016, rating: 8.0, image: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg' },
  { title: 'Titanic', genre: 'Romance', mood: 'Date Night', description: 'An epic love story aboard a doomed ship.', price: 12.99, year: 1997, rating: 7.9, image: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },

  // 🔥 Feeling Hyped
  { title: 'Fury Road', genre: 'Action', mood: 'Feeling Hyped', description: 'A breathtaking post-apocalyptic chase shot like a painting in motion.', price: 12.99, year: 2015, rating: 8.1, image: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg' },
  { title: 'Oldboy', genre: 'Thriller', mood: 'Feeling Hyped', description: 'A man imprisoned for 15 years seeks his mysterious captor.', price: 11.99, year: 2003, rating: 8.4, image: 'https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBmFx8KXUM.jpg' },
  { title: 'No Country for Old Men', genre: 'Thriller', mood: 'Feeling Hyped', description: 'A hunter stumbles upon drug money and a relentless killer follows.', price: 11.99, year: 2007, rating: 8.2, image: 'https://image.tmdb.org/t/p/w500/oVcsSd5eW7xPqUJ7MoSUmJLxFqI.jpg' },
  { title: 'Parasite', genre: 'Thriller', mood: 'Feeling Hyped', description: 'A poor family schemes to become employed by a wealthy household.', price: 12.99, year: 2019, rating: 8.5, image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
  { title: 'The Dark Knight', genre: 'Action', mood: 'Feeling Hyped', description: 'Batman faces the Joker in a visually stunning battle for Gotham.', price: 12.99, year: 2008, rating: 9.0, image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },

  // 😂 Need a Laugh
  { title: 'The Grand Budapest Hotel', genre: 'Comedy', mood: 'Need a Laugh', description: 'A legendary concierge and his protege get caught up in a murder mystery.', price: 9.99, year: 2014, rating: 8.1, image: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg' },
  { title: 'Knives Out', genre: 'Comedy', mood: 'Need a Laugh', description: 'A detective investigates the death of a wealthy crime novelist.', price: 10.99, year: 2019, rating: 7.9, image: 'https://image.tmdb.org/t/p/w500/pThyQovXQrpS2xlgux1Nzu0fMop.jpg' },
  { title: 'The Nice Guys', genre: 'Comedy', mood: 'Need a Laugh', description: 'A mismatched pair investigate a missing girl in 1970s LA.', price: 9.99, year: 2016, rating: 7.4, image: 'https://image.tmdb.org/t/p/w500/APvB9RBHCNapPkMGUGhIqiMf7QD.jpg' },
  { title: 'Burn After Reading', genre: 'Comedy', mood: 'Need a Laugh', description: 'A CIA memoir falls into the hands of two gym employees.', price: 9.99, year: 2008, rating: 7.0, image: 'https://image.tmdb.org/t/p/w500/uJoMqH604fBIAGPbKxuCzUAMsaL.jpg' },
  { title: 'The Hangover', genre: 'Comedy', mood: 'Need a Laugh', description: 'Three groomsmen wake up in Vegas with no memory of the night before.', price: 9.99, year: 2009, rating: 7.7, image: 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg' },

  // 😱 Scare Me
  { title: 'Midsommar', genre: 'Horror', mood: 'Scare Me', description: 'A couple travels to Sweden for a festival that takes a sinister turn.', price: 11.99, year: 2019, rating: 7.1, image: 'https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg' },
  { title: 'Hereditary', genre: 'Horror', mood: 'Scare Me', description: 'A family unravels dark secrets after a tragedy.', price: 10.99, year: 2018, rating: 7.3, image: 'https://image.tmdb.org/t/p/w500/4O3vP0oHxSoMJTPoGKLbz6YXz8Y.jpg' },
  { title: 'The Witch', genre: 'Horror', mood: 'Scare Me', description: 'A Puritan family encounters evil forces in 1630s New England.', price: 10.99, year: 2015, rating: 6.9, image: 'https://image.tmdb.org/t/p/w500/zap5NpuPNQSMDGHPbMDOAIb8RBR.jpg' },
  { title: 'Get Out', genre: 'Horror', mood: 'Scare Me', description: 'A man uncovers something unsettling on a visit to his girlfriends family.', price: 10.99, year: 2017, rating: 7.7, image: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg' },
  { title: 'A Quiet Place', genre: 'Horror', mood: 'Scare Me', description: 'A family must live in near silence while hunted by creatures that hunt by sound.', price: 11.99, year: 2018, rating: 7.5, image: 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg' },

  // 🌙 3AM Vibes
  { title: 'Blade Runner 2049', genre: 'Sci-Fi', mood: '3AM Vibes', description: 'A blade runner uncovers a long-buried secret that threatens civilization.', price: 12.99, year: 2017, rating: 8.0, image: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
  { title: 'Under the Skin', genre: 'Sci-Fi', mood: '3AM Vibes', description: 'An alien seductress preys on men in Scotland.', price: 10.99, year: 2013, rating: 6.3, image: 'https://image.tmdb.org/t/p/w500/lGKCMbkSIjHaWgYJFZXaFl2tBmX.jpg' },
  { title: 'Annihilation', genre: 'Sci-Fi', mood: '3AM Vibes', description: 'A biologist enters a mysterious quarantined zone full of mutations.', price: 10.99, year: 2018, rating: 6.9, image: 'https://image.tmdb.org/t/p/w500/an9OHxR4zSl9AGfh1Jn2pT4KKGq.jpg' },
  { title: 'Mulholland Drive', genre: 'Mystery', mood: '3AM Vibes', description: 'An amnesiac woman and an aspiring actress investigate a Hollywood mystery.', price: 11.99, year: 2001, rating: 7.9, image: 'https://image.tmdb.org/t/p/w500/kXRlGAKzW7f4C8BVKBXnmj0PQXF.jpg' },
  { title: 'Interstellar', genre: 'Sci-Fi', mood: '3AM Vibes', description: 'Astronauts travel through a wormhole to find a new home for humanity.', price: 12.99, year: 2014, rating: 8.6, image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },

  // 😢 Feeling Sad
  { title: 'Requiem for a Dream', genre: 'Drama', mood: 'Feeling Sad', description: 'Four people in New York City spiral into addiction and broken dreams.', price: 11.99, year: 2000, rating: 8.3, image: 'https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg' },
  { title: 'Manchester by the Sea', genre: 'Drama', mood: 'Feeling Sad', description: 'A man returns to his hometown after his brother dies.', price: 10.99, year: 2016, rating: 7.8, image: 'https://image.tmdb.org/t/p/w500/2LJMRAbMOkBSJlAaEbGqNvBrxGN.jpg' },
  { title: 'The Tree of Life', genre: 'Drama', mood: 'Feeling Sad', description: 'A family in 1950s Texas grapples with loss and the meaning of existence.', price: 10.99, year: 2011, rating: 6.8, image: 'https://image.tmdb.org/t/p/w500/Artt9sHBgmVSGBrpabzJNbWQUdZ.jpg' },
  { title: 'Moonlight', genre: 'Drama', mood: 'Feeling Sad', description: 'A young man struggles with identity and sexuality in Miami.', price: 10.99, year: 2016, rating: 7.4, image: 'https://image.tmdb.org/t/p/w500/4911T5FbJ9eAlnGLno0AnJVrFbm.jpg' },
  { title: 'Schindlers List', genre: 'Drama', mood: 'Feeling Sad', description: 'A businessman saves over a thousand Jewish lives during the Holocaust.', price: 11.99, year: 1993, rating: 9.0, image: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log('🎬 Movies seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });