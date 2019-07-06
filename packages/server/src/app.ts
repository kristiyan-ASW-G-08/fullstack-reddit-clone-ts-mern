import express from 'express';
import { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { ErrorREST } from './classes/ErrorREST';
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';
import ruleRoutes from './routes/ruleRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import reportRoutes from './routes/reportRoutes';
import multer from 'multer';
const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(
  (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    next();
  },
);

const fileStorage = multer.diskStorage({
  //@ts-ignore:Problem with multer and typescript
  destination: (req: Request, file, cb): any => {
    cb(null, 'src/images');
  },
  filename: (req: Request, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
    );
  },
});

const fileFilter = (req: Request, file: any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/svg+xml'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
);
app.use('/images', express.static(path.join(__dirname, './images')));
// app.use('/assets/videos', express.static(path.join(__dirname, 'videos')));

app.use(userRoutes);
app.use(communityRoutes);
app.use(ruleRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(reportRoutes);

app.use(
  (error: ErrorREST, req: Request, res: Response, next: NextFunction): void => {
    console.log(error);
    const status = error.status || 500;
    if (error.data) {
      const { data } = error;
      res.status(status).json({ data });
    } else {
      res.status(status).json({ message: error.message });
    }
  },
);

export default app;
