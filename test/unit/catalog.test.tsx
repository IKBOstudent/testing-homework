import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as reactRedux from "react-redux";
import * as reactRouter from "react-router";
import { MemoryRouter } from "react-router-dom";
import { Catalog } from "../../src/client/pages/Catalog";
import { Product } from "../../src/client/pages/Product";
import { CartItem, ProductShortInfo, type Product as TProduct } from "../../src/common/types";
import { ApplicationState } from "../../src/client/store";
import { CartBadge } from "../../src/client/components/CartBadge";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: jest.fn(),
}));

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

const mockProducts: Record<number, TProduct> = {
    1122: {
        id: 1122,
        name: "product 1122",
        price: 100500,
        description: "very good tovar, brat",
        material: "steel",
        color: "gray",
    },
    1123: {
        id: 1123,
        name: "product 1123",
        price: 200600,
        description: "svezhiy tovar, brat",
        material: "wood",
        color: "green",
    },
};

const mockCart: Record<number, CartItem> = {
    1123: {
        name: "product 1123",
        price: 200600,
        count: 1,
    },
};

describe("Страница каталога", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    beforeEach(() => {
        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
    });

    it("показывает LOADING, пока нет товаров", () => {
        const state: ApplicationState = { products: undefined, details: {}, cart: {} };
        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <MemoryRouter>
                <Catalog />
            </MemoryRouter>,
        );
        // screen.debug();

        const catalogItems = screen.getByTestId("catalog-items");
        expect(catalogItems.textContent).toBe("LOADING");
    });

    it("показывает карточки товаров c названием, ценой и ссылкой на страницу с продуктом", () => {
        const state: ApplicationState = {
            products: Object.values(mockProducts).map(({ id, name, price }) => ({
                id,
                name,
                price,
            })),
            details: {},
            cart: {},
        };

        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <MemoryRouter>
                <Catalog />
            </MemoryRouter>,
        );
        // screen.debug();

        const catalogItems = screen.getByTestId("catalog-items");
        expect(catalogItems.children.length).toBe(2);

        for (let data of state.products || []) {
            const product = screen.getByTestId(data.id);
            expect(product.querySelector(".card-title")?.textContent).toBe(data.name);
            expect(product.querySelector(".card-text")?.textContent).toBe("$" + data.price);
            expect(product.querySelector(".card-link")?.getAttribute("href")).toBe(
                `/catalog/${data.id}`,
            );
        }
    });

    it("отображает сообщение 'товар в корзине'", async () => {
        const state: ApplicationState = {
            details: {},
            cart: mockCart,
        };
        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);

        render(<CartBadge id={1123} />);
        // screen.debug();

        expect(screen.getByText("Item in cart")).toBeInTheDocument();
    });
});

describe("Страница товара", () => {
    const productMockId = 1122;

    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    const useParamsMock = jest.spyOn(reactRouter, "useParams");

    beforeEach(() => {
        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
    });

    it("показывает LOADING, пока нет товара", () => {
        const state: ApplicationState = { details: {}, cart: {} };

        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        useParamsMock.mockReturnValue({ id: String(productMockId) });

        render(
            <MemoryRouter initialEntries={[`catalog/${productMockId}`]}>
                <Product />
            </MemoryRouter>,
        );
        // screen.debug();

        const productInfo = screen.queryByText("LOADING");
        expect(productInfo).not.toBeNull();
    });

    it("показывает название товара, его описание, цену, цвет, материал и кнопку 'добавить в корзину'", () => {
        const state: ApplicationState = {
            details: mockProducts,
            cart: {},
        };

        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        const paramsMock = jest.fn(() => ({ id: String(productMockId) }));
        useParamsMock.mockImplementation(paramsMock);

        render(
            <MemoryRouter initialEntries={[`catalog/${productMockId}`]}>
                <Product />
            </MemoryRouter>,
        );
        // screen.debug();

        const current = state.details[productMockId];

        expect(screen.queryByText(current.name)).not.toBeNull();
        expect(screen.queryByText(current.description)).not.toBeNull();
        expect(screen.queryByText("$" + current.price)).not.toBeNull();
        expect(screen.queryByText(current.material)).not.toBeNull();
        expect(screen.queryByText(current.color)).not.toBeNull();
        expect(screen.queryByRole("button")?.textContent).toBe("Add to Cart");
    });
});
