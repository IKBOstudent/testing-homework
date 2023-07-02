import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as reactRedux from "react-redux";
import * as reactRouter from "react-router";
import { MemoryRouter } from "react-router-dom";
import { Cart } from "../../src/client/pages/Cart";

import { CartItem, ProductShortInfo, type Product as TProduct } from "../../src/common/types";
import { ApplicationState } from "../../src/client/store";
import { Form } from "../../src/client/components/Form";

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("Страница корзины", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

    beforeEach(() => {
        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
    });

    it("результат заказа имеет зеленый цвет ", () => {
        const state: ApplicationState = {
            cart: {},
            details: {},
            latestOrderId: 12,
        };

        const selector = jest.fn((cb) => cb(state));
        useSelectorMock.mockImplementation(selector);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>,
        );

        expect(screen.getByText("Well done!").parentElement).toHaveClass("alert-success");
    });
});

describe("Форма заказа", () => {
    it("валидирует данные", () => {
        const onSubmit = jest.fn();
        render(
            <MemoryRouter>
                <Form onSubmit={onSubmit} />
            </MemoryRouter>,
        );

        // screen.debug();

        const inputName = screen.getByTestId("text-name");
        const inputPhone = screen.getByTestId("text-phone");
        const inputAddress = screen.getByTestId("text-address");
        fireEvent.change(inputName, { target: { value: "aaa" } });
        fireEvent.change(inputPhone, { target: { value: "9099999999" } });
        fireEvent.change(inputAddress, { target: { value: "aaa" } });
        // screen.debug();

        const button = screen.getByTestId("button-submit");
        fireEvent.click(button);

        expect(onSubmit).toBeCalledTimes(1);
    });
});
