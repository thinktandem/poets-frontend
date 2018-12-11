Feature("Poem");
Before(I => {
  I.amOnPage("/poetsorg/poem/postcard-christ-carrying-cross");
});
Scenario("Poem is available on individual poem page", I => {
  I.see("A Postcard of Christ Carrying the Cross,");
});
Scenario("Poem a day signup shows up on poem pages", I => {
  I.see('sign up for poem-a-day');
})
