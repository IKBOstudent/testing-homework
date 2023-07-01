import React from "react";

import { render } from "@testing-library/react";

describe("Simple Test Case", () => {
    it("Should return 4", () => {
        const app = React.createElement("div", { children: "text" });
        const { container } = render(app);
        expect(container.textContent).toBe("text");
    });
});
