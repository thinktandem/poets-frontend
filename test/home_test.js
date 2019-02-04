Feature("Home").retry(20);

Before(I => {
  I.amOnPage("/");
});

Scenario("Ad section is available on homepage", I => {
  I.seeElement(".promo");
});

Scenario("Poem-a-day is available on homepage", I => {
  I.seeElement(".daily-poem");
});

Scenario("Donate button is available on homepage", I => {
  I.see("Donate");
});

Scenario("Featured Poems are available on homepage", I => {
  I.seeElement(".featured-poems");
});
Scenario("Featured Product is available on homepage", I => {
  I.seeElement(".product-feature");
});
