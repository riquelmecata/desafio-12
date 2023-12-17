import EErrors from "../../services/errors/enum.js";


export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({ status: "error", error: error.name });
            break;
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "error", error: "Routing error occurred" });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "error", error: "Database error occurred" });
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" });
    }
};

