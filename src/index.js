const app = require('./app');

app.listen(app.get('port'), () => {
    console.log("Servidor escuchando por el puerto", app.get("port"));
});