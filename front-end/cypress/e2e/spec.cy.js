/* eslint-disable no-undef */

const recommendation = {name: "saikai", youtubeLink: "https://youtu.be/UQYMJ-aRlHo?list=RDUQYMJ-aRlHo"}

describe('register some recommendations', () => {

  it('register a recommendation', () => {
    
    cy.visit("http://localhost:3000");
    cy.get("#name").type(recommendation.name);
    cy.get("#youtubeLink").type(recommendation.youtubeLink);
    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#submitButton").click();
    cy.wait("@postRecommendation");

    cy.contains(`${recommendation.name}`)
  });

  it("try to register a recommendation that already exists", () => {

    cy.get("#name").type(recommendation.name);
    cy.get("#youtubeLink").type(recommendation.youtubeLink);
    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#submitButton").click();
    cy.wait("@postRecommendation");

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Error creating recommendation!')
    });

  });

});

describe("tests the upvote and downvote", () => {

  it("upvotes a recommendation", () => {

    cy.get("#upArrow").click();
    cy.contains("1");

  });

  it("downvotes a recommendation", () => {

    cy.get("#downArrow").click();

    cy.contains("0");
  });

  it("downvotes until deletes a recommendation", () => {

    for (let i = 0; i < 6; i++) {
      cy.get("#downArrow").click();
    }

    cy.contains("No recommendations yet! Create your own :)");
  });

});

describe("tests header buttons", () => {
  
  it("user should see top recommendations", async () => {

    cy.visit("http://localhost:3000/")
    cy.get("#top").click()

    cy.url().should("equal", "http://localhost:3000/top")
})

it("user should be able to see random recommendations", async () => {

    cy.visit("http://localhost:3000/")
    cy.get("#random").click()

    cy.url().should("equal", "http://localhost:3000/random")
})
});