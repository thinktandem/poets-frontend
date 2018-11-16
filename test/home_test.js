Feature("Home");

Scenario("Ad section is available on homepage", I => {
  I.amOnPage("/");
  I.seeElement(".promo__image");
});

Scenario("Poem-a-day is available on homepage", I => {
  I.amOnPage("/");
  I.seeElement(".poem-a-day-container");
})
