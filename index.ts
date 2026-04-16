import Koa from "koa"; 
import Router, { RouterContext } from "koa-router";
import logger from "koa-logger"; 
import json from "koa-json";
import cors from '@koa/cors';
import serve from "koa-static";
import mount from "koa-mount";
import path from "path";

import { router as articles } from "./routes/articles"; 
import { router as users } from "./routes/users"; 
import { router as special } from "./routes/special";

const app: Koa = new Koa(); 
const router: Router = new Router(); 

const welcomeAPI = async (ctx: RouterContext, next: any) => {
    ctx.body = { message: "Welcome to the blog API!" }; 
    await next(); 
} 

router.get('/api/v1', welcomeAPI); 

app.use(logger()); 
app.use(json()); 
app.use(cors());
app.use(mount('/docs', serve(path.resolve(process.cwd(), "docs"))));
app.use(router.routes());

app.use(articles.routes()); 
app.use(users.routes()); 
app.use(special.routes());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    await next();
    if (ctx.status === 404 && !ctx.body) {
        ctx.body = { error: "Route not found" };
    }
});

app.listen(10888, () => {
    console.log("Server is running on port 10888"); 
});