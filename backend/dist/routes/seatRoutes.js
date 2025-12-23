"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seatController_1 = require("../controllers/seatController");
const seatRoutes = (io) => {
    const router = (0, express_1.Router)();
    router.get("/", seatController_1.getSeats);
    router.post("/create", seatController_1.createSeats);
    router.post("/hold", (0, seatController_1.holdSeat)(io));
    router.post("/book", (0, seatController_1.bookSeat)(io));
    return router;
};
exports.default = seatRoutes;
