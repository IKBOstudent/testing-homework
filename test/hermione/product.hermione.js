describe("Страница продукта", async function () {
    it("есть кнопка добавить в корзину", async function () {
        await this.browser.setWindowSize(1920, 1080);
        await this.browser.url(
            `http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`,
        );
        await this.browser.pause(3000);
        await this.browser.assertView("product-page", "body", {
            ignoreElements: [
                ".navbar",
                ".ProductDetails-Name",
                ".ProductDetails-Description",
                ".ProductDetails-Price",
                "span",
                "dl",
            ],
        });
    });
});
