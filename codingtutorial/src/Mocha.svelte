<svelte:head>
  <link href="../node_modules/mocha/mocha.css" rel="stylesheet" />
</svelte:head>

<div id="mocha-wrapper">
  <div id="mocha" />
  <script src="../node_modules/mocha/mocha.js"></script>
  <script src="../node_modules/chai/chai.js"></script>
  <script>
    window.onload = () => {
      mocha.setup("bdd");
      mocha.checkLeaks();
      const assert = chai.assert;

      // example test -> written test should run here!
      describe("sum", function () {
        it("should return sum of arguments", function () {
          assert.equal(3, 3);
        });
      });

      mocha.checkLeaks();
      mocha.run();
    };
  </script>
</div>
