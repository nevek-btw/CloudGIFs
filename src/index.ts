import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import indexRouter from './routes/index';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

mongoose.connect(process.env.MONGO)
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to database:', err);
});
