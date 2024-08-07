// Server code 
import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import myUserRoute from "./routes/MyUserRoute";

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(()=> console.log('Connected to MongoDB!'));


const app = express();
app.use(express.json());
app.use(cors());


app.get("/health", async(req:Request, res:Response) => {
    res.send({message: "Health OK!"});
});
app.use("/api/my/user", myUserRoute);

// GPT Changes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        console.error('JWT verification error:', err);
        res.status(401).send('Invalid token');
    } else {
        next(err);
    }
});


//End





app.listen(7000, () => {
    console.log("server started on  localhost: 7000");
});