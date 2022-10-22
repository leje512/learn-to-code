<svelte:head>
  <link href="../node_modules/mocha/mocha.css" rel="stylesheet" />
</svelte:head>

<div id="mocha-wrapper">
  <div id="mocha" />
  <!-- src="https://unpkg.com/chai@4.3.6/chai.js"></script-->
  <script src="../node_modules/mocha/mocha.js"></script>
  <!--script type="module" src="../test/example.test.js"></script-->
  <script>
    window.onload = () => {
      // mocha.setup();
      console.log("mocha run");

      // load tests after mocha setup
      const scriptElement = document.createElement("script");
      scriptElement.src = "../test/example.test.js";
      document.getElementById("mocha-wrapper").appendChild(scriptElement);

      console.log(scriptElement);

      mocha.checkLeaks();
      mocha.run();
      console.log("ran?");
    };
  </script>
</div>
