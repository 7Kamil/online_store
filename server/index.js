const express = require( 'express' );
require( 'dotenv' ).config();
const sequilize = require( './db' );
const models = require( './models/models' );
const cors = require( 'cors' );
const router = require( './routes/index' );
const errorHandler = require( './middleware/ErrorHandlingMiddleware' );
const fileUpload = require( 'express-fileupload' );
const path = require( 'path' );

const port = process.env.PORT || 7000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static( path.resolve( __dirname, 'static' )));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Working'});
});
const start = async () => {
    try {
        await sequilize.authenticate();
        await sequilize.sync();
        app.listen(port, () => console.log( `Server started on port ${port}` ));
    } catch (e) {
        console.log(e);
    }
}

start()