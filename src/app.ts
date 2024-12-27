
import initApp from './server';
const port = process.env.PORT;
async function app() {
    try {
        const app = await initApp();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to initialize the app:", err);
    }
}
app();
