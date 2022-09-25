import { recommendationService } from "../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { createRecommendation } from "../factories/recommendationFactory";
jest.mock("../../src/repositories/recommendationRepository");

describe('Tests recommendation service', () => {

    it('Tests insert function', async () => {
        const recommendation = await createRecommendation();

        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it.todo('Tests upvote function');

    it.todo('Tests downvote function');

    it.todo('Tests getByIdOrFail function');

    it.todo('Tests get function');

    it.todo('Tests getTop function');

    it.todo('Tests getRandom function');

    it.todo('Tests getByScore function');

    it.todo('Tests getScoreFilter function');

});