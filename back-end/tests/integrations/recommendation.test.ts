import { Recommendation } from "@prisma/client";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createRecommendation } from "../factories/recommendationFactory";

/*beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
})*/

afterAll(async () => {
    await prisma.$disconnect()
})

describe('Tests POST /recommendations ', () => {

    it('Tests create new recommendation, expect status 201', async () => {
        const body = await createRecommendation();

        const result = await supertest(app).post('/recommendations').send(body);

        expect(result.status).toBe(201);
    });

    it('Tests create new recommendation, name already exists, expect status 409', async () => {
        const body = await createRecommendation();

        await supertest(app).post('/recommendations').send(body);
        const result = await supertest(app).post('/recommendations').send(body);

        expect(result.status).toBe(409);
    });

});

describe('Tests POST /recommendations/:id/upvote ', () => {

    it('Tests add point to recommendation, expect status 200', async () => {
        const body = await createRecommendation();

        const recommendation = await supertest(app).post('/recommendations').send(body);

        const toBeVoted = await prisma.recommendation.findMany({
            where: { id: recommendation.body.id }
        })

        const result = await supertest(app).post(`/recommendations/${toBeVoted[0].id}/upvote`).send();

        expect(result.status).toBe(200);
    });

});

describe('Tests POST /recommendations/:id/downvote ', () => {

    it('Tests subtract point to recommendation, expect status 200', async () => {
        const body = await createRecommendation();

        const recommendation = await supertest(app).post('/recommendations').send(body);

        const toBeDownvoted = await prisma.recommendation.findMany({
            where: { name: recommendation.body.name }
        })

        const result = await supertest(app).post(`/recommendations/${toBeDownvoted[0].id}/downvote`).send();

        expect(result.status).toBe(200);
    });

});

describe('GET /recommendations', () => {

    it('Tests get recommendation, expect response body not null', async () => {
        const body = await createRecommendation();

        await supertest(app).post('/recommendations').send(body);
        const result = await supertest(app).get('/recommendations').send();

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
    });

});

describe('GET /recommendations/:id', () => {

    it('Tests get recommendation, expect response body not null', async () => {
        const body = await createRecommendation();

        const recommendationDb = await supertest(app).post('/recommendations').send(body);

        const recommendation = await prisma.recommendation.findMany({
            where: { name: recommendationDb.body.name }
        })

        const result = await supertest(app).get(`/recommendations/${recommendation[0].id}`).send();

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            id: recommendation[0].id,
            name: recommendation[0].name,
            youtubeLink: recommendation[0].youtubeLink,
            score: recommendation[0].score
        })
    });

});

describe('GET /recommendations/random', () => {

    it('Tests get random recommendation, expect response body not null', async () => {
        const result = await supertest(app).get('/recommendations/random').send();

        expect(result.status).toBe(200)
        expect(result.body).not.toBeUndefined()
    });

});

describe('GET /recommendations/top/:amount', () => {

    it('Tests get X recommendation, according with param amount, expect response body not null', async () => {
        const result = await supertest(app).get("/recommendations/top/2")

        expect(result.status).toBe(200)
        expect(result.body.length).toBe(2)
        expect(result.body[0].score).toBeGreaterThan(result.body[1].score)
    });

});