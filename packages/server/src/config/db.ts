import mongoose from 'mongoose';

const mongoURI: string = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-zmcyw.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;

const db = () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(result => {
      console.log('Running');
    })
    .catch(err => console.log(err));
};
export { mongoURI };
export default db;
