mocha.setup("bdd");

describe("sum", function () {
  it("should return sum of arguments", function () {
    console.log("run test");
    chai.expect(testSum(1, 2)).to.equal(3);
  });
});
