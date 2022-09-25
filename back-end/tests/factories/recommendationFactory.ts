import { faker } from '@faker-js/faker';

export function createRecommendation() {
    const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: "https://youtu.be/UQYMJ-aRlHo?list=RDUQYMJ-aRlHo"
    }

    return recommendation;
}