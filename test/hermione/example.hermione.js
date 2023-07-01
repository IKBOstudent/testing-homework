const { assert } = require("chai");

describe("store tests 0", async function () {
    it("Тест 0 navbar", async function () {
        await this.browser.url("http://localhost:3000/hw/store");
        await this.browser.assertView("test0", ".navbar");
    });
});
