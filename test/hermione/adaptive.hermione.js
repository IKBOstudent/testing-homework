const pageWidth = { mobile: 575, small: 767, large: 991, desktop: 1199 };

describe("Гамбургер меню", async function () {
    it("появляется при ширине меньше 576px и закрывается при выборе варианта", async function () {
        await this.browser.setWindowSize(pageWidth.mobile, 1080);
        await this.browser.url(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
        await this.browser.assertView(`menu-before`, ".navbar");

        const menu = await this.browser.$(".navbar-toggler");
        await menu.click();
        await this.browser.assertView(`menu-open`, ".navbar");

        const menuItem = await this.browser.$(".nav-link");
        await menuItem.click();
        await this.browser.assertView(`menu-after`, ".navbar");
    });
});

describe("Страница доставки", async function () {
    it("статическая и адаптируется под ралзичные разрешения", async function () {
        for (let width in pageWidth) {
            await this.browser.setWindowSize(pageWidth[width], 1080);
            await this.browser.url(
                `http://localhost:3000/hw/store/delivery?bug_id=${process.env.BUG_ID}`,
            );
            await this.browser.assertView(`delivery-${width}`, "body", {
                ignoreElements: [".navbar"],
            });
        }
    });
});

describe("Страница контактов", async function () {
    it("статическая и адаптируется под различные разрешения", async function () {
        for (let width in pageWidth) {
            await this.browser.setWindowSize(pageWidth[width], 1080);
            await this.browser.url(
                `http://localhost:3000/hw/store/contacts?bug_id=${process.env.BUG_ID}`,
            );
            await this.browser.assertView(`contacts-${width}`, "body", {
                ignoreElements: [".navbar"],
            });
        }
    });
});

describe("Страница главная", async function () {
    it("статическая и адаптируется под разичные разрешения", async function () {
        for (let width in pageWidth) {
            await this.browser.setWindowSize(pageWidth[width], 1080);
            await this.browser.url(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
            await this.browser.assertView(`home-${width}`, "body", {
                ignoreElements: [".navbar"],
            });
        }
    });
});
