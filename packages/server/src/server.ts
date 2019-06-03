import mongoose from 'mongoose';
import app from './app';
const databaseName =
  process.env.NODE_ENV === 'testing'
    ? `test${process.env.MONGO_DATABASE}`
    : process.env.MONGO_DATABASE;
const mongoURI: string = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-zmcyw.mongodb.net/${databaseName}?retryWrites=true`;

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(result => {
    console.log('Running');
    app.listen(8080);
  })
  .catch(err => console.log(err));
