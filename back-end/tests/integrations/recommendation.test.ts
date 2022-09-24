import { Recommendation } from "@prisma/client";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createRecommendation } from "../factories/recommendationFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
})

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

        const voted = await prisma.recommendation.findMany({
            where: { id: recommendation.body.id }
        })

        expect(result.status).toBe(200);
        expect(voted[0].score).toBe(++toBeVoted[0].score);
    });

});

describe('Tests POST /recommendations/:id/downvote ', () => {

    it('Tests subtract point to recommendation, expect status 200', async () => {
        const body = await createRecommendation();

        const recommendation = await supertest(app).post('/recommendations').send(body);

        const toBeDownvoted = await prisma.recommendation.findMany({
            where: { id: recommendation.body.id }
        })

        const result = await supertest(app).post(`/recommendations/${toBeDownvoted[0].id}/downvote`).send();

        const downvoted = await prisma.recommendation.findMany({
            where: { id: recommendation.body.id }
        })

        expect(result.status).toBe(200);
        expect(downvoted[0].score).toBe(--toBeDownvoted[0].score);
    });

    it.todo('Tests subtract point to recommendation, recommendation less than -5 is removed, expect status 200');

    it.todo('Tests subtract point to recommendation, id not found, expect status 404');

    it.todo('Tests subtract point to recommendation, param not informed, expect status 404');

});

describe('GET /recommendations', () => {

    it.todo('Tests get recommendation, expect response body not null');

});

describe('GET /recommendations/:id', () => {

    it.todo('Tests get recommendation, expect response body not null');

    it.todo('Tests get recommendation, id not found, expect status 404');

    it.todo('Tests get recommendation, param not informed, expect status 404');

});

describe('GET /recommendations/random', () => {

    it.todo('Tests get random recommendation, expect response body not null');

});

describe('GET /recommendations/top/:amount', () => {

    it.todo('Tests get X recommendation, according with param amount, expect response body not null');

});