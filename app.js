const express = require('express');

const app = express();

//middlewares
app.use(express.json());


app.get('/', (req, res, next) => {
    try {
        res.json(':)')
    } catch (error) {
        next(error);
    }
})

//404 no resource error handler
app.use((req, res, next)=>{
    try {
        res.status(404);
        throw new Error('No resource found');
    } catch (error) {
        next(error);
    }
})

//error handling middleware
app.use((err, req, res, next)=> {
    res.json({
        message: err.message,
        status: res.status,
        stack: err.stack
    })
})


const port = process.env.PORT;

app.listen(port, () => console.log('listening on port: ', port));
