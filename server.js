const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let posts = [
    { "content": "Стандартный пост для демонстрации", "id": 26, "created": 1671708827117 },
    { "content": "Еще один стандартный пост для демонстрации", "id": 28, "created": 1671710576445 }];
let nextId = 4;

const router = new Router();

router.get('/posts', async (ctx, next) => {
    ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
    const { id, content } = JSON.parse(ctx.request.body);
    if (id !== 0) {
        posts = posts.map(o => o.id !== id ? o : { ...o, content: content });
        ctx.response.status = 204;
        return;
    }

    posts.push({ content: content, id: nextId++, created: Date.now() });
    ctx.response.status = 204;
});

router.delete('/posts/:id', async (ctx, next) => {
    const postId = Number(ctx.params.id);
    const index = posts.findIndex(o => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => {
    console.log(`server started http://localhost:${port}`)
});