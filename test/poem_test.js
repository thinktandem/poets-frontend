Feature("Poem").retry(20);
Before(I => {
 I.amOnPage("/poem/disposed");
});
Scenario("Poem is available on individual poem page", I => {
 I.see("Disposed");
});
Scenario("Poem a day signup shows up on poem page", I => {
 I.see("sign up for poem-a-day");
});
Scenario("More by Poet is available on poem page", I => {
 I.see("More by Khadijah Queen");
});
Scenario("Related poems are available on poem page", I => {
 I.see("Related Poems");
});
