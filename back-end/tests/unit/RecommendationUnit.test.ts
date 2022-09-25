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

        expect(recommendationRepository.findByName).toBeCalled();
    });

    it('Tests upvote function', async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => recommendationCreated);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { return { ...recommendationCreated, score: recommendationCreated.score - 1 } });

        const result = await recommendationService.upvote(recommendationCreated.id);

        expect(result).toBe(undefined);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Tests upvote an invalid recommendation", async () => {
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => { });

        expect(recommendationService.upvote(1)).rejects.toEqual({
            message: '',
            type: 'not_found',
        });
    });

    it('Tests downvote function', async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => recommendationCreated);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { return { ...recommendationCreated, score: recommendationCreated.score - 1 } });

        const result = await recommendationService.downvote(recommendationCreated.id);

        expect(result).toBe(undefined);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Tests downvote an invalid recommendation", async () => {
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => { });

        expect(recommendationService.downvote(1)).rejects.toEqual({
            message: '',
            type: 'not_found',
        });
    });

    it("try to downvote and remove a recommendation", async () => {
        recommendationCreated.score = -6;

        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => recommendationCreated);
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => recommendationCreated);
        jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => { });

        const result = await recommendationService.downvote(recommendationCreated.id);

        expect(result).toBeUndefined();
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });

    it('Tests getByIdOrFail function', async () => {
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any => { });

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