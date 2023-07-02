import React from "react";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import * as reactRouter from "react-router";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { Catalog } from "../../src/client/pages/Catalog";
import { Provider } from "react-redux";
import { ExampleApi, CartApi } from "../../src/client/api";
import { addToCart, checkout, initStore } from "../../src/client/store";
import { Cart } from "../../src/client/pages/Cart";

const basename = "/hw/store";

describe("Страница корзины", () => {
    const mockId = 1123;

    const server = setupServer(
        rest.post(`${basename}/api/checkout`, (req, res, ctx) => {
            return res(ctx.json({ id: mockId }));
        }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("заказ успешно отправляется", async () => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();

        const store = initStore(api, cart);

        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </MemoryRouter>,
        );

        store.dispatch(
            addToCart({
                id: 1123,
                name: "product 1123",
                price: 200600,
                description: "svezhiy tovar, brat",
                material: "wood",
                color: "green",
            }),
        );

        // screen.debug();

        store.dispatch(
            checkout({ name: "aaa", phone: "9999999999", address: "aaa" }, store.getState().cart),
        );
        // screen.debug();

        await waitFor(() => expect(screen.getByTestId("cart-empty")).toBeInTheDocument());
        expect(screen.getByText("Please wait for confirmation of delivery.")).toBeInTheDocument();
    });
});
