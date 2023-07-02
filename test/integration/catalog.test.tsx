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
import { initStore } from "../../src/client/store";
import { Product } from "../../src/client/pages/Product";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: jest.fn(),
}));

const basename = "/hw/store";

describe("Карточка товара", () => {
    const mockId = 1123;

    const server = setupServer(
        rest.get(`${basename}/api/products/${mockId}`, (req, res, ctx) => {
            return res(ctx.json({ id: mockId, name: "product 1123", price: 10100 }));
        }),
    );

    const useParamsMock = jest.spyOn(reactRouter, "useParams");

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("если товар в корзине, показывает сообщение 'товар в корзине' при добавлении и увеличивает количество в корзине", async () => {
        useParamsMock.mockReturnValue({ id: String(mockId) });

        const api = new ExampleApi(basename);
        const cart = new CartApi();

        const store = initStore(api, cart);

        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Product />
                </Provider>
            </MemoryRouter>,
        );
        // screen.debug();

        await waitFor(() => expect(screen.getByTestId("product")).toBeInTheDocument());
        // screen.debug();

        expect(screen.queryByText("Item in cart")).toBeNull();
        expect(store.getState().cart[mockId]).toBeUndefined();

        const button = screen.getByRole("button");

        fireEvent.click(button);
        expect(store.getState().cart[mockId].count).toBe(1);
        expect(screen.queryByText("Item in cart")).toBeInTheDocument();

        fireEvent.click(button);
        expect(store.getState().cart[mockId].count).toBe(2);
        expect(screen.queryByText("Item in cart")).toBeInTheDocument();
    });
});
