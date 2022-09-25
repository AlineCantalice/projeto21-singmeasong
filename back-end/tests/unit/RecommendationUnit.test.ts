import { recommendationService } from "../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { createRecommendation } from "../factories/recommendationFactory";
import { Recommendation } from "@prisma/client";
jest.mock("../../src/repositories/recommendationRepository");

describe('Tests recommendation service', () => {

    const recommendation = createRecommendation();
    const recommendationCreated = { ...recommendation, score: -4, id: 200 } as Recommendation;

    it('Tests insert function', async () => {
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it("Tests insert a recommendation that already exists", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => recommendation);

        expect(recommendationService.insert(recommendation)).rejects.toEqual({
            message: 'Recommendations names must be unique',
            type: 'conflict'
        });
    });

    it.todo('Tests upvote function');

    it.todo('Tests downvote function');

    it('Tests getByIdOrFail function', async () => {
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any => {});

        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => recommendationCreated);

        const result = await recommendationService.getById(recommendationCreated.id);
        expect(result).toEqual(recommendationCreated);
    });

    it.todo('Tests get function');

    it.todo('Tests getTop function');

    it.todo('Tests getRandom function');

    it.todo('Tests getByScore function');

    it.todo('Tests getScoreFilter function');

});